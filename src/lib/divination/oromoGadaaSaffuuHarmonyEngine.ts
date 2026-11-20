import type { UserProfile } from '../sharedState';

export interface OromoGadaaResult {
  engineVersion: string;
  calculatedAtKst: string;
  gadaaCycle: string;
  saffuuInsight: string;
  highlandTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CYCLES = [
  { cycle: '사푸(Saffuu · 서로의 선을 지키는 도덕적 균형)', insight: '자신과 타인, 자연 사이의 적정한 거리를 존중할 때 불필요한 마찰이 줄어듦', tone: '에티오피아 고원의 맑은 아침 공기와 붉은 흙길 위의 오다(Odaa) 무화과나무' },
  { cycle: '가다 8년 주기(Gadaa · 때에 맞춰 역할을 넘기고 받는 순환)', insight: '모든 것을 끝까지 쥐고 있으려 하지 않고 지금 내 계절에 맞는 몫만 성실히 감당함', tone: '일정한 주기로 물길을 바꾸어 밭을 적시는 고원의 계곡물' },
  { cycle: '나가야(Nagaya · 내면과 공동체의 평화)', insight: '조급한 다툼을 멈추고 먼저 평화의 인사를 건네는 쪽이 관계의 주도권을 회복함', tone: '오다 나무 그늘 아래 모여앉아 차분히 의견을 모으는 원형 회의' },
  { cycle: '발리(Baallii · 책임 있는 이양과 신뢰)', insight: '내가 다 해내야 한다는 부담을 덜고 믿을 수 있는 흐름에 다음 단계를 맡기는 여유', tone: '아침 해가 떠오르며 황금빛으로 물드는 광활한 고원 초지' },
  { cycle: '이레차(Irreechaa · 계절의 전환에 대한 감사)', insight: '긴 우기가 지나고 맑은 건기가 열리는 마디에서 지나온 수고에 감사하며 마음을 비움', tone: '푸른 풀잎을 손에 쥐고 흐르는 강가에서 새 계절을 맞이하는 평온함' },
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

export function calculateOromoGadaaSaffuuHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OromoGadaaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CYCLES.length;
  const picked = CYCLES[idx];

  return {
    engineVersion: 'LUCKEY-OROMO-GADAA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    gadaaCycle: picked.cycle,
    saffuuInsight: picked.insight,
    highlandTone: picked.tone,
    reflectionFocus: `오로모 가다 전통의 '${picked.cycle}'처럼, 지금 내 계절에 맞는 몫만 성실히 감당하며 관계의 평화(Nagaya)와 존중의 거리를 지켜 보세요.`,
    ritualAction: '오늘 내가 지나치게 껴안고 있던 걱정 하나를 내려놓고, 지금 당장 해야 할 한 가지 역할에만 집중해 보세요.',
    reflectiveQuestion: '지금 내가 모든 걸 다 짊어지려 애쓰는 대신, 때의 순환에 맡기고 한 걸음 물러나면 무엇이 편안해질까요?',
    interpretiveBoundary: '동아프리카 오로모(Oromo)의 가다(Gadaa) 순환 질서·사푸(Saffuu) 균형 윤리를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOromoGadaaPrompt(res: OromoGadaaResult): string {
  return [
    `[오로모 가다·사푸 윤리 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 순환 원칙: ${res.gadaaCycle} (${res.highlandTone})`,
    `- 중심 통찰: ${res.saffuuInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
