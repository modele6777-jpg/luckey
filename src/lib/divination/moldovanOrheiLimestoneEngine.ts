import type { UserProfile } from '../sharedState';

export interface MoldovanOrheiResult {
  engineVersion: string;
  calculatedAtKst: string;
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  ritualAction: string;
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

export function calculateMoldovanOrheiLimestone(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MoldovanOrheiResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const idx = hash % MOLDOVAN_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOLDOVAN_MOTIFS.length - 1));
  const motif = MOLDOVAN_MOTIFS[idx];
  const companionMotif = MOLDOVAN_MOTIFS[(idx + companionOffset) % MOLDOVAN_MOTIFS.length];
  const ritualAction = MOLDOVAN_ACTIONS[stableHash(`${seed}|action`) % MOLDOVAN_ACTIONS.length];
  const reflectiveQuestion = MOLDOVAN_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-MOLDOVAN-ORHEI-v2.2.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 바위 절벽의 고요와 강물의 곡선을 함께 살피는 몰도바 오르헤이 관점`
      : '석회암 절벽 안에서 강물의 굽이를 조용히 바라보는 몰도바 오르헤이 수도원 관점',
    symbolicMotif: motif,
    companionMotif,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '몰도바 오르헤이 베키 석회암 수도원 문화의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatMoldovanOrheiPrompt(result: MoldovanOrheiResult): string {
  return [
    `[몰도바·오르헤이 석회암 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
