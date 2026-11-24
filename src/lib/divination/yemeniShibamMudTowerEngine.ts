import type { UserProfile } from '../sharedState';

export type YemeniQuestionTopic = 'patience' | 'distribution' | 'boundary' | 'relation' | 'general';

function classifyYemeniTopic(q: string): YemeniQuestionTopic {
  if (/한 층|굳히|서두|천천|인내|기초/.test(q)) return 'patience';
  if (/분배|나누|에너지|시간|일정|수로/.test(q)) return 'distribution';
  if (/경계|휴식|지침|열기|온도|보호/.test(q)) return 'boundary';
  if (/관계|사람|간격|기대|공존/.test(q)) return 'relation';
  return 'general';
}

const YEMENI_AXES = [
  '시밤 흙벽돌 건조 축(한 층이 충분히 굳은 뒤에 다음 층을 올리는 수직의 인내)',
  '하드라마우트 수로 분배 축(한곳으로 쏠리지 않게 에너지를 세 갈래로 나누는 배분)',
  '누라 석회 외벽 축(바깥의 뜨거운 자극을 반사해 안쪽 서늘함을 지키는 경계)',
  '좁은 골목 그늘 축(서로의 숨이 막히지 않도록 적당한 간격을 두는 공존)',
  '우기 보수 덧바름 축(새로 헐지 않고 낡은 자리에 얇은 흙을 덧대어 이어 가는 성실함)',
] as const;

const YEMENI_SHADOW_WARNINGS: Record<YemeniQuestionTopic, string> = {
  patience: '충분히 말리는 시간과 결정을 계속 미루는 망설임을 구분하여, 오늘 굳힐 한 층의 완료 기준을 정해 두십시오.',
  distribution: '할 일을 잘게 나누다가 정작 가장 중요한 한 가지의 마감력이 흩어지지 않도록 핵심 우선순위 1개를 고정하십시오.',
  boundary: '내면을 보호하는 하얀 석회벽이 외부와의 완전한 단절이 되지 않도록 필요한 소통 창구는 열어 두십시오.',
  relation: '적당한 간격이 무관심이나 냉담함으로 비치지 않게 짧은 안부나 배려의 말 한마디는 남겨 두십시오.',
  general: '높이 올리는 것보다 아래층이 충분히 말랐는지 살피는 태도가 탑을 오래 버티게 합니다.',
};

export interface YemeniShibamResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: YemeniQuestionTopic;
  shibamTowerAxis: string;
  shadowWarning: string;
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
  const q = question.trim();
  const questionTopic = classifyYemeniTopic(q);
  const seed = `${JSON.stringify(profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % YEMENI_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (YEMENI_MOTIFS.length - 1));

  const motif = YEMENI_MOTIFS[idx];
  const companionMotif = YEMENI_MOTIFS[(idx + companionOffset) % YEMENI_MOTIFS.length];
  const shibamTowerAxis = YEMENI_AXES[idx];
  const shadowWarning = YEMENI_SHADOW_WARNINGS[questionTopic];
  const ritualAction = YEMENI_ACTIONS[idx];
  const reflectiveQuestion = YEMENI_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-YEMENI-SHIBAM-v2.3.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    shibamTowerAxis,
    shadowWarning,
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
    `[예멘·시밤 진흙탑 관점 (${result.engineVersion}) | 질문 맥락: ${result.questionTopic}]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 건축 축: ${result.shibamTowerAxis}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
