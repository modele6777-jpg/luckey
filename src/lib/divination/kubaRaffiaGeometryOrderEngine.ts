import type { UserProfile } from '../sharedState';

export interface KubaRaffiaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '매듭·기본기' | '변주·리듬' | '조화·전환' | '라피아 전반';
  kubaMotif: string;
  companionMotif: string;
  raffiaWeaveAxis: string;
  kubaInsight: string;
  raffiaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '라피아 벨벳의 기하학(Kuba Cut-Pile · 뾰족한 대칭을 살짝 비틀어 살아 있는 리듬을 줌)',
    insight: '완벽한 대칭만 고집하기보다 약간의 변주와 비대칭을 허용할 때 삶이 생동감 있게 살아남',
    tone: '중앙아프리카 쿠바 왕국의 따스한 햇살 아래, 크림색과 짙은 갈색 기하학 무늬가 놓인 아침',
    action: '오늘 정해 둔 계획이나 루틴에 작은 변주 한 가지를 허용해 살아 있는 리듬을 느껴 보세요.',
    question: '완벽한 대칭과 정답만 고집하느라 내가 오히려 놓치고 있는 살아 있는 리듬은 무엇인가요?',
  },
  {
    motif: '카사이 강가의 야자 섬유(Kasai Palm Fiber · 거친 잎맥을 두드려 부드러운 실로 만듦)',
    insight: '처음에는 뻣뻣하고 다루기 어렵던 과제도 손으로 여러 번 주무르고 익히면 부드럽게 다루어짐',
    tone: '강바람이 불어오는 작업실 앞마당에서 야자 섬유를 가지런히 빗질하는 오전',
    action: '손에 잘 잡히지 않아 뻣뻣하게 느껴지던 일 하나를 오늘 10분만 만지며 길들여 보세요.',
    question: '처음엔 뻣뻣하고 어렵다는 이유로 아예 내려놓으려 했던, 조금만 더 다듬으면 부드러워질 과제는 무엇인가요?',
  },
  {
    motif: '왕의 바구니 속 매듭(Royal Knot · 겉으로 화려하지 않아도 안쪽 매듭이 풀리지 않게 꼼꼼히 숨김)',
    insight: '남에게 보이는 겉모습보다 보이지 않는 안쪽 마감과 기본기가 전체의 품격을 결정함',
    tone: '정교하게 엮인 천의 뒷면까지 반듯하게 정리되어 있는 차분한 낮',
    action: '오늘 진행 중인 일에서 남들이 보지 않는 뒷정리나 마감 한 가지를 유독 정갈히 매듭지어 보세요.',
    question: '남에게 보이는 겉모양을 다듬느라 정작 느슨하게 두고 있던 안쪽 매듭과 기본기는 무엇인가요?',
  },
  {
    motif: '두 손의 분업과 조화(Two-Hand Loom · 왼손이 바탕을 잡고 오른손이 자수를 놓아 천을 완성함)',
    insight: '안정적인 기반을 지키는 힘과 새로운 무늬를 수놓는 힘이 서로 다투지 않고 협력해야 함',
    tone: '나무 틀 위에서 두 손이 일정한 박자로 오가며 선명한 무늬를 채워 가는 오후',
    action: '기본 루틴을 지키는 일과 새로운 시도를 하는 일의 비중을 오늘 하루 균형 있게 배분해 보세요.',
    question: '안정적인 바탕을 지키는 일과 새로운 무늬를 수놓는 일 중 지금 내게 더 필요한 손놀림은 어느 쪽인가요?',
  },
  {
    motif: '춤과 가면의 전환(Ceremonial Rhythm · 계절과 의식에 따라 매듭의 춤사위가 달라짐)',
    insight: '상황이 바뀌었는데도 옛 박자만 고집하지 말고, 지금 장면에 어울리는 새 리듬을 타야 함',
    tone: '해 질 녘 북소리와 함께 라피아 천이 바람에 부드럽게 물결치는 저녁',
    action: '예전 방식대로 관성처럼 하던 일 하나를 골라, 지금 내 상황에 맞는 새 속도로 바꿔 보세요.',
    question: '이미 장면이 바뀌었는데도 관성 때문에 옛날 박자 그대로 춤추고 있던 일은 무엇인가요?',
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

const KUBA_SHADOWS = [
  '약간의 변주와 비대칭을 즐기는 과정에서 반드시 지켜야 할 기본 약속과 마감의 틀까지 흐트러뜨리지 마세요.',
  '뻣뻣한 과제를 손으로 주물러 길들이는 인내도 좋지만, 이미 방향이 맞지 않는 일에 시간만 계속 들이지는 마세요.',
  '보이지 않는 안쪽 매듭과 마감에 너무 몰두하다가 정작 바깥과 공유하고 제출해야 할 시기를 놓치지 않도록 하세요.',
  '기본기와 새로운 시도를 조화롭게 배분하려다 어느 한쪽도 깊이 밀어붙이지 못하고 어중간하게 끝내지 마세요.',
  '새 리듬으로 전환하는 유연함이 기존에 쌓아 온 좋은 관성과 신뢰까지 한꺼번에 버리는 조급함으로 이어지지 않게 하세요.',
];

function classifyKubaTopic(q: string): KubaRaffiaResult['questionTopic'] {
  if (/매듭|기본기|안쪽|마감/.test(q)) return '매듭·기본기';
  if (/변주|리듬|대칭|새로/.test(q)) return '변주·리듬';
  if (/조화|전환|균형|속도/.test(q)) return '조화·전환';
  return '라피아 전반';
}

export function calculateKubaRaffiaGeometryOrder(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KubaRaffiaResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyKubaTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const raffiaWeaveAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-KUBA-RAFFIA-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    kubaMotif: picked.motif,
    companionMotif: companion.motif,
    raffiaWeaveAxis,
    kubaInsight: picked.insight,
    raffiaTone: picked.tone,
    reflectionFocus: `쿠바 왕국 라피아 직조의 '${picked.motif}'처럼, 겉으로 드러나지 않는 안쪽 매듭을 단단히 하고 작은 비대칭의 생동감을 즐겨 보세요. (동반 결: ${companion.motif.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning: KUBA_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '중앙아프리카 쿠바 왕국의 라피아 기하학 직조와 조화 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKubaRaffiaPrompt(res: KubaRaffiaResult): string {
  return [
    `[쿠바·라피아 기하학 질서 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 라피아 직조 축: ${res.raffiaWeaveAxis}`,
    `- 쿠바 모티프: ${res.kubaMotif} (${res.raffiaTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.kubaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
