import type { UserProfile } from '../sharedState';

export interface MinangkabauGadangResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계·합의' | '일·구조' | '쉼·여유' | '균형 전반';
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  gonjongBalanceAxis: string;
  topicBalanceHint: string;
  ritualAction: string;
  shadowWarning: string;
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

const MINANGKABAU_SHADOWS = [
  '대칭과 품격에만 신경 쓰다 정작 지금 필요한 솔직한 표현을 삼키지 않도록 경계하세요.',
  '조화와 맞물림을 우선하느라 내 기준이나 속마음을 지나치게 양보하지 않도록 살피세요.',
  '모든 일에서 의미를 찾으려다 사소한 불편까지 과도하게 해석해 피로해지지 마세요.',
  '합의를 기다리느라 이미 결단이 필요한 시점까지 계속 뒤로 미루지 않도록 주의하세요.',
  '여유를 비축하려다 정작 지금 마음껏 써야 할 열정과 호의를 아끼지 않도록 살피세요.'
];

const MINANGKABAU_TOPIC_HINTS: Record<MinangkabauGadangResult['questionTopic'], string> = {
  '관계·합의': '한쪽의 양보로만 맞추지 말고 서로의 온도가 맞물리는 지점을 둥글게 조율해 보세요.',
  '일·구조': '높이 솟는 목표만큼 기반의 대칭을 점검하면 억지 못질 없이도 단단한 구조가 됩니다.',
  '쉼·여유': '오늘의 기운을 끝까지 소진하지 말고 내일을 위한 랑키앙 창고의 몫을 따로 남겨 두세요.',
  '균형 전반': '자연의 이치를 스승 삼아 오늘 마주친 작은 어긋남도 균형을 맞추는 힌트로 삼아 보세요.',
};

function classifyMinangkabauTopic(q: string): MinangkabauGadangResult['questionTopic'] {
  if (/관계|합의|사람|사랑|연애|소통/.test(q)) return '관계·합의';
  if (/일|직장|진로|구조|사업|선택|홈/.test(q)) return '일·구조';
  if (/쉼|여유|휴식|지침|회복|마음/.test(q)) return '쉼·여유';
  return '균형 전반';
}

export function calculateMinangkabauRumahGadang(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MinangkabauGadangResult {
  const { profile, now = new Date(), question = '' } = params;
  const trimmed = question.trim();
  const questionTopic = classifyMinangkabauTopic(trimmed);
  const seed = `${JSON.stringify(profile.fate ?? {})}|${trimmed}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % MINANGKABAU_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MINANGKABAU_MOTIFS.length - 1));

  const motif = MINANGKABAU_MOTIFS[idx];
  const companionMotif = MINANGKABAU_MOTIFS[(idx + companionOffset) % MINANGKABAU_MOTIFS.length];
  const gonjongBalanceAxis = `${motif.slice(0, 18)}… ↔ ${companionMotif.slice(0, 18)}… (${questionTopic})`;
  const topicBalanceHint = MINANGKABAU_TOPIC_HINTS[questionTopic];
  const ritualAction = MINANGKABAU_ACTIONS[idx];
  const shadowWarning = MINANGKABAU_SHADOWS[idx];
  const reflectiveQuestion = MINANGKABAU_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-MINANGKABAU-GADANG-v2.4.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    reflectionFocus: trimmed
      ? `질문 "${trimmed}" 속에서 못 없이 맞물리는 조화와 여유를 살피는 미낭카바우 뿔지붕 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '자연의 결을 스승으로 삼아 못 없이 맞물리는 미낭카바우 루마 가당 관점',
    symbolicMotif: motif,
    companionMotif,
    gonjongBalanceAxis,
    topicBalanceHint,
    ritualAction,
    shadowWarning,
    reflectiveQuestion,
    interpretiveBoundary:
      '수마트라 미낭카바우 전통 건축과 지혜 격언의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatMinangkabauGadangPrompt(result: MinangkabauGadangResult): string {
  return [
    `[미낭카바우·뿔지붕 조화 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 균형 축: ${result.gonjongBalanceAxis}`,
    `- 맥락 균형 조언: ${result.topicBalanceHint}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
