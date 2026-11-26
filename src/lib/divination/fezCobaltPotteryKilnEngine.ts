import type { UserProfile } from '../sharedState';

export interface FezCobaltInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface FezCobaltResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '중심·대칭' | '여백·기다림' | '열기·완성' | '공예 전반';
  kilnGlaze: string;
  companionGlaze: string;
  kilnSymmetryAxis: string;
  topicBalanceHint: string;
  cobaltSymmetry: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const GLAZES = [
  '회백색 흙 위에 코발트 블루가 또렷이 번져 나오는 첫 붓질',
  '여덟 갈래 별의 대칭을 중심에서부터 밖으로 그려 가는 손길',
  '올리브씨를 태운 가마 불길 속에서 유약이 빛을 얻는 고요한 기다림',
  '물을 머금어 시원함을 지켜 주는 다공질 토기의 숨구멍',
] as const;

const SYMMETRIES = [
  '중심이 먼저 찍혀 있어야 바깥쪽으로 뻗어 나가는 대칭 문양이 흔들리지 않습니다.',
  '유약이 가마의 열기를 지나야 비로소 제 빛을 내듯, 지금의 긴장도 완성으로 가는 열기일 수 있습니다.',
  '빈 여백이 남아 있어야 푸른 무늬가 숨을 쉬고 도드라져 보입니다.',
  '손으로 빚은 그릇은 미세한 비대칭 덕분에 오히려 손에 착 감기는 온기를 지닙니다.',
] as const;

const ACTIONS = [
  '오늘 가장 어수선한 일 하나를 중심점(핵심 1가지)부터 다시 그려 나가기',
  '빼곡히 채워 둔 일정이나 생각 사이에 코발트 무늬가 숨 쉴 여백 15분 비워 두기',
  '완벽한 대칭이 아니더라도 지금 손에 쥐고 있는 진심과 온기를 먼저 인정하기',
  '가마에서 식기를 기다리듯 당장 답을 재촉하지 않고 내일까지 묵혀 둘 일 하나 정하기',
] as const;

const QUESTIONS = [
  '내 마음의 그릇에서 문양을 그려 나가기 전에 먼저 찍어야 할 중심점은 어디인가요?',
  '요즘 내 일상에서 푸른 무늬가 숨 쉴 수 있는 흰 여백이 충분히 남아 있나요?',
  '지금 겪고 있는 열기나 압박이 나를 단단하게 구워 내는 가마 불길이라면, 무엇이 완성되고 있나요?',
  '완벽해야 한다는 부담을 조금 덜어내면 오히려 더 자연스러워질 일은 무엇일까요?',
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

const FEZ_SHADOWS = [
  '첫 붓질의 완벽함을 재느라 정작 도화지 위에 첫 점을 찍는 시작 자체를 미루지 마세요.',
  '대칭을 맞추는 데만 신경 쓰다 손으로 빚은 그릇만의 자연스러운 숨결과 온기를 지우지 마세요.',
  '가마에서 식기를 기다린다는 핑계로 지금 바로 손봐야 할 유약의 틈새까지 방치하지 않도록 살피세요.',
  '여백을 남긴다는 이유로 꼭 채워야 할 핵심 약속과 일상의 책임까지 비워 두지 마세요.',
] as const;

const TOPIC_BALANCE_HINTS: Record<FezCobaltResult['questionTopic'], string> = {
  '중심·대칭': '중심점부터 또렷이 찍되, 완벽한 대칭에 매여 손으로 빚은 자연스러운 온기를 지우지 마세요.',
  '여백·기다림': '푸른 무늬가 숨 쉴 흰 여백을 남기되, 꼭 지켜야 할 현실 약속과 마감까지 비워 두지는 마세요.',
  '열기·완성': '가마 불길의 열기를 견디며 완성을 기다리되, 지금 바로 손봐야 할 작은 틈새는 먼저 메우세요.',
  '공예 전반': '첫 붓질을 담백하게 내딛되, 결과물 평가보다 지금 손에 쥔 정성과 리듬을 먼저 믿으세요.',
};

function classifyFezTopic(q: string): FezCobaltResult['questionTopic'] {
  if (/중심|대칭|균형|핵심|별/.test(q)) return '중심·대칭';
  if (/여백|기다림|휴식|쉼|비움/.test(q)) return '여백·기다림';
  if (/열기|완성|일|압박|가마/.test(q)) return '열기·완성';
  return '공예 전반';
}

export function calculateFezCobaltPottery(input: FezCobaltInput): FezCobaltResult {
  const fate = input.profile.fate ?? {};
  const q = (input.question ?? '').trim();
  const questionTopic = classifyFezTopic(q);
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${q}`;
  const seed = hashSeed(seedText);
  const glazeIdx = seed % GLAZES.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (GLAZES.length - 1));
  const kilnGlaze = GLAZES[glazeIdx];
  const companionGlaze = GLAZES[(glazeIdx + companionOffset) % GLAZES.length];
  const kilnSymmetryAxis = `${kilnGlaze.slice(0, 14).trim()} ↔ ${companionGlaze.slice(0, 14).trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = FEZ_SHADOWS[glazeIdx];

  return {
    engineVersion: 'LUCKEY-FEZ-COBALT-v2.4.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    kilnGlaze,
    companionGlaze,
    kilnSymmetryAxis,
    topicBalanceHint,
    cobaltSymmetry: SYMMETRIES[(seed >>> 3) % SYMMETRIES.length],
    reflectionFocus: `모로코 페즈의 장인들이 흰 흙 위에 코발트 블루 기하학 문양을 중심에서부터 그려 가마에 구워 내는 도자기 공예처럼, 주 유약('${kilnGlaze}')과 동반 유약('${companionGlaze}')을 겹쳐 중심과 여백의 균형을 살피는 상징적 관점입니다.`,
    ritualAction: ACTIONS[glazeIdx],
    shadowWarning,
    reflectiveQuestion: QUESTIONS[glazeIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatFezCobaltPrompt(res: FezCobaltResult): string {
  return [
    `[페즈·코발트 도자기 가마 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `질문 맥락: ${res.questionTopic} | 가마·대칭 축: ${res.kilnSymmetryAxis}`,
    `맥락 균형 조언: ${res.topicBalanceHint}`,
    `유약 빛깔: ${res.kilnGlaze}`,
    `동반 빛깔: ${res.companionGlaze}`,
    `대칭 여백: ${res.cobaltSymmetry}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `과잉 경계: ${res.shadowWarning}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
