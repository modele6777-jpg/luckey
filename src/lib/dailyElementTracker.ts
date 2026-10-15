import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  ELEMENT_DETAILS,
  calculateDetailedSaju,
  type FiveElement,
  type SajuAnalysisResult,
} from './sajuAnalysis';
import type { UserProfile } from './sharedState';

export interface DailyElementSnapshot {
  dateKey: string;     // YYYY-MM-DD
  shortDate: string;   // M/D
  fullDateStr: string; // YYYY.MM.DD (요일)
  dayOfWeek: string;
  isToday: boolean;
  stemBranch: string;  // e.g. 丙午
  stemBranchKr: string;
  elements: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  };
}

export interface ElementTrendAnalysis {
  history: DailyElementSnapshot[];
  todaySnapshot: DailyElementSnapshot;
  risingElement: {
    element: FiveElement;
    delta: number; // percentage change vs yesterday
    value: number;
    info: (typeof ELEMENT_DETAILS)[FiveElement];
  };
  decliningElement: {
    element: FiveElement;
    delta: number;
    value: number;
    info: (typeof ELEMENT_DETAILS)[FiveElement];
  };
  dominantElement: {
    element: FiveElement;
    value: number;
    info: (typeof ELEMENT_DETAILS)[FiveElement];
  };
  balanceVerdict: string;
  remedyAction: string;
}

const STORAGE_KEY = 'prism_daily_elements_history';

export const TAROT_ELEMENT_MAPPING: Record<string, FiveElement> = {
  // Major Arcana (22 cards)
  '바보': '금', 'The Fool': '금',
  '마법사': '수', 'The Magician': '수',
  '여사제': '수', '고위 여사제': '수', 'The High Priestess': '수',
  '여황제': '목', 'The Empress': '목',
  '황제': '화', 'The Emperor': '화',
  '교황': '토', 'The Hierophant': '토',
  '연인': '금', 'The Lovers': '금',
  '전차': '수', 'The Chariot': '수',
  '힘': '화', 'Strength': '화',
  '은둔자': '토', 'The Hermit': '토',
  '운명의 수레바퀴': '토', '운명의 바퀴': '토', 'Wheel of Fortune': '토',
  '정의': '금', 'Justice': '금',
  '매달린 사람': '수', 'The Hanged Man': '수',
  '죽음': '수', 'Death': '수',
  '절제': '화', 'Temperance': '화',
  '악마': '토', 'The Devil': '토',
  '탑': '화', 'The Tower': '화',
  '별': '수', 'The Star': '수',
  '달': '수', 'The Moon': '수',
  '태양': '화', 'The Sun': '화',
  '심판': '화', 'Judgement': '화',
  '세계': '토', 'The World': '토',
};

export function getTarotCardElement(cardName: string): FiveElement {
  if (!cardName) return '목';
  for (const [key, el] of Object.entries(TAROT_ELEMENT_MAPPING)) {
    if (cardName.includes(key)) return el;
  }
  if (cardName.includes('Wand') || cardName.includes('완드') || cardName.includes('지팡이')) return '화';
  if (cardName.includes('Cup') || cardName.includes('컵') || cardName.includes('성배')) return '수';
  if (cardName.includes('Sword') || cardName.includes('소드') || cardName.includes('검')) return '금';
  if (cardName.includes('Pentacle') || cardName.includes('펜타클') || cardName.includes('동전')) return '토';
  return '목';
}

/**
 * 율리우스 적일 기반 특정 날짜의 천간(天干)과 지지(地支)를 산출합니다.
 */
export function getStemBranchForDate(targetDate: Date) {
  const y = targetDate.getFullYear();
  const m = targetDate.getMonth() + 1;
  const d = targetDate.getDate();

  const a = Math.floor((14 - m) / 12);
  const yr = y - a;
  const mo = m + 12 * a - 2;
  const jd =
    d +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045;
  const di = (jd + 49) % 60;
  const stem = HEAVENLY_STEMS[(di % 10 + 10) % 10];
  const branch = EARTHLY_BRANCHES[(di % 12 + 12) % 12];
  const stemEl = STEM_ELEMENT[stem];
  const branchEl = BRANCH_ELEMENT[branch];

  return { stem, branch, stemEl, branchEl };
}

