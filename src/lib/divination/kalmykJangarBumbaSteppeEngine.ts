import type { UserProfile } from '../sharedState';

export interface KalmykJangarResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '공존·여백' | '신의·서사' | '기백·등불' | '붐바 전반';
  bumbaMotif: string;
  companionMotif: string;
  steppeEpicAxis: string;
  jangarInsight: string;
  caspianTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  topicBalanceHint: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '붐바(Bumba · 모두가 평화롭게 공존하는 초원의 낙원)',
    insight: '누군가를 꺾어야만 내가 이기는 것이 아니라 모두가 함께 숨 쉴 수 있는 넉넉한 여백을 그리는 시선',
    tone: '카스피해 북쪽 초원 위로 끝없이 펼쳐진 연꽃 핀 습지',
    action: '오늘 누군가와 부딪히기 쉬운 자리에서 내 몫을 다투기 전에, 모두가 숨 쉴 수 있는 여백 한 칸을 먼저 남겨 보세요.',
    question: '눈앞의 작은 이득을 다투기보다 모두가 숨 쉴 수 있는 붐바의 시선으로 본다면, 지금 어떤 선택이 가장 넉넉할까요?',
  },
  {
    motif: '쟌가르(Jangar)의 맹세 · 흔들리지 않는 신의와 우정',
    insight: '말을 번복하지 않고 한 번 맺은 약속을 소중히 여길 때 저절로 모이는 단단한 신뢰',
    tone: '둥근 게르 천막 안에서 나누는 따뜻한 짭짤한 차(좀바)',
    action: '오늘 내가 지킨 작은 약속 하나를 돌아보며, 그 약속이 만들어 준 신뢰의 온기를 느껴 보세요.',
    question: '요즘 내 관계와 일에서 말보다 한결같은 신의(Jangar)로 끝까지 지켜내고 싶은 약속은 무엇인가요?',
  },
  {
    motif: '쟌가르치(Jangarchi · 서사를 노래하는 음유시인)',
    insight: '지금의 고단한 하루도 먼 훗날 내가 들려줄 멋진 이야기의 한 장으로 바라보는 여유',
    tone: '밤바람 속에서 고요히 울려 퍼지는 돔브라 현악기의 장단',
    action: '오늘 겪은 고단한 장면 하나를 불평 대신 먼 훗날 들려줄 이야기의 한 대목처럼 한 줄로 적어 보세요.',
    question: '지금의 버거운 순간을 훗날 내가 웃으며 들려줄 서사의 한 장으로 바라본다면, 어떤 의미가 보이나요?',
  },
  {
    motif: '아란잘(Aranzal · 바람처럼 달리는 준마의 기백)',
    insight: '주저하며 제자리에 맴돌기보다 마음이 가리키는 바른 방향을 향해 시원하게 내달리는 추진력',
    tone: '붉은 야생 튤립이 핀 봄 초원을 가르는 상쾌한 바람',
    action: '이미 마음이 가리키는 방향이 분명한 일 하나를 골라, 계산을 멈추고 오늘 안에 가볍게 첫 발을 내달려 보세요.',
    question: '방향은 정해졌는데도 지나친 걱정 때문에 준마 아란잘처럼 내달리지 못하고 멈춰 서 있는 일은 무엇인가요?',
  },
  {
    motif: '줄(Zul · 겨울 한가운데 밝히는 천 개의 등불)',
    insight: '계절이 가장 춥고 어두워 보일 때도 내 안의 희망의 불씨 하나는 꺼뜨리지 않는 따뜻함',
    tone: '겨울 저녁 집집마다 밝힌 작은 버터 등불의 포근한 빛',
    action: '마음이 식거나 막막해질수록 오늘 내 마음을 데워 줄 작은 빛(따뜻한 차, 안부 인사, 휴식)을 하나 켜 두세요.',
    question: '계절이 차갑게 느껴질수록 내가 끝까지 꺼뜨리지 않고 지켜야 할 마음속 등불(Zul)은 무엇인가요?',
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

const KALMYK_SHADOWS = [
  '모두가 함께 숨 쉴 여백을 남기려다 내가 정작 지켜야 할 정당한 몫과 책임의 선까지 흐려 버리지 마세요.',
  '한 번 맺은 신의와 약속을 지키는 것은 귀하지만 이미 전제가 깨진 약속에 나만 홀로 묶여 있지 않도록 살피세요.',
  '고단한 오늘을 서사의 한 장으로 바라보는 여유가 지금 당장 해결해야 할 실질적 문제를 미화하는 핑계가 되지 않게 하세요.',
  '준마 아란잘처럼 시원하게 내달릴 때에도 지형과 말의 숨 고르기, 즉 내 체력과 자원의 한계를 함께 살피세요.',
  '어두운 시기에 작은 등불을 지키는 따뜻함 뒤에는 내일 다시 길을 밝힐 땔감과 휴식을 채우는 현실적 돌봄이 필요합니다.',
];

function classifyKalmykTopic(q: string): KalmykJangarResult['questionTopic'] {
  if (/공존|여백|시야|초원|넓/.test(q)) return '공존·여백';
  if (/신의|약속|우정|서사|이야기/.test(q)) return '신의·서사';
  if (/기백|추진|방향|등불|희망/.test(q)) return '기백·등불';
  return '붐바 전반';
}

const KALMYK_TOPIC_HINTS: Record<KalmykJangarResult['questionTopic'], string> = {
  '공존·여백': '공존과 여백을 지킬수록 내 책임의 경계도 함께 분명히 세우세요.',
  '신의·서사': '지킨 약속과 지나온 서사를 소중히 여기되 오늘의 현실 점검도 놓치지 마세요.',
  '기백·등불': '바람을 가르는 기백과 어둠 속 등불의 온기를 체력 안배와 함께 이어 가세요.',
  '붐바 전반': '초원의 넉넉한 시야와 흔들리지 않는 신의를 오늘 한 걸음에 담아 보세요.',
};

export function calculateKalmykJangarBumbaSteppe(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KalmykJangarResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyKalmykTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const steppeEpicAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const shadowWarning = KALMYK_SHADOWS[idx];
  const topicBalanceHint = KALMYK_TOPIC_HINTS[questionTopic];

  return {
    engineVersion: 'LUCKEY-KALMYK-JANGAR-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    bumbaMotif: picked.motif,
    companionMotif: companion.motif,
    steppeEpicAxis,
    jangarInsight: picked.insight,
    caspianTone: picked.tone,
    reflectionFocus: `칼미크 《쟌가르》 서사시의 '${picked.motif}'처럼, 조급한 경쟁심을 내려놓고 넓은 초원의 넉넉한 시야와 신의를 지켜 보세요. (동반 결: ${companion.motif.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning,
    topicBalanceHint,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '칼미크(Kalmyk) 민족 서사시 《쟌가르》의 붐바 이상향과 초원 신의 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKalmykJangarPrompt(res: KalmykJangarResult): string {
  return [
    `[칼미크 쟌가르·붐바 초원 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 붐바·서사 축: ${res.steppeEpicAxis}`,
    `- 초원 상징: ${res.bumbaMotif} (${res.caspianTone})`,
    `- 동반 상징: ${res.companionMotif}`,
    `- 중심 통찰: ${res.jangarInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
