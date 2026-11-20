import type { UserProfile } from '../sharedState';

export interface CherokeeGadugiResult {
  engineVersion: string;
  calculatedAtKst: string;
  gadugiPrinciple: string;
  duyuktvInsight: string;
  smokyMountainsTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  { principle: '가두기(Gadugi · 함께 모여 서로의 짐을 덜어주는 마음)', insight: '혼자 버거울 때 공동체의 손을 잡고, 여유가 있을 때 기꺼이 내 손을 내미는 선순환', tone: '안개 낀 스모키 산맥 골짜기를 함께 감싸 흐르는 맑은 계곡물' },
  { principle: '두육트브(Duyuktv · 바르고 조화로운 길)', insight: '이기고 지는 다툼보다 관계와 자연 전체가 편안하게 숨 쉴 수 있는 균형점을 찾음', tone: '새벽 이슬이 맺힌 옥수수와 호박, 콩 세 자매 밭의 고요한 조화' },
  { principle: '토히(Tohi · 물처럼 흐르는 평화와 건강)', insight: '고집스럽게 막아선 감정을 흘려보낼 때 마음과 몸의 순환이 다시 자연스럽게 이어짐', tone: '돌을 부딪치지 않고 부드럽게 돌아 흐르는 산골짜기 시냇물' },
  { principle: '하얀 늑대와 검은 늑대의 우화(내면의 먹이 주기)', insight: '내 안에서 자라는 두려움과 신뢰 중 내가 오늘 어떤 생각에 마음을 보태는지가 하루를 결정함', tone: '밤나무 숲 사이로 스며드는 따뜻하고 명료한 오후의 햇빛' },
  { principle: '일곱 세대의 시선(다음 세대까지 내다보는 신중함)', insight: '당장의 눈앞 이익보다 오래도록 부끄럽지 않을 선택을 고를 때 마음이 가장 가벼워짐', tone: '일곱 갈래 성스러운 불꽃이 둥글게 타오르는 원형 회의장' },
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

export function calculateCherokeeGadugiHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CherokeeGadugiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];

  return {
    engineVersion: 'LUCKEY-CHEROKEE-GADUGI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    gadugiPrinciple: picked.principle,
    duyuktvInsight: picked.insight,
    smokyMountainsTone: picked.tone,
    reflectionFocus: `체로키 지혜의 '${picked.principle}'처럼, 내 안의 두려움 대신 신뢰와 조화(Duyuktv)의 마음에 오늘의 힘을 보태 보세요.`,
    ritualAction: '오늘 혼자 끙끙 앓던 일 중 하나를 믿을 만한 사람과 가볍게 나누어 보거나, 누군가의 작은 수고에 진심으로 고마움을 전해 보세요.',
    reflectiveQuestion: '지금 내 마음속에서 두려움과 신뢰 가운데 내가 더 자주 먹이를 주고 있는 쪽은 어느 쪽인가요?',
    interpretiveBoundary: '북미 체로키(Cherokee)의 가두기(Gadugi) 상호부조·두육트브(Duyuktv) 조화 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCherokeeGadugiPrompt(res: CherokeeGadugiResult): string {
  return [
    `[체로키 가두기·두육트브 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 조화 원칙: ${res.gadugiPrinciple} (${res.smokyMountainsTone})`,
    `- 중심 통찰: ${res.duyuktvInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
