import type { UserProfile } from '../sharedState';

export interface BamilekeBeadedInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface BamilekeBeadedResult {
  engineVersion: string;
  calculatedAtKst: string;
  beadPattern: string;
  craftDignity: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PATTERNS = [
  '작은 유리 구슬 수만 알이 모여 단단한 기하학 문양을 이루는 자리',
  '검정과 흰색, 붉은색 구슬이 엇갈리며 균형을 잡는 리듬',
  '단단한 나무 틀 위를 빈틈없이 감싸는 인내의 꿰기',
  '멀리서 보면 웅장하고 가까이 보면 세밀한 손끝의 정성',
] as const;

const DIGNITIES = [
  '큰 위엄이나 성취도 결국 오늘 내가 정성껏 꿰는 작은 구슬 한 알에서 시작됩니다.',
  '하나의 색만으로는 무늬가 서지 않듯, 서로 다른 기분과 역할이 나란히 놓일 때 단단한 모양이 잡힙니다.',
  '틀이 단단히 잡혀 있으면 수많은 작은 일들이 흩어지지 않고 하나의 질서 안으로 모입니다.',
  '속도를 높이다 실이 끊어지기보다 일정한 장력으로 꾸준히 꿰어 나가는 힘이 오래갑니다.',
] as const;

const ACTIONS = [
  '오늘 내가 해낸 아주 작은 성취(구슬 한 알) 세 가지를 속으로 혹은 노트에 꿰어 보기',
  '산만하게 흩어진 할 일들을 묶어 줄 단단한 나무 틀(핵심 시간대) 하나 정하기',
  '서로 다른 색깔의 일정(일·휴식·관계)이 치우치지 않게 배치 균형 점검하기',
  '서두르다가 실의 장력이 느슨해지지 않도록 딱 한 가지 일에만 온전히 손끝 모으기',
] as const;

const QUESTIONS = [
  '지금 내 하루에서 작지만 꼭 꿰어 두어야 할 소중한 구슬 한 알은 무엇인가요?',
  '수많은 자잘한 일들을 흔들리지 않게 받쳐 줄 내면의 나무 틀(원칙)은 무엇인가요?',
  '요즘 내 마음의 문양에서 한쪽으로 지나치게 몰려 있는 색깔은 어느 쪽인가요?',
  '서두르지 않고 일정한 힘으로 이어 가고 싶은 나만의 공예 같은 일은 무엇일까요?',
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

export function calculateBamilekeBeadedThrone(input: BamilekeBeadedInput): BamilekeBeadedResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-BAMILEKE-BEADS-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    beadPattern: PATTERNS[seed % PATTERNS.length],
    craftDignity: DIGNITIES[(seed >>> 3) % DIGNITIES.length],
    reflectionFocus: '카메룬 서부 초원의 바밀레케 왕국이 수만 알의 작은 구슬을 엮어 왕좌와 의례 조각을 완성하듯, 작은 일상의 축적과 질서를 살피는 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatBamilekeBeadedPrompt(res: BamilekeBeadedResult): string {
  return [
    `[바밀레케·구슬 왕좌 결속 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `구슬 문양: ${res.beadPattern}`,
    `공예 품격: ${res.craftDignity}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
