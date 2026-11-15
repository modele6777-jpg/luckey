/**
 * =========================================================================
 * LUCKEY 정통 토정비결(土亭秘訣) 144괘문 수리 엔진 (Tojeong 144-Hexagram Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. 조선 정통 이지함(李之菡) 토정비결 작괘 산법을 100% 순수 수리로 구현 (Deterministic).
 *    - 사주 간지로 임의 대체하거나, LLM이 괘문을 지어내는 일을 원천 차단한다.
 * 2. 작괘(作卦) 3수(三數):
 *    - 태세수(太歲數): 대상 연도(음력 세간) 천간수 + 지지수
 *    - 월건수(月建數): 대상 연도 음력 생월의 월건(오호둔월법) 천간수 + 지지수
 *    - 일진수(日辰數): 대상 연도 음력 생일의 일진 천간수 + 지지수
 * 3. 상괘(上卦) = (세는나이 + 태세수) % 8 (나머지 0이면 8)
 *    중괘(中卦) = (당해 연도 음력 생월 날수[큰달 30·작은달 29] + 월건수) % 6 (나머지 0이면 6)
 *    하괘(下卦) = (음력 생일수 + 일진수) % 3 (나머지 0이면 3)
 *    - 상괘 1~8 × 중괘 1~6 × 하괘 1~3 = 총 144개 고유 괘문 코드(예: "111", ..., "863")
 *    - 윤달에 태어난 경우 평달로 계산하는 전통을 따른다.
 * 4. 괘 문헌 구조: 상괘(외괘)·중괘(내괘)로 주역 48괘 본괘를 정하고, 하괘(1~3)는
 *    내괘의 동효(動爻) 위치로 삼는 토정비결 전통 구성을 따른다.
 *    (외괘 8괘 × 내괘 6괘 = 48본괘 × 3동효 = 144괘)
 * 5. 세는나이는 음력 출생 연도 기준(대상 연도 - 음력 출생 연도 + 1)으로 산출한다.
 */

import type { UserProfile } from '../sharedState';
import { convertLunarToSolar, convertSolarToLunar, resolveEffectiveSolarDate } from '../lunarCalendar';

export const TOJEONG_ENGINE_VERSION = 'LUCKEY-TJ-v2.0.0';

export const TOJEONG_METHOD =
  '조선 정통 이지함 토정비결 수리 산법(태세수·월건수·일진수 작괘) 기반 144괘문 결정론적 계산';

export type TojeongLuckGrade = '대길' | '길' | '평' | '주의' | '흉';
export type TojeongStatus = 'calculated' | 'skipped' | 'error';

export interface TojeongMonthlyFortune {
  month: number;
  fortune: string;
  tip: string;
}

export type FiveElement = '목(木)' | '화(火)' | '토(土)' | '금(金)' | '수(水)';
export type TrigramElementRelation = '상생(生入)' | '상생(生出)' | '비화(比和)' | '상극(克出)' | '상극(克入)';

export interface TojeongTrigramAnalysis {
  upperElement: FiveElement;
  lowerElement: FiveElement;
  elementRelation: TrigramElementRelation;
  elementRelationDesc: string;
  harmonyScore: number; // 0 ~ 100
  seasonalFlow: {
    springScore: number;
    summerScore: number;
    autumnScore: number;
    winterScore: number;
    peakSeason: '봄(1~3월)' | '여름(4~6월)' | '가을(7~9월)' | '겨울(10~12월)';
  };
  hexagramEssenceAdvice: string;
}

