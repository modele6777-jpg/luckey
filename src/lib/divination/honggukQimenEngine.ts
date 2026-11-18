/**
 * =========================================================================
 * LUCKEY 조선 정통 홍국기문(洪局奇門) 연·월·일·시 4주 9궁 수리 포국 & 
 * 세효(世爻)·응효(應爻)·중궁(中宮)·삼형(三刑)·통기(通氣) 결정론 엔진
 * (Authentic Joseon Hongguk Qimen 4-Pillar 9-Palace Numerical Casting &
 *  Se-Yao / Eung-Yao / Jung-Gung / San-Hyeong / Tong-Gi Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. AI(LLM)에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    동일한 생년월일시 입력에 대해 항상 100% 동일한 9궁 포국·거점·삼형·통기 판정을 산출한다.
 *
 * 2. 조선 정통 홍국기문(洪局奇門) 수리 포국 — 화담 서경덕·토정 이지함 계통의 하도·낙서 수리법:
 *    사주 4주(年·月·日·時)의 천간·지지를 하도 생성수와 낙서 구성수로 수리화한 뒤,
 *    지반수(地盤數) 중궁과 천반수(天盤數) 중궁을 산출해 9궁 비성(飛星)으로 포국한다.
 *    - 천간수(하도 생성수): 甲1·乙2·丙3·丁4·戊5·己6·庚7·辛8·壬9·癸10
 *    - 지지수(후천 12진수): 子1·丑2·寅3·卯4·辰5·巳6·午7·未8·申9·酉10·戌11·亥12
 *    - 궁수 환원: 수리 수를 1~9 구성환원(낙서 나머지 순환)한 뒤 궁에 입(入)시킨다.
 *
 * 3. 9궁 팔괘 지반 — 낙서 구성 9궁 전수 데이터:
 *    1백 감궁(북), 2흑 곤궁(남서), 3벽 진궁(동), 4록 손궁(남동), 5황 중궁(중앙),
 *    6백 건궁(북서), 7적 태궁(서), 8백 간궁(북동), 9자 리궁(남).
 *    포국은 중궁에서 기점해 건→태→간→리→감→곤→진→손의 낙서 비행 경로를 따라
 *    궁수를 1씩 역행(逆飛)시켜 배치하는 결정론 배열이다.
 *
 * 4. 3대 핵심 거점(세효·응효·중궁) 수리 식별:
 *    - 세효(世爻 · 본신): 나 자신과 주체의 역량·기운. 連干(연간·기반의 천간)과 日支(일지·
 *      자기 자리의 지지)의 궁수 합으로 궁위를 정한다.
 *    - 응효(應爻 · 상대): 상대방, 환경, 시장 반응. 月支(월지·사회 환경)과 時干(시간·결실과
 *      상대 반응의 천간)의 궁수 합으로 궁위를 정한다. 생시 미입력 시 월지 단독 수리로 안전 복구.
 *    - 중궁(中宮 · 핵심): 일의 본질과 사건의 중심축. 5궁(중궁)에 입한 천반수 별과 지반수 별.
 *    세 거점 입한 오행 간 상생·상극·비화 관계를 대조해 국면의 질을 판정한다.
 *
 * 5. 삼형(三刑) 및 통기(通氣) 진단:
 *    - 삼형살: 4주 지지에 寅·巳·申이 모두 있으면 인사신 삼형, 丑·戌·未가 모두 있으면
 *      축술미 삼형이 성립한다. 2개만 갖추면 잠재 형(부분 형)으로 표기한다.
 *      파극 위험도(0~100)는 삼형 성립·부분 형, 지지 육충(子午·丑未·寅申·卯酉·辰戌·巳亥),
 *      형 지지의 세효궁 동궁 동반 여부로 결정론 산출한다.
 *    - 통기(상생 유통): 水生木→木生火→火生土→土生金→金生水 다섯 상생 간선 가운데
 *      소스·타겟 오행이 모두 4주(생시 미입력 시 3주) 8자에 존재하면 각 20점, 합산 0~100.
 *
 * 6. 8문(八門) 길흉 배치 — 낙서 정궁 문배속:
 *    - 3대 길문: 개문(開門·건6궁), 휴문(休門·감1궁), 생문(生門·간8궁)
 *    - 5대 평·흉문: 상문(傷門·진3궁), 두문(杜門·손4궁), 경문(景門·태7궁), 사문(死門·곤2궁),
 *      경문(驚門·리9궁). 중궁(5궁)은 문이 없어 곤궁에 기궁(寄宮)한다.
 *    세효가 길문을 입수했는지(得門) 여부와 삼형·통기 지수로 길흉 격국을 최종 판정하고
 *    개운 처방을 결정론적으로 산출한다.
 *
 * 7. 생시가 없어도 산출된다(null-safe). 시주를 제외한 3주 수리로 포국하고 timeKnown=false로
 *    명시하며, 프로필이 없으면 status 'skipped'로 안전하게 건너뛴다.
 */

import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju, STEM_ELEMENT, BRANCH_ELEMENT } from '../sajuAnalysis';

export const HONGGUK_QIMEN_ENGINE_VERSION = 'LUCKEY-HQ-v2.3.0';

export const HONGGUK_QIMEN_METHOD =
  '조선 정통 홍국기문(洪局奇門) 결정론 산법: 사주 연·월·일·시 4주 천간·지지의 하도 생성수(甲1~癸10)·후천 12진수(子1~亥12) 낙서 구성환원으로 지반수(地盤數) 중궁과 천반수(天盤數) 중궁을 산출하고, 중궁 기점 건→태→간→리→감→곤→진→손 낙서 비행 경로 역행 배열로 9궁(1백 감궁~9자 리궁) 천지반 비성 포국, 세효(世爻·본신)·응효(應爻·상대)·중궁(中宮·핵심) 3대 거점 수리 식별과 3궁 오행 상생·상극·비화 대조, 인사신·축술미 삼형(三刑) 성립 및 육충 반영 파극 위험도(0~100), 수생목→목생화→화생토→토생금→금생수 상생 통기 순환 완성도(0~100), 8문(개휴생 3길문·상두경(景) 사경(驚) 평흉문) 정궁 배속과 세효 득문(得門) 판정, 길흉 격국 및 개운 처방';

/** 하도 생성수 천간 수리 (甲1~癸10) */
export const STEM_NUMBERS: Readonly<Record<string, number>> = {
  '甲': 1, '乙': 2, '丙': 3, '丁': 4, '戊': 5, '己': 6, '庚': 7, '辛': 8, '壬': 9, '癸': 10,
};

/** 후천 12진수 지지 수리 (子1~亥12) */
export const BRANCH_NUMBERS: Readonly<Record<string, number>> = {
  '子': 1, '丑': 2, '寅': 3, '卯': 4, '辰': 5, '巳': 6, '午': 7, '未': 8, '申': 9, '酉': 10, '戌': 11, '亥': 12,
};

/** 9궁 지반 전수: 궁수 → 궁명·방위·구성(九星) 색 */
export interface HonggukPalaceBasis {
  palace: number;
  name: string; // '1백 감궁'
  direction: string; // 방위
  starName: string; // '백'
  palaceGan: string; // 정궁 천간
  palaceZhi: string; // 정궁 지지
}

