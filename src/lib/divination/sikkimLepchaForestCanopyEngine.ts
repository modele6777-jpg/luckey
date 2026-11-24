import type { UserProfile } from '../sharedState';

export type SikkimQuestionTopic = 'relation' | 'work' | 'emotion' | 'decision' | 'general';

export interface SikkimLepchaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: SikkimQuestionTopic;
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  bambooBridgeAxis: string;
  shadowWarning: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function classifySikkimTopic(q: string): SikkimQuestionTopic {
  if (/관계|사람|가족|연애|친구|소통/.test(q)) return 'relation';
  if (/일|직장|진로|사업|돈|공부/.test(q)) return 'work';
  if (/마음|감정|불안|우울|지침|피곤/.test(q)) return 'emotion';
  if (/선택|결정|방향|건너|균형/.test(q)) return 'decision';
  return 'general';
}

const SIKKIM_SHADOW_WARNINGS: Record<SikkimQuestionTopic, string> = {
  relation: '유연하게 맞춘다는 명분으로 본인의 경계까지 무한정 양보하면 대나무 다리처럼 한쪽 밧줄이 먼저 닳을 수 있습니다.',
  work: '안개 속 호흡을 고르는 것과 결정을 한없이 미루는 것은 다릅니다. 작은 구간부터 한 걸음씩 건너세요.',
  emotion: '감정을 흘려보내려다 아예 덮어두면 계곡 밑바닥에 습기가 찹니다. 가벼운 언어 하나쯤은 남겨 두세요.',
  decision: '양쪽을 다 품으려다 정작 디딜 발판을 고르지 못할 수 있습니다. 오늘은 가장 탄탄한 대나무 마디 하나만 택하세요.',
  general: '균형을 맞추려 애쓰느라 오히려 어깨에 힘이 들어갈 수 있으니, 한 박자 느슨한 여백을 남겨 두세요.',
};

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

const SIKKIM_MOTIFS = [
  {
    motif: '히말라야 시킴 숲의 레프차(Lepcha) 대나무 다리처럼 계곡 양쪽의 바위와 나무에 유연하게 기대어 무게를 나누는 탄성',
    action: '모든 것을 완벽히 통제하려 하기보다 대나무 다리처럼 조금 휘어지며 충격을 흘려보내 보세요.',
    question: '지금 부러지지 않기 위해 조금 휘어지는 편이 나은 마음의 기준은 무엇인가요?',
  },
  {
    motif: '칸첸중가(Kangchenjunga) 산자락을 감싸는 구름처럼 정상까지 한 번에 오르려 하지 않고 숲의 층위마다 머무는 숨 고르기',
    action: '한 번에 끝까지 오르려 애쓰기보다 오늘 지나가는 층위 하나에서 숨을 고르는 시간을 먼저 잡아 보세요.',
    question: '정상만 바라보며 숨을 헐떡이기보다 지금 발 디딘 숲의 높이에서 충분히 음미할 수 있는 풍경은 무엇인가요?',
  },
  {
    motif: '계곡의 야생 난초와 양치식물이 햇빛을 독차지하지 않고 겹겹의 그늘 속에서 함께 피어나는 공존의 질서',
    action: '모든 빛을 혼자 받으려 하기보다 오늘 주변과 역할이나 공을 자연스럽게 나누는 선택을 해 보세요.',
    question: '햇빛을 독차지하려는 조급함을 내려놓을 때 오히려 더 조화롭게 자라날 내 안의 영역은 어디인가요?',
  },
  {
    motif: '대나무 통에 물을 담아 나르듯 필요한 만큼만 가볍게 덜어 내어 발걸음을 무겁게 만들지 않는 지혜',
    action: '오늘 들고 갈 마음의 짐을 대나무 통 하나 분량으로만 줄이고 나머지는 잠시 내려두세요.',
    question: '지금 내 발걸음을 무겁게 만들고 있지만 사실은 한 번에 다 나를 필요가 없는 걱정은 무엇인가요?',
  },
  {
    motif: '안개가 낀 숲길에서도 새소리와 물소리로 길을 분간하듯 눈에 보이는 성과 너머의 리듬을 듣는 감각',
    action: '당장 앞이 흐려 보일 때는 조급히 속도를 내지 말고 주변의 작은 신호 하나만 차분히 들어 보세요.',
    question: '눈앞의 안개 때문에 결과가 바로 보이지 않을 때, 내가 귀 기울여야 할 작은 삶의 리듬은 무엇인가요?',
  },
];

export function calculateSikkimLepchaForest(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SikkimLepchaResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const idx = hash % SIKKIM_MOTIFS.length;
  const picked = SIKKIM_MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SIKKIM_MOTIFS.length - 1));
  const companion = SIKKIM_MOTIFS[(idx + companionOffset) % SIKKIM_MOTIFS.length];

  const trimmedQ = question.trim();
  const questionTopic = classifySikkimTopic(trimmedQ);
  const bambooBridgeAxis = `${picked.motif.slice(0, 26)}… ↔ ${companion.motif.slice(0, 22)}…`;

  return {
    engineVersion: 'LUCKEY-SIKKIM-LEPCHA-v2.3.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    reflectionFocus: trimmedQ
      ? `질문 "${trimmedQ}" (${questionTopic}) 속에서 주 모티프와 '${companion.motif.slice(0, 22)}…'의 결을 함께 살피는 시킴 레프차 관점`
      : '안개 낀 히말라야 숲에서 대나무 다리 탄성과 숲의 호흡을 교차해 건너는 시킴 레프차 관점',
    symbolicMotif: picked.motif,
    companionMotif: companion.motif,
    bambooBridgeAxis,
    shadowWarning: SIKKIM_SHADOW_WARNINGS[questionTopic],
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary:
      '히말라야 시킴 레프차 숲 문화의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatSikkimLepchaPrompt(result: SikkimLepchaResult): string {
  return [
    `[시킴·레프차 숲 관점 (${result.engineVersion}) | 질문 맥락: ${result.questionTopic}]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 대나무 다리 탄성 축: ${result.bambooBridgeAxis}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
