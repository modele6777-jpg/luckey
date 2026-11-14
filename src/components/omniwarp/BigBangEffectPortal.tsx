import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useMainOverlayViewport } from '@/hooks/useMainOverlayViewport';

/** Visual effects always belong to content, irrespective of the button's pane. */
export function BigBangEffectPortal({ children, zIndex = 9999 }: { children: ReactNode; zIndex?: number }) {
  const bounds = useMainOverlayViewport('content');
  if (typeof document === 'undefined') return null;
  return createPortal(<div data-bigbang-effect-viewport="content" style={{
    ...bounds, position: 'fixed', zIndex, pointerEvents: 'none',
    transform: 'translateZ(0)', contain: 'layout paint', overflow: 'clip',
    clipPath: 'inset(0)',
  }}>{children}</div>, document.body);
}
