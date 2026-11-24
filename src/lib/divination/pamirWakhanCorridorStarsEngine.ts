import type { UserProfile } from '../sharedState';

export interface PamirWakhanResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '시선·천창' | '지지·기둥' | '호흡·고산' | '경계·안부' | '기준·별빛' | '와칸 전반';
  pamirMotif: string;
  companionMotif: string;
  wakhanSkyAxis: string;
  pamirInsight: string;
  wakhanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '차르호나 천창의 사각 빛(Chorkhona Skylight · 돌집 지붕 한가운데 네모난 구멍이 네 번 겹쳐 하늘을 엶)',
    insight: '작은 창 하나라도 방향을 달리해 층층이 열어 두면 어두운 방 안으로 하루 종일 빛이 들어옴',
    tone: '파미르 고원 와칸 회랑의 맑은 아침, 전통 돌집 천창을 통해 푸른 하늘빛이 내려앉는 거실',
    action: '오늘 답답하게 막힌 일에 대해 기존과 다른 시선이나 작은 창구 하나를 열어 5분만 빛을 들여 보세요.',
    question: '지금 내 일과 마음의 지붕에서 방향을 조금 달리해 열어 두면 종일 빛이 들어올 작은 천창은 어디인가요?',
  },
  {
    motif: '다섯 기둥의 지지(Five Pillars · 집 안을 받치는 다섯 나무 기둥마다 정갈한 의미를 새김)',
    insight: '삶을 지탱하는 기둥이 여럿일수록 한 기둥이 흔들릴 때도 지붕 전체가 무너지지 않음',
    tone: '따스한 난로 옆에서 정교하게 조각된 나무 기둥들이 고요히 집을 받치고 있는 오전',
    action: '내 일상을 받치고 있는 건강·관계·쉼·일 중 오늘 소홀했던 한 기둥에 작은 돌봄을 보태 주세요.',
    question: '지금 한 기둥이 흔들릴 때도 내 지붕 전체를 묵묵히 받쳐 주고 있는 다른 기둥들은 무엇인가요?',
  },
  {
    motif: '고산 야크의 느린 발걸음(High-Pass Yak · 산소가 희박한 높은 고개일수록 숨을 고르며 한 걸음씩 오름)',
    insight: '높고 힘든 목표를 오를 때는 평지처럼 달리려 하지 말고, 고산의 호흡에 맞추어 천천히 걸어야 함',
    tone: '흰 눈이 덮인 힌두쿠시 봉우리 아래 맑은 산바람을 맞으며 고갯길을 오르는 낮',
    action: '오늘 서두르고 있던 큰 목표의 속도를 한 단계 낮추고, 고른 호흡으로 오늘 몫의 한 걸음만 걸어 보세요.',
    question: '높은 고갯길에 올라와 있으면서도 내가 여전히 평지의 속도로 달리느라 숨이 찬 건 아닌가요?',
  },
  {
    motif: '판지 강 너머의 바람(Panj River Crossing · 좁고 빠른 강물 건너편과 늘 인사를 나눔)',
    insight: '내가 건널 수 없는 경계 너머라도 미움 대신 안부를 건네면 골짜기의 공기가 부드러워짐',
    tone: '옥빛 빙하물이 흐르는 협곡 사이로 맑은 햇빛이 부서지는 오후',
    action: '오늘 입장 차이나 거리감이 느껴지는 사람에게 가벼운 안부나 예의 바른 인사 한 마디를 먼저 건네 보세요.',
    question: '당장 건널 수 없는 경계 너머라도 미움 대신 안부를 건넬 때 부드러워질 관계의 공기는 어디인가요?',
  },
  {
    motif: '고원 별하늘의 나침반(Pamir Night Sky · 구름 한 점 없는 높은 밤하늘에 별자리가 손에 닿을 듯 뜸)',
    insight: '복잡한 지형에 가로막혀 앞이 안 보일 때는 고개를 들어 변하지 않는 밤하늘의 기준점을 보아야 함',
    tone: '서늘하고 투명한 고원의 밤, 은하수가 지붕 천창 위로 맑게 흐르는 자정',
    action: '눈앞의 자잘한 변수에 흔들릴 때, 내가 처음 이 일을 시작한 변하지 않는 기준점 한 줄을 노트에 적어 보세요.',
    question: '복잡한 지형에 가로막혀 앞이 잘 보이지 않을 때 고개를 들어 다시 바라볼 변하지 않는 별자리는 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const PAMIR_SHADOWS = [
  '차르호나 천창처럼 작은 시선의 틈을 여는 유연함이 한 가지 방향을 끝까지 파고들어야 할 집중력까지 분산시키는 산만함이 되지 않게 하세요.',
  '다섯 기둥에 무게를 나누는 분산이 당장 제일 약해진 한 기둥을 먼저 보수해야 할 시급함까지 가리지 않도록 우선순위를 살피세요.',
  '고산 야크처럼 숨을 고르며 천천히 걷는 호흡이 평지 구간에서도 불필요하게 속도를 늦추는 관성으로 굳지 않게 구분하세요.',
  '강 건너편과 안부를 나누는 부드러움이 내 경계선 안쪽으로 들어오는 무리한 요구까지 거절하지 못하는 무름이 되어서는 안 됩니다.',
  '변하지 않는 밤하늘 별자리를 보는 고집이 당장 발밑의 바위와 길 상태에 맞춰 발을 딛어야 하는 현실 감각을 가리지 않게 하세요.',
];

function classifyPamirTopic(q: string): PamirWakhanResult['questionTopic'] {
  if (/천창|창|시선|빛/.test(q)) return '시선·천창';
  if (/기둥|지지|건강|일상/.test(q)) return '지지·기둥';
  if (/호흡|고개|고산|속도/.test(q)) return '호흡·고산';
  if (/경계|강|안부|인사/.test(q)) return '경계·안부';
  if (/별|기준|밤하늘|방향/.test(q)) return '기준·별빛';
  return '와칸 전반';
}

export function calculatePamirWakhanCorridorStars(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PamirWakhanResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyPamirTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const wakhanSkyAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-PAMIR-WAKHAN-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    pamirMotif: picked.motif,
    companionMotif: companion.motif,
    wakhanSkyAxis,
    pamirInsight: picked.insight,
    wakhanTone: picked.tone,
    reflectionFocus: `파미르 와칸의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 높은 고개일수록 숨을 고르며 한 걸음씩 오르고 하늘을 향한 작은 창을 열어 두세요.`,
    ritualAction: picked.action,
    shadowWarning: PAMIR_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '중앙아시아 파미르 고원 와칸 회랑의 차르호나 천창과 고산 호흡 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPamirWakhanPrompt(res: PamirWakhanResult): string {
  return [
    `[파미르·와칸 회랑 별빛 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 회랑 별빛 축: ${res.wakhanSkyAxis}`,
    `- 파미르 모티프: ${res.pamirMotif} (${res.wakhanTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.pamirInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
