/**
 * =========================================================================
 * LUCKEY 정통 밀교 숙요경(宿曜經) 27숙(二十七宿) 본명숙 & 6대 관계성
 * 3거리 매트릭스 결정론적 엔진
 * (Esoteric Sukuyō 27-Mansion Matrix & Six-Relationship Dynamics Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    동일한 생년월일 입력에 대해 항상 100% 동일한 본명숙·숙격·관계 매트릭스를 산출한다.
 *
 * 2. 정통 밀교 숙요경(宿曜經) 27숙 체계:
 *    인도 나크샤트라에서 중국 28수를 거쳐 일본 밀교(密敎)로 전래된 27숙 체계로,
 *    28수에서 우(牛)수를 제외한 27수가 태음월주(太陰月主)로 27×2일 주기(54일)를 이룬다.
 *    본명숙(本命宿)은 음력 생일의 월별 기숙표 기준일로부터의 일진 진행으로 환산한다.
 *
 * 3. 7대 숙격(宿格) 분류 — 27수의 성격 체계:
 *    - 안중숙(安重宿): 두·익·실·규·묘 — 신중, 안정, 대업
 *    - 화선숙(和善宿): 성·방·기·자 — 온화, 친화, 신뢰
 *    - 급맹숙(急猛宿): 미·정·루·벽·삼 — 과감, 돌파, 추진
 *    - 악해숙(惡害宿): 저·심·류 — 치명적 매력, 파괴적 직관
 *    - 독현숙(毒賢宿): 항·귀·허·필 — 지혜, 엄격, 카리스마
 *    - 경질숙(輕疾宿): 각·진·위(危)·위(胃) — 순발력, 기동성, 센스
 *    - 강유숙(剛柔宿): 여·장 — 강함과 부드러움의 양면성
 *
 * 4. 6대 관계성(六大關係性) — 순환 거리의 방향별 관계 판정:
 *    - 명(命): 동일 숙, 운명적 거울, 강한 공명과 충돌
 *    - 업·태(業·胎): 전생의 인연과 미래의 결실, 영혼의 파트너
 *    - 영·쇠(榮·衰): 번영과 소모, 최고의 시너지 vs 일방적 희생
 *    - 안·위(安·危): 안정과 위험, 지지자 vs 긴장 관계
 *    - 성·괴(成·壞): 성취와 파괴, 비즈니스 최상 파트너 vs 치명적 갈등
 *    - 우·친(友·親): 우정과 친밀, 가장 편안한 소통과 유대
 *
 * 5. 3거리(三距離) 깊이별 역학:
 *    - 근거리(近距離) 1~4숙: 매일 마주치는 가까운 인연, 즉각적 공명과 마찰
 *    - 중거리(中距離) 5~13숙: 사회적 협력과 성장의 거리, 절제된 유대
 *    - 원거리(遠距離) 14~26숙: 시간과 공간을 넘어 끌어당기는 깊은 인연
 *    (동일 숙인 명(命)은 거리 0의 특례로 근거리 대상에 포함한다.)
 */

import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate, convertSolarToLunar } from '../lunarCalendar';

export const SUKUYO_ENGINE_VERSION = 'LUCKEY-SY-v1.0.0';

export const SUKUYO_METHOD =
  '정통 밀교 숙요경(宿曜經) 27숙 결정론 산법: 월별 기숙표에 한국 음력 생일을 적용한 본명숙(本命宿) 환산, 7대 숙격(安重·和善·急猛·惡害·毒賢·輕疾·剛柔) 분류, 4방신(東方靑龍·北方玄武·西方白虎·南方朱雀) 소속 및 칠요 배속, 6대 관계성(命·業胎·榮衰·安危·成壞·友親) 방향별 판정과 3거리(근거리 1~4숙·중거리 5~13숙·원거리 14~26숙) 역학, 양방향 27숙 궁합 매트릭스 결정론 산출 (윤달은 계산 보류 · 일본 구력과 경계일 차이 가능)';

export type SukuyoDirectionGroup = '동방청룡(東方靑龍)' | '북방현무(北方玄武)' | '서방백호(西方白虎)' | '남방주작(南方朱雀)';
export type SevenLuminary = '목(木)' | '금(金)' | '토(土)' | '일(日)' | '월(月)' | '화(火)' | '수(水)';
export type FiveElement = '목(木)' | '화(火)' | '토(土)' | '금(金)' | '수(水)';
export type SukuyoShukgukKey = '안중' | '화선' | '급맹' | '악해' | '독현' | '경질' | '강유';
export type SukuyoRelationKey = '명' | '업태' | '영쇠' | '안위' | '성괴' | '우친';
export type SukuyoDistanceBand = '근거리' | '중거리' | '원거리';

