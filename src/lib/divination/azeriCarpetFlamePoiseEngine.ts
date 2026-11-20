import type { UserProfile } from '../sharedState';

export interface AzeriCarpetResult {
  engineVersion: string;
  calculatedAtKst: string;
  azeriMotif: string;
  azeriInsight: string;
  bakuTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '부타의 불꽃 곡선(Buta Flame · 바람에 흔들리면서도 꺼지지 않는 작은 불꽃 문양)', insight: '환경의 바람이 거세어져도 내 안의 작은 열정이 완전히 꺼지지 않고 유연하게 흔들릴 줄 알면 됨', tone: '카스피해의 바닷바람이 불어오는 바쿠 성곽 안, 붉은 양탄자 위 부타 문양이 선명한 아침' },
  { motif: '경사와 위사의 교차 매듭(Double Knot · 세로줄과 가로줄이 단단히 얽혀 풀리지 않음)', insight: '내가 세운 원칙(세로줄)과 유연한 일상 경험(가로줄)이 교차할 때 비로소 튼튼한 무늬가 됨', tone: '나무 베틀 앞에서 장인이 양손으로 실을 엮으며 차분한 리듬을 만드는 오전' },
  { motif: '천연 염료의 깊은 색(Saffron & Pomegranate · 사프란과 석류 껍질로 물들인 시간이 지날수록 깊어지는 색)', insight: '인공적인 화려함보다 시간을 들여서 우려낸 태도와 실력이 오래갈수록 더 빛을 발함', tone: '햇볕이 따스한 마당에서 천연 염색된 양모 실타래가 바람에 말라 가는 낮' },
  { motif: '메다글리온 중심 원(Central Medallion · 가장자리 문양들이 모두 한가운데 원으로 시선을 모음)', insight: '주변에 온갖 자잘한 일이 많아도 결국 내 삶의 중심 원이 무엇인지 기억하면 산만하지 않음', tone: '카펫 한가운데 둥근 기하학 문양이 방 안의 모든 빛을 모아들이는 오후' },
  { motif: '아르무두 유리잔의 홍차(Armudu Tea · 허리가 잘록한 잔에 담긴 차가 천천히 식으며 대화를 잇음)', insight: '뜨거운 문제도 잘록한 잔처럼 속도를 조금 늦추어 식히면서 마주 앉으면 풀리지 않을 일이 없음', tone: '석양빛이 비치는 테라스에서 투명한 유리잔 속 붉은 홍차가 따뜻하게 빛나는 저녁' },
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

export function calculateAzeriCarpetFlamePoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AzeriCarpetResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-AZERI-CARPET-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    azeriMotif: picked.motif,
    azeriInsight: picked.insight,
    bakuTone: picked.tone,
    reflectionFocus: `아제르바이잔 카펫의 '${picked.motif}'처럼, 바람 앞에서도 유연하게 흔들리는 불꽃과 중심 원의 균형을 지켜 보세요.`,
    ritualAction: '오늘 복잡한 생각들을 한 번에 해결하려 들지 말고, 차 한 잔 마시는 동안 중심 과제 하나만 골라 매듭을 지어 보세요.',
    reflectiveQuestion: '내 삶의 카펫 한가운데에 자리 잡은 메다글리온(가장 중요한 중심 원)은 지금 무엇을 향하고 있나요?',
    interpretiveBoundary: '아제르바이잔 바쿠·카펫 직조와 부타 문양 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAzeriCarpetPrompt(res: AzeriCarpetResult): string {
  return [
    `[아제리·바쿠 카펫 불꽃 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 아제리 모티프: ${res.azeriMotif} (${res.bakuTone})`,
    `- 중심 통찰: ${res.azeriInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
