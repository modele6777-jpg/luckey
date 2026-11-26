/**
 * =========================================================================
 * LUCKEY 크로노-트랜짓 엔진 (Chrono-Transit Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 실시간 만세력 일진(日辰) & 시진(時辰)과 하늘의 행성 트랜짓(Transit)을 100% 실시간 결정론적 계산
 * 2. 동양 사주명리: 율리우스 적일과 24절기 절입시각 기준 오늘의 일진 간지 및 현재 시진 간지 산출,
 *    사용자 일간(Day Master) 기준 오늘의 십신(十神) 및 지지합충(六合·三合·沖·怨嗔) 실시간 교차 분석
 * 3. 서양 점성술: astronomy-engine 기반 현재 하늘의 10대 천체(태양·달·수성·금성·화성·목성·토성·천왕성·해왕성·명왕성)
 *    황도대 도수 및 역행(Retrograde ℞) 여부, 달의 위상(Moon Phase), 사용자 출생 행성과의 실시간 트랜짓 아스펙트(합·충·삼각·사각·육각) 산출
 * 4. 동서양 융합 크로노-트랜짓 통합 리포트를 생성하여 루시(Lucy) 및 마스터 모드에 살아있는 당일 시간 맞춤 통찰 주입
 */

import { Body, GeoVector, Ecliptic, MoonPhase } from 'astronomy-engine';
import type { UserProfile } from '../sharedState';
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  calculateTenGod,
  calculateDetailedSaju,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  STEM_KOREAN,
  BRANCH_KOREAN,
  type SajuAnalysisResult,
  type FiveElement
} from '../sajuAnalysis';
import {
  ZODIAC_SIGNS,
  type ZodiacSignInfo,
  type NatalPlacement,
  type NatalChartResult,
  calculateNatalChart
} from '../astrologyAnalysis';
import {
  getAstronomicalSajuYear,
  getAstronomicalMonthBranch
} from '../astronomicalSolarTerms';

export interface TransitPlacement {
  bodyId: string;
  bodyKoName: string;
  symbol: string;
  sign: ZodiacSignInfo;
  degree: number; // 0 ~ 29.99
  absoluteLongitude: number; // 0 ~ 359.99
  isRetrograde: boolean;
}

export type AspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';

export interface TransitAspect {
  transitBody: string;
  transitSymbol: string;
  aspectType: AspectType;
  aspectKoName: string;
  symbol: string;
  natalTarget: string;
  orb: number; // 오차 각도
  nature: 'harmonious' | 'challenging' | 'dynamic';
  interpretation: string;
}

export interface PillarInfo {
  gan: string;
  zhi: string;
  ganKo: string;
  zhiKo: string;
  elementGan: FiveElement;
  elementZhi: FiveElement;
  koreanName: string;
}

export interface SajuInteraction {
  type: 'cheongan_hap' | 'yukhap' | 'samhap' | 'banghap' | 'chung' | 'wonjin' | 'pa_hae';
  category: '합(조화·인연)' | '충(변화·돌파)' | '원진(예민·거리두기)' | '기타';
  name: string;
  targetPillar: string;
  description: string;
}

export interface ChronoTransitResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;
  chronoCrossAxis: string;
  
  // 1. 오늘의 사주 일진 & 시진
  easternPillars: {
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;   // 오늘의 일진
    hour: PillarInfo;  // 현재 시각 시진
    todayTenGod?: {
      name: string;
      category: string;
      desc: string;
      dayMasterPillar: string;
    };
    hourTenGod?: {
      name: string;
      category: string;
      desc: string;
    };
    interactions: SajuInteraction[];
    dailyEnergyTheme: string;
    optimalHourGuide: string;
  };

  // 2. 현재 하늘의 실시간 행성 트랜짓
  westernTransits: {
    moonPhase: {
      angle: number;
      name: string;
      illuminationEstimate: number;
    };
    transits: TransitPlacement[];
    retrogradeBodies: string[];
    dominantTransitElement: '불' | '흙' | '공기' | '물';
    activeAspects: TransitAspect[];
    dailyAstroTheme: string;
  };

  // 3. 동서양 융합 오늘 실시간 시간 동기화 통찰
  integratedSynthesis: {
    headline: string;
    energyFlow: string;
    mindsetAdvice: string;
    microAction: string;
  };
  situationalChronoAudit: {
    focusTheme: string;
    transitCue: string;
    tacticalStep: string;
  };
  temporalChronoRhythm: {
    kstTimeLabel: string;
    dayHourWindow: string;
    lunarTransitTone: string;
    temporalGuidance: string;
  };
  chronoSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

