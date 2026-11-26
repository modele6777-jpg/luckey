import type { UserProfile } from '../sharedState';

export interface LuangPrabangDawnResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: string;
  questionCategory: '여유·기다림' | '나눔·온기' | '합류·루틴' | '비움·계절';
  mekongMotif: string;
  companionMotif: string;
  mekongDawnAxis: string;
  topicBalanceHint: string;
  luangPrabangInsight: string;
  dawnTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const MEKONG_DAWN_AXES = [
  '메콩 새벽 물안개 · 걷힐 때까지 기다리는 여유',
  '침묵의 탁발 · 생색 없이 건네는 작은 친절',
  '남칸·메콩 합류 · 일상과 목표의 자연스러운 연결',
  '대나무 다리 계절 · 때가 지나면 가볍게 접어두기',
] as const;

const TOPIC_BALANCE_HINTS: Record<LuangPrabangDawnResult['questionCategory'], string> = {
  '여유·기다림': '메콩 새벽 물안개가 걷히길 기다리되, 이미 드러난 분명한 위험 신호는 바로 챙기세요.',
  '나눔·온기': '침묵의 탁발처럼 생색 없는 작은 친절을 건네되, 내 기본 여력까지 비우지는 마세요.',
  '합류·루틴': '남칸 강과 메콩의 합류처럼 오늘의 작은 루틴을 큰 목표와 잇되, 속도는 무리하지 마세요.',
  '비움·계절': '계절에 맞춰 접는 대나무 다리처럼 낡은 방식은 내려놓되, 지켜야 할 핵심 약속은 챙기세요.',
};

function classifyLuangPrabangCategory(q: string): LuangPrabangDawnResult['questionCategory'] {
  if (/나눔|관계|사람|상대|친절|배려/.test(q)) return '나눔·온기';
  if (/루틴|목표|일상|흐름|연결|습관/.test(q)) return '합류·루틴';
  if (/기다림|여유|안개|불안|결정|조급/.test(q)) return '여유·기다림';
  return '비움·계절';
}

