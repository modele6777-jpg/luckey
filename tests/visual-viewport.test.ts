import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveAppLayoutHeight } from '../src/lib/visualViewportBox';

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
