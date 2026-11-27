import type { UserProfile } from '../sharedState';

export type FrisianQuestionCategory = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface FrisianPolderResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: string;
  questionCategory: FrisianQuestionCategory;
  polderPrinciple: string;
  companionPrinciple: string;
  dikeWaterAxis: string;
  topicBalanceHint: string;
  frisianInsight: string;
  northSeaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const DIKE_WATER_AXES = [
  '외부 밀물 완충 · 내부 수위 유지 균형',
  '공동체 제방 합의 · 각자 자리 지킴 순환',
  '간조 갯벌 기다림 · 길 열릴 때 건너기 리듬',
  '배수 풍차 비움 · 테르프 언덕 돋우기 조화',
] as const;

const PRINCIPLES = [
  {
    principle: '폴데르 합의(Polder Model · 물이 넘치기 전에 모두가 모여 둑을 살핌)',
    insight: '누구 한 사람의 고집이 아니라 서로 다른 입장이 둑을 함께 지켜야 공동체가 안전함',
    tone: '북해의 바닷바람을 막아 내며 푸른 목초지를 지켜 내는 반듯한 제방과 풍차',
    ritual: '오늘 의견이 갈리는 사안이 있다면 서로의 입장이 둑의 어느 부분을 지키려는지 한 번만 먼저 물어보세요.',
    question: '내 입장을 관철하는 것보다, 함께 지키는 둑이 무너지지 않게 먼저 살피고 조율해야 할 부분은 어디인가요?',
  },
  {
    principle: '바덴해의 간조(Wadden Sea · 물이 빠진 갯벌 위를 걸어 섬에 닿는 때)',
    insight: '물길이 거칠 때는 기다리고, 물이 빠져 길이 열릴 때 가볍게 건너가는 타이밍의 지혜',
    tone: '하늘과 바다가 맞닿은 프리슬란트 갯벌 위로 반짝이는 은빛 물웅덩이',
    ritual: '억지로 밀어붙여도 풀리지 않던 일 하나를 잠시 내려놓고, 물이 빠지는 시간대를 기다려 보세요.',
    question: '지금 내가 거친 밀물 속에서 억지로 헤엄치려 하기보다, 물이 빠져 길이 열리길 잠시 기다려 주어야 할 일은 무엇인가요?',
  },
  {
    principle: '테르프 언덕(Terp · 거친 밀물에도 잠기지 않게 미리 돋워 둔 터전)',
    insight: '위기가 닥친 뒤에 허둥지둥하기보다 평소 마음의 중심을 한 뼘 높여 두면 흔들리지 않음',
    tone: '넓은 평원 위로 완만하게 솟아 있는 오래된 마을 언덕과 붉은 지붕',
    ritual: '바쁜 일정 속에서도 나를 지탱해 주는 수면·식사·정리 루틴 한 가지를 오늘 미리 돋워 두세요.',
    question: '급한 파도가 들이닥쳐도 잠기지 않도록 평소 내 삶에 미리 돋워 두고 싶은 마음의 언덕은 무엇인가요?',
  },
  {
    principle: '배수 풍차(Poldermolen · 고인 물을 천천히 퍼내어 땅을 살림)',
    insight: '마음속에 답답함이 고였을 때는 한 번에 해결하려 하기보다 조금씩 비워 내는 편이 빠름',
    tone: '일정한 박자로 바람을 타고 돌며 운하로 물을 보내는 묵묵한 풍차 날개',
    ritual: '오늘 내 마음속에 고여 있던 답답함 한 가지를, 배수 풍차가 물을 퍼내듯 가벼운 산책이나 메모로 조금만 비워 내 보세요.',
    question: '한꺼번에 해결하려다 오히려 지쳐 버린 문제 중에서, 오늘 딱 한 바퀴씩만 비워 내도 충분할 일은 무엇인가요?',
  },
  {
    principle: '운하의 수문(Sluis · 바깥의 압력과 안쪽의 수위를 부드럽게 맞춤)',
    insight: '외부의 요구와 내 마음의 속도를 무리하게 부딪치지 않고 수문처럼 천천히 조절함',
    tone: '잔잔한 운하 물결 위로 고요히 오르내리는 작은 목조 배',
    ritual: '외부 요청이 밀려올 때 곧바로 수락하거나 거절하기 전에 5분만 수위를 맞추는 숨 고르기 시간을 두세요.',
    question: '바깥의 급한 압력과 내 안쪽의 속도를 부딪치지 않게, 오늘 내가 수문처럼 천천히 조절해야 할 경계는 어디인가요?',
  },
];

