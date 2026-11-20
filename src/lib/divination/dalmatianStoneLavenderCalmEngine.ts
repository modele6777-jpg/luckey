import type { UserProfile } from '../sharedState';

export interface DalmatianStoneResult {
  engineVersion: string;
  calculatedAtKst: string;
  dalmatianMotif: string;
  dalmatianInsight: string;
  adriaticTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '스타리 그라드의 석회암 경계(Limestone Terraces · 돌을 골라내어 밭을 만들고 그 돌로 담을 쌓음)', insight: '방해물로 보이던 거친 돌멩이들을 버리지 않고 질서 있게 쌓으면 오히려 밭을 지키는 울타리가 됨', tone: '크로아티아 흐바르 섬의 따스한 아침 햇살 아래 하얀 석회암 계단 밭이 길게 이어진 풍경' },
  { motif: '아드리아의 라벤더 바람(Lavender Breeze · 메마른 돌 틈에서도 보라색 꽃이 깊고 맑은 향을 냄)', insight: '조건이 넉넉하지 않고 척박해 보이는 자리일수록 내 안의 고유한 향기가 더 선명해질 수 있음', tone: '바닷바람을 타고 연보라색 라벤더 물결이 돌담 사이를 부드럽게 스쳐 가는 오전' },
  { motif: '오래된 올리브나무의 매듭(Gnarled Olive · 휘어진 가지마다 수백 년의 가뭄과 바람을 견딘 흔적)', insight: '매끈하고 반듯하게만 자라지 못했어도, 구부러진 마디마다 삶을 버텨 낸 단단한 힘이 깃듦', tone: '은빛 올리브 잎사귀가 정오의 눈부신 햇살 아래 잔잔히 반짝이는 낮' },
  { motif: '돌집의 짙은 나무 덧문(Wooden Shutters · 한낮의 뜨거운 빛을 잠시 가려 집 안을 서늘히 유지함)', insight: '외부의 자극이 너무 뜨거울 때는 잠시 덧문을 닫고 내 안의 서늘한 그늘에서 숨을 고를 줄 알아야 함', tone: '골목길 하얀 돌집의 초록색 덧문 사이로 시원한 바닷바람이 들어오는 오후' },
  { motif: '포구 등대의 잔잔한 물결(Harbor Reflection · 해가 진 뒤 작은 배들이 밧줄에 매여 고요히 흔들림)', insight: '하루의 항해를 마친 뒤에는 파도를 더 이기려 하지 말고 포구의 밧줄에 나를 맡겨 쉬어야 함', tone: '붉은 기와지붕 위로 황혼이 내리고 잔잔한 항구 물결에 불빛이 하나둘 켜지는 저녁' },
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

export function calculateDalmatianStoneLavenderCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): DalmatianStoneResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-DALMATIAN-STONE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    dalmatianMotif: picked.motif,
    dalmatianInsight: picked.insight,
    adriaticTone: picked.tone,
    reflectionFocus: `달마티아 석축의 '${picked.motif}'처럼, 거친 돌멩이를 내 밭을 지키는 울타리로 바꾸고 서늘한 그늘에서 숨을 골라 보세요.`,
    ritualAction: '오늘 걸림돌처럼 느껴졌던 일 하나를 버리지 말고, 내 일상을 정리하는 경계석으로 활용해 보세요.',
    reflectiveQuestion: '지금 내가 치워 버리고 싶었던 돌멩이 중에, 사실은 내 울타리를 세울 수 있는 재료는 무엇인가요?',
    interpretiveBoundary: '아드리아해 크로아티아 달마티아·흐바르 섬의 석축 밭과 라벤더 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatDalmatianStonePrompt(res: DalmatianStoneResult): string {
  return [
    `[달마티아·라벤더 석축 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 달마티아 모티프: ${res.dalmatianMotif} (${res.adriaticTone})`,
    `- 중심 통찰: ${res.dalmatianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
