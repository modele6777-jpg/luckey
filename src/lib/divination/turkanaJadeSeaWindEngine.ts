import type { UserProfile } from '../sharedState';

export interface TurkanaWindResult {
  engineVersion: string;
  calculatedAtKst: string;
  reflectionFocus: string;
  symbolicMotif: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function getKstTimeString(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const TURKANA_MOTIFS = [
  '동아프리카 리프트 밸리의 비취 바다(Jade Sea) 투르카나 호수처럼 거친 바람이 불수록 오히려 선명한 옥빛 물결을 드러내는 저력',
  '야자수 가지를 엮어 만든 둥근 이동식 천막(Manyatta)처럼 언제든 바람의 방향에 맞춰 가볍게 자리를 옮길 수 있는 기동성',
  '광활한 화산 자갈 사막 위에서 긴 지팡이를 짚고 걷는 목동처럼 먼 수평선을 보면서도 발밑의 돌부리를 놓치지 않는 시선',
  '건기에는 마른 강바닥을 파서 물길을 찾듯 겉으로 텅 비어 보이는 상황에서도 땅속의 가능성을 포기하지 않는 끈기',
  '호숫가에서 소금을 긁어 모아 내륙과 나누는 교역처럼 내가 가진 작은 자원이 다른 이의 필요와 만나는 연결'
];

const TURKANA_ACTIONS = [
  '지금 거센 바람이 불고 있다면 맞서 버티기보다 바람의 방향에 맞춰 내 자리나 계획을 가볍게 조정해 보세요.',
  '겉으로 답이 보이지 않을수록 마른 강바닥을 조금만 더 파 보는 마음으로 한 번 더 확인해 보세요.',
  '먼 목표와 발밑의 오늘 할 일 중 지금 당장 밟아야 할 한 걸음만 또렷이 골라 보세요.'
];

export function calculateTurkanaJadeSeaWind(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TurkanaWindResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const motif = TURKANA_MOTIFS[hash % TURKANA_MOTIFS.length];
  const ritualAction = TURKANA_ACTIONS[Math.floor(hash / 7) % TURKANA_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-TURKANA-WIND-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 거친 바람을 비취빛 물결로 바꾸는 투르카나 호수 관점`
      : '사막의 거친 바람 속에서도 옥빛 물결과 가벼운 기동성을 지키는 투르카나 비취 바다 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '지금 내 앞에서 불고 있는 바람을 피하지 않고 오히려 물결의 색으로 바꿀 방법은 무엇일까요?',
    interpretiveBoundary:
      '케냐 투르카나 호수와 사막 유목 문화의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatTurkanaWindPrompt(result: TurkanaWindResult): string {
  return [
    `[투르카나·비취 바다 바람 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
