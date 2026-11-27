import type { UserProfile } from '../sharedState';

export interface TuaregSaharaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '호흡·보호' | '품위·여유' | '기준·방향' | '소통·간결' | '연대·나눔' | '투아레그 전반';
  desertCompass: string;
  companionCompass: string;
  tagelmustInsight: string;
  saharaTone: string;
  saharaCompassAxis: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const COMPASSES = [
  {
    compass: '타길무스트(Tagelmust · 모래바람을 가리고 숨을 고르는 푸른 베일)',
    insight: '외부의 거친 자극으로부터 내 마음의 호흡을 먼저 보호해야 먼 사막을 건널 수 있음',
    tone: '아하가르(Ahaggar) 고원의 붉은 바위산 위로 감도는 깊고 푸른 인디고빛 천',
    axis: '외부 자극을 가려 내 호흡을 먼저 지키는 베일 수호의 축',
    shadow: '외부 자극을 가리고 물러서는 데에만 집중하다 정작 필요한 소통과 피드백의 창까지 닫아 버리지 않게 하세요.',
    action: '오늘 바깥의 시끄러운 자극에 바로 반응하기 전에, 한 호흡 여유를 두고 내 기준에 맞는 말만 간결히 건네 보세요.',
    question: '외부의 거친 모래바람을 가리고 오늘 내가 가장 먼저 보호해야 할 내 마음의 호흡은 무엇인가요?',
  },
  {
    compass: '아사하르(Assahar · 말보다 태도에서 우러나는 고요한 품위)',
    insight: '모든 일에 즉각 반응하지 않고 한 박자 여유를 두는 절제가 사람의 격을 지켜 줌',
    tone: '별빛 아래 조용히 찻잔을 채우며 세 잔의 민트티를 나누는 유목민의 밤',
    axis: '즉각 반응을 멈추고 한 박자 절제로 격을 지키는 아사하르 품위의 축',
    shadow: '품위와 침착함을 지키는 태도가 꼭 짚고 넘어가야 할 불편한 쟁점을 에둘러 넘기는 회피로 흐르지 않게 살피세요.',
    action: '급하게 답장하거나 맞받아치고 싶은 순간에 딱 세 호흡만 세며 차분한 태도를 선택해 보세요.',
    question: '즉각 반응하는 대신 한 박자 여유를 두었을 때 더 또렷하게 지켜질 내 태도와 품위는 무엇인가요?',
  },
  {
    compass: '아마누스(Amanous · 밤하늘의 북극성을 따라 흔들리지 않는 걸음)',
    insight: '모래 언덕 모양은 매일 바뀌어도 밤하늘의 기준점은 늘 같은 자리에 있음',
    tone: '테네레(Ténéré) 광활한 사막 위로 쏟아지는 투명하고 차가운 은하수',
    axis: '변하는 지형 위에서도 고정된 별빛을 따라가는 북극성 정향의 축',
    shadow: '먼 북극성 기준만 바라보다 발밑 모래 언덕의 작은 변화와 현실적 여건 조정을 놓치지 않도록 주의하세요.',
    action: '바뀌는 일정이나 상황 속에서도 오늘 내가 흔들리지 않고 지킬 핵심 방향 1가지를 확인해 보세요.',
    question: '지금 주변의 모래 언덕처럼 매일 바뀌는 조건들 사이에서, 내가 끝까지 바라보고 가야 할 변치 않는 기준점은 무엇인가요?',
  },
  {
    compass: '티피나그(Tifinagh · 바위 위에 간결히 새겨 남기는 길의 표시)',
    insight: '복잡한 설명보다 꼭 필요한 핵심만 남기는 간결한 소통이 오해를 줄여 줌',
    tone: '사막 오아시스로 향하는 바위 틈새에 새겨진 오래된 기하학 문자',
    axis: '군더더기를 덜어 내고 핵심 표시만 남기는 간결 소통의 축',
    shadow: '간결하게 줄이는 데에만 치우쳐 상대가 맥락을 이해하는 데 필요한 최소한의 배경 설명까지 생략하지 않게 하세요.',
    action: '오늘 전달할 메시지나 메모 한 건에서 군더더기를 덜어 내고 핵심 한 문장만 또렷이 남겨 보세요.',
    question: '길고 복잡한 설명을 덜어 내고 바위 위의 표시처럼 간결하게 남기면 훨씬 선명해질 소통은 무엇인가요?',
  },
  {
    compass: '타그마트(Tagmat · 목마른 나그네에게 먼저 물을 건네는 연대)',
    insight: '척박한 환경일수록 혼자 아끼는 것보다 나누는 쪽이 결국 사막에서 살아남음',
    tone: '오아시스 대추야자 나무 그늘 아래 흐르는 맑고 시원한 샘물',
    axis: '척박할수록 먼저 물을 건네며 함께 건너는 오아시스 연대의 축',
    shadow: '주변에 먼저 나누고 베푸는 마음이 정작 내 여정의 필수 물자까지 바닥내지 않도록 균형을 잡으세요.',
    action: '오늘 내가 가진 작은 정보나 여유 한 조각을 필요한 주변 사람 한 명에게 먼저 건네 보세요.',
    question: '혼자 움켜쥐기보다 목마른 나그네에게 물을 건네듯 먼저 나누면 나와 함께 살아날 여유는 무엇인가요?',
  },
];

function classifyTuaregTopic(q: string): TuaregSaharaResult['questionTopic'] {
  if (/호흡|보호|자극|바람|가리/.test(q)) return '호흡·보호';
  if (/품위|태도|여유|반응|절제/.test(q)) return '품위·여유';
  if (/기준|방향|별빛|북극성|걸음/.test(q)) return '기준·방향';
  if (/소통|간결|설명|메모|문장/.test(q)) return '소통·간결';
  if (/나눔|연대|함께|정보|물/.test(q)) return '연대·나눔';
  return '투아레그 전반';
}

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

export function calculateTuaregTagelmustSaharaStars(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TuaregSaharaResult {
  const now = params.now ?? new Date();
  const questionText = (params.question ?? '').trim();
  const questionTopic = classifyTuaregTopic(questionText);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${questionText}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % COMPASSES.length;
  const picked = COMPASSES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (COMPASSES.length - 1));
  const companion = COMPASSES[(idx + companionOffset) % COMPASSES.length];

  return {
    engineVersion: 'LUCKEY-TUAREG-SAHARA-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    desertCompass: picked.compass,
    companionCompass: companion.compass,
    tagelmustInsight: picked.insight,
    saharaTone: picked.tone,
    saharaCompassAxis: picked.axis,
    reflectionFocus: `투아레그 사하라 지혜의 '${picked.compass}'을 중심에 두고 '${companion.compass}'의 결을 곁들여, 거친 모래바람 속에서도 내 호흡을 먼저 보호하며 변치 않는 별빛의 기준을 바라보세요.`,
    ritualAction: picked.action,
    shadowWarning: picked.shadow,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '사하라 투아레그(Tuareg)의 타길무스트 절제·아사하르(Assahar) 품위 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTuaregSaharaPrompt(res: TuaregSaharaResult): string {
  return [
    `[투아레그 타길무스트·사하라 별자리 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 사막 나침반: ${res.desertCompass} (${res.saharaTone})`,
    `- 사하라 균형 축: ${res.saharaCompassAxis}`,
    `- 동반 나침반: ${res.companionCompass}`,
    `- 중심 통찰: ${res.tagelmustInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
