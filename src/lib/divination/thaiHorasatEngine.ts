/**
 * =========================================================================
 * LUCKEY 정통 태국 호라삿(Horasat) 8요일(八曜日) 행성 · 마하탁사(Maha Thaksa)
 * 생애 대운 주기 & 4대 원소(Thaat · 탓) 신체 활력 진단 엔진
 * (Authentic Thai Horasat 8-Planetary-Days & Maha Thaksa Life-Dasha &
 *  Four-Element Vitality Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. AI(LLM)에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    동일한 생년월일시 입력에 대해 항상 100% 동일한 8요일 수호신·대운·원소 진단을 산출한다.
 *
 * 2. 정통 태국 호라삿 8대 행성 요일(8 Planetary Days) 전수 데이터:
 *    태국 전통 점성술은 수요일을 낮(06:00~18:00, 프라 풋)과 밤(18:00~06:00, 프라 라후)으로
 *    분할해 하루를 두 수호신이 지배하는 8요일 체계로 다룬다.
 *    일(태양·가루다·북동), 월(달·호랑이·동), 화(화성·사자·남동), 수낮(수성·코끼리·남),
 *    수밤(라후·상아 없는 코끼리·북서), 목(목성·은둔자·서), 금(금성·소·북), 토(토성·나기·남서).
 *
 * 3. 마하탁사(Maha Thaksa) 생애 대운 주기 — 총 108년(6+15+8+17+10+19+12+21):
 *    출생 요일의 수호 행성을 기점으로 태양(6년)→달(15년)→화성(8년)→수성(17년)→
 *    토성(10년)→목성(19년)→라후(12년)→금성(21년)의 고정 순서를 순환한다.
 *    현재 세는 나이(태국 전통식 만태나이)가 어느 대운 구간에 속하는지 산출하고,
 *    현재 대운 지배 행성이 출생 행성과 맺는 관계를 태국 점성술의 8대 속성
 *    (ราชา 라차·왕, เดช 데차, ศรี 시리, มูลา 물라, อุสสาหะ 우사하, มนตรี 몬뜨리,
 *     ศัตรู 사뚜·적, กาฬกินี 칼라키니)으로 판정해 길흉을 정량화한다.
 *
 * 4. 4대 원소(Thaat · 탓) 신체 활력 진단:
 *    태국 전통 의학은 출생 월(계절)로 타고난 원소를 정하고 신체 체계별 밸런스를 진단한다.
 *    - 흙(Din · 10·11·12월): 뼈·근육·소화기계 — 과도 시 피로·무거움
 *    - 물(Nam · 7·8·9월): 혈액·림프·신장·비뇨기계 — 과도 시 부종·감정 기복
 *    - 바람(Lom · 4·5·6월): 신경계·호흡기·관절 — 과도 시 불안·두통·불면
 *    - 불(Fai · 1·2·3월): 체온·심장·혈압·염증 — 과도 시 스트레스·소화불량
 *    출생 원소와 현재 시즌 원소(흙↔물, 불↔바람 상생 균형쌍)의 조합과 현재 대운 속성
 *    점수로 0~100 활력 에너지 지수를 결정론 산출하고, 전통 태국 아유르베다
 *    식단·허브·휴식 개운 가이드를 처방한다.
 *
 * 5. 생시가 없어도 산출된다(null-safe). 수요일 출생인데 생시가 없으면 태국 통행 관례에 따라
 *    낮·밤을 통합한 주간(프라 풋 · 수성) 기준으로 계산하고 fallback 안내를 덧붙인다.
 *    프로필이 없으면 status 'skipped'로 안전하게 건너뛴다.
 */

import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate } from '../lunarCalendar';
import { parseBirthTime } from '../birthDateTime';

export const THAI_HORASAT_ENGINE_VERSION = 'LUCKEY-TH-v2.1.0';

function formatThaiHorasatKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export const THAI_HORASAT_METHOD =
  '태국 정통 호라삿(Horasat) 결정론 산법: 8대 행성 요일(일 태양·월 달·화 화성·수낮 수성·수밤 라후·목 목성·금 금성·토 토성) 수호신 전수 데이터, 마하탁사(Maha Thaksa) 108년 생애 대운 주기(태양6→달15→화성8→수성17→토성10→목성19→라후12→금성21) 구간 산출 및 8대 속성(라차·데차·시리·물라·우사하·몬뜨리·사뚜·칼라키니) 길흉 판정, 4대 원소(흙 Din·물 Nam·바람 Lom·불 Fai) 출생 월 본명 원소 및 신체 장기 활력 진단과 아유르베다 식단·허브·휴식 개운 처방';

/** 8대 수호 행성 식별자 */
export type ThaiDayPlanetId = 'sun' | 'moon' | 'mars' | 'mercury' | 'rahu' | 'jupiter' | 'venus' | 'saturn';

/** 8요일 수호신 전수 정의 */
export interface ThaiDayPlanet {
  id: ThaiDayPlanetId;
  thaiName: string; // 프라 아팃
  translit: string; // Phra Athit
  planet: string; // 태양
  weekday: string; // 일요일 (수요일 밤은 '수요일 밤')
  cycleYears: number; // 대운 향수 (6/15/8/17/12/19/21/10)
  colors: ReadonlyArray<string>; // 행운 색상
  animal: string; // 수호 상징(영수)
  direction: string; // 길방위
  character: string; // 수호신 성향 요해
}

