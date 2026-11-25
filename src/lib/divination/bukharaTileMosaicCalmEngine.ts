import type { UserProfile } from '../sharedState';

export interface BukharaTileResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계/신뢰' | '일/진로' | '재정/균형' | '내면/회복' | '전환/결정';
  bukharaMotif: string;
  companionMotif: string;
  craftPhase: string;
  bukharaCrossAxis: string;
  bukharaInsight: string;
  oasisTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CRAFT_PHASES = [
  '벽돌 축적(거창한 계획보다 오늘 제자리에 놓일 작은 리듬을 쌓는 시기)',
  '수면 성찰(잠시 속도를 늦추고 오아시스 연못에 마음의 결을 비춰 보는 시기)',
  '격자 개방(단단한 경계 안에서 숨통과 새로운 시선이 드나들 창을 여는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '작은 타일 한 조각을 완벽히 맞추느라 전체 판의 흐름과 마감 시점을 놓치지 않도록 살피세요.',
  '연못 앞에 멈춰 마음을 비추어 보는 시간이 현실의 실행을 미루는 핑계가 되지 않도록 점검하세요.',
  '나를 지키는 벽돌 담을 너무 높게 쌓아 필요한 도움과 대화가 드나들 틈까지 막지 않도록 유의하세요.',
] as const;

