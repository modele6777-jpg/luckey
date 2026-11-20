import type { UserProfile } from '../sharedState';

export interface FrisianPolderResult {
  engineVersion: string;
  calculatedAtKst: string;
  polderPrinciple: string;
  frisianInsight: string;
  northSeaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  { principle: '폴데르 합의(Polder Model · 물이 넘치기 전에 모두가 모여 둑을 살핌)', insight: '누구 한 사람의 고집이 아니라 서로 다른 입장이 둑을 함께 지켜야 공동체가 안전함', tone: '북해의 바닷바람을 막아 내며 푸른 목초지를 지켜 내는 반듯한 제방과 풍차' },
  { principle: '바덴해의 간조(Wadden Sea · 물이 빠진 갯벌 위를 걸어 섬에 닿는 때)', insight: '물길이 거칠 때는 기다리고, 물이 빠져 길이 열릴 때 가볍게 건너가는 타이밍의 지혜', tone: '하늘과 바다가 맞닿은 프리슬란트 갯벌 위로 반짝이는 은빛 물웅덩이' },
  { principle: '테르프 언덕(Terp · 거친 밀물에도 잠기지 않게 미리 돋워 둔 터전)', insight: '위기가 닥친 뒤에 허둥지둥하기보다 평소 마음의 중심을 한 뼘 높여 두면 흔들리지 않음', tone: '넓은 평원 위로 완만하게 솟아 있는 오래된 마을 언덕과 붉은 지붕' },
  { principle: '배수 풍차(Poldermolen · 고인 물을 천천히 퍼내어 땅을 살림)', insight: '마음속에 답답함이 고였을 때는 한 번에 해결하려 하기보다 조금씩 비워 내는 편이 빠름', tone: '일정한 박자로 바람을 타고 돌며 운하로 물을 보내는 묵묵한 풍차 날개' },
  { principle: '운하의 수문(Sluis · 바깥의 압력과 안쪽의 수위를 부드럽게 맞춤)', insight: '외부의 요구와 내 마음의 속도를 무리하게 부딪치지 않고 수문처럼 천천히 조절함', tone: '잔잔한 운하 물결 위로 고요히 오르내리는 작은 목조 배' },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateFrisianPolderDikeBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): FrisianPolderResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];

  return {
    engineVersion: 'LUCKEY-FRISIAN-POLDER-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    polderPrinciple: picked.principle,
    frisianInsight: picked.insight,
    northSeaTone: picked.tone,
    reflectionFocus: `프리슬란트 폴데르 지혜의 '${picked.principle}'처럼, 넘치는 걱정과 외부 요구를 한 번에 막으려 하기보다 수문을 열듯 천천히 수위를 맞춰 보세요.`,
    ritualAction: '오늘 내 마음속에 고여 있던 답답함 한 가지를, 배수 풍차가 물을 퍼내듯 가벼운 산책이나 메모로 조금만 비워 내 보세요.',
    reflectiveQuestion: '지금 내가 거친 밀물 속에서 억지로 헤엄치려 하기보다, 물이 빠져 길이 열리길 잠시 기다려 주어야 할 일은 무엇인가요?',
    interpretiveBoundary: '북해 프리슬란트의 폴데르(Polder) 수문 조절·테르프 언덕·공동체 합의 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatFrisianPolderPrompt(res: FrisianPolderResult): string {
  return [
    `[프리슬란트 폴데르·방파제 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 북해 원리: ${res.polderPrinciple} (${res.northSeaTone})`,
    `- 중심 통찰: ${res.frisianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