/** 태국 정통 8요일 수호신 전수 표 */
export const THAI_DAY_PLANETS_8: ReadonlyArray<ThaiDayPlanet> = [
  {
    id: 'sun', thaiName: '프라 아팃', translit: 'Phra Athit', planet: '태양', weekday: '일요일',
    cycleYears: 6, colors: ['붉은색'], animal: '가루다(Garuda · 황금 날개의 신조)', direction: '북동',
    character: '존귀와 명예, 위광(威光)과 리더십의 수호신. 짧지만 강렬한 6년 주기로 왕의 기상을 내린다.',
  },
  {
    id: 'moon', thaiName: '프라 찬', translit: 'Phra Chan', planet: '달', weekday: '월요일',
    cycleYears: 15, colors: ['노란색', '은색'], animal: '호랑이(Tiger)', direction: '동',
    character: '감수성·풍요·모성의 수호신. 은빛 15년 주기로 마음의 결과 인연의 씨앗을 키운다.',
  },
  {
    id: 'mars', thaiName: '프라 앙칸', translit: 'Phra Angkhan', planet: '화성', weekday: '화요일',
    cycleYears: 8, colors: ['분홍색'], animal: '사자(Lion)', direction: '남동',
    character: '용기·투지·결단의 수호신. 8년 주기로 승부사의 불꽃과 개척의 다리를 힘입게 한다.',
  },
  {
    id: 'mercury', thaiName: '프라 풋', translit: 'Phra Phut', planet: '수성', weekday: '수요일(낮 06:00~18:00)',
    cycleYears: 17, colors: ['녹색'], animal: '상아 있는 코끼리(Tusked Elephant)', direction: '남',
    character: '지혜·언변·상록(商略)의 수호신. 17년 주기로 학문과 소통, 장사의 복을 관리한다.',
  },
  {
    id: 'rahu', thaiName: '프라 라후', translit: 'Phra Rahu', planet: '라후(암흑의 달)', weekday: '수요일(밤 18:00~06:00)',
    cycleYears: 12, colors: ['검은색', '회색'], animal: '상아 없는 코끼리(Tuskless Elephant)', direction: '북서',
    character: '일식·암흑의 거대한 수호신. 12년 주기로 탐욕과 집착을 삼키며 시련을 통해 대전환을 일으킨다.',
  },
  {
    id: 'jupiter', thaiName: '프라 파르핫', translit: 'Phra Phruehat', planet: '목성', weekday: '목요일',
    cycleYears: 19, colors: ['주황색'], animal: '은둔자·루시(Rishi · 현자)', direction: '서',
    character: '가르침·덕행·법(法)의 수호신. 가장 긴 19년 주기로 스승의 은총과 축적의 복을 내린다.',
  },
  {
    id: 'venus', thaiName: '프라 숙', translit: 'Phra Suk', planet: '금성', weekday: '금요일',
    cycleYears: 21, colors: ['하늘색', '파란색'], animal: '소(Cow)', direction: '북',
    character: '사랑·예술·재물의 수호신. 가장 긴 21년 주기로 아름다움과 풍만(豐滿)한 결실을 맺는다.',
  },
  {
    id: 'saturn', thaiName: '프라 사오', translit: 'Phra Sao', planet: '토성', weekday: '토요일',
    cycleYears: 10, colors: ['보라색'], animal: '나기·뱀(Nagi · 용왕의 여신)', direction: '남서',
    character: '인내·규율·심연의 수호신. 10년 주기로 뱀의蜕皮처럼 낡은 껍질을 벗는 단련을 준다.',
  },
];

/** 요일(일0~토6) → 기본 수호 행성. 수요일(3)은 낮(수성)·밤(라후) 분기 전용 */
const WEEKDAY_PLANET: ReadonlyArray<ThaiDayPlanetId> = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

/** 마하탁사 8행성 고정 순서와 향수 (합 108년) */
export const MAHA_THAKSA_ORDER: ReadonlyArray<{ id: ThaiDayPlanetId; years: number }> = [
  { id: 'sun', years: 6 },
  { id: 'moon', years: 15 },
  { id: 'mars', years: 8 },
  { id: 'mercury', years: 17 },
  { id: 'saturn', years: 10 },
  { id: 'jupiter', years: 19 },
  { id: 'rahu', years: 12 },
  { id: 'venus', years: 21 },
];

/** 마하탁사 총 주기 (6+15+8+17+10+19+12+21) */
export const MAHA_THAKSA_TOTAL_YEARS = MAHA_THAKSA_ORDER.reduce((s, p) => s + p.years, 0); // 108

/** 8대 속성(ผลพุธเจ้า) 정의 — 현재 대운 지배 행성이 출생 행성과 맺는 관계의 길흉 등급 */
export interface ThaiDashaAttribute {
  key: 'racha' | 'decha' | 'si' | 'mula' | 'ussaha' | 'montri' | 'satru' | 'kalakini';
  thai: string;
  korean: string;
  score: number; // 길흉 정량화 (0~100, 높을수록 길)
  meaning: string;
  verdictClass: '대길' | '중길' | '평(노력형)' | '흉(관리 필요)';
}

export const THAI_DASHA_ATTRIBUTES_8: Readonly<Record<ThaiDashaAttribute['key'], ThaiDashaAttribute>> = {
  racha: { key: 'racha', thai: 'ราชา', korean: '라차(왕)', score: 95, meaning: '출생 수호신이 그대로 왕좌에 앉은 최상 대운. 명예·권위·개업·수상의 대길기.', verdictClass: '대길' },
  decha: { key: 'decha', thai: 'เดช', korean: '데차(위광)', score: 85, meaning: '친화 행성의 위광 대운. 권한 확대·합작·수상(受賞)이 쉬워지는 길기.', verdictClass: '대길' },
  si: { key: 'si', thai: 'ศรี', korean: '시리(길상)', score: 80, meaning: '친화 행성의 길상 대운. 명성·매력·경조사와 번영의 길기.', verdictClass: '대길' },
  montri: { key: 'montri', thai: 'มนตรี', korean: '몬뜨리(재상)', score: 75, meaning: '친화 행성의 재상 대운. 귀인 조력·조언자·협상에서 득세하는 길기.', verdictClass: '중길' },
  mula: { key: 'mula', thai: 'มูลา', korean: '물라(근본)', score: 65, meaning: '중립 행성의 근본 대운. 기반 다지기·저축·수련으로 씨를 뿌리는 평길기.', verdictClass: '중길' },
  ussaha: { key: 'ussaha', thai: 'อุสสาหะ', korean: '우사하(근면)', score: 55, meaning: '중립 행성의 근면 대운. 노력 대비 결실이 늦게 오는 수행기 — 꾸준함이 관건.', verdictClass: '평(노력형)' },
  satru: { key: 'satru', thai: 'ศัตรู', korean: '사뚜(적수)', score: 30, meaning: '적대 행성의 적수 대운. 갈등·경쟁·구설이 붙으니 계약·소송·파트너십을 조심해야 한다.', verdictClass: '흉(관리 필요)' },
  kalakini: { key: 'kalakini', thai: 'กาฬกินี', korean: '칼라키니(흑신)', score: 15, meaning: '적대 행성이 흑신으로 군림하는 최흉 대운. 재물 유실·건강 관리·큰 결정 보류가 원칙.', verdictClass: '흉(관리 필요)' },
};

