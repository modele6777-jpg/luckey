import type { UserProfile } from '../sharedState';

export type SomaliQuestionTopic = 'relation' | 'work' | 'emotion' | 'decision' | 'general';

export interface SomaliGabayResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: SomaliQuestionTopic;
  poetryPrinciple: string;
  companionPrinciple: string;
  somaliInsight: string;
  hornOfAfricaTone: string;
  gabayHorizonAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function classifySomaliTopic(q: string): SomaliQuestionTopic {
  if (/관계|사람|예의|약속|대화|소통/.test(q)) return 'relation';
  if (/일|직장|진로|사업|공부/.test(q)) return 'work';
  if (/마음|감정|불안|지침|상처/.test(q)) return 'emotion';
  if (/선택|결정|기다|계절풍|때/.test(q)) return 'decision';
  return 'general';
}

const SOMALI_SHADOW_WARNINGS: Record<SomaliQuestionTopic, string> = {
  relation: '말을 아끼고 한 연으로 압축하려다 꼭 필요한 따뜻한 설명까지 생략하면 상대가 거리를 느낄 수 있습니다.',
  work: '계절풍을 기다린다는 명분으로 준비 점검까지 미루면 막상 바람이 불 때 돛을 못 올릴 수 있습니다.',
  emotion: '고된 시간을 향기로 말리려다 현재의 아픔을 너무 빨리 성숙한 이야기로 덮지 마세요.',
  decision: '모두의 말을 끝까지 듣는 시르(Shir)가 결정을 회피하는 핑계가 되지 않도록 마감 시각을 정해 두세요.',
  general: '정갈한 절제가 무관심이나 냉담함으로 비치지 않도록 작은 안부 하나는 곁들여 두세요.',
};

const PRINCIPLES = [
  {
    principle: '가바이의 무게(Gabay · 많은 말 대신 잘 고른 한 연으로 뜻을 전함)',
    insight: '감정이 앞설수록 말을 늘리기보다 정갈하게 고른 한 문장이 상대를 움직임',
    tone: '아프리카의 뿔 아카시아 나무 그늘 아래 모여 맑은 운율로 낭송하는 저녁 자리',
    action: '오늘 누군가에게 중요한 말을 전해야 한다면, 길게 설명하기 전에 핵심 한 문장만 정갈하게 가다듬어 보세요.',
    question: '지금 감정이 앞서 말을 길게 늘이기보다, 정갈하게 고른 한 문장으로 전하면 훨씬 힘이 실릴 이야기는 무엇인가요?',
  },
  {
    principle: '헤르(Xeer · 성문화되지 않아도 서로가 지키는 묵시적 예의)',
    insight: '규칙이 촘촘하지 않아도 상대의 입장을 먼저 헤아리는 신의가 관계를 지탱함',
    tone: '모래 언덕 너머로 이어지는 오래된 순례길과 나그네를 맞는 맑은 물동이',
    action: '가까운 관계일수록 당연하게 넘기던 작은 예의나 배려 한 가지를 오늘 의식적으로 먼저 건네 보세요.',
    question: '규칙으로 정해져 있지 않아도 내가 먼저 지켜 줄 때 서로의 신뢰가 단단해지는 묵시적 약속은 무엇인가요?',
  },
  {
    principle: '유향의 숨결(Frankincense · 거친 바위 틈에서 천천히 굳어 맑은 향이 됨)',
    insight: '상처나 고된 시간도 서두르지 않고 잘 말려 두면 나만의 깊은 향기로 변함',
    tone: '바위 절벽 사이로 맑은 아침 공기를 타고 번지는 은은한 수지 향기',
    action: '최근 나를 지치게 했던 일 하나를 성급히 덮거나 탓하기 전에, 그 시간이 남긴 배움 한 줄만 조용히 건져 보세요.',
    question: '아직 쓰리고 거칠게 느껴지지만 서두르지 않고 잘 말려 두면 나만의 깊은 향기로 남을 경험은 무엇인가요?',
  },
  {
    principle: '모가디슈의 다우 돛(Dhow Sail · 계절풍이 바뀔 때 닻을 올리는 기다림)',
    insight: '바람의 방향이 맞지 않을 때 무리해 출항하기보다 계절풍이 바뀌는 때를 읽는 편이 현명함',
    tone: '인도양의 푸른 파도 위에서 하얀 삼각돛을 펴는 고요한 목조 범선',
    action: '역풍을 맞아 억지로 밀고 나가던 일 하나를 잠시 정박해 두고, 다음 순풍이 불어올 조건부터 점검해 보세요.',
    question: '지금 내가 바람을 거슬러 억지로 닻을 올리려 하기보다, 계절풍이 내 쪽으로 불어오길 잠시 기다려 주면 좋을 일은 무엇인가요?',
  },
  {
    principle: '시르(Shir · 모두의 말을 끝까지 듣고 나서 내리는 결론)',
    insight: '서둘러 결론을 내리기 전에 아직 듣지 못한 작은 목소리가 없는지 한 번 더 살핌',
    tone: '별빛이 내려앉은 넓은 들판에 둥글게 둘러앉아 나누는 차분한 대화',
    action: '오늘 결론을 내리기 전에 상대방이나 내 마음속에서 아직 다 듣지 못한 작은 목소리가 있는지 한 번 더 물어보세요.',
    question: '성급히 결론을 닫기 전에 한 번만 더 귀 기울여 들어 주어야 할 작은 목소리나 관점은 무엇인가요?',
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

export function calculateSomaliGabayDhowHorizon(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SomaliGabayResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifySomaliTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRINCIPLES.length - 1));
  const companion = PRINCIPLES[(idx + companionOffset) % PRINCIPLES.length];
  const gabayHorizonAxis = `${picked.principle.split('(')[0].trim()} ↔ ${companion.principle.split('(')[0].trim()}`;

  return {
    engineVersion: 'LUCKEY-SOMALI-GABAY-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    poetryPrinciple: picked.principle,
    companionPrinciple: companion.principle,
    somaliInsight: picked.insight,
    hornOfAfricaTone: picked.tone,
    gabayHorizonAxis,
    shadowWarning: SOMALI_SHADOW_WARNINGS[questionTopic],
    reflectionFocus: `소말리 가바이·해양 지혜(${questionTopic})의 '${picked.principle}'을 중심에 두고 '${companion.principle}'의 결을 곁들여 정갈한 한 마디와 계절풍의 때를 기다려 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '소말리아 가바이(Gabay) 구전 시학·헤르(Xeer) 신의·다우 항해 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSomaliGabayPrompt(res: SomaliGabayResult): string {
  return [
    `[소말리 가바이·바다 지평선 성찰 · ${res.engineVersion} | 질문 맥락: ${res.questionTopic}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 시학 원리: ${res.poetryPrinciple} (${res.hornOfAfricaTone})`,
    `- 동반 원리: ${res.companionPrinciple}`,
    `- 가바이 지평선 축: ${res.gabayHorizonAxis}`,
    `- 중심 통찰: ${res.somaliInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
