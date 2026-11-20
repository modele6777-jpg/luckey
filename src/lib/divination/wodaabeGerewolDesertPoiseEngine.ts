import type { UserProfile } from '../sharedState';

export interface WodaabeGerewolInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface WodaabeGerewolResult {
  engineVersion: string;
  calculatedAtKst: string;
  desertGathering: string;
  innerPoise: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const GATHERINGS = [
  '사헬 초원의 빗물 뒤에야 비로소 흩어진 이들이 모이는 만남',
  '긴 건기를 견딘 뒤 서로의 눈빛과 자세를 비추어 보는 춤의 줄',
  '거친 모래바람 속에서도 흩트리지 않는 단정한 몸가짐',
  '서로의 인내와 품위를 겨루며 함께 노래하는 밤의 원',
] as const;

const POISES = [
  '진정한 매력과 설득력은 요란한 과시가 아니라 힘든 상황에서도 표정과 태도를 잃지 않는 인내(무냐)에서 나옵니다.',
  '모두가 각자의 길을 걷다가도 약속된 계절이 오면 다시 만나는 리듬이 외로움을 견디게 합니다.',
  '남의 시선을 의식해 조급해지기보다 나 자신의 중심과 눈빛을 고요히 지킬 때 존재감이 자연스레 드러납니다.',
  '긴 이동 끝의 작은 축제가 다음 긴 여정을 건너갈 힘을 채워 줍니다.',
] as const;

const ACTIONS = [
  '오늘 감정이 흔들리는 순간에도 말투와 표정을 한 박자 고요하게 유지해 보기',
  '수고한 나 자신을 위해 소박하지만 기분 좋은 작은 의식(차 한 잔·산책) 열기',
  '최근 소식이 뜸했던 반가운 사람에게 계절 안부 한 통 가볍게 건네기',
  '결과를 서두르기보다 지금 내가 버텨 내고 있는 과정의 품위를 스스로 인정해 주기',
] as const;

const QUESTIONS = [
  '바쁘고 거친 일상 속에서도 내가 꼭 지켜 내고 싶은 태도와 품위는 무엇인가요?',
  '요즘 나를 조급하게 만드는 시선 앞에서 잠깐 멈춰 고요히 지킬 중심은 어디인가요?',
  '긴 노력의 시간 뒤에 나에게 허락해 주고 싶은 작은 축하의 순간은 무엇인가요?',
  '멀리 떨어져 있어도 계절이 돌면 다시 이어질 소중한 인연은 누구인가요?',
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

export function calculateWodaabeGerewol(input: WodaabeGerewolInput): WodaabeGerewolResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-WODAABE-GEREWOL-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    desertGathering: GATHERINGS[seed % GATHERINGS.length],
    innerPoise: POISES[(seed >>> 3) % POISES.length],
    reflectionFocus: '사헬 유목민 우다베 족이 긴 건기를 지나 우기에 모여 인내와 품위(무냐)를 나누는 게레월 축제에서 길어 올린 태도와 회복의 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatWodaabeGerewolPrompt(res: WodaabeGerewolResult): string {
  return [
    `[우다베·게레월 사헬 품위 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `만남의 장: ${res.desertGathering}`,
    `내면 품위: ${res.innerPoise}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
