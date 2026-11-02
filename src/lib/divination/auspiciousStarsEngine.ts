/**
 * =========================================================================
 * LUCKEY 천을귀인(天乙貴人)·문창귀인 길신(吉神) 매트릭스 및 인연 매칭 엔진
 * (Auspicious Noble Stars & Resonance Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    같은 생년월일시·같은 대상 연도·같은 상대 프로필이면 항상 같은 귀인 매트릭스를 내놓는다.
 *
 * 2. 흉살(煞) 중심 신살론의 반대편: 인생을 극적으로 돕는 최고의 길신(吉神)만을 정밀 산출한다.
 *    - 천을귀인(天乙貴人): 만사형통의 최고 수호신 (갑무경→축미, 을기→자신, 병정→해유,
 *      임계→사묘, 신→인오). 일간(원칙) 및 년간 기준 원국 4주 지지와 대조하며,
 *      일지 천을(배우자궁)과 년/월/시지 천을을 분해해 위치별 의미를 나눈다.
 *    - 문창귀인(文昌貴人): 학문·총명·시험합격·창의기획 (갑사, 을오, 병무신, 정기유,
 *      경해, 신자, 임인, 계묘 — 전통 문창가요 기준).
 *    - 학당귀인(學堂貴人): 일간 십이운성 장생지(갑해, 을오, 병인, 정유, 무인, 기유,
 *      경사, 신자, 임신, 계묘) — 전문 지성·장인 학업의 길신.
 *    - 문곡귀인(文曲貴人): 상관(傷官)의 록지(갑오, 을사, 병오, 정사, 무유, 기신,
 *      경자, 신해, 임묘, 계인) — 예술·문장의 응용 지성 길신.
 *    - 천덕귀인(天德貴人): 생월(월지) 기준 하늘의 음덕 (정월정, 이월신, 삼월임, 사월신,
 *      오월해(乾), 유월갑, 칠월계, 팔월인(艮), 구월병, 시월을, 자월사(巽), 축월경).
 *    - 월덕귀인(月德貴人): 월지 삼합군 기준 재앙 소멸 (인오술월→병, 신자진월→임,
 *      해묘미월→갑, 사유축월→경).
 *
 * 3. 귀인 도래 타이밍(Noble Timing): 당해 연도 세운 지지와 대운 지지에 천을·문창 귀인
 *    글자가 들어오는 연도를 타임라인으로 산출하고, 귀인 운 도래 시 인생 레버리지
 *    (이직·계약·투자·발표·시험) 행동 가이드를 결정론적으로 붙인다.
 *
 * 4. 귀인 인연 매칭(Noble Resonance / Synastry): 내 천을귀인 글자를 상대방(가족·연인·
 *    동업자) 사주 원국이 품고 있는지, 반대로 상대방의 천을귀인 글자를 내가 품고 있는지를
 *    상호 대조해 귀인 인연 호환도를 산출한다.
 *
 * 5. 공망(空亡)·충형(沖刑) 간섭 감지: 일지 순(旬) 기준 공망 지지에 귀인이 걸리거나
 *    원국 다른 지지와 충·형을 이루면 길력(吉力)을 결정론적으로 보정(감점)한다.
 */

import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju, BRANCH_KOREAN, type SajuAnalysisResult } from '../sajuAnalysis';
import { getAstronomicalSajuYear } from '../astronomicalSolarTerms';

export const AUSPICIOUS_STARS_ENGINE_VERSION = 'LUCKEY-AS-v1.0.0';

export const AUSPICIOUS_STARS_METHOD =
  '천을(갑무경축미·을기자신·병정해유·임계사묘·신인오, 일간+년간 4주 대조, 일지/년월시지 분해)·문창(전통 가요)·학당(장생지)·문곡(상관 록지)·천덕·월덕(월지 기준) 6대 길신 매트릭스, 일지 순 공망과 충형 간섭 길력 보정, 세운·대운 지지 귀인 도래 타임라인 및 상호 귀인 인연 매칭 결정론 산출';

export type AuspiciousStarsStatus = 'calculated' | 'skipped' | 'error';

export type PillarLabel = '년주' | '월주' | '일주' | '시주';

export type NobleStarId = 'cheon_eul' | 'mun_chang' | 'hak_dang' | 'mun_gok' | 'cheon_deok' | 'wol_deok';

/** 공망·충형 간섭 1건 */
export interface NobleInterference {
  type: '공망(空亡)' | '충(沖)' | '형(刑)';
  detail: string;
  penalty: number; // 길력 감점치 (양수 = 감점)
}

