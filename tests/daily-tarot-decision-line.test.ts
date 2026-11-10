import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSpecificTarotDailyOracle } from '../src/lib/dailyTarotOracle.ts';
import { describeElementLead } from '../src/lib/sajuAnalysis.ts';
import { extractConciseSummary, repairDirectionSummaryLine } from '../src/lib/tarotSummaryUtils.ts';
import { buildSpreadTailoredReadingGuide } from '../src/lib/trinity/spreadStructures.ts';
import { handleDailyTarotPost } from '../server/api-lib/dailyTarotRoute.ts';

const star = { id: 'major_17', name: 'The Star', nameKo: '별', type: 'major' as const, keywords: ['희망', '치유', '영감'], reversed: false };

function decisionLine(diagnosis: string): string {
  return diagnosis.split('\n').find((line) => /\[방향과\s*결단\]/.test(line)) || '';
}

function response() {
  const headers: Record<string, string> = {};
  return {
    statusCode: 0,
    body: undefined as { diagnosis?: string; source?: string } | undefined,
    headers,
    setHeader(name: string, value: string) { headers[name] = value; return this; },
    status(code: number) { this.statusCode = code; return this; },
    json(payload: { diagnosis?: string; source?: string }) { this.body = payload; return this; },
  };
}

test('a direction title is not left as the decision summary', () => {
  const diagnosis = `[핵심 3줄 요약]
- [현재 에너지] 오랜 피로와 막막함 속에서도 별의 회복이 스며드는 날입니다.
- [방향과 결단] 과감한 결단
- [실천 처방] 오전 시간의 차분한 정비를 거쳐 오늘 할 일 하나를 성사시키십시오.`;
  const repaired = repairDirectionSummaryLine(diagnosis, [star]);
  const line = decisionLine(repaired);
  assert.equal(line.includes('과감한 결단'), false);
  assert.match(line, /별/);
  assert.ok(line.replace(/^\s*-\s*\[방향과\s*결단\]\s*/, '').length > 20);
  assert.equal(repaired.includes('오랜 피로와 막막함'), true);
  assert.equal(repaired.includes('오전 시간의 차분한 정비'), true);
});

test('a title pasted in front of an unrelated sentence is replaced with the card sentence', () => {
  const diagnosis = `[핵심 3줄 요약]
- [현재 에너지] 별의 희망이 오늘 마음을 받칩니다.
- [방향과 결단] 과감한 결단 : 당장 눈앞의 성과에 집착하기보다 장기적인 비전을 믿고 판을 재정비해야 합니다.
- [실천 처방] 오전 중 호흡을 가다듬고 믿을 만한 동료와 대화를 나누십시오.`;
  const line = decisionLine(repairDirectionSummaryLine(diagnosis, [star]));
  assert.equal(/^-\s*\[방향과\s*결단\]\s*과감한 결단/.test(line), false);
  assert.match(line, /별/);
});

test('model and engine daily tarot both return a full decision sentence', async () => {
  const modeled = response();
  await handleDailyTarotPost({ body: { card: star, mode: 'oracle' } } as any, modeled as any, {
    apiKey: 'test-only',
    callModel: async () => ({
      text: JSON.stringify({
        diagnosis: `[핵심 3줄 요약]\n- [현재 에너지] 별이 비추는 회복의 하루입니다.\n- [방향과 결단] 과감한 결단\n- [실천 처방] 물 한 잔을 마시며 오늘 할 일 하나를 적으십시오.`,
        luckyNumber: '7',
        luckyColor: '은색',
        remedy: '하늘',
        symbol: '별',
        frequency: '639Hz',
      }),
    }),
  });
  assert.equal(modeled.body?.source, 'model');
  const modelLine = decisionLine(String(modeled.body?.diagnosis));
  assert.equal(modelLine.endsWith('과감한 결단'), false);
  assert.match(modelLine, /별/);

  const local = response();
  await handleDailyTarotPost({ body: { card: star, mode: 'oracle' } } as any, local as any, { apiKey: '' });
  assert.equal(local.body?.source, 'engine');
  const engineLine = decisionLine(String(local.body?.diagnosis));
  assert.equal(engineLine.includes('과감한 결단'), false);
  assert.ok(engineLine.replace(/^\s*-\s*\[방향과\s*결단\]\s*/, '').length > 20);

  const direct = decisionLine(buildSpecificTarotDailyOracle(star, 'oracle').diagnosis);
  assert.equal(direct.includes('과감한 결단'), false);
});

test('saju summaries and multi-card prompts do not use the direction title as the sentence', () => {
  const summary = describeElementLead(
    { 목: 1, 화: 2, 토: 2, 금: 1, 수: 0 },
    { hanja: '戊', korean: '무', element: '토' },
  ).summary;
  assert.equal(summary.includes('과감한 결단'), false);
  assert.ok(summary.length > 40);

  const prompt = buildSpreadTailoredReadingGuide('daily', {
    id: 'daily',
    name: '오늘의 타로',
    cardCount: 1,
    reason: '오늘',
    positions: ['오늘의 카드'],
    theme: 'daily',
  });
  assert.equal(prompt.promptTemplate.includes('제목에 맞춘'), false);
  assert.match(prompt.promptTemplate, /무엇을 조심해야 하는지/);
});

test('a multi-card summary does not keep a bare direction title', () => {
  const reading = `[핵심 3줄 요약]
- [현재 에너지] 지금 마음은 별의 희망보다 피로가 앞에 있습니다.
- [방향과 결단] 과감한 결단
- [실천 처방] 오늘 확인할 조건 하나를 메모하십시오.

### 🔮 3. 결단
과감한 결단`;
  const lines = extractConciseSummary(reading, { card: star, cards: [star] });
  const decision = lines.find((line) => line.includes('방향과 결단')) || lines[1] || '';
  assert.equal(decision.endsWith('과감한 결단.'), false);
  assert.equal(decision.includes('과감한 결단'), false);
});
