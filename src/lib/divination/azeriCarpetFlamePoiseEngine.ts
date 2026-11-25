import type { UserProfile } from '../sharedState';

export interface AzeriCarpetResult {
  engineVersion: string;
  calculatedAtKst: string;
  azeriMotif: string;
  companionMotif: string;
  azeriInsight: string;
  bakuTone: string;
  loomTension: string;
  questionTopic: 'focus' | 'patience' | 'resilience' | 'general';
  azeriCrossAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '부타의 불꽃 곡선(Buta Flame · 바람에 흔들리면서도 꺼지지 않는 작은 불꽃 문양)',
    insight: '환경의 바람이 거세어져도 내 안의 작은 열정이 완전히 꺼지지 않고 유연하게 흔들릴 줄 알면 됨',
    tone: '카스피해의 바닷바람이 불어오는 바쿠 성곽 안, 붉은 양탄자 위 부타 문양이 선명한 아침',
    ritual: '바람이 거세게 느껴지는 일 앞에서 마음을 다그치기보다, 불꽃이 꺼지지 않게 호흡만 고르게 지켜 보세요.',
    question: '외부의 바람이 거셀 때도 내 안에서 끝까지 꺼뜨리지 않고 지키고 싶은 작은 불꽃은 무엇인가요?',
  },
  {
    motif: '경사와 위사의 교차 매듭(Double Knot · 세로줄과 가로줄이 단단히 얽혀 풀리지 않음)',
    insight: '내가 세운 원칙(세로줄)과 유연한 일상 경험(가로줄)이 교차할 때 비로소 튼튼한 무늬가 됨',
    tone: '나무 베틀 앞에서 장인이 양손으로 실을 엮으며 차분한 리듬을 만드는 오전',
    ritual: '오늘 내가 지킬 원칙 한 가지와 상황에 맞춰 유연하게 조절할 부분 한 가지를 나란히 적어 보세요.',
    question: '내 원칙(세로줄)과 일상의 유연함(가로줄)이 튼튼하게 매듭지어져야 할 오늘의 과제는 무엇인가요?',
  },
  {
    motif: '천연 염료의 깊은 색(Saffron & Pomegranate · 사프란과 석류 껍질로 물들인 시간이 지날수록 깊어지는 색)',
    insight: '인공적인 화려함보다 시간을 들여서 우려낸 태도와 실력이 오래갈수록 더 빛을 발함',
    tone: '햇볕이 따스한 마당에서 천연 염색된 양모 실타래가 바람에 말라 가는 낮',
    ritual: '당장 눈에 띄는 성과보다 시간이 지날수록 깊어지는 기본기 연습 15분을 오늘 몫으로 챙겨 보세요.',
    question: '반짝 화려해 보이는 것 대신, 시간을 들여 깊게 물들여 두고 싶은 내 삶의 태도나 실력은 무엇인가요?',
  },
  {
    motif: '메다글리온 중심 원(Central Medallion · 가장자리 문양들이 모두 한가운데 원으로 시선을 모음)',
    insight: '주변에 온갖 자잘한 일이 많아도 결국 내 삶의 중심 원이 무엇인지 기억하면 산만하지 않음',
    tone: '카펫 한가운데 둥근 기하학 문양이 방 안의 모든 빛을 모아들이는 오후',
    ritual: '오늘 복잡한 생각들을 한 번에 해결하려 들지 말고, 차 한 잔 마시는 동안 중심 과제 하나만 골라 매듭을 지어 보세요.',
    question: '내 삶의 카펫 한가운데에 자리 잡은 메다글리온(가장 중요한 중심 원)은 지금 무엇을 향하고 있나요?',
  },
  {
    motif: '아르무두 유리잔의 홍차(Armudu Tea · 허리가 잘록한 잔에 담긴 차가 천천히 식으며 대화를 잇음)',
    insight: '뜨거운 문제도 잘록한 잔처럼 속도를 조금 늦추어 식히면서 마주 앉으면 풀리지 않을 일이 없음',
    tone: '석양빛이 비치는 테라스에서 투명한 유리잔 속 붉은 홍차가 따뜻하게 빛나는 저녁',
    ritual: '마음이 급해지는 대화나 결정 앞에선 따뜻한 차 한 모금만큼 속도를 늦춘 뒤 답을 건네 보세요.',
    question: '지금 성급히 삼키기보다 아르무두 잔의 홍차처럼 조금 식히며 천천히 마주 앉아야 할 문제는 무엇인가요?',
  },
];

