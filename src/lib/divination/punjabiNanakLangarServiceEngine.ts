import type { UserProfile } from '../sharedState';

export interface PunjabiNanakResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '성실·노동' | '나눔·랑가르' | '알아차림·중심' | '활력·기상' | '벗·동행' | '펀자브 전반';
  punjabiPillar: string;
  companionPillar: string;
  langarServiceAxis: string;
  nanakInsight: string;
  fiveRiversTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PILLARS = [
  {
    pillar: '키랏 카로(Kirat Karo · 정직한 땀과 성실한 일)',
    insight: '요행을 바라지 않고 오늘 내 손으로 정직하게 해내는 작은 일에 담긴 단단한 자부심',
    tone: '다섯 강물이 합쳐져 흐르는 비옥한 펀자브 평원의 아침 햇살',
    action: '오늘 맡은 일 중 하나를 요령 피우지 않고 정직하고 단정하게 끝까지 매듭지어 보세요.',
    question: '요행을 바라지 않고 내 손의 정직한 성실함으로 채울 때 가장 떳떳해질 오늘의 일은 무엇인가요?',
  },
  {
    pillar: '반드 차코(Vand Chhako · 가진 것을 함께 나누는 기쁨)',
    insight: '내가 쥔 것을 움켜쥐고 아끼기보다 곁의 사람과 조금 나누었을 때 오히려 마음이 넉넉해짐',
    tone: '누구에게나 열려 있는 랑가르 공동체 부엌의 따뜻한 김',
    action: '오늘 곁에 있는 사람에게 작은 호의나 따뜻한 감사 인사 한 마디를 먼저 건네 보세요.',
    question: '지금 내가 혼자 움켜쥐고 애쓰느라 넉넉함을 잃어버린 영역에 나눔과 여유를 보탠다면 무엇이 달라질까요?',
  },
  {
    pillar: '남 자포(Naam Japo · 맑은 중심을 잊지 않는 알아차림)',
    insight: '분주한 하루 속에서도 내 마음이 지금 어디를 향하고 있는지 잠시 멈춰 깨어 있는 습관',
    tone: '황금빛 물결이 잔잔히 일렁이는 고요한 연못가의 새벽',
    action: '바쁜 일정 사이사이에 두 번만 멈춰 서서 "지금 내 마음은 어디를 향하고 있나"를 조용히 물어보세요.',
    question: '분주한 하루의 흐름 속에서 놓치기 쉽지만, 잠시 멈춰 깨어 있을 때 다시 선명해지는 내 중심은 무엇인가요?',
  },
  {
    pillar: '차르디 칼라(Chardi Kala · 꺾이지 않는 밝은 기상)',
    insight: '어려운 조건 속에서도 주저앉지 않고 맑고 긍정적인 활력을 지켜내는 내면의 탄성',
    tone: '수확을 앞둔 황금빛 밀밭 위로 시원하게 부는 펀자브의 바람',
    action: '오늘 만나는 작은 난관 앞에서 한숨 대신 "여기서 내가 해볼 수 있는 한 가지"를 먼저 찾아보세요.',
    question: '까다로운 조건 속에서도 주저앉지 않고 맑은 활력(Chardi Kala)을 지켜 내려면 어떤 시선이 필요할까요?',
  },
  {
    pillar: '사트 상갓(Sat Sangat · 진실한 벗들과의 동행)',
    insight: '가식 없이 진심을 나눌 수 있는 한두 사람의 좋은 벗이 험한 길의 가장 큰 버팀목이 됨',
    tone: '마을 큰 나무 그늘 아래 모여앉아 차를 나누는 담백한 웃음소리',
    action: '가식 없이 마음을 터놓을 수 있는 지인 한 명에게 오늘 짧은 안부 인사를 건네 보세요.',
    question: '꾸밈없이 진심을 나눌 수 있어 내 걸음에 가장 든든한 버팀목이 되어 주는 좋은 벗은 누구인가요?',
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

const PUNJABI_SHADOWS = [
  '정직한 땀(Kirat Karo)으로 오늘 일을 끝까지 매듭짓는 성실함이 쉼과 회복이 필요한 몸 상태까지 무시하는 과로가 되지 않게 하세요.',
  '랑가르처럼 곁의 사람과 나누는 넉넉함이 내 기본 여력과 경계까지 다 소진해 버리는 무리한 희생이 되어서는 안 됩니다.',
  '멈춰 서서 마음을 살피는 알아차림(Naam Japo)이 행동에 옮겨야 할 순간까지 내면 관찰만 반복하는 관조로 머물지 않게 균형을 잡으세요.',
  '꺾이지 않는 밝은 기상(Chardi Kala)이 지금 분명히 직시하고 고쳐야 할 현실의 어려움마저 무조건 긍정으로 덮는 태도가 되지 않게 주의하세요.',
  '좋은 벗들과 마음을 나누는 동행(Sat Sangat)이 혼자 조용히 결정하고 책임져야 할 몫까지 주변 동의로 미루는 의존이 되지 않게 살피세요.',
];

function classifyPunjabiTopic(q: string): PunjabiNanakResult['questionTopic'] {
  if (/성실|땀|정직|일/.test(q)) return '성실·노동';
  if (/나눔|랑가르|호의|넉넉/.test(q)) return '나눔·랑가르';
  if (/중심|멈춰|알아차|마음/.test(q)) return '알아차림·중심';
  if (/밝|활력|기상|난관/.test(q)) return '활력·기상';
  if (/벗|지인|동행|안부/.test(q)) return '벗·동행';
  return '펀자브 전반';
}

export function calculatePunjabiNanakLangarService(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PunjabiNanakResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyPunjabiTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PILLARS.length;
  const picked = PILLARS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PILLARS.length - 1));
  const companion = PILLARS[(idx + companionOffset) % PILLARS.length];
  const langarServiceAxis = `${picked.pillar.split('(')[0].trim()} ↔ ${companion.pillar.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-PUNJABI-NANAK-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    punjabiPillar: picked.pillar,
    companionPillar: companion.pillar,
    langarServiceAxis,
    nanakInsight: picked.insight,
    fiveRiversTone: picked.tone,
    reflectionFocus: `펀자브 지혜 전통의 '${picked.pillar}'을 중심에 두고 '${companion.pillar}'의 결을 곁들여, 정직한 성실함과 넉넉한 나눔 속에서 꺾이지 않는 밝은 마음(Chardi Kala)을 길러 보세요.`,
    ritualAction: picked.action,
    shadowWarning: PUNJABI_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '펀자브(Punjab) 나낙·바바 파리드의 성실·나눔(Langar)·차르디 칼라 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPunjabiNanakPrompt(res: PunjabiNanakResult): string {
  return [
    `[펀자브 나낙·랑가르 나눔 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 랑가르 실천 축: ${res.langarServiceAxis}`,
    `- 지혜 기둥: ${res.punjabiPillar} (${res.fiveRiversTone})`,
    `- 동반 기둥: ${res.companionPillar}`,
    `- 중심 통찰: ${res.nanakInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
