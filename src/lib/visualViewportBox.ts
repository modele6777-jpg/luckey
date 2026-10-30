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
export const TABLET_SHORT_SIDE_PX = 600;
export const VIEWPORT_SYNC_RETRY_MS = [80, 280, 700];
/** iPad reports a stale short visual viewport for a while after unlock or app switch. */
export const VIEWPORT_RESUME_RETRY_MS = [50, 160, 400, 800, 1400, 2200];
export const VIEWPORT_RESUME_FILL_MS = 2600;

export type ViewportResolveOptions = {
  /**
   * Tablet returning from background: a shorter visual viewport is the stale
   * reading that leaves a gap. Fill the layout viewport instead.
   */
  fillLayoutGap?: boolean;
};

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

export function resolveViewportBox(
  snapshot: ViewportSnapshot,
  options: ViewportResolveOptions = {},
): ViewportBox | null {
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

  const tablet = Math.min(layoutWidth, layoutHeight) >= TABLET_SHORT_SIDE_PX;
  if (
    options.fillLayoutGap &&
    tablet &&
    !keyboard &&
    widthDelta < VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX &&
    visualHeight + 1 < layoutHeight
  ) {
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

export function viewportNeedsResumeFill(
  snapshot: ViewportSnapshot,
  fromBackground: boolean,
  applied: Pick<ViewportBox, 'width' | 'height'> | null,
): boolean {
  const innerWidth = positive(snapshot.innerWidth);
  const innerHeight = positive(snapshot.innerHeight);
  const visualWidth = positive(snapshot.visual?.width);
  const visualHeight = positive(snapshot.visual?.height);
  if (innerWidth == null || innerHeight == null) return false;
  if (Math.min(innerWidth, innerHeight) < TABLET_SHORT_SIDE_PX) return false;
  if (visualWidth != null && Math.abs(visualWidth - innerWidth) >= VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX) {
    return false;
  }

  const comparedHeight = visualHeight ?? innerHeight;
  const heightDelta = innerHeight - comparedHeight;
  const keyboard =
    heightDelta > VIEWPORT_KEYBOARD_MIN_DELTA_PX &&
    innerHeight > 0 &&
    heightDelta / innerHeight > VIEWPORT_KEYBOARD_MIN_RATIO;
  if (keyboard) return false;

  const settled = resolveViewportBox(snapshot);
  if (fromBackground && settled != null && settled.height + 1 < innerHeight) return true;
  if (
    applied != null &&
    Math.abs(applied.width - innerWidth) < VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX &&
    settled != null &&
    applied.height + 1 < Math.min(settled.height, innerHeight)
  ) {
    return true;
  }
  return false;
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
let lastAppliedBox: ViewportBox | null = null;
let stableBox: ViewportBox | null = null;
let sawHidden = false;
let fillUntil = 0;
let lifecycleBound = false;

export function applyVisualViewportBox(box: ViewportBox, root: HTMLElement): void {
  const signature = `${box.width}|${box.height}|${box.offsetTop}|${box.offsetLeft}|${box.bottomGap}`;
  if (signature === appliedSignature) return;
  appliedSignature = signature;
  lastAppliedBox = box;
  root.style.setProperty('--vvw', px(box.width));
  root.style.setProperty('--vvh', px(box.height));
  root.style.setProperty('--vv-top', px(box.offsetTop));
  root.style.setProperty('--vv-left', px(box.offsetLeft));
  root.style.setProperty('--vv-bottom', px(box.bottomGap));
  root.style.setProperty('--visual-vh', px(box.height));
}

function rememberStable(box: ViewportBox): void {
  if (
    !stableBox ||
    Math.abs(stableBox.width - box.width) >= VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX ||
    box.height >= stableBox.height - 1
  ) {
    stableBox = box;
  }
}

function restoreStableBox(): void {
  if (!stableBox || typeof document === 'undefined') return;
  applyVisualViewportBox(stableBox, document.documentElement);
}

export function armViewportResumeFill(now = Date.now()): void {
  fillUntil = now + VIEWPORT_RESUME_FILL_MS;
}

function fillArmed(now = Date.now()): boolean {
  return now < fillUntil;
}

export function syncVisualViewportBox(win: Window = window): ViewportBox | null {
  if (typeof document === 'undefined') return null;
  if (document.visibilityState === 'hidden') return null;
  const box = resolveViewportBox(readViewportSnapshot(win), { fillLayoutGap: fillArmed() });
  if (!box) return null;
  applyVisualViewportBox(box, document.documentElement);
  rememberStable(box);
  return box;
}

let retryTimers: number[] = [];
let retryFrame = 0;

export function scheduleVisualViewportSync(win: Window = window): void {
  if (retryFrame) win.cancelAnimationFrame(retryFrame);
  for (const timer of retryTimers) win.clearTimeout(timer);
  retryTimers = [];

  const delays = fillArmed() ? VIEWPORT_RESUME_RETRY_MS : VIEWPORT_SYNC_RETRY_MS;
  retryFrame = win.requestAnimationFrame(() => {
    retryFrame = 0;
    syncVisualViewportBox(win);
  });
  retryTimers = delays.map((delay) =>
    win.setTimeout(() => {
      syncVisualViewportBox(win);
    }, delay),
  );
}

export function bindVisualViewportLifecycle(win: Window = window): void {
  if (lifecycleBound) return;
  lifecycleBound = true;
  const doc = win.document;

  const resume = (force: boolean) => {
    const fromBackground = sawHidden;
    const needsFill = viewportNeedsResumeFill(readViewportSnapshot(win), fromBackground, lastAppliedBox);
    sawHidden = false;
    if (!force && !fromBackground && !needsFill) return;
    if (needsFill) armViewportResumeFill();
    scheduleVisualViewportSync(win);
  };

  doc.addEventListener('visibilitychange', () => {
    if (doc.visibilityState === 'hidden') {
      sawHidden = true;
      restoreStableBox();
      return;
    }
    resume(true);
  });

  win.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (!event.persisted) return;
    sawHidden = true;
    resume(true);
  });

  win.addEventListener('focus', () => {
    if (doc.visibilityState === 'hidden') return;
    resume(false);
  });

  doc.addEventListener('resume', () => {
    sawHidden = true;
    resume(true);
  });
}
