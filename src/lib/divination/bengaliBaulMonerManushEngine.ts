import type { UserProfile } from '../sharedState';

export interface BengaliBaulResult {
  engineVersion: string;
  calculatedAtKst: string;
  baulString: string;
  monerInsight: string;
  bengalTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STRINGS = [
  { stringName: '에크타라(Ektara · 단 하나의 줄이 내는 순수한 울림)', insight: '수많은 생각과 핑계를 덜어내고 내 삶에서 진짜 중요한 단 하나의 울림에 귀를 기울이는 단순함', tone: '황금빛 논둑길을 걸으며 튕기는 한 줄 현악기의 소박한 여운' },
  { stringName: '모네르 마누쉬(Moner Manush · 내 마음속에 사는 소중한 사람)', insight: '먼 곳의 신기루를 찾아 헤매기보다 이미 내 마음 안에 자리한 본래의 나와 진심을 만나는 기쁨', tone: '강가 나룻배 위에서 저녁 바람을 맞으며 부르는 고요한 노래' },
  { stringName: '랄론 파키르(Lalon Fakir)의 경계 없는 시선', insight: '스스로 그어 둔 편견과 구별의 선을 지울 때 비로소 보이는 넓고 자유로운 세상', tone: '연꽃이 핀 강물 위로 흩어지는 부드러운 안개와 물결' },
  { stringName: '아친 파키(Achin Pakhi · 마음의 새장을 드나드는 낯선 새)', insight: '예고 없이 찾아오는 영감과 감정을 억지로 가두려 하지 않고 반갑게 맞이했다 보내주는 유연함', tone: '반얀나무 그늘 사이로 날아드는 작은 파랑새의 가벼운 날갯짓' },
  { stringName: '소호즈(Sohoj · 꾸밈없이 자연스럽고 쉬운 길)', insight: '복잡하고 어렵게 꼬아 놓은 고민일수록 가장 단순하고 솔직한 첫 마음으로 돌아갈 때 풀림', tone: '비 온 뒤 맑게 갠 벵골 평원의 시원한 흙냄새' },
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

export function calculateBengaliBaulMonerManush(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BengaliBaulResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % STRINGS.length;
  const picked = STRINGS[idx];

  return {
    engineVersion: 'LUCKEY-BENGALI-BAUL-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    baulString: picked.stringName,
    monerInsight: picked.insight,
    bengalTone: picked.tone,
    reflectionFocus: `벵골 바울 유랑 시인의 '${picked.stringName}'처럼, 밖에서 해답을 찾기 전에 이미 내 마음 안에 있는 가장 단순하고 솔직한 울림을 들어 보세요.`,
    ritualAction: '오늘 복잡한 이유를 열 가지 늘어놓기 전에, 내가 정말 원하는 핵심 한 가지만 아주 쉬운 말로 말해 보세요.',
    reflectiveQuestion: '억지로 꾸미거나 복잡하게 만들지 않고 가장 소박하고 자연스러운 나(Sohoj)로 돌아간다면, 지금 무엇이 가장 먼저 보이나요?',
    interpretiveBoundary: '벵골(Bengal) 바울 유랑 시인과 랄론 파키르의 모네르 마누쉬 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBengaliBaulPrompt(res: BengaliBaulResult): string {
  return [
    `[벵골 바울·모네르 마누쉬 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 바울 선율: ${res.baulString} (${res.bengalTone})`,
    `- 중심 통찰: ${res.monerInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
