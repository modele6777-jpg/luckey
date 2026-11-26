import type { UserProfile } from '../sharedState';

export interface DalmatianStoneResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '경계·정리' | '관계·쉼' | '자존·회복' | '평온 전반';
  dalmatianMotif: string;
  companionMotif: string;
  limestoneBreezeAxis: string;
  topicBalanceHint: string;
  dalmatianInsight: string;
  adriaticTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '스타리 그라드의 석회암 경계(Limestone Terraces · 돌을 골라내어 밭을 만들고 그 돌로 담을 쌓음)',
    insight: '방해물로 보이던 거친 돌멩이들을 버리지 않고 질서 있게 쌓으면 오히려 밭을 지키는 울타리가 됨',
    tone: '크로아티아 흐바르 섬의 따스한 아침 햇살 아래 하얀 석회암 계단 밭이 길게 이어진 풍경',
    ritual: '오늘 걸림돌처럼 느껴졌던 일 하나를 버리지 말고, 내 일상을 정리하는 경계석으로 활용해 보세요.',
    question: '지금 내가 치워 버리고 싶었던 돌멩이 중에, 사실은 내 울타리를 세울 수 있는 재료는 무엇인가요?',
  },
  {
    motif: '아드리아의 라벤더 바람(Lavender Breeze · 메마른 돌 틈에서도 보라색 꽃이 깊고 맑은 향을 냄)',
    insight: '조건이 넉넉하지 않고 척박해 보이는 자리일수록 내 안의 고유한 향기가 더 선명해질 수 있음',
    tone: '바닷바람을 타고 연보라색 라벤더 물결이 돌담 사이를 부드럽게 스쳐 가는 오전',
    ritual: '조건이 아쉽게 느껴지는 오늘, 내가 이미 가진 작은 장점 하나를 정성스레 드러내 보세요.',
    question: '척박해 보이는 조건 속에서도 오히려 더 선명하게 피어날 수 있는 나만의 향기는 무엇인가요?',
  },
  {
    motif: '오래된 올리브나무의 매듭(Gnarled Olive · 휘어진 가지마다 수백 년의 가뭄과 바람을 견딘 흔적)',
    insight: '매끈하고 반듯하게만 자라지 못했어도, 구부러진 마디마다 삶을 버텨 낸 단단한 힘이 깃듦',
    tone: '은빛 올리브 잎사귀가 정오의 눈부신 햇살 아래 잔잔히 반짝이는 낮',
    ritual: '과거의 시행착오나 돌아온 길 하나를 후회 대신 지금의 단단한 매듭으로 인정해 주세요.',
    question: '매끈하지 못해 아쉬웠던 내 삶의 굽이 중, 오늘 나를 가장 단단하게 지탱해 주는 마디는 무엇인가요?',
  },
  {
    motif: '돌집의 짙은 나무 덧문(Wooden Shutters · 한낮의 뜨거운 빛을 잠시 가려 집 안을 서늘히 유지함)',
    insight: '외부의 자극이 너무 뜨거울 때는 잠시 덧문을 닫고 내 안의 서늘한 그늘에서 숨을 고를 줄 알아야 함',
    tone: '골목길 하얀 돌집의 초록색 덧문 사이로 시원한 바닷바람이 들어오는 오후',
    ritual: '오늘 알림이나 외부 소음이 과하게 느껴질 때 15분만 화면을 닫고 조용한 그늘에서 숨을 고르세요.',
    question: '바깥의 뜨거운 자극을 잠시 가려야 내 안의 서늘한 평온이 돌아올 시간은 언제인가요?',
  },
  {
    motif: '포구 등대의 잔잔한 물결(Harbor Reflection · 해가 진 뒤 작은 배들이 밧줄에 매여 고요히 흔들림)',
    insight: '하루의 항해를 마친 뒤에는 파도를 더 이기려 하지 말고 포구의 밧줄에 나를 맡겨 쉬어야 함',
    tone: '붉은 기와지붕 위로 황혼이 내리고 잔잔한 항구 물결에 불빛이 하나둘 켜지는 저녁',
    ritual: '오늘 밤 잠들기 전에는 내일 걱정을 내려놓고 오늘 하루를 무사히 마친 나에게 고요한 마침표를 찍어 주세요.',
    question: '파도를 더 이기려 애쓰기보다 포구의 밧줄에 나를 매어 두고 쉬어도 될 일은 무엇인가요?',
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

const DALMATIAN_SHADOWS = [
  '돌담을 너무 높게 쌓느라 정작 바깥에서 불어오는 반가운 바람과 새 소식까지 막지 않도록 살피세요.',
  '척박한 자리에서 버티는 데 익숙해져, 더 나은 환경으로 옮기거나 도움을 청할 기회마저 마다하지 마세요.',
  '지나간 매듭을 긍정하는 데서 멈추지 말고, 지금 곧바로 펴야 할 습관은 부드럽게 손보도록 하세요.',
  '덧문을 닫고 쉬는 시간이 길어져 꼭 열어야 할 대화의 창문까지 닫아 두지 않도록 시간을 정해 두세요.',
  '항구의 평온에 안주해 내일 아침 다시 닻을 올릴 준비와 점검까지 미루지 않도록 균형을 잡으세요.',
];

const TOPIC_BALANCE_HINTS: Record<DalmatianStoneResult['questionTopic'], string> = {
  '경계·정리': '걸림돌이던 돌을 골라 담을 세우되, 반가운 바람과 새 소식이 드나들 문은 열어 두세요.',
  '관계·쉼': '뜨거운 한낮의 빛을 가리는 덧문처럼, 정해진 시간만큼 숨을 고른 뒤 다시 대화의 창을 여세요.',
  '자존·회복': '척박한 돌 틈에서도 향기를 내는 라벤더처럼 이미 가진 고유한 강점을 먼저 긍정해 보세요.',
  '평온 전반': '하루의 항해를 마친 배가 밧줄에 매여 쉬듯, 밤에는 내일의 파도 걱정을 잠시 내려놓으세요.',
};

function classifyDalmatianTopic(q: string): DalmatianStoneResult['questionTopic'] {
  if (/돌|울타리|경계|정리|일|집/.test(q)) return '경계·정리';
  if (/관계|쉼|휴식|그늘|사람|대화/.test(q)) return '관계·쉼';
  if (/자존|회복|향기|매듭|후회/.test(q)) return '자존·회복';
  return '평온 전반';
}

export function calculateDalmatianStoneLavenderCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): DalmatianStoneResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyDalmatianTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const limestoneBreezeAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = DALMATIAN_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-DALMATIAN-STONE-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    dalmatianMotif: picked.motif,
    companionMotif: companion.motif,
    limestoneBreezeAxis,
    topicBalanceHint,
    dalmatianInsight: picked.insight,
    adriaticTone: picked.tone,
    reflectionFocus: `달마티아 석축의 '${picked.motif}'과 동반 결 '${companion.motif}'을 함께 헤아리며, 거친 돌멩이를 내 밭을 지키는 울타리로 바꾸고 서늘한 그늘에서 숨을 골라 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '아드리아해 크로아티아 달마티아·흐바르 섬의 석축 밭과 라벤더 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatDalmatianStonePrompt(res: DalmatianStoneResult): string {
  return [
    `[달마티아·라벤더 석축 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 석축 축: ${res.limestoneBreezeAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 달마티아 모티프: ${res.dalmatianMotif} (${res.adriaticTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.dalmatianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
