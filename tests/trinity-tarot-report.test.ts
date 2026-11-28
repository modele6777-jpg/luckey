import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { buildDeterministicLucyAdvice } from '../src/lib/lucyTarotAdvice';
import { getTarotCardCaution, TAROT_DECK } from '../src/data/tarotData';
import {
  analyzeTarotConcern,
  buildLocalTarotReading,
  buildTarotContextPromptAddon,
  buildTarotSpreadPromptAddon,
} from '../src/lib/trinity/utils';

const trinityPage = readFileSync(new URL('../src/pages/TrinityApp.tsx', import.meta.url), 'utf8');
const adviceCard = readFileSync(new URL('../src/components/trinity/LucyTarotAdviceCard.tsx', import.meta.url), 'utf8');
const reversedSourceCard = TAROT_DECK.find((card) => card.id === 'cups_2');
assert.ok(reversedSourceCard, 'expected the existing Cups Two tarot data');
const reversedCard = { ...reversedSourceCard, reversed: true };

test('Trinity spread prompt keeps reversed meaning but avoids repeating the separate caution banner in the body', () => {
  const analysis = analyzeTarotConcern('현 직장 vs 새 회사');
  const spreadPrompt = buildTarotSpreadPromptAddon(analysis.spread, [reversedCard]);
  const contextPrompt = buildTarotContextPromptAddon({ cards: [reversedCard] });
  const nicknamePrompt = buildTarotContextPromptAddon({ cards: [reversedCard], profile: { basic: { nickname: '제제' } } as any });
  assert.match(spreadPrompt, /화면에서 역방향 주의 문구를 한 번 별도로 표시/);
  assert.match(spreadPrompt, /보고서 칸을 채우지 말고/);
  assert.match(spreadPrompt, /열린 질문 하나/);
  assert.doesNotMatch(spreadPrompt, /'핵심 판단', '카드별 흐름', '종합과 실천'을 사용/);
  assert.match(contextPrompt, /대표 주의 안내가 별도로 한 번 표시/);
  assert.match(nicknamePrompt, /'제제'라면 반드시 '제제님'으로 그대로 표기하고 '제님'이라고 부르지 마십시오/);
  assert.match(spreadPrompt, /역방향 고유 뜻/);
  assert.doesNotMatch(spreadPrompt, /주의점 1가지를 본문 속에 자연스럽게/);
  assert.doesNotMatch(contextPrompt, /⚠️ 주의점 1가지:/);
});

test('local fallback is a compact report and leaves reversed caution to its single UI notice', () => {
  const analysis = analyzeTarotConcern('현 직장 vs 새 회사');
  const cards = [
    { id: 'major_0', nameKo: '바보', type: 'major', reversed: false },
    { id: 'wands_1', nameKo: '완드 에이스', type: 'minor', reversed: false },
    reversedCard,
  ];
  const reading = buildLocalTarotReading('현 직장 vs 새 회사', cards, false, analysis);
  assert.match(reading, /### 핵심 판단/);
  assert.match(reading, /### 카드별 흐름/);
  assert.match(reading, /### 종합과 실천/);
  assert.doesNotMatch(reading, /⚠️|역방향 주의점|### 주의할 점/);
  assert.match(reading, /컵 2.*역방향/);
  // 결론을 혼자 닫지 않고 열린 질문 하나를 남긴다.
  assert.match(reading, /들려주시면/);
  assert.equal((reading.match(/들려주시면/g) || []).length, 1);
});

test('the Trinity tarot prompt reads like a cafe consultation instead of filling report columns', () => {
  assert.match(trinityPage, /보고서 칸을 채우는 문서가 아니라/);
  assert.match(trinityPage, /열린 질문 하나로 여유를 남기세요/);
  assert.match(trinityPage, /두세 문장마다 문단을 끊어 호흡을 주세요/);
  assert.doesNotMatch(trinityPage, /출력은 짧은 보고서이며/);
  assert.doesNotMatch(trinityPage, /카드별 의미는 각 카드에서 두 문장 이내/);
  assert.doesNotMatch(trinityPage, /답은 카드 의미 두 문장, 이번 질문에 대한 답 두 문장/);
});

test('multiple reversed cards produce one caution notice, not a sequence of per-card banners', () => {
  const start = trinityPage.indexOf('/* 역방향 주의는 여러 장이 나와도 대표 안내 한 번만 표시 */');
  const end = trinityPage.indexOf('<Streamdown immediate={!isTarotGenerating}', start);
  assert.ok(start >= 0 && end > start);
  const banner = trinityPage.slice(start, end);
  assert.match(banner, /findIndex\(\(c: any\) => Boolean\(c\?\.reversed\)\)/);
  assert.doesNotMatch(banner, /activeReadingCards\.map\(/);
  assert.equal((banner.match(/역방향 주의 안내/g) || []).length, 1);
});

test('Lucy fallback advice stays short and consistently polite in every tarot mode', () => {
  const modes = [
    { mode: 'standard' as const },
    { mode: 'daily' as const },
    { mode: 'oracle' as const, oracleMode: 'healing' as const },
    { mode: 'oracle' as const, oracleMode: 'growth' as const },
    { mode: 'oracle' as const, oracleMode: 'miracle' as const },
  ];
  const caution = getTarotCardCaution(reversedCard);
  for (const mode of modes) {
    const result = buildDeterministicLucyAdvice({ cards: [reversedCard], tarotConcern: '이직 고민', nickname: '제제', ...mode });
    assert.ok(result.advice.length <= 140, result.advice);
    assert.ok(result.actionTip.length <= 80, result.actionTip);
    assert.match(result.advice, /(?:요|예요)\.$/u, result.advice);
    assert.match(result.actionTip, /(?:요|세요)\.$/u, result.actionTip);
    assert.doesNotMatch(`${result.headline} ${result.advice} ${result.actionTip}`, /(?:해봐|거야|잊지 마|있어|없어|해줘)/u);
    assert.ok(!result.advice.includes(caution), result.advice);
    assert.doesNotMatch(`${result.headline} ${result.advice} ${result.actionTip}`, /제님/u);
  }
});

test('Lucy advice card preserves the complete nickname with no space before 님', () => {
  assert.match(adviceCard, /\{nickname\}님을 위한 1:1 맞춤 조언/);
  assert.doesNotMatch(adviceCard, /\{nickname\}\s+님/);
});
