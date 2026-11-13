/**
 * =========================================================================
 * LUCKEY 천상열차분야지도(天象列次分野之圖) 기반 28수(二十八宿) 일진 및
 * 6대 영역 택일(擇日) 결정론적 엔진
 * (28 Lunar Mansions Day-Star & Six-Domain Date-Selection Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    동일한 대상 날짜면 항상 동일한 28수 직성(直星)과 6대 영역 택일 스코어를 산출한다.
 *
 * 2. 천상열차분야지도(天象列次分野之圖):
 *    조선 세종 14년(1432) 제작·현종 10년(1669) 재진립된 국보 제228호 청량도(淸凉道)
 *    석각 성도(星圖). 천상의 별자리(천상열차)를 28수로 나누어 인간 세계의 분야(分野)에
 *    대응시킨 정통 동양 천문·분야(分野) 학의 총람판이다. 본 엔진은 이 판의
 *    28수 4방신(四方神) 포국 체계를 일진(日辰) 택일에 결정론적으로 구현한다.
 *
 * 3. 28수 4방신 포국 체계 (동방청룡 7수 → 북방현무 7수 → 서방백호 7수 → 남방주작 7수):
 *    - 동방 청룡(靑龍): 각(角)·항(亢)·저(氐)·방(房)·심(心)·미(尾)·기(箕)
 *    - 북방 현무(玄武): 두(斗)·우(牛)·여(女)·허(虛)·위(危)·실(室)·벽(壁)
 *    - 서방 백호(白虎): 규(奎)·루(婁)·위(胃)·묘(昴)·필(畢)·자(觜)·삼(參)
 *    - 남방 주작(朱雀): 정(井)·귀(鬼)·류(柳)·성(星)·장(張)·익(翼)·진(軫)
 *
 * 4. 정통 7원(七元) 4주기 직성 산법 (요일과 칠요가 완전 일치하는 산법):
 *    - 28수 직성은 정통 역서(貞享暦 이래)와 동일하게, 기원점인 貞享2년 정월 초하루
 *      (서기 1685-02-04, 일요일)가 성(星·星日馬)宿 직일로 정해진 뒤 28일 주기로
 *      영원히 연속 순환한다. 28 = 4주기 × 7요이므로 어떤 날의 직성 수의 칠요
 *      (일·월·화·수·목·금·토)가 항상 그 날의 요일과 완전히 일치하는 것이
 *      이 산법의 핵심 검증 조건이다 (7원 4주기).
 *    - 율리우스적일(JDN) 기준 결정론 공식: 직성 색인 = (JDN + 11) mod 28
 *      (JDN 2336529 = 1685-02-04 = 성宿(색인 24), (2336529 + 11) mod 28 = 24 검증,
 *       실측 예: 2026-11-01 묘宿 · 2026-11-02 필宿 · 2026-11-08 성宿)
 *    - 일진(日辰) 간지 공식: 천간 = (JDN + 9) mod 10, 지지 = (JDN + 1) mod 12
 *      (실측 예: 2000-01-01 무오(戊午)일 · 2014-12-19 갑자(甲子)일)
 *
 * 5. 칠요 배속과 오행:
 *    - 각 수의 칠요(七曜) 배속은 연금(演禽) 체계의 목금토일월화수 그대로이며
 *      (각목蛟·항금龍·저土貉·房日兎·心月狐·尾火虎·箕水豹 …), 요일과 칠요가
 *      7원 4주기로 완전히 맞물린다.
 *    - 오행(五行)은 칠요에 태양진화(太陽眞火)·태음진수(太陰眞水) 관행을 적용해
 *      일요(日曜) 수는 화(火), 월요(月曜) 수는 수(水)로, 나머지는 칠요와 같은
 *      오행으로 배정한다.
 *
 * 6. 6대 생활 영역 택일(擇日) 수리 판정:
 *    계약·협상 / 신규 런칭·개업 / 이동·출행·여행 / 재물·투자 /
 *    인연·만남·혼인 / 휴식·치유·내실 — 각 영역별 100점 만점 스코어를
 *    직성 길흉 등급 × 오행 상성 × 칠요 정성(正情) 가중의 결정론 수리로 산출하고,
 *    향후 28일(4주기 1순환) 내 최적 택일 후보일을 함께 제시한다.
 */

export const TWENTY_EIGHT_MANSIONS_ENGINE_VERSION = 'LUCKEY-TM-v1.0.0';

export const TWENTY_EIGHT_MANSIONS_METHOD =
  '천상열차분야지도(天象列次分野之圖) 기반 28수(二十八宿) 4방신 포국 정통 7원 4주기 직성 산법: 율리우스적일(JDN) 기준 직성 색인 (JDN+11) mod 28 결정론 산출(정통 기원점 1685-02-04 성宿 직일), 28일 주기 연속 회귀, 요일-칠요 완전 일치 검증, 일진 간지 병산, 직성 길흉 5등급(대길·길·평·흉·대흉) × 오행 상성 × 칠요 정성 가중 6대 영역(계약·협상/런칭·개업/출행·여행/재물·투자/인연·혼인/휴식·치유) 100점 만점 택일 스코어 및 28일 내 최적 후보일 산출';