export interface SukuyoMansionInfo {
  index: number; // 0 ~ 26 (27숙 순환 색인)
  name: string; // 각, 항, 저 ...
  hanja: string; // 角, 亢 ...
  fullName: string; // 각목교(角木蛟)
  group: SukuyoDirectionGroup; // 4방신 소속
  luminary: SevenLuminary; // 칠요 배속
  element: FiveElement; // 오행 (칠요 기준, 일요=태양진화·월요=태음진수)
  animal: string; // 연금(演禽) 상징 신수
  shukguk: SukuyoShukgukKey; // 7대 숙격
  shukgukHanja: string; // 安重宿 등
  shukgukTrait: string; // 숙격 성향 요해
}

export interface SukuyoRelationPairMeta {
  key: SukuyoRelationKey;
  ko: string; // 명(命) 등 방향 라벨
  hanja: string;
  summary: string; // 관계성 요해
}

export interface SukuyoRelationDynamic {
  key: SukuyoRelationKey;
  label: string; // 명·영·쇠·안·위·성·괴·우·친·업·태
  hanja: string;
  pairSummary: string;
  distance: number; // 0 ~ 26
  band: SukuyoDistanceBand;
  bandDynamics: string;
  polarity: '긍정(相生)' | '부정(相剋)' | '혼합(公明)'; // 방향별 긍부정
  score: number; // 5 ~ 100 결정론 호환 지수
  description: string;
}

export interface SukuyoMatrixRow {
  partnerIndex: number; // 0 ~ 26
  partnerName: string; // 상대 숙 이름 (각, 항 ...)
  distance: number; // 상대 기준 순환 거리
  fromMe: SukuyoRelationDynamic; // 내가 상대를 보는 관계
  fromPartner: SukuyoRelationDynamic; // 상대가 나를 보는 관계
}

export interface SukuyoPartnerMatrix {
  partnerProfileSummary: string; // 상대 식별 요약 (이름·생일)
  myMansion: SukuyoMansionInfo;
  partnerMansion: SukuyoMansionInfo;
  fromMe: SukuyoRelationDynamic; // 나 → 상대 (방향성)
  fromPartner: SukuyoRelationDynamic; // 상대 → 나 (역방향)
  mutualBand: SukuyoDistanceBand;
  compatibilityScore: number; // 양방향 평균 결정론 호환 지수
  fullMatrix: SukuyoMatrixRow[]; // 내 본명숙 기준 27숙 전수 양방향 매트릭스
}

export interface SukuyoResult {
  status: 'calculated' | 'skipped' | 'error';
  engineVersion: string;
  method: string;
  solarDateString?: string; // 역법 환산에 쓴 양력 생일 (YYYY-MM-DD)
  lunarDate?: { month: number; day: number; isLeapMonth: boolean };
  mansion?: SukuyoMansionInfo; // 본명숙
  shukguk?: {
    key: SukuyoShukgukKey;
    ko: string; // 안중숙(安重宿)
    trait: string;
    members: string; // 동일 숙격의 숙 목록
    lifeGuide: string; // 숙격 기반 인생 성향 가이드
  };
  selfDynamics?: string; // 본명숙·숙격 종합 역학
  partnerMatrix?: SukuyoPartnerMatrix | null; // 파트너가 있을 때만
  note?: string;
}

