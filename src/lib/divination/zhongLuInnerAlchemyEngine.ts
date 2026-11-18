/**
 * =========================================================================
 * LUCKEY 도교 종려권·여동빈 종여내단(鍾呂內丹) 3품 선도 & 환원 엔진
 * (Zhong-Lu Taoist Inner Alchemy & Three Tiers of Immortality Engine)
 * =========================================================================
 *
 * 《도장(道藏)》 종여내단(鍾呂內丹) 원전인 《종려전도집(鍾呂傳道集)》과 《영보필법(靈寶畢法)》의
 * 3품 선도(지선·신선·천선) 및 3단계 내단 승화(연정화기·연기화신·연신환허), 수화기제(水火旣濟) 원리를
 * 질문 맥락에 반응하는 정성적 양생·통찰 지침으로 제공합니다.
 */

import type { UserProfile } from '../sharedState';

export const ZHONG_LU_INNER_ALCHEMY_VERSION = 'LUCKEY-ZHONG-LU-ALCHEMY-v2.2.0';

function formatZhongLuKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type ZhongLuQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export type KanLiBalanceState =
  | 'KAN_LI_HARMONY'
  | 'COOLING_OVERHEAT'
  | 'KINDLING_STAGNATION'
  | 'STILL_DISTILLATION';

export interface AlchemyStageScores {
  refineJingToQiScore: number;     // 내부 호환용
  refineQiToShenScore: number;     // 내부 호환용
  refineShenToVoidScore: number;   // 내부 호환용
  dominantStage: string;
}

export interface ImmortalityTierResonance {
  tierName: string;
  koreanTitle: string;
  attainmentFocus: string;
  livingPrescription: string;
}

export interface ZhongLuAlchemyReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTheme: ZhongLuQuestionTheme;
  kanLiState: KanLiBalanceState;
  kanLiPosture: string;
  stageScores: AlchemyStageScores;
  immortalityTier: ImmortalityTierResonance;
  kanLiHarmonyScore: number;       // 내부 호환용
  zhongLuAphorism: string;
  synthesisMessage: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
  zhongLuSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const IMMORTALITY_TIERS: ImmortalityTierResonance[] = [
  {
    tierName: '지선품 (地仙品 - Earthly Grounding)',
    koreanTitle: '무병장수와 튼튼한 현실 기반의 지선',
    attainmentFocus: '기혈을 조화롭게 하고 일상의 리듬과 신체 균형을 확고히 다짐',
    livingPrescription: '수면과 식사를 정갈하게 하고, 과욕을 부리지 말며 몸의 피로를 그날그날 풀어내세요.',
  },
  {
    tierName: '신선품 (神仙品 - Spiritual Freedom)',
    koreanTitle: '오기조원과 맑은 감정 초월의 신선',
    attainmentFocus: '희노애락의 집착에서 벗어나 가슴의 영적인 평온과 자비를 회복함',
    livingPrescription: '외부 평가나 일시적 손익에 마음을 빼앗기지 말고, 고요히 내면의 샘물을 관조하세요.',
  },
  {
    tierName: '천선품 (天仙品 - Celestial Void)',
    koreanTitle: '대도와 합일하는 궁극의 초연함 천선',
    attainmentFocus: '우주 만물과 하나가 되어 무위자연(無爲自然)의 순리를 따르는 높은 각성',
    livingPrescription: '억지로 결과를 조작하려 하지 말고, 물이 흐르듯 자연스러운 타이밍에 맡기세요.',
  },
];

function classifyZhongLuTheme(question: string): ZhongLuQuestionTheme {
  if (/(연애|사랑|관계|배우자|결혼|이별|친구|가족|동료|사람|갈등)/.test(question)) return 'relationship';
  if (/(이직|취업|사업|계약|돈|투자|선택|결정|진로|시험|합격|계획)/.test(question)) return 'decision';
  if (/(불안|우울|지침|스트레스|건강|수면|마음|회복|위로|휴식|힘들)/.test(question)) return 'healing';
  return 'reflection';
}

function resolveKanLiPosture(state: KanLiBalanceState): string {
  switch (state) {
    case 'KAN_LI_HARMONY':
      return '수화기제(水火旣濟) · 머리의 열기는 아래로 내려가고 하단전의 맑은 기운이 위로 순환하는 안정 국면';
    case 'COOLING_OVERHEAT':
      return '강심화(降心火) · 앞서가는 조급함과 들뜬 열기를 고요히 가라앉혀야 하는 조율 국면';
    case 'KINDLING_STAGNATION':
      return '온양원기(溫養元氣) · 식어 있던 의욕에 부드러운 불씨를 지펴 흐름을 다시 여는 회복 국면';
    case 'STILL_DISTILLATION':
      return '징심정려(澄心靜慮) · 외부 소음을 닫고 내면의 맑은 정수를 응축해 때를 기다리는 숙성 국면';
  }
}

