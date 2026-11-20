import type { UserProfile } from '../sharedState';

export interface HmongStoryClothInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface HmongStoryClothResult {
  engineVersion: string;
  calculatedAtKst: string;
  stitchPattern: string;
  clothNarrative: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PATTERNS = [
  '산과 강을 건너는 나선형 실선',
  '작은 한 땀이 모여 숲을 이루는 기하학 테두리',
  '어제와 오늘을 나란히 잇는 파즈 너우 자수 천',
  '거친 비탈을 견딘 씨앗이 핀 꽃 무늬',
] as const;

const NARRATIVES = [
  '큰 그림을 한 번에 그리려 애쓰기보다 오늘의 한 땀을 정성껏 놓는 일이 이야기를 완성합니다.',
  '지나온 굽이마다 다른 색실이 필요했듯, 지금의 낯선 구간도 전체 무늬의 일부가 됩니다.',
  '테두리의 규칙이 단단할수록 안쪽의 자유로운 장면이 흐트러지지 않습니다.',
  '혼자 감당하던 기억을 한 장면씩 수놓아 꺼내 두면 마음이 한결 가벼워집니다.',
] as const;

const ACTIONS = [
  '오늘 겪은 일 중 기억에 남는 장면 한 가지를 짧은 문장으로 기록하기',
  '큰 목표를 오늘 당장 할 수 있는 15분짜리 한 땀으로 쪼개기',
  '하루의 시작과 끝을 지키는 작은 루틴 한 가지를 정해 실행하기',
  '지나온 일에서 내가 잘 버텨 낸 순간 하나를 스스로 인정해 주기',
] as const;

const QUESTIONS = [
  '내 삶의 이야기 천에서 지금 막 수놓고 있는 장면은 어떤 색인가요?',
  '성급하게 건너뛰려던 과정 중 천천히 한 땀씩 채워야 할 부분은 무엇인가요?',
  '내 일상을 흐트러지지 않게 잡아 주는 바깥 테두리 습관은 무엇인가요?',
  '지난 시간의 어려움 가운데 지금 나를 지탱하는 무늬가 된 경험은 무엇인가요?',
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

export function calculateHmongStoryCloth(input: HmongStoryClothInput): HmongStoryClothResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-HMONG-CLOTH-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    stitchPattern: PATTERNS[seed % PATTERNS.length],
    clothNarrative: NARRATIVES[(seed >>> 3) % NARRATIVES.length],
    reflectionFocus: '몽족의 파즈 너우(Paj Ntaub) 자수 이야기 천처럼 지나온 이동과 일상의 기억을 한 땀씩 엮어 전체 서사를 바라보는 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatHmongStoryClothPrompt(res: HmongStoryClothResult): string {
  return [
    `[몽족·자수 이야기 천 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `자수 무늬: ${res.stitchPattern}`,
    `서사: ${res.clothNarrative}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