export interface TojeongResult {
  status: TojeongStatus;
  note?: string;
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;
  targetYear: number;
  targetYearGanZhi: string;
  method: string;
  ageKorean: number;
  lunarBirth: { year: number; month: number; day: number; isLeapMonth: boolean };
  taeseCount: number;
  wolgeonCount: number;
  iljinCount: number;
  birthMonthGanZhi: string;
  birthdayGanZhi: string;
  birthMonthLength: number;
  upperGua: number;
  middleGua: number;
  lowerGua: number;
  hexagramCode: string;
  hexagramName: string;
  upperTrigram: string;
  lowerTrigram: string;
  movingLineLabel: string;
  luckGrade: TojeongLuckGrade;
  annualSummary: string;
  monthlyFortunes: TojeongMonthlyFortune[];
  trigramAnalysis?: TojeongTrigramAnalysis;
  tojeongSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

// ---------------------------------------------------------------------------
// 육십갑자 수리 기초 (천간·지지 표기 및 조견 분해표)
// ---------------------------------------------------------------------------

const STEMS_KO = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

/** 태세수 분해표: 천간수(갑9 을8 병7 정6 무5 기9 경8 신7 임6 계5) */
const TAEGAE_STEM = [9, 8, 7, 6, 5, 9, 8, 7, 6, 5];
/** 태세수 분해표: 지지수(자11 축13 인10 묘10 진13 사9 오9 미13 신12 유12 술13 해11) */
const TAEGAE_BRANCH = [11, 13, 10, 10, 13, 9, 9, 13, 12, 12, 13, 11];
/** 월건수 분해표: 천간수는 태세 천간수와 같음 */
const WOLGEON_STEM = TAEGAE_STEM;
/** 월건수 분해표: 지지수(자9 축8 인7 묘6 진5 사4 오9 미8 신7 유6 술5 해4) */
const WOLGEON_BRANCH = [9, 8, 7, 6, 5, 4, 9, 8, 7, 6, 5, 4];
/** 일진수 분해표: 천간수는 태세 천간수와 같음 */
const ILJIN_STEM = TAEGAE_STEM;
/** 일진수 분해표: 지지수(자9 축11 인8 묘8 진11 사7 오7 미11 신10 유10 술11 해9) */
const ILJIN_BRANCH = [9, 11, 8, 8, 11, 7, 7, 11, 10, 10, 11, 9];

function ganZhiOf(ganIdx: number, zhiIdx: number): string {
  return `${STEMS_KO[((ganIdx % 10) + 10) % 10]}${BRANCHES_KO[((zhiIdx % 12) + 12) % 12]}`;
}

/** 음력 세간의 육십갑자 색인(0=갑자). 기원 4년이 갑자년이라는 역법 사실에 근거. */
function lunarYearGanZhiIndex(lunarYear: number): number {
  return (((lunarYear - 4) % 60) + 60) % 60;
}

/** 오호둔월법(五虎遁月法): 연간(年干) → 정월(인월)의 월간. 갑기년 병인, 을경년 무인, 병신년 경인, 정임년 임인, 무계년 갑인. */
function firstMonthStemIndex(yearGanIdx: number): number {
  return (yearGanIdx % 5) * 2 + 2;
}

/** 대상 음력 연도의 음력 생월에 해당하는 월건(月建). 정월=인월, 11월=자월, 12월=축월. */
function birthMonthGanZhi(lunarYear: number, lunarMonth: number): { ganIdx: number; zhiIdx: number; label: string } {
  const yearGanIdx = lunarYearGanZhiIndex(lunarYear) % 10;
  const ganIdx = (firstMonthStemIndex(yearGanIdx) + lunarMonth - 1) % 10;
  const zhiIdx = (lunarMonth + 1) % 12;
  return { ganIdx, zhiIdx, label: ganZhiOf(ganIdx, zhiIdx) };
}

/** 율리우스 일수(JDN): 일진(일주) 계산의 고정 기준점. */
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

/** 일진(日辰) 색인(0=갑자일). 2000-01-01=무오일, 1900-01-01=갑술일 이중 검증식. */
function dayGanZhiIndex(year: number, month: number, day: number): number {
  return (((julianDayNumber(year, month, day) + 49) % 60) + 60) % 60;
}

/** 대상 음력 연도의 음력 생월 날수(큰달 30 / 작은달 29). */
function lunarMonthLength(lunarYear: number, lunarMonth: number): number {
  const start = convertLunarToSolar(lunarYear, lunarMonth, 1, false);
  const next =
    lunarMonth < 12
      ? convertLunarToSolar(lunarYear, lunarMonth + 1, 1, false)
      : convertLunarToSolar(lunarYear + 1, 1, 1, false);
  const length = julianDayNumber(next.year, next.month, next.day) - julianDayNumber(start.year, start.month, start.day);
  if (length !== 29 && length !== 30) {
    throw new RangeError('음력 달의 크기를 확정하지 못했습니다.');
  }
  return length;
}

/** 당해 연도 음력 생일에 해당하는 날(양력 환산). 생일이 그 달에 없으면(작은달) 그 달의 마지막 날로 계산. */
function resolveAnniversarySolarDate(lunarYear: number, lunarMonth: number, lunarDay: number, monthLength: number): { year: number; month: number; day: number } {
  try {
    return convertLunarToSolar(lunarYear, lunarMonth, lunarDay, false);
  } catch {
    return convertLunarToSolar(lunarYear, lunarMonth, Math.min(lunarDay, monthLength), false);
  }
}

// ---------------------------------------------------------------------------
// 팔괘 · 주역 64괘 대응 (상괘=외괘 1~8, 중괘=내괘 1~6, 하괘=내괘 동효 1~3)
// ---------------------------------------------------------------------------

interface TrigramMeta {
  num: number;
  name: string;
  hanja: string;
  symbol: string;
  nature: string; // 괘상 표기용 자연 상징
  lines: [number, number, number]; // 아래 → 위
}

const TRIGRAMS: Record<number, TrigramMeta> = {
  1: { num: 1, name: '건', hanja: '乾', symbol: '☰', nature: '천', lines: [1, 1, 1] },
  2: { num: 2, name: '태', hanja: '兌', symbol: '☱', nature: '택', lines: [1, 1, 0] },
  3: { num: 3, name: '이', hanja: '離', symbol: '☲', nature: '화', lines: [1, 0, 1] },
  4: { num: 4, name: '진', hanja: '震', symbol: '☳', nature: '뢰', lines: [1, 0, 0] },
  5: { num: 5, name: '손', hanja: '巽', symbol: '☴', nature: '풍', lines: [0, 1, 1] },
  6: { num: 6, name: '감', hanja: '坎', symbol: '☵', nature: '수', lines: [0, 1, 0] },
  7: { num: 7, name: '간', hanja: '艮', symbol: '☶', nature: '산', lines: [0, 0, 1] },
  8: { num: 8, name: '곤', hanja: '坤', symbol: '☷', nature: '지', lines: [0, 0, 0] },
};

/** (외괘 번호 × 내괘 번호) → 주역 괘 일련번호(1~64, 주문왕 차례). 내괘는 간·곤을 쓰지 않는 48본괘 구성. */
const HEXAGRAM_INDEX_BY_UPPER_LOWER: number[][] = [
  /*외건*/ [1, 10, 13, 25, 44, 6, 33, 12],
  /*외태*/ [43, 58, 49, 17, 28, 47, 31, 45],
  /*외이*/ [14, 38, 30, 21, 50, 64, 56, 35],
  /*외진*/ [34, 54, 55, 51, 32, 40, 62, 16],
  /*외손*/ [9, 61, 37, 42, 57, 59, 53, 20],
  /*외감*/ [5, 60, 63, 3, 48, 29, 39, 8],
  /*외간*/ [26, 41, 22, 27, 18, 4, 52, 23],
  /*외곤*/ [11, 19, 36, 24, 46, 7, 15, 2],
];

const HEXAGRAM_NAMES = [
  '건위천', '곤위지', '수뢰둔', '산수몽', '수천수', '천수송', '지수사', '수지비',
  '풍천소축', '천택리', '지천태', '천지비', '천화동인', '화천대유', '지산겸', '뇌지예',
  '택뢰수', '산풍고', '지택림', '풍지관', '화뢰서합', '산화비', '산지박', '지뢰복',
  '천뢰무망', '산천대축', '산뢰이', '택풍대과', '감위수', '이위화', '택산함', '뇌풍항',
  '천산둔', '뇌천대장', '화지진', '지화명이', '풍화가인', '화택규', '수산건', '뇌수해',
  '산택손', '풍뢰익', '택천쾌', '천풍구', '택지췌', '지풍승', '택수곤', '수풍정',
  '택화혁', '화풍정', '진위뢰', '간위산', '풍산점', '뇌택귀매', '뇌화풍', '화산려',
  '손위풍', '태위택', '풍수환', '수택절', '풍택중부', '뇌산소과', '수화기제', '화수미제',
];

// ---------------------------------------------------------------------------
// 48본괘 문헌: 품격 있는 총론(격 格 서술)과 12개월 괘상 구절
// ---------------------------------------------------------------------------

interface HexagramEntry {
  upper: number; // 외괘(1~8)
  lower: number; // 내괘(1~6)
  grade: TojeongLuckGrade;
  essence: string; // 총론 본문 (…격 서술)
  months: [string, string, string, string, string, string, string, string, string, string, string, string]; // 1~12월 괘상 핵심구
}

const HEXAGRAM_LIBRARY: HexagramEntry[] = [
  // ── 외괘 건(天) ───────────────────────────────────────────────
  { upper: 1, lower: 1, grade: '길', essence: '하늘이 다시 하늘을 이룬 건위천의 격이라, 자강(自强)의 기운이 해를 관통한다. 스스로 정한 도리를 하루도 게을리하지 않으면 명망과 성취가 함께 오른다.',
    months: ['용이 물속에서 깨어나는 달', '넓은 들판에 나타나는 달', '밤낮을 가르며 부지런해지는 달', '힘차게 하늘로 오르는 달', '하늘구경을 하되 교만을 삼가는 달', '날개를 다듬어 높이 나는 달', '덕을 얻어 무리를 이끄는 달', '과욕을 꺾어 되돌아오는 달', '스스로를 다스려 무너짐을 막는 달', '날개를 접고 힘을 비축하는 달', '낮은 자리에서 실속을 쌓는 달', '공로를 궤에 쌓아 지키는 달'] },
  { upper: 1, lower: 2, grade: '주의', essence: '호랑이 꼬리를 밟듯 조심스러운 천택리의 격이라, 예(禮)를 갖춘 걸음만이 스스로를 지킨다. 허세와 경거망동을 삼가면 무탈하게 바람직한 성취에 이른다.',
    months: ['걸음을 먼저 다듬는 달', '낯선 땅을 조심히 밟는 달', '눈빛을 곱게 가다듬는 달', '위태로운 길목을 지나는 달', '결단 앞에 잠시 멈추는 달', '예의로써 화를 물리치는 달', '정성이 두껍게 쌓이는 달', '시험받는 마음을 고요히 다스리는 달', '결심을 내리고 나아가는 달', '험한 길을 조용히 건너는 달', '노력에 마땅한 보람이 오는 달', '굳게 지켜 무사히 넘기는 달'] },
  { upper: 1, lower: 3, grade: '길', essence: '하늘 아래 불이 밝아 화합하는 천화동인의 격이라, 뜻을 같이하는 이와 힘을 모으면 큰 일이 이룬다. 솔선수범하는 몸가짐이 곧 사람을 감화시키는 힘이 된다.',
    months: ['뜻을 같이할 벗을 만나는 달', '손을 맞잡고 나아가는 달', '우의가 두터워지는 달', '높은 곳에서 아낌없이 부르는 달', '중심에서 빛을 발하는 달', '큰 소리 없이 사람을 감화시키는 달', '공이 열매를 맺는 달', '닫혔던 문이 열리는 달', '빛이 넓게 퍼지는 달', '먼 곳에서 귀인이 오는 달', '무리와 함께 기뻐하는 달', '한 해의 뜻이 하늘에 닿는 달'] },
  { upper: 1, lower: 4, grade: '평', essence: '지나침이 없이 바를 지키는 천뢰무망의 격이라, 기대와 욕심을 덜어낸 정직함이 복이 된다. 사심 없이 행하면 뜻밖의 귀인이 도와준다.',
    months: ['바른 첫걸음을 내딛는 달', '서두르지 않고 여문다', '헛된 움직임을 삼가는 달', '덕을 갈고닦는 달', '쌓인 병화(病火)가 풀리는 달', '약을 쓰지 않아도 낫는 달', '욕심을 내려놓아 마음이 가벼워지는 달', '뜻밖의 재물이 문을 두드리는 달', '스스로를 단속하는 달', '길 위에서 벗을 만나는 달', '새 터전을 여는 달', '그 결실을 누리는 달'] },
  { upper: 1, lower: 5, grade: '주의', essence: '밑빠진 그릇을 새로 메우는 천풍구의 격이라, 근본을 다시 다져야 한다. 겉치레를 버리고 바른 사람의 말을 따르면 늦지 않아 결실이 온다.',
    months: ['새 그릇을 준비하는 달', '마음의 틈을 메우는 달', '시끄러운 일에 휘말리지 않는 달', '좋은 씨앗을 골라 심는 달', '오래된 고임을 파내는 달', '작은 균열을 붙이는 달', '그물이 마침내 고기를 거두는 달', '허하던 그릇이 차오르는 달', '귀인의 손길이 닿는 달', '낡은 문짝을 갈아붙이는 달', '뒤늦게 피어도 고운 꽃이 피는 달', '수확을 궤에 쌓는 달'] },
  { upper: 1, lower: 6, grade: '주의', essence: '하늘과 물이 어긋나 다투는 천수송의 격이라, 언쟁과 소송이 따르기 쉽다. 이로서는 이루지 못함을 아는 중용이 최선이며, 공정한 중재자를 만나면 흐름이 풀린다.',
    months: ['말다툼이 끓어오르는 달', '조용히 물러나 앉는 달', '옛 일이 다시 끓어오르는 달', '믿음직한 이를 붙드는 달', '옥을 들고 부을 부르듯 올곧게 아뢰는 달', '씌워진 누명을 벗는 달', '큰 화를 면하는 달', '갑옷을 벗어 화평을 맺는 달', '이기려는 마음을 내려놓는 달', '승소보다 평화를 택하는 달', '풀어진 매듭을 다시 묶지 않는 달', '정론으로 마무리하는 달'] },

  // ── 외괘 태(澤) ───────────────────────────────────────────────
  { upper: 2, lower: 1, grade: '길', essence: '습이 하늘로 솟아오르는 택천쾌의 격이라, 결단과 통쾌함의 해이다. 미루어진 일을 과감히 끝내되 오만함만 경계하면 크게 통한다.',
    months: ['미련을 정리하는 달', '통쾌한 결단이 오는 달', '말과 행동이 일치해 믿음을 얻는 달', '명예를 두고 신중해지는 달', '흔들리는 마음이 돌아오는 달', '쌓인 병화를 떨쳐내는 달', '홀로 아픔을 견디는 달', '땀 흘려 갈고닦는 달', '사방이 막힌 답답함이 걷히는 달', '무리와 화해하는 달', '묶었던 인연이 풀리는 달', '열매를 햇볕에 말려 지키는 달'] },
  { upper: 2, lower: 2, grade: '길', essence: '물이 물을 만나 기쁨을 더하는 태위택의 격이라, 친구와 벗이 도와주어 마음이 후련하다. 서로 익히는 정성이 쌓이면 뜻밖의 즐거움이 온다.',
    months: ['마음을 비우고 시작하는 달', '좋은 인연이 겹쳐 오는 달', '서로 보탬이 되는 달', '물고기가 물을 얻듯 순통한 달', '증오를 내려놓는 달', '아픔이 아물어가는 달', '무리와 함께 노래하는 달', '낡은 벽에 옥을 붙이는 달', '약속이 성취되는 달', '묶이던 것이 스르풀 풀리는 달', '숨겨둔 보물을 드러내는 달', '부지런함이 후회 없는 달'] },
  { upper: 2, lower: 3, grade: '길', essence: '가죽을 벗겨 새로움을 이루는 택화혁의 격이라, 하늘이 명하여 낡은 틀을 바꾸는 때이다. 스스로 먼저 다듬으면 사람이 저절로 따른다.',
    months: ['말과 털이 다시 자라는 달', '전쟁을 마치고 명령을 내리는 달', '말을 부리고 멀리 나아가는 달', '낡은 옷을 벗는 달', '호랑이가 눈을 번쩍 뜨는 달', '범이 날개를 얻는 달', '군자가 몸을 새로 단장하는 달', '소인이 얼굴을 검게 하는 달', '개과천선하는 달', '굳게 믿어 의심하지 않는 달', '날개가 넓어지는 달', '몸과 마음이 같이 새로워지는 달'] },
  { upper: 2, lower: 4, grade: '평', essence: '속에 얼어붙은 기운이 있는 택뢰수의 격이라, 바깥은 웃고 속은 굳는 때이다. 유대인(有大人)의 덕을 따르면 문이 열리고 밖으로 나아갈 수 있다.',
    months: ['겉과 속이 다른 달', '짐을 내려놓는 달', '마소가 서로 어긋나는 달', '뒤늦은 후회가 오는 달', '좋은 지도자를 만나는 달', '지은 나라가 밝아지는 달', '붙들어 매는 마음이 느슨해지는 달', '묶음이 풀려 홀가분한 달', '속이 아물어가는 달', '조화(皎花)를 맺는 달', '전학이 그치는 달', '묵은 화가 눈 녹듯 풀리는 달'] },
  { upper: 2, lower: 5, grade: '주의', essence: '다 떨어진 몸을 지나쳐 스러져가는 택풍대과의 격이라, 지극히 어긋난 때에는 약한 쪽으로 물러나 홀로 지키는 지혜가 필요하다. 과욕은 화를 부른다.',
    months: ['하얀 세수수레를 꽂는 달', '등나무 덩굴이 나무에 감기는 달', '나무가 힘없이 처지는 달', '다락 지붕이 우거지는 달', '불에 타는 물에 빠지는 어려움을 견디는 달', '아름다운 물고기를 버리는 달', '뒤집어진 그릇을 굽어보는 달', '별을 건너며 혼자 걷는 달', '날아오르는 닭의 우는 소리를 들으면 조심하는 달', '물에 들어가 목을 젖히는 달', '길이 험하여 길을 잃는 달', '급한 물살을 조심히 건너는 달'] },
  { upper: 2, lower: 6, grade: '주의', essence: '물이 물 위에 이끼처럼 앉아 굶주림을 이루는 택수곤의 격이라, 감언이설에 넘어가지 말고 조용히 지키는 길이 살길이다. 끊기지 않는 뜻만이 판을 바꾼다.',
    months: ['엉덩이가 나무에 걸려 움직이지 못하는 달', '술 마시고 먹을 것이 절로 오는 달', '산 나귀를 품는 달', '옥석이 뒤섞여 술에 취하는 달', '벌거벗고 걸어가는 신세에 마땅히 삼가는 달', '무림(武門)의 갑옷을 벗는 달', '세 갈래의 눈을 보는 달', '죄를 입어 밧줄에 묶이는 것을 조심하는 달', '방패 가죽이 아직 부드러운 달', '무릎이 나무에 걸려 조심하는 달', '덤불 속에 홀로 있는 달', '싸다가 베어 맞지 않게 조심하는 달'] },

  // ── 외괘 이(火) ───────────────────────────────────────────────
  { upper: 3, lower: 1, grade: '대길', essence: '해가 중천에 뜬 화천대유의 격이라, 크고 막중한 복이 마땅히 있을 자리에 이른다. 아름다운 말과 활 같은 신중함으로 널리 베풀면 하늘이 도와준다.',
    months: ['짐꾼을 두고 걷지 않는 달', '큰 수레를 끄는 달', '번창한 아름에 불티가 없는 달', '하늘이 우레와 같이 도와주는 달', '밝게 웃으며 넘어가는 달', '다른 색깔 없이 순수한 달', '하늘이 든든한 달', '큰 빛을 내며 아뢰는 달', '다스림의 덕이 두루 퍼지는 달', '공중에서 명망이 얻어지는 달', '하늘을 형상 삼아 우러러 볼 일이 없는 달', '복을 크게 누리는 달'] },
  { upper: 3, lower: 2, grade: '평', essence: '마음이 서로 어긋나 등을 돌린 화택규의 격이라, 작은 일은 통하지만 큰 일은 어긋나기 쉽다. 악마 같은 사람을 조심하되, 시간을 두고 인연을 가리면 다시 합해진다.',
    months: ['서로 소중히 여겨 물러나는 달', '빈 골목을 혼자 지나는 달', '궂은 말에 조심하는 달', '눈 어린 악마를 조심하는 달', '고통에 휩싸이지 않게 조심하는 달', '무릎이 아플 만큼 아픈 일에도 굳은 마음을 지키는 달', '가난한 귀인을 조용히 도와주는 달', '좋은 사람이 사방에서 오는 달', '독사를 조심하는 달', '홀로 눈물을 삼키는 달', '화살이 쏘아지는 것을 조심하는 달', '이슬 같은 믿음을 쌓는 달'] },
  { upper: 3, lower: 3, grade: '길', essence: '해와 달이 하늘을 떠받쳐 이위화의 격이라, 부녀자가 맑고 밝은 인격으로써 집안을 비춘다. 순리에 따라 지키면 두루 이익이 온다.',
    months: ['장정 같은 곳에 머물며 다스리는 달', '노랗되면 크게 길한 달', '해가 서쪽으로 기울기를 보며 노래하는 달', '폭풍 같은 분노를 조심하는 달', '눈물이 뚝뚝 흐르는 슬픔을 견디는 달', '제왕처럼 나서서 다스리는 달', '해 중천에 떠서 빛나는 달', '병화(兵火)를 조심하는 달', '낮게 숨어 지키는 달', '갑자기 밝아지는 달', '눈물이 마르고 해가 뜨는 달', '형(刑)을 받지 않게 조심하는 달'] },
  { upper: 3, lower: 4, grade: '주의', essence: '번개가 벼릿하며 이빨을 가는 화뢰서합의 격이라, 막힌 길목을 헤쳐 나가는 힘겨운 때이다. 명분을 세우고 공경으로써 다스리면 비로소 통한다.',
    months: ['발목에 수갑을 찬 듯 움직임이 답답한 달', '막힌 길을 헤치는 달', '독이 묻은 고기를 삼키지 않는 달', '쇠를 갈아 화살을 만드는 달', '뼈에 검을 씌워 시달리는 달', '가죽을 벗겨 금을 긋는 달', '무거운 화살을 받는 달', '큰 뼈를 가로막는 달', '둥근 고리로 범을 묶는 달', '화살로 하늘을 겨누는 달', '헛 걸음에 시달리는 달', '곤장을 면해 복을 얻는 달'] },
  { upper: 3, lower: 5, grade: '대길', essence: '나무 아래 화로가 붙어 국숫집 불이 북북 치솟는 화풍정의 격이라, 새 그릇에 새 음식이 끓어오른다. 명망과 기운을 얻어 크게 이룰 때이니 도둑만 조심하라.',
    months: ['다리를 뒤집어 쓸어버리는 달', '그릇에 실속을 채우는 달', '귀에 좋지 않은 말을 삼가는 달', '기름이 넘치는 냄비를 조심하는 달', '쏟아지는 눈알을 조심하는 달', '벼려진 황금을 조심스레 다루는 달', '홀가분한 몸이 부지런해지는 달', '큰 날개를 얻어 훨훨 나는 달', '옥석을 골라 가리는 달', '벼려낸 상투를 얻는 달', '대옥(大玉)을 받쳐 올리는 달', '불멸(不朽)의 기틀을 세우는 달'] },
  { upper: 3, lower: 6, grade: '주의', essence: '해가 질 무렵 물에 비친 화수미제의 격이라, 아직 살피고 헤아리기에 이르지 못한 때이다. 두루 헤아려 옳게 나아가면 큰 그릇이 되고, 그치지 않으면 야망만 남는다.',
    months: ['꼬랑이를 헤엄쳐 건너는 달', '오래 기다려 아름답게 화살을 쏘는 달', '마소가 마르는 아픔을 조심하는 달', '한 쪽만 아픈 몸을 조심하는 달', '무릎을 적시며 조심히 건너는 달', '고기를 비집고 나는 달', '고개를 조심히 들어 올리는 달', '또렷이 숨어 보내는 달', '폭포 아래 비단을 적시는 달', '매를 잡아 봄에 죽이지 않는 달', '기와를 얻어 두루 쓸모 있게 되는 달', '머리를 너무 들지 말아 조심하는 달'] },

  // ── 외괘 진(雷) ───────────────────────────────────────────────
  { upper: 4, lower: 1, grade: '길', essence: '뇌천대장의 격이라, 강인한 기운이 하늘에 얹혀 크게 들다(大壯) 한다. 힘이 센 만큼 예(禮)로 삼지 않으면 반드시 어긋나니, 흐름을 따라 나아가면 길하다.',
    months: ['발을 힘차게 딛는 달', '길이 부지런히 열리는 달', '성벽에 울타리를 두르는 달', '쇠뿔이 빠지듯 헛되이 힘을 쓰지 않는 달', '빠진 가죽을 메우는 달', '채밭에서 뛰어다니지 않게 조심하는 달', '호밀을 한들 쳐 흔들지 않게 조심하는 달', '서쪽 땅에 살진 양을 놓는 달', '새로 크게 확장하는 달', '수레 바퀴가 삐걱대는 것을 조심하는 달', '양에게 산양 뿔이 붙는 달', '꼬리를 조심스레 감추는 달'] },
  { upper: 4, lower: 2, grade: '평', essence: '귀매(歸妹)의 격이라, 나가야 할 곳과 물러나야 할 곳을 가리는 법도가 중요한 해이다. 등잔 밖을 밝게 비추면 여자가 맺어지고, 상하가 서로 예를 갖추면 대길이 온다.',
    months: ['누이가 시집가는 달', '쇠눈으로 보아 흐뭇한 달', '눈이 부은 것을 가만히 삼키는 달', '세 갈래 팔을 얻어 힘을 얻는 달', '귀밑에 있는 것을 조심하는 달', '달을 향해 두 손을 모으는 달', '가죽에 붙은 것을 조심하는 달', '환한 주머니를 드는 달', '책상을 조심히 덮는 달', '마의 눈을 조심하는 달', '제비가 물어다 붙이는 달', '가죽짝이 얻어지는 달'] },
  { upper: 4, lower: 3, grade: '길', essence: '우레가 화로 위에서 울리고 뇌화풍의 격이라, 나아감(旅)과 이동에 부합하는 해이다. 먼 데에 나아가되 조심스러운 마음가짐을 지키면 귀한 것을 얻는다.',
    months: ['곳곳에 불티를 삼가는 달', '가게가 낡아 망가지는 것을 조심하는 달', '화살이 땅에 떨어지는 것을 조심하는 달', '불을 지펴 아랫사람을 태우는 달', '화살을 쏘아 한 번에 이룩하는 달', '새 둥지에 불이 나지 않게 조심하는 달', '농사를 지어 두루 거두는 달', '소를 얻어 우물가에서 목이 아픈 것을 조심하는 달', '귀한 것을 잃어버리지 않게 조심하는 달', '쇠뿔이 열려 나는 것을 조심하는 달', '가짜 깃털을 조심하는 달', '새 날개를 얻어 풍요로워지는 달'] },
  { upper: 4, lower: 4, grade: '평', essence: '우레가 또 우레나 진위뢰의 격이라, 움직임이 겹치되 허둥대지 않는 태도가 중요하다. 백 리 밖의 일도 두렵지 않되, 잔숟가락을 떨구는 신중함을 지키라.',
    months: ['우레가 잠잠해지는 달', '문밖에 나가 조심하는 달', '먼 길을 가더니 돌아오는 달', '썩어 빠지는 것을 조심하는 달', '숨을 고르며 조심히 움직이는 달', '큰 판을 움직이되 노여움을 삼가는 달', '고개를 조심스레 들어 올리는 달', '묵은 판을 새로 바꾸는 달', '소가 두려워하며 걷는 것을 조심하는 달', '지나친 움직임을 삼가는 달', '두루 이웃한 이와 좋게 지내는 달', '귀밑에 상처가 나지 않게 조심하는 달'] },
  { upper: 4, lower: 5, grade: '길', essence: '우레가 바람 위에 울리고 우레가 나무 위에 엎드리는 뇌풍항의 격이라, 변치 않고 오래가는 도(道)가 있다. 사방이 안정되고 큰 들녘에 나아가면 길하다.',
    months: ['깊이 들어 나가지 않는 달', '그물 빠진 물고기를 슬퍼하지 않는 달', '거울에 비친 것을 마땅히 조심하는 달', '먼 데로 나아가되 조심하는 달', '웅덩이 속에 빠진 것을 조심하는 달', '큰 숲에 나가지 않게 조심하는 달', '비늘이 떨어지는 것을 조심하는 달', '홀로 늙어 지나는 달', '팔이 넓은 이를 조심하는 달', '바람이 등 뒤에서 붐비는 것을 조심하는 달', '고개를 숙여 사방을 보지 않는 달', '우레를 접어 문 위에 두는 달'] },
  { upper: 4, lower: 6, grade: '길', essence: '우레가 물 위에서 힘차게 퍼지는 뇌수해의 격이라, 묶였던 것이 풀리는 해방의 계절이다. 서쪽과 남쪽으로 나아가되 얼어붙지 말고, 낮의 짐승처럼 서서히 풀어나가면 소원이 이루어진다.',
    months: ['묶은 것을 풀어주는 달', '그물을 다 걷어내는 달', '호밀을 짊어진 채 조심스레 걷는 달', '발바닥에 칼이 박히지 않게 조심하는 달', '홀로 풀어 헤치는 달', '큰 사람이 홀로 서서 베어 맞는 것을 조심하는 달', '죄인을 풀어주는 달', '매를 잡아 벽 위에서 던지지 않게 조심하는 달', '홀로 풀리는 달', '귀한 것을 잃어버리지 않게 조심하는 달', '덩굴을 얻어 고개를 들게 하는 달', '매를 쳐 황후가 찾아오는 달'] },

  // ── 외괘 손(風) ───────────────────────────────────────────────
  { upper: 5, lower: 1, grade: '평', essence: '바람이 하늘에 퍼져 나가는 풍천소축의 격이라, 작게 쌓아 크게 이루는 시즌이다. 아직은 큰 짐승을 쫓지 말고, 먼 데를 치지 않는 인내가 이득이다.',
    months: ['바람 아래 흐르는 물을 되돌려 보내는 달', '짐을 접어 되돌아오는 달', '바퀴가 빠지지 않게 조심하는 달', '눈을 깜박이며 조심히 움직이는 달', '홀로 부자가 되는 것을 조심하는 달', '스스로를 무릎에 앉혀 조심하는 달', '큰 길이 열려 나아가는 달', '하늘이 우레와 같이 도와주는 달', '큰 사람이 작은 사람의 말을 듣지 않는 달', '작은 것을 쌓아 크게 이루는 달', '부러진 바퀴를 조심하는 달', '큰 말을 타고 높이 오르는 달'] },
  { upper: 5, lower: 2, grade: '길', essence: '바람과 물이 서로 스며 풍택중부의 격이라, 언어의 신뢰(중부)가 물과 같이 스며든다. 정직한 말과 삼가는 마음이 갖추어지면 복이 저절로 온다.',
    months: ['장(章)을 맞추어 다른 쪽과 소통하는 달', '명이 겹쳐 오는 달', '적이 나타나 조심하는 달', '해가 바뀌어 가는 달', '바람이 그치는 것을 조심하는 달', '달이 바뀌어 오는 달', '말을 아끼며 조심하는 달', '나는 말을 붙들어 매지 않는 달', '장중한 웃음을 조심하는 달', '날개가 없어도 오르는 달', '수탉의 울음소리가 차올라 조심하는 달', '매가 물어 상처가 나지 않게 조심하는 달'] },
  { upper: 5, lower: 3, grade: '길', essence: '바람이 불 위에 불고 풍화가인의 격이라, 집안이 바르면 온 천하가 바른다. 가운데 있어 바르면 무리한 곳도 조용히 다스려진다.',
    months: ['문 위에 띠를 놓는 달', '여섯 갈래 길에 마땅히 조심하는 달', '가운데서 부지런히 움직이는 달', '나라가 크게 부흥하는 달', '왕이 문에 이르러 다스리는 달', '목이 마르고 화를 조심하는 달', '고개를 숙여 나라를 세우는 달', '울음소리가 끊어지는 것을 조심하는 달', '장중한 군주가 다스리는 달', '별이 밝게 뜨는 달', '좋은 곳에서 신뢰를 얻는 달', '장중한 위엄이 마침내 악을 이기는 달'] },
  { upper: 5, lower: 4, grade: '대길', essence: '바람과 우레가 서로 돕는 풍뢰익의 격이라, 나아가는 데에 크게 이익이 있고 큰 강을 건너는 데도 마땅하다. 덕을 쌓아 두루 베풀면 큰 길이 열린다.',
    months: ['큰 일을 막지 말아 크게 이익이 되는 달', '열 개 짝의 힘을 받는 달', '국익을 위해 앞장서는 달', '묶었던 것을 바쳐 달라며 조심하는 달', '정직한 마음을 두루 베푸는 달', '모두의 눈앞에서 기뻐하는 달', '덕을 쌓아 크게 진보하는 달', '뚝을 쌓아 크게 이룩하는 달', '손바닥을 조심스레 베어 바치지 않는 달', '큰 뜻을 놓지 않는 달', '악한 것을 쳐 내는 달', '묶음을 베어 내려 주는 달'] },
  { upper: 5, lower: 5, grade: '평', essence: '바람이 바람을 따르는 손위풍의 격이라, 작은 힘이지만 큰 일을 이루려면 흐름을 따라가야 한다. 재물이 군(軍)을 따라 들어오니, 들다(遁) 하기 전에 조용히 다스리라.',
    months: ['서서히 나아가되 조심하는 달', '곱게 빗어 내리는 달', '옷깃을 조심스레 여미는 달', '국(哭)하는 소리를 조심하는 달', '부지런히 움직이되 태만해지지 않는 달', '큰 날개를 접어 조용히 다스리는 달', '큰 그릇에 채우듯 부지런한 달', '문 앞에서 조심하는 달', '큰 들녘에 나가되 조심하는 달', '계절이 바뀌는 것을 조심하는 달', '고개를 숙이고 조용히 다스리는 달', '높은 문짝을 조심하는 달'] },
  { upper: 5, lower: 6, grade: '평', essence: '바람이 물 위에 불고 풍수환의 격이라, 왕이 시(祠)에 나아가 하늘에 고하는 격이다. 흐트러진 것을 다시 모으되, 크게 믿어두고 조용히 스며가게 하는 지혜가 필요하다.',
    months: ['큰 봉지를 짊어진 채 힘이 들어가는 달', '달이 바뀌어 오는 달', '말이 빠지듯 헛되이 움직이지 않는 달', '산 꼭대기에서 조심하는 달', '기름에 몸을 담그지 않게 조심하는 달', '하얀 피부가 되도록 조심하는 달', '홀로 밝게 웃으며 조심하는 달', '큰 탄식을 조심하는 달', '피를 흘리지 않게 조심하는 달', '큰 그릇에 담아 조심스레 나누는 달', '큰 문에 씌여 조심하는 달', '앉아서 조심스레 다스리는 달'] },

  // ── 외괘 감(水) ───────────────────────────────────────────────
  { upper: 6, lower: 1, grade: '길', essence: '물이 하늘 위에 모여 수천수(需)의 격이라, 성실함이 밝게 통하고 뜻대로 되는 해이다. 멀리 갈 일이 있으면 곱게 나아가되 급한 물살을 조심하라.',
    months: ['교외(郊外)에서 기다리는 달', '모래 사이에서 기다리는 달', '진흙 속에서 조심스레 기다리는 달', '피 가죽으로부터 조심하는 달', '술과 음식이 마땅히 조심히 오는 달', '큰 웅덩이 속에서 조심하는 달', '작은 말이 끌려오는 달', '웅덩이에 빠지지 않게 조심하는 달', '손님을 맞아 크게 기뻐하는 달', '술과 음식이 마땅히 조심스레 다가오는 달', '벼려 나온 칼끝을 조심하는 달', '빠져나온 것을 조심하는 달'] },
  { upper: 6, lower: 2, grade: '평', essence: '물과 물이 만나 벼려진 절(節)의 격이라, 지나침 없이 마땅히 지킬 바닥을 아는 해이다. 썩은 문짝을 조심히 다스리면 아름다운 결실이 온다.',
    months: ['문짝을 벗어나지 않는 달', '쓸데없이 나가지 않는 달', '기와를 두루 쓰지 않는 달', '썩은 판을 조심하는 달', '큰 죄인을 조심하는 달', '문을 닫아 조심하는 달', '가죽을 조심히 다루는 달', '썩은 문이 다시 벗겨지지 않게 조심하는 달', '칼끝을 조심하는 달', '가죽을 벗겨 조심스레 다스리는 달', '쓸데없이 벽에 기대지 않는 달', '문을 닫아 조심스레 지키는 달'] },
  { upper: 6, lower: 3, grade: '평', essence: '물 위에 불이 올라 수화기제(旣濟)의 격이라, 이미 건넌 강이지만 지키기가 더 어려운 해이다. 다 건넜다고 게으름 피우면 반드시 뒤돌아 온다. 조그마한 일을 옳게 끝내면 큰 그릇이 된다.',
    months: ['바퀴가 빠지지 않게 조심하는 달', '여자가 장막을 잃어버리지 않게 조심하는 달', '동방에 나가 조심하는 달', '흔들리는 옷깃을 조심하는 달', '동쪽 이웃을 살피며 조심하는 달', '칼 끝이 빠지듯 헛되이 움직이지 않는 달', '목을 젖히며 조심하는 달', '고개를 숙여 조심하는 달', '동쪽에서 피가 흐르지 않게 조심하는 달', '남쪽을 향해 조심스레 다스리는 달', '가죽이 눈에 띄지 않게 조심하는 달', '목을 씻어 조심하는 달'] },
  { upper: 6, lower: 4, grade: '주의', essence: '물이 우레 아래로 흘러 수뢰둔(屯)의 격이라, 새싹이 얼어붙은 형편이니 아직 크게 나아가기 어렵다. 마른 나무를 조심스레 심어 물을 얻으면 비로소 밝아진다.',
    months: ['말이 빠지듯 헛되이 움직이지 않는 달', '팔이 넓은 이를 조심하는 달', '호밀을 쳐 올리는 것을 조심하는 달', '피 가죽이 오래되어 조심하는 달', '작은 팔이 스스로 뻗어 조심하는 달', '귀한 것을 잃어버리지 않게 조심하는 달', '국화(菊花)가 핀다 하되 곱게 웃지 않는 달', '새 가죽이 다시 날개를 얻어 조심하는 달', '문짝이 나오지 않게 조심하는 달', '말이 스스로 물러나 조심하는 달', '피가 눈에 띄지 않게 조심하는 달', '말 눈이 힘없이 처지지 않게 조심하는 달'] },
  { upper: 6, lower: 5, grade: '길', essence: '물이 나무 위로 올라 수풍정(井)의 격이라, 우물을 파되 옮기지 않는 인내가 있다. 쓸모 있게 되면 마른 강도 메우는 물이 되니, 마음의 우물을 깊게 파라.',
    months: ['우물을 파되 파지 않게 조심하는 달', '쏟아지는 것을 조심하는 달', '바닥을 두루 메우는 달', '문 위에 씌여 조심하는 달', '우물이 차올라 조심하는 달', '죄인이 우물가에서 조심하는 달', '냉(冷)하지 않게 조심하는 달', '죽은 것을 조심하는 달', '우물이 맑게 차오르는 달', '두루 파 내는 달', '문 안에서 조심하는 달', '우물이 조용히 지켜지는 달'] },
  { upper: 6, lower: 6, grade: '흉', essence: '물이 물 위에 겹쳐 흐르는 감위수(坎)의 격이라, 겹친 험난 속에서 오가는 힘겨움이 큰 해이다. 감옥 같은 답답함을 이기려면 평소의 삼가는 마음과 벗의 도움이 살길이다. 큰 일은 미루고 작은 것부터 성실히 하라.',
    months: ['웅덩이에 빠져 견디는 달', '험한 골짜기가 겹쳐 조심하는 달', '웅덩이가 겹쳐 드나들기 어려운 달', '술 한 그릇이 마땅히 조심스러운 달', '웅덩이가 채워지지 않게 조심하는 달', '평평한 곳도 조심하는 달', '죄인이 두르개에 매이지 않게 조심하는 달', '벼려 낸 칼끝을 조심하는 달', '웅덩이가 남아 조심하는 달', '홀로 벼려 조심하는 달', '묶여 다니는 것을 조심하는 달', '평평한 땅도 조심스레 걷는 달'] },

  // ── 외괘 간(山) ───────────────────────────────────────────────
  { upper: 7, lower: 1, grade: '길', essence: '산이 하늘 아래 크게 얹혀 산천대축(畜)의 격이라, 쌓아 둔 덕이 크게 이익이 된다. 큰 들녘에서 큰 가축을 기르듯 실속을 쌓으면 먼 곳에도 이익이 온다.',
    months: ['험한 골짜기를 조심히 건너는 달', '모퉁이가 둥근 것을 조심하는 달', '채찍이 빠지듯 헛되이 움직이지 않는 달', '썩은 나무를 조심하는 달', '이빨이 빠지듯 헛되이 힘을 쓰지 않는 달', '돌을 갈아 비녀로 쓰는 달', '뼈를 조심하는 달', '소가 두려워 떨면서 조심히 걷는 달', '훈(勳)을 세우는 달', '아름다운 말이 차올라 조심하는 달', '가죽이 여물어 크게 이익이 되는 달', '하늘이 두텁게 보호해주는 달'] },
  { upper: 7, lower: 2, grade: '평', essence: '산 아래 물이 흘러 산택손(損)의 격이라, 아래쪽이 스스로 줄어 들어가는 형편이다. 두 그릇을 줄여 한 그릇을 채우듯, 아까운 것을 덜어 베풀면 뜻밖에 크게 이익이 온다.',
    months: ['쓸데없이 빨리 나가지 않는 달', '쓸모 있게 벼려 조심하는 달', '세 사람이 걷는 것을 조심하는 달', '한 사람이 걷다 조심하는 달', '귀고리를 조심하는 달', '큰 그릇에 가득 담아 조심하는 달', '쓸데없이 움직이지 않는 달', '쓸데없이 벌리지 않는 달', '큰 그릇을 조심하는 달', '쓸데없이 나가지 않게 조심하는 달', '큰 벼리를 얻어 조심하는 달', '쓸데없이 벼리지 않는 달'] },
  { upper: 7, lower: 3, grade: '길', essence: '산 위에 불이 밝아 산화비(賁)의 격이라, 문질을 다듬어 빛내는 해이다. 작은 것에서부터 가지런히 꾸미면 큰 곳에도 이익이 온다.',
    months: ['발을 조심히 꾸미는 달', '수염을 조심스레 다듬는 달', '젖은 뼈를 조심하는 달', '말이 하얗게 날개를 얻는 달', '빼앗은 것을 조심하는 달', '무릎을 조심하는 달', '백마가 날개를 얻어 날아가는 달', '큰 언덕에서 조심하는 달', '뼈가 얇아 조심하는 달', '백마가 하얗게 달리는 달', '가죽을 조심히 꾸미는 달', '흰 발이 벼려져 조심하는 달'] },
  { upper: 7, lower: 4, grade: '평', essence: '산 아래 우레가 울려 산뢰이(頤)의 격이라, 입과 몸을 가다듬어 양(養)하는 해이다. 스스로 힘을 얻어 실속을 채우되, 탐스러운 욕심을 조심하라.',
    months: ['귀한 신을 조심히 버리는 달', '울음소리가 절로 나와 조심하는 달', '입맛이 도도록 조심하는 달', '호랑이가 눈을 부라리며 조심하는 달', '길을 벗어나 조심하는 달', '위를 향해 조심하는 달', '거꾸로 조심하는 달', '귀한 신이 다시 벗겨지지 않게 조심하는 달', '고기를 조심스레 살피는 달', '썩은 곳에 조심하는 달', '다른 길을 조심하는 달', '큰 짐승을 건너지 않게 조심하는 달'] },
  { upper: 7, lower: 5, grade: '주의', essence: '산 아래 바람이 불고 산풍고(蠱)의 격이라, 오래된 그릇에 벌레가 생긴 형편이다. 아버지의 그릇에 벌레가 생겼으면 감히 두려워하지 말고 바로잡아라. 정화하는 일이 큰 결실로 돌아온다.',
    months: ['아버지의 그릇을 조심히 바로잡는 달', '어머니의 그릇에 벌레가 생기지 않게 조심하는 달', '아버지의 그릇을 두루 바로잡는 달', '어머니의 그릇을 조심스레 바로잡는 달', '아버지의 그릇이 다시 벗겨지지 않게 조심하는 달', '썩은 일을 바로잡는 달', '작은 일에 조심하는 달', '큰 일에 조심하는 달', '그릇에 벌레가 다시 생기지 않게 조심하는 달', '썩은 문짝을 조심하는 달', '큰 벌레를 조심하는 달', '정화된 그릇이 빛나는 달'] },
  { upper: 7, lower: 6, grade: '주의', essence: '산 아래 물이 흐르고 산수몽(蒙)의 격이라, 아직 어리석은 때이니 가르침을 구하는 겸손이 살길이다. 곱게 묻고 바르게 배우면 늦지 않아 눈이 밝아진다.',
    months: ['그릇 속에서 벗어나지 못하는 달', '가난한 집안을 조심하는 달', '말이 병들지 않게 조심하는 달', '배우되 탐내지 않는 달', '젊은 매를 조심하는 달', '죄인이 조심스레 묶이는 달', '가난한 벗을 조심하는 달', '병든 이를 조심히 돌보는 달', '웅덩이에 빠지지 않게 조심하는 달', '가난한 티를 조심하는 달', '죄를 벌어 조심하는 달', '평평한 곳에서 조심히 배우는 달'] },

  // ── 외괘 곤(地) ───────────────────────────────────────────────
  { upper: 8, lower: 1, grade: '대길', essence: '땅이 하늘에 화답하는 지천태(泰)의 격이라, 작은 것이 사라지고 큰 것이 오는 크게 평안한 해이다. 조화를 이루되 썩은 벼리를 조심하면 두루 길하다.',
    months: ['마소가 서로 끌어당겨 조화를 이루는 달', '물러날 곳을 찾아 조심하는 달', '평평하지 않은 것을 조심하는 달', '가볍게 웃지 않는 달', '귀인이 문밖에서 찾아오는 달', '귀인이 문 안에서 찾아오는 달', '성벽이 허물어지는 것을 조심하는 달', '큰 군(軍)을 다스리는 달', '평평한 곳에서 조심하는 달', '하늘이 조심스레 도와주는 달', '성벽이 허물어지지 않게 조심하는 달', '물러나며 복을 누리는 달'] },
  { upper: 8, lower: 2, grade: '대길', essence: '땅 위에 물이 넉넉히 얹혀 지택림(臨)의 격이라, 큰 그릇에 담을 복이 절로 차오르는 해이다. 두루 베풀되 허튼 말만 조심하면 늦기 전에 크게 이루어진다.',
    months: ['함께 임하되 크게 조심하는 달', '온화하게 조심하는 달', '모든 일이 눈앞에 다다르는 달', '지극히 조심하면 크게 조심할 일이 없는 달', '지혜로 조심하는 달', '큰 사람이 스스로 다스리는 달', '부지런히 조심하는 달', '곱게 나아가되 조심하는 달', '큰 그릇이 다시 조심스러워지는 달', '높은 곳에서 조심하는 달', '부지런히 조심스레 다스리는 달', '두루 조심하면 복이 오는 달'] },
  { upper: 8, lower: 3, grade: '주의', essence: '해가 땅 속으로 들어 지화명이(明夷)의 격이라, 밝음이 상하여 어두운 듯 지나가는 해이다. 크게 나서지 말고 속은 밝게 겉은 숨겨, 삼가는 마음으로 조용히 지키면 화를 면한다.',
    months: ['날개가 떨어지지 않게 조심하는 달', '왼쪽 허벅지를 조심하는 달', '남쪽 사냥을 조심하는 달', '왼쪽 갈비뼈를 조심하는 달', '기와가 훼방되지 않게 조심하는 달', '뼈가 상하지 않게 조심하는 달', '가죽이 눈에 띄지 않게 조심하는 달', '왼쪽 날개를 조심하는 달', '검은 뼈를 조심하는 달', '가죽이 하얗게 나오지 않게 조심하는 달', '기와가 조심스레 지켜지는 달', '검은 것이 조심스레 지나가는 달'] },
  { upper: 8, lower: 4, grade: '길', essence: '우레가 땅 속에서 울려 지뢰복(復)의 격이라, 돌아옴(復)의 기운이 다시 움트는 해이다. 나갔다 돌아오는 길이 무사하니, 며칠 만에 돌아와도 성황당에 이르는 데 지장이 없다.',
    months: ['멀리 돌아오지 않는 달', '조용히 돌아오는 달', '자주 되돌아오되 조심하는 달', '곱게 돌아오는 달', '큰 일로 되돌아오는 달', '미혹되어 돌아오는 것을 조심하는 달', '빈번히 되돌아오는 것을 조심하는 달', '조용히 돌아와 다스리는 달', '큰 그릇을 되돌려 조심하는 달', '번거로이 되돌아오는 것을 조심하는 달', '평평하게 돌아오는 달', '곱게 돌아와 복을 누리는 달'] },
  { upper: 8, lower: 5, grade: '대길', essence: '땅 위에 나무가 자라 지풍승(升)의 격이라, 올라감(升)의 기운이 순리대로 이루어지는 해이다. 큰 나무를 보는 데 보시(祀)가 있듯, 겸손이 더해지면 남쪽 길로 크게 길하다.',
    months: ['믿음이 커져 크게 모이는 달', '성실한 바침이 크게 길한 달', '빈 성읍에 나아가되 조심하는 달', '왕이 기우산(岐山)에 바치는 달', '지극한 정성이 이루어지는 달', '알맹이 없는 것을 조심하는 달', '높이 오르되 조심하는 달', '큰 성읍에 나아가는 달', '묶음을 두루 바치는 달', '높은 곳에 오르되 조심하는 달', '곱게 오르는 달', '크게 오르며 복을 누리는 달'] },
  { upper: 8, lower: 6, grade: '길', essence: '땅 위에 물이 흘러 지수사(師)의 격이라, 많은 무리를 휘어잡아 다스리는 해이다. 바른 사람의 명(命)을 받아 크게 나아가면 될 일이니, 큰 그릇은 조심스레 쌓아 올리라.',
    months: ['군율(軍律)로써 조심하는 달', '문 안에서 조심하는 달', '시체를 실어 나르지 않게 조심하는 달', '군중을 물러나게 하되 조심하는 달', '밭 가운데서 조심하는 달', '큰 그릇을 조심하는 달', '군중을 불러 모아 조심하는 달', '큰 그릇을 받쳐 조심하는 달', '작은 사람이 조심하는 달', '큰 사람이 조심하는 달', '땅 위에 나가되 조심하는 달', '큰 그릇이 조심스레 지켜지는 달'] },
];

// 내괘(중괘) 1~6은 간(艮)·곤(坤)을 쓰지 않는다 — 토정비결 48본괘 전통 구성 검증.
function assertLibraryIntegrity(): void {
  if (HEXAGRAM_LIBRARY.length !== 48) {
    throw new Error('토정비결 48본괘 문헌이 불완전합니다.');
  }
  const seen = new Set<string>();
  for (const entry of HEXAGRAM_LIBRARY) {
    const key = `${entry.upper}-${entry.lower}`;
    if (entry.lower > 6 || seen.has(key)) {
      throw new Error('토정비결 괘 문헌에 중복·범위 오류가 있습니다.');
    }
    seen.add(key);
  }
}
assertLibraryIntegrity();

const LIBRARY_BY_KEY: Map<string, HexagramEntry> = new Map(
  HEXAGRAM_LIBRARY.map((entry) => [`${entry.upper}-${entry.lower}`, entry]),
);

// ---------------------------------------------------------------------------
// 월별 서술 재료 (계절 정경 · 길흉 어조 · 실천 조언 · 동효 논조)
// ---------------------------------------------------------------------------

type Mood = '길' | '평' | '주의';

function moodOf(grade: TojeongLuckGrade): Mood {
  if (grade === '대길' || grade === '길') return '길';
  if (grade === '평') return '평';
  return '주의';
}

const MONTH_PHASE = ['맹춘', '중춘', '계춘', '맹하', '중하', '계하', '맹추', '중추', '계추', '맹동', '중동', '납월'];
const MONTH_SEASON: ('봄' | '여름' | '가을' | '겨울')[] = ['봄', '봄', '봄', '여름', '여름', '여름', '가을', '가을', '가을', '겨울', '겨울', '겨울'];

/** 계절 정경 4 × 어조 3 × 변주 4 — 괘마다 결정론적으로 다르게 배정 */
const SCENE_POOL: Record<Mood, Record<'봄' | '여름' | '가을' | '겨울', string[]>> = {
  길: {
    봄: ['새싹이 방울처럼 머리를 드는 길목이다.', '봄바람에 등 뒤가 후련해지는 계절이다.', '마른 가지에 봄눈이 절로 돋아나는 때다.', '봄꽃이 길가에 고이 피어나 문득 기쁨이 앞선다.'],
    여름: ['푸른 들판에 햇볕이 넉넉히 쏟아지는 계절이다.', '여름 나무가 짙어져 그늘마저 기운이 된다.', '장마가 지나고 큰 물이 밭을 적시는 때다.', '볕이 세도록 뜻도 뜨겁게 달아오르는 계절이다.'],
    가을: ['이삭이 누렇게 여문 들녘이 눈에 들어온다.', '하늘이 높아지고 길이 시원하게 열린다.', '가을 과일이 나뭇가지를 눕히는 풍년의 기척이다.', '서리 내리기 전에 거둘 것이 한 가득한 계절이다.'],
    겨울: ['까치가 두루 울며 반가운 소식을 부르는 계절이다.', '아랫목이 따뜻하게 데워지는 포근한 때다.', '눈 속에서도 보리는 푸르게 견디는 계절이다.', '가마니처럼 쌓인 복이 처마 밑에 걸린 겨울이다.'],
  },
  평: {
    봄: ['봄비를 기다리며 씨앗이 조용히 눈을 뜬다.', '얼었던 땅이 천천히 녹아내리는 계절이다.', '귀뚜라미 소리가 아직 어리게 울리는 봄이다.', '새 둥지를 트는 철새처럼 차근차근 준비되는 계절이다.'],
    여름: ['소나기가 지나가고 지붕이 마르기를 기다리는 계절이다.', '볕을 피해 그늘에서 숨을 고르는 때다.', '모래성이 무너지지 않게 조금씩 쌓는 계절이다.', '바람이 멎을 때까지 물을 고이는 인내의 여름이다.'],
    가을: ['떨어진 낙엽을 걷어 담는 소임의 계절이다.', '이슬이 서늘해지며 마음을 가다듬게 되는 가을이다.', '거두는 일과 비우는 일이 함께 있는 계절이다.', '가랑비에 옷 젖듯 일이 서서히 자리 잡는다.'],
    겨울: ['문짝을 닫아 따뜻함을 지키는 계절이다.', '장독대 아래 김이 느리게 오르는 겨울이다.', '감나무에 감이 남아 손이 닿기를 기다리는 계절이다.', '낮이 짧아 등불을 밝히며 하루를 마무리하는 겨울이다.'],
  },
  주의: {
    봄: ['꽃샘바람에 꽃눈이 얼어붙지 않게 살피는 계절이다.', '봄철 강물이 불어나며 여울이 깊어지는 때다.', '농사철보다 일찍 나가면 서리를 만나는 계절이다.', '우렁이 소리에 마음이 어수선해지지 않게 조심한다.'],
    여름: ['큰 가뭄에 우물이 마르지 않게 살피는 계절이다.', '불티가 바람에 날리지 않게 담을 여름이다.', '소나기에 두루 씻기지 않게 우산을 챙기는 계절이다.', '장마철 축축한 벽에 곰팡이 피지 않게 살피는 때다.'],
    가을: ['서리가 내리기 전에 옷깃을 여미는 계절이다.', '넘어진 이삭을 다시 일으켜 세우는 가을이다.', '맑은 날에도 갑자기 안개가 끼는 계절이다.', '낙엽 밑 미끄러운 돌을 밟지 않게 조심한다.'],
    겨울: ['큰 눈이 그치기를 기다리며 문을 지키는 계절이다.', '강이 얼었어도 밟지 않고 물러나는 겨울이다.', '굴뚝 연기가 꺾이지 않게 살피는 추운 계절이다.', '새벽 서리가 길 위의 발을 얼리지 않게 조심한다.'],
  },
};

/** 실천 조언: 어조 3 × 계절 4 */
const TIP_POOL: Record<Mood, Record<'봄' | '여름' | '가을' | '겨울', string>> = {
  길: {
    봄: '결심한 일은 미루지 말고 이 달에 첫 삽을 띠는 것이 좋다. 새 인연과 새 약속은 웃는 낯으로 맞아라.',
    여름: '큰 결정과 공개된 약속은 한낮의 볕 아래에서 이루는 것이 길하다. 도움을 청할 길을 두려워하지 마라.',
    가을: '한 해의 결실을 거두어 꾸러미로 묶어라. 부모와 어른을 먼저 찾아뵙는 일이 운을 더한다.',
    겨울: '벌어들인 것을 지키고 나누는 일에 힘써라. 겨울에 쌓은 성의가 내년의 첫 보람이 된다.',
  },
  평: {
    봄: '서두르기보다 차례를 지켜라. 작은 것부터 마련해 두면 큰 일도 무리 없이 이어진다.',
    여름: '지나친 더위처럼 마음이 급해지지 않게 하라. 쉼표를 찍는 날이 오히려 길을 가깝게 한다.',
    가을: '두루 살피고 필요한 것을 미리 갖추어라. 욕심을 조금 내려놓으면 마음이 넉넉해진다.',
    겨울: '무리한 일정보다 틀을 지키는 일이 이익이다. 몸을 따뜻이 하고 말은 아껴라.',
  },
  주의: {
    봄: '새 일의 시작은 서두르지 말고 준비에 몰두하라. 말다툼과 허튼 약속은 이 달에 삼가는 것이 상책이다.',
    여름: '문서와 돈거래는 두 번 읽고 도장을 찍어라. 더운 마음이 오갈 때는 답을 하루 미루는 지혜가 필요하다.',
    가을: '건강과 사고(事故)를 조심하는 달이니 몸을 아끼라. 판가름할 일은 조용한 가운데서 결정하라.',
    겨울: '큰 판단은 뒤로 미루고 주변을 돌보는 일에 힘써라. 곤경에 처한 이의 손을 잡으면 운이 다시 돈다.',
  },
};

/** 동효(下卦) 논조 — 하괘 1~3 */
const MOVING_LINE_META: Record<number, { label: string; annual: string }> = {
  1: { label: '초효(初爻) 동편', annual: '무릇 일의 뿌리와 첫 걸음에서 변화가 일어나는 괘라, 시작의 방향을 바로잡는 정성이 한 해의 판을 결정한다.' },
  2: { label: '중효(中爻) 동편', annual: '내면과 중심에서 기운이 움직이는 괘라, 겉으로 드러내기 전에 마음과 체면을 먼저 다듬으면 일이 순리대로 풀린다.' },
  3: { label: '삼효(三爻) 동편', annual: '경계와 전환점에서 움직이는 괘라, 절반쯤 왔을 때의 선택이 성패를 가르니 진퇴의 시기를 헤아려 신중히 결단하라.' },
};

const GRADE_CLOSER: Record<TojeongLuckGrade, string> = {
  대길: '한 해가 두루 밝게 열리는 대길의 괘이니, 마땅히 할 일을 미루지 말라.',
  길: '순리를 따르면 두루 길할 괘이니, 기울어진 마음만 바로 세우면 충분하다.',
  평: '큰 오름 없이도 큰 내리움 없는 평탄한 괘이니, 지키는 도리가 곧 복이 된다.',
  주의: '달별로 조심할 골목이 있는 괘이니, 분수를 지키고 서두르지 않는 것이 상책이다.',
  흉: '험로가 겹쳐 나타나는 괘이니, 큰 판은 미루고 몸과 마음을 지키는 일이 먼저다.',
};

// ---------------------------------------------------------------------------
// 계산 · 조합
// ---------------------------------------------------------------------------

function kstTimestamps(now: Date) {
  const kst = new Date(now.getTime() + 9 * 3600000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return { utc: now.toISOString(), kst: `${y}-${m}-${d} ${hh}:${mm} KST` };
}

function skippedResult(targetYear: number, note: string): TojeongResult {
  const { utc, kst } = kstTimestamps(new Date());
  return {
    status: 'skipped',
    note,
    engineVersion: TOJEONG_ENGINE_VERSION,
    calculatedAtUtc: utc,
    calculatedAtKst: kst,
    timestamp: Date.now(),
    targetYear,
    targetYearGanZhi: '',
    method: TOJEONG_METHOD,
    ageKorean: 0,
    lunarBirth: { year: 0, month: 0, day: 0, isLeapMonth: false },
    taeseCount: 0,
    wolgeonCount: 0,
    iljinCount: 0,
    birthMonthGanZhi: '',
    birthdayGanZhi: '',
    birthMonthLength: 0,
    upperGua: 0,
    middleGua: 0,
    lowerGua: 0,
    hexagramCode: '',
    hexagramName: '',
    upperTrigram: '',
    lowerTrigram: '',
    movingLineLabel: '',
    luckGrade: '평',
    annualSummary: '',
    monthlyFortunes: [],
  };
}

/**
 * 조선 정통 이지함 토정비결 작괘 산법으로 당해 연도(기본값: 현재 연도)의 괘문을 결정론적으로 산출한다.
 * 생년월일이 없거나 판별할 수 없으면 status 'skipped'로 명확히 알린다.
 */
export function calculateTojeong(params: { profile?: UserProfile | null; targetYear?: number; question?: string }): TojeongResult {
  const now = new Date();
  const targetYear = params.targetYear ?? now.getFullYear();
  const profile = params.profile ?? null;
  const birthdateStr = profile?.basic?.birthdate?.trim() || '';

  if (!profile || !birthdateStr) {
    return skippedResult(targetYear, '생년월일 미입력으로 토정비결 작괘를 생략했습니다.');
  }

  const resolved = resolveEffectiveSolarDate(birthdateStr, profile.basic?.lunarSolar, profile.basic?.isLeapMonth ?? false);

  // 음력 생년월일 확정: 음력 입력은 그대로, 양력 입력은 음력으로 환산.
  const lunarBirth = resolved.isLunar
    ? { ...resolved.originalDate, isLeapMonth: profile.basic?.isLeapMonth ?? false }
    : { ...convertSolarToLunar(resolved.solarDate.year, resolved.solarDate.month, resolved.solarDate.day), isLeapMonth: false };

  if (lunarBirth.month < 1 || lunarBirth.month > 12 || lunarBirth.day < 1 || lunarBirth.day > 30) {
    throw new RangeError('토정비결 작괘에 사용할 음력 생월·생일이 올바르지 않습니다.');
  }

  const ageKorean = targetYear - lunarBirth.year + 1;
  if (ageKorean < 1) {
    throw new RangeError('대상 연도가 음력 출생 연도보다 앞서 있어 세는나이를 산출할 수 없습니다.');
  }
  if (lunarBirth.year < 1900 || targetYear > 2100) {
    throw new RangeError('토정비결 작괘는 1900~2100년 범위의 역법에서 지원됩니다.');
  }

  // 1) 태세수: 당해 음력 세간(歲干)의 천간수 + 지지수
  const yearGanZhiIdx = lunarYearGanZhiIndex(targetYear);
  const yearGanIdx = yearGanZhiIdx % 10;
  const yearZhiIdx = yearGanZhiIdx % 12;
  const taeseCount = TAEGAE_STEM[yearGanIdx] + TAEGAE_BRANCH[yearZhiIdx];

  // 2) 월건수: 당해 연도 음력 생월의 월건(오호둔월법) 천간수 + 지지수
  const monthGanZhi = birthMonthGanZhi(targetYear, lunarBirth.month);
  const wolgeonCount = WOLGEON_STEM[monthGanZhi.ganIdx] + WOLGEON_BRANCH[monthGanZhi.zhiIdx];

  // 3) 달의 크기 · 일진수: 당해 연도 음력 생일(양력 환산 일자)의 일진 천간수 + 지지수
  const monthLength = lunarMonthLength(targetYear, lunarBirth.month);
  const anniversary = resolveAnniversarySolarDate(targetYear, lunarBirth.month, lunarBirth.day, monthLength);
  const dayGanZhiIdx = dayGanZhiIndex(anniversary.year, anniversary.month, anniversary.day);
  const dayGanIdx = dayGanZhiIdx % 10;
  const dayZhiIdx = dayGanZhiIdx % 12;
  const iljinCount = ILJIN_STEM[dayGanIdx] + ILJIN_BRANCH[dayZhiIdx];

  // 4) 상·중·하 3괘 작괘 (나머지 0이면 나눈 수 그대로)
  const upperGua = (ageKorean + taeseCount) % 8 || 8;
  const middleGua = (monthLength + wolgeonCount) % 6 || 6;
  const lowerGua = (lunarBirth.day + iljinCount) % 3 || 3;

  // 5) 괘문 코드와 본괘 문헌
  const hexagramCode = `${upperGua}${middleGua}${lowerGua}`;
  const entry = LIBRARY_BY_KEY.get(`${upperGua}-${middleGua}`);
  if (!entry) {
    throw new RangeError(`괘 코드 ${hexagramCode}에 해당하는 본괘 문헌이 없습니다.`);
  }
  const hexagramName = HEXAGRAM_NAMES[HEXAGRAM_INDEX_BY_UPPER_LOWER[upperGua - 1][middleGua - 1] - 1];
  const upperMeta = TRIGRAMS[upperGua];
  const lowerMeta = TRIGRAMS[middleGua];
  const moving = MOVING_LINE_META[lowerGua];

  const annualSummary = `${entry.essence} ${moving.annual} ${GRADE_CLOSER[entry.grade]}`;

  const mood = moodOf(entry.grade);
  const codeSeed = upperGua * 131 + middleGua * 37 + lowerGua * 17;

  const monthlyFortunes: TojeongMonthlyFortune[] = MONTH_PHASE.map((phase, i) => {
    const month = i + 1;
    const season = MONTH_SEASON[i];
    const scenes = SCENE_POOL[mood][season];
    const scene = scenes[(codeSeed + month * 29 + entry.upper * 7 + entry.lower * 13) % scenes.length];
    const fortune = `${month}월(${phase}) — ${entry.months[i]}. ${scene}`;
    const tip = TIP_POOL[mood][season];
    return { month, fortune, tip };
  });

  const trigramAnalysis = calculateTrigramAnalysis(
    upperGua,
    middleGua,
    lowerGua,
    hexagramName,
    entry.grade,
    monthlyFortunes,
  );

  const { utc, kst } = kstTimestamps(now);
  const q = (params.question || '').trim();
  const tojeongSynthesisMatrix = {
    dominantTension: `${hexagramName}(${hexagramCode}괘) · ${moving.label}`,
    alignmentState: `${trigramAnalysis.elementRelation} · 성운기(${trigramAnalysis.seasonalFlow.peakSeason})`,
    integratedAction: `${trigramAnalysis.hexagramEssenceAdvice}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    status: 'calculated',
    engineVersion: TOJEONG_ENGINE_VERSION,
    calculatedAtUtc: utc,
    calculatedAtKst: kst,
    timestamp: now.getTime(),
    targetYear,
    targetYearGanZhi: ganZhiOf(yearGanIdx, yearZhiIdx),
    method: TOJEONG_METHOD,
    ageKorean,
    lunarBirth: { year: lunarBirth.year, month: lunarBirth.month, day: lunarBirth.day, isLeapMonth: lunarBirth.isLeapMonth },
    taeseCount,
    wolgeonCount,
    iljinCount,
    birthMonthGanZhi: monthGanZhi.label,
    birthdayGanZhi: ganZhiOf(dayGanIdx, dayZhiIdx),
    birthMonthLength: monthLength,
    upperGua,
    middleGua,
    lowerGua,
    hexagramCode,
    hexagramName,
    upperTrigram: `${upperMeta.name}(${upperMeta.hanja})·${upperMeta.nature}`,
    lowerTrigram: `${lowerMeta.name}(${lowerMeta.hanja})·${lowerMeta.nature}`,
    movingLineLabel: moving.label,
    luckGrade: entry.grade,
    annualSummary,
    monthlyFortunes,
    trigramAnalysis,
    tojeongSynthesisMatrix,
  };
}

const TRIGRAM_FIVE_ELEMENT: Record<number, FiveElement> = {
  1: '금(金)', // 건(乾)
  2: '금(金)', // 태(兌)
  3: '화(火)', // 이(離)
  4: '목(木)', // 진(震)
  5: '목(木)', // 손(巽)
  6: '수(水)', // 감(坎)
  7: '토(土)', // 간(艮)
  8: '토(土)', // 곤(坤)
};

function calculateTrigramAnalysis(
  upperGua: number,
  middleGua: number,
  lowerGua: number,
  hexagramName: string,
  luckGrade: TojeongLuckGrade,
  monthlyFortunes: TojeongMonthlyFortune[],
): TojeongTrigramAnalysis {
  const upperElement = TRIGRAM_FIVE_ELEMENT[upperGua] ?? '금(金)';
  const lowerElement = TRIGRAM_FIVE_ELEMENT[middleGua] ?? '목(木)';

  const baseOf = (el: FiveElement): '목' | '화' | '토' | '금' | '수' => {
    if (el.startsWith('목')) return '목';
    if (el.startsWith('화')) return '화';
    if (el.startsWith('토')) return '토';
    if (el.startsWith('금')) return '금';
    return '수';
  };

  const uBase = baseOf(upperElement);
  const lBase = baseOf(lowerElement);

  const generates: Record<string, string> = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' };
  const controls: Record<string, string> = { 목: '토', 토: '수', 수: '화', 화: '금', 금: '목' };

  let elementRelation: TrigramElementRelation = '비화(比和)';
  let elementRelationDesc = '상하 괘의 오행이 서로 조화되어 평온함과 결속을 다지는 형세';
  let baseHarmony = 85;

  if (uBase === lBase) {
    elementRelation = '비화(比和)';
    elementRelationDesc = '내외 오행이 같은 기운으로 결집하여 묵묵한 내실을 다지기 좋은 상';
    baseHarmony = 82;
  } else if (generates[lBase] === uBase) {
    elementRelation = '상생(生入)';
    elementRelationDesc = '내괘가 외괘를 든든하게 생하여 안으로부터 추진력이 솟아나는 대길의 상';
    baseHarmony = 92;
  } else if (generates[uBase] === lBase) {
    elementRelation = '상생(生出)';
    elementRelationDesc = '외괘가 내괘를 온화하게 비추어 베풀수록 복이 돌아오는 은혜의 상';
    baseHarmony = 86;
  } else if (controls[lBase] === uBase) {
    elementRelation = '상극(克出)';
    elementRelationDesc = '내면의 역량으로 외부의 도전을 다스려 주도권을 쟁취하는 개척의 상';
    baseHarmony = 74;
  } else if (controls[uBase] === lBase) {
    elementRelation = '상극(克入)';
    elementRelationDesc = '외부 여건의 제약이 따르므로 신중한 방어와 수양이 요구되는 경계의 상';
    baseHarmony = 62;
  }

  const harmonyScore = Math.max(40, Math.min(98, baseHarmony + (lowerGua - 2) * 3));

  const gradeBaseScore: Record<TojeongLuckGrade, number> = {
    대길: 90,
    길: 80,
    평: 70,
    주의: 55,
    흉: 45,
  };
  const gBase = gradeBaseScore[luckGrade] ?? 70;

  const scoreMonth = (idx: number): number => {
    const f = monthlyFortunes[idx]?.fortune ?? '';
    let bonus = 0;
    if (/길|형통|복|귀인|화합|성취/.test(f)) bonus += 8;
    if (/주의|경계|구설|손재|불리/.test(f)) bonus -= 8;
    return Math.max(30, Math.min(95, gBase + bonus));
  };

  const springScore = Math.round((scoreMonth(0) + scoreMonth(1) + scoreMonth(2)) / 3);
  const summerScore = Math.round((scoreMonth(3) + scoreMonth(4) + scoreMonth(5)) / 3);
  const autumnScore = Math.round((scoreMonth(6) + scoreMonth(7) + scoreMonth(8)) / 3);
  const winterScore = Math.round((scoreMonth(9) + scoreMonth(10) + scoreMonth(11)) / 3);

  const seasons = [
    { label: '봄(1~3월)' as const, score: springScore },
    { label: '여름(4~6월)' as const, score: summerScore },
    { label: '가을(7~9월)' as const, score: autumnScore },
    { label: '겨울(10~12월)' as const, score: winterScore },
  ];
  seasons.sort((a, b) => b.score - a.score);
  const peakSeason = seasons[0].label;

  const hexagramEssenceAdvice = `[${hexagramName}] 대성괘의 핵심 기운은 '${elementRelationDesc}'에 있습니다. 성급한 확장을 경계하고 ${peakSeason}의 고조된 운기 타이밍에 주력 과업을 집중하십시오.`;

  return {
    upperElement,
    lowerElement,
    elementRelation,
    elementRelationDesc,
    harmonyScore,
    seasonalFlow: {
      springScore,
      summerScore,
      autumnScore,
      winterScore,
      peakSeason,
    },
    hexagramEssenceAdvice,
  };
}

/**
 * 토정비결 결과를 LLM 프롬프트에 주입하기 위한 정돈된 한국어 섹션으로 변환한다.
 * skipped 결과는 빈 문자열을 반환해 상위 포맷터가 섹션을 생략하도록 한다.
 */
export function formatTojeongPrompt(result: TojeongResult): string {
  if (result.status !== 'calculated') return '';

  const monthLines = result.monthlyFortunes
    .map((m) => `   • ${m.month}월: ${m.fortune}\n     → 실천 조언: ${m.tip}`)
    .join('\n');

  const matrixBlock = result.tojeongSynthesisMatrix
    ? `\n- 토정비결 교차 매트릭스: 핵심 긴장(${result.tojeongSynthesisMatrix.dominantTension}) · 조율 상태(${result.tojeongSynthesisMatrix.alignmentState}) · 통합 실천(${result.tojeongSynthesisMatrix.integratedAction})`
    : '';

  return `[🔮 토정비결(土亭秘訣) ${result.targetYear}년 ${result.hexagramCode}괘 실측 데이터 (Tojeong 144-Hexagram Core)]
======================================================================
엔진 버전: ${result.engineVersion} | 기준 시점: ${result.calculatedAtKst} | 대상 연도: ${result.targetYear}년 (${result.targetYearGanZhi}년)
작괘 근거: 세는나이 ${result.ageKorean}세 + 태세수 ${result.taeseCount} → 상괘 ${result.upperGua} | ${result.birthMonthGanZhi}월(${result.birthMonthLength === 30 ? '큰달 30일' : `작은달 ${result.birthMonthLength}일`}·월건수 ${result.wolgeonCount}) → 중괘 ${result.middleGua} | ${result.birthdayGanZhi}일(일진수 ${result.iljinCount}) → 하괘 ${result.lowerGua}
음력 생일 기준: ${result.lunarBirth.year}년 ${result.lunarBirth.month}월 ${result.lunarBirth.day}일${result.lunarBirth.isLeapMonth ? '(윤달·평달 계산)' : ''} | 본괘: ${result.hexagramName} (${result.upperTrigram} 상괘 / ${result.lowerTrigram} 내괘, ${result.movingLineLabel})
길흉 등급: [${result.luckGrade}]
======================================================================
[총론(總論)] ${result.annualSummary}

[12개월 괘상(月別 詳細)과 행동 전략]
${monthLines}${result.trigramAnalysis ? `\n======================================================================
[상·중괘 오행 생극제화 및 사계절 순환 심층 분석]
- 상괘 오행: ${result.trigramAnalysis.upperElement} vs 중괘 오행: ${result.trigramAnalysis.lowerElement} → [${result.trigramAnalysis.elementRelation}] (${result.trigramAnalysis.elementRelationDesc})
- 최고 성운기: ${result.trigramAnalysis.seasonalFlow.peakSeason}
- 핵심 개운 지침: ${result.trigramAnalysis.hexagramEssenceAdvice}` : ''}${matrixBlock}
======================================================================
[★ 루시 토정비결 상담 지침]:
- 위 괘문은 태세수·월건수·일진수 수리로 직접 작괘한 확정 데이터다. 괘 코드(${result.hexagramCode})와 다른 괘를 지어내지 마십시오.
- '토정비결 봐줘', '이달의 신수', '올해 운세' 질문에 총론과 월별 괘상을 근거로 4언3구의 정겨운 전통 문체를 살려 안내하되, 흉월은 두려움이 아니라 지키는 행동 전략으로 전달하십시오.`;
}
