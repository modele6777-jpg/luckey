import type { UserProfile } from '../sharedState';

export interface BuryatBaikalResult {
  engineVersion: string;
  calculatedAtKst: string;
  baikalSpirit: string;
  tengriInsight: string;
  olkhonTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SPIRITS = [
  { spirit: '코헤 뭉케 텐그리(Köke Möngke Tengri · 끝없이 푸른 하늘의 시선)', insight: '작은 감정의 먹구름이 지나가도 그 너머의 넓고 푸른 하늘은 변함없이 제자리에 있다는 신뢰', tone: '바이칼 호수 올혼섬 위로 끝없이 펼쳐진 맑은 청색 하늘' },
  { spirit: '에진(Ezen · 장소와 물의 주인을 향한 공경)', insight: '내가 머무는 자리와 만나는 사람들을 함부로 대하지 않고 조심스레 존중할 때 찾아오는 평화', tone: '바닥이 투명하게 비치는 바이칼 호수의 고요한 맑은 물결' },
  { spirit: '세르게(Serge · 길손의 말을 매어 두는 성스러운 기둥)', insight: '바쁜 일상 속에서도 마음을 매어 두고 잠시 숨을 돌릴 수 있는 나만의 든든한 기준점', tone: '언덕 위 바람에 오색 천 리본이 나부끼는 나무 세르게 기둥' },
  { spirit: '요호르(Yokhor · 손을 맞잡고 도는 공동체의 원)', insight: '혼자 버거워하던 일도 같은 뜻을 나눈 이들과 발을 맞추면 훨씬 가볍게 넘어갈 수 있음', tone: '초원 모닥불 주위에서 흥겹게 발을 구르며 도는 원무의 활기' },
  { spirit: '아르샨(Arshan · 땅속에서 솟아나는 치유의 샘물)', insight: '고갈된 에너지를 억지로 짜내기보다 조용히 나를 채워 주는 쉼과 회복의 샘을 먼저 찾는 지혜', tone: '이끼 낀 시베리아 침엽수림 사이로 솟아나는 차갑고 맑은 약수' },
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

export function calculateBuryatBaikalTengriHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BuryatBaikalResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SPIRITS.length;
  const picked = SPIRITS[idx];

  return {
    engineVersion: 'LUCKEY-BURYAT-BAIKAL-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    baikalSpirit: picked.spirit,
    tengriInsight: picked.insight,
    olkhonTone: picked.tone,
    reflectionFocus: `시베리아 부랴트 바이칼 전통의 '${picked.spirit}'처럼, 자연과 내 안의 리듬을 억지로 거스르지 말고 맑게 조율해 보세요.`,
    ritualAction: '오늘 창밖 하늘이나 물을 1분만 바라보며 내 마음이 가장 평온해지는 호흡 속도를 되찾아 보세요.',
    reflectiveQuestion: '지금 내 마음의 물결을 흐리게 만드는 조급함을 내려놓는다면, 그 아래에 비치는 맑은 본심은 무엇인가요?',
    interpretiveBoundary: '시베리아 부랴트(Buryat) 바이칼·텐그리 자연 조화 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBuryatBaikalPrompt(res: BuryatBaikalResult): string {
  return [
    `[부랴트 바이칼·텐그리 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 바이칼 상징: ${res.baikalSpirit} (${res.olkhonTone})`,
    `- 중심 통찰: ${res.tengriInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
