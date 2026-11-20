import type { UserProfile } from '../sharedState';

export interface SwahiliUtuDhowResult {
  engineVersion: string;
  calculatedAtKst: string;
  monsoonWind: string;
  utuGuidance: string;
  voyageTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const WINDS = [
  { wind: '카스카지(Kaskazi) 북동풍 순항', guidance: '바람이 부는 방향을 거스르지 않고 돛 각도를 살짝 틀어 흐름을 타는 지혜', tone: '잔지바르 해안의 따뜻한 햇살' },
  { wind: '쿠시(Kusi) 남서풍 정박과 정비', guidance: '거센 바람이 올 때는 무리해 출항하지 않고 선체와 마음을 단단히 손보는 시간', tone: '라무 항구의 고요한 만' },
  { wind: '우투(Utu) 사람다움의 연대', guidance: '내가 먼저 건넨 작은 친절과 존중이 결국 내 항해의 가장 든든한 등대가 되는 이치', tone: '함께 노를 젓는 동료의 온기' },
  { wind: '마탕가(Matanga) 항해 전 별 읽기', guidance: '출발 전 항로의 얕은 암초와 물때를 차분히 살피는 신중함', tone: '은하수 아래 검은 바다' },
  { wind: '라하(Raha) 항해 끝의 휴식', guidance: '목적지에 닿기 전이라도 잠시 닻을 내리고 숨을 고를 줄 아는 여유', tone: '야자수 그늘의 선선한 바람' },
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

export function calculateSwahiliUtuDhowMonsoon(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SwahiliUtuDhowResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % WINDS.length;
  const picked = WINDS[idx];

  return {
    engineVersion: 'LUCKEY-SWAHILI-UTU-DHOW-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    monsoonWind: picked.wind,
    utuGuidance: picked.guidance,
    voyageTone: picked.tone,
    reflectionFocus: `계절풍을 기다리는 다우 범선처럼 '${picked.wind}'의 때에 맞춰 힘주기와 멈추기를 조절해 보세요.`,
    ritualAction: '가까운 사람 한 명에게 고마웠던 일이나 안부를 가볍게 한 줄 건네 보세요.',
    reflectiveQuestion: '지금 내 삶의 바람은 빠르게 돛을 올릴 때인가요, 아니면 항구에서 닻을 내리고 쉬어 갈 때인가요?',
    interpretiveBoundary: '동아프리카 스와힐리 우투(Utu) 정신과 다우 범선 계절풍 항해 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSwahiliUtuDhowPrompt(res: SwahiliUtuDhowResult): string {
  return [
    `[스와힐리 우투·다우 계절풍 항해 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 항해 바람: ${res.monsoonWind} (${res.voyageTone})`,
    `- 중심 통찰: ${res.utuGuidance}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
