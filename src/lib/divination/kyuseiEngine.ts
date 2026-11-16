/**
 * =========================================================================
 * LUCKEY 구성학(九星氣學) 9궁 명반 & 길흉방위 결정론적 엔진
 * (Kyusei Nine-Palaces Directional Intelligence Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    같은 생년월일시·같은 기준일이면 항상 같은 9궁 포국과 방위 판정을 내놓는다.
 * 2. 본명성(本命星): 입춘(立春) 절입 시각 기준 사주 연도의 네 자리 숫자를
 *    한 자리로 환원한 수리를 11에서 뺀 9성 (1·4·7 → 一白, 2·5·8 → 二黒, 3·6·9 → 三碧 주기).
 *    2026년은 一白水星, 2025년은 二黒土星, 2024년은 三碧木星으로 매년 1씩 감소 순환한다.
 * 3. 월명성(月命星): 본명성 그룹(一·四·七 / 二·五·八 / 三·六·九)에 따라 인월(寅月)이
 *    八白 / 二黒 / 五黄에서 시작하고 절월마다 1씩 감소한다. 절월 경계는 24절기 절입 시각.
 * 4. 9궁 방위반(연반·월반·일반): 중궁(中宮)에 당해 연성·월성·일성이 들어서고,
 *    나머지 여덟 별은 낙서(洛書) 순서인 중궁 → 건(서북) → 태(정서) → 간(동북) → 리(정남) →
 *    감(정북) → 곤(서남) → 진(정동) → 손(동남) 순으로 하나씩 더하며 순행 비성한다.
 *    (동양운세학회 월반 배치표 및 2026년 병오년 일백 입중궁 연반으로 검증)
 * 5. 일성(日星): 동지에 가장 가까운 갑자일을 一白으로 음遁→양遁이 바뀌고, 하지에 가장
 *    가까운 갑자일을 九紫로 양遁→음遁이 바뀐다. 절전일 간격이 240일이면 60일을
 *    앞당겨 구성학의 윤달(九星置閏)을 두고 그 31일째 갑오일(甲午)에 七赤(冬)·三碧(夏)으로
 *    방향이 바뀐다. (2014-12, 2015-06, 2008-12, 2019~2020 실측표로 검증)
 * 6. 대흉방위: 오황살(연반의 五黃 입궁 방위), 암검살(오황살의 대궁), 세파살·월파살
 *    (연지·월지의 대충 방위), 본명살·본명적살(연반 위 본명성의 입궁 방위와 그 대궁).
 * 7. 대길방위: 본명성 오행과 상생(별이 나를 생함)·비화(같은 오행)인 별이 앉은 방위 중
 *    위 흉살이 일절 닿지 않는 방위를 최길로 뽑는다. (이사·여행·미팅·출장 추천)
 */

import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate } from '../lunarCalendar';
import { parseBirthTime } from '../birthDateTime';
import {
  getAstronomicalSajuYear,
  getAstronomicalMonthBranch,
  getYearSolarTerms,
} from '../astronomicalSolarTerms';

export const KYUSEI_ENGINE_VERSION = 'LUCKEY-KS-v2.1.0';

export const KYUSEI_METHOD =
  '구성학 정통 9궁 명반 산법: 입춘 절입 연성 수리 본명성, 절월 월성 월명성, 동지·하지 근접 갑자일 일성 순행 비성(중궁→건→태→간→리→감→곤→진→손)으로 연·월·일 3반 포국 및 오황살·암검살·세파살·월파살·본명살·본명적살 결정론 산출';

export type KyuseiStatus = 'calculated' | 'skipped' | 'error';

export type KyuseiDirection = '북' | '북동' | '동' | '남동' | '남' | '남서' | '서' | '북서';

export type KyuseiElement = '수(水)' | '토(土)' | '목(木)' | '금(金)' | '화(火)';

export interface KyuseiPalaceStar {
  direction: KyuseiDirection;
  trigram: string;
  degreeRange: string;
  star: number;
  starName: string;
  starElement: KyuseiElement;
}

export interface KyuseiChart {
  label: '연반(年盤)' | '월반(月盤)' | '일반(日盤)';
  centerStar: number;
  centerStarName: string;
  palaces: KyuseiPalaceStar[];
}

export interface KyuseiHazard {
  name: '오황살(五黃煞)' | '암검살(暗劍煞)' | '세파살(歲破煞)' | '월파살(月破煞)' | '본명살(本命煞)' | '본명적살(本命的煞)' | '월오황살(月五黃煞)' | '월암검살(月暗劍煞)';
  direction: KyuseiDirection | null;
  scope: '연반' | '월반' | '본명';
  reason: string;
}

export interface KyuseiFortuneDirection {
  direction: KyuseiDirection;
  trigram: string;
  star: number;
  starName: string;
  relation: '상생(生入)' | '비화(比和)' | '설기(生出)';
  grade: '최길' | '길' | '보조';
  clean: boolean;
  blockedBy: string[];
  guidance: string;
}

export interface KyuseiStarIdentity {
  star: number;
  name: string;
  element: KyuseiElement;
}

