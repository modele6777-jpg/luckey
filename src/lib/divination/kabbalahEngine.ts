/**
 * =========================================================================
 * LUCKEY 정통 카발라(Kabbalah) 생명나무(Tree of Life) 결정론 엔진
 * 10 세피로트(Sephiroth) · 3대 기둥(Three Pillars) · 4개 세계(Four Worlds) ·
 * 22 경로(22 Paths, 히브리 22문자 & 타로 메이저 배속) &
 * 생년월일 수비학 게마트리아(Gematria) 수리 산법
 * (Authentic Kabbalistic Tree of Life 10-Sephiroth & 22-Paths Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리 결정론적 계산 (Deterministic).
 *    동일한 생년월일 입력에 대해 항상 100% 동일한 세피로트·경로 배속을 산출한다.
 *
 * 2. 정통 10 세피로트(Sephiroth) 전수 데이터:
 *    헤브라이 전통 생명나무의 10개 발현(에츠 하임)을 케테르(1)부터 말쿠트(10)까지
 *    기둥(Pillar)·행성(Planet)·칭호(Title) 전수 표로 고정한다. 다트(Da'ath)는
 *    발현되지 않은 11번째 "숨겨진 세피라"(심연의 보이지 않는 지식)로 별도 상수로 두어
 *    10 세피로트 계산과 구분한다(마스터 넘버 22의 특별 해석에만 사용).
 *
 * 3. 3대 기둥(Three Pillars):
 *    자비의 기둥(호크마·헤세드·네차크 / 남성성·확장), 엄격의 기둥(비나·게부라·호드 /
 *    여성성·수축), 균형의 기둥(케테르·티페레트·예소드·말쿠트 / 통합·중도)으로
 *    10 세피로트를 분류하며, 다트는 어느 기둥에도 속하지 않는다.
 *
 * 4. 4개 세계(Four Worlds):
 *    아칠루트(원형계·불·순수 영성) → 베리아(창조계·물·대천사의 영역) →
 *    예치라(형성계·바람·천사단과 아스트랄계) → 아시야(물질계·흙·구체적 현실)의
 *    하강 계층을 세피로트 층위와 대응시켜 산출한다.
 *
 * 5. 정통 22 경로(22 Paths):
 *    헤브라이 22문자(알레프→타브)가 생명나무의 세피로트 사이를 잇는 22개 경로
 *    (11번 경로 알레프 케테르↔호크마 ~ 32번 경로 타브 예소드↔말쿠트)에 1:1 대응하며,
 *    황금여명(Golden Dawn) 통용표에 따라 각 경로는 원소·행성·별자리 점성학적 속성과
 *    타로 메이저 아르카나(0 바보 ~ 21 세계)에 배속된다. 경로 연결망은 생명나무의
 *    전통 도형(3세로 vertical 기둥 + 7가로 가지)을 그대로 따른다.
 *
 * 6. 생년월일 수비학 게마트리아 산법:
 *    - 라이프 패스 세피라(Life Path Sephirah): YYYY+MM+DD 전 자리 숫자 합을 축약한다.
 *      1~10은 10 세피로트에 1:1 매핑되고, 축약 과정에서 11·22·33 마스터 넘버가
 *      나오면 축약을 멈추고 케테르(11·33)와 다트(22)의 상위 세피라 특별 해석을 적용한다.
 *    - 퍼스널리티 세피라(Personality Sephirah): 출생일(DD) 자리 합을 1~10으로 축약해 매핑.
 *    - 소울 패스 경로(Soul Path): 생년월일 전 자리 합을 1~22로 축약해 22 경로
 *      (11~32번)와 1:1 대응시켜 주(主) 활성화 경로와 영적 상승 테마를 산출한다.
 *    - 3기둥 밸런스: 활성화된 세피로트(라이프 패스·퍼스널리티 세피라 및 소울 패스
 *      경로의 양 끝 세피로트)가 속한 기둥 소속도를 합산해 백분율로 정규화한다.
 *
 * 7. 생시·출생도시가 없어도 산출된다(생년월일 수리 엔진, null-safe).
 *    프로필이 없으면 status 'skipped'로 안전하게 건너뛴다.
 */

import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate } from '../lunarCalendar';

export const KABBALAH_ENGINE_VERSION = 'LUCKEY-KB-v2.0.0';

export const KABBALAH_METHOD =
  '정통 카발라 생명나무 결정론 산법: 헤브라이 전통 10 세피로트(케테르~말쿠트, 다트는 숨겨진 세피라 별도 보존)·3대 기둥(자비·엄격·균형)·4개 세계(아칠루트·베리아·예치라·아시야)·22 경로(알레프~타브 22문자, 황금여명(Golden Dawn) 통용 원소·행성·별자리 속성 및 타로 메이저 0~21 배속) 전수 데이터와 생년월일 게마트리아 수리(라이프 패스 세피라 1~10 축약 및 11·22·33 마스터 넘버 케테르·다트 특별 해석, 퍼스널리티 세피라, 소울 패스 활성 경로, 3기둥 밸런스 백분율) 산출';

/** 기둥 구분 */
export type KabbalahPillar = '자비의 기둥' | '엄격의 기둥' | '균형의 기둥';

/** 10 세피로트 전수 정의 (number 1~10) */
export interface KabbalahSephirah {
  number: number; // 1 ~ 10
  name: string; // 케테르
  hebrew: string; // כֶּתֶר
  translit: string; // Kether
  meaning: string; // 왕관
  title: string; // 신성한 불꽃
  pillar: KabbalahPillar; // 소속 기둥
  planet: string; // 대응 행성(원소)
  description: string; // 상징 요해
}

/** 숨겨진 11번째 세피라 (다트 / 심연의 지식) — 10 세피로트 계산에서는 제외 */
export const DAATH: Readonly<{
  number: 0;
  name: string;
  hebrew: string;
  translit: string;
  meaning: string;
  title: string;
  description: string;
}> = {
  number: 0,
  name: '다트',
  hebrew: 'דַּעַת',
  translit: "Da'ath",
  meaning: '지식',
  title: '심연의 보이지 않는 지식',
  description: '비나와 헤세드 사이 심연(Abyss)에 숨은 발현되지 않은 세피라. 균형의 기둥 어디에도 속하지 않으며, 마스터 넘버 22의 특별 해석에서만 활성화된다.',
};

