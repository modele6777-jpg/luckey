/**
 * =========================================================================
 * LUCKEY 정통 베딕 조티시(Vedic Jyotish) 27 나크샤트라(Nakshatra) &
 * 120년 빔쇼타리 다샤(Vimshottari Dasha) 마하다샤·안타르다샤 9×9 매트릭스 &
 * 12 라시(Rashi) 결정론적 엔진
 * (Authentic Vedic Jyotish 27-Nakshatra & 120-Year Vimshottari Dasha Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리·천문·역법 결정론적 계산 (Deterministic).
 *    동일한 생년월일시 입력에 대해 항상 100% 동일한 나크샤트라·다샤 타임라인을 산출한다.
 *
 * 2. 정통 27 나크샤트라(Nakshatra) & 108 파다(Pada):
 *    항성황도(고정 별자리)를 13°20'씩 27등분한 달의 궁(月宿) 체계.
 *    각 나크샤트라는 다시 3°20'씩 4개 파다로 나뉘며 전황도 108 파다(=나바암사)가 된다.
 *    주재신(Deity)·상징(Symbol)·지배 행성(Lord)·군(Gana)·원소(Tattva)·카스트(Caste)는
 *    고전 바라하미히라 계승 문헌의 통용표를 따른다.
 *    - 지배 행성은 케투→금성→태양→달→화성→라후→목성→토성→수성의 빔쇼타리 순환.
 *    - 파다 1~4의 나바암사 주인은 황도 108분할의 연속 규칙(아슈비니 파다1=메샤)을 따른다.
 *    - 군(Gana): 신성(Deva)·인간(Manushya)·마성(Rakshasa) 각 9개씩.
 *    - 원소(Tattva): 지(1~5)·수(6~11)·화(12~17)·풍(18~22)·공(23~27)의 판차부타 분류.
 *
 * 3. 항성황도(Sidereal / Lahiri Ayanamsa) 경도 산출:
 *    astronomy-engine의 지구중심 황경(열대)에 라히리 아얀암사를 차감한다.
 *    아얀암사는 J2000 기준값(23°51'11")에 IAU 2006 일반 세차 다항식을 더한 값이며
 *    정밀 Lahiri 천문력은 아니므로 경계 부근의 결과는 확정하지 않는다.
 *
 * 4. 120년 빔쇼타리 다샤(Vimshottari Dasha):
 *    케투(7년)·금성(20)·태양(6)·달(10)·화성(7)·라후(18)·목성(16)·토성(19)·수성(17)
 *    = 총 120년. 출생 나크샤트라의 지배 행성에서 출생 잔여 다샤(Balance of Dasha)로 시작해
 *    9대 마하다샤(Mahadasha)가 순환하고, 각 마하다샤 안에서 9개 안타르다샤(Antardasha,
 *    기간 = 마하다샤 연수 × 안타르다샤 주인 연수 ÷ 120)가 같은 순서로 진행된다.
 *    마하다샤 9 × 안타르다샤 9 = 총 81개 세부 운세 주기를 전수 산출한다.
 *    다샤 연수는 통용 관례(태양년 365.25일)로 환산한다.
 *
 * 5. 12 라시(Rashi):
 *    찬드라 라시(달 별자리)·수리야 라시(태양 별자리)는 항성황도에서 직접 산출하고,
 *    라그나 라시(상승궁)는 생시와 지원 출생도시가 있을 때만 산출한다.
 *    생시가 없으면 정오(12:00 현지 기준) 참고값으로 찬드라 나크샤트라·마하다샤를
 *    안전하게 산출한다(null-safe).
 */

import { Body, GeoVector, Ecliptic } from 'astronomy-engine';
import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate } from '../lunarCalendar';
import { parseBirthTime } from '../birthDateTime';
import { calculateNatalChart, ZODIAC_SIGNS } from '../astrologyAnalysis';

export const VEDIC_ENGINE_VERSION = 'LUCKEY-VD-v2.3.0';

export type VedicQuestionTopic = 'dasha' | 'career' | 'wealth' | 'relation' | 'general';

function classifyVedicTopic(q: string): VedicQuestionTopic {
  if (/다샤|주기|흐름|시기|나크샤트라/.test(q)) return 'dasha';
  if (/이직|커리어|직장|사업|성취/.test(q)) return 'career';
  if (/재물|투자|돈|자산|아르타/.test(q)) return 'wealth';
  if (/관계|연애|결혼|카마|사람/.test(q)) return 'relation';
  return 'general';
}

const VEDIC_SHADOW_WARNINGS: Record<VedicQuestionTopic, string> = {
  dasha: '다샤의 길흉 이름에만 매여 현재 안타르다샤가 요구하는 실제 역량 축적을 미루지 마십시오.',
  career: '라후나 화성 다샤의 추진력이 강할수록 목표를 좁히지 않고 문어발식으로 벌이면 피로가 누적됩니다.',
  wealth: '아르타(현실 성취) 기운이 살아날 때 과시적 지출이나 검증 없는 낙관을 경계하십시오.',
  relation: '감정의 파동이 커지는 시기에는 상대의 의도를 추측하기보다 사실 확인을 먼저 두십시오.',
  general: '베딕 점성술의 카르마 지도는 숙명이 아니라, 오늘의 선택으로 다듬어 가는 성찰의 나침반입니다.',
};

function formatVedicKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export const VEDIC_METHOD =
  '정통 베딕 조티시 결정론 산법: J2000 라히리(Lahiri) 기준값 + IAU 2006 일반 세차 다항식 아얀암사 기반 항성황도 달·태양 경도로 27 나크샤트라·108 파다(주재신·상징·지배 행성·군·원소·카스트·나바암사 파다주인) 산출, 120년 빔쇼타리 다샤의 9대 마하다샤와 마하다샤×안타르다샤 9×9=81구간 타임라인(태양년 365.25일 환산, 출생 잔여 다샤 포함) 및 현재 마하다샤·안타르다샤 식별, 찬드라·수리야·라그나 12 라시 산출';

export type VedicGana = '신성(Deva)' | '인간(Manushya)' | '마성(Rakshasa)';
export type VedicTattva = '지(土·Prithvi)' | '수(水·Apas)' | '화(火·Tejas)' | '풍(風·Vayu)' | '공(空·Akasha)';

