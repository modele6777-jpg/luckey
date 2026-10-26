import { useMemo, useSyncExternalStore } from 'react';

export const WORKSPACE_BREAKPOINT = 896;
export const isWideWorkspaceWidth = (width: number) => Number.isFinite(width) && width >= WORKSPACE_BREAKPOINT;

export function createWorkspaceWidthStore(container: HTMLElement | null | undefined) {
  const getSnapshot = () => {
    if (container === null || typeof window === 'undefined') return false;
    if (!container) return window.matchMedia(`(min-width: ${WORKSPACE_BREAKPOINT}px)`).matches;
    const style = window.getComputedStyle(container);
    const width = container.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    return isWideWorkspaceWidth(width);
  };
  const subscribe = (onChange: () => void) => {
    if (container === null || typeof window === 'undefined') return () => {};
    if (!container) {
      const query = window.matchMedia(`(min-width: ${WORKSPACE_BREAKPOINT}px)`);
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    }
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', onChange);
      return () => window.removeEventListener('resize', onChange);
    }
    const observer = new ResizeObserver(onChange);
    observer.observe(container);
    return () => observer.disconnect();
  };
  return { getSnapshot, subscribe };
}

export function useWideWorkspace(container?: HTMLElement | null) {
  const store = useMemo(() => createWorkspaceWidthStore(container), [container]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
}
