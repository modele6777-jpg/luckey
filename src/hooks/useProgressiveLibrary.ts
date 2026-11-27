import { useEffect, useState } from 'react';

/**
 * Paint the dialog before creating hundreds of catalog entries on mobile WebKit.
 * `minCount` keeps a requested entry (e.g. a perspective opened from a chat answer)
 * in the DOM from the first paint so it can be scrolled to and highlighted at once.
 */
export function useProgressiveLibrary(open: boolean, total: number, key: string, minCount = 0) {
  const [progress, setProgress] = useState({ key, count: 0 });
  useEffect(() => {
    let first = 0, second = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!open) { setProgress({ key, count: 0 }); return; }
    const floor = Math.min(total, Math.max(0, minCount));
    let count = floor;
    if (floor > 0) setProgress(current => (current.key === key && current.count >= floor ? current : { key, count: floor }));
    if (floor >= total) return;
    const append = () => {
      count = Math.min(total, count + (count ? 48 : 24));
      setProgress({ key, count });
      if (count < total) timer = setTimeout(append, 32);
    };
    first = requestAnimationFrame(() => { second = requestAnimationFrame(append); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); clearTimeout(timer); };
  }, [open, total, key, minCount]);
  return open && progress.key === key ? Math.min(progress.count, total) : 0;
}
