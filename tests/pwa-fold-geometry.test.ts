import assert from 'node:assert/strict';
import test from 'node:test';
import { getLayoutViewportProbe, readSafeAreaInsets, readViewportSnapshot, resolveLayoutViewportSize, resolveViewportBox } from '../src/lib/visualViewportBox.ts';
import { isDuoUnfoldedState } from '../src/lib/perfMode.ts';

test('PWA uses paired CSS/document width when innerWidth remains at the folded width', () => {
  const source = { iosStandalone: true, innerWidth: 390, innerHeight: 844, layoutViewportWidth: 900, layoutViewportHeight: 760, cssViewportWidth: 900, cssViewportHeight: 760, orientation: 'landscape-primary' };
  assert.deepEqual(resolveLayoutViewportSize(source), { width: 900, height: 760 });
  assert.equal(resolveViewportBox(source)?.width, 900);
  assert.deepEqual(resolveLayoutViewportSize({ ...source, iosStandalone: false }), { width: 390, height: 844 });
  assert.deepEqual(resolveLayoutViewportSize({ ...source, layoutViewportWidth: 390 }), { width: 390, height: 844 });
});
test('PWA fold/unfold detection follows the rendered canvas, without repeated DOM insertions', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let inserted = 0;
  const dimensions = { width: 900, height: 760 };
  const doc: any = {
    activeElement: null,
    documentElement: { clientWidth: 900, clientHeight: 760, classList: { contains: () => false }, appendChild(node: any) { inserted++; node.isConnected = true; } },
    body: { classList: { contains: () => false } },
    createElement() { return { isConnected: false, style: {}, setAttribute() {}, getBoundingClientRect: () => dimensions }; },
  };
  const win: any = {
    document: doc, innerWidth: 390, innerHeight: 844,
    navigator: { userAgent: 'iPhone', standalone: true },
    screen: { width: 900, height: 760, orientation: { type: 'landscape-primary' } },
    CSS: { supports: () => true }, matchMedia: () => ({ matches: false }),
    getComputedStyle: () => ({ paddingTop: '24px', paddingRight: '0px', paddingBottom: '20px', paddingLeft: '0px' }),
  };
  doc.defaultView = win;
  try {
    Object.defineProperty(globalThis, 'window', { value: win, configurable: true });
    assert.equal(isDuoUnfoldedState().unfolded, true);
    const probe = getLayoutViewportProbe(doc);
    for (let i = 0; i < 50; i++) { readViewportSnapshot(win); readSafeAreaInsets(doc); }
    assert.equal(getLayoutViewportProbe(doc), probe);
    assert.equal(inserted, 2, 'one viewport probe and one inset probe, outside body');
    win.innerWidth = 900; win.innerHeight = 760; // JS is now stale in the other direction.
    dimensions.width = 390; dimensions.height = 844;
    doc.documentElement.clientWidth = 390; doc.documentElement.clientHeight = 844;
    assert.equal(isDuoUnfoldedState().unfolded, false);
    assert.equal(inserted, 2);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'window', previous); else delete (globalThis as any).window;
  }
});