/** 27숙 원시 정의 (색인 0=각(角) ~ 26=진(軫), 숙요경 27숙 순서 — 우(牛)수 제외) */
const MANSIONS_27: ReadonlyArray<{
  name: string;
  hanja: string;
  luminary: SevenLuminary;
  animalHanja: string;
  fullName: string;
  group: SukuyoDirectionGroup;
  animalKo: string;
}> = [
  // ── 동방 청룡(東方靑龍) 7수 ──────────────────────────────
  { name: '각', hanja: '角', luminary: '목(木)', animalHanja: '蛟', fullName: '각목교(角木蛟)', group: '동방청룡(東方靑龍)', animalKo: '이무기' },
  { name: '항', hanja: '亢', luminary: '금(金)', animalHanja: '龍', fullName: '항금룡(亢金龍)', group: '동방청룡(東方靑龍)', animalKo: '용' },
  { name: '저', hanja: '氐', luminary: '토(土)', animalHanja: '貉', fullName: '저토락(氐土貉)', group: '동방청룡(東方靑龍)', animalKo: '오소리' },
  { name: '방', hanja: '房', luminary: '일(日)', animalHanja: '兎', fullName: '방일토(房日兎)', group: '동방청룡(東方靑龍)', animalKo: '토끼' },
  { name: '심', hanja: '心', luminary: '월(月)', animalHanja: '狐', fullName: '심월호(心月狐)', group: '동방청룡(東方靑龍)', animalKo: '여우' },
  { name: '미', hanja: '尾', luminary: '화(火)', animalHanja: '虎', fullName: '미화호(尾火虎)', group: '동방청룡(東方靑龍)', animalKo: '호랑이' },
  { name: '기', hanja: '箕', luminary: '수(水)', animalHanja: '豹', fullName: '기수표(箕水豹)', group: '동방청룡(東方靑龍)', animalKo: '표범' },
  // ── 북방 현무(北方玄武) 6수 (우(牛)수 제외) ──────────────
  { name: '두', hanja: '斗', luminary: '목(木)', animalHanja: '獬', fullName: '두목해(斗木獬)', group: '북방현무(北方玄武)', animalKo: '해태' },
  { name: '여', hanja: '女', luminary: '토(土)', animalHanja: '蝠', fullName: '여토복(女土蝠)', group: '북방현무(北方玄武)', animalKo: '박쥐' },
  { name: '허', hanja: '虛', luminary: '일(日)', animalHanja: '鼠', fullName: '허일서(虛日鼠)', group: '북방현무(北方玄武)', animalKo: '쥐' },
  { name: '위', hanja: '危', luminary: '월(月)', animalHanja: '燕', fullName: '위월연(危月燕)', group: '북방현무(北方玄武)', animalKo: '제비' },
  { name: '실', hanja: '室', luminary: '화(火)', animalHanja: '豬', fullName: '실화저(室火豬)', group: '북방현무(北方玄武)', animalKo: '돼지' },
  { name: '벽', hanja: '壁', luminary: '수(水)', animalHanja: '貐', fullName: '벽수유(壁水貐)', group: '북방현무(北方玄武)', animalKo: '물소' },
  // ── 서방 백호(西方白虎) 7수 ──────────────────────────────
  { name: '규', hanja: '奎', luminary: '목(木)', animalHanja: '狼', fullName: '규목랑(奎木狼)', group: '서방백호(西方白虎)', animalKo: '이리' },
  { name: '루', hanja: '婁', luminary: '금(金)', animalHanja: '狗', fullName: '루금구(婁金狗)', group: '서방백호(西方白虎)', animalKo: '개' },
  { name: '위', hanja: '胃', luminary: '토(土)', animalHanja: '雉', fullName: '위토치(胃土雉)', group: '서방백호(西方白虎)', animalKo: '꿩' },
  { name: '묘', hanja: '昴', luminary: '일(日)', animalHanja: '雞', fullName: '묘일계(昴日鷄)', group: '서방백호(西方白虎)', animalKo: '닭' },
  { name: '필', hanja: '畢', luminary: '월(月)', animalHanja: '烏', fullName: '필월오(畢月烏)', group: '서방백호(西方白虎)', animalKo: '까마귀' },
  { name: '자', hanja: '觜', luminary: '화(火)', animalHanja: '猴', fullName: '자화후(觜火猴)', group: '서방백호(西方白虎)', animalKo: '원숭이' },
  { name: '삼', hanja: '參', luminary: '수(水)', animalHanja: '猿', fullName: '삼수원(參水猿)', group: '서방백호(西方白虎)', animalKo: '긴원숭이' },
  // ── 남방 주작(南方朱雀) 7수 ──────────────────────────────
  { name: '정', hanja: '井', luminary: '목(木)', animalHanja: '犴', fullName: '정목안(井木犴)', group: '남방주작(南方朱雀)', animalKo: '들개' },
  { name: '귀', hanja: '鬼', luminary: '금(金)', animalHanja: '羊', fullName: '귀금양(鬼金羊)', group: '남방주작(南方朱雀)', animalKo: '양' },
  { name: '류', hanja: '柳', luminary: '토(土)', animalHanja: '獐', fullName: '류토장(柳土獐)', group: '남방주작(南方朱雀)', animalKo: '노루' },
  { name: '성', hanja: '星', luminary: '일(日)', animalHanja: '馬', fullName: '성일마(星日馬)', group: '남방주작(南方朱雀)', animalKo: '말' },
  { name: '장', hanja: '張', luminary: '월(月)', animalHanja: '鹿', fullName: '장월록(張月鹿)', group: '남방주작(南方朱雀)', animalKo: '사슴' },
  { name: '익', hanja: '翼', luminary: '화(火)', animalHanja: '蛇', fullName: '익화사(翼火蛇)', group: '남방주작(南方朱雀)', animalKo: '뱀' },
  { name: '진', hanja: '軫', luminary: '수(水)', animalHanja: '蚓', fullName: '진수인(軫水蚓)', group: '남방주작(南方朱雀)', animalKo: '지렁이' },
];

