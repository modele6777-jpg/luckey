import type { UserProfile } from '../sharedState';

export interface EvenkiBugaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '신호·관찰' | '유연·비움' | '나눔·순응' | '길잡이 전반';
  taigaSign: string;
  companionSign: string;
  taigaTrailAxis: string;
  evenkiCrossAxis: string;
  topicBalanceHint: string;
  bugaInsight: string;
  siberianTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  {
    sign: '부가(Buga · 모든 생명이 이어진 살아 있는 숲의 질서)',
    insight: '내가 혼자 길을 뚫고 가는 것 같아도 주변 환경과 조화를 이룰 때 길이 자연스럽게 열림',
    tone: '시베리아 타이가 침엽수림 사이로 부드럽게 스며드는 낮고 맑은 햇살',
    ritual: '오늘 내가 당연하게 지나쳤던 주변의 작은 변화나 신호 하나를 가만히 관찰하고 기록해 보세요.',
    question: '지금 내 곁의 환경과 억지로 맞서기보다, 함께 호흡을 맞춰 풀 수 있는 매듭은 무엇인가요?',
  },
  {
    sign: '순록의 뿔과 발자국(눈밭에서도 방향을 잃지 않는 세심함)',
    insight: '큰 지도만 바라보지 않고 눈앞의 작은 흔적과 변화의 신호를 놓치지 않을 때 길을 찾음',
    tone: '하얀 자작나무 숲 눈밭 위로 선명하게 이어진 순록 떼의 발자국',
    ritual: '거창한 계획표 대신 오늘 내 앞에 실제로 찍힌 작은 단서와 발자국 하나를 따라가 보세요.',
    question: '큰 지도를 보느라 미처 살피지 못했던, 오늘 눈앞의 가장 선명한 발자국 신호는 무엇인가요?',
  },
  {
    sign: '춤(Chum · 언제든 접고 펼 수 있는 가벼운 쉼터)',
    insight: '무거운 집착을 쌓아 두지 않고 변화에 맞춰 유연하게 자리를 옮길 수 있는 가벼움이 힘임',
    tone: '자작나무 껍질 천막 안에서 모닥불을 쬐며 차를 끓이는 평온한 밤',
    ritual: '오늘 꼭 붙잡고 있지 않아도 되는 불필요한 짐 한 가지를 가볍게 접어 내려놓아 보세요.',
    question: '지금 내가 무겁게 끌어안고 있는 방식 대신, 가볍고 유연하게 자리를 옮길 수 있는 선택지는 무엇일까요?',
  },
  {
    sign: '니마트(Nimāt · 사냥한 것을 먼저 이웃과 나누는 규칙)',
    insight: '오늘 얻은 작은 성취나 행운을 나 혼자 독점하지 않고 나눌 때 공동체가 함께 살아남음',
    tone: '긴 겨울을 함께 버텨 내며 따뜻한 수프를 나누는 타이가의 유목민들',
    ritual: '오늘 얻은 작은 배움이나 여력 한 가지를 곁에 있는 사람에게 먼저 따뜻하게 건네 보세요.',
    question: '혼자 움켜쥐고 있을 때보다 곁과 나누었을 때 오히려 더 크게 살아나는 내 자원은 무엇인가요?',
  },
  {
    sign: '이케엔(Ikeen · 계절의 부름을 따라 움직이는 순응)',
    insight: '고집스럽게 한 계절에 머무르기보다 바람과 물이 바뀌는 때를 알아차리고 발걸음을 뗌',
    tone: '얼었던 시베리아 강물이 녹아내리며 다시 흐르기 시작하는 봄의 소리',
    ritual: '이미 지나간 방식에 머물러 있지 말고, 지금 바뀐 바람의 방향에 맞춰 작은 일정 하나를 조정해 보세요.',
    question: '계절과 흐름이 이미 바뀌었는데도 습관처럼 붙들고 있던 어제의 기준은 무엇인가요?',
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

const EVENKI_SHADOWS = [
  '주변 환경과 조화를 맞추려다 정작 내가 지켜야 할 핵심 목표의 방향까지 흐려지지 않게 살피세요.',
  '눈앞의 작은 흔적만 쫓다가 전체 여정의 큰 방향과 체력 안배를 놓치지 않도록 점검하세요.',
  '가볍게 자리를 옮기는 유연함이 막상 끝까지 버텨야 할 자리에서 쉽게 떠나는 습관이 되지 않게 하세요.',
  '곁과 나누는 마음에 앞서 정작 오늘 내가 먼저 채워야 할 기본 휴식과 여력을 비우지 마세요.',
  '바뀐 바람을 따르느라 아직 충분히 익지 않은 시도까지 성급히 접어 버리지 않도록 주의하세요.',
];

const TOPIC_BALANCE_HINTS: Record<EvenkiBugaResult['questionTopic'], string> = {
  '신호·관찰': '눈밭의 순록 발자국처럼 눈앞의 단서를 세심히 살피되, 전체 여정의 큰 방향도 함께 확인하세요.',
  '유연·비움': '언제든 접고 펴는 춤(Chum)처럼 불필요한 짐은 덜어 내되, 지켜야 할 핵심 자리는 가볍게 남기세요.',
  '나눔·순응': '니마트 규칙처럼 여력을 곁과 따뜻하게 나누되, 먼저 내 기본 휴식과 체력도 비우지 마세요.',
  '길잡이 전반': '이케엔의 계절 감각처럼 바뀐 바람을 읽되, 익어 가는 시도는 성급히 접지 말고 호흡을 맞추세요.',
};

function classifyEvenkiTopic(q: string): EvenkiBugaResult['questionTopic'] {
  if (/신호|관찰|발자국|단서|길/.test(q)) return '신호·관찰';
  if (/유연|비움|가볍|짐|이동/.test(q)) return '유연·비움';
  if (/나눔|순응|계절|관계|사람/.test(q)) return '나눔·순응';
  return '길잡이 전반';
}

export function calculateEvenkiBugaTaigaPath(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): EvenkiBugaResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyEvenkiTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SIGNS.length - 1));
  const picked = SIGNS[idx];
  const companion = SIGNS[(idx + companionOffset) % SIGNS.length];
  const taigaTrailAxis = `${picked.sign.split('(')[0].trim()} ↔ ${companion.sign.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = EVENKI_SHADOWS[idx];

  const calculatedAtKst = formatKstIso(now);
  const evenkiCrossAxis = `[${picked.sign.split('(')[0].trim()}] × [${companion.sign.split('(')[0].trim()}] × [${questionTopic}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-EVENKI-BUGA-v2.5.0',
    calculatedAtKst,
    questionTopic,
    taigaSign: picked.sign,
    companionSign: companion.sign,
    taigaTrailAxis,
    evenkiCrossAxis,
    topicBalanceHint,
    bugaInsight: picked.insight,
    siberianTone: picked.tone,
    reflectionFocus: `시베리아 에벤키 지혜의 '${picked.sign}'과 동반 결 '${companion.sign}'을 함께 헤아리며, 무거운 집착을 덜어내고 눈앞의 작은 신호를 세심히 읽어 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '시베리아 에벤키(Evenki)의 부가(Buga) 자연 공존·니마트(Nimāt) 나눔 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatEvenkiBugaPrompt(res: EvenkiBugaResult): string {
  return [
    `[에벤키 부가·타이가 길잡이 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 타이가 길 축: ${res.taigaTrailAxis}`,
    `- 4중 교차 축: ${res.evenkiCrossAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 타이가 상징: ${res.taigaSign} (${res.siberianTone})`,
    `- 동반 상징: ${res.companionSign}`,
    `- 중심 통찰: ${res.bugaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
