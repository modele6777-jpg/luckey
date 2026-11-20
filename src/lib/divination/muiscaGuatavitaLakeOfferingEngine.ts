import type { UserProfile } from '../sharedState';

export interface MuiscaGuatavitaInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface MuiscaGuatavitaResult {
  engineVersion: string;
  calculatedAtKst: string;
  offeringPhase: string;
  lakeReflection: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PHASES = [
  '고원 호수의 새벽 물안개',
  '황금 뗏목의 고요한 출발',
  '산 능선이 비치는 잔잔한 수면',
  '약속을 건네는 맑은 물결',
] as const;

const REFLECTIONS = [
  '가진 것을 움켜쥐기보다 감사로 흘려보낼 때 마음의 수면이 넓어집니다.',
  '안개 속에서 서두르지 않고 호수 가장자리부터 살피면 길이 선명해집니다.',
  '겉의 반짝임보다 그 안에 담긴 정성이 오늘의 균형을 세워 줍니다.',
  '비워 낸 자리마다 산 바람과 맑은 빛이 자연스럽게 스며듭니다.',
] as const;

const ACTIONS = [
  '지금 붙잡고 있는 걱정 하나를 종이에 적어 내려놓고 숨을 고르기',
  '가까운 사람에게 고마웠던 일 한 가지를 짧게 전하기',
  '책상 위 불필요한 물건 하나를 치우고 여백을 만들기',
  '오늘 가장 소중한 일 하나에만 온전히 시간 배정하기',
] as const;

const QUESTIONS = [
  '내가 지금 지키려 애쓰는 것 가운데 기꺼이 흘려보낼 수 있는 것은 무엇인가요?',
  '반짝이는 결과보다 그 과정에서 어떤 정성을 남기고 싶은가요?',
  '오늘 내 마음의 호수를 가장 잔잔하게 만드는 선택은 무엇일까요?',
  '감사의 마음으로 먼저 건네고 싶은 말이나 행동이 있나요?',
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

export function calculateMuiscaGuatavitaLake(input: MuiscaGuatavitaInput): MuiscaGuatavitaResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-MUISCA-GUATAVITA-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    offeringPhase: PHASES[seed % PHASES.length],
    lakeReflection: REFLECTIONS[(seed >>> 3) % REFLECTIONS.length],
    reflectionFocus: '안데스 고원 무이스카 족이 과타비타 호수에 감사와 화해의 뜻으로 금을 바치던 의식처럼, 소유보다 순환과 정성의 균형을 돌아보는 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatMuiscaGuatavitaPrompt(res: MuiscaGuatavitaResult): string {
  return [
    `[무이스카·과타비타 황금 호수 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `호수 국면: ${res.offeringPhase}`,
    `비춤: ${res.lakeReflection}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