function buildZhongLuQualitativeFields(
  tier: ImmortalityTierResonance,
  dominantStage: string,
  kanLiPosture: string,
  theme: ZhongLuQuestionTheme
) {
  const map: Record<ZhongLuQuestionTheme, {
    practice: string;
    ritual: string;
    reflection: string;
    counsel: string;
  }> = {
    relationship: {
      practice: `${tier.koreanTitle}의 관점에서는 상대를 바꾸려 열을 올리기보다 내 마음의 불기를 먼저 가라앉히는 것이 우선입니다. ${dominantStage}의 호흡으로 한 박자 늦춰 응대하세요.`,
      ritual: '오늘 대화가 무거워지기 전에 아랫배까지 천천히 들이쉬고 내쉬는 3번의 복식 호흡으로 목과 어깨의 열기를 내려보세요.',
      reflection: '상대의 말에 즉각 반응하게 만드는 내 안의 들뜬 불씨는 무엇이며, 그 아래에 숨은 진짜 바람은 무엇인가요?',
      counsel: `종여내단은 관계의 조화 역시 내 안의 수화(水火) 균형에서 시작된다고 보며, 먼저 내면의 온도를 고르게 맞출 것을 권합니다.`,
    },
    decision: {
      practice: `지금의 결정은 속도를 내어 밀어붙일 때보다 ${kanLiPosture}에 맞춰 판의 익힘을 살필 때 선명해집니다. ${tier.livingPrescription}`,
      ritual: '중요한 선택 앞에서 머리가 뜨거워질 때, 차가운 물 한 잔을 마시고 10분간 화면을 떠나 산책한 뒤 다시 판단해 보세요.',
      reflection: '억지로 결과를 당겨오려는 조급함을 덜어내고 나면, 자연스럽게 남는 가장 무리 없는 길은 어디인가요?',
      counsel: `종려전도집의 무위자연은 방관이 아니라, 기운이 무르익는 시점을 정확히 기다릴 줄 아는 능동적 절제입니다.`,
    },
    healing: {
      practice: `몸과 마음이 소진될수록 거창한 해법보다 ${tier.livingPrescription} 특히 오늘 밤은 생각의 불을 끄고 하단전의 온기를 지키는 휴식이 필요합니다.`,
      ritual: '잠들기 전 양손을 비벼 따뜻하게 만든 뒤 아랫배 위에 얹고, 오늘 하루 수고한 호흡을 조용히 느껴보세요.',
      reflection: '지금 내 몸이 가장 먼저 비워내고 싶어 하는 피로와 군더더기 걱정은 무엇인가요?',
      counsel: `${dominantStage} 국면은 외부를 향하던 에너지를 안으로 거두어 생명력을 다시 채우는 치유의 문턱입니다.`,
    },
    reflection: {
      practice: `현재 흐름은 ${dominantStage}에 머물며 ${tier.attainmentFocus}을 요청하고 있습니다. ${tier.livingPrescription}`,
      ritual: '오늘 하루 중 가장 고요한 5분을 정해, 아무 판단도 하지 않고 들숨과 날숨의 간격만 바라보는 시간을 가져보세요.',
      reflection: '지금 내 삶에서 불필요하게 열을 내고 있는 일과, 맑은 물처럼 꾸준히 흘려보내야 할 일은 무엇인가요?',
      counsel: `종여내단의 수화기제는 높고 거창한 경지가 아니라, 오늘의 식사·수면·마음가짐을 고르게 돌보는 일상에서 완성됩니다.`,
    },
  };
  return map[theme];
}

