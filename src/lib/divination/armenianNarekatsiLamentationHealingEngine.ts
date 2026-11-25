import type { UserProfile } from '../sharedState';

export type NarekatsiContemplationId =
  | 'honest_confession'
  | 'merciful_release'
  | 'vigilant_hope'
  | 'quiet_restoration';

export interface NarekatsiContemplation {
  id: NarekatsiContemplationId;
  armenianMotif: string;
  koreanLabel: string;
  coreInsight: string;
  healingPractice: string;
  reflectiveQuestion: string;
}

export interface ArmenianNarekatsiResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  primaryContemplation: NarekatsiContemplation;
  balancingContemplation: NarekatsiContemplation;
  vigilPhase: string;
  questionTopic: 'healing' | 'release' | 'hope' | 'general';
  narekatsiCrossAxis: string;
  shadowWarning: string;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const NAREKATSI_CONTEMPLATIONS: readonly NarekatsiContemplation[] = [
  {
    id: 'honest_confession',
    armenianMotif: 'Khonarhum (꾸밈없는 마음 열기)',
    koreanLabel: '자기 앞의 정직한 고백',
    coreInsight: '스스로 괜찮은 척 감추느라 무거워진 마음을 인정할 때, 비로소 억눌렸던 숨통이 트이고 회복이 시작됩니다.',
    healingPractice: '누구에게 보여줄 필요 없는 메모에 지금 가장 솔직한 감정 두 줄만 적어 보세요.',
    reflectiveQuestion: '괜찮은 척 애쓰느라 숨겨 두었지만, 지금 내 앞에서 가장 정직하게 인정해 주어야 할 감정은 무엇인가요?',
  },
  {
    id: 'merciful_release',
    armenianMotif: 'Oghormutyun (자비와 내려놓음)',
    koreanLabel: '자책에서 벗어나는 너그러움',
    coreInsight: '지나간 실수나 어쩔 수 없던 한계를 끝없이 되감기하기보다, 지금의 나를 다정히 용서하고 놓아주는 힘입니다.',
    healingPractice: '오래 붙들고 있던 자책 하나를 오늘 저녁에는 잠깐 내려놓고 따뜻한 물 한 잔을 마시세요.',
    reflectiveQuestion: '이미 지나간 일인데도 스스로를 다그치며 놓아주지 못했던 자책 하나를 오늘 내려놓는다면 무엇일까요?',
  },
  {
    id: 'vigilant_hope',
    armenianMotif: 'Huys (꺼지지 않는 등불)',
    koreanLabel: '흐림 너머를 보는 조용한 희망',
    coreInsight: '당장 모든 문제가 풀리지 않아도, 빛이 완전히 사라진 것이 아님을 믿고 작은 불씨를 지키는 인내입니다.',
    healingPractice: '오늘 하루 중 작더라도 분명히 잘 버텨낸 한 장면을 스스로에게 짚어 주세요.',
    reflectiveQuestion: '모든 게 한꺼번에 풀리지는 않아도, 오늘 내가 작지만 분명히 잘 지켜 낸 불씨(Huys) 하나는 무엇인가요?',
  },
  {
    id: 'quiet_restoration',
    armenianMotif: 'Khaghaghutyun (내면의 평화)',
    koreanLabel: '말을 줄이고 마음을 데우는 회복',
    coreInsight: '바깥의 소란을 이기려 애쓰기보다, 깊은 고요 속에서 부서진 감정의 결을 다시 이어 붙이는 시간입니다.',
    healingPractice: '자기 전 10분간 화면을 멀리 두고 깊고 느린 호흡으로 하루를 마무리해 보세요.',
    reflectiveQuestion: '바깥의 소란을 이기려 들기보다 조용히 말을 줄이고 마음을 데우며 회복하고 싶은 시간은 언제인가요?',
  },
] as const;

function formatArmenianKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const VIGIL_PHASES = [
  '새벽 등불의 시간 (꾸밈없이 감정을 들여다보는 정직한 첫 숨)',
  '정오 고백의 시간 (무거운 자책을 내려놓고 마음을 가볍게 비움)',
  '황혼 위안의 시간 (아직 풀리지 않은 일 앞에서도 작은 불씨 유지)',
  '심야 평화의 시간 (바깥의 소란을 끄고 내면의 결을 다시 이음)',
] as const;

