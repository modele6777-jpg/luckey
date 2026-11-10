/**
 * 프랑스 샤를 드 몽테스키외(Charles de Montesquieu) 《법의 정신(De l'esprit des lois)》 권력분립 & 견제와 균형·법치와 자유 지혜 엔진
 *
 * 프랑스 계몽주의 철학자이자 근대 입헌주의와 삼권분립의 기틀을 마련한 샤를 드 몽테스키외(Montesquieu, 1689~1755)의 대표작
 * 《법의 정신(De l'esprit des lois, 1748)》, 《페르시아인의 편지(Lettres persanes, 1721)》, 《로마의 흥망성쇠 원인론(1734)》 원전 기반:
 * 1. 견제와 균형 및 권력분립 균형 감각(Checks & Balances Prudence Index): 권력과 에너지의 독점을 방지하고 다자간 상호 견제와 균형을 빚어내는 통찰.
 * 2. 법치 기반 정치적 자유 및 절제된 자율성(Political Liberty & Temperance Score): 자의적 방종을 지양하고 공정한 룰 속에서 평온한 안전과 자유를 누리는 능력.
 * 3. 상황 맥락 부합 및 온건한 입법적 중용 지혜(Spirit of Laws & Moderate Contextual Insight): 주어진 환경·맥락·관습에 가장 조화로운 해법을 찾는 유연성.
 * 4. 공화국 시민적 덕성 및 공공선 헌신도(Civic Virtue & Public Spirit Score): 사사로운 욕망을 절제하고 공동체의 신뢰와 공익을 지키는 내적 기개.
 * 5. 계몽적 관용 및 다원주의 개방도(Enlightened Pluralism & Mutual Tolerance Index): 편견과 독단을 털어내고 서로 다른 개성과 문화를 존중하는 열린 안목.
 *
 * @version LUCKEY-MONTESQUIEU-SPIRIT-OF-LAWS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_MONTESQUIEU_SPIRIT_OF_LAWS_VERSION = 'LUCKEY-MONTESQUIEU-SPIRIT-OF-LAWS-v1.0.0';

export interface MontesquieuTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface MontesquieuAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchMontesquieuSpiritOfLawsResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 몽테스키외 법의 정신 지표 (0~100)
  checksAndBalancesPrudenceIndex: number;       // 견제와 균형 및 권력분립 균형 감각 (Checks & Balances)
  politicalLibertyTemperanceScore: number;      // 법치 기반 정치적 자유 및 절제된 자율성 (Political Liberty & Temperance)
  contextualSpiritOfLawsWisdomIndex: number;    // 상황 맥락 부합 및 온건한 입법적 중용 지혜 (Spirit of Laws & Contextual Insight)
  civicVirtuePublicSpiritScore: number;         // 공화국 시민적 덕성 및 공공선 헌신도 (Civic Virtue & Public Spirit)
  enlightenedPluralismToleranceIndex: number;   // 계몽적 관용 및 다원주의 개방도 (Enlightened Pluralism & Tolerance)
  // 세부 분석
  activeMontesquieuTheme: MontesquieuTheme;
  focalMontesquieuAphorism: MontesquieuAphorism;
  montesquieuComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const MONTESQUIEU_THEMES: MontesquieuTheme[] = [
  {
    themeKey: 'separationOfPowers',
    themeTitleEn: 'Separation of Powers & Mutual Checks',
    themeTitleKo: '권력분립과 견제와 균형 — 독주를 막고 평화를 지키는 지혜',
    pragmaticInsight: '어떤 탁월한 한 사람이나 단일한 기능에 지나친 권한이 집중되면 필연적으로 균열과 왜곡이 일어납니다. 서로 다른 역할이 독립적으로 서서 건강하게 견제하고 보완할 때 조직과 삶이 안전해집니다.',
    practicalCounsel: '모든 결정을 혼자서 독점하거나 한 가지 방식에만 의존하지 마십시오. 역할과 책임을 명확히 나누고, 서로 다른 시선이 교차 검증할 수 있는 건전한 균형 시스템을 구축하십시오.',
  },
  {
    themeKey: 'trulyPoliticalLiberty',
    themeTitleEn: 'True Liberty Under Established Principles',
    themeTitleKo: '원칙과 규칙 속의 참된 자유 — 두려움 없는 평온한 안전',
    pragmaticInsight: '자유란 무엇이든 제멋대로 하는 방종이 아닙니다. 모두가 합의한 공정한 규칙이 지켜질 때 누구도 부당한 간섭이나 불안에 떨지 않는 가장 완전한 심리적 안전과 자유가 보장됩니다.',
    practicalCounsel: '혼란스러운 자의적 판단을 경계하고 명확한 기준과 원칙을 먼저 세우십시오. 투명한 규칙에 입각해 움직일 때 당신의 선택은 흔들리지 않는 자유와 설득력을 얻습니다.',
  },
  {
    themeKey: 'natureOfThingsAndSpirit',
    themeTitleEn: 'The Spirit of Laws & Natural Context',
    themeTitleKo: '사물의 본성과 상황 맥락 — 현실과 풍토를 존중하는 중용',
    pragmaticInsight: '법과 규칙은 추상적인 공식을 억지로 대입하는 것이 아닙니다. 주어진 환경, 사람들의 기질, 역사적 맥락에 자연스럽게 부합할 때 비로소 생명력을 얻고 순조롭게 작동합니다.',
    practicalCounsel: '타인의 방식을 무비판적으로 모방하지 마십시오. 지금 당신이 처한 구체적인 현실과 파트너의 성향을 세심하게 관찰하고, 그 맥락에 가장 유연하게 어울리는 최적의 해법을 채택하십시오.',
  },
  {
    themeKey: 'civicVirtueFoundation',
    themeTitleEn: 'Civic Virtue & Devotion to Public Good',
    themeTitleKo: '시민적 덕성과 공공심 — 사익을 넘어선 신뢰의 기틀',
    pragmaticInsight: '공동체를 유지하는 가장 강력한 동력은 공포나 탐욕이 아니라 구성원들의 자발적인 덕성과 공공심입니다. 공동의 가치와 약속을 소중히 여길 때 전체의 번영이 개인의 행복으로 돌아옵니다.',
    practicalCounsel: '눈앞의 사사로운 이익에 연연하기보다 장기적인 신뢰와 공동의 성공을 우선하십시오. 당신의 진정성 있는 헌신과 공공심이 사람들의 마음을 하나로 모으는 가장 든든한 초석이 됩니다.',
  },
  {
    themeKey: 'moderateGentleness',
    themeTitleEn: 'Enlightened Moderation & Temperance',
    themeTitleKo: '온건한 중용과 분별력 — 극단을 배격하고 조화를 이루는 미덕',
    pragmaticInsight: '극단적인 강경책이나 지나친 완고함은 반드시 반작용을 부릅니다. 몽테스키외는 "중용과 온건함이야말로 진정한 지혜의 정수"라고 역설했습니다.',
    practicalCounsel: '조급한 마음에 무리한 극단적 조치를 취하지 마십시오. 차분한 분별력과 부드러운 유연성으로 다양한 입장을 품어 안을 때 가장 오래 지속되는 승리를 거둘 수 있습니다.',
  },
];

export const MONTESQUIEU_APHORISMS: MontesquieuAphorism[] = [
  {
    aphorismKey: 'powerRestrainsPower',
    aphorismKo: '권력을 가진 자는 누구나 그것을 남용하기 마련이다. 권력이 권력을 저지하도록 사물의 질서를 마련해야 한다.',
    aphorismEn: 'Constant experience shows that every person invested with power is apt to abuse it... To prevent this abuse, it is necessary from the very nature of things that power should be a check to power.',
    sourceContext: "《법의 정신(De l'esprit des lois)》 제11편 제4장",
    actionGuidance: '한 사람의 선의에만 의존하지 말고, 상호 검증과 견제가 이루어지는 시스템적 안전장치를 정교하게 마련하십시오.',
  },
  {
    aphorismKey: 'libertyRightToDoLaw',
    aphorismKo: '자유란 법이 허용하는 모든 것을 할 수 있는 권리이다.',
    aphorismEn: 'Liberty is a right of doing whatever the laws permit, and if a citizen could do what they forbid, they would be no longer possessed of liberty.',
    sourceContext: "《법의 정신(De l'esprit des lois)》 제11편 제3장",
    actionGuidance: '합의된 규칙과 원칙의 울타리 안에서 당당하고 거침없이 당신의 창의적 잠재력을 펼치십시오.',
  },
  {
    aphorismKey: 'uselessLawsWeaken',
    aphorismKo: '쓸모없는 법은 필요한 법마저 약화시킨다.',
    aphorismEn: 'Useless laws weaken the necessary laws.',
    sourceContext: "《법의 정신(De l'esprit des lois)》 제29편 제16장",
    actionGuidance: '불필요한 군더더기와 형식적 절차를 과감히 정리하고, 핵심 본질과 원칙에 온전히 집중하십시오.',
  },
  {
    aphorismKey: 'moderateSpiritLegislator',
    aphorismKo: '중용과 온건함의 정신이야말로 참된 입법자의 가장 고결한 미덕이다.',
    aphorismEn: 'The spirit of moderation ought to be that of the legislator; the political good, like the moral, is always found between two limits.',
    sourceContext: "《법의 정신(De l'esprit des lois)》 제29편 제1장",
    actionGuidance: '양극단의 격정에 휩쓸리지 말고, 사태를 넓게 조망하며 온건하고 현명한 중용의 길을 선택하십시오.',
  },
  {
    aphorismKey: 'virtueInRepublic',
    aphorismKo: '공화국에서의 덕성이란 조국을 사랑하고 공공의 이익을 사사로운 욕망보다 앞세우는 것이다.',
    aphorismEn: 'Virtue in a republic is a most simple thing: it is a love of the republic; it is a sensation, and not a consequence of acquired knowledge.',
    sourceContext: "《법의 정신(De l'esprit des lois)》 제5편 제2장",
    actionGuidance: '함께하는 이들을 향한 순수한 애정과 신의를 가슴에 품고, 말보다 행동으로 솔선수범하십시오.',
  },
];

export function calculateFrenchMontesquieuSpiritOfLaws(
  profile?: UserProfile,
  query?: string,
): FrenchMontesquieuSpiritOfLawsResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `MONTESQUIEU-SPIRIT-OF-LAWS:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const checksAndBalancesPrudenceIndex = 81 + (absHash % 18);
  const politicalLibertyTemperanceScore = 79 + ((absHash >> 3) % 20);
  const contextualSpiritOfLawsWisdomIndex = 82 + ((absHash >> 6) % 17);
  const civicVirtuePublicSpiritScore = 78 + ((absHash >> 9) % 21);
  const enlightenedPluralismToleranceIndex = 80 + ((absHash >> 12) % 19);

  const themeIndex = (absHash >> 5) % MONTESQUIEU_THEMES.length;
  const aphorismIndex = (absHash >> 8) % MONTESQUIEU_APHORISMS.length;

  const activeMontesquieuTheme = MONTESQUIEU_THEMES[themeIndex];
  const focalMontesquieuAphorism = MONTESQUIEU_APHORISMS[aphorismIndex];

  const guidanceTitle = `몽테스키외 법의 정신 지혜: ${activeMontesquieuTheme.themeTitleKo}`;
  const philosophicalCounsel = `프랑스 계몽주의와 근대 헌정주의의 대부 샤를 드 몽테스키외는 권력의 독주를 막는 견제와 균형(Checks and Balances), 법 테두리 안의 참된 자유, 그리고 맥락에 부합하는 온건한 중용을 강조합니다. ` +
    `현재 당신의 상황에서 가장 필요한 핵심 통찰은 '${activeMontesquieuTheme.themeTitleKo}'입니다. ` +
    `${activeMontesquieuTheme.practicalCounsel} 아울러 몽테스키외의 명언 "${focalMontesquieuAphorism.aphorismKo}"를 되새기며, ` +
    `${focalMontesquieuAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_MONTESQUIEU_SPIRIT_OF_LAWS_VERSION,
    calculatedAtKst: new Date().toISOString(),
    checksAndBalancesPrudenceIndex,
    politicalLibertyTemperanceScore,
    contextualSpiritOfLawsWisdomIndex,
    civicVirtuePublicSpiritScore,
    enlightenedPluralismToleranceIndex,
    activeMontesquieuTheme,
    focalMontesquieuAphorism,
    montesquieuComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchMontesquieuSpiritOfLawsPrompt(
  res: FrenchMontesquieuSpiritOfLawsResult,
): string {
  return [
    `【샤를 드 몽테스키외 《법의 정신》 견제와 균형 & 권력분립 지표】`,
    `- 견제와 균형 및 권력분립 균형 감각(Checks & Balances Prudence): ${res.checksAndBalancesPrudenceIndex}/100`,
    `- 법치 기반 정치적 자유 및 절제된 자율성(Political Liberty & Temperance): ${res.politicalLibertyTemperanceScore}/100`,
    `- 상황 맥락 부합 및 입법적 중용 지혜(Spirit of Laws & Contextual Insight): ${res.contextualSpiritOfLawsWisdomIndex}/100`,
    `- 공화국 시민적 덕성 및 공공선 헌신도(Civic Virtue & Public Spirit): ${res.civicVirtuePublicSpiritScore}/100`,
    `- 계몽적 관용 및 다원주의 개방도(Enlightened Pluralism & Tolerance): ${res.enlightenedPluralismToleranceIndex}/100`,
    `- 핵심 법의 정신 테마: ${res.activeMontesquieuTheme.themeTitleKo} [${res.activeMontesquieuTheme.themeTitleEn}]`,
    `- 실용주의적 통찰: ${res.activeMontesquieuTheme.pragmaticInsight}`,
    `- 실천적 조언: ${res.activeMontesquieuTheme.practicalCounsel}`,
    `- 몽테스키외 원전 명언: "${res.focalMontesquieuAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalMontesquieuAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalMontesquieuAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalMontesquieuAphorism.actionGuidance}`,
    `- 종합 몽테스키외 철학 권면: ${res.montesquieuComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
