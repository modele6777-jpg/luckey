import { calculateDetailedSaju, type SajuTimePolicy } from '../../src/lib/sajuAnalysis.ts';
import { assertSajuClock, SajuInputError } from '../../src/lib/sajuInput.ts';

export { SajuInputError };

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
  /** Stem syllable kept for the previous MCP field. The element is dayMasterElement. */
  dayMaster: string;
  dayMasterHanja: string;
  dayMasterKorean: string;
  dayMasterElement: string;
  interpretation: string;
  timePolicy: SajuTimePolicy;
  note: string;
}

/** The chart the app calculates in the browser. HTTP adapters call this and nothing else. */
export function sajuChartFromInput(input: SajuChartRequest): SajuChartPayload {
  const clock = assertSajuClock(input);
  const { year, month, day, birthtime, isLunar, isLeapMonth, birthdate } = clock;
  const gender = input.gender === 'male' || input.gender === 'female' || input.gender === 'other' ? input.gender : undefined;
  const analysis = calculateDetailedSaju({
    basic: { birthdate, birthtime, lunarSolar: isLunar ? 'lunar' : 'solar', isLeapMonth, gender },
  });
  if (!analysis?.solarEquivalentDate) throw new SajuInputError('사주 계산에 실패했습니다. 입력값을 확인해 주세요.', 'calculation_failed');
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
    dayMasterHanja: analysis.dayMaster.hanja,
    dayMasterKorean: analysis.dayMaster.korean,
    dayMasterElement: analysis.dayMaster.element,
    interpretation: analysis.elements.summary,
    timePolicy: analysis.timePolicy,
    note: `${analysis.timePolicy.summary} 사주 해석은 전통적 상징 해석이며 미래 사건을 확정적으로 예측하지 않습니다.`,
  };
}
