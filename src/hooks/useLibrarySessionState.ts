import { useCallback, useLayoutEffect, useRef, useSyncExternalStore, type Dispatch, type SetStateAction, type UIEvent } from 'react';
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
  safeSessionStorage.setItem(storageKey(key), JSON.stringify(value));
  listeners.get(key)?.forEach(notify => notify());
}

export function defaultLibrarySessionKey(library: string): string {
  return `${library}:${safeSessionStorage.getItem('prism_auth_uid') || 'device'}`;
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
  const ref = useRef<HTMLDivElement>(null);
  const restoring = useRef(false);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!open || !element || !ready) return;
    const top = read(key, 0);
    restoring.current = true;
    element.scrollTop = top;
    // Reapply after pane geometry/fonts settle; do not reset on ordinary resizing.
    let second = 0;
    const first = requestAnimationFrame(() => {
      element.scrollTop = top;
      second = requestAnimationFrame(() => { restoring.current = false; });
    });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); restoring.current = false; };
  }, [key, open, ready]);
  const onScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    if (ready && !restoring.current) write(key, event.currentTarget.scrollTop);
  }, [key, ready]);
  const reset = useCallback(() => {
    write(key, 0);
    if (ref.current) ref.current.scrollTop = 0;
  }, [key]);
  return { ref, onScroll, reset };
}
