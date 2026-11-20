/**
 * Screen height and width stay on the layout viewport.
 * A short visual viewport, or a screen wider than the window, does not resize the page.
 */
import { consumeAppUpdateReload, consumeAppScreenReset } from './appUpdateReload';

export const VIEWPORT_KEYBOARD_MIN_DELTA_PX = 160;
export const VIEWPORT_KEYBOARD_MIN_RATIO = 0.22;
export const VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX = 24;
export const TABLET_SHORT_SIDE_PX = 600;
export const VIEWPORT_SYNC_RETRY_MS = [80, 280, 700, 1400, 2200, 3500, 5000];
/** iPad reports a stale short visual viewport for a while after unlock or app switch. */
export const VIEWPORT_RESUME_RETRY_MS = [50, 160, 400, 800, 1400, 2200];
export const VIEWPORT_RESUME_FILL_MS = 2600;
/**
 * Home-screen web app: inner and visual can disagree by more than this after an
 * in-app update reload and still both be a letterbox. Keyboard-sized gaps are
 * rejected separately. Do not require the two heights to match within this band.
 */
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
  /** Standards-mode viewport available to the document, independent of CSS lvh. */
  layoutViewportHeight?: number;
  /**
   * iPad home-screen web app (standalone + black-translucent). After resume,
   * innerHeight and visualViewport.height shrink together while the web view
   * still covers the screen.
   */
  iosStandalone?: boolean;
  /** CSS large viewport is independent of stale JS height on installed WebKit. */
  cssViewportHeight?: number;
  cssViewportWidth?: number;
  layoutViewportWidth?: number;
  orientation?: string;
  safeAreaTop?: number;
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

/** WebKit can update the width and height of CSS viewport units on different
 * rotation frames. A portrait height must never become a keyboard baseline
 * for a landscape viewport merely because an input retained focus.
 */
/** CSS and the document must independently agree before overriding stale PWA JS width. */
export function resolveLayoutViewportSize(snapshot: ViewportSnapshot): { width: number; height: number } {
  const cssWidth = positive(snapshot.cssViewportWidth);
  const cssHeight = positive(snapshot.cssViewportHeight);
  const documentWidth = positive(snapshot.layoutViewportWidth);
  const paired = snapshot.iosStandalone && cssWidth != null && cssHeight != null && documentWidth != null
    && Math.abs(cssWidth - documentWidth) <= 2;
  if (paired && Math.abs(cssWidth! - snapshot.innerWidth) >= VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX) {
    return { width: cssWidth!, height: cssHeight! };
  }
  return { width: snapshot.innerWidth, height: snapshot.innerHeight };
}

function currentStandaloneCssHeight(snapshot: ViewportSnapshot): number | null {
  if (!snapshot.iosStandalone) return null;
  const height = positive(snapshot.cssViewportHeight);
  if (height == null) return null;
  const width = positive(snapshot.cssViewportWidth);
  if (width != null && Math.abs(width - resolveLayoutViewportSize(snapshot).width) >= VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX) return null;
  if (snapshot.orientation?.startsWith('landscape') && height >= resolveLayoutViewportSize(snapshot).width - 1) return null;
  if (snapshot.orientation?.startsWith('portrait') && height <= resolveLayoutViewportSize(snapshot).width + 1) return null;
  return height;
}

/** Installed WebKit may reserve a strip even when rotated safe-area-top is 0.
 * Prefer a full CSS canvas whose width and orientation match this frame. The
 * in-flow root prevents fixed-position clipping. Missing CSS pairs retain the
 * older inset-correlated fallback; screen dimensions are never a size source.
 */
