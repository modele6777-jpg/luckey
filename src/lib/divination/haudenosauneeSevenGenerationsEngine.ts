import type { UserProfile } from '../sharedState';

export type HaudenosauneeQuestionCategory = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface HaudenosauneeResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: string;
  questionCategory: HaudenosauneeQuestionCategory;
  councilPrinciple: string;
  companionPrinciple: string;
  longhousePeaceAxis: string;
  topicBalanceHint: string;
  generationalLens: string;
  peaceTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const LONGHOUSE_PEACE_AXES = [
  '일곱 세대 앞선 시선 · 지금 손에 쥔 신뢰 다지기',
  '좋은 마음(Good Mind) 대화 · 서로의 품위 보전',
  '왐펌(Wampum) 작은 약속 · 끝까지 매듭짓는 힘',
  '세 자매 공생 리듬 · 혼자 짊어지지 않는 호흡',
] as const;

const PRINCIPLES = [
  {
    principle: '일곱 세대 앞선 시선(Seventh Generation)',
    lens: '당장의 편함보다 오래 남을 신뢰와 품위를 먼저 챙기는 선택',
    tone: '거대한 흰 소나무 그늘',
    ritual: '오늘 내릴 선택 하나를 떠올리며, 한 달 뒤나 일 년 뒤의 나에게 편하냐고 속으로 물어보세요.',
    question: '지금 당장 해결하고 싶은 조급함 너머로, 내가 정말 오래 지키고 싶은 가치는 무엇인가요?',
  },
  {
    principle: '좋은 마음(Good Mind)의 합의',
    lens: '이기고 지는 말다툼 대신 서로의 마음을 다치지 않게 여미는 대화',
    tone: '맑은 호수의 잔물결',
    ritual: '오늘 나누는 대화 중 한 번은 내 주장을 보태기 전에 상대의 마음이 다치지 않을 표현을 먼저 골라 보세요.',
    question: '이기고 지는 말다툼에서 한 걸음 물러서서, 서로의 좋은 마음(Good Mind)을 여미는 쪽을 택한다면 어떤 말이 남을까요?',
  },
  {
    principle: '왐펌(Wampum) 약속의 매듭',
    lens: '가볍게 던진 말보다 지킬 수 있는 작은 약속 하나를 끝까지 지키는 힘',
    tone: '단단히 엮인 조개띠',
    ritual: '거창한 새 다짐 대신 오늘 나 자신이나 타인과 한 작은 약속 하나를 끝까지 매듭지어 보세요.',
    question: '가볍게 던진 여러 말보다 왐펌의 매듭처럼 단단히 끝까지 지켜 내고 싶은 오늘의 약속은 무엇인가요?',
  },
  {
    principle: '평화의 나무 뿌리',
    lens: '흔들리는 가지가 아니라 나를 지탱하는 깊은 뿌리를 먼저 돌보는 자세',
    tone: '숲속의 고요한 숨결',
    ritual: '바깥의 소란에 흔들릴 때마다 오늘 나를 지탱해 주는 수면·호흡·정리 습관 하나를 먼저 돌보세요.',
    question: '바람에 흔들리는 가지에 신경 쓰느라 정작 나를 지탱하는 깊은 뿌리를 돌보지 못한 부분은 어디인가요?',
  },
  {
    principle: '세 자매 농법의 공생',
    lens: '혼자 다 하려 하지 않고 주변의 도움과 내 리듬이 자연스럽게 맞물리게 두기',
    tone: '함께 자라는 옥수수와 콩',
    ritual: '혼자 다 짊어지려던 일 하나를 주변의 리듬이나 협업자의 도움과 자연스럽게 맞물리게 나누어 보세요.',
    question: '옥수수와 콩, 호박이 서로를 받쳐 주듯 혼자 다 하려 하지 않고 주변과 공생하면 훨씬 가벼워질 일은 무엇인가요?',
  },
];