/** 정통 10 세피로트 전수 표 (황금여명(Golden Dawn)·헤브라이 전통 통용표) */
export const SEPHIROTH_10: ReadonlyArray<KabbalahSephirah> = [
  {
    number: 1, name: '케테르', hebrew: 'כֶּתֶר', translit: 'Kether', meaning: '왕관', title: '신성한 불꽃',
    pillar: '균형의 기둥', planet: '원초의 의지(프림모빌)', description: '모든 발현의 원점이자 나무의 정점. 존재가 세계로 스며들기 직전의 순수 빛(오르 아인 소프).',
  },
  {
    number: 2, name: '호크마', hebrew: 'חָכְמָה', translit: 'Chokmah', meaning: '지혜', title: '원초적 남성성',
    pillar: '자비의 기둥', planet: '황도대 전체(12별자리)', description: '방향 없는 순수 역동의 힘. 케테르의 빛이 처음 움직여 확장하는 양(陽)의 원리.',
  },
  {
    number: 3, name: '비나', hebrew: 'בִּינָה', translit: 'Binah', meaning: '이해', title: '원초적 여성성',
    pillar: '엄격의 기둥', planet: '토성', description: '무형의 흐름에 형태와 경계를 주는 음(陰)의 원리. 이해하고 수용해 세계를 잉태하는 위대한 어머니.',
  },
  {
    number: 4, name: '헤세드', hebrew: 'חֶסֶד', translit: 'Chesed', meaning: '자비·확장', title: '자애로운 왕',
    pillar: '자비의 기둥', planet: '목성', description: '구체적 질서 안에서 무한히 퍼지는 사랑과 관대함. 기회·풍요·보호의 확장 축.',
  },
  {
    number: 5, name: '게부라', hebrew: 'גְּבוּרָה', translit: 'Geburah', meaning: '엄격·심판', title: '강철의 전사',
    pillar: '엄격의 기둥', planet: '화성', description: '자비를 절단해 균형을 지키는 힘. 심판·정화·용기로 과잉을 가지는 엄격 축.',
  },
  {
    number: 6, name: '티페레트', hebrew: 'תִּפְאֶרֶת', translit: 'Tiphareth', meaning: '아름다움·조화', title: '희생된 왕·태양',
    pillar: '균형의 기둥', planet: '태양', description: '나무의 심장이자 자비와 엄격을 화해시키는 태양. 진정성·치유·자기 통합의 중심.',
  },
  {
    number: 7, name: '네차크', hebrew: 'נֶצַח', translit: 'Netzach', meaning: '승리·감정·본능', title: '영원한 승리',
    pillar: '자비의 기둥', planet: '금성', description: '지속하는 열정과 감정·본능의 불꽃. 끈기와 매력으로 상징 세계를 향해 밀어 올리는 힘.',
  },
  {
    number: 8, name: '호드', hebrew: 'הוֹד', translit: 'Hod', meaning: '영광·이성·지성', title: '완전한 영광',
    pillar: '엄격의 기둥', planet: '수성', description: '생각·언어·명명으로 형태를 다듬는 지성의 방. 감정(네차크)을 정제해 소통 가능한 진리로 만든다.',
  },
  {
    number: 9, name: '예소드', hebrew: 'יְסוֹד', translit: 'Yesod', meaning: '기초·무의식·꿈', title: '투명한 훈장',
    pillar: '균형의 기둥', planet: '달', description: '물질계로 흘러들기 전 마지막 저장소. 무의식·꿈·상상이 모여 현실을 잉태하는 기초.',
  },
  {
    number: 10, name: '말쿠트', hebrew: 'מַלְכוּת', translit: 'Malkuth', meaning: '왕국·물질계·현실', title: '왕국의 문·신부',
    pillar: '균형의 기둥', planet: '지구·4원소(불·물·바람·흙)', description: '위의 모든 것이 실재(實在)로 결실되는 유일한 물질 세계. 형체가 완성되는 최종점이자 다시 출발하는 시작점.',
  },
];

/** 4개 세계 전수 표 (아칠루트 → 아시야 하강 계층) */
export interface KabbalahWorld {
  order: number; // 1 ~ 4
  name: string; // 아칠루트
  hebrew: string;
  translit: string; // Atziluth
  korean: string; // 원형계
  element: string; // 불
  description: string; // 순수 영성
  sephirahRange: string; // 대응 세피로트 층위
}

export const FOUR_WORLDS: ReadonlyArray<KabbalahWorld> = [
  {
    order: 1, name: '아칠루트', hebrew: 'אֲצִילוּת', translit: 'Atziluth', korean: '원형계', element: '불',
    description: '순수 영성', sephirahRange: '케테르~비나 (1~3)',
  },
  {
    order: 2, name: '베리아', hebrew: 'בְּרִיאָה', translit: 'Beriah', korean: '창조계', element: '물',
    description: '대천사의 영역', sephirahRange: '헤세드~게부라 (4~5)',
  },
  {
    order: 3, name: '예치라', hebrew: 'יְצִירָה', translit: 'Yetzirah', korean: '형성계', element: '바람',
    description: '천사단과 아스트랄계', sephirahRange: '티페레트~예소드 (6~9)',
  },
  {
    order: 4, name: '아시야', hebrew: 'עֲשִׁיָּה', translit: 'Assiah', korean: '물질계', element: '흙',
    description: '구체적 현실', sephirahRange: '말쿠트 (10)',
  },
];

/** 3대 기둥 전수 표 */
export interface KabbalahPillarInfo {
  id: 'mercy' | 'severity' | 'mildness';
  name: string;
  translit: string;
  essence: string;
  sephiroth: ReadonlyArray<number>; // 세피로트 번호
}

export const THREE_PILLARS: ReadonlyArray<KabbalahPillarInfo> = [
  { id: 'mercy', name: '자비의 기둥', translit: 'Pillar of Mercy', essence: '남성성·확장', sephiroth: [2, 4, 7] },
  { id: 'severity', name: '엄격의 기둥', translit: 'Pillar of Severity', essence: '여성성·수축', sephiroth: [3, 5, 8] },
  { id: 'mildness', name: '균형의 기둥', translit: 'Pillar of Mildness', essence: '통합·중도', sephiroth: [1, 6, 9, 10] },
];

/** 점성학적 속성 (원소 / 행성 / 별자리) */
export type KabbalahPathAttribution = { kind: '원소'; value: string } | { kind: '행성'; value: string } | { kind: '별자리'; value: string };

/** 22 경로 전수 정의 (path 11 ~ 32) */
export interface KabbalahPath {
  number: number; // 11 ~ 32
  from: number; // 세피로트 번호
  to: number; // 세피로트 번호
  hebrewLetter: string; // א
  letterName: string; // 알레프
  translit: string; // Aleph
  letterMeaning: string; // 소
  attribution: KabbalahPathAttribution; // 점성학적 속성
  tarotNumber: number; // 0 ~ 21
  tarotName: string; // 바보
  tarotTranslit: string; // The Fool
  spiritualTheme: string; // 소울 패스 영적 상승 테마
}

