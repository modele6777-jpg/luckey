import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  analyzeTarotConcern,
  buildSpreadForTheme,
  buildTarotBinaryChoicePromptAddon,
  buildLocalTarotReading,
  isYesNoTarotSpread,
  resolveTarotYesNoVerdict,
} from '../src/lib/trinity/utils.ts';
import { buildTarotInterpretationGuidance } from '../src/lib/divination/consultationGuidance.ts';
import { stripSymbolicYesNoVerdict } from '../src/lib/tarotSummaryUtils.ts';
import { TarotSummaryGraphicCard } from '../src/components/trinity/TarotSummaryGraphicCard.tsx';

const YES_NO_QUESTION = '이 결정을 실행해도 될까요?';
const cards = [
  { id: 'major_0', nameKo: '마법사', name: 'The Magician', type: 'major' as const, reversed: false },
  { id: 'wands_1', nameKo: '완드 2', name: 'Two of Wands', type: 'minor' as const, reversed: false },
  { id: 'cups_2', nameKo: '컵 2', name: 'Two of Cups', type: 'minor' as const, reversed: true },
];

const readingWithVerdict = `### 핵심 판단
상징적 기울기: [YES]

### 카드별 흐름
- **현재 에너지 — 마법사 (정방향):** 의지와 실행력이 서 있는 상태입니다.
- **결정 전 조건 — 컵 2 (역방향):** 확인할 조건을 하나 더 살펴보세요.`;

test('예·아니오 전용 배열(yes_no_gate)만 YES/NO 배너를 만든다', () => {
  const yesNoAnalysis = analyzeTarotConcern(YES_NO_QUESTION);
  assert.equal(yesNoAnalysis.kind, 'yes_no');
  assert.equal(yesNoAnalysis.spread.id, 'yes_no_gate');
  assert.equal(isYesNoTarotSpread(yesNoAnalysis.spread), true);

  const verdict = resolveTarotYesNoVerdict({
    result: readingWithVerdict,
    spread: yesNoAnalysis.spread,
    cardCount: 3,
  });
  assert.equal(verdict?.type, 'YES');
  assert.match(verdict?.badgeText || '', /판정·보장이 아닙니다/);
});

test('예/아니오 질문이라도 일반 배열(3카드·셀틱 크로스)에서는 YES/NO 배너가 나오지 않는다', () => {
  const yesNoAnalysis = analyzeTarotConcern(YES_NO_QUESTION);
  const threeCard = buildSpreadForTheme('general', { kind: 'open' });
  const celtic = buildSpreadForTheme('celtic_cross', { kind: 'open' });

  for (const spread of [threeCard, celtic, buildSpreadForTheme('daily', { kind: 'open' })]) {
    assert.equal(isYesNoTarotSpread(spread), false);
    assert.equal(
      resolveTarotYesNoVerdict({ result: readingWithVerdict, spread, cardCount: 3 }),
      null,
      `${spread.name} 배열에서는 YES/NO 배너가 없어야 합니다.`,
    );
  }
  // 배열을 알 수 없으면 표시하지 않는다.
  assert.equal(resolveTarotYesNoVerdict({ result: readingWithVerdict, spread: null, cardCount: 3 }), null);
  // 예·아니오 배열이어도 모델이 표기하지 않았으면 배너를 만들지 않는다.
  assert.equal(
    resolveTarotYesNoVerdict({
      result: '### 핵심 판단\n카드는 확정된 답을 주지 않습니다.',
      spread: yesNoAnalysis.spread,
      cardCount: 3,
    }),
    null,
  );
});

test('일반 배열에서는 프롬프트가 YES/NO 판정 표기를 만들지 않도록 막는다', () => {
  const yesNoAnalysis = analyzeTarotConcern(YES_NO_QUESTION);
  const threeCard = buildSpreadForTheme('general', { kind: 'open' });
  const appliedAnalysis = { ...yesNoAnalysis, theme: 'general' as const, spread: threeCard };

  const addon = buildTarotBinaryChoicePromptAddon(appliedAnalysis, appliedAnalysis.spread);
  assert.doesNotMatch(addon, /단독 줄 '상징적 기울기: \[YES\]'/);
  assert.match(addon, /예·아니오 전용 배열이 아닙니다/);
  assert.match(addon, /YES\/NO 판정 표기를 만들지 마세요/);

  const appliedWithoutArg = buildTarotBinaryChoicePromptAddon(appliedAnalysis);
  assert.doesNotMatch(appliedWithoutArg, /단독 줄 '상징적 기울기: \[YES\]'/);

  // 예·아니오 전용 배열을 실제로 고른 경우에는 기존 지침이 유지된다.
  const yesNoAddon = buildTarotBinaryChoicePromptAddon(yesNoAnalysis, yesNoAnalysis.spread);
  assert.match(yesNoAddon, /상징적 기울기/);
  assert.doesNotMatch(yesNoAddon, /예·아니오 전용 배열이 아닙니다/);
});

