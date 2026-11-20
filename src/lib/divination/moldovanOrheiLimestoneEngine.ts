import type { UserProfile } from '../sharedState';

export interface MoldovanOrheiResult {
  engineVersion: string;
  calculatedAtKst: string;
  reflectionFocus: string;
  symbolicMotif: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function getKstTimeString(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
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

export function calculateMoldovanOrheiLimestone(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MoldovanOrheiResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const motif = MOLDOVAN_MOTIFS[hash % MOLDOVAN_MOTIFS.length];
  const ritualAction = MOLDOVAN_ACTIONS[Math.floor(hash / 7) % MOLDOVAN_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-MOLDOVAN-ORHEI-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 바위 절벽의 고요와 강물의 곡선을 살피는 몰도바 오르헤이 관점`
      : '석회암 절벽 안에서 강물의 굽이를 조용히 바라보는 몰도바 오르헤이 수도원 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '지금 내 마음의 석회암 창 너머로 가장 천천히 흐르게 두고 싶은 일은 무엇인가요?',
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
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
