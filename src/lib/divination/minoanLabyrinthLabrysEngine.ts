import type { UserProfile } from '../sharedState';

export interface MinoanLabyrinthStage {
  name: string;
  motif: string;
  guidance: string;
  action: string;
  question: string;
}

export interface MinoanLabyrinthResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '실마리·입구' | '우회·인내' | '핵심·결단' | '적용·유연' | '크노소스 전반';
  activeStage: MinoanLabyrinthStage;
  companionStage: MinoanLabyrinthStage;
  labyrinthAxis: string;
  labrysBalance: string;
  interpretation: string;
  ritualAction: string;
  shadowWarning: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MINOAN_LABYRINTH_STAGES: MinoanLabyrinthStage[] = [
  {
    name: '미궁 입구 — 실타래를 손에 쥐는 첫 걸음',
    motif: '아리아드네의 실',
    guidance: '복잡해 보이는 문제도 입구에서 기준이 되는 실 한 가닥만 놓치지 않으면 길을 잃지 않고 건너갈 수 있습니다.',
    action: '머릿속에서 얽힌 고민을 종이에 한 줄로 적어 ‘절대 놓치지 않을 실타래’ 한 가지만 남기고 나머지는 오늘 보류해 보세요.',
    question: '지금 복잡하게 얽혀 보이는 문제 속에서, 내가 끝까지 손에 쥐고 있으면 길을 잃지 않을 단 하나의 실타래는 무엇인가요?',
  },
  {
    name: '굽이치는 회랑 — 서두르지 않는 방향 전환',
    motif: '크노소스 나선 회랑',
    guidance: '직선으로 곧장 닿지 않는다고 해서 잘못 가고 있는 것이 아닙니다. 굽이도는 길 자체가 중심을 향한 과정입니다.',
    action: '직선으로 해결되지 않는 문제 앞에서 오늘 당장 결론을 내리지 말고, 한 굽이 돌아가는 대안 경로 한 가지만 적어 보세요.',
    question: '곧장 닿지 않는다고 조급해하고 있었지만, 사실은 중심을 향해 굽이돌며 꼭 거쳐 가야 하는 회랑은 어디인가요?',
  },
  {
    name: '미궁의 중심 — 이중 도끼(라브리스)의 명료함',
    motif: '라브리스(Labrys)',
    guidance: '양날의 균형처럼 두 가지 상반된 요구 사이에서 불필요한 가지를 쳐내고 핵심 하나를 마주하는 자리입니다.',
    action: '서로 부딪히는 두 요구 사이에서 오늘 반드시 지켜야 할 핵심 기준 하나를 남기고 군더더기 선택지 하나를 정리해 보세요.',
    question: '라브리스의 양날처럼 상반된 요구가 맞서는 자리에서, 내가 명료하게 쳐내거나 중심에 세워야 할 핵심은 무엇인가요?',
  },
  {
    name: '되돌아 나오는 길 — 배운 것을 품고 일상으로',
    motif: '황소 도약자의 유연함',
    guidance: '긴장된 순간에도 힘으로 맞서기보다 유연하게 몸을 띄워 넘듯, 겪은 통찰을 가볍게 삶에 옮길 때입니다.',
    action: '최근 긴장했던 상황에서 배운 교훈 한 줄을 오늘 실제 일정 한 곳에 가볍게 적용해 보세요.',
    question: '힘으로 밀어붙이기보다 황소 도약자처럼 유연하게 몸을 띄워 넘기며 일상에 옮길 수 있는 배움은 무엇인가요?',
  },
];

const LABRYS_BALANCES = [
  '실행의 날과 성찰의 날을 같은 무게로 세우는 균형',
  '타인의 기대와 나의 진심 사이에서 중심선을 긋는 명료함',
  '복잡한 선택지 속에서 단 하나의 실타래만 남기는 단순화',
];

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const MINOAN_SHADOWS = [
  '단 하나의 실타래만 붙잡는 단순화가 지나치면, 중간에 새로 생겨난 중요한 변수나 경고 신호까지 외면할 수 있습니다.',
  '굽이도는 회랑을 인내하며 걷는 태도가 정작 막다른 골목에서 방향을 수정해야 할 결단까지 늦추지 않도록 하세요.',
  '라브리스의 양날로 군더더기를 쳐내는 명료함이 함께 맞춰 가야 할 상대의 맥락이나 여백까지 단칼에 잘라 내지는 않게 살피세요.',
  '황소 도약자처럼 유연하게 넘기는 가벼움이 꼭 묵직하게 마주 앉아 정리해야 할 핵심 과제까지 피하게 해서는 안 됩니다.',
];

function classifyMinoanTopic(q: string): MinoanLabyrinthResult['questionTopic'] {
  if (/실마리|입구|복잡|얽힌/.test(q)) return '실마리·입구';
  if (/회랑|우회|돌아|조급/.test(q)) return '우회·인내';
  if (/핵심|결단|중심|기준/.test(q)) return '핵심·결단';
  if (/적용|유연|일상|배움/.test(q)) return '적용·유연';
  return '크노소스 전반';
}

export function calculateMinoanLabyrinthLabrys(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MinoanLabyrinthResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyMinoanTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const activeIdx = hash % MINOAN_LABYRINTH_STAGES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MINOAN_LABYRINTH_STAGES.length - 1));
  const activeStage = MINOAN_LABYRINTH_STAGES[activeIdx];
  const companionStage = MINOAN_LABYRINTH_STAGES[(activeIdx + companionOffset) % MINOAN_LABYRINTH_STAGES.length];
  const labyrinthAxis = `${activeStage.motif} ↔ ${companionStage.motif} (${questionTopic})`;
  const labrysBalance = LABRYS_BALANCES[stableHash(`${seed}|balance`) % LABRYS_BALANCES.length];

  return {
    engineVersion: 'LUCKEY-MINOAN-LABYRINTH-v2.3.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionTopic,
    activeStage,
    companionStage,
    labyrinthAxis,
    labrysBalance,
    interpretation: `고대 미노스 크노소스 미궁과 라브리스 상징에서는 지금이 '${activeStage.name}'(${activeStage.motif}) 구간에 해당하며 '${companionStage.name}'의 시야가 동반됩니다. ${activeStage.guidance}`,
    ritualAction: activeStage.action,
    shadowWarning: MINOAN_SHADOWS[activeIdx],
    reflectionFocus: `'${labrysBalance}'을(를) 기준으로 지금 내 선택이 중심을 향하고 있는지 차분히 가늠해 보세요.`,
    reflectiveQuestion: activeStage.question,
    interpretiveBoundary: '본 풀이는 고대 미노스 크노소스 미궁과 라브리스 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMinoanLabyrinthPrompt(result: MinoanLabyrinthResult): string {
  return [
    `[고대 미노스 미궁·라브리스 중심 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 미궁 항로 축: ${result.labyrinthAxis}`,
    `- 미궁 구간: ${result.activeStage.name} (${result.activeStage.motif})`,
    `- 동반 구간: ${result.companionStage.name} (${result.companionStage.motif})`,
    `- 라브리스 균형: ${result.labrysBalance}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
