import type { UserProfile } from '../sharedState';

export interface CanaaniteUgaritResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계/신뢰' | '일/진로' | '재정/균형' | '내면/회복' | '전환/결정';
  levantSymbol: string;
  companionSymbol: string;
  levantPhase: string;
  ugaritCrossAxis: string;
  ugaritInsight: string;
  cedarTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LEVANT_PHASES = [
  '뿌리 다짐(보이는 성과보다 체력과 기본기를 바위 틈에 깊게 내리는 시기)',
  '점토판 요약(거대한 걱정을 짧은 문장 몇 줄로 옮겨 다룰 수 있게 줄이는 시기)',
  '계절 전환(메마른 정체 끝에 다음 비를 맞을 땅을 고르며 경계를 세우는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '기본기와 체력을 다진다는 이유로 정작 세상에 내보여야 할 첫 시도를 한없이 미루지 않도록 살피세요.',
  '고민을 한 줄로 정리해 두기만 하고 실제로 손을 대어 푸는 작은 실행까지 건너뛰지 않도록 점검하세요.',
  '울타리와 경계를 분명히 세우려다 꼭 필요한 따뜻한 연결과 협력의 문까지 닫아 버리지 않도록 유의하세요.',
] as const;

const SYMBOLS = [
  {
    symbol: '레바논 삼나무의 뿌리(Cedar Roots · 높은 가지를 뻗기 전에 바위 틈으로 깊이 내림)',
    insight: '외부의 인정을 서두르기보다 아무도 보지 않는 기본기와 체력을 먼저 단단히 다져야 버팀',
    tone: '지중해 바닷바람을 맞으며 높은 산등성이에 짙은 향기를 품고 서 있는 거대한 삼나무',
    ritual: '오늘은 눈에 띄는 성과보다 체력·수면·기초 정리 중 하나를 바위 틈 뿌리 내리듯 단단히 챙겨 보세요.',
    question: '지금 내가 가지를 더 높게 뻗으려고 애쓰기 전에, 삼나무의 뿌리처럼 먼저 깊게 내려야 할 기본기는 무엇인가요?',
  },
  {
    symbol: '우가리트의 서른 자 점토판(Ugaritic Script · 복잡한 뜻을 간결한 쐐기 몇 획으로 옮김)',
    insight: '머릿속에서 맴돌며 거대해진 걱정도 짧은 문장 서너 줄로 적고 나면 다룰 수 있는 크기가 됨',
    tone: '고대 항구 도시 서고에서 햇빛에 마르며 오랜 기록을 품은 작은 붉은 점토판',
    ritual: '머릿속을 어지럽히는 걱정 하나를 우가리트 점토판에 새기듯 딱 한 줄로 적어 정리해 보세요.',
    question: '머릿속에서만 맴돌며 부풀어 올랐지만, 점토판에 한 줄로 적어 보면 다룰 수 있을 고민은 무엇인가요?',
  },
  {
    symbol: '바알과 모트의 계절(Seasonal Cycle · 메마른 여름이 지나야 비로소 이른 비가 내림)',
    insight: '지금의 정체나 메마름은 실패가 아니라 다음 비를 맞기 위해 땅을 쉬게 하는 계절의 일부임',
    tone: '건기의 끝자락에서 먼 바다 쪽으로 서서히 모여드는 비구름과 서늘한 바람',
    ritual: '결과가 더뎌 보이는 일 하나를 다그치기보다, 다음 비를 기다리며 땅을 고르는 휴식 루틴으로 바꿔 보세요.',
    question: '지금의 정체를 실패로 몰아붙이기보다, 다음 비를 맞기 위해 땅을 쉬게 하는 계절로 봐줄 일은 무엇인가요?',
  },
  {
    symbol: '아나트의 지혜와 경계(Measured Boundary · 지킬 것을 지킬 때 비로소 관대해짐)',
    insight: '무조건 다 받아주는 친절은 금세 지치게 만드니, 내 울타리를 지킬 줄 알아야 오래 나눔',
    tone: '성벽 밖 바다와 성벽 안 올리브 밭을 분명하게 나누는 고대 석조 망루',
    ritual: '오늘 무리한 부탁이나 과한 일정 하나에 정중하게 거절하거나 미루는 선을 분명히 그어 보세요.',
    question: '오래 나누기 위해서라도 내 올리브 밭의 돌담처럼 먼저 분명히 세워야 할 경계는 어디인가요?',
  },
  {
    symbol: '항구의 등불과 범선(Harbor Beacon · 먼 항해 끝에도 돌아올 좌표가 있어 길을 잃지 않음)',
    insight: '새로운 시도를 할수록 내가 흔들릴 때 돌아올 수 있는 소박한 일상 루틴 하나가 중요함',
    tone: '해 질 녘 라스 샴라 만으로 천천히 돛을 내리며 들어오는 목조 상선',
    ritual: '바쁜 일정 끝에도 내가 흔들리지 않고 돌아올 저녁 루틴 한 가지를 오늘 꼭 지켜 보세요.',
    question: '새로운 항해를 이어 가면서도 지칠 때마다 돌아와 숨을 고를 수 있는 나만의 항구 좌표는 무엇인가요?',
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

function classifyUgaritTopic(question?: string): CanaaniteUgaritResult['questionTopic'] {
  const q = (question ?? '').toLowerCase();
  if (/(사랑|연애|관계|결혼|사람|가족|친구|갈등|화해|신뢰|경계|부탁)/.test(q)) return '관계/신뢰';
  if (/(일|직장|진로|이직|사업|공부|시험|성과|기본기|좌표)/.test(q)) return '일/진로';
  if (/(돈|재정|투자|소비|수입|지출|저축|자산|균형)/.test(q)) return '재정/균형';
  if (/(마음|불안|지침|회복|휴식|수면|건강|감정|체력)/.test(q)) return '내면/회복';
  return '전환/결정';
}

export function calculateCanaaniteUgaritCedarWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CanaaniteUgaritResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SYMBOLS.length - 1));
  const picked = SYMBOLS[idx];
  const companion = SYMBOLS[(idx + companionOffset) % SYMBOLS.length];
  const levantPhase = LEVANT_PHASES[stableHash(`${seed}|phase`) % LEVANT_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyUgaritTopic(params.question);
  const shortPhase = levantPhase.split('(')[0].trim();
  const shortSymbol = picked.symbol.split('(')[0].trim();
  const shortCompanion = companion.symbol.split('(')[0].trim();
  const ugaritCrossAxis = `${shortPhase} × ${shortSymbol} · ${shortCompanion} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-CANAANITE-UGARIT-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    levantSymbol: picked.symbol,
    companionSymbol: companion.symbol,
    levantPhase,
    ugaritCrossAxis,
    ugaritInsight: `${picked.insight} (동반 상징: ${companion.symbol})`,
    cedarTone: picked.tone,
    shadowWarning,
    reflectionFocus: `고대 가나안·우가리트 지혜의 '${levantPhase}' 흐름 속에서 '${picked.symbol}'와 동반 상징 '${companion.symbol}'을 함께 짚어, 깊은 뿌리와 간결한 기록·일상의 좌표를 세워 보세요.`,
    ritualAction: `${picked.ritual} (동반 상징: ${companion.symbol})`,
    reflectiveQuestion: `${picked.question} '${levantPhase}' 국면에서 가장 먼저 다질 좌표는 무엇인가요?`,
    interpretiveBoundary: '고대 레반트 가나안·우가리트(Ugarit) 서판과 삼나무 뿌리 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCanaaniteUgaritPrompt(res: CanaaniteUgaritResult): string {
  return [
    `[가나안 우가리트·삼나무 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 레반트 상징: ${res.levantSymbol} (${res.cedarTone})`,
    `- 동반 상징: ${res.companionSymbol}`,
    `- 레반트 국면: ${res.levantPhase}`,
    `- 질문 맥락(${res.questionTopic}) 교차 축: ${res.ugaritCrossAxis}`,
    `- 중심 통찰: ${res.ugaritInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