export interface VedicNakshatraInfo {
  index: number; // 0 ~ 26
  number: number; // 1 ~ 27
  name: string; // 아슈비니
  sanskrit: string; // Ashwini
  lord: string; // 지배 행성 (빔쇼타리 순환)
  deity: string; // 주재신
  symbol: string; // 상징
  gana: VedicGana; // 군 (신/인/마)
  tattva: VedicTattva; // 원소 (판차부타)
  caste: string; // 카스트(바르나)
  meaning: string; // 나크샤트라 상징 요해
  spanDegrees: { start: number; end: number }; // 항성황도 구간
  pada: number; // 1 ~ 4
  padaDegrees: { start: number; end: number }; // 해당 파다 항성황도 구간
  padaLords: [string, string, string, string]; // 파다 1~4 나바암사 주인
  fractionIntoNakshatra: number; // 나크샤트라 내 진행 비율 0~1
}

export interface VedicAntardasha {
  mahadashaOrdinal: number; // 1 ~ 9
  ordinal: number; // 마하다샤 내 순번 1 ~ 9
  lord: string; // 안타르다샤 주인
  parentLord: string; // 모 마하다샤 주인
  years: number; // 기간 (태양년)
  startYearsAfterBirth: number; // 출생 기준 시작 (첫 마하다샤는 음수 가능)
  endYearsAfterBirth: number;
  startDate: string; // KST
  endDate: string; // KST
  isBirthBeforeStart: boolean; // 출생 이전에 시작된 구간(첫 마하다샤 경과분)
}

export interface VedicMahadasha {
  ordinal: number; // 1 ~ 9
  lord: string;
  nominalYears: number; // 통용 연수 (첫 구간은 잔여분으로 실제 기간과 다름)
  startYearsAfterBirth: number; // 첫 마하다샤는 출생 전에서 시작 (음수)
  endYearsAfterBirth: number;
  startDate: string; // KST
  endDate: string; // KST
  antardashas: VedicAntardasha[]; // 9개 (전수)
}

export interface VedicRashiInfo {
  index: number; // 0 ~ 11 (0=메샤)
  name: string; // 메샤
  hanja: string; // 白羊
  longitude: number; // 항성황도 경도
}

export interface VedicCurrentDasha {
  referenceInstant: string; // KST 기준 시각
  ageYears: number; // 기준 시점 만 나이(연 환산)
  mahadasha: { ordinal: number; lord: string; startDate: string; endDate: string };
  antardasha: { ordinal: number; lord: string; startDate: string; endDate: string };
}

export interface DashaPlanetarySynergy {
  relationship: '미트라(Mitra·상생 우호)' | '사마(Sama·평형 중립)' | '샤트루(Shatru·긴장 단련)';
  synergyScore: number; // 45 ~ 98점
  karmicFocus: string;
}

export interface KendraTrikonaProsperity {
  dharmaProsperityScore: number; // 40 ~ 98점
  dominantHousePillar: string; // 예: '제1하우스 탄누(Tanu) & 제9하우스 다르마(Dharma) 축'
  lifePillarAdvice: string;
}

export interface PurusharthaAlignment {
  dharmaWeight: number; // 0 ~ 100%
  arthaWeight: number; // 0 ~ 100%
  kamaWeight: number; // 0 ~ 100%
  mokshaWeight: number; // 0 ~ 100%
  primarySpiritualAim: string;
}

export interface VedicResult {
  status: 'calculated' | 'skipped' | 'error';
  engineVersion: string;
  calculatedAtKst?: string;
  questionTopic?: VedicQuestionTopic;
  shadowWarning?: string;
  method: string;
  birthInstant?: { utcISOString: string; kstISOString: string; assumedNoon: boolean };
  ayanamsa?: number;
  siderealLongitude?: { moon: number; sun: number };
  nakshatra?: VedicNakshatraInfo;
  dashaBalance?: { lord: string; years: number };
  mahadashas?: VedicMahadasha[]; // 9대 (첫 구간은 잔여분)
  antardashaCount?: number; // 81 (전수)
  currentDasha?: VedicCurrentDasha | null;
  rashi?: {
    chandra: VedicRashiInfo; // 찬드라 라시 (달)
    surya: VedicRashiInfo; // 수리야 라시 (태양)
    lagna: VedicRashiInfo | null; // 라그나 라시 (생시+지원 도시 필요)
  };
  dashaPlanetarySynergy?: DashaPlanetarySynergy | null;
  kendraTrikonaProsperity?: KendraTrikonaProsperity | null;
  purusharthaAlignment?: PurusharthaAlignment | null;
  secondaryAxis?: string;
  reflectiveQuestion?: string;
  interpretiveBoundary?: string;
  ritualAction?: string;
  reflectionFocus?: string;
  vedicSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  note?: string;
}

