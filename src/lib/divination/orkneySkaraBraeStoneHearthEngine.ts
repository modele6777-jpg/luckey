import type { UserProfile } from '../sharedState';

export interface OrkneySkaraInput {
  profile: UserProfile;
  now?: Date;
  question?: string;
}

export interface OrkneySkaraResult {
  engineVersion: string;
  calculatedAtKst: string;
  hearthMotif: string;
  companionMotif: string;
  stoneShelterState: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  '중앙 사각 화덕(Central Hearth): 차가운 북해의 바람을 피해 집 한가운데에 불씨를 모아 두는 따뜻한 구심점',
  '돌 선반(Stone Dresser): 벽을 향해 정갈하게 세워 둔 납작한 돌 선반처럼 소중한 것을 눈에 잘 띄게 올려 두는 질서',
  '낮은 통로(Low Stone Passage): 세찬 바닷바람을 막기 위해 고개를 숙여 들어가는 아늑한 안식처의 문턱',
  '지하 석실의 온기(Earth-Insulated Wall): 모래와 흙더미로 벽을 감싸 바깥의 계절 변화에도 안쪽 온도를 지키는 보온',
] as const;

const SHELTER_STATES = [
  '가운데 화덕에 모인 온기',
  '바람을 비껴가는 낮은 문턱',
  '정갈히 정돈된 돌 선반',
  '바깥 소란을 막아 주는 두꺼운 벽',
] as const;

const RITUALS = [
  '오늘 가장 자주 머무는 책상이나 방 한가운데를 5분만 치워 시선이 편안히 쉴 수 있는 화덕 같은 자리를 만드세요.',
  '당장 소중한 물건이나 메모 서너 개만 골라 눈에 가장 잘 띄는 선반 위에 나란히 올려 두세요.',
  '바깥의 급한 소식들로부터 30분만 문을 낮추고 온전히 내 온도를 지키는 휴식을 취하세요.',
  '오늘 저녁엔 따뜻한 차나 국물 한 그릇으로 몸 안쪽의 불씨를 먼저 데워 주세요.',
] as const;

const QUESTIONS = [
  '차가운 바깥바람 속에서도 내가 반드시 꺼뜨리지 않고 지켜야 할 가운데 화덕은 무엇인가요?',
  '내 방과 마음의 선반 위에 지금 가장 정갈하게 올려 두고 싶은 것은 무엇일까요?',
  '굳이 높은 문을 열어 두느라 바깥바람까지 안으로 들이고 있지는 않나요?',
  '오천 년 전 돌집처럼 오래 버틸 수 있는 나만의 생활 기본기는 무엇인가요?',
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

export function calculateOrkneySkaraHearth(input: OrkneySkaraInput): OrkneySkaraResult {
  const now = input.now ?? new Date();
  const fate = input.profile?.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.question ?? ''}|${now.toISOString().slice(0, 10)}|orkney-skara`;
  const h = stableHash(seedText);

  const motifIdx = h % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seedText}|companion`) % (MOTIFS.length - 1));
  const hearthMotif = MOTIFS[motifIdx];
  const companionMotif = MOTIFS[(motifIdx + companionOffset) % MOTIFS.length];
  const stoneShelterState = SHELTER_STATES[(h >>> 3) % SHELTER_STATES.length];
  const ritualAction = RITUALS[motifIdx];
  const reflectiveQuestion = QUESTIONS[motifIdx];

  return {
    engineVersion: 'LUCKEY-ORKNEY-SKARA-v2.2.0',
    calculatedAtKst: toKstIso(now),
    hearthMotif,
    companionMotif,
    stoneShelterState,
    reflectionFocus: `북해의 거센 바람을 흙과 돌벽으로 막고 중앙 화덕에 온기를 지킨 오크니 스카라 브레처럼, 주 모티프와 동반 모티프('${companionMotif}')가 어우러져 지금은 '${stoneShelterState}'의 아늑한 중심 잡기가 어울립니다.`,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary: '스코틀랜드 오크니 제도 신석기 스카라 브레 석실 주거의 지혜를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOrkneySkaraPrompt(result: OrkneySkaraResult): string {
  return [
    `[오크니 스카라 브레 석실 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 상징 모티프: ${result.hearthMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 현재 결: ${result.stoneShelterState}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
