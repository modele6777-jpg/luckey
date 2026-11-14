import type { OverlayPane } from './overlayPane';
export interface MainOverlayViewport { left: number; top: number; width: number; height: number }

/** The visible main canvas, with any overlapping navigation edge removed. */
export function measureMainOverlayViewport(pane: OverlayPane = 'main'): MainOverlayViewport {
  if (typeof window === 'undefined' || typeof document === 'undefined') return { left: 0, top: 0, width: 0, height: 0 };
  const viewport = window.visualViewport;
  const viewportLeft = viewport?.offsetLeft ?? 0;
  const viewportTop = viewport?.offsetTop ?? 0;
  const viewportRight = viewportLeft + (viewport?.width ?? window.innerWidth);
  const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight);
  const main = document.querySelector<HTMLElement>('.sites-pinned-main');
  const mainRect = main?.getBoundingClientRect();
  // A mounting/transitioning main can briefly have zero bounds. Never strand a
  // newly opened popup in a zero-sized clipping layer.
  const canvas = mainRect && mainRect.width > 0 && mainRect.height > 0 ? mainRect : undefined;
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
  if (pane !== 'main') {
    const element = document.getElementById(pane === 'content' ? 'duo-content-viewport' : 'duo-lucy-viewport');
    const rect = element?.getBoundingClientRect();
    if (rect && rect.width > 0 && rect.height > 0) {
      left = Math.max(left, rect.left); top = Math.max(top, rect.top);
      right = Math.min(right, rect.right); bottom = Math.min(bottom, rect.bottom);
    }
  }
  return { left, top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
}

const listeners = new Set<() => void>();
type OverlayViewports = Record<OverlayPane, MainOverlayViewport>;
let snapshot: OverlayViewports | null = null;
const measureAll = (): OverlayViewports => ({ main: measureMainOverlayViewport(), content: measureMainOverlayViewport('content'), lucy: measureMainOverlayViewport('lucy') });
let stopObserving: (() => void) | null = null;
export const serverMainOverlayViewport: MainOverlayViewport = { left: 0, top: 0, width: 0, height: 0 };
export function getMainOverlayViewport(): OverlayViewports {
  return snapshot ??= measureAll();
}

/** All popup layers share one geometry observer, including nested dialogs. */
export function subscribeMainOverlayViewport(listener: () => void): () => void {
  listeners.add(listener);
  if (!stopObserving && typeof window !== 'undefined') {
    let frame = 0;
    let trackedMain: Element | null = null;
    let trackedNavigation: Element | null = null;
    let trackedContent: Element | null = null;
    let trackedLucy: Element | null = null;
    const resize = new ResizeObserver(() => schedule());
    const refresh = () => {
      frame = 0;
      const main = document.querySelector('.sites-pinned-main');
      const navigation = document.querySelector('.sites-pinned-sidebar');
      const content = document.getElementById('duo-content-viewport');
      const lucy = document.getElementById('duo-lucy-viewport');
      if (main !== trackedMain || navigation !== trackedNavigation || content !== trackedContent || lucy !== trackedLucy) {
        resize.disconnect();
        if (main) resize.observe(main);
        if (navigation) resize.observe(navigation);
        if (content) resize.observe(content);
        if (lucy) resize.observe(lucy);
        trackedMain = main; trackedNavigation = navigation; trackedContent = content; trackedLucy = lucy;
      }
      const next = measureAll();
      if (snapshot && (['main', 'content', 'lucy'] as const).every(pane =>
        (['left', 'top', 'width', 'height'] as const).every(key => next[pane][key] === snapshot![pane][key]))) return;
      snapshot = next;
      listeners.forEach(notify => notify());
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(refresh); };
    const mutation = new MutationObserver(schedule);
    const bodyMutation = new MutationObserver(schedule);
    mutation.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    if (document.body) {
      mutation.observe(document.body, { childList: true, subtree: true });
      bodyMutation.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    const viewport = window.visualViewport;
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    window.addEventListener('pageshow', schedule);
    window.addEventListener('scroll', schedule, true);
    viewport?.addEventListener('resize', schedule);
    viewport?.addEventListener('scroll', schedule);
    stopObserving = () => {
      cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect(); bodyMutation.disconnect();
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
