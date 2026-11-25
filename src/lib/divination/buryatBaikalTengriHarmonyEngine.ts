import type { UserProfile } from '../sharedState';

export interface BuryatBaikalResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계/신뢰' | '일/진로' | '재정/균형' | '내면/회복' | '전환/결정';
  baikalSpirit: string;
  companionSpirit: string;
  steppePhase: string;
  baikalCrossAxis: string;
  tengriInsight: string;
  olkhonTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STEPPE_PHASES = [
  '푸른 시선(눈앞의 작은 구름 너머에 있는 큰 하늘과 본심을 바라보는 시기)',
  '기둥 정박(바쁜 일정 속에서 마음을 매어 두고 숨을 고를 기준을 세우는 시기)',
  '샘물 회복(고갈된 힘을 억지로 짜내기보다 쉼과 약수로 기운을 채우는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '하늘처럼 넓은 시선으로 관망만 하다가 지금 당장 손봐야 할 눈앞의 작은 불씨를 놓치지 않도록 살피세요.',
  '세르게 기둥에 기준을 매어 두려다 변화하는 상황에 맞춘 유연한 방향 수정까지 막아 버리지 않도록 점검하세요.',
  '아르샨의 쉼과 회복을 챙기느라 약속된 최소한의 마감과 책임 리듬까지 흐트러지지 않도록 유의하세요.',
] as const;

