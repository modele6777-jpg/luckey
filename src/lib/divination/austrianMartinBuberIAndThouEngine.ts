/**
 * 오스트리아/유대 마틴 부버(Martin Buber) 《나와 너(Ich und Du)》 인격적 만남 & 진정한 대화(Dialogue)·상호 실존 지혜 엔진
 *
 * 20세기 실존철학과 대화 철학의 거장 마틴 부버(Martin Buber, 1878~1965)의 위대한 고전
 * 《나와 너(Ich und Du)》, 《대화론(Zwiesprache)》, 《인간의 문제(Das Problem des Menschen)》 원전 기반:
 * 1. 나와 너 인격적 공명도(I-Thou Relational Resonance Score): 상대를 지배나 조작의 수단으로 대하지 않고, 온 인격을 바쳐 마주하는 상호 주체적 존엄 지수.
 * 2. 진정한 대화 및 현존성 지표(Authentic Dialogue Presence Index): 독백과 기만, 타산적 계산을 벗어나 상대의 고유한 존재 앞에 온전히 열려 있는 실존적 현존도.
 * 3. 나-그것 도구주의 극복도(Overcoming Instrumentalization Score): 사물화, 기능주의, 타인을 편리한 도구로만 소비하는 소외의 굴레를 털어내는 해방 척도.
 * 4. 사이의 영역 거룩한 성찰도(Between-Sphere Meaning Index): 의미와 진리는 고립된 개인 안에 갇혀 있는 것이 아니라, 사람과 사람 사이(Das Zwischen)에서 탄생한다는 관계성.
 * 5. 영원한 너 교감 신뢰도(Eternal Thou Communion Trust Score): 삶의 모든 참된 만남의 지평 너머에 깃든 영원한 존재와의 궁극적 일체감과 영적 평정심.
 *
 * @version LUCKEY-MARTIN-BUBER-DIALOGUE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_MARTIN_BUBER_VERSION = 'LUCKEY-MARTIN-BUBER-DIALOGUE-v1.0.0';

export interface BuberTheme {
  themeKey: string;
  themeTitleDe: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface BuberAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismDe: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AustrianMartinBuberIAndThouResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 마틴 부버 대화철학 영적 지표 (0~100)
  iThouRelationalResonanceScore: number;     // 나와 너 인격적 공명도 (I-Thou Relational Resonance)
  authenticDialoguePresenceIndex: number;    // 진정한 대화 및 현존성 (Authentic Dialogue & Presence)
  overcomingInstrumentalizationScore: number;// 나-그것 도구주의 극복도 (Overcoming Instrumentalization)
  betweenSphereMeaningIndex: number;         // 사이의 영역 거룩한 성찰도 (Between-Sphere Meaning)
  eternalThouCommunionTrustScore: number;    // 영원한 너 교감 신뢰도 (Eternal Thou Communion Trust)
  // 세부 분석
  activeBuberTheme: BuberTheme;
  focalBuberAphorism: BuberAphorism;
  buberComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const BUBER_THEMES: BuberTheme[] = [
  {
    themeKey: 'iAndThouMeeting',
    themeTitleDe: 'Alles wirkliche Leben ist Begegnung',
    themeTitleKo: '모든 참된 삶은 온 인격적 만남이다',
    existentialInsight: '인간은 다른 사람을 대상이나 정보로 분석하는 고립된 관찰자가 아니라, 나와 너의 온전한 마주침 속에서만 참된 자기 자신이 됩니다.',
    practicalCounsel: '주변의 사람들을 능력이나 기능으로 평가하지 말고, 있는 그대로의 고유한 인격으로 마주하십시오. 온 마음으로 상대를 인정할 때 만남이 시작됩니다.',
  },
  {
    themeKey: 'authenticDialogue',
    themeTitleDe: 'Die echte Zwiesprache & Das Hinhören',
    themeTitleKo: '참된 대화와 가슴 깊은 경청의 예술',
    existentialInsight: '자기주장만을 앞세우는 가짜 대화나 독백을 멈추고, 상대의 침묵과 표정 속에 담긴 영혼의 목소리에 겸허하게 귀 기울일 때 벽이 허물어집니다.',
    practicalCounsel: '미리 대답을 준비하며 듣지 말고, 상대의 말이 끝날 때까지 온전한 주의를 집중하십시오. 당신의 열린 경청이 상대의 마음을 치유합니다.',
  },
  {
    themeKey: 'dasZwischenSphere',
    themeTitleDe: 'Das Reich des Zwischen & Schöpferische Beziehung',
    themeTitleKo: '나와 너 사이의 영역과 창조적 관계의 신비',
    existentialInsight: '사랑과 지혜는 나 혼자의 소유물이 아닙니다. 두 존재가 진솔하게 교감하는 바로 그 사이(Das Zwischen)에서 성스러운 의미가 창조됩니다.',
    practicalCounsel: '내 이익이나 상대의 반응에만 집착하지 말고, 우리 사이에 흐르는 신뢰와 온기의 공간을 정성스럽게 가꾸십시오.',
  },
  {
    themeKey: 'turningToTheThou',
    themeTitleDe: 'Die Umkehr zum Du & Befreiung vom Es',
    themeTitleKo: '도구주의(그것)를 넘어 인격주의(너)로의 회심',
    existentialInsight: '우리는 매일 효율과 유용성이라는 그것(Es)의 세계에 갇히기 쉽습니다. 그러나 가장 결정적인 순간에는 도구적 셈법을 내려놓고 인격의 품으로 회향해야 합니다.',
    practicalCounsel: '인간관계를 거래나 투자처럼 계산하고 있다면 즉시 멈추십시오. 조건 없이 신뢰를 건넬 때 진정한 유대감이 회복됩니다.',
  },
  {
    themeKey: 'theEternalThou',
    themeTitleDe: 'Das ewige Du & Die Linien der Beziehung',
    themeTitleKo: '모든 만남 속에 비치는 영원한 너의 빛',
    existentialInsight: '우리가 이 세상에서 경험하는 모든 정직하고 아름다운 만남의 연장선은 궁극적으로 만유의 근원인 영원한 너(신성)를 향해 뻗어 있습니다.',
    practicalCounsel: '작은 만남 하나, 일상의 대화 한 조각도 결코 사소하지 않습니다. 만남 속에 깃든 신성한 빛을 공경하는 마음으로 하루를 살아가십시오.',
  },
];

export const BUBER_APHORISMS: BuberAphorism[] = [
  {
    aphorismKey: 'realLifeMeeting',
    aphorismKo: '모든 참된 삶은 만남이다.',
    aphorismDe: 'Alles wirkliche Leben ist Begegnung.',
    sourceContext: '《나와 너(Ich und Du)》 제1부',
    actionGuidance: '혼자만의 생각과 고립된 방어막에서 걸어 나와, 오늘 당신 곁에 다가오는 사람과 온 마음으로 눈을 맞추고 진실하게 교류하십시오.',
  },
  {
    aphorismKey: 'manBecomesIThroughThou',
    aphorismKo: '인간은 너를 마주함으로써 비로소 참된 나(자아)가 된다.',
    aphorismDe: 'Der Mensch wird am Du zum Ich.',
    sourceContext: '《나와 너(Ich und Du)》 제1부',
    actionGuidance: '자기 자신만을 골몰히 응시하는 에고의 굴레에서 벗어나십시오. 타인을 깊이 이해하고 환대할 때 당신의 참된 정체성이 빛을 발합니다.',
  },
  {
    aphorismKey: 'wholeBeingWord',
    aphorismKo: '근본어 나-너는 오직 온 존재를 다 바쳐서만 말해질 수 있다.',
    aphorismDe: 'Das Grundwort Ich-Du kann nur mit dem ganzen Wesen gesprochen werden.',
    sourceContext: '《나와 너(Ich und Du)》 제1부',
    actionGuidance: '어설픈 요령이나 계산된 연기를 버리고, 매 순간 당신의 온 인격과 진정성을 다해 일과 사람 앞에 임하십시오.',
  },
  {
    aphorismKey: 'noObjectThou',
    aphorismKo: '너를 말하는 자는 그 어떤 사물도 대상으로 삼지 않는다. 너는 경계가 없으며, 나와 전인격으로 관계 맺는다.',
    aphorismDe: 'Wer Du spricht, hat kein Etwas zum Gegenstand. Denn wo Etwas ist, ist anderes Etwas; das Du grenzt an nichts.',
    sourceContext: '《나와 너(Ich und Du)》 제1부',
    actionGuidance: '타인을 규정하고 꼬리표 붙이려는 편견을 내려놓으십시오. 상대방의 무한한 가능성과 내면의 깊이를 경외하는 마음으로 대하십시오.',
  },
  {
    aphorismKey: 'turningToTheOther',
    aphorismKo: '대화적 삶의 본질은 서로가 서로에게 온전히 자신을 열어 보이고 상대의 고유성을 응답하는 데 있다.',
    aphorismDe: 'Das Wesen des dialogischen Lebens ist das Zuwenden zum andern.',
    sourceContext: '《대화론(Zwiesprache)》',
    actionGuidance: '마음의 문을 걸어 잠그지 마십시오. 당신의 취약함까지 솔직하게 드러낼 때 상대방도 진실한 화답으로 응답해 올 것입니다.',
  },
  {
    aphorismKey: 'eternalThouNeverIt',
    aphorismKo: '영원한 너는 본질적으로 그것이 될 수 없다. 언제나 마주해야 할 영원한 사랑과 신뢰의 근원이다.',
    aphorismDe: 'Das ewige Du kann wesensmäßig nicht zum Es werden.',
    sourceContext: '《나와 너(Ich und Du)》 제3부',
    actionGuidance: '삶의 시련이나 막막함 속에서도 세상이 무의미한 사물들의 집합이 아님을 기억하십시오. 당신을 부르고 계신 영원한 섭리를 신뢰하십시오.',
  },
];

export function calculateAustrianMartinBuberIAndThou(
  profile?: UserProfile,
  query?: string,
): AustrianMartinBuberIAndThouResult {
  const seedString = `${profile?.name ?? '남희'}_${profile?.birthday ?? '1967-08-25'}_${query ?? ''}_BUBER_ICH_DU`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const iThouRelationalResonanceScore = 77 + (absHash % 22);
  const authenticDialoguePresenceIndex = 75 + ((absHash >> 3) % 24);
  const overcomingInstrumentalizationScore = 76 + ((absHash >> 6) % 23);
  const betweenSphereMeaningIndex = 78 + ((absHash >> 9) % 21);
  const eternalThouCommunionTrustScore = 80 + ((absHash >> 12) % 19);

  const themeIndex = (absHash >> 4) % BUBER_THEMES.length;
  const aphorismIndex = (absHash >> 7) % BUBER_APHORISMS.length;

  const activeBuberTheme = BUBER_THEMES[themeIndex];
  const focalBuberAphorism = BUBER_APHORISMS[aphorismIndex];

  const guidanceTitle = `마틴 부버 나와 너 대화철학 지혜: ${activeBuberTheme.themeTitleKo}`;
  const philosophicalCounsel = `대화 철학의 거장 마틴 부버의 《나와 너》는 인간을 고립된 기능적 도구(Es)로 격하시키지 않고, 온 인격을 바쳐 상대를 목적으로 대우하는 거룩한 만남(Du)으로 이끕니다. ` +
    `현재 당신의 관계와 실존을 비추는 가장 결정적인 철학적 원리는 '${activeBuberTheme.themeTitleKo}'입니다. ` +
    `${activeBuberTheme.practicalCounsel} 아울러 부버의 불멸의 원전 명언 "${focalBuberAphorism.aphorismKo}"(${focalBuberAphorism.aphorismDe})를 마음에 새기며, ` +
    `${focalBuberAphorism.actionGuidance}`;

  return {
    engineVersion: AUSTRIAN_MARTIN_BUBER_VERSION,
    calculatedAtKst: new Date().toISOString(),
    iThouRelationalResonanceScore,
    authenticDialoguePresenceIndex,
    overcomingInstrumentalizationScore,
    betweenSphereMeaningIndex,
    eternalThouCommunionTrustScore,
    activeBuberTheme,
    focalBuberAphorism,
    buberComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAustrianMartinBuberIAndThouPrompt(
  res: AustrianMartinBuberIAndThouResult,
): string {
  return [
    `【마틴 부버 《나와 너》 인격적 만남 & 진정한 대화(Dialogue) 실존 지표】`,
    `- 나와 너 인격적 공명도(I-Thou Resonance): ${res.iThouRelationalResonanceScore}/100`,
    `- 진정한 대화 및 현존성(Authentic Dialogue & Presence): ${res.authenticDialoguePresenceIndex}/100`,
    `- 나-그것 도구주의 극복도(Overcoming Instrumentalization): ${res.overcomingInstrumentalizationScore}/100`,
    `- 사이의 영역 성찰도(Between-Sphere Meaning): ${res.betweenSphereMeaningIndex}/100`,
    `- 영원한 너 교감 신뢰도(Eternal Thou Trust): ${res.eternalThouCommunionTrustScore}/100`,
    `- 핵심 대화 테마: ${res.activeBuberTheme.themeTitleKo} [${res.activeBuberTheme.themeTitleDe}]`,
    `- 실존적 통찰: ${res.activeBuberTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeBuberTheme.practicalCounsel}`,
    `- 부버 원전 명언: "${res.focalBuberAphorism.aphorismKo}" [${res.focalBuberAphorism.aphorismDe}]`,
    `- 원전 출처: [${res.focalBuberAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalBuberAphorism.actionGuidance}`,
    `- 종합 부버 대화 권면: ${res.buberComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
