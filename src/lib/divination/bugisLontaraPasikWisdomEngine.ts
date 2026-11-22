import type { UserProfile } from '../sharedState';

export interface BugisLontaraResult {
  engineVersion: string;
  calculatedAtKst: string;
  lontaraPrinciple: string;
  companionPrinciple: string;
  voyagePhase: string;
  pasikInsight: string;
  sulawesiTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const VOYAGE_PHASES = [
  '출항 정돈(바람의 방향과 돛의 장력을 맞추며 기준을 세우는 시기)',
  '해협 통과(흔들리는 물살 속에서도 용골의 중심을 지키는 시기)',
  '항구 결속(서로의 존엄을 먼저 헤아리며 신뢰의 닻을 내리는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '품위와 원칙을 세우려다 상대의 사정이나 현장의 유연함까지 닫아 버리지 않도록 살피세요.',
  '바람의 결을 살피며 신중함을 유지하려다 정작 닻을 올려야 할 때마저 늦추지 않도록 점검하세요.',
  '연민과 배려에 치우쳐 내가 꼭 지켜야 할 정직한 경계와 기준까지 흐려지지 않도록 유의하세요.',
] as const;

const PRINCIPLES = [
  {
    principle: '시리 나 파체(Siri’ na Pacce · 품위와 연민의 균형)',
    insight: '스스로의 존엄을 지키는 단단함과 타인의 아픔을 함께 느끼는 따뜻한 연대가 한 쌍을 이룸',
    tone: '마카사르 해협을 가르며 나아가는 피니시(Pinisi) 범선의 팽팽한 두 돛',
    ritual: '오늘 맡은 일이나 대화에서 나의 품위를 지키면서도 상대를 배려하는 균형 잡힌 한 문장을 먼저 건네 보세요.',
    question: '지금 내가 눈치 보느라 흐려진 기준 대신, 품위와 연민을 함께 지키는 선택을 한다면 어떤 방향일까요?',
  },
  {
    principle: '렘푸(Lempu · 흔들리지 않는 정직과 바른 마음)',
    insight: '복잡한 이해관계 앞에서도 굽히지 않고 솔직하고 바른 기준을 지킬 때 항로가 열림',
    tone: '술라웨시 맑은 바다 아래로 바닥까지 투명하게 비치는 산호초 물빛',
    ritual: '오늘 모호하게 둘러대고 싶던 일 하나를 골라, 정직하고 간결한 사실 그대로를 기준으로 정리해 보세요.',
    question: '복잡한 이해관계에 휩쓸리지 않고 렘푸(Lempu)의 물빛처럼 투명하게 세울 나만의 정직한 기준은 무엇인가요?',
  },
  {
    principle: '아카(Akka · 깊고 신중한 지혜와 통찰)',
    insight: '바람의 결을 먼저 읽고 움직이는 항해사처럼 서두르지 않고 상황을 꿰뚫어 보는 지혜',
    tone: '밤바다의 별자리를 읽으며 조용히 키를 잡는 부기스 선장의 손길',
    ritual: '성급히 답을 내리기 전에 오늘 마주한 상황의 전후 맥락을 3분간 차분히 짚어 본 뒤 움직여 보세요.',
    question: '지금 눈앞의 파도에 반응하느라 놓치고 있던 더 넓은 바람의 결은 어디에서 불어오고 있나요?',
  },
  {
    principle: '게텡(Getteng · 꺾이지 않는 결단과 일관성)',
    insight: '한 번 옳다고 정한 방향이라면 작은 파도에 흔들리지 않고 끝까지 밀고 나가는 중심',
    tone: '거센 계절풍 속에서도 뱃머리를 일정하게 유지하는 단단한 용골',
    ritual: '자꾸 미루거나 흔들리던 작은 약속 하나를 골라 오늘 끝까지 일관되게 매듭지어 보세요.',
    question: '작은 변수에 흔들려 멈추려던 일 중에서, 게텡(Getteng)의 용골처럼 끝까지 밀고 나가야 할 방향은 무엇인가요?',
  },
  {
    principle: '시파타우(Sipatau · 서로를 온전한 사람으로 대우함)',
    insight: '상대의 입장과 존엄을 먼저 존중할 때 비로소 낯선 바다에서도 든든한 동맹이 생김',
    tone: '항구마다 반갑게 닻을 내리고 차와 이야기를 나누는 부기스 항해자들의 우정',
    ritual: '오늘 대하는 상대의 역할이나 직함 너머로 그 사람 자체의 수고를 인정하는 진심 어린 인사를 건네 보세요.',
    question: '지금 내 주변에서 성과나 역할로만 보던 이의 존엄을 먼저 헤아릴 때 열릴 새로운 신뢰는 누구와의 관계일까요?',
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

export function calculateBugisLontaraPasikWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BugisLontaraResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRINCIPLES.length - 1));
  const picked = PRINCIPLES[idx];
  const companion = PRINCIPLES[(idx + companionOffset) % PRINCIPLES.length];
  const voyagePhase = VOYAGE_PHASES[stableHash(`${seed}|phase`) % VOYAGE_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];

  return {
    engineVersion: 'LUCKEY-BUGIS-LONTARA-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    lontaraPrinciple: picked.principle,
    companionPrinciple: companion.principle,
    voyagePhase,
    pasikInsight: `${picked.insight} (동반 덕목: ${companion.principle})`,
    sulawesiTone: picked.tone,
    shadowWarning,
    reflectionFocus: `부기스 론타라 지혜의 '${voyagePhase}' 흐름 속에서 '${picked.principle}'와 동반 덕목 '${companion.principle}'을 함께 비춰 오늘의 항로를 차분히 정해 보세요.`,
    ritualAction: `${picked.ritual} (동반 덕목: ${companion.principle})`,
    reflectiveQuestion: `${picked.question} '${voyagePhase}' 국면에서 가장 먼저 지킬 중심은 무엇인가요?`,
    interpretiveBoundary: '인도네시아 술라웨시 부기스·마카사르의 론타라(Lontara)·파시크(Pasik) 항해 윤리를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBugisLontaraPrompt(res: BugisLontaraResult): string {
  return [
    `[부기스 론타라·파시크 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 론타라 덕목: ${res.lontaraPrinciple} (${res.sulawesiTone})`,
    `- 동반 덕목: ${res.companionPrinciple}`,
    `- 항해 국면: ${res.voyagePhase}`,
    `- 중심 통찰: ${res.pasikInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