/** 황금여명(Golden Dawn) 통용표 기반 정통 22 경로 전수 표 (11번 알레프 ~ 32번 타브) */
export const PATHS_22: ReadonlyArray<KabbalahPath> = [
  { number: 11, from: 1, to: 2, hebrewLetter: 'א', letterName: '알레프', translit: 'Aleph', letterMeaning: '소', attribution: { kind: '원소', value: '바람(Air)' }, tarotNumber: 0, tarotName: '바보', tarotTranslit: 'The Fool', spiritualTheme: '아무것도 갖지 않은 순수로 낙하를 신뢰하는 것 — 시작이 곧 도약임을 아는 영적 상승' },
  { number: 12, from: 1, to: 3, hebrewLetter: 'ב', letterName: '베트', translit: 'Beth', letterMeaning: '집', attribution: { kind: '행성', value: '수성(Mercury)' }, tarotNumber: 1, tarotName: '마법사', tarotTranslit: 'The Magician', spiritualTheme: '위의 것을 아래로 내리는 말(媒)의 자리 — 의지를 언어로 번역해 현실화하는 상승' },
  { number: 13, from: 1, to: 6, hebrewLetter: 'ג', letterName: '기멜', translit: 'Gimel', letterMeaning: '낙타', attribution: { kind: '행성', value: '달(Moon)' }, tarotNumber: 2, tarotName: '여사제', tarotTranslit: 'The High Priestess', spiritualTheme: '심연을 가로질러 물 한 방울 없이 건너는 단 하나의 길 — 침묵 속 내면의 진실을 신뢰하는 상승' },
  { number: 14, from: 2, to: 3, hebrewLetter: 'ד', letterName: '달렛', translit: 'Daleth', letterMeaning: '문', attribution: { kind: '행성', value: '금성(Venus)' }, tarotNumber: 3, tarotName: '여황제', tarotTranslit: 'The Empress', spiritualTheme: '지혜와 이해를 잇는 사랑의 문 — 모든 창조는 받아들임에서 잉태됨을 아는 상승' },
  { number: 15, from: 2, to: 6, hebrewLetter: 'ה', letterName: '헤', translit: 'Heh', letterMeaning: '창(창문)', attribution: { kind: '별자리', value: '양자리(Aries)' }, tarotNumber: 4, tarotName: '황제', tarotTranslit: 'The Emperor', spiritualTheme: '시야를 여는 창이자 권위 — 흐름에 형태를 부여하는 책임의 상승' },
  { number: 16, from: 2, to: 4, hebrewLetter: 'ו', letterName: '바브', translit: 'Vav', letterMeaning: '못', attribution: { kind: '별자리', value: '황소자리(Taurus)' }, tarotNumber: 5, tarotName: '교황', tarotTranslit: 'The Hierophant', spiritualTheme: '하늘과 땅을 못으로 고정하는 전승 — 지혜를 가르침으로 지탱하는 상승' },
  { number: 17, from: 3, to: 6, hebrewLetter: 'ז', letterName: '자인', translit: 'Zayin', letterMeaning: '검', attribution: { kind: '별자리', value: '쌍둥이자리(Gemini)' }, tarotNumber: 6, tarotName: '연인', tarotTranslit: 'The Lovers', spiritualTheme: '선택의 검 — 이분법을 넘어 둘을 하나로 아는 의식적 선택의 상승' },
  { number: 18, from: 3, to: 5, hebrewLetter: 'ח', letterName: '헤트', translit: 'Cheth', letterMeaning: '울타리', attribution: { kind: '별자리', value: '게자리(Cancer)' }, tarotNumber: 7, tarotName: '전차', tarotTranslit: 'The Chariot', spiritualTheme: '울타리 안에 신성을 가두는 보존 — 경계가 곧 보호임을 아는 상승' },
  { number: 19, from: 4, to: 5, hebrewLetter: 'ט', letterName: '테트', translit: 'Teth', letterMeaning: '뱀', attribution: { kind: '별자리', value: '사자자리(Leo)' }, tarotNumber: 8, tarotName: '힘', tarotTranslit: 'Strength', spiritualTheme: '사자를 부드럽게 쓰다듬는 힘 — 억누르지 않고 길들이는 내면 기품의 상승' },
  { number: 20, from: 4, to: 6, hebrewLetter: 'י', letterName: '요드', translit: 'Yod', letterMeaning: '손', attribution: { kind: '별자리', value: '처녀자리(Virgo)' }, tarotNumber: 9, tarotName: '은둔자', tarotTranslit: 'The Hermit', spiritualTheme: '한 점 빛을 손에 쥐고 어둠을 걷는 길 — 가장 작은 것 안에서 완전함을 보는 상승' },
  { number: 21, from: 4, to: 7, hebrewLetter: 'כ', letterName: '카프', translit: 'Kaph', letterMeaning: '손바닥', attribution: { kind: '행성', value: '목성(Jupiter)' }, tarotNumber: 10, tarotName: '운명의 수레바퀴', tarotTranslit: 'Wheel of Fortune', spiritualTheme: '순환을 받쳐 올리는 손바닥 — 회전을 붙잡지 않고 타는 순응의 상승' },
  { number: 22, from: 5, to: 6, hebrewLetter: 'ל', letterName: '라메드', translit: 'Lamed', letterMeaning: '몽둥이(소 몰이 지팡이)', attribution: { kind: '별자리', value: '천칭자리(Libra)' }, tarotNumber: 11, tarotName: '정의', tarotTranslit: 'Justice', spiritualTheme: '지도책으로 심판을 교정하는 지혜 — 균형을 배우며 바로잡는 상승' },
  { number: 23, from: 5, to: 8, hebrewLetter: 'מ', letterName: '멤', translit: 'Mem', letterMeaning: '물', attribution: { kind: '원소', value: '물(Water)' }, tarotNumber: 12, tarotName: '매달린 사람', tarotTranslit: 'The Hanged Man', spiritualTheme: '거꾸로 매달려 물 속에서 보는 역설 — 내려놓음으로 얻는 완전한 반전의 상승' },
  { number: 24, from: 6, to: 7, hebrewLetter: 'נ', letterName: '눈', translit: 'Nun', letterMeaning: '물고기', attribution: { kind: '별자리', value: '전갈자리(Scorpio)' }, tarotNumber: 13, tarotName: '죽음', tarotTranslit: 'Death', spiritualTheme: '헤엄쳐 건너는 변용 — 오래된 껍질을 벗어야 살아남음을 아는 상승' },
  { number: 25, from: 6, to: 9, hebrewLetter: 'ס', letterName: '사멕', translit: 'Samekh', letterMeaning: '지지대', attribution: { kind: '별자리', value: '사수자리(Sagittarius)' }, tarotNumber: 14, tarotName: '절제', tarotTranslit: 'Temperance', spiritualTheme: '화살과 같은 의지로 지평을 향해 — 두 세계를 섞는 절제의 상승' },
  { number: 26, from: 6, to: 8, hebrewLetter: 'ע', letterName: '아인', translit: 'Ayin', letterMeaning: '눈', attribution: { kind: '별자리', value: '염소자리(Capricorn)' }, tarotNumber: 15, tarotName: '악마', tarotTranslit: 'The Devil', spiritualTheme: '집착의 눈을 뜨고 마주 보는 것 — 그림자를 부정하지 않아 자유로워지는 상승' },
  { number: 27, from: 7, to: 8, hebrewLetter: 'פ', letterName: '페', translit: 'Peh', letterMeaning: '입', attribution: { kind: '행성', value: '화성(Mars)' }, tarotNumber: 16, tarotName: '탑', tarotTranslit: 'The Tower', spiritualTheme: '말로 세운 탑이 무너지는 순간 — 거짓 구조만 무너뜨리는 해방의 상승' },
  { number: 28, from: 7, to: 9, hebrewLetter: 'צ', letterName: '차디', translit: 'Tzaddi', letterMeaning: '낚싯바늘', attribution: { kind: '별자리', value: '물병자리(Aquarius)' }, tarotNumber: 17, tarotName: '별', tarotTranslit: 'The Star', spiritualTheme: '무의식의 물에서 희망을 낚아 올리는 것 — 별빛을 따라 흐르는 상승' },
  { number: 29, from: 7, to: 10, hebrewLetter: 'ק', letterName: '코프', translit: 'Qoph', letterMeaning: '뒷머리', attribution: { kind: '별자리', value: '물고기자리(Pisces)' }, tarotNumber: 18, tarotName: '달', tarotTranslit: 'The Moon', spiritualTheme: '감정의 깊은 바다에서 물질의 육지로 — 환영을 통과해 오는 상승' },
  { number: 30, from: 8, to: 6, hebrewLetter: 'ר', letterName: '레쉬', translit: 'Resh', letterMeaning: '머리', attribution: { kind: '행성', value: '태양(Sun)' }, tarotNumber: 19, tarotName: '태양', tarotTranslit: 'The Sun', spiritualTheme: '이성의 머리가 태양을 향해 돌아서는 것 — 지혜가 빛으로 포화되는 상승' },
  { number: 31, from: 8, to: 10, hebrewLetter: 'ש', letterName: '신', translit: 'Shin', letterMeaning: '이(아래니)', attribution: { kind: '원소', value: '불(Fire)' }, tarotNumber: 20, tarotName: '심판', tarotTranslit: 'Judgement', spiritualTheme: '이성의 불이 땅에서 부활을 일으키는 것 — 말과 불로 일어서는 각성의 상승' },
  { number: 32, from: 9, to: 10, hebrewLetter: 'ת', letterName: '타브', translit: 'Tav', letterMeaning: '십자(표식)', attribution: { kind: '행성', value: '토성(Saturn)' }, tarotNumber: 21, tarotName: '세계', tarotTranslit: 'The World', spiritualTheme: '꿈(예소드)이 현실(말쿠트)로 완성되는 마지막 문 — 순환을 닫아 완전해지는 상승' },
];