test('타로 상담 지침은 예·아니오 전용 배열일 때만 상징적 기울기 표기를 허용한다', () => {
  const general = buildTarotInterpretationGuidance({ question: YES_NO_QUESTION, hasAppDraw: true });
  assert.doesNotMatch(general, /단독 줄 '상징적 기울기: \[YES\]'/);
  assert.match(general, /예·아니오 전용 배열이 아니므로/);
  assert.match(general, /YES\/NO 판정 같은 표기를 만들지 마세요/);

  const yesNo = buildTarotInterpretationGuidance({
    question: YES_NO_QUESTION,
    hasAppDraw: true,
    yesNoSpread: true,
  });
  assert.match(yesNo, /단독 줄 '상징적 기울기: \[YES\]'/);
  assert.doesNotMatch(yesNo, /예·아니오 전용 배열이 아니므로/);
});

test('일반 배열의 본문 정리는 새어 나온 YES/NO 판정 표기를 지운다', () => {
  const cleaned = stripSymbolicYesNoVerdict(readingWithVerdict);
  assert.doesNotMatch(cleaned, /상징적 기울기/);
  assert.doesNotMatch(cleaned, /\[YES\]|\[NO\]/);
  assert.match(cleaned, /현재 에너지 — 마법사/);
  assert.match(cleaned, /결정 전 조건 — 컵 2/);

  // 문장 안에 섞인 표기는 문장을 살리고 표기만 지운다.
  const inline = stripSymbolicYesNoVerdict('- [방향과 결단] 상징적 기울기: [조건부 YES] 대신 확인할 조건을 먼저 보세요.');
  assert.equal(inline, '- [방향과 결단] 대신 확인할 조건을 먼저 보세요.');

  // 영어 문장 속 yes/no는 건드리지 않는다.
  const plain = stripSymbolicYesNoVerdict('Please answer yes or no later.');
  assert.equal(plain, 'Please answer yes or no later.');
});

test('일반 배열의 엔진 폴백 리딩에도 YES/NO 판정 문구가 들어가지 않는다', () => {
  const yesNoAnalysis = analyzeTarotConcern(YES_NO_QUESTION);
  const threeCard = buildSpreadForTheme('general', { kind: 'open' });
  const appliedAnalysis = { ...yesNoAnalysis, theme: 'general' as const, spread: threeCard };

  const reading = buildLocalTarotReading(YES_NO_QUESTION, cards, false, appliedAnalysis);
  assert.doesNotMatch(reading, /상징적 기울기/);
  assert.doesNotMatch(reading, /최종 판정/);
  assert.match(reading, /3카드 시간 배열/);

  const yesNoReading = buildLocalTarotReading(YES_NO_QUESTION, cards, false, yesNoAnalysis);
  assert.match(yesNoReading, /이는 성찰을 위한 관점이지/);
  assert.doesNotMatch(yesNoReading, /최종 판정:\s*\[?(?:YES|NO)\]?/);
});

test('불릿으로 적힌 상징적 기울기 줄도 예·아니오 배열에서만 배너로 읽는다', () => {
  const yesNoAnalysis = analyzeTarotConcern(YES_NO_QUESTION);
  const bulleted = '### 핵심 판단\n- 상징적 기울기: [NO]\n\n### 종합\n확인할 조건이 남아 있습니다.';
  assert.equal(
    resolveTarotYesNoVerdict({ result: bulleted, spread: yesNoAnalysis.spread, cardCount: 3 })?.type,
    'NO',
  );
  assert.equal(
    resolveTarotYesNoVerdict({
      result: bulleted,
      spread: buildSpreadForTheme('general', { kind: 'open' }),
      cardCount: 3,
    }),
    null,
  );
});

test('요약 카드는 예·아니오 전용 배열일 때만 YES/NO 배지를 표시한다', () => {
  const bullets = [
    '[현재 에너지] 마법사의 의지가 서 있지만 조건 확인이 남아 있습니다.',
    '[방향과 결단] 상징적 기울기: [YES] 이지만 확인할 조건이 하나 더 있습니다.',
    '[실천 행동] 오늘 조건 하나를 문서로 확인해 보세요.',
  ];

  const gated = renderToStaticMarkup(
    <TarotSummaryGraphicCard bullets={bullets} question={YES_NO_QUESTION} />,
  );
  assert.doesNotMatch(gated, /✨ YES/);
  assert.doesNotMatch(gated, /🛑 NO/);
  assert.doesNotMatch(gated, /상징적 기울기/);

  const yesNo = renderToStaticMarkup(
    <TarotSummaryGraphicCard bullets={bullets} question={YES_NO_QUESTION} isYesNoSpread />,
  );
  assert.match(yesNo, /✨ YES/);
  assert.match(yesNo, /상징적 기울기/);
});
