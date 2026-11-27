import type { UserProfile } from '../sharedState';

export interface MuiscaGuatavitaInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export type MuiscaQuestionCategory = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface MuiscaGuatavitaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: string;
  questionCategory: MuiscaQuestionCategory;
  offeringPhase: string;
  companionPhase: string;
  goldRaftCycle: string;
  topicBalanceHint: string;
  lakeReflection: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const GOLD_RAFT_CYCLES = [
  '물안개 속 호숫가 정돈 · 성급함 내려놓기',
  '소유보다 감사 순환 · 마음의 수면 넓히기',
  '겉의 광채 비우기 · 정성의 중심 세우기',
  '약속과 화해 건네기 · 맑은 여백 채우기',
] as const;

const PHASES = [
  '고원 호수의 새벽 물안개',
  '황금 뗏목의 고요한 출발',
  '산 능선이 비치는 잔잔한 수면',
  '약속을 건네는 맑은 물결',
] as const;

const REFLECTIONS = [
  '안개 속에서 서두르지 않고 호수 가장자리부터 살피면 길이 선명해집니다.',
  '가진 것을 움켜쥐기보다 감사로 흘려보낼 때 마음의 수면이 넓어집니다.',
  '겉의 반짝임보다 그 안에 담긴 정성이 오늘의 균형을 세워 줍니다.',
  '비워 낸 자리마다 산 바람과 맑은 빛이 자연스럽게 스며듭니다.',
] as const;

const ACTIONS = [
  '지금 붙잡고 있는 걱정 하나를 종이에 적어 내려놓고 숨을 고르기',
  '오늘 가장 소중한 일 하나에만 온전히 시간 배정하기',
  '책상 위 불필요한 물건 하나를 치우고 여백을 만들기',
  '가까운 사람에게 고마웠던 일 한 가지를 짧게 전하기',
] as const;

const QUESTIONS = [
  '내가 지금 지키려 애쓰는 것 가운데 기꺼이 흘려보낼 수 있는 것은 무엇인가요?',
  '반짝이는 결과보다 그 과정에서 어떤 정성을 남기고 싶은가요?',
  '오늘 내 마음의 호수를 가장 잔잔하게 만드는 선택은 무엇일까요?',
  '감사의 마음으로 먼저 건네고 싶은 말이나 행동이 있나요?',
] as const;

const TOPIC_BALANCE_HINTS: Record<MuiscaQuestionCategory, string> = {
  career: '일·커리어에서는 겉의 화려한 성과보다 지금 이 일에 담고 있는 정성과 본질적 의미를 먼저 점검하세요.',
  relationship: '관계에서는 서운함을 움켜쥐기보다 감사와 화해의 작은 물결을 먼저 흘려보내는 편이 수면을 넓힙니다.',
  wealth: '재정·계약에서는 과도한 소유욕으로 판단이 흐려지지 않게, 비울 것과 지킬 것의 경계를 명확히 세우세요.',
  health: '건강·회복에서는 머릿속 번잡함을 종이에 비워 내고 고원 호수처럼 고요한 휴식 시간을 확보하세요.',
  decision: '선택의 기로에서는 물안개가 걷힐 때까지 호숫가에서 한 호흡 고른 뒤 정성이 향하는 쪽을 택하세요.',
  general: '오늘의 흐름에서는 주 국면과 동반 국면을 함께 살피며 비움과 정성의 균형을 맞추세요.',
};

function classifyMuiscaCategory(question: string): MuiscaQuestionCategory {
  if (/일|직장|사업|커리어|프로젝트|성과|이직/.test(question)) return 'career';
  if (/사랑|연애|관계|가족|친구|갈등|화해/.test(question)) return 'relationship';
  if (/돈|재물|재정|투자|소비|계약/.test(question)) return 'wealth';
  if (/건강|몸|피로|휴식|수면|회복/.test(question)) return 'health';
  if (/선택|결정|방향|균형|비우|진로/.test(question)) return 'decision';
  return 'general';
}

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateMuiscaGuatavitaLake(input: MuiscaGuatavitaInput): MuiscaGuatavitaResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const phaseIdx = seed % PHASES.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (PHASES.length - 1));
  const offeringPhase = PHASES[phaseIdx];
  const companionPhase = PHASES[(phaseIdx + companionOffset) % PHASES.length];
  const goldRaftCycle = GOLD_RAFT_CYCLES[hashSeed(`${seedText}|cycle`) % GOLD_RAFT_CYCLES.length];
  const trimmedQ = (input.question ?? '').trim();
  const questionTopic = trimmedQ
    ? trimmedQ.slice(0, 36)
    : '감사·화해와 비움으로 세우는 호수 균형';
  const questionCategory = classifyMuiscaCategory(trimmedQ);

  return {
    engineVersion: 'LUCKEY-MUISCA-GUATAVITA-v2.4.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    questionCategory,
    offeringPhase,
    companionPhase,
    goldRaftCycle,
    topicBalanceHint: TOPIC_BALANCE_HINTS[questionCategory],
    lakeReflection: REFLECTIONS[(seed >>> 3) % REFLECTIONS.length],
    reflectionFocus: `질문 맥락('${questionTopic}')에서 안데스 고원 무이스카 족이 과타비타 호수에 감사와 화해의 뜻으로 금을 바치던 의식처럼, 주 국면('${offeringPhase}')과 황금 뗏목 순환('${goldRaftCycle}')을 함께 비추어 소유보다 순환과 정성의 균형을 돌아보는 상징적 관점입니다.`,
    ritualAction: ACTIONS[phaseIdx],
    reflectiveQuestion: QUESTIONS[phaseIdx],
    shadowWarning: '비움과 봉헌을 명분으로 지금 정당하게 지켜야 할 자신의 몫과 경계까지 무작정 내어주지 않도록 살피세요.',
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatMuiscaGuatavitaPrompt(res: MuiscaGuatavitaResult): string {
  return [
    `[무이스카·과타비타 황금 호수 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `질문 맥락: ${res.questionTopic}`,
    `호수 국면: ${res.offeringPhase}`,
    `동반 국면: ${res.companionPhase}`,
    `황금 뗏목 순환: ${res.goldRaftCycle}`,
    `주제별 균형 조언: ${res.topicBalanceHint}`,
    `비춤: ${res.lakeReflection}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `과잉 경계: ${res.shadowWarning}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
