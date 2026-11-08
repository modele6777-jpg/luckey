/**
 * 오스트리아/유대 빅터 프랭클(Viktor Frankl) 《죽음의 수용소에서(Man's Search for Meaning)》 & 《로고테라피(Logotherapy)》 시련 속 최후의 자유 & 의미를 향한 의지(Wille zum Sinn)와 비극적 낙관주의 엔진
 *
 * 제3 비엔나 정신치료학파 창시자이자 실존분석·로고테라피의 거장 빅터 프랭클(Viktor E. Frankl, 1905~1997)의 핵심 원전 기반:
 * 1. 최후의 인간적 자유 (The Last of Human Freedoms): 나치 수용소의 극단적 박탈 속에서도 그 누구도 빼앗을 수 없는 단 하나의 자유는 바로 '자신의 고난에 어떤 태도를 취할 것인가'를 선택하는 내면의 결단임.
 * 2. 의미를 향한 의지 (Wille zum Sinn): 쾌락이나 권력보다 앞서는 인간의 가장 깊은 실존적 동기는 고유한 삶의 의미와 목적을 발견하고 실현하려는 갈망임.
 * 3. 비극적 낙관주의 (Tragic Optimism): 고통(Pain), 죄책감(Guilt), 죽음(Death)이라는 인생의 비극적 삼원조 앞에서도 이를 성숙과 배움, 책임 있는 결단으로 전환해 내는 위대한 영적 회복탄력성.
 * 4. 자기초월성 (Self-Transcendence): 인간은 자아에 집착할 때 길을 잃으며, 오직 타인을 향한 헌신, 사랑, 창조적 과업을 향해 자신을 내어줄 때 비로소 진정한 자아를 완성함.
 * 5. 실존적 책임성 (Verantwortlichkeit): 삶이 내게 무엇을 줄 것인가를 묻지 않고, 삶이 내게 던지는 질문과 부름에 온 인격으로 응답하고 책임을 다하는 성숙한 실존.
 *
 * @version LUCKEY-VIKTOR-FRANKL-LOGOTHERAPY-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_VIKTOR_FRANKL_VERSION = 'LUCKEY-VIKTOR-FRANKL-LOGOTHERAPY-v1.0.0';

export interface FranklTheme {
  themeKey: string;
  themeTitleGerman: string;
  themeTitleKo: string;
  logotherapyInsight: string;
  practicalCounsel: string;
}

export interface FranklAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGermanOrEnglish: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface ViktorFranklLogotherapyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 프랭클 로고테라피 지표 (0~100)
  lastHumanFreedomAttitudeScore: number;      // 시련 속 최후의 자유인 태도 선택력 (The Last Human Freedom)
  willToMeaningDriveScore: number;            // 삶의 의미를 향한 근원적 의지 지수 (Wille zum Sinn / Will to Meaning)
  tragicOptimismResilienceScore: number;      // 고통을 성숙과 존엄으로 전환하는 비극적 낙관주의 (Tragic Optimism)
  selfTranscendenceDedicationScore: number;   // 자아를 넘어 타인과 가치를 향하는 자기초월성 (Self-Transcendence)
  lifeResponsibilityIntegrityIndex: number;   // 삶의 부름에 인격으로 응답하는 실존적 책임성 (Verantwortlichkeit)
  // 세부 분석
  activeFranklTheme: FranklTheme;
  focalFranklAphorism: FranklAphorism;
  franklComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const FRANKL_THEMES: FranklTheme[] = [
  {
    themeKey: 'last_human_freedom',
    themeTitleGerman: 'Die letzte menschliche Freiheit (최후의 인간적 자유)',
    themeTitleKo: '어떤 환경에서도 빼앗길 수 없는 태도를 선택하는 자유',
    logotherapyInsight: '주변 상황과 환경이 당신의 모든 것을 빼앗아 갈지라도, 그 상황에 어떤 태도로 맞설 것인가를 결정하는 마지막 자유만은 당신의 내면에 온전히 남아 있습니다.',
    practicalCounsel: '상황을 당장 바꿀 수 없다면, 그 상황을 대하는 당신의 내적 태도를 바꾸십시오. 바로 그 선택 속에 그 누구도 침범할 수 없는 당신의 고결한 존엄이 살아납니다.',
  },
  {
    themeKey: 'will_to_meaning',
    themeTitleGerman: 'Der Wille zum Sinn (의미를 향한 의지)',
    themeTitleKo: '공허한 쾌락을 넘어 고유한 삶의 이유를 발견하는 힘',
    logotherapyInsight: '인간은 고통 자체 때문에 무너지는 것이 아니라, 고통의 이유를 알지 못할 때 절망합니다. 살아야 할 이유(Why)를 품은 사람은 어떤 어려움(How)도 견뎌낼 수 있습니다.',
    practicalCounsel: '겉치레 성공이나 일시적 자극에 안주하지 마십시오. 당신의 남은 인생에서 오직 당신만이 완수할 수 있는 의미 있는 과업과 사람을 찾으십시오.',
  },
  {
    themeKey: 'tragic_optimism',
    themeTitleGerman: 'Der tragische Optimismus (비극적 낙관주의)',
    themeTitleKo: '시련과 상처를 인간적 성숙과 깊은 지혜로 승화',
    logotherapyInsight: '고통을 피할 수 없을 때 우리는 비로소 우리 자신을 변화시키도록 부름받습니다. 시련은 영혼의 군더더기를 태워 없애고 가장 순수한 인간성을 벼려내는 용광로입니다.',
    practicalCounsel: '상처를 부끄러워하거나 숨기지 마십시오. 그 상처를 통해 타인의 아픔을 헤아리는 깊은 지혜와 따뜻한 공감의 빛을 밝히십시오.',
  },
  {
    themeKey: 'self_transcendence',
    themeTitleGerman: 'Die Selbst-Transzendenz (자기초월성)',
    themeTitleKo: '자기중심성을 벗어나 더 높은 가치와 타인에게 헌신',
    logotherapyInsight: '행복은 직접 쫓아간다고 얻을 수 있는 것이 아니라, 가치 있는 대의에 헌신하거나 누군가를 진정으로 사랑할 때 뒤따라오는 필연적인 결과물입니다.',
    practicalCounsel: '나의 고민과 결핍에만 갇혀 전전긍긍하지 마십시오. 당신의 손길을 간절히 필요로 하는 일과 사람에게 온 마음을 쏟아부을 때 참된 치유가 찾아옵니다.',
  },
  {
    themeKey: 'call_of_responsibility',
    themeTitleGerman: 'Die Verantwortlichkeit (삶에 대한 온전한 책임)',
    themeTitleKo: '삶이 내게 무엇을 줄까 묻지 않고 삶의 물음에 응답하는 삶',
    logotherapyInsight: '인생에 "내게 무엇을 줄 것인가"를 묻지 마십시오. 진정한 주체는 삶이 내게 던지는 물음에 성실과 책임으로 응답하는 자입니다.',
    practicalCounsel: '오늘 당신에게 주어진 시간과 과업을 가볍게 여기지 마십시오. 마치 두 번째 기회를 얻은 사람처럼, 후회 없이 매 순간을 충실하게 책임지십시오.',
  },
];

export const FRANKL_APHORISMS: FranklAphorism[] = [
  {
    aphorismKey: 'attitude_choice',
    aphorismKo: '인간에게서 모든 것을 빼앗을 수 있어도, 단 한 가지, 주어진 환경에서 자신의 태도를 선택하는 자유만은 결코 빼앗을 수 없다.',
    aphorismGermanOrEnglish: 'Everything can be taken from a man but one thing: the last of the human freedoms—to choose one’s attitude in any given set of circumstances. (Man’s Search for Meaning)',
    sourceContext: '《죽음의 수용소에서(Man’s Search for Meaning)》',
    actionGuidance: '어떤 불운이나 고난 앞에서도 굴복하지 마십시오. 품위와 용기를 잃지 않겠다는 당신의 결단이 어둠 속의 등불이 됩니다.',
  },
  {
    aphorismKey: 'why_to_live',
    aphorismKo: '살아야 할 이유가 있는 사람은 그 어떤 시련도 기꺼이 견뎌낼 수 있다.',
    aphorismGermanOrEnglish: 'He who has a why to live can bear almost any how. (Friedrich Nietzsche / Viktor Frankl, Man’s Search for Meaning)',
    sourceContext: '《죽음의 수용소에서》 인용',
    actionGuidance: '당신을 살아가게 만드는 가장 소중한 가치와 사람을 떠올리십시오. 그 사랑과 사명이 당신을 다시 일으켜 세웁니다.',
  },
  {
    aphorismKey: 'change_ourselves',
    aphorismKo: '우리가 더 이상 상황을 변화시킬 수 없을 때, 우리는 비로소 우리 자신을 변화시키도록 도전받는다.',
    aphorismGermanOrEnglish: 'When we are no longer able to change a situation, we are challenged to change ourselves. (Man’s Search for Meaning)',
    sourceContext: '《죽음의 수용소에서》',
    actionGuidance: '억지 통제를 내려놓고 내면의 성숙에 집중하십시오. 당신이 깊어질 때 상황을 바라보는 온 세상이 달라집니다.',
  },
  {
    aphorismKey: 'live_as_if_second_time',
    aphorismKo: '마치 지금 살고 있는 삶이 두 번째 삶인 것처럼, 그리고 첫 번째 삶에서 저질렀던 실수를 지금 다시 반복하려는 순간인 것처럼 오늘을 살아라.',
    aphorismGermanOrEnglish: 'Live as if you were living already for the second time and as if you had acted the first time as wrongly as you are about to act now! (Man’s Search for Meaning)',
    sourceContext: '로고테라피 정언명령',
    actionGuidance: '습관적인 나태와 안일한 타협을 경계하십시오. 오늘이라는 선물을 두 번째 기회처럼 가장 숭고하게 쓰십시오.',
  },
];

export function calculateViktorFranklLogotherapy(
  profile: UserProfile
): ViktorFranklLogotherapyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `VIKTOR-FRANKL-LOGOTHERAPY:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const lastHumanFreedomAttitudeScore = 75 + (absHash % 24);
  const willToMeaningDriveScore = 74 + ((absHash >> 3) % 25);
  const tragicOptimismResilienceScore = 72 + ((absHash >> 6) % 27);
  const selfTranscendenceDedicationScore = 73 + ((absHash >> 9) % 26);
  const lifeResponsibilityIntegrityIndex = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % FRANKL_THEMES.length;
  const aphorismIndex = (absHash >> 7) % FRANKL_APHORISMS.length;

  const activeFranklTheme = FRANKL_THEMES[themeIndex];
  const focalFranklAphorism = FRANKL_APHORISMS[aphorismIndex];

  const guidanceTitle = `빅터 프랭클 로고테라피 의미치료: ${activeFranklTheme.themeTitleKo}`;
  const philosophicalCounsel = `빅터 프랭클의 로고테라피는 고통의 한복판에서도 결코 꺼지지 않는 삶의 의미와 최후의 자유를 일깨웁니다. ` +
    `현재 당신의 심령을 지탱하는 핵심 영적 원리는 '${activeFranklTheme.themeTitleKo}'입니다. ` +
    `${activeFranklTheme.practicalCounsel} 아울러 원전의 불멸의 치유 경구 "${focalFranklAphorism.aphorismKo}"(${focalFranklAphorism.aphorismGermanOrEnglish})을 마음에 품고, ` +
    `${focalFranklAphorism.actionGuidance}`;

  return {
    engineVersion: AUSTRIAN_VIKTOR_FRANKL_VERSION,
    calculatedAtKst: new Date().toISOString(),
    lastHumanFreedomAttitudeScore,
    willToMeaningDriveScore,
    tragicOptimismResilienceScore,
    selfTranscendenceDedicationScore,
    lifeResponsibilityIntegrityIndex,
    activeFranklTheme,
    focalFranklAphorism,
    franklComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatViktorFranklLogotherapyPrompt(res: ViktorFranklLogotherapyResult): string {
  return [
    `【빅터 프랭클 《죽음의 수용소에서》 시련 속 최후의 자유 & 의미치료 지표】`,
    `- 최후의 자유 태도 선택력(Freedom): ${res.lastHumanFreedomAttitudeScore}/100`,
    `- 의미를 향한 근원적 의지(Wille zum Sinn): ${res.willToMeaningDriveScore}/100`,
    `- 비극적 낙관주의 회복탄력성(Optimismus): ${res.tragicOptimismResilienceScore}/100`,
    `- 자아초월 가치·타인 헌신도(Transzendenz): ${res.selfTranscendenceDedicationScore}/100`,
    `- 삶의 부름 실존 책임성(Verantwortung): ${res.lifeResponsibilityIntegrityIndex}/100`,
    `- 핵심 의미치료 테마: ${res.activeFranklTheme.themeTitleKo} [${res.activeFranklTheme.themeTitleGerman}]`,
    `- 로고테라피 통찰: ${res.activeFranklTheme.logotherapyInsight}`,
    `- 실천적 조언: ${res.activeFranklTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalFranklAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalFranklAphorism.aphorismGermanOrEnglish}" [${res.focalFranklAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalFranklAphorism.actionGuidance}`,
    `- 종합 의미치료 권면: ${res.franklComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
