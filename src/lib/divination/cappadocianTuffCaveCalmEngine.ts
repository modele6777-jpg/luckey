import type { UserProfile } from '../sharedState';

export interface CappadocianCaveResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계/신뢰' | '일/진로' | '재정/균형' | '내면/회복' | '전환/결정';
  cappadocianMotif: string;
  companionMotif: string;
  cavePhase: string;
  caveCrossAxis: string;
  cappadocianInsight: string;
  tuffTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CAVE_PHASES = [
  '응회암 굴착(단단한 겉면 아래 부드럽게 풀리는 첫 단추 한 조각부터 파고드는 시기)',
  '수직 환기(깊은 몰입 속에서도 바깥 공기와 이어진 쉼의 숨통을 열어 두는 시기)',
  '계곡 조망(바위 틈 시선에서 잠깐 벗어나 이번 주 전체의 지형을 내려다보는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '일을 잘게 쪼개고 다듬는 데만 머무르다 전체 방향이 어긋나고 있는지 점검을 놓치지 않도록 살피세요.',
  '숨통을 틔우고 쉼을 챙기느라 지금 끝내야 할 핵심 과제에서 지나치게 멀어지지 않도록 점검하세요.',
  '열기구처럼 높이 올라가 큰 그림만 보다가 발밑에서 바로 손대야 할 작은 틈새를 놓치지 않도록 유의하세요.',
] as const;

