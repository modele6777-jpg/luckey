import { useLayoutEffect, useState, type CSSProperties } from 'react';
import type { OverlayPane } from '@/lib/overlayPane';

/**
 * Pane popups live inside their own pane element (`[data-workspace-pane]`),
 * which App keeps mounted through every fold. CSS anchors the layer to the
 * pane (`absolute; inset: 0`), so no JavaScript viewport measurement can leave
 * a popup off-screen or zero-sized when iOS reports a stale size mid-fold.
 * Only 'main' (no pane) popups stay on document.body with measured geometry.
 */
export function usePaneOverlayHost(pane: OverlayPane): HTMLElement | null {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const next = pane === 'main' || typeof document === 'undefined'
      ? null
      : document.querySelector<HTMLElement>(`[data-workspace-pane="${pane}"]`);
    setHost(previous => (previous === next ? previous : next));
  }, [pane]);
  return host;
}

/** Fill the host pane with CSS; keep the measured variables dialogs use for max sizes. */
export function paneLayerStyle(measured: CSSProperties): CSSProperties {
  const vars = Object.fromEntries(Object.entries(measured).filter(([key]) => key.startsWith('--')));
  return {
    ...vars,
    position: 'absolute',
    left: 0, top: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  } as CSSProperties;
}
