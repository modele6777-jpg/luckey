import type { UserProfile } from '../sharedState';

export interface PunjabiNanakResult {
  engineVersion: string;
  calculatedAtKst: string;
  punjabiPillar: string;
  nanakInsight: string;
  fiveRiversTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PILLARS = [
  { pillar: '키랏 카로(Kirat Karo · 정직한 땀과 성실한 일)', insight: '요행을 바라지 않고 오늘 내 손으로 정직하게 해내는 작은 일에 담긴 단단한 자부심', tone: '다섯 강물이 합쳐져 흐르는 비옥한 펀자브 평원의 아침 햇살' },
  { pillar: '반드 차코(Vand Chhako · 가진 것을 함께 나누는 기쁨)', insight: '내가 쥔 것을 움켜쥐고 아끼기보다 곁의 사람과 조금 나누었을 때 오히려 마음이 넉넉해짐', tone: '누구에게나 열려 있는 랑가르 공동체 부엌의 따뜻한 김' },
  { pillar: '남 자포(Naam Japo · 맑은 중심을 잊지 않는 알아차림)', insight: '분주한 하루 속에서도 내 마음이 지금 어디를 향하고 있는지 잠시 멈춰 깨어 있는 습관', tone: '황금빛 물결이 잔잔히 일렁이는 고요한 연못가의 새벽' },
  { pillar: '차르디 칼라(Chardi Kala · 꺾이지 않는 밝은 기상)', insight: '어려운 조건 속에서도 주저앉지 않고 맑고 긍정적인 활력을 지켜내는 내면의 탄성', tone: '수확을 앞둔 황금빛 밀밭 위로 시원하게 부는 펀자브의 바람' },
  { pillar: '사트 상갓(Sat Sangat · 진실한 벗들과의 동행)', insight: '가식 없이 진심을 나눌 수 있는 한두 사람의 좋은 벗이 험한 길의 가장 큰 버팀목이 됨', tone: '마을 큰 나무 그늘 아래 모여앉아 차를 나누는 담백한 웃음소리' },
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

export function calculatePunjabiNanakLangarService(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PunjabiNanakResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PILLARS.length;
  const picked = PILLARS[idx];

  return {
    engineVersion: 'LUCKEY-PUNJABI-NANAK-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    punjabiPillar: picked.pillar,
    nanakInsight: picked.insight,
    fiveRiversTone: picked.tone,
    reflectionFocus: `펀자브 지혜 전통의 '${picked.pillar}'처럼, 정직한 성실함과 넉넉한 나눔 속에서 꺾이지 않는 밝은 마음(Chardi Kala)을 길러 보세요.`,
    ritualAction: '오늘 곁에 있는 사람에게 작은 호의나 따뜻한 감사 인사 한 마디를 먼저 건네 보세요.',
    reflectiveQuestion: '지금 내가 혼자 움켜쥐고 애쓰느라 넉넉함을 잃어버린 영역에 나눔과 여유를 보탠다면 무엇이 달라질까요?',
    interpretiveBoundary: '펀자브(Punjab) 나낙·바바 파리드의 성실·나눔(Langar)·차르디 칼라 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPunjabiNanakPrompt(res: PunjabiNanakResult): string {
  return [
    `[펀자브 나낙·랑가르 나눔 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 지혜 기둥: ${res.punjabiPillar} (${res.fiveRiversTone})`,
    `- 중심 통찰: ${res.nanakInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
