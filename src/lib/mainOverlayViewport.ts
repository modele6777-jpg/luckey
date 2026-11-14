export interface MainOverlayViewport { left: number; top: number; width: number; height: number }

/** The visible main canvas, with any overlapping navigation edge removed. */
export function measureMainOverlayViewport(): MainOverlayViewport {
  if (typeof window === 'undefined' || typeof document === 'undefined') return { left: 0, top: 0, width: 0, height: 0 };
  const viewport = window.visualViewport;
  const viewportLeft = viewport?.offsetLeft ?? 0;
  const viewportTop = viewport?.offsetTop ?? 0;
  const viewportRight = viewportLeft + (viewport?.width ?? window.innerWidth);
  const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight);
  const main = document.querySelector<HTMLElement>('.sites-pinned-main');
  const canvas = main?.getBoundingClientRect();
  let left = Math.max(viewportLeft, canvas?.left ?? viewportLeft);
  let top = Math.max(viewportTop, canvas?.top ?? viewportTop);
  let right = Math.min(viewportRight, canvas?.right ?? viewportRight);
  let bottom = Math.min(viewportBottom, canvas?.bottom ?? viewportBottom);
  const navigation = document.querySelector<HTMLElement>('.sites-pinned-sidebar');
  if (navigation && getComputedStyle(navigation).display !== 'none') {
    const nav = navigation.getBoundingClientRect();
    if (nav.width > 0 && nav.height > 0) {
      if (nav.left <= left && nav.right >= right && nav.top > top && nav.top < bottom) bottom = nav.top;
      else if (nav.top <= top && nav.bottom >= bottom && nav.left > left && nav.left < right) right = nav.left;
      else if (nav.top <= top && nav.bottom >= bottom && nav.right > left && nav.right < right) left = nav.right;
      else if (nav.left <= left && nav.right >= right && nav.bottom > top && nav.bottom < bottom) top = nav.bottom;
    }
  }
  return { left, top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
}

const listeners = new Set<() => void>();
let snapshot: MainOverlayViewport | null = null;
let stopObserving: (() => void) | null = null;
export const serverMainOverlayViewport: MainOverlayViewport = { left: 0, top: 0, width: 0, height: 0 };
export function getMainOverlayViewport(): MainOverlayViewport {
  return snapshot ??= measureMainOverlayViewport();
}

/** All popup layers share one geometry observer, including nested dialogs. */
export function subscribeMainOverlayViewport(listener: () => void): () => void {
  listeners.add(listener);
  if (!stopObserving && typeof window !== 'undefined') {
    let frame = 0;
    let trackedMain: Element | null = null;
    let trackedNavigation: Element | null = null;
    const resize = new ResizeObserver(() => schedule());
    const refresh = () => {
      frame = 0;
      const main = document.querySelector('.sites-pinned-main');
      const navigation = document.querySelector('.sites-pinned-sidebar');
      if (main !== trackedMain || navigation !== trackedNavigation) {
        resize.disconnect();
        if (main) resize.observe(main);
        if (navigation) resize.observe(navigation);
        trackedMain = main; trackedNavigation = navigation;
      }
      const next = measureMainOverlayViewport();
      if (snapshot && Object.keys(next).every(key => next[key as keyof MainOverlayViewport] === snapshot![key as keyof MainOverlayViewport])) return;
      snapshot = next;
      listeners.forEach(notify => notify());
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(refresh); };
    const mutation = new MutationObserver(schedule);
    mutation.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    if (document.body) mutation.observe(document.body, { childList: true, subtree: true });
    const viewport = window.visualViewport;
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    window.addEventListener('pageshow', schedule);
    window.addEventListener('scroll', schedule, true);
    viewport?.addEventListener('resize', schedule);
    viewport?.addEventListener('scroll', schedule);
    stopObserving = () => {
      cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      window.removeEventListener('pageshow', schedule);
      window.removeEventListener('scroll', schedule, true);
      viewport?.removeEventListener('resize', schedule);
      viewport?.removeEventListener('scroll', schedule);
    };
    refresh();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) { stopObserving?.(); stopObserving = null; snapshot = null; }
  };
}