/**
 * 태국 점성술 8대 행성(라후 포함)의 자연 친·적 관계 전수표.
 * (고전 그라하 자연 우호도를 라후 = 토성 계열로 확장 적용한 통용표)
 */
const PLANET_FRIENDS: Readonly<Record<ThaiDayPlanetId, ReadonlyArray<ThaiDayPlanetId>>> = {
  sun: ['moon', 'mars', 'jupiter'],
  moon: ['sun', 'mercury'],
  mars: ['sun', 'moon', 'jupiter'],
  mercury: ['sun', 'venus'],
  jupiter: ['sun', 'moon', 'mars'],
  venus: ['mercury', 'saturn'],
  saturn: ['mercury', 'venus'],
  rahu: ['venus', 'saturn'],
};
const PLANET_ENEMIES: Readonly<Record<ThaiDayPlanetId, ReadonlyArray<ThaiDayPlanetId>>> = {
  sun: ['venus', 'saturn', 'rahu'],
  moon: [],
  mars: ['mercury'],
  mercury: ['moon'],
  jupiter: ['mercury', 'venus'],
  venus: ['sun', 'moon'],
  saturn: ['sun', 'moon', 'mars'],
  rahu: ['sun', 'moon', 'mars'],
};

/** 친(從)·중립·적(敵) 관계 판정 */
export function thaiPlanetRelation(birth: ThaiDayPlanetId, other: ThaiDayPlanetId): 'friend' | 'neutral' | 'enemy' | 'self' {
  if (birth === other) return 'self';
  if (PLANET_FRIENDS[birth].includes(other)) return 'friend';
  if (PLANET_ENEMIES[birth].includes(other)) return 'enemy';
  return 'neutral';
}

/**
 * 8대 속성 결정론 배정:
 * 동일 행성 → 라차(왕), 친화 → 데차·시리·몬뜨리, 중립 → 물라·우사하, 적대 → 사뚜·칼라키니.
 * 같은 등급 내 후보는 대운 시작 나이(만태 나이) 수리로 고정 순환 배정한다
 * (동일 입력에 항상 동일 속성이 나오는 결정론 규약).
 */
export function decideThaiDashaAttribute(birth: ThaiDayPlanetId, dasha: ThaiDayPlanetId, startAge: number): ThaiDashaAttribute {
  const rel = thaiPlanetRelation(birth, dasha);
  if (rel === 'self') return THAI_DASHA_ATTRIBUTES_8.racha;
  if (rel === 'friend') {
    const friends = [THAI_DASHA_ATTRIBUTES_8.decha, THAI_DASHA_ATTRIBUTES_8.si, THAI_DASHA_ATTRIBUTES_8.montri];
    return friends[((startAge % 3) + 3) % 3];
  }
  if (rel === 'neutral') {
    return ((startAge % 2) + 2) % 2 === 0 ? THAI_DASHA_ATTRIBUTES_8.mula : THAI_DASHA_ATTRIBUTES_8.ussaha;
  }
  return ((startAge % 2) + 2) % 2 === 0 ? THAI_DASHA_ATTRIBUTES_8.satru : THAI_DASHA_ATTRIBUTES_8.kalakini;
}

/** 4대 원소(Thaat · 탓) 식별자 */
export type ThaiThaatId = 'din' | 'nam' | 'lom' | 'fai';

/** 4대 원소 전수 정의 */
export interface ThaiThaat {
  id: ThaiThaatId;
  thai: string;
  korean: string;
  months: ReadonlyArray<number>; // 본명 원소가 되는 출생 월 (양력 월)
  bodySystems: string; // 담당 신체 체계·장기
  excessSigns: string; // 과도 시 증상
  balancedBy: ThaiThaatId; // 상생 균형 원소 (흙↔물, 불↔바람)
  diet: string; // 아유르베다 식단 처방
  herbs: string; // 전통 허브 처방
  rest: string; // 휴식·생활 처방
}

export const THAI_THAATS_4: ReadonlyArray<ThaiThaat> = [
  {
    id: 'din', thai: 'ดิน', korean: '흙(Din)', months: [10, 11, 12],
    bodySystems: '뼈·근육·소화기계', excessSigns: '몸의 무거움·피로 누적·소화 둔감·식욕 과잉',
    balancedBy: 'nam',
    diet: '따뜻한 죽과 수프, 생강·강황을 곁들인 뿌리채소, 소화가 잘 되는 쌀 요리로 위를 가볍게',
    herbs: '강황·생강·계피 차로 소화의 불을 데우고 몸의 무거움을 녹인다',
    rest: '식후 가벼운 산책과 복부 지압 마사지, 규칙적인 식사 시간으로 소화기계의 리듬을 세운다',
  },
  {
    id: 'nam', thai: 'น้ำ', korean: '물(Nam)', months: [7, 8, 9],
    bodySystems: '혈액·림프·신장·비뇨기계', excessSigns: '부종·체중 변동·감정 기복·감성 과잉',
    balancedBy: 'din',
    diet: '오이·수박·잎채소 등 이뇨 채소와 코코넛워터로 혈액·림프의 흐름을 맑게',
    herbs: '레몬그라스 차·버터플라이피(접시꽃) 차로 습기를 걷고 마음의 물결을 가라앉힌다',
    rest: '하루 수분 리듬을 일정하게 유지하고, 감정 기복 시 심호흡과 하지(下肢) 스트레칭으로 순환을 돕는다',
  },
  {
    id: 'lom', thai: 'ลม', korean: '바람(Lom)', months: [4, 5, 6],
    bodySystems: '신경계·호흡기·관절', excessSigns: '불안·두통·불면·관절 건조와 신경 과민',
    balancedBy: 'fai',
    diet: '따뜻한 수프·견과류·바나나 등 온기 있는 식사로 바람을 누그러뜨린다',
    herbs: '카모마일·레몬그라스·카피르라임 향으로 긴장된 신경을 이완한다',
    rest: '복식호흡과 명상, 일정한 취침 리듬으로 흔들리는 바람(신경)을 고정한다',
  },
  {
    id: 'fai', thai: 'ไฟ', korean: '불(Fai)', months: [1, 2, 3],
    bodySystems: '체온·심장·혈압·염증', excessSigns: '스트레스 발화·소화불량·속화(마른 열)·혈압 변동',
    balancedBy: 'lom',
    diet: '열대 과일·코코넛·나물 등 서늘한 성질의 음식으로 불길을 식힌다',
    herbs: '홀리바실(틀린)·타민잎·라임으로 열을 내리고 염증을 가라앉힌다',
    rest: '한낮 강한 활동을 피하고 서늘한 물가·숲의 휴식, 명상으로 심화(心火)를 내린다',
  },
];

