import assert from 'node:assert/strict';
import test from 'node:test';
import { createViewportSettler, VIEWPORT_SETTLE_DELAYS_MS } from '../src/lib/perfMode.ts';

/** WebKit can report the previous fold size first; layout must re-check after it settles. */
test('fold detection re-checks after the viewport settles, without stacking timers', async () => {
  let calls = 0;
  const settler = createViewportSettler(() => { calls++; });
  settler.trigger();
  settler.trigger(); // a burst of fold events restarts the schedule instead of stacking it
  assert.equal(calls, 2, 'each event is applied immediately');
  await new Promise(resolve => setTimeout(resolve, Math.max(...VIEWPORT_SETTLE_DELAYS_MS) + 100));
  assert.equal(calls, 2 + VIEWPORT_SETTLE_DELAYS_MS.length, 'later re-checks run once per settle delay');
  settler.trigger();
  settler.cancel();
  await new Promise(resolve => setTimeout(resolve, Math.max(...VIEWPORT_SETTLE_DELAYS_MS) + 100));
  assert.equal(calls, 3 + VIEWPORT_SETTLE_DELAYS_MS.length, 'cancel stops pending re-checks');
});
