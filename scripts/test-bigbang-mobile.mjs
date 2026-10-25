import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';

// Execute the production release handler without requiring React or browser dependencies.
const source = fs.readFileSync(new URL('../src/components/omniwarp/BigBangButton.tsx', import.meta.url), 'utf8');
const start = source.indexOf('  const handlePointerUp =');
const end = source.indexOf('  const hoverContainerRef =', start);
const handler = stripTypeScriptTypes(source.slice(start, end)) + '\nhandlePointerUp(event);';

function release({pointerType = 'touch', direction = 'none', duration = 300, distance = 0, aborted = false}) {
  const calls = [];
  const context = {
    event: {clientX: distance, clientY: 0},
    performance: {now: () => duration},
    Math,
    location: '/',
    DRAG_RECOMMEND_THRESHOLD: 26,
    isAborted: false,
    isChatView: false,
    clearTimeout: () => calls.push('clearTimer'),
    calculateWarpMetrics: () => ({isAborted: aborted}),
    serializeCurrentView: () => ({}),
    cleanupGlobalPointerListeners: () => {},
    stopBlackHoleContinuousHaptic: () => {},
    resetActiveWormholePeek: () => {},
    clearPendingSelection: () => {},
    getActiveSelectionText: () => '',
    triggerHaptic: () => {},
    checkIsInLucyChat: () => false,
    omniWarpAudio: {playAbort: () => calls.push('abort')},
    goToNextRecommended: () => calls.push('drag'),
    sessionStorage: {removeItem: () => {}},
  };
  for (const name of new Set(source.match(/\bset[A-Z]\w*(?=\()/g))) context[name] = () => {};
  for (const name of new Set(source.match(/\b\w+Ref(?=\.current)/g))) context[name] = {current: null};
  Object.assign(context, {
    touchStartRef: {current: {time: 0, x: 0, y: 0, pointerType, direction}},
    maxDragDistanceRef: {current: distance},
    downDirectionRef: {current: direction},
    isPttRecordingRef: {current: false},
    singleTapTimerRef: {current: 123},
    cardinalActionsRef: {current: Object.fromEntries(['scrollToTop', 'scrollToBottom', 'navigateBack', 'navigateForward'].map(name => [name, () => calls.push(name)]))},
    setQuickChatVoiceActive: value => { if (value) calls.push('voice'); },
  });
  vm.runInNewContext(handler, context);
  return calls;
}

const actions = {north: 'scrollToTop', south: 'scrollToBottom', west: 'navigateBack', east: 'navigateForward'};
for (const [direction, action] of Object.entries(actions)) {
  for (const duration of [80, 300, 800]) {
    assert.deepEqual(release({direction, duration, distance: 8}), ['clearTimer', action], `${direction} ${duration}ms without mouse hover`);
  }
  assert.deepEqual(release({direction, distance: 26}), ['clearTimer', 'drag']);
}
assert.deepEqual(release({direction: 'east', pointerType: 'mouse', duration: 80}), ['clearTimer', 'navigateForward']);
assert.deepEqual(release({direction: 'east', pointerType: 'mouse', duration: 300}), ['voice', 'clearTimer']);
assert.deepEqual(release({duration: 300}), ['voice', 'clearTimer']);
assert.deepEqual(release({direction: 'north', aborted: true}), ['abort']);
console.log('Passed 20 gesture regressions: four directions, touch duration/jitter, drag, mouse, center hold, cancellation.');
