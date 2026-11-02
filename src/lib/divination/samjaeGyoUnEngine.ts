/**
 * =========================================================================
 * LUCKEY 삼재(三災)·대운 교운기(交運期) 인생 환절기 감지 결정론적 엔진
 * (Samjae & GyoUn Transition Intelligence Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    같은 생년월일시·같은 대상 연도면 항상 같은 삼재 판정과 교운기 타이밍을 내놓는다.
 *
 * 2. 삼재(三災) 판정은 사주 원국 년지(생년 띠, 입춘 절입 경계)의 삼합(三合)군 기준.
 *    - 신자진(申子辰·원숭이/쥐/용)띠  : 인묘진(寅卯辰·호랑이/토끼/용) 해가 삼재
 *    - 사유축(巳酉丑·뱀/닭/소)띠      : 해자축(亥子丑·돼지/쥐/소) 해가 삼재
 *    - 인오술(寅午戌·호랑이/말/개)띠  : 신유술(申酉戌·원숭이/닭/개) 해가 삼재
 *    - 해묘미(亥卯未·돼지/토끼/양)띠  : 사오미(巳午未·뱀/말/양) 해가 삼재
 *    삼합군의 묘지(墓庫·네 번째 지지)를 앵커로 삼아 앵커-2(들삼재)·앵커-1(눌삼재)·
 *    앵커(날삼재) 3개 연도를 정확히 구분한다. (2022 임인년 쥐·원숭이·용띠 들삼재,
 *    2025 을사년 돼지·토끼·양띠 들삼재 등 공표 삼재표와 일치)
 *
 * 3. 삼재 등급화(럭키 삼재 등급 산법 — 본 엔진의 정의 산법):
 *    삼재년 지지가 사주 원국 4주 지지와 이루는 충(沖)·형(刑)·파(破)·해(害)·육합(六合)과,
 *    삼재년 지지 오행이 용신(用神)·희신(喜神)·기신(忌神) 중 무엇인지를 합산해
 *    복삼재(福三災·길신/용신 조화) / 평삼재(平三災) / 악삼재(惡三災·기신/충형파해 중첩)로 나눈다.
 *    - 용신·희신 오행 조화 -2, 육합 -1, 파·해 +1, 충·형 +2, 기신 오행 +2.
 *    - 누적 점수 <= -2 복삼재, >= +3 악삼재, 그 외 평삼재.
 *    등급에 따라 오행 바이오웰니스 처방(보할 오행·피할 오행·식품·컬러·활동·방위)을 결정론적으로 산출한다.
 *
 * 4. 교운기(交運期) 판정은 대운수(大運數) 산법(3일=1년, 1일=4개월, 1시간=5일)으로 만든
 *    8대 대운 타임라인의 교체 나이 기준. 교체 시점 전후 1~2년을 교운기로 감지하고
 *    (교체 2년 전 D-2 조정기 → 1년 전 D-1 → 교체 당해년도 대환절기 → 교체 직후 +1 안착기),
 *    진입까지 남은 햇수와 월수는 교체 연도의 입춘(立春) 절입 시각 기준으로 정밀 계산한다.
 *
 * 5. 바뀌는 대운의 십성(十星) 카테고리 전환(비겁/식상/재성/관성/인성)과 오행 에너지 변화를
 *    리스크 서사 + 심리적 완충 가이드로 산출한다. (예: 식상운 -> 관성운 전환 시 커리어
 *    심리적 충격 완충 가이드). 현재 대운과 다음 대운의 지지 계절(인묘진 봄 → 사오미 여름 등)이
 *    다르면 접목운(接木運)·계절 대운 환절기로 감지한다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  BRANCH_ELEMENT,
  type FiveElement,
} from '../sajuAnalysis';
import {
  getAstronomicalSajuYear,
  getYearSolarTerms,
} from '../astronomicalSolarTerms';

export const SAMJAE_GYOUN_ENGINE_VERSION = 'LUCKEY-SG-v1.0.0';

export const SAMJAE_GYOUN_METHOD =
  '삼합(三合) 묘지 앵커 삼재 산법: 입춘 원국 년지 띠의 삼합군 기준 들·눌·날 3개년 판정, 원국 4주 충형파해·육합과 용신·희신·기신 오행 조화의 복·평·악 등급화, 대운수 8대 타임라인 교체 나이 전후 1~2년 교운기 감지 및 십성·계절(접목운) 전환 완충 처방 결정론 산출';

export type SamjaeStatus = 'calculated' | 'skipped' | 'error';

export type SamjaePhase = '들삼재(入三災)' | '눌삼재(臥三災)' | '날삼재(出三災)';

export type SamjaeGrade = '복삼재(福三災)' | '평삼재(平三災)' | '악삼재(惡三災)';

export type GyoUnWindowType =
  | '교체 전 조정기 (D-2)'
  | '교체 전 조정기 (D-1)'
  | '교체 당해년도 (대환절기·판도 대전환)'
  | '교체 직후 안착기 (+1)';

export type SeasonCategory = '봄' | '여름' | '가을' | '겨울';

export interface SamjaeYearInfo {
  year: number;
  branchHanja: string;
  branchKo: string;
  phase: SamjaePhase;
}

export interface SamjaeInteraction {
  type: '충(沖)' | '형(刑)' | '파(破)' | '해(害)' | '육합(六合)';
  targetPillar: string;
  targetBranchKo: string;
  detail: string;
}

export interface SamjaeWellnessPrescription {
  reinforceElement: FiveElement;
  reinforceSummary: string;
  avoidElement?: FiveElement;
  avoidSummary?: string;
  foods: string[];
  colors: string[];
  activities: string[];
  direction: string;
  routine: string;
}

export interface SamjaeAnalysis {
  isSamjaeYear: boolean;
  phase: SamjaePhase | null;
  sanHapGroup: string | null;
  birthBranch: { hanja: string; ko: string; animal: string } | null;
  samjaeBranch: { hanja: string; ko: string; animal: string } | null;
  targetYearGanZhi: string;
  threeYearArc: SamjaeYearInfo[];
  grade: SamjaeGrade | null;
  gradeScore: number;
  gradeReason: string;
  interactions: SamjaeInteraction[];
  wellnessPrescription: SamjaeWellnessPrescription | null;
}

export interface GyoUnDaewoonSnapshot {
  order: number;
  ganZhi: string;
  koreanName: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  tenGodGan: string;
  tenGodCategory: string;
  zhiSeason: SeasonCategory;
  zhiElement: FiveElement;
}

export interface TenGodShift {
  from: string;
  to: string;
  riskNarrative: string;
  cushionGuide: string;
}

export interface SeasonShift {
  from: SeasonCategory;
  to: SeasonCategory;
  isJeopmokUn: boolean;
  description: string;
}

export interface GyoUnAnalysis {
  isGyoUnPeriod: boolean;
  note?: string;
  windowType: GyoUnWindowType | null;
  yearsUntilSwitch: number | null;
  monthsUntilSwitch: number | null;
  switchYear: number | null;
  currentDaewoon: GyoUnDaewoonSnapshot | null;
  nextDaewoon: GyoUnDaewoonSnapshot | null;
  tenGodShift: TenGodShift | null;
  seasonShift: SeasonShift | null;
  riskBufferAdvice: string;
  opportunityTiming: string;
}

export interface SamjaeGyoUnResult {
  status: SamjaeStatus;
  note?: string;
  engineVersion: string;
  method: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;
  targetYear: number;
  birthYear: number;
  targetKoreanAge: number;
  headline: string;
  samjae: SamjaeAnalysis;
  gyoUn: GyoUnAnalysis;
}

// ---------------------------------------------------------------------------
// 지지 기본 표기
// ---------------------------------------------------------------------------

const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const BRANCH_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

/** 삼합군: 소속 띠와 묘지(墓庫) 앵커. 삼재년은 앵커-2(들)·앵커-1(눌)·앵커(날). */
const SAN_HAP_GROUPS: Array<{ label: string; members: number[]; anchor: number; samjaeLabel: string }> = [
  { label: '신자진(申子辰)', members: [8, 0, 4], anchor: 4, samjaeLabel: '인묘진(寅卯辰)' },
  { label: '사유축(巳酉丑)', members: [5, 9, 1], anchor: 1, samjaeLabel: '해자축(亥子丑)' },
  { label: '인오술(寅午戌)', members: [2, 6, 10], anchor: 10, samjaeLabel: '신유술(申酉戌)' },
  { label: '해묘미(亥卯未)', members: [11, 3, 7], anchor: 7, samjaeLabel: '사오미(巳午未)' },
];

