/**
 * 근대 네덜란드 바루흐 스피노자(Baruch Spinoza) 《에티카(Ethica)》 코나투스(Conatus) & 신즉자연(Deus sive Natura) 영원의 상 관조 엔진
 *
 * 스피노자의 《에티카(Ethica Ordine Geometrico Demonstrata)》 원전 기반.
 * 1. 신즉자연(Deus sive Natura): 우주 전체가 유일하고 무한한 실체(Substantia)이며, 만물은 그 실체의 필연적 표현(양태, Modus).
 * 2. 코나투스(Conatus): "각 사물은 자신의 존재를 보존하려고 온 힘을 다해 노력한다(Unaquaeque res in suo esse perseverare conatur)."
 *    - 코나투스는 인간의 본질 그 자체이며 활동 역량(Potentia agendi)의 원천.
 * 3. 정념과 감정의 역학(Affectus):
 *    - 기쁨(Laetitia): 정신과 육체의 활동 역량이 증가하고 완전성이 더 커지는 이행.
 *    - 슬픔(Tristitia): 활동 역량이 감소하고 완전성이 위축되는 이행.
 * 4. 영원의 상 아래에서(Sub Specie Aeternitatis): 사물들을 일시적 우연이 아니라 우주적 필연의 연쇄 속에서 직관하고 조망함.
 * 5. 신에 대한 지적 사랑(Amor Dei Intellectualis): 만물의 필연성을 온전히 이해함으로써 얻는 최고의 지복(Beatitudo)과 자유.
 *
 * @version LUCKEY-SPINOZA-CONATUS-AMORDEI-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const SPINOZA_CONATUS_AMORDEI_VERSION = 'LUCKEY-SPINOZA-CONATUS-AMORDEI-v1.0.0';

export interface SpinozaAffectState {
  affectKey: string;
  affectNameLatin: string;
  affectNameKo: string;
  potencyDynamics: string;
  actionCounsel: string;
}

export interface SpinozaEpistemicLevel {
  levelNumber: number;
  levelNameLatin: string;
  levelNameKo: string;
  cognitiveHorizon: string;
  philosophicalInsight: string;
}

export interface BaruchSpinozaEthicaConatusResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  conatusVitalityScore: number;          // 코나투스(Conatus) 자기보존 및 역량 증진 활력도
  subSpecieAeternitatisScore: number;    // 영원의 상 아래에서(Sub Specie Aeternitatis) 우주적 필연성 관조도
  affectJoyTransitionScore: number;      // 감정 역학(기쁨 Laetitia 역량 증가도)
  adequateIdeaIntellectScore: number;    // 타당한 관념(Idea Adequata) 이성적 명석판명도
  amorDeiIntellectualisScore: number;    // 신에 대한 지적 사랑(Amor Dei Intellectualis) 지복도
  // 세부 명세
  activeAffectState: SpinozaAffectState;
  focalEpistemicLevel: SpinozaEpistemicLevel;
  spinozaPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type BaruchSpinozaEthicaConatusReport = BaruchSpinozaEthicaConatusResult;

const AFFECT_STATES: SpinozaAffectState[] = [
  {
    affectKey: 'LaetitiaActiva',
    affectNameLatin: 'Laetitia Activa (능동적 기쁨)',
    affectNameKo: '자신의 이성적 인식을 통해 활동 역량이 크게 확장되는 상태',
    potencyDynamics: '외적 우연에 기대지 않고 내면의 타당한 관념으로부터 생성되는 온전한 기쁨',
    actionCounsel: '자신의 존재 역량을 고양시키는 긍정적이고 지적인 활동에 온전히 몰입하십시오.',
  },
  {
    affectKey: 'FortitudoAnimi',
    affectNameLatin: 'Fortitudo (영혼의 굳셈과 도량)',
    affectNameKo: '용기(Animus)와 관대함(Generositas)으로 타인과 조화를 이루는 상태',
    potencyDynamics: '이성의 명령에 따라 자신을 지키며 동시에 타인과 호혜적 연대를 구축하는 강인함',
    actionCounsel: '타인의 비난이나 분노에 똑같이 대응하지 말고, 이성적 도량과 지혜로운 친절로 맞서십시오.',
  },
  {
    affectKey: 'SuperatioTristitiae',
    affectNameLatin: 'Superatio Tristitiae (슬픔의 지성적 극복)',
    affectNameKo: '수동적 정념(Passio)의 수렁을 벗어나 인과적 원인을 명료히 파악하는 상태',
    potencyDynamics: '슬픔을 유발한 원인을 명확한 관념으로 환원함으로써 감정의 예리함을 가라앉힘',
    actionCounsel: '고통이나 원망을 감정으로 소비하지 말고, 그 일이 일어난 자연적 인과율을 차분히 분석해 보십시오.',
  },
  {
    affectKey: 'AcquiescentiaInSeIpso',
    affectNameLatin: 'Acquiescentia in se ipso (자기만족과 내적 평정)',
    affectNameKo: '자신의 본질과 역량을 스스로 관조하며 얻는 평화로운 자기 긍정',
    potencyDynamics: '비교나 열등감에서 벗어나 자기 고유의 코나투스를 정당하게 인정하는 충만함',
    actionCounsel: '남과 비교하는 습관을 멈추고 자신의 본성이 이끄는 고유한 길을 긍지 있게 걸어가십시오.',
  },
];

const EPISTEMIC_LEVELS: SpinozaEpistemicLevel[] = [
  {
    levelNumber: 1,
    levelNameLatin: 'Cognitio primi generis (제1종 인식: 상상과 의견)',
    levelNameKo: '감각적 경험과 막연한 인상에 의존하여 우연과 불안에 휩싸이기 쉬운 차원',
    cognitiveHorizon: '단편적 정보나 감정에 휘둘려 사건의 필연적 연결고리를 보지 못함.',
    philosophicalInsight: '단편적 소문이나 표면적 현상에 성급히 일희일비하지 말고 한 걸음 물러서야 합니다.',
  },
  {
    levelNumber: 2,
    levelNameLatin: 'Ratio (제2종 인식: 이성과 공통 관념)',
    levelNameKo: '사물의 공통된 법칙과 인과적 사슬을 명석판명하게 파악하는 차원',
    cognitiveHorizon: '개별 사건을 우연이 아니라 자연의 보편적 법칙과 논리적 필연으로 이해함.',
    philosophicalInsight: '이성적 분석을 통해 상황의 근본 원인을 분별하고, 가장 적절한 실천적 대안을 도출하십시오.',
  },
  {
    levelNumber: 3,
    levelNameLatin: 'Scientia intuitiva (제3종 인식: 직관지)',
    levelNameKo: '만물이 유일한 신(자연)의 속성으로부터 필연적으로 흘러나옴을 직관하는 최고 차원',
    cognitiveHorizon: '영원의 상 아래에서(Sub Specie Aeternitatis) 모든 존재의 본질을 한눈에 통찰함.',
    philosophicalInsight: '세상의 모든 격랑을 우주적 필연의 장엄한 흐름으로 받아들이고 신에 대한 지적 사랑을 꽃피우십시오.',
  },
];

export function calculateBaruchSpinozaEthicaConatus(profile: UserProfile): BaruchSpinozaEthicaConatusResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'BaruchSpinozaEthicaConatus';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const conatusVitalityScore = 67 + (absHash % 32);
  const subSpecieAeternitatisScore = 63 + ((absHash >> 3) % 36);
  const affectJoyTransitionScore = 61 + ((absHash >> 6) % 38);
  const adequateIdeaIntellectScore = 65 + ((absHash >> 9) % 34);
  const amorDeiIntellectualisScore = 64 + ((absHash >> 12) % 35);

  const affectIndex = (absHash >> 4) % AFFECT_STATES.length;
  const levelIndex = (absHash >> 7) % EPISTEMIC_LEVELS.length;

  const activeAffectState = AFFECT_STATES[affectIndex];
  const focalEpistemicLevel = EPISTEMIC_LEVELS[levelIndex];

  const counselTitle = `스피노자 에티카와 코나투스: ${activeAffectState.affectNameLatin}`;
  const philosophicalGuidance = `자신의 존재를 보존하고 활동 역량을 드높이려는 코나투스(Conatus)의 힘을 신뢰하십시오. ` +
    `현재 당신의 감정 역학은 '${activeAffectState.affectNameKo}'에 집중할 때입니다. ${activeAffectState.actionCounsel} ` +
    `상황을 조망할 때는 ${focalEpistemicLevel.levelNameKo}(${focalEpistemicLevel.levelNameLatin})의 안목을 취하십시오. ` +
    `영원의 상 아래에서(Sub Specie Aeternitatis) 만물을 바라볼 때 ${focalEpistemicLevel.philosophicalInsight}`;

  return {
    engineVersion: SPINOZA_CONATUS_AMORDEI_VERSION,
    calculatedAtKst: new Date().toISOString(),
    conatusVitalityScore,
    subSpecieAeternitatisScore,
    affectJoyTransitionScore,
    adequateIdeaIntellectScore,
    amorDeiIntellectualisScore,
    activeAffectState,
    focalEpistemicLevel,
    spinozaPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatBaruchSpinozaEthicaConatusPrompt(res: BaruchSpinozaEthicaConatusResult): string {
  return [
    `【스피노자 에티카 코나투스 & 신즉자연 관조 지표】`,
    `- 코나투스 역량증진 활력도: ${res.conatusVitalityScore}/100`,
    `- 영원의 상 필연성 관조도: ${res.subSpecieAeternitatisScore}/100`,
    `- 능동적 기쁨 역량 이행도: ${res.affectJoyTransitionScore}/100`,
    `- 타당한 관념 이성적 인식도: ${res.adequateIdeaIntellectScore}/100`,
    `- 지적 사랑(Amor Dei) 지복도: ${res.amorDeiIntellectualisScore}/100`,
    `- 능동 정념 상태: ${res.activeAffectState.affectNameLatin} (${res.activeAffectState.affectNameKo})`,
    `- 역학 설명: ${res.activeAffectState.potencyDynamics}`,
    `- 실천적 조언: ${res.activeAffectState.actionCounsel}`,
    `- 인식의 지평: ${res.focalEpistemicLevel.levelNameKo} [${res.focalEpistemicLevel.levelNameLatin}]`,
    `- 인식적 통찰: ${res.focalEpistemicLevel.philosophicalInsight}`,
    `- 철학적 수양 지침: ${res.spinozaPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
