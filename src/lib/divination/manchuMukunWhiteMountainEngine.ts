import type { UserProfile } from '../sharedState';

export interface ManchuMukunResult {
  engineVersion: string;
  calculatedAtKst: string;
  mukunPrinciple: string;
  whiteMountainInsight: string;
  heilongjiangTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  { principle: '무쿤(Mukūn · 뿌리를 함께 기억하는 느슨하지만 단단한 연대)', insight: '각자의 자리에서 바쁘게 움직여도 위급할 때 서로의 등 뒤를 지켜주는 신뢰가 있음', tone: '백두산 천지의 맑은 물이 흘러내려 장백의 자작나무 숲을 적시는 고요한 흐름' },
  { principle: '바투루(Baturu · 조용하지만 물러서지 않는 실행력)', insight: '큰 소리로 자랑하지 않아도 막상 맡은 일 앞에서는 흔들림 없이 해내는 담담한 기개', tone: '흑룡강(사할랸 울라)의 묵직하고 유유한 물결 위를 지나는 이른 아침의 배' },
  { principle: '니루(Niru · 화살 하나씩 모아야 한 다발이 되는 질서)', insight: '거창한 계획보다 오늘 내 몫의 작은 화살 하나를 곧게 깎는 정성이 전체를 지탱함', tone: '눈 덮인 침엽수림 사이로 곧게 뻗어 있는 사냥꾼의 고요한 발자국' },
  { principle: '우라(Ula · 긴 강물처럼 서두르지 않고 멀리 가는 인내)', insight: '당장 눈앞의 작은 승부에 일희일비하지 않고 계절을 건너는 긴 호흡으로 마음을 둠', tone: '초가을 단풍이 물든 송화강 기슭의 선선하고 맑은 바람' },
  { principle: '도로(Doro · 예의와 절도 속에서 지켜지는 품위)', insight: '가까운 사이일수록 선을 지키고 공경할 줄 알 때 관계가 오래도록 상하지 않음', tone: '겨울밤 따뜻한 온돌방에서 차를 나누며 나지막이 이야기를 잇는 자리' },
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

export function calculateManchuMukunWhiteMountain(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ManchuMukunResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];

  return {
    engineVersion: 'LUCKEY-MANCHU-MUKUN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    mukunPrinciple: picked.principle,
    whiteMountainInsight: picked.insight,
    heilongjiangTone: picked.tone,
    reflectionFocus: `만주 무쿤 지혜의 '${picked.principle}'처럼, 요란한 말 대신 오늘 내 몫의 작은 한 걸음을 곧고 묵직하게 깎아 보세요.`,
    ritualAction: '오늘 미루어 두었던 일 중 가장 기본적인 한 가지를 조용히, 끝까지 매듭지어 보세요.',
    reflectiveQuestion: '지금 내가 요란하게 겉을 꾸미느라 놓치고 있는, 묵직하고 곧은 내 몫의 한 걸음은 무엇인가요?',
    interpretiveBoundary: '만주·여진의 무쿤(Mukūn) 연대와 우라(Ula) 긴 호흡의 질서를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatManchuMukunPrompt(res: ManchuMukunResult): string {
  return [
    `[만주 무쿤·흰산 검은강 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 지혜 축: ${res.mukunPrinciple} (${res.heilongjiangTone})`,
    `- 중심 통찰: ${res.whiteMountainInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
