import type { UserProfile } from '../sharedState';

export interface YapeseRaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  stoneTrust: string;
  yapeseInsight: string;
  lagoonTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STONES = [
  { stone: '라이 돌화폐(Rai Stone · 옮기지 않아도 공동체가 기억하는 신뢰)', insight: '굳이 매번 눈앞에 증명해 보이지 않아도 한 번 쌓인 성실함과 신뢰는 제자리에 남아 있음', tone: '미크로네시아 야프 섬의 코코넛 야자수 그늘 아래 고요히 세워진 둥근 석회암 원반' },
  { stone: '팔라우 항해길(Palau Quarry · 거친 파도를 건너 얻은 가치의 무게)', insight: '쉽게 손에 넣은 것보다 긴 시간과 정성을 들여 마련한 기준일수록 마음이 오래 아낌', tone: '에메랄드빛 산호초 라군 너머로 시원하게 펼쳐지는 태평양의 잔잔한 물결' },
  { stone: '페바이 집회소(Pebaey · 큰 목소리보다 조용한 합의가 머무는 지붕)', insight: '갈등이 있을 때 이기려 들기보다 모두가 고개를 끄덕일 수 있는 선을 찾는 편이 오래감', tone: '높은 초가지붕 아래 바닷바람이 부드럽게 드나드는 열린 나무 마루' },
  { stone: '타로 밭의 물길(Taro Patch · 짠물과 단물의 경계를 지키는 세심함)', insight: '남과 비교하며 조급해하기보다 내 삶의 토양에 맞는 적절한 수분과 속도를 지켜야 함', tone: '바닷가 안쪽 습지에 정갈하게 가꾸어진 푸른 토란 잎과 맑은 도랑물' },
  { stone: '바다 밑에 가라앉은 돌(Sunken Rai · 보이지 않는 곳에서도 여전히 살아 있는 약속)', insight: '당장 남의 눈에 띄지 않는 수고라 해도 내 양심과 관계 안에서는 이미 충분한 가치가 있음', tone: '투명한 옥빛 바다 밑 모래바닥 위로 일렁이는 오후의 햇빛 조각들' },
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

export function calculateYapeseRaiStoneTrust(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): YapeseRaiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % STONES.length;
  const picked = STONES[idx];

  return {
    engineVersion: 'LUCKEY-YAPESE-RAI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    stoneTrust: picked.stone,
    yapeseInsight: picked.insight,
    lagoonTone: picked.tone,
    reflectionFocus: `미크로네시아 야프 라이 돌 지혜의 '${picked.stone}'처럼, 당장 남의 눈에 드러나지 않아도 내가 쌓아 온 정직한 신뢰와 묵직한 기준을 믿어 보세요.`,
    ritualAction: '오늘 내가 한 약속이나 맡은 일 중 하나를, 누가 보지 않아도 스스로 부끄럽지 않게 깔끔히 매듭지어 보세요.',
    reflectiveQuestion: '지금 내가 굳이 억지로 증명하려 애쓰고 있을 뿐, 이미 내 성실함으로 충분히 자리 잡고 있는 신뢰는 무엇인가요?',
    interpretiveBoundary: '미크로네시아 야프(Yap)의 라이 돌화폐 신뢰·페바이 합의 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatYapeseRaiPrompt(res: YapeseRaiResult): string {
  return [
    `[야프 라이 돌·공동체 신뢰 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 섬의 상징: ${res.stoneTrust} (${res.lagoonTone})`,
    `- 중심 통찰: ${res.yapeseInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
