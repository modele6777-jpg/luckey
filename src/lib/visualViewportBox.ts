/**
 * Screen height stays on the layout viewport (100% / fill-available).
 * This module only widens the shell for the foldable side status column.
 * A short visual viewport must not resize the page.
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
/** Side status column on this device. Wider than this is Split View, not a safe area. */
export const SIDE_STRIP_MAX_RATIO = 0.22;

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
  _options: ViewportResolveOptions = {},
): ViewportBox | null {
  const innerWidth = positive(snapshot.innerWidth);
  const innerHeight = positive(snapshot.innerHeight);
  const visual = snapshot.visual;
  const visualWidth = positive(visual?.width);
  const visualHeight = positive(visual?.height);

  if (visualWidth == null || visualHeight == null) {
    if (innerWidth == null || innerHeight == null) return null;
    return coverScreenEdges(snapshot, {
      width: roundPx(innerWidth),
      height: roundPx(innerHeight),
      offsetTop: 0,
      offsetLeft: 0,
      bottomGap: 0,
    });
  }

  const layoutWidth = innerWidth ?? visualWidth;
  const layoutHeight = innerHeight ?? visualHeight;
  return coverScreenEdges(snapshot, {
    width: roundPx(layoutWidth),
    height: roundPx(layoutHeight),
    offsetTop: 0,
    offsetLeft: 0,
    bottomGap: 0,
  });
}

/**
 * Unfold: the layout viewport is already the wide inner screen while
 * visualViewport is still the narrower cover size. A rotation where the
 * visual viewport is the newer, wider one is not this case.
 */
export function layoutOutgrewVisual(snapshot: ViewportSnapshot): boolean {
  const innerWidth = positive(snapshot.innerWidth);
  const visualWidth = positive(snapshot.visual?.width);
  if (innerWidth == null || visualWidth == null) return false;
  return innerWidth > visualWidth * 1.08;
}

/**
 * Unfolded foldable: the side status column is inside the layout viewport.
 * visualViewport.width skips it, so a shell sized to that width stops early
 * and the page background shows under the clock. Always paint at least the
 * layout width. Grow to the screen only for a small side strip. A Split View
 * pane (about a third of the screen or more) stays at the window width.
 */
export function coverScreenEdges(snapshot: ViewportSnapshot, box: ViewportBox): ViewportBox {
  let width = box.width;
  let offsetLeft = box.offsetLeft;
  const innerWidth = positive(snapshot.innerWidth);
  if (innerWidth != null && innerWidth > width + 1) {
    width = innerWidth;
    offsetLeft = 0;
  }
  const screenWidth = positive(snapshot.screenWidth);
  const screenHeight = positive(snapshot.screenHeight);
  if (screenWidth != null && screenHeight != null) {
    const screen = orientedScreenSize(screenWidth, screenHeight, width, box.height);
    const shortfall = screen.width - width;
    if (shortfall > 1 && shortfall / screen.width < SIDE_STRIP_MAX_RATIO) {
      width = screen.width;
      offsetLeft = 0;
    }
  }
  if (width === box.width && offsetLeft === box.offsetLeft) return box;
  return { ...box, width: roundPx(width), offsetLeft: roundPx(offsetLeft) };
}

/**
 * Folded and unfolded both keep a side status column outside the reported
 * viewport width. Portrait screenshots put it on the right; landscape puts
 * it on the left. The shell shifts by that amount so the page background
 * is not the only thing under the clock.
 */
export function sideColumnBleed(
  snapshot: ViewportSnapshot,
  width: number,
): { left: number; right: number } {
  const innerWidth = positive(snapshot.innerWidth) ?? width;
  const extra = Math.max(0, roundPx(width - innerWidth));
  if (extra <= 1) return { left: 0, right: 0 };
  const innerHeight = positive(snapshot.innerHeight) ?? positive(snapshot.visual?.height) ?? innerWidth;
  if (innerHeight >= innerWidth) return { left: 0, right: extra };
  return { left: extra, right: 0 };
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

export function applyVisualViewportBox(
  box: ViewportBox,
  root: HTMLElement,
  snapshot?: ViewportSnapshot,
): void {
  const bleed = snapshot ? sideColumnBleed(snapshot, box.width) : { left: 0, right: 0 };
  const signature = `${box.width}|${box.height}|${box.offsetTop}|${box.offsetLeft}|${box.bottomGap}|${bleed.left}|${bleed.right}`;
  if (signature === appliedSignature) return;
  appliedSignature = signature;
  lastAppliedBox = box;
  root.style.setProperty('--vvw', px(box.width));
  root.style.setProperty('--vvh', px(box.height));
  root.style.setProperty('--vv-top', px(box.offsetTop));
  root.style.setProperty('--vv-left', px(box.offsetLeft));
  root.style.setProperty('--vv-bottom', px(box.bottomGap));
  root.style.setProperty('--vv-bleed-left', px(bleed.left));
  root.style.setProperty('--vv-bleed-right', px(bleed.right));
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
  const snapshot = readViewportSnapshot(win);
  const box = resolveViewportBox(snapshot, { fillLayoutGap: fillArmed() });
  if (!box) return null;
  applyVisualViewportBox(box, document.documentElement, snapshot);
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

  win.screen?.orientation?.addEventListener?.('change', () => {
    scheduleVisualViewportSync(win);
  });

  doc.addEventListener('resume', () => {
    sawHidden = true;
    resume(true);
  });
}
