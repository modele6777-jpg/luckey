import type { UserProfile } from '../sharedState';

export interface OssetianNartResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '단련·수고' | '회복·휴식' | '진실·담백' | '관찰·타이밍' | '연대·보폭' | '나르트 전반';
  nartEmblem: string;
  companionEmblem: string;
  nartForgeAxis: string;
  nartInsight: string;
  caucasusTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const EMBLEMS = [
  {
    emblem: '쿠르달래곤(Kurdalægon · 불 속에서 벼려지는 대장간)',
    insight: '어려운 과제나 낯선 압박도 나를 무너뜨리는 적이 아니라 내 역량을 단단히 벼리는 망치질',
    tone: '코카서스 설산 기슭 대장간에서 튀어 오르는 붉은 불티',
    action: '오늘 마주한 부담스러운 일 하나를 "피해야 할 짐" 대신 "내 실력을 한 뼘 키우는 연습"으로 이름 붙여 보세요.',
    question: '지금 나를 뜨겁게 두드리는 이 수고가 훗날 어떤 단단한 연장으로 남기를 바라나요?',
  },
  {
    emblem: '나르트의 황금 사과(Nart Apple · 아픔을 회복시키는 귀한 열매)',
    insight: '바쁘게 지친 뒤에는 무리해서 달리기보다 가장 좋은 쉼과 돌봄으로 나를 회복시키는 지혜',
    tone: '고산 지대 과수원에 아침 이슬을 머금은 황금빛 사과',
    action: '밀린 일을 한 줄 더 하기 전에 물 한 잔과 10분의 온전한 휴식으로 지친 기운부터 먼저 회복해 보세요.',
    question: '지금 내게 부족한 것은 더 많은 채찍질인가요, 아니면 지친 마음을 낫게 할 황금 사과 한 입인가요?',
  },
  {
    emblem: '우아사몽가(Uatsamonga · 진실만을 담아내는 잔)',
    insight: '남에게 그럴듯하게 보이기 위한 과장보다 솔직하고 담백한 진심이 결국 오래 남는 힘',
    tone: '화덕 옆 나무 탁자 위에 놓인 맑은 샘물 한 잔',
    action: '오늘 건네는 말이나 기록에서 그럴듯한 포장을 한 겹 걷어 내고 가장 담백한 진심만 남겨 보세요.',
    question: '과장을 걷어내고 가장 솔직한 마음으로 본다면, 지금 내가 진짜로 단련하고 싶은 힘은 무엇인가요?',
  },
  {
    emblem: '사타나(Satana · 위기를 풀어내는 침착한 지혜)',
    insight: '힘으로만 밀어붙여 해결되지 않던 갈등도 차분한 관찰과 타이밍으로 부드럽게 풀어냄',
    tone: '안개 낀 코카서스 고개를 넘어가는 침착한 길잡이',
    action: '곧바로 힘으로 밀어붙이기 전에 상황을 5분만 한 걸음 물러서서 지켜보며 알맞은 때를 기다려 보세요.',
    question: '내가 정면으로 힘만 주다가 오히려 엉키게 만든 매듭은 어떤 차분한 타이밍을 기다리고 있나요?',
  },
  {
    emblem: '심드(Simd · 어깨를 나란히 하고 서는 힘찬 춤)',
    insight: '혼자 고립되어 끙끙대기보다 믿을 수 있는 동료와 보조를 맞출 때 되살아나는 활력',
    tone: '별빛 아래 산악 마을 광장에 울려 퍼지는 경쾌한 발걸음',
    action: '혼자 짊어지던 고민 하나를 믿을 수 있는 사람에게 가볍게 공유하고 함께 보폭을 맞춰 보세요.',
    question: '혼자 버티려 애쓰느라 정작 어깨를 나란히 할 동료의 손을 잡지 못하고 있던 일은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const NART_SHADOWS = [
  '대장간의 쇠를 두드리는 단련이 스스로를 한계까지 몰아붙여 과열로 깨뜨리는 자기 학대가 되지 않게 식힐 시간도 함께 두세요.',
  '황금 사과처럼 돌봄과 휴식을 우선하는 지혜가 정작 지금 마무리해야 할 작은 책임까지 뒤로 미루는 안주로 흐르지 않게 하세요.',
  '포장을 걷어낸 담백한 진심이 상대의 처지나 감정을 헤아리지 않는 직설과 무례함으로 들리지 않도록 온도를 살피세요.',
  '한 걸음 물러서서 때를 기다리는 침착함이 결단해야 할 순간에도 행동하지 않는 관망으로 길어지지 않게 기한을 정해 두세요.',
  '어깨를 나란히 하고 함께 추는 춤이 내 고유의 기준을 지우고 분위기나 주변 속도에 무조건 맞추는 휩쓸림이 되어서는 안 됩니다.',
];

function classifyNartTopic(q: string): OssetianNartResult['questionTopic'] {
  if (/수고|단련|부담|과제/.test(q)) return '단련·수고';
  if (/회복|쉼|휴식|지친/.test(q)) return '회복·휴식';
  if (/진실|솔직|담백|포장/.test(q)) return '진실·담백';
  if (/타이밍|기다|갈등|위기/.test(q)) return '관찰·타이밍';
  if (/함께|동료|혼자|보폭/.test(q)) return '연대·보폭';
  return '나르트 전반';
}

export function calculateOssetianNartSagasForge(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OssetianNartResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyNartTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % EMBLEMS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (EMBLEMS.length - 1));
  const picked = EMBLEMS[idx];
  const companion = EMBLEMS[(idx + companionOffset) % EMBLEMS.length];
  const nartForgeAxis = `${picked.emblem.split('(')[0].trim()} ↔ ${companion.emblem.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-OSSETIAN-NART-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    nartEmblem: picked.emblem,
    companionEmblem: companion.emblem,
    nartForgeAxis,
    nartInsight: picked.insight,
    caucasusTone: picked.tone,
    reflectionFocus: `코카서스 오세트 나르트 서사시의 '${picked.emblem}'처럼, 지금 겪는 수고와 단련은 나를 더 명료하고 단단하게 벼리는 과정입니다. (동반 결: ${companion.emblem.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning: NART_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '코카서스 오세트(Ossetian) 나르트 서사시의 대장간·진실의 잔 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOssetianNartPrompt(res: OssetianNartResult): string {
  return [
    `[오세트 나르트 서사시·단련 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 나르트 단련 축: ${res.nartForgeAxis}`,
    `- 나르트 상징: ${res.nartEmblem} (${res.caucasusTone})`,
    `- 동반 상징: ${res.companionEmblem}`,
    `- 중심 통찰: ${res.nartInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