/** 하나의 귀인 길신이 원국에서 실제로 발현된 기록 */
export interface AuspiciousStarHit {
  starId: NobleStarId;
  nameKr: string;
  nameHanja: string;
  meaning: string;
  /** 귀인의 산출 기준: 일간(원칙) / 년간(보조) / 월지(천덕·월덕) */
  basis: string[];
  /** 귀인 글자 (지지 또는 천간) */
  foundChar: string;
  foundCharKo: string;
  /** 발현 위치별 분해 (일지 천을 / 년·월·시지 천을 등) */
  foundPillars: Array<{ pillar: PillarLabel; full: string; note: string }>;
  interference: NobleInterference[];
  /** 간섭 보정 후 길력 등급 (1~5) */
  strengthLevel: number;
  strengthNote: string;
}

export interface NobleTimingYear {
  year: number;
  ganZhi: string;
  arrivedNobles: string[];
  source: '세운 지지' | '대운 지지' | '세운+대운 지지';
  daewoonGanZhi?: string;
  actionGuide: string;
}

export interface NobleTimingAnalysis {
  targetYear: number;
  targetYearGanZhi: string;
  currentDaewoon: string | null;
  /** 대상 연도부터 12년간의 귀인 도래 타임라인 */
  upcomingYears: NobleTimingYear[];
  /** 당해 연도 즉시 요약 */
  thisYearNobles: string[];
}

export interface NobleResonance {
  partnerSummary: {
    birthdate: string;
    dayMaster: string;
    fourPillarsText: string;
  };
  myNobleBranches: string[];
  partnerNobleBranches: string[];
  /** 상대가 나의 천을귀인 글자를 보유 */
  partnerHoldsMyNoble: boolean;
  /** 내가 상대의 천을귀인 글자를 보유 */
  iHoldPartnersNoble: boolean;
  mutual: boolean;
  resonanceScore: number; // 0~100
  foundDetails: string[];
  description: string;
}

export interface AuspiciousStarsResult {
  engineVersion: string;
  method: string;
  status: AuspiciousStarsStatus;
  note?: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  profileSummary: {
    birthdate: string;
    dayMaster: string;
    yearStem: string;
    fourPillarsText: string;
  } | null;

  /** 6대 길신 매트릭스 */
  nobleMatrix: {
    cheonEul: AuspiciousStarHit | null;
    munChang: AuspiciousStarHit | null;
    hakDang: AuspiciousStarHit | null;
    munGok: AuspiciousStarHit | null;
    cheonDeok: AuspiciousStarHit | null;
    wolDeok: AuspiciousStarHit | null;
  };
  totalNoblesFound: number;

  /** 귀인 도래 타이밍 */
  timing: NobleTimingAnalysis | null;

  /** 귀인 인연 매칭 (상대 프로필이 있을 때만) */
  resonance: NobleResonance | null;

  actionGuide: string[];
  summary: string;
}

const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 천을귀인: 일간(및 년간) -> 귀인 지지. 갑무경->축미, 을기->자신, 병정->해유, 임계->사묘, 신->인오
const CHEON_EUL_MAP: Record<string, string[]> = {
  '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
  '乙': ['子', '申'], '己': ['子', '申'],
  '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '壬': ['巳', '卯'], '癸': ['巳', '卯'],
  '辛': ['寅', '午'],
};

// 문창귀인: 전통 문창가요 (갑사 을오 병무신 정기유 경해 신자 임인 계묘)
const MUN_CHANG_MAP: Record<string, string> = {
  '甲': '巳', '乙': '午', '丙': '申', '戊': '申', '丁': '酉',
  '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯',
};

// 학당귀인: 일간 십이운성 장생지
const HAK_DANG_MAP: Record<string, string> = {
  '甲': '亥', '乙': '午', '丙': '寅', '丁': '酉', '戊': '寅',
  '己': '酉', '庚': '巳', '辛': '子', '壬': '申', '癸': '卯',
};

// 문곡귀인: 상관(傷官)의 록지
const MUN_GOK_MAP: Record<string, string> = {
  '甲': '午', '乙': '巳', '丙': '午', '丁': '巳', '戊': '酉',
  '己': '申', '庚': '子', '辛': '亥', '壬': '卯', '癸': '寅',
};

// 천덕귀인: 월지 -> 덕이 오는 천간 (오월 乾->亥, 팔월 艮->寅, 자월 巽->巳 환산)
const CHEON_DEOK_MAP: Record<string, string> = {
  '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥',
  '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙',
  '子': '巳', '丑': '庚',
};

// 월덕귀인: 월지 삼합군 -> 덕 천간
const WOL_DEOK_MAP: Record<string, string> = {
  '寅': '丙', '午': '丙', '戌': '丙',
  '申': '壬', '子': '壬', '辰': '壬',
  '亥': '甲', '卯': '甲', '未': '甲',
  '巳': '庚', '酉': '庚', '丑': '庚',
};