/** 세피로트 번호(1~10)로 전수 정보 조회 */
export function kabbalahSephirahByNumber(n: number): KabbalahSephirah {
  if (!Number.isInteger(n) || n < 1 || n > 10) throw new RangeError('1~10 세피로트 번호가 필요합니다.');
  return SEPHIROTH_10[n - 1];
}

/** 경로 번호(11~32)로 전수 정보 조회 */
export function kabbalahPathByNumber(n: number): KabbalahPath {
  if (!Number.isInteger(n) || n < 11 || n > 32) throw new RangeError('11~32 경로 번호가 필요합니다.');
  return PATHS_22[n - 11];
}

/** 마스터 넘버 (축약 중 발견되면 멈춘다) */
const MASTER_NUMBERS = [11, 22, 33] as const;
export const KABBALAH_MASTER_NUMBERS = MASTER_NUMBERS;

/** 자릿수 합 */
export function digitSum(n: number): number {
  return Math.abs(n).toString().split('').reduce((s, c) => s + Number(c), 0);
}

/**
 * 게마트리아 축약: 자릿수 합을 반복해 floor 이하(기본 10 → 1~10 세피로트 매핑)로 만든다.
 * - life path(마스터 보존): 합이 11·22·33이면 그 값으로 멈춘다.
 * - 퍼스널리티(마스터 미보존): 10 이하가 될 때까지 축약한다(1~10 세피로트 매핑).
 * - 소울 패스: floor 22로 축약해 1~22 수리를 얻는다.
 */
export function reduceGematria(n: number, opts: { keepMasters?: boolean; floor?: number } = {}): number {
  const keepMasters = opts.keepMasters ?? false;
  const floor = opts.floor ?? 10;
  let cur = n;
  while (cur > floor) {
    if (keepMasters && (MASTER_NUMBERS as readonly number[]).includes(cur)) return cur;
    cur = digitSum(cur);
  }
  return cur;
}

/** 마스터 넘버 라이프 패스의 특별 해석 문구 */
export const KABBALAH_MASTER_INTERPRETATIONS: Readonly<Record<number, string>> = {
  11: '마스터 넘버 11 — 상위 세피라 케테르의 초월 해석: 10 세피로트의 분업 이전에 있는 유일한 빛. 케테르(왕관)의 통합 의지가 삶의 배경 주제로 작동한다.',
  22: '마스터 넘버 22 — 숨겨진 세피라 다트의 특별 해석: 심연의 보이지 않는 지식. 형태 없는 통찰이 자비(헤세드)의 확장으로 내려오지 않고 심연에 머무는 삶의 주제로, 다트를 티페레트의 의식적 선택으로 잇는 것이 영적 과제다.',
  33: '마스터 넘버 33 — 케테르~말쿠트 전 나무 통합 해석: 가장 높은 빛(케테르)이 가장 낮은 왕국(말쿠트)까지 그대로 비치는 나무 전체의 통합. 교사·치유자의 극단적 희생과 전체성의 주제로 작동한다.',
};

/** 소울 패스 수리(1~22) → 활성 경로 번호(11~32) */
export function soulPathNumberToPath(soulPathNumber: number): number {
  if (!Number.isInteger(soulPathNumber) || soulPathNumber < 1 || soulPathNumber > 22) {
    throw new RangeError('1~22 소울 패스 수리가 필요합니다.');
  }
  return soulPathNumber + 10;
}

