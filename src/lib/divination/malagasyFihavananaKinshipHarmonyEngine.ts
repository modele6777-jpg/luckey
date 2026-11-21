import type { UserProfile } from '../sharedState';

export interface MalagasyFihavananaResult {
  engineVersion: string;
  calculatedAtKst: string;
  kinshipPrinciple: string;
  companionPrinciple: string;
  bondInsight: string;
  islandTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const BONDS = [
  {
    principle: '피하바나나(Fihavanana) 따뜻한 연대',
    insight: '서로 다른 점보다 우리가 한 배를 탄 이웃이라는 사실을 먼저 기억하는 마음',
    tone: '바오밥 나무 아래 저녁 노을',
    ritual: '오늘 대화할 때 상대의 말을 끊지 않고 끝까지 들은 뒤 부드러운 한마디로 답해 보세요.',
    question: '요즘 내 주변 관계에서 조금 서두르거나 날카롭게 대했던 순간은 언제였나요?',
  },
  {
    principle: '모라모라(Mora Mora) 천천히, 부드럽게',
    insight: '서두르느라 놓치던 관계의 결을 한 박자 늦춰 정성껏 살피는 리듬',
    tone: '인도양 산들바람의 여유',
    ritual: '답장이나 결정을 내리기 전에 숨을 세 번 고르며 상대와 내 마음을 한 박자 늦춰 살펴보세요.',
    question: '속도를 한 박자만 늦춰도 훨씬 부드럽게 풀릴 수 있는 오늘의 대화는 무엇인가요?',
  },
  {
    principle: '발리(Valy) 마음의 주고받음',
    insight: '대가의 계산보다 진심이 담긴 작은 호의가 돌고 돌아 나를 지켜 주는 신뢰',
    tone: '붉은 고원 마을의 따뜻한 등불',
    ritual: '오늘 계산 없이 먼저 건넬 수 있는 작은 안부나 고마움의 말 한마디를 보내 보세요.',
    question: '대가나 셈을 내려놓고 진심으로 건넸을 때 가장 따뜻하게 돌아올 호의는 무엇인가요?',
  },
  {
    principle: '차라 마노노(Tsara Manono) 좋은 말 씨앗',
    insight: '가시 돋친 평가 대신 상대의 선의를 먼저 불러내 주는 부드러운 언어',
    tone: '맑은 아침 이슬의 숨결',
    ritual: '오늘 누군가의 부족한 점 대신 잘해 낸 점 하나를 먼저 짚어 따뜻한 말로 전해 보세요.',
    question: '판단이나 평가의 말을 잠시 접고 상대의 선의를 먼저 불러내 준다면 어떤 문장이 될까요?',
  },
  {
    principle: '토디(Tody) 행동의 메아리',
    insight: '내가 오늘 세상에 보낸 태도가 결국 내 마음의 풍경으로 돌아온다는 자각',
    tone: '잔잔한 석호의 투명한 물결',
    ritual: '오늘 내가 건네는 말투와 표정이 저녁에 내 마음으로 돌아올 메아리라 생각하며 다듬어 보세요.',
    question: '오늘 내가 세상에 보낸 태도 중 저녁 무렵 가장 기분 좋게 돌아오길 바라는 메아리는 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
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
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (BONDS.length - 1));
  const picked = BONDS[idx];
  const companion = BONDS[(idx + companionOffset) % BONDS.length];

  return {
    engineVersion: 'LUCKEY-MALAGASY-FIHAVANANA-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    kinshipPrinciple: picked.principle,
    companionPrinciple: companion.principle,
    bondInsight: picked.insight,
    islandTone: picked.tone,
    reflectionFocus: `'${picked.principle}'의 정신과 동반 원칙 '${companion.principle}'을 함께 새기며, 맞고 틀림을 따지기 전에 마음을 한 번 더 데워 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '마다가스카르 말라가시 피하바나나(Fihavanana) 공동체 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMalagasyFihavananaPrompt(res: MalagasyFihavananaResult): string {
  return [
    `[말라가시 피하바나나 연대 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 유대 원칙: ${res.kinshipPrinciple} (${res.islandTone})`,
    `- 동반 원칙: ${res.companionPrinciple}`,
    `- 중심 통찰: ${res.bondInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
