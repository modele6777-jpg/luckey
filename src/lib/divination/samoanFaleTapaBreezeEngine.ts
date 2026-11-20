import type { UserProfile } from '../sharedState';

export interface SamoanFaleResult {
  engineVersion: string;
  calculatedAtKst: string;
  samoanMotif: string;
  samoanInsight: string;
  faleTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '사방이 트인 팔레 지붕(Open Fale · 벽 없이 둥근 지붕과 기둥만 두어 바닷바람이 막힘없이 통함)', insight: '숨길 것과 방어벽이 너무 많으면 답답해지지만, 바람이 통하도록 열어 두면 마음이 늘 시원함', tone: '남태평양 사모아 해변가, 벽이 없는 둥근 팔레 지붕 아래로 야자수 바람이 불어오는 아침' },
  { motif: '코코넛 섬유 밧줄 매듭(Afa Lashing · 못 하나 없이 시닛 밧줄로 대들보를 엮어 태풍을 견딤)', insight: '단단한 쇠못보다 팽팽하면서도 탄력 있게 엮인 유연한 결속이 큰 바람을 더 잘 버텨 냄', tone: '둥근 나무 기둥을 촘촘히 감싼 갈색 코코넛 밧줄 매듭이 햇빛을 받아 반짝이는 오전' },
  { motif: '시아포 타파 천의 두드림(Siapo Barkcloth · 뽕나무 껍질을 두드려 넓고 부드러운 천을 만듦)', insight: '좁고 뻣뻣해 보이던 재료도 정성껏 두드리고 펴 주면 훨씬 넓고 따뜻한 쓰임새로 거듭남', tone: '맑은 시냇가 근처에서 나무 망치 소리가 일정한 박자로 울려 퍼지는 낮' },
  { motif: '파아 사모아의 존중(Fa’a Samoa · 가족과 이웃의 체면과 마음을 먼저 헤아리며 나눔)', insight: '나 혼자 앞질러 얻는 이득보다, 곁에 있는 사람과 기쁨을 나눌 때 자리 전체가 풍요로워짐', tone: '둥근 돗자리 위에 열대 과일과 꽃목걸이가 놓이고 정겨운 인사가 오가는 오후' },
  { motif: '라군 너머의 산호초 파도(Reef Horizon · 먼 바다의 파도가 부서지며 하얀 거품 선을 그림)', insight: '멀리서 들리는 파도 소리에 미리 겁먹기보다, 지금 내가 선 고요한 모래톱을 믿고 바라보면 됨', tone: '해 질 녘 분홍빛 하늘 아래 산호초 너머로 하얀 파도가 잔잔히 부서지는 저녁' },
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

export function calculateSamoanFaleTapaBreeze(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SamoanFaleResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-SAMOAN-FALE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    samoanMotif: picked.motif,
    samoanInsight: picked.insight,
    faleTone: picked.tone,
    reflectionFocus: `사모아 팔레 지붕의 '${picked.motif}'처럼, 불필요한 벽을 세우기보다 시원한 바람이 통하도록 마음을 열어 보세요.`,
    ritualAction: '오늘 혼자 끙끙 앓던 생각 하나를 믿을 수 있는 사람과 가볍게 나누어 바람을 쐬어 주세요.',
    reflectiveQuestion: '태풍을 막겠다고 내가 사방에 벽을 세웠다가, 정작 시원한 바람까지 막아 버린 곳은 어디인가요?',
    interpretiveBoundary: '남태평양 사모아의 팔레(Fale) 개방형 지붕과 파아 사모아 공동체 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSamoanFalePrompt(res: SamoanFaleResult): string {
  return [
    `[사모아·팔레 바람 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 사모아 모티프: ${res.samoanMotif} (${res.faleTone})`,
    `- 중심 통찰: ${res.samoanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