const LUMINARY_TO_ELEMENT: Record<SevenLuminary, FiveElement> = {
  '목(木)': '목(木)',
  '화(火)': '화(火)',
  '토(土)': '토(土)',
  '금(金)': '금(金)',
  '수(水)': '수(水)',
  '일(日)': '화(火)', // 태양진화(太陽眞火)
  '월(月)': '수(水)', // 태음진수(太陰眞水)
};

/** 7대 숙격 메타데이터 (숙 한자 기준 매핑) */
const SHUKGUK_META: Record<SukuyoShukgukKey, { hanja: string; trait: string; members: string; lifeGuide: string }> = {
  안중: { hanja: '安重宿', trait: '신중, 안정, 대업', members: '두(斗)·익(翼)·실(室)·규(奎)·묘(昴)', lifeGuide: '한 번 결정한 일을 끝까지 지켜내는 중후한 기상이 재물. 조급한 변화보다 축적된 신뢰로 큰일을 이룹니다.' },
  화선: { hanja: '和善宿', trait: '온화, 친화, 신뢰', members: '성(星)·방(房)·기(箕)·자(觜)', lifeGuide: '주변을 부드럽게 묶는 친화력이 자산이며, 사람들 사이에서 금방 신뢰를 얻는 온화한 리더십을 타고났습니다.' },
  급맹: { hanja: '急猛宿', trait: '과감, 돌파, 추진', members: '미(尾)·정(井)·루(婁)·벽(壁)·삼(參)', lifeGuide: '결단과 실행의 속도가 무기입니다. 막혔을 때 오히려 돌파구를 뚫는 과감한 추진력으로 성과를 냅니다.' },
  악해: { hanja: '惡害宿', trait: '치명적 매력, 파괴적 직관', members: '저(氐)·심(心)·류(柳)', lifeGuide: '사람을 깊이 붙드는 치명적 매력과 남이 못 보는 것을 보는 파괴적 직관을 지녔으니, 그 힘을 창작·전략·위기 대응에 씁니다.' },
  독현: { hanja: '毒賢宿', trait: '지혜, 엄격, 카리스마', members: '항(亢)·귀(鬼)·허(虛)·필(畢)', lifeGuide: '뼈아픈 말도 아프게 하는 통찰의 카리스마가 있습니다. 엄격한 기준이 지혜가 되도록, 가르침과 조롱의 경계를 지키는 것이 과제입니다.' },
  경질: { hanja: '輕疾宿', trait: '순발력, 기동성, 센스', members: '각(角)·진(軫)·위(危)·위(胃)', lifeGuide: '남보다 반 박자 빠른 순발력과 유행을 읽는 센스가 무기입니다. 기동력을 살리되 마무리 힘만 보완하면 됩니다.' },
  강유: { hanja: '剛柔宿', trait: '강함과 부드러움의 양면성', members: '여(女)·장(張)', lifeGuide: '단단함과 부드러움이 한 몸에 공존하는 양면성이 있습니다. 상대에 따라 강매향과 유연함을 전환해 쓰면 큰 힘이 됩니다.' },
};

/** 숙격 매핑 (27숙 색인 기준) */
const SHUKGUK_BY_INDEX: ReadonlyArray<SukuyoShukgukKey> = [
  '경질', // 0 각
  '독현', // 1 항
  '악해', // 2 저
  '화선', // 3 방
  '악해', // 4 심
  '급맹', // 5 미
  '화선', // 6 기
  '안중', // 7 두
  '강유', // 8 여
  '독현', // 9 허
  '경질', // 10 위(危)
  '안중', // 11 실
  '급맹', // 12 벽
  '안중', // 13 규
  '급맹', // 14 루
  '경질', // 15 위(胃)
  '안중', // 16 묘
  '독현', // 17 필
  '화선', // 18 자
  '급맹', // 19 삼
  '급맹', // 20 정
  '독현', // 21 귀
  '악해', // 22 류
  '화선', // 23 성
  '강유', // 24 장
  '안중', // 25 익
  '경질', // 26 진
];

/**
 * 6대 관계성 라벨 (순환 거리별 방향 관계 — birthCharts.sukuyoRelationship과 동일 수리):
 * 거리 0=명, 9=업, 18=태가 고정이고 영·쇠·안·위·성·괴·우·친이 8간격으로 순환한다.
 */
