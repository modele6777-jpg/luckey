import { useSyncExternalStore, type CSSProperties } from 'react';
import { getMainOverlayViewport, serverMainOverlayViewport, subscribeMainOverlayViewport } from '@/lib/mainOverlayViewport';

/** Scope document-hosted popup geometry and viewport-height variables to main. */
export function useMainOverlayViewport(): CSSProperties {
  const viewport = useSyncExternalStore(subscribeMainOverlayViewport, getMainOverlayViewport, () => serverMainOverlayViewport);
  return {
    left: viewport.left, top: viewport.top, width: viewport.width, height: viewport.height,
    right: 'auto', bottom: 'auto',
    '--app-height': `${viewport.height}px`, '--vv-top': '0px',
    '--overlay-width': `${viewport.width}px`, '--overlay-height': `${viewport.height}px`,
  } as CSSProperties;
}
