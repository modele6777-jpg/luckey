import { bindVisualViewportLifecycle, prepareViewportAfterUpdate, scheduleVisualViewportSync, syncVisualViewportBox } from './visualViewportBox';

export type PerfProfile = 'full' | 'galaxy' | 'duo' | 'iphonexs' | 'pwa' | 'reduced' | 'legacy';

let cachedProfile: PerfProfile | null = null;
let cachedGalaxyS23: boolean | null = null;
let cachedGalaxyFoldSe: boolean | null = null;
let cachedIPhoneXS: boolean | null = null;
let cachedDuo: boolean | null = null;

export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (isIOSDevice() || isAndroidDevice()) return true;
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
  }
  return false;
}

export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function getDevicePerfOverride(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const paramDev = params.get('device') || params.get('perf');
    if (paramDev) {
      const lower = paramDev.toLowerCase();
      if (lower === 'iphonex' || lower === 'iphonexs') return 'iphonexs';
      if (lower === 'duo' || lower === 'iphoneduo' || lower === 'surfaceduo') return 'duo';
      return lower;
    }
    if (params.has('iphonex') || params.has('iphonexs')) return 'iphonexs';
    if (params.has('duo') || params.has('iphoneduo')) return 'duo';
    return window.localStorage?.getItem('prism_device_perf_override') || null;
  } catch {
    return null;
  }
}

export function setDevicePerfOverride(override: 'iphonexs' | 'galaxy' | 'duo' | 'auto' | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (override && override !== 'auto') {
      window.localStorage?.setItem('prism_device_perf_override', override);
    } else {
      window.localStorage?.removeItem('prism_device_perf_override');
    }
    cachedProfile = null;
    cachedIPhoneXS = null;
    cachedGalaxyS23 = null;
    cachedGalaxyFoldSe = null;
    cachedDuo = null;
    initPerfMode();
  } catch {}
}

/**
 * Surface Duo / Foldable Dual-Screen / iPhone Duo detection.
 * Checks W3C Viewport Segments API, spanning media queries, UA, and dual-screen geometry.
 */
