import type { UserProfile } from '../sharedState';

export interface ChiloePalafitoResult {
  engineVersion: string;
  calculatedAtKst: string;
  chiloeMotif: string;
  chiloeInsight: string;
  fjordTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '팔라피토의 나무 기둥(Palafito Stilts · 밀물 때는 물 위에 뜨고 썰물 때는 갯벌 위에 서는 집)', insight: '환경이 밀물처럼 차오를 때도, 썰물처럼 빠질 때도 흔들리지 않고 두 상태를 다 품을 수 있음', tone: '칠레 치로에 섬 카스트로 만의 아침, 알록달록한 목조 집들이 잔잔한 밀물 위에 비치는 풍경' },
  { motif: '라르세 나무 널빤지 비늘(Alerce Shingles · 물고기의 비늘처럼 겹쳐 비바람을 막는 나무 지붕)', insight: '작은 경험과 습관들이 서로 겹쳐져 있을 때 비로소 거센 비바람도 안으로 스며들지 않음', tone: '은빛 안개가 감도는 항구 위로 촘촘히 겹쳐진 나무 비늘 지붕이 은은히 빛나는 오전' },
  { motif: '못 없이 맞춘 목조 성당(Wooden Church Joinery · 바닷바람에 녹슬지 않도록 나무 못만으로 짜 맞춤)', insight: '환경에 맞지 않는 딱딱한 기준을 쓰기보다, 바닷바람에도 녹슬지 않는 유연한 이음새를 골라야 함', tone: '노란빛과 푸른빛으로 칠해진 나무 성당 안으로 맑은 바닷빛이 스며드는 정오' },
  { motif: '밍가의 공동체 집 옮기기(Minga · 이웃들이 통나무와 소를 모아 집을 통째로 새 터로 옮김)', insight: '혼자서는 도저히 감당할 수 없는 큰 변화도 곁의 사람들과 힘을 모으면 통째로 옮길 수 있음', tone: '푸른 언덕과 바닷가를 따라 사람들이 웃으며 함께 밧줄을 당기는 활기찬 오후' },
  { motif: '쿠란토 땅속 화덕(Curanto Pit · 달군 돌과 잎사귀 아래 바다와 땅의 재료를 함께 익힘)', insight: '서로 다른 곳에서 온 재료들도 따뜻한 중심 열기 아래 덮어 두면 맛있는 조화를 이룸', tone: '서늘한 해 질 녘, 따뜻한 김이 모락모락 피어오르는 저녁 식탁의 온기' },
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

export function calculateChiloePalafitoTidePoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChiloePalafitoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-CHILOE-PALAFITO-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    chiloeMotif: picked.motif,
    chiloeInsight: picked.insight,
    fjordTone: picked.tone,
    reflectionFocus: `치로에 팔라피토의 '${picked.motif}'처럼, 밀물과 썰물을 다 품는 기둥 위에서 녹슬지 않는 이음새로 하루를 지켜 보세요.`,
    ritualAction: '상황이 잘 풀릴 때(밀물)와 잠시 빠질 때(썰물) 모두 변하지 않을 나만의 중심 기둥 하나를 점검해 보세요.',
    reflectiveQuestion: '지금 물이 빠져 갯벌이 드러난 시기를 실패로 착각하고, 다시 밀물이 들어올 기둥의 힘을 잊은 건 아닌가요?',
    interpretiveBoundary: '칠레 치로에 섬의 팔라피토 수상가옥과 밍가 공동체 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChiloePalafitoPrompt(res: ChiloePalafitoResult): string {
  return [
    `[치로에·팔라피토 물때 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 치로에 모티프: ${res.chiloeMotif} (${res.fjordTone})`,
    `- 중심 통찰: ${res.chiloeInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
