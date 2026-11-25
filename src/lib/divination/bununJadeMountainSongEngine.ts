import type { UserProfile } from '../sharedState';

export interface BununMountainResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계/신뢰' | '일/진로' | '재정/균형' | '내면/회복' | '전환/결정';
  bununMotif: string;
  companionMotif: string;
  ridgePhase: string;
  bununCrossAxis: string;
  bununInsight: string;
  mountainTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const RIDGE_PHASES = [
  '여덟 겹 공명(혼자 고음을 치고 나가기보다 낮은 호흡부터 포개어 맞추는 시기)',
  '계절 가늠(지금이 씨를 뿌릴 때인지 밭을 쉬게 둘 때인지 먼저 살피는 시기)',
  '불씨 보존(겉으로 조용해 보여도 내일의 불을 살릴 작은 에너지를 지키는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '주변과 화음을 맞추려다 내가 꼭 내야 할 솔직한 목소리까지 지워 버리지 않도록 살피세요.',
  '메아리가 어떻게 돌아올지 지나치게 재다가 정작 건네야 할 따뜻한 한 마디를 미루지 않도록 점검하세요.',
  '불씨를 아낀다는 이유로 오늘 당장 움직여야 할 작은 실행까지 멈추고 숨어 버리지 않도록 유의하세요.',
] as const;