export function isSurfaceDuoOrDualScreen(): boolean {
  if (cachedDuo !== null) return cachedDuo;
  if (typeof window === 'undefined') return false;

  const override = getDevicePerfOverride();
  if (override === 'duo' || override === 'iphoneduo') {
    cachedDuo = true;
    return true;
  }

  try {
    if (
      window.matchMedia('(horizontal-viewport-segments: 2)').matches ||
      window.matchMedia('(vertical-viewport-segments: 2)').matches ||
      window.matchMedia('(spanning: single-fold-vertical)').matches ||
      window.matchMedia('(spanning: single-fold-horizontal)').matches
    ) {
      cachedDuo = true;
      return true;
    }
  } catch {}

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  if (/Surface Duo|SurfaceDuo|iPhone Duo|iPhone.*Duo/i.test(ua)) {
    cachedDuo = true;
    return true;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const sw = window.screen?.width || w;
  const sh = window.screen?.height || h;

  // Surface Duo 1 (540x720 single / 1114x720 spanned) & Surface Duo 2 (556x896 single / 1344x896 spanned)
  const isDuoGeometry =
    (w >= 1080 && w <= 1380 && h >= 660 && h <= 930) ||
    (w >= 525 && w <= 575 && h >= 680 && h <= 920);

  // iPhone Duo Outer (5.4" 1398x2034 ~466 CSS px) & Inner (7.6" 1878x2670 ~626-890 CSS px, ratio ~1.05:1)
  const isIPhoneDuoGeometry =
    (sw >= 430 && sw <= 490 && sh >= 640 && sh <= 740) ||
    (sw >= 640 && sw <= 740 && sh >= 430 && sh <= 490) ||
    (Math.min(w, h) >= 600 && Math.min(w, h) <= 920 && (Math.min(w, h) / Math.max(w, h)) >= 0.70);

  cachedDuo = isDuoGeometry || isIPhoneDuoGeometry;
  return cachedDuo;
}

/**
 * Checks if current viewport is iPhone Duo or Foldable outer cover screen in portrait
 */
export function isIPhoneDuoCoverScreen(): boolean {
  return typeof window !== 'undefined' && !isDuoUnfoldedState().unfolded;
}

/** All consumers (layout, navigation and Lucy) share the same fold decision. */
export function isDualPaneLayout(): boolean {
  return isDuoUnfoldedState().unfolded;
}

export interface DuoUnfoldedState {
  unfolded: boolean;
  orientation: 'landscape' | 'portrait';
}

/** Rotation-invariant geometry: a narrow phone stays folded in either direction. */
export function resolveDuoViewport(width: number, height: number, spanned = false): DuoUnfoldedState {
  // 1. Spanned API (hardware hinge detection)
  if (spanned) {
    return { unfolded: true, orientation: width > height ? 'landscape' : 'portrait' };
  }

  // 2. Explicit cover screen: any portrait phone with width < 540px is strictly folded
  if (width <= height && width < 540) {
    return { unfolded: false, orientation: 'portrait' };
  }

  // 3. Clear inner unfolded screen: both dimensions are large (e.g. 7.6" inner display) or wide landscape
  const shortSide = Math.min(width, height);
  const longSide = Math.max(width, height);
  const ratio = shortSide / Math.max(longSide, 1);

  const isUnfolded = (shortSide >= 550 && ratio >= 0.72) || longSide >= 768 || (width > height && width >= 600);

  return {
    unfolded: isUnfolded,
    orientation: width > height ? 'landscape' : 'portrait',
  };
}

let lastDuoLayoutViewport: { width: number; height: number } | null = null;

export function isDuoUnfoldedState(): DuoUnfoldedState {
  if (typeof window === 'undefined') return { unfolded: false, orientation: 'portrait' };
  const width = window.innerWidth;
  const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
  const isInputActive = Boolean(
    activeEl &&
    (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable)
  );
  const keyboardOpen =
    (typeof document !== 'undefined' &&
      (document.documentElement.classList.contains('keyboard-open') ||
       document.body?.classList.contains('keyboard-open') ||
       document.documentElement.classList.contains('lucy-input-focused') ||
       document.body?.classList.contains('lucy-input-focused'))) ||
    isInputActive;
  // A keyboard reduces available height; it does not fold the device.
  const height = keyboardOpen && lastDuoLayoutViewport?.width === width
    ? lastDuoLayoutViewport.height : window.innerHeight;
  if (!keyboardOpen) lastDuoLayoutViewport = { width, height };
  const spanned = [
    '(horizontal-viewport-segments: 2)', '(vertical-viewport-segments: 2)',
    '(spanning: single-fold-vertical)', '(spanning: single-fold-horizontal)',
  ].some(query => {
    try { return window.matchMedia(query).matches; } catch { return false; }
  });

  // Explicit cover screen: portrait phone with width < 540 is NEVER dual
  if (width <= height && width < 540 && !spanned) {
    return { unfolded: false, orientation: 'portrait' };
  }

  return resolveDuoViewport(width, height, spanned);
}

function isFoldableInnerScreen(): boolean {
  if (typeof window === 'undefined' || !isAndroidDevice()) return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const minSide = Math.min(w, h);
  const maxSide = Math.max(w, h);
  const dpr = window.devicePixelRatio || 1;
  return minSide >= 560 && maxSide >= 880 && dpr >= 2;
}

function isFoldableCoverScreen(): boolean {
  if (typeof window === 'undefined' || !isAndroidDevice()) return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  return w >= 320 && w <= 460 && h >= 640 && h / Math.max(w, 1) >= 2.1 && dpr >= 2.5;
}

/** Galaxy Z Fold SE / Special Edition (Snapdragon 8 Gen 3 foldable) */
export function isGalaxyFoldSeClass(): boolean {
  if (cachedGalaxyFoldSe !== null) return cachedGalaxyFoldSe;
  if (!isAndroidDevice() || typeof window === 'undefined') {
    cachedGalaxyFoldSe = false;
    return false;
  }

  const ua = navigator.userAgent;
  if (
    /SM-F9[456][0-9][A-Z]?|SM-F7[0-9]{2}|Galaxy Z Fold.*(SE|Special)|Z Fold SE|Fold Special/i.test(
      ua,
    )
  ) {
    cachedGalaxyFoldSe = true;
    return true;
  }

  cachedGalaxyFoldSe = isFoldableInnerScreen() || isFoldableCoverScreen();
  return cachedGalaxyFoldSe;
}

export function isFoldCoverScreen(): boolean {
  if (!isGalaxyFoldSeClass() || typeof window === 'undefined') return false;
  return Math.min(window.innerWidth, window.innerHeight) < 520;
}

/** Galaxy S23-class flagships — perf tuning only, no UI overrides */
export function isGalaxyS23Class(): boolean {
  if (cachedGalaxyS23 !== null) return cachedGalaxyS23;
  if (!isAndroidDevice() || typeof window === 'undefined') {
    cachedGalaxyS23 = false;
    return false;
  }

  const ua = navigator.userAgent;
  if (/SM-S91[1-8]|Galaxy S23/i.test(ua)) {
    cachedGalaxyS23 = true;
    return true;
  }

  if (isGalaxyFoldSeClass()) {
    cachedGalaxyS23 = false;
    return false;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const portrait = h >= w;

  cachedGalaxyS23 =
    portrait && w >= 360 && w <= 412 && dpr >= 2.5 && h >= 640;
  return cachedGalaxyS23;
}

export function isGalaxyPremiumClass(): boolean {
  return isGalaxyFoldSeClass() || isGalaxyS23Class();
}

function resolvePerfProfile(): PerfProfile {
  if (isSurfaceDuoOrDualScreen()) return 'duo';
  if (isIPhoneXSClass()) return 'iphonexs';
  if (isNarrowPhone() && isIOSDevice()) return 'legacy';
  if (isGalaxyFoldSeClass() || isGalaxyS23Class()) return 'galaxy';
  if (isStandalonePWA() && isMobileDevice()) return 'pwa';
  if (isStandalonePWA() || isMobileDevice()) return 'reduced';
  return 'full';
}

function applyIPhoneXSDeviceFlags(): void {
  if (typeof document === 'undefined') return;

  const isXS = isIPhoneXSClass();
  document.documentElement.classList.toggle('perf-iphone-xs', isXS);
  document.documentElement.classList.toggle('prism-iphone-xs', isXS || isNarrowPhone());
  if (isXS) {
    document.documentElement.dataset.device = 'iphone-xs';
    document.documentElement.dataset.narrow = 'true';
    document.documentElement.classList.add('perf-reduced');
    document.documentElement.classList.add('perf-legacy');
  }
}

function applyGalaxyDeviceFlags(): void {
  if (typeof document === 'undefined') return;

  const fold = isGalaxyFoldSeClass();
  const s23 = isGalaxyS23Class();

  document.documentElement.classList.toggle('perf-galaxy-fold', fold);
  document.documentElement.classList.toggle('perf-galaxy', s23 || fold);

  if (fold) {
    document.documentElement.dataset.device = 'galaxy-fold-se';
    document.documentElement.dataset.foldCover = isFoldCoverScreen() ? 'true' : 'false';
  } else if (s23) {
    document.documentElement.dataset.device = 'galaxy-s23';
    document.documentElement.dataset.foldCover = '';
  } else if (!isIPhoneXSClass() && !isSurfaceDuoOrDualScreen()) {
    document.documentElement.dataset.device = '';
    document.documentElement.dataset.foldCover = '';
  }
}

function applyDuoAndViewportFlags(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const isDuo = isSurfaceDuoOrDualScreen();
  const dualPane = isDualPaneLayout();
  const isLandscape = window.innerWidth > window.innerHeight;
  const isCover = isIPhoneDuoCoverScreen() || isFoldCoverScreen();
  const isUltra = isDuo || dualPane;

  document.documentElement.classList.toggle('perf-duo', isUltra);
  document.documentElement.classList.toggle('perf-duo-ultra', isUltra);
  document.documentElement.classList.toggle('dual-pane-active', dualPane);
  document.documentElement.dataset.dualScreen = dualPane ? 'true' : 'false';
  document.documentElement.dataset.orientation = isLandscape ? 'landscape' : 'portrait';
  document.documentElement.dataset.foldCover = isCover ? 'true' : 'false';

  if (isUltra || isDuo) {
    // Unlock full 120Hz ProMotion & maximum visual/audio power
    document.documentElement.classList.remove('perf-reduced');
    document.documentElement.classList.remove('perf-legacy');
  }

  if (isDuo) {
    const isIOS = isIOSDevice();
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (isIOS || /iPhone/i.test(ua)) {
      document.documentElement.dataset.device = 'iphone-duo';
    } else {
      document.documentElement.dataset.device = 'surface-duo';
    }
  }

  syncVisualViewportBox(window);
}

export function initPerfMode(): PerfProfile {
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    prepareViewportAfterUpdate(window);
  }
  if (cachedProfile) return cachedProfile;

  const profile = resolvePerfProfile();
  cachedProfile = profile;

  if (typeof document === 'undefined') return profile;

  document.documentElement.dataset.perf = profile;

  const isMobile = isMobileDevice();
  const isDuoOrDual = isSurfaceDuoOrDualScreen() || isDualPaneLayout();
  if (isMobile) {
    document.documentElement.classList.add('perf-mobile');
    if (!isDuoOrDual && profile !== 'duo') {
      document.documentElement.classList.add('perf-reduced');
    }
  }

  if (profile === 'reduced' || profile === 'pwa' || profile === 'legacy' || profile === 'iphonexs') {
    if (!isDuoOrDual) {
      document.documentElement.classList.add('perf-reduced');
    }
  }
  if (profile === 'legacy' || profile === 'iphonexs') {
    document.documentElement.classList.add('perf-legacy');
    document.documentElement.classList.add('prism-iphone-xs');
    document.documentElement.dataset.narrow = 'true';
  }
  if (profile === 'iphonexs') {
    document.documentElement.classList.add('perf-iphone-xs');
    document.documentElement.dataset.device = 'iphone-xs';
  }
  if (isStandalonePWA()) {
    document.documentElement.classList.add('pwa-standalone');
  }

  applyIPhoneXSDeviceFlags();
  applyGalaxyDeviceFlags();
  applyDuoAndViewportFlags();

  return profile;
}

export function getPerfProfile(): PerfProfile {
  return cachedProfile ?? initPerfMode();
}

export function isPerfReduced(): boolean {
  if (typeof window !== 'undefined') {
    if (isSurfaceDuoOrDualScreen() || isDualPaneLayout()) return false;
  }
  const profile = getPerfProfile();
  return profile === 'reduced' || profile === 'pwa' || profile === 'legacy' || profile === 'iphonexs';
}

export function isPwaStandalone(): boolean {
  return getPerfProfile() === 'pwa';
}

export function isLegacyMobile(): boolean {
  const profile = getPerfProfile();
  return profile === 'legacy' || profile === 'iphonexs';
}

export function isGalaxyPerfProfile(): boolean {
  return getPerfProfile() === 'galaxy' || getPerfProfile() === 'duo';
}

export function getMaxSynthVoices(): number {
  const profile = getPerfProfile();
  if (profile === 'iphonexs' || profile === 'legacy') return 4;
  if (profile === 'duo' || isSurfaceDuoOrDualScreen() || isDualPaneLayout()) return 32;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 10 : 24;
  if (isGalaxyS23Class()) return 16;
  if (profile === 'pwa') return 8;
  if (profile === 'reduced') return 12;
  return 32;
}

export function getAutoSyncIntervalMs(): number {
  const profile = getPerfProfile();
  if (profile === 'iphonexs' || profile === 'legacy') return 10 * 60 * 1000;
  if (profile === 'duo' || isSurfaceDuoOrDualScreen() || isDualPaneLayout()) return 3 * 60 * 1000;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 7 * 60 * 1000 : 5 * 60 * 1000;
  if (isGalaxyS23Class()) return 6 * 60 * 1000;
  if (profile === 'pwa') return 8 * 60 * 1000;
  return 5 * 60 * 1000;
}

export function getHubMetricsIntervalMs(): number {
  if (isIPhoneXSClass() || isLegacyMobile()) return 120_000;
  if (isSurfaceDuoOrDualScreen() || isDualPaneLayout()) return 30_000;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 105_000 : 75_000;
  if (isGalaxyS23Class()) return 90_000;
  return 60_000;
}

export function getSyncPendingPollMs(): number {
  if (isIPhoneXSClass() || isLegacyMobile()) return 10_000;
  if (isSurfaceDuoOrDualScreen() || isDualPaneLayout()) return 2_500;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 8_000 : 5_000;
  if (isGalaxyS23Class()) return 7_000;
  return 5_000;
}

export function getSwUpdateIntervalMs(): number {
  if (isIPhoneXSClass() || isLegacyMobile()) return 45 * 60 * 1000;
  if (isSurfaceDuoOrDualScreen()) return 30 * 60 * 1000;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 40 * 60 * 1000 : 30 * 60 * 1000;
  if (isGalaxyS23Class()) return 35 * 60 * 1000;
  if (isPwaStandalone()) return 30 * 60 * 1000;
  return 15 * 60 * 1000;
}

export function shouldUsePageTransitions(): boolean {
  return false;
}

export function shouldMountBgMusicPlayer(): boolean {
  return true;
}

export function shouldPreloadBgmAudio(): boolean {
  if (isMobileDevice() || isLegacyMobile()) return false;
  return true;
}

const NARROW_PHONE_MAX_WIDTH = 390;
let narrowPhoneListenerAttached = false;

export function isNarrowPhone(): boolean {
  if (typeof window === 'undefined') return false;
  if (isDualPaneLayout()) return false;
  if (isGalaxyFoldSeClass() && !isFoldCoverScreen()) return false;
  return window.innerWidth <= NARROW_PHONE_MAX_WIDTH;
}

/**
 * iPhone XS detection (Apple A12 Bionic, 5.8" Super Retina OLED, 375x812 pt @ 3x DPR).
 * Supports explicit override ('?device=iphonexs', localStorage, or physical dimensions).
 */
export function isIPhoneXSClass(): boolean {
  if (cachedIPhoneXS !== null) return cachedIPhoneXS;
  if (typeof window === 'undefined') return false;

  const override = getDevicePerfOverride();
  if (override === 'iphonexs' || override === 'iphonex') {
    cachedIPhoneXS = true;
    return true;
  }
  if (override && override !== 'iphonexs' && override !== 'iphonex' && override !== 'auto') {
    cachedIPhoneXS = false;
    return false;
  }

  const isIOS = isIOSDevice();
  if (!isIOS) {
    cachedIPhoneXS = false;
    return false;
  }

  // 1. Exact screen physical resolution of iPhone X / XS / 11 Pro / mini: 375 x 812 (or innerWidth <= 375 on iOS)
  const sw = window.screen?.width || window.innerWidth;
  const sh = window.screen?.height || window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const is375x812 =
    (sw === 375 && sh === 812) ||
    (sw === 812 && sh === 375) ||
    (window.innerWidth === 375 && window.innerHeight <= 812);

  if (is375x812 && dpr >= 2) {
    cachedIPhoneXS = true;
    return true;
  }

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  if (/OS (1[0-6])_[0-9]/i.test(ua)) {
    cachedIPhoneXS = true;
    return true;
  }

  cachedIPhoneXS = false;
  return cachedIPhoneXS;
}

export function initNarrowPhoneClass(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const apply = () => {
    cachedGalaxyS23 = null;
    cachedGalaxyFoldSe = null;
    cachedIPhoneXS = null;
    cachedDuo = null;

    const narrow = isNarrowPhone();
    document.documentElement.classList.toggle('prism-iphone-xs', narrow);
    document.documentElement.dataset.narrow = narrow ? 'true' : 'false';

    applyIPhoneXSDeviceFlags();
    applyGalaxyDeviceFlags();
    applyDuoAndViewportFlags();
  };

  apply();

  if (!narrowPhoneListenerAttached) {
    narrowPhoneListenerAttached = true;
    const applySoon = () => {
      apply();
      // orientationchange and toolbar show/hide report a stale height for a few frames.
      scheduleVisualViewportSync(window);
    };
    window.addEventListener('resize', applySoon, { passive: true });
    window.addEventListener('orientationchange', applySoon, { passive: true });
    window.addEventListener('pageshow', applySoon);
    window.visualViewport?.addEventListener('resize', applySoon, { passive: true });
    window.visualViewport?.addEventListener('scroll', () => {
      syncVisualViewportBox(window);
    }, { passive: true });
    bindVisualViewportLifecycle(window);
    scheduleVisualViewportSync(window);
  }
}

