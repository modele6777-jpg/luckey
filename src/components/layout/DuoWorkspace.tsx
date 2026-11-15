import { OverlayPaneContext } from './OverlayPaneContext';
import { useOverlayPane } from '@/hooks/useOverlayPane';
import { useMainOverlayViewport } from '@/hooks/useMainOverlayViewport';
import { ScreenOverlayContext, isTopScreenOverlay, useScreenOverlayLayer } from './ScreenPortal';
import React, { forwardRef, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export const DuoWorkspace = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DuoWorkspace({ children, className = '', ...props }, ref) {
    return (
      <div ref={ref} className={`duo-workspace-container ${className}`} {...props}>
        <div className="duo-split-workspace">{children}</div>
      </div>
    );
  },
);

export function WorkspacePortal({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  const portalRef = useRef<HTMLDivElement>(null);
  const layers = useScreenOverlayLayer(portalRef);
  const pane = useOverlayPane(portalRef);
  const viewportStyle = useMainOverlayViewport(pane);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(portalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]') || []).filter(element => element.getClientRects().length > 0);
    focusable()[0]?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopScreenOverlay(portalRef.current)) return;
      const target = event.target instanceof Element ? event.target : null;
      const source = target?.closest<HTMLElement>('[data-overlay-pane]');
      if (source && source.dataset.overlayPane !== portalRef.current?.dataset.overlayPane) return;
      const sourcePane = target?.closest('#duo-content-viewport, #duo-lucy-viewport');
      if (sourcePane && sourcePane.id !== (portalRef.current?.dataset.overlayPane === 'lucy' ? 'duo-lucy-viewport' : 'duo-content-viewport')) return;
      if (event.key === 'Escape' && closeRef.current) {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || !portalRef.current?.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !portalRef.current?.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <OverlayPaneContext.Provider value={pane}>
      <ScreenOverlayContext.Provider value={layers}>
        <div ref={portalRef} className="duo-portal" style={viewportStyle} data-overlay-pane={pane} data-screen-overlay-layer="">{children}</div>
      </ScreenOverlayContext.Provider>
    </OverlayPaneContext.Provider>, document.body
  );
}
