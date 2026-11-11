import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { isDuoDividerDoubleTap, mapDuoPaneSide, type DuoDividerTap } from '../src/lib/duoPaneSwap';

const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const cssSource = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

function tap(overrides: Partial<DuoDividerTap> = {}): DuoDividerTap {
  return { timestamp: 1_000, clientX: 500, clientY: 400, pointerType: 'touch', ...overrides };
}

test('a nearby second tap on the divider within the touch window swaps panes', () => {
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 1_300, clientX: 511, clientY: 405 })), true);
});

test('divider taps outside the time, distance, or pointer-type window do not swap', () => {
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 1_500 })), false);
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 1_200, clientX: 540 })), false);
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 1_200, pointerType: 'mouse' })), false);
  assert.equal(isDuoDividerDoubleTap(tap(), tap({ timestamp: 900 })), false);
});

test('physical pane tracking follows the swapped screen for folded-cover selection', () => {
  assert.equal(mapDuoPaneSide('left', false), 'left');
  assert.equal(mapDuoPaneSide('right', false), 'right');
  assert.equal(mapDuoPaneSide('left', true), 'right');
  assert.equal(mapDuoPaneSide('right', true), 'left');
});

test('the divider control is limited to unfolded landscape and swapped panes reserve the right menu rail', () => {
  assert.match(appSource, /isDuoLandscape && \(/);
  assert.match(appSource, /onPointerUp=\{handleDuoDividerPointerUp\}/);
  assert.match(appSource, /flex-row-reverse/);
  assert.match(cssSource, /html\.duo-unfolded-landscape\.duo-panels-swapped #duo-content-viewport/);
  assert.match(cssSource, /html\.duo-unfolded-landscape\.duo-panels-swapped #duo-lucy-viewport/);
});
