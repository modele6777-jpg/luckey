import type { UserProfile } from '../sharedState';

export interface MalteseLuzzuResult {
  engineVersion: string;
  calculatedAtKst: string;
  harborSymbol: string;
  luzzuInsight: string;
  mediterraneanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  { symbol: '루조의 눈(Luzzu Eye · 파도를 살피며 뱃머리를 지키는 시선)', insight: '익숙한 일상 속에서도 내 마음의 방향타를 가만히 살피면 큰 흔들림을 미리 피해 감', tone: '마르사슐록 항구의 에메랄드빛 물결 위에 나란히 떠 있는 오색 루조 어선' },
  { symbol: '하가르 킴 거석(Ħaġar Qim · 바위처럼 묵직하게 서 있는 중심)', insight: '유행처럼 스쳐가는 말보다 오랜 시간 변치 않는 내 핵심 가치가 나를 지탱함', tone: '지중해의 햇살을 머금은 따뜻한 벌꿀빛 석회암 거석 신전' },
  { symbol: '발레타 항구의 닻(Grand Harbour · 거친 바람을 피하는 고요한 만)', insight: '바다에 나가 있는 시간만큼 항구로 돌아와 닻을 내리고 정비하는 쉼이 필수임', tone: '성 엘모 요새 아래로 잔잔히 들어오는 오후의 해풍' },
  { symbol: '고조(Gozo) 소금밭(Salt Pans · 바람과 햇볕이 빚어낸 결정)', insight: '억지로 서둘러 얻어내는 결과보다 시간이 스며들어 자연스레 남는 결실이 단단함', tone: '해안가 바위 위 바둑판처럼 깎인 소금밭에 반짝이는 하얀 결정' },
  { symbol: '메디나의 고요한 골목(Mdina · 소음을 잠재우는 좁고 맑은 길)', insight: '바깥의 소란에서 한 걸음 비켜서서 고요한 틈을 만들 때 생각이 맑아짐', tone: '석양빛을 받아 금빛으로 물든 침묵의 도시 메디나의 돌담' },
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

export function calculateMalteseMegalithLuzzuHarbor(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MalteseLuzzuResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const picked = SYMBOLS[idx];

  return {
    engineVersion: 'LUCKEY-MALTESE-LUZZU-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    harborSymbol: picked.symbol,
    luzzuInsight: picked.insight,
    mediterraneanTone: picked.tone,
    reflectionFocus: `몰타 지중해 지혜의 '${picked.symbol}'처럼, 바깥의 파도에 휩쓸리기 전에 내 마음의 닻을 내리고 맑은 시야를 회복해 보세요.`,
    ritualAction: '오늘 잠시 조용한 틈을 내어 내가 지금 가장 아껴서 지켜야 할 고요한 중심 하나를 떠올려 보세요.',
    reflectiveQuestion: '지금 내가 거친 물결 위에서 서둘러 노를 젓는 대신, 고요한 항구로 돌아와 살피고 싶은 방향은 어디인가요?',
    interpretiveBoundary: '지중해 몰타의 메갈리스 거석 유산과 루조(Luzzu) 항해 상징을 바탕으로 한 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMalteseLuzzuPrompt(res: MalteseLuzzuResult): string {
  return [
    `[몰타 메갈리스·루조 항구 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 지중해 상징: ${res.harborSymbol} (${res.mediterraneanTone})`,
    `- 중심 통찰: ${res.luzzuInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
