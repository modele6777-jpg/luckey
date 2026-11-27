import type { UserProfile } from '../sharedState';

export type KyrgyzQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface KyrgyzManasResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: KyrgyzQuestionTopic;
  epicChapter: string;
  companionChapter: string;
  nomadInsight: string;
  steppeTone: string;
  steppeBreathAxis: string;
  topicBalanceHint: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CHAPTERS = [
  {
    chapter: '알라토(Ala-Too) 설산의 첫 걸음',
    insight: '거대한 목표 앞에서 주저앉지 않고 오늘 넘을 작은 고개 하나에만 집중하는 용기',
    tone: '천산산맥 눈봉우리의 맑은 바람',
    ritual: '오늘 해야 할 일 중 가장 미뤄 두었던 한 가지를 딱 10분만 손대어 시작해 보세요.',
    question: '지금 나를 망설이게 하는 큰 산 앞에서, 오늘 내가 실제로 디딜 수 있는 첫 발걸음은 무엇인가요?',
  },
  {
    chapter: '보즈 위(Boz Üy) 유르트의 둥근 천창(Tündük)',
    insight: '사방이 트인 초원에서도 중심 기둥을 잃지 않고 내 마음의 안식처를 세우는 힘',
    tone: '유르트 천창으로 들어오는 아침 빛',
    ritual: '주변이 분주할수록 오늘 나만의 중심 기둥이 되어 줄 고정 루틴 한 가지를 지켜 보세요.',
    question: '사방이 트인 변화 속에서도 내 마음의 툰뒤크(천창)처럼 중심을 잡아 주는 기준은 무엇인가요?',
  },
  {
    chapter: '마나스치(Manaschi)의 길고 꾸준한 호흡',
    insight: '단거리 전력 질주보다 내 호흡과 이야기를 끝까지 이어 가는 리듬의 지혜',
    tone: '밤 모닥불 앞 구연가의 낮고 깊은 목소리',
    ritual: '오늘 속도를 내느라 숨이 찰 때면 잠시 멈추고, 내 호흡으로 끝까지 갈 수 있는 속도로 다시 맞춰 보세요.',
    question: '단거리 전력 질주 대신 마나스치의 긴 호흡처럼 꾸준히 이어 가야 오래 빛날 일은 무엇인가요?',
  },
  {
    chapter: '초르(Choor) 피리의 맑은 결속',
    insight: '혼자 버티려 애쓰기보다 내 곁의 동료와 진심을 맞추어 부르는 화음',
    tone: '이식쿨 호수 위로 번지는 잔잔한 선율',
    ritual: '혼자 끙끙대던 일 하나를 믿을 만한 동료나 가족에게 솔직하게 공유해 보세요.',
    question: '혼자 버티려 애쓰기보다 곁의 사람과 진심을 맞춰 화음을 내면 훨씬 수월해질 일은 무엇인가요?',
  },
  {
    chapter: '초원의 넓은 길(Jol) 선택',
    insight: '좁은 골목에서 부딪히기보다 시야를 열어 더 넓은 우회로를 찾는 유연함',
    tone: '끝없이 펼쳐진 초원의 지평선',
    ritual: '막다른 길처럼 보이는 문제 앞에서 오늘 다른 선택지 2가지를 가볍게 종이에 적어 보세요.',
    question: '좁은 골목에서 정면으로 부딪히기보다, 초원의 지평선처럼 시야를 넓히면 보이는 우회로는 어디인가요?',
  },
];

const TOPIC_BALANCE_HINTS: Record<KyrgyzQuestionTopic, string> = {
  career: '일에서는 거창한 완주 선언보다 오늘 넘을 작은 고개 하나를 10분 안에 여는 실행력이 흐름을 바꿉니다.',
  relationship: '관계에서는 혼자 묵묵히 버티기보다 곁의 사람과 진심을 맞춰 화음을 내는 편이 훨씬 가볍습니다.',
  wealth: '재정 선택에서는 좁은 골목에 몰리기보다 시야를 넓혀 여유 있는 우회로를 먼저 살피는 편이 유리합니다.',
  health: '회복이 필요할 때는 단거리 전력 질주를 멈추고 마나스치의 긴 호흡처럼 일상 리듬을 완만하게 되돌리세요.',
  decision: '망설임이 길어질수록 완벽한 답을 기다리기보다 오늘 몫의 첫 걸음만 당당히 내디뎌 보는 편이 좋습니다.',
  general: '초원의 바람처럼 넓은 시야와 오늘의 작은 실천 한 가지를 함께 쥐면 흔들림이 줄어듭니다.',
};

function classifyKyrgyzTopic(question?: string): KyrgyzQuestionTopic {
  const q = (question ?? '').trim();
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(q)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(q)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(q)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복/.test(q)) return 'health';
  if (/결정|선택|고민|방향|시작|걸음/.test(q)) return 'decision';
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

export function calculateKyrgyzManasOralEpicCourage(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KyrgyzManasResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CHAPTERS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (CHAPTERS.length - 1));
  const picked = CHAPTERS[idx];
  const companion = CHAPTERS[(idx + companionOffset) % CHAPTERS.length];
  const questionTopic = classifyKyrgyzTopic(params.question);
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const steppeBreathAxis = `${picked.chapter.split('(')[0].trim()} ↔ ${companion.chapter.split('(')[0].trim()} 서사 호흡 축`;
  const shadowWarning = `[${picked.chapter.split('(')[0].trim()} 과잉 경계] 단거리 돌파나 고집에만 기대어 호흡의 완급과 동료의 화음을 놓치지 않도록 살피십시오.`;

  return {
    engineVersion: 'LUCKEY-KYRGYZ-MANAS-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    epicChapter: picked.chapter,
    companionChapter: companion.chapter,
    nomadInsight: `${picked.insight} (동반 장면: ${companion.chapter})`,
    steppeTone: picked.tone,
    steppeBreathAxis,
    topicBalanceHint,
    shadowWarning,
    reflectionFocus: `마나스 서사시의 '${picked.chapter}'와 동반 장면 '${companion.chapter}'처럼, 한 번에 다 끝내려 하지 말고 오늘 몫의 걸음만 당당히 내디뎌 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '중앙아시아 키르기스 《마나스》 구전 서사시와 유목 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKyrgyzManasPrompt(res: KyrgyzManasResult): string {
  return [
    `[키르기스 마나스 서사시 용기 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 서사 장면: ${res.epicChapter} (${res.steppeTone})`,
    `- 동반 장면: ${res.companionChapter}`,
    `- 서사 호흡 축: ${res.steppeBreathAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 중심 통찰: ${res.nomadInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
