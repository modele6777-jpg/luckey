import { useLayoutEffect, useState, type CSSProperties } from 'react';
import type { OverlayPane } from '@/lib/overlayPane';

/**
 * Popup layers are mounted into a real app element instead of `document.body`,
 * so no JavaScript viewport measurement can leave a popup off-screen or
 * zero-sized when iOS reports a stale size mid-fold.
 *
 * - 'canvas' (dialogs): the visible app canvas (`main.sites-pinned-main`), the
 *   area beside the permanent navigation rail. It is the same element in every
 *   fold state and is sized with percentages, so a dialog fills exactly what the
 *   user sees. Hosting a dialog inside the pane it was opened from let the pane
 *   box decide the dialog's size: in the unfolded duo each pane is half the
 *   canvas, and a pane whose width comes from `vw` can be narrower (or wider)
 *   than the visible canvas, which left dialogs small, short and pushed to one
 *   side.
 * - 'pane' (loading and transition overlays): the owning pane, so a channel
 *   loader still covers only its own half of an unfolded screen.
 */
export type OverlayHostScope = 'canvas' | 'pane';

const paneElement = (pane: OverlayPane) =>
  document.querySelector<HTMLElement>(`[data-workspace-pane="${pane}"]`);

export function usePaneOverlayHost(pane: OverlayPane, scope: OverlayHostScope = 'pane'): HTMLElement | null {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (pane === 'main' || typeof document === 'undefined') {
      setHost(previous => (previous === null ? previous : null));
      return;
    }
    const next = scope === 'canvas'
      ? document.querySelector<HTMLElement>('main.sites-pinned-main, .sites-pinned-main') ?? paneElement(pane)
      : paneElement(pane);
    setHost(previous => (previous === next ? previous : next));
  }, [pane, scope]);
  return host;
}

/** Fill the host element with CSS; keep the measured variables dialogs use for max sizes. */
export function paneLayerStyle(measured: CSSProperties): CSSProperties {
  const vars = Object.fromEntries(Object.entries(measured).filter(([key]) => key.startsWith('--')));
  return {
    ...vars,
    position: 'absolute',
    left: 0, top: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  } as CSSProperties;
}
