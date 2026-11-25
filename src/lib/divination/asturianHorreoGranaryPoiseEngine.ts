import type { UserProfile } from '../sharedState';

export interface AsturianHorreoInput {
  profile: UserProfile;
  now?: Date;
  question?: string;
}

export interface AsturianHorreoResult {
  engineVersion: string;
  calculatedAtKst: string;
  granaryMotif: string;
  companionMotif: string;
  woodenBeamState: string;
  ventilationPhase: string;
  questionTopic: 'preservation' | 'ventilation' | 'boundary' | 'general';
  horreoCrossAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  '페고요 돌기둥(Pegollo): 습기와 쥐를 막아 올린 네 다리 위에서 비축한 자원을 안전하게 띄워 두는 경계',
  '밤나무 통풍 살창(Llistones): 닫아 두지 않고 바람을 통과시켜 안쪽의 결실을 보송하게 지키는 순환',
  '칼로·조각 문양(Talla): 오래 쓸 곡창 들보에 새긴 가문의 선처럼 일상의 기본기를 정성껏 남기는 손길',
  '지붕 처마의 이끼(Teyáu): 비바람을 먼저 맞아 주며 아래쪽 살림을 보전하는 넉넉한 지붕의 여백',
] as const;

const BEAM_STATES = [
  '단단히 받쳐 올린 안정',
  '바람이 드나드는 건조함',
  '서두름 없이 묵히는 숙성',
  '비바람을 흘려보내는 처마',
] as const;

const RITUALS = [
  '당장 쓰지 않을 일과 물건 하나를 손이 닿지 않는 높은 선반으로 잠시 올려 두세요.',
  '답답한 일정 사이로 짧은 창문을 열어 환기하듯 10분의 빈칸을 끼워 넣으세요.',
  '오늘 해야 할 일 중 가장 오래 남을 한 가지의 기초만 정성껏 다듬어 두세요.',
  '외부의 소란이 직접 닿지 않도록 알림 하나를 끄고 한 걸음 물러나 보세요.',
] as const;

const QUESTIONS = [
  '지금 내 마음을 축축하게 만드는 것은 바닥과 거리를 두지 못했기 때문은 아닐까요?',
  '꼭꼭 싸매 두느라 오히려 바람이 통하지 않고 있는 계획은 무엇인가요?',
  '눈앞의 결과보다 오랫동안 든든히 받쳐 줄 기둥은 무엇인지 살펴볼까요?',
  '비바람이 지나갈 때까지 잠시 처마 아래에서 기다려 주어도 괜찮은 일은 없나요?',
] as const;

const VENTILATION_PHASES = [
  '아침 이슬 털어내기(초기 정리)',
  '맞바람 통풍(교류와 환기)',
  '그늘 아래 숙성(묵힘과 보전)',
  '겨울비 대비 점검(경계 다지기)',
] as const;

const SHADOW_WARNINGS = [
  '습기를 피하려다 필요한 교류마저 끊어내면 곡창 안이 오히려 메마르고 고립될 수 있습니다.',
  '비축에만 마음을 쏟고 당장 나눠야 할 온기를 미루면 쌓아 둔 결실이 무거워집니다.',
  '안전한 거리를 지키려는 경계심이 지나쳐 새로운 시도까지 바닥 아래로 밀어내지 않도록 살피세요.',
  '남의 시선을 막는 처마만 키우다 보면 정작 내 안의 바람길까지 막힐 수 있습니다.',
] as const;

function toKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateAsturianHorreoPoise(input: AsturianHorreoInput): AsturianHorreoResult {
  const now = input.now ?? new Date();
  const fate = input.profile?.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.question ?? ''}|${now.toISOString().slice(0, 13)}|asturian-horreo`;
  const h = stableHash(seedText);

  const motifIdx = h % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seedText}|companion`) % (MOTIFS.length - 1));
  const phaseIdx = stableHash(`${seedText}|phase`) % VENTILATION_PHASES.length;
  const granaryMotif = MOTIFS[motifIdx];
  const companionMotif = MOTIFS[(motifIdx + companionOffset) % MOTIFS.length];
  const woodenBeamState = BEAM_STATES[(h >>> 3) % BEAM_STATES.length];
  const ventilationPhase = VENTILATION_PHASES[phaseIdx];
  const shadowWarning = SHADOW_WARNINGS[(phaseIdx + companionOffset) % SHADOW_WARNINGS.length];
  const q = (input.question ?? '').trim();
  const questionTopic: AsturianHorreoResult['questionTopic'] = !q
    ? 'general'
    : /보존|습기|비축|지키|저장|버티/.test(q)
      ? 'preservation'
      : /바람|환기|소통|숨|답답|흐름/.test(q)
        ? 'ventilation'
        : /경계|거리|소란|거절|막아/.test(q)
          ? 'boundary'
          : 'general';
  const horreoCrossAxis = `${questionTopic} · ${granaryMotif.split(':')[0].trim()} × ${ventilationPhase.split('(')[0].trim()}`;
  const ritualAction = `${RITUALS[motifIdx]} (${ventilationPhase} 리듬에 맞춰 동반 모티프 '${companionMotif.split(':')[0]}'의 시선으로 마무리해 보세요.)`;
  const reflectiveQuestion = `${QUESTIONS[motifIdx]} (동반 결 '${companionMotif.split(':')[0]}'까지 함께 얹었을 때 지금 가장 먼저 환기할 구석은 어디인가요?)`;

  return {
    engineVersion: 'LUCKEY-ASTURIAN-HORREO-v2.4.0',
    calculatedAtKst: toKstIso(now),
    granaryMotif,
    companionMotif,
    woodenBeamState,
    ventilationPhase,
    questionTopic,
    horreoCrossAxis,
    shadowWarning,
    reflectionFocus: `땅의 습기에서 한 뼘 띄워 바람을 통하게 하는 아스투리아스 오레오 곡창처럼, 주 모티프와 동반 모티프('${companionMotif}')가 '${ventilationPhase}' 국면 위에서 어우러져 지금은 '${woodenBeamState}'의 거리 두기가 필요한 때입니다.`,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary: '아스투리아스 오레오 공중 곡창의 저장·통풍 지혜를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAsturianHorreoPrompt(result: AsturianHorreoResult): string {
  return [
    `[아스투리아스 오레오 곡창 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 상징 모티프: ${result.granaryMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 현재 결: ${result.woodenBeamState}`,
    `- 통풍 국면: ${result.ventilationPhase}`,
    `- 질문 맥락(${result.questionTopic}) · 오레오 교차 축: ${result.horreoCrossAxis}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