/** 27 나크샤트라 원시 정의 (색인 0=아슈비니 ~ 26=레바티) */
const NAKSHATRAS_27: ReadonlyArray<{
  name: string;
  sanskrit: string;
  deity: string;
  symbol: string;
  gana: VedicGana;
  tattva: VedicTattva;
  caste: string;
  meaning: string;
}> = [
  { name: '아슈비니', sanskrit: 'Ashwini', deity: '아슈비니 쿠마라(쌍둥이 의신)', symbol: '말 머리', gana: '신성(Deva)', tattva: '지(土·Prithvi)', caste: '바이샤(상인)', meaning: '치유와 신속한 출발의 별' },
  { name: '바라니', sanskrit: 'Bharani', deity: '야마(사(死)의 신)', symbol: '요니(생명의 문)', gana: '인간(Manushya)', tattva: '지(土·Prithvi)', caste: '믈레차(천민)', meaning: '생명의 문과 단죄의 별' },
  { name: '크리티카', sanskrit: 'Krittika', deity: '아그니(화신)', symbol: '칼·불꽃', gana: '마성(Rakshasa)', tattva: '지(土·Prithvi)', caste: '브라만(사제)', meaning: '타듦과 절단의 정화 별' },
  { name: '로히니', sanskrit: 'Rohini', deity: '브라마(창조신)', symbol: '수레·붉은 소', gana: '인간(Manushya)', tattva: '지(土·Prithvi)', caste: '수드라(노동)', meaning: '성장과 풍요의 붉은 별' },
  { name: '므리가시라', sanskrit: 'Mrigashira', deity: '소마(달의 신)', symbol: '사슴 머리', gana: '신성(Deva)', tattva: '지(土·Prithvi)', caste: '바이샤(농부)', meaning: '두루 탐색하는 사슴의 별' },
  { name: '아르드라', sanskrit: 'Ardra', deity: '루드라(폭풍 신)', symbol: '눈물 방울', gana: '인간(Manushya)', tattva: '수(水·Apas)', caste: '믈레차(도살)', meaning: '폭풍 뒤 정화의 별' },
  { name: '푸나르바수', sanskrit: 'Punarvasu', deity: '아디티(무한의 모신)', symbol: '활과 화살통', gana: '신성(Deva)', tattva: '수(水·Apas)', caste: '바이샤(상인)', meaning: '재림과 회복의 별' },
  { name: '푸샤', sanskrit: 'Pushya', deity: '브리하스파티(교단 신)', symbol: '소의 젖통', gana: '신성(Deva)', tattva: '수(水·Apas)', caste: '크샤트리아(전사)', meaning: '영양과 신뢰의 별' },
  { name: '아슐레샤', sanskrit: 'Ashlesha', deity: '나가(뱀신)', symbol: '감은 뱀', gana: '마성(Rakshasa)', tattva: '수(水·Apas)', caste: '믈레차(천민)', meaning: '감기와 응축의 별' },
  { name: '마가', sanskrit: 'Magha', deity: '피트리스(조상령)', symbol: '왕좌', gana: '마성(Rakshasa)', tattva: '수(水·Apas)', caste: '수드라(노동)', meaning: '조상의 왕좌를 잇는 별' },
  { name: '푸르바팔구니', sanskrit: 'Purva Phalguni', deity: '바가(축복의 신)', symbol: '침대 앞다리', gana: '인간(Manushya)', tattva: '수(水·Apas)', caste: '브라만(사제)', meaning: '휴식과 향락의 별' },
  { name: '우타라팔구니', sanskrit: 'Uttara Phalguni', deity: '아리야만(계약의 신)', symbol: '침대 뒷다리', gana: '인간(Manushya)', tattva: '화(火·Tejas)', caste: '크샤트리아(전사)', meaning: '동맹과 후원의 별' },
  { name: '하스타', sanskrit: 'Hasta', deity: '사비트리(태양 신)', symbol: '손', gana: '신성(Deva)', tattva: '화(火·Tejas)', caste: '바이샤(상인)', meaning: '손끝 숙련의 별' },
  { name: '치트라', sanskrit: 'Chitra', deity: '트바슈타르(신성 대장장이)', symbol: '빛나는 보석', gana: '마성(Rakshasa)', tattva: '화(火·Tejas)', caste: '바이샤(농부)', meaning: '설계와 창조의 별' },
  { name: '스와티', sanskrit: 'Swati', deity: '바유(바람 신)', symbol: '바람에 흔들리는 새싹', gana: '신성(Deva)', tattva: '화(火·Tejas)', caste: '믈레차(도살)', meaning: '독립과 유연의 별' },
  { name: '비샤카', sanskrit: 'Vishakha', deity: '인드라·아그니', symbol: '개선문', gana: '마성(Rakshasa)', tattva: '화(火·Tejas)', caste: '믈레차(천민)', meaning: '목표 수확의 별' },
  { name: '아누라다', sanskrit: 'Anuradha', deity: '미트라(우정의 신)', symbol: '연꽃', gana: '신성(Deva)', tattva: '화(火·Tejas)', caste: '수드라(노동)', meaning: '우정과 따름의 별' },
  { name: '제슈타', sanskrit: 'Jyeshtha', deity: '인드라(천제)', symbol: '원형 부적', gana: '마성(Rakshasa)', tattva: '풍(風·Vayu)', caste: '바이샤(농부)', meaning: '장로의 권위 별' },
  { name: '물라', sanskrit: 'Mula', deity: '니리티(파괴의 신)', symbol: '뿌리 뭉치', gana: '마성(Rakshasa)', tattva: '풍(風·Vayu)', caste: '믈레차(도살)', meaning: '뿌리 탐구와 해체의 별' },
  { name: '푸르바아샤다', sanskrit: 'Purva Ashadha', deity: '아파스(물의 신)', symbol: '부채·개선 기', gana: '인간(Manushya)', tattva: '풍(風·Vayu)', caste: '브라만(사제)', meaning: '무적의 선언 별' },
  { name: '우타라아샤다', sanskrit: 'Uttara Ashadha', deity: '비슈베데바스(만신)', symbol: '코끼리 엄니', gana: '인간(Manushya)', tattva: '풍(風·Vayu)', caste: '크샤트리아(전사)', meaning: '최후의 승리 별' },
  { name: '슈라바나', sanskrit: 'Shravana', deity: '비슈누(유지 신)', symbol: '귀·세 발자국', gana: '신성(Deva)', tattva: '풍(風·Vayu)', caste: '바이샤(상인)', meaning: '경청과 학습의 별' },
  { name: '다니슈타', sanskrit: 'Dhanishta', deity: '여덟 바수스(풍요의 신)', symbol: '북·피리', gana: '마성(Rakshasa)', tattva: '공(空·Akasha)', caste: '바이샤(농부)', meaning: '리듬과 부(富)의 별' },
  { name: '샤타비샤', sanskrit: 'Shatabhisha', deity: '바루나(수(水)의 주신)', symbol: '빈 원(허공의 원)', gana: '마성(Rakshasa)', tattva: '공(空·Akasha)', caste: '믈레차(천민)', meaning: '백 가지 치유의 별' },
  { name: '푸르바바드라파다', sanskrit: 'Purva Bhadrapada', deity: '아자에카파다(일족 시바)', symbol: '민반(비단상) 앞다리', gana: '인간(Manushya)', tattva: '공(空·Akasha)', caste: '브라만(사제)', meaning: '격정과 승화의 별' },
  { name: '우타라바드라파다', sanskrit: 'Uttara Bhadrapada', deity: '아히르부드냐(심연의 뱀)', symbol: '민반 뒷다리', gana: '인간(Manushya)', tattva: '공(空·Akasha)', caste: '크샤트리아(전사)', meaning: '심연 지혜의 별' },
  { name: '레바티', sanskrit: 'Revati', deity: '푸샨(목자 신)', symbol: '물고기 한 쌍', gana: '신성(Deva)', tattva: '공(空·Akasha)', caste: '수드라(노동)', meaning: '여정 완주와 길 인도의 별' },
];

