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
  woodenBeamState: string;
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

function toKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
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
  const seedText = `${fate.birthdate ?? ''}|${fate.birthtime ?? ''}|${input.question ?? ''}|${now.toISOString().slice(0, 10)}|asturian-horreo`;
  const h = stableHash(seedText);

  const granaryMotif = MOTIFS[h % MOTIFS.length];
  const woodenBeamState = BEAM_STATES[(h >>> 3) % BEAM_STATES.length];
  const ritualAction = RITUALS[(h >>> 6) % RITUALS.length];
  const reflectiveQuestion = QUESTIONS[(h >>> 9) % QUESTIONS.length];

  return {
    engineVersion: 'LUCKEY-ASTURIAN-HORREO-v2.1.0',
    calculatedAtKst: toKstIso(now),
    granaryMotif,
    woodenBeamState,
    reflectionFocus: `땅의 습기에서 한 뼘 띄워 바람을 통하게 하는 아스투리아스 오레오 곡창처럼, 지금은 '${woodenBeamState}'의 거리 두기가 필요한 때입니다.`,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary: '아스투리아스 오레오 공중 곡창의 저장·통풍 지혜를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAsturianHorreoPrompt(result: AsturianHorreoResult): string {
  return [
    `[아스투리아스 오레오 곡창 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 상징 모티프: ${result.granaryMotif}`,
    `- 현재 결: ${result.woodenBeamState}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
