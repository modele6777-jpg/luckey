/**
 * 프랑스 시몬 드 보부아르(Simone de Beauvoir) 《애매성의 윤리학(Pour une morale de l'ambiguïté)》 & 《제2의 성(Le Deuxième Sexe)》 주체적 자기창조 & 애매성의 윤리·자유의 상호 연대 지혜 엔진
 *
 * 20세기 프랑스 실존주의 철학의 거목 시몬 드 보부아르(1908~1986)의 불후의 명저 《애매성의 윤리학》, 《제2의 성》 원전 기반:
 * 1. 주체적 자기창조 및 실존적 투사 (Authentic Self-Creation & Existential Projection Score): 기성 관습과 타인의 규정을 넘어 스스로 존재의 의미를 빚어내는 주체적 투사력.
 * 2. 애매성의 윤리학 및 실존적 정직성 (Ethics of Ambiguity & Honest Acceptance Index): 삶의 불확실성과 모순적 긴장을 흑백논리로 덮지 않고 정직하게 껴안는 윤리적 성숙도.
 * 3. 자유의 상호 연대 및 해방적 공감도 (Mutual Freedom & Liberating Solidarity Score): 타인의 자유를 해방시킴으로써 비로소 나의 자유가 온전히 완성된다는 연대 지수.
 * 4. 상황 돌파 실천력 및 주체적 결단 지수 (Situational Agency & Action Commitment Index): 주어진 상황(Situation)의 구체적 조건과 한계를 직시하며 행동으로 길을 여는 결단력.
 * 5. 실존적 용기 및 창조적 회복탄력성 (Existential Courage & Resilience Score): 억압과 고립의 불안 앞에서도 굴하지 않고 매 순간 나를 새롭게 정의하는 회복탄력성.
 *
 * @version LUCKEY-BEAUVOIR-AMBIGUITY-FREEDOM-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_SIMONE_DE_BEAUVOIR_AMBIGUITY_FREEDOM_VERSION = 'LUCKEY-BEAUVOIR-AMBIGUITY-FREEDOM-v1.0.0';

export interface BeauvoirTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface BeauvoirAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchSimoneDeBeauvoirAmbiguityFreedomResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 보부아르 실존주의 윤리 핵심 지표 (0~100)
  authenticSelfCreationScore: number;          // 주체적 자기창조 및 실존적 투사 (Self-Creation & Projection)
  ethicsOfAmbiguityIndex: number;              // 애매성의 윤리학 및 실존적 정직성 (Ethics of Ambiguity)
  mutualFreedomSolidarityScore: number;        // 자유의 상호 연대 및 해방적 공감도 (Mutual Freedom & Solidarity)
  situationalAgencyIndex: number;              // 상황 돌파 실천력 및 주체적 결단 (Situational Agency & Action)
  existentialCourageResilienceScore: number;   // 실존적 용기 및 창조적 회복탄력성 (Existential Courage & Resilience)
  // 세부 분석
  activeBeauvoirTheme: BeauvoirTheme;
  focalBeauvoirAphorism: BeauvoirAphorism;
  beauvoirComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const BEAUVOIR_THEMES: BeauvoirTheme[] = [
  {
    themeKey: 'authenticSelfCreation',
    themeTitleEn: 'Becoming Over Being: Sovereign Self-Creation Beyond Imposed Destinies',
    themeTitleKo: '주체적 자기창조 — 타인이 규정한 틀을 깨고 스스로 나를 빚어가기',
    pragmaticInsight: '보부아르의 통찰처럼 우리는 어떤 고정된 존재로 태어나는 것이 아니라, 매 순간 자신의 선택과 행동을 통해 스스로를 만들어가는 존재입니다. 타인의 기대나 사회적 각본에 갇히지 마십시오.',
    practicalCounsel: '과거의 규정이나 세상의 평가에 주눅 들지 마십시오. 오늘 당신이 내리는 결단과 행동이 당신의 참된 정체성을 결정합니다. 당당하고 능동적인 창조자로서 당신만의 길을 선언하십시오.',
  },
  {
    themeKey: 'embracingAmbiguity',
    themeTitleEn: 'Ethics of Ambiguity: Honest Acceptance of Complex Realities Without Dogma',
    themeTitleKo: '애매성의 정직한 직시 — 단순한 흑백논리를 넘어 삶의 복잡함을 성숙하게 포용하기',
    pragmaticInsight: '인간의 삶은 절대적 확실성이 없는 애매함(Ambiguity) 속에서 펼쳐집니다. 이 불확실성을 독단이나 맹신으로 덮으려 하지 않고 정직하게 껴안을 때 비로소 진정한 윤리적 자유가 시작됩니다.',
    practicalCounsel: '모든 것을 성급하게 단정 짓거나 완벽한 확신만을 기다리며 주저하지 마십시오. 불확실성 속에서도 중심을 잃지 않고, 유연하고 정직한 시선으로 상황의 다양한 결을 품어내십시오.',
  },
  {
    themeKey: 'solidarityOfFreedom',
    themeTitleEn: 'Liberating Solidarity: My Freedom Flourishing Through the Freedom of Others',
    themeTitleKo: '자유의 상호 연대 — 타인의 자유를 확장할 때 비로소 완성되는 나의 자유',
    pragmaticInsight: '고립된 자아의 자유는 공허한 환상에 불과합니다. 나의 자유가 세상 속에서 진정한 의미를 얻으려면, 타인의 자유를 존중하고 함께 억압을 걷어내는 따뜻한 연대 속으로 투사되어야 합니다.',
    practicalCounsel: '나 혼자만의 이익이나 성취에 갇히지 마십시오. 주변 동료와 파트너의 주체성을 북돋워 주고 그들의 성장을 도우십시오. 함께 자유로워질 때 당신의 영향력도 비약적으로 커집니다.',
  },
  {
    themeKey: 'actionInSituation',
    themeTitleEn: 'Action in Situation: Breaking Through Constraints via Concrete Commitment',
    themeTitleKo: '상황 속의 능동적 돌파 — 주어진 조건의 한계를 딛고 구체적 행동으로 전진하기',
    pragmaticInsight: '우리는 진공 속이 아니라 구체적인 제약과 조건이 얽힌 상황(Situation) 속에 던져져 있습니다. 참된 자유는 상황을 원망하는 것이 아니라, 그 제약 속에서 가장 현명한 실천을 결단하는 데 있습니다.',
    practicalCounsel: '조건의 미비함이나 환경을 탓하며 결정을 미루지 마십시오. 지금 손에 쥔 구체적인 자원과 환경 속에서 가능한 최선의 한 걸음을 과감하게 내딛으십시오. 행동만이 상황을 바꿉니다.',
  },
  {
    themeKey: 'existentialCourage',
    themeTitleEn: 'Existential Courage: Embracing Open Futures with Undaunted Vitality',
    themeTitleKo: '실존적 용기 — 불안을 뚫고 미지의 미래를 향해 경쾌하게 도약하기',
    pragmaticInsight: '자유는 필연적으로 막막한 불안을 동반합니다. 그러나 그 불안이야말로 우리 앞에 무한한 가능성의 지평이 열려 있다는 증거입니다. 두려움을 딛고 미래를 향해 날아오르십시오.',
    practicalCounsel: '실패에 대한 두려움으로 인해 삶의 주도권을 남에게 넘기지 마십시오. 자신의 결정을 스스로 책임지는 단단한 자립심을 발휘할 때, 당신의 영혼은 가장 찬란하게 빛납니다.',
  },
];

export const BEAUVOIR_APHORISMS: BeauvoirAphorism[] = [
  {
    aphorismKey: 'becomingOverBeing',
    aphorismKo: '사람은 태어나는 것이 아니라, 스스로 선택하고 행동함으로써 그렇게 되어가는 것이다.',
    aphorismFrench: 'On ne naît pas femme: on le devient.',
    sourceContext: '시몬 드 보부아르 《제2의 성(Le Deuxième Sexe)》',
    actionGuidance: '정해진 운명론에 굴복하지 마십시오. 당신의 정체성은 과거가 아니라 지금 당신이 취하는 행동이 만듭니다.',
  },
  {
    aphorismKey: 'freedomAndEthics',
    aphorismKo: '자유를 진정으로 갈망한다는 것과 도덕적 책임을 다한다는 것은 결국 하나의 결단이다.',
    aphorismFrench: "Vouloir la liberté et vouloir la morale, c'est une seule et même décision.",
    sourceContext: '시몬 드 보부아르 《애매성의 윤리학(Pour une morale de l\'ambiguïté)》',
    actionGuidance: '자유를 방종으로 낭비하지 마십시오. 자신과 타인에 대한 깊은 책임을 바탕으로 격조 높은 선택을 내리십시오.',
  },
  {
    aphorismKey: 'freedomThroughOthers',
    aphorismKo: '나의 자유가 허무 속으로 사라지지 않으려면, 타인의 자유를 매개로 세상 속으로 투사되어야 한다.',
    aphorismFrench: 'Ma liberté, pour ne pas s\'épuiser dans le vide, doit se projeter dans le monde à travers la liberté des autres.',
    sourceContext: '시몬 드 보부아르 《애매성의 윤리학(Pour une morale de l\'ambiguïté)》',
    actionGuidance: '독단적인 고립을 경계하십시오. 타인의 주체성을 존중하고 공감대를 형성하여 함께 승리하는 길을 찾으십시오.',
  },
  {
    aphorismKey: 'humanIsFreedom',
    aphorismKo: '인간은 고정된 닫힌 본성이 아니라, 매 순간 자신을 열어젖히는 살아 숨 쉬는 자유이다.',
    aphorismFrench: 'L\'homme n\'est pas une nature, il est une liberté.',
    sourceContext: '시몬 드 보부아르 《피르고스의 대가(Pyrrhus et Cinéas)》',
    actionGuidance: '스스로를 낡은 규범의 상자에 가두지 마십시오. 새로운 지평을 향해 과감하게 당신의 가능성을 펼치십시오.',
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

export function calculateFrenchSimoneDeBeauvoirAmbiguityFreedom(
  profile?: UserProfile,
  query?: string,
): FrenchSimoneDeBeauvoirAmbiguityFreedomResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `BEAUVOIR-AMBIGUITY-FREEDOM:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const authenticSelfCreationScore = 86 + ((absHash >> 1) % 13);
  const ethicsOfAmbiguityIndex = 84 + ((absHash >> 4) % 15);
  const mutualFreedomSolidarityScore = 85 + ((absHash >> 7) % 14);
  const situationalAgencyIndex = 87 + ((absHash >> 10) % 12);
  const existentialCourageResilienceScore = 86 + ((absHash >> 13) % 13);

  const themeIndex = (absHash >> 5) % BEAUVOIR_THEMES.length;
  const aphorismIndex = (absHash >> 8) % BEAUVOIR_APHORISMS.length;

  const activeBeauvoirTheme = BEAUVOIR_THEMES[themeIndex];
  const focalBeauvoirAphorism = BEAUVOIR_APHORISMS[aphorismIndex];

  const guidanceTitle = `시몬 드 보부아르 실존주의 윤리 철학 지혜: ${activeBeauvoirTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 실존주의 철학의 거장 시몬 드 보부아르는 《애매성의 윤리학》과 《제2의 성》을 통해 ` +
    `인간은 고정된 본성에 갇힌 존재가 아니라 스스로를 주체적으로 조형하고 타인의 자유와 연대하는 존엄한 실존임을 증명했습니다. ` +
    `현재 당신이 마주한 과제를 주체적으로 돌파하는 핵심 지침은 '${activeBeauvoirTheme.themeTitleKo}'입니다. ` +
    `${activeBeauvoirTheme.practicalCounsel} 보부아르의 불후의 명언 "${focalBeauvoirAphorism.aphorismKo}" (${focalBeauvoirAphorism.aphorismFrench})을 마음에 품고, ` +
    `${focalBeauvoirAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_SIMONE_DE_BEAUVOIR_AMBIGUITY_FREEDOM_VERSION,
    calculatedAtKst: new Date().toISOString(),
    authenticSelfCreationScore,
    ethicsOfAmbiguityIndex,
    mutualFreedomSolidarityScore,
    situationalAgencyIndex,
    existentialCourageResilienceScore,
    activeBeauvoirTheme,
    focalBeauvoirAphorism,
    beauvoirComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchSimoneDeBeauvoirAmbiguityFreedomPrompt(
  res: FrenchSimoneDeBeauvoirAmbiguityFreedomResult,
): string {
  return [
    `【시몬 드 보부아르 《애매성의 윤리학》 실존적 자기창조 및 상호자유 지표】`,
    `- 주체적 자기창조 및 실존적 투사(Authentic Self-Creation & Projection): ${res.authenticSelfCreationScore}/100`,
    `- 애매성의 윤리학 및 실존적 정직성(Ethics of Ambiguity & Honest Acceptance): ${res.ethicsOfAmbiguityIndex}/100`,
    `- 자유의 상호 연대 및 해방적 공감도(Mutual Freedom & Liberating Solidarity): ${res.mutualFreedomSolidarityScore}/100`,
    `- 상황 돌파 실천력 및 주체적 결단(Situational Agency & Action): ${res.situationalAgencyIndex}/100`,
    `- 실존적 용기 및 창조적 회복탄력성(Existential Courage & Resilience): ${res.existentialCourageResilienceScore}/100`,
    `- 핵심 보부아르 테마: ${res.activeBeauvoirTheme.themeTitleKo} [${res.activeBeauvoirTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeBeauvoirTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeBeauvoirTheme.practicalCounsel}`,
    `- 보부아르 원전 명언: "${res.focalBeauvoirAphorism.aphorismKo}" (${res.focalBeauvoirAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalBeauvoirAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalBeauvoirAphorism.actionGuidance}`,
    `- 종합 보부아르 권면: ${res.beauvoirComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
