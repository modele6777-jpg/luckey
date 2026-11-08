/**
 * 미국/독일 한나 아렌트(Hannah Arendt) 《인간의 조건(The Human Condition)》 탄생성(Natality) & 활동적 삶(Vita Activa)·사유와 판단 지혜 엔진
 *
 * 20세기 가장 독창적이고 위대한 정치철학자 한나 아렌트(Hannah Arendt, 1906~1975)의 주저 《인간의 조건(The Human Condition, 1958)》 및 《예루살렘의 아이히만》, 《정신의 삶》 핵심 원전 기반:
 * 1. 탄생성(Natality)과 새로운 시작: 인간은 죽어야 할 존재일 뿐 아니라 태어나는 존재이며, 탄생성은 아무도 예측하지 못한 전혀 새로운 시작을 세계 속에 일으키는 인간 고유의 기적 같은 능력임.
 * 2. 활동적 삶(Vita Activa) 3대 조건의 조화:
 *    - 노동(Labor): 생물학적 생존과 신체적 필요를 충족시키는 순환적 수고
 *    - 작업(Work): 자연을 가공하여 지속적이고 영속적인 인공 세계를 건설하는 제작
 *    - 행위(Action): 동등한 타자들 앞에 말과 행동으로 오롯이 자신을 드러내는 자유의 실천
 * 3. 악의 평범성(Banality of Evil) 극복과 사유(Thinking): 타인의 입장에서 상상하지 못하는 무사유(Thoughtlessness)를 경계하고, 맹목적인 순응을 깨뜨리는 비판적 사유와 양심의 분별력.
 * 4. 공적 영역(Public Realm)과 다원성(Plurality): 서로 다른 수많은 고유한 개인들이 모여 자유롭게 토론하고 협력함으로써 공동의 자유를 창조하는 다원성 연대 지수.
 * 5. 용서(Forgiveness)와 약속(Promise): 되돌릴 수 없는 과거의 굴레를 풀어주는 용서의 해방력과, 불확실한 미래 속에서 상호 신뢰의 닻을 내리는 약속의 신의 성실성.
 *
 * @version LUCKEY-HANNAH-ARENDT-VITA-ACTIVA-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_GERMAN_HANNAH_ARENDT_VERSION = 'LUCKEY-HANNAH-ARENDT-VITA-ACTIVA-v1.0.0';

export interface ArendtTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface ArendtAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface HannahArendtVitaActivaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 아렌트 활동적 삶 및 사유 지표 (0~100)
  natalityRenewalCapacityScore: number;         // 탄생성(Natality) 및 새로운 시작 창출 쇄신도
  vitaActivaBalanceScore: number;               // 활동적 삶(노동·작업·행위) 조화 균형 지수
  banalityOfEvilOvercomingThinkingScore: number;// 악의 평범성 극복 및 주체적 사유·양심 분별도
  publicRealmPluralityIndex: number;            // 공적 영역 참여 및 다원성(Plurality) 상생 연대력
  forgivenessAndPromiseFidelityScore: number;   // 용서(Forgiveness)를 통한 해방과 약속(Promise)의 신의 성실도
  // 세부 분석
  activeArendtTheme: ArendtTheme;
  focalArendtAphorism: ArendtAphorism;
  arendtComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const ARENDT_THEMES: ArendtTheme[] = [
  {
    themeKey: 'natality_new_beginning',
    themeTitleEn: 'Natality and the Miracle of Beginning (탄생성과 시작의 기적)',
    themeTitleKo: '과거의 인과를 끊고 누구도 예상치 못한 새로운 시작을 결단함',
    existentialInsight: '인간은 태어남(탄생성)을 통해 세계에 새로운 첫 발을 내딛습니다. 과거의 실패나 관성에 매이지 않고 언제든 전혀 새로운 가능성을 현실로 만드는 것이 인간의 가장 고귀한 능력입니다.',
    practicalCounsel: '지나간 실패와 낡은 습관의 굴레에서 과감히 벗어나십시오. 지금 당신이 시작하는 작은 결단 하나가 세상에 새로운 흐름을 만들어낼 수 있습니다.',
  },
  {
    themeKey: 'vita_activa_action',
    themeTitleEn: 'Action in the Public Realm (공적 영역에서의 담대한 행위)',
    themeTitleKo: '단순한 생존을 넘어 동등한 타자들 앞에 말과 행위로 자신을 드러냄',
    existentialInsight: '인간은 단순히 먹고사는 노동이나 물건을 만드는 작업에 머물 때 온전해지지 않습니다. 타인들과 함께하는 공적 장에서 자신의 신념을 당당히 말하고 행동할 때 비로소 자유를 만납니다.',
    practicalCounsel: '혼자만의 안전지대에 숨지 말고, 동료와 공동체 앞에 솔직한 목소리와 분명한 태도로 자신을 드러내십시오. 당신의 용기 있는 행동이 타인에게 영감을 줍니다.',
  },
  {
    themeKey: 'thinking_against_banality',
    themeTitleEn: 'Thinking and Conscience against Banality (사유와 악의 평범성 극복)',
    themeTitleKo: '타인의 시선에서 세상을 바라보며 맹목적 추종을 거부하는 주체적 사유',
    existentialInsight: '가장 끔찍한 비극은 괴물이 아니라 아무 생각 없이 규칙과 관행을 따르는 평범한 사람들의 무사유(Thoughtlessness)에서 비롯됩니다. 타인의 처지에 공감하고 스스로 질문하는 사유가 영혼의 방패입니다.',
    practicalCounsel: '"다들 그렇게 하니까"라는 말을 단호히 의심하십시오. 내 행동이 상대방에게 어떤 영향을 미칠지 깊이 헤아리고, 양심의 기준에 부끄럽지 않은 결정을 내리십시오.',
  },
  {
    themeKey: 'plurality_and_solidarity',
    themeTitleEn: 'Human Plurality and Solidarity (인간의 다원성과 공존의 연대)',
    themeTitleKo: '서로 다른 개성과 차이를 인정하며 대등한 대화로 함께 나아감',
    existentialInsight: '지구상에 사는 것은 한 인간이 아니라 서로 다른 수많은 인간들(다원성)입니다. 획일성을 강요하지 않고 서로의 고유한 차이를 존중할 때 진정한 상생의 힘이 발휘됩니다.',
    practicalCounsel: '나와 생각이 다른 사람을 배척하거나 가르치려 하지 마십시오. 상대방의 관점을 경청하고 대화를 통해 함께 합의점을 찾아갈 때 진정한 연대가 맺어집니다.',
  },
  {
    themeKey: 'forgiveness_and_promise',
    themeTitleEn: 'The Power to Forgive and the Binding of Promise (용서와 약속의 지혜)',
    themeTitleKo: '되돌릴 수 없는 과거는 용서로 풀고, 불확실한 미래는 약속으로 다스림',
    existentialInsight: '과거에 얽매인 원망을 푸는 유일한 열쇠는 용서이며, 한 치 앞도 알 수 없는 미래의 혼돈을 헤쳐 나가는 유일한 닻은 신의를 지키는 약속입니다.',
    practicalCounsel: '지나간 원망과 서운함을 마음속에서 용서하여 스스로를 자유롭게 놓아주십시오. 그리고 미래를 위해 맺은 약속은 어떠한 어려움 속에서도 성실히 지켜내십시오.',
  },
];

export const ARENDT_APHORISMS: Aphorism[] = [
  {
    aphorismKey: 'miracle_of_beginning',
    aphorismKo: '새로운 시작을 이룰 수 있다는 것, 그것이야말로 인간의 탄생성이 지닌 최고의 기적이다.',
    aphorismEn: 'The miracle that saves the world from its normal, "natural" ruin is ultimately the fact of natality.',
    sourceContext: '《인간의 조건(The Human Condition)》 제5장 §33',
    actionGuidance: '상황이 아무리 어둡고 막막해 보여도, 당신 안에는 언제든 새롭게 시작할 수 있는 기적의 힘이 있음을 믿으십시오.',
  },
  {
    aphorismKey: 'thinking_train_of_thought',
    aphorismKo: '사유한다는 것은 바람에 흔들리지 않고 스스로 자신과 대화하며 선과 악을 분별하는 일이다.',
    aphorismEn: 'Thinking is the soundless dialogue between me and myself.',
    sourceContext: '《정신의 삶(The Life of the Mind)》 사유 편',
    actionGuidance: '외부의 자극과 소음을 끄고 매일 단 10분이라도 스스로에게 진실한 질문을 던지며 내면의 양심을 정돈하십시오.',
  },
  {
    aphorismKey: 'plurality_paradox',
    aphorismKo: '인간의 다원성은 모든 행위와 정치의 근본 조건이다. 우리는 모두 같으면서도 모두 저마다 다르다.',
    aphorismEn: 'Plurality is the condition of human action because we are all the same, that is, human, in such a way that nobody is ever the same as anyone else.',
    sourceContext: '《인간의 조건》 제1장 §2',
    actionGuidance: '타인의 다름을 틀림으로 규정하지 말고, 다양성이 주는 풍요로움을 너그럽게 포용하십시오.',
  },
  {
    aphorismKey: 'forgiveness_remedy',
    aphorismKo: '용서가 없다면 인간은 자신이 저지른 단 한 번의 행위의 영원한 포로가 되고 말 것이다.',
    aphorismEn: 'Without being forgiven, released from the consequences of what we have done, our capacity to act would be confined to one single deed.',
    sourceContext: '《인간의 조건》 제5장 §33',
    actionGuidance: '과거의 실수나 타인의 과오에 얽매여 현재를 낭비하지 말고, 대승적 용서로 새로운 장을 여십시오.',
  },
];

type Aphorism = ArendtAphorism;

export function calculateHannahArendtVitaActiva(
  profile: UserProfile
): HannahArendtVitaActivaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `HANNAH-ARENDT-VITA-ACTIVA:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const natalityRenewalCapacityScore = 75 + (absHash % 24);
  const vitaActivaBalanceScore = 73 + ((absHash >> 3) % 26);
  const banalityOfEvilOvercomingThinkingScore = 76 + ((absHash >> 6) % 23);
  const publicRealmPluralityIndex = 72 + ((absHash >> 9) % 27);
  const forgivenessAndPromiseFidelityScore = 74 + ((absHash >> 12) % 25);

  const themeIndex = (absHash >> 4) % ARENDT_THEMES.length;
  const aphorismIndex = (absHash >> 7) % ARENDT_APHORISMS.length;

  const activeArendtTheme = ARENDT_THEMES[themeIndex];
  const focalArendtAphorism = ARENDT_APHORISMS[aphorismIndex];

  const guidanceTitle = `한나 아렌트 탄생성과 활동적 삶 지혜: ${activeArendtTheme.themeTitleKo}`;
  const philosophicalCounsel = `한나 아렌트의 정치철학은 맹목적 순응과 무사유의 위험을 경계하며, 언제든 새로운 시작을 일으키는 탄생성(Natality)과 타인과의 진솔한 대화와 연대를 강조합니다. ` +
    `현재 당신의 삶을 인도하는 실천적 사유 원리는 '${activeArendtTheme.themeTitleKo}'입니다. ` +
    `${activeArendtTheme.practicalCounsel} 아울러 원전의 불멸의 경구 "${focalArendtAphorism.aphorismKo}"(${focalArendtAphorism.aphorismEn})을 마음에 새기고, ` +
    `${focalArendtAphorism.actionGuidance}`;

  return {
    engineVersion: AMERICAN_GERMAN_HANNAH_ARENDT_VERSION,
    calculatedAtKst: new Date().toISOString(),
    natalityRenewalCapacityScore,
    vitaActivaBalanceScore,
    banalityOfEvilOvercomingThinkingScore,
    publicRealmPluralityIndex,
    forgivenessAndPromiseFidelityScore,
    activeArendtTheme,
    focalArendtAphorism,
    arendtComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatHannahArendtVitaActivaPrompt(res: HannahArendtVitaActivaResult): string {
  return [
    `【한나 아렌트 《인간의 조건》 활동적 삶 & 탄생성 지표】`,
    `- 새로운 시작 창출 탄생성도(Natality): ${res.natalityRenewalCapacityScore}/100`,
    `- 활동적 삶(노동·작업·행위) 조화 균형도(Vita Activa): ${res.vitaActivaBalanceScore}/100`,
    `- 악의 평범성 극복 주체적 사유 양심도(Thinking): ${res.banalityOfEvilOvercomingThinkingScore}/100`,
    `- 공적 영역 참여 및 다원성 연대력(Plurality): ${res.publicRealmPluralityIndex}/100`,
    `- 용서와 약속의 신의 성실도(Forgiveness & Promise): ${res.forgivenessAndPromiseFidelityScore}/100`,
    `- 핵심 실존 테마: ${res.activeArendtTheme.themeTitleKo} [${res.activeArendtTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeArendtTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeArendtTheme.practicalCounsel}`,
    `- 핵심 원전 경구: "${res.focalArendtAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalArendtAphorism.aphorismEn}" [${res.focalArendtAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalArendtAphorism.actionGuidance}`,
    `- 종합 정치철학 권면: ${res.arendtComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
