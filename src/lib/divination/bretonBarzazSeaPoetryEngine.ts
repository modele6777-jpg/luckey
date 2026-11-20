import type { UserProfile } from '../sharedState';

export interface BretonBarzazResult {
  engineVersion: string;
  calculatedAtKst: string;
  coastalMotif: string;
  barzazInsight: string;
  seaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '브로셀리앙드(Brocéliande) 숲의 샘물', insight: '복잡한 계획이 엉킬수록 가장 처음 품었던 맑은 의도 한 줄로 돌아가 다시 물을 긷는 지혜', tone: '이끼 낀 떡갈나무 아래 고요히 반짝이는 맑은 샘' },
  { motif: '아르모리카(Armorica) 등대의 불빛', insight: '안개가 짙어 앞이 다 보이지 않더라도 지금 당장 비출 수 있는 한 걸음의 방향을 지키는 꾸준함', tone: '거친 대서양 파도 끝 바위 절벽을 지키는 따뜻한 불빛' },
  { motif: '멘히르(Menhir) 선돌의 고요한 버팀', insight: '주변의 서두름에 휩쓸리지 않고 내 리듬과 속도를 묵묵히 지키는 단단한 중심', tone: '해풍을 맞으며 수천 년을 서 있는 화강암 돌기둥' },
  { motif: '바르작 브레이즈(Barzaz Breiz)의 민요 가락', insight: '말로 다 설명되지 않는 마음의 결을 짧은 문장이나 노래로 건넬 때 공명이 일어나는 힘', tone: '저녁 어스름 항구 술집에 울려 퍼지는 켈트 하프 소리' },
  { motif: '생말로(Saint-Malo) 밀물과 썰물의 시간', insight: '물이 빠졌을 때 걸어갈 길과 물이 찼을 때 쉬어갈 때를 가려 아는 자연스러운 감각', tone: '썰물 뒤 드러난 젖은 모래사장 위의 선명한 발자국' },
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

export function calculateBretonBarzazSeaPoetry(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BretonBarzazResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-BRETON-BARZAZ-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    coastalMotif: picked.motif,
    barzazInsight: picked.insight,
    seaTone: picked.tone,
    reflectionFocus: `브르타뉴 시학의 '${picked.motif}'처럼, 지금이 밀물처럼 밀어붙일 때인지 썰물처럼 숨을 고를 때인지 먼저 살펴보세요.`,
    ritualAction: '오늘 하고 싶은 일이나 떠오른 생각을 한 줄의 짧은 시나 메모로 적어 내 마음의 결을 확인해 보세요.',
    reflectiveQuestion: '지금 내가 조급하게 썰물을 거슬러 헤엄치려 하느라 놓치고 있는 고요한 때와 흐름은 무엇인가요?',
    interpretiveBoundary: '프랑스 브르타뉴 전통의 바르작 브레이즈(Barzaz Breiz) 해안 시학과 켈트 자연 감수성을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBretonBarzazPrompt(res: BretonBarzazResult): string {
  return [
    `[브르타뉴 바르작 해안 시학 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 해안 모티프: ${res.coastalMotif} (${res.seaTone})`,
    `- 중심 통찰: ${res.barzazInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