const RELATION_LABELS: ReadonlyArray<{ label: string; hanja: string; key: SukuyoRelationKey; polarity: SukuyoRelationDynamic['polarity'] }> = [
  { label: '명', hanja: '命', key: '명', polarity: '혼합(公明)' },
  { label: '영', hanja: '榮', key: '영쇠', polarity: '긍정(相生)' },
  { label: '쇠', hanja: '衰', key: '영쇠', polarity: '부정(相剋)' },
  { label: '안', hanja: '安', key: '안위', polarity: '긍정(相生)' },
  { label: '위', hanja: '危', key: '안위', polarity: '부정(相剋)' },
  { label: '성', hanja: '成', key: '성괴', polarity: '긍정(相生)' },
  { label: '괴', hanja: '壞', key: '성괴', polarity: '부정(相剋)' },
  { label: '우', hanja: '友', key: '우친', polarity: '긍정(相生)' },
  { label: '친', hanja: '親', key: '우친', polarity: '긍정(相生)' },
  { label: '업', hanja: '業', key: '업태', polarity: '혼합(公明)' },
  { label: '영', hanja: '榮', key: '영쇠', polarity: '긍정(相生)' },
  { label: '쇠', hanja: '衰', key: '영쇠', polarity: '부정(相剋)' },
  { label: '안', hanja: '安', key: '안위', polarity: '긍정(相生)' },
  { label: '위', hanja: '危', key: '안위', polarity: '부정(相剋)' },
  { label: '성', hanja: '成', key: '성괴', polarity: '긍정(相生)' },
  { label: '괴', hanja: '壞', key: '성괴', polarity: '부정(相剋)' },
  { label: '우', hanja: '友', key: '우친', polarity: '긍정(相生)' },
  { label: '친', hanja: '親', key: '우친', polarity: '긍정(相生)' },
  { label: '태', hanja: '胎', key: '업태', polarity: '혼합(公明)' },
  { label: '영', hanja: '榮', key: '영쇠', polarity: '긍정(相生)' },
  { label: '쇠', hanja: '衰', key: '영쇠', polarity: '부정(相剋)' },
  { label: '안', hanja: '安', key: '안위', polarity: '긍정(相生)' },
  { label: '위', hanja: '危', key: '안위', polarity: '부정(相剋)' },
  { label: '성', hanja: '成', key: '성괴', polarity: '긍정(相生)' },
  { label: '괴', hanja: '壞', key: '성괴', polarity: '부정(相剋)' },
  { label: '우', hanja: '友', key: '우친', polarity: '긍정(相生)' },
  { label: '친', hanja: '親', key: '우친', polarity: '긍정(相生)' },
];

/** 6대 관계성 쌍 요해 (라벨이 아니라 쌍 단위 의미) */
const RELATION_PAIR_SUMMARY: Record<SukuyoRelationKey, string> = {
  '명': '동일 숙, 운명적 거울, 강한 공명과 충돌',
  '업태': '전생의 인연과 미래의 결실, 영혼의 파트너',
  '영쇠': '번영과 소모, 최고의 시너지 vs 일방적 희생',
  '안위': '안정과 위험, 지지자 vs 긴장 관계',
  '성괴': '성취와 파괴, 비즈니스 최상 파트너 vs 치명적 갈등',
  '우친': '우정과 친밀, 가장 편안한 소통과 유대',
};

/** 라벨별 기본 호환 지수 (결정론 수리 기준선) */
const LABEL_BASE_SCORE: Record<string, number> = {
  명: 72, 업: 78, 태: 82,
  영: 88, 쇠: 35,
  안: 80, 위: 42,
  성: 90, 괴: 30,
  우: 84, 친: 86,
};

/** 3거리 깊이별 역학 */
const BAND_DYNAMICS: Record<SukuyoDistanceBand, string> = {
  근거리: '매일 마주치는 가까운 인연입니다. 즉각적인 공명과 마찰이 모두 강하게 일어나므로, 첫 만남의 인상보다 반복 접촉 속의 패턴이 관계의 실체입니다.',
  중거리: '사회적 협력과 성장의 거리입니다. 부담 없는 절제된 유대 속에서 서로의 능력을 보완하며 함께 커지는 구조입니다.',
  원거리: '시간과 공간을 넘어 끌어당기는 깊은 인연입니다. 물리적 거리가 멀수록 오히려 정신적 끌림이 강해지는, 배움과 전환의 상대입니다.',
};

/** 순환 거리 → 3거리 판정 (거리 0의 명(命)은 동일 숙 특례로 근거리에 포함) */
function distanceBand(distance: number): SukuyoDistanceBand {
  if (distance <= 4) return '근거리';
  if (distance <= 13) return '중거리';
  return '원거리';
}

/** 결정론 호환 지수: 라벨 기준선 + 3거리 보정, 5~100 클램프 */
function relationScore(label: string, band: SukuyoDistanceBand): number {
  const modifier = band === '근거리' ? 4 : band === '중거리' ? 0 : -4;
  return Math.min(100, Math.max(5, LABEL_BASE_SCORE[label] + modifier));
}

