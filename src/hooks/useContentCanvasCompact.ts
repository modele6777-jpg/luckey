import { useMemo, useSyncExternalStore } from 'react';

/** Content dimensions belong to the app pane, not the physical display or browser. */
export function createContentCanvasCompactStore(breakpoint: number) {
  const canvas = () => typeof document === 'undefined' ? null : document.querySelector<HTMLElement>('[data-workspace-pane="content"]');
  const getSnapshot = () => {
    if (typeof window === 'undefined') return true;
    const element = canvas();
    return (element ? element.clientWidth : window.innerWidth) < breakpoint;
  };
  const subscribe = (onChange: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const element = canvas();
    const observer = element && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onChange) : null;
    if (element) observer?.observe(element);
    window.addEventListener('resize', onChange);
    // The outer pane may have committed after this component's first render.
    onChange();
    return () => { observer?.disconnect(); window.removeEventListener('resize', onChange); };
  };
  return { getSnapshot, subscribe };
}

export function useContentCanvasCompact(breakpoint = 1024) {
  const store = useMemo(() => createContentCanvasCompactStore(breakpoint), [breakpoint]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => true);
}
