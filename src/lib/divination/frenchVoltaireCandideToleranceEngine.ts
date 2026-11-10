/**
 * 프랑스 볼테르(Voltaire) 《캉디드(Candide)》 & 《관용론(Traité sur la tolérance)》 일상 실천 & 관용 지혜 엔진
 *
 * 프랑스 계몽주의의 위대한 지성이자 문호 볼테르(François-Marie Arouet, Voltaire, 1694~1778)의 불후의 명작
 * 《캉디드(Candide, 1759)》, 《관용론(Traité sur la tolérance, 1763)》, 《철학 사전(Dictionnaire philosophique)》 원전 기반:
 * 1. "우리의 밭을 일구어야 한다(Il faut cultiver notre jardin)" 일상적 노동과 성실한 실천 지수(Cultivate Our Garden Pragmatic Devotion Score): 공리공론을 멈추고 삶을 일구는 실천.
 * 2. 독단·광신·편견을 극복하는 관용 및 열린 지성 지표(Tolerance & Enlightened Reason Index): 차이를 포용하고 맹신을 깨뜨리는 합리적 이성.
 * 3. 위선과 부조리를 꿰뚫는 명석한 기지와 유머·회복탄력성(Wit & Satirical Piercing Insight Score): 어둠 속에서도 위트와 풍자로 중심을 지키는 혜안.
 * 4. 억울한 약자를 구명하고 진실을 밝히는 실천적 양심 및 정의 구현도(Justice Advocacy & Conscience Score): 카라스 사건 구명처럼 불의에 맞서 진실을 밝히는 용기.
 * 5. 헛된 관념론을 탈피하고 현실을 직시하는 분별력(Realistic Disillusionment & Clarity Index): 뜬구름 잡는 낙관론을 넘어 객관적 현실을 마주하는 힘.
 *
 * @version LUCKEY-VOLTAIRE-CANDIDE-TOLERANCE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_VOLTAIRE_CANDIDE_TOLERANCE_VERSION = 'LUCKEY-VOLTAIRE-CANDIDE-TOLERANCE-v1.0.0';

export interface VoltaireTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface VoltaireAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchVoltaireCandideToleranceResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 볼테르 계몽·실천 지표 (0~100)
  cultivateOurGardenPragmaticDevotionScore: number; // 밭을 일구는 일상 실천 지수 (Cultivate Our Garden Pragmatic Devotion)
  toleranceEnlightenedReasonIndex: number;          // 관용 및 열린 지성 지표 (Tolerance & Enlightened Reason)
  witSatiricalPiercingInsightScore: number;         // 위선 타파 기지 및 유머 회복탄력성 (Wit & Satirical Piercing Insight)
  justiceAdvocacyConscienceScore: number;           // 실천적 양심 및 정의 구현도 (Justice Advocacy & Conscience)
  realisticDisillusionmentClarityIndex: number;     // 현실 직시 및 분별력 지수 (Realistic Disillusionment & Clarity)
  // 세부 분석
  activeVoltaireTheme: VoltaireTheme;
  focalVoltaireAphorism: VoltaireAphorism;
  voltaireComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const VOLTAIRE_THEMES: VoltaireTheme[] = [
  {
    themeKey: 'cultiverNotreJardin',
    themeTitleEn: 'Cultivating Our Own Garden',
    themeTitleKo: '"우리의 밭을 일구어야 한다" — 공리공론을 넘어선 일상적 노동과 성실한 실천',
    pragmaticInsight: '세상의 불합리와 거대한 모순에 매몰되어 뜬구름 잡는 사변에 빠지는 것은 무력감만 낳습니다. 지금 내 손이 닿는 작고 구체적인 일상과 과업을 성실히 가꾸는 것이 진정한 구원입니다.',
    practicalCounsel: '통제할 수 없는 거대한 혼란에 집착하지 마십시오. 오늘 내가 마주한 일터와 가정, 당면한 한 가지 일에 집중하여 정성껏 밭을 갈듯 실질적인 결과물을 빚어내십시오.',
  },
  {
    themeKey: 'toleranceOverFanaticism',
    themeTitleEn: 'Universal Tolerance & Liberty of Thought',
    themeTitleKo: '"관용은 인류의 가장 고귀한 선물이다" — 편협과 독단을 허무는 열린 이성',
    pragmaticInsight: '자신만의 신념을 절대화하여 타인을 배척하는 광신은 갈등의 주범입니다. 서로 다른 견해를 인정하고 귀 기울일 때 비로소 진정한 평화와 번영이 깃듭니다.',
    practicalCounsel: '나와 다른 생각이나 예상치 못한 반대 의견을 마주할 때 감정적으로 맞서지 마십시오. 관용의 태도로 상대의 관점을 경청하고, 합리적인 대화를 통해 공존의 해법을 찾으십시오.',
  },
  {
    themeKey: 'satiricalWitResilience',
    themeTitleEn: 'Satirical Wit & Piercing Lucidity',
    themeTitleKo: '"위트와 웃음으로 위선을 꿰뚫어라" — 어둠과 허세를 허무는 명철한 유머와 기지',
    pragmaticInsight: '엄숙함 뒤에 숨은 위선과 과장은 날카롭고 유쾌한 유머 앞에서는 힘을 잃습니다. 무거운 심각성에 짓눌리지 않고 상황을 한 발짝 떨어져 조망하는 위트가 최고의 방패입니다.',
    practicalCounsel: '문제를 지나치게 심각하고 비극적으로 받아들이지 마십시오. 맑은 지성과 가벼운 유머 감각을 발휘하여 모순의 실체를 꿰뚫고, 마음의 여유를 잃지 않고 난관을 돌파하십시오.',
  },
  {
    themeKey: 'courageousJusticeAdvocacy',
    themeTitleEn: 'Passionate Advocacy for Justice & Truth',
    themeTitleKo: '"진실 앞의 침묵은 공범이다" — 부조리에 맞서 약자를 옹호하는 실천적 정의감',
    pragmaticInsight: '편견에 의해 억울하게 고통받는 이들을 방관하지 않고 당당하게 진실의 목소리를 내는 용기가 세상을 바꿉니다. 진정한 지성은 펜을 들어 정의를 행동으로 옮기는 데 있습니다.',
    practicalCounsel: '주변의 불합리한 처사나 오해로 인해 억울한 입장에 처한 동료가 있다면 모른 척하지 마십시오. 냉철한 사실 확인과 명확한 논리로 진실을 변호하고 공정한 기준을 세우십시오.',
  },
];

export const VOLTAIRE_APHORISMS: VoltaireAphorism[] = [
  {
    aphorismKey: 'cultiverJardin',
    aphorismKo: '우리는 우리의 밭을 일구어야 합니다.',
    aphorismEn: 'We must cultivate our garden (Il faut cultiver notre jardin).',
    sourceContext: '철학소설 《캉디드(Candide)》 최종장 결어',
    actionGuidance: '탁상공론과 헛된 불안을 내려놓고, 지금 당장 내 손으로 개선할 수 있는 구체적인 일에 몰입하여 결실을 맺으십시오.',
  },
  {
    aphorismKey: 'defendRightToSpeak',
    aphorismKo: '나는 당신의 견해에 동의하지 않지만, 당신이 그 견해를 말할 권리를 위해서라면 끝까지 싸울 것입니다.',
    aphorismEn: 'I disapprove of what you say, but I will defend to the death your right to say it.',
    sourceContext: '볼테르의 사상을 집약한 《관용론(Traité sur la tolérance)》 정신',
    actionGuidance: '의견이 다른 상대를 공격하거나 배척하지 말고, 생각의 자유를 온전히 인정하며 성숙한 상호 존중을 실천하십시오.',
  },
  {
    aphorismKey: 'betterIsEnemyOfGood',
    aphorismKo: '더할 나위 없이 완벽한 것은 충분히 좋은 것의 적입니다.',
    aphorismEn: 'The best is the enemy of the good (Le mieux est l\'ennemi du bien).',
    sourceContext: '《철학 사전(Dictionnaire philosophique)》',
    actionGuidance: '완벽주의라는 강박에 사로잡혀 실행을 미루지 마십시오. 충분히 훌륭한 실질적 성과를 먼저 내어 발전의 디딤돌을 만드십시오.',
  },
  {
    aphorismKey: 'doubtAndCertainty',
    aphorismKo: '의심은 유쾌한 상태는 아니지만, 맹목적인 확신은 어리석은 상태입니다.',
    aphorismEn: 'Doubt is not a pleasant condition, but certainty is an absurd one.',
    sourceContext: '프로이센 프리드리히 대왕에게 보낸 철학 서한',
    actionGuidance: '절대적 확신에 취해 독단에 빠지지 마십시오. 건강한 질문과 객관적 검증을 통하여 한 걸음씩 더 단단한 진실로 나아가십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function calculateFrenchVoltaireCandideTolerance(
  profile?: UserProfile,
  query?: string,
): FrenchVoltaireCandideToleranceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `VOLTAIRE-CANDIDE-TOLERANCE:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const cultivateOurGardenPragmaticDevotionScore = 82 + ((absHash >> 1) % 17);
  const toleranceEnlightenedReasonIndex = 81 + ((absHash >> 4) % 18);
  const witSatiricalPiercingInsightScore = 80 + ((absHash >> 7) % 19);
  const justiceAdvocacyConscienceScore = 83 + ((absHash >> 10) % 16);
  const realisticDisillusionmentClarityIndex = 82 + ((absHash >> 13) % 17);

  const themeIndex = (absHash >> 6) % VOLTAIRE_THEMES.length;
  const aphorismIndex = (absHash >> 9) % VOLTAIRE_APHORISMS.length;

  const activeVoltaireTheme = VOLTAIRE_THEMES[themeIndex];
  const focalVoltaireAphorism = VOLTAIRE_APHORISMS[aphorismIndex];

  const guidanceTitle = `볼테르 계몽주의 실천 지혜: ${activeVoltaireTheme.themeTitleKo}`;
  const philosophicalCounsel = `프랑스 계몽주의의 거목 볼테르는 "우리의 밭을 일구어야 한다(Il faut cultiver notre jardin)"는 일상의 성실한 실천과 광신을 물리치는 관용(Tolérance)을 가르칩니다. ` +
    `현재 당신의 흐름에서 가장 귀감이 되는 핵심 지혜는 '${activeVoltaireTheme.themeTitleKo}'입니다. ` +
    `${activeVoltaireTheme.practicalCounsel} 볼테르의 통찰 "${focalVoltaireAphorism.aphorismKo}"를 되새기며, ` +
    `${focalVoltaireAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_VOLTAIRE_CANDIDE_TOLERANCE_VERSION,
    calculatedAtKst: new Date().toISOString(),
    cultivateOurGardenPragmaticDevotionScore,
    toleranceEnlightenedReasonIndex,
    witSatiricalPiercingInsightScore,
    justiceAdvocacyConscienceScore,
    realisticDisillusionmentClarityIndex,
    activeVoltaireTheme,
    focalVoltaireAphorism,
    voltaireComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchVoltaireCandideTolerancePrompt(
  res: FrenchVoltaireCandideToleranceResult,
): string {
  return [
    `【볼테르 《캉디드》 & 《관용론》 일상 실천 및 관용 지혜 지표】`,
    `- 밭을 일구는 일상 실천 지수(Cultivate Our Garden Devotion): ${res.cultivateOurGardenPragmaticDevotionScore}/100`,
    `- 관용 및 열린 지성 지표(Tolerance & Enlightened Reason): ${res.toleranceEnlightenedReasonIndex}/100`,
    `- 위선 타파 기지 및 유머 회복탄력성(Wit & Satirical Piercing Insight): ${res.witSatiricalPiercingInsightScore}/100`,
    `- 실천적 양심 및 정의 구현도(Justice Advocacy & Conscience): ${res.justiceAdvocacyConscienceScore}/100`,
    `- 현실 직시 및 분별력 지수(Realistic Disillusionment & Clarity): ${res.realisticDisillusionmentClarityIndex}/100`,
    `- 핵심 볼테르 실천 테마: ${res.activeVoltaireTheme.themeTitleKo} [${res.activeVoltaireTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeVoltaireTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeVoltaireTheme.practicalCounsel}`,
    `- 볼테르 원전 명언: "${res.focalVoltaireAphorism.aphorismKo}"`,
    `- 원문 인용: "${res.focalVoltaireAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalVoltaireAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalVoltaireAphorism.actionGuidance}`,
    `- 종합 볼테르 계몽 권면: ${res.voltaireComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