/** 월(1~12) → 본명 원소 전수 매핑 */
export function thaatByMonth(month: number): ThaiThaat {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError('1~12월이 필요합니다.');
  const found = THAI_THAATS_4.find((t) => t.months.includes(month));
  if (!found) throw new RangeError(`월 ${month}에 해당하는 원소가 없습니다.`);
  return found;
}

export function thaatById(id: ThaiThaatId): ThaiThaat {
  const found = THAI_THAATS_4.find((t) => t.id === id);
  if (!found) throw new RangeError(`원소 ${id}가 없습니다.`);
  return found;
}

/** 8요일 요일(일0~토6)·생시·수요일 분기 → 수호 행성 판정 */
export function birthDayPlanetId(weekday: number, birthHour: number | null): { id: ThaiDayPlanetId; usedFallback: boolean } {
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) throw new RangeError('요일은 0(일)~6(토)이어야 합니다.');
  if (weekday !== 3) return { id: WEEKDAY_PLANET[weekday], usedFallback: false };
  // 수요일: 낮 06:00~17:59 프라 풋(수성), 밤 18:00~05:59 프라 라후
  if (birthHour === null) return { id: 'mercury', usedFallback: true }; // 주간 기준 fallback
  const isNight = birthHour >= 18 || birthHour < 6;
  return { id: isNight ? 'rahu' : 'mercury', usedFallback: false };
}

export function thaiDayPlanetById(id: ThaiDayPlanetId): ThaiDayPlanet {
  const found = THAI_DAY_PLANETS_8.find((p) => p.id === id);
  if (!found) throw new RangeError(`행성 ${id}가 없습니다.`);
  return found;
}

/** 마하탁사 대운 구간(출생 행성 기점 108년 순환, 108세 초과는 주기 재순환) */
export interface MahaThaksaSegment {
  planetId: ThaiDayPlanetId;
  planet: ThaiDayPlanet;
  startAge: number; // 만태 나이 시작 (1부터)
  endAge: number; // 만태 나이 끝 (포함)
  years: number;
}

/** 출생 행성 기점으로 순환한 만 108년 대운 시간표 산출 */
export function buildMahaThaksaTimeline(birthPlanetId: ThaiDayPlanetId): MahaThaksaSegment[] {
  const startIdx = MAHA_THAKSA_ORDER.findIndex((p) => p.id === birthPlanetId);
  const segments: MahaThaksaSegment[] = [];
  let age = 1;
  for (let i = 0; i < MAHA_THAKSA_ORDER.length; i++) {
    const entry = MAHA_THAKSA_ORDER[(startIdx + i) % MAHA_THAKSA_ORDER.length];
    segments.push({
      planetId: entry.id,
      planet: thaiDayPlanetById(entry.id),
      startAge: age,
      endAge: age + entry.years - 1,
      years: entry.years,
    });
    age += entry.years;
  }
  return segments;
}

export interface MahaThaksaResult {
  birthPlanetId: ThaiDayPlanetId;
  birthPlanet: ThaiDayPlanet;
  totalYears: number; // 108
  ageCounting: number; // 태국식 세는 나이 (만태나이)
  sequence: ReadonlyArray<MahaThaksaSegment>; // 출생 행성 기점 108년 시간표
  current: {
    planetId: ThaiDayPlanetId;
    planet: ThaiDayPlanet;
    startAge: number;
    endAge: number;
    yearsLeft: number;
    attribute: ThaiDashaAttribute;
    verdict: string; // 길흉 판정 문구
  };
}

export interface ThaiHorasatResult {
  status: 'calculated' | 'skipped' | 'error';
  engineVersion: string;
  method: string;
  calculatedAtKst?: string;
  birthInput?: {
    solarDateString: string;
    originalDateString: string;
    isLunar: boolean;
    weekday: string; // 일요일 등
    birthHour: number | null;
    timeKnown: boolean;
  };
  birthDayPlanet?: ThaiDayPlanet;
  eightDayPlanets?: ReadonlyArray<ThaiDayPlanet>; // 8요일 수호신 전수
  mahaThaksa?: MahaThaksaResult;
  fourElements?: {
    birthThaat: ThaiThaat; // 출생 월 본명 원소
    currentThaat: ThaiThaat; // 현재 시즌 원소
    vitalityIndex: number; // 0~100 활력 에너지 지수
    balanceNote: string; // 원소 균형 진단 문구
  };
  planetaryFriendEnemyDynamic?: ThaiPlanetaryFriendEnemyDynamic;
  mahaThaksaAntardasha?: ThaiMahaThaksaAntardasha;
  seasonalThaatTactics?: ThaiSeasonalThaatTactics;
  remedies?: {
    luckyColors: ReadonlyArray<string>;
    luckyDirection: string;
    practice: string; // 개운 실천법
  };
  horasatSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary?: string;
  note?: string;
}

/** 태국 호라삿 행성 친우(쿳밋)·원수(쿳사뚜) 역학 */
export interface ThaiPlanetaryFriendEnemyDynamic {
  birthPlanetName: string;
  dashaPlanetName: string;
  relationshipType: '대친우(คู่มิตร · 쿳밋)' | '상호보완(คู่สมพล · 쿳솜퐁)' | '중립조화(เป็นกลาง · 뻰끌랑)' | '대원수(คู่ศัตรู · 쿳사뚜)';
  affinityScore: number; // 40~98
  strategicInteraction: string;
}

/** 마하탁사 서브 다샤(Antardasha / 소운) 8단계 국면 수리 분할 */
export interface ThaiMahaThaksaAntardasha {
  antardashaPlanetId: ThaiDayPlanetId;
  antardashaPlanetName: string;
  antardashaAttribute: string;
  subCycleOrder: number; // 1~8
  pacingTempo: '신속 추진형 (Fast Forward)' | '점진 안착형 (Steady Progress)' | '전략 조율형 (Strategic Pivot)';
  actionAdvice: string;
}

