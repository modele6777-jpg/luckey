import type { UserProfile } from '../sharedState';

export interface CarthaginianTanitResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계/신뢰' | '일/진로' | '재정/균형' | '내면/회복' | '전환/결정';
  tanitMotif: string;
  companionMotif: string;
  harborPhase: string;
  harborCrossAxis: string;
  carthaginianInsight: string;
  harborTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const HARBOR_PHASES = [
  '내항 정박(거친 바깥 파도를 피해 코톤 항구 안에서 배와 마음을 손보는 시기)',
  '별빛 항로(눈앞 이정표가 흐릴수록 변함없는 큰 원칙을 바라보며 방향을 잡는 시기)',
  '돛 조절(바람의 결이 바뀔 때 무리하게 밀어붙이지 않고 속도를 가늠하는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '안전한 내항에 머무르며 정비만 하다가 바람이 좋을 때 출항해야 할 기회까지 놓치지 않도록 살피세요.',
  '하늘과 별빛 같은 높은 이상에만 시선을 두다 오늘 당장 발밑에서 건너야 할 작은 실무가 비지 않도록 점검하세요.',
  '정성스러운 빛깔과 속도를 조절한다는 명분으로 마감과 약속된 도착 시한까지 흐트러지지 않도록 유의하세요.',
] as const;

