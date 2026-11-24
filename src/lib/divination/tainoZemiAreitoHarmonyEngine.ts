import type { UserProfile } from '../sharedState';

export type TainoQuestionTopic = 'rhythm' | 'emotion' | 'clarity' | 'relation' | 'general';

function classifyTainoTopic(q: string): TainoQuestionTopic {
  if (/호흡|리듬|박자|속도|균형/.test(q)) return 'rhythm';
  if (/감정|마음|불안|파도|평정/.test(q)) return 'emotion';
  if (/정리|선택|시야|결단|복잡/.test(q)) return 'clarity';
  if (/관계|사람|소통|연결|대화/.test(q)) return 'relation';
  return 'general';
}

const TAINO_AXIS_BY_INDEX = [
  '아레이토 원형 호흡 축(혼자의 박자를 공동체 리듬과 맞추는 순환)',
  '아타베이 심해 평정 축(거친 표면 아래 깊은 바닥을 지키는 고요)',
  '코호바 정화 시야 축(결정을 늦추고 번잡함을 먼저 비우는 맑음)',
  '카누 해협 연결 축(멀어진 거리 사이에 작은 노를 젓는 실행)',
  '바테이 광장 개방 축(닫힌 울타리를 열어 새 바람을 들이는 포용)',
] as const;

const TAINO_SHADOW_WARNINGS: Record<TainoQuestionTopic, string> = {
  rhythm: '남의 박자에 맞추느라 내 숨이 가빠지지 않도록, 쉼표의 길이도 스스로 정해 두십시오.',
  emotion: '평정을 지키려 감정을 무조건 가라앉히기만 하면 신호를 놓칠 수 있으니, 올라오는 마음의 이유도 함께 살피십시오.',
  clarity: '비우기와 정리에만 머물러 정작 필요한 첫 선택을 계속 미루지 않도록 작은 기준 하나를 남기십시오.',
  relation: '광장을 여는 호의가 무분별한 양보로 흐르지 않게 내 시간과 에너지의 선을 분명히 하십시오.',
  general: '리듬과 조화는 억지로 맞출 때보다 잠시 멈춰 숨을 고를 때 더 자연스럽게 돌아옵니다.',
};

export interface TainoZemiAreitoResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: TainoQuestionTopic;
  areitoHarmonyAxis: string;
  shadowWarning: string;
  zemiEmblem: string;
  companionEmblem: string;
  areitoInsight: string;
  islandTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const EMBLEMS = [
  {
    emblem: '아레이토(Areito · 원형으로 추는 기억의 춤)',
    insight: '각자의 걸음이 어긋나지 않도록 서로의 호흡과 발박자에 귀를 기울이며 리듬을 맞추는 지혜',
    tone: '카리브 해안 모닥불 주위에 울려 퍼지는 마라카스 박자',
    action: '잠시 멈춰 어깨의 힘을 빼고 3번 깊게 숨을 내쉰 뒤, 지금 주변과 호흡이 가장 잘 맞는 작은 행동 하나만 골라 보세요.',
    question: '지금 내가 혼자서 버겁게 끌고 가느라 놓치고 있는 자연스러운 호흡이나 리듬은 무엇인가요?',
  },
  {
    emblem: '아타베이(Atabey · 고요히 품는 바다의 어머니)',
    insight: '거친 파도를 억지로 잠재우기보다 내 마음이 먼저 깊고 넓은 바닥을 되찾는 평정',
    tone: '달빛 아래 잔잔히 숨 쉬는 푸른 만의 물결',
    action: '오늘 파도처럼 일렁이는 감정이 올라올 때 억지로 누르기보다 1분간 깊은 바다 바닥을 떠올리며 숨을 가라앉혀 보세요.',
    question: '지금 나를 흔드는 거친 물결 아래에서 여전히 고요하게 자리 잡고 있는 내 마음의 바닥은 어디인가요?',
  },
  {
    emblem: '코호바(Cohoba · 번잡함을 비우는 정화의 호흡)',
    insight: '여러 감정이 뒤엉킬수록 결정을 미루고 먼저 맑은 숨으로 시야를 가라앉히는 태도',
    tone: '열대 숲 새벽 안개 사이로 스며드는 첫 햇살',
    action: '복잡한 선택을 바로 결정짓기 전에 책상이나 화면의 불필요한 창부터 비워 맑은 시야를 먼저 만들어 보세요.',
    question: '지금 내 시야를 흐리게 만드는 번잡함 중 오늘 가장 먼저 비워 내면 맑아질 것 한 가지는 무엇인가요?',
  },
  {
    emblem: '카누(Canoa · 섬과 섬을 잇는 단단한 배)',
    insight: '멀리 떨어진 사람이나 낯선 일도 작은 왕래를 통해 친숙한 다리로 이어 가는 실행력',
    tone: '투명한 산호초 위를 미끄러지듯 나아가는 목조 노',
    action: '거리가 멀어졌거나 미뤄 두었던 일이나 사람에게 오늘 작은 노를 한 번 젓듯 가벼운 첫 연결을 보내 보세요.',
    question: '지금은 멀게만 보이지만 내가 작은 왕래를 시작하면 든든한 다리로 이어질 일은 무엇인가요?',
  },
  {
    emblem: '바테이(Batey · 경계를 넘어 만나는 광장)',
    insight: '내 몫만 지키려 닫기보다 열린 공간에서 서로의 이야기를 들을 때 길이 넓어지는 이치',
    tone: '시원한 무역풍이 불어오는 마을 중앙의 넓은 공터',
    action: '오늘 내 생각의 울타리를 조금 열고, 다른 사람의 의견이나 새로운 제안 하나를 편하게 들어 보세요.',
    question: '내 몫을 지키려 닫아 두었던 문을 조금 열 때 새롭게 들어올 수 있는 시원한 바람은 무엇인가요?',
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

export function calculateTainoZemiAreitoHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TainoZemiAreitoResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyTainoTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % EMBLEMS.length;
  const picked = EMBLEMS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (EMBLEMS.length - 1));
  const companion = EMBLEMS[(idx + companionOffset) % EMBLEMS.length];
  const areitoHarmonyAxis = TAINO_AXIS_BY_INDEX[idx];
  const shadowWarning = TAINO_SHADOW_WARNINGS[questionTopic];

  return {
    engineVersion: 'LUCKEY-TAINO-ZEMI-AREITO-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    areitoHarmonyAxis,
    shadowWarning,
    zemiEmblem: picked.emblem,
    companionEmblem: companion.emblem,
    areitoInsight: picked.insight,
    islandTone: picked.tone,
    reflectionFocus: `카리브 타이노의 '${picked.emblem}'을 중심에 두고 '${companion.emblem}'의 결을 곁들여 내 안의 호흡과 주변과의 리듬이 맞는지 먼저 살펴보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '카리브 타이노 전통의 세미(Zemi)·아레이토(Areito) 공동체 리듬과 자연 공존 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTainoZemiAreitoPrompt(res: TainoZemiAreitoResult): string {
  return [
    `[타이노 세미·아레이토 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 세미 상징: ${res.zemiEmblem} (${res.islandTone})`,
    `- 동반 상징: ${res.companionEmblem}`,
    `- 조화 축: ${res.areitoHarmonyAxis}`,
    `- 중심 통찰: ${res.areitoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