/** 4대 원소(Thaat) 사계절 순환 신체 리듬 & 4대 완급 조절 결단 윈도우 */
export interface ThaiSeasonalThaatTactics {
  peakActionSeason: string;
  defensiveSeason: string;
  seasonalPacingGuidance: string;
  vitalityPreservationMotto: string;
}

/** 태국 전통 호라삿 쿳밋(대친우쌍), 쿳사뚜(대원수쌍), 쿳솜퐁(상호보완쌍) */
export function calculateThaiPlanetaryFriendEnemyDynamic(
  birthPlanetId: ThaiDayPlanetId,
  dashaPlanetId: ThaiDayPlanetId
): ThaiPlanetaryFriendEnemyDynamic {
  const birthPlanet = thaiDayPlanetById(birthPlanetId);
  const dashaPlanet = thaiDayPlanetById(dashaPlanetId);

  // 4대 대친우쌍 (쿳밋 คู่มิตร): 일-목, 월-금, 화-수, 토-라후
  const GREAT_FRIENDS: ReadonlyArray<[ThaiDayPlanetId, ThaiDayPlanetId]> = [
    ['sun', 'jupiter'],
    ['moon', 'venus'],
    ['mars', 'mercury'],
    ['saturn', 'rahu'],
  ];

  // 4대 대원수쌍 (쿳사뚜 คู่ศัตรู): 일-화, 월-라후, 목-토, 금-수
  const GREAT_ENEMIES: ReadonlyArray<[ThaiDayPlanetId, ThaiDayPlanetId]> = [
    ['sun', 'mars'],
    ['moon', 'rahu'],
    ['jupiter', 'saturn'],
    ['venus', 'mercury'],
  ];

  // 4대 상호보완쌍 (쿳솜퐁 คู่สมพล): 일-라후, 월-목, 화-금, 수-토
  const COMPLEMENTARY_ALLIES: ReadonlyArray<[ThaiDayPlanetId, ThaiDayPlanetId]> = [
    ['sun', 'rahu'],
    ['moon', 'jupiter'],
    ['mars', 'venus'],
    ['mercury', 'saturn'],
  ];

  const matchesPair = (pairs: ReadonlyArray<[ThaiDayPlanetId, ThaiDayPlanetId]>) =>
    pairs.some(([p1, p2]) => (birthPlanetId === p1 && dashaPlanetId === p2) || (birthPlanetId === p2 && dashaPlanetId === p1));

  let relationshipType: ThaiPlanetaryFriendEnemyDynamic['relationshipType'];
  let affinityScore: number;
  let strategicInteraction: string;

  if (birthPlanetId === dashaPlanetId) {
    relationshipType = '대친우(คู่มิตร · 쿳밋)';
    affinityScore = 92;
    strategicInteraction = `출생 수호신 ${birthPlanet.thaiName}(${birthPlanet.planet})의 원형적 기운이 대운에 온전히 회귀하여, 자아 정체성과 주체적 결단력이 최고조에 달하는 본명 회귀 성취기입니다.`;
  } else if (matchesPair(GREAT_FRIENDS)) {
    relationshipType = '대친우(คู่มิตร · 쿳밋)';
    affinityScore = 95;
    strategicInteraction = `출생 수호신 ${birthPlanet.thaiName}과(와) 대운 지배성 ${dashaPlanet.thaiName}이(가) 태국 정통 호라삿의 4대 대친우(쿳밋) 동맹을 이룹니다. 뜻밖의 귀인 원조와 환경의 강력한 후원이 결합하는 대길의 순풍 국면입니다.`;
  } else if (matchesPair(COMPLEMENTARY_ALLIES)) {
    relationshipType = '상호보완(คู่สมพล · 쿳솜퐁)';
    affinityScore = 87;
    strategicInteraction = `출생 수호신과 대운 지배성이 결핍을 상호 보완하는 쿳솜퐁 연합을 형성합니다. 서로 다른 역량의 파트너십 구축 및 외연 확장 전략에서 최상의 시너지를 발휘합니다.`;
  } else if (matchesPair(GREAT_ENEMIES)) {
    relationshipType = '대원수(คู่ศัตรู · 쿳사뚜)';
    affinityScore = 48;
    strategicInteraction = `출생 수호신과 대운 지배성이 4대 대원수(쿳사뚜) 긴장 축에 대면합니다. 성급한 감정적 충돌이나 무리한 정면 승부를 피하고, 철저한 계약 점검과 방어적 내실 관리에 주력하십시오.`;
  } else {
    relationshipType = '중립조화(เป็นกลาง · 뻰끌랑)';
    affinityScore = 74;
    strategicInteraction = `두 행성이 원만한 중립 조화 상태를 이룹니다. 외부 요행에 휘둘리지 않고 성실한 노력과 단계적 실행을 통해 안정된 성취를 축적해 나가는 평온기입니다.`;
  }

  return {
    birthPlanetName: `${birthPlanet.thaiName}(${birthPlanet.planet})`,
    dashaPlanetName: `${dashaPlanet.thaiName}(${dashaPlanet.planet})`,
    relationshipType,
    affinityScore,
    strategicInteraction,
  };
}

