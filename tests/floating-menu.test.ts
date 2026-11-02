import assert from 'node:assert/strict';
import test from 'node:test';
import { clampMenuPosition, snapMenuPosition, placeMenuPanel } from '../src/lib/floatingMenuGeometry';

const button = { width: 64, height: 64 };
const cover = { left: 0, top: 0, width: 382, height: 678 };

test('offscreen and invalid positions recover inside the available viewport', () => {
  assert.deepEqual(clampMenuPosition({ x: 9999, y: -500 }, button, cover), { x: 306, y: 12 });
  assert.deepEqual(clampMenuPosition({ x: NaN, y: Infinity }, button, cover), { x: 12, y: 602 });
});

test('snap uses the measured button width instead of a hard-coded pill width', () => {
  assert.deepEqual(snapMenuPosition({ x: 280, y: 300 }, button, cover), { x: 306, y: 300 });
  assert.deepEqual(snapMenuPosition({ x: 280, y: 300 }, { width: 110, height: 44 }, cover), { x: 260, y: 300 });
});

test('the saved right edge is retained when switching from cover to inner display', () => {
  assert.deepEqual(snapMenuPosition({ x: 306, y: 400 }, button, { left: 0, top: 0, width: 951, height: 620 }, 'right'), { x: 875, y: 400 });
});

test('keyboard, safe areas, and visual viewport offsets bound the button', () => {
  assert.deepEqual(clampMenuPosition({ x: -10, y: 600 }, button, { left: 20, top: 50, width: 340, height: 250 }), { x: 32, y: 224 });
});

test('the panel opens above a low anchor and below a high anchor without clipping', () => {
  const panel = { width: 350, height: 400 };
  assert.deepEqual(placeMenuPanel({ x: 306, y: 600 }, button, panel, cover), { x: 20, y: 188 });
  assert.deepEqual(placeMenuPanel({ x: 12, y: 12 }, button, panel, cover), { x: 12, y: 88 });
});

test('a short viewport keeps a resized panel fully in view', () => {
  const bounds = { left: 0, top: 0, width: 320, height: 280 };
  const panel = { width: 296, height: 256 };
  assert.deepEqual(placeMenuPanel({ x: 244, y: 200 }, button, panel, bounds), { x: 12, y: 12 });
});

test('a side panel leaves the floating button and close controls unobstructed', () => {
  const bounds = { left: 0, top: 0, width: 320, height: 300 };
  assert.deepEqual(placeMenuPanel({ x: 244, y: 12 }, button, { width: 220, height: 276 }, bounds), { x: 12, y: 12 });
  assert.deepEqual(placeMenuPanel({ x: 12, y: 180 }, button, { width: 220, height: 276 }, bounds), { x: 88, y: 12 });
});
