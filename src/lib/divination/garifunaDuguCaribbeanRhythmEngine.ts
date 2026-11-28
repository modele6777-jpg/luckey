import type { UserProfile } from '../sharedState';

export type GarifunaQuestionCategory = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface GarifunaDuguResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: string;
  questionCategory: GarifunaQuestionCategory;
  caribbeanRhythm: string;
  companionRhythm: string;
  coastCadenceAxis: string;
  garifunaCrossAxis: string;
  topicBalanceHint: string;
  duguInsight: string;
  coastTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const COAST_CADENCE_AXES = [
  '둥구 화해의 마당 · 묵은 서운함 풀어내기',
  '푼타 경쾌한 발걸음 · 경직된 긴장 털어내기',
  '바미 소박한 정성 · 기본 루틴 단단히 지키기',
  '아우아시 파도 간격 · 한 박자 여유로 타이밍 읽기',
] as const;

const RHYTHMS = [
  {
    rhythm: '둥구(Dügü · 흩어진 마음과 세대를 한 마당에 모으는 화해)',
    insight: '마음속에 묵혀 둔 서운함과 어긋남을 외면하지 않고 정직하게 풀어낼 때 비로소 앞으로 감',
    tone: '카리브해의 에메랄드빛 파도가 백사장을 부드럽게 적시는 이른 아침의 해변',
    ritual: '마음 한구석에 어긋난 채 미뤄 둔 대화나 오해 하나를 오늘 담백한 안부로 풀어낼 실마리를 잡아 보세요.',
    question: '외면하고 덮어 두려던 서운함 중에서, 솔직한 화해와 정리를 거쳐야 비로소 가벼워질 매듭은 무엇인가요?',
  },
  {
    rhythm: '푼타(Punta · 무거운 마음을 발걸음과 박자로 털어내는 생동)',
    insight: '생각만 길어질 때는 몸을 가볍게 움직여 경직된 긴장을 먼저 풀어 주는 편이 빠름',
    tone: '야자수 그늘 아래 가로우나(Garowuna) 북소리가 경쾌하게 울려 퍼지는 저녁 마당',
    ritual: '오늘 잠시 자리에서 일어나 기지개를 켜고 가볍게 걸으며, 어깨에 얹혀 있던 불필요한 긴장을 몸 밖으로 털어내 보세요.',
    question: '머릿속 생각만 굴리느라 더 무거워진 고민 중, 몸을 움직여 박자를 바꾸면 금세 풀릴 일은 무엇인가요?',
  },
  {
    rhythm: '바미(Bami · 카사바를 갈아 구우며 기다리는 소박한 정성)',
    insight: '복잡한 조리법보다 기본 재료를 정성껏 손질해 나누는 일상이 삶을 단단히 지탱함',
    tone: '따뜻한 화덕 위에서 고소하게 익어 가는 카사바 빵과 바닷바람의 내음',
    ritual: '요란한 계획 대신 오늘의 기본 일과 한 가지를 차분하고 정성스럽게 손질해 마무리해 보세요.',
    question: '화려한 포장보다 기본 재료를 정성껏 손질하는 소박한 루틴이 오늘 내 하루를 어떻게 단단히 지탱해 줄까요?',
  },
  {
    rhythm: '와유니(Wayunagu · 앞선 이들의 지혜를 오늘의 길잡이로 부르는 기억)',
    insight: '내가 지금 혼자 모든 것을 처음부터 발명할 필요 없이 이미 배운 좋은 지혜를 꺼내 쓰면 됨',
    tone: '해 질 녘 붉은 수평선 위로 잔잔히 이어지는 항해자들의 노랫소리',
    ritual: '지금 막힌 문제와 관련해 예전에 내가 배웠거나 멘토에게 들었던 조언 한 줄을 노트에 다시 꺼내 적어 보세요.',
    question: '지금 내가 혼자 처음부터 다 짊어지려 애쓰기보다, 이미 알고 있던 좋은 지혜나 주변의 리듬을 빌려 오면 한결 쉬워질 일은 무엇인가요?',
  },
  {
    rhythm: '아우아시(Auasi · 파도의 간격을 읽으며 그물을 던지는 여유)',
    insight: '무작정 힘을 쏟기보다 바다가 내어 주는 적절한 타이밍을 잠시 기다릴 줄 아는 감각',
    tone: '산호초 너머 잔잔해진 만으로 조용히 미끄러져 들어오는 작은 카누',
    ritual: '급하게 답을 재촉하기 전에 오늘 하루의 흐름에서 파도가 잔잔해지는 시간대 한 번을 기다렸다가 움직여 보세요.',
    question: '무작정 힘을 쏟아붓는 대신 파도의 간격을 읽으며 한 박자 여유를 둘 때 더 정확히 잡힐 타이밍은 언제인가요?',
  },
];

