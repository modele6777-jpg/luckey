/**
 * 미국 존 듀이(John Dewey) 《경험과 자연》 & 《민주주의와 교육》 도구주의 반성적 사고 & 지성적 탐구·성장으로서의 삶 지혜 엔진
 *
 * 20세기 미국 실용주의(Pragmatism) 및 도구주의(Instrumentalism) 철학의 대부 존 듀이(1859~1952)의 원전 기반:
 * 1. 반성적 사고 및 지성적 문제해결 탐구도 (Reflective Thinking & Inquiry Precision Score): 맹목적 관습이나 성급한 충동을 멈추고 문제 상황의 본질을 명료히 짚어내는 반성적 사유력.
 * 2. 도구적 지성 및 상황 적응 유연성 지수 (Instrumental Intelligence & Adaptive Flexibility Index): 관념에 머물지 않고 생각을 현실의 난제를 해결하는 유효한 도구로 활용하는 유연성.
 * 3. 도달점 없는 성장 그 자체로서의 삶 활력도 (Growth as an End in Itself Vitality Score): 완결된 결과에 얽매이지 않고 끊임없이 역량을 확장하고 배우는 과정 자체의 생명력.
 * 4. 유기체와 환경의 능동적 상호작용 조화 지표 (Organism-Environment Dynamic Transaction Index): 주어지는 조건에 수동적으로 갇히지 않고 환경과 호흡하며 새로운 질서를 창조하는 개척력.
 * 5. 열린 소통과 민주적 협력 공감 회복탄력성 (Democratic Communication & Cooperative Resilience Score): 독단적 주장을 내려놓고 타자와의 솔직한 대화와 협력을 통해 지평을 넓히는 포용력.
 *
 * @version LUCKEY-JOHN-DEWEY-PRAGMATIC-INQUIRY-GROWTH-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_JOHN_DEWEY_PRAGMATIC_INQUIRY_GROWTH_VERSION = 'LUCKEY-JOHN-DEWEY-PRAGMATIC-INQUIRY-GROWTH-v1.0.0';

export interface DeweyTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface DeweyAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEnglish: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AmericanJohnDeweyPragmaticInquiryGrowthResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 존 듀이 핵심 지표 (0~100)
  reflectiveThinkingInquiryScore: number;                 // 반성적 사고 및 지성적 탐구도 (Reflective Thinking & Inquiry)
  instrumentalIntelligenceAdaptabilityIndex: number;      // 도구적 지성 및 상황 적응 유연성 지수 (Instrumental Intelligence & Adaptability)
  growthAsLifeProcessVitalityScore: number;               // 성장 그 자체로서의 삶 활력도 (Growth as an End in Itself)
  organismEnvironmentInteractionHarmonyIndex: number;     // 유기체-환경 상호작용 조화 지표 (Organism-Environment Dynamic Transaction)
  democraticCooperationEmpathyScore: number;              // 열린 소통 및 민주적 협력 회복탄력성 (Democratic Communication & Resilience)
  // 세부 분석
  activeDeweyTheme: DeweyTheme;
  focalDeweyAphorism: DeweyAphorism;
  deweyComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const DEWEY_THEMES: DeweyTheme[] = [
  {
    themeKey: 'reflectiveInquiry',
    themeTitleEn: 'Reflective Inquiry: Pausing Habitual Reaction to Reason Through Problem Situations',
    themeTitleKo: '반성적 탐구의 힘 — 맹목적 충동을 멈추고 문제의 본질을 지성적으로 규명하기',
    pragmaticInsight: '존 듀이의 반성적 사고(Reflective Thinking)는 의심과 난관에 부딪혔을 때 일어납니다. 성급하게 결론으로 내달리지 않고, 무엇이 진짜 문제인지 차분히 관찰하고 가설을 세워 검증할 때 참된 돌파구가 열립니다.',
    practicalCounsel: '혼란스러울수록 즉각적인 리액션을 멈추십시오. 당면한 상황을 관찰 가능한 사실들로 분해하고, 여러 대안을 지성적으로 실험해 보십시오. 잘 규명된 문제는 이미 절반쯤 해결된 것입니다.',
  },
  {
    themeKey: 'growthInItself',
    themeTitleEn: 'Growth as an End: Cultivating the Expanding Process of Life Beyond Static Goals',
    themeTitleKo: '성장 그 자체로서의 삶 — 고정된 종착지에 얽매이지 않고 끊임없이 배우고 확장하기',
    pragmaticInsight: '듀이에게 성장의 목적은 어떤 고정된 이상에 도달하는 것이 아니라 ‘더 많은 성장을 가능하게 하는 것’입니다. 삶은 완성된 조각상이 아니라, 끝없이 흘러가며 역량을 넓혀가는 열린 과정입니다.',
    practicalCounsel: '하나의 성패에 전부를 걸며 자신을 소진하지 마십시오. 현재의 경험이 내일의 더 풍요로운 경험으로 이어지는 통로가 되도록 하십시오. 배움과 호기심이 살아있는 한 성장은 멈추지 않습니다.',
  },
  {
    themeKey: 'instrumentalAction',
    themeTitleEn: 'Instrumental Intelligence: Transforming Abstract Ideas into Practical Problem-Solving Tools',
    themeTitleKo: '도구주의적 지성 — 공허한 관념의 유희를 넘어 삶의 난제를 해결하는 유효한 도구 쓰기',
    pragmaticInsight: '지식과 이론은 영원불변의 도그마가 아니라 인간의 삶을 더 낫게 만들기 위해 벼려진 도구(Instrument)입니다. 이론의 참됨은 사변의 그럴듯함이 아니라 현실의 고통을 덜고 문제를 해결하는 실천적 결과에서 증명됩니다.',
    practicalCounsel: '머릿속 사색과 걱정에만 갇혀 있지 마십시오. 당신의 아이디어를 현실의 작은 행동으로 직접 시험해 보십시오. 유용한 것은 발전시키고, 효용을 다한 옛 방식은 미련 없이 새 도구로 바꾸십시오.',
  },
  {
    themeKey: 'dynamicTransaction',
    themeTitleEn: 'Dynamic Transaction: Actively Shaping Circumstances Through Organic Harmony',
    themeTitleKo: '유기체와 환경의 상호작용 — 주어진 조건에 갇히지 않고 능동적으로 상황 개척하기',
    pragmaticInsight: '인간은 환경에 일방적으로 굴종하는 존재도, 환경을 멋대로 파괴하는 군주도 아닙니다. 유기체는 환경과 끊임없이 에너지를 주고받으며(Transaction) 서로를 새롭게 빚어냅니다.',
    practicalCounsel: '주어진 여건을 탓하며 무기력에 빠지지 마십시오. 환경이 주는 자극에 유연하게 반응하되, 당신의 창의적 지성으로 환경의 조건을 새롭게 조율하십시오. 협력적 개척이 새로운 길을 만듭니다.',
  },
];

export const DEWEY_APHORISMS: DeweyAphorism[] = [
  {
    aphorismKey: 'educationIsLife',
    aphorismKo: '교육은 삶을 위한 준비가 아니다. 교육은 삶 그 자체이며, 끊임없는 삶의 재구성이자 성장이다.',
    aphorismEnglish: 'Education is not preparation for life; education is life itself.',
    sourceContext: '존 듀이 《민주주의와 교육(Democracy and Education)》',
    actionGuidance: '‘언젠가 도래할 행복’을 위해 오늘을 희생하지 마십시오. 지금 겪고 있는 일상과 일 속에서 성장과 가치를 발견하십시오.',
  },
  {
    aphorismKey: 'learningFromReflection',
    aphorismKo: '우리는 단순히 경험을 겪는 것만으로 배우지 않는다. 우리는 경험을 반성적으로 성찰함으로써 비로소 배운다.',
    aphorismEnglish: 'We do not learn from experience... we learn from reflecting on experience.',
    sourceContext: '존 듀이 《우리는 어떻게 생각하는가(How We Think)》',
    actionGuidance: '일이 끝난 뒤 그냥 넘기지 마십시오. 무엇이 효과적이었고 무엇이 빗나갔는지 차분히 성찰하는 시간이 내일의 지혜를 만듭니다.',
  },
  {
    aphorismKey: 'arrivingAtGoal',
    aphorismKo: '하나의 목표에 도달하는 것은 영원한 끝이 아니다. 그것은 또 다른 새로운 탐구를 향한 위대한 출발점이다.',
    aphorismEnglish: 'Arriving at one goal is the starting point to another.',
    sourceContext: '존 듀이 《경험과 자연(Experience and Nature)》',
    actionGuidance: '작은 성공에 안주하거나 작은 좌절에 주저앉지 마십시오. 모든 지점은 다음 발걸음을 디딜 수 있는 새로운 디딤돌입니다.',
  },
  {
    aphorismKey: 'conflictGadflyOfThought',
    aphorismKo: '갈등과 혼란은 생각의 쇠파리이다. 그것은 우리를 잠에서 깨워 관찰과 창조적 탐구로 이끈다.',
    aphorismEnglish: 'Conflict is the gadfly of thought. It stirs us to observation and memory.',
    sourceContext: '존 듀이 《인간 본성과 행위(Human Nature and Conduct)》',
    actionGuidance: '장애물이나 예상 밖의 문제를 두려워하지 마십시오. 관습적 타성을 부수고 한 단계 높은 지성을 발휘할 절호의 기회로 삼으십시오.',
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

export function calculateAmericanJohnDeweyPragmaticInquiryGrowth(
  profile?: UserProfile,
  query?: string,
): AmericanJohnDeweyPragmaticInquiryGrowthResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `JOHN-DEWEY-PRAGMATIC-INQUIRY-GROWTH:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const reflectiveThinkingInquiryScore = 89 + ((absHash >> 1) % 10);
  const instrumentalIntelligenceAdaptabilityIndex = 88 + ((absHash >> 4) % 11);
  const growthAsLifeProcessVitalityScore = 87 + ((absHash >> 7) % 12);
  const organismEnvironmentInteractionHarmonyIndex = 89 + ((absHash >> 10) % 10);
  const democraticCooperationEmpathyScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % DEWEY_THEMES.length;
  const aphorismIndex = (absHash >> 8) % DEWEY_APHORISMS.length;

  const activeDeweyTheme = DEWEY_THEMES[themeIndex];
  const focalDeweyAphorism = DEWEY_APHORISMS[aphorismIndex];

  const guidanceTitle = `존 듀이 실용주의 탐구와 성장의 지혜: ${activeDeweyTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 실용주의 철학의 완성자 존 듀이 선생은 《경험과 자연》과 《민주주의와 교육》을 통해 ` +
    `맹목적 습관을 멈추고 문제의 맥락을 짚는 반성적 사고(Reflective Thinking), 관념을 현실의 난제를 푸는 유용한 연장으로 삼는 도구적 지성, ` +
    `그리고 고정된 목적지에 머물지 않고 끝없이 지평을 넓혀가는 성장 그 자체로서의 삶을 역설했습니다. ` +
    `현재 당신이 마주한 상황에서 가장 유효한 실천적 열쇠는 '${activeDeweyTheme.themeTitleKo}'입니다. ` +
    `${activeDeweyTheme.practicalCounsel} 듀이의 테제 "${focalDeweyAphorism.aphorismKo}" (${focalDeweyAphorism.aphorismEnglish})을 지표로 삼고, ` +
    `${focalDeweyAphorism.actionGuidance}`;

  return {
    engineVersion: AMERICAN_JOHN_DEWEY_PRAGMATIC_INQUIRY_GROWTH_VERSION,
    calculatedAtKst: new Date().toISOString(),
    reflectiveThinkingInquiryScore,
    instrumentalIntelligenceAdaptabilityIndex,
    growthAsLifeProcessVitalityScore,
    organismEnvironmentInteractionHarmonyIndex,
    democraticCooperationEmpathyScore,
    activeDeweyTheme,
    focalDeweyAphorism,
    deweyComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAmericanJohnDeweyPragmaticInquiryGrowthPrompt(
  res: AmericanJohnDeweyPragmaticInquiryGrowthResult,
): string {
  return [
    `【존 듀이 《경험과 자연·민주주의와 교육》 반성적 사고(Reflective Inquiry)·성장 지표】`,
    `- 반성적 사고 및 지성적 문제해결 탐구도(Reflective Thinking & Inquiry): ${res.reflectiveThinkingInquiryScore}/100`,
    `- 도구적 지성 및 상황 적응 유연성 지수(Instrumental Intelligence & Adaptability): ${res.instrumentalIntelligenceAdaptabilityIndex}/100`,
    `- 성장 그 자체로서의 삶 활력도(Growth as an End in Itself): ${res.growthAsLifeProcessVitalityScore}/100`,
    `- 유기체와 환경의 능동적 상호작용 조화도(Organism-Environment Transaction): ${res.organismEnvironmentInteractionHarmonyIndex}/100`,
    `- 열린 소통 및 민주적 협력 회복탄력성(Democratic Communication & Resilience): ${res.democraticCooperationEmpathyScore}/100`,
    `- 핵심 듀이 테마: ${res.activeDeweyTheme.themeTitleKo} [${res.activeDeweyTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeDeweyTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeDeweyTheme.practicalCounsel}`,
    `- 듀이 원전 테제: "${res.focalDeweyAphorism.aphorismKo}" (${res.focalDeweyAphorism.aphorismEnglish})`,
    `- 원전 출처: [${res.focalDeweyAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDeweyAphorism.actionGuidance}`,
    `- 종합 듀이 권면: ${res.deweyComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
