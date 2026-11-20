import type { UserProfile } from '../sharedState';

export interface BalkanOhridResult {
  engineVersion: string;
  calculatedAtKst: string;
  ohridSymbol: string;
  balkanInsight: string;
  lakeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  { symbol: '오흐리드의 맑은 심연(Lake Ohrid · 오래 고여 있으면서도 스스로 맑아지는 호수)', insight: '오래 머문 자리라고 다 썩는 것이 아니라, 깊은 바닥의 샘물이 돌면 고요 속에서도 늘 새로워짐', tone: '산으로 둘러싸인 발칸 고원 오흐리드 호수 수면 위로 투명하게 비치는 새벽 하늘' },
  { symbol: '오흐리드 진주(Ohrid Pearl · 시간의 겹을 조용히 입혀 빚는 단단함)', insight: '겉으로 번쩍이는 한 방보다 매일 얇은 진주층을 한 겹씩 입히는 성실함이 결국 빛이 남', tone: '잔잔한 호숫가 햇살 아래 은은한 백색 광택을 띠는 작은 진주알' },
  { symbol: '카네오 언덕의 돌길(Kaneo · 급하지 않게 굽이쳐 오르는 쉼의 곡선)', insight: '목적지까지 직선으로만 오르려 하면 숨이 차지만, 굽이를 따라 걸으면 풍경도 함께 남음', tone: '절벽 끝 작은 붉은 벽돌 성당으로 이어지는 햇살 따뜻한 돌계단' },
  { symbol: '발칸의 모자이크(Mosaic · 서로 다른 조각이 어우러져 이루는 균형)', insight: '내 안의 상반된 감정이나 낯선 선택지도 억지로 지우지 않고 한 화면에 나란히 둘 수 있음', tone: '오래된 비잔틴 회랑 바닥에 정교하게 맞춰진 다채로운 돌 조각들' },
  { symbol: '카야크의 노(Oar · 물결을 거스르지 않고 리듬을 타는 손목)', insight: '물살이 셀 때는 힘을 빼고 노의 각도만 가볍게 조절해도 배는 원하는 방향으로 나아감', tone: '저녁 무렵 붉은 노을이 물든 호수 위를 잔물결만 남기며 미끄러지는 작은 나룻배' },
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

export function calculateBalkanOhridLakeReflection(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BalkanOhridResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const picked = SYMBOLS[idx];

  return {
    engineVersion: 'LUCKEY-BALKAN-OHRID-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    ohridSymbol: picked.symbol,
    balkanInsight: picked.insight,
    lakeTone: picked.tone,
    reflectionFocus: `발칸 오흐리드 지혜의 '${picked.symbol}'처럼, 서두르는 직선 대신 깊은 바닥에서부터 스스로를 맑게 돌보는 호흡을 지켜 보세요.`,
    ritualAction: '오늘 내가 급하게 해치우려던 일 하나를 골라, 카네오 언덕의 굽이길처럼 숨을 고르며 한 겹씩 정성껏 마무리해 보세요.',
    reflectiveQuestion: '지금 내 마음속에서 억지로 지우려 애쓰기보다, 발칸의 모자이크처럼 있는 그대로 나란히 놓아두면 편안해질 감정은 무엇인가요?',
    interpretiveBoundary: '발칸·오흐리드 호수의 깊은 물길과 진주 겹의 시간 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBalkanOhridPrompt(res: BalkanOhridResult): string {
  return [
    `[발칸 오흐리드·호수 심연 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 호수 상징: ${res.ohridSymbol} (${res.lakeTone})`,
    `- 중심 통찰: ${res.balkanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