/** 마하탁사 서브 다샤(Antardasha / 소운) 8단계 국면 수리 분할 */
export function calculateThaiMahaThaksaAntardasha(
  birthPlanetId: ThaiDayPlanetId,
  currentDashaPlanetId: ThaiDayPlanetId,
  currentDashaYears: number,
  currentDashaStartAge: number,
  cyclePosition: number
): ThaiMahaThaksaAntardasha {
  const dashaIdx = MAHA_THAKSA_ORDER.findIndex((p) => p.id === currentDashaPlanetId);
  const orderedSubPlanets: Array<{ id: ThaiDayPlanetId; years: number }> = [];
  for (let i = 0; i < MAHA_THAKSA_ORDER.length; i++) {
    const idx = (dashaIdx + i) % MAHA_THAKSA_ORDER.length;
    orderedSubPlanets.push(MAHA_THAKSA_ORDER[idx]);
  }

  const elapsedYearsInDasha = Math.max(0, cyclePosition - currentDashaStartAge);
  let accumulated = 0;
  let subOrder = 1;
  let activeSubPlanetId: ThaiDayPlanetId = orderedSubPlanets[0].id;

  for (let i = 0; i < orderedSubPlanets.length; i++) {
    const subSpan = (currentDashaYears * orderedSubPlanets[i].years) / MAHA_THAKSA_TOTAL_YEARS;
    if (elapsedYearsInDasha <= accumulated + subSpan || i === orderedSubPlanets.length - 1) {
      activeSubPlanetId = orderedSubPlanets[i].id;
      subOrder = i + 1;
      break;
    }
    accumulated += subSpan;
  }

  const subPlanet = thaiDayPlanetById(activeSubPlanetId);
  const subAttr = decideThaiDashaAttribute(birthPlanetId, activeSubPlanetId, currentDashaStartAge + Math.floor(accumulated));

  let pacingTempo: ThaiMahaThaksaAntardasha['pacingTempo'];
  let actionAdvice: string;

  if (['라차(왕)', '데차', '시리'].includes(subAttr.korean)) {
    pacingTempo = '신속 추진형 (Fast Forward)';
    actionAdvice = `소운 지배성 ${subPlanet.thaiName}의 길상이 강력하여 주저하지 말고 핵심 과제를 선제적으로 밀어붙일 때입니다.`;
  } else if (['물라', '몬뜨리', '우사하'].includes(subAttr.korean)) {
    pacingTempo = '점진 안착형 (Steady Progress)';
    actionAdvice = `소운의 흐름이 실리와 축적을 돕고 있으므로, 성실한 단계적 실행과 신뢰 구축으로 내실을 다지십시오.`;
  } else {
    pacingTempo = '전략 조율형 (Strategic Pivot)';
    actionAdvice = `소운 구간에 주의 속성(${subAttr.korean})이 걸려 있으므로 속도를 조절하고 불필요한 마찰을 사전 차단하십시오.`;
  }

  return {
    antardashaPlanetId: activeSubPlanetId,
    antardashaPlanetName: `${subPlanet.thaiName}(${subPlanet.planet})`,
    antardashaAttribute: `${subAttr.thai} ${subAttr.korean}`,
    subCycleOrder: subOrder,
    pacingTempo,
    actionAdvice,
  };
}

/** 4대 원소(Thaat) 사계절 순환 신체 리듬 & 4대 완급 조절 결단 윈도우 */
export function calculateThaiSeasonalThaatTactics(birthThaatId: ThaiThaatId): ThaiSeasonalThaatTactics {
  switch (birthThaatId) {
    case 'din':
      return {
        peakActionSeason: '가을·겨울(10~12월 흙의 안정기)',
        defensiveSeason: '봄철(4~6월 바람·신경 과도기)',
        seasonalPacingGuidance: '대지의 차분한 기운이 지배할 때 장기 프로젝트와 재정 자산을 굳건히 다지십시오. 건조한 봄철에는 신경 과민을 누그러뜨리고 관절과 소화기계를 보호하십시오.',
        vitalityPreservationMotto: '중후하고 흔들림 없는 대지의 지혜로 자산을 지킨다.',
      };
    case 'nam':
      return {
        peakActionSeason: '여름·초가을(7~9월 물의 정화기)',
        defensiveSeason: '겨울·초봄(1~3월 심화 발화기)',
        seasonalPacingGuidance: '물의 유연한 순환을 타고 감수성과 인간관계를 넓히기에 적합합니다. 건조하고 열기 어린 초봄에는 체액과 림프 순환을 맑게 유지하십시오.',
        vitalityPreservationMotto: '모든 막힘을 부드럽게 감싸고 돌아가는 흐르는 물의 순리.',
      };
    case 'lom':
      return {
        peakActionSeason: '봄·초여름(4~6월 바람의 창의·소통기)',
        defensiveSeason: '늦가을·겨울(10~12월 한랭 정체기)',
        seasonalPacingGuidance: '빠른 기동성과 창의적 기획, 기민한 네트워크 확장에 뛰어난 모멘텀을 발휘합니다. 찬 바람이 부는 겨울철에는 호흡기와 수면 리듬을 엄격히 수호하십시오.',
        vitalityPreservationMotto: '자유롭게 넘나들되 뿌리를 잃지 않는 바람의 민첩함.',
      };
    case 'fai':
    default:
      return {
        peakActionSeason: '초봄(1~3월 불의 개척·추진기)',
        defensiveSeason: '한여름(7~9월 습열 염증기)',
        seasonalPacingGuidance: '승부처에서 폭발적인 추진력과 리더십을 발휘하기에 최적입니다. 습기와 무더위가 겹치는 여름철에는 급격한 감정 폭발과 과열을 경계하고 쿨다운 휴식을 취하십시오.',
        vitalityPreservationMotto: '어둠을 밝히되 자신을 태우지 않는 지혜로운 불꽃.',
      };
  }
}

/**
 * 태국 정통 호라삿 8요일 · 마하탁사 대운 · 4원소 활력 결정론적 계산 함수
 * (동일한 생년월일시 입력 → 항상 100% 동일한 수호신·대운·원소 진단 산출)
 */
