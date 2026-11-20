import type { UserProfile } from '../sharedState';

export interface PalauanBaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  palauanMotif: string;
  palauanInsight: string;
  baiTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '바이 회당의 이야기 서까래(Storyboards · 대들보와 서까래마다 공동체의 교훈과 전설을 새김)', insight: '말로만 흘려보내지 않고 눈에 보이는 기록이나 이야기로 남길 때 경험이 지혜로 굳어짐', tone: '팔라우 열대 숲 사이, 정교하게 채색된 목조 바이 회당의 높은 지붕 아래 서늘한 아침' },
  { motif: '암초 안쪽의 잔잔한 라군(Inner Lagoon · 바깥 거친 파도를 산호초가 막아 주어 안쪽은 늘 고요함)', insight: '외부 세상의 소음이 크더라도 내 마음 한가운데에는 산호초가 지켜 주는 잔잔한 라군을 둘 수 있음', tone: '에메랄드빛 바닷물이 산호초 너머의 파도를 잠재우며 유리처럼 반짝이는 오전' },
  { motif: '네 기둥의 균형 잡힌 합의(Four Corner Pillars · 네 방향의 기둥이 똑같이 무게를 나누어 지붕을 받침)', insight: '한 사람이 모든 책임을 지기보다 역할을 고르게 나누고 서로의 무게를 인정할 때 안정됨', tone: '네 모서리 기둥 사이로 바닷바람이 막힘없이 드나드는 시원한 한낮' },
  { motif: '타로 밭의 물길 돌보기(Taro Patch Care · 진흙과 맑은 물의 높낮이를 세심히 조절해 뿌리를 키움)', insight: '화려한 잎만 바라보기보다 보이지 않는 물밑 환경과 기반을 천천히 돌보는 일이 핵심임', tone: '초록빛 타로 잎사귀 위로 맑은 빗방울이 구슬처럼 맺혀 구르는 오후' },
  { motif: '산호섬 사이의 조수 읽기(Tide Reading · 밀물과 썰물의 때를 읽고 배를 띄울 순간을 고름)', insight: '무조건 힘껏 노를 젓는 것보다 물때가 들어오는 흐름에 맞추어 움직이면 훨씬 멀리 감', tone: '해 질 녘 붉은빛이 록 아일랜드의 둥근 섬들 사이 물길에 길게 비치는 저녁' },
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

export function calculatePalauanBaiRafterBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PalauanBaiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-PALAU-BAI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    palauanMotif: picked.motif,
    palauanInsight: picked.insight,
    baiTone: picked.tone,
    reflectionFocus: `팔라우 바이 회당의 '${picked.motif}'처럼, 네 기둥의 균형을 나누고 산호초 안쪽 라군의 고요를 지켜 보세요.`,
    ritualAction: '오늘 내가 혼자 짊어지고 있던 일 중 하나를 믿을 수 있는 동료나 도구와 나누어 보세요.',
    reflectiveQuestion: '바깥의 거친 파도 소리에 휩쓸려, 내가 정작 내 안의 잔잔한 라군을 잊고 있었던 건 아닌가요?',
    interpretiveBoundary: '남태평양 팔라우 전통 바이(Bai) 회당·이야기 서까래·라군 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPalauanBaiPrompt(res: PalauanBaiResult): string {
  return [
    `[팔라우·바이 공회당 서까래 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 팔라우 모티프: ${res.palauanMotif} (${res.baiTone})`,
    `- 중심 통찰: ${res.palauanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
