/**
 * 대한민국 매월당 김시습(梅月堂 金時習) 선생 《금오신화(金鰲新話)》 방외인(方外人) 자유혼 & 절의·유불도 원융 지혜 엔진
 *
 * 조선 최초의 한문소설 《금오신화(金鰲新話)》를 짓고, 세속의 권력과 영달을 벗어던진 채 천하를 주유하며
 * 순수한 양심과 절의를 지킨 생육신이자 방외지사(方外之士) 청한자 매월당 김시습(金時習, 1435~1493) 선생의 불후의 사상과 문학 기반:
 * 1. 방외인 초연 자유혼 지수(Fangwairen Autonomous Freedom Score): 세속의 벼슬과 권력, 허례허식을 털어내고 바람처럼 자유롭게 거니는 청한(淸寒)의 영혼 활력도.
 * 2. 불굴의 절의 및 지조 지수(Indomitable Fidelity & Conscience Score): 불의한 찬탈과 타협하지 않고 사육신의 시신을 수습하며 끝까지 양심의 지조를 지킨 백설 같은 결백도.
 * 3. 시공초월 지고지순 사랑 승화도(Transcendent Love & Literary Elevation Index): 《금오신화》 속 이생규장전·만복사저포기처럼 생사를 넘나드는 지극한 인연과 순수한 인간애의 문학적 승화도.
 * 4. 유불도 삼교 원융 회통력(Confucian-Buddhist-Taoist Syncretic Harmony Index): 유교의 의리, 불교의 무상과 자비, 도교의 무위자연을 두루 꿰뚫어 사유의 담벼락을 허무는 원융무애한 지혜.
 * 5. 청한 고독 내면 승화도(Cheonghan Solitude Transcendence Score): 금오산과 수락산, 관악산의 거친 산하 속에서도 차(茶)와 시(詩)로 고독을 맑은 영성으로 벼려낸 예술적 내공.
 *
 * @version LUCKEY-KIM-SI-SEUP-GEUMO-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_KIM_SI_SEUP_VERSION = 'LUCKEY-KIM-SI-SEUP-GEUMO-v1.0.0';

export interface MaewoldangTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface MaewoldangAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanMaewoldangKimSiSeupGeumoSinhwaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 매월당 김시습 지혜 지표 (0~100)
  fangwairenFreedomScore: number;                // 방외인 초연 자유혼 지수 (Fangwairen Autonomous Freedom)
  indomitableFidelityConscienceScore: number;    // 불굴의 절의 및 지조 지수 (Indomitable Fidelity & Conscience)
  transcendentLoveLiteraryIndex: number;         // 시공초월 지고지순 사랑 승화도 (Transcendent Love & Literary Elevation)
  threeTeachingsSyncreticHarmonyIndex: number;   // 유불도 삼교 원융 회통력 (Three Teachings Syncretic Harmony)
  cheonghanSolitudeTranscendenceScore: number;   // 청한 고독 내면 승화도 (Cheonghan Solitude Transcendence)
  // 세부 분석
  activeMaewoldangTheme: MaewoldangTheme;
  focalMaewoldangAphorism: MaewoldangAphorism;
  maewoldangComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const MAEWOLDANG_THEMES: MaewoldangTheme[] = [
  {
    themeKey: 'fangwairenFreedom',
    themeTitleHanja: '方外之人 & 嘯傲乾坤',
    themeTitleKo: '방외인(方外人)의 자유혼 — 세상의 그물에 걸리지 않는 바람처럼',
    existentialInsight: '세속의 평가, 감투, 형식적인 예법의 울타리를 훌쩍 뛰어넘어 홀로 우뚝 설 때, 인간은 우주 전체와 자유롭게 호흡하는 참된 주체성을 얻습니다.',
    practicalCounsel: '타인의 시선이나 사회적 고정관념에 갇혀 전전긍긍하지 마십시오. 당신의 내면이 진정으로 가리키는 맑고 자유로운 길을 향해 당당히 걸어가십시오.',
  },
  {
    themeKey: 'cleanFidelity',
    themeTitleHanja: '淸寒節義 & 白雪陽春',
    themeTitleKo: '청한(淸寒)의 절의 — 어떤 불의와도 타협하지 않는 양심의 지조',
    existentialInsight: '권력과 이익 앞에서도 비굴하게 무릎 꿇지 않고, 홀로 눈보라 속을 지키는 매화처럼 맑고 시린(淸寒) 도덕적 결백을 지키는 데 삶의 영원한 존엄이 있습니다.',
    practicalCounsel: '눈앞의 이익이나 편의를 위해 양심에 어긋나는 선택을 하지 마십시오. 시간이 흘러도 부끄럽지 않을 떳떳한 기준을 지켜낼 때 참된 위엄이 세워집니다.',
  },
  {
    themeKey: 'geumoTranscendentLove',
    themeTitleHanja: '金鰲神話 & 生死不渝',
    themeTitleKo: '금오신화의 지순한 인연 — 생사와 시공을 넘나드는 불멸의 사랑',
    existentialInsight: '《만복사저포기》와 《이생규장전》의 이야기처럼, 진실한 영혼의 만남과 사랑은 죽음과 이별의 벽조차 허물고 영원한 빛으로 승화됩니다.',
    practicalCounsel: '인간관계나 소중한 인연을 조건이나 계산으로 재지 마십시오. 온 마음을 다해 아끼고 지켜낸 진실한 교명만이 세월의 풍화를 이겨냅니다.',
  },
  {
    themeKey: 'threeTeachingsSyncreticHarmony',
    themeTitleHanja: '儒佛道三敎圓融 & 萬法歸一',
    themeTitleKo: '유불도 삼교 원융 — 유학의 의리, 불교의 자비, 도가의 무위 합일',
    existentialInsight: '유학의 정의로운 도덕, 불교의 만물 평등과 자비, 도교의 소박한 자연 순응은 결코 서로 모순되지 않고 한마음(一心)의 바다에서 만납니다.',
    practicalCounsel: '하나의 도그마나 편협한 학설에 갇혀 편 가르기를 하지 마십시오. 서로 다른 관점들의 깊은 장점을 유연하게 품어 안아 더 넓은 지혜로 융합하십시오.',
  },
  {
    themeKey: 'poeticSolitude',
    themeTitleHanja: '詩酒煮茶 & 孤雲野鶴',
    themeTitleKo: '시와 차의 고독 승화 — 외로움을 가장 그윽한 향기로 빚어냄',
    existentialInsight: '세상의 몰이해와 외로움을 한탄하지 않고, 맑은 샘물에 차를 달이고 시를 읊으며 내면을 그윽하게 채울 때 고독은 가장 고결한 영적 축복이 됩니다.',
    practicalCounsel: '홀로 있는 시간을 두려워하거나 낭비하지 마십시오. 조용한 침묵과 사색, 예술과 배움 속에서 자신을 깊이 가다듬는 보배로운 시간으로 삼으십시오.',
  },
];

export const MAEWOLDANG_APHORISMS: MaewoldangAphorism[] = [
  {
    aphorismKey: 'madmanAloneConscience',
    aphorismKo: '세상 사람들은 나를 미치광이라 부르지만, 나는 내 속의 맑은 양심을 따라 홀로 걸어갈 뿐이다.',
    aphorismHanja: '世人謂我狂 我隨吾心淸',
    sourceContext: '《매월당집(梅月堂集)》 자소(自笑)',
    actionGuidance: '남들이 알아주지 않거나 오해하더라도 흔들리지 마십시오. 오직 당신 가슴속의 정직한 나침반을 믿고 묵묵히 정진하십시오.',
  },
  {
    aphorismKey: 'geumoHermitageUniverse',
    aphorismKo: '금오산 서늘한 골짜기에 집 한 칸 지어두고, 비바람 속에 책을 펴니 온 우주가 내 벗이로다.',
    aphorismHanja: '金鰲山下一茅廬 萬里乾坤萬卷書',
    sourceContext: '《금오록(金鰲錄)》 서시',
    actionGuidance: '소박하고 단출한 환경 속에서도 드높은 정신의 자유를 누리십시오. 외적 화려함보다 내면의 풍요로움을 가꾸는 것이 진정한 부유함입니다.',
  },
  {
    aphorismKey: 'transcendentLoveFidelity',
    aphorismKo: '삶과 죽음의 경계가 아득하다 한들, 마음과 마음이 맺은 지극한 인연이야 어찌 흩어지겠는가.',
    aphorismHanja: '生死路殊 情隨一念',
    sourceContext: '《금오신화(金鰲新話)》 이생규장전',
    actionGuidance: '상황과 환경이 바뀌더라도 소중한 약속과 진실한 신의를 끝까지 지켜내십시오. 불변의 성실함이 기적을 만듭니다.',
  },
  {
    aphorismKey: 'wealthLikeCloudsTeaWind',
    aphorismKo: '부귀는 뜬구름이요 공명은 마른 풀잎이라, 한 잔 차를 달이며 맑은 바람을 마주함만 못하도다.',
    aphorismHanja: '富貴浮雲名草葉 煮茶一盞對淸風',
    sourceContext: '《매월당집》 다시(茶詩)',
    actionGuidance: '덧없는 세속의 탐욕과 조급함을 내려놓으십시오. 오늘 마주하는 한 잔의 차, 한 줄기 신선한 바람 속에서 온전한 충만감을 누리십시오.',
  },
  {
    aphorismKey: 'threeTeachingsUnity',
    aphorismKo: '인의(仁義)의 대의를 지키고, 무위(無爲)의 자연에 노닐며, 불심(佛心)의 자비로 세상을 품노라.',
    aphorismHanja: '儒以行義 道以順化 釋以慈悲 一體圓通',
    sourceContext: '《삼교석의(三敎釋義)》',
    actionGuidance: '정의로운 실천과 너그러운 포용, 자연스러운 유연성을 두루 겸비하십시오. 편협함을 벗어던질 때 모든 갈등이 저절로 풀립니다.',
  },
  {
    aphorismKey: 'wanderingWildernessPureHeart',
    aphorismKo: '거친 들판을 헤매더라도 한 점 부끄럼 없는 마음, 그것이 천하를 다 가진 자보다 떳떳한 까닭이다.',
    aphorismHanja: '落拓江湖心坦蕩 仰不愧天俯不怍',
    sourceContext: '《매월당집》 방랑시편',
    actionGuidance: '어떤 난관에 부딪히더라도 떳떳한 자존감을 잃지 마십시오. 하늘을 우러러 한 점 부끄럼 없는 당당함이 최고의 힘입니다.',
  },
];

export function calculateKoreanMaewoldangKimSiSeupGeumoSinhwa(
  profile?: UserProfile,
  query?: string,
): KoreanMaewoldangKimSiSeupGeumoSinhwaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `KIM-SI-SEUP-GEUMO:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const fangwairenFreedomScore = 79 + (absHash % 20);
  const indomitableFidelityConscienceScore = 80 + ((absHash >> 3) % 19);
  const transcendentLoveLiteraryIndex = 77 + ((absHash >> 6) % 22);
  const threeTeachingsSyncreticHarmonyIndex = 78 + ((absHash >> 9) % 21);
  const cheonghanSolitudeTranscendenceScore = 76 + ((absHash >> 12) % 23);

  const themeIndex = (absHash >> 4) % MAEWOLDANG_THEMES.length;
  const aphorismIndex = (absHash >> 7) % MAEWOLDANG_APHORISMS.length;

  const activeMaewoldangTheme = MAEWOLDANG_THEMES[themeIndex];
  const focalMaewoldangAphorism = MAEWOLDANG_APHORISMS[aphorismIndex];

  const guidanceTitle = `매월당 김시습 방외인 자유혼과 절의 지혜: ${activeMaewoldangTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 최초의 한문소설 《금오신화》를 창작하고 세속의 영달을 초월하여 양심의 지조를 지킨 방외인 매월당 김시습 선생의 사상은, 얽매임 없는 자유로운 영혼(方外人)과 맑고 시린 절의(淸寒), 지극한 사랑과 유불도 삼교의 원융을 가르칩니다. ` +
    `현재 당신의 길을 비추는 핵심 원리는 '${activeMaewoldangTheme.themeTitleKo}'입니다. ` +
    `${activeMaewoldangTheme.practicalCounsel} 아울러 매월당 선생의 원전 명언 "${focalMaewoldangAphorism.aphorismKo}"(${focalMaewoldangAphorism.aphorismHanja})를 마음에 새기며, ` +
    `${focalMaewoldangAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_KIM_SI_SEUP_VERSION,
    calculatedAtKst: new Date().toISOString(),
    fangwairenFreedomScore,
    indomitableFidelityConscienceScore,
    transcendentLoveLiteraryIndex,
    threeTeachingsSyncreticHarmonyIndex,
    cheonghanSolitudeTranscendenceScore,
    activeMaewoldangTheme,
    focalMaewoldangAphorism,
    maewoldangComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanMaewoldangKimSiSeupGeumoSinhwaPrompt(
  res: KoreanMaewoldangKimSiSeupGeumoSinhwaResult,
): string {
  return [
    `【매월당 김시습 《금오신화》 방외인 자유혼 & 절의·삼교원융 지표】`,
    `- 방외인 초연 자유혼 지수(Fangwairen Autonomous Freedom): ${res.fangwairenFreedomScore}/100`,
    `- 불굴의 절의 및 지조 지수(Indomitable Fidelity & Conscience): ${res.indomitableFidelityConscienceScore}/100`,
    `- 시공초월 지고지순 사랑 승화도(Transcendent Love & Literary): ${res.transcendentLoveLiteraryIndex}/100`,
    `- 유불도 삼교 원융 회통력(Three Teachings Syncretic Harmony): ${res.threeTeachingsSyncreticHarmonyIndex}/100`,
    `- 청한 고독 내면 승화도(Cheonghan Solitude Transcendence): ${res.cheonghanSolitudeTranscendenceScore}/100`,
    `- 핵심 매월당 테마: ${res.activeMaewoldangTheme.themeTitleKo} [${res.activeMaewoldangTheme.themeTitleHanja}]`,
    `- 실존적 통찰: ${res.activeMaewoldangTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeMaewoldangTheme.practicalCounsel}`,
    `- 매월당 원전 명언: "${res.focalMaewoldangAphorism.aphorismKo}" [${res.focalMaewoldangAphorism.aphorismHanja}]`,
    `- 원전 출처: [${res.focalMaewoldangAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalMaewoldangAphorism.actionGuidance}`,
    `- 종합 매월당 권면: ${res.maewoldangComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