function installedLayoutBox(snapshot: ViewportSnapshot): ViewportBox | null {
  const clientHeight = positive(snapshot.layoutViewportHeight);
  const width = positive(resolveLayoutViewportSize(snapshot).width);
  if (!snapshot.iosStandalone || clientHeight == null || width == null) return null;
  const fullHeight = currentStandaloneCssHeight(snapshot);
  const inset = positive(snapshot.safeAreaTop);
  const pairedCssCanvas = positive(snapshot.cssViewportWidth) != null && fullHeight != null;
  const statusBarShrink = fullHeight != null && inset != null
    && fullHeight > clientHeight && Math.abs(fullHeight - clientHeight - inset) <= 2;
  const height = pairedCssCanvas ? Math.max(clientHeight, fullHeight!)
    : statusBarShrink ? fullHeight! : clientHeight;
  return { width: roundPx(width), height: roundPx(height), offsetTop: 0, offsetLeft: 0, bottomGap: 0 };
}

export function resolveViewportBox(
  snapshot: ViewportSnapshot,
  options: ViewportResolveOptions = {},
): ViewportBox | null {
  const installed = installedLayoutBox(snapshot);
  if (installed) return installed;
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

  if (options.fillLayoutGap) {
    const standaloneFill = standaloneResumeBox(snapshot);
    if (standaloneFill) return coverScreenEdges(snapshot, standaloneFill);
  }

  // On a cold launch on an unfolded screen, visualViewport can settle before
  // innerHeight. Use that newer height only once both report the same width;
  // a visual viewport from the cover screen or previous orientation is unsafe.
  const sameWidth = Math.abs(visualWidth - layoutWidth) < VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX;
  const cssHeight = currentStandaloneCssHeight(snapshot);
  const height = Math.max(sameWidth ? Math.max(layoutHeight, visualHeight) : layoutHeight, cssHeight ?? 0);
  return coverScreenEdges(snapshot, {
    width: roundPx(layoutWidth),
    height: roundPx(height),
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

export function canUseKeyboardViewport(snapshot: ViewportSnapshot, inputActive: boolean): boolean {
  const innerWidth = positive(snapshot.innerWidth);
  const visualWidth = positive(snapshot.visual?.width);
  const visualHeight = positive(snapshot.visual?.height);
  return inputActive && innerWidth != null && visualWidth != null && visualHeight != null
    && Math.abs(innerWidth - visualWidth) < VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX;
}

/** Focus can remain after dismissing the keyboard; a small stale gap is not a keyboard. */
export function isKeyboardViewportOpen(snapshot: ViewportSnapshot, inputActive: boolean): boolean {
  if (!canUseKeyboardViewport(snapshot, inputActive)) return false;
  const visualHeight = snapshot.visual!.height;
  const installed = installedLayoutBox(snapshot);
  let fullHeight = Math.max(installed?.height ?? snapshot.innerHeight, currentStandaloneCssHeight(snapshot) ?? 0);
  const sw = positive(snapshot.screenWidth);
  const sh = positive(snapshot.screenHeight);
  if (!installed && snapshot.iosStandalone && sw != null && sh != null) {
    const screen = orientedScreenSize(sw, sh, snapshot.innerWidth, snapshot.innerHeight);
    if (Math.abs(screen.width - snapshot.innerWidth) < VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX) {
      fullHeight = Math.max(fullHeight, screen.height);
    }
  }
  const delta = fullHeight - visualHeight;
  return delta > VIEWPORT_KEYBOARD_MIN_DELTA_PX && delta / fullHeight > VIEWPORT_KEYBOARD_MIN_RATIO;
}

export function resolveAppLayoutHeight(snapshot: ViewportSnapshot): string {
  const installed = installedLayoutBox(snapshot);
  if (installed) return px(installed.height);
  const layoutHeight = positive(snapshot.innerHeight);
  if (layoutHeight == null) return '100dvh';
  if (layoutOutgrewVisual(snapshot)) return px(layoutHeight);

  const standalone = standaloneResumeBox(snapshot);
  if (standalone) return `max(100dvh, ${px(standalone.height)})`;

  const visual = snapshot.visual;
  const sameWidth = visual && Math.abs(visual.width - snapshot.innerWidth) < VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX;
  // A stale, shorter visual viewport must not leave the layout bottom uncovered.
  const measuredHeight = Math.max(layoutHeight, (sameWidth && positive(visual.height)) || layoutHeight, currentStandaloneCssHeight(snapshot) ?? 0);
  return `max(100dvh, ${px(roundPx(measuredHeight))})`;
}

/** The window width is the page width. A wider screen does not stretch the shell. */
export function coverScreenEdges(_snapshot: ViewportSnapshot, box: ViewportBox): ViewportBox {
  return box;
}

/** Extra canvas width for a standalone iOS portrait cover screen. */
export function sideColumnBleed(
  snapshot: ViewportSnapshot,
  width: number,
): { left: number; right: number } {
  const screenWidth = positive(snapshot.screenWidth);
  const screenHeight = positive(snapshot.screenHeight);
  if (!snapshot.iosStandalone || screenWidth == null || screenHeight == null) return { left: 0, right: 0 };
  const gap = screenWidth - width;
  const coverPortrait = screenWidth < TABLET_SHORT_SIDE_PX && screenHeight > screenWidth
    && Math.abs(snapshot.innerHeight - screenHeight) <= 2 && gap >= 40 && gap <= 100;
  return { left: 0, right: coverPortrait ? roundPx(gap) : 0 };
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
  const screenWidth = positive(snapshot.screenWidth);
  const screenHeight = positive(snapshot.screenHeight);
  const sizeBasis = screenWidth != null && screenHeight != null
    ? Math.min(screenWidth, screenHeight)
    : Math.min(innerWidth, innerHeight);
  // A landscape tablet can report a layout height below 600px while the screen is still a tablet.
  if (sizeBasis < TABLET_SHORT_SIDE_PX) return false;
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

function isKeyboardSizedGap(full: number, visible: number): boolean {
  const delta = Math.abs(full - visible);
  const taller = Math.max(full, visible);
  return taller > 0
    && delta > VIEWPORT_KEYBOARD_MIN_DELTA_PX
    && delta / taller > VIEWPORT_KEYBOARD_MIN_RATIO;
}

/**
 * Standalone iPad: a resumed or just-updated web view often reports
 * innerHeight and visualViewport.height short of screen.height. They do not
 * have to match. Fill the screen height only. A keyboard-sized shrink and a
 * very large equal shrink stay untouched. Width is the layout width.
 * Offsets are cleared because a non-zero visualViewport.offsetTop after
 * resume is a phantom scroll.
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
  // Identify tablets from the screen, not the already-shortened web view.
  // A landscape tablet can report a layout height below 600px after resume.
  if (Math.min(screenWidth, screenHeight) < TABLET_SHORT_SIDE_PX) return null;

  const screen = orientedScreenSize(screenWidth, screenHeight, layoutWidth, layoutHeight);
  const widthGap = Math.min(
    Math.abs(screen.width - layoutWidth),
    visualWidth == null ? Number.POSITIVE_INFINITY : Math.abs(screen.width - visualWidth),
  );
  if (widthGap >= VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX) return null;

  // A short visual viewport must not hide a layout that is itself only a letterbox below the screen.
  const current = visualHeight != null && isKeyboardSizedGap(layoutHeight, visualHeight)
    ? layoutHeight
    : Math.max(layoutHeight, visualHeight ?? layoutHeight);
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

const viewportProbes = new WeakMap<Document, HTMLDivElement>();
const insetProbes = new WeakMap<Document, HTMLDivElement>();

/** Persistent noninteractive probes live outside body to avoid subtree observer storms. */
export function getLayoutViewportProbe(doc: Document): HTMLDivElement {
  let probe = viewportProbes.get(doc);
  if (!probe || !probe.isConnected) {
    probe = doc.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:100lvw;height:100lvh;visibility:hidden;pointer-events:none;contain:strict';
    doc.documentElement.appendChild(probe);
    viewportProbes.set(doc, probe);
  }
  return probe;
}

export function readSafeAreaInsets(doc: Document): { top: number; right: number; bottom: number; left: number } {
  let probe = insetProbes.get(doc);
  if (!probe || !probe.isConnected) {
    probe = doc.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
    doc.documentElement.appendChild(probe);
    insetProbes.set(doc, probe);
  }
  const style = doc.defaultView?.getComputedStyle(probe);
  const read = (value: string | undefined) => {
    const parsed = parseFloat(value || '0');
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };
  return { top: read(style?.paddingTop), right: read(style?.paddingRight), bottom: read(style?.paddingBottom), left: read(style?.paddingLeft) };
}

function applySafeAreaVars(doc: Document): void {
  const insets = readSafeAreaInsets(doc);
  const root = doc.documentElement;
  const set = (name: string, value: number) => {
    const next = value > 0 ? `${roundPx(value)}px` : '';
    if (root.style.getPropertyValue(name) === next) return;
    if (next) root.style.setProperty(name, next); else root.style.removeProperty(name);
  };
  set('--sat', insets.top);
  set('--sab', insets.bottom);
  set('--sal', insets.left);
  set('--sar', insets.right);
}

export function readViewportSnapshot(win: Window): ViewportSnapshot {
  const visual = win.visualViewport;
  const iosStandalone = isIosStandaloneWindow(win);
  let cssViewportHeight: number | undefined;
  let cssViewportWidth: number | undefined;
  if (iosStandalone && (win as Window & { CSS?: typeof CSS }).CSS?.supports('height', '100lvh')) {
    const cssRect = getLayoutViewportProbe(win.document).getBoundingClientRect();
    cssViewportHeight = cssRect.height;
    cssViewportWidth = cssRect.width;
  }
  return {
    innerWidth: win.innerWidth,
    innerHeight: win.innerHeight,
    layoutViewportHeight: win.document.documentElement.clientHeight,
    layoutViewportWidth: win.document.documentElement.clientWidth,
    iosStandalone,
    cssViewportHeight,
    cssViewportWidth,
    orientation: win.screen?.orientation?.type,
    safeAreaTop: iosStandalone ? readSafeAreaInsets(win.document).top : undefined,
    screenWidth: win.screen?.width,
    screenHeight: win.screen?.height,
    // iOS 27 can report a 0px visual viewport after a fold while the page is
    // fully usable; a collapsed reading is treated as unavailable, never as size.
    visual: visual && visual.width > 1 && visual.height > 1
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
  // The keyboard hook can write these variables without changing our cached box.
  // Reapply after dismissal even when the restored dimensions match the cache.
  if (signature === appliedSignature
    && root.style.getPropertyValue('--vvh') === px(box.height)
    && root.style.getPropertyValue('--visual-vh') === px(box.height)
    && root.style.getPropertyValue('--vv-top') === px(box.offsetTop)) return;
  appliedSignature = signature;
  lastAppliedBox = box;
  root.style.setProperty('--vvw', px(box.width));
  root.style.setProperty('--vvh', px(box.height));
  root.style.setProperty('--vv-top', px(box.offsetTop));
  root.style.setProperty('--vv-left', '0px');
  root.style.setProperty('--vv-bottom', px(box.bottomGap));
  root.style.setProperty('--vv-bleed-left', px(bleed.left));
  root.style.setProperty('--vv-bleed-right', px(bleed.right));
  root.toggleAttribute('data-lucy-wide-cover', bleed.right > 0);
  root.style.setProperty('--visual-vh', px(box.height));
}

export function armViewportResumeFill(now = Date.now()): void {
  fillUntil = now + VIEWPORT_RESUME_FILL_MS;
}

function fillArmed(now = Date.now()): boolean {
  return now < fillUntil;
}

/** Keep the app shell in the same recovery transaction as visual-viewport aliases. */
export function applyAppLayoutViewport(box: ViewportBox, doc: Document, snapshot?: ViewportSnapshot): void {
  const html = doc.documentElement;
  html.classList.remove('keyboard-open');
  doc.body?.classList.remove('keyboard-open');
  html.removeAttribute?.('data-ios-accessory-overlay');
  // Native CSS viewport units react during rotation before delayed JS callbacks.
  const nativeCanvas = snapshot?.iosStandalone && positive(snapshot.cssViewportHeight) != null
    && positive(snapshot.cssViewportWidth) != null;
  html.style.setProperty('--app-height', nativeCanvas ? '100lvh' : px(box.height));
  for (const element of [html, doc.body]) {
    element?.style.removeProperty('height');
    element?.style.removeProperty('min-height');
  }
  const root = doc.getElementById('root');
  for (const property of ['position', 'top', 'left', 'right', 'width', 'height', 'min-height', 'max-height']) {
    root?.style.removeProperty(property);
  }
  const shell = root?.querySelector<HTMLElement>('.prism-app-shell');
  for (const property of ['height', 'min-height', 'max-height']) shell?.style.removeProperty(property);
}

/**
 * iOS 26+ floats the keyboard's form accessory bar (^ v ✓) over the page without
 * shrinking visualViewport, so a bottom composer sits underneath it. Mark that case
 * so composers can lift themselves above the bar while the keyboard is open.
 */
export function iosFloatingAccessoryMajor(userAgent: string): number {
  const match = /\b(?:iPhone|iPad|iPod)\b.*?OS (\d+)_/.exec(userAgent || '')
    || (/Macintosh/.test(userAgent || '') && /Version\/(\d+)/.exec(userAgent || ''));
  return match ? Number(match[1]) || 0 : 0;
}

export function applyKeyboardLayoutViewport(box: ViewportBox, doc: Document): void {
  doc.documentElement.classList.add('keyboard-open');
  if (doc.body) doc.body.classList.add('keyboard-open');
  const nav = doc.defaultView?.navigator;
  const touchApple = Boolean(nav && (/(iPhone|iPad|iPod)/.test(nav.userAgent) || (/Macintosh/.test(nav.userAgent) && (nav.maxTouchPoints || 0) > 1)));
  doc.documentElement.toggleAttribute?.('data-ios-accessory-overlay', touchApple && iosFloatingAccessoryMajor(nav?.userAgent || '') >= 26);

  // iOS는 키보드가 열릴 때 visualViewport를 위로 패닝(offsetTop)한다.
  // 여기서 html/body 높이까지 줄이면 그 패닝과 겹쳐 화면이 키보드보다 더 위로 올라간다.
  // 문서 높이는 그대로 두고, #root만 지금 보이는 사각형(offset + visual height)에 붙인다.


  doc.documentElement.style.removeProperty('height');
  doc.documentElement.style.removeProperty('min-height');
  if (doc.body) {
    doc.body.style.removeProperty('height');
    doc.body.style.removeProperty('min-height');
  }

  doc.documentElement.style.setProperty('--vv-top', `${box.offsetTop}px`);
  doc.documentElement.style.setProperty('--vv-left', '0px');
  doc.documentElement.style.setProperty('--app-height', `${box.height}px`);
  doc.documentElement.style.setProperty('--vvh', `${box.height}px`);
  doc.documentElement.style.setProperty('--visual-vh', `${box.height}px`);

  const root = doc.getElementById('root');
  if (root) {
    root.style.setProperty('position', 'fixed', 'important');
    root.style.setProperty('top', `${box.offsetTop}px`, 'important');
    root.style.setProperty('left', '0px', 'important');
    root.style.setProperty('right', '0px', 'important');
    root.style.setProperty('width', '100%', 'important');
    root.style.setProperty('height', `${box.height}px`, 'important');
    root.style.setProperty('min-height', '0px', 'important');
    root.style.setProperty('max-height', `${box.height}px`, 'important');
  }
  const shell = root?.querySelector<HTMLElement>('.prism-app-shell') || null;
  if (shell) {
    shell.style.height = `${box.height}px`;
    shell.style.minHeight = '0px';
    shell.style.maxHeight = `${box.height}px`;
  }
}

export function syncVisualViewportBox(win: Window = window): ViewportBox | null {
  if (typeof document === 'undefined') return null;
  if (document.visibilityState === 'hidden') return null;
  const snapshot = readViewportSnapshot(win);
  document.documentElement.toggleAttribute('data-ios-standalone-flow', Boolean(snapshot.iosStandalone));
  const active = document.activeElement as HTMLElement | null;
  const inputActive = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || Boolean(active?.isContentEditable);
  // Every event path uses the same owner for keyboard and normal geometry.
  if (isKeyboardViewportOpen(snapshot, inputActive)) {
    const box: ViewportBox = {
      width: snapshot.innerWidth,
      height: Math.round(snapshot.visual!.height),
      offsetTop: Math.max(0, Math.round(snapshot.visual!.offsetTop)),
      offsetLeft: 0, bottomGap: 0,
    };
    applyKeyboardLayoutViewport(box, document);
    applySafeAreaVars(document);
    return box;
  }
  const next = resolveViewportBox(snapshot, { fillLayoutGap: fillArmed() || Boolean(snapshot.iosStandalone) });
  if (!next) return null;
  const box = chooseStableViewportBox(
    lastAppliedBox,
    next,
    !installedLayoutBox(snapshot) && snapshot.cssViewportHeight == null
      && (screenFilled(snapshot, lastAppliedBox) || screenFilled(snapshot, next)),
  );
  applyVisualViewportBox(box, document.documentElement, snapshot);
  applyAppLayoutViewport(box, document, snapshot);
  applySafeAreaVars(document);
  return box;
}

let retryTimers: number[] = [];
let retryFrame = 0;
let rotationFrame = 0;
let rotationFramesRemaining = 0;

export function chooseStableViewportBox(
  previous: ViewportBox | null,
  next: ViewportBox,
  hold: boolean,
): ViewportBox {
  if (!hold || !previous) return next;
  if (Math.abs(previous.width - next.width) >= VIEWPORT_KEYBOARD_MAX_WIDTH_DELTA_PX) return next;
  if (next.height + 1 >= previous.height) return next;
  return previous;
}

function screenFilled(snapshot: ViewportSnapshot, box: ViewportBox | null): boolean {
  if (!snapshot.iosStandalone || !box) return false;
  const inner = positive(snapshot.innerHeight);
  return inner != null && box.height > inner + 1;
}

export type ViewportRecoveryPlan = {
  recover: boolean;
  resetScroll: boolean;
  extendRetries: boolean;
};

export function readNavigationType(win: Window): string | null {
  try {
    const entry = win.performance?.getEntriesByType?.('navigation')?.[0] as PerformanceNavigationTiming | undefined;
    return entry?.type ?? null;
  } catch {
    return null;
  }
}

/** An update reload, a manual reload, or a restored page should remeasure like a resume. */
export function planViewportRecovery(input: {
  navigationType?: string | null;
  persisted?: boolean;
  updateReload?: boolean;
  iosStandalone?: boolean;
}): ViewportRecoveryPlan {
  const recover = Boolean(input.updateReload) || input.navigationType === 'reload' || input.persisted === true;
  return {
    recover,
    resetScroll: recover && Boolean(input.iosStandalone),
    extendRetries: recover,
  };
}

/** User-requested reset of page-owned geometry, before and after a reload.
 * Does not clear conversations, authentication, settings or the browser process.
 */
export async function resetAppScreen(win: Window = window): Promise<void> {
  const doc = win.document;
  const active = doc.activeElement as HTMLElement | null;
  if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || active?.isContentEditable) active.blur();
  if (retryFrame) win.cancelAnimationFrame(retryFrame);
  retryFrame = 0;
  for (const timer of retryTimers) win.clearTimeout(timer);
  retryTimers = [];
  if (rotationFrame) win.cancelAnimationFrame(rotationFrame);
  rotationFrame = 0;
  rotationFramesRemaining = 0;
  appliedSignature = '';
  lastAppliedBox = null;
  fillUntil = 0;
  const html = doc.documentElement;
  // Remove only styles owned by the viewport/keyboard engine.
  applyAppLayoutViewport({ width: win.innerWidth, height: win.innerHeight, offsetTop: 0, offsetLeft: 0, bottomGap: 0 }, doc);
  for (const name of ['--app-height', '--vvw', '--vvh', '--visual-vh', '--vv-top', '--vv-left', '--vv-bottom', '--vv-bleed-left', '--vv-bleed-right', '--sat', '--sab', '--sal', '--sar']) html.style.removeProperty(name);
  html.removeAttribute('data-lucy-wide-cover');
  html.removeAttribute('data-ios-standalone-flow');
  const resetScroll = () => {
    win.scrollTo(0, 0);
    if (doc.scrollingElement) { doc.scrollingElement.scrollTop = 0; doc.scrollingElement.scrollLeft = 0; }
  };
  resetScroll();
  // Commit removal of old constraints, then read the next rendered frame.
  void html.getBoundingClientRect();
  await new Promise<void>((resolve) => win.requestAnimationFrame(() => resolve()));
  resetScroll();
  syncVisualViewportBox(win);
  await new Promise<void>((resolve) => win.requestAnimationFrame(() => resolve()));
  syncVisualViewportBox(win);
  scheduleVisualViewportSync(win);
}

let updateRecoveryPrepared = false;

export function prepareViewportAfterUpdate(win: Window): boolean {
  if (updateRecoveryPrepared) return false;
  updateRecoveryPrepared = true;
  let updateReload = false;
  let screenReset = false;
  try {
    updateReload = consumeAppUpdateReload(win.sessionStorage);
    screenReset = consumeAppScreenReset(win.sessionStorage);
  } catch {
    updateReload = false;
  }
  const plan = planViewportRecovery({
    navigationType: readNavigationType(win),
    persisted: false,
    updateReload: updateReload || screenReset,
    iosStandalone: isIosStandaloneWindow(win),
  });
  if (plan.extendRetries) armViewportResumeFill();
  if (plan.resetScroll) {
    try { win.scrollTo(0, 0); } catch { /* ignore */ }
  }
  if (screenReset) void resetAppScreen(win).catch(() => scheduleVisualViewportSync(win));
  return plan.recover;
}

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

/** Coalesce rotation events into one short frame loop instead of waiting for
 * the 80/280ms retry timers when WebKit updates CSS/visual geometry in stages.
 */
export function syncViewportDuringRotation(win: Window = window): void {
  syncVisualViewportBox(win);
  scheduleVisualViewportSync(win);
  rotationFramesRemaining = 12;
  if (rotationFrame) return;
  const tick = () => {
    rotationFrame = 0;
    syncVisualViewportBox(win);
    if (--rotationFramesRemaining > 0) rotationFrame = win.requestAnimationFrame(tick);
  };
  rotationFrame = win.requestAnimationFrame(tick);
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
      return;
    }
    resume(true);
  });

  win.addEventListener('pageshow', (event: PageTransitionEvent) => {
    const plan = planViewportRecovery({
      navigationType: readNavigationType(win),
      persisted: event.persisted,
      iosStandalone: isIosStandaloneWindow(win),
    });
    // A service-worker reload is not a back-forward cache restore, but it
    // leaves the same short frame until the app is backgrounded.
    if (!plan.recover) return;
    if (plan.extendRetries) armViewportResumeFill();
    sawHidden = true;
    resume(true);
  });

  win.addEventListener('load', () => resume(true), { once: true });
  win.navigator?.serviceWorker?.addEventListener('controllerchange', () => {
    armViewportResumeFill();
    resume(true);
  });

  win.addEventListener('focus', () => {
    if (doc.visibilityState === 'hidden') return;
    resume(false);
  });

  win.screen?.orientation?.addEventListener?.('change', () => {
    syncViewportDuringRotation(win);
  });

  win.addEventListener('orientationchange', () => {
    syncViewportDuringRotation(win);
  }, { passive: true });

  doc.addEventListener('resume', () => {
    sawHidden = true;
    resume(true);
  });
}
