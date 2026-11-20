import type { UserProfile } from '../sharedState';

export interface ShanInleRowingInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface ShanInleRowingResult {
  engineVersion: string;
  calculatedAtKst: string;
  lakePosture: string;
  oarBalance: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const POSTURES = [
  '인레 호수 수초 위로 시야를 넓힌 선 자세',
  '한 발로 노를 감싸 쥔 고요한 중심 잡기',
  '갈대밭 물길을 헤치며 나아가는 부드러운 추진',
  '아침 호수 위 뜬 밭을 살피는 섬세한 균형',
] as const;

const BALANCES = [
  '힘을 두 배로 쓰기보다 몸의 중심을 세우면 한 발의 움직임으로도 배가 멀리 나아갑니다.',
  '호수 위에서 시야가 넓어질수록 수초에 걸리지 않는 우회로가 먼저 보입니다.',
  '두 손이 자유로워야 그물을 살피듯, 일상의 기본 루틴이 몸에 배면 판단의 여유가 생깁니다.',
  '잔잔한 물결에 맞서지 않고 리듬을 탈 때 흔들림이 오히려 추진력이 됩니다.',
] as const;

const ACTIONS = [
  '지금 진행 중인 일에서 가장 불필요한 힘 빼기 한 가지를 정해 실행하기',
  '잠시 자리에서 일어나 바른 자세로 호흡하며 시야를 멀리 두기',
  '오늘 해야 할 일 중 손이 자유로워질 수 있도록 자동화·단순화할 부분 찾기',
  '막힌 문제 앞에서 정면 돌파 대신 우회할 수 있는 선택지 두 개 적어 보기',
] as const;

const QUESTIONS = [
  '내가 지금 과도하게 힘을 주고 있어 오히려 균형을 잃고 있는 일은 무엇인가요?',
  '조금 더 높은 시선으로 바라본다면 수초를 피해 돌아갈 어떤 물길이 보일까요?',
  '몸에 익은 루틴으로 넘겨 두고 마음을 비울 수 있는 일은 무엇인가요?',
  '오늘 내 배가 흔들리지 않도록 단단히 딛고 서야 할 한 점은 어디인가요?',
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

export function calculateShanInleRowing(input: ShanInleRowingInput): ShanInleRowingResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-SHAN-INLE-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    lakePosture: POSTURES[seed % POSTURES.length],
    oarBalance: BALANCES[(seed >>> 3) % BALANCES.length],
    reflectionFocus: '인레 호수에서 한 발로 노를 저으며 넓은 시야와 두 손의 자유를 지키는 샨 족 어부처럼 중심 잡기와 효율의 조화를 살피는 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatShanInlePrompt(res: ShanInleRowingResult): string {
  return [
    `[샨·인레 호수 외발 노 젓기 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `호수 자세: ${res.lakePosture}`,
    `균형: ${res.oarBalance}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
