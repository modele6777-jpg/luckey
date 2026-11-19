import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type Dispatch, type SetStateAction, type UIEvent } from 'react';
import { safeSessionStorage } from '@/utils/safeStorage';

type Value = string | number | boolean;
const values = new Map<string, Value>();
const listeners = new Map<string, Set<() => void>>();
const storageKey = (key: string) => `prism:library-session:v1:${key}`;
function read<T extends Value>(key: string, initial: T): T {
  if (!values.has(key)) {
    let value: Value = initial;
    try {
      const stored = JSON.parse(safeSessionStorage.getItem(storageKey(key)) ?? 'null');
      if (typeof stored === typeof initial && (typeof stored !== 'number' || Number.isFinite(stored))) value = stored;
    } catch { /* A damaged session entry uses its safe default. */ }
    values.set(key, value);
  }
  return values.get(key) as T;
}
function write(key: string, value: Value) {
  values.set(key, value);
  try {
    safeSessionStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    // iOS can reject sessionStorage. The open flag still has to reach the dialog.
  }
  const group = listeners.get(key);
  if (!group) return;
  // Iterate a snapshot because React may unsubscribe/resubscribe during notification.
  for (const notify of [...group]) {
    if (group.has(notify)) notify();
  }
}

export function defaultLibrarySessionKey(library: string): string {
  return `${library}:${safeSessionStorage.getItem('prism_auth_uid') || 'device'}`;
}

function viewportSignature(element?: HTMLElement | null): string {
  if (typeof window === 'undefined') return '';
  const viewport = window.visualViewport;
  return [window.innerWidth, window.innerHeight, viewport?.width ?? '', viewport?.height ?? '', viewport?.scale ?? '', element?.clientWidth ?? '', element?.clientHeight ?? ''].join(':');
}

/** Synchronous, account-scoped state survives pane remounts and Safari restoration. */
export function useLibrarySessionState<T extends Value>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const subscribe = useCallback((notify: () => void) => {
    const group = listeners.get(key) ?? new Set<() => void>();
    listeners.set(key, group); group.add(notify);
    return () => { group.delete(notify); if (!group.size) listeners.delete(key); };
  }, [key]);
  const snapshot = useCallback(() => read(key, initial), [key, initial]);
  const value = useSyncExternalStore(subscribe, snapshot, () => initial);
  const setValue = useCallback<Dispatch<SetStateAction<T>>>(action => {
    const next = typeof action === 'function' ? action(read(key, initial)) : action;
    write(key, next);
  }, [key, initial]);
  return [value, setValue];
}

export function useLibrarySessionScroll(key: string, open: boolean, ready = true) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((node: HTMLDivElement | null) => {
    setElement(current => current === node ? current : node);
  }, []);
  const restoring = useRef(false);
  const lastPosition = useRef(0);
  const lastViewport = useRef('');
  useLayoutEffect(() => {
    if (!open || !element || !ready) return;
    const top = read(key, 0);
    lastPosition.current = top;
    lastViewport.current = viewportSignature(element);
    restoring.current = true;
    element.scrollTop = top;
    // Reapply after pane geometry/fonts settle; do not reset on ordinary resizing.
    let second = 0;
    const first = requestAnimationFrame(() => {
      element.scrollTop = top;
      second = requestAnimationFrame(() => { restoring.current = false; });
    });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); restoring.current = false; };
  }, [element, key, open, ready]);
  useEffect(() => {
    if (!open || !element) return;
    let first = 0;
    let second = 0;
    const restoreAfterResize = () => {
      const top = lastPosition.current;
      lastViewport.current = viewportSignature(element);
      restoring.current = true;
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      first = requestAnimationFrame(() => {
        if (!element.isConnected) {
          restoring.current = false;
          return;
        }
        element.scrollTop = top;
        second = requestAnimationFrame(() => { restoring.current = false; });
      });
    };
    window.addEventListener('resize', restoreAfterResize);
    window.visualViewport?.addEventListener('resize', restoreAfterResize);
    return () => {
      window.removeEventListener('resize', restoreAfterResize);
      window.visualViewport?.removeEventListener('resize', restoreAfterResize);
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      restoring.current = false;
    };
  }, [element, open]);
  const onScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    if (ready && !restoring.current) {
      const signature = viewportSignature(event.currentTarget);
      // WebKit may clamp a scroll container during reflow before it dispatches
      // resize; don't save that temporary zero over the last user position.
      if (lastViewport.current && signature !== lastViewport.current) {
        lastViewport.current = signature;
        return;
      }
      lastViewport.current = signature;
      lastPosition.current = event.currentTarget.scrollTop;
      write(key, lastPosition.current);
    }
  }, [key, ready]);
  const reset = useCallback(() => {
    lastPosition.current = 0;
    write(key, 0);
    if (element) element.scrollTop = 0;
  }, [element, key]);
  return { ref, onScroll, reset };
}