export type MansionGrade = '대길(大吉)' | '길(吉)' | '평(平)' | '흉(凶)' | '대흉(大凶)';
export type MansionDirectionGroup = '동방청룡(東方靑龍)' | '북방현무(北方玄武)' | '서방백호(西方白虎)' | '남방주작(南方朱雀)';
export type SevenLuminary = '목(木)' | '금(金)' | '토(土)' | '일(日)' | '월(月)' | '화(火)' | '수(水)';
export type FiveElement = '목(木)' | '화(火)' | '토(土)' | '금(金)' | '수(水)';
export type SelectionDomain =
  | 'contract'
  | 'businessLaunch'
  | 'travel'
  | 'finance'
  | 'relationship'
  | 'healing';

export interface TwentyEightMansionsStar {
  index: number; // 0 ~ 27
  name: string; // 각, 항, 저 ...
  hanja: string; // 角, 亢 ...
  fullName: string; // 각목교(角木蛟)
  group: MansionDirectionGroup; // 4방신 소속
  element: FiveElement; // 오행
  luminary: SevenLuminary; // 칠요 배속
  animal: string; // 대표 상징 동물
  grade: MansionGrade; // 길흉 본의 등급
  gradeMeaning: string; // 길흉 본의 요해
}

export interface TwentyEightMansionsBestDate {
  date: string; // YYYY-MM-DD (KST)
  mansionName: string; // 직성 (예: 필(畢))
  score: number;
}

export interface TwentyEightMansionsDomainScore {
  domain: SelectionDomain;
  domainKo: string;
  domainEn: string;
  score: number; // 0 ~ 100
  grade: '대길' | '길' | '평' | '흉' | '대흉';
  reason: string; // 수리 판정 근거
  actionGuide: string; // 맞춤 개운 행동 가이드
  bestDates: TwentyEightMansionsBestDate[]; // 향후 28일 내 최적 택일 후보 (최대 3일)
}

export interface ThreeEnclosuresResonance {
  celestialCourt: '자미원(紫微垣·황궁본체)' | '태미원(太微垣·조정경륜)' | '천시원(天市垣·시장교역)';
  courtTheme: string;
  resonanceScore: number; // 40 ~ 98점
}

export interface CelestialBeastAlignment {
  beastName: string; // 청룡, 현무, 백호, 주작
  directionMatch: '순행 상합(順行相合)' | '방위 비화(方位比和)' | '기운 충극(氣運衝剋)' | '내실 조율(內實調律)';
  harmonyIndex: number; // 40 ~ 98점
  tacticalOrientationAdvice: string;
}

export interface QuadrantTransition {
  phaseName: string; // 청룡 발아기, 현무 심화기, 백호 결단기, 주작 결실기
  cycleDay: number; // 1 ~ 28일 순환 내 순번
  phaseEnergy: string;
  pacingGuide: string;
}

export interface TwentyEightMansionsResult {
  status: 'calculated';
  engineVersion: string;
  method: string;
  targetDate: string; // 한국 표준시(KST) 기준 대상 일자 (YYYY-MM-DD)
  julianDayNumber: number;
  dayGanZhi: string; // 당일 일진(日辰) 간지
  weekday: string; // 요일
  weekdayLuminary: string; // 당일 요일의 칠요
  luminaryWeekdayAligned: boolean; // 직성 칠요 ↔ 요일 일치 여부 (정통 7원 4주기 검증)
  mansion: TwentyEightMansionsStar; // 당일 직성(直星)
  domainScores: TwentyEightMansionsDomainScore[]; // 6대 영역 택일 스코어
  overallVerdict: string; // 종합 판정
  overallGuide: string; // 종합 개운 행동 가이드
  threeEnclosuresResonance?: ThreeEnclosuresResonance;
  celestialBeastAlignment?: CelestialBeastAlignment;
  quadrantTransition?: QuadrantTransition;
}

