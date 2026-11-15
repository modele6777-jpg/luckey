import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  extractConciseSummary,
  extractOracleConciseSummary,
  isCardSceneOnly,
} from '../src/lib/tarotSummaryUtils.ts';

const fiveCups = {
  id: 'cups_5',
  name: 'Five of Cups',
  nameKo: '성배 오',
  type: 'minor' as const,
  keywords: ['상실', '슬픔', '남은 것'],
  reversed: false,
};

const star = {
  id: 'major_17',
  name: 'The Star',
  nameKo: '별',
  type: 'major' as const,
  keywords: ['희망', '치유', '영감'],
  reversed: false,
};

/** 요약 3줄에서 특정 태그 줄의 본문만 꺼낸다. */
function rowText(lines: string[], tag: string): string {
  const line = lines.find((l) => l.includes(`[${tag}]`)) || '';
  return line.replace(/^\[[^\]]+\]\s*/, '').trim();
}

const IMAGERY_ONLY = ['배경에는', '그림 속', '그려져 있', '흐르고 있지요', '놓여 있', '들고 있'];

function assertNoImageryOnly(text: string, where: string) {
  for (const fragment of IMAGERY_ONLY) {
    assert.equal(
      text.includes(fragment),
      false,
      `${where}에 카드 그림 묘사만 남았다: ${text}`,
    );
  }
}

test('카드 그림 묘사 한 줄이 [현재 에너지] 요약으로 채택되지 않는다', () => {
  // 사용자가 신고한 실제 실패 문장을 그대로 넣은 리딩.
  const reading = `질문자님, 어서 오세요. 카드를 한 장씩 마주하니 물결이 잔잔합니다.

[핵심 3줄 요약]
- [현재 에너지] 배경에는 잔잔한 강물이 흐르고 있지요.
- [방향과 결단] 과감한 결단
- [실천 처방] 오늘 밤 잊은 것과 남은 것을 적어 보세요.

### 1. 마음과 현재 에너지
질문자님의 마음은 지금 성배 오의 물결처럼 가라앉아 있습니다. 배경에는 잔잔한 강물이 흐르고 있지요. 잃은 것만 세느라 남은 두 개의 성배를 보지 못하고, 이직 준비를 미루며 마음이 무거워진 상태입니다.

### 2. 카드 상징
성배 오는 상실과 남은 것을 의미합니다.

### 3. 결단 및 방향성
최종 판정은 조건부 YES입니다. 남은 두 개의 성배를 먼저 세어 보면 회복의 실마리가 보입니다.

### 4. 실천 처방
오늘 밤 잃은 것 세 가지와 남은 것 세 가지를 종이에 적어 보세요.`;

  const lines = extractConciseSummary(reading, {
    card: fiveCups,
    cards: [fiveCups],
    concern: '이직 준비 중인데 지금 마음이 너무 지쳐요',
  });
  const energy = rowText(lines, '현재 에너지');

  assert.equal(energy.includes('배경에는 잔잔한 강물이 흐르고 있지요'), false);
  assertNoImageryOnly(energy, '[현재 에너지]');
  assert.ok(energy.length >= 25, `현재 에너지 요약이 너무 짧다: ${energy}`);
  assert.match(energy, /이직|마음|상태|에너지/);
});

test('요약 블록 없이 본문만 있어도 그림 묘사 문장은 [현재 에너지]로 쓰이지 않는다', () => {
  const reading = `### 1. 마음과 현재 에너지
배경에는 잔잔한 강물이 흐르고 있지요. 그림 속 인물이 성배를 들고 있습니다.

### 3. 결단 및 방향성
최종 판정은 조건부 YES입니다. 남은 성배를 세어 보면 회복의 실마리가 보입니다.

### 4. 실천 처방
오늘 밤 남은 것 세 가지를 종이에 적어 보세요.`;

  const lines = extractConciseSummary(reading, {
    card: fiveCups,
    cards: [fiveCups],
    concern: '이직 준비',
  });
  const energy = rowText(lines, '현재 에너지');
  assertNoImageryOnly(energy, '[현재 에너지]');
  assert.ok(energy.length >= 25, `현재 에너지 요약이 너무 짧다: ${energy}`);
});