export interface KyuseiDirectionScore {
  direction: KyuseiDirection;
  score: number; // 0 ~ 100
  level: '최길' | '길' | '평' | '주의' | '대흉';
  recommendedActivities: string[];
}

export interface KyuseiHonmyoseiSynergy {
  annualStarRelation: '생입(生入)' | '비화(比和)' | '생출(生出)' | '극출(克出)' | '극입(克入)';
  synergyScore: number; // 0 ~ 100
  annualThemeGuidance: string;
}

export interface KyuseiResult {
  status: KyuseiStatus;
  note?: string;
  engineVersion: string;
  method: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;
  targetDate: string;
  targetYearGanZhi: string;
  honmyosei: KyuseiStarIdentity;
  getmyosei: KyuseiStarIdentity & { monthBranch: string; currentTerm: string };
  ilmyosei: KyuseiStarIdentity & { dayGanZhi: string };
  annualChart: KyuseiChart;
  monthlyChart: KyuseiChart;
  dailyChart: KyuseiChart;
  hazards: KyuseiHazard[];
  fortuneDirections: KyuseiFortuneDirection[];
  topFortuneDirection: {
    direction: KyuseiDirection;
    starName: string;
    relation: string;
    summary: string;
  } | null;
  usageScenarios: Array<{ scenario: string; direction: KyuseiDirection; advice: string }>;
  directionalScores?: KyuseiDirectionScore[];
  honmyoseiSynergy?: KyuseiHonmyoseiSynergy;
  kyuseiSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary?: string;
}

// ---------------------------------------------------------------------------
// 9성 기본 표기 및 오행
// ---------------------------------------------------------------------------

const STARS: Record<number, { name: string; element: KyuseiElement }> = {
  1: { name: '일백수성(一白水星)', element: '수(水)' },
  2: { name: '이흑토성(二黒土星)', element: '토(土)' },
  3: { name: '삼벽목성(三碧木星)', element: '목(木)' },
  4: { name: '사록목성(四綠木星)', element: '목(木)' },
  5: { name: '오황토성(五黃土星)', element: '토(土)' },
  6: { name: '육백금성(六白金星)', element: '금(金)' },
  7: { name: '칠적금성(七赤金星)', element: '금(金)' },
  8: { name: '팔백토성(八白土星)', element: '토(土)' },
  9: { name: '구자화성(九紫火星)', element: '화(火)' },
};

const STAR_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(STARS).map(([k, v]) => [Number(k), v.name]),
);

/** 별의 오행이 해당 오행을 생하는지 확인하기 위한 상생표: key를 생하는 오행 */
const GENERATING_ELEMENT: Record<KyuseiElement, KyuseiElement> = {
  '수(水)': '금(金)',
  '목(木)': '수(水)',
  '화(火)': '목(木)',
  '토(土)': '화(火)',
  '금(金)': '토(土)',
};

// ---------------------------------------------------------------------------
// 8방위(8궁) 메타데이터와 낙서 순행 비성 경로
// ---------------------------------------------------------------------------

interface PalaceMeta {
  direction: KyuseiDirection;
  trigram: string;
  degreeRange: string;
  branches: string;
}

/** 북쪽부터 시계 방향 8궁. branches는 해당 궁이 품는 12지 방위. */
const PALACES: Record<KyuseiDirection, PalaceMeta> = {
  북: { direction: '북', trigram: '감(坎)', degreeRange: '337.5°~22.5°', branches: '자(子)' },
  북동: { direction: '북동', trigram: '간(艮)', degreeRange: '22.5°~67.5°', branches: '축(丑)·인(寅)' },
  동: { direction: '동', trigram: '진(震)', degreeRange: '67.5°~112.5°', branches: '묘(卯)' },
  남동: { direction: '남동', trigram: '손(巽)', degreeRange: '112.5°~157.5°', branches: '진(辰)·사(巳)' },
  남: { direction: '남', trigram: '리(離)', degreeRange: '157.5°~202.5°', branches: '오(午)' },
  남서: { direction: '남서', trigram: '곤(坤)', degreeRange: '202.5°~247.5°', branches: '미(未)·신(申)' },
  서: { direction: '서', trigram: '태(兌)', degreeRange: '247.5°~292.5°', branches: '유(酉)' },
  북서: { direction: '북서', trigram: '건(乾)', degreeRange: '292.5°~337.5°', branches: '술(戌)·해(亥)' },
};

/** 순행 비성 경로: 중궁 다음 낙서 순서(건→태→간→리→감→곤→진→손). i번째 방위가 중궁 별 + (i+1)을 받는다. */
const FLIGHT_ORDER: KyuseiDirection[] = ['북서', '서', '북동', '남', '북', '남서', '동', '남동'];

const OPPOSITE: Record<KyuseiDirection, KyuseiDirection> = {
  북: '남', 남: '북', 동: '서', 서: '동',
  북동: '남서', 남서: '북동', 남동: '북서', 북서: '남동',
};

