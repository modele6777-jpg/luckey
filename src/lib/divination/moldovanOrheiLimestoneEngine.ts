import type { UserProfile } from '../sharedState';

export interface MoldovanOrheiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관조·여유' | '우회·호흡' | '감정·완충' | '축적·내공' | '오르헤이 전반';
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  limestoneCanyonAxis: string;
  ritualAction: string;
  shadowWarning: string;
  topicBalanceHint: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function getKstTimeString(date: Date): string {
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

const MOLDOVAN_MOTIFS = [
  '몰도바 오르헤이 베키(Orheiul Vechi)의 석회암 절벽 수도원처럼 바깥 소음을 바위 안쪽으로 들이지 않고 고요한 동굴 창으로 강물만 바라보는 관조',
  '라우트 강(Răut)이 석회암 협곡을 따라 천천히 원을 그리며 돌아 흐르듯 급히 꺾기보다 긴 곡선으로 길을 내는 호흡',
  '두꺼운 석회암 벽이 여름의 열기와 겨울의 한기를 모두 완충하듯 감정의 급격한 출렁임을 중간 온도에서 가라앉히는 중심',
  '오래된 목조 종탑과 바위 기도실이 나란히 서 있듯 눈에 보이는 일상과 보이지 않는 내면의 시간을 함께 돌보는 균형',
  '석회암 지층이 오랜 물의 흐름 속에서 단단히 굳어지듯 작은 경험 하나를 성급히 버리지 않고 차곡차곡 쌓는 내공'
];

const MOLDOVAN_ACTIONS = [
  '시끄러운 알림이나 주변의 재촉에서 15분만 떨어져 바위 창 너머 강물을 보듯 마음을 비워 보세요.',
  '당장 직선으로 돌파하려 애쓰기보다 라우트 강의 굽이처럼 한 박자 돌아가는 우회로를 허용해 보세요.',
  '오늘 겪은 일 중 가장 흔들렸던 순간 하나만 차분한 문장으로 정리해 내면의 온도를 낮춰 보세요.'
];

const MOLDOVAN_QUESTIONS = [
  '지금 내 마음의 석회암 창 너머로 가장 천천히 흐르게 두고 싶은 일은 무엇인가요?',
  '직선으로 돌파하기보다 라우트 강의 굽이처럼 한 박자 돌아가면 오히려 덜 소모되는 길은 어디인가요?',
  '외부의 열기와 한기를 완충해 주는 두꺼운 석회암 벽처럼 오늘 내 감정의 온도를 지켜 줄 기준은 무엇인가요?',
  '눈에 보이는 분주함과 보이지 않는 내면의 시간 사이에서 오늘 균형을 맞추고 싶은 자리는 어디인가요?',
  '성급히 버리지 않고 오랜 물의 흐름처럼 차곡차곡 쌓아 두면 나중에 든든한 지층이 될 경험은 무엇인가요?',
];

const MOLDOVAN_SHADOWS = [
  '바위 안쪽의 고요한 관조가 지나쳐, 지금 직접 나서서 손대야 할 현실의 작은 매듭까지 바깥일처럼 멀리 두지 않도록 살피세요.',
  '라우트 강처럼 천천히 돌아가는 호흡이 직선으로 건너도 되는 짧은 다리 앞에서까지 불필요한 우회를 만들지는 않게 하세요.',
  '감정의 열기와 한기를 완충하는 중립 온도가 꼭 표현해야 할 진심이나 분명한 거절까지 무덤덤하게 덮어 버리지 않도록 주의하세요.',
  '눈에 보이지 않는 내면의 시간을 챙기는 일이 당장 오늘 마감해야 할 손에 잡히는 약속과 충돌하지 않게 균형을 잡으세요.',
  '오랜 지층처럼 차곡차곡 쌓아 두는 신중함이 이미 꺼내 써도 될 만큼 익은 시도를 계속 뒤로 미루는 핑계가 되지 않게 하세요.',
];

function classifyMoldovanTopic(q: string): MoldovanOrheiResult['questionTopic'] {
  if (/고요|관조|소음|여유|비우/.test(q)) return '관조·여유';
  if (/곡선|우회|호흡|천천히|돌아/.test(q)) return '우회·호흡';
  if (/감정|온도|흔들|완충|중심/.test(q)) return '감정·완충';
  if (/내공|축적|쌓|경험/.test(q)) return '축적·내공';
  return '오르헤이 전반';
}

const MOLDOVAN_TOPIC_HINTS: Record<MoldovanOrheiResult['questionTopic'], string> = {
  '관조·여유': '바위 창 너머로 물러서서 보되 지금 손대야 할 현실 매듭 하나는 남겨 두지 마세요.',
  '우회·호흡': '강물처럼 돌아가는 여유와 함께 꼭 건너야 할 다리의 시점은 놓치지 마세요.',
  '감정·완충': '감정을 고르게 가라앉히되 필요한 진심과 경계는 분명히 말하세요.',
  '축적·내공': '차곡차곡 쌓인 경험이 충분히 익었다면 이제 작은 실천 하나로 꺼내 써 보세요.',
  '오르헤이 전반': '석회암의 고요한 중심과 라우트 강의 유연한 굽이를 오늘의 호흡에 담아 보세요.',
};

export function calculateMoldovanOrheiLimestone(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MoldovanOrheiResult {
  const { profile, now = new Date(), question = '' } = params;
  const q = question.trim();
  const questionTopic = classifyMoldovanTopic(q);
  const seed = `${JSON.stringify(profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const idx = hash % MOLDOVAN_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOLDOVAN_MOTIFS.length - 1));
  const motif = MOLDOVAN_MOTIFS[idx];
  const companionMotif = MOLDOVAN_MOTIFS[(idx + companionOffset) % MOLDOVAN_MOTIFS.length];
  const limestoneCanyonAxis = `${motif.slice(0, 14)}… ↔ ${companionMotif.slice(0, 14)}… (${questionTopic})`;
  const ritualAction = MOLDOVAN_ACTIONS[stableHash(`${seed}|action`) % MOLDOVAN_ACTIONS.length];
  const reflectiveQuestion = MOLDOVAN_QUESTIONS[idx];
  const topicBalanceHint = MOLDOVAN_TOPIC_HINTS[questionTopic];

  return {
    engineVersion: 'LUCKEY-MOLDOVAN-ORHEI-v2.4.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    reflectionFocus: q
      ? `질문 "${q}" 속에서 바위 절벽의 고요와 강물의 곡선을 함께 살피는 몰도바 오르헤이 관점`
      : '석회암 절벽 안에서 강물의 굽이를 조용히 바라보는 몰도바 오르헤이 수도원 관점',
    symbolicMotif: motif,
    companionMotif,
    limestoneCanyonAxis,
    ritualAction,
    shadowWarning: MOLDOVAN_SHADOWS[idx],
    topicBalanceHint,
    reflectiveQuestion,
    interpretiveBoundary:
      '몰도바 오르헤이 베키 석회암 수도원 문화의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatMoldovanOrheiPrompt(result: MoldovanOrheiResult): string {
  return [
    `[몰도바·오르헤이 석회암 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 석회암 협곡 축: ${result.limestoneCanyonAxis}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 맥락 균형 조언: ${result.topicBalanceHint}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
