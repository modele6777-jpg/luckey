import type { UserProfile } from '../sharedState';

export interface TlingitRavenResult {
  engineVersion: string;
  calculatedAtKst: string;
  tlingitBalance: string;
  ravenInsight: string;
  coastalTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const BALANCES = [
  { balance: '독수리와 까마귀의 상보적 균형(Moiety Reciprocity)', insight: '나와 다른 성향의 상대가 내 빈자리를 비추어 주어 공동체 전체의 중심이 잡힘', tone: '알래스카 피오르드 해안의 짙은 안개를 뚫고 솟은 삼나무 토템폴' },
  { balance: '아티오(At.óow · 이름과 이야기에 깃든 책임)', insight: '가벼운 말보다 내가 맡은 자리와 이름의 무게를 조용히 지켜낼 때 신뢰가 깊어짐', tone: '구리 방패(Tináa) 표면에 새겨진 정교하고 단단한 문양' },
  { balance: '포틀래치(Koo.éex’ · 넉넉히 베풀어 맺는 존중)', insight: '혼자 쌓아 두는 것보다 기꺼이 내어놓고 감사히 받을 때 관계의 매듭이 풀림', tone: '추운 겨울밤, 나무 장작불을 중심으로 둘러앉아 이야기를 나누는 온기' },
  { balance: '예일(Yéil · 까마귀의 재치와 유연한 전환)', insight: '막힌 벽 앞에서 힘으로만 밀어붙이지 않고 다른 각도에서 빛을 끌어오는 지혜', tone: '은빛 물결 위로 낮게 날아오르며 방향을 바꾸는 바다 까마귀의 날갯짓' },
  { balance: '후스트(Haa Shagóon · 지나온 길과 앞으로의 길을 잇는 시선)', insight: '과거의 경험과 다가올 시간을 하나의 흐름으로 볼 때 오늘의 조급함이 잦아듦', tone: '빙하가 녹아내린 맑은 바닷물과 푸른 가문비나무 숲의 경계' },
];

function formatKstIso(date: Date): string {
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

export function calculateTlingitRavenClanBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TlingitRavenResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % BALANCES.length;
  const picked = BALANCES[idx];

  return {
    engineVersion: 'LUCKEY-TLINGIT-RAVEN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    tlingitBalance: picked.balance,
    ravenInsight: picked.insight,
    coastalTone: picked.tone,
    reflectionFocus: `틀링깃 지혜의 '${picked.balance}'처럼, 나와 다른 관점을 대립이 아닌 상보적 균형으로 바라보며 유연한 전환점을 찾아보세요.`,
    ritualAction: '오늘 나눈 대화에서 내 생각과 달랐던 상대의 말 한 구절을 틀린 것이 아닌 다른 절반으로 인정해 보세요.',
    reflectiveQuestion: '지금 내가 부딪치고 있는 반대편의 시선이 사실 내 균형을 맞추어 주는 퍼즐의 한 조각이라면 무엇일까요?',
    interpretiveBoundary: '북미 태평양 북서해안 틀링깃(Tlingit)의 반족 상보성(Reciprocity)·아티오(At.óow) 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTlingitRavenPrompt(res: TlingitRavenResult): string {
  return [
    `[틀링깃 레이븐·클랜 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 균형 축: ${res.tlingitBalance} (${res.coastalTone})`,
    `- 중심 통찰: ${res.ravenInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