const NAREKATSI_SHADOW_WARNINGS: Record<NarekatsiContemplationId, string> = {
  honest_confession: '솔직한 고백이 끝없는 자기 비난이나 체념으로 번지지 않도록 자비의 시선을 함께 두세요.',
  merciful_release: '스스로를 용서하는 마음이 필요한 책임 회피로 이어지지 않게 작은 다음 걸음을 정하세요.',
  vigilant_hope: '희망을 지킨다는 이유로 지금 몸과 마음이 보내는 피로 신호까지 억누르지 마세요.',
  quiet_restoration: '고요한 회복의 시간이 타인과의 단절로 굳어지지 않도록 따뜻한 안부 한 줄은 열어 두세요.',
};

export function calculateArmenianNarekatsiLamentationHealing(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ArmenianNarekatsiResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();

  const seedRaw = [
    params.profile.basic?.name ?? '',
    JSON.stringify(params.profile.fate ?? {}),
    now.toISOString().slice(0, 13),
    query,
  ].join('|');
  const seed = stableHash(seedRaw);
  const balanceSeed = stableHash(`${seedRaw}|balance`);
  const vigilSeed = stableHash(`${seedRaw}|vigil`);

  const primaryIdx = seed % NAREKATSI_CONTEMPLATIONS.length;
  const balancingOffset = 1 + (balanceSeed % (NAREKATSI_CONTEMPLATIONS.length - 1));
  const balancingIdx = (primaryIdx + balancingOffset) % NAREKATSI_CONTEMPLATIONS.length;

  const primaryContemplation = NAREKATSI_CONTEMPLATIONS[primaryIdx];
  const balancingContemplation = NAREKATSI_CONTEMPLATIONS[balancingIdx];
  const vigilPhase = VIGIL_PHASES[vigilSeed % VIGIL_PHASES.length];
  const shadowWarning = NAREKATSI_SHADOW_WARNINGS[primaryContemplation.id];
  const questionTopic: ArmenianNarekatsiResult['questionTopic'] = !query
    ? 'general'
    : /지쳐|쉬고|회복|위로|아픔|우울|눈물/.test(query)
      ? 'healing'
      : /자책|후회|실수|미안|내려놓|용서/.test(query)
        ? 'release'
        : /희망|버텨|내일|불씨|어둠|기다/.test(query)
          ? 'hope'
          : 'general';
  const narekatsiCrossAxis = `${questionTopic} · ${primaryContemplation.id} × ${vigilPhase.split('(')[0].trim()}`;

  const qualitativeSynthesis =
    `10세기 아르메니아 시인 그레고르 나레카치의 《애가》 관점으로 '${vigilPhase}'을(를) 살피면, 지금은 ` +
    `‘${primaryContemplation.armenianMotif} — ${primaryContemplation.koreanLabel}’의 결이 앞에 놓여 있습니다. ` +
    `${primaryContemplation.coreInsight} 여기에 ‘${balancingContemplation.koreanLabel}’이 균형을 받쳐 주어, ` +
    `완벽한 해답을 서두르기보다 다친 마음을 조용히 보듬으며 중심을 회복하기 좋은 흐름입니다.`;

  const reflectionFocus =
    `${primaryContemplation.koreanLabel}을 통해 무거운 긴장을 풀고 ${balancingContemplation.koreanLabel}으로 이어 가는 시점`;

  const ritualAction = `${primaryContemplation.healingPractice} (${balancingContemplation.koreanLabel}도 함께 떠올려 보세요.)`;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’을(를) 안고 있는 지금, ${primaryContemplation.reflectiveQuestion}`
    : primaryContemplation.reflectiveQuestion;

  return {
    engineName: '아르메니아 나레카치 《애가》 내면 정화·성찰 (Narekatsi Lamentation Healing)',
    engineVersion: 'LUCKEY-ARMENIAN-NAREKATSI-v2.4.0',
    calculatedAtKst: formatArmenianKstTimestamp(now),
    primaryContemplation,
    balancingContemplation,
    vigilPhase,
    questionTopic,
    narekatsiCrossAxis,
    shadowWarning,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 아르메니아 고전 영성 문학 《애가》의 치유적 성찰 모티프를 활용한 상징 프레임워크이며, 의학적·심리적 진단이나 운세 점수가 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatArmenianNarekatsiPrompt(res: ArmenianNarekatsiResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 중심 성찰: ${res.primaryContemplation.armenianMotif} · ${res.primaryContemplation.koreanLabel}`,
    `- 균형 성찰: ${res.balancingContemplation.armenianMotif} · ${res.balancingContemplation.koreanLabel}`,
    `- 내면 정화 국면: ${res.vigilPhase}`,
    `- 질문 맥락(${res.questionTopic}) · 나레카치 교차 축: ${res.narekatsiCrossAxis}`,
    `- 과잉·결핍 경계: ${res.shadowWarning}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
