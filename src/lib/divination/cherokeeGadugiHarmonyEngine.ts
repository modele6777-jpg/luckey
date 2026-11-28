import type { UserProfile } from '../sharedState';

export type CherokeeQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface CherokeeGadugiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: CherokeeQuestionTopic;
  gadugiPrinciple: string;
  companionPrinciple: string;
  duyuktvInsight: string;
  smokyMountainsTone: string;
  duyuktvBalanceAxis: string;
  cherokeeCrossAxis: string;
  topicBalanceHint: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  {
    principle: '가두기(Gadugi · 함께 모여 서로의 짐을 덜어주는 마음)',
    insight: '혼자 버거울 때 공동체의 손을 잡고, 여유가 있을 때 기꺼이 내 손을 내미는 선순환',
    tone: '안개 낀 스모키 산맥 골짜기를 함께 감싸 흐르는 맑은 계곡물',
    ritual: '오늘 혼자 끙끙 앓던 일 중 하나를 믿을 만한 사람과 가볍게 나누어 보거나, 누군가의 작은 수고에 진심으로 고마움을 전해 보세요.',
    question: '지금 내 마음속에서 두려움과 신뢰 가운데 내가 더 자주 먹이를 주고 있는 쪽은 어느 쪽인가요?',
  },
  {
    principle: '두육트브(Duyuktv · 바르고 조화로운 길)',
    insight: '이기고 지는 다툼보다 관계와 자연 전체가 편안하게 숨 쉴 수 있는 균형점을 찾음',
    tone: '새벽 이슬이 맺힌 옥수수와 호박, 콩 세 자매 밭의 고요한 조화',
    ritual: '오늘 결론을 급히 내리기 전에, 관계와 일 전체가 함께 숨 쉴 수 있는 중간 균형점이 어디인지 한 줄로 적어 보세요.',
    question: '이기고 지는 셈법을 내려놓고 전체의 조화(Duyuktv)를 먼저 본다면, 지금의 고민에서 자연히 드러날 답은 무엇인가요?',
  },
  {
    principle: '토히(Tohi · 물처럼 흐르는 평화와 건강)',
    insight: '고집스럽게 막아선 감정을 흘려보낼 때 마음과 몸의 순환이 다시 자연스럽게 이어짐',
    tone: '돌을 부딪치지 않고 부드럽게 돌아 흐르는 산골짜기 시냇물',
    ritual: '굳게 붙잡고 있던 서운함이나 긴장을 한 호흡 길게 내쉬며 몸의 어깨 힘을 먼저 풀어 보세요.',
    question: '계곡물처럼 돌아 흐르면 될 일인데, 내가 고집스럽게 둑을 세워 흐름을 막아 두고 있는 감정은 무엇인가요?',
  },
  {
    principle: '하얀 늑대와 검은 늑대의 우화(내면의 먹이 주기)',
    insight: '내 안에서 자라는 두려움과 신뢰 중 내가 오늘 어떤 생각에 마음을 보태는지가 하루를 결정함',
    tone: '밤나무 숲 사이로 스며드는 따뜻하고 명료한 오후의 햇빛',
    ritual: '오늘 머릿속에 걱정스러운 상상이 떠오를 때마다, 이미 잘 해내었던 경험 한 가지를 나란히 떠올려 보세요.',
    question: '오늘 내 안에서 자라고 있는 두려움의 늑대와 신뢰의 늑대 중, 내 시간과 집중을 더 건네주고 있는 쪽은 어느 쪽인가요?',
  },
  {
    principle: '일곱 세대의 시선(다음 세대까지 내다보는 신중함)',
    insight: '당장의 눈앞 이익보다 오래도록 부끄럽지 않을 선택을 고를 때 마음이 가장 가벼워짐',
    tone: '일곱 갈래 성스러운 불꽃이 둥글게 타오르는 원형 회의장',
    ritual: '오늘 내려야 할 결정 하나를 한 달 뒤나 일 년 뒤의 나에게도 떳떳한지 가볍게 비추어 보세요.',
    question: '당장의 편리함보다 오래도록 부끄럽지 않을 선택을 고른다면, 오늘 내 판단 기준은 어떻게 달라질까요?',
  },
];