// 행성 한글 명칭 및 심볼 매핑
const TRANSIT_BODIES: { body: Body; koName: string; symbol: string; id: string }[] = [
  { body: Body.Sun, koName: '태양', symbol: '☉', id: 'sun' },
  { body: Body.Moon, koName: '달', symbol: '☽', id: 'moon' },
  { body: Body.Mercury, koName: '수성', symbol: '☿', id: 'mercury' },
  { body: Body.Venus, koName: '금성', symbol: '♀', id: 'venus' },
  { body: Body.Mars, koName: '화성', symbol: '♂', id: 'mars' },
  { body: Body.Jupiter, koName: '목성', symbol: '♃', id: 'jupiter' },
  { body: Body.Saturn, koName: '토성', symbol: '♄', id: 'saturn' },
  { body: Body.Uranus, koName: '천왕성', symbol: '♅', id: 'uranus' },
  { body: Body.Neptune, koName: '해왕성', symbol: '♆', id: 'neptune' },
  { body: Body.Pluto, koName: '명왕성', symbol: '♇', id: 'pluto' }
];

// 천간합 매핑
const CHEONGAN_HAP_PAIRS: Record<string, { partner: string; resultElement: string; name: string }> = {
  '甲': { partner: '己', resultElement: '토(土)', name: '갑기합토(甲己合土·중정지합)' },
  '己': { partner: '甲', resultElement: '토(土)', name: '갑기합토(甲己合土·중정지합)' },
  '乙': { partner: '庚', resultElement: '금(金)', name: '을경합금(乙庚合金·인의지합)' },
  '庚': { partner: '乙', resultElement: '금(金)', name: '을경합금(乙庚合金·인의지합)' },
  '丙': { partner: '辛', resultElement: '수(水)', name: '병신합수(丙辛合水·위엄지합)' },
  '辛': { partner: '丙', resultElement: '수(水)', name: '병신합수(丙辛合水·위엄지합)' },
  '丁': { partner: '壬', resultElement: '목(木)', name: '정임합목(丁壬合木·인수지합)' },
  '壬': { partner: '丁', resultElement: '목(木)', name: '정임합목(丁壬合木·인수지합)' },
  '戊': { partner: '癸', resultElement: '화(火)', name: '무계합화(戊癸合火·무정지합)' },
  '癸': { partner: '戊', resultElement: '화(火)', name: '무계합화(戊癸合火·무정지합)' },
};

// 지지 육합 매핑
const YUKHAP_PAIRS: Record<string, { partner: string; resultElement: string; name: string }> = {
  '子': { partner: '丑', resultElement: '토(土)', name: '자축합토(子丑合土)' },
  '丑': { partner: '子', resultElement: '토(土)', name: '자축합토(子丑合土)' },
  '寅': { partner: '亥', resultElement: '목(木)', name: '인해합목(寅亥合木)' },
  '亥': { partner: '寅', resultElement: '목(木)', name: '인해합목(寅亥合木)' },
  '卯': { partner: '戌', resultElement: '화(火)', name: '묘술합화(卯戌合火)' },
  '戌': { partner: '卯', resultElement: '화(火)', name: '묘술합화(卯戌合火)' },
  '辰': { partner: '酉', resultElement: '금(金)', name: '진유합금(辰酉合金)' },
  '酉': { partner: '辰', resultElement: '금(金)', name: '진유합금(辰酉合金)' },
  '巳': { partner: '申', resultElement: '수(水)', name: '사신합수(巳申合水)' },
  '申': { partner: '巳', resultElement: '수(水)', name: '사신합수(巳申合水)' },
  '午': { partner: '未', resultElement: '태양·달 화합', name: '오미합(午未合日月)' },
  '未': { partner: '午', resultElement: '태양·달 화합', name: '오미합(午未合日月)' }
};

// 지지 충 매핑
const CHUNG_PAIRS: Record<string, string> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳'
};

// 지지 원진 매핑
const WONJIN_PAIRS: Record<string, string> = {
  '子': '未', '未': '子',
  '丑': '午', '午': '丑',
  '寅': '酉', '酉': '寅',
  '卯': '申', '申': '卯',
  '辰': '亥', '亥': '辰',
  '巳': '戌', '戌': '巳'
};

/**
 * 황경(0~360)을 12별자리 및 도수로 변환
 */
