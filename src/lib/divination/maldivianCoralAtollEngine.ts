import type { SajuBirthProfile } from './types';

export interface MaldivianAtollResult {
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
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss} +09:00 (KST)`;
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
  '겉으로는 작고 분리되어 보이는 일들도 아래에서는 하나의 큰 뿌리로 이어져 있음을 떠올리며 호흡을 고르세요.'
];

export function calculateMaldivianCoralAtoll(params: {
  profile: SajuBirthProfile;
  now?: Date;
  question?: string;
}): MaldivianAtollResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${profile.birthDate ?? 'unknown'}|${profile.birthTime ?? 'unknown'}|${question.trim()}`;
  const hash = stableHash(seed);

  const motif = MALDIVIAN_MOTIFS[hash % MALDIVIAN_MOTIFS.length];
  const ritualAction = MALDIVIAN_ACTIONS[Math.floor(hash / 7) % MALDIVIAN_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-MALDIVIAN-ATOLL-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 내 안의 고요한 라군을 지키는 산호초 물길 관점`
      : '바깥의 파도를 걸러 안쪽의 평온을 지키는 몰디브 산호초 물길 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '지금 내 마음의 환초 안쪽을 가장 맑게 유지해 주는 작은 경계는 무엇인가요?',
    interpretiveBoundary:
      '몰디브 산호초 환초의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatMaldivianAtollPrompt(result: MaldivianAtollResult): string {
  return [
    `[몰디브·산호초 물길 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
