/**
 * 미국 윌리엄 제임스(William James) 《실용주의(Pragmatism)》 & 《신념의 의지(The Will to Believe)》 실천적 현금가치 & 의식의 흐름·다원주의 지혜 엔진
 *
 * 미국 실용주의(Pragmatism)의 대부이자 현대 심리학의 선구자 윌리엄 제임스(William James, 1842~1910)의 대표작
 * 《실용주의(Pragmatism, 1907)》, 《신념의 의지(The Will to Believe, 1897)》, 《심리학의 원리(The Principles of Psychology, 1890)》,
 * 《종교적 경험의 다양성(The Varieties of Religious Experience, 1902)》 원전 기반:
 * 1. 실천적 현금가치 및 유용성 지수(Practical Cash-Value & Fruitfulness Index): 이론에 머물지 않고 실제 삶에서 구체적 차이를 빚어내는 실천력.
 * 2. 신념의 의지 및 행동 결단력(The Will to Believe & Decisive Action Score): 불확실성 속에서도 용기 있게 믿고 행동하여 긍정적 결과를 창조하는 결단 지수.
 * 3. 의식의 흐름 및 심리적 유연성 지표(Stream of Consciousness & Mental Flexibility Index): 고착된 생각의 틀을 넘어 끊임없이 흐르는 의식을 유연하게 수용하는 지혜.
 * 4. 다원적 우주 및 다양성 수용도(Pluralistic Universe & Open Receptivity Score): 획일적 도그마를 탈피하고 세상의 다채로운 가능성과 타인의 고유성을 존중하는 열린 시야.
 * 5. 건강한 영혼 및 정서 전환 회복탄력성(Healthy-Mindedness & Somatic Action Resilience Index): 행동을 먼저 바꾸어 내면 정서를 밝게 쇄신하는 신체-심리 전환력.
 *
 * @version LUCKEY-WILLIAM-JAMES-PRAGMATISM-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_WILLIAM_JAMES_VERSION = 'LUCKEY-WILLIAM-JAMES-PRAGMATISM-v1.0.0';

export interface JamesTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface JamesAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AmericanWilliamJamesPragmatismResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 윌리엄 제임스 실용주의 & 심리 지표 (0~100)
  practicalCashValueIndex: number;              // 실천적 현금가치 및 유용성 지수 (Cash-Value & Fruitfulness)
  willToBelieveConfidenceScore: number;         // 신념의 의지 및 행동 결단력 (The Will to Believe & Decisive Action)
  streamOfConsciousnessVitalityIndex: number;   // 의식의 흐름 및 심리적 유연성 지표 (Stream of Consciousness Flexibility)
  pluralisticOpennessScore: number;             // 다원적 우주 및 다양성 수용도 (Pluralistic Universe Openness)
  healthyMindedResilienceIndex: number;         // 건강한 영혼 및 정서 전환 회복탄력성 (Healthy-Mindedness & Somatic Action)
  // 세부 분석
  activeJamesTheme: JamesTheme;
  focalJamesAphorism: JamesAphorism;
  jamesComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const JAMES_THEMES: JamesTheme[] = [
  {
    themeKey: 'cashValueTruth',
    themeTitleEn: 'Practical Cash-Value of Truth',
    themeTitleKo: '진리의 실천적 현금가치 — 삶에서 구체적 차이를 만드는 생각',
    pragmaticInsight: '진리는 가만히 굳어있는 추상적 박제물이 아닙니다. 어떤 생각이 참된가 아닌가는 그것이 실제 당신의 삶에 어떤 구체적인 유익과 긍정적 차이를 낳는가에 달려 있습니다.',
    practicalCounsel: '공허한 이론이나 끝없는 탁상공론에 시간을 낭비하지 마십시오. "이 생각이 나의 일상과 관계에 어떤 구체적인 차이를 만드는가?"를 질문하고 즉시 행동으로 검증하십시오.',
  },
  {
    themeKey: 'willToBelieve',
    themeTitleEn: 'The Will to Believe & Moral Courage',
    themeTitleKo: '신념의 의지 — 믿음이 현실을 창조하는 도약',
    pragmaticInsight: '모든 증거가 완벽하게 입증될 때까지 망설이기만 한다면 중요한 기회를 영원히 놓치게 됩니다. 때로는 먼저 믿고 발을 내딛는 결단 자체가 성공이라는 사실을 만들어냅니다.',
    practicalCounsel: '완벽한 확신이 서지 않더라도 양심과 직관이 가리키는 길을 신뢰하십시오. 당신의 용기 있는 첫걸음이 불가능해 보이던 결과를 현실로 창조해 낼 것입니다.',
  },
  {
    themeKey: 'streamOfConsciousness',
    themeTitleEn: 'Stream of Consciousness & Fluid Mind',
    themeTitleKo: '의식의 흐름 — 끊임없이 솟아나는 생각의 강물',
    pragmaticInsight: '우리의 마음은 토막 난 조각의 모음이 아니라 영원히 흘러가는 강물입니다. 지나간 생각의 앙금에 얽매이지 않고 지금 흐르는 생생한 의식의 물결에 몸을 맡길 때 창조성이 만개합니다.',
    practicalCounsel: '과거의 실수나 굳어진 고정관념에 스스로를 가두지 마십시오. 강물이 굽이쳐 흐르듯 매 순간 신선하게 떠오르는 영감과 통찰에 열린 마음으로 귀를 기울이십시오.',
  },
  {
    themeKey: 'pluralisticUniverse',
    themeTitleEn: 'A Pluralistic Universe & Openness',
    themeTitleKo: '다원적 세계 — 단 하나의 정답을 넘어선 풍요',
    pragmaticInsight: '우주는 하나의 폐쇄된 닫힌 상자가 아니라 끊임없이 새로운 가능성이 싹트는 열린 다원적 공간입니다. 타인의 서로 다른 관점과 경험 속에 당신이 미처 보지 못한 풍성한 지혜가 깃들어 있습니다.',
    practicalCounsel: '모든 상황을 "맞다/틀리다"의 이분법으로 재단하지 마십시오. 다양한 관점과 예기치 못한 우연 속에서 가장 실용적이고 조화로운 길을 유연하게 찾아내십시오.',
  },
  {
    themeKey: 'healthyMindedAction',
    themeTitleEn: 'Healthy-Minded Action & Somatic Habit',
    themeTitleKo: '건강한 영혼의 실천 — 행동으로 감정을 바꾸는 지혜',
    pragmaticInsight: '감정이 행동을 이끄는 것처럼 보이지만, 사실 행동과 감정은 함께 움직입니다. 의지의 직접적인 통제하에 있는 행동을 먼저 조절함으로써 간접적으로 감정을 다스릴 수 있습니다.',
    practicalCounsel: '기분이 좋아지기를 마냥 기다리지 마십시오. 가슴을 펴고, 미소를 짓고, 활기차게 걸으십시오. 몸의 당당한 태도가 마침내 마음의 밝은 평온을 불러옵니다.',
  },
];

export const JAMES_APHORISMS: JamesAphorism[] = [
  {
    aphorismKey: 'actAsIf',
    aphorismKo: '당신의 행동이 변화를 일으키는 것처럼 행동하라. 실제로 변화가 일어난다.',
    aphorismEn: 'Act as if what you do makes a difference. It does.',
    sourceContext: '《실용주의(Pragmatism)》',
    actionGuidance: '작은 행동 하나라도 세상을 바꾸는 씨앗이라 믿고 정성껏 행하십시오. 당신의 진정성 있는 실천이 강력한 나비효과를 빚어냅니다.',
  },
  {
    aphorismKey: 'beliefCreatesFact',
    aphorismKo: '믿음이 실제 사실을 창조한다.',
    aphorismEn: 'Faith means belief in something concerning which doubt is theoretically possible; and faith creates the fact.',
    sourceContext: '《신념의 의지(The Will to Believe)》',
    actionGuidance: '미래를 향한 긍정적 확신을 마음에 품으십시오. 당신의 굳건한 신념과 태도가 주변 사람들과 환경을 움직여 원하는 결실을 맺게 합니다.',
  },
  {
    aphorismKey: 'greatestWeaponStress',
    aphorismKo: '스트레스에 맞서는 가장 위대한 무기는, 한 가지 생각 대신 다른 생각을 선택할 수 있는 우리의 능력이다.',
    aphorismEn: 'The greatest weapon against stress is our ability to choose one thought over another.',
    sourceContext: '《심리학의 원리(The Principles of Psychology)》',
    actionGuidance: '부정적인 잡념이 밀려올 때 거기에 끌려다니지 마십시오. 당신에게 힘과 활기를 주는 건설적인 생각으로 의식의 초점을 의연하게 전환하십시오.',
  },
  {
    aphorismKey: 'deepestPrincipleNature',
    aphorismKo: '인간 본성의 가장 깊은 원리는 인정받고자 하는 갈망이다.',
    aphorismEn: 'The deepest principle in human nature is the craving to be appreciated.',
    sourceContext: '《심리학 서간집》',
    actionGuidance: '오늘 만나는 동료나 소중한 사람에게 아낌없는 인정과 감사의 말을 건네십시오. 상대를 인정하는 따뜻한 시선이 최고의 신뢰를 만듭니다.',
  },
  {
    aphorismKey: 'beginNow',
    aphorismKo: '지금 시작하라. 다른 사람이 아닌 당신 자신이 시작하라. 아무리 작은 일이라도 시작하라.',
    aphorismEn: 'If you would change the world, begin with yourself; begin where you are, and begin now.',
    sourceContext: '《실용주의 철학 강연집》',
    actionGuidance: '더 나은 조건이나 타이밍을 기다리며 미루지 마십시오. 지금 당신이 서 있는 자리에서 착수할 수 있는 작은 일부터 힘차게 시작하십시오.',
  },
];

export function calculateAmericanWilliamJamesPragmatism(
  profile?: UserProfile,
  query?: string,
): AmericanWilliamJamesPragmatismResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `WILLIAM-JAMES-PRAGMATISM:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const practicalCashValueIndex = 80 + (absHash % 19);
  const willToBelieveConfidenceScore = 78 + ((absHash >> 3) % 21);
  const streamOfConsciousnessVitalityIndex = 79 + ((absHash >> 6) % 20);
  const pluralisticOpennessScore = 77 + ((absHash >> 9) % 22);
  const healthyMindedResilienceIndex = 81 + ((absHash >> 12) % 18);

  const themeIndex = (absHash >> 5) % JAMES_THEMES.length;
  const aphorismIndex = (absHash >> 8) % JAMES_APHORISMS.length;

  const activeJamesTheme = JAMES_THEMES[themeIndex];
  const focalJamesAphorism = JAMES_APHORISMS[aphorismIndex];

  const guidanceTitle = `윌리엄 제임스 실용주의 지혜: ${activeJamesTheme.themeTitleKo}`;
  const philosophicalCounsel = `미국 실용주의와 현대 심리학의 거장 윌리엄 제임스는 공허한 이론을 넘어 삶에서 구체적 차이를 빚어내는 실천적 현금가치(Cash-Value)와 용기 있는 신념의 의지(The Will to Believe)를 강조합니다. ` +
    `현재 당신의 도전에 가장 큰 힘을 실어주는 핵심 원리는 '${activeJamesTheme.themeTitleKo}'입니다. ` +
    `${activeJamesTheme.practicalCounsel} 아울러 제임스의 명언 "${focalJamesAphorism.aphorismKo}"를 가슴에 품고, ` +
    `${focalJamesAphorism.actionGuidance}`;

  return {
    engineVersion: AMERICAN_WILLIAM_JAMES_VERSION,
    calculatedAtKst: new Date().toISOString(),
    practicalCashValueIndex,
    willToBelieveConfidenceScore,
    streamOfConsciousnessVitalityIndex,
    pluralisticOpennessScore,
    healthyMindedResilienceIndex,
    activeJamesTheme,
    focalJamesAphorism,
    jamesComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAmericanWilliamJamesPragmatismPrompt(
  res: AmericanWilliamJamesPragmatismResult,
): string {
  return [
    `【윌리엄 제임스 《실용주의》 & 《신념의 의지》 실천적 현금가치 지표】`,
    `- 실천적 현금가치 및 유용성 지수(Cash-Value & Fruitfulness): ${res.practicalCashValueIndex}/100`,
    `- 신념의 의지 및 행동 결단력(The Will to Believe & Decisive Action): ${res.willToBelieveConfidenceScore}/100`,
    `- 의식의 흐름 및 심리적 유연성 지표(Stream of Consciousness Flexibility): ${res.streamOfConsciousnessVitalityIndex}/100`,
    `- 다원적 우주 및 다양성 수용도(Pluralistic Universe Openness): ${res.pluralisticOpennessScore}/100`,
    `- 건강한 영혼 및 정서 전환 회복탄력성(Healthy-Mindedness & Somatic Action): ${res.healthyMindedResilienceIndex}/100`,
    `- 핵심 실용주의 테마: ${res.activeJamesTheme.themeTitleKo} [${res.activeJamesTheme.themeTitleEn}]`,
    `- 실용주의적 통찰: ${res.activeJamesTheme.pragmaticInsight}`,
    `- 실천적 조언: ${res.activeJamesTheme.practicalCounsel}`,
    `- 제임스 원전 명언: "${res.focalJamesAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalJamesAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalJamesAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalJamesAphorism.actionGuidance}`,
    `- 종합 제임스 실용 권면: ${res.jamesComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
