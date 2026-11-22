import type { UserProfile } from '../sharedState';

export interface CatalanSenyRauxaResult {
  engineVersion: string;
  calculatedAtKst: string;
  catalanPrinciple: string;
  companionPrinciple: string;
  balancePhase: string;
  senyInsight: string;
  barcelonaTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const BALANCE_PHASES = [
  '세니 조율(사실과 순서를 차분히 짚어 감정의 파도를 가라앉히는 시기)',
  '라우샤 점화(계산만 반복하던 일에 살아 있는 설렘으로 첫 시동을 거는 시기)',
  '사르다나 박자(자유로움과 약속된 리듬 사이에서 함께 서는 균형을 맞추는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '차분한 분별과 검토만 계속하다가 정작 설렘으로 뚫어야 할 첫 실행을 놓치지 않도록 살피세요.',
  '순간적인 열정과 직관으로 치고 나가기만 하다가 아래에서 받쳐 주는 기초와 순서를 건너뛰지 않도록 점검하세요.',
  '약속된 박자와 규칙을 지키려다 예상치 못한 좋은 변수가 들어올 유연한 여지까지 닫아 버리지 않도록 유의하세요.',
] as const;

const PRINCIPLES = [
  {
    principle: '세니(Seny · 맑은 분별과 차분한 상식)',
    insight: '감정의 파도에 휩쓸리지 않고 눈앞의 사실과 순서를 차분히 짚어내는 맑은 이성',
    tone: '아침 햇살이 비치는 바르셀로나 고딕 지구 안뜰의 분수',
    ritual: '지금 하고 싶은 일 한 가지에 대해 "왜 끌리는가(열정)"와 "첫 단계는 무엇인가(분별)"를 한 줄씩만 나란히 적어 보세요.',
    question: '오늘 내 안에서 너무 앞서가거나 혹은 너무 움츠러들어 균형을 깨뜨리고 있는 쪽은 분별과 열정 중 어느 쪽인가요?',
  },
  {
    principle: '라우샤(Rauxa · 마음을 움직이는 창조적 열정)',
    insight: '틀에 박힌 계산만으로는 넘을 수 없는 벽을 뚫어 주는 순수한 설렘과 직관의 힘',
    tone: '해 질 녘 지중해 해안가를 물들이는 선명한 주홍빛 하늘',
    ritual: '계산과 검토만 반복하느라 미뤄 두었던 일 하나를 오늘 10분만 설렘을 따라 가볍게 시동 걸어 보세요.',
    question: '지나친 계산 때문에 차분함이라는 이름으로 내 안의 순수한 설렘과 직관을 눌러 두고 있는 일은 무엇인가요?',
  },
  {
    principle: '라몬 류이(Ramon Llull) 사유의 나무',
    insight: '서로 상관없어 보이던 생각과 경험들이 한 줄기 위에서 자연스럽게 맞물려 열리는 통찰',
    tone: '마요르카 올리브 과수원 바람에 흔들리는 은빛 나뭇잎',
    ritual: '서로 무관해 보이던 최근 메모 두 개를 나란히 놓고 공통으로 가리키는 방향 한 가지를 연결해 보세요.',
    question: '따로따로 흩어져 있다고 여겼던 경험들 중에서 한 줄기 사유의 나무로 엮으면 뜻밖의 답이 보일 조합은 무엇인가요?',
  },
  {
    principle: '카스텔(Castell · 서로의 어깨를 딛고 서는 인간 탑)',
    insight: '아래에서 묵묵히 받쳐 주는 기반이 튼튼할수록 위를 향한 도전도 흔들리지 않음',
    tone: '광장 한가운데 호흡을 맞추며 모여 선 사람들의 단단한 원',
    ritual: '더 높이 쌓기 전에 지금 내 일상을 밑에서 받쳐 주는 기초 루틴이나 주변의 도움 한 가지를 먼저 점검해 보세요.',
    question: '높이 오르는 목표에만 집중하느라, 아래에서 묵묵히 나를 받쳐 주고 있는 기반이나 동료의 수고를 당연시하지는 않았나요?',
  },
  {
    principle: '사르다나(Sardana · 셈과 리듬이 어우러진 둥근 춤)',
    insight: '자유로움 속에서도 정확한 박자와 약속을 지킬 때 비로소 완성되는 우아한 조화',
    tone: '플라타너스 그늘 아래 일정한 박자로 이어지는 담백한 선율',
    ritual: '오늘 하루 자유 시간과 집중 시간의 경계 박자를 정해 두고, 그 약속된 리듬 안에서 움직여 보세요.',
    question: '자유로운 흐름 속에서도 사르다나의 박자처럼 정확히 지켜 내면 오히려 마음이 편안해질 약속은 무엇인가요?',
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

export function calculateCatalanSenyRauxaBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CatalanSenyRauxaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRINCIPLES.length - 1));
  const picked = PRINCIPLES[idx];
  const companion = PRINCIPLES[(idx + companionOffset) % PRINCIPLES.length];
  const balancePhase = BALANCE_PHASES[stableHash(`${seed}|phase`) % BALANCE_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];

  return {
    engineVersion: 'LUCKEY-CATALAN-SENY-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    catalanPrinciple: picked.principle,
    companionPrinciple: companion.principle,
    balancePhase,
    senyInsight: `${picked.insight} (동반 원리: ${companion.principle})`,
    barcelonaTone: picked.tone,
    shadowWarning,
    reflectionFocus: `카탈루냐 철학의 '${balancePhase}' 흐름에서 '${picked.principle}'와 동반 원리 '${companion.principle}'을 함께 짚어, 분별(Seny)과 열정(Rauxa)의 균형을 맞추어 보세요.`,
    ritualAction: `${picked.ritual} (동반 원리: ${companion.principle})`,
    reflectiveQuestion: `${picked.question} '${balancePhase}' 국면에서 가장 먼저 맞출 박자는 무엇인가요?`,
    interpretiveBoundary: '카탈루냐(Catalan)의 세니·라우샤 균형과 라몬 류이 사유 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCatalanSenyRauxaPrompt(res: CatalanSenyRauxaResult): string {
  return [
    `[카탈루냐 세니·라우샤 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 카탈루냐 원리: ${res.catalanPrinciple} (${res.barcelonaTone})`,
    `- 동반 원리: ${res.companionPrinciple}`,
    `- 균형 국면: ${res.balancePhase}`,
    `- 중심 통찰: ${res.senyInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
