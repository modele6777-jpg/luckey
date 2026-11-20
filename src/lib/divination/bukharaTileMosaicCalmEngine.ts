import type { UserProfile } from '../sharedState';

export interface BukharaTileResult {
  engineVersion: string;
  calculatedAtKst: string;
  bukharaMotif: string;
  bukharaInsight: string;
  oasisTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '칼랸 미나레트의 벽돌 띠(Kalyan Minaret Bands · 14겹의 서로 다른 벽돌 문양이 탑을 세움)', insight: '하루하루의 서로 다른 작은 리듬이 겹겹이 쌓여야 흔들리지 않는 높은 시야를 얻음', tone: '우즈베키스탄 부하라의 맑은 아침, 연황색 벽돌 탑 위로 비둘기 떼가 선회하는 광장' },
  { motif: '라비 하우즈의 연못 거울(Lyabi-Hauz Pool · 사막 오아시스 중심의 고요한 물이 하늘을 비춤)', insight: '먼 길을 달려와 갈증이 날수록 한 걸음 멈춰 고요한 물에 내 얼굴과 하늘을 비추어 보아야 함', tone: '오래된 뽕나무 그늘 아래 초록빛 연못이 바람 없이 잔잔하게 하늘을 담은 오전' },
  { motif: '청록 유약 타일의 기하학(Turquoise Mosaic · 작은 사각 조각이 반복되며 무한한 별을 이룸)', insight: '거창한 한 방이 아니라 손바닥만 한 작은 조각을 제자리에 정확히 붙이는 정성이 대작을 만듦', tone: '마드라사 아치 위로 햇빛을 받은 코발트와 청록 타일이 눈부시게 빛나는 정오' },
  { motif: '토키 사르라폰의 교차 돔(Trading Dome Crossroads · 사방에서 온 상인들이 둥근 천장 아래 만남)', insight: '막다른 길처럼 보여도 둥근 광장 아래로 걸어 들어오면 사방으로 열린 다른 길이 보임', tone: '시원한 벽돌 돔 그늘 아래 실크와 향신료 향기가 은은히 흐르는 오후' },
  { motif: '미르 아랍의 별 창(Star Lattice · 흙벽돌 창살 사이로 밤의 서늘한 공기와 별이 들어옴)', insight: '나를 지키는 벽을 세우되 바깥의 숨통과 별빛이 들어올 작은 격자 창은 열어 두어야 함', tone: '사막의 밤이 내려앉은 흙벽돌 마당, 창살 사이로 맑은 별빛이 스며드는 저녁' },
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

export function calculateBukharaTileMosaicCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BukharaTileResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-BUKHARA-TILE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    bukharaMotif: picked.motif,
    bukharaInsight: picked.insight,
    oasisTone: picked.tone,
    reflectionFocus: `부하라 타일 모자이크의 '${picked.motif}'처럼, 손바닥만 한 작은 조각 하나를 제자리에 맞추는 정성으로 오늘의 균형을 세워 보세요.`,
    ritualAction: '오늘 해야 할 큰 일을 한꺼번에 처리하려 들지 말고, 가장 작은 타일 한 조각(5분 분량)만 깔끔히 붙여 보세요.',
    reflectiveQuestion: '지금 내가 놓치고 있는 것은 거대한 전략이 아니라, 매일 제자리에 놓이는 작은 벽돌 띠 하나는 아닐까요?',
    interpretiveBoundary: '우즈베키스탄 부하라 오아시스 도시의 벽돌 건축과 타일 기하학 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBukharaTilePrompt(res: BukharaTileResult): string {
  return [
    `[부하라·청록 타일 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 부하라 모티프: ${res.bukharaMotif} (${res.oasisTone})`,
    `- 중심 통찰: ${res.bukharaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