export function calculateThaiHorasat(params: {
  profile?: UserProfile | null;
  targetYear?: number;
  targetDate?: Date;
  question?: string;
}): ThaiHorasatResult {
  const birthdateStr = params.profile?.basic?.birthdate?.trim() || '';
  if (!birthdateStr) {
    return {
      status: 'skipped',
      engineVersion: THAI_HORASAT_ENGINE_VERSION,
      method: THAI_HORASAT_METHOD,
      note: '생년월일 미입력으로 호라삿 8요일·마하탁사 계산 생략',
    };
  }

  try {
    const resolved = resolveEffectiveSolarDate(birthdateStr, params.profile?.basic?.lunarSolar, params.profile?.basic?.isLeapMonth ?? false);
    const { year, month, day } = resolved.solarDate;
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
      throw new RangeError('생년월일 파싱 실패');
    }

    // 1. 출생 요일 수호신 (수요일은 낮 06:00~18:00 / 밤 18:00~06:00 분기)
    const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
    let birthHour: number | null = null;
    try {
      const parsed = parseBirthTime(params.profile?.basic?.birthtime);
      birthHour = parsed?.hour ?? null;
    } catch (_) {
      birthHour = null; // 형식 오류는 주간 기준 fallback으로 안전 복구
    }
    const planetBranch = birthDayPlanetId(weekday, birthHour);
    const birthPlanet = thaiDayPlanetById(planetBranch.id);
    const weekdayLabel = weekday === 3 ? (birthPlanet.id === 'rahu' ? '수요일(밤)' : '수요일(낮)') : birthPlanet.weekday.split('(')[0];

    // 2. 마하탁사 생애 대운 (108년 순환, 출생 행성 기점)
    const targetYear = params.targetYear || new Date().getFullYear();
    const targetDate = params.targetDate || new Date();
    const ageCounting = Math.max(1, targetYear - year + 1); // 태국식 세는 나이(만태 나이)
    const sequence = buildMahaThaksaTimeline(birthPlanet.id);
    const cyclePosition = ((ageCounting - 1) % MAHA_THAKSA_TOTAL_YEARS) + 1; // 1~108
    const currentSegment = sequence.find((s) => cyclePosition >= s.startAge && cyclePosition <= s.endAge) || sequence[sequence.length - 1];
    const attribute = decideThaiDashaAttribute(birthPlanet.id, currentSegment.planetId, currentSegment.startAge);

    let verdict: string;
    if (attribute.verdictClass === '대길') {
      verdict = `현재 ${currentSegment.planet.thaiName}(${currentSegment.planet.planet}) 대운이 ${attribute.korean}의 기운으로 열려 있어 명예·성취·개운(開運)의 적기입니다. ${attribute.meaning}`;
    } else if (attribute.verdictClass === '중길') {
      verdict = `현재 ${currentSegment.planet.thaiName}(${currentSegment.planet.planet}) 대운은 ${attribute.korean}의 기운으로 꾸준한 축적과 귀인의 조력이 따르는 시기입니다. ${attribute.meaning}`;
    } else if (attribute.verdictClass === '평(노력형)') {
      verdict = `현재 ${currentSegment.planet.thaiName}(${currentSegment.planet.planet}) 대운은 ${attribute.korean}의 근면기로, 노력이 결실로 이어지는 데 시간이 걸립니다. ${attribute.meaning}`;
    } else {
      verdict = `현재 ${currentSegment.planet.thaiName}(${currentSegment.planet.planet}) 대운은 ${attribute.korean}의 시련기입니다. ${attribute.meaning} 무리한 확장을 삼가고 근본을 지키십시오.`;
    }

    // 3. 4대 원소(Thaat) 신체 활력 진단
    const birthThaat = thaatByMonth(month);
    const currentThaat = thaatByMonth(targetDate.getMonth() + 1);
    const dashaScore = attribute.score;
    let seasonEffect = 0;
    let balanceNote = '';
    if (currentThaat.id === birthThaat.id) {
      seasonEffect = -6;
      balanceNote = `태어난 달과 같은 ${birthThaat.korean} 원소의 계절이 오며 본명 원소가 과도해지기 쉽습니다 — ${birthThaat.excessSigns}을(를) 경계하고 균형 처방을 실행하세요.`;
    } else if (currentThaat.id === birthThaat.balancedBy) {
      seasonEffect = 8;
      balanceNote = `본명 ${birthThaat.korean} 원소를 상생으로 균형 짓는 ${currentThaat.korean} 원소의 계절입니다 — 신체 체계가 가장 잘 숨 쉬는 활력의 계절입니다.`;
    } else {
      balanceNote = `본명 ${birthThaat.korean} 원소와 무관한 ${currentThaat.korean} 원소의 계절로, 원소 밸런스가 크게 흔들리지 않습니다.`;
    }
    const dashaEffect = dashaScore >= 80 ? 6 : dashaScore >= 65 ? 3 : dashaScore >= 55 ? 0 : -6;
    const vitalityIndex = Math.min(100, Math.max(5, 72 + seasonEffect + dashaEffect));

    const eightDayPlanets = THAI_DAY_PLANETS_8;
    const timeNote = planetBranch.usedFallback
      ? '수요일 출생인데 생시가 없어 태국 통행 관례대로 낮·밤을 통합한 주간(프라 풋 · 수성) 기준으로 계산했습니다. 생시를 등록하면 밤(18:00~06:00) 출생은 프라 라후 수호신으로 정밀 판정됩니다.'
      : '';

    // 4. 호라삿 행성 친우(쿳밋)·원수(쿳사뚜) 역학, 마하탁사 소운(Antardasha), 4원소 계절 결단 윈도우
    const planetaryFriendEnemyDynamic = calculateThaiPlanetaryFriendEnemyDynamic(birthPlanet.id, currentSegment.planetId);
    const mahaThaksaAntardasha = calculateThaiMahaThaksaAntardasha(birthPlanet.id, currentSegment.planetId, currentSegment.years, currentSegment.startAge, cyclePosition);
    const seasonalThaatTactics = calculateThaiSeasonalThaatTactics(birthThaat.id);

    const calculatedAtKst = formatThaiHorasatKstTimestamp(targetDate);
    const q = (params.question || '').trim();
    const horasatSynthesisMatrix = {
      dominantTension: `${birthPlanet.thaiName}(${birthPlanet.planet}) ↔ ${currentSegment.planet.thaiName}(${currentSegment.planet.planet})`,
      alignmentState: `${attribute.korean}(${attribute.verdictClass}) · 본명 원소(${birthThaat.korean}) · ${planetaryFriendEnemyDynamic.relationshipType}`,
      integratedAction: `${mahaThaksaAntardasha.actionAdvice}${q ? ` [질문 맥락: ${q}]` : ''}`,
    };
    const interpretiveBoundary = '본 태국 호라삿(Horasat) 8요일·마하탁사·4원소 리포트는 전통 역법·행성 주기 기반의 자기 성찰 안내이며, 의학적 진단이나 확정적 미래 단정이 아닙니다.';

    return {
      status: 'calculated',
      engineVersion: THAI_HORASAT_ENGINE_VERSION,
      method: THAI_HORASAT_METHOD,
      calculatedAtKst,
      birthInput: {
        solarDateString: resolved.solarDateString,
        originalDateString: birthdateStr,
        isLunar: resolved.isLunar,
        weekday: weekdayLabel,
        birthHour,
        timeKnown: birthHour !== null,
      },
      birthDayPlanet: birthPlanet,
      eightDayPlanets,
      mahaThaksa: {
        birthPlanetId: birthPlanet.id,
        birthPlanet,
        totalYears: MAHA_THAKSA_TOTAL_YEARS,
        ageCounting,
        sequence,
        current: {
          planetId: currentSegment.planetId,
          planet: currentSegment.planet,
          startAge: currentSegment.startAge,
          endAge: currentSegment.endAge,
          yearsLeft: currentSegment.endAge - cyclePosition,
          attribute,
          verdict,
        },
      },
      fourElements: {
        birthThaat,
        currentThaat,
        vitalityIndex,
        balanceNote,
      },
      planetaryFriendEnemyDynamic,
      mahaThaksaAntardasha,
      seasonalThaatTactics,
      remedies: {
        luckyColors: birthPlanet.colors,
        luckyDirection: birthPlanet.direction,
        practice: `${birthPlanet.direction} 방위의 ${birthPlanet.animal} 상징을 가까이하고 ${birthPlanet.colors.join('·')} 색을 몸에 두르며, ${birthThaat.herbs} — 출생 수호신 ${birthPlanet.thaiName}께 ${birthPlanet.planet}의 결에 맞춘 공양을 드리면 길운이 증폭됩니다.`,
      },
      horasatSynthesisMatrix,
      interpretiveBoundary,
      note: timeNote || undefined,
    };
  } catch (err: any) {
    return {
      status: 'error',
      engineVersion: THAI_HORASAT_ENGINE_VERSION,
      method: THAI_HORASAT_METHOD,
      note: err?.message || '호라삿 계산 실패',
    };
  }
}

