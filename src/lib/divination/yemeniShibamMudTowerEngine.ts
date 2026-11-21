import type { UserProfile } from '../sharedState';

export interface YemeniShibamResult {
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

const YEMENI_MOTIFS = [
  '사막의 고대 고층 도시 시밤(Shibam)처럼 햇볕에 말린 진흙 벽돌 한 층을 충분히 굳힌 뒤에야 다음 층을 올리는 수직의 인내',
  '와디 하드라마우트 계곡의 오아시스 수로처럼 빗물이 한꺼번에 흘러가지 않게 흙담으로 길을 나누어 저장하는 분배의 지혜',
  '진흙 외벽의 하얀 석회 마감(Nura)이 뜨거운 사막의 햇살을 반사해 집 안의 서늘함을 지키듯 겉과 속의 온도를 다스리는 경계',
  '좁은 골목이 그늘을 만들어 서로의 집을 식혀 주듯 곁에 있는 사람과 적당한 간격을 유지하며 공존하는 품',
  '매년 우기 뒤 흙벽에 얇은 진흙을 다시 덧바르며 낡음을 숨기지 않고 손질해 오래 견디게 만드는 보수의 태도'
];

const YEMENI_ACTIONS = [
  '한꺼번에 높은 탑을 세우려 하기보다 오늘 쌓은 한 층이 충분히 마를 때까지 다음 결정을 하루만 늦춰 보세요.',
  '시간과 에너지가 한곳으로 쏠리지 않게 오늘 할 일을 작은 물길처럼 세 구간으로 나누어 배치해 보세요.',
  '지친 마음에 차가운 해결책을 들이붓기 전에, 바깥 열기를 가려 주는 하얀 석회벽처럼 나만의 휴식 거리를 먼저 두세요.',
  '가까운 사이일수록 과도한 기대 대신 서늘한 그늘을 만들어 주는 적당한 간격 하나를 지켜 보세요.',
  '부족해 보이는 부분에 새 진흙을 얇게 덧바르듯, 큰 변화 대신 작은 루틴 하나만 오늘 다시 손질해 보세요.'
];

const YEMENI_QUESTIONS = [
  '지금 내가 서둘러 올리려던 다음 층 가운데 아직 덜 마른 흙벽은 어디인가요?',
  '한꺼번에 쏟아붓기보다 흙담 수로처럼 천천히 나누어 흘려보내야 할 오늘의 에너지는 무엇인가요?',
  '뜨거운 바깥 열기를 반사하고 내 안의 서늘함을 지켜 줄 하얀 석회벽은 무엇인가요?',
  '서로 숨이 막히지 않고 서늘한 그늘을 나누기 위해 적당한 간격을 두어야 할 자리는 어디인가요?',
  '완전히 새로 짓는 대신 얇은 진흙을 덧바르듯 오늘 살짝 손질하면 다시 살아날 루틴은 무엇인가요?'
];

export function calculateYemeniShibamMudTower(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): YemeniShibamResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % YEMENI_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (YEMENI_MOTIFS.length - 1));

  const motif = YEMENI_MOTIFS[idx];
  const companionMotif = YEMENI_MOTIFS[(idx + companionOffset) % YEMENI_MOTIFS.length];
  const ritualAction = YEMENI_ACTIONS[idx];
  const reflectiveQuestion = YEMENI_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-YEMENI-SHIBAM-v2.2.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 한 층씩 천천히 굳혀 가는 예멘 시밤 진흙탑 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '사막 한가운데서 층층이 단단하게 굳혀 가는 예멘 시밤 진흙 고층 관점',
    symbolicMotif: motif,
    companionMotif,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '예멘 시밤 진흙 고층 건축의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatYemeniShibamPrompt(result: YemeniShibamResult): string {
  return [
    `[예멘·시밤 진흙탑 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