const MOTIFS = [
  {
    motif: '코톤의 원형 항구(Cothon Harbor · 거친 바깥 파도를 막아 주는 고요한 내항의 선착장)',
    insight: '먼 항해를 떠나기 전에도, 돌아와 배를 손보고 숨을 고를 수 있는 안전한 내항이 먼저 있어야 함',
    tone: '카르타고의 돌 방파제 안쪽에서 잔잔한 지중해 물결이 배의 뱃머리를 조용히 받치는 아침',
    ritual: '먼 일정이나 큰 목표를 세우기 전에, 오늘 내가 숨을 고르고 정비할 안전한 내항 시간 15분을 먼저 잡아 두세요.',
    question: '거친 바깥 파도 앞에서 언제든 돌아와 배를 손보고 숨을 고를 수 있는 내 안의 코톤 항구는 어디인가요?',
  },
  {
    motif: '타닛의 균형 표식(Sign of Tanit · 하늘과 땅을 잇는 삼각형 위에 수평 팔을 펼친 조화)',
    insight: '높은 이상과 현실의 발밑 사이에서 균형 잡힌 두 팔을 펼칠 때 흔들리지 않는 중심이 섬',
    tone: '하얀 석회석 비석 위에 햇빛이 스며들며 단정하고 명료한 기하학 선이 드러나는 오후',
    ritual: '이상적인 목표와 오늘 당장 할 수 있는 현실의 한 걸음을 나란히 적어 균형을 맞춰 보세요.',
    question: '높은 이상과 현실의 발밑 사이에서 두 팔을 고르게 펼쳐 중심을 잡아야 할 오늘의 과제는 무엇인가요?',
  },
  {
    motif: '별빛으로 읽는 해류(Pelagic Starlight · 육지가 보이지 않는 망망대해에서도 밤하늘로 길을 찾음)',
    insight: '당장 발밑에 이정표가 보이지 않아도, 내가 세워 둔 큰 원칙을 바라보면 방향을 잃지 않음',
    tone: '지중해 한가운데 짙은 남빛 밤하늘의 별빛이 뱃머리 앞 물결에 은빛으로 부서지는 밤',
    ritual: '당장 답이 안 보이는 고민 앞에서, 내가 변함없이 지향하는 큰 원칙 별자리 하나를 다시 확인해 보세요.',
    question: '발밑의 이정표가 흐릿할수록 밤하늘의 별빛처럼 변함없이 바라보아야 할 내 삶의 방향은 어디인가요?',
  },
  {
    motif: '보라빛 뿔고둥 염색(Tyrian Purple · 작은 고둥에서 얻은 귀한 빛깔이 긴 세월을 견딤)',
    insight: '쉽게 얻어지는 요란한 성과보다, 시간이 걸리더라도 정성으로 빚어낸 내 몫의 빛깔이 귀함',
    tone: '바닷바람을 맞으며 깊고 선명한 자주빛으로 물들어 가는 고대 항구 작업장의 천',
    ritual: '빠른 결과보다 시간이 지날수록 내 빛깔이 살아날 정성스러운 작업 한 가지에 20분을 들여 보세요.',
    question: '요란한 빠른 성과 대신, 시간과 정성을 들여 깊게 물들여 두고 싶은 나만의 빛깔은 무엇인가요?',
  },
  {
    motif: '돛을 접는 타이밍(Furling the Sail · 순풍만 쫓지 않고 바람이 바뀔 때 돛을 조절하는 지혜)',
    insight: '무조건 앞으로 밀어붙이는 것이 아니라, 바람의 결이 바뀔 때 속도를 줄이는 것도 항해의 기술임',
    tone: '석양이 지는 수평선 앞에서 선원들이 돛줄을 가지런히 정리하며 항구로 들어오는 저녁',
    ritual: '오늘 해야 할 일들 중 속도를 조금 늦추고 돛을 정리하듯 점검할 항목 하나를 골라 살펴보세요.',
    question: '지금 나는 순풍만 믿고 돛을 너무 높게 올리고 있지는 않나요, 아니면 잠시 내항에 정박할 때인가요?',
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

function classifyHarborTopic(question?: string): CarthaginianTanitResult['questionTopic'] {
  const q = (question ?? '').toLowerCase();
  if (/(사랑|연애|관계|결혼|사람|가족|친구|갈등|화해|신뢰)/.test(q)) return '관계/신뢰';
  if (/(일|직장|진로|이직|사업|공부|시험|성과|일정|방향|속도)/.test(q)) return '일/진로';
  if (/(돈|재정|투자|소비|수입|지출|저축|자산|균형)/.test(q)) return '재정/균형';
  if (/(마음|불안|지침|회복|휴식|수면|건강|감정|내항)/.test(q)) return '내면/회복';
  return '전환/결정';
}

export function calculateCarthaginianTanitHarborCompass(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CarthaginianTanitResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const harborPhase = HARBOR_PHASES[stableHash(`${seed}|phase`) % HARBOR_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyHarborTopic(params.question);
  const shortPhase = harborPhase.split('(')[0].trim();
  const shortMotif = picked.motif.split('(')[0].trim();
  const shortCompanion = companion.motif.split('(')[0].trim();
  const harborCrossAxis = `${shortPhase} × ${shortMotif} · ${shortCompanion} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-CARTHAGINIAN-TANIT-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    tanitMotif: picked.motif,
    companionMotif: companion.motif,
    harborPhase,
    harborCrossAxis,
    carthaginianInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    harborTone: picked.tone,
    shadowWarning,
    reflectionFocus: `카르타고 타닛 항구의 '${harborPhase}' 흐름에서 '${picked.motif}'와 동반 결 '${companion.motif}'을 함께 짚어, 안전한 내항과 돛을 조절하는 감각을 먼저 챙겨 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.motif})`,
    reflectiveQuestion: `${picked.question} '${harborPhase}' 국면에서 가장 먼저 손볼 항해의 기준은 무엇인가요?`,
    interpretiveBoundary: '고대 카르타고의 코톤 항구·타닛 균형 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCarthaginianTanitPrompt(res: CarthaginianTanitResult): string {
  return [
    `[카르타고 타닛·지중해 항해 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 타닛 모티프: ${res.tanitMotif} (${res.harborTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 항해 국면: ${res.harborPhase}`,
    `- 질문 맥락(${res.questionTopic}) 교차 축: ${res.harborCrossAxis}`,
    `- 중심 통찰: ${res.carthaginianInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