/** 프롬프트 주입용 태국 호라삿 결과 포맷터 */
export function formatThaiHorasatPrompt(result: ThaiHorasatResult): string {
  if (result.status !== 'calculated' || !result.mahaThaksa || !result.fourElements || !result.birthDayPlanet) return '';
  const m = result.mahaThaksa;
  const cur = m.current;
  const fe = result.fourElements;
  const rem = result.remedies!;
  const birth = result.birthInput!;
  const timeline = m.sequence.map((s) => `${s.planet.thaiName} ${s.startAge}~${s.endAge}세(${s.years}년)`).join(' → ');

  const lines = [
    `[태국 정통 호라삿(Horasat) 8요일 · 마하탁사 대운 & 4원소 활력 리포트 (${THAI_HORASAT_ENGINE_VERSION} | ${result.calculatedAtKst || formatThaiHorasatKstTimestamp()})]`,
    `- 출생 기준: ${birth.solarDateString} ${birth.weekday}${birth.isLunar ? '(음력 → 양력 환산)' : ''}${birth.timeKnown ? ` · 생시 ${birth.birthHour}시` : ' · 생시 미입력'}`,
    `- 출생 수호신: ${result.birthDayPlanet.thaiName}(${result.birthDayPlanet.translit}) — ${result.birthDayPlanet.planet} / ${result.birthDayPlanet.animal} / 길방위 ${result.birthDayPlanet.direction} / 행운색 ${result.birthDayPlanet.colors.join('·')}`,
    result.note ? `- [주의] ${result.note}` : '',
    `- 8요일 수호신 전수: ${result.eightDayPlanets!.map((p) => `${p.weekday}=${p.thaiName}(${p.planet}, ${p.cycleYears}년)`).join(' · ')}`,
    `- 마하탁사(Maha Thaksa) 108년 대운: 출생 행성 기점 순환 [${timeline}]`,
    `- 현재 대운: 만태 나이 ${m.ageCounting}세 → ${cur.planet.thaiName}(${cur.planet.planet}) ${cur.startAge}~${cur.endAge}세 구간 (잔여 ${cur.yearsLeft}년)`,
    `- 8대 속성 판정: ${cur.attribute.thai} ${cur.attribute.korean} [${cur.attribute.verdictClass}]`,
    `  * 길흉: ${cur.verdict}`,
    `- 4대 원소(Thaat) 진단: 타고난 원소 ${fe.birthThaat.korean}(${fe.birthThaat.thai}, 담당 ${fe.birthThaat.bodySystems}) / 현재 시즌 원소 ${fe.currentThaat.korean}(${fe.currentThaat.thai})`,
    `  * 원소 균형: ${fe.balanceNote}`,
    result.planetaryFriendEnemyDynamic
      ? `[호라삿 행성 친우·원수 역학]\n- 관계 유형: ${result.planetaryFriendEnemyDynamic.relationshipType}\n  * 상호작용: ${result.planetaryFriendEnemyDynamic.strategicInteraction}`
      : '',
    result.mahaThaksaAntardasha
      ? `[마하탁사 소운(Antardasha)]\n- 현재 소운 지배성: ${result.mahaThaksaAntardasha.antardashaPlanetName} (제${result.mahaThaksaAntardasha.subCycleOrder}소운 · 속성: ${result.mahaThaksaAntardasha.antardashaAttribute}) · 템포: ${result.mahaThaksaAntardasha.pacingTempo}\n  * 실행 가이드: ${result.mahaThaksaAntardasha.actionAdvice}`
      : '',
    result.seasonalThaatTactics
      ? `[4대 원소(Thaat) 계절 결단 윈도우]\n- 최적 추진 시즌: ${result.seasonalThaatTactics.peakActionSeason} · 내실 수성 시즌: ${result.seasonalThaatTactics.defensiveSeason}\n  * 완급 조절: ${result.seasonalThaatTactics.seasonalPacingGuidance}\n  * 활력 격언: "${result.seasonalThaatTactics.vitalityPreservationMotto}"`
      : '',
    `- 개운 처방: 행운색 ${rem.luckyColors.join('·')} · 길방위 ${rem.luckyDirection}`,
    `  * 실천법: ${rem.practice}`,
    result.horasatSynthesisMatrix
      ? `- 호라삿 교차 매트릭스: 핵심 긴장(${result.horasatSynthesisMatrix.dominantTension}) · 조율 상태(${result.horasatSynthesisMatrix.alignmentState}) · 통합 실천(${result.horasatSynthesisMatrix.integratedAction})`
      : '',
    result.interpretiveBoundary ? `- 해석 경계: ${result.interpretiveBoundary}` : '',
    `- [AI 해석 지침]: 본 리포트는 입력과 구현된 태국 호라삿 규칙에 따른 계산 참고값이며, 실측 정확도나 운명의 확정을 뜻하지 않습니다. 수호신·대운 구간·속성 등급·원소 해석은 제공된 산출값을 바꾸지 않고 성찰을 돕는 전통적 관점으로 안내하십시오.`,
  ];

  return lines.filter((l) => l !== '').join('\n');
}
