import type { UserProfile } from '../sharedState';

export interface BununMountainResult {
  engineVersion: string;
  calculatedAtKst: string;
  bununMotif: string;
  bununInsight: string;
  mountainTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '파시부트부트 여덟 겹 화음(Pasibutbut · 여러 낮은 목소리가 겹쳐 계곡의 공명처럼 높아짐)', insight: '한 사람이 혼자 튀어 오르려 하지 않고 낮은 음부터 서로 포개어 부르면 공명이 저절로 하늘에 닿음', tone: '대만 옥산 산맥의 맑은 새벽, 둥글게 선 이들이 낮고 깊은 화음을 천천히 쌓아 올리는 골짜기' },
  { motif: '나무판 그림 달력의 계절(Islaqat Calendar · 밭을 갈고 쉬는 때를 작은 나무판 그림으로 기억함)', insight: '무작정 달리기만 하지 말고 지금은 심을 때인지, 김을 맬 때인지, 쉴 때인지 계절의 그림을 보아야 함', tone: '해가 막 산등성이를 넘을 때, 나무판에 새겨진 농사 그림을 손끝으로 짚어 보는 오전' },
  { motif: '메아리로 묻고 답하는 산길(Valley Echo · 골짜기 건너편을 향해 부른 소리가 돌아오는 길)', insight: '내가 세상에 던진 말과 태도는 반드시 골짜기의 메아리처럼 내게 다시 돌아옴', tone: '구름이 산허리를 감싸 안은 정오, 먼 능선에서 맑은 새소리가 메아리로 돌아오는 풍경' },
  { motif: '조 이삭을 나누는 추수(Millet Sharing · 첫 수확은 혼자 먹지 않고 공동체와 먼저 나눔)', insight: '작은 성취의 첫 열매를 주변과 나눌 때 내 창고도, 마음의 곳간도 더 오래 든든해짐', tone: '노란 조 이삭이 바람에 고개를 숙인 밭가에서 따뜻한 웃음이 오가는 오후' },
  { motif: '산장 화덕의 꺼지지 않는 불씨(Hearth Ember · 밤새 재 아래 묻어 둔 불씨로 다음 날 불을 살림)', insight: '당장 활활 타오르지 않고 겉으로 조용히 식어 보이는 날에도 내 안의 작은 불씨만 지키면 됨', tone: '높은 산밤의 별빛 아래, 붉은 숯불이 재 속에서 따뜻하게 숨 쉬는 고요한 밤' },
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

export function calculateBununJadeMountainSong(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BununMountainResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-BUNUN-MOUNTAIN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    bununMotif: picked.motif,
    bununInsight: picked.insight,
    mountainTone: picked.tone,
    reflectionFocus: `부눈족 산맥 화음의 '${picked.motif}'처럼, 혼자 높은 음을 내려 애쓰기보다 낮은 호흡부터 포개어 공명을 만들어 보세요.`,
    ritualAction: '오늘 조급히 앞서 나가려던 마음을 한 옥타브 낮추고, 주변 사람과 호흡을 맞추는 대화 한 마디를 건네 보세요.',
    reflectiveQuestion: '지금 내가 혼자 고음으로 치고 나가느라 놓치고 있는, 함께 낼 수 있는 여덟 겹 화음은 무엇인가요?',
    interpretiveBoundary: '대만 중앙산맥 부눈족의 파시부트부트 다성 합창과 그림 달력 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBununMountainPrompt(res: BununMountainResult): string {
  return [
    `[부눈·옥산 산맥 화음 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 부눈 모티프: ${res.bununMotif} (${res.mountainTone})`,
    `- 중심 통찰: ${res.bununInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