export const HONGGUK_NINE_PALACES: ReadonlyArray<HonggukPalaceBasis> = [
  { palace: 1, name: '1백 감궁(坎宮)', direction: '북', starName: '백', palaceGan: '戊', palaceZhi: '子' },
  { palace: 2, name: '2흑 곤궁(坤宮)', direction: '남서', starName: '흑', palaceGan: '乙', palaceZhi: '未' },
  { palace: 3, name: '3벽 진궁(震宮)', direction: '동', starName: '벽', palaceGan: '丙', palaceZhi: '卯' },
  { palace: 4, name: '4록 손궁(巽宮)', direction: '남동', starName: '록', palaceGan: '辛', palaceZhi: '辰' },
  { palace: 5, name: '5황 중궁(中宮)', direction: '중앙', starName: '황', palaceGan: '戊', palaceZhi: '己' },
  { palace: 6, name: '6백 건궁(乾宮)', direction: '북서', starName: '백', palaceGan: '己', palaceZhi: '戌' },
  { palace: 7, name: '7적 태궁(兌宮)', direction: '서', starName: '적', palaceGan: '丁', palaceZhi: '酉' },
  { palace: 8, name: '8백 간궁(艮宮)', direction: '북동', starName: '백', palaceGan: '癸', palaceZhi: '寅' },
  { palace: 9, name: '9자 리궁(離宮)', direction: '남', starName: '자', palaceGan: '壬', palaceZhi: '巳' },
];

/** 낙서 비행 경로: 중궁(5) → 건(6) → 태(7) → 간(8) → 리(9) → 감(1) → 곤(2) → 진(3) → 손(4) */
export const HONGGUK_FLIGHT_PATH: ReadonlyArray<number> = [5, 6, 7, 8, 9, 1, 2, 3, 4];

/** 8문 정궁 배속: 궁수 → 문명·등급 (중궁은 무문, 곤궁 기궁) */
export interface HonggukGateDef {
  gate: string; // '개문(開門)'
  shortName: string; // '개문'
  category: '길문' | '평문' | '흉문' | '중궁(무문)';
  meaning: string;
}

export const HONGGUK_EIGHT_GATES: Readonly<Record<number, HonggukGateDef>> = {
  1: { gate: '휴문(休門)', shortName: '휴문', category: '길문', meaning: '안정·휴식·재정·복지의 길문. 지혜로 쉬면서 힘을 모으는 문.' },
  2: { gate: '사문(死門)', shortName: '사문', category: '흉문', meaning: '정체·종장·고통의 흉문. 묵은 일을 끝내고 새 판을 열 때만 쓰는 문.' },
  3: { gate: '상문(傷門)', shortName: '상문', category: '평문', meaning: '돌파·경쟁·충돌의 평문. 승부수와 수술적 단행에 한해 쓰는 문.' },
  4: { gate: '두문(杜門)', shortName: '두문', category: '평문', meaning: '차단·은닉·방어의 평문. 막고 숨기는 방어 전술의 문.' },
  5: { gate: '무문(中宮 기궁)', shortName: '무문', category: '중궁(무문)', meaning: '중궁에는 문이 없어 곤궁(사문)에 기궁(寄宮)한다. 사건의 본질은 문 밖의 자리.' },
  6: { gate: '개문(開門)', shortName: '개문', category: '길문', meaning: '개업·출두·관청·새 시작의 제1길문. 문을 여는 확장의 문.' },
  7: { gate: '경문(景門)', shortName: '경문', category: '평문', meaning: '문서·계약·명예·현란함의 평문. 문서와 화려함이 득실거리는 문.' },
  8: { gate: '생문(生門)', shortName: '생문', category: '길문', meaning: '생존·재물·부동산·생명력의 제1길문. 살아나는 돌파구의 문.' },
  9: { gate: '경문(驚門)', shortName: '경문', category: '흉문', meaning: '불경·구설·헛소문의 흉문. 말과 소문이 화를 부르는 문.' },
};

/** 육충(六沖) 지지 대충(對沖) 쌍 */
export const HONGGUK_CHUNG_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

/** 오행 상생 통기 순환 간선 (수생목→목생화→화생토→토생금→금생수) */
export const HONGGUK_TONGGI_CYCLES: ReadonlyArray<readonly [string, string, string]> = [
  ['수', '목', '수생목'], ['목', '화', '목생화'], ['화', '토', '화생토'], ['토', '금', '토생금'], ['금', '수', '금생수'],
];

/** 포국된 한 궁의 천지반 별과 문 */
export interface HonggukQimenPalace {
  palace: number; // 1~9
  name: string; // '1백 감궁'
  direction: string;
  heavenStar: string; // 천반수 구성 별 ('백' 등)
  heavenStarNumber: number; // 천반수 (1~9)
  earthStar: string; // 지반수 구성 별
  earthStarNumber: number; // 지반수 (1~9)
  gate: string | null; // 팔문 (중궁은 기궁 사문으로 표기)
  gateCategory: HonggukGateDef['category'];
}

/** 세효·응효·중궁 3대 거점 */
export interface HonggukQimenKeyPoint {
  label: string; // '세효(世爻)·본신'
  role: string; // 거점이 다루는 국면
  palace: number;
  palaceName: string;
  star: string; // 입한 천반 별
  element: string; // 입궁 오행 (천반 별의 궁 오행)
  gate: string | null;
  gateCategory: HonggukGateDef['category'];
  deukMun: boolean; // 길문 획득 여부
  note: string;
}

/** 3대 거점 간 상생·상극·비화 대조 */
export interface HonggukQimenKeyRelation {
  from: string;
  to: string;
  fromElement: string;
  toElement: string;
  relation: '상생' | '상극' | '비화';
  note: string;
}

export interface HonggukQimenResult {
  status: 'calculated' | 'skipped' | 'error';
  engineVersion: string;
  calculatedAtKst?: string;
  method: string;
  targetYear?: number;
  fourPillars?: {
    year: string; // '갑진' 등 원국 표기 (한자)
    month: string;
    day: string;
    hour: string | null;
    timeKnown: boolean;
  };
  numerals?: ReadonlyArray<{
    pillar: string; // '년주' 등
    gan: string; zhi: string;
    ganNumber: number; zhiNumber: number; // 하도 생성수 / 후천 12진수
    ganPalace: number; zhiPalace: number; // 1~9 구성환원 궁수
  }>;
  earthCenterNumber?: number; // 지반수(地盤數) 중궁 (1~9)
  heavenCenterNumber?: number; // 천반수(天盤數) 중궁 (1~9)
  palaces?: ReadonlyArray<HonggukQimenPalace>; // 9궁 천지반 포국
  keyPoints?: {
    seYao: HonggukQimenKeyPoint; // 세효·본신
    eungYao: HonggukQimenKeyPoint; // 응효·상대
    jungGung: HonggukQimenKeyPoint; // 중궁·핵심
  };
  keyPointRelations?: ReadonlyArray<HonggukQimenKeyRelation>; // 3궁 상생상극 대조
  samhyeong?: {
    type: '인사신 삼형(寅巳申)' | '축술미 삼형(丑戌未)' | null;
    formed: boolean;
    partial: boolean;
    involvedBranches: ReadonlyArray<string>;
    riskIndex: number; // 파극 위험도 0~100
    note: string;
  };
  tonggi?: {
    score: number; // 상생 순환 완성도 0~100
    activeCycles: ReadonlyArray<string>;
    missingCycles: ReadonlyArray<string>;
    elementCounts: Readonly<Record<string, number>>;
    note: string;
  };
  eightGatesVerdict?: {
    seYaoGate: string | null;
    deukMun: boolean;
    pattern: string; // 길흉 격국
    summary: string;
    advice: string;
  };
  heavenEarthResonance?: HonggukHeavenEarthResonance;
  threeWondersAlliance?: HonggukThreeWondersAlliance;
  tacticalSeasonWindows?: HonggukTacticalSeasonWindows;
  situationalHonggukAudit?: {
    focusTheme: string;
    gateNote: string;
    tacticalStep: string;
  };
  temporalHonggukRhythm?: {
    kstTimeLabel: string;
    palaceWatchWindow: string;
    seasonalQimenTone: string;
    temporalGuidance: string;
  };
  honggukSynthesisMatrix?: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  boundaryNotice?: string;
  interpretiveBoundary?: string;
  ritualAction?: string;
  reflectionFocus?: string;
  reflectiveQuestion?: string;
  note?: string;
}

