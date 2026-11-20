import type { UserProfile } from '../sharedState';

export interface KogiAlunaInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface KogiAlunaResult {
  engineVersion: string;
  calculatedAtKst: string;
  alunaThread: string;
  companionThread: string;
  mountainBalance: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const THREADS = [
  '말보다 먼저 마음을 엮어 내는 보이지 않는 알루나의 실',
  '산의 눈과 바다의 물결이 서로의 소식을 묻는 고요한 연결',
  '서두르지 않고 실타래를 감듯 생각을 가라앉히는 자리',
  '모든 행동 이전에 순수한 의도를 먼저 세우는 명상',
] as const;

const BALANCES = [
  '눈에 보이는 일만 다그치기 전에 마음의 실(알루나)이 어디에 매여 있는지 살피면 얽힘이 풀립니다.',
  '높은 산의 균형이 아래 마을의 평온을 지키듯, 가장 근본적인 루틴 하나가 하루 전체를 받쳐 줍니다.',
  '당장 해결하려 들기보다 생각의 매듭을 조용히 만지며 의도를 맑히는 시간이 먼저입니다.',
  '자연과 일상이 한 줄의 실로 이어져 있듯, 나 자신을 돌보는 일이 곧 주변을 돌보는 일입니다.',
] as const;

const ACTIONS = [
  '무언가를 시작하기 전 1분간 눈을 감고 오늘 이 일을 하는 진짜 의도 한 문장 떠올리기',
  '머릿속을 어지럽히는 생각의 실타래 중 가장 먼저 풀어야 할 매듭 하나만 골라 적기',
  '전자기기를 잠시 내려놓고 창밖의 빛이나 바람의 온도를 느끼며 감각 깨우기',
  '누군가에게 건넬 말 한마디를 내뱉기 전에 그 말에 담긴 마음을 한 번 더 고르기',
] as const;

const QUESTIONS = [
  '지금 내 행동보다 앞서 가고 있거나 뒤처져 있는 마음의 실(의도)은 어느 쪽인가요?',
  '내 일상의 겉모습을 바꾸기 전에 먼저 조용히 풀어야 할 내면의 매듭은 무엇인가요?',
  '가장 높은 산처럼 내 하루 전체의 균형을 잡아 주는 핵심 루틴은 무엇인가요?',
  '말로 설명하지 않아도 스스로에게 가장 정직하게 남아 있는 바람은 무엇인가요?',
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

export function calculateKogiAlunaThread(input: KogiAlunaInput): KogiAlunaResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const threadIdx = seed % THREADS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (THREADS.length - 1));
  const alunaThread = THREADS[threadIdx];
  const companionThread = THREADS[(threadIdx + companionOffset) % THREADS.length];

  return {
    engineVersion: 'LUCKEY-KOGI-ALUNA-v2.2.0',
    calculatedAtKst: toKstIso(input.now),
    alunaThread,
    companionThread,
    mountainBalance: BALANCES[(seed >>> 3) % BALANCES.length],
    reflectionFocus: `콜롬비아 시에라 네바다 산맥의 코기 족이 물질 세계 너머의 의도와 연결을 엮는 사유의 실 알루나(Aluna)처럼, 주 실('${alunaThread}')과 동반 실('${companionThread}')을 겹쳐 행동 이전의 마음을 살피는 상징적 관점입니다.`,
    ritualAction: ACTIONS[threadIdx],
    reflectiveQuestion: QUESTIONS[threadIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatKogiAlunaPrompt(res: KogiAlunaResult): string {
  return [
    `[코기·알루나 사유 실 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `사유의 실: ${res.alunaThread}`,
    `동반 실: ${res.companionThread}`,
    `산맥 균형: ${res.mountainBalance}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