/** 12 라시 정의 (색인 0=메샤 ~ 11=미나) */
const RASHIS_12: ReadonlyArray<{ name: string; hanja: string }> = [
  { name: '메샤', hanja: '白羊' },
  { name: '브리샤바', hanja: '金牛' },
  { name: '미투나', hanja: '雙子' },
  { name: '카르카', hanja: '巨蟹' },
  { name: '심하', hanja: '獅子' },
  { name: '칸야', hanja: '處女' },
  { name: '툴라', hanja: '天秤' },
  { name: '브리쉬치카', hanja: '天蝎' },
  { name: '다누', hanja: '人馬' },
  { name: '마카라', hanja: '磨羯' },
  { name: '쿰바', hanja: '寶瓶' },
  { name: '미나', hanja: '雙魚' },
];

/** 빔쇼타리 9대 행성: 순환 순서와 통용 연수 (합 = 120년) */
const DASHA_LORDS = ['케투', '금성', '태양', '달', '화성', '라후', '목성', '토성', '수성'] as const;
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17] as const;
const TOTAL_DASHA_YEARS = DASHA_YEARS.reduce((a, b) => a + b, 0); // 120

/** 나바암사 12별자리 주인 (아슈비니 파다1=메샤에서 황도 순으로 연속) */
const NAVAMSA_SIGN_LORDS = ['화성', '금성', '수성', '달', '태양', '수성', '금성', '화성', '목성', '토성', '토성', '목성'] as const;

/** 다샤 연수 환산에 쓰는 태양년 (일) */
const YEAR_DAYS = 365.25;
/** J2000 라히리 아얀암사 기준값 (23°51'11") */
const AYANAMSA_J2000 = 23.853055556;

const normalize360 = (n: number) => ((n % 360) + 360) % 360;

/**
 * 라히리 아얀암사: J2000 기준값(23°51'11") + 일반 세차(IAU 2006 다항식 5028.796195″T + 1.1054348″T², T = 율리우스 세기).
 * 예전 선형 근사(50.29″/년)보다 1900~2100년에서 더 정밀하다 (차이는 0.01° 안팎).
 */
export function lahiriAyanamsaAt(date: Date): number {
  return lahiriAyanamsaFromUtcMs(date.getTime());
}
export function lahiriAyanamsaFromUtcMs(utcMs: number): number {
  const t = (utcMs - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000 / 36525;
  return AYANAMSA_J2000 + (5028.796195 * t + 1.1054348 * t * t) / 3600;
}

/** 천체의 항성황도(Sidereal / Lahiri 근사) 경도 */
export function siderealLongitude(body: Body, date: Date): number {
  const tropical = Ecliptic(GeoVector(body, date, true)).elon;
  return normalize360(tropical - lahiriAyanamsaAt(date));
}

/** 항성황도 1도 폭 */
const NAKSHATRA_WIDTH = 360 / 27; // 13°20'
const PADA_WIDTH = NAKSHATRA_WIDTH / 4; // 3°20'

/**
 * 항성황도 경도 → 나크샤트라 색인(0~26)·파다(1~4)·진행률 결정론 환산
 * (경도 0° = 아슈비니 파다 1 시작점)
 */
export function nakshatraFromSiderealLongitude(sidereal: number): {
  index: number;
  pada: number;
  fractionIntoNakshatra: number;
} {
  const s = normalize360(sidereal);
  const index = Math.floor(s / NAKSHATRA_WIDTH);
  const within = s - index * NAKSHATRA_WIDTH;
  const pada = Math.floor(within / PADA_WIDTH) + 1;
  return { index, pada: Math.min(4, Math.max(1, pada)), fractionIntoNakshatra: within / NAKSHATRA_WIDTH };
}

/** 나크샤트라 전수 정보 조립 (내부 헬퍼, 색인 0~26·파다 1~4) */
function nakshatraInfo(index: number, pada: number, fractionIntoNakshatra: number): VedicNakshatraInfo {
  const raw = NAKSHATRAS_27[index];
  const spanStart = index * NAKSHATRA_WIDTH;
  const padaStart = spanStart + (pada - 1) * PADA_WIDTH;
  const padaLords = [0, 1, 2, 3].map((p) => NAVAMSA_SIGN_LORDS[(index * 4 + p) % 12]) as [string, string, string, string];
  return {
    index,
    number: index + 1,
    name: raw.name,
    sanskrit: raw.sanskrit,
    lord: DASHA_LORDS[index % 9],
    deity: raw.deity,
    symbol: raw.symbol,
    gana: raw.gana,
    tattva: raw.tattva,
    caste: raw.caste,
    meaning: raw.meaning,
    spanDegrees: { start: spanStart, end: spanStart + NAKSHATRA_WIDTH },
    pada,
    padaDegrees: { start: padaStart, end: padaStart + PADA_WIDTH },
    padaLords,
    fractionIntoNakshatra,
  };
}

/** 나크샤트라 색인·파다로 전수 정보 조회 (단위 검증·표시용 공개 헬퍼) */
export function vedicNakshatraByIndex(index: number, pada = 1): VedicNakshatraInfo {
  if (!Number.isInteger(index) || index < 0 || index > 26) throw new RangeError('0~26 나크샤트라 인덱스가 필요합니다.');
  if (!Number.isInteger(pada) || pada < 1 || pada > 4) throw new RangeError('1~4 파다가 필요합니다.');
  return nakshatraInfo(index, pada, 0);
}

/** 항성황도 경도 → 라시 정보 */
function rashiOfLongitude(longitude: number): VedicRashiInfo {
  const s = normalize360(longitude);
  const index = Math.floor(s / 30) % 12;
  return { index, name: RASHIS_12[index].name, hanja: RASHIS_12[index].hanja, longitude: s };
}

/** 출생 후 경과 연수 → 달력 시각 (태양년 365.25일 환산) */
function yearsToInstant(birthMs: number, years: number): Date {
  return new Date(birthMs + years * YEAR_DAYS * 86400000);
}

/** KST 표기 문자열 (YYYY-MM-DD HH:mm) */
function formatKst(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 3600000);
  return kst.toISOString().replace('T', ' ').slice(0, 16);
}

