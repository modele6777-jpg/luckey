export type LucyDayPeriod = 'morning' | 'day' | 'night';

/** Uses the viewer's device-local clock, including their current time zone. */
export function getLucyDayPeriod(date = new Date()): LucyDayPeriod {
  const hour = date.getHours();
  if (hour >= 6 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 18) return 'day';
  return 'night';
}

export function isLucyThemeRoute(path: string): boolean {
  return ['/', '/chat', '/lucy', '/chat/pro'].includes(path.split(/[?#]/)[0].toLowerCase());
}
