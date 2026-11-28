import assert from 'node:assert/strict';
import test from 'node:test';
import { ORB_SPREADS, matchOrbSpread, orbSpreadById, orbSpreadCountPhrase } from '../src/lib/orb/orbSpreads.ts';
import { orbCardPickMessage, parseCardNumbers, pickOrbCards, shuffleOrbDeck } from '../src/lib/orbConsult.ts';
import { drawOrbTarotPositions } from '../src/lib/orb/orbDice.ts';

test('every orb spread has a layout for each position', () => {
  const ids = new Set<string>();
  assert.ok(ORB_SPREADS.length >= 16);
  for (const spread of ORB_SPREADS) {
    assert.equal(ids.has(spread.id), false, spread.id);
    ids.add(spread.id);
    assert.equal(spread.layout.length, spread.positions.length, spread.id);
    assert.ok(spread.positions.length >= 1 && spread.positions.length <= 10, spread.id);
    for (const slot of spread.layout) {
      assert.ok(slot.x >= 0 && slot.x <= 100 && slot.y >= 0 && slot.y <= 100, spread.id);
    }
  }
  assert.equal(orbSpreadById('missing').id, 'time-3');
  assert.equal(orbSpreadCountPhrase(3), '세 장');
  assert.equal(orbSpreadCountPhrase(10), '열 장');
});

test('a plain question stays on the three-card time spread', () => {
  for (const text of ['', '요즘 그냥 어때', '마음이 좀 복잡해']) {
    const spread = matchOrbSpread(text);
    assert.equal(spread.id, 'time-3', text);
    assert.deepEqual(spread.positions, ['과거', '지금', '앞으로']);
  }
});

test('the question picks a different spread size', () => {
  assert.equal(matchOrbSpread('셀틱 크로스로 전체적인 운명을 봐줘').positions.length, 10);
  assert.equal(matchOrbSpread('말굽으로 전체 흐름').positions.length, 7);
  assert.equal(matchOrbSpread('이직할까 말까').id, 'two-paths');
  assert.equal(matchOrbSpread('그 사람이 답장을 안 해').id, 'mind');
  assert.equal(matchOrbSpread('카드 한 장만').id, 'one');
  assert.equal(matchOrbSpread('재물이 새는 곳').id, 'money');
  assert.equal(matchOrbSpread('올해 사계절').id, 'seasons');
  assert.equal(matchOrbSpread('사주 네 기둥으로').id, 'saju-4');
});

test('custom spreads keep the card count and the three-card shuffle message stays the same', () => {
  const deck = shuffleOrbDeck();
  const celtic = matchOrbSpread('셀틱 크로스');
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const cards = pickOrbCards(deck, numbers, 'shuffle', celtic.positions);
  assert.equal(cards.length, 10);
  assert.equal(cards[1].position, '가로지르는 도전');
  const message = orbCardPickMessage(cards, celtic.name);
  assert.match(message, /셀틱 크로스/);
  assert.match(message, /사주 원국의 오행·용신·대운·세운/);
  assert.doesNotMatch(message, /세 번 멈춰/);
  assert.doesNotMatch(message, /\d+번/);
  const classic = pickOrbCards(deck, [1, 2, 3], 'shuffle');
  assert.match(orbCardPickMessage(classic), /세 번 멈춰/);
  assert.deepEqual(parseCardNumbers('1 2 3 4 5 6', 78, 5), [1, 2, 3, 4, 5]);
  assert.equal(drawOrbTarotPositions(deck.length, [], () => [1, 1], 4).length, 4);
});