const MOTIFS = [
  {
    motif: '파시부트부트 여덟 겹 화음(Pasibutbut · 여러 낮은 목소리가 겹쳐 계곡의 공명처럼 높아짐)',
    insight: '한 사람이 혼자 튀어 오르려 하지 않고 낮은 음부터 서로 포개어 부르면 공명이 저절로 하늘에 닿음',
    tone: '대만 옥산 산맥의 맑은 새벽, 둥글게 선 이들이 낮고 깊은 화음을 천천히 쌓아 올리는 골짜기',
    ritual: '오늘 조급히 앞서 나가려던 마음을 한 옥타브 낮추고, 주변 사람과 호흡을 맞추는 대화 한 마디를 건네 보세요.',
    question: '지금 내가 혼자 고음으로 치고 나가느라 놓치고 있는, 함께 낼 수 있는 여덟 겹 화음은 무엇인가요?',
  },
  {
    motif: '나무판 그림 달력의 계절(Islaqat Calendar · 밭을 갈고 쉬는 때를 작은 나무판 그림으로 기억함)',
    insight: '무작정 달리기만 하지 말고 지금은 심을 때인지, 김을 맬 때인지, 쉴 때인지 계절의 그림을 보아야 함',
    tone: '해가 막 산등성이를 넘을 때, 나무판에 새겨진 농사 그림을 손끝으로 짚어 보는 오전',
    ritual: '오늘 계획한 일 중 지금이 밀어붙일 때인지, 숨을 고를 때인지 계절을 먼저 가늠해 순서를 정해 보세요.',
    question: '지금 내 일과 마음의 계절은 씨를 뿌릴 때인가요, 김을 맬 때인가요, 아니면 잠시 밭을 쉬게 둘 때인가요?',
  },
  {
    motif: '메아리로 묻고 답하는 산길(Valley Echo · 골짜기 건너편을 향해 부른 소리가 돌아오는 길)',
    insight: '내가 세상에 던진 말과 태도는 반드시 골짜기의 메아리처럼 내게 다시 돌아옴',
    tone: '구름이 산허리를 감싸 안은 정오, 먼 능선에서 맑은 새소리가 메아리로 돌아오는 풍경',
    ritual: '오늘 누군가에게 건넬 말 한마디를 고를 때, 메아리처럼 내게 돌아와도 기분 좋을 맑은 어조로 건네 보세요.',
    question: '내가 세상에 던진 말과 태도가 골짜기의 메아리처럼 내게 돌아온다면, 어떤 울림을 듣고 싶나요?',
  },
  {
    motif: '조 이삭을 나누는 추수(Millet Sharing · 첫 수확은 혼자 먹지 않고 공동체와 먼저 나눔)',
    insight: '작은 성취의 첫 열매를 주변과 나눌 때 내 창고도, 마음의 곳간도 더 오래 든든해짐',
    tone: '노란 조 이삭이 바람에 고개를 숙인 밭가에서 따뜻한 웃음이 오가는 오후',
    ritual: '최근 얻은 작은 결과물이나 유익한 정보 한 가지를 고마운 사람 한 명과 먼저 나누어 보세요.',
    question: '내 곳간에만 담아 두기보다 주변과 첫 수확처럼 나눌 때 더 오래 든든해질 작은 열매는 무엇인가요?',
  },
  {
    motif: '산장 화덕의 꺼지지 않는 불씨(Hearth Ember · 밤새 재 아래 묻어 둔 불씨로 다음 날 불을 살림)',
    insight: '당장 활활 타오르지 않고 겉으로 조용히 식어 보이는 날에도 내 안의 작은 불씨만 지키면 됨',
    tone: '높은 산밤의 별빛 아래, 붉은 숯불이 재 속에서 따뜻하게 숨 쉬는 고요한 밤',
    ritual: '기력이 덜 올라오는 날이라면 큰 불을 피우려 애쓰기보다 내일 다시 쓸 작은 불씨(휴식·수면)만 지켜 두세요.',
    question: '당장 활활 타오르지 않더라도, 내일을 위해 재 아래에 조용히 묻어 지켜야 할 나만의 불씨는 무엇인가요?',
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

function classifyBununTopic(question?: string): BununMountainResult['questionTopic'] {
  const q = (question ?? '').toLowerCase();
  if (/(사랑|연애|관계|결혼|사람|가족|친구|갈등|화해|신뢰|공명|화음)/.test(q)) return '관계/신뢰';
  if (/(일|직장|진로|이직|사업|공부|시험|성과|수확)/.test(q)) return '일/진로';
  if (/(돈|재정|투자|소비|수입|지출|저축|자산|균형)/.test(q)) return '재정/균형';
  if (/(마음|불안|지침|회복|휴식|수면|건강|감정|호흡|불씨)/.test(q)) return '내면/회복';
  return '전환/결정';
}

export function calculateBununJadeMountainSong(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BununMountainResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const ridgePhase = RIDGE_PHASES[stableHash(`${seed}|phase`) % RIDGE_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyBununTopic(params.question);
  const shortPhase = ridgePhase.split('(')[0].trim();
  const shortMotif = picked.motif.split('(')[0].trim();
  const shortCompanion = companion.motif.split('(')[0].trim();
  const bununCrossAxis = `${shortPhase} × ${shortMotif} · ${shortCompanion} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-BUNUN-MOUNTAIN-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    bununMotif: picked.motif,
    companionMotif: companion.motif,
    ridgePhase,
    bununCrossAxis,
    bununInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    mountainTone: picked.tone,
    shadowWarning,
    reflectionFocus: `부눈족 산맥 화음의 '${ridgePhase}' 흐름에서 '${picked.motif}'와 동반 결 '${companion.motif}'을 함께 짚어, 낮은 호흡부터 포개어 공명을 만들어 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.motif})`,
    reflectiveQuestion: `${picked.question} '${ridgePhase}' 국면에서 가장 먼저 맞출 호흡은 무엇인가요?`,
    interpretiveBoundary: '대만 중앙산맥 부눈족의 파시부트부트 다성 합창과 그림 달력 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBununMountainPrompt(res: BununMountainResult): string {
  return [
    `[부눈·옥산 산맥 화음 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 부눈 모티프: ${res.bununMotif} (${res.mountainTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 산맥 국면: ${res.ridgePhase}`,
    `- 질문 맥락(${res.questionTopic}) 교차 축: ${res.bununCrossAxis}`,
    `- 중심 통찰: ${res.bununInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
