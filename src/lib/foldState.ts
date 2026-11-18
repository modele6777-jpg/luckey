/**
 * Single source of truth for the folded / unfolded screen frame.
 *
 * Every consumer (App panes, navigation, Lucy, Big Bang, popups) reads this one
 * snapshot, so a fold can never leave one part folded and another unfolded.
 *
 * Size comes from the rendered layout (`documentElement.clientWidth/Height`),
 * not `innerWidth`: installed iOS web apps and Safari can keep reporting the
 * previous fold's `innerWidth` for a while, or forever, after the hinge moves.
 */
import { useSyncExternalStore } from 'react';

export type FoldOrientation = 'landscape' | 'portrait';
export interface FoldState { unfolded: boolean; orientation: FoldOrientation }

/** Cover short side (≈461×678 measured) stays below this; inner landscape (≈951×537) clears it. */
export const FOLD_COVER_MAX_SHORT_SIDE = 512;
const INNER_MIN_SHORT_SIDE = 550;
const INNER_MIN_RATIO = 0.72;
const LARGE_SCREEN_LONG_SIDE = 768;
const SETTLE_DELAYS_MS = [120, 350, 800] as const;

export const FOLD_SEGMENT_QUERIES = [
  '(horizontal-viewport-segments: 2)',
  '(vertical-viewport-segments: 2)',
  '(spanning: single-fold-vertical)',
  '(spanning: single-fold-horizontal)',
] as const;

/** Rotation-invariant rule: a folded phone stays one screen in either direction. */
export function classifyFold(width: number, height: number, spanned = false): FoldState {
  const orientation: FoldOrientation = width > height ? 'landscape' : 'portrait';
  if (spanned) return { unfolded: true, orientation };
  const shortSide = Math.min(width, height);
  const longSide = Math.max(width, height);
  if (shortSide < FOLD_COVER_MAX_SHORT_SIDE) return { unfolded: false, orientation };
  const ratio = shortSide / Math.max(longSide, 1);
  const unfolded = (shortSide >= INNER_MIN_SHORT_SIDE && ratio >= INNER_MIN_RATIO) || longSide >= LARGE_SCREEN_LONG_SIDE;
  return { unfolded, orientation };
}

function isSpanned(win: Window): boolean {
  return FOLD_SEGMENT_QUERIES.some(query => {
    try { return win.matchMedia(query).matches; } catch { return false; }
  });
}

/** The rendered canvas size; falls back to innerWidth only before layout exists. */
export function readCanvasSize(win: Window = window): { width: number; height: number } {
  const root = typeof win.document === 'object' ? win.document?.documentElement : undefined;
  const width = root?.clientWidth || win.innerWidth || 0;
  const height = root?.clientHeight || win.innerHeight || 0;
  return { width, height };
}

const serverState: FoldState = { unfolded: false, orientation: 'portrait' };
let snapshot: FoldState = { unfolded: false, orientation: 'portrait' };
/** The last full (unoccluded) canvas size, so a height-only shrink keeps it. */
let lastFull: { width: number; height: number } | null = null;
let started = false;
const listeners = new Set<(next: FoldState, previous: FoldState) => void>();

/** A focused text field or the app's keyboard markers: the height is keyboard-reduced. */
function isKeyboardActive(doc: Document | undefined): boolean {
  if (!doc || typeof doc !== 'object') return false;
  const active = doc.activeElement as HTMLElement | null;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return true;
  const has = (node: Element | null | undefined, name: string) => Boolean(node?.classList?.contains?.(name));
  return ['keyboard-open', 'lucy-input-focused'].some(name => has(doc.documentElement, name) || has(doc.body, name));
}

function isTouchDevice(win: Window): boolean {
  const nav = win.navigator as Navigator | undefined;
  if ((nav?.maxTouchPoints ?? 0) > 0) return true;
  try { return Boolean(win.matchMedia?.('(pointer: coarse)').matches); } catch { return false; }
}

/** Full-screen height for this canvas width from the device screen, in either orientation. */
function screenHeightForWidth(win: Window, width: number): number {
  const screen = win.screen;
  if (!screen?.width || !screen?.height) return 0;
  const near = (a: number, b: number) => Math.abs(a - b) <= 96;
  if (near(width, screen.width)) return screen.height;
  if (near(width, screen.height)) return screen.width;
  return 0;
}