const TOPIC_BALANCE_HINTS: Record<CherokeeQuestionTopic, string> = {
  career: '일과 협업에서는 경쟁의 승패보다 함께 일하는 동료와 오래 숨 쉴 수 있는 균형점(Duyuktv)을 세우는 편이 좋습니다.',
  relationship: '관계에서는 상대를 이기려 들기보다 서로의 짐을 조금씩 나누는 가두기(Gadugi)의 손길이 매듭을 풉니다.',
  wealth: '재정 판단은 당장의 눈앞 이익보다 일곱 세대 뒤까지 떳떳한 안정성을 먼저 확인하는 편이 유리합니다.',
  health: '몸과 마음의 회복에는 억지로 둑을 세우기보다 토히(Tohi)처럼 감정의 물길을 부드럽게 흘려보내는 호흡이 필요합니다.',
  decision: '선택의 순간에는 두려움의 늑대와 신뢰의 늑대 중 내가 어느 쪽에 마음을 보태고 있는지부터 살피세요.',
  general: '내면의 균형과 공동체의 조화를 함께 바라보면 오늘 가야 할 바른 길이 한결 선명해집니다.',
};

function classifyCherokeeTopic(question?: string): CherokeeQuestionTopic {
  const q = (question ?? '').trim();
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(q)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(q)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(q)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복|평화/.test(q)) return 'health';
  if (/결정|선택|고민|방향|시작|조화|신뢰/.test(q)) return 'decision';
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

export function calculateCherokeeGadugiHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CherokeeGadugiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRINCIPLES.length - 1));
  const picked = PRINCIPLES[idx];
  const companion = PRINCIPLES[(idx + companionOffset) % PRINCIPLES.length];
  const questionTopic = classifyCherokeeTopic(params.question);
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const duyuktvBalanceAxis = `${picked.principle.split('(')[0].trim()} ↔ ${companion.principle.split('(')[0].trim()} 조화 축`;
  const shadowWarning = `[${picked.principle.split('(')[0].trim()} 과잉 경계] 배려나 조화를 앞세우다 정작 내 안의 솔직한 경계와 필요를 지워 버리지 않도록 살피십시오.`;

  const calculatedAtKst = formatKstIso(now);
  const cherokeeCrossAxis = `[${picked.principle.split('(')[0].trim()}] × [${companion.principle.split('(')[0].trim()}] × [${questionTopic}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-CHEROKEE-GADUGI-v2.5.0',
    calculatedAtKst,
    questionTopic,
    gadugiPrinciple: picked.principle,
    companionPrinciple: companion.principle,
    duyuktvInsight: `${picked.insight} (동반 원리: ${companion.principle})`,
    smokyMountainsTone: picked.tone,
    duyuktvBalanceAxis,
    cherokeeCrossAxis,
    topicBalanceHint,
    shadowWarning,
    reflectionFocus: `체로키 지혜의 '${picked.principle}'와 동반 원리 '${companion.principle}'처럼, 내 안의 두려움 대신 신뢰와 조화(Duyuktv)의 마음에 오늘의 힘을 보태 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '북미 체로키(Cherokee)의 가두기(Gadugi) 상호부조·두육트브(Duyuktv) 조화 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCherokeeGadugiPrompt(res: CherokeeGadugiResult): string {
  return [
    `[체로키 가두기·두육트브 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 조화 원칙: ${res.gadugiPrinciple} (${res.smokyMountainsTone})`,
    `- 동반 원리: ${res.companionPrinciple}`,
    `- 두육트브 조화 축: ${res.duyuktvBalanceAxis}`,
    `- 4중 교차 축: ${res.cherokeeCrossAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 중심 통찰: ${res.duyuktvInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
