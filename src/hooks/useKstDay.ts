import { useEffect, useState } from 'react';

export const KST_DAY_MS = 86400000;
const KST_OFFSET_MS = 9 * 3600000;

export function getKstDayNumber(now = Date.now()): number {
  return Math.floor((now + KST_OFFSET_MS) / KST_DAY_MS);
}

export function msUntilNextKstDay(now = Date.now()): number {
  return (getKstDayNumber(now) + 1) * KST_DAY_MS - KST_OFFSET_MS - now;
}

/** Refresh at KST midnight and when a suspended tab returns. */
export function useKstDay(): number {
  const [day, setDay] = useState(() => getKstDayNumber());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      setDay(getKstDayNumber());
      timer = setTimeout(refresh, msUntilNextKstDay() + 50);
    };
    refresh();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  return day;
}
