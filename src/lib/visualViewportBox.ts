/**
 * The app shell used to combine `position: fixed; inset: 0` with
 * `height: 100%` and `min-height: -webkit-fill-available`. On iPad those
 * three sizes disagree after rotation and when the browser chrome shows or
 * hides: the used height is then shorter than the visible screen (gap) or
 * taller (bottom clipped). Pin one box to the visual viewport instead.
 *
 * A large drop in height with a stable width is the on-screen keyboard.
 * Keep the layout viewport in that case so phone portrait does not squash.
 */

export const VIEWPORT_KEYBOARD_MIN_DELTA_PX = 160;
export const VIEWPORT_KEYBOARD_MIN_RATIO = 0.22;
export const VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX = 24;
export const VIEWPORT_SYNC_RETRY_MS = [80, 280, 700];

export type ViewportSnapshot = {
  innerWidth: number;
  innerHeight: number;
  visual?: {
    width: number;
    height: number;
    offsetTop: number;
    offsetLeft: number;
  } | null;
};

export type ViewportBox = {
  width: number;
  height: number;
  offsetTop: number;
  offsetLeft: number;
  /** Layout-viewport pixels below the visual bottom. Lifts fixed bottom bars. */
  bottomGap: number;
};

function positive(value: number | null | undefined): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null;
  return value;
}

function nonNegative(value: number | null | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 0;
  return value;
}

function roundPx(value: number): number {
  return Math.round(value * 100) / 100;
}

export function resolveViewportBox(snapshot: ViewportSnapshot): ViewportBox | null {
  const innerWidth = positive(snapshot.innerWidth);
  const innerHeight = positive(snapshot.innerHeight);
  const visual = snapshot.visual;
  const visualWidth = positive(visual?.width);
  const visualHeight = positive(visual?.height);

  if (visualWidth == null || visualHeight == null) {
    if (innerWidth == null || innerHeight == null) return null;
    return {
      width: roundPx(innerWidth),
      height: roundPx(innerHeight),
      offsetTop: 0,
      offsetLeft: 0,
      bottomGap: 0,
    };
  }

  const layoutWidth = innerWidth ?? visualWidth;
  const layoutHeight = innerHeight ?? visualHeight;
  const heightDelta = layoutHeight - visualHeight;
  const widthDelta = Math.abs(visualWidth - layoutWidth);
  const keyboard =
    widthDelta < VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX &&
    heightDelta > VIEWPORT_KEYBOARD_MIN_DELTA_PX &&
    layoutHeight > 0 &&
    heightDelta / layoutHeight > VIEWPORT_KEYBOARD_MIN_RATIO;

  if (keyboard) {
    return {
      width: roundPx(layoutWidth),
      height: roundPx(layoutHeight),
      offsetTop: 0,
      offsetLeft: 0,
      bottomGap: 0,
    };
  }

  const offsetTop = nonNegative(visual?.offsetTop);
  const offsetLeft = nonNegative(visual?.offsetLeft);
  return {
    width: roundPx(visualWidth),
    height: roundPx(visualHeight),
    offsetTop: roundPx(offsetTop),
    offsetLeft: roundPx(offsetLeft),
    bottomGap: roundPx(Math.max(0, layoutHeight - offsetTop - visualHeight)),
  };
}

export function readViewportSnapshot(win: Window): ViewportSnapshot {
  const visual = win.visualViewport;
  return {
    innerWidth: win.innerWidth,
    innerHeight: win.innerHeight,
    visual: visual
      ? {
          width: visual.width,
          height: visual.height,
          offsetTop: visual.offsetTop,
          offsetLeft: visual.offsetLeft,
        }
      : null,
  };
}

function px(value: number): string {
  return `${value}px`;
}

let appliedSignature = '';

export function applyVisualViewportBox(box: ViewportBox, root: HTMLElement): void {
  const signature = `${box.width}|${box.height}|${box.offsetTop}|${box.offsetLeft}|${box.bottomGap}`;
  if (signature === appliedSignature) return;
  appliedSignature = signature;
  root.style.setProperty('--vvw', px(box.width));
  root.style.setProperty('--vvh', px(box.height));
  root.style.setProperty('--vv-top', px(box.offsetTop));
  root.style.setProperty('--vv-left', px(box.offsetLeft));
  root.style.setProperty('--vv-bottom', px(box.bottomGap));
  root.style.setProperty('--visual-vh', px(box.height));
}

export function syncVisualViewportBox(win: Window = window): ViewportBox | null {
  if (typeof document === 'undefined') return null;
  const box = resolveViewportBox(readViewportSnapshot(win));
  if (!box) return null;
  applyVisualViewportBox(box, document.documentElement);
  return box;
}

let retryTimers: number[] = [];
let retryFrame = 0;

export function scheduleVisualViewportSync(win: Window = window): void {
  if (retryFrame) win.cancelAnimationFrame(retryFrame);
  for (const timer of retryTimers) win.clearTimeout(timer);
  retryTimers = [];

  retryFrame = win.requestAnimationFrame(() => {
    retryFrame = 0;
    syncVisualViewportBox(win);
  });
  retryTimers = VIEWPORT_SYNC_RETRY_MS.map((delay) =>
    win.setTimeout(() => {
      syncVisualViewportBox(win);
    }, delay),
  );
}
