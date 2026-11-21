import type { UserProfile } from '../sharedState';

export interface MaramuresGateResult {
  engineVersion: string;
  calculatedAtKst: string;
  maramuresMotif: string;
  companionMotif: string;
  maramuresInsight: string;
  woodTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '꼬인 밧줄 문양의 문주(Twisted Rope Pillar · 가느다란 가닥이 서로를 감싸며 단단한 기둥을 이룸)',
    insight: '작은 습관과 인연들이 서로 엮일 때 혼자서는 견디기 어려운 무게도 거뜬히 받쳐 줌',
    tone: '카르파티아 산맥 골짜기 초입, 오래된 참나무 대문 기둥에 밧줄 무늬가 정갈히 새겨진 아침',
    action: '오늘 내가 매일 반복하는 작은 습관 하나와 가까운 인연 하나를 연결해 부담 없는 루틴으로 묶어 보세요.',
    question: '혼자 버티려 들던 무게를, 가느다란 가닥들이 서로를 감싸듯 누구 또는 어떤 습관과 엮어 지탱할 수 있을까요?',
  },
  {
    motif: '못 없이 맞춘 목조 지붕(Pegged Joinery · 쇠못 대신 나무 홈을 서로 끼워 계절의 수축을 견딤)',
    insight: '상대와 나를 억지로 고정하려 하기보다 약간의 유격을 두어야 계절이 바뀌어도 뒤틀리지 않음',
    tone: '비가 내린 뒤에도 틈 없이 맞물린 전나무 지붕 처마 끝에서 물방울이 똑똑 떨어지는 낮',
    action: '오늘 누군가와의 대화나 계획에서 10% 정도의 시간 여유와 마음의 유격을 미리 남겨 두세요.',
    question: '지금 내가 너무 꽉 조여 놓아서 계절이 바뀔 때 오히려 삐걱거리고 있는 약속이나 기준은 무엇인가요?',
  },
  {
    motif: '건초 더미의 둥근 지붕(Haystack Cone · 한 해의 노고를 둥글게 쌓아 겨울을 든든히 넘김)',
    insight: '지금까지 애써 모은 작은 성과들을 흩어 버리지 말고 가지런히 모아 두면 겨울이 든든함',
    tone: '초록빛 언덕 위에 원뿔 모양 건초 더미들이 일정한 간격으로 평화롭게 놓인 오후',
    action: '최근에 해낸 작은 결과물이나 메모들을 오늘 10분만 들여 한 폴더나 노트에 가지런히 모아 두세요.',
    question: '이미 손에 쥐고도 흩어 두기만 해서 잊고 있던, 겨울을 든든히 넘기게 해 줄 내 성과들은 무엇인가요?',
  },
  {
    motif: '물레방아의 느린 도리깨(Watermill Rhythm · 계곡 물살에 맞춰 서두르지 않고 곡식을 찧음)',
    insight: '남의 시계에 맞춰 무리하게 속도를 높이기보다 내 계곡의 물살에 맞는 박자를 지키는 게 최선임',
    tone: '맑은 시냇물 옆에서 나무 물레방아가 일정하고 묵직한 소리를 내며 돌아가는 저녁',
    action: '남의 속도에 맞추느라 숨이 찬 일정 하나를 골라 오늘 내 물살에 맞는 현실적인 박자로 다시 조율해 보세요.',
    question: '남의 시계에 맞추려다 리듬을 잃기보다 내 계곡의 물살에 맞춰 지켜 가고 싶은 고유의 박자는 무엇인가요?',
  },
  {
    motif: '대문 앞의 열린 문턱(Open Threshold · 안과 밖의 경계를 세우되 손님을 향해 따뜻이 열려 있음)',
    insight: '내 생활의 건강한 경계선은 지키면서도, 새로운 좋은 기운이 들어올 문턱은 닫지 않아야 함',
    tone: '꽃이 핀 나무 대문 너머로 따뜻한 부엌 불빛과 빵 굽는 냄새가 번지는 황혼',
    action: '내 휴식 시간의 경계는 분명히 지키되, 오늘 새로 들어온 제안이나 안부 하나는 열린 마음으로 살펴보세요.',
    question: '지켜야 할 안쪽 경계와 따뜻하게 열어 두어야 할 문턱 사이에서 지금 조정이 필요한 자리는 어디인가요?',
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

export function calculateMaramuresWoodGateCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MaramuresGateResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-MARAMURES-GATE-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    maramuresMotif: picked.motif,
    companionMotif: companion.motif,
    maramuresInsight: picked.insight,
    woodTone: picked.tone,
    reflectionFocus: `마라무레슈 목조 문주의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 함께 엮어, 관계와 일정 사이에 숨 쉴 수 있는 유격을 두고 내 박자를 지켜 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '루마니아 카르파티아 마라무레슈의 목조 문주·수공예 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMaramuresGatePrompt(res: MaramuresGateResult): string {
  return [
    `[마라무레슈·목조 문주 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 마라무레슈 모티프: ${res.maramuresMotif} (${res.woodTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.maramuresInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
