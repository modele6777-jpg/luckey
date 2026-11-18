import { isIosStandaloneWindow, readViewportSnapshot, resolveLayoutViewportSize } from './visualViewportBox';
import type { OverlayPane } from './overlayPane';
export interface MainOverlayViewport { left: number; top: number; width: number; height: number }

const VISUAL_WIDTH_TOLERANCE = 24;
/** A cover-screen gutter between the layout canvas and a screen-edge rail. A wider gap is another pane. */
const RAIL_GUTTER_MAX = 160;

/**
 * Keyboard shrink keeps the same width and may pan vertically.
 * Unfolding changes width; iOS often leaves visualViewport at the cover size
 * or at a stale offset, and intersecting with that hides the popup.
 */
export function visualViewportMatchesLayout(
  layoutWidth: number,
  layoutHeight: number,
  visual: { width: number; height: number; offsetLeft: number; offsetTop: number } | null,
): boolean {
  if (!visual || visual.width < 48 || visual.height < 48) return false;
  if (Math.abs(visual.width - layoutWidth) >= VISUAL_WIDTH_TOLERANCE) return false;
  if (visual.offsetLeft < -2 || visual.offsetLeft > layoutWidth * 0.34) return false;
  if (visual.offsetTop < -2 || visual.offsetTop > layoutHeight * 0.67) return false;
  return true;
}

function paneElement(pane: Exclude<OverlayPane, 'main'>): HTMLElement | null {
  const id = pane === 'content' ? 'duo-content-viewport' : 'duo-lucy-viewport';
  return document.getElementById(id) ?? document.querySelector<HTMLElement>(`[data-workspace-pane="${pane}"]`);
}

/** The visible main canvas, with any overlapping navigation edge removed. */
export function measureMainOverlayViewport(pane: OverlayPane = 'main'): MainOverlayViewport {
  if (typeof window === 'undefined' || typeof document === 'undefined') return { left: 0, top: 0, width: 0, height: 0 };
  const rendered = window.navigator && isIosStandaloneWindow(window)
    ? resolveLayoutViewportSize(readViewportSnapshot(window))
    : { width: window.innerWidth, height: window.innerHeight };
  const layoutWidth = rendered.width;
  const layoutHeight = rendered.height;
  const viewport = window.visualViewport;
  const visual = viewport ? {
    width: viewport.width,
    height: viewport.height,
    offsetLeft: viewport.offsetLeft,
    offsetTop: viewport.offsetTop,
  } : null;
  const useVisual = visualViewportMatchesLayout(layoutWidth, layoutHeight, visual);
  const viewportLeft = useVisual ? visual!.offsetLeft : 0;
  const viewportTop = useVisual ? visual!.offsetTop : 0;
  const viewportRight = viewportLeft + (useVisual ? visual!.width : layoutWidth);
  const viewportBottom = viewportTop + (useVisual ? visual!.height : layoutHeight);
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
    const rect = paneElement(pane)?.getBoundingClientRect();
    if (rect && rect.width > 0 && rect.height > 0) {
      left = Math.max(left, rect.left); top = Math.max(top, rect.top);
      right = Math.min(right, rect.right); bottom = Math.min(bottom, rect.bottom);
    }
  }
  // The layout canvas can stop short of a rail anchored to the screen edge,
  // leaving a dark gutter. The popup fills up to that rail and no farther.
  if (navigation && getComputedStyle(navigation).display !== 'none') {
    const nav = navigation.getBoundingClientRect();
    const span = bottom - top;
    const besideRail = nav.width > 0 && nav.height >= Math.max(120, span * 0.8)
      && nav.top <= top + 8 && nav.bottom >= bottom - 8
      && nav.left >= right - 1 && nav.left - right <= RAIL_GUTTER_MAX;
    if (besideRail) right = nav.left;
  }
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  // A zero intersection hides the dialog completely. Fall back to the visible main canvas.
  if ((width < 48 || height < 48) && pane !== 'main') return measureMainOverlayViewport('main');
  if (width < 48 || height < 48) return { left: 0, top: 0, width: layoutWidth, height: layoutHeight };
  return { left, top, width, height };
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
    // The document element tracks viewport changes even when a synthetic resize
    // event is missed, so a fold or a rail resize cannot leave a popup at the old size.
    resize.observe(document.documentElement);
    const refresh = () => {
      frame = 0;
      const main = document.querySelector('.sites-pinned-main');
      const navigation = document.querySelector('.sites-pinned-sidebar');
      const content = document.getElementById('duo-content-viewport') ?? document.querySelector('[data-workspace-pane="content"]');
      const lucy = document.getElementById('duo-lucy-viewport') ?? document.querySelector('[data-workspace-pane="lucy"]');
      if (main !== trackedMain || navigation !== trackedNavigation || content !== trackedContent || lucy !== trackedLucy) {
        resize.disconnect();
        resize.observe(document.documentElement);
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
      // React can unsubscribe/resubscribe synchronously while notifying.
      // Iterating the live Set can revisit newly-added listeners indefinitely.
      for (const notify of [...listeners]) if (listeners.has(notify)) notify();
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
