import type { UserProfile } from '../sharedState';

export interface MinangkabauGadangResult {
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

const MINANGKABAU_MOTIFS = [
  '수마트라 미낭카바우의 루마 가당(Rumah Gadang) 물소 뿔 모양 지붕(Gonjong)처럼 하늘을 향해 힘차게 솟으면서도 양끝이 대칭을 이루는 품격',
  '못을 하나도 쓰지 않고 나무 홈을 맞물려 세우는 전통 목조 결합처럼 억지 강요 대신 서로의 결이 맞물리는 협력의 구조',
  '자연의 이치를 스승으로 삼는다(Alam takambang jadi guru)는 미낭카바우 격언처럼 지금 눈앞의 작은 변화에서도 배울 점을 찾는 열린 시선',
  '함께 둘러앉아 합의에 이르는 무샤와라(Musyawarah)처럼 한 사람의 독단보다 여러 목소리의 온도를 조율해 가는 지혜',
  '곡식 창고 랑키앙(Rangkiang)에 넉넉함을 따로 비축해 두듯 오늘의 에너지를 다 쓰지 않고 내일을 위해 조금 남겨 두는 여유'
];

const MINANGKABAU_ACTIONS = [
  '높이 솟는 목표만큼 반대편의 균형도 함께 챙기며 오늘 하루의 좌우 대칭을 맞춰 보세요.',
  '혼자 힘으로 밀어붙이기보다, 홈이 맞물리듯 자연스럽게 맞출 수 있는 주변의 호흡을 먼저 찾아보세요.',
  '오늘 마주친 사소한 불편에서도 "자연이 가르쳐 주는 신호"가 무엇인지 한 번만 부드럽게 물어보세요.',
  '결정을 내리기 전에 관련 있는 사람들의 온도부터 한 번씩 들어 보고 조율할 지점을 찾아보세요.',
  '하루의 에너지 10%는 내일을 위한 곡식 창고처럼 아껴 두고 일찍 마무리해 보세요.'
];

const MINANGKABAU_QUESTIONS = [
  '위로만 힘차게 솟으려 하다가 양끝의 대칭과 균형을 놓치고 있던 자리는 어디인가요?',
  '지금 억지로 못질하려 하기보다 자연스럽게 홈을 맞출 수 있는 관계나 일은 무엇인가요?',
  '오늘 내 눈앞에 나타난 작은 변화가 내게 스승처럼 건네는 힌트는 무엇인가요?',
  '혼자 결론을 내리기보다 둥글게 둘러앉아 온도를 맞춰 볼 이야기는 무엇인가요?',
  '내일의 나를 위해 다 쓰지 않고 랑키앙 창고에 따로 남겨 둘 에너지와 시간은 무엇인가요?'
];

export function calculateMinangkabauRumahGadang(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MinangkabauGadangResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % MINANGKABAU_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MINANGKABAU_MOTIFS.length - 1));

  const motif = MINANGKABAU_MOTIFS[idx];
  const companionMotif = MINANGKABAU_MOTIFS[(idx + companionOffset) % MINANGKABAU_MOTIFS.length];
  const ritualAction = MINANGKABAU_ACTIONS[idx];
  const reflectiveQuestion = MINANGKABAU_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-MINANGKABAU-GADANG-v2.2.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 못 없이 맞물리는 조화와 여유를 살피는 미낭카바우 뿔지붕 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '자연의 결을 스승으로 삼아 못 없이 맞물리는 미낭카바우 루마 가당 관점',
    symbolicMotif: motif,
    companionMotif,
    ritualAction,
    reflectiveQuestion,
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
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
