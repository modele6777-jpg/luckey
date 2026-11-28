import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis';
import { assertSajuClock } from '../src/lib/sajuInput';
import type { UserProfile } from '../src/lib/sharedState';
import {
  buildSajuChatGuidance,
  buildSajuConsultationSystemPrompt,
  buildSajuConsultationUserMessage,
  buildSajuStructuredFallbackAnswer,
  buildTarotInterpretationGuidance,
  inferSajuConsultationTopic,
  isSajuConsultationRequest,
} from '../src/lib/divination/consultationGuidance';
import {
  analyzeTarotConcern,
  buildLocalTarotReading,
  buildTarotBinaryChoicePromptAddon,
  extractTarotSymbolicDirection,
} from '../src/lib/trinity/utils';

test('Saju topic selection detects personality, yearly trend, career, relationship and current concern', () => {
  assert.equal(inferSajuConsultationTopic('사주 성격과 기질을 알려줘'), 'personality');
  assert.equal(inferSajuConsultationTopic('사주 올해 흐름은 어때?'), 'yearly_trend');
  assert.equal(inferSajuConsultationTopic('사주로 이직이나 직업 방향을 볼 수 있어?'), 'career');
  assert.equal(inferSajuConsultationTopic('사주에서 연애 관계의 경향이 궁금해'), 'relationship');
  assert.equal(inferSajuConsultationTopic('사주로 지금 고민을 봐줘'), 'current_concern');
  assert.equal(inferSajuConsultationTopic('오늘 점심 뭐 먹을까?'), null);
  assert.equal(isSajuConsultationRequest('사주로 진로가 궁금해'), true);
  assert.equal(isSajuConsultationRequest('이직이 좋을까?'), false);
  assert.match(buildSajuChatGuidance(true, '사주 올해 흐름'), /상담 주제: 연간 흐름/);
});

