import type { UserProfile } from '../sharedState';

export interface NahuaXochitlResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: string;
  xochitlMotif: string;
  companionMotif: string;
  xochitlBreathAxis: string;
  nahuaInsight: string;
  valleyTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const XOCHITL_BREATH_AXES = [
  '진실한 언어(Cuicatl) · 오늘의 작은 꽃(Xochitl) 공명',
  '흔들림(Ollin) 인지 · 중심 재정렬 순환',
  '맑은 거울(Tlamatini) 비춤 · 내면 비취 보존',
  '치남파 물 위 뿌리 · 매일의 작은 정성 이어가기',
] as const;

const MOTIFS = [
  {
    motif: '꽃과 노래(In Xochitl In Cuicatl · 시와 진실이 흙 위의 삶에 잠깐 피어나 마음을 잇는 숨결)',
    insight: '모든 것이 흘러가는 자리에서도 정성껏 건넨 말 한마디와 작은 아름다움이 오늘을 살아 있게 함',
    tone: '텍스코코 호수의 아침 물안개 사이로 이슬을 머금은 금잔화 꽃잎이 피어오르는 풍경',
    ritual: '오늘 하루 동안 스스로에게나 가까운 사람에게 진심이 담긴 따뜻한 말 한 줄을 꾸밈없이 건네 보세요.',
    question: '사라지지 않을 완벽한 결과만 기다리느라, 오늘 내 곁에 피어난 작은 ‘꽃과 노래’를 지나치고 있지는 않나요?',
  },
  {
    motif: '네트사우알코요틀의 비취(Jade & Quetzal · 맑은 깨달음은 부서지지 않는 보석처럼 마음에 남음)',
    insight: '외부의 칭찬이나 소유는 바람처럼 지나가도, 스스로 닦아 둔 진실한 마음결은 흩어지지 않음',
    tone: '멕시코 고원의 맑은 공기 속에서 푸른 케찰 깃털과 비취 구슬이 햇살을 머금은 모습',
    ritual: '바깥의 박수나 평가가 없어도 내 마음속에 보석처럼 남기고 싶은 진실한 태도 한 가지를 정해 지켜 보세요.',
    question: '외부의 칭찬이나 소유가 지나간 뒤에도, 내 마음속에 비취처럼 단단히 남을 진실한 결은 무엇인가요?',
  },
  {
    motif: '네 개의 움직임 올린(Ollin · 균형이 흔들릴 때마다 중심을 다시 세우는 살아 있는 리듬)',
    insight: '완벽하게 멈춰 있는 안정은 없으며, 흔들림을 알아차리고 다시 중심을 잡는 과정 자체가 삶임',
    tone: '화산 능선 너머로 구름이 흩어졌다 모이며 땅과 하늘이 숨을 맞추는 고원의 낮',
    ritual: '균형이 조금 흔들렸다고 자책하지 말고, 천천히 숨을 고르며 중심을 다시 세우는 리듬을 느껴 보세요.',
    question: '완벽히 멈춘 안정만 쫓기보다, 흔들릴 때마다 다시 중심을 잡아 나가는 나만의 리듬은 무엇인가요?',
  },
  {
    motif: '틀라매티니의 지혜 횃불(Tlamatini Torch · 눈앞을 비추어 다른 이가 제 길을 보게 돕는 거울)',
    insight: '지혜란 남을 재단하는 잣대가 아니라, 각자의 얼굴에 담긴 고유한 선의를 비추어 주는 맑은 거울임',
    tone: '어스름한 저녁 뜰에서 바람에 꺼지지 않도록 손으로 감싸 쥔 따뜻한 송진 등불',
    ritual: '누군가를 판단하는 말 대신, 그 사람이나 나 자신의 고유한 장점을 비추어 주는 맑은 거울 같은 말을 건네 보세요.',
    question: '남을 재단하는 잣대가 아니라, 서로의 고유한 얼굴을 비추어 주는 맑은 거울이 되어 줄 말은 무엇인가요?',
  },
  {
    motif: '치남파의 떠 있는 정원(Chinampa · 얕은 물 위에서도 뿌리를 내려 푸른 결실을 길러 냄)',
    insight: '기반이 다소 흔들리는 듯한 시기에도 작은 정성을 매일 이어 가면 단단한 터전이 자라남',
    tone: '잔잔한 수로 사이로 버드나무 뿌리가 물과 흙을 함께 껴안고 서 있는 수상 정원',
    ritual: '여건이 아직 불완전해 보여도 오늘 심을 수 있는 작은 정성 하나를 물 위에 뿌리내리듯 이어 가 보세요.',
    question: '기반이 완전히 단단해질 때까지 미루기보다, 지금 이 자리에서 매일 물을 주며 키워 갈 작은 터전은 무엇인가요?',
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

export function calculateNahuaXochitlCuicatlFlow(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NahuaXochitlResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const xochitlBreathAxis = XOCHITL_BREATH_AXES[stableHash(`${seed}|axis`) % XOCHITL_BREATH_AXES.length];
  const trimmedQ = (params.question ?? '').trim();
  const questionTopic = trimmedQ
    ? trimmedQ.slice(0, 36)
    : '흐르는 일상 속에서 마음을 살리는 꽃과 노래';

  return {
    engineVersion: 'LUCKEY-NAHUA-XOCHITL-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    xochitlMotif: picked.motif,
    companionMotif: companion.motif,
    xochitlBreathAxis,
    nahuaInsight: `${picked.insight} (동반 모티프: ${companion.motif})`,
    valleyTone: picked.tone,
    reflectionFocus: `질문 맥락('${questionTopic}')에서 나우아틀 꽃과 노래 지혜의 '${picked.motif}'와 숨결 축('${xochitlBreathAxis}')을 함께 살피며, 쫓기는 일정 속에서도 마음을 살리는 진실한 언어와 작은 아름다움의 틈을 내어 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    shadowWarning: '무상함을 지나치게 묵상하다 오늘 손에 쥘 수 있는 작은 결실과 실천까지 미루지 않도록 살피세요.',
    interpretiveBoundary: '멕시코 고원 나우아틀 철학의 꽃과 노래(In Xochitl In Cuicatl)·틀라매티니 성찰 전통을 바탕으로 한 상징적 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNahuaXochitlPrompt(res: NahuaXochitlResult): string {
  return [
    `[나우아틀 꽃과 노래·테오틀 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic}`,
    `- 쇼치틀 모티프: ${res.xochitlMotif} (${res.valleyTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 숨결 공명 축: ${res.xochitlBreathAxis}`,
    `- 중심 통찰: ${res.nahuaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
