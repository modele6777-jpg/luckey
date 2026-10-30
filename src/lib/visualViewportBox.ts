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
/** Home-screen web app: inner and visual shrink by the same amount, short of the screen. */
export const STANDALONE_EQUAL_SHRINK_PX = 24;
export const STANDALONE_MAX_SHRINK_RATIO = 0.35;

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
  /**
   * iPad home-screen web app (standalone + black-translucent). After resume,
   * innerHeight and visualViewport.height shrink together while the web view
   * still covers the screen.
   */
  iosStandalone?: boolean;
  screenWidth?: number;
  screenHeight?: number;
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

  const standaloneFill = standaloneResumeBox(snapshot);
  if (standaloneFill) return standaloneFill;

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
  if (standaloneResumeBox(snapshot)) return true;
  return false;
}

export function orientedScreenSize(
  screenWidth: number,
  screenHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): { width: number; height: number } {
  const screenLandscape = screenWidth > screenHeight;
  const viewLandscape = viewportWidth > viewportHeight;
  if (screenLandscape === viewLandscape) return { width: screenWidth, height: screenHeight };
  return { width: screenHeight, height: screenWidth };
}

/**
 * Standalone iPad: a resumed web view often reports innerHeight and
 * visualViewport.height equally short of screen.height (status bar / home
 * indicator subtracted twice, or a stale frame). Fill the screen. A keyboard
 * drops the visual height far below the layout height, and a very large
 * equal shrink stays untouched. Offsets are cleared because a non-zero
 * visualViewport.offsetTop after resume is a phantom scroll.
 */
export function standaloneResumeBox(snapshot: ViewportSnapshot): ViewportBox | null {
  if (!snapshot.iosStandalone) return null;
  const screenWidth = positive(snapshot.screenWidth);
  const screenHeight = positive(snapshot.screenHeight);
  const innerWidth = positive(snapshot.innerWidth);
  const innerHeight = positive(snapshot.innerHeight);
  const visualWidth = positive(snapshot.visual?.width);
  const visualHeight = positive(snapshot.visual?.height);
  const layoutWidth = innerWidth ?? visualWidth;
  const layoutHeight = innerHeight ?? visualHeight;
  if (screenWidth == null || screenHeight == null || layoutWidth == null || layoutHeight == null) return null;
  if (Math.min(layoutWidth, layoutHeight) < TABLET_SHORT_SIDE_PX) return null;
  if (visualHeight != null && Math.abs(layoutHeight - visualHeight) > STANDALONE_EQUAL_SHRINK_PX) return null;

  const screen = orientedScreenSize(screenWidth, screenHeight, layoutWidth, layoutHeight);
  const widthGap = Math.min(
    Math.abs(screen.width - layoutWidth),
    visualWidth == null ? Number.POSITIVE_INFINITY : Math.abs(screen.width - visualWidth),
  );
  if (widthGap >= VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX) return null;

  const current = Math.max(layoutHeight, visualHeight ?? layoutHeight);
  const shortfall = screen.height - current;
  if (shortfall <= 1) return null;
  if (shortfall / screen.height > STANDALONE_MAX_SHRINK_RATIO) return null;

  return {
    width: roundPx(layoutWidth),
    height: roundPx(screen.height),
    offsetTop: 0,
    offsetLeft: 0,
    bottomGap: 0,
  };
}

export function isIosStandaloneWindow(win: Window): boolean {
  const nav = win.navigator as Navigator & { standalone?: boolean; userAgent?: string; platform?: string; maxTouchPoints?: number };
  const ua = nav.userAgent || '';
  const ios = /iPad|iPhone|iPod/.test(ua) || (nav.platform === 'MacIntel' && (nav.maxTouchPoints || 0) > 1);
  if (!ios) return false;
  return nav.standalone === true
    || win.matchMedia('(display-mode: standalone)').matches
    || win.matchMedia('(display-mode: fullscreen)').matches;
}

export function readSafeAreaInsets(doc: Document): { top: number; right: number; bottom: number; left: number } {
  const probe = doc.createElement('div');
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
  (doc.body ?? doc.documentElement).appendChild(probe);
  const style = doc.defaultView?.getComputedStyle(probe);
  const read = (value: string | undefined) => {
    const parsed = parseFloat(value || '0');
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };
  const insets = {
    top: read(style?.paddingTop),
    right: read(style?.paddingRight),
    bottom: read(style?.paddingBottom),
    left: read(style?.paddingLeft),
  };
  probe.remove();
  return insets;
}

function applySafeAreaVars(doc: Document): void {
  const insets = readSafeAreaInsets(doc);
  const root = doc.documentElement;
  const set = (name: string, value: number) => {
    if (value > 0) root.style.setProperty(name, `${roundPx(value)}px`);
    else root.style.removeProperty(name);
  };
  set('--sat', insets.top);
  set('--sab', insets.bottom);
  set('--sal', insets.left);
  set('--sar', insets.right);
}

export function readViewportSnapshot(win: Window): ViewportSnapshot {
  const visual = win.visualViewport;
  return {
    innerWidth: win.innerWidth,
    innerHeight: win.innerHeight,
    iosStandalone: isIosStandaloneWindow(win),
    screenWidth: win.screen?.width,
    screenHeight: win.screen?.height,
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
  applySafeAreaVars(document);
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
    if (isIosStandaloneWindow(win)) win.scrollTo(0, 0);
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