/** 홍국수 천지반 생극제화 공명 */
export interface HonggukHeavenEarthResonance {
  seYaoResonance: {
    heavenStar: number;
    earthStar: number;
    relation: '천생지(天生地)' | '지생천(地生天)' | '천극지(天剋地)' | '지극천(地剋天)' | '천지비화(天地比和)';
    resonanceScore: number; // 40~98
    interpretation: string;
  };
  overallBalance: string;
}

/** 삼기(三奇) 회합 및 귀인 원조력 */
export interface HonggukThreeWondersAlliance {
  wondersDetected: ReadonlyArray<'을기(乙奇·일기)' | '병기(丙奇·월기)' | '정기(丁奇·성기)'>;
  deukGi: boolean;
  wondersEmpowermentIndex: number; // 45~98
  nobleSponsorship: string;
}

/** 4계절 결단 윈도우 및 거시 전술 가이드 */
export interface HonggukTacticalSeasonWindows {
  peakActionSeason: '봄(木·진손궁)' | '여름(火·리궁)' | '가을(金·건태궁)' | '겨울(水·감궁)' | '환절기(土·곤간궁)';
  defensiveSeason: '봄(木·진손궁)' | '여름(火·리궁)' | '가을(金·건태궁)' | '겨울(水·감궁)' | '환절기(土·곤간궁)';
  strategicPacingAdvice: string;
}

/** 수리 수를 1~9 구성환원(낙서 순환)한다. */
function palaceOf(n: number): number {
  return ((Math.round(n) - 1) % 9 + 9) % 9 + 1;
}

/** 중궁 기점 역행 비행: 비행 경로 i번째 궁에 입할 별수 */
function flyingStar(centerNumber: number, step: number): number {
  return palaceOf(centerNumber - step);
}

function elementOfGanZhi(gan: string, zhi: string): string {
  return STEM_ELEMENT[gan] || BRANCH_ELEMENT[zhi] || '토';
}

/** 세 거점 입궁 오행 간 관계 판정 */
function judgeRelation(fromLabel: string, toLabel: string, fromEl: string, toEl: string): HonggukQimenKeyRelation {
  const givesBirth: Record<string, string> = { '목': '화', '화': '토', '토': '금', '금': '수', '수': '목' };
  const overcomes: Record<string, string> = { '목': '토', '토': '수', '수': '화', '화': '금', '금': '목' };
  if (fromEl === toEl) {
    return { from: fromLabel, to: toLabel, fromElement: fromEl, toElement: toEl, relation: '비화', note: `${fromEl}오행이 같아 비화(比和) — 같은 편 기운이 겹쳐 주체의 기세가 단단하나 고집도 함께 센다.` };
  }
  if (givesBirth[fromEl] === toEl) {
    return { from: fromLabel, to: toLabel, fromElement: fromEl, toElement: toEl, relation: '상생', note: `${fromLabel}의 ${fromEl}기운이 ${toLabel}의 ${toEl}기운을 생(生)한다 — ${fromLabel}이(가) ${toLabel}을(를) 키워주는 순환 구조.` };
  }
  if (overcomes[fromEl] === toEl) {
    return { from: fromLabel, to: toLabel, fromElement: fromEl, toElement: toEl, relation: '상극', note: `${fromLabel}의 ${fromEl}기운이 ${toLabel}의 ${toEl}기운을 극(剋)한다 — ${fromLabel}이(가) ${toLabel}을(를) 제압하는 판이어야 유리하다.` };
  }
  if (givesBirth[toEl] === fromEl) {
    return { from: fromLabel, to: toLabel, fromElement: fromEl, toElement: toEl, relation: '상생', note: `${toLabel}의 ${toEl}기운이 ${fromLabel}의 ${fromEl}기운을 생(生)한다 — ${toLabel}이(가) ${fromLabel}을(를) 도와주는 순환 구조.` };
  }
  return { from: fromLabel, to: toLabel, fromElement: fromEl, toElement: toEl, relation: '상극', note: `${toLabel}의 ${toEl}기운이 ${fromLabel}의 ${fromEl}기운을 극(剋)한다 — ${toLabel}의 압박에 ${fromLabel}이(가) 휘어지는 판이므로 방어 설계가 필요하다.` };
}

function numberToHadoElement(num: number): '목' | '화' | '토' | '금' | '수' {
  const mod = ((Math.round(num) - 1) % 10 + 10) % 10 + 1; // 1~10
  if (mod === 1 || mod === 6) return '수';
  if (mod === 2 || mod === 7) return '화';
  if (mod === 3 || mod === 8) return '목';
  if (mod === 4 || mod === 9) return '금';
  return '토';
}

