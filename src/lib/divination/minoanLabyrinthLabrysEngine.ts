import type { UserProfile } from '../sharedState';

export interface MinoanLabyrinthStage {
  name: string;
  motif: string;
  guidance: string;
}

export interface MinoanLabyrinthResult {
  engineVersion: string;
  calculatedAtKst: string;
  activeStage: MinoanLabyrinthStage;
  labrysBalance: string;
  interpretation: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MINOAN_LABYRINTH_STAGES: MinoanLabyrinthStage[] = [
  {
    name: '미궁 입구 — 실타래를 손에 쥐는 첫 걸음',
    motif: '아리아드네의 실',
    guidance: '복잡해 보이는 문제도 입구에서 기준이 되는 실 한 가닥만 놓치지 않으면 길을 잃지 않고 건너갈 수 있습니다.',
  },
  {
    name: '굽이치는 회랑 — 서두르지 않는 방향 전환',
    motif: '크노소스 나선 회랑',
    guidance: '직선으로 곧장 닿지 않는다고 해서 잘못 가고 있는 것이 아닙니다. 굽이도는 길 자체가 중심을 향한 과정입니다.',
  },
  {
    name: '미궁의 중심 — 이중 도끼(라브리스)의 명료함',
    motif: '라브리스(Labrys)',
    guidance: '양날의 균형처럼 두 가지 상반된 요구 사이에서 불필요한 가지를 쳐내고 핵심 하나를 마주하는 자리입니다.',
  },
  {
    name: '되돌아 나오는 길 — 배운 것을 품고 일상으로',
    motif: '황소 도약자의 유연함',
    guidance: '긴장된 순간에도 힘으로 맞서기보다 유연하게 몸을 띄워 넘듯, 겪은 통찰을 가볍게 삶에 옮길 때입니다.',
  },
];

const LABRYS_BALANCES = [
  '실행의 날과 성찰의 날을 같은 무게로 세우는 균형',
  '타인의 기대와 나의 진심 사이에서 중심선을 긋는 명료함',
  '복잡한 선택지 속에서 단 하나의 실타래만 남기는 단순화',
];

function formatKstTimestamp(date: Date): string {
  const kstMs = date.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateMinoanLabyrinthLabrys(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MinoanLabyrinthResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 10)}`;
  const hash = stableHash(seed);

  const activeStage = MINOAN_LABYRINTH_STAGES[hash % MINOAN_LABYRINTH_STAGES.length];
  const labrysBalance = LABRYS_BALANCES[(hash >>> 3) % LABRYS_BALANCES.length];

  return {
    engineVersion: 'LUCKEY-MINOAN-LABYRINTH-v2.1.0',
    calculatedAtKst: formatKstTimestamp(now),
    activeStage,
    labrysBalance,
    interpretation: `고대 미노스 크노소스 미궁과 라브리스 상징에서는 지금이 '${activeStage.name}'(${activeStage.motif}) 구간에 해당합니다. ${activeStage.guidance}`,
    ritualAction: '머릿속에서 얽힌 고민을 종이에 한 줄로 적어 ‘절대 놓치지 않을 실타래’ 한 가지만 남기고 나머지는 오늘 보류해 보세요.',
    reflectionFocus: `'${labrysBalance}'을(를) 기준으로 지금 내 선택이 중심을 향하고 있는지 차분히 가늠해 보세요.`,
    reflectiveQuestion: '지금 복잡하게 얽혀 보이는 문제 속에서, 내가 끝까지 손에 쥐고 있으면 길을 잃지 않을 단 하나의 실타래는 무엇인가요?',
    interpretiveBoundary: '본 풀이는 고대 미노스 크노소스 미궁과 라브리스 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMinoanLabyrinthPrompt(result: MinoanLabyrinthResult): string {
  return [
    `[고대 미노스 미궁·라브리스 중심 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 미궁 구간: ${result.activeStage.name} (${result.activeStage.motif})`,
    `- 라브리스 균형: ${result.labrysBalance}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