test('Saju consultation prompt includes the actual calculator output and lunar/time uncertainty', () => {
  const validated = assertSajuClock({ year: '2023', month: '2', day: '1', isLunar: true, isLeapMonth: true });
  assert.equal(validated.birthdate, '2023-02-01');
  assert.equal(validated.isLeapMonth, true);
  assert.throws(() => assertSajuClock({ year: 2021, month: 4, day: 1, isLunar: true, isLeapMonth: true }));
  assert.throws(() => assertSajuClock({ year: 2026, month: 2, day: 30 }));

  const profile = {
    basic: {
      birthdate: '2023-02-01',
      lunarSolar: 'lunar',
      isLeapMonth: true,
      birthTimeAccuracy: 'unknown',
      gender: 'female',
    },
  } as UserProfile;
  const chart = calculateDetailedSaju(profile);
  assert.ok(chart);
  const prompt = buildSajuConsultationSystemPrompt(chart, profile, 'yearly_trend');
  assert.match(prompt, /음력 윤달/);
  assert.match(prompt, /양력 환산/);
  assert.match(prompt, /출생 시각 미입력|출생 시각 정확도: 모름/);
  assert.match(prompt, /결정론적 앱 계산 결과/);
  assert.match(prompt, /새로 계산하거나.*만들어내지 마세요/);
  assert.match(prompt, /"pillars"/);
  assert.match(prompt, /"annual"/);
  assert.match(prompt, /다른 연도를 지정하면 그 해의 산출값이 없음을 밝히고/);
  assert.doesNotMatch(prompt, /wellnessFocus|비장\/위장 관리/);
  assert.match(prompt, /## 요약[\s\S]*## 계산 근거[\s\S]*## 유리한 흐름과 주의할 점[\s\S]*## 현실적인 다음 단계[\s\S]*## 불확실성/);

  const userMessage = buildSajuConsultationUserMessage({
    topic: 'current_concern',
    question: '이직을 준비할 때 먼저 볼 점은?',
    context: '올해 안에 지원을 시작할지 고민 중',
  });
  assert.match(userMessage, /지금 고민/);
  assert.match(userMessage, /올해 안에 지원을 시작할지 고민 중/);
  assert.match(buildSajuChatGuidance(true), /계산 미리보기로 제공된 명식/);
});

test('Saju fallback retains the answer structure and keeps health/financial advice non-diagnostic and non-prescriptive', () => {
  const profile = { basic: { birthdate: '2000-01-01', lunarSolar: 'solar', birthTimeAccuracy: 'unknown' } } as UserProfile;
  const chart = calculateDetailedSaju(profile);
  assert.ok(chart);
  const financial = buildSajuStructuredFallbackAnswer({
    chart,
    profile,
    topic: 'current_concern',
    question: '주식 투자해도 될까?',
    fallbackText: '당장 우량 자산을 매수하세요.',
  });
  assert.match(financial, /## 요약[\s\S]*## 계산 근거[\s\S]*## 유리한 흐름과 주의할 점[\s\S]*## 현실적인 다음 단계[\s\S]*## 불확실성/);
  assert.match(financial, /매수·매도나 투자 실행을 권하지 않/);
  assert.match(financial, /예산·손실 감내 범위/);
  assert.doesNotMatch(financial, /당장 우량 자산을 매수하세요/);

  const health = buildSajuStructuredFallbackAnswer({
    chart,
    profile,
    topic: 'current_concern',
    question: '건강이 괜찮을까?',
    fallbackText: '병을 조심하라고 나왔어.',
  });
  assert.match(health, /건강 상태나 질환을 판정하는 근거가 아니/);
  assert.match(health, /의료 전문가와 상담/);
});


test('Tarot guidance only interprets actual app-drawn cards and avoids certainty about distant outcomes', () => {
  const drawn = buildTarotInterpretationGuidance({ question: '이직을 고민하고 있어', hasAppDraw: true });
  assert.match(drawn, /이번 앱 요청에 전달된 실제 카드/);
  assert.match(drawn, /선택·추첨·추가했다고 말하지 마세요/);
  assert.match(drawn, /가까운 기간/);
  assert.match(drawn, /먼 미래의 결과나 시점/);
  assert.match(drawn, /확률·승률·수익률/);
  assert.match(drawn, /객관적인 승자를 지어내지 마세요/);
  assert.match(drawn, /상징적 기울기/);
  assert.match(drawn, /현실에서 확인할 지점/);
  assert.match(drawn, /열린 질문 하나로 여유를 남기세요/);
  assert.match(drawn, /불확실한 부분은 그 자리에서 짧게/);

  const noDraw = buildTarotInterpretationGuidance({ question: '카드 의미를 알려줘', hasAppDraw: false });
  assert.match(noDraw, /실제 앱 카드 추첨이 없습니다/);
  assert.match(noDraw, /카드·배열·방향을 지어내지 말고/);
});

test('Tarot binary-choice prompts and local fallback compare real cards without inventing winners or odds', () => {
  const concern = '현 직장 vs 새 회사';
  const analysis = analyzeTarotConcern(concern);
  assert.equal(analysis.kind, 'binary_choice');
  const addon = buildTarotBinaryChoicePromptAddon(analysis);
  assert.match(addon, /현 직장/);
  assert.match(addon, /새 회사/);
  assert.match(addon, /수치·확률·수익률을 만들지 마세요/);
  assert.match(addon, /현실에서 확인할 조건/);
  assert.doesNotMatch(addon, /적합도|추천도|확정 판정/);

  const reading = buildLocalTarotReading(concern, [
    { id: 'major_0', nameKo: '바보', type: 'major', reversed: false },
    { id: 'wands_1', nameKo: '완드 에이스', type: 'minor', reversed: false },
    { id: 'cups_2', nameKo: '컵 2', type: 'minor', reversed: true },
    { id: 'pentacles_3', nameKo: '펜타클 3', type: 'minor', reversed: false },
  ], false, analysis);
  assert.match(reading, /\[현 직장\]/);
  assert.match(reading, /\[새 회사\]/);
  assert.match(reading, /현실에서 확인할 기준을 비교해 보세요/);
  assert.doesNotMatch(reading, /적합도\s*\d+%|최종 판정: \[(?:YES|NO)\]|승자 판정/);
});

test('Tarot yes/no local fallback treats an actual card as symbolic reflection, not a final verdict', () => {
  const concern = '이 일을 지금 해도 될까요?';
  const analysis = analyzeTarotConcern(concern);
  assert.equal(analysis.kind, 'yes_no');
  const reading = buildLocalTarotReading(concern, [
    { id: 'major_0', nameKo: '마법사', type: 'major', reversed: false },
    { id: 'wands_1', nameKo: '완드 2', type: 'minor', reversed: false },
    { id: 'cups_2', nameKo: '컵 2', type: 'minor', reversed: true },
  ], false, analysis);
  assert.match(reading, /상징적 참고/);
  assert.match(reading, /결과에 대한 YES\/NO 판정이나 보장이 아닙니다/);
  assert.doesNotMatch(reading, /최종 판정: \[(?:YES|NO)\]/);
});


test('Tarot yes/no banner recognizes only an explicitly labeled symbolic inclination', () => {
  assert.equal(extractTarotSymbolicDirection('### YES / NO 선택지'), null);
  assert.equal(extractTarotSymbolicDirection('최종 판정: [YES]'), null);
  assert.equal(extractTarotSymbolicDirection('카드는 YES라고 보장합니다.'), null);
  assert.equal(extractTarotSymbolicDirection('상징적 기울기: [NO]'), 'NO');
  assert.equal(extractTarotSymbolicDirection('**상징적 기울기: YES**'), 'YES');
});
