import type { UserProfile } from '../sharedState';

export interface SindhiBhitaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: string;
  surMelody: string;
  companionSur: string;
  indusFlowAxis: string;
  sindhiInsight: string;
  indusTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const INDUS_FLOW_AXES = [
  '단부로 현의 여운 · 맑은 진심 붙들기',
  '인더스 하구 닻 · 흔들려도 방향타 지키기',
  '아즈락 반복 염색 · 조바심 없이 겹 쌓기',
  '타르 사막 이슬 · 겉치레 내려놓기',
] as const;

const SURS = [
  {
    sur: '수르 사만디(Sur Samundi · 항해자의 기다림과 신뢰)',
    insight: '바람의 방향을 내가 다 조종할 수 없어도 배의 닻과 방향타는 온전히 내 손에 있다는 평온',
    tone: '인더스 강 하구 붉은 돛을 올린 목선의 잔잔한 물결',
    ritual: '바람의 방향을 억지로 바꾸려 하기보다, 지금 내가 잡고 있는 방향타와 닻의 상태를 차분히 점검해 보세요.',
    question: '바람이 내 뜻대로 불지 않을 때도, 배의 방향타를 쥔 채 끝까지 신뢰할 수 있는 내면의 기준은 무엇인가요?',
  },
  {
    sur: '수르 카파로(Sur Kaparo · 비탄을 넘어서는 맑은 노래)',
    insight: '마음속 답답함을 억지로 누르기보다 노래나 글로 흘려보낼 때 찾아오는 맑은 해방감',
    tone: '비타이 언덕 저녁 바람을 타고 퍼지는 단부로 현악기 소리',
    ritual: '마음속에 고여 있던 답답한 생각 한 가지를 짧게 글로 적거나 흥얼거리며 바깥으로 흘려보내 보세요.',
    question: '속으로 삼켜 무겁게 가라앉혀 두기보다, 말이나 글로 흘려보내면 한결 가벼워질 마음은 무엇인가요?',
  },
  {
    sur: '수르 마루이(Sur Marui · 화려함보다 진실을 택한 마음)',
    insight: '남들의 부러움을 사는 겉치레보다 내 마음이 진짜 편하고 떳떳한 자리를 지키는 용기',
    tone: '타르 사막 오두막 마당을 적시는 소박한 저녁 이슬',
    ritual: '오늘 겉으로 보기에 그럴듯한 선택 대신, 내 마음이 진짜 편안해지는 소박하고 솔직한 선택 하나를 해 보세요.',
    question: '남들의 시선이나 비교를 잠시 꺼 둔다면, 내 마음이 가장 맑게 울리는 자리는 어디인가요?',
  },
  {
    sur: '수르 야만 칼리안(Sur Yaman Kalyan · 갈등을 품어 녹이는 밤의 선율)',
    insight: '나와 다른 의견이나 서운함도 적으로 돌리지 않고 한 호흡 쉬며 이해해 보려는 너그러움',
    tone: '인더스 강변 달빛 아래 고요히 흐르는 은빛 물줄기',
    ritual: '나와 결이 다른 의견 앞에서 바로 선을 긋기보다, 상대의 입장을 한 문장으로만 바꿔 생각해 보세요.',
    question: '적으로 돌리기보다 한 호흡 쉬며 너그러운 시선으로 다시 들어 볼 수 있는 이야기는 무엇인가요?',
  },
  {
    sur: '아즈락(Ajrak · 겹겹이 물들인 인디고와 꼭두서니의 인내)',
    insight: '좋은 결과는 단번에 찍어내는 것이 아니라 여러 번 씻고 말리는 정성 끝에 색이 깊어짐',
    tone: '장인의 손끝에서 맑은 강물에 헹궈지는 짙은 쪽빛 천',
    ritual: '결과를 서둘러 재촉하기보다, 오늘 내가 반복해서 헹구고 다듬을 수 있는 정성 한 번을 보태 보세요.',
    question: '단번에 찍어내려 조바심 내는 대신, 여러 번 씻고 말리는 정성으로 깊이를 더해야 할 일은 무엇인가요?',
  },
];

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

export function calculateSindhiBhitaiIndusMelody(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SindhiBhitaiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SURS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SURS.length - 1));
  const picked = SURS[idx];
  const companion = SURS[(idx + companionOffset) % SURS.length];
  const indusFlowAxis = INDUS_FLOW_AXES[stableHash(`${seed}|axis`) % INDUS_FLOW_AXES.length];
  const trimmedQ = (params.question ?? '').trim();
  const questionTopic = trimmedQ
    ? trimmedQ.slice(0, 36)
    : '바깥 바람 속에서도 내 안의 맑은 선율 지키기';

  return {
    engineVersion: 'LUCKEY-SINDHI-BHITAI-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    surMelody: picked.sur,
    companionSur: companion.sur,
    indusFlowAxis,
    sindhiInsight: `${picked.insight} (동반 선율: ${companion.sur})`,
    indusTone: picked.tone,
    reflectionFocus: `질문 맥락('${questionTopic}')에서 신드 시인 샤 압둘 라티프 비타이의 '${picked.sur}'와 인더스 흐름 축('${indusFlowAxis}')을 함께 살피며, 바깥의 바람이 불 때도 내 안의 맑은 선율과 진실을 잃지 마세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    shadowWarning: '고요한 인내와 기다림을 앞세우다 지금 당장 방향타를 꺾어야 할 신호나 현실의 요청까지 놓치지 않도록 살피세요.',
    interpretiveBoundary: '인더스·신드(Sindhi) 시인 샤 압둘 라티프 비타이의 《샤 조 리살로》 선율 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSindhiBhitaiPrompt(res: SindhiBhitaiResult): string {
  return [
    `[신드 비타이·인더스 선율 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic}`,
    `- 선율(Sur): ${res.surMelody} (${res.indusTone})`,
    `- 동반 선율: ${res.companionSur}`,
    `- 인더스 흐름 축: ${res.indusFlowAxis}`,
    `- 중심 통찰: ${res.sindhiInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