/** 28수 원시 정의 (색인 0=각(角) ~ 27=진(軫), 정통 회귀 순서) */
const MANSIONS_28: ReadonlyArray<{
  name: string;
  hanja: string;
  luminary: SevenLuminary; // 칠요 배속 (연금 체계 목금토일월화수)
  animalHanja: string; // 연금(演禽) 상징 신수 한자
  fullName: string; // 각목교(角木蛟) 식 정식 호칭
  group: MansionDirectionGroup;
  animalKo: string;
  grade: MansionGrade;
  gradeMeaning: string;
}> = [
  // ── 동방 청룡(東方靑龍) 7수 ──────────────────────────────
  { name: '각', hanja: '角', luminary: '목(木)', animalHanja: '蛟', fullName: '각목교(角木蛟)', group: '동방청룡(東方靑龍)', animalKo: '이무기', grade: '대길(大吉)', gradeMeaning: '만사 개시의 대길수. 취직·임명·혼인·개업·문서·토지에 최상이나 매장만은 피한다.' },
  { name: '항', hanja: '亢', luminary: '금(金)', animalHanja: '龍', fullName: '항금룡(亢金龍)', group: '동방청룡(東方靑龍)', animalKo: '용', grade: '길(吉)', gradeMeaning: '혼인·약혼·납채·재봉·물품 구입에 길하나 소송·다툼은 피하는 수.' },
  { name: '저', hanja: '氐', luminary: '토(土)', animalHanja: '貉', fullName: '저토락(氐土貉)', group: '동방청룡(東方靑龍)', animalKo: '오소리', grade: '평(平)', gradeMeaning: '길흉이 반반한 수. 매매·계약은 신중을 요하고 장례·종교 의식에는 무난하다.' },
  { name: '방', hanja: '房', luminary: '일(日)', animalHanja: '兎', fullName: '방일토(房日兎)', group: '동방청룡(東方靑龍)', animalKo: '토끼', grade: '대길(大吉)', gradeMeaning: '황도(黃道) 대길수. 혼인·가사·건축·구매·상면 무엇이든 길하다.' },
  { name: '심', hanja: '心', luminary: '월(月)', animalHanja: '狐', fullName: '심월호(心月狐)', group: '동방청룡(東方靑龍)', animalKo: '여우', grade: '대길(大吉)', gradeMeaning: '혼인·이사·영업에 대길하되, 제사와 장사에는 삼가는 수.' },
  { name: '미', hanja: '尾', luminary: '화(火)', animalHanja: '虎', fullName: '미화호(尾火虎)', group: '동방청룡(東方靑龍)', animalKo: '호랑이', grade: '길(吉)', gradeMeaning: '혼인·입거(入居)·축조에 길하고 매장·이장은 피하는 수.' },
  { name: '기', hanja: '箕', luminary: '수(水)', animalHanja: '豹', fullName: '기수표(箕水豹)', group: '동방청룡(東方靑龍)', animalKo: '표범', grade: '길(吉)', gradeMeaning: '수족(出入)·창고·가옥 일에 길하고 초상·매장은 삼가는 수.' },
  // ── 북방 현무(北方玄武) 7수 ──────────────────────────────
  { name: '두', hanja: '斗', luminary: '목(木)', animalHanja: '獬', fullName: '두목해(斗木獬)', group: '북방현무(北方玄武)', animalKo: '해태', grade: '길(吉)', gradeMeaning: '매가(買家)·취재(取材)·가옥 축조·계약에 길한 수. 여행 출발에도 무난.' },
  { name: '우', hanja: '牛', luminary: '금(金)', animalHanja: '牛', fullName: '우금우(牛金牛)', group: '북방현무(北方玄武)', animalKo: '소', grade: '평(平)', gradeMeaning: '평범한 수. 대사를 거론하기보다는 중소 거래·일상 업무가 무난.' },
  { name: '여', hanja: '女', luminary: '토(土)', animalHanja: '蝠', fullName: '여토복(女土蝠)', group: '북방현무(北方玄武)', animalKo: '박쥐', grade: '길(吉)', gradeMeaning: '학습·성호(城濠)·제사에는 길하나 혼인 등 대례는 삼가는 수.' },
  { name: '허', hanja: '虛', luminary: '일(日)', animalHanja: '鼠', fullName: '허일서(虛日鼠)', group: '북방현무(北方玄武)', animalKo: '쥐', grade: '흉(凶)', gradeMeaning: '허허한 수. 사업 개시·계약이 공허로 돌하기 쉬우니 내실 점검이 도리.' },
  { name: '위', hanja: '危', luminary: '월(月)', animalHanja: '燕', fullName: '위월연(危月燕)', group: '북방현무(北方玄武)', animalKo: '제비', grade: '흉(凶)', gradeMeaning: '위태로운 수. 등산·행수(行舟)·출행·계약에 부정하다.' },
  { name: '실', hanja: '室', luminary: '화(火)', animalHanja: '豬', fullName: '실화저(室火豬)', group: '북방현무(北方玄武)', animalKo: '돼지', grade: '길(吉)', gradeMeaning: '가옥 건조·이사·혼인·봉안에 크게 길한 수.' },
  { name: '벽', hanja: '壁', luminary: '수(水)', animalHanja: '貐', fullName: '벽수유(壁水貐)', group: '북방현무(北方玄武)', animalKo: '물소', grade: '길(吉)', gradeMeaning: '혼인·판매·가옥·제사에 길한 수. 문서·계약 성립도 순조.' },
  // ── 서방 백호(西方白虎) 7수 ──────────────────────────────
  { name: '규', hanja: '奎', luminary: '목(木)', animalHanja: '狼', fullName: '규목랑(奎木狼)', group: '서방백호(西方白虎)', animalKo: '이리', grade: '평(平)', gradeMeaning: '건물·수목 조성에는 무방하나 장사·출행은 점쳐야 하는 수.' },
  { name: '루', hanja: '婁', luminary: '금(金)', animalHanja: '狗', fullName: '루금구(婁金狗)', group: '서방백호(西方白虎)', animalKo: '개', grade: '길(吉)', gradeMeaning: '혼인·가옥·입관(入棺)에 길하나 소송은 피하는 수.' },
  { name: '위', hanja: '胃', luminary: '토(土)', animalHanja: '雉', fullName: '위토치(胃土雉)', group: '서방백호(西方白虎)', animalKo: '꿩', grade: '길(吉)', gradeMeaning: '가옥·매장·혼인에 무난한 수로, 공사(公事)에도 순조롭다.' },
  { name: '묘', hanja: '昴', luminary: '일(日)', animalHanja: '雞', fullName: '묘일계(昴日鷄)', group: '서방백호(西方白虎)', animalKo: '닭', grade: '흉(凶)', gradeMeaning: '백호(白虎)의 흉수. 조옥(造屋)·혼인·출행이 벌(罰)에 걸린다.' },
  { name: '필', hanja: '畢', luminary: '월(月)', animalHanja: '烏', fullName: '필월오(畢月烏)', group: '서방백호(西方白虎)', animalKo: '까마귀', grade: '대길(大吉)', gradeMeaning: '은문(陰門) 대길수. 혼인·출행·매매·봉헌에 크게 길하다.' },
  { name: '자', hanja: '觜', luminary: '화(火)', animalHanja: '猴', fullName: '자화후(觜火猴)', group: '서방백호(西方白虎)', animalKo: '원숭이', grade: '대흉(大凶)', gradeMeaning: '백호의 역화(逆火) 수. 대사(大事)를 벌이면 반드시 화근이 된다.' },
  { name: '삼', hanja: '參', luminary: '수(水)', animalHanja: '猿', fullName: '삼수원(參水猿)', group: '서방백호(西方白虎)', animalKo: '긴원숭이', grade: '길(吉)', gradeMeaning: '혼인·취직·조옥·양축에 길하되, 고혼 제사는 삼가는 수.' },
  // ── 남방 주작(南方朱雀) 7수 ──────────────────────────────
  { name: '정', hanja: '井', luminary: '목(木)', animalHanja: '犴', fullName: '정목안(井木犴)', group: '남방주작(南方朱雀)', animalKo: '들개', grade: '대길(大吉)', gradeMeaning: '황도 대길수. 혼인·성호·기초(起基)·우물 파기에 크게 길하다.' },
  { name: '귀', hanja: '鬼', luminary: '금(金)', animalHanja: '羊', fullName: '귀금양(鬼金羊)', group: '남방주작(南方朱雀)', animalKo: '양', grade: '대흉(大凶)', gradeMeaning: '주작의 흔(恨) 수. 신사·불당 조영 외의 대사는 화를 부른다.' },
  { name: '류', hanja: '柳', luminary: '토(土)', animalHanja: '獐', fullName: '류토장(柳土獐)', group: '남방주작(南方朱雀)', animalKo: '노루', grade: '흉(凶)', gradeMeaning: '출행·소송·큰 거래에 부정하고, 가옥·장례도 삼가는 수.' },
  { name: '성', hanja: '星', luminary: '일(日)', animalHanja: '馬', fullName: '성일마(星日馬)', group: '남방주작(南方朱雀)', animalKo: '말', grade: '평(平)', gradeMeaning: '다혈질의 수. 혼인·매매는 부정하고 제사·의료 일만 무난.' },
  { name: '장', hanja: '張', luminary: '월(月)', animalHanja: '鹿', fullName: '장월록(張月鹿)', group: '남방주작(南方朱雀)', animalKo: '사슴', grade: '대길(大吉)', gradeMeaning: '혼인·가옥·직위·상업에 크게 길하고 백사(百事)가 왕성해지는 수.' },
  { name: '익', hanja: '翼', luminary: '화(火)', animalHanja: '蛇', fullName: '익화사(翼火蛇)', group: '남방주작(南方朱雀)', animalKo: '뱀', grade: '흉(凶)', gradeMeaning: '기미(飢荒)·질병의 수. 대연(大宴)·매매·출행을 삼가야 한다.' },
  { name: '진', hanja: '軫', luminary: '수(水)', animalHanja: '蚓', fullName: '진수인(軫水蚓)', group: '남방주작(南方朱雀)', animalKo: '지렁이', grade: '길(吉)', gradeMeaning: '하수(下水)·질병 퇴치에 길하고, 혼인·구매파매도 무난한 수.' },
];

const GAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const ZHI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const WEEKDAY_LUMINARIES: ReadonlyArray<SevenLuminary> = ['일(日)', '월(月)', '화(火)', '수(水)', '목(木)', '금(金)', '토(土)'];

/** 칠요 → 오행 매핑 (일요=태양진화, 월요=태음진수, 나머지는 칠요와 동일) */
const LUMINARY_TO_ELEMENT: Record<SevenLuminary, FiveElement> = {
  '목(木)': '목(木)',
  '화(火)': '화(火)',
  '토(土)': '토(土)',
  '금(金)': '금(金)',
  '수(水)': '수(水)',
  '일(日)': '화(火)',
  '월(月)': '수(水)',
};

/** 직성 길흉 등급별 기본 점수 (100점 만점 환산 기준선) */
const GRADE_BASE_SCORE: Record<MansionGrade, number> = {
  '대길(大吉)': 88,
  '길(吉)': 75,
  '평(平)': 60,
  '흉(凶)': 38,
  '대흉(大凶)': 22,
};

/** 6대 생활 영역별 상수 정의 */
const DOMAINS: ReadonlyArray<{
  domain: SelectionDomain;
  domainKo: string;
  domainEn: string;
  favorableElement: FiveElement;
  luminaryBonus: Record<SevenLuminary, number>;
}> = [
  {
    domain: 'contract', domainKo: '계약·협상', domainEn: 'Contract/Negotiation', favorableElement: '금(金)',
    // 문서 결속은 금기(金氣)를 숭상하고, 일·월요(曜)의 명료함과 토요(曜)의 무게가 계약을 굳게 한다
    luminaryBonus: { '목(木)': 2, '금(金)': 5, '토(土)': 3, '일(日)': 4, '월(月)': 3, '화(火)': -2, '수(水)': -4 },
  },
  {
    domain: 'businessLaunch', domainKo: '신규 런칭·개업', domainEn: 'Business Launch', favorableElement: '목(木)',
    // 발아·성장은 목기(木氣)를 숭상하고, 일요(曜)의 개양(開陽)과 목요(曜)의 발동이 개업에 어울린다
    luminaryBonus: { '목(木)': 5, '금(金)': 2, '토(土)': 1, '일(日)': 5, '월(月)': 2, '화(火)': 3, '수(水)': -2 },
  },
  {
    domain: 'travel', domainKo: '이동·출행·여행', domainEn: 'Travel/Departure', favorableElement: '수(水)',
    // 유통·이동은 수기(水氣)를 숭상하고, 목요(曜)의 순풍과 일요(曜)의 명랑이 출행을 돕는다
    luminaryBonus: { '목(木)': 3, '금(金)': -2, '토(土)': -3, '일(日)': 3, '월(月)': 1, '화(火)': 1, '수(水)': 5 },
  },
  {
    domain: 'finance', domainKo: '재물·투자', domainEn: 'Finance/Investment', favorableElement: '금(金)',
    // 재물은 금기(金氣) 그 자체이며, 월요(曜)의 축적과 토요(曜)의 저장이 부를 지킨다
    luminaryBonus: { '목(木)': 1, '금(金)': 6, '토(土)': 4, '일(日)': 1, '월(月)': 4, '화(火)': -4, '수(水)': 1 },
  },
  {
    domain: 'relationship', domainKo: '인연·만남·혼인', domainEn: 'Relationship/Marriage', favorableElement: '화(火)',
    // 인연은 화기(火氣)의 온기에서 싹트며, 일·월 이요(二曜)가 혼인의 본요(本曜)다
    luminaryBonus: { '목(木)': 2, '금(金)': -3, '토(土)': 1, '일(日)': 6, '월(月)': 5, '화(火)': 4, '수(水)': -2 },
  },
  {
    domain: 'healing', domainKo: '휴식·치유·내실', domainEn: 'Healing/Rest', favorableElement: '토(土)',
    // 안정·내실은 토기(土氣)의 후토(厚土)에서 완성되고, 월요(曜)의 고요가 치유를 돕는다
    luminaryBonus: { '목(木)': -1, '금(金)': 1, '토(土)': 5, '일(日)': -1, '월(月)': 3, '화(火)': 2, '수(水)': 2 },
  },
];

