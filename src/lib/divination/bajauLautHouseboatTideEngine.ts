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
  tidalPhase: string;
  questionTopic: 'breath' | 'release' | 'shelter' | 'general';
  tidalCrossAxis: string;
  shadowWarning: string;
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

const TIDAL_PHASES = [
  '들물 맞이(가벼운 닻 올리기)',
  '만조의 숨 고르기(깊은 호흡 준비)',
  '썰물 흘려보내기(군더더기 비우기)',
  '잔잔한 만 정박(선단과 저녁 나누기)',
] as const;

const SHADOW_WARNINGS = [
  '어디에도 매이지 않으려다 정작 오래 뿌리내려야 할 관계나 약속까지 가볍게 지나칠 수 있습니다.',
  '파도를 피해 만으로 숨기만 하면 정작 건너야 할 넓은 바다로 나갈 때가 늦어집니다.',
  '호흡을 아끼려고 숨을 너무 오래 참다 보면 오히려 작은 물결에도 급히 흔들릴 수 있습니다.',
  '짐을 비우는 데 집중한 나머지 오늘 꼭 챙겨야 할 필수 나침반까지 내려놓지 않도록 살피세요.',
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
  const phaseIdx = hashSeed(`${seedText}|phase`) % TIDAL_PHASES.length;
  const tidalAnchor = ANCHORS[anchorIdx];
  const companionAnchor = ANCHORS[(anchorIdx + companionOffset) % ANCHORS.length];
  const tidalPhase = TIDAL_PHASES[phaseIdx];
  const shadowWarning = SHADOW_WARNINGS[(phaseIdx + companionOffset) % SHADOW_WARNINGS.length];
  const q = (input.question ?? '').trim();
  const questionTopic: BajauLautResult['questionTopic'] = !q
    ? 'general'
    : /호흡|숨|물때|리듬|집중/.test(q)
      ? 'breath'
      : /비우|가볍|집착|내려|짐/.test(q)
        ? 'release'
        : /피하|쉼|만|안전|파도/.test(q)
          ? 'shelter'
          : 'general';
  const tidalCrossAxis = `${questionTopic} · ${tidalAnchor.split('(')[0].trim()} × ${tidalPhase.split('(')[0].trim()}`;

  return {
    engineVersion: 'LUCKEY-BAJAU-LAUT-v2.4.0',
    calculatedAtKst: toKstIso(input.now),
    tidalAnchor,
    companionAnchor,
    horizonDrift: DRIFTS[(seed >>> 3) % DRIFTS.length],
    tidalPhase,
    questionTopic,
    tidalCrossAxis,
    shadowWarning,
    reflectionFocus: `동남아 술루해·셀레베스해를 집 삼아 물때와 호흡으로 살아가는 바야우 라우트 바다 유목민의 레파(Lepa) 항해처럼, 주 닻 자리('${tidalAnchor}')와 동반 자리('${companionAnchor}')가 '${tidalPhase}' 물때 위에서 겹쳐 가벼움과 호흡의 리듬을 읽는 상징적 관점입니다.`,
    ritualAction: `${ACTIONS[anchorIdx]} (${tidalPhase} 흐름에서 동반 자리 '${companionAnchor}'의 감각도 함께 맞춰 보세요.)`,
    reflectiveQuestion: `${QUESTIONS[anchorIdx]} (동반 자리 '${companionAnchor}'를 함께 띄워 보면 오늘 가장 가볍게 바꿀 방향은 어디인가요?)`,
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatBajauLautPrompt(res: BajauLautResult): string {
  return [
    `[바야우·라우트 바다 유목 물때 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `닻의 자리: ${res.tidalAnchor}`,
    `동반 자리: ${res.companionAnchor}`,
    `물때 국면: ${res.tidalPhase}`,
    `질문 맥락(${res.questionTopic}) · 물때 교차 축: ${res.tidalCrossAxis}`,
    `과잉 경계: ${res.shadowWarning}`,
    `항해 흐름: ${res.horizonDrift}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