// 충(沖) 및 형(刑) 조합
const CHUNG_PAIRS: Array<[string, string]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];
const HYEONG_SETS: string[][] = [['子', '卯'], ['寅', '巳', '申'], ['丑', '戌', '未']];
const HYEONG_SELF = new Set(['辰', '午', '酉', '亥']);

function ganzhiIndexOf(gan: string, zhi: string): number {
  const g = STEMS_HANJA.indexOf(gan);
  const z = BRANCHES_HANJA.indexOf(zhi);
  if (g < 0 || z < 0) return -1;
  for (let n = 0; n < 60; n++) {
    if (n % 10 === g && n % 12 === z) return n;
  }
  return -1;
}

/** 일지 간지가 속한 순(旬)의 공망 지지 2개 */
function kongwangBranches(dayGan: string, dayZhi: string): string[] {
  const n = ganzhiIndexOf(dayGan, dayZhi);
  if (n < 0) return [];
  const start = n - (n % 10);
  return [BRANCHES_HANJA[(start + 10) % 12], BRANCHES_HANJA[(start + 11) % 12]];
}

function isChung(a: string, b: string): boolean {
  return CHUNG_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function isHyeong(a: string, b: string): boolean {
  if (a === b) return HYEONG_SELF.has(a);
  return HYEONG_SETS.some((set) => {
    if (!set.includes(a) || !set.includes(b)) return false;
    if (set.length === 2) return true; // 자묘형(無禮)
    return Math.abs(set.indexOf(a) - set.indexOf(b)) === 1; // 인사·사신·신인 / 축술·술미·미축
  });
}

/** 입춘 절입 경계 기준 세운 간지. 천문 계산 실패 시 민간 통용 간지식으로 대체. */
function yearGanZhiOf(year: number): string {
  try {
    const info = getAstronomicalSajuYear(new Date(Date.UTC(year, 5, 15)));
    return `${STEMS_HANJA[(((info.sajuYear - 4) % 10) + 10) % 10]}${BRANCHES_HANJA[(((info.sajuYear - 4) % 12) + 12) % 12]}`;
  } catch (_) {
    return `${STEMS_HANJA[(((year - 4) % 10) + 10) % 10]}${BRANCHES_HANJA[(((year - 4) % 12) + 12) % 12]}`;
  }
}

interface PillarRef {
  label: PillarLabel;
  gan: string;
  zhi: string;
  full: string;
}

function pillarsOf(saju: SajuAnalysisResult): PillarRef[] {
  const p = saju.pillars;
  const list: PillarRef[] = [
    { label: '년주', gan: p.year.gan, zhi: p.year.zhi, full: p.year.full },
    { label: '월주', gan: p.month.gan, zhi: p.month.zhi, full: p.month.full },
    { label: '일주', gan: p.day.gan, zhi: p.day.zhi, full: p.day.full },
  ];
  if (p.hour) {
    list.push({ label: '시주', gan: p.hour.gan, zhi: p.hour.zhi, full: p.hour.full });
  }
  return list;
}

function fourPillarsTextOf(saju: SajuAnalysisResult): string {
  const p = saju.pillars;
  return `년주(${p.year.full}) 월주(${p.month.full}) 일주(${p.day.full})${p.hour ? ` 시주(${p.hour.full})` : ''}`;
}

const NOBLE_META: Record<NobleStarId, { nameKr: string; nameHanja: string; meaning: string; baseLevel: number }> = {
  cheon_eul: { nameKr: '천을귀인', nameHanja: '天乙貴人', meaning: '모든 흉살을 무력화하고 위기마다 뜻밖의 조력자를 보내 만사형통을 이루는 최고의 수호신.', baseLevel: 5 },
  mun_chang: { nameKr: '문창귀인', nameHanja: '文昌貴人', meaning: '학문·총명·시험 합격과 창의 기획을 맡아 붓으로 천하를 호령하게 하는 길신.', baseLevel: 4 },
  hak_dang: { nameKr: '학당귀인', nameHanja: '學堂貴人', meaning: '전문 지성과 장인 기예의 학업을 이루게 하는 문창(文星)의 서당 길신.', baseLevel: 3 },
  mun_gok: { nameKr: '문곡귀인', nameHanja: '文曲貴人', meaning: '예술과 문장의 응용 지성을 열어 재주를 빛내는 길신.', baseLevel: 3 },
  cheon_deok: { nameKr: '천덕귀인', nameHanja: '天德貴人', meaning: '하늘의 음덕이 시험과 재앙을 덜어주는 자비의 길신.', baseLevel: 4 },
  wol_deok: { nameKr: '월덕귀인', nameHanja: '月德貴人', meaning: '달의 덕으로 재앙을 소멸시키고 은혜를 누리는 길신.', baseLevel: 4 },
};

/**
 * 귀인 후보 글자(지지 또는 천간)들이 원국 4주에 발현했는지 대조한다.
 * 여러 후보가 걸리면 (일지 발현 > 기둥 수) 우선순위로 가장 강한 발현을 택하고,
 * 공망·충형 간섭을 감지해 길력 등급을 보정한다.
 */
function findHit(
  starId: NobleStarId,
  basis: string[],
  targetChars: string[],
  pillars: PillarRef[],
  kongwang: string[],
): AuspiciousStarHit | null {
  const meta = NOBLE_META[starId];
  let best: AuspiciousStarHit | null = null;
  let bestScore = -1;

  for (const target of targetChars) {
    if (!target) continue;
    const isBranch = BRANCHES_HANJA.includes(target);
    const foundPillars: AuspiciousStarHit['foundPillars'] = [];
    const interference: NobleInterference[] = [];

    pillars.forEach((pl) => {
      const char = isBranch ? pl.zhi : pl.gan;
      if (char !== target) return;
      const isDayPillar = pl.label === '일주';
      const note = isBranch
        ? (isDayPillar
          ? `${pl.full} 일지 천을 — 배우자궁과 내 몸에 직결된 최강 발현`
          : `${pl.full} ${pl.label} 천을 — ${pl.label === '년주' ? '사회적 기반과 문중' : pl.label === '월주' ? '직업 환경과 커리어' : '말년과 비밀 병기'}에 든 귀인`)
        : `${pl.full} ${pl.label} 천간 발현`;
      foundPillars.push({ pillar: pl.label, full: pl.full, note });
      if (isBranch) {
        if (kongwang.includes(target)) {
          interference.push({
            type: '공망(空亡)',
            detail: `일지 순중 공망(${kongwang.map((k) => BRANCH_KOREAN[k]).join('·')})에 귀인 글자가 걸어 형식에 그치기 쉬움 — 실천적 뒷받침이 길력을 되살림`,
            penalty: 2,
          });
        }
        pillars.forEach((other) => {
          if (other === pl) return;
          if (isChung(target, other.zhi)) {
            interference.push({
              type: '충(沖)',
              detail: `${pl.full}의 귀인 글자가 ${other.full}(${BRANCH_KOREAN[other.zhi]})와 충(沖) — 귀인이 오갈 때 동요가 함께 오나 위기 전환의 동력으로 화용 가능`,
              penalty: 1,
            });
          }
          if (isHyeong(target, other.zhi)) {
            interference.push({
              type: '형(刑)',
              detail: `${pl.full}의 귀인 글자가 ${other.full}(${BRANCH_KOREAN[other.zhi]})와 형(刑) — 귀인의 도움에 절차·서류상 마찰이 붙을 수 있어 사전 준비로 해소`,
              penalty: 1,
            });
          }
        });
      }
    });

    if (foundPillars.length === 0) continue;

    const hasDayPillar = foundPillars.some((f) => f.pillar === '일주');
    const score = (hasDayPillar ? 100 : 0) + foundPillars.length;
    if (score <= bestScore) continue;
    bestScore = score;

    const penalty = Math.min(interference.reduce((s, i) => s + i.penalty, 0), 3);
    const strengthLevel = Math.max(1, meta.baseLevel - penalty);
    const strengthNote = penalty === 0
      ? '공망·충형 간섭 없는 온전한 길력 발현'
      : `간섭 보정 -${penalty}: 그래도 ${strengthLevel}등급 길력 유지`;

    best = {
      starId,
      nameKr: meta.nameKr,
      nameHanja: meta.nameHanja,
      meaning: meta.meaning,
      basis,
      foundChar: target,
      foundCharKo: isBranch ? BRANCH_KOREAN[target] : target,
      foundPillars,
      interference,
      strengthLevel,
      strengthNote,
    };
  }
  return best;
}

/** 귀인 인연 매칭 (Noble Resonance / Synastry) */
function calculateResonance(
  mySaju: SajuAnalysisResult,
  partnerSaju: SajuAnalysisResult,
  myNobleBranches: string[],
): NobleResonance {
  const myPillars = pillarsOf(mySaju);
  const partnerPillars = pillarsOf(partnerSaju);
  const partnerCheonEul = CHEON_EUL_MAP[partnerSaju.pillars.day.gan] || [];

  const foundDetails: string[] = [];
  const partnerHoldsMyNoble = myNobleBranches.some((b) =>
    partnerPillars.some((pl) => {
      if (pl.zhi !== b) return false;
      foundDetails.push(`상대가 나의 천을귀인 글자(${b}·${BRANCH_KOREAN[b]})를 ${pl.label}(${pl.full})에 보유 — 상대는 나의 귀인 인연`);
      return true;
    }),
  );
  const iHoldPartnersNoble = partnerCheonEul.some((b) =>
    myPillars.some((pl) => {
      if (pl.zhi !== b) return false;
      foundDetails.push(`내가 상대(일간 ${partnerSaju.pillars.day.gan})의 천을귀인 글자(${b}·${BRANCH_KOREAN[b]})를 ${pl.label}(${pl.full})에 보유 — 나는 상대의 귀인 인연`);
      return true;
    }),
  );

  const mutual = partnerHoldsMyNoble && iHoldPartnersNoble;
  const resonanceScore = mutual ? 100 : (partnerHoldsMyNoble || iHoldPartnersNoble) ? 70 : 40;
  const description = mutual
    ? '상호 귀인 인연(互貴人): 서로가 서로의 천을귀인 글자를 품은 최상호 공명 — 함께 있을 때 판이 선하게 좋아지는 소원형(殊原型) 인연입니다.'
    : partnerHoldsMyNoble
      ? '상대가 나의 천을귀인 글자를 품은 귀인 인연 — 이 사람 곁에서 기회와 조력이 열립니다.'
      : iHoldPartnersNoble
        ? '내가 상대의 천을귀인 글자를 품은 보호자형 인연 — 내가 상대의 귀인이 되어주는 구조입니다.'
        : '천을귀인 글자의 직접 교환은 감지되지 않았습니다. 귀인 외 인연 요소는 다른 엔진의 궁합 데이터를 참고하세요.';

  return {
    partnerSummary: {
      birthdate: partnerSaju.birthdate,
      dayMaster: `${partnerSaju.dayMaster.hanja}(${partnerSaju.dayMaster.korean})`,
      fourPillarsText: fourPillarsTextOf(partnerSaju),
    },
    myNobleBranches,
    partnerNobleBranches: partnerCheonEul,
    partnerHoldsMyNoble,
    iHoldPartnersNoble,
    mutual,
    resonanceScore,
    foundDetails,
    description,
  };
}

function buildNobleTiming(
  saju: SajuAnalysisResult,
  targetYear: number,
  timingNobles: Array<{ noble: string; branches: string[] }>,
): NobleTimingAnalysis | null {
  if (timingNobles.length === 0) return null;

  const allBranches = Array.from(new Set(timingNobles.flatMap((t) => t.branches)));
  const noblesOfBranch = (b: string) => timingNobles.filter((t) => t.branches.includes(b)).map((t) => t.noble);

  // 대운 타임라인 → 지지 기반 귀인 대운 감지
  const birthYear = Number((saju.birthdate || '').slice(0, 4));
  const timeline = saju.daewunDetail?.timeline || [];
  const nobleDaewoon = timeline
    .filter((d) => allBranches.includes(d.zhi))
    .map((d) => ({
      ganZhi: d.ganZhi,
      zhi: d.zhi,
      startYear: birthYear > 1800 ? birthYear + d.startAge - 1 : null,
      endYear: birthYear > 1800 ? birthYear + d.endAge - 1 : null,
    }));

  const currentDaewoonHit = nobleDaewoon.find(
    (d) => d.startYear !== null && targetYear >= d.startYear && targetYear <= (d.endYear ?? 0),
  );

  const upcomingYears: NobleTimingYear[] = [];
  for (let i = 0; i < 12; i++) {
    const year = targetYear + i;
    const ganZhi = yearGanZhiOf(year);
    const zhi = ganZhi.slice(1);
    const sewoonNobles = noblesOfBranch(zhi);
    const daewoonHit = nobleDaewoon.find(
      (d) => d.startYear !== null && year >= d.startYear && year <= (d.endYear ?? 0),
    );
    if (sewoonNobles.length === 0 && !daewoonHit) continue;

    const daewoonNobles = daewoonHit ? noblesOfBranch(daewoonHit.zhi) : [];
    const source: NobleTimingYear['source'] =
      sewoonNobles.length > 0 && daewoonHit ? '세운+대운 지지' : sewoonNobles.length > 0 ? '세운 지지' : '대운 지지';
    const arrivedNobles = Array.from(new Set([...sewoonNobles, ...daewoonNobles]));

    const hasCheonEul = arrivedNobles.includes('천을귀인');
    const hasMunChang = arrivedNobles.includes('문창귀인');
    let actionGuide: string;
    if (hasCheonEul && hasMunChang) {
      actionGuide = '이직·계약·투자 같은 판 전환 결정과 시험·발표·기획 도전을 한 해에 묶어 진행하기 최적입니다.';
    } else if (hasCheonEul) {
      actionGuide = '이직·계약·투자·협상 등 귀인의 조력이 필요한 대형 결정을 이 해에 배치하세요.';
    } else if (hasMunChang) {
      actionGuide = '시험·자격 취득, 발표·출간·기획안 통과 등 학문과 문서의 결실을 이 해에 거두세요.';
    } else {
      actionGuide = '귀인 대운 구간 — 10년 단위 커리어 전환·사업 확장의 축을 이 시기에 세우면 귀인의 길력이 뒷받침됩니다.';
    }

    upcomingYears.push({
      year,
      ganZhi,
      arrivedNobles,
      source,
      daewoonGanZhi: daewoonHit?.ganZhi,
      actionGuide,
    });
  }

  const targetGanZhi = yearGanZhiOf(targetYear);

  return {
    targetYear,
    targetYearGanZhi: targetGanZhi,
    currentDaewoon: currentDaewoonHit ? currentDaewoonHit.ganZhi : null,
    upcomingYears,
    thisYearNobles: noblesOfBranch(targetGanZhi.slice(1)),
  };
}

/**
 * 6대 길신 매트릭스 + 귀인 도래 타이밍 + 귀인 인연 매칭을 결정론적으로 산출합니다.
 */
export function calculateAuspiciousStars(params: {
  profile?: UserProfile | null;
  targetYear?: number;
  partnerProfile?: UserProfile | null;
}): AuspiciousStarsResult {
  const now = new Date();
  const nowUtcIso = now.toISOString();
  const nowKstIso = new Date(now.getTime() + 9 * 3600000).toISOString().replace('Z', '+09:00');
  const targetYear = params.targetYear ?? now.getFullYear();

  const base: AuspiciousStarsResult = {
    engineVersion: AUSPICIOUS_STARS_ENGINE_VERSION,
    method: AUSPICIOUS_STARS_METHOD,
    status: 'skipped',
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),
    profileSummary: null,
    nobleMatrix: { cheonEul: null, munChang: null, hakDang: null, munGok: null, cheonDeok: null, wolDeok: null },
    totalNoblesFound: 0,
    timing: null,
    resonance: null,
    actionGuide: [],
    summary: '',
  };

  try {
    if (!params.profile || !params.profile.basic?.birthdate) {
      return { ...base, note: '생년월일 미입력으로 길신 매트릭스 계산 생략' };
    }

    const saju = calculateDetailedSaju(params.profile);
    if (!saju) {
      return { ...base, status: 'error', note: '사주 원국 산출 실패로 길신 매트릭스 계산 불가' };
    }

    const pillars = pillarsOf(saju);
    const dayGan = saju.pillars.day.gan; // 일간 순수 천간 한 글자 (dayMaster.hanja는 '戊土'처럼 오행 병기)
    const yearGan = saju.pillars.year.gan;
    const monthZhi = saju.pillars.month.zhi;
    const kongwang = kongwangBranches(saju.pillars.day.gan, saju.pillars.day.zhi);

    // 1. 천을귀인: 일간(원칙) + 년간(보조) 기준
    const eulFromDay = CHEON_EUL_MAP[dayGan] || [];
    const eulFromYear = CHEON_EUL_MAP[yearGan] || [];
    const cheonEulTargets = Array.from(new Set([...eulFromDay, ...eulFromYear]));
    const cheonEulBasis = Array.from(new Set([
      '일간(원칙)',
      ...(eulFromYear.join('') !== eulFromDay.join('') ? ['년간(보조)'] : []),
    ]));
    const cheonEul = findHit('cheon_eul', cheonEulBasis, cheonEulTargets, pillars, kongwang);

    // 2. 문창귀인: 일간 기준
    const munChang = findHit('mun_chang', ['일간(원칙)'], [MUN_CHANG_MAP[dayGan]], pillars, kongwang);

    // 3. 학당귀인: 일간 장생지
    const hakDang = findHit('hak_dang', ['일간(장생지)'], [HAK_DANG_MAP[dayGan]], pillars, kongwang);

    // 4. 문곡귀인: 일간 상관 록지
    const munGok = findHit('mun_gok', ['일간(상관 록지)'], [MUN_GOK_MAP[dayGan]], pillars, kongwang);

    // 5. 천덕귀인: 월지 기준 덕 천간(및 환산 지지) 대조
    const cheonDeok = findHit('cheon_deok', [`월지(${BRANCH_KOREAN[monthZhi]}) 기준`], [CHEON_DEOK_MAP[monthZhi]], pillars, kongwang);

    // 6. 월덕귀인: 월지 삼합군 기준 덕 천간 대조
    const wolDeok = findHit('wol_deok', [`월지(${BRANCH_KOREAN[monthZhi]}) 삼합군 기준`], [WOL_DEOK_MAP[monthZhi]], pillars, kongwang);

    const nobleMatrix = { cheonEul, munChang, hakDang, munGok, cheonDeok, wolDeok };
    const hits = [cheonEul, munChang, hakDang, munGok, cheonDeok, wolDeok].filter((h): h is AuspiciousStarHit => h !== null);

    // 귀인 도래 타이밍 (세운 + 대운)
    const timingNobles: Array<{ noble: string; branches: string[] }> = [];
    const eulBranches = cheonEulTargets.filter((b) => BRANCHES_HANJA.includes(b));
    if (cheonEul && eulBranches.length > 0) timingNobles.push({ noble: '천을귀인', branches: eulBranches });
    const munChangBranch = MUN_CHANG_MAP[dayGan];
    if (munChangBranch && BRANCHES_HANJA.includes(munChangBranch)) timingNobles.push({ noble: '문창귀인', branches: [munChangBranch] });
    const timing = buildNobleTiming(saju, targetYear, timingNobles);

    // 귀인 인연 매칭
    let resonance: NobleResonance | null = null;
    if (params.partnerProfile?.basic?.birthdate) {
      const partnerSaju = calculateDetailedSaju(params.partnerProfile);
      if (partnerSaju) {
        resonance = calculateResonance(saju, partnerSaju, eulBranches);
      }
    }

    // 인생 레버리지 행동 가이드
    const actionGuide: string[] = [];
    if (cheonEul) {
      actionGuide.push(`천을귀인(${cheonEul.foundChar}·${cheonEul.foundCharKo})이 ${cheonEul.foundPillars.map((f) => f.pillar).join('·')}에 발현 — 이직·계약·투자 등 판을 바꾸는 결정과 조력자 확보에 가장 강한 레버리지가 걸립니다.`);
    }
    if (munChang) {
      actionGuide.push(`문창귀인(${munChang.foundChar}·${munChang.foundCharKo}) 발현 — 시험·자격·발표·기획·집필 등 문서와 학문의 결실을 거두기 최적입니다.`);
    }
    if (hakDang) {
      actionGuide.push(`학당귀인(${hakDang.foundChar}·${hakDang.foundCharKo}) 발현 — 전문 자격·심화 학습·장인 기예의 축적이 인생 후반 무기가 됩니다.`);
    }
    if (munGok) {
      actionGuide.push(`문곡귀인(${munGok.foundChar}·${munGok.foundCharKo}) 발현 — 예술·콘텐츠·문장으로 감각을 승화하면 대중과 공명합니다.`);
    }
    if (cheonDeok) {
      actionGuide.push(`천덕귀인(${cheonDeok.foundChar}·${cheonDeok.foundCharKo}) 발현 — 어려운 일은 음덕으로 풀리는 구조이므로, 시험·감경·분쟁 국면에서 무리한 수를 두지 않아도 좋습니다.`);
    }
    if (wolDeok) {
      actionGuide.push(`월덕귀인(${wolDeok.foundChar}·${wolDeok.foundCharKo}) 발현 — 사회적 덕망과 사람들의 호의가 재앙을 지워주는 방어판이 됩니다.`);
    }
    if (timing && timing.upcomingYears.length > 0) {
      const next = timing.upcomingYears[0];
      actionGuide.push(`가장 가까운 귀인 도래 시기는 ${next.year}년(${next.ganZhi}, ${next.source}) — ${next.actionGuide}`);
    }
    if (actionGuide.length === 0) {
      actionGuide.push('6대 길신의 원국 내 발현은 없으나, 귀인은 대운·세운이 들어오는 해마다 찾아옵니다 — 귀인 도래 타임라인을 확인하세요.');
    }

    const summary = hits.length > 0
      ? `일간 ${saju.dayMaster.hanja}(${saju.dayMaster.korean}) 원국에 ${hits.length}개 길신이 발현: ${hits.map((h) => `${h.nameKr}(${h.foundCharKo})`).join(', ')}.${resonance ? ` 귀인 인연 매칭: ${resonance.description}` : ''}`
      : `일간 ${saju.dayMaster.hanja}(${saju.dayMaster.korean}) 원국에는 6대 길신의 직접 발현이 없는 담백한 명식 — 귀인 도래 타임라인을 참고하세요.`;

    return {
      ...base,
      status: 'calculated',
      profileSummary: {
        birthdate: saju.birthdate,
        dayMaster: `${saju.dayMaster.hanja}(${saju.dayMaster.korean})`,
        yearStem: yearGan,
        fourPillarsText: fourPillarsTextOf(saju),
      },
      nobleMatrix,
      totalNoblesFound: hits.length,
      timing,
      resonance,
      actionGuide,
      summary,
    };
  } catch (err: any) {
    return { ...base, status: 'error', note: err?.message || '길신 매트릭스 계산 오류' };
  }
}