/**
 * 사주 기본 원국과 당일 일진(천간·지지)의 조화를 반영하여 오행 에너지 분포를 산출합니다.
 */
function calculateDeterministicDayElements(
  targetDate: Date,
  saju: SajuAnalysisResult | null
): { 목: number; 화: number; 토: number; 금: number; 수: number } {
  // 사주 원국 비율이 있으면 기본 베이스라인으로 활용, 없으면 균형(20%씩)
  const base = {
    목: saju?.elements?.percentages?.목 ?? 20,
    화: saju?.elements?.percentages?.화 ?? 20,
    토: saju?.elements?.percentages?.토 ?? 20,
    금: saju?.elements?.percentages?.금 ?? 20,
    수: saju?.elements?.percentages?.수 ?? 20,
  };

  const { stemEl, branchEl } = getStemBranchForDate(targetDate);

  // 당일 일진 천간(Stem)과 지지(Branch)의 기운 가중치 부여
  const weighted = { ...base };
  weighted[stemEl] += 18;
  weighted[branchEl] += 14;

  // 일자별 미세 우주 주기 파동 (sin/cos deterministically based on date time)
  const daySeed = targetDate.getDate() + (targetDate.getMonth() + 1) * 31;
  const sineMod = Math.sin(daySeed) * 5;
  const cosMod = Math.cos(daySeed) * 5;

  weighted.수 += Math.round(sineMod);
  weighted.화 += Math.round(-sineMod);
  weighted.목 += Math.round(cosMod);
  weighted.금 += Math.round(-cosMod);

  // 음수 방지 및 정규화 (합산 100%)
  const elements: Record<FiveElement, number> = {
    목: Math.max(5, weighted.목),
    화: Math.max(5, weighted.화),
    토: Math.max(5, weighted.토),
    금: Math.max(5, weighted.금),
    수: Math.max(5, weighted.수),
  };

  const total = elements.목 + elements.화 + elements.토 + elements.금 + elements.수;
  elements.목 = Math.round((elements.목 / total) * 100);
  elements.화 = Math.round((elements.화 / total) * 100);
  elements.토 = Math.round((elements.토 / total) * 100);
  elements.금 = Math.round((elements.금 / total) * 100);
  elements.수 = 100 - (elements.목 + elements.화 + elements.토 + elements.금);

  return elements;
}

/**
 * 최근 N일간의 오행별 에너지 변화 추이 데이터를 조회/생성하고 분석 리포트를 생성합니다.
 */
