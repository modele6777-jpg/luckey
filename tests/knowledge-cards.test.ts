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

test('second-round cards cover every Ziwei main star, mutagen, Kyusei star, Liuren general and Qimen gate', async () => {
  const more = await import('../src/lib/divination/knowledge/moreCards.ts');
  assert.equal(more.ZIWEI_STAR_CARDS.length, 14);
  assert.deepEqual(more.ZIWEI_MUTAGEN_CARDS.map(c => c.key), ['록', '권', '과', '기']);
  assert.deepEqual(more.KYUSEI_STAR_CARDS.map(c => c.key), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  assert.equal(more.LIUREN_GENERAL_CARDS.length, 12);
  assert.deepEqual(more.QIMEN_GATE_CARDS.map(c => c.key), ['休門', '生門', '傷門', '杜門', '景門', '死門', '驚門', '開門']);
});

test('a full Lucy Pro level-3 prompt carries the cards for its own chart', async () => {
  const { routeAndExecute } = await import('../src/lib/divination/smartAgentRouter.ts');
  const profile: any = { basic: { birthdate: '1990-05-15', birthtime: '14:30', birthTimeAccuracy: 'exact', gender: 'female', lunarSolar: 'solar', birthCity: '서울' } };
  const prompt = routeAndExecute({ text: '이직 고민', profile, isMasterRequested: true, divinationMode: { base: 'tarot_saju' } }).promptInjection;
  // 庚년생 사화: 태양 화록·무곡 화권·태음 화과·천동 화기
  assert.match(prompt, /생년 化祿: [^—]*태양/);
  assert.match(prompt, /생년 化權: [^—]*무곡/);
  assert.match(prompt, /생년 化科: [^—]*태음/);
  assert.match(prompt, /생년 化忌: [^—]*천동/);
  assert.match(prompt, /자미두수 명궁 주성 자미/);
  // 이번 질문에 고르지 않은 도구(구성학)의 카드는 붙이지 않는다 — 도구는 필요한 만큼만.
  assert.doesNotMatch(prompt, /구성학 본명성/);
  assert.ok(prompt.length < 60000);
});
