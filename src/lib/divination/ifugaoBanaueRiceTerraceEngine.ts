import type { UserProfile } from '../sharedState';

export interface IfugaoTerraceResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '원천·숲' | '계단·나눔' | '리듬·거울' | '계단논 전반';
  ifugaoMotif: string;
  companionMotif: string;
  terraceWaterAxis: string;
  ifugaoInsight: string;
  terraceTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '무용 숲의 물 저장고(Muyong Forest · 논 위쪽의 원시림을 베지 않고 지켜 아래 논에 물을 공급함)',
    insight: '당장 쓰이는 성과물(논)만 돌보지 말고, 그 물줄기를 만들어 주는 보이지 않는 원천(숲)을 아껴야 함',
    tone: '필리핀 코르디예라 산맥 꼭대기의 푸른 안개 숲에서 맑은 물방울이 아래 계단논으로 스며드는 아침',
    action: '오늘 내 에너지와 영감의 원천(휴식, 독서, 산책 등)을 지키는 시간 15분을 일정표에 먼저 심어 두세요.',
    question: '당장 눈앞의 논에서 수확하는 데 급급해, 내가 정작 돌보지 못하고 있던 위쪽 무용 숲은 무엇인가요?',
  },
  {
    motif: '가파른 비탈의 돌담 계단(Stone-Walled Terrace · 산비탈을 따라 층층이 평평한 자리를 만듦)',
    insight: '경사가 가파르고 불리한 조건이라도 한 단씩 계단을 내어 쌓으면 농사를 지을 평평한 터가 생김',
    tone: '구름 위로 솟아오른 산비탈마다 이끼 낀 돌담과 초록빛 물논이 거울처럼 하늘을 비추는 오전',
    action: '가파르게 느껴지는 큰 과제를 오늘 바로 디딜 수 있는 평평한 한 단의 크기로 쪼개어 놓으세요.',
    question: '비탈이 가파르다고 포기하기 전에, 내가 한 단의 돌담부터 쌓아 평평하게 만들 수 있는 자리는 어디인가요?',
  },
  {
    motif: '대나무 수로의 나눔(Bamboo Aqueduct · 위쪽 물길을 대나무로 이어 아래 이웃의 논까지 적심)',
    insight: '내가 가진 자원과 여력을 혼자만 가두지 않고 아래로 흘려보낼 때 전체 산자락이 함께 살아남',
    tone: '대나무 홈통을 타고 흐른 맑은 물이 여러 단의 논으로 고르게 떨어지는 정오',
    action: '내가 알고 있거나 가진 작은 여력 하나를 주변 사람에게 기꺼이 흘려보내는 대나무 수로를 이어 보세요.',
    question: '내 손에 쥐고만 있어서 고여 있던 것 중, 아래로 흘려보내면 모두가 함께 살아날 물길은 무엇인가요?',
  },
  {
    motif: '후드후드 서사시의 노랫가락(Hudhud Chant · 모내기와 수확 때마다 공동체가 이야기를 노래함)',
    insight: '고된 노동 속에서도 함께 부르는 리듬과 이야기가 있으면 지치지 않고 먼 길을 건너갈 수 있음',
    tone: '선선한 산바람이 부는 오후, 계단논을 따라 정다운 노랫소리가 메아리치는 풍경',
    action: '반복되는 일과를 묵묵히 견디기보다 좋아하는 음악이나 동료와의 짧은 대화로 내 리듬을 살려 보세요.',
    question: '고된 일과 속에서 내 마음을 지치지 않게 지탱해 줄 나만의 노랫가락과 리듬은 무엇인가요?',
  },
  {
    motif: '물논 거울에 비친 저녁별(Mirror Terrace · 물이 찬 논바닥에 하늘과 구름이 고요히 내려앉음)',
    insight: '바쁘게 일군 하루 끝에는 마음의 수면을 잔잔히 가라앉혀 하늘빛을 비추어 보는 시간이 필요함',
    tone: '해 질 녘 보랏빛 하늘과 별빛이 층층의 물논 위에 그대로 비치는 고요한 저녁',
    action: '하루를 마감하기 전 5분만 화면을 끄고, 오늘 일군 마음을 잔잔한 물논처럼 고요히 가라앉혀 보세요.',
    question: '일군 뒤에 바로 다음 일을 찾느라 정작 물논 거울에 하늘빛을 비춰 볼 틈조차 없었던 것은 아닐까요?',
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

const IFUGAO_SHADOWS = [
  '원천인 숲을 아낀다고 휴식에만 머무르다 지금 물길을 열어 주어야 할 아래 논을 마르게 두지는 마세요.',
  '가파른 비탈에 계단을 한 단씩 쌓되 지금 쌓은 돌담이 내 체력과 시간으로 감당 가능한 기울기인지 살피세요.',
  '아래로 물을 흘려보내는 나눔이 내 논에 최소한으로 남길 물까지 모두 비워 버리는 무리가 되지 않도록 하세요.',
  '즐거운 리듬과 노래를 챙기되 정작 손발을 움직여야 할 모내기와 수확의 마감 시간을 놓치지 마세요.',
  '물논 거울에 하늘을 비추어 보는 고요한 시간 뒤에는 다시 내일 아침 물꼬를 트는 실제 행동이 이어져야 합니다.',
];

function classifyIfugaoTopic(q: string): IfugaoTerraceResult['questionTopic'] {
  if (/숲|원천|에너지|휴식|물줄기/.test(q)) return '원천·숲';
  if (/계단|비탈|나눔|수로|쪼개/.test(q)) return '계단·나눔';
  if (/리듬|노래|거울|마감|고요/.test(q)) return '리듬·거울';
  return '계단논 전반';
}

export function calculateIfugaoBanaueRiceTerrace(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): IfugaoTerraceResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyIfugaoTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const terraceWaterAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const shadowWarning = IFUGAO_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-IFUGAO-TERRACE-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    ifugaoMotif: picked.motif,
    companionMotif: companion.motif,
    terraceWaterAxis,
    ifugaoInsight: picked.insight,
    terraceTone: picked.tone,
    reflectionFocus: `이푸가오 계단논의 '${picked.motif}'처럼, 당장의 결과물뿐 아니라 그 물을 대어 주는 내 안의 무용 숲을 먼저 돌보세요. (동반 결: ${companion.motif.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '필리핀 코르디예라 이푸가오·바나우에 계단논과 무용 숲 수자원 순환 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatIfugaoTerracePrompt(res: IfugaoTerraceResult): string {
  return [
    `[이푸가오·바나우에 계단논 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 계단논·물길 축: ${res.terraceWaterAxis}`,
    `- 이푸가오 모티프: ${res.ifugaoMotif} (${res.terraceTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.ifugaoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
