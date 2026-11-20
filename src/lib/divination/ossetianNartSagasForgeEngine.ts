import type { UserProfile } from '../sharedState';

export interface OssetianNartResult {
  engineVersion: string;
  calculatedAtKst: string;
  nartEmblem: string;
  nartInsight: string;
  caucasusTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const EMBLEMS = [
  { emblem: '쿠르달래곤(Kurdalægon · 불 속에서 벼려지는 대장간)', insight: '어려운 과제나 낯선 압박도 나를 무너뜨리는 적이 아니라 내 역량을 단단히 벼리는 망치질', tone: '코카서스 설산 기슭 대장간에서 튀어 오르는 붉은 불티' },
  { emblem: '나르트의 황금 사과(Nart Apple · 아픔을 회복시키는 귀한 열매)', insight: '바쁘게 지친 뒤에는 무리해서 달리기보다 가장 좋은 쉼과 돌봄으로 나를 회복시키는 지혜', tone: '고산 지대 과수원에 아침 이슬을 머금은 황금빛 사과' },
  { emblem: '우아사몽가(Uatsamonga · 진실만을 담아내는 잔)', insight: '남에게 그럴듯하게 보이기 위한 과장보다 솔직하고 담백한 진심이 결국 오래 남는 힘', tone: '화덕 옆 나무 탁자 위에 놓인 맑은 샘물 한 잔' },
  { emblem: '사타나(Satana · 위기를 풀어내는 침착한 지혜)', insight: '힘으로만 밀어붙여 해결되지 않던 갈등도 차분한 관찰과 타이밍으로 부드럽게 풀어냄', tone: '안개 낀 코카서스 고개를 넘어가는 침착한 길잡이' },
  { emblem: '심드(Simd · 어깨를 나란히 하고 서는 힘찬 춤)', insight: '혼자 고립되어 끙끙대기보다 믿을 수 있는 동료와 보조를 맞출 때 되살아나는 활력', tone: '별빛 아래 산악 마을 광장에 울려 퍼지는 경쾌한 발걸음' },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateOssetianNartSagasForge(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OssetianNartResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % EMBLEMS.length;
  const picked = EMBLEMS[idx];

  return {
    engineVersion: 'LUCKEY-OSSETIAN-NART-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    nartEmblem: picked.emblem,
    nartInsight: picked.insight,
    caucasusTone: picked.tone,
    reflectionFocus: `코카서스 오세트 나르트 서사시의 '${picked.emblem}'처럼, 지금 겪는 수고와 단련은 나를 더 명료하고 단단하게 벼리는 과정입니다.`,
    ritualAction: '오늘 마주한 부담스러운 일 하나를 "피해야 할 짐" 대신 "내 실력을 한 뼘 키우는 연습"으로 이름 붙여 보세요.',
    reflectiveQuestion: '과장을 걷어내고 가장 솔직한 마음으로 본다면, 지금 내가 진짜로 단련하고 싶은 힘은 무엇인가요?',
    interpretiveBoundary: '코카서스 오세트(Ossetian) 나르트 서사시의 대장간·진실의 잔 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOssetianNartPrompt(res: OssetianNartResult): string {
  return [
    `[오세트 나르트 서사시·단련 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 나르트 상징: ${res.nartEmblem} (${res.caucasusTone})`,
    `- 중심 통찰: ${res.nartInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
