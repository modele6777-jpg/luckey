/**
 * 미국 윌리엄 제임스(William James) 《실용주의(Pragmatism)》 & 《신념의 의지(The Will to Believe)》 실천적 현금가치 & 의식의 흐름·다원주의 지혜 엔진
 *
 * 미국 실용주의(Pragmatism)의 대부이자 현대 심리학의 선구자 윌리엄 제임스(William James, 1842~1910)의 대표작
 * 《실용주의(Pragmatism, 1907)》, 《신념의 의지(The Will to Believe, 1897)》, 《심리학의 원리(The Principles of Psychology, 1890)》,
 * 《종교적 경험의 다양성(The Varieties of Religious Experience, 1902)》 원전 기반.
 *
 * @version LUCKEY-WILLIAM-JAMES-PRAGMATISM-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_WILLIAM_JAMES_VERSION = 'LUCKEY-WILLIAM-JAMES-PRAGMATISM-v2.5.0';

export type JamesQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

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

export interface JamesSituationalPragmatismAudit {
  themeKo: string;
  sourceCitation: string;
  englishQuote: string;
  translationKo: string;
  cashValueTest: string;
  somaticFirstStep: string;
}

export interface JamesTemporalPragmatismRhythm {
  kstWindow: string;
  seasonalTone: string;
  pragmaticFocus: '현금가치 검증(Cash-Value)' | '신념의 도약(Will to Believe)' | '의식의 흐름(Stream)' | '신체-정서 전환(Somatic)';
  pragmatismClarityIndex: number;
  rhythmDirective: string;
}

export interface JamesSynthesisMatrix {
  cashValueClarity: number;
  willToBelieveCourage: number;
  streamAdaptability: number;
  overallSynthesis: number;
  jamesCrossAxis: string;
}

export interface AmericanWilliamJamesPragmatismResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: JamesQuestionTopic;
  // 5대 핵심 윌리엄 제임스 실용주의 & 심리 지표 (내부 계산 호환용, 프롬프트 비노출)
  practicalCashValueIndex: number;              // 실천적 현금가치 및 유용성 지수 (Cash-Value & Fruitfulness)
  willToBelieveConfidenceScore: number;         // 신념의 의지 및 행동 결단력 (The Will to Believe & Decisive Action)
  streamOfConsciousnessVitalityIndex: number;   // 의식의 흐름 및 심리적 유연성 지표 (Stream of Consciousness Flexibility)
  pluralisticOpennessScore: number;             // 다원적 우주 및 다양성 수용도 (Pluralistic Universe Openness)
  healthyMindedResilienceIndex: number;         // 건강한 영혼 및 정서 전환 회복탄력성 (Healthy-Mindedness & Somatic Action)
  // 세부 분석
  activeJamesTheme: JamesTheme;
  focalJamesAphorism: JamesAphorism;
  situationalPragmatismAudit: JamesSituationalPragmatismAudit;
  temporalPragmatismRhythm: JamesTemporalPragmatismRhythm;
  jamesSynthesisMatrix: JamesSynthesisMatrix;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  shadowWarning: string;
  interpretiveBoundary: string;
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

function buildSituationalPragmatismAudit(query?: string): JamesSituationalPragmatismAudit {
  const q = (query ?? '').trim();
  if (/확신|결정|선택|도전|시작|불확실|망설/.test(q)) {
    return {
      themeKo: '신념의 의지(The Will to Believe)와 선제적 도약',
      sourceCitation: '《신념의 의지(The Will to Believe)》 제1장',
      englishQuote: 'There are cases where a fact cannot come at all unless a preliminary faith exists in its coming.',
      translationKo: '그 일이 일어날 것이라는 선제적 믿음이 먼저 존재하지 않으면, 아예 사실 자체가 일어날 수 없는 경우들이 있다.',
      cashValueTest: '완벽한 증거가 모일 때까지 기다리는 비용 vs 지금 작은 실험을 시작해 현실 피드백을 얻는 현금가치.',
      somaticFirstStep: '오늘 15분 안에 결과를 확인해 볼 수 있는 가장 작은 실전 테스트 1건부터 즉시 착수하십시오.',
    };
  }
  if (/불안|스트레스|우울|지침|생각|걱정|잡념/.test(q)) {
    return {
      themeKo: '의식의 흐름(Stream of Consciousness)과 주의력 전환',
      sourceCitation: '《심리학의 원리》 · 〈정서론〉',
      englishQuote: 'The greatest weapon against stress is our ability to choose one thought over another.',
      translationKo: '스트레스에 맞서는 가장 위대한 무기는 한 생각 대신 다른 생각을 선택하는 우리의 주의력이다.',
      cashValueTest: '지금 머릿속을 맴도는 걱정이 내 오늘 행동에 구체적인 이득을 주는가, 에너지만 갉아먹는가.',
      somaticFirstStep: '자세를 곧게 펴고 심호흡 3회 뒤, 내 시선과 손을 곧장 쓸 수 있는 단순한 물리적 행동 1가지를 시작하십시오.',
    };
  }
  if (/관계|사람|갈등|인정|소통|서운/.test(q)) {
    return {
      themeKo: '다원적 우주(Pluralistic Universe)와 인정의 심리',
      sourceCitation: '《다원적 우주》 & 《심리학 서간집》',
      englishQuote: 'The deepest principle in human nature is the craving to be appreciated.',
      translationKo: '인간 본성의 가장 깊은 원리는 있는 그대로 인정받고 존중받고자 하는 갈망이다.',
      cashValueTest: '상대의 단점을 논박해 얻는 일시적 우위 vs 상대의 관점과 노고를 인정해 여는 협력의 현금가치.',
      somaticFirstStep: '대화 첫머리에 상대의 수고나 의도를 있는 그대로 짚어 주는 짧은 인정의 문장 하나를 먼저 건네십시오.',
    };
  }
  return {
    themeKo: '진리의 현금가치(Cash-Value) 실전 검증',
    sourceCitation: '《실용주의(Pragmatism)》 제2강',
    englishQuote: 'Grant an idea or belief to be true, what concrete difference will its being true make in anyone’s actual life?',
    translationKo: '어떤 생각이 참이라고 가정할 때, 그것이 실제 누군가의 삶에 어떤 구체적인 차이를 만들어 내는가?',
    cashValueTest: '추상적 고민을 멈추고 오늘 밤 잠들기 전에 손에 남는 구체적 변화 1가지가 무엇인지 확인하기.',
    somaticFirstStep: '지금 머릿속에 있는 계획 중 오늘 당장 실행 가능한 1단계 행동만 떼어내어 바로 움직이십시오.',
  };
}

function buildTemporalPragmatismRhythm(now?: Date): JamesTemporalPragmatismRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 신념의 의지(The Will to Believe)로 새 가설을 현실에 심는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 행동의 현금가치(Cash-Value)를 역동적으로 검증하는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 다원적 경험의 결실을 추려 실용적 지혜로 묶는 계절'
          : '겨울 — 의식의 흐름(Stream of Consciousness)을 고요히 가라앉히고 건강한 습관을 벼리는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '오전 신념의 도약(Will to Believe) 창',
      seasonalTone,
      pragmaticFocus: '신념의 도약(Will to Believe)',
      pragmatismClarityIndex: 91,
      rhythmDirective: '하루의 의지가 가장 신선한 오전입니다. 완벽한 증거를 기다리지 말고 첫 발을 내디뎌 사실을 만드십시오.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '한낮 현금가치(Cash-Value) 실전 검증 창',
      seasonalTone,
      pragmaticFocus: '현금가치 검증(Cash-Value)',
      pragmatismClarityIndex: 86,
      rhythmDirective: '구체적 실행과 조율이 활발한 낮 시간입니다. 실제 삶에 차이를 만드는 실용적 한 수에 집중하십시오.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 신체-정서 전환(Somatic Action) 창',
      seasonalTone,
      pragmaticFocus: '신체-정서 전환(Somatic)',
      pragmatismClarityIndex: 83,
      rhythmDirective: '하루의 피로가 쌓이기 쉬운 저녁입니다. 가벼운 산책이나 단정한 마무리 행동으로 기분까지 함께 전환하십시오.',
    };
  }
  return {
    kstWindow: '심야 의식의 흐름(Stream of Consciousness) 이완 창',
    seasonalTone,
    pragmaticFocus: '의식의 흐름(Stream)',
    pragmatismClarityIndex: 79,
    rhythmDirective: '잡념이 꼬리를 물기 쉬운 심야입니다. 한 가지 생각 대신 평온한 다른 생각을 선택하고 휴식하십시오.',
  };
}

function classifyJamesQuestionTopic(query?: string): JamesQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/관계|사람|갈등|인정|소통|서운|연애|가족|동료/.test(q)) return 'relationship';
  if (/확신|결정|선택|도전|시작|불확실|망설|이직|창업/.test(q)) return 'decision';
  if (/불안|스트레스|우울|지침|생각|걱정|잡념|회복|휴식/.test(q)) return 'healing';
  return 'reflection';
}

function buildJamesTopicExtras(topic: JamesQuestionTopic): {
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
} {
  switch (topic) {
    case 'relationship':
      return {
        dailyPracticeRitual: '오늘 마주한 사람에게 상대의 의도와 수고를 있는 그대로 인정해 주는 짧은 문장 하나 먼저 건네기.',
        reflectiveQuestion: '상대의 틀림을 논박하는 대신, 이 관계에서 실제로 협력과 온기를 여는 현금가치 있는 말은 무엇입니까?',
      };
    case 'decision':
      return {
        dailyPracticeRitual: '완벽한 확신을 기다리지 말고 15분 안에 현실 피드백을 얻을 수 있는 최소 실험 1건 바로 착수하기.',
        reflectiveQuestion: '내가 먼저 믿고 발을 떼어야 비로소 현실이 움직이기 시작하는 지점은 어디입니까?',
      };
    case 'healing':
      return {
        dailyPracticeRitual: '자세를 곧게 펴고 심호흡 3회 뒤, 머릿속 잡념 대신 손과 몸을 쓰는 단순한 행동 1가지 즉시 시작하기.',
        reflectiveQuestion: '지금 붙잡고 있는 생각 대신 의식적으로 선택해 옮겨 탈 수 있는 더 건강한 생각은 무엇입니까?',
      };
    default:
      return {
        dailyPracticeRitual: '오늘 하루 내 삶에 실제로 구체적인 차이를 만들어 낸 작은 행동 1가지를 밤에 짧게 기록하기.',
        reflectiveQuestion: '추상적 고민을 접어 두고 지금 당장 손에 잡히는 변화를 만드는 가장 실용적인 한 걸음은 무엇입니까?',
      };
  }
}

function describeJamesStage(score: number): string {
  if (score >= 90) return '충만·실천 도약(Cash-Value Active)';
  if (score >= 82) return '명료·신념 발현(Will to Believe)';
  return '유연·의식 조율(Stream Flowing)';
}

export function calculateAmericanWilliamJamesPragmatism(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): AmericanWilliamJamesPragmatismResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const questionTopic = classifyJamesQuestionTopic(query);

  const seedString = `WILLIAM-JAMES-PRAGMATISM:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${query ?? ''}`;

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
  const situationalPragmatismAudit = buildSituationalPragmatismAudit(query);
  const temporalPragmatismRhythm = buildTemporalPragmatismRhythm(now);

  const cashValueClarity = Math.min(99, Math.round((practicalCashValueIndex + healthyMindedResilienceIndex) / 2));
  const willToBelieveCourage = Math.min(99, Math.round((willToBelieveConfidenceScore + temporalPragmatismRhythm.pragmatismClarityIndex) / 2));
  const streamAdaptability = Math.min(99, Math.round((streamOfConsciousnessVitalityIndex + pluralisticOpennessScore) / 2));
  const overallSynthesis = Math.round((cashValueClarity + willToBelieveCourage + streamAdaptability) / 3);

  const jamesCrossAxis = `[${activeJamesTheme.themeTitleKo.split('—')[0].trim()}] × [${questionTopic}] × [${temporalPragmatismRhythm.pragmaticFocus}] × [${focalJamesAphorism.aphorismKey}]`;
  const jamesSynthesisMatrix: JamesSynthesisMatrix = {
    cashValueClarity,
    willToBelieveCourage,
    streamAdaptability,
    overallSynthesis,
    jamesCrossAxis,
  };

  const guidanceTitle = `윌리엄 제임스 실용주의 지혜: ${activeJamesTheme.themeTitleKo}`;
  const philosophicalCounsel = `미국 실용주의와 현대 심리학의 거장 윌리엄 제임스는 공허한 이론을 넘어 삶에서 구체적 차이를 빚어내는 실천적 현금가치(Cash-Value)와 용기 있는 신념의 의지(The Will to Believe)를 강조합니다. ` +
    `현재 당신의 도전에 가장 큰 힘을 실어주는 핵심 원리는 '${activeJamesTheme.themeTitleKo}'입니다. ` +
    `${activeJamesTheme.practicalCounsel} 아울러 제임스의 명언 "${focalJamesAphorism.aphorismKo}"를 가슴에 품고, ` +
    `${focalJamesAphorism.actionGuidance}`;

  const topicExtras = buildJamesTopicExtras(questionTopic);
  const shadowWarning = `[${activeJamesTheme.themeTitleKo.split('—')[0].trim()} 과잉 경계] 실용적 결과나 즉각적 행동에만 몰두한 나머지 내면의 속도와 타인의 다원적 맥락을 건너뛰지 않도록 살피십시오.`;
  const interpretiveBoundary = '윌리엄 제임스의 실용주의와 심리학 관점은 행동과 태도의 전환을 비추는 상징적 성찰 렌즈이며, 확정적 예측이나 전문 자문을 대신하지 않습니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, '0')}-${String(kst.getUTCDate()).padStart(2, '0')} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} +09:00 (KST)`;

  return {
    engineVersion: AMERICAN_WILLIAM_JAMES_VERSION,
    calculatedAtKst,
    questionTopic,
    practicalCashValueIndex,
    willToBelieveConfidenceScore,
    streamOfConsciousnessVitalityIndex,
    pluralisticOpennessScore,
    healthyMindedResilienceIndex,
    activeJamesTheme,
    focalJamesAphorism,
    situationalPragmatismAudit,
    temporalPragmatismRhythm,
    jamesSynthesisMatrix,
    dailyPracticeRitual: topicExtras.dailyPracticeRitual,
    reflectiveQuestion: topicExtras.reflectiveQuestion,
    ritualAction: topicExtras.dailyPracticeRitual,
    reflectionFocus: topicExtras.reflectiveQuestion,
    shadowWarning,
    interpretiveBoundary,
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
    `【윌리엄 제임스 《실용주의》 & 《신념의 의지》 실천적 현금가치 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락 초점: ${res.questionTopic}`,
    `- 실천적 현금가치 결: ${describeJamesStage(res.practicalCashValueIndex)} · 신념의 의지(${describeJamesStage(res.willToBelieveConfidenceScore)}) · 의식의 흐름(${describeJamesStage(res.streamOfConsciousnessVitalityIndex)})`,
    `- 다원적 수용·회복 결: 다원적 개방성(${describeJamesStage(res.pluralisticOpennessScore)}) · 건강한 정서 전환(${describeJamesStage(res.healthyMindedResilienceIndex)})`,
    `- 핵심 실용주의 테마: ${res.activeJamesTheme.themeTitleKo} [${res.activeJamesTheme.themeTitleEn}]`,
    `- 질문 맥락 실용 감사 (${res.situationalPragmatismAudit.themeKo} · ${res.situationalPragmatismAudit.sourceCitation}): "${res.situationalPragmatismAudit.translationKo}"`,
    `- 현금가치 검증: ${res.situationalPragmatismAudit.cashValueTest}`,
    `- 신체·행동 첫걸음: ${res.situationalPragmatismAudit.somaticFirstStep}`,
    `- KST 실용주의 리듬: ${res.temporalPragmatismRhythm.kstWindow} (${res.temporalPragmatismRhythm.pragmaticFocus}, 흐름 ${describeJamesStage(res.temporalPragmatismRhythm.pragmatismClarityIndex)}) — ${res.temporalPragmatismRhythm.rhythmDirective}`,
    `- 제임스 매트릭스: 현금가치(${describeJamesStage(res.jamesSynthesisMatrix.cashValueClarity)}) · 신념 결단(${describeJamesStage(res.jamesSynthesisMatrix.willToBelieveCourage)}) · 의식 유연성(${describeJamesStage(res.jamesSynthesisMatrix.streamAdaptability)}) · 4중 교차 축(${res.jamesSynthesisMatrix.jamesCrossAxis}) — 종합 결(${describeJamesStage(res.jamesSynthesisMatrix.overallSynthesis)})`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 종합 제임스 실용 권면: ${res.jamesComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
