import type { UserProfile } from '../sharedState';

export interface SumbaIkatInput {
  profile: UserProfile;
  now?: Date;
  question?: string;
}

export interface SumbaIkatResult {
  engineVersion: string;
  calculatedAtKst: string;
  ikatMotif: string;
  companionMotif: string;
  dyeThreadState: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  '힌기 천의 묶음 매듭(Ikat Binding): 염색 전에 실을 단단히 묶어 두어 물들지 않은 흰 여백으로 무늬를 피우는 절제',
  '쪽빛과 모린다 붉은 염료(Indigo & Morinda): 수십 번 담그고 말리기를 거듭해야 비로소 깊이가 우러나는 인내의 색',
  '안둥·해골 나무 실루엣(Andung Motif): 삶의 묵직한 기억과 용기를 무늬 속에 정직하게 엮어 넣는 서사',
  '바다의 말과 거북 문양(Kuda & Penyu): 먼 길을 건너는 힘과 흔들리지 않는 걸음을 함께 새기는 조화',
] as const;

const THREAD_STATES = [
  '여백을 남기려 묶어 둔 매듭',
  '겹겹이 배어드는 깊은 쪽빛',
  '햇볕 아래 고르게 마르는 실타래',
  '씨실과 날실이 맞물리는 직조',
] as const;

const RITUALS = [
  '모든 것을 한꺼번에 채우려 하지 말고 오늘 비워 둘 시간 한 칸을 미리 묶어 두세요.',
  '당장 티가 나지 않아도 매일 조금씩 반복해야 깊어지는 루틴 하나를 차분히 이어 가세요.',
  '지나온 경험 중 지금의 나를 가장 잘 설명해 주는 이야기 하나를 짧게 정리해 보세요.',
  '서두르기보다 실을 말리듯 한 템포 쉬었다가 다음 단계를 밟아 보세요.',
] as const;

const QUESTIONS = [
  '지금 내 삶에서 무늬를 또렷하게 만들기 위해 오히려 물들이지 않고 비워 두어야 할 부분은 어디인가요?',
  '단번에 결과를 내기보다 여러 번 담그고 말리는 시간이 필요한 일은 무엇일까요?',
  '오래 남을 나만의 이야기에 오늘 어떤 색의 실 한 올을 더하고 싶나요?',
  '내 하루의 씨실과 날실이 엉키지 않고 고르게 엮이고 있는지 살펴볼까요?',
] as const;

function toKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateSumbaIkatStory(input: SumbaIkatInput): SumbaIkatResult {
  const now = input.now ?? new Date();
  const fate = input.profile?.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.question ?? ''}|${now.toISOString().slice(0, 10)}|sumba-ikat`;
  const h = stableHash(seedText);

  const motifIdx = h % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seedText}|companion`) % (MOTIFS.length - 1));
  const ikatMotif = MOTIFS[motifIdx];
  const companionMotif = MOTIFS[(motifIdx + companionOffset) % MOTIFS.length];
  const dyeThreadState = THREAD_STATES[(h >>> 3) % THREAD_STATES.length];
  const ritualAction = RITUALS[motifIdx];
  const reflectiveQuestion = QUESTIONS[motifIdx];

  return {
    engineVersion: 'LUCKEY-SUMBA-IKAT-v2.2.0',
    calculatedAtKst: toKstIso(now),
    ikatMotif,
    companionMotif,
    dyeThreadState,
    reflectionFocus: `실을 먼저 묶어 여백을 지키고 수차례 천연 염료에 담가 서사를 짜는 숨바 섬의 이카트 직조처럼, 주 모티프와 동반 모티프('${companionMotif}')가 어우러져 지금은 '${dyeThreadState}'의 호흡이 빛나는 시점입니다.`,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary: '인도네시아 숨바 섬의 전통 이카트 염색·직조 서사를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSumbaIkatPrompt(result: SumbaIkatResult): string {
  return [
    `[숨바 이카트 염색 베틀 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 상징 모티프: ${result.ikatMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 현재 결: ${result.dyeThreadState}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
