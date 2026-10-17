import KoreanLunarCalendar from 'korean-lunar-calendar';

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth?: boolean;
}

function getCalendarInstance() {
  const CalendarClass = typeof KoreanLunarCalendar === 'function'
    ? KoreanLunarCalendar
    : ((KoreanLunarCalendar as any)?.default || KoreanLunarCalendar);
  return new CalendarClass();
}

/**
 * Converts a Korean lunar date to a Gregorian solar date.
 * If input is invalid or conversion fails, safely falls back to the original date.
 */
export function convertLunarToSolar(
  year: number,
  month: number,
  day: number,
  isLeapMonth = false
): SolarDate {
  try {
    const calendar = getCalendarInstance();
    const success = calendar.setLunarDate(year, month, day, isLeapMonth);
    if (success) {
      const solar = calendar.getSolarCalendar();
      if (solar && solar.year && solar.month && solar.day) {
        return { year: solar.year, month: solar.month, day: solar.day };
      }
    }
  } catch (err) {
    console.warn('[LunarCalendar] Failed to convert lunar to solar:', err);
  }
  return { year, month, day };
}

/**
 * Converts a Gregorian solar date to a Korean lunar date.
 */
export function convertSolarToLunar(
  year: number,
  month: number,
  day: number
): LunarDate {
  try {
    const calendar = getCalendarInstance();
    const success = calendar.setSolarDate(year, month, day);
    if (success) {
      const lunar = calendar.getLunarCalendar();
      if (lunar && lunar.year && lunar.month && lunar.day) {
        return {
          year: lunar.year,
          month: lunar.month,
          day: lunar.day,
          isLeapMonth: Boolean(lunar.isLeapMonth),
        };
      }
    }
  } catch (err) {
    console.warn('[LunarCalendar] Failed to convert solar to lunar:', err);
  }
  return { year, month, day, isLeapMonth: false };
}

/**
 * Format a birthdate with its calendar type (e.g. "1996.05.15 (음력 · 양력 환산: 1996.06.30)")
 */
export function formatCalendarDateText(
  birthdateStr: string,
  lunarSolar?: 'solar' | 'lunar',
  isLeapMonth = false
): string {
  if (!birthdateStr) return '';
  if (lunarSolar !== 'lunar') {
    return `${birthdateStr} (양력)`;
  }
  const { solarDateString } = resolveEffectiveSolarDate(birthdateStr, 'lunar', isLeapMonth);
  const leapText = isLeapMonth ? '윤달 ' : '';
  return `${birthdateStr} (음력 ${leapText}· 양력 환산: ${solarDateString})`;
}

/**
 * Resolves the effective Gregorian solar date for astronomical saju computation,
 * properly respecting lunarSolar ('solar' | 'lunar').
 */
export function resolveEffectiveSolarDate(
  birthdateStr: string,
  lunarSolar?: 'solar' | 'lunar',
  isLeapMonth = false
): {
  solarDate: SolarDate;
  originalDate: { year: number; month: number; day: number };
  isLunar: boolean;
  solarDateString: string;
} {
  const parts = birthdateStr.split('-').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  const isLunar = lunarSolar === 'lunar';

  if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
    return {
      solarDate: { year: 1995, month: 1, day: 1 },
      originalDate: { year: 1995, month: 1, day: 1 },
      isLunar: false,
      solarDateString: '1995-01-01',
    };
  }

  const originalDate = { year, month, day };
  const solarDate = isLunar ? convertLunarToSolar(year, month, day, isLeapMonth) : originalDate;
  const solarDateString = `${solarDate.year}-${String(solarDate.month).padStart(2, '0')}-${String(solarDate.day).padStart(2, '0')}`;

  return {
    solarDate,
    originalDate,
    isLunar,
    solarDateString,
  };
}