/** 창조의 번개 하강 계위 및 상승 잠재력 */
export interface KabbalahLightningFlash {
  descentStage: number; // 1~10 (0은 다트)
  stageTitle: string;
  ascensionPotentialIndex: number; // 50~98
  spiritualLesson: string;
}

/** 티페레트(태양·심장) 중심성 조화도 */
export interface KabbalahTipherethAlignment {
  harmonyScore: number; // 40~98
  balanceStatus: '상위 지성 지향형' | '중도 태양 통합형' | '하위 실천 구현형';
  solarHeartGuidance: string;
}

/** 4대 세계 친화도 스펙트럼 */
export interface KabbalahFourWorldsSpectrum {
  atziluth: number; // 원형계/불 %
  beriah: number; // 창조계/물 %
  yetzirah: number; // 형성계/바람 %
  assiah: number; // 물질계/흙 %
  manifestationAdvice: string;
}

export interface KabbalahNumerology {
  rawDigitSum: number; // YYYYMMDD 전 자리 합 원값
  lifePathNumber: number; // 1~10 또는 마스터 넘버 11·22·33
  lifePathIsMaster: boolean;
  lifePathSephirah: KabbalahSephirah | typeof DAATH; // 10 세피로트 또는 다트(마스터 22)
  lifePathInterpretation: string; // 마스터 넘버 특별 해석 포함
  personalityNumber: number; // 1~10
  personalitySephirah: KabbalahSephirah;
  soulPathNumber: number; // 1~22
  soulPath: KabbalahPath; // 활성 경로 (번호 + 10)
  pillarBalance: {
    mercy: number; // 자비의 기둥 (0~100, 합 100)
    severity: number; // 엄격의 기둥
    mildness: number; // 균형의 기둥
  };
  dominantWorld: KabbalahWorld; // 라이프 패스 세피라가 속한 세계
  lightningFlash?: KabbalahLightningFlash;
  tipherethAlignment?: KabbalahTipherethAlignment;
  fourWorldsSpectrum?: KabbalahFourWorldsSpectrum;
}

export interface KabbalahResult {
  status: 'calculated' | 'skipped' | 'error';
  engineVersion: string;
  calculatedAtKst?: string;
  method: string;
  birthInput?: { solarDateString: string; originalDateString: string; isLunar: boolean };
  numerology?: KabbalahNumerology;
  tree?: {
    sephiroth: ReadonlyArray<KabbalahSephirah>; // 10 세피로트 전수
    hiddenSephirah: typeof DAATH; // 다트
    pillars: ReadonlyArray<KabbalahPillarInfo>; // 3대 기둥
    worlds: ReadonlyArray<KabbalahWorld>; // 4개 세계
    paths: ReadonlyArray<KabbalahPath>; // 22 경로 전수
  };
  situationalKabbalahAudit?: {
    focusTheme: string;
    sephirahNote: string;
    pathPractice: string;
  };
  temporalKabbalahRhythm?: {
    kstTimeLabel: string;
    treeWatchWindow: string;
    seasonalWorldTone: string;
    temporalGuidance: string;
  };
  kabbalahSynthesisMatrix?: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  boundaryNotice?: string;
  note?: string;
}

/** 세피로트 번호 → 소속 세계 */
function worldOfSephirah(sephirahNumber: number): KabbalahWorld {
  if (sephirahNumber <= 3) return FOUR_WORLDS[0];
  if (sephirahNumber <= 5) return FOUR_WORLDS[1];
  if (sephirahNumber <= 9) return FOUR_WORLDS[2];
  return FOUR_WORLDS[3];
}

/** 3기둥 밸런스: 활성 세피로트들의 기둥 소속도를 백분율(정수, 합 100)로 정규화 */
function pillarBalanceOf(activatedSephirahNumbers: ReadonlyArray<number>): KabbalahNumerology['pillarBalance'] {
  const tally = { mercy: 0, severity: 0, mildness: 0 };
  const pillarOf = (n: number): keyof typeof tally | null => {
    const p = THREE_PILLARS.find((x) => x.sephiroth.includes(n));
    return p ? p.id : null; // 다트 등 기둥 없는 세피라는 집계에서 제외
  };
  for (const n of activatedSephirahNumbers) {
    const id = pillarOf(n);
    if (id) tally[id] += 1;
  }
  const total = tally.mercy + tally.severity + tally.mildness;
  if (total === 0) return { mercy: 0, severity: 0, mildness: 0 };
  const pct = (v: number) => Math.round((v / total) * 100);
  const mercy = pct(tally.mercy);
  const severity = pct(tally.severity);
  const mildness = 100 - mercy - severity; // 합이 정확히 100이 되도록 균형 기둥이 나머지를 흡수
  return { mercy, severity, mildness };
}

