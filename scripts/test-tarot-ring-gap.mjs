import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({
  entryPoints: ['src/components/trinity/tarotRingLayout.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { placeRingCards, ringNeighborGaps, landscapeFanMetrics } = await import(
  'data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64')
);

const ids = Array.from({ length: 78 }, (_, i) => `c${i}`);

function activeIndices(picked) {
  return ids.map((id, i) => i).filter((i) => !picked.has(ids[i]));
}

function assertEvenRing(picked, label) {
  const angles = placeRingCards(ids, picked);
  const active = activeIndices(picked);
  assert.equal(active.length, ids.length - picked.size, label);
  for (let k = 1; k < active.length; k++) {
    assert(angles[active[k]] > angles[active[k - 1]], `${label} order ${active[k - 1]} -> ${active[k]}`);
  }
  const gaps = ringNeighborGaps(angles, active);
  const expected = (2 * Math.PI) / active.length;
  for (const gap of gaps) {
    assert(Math.abs(gap - expected) < 1e-6, `${label} gap ${gap} expected ${expected}`);
  }
  assert.deepEqual(
    active.map((i) => ids[i]),
    ids.filter((id) => !picked.has(id)),
    `${label} keeps deck order`,
  );
  return angles;
}

const full = assertEvenRing(new Set(), '78');
for (let i = 0; i < 78; i++) {
  assert(Math.abs(full[i] - (i * 2 * Math.PI) / 78) < 1e-9);
}

const afterOne = assertEvenRing(new Set(['c10']), '77');
assert(afterOne[9] > (9 * 2 * Math.PI) / 78, 'card before the gap slides toward it');
assert(afterOne[11] < (11 * 2 * Math.PI) / 78, 'card after the gap slides toward it');
assert.equal(afterOne[0], 0, 'anchored ring does not spin when a later card is drawn');

assertEvenRing(new Set(['c0']), 'front card drawn');
assertEvenRing(new Set(['c77']), 'last card drawn');
assertEvenRing(new Set(['c3', 'c4', 'c40', 'c70']), 'several drawn');

const orderBefore = ids.filter((id) => id !== 'c20' && id !== 'c21');
const afterTwo = placeRingCards(ids, new Set(['c20', 'c21']));
const orderAfter = ids
  .map((id, i) => ({ id, angle: afterTwo[i] }))
  .filter((item) => item.id !== 'c20' && item.id !== 'c21')
  .sort((a, b) => a.angle - b.angle)
  .map((item) => item.id);
assert.deepEqual(orderAfter, orderBefore, 'drawing does not reshuffle');

for (const height of [220, 360, 520]) {
  const fan = landscapeFanMetrics(height, 120);
  assert.equal(fan.arcTopY, 120, `arc starts below the slot strip at h=${height}`);
  assert.ok(fan.originY >= height + fan.hubClearance - 1, `glow center stays below the buttons at h=${height}`);
}

console.log('Tarot ring gap: even spacing, preserved order, and seam closure passed for 78 down to fewer cards.');
