import type { UserProfile } from '../sharedState';

export interface RyukyuIcharibaChodeResult {
  engineVersion: string;
  calculatedAtKst: string;
  islandMotif: string;
  chodeInsight: string;
  seaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '이차리바 초데(한 번 만나면 모두가 형제)', insight: '스쳐 가는 인연과 사소한 대화 속에서도 따뜻한 존중을 남기면 뜻밖의 도움이 돌아오는 이치', tone: '에메랄드빛 산호 바다 위로 부는 부드러운 남풍' },
  { motif: '누치 두 타카라(목숨과 오늘 하루가 보물)', insight: '멀리 있는 거창한 성취를 좇다 지치기보다 지금 살아 숨 쉬는 내 몸과 마음을 먼저 아끼는 지혜', tone: '산호 돌담 위에 피어난 붉은 히비스커스 꽃' },
  { motif: '유이마루(서로 손잡고 돕는 품앗이)', insight: '혼자 버겁게 끌고 가던 일을 가볍게 나누어 요청할 때 관계도 일도 함께 살아나는 흐름', tone: '저녁 무렵 마을 마당에 울려 퍼지는 산신(Sanshin)의 현 소리' },
  { motif: '테다코(태양의 아이 · 밝은 첫인사)', insight: '어색하고 굳은 공기라도 내가 먼저 건네는 짧은 미소와 인사로 분위기가 풀리는 힘', tone: '류큐 해안 절벽에 쏟아지는 오전의 맑은 햇살' },
  { motif: '아와모리 숙성의 느린 시간', insight: '서둘러 맛을 내기보다 시간이 지나며 자연스럽게 깊어지는 관계와 실력을 믿고 기다리는 여유', tone: '항아리 속에서 고요히 익어 가는 맑은 술의 향기' },
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

export function calculateRyukyuIcharibaChodeHospitality(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): RyukyuIcharibaChodeResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-RYUKYU-ICHARIBA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    islandMotif: picked.motif,
    chodeInsight: picked.insight,
    seaTone: picked.tone,
    reflectionFocus: `오키나와 류큐의 '${picked.motif}'처럼, 오늘 만나는 사람과 나 자신에게 조금 더 부드러운 온기를 먼저 건네 보세요.`,
    ritualAction: '오늘 마주치는 가족·동료·점원 중 한 분에게 평소보다 반 톤 밝게 고마움이나 인사를 건네 보세요.',
    reflectiveQuestion: '오늘 내 하루를 가장 따뜻하게 바꿀 수 있는 아주 작은 친절 한 가지는 누구에게(또는 나에게) 건넬 수 있을까요?',
    interpretiveBoundary: '오키나와 류큐 전통의 환대·상부상조(유이마루) 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatRyukyuIcharibaChodePrompt(res: RyukyuIcharibaChodeResult): string {
  return [
    `[류큐 이차리바 초데·유이마루 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 섬의 모티프: ${res.islandMotif} (${res.seaTone})`,
    `- 중심 통찰: ${res.chodeInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
