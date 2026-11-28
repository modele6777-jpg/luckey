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
  assert.deepEqual(canvasBoxFromRects(host, { left: 381, top: 0, right: 461, bottom: 678, width: 80, height: 678 }), { left: 0, top: 0, right: 80, bottom: 0 });
  // Unfolded portrait turns the rail into a bottom bar.
  assert.deepEqual(canvasBoxFromRects(host, { left: 0, top: 624, right: 461, bottom: 678, width: 461, height: 54 }), { left: 0, top: 0, right: 0, bottom: 54 });
  // A rail docked on the left or across the top.
  assert.deepEqual(canvasBoxFromRects(host, { left: 0, top: 0, right: 80, bottom: 678, width: 80, height: 678 }), { left: 80, top: 0, right: 0, bottom: 0 });
  assert.deepEqual(canvasBoxFromRects(host, { left: 0, top: 0, right: 461, bottom: 56, width: 461, height: 56 }), { left: 0, top: 56, right: 0, bottom: 0 });
  // No rail, or a rail that floats inside the frame: the dialog keeps the whole frame.
  assert.deepEqual(canvasBoxFromRects(host, null), { left: 0, top: 0, right: 0, bottom: 0 });
  assert.deepEqual(canvasBoxFromRects(host, { left: 20, top: 20, right: 80, bottom: 300, width: 60, height: 280 }), { left: 0, top: 0, right: 0, bottom: 0 });
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
  assert.match(mobilePad, /safe-area-inset-left/);
  assert.match(mobilePad, /\.75rem/, 'phone gutter stays narrow enough to use the whole canvas');
  assert.match(styles, /@media \(min-width: 640px\) \{\s*\.duo-portal > \.fixed\.inset-0 \{/);
});

test('only the two Tarot dialogs fill the safe-area-padded active pane in expanded portrait Duo', () => {
  const rule = styles.match(/html\.duo-unfolded-portrait \.duo-portal\[data-overlay-scope='pane'\] > \.fixed\.inset-0 > \.duo-tarot-portrait-fill\s*\{[^}]*\}/)?.[0] ?? '';
  assert.match(rule, /height: 100% !important/);
  assert.match(rule, /max-height: 100% !important/);
  assert.match(backModal, /<WorkspacePortal onClose=\{onClose\} scope="pane">/);
  assert.match(zoomModal, /<WorkspacePortal onClose=\{onClose\} scope="pane">/);
  assert.match(backModal, /duo-dialog-panel[^\"]*duo-tarot-portrait-fill/);
  assert.match(zoomModal, /duo-dialog-panel[^\"]*duo-tarot-portrait-fill/);
  assert.match(styles, /padding: max\(\.5rem, env\(safe-area-inset-top, 0px\)\)[^;]*max\(\.5rem, env\(safe-area-inset-bottom, 0px\)\)/);
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
