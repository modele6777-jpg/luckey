import type { UserProfile } from '../sharedState';

export interface ShanInleRowingInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface ShanInleRowingResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '시야·확장' | '중심·집중' | '물길·우회' | '섬세·균형' | '루틴·자유' | '인레 전반';
  lakePosture: string;
  companionPosture: string;
  inleOarAxis: string;
  oarBalance: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
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

const SHAN_SHADOWS = [
  '서서 넓은 시야를 확보하는 태도가 정작 발밑의 작은 걸림돌이나 지금 손대야 할 세세한 마감을 놓치는 부주의로 이어지지 않게 하세요.',
  '한 발로 노를 감싸 쥐는 고요한 집중이 외부에서 들어오는 새로운 협력 신호나 변화의 물결까지 차단하는 경직이 되어서는 안 됩니다.',
  '수초를 피해 우회로를 찾는 유연함이 꼭 정면으로 마주하고 정리해야 할 과제 앞에서도 계속 돌아가기만 하는 회피가 되지 않게 살피세요.',
  '뜬 밭을 살피듯 섬세하게 균형을 맞추는 태도가 과도한 미세 조정으로 오히려 배의 추진력을 떨어뜨리는 망설임이 되지 않게 주의하세요.',
] as const;

function classifyShanTopic(q: string): ShanInleRowingResult['questionTopic'] {
  if (/시야|넓|수초|멀리/.test(q)) return '시야·확장';
  if (/중심|노|자세|한 발/.test(q)) return '중심·집중';
  if (/물길|우회|갈대|돌아/.test(q)) return '물길·우회';
  if (/균형|뜬 밭|섬세/.test(q)) return '섬세·균형';
  if (/루틴|손|자유|단순/.test(q)) return '루틴·자유';
  return '인레 전반';
}

export function calculateShanInleRowing(input: ShanInleRowingInput): ShanInleRowingResult {
  const fate = input.profile.fate ?? {};
  const q = (input.question ?? '').trim();
  const questionTopic = classifyShanTopic(q);
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${q}`;
  const seed = hashSeed(seedText);
  const postureIdx = seed % POSTURES.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (POSTURES.length - 1));
  const lakePosture = POSTURES[postureIdx];
  const companionPosture = POSTURES[(postureIdx + companionOffset) % POSTURES.length];
  const inleOarAxis = `${lakePosture.split(' ')[0]} ↔ ${companionPosture.split(' ')[0]} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-SHAN-INLE-v2.3.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    lakePosture,
    companionPosture,
    inleOarAxis,
    oarBalance: BALANCES[(seed >>> 3) % BALANCES.length],
    reflectionFocus: `인레 호수에서 한 발로 노를 저으며 넓은 시야와 두 손의 자유를 지키는 샨 족 어부처럼 주 자세('${lakePosture}')와 동반 자세('${companionPosture}')를 겹쳐 중심 잡기와 효율의 조화를 살피는 상징적 관점입니다.`,
    ritualAction: ACTIONS[postureIdx],
    shadowWarning: SHAN_SHADOWS[postureIdx],
    reflectiveQuestion: QUESTIONS[postureIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatShanInlePrompt(res: ShanInleRowingResult): string {
  return [
    `[샨·인레 호수 외발 노 젓기 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `질문 맥락: ${res.questionTopic} | 외발 균형 축: ${res.inleOarAxis}`,
    `호수 자세: ${res.lakePosture}`,
    `동반 자세: ${res.companionPosture}`,
    `균형: ${res.oarBalance}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `과잉 경계: ${res.shadowWarning}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
