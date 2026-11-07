import { calculateDetailedSaju } from '../../src/lib/sajuAnalysis.ts';
import { resolveEffectiveSolarDate } from '../../src/lib/lunarCalendar.ts';

export class SajuInputError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = 'SajuInputError';
  }
}

export interface SajuChartRequest {
  year?: unknown;
  month?: unknown;
  day?: unknown;
  birthtime?: unknown;
  isLunar?: unknown;
  isLeapMonth?: unknown;
  gender?: unknown;
}

export interface SajuChartPayload {
  birthdate: string;
  solarEquivalentDate: string | undefined;
  isLunar: boolean | undefined;
  pillars: { year: string; month: string; day: string; hour: string | null };
  elementBalance: unknown;
  dayMaster: string;
  interpretation: string;
  note: string;
}

function integer(value: unknown, min: number, max: number): number | null {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
  if (!Number.isInteger(number) || number < min || number > max) return null;
  return number;
}

/** The chart the app calculates in the browser. HTTP adapters call this and nothing else. */
export function sajuChartFromInput(input: SajuChartRequest): SajuChartPayload {
  const year = integer(input.year, 1900, 2050);
  const month = integer(input.month, 1, 12);
  const day = integer(input.day, 1, 31);
  if (year === null || month === null || day === null) {
    throw new SajuInputError('출생 연월일을 1900~2050년 범위에서 정확히 입력해 주세요.');
  }
  let birthtime: string | undefined;
  if (input.birthtime !== undefined && input.birthtime !== null && input.birthtime !== '') {
    if (typeof input.birthtime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.birthtime)) {
      throw new SajuInputError('출생 시각은 HH:MM 형식이어야 합니다.');
    }
    birthtime = input.birthtime;
  }
  const isLunar = Boolean(input.isLunar);
  const isLeapMonth = Boolean(input.isLeapMonth);
  if (isLeapMonth && !isLunar) throw new SajuInputError('윤달은 음력 날짜에서만 지정할 수 있습니다.');
  const gender = input.gender === 'male' || input.gender === 'female' || input.gender === 'other' ? input.gender : undefined;
  const birthdate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  try {
    resolveEffectiveSolarDate(birthdate, isLunar ? 'lunar' : 'solar', isLeapMonth);
  } catch {
    throw new SajuInputError('올바른 생년월일을 입력해 주세요.');
  }
  const analysis = calculateDetailedSaju({
    basic: { birthdate, birthtime, lunarSolar: isLunar ? 'lunar' : 'solar', isLeapMonth, gender },
  });
  if (!analysis?.solarEquivalentDate) throw new SajuInputError('사주 계산에 실패했습니다. 생년월일을 확인해 주세요.');
  return {
    birthdate,
    solarEquivalentDate: analysis.solarEquivalentDate,
    isLunar: analysis.isLunar,
    pillars: {
      year: analysis.pillars.year.full,
      month: analysis.pillars.month.full,
      day: analysis.pillars.day.full,
      hour: analysis.pillars.hour?.full ?? null,
    },
    elementBalance: analysis.elements.counts,
    dayMaster: analysis.pillars.day.ganKr,
    interpretation: analysis.elements.summary,
    note: '사주 해석은 전통적 상징 해석이며 미래 사건을 확정적으로 예측하지 않습니다.',
  };
}
