import { useEffect, useState } from 'react';

/** Paint the dialog before creating hundreds of catalog entries on mobile WebKit. */
export function useProgressiveLibrary(open: boolean, total: number, key: string) {
  const [progress, setProgress] = useState({ key, count: 0 });
  useEffect(() => {
    let first = 0, second = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!open) { setProgress({ key, count: 0 }); return; }
    let count = 0;
    const append = () => {
      count = Math.min(total, count + (count ? 48 : 24));
      setProgress({ key, count });
      if (count < total) timer = setTimeout(append, 32);
    };
    first = requestAnimationFrame(() => { second = requestAnimationFrame(append); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); clearTimeout(timer); };
  }, [open, total, key]);
  return open && progress.key === key ? Math.min(progress.count, total) : 0;
}
