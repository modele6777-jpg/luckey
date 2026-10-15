export type PerfProfile = 'full' | 'galaxy' | 'iphonexs' | 'pwa' | 'reduced' | 'legacy';

let cachedProfile: PerfProfile | null = null;
let cachedGalaxyS23: boolean | null = null;
let cachedGalaxyFoldSe: boolean | null = null;
let cachedIPhoneXS: boolean | null = null;

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
      return lower;
    }
    if (params.has('iphonex') || params.has('iphonexs')) return 'iphonexs';
    return window.localStorage?.getItem('prism_device_perf_override') || null;
  } catch {
    return null;
  }
}

export function setDevicePerfOverride(override: 'iphonexs' | 'galaxy' | 'auto' | null): void {
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
    initPerfMode();
  } catch {}
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
  return window.innerWidth < 520;
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
  } else if (!isIPhoneXSClass()) {
    document.documentElement.dataset.device = '';
    document.documentElement.dataset.foldCover = '';
  }
}

export function initPerfMode(): PerfProfile {
  if (cachedProfile) return cachedProfile;

  const profile = resolvePerfProfile();
  cachedProfile = profile;

  if (typeof document === 'undefined') return profile;

  document.documentElement.dataset.perf = profile;

  const isMobile = isMobileDevice();
  if (isMobile) {
    document.documentElement.classList.add('perf-mobile');
    document.documentElement.classList.add('perf-reduced');
  }

  if (profile === 'reduced' || profile === 'pwa' || profile === 'legacy' || profile === 'iphonexs') {
    document.documentElement.classList.add('perf-reduced');
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

  return profile;
}

export function getPerfProfile(): PerfProfile {
  return cachedProfile ?? initPerfMode();
}

export function isPerfReduced(): boolean {
  if (typeof window !== 'undefined' && isMobileDevice()) return true;
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
  return getPerfProfile() === 'galaxy';
}

export function getMaxSynthVoices(): number {
  const profile = getPerfProfile();
  if (profile === 'iphonexs' || profile === 'legacy') return 4;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 10 : 18;
  if (isGalaxyS23Class()) return 12;
  if (profile === 'pwa') return 6;
  if (profile === 'reduced') return 10;
  return 28;
}

export function getAutoSyncIntervalMs(): number {
  const profile = getPerfProfile();
  if (profile === 'iphonexs' || profile === 'legacy') return 10 * 60 * 1000;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 7 * 60 * 1000 : 5 * 60 * 1000;
  if (isGalaxyS23Class()) return 6 * 60 * 1000;
  if (profile === 'pwa') return 8 * 60 * 1000;
  return 5 * 60 * 1000;
}

export function getHubMetricsIntervalMs(): number {
  if (isIPhoneXSClass() || isLegacyMobile()) return 120_000;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 105_000 : 75_000;
  if (isGalaxyS23Class()) return 90_000;
  return 60_000;
}

export function getSyncPendingPollMs(): number {
  if (isIPhoneXSClass() || isLegacyMobile()) return 10_000;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 8_000 : 5_000;
  if (isGalaxyS23Class()) return 7_000;
  return 5_000;
}

export function getSwUpdateIntervalMs(): number {
  if (isIPhoneXSClass() || isLegacyMobile()) return 45 * 60 * 1000;
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
  return !isIPhoneXSClass() && !isLegacyMobile();
}

const NARROW_PHONE_MAX_WIDTH = 390;
let narrowPhoneListenerAttached = false;

export function isNarrowPhone(): boolean {
  if (typeof window === 'undefined') return false;
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

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  // 1. Apple capped iPhone X (A11 Bionic) at iOS 16.7.
  //    iOS 17+ means the device is at minimum iPhone XR (A12) or newer — not a legacy device.
  //    iOS 16 or older = iPhone X era, treat as legacy.
  const isIOS17Plus = /OS (1[7-9]|[2-9]\d)_/i.test(ua);
  if (isIOS17Plus) {
    // iOS 17+ devices are NOT XS-class legacy devices
    cachedIPhoneXS = false;
    return false;
  }
  if (/OS (1[0-6])_[0-9]/i.test(ua)) {
    cachedIPhoneXS = true;
    return true;
  }

  // 2. Exact screen physical resolution of iPhone X / XS: 375 x 812 with DPR >= 2.5
  //    NOTE: iPhone 11 Pro is also 375x812 but runs iOS 17 max — already excluded above.
  const sw = window.screen?.width || window.innerWidth;
  const sh = window.screen?.height || window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const is375x812 = (sw === 375 && sh === 812) || (sw === 812 && sh === 375);

  if (is375x812 && dpr >= 2.5) {
    cachedIPhoneXS = true;
    return true;
  }

  // 3. REMOVED: the minDim<=390 && dpr>=2.5 check was a false-positive catch-all
  //    that matched iPhone 13 mini (375x812 @3x, iOS 17+), iPhone SE 3 (375x667 @2x),
  //    and iPhone 16 Pro (393x852 @3x). Only match verified legacy screen sizes.
  //    iPhone X/XS: 375x812. iPhone 8: 375x667 @2x (DPR=2, excluded by dpr>=2.5).

  // General iPhone with narrow screen that failed all above checks → not legacy
  cachedIPhoneXS = false;
  return cachedIPhoneXS;
}

export function initNarrowPhoneClass(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const apply = () => {
    cachedGalaxyS23 = null;
    cachedGalaxyFoldSe = null;
    cachedIPhoneXS = null;

    const narrow = isNarrowPhone();
    document.documentElement.classList.toggle('prism-iphone-xs', narrow);
    document.documentElement.dataset.narrow = narrow ? 'true' : 'false';

    applyIPhoneXSDeviceFlags();
    applyGalaxyDeviceFlags();
  };

  apply();

  if (!narrowPhoneListenerAttached) {
    narrowPhoneListenerAttached = true;
    window.addEventListener('resize', apply, { passive: true });
    window.addEventListener('orientationchange', apply, { passive: true });
  }
}
