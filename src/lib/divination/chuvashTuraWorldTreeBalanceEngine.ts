import type { UserProfile } from '../sharedState';

export interface ChuvashTuraResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계·순리' | '일·질서' | '판단·지혜' | '조화 전반';
  chuvashSign: string;
  companionSign: string;
  worldTreeAxis: string;
  topicBalanceHint: string;
  turaInsight: string;
  volgaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  {
    sign: '키레메트(Kiremet · 맑은 숲과 샘의 조화)',
    insight: '자연의 순리를 억지로 거스르지 않고 조심스레 존중할 때 찾아오는 고요한 평화',
    tone: '볼가 강 중류 자작나무와 참나무 숲 사이의 맑은 샘터',
    ritual: '오늘 하루 억지로 밀어붙이던 일 하나를 잠시 멈추고 자연스러운 흐름을 살피는 10분을 가져 보세요.',
    question: '지금 내가 힘을 빼고 순리에 맡길 때 오히려 더 맑아질 관계나 일은 무엇인가요?',
  },
  {
    sign: '투라(Tură)의 햇살 · 만물을 비추는 공정한 빛',
    insight: '편견 없이 상황을 있는 그대로 바라볼 때 비로소 보이는 명료한 해결의 실마리',
    tone: '안개 걷힌 볼가 강변 언덕 위로 비치는 고요한 아침 햇살',
    ritual: '오늘 판단해야 할 사안 하나를 감정적 수식어 없이 사실 문장 세 줄로만 적어 보세요.',
    question: '내가 이미 내려놓은 선입견을 거두고 있는 그대로 본다면 상황은 어떻게 달라 보이나요?',
  },
  {
    sign: '시클레브(Săkhlev · 정갈하게 수놓은 매듭의 질서)',
    insight: '한 땀 한 땀 정성을 들여 엮은 질서가 겉보기보다 훨씬 오래 가는 단단한 힘을 만듦',
    tone: '하얀 리넨 위에 붉은 실로 정교하게 놓인 기하학 자수',
    ritual: '오늘 내 책상이나 주변 공간 한 곳을 깔끔하게 정돈하며 생각의 질서도 함께 가다듬어 보세요.',
    question: '서두르느라 건너뛴 순서를 차분히 한 땀씩 다시 짚어 본다면, 지금 가장 먼저 정돈할 일은 무엇인가요?',
  },
  {
    sign: '아카투이(Akatuy · 대지와 쟁기가 어우러진 봄의 약속)',
    insight: '씨앗을 뿌리는 수고와 결실을 기다리는 인내가 하나로 만나는 성실한 순환',
    tone: '봄비가 적신 검은 흙 위로 올라오는 연한 새싹의 기운',
    ritual: '당장 성과가 보이지 않더라도 오늘 씨앗을 심듯 15분만 꾸준히 이어갈 작은 루틴을 실행해 보세요.',
    question: '지금 내가 조급히 거두려 하기보다 묵묵히 흙을 덮고 기다려야 할 씨앗은 무엇인가요?',
  },
  {
    sign: '실트(Sălt · 조상의 지혜가 담긴 맑은 이야기)',
    insight: '내가 처음 겪는 듯한 막막함도 앞선 이들의 지혜를 빌리면 한결 가벼워짐',
    tone: '저녁 식탁에 둘러앉아 나누는 담백하고 따뜻한 옛이야기',
    ritual: '오늘 막막한 고민이 떠오르면 믿을 만한 선배나 책 속 한 문장에서 조언을 구해 보세요.',
    question: '내가 혼자 짊어지려 애쓰던 문제에 대해 먼저 걸어간 이라면 어떤 담백한 말을 건넸을까요?',
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

const CHUVASH_SHADOWS = [
  '자연의 순리를 기다리다 내가 직접 손대고 정리해야 할 현실의 과제까지 방치하지 마세요.',
  '사실만 차갑게 적으려다 함께하는 사람의 마음과 맥락까지 놓치지 않도록 균형을 살피세요.',
  '질서와 정돈에 몰두해 정작 지금 먼저 시작해야 할 핵심 실행을 미루지 않도록 주의하세요.',
  '씨앗을 심고 기다리는 인내에 익숙해져 물을 주고 솎아 내야 할 돌봄의 때를 놓치지 마세요.',
  '선배의 지혜에 기대다 내 상황에 맞는 고유한 판단과 책임을 미루지 않도록 살피세요.',
];

const TOPIC_BALANCE_HINTS: Record<ChuvashTuraResult['questionTopic'], string> = {
  '관계·순리': '억지로 흐름을 꺾기보다 서로의 속도와 순리를 존중하는 자리에서 고요한 평화가 열립니다.',
  '일·질서': '서두르며 건너뛰기보다 한 땀씩 자수를 놓듯 순서를 밟을 때 오래 가는 힘이 쌓입니다.',
  '판단·지혜': '감정적 수식어를 걷어내고 있는 그대로의 사실과 앞선 지혜를 함께 비추어 보세요.',
  '조화 전반': '자연의 순리를 기다리는 여유와 오늘 내가 돌봐야 할 작은 질서 사이에서 박자를 맞추세요.',
};

function classifyChuvashTopic(q: string): ChuvashTuraResult['questionTopic'] {
  if (/관계|순리|사람|사랑|대화|평화/.test(q)) return '관계·순리';
  if (/일|직장|질서|순서|정돈|루틴/.test(q)) return '일·질서';
  if (/판단|지혜|조언|선입견|고민/.test(q)) return '판단·지혜';
  return '조화 전반';
}

export function calculateChuvashTuraWorldTreeBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChuvashTuraResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyChuvashTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SIGNS.length - 1));
  const picked = SIGNS[idx];
  const companion = SIGNS[(idx + companionOffset) % SIGNS.length];
  const worldTreeAxis = `${picked.sign.split('(')[0].trim()} ↔ ${companion.sign.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = CHUVASH_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-CHUVASH-TURA-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    chuvashSign: picked.sign,
    companionSign: companion.sign,
    worldTreeAxis,
    topicBalanceHint,
    turaInsight: picked.insight,
    volgaTone: picked.tone,
    reflectionFocus: `볼가 추바시 자연 철학의 '${picked.sign}'과 동반 상징 '${companion.sign}'을 함께 엮어, 한 땀씩 정갈하게 순서를 밟아 나가는 성실함 속에서 고요한 질서를 세워 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '볼가 강 중류 추바시(Chuvash)의 투라(Tură) · 키레메트 자연 조화와 전통 자수 질서 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChuvashTuraPrompt(res: ChuvashTuraResult): string {
  return [
    `[추바시 투라·세계수 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 세계수 축: ${res.worldTreeAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 추바시 상징: ${res.chuvashSign} (${res.volgaTone})`,
    `- 동반 상징: ${res.companionSign}`,
    `- 중심 통찰: ${res.turaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