/** 12지 → 8궁 방위 (세파·월파의 대충 지지가 앉는 궁) */
const BRANCH_PALACE: KyuseiDirection[] = [
  '북',    // 자
  '북동',  // 축
  '북동',  // 인
  '동',    // 묘
  '남동',  // 진
  '남동',  // 사
  '남',    // 오
  '남서',  // 미
  '남서',  // 신
  '서',    // 유
  '북서',  // 술
  '북서',  // 해
];

const BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const STEMS_KO = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// ---------------------------------------------------------------------------
// 수리 헬퍼
// ---------------------------------------------------------------------------

/** 1~9로 순환하는 모듈러: 0은 9로 접는다. */
function wrap9(n: number): number {
  return ((((n - 1) % 9) + 9) % 9) + 1;
}

/** 입춘 절입 기준 사주 연도의 9성. 2026 → 일백(1), 2025 → 이흑(2), 2024 → 삼벽(3). */
function yearStarOf(sajuYear: number): number {
  let sum = [...String(sajuYear)].reduce((total, digit) => total + Number(digit), 0);
  while (sum > 9) sum = [...String(sum)].reduce((total, digit) => total + Number(digit), 0);
  return ((11 - sum) % 9 + 9) % 9 || 9;
}

/** 당해 연성 그룹(一·四·七 / 二·五·八 / 三·六·九)에 따른 인월 시작 성과 절월 감소로 월성 산출. */
function monthStarOf(yearStar: number, monthBranchIndex: number): number {
  const firstMonthStar = yearStar % 3 === 1 ? 8 : yearStar % 3 === 2 ? 2 : 5;
  return wrap9(firstMonthStar - monthBranchIndex);
}

/** 낙서 순행 비성: 중궁 별을 중심으로 여덟 궁에 별을 배치한다. */
function flyChart(centerStar: number): Record<KyuseiDirection, number> {
  const chart = {} as Record<KyuseiDirection, number>;
  FLIGHT_ORDER.forEach((direction, i) => {
    chart[direction] = wrap9(centerStar + i + 1);
  });
  return chart;
}

function buildChart(label: KyuseiChart['label'], centerStar: number): KyuseiChart {
  const flown = flyChart(centerStar);
  return {
    label,
    centerStar,
    centerStarName: STARS[centerStar].name,
    palaces: FLIGHT_ORDER.map((direction) => ({
      direction,
      trigram: PALACES[direction].trigram,
      degreeRange: PALACES[direction].degreeRange,
      star: flown[direction],
      starName: STARS[flown[direction]].name,
      starElement: STARS[flown[direction]].element,
    })),
  };
}

// ---------------------------------------------------------------------------
// 일성(日家九星): 동지·하지 근접 갑자일 절전과 구성학의 윤달(九星置閏)
// ---------------------------------------------------------------------------

function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** 일진 색인(0=갑자일). 2000-01-01=무오일(54), 2014-12-19=갑자일로 이중 검증됨. */
function dayGanZhiIndex(jdn: number): number {
  return (((jdn + 49) % 60) + 60) % 60;
}

function dayGanZhiLabel(jdn: number): string {
  const idx = dayGanZhiIndex(jdn);
  return `${STEMS_KO[idx % 10]}${BRANCHES_KO[idx % 12]}`;
}

interface StarSwitch {
  jdn: number;
  star: number;
  dir: 1 | -1;
  kind: '동지' | '하지';
}

/**
 * 동지(270°)·하지(90°) 절입일에 가장 가까운 갑자일을 절전일로 삼는 일성 절전 목록.
 * 절전일 간격이 240일이면 구성학의 윤달(九星置閏)로 뒤 절전을 30일 앞당겨
 * 갑오일에 七赤(동지측)·三碧(하지측)으로 방향을 바꾼다.
 */
function buildStarSwitches(targetWallKst: Date): StarSwitch[] {
  const targetYear = targetWallKst.getUTCFullYear();
  const switches: StarSwitch[] = [];

  for (const year of [targetYear - 2, targetYear - 1, targetYear, targetYear + 1, targetYear + 2]) {
    const terms = getYearSolarTerms(year);
    for (const [name, star, dir] of [
      ['동지', 1, 1],
      ['하지', 9, -1],
    ] as const) {
      const term = terms.find((t) => t.name === name);
      if (!term) throw new RangeError(`${year}년 ${name} 절입 시각을 찾을 수 없습니다.`);
      const solsticeJdn = julianDayNumber(
        term.date.getUTCFullYear(),
        term.date.getUTCMonth() + 1,
        term.date.getUTCDate(),
      );
      const k = dayGanZhiIndex(solsticeJdn);
      const switchJdn = k <= 29 ? solsticeJdn - k : solsticeJdn + (60 - k);
      switches.push({ jdn: switchJdn, star, dir, kind: name });
    }
  }

  switches.sort((a, b) => a.jdn - b.jdn);

  // 절전 간격 검사는 원시 절전 기준으로 한다. 240일 보정(갑오일 30일 이동)으로 생긴
  // 210·150일 간격은 구성학의 윤달이 만드는 정상 구간이므로 다시 검사하지 않는다.
  const rawSwitches = switches.map((s) => ({ ...s }));
  for (let i = 0; i < rawSwitches.length - 1; i++) {
    const gap = rawSwitches[i + 1].jdn - rawSwitches[i].jdn;
    if (gap === 240) {
      // 구성학의 윤달: 뒤 절전을 30일 앞당겨 갑오일에서 방향 전환(동지 七赤 양遁, 하지 三碧 음遁)
      switches[i + 1] = {
        ...switches[i + 1],
        jdn: switches[i + 1].jdn - 30,
        star: switches[i + 1].kind === '동지' ? 7 : 3,
      };
    } else if (gap !== 180) {
      throw new RangeError(`구성학 일성 산법이 지원하는 절전 간격(180일)이 아닌 구간입니다: ${gap}일`);
    }
  }

  return switches;
}