/** 오행 상생·상극 수리 가중 */
function elementRelationScore(element: FiveElement, favorable: FiveElement): number {
  const ELEMS: FiveElement[] = ['목(木)', '화(火)', '토(土)', '금(金)', '수(水)'];
  const eIdx = ELEMS.indexOf(element);
  const fIdx = ELEMS.indexOf(favorable);
  if (eIdx === fIdx) return 8; // 비왕(比旺): 같은 오행 — 기운이 가장 왕성
  const generates = (a: number, b: number) => (a + 1) % 5 === b; // 목생화, 화생토, 토생금, 금생수, 수생목
  if (generates(fIdx, eIdx)) return 5; // 택일 용신 오행을 생해 주는 오행 — 조후(調候) 상
  if (generates(eIdx, fIdx)) return 2; // 기운을 소진하여 생해 주는 오행 — 약한 조력
  const controls = (a: number, b: number) => (a + 2) % 5 === b; // 목극토, 토극수, 수극화, 화극금, 금극목
  if (controls(fIdx, eIdx)) return -8; // 용신이 극을 당함 — 최부정(最不利)
  if (controls(eIdx, fIdx)) return -6; // 용신을 극함 — 부정(不利)
  return 0;
}

/** 영역별 택일 등급 산정 */
function scoreToGrade(score: number): TwentyEightMansionsDomainScore['grade'] {
  if (score >= 85) return '대길';
  if (score >= 70) return '길';
  if (score >= 55) return '평';
  if (score >= 40) return '흉';
  return '대흉';
}

/** 그레고리력 → 율리우스적일(JDN) 정수 산출 */
function toJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/** KST 기준 날짜 구성요소 산출 */
function kstDateParts(target: Date): { year: number; month: number; day: number } {
  const kst = new Date(target.getTime() + 9 * 3600000);
  return {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
  };
}

/** 한 날의 28수 결정론 산출 (내부 헬퍼) */
function mansionOfDay(jdn: number): { index: number; raw: (typeof MANSIONS_28)[number] } {
  const index = ((jdn + 11) % 28 + 28) % 28;
  return { index, raw: MANSIONS_28[index] };
}

/** 영역별 맞춤 개운 행동 가이드 (직성 등급·오행·4방신에 따라 결정론 도출) */
function buildActionGuide(domainKo: string, star: TwentyEightMansionsStar, score: number): string {
  const groupTrait: Record<MansionDirectionGroup, string> = {
    '동방청룡(東方靑龍)': '청룡의 승화(昇華) 기운이 동쪽에서 동틀 듯 참신한 시작을 돕습니다',
    '북방현무(北方玄武)': '현무의 현수(玄水) 기운이 깊은 저장과 배치(配置)의 지혜를 돕습니다',
    '서방백호(西方白虎)': '백호의 예기(銳氣) 기운이 단결과 절제의 결단력을 돕습니다',
    '남방주작(南方朱雀)': '주작의 예열(禮熱) 기운이 명문(名文)과 화려한 알림의 힘을 돕습니다',
  };
  const gradeAdvice =
    score >= 70
      ? `이날 ${star.name}(${star.hanja})수의 ${star.grade} 기운을 등에 업고 ${domainKo}의 결정을 집행하십시오. ${star.name}수의 상징 신수인 ${star.animal}의 기상처럼 과감하되 본의를 지키면 큰 길을 이룹니다.`
      : score >= 55
        ? `이날 ${star.name}(${star.hanja})수는 ${star.grade} 등급이라 대사(大事)의 확정보다는 ${domainKo}의 초안 작성, 선행 협의, 조건 윤곽 잡기에 힘을 쏟는 것이 수리상 유리합니다.`
        : `이날 ${star.name}(${star.hanja})수는 ${star.grade} 등급이므로 ${domainKo}의 서명·발표·확정은 하루 미루는 것이 도리입니다. 대신 위험 검토, 계약서 조항 재확인, 상대의 마음 밑그림 그리기에 쓰십시오.`;
  const direction = star.group.includes('동') ? '동(東)' : star.group.includes('북') ? '북(北)' : star.group.includes('서') ? '서(西)' : '남(南)';
  return `${gradeAdvice} ${groupTrait[star.group]} — 이날 개운 방위는 ${direction}쪽이며, ${star.element.replace(/\(.+\)/, '')}기(氣)를 보강하는 색(옷·소지품)을 곁들이면 길이 배가됩니다.`;
}

