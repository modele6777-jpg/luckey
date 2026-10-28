import type { SolarDate } from './lunarCalendar';

export function parseBirthTime(value?: string): { hour: number; minute: number } | null {
  if (!value?.trim()) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) throw new RangeError('출생시간은 00:00~23:59로 입력해 주세요.');
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

/** Resolve a civil birth time with the zone's historical/DST offset, not a fixed UTC+9. */
export function birthTimeToUtc(date: SolarDate, hour: number, minute: number, timeZone: string): Date {
  const check = new Date(0);
  check.setUTCFullYear(date.year, date.month - 1, date.day);
  if (![date.year, date.month, date.day, hour, minute].every(Number.isInteger) || date.year < 1 ||
      check.getUTCFullYear() !== date.year || check.getUTCMonth() + 1 !== date.month || check.getUTCDate() !== date.day ||
      hour < 0 || hour > 23 || minute < 0 || minute > 59) throw new RangeError('유효한 출생 날짜와 시간을 입력해 주세요.');
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const wall = (instant: Date) => {
    const parts = Object.fromEntries(formatter.formatToParts(instant).map(part => [part.type, part.value]));
    const value = new Date(0);
    value.setUTCFullYear(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
    value.setUTCHours(Number(parts.hour), Number(parts.minute), Number(parts.second), 0);
    return value.getTime();
  };
  const desired = new Date(0);
  desired.setUTCFullYear(date.year, date.month - 1, date.day);
  desired.setUTCHours(hour, minute, 0, 0);
  const offsets = new Set<number>();
  for (let delta = -36; delta <= 36; delta += 6) {
    const sample = new Date(desired.getTime() + delta * 3600000);
    offsets.add(wall(sample) - sample.getTime());
  }
  const matches = [...offsets].map(offset => new Date(desired.getTime() - offset)).filter(candidate => wall(candidate) === desired.getTime());
  if (matches.length !== 1) throw new RangeError('서머타임 전환으로 출생시간이 없거나 중복됩니다. 정확한 출생 시각을 확인해 주세요.');
  return matches[0];
}