const MOTIFS = [
  {
    motif: '부드러운 응회암의 굴착(Soft Tuff Carving · 바깥 풍화에는 단단히 굳지만 안쪽을 파고들면 부드럽게 열림)',
    insight: '겉으로 단단하고 막막해 보이는 과제도 한 겹만 파고들면 의외로 부드럽게 다듬어지는 여지가 있음',
    tone: '아나톨리아 카파도키아의 아침, 살구빛 화산 응회암 바위 봉우리 사이로 서늘한 공기가 흐르는 계곡',
    ritual: '오늘 막막해 보였던 일 하나를 가장 작은 첫 단추 한 단계로만 쪼개어 손대어 보세요.',
    question: '겉보기에 단단하고 막막해 보이지만, 한 겹만 파고들면 의외로 부드럽게 풀릴 여지가 있는 일은 무엇인가요?',
  },
  {
    motif: '지하 도시의 환기구(Underground Air Shaft · 깊은 바위 아래서도 위쪽 하늘과 공기가 막힘없이 통함)',
    insight: '아무리 바쁜 일이나 깊은 고민 속에 들어가 있어도 바깥 숨통과 연결되는 구멍 하나는 꼭 열어 두어야 함',
    tone: '서늘한 지하 방 한가운데 수직 통로를 통해 맑은 햇살과 바람이 내려오는 오전',
    ritual: '오늘 일정이 빽빽할수록 창문을 열어 환기하거나 5분간 바깥 공기를 마시는 숨통을 꼭 챙겨 보세요.',
    question: '바쁜 일이나 고민 속에서도 바깥 공기와 연결되는 수직 환기구처럼 반드시 열어 둘 숨통은 무엇인가요?',
  },
  {
    motif: '비둘기 계곡의 둥지(Pigeon Valley · 바위 높은 곳에 작은 쉼터를 내어 비둘기와 함께 공존함)',
    insight: '내 공간을 독점하기보다 작은 숨결들이 쉬어 갈 수 있는 넉넉한 자리를 두면 삶이 더 풍요로워짐',
    tone: '수백 개의 작은 바위 틈새로 비둘기들이 햇볕을 쬐며 날아오르는 정오',
    ritual: '오늘 곁의 사람 한 명에게 작은 배려나 따뜻한 한마디가 쉬어 갈 틈을 내어 보세요.',
    question: '내 일과 공간에서 혼자 다 채우기보다 넉넉한 쉼의 틈을 내어 두면 더 풍요로워질 자리는 어디인가요?',
  },
  {
    motif: '요정 굴뚝의 균형 모자(Fairy Chimney Cap · 아래 기둥이 깎여도 꼭대기의 단단한 현무암 모자가 지켜 줌)',
    insight: '주변 환경이 조금씩 변하고 깎여 나가더라도 가장 중요한 핵심 원칙 하나가 위에서 중심을 잡아 줌',
    tone: '황금빛 오후 햇살 아래 둥근 돌 모자를 쓴 응회암 기둥들이 고요히 서 있는 계곡',
    ritual: '주변 상황이 흔들릴 때에도 오늘 내가 끝까지 지킬 핵심 기준 한 가지를 선명하게 적어 보세요.',
    question: '주변 환경이 조금씩 깎이고 변하더라도 내 중심을 위에서 지켜 주는 단단한 현무암 모자는 무엇인가요?',
  },
  {
    motif: '여명의 열기구 풍경(Dawn Horizon · 어둠이 걷히는 순간 하늘로 올라가 계곡 전체를 내려다봄)',
    insight: '바위 틈에 갇혀 답답할 때는 잠깐 시선을 높이 올려 내가 걸어온 계곡 전체의 모양을 바라보아야 함',
    tone: '분홍빛 여명이 번지는 하늘 아래 색색의 풍선들이 소리 없이 떠오르는 새벽',
    ritual: '눈앞의 세부 문제에 갇혔을 때 3분만 시선을 떼고 이번 주 전체의 큰 그림을 다시 그려 보세요.',
    question: '지금 내가 너무 바위 틈 안에서만 보느라 놓치고 있는, 계곡 전체의 넓은 모양은 무엇인가요?',
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

function classifyCaveTopic(question?: string): CappadocianCaveResult['questionTopic'] {
  const q = (question ?? '').toLowerCase();
  if (/(사랑|연애|관계|결혼|사람|가족|친구|갈등|화해|신뢰|배려)/.test(q)) return '관계/신뢰';
  if (/(일|직장|진로|이직|사업|공부|시험|성과|일정|과제)/.test(q)) return '일/진로';
  if (/(돈|재정|투자|소비|수입|지출|저축|자산|균형)/.test(q)) return '재정/균형';
  if (/(마음|불안|지침|회복|휴식|수면|건강|감정|숨통|환기)/.test(q)) return '내면/회복';
  return '전환/결정';
}

export function calculateCappadocianTuffCaveCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CappadocianCaveResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const cavePhase = CAVE_PHASES[stableHash(`${seed}|phase`) % CAVE_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyCaveTopic(params.question);
  const shortPhase = cavePhase.split('(')[0].trim();
  const shortMotif = picked.motif.split('(')[0].trim();
  const shortCompanion = companion.motif.split('(')[0].trim();
  const caveCrossAxis = `${shortPhase} × ${shortMotif} · ${shortCompanion} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-CAPPADOCIAN-CAVE-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    cappadocianMotif: picked.motif,
    companionMotif: companion.motif,
    cavePhase,
    caveCrossAxis,
    cappadocianInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    tuffTone: picked.tone,
    shadowWarning,
    reflectionFocus: `카파도키아 응회암의 '${cavePhase}' 흐름에서 '${picked.motif}'와 동반 결 '${companion.motif}'을 함께 짚어, 단단한 문제도 한 겹 파고들며 숨통과 시야를 열어 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.motif})`,
    reflectiveQuestion: `${picked.question} '${cavePhase}' 국면에서 가장 먼저 열어야 할 숨통은 어디인가요?`,
    interpretiveBoundary: '아나톨리아 카파도키아의 응회암 굴착 쉼터와 지하 환기 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCappadocianCavePrompt(res: CappadocianCaveResult): string {
  return [
    `[카파도키아·응회암 동굴 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 카파도키아 모티프: ${res.cappadocianMotif} (${res.tuffTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 응회암 국면: ${res.cavePhase}`,
    `- 질문 맥락(${res.questionTopic}) 교차 축: ${res.caveCrossAxis}`,
    `- 중심 통찰: ${res.cappadocianInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