const CHASH_SETS: Array<[number, number]> = [
  [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
];
const HYEONG_SETS: number[][] = [
  [2, 5, 8], [1, 10, 7], [0, 3],
];
const PA_SETS: Array<[number, number]> = [
  [0, 9], [1, 4], [2, 11], [3, 6], [5, 8], [7, 10],
];
const HAE_SETS: Array<[number, number]> = [
  [0, 7], [1, 6], [2, 10], [3, 4], [5, 8], [8, 11], [9, 10], [1, 7],
];
const YUK_HAP_SETS: Array<[number, number]> = [
  [0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7],
];

/** 지지 → 계절(인묘진 봄, 사오미 여름, 신유술 가을, 해자축 겨울) */
function branchSeason(branchIdx: number): SeasonCategory {
  if (branchIdx === 2 || branchIdx === 3 || branchIdx === 4) return '봄';
  if (branchIdx === 5 || branchIdx === 6 || branchIdx === 7) return '여름';
  if (branchIdx === 8 || branchIdx === 9 || branchIdx === 10) return '가을';
  return '겨울';
}

/** 연도 → 입춘 절입 경계 기준 세운 간지(병오 2026 등). 천문 절기 계산 실패 시 민간 통용 간지식으로 대체. */
function yearGanZhiOf(year: number): string {
  const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  try {
    const probe = new Date(Date.UTC(year, 5, 15, 12, 0, 0));
    const info = getAstronomicalSajuYear(probe);
    return `${STEMS_HANJA[(((info.sajuYear - 4) % 10) + 10) % 10]}${BRANCHES_HANJA[(((info.sajuYear - 4) % 12) + 12) % 12]}`;
  } catch (_) {
    return `${STEMS_HANJA[(((year - 4) % 10) + 10) % 10]}${BRANCHES_HANJA[(((year - 4) % 12) + 12) % 12]}`;
  }
}

/** 대상 지지 색인이 등장하는 첫 연도(검색 시작 연도 이후). 입춘 경계 세운은 민간 통용 간지식(연도-4)/12 기준으로 판정한다. */
function nextYearOfBranch(branchIdx: number, fromYear: number): number {
  const offset = (((branchIdx - (((fromYear - 4) % 12) + 12) % 12) % 12) + 12) % 12;
  return fromYear + offset;
}

// ---------------------------------------------------------------------------
// 삼재 등급 산법 (럭키 삼재 등급 — 본 엔진 정의)
// ---------------------------------------------------------------------------

const TEN_GOD_CATEGORY: Record<string, string> = {
  비견: '비겁', 겁재: '비겁',
  식신: '식상', 상관: '식상',
  정재: '재성', 편재: '재성',
  정관: '관성', 편관: '관성',
  정인: '인성', 편인: '인성',
};

function analyzeSamjae(
  birthBranchIdx: number,
  pillars: { label: string; zhi: string; zhiKo: string }[],
  yongsinEl: FiveElement | undefined,
  heeshinEl: FiveElement | undefined,
  gisinEl: FiveElement | undefined,
  targetYear: number,
): SamjaeAnalysis {
  const group = SAN_HAP_GROUPS.find((g) => g.members.includes(birthBranchIdx));
  const anchor = group!.anchor;
  const samjaeBranches = [(((anchor - 2) % 12) + 12) % 12, (((anchor - 1) % 12) + 12) % 12, anchor];
  const PHASES: SamjaePhase[] = ['들삼재(入三災)', '눌삼재(臥三災)', '날삼재(出三災)'];

  // 들삼재 연도 = 삼재 첫 지지(앵커-2)가 실제로 돌아오는 연도.
  // 당해년도가 삼재면 직전 들삼재 연도에서 위상(들·눌·날)을 판정하고,
  // 삼재가 아니면 다가오는 들삼재부터의 3개년 궤적을 보여준다.
  const pastInYear = nextYearOfBranch(samjaeBranches[0], targetYear - 3);
  const phaseOffset = targetYear - pastInYear;
  const isSamjaeYear = phaseOffset >= 0 && phaseOffset <= 2;
  const inYear = isSamjaeYear ? pastInYear : nextYearOfBranch(samjaeBranches[0], targetYear + 1);
  const phase = isSamjaeYear ? PHASES[phaseOffset] : null;
  const samjaeBranchIdx = isSamjaeYear ? samjaeBranches[phaseOffset] : null;

  const threeYearArc: SamjaeYearInfo[] = samjaeBranches.map((b, i) => {
    const y = inYear + i;
    return {
      year: y,
      branchHanja: BRANCHES_HANJA[b],
      branchKo: BRANCHES_KO[b],
      phase: PHASES[i],
    };
  });

  // 등급 산법: 충형파해·육합 + 용신·희신·기신 오행 조화
  let score = 0;
  const reasons: string[] = [];
  const interactions: SamjaeInteraction[] = [];

  if (samjaeBranchIdx !== null) {
    const sHanja = BRANCHES_HANJA[samjaeBranchIdx];
    const sKo = BRANCHES_KO[samjaeBranchIdx];
    const sEl = BRANCH_ELEMENT[sHanja];

    for (const pillar of pillars) {
      const pIdx = BRANCHES_HANJA.indexOf(pillar.zhi);
      if (pIdx < 0) continue;
      const pair = (a: number, b: number) => a === samjaeBranchIdx && b === pIdx;
      const rel = (sets: Array<[number, number]>) =>
        sets.some(([a, b]) => pair(a, b) || pair(b, a));
      const inHyeng = HYEONG_SETS.some(
        (set) => set.includes(samjaeBranchIdx) && set.includes(pIdx),
      );

      if (rel(CHASH_SETS)) {
        score += 2;
        interactions.push({
          type: '충(沖)',
          targetPillar: pillar.label,
          targetBranchKo: pillar.zhiKo,
          detail: `삼재년 지지 ${sKo}(${sHanja})가 원국 ${pillar.label}지 ${pillar.zhiKo}와 정면충돌(대충). 삼재 기운이 원국을 직접 흔든다.`,
        });
      } else if (inHyeng) {
        score += 2;
        interactions.push({
          type: '형(刑)',
          targetPillar: pillar.label,
          targetBranchKo: pillar.zhiKo,
          detail: `삼재년 지지 ${sKo}(${sHanja})가 원국 ${pillar.label}지 ${pillar.zhiKo}와 삼형(刑) 관계. 삼재 기운이 비틀린 형태로 갉아먹는다.`,
        });
      } else if (rel(PA_SETS)) {
        score += 1;
        interactions.push({
          type: '파(破)',
          targetPillar: pillar.label,
          targetBranchKo: pillar.zhiKo,
          detail: `삼재년 지지 ${sKo}(${sHanja})가 원국 ${pillar.label}지 ${pillar.zhiKo}와 파(破) 관계. 계획이 삼재 기간에 뚫리지 않게 이중 확인이 필요하다.`,
        });
      } else if (rel(HAE_SETS)) {
        score += 1;
        interactions.push({
          type: '해(害)',
          targetPillar: pillar.label,
          targetBranchKo: pillar.zhiKo,
          detail: `삼재년 지지 ${sKo}(${sHanja})가 원국 ${pillar.label}지 ${pillar.zhiKo}와 해(害) 관계. 믿었던 관계·약속이 삼재 기간에 상처 입지 않게 주의.`,
        });
      } else if (rel(YUK_HAP_SETS)) {
        score -= 1;
        interactions.push({
          type: '육합(六合)',
          targetPillar: pillar.label,
          targetBranchKo: pillar.zhiKo,
          detail: `삼재년 지지 ${sKo}(${sHanja})가 원국 ${pillar.label}지 ${pillar.zhiKo}와 육합으로 맞물려 삼재 기운을 부드럽게 흡수한다.`,
        });
      }
    }

    if (yongsinEl && sEl === yongsinEl) {
      score -= 2;
      reasons.push(`삼재년 지지 ${sKo}의 오행(${sEl})이 용신(用神)과 일치 — 삼재라고 부르기 어려운 용신 조화의 해.`);
    } else if (heeshinEl && sEl === heeshinEl) {
      score -= 2;
      reasons.push(`삼재년 지지 ${sKo}의 오행(${sEl})이 희신(喜神)과 일치 — 삼재 기운이 오히려 도움이 되는 해.`);
    } else if (gisinEl && sEl === gisinEl) {
      score += 2;
      reasons.push(`삼재년 지지 ${sKo}의 오행(${sEl})이 기신(忌神)과 일치 — 삼재의 부담이 오행적으로도 증폭되는 해.`);
    }
  }

  let grade: SamjaeGrade = '평삼재(平三災)';
  if (isSamjaeYear) {
    if (score >= 3) grade = '악삼재(惡三災)';
    else if (score <= -2) grade = '복삼재(福三災)';
  }

  const gradeReason = !isSamjaeYear
    ? ''
    : score >= 3
    ? `충형파해 중첩과 기신 조화가 합산 ${score}점 — 악삼재(惡三災) 등급. 원국이 삼재 기운을 정면으로 받아 리스크 완충이 최우선입니다. ${reasons.join(' ')}`
    : score <= -2
    ? `용신·희신 조화와 육합이 합산 ${score}점 — 복삼재(福三災) 등급. 명목상 삼재이지만 실제로는 길신이 섞인 기회의 환절기입니다. ${reasons.join(' ')}`
    : `산출 점수 ${score}점 — 평삼재(平三災) 등급. 무리한 확장만 피하면 통상적 삼재 관리로 충분합니다. ${reasons.join(' ')}`;

  const prescription = isSamjaeYear ? buildWellnessPrescription(yongsinEl, heeshinEl, gisinEl) : null;

  return {
    isSamjaeYear,
    phase,
    sanHapGroup: group ? `${group.label} 삼합군 (삼재년: ${group.samjaeLabel})` : null,
    birthBranch: {
      hanja: BRANCHES_HANJA[birthBranchIdx],
      ko: BRANCHES_KO[birthBranchIdx],
      animal: BRANCH_ANIMALS[birthBranchIdx],
    },
    samjaeBranch: samjaeBranchIdx !== null
      ? {
          hanja: BRANCHES_HANJA[samjaeBranchIdx],
          ko: BRANCHES_KO[samjaeBranchIdx],
          animal: BRANCH_ANIMALS[samjaeBranchIdx],
        }
      : null,
    targetYearGanZhi: yearGanZhiOf(targetYear),
    threeYearArc,
    grade,
    gradeScore: score,
    gradeReason,
    interactions,
    wellnessPrescription: prescription,
  };
}

// ---------------------------------------------------------------------------
// 오행 바이오웰니스 처방
// ---------------------------------------------------------------------------

const ELEMENT_WELLNESS: Record<FiveElement, {
  summary: string;
  foods: string[];
  colors: string[];
  activities: string[];
  direction: string;
  routine: string;
}> = {
  목: {
    summary: '목(木) 기운 보충 — 간과 근육, 새싹의 확장 에너지',
    foods: ['청홍색 채소와 새싹채(시금치·브로콜리·새싹보리)', '신맛 과일(청포도·매실·키위)', '허브차(페퍼민트·로즈마리)'],
    colors: ['청록', '초록', '연두'],
    activities: ['아침 공원 산책과 기지개 스트레칭', '숲속 호흡 명상(산림욕)', '새 공부·새 프로젝트의 첫 단추 끼우기'],
    direction: '동쪽',
    routine: '아침에 창문을 열어 동쪽 빛을 받고 몸을 펴는 5분 루틴',
  },
  화: {
    summary: '화(火) 기운 보충 — 심장과 활력, 빛의 온기 에너지',
    foods: ['붉은 식품(토마토·대추·고추·딸기)', '따뜻한 국물 요리', '카페인은 오전 소량만'],
    colors: ['빨강', '오렌지', '핫핑크'],
    activities: ['오전 햇빛 20분 쬐기', '가벼운 유산소(빠른 걷기·자전거)', '따뜻한 인간관계 약속 만들기'],
    direction: '남쪽',
    routine: '오전 햇빛 노출 후 하루를 여는 루틴',
  },
  토: {
    summary: '토(土) 기운 보충 — 비장과 안정, 대지의 접지 에너지',
    foods: ['노란 곡물과 뿌리채소(단호박·고구마·연근)', '발효식품(된장·청국장)', '정제당 줄이기'],
    colors: ['노랑', '베이지', '갈색'],
    activities: ['흙 접지 활동(텃밭·등산·가드닝)', '방과 서재 정리정돈', '일정·재무의 구조화'],
    direction: '중앙과 남서쪽',
    routine: '자기 전 하루를 정리하는 저널링 루틴',
  },
  금: {
    summary: '금(金) 기운 보충 — 폐와 호흡, 맑은 결정의 에너지',
    foods: ['흰 식품(도라지·배·무·연근·견과)', '맑은 차(배즙·도라지차)', '자극적인 매운맛 줄이기'],
    colors: ['흰색', '은색', '연회색'],
    activities: ['복식 호흡과 필라테스', '호흡 명상(4-7-8 호흡)', '물건 정리와 미니멀라이즈'],
    direction: '서쪽',
    routine: '아침저녁 깊은 호흡 10회 루틴',
  },
  수: {
    summary: '수(水) 기운 보충 — 신장과 수면, 흐름의 축적 에너지',
    foods: ['검정 식품(검은콩·검은깨·해조류·생선)', '충분한 물과 온탕', '과도한 염분 줄이기'],
    colors: ['검정', '남색', '짙은 파랑'],
    activities: ['수영·온욕·족욕', '수면 회복 루틴(자기 전 스크린 끄기)', '명상과 배움의 저장'],
    direction: '북쪽',
    routine: '일정한 취침 시간 지키는 수면 루틴',
  },
};

function buildWellnessPrescription(
  yongsinEl: FiveElement | undefined,
  heeshinEl: FiveElement | undefined,
  gisinEl: FiveElement | undefined,
): SamjaeWellnessPrescription {
  const reinforce = yongsinEl ?? heeshinEl ?? '토';
  const base = ELEMENT_WELLNESS[reinforce];
  const prescription: SamjaeWellnessPrescription = {
    reinforceElement: reinforce,
    reinforceSummary: `삼재 기간에는 내 사주를 지탱하는 ${ELEMENT_DETAILS_KO(reinforce)} 기운을 보강하는 것이 원칙입니다. ${base.summary}.`,
    foods: base.foods,
    colors: base.colors,
    activities: base.activities,
    direction: base.direction,
    routine: base.routine,
  };
  if (gisinEl) {
    const avoid = ELEMENT_WELLNESS[gisinEl];
    prescription.avoidElement = gisinEl;
    prescription.avoidSummary = `기신(忌神)인 ${ELEMENT_DETAILS_KO(gisinEl)} 기운의 과잉 노출(과식·과열·과소비)은 삼재 기간에 피하고, 대신 ${ELEMENT_DETAILS_KO(reinforce)} 기운으로 균형을 잡습니다.`;
  }
  return prescription;
}

function ELEMENT_DETAILS_KO(el: FiveElement): string {
  const MAP: Record<FiveElement, string> = {
    목: '목(木·나무)',
    화: '화(火·불)',
    토: '토(土·흙)',
    금: '금(金·쇠)',
    수: '수(水·물)',
  };
  return MAP[el];
}

// ---------------------------------------------------------------------------
// 교운기(交運期) 산법
// ---------------------------------------------------------------------------

const SEASON_FLOW: Record<SeasonCategory, string> = {
  봄: '인묘진(寅卯辰)의 봄 — 맹아와 확장의 목 기운',
  여름: '사오미(巳午未)의 여름 — 개화와 연소의 화 기운',
  가을: '신유술(申酉戌)의 가을 — 수렴과 결실의 금 기운',
  겨울: '해자축(亥子丑)의 겨울 — 침전과 축적의 수 기운',
};

const TEN_GOD_SHIFT_GUIDE: Record<string, { risk: string; cushion: string }> = {
  '비겁->식상': {
    risk: '주체성이 표현·확산 에너지로 분출되며 산만해지고 이니셜이 흩어질 수 있습니다.',
    cushion: '아이디어를 바로 내보내지 말고 기록·검증 후 단계적으로 공개하세요. 창작·발표 통로를 정기 슬롯으로 확보하면 에너지가 성과로 정렬됩니다.',
  },
  '비겁->재성': {
    risk: '경쟁하던 주체성이 목표(재물)를 향해 직행하며 성급한 확장·투자·동업 유혹이 커집니다.',
    cushion: '확장 전손(先損後益) 원칙: 투입 상한선을 미리 정하고 실속과 현금흐름을 우선 검증하세요.',
  },
  '비겁->관성': {
    risk: '자립 지향 에너지가 규범·책임 에너지와 마찰을 일으켜 조직·상대방과의 갈등이 쉽게 격화됩니다.',
    cushion: '규칙은 정면 대결이 아니라 협상 카드로 다루세요. 즉각 반발보다 기록·절차를 활용하면 주도권이 남습니다.',
  },
  '비겁->인성': {
    risk: '자립 충동이 수용·학습 모드로 접히며 템포가 급격히 느껴질 수 있습니다.',
    cushion: '이 전환은 재충전의 선물입니다. 배움과 자격, 멘토링에 힘을 실으면 다음 대운의 밑천이 됩니다.',
  },
  '식상->비겁': {
    risk: '표현·창작 에너지가 주체성으로 회수되며 협업보다 고집이 강해질 수 있습니다.',
    cushion: '내 이름으로 책임지는 구조(독립·소유·결재권)를 만들어 표현 에너지의 착지점을 확보하세요.',
  },
  '식상->재성': {
    risk: '아이디어가 현금화되는 최상 흐름이지만, 과잉 생산·과잉 판매로 품질과 체력이 소모될 수 있습니다.',
    cushion: '단계적 수익화와 스케줄 캡을 걸어 에너지를 지키세요. 이른바 일식(日食) 없이 수확하는 리듬이 핵심입니다.',
  },
  '식상->관성': {
    risk: '자유로운 표현·창작 에너지(식상)가 규율·압박 에너지(관성)와 정면충돌하는 대표적 커리어 환절기입니다. 조직에 갇힌 느낌, 반발심, 상사·규칙에 대한 저항이 커지고 심리적 충격이 유독 큽니다.',
    cushion: '① 표현 통로를 조직 밖(개인 채널·창작·학습)에 별도로 확보해 압박을 분산시키고, ② 조직의 요구는 단계적으로 수용하며 반발심의 즉각적 발화(충동적 사직·대립 발언)를 48시간 유예하고, ③ 식상의 창의성을 관성이 인정하는 형식(보고·문서·실적)으로 포장해 전환의 충격을 완충하세요.',
  },
  '식상->인성': {
    risk: '산출 모드에서 흡수 모드로 급전환되며 성과 정체를 불안해할 수 있습니다.',
    cushion: '이 시기의 생산성은 배움의 질로 측정됩니다. 공부·연구·수련으로 회귀하면 다음 전환에서 크게 앞섭니다.',
  },
  '재성->비겁': {
    risk: '돈과 기회가 사람·경쟁으로 흩어지며 지출 파트너·경쟁자가 늘어납니다.',
    cushion: '파트너십 조건(지분·역할·정산)을 문서로 명확히 하세요. 흩어짐은 구조로 막습니다.',
  },
  '재성->식상': {
    risk: '자산이 콘텐츠·연구·육아 같은 생산적 지출로 전환되며 현금이 빠져나갑니다.',
    cushion: '지출을 투자 항목으로 명명하고 회수 계획(포트폴리오·성과 지표)을 함께 세우세요.',
  },
  '재성->관성': {
    risk: '자산이 책임·부담(대출·세금·보증)으로 변환되는 구간입니다.',
    cushion: '신규 부채를 최소화하고 보전(보험·비상금)을 우선하세요. 지키는 재테크가 최고의 수익입니다.',
  },
  '재성->인성': {
    risk: '실물·현금 중심의 관심이 무형 자산(지식·자격·명예)으로 이동하며 즉시 성과가 보기 어렵습니다.',
    cushion: '문서·계약·자격으로 자산을 재구성하면 다음 대운에서 강한 기반이 됩니다.',
  },
  '관성->비겁': {
    risk: '긴장이 풀리며 통제가 느슨해지고, 해방감이 무계획 확산으로 이어질 수 있습니다.',
    cushion: '해방된 에너지를 자율 프로젝트·독립 준비의 연료로 의도적으로 배치하세요.',
  },
  '관성->식상': {
    risk: '규율이 풀리며 표현이 터지지만, 상관 기운의 팔자주의(거친 발언·무분별한 공개)가 명운을 깎을 수 있습니다.',
    cushion: '표현의 자유는 얻었으되 공개 전 한 번의 검수를 습관화하세요. 유머와 날카로움의 비율을 지키는 것이 관건입니다.',
  },
  '관성->재성': {
    risk: '책임이 성과·보수로 연결되는 일구다금(一具多金) 구간이지만, 일과 돈의 과중으로 번아웃 위험이 큽니다.',
    cushion: '수익 구조를 문서화하고 위임·자동화로 몸의 부담을 나누세요.',
  },
  '관성->인성': {
    risk: '의무·책임 모드가 명예·수혜 모드로 바뀌며 추진력이 옅어질 수 있습니다.',
    cushion: '신뢰 기반(자격·직함·인맥)의 자산화에 집중하세요. 다음 대운의 급을 위한 휴식기입니다.',
  },
  '인성->비겁': {
    risk: '받아둔 배움이 주체성으로 실행되면서 기존 지원 구조와의 분리 압박이 옵니다.',
    cushion: '독립의 준비는 끝났습니다. 첫 단추는 작게, 방향은 굽히지 말고 진행하세요.',
  },
  '인성->식상': {
    risk: '축적한 지식이 표현으로 개화되지만, 과잉 출력으로 내용의 깊이가 옅어질 수 있습니다.',
    cushion: '창작·강의·집필의 정기 리듬을 만들고 깊이를 지키는 편집 습관을 유지하세요.',
  },
  '인성->재성': {
    risk: '문서·지식이 자산화되는 구간이지만, 계약 조건의 허점이 그대로 금전 손실로 이어질 수 있습니다.',
    cushion: '계약·출간·지식재산권의 문구를 꼼꼼히 검증하고 전문가 검수를 받으세요.',
  },
  '인성->관성': {
    risk: '학습·수혜 모드가 의무·압박 모드로 급전환되는 대표적 심리 환절기입니다. 육체적 면역도 함께 떨어지기 쉽습니다.',
    cushion: '휴식 리듬(수면·운동)을 먼저 고정하고, 새 책임은 단계적으로 인수하세요. 완벽주의를 80%로 낮추는 것이 완충재입니다.',
  },
};

function tenGodShiftGuide(from: string, to: string): { riskNarrative: string; cushionGuide: string } {
  const direct = TEN_GOD_SHIFT_GUIDE[`${from}->${to}`];
  if (direct) return { riskNarrative: direct.risk, cushionGuide: direct.cushion };
  if (from === to) {
    return {
      riskNarrative: '같은 십성 계열의 대운으로 이어지며 큰 급변은 없지만, 10년의 관성이 조용히 교체됩니다.',
      cushionGuide: '기존 방식을 유지하되 다음 대운을 준비하는 관측을 병행하세요.',
    };
  }
  return {
    riskNarrative: `${from}에서 ${to}로 기운의 결이 바뀌며 익숙한 방식이 통하지 않을 수 있습니다.`,
    cushionGuide: '변화의 첫 신호를 기록하고, 판단은 한 템포 늦게 실행하세요.',
  };
}

function analyzeGyoUn(
  timeline: Array<{
    order: number;
    ganZhi: string;
    ganKr: string;
    zhiKr: string;
    startAge: number;
    endAge: number;
    tenGodGan: string;
  }>,
  birthYear: number,
  targetKoreanAge: number,
  targetYear: number,
): GyoUnAnalysis {
  const toSnapshot = (d: (typeof timeline)[number]): GyoUnDaewoonSnapshot => {
    const zhiIdx = BRANCHES_KO.indexOf(d.zhiKr);
    const ganIdx = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'].indexOf(d.ganKr);
    const ganHanja = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][ganIdx >= 0 ? ganIdx : 0];
    const zhiHanja = BRANCHES_HANJA[zhiIdx >= 0 ? zhiIdx : 0];
    return {
      order: d.order,
      ganZhi: d.ganZhi,
      koreanName: `${d.ganKr}${d.zhiKr}대운(${d.ganZhi})`,
      startAge: d.startAge,
      endAge: d.endAge,
      startYear: birthYear + d.startAge - 1,
      endYear: birthYear + d.endAge - 1,
      tenGodGan: d.tenGodGan,
      tenGodCategory: TEN_GOD_CATEGORY[d.tenGodGan] ?? '비겁',
      zhiSeason: branchSeason(zhiIdx >= 0 ? zhiIdx : 0),
      zhiElement: BRANCH_ELEMENT[zhiHanja] ?? '토',
    };
  };

  const current = timeline.find((d) => targetKoreanAge >= d.startAge && targetKoreanAge <= d.endAge);
  const next = timeline.find((d) => d.startAge > targetKoreanAge);

  if (!current || !next) {
    return {
      isGyoUnPeriod: false,
      note: !current
        ? '대상 나이가 대운 타임라인 범위 이전이어야 교체 시점을 확정할 수 없습니다.'
        : '8대 대운 타임라인의 마지막 구간으로, 이후 대운 교체 시점이 산출 범위 밖입니다.',
      windowType: null,
      yearsUntilSwitch: null,
      monthsUntilSwitch: null,
      switchYear: null,
      currentDaewoon: current ? toSnapshot(current) : null,
      nextDaewoon: null,
      tenGodShift: null,
      seasonShift: null,
      riskBufferAdvice: '',
      opportunityTiming: '',
    };
  }

  const curSnap = toSnapshot(current);
  const nextSnap = toSnapshot(next);
  const yearsUntilSwitch = next.startAge - targetKoreanAge; // 0 = 교체 당해년도, -1 = 교체 직후
  const switchYear = birthYear + next.startAge - 1;

  let windowType: GyoUnWindowType | null = null;
  if (yearsUntilSwitch === 2) windowType = '교체 전 조정기 (D-2)';
  else if (yearsUntilSwitch === 1) windowType = '교체 전 조정기 (D-1)';
  else if (yearsUntilSwitch === 0) windowType = '교체 당해년도 (대환절기·판도 대전환)';
  else if (yearsUntilSwitch === -1) windowType = '교체 직후 안착기 (+1)';
  const isGyoUnPeriod = windowType !== null;

  // 진입까지 남은 월수: 교체 연도의 입춘(立春) 절입 시각 기준 정밀 계산
  let monthsUntilSwitch: number | null = null;
  if (isGyoUnPeriod && yearsUntilSwitch >= 0) {
    try {
      const ipchun = getYearSolarTerms(switchYear).find((t) => t.name === '입춘');
      if (ipchun) {
        const startMs = Date.UTC(targetYear, 0, 1);
        monthsUntilSwitch = Math.max(
          0,
          Math.round(((ipchun.date.getTime() - startMs) / (86400000 * 30.4375)) * 10) / 10,
        );
      }
    } catch (_) {
      monthsUntilSwitch = null;
    }
    if (monthsUntilSwitch === null) {
      monthsUntilSwitch = Math.max(0, (switchYear - targetYear) * 12 + 1);
    }
  } else if (isGyoUnPeriod) {
    monthsUntilSwitch = 0; // 교체 직후 안착기
  }

  // 십성 전환 완충 가이드
  const shift = tenGodShiftGuide(curSnap.tenGodCategory, nextSnap.tenGodCategory);
  const tenGodShift: TenGodShift = {
    from: `${curSnap.koreanName}의 ${curSnap.tenGodGan}(${curSnap.tenGodCategory})`,
    to: `${nextSnap.koreanName}의 ${nextSnap.tenGodGan}(${nextSnap.tenGodCategory})`,
    riskNarrative: shift.riskNarrative,
    cushionGuide: shift.cushionGuide,
  };

  // 접목운(接木運) / 계절 대운 전환 감지
  const seasonShift: SeasonShift = {
    from: curSnap.zhiSeason,
    to: nextSnap.zhiSeason,
    isJeopmokUn: curSnap.zhiSeason !== nextSnap.zhiSeason,
    description: curSnap.zhiSeason !== nextSnap.zhiSeason
      ? `현재 대운 지지는 ${SEASON_FLOW[curSnap.zhiSeason]}이나, 다음 대운 지지는 ${SEASON_FLOW[nextSnap.zhiSeason]}으로 계절이 통째로 바뀌는 접목운(接木運)입니다. 접목된 나무가 환경에 적응하는 기간(교체 전후 1~2년)에는 생활 리듬과 핵심 관계를 지키는 완충이 필요합니다.`
      : `현재와 다음 대운 모두 ${curSnap.zhiSeason} 계절(${SEASON_FLOW[curSnap.zhiSeason]})로 계절 대운의 연속입니다. 큰 접목 충격 없이 에너지의 결만 바뀌는 부드러운 교체입니다.`,
  };

  const riskBufferAdvice = isGyoUnPeriod
    ? `교운기(${windowType})에는 환절기 감기처럼 판단력이 흔들립니다. ① 중대 계약·이직·이사의 최종 결정은 48시간 유예하고, ② 수면·운동·식사의 기본 리듬을 먼저 고정하며, ③ 핵심 관계(가족·파트너)와의 소통을 평소보다 일주일에 한 번 더 챙기세요. ${tenGodShift.cushionGuide}`
    : '현재는 대운 순항 구간입니다. 교체 2년 전(D-2)부터 교운기가 개시되므로, 그때까지 체력·재정·관계의 비축을 완성해 두는 것이 최선의 완충입니다.';

  const opportunityTiming = isGyoUnPeriod
    ? yearsUntilSwitch <= 0
      ? `대환절기의 한복판입니다. 새 대운(${nextSnap.koreanName}, ${nextSnap.startYear}년 시작)의 문법을 미리 학습해 두면 교체 직후 +1년 안착기에 동업·이직·이사 같은 큰 결정을 유리하게 배치할 수 있습니다.`
      : `${nextSnap.startYear}년(${nextSnap.startAge}세) ${nextSnap.koreanName} 교체까지 ${yearsUntilSwitch}년. 지금은 철수와 정리 국면이므로, 새로 시작할 일의 명세(준비 목록)를 완성해 두는 것이 기회의 씨앗입니다.`
    : `${nextSnap.koreanName} 교체(${nextSnap.startYear}년, ${nextSnap.startAge}세)까지 ${yearsUntilSwitch}년 남았습니다. 교체 2년 전(${nextSnap.startYear - 2}년)부터 교운기가 시작되니 그때까지 재능·자본·인맥의 비축을 완성하세요.`;

  return {
    isGyoUnPeriod,
    windowType,
    yearsUntilSwitch,
    monthsUntilSwitch,
    switchYear,
    currentDaewoon: curSnap,
    nextDaewoon: nextSnap,
    tenGodShift,
    seasonShift,
    riskBufferAdvice,
    opportunityTiming,
  };
}

