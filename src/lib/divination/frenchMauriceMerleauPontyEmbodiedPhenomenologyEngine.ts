/**
 * 프랑스 모리스 메를로퐁티(Maurice Merleau-Ponty) 《지각의 현상학(Phénoménologie de la perception)》 & 《눈과 마음(L'Œil et l'Esprit)》 신체-주체(Corps-sujet) & 원초적 지각·살(Chair)의 상호교감 지혜 엔진
 *
 * 20세기 프랑스 현상학의 대가 모리스 메를로퐁티(1908~1961)의 불후의 명저 《지각의 현상학》, 《눈과 마음》 원전 기반:
 * 1. 신체-주체 및 구체적 체화 지수 (Body-Subject / Corps-sujet Embodiment Score): 추상적 관념에 머물지 않고 살아있는 몸으로 세계를 직접 체험하고 행동하는 체화력.
 * 2. 전반성적 원초적 지각 및 직관적 통찰력 (Pre-reflective Perception & Primordial Insight Index): 개념적 분별 이전에 사물과 상황의 살아있는 결을 알아채는 직관적 감수성.
 * 3. 살(Chair)의 상호신체성 및 존재론적 공명 (Intercorporeality & Chiasmic Harmony Score): 나와 타자, 세계가 하나의 '살(Flesh)'로 얽혀 있음을 느끼는 깊은 교감도.
 * 4. 예술적 감각 안목 및 창조적 표현력 (Sensory Aesthetic Eye & Creative Expression Score): 세잔의 회화처럼 고정관념을 넘어 사물의 보이지 않는 본질을 가시화하는 심미안.
 * 5. 현상학적 접지 및 심신 회복탄력성 (Phenomenological Grounding & Vital Equanimity Resilience): 관념의 분열과 피로를 털어내고 지금 살아 숨 쉬는 대지와 삶의 감각으로 닻을 내리는 회복탄력성.
 *
 * @version LUCKEY-MERLEAU-PONTY-EMBODIED-PHENOMENOLOGY-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_MAURICE_MERLEAU_PONTY_EMBODIED_PHENOMENOLOGY_VERSION = 'LUCKEY-MERLEAU-PONTY-EMBODIED-PHENOMENOLOGY-v1.0.0';

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
  // 5대 메를로퐁티 신체현상학 핵심 지표 (0~100)
  corpsSujetEmbodimentScore: number;                 // 신체-주체 및 구체적 체화 지수 (Body-Subject Embodiment)
  primordialPerceptionIndex: number;                 // 전반성적 원초적 지각 및 직관적 통찰력 (Pre-reflective Insight)
  chiasmicIntercorporealityScore: number;            // 살(Chair)의 상호신체성 및 공명 (Intercorporeality & Harmony)
  sensoryCreativeEyeScore: number;                   // 예술적 감각 안목 및 창조적 표현력 (Aesthetic Eye & Expression)
  phenomenologicalGroundingResilienceScore: number;  // 현상학적 접지 및 심신 회복탄력성 (Grounding & Equanimity)
  // 세부 분석
  activePontyTheme: MerleauPontyTheme;
  focalPontyAphorism: MerleauPontyAphorism;
  pontyComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

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

export function calculateFrenchMauriceMerleauPontyEmbodiedPhenomenology(
  profile?: UserProfile,
  query?: string,
): FrenchMauriceMerleauPontyEmbodiedPhenomenologyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `MERLEAU-PONTY-PHENOMENOLOGY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const corpsSujetEmbodimentScore = 87 + ((absHash >> 1) % 12);
  const primordialPerceptionIndex = 86 + ((absHash >> 4) % 13);
  const chiasmicIntercorporealityScore = 84 + ((absHash >> 7) % 15);
  const sensoryCreativeEyeScore = 85 + ((absHash >> 10) % 14);
  const phenomenologicalGroundingResilienceScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % PONTY_THEMES.length;
  const aphorismIndex = (absHash >> 8) % PONTY_APHORISMS.length;

  const activePontyTheme = PONTY_THEMES[themeIndex];
  const focalPontyAphorism = PONTY_APHORISMS[aphorismIndex];

  const guidanceTitle = `메를로퐁티 신체현상학 지혜: ${activePontyTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 현상학의 거장 모리스 메를로퐁티는 《지각의 현상학》과 《눈과 마음》을 통해 ` +
    `우리의 몸은 세계에 닻을 내리는 신체-주체(Corps-sujet)이며, 사변적 관념을 넘어 살아있는 감각과 경험으로 세계와 합일할 때 진정한 생명력이 회복됨을 밝혔습니다. ` +
    `현재 당신의 일상과 도전을 명쾌하게 풀어내는 핵심 지침은 '${activePontyTheme.themeTitleKo}'입니다. ` +
    `${activePontyTheme.practicalCounsel} 메를로퐁티 선생의 원전 명언 "${focalPontyAphorism.aphorismKo}" (${focalPontyAphorism.aphorismFrench})을 가슴에 품고, ` +
    `${focalPontyAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_MAURICE_MERLEAU_PONTY_EMBODIED_PHENOMENOLOGY_VERSION,
    calculatedAtKst: new Date().toISOString(),
    corpsSujetEmbodimentScore,
    primordialPerceptionIndex,
    chiasmicIntercorporealityScore,
    sensoryCreativeEyeScore,
    phenomenologicalGroundingResilienceScore,
    activePontyTheme,
    focalPontyAphorism,
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
    `【모리스 메를로퐁티 《지각의 현상학》 신체-주체 및 원초적 지각 지표】`,
    `- 신체-주체 및 구체적 체화 지수(Body-Subject Embodiment): ${res.corpsSujetEmbodimentScore}/100`,
    `- 전반성적 원초적 지각 및 직관 통찰(Pre-reflective Insight): ${res.primordialPerceptionIndex}/100`,
    `- 살(Chair)의 상호신체성 및 공명(Intercorporeality & Harmony): ${res.chiasmicIntercorporealityScore}/100`,
    `- 예술적 감각 안목 및 창조적 표현력(Aesthetic Eye & Expression): ${res.sensoryCreativeEyeScore}/100`,
    `- 현상학적 접지 및 심신 회복탄력성(Grounding & Equanimity): ${res.phenomenologicalGroundingResilienceScore}/100`,
    `- 핵심 메를로퐁티 테마: ${res.activePontyTheme.themeTitleKo} [${res.activePontyTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activePontyTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activePontyTheme.practicalCounsel}`,
    `- 메를로퐁티 원전 명언: "${res.focalPontyAphorism.aphorismKo}" (${res.focalPontyAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalPontyAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalPontyAphorism.actionGuidance}`,
    `- 종합 메를로퐁티 권면: ${res.pontyComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
