import type { UserProfile } from '../sharedState';

export interface SiwaOasisResult {
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

const SIWA_MOTIFS = [
  {
    motif: '서부 사막 깊숙한 시와 오아시스(Siwa Oasis)의 소금 호수처럼 몸에 힘을 빼고 누우면 스스로 떠오르게 만드는 부력의 여유',
    action: '지금 억지로 헤엄치려 애쓰기보다 소금 호수에 몸을 맡기듯 힘 하나만 빼 보세요.',
    question: '지금 내가 애써 붙잡고 있지만 사실은 힘을 빼야 저절로 떠오를 일은 무엇인가요?',
  },
  {
    motif: '소금 흙벽돌(Kershef)로 지은 샬리 요새처럼 주변에 흔한 재료로도 사막의 낮과 밤을 버티는 단단한 집을 짓는 실용성',
    action: '멀리서 화려한 재료를 찾기 전에 오늘 내 손안에 이미 있는 작은 자원 하나로 충분한지 살펴보세요.',
    question: '더 완벽한 조건을 기다리느라 멈춰 있기보다, 지금 손에 있는 흔한 재료로 먼저 세울 수 있는 것은 무엇인가요?',
  },
  {
    motif: '대추야자와 올리브 나무 그늘 아래로 지하수가 솟아나는 샘처럼 마른 땅 밑에도 조용히 흐르는 회복의 수맥',
    action: '오늘 바쁜 일정 틈에서 물 한 잔을 천천히 마시며 내 안의 조용한 회복 수맥을 느껴 보세요.',
    question: '겉보기엔 메말라 보이지만, 잠깐 그늘에 앉아 숨을 고르면 다시 솟아오를 내 안의 회복 샘물은 어디인가요?',
  },
  {
    motif: '외부 세계와 먼 거리를 두었기에 고유한 언어와 무늬를 지킨 오아시스처럼 남의 속도에 휩쓸리지 않는 고유함',
    action: '오늘 하루만큼은 남의 기준이나 속도와 비교하는 시선을 끄고 나만의 호흡으로 한 일을 마쳐 보세요.',
    question: '바깥의 소음에서 한 걸음 거리를 둘 때 오히려 더 선명하게 지켜지는 나만의 고유한 리듬은 무엇인가요?',
  },
  {
    motif: '태양 신전이 내려다보는 사막의 저녁 하늘처럼 뜨거운 낮이 지나면 반드시 찾아오는 서늘한 휴식',
    action: '해가 진 뒤 사막이 식듯이, 오늘의 긴장을 저녁 시간에는 완전히 내려놓아 보세요.',
    question: '뜨거운 낮의 분주함이 지난 뒤, 오늘 저녁 내가 스스로에게 허락해야 할 가장 서늘하고 고요한 휴식은 무엇인가요?',
  },
];

export function calculateSiwaOasisSaltSpring(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SiwaOasisResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const idx = hash % SIWA_MOTIFS.length;
  const picked = SIWA_MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SIWA_MOTIFS.length - 1));
  const companion = SIWA_MOTIFS[(idx + companionOffset) % SIWA_MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-SIWA-OASIS-v2.2.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 주 모티프와 '${companion.motif.slice(0, 22)}…'의 결을 함께 곁들여 힘을 빼고 떠오르게 하는 시와 오아시스 소금샘 관점`
      : '사막 한가운데서 부력과 그늘의 교차 균형으로 숨을 고르게 하는 시와 오아시스 소금샘 관점',
    symbolicMotif: picked.motif,
    companionMotif: companion.motif,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary:
      '이집트 시와 오아시스 소금 호수와 전통 건축의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatSiwaOasisPrompt(result: SiwaOasisResult): string {
  return [
    `[시와·오아시스 소금샘 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
