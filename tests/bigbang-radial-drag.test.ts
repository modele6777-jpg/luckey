import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWarpMetrics, RADIAL_WARP_APPS } from '../src/lib/omniWarp/forceSensor';

test('all 360 degrees remain available and continuously select the seven radial sectors', () => {
  const seen = new Set<number>();
  for (let degrees = 0; degrees < 360; degrees++) {
    const radians = degrees * Math.PI / 180;
    const metrics = calculateWarpMetrics(0, 400, 0, 0, Math.sin(radians) * 80, -Math.cos(radians) * 80);
    assert.equal(metrics.phase, 'event_horizon');
    assert.equal(metrics.isAborted, false);
    assert.equal(metrics.radialSectorIndex, Math.floor(((degrees + 180 / 7) % 360) / (360 / 7)));
    seen.add(metrics.radialSectorIndex!);
  }
  assert.equal(seen.size, RADIAL_WARP_APPS.length);
});
test('short drags use the inner wormhole and out-of-range drags cancel', () => {
  assert.equal(calculateWarpMetrics(0, 400, 0, 0, 32, 0).phase, 'wormhole');
  const outside = calculateWarpMetrics(0, 400, 0, 0, 0, -250);
  assert.equal(outside.isAborted, true);
  assert.equal(outside.radialSectorIndex, -1);
  assert.equal(outside.phase, 'aborted');
});
