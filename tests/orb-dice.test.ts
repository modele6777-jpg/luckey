import test from 'node:test';
import assert from 'node:assert/strict';
import { dicePairIndex, drawOrbDiceIndex, drawOrbIchingLines, drawOrbTarotPositions, rollOrbDice, type OrbDicePair } from '../src/lib/orb/orbDice.ts';
import { shuffleOrbDeck, pickOrbCards } from '../src/lib/orbConsult.ts';

function pair(index: number): OrbDicePair {
  return [Math.floor(index / 6) + 1, index % 6 + 1];
}

test('all accepted dice combinations give every remaining tarot position equal weight', () => {
  for (const limit of [78, 77, 76]) {
    const counts = Array(limit).fill(0);
    const cutoff = 1296 - 1296 % limit;
    for (let i = 0; i < cutoff; i += 1) {
      const rolls = [pair(Math.floor(i / 36)), pair(i % 36)];
      counts[drawOrbDiceIndex(limit, () => rolls.shift()!)] += 1;
    }
    assert.deepEqual(counts, Array(limit).fill(cutoff / limit));
  }
  const rolls = [pair(35), pair(35), pair(0), pair(12)];
  assert.equal(drawOrbDiceIndex(78, () => rolls.shift()!), 12);
});

test('the I Ching dice variant has the three-coin distribution and retries rejected pairs', () => {
  const counts = [0, 0, 0, 0];
  for (let i = 0; i < 32; i += 1) {
    const rolls = [pair(35), pair(i)];
    const lines = drawOrbIchingLines(() => rolls.shift() ?? pair(i));
    assert.equal(lines.length, 6);
    for (const line of lines) counts[line - 6] += 1;
  }
  assert.deepEqual(counts, [24, 72, 72, 24]);
});

test('Web Crypto dice sampling stays within a conservative frequency interval', () => {
  const counts = Array(36).fill(0);
  for (let i = 0; i < 36_000; i += 1) counts[dicePairIndex(rollOrbDice())] += 1;
  for (const count of counts) assert.ok(count >= 800 && count <= 1200, String(count));
});

test('tarot dice fill only empty slots and never draw the same card twice', () => {
  const deck = shuffleOrbDeck();
  for (const picked of [[], [1], [1, 2]]) {
    const positions = drawOrbTarotPositions(deck.length, picked, () => [1, 1]);
    assert.deepEqual(positions, [1, 2, 3]);
    const cards = pickOrbCards(deck, positions, 'dice');
    assert.equal(new Set(cards.map(card => card.nameKo)).size, 3);
  }
  assert.equal(pickOrbCards(deck, [1, 1, 79]).length, 1);
});
