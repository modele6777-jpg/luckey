import type { UserProfile } from '../sharedState';

export interface SinhalaHarmonyLayer {
  name: string;
  motif: string;
  guidance: string;
}

export interface SinhalaBaliKohombaResult {
  engineVersion: string;
  calculatedAtKst: string;
  activeLayer: SinhalaHarmonyLayer;
  protectiveBlessing: string;
  interpretation: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SINHALA_HARMONY_LAYERS: SinhalaHarmonyLayer[] = [
  {
    name: '코훔바 칸카리야(Kohomba Kankariya) — 맑은 씻김과 새출발',
    motif: '코코넛 꽃과 님나무 잎',
    guidance: '마음속에 오래 묵은 피로나 찝찝한 감정을 억누르기보다 부드럽게 털어내고 공기를 환기할 때입니다.',
  },
  {
    name: '라타 야쿠마(Rata Yakuma) — 두려움을 달래는 리듬',
    motif: '북소리와 횃불의 춤',
    guidance: '막연한 불안을 피하려 하기보다 리듬 있게 몸을 움직이고 이름을 붙여 보면 두려움의 크기가 줄어듭니다.',
  },
  {
    name: '발리(Bali) 평온 의례 — 내면 기상도 정돈',
    motif: '다채로운 천연 안료와 등불',
    guidance: '복잡하게 얽힌 하루의 감정을 한 가지 색씩 나누어 바라보면 지금 당장 돌봐야 할 마음이 선명해집니다.',
  },
  {
    name: '세스 피리스(Seth Pirith) — 다정한 축복의 순환',
    motif: '연꽃 실타래',
    guidance: '스스로를 다그치는 말 대신 나 자신과 가까운 이에게 건네는 부드러운 축복의 언어가 회복의 시작입니다.',
  },
];

const PROTECTIVE_BLESSINGS = [
  '아유보완(Ayubowan) — 오늘 하루 내 숨과 걸음이 길고 편안하게 이어지기를 바라는 평안의 인사',
  '마음의 등불을 켜고 불필요한 걱정의 그림자를 걷어 내는 고요한 시선',
  '리듬 있는 호흡으로 긴장된 어깨와 생각을 느슨하게 풀어 주는 여백',
];

function formatKstTimestamp(date: Date): string {
  const kstMs = date.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateSinhalaBaliKohombaHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SinhalaBaliKohombaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 10)}`;
  const hash = stableHash(seed);

  const activeLayer = SINHALA_HARMONY_LAYERS[hash % SINHALA_HARMONY_LAYERS.length];
  const protectiveBlessing = PROTECTIVE_BLESSINGS[(hash >>> 3) % PROTECTIVE_BLESSINGS.length];

  return {
    engineVersion: 'LUCKEY-SINHALA-BALI-v2.1.0',
    calculatedAtKst: formatKstTimestamp(now),
    activeLayer,
    protectiveBlessing,
    interpretation: `스리랑카 싱할라 발리·코훔바 전통의 치유와 조화 관점에서는 '${activeLayer.name}'(${activeLayer.motif})이 강조됩니다. ${activeLayer.guidance}`,
    ritualAction: '창문을 열어 5분간 신선한 공기를 들이마시고, 따뜻한 차나 물 한 잔을 마시며 스스로에게 다정한 한마디를 건네 보세요.',
    reflectionFocus: `'${protectiveBlessing}'을(를) 떠올리며 지금 내 마음을 무겁게 누르던 생각을 가볍게 내려놓아 보세요.`,
    reflectiveQuestion: '오늘 내 마음에서 가장 먼저 환기시키고 싶은 피로나 걱정은 무엇이며, 그것을 비운 자리에 어떤 평온을 채우고 싶나요?',
    interpretiveBoundary: '본 풀이는 스리랑카 싱할라 발리·코훔바 전통 의례의 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSinhalaBaliPrompt(result: SinhalaBaliKohombaResult): string {
  return [
    `[스리랑카 싱할라 발리·코훔바 조화 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 치유 층위: ${result.activeLayer.name} (${result.activeLayer.motif})`,
    `- 평안의 축복: ${result.protectiveBlessing}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