const SPIRITS = [
  {
    spirit: '코헤 뭉케 텐그리(Köke Möngke Tengri · 끝없이 푸른 하늘의 시선)',
    insight: '작은 감정의 먹구름이 지나가도 그 너머의 넓고 푸른 하늘은 변함없이 제자리에 있다는 신뢰',
    tone: '바이칼 호수 올혼섬 위로 끝없이 펼쳐진 맑은 청색 하늘',
    ritual: '오늘 창밖 하늘을 1분만 바라보며 눈앞의 작은 구름 너머에 있는 큰 흐름을 떠올려 보세요.',
    question: '지금 내 마음의 물결을 흐리게 만드는 작은 먹구름을 지나, 그 너머 푸른 하늘처럼 변치 않고 남아 있는 본심은 무엇인가요?',
  },
  {
    spirit: '에진(Ezen · 장소와 물의 주인을 향한 공경)',
    insight: '내가 머무는 자리와 만나는 사람들을 함부로 대하지 않고 조심스레 존중할 때 찾아오는 평화',
    tone: '바닥이 투명하게 비치는 바이칼 호수의 고요한 맑은 물결',
    ritual: '오늘 내가 머무는 책상이나 방 한 구석을 정성스레 닦고 정돈하며 공간에 감사를 건네 보세요.',
    question: '익숙하다는 이유로 무심히 지나쳤지만, 에진(Ezen)의 공경으로 다시 대하면 평화가 깃들 자리나 인연은 어디인가요?',
  },
  {
    spirit: '세르게(Serge · 길손의 말을 매어 두는 성스러운 기둥)',
    insight: '바쁜 일상 속에서도 마음을 매어 두고 잠시 숨을 돌릴 수 있는 나만의 든든한 기준점',
    tone: '언덕 위 바람에 오색 천 리본이 나부끼는 나무 세르게 기둥',
    ritual: '바쁜 일정 속에서 마음이 흩어질 때마다 돌아올 나만의 한 줄 기준을 메모장 맨 위에 적어 두세요.',
    question: '하루가 바쁘게 흘러갈 때 내 마음을 안전하게 매어 두고 숨을 돌릴 나만의 세르게 기둥은 무엇인가요?',
  },
  {
    spirit: '요호르(Yokhor · 손을 맞잡고 도는 공동체의 원)',
    insight: '혼자 버거워하던 일도 같은 뜻을 나눈 이들과 발을 맞추면 훨씬 가볍게 넘어갈 수 있음',
    tone: '초원 모닥불 주위에서 흥겹게 발을 구르며 도는 원무의 활기',
    ritual: '혼자 끙끙 앓던 일 한 가지를 골라, 신뢰하는 동료나 가까운 사람에게 가볍게 상황을 공유해 보세요.',
    question: '혼자 힘으로만 버티려다 무거워졌지만, 요호르의 원처럼 누군가와 호흡을 맞추면 가벼워질 일은 무엇인가요?',
  },
  {
    spirit: '아르샨(Arshan · 땅속에서 솟아나는 치유의 샘물)',
    insight: '고갈된 에너지를 억지로 짜내기보다 조용히 나를 채워 주는 쉼과 회복의 샘을 먼저 찾는 지혜',
    tone: '이끼 낀 시베리아 침엽수림 사이로 솟아나는 차갑고 맑은 약수',
    ritual: '억지로 에너지를 더 쓰기 전에 물 한 잔을 천천히 마시고 5분간 온전한 휴식을 먼저 허락해 보세요.',
    question: '마른 샘에서 자꾸 물을 퍼 올리듯 나를 소진시키는 대신, 지금 가장 먼저 채워 주어야 할 회복의 샘은 무엇인가요?',
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

function classifyBaikalTopic(question?: string): BuryatBaikalResult['questionTopic'] {
  const q = (question ?? '').toLowerCase();
  if (/(사랑|연애|관계|결혼|사람|가족|친구|갈등|화해|신뢰|요호르)/.test(q)) return '관계/신뢰';
  if (/(일|직장|진로|이직|사업|공부|시험|성과|일정)/.test(q)) return '일/진로';
  if (/(돈|재정|투자|소비|수입|지출|저축|자산|균형)/.test(q)) return '재정/균형';
  if (/(마음|불안|지침|회복|휴식|수면|건강|감정|물결|조율|샘물)/.test(q)) return '내면/회복';
  return '전환/결정';
}

export function calculateBuryatBaikalTengriHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BuryatBaikalResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SPIRITS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SPIRITS.length - 1));
  const picked = SPIRITS[idx];
  const companion = SPIRITS[(idx + companionOffset) % SPIRITS.length];
  const steppePhase = STEPPE_PHASES[stableHash(`${seed}|phase`) % STEPPE_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyBaikalTopic(params.question);
  const shortPhase = steppePhase.split('(')[0].trim();
  const shortSpirit = picked.spirit.split('(')[0].trim();
  const shortCompanion = companion.spirit.split('(')[0].trim();
  const baikalCrossAxis = `${shortPhase} × ${shortSpirit} · ${shortCompanion} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-BURYAT-BAIKAL-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    baikalSpirit: picked.spirit,
    companionSpirit: companion.spirit,
    steppePhase,
    baikalCrossAxis,
    tengriInsight: `${picked.insight} (동반 결: ${companion.spirit})`,
    olkhonTone: picked.tone,
    shadowWarning,
    reflectionFocus: `시베리아 부랴트 바이칼 전통의 '${steppePhase}' 흐름 속에서 '${picked.spirit}'와 동반 결 '${companion.spirit}'을 함께 짚어, 자연과 내 안의 리듬을 맑게 조율해 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.spirit})`,
    reflectiveQuestion: `${picked.question} '${steppePhase}' 국면에서 가장 먼저 돌볼 리듬은 무엇인가요?`,
    interpretiveBoundary: '시베리아 부랴트(Buryat) 바이칼·텐그리 자연 조화 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBuryatBaikalPrompt(res: BuryatBaikalResult): string {
  return [
    `[부랴트 바이칼·텐그리 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 바이칼 상징: ${res.baikalSpirit} (${res.olkhonTone})`,
    `- 동반 결: ${res.companionSpirit}`,
    `- 초원 국면: ${res.steppePhase}`,
    `- 질문 맥락(${res.questionTopic}) 교차 축: ${res.baikalCrossAxis}`,
    `- 중심 통찰: ${res.tengriInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
