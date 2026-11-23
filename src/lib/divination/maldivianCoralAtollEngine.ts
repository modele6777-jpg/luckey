import type { UserProfile } from '../sharedState';

export interface MaldivianAtollResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '경계·보호' | '순환·소통' | '연대·조화' | '산호초 전반';
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  atollCurrentAxis: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function getKstTimeString(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const MALDIVIAN_MOTIFS = [
  '인도양의 환초(Atoll)가 바깥의 거친 파도를 걸러 안쪽 라군(Lagoon)에 맑고 잔잔한 수면을 지켜 내는 고리 구조',
  '물때가 바뀔 때마다 좁은 산호 수로(Kandu)로 맑은 물이 드나들며 고인 바다를 스스로 정화하는 순환의 지혜',
  '낮은 모래섬 위에서도 코코넛 야자수가 바닷바람을 받아들이며 뿌리 깊숙이 빗물을 모으는 단단한 유연함',
  '서로 떨어진 작은 산호섬들이 물속의 같은 암초 기반 위에서 하나의 고리로 이어져 있음을 기억하는 연대감',
  '깊은 바다의 푸른빛과 얕은 모래톱의 옥빛이 선명한 경계를 이루며 각자의 깊이를 존중하는 조화'
];

const MALDIVIAN_ACTIONS = [
  '바깥의 소란을 한꺼번에 잠재우려 하기보다, 내 안의 잔잔한 라군을 지켜 주는 경계선 하나를 먼저 세워 보세요.',
  '마음이 답답하게 고여 있다면 작은 수로 하나를 열어 맑은 공기와 새로운 대화가 드나들 틈을 내어 보세요.',
  '거센 바람이 스칠수록 억지로 버티기보다 뿌리 아래로 고요한 빗물을 모으듯 내실 있는 휴식 한 조각을 챙기세요.',
  '겉으로는 작고 분리되어 보이는 일들도 아래에서는 하나의 큰 뿌리로 이어져 있음을 떠올리며 호흡을 고르세요.',
  '깊은 곳은 깊이대로, 얕은 곳은 얕은대로 각자의 리듬과 경계를 존중하며 오늘의 속도를 조율해 보세요.'
];

const MALDIVIAN_QUESTIONS = [
  '지금 내 마음의 환초 안쪽을 가장 맑게 유지해 주는 작은 경계는 무엇인가요?',
  '고여 있던 생각들을 맑게 순환시키기 위해 오늘 열어 둘 좁은 산호 수로는 어디인가요?',
  '바닷바람이 불어와도 내 뿌리 깊숙이 고요히 모아 두고 싶은 나만의 단단한 여유는 무엇인가요?',
  '따로 떨어져 보이는 일들 아래에서 사실은 하나로 이어져 있는 내 삶의 암초 기반은 무엇인가요?',
  '깊은 고민과 가벼운 일상 사이의 경계를 어떻게 나누어야 둘 다 맑게 숨 쉴 수 있을까요?'
];

const MALDIVIAN_SHADOWS = [
  '바깥의 파도를 걸러 내는 경계선이 지나치게 높아지면, 오히려 맑은 새 물이 들어오는 수로까지 닫아 버릴 수 있습니다.',
  '고인 물을 순환시키려 틈을 여는 것은 좋지만, 한꺼번에 너무 많은 변화와 자극을 들이면 안쪽 라군이 흔들립니다.',
  '바닷바람을 견디며 빗물을 모으는 인내가 외부의 도움을 청하거나 새로운 바람을 맞는 유연함까지 막지는 않아야 합니다.',
  '모든 것이 아래에서 이어져 있다는 연대감 속에서도, 오늘 내가 직접 구분해 맡아야 할 내 몫의 경계는 분명히 두세요.',
  '깊이와 얕음의 경계를 나누다 자칫 가벼운 일상을 사소하다며 치부하거나 깊은 고민을 무겁게만 키우지 않도록 하세요.',
];

function classifyMaldivianTopic(q: string): MaldivianAtollResult['questionTopic'] {
  if (/라군|경계|보호|파도|지키/.test(q)) return '경계·보호';
  if (/수로|순환|소통|고여|숨/.test(q)) return '순환·소통';
  if (/연대|이어|조화|깊이|리듬/.test(q)) return '연대·조화';
  return '산호초 전반';
}

export function calculateMaldivianCoralAtoll(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MaldivianAtollResult {
  const { profile, now = new Date(), question = '' } = params;
  const q = question.trim();
  const questionTopic = classifyMaldivianTopic(q);
  const seed = `${JSON.stringify(profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % MALDIVIAN_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MALDIVIAN_MOTIFS.length - 1));

  const motif = MALDIVIAN_MOTIFS[idx];
  const companionMotif = MALDIVIAN_MOTIFS[(idx + companionOffset) % MALDIVIAN_MOTIFS.length];
  const atollCurrentAxis = `${motif.split('(')[0].trim()} ↔ ${companionMotif.split('(')[0].trim()} (${questionTopic})`;
  const ritualAction = MALDIVIAN_ACTIONS[idx];
  const reflectiveQuestion = MALDIVIAN_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-MALDIVIAN-ATOLL-v2.3.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    reflectionFocus: q
      ? `질문 "${q}" 속에서 내 안의 고요한 라군을 지키는 산호초 물길 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '바깥의 파도를 걸러 안쪽의 평온을 지키는 몰디브 산호초 물길 관점',
    symbolicMotif: motif,
    companionMotif,
    atollCurrentAxis,
    ritualAction,
    shadowWarning: MALDIVIAN_SHADOWS[idx],
    reflectiveQuestion,
    interpretiveBoundary:
      '몰디브 산호초 환초의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatMaldivianAtollPrompt(result: MaldivianAtollResult): string {
  return [
    `[몰디브·산호초 물길 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 산호초 물길 축: ${result.atollCurrentAxis}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