function calculateLightningFlash(sephirahNumber: number, rawDigitSum: number, isDaath: boolean): KabbalahLightningFlash {
  const stage = isDaath ? 0 : sephirahNumber;
  const stageTitles: Record<number, string> = {
    0: '심연의 비밀문 (다트 — 발현되지 않은 직관 지식)',
    1: '제1계위 원초의 빛 (케테르 — 신성한 의지의 시원)',
    2: '제2계위 무한한 확장 (호크마 — 원초적 지혜의 폭발)',
    3: '제3계위 형태의 수용 (비나 — 원초적 이해의 잉태)',
    4: '제4계위 자비로운 은총 (헤세드 — 무조건적 사랑과 기회)',
    5: '제5계위 준엄한 정화 (게부라 — 정의와 절제의 심판)',
    6: '제6계위 태양의 중심 (티페레트 — 아름다움과 자기 조화)',
    7: '제7계위 승리의 열정 (네차크 — 예술적 감성과 본능의 불꽃)',
    8: '제8계위 영광의 지성 (호드 — 언어와 논리의 명료함)',
    9: '제9계위 상상의 파동 (예소드 — 무의식과 현실의 교두보)',
    10: '제10계위 물질적 결실 (말쿠트 — 구체적 완성의 왕국)',
  };
  const baseAscension = 55;
  const ascensionPotentialIndex = Math.min(98, Math.max(50, baseAscension + ((rawDigitSum * 7 + (stage || 6) * 3) % 41)));
  const lessons: Record<number, string> = {
    0: '보이지 않는 진리를 두려워하지 않고, 침묵 속에서 직관적 통찰을 현실에 번역해 내는 것이 과제입니다.',
    1: '자기 안의 원초적 창조 의지를 믿고, 편협한 집착에서 벗어나 모든 가능성에 자기를 활짝 열어두십시오.',
    2: '솟구치는 아이디어와 통찰을 주저 없이 행동으로 옮기되, 방향을 잃지 않도록 지혜의 초점을 잡으십시오.',
    3: '상황의 한계와 경계를 탓하지 말고, 제약을 가장 아름다운 형태를 빚어내는 창조의 틀로 수용하십시오.',
    4: '타인과 세계를 향한 무조건적 사랑을 실천하되, 지나친 관용이 무질서로 흐르지 않도록 중심을 지키십시오.',
    5: '불필요한 욕망과 군더더기를 과감히 잘라내고, 엄격한 자기 규율을 통해 순수한 영혼의 힘을 단련하십시오.',
    6: '자비와 엄격, 이상과 현실의 대립을 따스한 가슴의 중심에서 포용하고, 참된 자기다움을 꽃피우십시오.',
    7: '가슴속 순수한 열정과 창작 욕구를 억누르지 말고, 끈기 있는 몰입을 통해 생명력을 세상에 드러내십시오.',
    8: '복잡한 감정을 명료한 사유와 정직한 언어로 정제하고, 논리적 질서 속에서 진실을 소통하십시오.',
    9: '무의식의 꿈과 상상을 방치하지 말고, 성실한 습관과 감각 훈련을 통해 단단한 현실의 기초로 안착시키십시오.',
    10: '추상적인 이상에 머물지 말고, 일상의 작은 행동과 물질적 책임을 온전히 완수하며 천국을 땅 위에 세우십시오.',
  };

  return {
    descentStage: stage,
    stageTitle: stageTitles[stage] || '알 수 없는 계위',
    ascensionPotentialIndex,
    spiritualLesson: lessons[stage] || '자기 고유의 세피라를 관조하며 통합을 이루십시오.',
  };
}

function calculateTipherethAlignment(sephirahNumber: number, isDaath: boolean): KabbalahTipherethAlignment {
  const num = isDaath ? 3 : sephirahNumber;
  const dist = Math.abs(num - 6);
  const harmonyScore = Math.min(98, Math.max(40, 96 - dist * 8));

  let balanceStatus: '상위 지성 지향형' | '중도 태양 통합형' | '하위 실천 구현형';
  let solarHeartGuidance: string;

  if (num === 6) {
    balanceStatus = '중도 태양 통합형';
    solarHeartGuidance = '생명나무의 심장인 티페레트와 완전한 조화를 이루고 있습니다. 지성과 본능, 이상과 현실을 자연스럽게 조율하는 천부적 균형 감각을 발휘하십시오.';
  } else if (num < 6) {
    balanceStatus = '상위 지성 지향형';
    solarHeartGuidance = '상위 삼각형(케테르·호크마·비나) 및 고위 세피라의 높은 이상과 지적 에너지를 품고 있습니다. 고결한 통찰을 가슴(티페레트)의 온기로 녹여 세상과 연결하십시오.';
  } else {
    balanceStatus = '하위 실천 구현형';
    solarHeartGuidance = '하위 세피라(네차크·호드·예소드·말쿠트)의 생생한 감각과 실천적 감수성이 발달해 있습니다. 세속의 분주함에 휩쓸리지 않도록 가슴(티페레트)의 고요한 중심으로 자주 돌아오십시오.';
  }

  return {
    harmonyScore,
    balanceStatus,
    solarHeartGuidance,
  };
}

function calculateFourWorldsSpectrum(activatedSephiroth: ReadonlyArray<number>): KabbalahFourWorldsSpectrum {
  let atziluthCount = 0; // 1~3 (다트 포함 시 1)
  let beriahCount = 0;   // 4~5
  let yetzirahCount = 0; // 6~9
  let assiahCount = 0;   // 10

  for (const s of activatedSephiroth) {
    if (s <= 3) atziluthCount++;
    else if (s <= 5) beriahCount++;
    else if (s <= 9) yetzirahCount++;
    else assiahCount++;
  }

  const total = activatedSephiroth.length || 1;
  const atziluth = Math.round((atziluthCount / total) * 100);
  const beriah = Math.round((beriahCount / total) * 100);
  const yetzirah = Math.round((yetzirahCount / total) * 100);
  const assiah = Math.max(0, 100 - (atziluth + beriah + yetzirah));

  let manifestationAdvice = '';
  if (atziluth >= 40) {
    manifestationAdvice = '원형계(불)의 영적 영감이 강합니다. 직관을 구체적 계획서와 실천으로 단계별로 안착시키는 아시야(물질계) 훈련이 중요합니다.';
  } else if (beriah >= 40) {
    manifestationAdvice = '창조계(물)의 거대한 감성적 에너지를 품고 있습니다. 영혼의 열망을 맑은 지적 구조로 정리할 때 가장 위대한 창작물이 탄생합니다.';
  } else if (yetzirah >= 40) {
    manifestationAdvice = '형성계(바람)의 활발한 사고와 소통 역량이 돋보입니다. 생각에만 머무르지 않고 손에 잡히는 구체적 결과물을 맺는 마무리에 집중하십시오.';
  } else {
    manifestationAdvice = '물질계(흙)의 탁월한 실행력과 현실 감각을 갖추고 있습니다. 당장의 손익에 매몰되지 않고 더 높은 영적 가치를 일상에 스며들게 하십시오.';
  }

  return {
    atziluth,
    beriah,
    yetzirah,
    assiah,
    manifestationAdvice,
  };
}

function getTemporalKabbalahRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const treeWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 케테르·아칠루트 각성창 — 오늘의 가장 순수한 의도를 왕관(케테르)에 세우는 시간'
      : hour >= 11 && hour < 17
        ? '정오 티페레트·베리아 균형창 — 자비와 엄격 사이에서 중심(티페레트)을 잡는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 말쿠트·아시야 결실창 — 생각과 영감을 현실의 손에 잡히는 결과로 맺는 시간'
          : '심야 예소드·무의식 성찰창 — 꿈과 무의식의 저장소를 정화하며 내면을 비추는 시간';

  const seasonalWorldTone =
    month >= 3 && month <= 5
      ? '봄 · 아칠루트(불) 영감기 (새로운 의도와 창조적 씨앗을 틔우는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 베리아(물) 창조기 (열정과 감성을 구조화해 세상으로 흘려보내는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 예치라(바람) 형성기 (언어와 관계의 형식을 정교하게 다듬는 시기)'
          : '겨울 · 아시야(흙) 내실기 (보이지 않는 뿌리를 단단히 다져 현실 토대를 굳히는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    treeWatchWindow,
    seasonalWorldTone,
    temporalGuidance: `${treeWatchWindow} · ${seasonalWorldTone}의 흐름에 맞추어 생명나무의 기둥을 조율하십시오.`,
  };
}

