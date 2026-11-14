import { useContext, useLayoutEffect, useState, type RefObject } from 'react';
import { OverlayPaneContext } from '@/components/layout/OverlayPaneContext';
import { getLastOverlayPane } from '@/lib/overlayPane';

/** Empty persistent portals capture their source again on each opening. */
export function useOverlayPane(ref: RefObject<HTMLDivElement | null>) {
  const inherited = useContext(OverlayPaneContext);
  const [owner, setOwner] = useState(() => inherited ?? getLastOverlayPane());
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    let occupied = false;
    const sync = () => {
      const next = element.childElementCount > 0;
      if (next && !occupied) setOwner(inherited ?? getLastOverlayPane());
      occupied = next;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(element, { childList: true });
    return () => observer.disconnect();
  }, [ref, inherited]);
  return inherited ?? owner;
}
