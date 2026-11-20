import type { UserProfile } from '../sharedState';

export interface YemeniShibamResult {
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

const YEMENI_MOTIFS = [
  '사막의 고대 고층 도시 시밤(Shibam)처럼 햇볕에 말린 진흙 벽돌 한 층을 충분히 굳힌 뒤에야 다음 층을 올리는 수직의 인내',
  '와디 하드라마우트 계곡의 오아시스 수로처럼 빗물이 한꺼번에 흘러가지 않게 흙담으로 길을 나누어 저장하는 분배의 지혜',
  '진흙 외벽의 하얀 석회 마감(Nura)이 뜨거운 사막의 햇살을 반사해 집 안의 서늘함을 지키듯 겉과 속의 온도를 다스리는 경계',
  '좁은 골목이 그늘을 만들어 서로의 집을 식혀 주듯 곁에 있는 사람과 적당한 간격을 유지하며 공존하는 품',
  '매년 우기 뒤 흙벽에 얇은 진흙을 다시 덧바르며 낡음을 숨기지 않고 손질해 오래 견디게 만드는 보수의 태도'
];

const YEMENI_ACTIONS = [
  '한꺼번에 높은 탑을 세우려 하기보다 오늘 쌓은 한 층이 충분히 마를 때까지 다음 결정을 하루만 늦춰 보세요.',
  '지친 마음에 차가운 해결책을 들이붓기 전에, 바깥 열기를 가려 주는 하얀 석회벽처럼 나만의 휴식 거리를 먼저 두세요.',
  '부족해 보이는 부분에 새 진흙을 얇게 덧바르듯, 큰 변화 대신 작은 루틴 하나만 오늘 다시 손질해 보세요.'
];

export function calculateYemeniShibamMudTower(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): YemeniShibamResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const motif = YEMENI_MOTIFS[hash % YEMENI_MOTIFS.length];
  const ritualAction = YEMENI_ACTIONS[Math.floor(hash / 7) % YEMENI_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-YEMENI-SHIBAM-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 한 층씩 천천히 굳혀 가는 예멘 시밤 진흙탑 관점`
      : '사막 한가운데서 층층이 단단하게 굳혀 가는 예멘 시밤 진흙 고층 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '지금 내가 서둘러 올리려던 다음 층 가운데 아직 덜 마른 흙벽은 어디인가요?',
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
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
