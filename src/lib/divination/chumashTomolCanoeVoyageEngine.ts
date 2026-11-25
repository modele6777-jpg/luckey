import type { UserProfile } from '../sharedState';

export interface ChumashTomolInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export type ChumashQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface ChumashTomolResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: ChumashQuestionTopic;
  voyageSignal: string;
  companionSignal: string;
  plankSealing: string;
  tideNavigationAxis: string;
  topicBalanceHint: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNALS = [
  '해협 안개를 가르는 삼나무 판자 카누의 뱃머리',
  '아스팔트와 송진으로 틈을 메운 단단한 선체',
  '섬과 육지를 잇는 아침 조류의 고른 흐름',
  '별빛과 해류 감각을 함께 읽는 항해사의 시선',
] as const;

const SEALINGS = [
  '작은 틈새를 미리 메워 둔 배가 먼 해협을 안전하게 건너듯 기본 점검이 큰 여유를 만듭니다.',
  '서로 다른 나무 판자가 단단히 엮여 하나의 선체가 되듯 흩어진 경험이 오늘의 힘이 됩니다.',
  '바다를 이기려 하지 않고 조류가 열리는 때를 기다리는 지혜가 헛된 소모를 줄여 줍니다.',
  '혼자 노를 젓는 구간에서도 육지와 섬의 기준점을 기억하면 방향을 잃지 않습니다.',
] as const;

const ACTIONS = [
  '지금 진행 중인 일에서 작은 틈새나 빠진 확인 사항 하나를 먼저 메우기',
  '도움을 주고받을 수 있는 동료나 지인에게 현재 진행 상황 짧게 공유하기',
  '오늘의 항해를 마친 뒤 스스로에게 줄 작은 휴식과 보상 정해 두기',
  '결정하기 전 하루의 에너지가 가장 맑은 시간대에 다시 한 번 점검하기',
] as const;

const QUESTIONS = [
  '지금 내 일정이나 계획에서 미리 메워 두어야 할 작은 틈새는 어디인가요?',
  '맞바람을 거슬러 힘으로 밀어붙이기보다 조류가 바뀔 때를 기다릴 일은 무엇인가요?',
  '내 안의 흩어진 경험들을 하나로 묶어 준 가장 든든한 연결고리는 무엇인가요?',
  '오늘 내가 도달하고 싶은 건너편 섬은 어디이며, 첫 노 젓기는 무엇일까요?',
] as const;

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function classifyChumashTopic(question?: string): ChumashQuestionTopic {
  const q = (question ?? '').trim();
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(q)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(q)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(q)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복/.test(q)) return 'health';
  if (/결정|선택|고민|방향|시작|틈|안전/.test(q)) return 'decision';
  return 'general';
}

const TOPIC_BALANCE_HINTS: Record<ChumashQuestionTopic, string> = {
  career: '일·커리어에서는 큰 항해를 서두르기보다 작은 틈새와 빠진 확인 사항부터 메워 두는 편이 끝까지 안전합니다.',
  relationship: '관계에서는 혼자 노를 젓기보다 건너편과 조류를 맞출 수 있는 짧은 안부 공유가 거리를 좁혀 줍니다.',
  wealth: '재정·계약에서는 누수되는 작은 틈을 먼저 점검하고 조류가 열리는 시점을 차분히 기다리는 것이 좋습니다.',
  health: '건강·회복에서는 맞바람을 힘으로 거스르지 말고 물결이 잔잔해지는 시간에 맞춰 쉼을 배치하세요.',
  decision: '선택 앞에서는 완벽한 조건만 기다리지 말고, 작은 틈을 메운 뒤 조류가 열릴 때 가볍게 출항하세요.',
  general: '오늘의 흐름에서는 주 신호와 동반 신호를 함께 보며 선체 점검과 출항 타이밍의 균형을 맞추세요.',
};

export function calculateChumashTomolCanoe(input: ChumashTomolInput): ChumashTomolResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const signalIdx = seed % SIGNALS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (SIGNALS.length - 1));
  const voyageSignal = SIGNALS[signalIdx];
  const companionSignal = SIGNALS[(signalIdx + companionOffset) % SIGNALS.length];
  const questionTopic = classifyChumashTopic(input.question);
  const tideNavigationAxis = `${voyageSignal} ↔ ${companionSignal} 해협 조류 축`;
  const shadowWarning = '[항해 과잉 경계] 틈새 점검과 만반의 준비에만 머무르며 정작 조류가 열린 순간의 출항을 놓치지 않도록 살피십시오.';

  return {
    engineVersion: 'LUCKEY-CHUMASH-TOMOL-v2.4.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    voyageSignal,
    companionSignal,
    plankSealing: SEALINGS[(seed >>> 3) % SEALINGS.length],
    tideNavigationAxis,
    topicBalanceHint: TOPIC_BALANCE_HINTS[questionTopic],
    shadowWarning,
    reflectionFocus: `캘리포니아 해협을 건너던 추마시 족의 토몰(Tomol) 판자 카누처럼 주 신호('${voyageSignal}')와 동반 신호('${companionSignal}')를 함께 짚어 작은 틈을 정성껏 메우고 해류를 읽으며 나아가는 상징적 관점입니다.`,
    ritualAction: ACTIONS[signalIdx],
    reflectiveQuestion: QUESTIONS[signalIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatChumashTomolPrompt(res: ChumashTomolResult): string {
  return [
    `[추마시·토몰 카누 항해 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `항해 신호: ${res.voyageSignal}`,
    `동반 신호: ${res.companionSignal}`,
    `해협 조류 축: ${res.tideNavigationAxis}`,
    `주제별 균형 조언: ${res.topicBalanceHint}`,
    `선체 결합: ${res.plankSealing}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `과잉 경계: ${res.shadowWarning}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
