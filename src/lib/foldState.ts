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
let lastSize: { width: number; height: number } | null = null;
let started = false;
const listeners = new Set<(next: FoldState, previous: FoldState) => void>();

/**
 * Measure now. A real fold or rotation always changes the canvas width; a
 * keyboard or browser chrome only shortens the height at the same width, so a
 * height-only change keeps the full height seen at that width.
 */
export function measureFoldState(win: Window = window): FoldState {
  const size = readCanvasSize(win);
  if (isSpanned(win)) return classifyFold(size.width, size.height, true);
  const sameWidth = lastSize !== null && Math.abs(size.width - lastSize.width) <= 2;
  const height = sameWidth ? Math.max(size.height, lastSize!.height) : size.height;
  lastSize = { width: size.width, height };
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
  lastSize = null;
  listeners.clear();
}
