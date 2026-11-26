/**
 * 독일 위르겐 하버마스(Jürgen Habermas) 《의사소통행위이론》 & 《공론장의 구조변동》 더 나은 논증의 힘·상호이해 지향·이상적 담화 상황·생활세계 식민화 극복 지혜 엔진
 *
 * 20세기 비판 이론 프랑크푸르트학파 2세대 거장 위르겐 하버마스(1929~)의 원전 기반:
 * 1. 더 나은 논증의 강제 없는 힘 지표 (Unforced Force of Better Argument Score): 완력이나 감정적 억압 대신 투명한 논리와 타당성 있는 설득력으로 자발적 동의를 이끌어내는 역량.
 * 2. 상호이해 지향성 및 왜곡 없는 소통력 (Mutual Understanding Orientation Index): 내 입장만 관철하려는 전략적 책략을 버리고, 서로의 입장을 공평하게 이해하려는 진정성 있는 대화 태도.
 * 3. 이상적 담화 상황 구현 및 공평성 지표 (Ideal Speech Situation & Discourse Equality Score): 모든 이해관계자가 동등한 발언권과 경청의 기회를 누리도록 편견 없는 공론장을 조성하는 협력력.
 * 4. 생활세계의 식민화 방어 및 인간성 수호 지수 (Lifeworld Colonization Resistance Index): 돈과 권력, 기계적 효율성의 논리가 삶의 본질적 의미와 따뜻한 유대를 침범하지 못하도록 지켜내는 주체성.
 * 5. 숙의적 공감 및 성숙한 합의 도출력 (Deliberative Consensus & Co-Creative Synthesis Score): 성급한 타협이나 독단을 넘어 깊이 있는 숙의(Deliberation)를 통해 모두가 상생하는 차원 높은 해법을 창출하는 역량.
 *
 * @version LUCKEY-JURGEN-HABERMAS-COMMUNICATIVE-ACTION-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_JURGEN_HABERMAS_COMMUNICATIVE_ACTION_VERSION = 'LUCKEY-JURGEN-HABERMAS-COMMUNICATIVE-ACTION-v2.4.0';

export interface HabermasTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface HabermasAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanJurgenHabermasCommunicativeActionResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 위르겐 하버마스 핵심 지표 (0~100)
  betterArgumentUnforcedForceScore: number;     // 더 나은 논증의 강제 없는 힘 지표 (Unforced Force of Better Argument)
  mutualUnderstandingOrientationIndex: number;  // 상호이해 지향성 및 왜곡 없는 소통력 (Mutual Understanding Orientation)
  idealSpeechSituationFairnessScore: number;    // 이상적 담화 상황 구현 및 공평성 지표 (Ideal Speech Situation Fairness)
  lifeworldColonizationDefenseIndex: number;    // 생활세계의 식민화 방어 및 인간성 수호 지수 (Lifeworld Colonization Resistance)
  deliberativeDemocraticConsensusScore: number; // 숙의적 공감 및 성숙한 합의 도출력 (Deliberative Consensus Synthesis)
  // 세부 분석
  activeHabermasTheme: HabermasTheme;
  focalHabermasAphorism: HabermasAphorism;
  secondaryHabermasAphorism: HabermasAphorism;
  habermasCrossAxis: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  habermasComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  habermasSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const HABERMAS_THEMES: HabermasTheme[] = [
  {
    themeKey: 'forceOfBetterArgument',
    themeTitleEn: 'Unforced Force of the Better Argument: Persuading through Transparent Reason and Evidence',
    themeTitleKo: '더 나은 논증의 힘 — 완력과 감정 대신 명쾌한 근거와 투명한 이성으로 설득하기',
    pragmaticInsight: '하버마스는 진정한 합의란 외부의 물리적 강제나 위계에 의한 것이 아니라, 오직 ‘더 나은 논증의 강제 없는 힘(Der zwanglose Zwang des besseren Arguments)’을 통해서만 도달할 수 있다고 역설합니다.',
    practicalCounsel: '목소리를 높이거나 지위를 이용해 상대를 굴복시키려 하지 마십시오. 탄탄한 근거와 진솔한 논리를 갖추고 차분하게 설명하십시오. 자발적으로 납득된 동의만이 가장 견고한 협력을 만듭니다.',
  },
  {
    themeKey: 'communicativeUnderstanding',
    themeTitleEn: 'Communicative Action: Prioritizing Sincere Mutual Understanding over Strategic Manipulation',
    themeTitleKo: '상호이해의 의사소통 — 상대를 통제하려는 전략적 책략을 버리고 진정한 공감 나누기',
    pragmaticInsight: '타인을 나의 목적을 위한 수단으로 이용하는 ‘전략적 행위’는 결국 불신을 낳습니다. 진정한 ‘의사소통적 행위’는 서로의 시각 차이를 인정하고 공통의 이해를 목표로 할 때 실현됩니다.',
    practicalCounsel: '상대방의 약점을 잡아 이기려 들지 마십시오. 상대방이 진정으로 무엇을 걱정하고 바라는지 경청하고 공감하십시오. 서로를 동등한 대화의 주체로 대할 때 불가능해 보였던 매듭이 풀립니다.',
  },
  {
    themeKey: 'defendingLifeworld',
    themeTitleEn: 'Protecting the Lifeworld: Shielding Human Meaning from the Invasion of Money and Power',
    themeTitleKo: '생활세계의 방어 — 효율성과 돈의 논리에 잠식당하지 않고 삶의 본래적 의미 지키기',
    pragmaticInsight: '화폐와 권력이라는 시스템의 미디어가 인간의 일상적 소통과 따뜻한 연대인 ‘생활세계(Lebenswelt)’를 식민화할 때 영혼은 소외되고 피폐해집니다.',
    practicalCounsel: '모든 관계와 결정을 단순한 가성비나 손익의 숫자로만 환산하지 마십시오. 신뢰, 다정함, 양심, 공동체적 연대라는 생활세계의 가치를 지켜내십시오. 그것이 당신의 정신을 지탱하는 가장 든든한 방파제입니다.',
  },
  {
    themeKey: 'idealSpeechDiscourse',
    themeTitleEn: 'Ideal Speech Situation: Creating Transparent Forums where All Voices are Heard Fairly',
    themeTitleKo: '이상적 담화 상황 — 편견 없이 모두가 자유롭게 목소리를 낼 수 있는 투명한 환경 만들기',
    pragmaticInsight: '어느 한쪽이 발언을 독점하거나 침묵을 강요당하는 곳에서는 올바른 결정이 나올 수 없습니다. 이상적 담화 상황은 모든 이가 자유롭게 의문을 제기하고 대안을 모색할 수 있는 열린 공론장입니다.',
    practicalCounsel: '다른 사람들의 피드백과 이견을 억누르지 마십시오. 작은 목소리에도 귀를 기울이고 모든 정보를 투명하게 공유하십시오. 토론의 장이 투명할수록 결론의 질과 신뢰도는 기하급수적으로 높아집니다.',
  },
];

export const HABERMAS_APHORISMS: HabermasAphorism[] = [
  {
    aphorismKey: 'betterArgumentPower',
    aphorismKo: '우리가 이성적이라 부를 수 있는 것은 오직 하나, 더 나은 논증의 강제 없는 힘에 기꺼이 승복할 때뿐이다.',
    aphorismGerman: 'Der zwanglose Zwang des besseren Argumentes ist das einzige Kriterium der Rationalität.',
    sourceContext: '위르겐 하버마스 《의사소통행위이론(Theorie des kommunikativen Handelns)》',
    actionGuidance: '고집이나 자존심을 앞세우지 마십시오. 더 타당한 근거와 지혜가 나타났을 때 흔쾌히 수용하고 발전의 발판으로 삼으십시오.',
  },
  {
    aphorismKey: 'communicativeIntersubjectivity',
    aphorismKo: '참된 진리는 고립된 개인의 독백에서 나오지 않는다. 그것은 주체들 사이의 왜곡 없는 대화 속에서 함께 발견된다.',
    aphorismGerman: 'Wahrheit ist an die Idee einer intersubjektiven Übereinstimmung gebunden.',
    sourceContext: '위르겐 하버마스 《진리와 정당화(Wahrheit und Rechtfertigung)》',
    actionGuidance: '혼자 방에 틀어박혀 모든 것을 해결하려 하지 마십시오. 신뢰할 수 있는 동료들과 솔직하게 논의하며 더 큰 혜안을 모으십시오.',
  },
  {
    aphorismKey: 'publicSphereDemocracy',
    aphorismKo: '공론장은 시민들이 대등한 자격으로 만나 공통의 문제를 이성적으로 토론하는 민주주의의 심장이다.',
    aphorismGerman: 'Die Öffentlichkeit ist der Resonanzboden für die Probleme, die in der Gesellschaft gelöst werden müssen.',
    sourceContext: '위르겐 하버마스 《공론장의 구조변동(Strukturwandel der Öffentlichkeit)》',
    actionGuidance: '문제를 밀실에서 은폐하지 마십시오. 이해관계자들과 열린 장에서 소통하고 투명한 프로세스를 확립하십시오.',
  },
  {
    aphorismKey: 'lifeworldSolidarity',
    aphorismKo: '사회적 연대는 결코 시장의 교환 가치나 관료적 지침만으로 대체될 수 없다. 그것은 일상적인 소통적 실천을 통해 재생산된다.',
    aphorismGerman: 'Solidarität kann weder durch Geld noch durch bürokratische Macht erzeugt werden.',
    sourceContext: '위르겐 하버마스 《타자의 포용(Die Einbeziehung des Anderen)》',
    actionGuidance: '동료와 가족, 이웃들과의 따뜻한 유대감을 소홀히 하지 마십시오. 진심 어린 대화와 배려가 가장 강력한 연대의 토대입니다.',
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

function formatHabermasKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function buildHabermasReflectiveQuestion(theme: HabermasTheme, query?: string): string {
  const trimmed = query?.trim();
  if (trimmed) {
    return `'${trimmed}'의 대화에서 상대를 이기려는 전략적 셈법을 멈추고, 더 나은 논증과 상호이해가 자랄 수 있게 내가 먼저 열어야 할 말의 자리는 무엇인가요? (${theme.themeTitleKo})`;
  }
  return `지금 내 일상의 관계(생활세계)를 숫자와 효율의 논리로부터 지켜내기 위해 진심으로 귀 기울여야 할 목소리는 누구의 것인가요? (${theme.themeTitleKo})`;
}

function describeHabermasStage(score: number): string {
  if (score >= 94) return '열린 공론장기 (더 나은 논증의 강제 없는 힘이 자연스럽게 합의를 이끄는 흐름)';
  if (score >= 90) return '상호이해 균형기 (전략적 계산을 내려놓고 진정성 있는 대화가 이어지는 국면)';
  return '생활세계 수호기 (외부의 효율 압박 속에서도 관계의 온기와 의미를 지켜내는 흐름)';
}

export function calculateGermanJurgenHabermasCommunicativeAction(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): GermanJurgenHabermasCommunicativeActionResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `JURGEN-HABERMAS-COMMUNICATIVE-ACTION:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const betterArgumentUnforcedForceScore = 89 + ((absHash >> 1) % 10);
  const mutualUnderstandingOrientationIndex = 88 + ((absHash >> 4) % 11);
  const idealSpeechSituationFairnessScore = 87 + ((absHash >> 7) % 12);
  const lifeworldColonizationDefenseIndex = 89 + ((absHash >> 10) % 10);
  const deliberativeDemocraticConsensusScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % HABERMAS_THEMES.length;
  const aphorismIndex = (absHash >> 8) % HABERMAS_APHORISMS.length;
  const secondaryOffset = 1 + ((absHash >> 11) % (HABERMAS_APHORISMS.length - 1));
  const secondaryAphorismIndex = (aphorismIndex + secondaryOffset) % HABERMAS_APHORISMS.length;

  const activeHabermasTheme = HABERMAS_THEMES[themeIndex];
  const focalHabermasAphorism = HABERMAS_APHORISMS[aphorismIndex];
  const secondaryHabermasAphorism = HABERMAS_APHORISMS[secondaryAphorismIndex];
  const habermasCrossAxis = `${activeHabermasTheme.themeTitleKo} × ${focalHabermasAphorism.sourceContext} ↔ ${secondaryHabermasAphorism.sourceContext}`;
  const reflectiveQuestion = buildHabermasReflectiveQuestion(activeHabermasTheme, query);
  const ritualAction = focalHabermasAphorism.actionGuidance;
  const reflectionFocus = reflectiveQuestion;
  const interpretiveBoundary = '하버마스 의사소통행위 관점은 관계의 성패를 단정하거나 상대를 심판하는 도구가 아니라, 왜곡 없는 대화와 상호이해를 비추는 비판철학적 성찰 렌즈입니다.';

  const guidanceTitle = `위르겐 하버마스 의사소통과 공론장의 지혜: ${activeHabermasTheme.themeTitleKo}`;
  const philosophicalCounsel = `현대 비판 이론의 거목 위르겐 하버마스 선생은 《의사소통행위이론》과 《공론장의 구조변동》을 통해 ` +
    `억압 없는 '더 나은 논증의 힘(Der zwanglose Zwang des besseren Arguments)', 왜곡 없는 상호이해 지향, ` +
    `모두가 공평하게 참여하는 이상적 담화 상황, 그리고 돈과 권력에 잠식당하지 않는 생활세계(Lebenswelt)의 자율성을 역설했습니다. ` +
    `현재 당신이 마주한 상황에서 가장 강력한 통합의 열쇠는 '${activeHabermasTheme.themeTitleKo}'입니다. ` +
    `${activeHabermasTheme.practicalCounsel} 하버마스의 명언 "${focalHabermasAphorism.aphorismKo}" (${focalHabermasAphorism.aphorismGerman})을 가슴에 품고, ` +
    `${focalHabermasAphorism.actionGuidance}`;

  const habermasSynthesisMatrix = {
    dominantTension: `${activeHabermasTheme.themeTitleKo} ↔ ${focalHabermasAphorism.sourceContext}`,
    alignmentState:
      betterArgumentUnforcedForceScore >= 92 && lifeworldColonizationDefenseIndex >= 92
        ? '더 나은 논증과 생활세계 연대의 고차원 공명'
        : '왜곡 없는 상호이해와 열린 담화 질서를 세우는 국면',
    integratedAction: `${activeHabermasTheme.practicalCounsel} (${focalHabermasAphorism.actionGuidance})`,
  };

  return {
    engineVersion: GERMAN_JURGEN_HABERMAS_COMMUNICATIVE_ACTION_VERSION,
    calculatedAtKst: formatHabermasKstTimestamp(now),
    betterArgumentUnforcedForceScore,
    mutualUnderstandingOrientationIndex,
    idealSpeechSituationFairnessScore,
    lifeworldColonizationDefenseIndex,
    deliberativeDemocraticConsensusScore,
    activeHabermasTheme,
    focalHabermasAphorism,
    secondaryHabermasAphorism,
    habermasCrossAxis,
    reflectiveQuestion,
    ritualAction,
    reflectionFocus,
    interpretiveBoundary,
    habermasComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    habermasSynthesisMatrix,
  };
}

export function formatGermanJurgenHabermasCommunicativeActionPrompt(
  res: GermanJurgenHabermasCommunicativeActionResult,
): string {
  const lines = [
    `【위르겐 하버마스 《의사소통행위이론》 더 나은 논증의 힘·공론장 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 더 나은 논증의 강제 없는 힘(Unforced Force of Better Argument): ${describeHabermasStage(res.betterArgumentUnforcedForceScore)}`,
    `- 상호이해 지향성 및 왜곡 없는 소통력(Mutual Understanding Orientation): ${describeHabermasStage(res.mutualUnderstandingOrientationIndex)}`,
    `- 이상적 담화 상황 구현 및 공평성(Ideal Speech Situation Fairness): ${describeHabermasStage(res.idealSpeechSituationFairnessScore)}`,
    `- 생활세계의 식민화 방어 및 인간성 수호(Lifeworld Colonization Resistance): ${describeHabermasStage(res.lifeworldColonizationDefenseIndex)}`,
    `- 숙의적 공감 및 성숙한 합의 도출력(Deliberative Consensus Synthesis): ${describeHabermasStage(res.deliberativeDemocraticConsensusScore)}`,
    `- 핵심 하버마스 테마: ${res.activeHabermasTheme.themeTitleKo} [${res.activeHabermasTheme.themeTitleEn}]`,
    `- 공론장 교차 축: ${res.habermasCrossAxis}`,
    `- 실천적 통찰: ${res.activeHabermasTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeHabermasTheme.practicalCounsel}`,
    `- 하버마스 원전 테제: "${res.focalHabermasAphorism.aphorismKo}" (${res.focalHabermasAphorism.aphorismGerman})`,
    `- 원전 출처: [${res.focalHabermasAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHabermasAphorism.actionGuidance}`,
    `- 보조 원전 테제: "${res.secondaryHabermasAphorism.aphorismKo}" (${res.secondaryHabermasAphorism.aphorismGerman})`,
    `- 보조 원전 출처: [${res.secondaryHabermasAphorism.sourceContext}]`,
    `- 보조 실천 지침: ${res.secondaryHabermasAphorism.actionGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 종합 하버마스 권면: ${res.habermasComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.habermasSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.habermasSynthesisMatrix.dominantTension} | 조율 상태: ${res.habermasSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.habermasSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