/** 한 숙의 정보 조립 (내부 헬퍼) */
function mansionInfo(index: number): SukuyoMansionInfo {
  const raw = MANSIONS_27[index];
  const shukguk = SHUKGUK_BY_INDEX[index];
  return {
    index,
    name: raw.name,
    hanja: raw.hanja,
    fullName: raw.fullName,
    group: raw.group,
    luminary: raw.luminary,
    element: LUMINARY_TO_ELEMENT[raw.luminary],
    animal: raw.animalKo,
    shukguk,
    shukgukHanja: SHUKGUK_META[shukguk].hanja,
    shukgukTrait: SHUKGUK_META[shukguk].trait,
  };
}

/** 27숙 색인 → 숙 정보 및 숙격 결정론 조회 (단위 검증·표시용 공개 헬퍼) */
export function sukuyoMansionInfoByIndex(index: number): SukuyoMansionInfo {
  if (!Number.isInteger(index) || index < 0 || index > 26) throw new RangeError('0~26 숙 인덱스가 필요합니다.');
  return mansionInfo(index);
}

/** 두 숙 사이의 한 방향 관계 역학 산출 (내부 헬퍼) */
function relationDynamic(fromIndex: number, toIndex: number): SukuyoRelationDynamic {
  const distance = ((toIndex - fromIndex + 27) % 27 + 27) % 27;
  const rel = RELATION_LABELS[distance];
  const band = distanceBand(distance);
  const score = relationScore(rel.label, band);
  const direction =
    distance === 0
      ? '같은 숙을 공유하는 거울의 관계로, 서로를 비추며 강하게 공명하는 동시에 같은 약점도 함께 드러납니다.'
      : rel.polarity === '긍정(相生)'
        ? '내 기운을 살려 주는 방향으로, 이 관계가 내 활력과 성취를 끌어올립니다.'
        : rel.polarity === '부정(相剋)'
          ? '내 기운을 긁거나 소모하는 방향으로, 무리한 결합은 피로가 되니 조건과 거리를 두는 것이 도리입니다.'
          : '편하게만 볼 수 없는 강렬한 인연으로, 공명과 충돌이 같이 오므로 깊이를 두고 신중히 다가가야 합니다.';
  return {
    key: rel.key,
    label: rel.label,
    hanja: rel.hanja,
    pairSummary: RELATION_PAIR_SUMMARY[rel.key],
    distance,
    band,
    bandDynamics: BAND_DYNAMICS[band],
    polarity: rel.polarity,
    score,
    description: `${fromIndex === toIndex ? '동일 숙' : `${MANSIONS_27[fromIndex].name}(${MANSIONS_27[fromIndex].hanja})수에서 ${MANSIONS_27[toIndex].name}(${MANSIONS_27[toIndex].hanja})수까지 ${distance}숙 떨어진 ${band}`} — 이 관계는 ${rel.label}(${rel.hanja})이며, ${RELATION_PAIR_SUMMARY[rel.key]}. ${direction} 호환 지수는 ${score}점입니다.`,
  };
}

/** 월별 기숙표 (음력 1~12월 초하루의 기준 숙 — birthCharts.MONTH_START와 동일) */
const MONTH_START = ['室', '奎', '胃', '畢', '參', '鬼', '張', '角', '氐', '心', '斗', '虛'];
/** 27숙 한자 순서 (birthCharts.SUKUYO_MANSIONS와 동일 — 우(牛) 제외) */
const MANSION_HANJA_27 = ['角', '亢', '氐', '房', '心', '尾', '箕', '斗', '女', '虛', '危', '室', '壁', '奎', '婁', '胃', '昴', '畢', '觜', '參', '井', '鬼', '柳', '星', '張', '翼', '軫'];

/** 음력 월·일 → 27숙 색인 결정론 환산 (정통 월별 기숙표 + 일진 진행) */
export function sukuyoIndexFromLunar(month: number, day: number): number {
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day) || day < 1 || day > 30) {
    throw new RangeError('유효한 음력 월일이 필요합니다.');
  }
  const startIndex = MANSION_HANJA_27.indexOf(MONTH_START[month - 1]);
  return (startIndex + day - 1) % 27;
}

/**
 * 숙요경 27숙 매트릭스 결정론적 계산 함수
 * (동일한 생년월일 입력 → 항상 100% 동일한 본명숙·숙격·관계 매트릭스 산출)
 */