function calculateHeavenEarthResonance(seYaoPalace: HonggukQimenPalace): HonggukHeavenEarthResonance {
  const hNum = seYaoPalace.heavenStarNumber;
  const eNum = seYaoPalace.earthStarNumber;
  const hEl = numberToHadoElement(hNum);
  const eEl = numberToHadoElement(eNum);

  const givesBirth: Record<string, string> = { '목': '화', '화': '토', '토': '금', '금': '수', '수': '목' };
  const overcomes: Record<string, string> = { '목': '토', '토': '수', '수': '화', '화': '금', '금': '목' };

  let relation: '천생지(天生地)' | '지생천(地生天)' | '천극지(天剋地)' | '지극천(地剋天)' | '천지비화(天地比和)';
  let resonanceScore: number;
  let interpretation: string;

  if (hEl === eEl) {
    relation = '천지비화(天地比和)';
    resonanceScore = 86;
    interpretation = `세효궁에 임한 천반수(${hNum}·${hEl})와 지반수(${eNum}·${eEl})가 같은 기운을 이룹니다. 환경과 본신의 목표가 일치하여 흔들림 없는 단단한 집중력을 발휘합니다.`;
  } else if (givesBirth[hEl] === eEl) {
    relation = '천생지(天生地)';
    resonanceScore = 94;
    interpretation = `천반수(${hNum}·${hEl})가 지반수(${eNum}·${eEl})를 생합니다. 하늘의 때와 외부 기회가 내 기반과 역량을 풍요롭게 밀어주는 최상의 순풍 형세입니다.`;
  } else if (givesBirth[eEl] === hEl) {
    relation = '지생천(地生天)';
    resonanceScore = 90;
    interpretation = `지반수(${eNum}·${eEl})가 천반수(${hNum}·${hEl})를 생합니다. 내부 역량과 준비된 노력이 바깥의 기회를 활짝 꽃피워 성과를 거두는 구조입니다.`;
  } else if (overcomes[hEl] === eEl) {
    relation = '천극지(天剋地)';
    resonanceScore = 58;
    interpretation = `천반수(${hNum}·${hEl})가 지반수(${eNum}·${eEl})를 극합니다. 외부 환경의 변화와 요구가 급격하여 내부에 피로와 부담을 가중시키므로, 체력과 일정을 완급 조절해야 합니다.`;
  } else {
    relation = '지극천(地剋天)';
    resonanceScore = 52;
    interpretation = `지반수(${eNum}·${eEl})가 천반수(${hNum}·${hEl})를 극합니다. 주체의 고집이나 기존 관성이 시류와 엇박자를 낼 수 있으니, 고집을 풀고 유연하게 상황에 호응하십시오.`;
  }

  const overallBalance = `세효궁 천지반 공명 지수 ${resonanceScore}점 (${relation}) — 천수 ${hNum}과 지수 ${eNum}의 오행 상호작용이 균형 있게 작동합니다.`;

  return {
    seYaoResonance: {
      heavenStar: hNum,
      earthStar: eNum,
      relation,
      resonanceScore,
      interpretation,
    },
    overallBalance,
  };
}

function calculateThreeWondersAlliance(gans: ReadonlyArray<string>): HonggukThreeWondersAlliance {
  const wondersDetected: Array<'을기(乙奇·일기)' | '병기(丙奇·월기)' | '정기(丁奇·성기)'> = [];
  if (gans.includes('乙')) wondersDetected.push('을기(乙奇·일기)');
  if (gans.includes('丙')) wondersDetected.push('병기(丙奇·월기)');
  if (gans.includes('丁')) wondersDetected.push('정기(丁奇·성기)');

  const deukGi = wondersDetected.length > 0;
  const wondersEmpowermentIndex = deukGi ? Math.min(98, 72 + wondersDetected.length * 8) : 48;
  const nobleSponsorship = deukGi
    ? `원국에 삼기(${wondersDetected.join('·')})의 상서로운 기운이 서려 위기마다 결정적 원조와 문서상 조력의 빛이 비칩니다.`
    : '삼기가 직접 원국에 임하지 않으므로 외부 기적에 기대기보다, 자력갱생의 실력과 철저한 리스크 관리로 돌파해야 합니다.';

  return {
    wondersDetected,
    deukGi,
    wondersEmpowermentIndex,
    nobleSponsorship,
  };
}

function calculateTacticalSeasonWindows(seYaoPalaceNumber: number): HonggukTacticalSeasonWindows {
  let peakActionSeason: '봄(木·진손궁)' | '여름(火·리궁)' | '가을(金·건태궁)' | '겨울(水·감궁)' | '환절기(土·곤간궁)';
  let defensiveSeason: '봄(木·진손궁)' | '여름(火·리궁)' | '가을(金·건태궁)' | '겨울(水·감궁)' | '환절기(土·곤간궁)';
  let strategicPacingAdvice: string;

  if (seYaoPalaceNumber === 1) {
    peakActionSeason = '겨울(水·감궁)';
    defensiveSeason = '여름(火·리궁)';
    strategicPacingAdvice = '겨울철에 내적 통찰과 연구, 비밀 기획 추진의 모멘텀이 극대화됩니다. 한여름에는 과도한 노출과 감정적 분쟁을 삼가고 내실을 지키십시오.';
  } else if (seYaoPalaceNumber === 3 || seYaoPalaceNumber === 4) {
    peakActionSeason = '봄(木·진손궁)';
    defensiveSeason = '가을(金·건태궁)';
    strategicPacingAdvice = '봄철에 새로운 사업과 기획을 착수하는 돌파력이 최고조에 달합니다. 가을철 계약과 정산 시점에는 세밀한 문구 검토로 리스크를 막으십시오.';
  } else if (seYaoPalaceNumber === 9) {
    peakActionSeason = '여름(火·리궁)';
    defensiveSeason = '겨울(水·감궁)';
    strategicPacingAdvice = '여름철에 대외 인지도와 명예, 가시적 성과를 세상에 알리기에 최적기입니다. 겨울철에는 에너지를 충전하고 번아웃을 방지하는 수성이 필요합니다.';
  } else if (seYaoPalaceNumber === 6 || seYaoPalaceNumber === 7) {
    peakActionSeason = '가을(金·건태궁)';
    defensiveSeason = '봄(木·진손궁)';
    strategicPacingAdvice = '가을철에 결실 수확과 핵심 계약, 명확한 결단이 가장 강력하게 성사됩니다. 봄철에는 성급하게 일을 벌이기보다 기존 기반을 정비하십시오.';
  } else {
    peakActionSeason = '환절기(土·곤간궁)';
    defensiveSeason = '봄(木·진손궁)';
    strategicPacingAdvice = '계절이 바뀌는 환절기마다 조직 재정비와 자산 가치 보존의 기회가 찾아옵니다. 서두르지 않고 중후하게 중심을 잡는 태도가 승착이 됩니다.';
  }

  return {
    peakActionSeason,
    defensiveSeason,
    strategicPacingAdvice,
  };
}

function getTemporalHonggukRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const palaceWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 개문(開門)·생문(生門) 출두창 — 세효궁의 길문 방위를 향해 첫 행보를 여는 시간'
      : hour >= 11 && hour < 17
        ? '정오 응효(應爻) 교섭창 — 상대·시장과 오행 생극을 조율하며 실무 합의를 이끄는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 휴문(休門) 수렴창 — 무리한 확장 대신 통기(通氣)를 돌보며 하루를 정돈하는 시간'
          : '심야 중궁(中宮) 관조창 — 천지반 포국의 본질을 돌아보며 다음 판을 설계하는 시간';

  const seasonalQimenTone =
    month >= 3 && month <= 5
      ? '봄 · 진손(木) 발동절 (동쪽·남동쪽 목기 통기가 살아나는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 리궁(火) 현현절 (문서·명예·결실의 화기가 빛나는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 건태(金) 결단절 (개문의 결단과 정리정돈이 힘을 발휘하는 시기)'
          : '겨울 · 감궁(水) 축적절 (휴문의 지혜로 내실을 다지고 자원을 비축하는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
    palaceWatchWindow,
    seasonalQimenTone,
    temporalGuidance: `${palaceWatchWindow} · ${seasonalQimenTone}의 결에 맞추어 포국의 문을 여십시오.`,
  };
}