// ---------------------------------------------------------------------------
// 결과 조립
// ---------------------------------------------------------------------------

function kstTimestamps(now: Date) {
  const kst = new Date(now.getTime() + 9 * 3600000);
  return { utc: now.toISOString(), kst: kst.toISOString().replace('Z', '+09:00') };
}

function skippedResult(note: string, targetYear: number): SamjaeGyoUnResult {
  const { utc, kst } = kstTimestamps(new Date());
  return {
    status: 'skipped',
    note,
    engineVersion: SAMJAE_GYOUN_ENGINE_VERSION,
    method: SAMJAE_GYOUN_METHOD,
    calculatedAtUtc: utc,
    calculatedAtKst: kst,
    timestamp: Date.now(),
    targetYear,
    birthYear: 0,
    targetKoreanAge: 0,
    headline: '',
    samjae: {
      isSamjaeYear: false,
      phase: null,
      sanHapGroup: null,
      birthBranch: null,
      samjaeBranch: null,
      targetYearGanZhi: '',
      threeYearArc: [],
      grade: null,
      gradeScore: 0,
      gradeReason: '',
      interactions: [],
      wellnessPrescription: null,
    },
    gyoUn: {
      isGyoUnPeriod: false,
      note: '생년월일 미입력으로 교운기 계산 생략',
      windowType: null,
      yearsUntilSwitch: null,
      monthsUntilSwitch: null,
      switchYear: null,
      currentDaewoon: null,
      nextDaewoon: null,
      tenGodShift: null,
      seasonShift: null,
      riskBufferAdvice: '',
      opportunityTiming: '',
    },
  };
}