function longitudeToPlacement(lonDeg: number): { sign: ZodiacSignInfo; degree: number } {
  const normalized = ((lonDeg % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  const sign = ZODIAC_SIGNS[signIndex] || ZODIAC_SIGNS[0];
  return { sign, degree: Math.min(29.99, Math.round(degree * 100) / 100) };
}

/**
 * 행성의 황경 역행(Retrograde ℞) 여부 판정
 * 24시간 전후 황경 비교: 황경 감소 시 역행
 */
function checkRetrograde(body: Body, instant: Date): boolean {
  if (body === Body.Sun || body === Body.Moon) return false;
  const prevInstant = new Date(instant.getTime() - 24 * 3600 * 1000);
  const nextInstant = new Date(instant.getTime() + 24 * 3600 * 1000);
  const lonPrev = ((Ecliptic(GeoVector(body, prevInstant, true)).elon % 360) + 360) % 360;
  const lonNext = ((Ecliptic(GeoVector(body, nextInstant, true)).elon % 360) + 360) % 360;
  let delta = (lonNext - lonPrev + 540) % 360 - 180;
  return delta < 0;
}

/**
 * 두 황경 간의 최소 각도차(0~180°) 계산
 */
function getAngleDifference(deg1: number, deg2: number): number {
  return Math.abs(((deg1 - deg2 + 540) % 360) - 180);
}

/**
 * 간지 기둥 정보 빌더
 */
function makePillarInfo(gan: string, zhi: string): PillarInfo {
  return {
    gan,
    zhi,
    ganKo: STEM_KOREAN[gan] || gan,
    zhiKo: BRANCH_KOREAN[zhi] || zhi,
    elementGan: STEM_ELEMENT[gan] || '목',
    elementZhi: BRANCH_ELEMENT[zhi] || '목',
    koreanName: `${STEM_KOREAN[gan] || gan}${BRANCH_KOREAN[zhi] || zhi} (${gan}${zhi})`
  };
}

export const CHRONO_TRANSIT_VERSION = 'LUCKEY-CHRONO-TRANSIT-v2.4.0';

/**
 * 실시간 크로노-트랜짓 메인 계산 함수
 */
export function calculateChronoTransit(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
  question?: string;
}): ChronoTransitResult {
  const now = params.targetDate || new Date();
  const question = (params.question || '').trim();
  const utcMs = now.getTime();
  
  // 한국 표준시 (KST = UTC + 9) 벽시계 일시 산출
  const kstMs = utcMs + 9 * 3600 * 1000;
  const kstDate = new Date(kstMs);
  const y = kstDate.getUTCFullYear();
  const m = kstDate.getUTCMonth() + 1;
  const d = kstDate.getUTCDate();
  const h = kstDate.getUTCHours();
  const minute = kstDate.getUTCMinutes();
  
  const nowKstIso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+09:00`;
  const nowUtcIso = now.toISOString();

  // 절기 엔진 비교용 KST 벽시계 Date
  const kstWallClockDate = new Date(Date.UTC(y, m - 1, d, h, minute, 0));

  // -------------------------------------------------------------------------
  // 1. 오늘의 사주 만세력 4주 (연·월·일·시) 정밀 수리 계산
  // -------------------------------------------------------------------------
  // 1-1. 년주 (입춘 기준)
  const { sajuYear } = getAstronomicalSajuYear(kstWallClockDate);
  const yi = (sajuYear - 4) % 60;
  const yGan = HEAVENLY_STEMS[(yi % 10 + 10) % 10];
  const yZhi = EARTHLY_BRANCHES[(yi % 12 + 12) % 12];

  // 1-2. 월주 (12절 절입시각 기준)
  const { monthBranchIndex } = getAstronomicalMonthBranch(kstWallClockDate);
  const mZhiIdx = (monthBranchIndex + 2) % 12;
  const mZhi = EARTHLY_BRANCHES[mZhiIdx];
  const yGanIdx = HEAVENLY_STEMS.indexOf(yGan);
  const startStemForTiger = ((yGanIdx % 5) * 2 + 2) % 10;
  const monthGanIdx = (startStemForTiger + monthBranchIndex) % 10;
  const mGan = HEAVENLY_STEMS[monthGanIdx];

  // 1-3. 일주 (율리우스 적일 기준 조자시/야자시 보정)
  let dayYear = y;
  let dayMonth = m;
  let dayDate = d;
  if (h === 23 && minute >= 30) {
    const nextDay = new Date(Date.UTC(y, m - 1, d + 1));
    dayYear = nextDay.getUTCFullYear();
    dayMonth = nextDay.getUTCMonth() + 1;
    dayDate = nextDay.getUTCDate();
  }
  const a = Math.floor((14 - dayMonth) / 12);
  const yr = dayYear + 4800 - a;
  const mo = dayMonth + 12 * a - 3;
  const jd = dayDate + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  const di = (jd + 49) % 60;
  const dGan = HEAVENLY_STEMS[(di % 10 + 10) % 10];
  const dZhi = EARTHLY_BRANCHES[(di % 12 + 12) % 12];

  // 1-4. 시주 (한국 표준시 30분 시차 보정)
  const totalMins = h * 60 + minute;
  const adjustedMins = (totalMins - 30 + 1440) % 1440;
  const hIdx = Math.floor((adjustedMins + 60) / 120) % 12;
  const hZhi = EARTHLY_BRANCHES[hIdx];
  const dGanIdx = HEAVENLY_STEMS.indexOf(dGan);
  const startStemForHour = ((dGanIdx % 5) * 2) % 10;
  const hGanIdx = (startStemForHour + hIdx) % 10;
  const hGan = HEAVENLY_STEMS[hGanIdx];

  const yearPillar = makePillarInfo(yGan, yZhi);
  const monthPillar = makePillarInfo(mGan, mZhi);
  const dayPillar = makePillarInfo(dGan, dZhi);
  const hourPillar = makePillarInfo(hGan, hZhi);

  // -------------------------------------------------------------------------
  // 1-5. 사용자 사주 원국과 오늘의 일진 간의 실시간 상호작용 분석
  // -------------------------------------------------------------------------
  const sajuUser = calculateDetailedSaju(params.profile);
  let todayTenGodInfo: ChronoTransitResult['easternPillars']['todayTenGod'];
  let hourTenGodInfo: ChronoTransitResult['easternPillars']['hourTenGod'];
  const sajuInteractions: SajuInteraction[] = [];

  if (sajuUser) {
    const userDayGan = sajuUser.pillars.day.gan;
    const userDayZhi = sajuUser.pillars.day.zhi;
    const userYearZhi = sajuUser.pillars.year.zhi;

    // 오늘의 십신
    const dayTenGod = calculateTenGod(userDayGan, dGan, false);
    todayTenGodInfo = {
      name: dayTenGod.name,
      category: dayTenGod.category,
      desc: dayTenGod.desc,
      dayMasterPillar: `내 일간 ${userDayGan}(${STEM_KOREAN[userDayGan]}) 대비 오늘의 일진 ${dGan}(${STEM_KOREAN[dGan]})`
    };

    // 현재 시각 십신
    const hourTenGod = calculateTenGod(userDayGan, hGan, false);
    hourTenGodInfo = {
      name: hourTenGod.name,
      category: hourTenGod.category,
      desc: hourTenGod.desc
    };

    // 천간합
    if (CHEONGAN_HAP_PAIRS[userDayGan]?.partner === dGan) {
      sajuInteractions.push({
        type: 'cheongan_hap',
        category: '합(조화·인연)',
        name: CHEONGAN_HAP_PAIRS[userDayGan].name,
        targetPillar: '일지/일간',
        description: `내 일간(${userDayGan})과 오늘 천간(${dGan})이 다정하게 합을 이루어 뜻밖의 조력자나 순조로운 타협이 열리는 날입니다.`
      });
    }

    // 일지 육합
    if (YUKHAP_PAIRS[userDayZhi]?.partner === dZhi) {
      sajuInteractions.push({
        type: 'yukhap',
        category: '합(조화·인연)',
        name: YUKHAP_PAIRS[userDayZhi].name,
        targetPillar: '일지(배우자·몸)',
        description: `내 일지(${userDayZhi})와 오늘 지지(${dZhi})가 육합을 이루어 정서적 안정감과 친밀한 인연의 화합이 두터워집니다.`
      });
    }

    // 일지 충
    if (CHUNG_PAIRS[userDayZhi] === dZhi) {
      sajuInteractions.push({
        type: 'chung',
        category: '충(변화·돌파)',
        name: `${userDayZhi}${dZhi}충(${userDayZhi}·${dZhi} 沖)`,
        targetPillar: '일지(활동·심신)',
        description: `내 일지(${userDayZhi})와 오늘 지지(${dZhi})가 마주쳐 부딪히니, 정체되었던 일에 급격한 반전이나 이동·쇄신의 돌파구가 생깁니다.`
      });
    }

    // 년지 충 (외부 환경 변화)
    if (CHUNG_PAIRS[userYearZhi] === dZhi && userYearZhi !== userDayZhi) {
      sajuInteractions.push({
        type: 'chung',
        category: '충(변화·돌파)',
        name: `${userYearZhi}${dZhi}충 (외적 환경 자극)`,
        targetPillar: '년지(사회·외부)',
        description: `사회적 자리나 외부 대인관계에서 예상치 못한 새로운 자극과 판도 변화가 일어날 수 있습니다.`
      });
    }

    // 일지 원진
    if (WONJIN_PAIRS[userDayZhi] === dZhi) {
      sajuInteractions.push({
        type: 'wonjin',
        category: '원진(예민·거리두기)',
        name: `${userDayZhi}${dZhi}원진살(${userDayZhi}·${dZhi} 怨嗔)`,
        targetPillar: '일지(감정선)',
        description: `감정선이 섬세해져 서운함이나 오해가 스칠 수 있으니, 즉각 반응하기보다 템포를 한 박자 늦추는 지혜가 빛납니다.`
      });
    }
  }

  // 일진 에너지 테마 한 줄 정리
  let dailyEnergyTheme = `오늘의 일진은 ${dayPillar.koreanName}의 날입니다.`;
  if (todayTenGodInfo) {
    dailyEnergyTheme = `오늘의 일진은 [${dayPillar.koreanName}]로, 나에게는 [${todayTenGodInfo.name}]의 흐름입니다. (${todayTenGodInfo.desc})`;
  }

  const optimalHourGuide = `현재 시각은 ${hourPillar.koreanName}시이며, 집중과 중요한 결단은 기운이 맑게 트이는 시간에 배치하면 유리합니다.`;

  // -------------------------------------------------------------------------
  // 2. 현재 하늘의 실시간 행성 트랜짓 (Western Planetary Transits)
  // -------------------------------------------------------------------------
  const transits: TransitPlacement[] = [];
  const retrogradeBodies: string[] = [];
  let fireW = 0, earthW = 0, airW = 0, waterW = 0;

  for (const b of TRANSIT_BODIES) {
    const lonRaw = Ecliptic(GeoVector(b.body, now, true)).elon;
    const absLon = ((lonRaw % 360) + 360) % 360;
    const { sign, degree } = longitudeToPlacement(absLon);
    const isRet = checkRetrograde(b.body, now);

    if (isRet) {
      retrogradeBodies.push(`${b.koName}(${b.symbol}℞)`);
    }

    transits.push({
      bodyId: b.id,
      bodyKoName: b.koName,
      symbol: b.symbol,
      sign,
      degree,
      absoluteLongitude: Math.round(absLon * 100) / 100,
      isRetrograde: isRet
    });

    // 4원소 가중치
    const weight = b.body === Body.Sun ? 3 : b.body === Body.Moon ? 2.5 : 1;
    if (sign.element === '불') fireW += weight;
    if (sign.element === '흙') earthW += weight;
    if (sign.element === '공기') airW += weight;
    if (sign.element === '물') waterW += weight;
  }

  const dominantTransitElement = (
    fireW >= earthW && fireW >= airW && fireW >= waterW ? '불' :
    earthW >= airW && earthW >= waterW ? '흙' :
    airW >= waterW ? '공기' : '물'
  ) as '불' | '흙' | '공기' | '물';

  // 달의 위상 (Moon Phase)
  const moonPhaseDeg = ((MoonPhase(now) % 360) + 360) % 360;
  let moonPhaseName = '';
  if (moonPhaseDeg < 22.5 || moonPhaseDeg >= 337.5) moonPhaseName = '신월 (New Moon · 새로운 씨앗)';
  else if (moonPhaseDeg < 67.5) moonPhaseName = '초승달 (Waxing Crescent · 의도 구체화)';
  else if (moonPhaseDeg < 112.5) moonPhaseName = '상현달 (First Quarter · 과감한 실행)';
  else if (moonPhaseDeg < 157.5) moonPhaseName = '상현망간달 (Waxing Gibbous · 디테일 완결)';
  else if (moonPhaseDeg < 202.5) moonPhaseName = '만월 (Full Moon · 수확과 충만)';
  else if (moonPhaseDeg < 247.5) moonPhaseName = '하현망간달 (Waning Gibbous · 나눔과 감사)';
  else if (moonPhaseDeg < 292.5) moonPhaseName = '하현달 (Last Quarter · 정리와 비움)';
  else moonPhaseName = '그믐달 (Waning Crescent · 깊은 성찰과 재충전)';

  // 조도 추정 (만월=100%, 신월=0%)
  const illumination = Math.round((1 - Math.cos(moonPhaseDeg * Math.PI / 180)) / 2 * 100);

  // -------------------------------------------------------------------------
  // 2-1. 출생 네이탈 차트와의 실시간 트랜짓 아스펙트 (Transit-to-Natal Aspects)
  // -------------------------------------------------------------------------
  const natalChart = calculateNatalChart(params.profile);
  const activeAspects: TransitAspect[] = [];

  if (natalChart) {
    const natalTargets: { name: string; placement: NatalPlacement | null }[] = [
      { name: '태양', placement: natalChart.sun },
      { name: '달', placement: natalChart.moon },
      { name: '상승궁', placement: natalChart.ascendant },
      { name: '수성', placement: natalChart.mercury },
      { name: '금성', placement: natalChart.venus },
      { name: '화성', placement: natalChart.mars },
      { name: '목성', placement: natalChart.jupiter },
      { name: '토성', placement: natalChart.saturn }
    ];

    for (const t of transits) {
      for (const n of natalTargets) {
        if (!n.placement) continue;

        const signIndex = ZODIAC_SIGNS.findIndex(s => s.id === n.placement!.sign.id);
        const natalAbsDeg = signIndex * 30 + n.placement.degree;
        const diff = getAngleDifference(t.absoluteLongitude, natalAbsDeg);

        // Aspect 판정 (합 6°, 충 6°, 삼각 5°, 사각 5°, 육각 4°)
        let aspect: { type: AspectType; name: string; symbol: string; orb: number; nature: 'harmonious' | 'challenging' | 'dynamic' } | null = null;

        if (diff <= 6.0) {
          aspect = { type: 'conjunction', name: '합 (0° 컨정션)', symbol: '☌', orb: diff, nature: 'dynamic' };
        } else if (Math.abs(diff - 180) <= 6.0) {
          aspect = { type: 'opposition', name: '충 (180° 오포지션)', symbol: '☍', orb: Math.abs(diff - 180), nature: 'challenging' };
        } else if (Math.abs(diff - 120) <= 5.0) {
          aspect = { type: 'trine', name: '삼분각 (120° 트라인)', symbol: '△', orb: Math.abs(diff - 120), nature: 'harmonious' };
        } else if (Math.abs(diff - 90) <= 5.0) {
          aspect = { type: 'square', name: '사각 (90° 스퀘어)', symbol: '□', orb: Math.abs(diff - 90), nature: 'challenging' };
        } else if (Math.abs(diff - 60) <= 4.0) {
          aspect = { type: 'sextile', name: '육분각 (60° 섹스타일)', symbol: '⚹', orb: Math.abs(diff - 60), nature: 'harmonious' };
        }

        if (aspect) {
          let interp = '';
          if (aspect.nature === 'harmonious') {
            interp = `트랜짓 ${t.bodyKoName}과 내 ${n.name}이 조화로운 각도를 이루어, 자연스러운 영감과 기회가 매끄럽게 흐릅니다.`;
          } else if (aspect.nature === 'challenging') {
            interp = `트랜짓 ${t.bodyKoName}과 내 ${n.name} 사이에 긴장감이 형성되어, 성급한 결단보다 꼼꼼한 확인과 감정 조절이 필요합니다.`;
          } else {
            interp = `트랜짓 ${t.bodyKoName}과 내 ${n.name}이 강력하게 결합하여, 새로운 궤도를 개척하는 집중력과 에너지가 최고조에 달합니다.`;
          }

          activeAspects.push({
            transitBody: `트랜짓 ${t.bodyKoName}`,
            transitSymbol: t.symbol,
            aspectType: aspect.type,
            aspectKoName: aspect.name,
            symbol: aspect.symbol,
            natalTarget: `출생 ${n.name}(${n.placement.sign.name} ${n.placement.degree}°)`,
            orb: Math.round(aspect.orb * 10) / 10,
            nature: aspect.nature,
            interpretation: interp
          });
        }
      }
    }
  }

  // 아스펙트 오차(orb)가 좁은 순서대로 정렬하여 가장 강력한 상위 4개 선별
  activeAspects.sort((a, b) => a.orb - b.orb);
  const topAspects = activeAspects.slice(0, 4);

  const transitMoon = transits.find(t => t.bodyId === 'moon');
  const transitSun = transits.find(t => t.bodyId === 'sun');
  const dailyAstroTheme = `현재 태양은 [${transitSun?.sign.name || ''} ${transitSun?.degree || 0}°], 달은 [${transitMoon?.sign.name || ''} ${transitMoon?.degree || 0}°]에 머물며 [${moonPhaseName}] 위상입니다. 하늘의 주도 원소는 [${dominantTransitElement}]입니다.`;

  // -------------------------------------------------------------------------
  // 3. 동서양 융합 오늘 실시간 시간 동기화 통찰 (Integrated Synthesis)
  // -------------------------------------------------------------------------
  let headline = `[실시간 일진: ${dayPillar.koreanName}] & [달: ${transitMoon?.sign.name || ''} / ${moonPhaseName.split(' ')[0]}]`;
  let energyFlow = `사주상 ${todayTenGodInfo ? todayTenGodInfo.name : dayPillar.elementGan + ' 기운'}의 흐름과, 점성학적으로 ${dominantTransitElement} 원소가 주도하는 당일 천문 에너지가 교차합니다.`;
  let mindsetAdvice = `오늘 지금 이 순간의 일진과 행성 배치는 서두르기보다 흐름을 파악하고 중심을 잡을 때 최상의 성과를 약속합니다.`;
  let microAction = `지금 1분간 깊은 호흡을 하고, 오늘 꼭 이루고 싶은 1대 핵심 과제에 집중해 보세요.`;

  if (sajuInteractions.some(i => i.type === 'cheongan_hap' || i.type === 'yukhap')) {
    mindsetAdvice = `오늘 내 원국과 일진의 유정한 합(合)이 형성되어 있습니다. 사람들과의 대화나 협력 작업에서 탁월한 진전이 기대됩니다.`;
  } else if (sajuInteractions.some(i => i.type === 'chung')) {
    mindsetAdvice = `충(沖)의 자극이 들어오는 날입니다. 낡은 습관을 과감히 깨부수거나 새로운 방식으로 시도할 때 강한 추진력이 발휘됩니다.`;
  }

  const kstTimeLabel = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')} +09:00 (KST)`;
  const dayHourWindow =
    h >= 5 && h < 11
      ? '아침 일진 발동창 — 오늘의 일진과 달의 위상을 확인해 하루의 중심을 세우는 시간'
      : h >= 11 && h < 17
        ? '정오 시진 교차창 — 실시간 행성 트랜짓의 탄력을 실무 실행으로 옮기는 시간'
        : h >= 17 && h < 22
          ? '황혼 수렴창 — 오늘의 십신 흐름과 대인 반응을 정리하며 균형을 맞추는 시간'
          : '심야 전환창 — 하루의 리듬을 갈무리하고 내일 일진으로 부드럽게 넘어가는 시간';
  const lunarTransitTone = `${moonPhaseName} · ${dominantTransitElement} 원소 주도 흐름`;
  const situationalChronoAudit = question
    ? {
        focusTheme: `${dayPillar.koreanName} 일진 · ${moonPhaseName}`,
        transitCue: topAspects[0] ? `${topAspects[0].transitBody} ${topAspects[0].aspectKoName}` : dailyAstroTheme,
        tacticalStep: microAction,
      }
    : {
        focusTheme: `${dayPillar.koreanName} · ${hourPillar.koreanName}시`,
        transitCue: dailyEnergyTheme,
        tacticalStep: mindsetAdvice,
      };
  const chronoSynthesisMatrix = {
    coreInsight: headline,
    recommendedAction: microAction,
    cautionNotice: retrogradeBodies.length > 0 ? `역행 천체(${retrogradeBodies.join(', ')}) 영향권에서는 재확인과 여유가 필요합니다.` : '주요 행성 순행 흐름에 맞추어 차분히 실행하십시오.',
  };
  const chronoCrossAxis = `${dayPillar.koreanName} 일진 · ${hourPillar.koreanName} 시진 ↔ ${dominantTransitElement} 원소 · ${moonPhaseName}`;

  return {
    engineVersion: CHRONO_TRANSIT_VERSION,
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),
    chronoCrossAxis,
    easternPillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      todayTenGod: todayTenGodInfo,
      hourTenGod: hourTenGodInfo,
      interactions: sajuInteractions,
      dailyEnergyTheme,
      optimalHourGuide
    },
    westernTransits: {
      moonPhase: {
        angle: Math.round(moonPhaseDeg * 10) / 10,
        name: moonPhaseName,
        illuminationEstimate: illumination
      },
      transits,
      retrogradeBodies,
      dominantTransitElement,
      activeAspects: topAspects,
      dailyAstroTheme
    },
    integratedSynthesis: {
      headline,
      energyFlow,
      mindsetAdvice,
      microAction
    },
    situationalChronoAudit,
    temporalChronoRhythm: {
      kstTimeLabel,
      dayHourWindow,
      lunarTransitTone,
      temporalGuidance: `${dayHourWindow} · ${lunarTransitTone}에 맞추어 움직이십시오.`,
    },
    chronoSynthesisMatrix,
    reflectiveQuestion: question
      ? `‘${question}’ 앞에서 오늘 일진(${dayPillar.koreanName})과 달(${transitMoon?.sign.name || ''})의 리듬에 맞추어 지금 당장 옮길 첫 실행은 무엇입니까?`
      : `오늘 일진(${dayPillar.koreanName})과 ${dominantTransitElement} 원소의 트랜짓이 맞물리는 지금, 가장 먼저 정돈할 마음가짐은 무엇입니까?`,
    ritualAction: microAction,
    reflectionFocus: question
      ? `‘${question}’ 앞에서 오늘 일진(${dayPillar.koreanName})과 달(${transitMoon?.sign.name || ''})의 리듬에 맞추어 지금 당장 옮길 첫 실행은 무엇입니까?`
      : `오늘 일진(${dayPillar.koreanName})과 ${dominantTransitElement} 원소의 트랜짓이 맞물리는 지금, 가장 먼저 정돈할 마음가짐은 무엇입니까?`,
    boundaryNotice: '본 결과는 실시간 만세력 일진·시진과 천문 행성 트랜짓을 결합한 정성적 시간 리듬 안내이며, 확정적 예언이 아닙니다.',
    interpretiveBoundary: '본 결과는 실시간 만세력 일진·시진과 천문 행성 트랜짓을 결합한 정성적 시간 리듬 안내이며, 확정적 예언이 아닙니다.',
  };
}

