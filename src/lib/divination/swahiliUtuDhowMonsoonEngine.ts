import type { UserProfile } from '../sharedState';

export type SwahiliQuestionTopic = 'relation' | 'work' | 'emotion' | 'decision' | 'general';

export interface SwahiliUtuDhowResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: SwahiliQuestionTopic;
  monsoonWind: string;
  companionWind: string;
  utuGuidance: string;
  voyageTone: string;
  monsoonVoyageAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function classifySwahiliTopic(q: string): SwahiliQuestionTopic {
  if (/관계|사람|친절|존중|동료/.test(q)) return 'relation';
  if (/일|직장|진로|일정|항해/.test(q)) return 'work';
  if (/마음|감정|불안|지침|휴식/.test(q)) return 'emotion';
  if (/선택|결정|멈추|나아갈|물때/.test(q)) return 'decision';
  return 'general';
}

const SWAHILI_SHADOW_WARNINGS: Record<SwahiliQuestionTopic, string> = {
  relation: '우투(Utu)의 배려가 자기희생으로 기울어 정작 내 선체의 균열을 돌보지 못하는 일이 없도록 하세요.',
  work: '순풍을 타고 속도를 내는 날일수록 얕은 암초와 물때 확인을 건너뛰기 쉬우니 기본 점검을 남기세요.',
  emotion: '항구에서 닻을 내리고 쉬는 동안에도 다음 출항 걱정으로 마음을 볶으면 라하(Raha)의 쉼이 되지 않습니다.',
  decision: '바람과 별자리를 읽는 신중함이 영원한 정박으로 굳지 않도록, 닻을 올릴 최소 기준 하나를 정해 두세요.',
  general: '흐름에 맞추는 유연함이 방향 상실로 이어지지 않도록 목적지 항구 이름만은 또렷이 기억하세요.',
};

const WINDS = [
  {
    wind: '카스카지(Kaskazi) 북동풍 순항',
    guidance: '바람이 부는 방향을 거스르지 않고 돛 각도를 살짝 틀어 흐름을 타는 지혜',
    tone: '잔지바르 해안의 따뜻한 햇살',
    action: '오늘 순조롭게 흐르는 일 하나에 힘을 보태어 자연스러운 속도로 앞으로 나아가 보세요.',
    question: '지금 내 삶의 바람이 부드럽게 등을 밀어 주고 있다면, 돛을 살짝 틀어 더 수월하게 탈 수 있는 흐름은 무엇인가요?',
  },
  {
    wind: '쿠시(Kusi) 남서풍 정박과 정비',
    guidance: '거센 바람이 올 때는 무리해 출항하지 않고 선체와 마음을 단단히 손보는 시간',
    tone: '라무 항구의 고요한 만',
    action: '무리하게 밀어붙이던 일정 하나를 잠시 멈추고, 낡거나 헐거워진 기본기부터 정돈해 보세요.',
    question: '지금 내 삶의 바람은 빠르게 돛을 올릴 때인가요, 아니면 항구에서 닻을 내리고 선체를 손볼 때인가요?',
  },
  {
    wind: '우투(Utu) 사람다움의 연대',
    guidance: '내가 먼저 건넨 작은 친절과 존중이 결국 내 항해의 가장 든든한 등대가 되는 이치',
    tone: '함께 노를 젓는 동료의 온기',
    action: '가까운 사람 한 명에게 고마웠던 일이나 안부를 가볍게 한 줄 건네 보세요.',
    question: '내 항해가 외롭거나 거칠게 느껴질 때, 내가 먼저 건넬 수 있는 작은 친절과 존중의 인사는 무엇인가요?',
  },
  {
    wind: '마탕가(Matanga) 항해 전 별 읽기',
    guidance: '출발 전 항로의 얕은 암초와 물때를 차분히 살피는 신중함',
    tone: '은하수 아래 검은 바다',
    action: '중요한 결정을 내리기 전, 놓치기 쉬운 전제 조건과 물때 한 가지만 차분히 다시 확인해 보세요.',
    question: '급히 출항하기 전에 별빛 아래서 미리 살펴 두어야 할 얕은 암초나 변수 하나는 무엇인가요?',
  },
  {
    wind: '라하(Raha) 항해 끝의 휴식',
    guidance: '목적지에 닿기 전이라도 잠시 닻을 내리고 숨을 고를 줄 아는 여유',
    tone: '야자수 그늘의 선선한 바람',
    action: '오늘 하루 중간에 10분만 모든 알림을 끄고 야자수 그늘에 들른 듯 깊게 숨을 돌려 보세요.',
    question: '목적지에 완전히 닿기 전이라도 지금 잠시 닻을 내리고 숨을 고르면 무엇이 다시 선명해질까요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateSwahiliUtuDhowMonsoon(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SwahiliUtuDhowResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifySwahiliTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % WINDS.length;
  const picked = WINDS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (WINDS.length - 1));
  const companion = WINDS[(idx + companionOffset) % WINDS.length];
  const monsoonVoyageAxis = `${picked.wind} ↔ ${companion.wind}`;

  return {
    engineVersion: 'LUCKEY-SWAHILI-UTU-DHOW-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    monsoonWind: picked.wind,
    companionWind: companion.wind,
    utuGuidance: picked.guidance,
    voyageTone: picked.tone,
    monsoonVoyageAxis,
    shadowWarning: SWAHILI_SHADOW_WARNINGS[questionTopic],
    reflectionFocus: `계절풍을 기다리는 다우 범선(${questionTopic})처럼 '${picked.wind}'을 중심에 두고 '${companion.wind}'의 결을 곁들여 힘주기와 멈추기를 조절해 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '동아프리카 스와힐리 우투(Utu) 정신과 다우 범선 계절풍 항해 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSwahiliUtuDhowPrompt(res: SwahiliUtuDhowResult): string {
  return [
    `[스와힐리 우투·다우 계절풍 항해 성찰 · ${res.engineVersion} | 질문 맥락: ${res.questionTopic}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 항해 바람: ${res.monsoonWind} (${res.voyageTone})`,
    `- 동반 바람: ${res.companionWind}`,
    `- 계절풍 항해 균형 축: ${res.monsoonVoyageAxis}`,
    `- 중심 통찰: ${res.utuGuidance}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
