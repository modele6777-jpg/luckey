import type { UserProfile } from '../sharedState';

export interface WodaabeGerewolInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface WodaabeGerewolResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '만남·연결' | '인내·품위' | '중심·태도' | '회복·축하' | '우다베 전반';
  desertGathering: string;
  companionGathering: string;
  innerPoise: string;
  munyaPoiseAxis: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const GATHERINGS = [
  '사헬 초원의 빗물 뒤에야 비로소 흩어진 이들이 모이는 만남',
  '긴 건기를 견딘 뒤 서로의 눈빛과 자세를 비추어 보는 춤의 줄',
  '거친 모래바람 속에서도 흩트리지 않는 단정한 몸가짐',
  '서로의 인내와 품위를 겨루며 함께 노래하는 밤의 원',
] as const;

const MUNYA_AXES = [
  '긴 기다림 끝에 계절의 만남을 다시 잇는 사헬 재회의 축',
  '어려움 앞에서도 눈빛과 자세를 지키는 무냐(Munya) 인내의 축',
  '외부 바람에 흔들리지 않고 단정한 태도를 세우는 중심 품위의 축',
  '수고로운 여정 끝에 서로를 격려하고 숨을 고르는 축제 회복의 축',
] as const;

const SHADOW_WARNINGS = [
  '사람들과의 만남과 연결을 기다리느라 정작 지금 혼자 걸어야 할 구간의 준비를 미루지 마세요.',
  '표정과 태도를 단정히 참아 내는 인내(무냐)가 꼭 표현해야 할 정당한 불편함까지 삼키게 하지 않도록 살피세요.',
  '단정한 몸가짐과 품위를 지키는 데 힘을 쓰다 보면 가까운 사이에서 필요한 솔직한 취약함이 가려질 수 있어요.',
  '휴식과 작은 축하로 숨을 고른 뒤에는 다시 출발할 작은 실행 한 가지를 이어 붙여 두세요.',
] as const;

function classifyWodaabeTopic(q: string): WodaabeGerewolResult['questionTopic'] {
  if (/만남|인연|안부|사람|모이/.test(q)) return '만남·연결';
  if (/인내|품위|힘든|견디|무냐/.test(q)) return '인내·품위';
  if (/태도|중심|표정|말투|조급/.test(q)) return '중심·태도';
  if (/회복|축하|휴식|수고|산책/.test(q)) return '회복·축하';
  return '우다베 전반';
}

const POISES = [
  '진정한 매력과 설득력은 요란한 과시가 아니라 힘든 상황에서도 표정과 태도를 잃지 않는 인내(무냐)에서 나옵니다.',
  '모두가 각자의 길을 걷다가도 약속된 계절이 오면 다시 만나는 리듬이 외로움을 견디게 합니다.',
  '남의 시선을 의식해 조급해지기보다 나 자신의 중심과 눈빛을 고요히 지킬 때 존재감이 자연스레 드러납니다.',
  '긴 이동 끝의 작은 축제가 다음 긴 여정을 건너갈 힘을 채워 줍니다.',
] as const;

const ACTIONS = [
  '오늘 감정이 흔들리는 순간에도 말투와 표정을 한 박자 고요하게 유지해 보기',
  '수고한 나 자신을 위해 소박하지만 기분 좋은 작은 의식(차 한 잔·산책) 열기',
  '최근 소식이 뜸했던 반가운 사람에게 계절 안부 한 통 가볍게 건네기',
  '결과를 서두르기보다 지금 내가 버텨 내고 있는 과정의 품위를 스스로 인정해 주기',
] as const;

const QUESTIONS = [
  '바쁘고 거친 일상 속에서도 내가 꼭 지켜 내고 싶은 태도와 품위는 무엇인가요?',
  '요즘 나를 조급하게 만드는 시선 앞에서 잠깐 멈춰 고요히 지킬 중심은 어디인가요?',
  '긴 노력의 시간 뒤에 나에게 허락해 주고 싶은 작은 축하의 순간은 무엇인가요?',
  '멀리 떨어져 있어도 계절이 돌면 다시 이어질 소중한 인연은 누구인가요?',
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

export function calculateWodaabeGerewol(input: WodaabeGerewolInput): WodaabeGerewolResult {
  const fate = input.profile.fate ?? {};
  const questionText = (input.question ?? '').trim();
  const questionTopic = classifyWodaabeTopic(questionText);
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${questionText}`;
  const seed = hashSeed(seedText);
  const gatheringIdx = seed % GATHERINGS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (GATHERINGS.length - 1));
  const desertGathering = GATHERINGS[gatheringIdx];
  const companionGathering = GATHERINGS[(gatheringIdx + companionOffset) % GATHERINGS.length];

  return {
    engineVersion: 'LUCKEY-WODAABE-GEREWOL-v2.3.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    desertGathering,
    companionGathering,
    innerPoise: POISES[(seed >>> 3) % POISES.length],
    munyaPoiseAxis: MUNYA_AXES[gatheringIdx],
    reflectionFocus: `사헬 유목민 우다베 족이 긴 건기를 지나 우기에 모여 인내와 품위(무냐)를 나누는 게레월 축제에서 주 만남('${desertGathering}')과 동반 만남('${companionGathering}')을 겹쳐 태도와 회복을 읽는 상징적 관점입니다.`,
    ritualAction: ACTIONS[gatheringIdx],
    shadowWarning: SHADOW_WARNINGS[gatheringIdx],
    reflectiveQuestion: QUESTIONS[gatheringIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatWodaabeGerewolPrompt(res: WodaabeGerewolResult): string {
  return [
    `[우다베·게레월 사헬 품위 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `만남의 장: ${res.desertGathering}`,
    `무냐 품위 축: ${res.munyaPoiseAxis}`,
    `동반 장: ${res.companionGathering}`,
    `내면 품위: ${res.innerPoise}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `과잉 경계: ${res.shadowWarning}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
