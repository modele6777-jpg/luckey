import type { UserProfile } from '../sharedState';

export interface TatraRidgeResult {
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

const TATRA_MOTIFS = [
  '카르파티아 타트라 산맥의 목동이 능선의 안개 속에서도 발끝의 풀잎과 바람 방향만으로 양 떼를 모으는 차분한 시선',
  '가파른 화강암 봉우리 아래 빙하 호수(Morskie Oko)가 구름과 바위를 있는 그대로 비추는 고요한 거울',
  '능선 위 통나무 산장(Koliba)의 작은 화덕처럼 큰 불꽃을 피우기보다 오래 꺼지지 않는 붉은 숯불을 지키는 성실함',
  '긴 알프스 뿔나팔(Fujara)의 낮은 울림이 계곡을 돌아 메아리로 돌아오기까지 재촉하지 않고 기다리는 호흡',
  '계절이 바뀔 때마다 높은 목초지와 낮은 마을을 오가며 지금 머물 자리를 스스로 정하는 유목적 균형'
];

const TATRA_ACTIONS = [
  '산 너머의 풍경까지 다 보려 하기보다, 지금 발끝이 딛고 선 돌과 풀잎의 감촉부터 확인해 보세요.',
  '거울 같은 호수처럼 판단을 덧씌우기 전에 지금 눈앞의 상황을 있는 그대로 한 줄로 적어 보세요.',
  '화덕의 불씨를 키우려고 바람을 세게 불기보다 마른 나뭇가지 하나를 조용히 보태는 쪽을 택해 보세요.',
  '긴 메아리가 돌아오기까지는 시간이 걸립니다. 말을 건넨 뒤 조급해하지 말고 한 박자 비워 두세요.',
  '지금 계절이 바뀌는 길목이라면 높은 목초지와 낮은 마을 중 내 몸이 편안한 높이를 스스로 정해 보세요.'
];

const TATRA_QUESTIONS = [
  '안개 낀 능선에서 먼 봉우리 대신 지금 내 발끝이 가장 또렷이 딛고 있는 기준은 무엇인가요?',
  '내 마음의 빙하 호수가 출렁이지 않고 있는 그대로 비추어 주길 기다리는 사실은 무엇인가요?',
  '화려한 불꽃은 아니지만 내 일상을 오래 따뜻하게 데워 주고 있는 붉은 숯불은 무엇인가요?',
  '오늘 내가 가장 조급하게 재촉하던 메아리는 어떤 작은 침묵을 기다리고 있나요?',
  '지금 내 계절에 맞춰 오르거나 내려와야 할 삶의 고도는 어느 지점인가요?'
];

export function calculateTatraShepherdRidge(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TatraRidgeResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % TATRA_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (TATRA_MOTIFS.length - 1));

  const motif = TATRA_MOTIFS[idx];
  const companionMotif = TATRA_MOTIFS[(idx + companionOffset) % TATRA_MOTIFS.length];
  const ritualAction = TATRA_ACTIONS[idx];
  const reflectiveQuestion = TATRA_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-TATRA-RIDGE-v2.2.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 먼 봉우리 대신 발끝의 능선을 짚는 타트라 목동 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '높은 능선의 안개 속에서도 침착하게 호흡을 고르는 타트라 목동 산길 관점',
    symbolicMotif: motif,
    companionMotif,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '타트라 산맥 목동 전통의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatTatraRidgePrompt(result: TatraRidgeResult): string {
  return [
    `[타트라·목동 산길 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
