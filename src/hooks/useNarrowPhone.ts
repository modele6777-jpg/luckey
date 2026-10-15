import { useEffect, useState } from 'react';
import { isNarrowPhone, initNarrowPhoneClass } from '@/lib/perfMode';

export function useNarrowPhone(): boolean {
  const [narrow, setNarrow] = useState(() => isNarrowPhone());

  useEffect(() => {
    initNarrowPhoneClass();
    const onResize = () => setNarrow(isNarrowPhone());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return narrow;
}