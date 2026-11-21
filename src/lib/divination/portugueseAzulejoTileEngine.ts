import type { UserProfile } from '../sharedState';

export interface PortugueseAzulejoInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface PortugueseAzulejoResult {
  engineVersion: string;
  calculatedAtKst: string;
  tileMotif: string;
  companionMotif: string;
  facadePoise: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const TILE_MOTIFS = [
  '햇빛을 받아 벽면을 서늘하게 식혀 주는 유약 도자기 타일',
  '작은 정사각형 조각들이 이어져 커다란 항해 이야기를 이루는 벽화',
  '코발트 블루 안료로 흰 바탕 위에 또렷이 남긴 선과 여백',
  '대서양 해풍과 소금기를 묵묵히 견뎌 온 외벽의 단단한 광택',
] as const;

const POISE_INSIGHTS = [
  '거대한 벽화도 결국 손바닥만 한 타일 한 장을 반듯하게 붙이는 일에서 시작됩니다.',
  '타일 사이를 메우는 얇은 줄눈의 여백이 있어야 열기가 올라도 벽면이 뒤틀리지 않습니다.',
  '푸른 무늬가 빛나는 것은 짙은 색을 많이 써서가 아니라 흰 바탕이 충분히 남았기 때문입니다.',
  '비바람을 오래 맞은 외벽일수록 겉은 단단해지고 안쪽의 습기와 열기를 잘 조절해 줍니다.',
] as const;

const ACTIONS = [
  '오늘 해야 할 큰 일을 타일 한 장 크기(20분 단위)로 쪼개어 첫 조각부터 차분히 붙이기',
  '마음에 걸리는 일과 일 사이에 5분간 숨을 고르는 흰 줄눈의 여백 남기기',
  '오늘 나를 가장 산뜻하게 해 줄 한 가지 색이나 풍경을 잠깐 멈춰 바라보기',
  '외부의 소음이나 급한 재촉 앞에서도 내 안의 온도를 한 톤 서늘하게 가라앉히기',
] as const;

const QUESTIONS = [
  '지금 내가 한 번에 다 그려야 한다고 여기는 큰 벽화에서, 오늘 딱 한 장만 붙인다면 어느 조각일까요?',
  '요즘 내 하루에는 타일과 타일 사이를 지켜 주는 얇은 여백이 잘 남아 있나요?',
  '지금 내 마음을 짙게 채우고 있는 고민 옆에, 반짝이는 흰 바탕 같은 쉼표는 어디에 둘 수 있을까요?',
  '주변의 열기나 재촉 속에서 나만의 서늘한 균형을 지켜 주는 습관은 무엇인가요?',
] as const;

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculatePortugueseAzulejoTile(input: PortugueseAzulejoInput): PortugueseAzulejoResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const motifIdx = seed % TILE_MOTIFS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (TILE_MOTIFS.length - 1));
  const tileMotif = TILE_MOTIFS[motifIdx];
  const companionMotif = TILE_MOTIFS[(motifIdx + companionOffset) % TILE_MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-PORTUGUESE-AZULEJO-v2.2.0',
    calculatedAtKst: toKstIso(input.now),
    tileMotif,
    companionMotif,
    facadePoise: POISE_INSIGHTS[(seed >>> 3) % POISE_INSIGHTS.length],
    reflectionFocus: `포르투갈 리스본과 포르투의 외벽을 채우는 아줄레주 푸른 타일이 작은 조각들의 이어짐과 서늘한 유약의 광택으로 건물의 온도를 지키듯, 주 모티프('${tileMotif}')와 동반 모티프('${companionMotif}')를 나란히 놓아 작은 단위와 여백의 리듬을 살피는 상징적 관점입니다.`,
    ritualAction: ACTIONS[motifIdx],
    reflectiveQuestion: QUESTIONS[motifIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatPortugueseAzulejoPrompt(res: PortugueseAzulejoResult): string {
  return [
    `[포르투갈·아줄레주 푸른 타일 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `타일 모티프: ${res.tileMotif}`,
    `동반 모티프: ${res.companionMotif}`,
    `외벽 균형: ${res.facadePoise}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
