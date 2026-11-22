import type { UserProfile } from '../sharedState';

export type TurkanaQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface TurkanaWindResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: TurkanaQuestionTopic;
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  riftWindAxis: string;
  shadowWarning: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function getKstTimeString(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
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
  '거센 바람에 맞서 힘만 빼기보다, 바람결이 만들어 내는 옥빛 물결을 타듯 오늘의 리듬을 바꿔 보세요.',
  '지금 거센 바람이 불고 있다면 맞서 버티기보다 바람의 방향에 맞춰 내 자리나 계획을 가볍게 조정해 보세요.',
  '먼 목표와 발밑의 오늘 할 일 중 지금 당장 밟아야 할 한 걸음만 또렷이 골라 보세요.',
  '겉으로 답이 보이지 않을수록 마른 강바닥을 조금만 더 파 보는 마음으로 한 번 더 확인해 보세요.',
  '내가 이미 쥐고 있는 작은 자원 하나가 누구의 필요와 맞닿을 수 있는지 가볍게 떠올려 보세요.'
];

const TURKANA_QUESTIONS = [
  '지금 내 앞에서 불고 있는 바람을 피하지 않고 오히려 물결의 색으로 바꿀 방법은 무엇일까요?',
  '무겁게 못 박아 둔 자리에서 야자 천막처럼 가볍게 방향만 틀어도 훨씬 편해질 일은 무엇인가요?',
  '먼 수평선에 시선을 빼앗겨 자꾸 놓치고 있던 발밑의 돌부리는 무엇인가요?',
  '겉으로 말라 보이지만 조금만 더 파 보면 물길이 나올 것 같은 자리는 어디인가요?',
  '내가 가진 작은 소금 한 줌이 다른 이의 하루와 만날 수 있는 연결 지점은 어디인가요?'
];

function classifyTurkanaTopic(question?: string): TurkanaQuestionTopic {
  const q = (question ?? '').trim();
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(q)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(q)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(q)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복/.test(q)) return 'health';
  if (/결정|선택|고민|방향|시작|바람|물결/.test(q)) return 'decision';
  return 'general';
}

export function calculateTurkanaJadeSeaWind(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TurkanaWindResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % TURKANA_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (TURKANA_MOTIFS.length - 1));

  const motif = TURKANA_MOTIFS[idx];
  const companionMotif = TURKANA_MOTIFS[(idx + companionOffset) % TURKANA_MOTIFS.length];
  const ritualAction = TURKANA_ACTIONS[idx];
  const reflectiveQuestion = TURKANA_QUESTIONS[idx];
  const questionTopic = classifyTurkanaTopic(question);
  const riftWindAxis = `${motif.slice(0, 14).trim()}… ↔ ${companionMotif.slice(0, 14).trim()}… 리프트 바람 축`;
  const shadowWarning = '[리프트 바람 과잉 경계] 바람을 피해 잦은 이동만 반복하거나 한 자리에 지나치게 버티다 유연한 균형을 잃지 않도록 살피십시오.';

  return {
    engineVersion: 'LUCKEY-TURKANA-WIND-v2.3.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 거친 바람을 비취빛 물결로 바꾸는 투르카나 호수 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '사막의 거친 바람 속에서도 옥빛 물결과 가벼운 기동성을 지키는 투르카나 비취 바다 관점',
    symbolicMotif: motif,
    companionMotif,
    riftWindAxis,
    shadowWarning,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '케냐 투르카나 호수와 사막 유목 문화의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatTurkanaWindPrompt(result: TurkanaWindResult): string {
  return [
    `[투르카나·비취 바다 바람 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst} | 질문 맥락: ${result.questionTopic}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 리프트 바람 축: ${result.riftWindAxis}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