/** 하나의 마하다샤(첫 구간은 출생 전에서 시작 가능)와 그 안의 9개 안타르다샤 전수 생성 */
function buildMahadasha(
  ordinal: number,
  lordIndex: number,
  startYears: number,
  endYears: number,
  nominalYears: number,
  birthMs: number,
): VedicMahadasha {
  const antardashas: VedicAntardasha[] = [];
  let cursor = startYears;
  for (let j = 0; j < 9; j++) {
    const subLordIndex = (lordIndex + j) % 9;
    // 통용 규칙: 안타르다샤 기간 = 마하다샤 통용 연수 × 안타르다샤 주인 연수 ÷ 120
    // (첫 마하다샤도 통용 연수 전체를 출생 전 시작점에 앵커해 잔여분만 출생 후에 남는다)
    const subYears = (nominalYears * DASHA_YEARS[subLordIndex]) / TOTAL_DASHA_YEARS;
    const subEnd = cursor + subYears;
    antardashas.push({
      mahadashaOrdinal: ordinal,
      ordinal: j + 1,
      lord: DASHA_LORDS[subLordIndex],
      parentLord: DASHA_LORDS[lordIndex],
      years: subYears,
      startYearsAfterBirth: cursor,
      endYearsAfterBirth: subEnd,
      startDate: formatKst(yearsToInstant(birthMs, cursor)),
      endDate: formatKst(yearsToInstant(birthMs, subEnd)),
      isBirthBeforeStart: cursor < 0,
    });
    cursor = subEnd;
  }
  return {
    ordinal,
    lord: DASHA_LORDS[lordIndex],
    nominalYears,
    startYearsAfterBirth: startYears,
    endYearsAfterBirth: endYears,
    startDate: formatKst(yearsToInstant(birthMs, startYears)),
    endDate: formatKst(yearsToInstant(birthMs, endYears)),
    antardashas,
  };
}

/**
 * 120년 빔쇼타리 다샤 전수 타임라인 생성:
 * 출생 나크샤트라 지배 행성의 잔여 다샤(Balance)로 시작해 9대 마하다샤와
 * 각 마하다샤의 9개 안타르다샤(총 81구간)를 결정론적으로 산출한다.
 */
export function buildVimshottariTimeline(birthLordIndex: number, balanceYears: number, birthMs: number): {
  mahadashas: VedicMahadasha[];
  antardashaCount: number;
} {
  if (!Number.isInteger(birthLordIndex) || birthLordIndex < 0 || birthLordIndex > 8) {
    throw new RangeError('0~8 다샤 주인 인덱스가 필요합니다.');
  }
  const firstNominal = DASHA_YEARS[birthLordIndex];
  if (balanceYears <= 0 || balanceYears > firstNominal) {
    throw new RangeError('잔여 다샤 수명은 0초과 첫 주인 연수 이하이어야 합니다.');
  }
  const mahadashas: VedicMahadasha[] = [];
  // 첫 마하다샤는 출생 전 경과분만큼 이전에서 시작해 잔여분만큼 진행한다.
  let cursor = balanceYears - firstNominal;
  for (let i = 0; i < 9; i++) {
    const lordIndex = (birthLordIndex + i) % 9;
    const nominalYears = DASHA_YEARS[lordIndex];
    const end = i === 0 ? balanceYears : cursor + nominalYears;
    mahadashas.push(buildMahadasha(i + 1, lordIndex, cursor, end, nominalYears, birthMs));
    cursor = end;
  }
  return { mahadashas, antardashaCount: mahadashas.reduce((sum, m) => sum + m.antardashas.length, 0) };
}

/** 기준 시각(출생 후 경과 연수)이 포함된 마하다샤·안타르다샤 탐색 */
function findCurrentDasha(
  mahadashas: VedicMahadasha[],
  yearsAfterBirth: number,
  reference: Date,
): VedicCurrentDasha | null {
  for (const m of mahadashas) {
    if (yearsAfterBirth < m.startYearsAfterBirth || yearsAfterBirth >= m.endYearsAfterBirth) continue;
    for (const a of m.antardashas) {
      if (yearsAfterBirth >= a.startYearsAfterBirth && yearsAfterBirth < a.endYearsAfterBirth) {
        return {
          referenceInstant: formatKst(reference),
          ageYears: Math.round(yearsAfterBirth * 100) / 100,
          mahadasha: { ordinal: m.ordinal, lord: m.lord, startDate: m.startDate, endDate: m.endDate },
          antardasha: { ordinal: a.ordinal, lord: a.lord, startDate: a.startDate, endDate: a.endDate },
        };
      }
    }
  }
  return null;
}

/** 대상 연도의 기준 시각: 연도가 주어지면 그 해 7월 2일 정오(KST), 없으면 현재 시각 */
function referenceInstantFor(targetYear?: number, targetDate?: Date): Date {
  if (targetDate) return targetDate;
  if (targetYear !== undefined) {
    if (!Number.isInteger(targetYear) || targetYear < 1900 || targetYear > 2200) {
      throw new RangeError('대상 연도는 1900~2200년이어야 합니다.');
    }
    return new Date(Date.UTC(targetYear, 6, 2, 3, 0, 0)); // KST 정오 = UTC 03:00
  }
  return new Date();
}

/**
 * 베딕 조티시 27 나크샤트라 & 120년 빔쇼타리 다샤 결정론적 계산 함수
 * (동일한 생년월일시 입력 → 항상 100% 동일한 나크샤트라·다샤 타임라인 산출)
 */
