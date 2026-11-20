import type { UserProfile } from '../sharedState';

export interface ChukchiBeringResult {
  engineVersion: string;
  calculatedAtKst: string;
  tundraSymbol: string;
  chukchiInsight: string;
  beringTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  { symbol: '야랑가 천막의 등불(Yaranga · 바깥의 눈보라를 막아 내는 둥근 온기)', insight: '바깥 환경이 차갑고 거칠수록 내 안의 작은 온기와 휴식 공간을 먼저 단단히 지켜야 함', tone: '베링해 툰드라의 푸른 새벽빛 속에서 은은히 비치는 둥근 천막 안의 따뜻한 등불' },
  { symbol: '순록 떼의 이동(Reindeer Herd · 얼어붙은 땅 위에서 길을 내는 인내)', insight: '아무도 가지 않은 눈밭이라도 앞선 한 걸음이 자국을 남기면 뒤따르는 길이 열림', tone: '끝없는 설원 위로 하얀 입김을 내뿜으며 차분히 나아가는 무리의 발걸음' },
  { symbol: '우미악 가죽배(Umiak · 거친 빙해에서도 부서지지 않는 유연한 틀)', insight: '딱딱하게 버티기만 하는 것보다 파도의 충격을 흡수할 줄 아는 유연함이 먼 바다를 건넘', tone: '부빙(流氷) 사이 맑은 물길을 조용히 가르며 나아가는 가벼운 가죽배' },
  { symbol: '바다코끼리 상아 조각(Ivory Carving · 긴 겨울밤 손끝으로 빚는 작은 집중)', insight: '답답한 기다림의 시간도 내 손끝의 작은 정성을 기울이면 의미 있는 작품으로 남음', tone: '따뜻한 난로 곁에서 정갈하게 다듬어지는 작고 매끄러운 세공품' },
  { symbol: '극지의 여명(Polar Dawn · 긴 밤 끝에도 반드시 찾아오는 옅은 분홍빛)', insight: '어두운 시간이 길어 보여도 계절의 바퀴는 멈추지 않고 서서히 밝은 쪽으로 기울어 감', tone: '얼어붙은 바다 수평선 너머로 번져 나오는 고요한 장미빛 여명' },
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

export function calculateChukchiBeringTundraHearth(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChukchiBeringResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const picked = SYMBOLS[idx];

  return {
    engineVersion: 'LUCKEY-CHUKCHI-BERING-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    tundraSymbol: picked.symbol,
    chukchiInsight: picked.insight,
    beringTone: picked.tone,
    reflectionFocus: `축치·베링해 툰드라 지혜의 '${picked.symbol}'처럼, 바깥의 바람이 거칠 때는 내 안의 따뜻한 화덕과 유연한 틀을 먼저 돌보세요.`,
    ritualAction: '오늘 하루 나를 지치게 하는 차가운 소식이나 일정에서 잠시 벗어나, 따뜻한 차 한 잔과 함께 나만의 안식 시간을 챙겨 보세요.',
    reflectiveQuestion: '지금 내가 딱딱하게 버티느라 힘을 다 쓰고 있는 자리에서, 우미악 가죽배처럼 유연하게 충격을 흘려보낼 수 있는 방법은 무엇인가요?',
    interpretiveBoundary: '베링해 축치(Chukchi) 전통의 야랑가 온기·우미악 유연성 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChukchiBeringPrompt(res: ChukchiBeringResult): string {
  return [
    `[축치 베링해·툰드라 화덕 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 극지 상징: ${res.tundraSymbol} (${res.beringTone})`,
    `- 중심 통찰: ${res.chukchiInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
