import { markFoldRuntime } from './foldRuntimeTrace';

/**
 * iOS home-screen web apps can come out of a fold/unfold with a zero-height
 * viewport (`innerHeight === 0`, `visualViewport.height === 0`) while the
 * document still lays out at full size. WebKit then hit-tests every touch to
 * <html>: nothing responds, yet native scrolling keeps working. A device
 * trace showed this state lasting until the app was backgrounded.
 *
 * When the viewport reads as zero, ask WebKit to rebuild its viewport by
 * re-applying the viewport meta (a sub-pixel scale change, restored on the
 * next frame) and resetting the scroll position. Nothing runs while the
 * viewport is healthy.
 */
const CHECK_DELAYS_MS = [0, 120, 300, 600, 1000, 1600, 2500, 4000] as const;
const NUDGE_GAP_MS = 250;
const MAX_NUDGES_PER_EPISODE = 8;
<<<<<<< HEAD
/**
 * Device traces show the collapse always clears on a fresh page load. If the
 * nudges have not restored the viewport within this time, reload once
 * (at most every RELOAD_GUARD_MS) instead of leaving a dead screen.
 */
const RELOAD_AFTER_MS = 2000;
const RELOAD_GUARD_MS = 20000;
const RELOAD_KEY = 'luckey-viewport-reload-at';

function reloadOnce(win: Window): boolean {
  try {
    const last = Number(win.sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_GUARD_MS) return false;
    win.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch { /* without storage, still reload once per page */ }
  markFoldRuntime('viewport-reload');
  win.location.reload();
  return true;
}
=======
>>>>>>> origin/main

export function isViewportCollapsed(win: Window): boolean {
  if (win.document.hidden) return false;
  const visualHeight = win.visualViewport?.height ?? win.innerHeight;
  const visualWidth = win.visualViewport?.width ?? win.innerWidth;
  return win.innerHeight <= 1 || visualHeight <= 1 || visualWidth <= 1;
}

function isAppleTouchDevice(win: Window): boolean {
  const nav = win.navigator as Navigator & { platform?: string; maxTouchPoints?: number };
  return /iPhone|iPad|iPod/i.test(nav.userAgent || '') || (nav.platform === 'MacIntel' && (nav.maxTouchPoints || 0) > 1);
}

export function nudgeViewport(win: Window, attempt: number): void {
  const doc = win.document;
  const meta = doc.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (meta) {
    const original = meta.getAttribute('content') || '';
    // Any changed value makes WebKit recompute the viewport configuration.
    const nudged = /initial-scale=[\d.]+/.test(original)
      ? original.replace(/initial-scale=[\d.]+/, attempt % 2 ? 'initial-scale=0.9999' : 'initial-scale=1.0001')
      : `${original}, initial-scale=1.0001`;
    meta.setAttribute('content', nudged);
    win.requestAnimationFrame(() => meta.setAttribute('content', original));
  }
  // A scroll position change also makes WebKit re-evaluate the visual viewport.
  try {
    win.scrollTo(0, attempt % 2 ? 1 : 0);
    win.requestAnimationFrame(() => win.scrollTo(0, 0));
  } catch { /* scrolling is best effort */ }
}

export function installIosViewportRecovery(win: Window = window): () => void {
  if (typeof win === 'undefined' || !isAppleTouchDevice(win)) return () => {};
  let timers: ReturnType<typeof setTimeout>[] = [];
  let nudges = 0;
  let lastNudgeAt = 0;
  let collapsed = false;
<<<<<<< HEAD
  let collapsedSince = 0;
  let reloaded = false;
=======
>>>>>>> origin/main

  const check = () => {
    if (!isViewportCollapsed(win)) {
      if (collapsed) markFoldRuntime('viewport-recovered');
      collapsed = false;
      nudges = 0;
      return;
    }
<<<<<<< HEAD
    const now = Date.now();
    if (!collapsed) { markFoldRuntime('viewport-zero'); collapsedSince = now; }
    collapsed = true;
    if (!reloaded && now - collapsedSince >= RELOAD_AFTER_MS) { reloaded = reloadOnce(win); return; }
=======
    if (!collapsed) markFoldRuntime('viewport-zero');
    collapsed = true;
    const now = Date.now();
>>>>>>> origin/main
    if (nudges >= MAX_NUDGES_PER_EPISODE || now - lastNudgeAt < NUDGE_GAP_MS) return;
    nudges += 1;
    lastNudgeAt = now;
    markFoldRuntime('viewport-nudge');
    nudgeViewport(win, nudges);
  };

  const schedule = () => {
    timers.forEach(clearTimeout);
    timers = CHECK_DELAYS_MS.map(delay => setTimeout(check, delay));
  };

  const events = ['orientationchange', 'resize', 'pageshow', 'focus'] as const;
  events.forEach(name => win.addEventListener(name, schedule, { passive: true }));
  win.visualViewport?.addEventListener('resize', schedule, { passive: true });
  win.document.addEventListener('visibilitychange', schedule);
  // A touch that lands while the viewport is collapsed re-checks immediately.
  const onTouch = () => { if (isViewportCollapsed(win)) { nudges = 0; lastNudgeAt = 0; schedule(); } };
  win.addEventListener('touchstart', onTouch, { passive: true, capture: true });
  schedule();

  return () => {
    timers.forEach(clearTimeout);
    events.forEach(name => win.removeEventListener(name, schedule));
    win.visualViewport?.removeEventListener('resize', schedule);
    win.document.removeEventListener('visibilitychange', schedule);
    win.removeEventListener('touchstart', onTouch, { capture: true });
  };
}
