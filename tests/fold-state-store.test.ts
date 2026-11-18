import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyFold, measureFoldState, resetFoldStateForTests } from '../src/lib/foldState.ts';

test('fold rule: cover stays one screen in both directions, inner display is dual', () => {
  assert.equal(classifyFold(461, 678).unfolded, false, 'cover portrait');
  assert.equal(classifyFold(678, 461).unfolded, false, 'cover landscape');
  assert.equal(classifyFold(400, 700).unfolded, false, 'ordinary phone');
  assert.equal(classifyFold(951, 537).unfolded, true, 'inner landscape Safari canvas');
  assert.equal(classifyFold(626, 890).unfolded, true, 'inner portrait');
  assert.equal(classifyFold(400, 700, true).unfolded, true, 'spanned hinge');
});

function fakeWindow(size: { cw: number; ch: number; iw: number; ih: number }, active: string | null = null) {
  return {
    innerWidth: size.iw, innerHeight: size.ih,
    matchMedia: () => ({ matches: false }),
    document: {
      documentElement: { clientWidth: size.cw, clientHeight: size.ch },
      activeElement: active ? { tagName: active, isContentEditable: false } : null,
    },
  } as unknown as Window;
}

test('rendered canvas wins over a stale innerWidth (installed iOS web app)', () => {
  resetFoldStateForTests();
  assert.equal(measureFoldState(fakeWindow({ cw: 900, ch: 700, iw: 400, ih: 700 })).unfolded, true, 'unfolded while innerWidth is stuck folded');
  resetFoldStateForTests();
  assert.equal(measureFoldState(fakeWindow({ cw: 400, ch: 700, iw: 900, ih: 700 })).unfolded, false, 'folded while innerWidth is stuck unfolded');
});

test('a keyboard shrinking height at the same width never folds the screen', () => {
  resetFoldStateForTests();
  assert.equal(measureFoldState(fakeWindow({ cw: 700, ch: 860, iw: 700, ih: 860 })).unfolded, true);
  assert.equal(measureFoldState(fakeWindow({ cw: 700, ch: 420, iw: 700, ih: 420 }, 'TEXTAREA')).unfolded, true, 'keyboard open in unfolded portrait');
  assert.equal(measureFoldState(fakeWindow({ cw: 461, ch: 678, iw: 461, ih: 678 })).unfolded, false, 'a real fold changes width');
});

test('rotating the inner display with the keyboard open stays unfolded', () => {
  resetFoldStateForTests();
  const win = (cw: number, ch: number, active: string | null) => ({
    innerWidth: cw, innerHeight: ch, screen: { width: 626, height: 890 }, navigator: { maxTouchPoints: 5 }, matchMedia: () => ({ matches: false }),
    document: { documentElement: { clientWidth: cw, clientHeight: ch }, activeElement: active ? { tagName: active, isContentEditable: false } : null },
  } as unknown as Window);
  assert.equal(measureFoldState(win(626, 890, null)).unfolded, true);
  assert.equal(measureFoldState(win(626, 500, 'TEXTAREA')).unfolded, true, 'keyboard opens in portrait');
  const rotated = measureFoldState(win(890, 326, 'TEXTAREA'));
  assert.equal(rotated.unfolded, true, 'resizes-content rotation keeps the inner display dual');
  assert.equal(rotated.orientation, 'landscape');
  assert.equal(measureFoldState(win(461, 678, null)).unfolded, false, 'a real fold still folds');
});

test('a field focused before the keyboard opens still keeps the full height (split window)', () => {
  resetFoldStateForTests();
  const win = (cw: number, ch: number) => ({
    innerWidth: cw, innerHeight: ch, screen: { width: 1024, height: 1366 }, navigator: { maxTouchPoints: 5 }, matchMedia: () => ({ matches: false }),
    document: { documentElement: { clientWidth: cw, clientHeight: ch }, activeElement: { tagName: 'TEXTAREA', isContentEditable: false } },
  } as unknown as Window);
  const first = measureFoldState(win(700, 860));
  assert.equal(first.unfolded, true);
  const typing = measureFoldState(win(700, 420));
  assert.equal(typing.unfolded, true, 'keyboard-reduced height keeps the dual layout');
  assert.equal(typing.orientation, 'portrait');
});

test('a short desktop window with a focused field is not treated as keyboard-occluded', () => {
  resetFoldStateForTests();
  const win = {
    innerWidth: 1024, innerHeight: 450, screen: { width: 1024, height: 768 }, navigator: { maxTouchPoints: 0 }, matchMedia: () => ({ matches: false }),
    document: { documentElement: { clientWidth: 1024, clientHeight: 450 }, activeElement: { tagName: 'TEXTAREA', isContentEditable: false } },
  } as unknown as Window;
  const before = classifyFold(1024, 450);
  assert.deepEqual(measureFoldState(win), before, 'no screen-height substitution without a software keyboard');
});