const MOTIFS = [
  {
    motif: '칼랸 미나레트의 벽돌 띠(Kalyan Minaret Bands · 14겹의 서로 다른 벽돌 문양이 탑을 세움)',
    insight: '하루하루의 서로 다른 작은 리듬이 겹겹이 쌓여야 흔들리지 않는 높은 시야를 얻음',
    tone: '우즈베키스탄 부하라의 맑은 아침, 연황색 벽돌 탑 위로 비둘기 떼가 선회하는 광장',
    ritual: '오늘 하루의 서로 다른 작은 리듬 중 한 가지를 벽돌 띠 쌓듯 제시간에 차분히 실행해 보세요.',
    question: '지금 내가 놓치고 있는 것은 거대한 전략이 아니라, 매일 제자리에 놓이는 작은 벽돌 띠 하나는 아닐까요?',
  },
  {
    motif: '라비 하우즈의 연못 거울(Lyabi-Hauz Pool · 사막 오아시스 중심의 고요한 물이 하늘을 비춤)',
    insight: '먼 길을 달려와 갈증이 날수록 한 걸음 멈춰 고요한 물에 내 얼굴과 하늘을 비추어 보아야 함',
    tone: '오래된 뽕나무 그늘 아래 초록빛 연못이 바람 없이 잔잔하게 하늘을 담은 오전',
    ritual: '바쁘게 달리던 흐름을 5분만 멈추고 물 한 잔 마시며 지금 내 마음의 수면을 비추어 보세요.',
    question: '먼 길을 달려오느라 목마른 지금, 라비 하우즈 연못처럼 잠시 멈춰 비추어 보아야 할 내 마음의 상태는 무엇인가요?',
  },
  {
    motif: '청록 유약 타일의 기하학(Turquoise Mosaic · 작은 사각 조각이 반복되며 무한한 별을 이룸)',
    insight: '거창한 한 방이 아니라 손바닥만 한 작은 조각을 제자리에 정확히 붙이는 정성이 대작을 만듦',
    tone: '마드라사 아치 위로 햇빛을 받은 코발트와 청록 타일이 눈부시게 빛나는 정오',
    ritual: '오늘 해야 할 큰 일을 한꺼번에 처리하려 들지 말고, 가장 작은 타일 한 조각(5분 분량)만 깔끔히 붙여 보세요.',
    question: '거창한 한 방을 기다리기보다 지금 내 손끝에서 제자리에 맞춰야 할 작은 청록 타일 한 조각은 무엇인가요?',
  },
  {
    motif: '토키 사르라폰의 교차 돔(Trading Dome Crossroads · 사방에서 온 상인들이 둥근 천장 아래 만남)',
    insight: '막다른 길처럼 보여도 둥근 광장 아래로 걸어 들어오면 사방으로 열린 다른 길이 보임',
    tone: '시원한 벽돌 돔 그늘 아래 실크와 향신료 향기가 은은히 흐르는 오후',
    ritual: '막막하게 느껴지던 일 하나를 다른 관점이나 한 사람의 시선을 빌려 새로운 통로로 바라보세요.',
    question: '막다른 골목처럼 느껴지지만, 둥근 교차 돔 아래로 한 걸음만 들어서면 보일 다른 갈래의 길은 어디인가요?',
  },
  {
    motif: '미르 아랍의 별 창(Star Lattice · 흙벽돌 창살 사이로 밤의 서늘한 공기와 별이 들어옴)',
    insight: '나를 지키는 벽을 세우되 바깥의 숨통과 별빛이 들어올 작은 격자 창은 열어 두어야 함',
    tone: '사막의 밤이 내려앉은 흙벽돌 마당, 창살 사이로 맑은 별빛이 스며드는 저녁',
    ritual: '일정과 경계를 단단히 세우되, 저녁에는 숨통과 작은 여유가 들어올 격자 창 하나를 열어 두세요.',
    question: '나를 지키는 흙벽돌을 단단히 세우면서도, 밤공기와 별빛이 드나들도록 열어 둘 작은 창은 어디인가요?',
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

function classifyBukharaTopic(question?: string): BukharaTileResult['questionTopic'] {
  const q = (question ?? '').toLowerCase();
  if (/(사랑|연애|관계|결혼|사람|가족|친구|갈등|화해|신뢰)/.test(q)) return '관계/신뢰';
  if (/(일|직장|진로|이직|사업|공부|시험|성과|타일|조각|리듬)/.test(q)) return '일/진로';
  if (/(돈|재정|투자|소비|수입|지출|저축|자산|균형)/.test(q)) return '재정/균형';
  if (/(마음|불안|지침|회복|휴식|수면|건강|감정|위로)/.test(q)) return '내면/회복';
  return '전환/결정';
}

export function calculateBukharaTileMosaicCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BukharaTileResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const craftPhase = CRAFT_PHASES[stableHash(`${seed}|phase`) % CRAFT_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyBukharaTopic(params.question);
  const shortPhase = craftPhase.split('(')[0].trim();
  const shortMotif = picked.motif.split('(')[0].trim();
  const shortCompanion = companion.motif.split('(')[0].trim();
  const bukharaCrossAxis = `${shortPhase} × ${shortMotif} · ${shortCompanion} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-BUKHARA-TILE-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    bukharaMotif: picked.motif,
    companionMotif: companion.motif,
    craftPhase,
    bukharaCrossAxis,
    bukharaInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    oasisTone: picked.tone,
    shadowWarning,
    reflectionFocus: `부하라 타일 모자이크의 '${craftPhase}' 흐름에서 '${picked.motif}'와 동반 결 '${companion.motif}'을 함께 맞춰, 작은 조각 하나를 제자리에 두는 정성으로 오늘의 균형을 세워 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.motif})`,
    reflectiveQuestion: `${picked.question} '${craftPhase}' 국면에서 가장 먼저 제자리에 둘 한 조각은 무엇인가요?`,
    interpretiveBoundary: '우즈베키스탄 부하라 오아시스 도시의 벽돌 건축과 타일 기하학 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBukharaTilePrompt(res: BukharaTileResult): string {
  return [
    `[부하라·청록 타일 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 부하라 모티프: ${res.bukharaMotif} (${res.oasisTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 공예 국면: ${res.craftPhase}`,
    `- 질문 맥락(${res.questionTopic}) 교차 축: ${res.bukharaCrossAxis}`,
    `- 중심 통찰: ${res.bukharaInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
