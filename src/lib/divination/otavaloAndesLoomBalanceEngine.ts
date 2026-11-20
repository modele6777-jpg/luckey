import type { UserProfile } from '../sharedState';

export interface OtavaloLoomResult {
  engineVersion: string;
  calculatedAtKst: string;
  otavaloMotif: string;
  otavaloInsight: string;
  andesTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '이카트 매듭 염색(Ikat Tie-Dye · 실을 묶어 물들인 뒤 풀면 그 자리에 정교한 무늬가 드러남)', insight: '잠시 묶여 있고 답답해 보이던 제한들이 나중에 돌아보면 오히려 내 고유한 무늬를 만들어 낸 자리임', tone: '에콰도르 임바부라 화산 아래 맑은 안데스 아침 햇살 속, 남색과 흰색 실타래가 바람에 흔들리는 마당' },
  { motif: '허리 베틀의 균형(Backstrap Loom · 내 몸의 무게를 실어 실의 장력을 조절함)', insight: '일과 삶의 팽팽함은 바깥에서 정해 주는 게 아니라, 내 몸이 조금 뒤로 물러나거나 다가서며 조절함', tone: '산바람이 부는 처마 밑에서 베틀 줄을 허리에 메고 차분히 북을 넘기는 오전' },
  { motif: '임바부라 화산과 호수의 짝(Taita Imbabura & Lago San Pablo · 높은 산과 잔잔한 호수가 마주 봄)', insight: '높이 오르려는 추진력과 깊고 고요히 머무는 수용력이 서로 마주 보며 균형을 이루어야 함', tone: '산 파블로 호수 수면 위로 구름을 두른 화산 봉우리가 또렷하게 비치는 정오' },
  { motif: '토요일 광장의 색채 조화(Poncho Market · 저마다 다른 빛깔의 직물들이 한 광장에 모여 어우러짐)', insight: '내 색깔을 잃지 않으면서도 다른 사람의 다양한 빛깔과 나란히 놓일 때 전체 풍경이 가장 빛남', tone: '붉고 푸른 직물들이 돌바닥 광장에 펼쳐져 활기찬 대화가 오가는 오후' },
  { motif: '페구체 폭포의 물안개(Peguche Cascade · 직물을 짜기 전 맑은 물에 마음과 실을 함께 씻음)', insight: '새로운 장면을 시작하기 전에는 지난날의 먼지와 조급함을 맑은 물로 가볍게 헹구어 내는 편이 좋음', tone: '유칼립투스 숲 사이 폭포에서 피어오른 서늘한 물안개가 지는 해에 반짝이는 저녁' },
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

export function calculateOtavaloAndesLoomBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OtavaloLoomResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-OTAVALO-LOOM-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    otavaloMotif: picked.motif,
    otavaloInsight: picked.insight,
    andesTone: picked.tone,
    reflectionFocus: `오타발로 허리 베틀의 '${picked.motif}'처럼, 내 몸의 거리로 일의 장력을 조절하고 잠시 묶여 있던 경험도 고유한 무늬로 엮어 보세요.`,
    ritualAction: '오늘 너무 팽팽하게 당겨져 있던 일정이나 마음의 줄을 반 걸음만 다가서서 살짝 느슨하게 풀어 주세요.',
    reflectiveQuestion: '지금 나를 답답하게 묶고 있다고 여겼던 제약 중에, 나중에 나만의 고유한 무늬가 되어 줄 부분은 무엇인가요?',
    interpretiveBoundary: '에콰도르 안데스 오타발로의 허리 베틀 직조와 이카트 염색 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOtavaloLoomPrompt(res: OtavaloLoomResult): string {
  return [
    `[오타발로·안데스 베틀 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 오타발로 모티프: ${res.otavaloMotif} (${res.andesTone})`,
    `- 중심 통찰: ${res.otavaloInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