const MOTIFS = [
  {
    motif: '메콩강 새벽 물안개(Mekong Mist · 해가 뜨기 전 강물과 산이 한 빛깔로 어우러짐)',
    insight: '아직 윤곽이 또렷하지 않은 일이라도 조급히 단정 짓지 않고 안개가 걷히기를 기다리면 선명해짐',
    tone: '라오스 루앙프라방 강변 위로 보랏빛 새벽 안개가 천천히 흩어지는 고요한 이른 아침',
    ritual: '아직 결론이 안 난 일을 억지로 단정 짓지 말고, 오늘 하루만큼은 안개가 걷히길 기다리는 여유를 두세요.',
    question: '지금은 물안개가 아직 덜 걷혔을 뿐인데, 조급하게 결론부터 내려 버리려던 일은 무엇인가요?',
  },
  {
    motif: '침묵의 탁발 행렬(Silent Alms · 말없이 나누어 주고 말없이 받으며 하루를 시작함)',
    insight: '거창한 설명이나 생색 없이도 조용히 건네는 작은 친절이 하루 전체의 공기를 부드럽게 바꿈',
    tone: '주홍빛 가사와 찹쌀 바구니가 고요한 골목길에서 소리 없이 마음을 주고받는 새벽',
    ritual: '오늘 하루 중 생색내지 않는 작은 배려 하나를 말없이 건네 보세요.',
    question: '거창한 설명이나 생색 없이도, 오늘 조용히 건넬 수 있는 작은 친절은 무엇인가요?',
  },
  {
    motif: '남칸 강과 메콩의 합류(Twin Rivers · 맑은 지류와 웅장한 본류가 부드럽게 섞여 흐름)',
    insight: '내 안의 잔잔한 일상과 큰 목표가 서로 다투지 않고 같은 강물로 흘러가도록 두어야 함',
    tone: '두 강물이 만나는 곶 위에서 야자수 잎이 아침 바람에 살랑이는 평온한 오전',
    ritual: '바쁜 목표와 사소한 일상을 둘로 가르지 말고, 오늘의 작은 루틴이 큰 흐름과 만나는 지점을 확인해 보세요.',
    question: '내 안의 잔잔한 일상과 큰 목표가 서로 다투지 않고, 같은 강물처럼 자연스럽게 합류하는 지점은 어디인가요?',
  },
  {
    motif: '대나무 다리의 계절(Bamboo Bridge · 건기에는 다리를 놓고 우기에는 자연스럽게 거두어 들임)',
    insight: '영원히 붙들고 있어야 할 방식은 없으며, 계절과 상황이 바뀌면 가볍게 접어 둘 줄도 알아야 함',
    tone: '강물 수위에 맞춰 엮은 튼튼한 대나무 다리 위로 사람들이 천천히 걸음을 옮기는 낮',
    ritual: '더 이상 계절에 맞지 않는 오래된 규칙이나 습관 하나를 미련 없이 접어 두세요.',
    question: '계절이 이미 바뀌었는데도 내가 여전히 건기의 대나무 다리처럼 억지로 붙들고 있는 방식은 무엇인가요?',
  },
  {
    motif: '푸시 언덕의 저녁 종소리(Phousi Bell · 하루의 분주함을 둥근 여운 속으로 내려놓음)',
    insight: '오늘 다 끝내지 못한 일이 있더라도 저녁에는 마음을 종소리처럼 둥글게 내려놓고 쉬어야 함',
    tone: '황금빛 석양이 강물 위에 번지는 동안 언덕 위에서 맑고 긴 종소리가 울려 퍼지는 저녁',
    ritual: '하루 일과를 마칠 때, 못다 한 일을 내일 메모로 넘기고 종소리처럼 마음을 둥글게 내려놓아 보세요.',
    question: '해가 저문 뒤에도 손에서 놓지 못하고 있지만, 오늘 저녁 종소리와 함께 부드럽게 내려놓아야 할 일은 무엇인가요?',
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

export function calculateLuangPrabangMekongDawn(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): LuangPrabangDawnResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const mekongDawnAxis = MEKONG_DAWN_AXES[stableHash(`${seed}|axis`) % MEKONG_DAWN_AXES.length];
  const trimmedQ = (params.question ?? '').trim();
  const questionTopic = trimmedQ
    ? trimmedQ.slice(0, 36)
    : '계절에 맞춰 놓고 거두는 고요한 호흡';
  const questionCategory = classifyLuangPrabangCategory(trimmedQ || questionTopic);
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionCategory];

  return {
    engineVersion: 'LUCKEY-LAO-MEKONG-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    questionCategory,
    mekongMotif: picked.motif,
    companionMotif: companion.motif,
    mekongDawnAxis,
    topicBalanceHint,
    luangPrabangInsight: `${picked.insight} (동반 모티프: ${companion.motif})`,
    dawnTone: picked.tone,
    reflectionFocus: `질문 맥락('${questionTopic}')에서 루앙프라방 메콩 새벽의 '${picked.motif}'와 메콩 새벽 축('${mekongDawnAxis}')을 함께 살피며, 안개 속에서 서두르기보다 계절에 맞춰 놓거나 거두는 고요한 호흡을 지켜 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    shadowWarning: '안개가 걷히길 기다린다는 이유로 이미 드러난 위험 신호나 지금 건네야 할 솔직한 한마디까지 미루지 않도록 살피세요.',
    interpretiveBoundary: '라오스 루앙프라방의 메콩 새벽·탁발 나눔·대나무 다리 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatLuangPrabangDawnPrompt(res: LuangPrabangDawnResult): string {
  return [
    `[루앙프라방·메콩 새벽 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} (분류: ${res.questionCategory})`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 메콩 모티프: ${res.mekongMotif} (${res.dawnTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 메콩 새벽 축: ${res.mekongDawnAxis}`,
    `- 중심 통찰: ${res.luangPrabangInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