/** 대상 일자(KST 기준)의 일성과 일진. */
function dailyStarOf(targetWallKst: Date): { star: number; dayGanZhi: string } {
  const jdn = julianDayNumber(
    targetWallKst.getUTCFullYear(),
    targetWallKst.getUTCMonth() + 1,
    targetWallKst.getUTCDate(),
  );
  const switches = buildStarSwitches(targetWallKst);
  const governing = [...switches].reverse().find((s) => s.jdn <= jdn);
  if (!governing) {
    throw new RangeError('대상 일자가 일성 절전 범위 밖에 있습니다.');
  }
  return { star: wrap9(governing.star + governing.dir * (jdn - governing.jdn)), dayGanZhi: dayGanZhiLabel(jdn) };
}

// ---------------------------------------------------------------------------
// 결과 조립
// ---------------------------------------------------------------------------

function kstTimestamps(now: Date) {
  const kst = new Date(now.getTime() + 9 * 3600000);
  return { utc: now.toISOString(), kst: kst.toISOString().replace('Z', '+09:00') };
}

function skippedResult(note: string): KyuseiResult {
  const { utc, kst } = kstTimestamps(new Date());
  const targetWall = new Date(Date.now() + 9 * 3600000);
  const todayJdn = julianDayNumber(targetWall.getUTCFullYear(), targetWall.getUTCMonth() + 1, targetWall.getUTCDate());
  return {
    status: 'skipped',
    note,
    engineVersion: KYUSEI_ENGINE_VERSION,
    method: KYUSEI_METHOD,
    calculatedAtUtc: utc,
    calculatedAtKst: kst,
    timestamp: Date.now(),
    targetDate: `${targetWall.getUTCFullYear()}-${String(targetWall.getUTCMonth() + 1).padStart(2, '0')}-${String(targetWall.getUTCDate()).padStart(2, '0')}`,
    targetYearGanZhi: '',
    honmyosei: { star: 0, name: '', element: '토(土)' },
    getmyosei: { star: 0, name: '', element: '토(土)', monthBranch: '', currentTerm: '' },
    ilmyosei: { star: 0, name: '', element: '토(土)', dayGanZhi: dayGanZhiLabel(todayJdn) },
    annualChart: buildChart('연반(年盤)', 5),
    monthlyChart: buildChart('월반(月盤)', 5),
    dailyChart: buildChart('일반(日盤)', 5),
    hazards: [],
    fortuneDirections: [],
    topFortuneDirection: null,
    usageScenarios: [],
  };
}

/**
 * 사용자 프로필과 기준일로 구성학 9궁 명반(연·월·일반)과 길흉방위를 결정론적으로 산출한다.
 * 생년월일이 없으면 status 'skipped'로 명확히 알린다.
 */
