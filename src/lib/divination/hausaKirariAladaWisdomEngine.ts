import type { UserProfile } from '../sharedState';

export interface HausaKirariAladaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '인내·품격' | '신뢰·약속' | '경청·자부심' | '알아다 전반';
  proverbSign: string;
  companionSign: string;
  sahelDignityAxis: string;
  topicBalanceHint: string;
  aladaInsight: string;
  sahelTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PROVERBS = [
  {
    sign: '하쿠리(Hakuri · 큰 강을 건너는 인내)',
    insight: '당장 눈앞의 작은 반응에 일희일비하지 않고 긴 호흡으로 상황을 품을 때 얻어지는 주도권',
    tone: '사헬의 붉은 대지 위로 느긋하게 흐르는 나이저 강물',
    action: '오늘 즉각 답해야 할 것 같은 자극이 와도 10분만 숨을 고른 뒤 긴 호흡으로 반응해 보세요.',
    question: '지금 내가 조급함에 휘둘리지 않고 인내(Hakuri)와 품격으로 지켜내고 싶은 핵심 가치는 무엇인가요?',
  },
  {
    sign: '키라리(Kirari · 자신의 장점을 부르는 당당한 호명)',
    insight: '남과 비교하며 스스로를 작게 만들기보다 내가 이미 해낸 몫과 강점을 또렷이 인정하는 태도',
    tone: '카노(Kano) 성문 앞 아침 시장에 울리는 활기찬 인사 소리',
    action: '오늘 내가 잘해낸 일 한 가지와, 내 안의 분명한 강점 한 가지를 소리 내어 스스로 불러 주세요.',
    question: '남과 비교하느라 작게 여겼지만 사실은 이미 단단하게 해내고 있는 나만의 강점은 무엇인가요?',
  },
  {
    sign: '무툰치(Mutunci · 누구 앞에서도 지키는 존중과 품격)',
    insight: '상대의 지위나 상황과 무관하게 정중한 태도를 유지할 때 오히려 내 자리가 단단해지는 이치',
    tone: '바오밥 나무 그늘 아래 마시는 시원한 생강차 한 잔',
    action: '오늘 마주치는 사람 누구에게든, 특히 편하거나 바쁜 순간일수록 정중한 첫인사를 건네 보세요.',
    question: '피곤하거나 급하다는 이유로 무심코 지나쳤던, 내가 다시 세우고 싶은 정중한 품격은 어디에 있나요?',
  },
  {
    sign: '아마나(Amana · 맡겨진 신뢰를 끝까지 지킴)',
    insight: '크고 화려한 약속보다 사소한 약속 하나를 제때 지켜내는 성실함이 쌓여 만드는 힘',
    tone: '햇볕에 잘 말린 인디고 염색 천의 깊고 변치 않는 푸른빛',
    action: '누군가에게 건넨 작은 약속이나 스스로에게 한 다짐 하나를 오늘 안에 정확히 지켜 내 보세요.',
    question: '화려한 말보다 묵묵한 실행으로 끝까지 지켜 내고 싶은 오늘의 작은 약속(Amana)은 무엇인가요?',
  },
  {
    sign: '샤와라(Shawara · 지혜로운 이에게 먼저 묻는 경청)',
    insight: '혼자 고집으로 밀어붙이다 길을 잃기 전에 경험 있는 시선 한 번을 빌려오는 유연함',
    tone: '저녁 별빛 아래 흙벽 마당에서 나누는 어른들의 담소',
    action: '혼자 끙끙대던 문제 하나를 놓고, 믿을 만한 사람의 시선이나 조언을 한 문장만 먼저 물어보세요.',
    question: '혼자 힘으로만 밀어붙이느라 정작 지혜로운 이의 시선(Shawara)을 구하지 않고 있던 일은 무엇인가요?',
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

const HAUSA_SHADOWS = [
  '긴 호흡의 인내를 지키려다 지금 당장 바로잡아야 할 부당한 선이나 긴급한 대응까지 미루지 마세요.',
  '내 강점을 당당히 부르는 자부심이 타인의 몫을 가볍게 보거나 고집으로 굳어지지 않도록 살피세요.',
  '정중한 품격을 유지하는 데 신경 쓰다 정작 꼭 전해야 할 솔직한 거절이나 의견까지 삼키지 마세요.',
  '사소한 약속을 지키는 성실함 속에서도 이미 상황이 바뀐 무리한 다짐은 제때 다시 조율하세요.',
  '지혜로운 이의 시선을 구하는 경청 뒤에는 결국 내가 직접 선택하고 책임져야 할 결단이 따릅니다.',
];

const HAUSA_TOPIC_HINTS: Record<HausaKirariAladaResult['questionTopic'], string> = {
  '인내·품격': '긴 호흡으로 상황을 품되 지금 바로잡아야 할 분명한 선은 놓치지 않는 균형이 필요합니다.',
  '신뢰·약속': '작은 약속을 끝까지 지키는 성실함과 바뀐 현실을 조율하는 유연함이 함께 갈 때 신뢰가 깊어집니다.',
  '경청·자부심': '내 강점을 당당히 세우면서도 경험 있는 이의 시선을 가볍게 여기는 열린 귀를 남겨 두세요.',
  '알아다 전반': '인내의 품격과 성실한 실행이 조화를 이룰 때 흔들리지 않는 주도권이 세워집니다.',
};

function classifyHausaTopic(q: string): HausaKirariAladaResult['questionTopic'] {
  if (/인내|품격|호흡|조급|존중/.test(q)) return '인내·품격';
  if (/신뢰|약속|성실|책임|실행/.test(q)) return '신뢰·약속';
  if (/경청|조언|강점|자부심|비교/.test(q)) return '경청·자부심';
  return '알아다 전반';
}

export function calculateHausaKirariAladaWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HausaKirariAladaResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyHausaTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PROVERBS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PROVERBS.length - 1));
  const picked = PROVERBS[idx];
  const companion = PROVERBS[(idx + companionOffset) % PROVERBS.length];
  const sahelDignityAxis = `${picked.sign.split('(')[0].trim()} ↔ ${companion.sign.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = HAUSA_TOPIC_HINTS[questionTopic];
  const shadowWarning = HAUSA_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-HAUSA-KIRARI-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    proverbSign: picked.sign,
    companionSign: companion.sign,
    sahelDignityAxis,
    topicBalanceHint,
    aladaInsight: picked.insight,
    sahelTone: picked.tone,
    reflectionFocus: `서아프리카 하우사 지혜의 '${picked.sign}'처럼, 오늘의 결정에서는 순간의 감정보다 긴 신뢰(Amana)와 내면의 품격을 먼저 세워 보세요. (동반 결: ${companion.sign.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '서아프리카 하우사(Hausa) 전통의 키라리(Kirari)·아마나(Amana) 인격 수양 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHausaKirariPrompt(res: HausaKirariAladaResult): string {
  return [
    `[하우사 키라리·알아다 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 사헬·품격 축: ${res.sahelDignityAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 격언 상징: ${res.proverbSign} (${res.sahelTone})`,
    `- 동반 상징: ${res.companionSign}`,
    `- 중심 통찰: ${res.aladaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
