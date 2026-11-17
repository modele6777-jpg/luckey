import { OverlayPaneContext } from './OverlayPaneContext';
import { useOverlayPane } from '@/hooks/useOverlayPane';
import { useMainOverlayViewport } from '@/hooks/useMainOverlayViewport';
import React, { createContext, useContext, useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

export const ScreenOverlayContext = createContext<readonly RefObject<HTMLDivElement | null>[]>([]);

/** Mounted popup content remains open even while fold geometry temporarily becomes zero. */
export function hasOpenScreenOverlay(): boolean {
  if (Array.from(document.querySelectorAll<HTMLElement>('[data-screen-overlay-layer]'))
    .some(layer => layer.childElementCount > 0)) return true;
  const visibleDialog = (doc: Document) => Array.from(doc.querySelectorAll<HTMLElement>('[role="dialog"], dialog[open]'))
    .some(dialog => {
      if (dialog.hidden || dialog.getAttribute('aria-hidden') === 'true') return false;
      const style = doc.defaultView?.getComputedStyle(dialog);
      return style?.visibility !== 'hidden' && style?.display !== 'none';
    });
  if (visibleDialog(document)) return true;
  // Key's practice dialogs live in its same-origin frame, outside React portals.
  return Array.from(document.querySelectorAll('iframe')).some(frame => {
    try {
      return Boolean(frame.contentDocument && visibleDialog(frame.contentDocument));
    } catch { return false; }
  });
}

/** Choose the popup owner before a fold can hide either pane. Geometry may be zero mid-fold. */
export function getOpenScreenOverlayPane(): 'content' | 'lucy' | null {
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-screen-overlay-layer][data-overlay-pane]'))
    .filter(layer => layer.childElementCount > 0 && Boolean(layer.querySelector('[role="dialog"], dialog[open], .fixed.inset-0')))
    .sort((a, b) => (Number(b.style.zIndex) || 10000) - (Number(a.style.zIndex) || 10000));
  for (const layer of layers) {
    const owner = layer.dataset.overlayPane;
    if (owner === 'content' || owner === 'lucy') return owner;
  }
  for (const frame of Array.from(document.querySelectorAll('iframe'))) {
    try {
      if (!frame.contentDocument?.querySelector('[role="dialog"], dialog[open]')) continue;
      const owner = frame.closest<HTMLElement>('[data-workspace-pane]')?.dataset.workspacePane;
      if (owner === 'content' || owner === 'lucy') return owner;
    } catch { /* Cross-origin frames own their own state. */ }
  }
  return null;
}

/** Only occupied overlays participate; opening order wins over JSX declaration order. */
export function isTopScreenOverlay(element: HTMLElement | null): boolean {
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-screen-overlay-layer]'))
    .filter(layer => {
      if (!layer.childElementCount || !element) return false;
      if (getComputedStyle(layer).display === 'none') return false;
      const a = layer.getBoundingClientRect();
      const b = element.getBoundingClientRect();
      // Independent pane dialogs must not disable each other's controls.
      return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    });
  layers.sort((a, b) => Number(a.style.zIndex) - Number(b.style.zIndex));
  return layers.at(-1) === element;
}

export function useScreenOverlayLayer(ref: RefObject<HTMLDivElement | null>) {
  const parents = useContext(ScreenOverlayContext);
  const chain = useMemo(() => [...parents, ref], [parents, ref]);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    let occupied = false;
    const sync = () => {
      const hasContent = element.childElementCount > 0;
      if (hasContent === occupied) return;
      occupied = hasContent;
      if (!hasContent) {
        element.style.removeProperty('z-index');
        return;
      }
      const nextLayer = () => Array.from(document.querySelectorAll<HTMLElement>('[data-screen-overlay-layer]'))
        .reduce((layer, other) => Math.max(layer, Number(other.style.zIndex) || 10000), 10000) + 1;
      // Child layout effects run first. Reserve ancestor layers before the child
      // when both open in the same commit, so a parent cannot cover its dialog.
      for (const parent of parents) {
        const node = parent.current;
        if (node?.childElementCount && !node.style.zIndex) node.style.zIndex = String(nextLayer());
      }
      if (!element.style.zIndex) element.style.zIndex = String(nextLayer());
      // Ancestor refs may attach after a child's layout effect. Once the commit
      // finishes, repair the chain from outermost parent to innermost dialog.
      queueMicrotask(() => {
        if (!element.isConnected || !element.childElementCount) return;
        let parentLayer = 0;
        for (const node of [...parents.map(parent => parent.current), element]) {
          if (!node?.isConnected || !node.childElementCount) continue;
          if (!node.style.zIndex || Number(node.style.zIndex) <= parentLayer) node.style.zIndex = String(nextLayer());
          parentLayer = Number(node.style.zIndex);
        }
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(element, { childList: true });
    return () => observer.disconnect();
  }, [ref, parents]);
  return chain;
}

/** Escape app transforms and clipping without changing a dialog's existing controls. */
export function ScreenPortal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const layers = useScreenOverlayLayer(ref);
  const pane = useOverlayPane(ref);
  const viewportStyle = useMainOverlayViewport(pane);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <OverlayPaneContext.Provider value={pane}>
      <ScreenOverlayContext.Provider value={layers}>
        <div ref={ref} className="screen-portal" data-responsive-canvas="true" style={viewportStyle} data-overlay-pane={pane} data-screen-overlay-layer="">{children}</div>
      </ScreenOverlayContext.Provider>
    </OverlayPaneContext.Provider>,
    document.body,
  );
}
