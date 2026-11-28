/**
 * 프랑스 빅토르 위고(Victor Hugo) 《레 미제라블》 & 《노트르담 드 파리》 자비와 구원 & 도덕적 양심·인도주의적 연대 지혜 엔진
 *
 * 19세기 프랑스 낭만주의 문학 및 인도주의적 사회비평의 거장 빅토르 위고(1802~1885)의 원전 기반:
 * 1. 미리엘 주교의 은촛대 자비와 영혼의 구원도 (Mercy & Redemption Grace Score): 처벌과 복수의 고리를 끊고 대자비와 용서로 영혼을 거듭나게 하는 은총의 힘.
 * 2. 장발장의 양심적 결단과 숭고한 도덕성 지표 (Moral Conscience & Sublime Dignity Index): 안락한 성공에 안주하지 않고 무고한 이를 위해 스스로를 내어주는 도덕적 양심.
 * 3. 핍박받는 자들을 향한 인도주의적 연대감 (Humanitarian Solidarity & Compassion Score): 가장 낮은 곳의 눈물과 비참함(Les Misérables)을 외면하지 않는 뜨거운 형제애.
 * 4. 낡은 법을 뛰어넘는 보편적 사랑과 천상의 정의 지수 (Cosmic Justice & Universal Love Index): 맹목적 형식주의 율법을 넘어 인간을 살리는 사랑과 정의의 조화.
 * 5. 폭풍과 운명의 파도를 헤쳐 나가는 불굴의 영웅적 회복탄력성 (Indomitable Will & Heroic Resilience Score): 가혹한 시련과 역경 속에서도 인간의 존엄을 지키며 묵묵히 전진하는 힘.
 *
 * @version LUCKEY-VICTOR-HUGO-LES-MISERABLES-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_VICTOR_HUGO_LES_MISERABLES_VERSION = 'LUCKEY-VICTOR-HUGO-LES-MISERABLES-v2.6.0';

export interface HugoTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  humanitarianInsight: string;
  practicalCounsel: string;
}

export interface HugoAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchVictorHugoLesMiserablesResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 빅토르 위고 핵심 지표 (0~100)
  mercyAndRedemptionScore: number;                      // 미리엘 주교의 자비와 구원도 (Mercy & Redemption Grace)
  moralConscienceDignityIndex: number;                  // 양심적 결단과 숭고한 도덕성 지표 (Moral Conscience & Dignity)
  humanitarianSolidarityScore: number;                  // 인도주의적 연대감 (Humanitarian Solidarity)
  cosmicJusticeIdealIndex: number;                      // 보편적 사랑과 천상의 정의 지수 (Cosmic Justice & Love)
  indomitableHeroicResilience: number;                  // 불굴의 영웅적 회복탄력성 (Indomitable Heroic Resilience)
  // 세부 분석
  activeHugoTheme: HugoTheme;
  focalHugoAphorism: HugoAphorism;
  hugoComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  hugoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  hugoCrossAxis: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export const HUGO_THEMES: HugoTheme[] = [
  {
    themeKey: 'bishopCandlesticks',
    themeTitleEn: 'Bishop Myriel\'s Candlesticks: Redeeming the Wounded Soul through Unconditional Grace',
    themeTitleKo: '미리엘 주교의 은촛대 — 차가운 응징을 넘어 대자비와 용서로 영혼을 구원하기',
    humanitarianInsight: '빅토르 위고의 《레 미제라블》에서 장발장을 변화시킨 것은 가혹한 감옥의 징벌이 아니라, 도둑맞은 은촛대마저 내어주며 영혼을 사들인 미리엘 주교의 조건 없는 자비였습니다.',
    practicalCounsel: '상대의 실수나 과거의 상처에 칼날을 들이대지 마십시오. 분노와 보복의 충동을 내려놓고 은촛대를 건네듯 너그러운 용서와 온기를 베푸십시오. 그 자비가 상대뿐 아니라 당신의 운명을 구합니다.',
  },
  {
    themeKey: 'whoAmI',
    themeTitleEn: 'Who Am I? (Qui suis-je?): The Triumph of Moral Conscience Over Convenient Silence',
    themeTitleKo: '나는 누구인가? — 편리한 침묵과 안주를 거부하고 양심의 부름 앞에 당당히 서기',
    humanitarianInsight: '마들렌 시장으로서의 성공과 평온한 지위를 버리고, 억울하게 잡힌 다른 이를 구하기 위해 법정에서 "내가 장발장이다"라고 선언하는 위고의 주인공은 인간 도덕성의 가장 숭고한 정점을 보여줍니다.',
    practicalCounsel: '비겁한 타협이나 손익 계산 뒤에 숨지 마십시오. 양심이 가리키는 정의와 진실의 편에 용기 있게 서십시오. 눈앞의 손해처럼 보이는 정직한 결단이 결국 당신의 삶을 가장 고귀하게 빛냅니다.',
  },
  {
    themeKey: 'lesMiserablesSolidarity',
    themeTitleEn: 'Solidarity with the Wretched: Compassion Reaching Into the Depths of Human Suffering',
    themeTitleKo: '가장 낮은 곳을 향한 인도주의 — 고통받는 이웃과 손잡고 희망의 새벽을 열어가기',
    humanitarianInsight: '팡틴, 코제트, 가브로슈 등 소외되고 버림받은 이들을 향한 위고의 시선은 단순한 동정이 아닙니다. 사회적 모순의 어둠 속에서도 끝내 꺼지지 않는 인간애의 불꽃이자 거룩한 연대입니다.',
    practicalCounsel: '혼자만의 풍요에 만족하지 말고 주변의 그늘진 곳에 온정을 나누십시오. 나보다 힘겨운 처지의 사람들에게 따스한 손길과 격려를 건넬 때, 당신의 공동체와 삶의 터전이 진정으로 비옥해집니다.',
  },
  {
    themeKey: 'indomitableWill',
    themeTitleEn: 'The Indomitable Will: Forging Ahead Through the Savage Tempest of Destiny',
    themeTitleKo: '바다의 노동자와 불굴의 의지 — 거친 운명의 소용돌이 속에서도 굴하지 않는 영웅적 기개',
    humanitarianInsight: '위고의 소설 속 주인공들은 거대한 자연과 사회적 편견의 폭풍 속에서도 결코 물러서지 않고 묵묵히 배를 저어 나갑니다. 고난은 인간의 영혼을 부수는 것이 아니라 더욱 단단하게 벼려냅니다.',
    practicalCounsel: '지금 닥친 시련이 거대한 벽처럼 느껴지더라도 물러서지 마십시오. 한 걸음 한 걸음 묵묵히 노를 저어 가십시오. 시련을 뚫고 지나온 당신의 내면에는 그 무엇도 무너뜨릴 수 없는 거인의 힘이 자리 잡을 것입니다.',
  },
];

export const HUGO_APHORISMS: HugoAphorism[] = [
  {
    aphorismKey: 'boughtYourSoul',
    aphorismKo: '나의 형제여, 당신은 이제 악이 아니라 선에 속합니다. 내가 당신의 영혼을 샀습니다.',
    aphorismFrench: "Mon frère, vous n'appartenez plus au mal, mais au bien. C'est votre âme que je vous achète.",
    sourceContext: '《레 미제라블(Les Misérables)》, 1862',
    actionGuidance: '과거의 과오와 자책감의 사슬을 끊어내십시오. 당신은 선한 삶과 고귀한 가치를 실현하기 위해 새롭게 태어난 존재입니다.',
  },
  {
    aphorismKey: 'seeFaceOfGod',
    aphorismKo: '다른 누군가를 진심으로 사랑한다는 것은 하느님의 얼굴을 보는 것이다.',
    aphorismFrench: "Aimer, c'est voir le visage de Dieu.",
    sourceContext: '《레 미제라블(Les Misérables)》, 1862',
    actionGuidance: '사랑과 자비의 실천을 모든 행동의 중심에 두십시오. 타인을 온 마음으로 아끼고 섬기는 순간 거룩한 평화가 깃듭니다.',
  },
  {
    aphorismKey: 'ideaWhoseTimeHasCome',
    aphorismKo: '어떤 군대의 침략도 때가 무르익은 사상의 전진을 막을 수는 없다.',
    aphorismFrench: "On résiste à l'invasion des armées; on ne résiste pas à l'invasion des idées.",
    sourceContext: '《한 범죄의 역사(Histoire d\'un crime)》, 1877',
    actionGuidance: '시대의 흐름과 올바른 가치를 신뢰하십시오. 진실과 정의에 기반한 당신의 아이디어와 실천은 마침내 현실의 장벽을 돌파할 것입니다.',
  },
  {
    aphorismKey: 'darkestBeforeDawn',
    aphorismKo: '가장 어두운 밤이 지나야 새벽이 오며, 슬픔의 눈물은 미래의 기쁨을 잉태하는 씨앗이다.',
    aphorismFrench: "La nuit est plus sombre avant l'aurore, et les larmes sont des graines de joie future.",
    sourceContext: '《레 미제라블(Les Misérables)》, 1862',
    actionGuidance: '지금의 고통과 인내를 헛되이 여기지 마십시오. 어둠이 짙을수록 빛나는 새벽이 곧 다가오고 있습니다. 희망을 굳게 붙드십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function formatHugoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function describeHugoStage(score: number): string {
  if (score >= 95) return '숭고한 구원기 (자비와 양심적 결단이 온전히 빛나는 흐름)';
  if (score >= 91) return '강인한 연대기 (고통 속에서도 존엄과 연대를 붙드는 흐름)';
  return '묵묵한 인내기 (어두운 밤을 건너 새벽의 빛을 준비하는 흐름)';
}

export function calculateFrenchVictorHugoLesMiserables(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchVictorHugoLesMiserablesResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `VICTOR-HUGO-LES-MISERABLES:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const mercyAndRedemptionScore = 90 + ((absHash >> 1) % 9);
  const moralConscienceDignityIndex = 89 + ((absHash >> 4) % 10);
  const humanitarianSolidarityScore = 88 + ((absHash >> 7) % 11);
  const cosmicJusticeIdealIndex = 89 + ((absHash >> 10) % 10);
  const indomitableHeroicResilience = 90 + ((absHash >> 13) % 9);

  const themeIndex = (absHash >> 5) % HUGO_THEMES.length;
  const aphorismIndex = (absHash >> 8) % HUGO_APHORISMS.length;

  const activeHugoTheme = HUGO_THEMES[themeIndex];
  const focalHugoAphorism = HUGO_APHORISMS[aphorismIndex];

  const guidanceTitle = `빅토르 위고 자비와 양심의 지혜: ${activeHugoTheme.themeTitleKo}`;
  const philosophicalCounsel = `19세기 프랑스 낭만주의 문학의 거장 빅토르 위고 선생은 《레 미제라블》을 통해 ` +
    `어둠을 녹여내는 미리엘 주교의 대자비와 은총, 안락한 침묵을 깨고 진실을 증언하는 숭고한 도덕적 양심, ` +
    `그리고 핍박받는 가장 낮은 자들을 향한 인도주의적 사랑과 불굴의 영웅적 회복탄력성을 보여주었습니다. ` +
    `지금 당신에게 가장 필요한 실천적 나침반은 '${activeHugoTheme.themeTitleKo}'입니다. ` +
    `${activeHugoTheme.practicalCounsel} 위고의 명언 "${focalHugoAphorism.aphorismKo}" (${focalHugoAphorism.aphorismFrench})을 마음에 새기고, ` +
    `${focalHugoAphorism.actionGuidance}`;

  const hugoSynthesisMatrix = {
    dominantTension: `${activeHugoTheme.themeTitleKo} ↔ ${focalHugoAphorism.sourceContext}`,
    alignmentState:
      mercyAndRedemptionScore >= 94 && moralConscienceDignityIndex >= 94
        ? '자비와 도덕적 양심의 숭고한 공명'
        : '어둠을 건너 연대와 용기로 나아가는 국면',
    integratedAction: `${activeHugoTheme.practicalCounsel} (${focalHugoAphorism.actionGuidance})`,
  };

  const calculatedAtKst = formatHugoKstTimestamp(now);
  const hugoCrossAxis = `[${activeHugoTheme.themeKey}] × [${focalHugoAphorism.aphorismKey}] × [${hugoSynthesisMatrix.alignmentState}] × [${calculatedAtKst.slice(11, 16)}]`;

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `"${trimmedQuery}"라는 갈림길에서 '${activeHugoTheme.themeTitleKo}'의 자비와 양심으로 응답한다면, 편리한 침묵 대신 오늘 내가 기꺼이 붙들고 건넬 한 걸음은 무엇인가요?`
    : `'${activeHugoTheme.themeTitleKo}'의 마음으로 돌아볼 때, 오늘 자비와 양심의 편에 서서 건네고 싶은 가장 따뜻한 용기는 무엇인가요?`;

  return {
    engineVersion: FRENCH_VICTOR_HUGO_LES_MISERABLES_VERSION,
    calculatedAtKst,
    mercyAndRedemptionScore,
    moralConscienceDignityIndex,
    humanitarianSolidarityScore,
    cosmicJusticeIdealIndex,
    indomitableHeroicResilience,
    activeHugoTheme,
    focalHugoAphorism,
    hugoComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    hugoSynthesisMatrix,
    hugoCrossAxis,
    ritualAction: focalHugoAphorism.actionGuidance,
    reflectionFocus: activeHugoTheme.practicalCounsel,
    reflectiveQuestion,
    interpretiveBoundary: '빅토르 위고의 자비·도덕적 양심·연대 상징을 빌린 정성적 성찰 관점이며, 개인 점수나 미래 단정이 아닙니다.',
  };
}

export function formatFrenchVictorHugoLesMiserablesPrompt(
  res: FrenchVictorHugoLesMiserablesResult,
): string {
  const lines = [
    `【빅토르 위고 《레 미제라블》 자비와 도덕적 양심·인도주의 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 미리엘 주교의 자비와 구원도(Mercy & Redemption Grace): ${describeHugoStage(res.mercyAndRedemptionScore)}`,
    `- 양심적 결단과 숭고한 도덕성 지표(Moral Conscience & Dignity): ${describeHugoStage(res.moralConscienceDignityIndex)}`,
    `- 인도주의적 연대감(Humanitarian Solidarity): ${describeHugoStage(res.humanitarianSolidarityScore)}`,
    `- 보편적 사랑과 천상의 정의 지수(Cosmic Justice & Love): ${describeHugoStage(res.cosmicJusticeIdealIndex)}`,
    `- 불굴의 영웅적 회복탄력성(Indomitable Heroic Resilience): ${describeHugoStage(res.indomitableHeroicResilience)}`,
    `- 핵심 위고 테마: ${res.activeHugoTheme.themeTitleKo} [${res.activeHugoTheme.themeTitleEn}]`,
    `- 인도주의적 통찰: ${res.activeHugoTheme.humanitarianInsight}`,
    `- 행동 조언: ${res.activeHugoTheme.practicalCounsel}`,
    `- 위고 원전 테제: "${res.focalHugoAphorism.aphorismKo}" (${res.focalHugoAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalHugoAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHugoAphorism.actionGuidance}`,
    `- 종합 위고 권면: ${res.hugoComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.hugoSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.hugoSynthesisMatrix.dominantTension} | 조율 상태: ${res.hugoSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.hugoSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 4중 교차 축: ${res.hugoCrossAxis}`);
  lines.push(`- 성찰 초점: ${res.reflectionFocus}`);
  lines.push(`- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`);
  lines.push(`- 해석 경계: 빅토르 위고의 자비·도덕적 양심·연대 상징을 빌린 정성적 성찰 관점이며, 개인 점수나 미래 단정이 아닙니다.`);
  return lines.join('\n');
}
