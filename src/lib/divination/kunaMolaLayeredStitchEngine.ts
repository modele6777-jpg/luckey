import type { UserProfile } from '../sharedState';

export interface KunaMolaInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface KunaMolaResult {
  engineVersion: string;
  calculatedAtKst: string;
  fabricLayer: string;
  companionLayer: string;
  reverseStitch: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LAYERS = [
  '윗천을 조심히 도려내어 아래의 밝은 색을 드러내는 역아플리케',
  '서로 다른 원색의 천이 겹쳐지며 깊이를 만드는 다층 결',
  '직선과 곡선이 번갈아 미로처럼 이어지는 바닷물 무늬',
  '한 땀씩 안쪽으로 접어 감침질해 닳지 않는 튼튼한 가장자리',
] as const;

const STITCHES = [
  '겉에 새 색을 덧붙이는 대신 지금 덮여 있는 불필요한 겹을 하나 덜어낼 때 속마음이 드러납니다.',
  '비슷한 하루가 겹쳐 보이지만 그 아래에 숨겨 둔 나만의 색깔이 분명히 살아 있습니다.',
  '서두르지 않는 한 땀이 겹칠수록 쉽게 풀리지 않는 나만의 무늬가 완성됩니다.',
  '겉면의 화려함보다 안쪽 시접을 단정히 접어 넣는 세심함이 오래가는 힘을 만듭니다.',
] as const;

const ACTIONS = [
  '오늘 내가 맡은 일이나 일정에서 겉치레 겹 하나를 덜어내고 본질만 남기기',
  '미뤄 두었던 작은 디테일(마감선·정리·안부)을 10분만 투자해 꼼꼼히 여미기',
  '내가 좋아하는 색깔이나 취향 한 가지를 오늘 일상 소품이나 선택에 반영하기',
  '복잡한 문제를 한 번에 풀려 하지 말고 가장 바깥 겹부터 한 층씩 오려 내기',
] as const;

const QUESTIONS = [
  '지금 내 마음의 색이 드러나려면 걷어 내야 할 불필요한 겹은 무엇인가요?',
  '남의 시선이라는 겉천 아래에 내가 조용히 간직하고 있는 진짜 바람은 무엇인가요?',
  '요즘 내가 대충 넘겼지만 한 땀만 더 정성을 들이면 단단해질 부분은 어디인가요?',
  '서로 다른 색깔의 역할들이 부딪히지 않고 하나의 무늬가 되려면 어떤 배치의 여유가 필요할까요?',
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

export function calculateKunaMolaStitch(input: KunaMolaInput): KunaMolaResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const layerIdx = seed % LAYERS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (LAYERS.length - 1));
  const fabricLayer = LAYERS[layerIdx];
  const companionLayer = LAYERS[(layerIdx + companionOffset) % LAYERS.length];

  return {
    engineVersion: 'LUCKEY-KUNA-MOLA-v2.2.0',
    calculatedAtKst: toKstIso(input.now),
    fabricLayer,
    companionLayer,
    reverseStitch: STITCHES[(seed >>> 3) % STITCHES.length],
    reflectionFocus: `파나마 산블라스 제도 쿠나 족 여인들이 여러 겹의 천을 오려 내며 아래의 색을 드러내는 몰라(Mola) 직물처럼, 주 겹('${fabricLayer}')과 동반 겹('${companionLayer}')을 함께 짚어 덜어냄으로 본질을 드러내는 상징적 관점입니다.`,
    ritualAction: ACTIONS[layerIdx],
    reflectiveQuestion: QUESTIONS[layerIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatKunaMolaPrompt(res: KunaMolaResult): string {
  return [
    `[쿠나·몰라 겹 바느질 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `천의 겹: ${res.fabricLayer}`,
    `동반 겹: ${res.companionLayer}`,
    `역아플리케 결: ${res.reverseStitch}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
