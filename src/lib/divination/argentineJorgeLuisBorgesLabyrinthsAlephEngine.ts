/**
 * 아르헨티나 호르헤 루이스 보르헤스(Jorge Luis Borges) 《픽션들》·《알레프》·《바벨의 도서관》 미로(Laberinto)·무한 시간 및 알레프 직관 지혜 엔진
 *
 * 20세기 세계 문학의 거장이자 환상 문학·형이상학적 사유의 독보적 지성 호르헤 루이스 보르헤스(1899~1986)의 원전 기반:
 * 1. 모든 우주가 한 점에 응축된 알레프 직관도 (Aleph Cosmic Point Intuition Score): 온 우주의 공간과 사건, 과거와 미래가 단 하나의 작은 점에서 일시에 눈부시게 펼쳐지는 총체적 직관력.
 * 2. 갈래길의 미로 지적 탐색·유희 지수 (Forking Paths Labyrinth Intellectual Play Index): 닫힌 일방통행의 도그마를 넘어 무한히 갈라지는 시간과 가능성의 정원을 자유롭게 유영하는 고도의 지적 유연성.
 * 3. 바벨의 도서관 형이상학적 탐구심 지표 (Babel Library Metaphysical Truth Quest Score): 무수한 문자와 책들의 미로 속에서도 우주의 질서와 영혼의 정당성을 밝혀줄 단 한 줄의 진리를 끝없이 찾아 나서는 숭고한 구도심.
 * 4. 시간의 원형적 순환과 불멸 거울 관조 지수 (Infinite Time Mirror & Immortality Reflection Index): 유한한 순간의 상실에 연연하지 않고, 영겁의 순환과 원형 속에서 삶의 깊은 의미를 비추어 보는 초시간적 통찰.
 * 5. 시각을 넘어 영혼의 빛으로 유영하는 초연한 회복탄력성 (Inner Light Vision & Transcendent Resilience Score): 육체의 눈이 어두워진 뒤에도 상상력과 기억의 별자리로 무한한 우주의 신비를 읽어낸 불굴의 영적 평정심과 회복탄력성.
 *
 * @version LUCKEY-BORGES-LABYRINTHS-ALEPH-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const ARGENTINE_JORGE_LUIS_BORGES_LABYRINTHS_ALEPH_VERSION = 'LUCKEY-BORGES-LABYRINTHS-ALEPH-v1.0.0';

export interface BorgesTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface BorgesAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginal: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface ArgentineJorgeLuisBorgesLabyrinthsAlephResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 보르헤스 핵심 지표 (0~100)
  alephCosmicIntuitionScore: number;                      // 알레프 우주 직관도
  labyrinthIntellectualPlayIndex: number;                  // 갈래길 미로 지적 유희 지수
  babelLibraryTruthQuestScore: number;                     // 바벨 도서관 진리 탐구심 지표
  infiniteTimeMirrorReflectionIndex: number;               // 무한 시간 거울 관조 지수
  innerLightVisionResilienceScore: number;                 // 내면의 빛 초연한 회복탄력성
  // 세부 분석
  activeBorgesTheme: BorgesTheme;
  focalBorgesAphorism: BorgesAphorism;
  borgesComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const BORGES_THEMES: BorgesTheme[] = [
  {
    themeKey: 'alephVision',
    themeTitleEn: 'The Aleph: Cosmic Simultaneity and Total Perception in a Single Point',
    themeTitleKo: '알레프의 직관 — 온 우주의 진실이 하나의 작은 점에 응축되어 빛나는 총체적 개안',
    literaryInsight: '보르헤스는 단편 《알레프》에서 지하실 계단 밑 직경 2센티미터의 작은 점에서 온 우주의 모든 장소, 모든 바다와 여명, 모든 인간의 기쁨과 슬픔이 겹침 없이 동시에 비추어지는 신비를 묘사했습니다. 작은 찰나 속에도 무한한 전체가 깃들어 있습니다.',
    practicalCounsel: '지엽적인 단편이나 당면한 작은 걱정에 갇혀 시야를 좁히지 마십시오. 당신이 마주한 지금 이 순간의 작은 선택 속에 온 생애의 축도와 우주적 인연이 깃들어 있음을 직관하고 더 넓고 담대한 눈으로 판세를 조망하십시오.',
  },
  {
    themeKey: 'forkingPaths',
    themeTitleEn: 'Garden of Forking Paths: Embracing Infinite Possibilities and Parallel Times',
    themeTitleKo: '갈래길의 정원 — 단 하나의 정답에 갇히지 않고 무한한 가능성의 시간을 향유하기',
    literaryInsight: '《두 갈래로 갈라지는 길들의 정원》에서 시간은 하나의 직선이 아니라 무수히 갈라지고 합쳐지는 거대한 그물망입니다. 한 번의 선택이 다른 가능성을 영원히 없애는 것이 아니라, 수많은 평행한 차원에서 서로 공명하며 새로운 의미를 직조합니다.',
    practicalCounsel: '과거의 한 가지 선택을 후회하거나, 오직 하나의 길만이 옳다는 편협한 완벽주의에 얽매이지 마십시오. 삶의 모든 전환점은 새로운 가능성의 문이며, 유연하고 열린 지성으로 미로를 탐험할 때 뜻밖의 가장 찬란한 해결책이 열립니다.',
  },
  {
    themeKey: 'babelLibrary',
    themeTitleEn: 'Library of Babel: Tireless Quest for Order and Meaning in Apparent Chaos',
    themeTitleKo: '바벨의 도서관 — 혼란과 소음 속에서도 중심을 잡고 본질적인 의미의 책 찾아내기',
    literaryInsight: '《바벨의 도서관》은 무한한 육각형 회랑과 알파벳 조합으로 가득 찬 책들의 세계입니다. 대부분이 의미 없는 철자의 나열처럼 보이지만, 도서관 어딘가에는 우주의 완벽한 해답을 담은 책이 존재합니다. 탐구자는 방대한 소음에 압도당하지 않고 묵묵히 본질을 향해 걸어갑니다.',
    practicalCounsel: '세상의 넘쳐나는 정보와 소음, 타인들의 상반된 주장에 마음을 빼앗기지 마십시오. 당신의 삶에 정말로 의미 있는 정수만을 차분히 가려내고, 당신 영혼의 중심을 단단히 붙잡아 줄 단 하나의 확고한 원칙을 세우십시오.',
  },
  {
    themeKey: 'innerLightBlindness',
    themeTitleEn: 'Inner Citadel of Memory and Dreams: Transcendence Over Physical Limitations',
    themeTitleKo: '내면의 별자리 — 신체적 한계와 어둠을 딛고 영혼의 지혜로 우주를 항해하기',
    literaryInsight: '국립도서관장이 되던 해에 완전한 시력을 잃은 보르헤스는 절망하는 대신 "신은 내게 80만 권의 책과 어둠을 동시에 주셨다"며 특유의 고결한 해학으로 받아들였습니다. 그는 눈 대신 기억과 사유의 날개로 인류 역사상 가장 빛나는 상상력의 우주를 구축했습니다.',
    practicalCounsel: '환경적 제약이나 불리한 신체적·물질적 조건에 좌절하지 마십시오. 외부의 빛이 가려질 때 비로소 내면의 깊은 통찰과 영혼의 상상력이 가장 선명하게 타오릅니다. 당신의 결핍을 위대한 지적 깊이와 회복탄력성의 도약대로 삼으십시오.',
  },
];

export const BORGES_APHORISMS: BorgesAphorism[] = [
  {
    aphorismKey: 'alephTotalVisionQuote',
    aphorismKo: '나는 알레프를 보았다. 모든 각도에서 지구를 보았고, 지구 속에서 다시 알레프를 보았다. 그리고 알레프 속에서 지구를 보았다. 나는 나의 얼굴과 나의 내장을 보았고, 너의 얼굴을 보았다. 그리고 나는 현기증을 느끼며 울었다.',
    aphorismOriginal: 'Vi el Aleph, desde todos los puntos, vi en el Aleph la tierra, y en la tierra otra vez el Aleph y en el Aleph la tierra, vi mi cara y mis vísceras, vi tu cara, y sentí vértigo y lloré.',
    sourceContext: '《알레프(El Aleph)》 (1949)',
    actionGuidance: '개인의 협소한 에고를 넘어, 만물이 서로 연결되어 숨 쉬는 거대한 우주적 상호 공명을 가슴 깊이 깨달으십시오.',
  },
  {
    aphorismKey: 'booksAndNightQuote',
    aphorismKo: '그 누구도 눈물이나 비난으로 폄하하지 말기를, 절묘한 아이러니로 내게 책과 밤을 동시에 주신 하나님의 그 장엄한 솜씨를.',
    aphorismOriginal: 'Nadie rebaje a lágrima o reproche esta declaración de la maestría de Dios, que con magnífica ironía me dio a la vez los libros y la noche.',
    sourceContext: '시 〈선물의 시(Poema de los dones)〉',
    actionGuidance: '주어진 시련과 결핍을 비탄 대신 삶의 깊은 역설적 선물로 수용하고, 내면의 숭고한 지혜로 승화시키십시오.',
  },
  {
    aphorismKey: 'forkingTimeQuote',
    aphorismKo: '시간은 영원히 다른 미래들을 향해 갈라져 나간다. 그 갈래길 중 하나에서 나는 당신의 적이다.',
    aphorismOriginal: 'El tiempo se bifurca perpetuamente hacia innumerables futuros. En uno de ellos soy su enemigo.',
    sourceContext: '《두 갈래로 갈라지는 길들의 정원(El jardín de senderos que se bifurcan)》',
    actionGuidance: '눈앞의 단 하나의 현실에만 매이지 말고, 언제든 새로운 가능성으로 갈라질 수 있는 삶의 풍요로운 갈래길을 능동적으로 개척하십시오.',
  },
  {
    aphorismKey: 'paradiseLibraryQuote',
    aphorismKo: '나는 언제나 낙원이 일종의 도서관일 것이라고 상상해 왔다.',
    aphorismOriginal: 'Siempre imaginé que el Paraíso sería algún tipo de biblioteca.',
    sourceContext: '시 〈선물의 시(Poema de los dones)〉 사색',
    actionGuidance: '세속의 소모적인 탐욕에서 벗어나, 영혼을 살찌우는 맑은 지식과 사색의 고요함을 삶의 가장 소중한 낙원으로 가꾸십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export function calculateArgentineJorgeLuisBorgesLabyrinthsAleph(
  profile?: UserProfile,
  query?: string,
): ArgentineJorgeLuisBorgesLabyrinthsAlephResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `BORGES-LABYRINTHS-ALEPH:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const alephCosmicIntuitionScore = 92 + ((absHash >> 1) % 7);
  const labyrinthIntellectualPlayIndex = 90 + ((absHash >> 4) % 9);
  const babelLibraryTruthQuestScore = 89 + ((absHash >> 7) % 10);
  const infiniteTimeMirrorReflectionIndex = 91 + ((absHash >> 10) % 8);
  const innerLightVisionResilienceScore = 93 + ((absHash >> 13) % 6);

  const themeIndex = (absHash >> 5) % BORGES_THEMES.length;
  const aphorismIndex = (absHash >> 8) % BORGES_APHORISMS.length;

  const activeBorgesTheme = BORGES_THEMES[themeIndex];
  const focalBorgesAphorism = BORGES_APHORISMS[aphorismIndex];

  const guidanceTitle = `호르헤 루이스 보르헤스 미로와 알레프의 형이상학적 직관: ${activeBorgesTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 환상 문학의 거장 호르헤 루이스 보르헤스 선생은 《알레프》와 《픽션들》을 통해 ` +
    `온 우주의 모든 장소와 시간이 하나의 작은 점에서 일시에 빛나는 알레프의 총체적 직관, 무한히 갈라지는 시간의 정원을 유영하는 지적 유연성, ` +
    `바벨의 도서관 소음 속에서도 중심을 잃지 않는 진리 탐구심, 그리고 시력을 잃은 뒤에도 영혼의 빛으로 우주를 조망한 불굴의 초연함을 가르쳤습니다. ` +
    `지금 당신의 국면에 가장 필요한 지혜는 '${activeBorgesTheme.themeTitleKo}'입니다. ` +
    `${activeBorgesTheme.practicalCounsel} 보르헤스 선생의 원전 격언 "${focalBorgesAphorism.aphorismKo}"을 마음에 새기고, ` +
    `${focalBorgesAphorism.actionGuidance}`;

  return {
    engineVersion: ARGENTINE_JORGE_LUIS_BORGES_LABYRINTHS_ALEPH_VERSION,
    calculatedAtKst: new Date().toISOString(),
    alephCosmicIntuitionScore,
    labyrinthIntellectualPlayIndex,
    babelLibraryTruthQuestScore,
    infiniteTimeMirrorReflectionIndex,
    innerLightVisionResilienceScore,
    activeBorgesTheme,
    focalBorgesAphorism,
    borgesComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatArgentineJorgeLuisBorgesLabyrinthsAlephPrompt(
  res: ArgentineJorgeLuisBorgesLabyrinthsAlephResult,
): string {
  return [
    `【호르헤 루이스 보르헤스 《픽션들·알레프》 미로·무한 시간 및 알레프 직관 지표】`,
    `- 온 우주 응축 알레프 직관도(Aleph Cosmic Intuition): ${res.alephCosmicIntuitionScore}/100`,
    `- 갈래길 미로 지적 탐색·유희 지수(Forking Paths Labyrinth Play): ${res.labyrinthIntellectualPlayIndex}/100`,
    `- 바벨 도서관 형이상학적 탐구심(Babel Library Truth Quest): ${res.babelLibraryTruthQuestScore}/100`,
    `- 무한 시간 거울 관조 지수(Infinite Time Mirror Reflection): ${res.infiniteTimeMirrorReflectionIndex}/100`,
    `- 내면의 빛 초연한 회복탄력성(Inner Light Vision Resilience): ${res.innerLightVisionResilienceScore}/100`,
    `- 핵심 보르헤스 테마: ${res.activeBorgesTheme.themeTitleKo} [${res.activeBorgesTheme.themeTitleEn}]`,
    `- 문학적 사색: ${res.activeBorgesTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeBorgesTheme.practicalCounsel}`,
    `- 보르헤스 원전 명문: "${res.focalBorgesAphorism.aphorismKo}"`,
    `- 원문: (${res.focalBorgesAphorism.aphorismOriginal})`,
    `- 원전 출처: [${res.focalBorgesAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalBorgesAphorism.actionGuidance}`,
    `- 종합 보르헤스 권면: ${res.borgesComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