/**
 * Measure now. A real fold or rotation changes the canvas width; a keyboard or
 * browser chrome only shortens the height. So the last full height at the
 * same width is kept, and while a keyboard is open (even across a rotation,
 * with interactive-widget=resizes-content) the unoccluded height is recovered
 * from the device screen instead of trusting the keyboard-reduced one.
 */
export function measureFoldState(win: Window = window): FoldState {
  const size = readCanvasSize(win);
  if (isSpanned(win)) return classifyFold(size.width, size.height, true);
  const sameWidth = lastFull !== null && Math.abs(lastFull.width - size.width) <= 2;
  const remembered = sameWidth ? lastFull!.height : 0;
  // Screen recovery only where a software keyboard exists (touch devices); a short
  // desktop window with a focused field is not keyboard-occluded.
  const keyboard = isTouchDevice(win) && isKeyboardActive(typeof win.document === 'object' ? win.document : undefined);
  const recovered = keyboard ? screenHeightForWidth(win, size.width) : 0;
  const height = Math.max(size.height, remembered, recovered);
  // Always keep the tallest observation at this width, even while a field is
  // focused, so a keyboard animating in cannot collapse the inner layout.
  lastFull = { width: size.width, height: Math.max(size.height, remembered) };
  return classifyFold(size.width, height, false);
}

function applyRootClasses(state: FoldState): void {
  const portrait = state.unfolded && state.orientation === 'portrait';
  const landscape = state.unfolded && state.orientation === 'landscape';
  for (const node of [document.documentElement, document.body]) {
    if (!node) continue;
    node.classList.toggle('duo-unfolded-mode', state.unfolded);
    node.classList.toggle('duo-unfolded-portrait', portrait);
    node.classList.toggle('duo-unfolded-landscape', landscape);
  }
  document.documentElement.classList.toggle('dual-pane-active', state.unfolded);
  document.documentElement.dataset.dualScreen = state.unfolded ? 'true' : 'false';
}

function refresh(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const next = measureFoldState(window);
  const previous = snapshot;
  if (next.unfolded === previous.unfolded && next.orientation === previous.orientation) return;
  snapshot = next;
  applyRootClasses(next);
  // Copy first: a listener may subscribe/unsubscribe while being notified.
  for (const listener of [...listeners]) if (listeners.has(listener)) listener(next, previous);
}

function start(): void {
  if (started || typeof window === 'undefined' || typeof document === 'undefined') return;
  started = true;
  snapshot = measureFoldState(window);
  applyRootClasses(snapshot);
  let frame = 0;
  let timers: ReturnType<typeof setTimeout>[] = [];
  // WebKit may publish the event before the new size; re-check until it settles.
  const settle = () => {
    if (frame) cancelAnimationFrame(frame);
    timers.forEach(clearTimeout);
    refresh();
    frame = requestAnimationFrame(() => { frame = 0; refresh(); });
    timers = SETTLE_DELAYS_MS.map(delay => setTimeout(refresh, delay));
  };
  // The rendered root resizes whenever the real fold lands, even without a resize event.
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(settle).observe(document.documentElement);
  for (const event of ['resize', 'orientationchange', 'pageshow']) window.addEventListener(event, settle, { passive: true });
  window.visualViewport?.addEventListener('resize', settle, { passive: true });
  document.addEventListener('visibilitychange', settle);
  for (const query of FOLD_SEGMENT_QUERIES) {
    try { window.matchMedia(query).addEventListener?.('change', settle); } catch { /* unsupported query */ }
  }
}

export function getFoldState(): FoldState {
  start();
  return snapshot;
}

/**
 * A fresh reading for code that acts right now (navigation, Big Bang, Lucy).
 * If it is ahead of the shared snapshot, everyone is told on the next microtask,
 * never in the middle of a React render.
 */
export function readFoldStateNow(): FoldState {
  if (typeof window === 'undefined') return serverState;
  const now = measureFoldState(window);
  if (started && (now.unfolded !== snapshot.unfolded || now.orientation !== snapshot.orientation)) queueMicrotask(refresh);
  return now;
}

/** Called with (next, previous) only when the fold or orientation actually changes. */
export function subscribeFoldState(listener: (next: FoldState, previous: FoldState) => void): () => void {
  start();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useFoldState(): FoldState {
  return useSyncExternalStore(
    notify => subscribeFoldState(() => notify()),
    getFoldState,
    () => serverState,
  );
}

/** Test-only reset so unit tests can start from a clean store. */
export function resetFoldStateForTests(): void {
  snapshot = { unfolded: false, orientation: 'portrait' };
  lastFull = null;
  listeners.clear();
}
