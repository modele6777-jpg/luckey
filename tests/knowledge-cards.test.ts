import assert from 'node:assert/strict';
import test from 'node:test';
import { ICHING_CARDS, findIchingCard } from '../src/lib/divination/knowledge/ichingCards.ts';
import { SUKUYO_TYPE_CARDS, SUKUYO_RELATION_CARDS } from '../src/lib/divination/knowledge/sukuyoCards.ts';
import { buildKnowledgeCards } from '../src/lib/divination/knowledge/index.ts';
import { hexagram } from '../src/lib/divination/iching.ts';
import { sukuyoMansionInfoByIndex } from '../src/lib/divination/sukuyoEngine.ts';
import { calculateIchingMaster } from '../src/lib/divination/ichingMasterEngine.ts';

test('there is exactly one I Ching card per hexagram, in King Wen order, named like the engine', () => {
  assert.equal(ICHING_CARDS.length, 64);
  assert.deepEqual(ICHING_CARDS.map(card => card.number), Array.from({ length: 64 }, (_, i) => i + 1));
  // 엔진이 만드는 64개 비트 조합의 괘 이름이 모두 카드에 있어야 한다.
  const engineNames = new Set<string>();
  for (let n = 0; n < 64; n += 1) {
    const view = hexagram([0, 1, 2, 3, 4, 5].map(i => (n >> i) & 1)) as { name: string; number?: number };
    const name = String(view.name).split(/[\s(]/)[0];
    engineNames.add(name);
    if (typeof view.number === 'number') assert.equal(findIchingCard(name)?.number, view.number, `${name} 번호`);
  }
  assert.equal(engineNames.size, 64);
  for (const name of engineNames) assert.ok(findIchingCard(name), `card for ${name}`);
  for (const card of ICHING_CARDS) assert.ok(card.judgment && card.core && card.use && card.caution, card.name);
});

test('every Sukuyo mansion maps to one of the seven type cards and the six relation cards exist', () => {
  const keys = new Set(SUKUYO_TYPE_CARDS.map(card => card.key));
  assert.equal(keys.size, 7);
  for (let i = 0; i < 27; i += 1) assert.ok(keys.has(sukuyoMansionInfoByIndex(i).shukguk), `mansion ${i}`);
  assert.deepEqual(SUKUYO_RELATION_CARDS.map(card => card.key), ['명', '업태', '영친', '우쇠', '안괴', '위성']);
});

test('only the cards for this calculation are attached', () => {
  const iching = calculateIchingMaster(new Date('2026-11-23T11:49:00Z'));
  const cards = buildKnowledgeCards([
    { toolId: 'iching', status: 'calculated', data: iching },
    { toolId: 'sukuyo', status: 'calculated', data: { index: 10, mansion: '危宿' } },
    { toolId: 'saju', status: 'calculated', data: {} },
  ]);
  assert.ok(cards.some(card => card.includes('주역 본괘 36. 지화명이')));
  assert.ok(cards.some(card => card.includes('지괘(1효 변) 15. 지산겸')));
  assert.ok(cards.some(card => card.includes('경조숙')));
  assert.equal(cards.length, 4);
  assert.deepEqual(buildKnowledgeCards([{ toolId: 'iching', status: 'skipped' }]), []);
});