const LOOM_TENSIONS = [
  '느슨한 첫 줄 걸기(여유 확보)',
  '단단한 이중 매듭(원칙 고정)',
  '천연 염색 말리기(숙성 대기)',
  '가장자리 마감 매듭(완급 조절)',
] as const;

const SHADOW_WARNINGS = [
  '완벽한 대칭 무늬에만 집착하면 한 코만 틀어져도 전체 작업을 멈추게 될 수 있습니다.',
  '불꽃을 지키려다 바람까지 전부 막아 버리면 오히려 숨 쉴 공기까지 줄어듭니다.',
  '긴장을 너무 팽팽히 당기면 날실이 끊어지듯, 일상의 탄력도 지나친 강박 앞에서는 약해집니다.',
  '차를 식히는 시간을 지나치게 끌면 정작 따뜻할 때 건네야 할 진심까지 식어 버릴 수 있습니다.',
] as const;

function formatKstIso(date: Date): string {
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

export function calculateAzeriCarpetFlamePoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AzeriCarpetResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const tensionIdx = stableHash(`${seed}|tension`) % LOOM_TENSIONS.length;
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const loomTension = LOOM_TENSIONS[tensionIdx];
  const shadowWarning = SHADOW_WARNINGS[(tensionIdx + companionOffset) % SHADOW_WARNINGS.length];
  const q = (params.question ?? '').trim();
  const questionTopic: AzeriCarpetResult['questionTopic'] = !q
    ? 'general'
    : /중심|원칙|집중|과제|선택|매듭/.test(q)
      ? 'focus'
      : /기다|천천히|숙성|차|시간|속도/.test(q)
        ? 'patience'
        : /바람|흔들|불꽃|버텨|위기|지키/.test(q)
          ? 'resilience'
          : 'general';
  const azeriCrossAxis = `${questionTopic} · ${picked.motif.split('(')[0].trim()} × ${loomTension.split('(')[0].trim()}`;

  return {
    engineVersion: 'LUCKEY-AZERI-CARPET-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    azeriMotif: picked.motif,
    companionMotif: companion.motif,
    azeriInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    bakuTone: picked.tone,
    loomTension,
    questionTopic,
    azeriCrossAxis,
    shadowWarning,
    reflectionFocus: `아제르바이잔 카펫의 '${picked.motif}'와 동반 결 '${companion.motif}'가 '${loomTension}' 국면 위에서 만나 바람 앞에서도 유연하게 흔들리는 불꽃과 중심 원의 균형을 지켜 줍니다.`,
    ritualAction: `${picked.ritual} (${loomTension} 리듬으로 동반 결 '${companion.motif.split('(')[0].trim()}'까지 엮어 보세요.)`,
    reflectiveQuestion: `${picked.question} (동반 결 '${companion.motif.split('(')[0].trim()}'을 함께 고려하면 오늘의 장력은 어느 정도가 알맞을까요?)`,
    interpretiveBoundary: '아제르바이잔 바쿠·카펫 직조와 부타 문양 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAzeriCarpetPrompt(res: AzeriCarpetResult): string {
  return [
    `[아제리·바쿠 카펫 불꽃 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 아제리 모티프: ${res.azeriMotif} (${res.bakuTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 베틀 장력: ${res.loomTension}`,
    `- 질문 맥락(${res.questionTopic}) · 아제리 교차 축: ${res.azeriCrossAxis}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 중심 통찰: ${res.azeriInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
