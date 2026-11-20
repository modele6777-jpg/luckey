import type { UserProfile } from '../sharedState';

export interface TarahumaraStrideInput {
  profile: UserProfile;
  now?: Date;
  question?: string;
}

export interface TarahumaraStrideResult {
  engineVersion: string;
  calculatedAtKst: string;
  strideMotif: string;
  companionMotif: string;
  breathCadence: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  '와라치 샌들(Huarache): 얇은 밑창으로 땅의 감촉을 직접 느끼며 무리 없는 착지로 멀리 가는 발걸음',
  '라라히파 나무 공(Rarajipa): 협곡의 바위길을 달리며 발끝으로 작은 공을 톡톡 굴려 보내는 유쾌한 놀이성',
  '이스키아테 치아 물(Iskiate): 먼 길을 앞두고 무거운 음식 대신 가벼운 곡물과 물로 속을 채우는 담백한 준비',
  '협곡의 호흡(Barranca Cadence): 오르막에서는 보폭을 줄이고 내리막에서는 중력을 따라 흘려보내는 페이스의 지혜',
] as const;

const CADENCES = [
  '보폭을 줄인 가벼운 오르막',
  '속도보다 리듬을 지키는 순항',
  '땅의 감촉을 느끼는 맨발 착지',
  '목적지를 서두르지 않는 장거리 호흡',
] as const;

const RITUALS = [
  '복잡한 장비나 조건을 갖추려다 지치기 전에, 지금 손에 든 가장 가벼운 도구로 첫 발을 떼어 보세요.',
  '진지한 과업 속에서도 발끝으로 공을 굴리듯 작은 재미 요소를 하나 섞어 보세요.',
  '물 한 잔을 천천히 마시며 지금 내 호흡이 너무 빨라져 있지 않은지 점검해 보세요.',
  '오늘 해야 할 긴 일을 억지로 한 번에 끝내려 하지 말고, 숨이 차지 않을 속도로 20분씩만 나눠 걸어 보세요.',
] as const;

const QUESTIONS = [
  '무거운 짐을 덜어 내고 가볍게 갈수록 오히려 더 멀리 갈 수 있는 일은 무엇인가요?',
  '긴 여정 자체를 하나의 놀이처럼 즐길 수 있는 방법은 무엇일까요?',
  '지금 나는 결승선만 보느라 오늘 지탱해야 할 리듬과 보폭을 너무 크게 잡고 있지는 않나요?',
  '오르막길에서 잠시 보폭을 좁혀도 괜찮다고 스스로에게 말해 줄 수 있나요?',
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

export function calculateTarahumaraStride(input: TarahumaraStrideInput): TarahumaraStrideResult {
  const now = input.now ?? new Date();
  const fate = input.profile?.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.question ?? ''}|${now.toISOString().slice(0, 10)}|tarahumara-stride`;
  const h = stableHash(seedText);

  const motifIdx = h % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seedText}|companion`) % (MOTIFS.length - 1));
  const strideMotif = MOTIFS[motifIdx];
  const companionMotif = MOTIFS[(motifIdx + companionOffset) % MOTIFS.length];
  const breathCadence = CADENCES[(h >>> 3) % CADENCES.length];
  const ritualAction = RITUALS[motifIdx];
  const reflectiveQuestion = QUESTIONS[motifIdx];

  return {
    engineVersion: 'LUCKEY-TARAHUMARA-STRIDE-v2.2.0',
    calculatedAtKst: toKstIso(now),
    strideMotif,
    companionMotif,
    breathCadence,
    reflectionFocus: `험준한 구리 협곡을 가벼운 샌들로 며칠씩 달리는 타라후마라(라라무리) 족처럼, 주 모티프와 동반 모티프('${companionMotif}')가 어우러져 지금은 '${breathCadence}'의 지속 가능성이 중요합니다.`,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary: '멕시코 시에라 마드레 타라후마라(라라무리) 공동체의 장거리 달리기 지혜를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTarahumaraStridePrompt(result: TarahumaraStrideResult): string {
  return [
    `[타라후마라 라라무리 발걸음 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 상징 모티프: ${result.strideMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 현재 결: ${result.breathCadence}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
