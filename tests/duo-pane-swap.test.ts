import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { isDuoDividerDoubleTap, mapDuoPaneSide, shouldResetDuoPaneSwapOnFold, type DuoDividerTap } from '../src/lib/duoPaneSwap';

const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const cssSource = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

function tap(overrides: Partial<DuoDividerTap> = {}): DuoDividerTap {
  return { timestamp: 1_000, clientX: 500, clientY: 400, pointerType: 'touch', ...overrides };
}

test('a second tap anywhere vertically along the divider within the touch window swaps panes', () => {
  assert.equal(isDuoDividerDoubleTap(tap({ clientY: 20 }), tap({ timestamp: 1_300, clientX: 548, clientY: 1_200 })), true);
});

test('a single divider tap does not swap panes', () => {
  assert.equal(isDuoDividerDoubleTap(null, tap()), false);
});

test('divider taps outside the time, distance, or pointer-type window do not swap', () => {
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 1_500 })), false);
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 1_200, clientX: 549 })), false);
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 1_200, pointerType: 'mouse' })), false);
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 900 })), false);
});

test('physical pane tracking follows the swapped screen for folded-cover selection', () => {
  assert.equal(mapDuoPaneSide('left', false), 'left');
  assert.equal(mapDuoPaneSide('right', false), 'right');
  assert.equal(mapDuoPaneSide('left', true), 'right');
  assert.equal(mapDuoPaneSide('right', true), 'left');
});

test('pane order resets when an unfolded screen is folded, but not on initial unfold or rotation', () => {
  assert.equal(shouldResetDuoPaneSwapOnFold(true, false), true);
  assert.equal(shouldResetDuoPaneSwapOnFold(false, true), false);
  assert.equal(shouldResetDuoPaneSwapOnFold(true, true), false);
  assert.equal(shouldResetDuoPaneSwapOnFold(false, false), false);
  assert.match(appSource, /shouldResetDuoPaneSwapOnFold\(wasUnfolded, isNowUnfolded\)[\s\S]*?setDuoPanesSwapped\(false\)/);
});

test('the divider control is limited to unfolded landscape and swapped panes reserve the right menu rail', () => {
  assert.match(appSource, /isDuoLandscape && \(/);
  assert.match(appSource, /aria-label=\{isDuoPanesSwapped/);
  assert.match(appSource, /data-duo-divider-swap[\s\S]*?inset-y-0[\s\S]*?opacity-0/);
  assert.match(appSource, /onPointerUp=\{handleDuoDividerPointerUp\}/);
  assert.match(appSource, /setDuoPanesSwapped\(\(previous\) => !previous\)/);
  assert.doesNotMatch(appSource, /ArrowLeftRight/);
  assert.match(appSource, /flex-row-reverse/);
  assert.match(cssSource, /html\.duo-unfolded-landscape\.duo-panels-swapped #duo-content-viewport/);
  assert.match(cssSource, /html\.duo-unfolded-landscape\.duo-panels-swapped #duo-lucy-viewport/);
});
