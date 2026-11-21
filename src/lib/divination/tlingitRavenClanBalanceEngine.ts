import type { UserProfile } from '../sharedState';

export interface TlingitRavenResult {
  engineVersion: string;
  calculatedAtKst: string;
  tlingitBalance: string;
  companionBalance: string;
  ravenInsight: string;
  coastalTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const BALANCES = [
  {
    balance: '독수리와 까마귀의 상보적 균형(Moiety Reciprocity)',
    insight: '나와 다른 성향의 상대가 내 빈자리를 비추어 주어 공동체 전체의 중심이 잡힘',
    tone: '알래스카 피오르드 해안의 짙은 안개를 뚫고 솟은 삼나무 토템폴',
    action: '오늘 나눈 대화에서 내 생각과 달랐던 상대의 말 한 구절을 틀린 것이 아닌 다른 절반으로 인정해 보세요.',
    question: '지금 내가 부딪치고 있는 반대편의 시선이 사실 내 균형을 맞추어 주는 퍼즐의 한 조각이라면 무엇일까요?',
  },
  {
    balance: '아티오(At.óow · 이름과 이야기에 깃든 책임)',
    insight: '가벼운 말보다 내가 맡은 자리와 이름의 무게를 조용히 지켜낼 때 신뢰가 깊어짐',
    tone: '구리 방패(Tináa) 표면에 새겨진 정교하고 단단한 문양',
    action: '오늘 내가 맡은 작은 약속 한 가지를 가볍게 넘기지 말고 끝까지 정성껏 마무리해 보세요.',
    question: '지금 내 이름과 역할에 깃든 책임 중, 오늘 가장 묵직하고 성실하게 지켜 내고 싶은 한 가지는 무엇인가요?',
  },
  {
    balance: '포틀래치(Koo.éex’ · 넉넉히 베풀어 맺는 존중)',
    insight: '혼자 쌓아 두는 것보다 기꺼이 내어놓고 감사히 받을 때 관계의 매듭이 풀림',
    tone: '추운 겨울밤, 나무 장작불을 중심으로 둘러앉아 이야기를 나누는 온기',
    action: '내가 가진 시간이나 작은 호의 한 조각을 아끼지 말고 가까운 사람에게 먼저 건네 보세요.',
    question: '혼자 움켜쥐고 있던 것을 기꺼이 내어놓고 감사히 주고받을 때 풀릴 관계의 매듭은 무엇인가요?',
  },
  {
    balance: '예일(Yéil · 까마귀의 재치와 유연한 전환)',
    insight: '막힌 벽 앞에서 힘으로만 밀어붙이지 않고 다른 각도에서 빛을 끌어오는 지혜',
    tone: '은빛 물결 위로 낮게 날아오르며 방향을 바꾸는 바다 까마귀의 날갯짓',
    action: '정면에서 막힌 일 하나를 힘으로 밀지 말고, 시선을 옆으로 옮겨 다른 우회로 1가지를 떠올려 보세요.',
    question: '지금 힘으로만 밀어붙이던 벽 앞에서 까마귀의 날갯짓처럼 유연하게 각도를 틀어 볼 지점은 어디인가요?',
  },
  {
    balance: '후스트(Haa Shagóon · 지나온 길과 앞으로의 길을 잇는 시선)',
    insight: '과거의 경험과 다가올 시간을 하나의 흐름으로 볼 때 오늘의 조급함이 잦아듦',
    tone: '빙하가 녹아내린 맑은 바닷물과 푸른 가문비나무 숲의 경계',
    action: '지나온 시간에서 내가 이미 배운 점 하나와 앞으로 이어 가고 싶은 방향 하나를 나란히 적어 보세요.',
    question: '지나온 길과 다가올 시간을 하나의 큰 물줄기로 이어 볼 때 오늘의 조급함이 잦아드는 이유는 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
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

export function calculateTlingitRavenClanBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TlingitRavenResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % BALANCES.length;
  const picked = BALANCES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (BALANCES.length - 1));
  const companion = BALANCES[(idx + companionOffset) % BALANCES.length];

  return {
    engineVersion: 'LUCKEY-TLINGIT-RAVEN-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    tlingitBalance: picked.balance,
    companionBalance: companion.balance,
    ravenInsight: picked.insight,
    coastalTone: picked.tone,
    reflectionFocus: `틀링깃 지혜의 '${picked.balance}'을 중심에 두고 '${companion.balance}'의 결을 곁들여, 나와 다른 관점을 대립이 아닌 상보적 균형으로 바라보며 유연한 전환점을 찾아보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '북미 태평양 북서해안 틀링깃(Tlingit)의 반족 상보성(Reciprocity)·아티오(At.óow) 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTlingitRavenPrompt(res: TlingitRavenResult): string {
  return [
    `[틀링깃 레이븐·클랜 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 균형 축: ${res.tlingitBalance} (${res.coastalTone})`,
    `- 동반 균형: ${res.companionBalance}`,
    `- 중심 통찰: ${res.ravenInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
