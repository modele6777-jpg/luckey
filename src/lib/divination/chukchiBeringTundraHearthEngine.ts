import type { UserProfile } from '../sharedState';

export interface ChukchiBeringResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '안식·온기' | '일·첫걸음' | '유연·집중' | '생존 전반';
  tundraSymbol: string;
  companionSymbol: string;
  tundraHearthAxis: string;
  chukchiCrossAxis: string;
  topicBalanceHint: string;
  chukchiInsight: string;
  beringTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  {
    symbol: '야랑가 천막의 등불(Yaranga · 바깥의 눈보라를 막아 내는 둥근 온기)',
    insight: '바깥 환경이 차갑고 거칠수록 내 안의 작은 온기와 휴식 공간을 먼저 단단히 지켜야 함',
    tone: '베링해 툰드라의 푸른 새벽빛 속에서 은은히 비치는 둥근 천막 안의 따뜻한 등불',
    ritual: '오늘 하루 나를 지치게 하는 차가운 소식이나 일정에서 잠시 벗어나, 따뜻한 차 한 잔과 함께 나만의 안식 시간을 챙겨 보세요.',
    question: '바깥의 눈보라가 거셀수록 야랑가 천막의 등불처럼 가장 먼저 따뜻하게 지켜야 할 내 안의 쉼터는 어디인가요?',
  },
  {
    symbol: '순록 떼의 이동(Reindeer Herd · 얼어붙은 땅 위에서 길을 내는 인내)',
    insight: '아무도 가지 않은 눈밭이라도 앞선 한 걸음이 자국을 남기면 뒤따르는 길이 열림',
    tone: '끝없는 설원 위로 하얀 입김을 내뿜으며 차분히 나아가는 무리의 발걸음',
    ritual: '아직 길이 안 보이는 일이라도 오늘 딱 한 걸음만큼의 첫 발자국을 내어 보세요.',
    question: '아직 아무도 걷지 않은 눈밭처럼 막막하지만, 오늘 내가 먼저 첫 발자국을 남길 일은 무엇인가요?',
  },
  {
    symbol: '우미악 가죽배(Umiak · 거친 빙해에서도 부서지지 않는 유연한 틀)',
    insight: '딱딱하게 버티기만 하는 것보다 파도의 충격을 흡수할 줄 아는 유연함이 먼 바다를 건넘',
    tone: '부빙(流氷) 사이 맑은 물길을 조용히 가르며 나아가는 가벼운 가죽배',
    ritual: '딱딱하게 맞서 버티던 문제 하나를 오늘 한 걸음 물러서서 부드럽게 흘려보내 보세요.',
    question: '지금 내가 딱딱하게 버티느라 힘을 다 쓰고 있는 자리에서, 우미악 가죽배처럼 유연하게 충격을 흘려보낼 수 있는 방법은 무엇인가요?',
  },
  {
    symbol: '바다코끼리 상아 조각(Ivory Carving · 긴 겨울밤 손끝으로 빚는 작은 집중)',
    insight: '답답한 기다림의 시간도 내 손끝의 작은 정성을 기울이면 의미 있는 작품으로 남음',
    tone: '따뜻한 난로 곁에서 정갈하게 다듬어지는 작고 매끄러운 세공품',
    ritual: '기다림이 길어지는 일 앞에서 조바심 내기보다, 지금 손끝으로 다듬을 수 있는 작은 완성도 하나에 15분 집중해 보세요.',
    question: '답답한 기다림의 시간 속에서도 내 손끝의 정성을 기울이면 작은 작품으로 남을 일은 무엇인가요?',
  },
  {
    symbol: '극지의 여명(Polar Dawn · 긴 밤 끝에도 반드시 찾아오는 옅은 분홍빛)',
    insight: '어두운 시간이 길어 보여도 계절의 바퀴는 멈추지 않고 서서히 밝은 쪽으로 기울어 감',
    tone: '얼어붙은 바다 수평선 너머로 번져 나오는 고요한 장미빛 여명',
    ritual: '오래 끌려 무겁던 문제에서 이미 조금씩 밝아진 변화 한 가지를 찾아 메모해 보세요.',
    question: '긴 밤처럼 느껴지는 지금의 시간 속에서도, 수평선 너머 여명처럼 이미 조금씩 밝아지고 있는 조짐은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
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

const CHUKCHI_SHADOWS = [
  '천막 안의 온기를 지키려다 바깥에서 건네는 필요한 도움과 기회까지 닫아 버리지 마세요.',
  '첫 발자국을 내디딘 뒤 너무 빨리 속도를 높여 호흡이 흐트러지지 않도록 조절하세요.',
  '충격을 유연하게 흘려보내려다 정작 분명히 선을 그어야 할 기준까지 흐려지지 않게 살피세요.',
  '손끝의 완성도에만 몰두해 전체 흐름과 마감 시점을 놓치지 않도록 고개를 들어 확인하세요.',
  '서서히 밝아지는 조짐에만 기대어 오늘 처리해야 할 현실적인 정리를 미루지 않도록 주의하세요.',
];

const TOPIC_BALANCE_HINTS: Record<ChukchiBeringResult['questionTopic'], string> = {
  '안식·온기': '야랑가 천막의 등불처럼 내 안의 쉼터를 지키되, 필요한 온기와 연결의 문은 열어 두세요.',
  '일·첫걸음': '끝없는 설원 앞에서도 오늘 내딛는 작은 한 걸음의 자국이 내일의 길을 열어 줍니다.',
  '유연·집중': '파도를 정면으로 막기보다 우미악 가죽배처럼 충격을 흘려보내며 손끝의 집중을 지키세요.',
  '생존 전반': '바깥의 바람이 거칠수록 내면의 따뜻한 화덕과 유연한 호흡의 균형을 먼저 돌보세요.',
};

function classifyChukchiTopic(q: string): ChukchiBeringResult['questionTopic'] {
  if (/온기|안식|휴식|마음|쉼터|사람/.test(q)) return '안식·온기';
  if (/일|직장|진로|걸음|길|시작/.test(q)) return '일·첫걸음';
  if (/유연|집중|기다림|완성|부담/.test(q)) return '유연·집중';
  return '생존 전반';
}

export function calculateChukchiBeringTundraHearth(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChukchiBeringResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyChukchiTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SYMBOLS.length - 1));
  const picked = SYMBOLS[idx];
  const companion = SYMBOLS[(idx + companionOffset) % SYMBOLS.length];
  const tundraHearthAxis = `${picked.symbol.split('(')[0].trim()} ↔ ${companion.symbol.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = CHUKCHI_SHADOWS[idx];

  const calculatedAtKst = formatKstIso(now);
  const chukchiCrossAxis = `[${picked.symbol.split('(')[0].trim()}] × [${companion.symbol.split('(')[0].trim()}] × [${questionTopic}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-CHUKCHI-BERING-v2.5.0',
    calculatedAtKst,
    questionTopic,
    tundraSymbol: picked.symbol,
    companionSymbol: companion.symbol,
    tundraHearthAxis,
    chukchiCrossAxis,
    topicBalanceHint,
    chukchiInsight: `${picked.insight} (동반 상징: ${companion.symbol})`,
    beringTone: picked.tone,
    reflectionFocus: `축치·베링해 툰드라 지혜의 '${picked.symbol}'와 동반 상징 '${companion.symbol}'처럼, 바깥의 바람이 거칠 때는 내 안의 따뜻한 화덕과 유연한 틀을 먼저 돌보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '베링해 축치(Chukchi) 전통의 야랑가 온기·우미악 유연성 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChukchiBeringPrompt(res: ChukchiBeringResult): string {
  return [
    `[축치 베링해·툰드라 화덕 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 극지 축: ${res.tundraHearthAxis}`,
    `- 4중 교차 축: ${res.chukchiCrossAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 극지 상징: ${res.tundraSymbol} (${res.beringTone})`,
    `- 동반 상징: ${res.companionSymbol}`,
    `- 중심 통찰: ${res.chukchiInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