export function calculateKyusei(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
}): KyuseiResult {
  const now = params.targetDate ?? new Date();
  const profile = params.profile ?? null;
  const birthdateStr = profile?.basic?.birthdate?.trim() || '';

  if (!profile || !birthdateStr) {
    return skippedResult('생년월일 미입력으로 구성학 9궁 명반과 길흉방위 계산을 생략했습니다.');
  }

  const resolved = resolveEffectiveSolarDate(birthdateStr, profile.basic?.lunarSolar, profile.basic?.isLeapMonth ?? false);
  const birthTime = parseBirthTime(profile.basic?.birthtime);

  // 입춘 당일생은 생시가 있어야 전년/당년 본명성이 확정된다.
  const ipchunThisYear = getYearSolarTerms(resolved.solarDate.year).find((t) => t.name === '입춘');
  if (!birthTime && ipchunThisYear &&
      ipchunThisYear.date.getUTCMonth() === resolved.solarDate.month - 1 &&
      ipchunThisYear.date.getUTCDate() === resolved.solarDate.day) {
    return skippedResult('입춘 당일 생시 미입력으로 전년/당년 본명성이 확정되지 않습니다.');
  }

  // 생년월일시를 KST 벽시시각 Date로 구성(생시 미입력 시 정오 기준).
  const birthWall = new Date(0);
  birthWall.setUTCFullYear(resolved.solarDate.year, resolved.solarDate.month - 1, resolved.solarDate.day);
  birthWall.setUTCHours(birthTime?.hour ?? 12, birthTime?.minute ?? 0, 0, 0);

  const birthYearInfo = getAstronomicalSajuYear(birthWall);
  const birthMonthInfo = getAstronomicalMonthBranch(birthWall);

  // 대상 기준일도 KST 벽시시각으로 환산.
  const targetWall = new Date(now.getTime() + 9 * 3600000);
  const targetYearInfo = getAstronomicalSajuYear(targetWall);
  const targetMonthInfo = getAstronomicalMonthBranch(targetWall);
  const targetDateStr = `${targetWall.getUTCFullYear()}-${String(targetWall.getUTCMonth() + 1).padStart(2, '0')}-${String(targetWall.getUTCDate()).padStart(2, '0')}`;

  // 1) 본명성·월명성
  const honStar = yearStarOf(birthYearInfo.sajuYear);
  const honElement = STARS[honStar].element;
  const getStar = monthStarOf(honStar, birthMonthInfo.monthBranchIndex);

  // 2) 당해 연성·월성·일성과 3반 포국
  const targetYearStar = yearStarOf(targetYearInfo.sajuYear);
  const targetMonthStar = monthStarOf(targetYearStar, targetMonthInfo.monthBranchIndex);
  const daily = dailyStarOf(targetWall);

  const annualChart = buildChart('연반(年盤)', targetYearStar);
  const monthlyChart = buildChart('월반(月盤)', targetMonthStar);
  const dailyChart = buildChart('일반(日盤)', daily.star);

  const starAt = (chart: KyuseiChart, direction: KyuseiDirection) =>
    chart.palaces.find((p) => p.direction === direction)!;
  const directionOfStar = (chart: KyuseiChart, star: number): KyuseiDirection | null =>
    chart.palaces.find((p) => p.star === star)?.direction ?? null;

  // 3) 대흉방위
  const yearGanZhiIdx = (((targetYearInfo.sajuYear - 4) % 60) + 60) % 60;
  const targetYearBranchIdx = yearGanZhiIdx % 12;
  const yearClashBranch = (targetYearBranchIdx + 6) % 12;
  const targetMonthBranchIdx = (targetMonthInfo.monthBranchIndex + 2) % 12; // 절월 지지 인덱스(0=寅 → 子=0 환산)
  const monthClashBranch = (targetMonthBranchIdx + 6) % 12;

  const hazards: KyuseiHazard[] = [];
  const annualOhwang = directionOfStar(annualChart, 5);
  const monthlyOhwang = directionOfStar(monthlyChart, 5);

  if (annualOhwang) {
    hazards.push({
      name: '오황살(五黃煞)',
      direction: annualOhwang,
      scope: '연반',
      reason: `${targetYearInfo.sajuYear}년 ${STARS[targetYearStar].name} 입중궁 연반에서 오황토성이 앉은 방위. 도열·이사·공사를 통째로 피하는 최대 흉방위.`,
    });
    const anGeum = OPPOSITE[annualOhwang];
    hazards.push({
      name: '암검살(暗劍煞)',
      direction: anGeum,
      scope: '연반',
      reason: `오황살(${annualOhwang})의 대궁. 낮게 숨어드는 돌발 재앙과 도체의 기운이 있는 방위.`,
    });
  }
  if (monthlyOhwang) {
    hazards.push({
      name: '월오황살(月五黃煞)',
      direction: monthlyOhwang,
      scope: '월반',
      reason: `${targetMonthInfo.currentTerm.name}(${targetMonthInfo.currentTerm.nameHanja}) 절월 월반에서 오황토성이 앉은 방위. 이 달 한동안 도열·공사를 피할 방위.`,
    });
    hazards.push({
      name: '월암검살(月暗劍煞)',
      direction: OPPOSITE[monthlyOhwang],
      scope: '월반',
      reason: `월오황살(${monthlyOhwang})의 대궁으로 이 달의 숨은 흉방위.`,
    });
  }
  const saePa = BRANCH_PALACE[yearClashBranch];
  hazards.push({
    name: '세파살(歲破煞)',
    direction: saePa,
    scope: '연반',
    reason: `${targetYearInfo.sajuYear}년 ${BRANCHES_KO[targetYearBranchIdx]}년의 대충(${BRANCHES_KO[yearClashBranch]}) 방위. 태세를 정면으로 치는 방위라 이사·증축을 삼간다.`,
  });
  const wolPa = BRANCH_PALACE[monthClashBranch];
  hazards.push({
    name: '월파살(月破煞)',
    direction: wolPa,
    scope: '월반',
    reason: `${targetMonthInfo.currentTerm.name} 절월(${BRANCHES_KO[targetMonthBranchIdx]}월)의 대충(${BRANCHES_KO[monthClashBranch]}) 방위로 이 달의 파재·파손 주의 방위.`,
  });

  const honDirection = directionOfStar(annualChart, honStar);
  if (honDirection) {
    hazards.push({
      name: '본명살(本命煞)',
      direction: honDirection,
      scope: '본명',
      reason: `본명성 ${STARS[honStar].name}이 연반에 앉은 방위. 본명의 기운이 중압되어 새 출발보다 지키는 일이 유리한 방위.`,
    });
    hazards.push({
      name: '본명적살(本命的煞)',
      direction: OPPOSITE[honDirection],
      scope: '본명',
      reason: `본명살(${honDirection})의 대궁으로 본명과 정면충돌하는 방위.`,
    });
  }

  // 4) 대길방위: 상생(생입) > 비화 > 설기 순으로 평가하고 흉살 겹침은 감점
  const blockedDirections = new Set(
    hazards.map((h) => h.direction).filter((d): d is KyuseiDirection => Boolean(d)),
  );

  const RELATION_ORDER = { '상생(生入)': 0, '비화(比和)': 1, '설기(生出)': 2 } as const;
  const GUIDANCE: Record<KyuseiFortuneDirection['relation'], string> = {
    '상생(生入)': '내 별의 오행을 생해주는 별이 앉아 기운이 채워지는 최상의 길방위다.',
    '비화(比和)': '나와 같은 오행의 별이 앉아 기운이 고스란히 보태지는 길방위다.',
    '설기(生出)': '내 기운이 그 방위의 별으로 흘러 나가 힘이 보태지는 보조 길방위다.',
  };

  const fortuneDirections: KyuseiFortuneDirection[] = FLIGHT_ORDER.map((direction) => {
    const palace = starAt(annualChart, direction);
    const palaceElement = palace.starElement;
    const relation: KyuseiFortuneDirection['relation'] | null =
      palaceElement === GENERATING_ELEMENT[honElement]
        ? '상생(生入)'
        : palaceElement === honElement
        ? '비화(比和)'
        : honElement === GENERATING_ELEMENT[palaceElement]
        ? '설기(生出)'
        : null; // 극(克) 관계 방위는 길방위 후보에서 제외
    if (!relation) return null;
    const blockedBy = hazards
      .filter((h) => h.direction === direction)
      .map((h) => `${h.name}·${h.scope}`);
    return {
      direction,
      trigram: palace.trigram,
      star: palace.star,
      starName: palace.starName,
      relation,
      grade: relation === '상생(生入)' ? '최길' : relation === '비화(比和)' ? '길' : '보조',
      clean: !blockedDirections.has(direction),
      blockedBy,
      guidance: GUIDANCE[relation],
    };
  })
    .filter((f): f is KyuseiFortuneDirection => f !== null)
    .sort((a, b) => {
      if (a.clean !== b.clean) return a.clean ? -1 : 1;
      const rel = RELATION_ORDER[a.relation] - RELATION_ORDER[b.relation];
      if (rel !== 0) return rel;
      return FLIGHT_ORDER.indexOf(a.direction) - FLIGHT_ORDER.indexOf(b.direction);
    });

  const top = fortuneDirections.find((f) => f.clean && f.relation !== '설기(生出)');
  const topFortuneDirection = top
    ? {
        direction: top.direction,
        starName: top.starName,
        relation: top.relation,
        summary: `${targetDateStr} 기준 ${top.direction}(${PALACES[top.direction].trigram})은 본명성 ${STARS[honStar].name}과 ${top.relation} 관계인 ${top.starName}이 앉은 방위로, 연·월반 흉살이 일절 닿지 않는 최길방위다.`,
      }
    : null;

  const best = top?.direction ?? fortuneDirections.find((f) => f.clean)?.direction;
  const usageScenarios: KyuseiResult['usageScenarios'] = best
    ? [
        { scenario: '이사·입주', direction: best, advice: `이사·입주 날 최종 도착하고 처음 드나드는 방향을 ${best}쪽으로 삼으면 길한 기운을 먼저 받는다.` },
        { scenario: '여행·출장', direction: best, advice: `목적지를 ${best} 방면으로 잡거나 첫 이동 거리를 ${best}쪽에 두고 출발하는 것이 길하다.` },
        { scenario: '미팅·계약·면접', direction: best, advice: `상대를 만날 장소를 ${best} 방면에서 정하거나, 그쪽을 바라보고 앉으면 주도권이 내 편이 된다.` },
      ]
    : [];

  const directionalScores = calculateDirectionalScores(fortuneDirections, hazards);
  const honmyoseiSynergy = calculateHonmyoseiSynergy(honStar, annualChart.centerStar);

  const { utc, kst } = kstTimestamps(now);
  const kyuseiSynthesisMatrix = {
    dominantTension: `본명성 ${STARS[honStar].name} ↔ 연반 중궁 ${annualChart.centerStarName}`,
    alignmentState: `${honmyoseiSynergy.annualStarRelation} — 최길 방위 ${topFortuneDirection?.direction ?? '유연 조율'}`,
    integratedAction: topFortuneDirection ? topFortuneDirection.summary : honmyoseiSynergy.annualThemeGuidance,
  };

  return {
    status: 'calculated',
    engineVersion: KYUSEI_ENGINE_VERSION,
    method: KYUSEI_METHOD,
    calculatedAtUtc: utc,
    calculatedAtKst: kst,
    timestamp: now.getTime(),
    targetDate: targetDateStr,
    targetYearGanZhi: `${STEMS_KO[yearGanZhiIdx % 10]}${BRANCHES_KO[targetYearBranchIdx]}`,
    honmyosei: {
      star: honStar,
      name: STARS[honStar].name,
      element: honElement,
    },
    getmyosei: {
      star: getStar,
      name: STARS[getStar].name,
      element: STARS[getStar].element,
      monthBranch: BRANCHES_KO[(birthMonthInfo.monthBranchIndex + 2) % 12],
      currentTerm: birthMonthInfo.currentTerm.name,
    },
    ilmyosei: {
      star: daily.star,
      name: STARS[daily.star].name,
      element: STARS[daily.star].element,
      dayGanZhi: daily.dayGanZhi,
    },
    annualChart,
    monthlyChart,
    dailyChart,
    hazards,
    fortuneDirections,
    topFortuneDirection,
    usageScenarios,
    directionalScores,
    honmyoseiSynergy,
    kyuseiSynthesisMatrix,
    interpretiveBoundary: '본 구성학 9궁 명반·길흉방위 리포트는 동양 역법과 구궁 비성 수리에 기반한 정성적 방위 참고 안내이며, 절대적 길흉 예단이 아닙니다.',
  };
}

