import type { UserProfile } from '../sharedState';

export interface CorsicanPaghjellaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계·화음' | '일·성실' | '균형·기준' | '울림 전반';
  corsicanVoice: string;
  companionVoice: string;
  paghjellaAxis: string;
  corsicanCrossAxis: string;
  topicBalanceHint: string;
  paghjellaInsight: string;
  maquisTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const VOICES = [
  {
    voice: '세콘다(Seconda · 멜로디를 여는 첫 번째 목소리)',
    insight: '누군가의 눈치를 보며 기다리기보다 먼저 내 진심의 첫 음을 조용히 띄워 올리는 용기',
    tone: '코르시카 밤나무 숲 산길에서 울려 퍼지는 맑고 담담한 첫 목소리',
    ritual: '오늘 망설이던 대화나 제안에서 상대의 눈치를 보기 전에 내 진심 한 문장을 먼저 건네 보세요.',
    question: '지금 내 삶에서 먼저 첫 음을 띄워 올려야 하는데 망설이고 있는 진심은 무엇인가요?',
  },
  {
    voice: '바수(Bassu · 바닥을 받치는 깊고 묵직한 저음)',
    insight: '화려하게 튀지 않아도 전체 화음이 무너지지 않도록 중심을 잡아주는 든든한 성실함',
    tone: '화강암 절벽 아래 지중해 깊은 바다의 잔잔한 울림',
    ritual: '오늘 주변 사람과의 대화에서 내가 먼저 말하기보다 상대를 든든히 받쳐 주는 경청의 자리를 맡아 보세요.',
    question: '지금 내 삶이라는 합창에서 내가 너무 크게 부르거나 혹은 너무 작게 숨기고 있는 파트는 무엇인가요?',
  },
  {
    voice: '테르차(Terza · 위를 감싸며 화음을 완성하는 고음)',
    insight: '이미 있는 조건 위에 작은 배려와 재치를 얹어 분위기를 부드럽게 밝히는 감각',
    tone: '마키(Maquis) 관목 숲을 스쳐 지나가는 향긋한 허브 바람',
    ritual: '오늘 이미 정해진 일과나 대화에 고마움이나 부드러운 인사 한 마디를 얹어 분위기를 환기해 보세요.',
    question: '있는 그대로의 조건 위에서 내가 가볍게 얹어 줄 수 있는 따뜻한 배려는 무엇인가요?',
  },
  {
    voice: '리블라(Libra · 산과 바다가 맞닿은 능선의 균형)',
    insight: '한쪽으로 치우친 생각을 잠시 내려놓고 서로 다른 두 입장을 함께 품어 보는 시선',
    tone: '눈 덮인 산봉우리와 푸른 만이 한눈에 들어오는 코르시카 고개',
    ritual: '오늘 의견이 갈리는 문제가 생기면 한쪽을 고르기 전에 양쪽이 바라는 핵심을 한 줄씩 나란히 적어 보세요.',
    question: '내가 어느 한쪽에만 무게를 실어 놓느라 놓치고 있는 균형의 지점은 어디인가요?',
  },
  {
    voice: '마키(Maquis)의 질긴 뿌리 · 꺾이지 않는 고요한 자존감',
    insight: '거친 바닷바람에도 뿌리를 깊게 내린 관목처럼 나만의 고요한 기준을 지키는 힘',
    tone: '오후 햇살 아래 은은한 소나무와 미르틀 향기가 퍼지는 돌길',
    ritual: '오늘 외부 일정에 휩쓸리기 전에 나만의 고유한 리듬과 경계선 하나를 조용히 지켜 내 보세요.',
    question: '거친 바람 속에서도 뿌리째 흔들리지 않기 위해 내가 지켜야 할 나만의 기준은 무엇인가요?',
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

const CORSICAN_SHADOWS = [
  '첫 음을 띄워 올리느라 정작 함께 노래하는 상대의 호흡과 반응이 들어올 틈을 놓치지 마세요.',
  '묵묵히 바닥을 받치는 역할에만 머무르다 내가 꼭 내야 할 본인의 목소리마저 삼키지 않도록 살피세요.',
  '분위기를 부드럽게 밝히려는 배려가 내 진짜 기준과 필요한 거절까지 흐리지 않게 주의하세요.',
  '양쪽 입장을 고루 품으려다 정작 지금 내 편에서 결단해야 할 우선순위가 늦어지지 않게 하세요.',
  '나만의 기준을 지킨다는 이유로 외부에서 들어오는 건설적인 화음까지 차단하지 않도록 유의하세요.',
];

const TOPIC_BALANCE_HINTS: Record<CorsicanPaghjellaResult['questionTopic'], string> = {
  '관계·화음': '내 목소리를 선명하게 내되 상대의 성부가 들어올 여백을 남겨 둘 때 비로소 화음이 완성됩니다.',
  '일·성실': '모든 성부를 혼자 부르기보다 지금 내 자리에서 맡은 한 음을 정확하고 맑게 지탱하세요.',
  '균형·기준': '마키 관목의 뿌리처럼 고유한 기준을 지키면서도 산과 바다가 만나는 능선의 유연함을 잃지 마세요.',
  '울림 전반': '혼자 크게 외치기보다 서로의 호흡을 듣는 자리에서 오래 남는 울림이 만들어집니다.',
};

function classifyCorsicanTopic(q: string): CorsicanPaghjellaResult['questionTopic'] {
  if (/관계|대화|화음|배려|사람|사랑/.test(q)) return '관계·화음';
  if (/일|직장|성실|음|자리|역할/.test(q)) return '일·성실';
  if (/균형|기준|경계|선택|고민/.test(q)) return '균형·기준';
  return '울림 전반';
}

export function calculateCorsicanPaghjellaMaquisHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CorsicanPaghjellaResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyCorsicanTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % VOICES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (VOICES.length - 1));
  const picked = VOICES[idx];
  const companion = VOICES[(idx + companionOffset) % VOICES.length];
  const paghjellaAxis = `${picked.voice.split('(')[0].trim()} ↔ ${companion.voice.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = CORSICAN_SHADOWS[idx];

  const calculatedAtKst = formatKstIso(now);
  const corsicanCrossAxis = `[${picked.voice.split('(')[0].trim()}] × [${companion.voice.split('(')[0].trim()}] × [${questionTopic}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-CORSICAN-PAGHJELLA-v2.5.0',
    calculatedAtKst,
    questionTopic,
    corsicanVoice: picked.voice,
    companionVoice: companion.voice,
    paghjellaAxis,
    corsicanCrossAxis,
    topicBalanceHint,
    paghjellaInsight: picked.insight,
    maquisTone: picked.tone,
    reflectionFocus: `코르시카 파겔라 다성 합창의 '${picked.voice}'와 동반 성부 '${companion.voice}'가 어우러지듯, 모든 일을 나 혼자 다 해내려 하기보다 지금 내 자리의 한 음을 정확하고 맑게 내는 데 집중해 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '지중해 코르시카(Corsica) 파겔라 다성 합창과 마키(Maquis) 산길 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCorsicanPaghjellaPrompt(res: CorsicanPaghjellaResult): string {
  return [
    `[코르시카 파겔라·마키 화음 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 합창 축: ${res.paghjellaAxis}`,
    `- 4중 교차 축: ${res.corsicanCrossAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 합창 성부: ${res.corsicanVoice} (${res.maquisTone})`,
    `- 동반 성부: ${res.companionVoice}`,
    `- 중심 통찰: ${res.paghjellaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
