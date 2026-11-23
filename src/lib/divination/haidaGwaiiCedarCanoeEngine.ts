import type { UserProfile } from '../sharedState';

export interface HaidaGwaiiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '부력·비움' | '순환·연대' | '호흡·거름' | '항해 전반';
  haidaMotif: string;
  companionMotif: string;
  cedarTideAxis: string;
  haidaInsight: string;
  cedarTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '붉은 삼나무 카누(Red Cedar Canoe · 거대한 나무의 속을 비워 거친 태평양 파도를 가볍게 넘음)',
    insight: '무겁게 채우기보다 불필요한 욕심과 걱정을 조용히 비워 낼 때 비로소 큰 파도를 넘을 부력이 생김',
    tone: '안개 낀 하이다 과이 해안 위로 삼나무 카누의 뱃머리가 잔잔한 물결을 가르며 나아가는 새벽',
    ritual: '오늘 머릿속을 무겁게 채우던 걱정이나 할 일 목록에서 당장 안 해도 되는 것 하나를 과감히 비워 보세요.',
    question: '지금 내 카누를 너무 무겁게 눌러서 오히려 물살을 타기 어렵게 만드는 짐은 무엇인가요?',
  },
  {
    motif: '포틀래치의 나눔 순환(Potlatch Gift · 많이 모은 것을 기꺼이 나누며 공동체의 균형을 맞춤)',
    insight: '내가 가진 여유나 좋은 정보를 쥐고만 있지 않고 나눌 때 관계와 기운이 더 넓게 순환함',
    tone: '이끼 낀 전나무 숲 앞 넓은 나무 회관에서 사람들이 따뜻한 온기를 나누는 저녁',
    ritual: '오늘 내가 가진 정보나 시간의 여력 한 가지를 곁에 있는 사람에게 기꺼이 먼저 건네 보세요.',
    question: '쥐고만 있을 때보다 곁과 나누었을 때 오히려 더 크게 순환할 내 자원은 무엇인가요?',
  },
  {
    motif: '형태선 문양의 조화(Formline Flow · 끊기지 않고 둥글게 이어지는 검은 선과 붉은 선의 호흡)',
    insight: '하루의 일과들도 딱딱하게 단절되기보다 둥근 선처럼 자연스럽게 다음 호흡으로 이어질 때 편안함',
    tone: '삼나무 판자 위에 유려하고 힘 있는 곡선 문양이 살아 숨 쉬듯 그려진 작업실',
    ritual: '일과와 일과 사이를 뚝 끊어 내기보다, 5분 호흡으로 다음 흐름까지 자연스럽게 이어 보세요.',
    question: '오늘 내 하루의 선을 뚝 끊어지게 만들던 조급함을 둥근 호흡으로 바꾼다면 어떤 모양일까요?',
  },
  {
    motif: '안개 숲의 이끼 융단(Mossy Old-Growth · 수백 년 된 나무들이 쓰러진 나무를 품어 새 싹을 키움)',
    insight: '지나간 실패나 멈춤도 그냥 버려지는 것이 아니라 다음 성장을 받쳐 주는 촉촉한 거름이 됨',
    tone: '비 온 뒤 연두빛 이끼가 거대한 삼나무 뿌리를 포근히 감싸 안고 있는 정적의 숲',
    ritual: '예전에 멈춰 두었거나 아쉬웠던 경험 하나에서 오늘 다시 써먹을 수 있는 거름 한 가지를 건져 보세요.',
    question: '지나간 멈춤이나 시행착오 가운데, 지금의 나를 오히려 포근히 받쳐 주고 있는 거름은 무엇인가요?',
  },
  {
    motif: '조수 간만의 모래톱(Intertidal Rhythm · 밀물과 썰물이 바뀔 때마다 바다가 새로운 선물을 남김)',
    insight: '무언가 빠져나가는 썰물의 시간에도 그 자리에만 남는 조개와 해초처럼 나만의 몫이 드러남',
    tone: '썰물이 물러간 짙은 자갈 해변 위로 은빛 물웅덩이들이 하늘을 비추는 오후',
    ritual: '빠져나가는 것에 아쉬워하기보다, 지금 물이 빠진 자리에 선명하게 남은 내 몫 한 가지를 챙겨 보세요.',
    question: '바쁜 밀물이 물러간 뒤에야 비로소 내 손바닥에 또렷이 남는 나만의 몫은 무엇인가요?',
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

const HAIDA_SHADOWS = [
  '가볍게 비워 부력을 키우려다 정작 험한 물살을 버텨 줄 꼭 필요한 식량과 노까지 내려놓지 마세요.',
  '아낌없이 나누며 순환을 만들되 내 카누가 가라앉지 않을 최소한의 여력까지 모두 내어주지는 마세요.',
  '둥근 호흡으로 자연스럽게 잇는 데만 신경 쓰다 꼭 매듭짓고 끊어 내야 할 경계선까지 흐리지 마세요.',
  '지나간 멈춤에서 거름을 길어 올리되 옛 시행착오를 되새기며 오늘의 새 싹을 밟지 않도록 살피세요.',
  '썰물 뒤에 남은 내 몫을 챙기는 동안 다시 밀려올 다음 밀물의 방향과 시간표도 함께 살펴 두세요.',
];

function classifyHaidaTopic(q: string): HaidaGwaiiResult['questionTopic'] {
  if (/비움|짐|가볍|부력|카누/.test(q)) return '부력·비움';
  if (/나눔|순환|관계|공동체|여력/.test(q)) return '순환·연대';
  if (/호흡|거름|멈춤|실패|물때/.test(q)) return '호흡·거름';
  return '항해 전반';
}

export function calculateHaidaGwaiiCedarCanoe(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HaidaGwaiiResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyHaidaTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const cedarTideAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const shadowWarning = HAIDA_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-HAIDA-GWAII-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    haidaMotif: picked.motif,
    companionMotif: companion.motif,
    cedarTideAxis,
    haidaInsight: picked.insight,
    cedarTone: picked.tone,
    reflectionFocus: `하이다 과이 삼나무 카누의 '${picked.motif}'과 동반 결 '${companion.motif}'을 함께 헤아리며, 마음을 가볍게 비워 파도를 넘는 부력을 키워 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '태평양 북서부 하이다 과이의 삼나무 카누·포틀래치·형태선 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHaidaGwaiiPrompt(res: HaidaGwaiiResult): string {
  return [
    `[하이다 과이·삼나무 카누 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 삼나무·물때 축: ${res.cedarTideAxis}`,
    `- 하이다 모티프: ${res.haidaMotif} (${res.cedarTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.haidaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
