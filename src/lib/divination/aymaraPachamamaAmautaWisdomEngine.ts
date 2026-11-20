import type { UserProfile } from '../sharedState';

export interface AymaraPachamamaResult {
  engineVersion: string;
  calculatedAtKst: string;
  nayraLens: string;
  amautaInsight: string;
  altiplanoTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LENSES = [
  { lens: '나이라(Nayra · 지나온 길을 마주 보는 시선)', insight: '보이지 않는 미래를 막연히 걱정하기보다 이미 내가 걸어온 경험 속에서 답을 찾는 지혜', tone: '티티카카 호수 수면 위로 비치는 맑은 안데스 하늘' },
  { lens: '파차마마(Pachamama)와 아포(Apo)의 순환', insight: '얻기만 하려 하지 않고 내 곁의 사람과 환경에 작은 감사를 되돌려 줄 때 흐름이 열리는 이치', tone: '해발 4천 미터 알티플라노의 차갑고 투명한 공기' },
  { lens: '아마우타(Amauta)의 두 갈래 균형(Chacha-Warmi)', insight: '강함과 부드러움, 추진과 휴식이 한쪽으로 기울지 않고 맞물려 돌아가는 조화', tone: '직조된 안데스 아와요(Aguayo) 천의 다채로운 무늬' },
  { lens: '티나쿠(Tiwanaku) 태양의 문 정오', insight: '사방이 헷갈릴 때 가장 밝고 분명한 원칙 하나를 기준점으로 세우는 명료함', tone: '돌을 깎아 세운 고대 아치 너머로 쏟아지는 정오의 햇살' },
  { lens: '수마 카마냐(Suma Qamaña · 함께 잘 살아가기)', insight: '혼자 앞서는 성취보다 내 일상과 주변이 함께 편안해지는 지속 가능한 선택', tone: '고원 마을 돌담길에 피어난 작은 보라색 감자꽃' },
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

export function calculateAymaraPachamamaAmautaWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AymaraPachamamaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % LENSES.length;
  const picked = LENSES[idx];

  return {
    engineVersion: 'LUCKEY-AYMARA-AMAUTA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    nayraLens: picked.lens,
    amautaInsight: picked.insight,
    altiplanoTone: picked.tone,
    reflectionFocus: `아이마라 지혜의 '${picked.lens}'처럼, 앞날의 안개만 바라보지 말고 이미 검증된 나의 경험에서 오늘의 기준을 꺼내 보세요.`,
    ritualAction: '지난 한 달 동안 내가 잘 버텨 냈던 일 한 가지를 떠올려 스스로에게 고맙다고 말해 주세요.',
    reflectiveQuestion: '앞으로의 불확실함 대신 이미 내가 지나온 시간 속에서 이미 확인해 둔 나만의 강점은 무엇인가요?',
    interpretiveBoundary: '남미 안데스 아이마라 전통의 시간관(Nayra)과 호혜·공존 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAymaraPachamamaPrompt(res: AymaraPachamamaResult): string {
  return [
    `[아이마라 파차마마·아마우타 순환 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 시간 렌즈: ${res.nayraLens} (${res.altiplanoTone})`,
    `- 중심 통찰: ${res.amautaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