/** 한 영역의 택일 스코어 결정론 산출 (내부 헬퍼) */
function domainScoreOf(domainDef: (typeof DOMAINS)[number], raw: (typeof MANSIONS_28)[number]): number {
  const base = GRADE_BASE_SCORE[raw.grade];
  const element = LUMINARY_TO_ELEMENT[raw.luminary];
  const elemScore = elementRelationScore(element, domainDef.favorableElement);
  const lumBonus = domainDef.luminaryBonus[raw.luminary];
  return Math.min(98, Math.max(5, base + elemScore + lumBonus));
}

/**
 * 28수 일진 결정론적 계산 함수
 * (동일한 대상 날짜 → 항상 100% 동일한 직성·스코어 산출)
 */
export function calculateTwentyEightMansions(params: { targetDate?: Date }): TwentyEightMansionsResult {
  const target = params.targetDate || new Date();
  const { year: y, month: m, day: d } = kstDateParts(target);

  // 1. 율리우스적일(JDN) 및 일진(日辰) 간지 병산
  const jdn = toJDN(y, m, d);
  const ganIdx = ((jdn + 9) % 10 + 10) % 10;
  const zhiIdx = ((jdn + 1) % 12 + 12) % 12;
  const dayGanZhi = `${GAN[ganIdx]}${ZHI[zhiIdx]}`;

  // 2. 정통 7원 4주기 직성 산출: (JDN + 11) mod 28
  const { index: mansionIndex, raw } = mansionOfDay(jdn);

  // JDN mod 7: 0=월요일 … 6=일요일 → 요일 칠요 대조
  const weekdayIdx = ((jdn + 1) % 7 + 7) % 7; // 0=일요일
  const weekday = WEEKDAYS[weekdayIdx];
  const weekdayLuminary = WEEKDAY_LUMINARIES[weekdayIdx];

  const mansion: TwentyEightMansionsStar = {
    index: mansionIndex,
    name: raw.name,
    hanja: raw.hanja,
    fullName: raw.fullName,
    group: raw.group,
    element: LUMINARY_TO_ELEMENT[raw.luminary],
    luminary: raw.luminary,
    animal: raw.animalKo,
    grade: raw.grade,
    gradeMeaning: raw.gradeMeaning,
  };

  const luminaryWeekdayAligned = mansion.luminary === weekdayLuminary;

  // 3. 6대 영역 택일 스코어 및 향후 28일 최적 후보일 산출
  const domainScores: TwentyEightMansionsDomainScore[] = DOMAINS.map((domainDef) => {
    const score = domainScoreOf(domainDef, raw);
    const grade = scoreToGrade(score);
    const element = LUMINARY_TO_ELEMENT[raw.luminary];
    const elemScore = elementRelationScore(element, domainDef.favorableElement);
    const lumBonus = domainDef.luminaryBonus[raw.luminary];

    const reason = `직성 ${raw.name}(${raw.hanja})수 ${raw.grade} 기준점 ${GRADE_BASE_SCORE[raw.grade]}점에, 택일 용신 오행 ${domainDef.favorableElement} 대비 직성 오행 ${element}의 ${elemScore >= 0 ? '상생·비왕 가중' : '상극 감점'} ${elemScore >= 0 ? '+' : ''}${elemScore}점, 칠요 ${raw.luminary}의 ${domainDef.domainKo} 정성 가중 ${lumBonus >= 0 ? '+' : ''}${lumBonus}점을 합산한 결정론 수리입니다.`;

    // 향후 28일(직성 1순환) 내 최적 택일 후보 3일 — 동점 시 이른 날짜 우선
    const candidates: TwentyEightMansionsBestDate[] = [];
    for (let offset = 1; offset <= 28; offset++) {
      const candParts = kstDateParts(new Date(target.getTime() + offset * 86400000));
      const cjdn = toJDN(candParts.year, candParts.month, candParts.day);
      const candRaw = mansionOfDay(cjdn).raw;
      candidates.push({
        date: `${candParts.year}-${String(candParts.month).padStart(2, '0')}-${String(candParts.day).padStart(2, '0')}`,
        mansionName: `${candRaw.name}(${candRaw.hanja})`,
        score: domainScoreOf(domainDef, candRaw),
      });
    }
    candidates.sort((x, y) => (y.score - x.score) || (x.date < y.date ? -1 : 1));
    const bestDates = candidates.slice(0, 3);

    return {
      domain: domainDef.domain,
      domainKo: domainDef.domainKo,
      domainEn: domainDef.domainEn,
      score,
      grade,
      reason,
      actionGuide: buildActionGuide(domainDef.domainKo, mansion, score),
      bestDates,
    };
  });

  // 4. 천문 3원(三垣) 공명 산출
  const ENCLOSURES: Array<'자미원(紫微垣·황궁본체)' | '태미원(太微垣·조정경륜)' | '천시원(天市垣·시장교역)'> = [
    '자미원(紫微垣·황궁본체)',
    '태미원(太微垣·조정경륜)',
    '천시원(天市垣·시장교역)',
  ];
  const enclosureIdx = mansionIndex % 3;
  const celestialCourt = ENCLOSURES[enclosureIdx];
  const courtThemes: Record<typeof celestialCourt, string> = {
    '자미원(紫微垣·황궁본체)': '북극성과 황궁을 호위하는 중심성으로, 내면의 주권과 중심 가치를 확립하는 데 최상의 기운입니다.',
    '태미원(太微垣·조정경륜)': '조정 대신들이 경륜을 펼치는 자리로, 협상·기획·리더십과 공적 협력을 추진하기에 길합니다.',
    '천시원(天市垣·시장교역)': '만백성이 모여 재화와 지혜를 교환하는 시장의 자리로, 상거래·투자·홍보 및 활발한 교류에 길합니다.',
  };
  const threeEnclosuresResonance: ThreeEnclosuresResonance = {
    celestialCourt,
    courtTheme: courtThemes[celestialCourt],
    resonanceScore: Math.min(98, Math.max(45, 62 + ((jdn * 7 + mansionIndex * 11) % 35))),
  };

  // 5. 4방신 신수 진법 및 일진 방위 조화도
  const beastName = mansion.group.includes('동') ? '청룡(靑龍)' : mansion.group.includes('북') ? '현무(玄武)' : mansion.group.includes('서') ? '백호(白虎)' : '주작(朱雀)';
  let directionMatch: '순행 상합(順行相合)' | '방위 비화(方位比和)' | '기운 충극(氣運衝剋)' | '내실 조율(內實調律)';
  let harmonyIndex: number;
  const isEastZhi = [2, 3, 4].includes(zhiIdx);
  const isSouthZhi = [5, 6, 7].includes(zhiIdx);
  const isWestZhi = [8, 9, 10].includes(zhiIdx);
  const isNorthZhi = [11, 0, 1].includes(zhiIdx);

  if (
    (beastName === '청룡(靑龍)' && isEastZhi) ||
    (beastName === '주작(朱雀)' && isSouthZhi) ||
    (beastName === '백호(白虎)' && isWestZhi) ||
    (beastName === '현무(玄武)' && isNorthZhi)
  ) {
    directionMatch = '방위 비화(方位比和)';
    harmonyIndex = 92;
  } else if (
    (beastName === '청룡(靑龍)' && isSouthZhi) ||
    (beastName === '주작(朱雀)' && isWestZhi) ||
    (beastName === '백호(白虎)' && isNorthZhi) ||
    (beastName === '현무(玄武)' && isEastZhi)
  ) {
    directionMatch = '순행 상합(順行相合)';
    harmonyIndex = 88;
  } else if (
    (beastName === '청룡(靑龍)' && isWestZhi) ||
    (beastName === '주작(朱雀)' && isNorthZhi) ||
    (beastName === '백호(白虎)' && isEastZhi) ||
    (beastName === '현무(玄武)' && isSouthZhi)
  ) {
    directionMatch = '기운 충극(氣運衝剋)';
    harmonyIndex = 55;
  } else {
    directionMatch = '내실 조율(內實調律)';
    harmonyIndex = 74;
  }

  const celestialBeastAlignment: CelestialBeastAlignment = {
    beastName,
    directionMatch,
    harmonyIndex,
    tacticalOrientationAdvice: `당일 직성 신수 ${beastName}와 일진 간지 지지(${ZHI[zhiIdx]})가 ${directionMatch}의 역학을 이루어 기운 조화도 ${harmonyIndex}점을 형성합니다.`,
  };

  // 6. 28일 순환 4대 국면(청룡·현무·백호·주작 7수 윈도우)
  const cycleDay = mansionIndex + 1;
  let phaseName = '동방청룡 발아도약기';
  let phaseEnergy = '목(木)기 발아 — 창의적 기획과 신규 프로젝트 착수';
  let pacingGuide = '기초를 다지고 새로운 제안을 세상에 내어놓기에 적합합니다.';

  if (cycleDay >= 8 && cycleDay <= 14) {
    phaseName = '북방현무 심화축적기';
    phaseEnergy = '수(水)기 저장 — 지혜 축적과 시스템 보안·내실 다지기';
    pacingGuide = '외부 확장보다 데이터 정비와 계약 조항 점검에 집중하십시오.';
  } else if (cycleDay >= 15 && cycleDay <= 21) {
    phaseName = '서방백호 결단수렴기';
    phaseEnergy = '금(金)기 결단 — 불필요한 군더더기 정리와 과감한 구조조정';
    pacingGuide = '명확한 기준을 세우고 타협 없는 결단으로 실속을 취하십시오.';
  } else if (cycleDay >= 22) {
    phaseName = '남방주작 성취만개기';
    phaseEnergy = '화(火)기 결실 — 대외 홍보와 결과물 발표, 교류 성취';
    pacingGuide = '성과를 알리고 네트워크를 통해 협력의 결실을 수확하십시오.';
  }

  const quadrantTransition: QuadrantTransition = {
    phaseName,
    cycleDay,
    phaseEnergy,
    pacingGuide,
  };

  // 7. 종합 판정 및 가이드
  const bestDomain = domainScores.reduce((a, b) => (b.score > a.score ? b : a));
  const worstDomain = domainScores.reduce((a, b) => (b.score < a.score ? b : a));
  const targetDateString = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const overallVerdict = `금일(${targetDateString}, ${dayGanZhi}일 · ${weekday}) 직성은 ${mansion.group}의 ${mansion.name}(${mansion.hanja})수 — ${mansion.grade}입니다. 칠요 ${mansion.luminary}가 요일(${weekdayLuminary})과 ${luminaryWeekdayAligned ? '완전히 일치' : '불일치'}하는 정통 7원 4주기 직성입니다. 가장 유리한 영역은 ${bestDomain.domainKo}(${bestDomain.score}점), 가장 삼가야 할 영역은 ${worstDomain.domainKo}(${worstDomain.score}점)입니다.`;
  const overallGuide = `${mansion.name}수 상징 신수 ${mansion.animal}의 기상을 따라 ${mansion.gradeMeaning} 종합 가이드: ${bestDomain.domainKo}을(를) 금일 집행하거나 ${bestDomain.bestDates[0].date}(${bestDomain.bestDates[0].mansionName}수, ${bestDomain.bestDates[0].score}점)로 택일하고, ${worstDomain.domainKo}의 확정적 행위는 ${worstDomain.bestDates[0].date}(${worstDomain.bestDates[0].mansionName}수, ${worstDomain.bestDates[0].score}점) 이후로 미루십시오.`;

  return {
    status: 'calculated',
    engineVersion: TWENTY_EIGHT_MANSIONS_ENGINE_VERSION,
    method: TWENTY_EIGHT_MANSIONS_METHOD,
    targetDate: targetDateString,
    julianDayNumber: jdn,
    dayGanZhi,
    weekday,
    weekdayLuminary,
    luminaryWeekdayAligned,
    mansion,
    domainScores,
    overallVerdict,
    overallGuide,
    threeEnclosuresResonance,
    celestialBeastAlignment,
    quadrantTransition,
  };
}

