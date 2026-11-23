import type { UserProfile } from '../sharedState';

export interface ChavinLanzonResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계·조율' | '일·중심' | '흐름·전환' | '균형 전반';
  chavinMotif: string;
  companionMotif: string;
  stoneBalanceAxis: string;
  chavinInsight: string;
  stoneTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '라손 석주의 중심축(Lanzon Axis · 교차하는 지하 회랑 한가운데 우뚝 서서 사방의 균형을 잡음)',
    insight: '여러 갈래 선택지가 사방에서 부딪힐수록 흔들리지 않는 내 안의 중심축 하나를 먼저 세워야 함',
    tone: '안데스 산맥 깊은 계곡의 차빈 석조 신전 중앙, 서늘한 돌기둥에 은은한 빛이 내려앉는 아침',
    ritual: '오늘 결정해야 할 일 중 가장 핵심 기준 한 문장만 메모지에 먼저 적어 중심을 잡아 보세요.',
    question: '여러 갈래 선택지가 사방에서 부딪힐 때, 라손 석주처럼 가장 먼저 세워 두어야 할 내 안의 중심축은 무엇인가요?',
  },
  {
    motif: '지하 수로의 공명(Acoustic Canal · 물이 돌 수로를 지나며 맑고 깊은 울림을 만들어 냄)',
    insight: '겉으로 소리 내어 다투지 않아도, 제 길을 따라 성실히 흐르는 일은 결국 깊은 울림을 남김',
    tone: '정교하게 짜인 화강암 수로 아래로 맑은 계곡물이 낮고 웅장한 소리를 내며 흐르는 낮',
    ritual: '겉으로 요란하게 드러나지 않아도 내 제 길을 따라 묵묵히 이어 갈 핵심 루틴 한 가지를 챙겨 보세요.',
    question: '겉으로 소리 내어 다투지 않아도 제 물길을 따라 꾸준히 흘러 결국 깊은 울림을 남길 일은 무엇인가요?',
  },
  {
    motif: '모스나와 우아체사 강물의 합류(River Confluence · 두 갈래 강물이 하나의 계곡에서 만나 힘을 합침)',
    insight: '서로 다른 재능이나 경험이 만날 때 한쪽을 버리지 않고 합쳐 보면 더 큰 흐름이 생김',
    tone: '두 물줄기가 자갈밭 사이에서 만나 넓고 맑은 물길을 이루는 오후',
    ritual: '서로 다르다고 여겼던 두 가지 경험이나 일의 방식을 하나로 엮어 볼 접점을 한 줄 적어 보세요.',
    question: '어느 한쪽을 버리기보다 두 갈래 강물이 만나는 합류점처럼 함께 엮어 볼 나의 경험과 시선은 무엇인가요?',
  },
  {
    motif: '테논 머리의 다양한 표정(Tenon Heads · 바깥 벽면을 따라 저마다 다른 변용과 시선이 이어짐)',
    insight: '상황이 바뀔 때마다 유연하게 태도를 달리하는 것은 변덕이 아니라 살아 있는 적응의 지혜임',
    tone: '회색 돌벽 위에 솟아오른 조각상들이 고원 구름의 흐름을 따라 빛과 그림자를 바꾸는 저녁',
    ritual: '지금의 상황에 맞지 않는 고집 하나를 내려놓고, 구름의 흐름에 맞춰 태도를 조금 유연하게 바꿔 보세요.',
    question: '변덕이 아니라 살아 있는 적응의 지혜로서, 지금의 상황에 맞게 유연하게 바꿀 태도는 무엇인가요?',
  },
  {
    motif: '황금빛 콘도르의 날개(Andean Condor · 높은 산봉우리 사이의 상승 기류를 타고 힘들이지 않고 솟음)',
    insight: '내 힘만으로 억지로 날갯짓하기보다, 지금 불어오는 흐름과 바람을 읽고 올라타면 훨씬 가벼움',
    tone: '맑은 안데스 하늘 위로 커다란 새가 날개를 쭉 편 채 고요히 선회하는 정오',
    ritual: '억지로 밀어붙여 지치던 일 하나를 멈추고, 이미 도와주는 흐름이나 자원이 무엇인지 찾아 올라타 보세요.',
    question: '지금 내가 억지로 날갯짓하느라 지쳐 있을 뿐, 사실은 타고 갈 수 있는 상승 기류는 무엇인가요?',
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

const CHAVIN_SHADOWS = [
  '중심축을 세우려다 주변의 실제 변화와 다른 시선까지 모두 막아서지 않도록 경계하세요.',
  '묵묵히 흐르는 데만 머물러 꼭 목소리를 내고 합의를 구해야 할 시점을 놓치지 마세요.',
  '두 갈래를 모두 품으려다 정작 지금 먼저 치워야 할 한 가지 우선순위가 흐려지지 않게 살피세요.',
  '유연한 적응을 핑계로 스스로 세운 핵심 원칙까지 쉽게 흔들리지 않도록 주의하세요.',
  '상승 기류를 기다리며 움직임을 미루다가 지금 내가 내디뎌야 할 작은 발걸음을 놓치지 마세요.',
];

function classifyChavinTopic(q: string): ChavinLanzonResult['questionTopic'] {
  if (/관계|조율|사람|사랑|대화|합류/.test(q)) return '관계·조율';
  if (/일|직장|진로|중심|기준|결정/.test(q)) return '일·중심';
  if (/흐름|전환|변화|유연|바람|길/.test(q)) return '흐름·전환';
  return '균형 전반';
}

export function calculateChavinLanzonStoneBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChavinLanzonResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyChavinTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const stoneBalanceAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const shadowWarning = CHAVIN_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-CHAVIN-LANZON-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    chavinMotif: picked.motif,
    companionMotif: companion.motif,
    stoneBalanceAxis,
    chavinInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    stoneTone: picked.tone,
    reflectionFocus: `안데스 차빈 라손의 '${picked.motif}'와 동반 결 '${companion.motif}'처럼, 사방의 갈래가 복잡할수록 내 안의 중심축을 먼저 세우고 흐름을 타 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 페루 안데스 차빈 데 우안타르의 라손 석주·수로 공명 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChavinLanzonPrompt(res: ChavinLanzonResult): string {
  return [
    `[차빈·라손 돌기둥 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 석주 축: ${res.stoneBalanceAxis}`,
    `- 차빈 모티프: ${res.chavinMotif} (${res.stoneTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 중심 통찰: ${res.chavinInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
