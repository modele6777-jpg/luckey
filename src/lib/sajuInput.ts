import { resolveEffectiveSolarDate } from './lunarCalendar.ts';

export type SajuInputCode =
  | 'invalid_time_format'
  | 'invalid_time_range'
  | 'invalid_date'
  | 'invalid_leap_month'
  | 'invalid_year'
  | 'invalid_month'
  | 'invalid_day'
  | 'calculation_failed';

export class SajuInputError extends Error {
  readonly code: SajuInputCode;
  readonly status: number;
  constructor(message: string, code: SajuInputCode, status = 400) {
    super(message);
    this.name = 'SajuInputError';
    this.code = code;
    this.status = status;
  }
}

export interface SajuClockInput {
  year?: unknown;
  month?: unknown;
  day?: unknown;
  birthtime?: unknown;
  isLunar?: unknown;
  isLeapMonth?: unknown;
}

function integer(value: unknown, min: number, max: number): number | null {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
  if (!Number.isInteger(number) || number < min || number > max) return null;
  return number;
}

/** Shared date/time/leap checks for the profile card and /api/saju/chart. */
export function assertSajuClock(input: SajuClockInput): {
  year: number;
  month: number;
  day: number;
  birthtime?: string;
  isLunar: boolean;
  isLeapMonth: boolean;
  birthdate: string;
} {
  const year = integer(input.year, 1900, 2050);
  const month = integer(input.month, 1, 12);
  const day = integer(input.day, 1, 31);
  if (year === null) {
    const missing = input.year === undefined || input.year === null || input.year === '';
    throw new SajuInputError(missing ? '출생 연도를 입력해 주세요.' : `출생 연도 ${String(input.year)}은 1900~2050 정수가 아닙니다.`, 'invalid_year');
  }
  if (month === null) throw new SajuInputError(`출생 월 ${String(input.month)}은 1~12가 아닙니다.`, 'invalid_month');
  if (day === null) throw new SajuInputError(`출생 일 ${String(input.day)}은 1~31이 아닙니다.`, 'invalid_day');
  let birthtime: string | undefined;
  if (input.birthtime !== undefined && input.birthtime !== null && input.birthtime !== '') {
    if (typeof input.birthtime !== 'string') throw new SajuInputError('출생 시각은 HH:MM 문자열이어야 합니다.', 'invalid_time_format');
    const clock = input.birthtime.match(/^(\d{1,2}):(\d{2})$/);
    if (!clock) throw new SajuInputError(`출생 시각 '${input.birthtime}'은 HH:MM 형식이 아닙니다.`, 'invalid_time_format');
    const hour = Number(clock[1]);
    const minute = Number(clock[2]);
    const problems = [
      ...(hour > 23 ? [`시 ${hour}는 0~23이 아닙니다`] : []),
      ...(minute > 59 ? [`분 ${minute}는 0~59가 아닙니다`] : []),
    ];
    if (problems.length) throw new SajuInputError(`출생 시각 '${input.birthtime}': ${problems.join(', ')}.`, 'invalid_time_range');
    birthtime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
  const isLunar = Boolean(input.isLunar);
  const isLeapMonth = Boolean(input.isLeapMonth);
  if (isLeapMonth && !isLunar) throw new SajuInputError('윤달은 음력 날짜에서만 지정할 수 있습니다.', 'invalid_leap_month');
  const birthdate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  try {
    resolveEffectiveSolarDate(birthdate, isLunar ? 'lunar' : 'solar', isLeapMonth);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (!isLunar) throw new SajuInputError(`${birthdate}은 양력에 없는 날짜입니다.`, 'invalid_date');
    if (isLeapMonth) throw new SajuInputError(`${year}년 음력 ${month}월은 윤달이 아니거나 지원되지 않는 음력 날짜입니다.`, 'invalid_leap_month');
    throw new SajuInputError(message || '올바른 생년월일을 입력해 주세요.', 'invalid_date');
  }
  return { year, month, day, birthtime, isLunar, isLeapMonth, birthdate };
}

export function inspectSajuProfile(profile?: { basic?: { birthdate?: string; birthtime?: string; lunarSolar?: 'solar' | 'lunar'; isLeapMonth?: boolean } } | null): { code: SajuInputCode; message: string } | null {
  const basic = profile?.basic;
  if (!basic?.birthdate) return null;
  const [year, month, day] = basic.birthdate.split('-');
  try {
    assertSajuClock({
      year, month, day,
      birthtime: basic.birthtime,
      isLunar: basic.lunarSolar === 'lunar',
      isLeapMonth: basic.isLeapMonth,
    });
    return null;
  } catch (error) {
    if (error instanceof SajuInputError) return { code: error.code, message: error.message };
    return { code: 'invalid_date', message: error instanceof Error ? error.message : '출생 정보를 확인해 주세요.' };
  }
}
