import assert from 'node:assert/strict';
import test from 'node:test';
import { applyVisualViewportBox, isKeyboardViewportOpen, resolveAppLayoutHeight } from '../src/lib/visualViewportBox';

test('portrait uses the newer visible height once the viewport widths agree', () => {
  const layout = { innerWidth: 390, innerHeight: 760 };
  assert.equal(resolveAppLayoutHeight({
    ...layout, visual: { width: 844, height: 390, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 760px)');
  assert.equal(resolveAppLayoutHeight({
    ...layout, visual: { width: 390, height: 844, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 844px)');
});

test('only an installed iOS tablet fills a corroborated shortfall to the screen edge', () => {
  const layout = { innerWidth: 768, innerHeight: 945, screenWidth: 768, screenHeight: 1024 };
  assert.equal(resolveAppLayoutHeight(layout), 'max(100dvh, 945px)');
  assert.equal(resolveAppLayoutHeight({ ...layout, iosStandalone: true }), 'max(100dvh, 1024px)');
});

test('a shorter visual viewport cannot shrink the app below the layout bottom', () => {
  assert.equal(resolveAppLayoutHeight({
    innerWidth: 1280, innerHeight: 900,
    visual: { width: 1280, height: 790, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 900px)');
});

test('a landscape tablet still fills the screen when its shortened web view falls below 600px', () => {
  const snapshot = {
    iosStandalone: true,
    innerWidth: 960, innerHeight: 592.5,
    screenWidth: 960, screenHeight: 675,
    visual: { width: 960, height: 592.5, offsetTop: 0, offsetLeft: 0 },
  };
  assert.equal(resolveAppLayoutHeight(snapshot), 'max(100dvh, 675px)');
  assert.equal(resolveAppLayoutHeight({ ...snapshot, iosStandalone: false }), 'max(100dvh, 592.5px)');
});

test('phone and keyboard-sized shrinkage do not expand to the screen', () => {
  assert.equal(resolveAppLayoutHeight({
    iosStandalone: true, innerWidth: 390, innerHeight: 760,
    screenWidth: 390, screenHeight: 844,
  }), 'max(100dvh, 760px)');
  assert.equal(resolveAppLayoutHeight({
    iosStandalone: true, innerWidth: 960, innerHeight: 350,
    screenWidth: 960, screenHeight: 675,
    visual: { width: 960, height: 350, offsetTop: 0, offsetLeft: 0 },
  }), 'max(100dvh, 350px)');
});

test('keyboard dismissal restores a small stale gap even while the textarea stays focused', () => {
  const snapshot = {
    iosStandalone: true, innerWidth: 1280, innerHeight: 790,
    screenWidth: 1280, screenHeight: 900,
    visual: { width: 1280, height: 790, offsetTop: 0, offsetLeft: 0 },
  };
  assert.equal(isKeyboardViewportOpen(snapshot, true), false);
  assert.equal(resolveAppLayoutHeight(snapshot), 'max(100dvh, 900px)');
  const open = { ...snapshot, visual: { ...snapshot.visual, height: 450 } };
  assert.equal(isKeyboardViewportOpen(open, true), true);
  assert.equal(isKeyboardViewportOpen(open, false), false);
  assert.equal(isKeyboardViewportOpen({ ...open, innerHeight: 450 }, true), true);
});

test('browser toolbars and rotated viewport widths do not masquerade as keyboards', () => {
  assert.equal(isKeyboardViewportOpen({
    innerWidth: 390, innerHeight: 760, screenWidth: 390, screenHeight: 844,
    visual: { width: 390, height: 650, offsetTop: 0, offsetLeft: 0 },
  }, true), false);
  assert.equal(isKeyboardViewportOpen({
    innerWidth: 390, innerHeight: 844,
    visual: { width: 844, height: 390, offsetTop: 0, offsetLeft: 0 },
  }, true), false);
});

test('restoring the same viewport repairs height variables overwritten by the keyboard hook', () => {
  const values = new Map<string, string>();
  const root = {
    style: {
      setProperty: (key: string, value: string) => { values.set(key, value); },
      getPropertyValue: (key: string) => values.get(key) ?? '',
    },
    toggleAttribute: () => {},
  } as unknown as HTMLElement;
  const full = { width: 1280, height: 900, offsetTop: 0, offsetLeft: 0, bottomGap: 0 };
  applyVisualViewportBox(full, root);
  values.set('--vvh', '450px');
  values.set('--visual-vh', '450px');
  values.set('--vv-top', '100px');
  applyVisualViewportBox(full, root);
  assert.equal(values.get('--vvh'), '900px');
  assert.equal(values.get('--visual-vh'), '900px');
  assert.equal(values.get('--vv-top'), '0px');
});
