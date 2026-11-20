import type { UserProfile } from '../sharedState';

export interface SererBaobabInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface SererBaobabResult {
  engineVersion: string;
  calculatedAtKst: string;
  councilShade: string;
  companionShade: string;
  baobabRoots: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SHADES = [
  '거대한 바오밥 그늘 아래 둘러앉은 오후',
  '깊은 뿌리에 물을 저장해 둔 건기의 넉넉함',
  '서로의 말을 끝까지 듣는 원형 평의회 자리',
  '바람을 피하고 지혜를 나누는 굵은 줄기',
] as const;

const ROOTS = [
  '겉으로 가지를 뻗기 전에 보이지 않는 뿌리에 여력을 비축하면 긴 가뭄도 견딥니다.',
  '혼자 내린 성급한 결론보다 믿을 수 있는 한 사람의 이야기를 끝까지 듣는 데서 답이 나옵니다.',
  '넓은 그늘을 내어주는 여유는 내 안의 중심이 단단히 서 있을 때 자연스레 생깁니다.',
  '오래된 나무가 계절을 재촉하지 않듯, 지금의 기다림도 결실을 키우는 시간입니다.',
] as const;

const ACTIONS = [
  '오늘 대화에서 상대의 말을 끊지 않고 끝까지 들은 뒤 한 박자 쉬고 답하기',
  '당장 쓰지 않더라도 나를 든든하게 해 줄 체력·수면 여력 한 가지 챙기기',
  '급히 결정해야 할 일과 며칠 숙성해도 되는 일을 나누어 적어 보기',
  '고민을 혼자 껴안지 않고 신뢰하는 사람에게 짤막히 의견 구해 보기',
] as const;

const QUESTIONS = [
  '지금 내 일상에서 보이지 않게 에너지를 비축해 두어야 할 뿌리는 무엇인가요?',
  '내 마음을 조급하게 만드는 소리 중 바오밥 그늘 아래서 잠시 내려놓을 것은 무엇인가요?',
  '혼자 고민하기보다 지혜를 나누어 들으면 한결 선명해질 주제가 있나요?',
  '오래 버티기 위해 오늘 내가 스스로에게 허용해야 할 여유는 무엇일까요?',
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

export function calculateSererBaobabCouncil(input: SererBaobabInput): SererBaobabResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const shadeIdx = seed % SHADES.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (SHADES.length - 1));
  const councilShade = SHADES[shadeIdx];
  const companionShade = SHADES[(shadeIdx + companionOffset) % SHADES.length];

  return {
    engineVersion: 'LUCKEY-SERER-BAOBAB-v2.2.0',
    calculatedAtKst: toKstIso(input.now),
    councilShade,
    companionShade,
    baobabRoots: ROOTS[(seed >>> 3) % ROOTS.length],
    reflectionFocus: `세네갈 세레르 족이 오래된 바오밥 나무 그늘 아래 모여 경청과 비축의 지혜를 나누던 평의회처럼, 주 그늘('${councilShade}')과 동반 그늘('${companionShade}')을 함께 짚어 내면의 여력과 깊은 대화를 살피는 상징적 관점입니다.`,
    ritualAction: ACTIONS[shadeIdx],
    reflectiveQuestion: QUESTIONS[shadeIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatSererBaobabPrompt(res: SererBaobabResult): string {
  return [
    `[세레르·바오밥 평의회 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `그늘 자리: ${res.councilShade}`,
    `동반 자리: ${res.companionShade}`,
    `뿌리 지혜: ${res.baobabRoots}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
