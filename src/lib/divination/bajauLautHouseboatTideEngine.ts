import type { UserProfile } from '../sharedState';

export interface BajauLautInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface BajauLautResult {
  engineVersion: string;
  calculatedAtKst: string;
  tidalAnchor: string;
  companionAnchor: string;
  horizonDrift: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const ANCHORS = [
  '산호초 위 맑은 물빛 아래 흔들리는 레파(Lepa) 뱃머리',
  '뭍에 매이지 않고 물때에 맞춰 닻을 올리는 가벼운 아침',
  '깊은 바닷속을 한 호흡에 건너는 고요한 잠수 리듬',
  '바다 위의 불빛들이 둥글게 모여 저녁을 나누는 선단',
] as const;

const DRIFTS = [
  '땅 위에 고정된 울타리가 없어도, 오늘의 물때와 바람을 읽는 감각이 있으면 어디서나 집을 지을 수 있습니다.',
  '숨을 오래 참기보다 물에 들어가기 전 힘을 빼고 고르게 들이쉬는 준비가 깊이를 결정합니다.',
  '파도가 거세질 때는 억지로 노를 젓기보다 산호초 안쪽 잔잔한 만으로 잠시 배를 대는 지혜가 필요합니다.',
  '가볍게 이동할 수 있는 짐만 남길 때 변화하는 상황에서도 흔들리지 않고 방향을 바꿀 수 있습니다.',
] as const;

const ACTIONS = [
  '오늘 나를 무겁게 붙잡고 있는 불필요한 걱정이나 물건 한 가지를 내려놓아 가볍게 만들기',
  '무언가에 깊이 집중하기 전에 1분간 어깨 힘을 빼고 고른 호흡부터 가다듬기',
  '상황이 거칠어질 때 잠시 피해 쉬어 갈 나만의 안전지대(루틴·공간) 하나 떠올리기',
  '고정된 계획 하나에 매달리지 말고 오늘의 컨디션에 맞춘 유연한 대안 한 줄 적기',
] as const;

const QUESTIONS = [
  '지금 내가 땅의 기준처럼 굳게 붙잡고 있지만, 사실은 물때에 맞추어 흘려보내도 좋을 집착은 무엇인가요?',
  '깊이 들어가기 전에 내 호흡이 먼저 얕아져 있지는 않나요?',
  '오늘의 파도가 높을 때 내가 잠시 닻을 내리고 숨을 고를 잔잔한 만은 어디인가요?',
  '더 가볍게 항해하기 위해 배 위에서 비워 내도 좋을 짐은 무엇일까요?',
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

export function calculateBajauLautTide(input: BajauLautInput): BajauLautResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const anchorIdx = seed % ANCHORS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (ANCHORS.length - 1));
  const tidalAnchor = ANCHORS[anchorIdx];
  const companionAnchor = ANCHORS[(anchorIdx + companionOffset) % ANCHORS.length];

  return {
    engineVersion: 'LUCKEY-BAJAU-LAUT-v2.2.0',
    calculatedAtKst: toKstIso(input.now),
    tidalAnchor,
    companionAnchor,
    horizonDrift: DRIFTS[(seed >>> 3) % DRIFTS.length],
    reflectionFocus: `동남아 술루해·셀레베스해를 집 삼아 물때와 호흡으로 살아가는 바야우 라우트 바다 유목민의 레파(Lepa) 항해처럼, 주 닻 자리('${tidalAnchor}')와 동반 자리('${companionAnchor}')를 겹쳐 가벼움과 호흡의 리듬을 읽는 상징적 관점입니다.`,
    ritualAction: ACTIONS[anchorIdx],
    reflectiveQuestion: QUESTIONS[anchorIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatBajauLautPrompt(res: BajauLautResult): string {
  return [
    `[바야우·라우트 바다 유목 물때 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `닻의 자리: ${res.tidalAnchor}`,
    `동반 자리: ${res.companionAnchor}`,
    `항해 흐름: ${res.horizonDrift}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
