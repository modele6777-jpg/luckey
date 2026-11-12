import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';

// Execute the production release handler without requiring React or browser dependencies.
const source = fs.readFileSync(new URL('../src/components/omniwarp/BigBangButton.tsx', import.meta.url), 'utf8');
const start = source.indexOf('  const handlePointerUp =');
const end = source.indexOf('  const hoverContainerRef =', start);
const handler = stripTypeScriptTypes(source.slice(start, end)) + '\nhandlePointerUp(event);';

function release({ pointerType = 'touch', direction = 'none', duration = 80, distance = 0, disabled = false, aborted = false } = {}) {
  const calls = [];
  const context = {
    event: { pointerId: 1, clientX: distance, clientY: 0 },
    performance: { now: () => duration },
    Math,
    location: '/heal',
    DRAG_ACTIVATION_THRESHOLD: 26,
    WARP_ABORT_DISTANCE: 60,
    isAborted: false,
    isChatView: false,
    isCycleNavigationDisabled: disabled,
    clearTimeout: () => calls.push('clearTimer'),
    calculateWarpMetrics: () => ({ isAborted: aborted }),
    serializeCurrentView: () => ({}),
    cleanupGlobalPointerListeners: () => {},
    stopBlackHoleContinuousHaptic: () => {},
    resetActiveWormholePeek: () => {},
    clearPendingSelection: () => {},
    getActiveSelectionText: () => '',
    triggerHaptic: (kind) => calls.push(`haptic:${kind}`),
    showDirectionFeedback: (value) => calls.push(`feedback:${value}`),
    navigateToAdjacentMenuApp: (side, value) => {
      calls.push(`menu:${side}:${value}`);
      return true;
    },
    goToPreviousDapp: () => calls.push('inside:previous'),
    goToNextDapp: () => calls.push('inside:next'),
    cancelOutOfRangeDrag: () => calls.push('cancel'),
    blowCloverWind: () => calls.push('visual-drag'),
    finishCloverWind: () => calls.push('visual-settle'),
    omniWarpAudio: { playAbort: () => calls.push('abort') },
    sessionStorage: { removeItem: () => {} },
    touchStartRef: { current: { time: 0, x: 0, y: 0, pointerType, direction } },
    maxDragDistanceRef: { current: distance },
    downDirectionRef: { current: direction },
    isPttRecordingRef: { current: false },
    singleTapTimerRef: { current: 123 },
    lastTapTimeRef: { current: 0 },
    visualDragRef: { current: false },
  };
  for (const name of new Set(source.match(/\bset[A-Z]\w*(?=\()/g))) context[name] = () => {};
  for (const name of new Set(source.match(/\b\w+Ref(?=\.current)/g))) context[name] = { current: null };
  Object.assign(context, {
    touchStartRef: { current: { time: 0, x: 0, y: 0, pointerType, direction } },
    maxDragDistanceRef: { current: distance },
    downDirectionRef: { current: direction },
    isPttRecordingRef: { current: false },
    singleTapTimerRef: { current: 123 },
    lastTapTimeRef: { current: 0 },
    visualDragRef: { current: false },
  });
  vm.runInNewContext(handler, context);
  return calls;
}

const north = ['clearTimer', 'feedback:north', 'menu:previous:north', 'haptic:wormhole'];
const south = ['clearTimer', 'feedback:south', 'menu:next:south', 'haptic:wormhole'];
assert.deepEqual(release({ direction: 'north' }), north);
assert.deepEqual(release({ direction: 'south' }), south);
assert.deepEqual(release({ direction: 'west' }), ['clearTimer', 'feedback:west', 'inside:previous']);
assert.deepEqual(release({ direction: 'east' }), ['clearTimer', 'feedback:east', 'inside:next']);

// Key/Lucy disable horizontal channel cycling only; vertical menu movement remains available.
assert.deepEqual(release({ direction: 'west', disabled: true }), []);
assert.deepEqual(release({ direction: 'east', disabled: true }), []);
assert.deepEqual(release({ direction: 'north', disabled: true }), north);
assert.deepEqual(release({ direction: 'south', disabled: true }), south);

// Up/down taps switch apps regardless of scroll position; left/right stay in-app; drags never navigate.
for (const direction of ['north', 'south', 'west', 'east']) {
  for (const duration of [80, 300, 800]) {
    const calls = release({ direction, duration });
    assert.equal(calls.some(call => call.startsWith('menu:') || call.startsWith('inside:')), true, `${direction} tap at ${duration}ms navigates`);
  }
}
assert.deepEqual(release({ direction: 'east', distance: 26 }), ['visual-drag', 'visual-settle', 'clearTimer']);
assert.deepEqual(release({ direction: 'south', distance: 80 }), ['cancel']);
assert.deepEqual(release({ direction: 'north', aborted: true }), ['abort', 'haptic:abort']);
console.log('Passed Big Bang gesture regressions: unconditional vertical menu navigation, horizontal in-channel moves, disabled-state, taps, drag no-navigation, and cancellation.');