/**
 * 사용자 프로필과 대상 연도로 삼재(三災) 3개년 궤적과 대운 교운기(交運期)를 결정론적으로 산출한다.
 * 생년월일이 없으면 status 'skipped'로 명확히 알린다. 성별이 없으면 삼재는 산출되지만
 * 대운 교체 감지는 생략된다(교운기 note로 안내).
 */
export function calculateSamjaeGyoUn(params: {
  profile?: UserProfile | null;
  targetYear?: number;
}): SamjaeGyoUnResult {
  const now = new Date();
  const targetYear = params.targetYear ?? now.getFullYear();
  const profile = params.profile ?? null;
  const birthdateStr = profile?.basic?.birthdate?.trim() || '';

  if (!profile || !birthdateStr) {
    return skippedResult('생년월일 미입력으로 삼재·교운기 계산을 생략했습니다.', targetYear);
  }

  const saju = calculateDetailedSaju(profile);
  if (!saju || !saju.hasBirthInfo || !saju.pillars?.year?.zhi) {
    return skippedResult('사주 원국 산출 실패로 삼재·교운기 계산을 생략했습니다.', targetYear);
  }

  const { utc, kst } = kstTimestamps(now);
  const birthYear = parseInt(saju.birthdate.slice(0, 4), 10) || targetYear;
  const targetKoreanAge = targetYear - birthYear + 1;

  // 1) 삼재: 원국 년지(입춘 경계 생년 띠) 기준
  const birthBranchIdx = BRANCHES_HANJA.indexOf(saju.pillars.year.zhi);
  const pillarList = (['year', 'month', 'day', 'hour'] as const)
    .map((key, i) => {
      const p = saju.pillars[key];
      if (!p?.zhi) return null;
      const zhiIdx = BRANCHES_HANJA.indexOf(p.zhi);
      return {
        label: ['년주', '월주', '일주', '시주'][i],
        zhi: p.zhi,
        zhiKo: zhiIdx >= 0 ? BRANCHES_KO[zhiIdx] : '',
      };
    })
    .filter((p): p is { label: string; zhi: string; zhiKo: string } => p !== null);

  const samjae = analyzeSamjae(
    birthBranchIdx,
    pillarList,
    saju.yongsin?.element,
    saju.yongsinDetails?.heeshin,
    saju.yongsinDetails?.gisin,
    targetYear,
  );

  // 2) 교운기: 대운수 8대 타임라인 (성별 미입력 시 타임라인이 비어 교체 감지 생략)
  const timeline = saju.daewunDetail?.timeline ?? [];
  let gyoUn: GyoUnAnalysis;
  if (timeline.length === 0) {
    gyoUn = {
      isGyoUnPeriod: false,
      note: '성별 기준 미입력으로 대운수가 확정되지 않아 교운기(대운 교체) 감지를 생략했습니다. 삼재 판정은 띠 기준으로 정상 산출되었습니다.',
      windowType: null,
      yearsUntilSwitch: null,
      monthsUntilSwitch: null,
      switchYear: null,
      currentDaewoon: null,
      nextDaewoon: null,
      tenGodShift: null,
      seasonShift: null,
      riskBufferAdvice: '',
      opportunityTiming: '',
    };
  } else {
    gyoUn = analyzeGyoUn(timeline, birthYear, targetKoreanAge, targetYear);
  }

  // 3) 종합 헤드라인
  const samjaeHeadline = samjae.isSamjaeYear
    ? `${targetYear}년(${samjae.targetYearGanZhi}년)은 ${samjae.birthBranch!.ko}띠의 ${samjae.phase} — ${samjae.grade} 등급`
    : `${targetYear}년(${samjae.targetYearGanZhi}년)은 ${samjae.birthBranch!.ko}띠 삼재가 아닌 해 (삼재 궤적: ${samjae.threeYearArc.map((a) => `${a.year} ${a.phase}`).join(' → ')})`;
  const gyoUnHeadline = gyoUn.isGyoUnPeriod
    ? `교운기 진입 (${gyoUn.windowType}) — ${gyoUn.switchYear}년 ${gyoUn.nextDaewoon?.koreanName ?? ''} 교체`
    : '대운 순항 구간';

  return {
    status: 'calculated',
    engineVersion: SAMJAE_GYOUN_ENGINE_VERSION,
    method: SAMJAE_GYOUN_METHOD,
    calculatedAtUtc: utc,
    calculatedAtKst: kst,
    timestamp: now.getTime(),
    targetYear,
    birthYear,
    targetKoreanAge,
    headline: `${samjaeHeadline} | ${gyoUnHeadline}`,
    samjae,
    gyoUn,
  };
}

