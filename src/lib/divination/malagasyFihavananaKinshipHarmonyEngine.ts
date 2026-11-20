import type { UserProfile } from '../sharedState';

export interface MalagasyFihavananaResult {
  engineVersion: string;
  calculatedAtKst: string;
  kinshipPrinciple: string;
  bondInsight: string;
  islandTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const BONDS = [
  { principle: '피하바나나(Fihavanana) 따뜻한 연대', insight: '서로 다른 점보다 우리가 한 배를 탄 이웃이라는 사실을 먼저 기억하는 마음', tone: '바오밥 나무 아래 저녁 노을' },
  { principle: '모라모라(Mora Mora) 천천히, 부드럽게', insight: '서두르느라 놓치던 관계의 결을 한 박자 늦춰 정성껏 살피는 리듬', tone: '인도양 산들바람의 여유' },
  { principle: '발리(Valy) 마음의 주고받음', insight: '대가의 계산보다 진심이 담긴 작은 호의가 돌고 돌아 나를 지켜 주는 신뢰', tone: '붉은 고원 마을의 따뜻한 등불' },
  { principle: '차라 마노노(Tsara Manono) 좋은 말 씨앗', insight: '가시 돋친 평가 대신 상대의 선의를 먼저 불러내 주는 부드러운 언어', tone: '맑은 아침 이슬의 숨결' },
  { principle: '토디(Tody) 행동의 메아리', insight: '내가 오늘 세상에 보낸 태도가 결국 내 마음의 풍경으로 돌아온다는 자각', tone: '잔잔한 석호의 투명한 물결' },
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

export function calculateMalagasyFihavananaKinship(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MalagasyFihavananaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % BONDS.length;
  const picked = BONDS[idx];

  return {
    engineVersion: 'LUCKEY-MALAGASY-FIHAVANANA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    kinshipPrinciple: picked.principle,
    bondInsight: picked.insight,
    islandTone: picked.tone,
    reflectionFocus: `'${picked.principle}'의 정신처럼, 맞고 틀림을 따지기 전에 마음을 한 번 더 데워 보세요.`,
    ritualAction: '오늘 대화할 때 상대의 말을 끊지 않고 끝까지 들은 뒤 부드러운 한마디로 답해 보세요.',
    reflectiveQuestion: '요즘 내 주변 관계에서 조금 서두르거나 날카롭게 대했던 순간은 언제였나요?',
    interpretiveBoundary: '마다가스카르 말라가시 피하바나나(Fihavanana) 공동체 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMalagasyFihavananaPrompt(res: MalagasyFihavananaResult): string {
  return [
    `[말라가시 피하바나나 연대 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 유대 원칙: ${res.kinshipPrinciple} (${res.islandTone})`,
    `- 중심 통찰: ${res.bondInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