/**
 * 길신 매트릭스 리포트를 LLM 마스터 프롬프트에 주입하기 위한 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatAuspiciousStarsPrompt(res: AuspiciousStarsResult): string {
  if (res.status !== 'calculated' || !res.profileSummary) {
    return `[🌟 천을귀인·길신 매트릭스 (Auspicious Noble Stars)] — ${res.note || '계산 생략'}`;
  }

  const matrixLines = (Object.entries(res.nobleMatrix) as Array<[string, AuspiciousStarHit | null]>)
    .map(([key, hit]) => {
      if (!hit) return `   - ${key}: 미발현`;
      const inter = hit.interference.length > 0
        ? ` | 간섭: ${hit.interference.map((i) => `${i.type}(${i.penalty}점 감점)`).join(', ')}`
        : ' | 간섭 없음';
      const pillarsTxt = hit.foundPillars.map((f) => `${f.full} ${f.pillar}`).join(', ');
      return `   - ${hit.nameKr}(${hit.nameHanja}) [${hit.foundChar}·${hit.foundCharKo}] 길력 ${hit.strengthLevel}/5: ${pillarsTxt} 기준(${hit.basis.join('/')})${inter} — ${hit.meaning}`;
    })
    .join('\n');

  const timingTxt = res.timing
    ? [
        `   - 당해 연도(${res.timing.targetYear}년 ${res.timing.targetYearGanZhi}년): ${res.timing.thisYearNobles.length > 0 ? `${res.timing.thisYearNobles.join('·')} 도래` : '귀인 글자 미도래 (대운 확인 필요)'}`,
        res.timing.currentDaewoon
          ? `   - 현재 귀인 대운: ${res.timing.currentDaewoon}대운 (10년 단위 귀인 길력 구간)`
          : '   - 현재 구간은 귀인 대운 아님',
        '   - 향후 귀인 도래 타임라인:',
        ...(res.timing.upcomingYears.length > 0
          ? res.timing.upcomingYears.map((y) => `     · ${y.year}년(${y.ganZhi}) ${y.source}: ${y.arrivedNobles.join('·')} — ${y.actionGuide}`)
          : ['     · 향후 12년 내 세운·대운 지지 귀인 도래 없음']),
      ].join('\n')
    : '   - 귀인 도래 타이밍 산출 조건 미충족';

  const resonanceTxt = res.resonance
    ? [
        `   - 상대 원국: ${res.resonance.partnerSummary.fourPillarsText} (일간 ${res.resonance.partnerSummary.dayMaster})`,
        `   - 상호 귀인 보유: 상대가 내 귀인 보유=${res.resonance.partnerHoldsMyNoble ? 'O' : 'X'} / 내가 상대 귀인 보유=${res.resonance.iHoldPartnersNoble ? 'O' : 'X'} | 공명 점수 ${res.resonance.resonanceScore}/100`,
        ...(res.resonance.foundDetails.length > 0 ? res.resonance.foundDetails.map((d) => `   · ${d}`) : []),
        `   - 종합: ${res.resonance.description}`,
      ].join('\n')
    : '   - 상대 프로필 미제공으로 인연 매칭 생략';

  return `[🌟 천을귀인·문창 길신(吉神) 매트릭스 및 인연 매칭 실측 데이터 (Auspicious Noble Stars & Resonance Core)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 명식: ${res.profileSummary.fourPillarsText}
일간: ${res.profileSummary.dayMaster} | 년간: ${res.profileSummary.yearStem}
발현 길신: ${res.totalNoblesFound}개 | 산출 시각: ${res.calculatedAtKst}
======================================================================
1. [6대 길신 매트릭스 — 원국 발현]:
${matrixLines}

2. [귀인 도래 타이밍 (Noble Timing)]:
${timingTxt}

3. [귀인 인연 매칭 (Noble Resonance / Synastry)]:
${resonanceTxt}

4. [인생 레버리지 행동 가이드]:
${res.actionGuide.map((a, i) => `   ${i + 1}. ${a}`).join('\n')}

종합: ${res.summary}
======================================================================
[★ 루시 길신 상담 지침]:
- 위 데이터는 결정론 엔진(${res.engineVersion})의 100% 수리 산출입니다. 길신의 위치(일지 천을 = 내 몸과 배우자궁, 년/월/시지 천을 = 사회·직업·말년)를 구분해 해석하세요.
- 공망·충형 간섭이 감지된 길신은 "귀인이 있으나 스스로의 준비가 길력을 살린다"는 방향으로 균형 있게 안내하고, 과장 없이 발현 등급(1~5)에 맞춰 들려주세요.
- 귀인 도래 타임라인의 해를 사용자의 구체적 레버리지(이직, 계약, 투자, 발표, 시험)에 대입해 실행 로드맵으로 제안하세요.`;
}
