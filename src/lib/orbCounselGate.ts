import { useEffect, useState } from 'react';

export const ORB_COUNSEL_EVENT = 'prism:orb_counsel';

let open = false;

export function isOrbCounselOpen(): boolean {
  return open;
}

export function setOrbCounselOpen(next: boolean): void {
  if (open === next) return;
  open = next;
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(ORB_COUNSEL_EVENT, { detail: { open } }));
  window.dispatchEvent(new CustomEvent('prism:lucy_voice_state', {
    detail: { isOpen: open, state: open ? 'listening' : 'idle' },
  }));
}

export function useOrbCounselOpen(): boolean {
  const [value, setValue] = useState(open);
  useEffect(() => {
    const sync = (event: Event) => setValue(Boolean((event as CustomEvent<{ open?: boolean }>).detail?.open));
    window.addEventListener(ORB_COUNSEL_EVENT, sync);
    return () => window.removeEventListener(ORB_COUNSEL_EVENT, sync);
  }, []);
  return value;
}
