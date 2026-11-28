import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { canvasBoxFromRects, paneLayerStyle } from '../src/components/layout/paneOverlayHost.ts';

const read = (path: string) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
const duoWorkspace = read('components/layout/DuoWorkspace.tsx');
const paneHost = read('components/layout/paneOverlayHost.ts');
const styles = read('styles/duo-workspace.css');
const indexStyles = read('index.css');
const backModal = read('components/trinity/TarotCardBackCustomizerModal.tsx');
const zoomModal = read('components/trinity/TarotCardZoomModal.tsx');

/** Folded iPhone Duo cover canvas: 461px screen minus the 80px rail. */
test('a dialog is hosted on the app frame, not on the pane or main it was opened from', () => {
  // A pane can be half the canvas (unfolded duo) and `main` can be narrower than
  // the screen (rail reserve, fold pass), which left dialogs small and pushed aside.
  assert.match(duoWorkspace, /scope = 'canvas'/, 'generic dialogs remain canvas-scoped by default');
  assert.match(duoWorkspace, /usePaneOverlayHost\(pane, scope\)/);
  assert.match(duoWorkspace, /data-overlay-scope=\{scope\}/);
  assert.match(paneHost, /export type OverlayHostScope = 'canvas' \| 'pane'/);
  assert.match(paneHost, /SHELL_SELECTOR = '\.prism-app-shell'/);
  assert.ok(
    paneHost.indexOf("document.querySelector<HTMLElement>(SHELL_SELECTOR)") < paneHost.indexOf("document.querySelector<HTMLElement>(MAIN_SELECTOR)"),
    'the app frame is preferred over main, whose width can be narrower than the canvas',
  );
  // Loading and transition overlays keep covering only their own pane.
  assert.match(indexStyles, /html\.duo-unfolded-mode #duo-content-viewport \.screen-portal/);
});

test('the dialog box is the canvas beside the rail, whichever edge the rail takes', () => {
  const host = { left: 0, top: 0, right: 461, bottom: 678, width: 461, height: 678 };
  // Folded duo and desktop: an 80px rail on the right edge.
  assert.deepEqual(canvasBoxFromRects(host, { left: 381, top: 0, right: 461, bottom: 678, width: 80, height: 678 }), { left: 0, top: 0, right: 80, bottom: 0, railEdge: 'right' });
  // Unfolded portrait turns the rail into a bottom bar.
  assert.deepEqual(canvasBoxFromRects(host, { left: 0, top: 624, right: 461, bottom: 678, width: 461, height: 54 }), { left: 0, top: 0, right: 0, bottom: 54, railEdge: 'bottom' });
  // A rail docked on the left or across the top.
  assert.deepEqual(canvasBoxFromRects(host, { left: 0, top: 0, right: 80, bottom: 678, width: 80, height: 678 }), { left: 80, top: 0, right: 0, bottom: 0, railEdge: 'left' });
  assert.deepEqual(canvasBoxFromRects(host, { left: 0, top: 0, right: 461, bottom: 56, width: 461, height: 56 }), { left: 0, top: 56, right: 0, bottom: 0, railEdge: 'top' });
  // No rail, or a rail that floats inside the frame: the dialog keeps the whole frame.
  assert.deepEqual(canvasBoxFromRects(host, null), { left: 0, top: 0, right: 0, bottom: 0, railEdge: 'none' });
  assert.deepEqual(canvasBoxFromRects(host, { left: 20, top: 20, right: 80, bottom: 300, width: 60, height: 280 }), { left: 0, top: 0, right: 0, bottom: 0, railEdge: 'none' });
  // A rail sitting a few pixels past a frame iOS reported too narrow still counts.
  assert.deepEqual(canvasBoxFromRects(host, { left: 385, top: 0, right: 465, bottom: 678, width: 80, height: 678 }), { left: 0, top: 0, right: 76, bottom: 0, railEdge: 'right' });
});

test('the rail edge of the canvas is marked so the dialog never takes that inset twice', () => {
  // iPhone report (2026-11-28, IMG_0565/0566): the popup layer already stopped at
  // the 80px rail, then still padded itself by env(safe-area-inset-right) — the
  // landscape Dynamic Island inset — so every popup kept a ~72px dark strip on
  // its right while the left gutter was 12px.
  assert.match(duoWorkspace, /data-rail-edge=\{canvasBox\?\.railEdge \?\? 'none'\}/);
  assert.match(paneHost, /export type RailEdge = 'top' \| 'right' \| 'bottom' \| 'left' \| 'none'/);
  assert.match(paneHost, /box\.railEdge = 'right'/);
  // The gutter variables mirror env() in one place.
  assert.ok(styles.includes('.duo-portal,\n.screen-portal,\n.main-viewport-overlay {'), 'both portal layers share the gutter variables');
  for (const edge of ['top', 'right', 'bottom', 'left']) {
    assert.ok(
      styles.includes(`--overlay-inset-${edge}: var(--s${edge === 'top' ? 'at' : edge === 'right' ? 'ar' : edge === 'bottom' ? 'ab' : 'al'}, env(safe-area-inset-${edge}, 0px));`),
      `the ${edge} gutter mirrors the device inset`,
    );
    assert.ok(
      styles.includes(`.duo-portal[data-rail-edge='${edge}'] { --overlay-inset-${edge}: 0px; }`),
      `the ${edge} rail edge drops its own screen inset`,
    );
  }
  const mobilePad = styles.match(/\.duo-portal > \.fixed\.inset-0 \{\s*padding: ([^;]+);/)?.[1] ?? '';
  for (const edge of ['top', 'right', 'bottom', 'left']) {
    assert.ok(mobilePad.includes(`var(--overlay-inset-${edge})`), `the ${edge} gutter reads the rail-aware inset`);
  }
  assert.doesNotMatch(mobilePad, /env\(/, 'no raw env() gutter survives beside the rail');
  assert.ok(mobilePad.includes('max(.5rem, var(--overlay-inset-top))'));
  assert.ok(mobilePad.includes('max(.75rem, var(--overlay-inset-right))'), 'the right gutter stays .75rem when the rail owns it');
  assert.match(styles, /@media \(min-width: 640px\) \{\s*\.duo-portal > \.fixed\.inset-0 \{\s*padding: max\(\.75rem, var\(--overlay-inset-top\)\) max\(1rem, var\(--overlay-inset-right\)\)/);
  // The panel's own height cap counts the same rail-aware insets.
  assert.match(styles, /max-height: calc\(var\(--overlay-height, 100dvh\) - var\(--overlay-inset-top, 0px\) - var\(--overlay-inset-bottom, 0px\) - 2rem\)/);
});

test('a canvas box fills the layer while a pane host keeps percentage filling', () => {
  assert.match(duoWorkspace, /const viewportStyle = useMainOverlayViewport\('main'\)/);
  assert.match(duoWorkspace, /const canvasBox = useCanvasLayerBox\(paneHost\)/);
  const layer = paneLayerStyle({
    left: 120, top: 0, width: 400, height: 300, right: 'auto', bottom: 'auto',
    '--overlay-width': '400px', '--overlay-height': '900px',
  } as never, { left: 0, top: 0, right: 80, bottom: 0, width: 381, height: 678 });
  assert.equal(layer.position, 'absolute');
  assert.equal((layer as Record<string, unknown>).right, 80, 'the rail stays outside the popup');
  assert.equal((layer as Record<string, unknown>).width, 'auto', 'insets decide the box, never a parent width');
  assert.equal((layer as Record<string, unknown>)['--overlay-width'], '381px', 'canvas size wins over a narrow host');
  assert.equal((layer as Record<string, unknown>)['--overlay-height'], '678px', 'canvas height wins over a short host');
  const paneLayer = paneLayerStyle({ '--overlay-height': '900px' } as never);
  assert.equal((paneLayer as Record<string, unknown>).width, '100%');
  assert.equal((paneLayer as Record<string, unknown>).left, 0);
});

test('canvas dialog layer fills the host and keeps phone gutters', () => {
  assert.match(styles, /\.duo-portal\[data-overlay-scope='canvas'\] > \.fixed\.inset-0 \{[^}]*width: 100% !important/s);
  const mobilePad = styles.match(/\.duo-portal > \.fixed\.inset-0 \{\s*padding: ([^;]+);/)?.[1] ?? '';
  assert.match(mobilePad, /\.5rem/, 'phone gutter stays narrow enough to use the whole canvas');
  assert.match(styles, /--overlay-inset-left: var\(--sal, env\(safe-area-inset-left, 0px\)\)/);
  assert.match(styles, /@media \(min-width: 640px\) \{\s*\.duo-portal > \.fixed\.inset-0 \{/);
});

test('the two Tarot dialogs use the canvas host, never a pane', () => {
  // v1.8.669: the pane scope left the deck-back and card-detail popups sized by
  // the pane they were opened from, which on the folded cover screen was a main
  // narrower than the frame — the popup stopped short of the rail with a dark
  // strip on its right. Both dialogs are now plain canvas dialogs like every
  // other WorkspacePortal in the app.
  assert.doesNotMatch(backModal, /scope="pane"/, 'the deck-back popup uses the canvas host');
  assert.doesNotMatch(zoomModal, /scope="pane"/, 'the card-detail popup uses the canvas host');
  assert.match(backModal, /<WorkspacePortal onClose=\{onClose\}>/);
  assert.match(zoomModal, /<WorkspacePortal onClose=\{onClose\}>/);
  assert.match(backModal, /duo-dialog-panel[^\"]*duo-tarot-portrait-fill/);
  assert.match(zoomModal, /duo-dialog-panel[^\"]*duo-tarot-portrait-fill/);
});

test('only the two Tarot dialogs fill the whole measured canvas in every layout', () => {
  const rule = styles.match(/html:root :is\(\.screen-portal, \.duo-portal\) > \.fixed\.inset-0 > \.duo-tarot-portrait-fill\s*\{[^}]*\}/)?.[0] ?? '';
  assert.match(rule, /height: 100% !important/);
  assert.match(rule, /max-height: 100% !important/);
  assert.match(rule, /width: 100% !important/);
  assert.match(rule, /max-width: 100% !important/);
  assert.doesNotMatch(styles, /duo-unfolded-portrait \.duo-portal\[data-overlay-scope='pane'\] > \.fixed\.inset-0 > \.duo-tarot-portrait-fill/, 'the fill no longer depends on the pane scope or on one Duo layout');
  assert.match(paneHost, /railOnBottom/);
  assert.match(styles, /\.duo-dialog-body \{ min-height: 0; overflow-y: auto;/);
  assert.match(backModal, /flex-1 min-h-0 overflow-y-auto no-scrollbar[^\"]*duo-dialog-body/);
  assert.match(zoomModal, /className=\"duo-dialog-body\"/);
});

test('the floating Big Bang orb steps aside while a popup is open', () => {
  // Popup layers live inside the app shell, below the orb's own stacking level,
  // so it painted over dialog text (deck name, hashtags) and swallowed taps.
  const rule = styles.match(/body:has\(\[data-screen-overlay-layer\]:not\(:empty\)\) \.bottom-safe-fab-center[\s\S]*?\}/)?.[0] ?? '';
  assert.match(rule, /visibility: hidden !important/);
  assert.match(rule, /pointer-events: none !important/);
  assert.match(styles, /body:has\(\.duo-portal > \*, \.screen-portal > \*\) \.bottom-safe-fab-center/);
});

test('TarotCardBackCustomizerModal keeps its header on one row on a phone canvas', () => {
  assert.match(backModal, /px-3\.5 py-3 sm:px-6 sm:py-4/);
  const badge = backModal.match(/<span className="([^"]*)">\s*일러스트 컬렉션 \{TAROT_CARD_BACKS\.length\}종/)?.[1] ?? '';
  assert.match(badge, /\bshrink-0\b/);
  assert.match(badge, /\bwhitespace-nowrap\b/);
  assert.match(backModal, /flex flex-wrap items-center gap-x-2 gap-y-1/, 'badge wraps to its own line instead of squeezing');
  assert.match(backModal, /hidden sm:block text-xs text-white\/60 truncate/, 'description is dropped on the phone header');
});

test('TarotCardBackCustomizerModal shows the deck grid on open and splits at lg', () => {
  // Compact horizontal preview on phones, stacked showcase in the lg two-column body.
  assert.match(backModal, /flex flex-row items-start gap-3 lg:flex-col/);
  assert.match(backModal, /lg:grid lg:grid-cols-\[minmax\(0,17rem\)_minmax\(0,1fr\)\]/);
  assert.match(backModal, /grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4/, 'at least two deck columns on phones');
  assert.match(backModal, /max-h-\[calc\(100dvh-1rem\)\]/);
  assert.match(backModal, /duo-dialog-panel/);
  assert.match(backModal, /duo-dialog-heading/);
  assert.match(backModal, /duo-dialog-body/);
});

test('TarotCardBackCustomizerModal footer stays on one line', () => {
  assert.match(backModal, /px-3\.5 py-2\.5 sm:px-6 sm:py-3\.5 border-t/);
  assert.match(backModal, /<span className="min-w-0 truncate">\s*현재 설정/);
  assert.match(backModal, /shrink-0 px-4 py-1\.5[^"]*whitespace-nowrap/);
});

test('TarotCardZoomModal fits the canvas and never overlaps its own heading', () => {
  assert.match(zoomModal, /duo-dialog-panel duo-tarot-portrait-fill relative w-full max-w-md/);
  assert.doesNotMatch(zoomModal, /max-w-\[94vw\]/, 'a vw cap can be narrower than the visible canvas');
  assert.match(zoomModal, /max-h-\[calc\(100dvh-1rem\)\]/);
  assert.match(zoomModal, /flex flex-wrap items-center justify-between gap-x-2 gap-y-1/);
  assert.match(zoomModal, /shrink-0 whitespace-nowrap text-\[9px\] font-mono font-bold[^"]*">\s*역방향 적용됨/);
});
