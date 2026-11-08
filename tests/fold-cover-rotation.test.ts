import assert from 'node:assert/strict';
import test from 'node:test';
import { isDuoUnfoldedState, isDualPaneLayout } from '../src/lib/perfMode';

test('outer cover remains one screen through portrait and landscape rotation', () => {
  const previous = globalThis.window;
  const viewport = { innerWidth: 420, innerHeight: 960, matchMedia: () => ({ matches: false }) };
  Object.assign(globalThis, { window: viewport });
  try {
    for (const [width, height] of [[420, 960], [960, 420], [390, 844], [844, 390]]) {
      viewport.innerWidth = width;
      viewport.innerHeight = height;
      assert.equal(isDuoUnfoldedState().unfolded, false, `${width}x${height}`);
      assert.equal(isDualPaneLayout(), false, `${width}x${height}`);
    }
    viewport.innerWidth = 960;
    viewport.innerHeight = 840;
    assert.equal(isDuoUnfoldedState().unfolded, true);
    viewport.innerWidth = 840;
    viewport.innerHeight = 960;
    assert.equal(isDuoUnfoldedState().unfolded, true);
  } finally { Object.assign(globalThis, { window: previous }); }
});

test('explicit spanned screens remain unfolded even with a narrow viewport', () => {
  const previous = globalThis.window;
  Object.assign(globalThis, { window: { innerWidth: 540, innerHeight: 720, matchMedia: () => ({ matches: true }) } });
  try { assert.equal(isDuoUnfoldedState().unfolded, true); }
  finally { Object.assign(globalThis, { window: previous }); }
});
