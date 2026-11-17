/**
 * 근대 네덜란드 바루흐 스피노자(Baruch Spinoza) 《에티카(Ethica)》 코나투스(Conatus) & 신즉자연(Deus sive Natura) 영원의 상 관조 엔진
 *
 * 스피노자의 《에티카(Ethica Ordine Geometrico Demonstrata)》 원전 기반.
 *
 * @version LUCKEY-SPINOZA-CONATUS-AMORDEI-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const SPINOZA_CONATUS_AMORDEI_VERSION = 'LUCKEY-SPINOZA-CONATUS-AMORDEI-v2.3.0';

function describeSpinozaStage(score: number): string {
  if (score >= 88) return '지적 사랑(Amor Dei)의 고요한 충만 단계';
  if (score >= 76) return '인과를 꿰뚫는 능동 이성 단계';
  if (score >= 64) return '수동 정념에서 벗어나는 전환 단계';
  return '흔들리는 감정의 원인을 살피는 초기 단계';
}

export type SpinozaQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

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

export interface SpinozaTemporalConatusRhythm {
  kstWindow: string;
  seasonalTone: string;
  epistemicFocus: string;
  conatusClarityIndex: number;
  rhythmDirective: string;
}

export interface SpinozaEthicaSynthesisMatrix {
  passiveToActiveTransition: number;
  causalUnderstandingDepth: number;
  amorDeiEquanimity: number;
  overallSynthesis: number;
}

export interface BaruchSpinozaEthicaConatusResult {
  engineVersion: string;
  calculatedAtKst: string;
  conatusVitalityScore: number;
  subSpecieAeternitatisScore: number;
  affectJoyTransitionScore: number;
  adequateIdeaIntellectScore: number;
  amorDeiIntellectualisScore: number;
  questionTopic: SpinozaQuestionTopic;
  activeAffectState: SpinozaAffectState;
  focalEpistemicLevel: SpinozaEpistemicLevel;
  temporalConatusRhythm: SpinozaTemporalConatusRhythm;
  ethicaSynthesisMatrix: SpinozaEthicaSynthesisMatrix;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
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

function classifySpinozaTopic(question: string): SpinozaQuestionTopic {
  if (/연애|사랑|관계|이별|갈등|상대|사람|친구|가족|부부|직장동료/.test(question)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|투자|계약|시험|진로|방향|옮길|할까|말까/.test(question)) {
    return 'decision';
  }
  if (/치유|회복|불안|지침|슬픔|분노|상처|우울|번아웃|스트레스|두려움/.test(question)) {
    return 'healing';
  }
  return 'reflection';
}

const SPINOZA_TOPIC_PRACTICE: Record<SpinozaQuestionTopic, string> = {
  relationship: '상대의 반응에 수동적으로 흔들리기보다, 서로의 존재 역량을 북돋우는 호혜적 연대와 관대함의 태도를 먼저 선택하십시오.',
  decision: '당장의 불안이나 막연한 기대 대신, 각 선택지가 나의 활동 역량과 지속 가능한 평정을 키우는지 인과적으로 따져 보십시오.',
  healing: '우리를 지치게 하는 것은 사건 자체보다 그 원인을 모른 채 떠도는 수동적 정념입니다. 감정의 뿌리를 명료히 이해할 때 마음은 자유로워집니다.',
  reflection: '외부의 평가에 매여 있던 시선을 거두고, 지금 내가 본래 지닌 존재의 힘과 고요한 자기 긍정을 깊이 자각하십시오.',
};

const SPINOZA_TOPIC_RITUAL: Record<SpinozaQuestionTopic, string> = {
  relationship: '상대에게 서운함이 올라올 때 즉각 반응하지 말고, 상대 역시 자기만의 인과와 조건 속에서 움직이고 있음을 한 호흡 떠올려 보십시오.',
  decision: '선택지마다 느끼는 두려움과 실제 사실을 종이 위에서 분리해 적어 보고, 사실의 인과만 남긴 채 다시 판단해 보십시오.',
  healing: '지금 마음을 무겁게 누르는 감정 하나를 이름 붙이고, 그것이 어떤 구체적 사건과 생각에서 비롯되었는지 차분히 문장으로 풀어 보십시오.',
  reflection: '오늘 하루 동안 나의 기운을 높여 준 활동과 고갈시킨 습관을 각각 하나씩 가려내어 내일의 리듬을 정돈해 보십시오.',
};

const SPINOZA_TOPIC_REFLECTION: Record<SpinozaQuestionTopic, string> = {
  relationship: '이 관계에서 나는 상대를 통제하려 하고 있나요, 아니면 서로의 역량이 함께 자라나는 자유를 넓히고 있나요?',
  decision: '지금 내 마음을 끄는 선택은 일시적 충동에서 온 것인가요, 아니면 나의 본질적 역량을 오래 키우는 방향인가요?',
  healing: '이 슬픔이나 불안을 막연한 운명 탓으로 돌리지 않고 인과적으로 바라볼 때 가장 먼저 보이는 원인은 무엇인가요?',
  reflection: '타인의 시선과 비교를 걷어낸 자리에서 내 존재가 가장 온전히 살아 숨 쉬는 순간은 언제인가요?',
};

function buildTemporalConatusRhythm(now: Date): SpinozaTemporalConatusRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 코나투스(존재 지속·확장 의지)가 명료히 깨어나는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 수동적 정념의 열기를 이성(Ratio)의 인과 분석으로 식히는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 영원의 상(Sub Specie Aeternitatis) 아래 필연을 고요히 수용하는 계절'
          : '겨울 — 내면의 직관지(Scientia Intuitiva)와 자기만족을 깊게 다지는 계절';

  if (hour >= 5 && hour < 12) {
    return {
      kstWindow: '오전 타당한 관념(Adequate Idea) 명증 창',
      seasonalTone,
      epistemicFocus: '제2종 인식(Ratio) 인과 명료화',
      conatusClarityIndex: 91,
      rhythmDirective: '감정적 잔여물이 적고 이성적 인과 파악이 가장 선명한 오전입니다. 핵심 판단을 명료히 세우십시오.',
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      kstWindow: '오후 포르티투도(Fortitudo) 능동 실천 창',
      seasonalTone,
      epistemicFocus: '능동적 기쁨(Laetitia Activa)과 관대함',
      conatusClarityIndex: 84,
      rhythmDirective: '외부 변수와 마주하는 오후입니다. 타인의 감정에 휘말리지 말고 용기와 관대함으로 대응하십시오.',
    };
  }
  if (hour >= 18 && hour < 22) {
    return {
      kstWindow: '저녁 정념 전환(Affect Transition) 성찰 창',
      seasonalTone,
      epistemicFocus: '수동적 정념의 원인 해명',
      conatusClarityIndex: 86,
      rhythmDirective: '하루의 피로와 서운함을 막연한 기분으로 남기지 말고 인과적 원인을 짚어 가볍게 풀어내십시오.',
    };
  }
  return {
    kstWindow: '심야 영원의 상(Sub Specie Aeternitatis) 관조 창',
    seasonalTone,
    epistemicFocus: '제3종 인식(직관지)과 내적 평정',
    conatusClarityIndex: 79,
    rhythmDirective: '우연과 불안에 휩쓸리기 쉬운 심야입니다. 모든 사물이 자연의 필연 속에 있음을 관조하며 쉬십시오.',
  };
}

export function calculateBaruchSpinozaEthicaConatus(
  profile: UserProfile,
  now: Date = new Date(),
  question = ''
): BaruchSpinozaEthicaConatusResult {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seedString =
    (profile?.basic?.birthdate ?? (profile as unknown as { birthdate?: string })?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as unknown as { name?: string })?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as unknown as { birthtime?: string })?.birthtime ?? '12:00') +
    `|${kstDate}|${question}|BaruchSpinozaEthicaConatus`;

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
  const questionTopic = classifySpinozaTopic(question);
  const temporalConatusRhythm = buildTemporalConatusRhythm(now);

  const passiveToActiveTransition = Math.min(99, Math.round((affectJoyTransitionScore + conatusVitalityScore) / 2));
  const causalUnderstandingDepth = Math.min(99, Math.round((adequateIdeaIntellectScore + temporalConatusRhythm.conatusClarityIndex) / 2));
  const amorDeiEquanimity = Math.min(99, Math.round((subSpecieAeternitatisScore + amorDeiIntellectualisScore) / 2));
  const overallSynthesis = Math.round((passiveToActiveTransition + causalUnderstandingDepth + amorDeiEquanimity) / 3);

  const ethicaSynthesisMatrix: SpinozaEthicaSynthesisMatrix = {
    passiveToActiveTransition,
    causalUnderstandingDepth,
    amorDeiEquanimity,
    overallSynthesis,
  };

  const practiceGuidance = `${activeAffectState.actionCounsel} ${SPINOZA_TOPIC_PRACTICE[questionTopic]}`;
  const ritualAction = SPINOZA_TOPIC_RITUAL[questionTopic];
  const reflectionFocus = SPINOZA_TOPIC_REFLECTION[questionTopic];
  const cleanQuestion = question.trim();
  const reflectiveQuestion = cleanQuestion
    ? `"${cleanQuestion}"에 담긴 수동 정념의 원인을 영원의 상 아래에서 살필 때, 지금 나의 코나투스를 키우는 관점은 무엇인가요?`
    : reflectionFocus;
  const boundaryNotice = '이 관점은 스피노자 윤리학의 정념 전환과 인과적 이해라는 철학적 틀을 빌린 정성적 성찰이며, 우열의 점수나 확정적 예측이 아닙니다.';

  const counselTitle = `스피노자 에티카와 코나투스: ${activeAffectState.affectNameLatin}`;
  const philosophicalGuidance = `${activeAffectState.actionCounsel} ${SPINOZA_TOPIC_PRACTICE[questionTopic]} ${focalEpistemicLevel.philosophicalInsight}`;

  return {
    engineVersion: SPINOZA_CONATUS_AMORDEI_VERSION,
    calculatedAtKst: new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('Z', '+09:00'),
    conatusVitalityScore,
    subSpecieAeternitatisScore,
    affectJoyTransitionScore,
    adequateIdeaIntellectScore,
    amorDeiIntellectualisScore,
    questionTopic,
    activeAffectState,
    focalEpistemicLevel,
    temporalConatusRhythm,
    ethicaSynthesisMatrix,
    practiceGuidance,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    spinozaPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatBaruchSpinozaEthicaConatusPrompt(res: BaruchSpinozaEthicaConatusResult): string {
  return [
    `【스피노자 에티카 코나투스 & 신즉자연 관조 지표 (${res.engineVersion})】`,
    `- 코나투스 생명력: ${describeSpinozaStage(res.conatusVitalityScore)} | 영원의 상 관조: ${describeSpinozaStage(res.subSpecieAeternitatisScore)}`,
    `- 능동 정념 상태: ${res.activeAffectState.affectNameLatin} (${res.activeAffectState.affectNameKo})`,
    `- 인식의 지평: ${res.focalEpistemicLevel.levelNameKo} [${res.focalEpistemicLevel.levelNameLatin}]`,
    `- 실천 조언 (${res.questionTopic}): ${res.practiceGuidance}`,
    `- 일상 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- KST 코나투스 리듬 (${res.calculatedAtKst}): ${res.temporalConatusRhythm.kstWindow} (${res.temporalConatusRhythm.epistemicFocus}, ${describeSpinozaStage(res.temporalConatusRhythm.conatusClarityIndex)}) — ${res.temporalConatusRhythm.rhythmDirective}`,
    `- 에티카 매트릭스: 능동 정념 전환(${describeSpinozaStage(res.ethicaSynthesisMatrix.passiveToActiveTransition)}) / 인과 이해 깊이(${describeSpinozaStage(res.ethicaSynthesisMatrix.causalUnderstandingDepth)}) / 영원의 상 평정(${describeSpinozaStage(res.ethicaSynthesisMatrix.amorDeiEquanimity)}) → 종합(${describeSpinozaStage(res.ethicaSynthesisMatrix.overallSynthesis)})`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