export function calculateVedicAdvanced(params: {
  profile?: UserProfile | null;
  targetYear?: number;
  targetDate?: Date;
  question?: string;
}): VedicResult {
  const birthdateStr = params.profile?.basic?.birthdate?.trim() || '';
  if (!birthdateStr) {
    return {
      status: 'skipped',
      engineVersion: VEDIC_ENGINE_VERSION,
      method: VEDIC_METHOD,
      note: '생년월일 미입력으로 나크샤트라·다샤 계산 생략',
    };
  }

  let solarDate: { year: number; month: number; day: number };
  try {
    const resolved = resolveEffectiveSolarDate(birthdateStr, params.profile?.basic?.lunarSolar, params.profile?.basic?.isLeapMonth ?? false);
    solarDate = resolved.solarDate;
    if (solarDate.year < 1900 || solarDate.year > 2100) throw new RangeError('현재 지원 출생연도는 1900~2100년입니다.');
  } catch (err: any) {
    return {
      status: 'error',
      engineVersion: VEDIC_ENGINE_VERSION,
      method: VEDIC_METHOD,
      note: err?.message || '생년월일 파싱 실패',
    };
  }

  // 생시가 있으면 그 시각, 없으면 정오(12:00) 기준 — 지원 도시는 현지 시간대로 환산된다.
  const natal = calculateNatalChart(params.profile);
  const assumedNoon = !parseBirthTime(params.profile?.basic?.birthtime);
  if (!natal?.utcInstant) {
    return {
      status: 'error',
      engineVersion: VEDIC_ENGINE_VERSION,
      method: VEDIC_METHOD,
      note: '출생 시각 환산 실패',
    };
  }
  const birthInstant = new Date(natal.utcInstant);
  const birthMs = birthInstant.getTime();

  // 1. 항성황도 달·태양 경도
  const ayanamsa = lahiriAyanamsaAt(birthInstant);
  const sidMoon = siderealLongitude(Body.Moon, birthInstant);
  const sidSun = siderealLongitude(Body.Sun, birthInstant);

  // 2. 출생 나크샤트라·파다·잔여 다샤 수명(Balance of Dasha)
  const { index, pada, fractionIntoNakshatra } = nakshatraFromSiderealLongitude(sidMoon);
  const nakshatra = nakshatraInfo(index, pada, fractionIntoNakshatra);
  const birthLordIndex = index % 9;
  const balanceYears = DASHA_YEARS[birthLordIndex] * (1 - fractionIntoNakshatra);

  // 3. 120년 빔쇼타리 다샤 전수 타임라인 (9 마하다샤 × 9 안타르다샤 = 81구간)
  const { mahadashas, antardashaCount } = buildVimshottariTimeline(birthLordIndex, balanceYears, birthMs);

  // 4. 현재 마하다샤·안타르다샤 식별 (대상 연도 미지정 시 현재 시각)
  let currentDasha: VedicCurrentDasha | null = null;
  try {
    const reference = referenceInstantFor(params.targetYear, params.targetDate);
    const yearsAfterBirth = (reference.getTime() - birthMs) / 86400000 / YEAR_DAYS;
    currentDasha = findCurrentDasha(mahadashas, yearsAfterBirth, reference);
  } catch (_) {
    currentDasha = null;
  }

  // 5. 12 라시 (라그나는 생시+지원 도시가 있을 때만)
  const chandra = rashiOfLongitude(sidMoon);
  const surya = rashiOfLongitude(sidSun);
  let lagna: VedicRashiInfo | null = null;
  if (natal.ascendant) {
    const ascSignIndex = ZODIAC_SIGNS.findIndex((s) => s.id === natal.ascendant!.sign.id);
    const ascTropical = (ascSignIndex >= 0 ? ascSignIndex : 0) * 30 + natal.ascendant.degree;
    lagna = rashiOfLongitude(normalize360(ascTropical - ayanamsa));
  }

  // 6. 나바그라하 다샤 행성 조화도 (Dasha Planetary Synergy)
  let dashaPlanetarySynergy: DashaPlanetarySynergy | null = null;
  if (currentDasha) {
    const mLord = currentDasha.mahadasha.lord;
    const aLord = currentDasha.antardasha.lord;
    const friends: Record<string, string[]> = {
      '태양': ['달', '화성', '목성'],
      '달': ['태양', '수성'],
      '화성': ['태양', '달', '목성'],
      '수성': ['태양', '금성'],
      '목성': ['태양', '달', '화성'],
      '금성': ['수성', '토성', '라후'],
      '토성': ['수성', '금성', '라후'],
      '라후': ['금성', '토성'],
      '케투': ['금성', '토성'],
    };
    const enemies: Record<string, string[]> = {
      '태양': ['금성', '토성', '라후'],
      '달': ['라후', '케투'],
      '화성': ['수성', '라후'],
      '수성': ['달'],
      '목성': ['수성', '금성'],
      '금성': ['태양', '달'],
      '토성': ['태양', '달', '화성'],
      '라후': ['태양', '달', '화성'],
      '케투': ['태양', '달', '화성'],
    };

    if (mLord === aLord) {
      dashaPlanetarySynergy = {
        relationship: '사마(Sama·평형 중립)',
        synergyScore: 85,
        karmicFocus: `마하다샤 주인 ${mLord}의 자가(自家) 안타르다샤 구간으로, 본연의 행성적 카르마가 가장 순수하게 발현되는 내실 구축기입니다.`,
      };
    } else if (friends[mLord]?.includes(aLord)) {
      dashaPlanetarySynergy = {
        relationship: '미트라(Mitra·상생 우호)',
        synergyScore: 92,
        karmicFocus: `마하다샤 주인 ${mLord}와 안타르다샤 주인 ${aLord}가 상생 우호(Mitra)를 형성하여 대내외적 협력과 기회의 확장이 순조롭습니다.`,
      };
    } else if (enemies[mLord]?.includes(aLord)) {
      dashaPlanetarySynergy = {
        relationship: '샤트루(Shatru·긴장 단련)',
        synergyScore: 58,
        karmicFocus: `마하다샤 주인 ${mLord}와 안타르다샤 주인 ${aLord}가 상충 긴장(Shatru)에 놓여 있어 조급한 확장을 삼가고 인내와 수양이 필요한 단련기입니다.`,
      };
    } else {
      dashaPlanetarySynergy = {
        relationship: '사마(Sama·평형 중립)',
        synergyScore: 76,
        karmicFocus: `마하다샤 주인 ${mLord}와 안타르다샤 주인 ${aLord}가 균형 중립(Sama)을 이루어 차분한 실행과 안정적 결실을 도모하기에 적합합니다.`,
      };
    }
  }

  // 7. 켄드라·트리코나 다르마 번영 스펙트럼 (Kendra-Trikona Prosperity)
  const PILLARS = [
    '제1하우스 탄누(Tanu·신체·정체성) & 제9하우스 다르마(Dharma·행운·영성) 축',
    '제4하우스 반두(Bandhu·가정·내면안정) & 제10하우스 카르마(Karma·직업·명예) 축',
    '제5하우스 푸트라(Putra·지성·창의성) & 제1하우스 탄누(Tanu·주권) 축',
    '제7하우스 자야(Jaya·동반자·파트너십) & 제9하우스 다르마(Dharma·진리) 축',
  ];
  const pillarIdx = (chandra.index + surya.index) % 4;
  const dominantHousePillar = PILLARS[pillarIdx];
  const dharmaProsperityScore = Math.min(98, Math.max(45, 65 + ((chandra.index * 7 + surya.index * 13) % 32)));
  const kendraTrikonaProsperity: KendraTrikonaProsperity = {
    dharmaProsperityScore,
    dominantHousePillar,
    lifePillarAdvice: `찬드라(${chandra.name})와 수리야(${surya.name})의 조응으로 형성된 ${dominantHousePillar}을(를) 중심으로 삶의 중심축을 확립할 때 카르마적 번영 지수가 극대화됩니다.`,
  };

  // 8. 4대 푸루샤르타 인생 목적 가중치 (Purushartha Alignment)
  let dharmaWeight = 25;
  let arthaWeight = 25;
  let kamaWeight = 25;
  let mokshaWeight = 25;
  let primarySpiritualAim = '다르마(Dharma·의로운 소명 완수)';

  switch (nakshatra.tattva) {
    case '지(土·Prithvi)':
      dharmaWeight = 30; arthaWeight = 40; kamaWeight = 15; mokshaWeight = 15;
      primarySpiritualAim = '아르타(Artha·물질적 토대 구축과 번영)';
      break;
    case '수(水·Apas)':
      dharmaWeight = 15; arthaWeight = 15; kamaWeight = 30; mokshaWeight = 40;
      primarySpiritualAim = '모크샤(Moksha·감성적 치유와 영적 정화)';
      break;
    case '화(火·Tejas)':
      dharmaWeight = 40; arthaWeight = 30; kamaWeight = 20; mokshaWeight = 10;
      primarySpiritualAim = '다르마(Dharma·정의로운 행동과 리더십 발휘)';
      break;
    case '풍(風·Vayu)':
      dharmaWeight = 20; arthaWeight = 25; kamaWeight = 40; mokshaWeight = 15;
      primarySpiritualAim = '카마(Kama·지적 탐구와 창조적 열망 실현)';
      break;
    case '공(空·Akasha)':
      dharmaWeight = 25; arthaWeight = 15; kamaWeight = 15; mokshaWeight = 45;
      primarySpiritualAim = '모크샤(Moksha·초월적 직관과 내면의 자유)';
      break;
  }

  const purusharthaAlignment: PurusharthaAlignment = {
    dharmaWeight,
    arthaWeight,
    kamaWeight,
    mokshaWeight,
    primarySpiritualAim,
  };

  const refNow = params.targetDate || new Date();
  const calculatedAtKst = formatVedicKstTimestamp(refNow);
  const q = (params.question || '').trim();
  const questionTopic = classifyVedicTopic(q);
  const shadowWarning = VEDIC_SHADOW_WARNINGS[questionTopic];
  const secondaryAxis = `${surya.name}(수리야·태양) ↔ ${chandra.name}(찬드라·달)`;
  const reflectiveQuestion = q
    ? `‘${q}’ 앞에서 현재 ${currentDasha ? `${currentDasha.mahadasha.lord}-${currentDasha.antardasha.lord}` : nakshatra.name} 다샤 흐름과 ${purusharthaAlignment.primarySpiritualAim}을 어떻게 연결해 실천하시겠습니까?`
    : `${nakshatra.name} 나크샤트라의 기질과 ${purusharthaAlignment.primarySpiritualAim} 사이에서 지금 가장 먼저 다듬을 삶의 중심축은 무엇입니까?`;
  const interpretiveBoundary =
    '해석 경계: 본 베딕 조티시 리포트는 라히리 근방 선형 아얀암사 근사식에 기반한 천문·상징 프레임이며, 경계일 전후의 나크샤트라·다샤 판정이나 현실적 중대 결정은 실제 정황과 함께 신중히 판단해야 합니다.';
  const ritualAction = currentDasha
    ? `현재 ${currentDasha.mahadasha.lord}-${currentDasha.antardasha.lord} 다샤 흐름에 맞추어 ${purusharthaAlignment.primarySpiritualAim}을 뒷받침하는 핵심 과제를 하루 15분 차분히 점검하십시오.`
    : `${nakshatra.name} 나크샤트라의 상징(${nakshatra.symbol})을 떠올리며 ${purusharthaAlignment.primarySpiritualAim}에 닿는 작은 실천을 시작하십시오.`;
  const reflectionFocus = `찬드라 ${chandra.name}와 수리야 ${surya.name} 사이에서 ${purusharthaAlignment.primarySpiritualAim}을 지키는 삶의 중심축`;
  const vedicSynthesisMatrix = {
    dominantTension: currentDasha
      ? `${currentDasha.mahadasha.lord} 마하다샤 ↔ ${currentDasha.antardasha.lord} 안타르다샤`
      : `${nakshatra.name} 나크샤트라 ↔ ${chandra.name} 라시`,
    alignmentState: `${nakshatra.gana} · ${nakshatra.tattva} · ${purusharthaAlignment.primarySpiritualAim}`,
    integratedAction: `${kendraTrikonaProsperity.lifePillarAdvice}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    status: 'calculated',
    engineVersion: VEDIC_ENGINE_VERSION,
    calculatedAtKst,
    questionTopic,
    shadowWarning,
    method: VEDIC_METHOD,
    birthInstant: {
      utcISOString: birthInstant.toISOString(),
      kstISOString: formatKst(birthInstant),
      assumedNoon,
    },
    ayanamsa: Math.round(ayanamsa * 1e6) / 1e6,
    siderealLongitude: { moon: Math.round(sidMoon * 1e6) / 1e6, sun: Math.round(sidSun * 1e6) / 1e6 },
    nakshatra,
    dashaBalance: { lord: DASHA_LORDS[birthLordIndex], years: Math.round(balanceYears * 1e4) / 1e4 },
    mahadashas,
    antardashaCount,
    currentDasha,
    rashi: { chandra, surya, lagna },
    dashaPlanetarySynergy,
    kendraTrikonaProsperity,
    purusharthaAlignment,
    secondaryAxis,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    vedicSynthesisMatrix,
  };
}

/**
 * 프롬프트 주입용 베딕 조티시 나크샤트라·다샤 결과 포맷터
 */
export function formatVedicPrompt(result: VedicResult): string {
  if (result.status !== 'calculated' || !result.nakshatra || !result.mahadashas) {
    return '';
  }
  const n = result.nakshatra;
  const balance = result.dashaBalance!;
  const current = result.currentDasha;
  const rashi = result.rashi!;

  const birthLine = result.birthInstant
    ? `- 출생 기준 시각: ${result.birthInstant.kstISOString} KST${result.birthInstant.assumedNoon ? ' (생시 미입력 → 정오 12:00 기준 참고값)' : ''}`
    : '';
  const nakshatraLines = [
    `- 출생 나크샤트라(찬드라): ${n.name}(${n.sanskrit}) 제${n.number}/27 — 지배 행성 ${n.lord} · 파다 ${n.pada}/4 (나바암사 주인 ${n.padaLords[n.pada - 1]})`,
    `  * 주재신: ${n.deity} | 상징: ${n.symbol} | 군: ${n.gana} | 원소: ${n.tattva} | 카스트: ${n.caste}`,
    `  * 항성황도 구간: ${n.spanDegrees.start.toFixed(4)}°~${n.spanDegrees.end.toFixed(4)}° (파다 ${n.padaDegrees.start.toFixed(4)}°~)`,
    `  * 잔여 다샤 수명(Balance of Dasha): ${balance.lord} ${balance.years.toFixed(4)}년`,
    `  * 상징 요해: ${n.meaning}`,
  ].join('\n');

  const rashiLines = [
    `- 찬드라 라시(달): ${rashi.chandra.name}(${rashi.chandra.hanja}) — 경도 ${rashi.chandra.longitude.toFixed(4)}°`,
    `- 수리야 라시(태양): ${rashi.surya.name}(${rashi.surya.hanja}) — 경도 ${rashi.surya.longitude.toFixed(4)}°`,
    rashi.lagna
      ? `- 라그나 라시(상승궁): ${rashi.lagna.name}(${rashi.lagna.hanja}) — 경도 ${rashi.lagna.longitude.toFixed(4)}°`
      : '- 라그나 라시(상승궁): 생시·지원 출생도시 미입력으로 미산출',
  ].join('\n');

  const currentLines = current
    ? [
        `- 현재 마하다샤: 제${current.mahadasha.ordinal}기 ${current.mahadasha.lord} 마하다샤 (${current.mahadasha.startDate} ~ ${current.mahadasha.endDate})`,
        `- 현재 안타르다샤: ${current.mahadasha.lord}-${current.antardasha.lord} (${current.antardasha.startDate} ~ ${current.antardasha.endDate})`,
        `- 기준 시점: ${current.referenceInstant} · 출생 후 ${current.ageYears}년`,
      ].join('\n')
    : '- 현재 다샤: 기준 시점이 120년 다샤 주기 범위 밖이거나 산출 불가';

  const synergyLine = result.dashaPlanetarySynergy
    ? `- 다샤 행성 조화: ${result.dashaPlanetarySynergy.relationship}\n  * 카르마적 초점: ${result.dashaPlanetarySynergy.karmicFocus}`
    : '';

  const kendraLine = result.kendraTrikonaProsperity
    ? `- 켄드라·트리코나 번영: ${result.kendraTrikonaProsperity.dominantHousePillar}\n  * 지탱 기둥 조언: ${result.kendraTrikonaProsperity.lifePillarAdvice}`
    : '';

  const purusharthaLine = result.purusharthaAlignment
    ? `- 4대 푸루샤르타 인생 목적: 주 목적 [${result.purusharthaAlignment.primarySpiritualAim}]`
    : '';

  const matrixLine = result.vedicSynthesisMatrix
    ? `\n- 베딕 조티시 교차 매트릭스: 핵심 긴장(${result.vedicSynthesisMatrix.dominantTension}) · 조율 상태(${result.vedicSynthesisMatrix.alignmentState}) · 통합 실천(${result.vedicSynthesisMatrix.integratedAction})`
    : '';
  const secondaryLine = result.secondaryAxis
    ? `\n- 보조 교차 축: ${result.secondaryAxis}`
    : '';
  const reflectionLine = result.reflectiveQuestion
    ? `\n- 성찰 질문: ${result.reflectiveQuestion}`
    : '';
  const ritualLine = result.ritualAction
    ? `\n- 실천 의례: ${result.ritualAction}`
    : '';
  const focusLine = result.reflectionFocus
    ? `\n- 성찰 초점: ${result.reflectionFocus}`
    : '';
  const shadowLine = (result as { shadowWarning?: string }).shadowWarning
    ? `\n- 과잉 경계: ${(result as { shadowWarning?: string }).shadowWarning}`
    : '';
  const boundaryLine = result.interpretiveBoundary
    ? `\n- ${result.interpretiveBoundary}`
    : '';

  const timelineLines = result.mahadashas
    .map((m) => {
      const mark = current && current.mahadasha.ordinal === m.ordinal ? ' ◀ 현재' : '';
      const firstNote = m.ordinal === 1 ? ` (출생 잔여분, 출생 전 ${(-m.startYearsAfterBirth).toFixed(2)}년부터 진행)` : '';
      return [
        `  · 제${m.ordinal}기 ${m.lord} 마하다샤: ${m.startDate} ~ ${m.endDate} (${m.nominalYears}년 통용${firstNote})${mark}`,
        m.antardashas
          .map(
            (a) =>
              `      - ${m.lord}-${a.lord} 안타르다샤: ${a.startDate} ~ ${a.endDate} (${a.years.toFixed(4)}년)${current && current.antardasha.lord === a.lord && current.mahadasha.ordinal === m.ordinal ? ' ◀ 현재' : ''}${a.isBirthBeforeStart ? ' [출생 이전 개시 구간]' : ''}`,
          )
          .join('\n'),
      ].join('\n');
    })
    .join('\n');

  return `
[정통 베딕 조티시(Vedic Jyotish) 27 나크샤트라 & 120년 빔쇼타리 다샤 리포트 (${VEDIC_ENGINE_VERSION} | ${result.calculatedAtKst || formatVedicKstTimestamp()})]
${birthLine}
- 라히리 근방 아얀암사: ${result.ayanamsa}° · 항성황도 달 ${result.siderealLongitude!.moon.toFixed(4)}° / 태양 ${result.siderealLongitude!.sun.toFixed(4)}°
${nakshatraLines}
${rashiLines}
${currentLines}
${synergyLine ? synergyLine + '\n' : ''}${kendraLine ? kendraLine + '\n' : ''}${purusharthaLine ? purusharthaLine + '\n' : ''}- 120년 빔쇼타리 다샤 전수 타임라인 (9 마하다샤 × 9 안타르다샤 = ${result.antardashaCount}구간, 태양년 365.25일 환산):
${timelineLines}${matrixLine}${secondaryLine}${reflectionLine}${ritualLine}${focusLine}${shadowLine}${boundaryLine}
- [AI 해석 지침]: 아래 내용은 입력된 출생 정보와 구현된 항성황도 산법을 적용한 계산 참고값이며, 정확성이나 미래 예측을 보장하지 않습니다. 나크샤트라·파다·다샤 주인과 기간은 제공된 계산 결과에 맞춰 설명하십시오. 아얀암사는 세차 다항식 계산이므로 정밀 천문력과 미세한 차이가 있어 나크샤트라·파다·다샤 경계일 전후 1일 이내의 결과는 단정하지 마십시오.
`.trim();
}
