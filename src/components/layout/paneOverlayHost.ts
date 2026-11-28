import { useLayoutEffect, useState, type CSSProperties } from 'react';
import type { OverlayPane } from '@/lib/overlayPane';

/**
 * Popup layers are mounted into a real app element instead of `document.body`,
 * so no JavaScript viewport measurement can leave a popup off-screen or
 * zero-sized when iOS reports a stale size mid-fold.
 *
 * - 'canvas' (dialogs): the app frame (`.prism-app-shell`), which is exactly the
 *   visible screen, with the navigation rail cut out of its box. A dialog must
 *   fill what the user sees beside the rail. Hosting it in the pane it was
 *   opened from made the pane box decide the dialog's size, and hosting it in
 *   `main.sites-pinned-main` inherited that element's width — which can be
 *   narrower than the canvas (a wide rail reserve, a fold transition, an iOS
 *   layout pass), leaving the popup small, short and pushed to one side with a
 *   dark gap beside the rail.
 * - 'pane' (loading and transition overlays): the owning pane, so a channel
 *   loader still covers only its own half of an unfolded screen.
 */
export type OverlayHostScope = 'canvas' | 'pane';

const NAV_SELECTOR = '.sites-pinned-sidebar';
const SHELL_SELECTOR = '.prism-app-shell';
const MAIN_SELECTOR = 'main.sites-pinned-main, .sites-pinned-main';

const paneElement = (pane: OverlayPane) =>
  document.querySelector<HTMLElement>(`[data-workspace-pane="${pane}"]`);

/** The app frame: the element that covers the visible screen in every channel. */
const canvasHostElement = () =>
  document.querySelector<HTMLElement>(SHELL_SELECTOR) ?? document.querySelector<HTMLElement>(MAIN_SELECTOR);

export function usePaneOverlayHost(pane: OverlayPane, scope: OverlayHostScope = 'pane'): HTMLElement | null {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (pane === 'main' || typeof document === 'undefined') {
      setHost(previous => (previous === null ? previous : null));
      return;
    }
    const next = scope === 'canvas'
      ? canvasHostElement() ?? paneElement(pane)
      : paneElement(pane);
    setHost(previous => (previous === next ? previous : next));
  }, [pane, scope]);
  return host;
}

export interface CanvasBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  /** Size of the resulting box: the visible canvas a dialog may use. */
  width?: number;
  height?: number;
}

const EPSILON = 2;

interface RectLike { left: number; top: number; right: number; bottom: number; width: number; height: number }

/**
 * The host box minus the navigation rail: the area a popup must fill. The rail
 * is a screen-edge element, so the edge it sits on decides which side to cut.
 */
export function canvasBoxFromRects(hostRect: RectLike, navRect: RectLike | null): CanvasBox {
  const box: CanvasBox = { left: 0, top: 0, right: 0, bottom: 0 };
  if (!navRect || hostRect.width < 1 || hostRect.height < 1) return box;
  if (navRect.width < 1 || navRect.height < 1) return box;
  const railOnRight = Math.abs(hostRect.right - navRect.right) <= EPSILON
    && navRect.left - hostRect.left > 1
    && navRect.width < hostRect.width * 0.6;
  const railOnLeft = Math.abs(navRect.left - hostRect.left) <= EPSILON
    && hostRect.right - navRect.right > 1
    && navRect.width < hostRect.width * 0.6;
  const railOnBottom = Math.abs(hostRect.bottom - navRect.bottom) <= EPSILON
    && navRect.top - hostRect.top > 1
    && navRect.height < hostRect.height * 0.6;
  const railOnTop = Math.abs(navRect.top - hostRect.top) <= EPSILON
    && hostRect.bottom - navRect.bottom > 1
    && navRect.height < hostRect.height * 0.6;
  if (railOnRight) box.right = Math.max(0, Math.round(hostRect.right - navRect.left));
  else if (railOnLeft) box.left = Math.max(0, Math.round(navRect.right - hostRect.left));
  else if (railOnBottom) box.bottom = Math.max(0, Math.round(hostRect.bottom - navRect.top));
  else if (railOnTop) box.top = Math.max(0, Math.round(navRect.bottom - hostRect.top));
  return box;
}

function readCanvasBox(host: HTMLElement): CanvasBox {
  const hostRect = host.getBoundingClientRect();
  const nav = document.querySelector<HTMLElement>(NAV_SELECTOR);
  const navStyle = nav ? getComputedStyle(nav) : null;
  const hidden = !navStyle || navStyle.display === 'none' || navStyle.visibility === 'hidden';
  const box = canvasBoxFromRects(hostRect, hidden || !nav ? null : nav.getBoundingClientRect());
  return { ...box, ...boxSize(hostRect, box) };
}

const boxSize = (hostRect: RectLike, box: CanvasBox) => ({
  width: Math.max(0, Math.round(hostRect.width - box.left - box.right)),
  height: Math.max(0, Math.round(hostRect.height - box.top - box.bottom)),
});

const sameBox = (a: CanvasBox | null, b: CanvasBox | null) => Boolean(a && b)
  && a!.left === b!.left && a!.top === b!.top && a!.right === b!.right && a!.bottom === b!.bottom
  && a!.width === b!.width && a!.height === b!.height;

/**
 * Keep the dialog box in step with the shell, the rail and a fold or rotation.
 * The box is expressed inside the host, so it never depends on `visualViewport`
 * or on any other element's width.
 */
export function useCanvasLayerBox(host: HTMLElement | null): CanvasBox | null {
  const [box, setBox] = useState<CanvasBox | null>(null);
  useLayoutEffect(() => {
    if (!host || typeof document === 'undefined') {
      setBox(null);
      return;
    }
    const nav = document.querySelector<HTMLElement>(NAV_SELECTOR);
    const update = () => {
      const next = readCanvasBox(host);
      setBox(previous => (sameBox(previous, next) ? previous : next));
    };
    update();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    observer?.observe(host);
    if (nav) observer?.observe(nav);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    // Folding animates the shell and the rail; re-read once the transition settles.
    const settle = window.setTimeout(update, 80);
    const settleAgain = window.setTimeout(update, 320);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.clearTimeout(settle);
      window.clearTimeout(settleAgain);
    };
  }, [host]);
  return box;
}

/**
 * Fill the host element with CSS; keep the measured variables dialogs use for
 * max sizes. With a canvas box the layer fills exactly the area beside the rail.
 */
export function paneLayerStyle(measured: CSSProperties, box?: CanvasBox | null): CSSProperties {
  const vars = Object.fromEntries(Object.entries(measured).filter(([key]) => key.startsWith('--')));
  if (box) {
    return {
      ...vars,
      // The canvas box is the truth for popup sizing; a short or narrow host
      // element must not shrink a dialog through these measured caps.
      ...(box.width ? { '--overlay-width': `${box.width}px` } : {}),
      ...(box.height ? { '--overlay-height': `${box.height}px` } : {}),
      position: 'absolute',
      left: box.left, top: box.top, right: box.right, bottom: box.bottom,
      width: 'auto', height: 'auto',
      maxWidth: 'none', maxHeight: 'none',
    } as CSSProperties;
  }
  return {
    ...vars,
    position: 'absolute',
    left: 0, top: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  } as CSSProperties;
}
