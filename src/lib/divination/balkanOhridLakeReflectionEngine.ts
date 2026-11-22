import type { UserProfile } from '../sharedState';

export interface BalkanOhridResult {
  engineVersion: string;
  calculatedAtKst: string;
  ohridSymbol: string;
  companionSymbol: string;
  springPhase: string;
  balkanInsight: string;
  lakeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  {
    symbol: '오흐리드의 맑은 심연(Lake Ohrid · 오래 고여 있으면서도 스스로 맑아지는 호수)',
    insight: '오래 머문 자리라고 다 썩는 것이 아니라, 깊은 바닥의 샘물이 돌면 고요 속에서도 늘 새로워짐',
    tone: '산으로 둘러싸인 발칸 고원 오흐리드 호수 수면 위로 투명하게 비치는 새벽 하늘',
    ritual: '오래 제자리에 머물러 답답하던 일 하나에 작은 환기(산책·정리·메모)를 넣어 물길을 터 주세요.',
    question: '오래 머문 자리라서 답답하다고 느꼈을 뿐, 깊은 바닥의 샘물을 다시 돌리면 새로워질 일상은 무엇인가요?',
    shadow: '생각만 깊게 고여 있고 작은 환기조차 미룬 채 자기 점검에 갇히는 흐름을 경계하세요.',
  },
  {
    symbol: '오흐리드 진주(Ohrid Pearl · 시간의 겹을 조용히 입혀 빚는 단단함)',
    insight: '겉으로 번쩍이는 한 방보다 매일 얇은 진주층을 한 겹씩 입히는 성실함이 결국 빛이 남',
    tone: '잔잔한 호숫가 햇살 아래 은은한 백색 광택을 띠는 작은 진주알',
    ritual: '큰 성과를 한 번에 내기보다 오늘 15분만 투자해 얇은 진주층 한 겹을 조용히 쌓아 보세요.',
    question: '화려한 한 방을 기다리느라 소홀히 했지만, 매일 얇게 한 겹씩 쌓으면 단단히 빛날 일은 무엇인가요?',
    shadow: '한 번에 완벽한 광택을 내려다 지쳐서 오늘의 얇은 한 겹마저 건너뛰는 조급함을 경계하세요.',
  },
  {
    symbol: '카네오 언덕의 돌길(Kaneo · 급하지 않게 굽이쳐 오르는 쉼의 곡선)',
    insight: '목적지까지 직선으로만 오르려 하면 숨이 차지만, 굽이를 따라 걸으면 풍경도 함께 남음',
    tone: '절벽 끝 작은 붉은 벽돌 성당으로 이어지는 햇살 따뜻한 돌계단',
    ritual: '오늘 급하게 해치우려던 일 하나를 골라, 카네오 언덕의 굽이길처럼 숨을 고르며 차분히 마무리해 보세요.',
    question: '목적지에 빨리 닿기 위해 직선으로만 몰아붙이다가 놓치고 있던 과정의 풍경은 무엇인가요?',
    shadow: '속도에 취해 숨을 돌릴 여백마저 없애고, 이미 곁에 있는 풍경을 스쳐 지나가는 태도를 경계하세요.',
  },
  {
    symbol: '발칸의 모자이크(Mosaic · 서로 다른 조각이 어우러져 이루는 균형)',
    insight: '내 안의 상반된 감정이나 낯선 선택지도 억지로 지우지 않고 한 화면에 나란히 둘 수 있음',
    tone: '오래된 비잔틴 회랑 바닥에 정교하게 맞춰진 다채로운 돌 조각들',
    ritual: '오늘 내 안에서 부딪히던 두 가지 감정을 없애려 하지 말고 각자의 자리를 메모에 나란히 적어 보세요.',
    question: '지금 내 마음속에서 억지로 지우려 애쓰기보다, 발칸의 모자이크처럼 있는 그대로 나란히 놓아두면 편안해질 감정은 무엇인가요?',
    shadow: '하나의 감정만 옳다고 단정 지어 다른 쪽 조각을 억지로 떼어 내고 균형을 잃는 편향을 경계하세요.',
  },
  {
    symbol: '카야크의 노(Oar · 물결을 거스르지 않고 리듬을 타는 손목)',
    insight: '물살이 셀 때는 힘을 빼고 노의 각도만 가볍게 조절해도 배는 원하는 방향으로 나아감',
    tone: '저녁 무렵 붉은 노을이 물든 호수 위를 잔물결만 남기며 미끄러지는 작은 나룻배',
    ritual: '어깨에 들어간 힘을 잠깐 빼고, 지금 바꿀 수 있는 방향 한 각도만 부드럽게 조정해 보세요.',
    question: '거센 물살과 힘겨루기하는 대신 손목의 각도만 가볍게 바꾸어도 자연스럽게 나아갈 수 있는 일은 무엇인가요?',
    shadow: '흐름과 맞서 싸우느라 팔에 힘만 잔뜩 주고 정작 미세한 방향 전환을 놓치는 경직을 경계하세요.',
  },
];

const SPRING_PHASES = [
  '용출 국면 — 깊은 바닥의 샘물이 조용히 솟아 고인 흐름을 갈아 주는 때',
  '잔물결 국면 — 수면 위의 작은 흔들림을 읽으며 손목의 힘을 빼고 조율하는 때',
  '투영 국면 — 산그림자와 빛을 있는 그대로 비추어 본래의 결을 확인하는 때',
  '물안개 국면 — 서두르지 않고 시야가 맑아질 때까지 한 박자 머무르는 때',
];

function formatKstStandard(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
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
  const baseSeed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(baseSeed) % SYMBOLS.length;
  const companionOffset = 1 + (stableHash(`${baseSeed}|companion`) % (SYMBOLS.length - 1));
  const companionIdx = (idx + companionOffset) % SYMBOLS.length;
  const springPhase = SPRING_PHASES[stableHash(`${baseSeed}|phase`) % SPRING_PHASES.length];
  const picked = SYMBOLS[idx];
  const companion = SYMBOLS[companionIdx];

  return {
    engineVersion: 'LUCKEY-BALKAN-OHRID-v2.3.0',
    calculatedAtKst: formatKstStandard(now),
    ohridSymbol: picked.symbol,
    companionSymbol: companion.symbol,
    springPhase,
    balkanInsight: picked.insight,
    lakeTone: picked.tone,
    reflectionFocus: `발칸 오흐리드 지혜의 '${picked.symbol}'과 '${companion.symbol}'이 '${springPhase}' 위에서 만납니다. 깊은 바닥에서부터 스스로를 맑게 돌보는 호흡을 지켜 보세요.`,
    ritualAction: `${picked.ritual} (${companion.symbol.split('(')[0].trim()}의 여운과 함께)`,
    reflectiveQuestion: picked.question,
    shadowWarning: picked.shadow,
    interpretiveBoundary: '발칸·오흐리드 호수의 깊은 물길과 진주 겹의 시간 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBalkanOhridPrompt(res: BalkanOhridResult): string {
  return [
    `[발칸 오흐리드·호수 심연 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 호수 상징: ${res.ohridSymbol} (${res.lakeTone})`,
    `- 보조 물결: ${res.companionSymbol}`,
    `- 샘물 국면: ${res.springPhase}`,
    `- 중심 통찰: ${res.balkanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