function calculateDirectionalScores(
  fortuneDirections: KyuseiFortuneDirection[],
  hazards: KyuseiHazard[],
): KyuseiDirectionScore[] {
  const directions: KyuseiDirection[] = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
  const hazardByDir = new Map<KyuseiDirection, KyuseiHazard[]>();
  for (const h of hazards) {
    if (h.direction) {
      const list = hazardByDir.get(h.direction) ?? [];
      list.push(h);
      hazardByDir.set(h.direction, list);
    }
  }

  const fortuneByDir = new Map<KyuseiDirection, KyuseiFortuneDirection>();
  for (const f of fortuneDirections) {
    fortuneByDir.set(f.direction, f);
  }

  return directions.map((dir) => {
    const dirHazards = hazardByDir.get(dir) ?? [];
    const fortune = fortuneByDir.get(dir);

    const hasCriticalHazard = dirHazards.some((h) => h.name.includes('오황') || h.name.includes('암검'));
    const hasMajorHazard = dirHazards.some((h) => h.name.includes('파살') || h.name.includes('본명'));

    let score = 65;
    let level: KyuseiDirectionScore['level'] = '평';
    let activities: string[] = ['일상적 업무 및 산책', '온라인 비대면 교류'];

    if (hasCriticalHazard) {
      level = '대흉';
      score = 25;
      activities = ['공사·토목 금지', '장거리 이동 회피', '신규 계약 보류 및 내실 유지'];
    } else if (hasMajorHazard) {
      level = '주의';
      score = 45;
      activities = ['무리한 확장 자제', '중요 의사결정 재점검', '주변과의 마찰 주의'];
    } else if (fortune?.clean && fortune.grade === '최길') {
      level = '최길';
      score = 95;
      activities = ['신규 사업 론칭 및 확장', '핵심 계약 및 투자 유치', '이사·여행·개운 이동'];
    } else if (fortune?.clean && fortune.grade === '길') {
      level = '길';
      score = 85;
      activities = ['중요 비즈니스 미팅', '지인 교류 및 협력 관계 구축', '자기 계발 및 학습'];
    } else if (fortune?.clean) {
      level = '길';
      score = 75;
      activities = ['재충전 및 힐링 여행', '새로운 아이디어 구상'];
    }

    return {
      direction: dir,
      score,
      level,
      recommendedActivities: activities,
    };
  });
}