test('본문에 쓸 문장이 없으면 카드 키워드와 질문 맥락으로 대체 요약을 만든다', () => {
  const reading = `### 2. 카드 상징
성배 오는 상실과 남은 것을 의미합니다.

### 4. 실천 처방
오늘 밤 남은 것 세 가지를 종이에 적어 보세요.`;

  const lines = extractConciseSummary(reading, {
    card: fiveCups,
    cards: [fiveCups],
    concern: '이직 준비',
  });
  const energy = rowText(lines, '현재 에너지');
  assert.ok(energy.length >= 25, `대체 요약이 너무 짧다: ${energy}`);
  assert.match(energy, /성배 오/);
  assert.match(energy, /이직/);
  assertNoImageryOnly(energy, '[현재 에너지]');
});

test('충분한 의미가 담긴 [현재 에너지] 문장은 그대로 유지된다', () => {
  const reading = `[핵심 3줄 요약]
- [현재 에너지] 지금 마음은 오랜 피로가 쌓여 결정을 미루는 상태입니다.
- [방향과 결단] 새 조건을 확인한 뒤 움직이는 편이 좋습니다.
- [실천 처방] 오늘 확인할 항목 하나를 종이에 적어 보세요.`;

  const lines = extractConciseSummary(reading, { card: star, cards: [star] });
  assert.equal(
    rowText(lines, '현재 에너지').includes('지금 마음은 오랜 피로가 쌓여 결정을 미루는 상태입니다'),
    true,
  );
});

test('오라클 요약 경로도 그림 묘사 문장을 [현재 에너지]로 쓰지 않는다', () => {
  const message = `[핵심 3줄 요약]
- [현재 에너지] 배경에는 잔잔한 강물이 흐르고 있지요.
- [방향과 결단] 과감한 결단
- [실천 처방] 오늘 밤 잊은 것과 남은 것을 적어 보세요.`;

  const lines = extractOracleConciseSummary({
    message,
    oracleMode: 'growth',
    cards: [fiveCups, star],
    saju: {
      dayMaster: { symbolName: '무토' },
      elements: { dominant: { name: '토' }, lacking: { name: '수' } },
      yongsin: { name: '금' },
    },
  });
  const energy = rowText(lines, '현재 에너지');
  assertNoImageryOnly(energy, '[현재 에너지]');
  assert.ok(energy.length >= 25, `현재 에너지 요약이 너무 짧다: ${energy}`);
  const decision = rowText(lines, '방향과 결단');
  assert.notEqual(decision.replace(/[.\s]/g, ''), '과감한결단', '제목만 남은 결단 요약이 그대로 나왔다');
  assert.ok(decision.length >= 20, `결단 요약이 너무 짧다: ${decision}`);
  assert.match(decision, /성배 오/);
});

test('카드 그림 묘사 판별: 배경·소품 서술은 걸러지고 질문자의 상태 서술은 남는다', () => {
  const scenes = [
    '배경에는 잔잔한 강물이 흐르고 있지요.',
    '그림 속 인물이 지팡이를 들고 있습니다.',
    '카드에는 성배 다섯 개가 놓여 있습니다.',
    '카드 속 여인이 물을 붓고 있습니다.',
    '하늘에는 별이 그려져 있습니다.',
  ];
  for (const scene of scenes) {
    assert.equal(isCardSceneOnly(scene), true, `그림 묘사로 잡히지 않았다: ${scene}`);
  }

  const querent = [
    '당신의 마음에는 잔잔한 강물이 흐르고 있지요.',
    '지금 당신의 에너지는 성배 오의 상실 흐름 위에 있습니다.',
    '별의 희망이 오늘 마음을 받칩니다.',
    '관계의 문이 열려 있습니다.',
  ];
  for (const line of querent) {
    assert.equal(isCardSceneOnly(line), false, `질문자 서술이 그림 묘사로 잘못 잡혔다: ${line}`);
  }
});
