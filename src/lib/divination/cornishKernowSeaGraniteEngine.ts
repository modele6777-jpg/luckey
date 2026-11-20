import type { UserProfile } from '../sharedState';

export interface CornishKernowResult {
  engineVersion: string;
  calculatedAtKst: string;
  kernowLandmark: string;
  cornishInsight: string;
  atlanticTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LANDMARKS = [
  { landmark: '틴타젤(Tintagel · 두 바다가 만나는 좁은 곶)', insight: '거친 파도와 고요한 만이 한 자리에서 만나듯, 바깥의 소란 속에서도 내 안의 중심을 지키는 힘', tone: '콘월 절벽 아래로 밀려드는 청록빛 대서양 파도' },
  { landmark: '스태너리(Stannary · 화강암 아래 단단한 주석 광맥)', insight: '겉으로 당장 드러나지 않아도 보이지 않는 땅속에서 묵묵히 여물어 가는 내공의 시간', tone: '바닷바람을 견디며 서 있는 이끼 낀 화강암 돌담' },
  { landmark: '트레고바(Tregova · 어부가 돌아오는 포구의 불빛)', insight: '멀리 항해한 날일수록 안전하게 닻을 내리고 쉴 수 있는 일상의 작은 쉼터가 중요함', tone: '저녁 안개 속에 하나둘 켜지는 작은 항구의 따뜻한 등불' },
  { landmark: '메넨(Menen · 들판에 홀로 서 있는 고인돌 선돌)', insight: '사방에서 바람이 불어도 흔들리지 않고 오래 자리를 지키는 담백한 신념', tone: '보랏빛 헤더 꽃이 핀 콘월 황야 위의 고요한 선돌' },
  { landmark: '케르노우(Kernow)의 밀물과 썰물 사이 모래톱', insight: '모든 문이 동시에 열리지 않아도 물이 빠질 때 비로소 걸어 건널 수 있는 길이 나타남', tone: '썰물 뒤 반짝이는 젖은 모래톱 위 갈매기 발자국' },
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

export function calculateCornishKernowSeaGranite(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CornishKernowResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % LANDMARKS.length;
  const picked = LANDMARKS[idx];

  return {
    engineVersion: 'LUCKEY-CORNISH-KERNOW-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    kernowLandmark: picked.landmark,
    cornishInsight: picked.insight,
    atlanticTone: picked.tone,
    reflectionFocus: `콘월 케르노우의 '${picked.landmark}'처럼, 지금 당장 결과를 재촉하기보다 바람을 견디며 단단해지는 시간을 믿어 보세요.`,
    ritualAction: '오늘 내가 남몰래 꾸준히 지켜온 습관이나 성실함 한 가지를 스스로 칭찬해 주세요.',
    reflectiveQuestion: '겉으로 당장 보이지 않을 뿐, 내 안에서 이미 단단하게 여물어가고 있는 내공은 무엇인가요?',
    interpretiveBoundary: '영국 콘월(Cornwall · Kernow) 켈트 해안과 화강암 광맥의 인내 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCornishKernowPrompt(res: CornishKernowResult): string {
  return [
    `[콘월 케르노우·화강암 인내 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 케르노우 상징: ${res.kernowLandmark} (${res.atlanticTone})`,
    `- 중심 통찰: ${res.cornishInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
