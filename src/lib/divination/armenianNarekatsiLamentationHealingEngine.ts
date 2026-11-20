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
}

export interface ArmenianNarekatsiResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  primaryContemplation: NarekatsiContemplation;
  balancingContemplation: NarekatsiContemplation;
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
  },
  {
    id: 'merciful_release',
    armenianMotif: 'Oghormutyun (자비와 내려놓음)',
    koreanLabel: '자책에서 벗어나는 너그러움',
    coreInsight: '지나간 실수나 어쩔 수 없던 한계를 끝없이 되감기하기보다, 지금의 나를 다정히 용서하고 놓아주는 힘입니다.',
    healingPractice: '오래 붙들고 있던 자책 하나를 오늘 저녁에는 잠깐 내려놓고 따뜻한 물 한 잔을 마시세요.',
  },
  {
    id: 'vigilant_hope',
    armenianMotif: 'Huys (꺼지지 않는 등불)',
    koreanLabel: '흐림 너머를 보는 조용한 희망',
    coreInsight: '당장 모든 문제가 풀리지 않아도, 빛이 완전히 사라진 것이 아님을 믿고 작은 불씨를 지키는 인내입니다.',
    healingPractice: '오늘 하루 중 작더라도 분명히 잘 버텨낸 한 장면을 스스로에게 짚어 주세요.',
  },
  {
    id: 'quiet_restoration',
    armenianMotif: 'Khaghaghutyun (내면의 평화)',
    koreanLabel: '말을 줄이고 마음을 데우는 회복',
    coreInsight: '바깥의 소란을 이기려 애쓰기보다, 깊은 고요 속에서 부서진 감정의 결을 다시 이어 붙이는 시간입니다.',
    healingPractice: '자기 전 10분간 화면을 멀리 두고 깊고 느린 호흡으로 하루를 마무리해 보세요.',
  },
] as const;

function formatArmenianKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateArmenianNarekatsiLamentationHealing(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ArmenianNarekatsiResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();

  const seed = stableHash(
    [
      params.profile.basic?.name ?? '',
      JSON.stringify(params.profile.fate ?? {}),
      query,
    ].join('|')
  );

  const primaryIdx = seed % NAREKATSI_CONTEMPLATIONS.length;
  const balancingIdx = (primaryIdx + 2) % NAREKATSI_CONTEMPLATIONS.length;

  const primaryContemplation = NAREKATSI_CONTEMPLATIONS[primaryIdx];
  const balancingContemplation = NAREKATSI_CONTEMPLATIONS[balancingIdx];

  const qualitativeSynthesis =
    `10세기 아르메니아 시인 그레고르 나레카치의 《애가》 관점으로 마음을 살피면, 지금은 ` +
    `‘${primaryContemplation.armenianMotif} — ${primaryContemplation.koreanLabel}’의 결이 앞에 놓여 있습니다. ` +
    `${primaryContemplation.coreInsight} 여기에 ‘${balancingContemplation.koreanLabel}’이 균형을 받쳐 주어, ` +
    `완벽한 해답을 서두르기보다 다친 마음을 조용히 보듬으며 중심을 회복하기 좋은 흐름입니다.`;

  const reflectionFocus =
    `${primaryContemplation.koreanLabel}을 통해 무거운 긴장을 풀고 ${balancingContemplation.koreanLabel}으로 이어 가는 시점`;

  const ritualAction = primaryContemplation.healingPractice;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’을(를) 안고 있는 지금, 스스로에게 조금 더 너그러워진다면 가장 먼저 내려놓을 수 있는 부담은 무엇인가요?`
    : `오늘 내 마음속에서 누구에게도 말하지 못한 채 혼자 견뎌 온 감정 하나를 다정히 알아준다면 무엇일까요?`;

  return {
    engineName: '아르메니아 나레카치 《애가》 내면 정화·성찰 (Narekatsi Lamentation Healing)',
    engineVersion: 'LUCKEY-ARMENIAN-NAREKATSI-v2.1.0',
    calculatedAtKst: formatArmenianKstTimestamp(now),
    primaryContemplation,
    balancingContemplation,
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
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
