/**
 * 프랑스 모리스 메를로퐁티(Maurice Merleau-Ponty) 《지각의 현상학(Phénoménologie de la perception)》 & 《눈과 마음(L'Œil et l'Esprit)》 신체-주체(Corps-sujet) & 원초적 지각·살(Chair)의 상호교감 지혜 엔진
 *
 * 20세기 프랑스 현상학의 대가 모리스 메를로퐁티(1908~1961)의 불후의 명저 《지각의 현상학》, 《눈과 마음》 원전 기반:
 * 1. 신체-주체 및 구체적 체화 (Body-Subject / Corps-sujet Embodiment): 추상적 관념에 머물지 않고 살아있는 몸으로 세계를 직접 체험하고 행동하는 체화력.
 * 2. 전반성적 원초적 지각 및 직관적 통찰 (Pre-reflective Perception & Primordial Insight): 개념적 분별 이전에 사물과 상황의 살아있는 결을 알아채는 직관적 감수성.
 * 3. 살(Chair)의 상호신체성 및 존재론적 공명 (Intercorporeality & Chiasmic Harmony): 나와 타자, 세계가 하나의 '살(Flesh)'로 얽혀 있음을 느끼는 깊은 교감도.
 * 4. 예술적 감각 안목 및 창조적 표현 (Sensory Aesthetic Eye & Creative Expression): 세잔의 회화처럼 고정관념을 넘어 사물의 보이지 않는 본질을 가시화하는 심미안.
 * 5. 현상학적 접지 및 심신 회복탄력성 (Phenomenological Grounding & Vital Equanimity): 관념의 분열과 피로를 털어내고 지금 살아 숨 쉬는 대지와 삶의 감각으로 닻을 내리는 회복탄력성.
 *
 * @version LUCKEY-MERLEAU-PONTY-EMBODIED-PHENOMENOLOGY-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_MAURICE_MERLEAU_PONTY_EMBODIED_PHENOMENOLOGY_VERSION = 'LUCKEY-MERLEAU-PONTY-EMBODIED-PHENOMENOLOGY-v2.3.0';

export type MerleauPontyQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface MerleauPontyTemporalRhythm {
  kstDateLabel: string;
  timeBand: '새벽 감각 각성' | '오전 신체 현존' | '오후 현장 지각' | '저녁 살의 공명' | '심야 대지 접지';
  embodiedTempo: string;
  temporalGuidance: string;
}

export interface MerleauPontyTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface MerleauPontyAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchMauriceMerleauPontyEmbodiedPhenomenologyResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: MerleauPontyQuestionTopic;
  embodiedPhase: string;
  shadowWarning: string;
  temporalMerleauPontyRhythm: MerleauPontyTemporalRhythm;
  // 5대 메를로퐁티 신체현상학 핵심 지표 (내부 호환용 보존, 프롬프트 비노출)
  corpsSujetEmbodimentScore: number;                 // 신체-주체 및 구체적 체화 지수 (Body-Subject Embodiment)
  primordialPerceptionIndex: number;                 // 전반성적 원초적 지각 및 직관적 통찰력 (Pre-reflective Insight)
  chiasmicIntercorporealityScore: number;            // 살(Chair)의 상호신체성 및 공명 (Intercorporeality & Harmony)
  sensoryCreativeEyeScore: number;                   // 예술적 감각 안목 및 창조적 표현력 (Aesthetic Eye & Expression)
  phenomenologicalGroundingResilienceScore: number;  // 현상학적 접지 및 심신 회복탄력성 (Grounding & Equanimity)
  // 세부 분석
  activePontyTheme: MerleauPontyTheme;
  companionPontyTheme: MerleauPontyTheme;
  focalPontyAphorism: MerleauPontyAphorism;
  practiceGuidance: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  pontySynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  pontyComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

const PONTY_EMBODIED_PHASES = [
  '감각 접지(머릿속 관념을 멈추고 발바닥과 호흡의 감각으로 돌아오는 시기)',
  '원초적 지각(분석과 이름 붙이기 이전에 상황의 살아있는 결을 몸으로 읽는 시기)',
  '살의 교감(나와 타인, 세계가 서로의 시선과 온기 속에 얽혀 있음을 느끼는 시기)',
] as const;

const PONTY_SHADOW_WARNINGS = [
  '몸의 감각과 직관을 신뢰하되, 필요한 현실적 사실 확인과 말의 정교함까지 건너뛰지 않도록 살피세요.',
  '타인의 시선과 분위기에 지나치게 예민하게 공명하다 내 경계와 호흡이 흐려지지 않도록 점검하세요.',
  '안정과 접지만을 지키려다 새로운 시야로 걸어 나갈 창조적 표현의 용기까지 접어두지 않도록 유의하세요.',
] as const;

export const PONTY_THEMES: MerleauPontyTheme[] = [
  {
    themeKey: 'bodySubjectAnchor',
    themeTitleEn: 'Body-Subject: Reconnecting with the Living Flesh as Our Anchor in the World',
    themeTitleKo: '살아있는 신체-주체 — 머릿속 관념의 감옥을 벗어나 온몸의 감각으로 세계와 호흡하기',
    pragmaticInsight: '우리의 몸은 단순한 물리적 기계나 껍데기가 아니라, 세계를 직접 지각하고 행동하는 주체 그 자체입니다. 메마른 생각의 쳇바퀴를 멈추고 살아 숨 쉬는 신체의 생명력에 접속하십시오.',
    practicalCounsel: '지나친 두뇌 노동과 추상적 고민으로 에너지를 소진하지 마십시오. 신체의 리듬을 회복하고, 오감으로 현실의 감촉을 느끼며 생생한 행동으로 삶의 활력을 되찾으십시오.',
  },
  {
    themeKey: 'primordialPerception',
    themeTitleEn: 'Primordial Insight: Sensing the Lived Texture of Reality Before Abstract Logic',
    themeTitleKo: '원초적 지각과 직관 — 이론과 도식 이전에 상황의 살아있는 맥락을 직관적으로 감지하기',
    pragmaticInsight: '차가운 논리적 분별 이전에, 우리의 온몸은 이미 상황의 미묘한 흐름과 위험, 기회를 직관적으로 알아차립니다. 전반성적 지각이 보내오는 본능적이고 지혜로운 신호에 귀를 기울이십시오.',
    practicalCounsel: '복잡한 분석표에만 얽매여 본질을 놓치지 마십시오. 첫 순간 온몸으로 느껴진 직관과 본능적 분별력을 신뢰하고, 현장의 맥락과 결을 있는 그대로 포착하십시오.',
  },
  {
    themeKey: 'chiasmFleshOfWorld',
    themeTitleEn: 'The Chiasm: Entangled in the Common Flesh of Self, Others, and the World',
    themeTitleKo: '살(Chair)의 상호 얽힘 — 나와 타인이 서로에게 스며드는 따뜻한 존재론적 공명',
    pragmaticInsight: '나와 세상은 칼로 자르듯 분리된 것이 아니라, 하나의 살(Chair)로 이어져 교감합니다. 타인의 시선과 나의 시선이 교차할 때 비로소 진정한 소통과 깊은 유대감이 피어납니다.',
    practicalCounsel: '타인을 대상화하거나 경쟁의 상대로만 규정하지 마십시오. 서로의 존재를 온몸으로 느끼고 배려하는 깊은 공감을 실천하십시오. 그 유대 속에서 갈등은 저절로 풀립니다.',
  },
  {
    themeKey: 'visibleAndInvisible',
    themeTitleEn: 'The Eye and the Spirit: Manifesting the Invisible Depths Behind Visible Forms',
    themeTitleKo: '보이지 않는 것의 가시화 — 표면의 윤곽을 넘어 사물과 사람의 참된 깊이를 통찰하기',
    pragmaticInsight: '화가 세잔이 사물의 외형 너머 살아있는 무게와 생명을 캔버스에 담았듯, 현상학적 시선은 눈앞에 드러난 표면적 현상 아래 숨겨진 거대한 깊이와 잠재력을 꿰뚫어 봅니다.',
    practicalCounsel: '겉으로 드러난 말이나 숫자에만 속지 마십시오. 그 이면에 흐르는 진실한 감정과 숨은 동기를 조용히 응시하십시오. 안목이 깊어질수록 문제의 근원적 해결책이 명확해집니다.',
  },
  {
    themeKey: 'earthGrounding',
    themeTitleEn: 'Phenomenological Grounding: Anchoring into the Earth with Unshakeable Equanimity',
    themeTitleKo: '현상학적 접지 — 부유하는 망상을 걷어내고 지금 여기의 대지 위로 굳건히 닻 내리기',
    pragmaticInsight: '불안과 공허는 삶의 터전인 현실에서 뿌리가 뽑혀 나갈 때 찾아옵니다. 지금 내가 발을 딛고 선 현실의 땅을 굳게 딛고 온전한 현존(Presence)의 평정을 회복하십시오.',
    practicalCounsel: '과거나 미래에 대한 허황된 불안에 휩쓸리지 마십시오. 호흡을 가다듬고 현재의 시공간에 집중하십시오. 지금 이 순간에 뿌리내릴 때 어떤 풍파에도 흔들리지 않는 평정이 깃듭니다.',
  },
];

export const PONTY_APHORISMS: MerleauPontyAphorism[] = [
  {
    aphorismKey: 'bodyIsAnchorage',
    aphorismKo: '몸이야말로 우리가 이 세계에 확고하게 닻을 내리는 근원적인 거점이다.',
    aphorismFrench: 'Le corps est notre ancrage dans un monde.',
    sourceContext: '모리스 메를로퐁티 《지각의 현상학(Phénoménologie de la perception)》',
    actionGuidance: '관념적 방황을 멈추고 몸의 감각을 깨우십시오. 구체적 행동으로 세계와 단단히 교감하십시오.',
  },
  {
    aphorismKey: 'worldAsLived',
    aphorismKo: '세계는 내가 머리로 생각하는 대상이 아니라, 내가 온몸으로 살아내는 삶의 터전이다.',
    aphorismFrench: 'Le monde n\'est pas ce que je pense, mais ce que je vis.',
    sourceContext: '모리스 메를로퐁티 《지각의 현상학(Phénoménologie de la perception)》',
    actionGuidance: '사변적 탁상공론을 끝내고 현장으로 들어가십시오. 직접 부딪쳐 겪어내는 체험만이 진실을 알려줍니다.',
  },
  {
    aphorismKey: 'eyeAndSpiritVision',
    aphorismKo: '눈은 세상을 보고, 그 세상이 한 폭의 그림이 되기 위해 무엇이 결여되어 있는지를 알아챈다.',
    aphorismFrench: 'L\'œil voit le monde, et ce qui manque au monde pour être tableau.',
    sourceContext: '모리스 메를로퐁티 《눈과 마음(L\'Œil et l\'Esprit)》',
    actionGuidance: '정형화된 통념을 깨뜨리십시오. 예술가와 같은 신선한 감각으로 숨겨진 가능성을 드러내십시오.',
  },
  {
    aphorismKey: 'chiasmicFabric',
    aphorismKo: '이쪽에 내가 있고 저쪽에 세상이 있는 것이 아니라, 우리 모두가 살을 취하는 하나의 공통된 직조가 있을 뿐이다.',
    aphorismFrench: 'Il n\'y a pas le monde d\'un côté et moi de l\'autre, il y a un tissu commun où nous prenons chair.',
    sourceContext: '모리스 메를로퐁티 《보이는 것과 보이지 않는 것(Le Visible et l\'Invisible)》',
    actionGuidance: '단절과 소외의 환상을 털어내십시오. 당신과 주변 세계가 긴밀히 연결되어 있음을 자각하고 신뢰를 나누십시오.',
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

export function classifyMerleauPontyQuestionTopic(question?: string): MerleauPontyQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/연애|사랑|관계|가족|친구|갈등|화해|이별|소통|사람|상대|동료|배우자/.test(q)) {
    return 'relationship';
  }
  if (/결정|선택|이직|창업|진로|도전|방향|사업|투자|계약|결단|시작|그만/.test(q)) {
    return 'decision';
  }
  if (/지치|불안|우울|회복|위로|상처|아픔|피로|휴식|번아웃|힘들|치유|걱정/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

export function buildMerleauPontyTemporalRhythm(now: Date = new Date()): MerleauPontyTemporalRhythm {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hour = kst.getUTCHours();

  if (hour >= 4 && hour < 8) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 새벽`,
      timeBand: '새벽 감각 각성',
      embodiedTempo: '관념보다 먼저 눈뜨는 신체의 고요한 현존',
      temporalGuidance: '생각의 소음이 가라앉은 상태에서 공기의 온도, 호흡의 깊이처럼 살아 있는 감각을 먼저 느끼기 좋은 새벽입니다.',
    };
  }
  if (hour >= 8 && hour < 12) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 오전`,
      timeBand: '오전 신체 현존',
      embodiedTempo: '몸의 움직임이 세계와 직접 교감하며 리듬을 여는 시간',
      temporalGuidance: '책상 앞의 사변보다 직접 몸을 움직여 현장의 결을 만져 볼 때 판단이 또렷해지는 오전입니다.',
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 오후`,
      timeBand: '오후 현장 지각',
      embodiedTempo: '눈과 귀로 드러난 표면 너머의 맥락을 읽는 흐름',
      temporalGuidance: '시각적 피로와 정보 과잉 속에서 잠시 시선을 멀리 두고 공간 전체의 균형을 다시 감각하기 좋은 오후입니다.',
    };
  }
  if (hour >= 18 && hour < 22) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 저녁`,
      timeBand: '저녁 살의 공명',
      embodiedTempo: '나와 타인, 세계가 하나의 결로 이어짐을 느끼는 교감의 시간',
      temporalGuidance: '타인의 시선과 내 시선이 어우러졌던 하루의 장면들을 따뜻하게 되짚어 보며 긴장을 푸는 저녁입니다.',
    };
  }
  return {
    kstDateLabel: `${yyyy}-${mm}-${dd} 심야`,
    timeBand: '심야 대지 접지',
    embodiedTempo: '부유하던 생각을 몸과 바닥으로 내려놓는 안식의 시간',
    temporalGuidance: '머릿속 시뮬레이션을 멈추고 발바닥과 어깨의 무게를 느끼며 지금 여기에 단단히 닻을 내리는 밤입니다.',
  };
}

function describeEmbodiedResonance(score: number): string {
  if (score >= 92) return '깊은 체화 공명';
  if (score >= 86) return '선명한 지각 결';
  return '차분한 접지 흐름';
}

function buildMerleauPontyTopicContext(
  topic: MerleauPontyQuestionTopic,
  theme: MerleauPontyTheme,
  temporal: MerleauPontyTemporalRhythm
): {
  practiceGuidance: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
} {
  switch (topic) {
    case 'relationship':
      return {
        practiceGuidance: `관계에서는 머리로 상대를 해석하려 들기보다 함께 있는 공간의 온도와 눈빛, 호흡의 결을 느끼는 상호신체성이 중요합니다. '${theme.themeTitleKo}'의 감각으로 마주 서 보세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 상대와 대화할 때 다음 할 말을 머리로 준비하는 대신, 상대의 어깨 힘과 목소리 톤을 먼저 온전히 들어 보기`,
        reflectiveQuestion: '상대의 말 너머에서 지금 그 사람의 몸과 표정이 실제로 전하고 있는 감정은 무엇인가요?',
      };
    case 'decision':
      return {
        practiceGuidance: `결단의 순간에는 종이 위 장단점 비교만으로는 놓치는 미세한 거부감이나 끌림이 있습니다. '${theme.themeTitleKo}'처럼 온몸의 전반성적 직관이 보내는 신호를 함께 읽어 보세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 선택지를 떠올릴 때 가슴과 목, 어깨에 힘이 들어가는지 혹은 숨이 트이는지 신체 반응을 30초간 관찰하기`,
        reflectiveQuestion: '논리적으로는 그럴듯해 보이지만 내 몸의 감각이 유독 무겁게 저항하는 선택은 어느 쪽인가요?',
      };
    case 'healing':
      return {
        practiceGuidance: `불안과 소진의 시기에는 생각으로 생각을 풀려 할수록 공허가 깊어집니다. '${theme.themeTitleKo}'를 따라 오감의 접지를 회복해 몸이 먼저 안심하게 해 주세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 따뜻한 물이나 손바닥의 온기를 느끼며 발바닥이 바닥에 닿는 감각에 1분간 집중하기`,
        reflectiveQuestion: '지금 내 머릿속 걱정을 잠시 내려놓고, 오늘 내 몸이 가장 원하고 있는 물리적 돌봄은 무엇인가요?',
      };
    case 'reflection':
    default:
      return {
        practiceGuidance: `성찰의 질문 앞에서는 추상적 개념이 아니라 내가 오늘 실제로 겪어 낸 감각의 장면을 들여다보는 편이 훨씬 정직합니다. '${theme.themeTitleKo}'의 시선으로 하루를 비춰 보세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 오늘 하루 중 가장 선명했던 색, 소리, 촉감 한 가지를 떠올려 그 순간의 기분을 한 줄로 남기기`,
        reflectiveQuestion: '요즘 나는 세상을 머릿속 생각으로만 소비하고 있나요, 아니면 온몸으로 생생하게 살아내고 있나요?',
      };
  }
}

export function calculateFrenchMauriceMerleauPontyEmbodiedPhenomenology(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchMauriceMerleauPontyEmbodiedPhenomenologyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const questionTopic = classifyMerleauPontyQuestionTopic(query);
  const temporalMerleauPontyRhythm = buildMerleauPontyTemporalRhythm(now);

  const seedString = `MERLEAU-PONTY-PHENOMENOLOGY:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const corpsSujetEmbodimentScore = 87 + ((absHash >> 1) % 12);
  const primordialPerceptionIndex = 86 + ((absHash >> 4) % 13);
  const chiasmicIntercorporealityScore = 84 + ((absHash >> 7) % 15);
  const sensoryCreativeEyeScore = 85 + ((absHash >> 10) % 14);
  const phenomenologicalGroundingResilienceScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % PONTY_THEMES.length;
  const companionOffset = 1 + ((absHash >> 6) % (PONTY_THEMES.length - 1));
  const aphorismIndex = (absHash >> 8) % PONTY_APHORISMS.length;

  const activePontyTheme = PONTY_THEMES[themeIndex];
  const companionPontyTheme = PONTY_THEMES[(themeIndex + companionOffset) % PONTY_THEMES.length];
  const focalPontyAphorism = PONTY_APHORISMS[aphorismIndex];
  const embodiedPhase = PONTY_EMBODIED_PHASES[(absHash >> 11) % PONTY_EMBODIED_PHASES.length];
  const shadowWarning = PONTY_SHADOW_WARNINGS[(absHash >> 14) % PONTY_SHADOW_WARNINGS.length];

  const { practiceGuidance, dailyPracticeRitual, reflectiveQuestion } = buildMerleauPontyTopicContext(
    questionTopic,
    activePontyTheme,
    temporalMerleauPontyRhythm
  );

  const interpretiveBoundary =
    '이 해석은 운명을 수치로 재단하는 예언이 아니라, 모리스 메를로퐁티의 신체-주체와 지각 현상학 철학을 빌려 지금 여기의 감각과 살아 있는 맥락을 되짚어 보는 상징적 성찰 가이드입니다.';

  const guidanceTitle = `메를로퐁티 신체현상학 지혜: ${activePontyTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 현상학의 거장 모리스 메를로퐁티는 《지각의 현상학》과 《눈과 마음》을 통해 ` +
    `우리의 몸은 세계에 닻을 내리는 신체-주체(Corps-sujet)이며, 사변적 관념을 넘어 살아있는 감각과 경험으로 세계와 합일할 때 진정한 생명력이 회복됨을 밝혔습니다. ` +
    `현재 당신의 일상과 도전을 명쾌하게 풀어내는 핵심 지침은 '${activePontyTheme.themeTitleKo}'(동반 지침: ${companionPontyTheme.themeTitleKo})입니다. ` +
    `${activePontyTheme.practicalCounsel} ${practiceGuidance} 메를로퐁티 선생의 원전 명언 "${focalPontyAphorism.aphorismKo}" (${focalPontyAphorism.aphorismFrench})을 가슴에 품고, ` +
    `${focalPontyAphorism.actionGuidance}`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${kst.toISOString().slice(0, 10)} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} +09:00 (KST)`;
  const pontySynthesisMatrix = {
    coreInsight: `${activePontyTheme.themeTitleKo} (동반: ${companionPontyTheme.themeTitleKo})`,
    recommendedAction: `${dailyPracticeRitual} (${embodiedPhase})`,
    cautionNotice: shadowWarning,
  };

  return {
    engineVersion: FRENCH_MAURICE_MERLEAU_PONTY_EMBODIED_PHENOMENOLOGY_VERSION,
    calculatedAtKst: kstTimeLabel,
    questionTopic,
    embodiedPhase,
    shadowWarning,
    temporalMerleauPontyRhythm,
    corpsSujetEmbodimentScore,
    primordialPerceptionIndex,
    chiasmicIntercorporealityScore,
    sensoryCreativeEyeScore,
    phenomenologicalGroundingResilienceScore,
    activePontyTheme,
    companionPontyTheme,
    focalPontyAphorism,
    practiceGuidance: `${practiceGuidance} (동반 지침: ${companionPontyTheme.themeTitleKo})`,
    dailyPracticeRitual: `${dailyPracticeRitual} (${embodiedPhase})`,
    reflectiveQuestion: `'${embodiedPhase}' 국면에서 ${reflectiveQuestion}`,
    ritualAction: `${dailyPracticeRitual} (${embodiedPhase})`,
    reflectionFocus: `'${embodiedPhase}' 국면에서 ${reflectiveQuestion}`,
    interpretiveBoundary,
    pontySynthesisMatrix,
    pontyComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchMauriceMerleauPontyEmbodiedPhenomenologyPrompt(
  res: FrenchMauriceMerleauPontyEmbodiedPhenomenologyResult,
): string {
  return [
    `【모리스 메를로퐁티 《지각의 현상학·눈과 마음》 신체-주체 및 원초적 지각 성찰 가이드 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- 신체-지각 국면: ${res.embodiedPhase}`,
    `- KST 시공간 리듬: ${res.temporalMerleauPontyRhythm.kstDateLabel} · ${res.temporalMerleauPontyRhythm.timeBand} (${res.temporalMerleauPontyRhythm.embodiedTempo})`,
    `- 시공간 권면: ${res.temporalMerleauPontyRhythm.temporalGuidance}`,
    `- 신체-주체 및 구체적 체화(Body-Subject Embodiment): ${describeEmbodiedResonance(res.corpsSujetEmbodimentScore)}`,
    `- 전반성적 원초적 지각 및 직관 통찰(Pre-reflective Insight): ${describeEmbodiedResonance(res.primordialPerceptionIndex)}`,
    `- 살(Chair)의 상호신체성 및 공명(Intercorporeality & Harmony): ${describeEmbodiedResonance(res.chiasmicIntercorporealityScore)}`,
    `- 예술적 감각 안목 및 창조적 표현력(Aesthetic Eye & Expression): ${describeEmbodiedResonance(res.sensoryCreativeEyeScore)}`,
    `- 현상학적 접지 및 심신 회복탄력성(Grounding & Equanimity): ${describeEmbodiedResonance(res.phenomenologicalGroundingResilienceScore)}`,
    `- 핵심 메를로퐁티 테마: ${res.activePontyTheme.themeTitleKo} [${res.activePontyTheme.themeTitleEn}]`,
    `- 동반 메를로퐁티 테마: ${res.companionPontyTheme.themeTitleKo}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 실천적 통찰: ${res.activePontyTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activePontyTheme.practicalCounsel}`,
    `- 맥락 맞춤 가이드: ${res.practiceGuidance}`,
    `- 오늘의 실천 의례(${res.questionTopic}): ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.pontySynthesisMatrix.coreInsight}) | 실행(${res.pontySynthesisMatrix.recommendedAction}) | 주의(${res.pontySynthesisMatrix.cautionNotice})`,
    `- 메를로퐁티 원전 명언: "${res.focalPontyAphorism.aphorismKo}" (${res.focalPontyAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalPontyAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalPontyAphorism.actionGuidance}`,
    `- 종합 메를로퐁티 권면: ${res.pontyComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
