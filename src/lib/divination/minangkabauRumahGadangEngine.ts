import type { UserProfile } from '../sharedState';

export interface MinangkabauGadangResult {
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

const MINANGKABAU_MOTIFS = [
  '수마트라 미낭카바우의 루마 가당(Rumah Gadang) 물소 뿔 모양 지붕(Gonjong)처럼 하늘을 향해 힘차게 솟으면서도 양끝이 대칭을 이루는 품격',
  '못을 하나도 쓰지 않고 나무 홈을 맞물려 세우는 전통 목조 결합처럼 억지 강요 대신 서로의 결이 맞물리는 협력의 구조',
  '자연의 이치를 스승으로 삼는다(Alam takambang jadi guru)는 미낭카바우 격언처럼 지금 눈앞의 작은 변화에서도 배울 점을 찾는 열린 시선',
  '함께 둘러앉아 합의에 이르는 무샤와라(Musyawarah)처럼 한 사람의 독단보다 여러 목소리의 온도를 조율해 가는 지혜',
  '곡식 창고 랑키앙(Rangkiang)에 넉넉함을 따로 비축해 두듯 오늘의 에너지를 다 쓰지 않고 내일을 위해 조금 남겨 두는 여유'
];

const MINANGKABAU_ACTIONS = [
  '혼자 힘으로 밀어붙이기보다, 홈이 맞물리듯 자연스럽게 맞출 수 있는 주변의 호흡을 먼저 찾아보세요.',
  '오늘 마주친 사소한 불편에서도 "자연이 가르쳐 주는 신호"가 무엇인지 한 번만 부드럽게 물어보세요.',
  '하루의 에너지 10%는 내일을 위한 곡식 창고처럼 아껴 두고 일찍 마무리해 보세요.'
];

export function calculateMinangkabauRumahGadang(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MinangkabauGadangResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const motif = MINANGKABAU_MOTIFS[hash % MINANGKABAU_MOTIFS.length];
  const ritualAction = MINANGKABAU_ACTIONS[Math.floor(hash / 7) % MINANGKABAU_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-MINANGKABAU-GADANG-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 못 없이 맞물리는 조화와 여유를 살피는 미낭카바우 뿔지붕 관점`
      : '자연의 결을 스승으로 삼아 못 없이 맞물리는 미낭카바우 루마 가당 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '지금 억지로 못질하려 하기보다 자연스럽게 홈을 맞출 수 있는 관계나 일은 무엇인가요?',
    interpretiveBoundary:
      '수마트라 미낭카바우 전통 건축과 지혜 격언의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatMinangkabauGadangPrompt(result: MinangkabauGadangResult): string {
  return [
    `[미낭카바우·뿔지붕 조화 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
