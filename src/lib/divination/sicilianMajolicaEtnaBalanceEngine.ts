import type { UserProfile } from '../sharedState';

export interface SicilianMajolicaResult {
  engineVersion: string;
  calculatedAtKst: string;
  islandMotif: string;
  sicilianInsight: string;
  mediterraneanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '마졸리카 유약(Majolica Glaze · 가마의 뜨거운 열을 지나 맑은 빛을 내는 도자기)', insight: '잠시 뜨거운 고비를 건넌 뒤에야 마음의 결이 선명한 색깔과 단단함을 얻게 됨', tone: '시칠리아 칼타지로네의 채색 도자기 계단 위로 쏟아지는 지중해의 정오 햇빛' },
  { motif: '에트나의 화산 토양(Etna Soil · 식어 내린 재 위에서 더 달게 자라는 열매)', insight: '한 번 흔들렸던 자리라고 해서 끝이 아니라, 그 바탕 위에서 오히려 새로운 싹이 깊게 자람', tone: '검은 현무암 바위 틈새로 푸른 포도나무와 감귤 밭이 펼쳐진 에트나 산자락' },
  { motif: '트리스켈리온의 세 발(Triskelion · 멈춰 서지 않고 둥글게 순환하는 움직임)', insight: '한 자리에 고여 답답할 때는 완벽한 결론보다 작은 한 발짝의 순환을 먼저 만들어야 함', tone: '이오니아해의 맑은 파도가 세 방향 곶을 감싸 돌며 부서지는 해안선' },
  { motif: '노토의 바로크 곡선(Noto Baroque · 꿀빛 사암이 저녁 빛에 부드러워지는 순간)', insight: '날카롭게 다그치기만 하는 하루보다 스스로에게 약간의 곡선과 여유를 허락할 때 아름다움', tone: '해 질 녘 따뜻한 황금빛으로 물드는 노토 광장의 고풍스러운 석조 발코니' },
  { motif: '레몬 나무 그늘(Limonaia · 한낮의 열기를 피해 숨을 고르는 뜰)', insight: '열심히 달리는 시간만큼 한낮의 그늘 아래서 향기를 맡으며 식히는 시간이 꼭 필요함', tone: '돌담 안쪽 정원에서 상큼한 레몬 향기를 실어 나르는 선선한 바닷바람' },
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

export function calculateSicilianMajolicaEtnaBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SicilianMajolicaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-SICILIAN-MAJOLICA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    islandMotif: picked.motif,
    sicilianInsight: picked.insight,
    mediterraneanTone: picked.tone,
    reflectionFocus: `시칠리아 마졸리카·에트나 지혜의 '${picked.motif}'처럼, 뜨거운 고비를 지난 경험도 내 삶을 더 선명하게 빚는 유약과 토양으로 바라보세요.`,
    ritualAction: '오늘 한낮의 바쁜 흐름 속에서 5분만 레몬 나무 그늘에 들른 듯 멈춰 서서, 지금 내 마음의 온도를 살짝 식혀 주세요.',
    reflectiveQuestion: '지금 내가 끝났다고 생각했던 흔들림의 자리 위에서, 에트나의 비옥한 토양처럼 새롭게 키워 볼 수 있는 작은 싹은 무엇인가요?',
    interpretiveBoundary: '지중해 시칠리아(Sicily)의 마졸리카 도자기·에트나 화산 토양 회복 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSicilianMajolicaPrompt(res: SicilianMajolicaResult): string {
  return [
    `[시칠리아 마졸리카·에트나 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 섬의 상징: ${res.islandMotif} (${res.mediterraneanTone})`,
    `- 중심 통찰: ${res.sicilianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
