/**
 * 프랑스 질 들뢰즈(Gilles Deleuze) 《천 개의 고원(Mille Plateaux)》 & 《차이와 반복(Différence et Répétition)》 리좀적접속 & 탈영토화·생성(Devenir) 지혜 엔진
 *
 * 20세기 후반 현대 프랑스 철학의 거장 질 들뢰즈(Gilles Deleuze, 1925~1995)와 펠릭스 과타리(Félix Guattari)의
 * 불후의 대표 저술 《천 개의 고원(Mille Plateaux)》 및 《차이와 반복(Différence et Répétition)》 원전 기반:
 * 1. 리좀적 수평 접속 및 탈중심 네트워크 역량 (Rhizomatic Connection & Pluralism Index): 수목형(위계적·수직적) 모델을 넘어 중심 없이 사방으로 뻗어 나가며 이질적인 것들을 엮어내는 힘.
 * 2. 탈영토화 및 노마딕 경계 확장 결단력 (Deterritorialization & Nomadic Freedom Score): 고착된 틀과 제도화된 영역을 과감히 벗어나 새로운 가능성의 지평으로 탈주하는 용기.
 * 3. 순수한 차이의 긍정 및 다양체 포용 지표 (Affirmation of Pure Difference Index): 획일적 동일성의 잣대로 재단하지 않고 다름 그 자체의 고유한 생명력을 긍정하는 지혜.
 * 4. 창조적 '되기(Devenir / Becoming)' 변용 역동성 (Creative Becoming & Transformation Score): 고정된 정체성에 머물지 않고 끊임없이 새로운 존재로 변용하며 성장하는 활력.
 * 5. 고착 극복 및 잠재력 해방 회복탄력성 (Liberation of Potential & Resilience Score): 억압적인 도그마나 결핍의 환상을 부수고 내재적 충만과 생명 에너지를 회복하는 힘.
 *
 * @version LUCKEY-DELEUZE-RHIZOME-BECOMING-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_GILLES_DELEUZE_RHIZOME_BECOMING_VERSION = 'LUCKEY-DELEUZE-RHIZOME-BECOMING-v1.0.0';

export interface DeleuzeTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface DeleuzeAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginal: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchGillesDeleuzeRhizomeBecomingResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 들뢰즈 리좀·탈영토화·생성 핵심 지표 (0~100)
  rhizomaticHorizontalConnectionIndex: number;      // 리좀적 수평 접속 역량 (Rhizomatic Connection)
  deterritorializationNomadicFreedomScore: number;  // 탈영토화 노마딕 자유도 (Deterritorialization)
  affirmationOfDifferenceMultiplicityIndex: number; // 순수 차이 긍정 및 다양체 (Affirmation of Difference)
  creativeBecomingVitalityScore: number;            // 창조적 되기 변용 역동성 (Creative Becoming)
  desiringProductionLiberationResilienceScore: number; // 잠재력 해방 회복탄력성 (Liberation Resilience)
  // 세부 분석
  activeDeleuzeTheme: DeleuzeTheme;
  focalDeleuzeAphorism: DeleuzeAphorism;
  deleuzeComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const DELEUZE_THEMES: DeleuzeTheme[] = [
  {
    themeKey: 'rhizomeMultiplicity',
    themeTitleEn: 'Rhizome: Non-Hierarchical Horizontal Connections',
    themeTitleKo: '리좀적 사유 — 뿌리줄기처럼 사방으로 뻗어나가는 열린 연결망 구축하기',
    pragmaticInsight: '나무처럼 뿌리-줄기-가지로 이어지는 엄격한 수직적 위계는 사유를 경직시킵니다. 리좀(뿌리줄기)처럼 어느 지점에서나 임의의 다른 지점과 접속할 수 있는 탈중심적 유연성이 필요합니다.',
    practicalCounsel: '정해진 순서나 고착된 조직 체계에만 의존하지 마십시오. 전혀 다른 분야와 경험을 창의적으로 연결하고, 수평적이고 자유로운 네트워크를 확장하십시오.',
  },
  {
    themeKey: 'deterritorializationNomadism',
    themeTitleEn: 'Deterritorialization & Nomadism: Breaking Boundaries',
    themeTitleKo: '탈영토화와 노마디즘 — 익숙한 안전지대를 벗어나 새로운 영토를 개척하기',
    pragmaticInsight: '기존의 습관, 제도, 상식의 영토에 안주할 때 생명력은 시듭니다. 탈영토화(Déterritorialisation)의 탈주선을 타고 경계를 가로지르는 유목민(노마드)의 정신이 혁신을 낳습니다.',
    practicalCounsel: '과거의 성공 방정식이나 편안한 루틴에 머무르지 마십시오. 두려움을 떨쳐내고 새로운 지식과 미개척 분야로 과감히 발걸음을 내딛으십시오.',
  },
  {
    themeKey: 'affirmationOfDifference',
    themeTitleEn: 'Affirmation of Difference & Multiplicity against Uniformity',
    themeTitleKo: '차이의 긍정과 다양체 — 획일성을 넘어 고유한 다름을 축복하기',
    pragmaticInsight: '차이란 동일성의 잣대 아래 놓인 열등함이 아니라, 그 자체로 풍요롭고 독창적인 힘입니다. 모든 존재의 차이를 있는 그대로 긍정할 때 진정한 창의성이 폭발합니다.',
    practicalCounsel: '남들과 같아지려 애쓰거나 다름을 숨기지 마십시오. 당신만의 독보적인 차이점과 개성을 최고의 자산으로 삼아 승부하십시오.',
  },
  {
    themeKey: 'creativeBecoming',
    themeTitleEn: 'Devenir: Creative Becoming Over Fixed Being',
    themeTitleKo: '되기(Devenir)의 역동성 — 고정된 명사가 아닌 흐르는 동사로 살아가기',
    pragmaticInsight: '인간은 완성된 존재(Being)로 굳어지는 것이 아니라, 매 순간 마주하는 세계와 공명하며 새롭게 태어나는 생성(Becoming)의 과정입니다.',
    practicalCounsel: '"나는 원래 이런 사람이다"라는 자기규정을 버리십시오. 새로운 배움과 만남을 통해 끊임없이 자신을 쇄신하고 진화시키십시오.',
  },
  {
    themeKey: 'desiringProduction',
    themeTitleEn: 'Desire as Creative Production, Not Lack',
    themeTitleKo: '욕망의 생산성과 내재적 충만 — 결핍이 아닌 넘쳐흐르는 창조적 에너지 누리기',
    pragmaticInsight: '욕망은 채워지지 않은 결핍이 아니라, 세계와 관계를 맺고 새로운 것을 만들어내는 긍정적인 생산의 기계입니다. 생명의 원초적 기쁨을 긍정해야 합니다.',
    practicalCounsel: '무언가 부족하다는 결핍감에 쫓기지 마십시오. 내면의 풍성한 활력과 호기심을 발판 삼아 능동적으로 새로운 가치를 창조하십시오.',
  },
];

export const DELEUZE_APHORISMS: DeleuzeAphorism[] = [
  {
    aphorismKey: 'makeRhizomeNotRoot',
    aphorismKo: '뿌리를 만들지 말고 리좀을 만들어라. 나무를 심지 말라. 절대 심지 말라!',
    aphorismOriginal: "Faites rhizome et pas racine, ne plantez pas! Ne semez pas, piquez!",
    sourceContext: '들뢰즈 & 과타리 《천 개의 고원(Mille Plateaux)》',
    actionGuidance: '고정된 틀에 얽매이지 말고, 다양한 기회와 관계의 망을 사방으로 유연하게 열어두십시오.',
  },
  {
    aphorismKey: 'differenceInItself',
    aphorismKo: '차이는 긍정되어야 할 대상이다. 차이를 인정하는 것이 아니라 차이 자체를 사랑하는 것이다.',
    aphorismOriginal: "La différence n'est pas et ne peut pas être pensée en elle-même, tant qu'elle est soumise aux exigences de la représentation.",
    sourceContext: '들뢰즈 《차이와 반복(Différence et Répétition)》',
    actionGuidance: '타인의 시선이나 비교에 흔들리지 말고, 당신만의 차별화된 독창성에 깊은 자부심을 가지십시오.',
  },
  {
    aphorismKey: 'linesOfFlight',
    aphorismKo: '탈주선은 언제나 살아 움직이며, 새로운 지평을 창조하는 가장 강력한 힘이다.',
    aphorismOriginal: "Les lignes de fuite sont créatrices de nouvelles réalités.",
    sourceContext: '들뢰즈 & 과타리 《대담(Dialogues)》',
    actionGuidance: '답답한 벽에 부딪혔을 때 정면충돌만 고집하지 말고, 상상력의 새로운 탈주선을 열어 도약하십시오.',
  },
  {
    aphorismKey: 'becomingImperceptible',
    aphorismKo: '되기(Devenir)는 결코 다른 무엇을 모방하는 것이 아니라, 자기 자신을 새롭게 변용하는 것이다.',
    aphorismOriginal: "Devenir n'est jamais imiter, ni faire comme, ni se conformer à un modèle.",
    sourceContext: '들뢰즈 & 과타리 《천 개의 고원(Mille Plateaux)》',
    actionGuidance: '남의 흉내를 내지 마십시오. 당신만의 리듬과 방식으로 내면의 잠재력을 꽃피우십시오.',
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

export function calculateFrenchGillesDeleuzeRhizomeBecoming(
  profile?: UserProfile,
  query?: string,
): FrenchGillesDeleuzeRhizomeBecomingResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `DELEUZE-RHIZOME-BECOMING:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const rhizomaticHorizontalConnectionIndex = 84 + ((absHash >> 1) % 15);
  const deterritorializationNomadicFreedomScore = 83 + ((absHash >> 4) % 16);
  const affirmationOfDifferenceMultiplicityIndex = 85 + ((absHash >> 7) % 14);
  const creativeBecomingVitalityScore = 82 + ((absHash >> 10) % 17);
  const desiringProductionLiberationResilienceScore = 81 + ((absHash >> 13) % 18);

  const themeIndex = (absHash >> 5) % DELEUZE_THEMES.length;
  const aphorismIndex = (absHash >> 8) % DELEUZE_APHORISMS.length;

  const activeDeleuzeTheme = DELEUZE_THEMES[themeIndex];
  const focalDeleuzeAphorism = DELEUZE_APHORISMS[aphorismIndex];

  const guidanceTitle = `들뢰즈 리좀·탈영토화 지혜: ${activeDeleuzeTheme.themeTitleKo}`;
  const philosophicalCounsel = `현대 사상의 지형을 바꾼 질 들뢰즈는 수직적 위계를 허무는 '리좀(Rhizome)'적 접속, 한계를 돌파하는 '탈영토화(Déterritorialisation)', 그리고 끊임없이 변용하는 '되기(Devenir)'의 철학을 완성했습니다. ` +
    `현재 당신의 흐름에서 가장 역동적인 활력을 불어넣는 핵심 원리는 '${activeDeleuzeTheme.themeTitleKo}'입니다. ` +
    `${activeDeleuzeTheme.practicalCounsel} 들뢰즈의 명언 "${focalDeleuzeAphorism.aphorismKo} (${focalDeleuzeAphorism.aphorismOriginal})"을 되새기며, ` +
    `${focalDeleuzeAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_GILLES_DELEUZE_RHIZOME_BECOMING_VERSION,
    calculatedAtKst: new Date().toISOString(),
    rhizomaticHorizontalConnectionIndex,
    deterritorializationNomadicFreedomScore,
    affirmationOfDifferenceMultiplicityIndex,
    creativeBecomingVitalityScore,
    desiringProductionLiberationResilienceScore,
    activeDeleuzeTheme,
    focalDeleuzeAphorism,
    deleuzeComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchGillesDeleuzeRhizomeBecomingPrompt(
  res: FrenchGillesDeleuzeRhizomeBecomingResult,
): string {
  return [
    `【들뢰즈 《천 개의 고원·차이와 반복》 리좀·탈영토화·생성 지혜 지표】`,
    `- 리좀적 수평 접속 역량(Rhizomatic Connection Index): ${res.rhizomaticHorizontalConnectionIndex}/100`,
    `- 탈영토화 노마딕 자유도(Deterritorialization Score): ${res.deterritorializationNomadicFreedomScore}/100`,
    `- 순수 차이 긍정 및 다양체(Affirmation of Difference): ${res.affirmationOfDifferenceMultiplicityIndex}/100`,
    `- 창조적 되기 변용 역동성(Creative Becoming Vitality): ${res.creativeBecomingVitalityScore}/100`,
    `- 잠재력 해방 회복탄력성(Liberation of Potential Resilience): ${res.desiringProductionLiberationResilienceScore}/100`,
    `- 핵심 들뢰즈 테마: ${res.activeDeleuzeTheme.themeTitleKo} [${res.activeDeleuzeTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeDeleuzeTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeDeleuzeTheme.practicalCounsel}`,
    `- 들뢰즈 원전 명언: "${res.focalDeleuzeAphorism.aphorismKo}" (${res.focalDeleuzeAphorism.aphorismOriginal})`,
    `- 원전 출처: [${res.focalDeleuzeAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDeleuzeAphorism.actionGuidance}`,
    `- 종합 들뢰즈 권면: ${res.deleuzeComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
