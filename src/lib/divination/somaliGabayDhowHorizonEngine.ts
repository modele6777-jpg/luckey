import type { UserProfile } from '../sharedState';

export interface SomaliGabayResult {
  engineVersion: string;
  calculatedAtKst: string;
  poetryPrinciple: string;
  somaliInsight: string;
  hornOfAfricaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  { principle: '가바이의 무게(Gabay · 많은 말 대신 잘 고른 한 연으로 뜻을 전함)', insight: '감정이 앞설수록 말을 늘리기보다 정갈하게 고른 한 문장이 상대를 움직임', tone: '아프리카의 뿔 아카시아 나무 그늘 아래 모여 맑은 운율로 낭송하는 저녁 자리' },
  { principle: '헤르(Xeer · 성문화되지 않아도 서로가 지키는 묵시적 예의)', insight: '규칙이 촘촘하지 않아도 상대의 입장을 먼저 헤아리는 신의가 관계를 지탱함', tone: '모래 언덕 너머로 이어지는 오래된 순례길과 나그네를 맞는 맑은 물동이' },
  { principle: '유향의 숨결(Frankincense · 거친 바위 틈에서 천천히 굳어 맑은 향이 됨)', insight: '상처나 고된 시간도 서두르지 않고 잘 말려 두면 나만의 깊은 향기로 변함', tone: '바위 절벽 사이로 맑은 아침 공기를 타고 번지는 은은한 수지 향기' },
  { principle: '모가디슈의 다우 돛(Dhow Sail · 계절풍이 바뀔 때 닻을 올리는 기다림)', insight: '바람의 방향이 맞지 않을 때 무리해 출항하기보다 계절풍이 바뀌는 때를 읽는 편이 현명함', tone: '인도양의 푸른 파도 위에서 하얀 삼각돛을 펴는 고요한 목조 범선' },
  { principle: '시르(Shir · 모두의 말을 끝까지 듣고 나서 내리는 결론)', insight: '서둘러 결론을 내리기 전에 아직 듣지 못한 작은 목소리가 없는지 한 번 더 살핌', tone: '별빛이 내려앉은 넓은 들판에 둥글게 둘러앉아 나누는 차분한 대화' },
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

export function calculateSomaliGabayDhowHorizon(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SomaliGabayResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];

  return {
    engineVersion: 'LUCKEY-SOMALI-GABAY-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    poetryPrinciple: picked.principle,
    somaliInsight: picked.insight,
    hornOfAfricaTone: picked.tone,
    reflectionFocus: `소말리 가바이·해양 지혜의 '${picked.principle}'처럼, 급한 순간일수록 말을 늘리기보다 정갈하게 고른 한 마디와 계절풍의 때를 기다려 보세요.`,
    ritualAction: '오늘 누군가에게 중요한 말을 전해야 한다면, 길게 설명하기 전에 핵심 한 문장만 정갈하게 가다듬어 보세요.',
    reflectiveQuestion: '지금 내가 바람을 거슬러 억지로 닻을 올리려 하기보다, 계절풍이 내 쪽으로 불어오길 잠시 기다려 주면 좋을 일은 무엇인가요?',
    interpretiveBoundary: '소말리아 가바이(Gabay) 구전 시학·헤르(Xeer) 신의·다우 항해 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSomaliGabayPrompt(res: SomaliGabayResult): string {
  return [
    `[소말리 가바이·바다 지평선 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 시학 원리: ${res.poetryPrinciple} (${res.hornOfAfricaTone})`,
    `- 중심 통찰: ${res.somaliInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