const TOPIC_BALANCE_HINTS: Record<GarifunaQuestionCategory, string> = {
  career: '일·커리어에서는 모든 것을 새로 발명하려 하기보다 이미 검증된 기본 루틴과 동료의 지혜를 빌려 오세요.',
  relationship: '관계에서는 묵혀 둔 서운함을 덮어 두기보다 둥구 마당처럼 담백하고 솔직한 안부로 매듭을 풀어 보세요.',
  wealth: '재정·계약에서는 무작정 힘을 쏟기보다 바다가 잔잔해지는 타이밍을 한 박자 기다린 뒤 움직이세요.',
  health: '건강·회복에서는 머릿속 생각만 굴리지 말고 가벼운 걸음과 기지개로 어깨의 긴장부터 털어내세요.',
  decision: '선택의 기로에서는 무거운 긴장을 한 박자 가볍게 바꾼 뒤 핵심 약속만 또렷이 남기세요.',
  general: '오늘의 흐름에서는 해안 리듬과 동반 리듬을 함께 살피며 생동감과 핵심 정리의 균형을 맞추세요.',
};

function classifyGarifunaCategory(question: string): GarifunaQuestionCategory {
  if (/일|직장|사업|커리어|프로젝트|성과|이직/.test(question)) return 'career';
  if (/사랑|연애|관계|가족|친구|갈등|화해/.test(question)) return 'relationship';
  if (/돈|재물|재정|투자|소비|계약/.test(question)) return 'wealth';
  if (/건강|몸|피로|휴식|수면|회복/.test(question)) return 'health';
  if (/선택|결정|방향|박자|풀어|진로/.test(question)) return 'decision';
  return 'general';
}

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

export function calculateGarifunaDuguCaribbeanRhythm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GarifunaDuguResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % RHYTHMS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (RHYTHMS.length - 1));
  const picked = RHYTHMS[idx];
  const companion = RHYTHMS[(idx + companionOffset) % RHYTHMS.length];
  const coastCadenceAxis = COAST_CADENCE_AXES[stableHash(`${seed}|axis`) % COAST_CADENCE_AXES.length];
  const trimmedQ = (params.question ?? '').trim();
  const questionTopic = trimmedQ
    ? trimmedQ.slice(0, 36)
    : '무거운 생각을 가벼운 박자로 풀어내는 하루';
  const questionCategory = classifyGarifunaCategory(trimmedQ);

  const calculatedAtKst = formatKstIso(now);
  const garifunaCrossAxis = `[${picked.rhythm.split('(')[0].trim()}] × [${companion.rhythm.split('(')[0].trim()}] × [${questionCategory}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-GARIFUNA-DUGU-v2.5.0',
    calculatedAtKst,
    questionTopic,
    questionCategory,
    caribbeanRhythm: picked.rhythm,
    companionRhythm: companion.rhythm,
    coastCadenceAxis,
    garifunaCrossAxis,
    topicBalanceHint: TOPIC_BALANCE_HINTS[questionCategory],
    duguInsight: `${picked.insight} (동반 리듬: ${companion.rhythm})`,
    coastTone: picked.tone,
    reflectionFocus: `질문 맥락('${questionTopic}')에서 가리푸나 카리브 해안 지혜의 '${picked.rhythm}'와 해안 박자 축('${coastCadenceAxis}')을 함께 살피며, 머릿속에서만 맴도는 무거운 생각을 가벼운 움직임과 솔직한 박자로 풀어내 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    shadowWarning: '분위기를 가볍게 돌리려다 정작 짚고 넘어가야 할 핵심 문제나 약속까지 흘려보내지 않도록 살피세요.',
    interpretiveBoundary: '카리브 연안 가리푸나(Garifuna)의 둥구(Dügü) 화해·푼타(Punta) 생동 리듬을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGarifunaDuguPrompt(res: GarifunaDuguResult): string {
  return [
    `[가리푸나 둥구·카리브 해안 리듬 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic}`,
    `- 해안 리듬: ${res.caribbeanRhythm} (${res.coastTone})`,
    `- 동반 리듬: ${res.companionRhythm}`,
    `- 해안 박자 축: ${res.coastCadenceAxis}`,
    `- 4중 교차 축: ${res.garifunaCrossAxis}`,
    `- 주제별 균형 조언: ${res.topicBalanceHint}`,
    `- 중심 통찰: ${res.duguInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