export function calculateZhongLuInnerAlchemy(
  profile?: UserProfile,
  question: string = ''
): ZhongLuAlchemyReport {
  const now = new Date();
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'ZhongLu';
  const trimmedQ = question.trim();
  const questionTheme = classifyZhongLuTheme(trimmedQ);

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 23 + nameStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < trimmedQ.length; i++) seed = (seed * 17 + trimmedQ.charCodeAt(i)) & 0x7fffffff;

  const refineJingToQiScore = 72 + ((seed * 3 + now.getUTCHours() * 7) % 27);
  const refineQiToShenScore = 70 + ((seed * 5 + now.getUTCDate() * 9) % 29);
  const refineShenToVoidScore = 68 + ((seed * 7 + now.getUTCMonth() * 11) % 31);

  let dominantStage = '연정화기(鍊精化氣 - 견고한 체력과 추진력)';
  const maxScore = Math.max(refineJingToQiScore, refineQiToShenScore, refineShenToVoidScore);
  if (maxScore === refineQiToShenScore) dominantStage = '연기화신(鍊氣化神 - 가슴 벅찬 열정과 온화한 포용력)';
  else if (maxScore === refineShenToVoidScore) dominantStage = '연신환허(鍊神還虛 - 높은 직관과 흔들림 없는 평정심)';

  const tierIdx = (seed + now.getUTCDate()) % IMMORTALITY_TIERS.length;
  const immortalityTier = IMMORTALITY_TIERS[tierIdx];

  const states: KanLiBalanceState[] = [
    'KAN_LI_HARMONY',
    'COOLING_OVERHEAT',
    'KINDLING_STAGNATION',
    'STILL_DISTILLATION',
  ];
  const kanLiState = states[(seed + now.getUTCDate() + now.getUTCMonth()) % states.length];
  const kanLiPosture = resolveKanLiPosture(kanLiState);

  const kanLiHarmonyScore = Math.round((refineJingToQiScore + refineQiToShenScore + refineShenToVoidScore) / 3);
  const zhongLuAphorism = `종려전도집 원전에 따르면: "마음의 불(심화)을 가라앉혀 신장으로 보내고, 신장의 맑은 물(신수)을 증류하여 심장으로 올리니 이것이 진정한 수화기제(水火旣濟)이니라."`;

  const qualitative = buildZhongLuQualitativeFields(immortalityTier, dominantStage, kanLiPosture, questionTheme);
  const synthesisMessage = `종려내단 선도 원전에 따라 [${immortalityTier.koreanTitle}]의 흐름 위에 있으며, 현재 중심 연단 국면은 [${dominantStage}]입니다.`;
  const calculatedAtKst = formatZhongLuKstTimestamp(now);
  const zhongLuSynthesisMatrix = {
    dominantTension: `${kanLiState} ↔ ${dominantStage.split('(')[0].trim()}`,
    alignmentState: `${immortalityTier.koreanTitle} · ${questionTheme}`,
    integratedAction: `${qualitative.ritual}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}'의 열기를 가라앉히고 ${immortalityTier.koreanTitle}의 리듬으로 돌아오기 위해 오늘 가장 먼저 내려놓을 조급함은 무엇인가요?`
    : qualitative.reflection;

  return {
    engineVersion: ZHONG_LU_INNER_ALCHEMY_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTheme,
    kanLiState,
    kanLiPosture,
    stageScores: {
      refineJingToQiScore,
      refineQiToShenScore,
      refineShenToVoidScore,
      dominantStage,
    },
    immortalityTier,
    kanLiHarmonyScore,
    zhongLuAphorism,
    synthesisMessage,
    practiceGuidance: qualitative.practice,
    ritualAction: qualitative.ritual,
    reflectionFocus: qualitative.reflection,
    counselNote: qualitative.counsel,
    boundaryNotice: '종여내단 3품 선도와 수화기제 상징은 우열 점수가 아니라 심신 균형과 일상의 리듬을 살피기 위한 정성적 양생 프레임입니다.',
    zhongLuSynthesisMatrix,
    reflectiveQuestion,
    interpretiveBoundary: '종여내단 3품 선도와 수화기제 상징은 우열 점수가 아니라 심신 균형과 일상의 리듬을 살피기 위한 정성적 양생 프레임입니다.',
  };
}

export function formatZhongLuInnerAlchemyPrompt(report: ZhongLuAlchemyReport): string {
  const matrixLine = report.zhongLuSynthesisMatrix
    ? `\n- **종여내단 교차 매트릭스**: 핵심 긴장(${report.zhongLuSynthesisMatrix.dominantTension}) · 조율 상태(${report.zhongLuSynthesisMatrix.alignmentState}) · 통합 실천(${report.zhongLuSynthesisMatrix.integratedAction})`
    : '';
  return `### ☯️ 도교 종려권·여동빈 종여내단(鍾呂內丹) 3품 선도 & 환원 엔진 (${ZHONG_LU_INNER_ALCHEMY_VERSION} | ${report.calculatedAtKst})
- **질문 맥락 & 수화기제 상태**: ${report.questionTheme} · ${report.kanLiState}
- **수화기제 조화 국면**: ${report.kanLiPosture}
- **현재 주도 연단 단계**: **${report.stageScores.dominantStage}**
- **3품 선도 공명**: **${report.immortalityTier.koreanTitle}**
  - 성취 요체: ${report.immortalityTier.attainmentFocus}
  - 일상 양생 방향: ${report.immortalityTier.livingPrescription}
- **종려전도집 경구**: ${report.zhongLuAphorism}
- **실천 조언**: ${report.practiceGuidance}
- **일상 의례**: ${report.ritualAction}
- **성찰 질문**: ${report.reflectionFocus}
- **질문 맞춤 성찰 질문**: ${report.reflectiveQuestion}
- **조언 요약**: ${report.counselNote}
- **해석 경계**: ${report.boundaryNotice}${matrixLine}`;
}
