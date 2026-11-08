/**
 * 미국 랠프 월도 에머슨(Ralph Waldo Emerson) 《자기신뢰(Self-Reliance)》 & 《자연(Nature)》 오버소울(Over-Soul) 비순응 자립 지혜 엔진
 *
 * 미국 초월주의(Transcendentalism)의 거장이자 정신적 독립선언의 철학자 랠프 월도 에머슨(1803~1882)의 불멸의 고전 《자기신뢰(Self-Reliance)》 및 《자연(Nature)》 원전 기반:
 * 1. 자기신뢰(Self-Reliance): "너 자신을 믿어라. 모든 심장은 이 철철 넘치는 철의 현에 맞추어 뛴다(Trust thyself: every heart vibrates to that iron string)" - 외부의 권위나 사회적 편견에 휘둘리지 않는 주체적 자립.
 * 2. 비순응적 진정성(Nonconformity): "진정한 인간이 되고자 하는 자는 순응주의자가 되어서는 안 된다" - 군중의 유행과 거짓 일관성을 거부하고 매 순간 자기 고유의 진실을 선언하는 용기.
 * 3. 오버소울(Over-Soul / 대령): 모든 인간의 영혼 밑바닥을 흐르는 우주적 신성과의 영적 교감 및 내적 직관에 대한 절대적 신뢰.
 * 4. 자연과의 합일(Transparent Eyeball): "나는 아무것도 아니지만 모든 것을 본다" - 자연 속에서 에고의 오만을 내려놓고 우주적 생명력의 순수한 통로가 되는 투명한 응시.
 * 5. 창조적 독창성(Creative Originality): 모방은 자살(Imitation is suicide)이라는 철칙 아래, 세상에 오직 하나뿐인 자기만의 사명과 예술적 과업을 꽃피우는 담대한 독창성.
 *
 * @version LUCKEY-RALPH-WALDO-EMERSON-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_RALPH_WALDO_EMERSON_VERSION = 'LUCKEY-RALPH-WALDO-EMERSON-v1.0.0';

export interface EmersonTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  transcendentalInsight: string;
  practicalCounsel: string;
}

export interface EmersonAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginalEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface RalphWaldoEmersonSelfRelianceResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 초월주의·자기신뢰 지표 (0~100)
  selfRelianceAutonomyScore: number;         // 자기신뢰 주체적 내적 자립도
  overSoulDivineConnectionScore: number;     // 오버소울 우주 신성 직관력
  nonconformistAuthenticityQuotient: number; // 비순응적 진정성 및 용기 지수
  natureSpiritualRenewalScore: number;       // 자연 합일 영적 치유·정화력
  creativeOriginalityPowerIndex: number;     // 창조적 독창성 및 고유 사명 실천력
  // 세부 분석
  activeEmersonTheme: EmersonTheme;
  focalEmersonAphorism: EmersonAphorism;
  emersonComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const EMERSON_THEMES: EmersonTheme[] = [
  {
    themeKey: 'trust_thyself',
    themeTitleEn: 'Trust Thyself (너 자신을 믿어라)',
    themeTitleKo: '외부의 권위나 평가를 넘어 자기 내면의 신적 불꽃을 신뢰함',
    transcendentalInsight: '사람은 저마다 마음속에 번뜩이는 독창적 빛을 간직하고 있으나, 그것이 자신의 것이라는 이유만으로 무시해버리곤 합니다. 당신의 직관을 가장 먼저 신뢰하십시오.',
    practicalCounsel: '타인의 승인이나 찬사를 기다리지 마십시오. 당신의 내면에서 솟아나는 깊은 확신과 고유한 통찰을 과감히 인정하고 그것을 따라 나아가십시오.',
  },
  {
    themeKey: 'nonconformity_courage',
    themeTitleEn: 'Whoso Would Be a Man Must Be a Nonconformist (비순응의 용기)',
    themeTitleKo: '군중의 압력과 헛된 평판에 굴복하지 않고 소신을 지킴',
    transcendentalInsight: '세상 속에서 세상의 의견을 따르는 것은 쉬우며, 고독 속에서 자신의 생각을 따르는 것도 쉽습니다. 그러나 군중 한가운데서 고독의 독립성을 유지하는 자가 진정 위대합니다.',
    practicalCounsel: '모두가 예라고 할 때 거짓으로 동조하지 마십시오. 고립과 비난을 두려워하지 말고, 당신의 양심과 이성이 가리키는 정직한 방향을 단호히 표명하십시오.',
  },
  {
    themeKey: 'foolish_consistency',
    themeTitleEn: 'A Foolish Consistency is the Hobgoblin of Little Minds (어리석은 일관성 탈피)',
    themeTitleKo: '과거의 말과 행동에 얽매이지 않고 오늘 새 진리를 과감히 말함',
    transcendentalInsight: '어제 한 말에 얽매여 오늘 깨달은 새로운 진실을 부정하지 마십시오. 오직 작은 마음들만이 맹목적인 일관성에 집착합니다. 오늘 진실하다고 느끼는 바를 대포알처럼 말하십시오.',
    practicalCounsel: '과거의 선언이나 기존 계획에 스스로를 가두지 마십시오. 새로운 정보와 통찰을 얻었다면 기꺼이 어제의 오해를 인정하고 오늘의 새로운 길을 개척하십시오.',
  },
  {
    themeKey: 'transparent_eyeball',
    themeTitleEn: 'The Transparent Eyeball (투명한 눈동자 - 자연과의 일체)',
    themeTitleKo: '에고의 탐욕을 비우고 대자연의 순수 생명 흐름과 합일함',
    transcendentalInsight: '숲속에 서 있을 때 모든 비천한 욕망은 사라지고 나 자신은 무가 되지만 동시에 모든 것을 보게 됩니다. 우주 영혼의 조류가 내 혈관을 타고 흐릅니다.',
    practicalCounsel: '도시의 소음과 스크린을 잠시 벗어나 숲과 바람과 하늘을 온전히 마주하십시오. 영혼의 때를 씻어내고 우주적 활력을 내면 깊숙이 호흡하십시오.',
  },
  {
    themeKey: 'imitation_is_suicide',
    themeTitleEn: 'Imitation is Suicide (모방은 자살이다)',
    themeTitleKo: '남의 옷을 흉내 내지 않고 오직 자기 고유의 잠재력을 꽃피움',
    transcendentalInsight: '남의 밭에 떨어진 옥수수를 부러워하지 마십시오. 신은 당신에게 경작해야 할 당신만의 땅을 주었습니다. 당신만이 할 수 있는 일을 할 때 온 우주가 돕습니다.',
    practicalCounsel: '남과 비교하며 스스로를 깎아내리지 마십시오. 당신의 독특한 개성, 상처, 경험이야말로 세상에 둘도 없는 예술품을 낳을 거름입니다.',
  },
];

export const EMERSON_APHORISMS: EmersonAphorism[] = [
  {
    aphorismKey: 'iron_string',
    aphorismKo: '너 자신을 믿어라. 모든 심장은 이 철철 넘치는 철의 현에 맞추어 뛴다.',
    aphorismOriginalEn: 'Trust thyself: every heart vibrates to that iron string.',
    sourceContext: '《자기신뢰(Self-Reliance)》 서두',
    actionGuidance: '자기 회의와 망설임을 끝내고, 당신 내면의 가장 깊고 원초적인 힘을 신뢰하며 결단하십시오.',
  },
  {
    aphorismKey: 'insist_on_yourself',
    aphorismKo: '너 자신을 고집하라. 결코 남을 흉내 내지 말라.',
    aphorismOriginalEn: 'Insist on yourself; never imitate.',
    sourceContext: '《자기신뢰(Self-Reliance)》 결어부',
    actionGuidance: '외부의 모방본으로 남지 말고, 당신의 영혼에서 우러나온 독창적인 산출물과 방식을 세상에 내놓으십시오.',
  },
  {
    aphorismKey: 'speak_hard_words',
    aphorismKo: '오늘 생각한 바를 단단한 말로 거침없이 말하라. 그리고 내일은 내일 생각한 바를 다시 말하라.',
    aphorismOriginalEn: 'Speak what you think now in hard words, and to-morrow speak what to-morrow thinks.',
    sourceContext: '《자기신뢰(Self-Reliance)》',
    actionGuidance: '주변의 눈치를 보느라 생각을 검열하지 말고, 당신의 솔직하고 명확한 관점을 당당하게 전달하십시오.',
  },
  {
    aphorismKey: 'nature_heals',
    aphorismKo: '자연 속에서 인간은 영원한 젊음을 되찾는다.',
    aphorismOriginalEn: 'In the woods is perpetual youth.',
    sourceContext: '《자연(Nature)》 제1장',
    actionGuidance: '지친 심신을 자연의 리듬 속에 맡기고, 신선한 기운으로 새로운 아이디어와 활력을 충전하십시오.',
  },
  {
    aphorismKey: 'stars_glory',
    aphorismKo: '천 년에 하룻밤만 별이 뜬다면 사람들은 얼마나 경외하며 신의 도성을 우러러보겠는가.',
    aphorismOriginalEn: 'If the stars should appear one night in a thousand years, how would men believe and adore!',
    sourceContext: '《자연(Nature)》 서장',
    actionGuidance: '일상의 사소한 순간과 마주하는 사람들의 소중함을 당연하게 여기지 말고, 깊은 감사와 경이로움으로 대하십시오.',
  },
];

export function calculateRalphWaldoEmersonSelfReliance(
  profile: UserProfile
): RalphWaldoEmersonSelfRelianceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `RALPH-WALDO-EMERSON:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const selfRelianceAutonomyScore = 75 + (absHash % 24);
  const overSoulDivineConnectionScore = 71 + ((absHash >> 3) % 28);
  const nonconformistAuthenticityQuotient = 73 + ((absHash >> 6) % 26);
  const natureSpiritualRenewalScore = 70 + ((absHash >> 9) % 29);
  const creativeOriginalityPowerIndex = 72 + ((absHash >> 12) % 27);

  const themeIndex = (absHash >> 4) % EMERSON_THEMES.length;
  const aphorismIndex = (absHash >> 7) % EMERSON_APHORISMS.length;

  const activeEmersonTheme = EMERSON_THEMES[themeIndex];
  const focalEmersonAphorism = EMERSON_APHORISMS[aphorismIndex];

  const guidanceTitle = `랠프 월도 에머슨 자기신뢰·초월주의 지혜: ${activeEmersonTheme.themeTitleKo}`;
  const philosophicalCounsel = `에머슨의 자기신뢰 철학은 타인의 시선과 사회적 모방을 단호히 거부하고, 내면의 신적 직관을 믿고 우뚝 서도록 이끕니다. ` +
    `현재 당신이 직면한 핵심 과제는 '${activeEmersonTheme.themeTitleKo}'입니다. ` +
    `${activeEmersonTheme.practicalCounsel} 아울러 에머슨의 경구 "${focalEmersonAphorism.aphorismKo}"("${focalEmersonAphorism.aphorismOriginalEn}")를 마음에 품고, ` +
    `${focalEmersonAphorism.actionGuidance}`;

  return {
    engineVersion: AMERICAN_RALPH_WALDO_EMERSON_VERSION,
    calculatedAtKst: new Date().toISOString(),
    selfRelianceAutonomyScore,
    overSoulDivineConnectionScore,
    nonconformistAuthenticityQuotient,
    natureSpiritualRenewalScore,
    creativeOriginalityPowerIndex,
    activeEmersonTheme,
    focalEmersonAphorism,
    emersonComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatRalphWaldoEmersonSelfReliancePrompt(res: RalphWaldoEmersonSelfRelianceResult): string {
  return [
    `【랠프 월도 에머슨 《자기신뢰》 & 《자연》 오버소울 비순응 자립 지표】`,
    `- 자기신뢰 주체적 내적 자립도(Self-Reliance): ${res.selfRelianceAutonomyScore}/100`,
    `- 오버소울 우주 신성 직관력(Over-Soul): ${res.overSoulDivineConnectionScore}/100`,
    `- 비순응적 진정성 용기 지수(Nonconformity): ${res.nonconformistAuthenticityQuotient}/100`,
    `- 자연 합일 영적 치유·정화력(Nature): ${res.natureSpiritualRenewalScore}/100`,
    `- 창조적 독창성 사명 실천력(Originality): ${res.creativeOriginalityPowerIndex}/100`,
    `- 핵심 초월주의 테마: ${res.activeEmersonTheme.themeTitleKo} [${res.activeEmersonTheme.themeTitleEn}]`,
    `- 초월주의적 통찰: ${res.activeEmersonTheme.transcendentalInsight}`,
    `- 실천적 조언: ${res.activeEmersonTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalEmersonAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalEmersonAphorism.aphorismOriginalEn}" [${res.focalEmersonAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalEmersonAphorism.actionGuidance}`,
    `- 종합 철학 권면: ${res.emersonComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