const TOPIC_BALANCE_HINTS: Record<FrisianQuestionCategory, string> = {
  career: '일·커리어에서는 혼자 둑을 다 막으려 하기보다 팀과 역할 분담의 수위를 먼저 맞추는 편이 오래 갑니다.',
  relationship: '관계에서는 상대를 설득하기 전에 서로의 둑이 어느 지점에서 넘치고 있는지 조용히 살피세요.',
  wealth: '재정·계약에서는 밀물이 닥치기 전 테르프 언덕을 돋우듯 예비 여력과 안전마진부터 확보하세요.',
  health: '건강·회복에서는 한꺼번에 무리하게 비우기보다 배수 풍차처럼 매일 일정한 박자로 피로를 덜어내세요.',
  decision: '결정의 순간에는 물이 빠지는 간조의 틈이 보일 때까지 잠시 호흡을 고른 뒤 건너가세요.',
  general: '오늘의 흐름에서는 주 원리와 동반 원리를 함께 보며 지킬 경계와 열어야 할 수문의 균형을 맞추세요.',
};

function classifyFrisianCategory(question: string): FrisianQuestionCategory {
  if (/일|직장|사업|커리어|프로젝트|성과|이직/.test(question)) return 'career';
  if (/사랑|연애|관계|가족|친구|갈등|소통/.test(question)) return 'relationship';
  if (/돈|재물|재정|투자|소비|계약/.test(question)) return 'wealth';
  if (/건강|몸|피로|휴식|수면|회복/.test(question)) return 'health';
  if (/선택|결정|방향|수위|조절|진로/.test(question)) return 'decision';
  return 'general';
}

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

export function calculateFrisianPolderDikeBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): FrisianPolderResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRINCIPLES.length - 1));
  const picked = PRINCIPLES[idx];
  const companion = PRINCIPLES[(idx + companionOffset) % PRINCIPLES.length];
  const dikeWaterAxis = DIKE_WATER_AXES[stableHash(`${seed}|axis`) % DIKE_WATER_AXES.length];
  const trimmedQ = (params.question ?? '').trim();
  const questionTopic = trimmedQ
    ? trimmedQ.slice(0, 36)
    : '삶의 수위와 경계를 맞추는 오늘의 균형';
  const questionCategory = classifyFrisianCategory(trimmedQ);

  return {
    engineVersion: 'LUCKEY-FRISIAN-POLDER-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    questionCategory,
    polderPrinciple: picked.principle,
    companionPrinciple: companion.principle,
    dikeWaterAxis,
    topicBalanceHint: TOPIC_BALANCE_HINTS[questionCategory],
    frisianInsight: `${picked.insight} (동반 원리: ${companion.principle})`,
    northSeaTone: picked.tone,
    reflectionFocus: `질문 맥락('${questionTopic}')에서 프리슬란트 폴데르 지혜의 '${picked.principle}'와 제방 수위 축('${dikeWaterAxis}')을 함께 살피며, 넘치는 걱정과 외부 요구를 한 번에 막으려 하기보다 수문을 열듯 천천히 수위를 맞춰 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    shadowWarning: '제방과 수문을 과도하게 닫아만 두면 안쪽의 물도 고여 답답해질 수 있으니, 열어야 할 틈과 지킬 경계를 함께 살피세요.',
    interpretiveBoundary: '북해 프리슬란트의 폴데르(Polder) 수문 조절·테르프 언덕·공동체 합의 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatFrisianPolderPrompt(res: FrisianPolderResult): string {
  return [
    `[프리슬란트 폴데르·방파제 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic}`,
    `- 북해 원리: ${res.polderPrinciple} (${res.northSeaTone})`,
    `- 동반 원리: ${res.companionPrinciple}`,
    `- 제방 수위 축: ${res.dikeWaterAxis}`,
    `- 주제별 균형 조언: ${res.topicBalanceHint}`,
    `- 중심 통찰: ${res.frisianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
