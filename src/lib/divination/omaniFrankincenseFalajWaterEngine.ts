import type { UserProfile } from '../sharedState';

export interface OmaniFrankincenseResult {
  engineVersion: string;
  calculatedAtKst: string;
  dhofarSymbol: string;
  omaniInsight: string;
  falajTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  { symbol: '팔라즈의 공유 수로(Aflaj Irrigation · 산속 샘물을 공정한 시간표로 나누어 모두가 살아남)', insight: '내 에너지와 시간도 나만의 규칙과 순서로 배분해야 메마르지 않고 오래 흐름', tone: '하자르 산맥 바위 틈에서 오아시스 대추야자 숲으로 맑게 이어지는 돌 수로' },
  { symbol: '도파르의 유향 수지(Frankincense Resin · 껍질에 난 상처에서 비로소 맑은 향이 배어 나옴)', insight: '지나온 아픔이나 흠집도 시간이 지나 단단히 굳고 나면 나를 지키는 깊은 향기가 됨', tone: '몬순 안개가 머무는 도파르 언덕 보스웰리아 나무에서 굳어 가는 투명한 호박빛 방울' },
  { symbol: '오만 다우 범선의 삼각돛(Lateen Sail · 역풍마저 비스듬히 받아 앞으로 나아가는 지혜)', insight: '환경이 내 편이 아니라고 멈춰 서기보다 바람의 각도를 읽고 돛을 비틀어 길을 내야 함', tone: '아라비아해의 짙푸른 물결을 가르며 무스카트 항구로 들어오는 흰 삼각돛' },
  { symbol: '카흐와와 대추야자(Omani Hospitality · 처음 만난 이에게도 향기로운 커피 한 잔을 먼저 건넴)', insight: '마음이 닫혀 긴장될수록 작은 친절과 온기 하나를 먼저 내어 주면 분위기가 풀림', tone: '카르다몸 향이 은은하게 퍼지는 황동 주전자 달라와 달콤한 대추야자 접시' },
  { symbol: '와디의 마른 물길(Wadi Bed · 비가 오지 않을 때도 다음 물길을 위해 길을 비워 둠)', insight: '지금 당장 성과가 보이지 않는 공백의 시간도 다음 계절의 물이 흐를 자리를 지키는 중임', tone: '붉은 협곡 사이로 맑은 물이 스며들며 에메랄드빛 웅덩이를 남긴 사막의 계곡' },
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

export function calculateOmaniFrankincenseFalajWater(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OmaniFrankincenseResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const picked = SYMBOLS[idx];

  return {
    engineVersion: 'LUCKEY-OMANI-FALAJ-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    dhofarSymbol: picked.symbol,
    omaniInsight: picked.insight,
    falajTone: picked.tone,
    reflectionFocus: `오만 프랑킨센스·팔라즈 지혜의 '${picked.symbol}'처럼, 메마른 순간에도 시간과 마음의 물길을 공정하게 나누며 내 안의 향기가 굳기를 기다려 보세요.`,
    ritualAction: '오늘 하루 내 집중력이 가장 필요한 일 하나와, 잠시 쉬어 갈 시간 하나를 팔라즈 수로처럼 분명히 나누어 배정해 보세요.',
    reflectiveQuestion: '지금 내가 역풍이라고만 여겨 피하고 있던 상황 중에서, 돛의 각도만 바꾸면 앞으로 나아가는 힘으로 쓸 수 있는 것은 무엇인가요?',
    interpretiveBoundary: '아라비아 반도 오만의 도파르 유향·팔라즈 수로 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOmaniFrankincensePrompt(res: OmaniFrankincenseResult): string {
  return [
    `[오만 프랑킨센스·팔라즈 수로 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 도파르 상징: ${res.dhofarSymbol} (${res.falajTone})`,
    `- 중심 통찰: ${res.omaniInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
