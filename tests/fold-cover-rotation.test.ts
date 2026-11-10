import assert from 'node:assert/strict';
import test from 'node:test';
import { isDuoUnfoldedState, isDualPaneLayout, resolveDuoViewport } from '../src/lib/perfMode';

/**
 * Viewport sizes used below:
 *
 * Cover / folded phone. The shorter side is the phone width and stays put
 * when the device rotates.
 * - Installed iPhone Duo cover readings: 450×640 CSS px (standalone), and the
 *   shorter innerHeight 450×562 before CSS viewport fill.
 * - Comment geometry for the 5.4" outer panel: 1398×2034 physical ≈ 466×678 at 3x.
 * - Ordinary phones: 390×844, 430×932. Landscape is wide but the short side
 *   stays 390–466, under the 540 cover guard.
 *
 * Inner / unfolded. Both orientations stay dual.
 * - 7.6" inner panel: 1878×2670 physical ≈ 626×890 CSS px (ratio ≈ 0.70).
 *   The long side is 890, so this stays dual through `longSide >= 768`
 *   even though 626/890 is just under the 0.72 nearer-square clause.
 * - Existing inner samples: 840×960 and 960×840 (short side 840, ratio 0.875).
 * - Unfolded portrait cold-launch sample: 900×1170.
 * - iPad / spanned Surface Duo stay on the same long-side rule: 768×1024,
 *   1024×768, 1114×720.
 *
 * 540 is the cover ceiling because it is the existing portrait guard: above
 * the cover (~450–466) and below the inner short side (~626). A landscape
 * viewport whose height is still that cover width must not become dual just
 * because its width crosses 600 or its long side crosses 768.
 */

const FOLDED = [
  [450, 640],
  [640, 450],
  [450, 562],
  [562, 450],
  [466, 678],
  [678, 466],
  [390, 844],
  [844, 390],
  [430, 932],
  [932, 430],
  [420, 960],
  [960, 420],
] as const;

const UNFOLDED = [
  [626, 890],
  [890, 626],
  [840, 960],
  [960, 840],
  [900, 1170],
  [1170, 900],
  [768, 1024],
  [1024, 768],
  [1114, 720],
  [720, 1114],
] as const;

function orientationOf(width: number, height: number): 'landscape' | 'portrait' {
  return width > height ? 'landscape' : 'portrait';
}

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
  } finally {
    Object.assign(globalThis, { window: previous });
  }
});

test('folded portrait and landscape stay on one page', () => {
  for (const [width, height] of FOLDED) {
    const state = resolveDuoViewport(width, height);
    assert.equal(state.unfolded, false, `${width}x${height}`);
    assert.equal(state.orientation, orientationOf(width, height), `${width}x${height}`);
  }
});

test('rotating a folded phone keeps the same single page', () => {
  const pairs = [
    [[450, 640], [640, 450]],
    [[466, 678], [678, 466]],
    [[390, 844], [844, 390]],
    [[430, 932], [932, 430]],
    [[420, 960], [960, 420]],
  ] as const;

  for (const [portrait, landscape] of pairs) {
    const before = resolveDuoViewport(portrait[0], portrait[1]);
    const after = resolveDuoViewport(landscape[0], landscape[1]);
    assert.equal(before.unfolded, false);
    assert.equal(before.orientation, 'portrait');
    assert.equal(after.unfolded, false, `${landscape[0]}x${landscape[1]}`);
    assert.equal(after.orientation, 'landscape');
    // App.tsx navigates only on unfolded → folded. Rotation never takes that path.
    assert.equal(before.unfolded && !after.unfolded, false);
    assert.equal(after.unfolded && !before.unfolded, false);
  }
});

test('unfolded portrait and landscape keep the current dual layout', () => {
  for (const [width, height] of UNFOLDED) {
    const state = resolveDuoViewport(width, height);
    assert.equal(state.unfolded, true, `${width}x${height}`);
    assert.equal(state.orientation, orientationOf(width, height), `${width}x${height}`);
  }
});

test('rotating the inner display does not fold it', () => {
  const pairs = [
    [[626, 890], [890, 626]],
    [[840, 960], [960, 840]],
    [[900, 1170], [1170, 900]],
    [[768, 1024], [1024, 768]],
  ] as const;

  for (const [portrait, landscape] of pairs) {
    const before = resolveDuoViewport(portrait[0], portrait[1]);
    const after = resolveDuoViewport(landscape[0], landscape[1]);
    assert.equal(before.unfolded, true, `${portrait[0]}x${portrait[1]}`);
    assert.equal(before.orientation, 'portrait');
    assert.equal(after.unfolded, true, `${landscape[0]}x${landscape[1]}`);
    assert.equal(after.orientation, 'landscape');
  }
});

test('window fold state and dual-pane layout share resolveDuoViewport', () => {
  const previous = globalThis.window;
  const viewport = { innerWidth: 450, innerHeight: 640, matchMedia: () => ({ matches: false }) };
  Object.assign(globalThis, { window: viewport });
  try {
    for (const [width, height] of FOLDED) {
      viewport.innerWidth = width;
      viewport.innerHeight = height;
      const state = isDuoUnfoldedState();
      assert.deepEqual(state, resolveDuoViewport(width, height), `${width}x${height}`);
      assert.equal(isDualPaneLayout(), false, `${width}x${height}`);
    }
    for (const [width, height] of UNFOLDED) {
      viewport.innerWidth = width;
      viewport.innerHeight = height;
      const state = isDuoUnfoldedState();
      assert.deepEqual(state, resolveDuoViewport(width, height), `${width}x${height}`);
      assert.equal(isDualPaneLayout(), true, `${width}x${height}`);
    }
  } finally {
    Object.assign(globalThis, { window: previous });
  }
});

test('explicit spanned screens remain unfolded even with a narrow viewport', () => {
  assert.equal(resolveDuoViewport(540, 720, true).unfolded, true);
  assert.equal(resolveDuoViewport(720, 540, true).unfolded, true);

  const previous = globalThis.window;
  Object.assign(globalThis, { window: { innerWidth: 540, innerHeight: 720, matchMedia: () => ({ matches: true }) } });
  try {
    assert.equal(isDuoUnfoldedState().unfolded, true);
    assert.equal(isDualPaneLayout(), true);
  } finally {
    Object.assign(globalThis, { window: previous });
  }
});

test('a keyboard on the inner display does not fold it', () => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const viewport = { innerWidth: 900, innerHeight: 1170, matchMedia: () => ({ matches: false }) };
  const classes = new Set<string>();
  Object.assign(globalThis, {
    window: viewport,
    document: {
      activeElement: null,
      documentElement: { classList: { contains: (name: string) => classes.has(name) } },
      body: { classList: { contains: (name: string) => classes.has(name) } },
    },
  });
  try {
    assert.equal(isDuoUnfoldedState().unfolded, true);
    classes.add('keyboard-open');
    viewport.innerHeight = 420;
    const state = isDuoUnfoldedState();
    assert.equal(state.unfolded, true);
    assert.equal(state.orientation, 'portrait');
  } finally {
    Object.assign(globalThis, { window: previousWindow, document: previousDocument });
  }
});