export function calculateSukuyoAdvanced(params: {
  profile?: UserProfile | null;
  partnerProfile?: UserProfile | null;
}): SukuyoResult {
  const birthdateStr = params.profile?.basic?.birthdate?.trim() || '';
  if (!birthdateStr) {
    return {
      status: 'skipped',
      engineVersion: SUKUYO_ENGINE_VERSION,
      method: SUKUYO_METHOD,
      note: '생년월일 미입력으로 본명숙 계산 생략',
    };
  }

  let solarDate: { year: number; month: number; day: number };
  try {
    const resolved = resolveEffectiveSolarDate(birthdateStr, params.profile?.basic?.lunarSolar, params.profile?.basic?.isLeapMonth ?? false);
    solarDate = resolved.solarDate;
  } catch (err: any) {
    return {
      status: 'error',
      engineVersion: SUKUYO_ENGINE_VERSION,
      method: SUKUYO_METHOD,
      note: err?.message || '생년월일 파싱 실패',
    };
  }

  const lunar = convertSolarToLunar(solarDate.year, solarDate.month, solarDate.day);
  if (lunar.isLeapMonth) {
    return {
      status: 'skipped',
      engineVersion: SUKUYO_ENGINE_VERSION,
      method: SUKUYO_METHOD,
      solarDateString: `${solarDate.year}-${String(solarDate.month).padStart(2, '0')}-${String(solarDate.day).padStart(2, '0')}`,
      lunarDate: { month: lunar.month, day: lunar.day, isLeapMonth: true },
      note: '숙요 윤달 배정은 유파 확인이 필요하여 현재 계산을 보류합니다.',
    };
  }

  // 1. 본명숙(本命宿) 산출
  const myIndex = sukuyoIndexFromLunar(lunar.month, lunar.day);
  const mansion = mansionInfo(myIndex);

  // 2. 7대 숙격 판정
  const shukgukMeta = SHUKGUK_META[mansion.shukguk];
  const selfDynamics = `본명숙은 ${mansion.fullName} — ${mansion.group} 소속 · 칠요 ${mansion.luminary}(${mansion.element}) · 상징 신수 ${mansion.animal}입니다. ${shukgukMeta.hanja}에 속해 ${shukgukMeta.trait}의 기질을 타고났으며, ${shukgukMeta.lifeGuide}`;

  // 3. 파트너 궁합 매트릭스 (상대 프로필이 있을 때만)
  let partnerMatrix: SukuyoPartnerMatrix | null = null;
  const partnerBirthdate = params.partnerProfile?.basic?.birthdate?.trim() || '';
  if (partnerBirthdate) {
    try {
      const pResolved = resolveEffectiveSolarDate(partnerBirthdate, params.partnerProfile?.basic?.lunarSolar, params.partnerProfile?.basic?.isLeapMonth ?? false);
      const pSolar = pResolved.solarDate;
      const pLunar = convertSolarToLunar(pSolar.year, pSolar.month, pSolar.day);
      if (pLunar.isLeapMonth) {
        partnerMatrix = null;
      } else {
        const partnerIndex = sukuyoIndexFromLunar(pLunar.month, pLunar.day);
        const partnerMansion = mansionInfo(partnerIndex);
        const fromMe = relationDynamic(myIndex, partnerIndex);
        const fromPartner = relationDynamic(partnerIndex, myIndex);
        const fullMatrix: SukuyoMatrixRow[] = MANSIONS_27.map((_, idx) => ({
          partnerIndex: idx,
          partnerName: MANSIONS_27[idx].name,
          distance: ((idx - myIndex + 27) % 27 + 27) % 27,
          fromMe: relationDynamic(myIndex, idx),
          fromPartner: relationDynamic(idx, myIndex),
        }));
        const partnerName = params.partnerProfile?.basic?.name?.trim() || '';
        partnerMatrix = {
          partnerProfileSummary: `${partnerName ? `${partnerName} · ` : ''}양력 ${pSolar.year}-${String(pSolar.month).padStart(2, '0')}-${String(pSolar.day).padStart(2, '0')} (음력 ${pLunar.month}월 ${pLunar.day}일)`,
          myMansion: mansion,
          partnerMansion,
          fromMe,
          fromPartner,
          mutualBand: fromMe.distance <= fromPartner.distance ? fromMe.band : fromPartner.band,
          compatibilityScore: Math.round((fromMe.score + fromPartner.score) / 2),
          fullMatrix,
        };
      }
    } catch (_) {
      partnerMatrix = null; // 상대 정보 오류는 궁합 매트릭스만 생략
    }
  }

  return {
    status: 'calculated',
    engineVersion: SUKUYO_ENGINE_VERSION,
    method: SUKUYO_METHOD,
    solarDateString: `${solarDate.year}-${String(solarDate.month).padStart(2, '0')}-${String(solarDate.day).padStart(2, '0')}`,
    lunarDate: { month: lunar.month, day: lunar.day, isLeapMonth: false },
    mansion,
    shukguk: {
      key: mansion.shukguk,
      ko: shukgukMeta.hanja,
      trait: shukgukMeta.trait,
      members: shukgukMeta.members,
      lifeGuide: shukgukMeta.lifeGuide,
    },
    selfDynamics,
    partnerMatrix,
  };
}

