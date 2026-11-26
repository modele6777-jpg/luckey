import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseCardNumbers, parseSinoKorean, shuffleOrbDeck, pickOrbCards, orbCardPickMessage,
  summarizeOrbSession, saveOrbMemory, loadOrbMemory, buildOrbMemoryBrief, latestOrbMemoryLine, countStopWords, isStopAll,
} from '../src/lib/orbConsult.ts';

const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
  clear: () => store.clear(),
  key: () => null,
  length: 0,
};


test('reads card numbers said in digits or Sino-Korean words', () => {
  assert.deepEqual(parseCardNumbers('7, 23, 51번이요'), [7, 23, 51]);
  assert.deepEqual(parseCardNumbers('칠 이십삼 오십일'), [7, 23, 51]);
  assert.deepEqual(parseCardNumbers('삼번이랑 십이번 그리고 칠십팔'), [3, 12, 78]);
  assert.equal(parseSinoKorean('이십삼'), 23);
  assert.equal(parseSinoKorean('삼사'), null);
});

test('ordinary words are not mistaken for numbers and out-of-range numbers are ignored', () => {
  assert.deepEqual(parseCardNumbers('일 때문에 고민이 많아요'), []);
  assert.deepEqual(parseCardNumbers('99 그리고 0'), []);
  assert.deepEqual(parseCardNumbers('5 5 5'), [5]);
});

test('a shuffled deck holds all 78 cards and the same number gives the same card', () => {
  const deck = shuffleOrbDeck();
  assert.equal(deck.length, 78);
  assert.equal(new Set(deck.map(card => card.id)).size, 78);
  const a = pickOrbCards(deck, [7, 23, 51]);
  const b = pickOrbCards(deck, [7, 23, 51]);
  assert.deepEqual(a.map(card => card.id), b.map(card => card.id));
  assert.deepEqual(a.map(card => card.position), ['과거', '지금', '앞으로']);
  const message = orbCardPickMessage(a);
  assert.match(message, /^\[카드 선택\]/);
  for (const card of a) assert.ok(message.includes(card.nameKo));
});

test('a finished session is remembered per account and briefed back to the master', () => {
  const lines = [
    { who: '루시', text: '안녕하세요.' },
    { who: '나', text: '이직을 할지 말지 고민이에요' },
    { who: '나', text: '칠 이십삼 오십일' },
    { who: '나', text: '🃏 카드 선택: 과거 7번' },
    { who: '루시', text: '서두르지 말고 한 달만 준비해 보세요.' },
  ];
  const summary = summarizeOrbSession(lines);
  assert.ok(summary);
  assert.equal(summary!.concern, '이직을 할지 말지 고민이에요');
  assert.equal(summary!.advice, '서두르지 말고 한 달만 준비해 보세요.');
  const now = Date.UTC(2026, 10, 23);
  saveOrbMemory('user-a', { at: now - 3 * 86400000, masterId: 'tarot', masterName: '타로', ...summary! }, now);
  assert.equal(loadOrbMemory('user-b', now).length, 0);
  const entries = loadOrbMemory('user-a', now);
  assert.equal(entries.length, 1);
  const brief = buildOrbMemoryBrief(entries, 'tarot', now);
  assert.match(brief, /지난 상담 기록/);
  assert.match(brief, /3일 전 이 마스터/);
  assert.match(brief, /이직을 할지 말지/);
  assert.match(brief, /참고 자료일 뿐/);
  assert.match(latestOrbMemoryLine(entries, now), /3일 전 타로 마스터/);
  assert.equal(buildOrbMemoryBrief([], 'tarot', now), '');
});

test('a session with nothing said by the guest is not remembered', () => {
  assert.equal(summarizeOrbSession([{ who: '루시', text: '안녕하세요' }]), null);
});

test('stop words for the "멈춰!" shuffle are counted, ordinary talk is not', () => {
  assert.equal(countStopWords('멈춰'), 1);
  assert.equal(countStopWords('멈춰 멈춰요 스톱'), 3);
  assert.equal(countStopWords('연애 고민이 있어요'), 0);
});

test('a shuffle pick tells the master the cards without numbers', () => {
  const deck = shuffleOrbDeck();
  const cards = pickOrbCards(deck, [1, 2, 3], 'shuffle');
  const message = orbCardPickMessage(cards);
  assert.match(message, /세 번 멈춰/);
  assert.doesNotMatch(message, /\d+번/);
});

test('"전부 멈춰" draws the rest at once, a single "멈춰" does not', () => {
  for (const text of ['전부 멈춰', '다 멈춰요', '한꺼번에 뽑아 주세요', '모두 스톱', '세 장 다 멈춰']) assert.equal(isStopAll(text), true, text);
  for (const text of ['멈춰', '멈춰요', '연애 고민이 다 있어요']) assert.equal(isStopAll(text), false, text);
});
