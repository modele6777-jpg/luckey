import type { UserProfile } from '../sharedState';

export interface KurdishNewrozResult {
  engineVersion: string;
  calculatedAtKst: string;
  zagrosSymbol: string;
  newrozInsight: string;
  kurdishTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  { symbol: '네우로즈(Newroz · 새로운 날을 밝히는 언덕의 불)', insight: '긴 겨울 같은 정체기가 지나고 반드시 다시 시작되는 따뜻한 전환과 재생의 불씨', tone: '자그로스 산맥 능선 위 봄밤을 밝히는 붉은 모닥불' },
  { symbol: '석류와 아몬드 꽃 · 바위 틈의 봄', insight: '척박해 보이는 환경 속에서도 제 때가 오면 어김없이 꽃을 피워내는 단단한 생명력', tone: '거친 돌산 계곡 틈에서 피어난 연분홍 아몬드 꽃가지' },
  { symbol: '덴그베즈(Dengbêj · 기억을 노래로 잇는 이야기꾼)', insight: '지나온 아픔과 경험을 부끄러워 숨기기보다 진솔한 이야기로 엮어낼 때 생기는 치유', tone: '별빛 아래 조용히 울려 퍼지는 구전 서사의 깊은 목소리' },
  { symbol: '고벤드(Govend · 손을 떼지 않고 이어가는 둥근 춤)', insight: '나 혼자 지칠 때 곁의 손이 나를 붙들어 주듯, 느슨하지만 끊어지지 않는 연대의 힘', tone: '봄 풀밭 위에서 어깨를 나란히 맞대고 추는 경쾌한 원무' },
  { symbol: '자그로스(Zagros)의 맑은 설수', insight: '마음에 쌓인 무거운 먼지를 조용히 씻어 내고 오늘을 첫날처럼 맞이하는 개운함', tone: '만년설이 녹아 계곡을 적시며 흐르는 투명한 물소리' },
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

export function calculateKurdishNewrozZagrosRenewal(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KurdishNewrozResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const picked = SYMBOLS[idx];

  return {
    engineVersion: 'LUCKEY-KURDISH-NEWROZ-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    zagrosSymbol: picked.symbol,
    newrozInsight: picked.insight,
    kurdishTone: picked.tone,
    reflectionFocus: `쿠르드 네우로즈의 '${picked.symbol}'처럼, 어제의 피로를 오늘까지 끌고 오지 말고 지금 이 순간을 새로운 첫날로 열어 보세요.`,
    ritualAction: '오래 미뤄 두어 마음이 무거웠던 작은 일 하나를 오늘 "새 출발의 첫 단추" 삼아 5분만 손대어 보세요.',
    reflectiveQuestion: '어제의 아쉬움에서 벗어나 오늘을 진짜 "새로운 날(Newroz)"로 시작하려면 무엇을 가장 먼저 털어내야 할까요?',
    interpretiveBoundary: '쿠르드(Kurdish) 네우로즈 새날의 불과 자그로스 산맥 회복 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKurdishNewrozPrompt(res: KurdishNewrozResult): string {
  return [
    `[쿠르드 네우로즈·자그로스 재생 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 네우로즈 상징: ${res.zagrosSymbol} (${res.kurdishTone})`,
    `- 중심 통찰: ${res.newrozInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
