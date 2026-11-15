/** Lucy conversations use Korea's calendar day, independently of device timezone. */
export function formatLucyChatDay(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return Number.isFinite(kst.getTime()) ? kst.toISOString().slice(0, 10) : '';
}
export function getLucyChatDay(now = Date.now()): string { return formatLucyChatDay(new Date(now)); }
export function isLucyTimestampToday(timestamp: any): boolean {
  const date = typeof timestamp?.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
  return formatLucyChatDay(date) === getLucyChatDay();
}
export function millisecondsUntilLucyMidnight(now = Date.now()): number {
  const next = Date.parse(`${getLucyChatDay(now)}T00:00:00+09:00`) + 86400000;
  return Math.max(1, next - now);
}
/** Exact midnight while awake, plus reconciliation after suspended/background tabs resume. */
export function subscribeLucyMidnight(check: () => void): () => void {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    clearTimeout(timer);
    check();
    timer = setTimeout(schedule, millisecondsUntilLucyMidnight() + 10);
  };
  window.addEventListener('focus', schedule);
  window.addEventListener('pageshow', schedule);
  document.addEventListener('visibilitychange', schedule);
  schedule();
  return () => {
    clearTimeout(timer);
    window.removeEventListener('focus', schedule);
    window.removeEventListener('pageshow', schedule);
    document.removeEventListener('visibilitychange', schedule);
  };
}