/**
 * 조선 정통 홍국기문 4주 9궁 수리 포국 결정론적 계산 함수
 * (동일한 생년월일시 입력 → 항상 100% 동일한 포국·거점·삼형·통기 판정 산출)
 */
export function calculateHonggukQimen(params: {
  profile?: UserProfile | null;
  targetYear?: number;
  now?: Date;
  question?: string;
}): HonggukQimenResult {
  const now = params.now || new Date();
  const question = (params.question || '').trim();
  const birthdateStr = params.profile?.basic?.birthdate?.trim() || '';
  if (!birthdateStr) {
    return {
      status: 'skipped',
      engineVersion: HONGGUK_QIMEN_ENGINE_VERSION,
      method: HONGGUK_QIMEN_METHOD,
      note: '생년월일 미입력으로 홍국기문 4주 9궁 수리 포국 생략',
    };
  }

  try {
    const saju = calculateDetailedSaju(params.profile ?? null);
    if (!saju || !saju.pillars?.year || !saju.pillars?.month || !saju.pillars?.day) {
      return {
        status: 'skipped',
        engineVersion: HONGGUK_QIMEN_ENGINE_VERSION,
        method: HONGGUK_QIMEN_METHOD,
        note: '사주 4주 산출 실패로 홍국기문 포국 생략',
      };
    }

    const pillarsData: Array<{ pillar: string; gan: string; zhi: string }> = [
      { pillar: '년주', gan: saju.pillars.year.gan, zhi: saju.pillars.year.zhi },
      { pillar: '월주', gan: saju.pillars.month.gan, zhi: saju.pillars.month.zhi },
      { pillar: '일주', gan: saju.pillars.day.gan, zhi: saju.pillars.day.zhi },
    ];
    const hourPillar = saju.pillars.hour || null;
    const timeKnown = Boolean(hourPillar);
    if (hourPillar) pillarsData.push({ pillar: '시주', gan: hourPillar.gan, zhi: hourPillar.zhi });

    // 1. 4주 간지 수리 (하도 생성수·후천 12진수 및 1~9 구성환원 궁수)
    const numerals = pillarsData.map(({ pillar, gan, zhi }) => {
      const ganNumber = STEM_NUMBERS[gan];
      const zhiNumber = BRANCH_NUMBERS[zhi];
      if (!ganNumber || !zhiNumber) throw new RangeError(`간지 수리 실패: ${gan}${zhi}`);
      return { pillar, gan, zhi, ganNumber, zhiNumber, ganPalace: palaceOf(ganNumber), zhiPalace: palaceOf(zhiNumber) };
    });

    // 2. 지반수(地盤數) 중궁 — 4주 지지 궁수의 합, 천반수(天盤數) 중궁 — 4주 천간 궁수의 합
    const earthCenterNumber = palaceOf(numerals.reduce((sum, n) => sum + n.zhiPalace, 0));
    const heavenCenterNumber = palaceOf(numerals.reduce((sum, n) => sum + n.ganPalace, 0));

    const starNameOf = (n: number) => HONGGUK_NINE_PALACES.find((p) => p.palace === n)?.starName || '황';

    // 3. 9궁 비성 포국 (중궁 기점 낙서 비행 경로 역행 배열)
    //    구성(九星)의 색은 입한 궁이 아니라 별의 수(數)를 따른다: 1백·2흑·3벽·4록·5황·6백·7적·8백·9자.
    const palaces: HonggukQimenPalace[] = HONGGUK_FLIGHT_PATH.map((palace, step) => {
      const basis = HONGGUK_NINE_PALACES.find((p) => p.palace === palace)!;
      const gate = HONGGUK_EIGHT_GATES[palace];
      const heavenStarNumber = flyingStar(heavenCenterNumber, step);
      const earthStarNumber = flyingStar(earthCenterNumber, step);
      return {
        palace,
        name: basis.name,
        direction: basis.direction,
        heavenStar: starNameOf(heavenStarNumber),
        heavenStarNumber,
        earthStar: starNameOf(earthStarNumber),
        earthStarNumber,
        gate: palace === 5 ? '사문(死門) 기궁(寄宮)' : gate.gate,
        gateCategory: palace === 5 ? '흉문' : gate.category,
      };
    });

    const basisOf = (palace: number) => HONGGUK_NINE_PALACES.find((p) => p.palace === palace)!;
    /** 궁수가 낙서 비행 경로에서 몇 번째 칸인지 (중궁=0) */
    const stepOf = (palace: number) => HONGGUK_FLIGHT_PATH.indexOf(palace);
    /** 그 궁에 입한 천반 비성의 수(數) */
    const heavenStarAt = (palace: number) => flyingStar(heavenCenterNumber, stepOf(palace));

    // 4. 3대 핵심 거점 수리 식별
    //    세효(본신): 연간(기반의 천간) + 일지(자기 자리의 지지)
    const yearGan = numerals[0];
    const dayZhi = numerals[2];
    const sePalace = palaceOf(yearGan.ganPalace + dayZhi.zhiPalace);
    //    응효(상대·환경): 월지(사회 환경) + 시간(결실·상대 반응). 생시 미입력 시 월지 단독.
    const monthZhi = numerals[1];
    const hourGan = timeKnown ? numerals[3] : null;
    const eungPalace = hourGan ? palaceOf(monthZhi.zhiPalace + hourGan.ganPalace) : monthZhi.zhiPalace;

    const buildKeyPoint = (label: string, role: string, palace: number, extraNote: string): HonggukQimenKeyPoint => {
      const gateDef = HONGGUK_EIGHT_GATES[palace];
      const isJungGung = palace === 5;
      const gate = isJungGung ? '사문(死門) 기궁(寄宮)' : gateDef.gate;
      const gateCategory: HonggukGateDef['category'] = isJungGung ? '흉문' : gateDef.category;
      const element = elementOfGanZhi(basisOf(palace).palaceGan, basisOf(palace).palaceZhi);
      const deukMun = gateCategory === '길문';
      const star = starNameOf(heavenStarAt(palace));
      const gateNote = isJungGung
        ? `${label}이 중궁(5궁)에 입해 사건의 본질과 본신이 겹친다. 중궁은 문이 없어 곤궁 사문에 기궁하므로 득문으로 세지 않는다.`
        : `${label}이 ${gate}(${gateCategory})을(를) 입수${deukMun ? '해 득문(得門)' : '했으나 길문이 아니어서 득문으로 세지 않는다'}.`;
      return {
        label, role, palace,
        palaceName: basisOf(palace).name,
        star,
        element,
        gate,
        gateCategory,
        deukMun,
        note: `${gateNote} ${extraNote}`.trim(),
      };
    };

    const seYao = buildKeyPoint('세효(世爻)·본신', '나 자신과 주체의 역량·기운', sePalace, `천반 ${starNameOf(heavenStarAt(sePalace))}성 ${basisOf(sePalace).direction}방위 — 연간·일지 수리의 자리.`);
    const eungYao = buildKeyPoint('응효(應爻)·상대', '상대방·환경·시장 반응', eungPalace, timeKnown
      ? `천반 ${starNameOf(heavenStarAt(eungPalace))}성 ${basisOf(eungPalace).direction}방위 — 월지·시간 수리의 자리.`
      : `천반 ${starNameOf(heavenStarAt(eungPalace))}성 ${basisOf(eungPalace).direction}방위 — 생시 미입력으로 월지 단독 수리, 시간 반영 시 위치 변동 가능.`);
    const jungGung = buildKeyPoint('중궁(中宮)·핵심', '일의 본질과 사건의 중심축', 5, `천반수 ${heavenCenterNumber}·지반수 ${earthCenterNumber} 별이 중궁에 입해 사건의 중심축을 이룬다.`);

    const keyPointRelations: HonggukQimenKeyRelation[] = [
      judgeRelation('세효', '응효', seYao.element, eungYao.element),
      judgeRelation('세효', '중궁', seYao.element, jungGung.element),
      judgeRelation('중궁', '응효', jungGung.element, eungYao.element),
    ];

    // 5. 삼형(三刑) 진단 및 파극 위험도
    const zhis = numerals.map((n) => n.zhi);
    const sanHyeongSets: ReadonlyArray<{ type: '인사신 삼형(寅巳申)' | '축술미 삼형(丑戌未)'; branches: ReadonlyArray<string> }> = [
      { type: '인사신 삼형(寅巳申)', branches: ['寅', '巳', '申'] },
      { type: '축술미 삼형(丑戌未)', branches: ['丑', '戌', '未'] },
    ];
    let formedType: '인사신 삼형(寅巳申)' | '축술미 삼형(丑戌未)' | null = null;
    let partial = false;
    const involvedBranches: string[] = [];
    for (const set of sanHyeongSets) {
      const present = set.branches.filter((b) => zhis.includes(b));
      if (present.length === 3) { formedType = set.type; involvedBranches.push(...present); }
      else if (present.length === 2) { partial = true; involvedBranches.push(...present); }
    }
    const chungCount = HONGGUK_CHUNG_PAIRS.filter(([a, b]) => zhis.includes(a) && zhis.includes(b)).length;
    const sePalaceZhi = basisOf(sePalace).palaceZhi;
    const hyeongTouchesSeYao = involvedBranches.some((b) => BRANCH_NUMBERS[b] !== undefined && palaceOf(BRANCH_NUMBERS[b]) === sePalace)
      || involvedBranches.includes(sePalaceZhi);
    let riskIndex = 0;
    if (formedType) riskIndex += 70;
    else if (partial) riskIndex += 40;
    riskIndex += chungCount * 15;
    if (hyeongTouchesSeYao) riskIndex += 10;
    riskIndex = Math.min(100, riskIndex);
    const samhyeongNote = formedType
      ? `${formedType}이 4주 지지에서 완성되었다. 형(刑)은 조정·질서의 살이어서 절차·계약·법률·인간관계의 균열이 벌어지기 쉽고, 육충이 ${chungCount}조 겹쳐 파극 위험도가 ${riskIndex}점에 이른다. 세효의 움직임은 신중히, 계약서·증빙·상호 합의를 반드시 남긴다.`
      : partial
        ? `삼형은 미성립이었으나 형 지지 ${involvedBranches.join('·')} 2개가 갖춰진 잠재 형이다. 제3의 지지가 더해지면 형동(刑動)으로 발화하므로 ${riskIndex}점의 주의 지수를 유지한다.`
        : `인사신·축술미 어느 삼형도 성립하지 않았고 잠재 형도 없다. 파극 위험도 ${riskIndex}점으로 형살의 견제는 평온하다.`;

    // 6. 통기(通氣) — 오행 상생 순환 완성도 (0~100)
    const allGanZhi = numerals.flatMap((n) => [n.gan, n.zhi]);
    const elementCounts: Record<string, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
    for (const gz of allGanZhi) {
      const el = STEM_ELEMENT[gz] || BRANCH_ELEMENT[gz];
      if (el) elementCounts[el] += 1;
    }
    const activeCycles: string[] = [];
    const missingCycles: string[] = [];
    for (const [src, dst, label] of HONGGUK_TONGGI_CYCLES) {
      if (elementCounts[src] > 0 && elementCounts[dst] > 0) activeCycles.push(label);
      else missingCycles.push(label);
    }
    const tonggiScore = activeCycles.length * 20;
    const tonggiNote = tonggiScore >= 80
      ? `상생 통기가 ${activeCycles.length}/5 간선으로 거의 완숙하다(${tonggiScore}점). 기운이 끊김 없이 도는 유통 판이라 시도한 일이 자연히 다음 단계로 흘러간다.`
      : tonggiScore >= 40
        ? `상생 통기가 ${activeCycles.length}/5 간선으로 부분 유통 중이다(${tonggiScore}점). ${missingCycles.join('·')} 구간이 끊겨 있어 그 오행 보충이 곧 개운의 지렛대다.`
        : `상생 통기가 ${activeCycles.length}/5 간선으로 크게 막혀 있다(${tonggiScore}점). 기운이 정체되어 단독 돌파보다 보완·협력 설계가 우선이다.`;

    // 7. 8문 격국 판정 — 세효 득문 + 삼형 + 통기 종합
    const deukMun = seYao.deukMun;
    let pattern: string;
    let summary: string;
    let advice: string;
    if (formedType && riskIndex >= 70) {
      pattern = '대흉격(파극 위험)';
      summary = `세효가 ${seYao.gate || '무문'}에 있고 ${formedType}이 성립해 파극 위험도 ${riskIndex}점이다. ${tonggiScore}점의 통기로도 형살의 균열을 메추기 어려운 격국.`;
      advice = '계약·소송·이별·정산 등 형(刑)이 걸리는 일은 절대 단행하지 말고 기존 질서를 지키며 시기를 미룬다. 길문(개·휴·생) 방위의 조용한 정비가 최선의 처방이다.';
    } else if (formedType) {
      pattern = '소흉격(형동)';
      summary = `세효가 ${seYao.gate || '무문'}에 있으나 ${formedType}이 성립해 형동(刑動)의 격국이다(파극 위험도 ${riskIndex}점, 통기 ${tonggiScore}점).`;
      advice = '문서·약속·분쟁의 실마리를 먼저 정리하고, 상대(응효)와의 절차를 투명하게 남긴다. 득문 여부와 무관하게 서두르는 판수를 줄이면 흉이 반으로 줄어든다.';
    } else if (deukMun && tonggiScore >= 60) {
      pattern = '대길격';
      summary = `세효가 ${seYao.gate}을(를) 입수해 득문(得門)했고 통기 ${tonggiScore}점으로 상생이 유통하는 길격(吉局)이다. 삼형의 견제도 없다.`;
      advice = `${seYao.palaceName} ${basisOf(sePalace).direction} 방위와 ${seYao.gate?.split('(')[0]}의 기운을 따라 움직이면 판이 가장 잘 열린다. 확장·시작·제안 모두 적기다.`;
    } else if (deukMun) {
      pattern = '중길격';
      summary = `세효가 ${seYao.gate}을(를) 입수해 득문했으나 통기 ${tonggiScore}점으로 유통이 아직 부족한 격국이다. 삼형의 견제는 없다.`;
      advice = `길문의 방위(${basisOf(sePalace).direction})는 살아 있으니 움직이되, ${missingCycles.length ? missingCycles.join('·') + ' 상생 구간의 오행 보충' : '통기 보강'}이 병행되어야 길이 완성된다.`;
    } else if (partial) {
      pattern = '평격(잠재 형 주의)';
      summary = `세효가 ${seYao.gate || '무문'}에 있어 득문하지 못했고, 형 지지 ${involvedBranches.join('·')}가 잠재 형으로 남아 있다(통기 ${tonggiScore}점).`;
      advice = '판을 크게 흔들기보다 현상 유지와 점검이 유리하다. 잠재 형이 발화할 만한 새 계약·새 약속은 조건을 문서로 남겨라.';
    } else if (tonggiScore >= 60) {
      pattern = '평격(통기 유통)';
      summary = `세효가 ${seYao.gate || '무문'}에 있어 득문하지는 못했으나 통기 ${tonggiScore}점으로 기운이 도는 평온한 격국이다. 삼형의 견제도 없다.`;
      advice = '무리한 확장보다 유통되는 기운 위에서 축적하는 편이 낫다. 협력·중개·재정비 성격의 일은 이 판에서 잘 풀린다.';
    } else {
      pattern = '보합격';
      summary = `세효가 ${seYao.gate || '무문'}에 있어 득문하지 못했고 통기 ${tonggiScore}점, 삼형도 조용한 보합의 격국이다.`;
      advice = '결정적 승부수보다 정보 수집과 기반 다지기가 이번 판의 정공법이다. 길문 방위(개·휴·생문 궁)의 기운을 빌려 다음 판을 준비하라.';
    }

    const timeNote = timeKnown ? '' : '생시가 없어 시주를 뺀 3주 수리로 포국했다. 생시를 등록하면 천반수·지반수 중궁과 세효·응효 궁위가 재정렬된다.';

    // 세효궁 천지반 공명, 원국 삼기 회합, 계절별 결단 윈도우 산출
    const seYaoPalace = palaces.find((p) => p.palace === seYao.palace) || palaces[0];
    const heavenEarthResonance = calculateHeavenEarthResonance(seYaoPalace);
    const allGans = numerals.map((n) => n.gan);
    const threeWondersAlliance = calculateThreeWondersAlliance(allGans);
    const tacticalSeasonWindows = calculateTacticalSeasonWindows(seYao.palace);
    const temporalHonggukRhythm = getTemporalHonggukRhythm(now);

    const situationalHonggukAudit = /계약|사업|투자|결정/.test(question)
      ? {
          focusTheme: `세효(${seYao.palaceName}) · ${pattern} 결단 감사`,
          gateNote: summary,
          tacticalStep: advice,
        }
      : {
          focusTheme: `${seYao.palaceName} ⇄ ${eungYao.palaceName} 포국 흐름`,
          gateNote: heavenEarthResonance.overallBalance,
          tacticalStep: tacticalSeasonWindows.strategicPacingAdvice,
        };

    const honggukSynthesisMatrix = {
      coreInsight: `[${pattern}] 세효(${seYao.palaceName})의 ${seYao.gate || '무문'}과 ${threeWondersAlliance.wondersDetected.length ? threeWondersAlliance.wondersDetected.join('·') : '기본'} 기운이 맞물립니다.`,
      recommendedAction: `${tacticalSeasonWindows.peakActionSeason} 흐름에 맞추어 ${advice.slice(0, 48)}`,
      cautionNotice: formedType
        ? `${formedType} 형살의 균열을 방지하기 위해 문서·절차 증빙을 철저히 하십시오.`
        : '길문 방위라도 통기 순환이 끊긴 오행을 보완해야 길함이 온전해집니다.',
    };

    const ritualAction = `[${seYao.palaceName} · ${seYao.gate || '중궁 기궁'}] ${honggukSynthesisMatrix.recommendedAction}`;
    const reflectionFocus = `세효(${seYao.palaceName})와 응효(${eungYao.palaceName})의 대치 속에서 ${situationalHonggukAudit.focusTheme}을(를) 열기 위해 내가 먼저 정돈할 한 가지는 무엇입니까?`;
    const qClean = (params.question ?? '').trim();
    const reflectiveQuestion = qClean
      ? `지금 "${qClean}" 앞에서 세효(${seYao.palaceName})의 ${seYao.gate || '중궁 기궁'} 흐름을 열기 위해 내가 먼저 정돈할 한 가지는 무엇입니까?`
      : reflectionFocus;

    return {
      status: 'calculated',
      engineVersion: HONGGUK_QIMEN_ENGINE_VERSION,
      calculatedAtKst: temporalHonggukRhythm.kstTimeLabel,
      method: HONGGUK_QIMEN_METHOD,
      targetYear: params.targetYear,
      fourPillars: {
        year: `${saju.pillars.year.gan}${saju.pillars.year.zhi}`,
        month: `${saju.pillars.month.gan}${saju.pillars.month.zhi}`,
        day: `${saju.pillars.day.gan}${saju.pillars.day.zhi}`,
        hour: hourPillar ? `${hourPillar.gan}${hourPillar.zhi}` : null,
        timeKnown,
      },
      numerals,
      earthCenterNumber,
      heavenCenterNumber,
      palaces,
      keyPoints: { seYao, eungYao, jungGung },
      keyPointRelations,
      samhyeong: {
        type: formedType,
        formed: Boolean(formedType),
        partial,
        involvedBranches,
        riskIndex,
        note: samhyeongNote,
      },
      tonggi: {
        score: tonggiScore,
        activeCycles,
        missingCycles,
        elementCounts,
        note: tonggiNote,
      },
      eightGatesVerdict: {
        seYaoGate: seYao.gate,
        deukMun,
        pattern,
        summary,
        advice,
      },
      heavenEarthResonance,
      threeWondersAlliance,
      tacticalSeasonWindows,
      situationalHonggukAudit,
      temporalHonggukRhythm,
      honggukSynthesisMatrix,
      ritualAction,
      reflectionFocus,
      reflectiveQuestion,
      boundaryNotice: '본 결과는 조선 정통 홍국기문 9궁 수리 포국과 8문 법칙에 기반한 정성적 전략 가이드이며, 확정적 예언이 아닙니다.',
      interpretiveBoundary: '본 결과는 조선 정통 홍국기문 9궁 수리 포국과 8문 법칙에 기반한 정성적 전략 가이드이며, 확정적 예언이 아닙니다.',
      note: timeNote || undefined,
    };
  } catch (err: any) {
    return {
      status: 'error',
      engineVersion: HONGGUK_QIMEN_ENGINE_VERSION,
      method: HONGGUK_QIMEN_METHOD,
      note: err?.message || '홍국기문 9궁 수리 포국 실패',
    };
  }
}

