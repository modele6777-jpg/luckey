import type { OverlayPane } from '@/lib/overlayPane';
import { useSyncExternalStore, type CSSProperties } from 'react';
import { getMainOverlayViewport, serverMainOverlayViewport, subscribeMainOverlayViewport } from '@/lib/mainOverlayViewport';

const serverViewports = { main: serverMainOverlayViewport, content: serverMainOverlayViewport, lucy: serverMainOverlayViewport };

/** Scope document-hosted popup geometry and viewport-height variables to main. */
export function useMainOverlayViewport(pane: OverlayPane = 'main'): CSSProperties {
  const viewports = useSyncExternalStore(subscribeMainOverlayViewport, getMainOverlayViewport, () => serverViewports);
  const viewport = viewports[pane];
  return {
    left: viewport.left, top: viewport.top, width: viewport.width, height: viewport.height,
    right: 'auto', bottom: 'auto',
    '--app-height': `${viewport.height}px`, '--vv-top': '0px',
    '--lucy-chat-center-x': '50%', '--duo-content-bottom-offset': '1rem',
    '--overlay-width': `${viewport.width}px`, '--overlay-height': `${viewport.height}px`,
  } as CSSProperties;
}
