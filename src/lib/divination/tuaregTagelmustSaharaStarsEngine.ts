import type { UserProfile } from '../sharedState';

export interface TuaregSaharaResult {
  engineVersion: string;
  calculatedAtKst: string;
  desertCompass: string;
  tagelmustInsight: string;
  saharaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const COMPASSES = [
  { compass: '타길무스트(Tagelmust · 모래바람을 가리고 숨을 고르는 푸른 베일)', insight: '외부의 거친 자극으로부터 내 마음의 호흡을 먼저 보호해야 먼 사막을 건널 수 있음', tone: '아하가르(Ahaggar) 고원의 붉은 바위산 위로 감도는 깊고 푸른 인디고빛 천' },
  { compass: '아사하르(Assahar · 말보다 태도에서 우러나는 고요한 품위)', insight: '모든 일에 즉각 반응하지 않고 한 박자 여유를 두는 절제가 사람의 격을 지켜 줌', tone: '별빛 아래 조용히 찻잔을 채우며 세 잔의 민트티를 나누는 유목민의 밤' },
  { compass: '아마누스(Amanous · 밤하늘의 북극성을 따라 흔들리지 않는 걸음)', insight: '모래 언덕 모양은 매일 바뀌어도 밤하늘의 기준점은 늘 같은 자리에 있음', tone: '테네레(Ténéré) 광활한 사막 위로 쏟아지는 투명하고 차가운 은하수' },
  { compass: '티피나그(Tifinagh · 바위 위에 간결히 새겨 남기는 길의 표시)', insight: '복잡한 설명보다 꼭 필요한 핵심만 남기는 간결한 소통이 오해를 줄여 줌', tone: '사막 오아시스로 향하는 바위 틈새에 새겨진 오래된 기하학 문자' },
  { compass: '타그마트(Tagmat · 목마른 나그네에게 먼저 물을 건네는 연대)', insight: '척박한 환경일수록 혼자 아끼는 것보다 나누는 쪽이 결국 사막에서 살아남음', tone: '오아시스 대추야자 나무 그늘 아래 흐르는 맑고 시원한 샘물' },
];

function formatKstIso(date: Date): string {
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

export function calculateTuaregTagelmustSaharaStars(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TuaregSaharaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % COMPASSES.length;
  const picked = COMPASSES[idx];

  return {
    engineVersion: 'LUCKEY-TUAREG-SAHARA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    desertCompass: picked.compass,
    tagelmustInsight: picked.insight,
    saharaTone: picked.tone,
    reflectionFocus: `투아레그 사하라 지혜의 '${picked.compass}'처럼, 거친 모래바람 속에서도 내 호흡을 먼저 보호하며 변치 않는 별빛의 기준을 바라보세요.`,
    ritualAction: '오늘 바깥의 시끄러운 자극에 바로 반응하기 전에, 한 호흡 여유를 두고 내 기준에 맞는 말만 간결히 건네 보세요.',
    reflectiveQuestion: '지금 주변의 모래 언덕처럼 매일 바뀌는 조건들 사이에서, 내가 끝까지 바라보고 가야 할 변치 않는 기준점은 무엇인가요?',
    interpretiveBoundary: '사하라 투아레그(Tuareg)의 타길무스트 절제·아사하르(Assahar) 품위 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTuaregSaharaPrompt(res: TuaregSaharaResult): string {
  return [
    `[투아레그 타길무스트·사하라 별자리 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 사막 나침반: ${res.desertCompass} (${res.saharaTone})`,
    `- 중심 통찰: ${res.tagelmustInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