const TOPIC_BALANCE_HINTS: Record<HaudenosauneeQuestionCategory, string> = {
  career: '일·커리어에서는 단기 성과만 쫓다 신뢰를 잃지 않도록, 세 자매 농법처럼 주변과 공생하는 구조를 살피세요.',
  relationship: '관계에서는 이기고 지는 말다툼 대신 서로의 좋은 마음(Good Mind)이 다치지 않는 표현을 고르세요.',
  wealth: '재정·계약에서는 가볍게 던진 약속을 피하고 왐펌의 매듭처럼 끝까지 책임질 수 있는 범위만 약정하세요.',
  health: '건강·회복에서는 흔들리는 가지에 신경 쓰기보다 수면·호흡·정리 같은 깊은 뿌리부터 먼저 돌보세요.',
  decision: '결정의 순간에는 지금의 조급함 너머 한 달 뒤, 일 년 뒤에도 고마워할 선택을 기준으로 삼으세요.',
  general: '오늘의 흐름에서는 평의회 원칙과 동반 원리를 함께 살피며 장기 시선과 지금의 작은 실행을 맞추세요.',
};

function classifyHaudenosauneeCategory(question: string): HaudenosauneeQuestionCategory {
  if (/일|직장|사업|커리어|프로젝트|성과|이직/.test(question)) return 'career';
  if (/사랑|연애|관계|가족|친구|갈등|신뢰/.test(question)) return 'relationship';
  if (/돈|재물|재정|투자|소비|계약/.test(question)) return 'wealth';
  if (/건강|몸|피로|휴식|수면|회복/.test(question)) return 'health';
  if (/선택|결정|방향|고민|진로/.test(question)) return 'decision';
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

export function calculateHaudenosauneeSevenGenerations(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HaudenosauneeResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRINCIPLES.length - 1));
  const picked = PRINCIPLES[idx];
  const companion = PRINCIPLES[(idx + companionOffset) % PRINCIPLES.length];
  const longhousePeaceAxis = LONGHOUSE_PEACE_AXES[stableHash(`${seed}|axis`) % LONGHOUSE_PEACE_AXES.length];
  const trimmedQ = (params.question ?? '').trim();
  const questionTopic = trimmedQ
    ? trimmedQ.slice(0, 36)
    : '오래 남을 신뢰와 품위를 세우는 선택';
  const questionCategory = classifyHaudenosauneeCategory(trimmedQ);

  return {
    engineVersion: 'LUCKEY-HAUDENOSAUNEE-7GEN-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    questionCategory,
    councilPrinciple: picked.principle,
    companionPrinciple: companion.principle,
    longhousePeaceAxis,
    topicBalanceHint: TOPIC_BALANCE_HINTS[questionCategory],
    generationalLens: `${picked.lens} (동반 원리: ${companion.principle})`,
    peaceTone: picked.tone,
    reflectionFocus: `질문 맥락('${questionTopic}')에서 호데노쇼니 대평화 법칙의 '${picked.principle}'와 평화의 집 축('${longhousePeaceAxis}')을 함께 살피며, 급한 결정 앞에서도 1년 뒤 내가 고마워할 쪽을 살펴보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    shadowWarning: '먼 훗날의 이상만 내다보다 지금 당장 건네야 할 솔직한 말과 작은 실행을 미루지 않도록 살피세요.',
    interpretiveBoundary: '호데노쇼니(이로쿼이) 7세대 대평화 법칙을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHaudenosauneePrompt(res: HaudenosauneeResult): string {
  return [
    `[호데노쇼니 7세대 대평화 법칙 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic}`,
    `- 평의회 원칙: ${res.councilPrinciple} (${res.peaceTone})`,
    `- 동반 원리: ${res.companionPrinciple}`,
    `- 평화의 집 축: ${res.longhousePeaceAxis}`,
    `- 주제별 균형 조언: ${res.topicBalanceHint}`,
    `- 장기 시선: ${res.generationalLens}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
