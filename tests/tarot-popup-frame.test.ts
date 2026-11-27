import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { paneLayerStyle } from '../src/components/layout/paneOverlayHost.ts';

const read = (path: string) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
const duoWorkspace = read('components/layout/DuoWorkspace.tsx');
const paneHost = read('components/layout/paneOverlayHost.ts');
const styles = read('styles/duo-workspace.css');
const indexStyles = read('index.css');
const backModal = read('components/trinity/TarotCardBackCustomizerModal.tsx');
const zoomModal = read('components/trinity/TarotCardZoomModal.tsx');

/** Folded iPhone Duo cover canvas: 466px screen minus the 80px rail. */
test('a dialog is hosted on the visible canvas, not on the pane it was opened from', () => {
  // A pane can be half the canvas (unfolded duo) or narrower than the screen
  // (vw-derived pane widths), which left dialogs small, short and pushed aside.
  assert.match(duoWorkspace, /usePaneOverlayHost\(pane, 'canvas'\)/);
  assert.match(duoWorkspace, /data-overlay-scope="canvas"/);
  assert.match(paneHost, /export type OverlayHostScope = 'canvas' \| 'pane'/);
  assert.match(paneHost, /scope === 'canvas'[\s\S]{0,160}sites-pinned-main/);
  // Loading and transition overlays keep covering only their own pane.
  assert.match(indexStyles, /html\.duo-unfolded-mode #duo-content-viewport \.screen-portal/);
  assert.match(indexStyles, /html\.duo-unfolded-mode #duo-content-viewport \.duo-portal/);
});

test('dialog geometry comes from the canvas so a half-screen pane cannot shorten it', () => {
  assert.match(duoWorkspace, /const viewportStyle = useMainOverlayViewport\('main'\)/);
  const layer = paneLayerStyle({
    left: 120, top: 0, width: 400, height: 300, right: 'auto', bottom: 'auto',
    '--overlay-width': '400px', '--overlay-height': '900px',
  } as never);
  assert.equal(layer.position, 'absolute');
  assert.equal(layer.width, '100%');
  assert.equal(layer.height, '100%');
  assert.equal((layer as Record<string, unknown>)['--overlay-height'], '900px');
  assert.equal((layer as Record<string, unknown>).left, 0, 'measured left is replaced by the host box');
});

test('canvas dialog layer fills the host and keeps phone gutters', () => {
  assert.match(styles, /\.duo-portal\[data-overlay-scope='canvas'\] > \.fixed\.inset-0 \{[^}]*width: 100% !important/s);
  const mobilePad = styles.match(/\.duo-portal > \.fixed\.inset-0 \{\s*padding: ([^;]+);/)?.[1] ?? '';
  assert.match(mobilePad, /safe-area-inset-left/);
  assert.match(mobilePad, /\.75rem/, 'phone gutter stays narrow enough to use the whole canvas');
  assert.match(styles, /@media \(min-width: 640px\) \{\s*\.duo-portal > \.fixed\.inset-0 \{/);
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
  assert.match(zoomModal, /duo-dialog-panel relative w-full max-w-md/);
  assert.doesNotMatch(zoomModal, /max-w-\[94vw\]/, 'a vw cap can be narrower than the visible canvas');
  assert.match(zoomModal, /max-h-\[calc\(100dvh-1rem\)\]/);
  assert.match(zoomModal, /flex flex-wrap items-center justify-between gap-x-2 gap-y-1/);
  assert.match(zoomModal, /shrink-0 whitespace-nowrap text-\[9px\] font-mono font-bold[^"]*">\s*역방향 적용됨/);
});
