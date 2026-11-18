import { OverlayPaneContext } from './OverlayPaneContext';
import { useOverlayPane } from '@/hooks/useOverlayPane';
import { useMainOverlayViewport } from '@/hooks/useMainOverlayViewport';
import { holdLucyScrollPin, noteLucyScrollPin, rectsOverlap } from '@/lib/lucyScrollPin';
import { ScreenOverlayContext, isTopScreenOverlay, useScreenOverlayLayer } from './ScreenPortal';
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { paneLayerStyle, usePaneOverlayHost } from './paneOverlayHost';
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
  const [host, setHostKey] = useState<HTMLElement | null>(null);
  const layers = useScreenOverlayLayer(portalRef, host);
  const pane = useOverlayPane(portalRef, host);
  const paneHost = usePaneOverlayHost(pane);
  useLayoutEffect(() => { setHostKey(paneHost); }, [paneHost]);
  const viewportStyle = useMainOverlayViewport(pane);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>('.lucy-chat-main');
    const savedTop = scroller?.scrollTop ?? 0;
    const pinned = !!scroller && scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 80;
    const portalBox = portalRef.current?.getBoundingClientRect();
    const coversLucy = !!scroller && !!portalBox && (
      portalBox.width > 24 && portalBox.height > 24
        ? rectsOverlap(portalBox, scroller.getBoundingClientRect())
        : portalRef.current?.dataset.overlayPane !== 'content'
    );
    if (coversLucy) noteLucyScrollPin(pinned);
    const restoreChatScroll = () => {
      if (!coversLucy) return;
      const node = document.querySelector<HTMLElement>('.lucy-chat-main');
      if (!node) return;
      const behavior = node.style.scrollBehavior;
      node.style.scrollBehavior = 'auto';
      node.scrollTop = pinned ? node.scrollHeight : savedTop;
      node.style.scrollBehavior = behavior;
    };
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(portalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]') || []).filter(element => element.getClientRects().length > 0);
    const initial = focusable().find(element => element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA' && element.tagName !== 'SELECT') ?? focusable()[0];
    initial?.focus({ preventScroll: true });
    restoreChatScroll();
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
        event.preventDefault(); last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (document.activeElement === last || !portalRef.current?.contains(document.activeElement))) {
        event.preventDefault(); first.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (coversLucy) holdLucyScrollPin();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      restoreChatScroll();
      requestAnimationFrame(() => {
        restoreChatScroll();
        requestAnimationFrame(restoreChatScroll);
      });
    };
  // host: initial focus and key handling follow the layer once it moves into its pane.
  }, [host]);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <OverlayPaneContext.Provider value={pane}>
      <ScreenOverlayContext.Provider value={layers}>
        <div ref={portalRef} className="duo-portal" data-responsive-canvas="true" style={paneHost ? paneLayerStyle(viewportStyle) : viewportStyle} data-overlay-pane={pane} data-screen-overlay-layer="">{children}</div>
      </ScreenOverlayContext.Provider>
    </OverlayPaneContext.Provider>, paneHost ?? document.body
  );
}