/**
 * AI 프롬프트에 주입하기 위한 가독성 높은 구조화된 마크다운/텍스트 포맷터
 */
export function formatChronoTransitPrompt(result: ChronoTransitResult): string {
  const ep = result.easternPillars;
  const wt = result.westernTransits;
  const syn = result.integratedSynthesis;

  const retrogradeStr = wt.retrogradeBodies.length > 0
    ? wt.retrogradeBodies.join(', ')
    : '현재 주요 행성 역행 없음 (모두 순행)';

  const aspectsStr = wt.activeAspects.length > 0
    ? wt.activeAspects.map(a => `  - ${a.transitSymbol} ${a.transitBody} ${a.symbol} ${a.aspectKoName} → ${a.natalTarget} (오차 ${a.orb}°): ${a.interpretation}`).join('\n')
    : '  - 현재 출생 주요 행성과 즉각적인 강한 5대 아스펙트는 완만하게 순항 중입니다.';

  const interactionsStr = ep.interactions.length > 0
    ? ep.interactions.map(i => `  - [${i.category}] ${i.name} (${i.targetPillar}): ${i.description}`).join('\n')
    : '  - 일진과 사주 원국 간의 급격한 충이나 원진 없이 평온하고 안정된 에너지입니다.';

  const moonLightTone = wt.moonPhase.illuminationEstimate >= 75 ? '밝은 만월권' : wt.moonPhase.illuminationEstimate >= 35 ? '반월 전환권' : '고요한 신월권';

  return `[🌌 실시간 일진(日辰) & 행성 트랜짓(Transit) 실측 동기화 데이터]
======================================================================
기준 시각: ${result.calculatedAtKst} (한국 표준시) | 엔진: ${result.engineVersion}
실시간 헤드라인: ${syn.headline}
======================================================================

1. 🎴 [오늘의 사주 4주 만세력 실측 (Eastern Chrono)]
- 오늘 년주: ${ep.year.koreanName}
- 오늘 월주: ${ep.month.koreanName}
- 오늘 일진: ${ep.day.koreanName} [★ 오늘의 일진]
- 현재 시진: ${ep.hour.koreanName} [★ 지금 시각의 기운]
${ep.todayTenGod ? `- 내 일간 대비 오늘 십신: [${ep.todayTenGod.name}] (${ep.todayTenGod.category}) - ${ep.todayTenGod.desc}` : ''}
${ep.hourTenGod ? `- 현재 시진 십신: [${ep.hourTenGod.name}]` : ''}
- 일진 상호작용 및 지지합충:
${interactionsStr}
- 당일 에너지 요약: ${ep.dailyEnergyTheme}

2. 🪐 [하늘의 실시간 행성 트랜짓 실측 (Western Transit)]
- ${wt.dailyAstroTheme}
- 달 위상: ${wt.moonPhase.name} (${moonLightTone})
- 행성 역행 현황: ${retrogradeStr}
- 주요 행성 현재 배치:
  * 태양: ${wt.transits.find(t => t.bodyId === 'sun')?.sign.name} ${wt.transits.find(t => t.bodyId === 'sun')?.degree}°
  * 달: ${wt.transits.find(t => t.bodyId === 'moon')?.sign.name} ${wt.transits.find(t => t.bodyId === 'moon')?.degree}°
  * 수성: ${wt.transits.find(t => t.bodyId === 'mercury')?.sign.name} ${wt.transits.find(t => t.bodyId === 'mercury')?.degree}° ${wt.transits.find(t => t.bodyId === 'mercury')?.isRetrograde ? '(℞역행)' : ''}
  * 금성: ${wt.transits.find(t => t.bodyId === 'venus')?.sign.name} ${wt.transits.find(t => t.bodyId === 'venus')?.degree}°
  * 화성: ${wt.transits.find(t => t.bodyId === 'mars')?.sign.name} ${wt.transits.find(t => t.bodyId === 'mars')?.degree}°
  * 목성: ${wt.transits.find(t => t.bodyId === 'jupiter')?.sign.name} ${wt.transits.find(t => t.bodyId === 'jupiter')?.degree}° ${wt.transits.find(t => t.bodyId === 'jupiter')?.isRetrograde ? '(℞역행)' : ''}
  * 토성: ${wt.transits.find(t => t.bodyId === 'saturn')?.sign.name} ${wt.transits.find(t => t.bodyId === 'saturn')?.degree}° ${wt.transits.find(t => t.bodyId === 'saturn')?.isRetrograde ? '(℞역행)' : ''}
- 사용자 출생 차트와의 실시간 트랜짓 아스펙트 (Top Transit Aspects):
${aspectsStr}

3. ⚖️ [동서양 융합 오늘 실시간 행동 전략 & 시공간 리듬]
- 에너지 결합: ${syn.energyFlow}
- 마음가짐 조언: ${syn.mindsetAdvice}
- 지금 즉시 추천 액션: ${syn.microAction}
- 질문 맥락 감사 (${result.situationalChronoAudit.focusTheme}): ${result.situationalChronoAudit.transitCue}
- KST 시공간 리듬 (${result.temporalChronoRhythm.kstTimeLabel}): ${result.temporalChronoRhythm.dayHourWindow} / ${result.temporalChronoRhythm.lunarTransitTone}
- 크로노-트랜짓 교차 축: ${result.chronoCrossAxis}
- 교차 매트릭스: 핵심(${result.chronoSynthesisMatrix.coreInsight}) | 실행(${result.chronoSynthesisMatrix.recommendedAction}) | 주의(${result.chronoSynthesisMatrix.cautionNotice})
- 성찰 질문: ${result.reflectiveQuestion}
- 해석 경계: ${result.boundaryNotice}

[★ 대화 적용 절대 지침]:
사용자가 "오늘 운세 어때?", "지금 뭐 하면 좋을까?", "오늘 일진이 어때?"처럼 오늘의 흐름을 물어볼 때는 물론,
일반 상담 시에도 위 실시간 일진(간지·십신)과 행성 트랜짓(달 별자리·주요 아스펙트) 데이터를 자연스럽게 인용하여
"어제나 내일과 똑같은 뻔한 이야기"가 아니라 "현재 기준 시각(${result.temporalChronoRhythm.kstTimeLabel})의 살아 숨쉬는 통찰"로 전해줘.`;
}