/**
 * 정통 카발라 생명나무 10 세피로트 & 22 경로 게마트리아 결정론적 계산 함수
 * (동일한 생년월일 입력 → 항상 100% 동일한 세피로트·경로 배속 산출)
 */
export function calculateKabbalah(params: {
  profile?: UserProfile | null;
  now?: Date;
  question?: string;
}): KabbalahResult {
  const now = params.now || new Date();
  const question = (params.question || '').trim();
  const birthdateStr = params.profile?.basic?.birthdate?.trim() || '';
  if (!birthdateStr) {
    return {
      status: 'skipped',
      engineVersion: KABBALAH_ENGINE_VERSION,
      method: KABBALAH_METHOD,
      note: '생년월일 미입력으로 게마트리아 계산 생략',
    };
  }

  try {
    const resolved = resolveEffectiveSolarDate(birthdateStr, params.profile?.basic?.lunarSolar, params.profile?.basic?.isLeapMonth ?? false);
    const { year, month, day } = resolved.solarDate;
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
      throw new RangeError('생년월일 파싱 실패');
    }

    // 1. 게마트리아 원값: YYYY+MM+DD 전 자리 숫자 합
    const rawDigitSum = [year, month, day].reduce((s, v) => s + digitSum(v), 0);

    // 2. 라이프 패스 세피라 (1~10 축약, 11·22·33 마스터 넘버 보존)
    const lifePathNumber = reduceGematria(rawDigitSum, { keepMasters: true, floor: 10 });
    const lifePathIsMaster = (MASTER_NUMBERS as readonly number[]).includes(lifePathNumber);
    const lifePathSephirah: KabbalahSephirah | typeof DAATH =
      lifePathNumber === 22
        ? DAATH
        : kabbalahSephirahByNumber([11, 33].includes(lifePathNumber) ? 1 : lifePathNumber); // 11·33 → 케테르(상위 세피라)
    const lifePathInterpretation = lifePathIsMaster
      ? KABBALAH_MASTER_INTERPRETATIONS[lifePathNumber]
      : `${lifePathSephirah.name}(${lifePathSephirah.translit}) 세피라 — ${lifePathSephirah.title}의 원리가 삶의 배경 주제로 작동한다.`;

    // 3. 퍼스널리티 세피라: 출생일(DD) 자리 합 1~10 축약
    const personalityNumber = reduceGematria(digitSum(day), { keepMasters: false, floor: 10 });
    const personalitySephirah = kabbalahSephirahByNumber(personalityNumber);

    // 4. 소울 패스 경로: 전체 원값 1~22 축약 → 경로 11~32
    const soulPathNumber = reduceGematria(rawDigitSum, { keepMasters: false, floor: 22 });
    const soulPath = kabbalahPathByNumber(soulPathNumberToPath(soulPathNumber));

    // 5. 3기둥 밸런스: 활성 세피로트 = 라이프 패스 세피라 + 퍼스널리티 세피라 + 소울 패스 경로 양 끝
    const activated = [lifePathNumber === 22 ? 0 : lifePathSephirah.number, personalitySephirah.number, soulPath.from, soulPath.to];
    const pillarBalance = pillarBalanceOf(activated);

    // 6. 지배 세계: 라이프 패스 세피라가 속한 층위 (다트는 심연 — 베리아 위 비나 경계로 두지 않고 케테르 층 아칠루트에 둔다)
    const dominantWorld = worldOfSephirah(lifePathNumber === 22 ? 1 : lifePathSephirah.number);

    // 7. 라이트닝 플래시, 티페레트 조화도, 4대 세계 친화도 산출
    const isDaath = lifePathNumber === 22;
    const lightningFlash = calculateLightningFlash(lifePathNumber === 22 ? 0 : lifePathSephirah.number, rawDigitSum, isDaath);
    const tipherethAlignment = calculateTipherethAlignment(lifePathNumber === 22 ? 3 : lifePathSephirah.number, isDaath);
    const fourWorldsSpectrum = calculateFourWorldsSpectrum(activated);

    const temporalKabbalahRhythm = getTemporalKabbalahRhythm(now);
    const situationalKabbalahAudit = /관계|사랑|감정/.test(question)
      ? {
          focusTheme: `${lifePathSephirah.name} · ${soulPath.tarotName} 관계 균형`,
          sephirahNote: `${dominantWorld.name}(${dominantWorld.korean})의 결에서 자비와 엄격의 균형을 살펴보십시오.`,
          pathPractice: soulPath.spiritualTheme,
        }
      : /일|진로|선택|성공/.test(question)
        ? {
            focusTheme: `${personalitySephirah.name} · ${fourWorldsSpectrum.manifestationAdvice.slice(0, 24)}`,
            sephirahNote: lightningFlash.spiritualLesson,
            pathPractice: tipherethAlignment.solarHeartGuidance,
          }
        : {
            focusTheme: `${lifePathSephirah.name}(${lifePathSephirah.translit}) · 제${soulPath.number}경로 ${soulPath.letterName}`,
            sephirahNote: lifePathInterpretation,
            pathPractice: soulPath.spiritualTheme,
          };

    const kabbalahSynthesisMatrix = {
      coreInsight: `[${lifePathSephirah.name}] 라이프 패스와 제${soulPath.number}경로(${soulPath.tarotName})가 생명나무의 축을 이룹니다.`,
      recommendedAction: tipherethAlignment.solarHeartGuidance,
      cautionNotice: '자비(확장)와 엄격(수축) 중 한쪽으로 치우치지 않도록 중도(티페레트)를 의식하십시오.',
    };

    return {
      status: 'calculated',
      engineVersion: KABBALAH_ENGINE_VERSION,
      calculatedAtKst: temporalKabbalahRhythm.kstTimeLabel,
      method: KABBALAH_METHOD,
      birthInput: {
        solarDateString: resolved.solarDateString,
        originalDateString: birthdateStr,
        isLunar: resolved.isLunar,
      },
      numerology: {
        rawDigitSum,
        lifePathNumber,
        lifePathIsMaster,
        lifePathSephirah,
        lifePathInterpretation,
        personalityNumber,
        personalitySephirah,
        soulPathNumber,
        soulPath,
        pillarBalance,
        dominantWorld,
        lightningFlash,
        tipherethAlignment,
        fourWorldsSpectrum,
      },
      tree: {
        sephiroth: SEPHIROTH_10,
        hiddenSephirah: DAATH,
        pillars: THREE_PILLARS,
        worlds: FOUR_WORLDS,
        paths: PATHS_22,
      },
      situationalKabbalahAudit,
      temporalKabbalahRhythm,
      kabbalahSynthesisMatrix,
      boundaryNotice: '본 결과는 헤브라이 카발라 생명나무와 생년월일 게마트리아 수리에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.',
    };
  } catch (err: any) {
    return {
      status: 'error',
      engineVersion: KABBALAH_ENGINE_VERSION,
      method: KABBALAH_METHOD,
      note: err?.message || '생년월일 파싱 실패',
    };
  }
}