function calculateHonmyoseiSynergy(
  honStar: number,
  annualCenterStar: number,
): KyuseiHonmyoseiSynergy {
  const honEl = STARS[honStar]?.element ?? '수(水)';
  const annEl = STARS[annualCenterStar]?.element ?? '수(水)';

  const baseOf = (el: KyuseiElement): '수' | '토' | '목' | '금' | '화' => {
    if (el.startsWith('수')) return '수';
    if (el.startsWith('토')) return '토';
    if (el.startsWith('목')) return '목';
    if (el.startsWith('금')) return '금';
    return '화';
  };

  const h = baseOf(honEl);
  const a = baseOf(annEl);

  const generates: Record<string, string> = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' };
  const controls: Record<string, string> = { 목: '토', 토: '수', 수: '화', 화: '금', 금: '목' };

  let relation: KyuseiHonmyoseiSynergy['annualStarRelation'] = '비화(比和)';
  let score = 88;
  let guidance = '당해 연성과 본명성이 동기감응하여 독립적 역량과 주체적 성취가 빛나는 해입니다.';

  if (h === a) {
    relation = '비화(比和)';
    score = 88;
    guidance = '당해 연성과 본명성의 오행이 일치하여 내면의 잠재력이 강하게 발현되며 자립 기반을 확립하는 시기입니다.';
  } else if (generates[a] === h) {
    relation = '생입(生入)';
    score = 94;
    guidance = '연성의 기운이 본명성을 풍요롭게 생(生)하므로 주변의 조력과 환경적 기회가 활짝 열리는 최길의 해입니다.';
  } else if (generates[h] === a) {
    relation = '생출(生出)';
    score = 78;
    guidance = '자신의 재능과 노력을 외부로 표출하여 세상을 감동시키고 결실을 거두는 활발한 활동의 해입니다.';
  } else if (controls[h] === a) {
    relation = '극출(克出)';
    score = 72;
    guidance = '강한 도전 정신과 주도적 결단력으로 장애물을 극복하고 스스로 길을 개척하는 돌파의 시기입니다.';
  } else if (controls[a] === h) {
    relation = '극입(克入)';
    score = 62;
    guidance = '외부 환경의 압박과 시련이 따를 수 있으므로 방어적 태세를 갖추고 내실을 다지며 때를 기다리는 것이 현명합니다.';
  }

  return {
    annualStarRelation: relation,
    synergyScore: score,
    annualThemeGuidance: guidance,
  };
}