/**
 * 프롬프트 주입용 28수 택일 결과 포맷터
 */
export function formatTwentyEightMansionsPrompt(result: TwentyEightMansionsResult): string {
  if (result.status !== 'calculated') {
    return '';
  }

  const domainLines = result.domainScores
    .map(
      (s) =>
        `  * ${s.domainKo}(${s.domainEn}): ${s.score}점 [${s.grade}등급] — 최적 후보일 ${s.bestDates.map((b) => `${b.date} ${b.mansionName}수(${b.score}점)`).join(', ')}\n    · 수리 근거: ${s.reason}\n    · 개운 가이드: ${s.actionGuide}`,
    )
    .join('\n');

  const enclosureBlock = result.threeEnclosuresResonance
    ? `\n- 천문 3원(三垣) 공명: ${result.threeEnclosuresResonance.celestialCourt} (공명도 ${result.threeEnclosuresResonance.resonanceScore}점)\n  * 3원 테마: ${result.threeEnclosuresResonance.courtTheme}`
    : '';
  const beastBlock = result.celestialBeastAlignment
    ? `\n- 4방신 신수 조화: ${result.celestialBeastAlignment.beastName} — ${result.celestialBeastAlignment.directionMatch} (조화도 ${result.celestialBeastAlignment.harmonyIndex}점)\n  * 방위 전술: ${result.celestialBeastAlignment.tacticalOrientationAdvice}`
    : '';
  const quadrantBlock = result.quadrantTransition
    ? `\n- 28일 순환 국면: ${result.quadrantTransition.phaseName} (순환 ${result.quadrantTransition.cycleDay}일차)\n  * 위상 에너지: ${result.quadrantTransition.phaseEnergy}\n  * 완급 조절: ${result.quadrantTransition.pacingGuide}`
    : '';

  return `
[천상열차분야지도(天象列次分野之圖) 28수 일진·택일 결정론적 산출 리포트 (${TWENTY_EIGHT_MANSIONS_ENGINE_VERSION})]
- 대상 일자: ${result.targetDate} (한국 표준시) · 율리우스적일 ${result.julianDayNumber}
- 당일 일진(日辰): ${result.dayGanZhi}일 · ${result.weekday} (요일 칠요: ${result.weekdayLuminary})
- 28수 직성(直星): ${result.mansion.fullName} — ${result.mansion.group} · ${result.mansion.index + 1}번째 수
  * 오행·칠요: ${result.mansion.element} / ${result.mansion.luminary} · 상징 신수: ${result.mansion.animal} · 길흉 본의: ${result.mansion.grade}
  * 본의 요해: ${result.mansion.gradeMeaning}
  * 7원 4주기 검증: 직성 칠요(${result.mansion.luminary}) ↔ 요일(${result.weekdayLuminary}) ${result.luminaryWeekdayAligned ? '완전 일치' : '불일치'}${enclosureBlock}${beastBlock}${quadrantBlock}
- 6대 영역 택일(擇日) 스코어:
${domainLines}
- 종합 판정: ${result.overallVerdict}
- 종합 개운 가이드: ${result.overallGuide}
- [AI 해석 절대 지침]: 본 리포트는 율리우스적일 기준 28수 회귀 주기로 계산된 100% 확정 수리입니다. 직성 등급과 영역별 점수를 임의로 바꾸지 말고, 택일 권고일과 개운 행동 가이드를 충실히 반영해 상담하십시오.
`.trim();
}
