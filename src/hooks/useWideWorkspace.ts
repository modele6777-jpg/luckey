import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 1024px)';
const getSnapshot = () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/** The shared page breakpoint, including the persistent navigation rail. */
export function useWideWorkspace() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