/**
 * 삼재·교운기 환절기 결과를 LLM 프롬프트에 주입하기 위한 정돈된 한국어 섹션으로 변환한다.
 * skipped 결과는 빈 문자열을 반환해 상위 포맷터가 섹션을 생략하도록 한다.
 */
export function formatSamjaeGyoUnPrompt(result: SamjaeGyoUnResult): string {
  if (result.status !== 'calculated') return '';

  const { samjae, gyoUn } = result;

  const arcLines = samjae.threeYearArc
    .map((a) => {
      const mark = a.year === result.targetYear ? ' ◀ 당해년도' : '';
      return `   - ${a.year}년 ${a.branchKo}(${a.branchHanja})해: ${a.phase}${mark}`;
    })
    .join('\n');

  const interactionLines = samjae.interactions.length
    ? samjae.interactions.map((i) => `   - ${i.type} [원국 ${i.targetPillar}·${i.targetBranchKo}지]: ${i.detail}`).join('\n')
    : '   - 원국 4주와의 충·형·파·해·육합 없음 (평온한 삼재)';

  const rx = samjae.wellnessPrescription;
  const rxLines = rx
    ? `   - 보할 오행: ${ELEMENT_DETAILS_KO(rx.reinforceElement)} — ${rx.reinforceSummary}
   - 처방 식품: ${rx.foods.join(', ')}
   - 처방 컬러: ${rx.colors.join(', ')}
   - 처방 활동: ${rx.activities.join(' · ')}
   - 길방위: ${rx.direction} | 루틴: ${rx.routine}${rx.avoidSummary ? `\n   - 피할 오행: ${ELEMENT_DETAILS_KO(rx.avoidElement!)} — ${rx.avoidSummary}` : ''}`
    : '   - 해당 없음 (삼재 아님)';

  const gyoUnLines = gyoUn.currentDaewoon && gyoUn.nextDaewoon
    ? `   - 현재 대운: ${gyoUn.currentDaewoon.koreanName} (${gyoUn.currentDaewoon.startYear}~${gyoUn.currentDaewoon.endYear}년, ${gyoUn.currentDaewoon.startAge}~${gyoUn.currentDaewoon.endAge}세) — ${gyoUn.currentDaewoon.tenGodGan}(${gyoUn.currentDaewoon.tenGodCategory}) · ${gyoUn.currentDaewoon.zhiSeason} 계절 [${gyoUn.currentDaewoon.zhiElement}]
   - 다음 대운: ${gyoUn.nextDaewoon.koreanName} (${gyoUn.nextDaewoon.startYear}~${gyoUn.nextDaewoon.endYear}년, ${gyoUn.nextDaewoon.startAge}~${gyoUn.nextDaewoon.endAge}세) — ${gyoUn.nextDaewoon.tenGodGan}(${gyoUn.nextDaewoon.tenGodCategory}) · ${gyoUn.nextDaewoon.zhiSeason} 계절 [${gyoUn.nextDaewoon.zhiElement}]
   - 교체 시점: ${gyoUn.switchYear}년 (교체 나이 ${gyoUn.nextDaewoon.startAge}세) | 교운기 진입 여부: ${gyoUn.isGyoUnPeriod ? `예 — ${gyoUn.windowType}` : '아니오 (순항)'}${gyoUn.yearsUntilSwitch !== null ? ` | 남은 햇수: ${gyoUn.yearsUntilSwitch}년` : ''}${gyoUn.monthsUntilSwitch !== null ? ` | 남은 월수: 약 ${gyoUn.monthsUntilSwitch}개월 (교체해 입춘 기준)` : ''}
   - 십성·오행 전환: ${gyoUn.tenGodShift?.from} → ${gyoUn.tenGodShift?.to}
     · 리스크 서사: ${gyoUn.tenGodShift?.riskNarrative}
     · 완충 가이드: ${gyoUn.tenGodShift?.cushionGuide}
   - 접목운/계절 대운: ${gyoUn.seasonShift?.isJeopmokUn ? '접목운 감지' : '계절 연속'} — ${gyoUn.seasonShift?.description}`
    : `   - ${gyoUn.note ?? '대운 교체 시점 미산출'}`;

  return `[🌙 삼재(三災)·교운기(交運期) 인생 환절기 실측 데이터 (Samjae & GyoUn Transition Core)]
======================================================================
엔진 버전: ${result.engineVersion} | 대상 연도: ${result.targetYear} (${samjae.targetYearGanZhi}년) | 산출 시각: ${result.calculatedAtKst}
산법: ${result.method}
대상: 만 ${result.birthYear ? `${result.targetYear - result.birthYear}세` : '미확인'} (한국나이 ${result.targetKoreanAge}세) | 생년 ${result.birthYear}
종합: ${result.headline}
======================================================================
1. [삼재(三災) 3개년 궤적 — ${samjae.sanHapGroup ?? '삼합군 미확인'}]:
${arcLines}
   당해년도 판정: ${samjae.isSamjaeYear ? `${samjae.phase} (등급: ${samjae.grade}, 산출 점수 ${samjae.gradeScore})` : '삼재 아님'}
   등급 근거: ${samjae.gradeReason || '삼재 해당 연도가 아닙니다.'}

2. [원국 상호작용 — 삼재년 지지가 사주 원국에 미치는 힘]:
${interactionLines}

3. [오행 바이오웰니스 처방 — 삼재 극복 루틴]:
${rxLines}

4. [대운 교운기(交運期) 정밀 감지]:
${gyoUnLines}

5. [리스크 완충 & 기회 타이밍]:
   - 리스크 완충 처방: ${gyoUn.riskBufferAdvice || samjae.gradeReason}
   - 기회 타이밍: ${gyoUn.opportunityTiming || '삼재 기간의 소극적 기회는 평삼재 관리로 충분합니다.'}
======================================================================
[★ 루시 삼재·교운기 상담 지침]:
- 위 삼재 판정(들·눌·날)과 교운기 감지(D-2~+1), 남은 햇수·월수는 순수 수리로 직접 계산한 확정 데이터다. 다른 해를 삼재로 지어내지 마십시오.
- 사용자가 '삼재인가요?', '대운이 언제 바뀌나요?', '요즘 너무 힘든데 환절기인가요?'라고 물으면 등급(복·평·악)과 교운기 윈도우, 완충 처방을 근거로 다정하게 안내하십시오.
- 삼재는 겁을 주는 도구가 아니라 '무리한 확장을 접고 비축하는 리듬'의 안내입니다. 악삼재라도 처방(오행 바이오웰니스·완충 가이드)과 함께 희망의 실행 계획으로 전달하십시오.`;
}
