import type { UserProfile } from '../sharedState';

export interface GayaIronCrownResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '열정·절도' | '기초·균형' | '소통·품격' | '조화 전반';
  gayaMotif: string;
  companionMotif: string;
  forgeEstuaryAxis: string;
  gayaCrossAxis: string;
  topicBalanceHint: string;
  gayaInsight: string;
  riverTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '불꽃과 쇠망치의 절도(Forge Discipline · 달군 쇠를 두드리되 식힐 때를 알아 단단히 벼림)',
    insight: '열정이 높을수록 식히는 시간과 멈춤의 절도가 함께 있어야 흔들리지 않는 단단함이 나옴',
    tone: '김해 평야의 맑은 바람 사이로 대장간의 은은한 숯불이 일정한 숨을 쉬는 아침',
    action: '오늘 한 가지 일을 마친 뒤 바로 다음 일로 넘어가지 말고, 2분 정도 숨을 식히는 짧은 틈을 두세요.',
    question: '지금 내가 식힐 틈 없이 계속 달구기만 해서 오히려 쇠가 무뎌지고 있는 영역은 어디인가요?',
  },
  {
    motif: '굽다리 접시의 균형(Pedestal Pottery · 가느다란 굽 위에서도 넓은 상판을 흔들림 없이 받침)',
    insight: '기초가 되는 마음의 중심이 반듯하면 겉의 짐이 조금 넓어져도 쉽게 기울지 않음',
    tone: '회청색 토기 표면 위로 매끄러운 물레 자국이 고요히 돌아가는 작업실',
    action: '겉의 할 일을 더 넓히기 전에, 오늘 내 몸과 마음을 받쳐 주는 기초 굽(수면·식사·정리)부터 반듯하게 세워 보세요.',
    question: '넓은 상판을 버티기 위해 지금 가장 먼저 단단히 바로 세워야 할 내 기초 굽은 무엇인가요?',
  },
  {
    motif: '낙동강 하구의 뱃길(Estuary Channel · 민물과 바닷물이 만나며 여러 갈래 길을 열어 줌)',
    insight: '서로 다른 성격의 일이나 사람이 만날 때 경계를 닫기보다 소통의 물길을 트면 흐름이 커짐',
    tone: '강물이 바다로 풀리며 은빛 물결이 완만하게 퍼져 나가는 이른 오후',
    action: '서로 다른 입장이 부딪히는 일에서 경계를 닫기 전에 상대의 물길이 흘러올 작은 틈을 먼저 열어 보세요.',
    question: '서로 다르다는 이유로 닫아 두었던 경계 가운데, 물길을 트면 오히려 흐름이 살아날 곳은 어디인가요?',
  },
  {
    motif: '가야금 열두 줄의 울림(Twelve Strings · 저마다 다른 줄이 어우러져 하나의 여운을 남김)',
    insight: '내 안의 다양한 감정과 역할을 하나로 억누르기보다 각각의 제 음색을 인정할 때 편안해짐',
    tone: '나무 공명통을 타고 맑고 둥근 현 소리가 바람 끝으로 번지는 저녁',
    action: '오늘 내 안에 떠오른 상반된 감정 두 가지를 억지로 지우지 말고, 각각 다른 줄의 소리처럼 나란히 적어 보세요.',
    question: '하나의 소리로만 누르려 하기보다 제 음색을 인정해 줄 때 훨씬 편안해질 내 안의 감정은 무엇인가요?',
  },
  {
    motif: '풀잎 금관의 부드러운 선(Grass-Leaf Crown · 날카로운 위엄보다 유연한 곡선으로 품격을 세움)',
    insight: '굳이 목소리를 높이거나 날을 세우지 않아도 단정한 태도만으로 충분한 힘이 전해짐',
    tone: '황금빛 세공 장식이 미세한 빛을 받아 부드럽게 반짝이는 고요한 전당',
    action: '목소리를 높이거나 날카롭게 설명하기보다 한 톤 낮고 단정한 문장 하나로 내 뜻을 전해 보세요.',
    question: '굳이 날을 세우지 않고 부드러운 풀잎 곡선처럼 단정하게 지켜도 충분한 내 중심은 무엇인가요?',
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

const GAYA_SHADOWS = [
  '식히는 틈을 두느라 정작 불꽃을 올려 벼려야 할 결정적 타이밍까지 식혀 버리지 않도록 살피세요.',
  '기초 굽을 살피는 데만 머무르다 정작 그 위에 올려야 할 오늘의 핵심 과제 착수를 미루지 마세요.',
  '여러 갈래 물길을 다 열어 두려다 정작 지금 집중해야 할 내 중심 물줄기가 흩어지지 않게 주의하세요.',
  '모든 감정의 소리를 다 안고 가려다 지금 먼저 조율해야 할 불협화음 한 가지를 방치하지 마세요.',
  '부드러운 곡선과 단정한 태도를 지키려다 꼭 짚고 넘어가야 할 원칙까지 모호하게 넘기지 마세요.',
];

const GAYA_TOPIC_HINTS: Record<GayaIronCrownResult['questionTopic'], string> = {
  '열정·절도': '쇠를 달구는 열정만큼 식히는 틈을 의식적으로 배치해야 강철 같은 탄성이 유지됩니다.',
  '기초·균형': '바깥의 과제를 더 얹기 전에 내 몸과 일상을 받치는 기초 굽부터 반듯하게 점검하세요.',
  '소통·품격': '날 선 설득보다 한 톤 낮고 단정한 태도가 상대의 경계를 자연스럽게 열어 줍니다.',
  '조화 전반': '대장간의 불꽃과 낙동강 하구의 물길이 만나듯, 추진과 수용의 리듬을 나란히 맞추어 보세요.',
};

function classifyGayaTopic(q: string): GayaIronCrownResult['questionTopic'] {
  if (/열정|식힘|절도|불꽃|일/.test(q)) return '열정·절도';
  if (/기초|균형|굽|중심|수면/.test(q)) return '기초·균형';
  if (/소통|품격|관계|감정|물길/.test(q)) return '소통·품격';
  return '조화 전반';
}

export function calculateGayaIronCrownRiverHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GayaIronCrownResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyGayaTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const forgeEstuaryAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = GAYA_TOPIC_HINTS[questionTopic];
  const shadowWarning = GAYA_SHADOWS[idx];

  const calculatedAtKst = formatKstIso(now);
  const gayaCrossAxis = `[${picked.motif.split('(')[0].trim()}] × [${companion.motif.split('(')[0].trim()}] × [${questionTopic}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-GAYA-IRON-v2.5.0',
    calculatedAtKst,
    questionTopic,
    gayaMotif: picked.motif,
    companionMotif: companion.motif,
    forgeEstuaryAxis,
    gayaCrossAxis,
    topicBalanceHint,
    gayaInsight: picked.insight,
    riverTone: picked.tone,
    reflectionFocus: `가야 금관·철기 조화의 '${picked.motif}'처럼, 열정과 식힘의 절도를 맞추며 부드럽고 단정한 중심을 세워 보세요. (동반 결: ${companion.motif.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 가야의 철기 제련·토기 균형·가야금 조화 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGayaIronCrownPrompt(res: GayaIronCrownResult): string {
  return [
    `[가야·금관 철기 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 대장간·하구 축: ${res.forgeEstuaryAxis}`,
    `- 4중 교차 축: ${res.gayaCrossAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 가야 모티프: ${res.gayaMotif} (${res.riverTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.gayaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
