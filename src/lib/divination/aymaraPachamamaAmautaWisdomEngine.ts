import type { UserProfile } from '../sharedState';

export interface AymaraPachamamaResult {
  engineVersion: string;
  calculatedAtKst: string;
  nayraLens: string;
  companionLens: string;
  amautaInsight: string;
  altiplanoTone: string;
  reciprocityPhase: string;
  questionTopic: 'clarity' | 'reciprocity' | 'balance' | 'general';
  aymaraCrossAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LENSES = [
  {
    lens: '나이라(Nayra · 지나온 길을 마주 보는 시선)',
    insight: '보이지 않는 미래를 막연히 걱정하기보다 이미 내가 걸어온 경험 속에서 답을 찾는 지혜',
    tone: '티티카카 호수 수면 위로 비치는 맑은 안데스 하늘',
    ritual: '지난 한 달 동안 내가 잘 버텨 냈던 일 한 가지를 떠올려 스스로에게 고맙다고 말해 주세요.',
    question: '앞으로의 불확실함 대신 이미 내가 지나온 시간 속에서 확인해 둔 나만의 강점은 무엇인가요?',
  },
  {
    lens: '파차마마(Pachamama)와 아포(Apo)의 순환',
    insight: '얻기만 하려 하지 않고 내 곁의 사람과 환경에 작은 감사를 되돌려 줄 때 흐름이 열리는 이치',
    tone: '해발 4천 미터 알티플라노의 차갑고 투명한 공기',
    ritual: '오늘 나를 도와준 사람이나 공간에 짧은 감사 인사 한 마디를 먼저 건네 보세요.',
    question: '지금 내가 받기만을 기다리기보다 먼저 작은 온기를 되돌려 줄 수 있는 자리는 어디인가요?',
  },
  {
    lens: '아마우타(Amauta)의 두 갈래 균형(Chacha-Warmi)',
    insight: '강함과 부드러움, 추진과 휴식이 한쪽으로 기울지 않고 맞물려 돌아가는 조화',
    tone: '직조된 안데스 아와요(Aguayo) 천의 다채로운 무늬',
    ritual: '오늘 몰아붙이기만 하던 일 옆에 같은 비중의 짧은 휴식 15분을 나란히 배치해 보세요.',
    question: '지금 내 하루가 추진과 회복 중 어느 한쪽으로만 과하게 기울어 있지는 않나요?',
  },
  {
    lens: '티나쿠(Tiwanaku) 태양의 문 정오',
    insight: '사방이 헷갈릴 때 가장 밝고 분명한 원칙 하나를 기준점으로 세우는 명료함',
    tone: '돌을 깎아 세운 고대 아치 너머로 쏟아지는 정오의 햇살',
    ritual: '여러 갈래 선택지 앞에서 오늘은 단 하나의 판단 기준만 남겨 메모에 적어 두세요.',
    question: '복잡한 조건들을 걷어 냈을 때 오늘 정오의 햇살처럼 가장 또렷하게 남는 기준은 무엇인가요?',
  },
  {
    lens: '수마 카마냐(Suma Qamaña · 함께 잘 살아가기)',
    insight: '혼자 앞서는 성취보다 내 일상과 주변이 함께 편안해지는 지속 가능한 선택',
    tone: '고원 마을 돌담길에 피어난 작은 보라색 감자꽃',
    ritual: '나와 주변 사람 모두가 지치지 않고 오래 이어 갈 수 있는 현실적인 속도 하나를 정해 보세요.',
    question: '혼자 빠르게 이기는 대신 내 일상과 곁의 사람이 함께 숨 쉴 수 있는 선택은 무엇인가요?',
  },
];

const RECIPROCITY_PHASES = [
  '씨앗 고르기(지나온 경험 회수)',
  '대지에 물 대기(작은 감사 되돌리기)',
  '아와요 씨실 엮기(서로 다른 힘의 균형)',
  '공동 수확 나누기(함께 숨 쉬는 속도)',
] as const;

const SHADOW_WARNINGS = [
  '지나온 길만 바라보며 과거의 성공 방식에 매이면 눈앞의 새로운 계절을 놓칠 수 있습니다.',
  '주변을 챙기느라 내 몫의 휴식과 기준까지 내어주면 호혜의 순환이 한쪽으로 기울어집니다.',
  '정오의 기준을 너무 날카롭게 세우면 함께 걸어가는 사람들의 서로 다른 보폭을 다치게 할 수 있습니다.',
  '평온한 속도를 지키려다 꼭 밟아야 할 결단의 언덕마저 미루지 않도록 균형을 살피세요.',
] as const;

function formatKstStandard(date: Date): string {
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

export function calculateAymaraPachamamaAmautaWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AymaraPachamamaResult {
  const now = params.now ?? new Date();
  const baseSeed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(baseSeed) % LENSES.length;
  const companionOffset = 1 + (stableHash(`${baseSeed}|companion`) % (LENSES.length - 1));
  const phaseIdx = stableHash(`${baseSeed}|phase`) % RECIPROCITY_PHASES.length;
  const companionIdx = (idx + companionOffset) % LENSES.length;
  const picked = LENSES[idx];
  const companion = LENSES[companionIdx];
  const reciprocityPhase = RECIPROCITY_PHASES[phaseIdx];
  const shadowWarning = SHADOW_WARNINGS[(phaseIdx + companionOffset) % SHADOW_WARNINGS.length];
  const q = (params.question ?? '').trim();
  const questionTopic: AymaraPachamamaResult['questionTopic'] = !q
    ? 'general'
    : /기준|경험|결정|정오|선택|과거/.test(q)
      ? 'clarity'
      : /감사|함께|관계|사람|나누|돌봄/.test(q)
        ? 'reciprocity'
        : /균형|속도|휴식|지침|조화/.test(q)
          ? 'balance'
          : 'general';
  const aymaraCrossAxis = `${questionTopic} · ${picked.lens.split('(')[0].trim()} × ${reciprocityPhase.split('(')[0].trim()}`;

  return {
    engineVersion: 'LUCKEY-AYMARA-AMAUTA-v2.4.0',
    calculatedAtKst: formatKstStandard(now),
    nayraLens: picked.lens,
    companionLens: companion.lens,
    amautaInsight: picked.insight,
    altiplanoTone: picked.tone,
    reciprocityPhase,
    questionTopic,
    aymaraCrossAxis,
    shadowWarning,
    reflectionFocus: `아이마라 지혜의 '${picked.lens}'를 중심에 두고 '${companion.lens}'의 균형을 '${reciprocityPhase}' 국면으로 곁들여, 이미 검증된 나의 경험에서 오늘의 기준을 꺼내 보세요.`,
    ritualAction: `${picked.ritual} (${reciprocityPhase} 흐름에서 '${companion.lens}'의 균형도 함께 챙겨 보세요.)`,
    reflectiveQuestion: `${picked.question} (특히 '${companion.lens}'와 맞물려 지금 조율할 대목은 무엇인가요?)`,
    interpretiveBoundary: '남미 안데스 아이마라 전통의 시간관(Nayra)과 호혜·공존 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAymaraPachamamaPrompt(res: AymaraPachamamaResult): string {
  return [
    `[아이마라 파차마마·아마우타 순환 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 시간 렌즈: ${res.nayraLens} (${res.altiplanoTone})`,
    `- 보조 맥락: ${res.companionLens}`,
    `- 호혜 국면: ${res.reciprocityPhase}`,
    `- 질문 맥락(${res.questionTopic}) · 아이마라 교차 축: ${res.aymaraCrossAxis}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 중심 통찰: ${res.amautaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