/** 홍국기문 결과를 상담 프롬프트에 주입하기 위한 구조화 텍스트 */
export function formatHonggukQimenPrompt(result: HonggukQimenResult): string {
  if (result.status !== 'calculated' || !result.palaces || !result.keyPoints) {
    return `[홍국기문(洪局奇門)] ${result.status === 'skipped' ? '생년월일 미입력으로 포국하지 않음 — 임의 포국 금지, 생년월일시를 받으면 계산실에서 재산출' : `계산 실패(${result.note || ''}) — 실패한 포국을 지어내지 마.`}`;
  }

  const board = result.palaces
    .map((p) => `${p.name}(${p.direction}) 천반 ${p.heavenStarNumber}${p.heavenStar} · 지반 ${p.earthStarNumber}${p.earthStar} · ${p.gate || '무문'} [${p.gateCategory}]`)
    .join('\n');

  const kp = result.keyPoints;
  const relations = (result.keyPointRelations || []).map((r) => `- ${r.from}(${r.fromElement}) → ${r.to}(${r.toElement}): ${r.relation} — ${r.note}`).join('\n');
  const sh = result.samhyeong!;
  const tg = result.tonggi!;
  const verdict = result.eightGatesVerdict!;

  const riskTone = sh.riskIndex >= 70 ? '고위험 경계' : sh.riskIndex >= 40 ? '잠재 주의' : '평온 안정';
  const tonggiTone = tg.score >= 80 ? '완숙 유통' : tg.score >= 40 ? '부분 유통' : '정체 보완 필요';
  const wondersTone = result.threeWondersAlliance
    ? result.threeWondersAlliance.wondersEmpowermentIndex >= 80
      ? '강한 귀인 원조'
      : result.threeWondersAlliance.wondersEmpowermentIndex >= 60
        ? '안정적 조력'
        : '자력 돌파 중심'
    : '';

  return `[☯️ 조선 정통 홍국기문 4주 9궁 수리 포국 (결정론 엔진 ${HONGGUK_QIMEN_ENGINE_VERSION})]
${result.calculatedAtKst ? `연산 시각: ${result.calculatedAtKst}\n` : ''}산법: ${result.method}
원국 4주: ${result.fourPillars!.year}년 ${result.fourPillars!.month}월 ${result.fourPillars!.day}일 ${result.fourPillars!.hour ? result.fourPillars!.hour + '시' : '(생시 미입력)'} ${result.note ? '· ' + result.note : ''}
4주 수리: ${(result.numerals || []).map((n) => `${n.pillar} ${n.gan}${n.zhi} (천간 ${n.ganNumber}→궁${n.ganPalace}, 지지 ${n.zhiNumber}→궁${n.zhiPalace})`).join(' | ')}
지반수 중궁: ${result.earthCenterNumber} · 천반수 중궁: ${result.heavenCenterNumber} (중궁 기점 건→태→간→리→감→곤→진→손 역행 비행 배열)

[9궁 천지반 포국]
${board}

[3대 핵심 거점]
- 세효(世爻·본신): ${kp.seYao.palaceName} · 천반 ${kp.seYao.star}성 · ${kp.seYao.element}오행 · ${kp.seYao.gate} — ${kp.seYao.note}
- 응효(應爻·상대): ${kp.eungYao.palaceName} · 천반 ${kp.eungYao.star}성 · ${kp.eungYao.element}오행 · ${kp.eungYao.gate} — ${kp.eungYao.note}
- 중궁(中宮·핵심): ${kp.jungGung.palaceName} · 천반 ${kp.jungGung.star}성 · ${kp.jungGung.element}오행 — ${kp.jungGung.note}
[3궁 상생·상극 대조]
${relations}

[삼형(三刑) 진단]
- 형성: ${sh.type || '미성립'} (성립 ${sh.formed ? '예' : '아니오'} / 잠재 형 ${sh.partial ? '있음' : '없음'}) · 파극 위험도 [${riskTone}]
- 판정: ${sh.note.replace(/\d+점/g, riskTone)}

[통기(通氣) — 오행 상생 순환 ${tonggiTone}]
- 유통 간선: ${tg.activeCycles.length ? tg.activeCycles.join(' → ') + ' → (순환)' : '없음 (정체)'}
- 결손 간선: ${tg.missingCycles.length ? tg.missingCycles.join('·') : '없음 (완숙)'}
- 오행 분포: 목${tg.elementCounts['목']} 화${tg.elementCounts['화']} 토${tg.elementCounts['토']} 금${tg.elementCounts['금']} 수${tg.elementCounts['수']}
- 판정: ${tg.note.replace(/\(\d+점\)/g, `(${tonggiTone})`)}

[8문 길흉 격국]
- 세효 입문: ${verdict.seYaoGate || '무문(중궁 기궁)'} · 득문(得門) ${verdict.deukMun ? '성립' : '미성립'}
- 격국: ${verdict.pattern}
- 총평: ${verdict.summary.replace(/\d+점/g, '').replace(/\s{2,}/g, ' ')}
- 처방: ${verdict.advice}

${result.heavenEarthResonance ? `[천지반 홍국수 생극 공명]\n- ${result.heavenEarthResonance.overallBalance}\n  * 해석: ${result.heavenEarthResonance.seYaoResonance.interpretation}` : ''}
${result.threeWondersAlliance ? `[삼기(三奇) 득기 회합]\n- 감지된 삼기: ${result.threeWondersAlliance.wondersDetected.length ? result.threeWondersAlliance.wondersDetected.join(' · ') : '없음'} · 원조 흐름 [${wondersTone}]\n  * 귀인 조력: ${result.threeWondersAlliance.nobleSponsorship}` : ''}
${result.tacticalSeasonWindows ? `[4계절 거시 결단 윈도우]\n- 최적 추진기: ${result.tacticalSeasonWindows.peakActionSeason} · 내실 수성기: ${result.tacticalSeasonWindows.defensiveSeason}\n  * 전술 가이드: ${result.tacticalSeasonWindows.strategicPacingAdvice}` : ''}
${result.situationalHonggukAudit ? `[질문 맥락 감사]\n- ${result.situationalHonggukAudit.focusTheme}: ${result.situationalHonggukAudit.tacticalStep}` : ''}
${result.temporalHonggukRhythm ? `[KST 시공간 기문 리듬]\n- ${result.temporalHonggukRhythm.palaceWatchWindow} / ${result.temporalHonggukRhythm.seasonalQimenTone}\n  * 시공간 지침: ${result.temporalHonggukRhythm.temporalGuidance}` : ''}
${result.honggukSynthesisMatrix ? `[홍국기문 교차 매트릭스]\n- 핵심(${result.honggukSynthesisMatrix.coreInsight}) | 실행(${result.honggukSynthesisMatrix.recommendedAction}) | 주의(${result.honggukSynthesisMatrix.cautionNotice})` : ''}
${result.ritualAction ? `- 실천 의례(Ritual Action): ${result.ritualAction}` : ''}
${result.reflectionFocus ? `- 성찰 초점(Reflection Focus): ${result.reflectionFocus}` : ''}
${result.reflectiveQuestion ? `- 질문 맞춤 성찰 질문: ${result.reflectiveQuestion}` : ''}
${result.boundaryNotice ? `- 해석 경계: ${result.boundaryNotice}` : ''}

위 포국은 사주 4주 간지의 하도·낙서 수리로 직접 계산한 고정 결과다. 궁위·문·삼형·통기를 임의로 바꾸어 말하지 말고, 세효(사용자)를 주체로 응효(상대·환경)와 대비해 해석하라. 상대 프로필이 별도로 있어도 이 포국의 응효는 사용자 원국의 상대 자리임을 유지하라.`;
}
