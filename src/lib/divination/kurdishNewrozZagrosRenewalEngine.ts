import type { UserProfile } from '../sharedState';

export interface KurdishNewrozResult {
  engineVersion: string;
  calculatedAtKst: string;
  zagrosSymbol: string;
  companionSymbol: string;
  newrozInsight: string;
  kurdishTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  {
    symbol: '네우로즈(Newroz · 새로운 날을 밝히는 언덕의 불)',
    insight: '긴 겨울 같은 정체기가 지나고 반드시 다시 시작되는 따뜻한 전환과 재생의 불씨',
    tone: '자그로스 산맥 능선 위 봄밤을 밝히는 붉은 모닥불',
    action: '오래 미뤄 두어 마음이 무거웠던 작은 일 하나를 오늘 "새 출발의 첫 단추" 삼아 5분만 손대어 보세요.',
    question: '어제의 아쉬움에서 벗어나 오늘을 진짜 "새로운 날(Newroz)"로 시작하려면 무엇을 가장 먼저 털어내야 할까요?',
  },
  {
    symbol: '석류와 아몬드 꽃 · 바위 틈의 봄',
    insight: '척박해 보이는 환경 속에서도 제 때가 오면 어김없이 꽃을 피워내는 단단한 생명력',
    tone: '거친 돌산 계곡 틈에서 피어난 연분홍 아몬드 꽃가지',
    action: '조건이 완벽해지기를 기다리기보다 지금 자리에서 가장 먼저 틔울 수 있는 작은 시도 한 가지를 오늘 실행해 보세요.',
    question: '지금 내 주변 환경이 척박하게 느껴질수록 오히려 조용히 힘을 기르고 있는 나의 가능성은 무엇인가요?',
  },
  {
    symbol: '덴그베즈(Dengbêj · 기억을 노래로 잇는 이야기꾼)',
    insight: '지나온 아픔과 경험을 부끄러워 숨기기보다 진솔한 이야기로 엮어낼 때 생기는 치유',
    tone: '별빛 아래 조용히 울려 퍼지는 구전 서사의 깊은 목소리',
    action: '마음속에만 묵혀 두었던 지나간 경험 하나를 오늘 짧은 문장이나 음성 메모로 솔직하게 꺼내어 정리해 보세요.',
    question: '혼자 삼키느라 무거웠던 기억 가운데 이제는 나의 이야기로 건져 올려도 괜찮을 장면은 무엇인가요?',
  },
  {
    symbol: '고벤드(Govend · 손을 떼지 않고 이어가는 둥근 춤)',
    insight: '나 혼자 지칠 때 곁의 손이 나를 붙들어 주듯, 느슨하지만 끊어지지 않는 연대의 힘',
    tone: '봄 풀밭 위에서 어깨를 나란히 맞대고 추는 경쾌한 원무',
    action: '혼자 버티려던 일 하나를 떠올려 믿을 수 있는 사람에게 오늘 짧게 안부나 도움을 청하는 메시지를 보내 보세요.',
    question: '내가 혼자 다 짊어져야 한다고 믿지만 실제로는 곁의 손과 호흡을 맞추면 훨씬 가벼워질 일은 무엇인가요?',
  },
  {
    symbol: '자그로스(Zagros)의 맑은 설수',
    insight: '마음에 쌓인 무거운 먼지를 조용히 씻어 내고 오늘을 첫날처럼 맞이하는 개운함',
    tone: '만년설이 녹아 계곡을 적시며 흐르는 투명한 물소리',
    action: '책상이나 가방 속 불필요한 물건·메모 세 가지를 오늘 비워 내며 마음의 물길을 맑게 씻어 내 보세요.',
    question: '새 계절의 맑은 물이 흐를 수 있도록 오늘 내 일상에서 기꺼이 씻어 내고 싶은 묵은 습관은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
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
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SYMBOLS.length - 1));
  const companion = SYMBOLS[(idx + companionOffset) % SYMBOLS.length];

  return {
    engineVersion: 'LUCKEY-KURDISH-NEWROZ-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    zagrosSymbol: picked.symbol,
    companionSymbol: companion.symbol,
    newrozInsight: picked.insight,
    kurdishTone: picked.tone,
    reflectionFocus: `쿠르드 네우로즈의 '${picked.symbol}'을 중심에 두고 '${companion.symbol}'의 흐름을 함께 엮어, 어제의 피로를 오늘까지 끌고 오지 말고 지금 이 순간을 새로운 첫날로 열어 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '쿠르드(Kurdish) 네우로즈 새날의 불과 자그로스 산맥 회복 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKurdishNewrozPrompt(res: KurdishNewrozResult): string {
  return [
    `[쿠르드 네우로즈·자그로스 재생 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 네우로즈 상징: ${res.zagrosSymbol} (${res.kurdishTone})`,
    `- 동반 상징: ${res.companionSymbol}`,
    `- 중심 통찰: ${res.newrozInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