/**
 * 구성학 9궁 명반 결과를 LLM 프롬프트에 주입하기 위한 정돈된 한국어 섹션으로 변환한다.
 * skipped 결과는 빈 문자열을 반환해 상위 포맷터가 섹션을 생략하도록 한다.
 */
export function formatKyuseiPrompt(result: KyuseiResult): string {
  if (result.status !== 'calculated') return '';

  const chartLines = (chart: KyuseiChart) =>
    chart.palaces
      .map((p) => `     • ${p.direction}(${p.trigram} ${p.degreeRange}): ${p.starName} [${p.starElement}]`)
      .join('\n');

  const hazardLines = result.hazards
    .map((h) => `   - ⚠️ [${h.direction ?? '중궁'}] ${h.name}(${h.scope}): ${h.reason}`)
    .join('\n');

  const fortuneLines = result.fortuneDirections
    .map((f, i) => {
      const block = f.blockedBy.length ? ` · 흉살 겹침: ${f.blockedBy.join(', ')}` : ' · 흉살 없음';
      return `   ${i + 1}. [${f.direction}] ${f.starName} — ${f.relation} / ${f.grade}${block}\n      → ${f.guidance}`;
    })
    .join('\n');

  const usageLines = result.usageScenarios
    .map((u) => `   - ${u.scenario}: ${u.direction} — ${u.advice}`)
    .join('\n');

  return `[🧭 구성학(九星氣學) 9궁 명반·길흉방위 실측 데이터 (Kyusei Nine-Palaces Core)]
======================================================================
엔진 버전: ${result.engineVersion} | 기준일: ${result.targetDate} (${result.targetYearGanZhi}년) | 산출 시각: ${result.calculatedAtKst}
산법: ${result.method}
본명성: ${result.honmyosei.name} [${result.honmyosei.element}]
월명성: ${result.getmyosei.name} (생월 절기: ${result.getmyosei.currentTerm}·${result.getmyosei.monthBranch}월)
일명성: ${result.ilmyosei.name} (${result.ilmyosei.dayGanZhi}일)
======================================================================
1. [연반(年盤) — ${result.annualChart.centerStarName} 입중궁]:
${chartLines(result.annualChart)}

2. [월반(月盤) — ${result.monthlyChart.centerStarName} 입중궁]:
${chartLines(result.monthlyChart)}

3. [일반(日盤) — ${result.dailyChart.centerStarName} 입중궁]:
${chartLines(result.dailyChart)}

4. [대흉방위(凶方) 종합]:
${hazardLines}

5. [대길방위(吉方) 순위 — 본명성 ${result.honmyosei.name} 기준]:
${fortuneLines}

6. [활용 시나리오 — 이사·여행·미팅·출장]:
${usageLines}${result.directionalScores ? `\n======================================================================
[8대 방위별 목적 적합도 매트릭스 및 본명성-연성 동회 심층 수리 평가]
${result.directionalScores.map(d => `   • [${d.direction}] (${d.level}) → 권장: ${d.recommendedActivities.join(', ')}`).join('\n')}
   * 본명성-연성 조화도: ${result.honmyoseiSynergy?.annualStarRelation}
   * 연간 테마 가이드: ${result.honmyoseiSynergy?.annualThemeGuidance}` : ''}${result.kyuseiSynthesisMatrix ? `\n   * 교차 매트릭스 [핵심 긴장: ${result.kyuseiSynthesisMatrix.dominantTension} | 조율 상태: ${result.kyuseiSynthesisMatrix.alignmentState}]\n   * 통합 실천: ${result.kyuseiSynthesisMatrix.integratedAction}` : ''}${result.interpretiveBoundary ? `\n   * 해석 경계: ${result.interpretiveBoundary}` : ''}
======================================================================
[★ 루시 구성학 상담 지침]:
- 위 3반(연반·월반·일반) 포국과 흉살 방위는 순수 수리로 직접 비성한 확정 데이터다. 다른 포국을 지어내지 마십시오.
- 사용자가 '이사/여행/출장 가는데 어느 방향이 좋아?', '오늘 어느 방위로 움직일까?'라고 물으면 최길방위 [${result.topFortuneDirection?.direction ?? '해당 없음'}]를 1순위로, 흉살 방위는 구체적 행동 지침(공사·도열 피하기, 움직임 타이밍 조정)으로 안내하십시오.
- 흉방위는 두려움이 아니라 '그 방위의 큰 움직임을 피하고 길방위로 행동을 옮기는' 실용적 개운 전략으로 다정하게 전달하십시오.`;
}