export function getDailyElementTrend(
  daysCount = 7,
  currentTodayElements?: { 목: number; 화: number; 토: number; 금: number; 수: number } | null,
  userProfile?: UserProfile | null,
  cardName?: string
): ElementTrendAnalysis {
  const saju = calculateDetailedSaju(userProfile);
  const now = new Date();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 로컬 스토리지에 저장된 실제 과거 기록 로드
  let storedHistory: Record<string, { 목: number; 화: number; 토: number; 금: number; 수: number }> = {};
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) storedHistory = JSON.parse(raw);
    } catch (_) {}
  }

  // 오늘 날짜의 결과가 인자로 들어왔다면 스토리지에 보존
  const todayKey = now.toLocaleDateString('sv');
  if (currentTodayElements && typeof window !== 'undefined') {
    try {
      storedHistory[todayKey] = currentTodayElements;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedHistory));
    } catch (_) {}
  }

  const history: DailyElementSnapshot[] = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - i);
    const dateKey = targetDate.toLocaleDateString('sv');
    const isToday = i === 0;

    let elements: { 목: number; 화: number; 토: number; 금: number; 수: number };

    if (isToday && currentTodayElements) {
      elements = currentTodayElements;
    } else if (isToday && cardName) {
      const cardEl = getTarotCardElement(cardName);
      const base = calculateDeterministicDayElements(targetDate, saju);
      base[cardEl] += 25;
      const total = base.목 + base.화 + base.토 + base.금 + base.수;
      elements = {
        목: Math.round((base.목 / total) * 100),
        화: Math.round((base.화 / total) * 100),
        토: Math.round((base.토 / total) * 100),
        금: Math.round((base.금 / total) * 100),
        수: 100 - (Math.round((base.목 / total) * 100) + Math.round((base.화 / total) * 100) + Math.round((base.토 / total) * 100) + Math.round((base.금 / total) * 100)),
      };
    } else if (storedHistory[dateKey]) {
      elements = storedHistory[dateKey];
    } else {
      // HealApp 등 다른 키의 캐시도 확인
      let foundInOtherStorage = false;
      if (typeof window !== 'undefined') {
        try {
          const auraFate = localStorage.getItem(`aura_daily_fate_${(userProfile as any)?.uid || 'guest'}_${dateKey}`);
          if (auraFate) {
            const parsed = JSON.parse(auraFate);
            if (parsed.elements) {
              elements = parsed.elements;
              foundInOtherStorage = true;
            }
          }
        } catch (_) {}
      }

      if (!foundInOtherStorage) {
        elements = calculateDeterministicDayElements(targetDate, saju);
      }
    }

    const { stem, branch } = getStemBranchForDate(targetDate);
    const m = targetDate.getMonth() + 1;
    const d = targetDate.getDate();
    const dayOfWeek = dayNames[targetDate.getDay()];

    history.push({
      dateKey,
      shortDate: `${m}/${d}`,
      fullDateStr: `${targetDate.getFullYear()}.${m < 10 ? '0' + m : m}.${d < 10 ? '0' + d : d} (${dayOfWeek})`,
      dayOfWeek,
      isToday,
      stemBranch: `${stem}${branch}`,
      stemBranchKr: `${stem}${branch}`,
      elements,
    });
  }

  const todaySnapshot = history[history.length - 1];
  const yesterdaySnapshot = history[Math.max(0, history.length - 2)];

  // 변화 추이 계산: 오늘 vs 어제
  const elementKeys: FiveElement[] = ['목', '화', '토', '금', '수'];
  const deltas: { element: FiveElement; delta: number; value: number }[] = elementKeys.map((el) => {
    const valToday = todaySnapshot.elements[el];
    const valYest = yesterdaySnapshot.elements[el];
    return {
      element: el,
      delta: valToday - valYest,
      value: valToday,
    };
  });

  // 상승 기운 (가장 큰 양의 변화 또는 최고치)
  const sortedDeltas = [...deltas].sort((a, b) => b.delta - a.delta);
  const rising = sortedDeltas[0];

  // 하강/보강 권장 기운 (가장 큰 음의 변화 또는 최저치)
  const sortedByValAsc = [...deltas].sort((a, b) => a.value - b.value);
  const declining = sortedDeltas[sortedDeltas.length - 1].delta < 0
    ? sortedDeltas[sortedDeltas.length - 1]
    : sortedByValAsc[0];

  // 현재 가장 우세한 기운
  const sortedByValDesc = [...deltas].sort((a, b) => b.value - a.value);
  const dominant = sortedByValDesc[0];

  const risingInfo = ELEMENT_DETAILS[rising.element];
  const decliningInfo = ELEMENT_DETAILS[declining.element];
  const dominantInfo = ELEMENT_DETAILS[dominant.element];

  // 총평 및 조언 생성
  let balanceVerdict = `오늘 우주적 일진과 오라클 공명으로 **${dominantInfo.name}** 기운(${dominant.value}%)이 대시보드 중심을 주도하고 있습니다.`;
  if (rising.delta > 0) {
    balanceVerdict += ` 특히 어제 대비 **${risingInfo.name}** 기운이 **+${rising.delta}%** 두드러지게 상승하여 ${risingInfo.emotionPositive}의 파동이 강해졌습니다.`;
  }

  let remedyAction = `상대적으로 위축된 **${decliningInfo.name}**(${declining.value}%)의 결핍을 채우기 위해, **${decliningInfo.remedyActivity}**을(를) 실천하고 **${decliningInfo.remedyFood}** 섭취를 추천합니다.`;

  return {
    history,
    todaySnapshot,
    risingElement: {
      element: rising.element,
      delta: rising.delta,
      value: rising.value,
      info: risingInfo,
    },
    decliningElement: {
      element: declining.element,
      delta: declining.delta,
      value: declining.value,
      info: decliningInfo,
    },
    dominantElement: {
      element: dominant.element,
      value: dominant.value,
      info: dominantInfo,
    },
    balanceVerdict,
    remedyAction,
  };
}
