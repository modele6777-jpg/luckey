import type { UserProfile } from '../sharedState';

export interface VenetianLagoonInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface VenetianLagoonResult {
  engineVersion: string;
  calculatedAtKst: string;
  forcolaNotch: string;
  lagoonCurrent: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const NOTCHES = [
  '좁은 수로를 부드럽게 미끄러지는 깊은 첫 홈',
  '예고 없는 모퉁이에서 배를 세우는 반전 턱',
  '얕은 석호 바닥을 읽어 내는 고요한 노 끝',
  '물결의 흔들림을 반동으로 바꾸는 호두나무 곡선',
] as const;

const CURRENTS = [
  '직선으로만 밀어붙이지 않고 홈의 각도를 살짝 바꾸면 좁은 골목도 닿지 않고 빠져나갑니다.',
  '배를 멈추는 노 젓기가 나아가는 노 젓기만큼 중요할 때, 지금의 멈춤도 방향 조절입니다.',
  '잔잔한 석호 아래 물길은 늘 조수에 따라 바뀌므로, 익숙한 길도 오늘의 물높이로 살피세요.',
  '한쪽 노로도 배가 곧장 가는 이유는 몸의 중심과 미세한 손목의 비틀림이 맞물리기 때문입니다.',
] as const;

const ACTIONS = [
  '지금 고수하던 방식의 각도를 살짝 15도만 틀어 다른 선택지 하나 시험해 보기',
  '무작정 속도를 내기보다 멈춤과 회전이 필요한 지점 한 곳을 미리 표시해 두기',
  '오늘 마주친 좁고 복잡한 상황에서 힘 대신 유연한 손목의 힘을 쓰듯 가볍게 대응하기',
  '현재 내가 지나가는 수로의 물높이(체력·일정 여유)를 1분만 가늠해 보기',
] as const;

const QUESTIONS = [
  '지금 내 노를 걸어 두어야 할 포르콜라(노받침)의 홈은 전진인가요, 회전인가요, 멈춤인가요?',
  '힘으로 밀어붙이다 벽에 부딪히기 전에 각도만 살짝 바꾸면 풀릴 문제는 무엇인가요?',
  '겉으로 잔잔해 보이는 내 일상의 물길 아래에서 흐르고 있는 조수는 어느 방향인가요?',
  '혼자 한쪽 노를 저으면서도 균형을 잃지 않기 위해 오늘 챙겨야 할 중심은 무엇인가요?',
] as const;

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateVenetianLagoonForcola(input: VenetianLagoonInput): VenetianLagoonResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-VENETIAN-FORCOLA-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    forcolaNotch: NOTCHES[seed % NOTCHES.length],
    lagoonCurrent: CURRENTS[(seed >>> 3) % CURRENTS.length],
    reflectionFocus: '베네치아 석호의 좁은 수로를 한쪽 노와 여덟 개 홈이 파인 호두나무 노받침(포르콜라)으로 항해하듯, 상황에 맞는 각도와 멈춤을 읽는 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatVenetianLagoonPrompt(res: VenetianLagoonResult): string {
  return [
    `[베네치아·라구나 포르콜라 노 젓기 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `노받침 홈: ${res.forcolaNotch}`,
    `석호 물길: ${res.lagoonCurrent}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