/** 프롬프트 주입용 카발라 생명나무 결과 포맷터 */
export function formatKabbalahPrompt(result: KabbalahResult): string {
  if (result.status !== 'calculated' || !result.numerology) return '';
  const n = result.numerology;
  const birth = result.birthInput!;
  const lp = n.lifePathSephirah;
  const isDaath = 'title' in lp && lp.number === 0;

  const describeBalance = (v: number) => (v >= 50 ? '우세' : v >= 25 ? '균형' : '보완 필요');

  const lines = [
    `[정통 카발라 생명나무 10 세피로트 & 22 경로 게마트리아 리포트 (${KABBALAH_ENGINE_VERSION})]`,
    ...(result.calculatedAtKst ? [`- 연산 시각: ${result.calculatedAtKst}`] : []),
    `- 출생 기준: ${birth.solarDateString}${birth.isLunar ? '(음력 → 양력 환산)' : ''} | 게마트리아 원값: ${n.rawDigitSum}`,
    `- 라이프 패스 세피라: ${n.lifePathNumber}${n.lifePathIsMaster ? '(마스터 넘버)' : ''} → ${lp.name}(${lp.translit})${'meaning' in lp ? ` / ${lp.meaning}` : ''} — ${lp.title}${'pillar' in lp ? ` · ${lp.pillar}` : ' · 기둥 없음(심연)'}`,
    `  * 해석: ${n.lifePathInterpretation}`,
    `- 퍼스널리티 세피라: ${n.personalityNumber} → ${n.personalitySephirah.name}(${n.personalitySephirah.translit}) / ${n.personalitySephirah.meaning} — ${n.personalitySephirah.pillar}`,
    `- 소울 패스: 수리 ${n.soulPathNumber}/22 → 제${n.soulPath.number}경로 ${n.soulPath.letterName}(${n.soulPath.hebrewLetter}) ${kabbalahSephirahByNumber(n.soulPath.from).name}↔${kabbalahSephirahByNumber(n.soulPath.to).name} — 타로 메이저 ${n.soulPath.tarotNumber}번 ${n.soulPath.tarotName}(${n.soulPath.tarotTranslit})`,
    `  * 점성학적 속성: ${n.soulPath.attribution.kind} ${n.soulPath.attribution.value} | 문자 의미: ${n.soulPath.letterMeaning}`,
    `  * 영적 상승 테마: ${n.soulPath.spiritualTheme}`,
    `- 3기둥 밸런스: 자비(확장) ${describeBalance(n.pillarBalance.mercy)} · 엄격(수축) ${describeBalance(n.pillarBalance.severity)} · 균형(통합) ${describeBalance(n.pillarBalance.mildness)}`,
    `- 지배 세계: 제${n.dominantWorld.order}세계 ${n.dominantWorld.name}(${n.dominantWorld.translit} / ${n.dominantWorld.korean}·${n.dominantWorld.element}) — ${n.dominantWorld.description} · 세피로트 층위 ${n.dominantWorld.sephirahRange}`,
  ];

  if (n.lightningFlash) {
    lines.push(
      `- 창조의 번개(Lightning Flash): ${n.lightningFlash.stageTitle}\n  * 영적 과제: ${n.lightningFlash.spiritualLesson}`,
    );
  }
  if (n.tipherethAlignment) {
    lines.push(
      `- 티페레트(태양·심장) 조화도: [${n.tipherethAlignment.balanceStatus}]\n  * 조율 가이드: ${n.tipherethAlignment.solarHeartGuidance}`,
    );
  }
  if (n.fourWorldsSpectrum) {
    lines.push(
      `- 4대 세계 친화도: 아칠루트(원형계·불) ${describeBalance(n.fourWorldsSpectrum.atziluth)} · 베리아(창조계·물) ${describeBalance(n.fourWorldsSpectrum.beriah)} · 예치라(형성계·바람) ${describeBalance(n.fourWorldsSpectrum.yetzirah)} · 아시야(물질계·흙) ${describeBalance(n.fourWorldsSpectrum.assiah)}\n  * 현실 구현 조언: ${n.fourWorldsSpectrum.manifestationAdvice}`,
    );
  }
  if (result.situationalKabbalahAudit) {
    lines.push(`- 질문 맥락 감사 (${result.situationalKabbalahAudit.focusTheme}): ${result.situationalKabbalahAudit.sephirahNote} / ${result.situationalKabbalahAudit.pathPractice}`);
  }
  if (result.temporalKabbalahRhythm) {
    lines.push(`- KST 시공간 생명나무 리듬: ${result.temporalKabbalahRhythm.treeWatchWindow} / ${result.temporalKabbalahRhythm.seasonalWorldTone}`);
    lines.push(`  * 시공간 지침: ${result.temporalKabbalahRhythm.temporalGuidance}`);
  }
  if (result.kabbalahSynthesisMatrix) {
    lines.push(`- 카발라 교차 매트릭스: 핵심(${result.kabbalahSynthesisMatrix.coreInsight}) | 실행(${result.kabbalahSynthesisMatrix.recommendedAction}) | 주의(${result.kabbalahSynthesisMatrix.cautionNotice})`);
  }

  lines.push(
    `- 나무 구조: 10 세피로트(케테르~말쿠트) + 숨겨진 다트 · 3대 기둥(자비·엄격·균형) · 4개 세계(아칠루트·베리아·예치라·아시야) · 22 경로(알레프~타브 = 타로 메이저 0~21)`,
    ...(result.boundaryNotice ? [`- 해석 경계: ${result.boundaryNotice}`] : []),
    `- [AI 해석 지침]: 게마트리아 결과는 입력한 생년월일과 전통적 대응 규칙을 적용한 참고 자료이며, 운명이나 심리 상태를 확정하지 않습니다. 세피라·경로·타로 배속은 표기된 계산 결과에 맞춰 설명하고, 다트는 발현되지 않은 숨겨진 세피라이므로 일반 세피로트처럼 단정하지 마십시오.`,
  );

  if (isDaath) {
    lines.splice(3, 0, `  * 다트 보충: ${DAATH.description}`);
  }

  return lines.join('\n');
}
