import type { UserProfile } from '../sharedState';

export interface CorsicanPaghjellaResult {
  engineVersion: string;
  calculatedAtKst: string;
  corsicanVoice: string;
  paghjellaInsight: string;
  maquisTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const VOICES = [
  { voice: '세콘다(Seconda · 멜로디를 여는 첫 번째 목소리)', insight: '누군가의 눈치를 보며 기다리기보다 먼저 내 진심의 첫 음을 조용히 띄워 올리는 용기', tone: '코르시카 밤나무 숲 산길에서 울려 퍼지는 맑고 담담한 첫 목소리' },
  { voice: '바수(Bassu · 바닥을 받치는 깊고 묵직한 저음)', insight: '화려하게 튀지 않아도 전체 화음이 무너지지 않도록 중심을 잡아주는 든든한 성실함', tone: '화강암 절벽 아래 지중해 깊은 바다의 잔잔한 울림' },
  { voice: '테르차(Terza · 위를 감싸며 화음을 완성하는 고음)', insight: '이미 있는 조건 위에 작은 배려와 재치를 얹어 분위기를 부드럽게 밝히는 감각', tone: '마키(Maquis) 관목 숲을 스쳐 지나가는 향긋한 허브 바람' },
  { voice: '리블라(Libra · 산과 바다가 맞닿은 능선의 균형)', insight: '한쪽으로 치우친 생각을 잠시 내려놓고 서로 다른 두 입장을 함께 품어 보는 시선', tone: '눈 덮인 산봉우리와 푸른 만이 한눈에 들어오는 코르시카 고개' },
  { voice: '마키(Maquis)의 질긴 뿌리 · 꺾이지 않는 고요한 자존감', insight: '거친 바닷바람에도 뿌리를 깊게 내린 관목처럼 나만의 고요한 기준을 지키는 힘', tone: '오후 햇살 아래 은은한 소나무와 미르틀 향기가 퍼지는 돌길' },
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

export function calculateCorsicanPaghjellaMaquisHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CorsicanPaghjellaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % VOICES.length;
  const picked = VOICES[idx];

  return {
    engineVersion: 'LUCKEY-CORSICAN-PAGHJELLA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    corsicanVoice: picked.voice,
    paghjellaInsight: picked.insight,
    maquisTone: picked.tone,
    reflectionFocus: `코르시카 파겔라 다성 합창의 '${picked.voice}'처럼, 모든 일을 나 혼자 다 해내려 하기보다 지금 내 자리의 한 음을 정확하고 맑게 내는 데 집중해 보세요.`,
    ritualAction: '오늘 주변 사람과의 대화에서 내가 먼저 내야 할 목소리(시작)인지, 든든히 받쳐 줄 자리(경청)인지 한 번만 가려 보세요.',
    reflectiveQuestion: '지금 내 삶이라는 합창에서 내가 너무 크게 부르거나 혹은 너무 작게 숨기고 있는 파트는 무엇인가요?',
    interpretiveBoundary: '지중해 코르시카(Corsica) 파겔라 다성 합창과 마키(Maquis) 산길 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCorsicanPaghjellaPrompt(res: CorsicanPaghjellaResult): string {
  return [
    `[코르시카 파겔라·마키 화음 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 합창 성부: ${res.corsicanVoice} (${res.maquisTone})`,
    `- 중심 통찰: ${res.paghjellaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