/**
 * 프롬프트 주입용 숙요경 27숙 매트릭스 결과 포맷터
 */
export function formatSukuyoPrompt(result: SukuyoResult): string {
  if (result.status !== 'calculated' || !result.mansion) {
    return '';
  }

  const mansionLines = [
    `- 본명숙(本命宿): ${result.mansion.fullName} — ${result.mansion.group} 소속 (${result.mansion.index + 1}/27수)`,
    `  * 역법: 양력 ${result.solarDateString} → 음력 ${result.lunarDate?.month}월 ${result.lunarDate?.day}일`,
    `  * 칠요·오행: ${result.mansion.luminary} / ${result.mansion.element} · 상징 신수: ${result.mansion.animal}`,
  ].join('\n');

  const shukgukLine = result.shukguk
    ? `- 7대 숙격(宿格): ${result.shukguk.ko} — ${result.shukguk.trait}\n  * 동일 숙격: ${result.shukguk.members}\n  * 성향 가이드: ${result.shukguk.lifeGuide}`
    : '';

  const partnerBlock = result.partnerMatrix
    ? [
        `- 궁합 상대: ${result.partnerMatrix.partnerProfileSummary}`,
        `- 상대 본명숙: ${result.partnerMatrix.partnerMansion.fullName} (${result.partnerMatrix.partnerMansion.shukgukHanja} · ${result.partnerMatrix.partnerMansion.shukgukTrait})`,
        `- 나 → 상대: ${result.partnerMatrix.fromMe.label}(${result.partnerMatrix.fromMe.hanja}) 관계 · ${result.partnerMatrix.fromMe.band} · 호환 ${result.partnerMatrix.fromMe.score}점`,
        `  * ${result.partnerMatrix.fromMe.description}`,
        `- 상대 → 나: ${result.partnerMatrix.fromPartner.label}(${result.partnerMatrix.fromPartner.hanja}) 관계 · ${result.partnerMatrix.fromPartner.band} · 호환 ${result.partnerMatrix.fromPartner.score}점`,
        `  * ${result.partnerMatrix.fromPartner.description}`,
        `- 양방향 평균 호환 지수: ${result.partnerMatrix.compatibilityScore}점 (${result.partnerMatrix.mutualBand})`,
        `- 27숙 전수 양방향 매트릭스 (내 본명숙 기준 상대 숙별 관계):`,
        result.partnerMatrix.fullMatrix
          .map(
            (row) =>
              `    · ${row.partnerName}(${MANSION_HANJA_27[row.partnerIndex]})수 ${row.distance}숙 거리: 나→상대 ${row.fromMe.label}(${row.fromMe.hanja}) ${row.fromMe.score}점 / 상대→나 ${row.fromPartner.label}(${row.fromPartner.hanja}) ${row.fromPartner.score}점 [${row.fromMe.band}]`,
          )
          .join('\n'),
      ].join('\n')
    : '- 궁합 상대: 상대방 출생 정보가 없어 양방향 매트릭스는 미산출 (본명숙·숙격 단독 제공)';

  return `
[정통 밀교 숙요경(宿曜經) 27숙 본명숙 & 6대 관계성 3거리 매트릭스 리포트 (${SUKUYO_ENGINE_VERSION})]
${mansionLines}
${shukgukLine}
- 종합 역학: ${result.selfDynamics}
${partnerBlock}
- 6대 관계성 판정 체계: 명(命)=동일 숙의 운명적 거울 · 업·태(業·胎)=영혼의 파트너 · 영·쇠(榮·衰)=번영 vs 소모 · 안·위(安·危)=지지자 vs 긴장 · 성·괴(成·壞)=성취 vs 파괴 · 우·친(友·親)=가장 편안한 유대
- 3거리 역학: 근거리 1~4숙(즉각적 공명과 마찰) · 중거리 5~13숙(협력과 성장) · 원거리 14~26숙(시공을 넘는 끌림)
- [AI 해석 절대 지침]: 본 리포트는 월별 기숙표 기반 27숙 순환 수리로 계산된 100% 확정 수리입니다. 본명숙·숙격·관계 라벨과 호환 지수를 임의로 바꾸지 말고, 3거리 역학에 맞춰 상담하십시오.
`.trim();
}
