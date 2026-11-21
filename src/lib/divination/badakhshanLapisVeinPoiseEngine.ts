import type { UserProfile } from '../sharedState';

export interface BadakhshanLapisInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface BadakhshanLapisResult {
  engineVersion: string;
  calculatedAtKst: string;
  azureVein: string;
  companionVein: string;
  mineralCraft: string;
  refinementPhase: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const VEINS = [
  '거친 힌두쿠시 암벽 깊숙이 숨어 있는 짙은 쪽빛 맥',
  '푸른 돌 속에 별빛처럼 박힌 황철석 금점(金點)',
  '곱게 갈아 맑은 물에 띄워야 비로소 드러나는 울트라마린 안료',
  '수천 년간 먼 산길을 넘어 그림과 건축에 닿은 푸른 인내',
] as const;

const CRAFTS = [
  '원석을 쪼개기만 해서는 짙은 빛이 나오지 않듯, 힘든 경험도 곱게 다듬고 가라앉혀야 나만의 색이 됩니다.',
  '짙은 푸른빛 속에 섞인 작은 금점들은 흠결이 아니라 이 돌이 진짜임을 말해 주는 고유의 결입니다.',
  '좋은 빛깔을 얻으려면 불순물을 씻어 내고 가라앉기를 기다리는 시간이 반드시 필요합니다.',
  '거친 바위산에서 캐낸 돌이 가장 섬세한 그림의 바탕이 되듯, 단단한 현실 감각 위에 섬세한 표현이 올라갑니다.',
] as const;

const ACTIONS = [
  '요즘 나를 거칠게 누르는 문제에서 씻어 내어 정제할 불순물(불안·잡음) 하나 골라내기',
  '내 안에 흠처럼 느껴지던 성향 하나를 고유한 금점(개성)으로 다시 바라보기',
  '결과물을 급히 내놓기 전에 하루만 더 숙성하거나 한 번 더 다듬는 여유 갖기',
  '깊은 집중이 필요한 작업 전 주변의 소음을 5분간 꺼 두고 맑은 바탕 만들기',
] as const;

const QUESTIONS = [
  '지금 내 일상이라는 거친 암석 속에서 곱게 갈아 꺼내면 빛날 푸른 맥은 무엇인가요?',
  '스스로 흠결이라 여겼지만 사실은 나를 고유하게 만드는 금점 같은 면모는 무엇인가요?',
  '서둘러 칠하기 전에 충분히 가라앉히고 정제해야 할 감정이나 생각은 무엇인가요?',
  '먼 길을 돌아서라도 결국 꼭 남겨 두고 싶은 나만의 색깔은 어떤 빛깔인가요?',
] as const;

const REFINEMENT_PHASES = [
  '원석 채굴(거친 본질 마주하기)',
  '곱게 갈기(복잡한 생각 쪼개기)',
  '맑은 물 침전(불순물 가라앉히기)',
  '순수 안료 채취(핵심만 남기기)',
] as const;

const SHADOW_WARNINGS = [
  '불순물을 덜어 내는 데만 매달리면 원석 자체의 묵직한 힘까지 깎아 버릴 수 있습니다.',
  '완벽한 안료가 될 때까지 기다리기만 하면 정작 붓을 들어 그릴 시간을 놓칩니다.',
  '고유의 금점을 흠으로 여기고 지우려 들수록 나다운 빛깔이 흐려질 수 있습니다.',
  '거친 산길을 피하려고만 하면 귀한 청금석 맥을 만날 기회도 멀어집니다.',
] as const;

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateBadakhshanLapisVein(input: BadakhshanLapisInput): BadakhshanLapisResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const veinIdx = seed % VEINS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (VEINS.length - 1));
  const phaseIdx = hashSeed(`${seedText}|phase`) % REFINEMENT_PHASES.length;
  const azureVein = VEINS[veinIdx];
  const companionVein = VEINS[(veinIdx + companionOffset) % VEINS.length];
  const refinementPhase = REFINEMENT_PHASES[phaseIdx];
  const shadowWarning = SHADOW_WARNINGS[(phaseIdx + companionOffset) % SHADOW_WARNINGS.length];

  return {
    engineVersion: 'LUCKEY-BADAKHSHAN-LAPIS-v2.3.0',
    calculatedAtKst: toKstIso(input.now),
    azureVein,
    companionVein,
    mineralCraft: CRAFTS[(seed >>> 3) % CRAFTS.length],
    refinementPhase,
    shadowWarning,
    reflectionFocus: `힌두쿠시 바다흐샨의 험준한 암벽에서 캐낸 청금석(라피스 라줄리)을 곱게 갈아 가장 순수한 푸른 안료를 얻던 공예처럼, 주 맥('${azureVein}')과 동반 맥('${companionVein}')이 '${refinementPhase}' 단계에서 만나 정제와 고유의 결을 함께 읽는 상징적 관점입니다.`,
    ritualAction: `${ACTIONS[veinIdx]} (${refinementPhase} 흐름에서 동반 맥 '${companionVein}'의 결도 함께 살피며 다듬어 보세요.)`,
    reflectiveQuestion: `${QUESTIONS[veinIdx]} (동반 맥 '${companionVein}'을 나란히 두었을 때 지금 가장 먼저 가라앉힐 잡음은 무엇인가요?)`,
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatBadakhshanLapisPrompt(res: BadakhshanLapisResult): string {
  return [
    `[바다흐샨·청금석 안료 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `청금석 맥: ${res.azureVein}`,
    `동반 맥: ${res.companionVein}`,
    `정제 단계: ${res.refinementPhase}`,
    `과잉 경계: ${res.shadowWarning}`,
    `정제 공예: ${res.mineralCraft}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
