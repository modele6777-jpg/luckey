import type { UserProfile } from '../sharedState';

export interface BengaliBaulResult {
  engineVersion: string;
  calculatedAtKst: string;
  baulString: string;
  companionString: string;
  monerInsight: string;
  bengalTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STRINGS = [
  {
    stringName: '에크타라(Ektara · 단 하나의 줄이 내는 순수한 울림)',
    insight: '수많은 생각과 핑계를 덜어내고 내 삶에서 진짜 중요한 단 하나의 울림에 귀를 기울이는 단순함',
    tone: '황금빛 논둑길을 걸으며 튕기는 한 줄 현악기의 소박한 여운',
    ritual: '오늘 머릿속에 얽힌 수많은 조건을 덜어내고, 가장 먼저 지켜야 할 단 하나의 울림만 남겨 보세요.',
    question: '수많은 잡음과 핑계를 모두 내려놓고 한 줄 현악기처럼 단 하나의 진심만 남긴다면 무엇이 울리나요?',
  },
  {
    stringName: '모네르 마누쉬(Moner Manush · 내 마음속에 사는 소중한 사람)',
    insight: '먼 곳의 신기루를 찾아 헤매기보다 이미 내 마음 안에 자리한 본래의 나와 진심을 만나는 기쁨',
    tone: '강가 나룻배 위에서 저녁 바람을 맞으며 부르는 고요한 노래',
    ritual: '바깥에서 인정을 구하기 전에 오늘 내 마음속 소중한 나 자신에게 다정한 안부 한 마디를 건네세요.',
    question: '멀리서 답을 찾느라 잊고 있었지만 이미 내 마음 안에 조용히 머물고 있던 진심은 무엇인가요?',
  },
  {
    stringName: '랄론 파키르(Lalon Fakir)의 경계 없는 시선',
    insight: '스스로 그어 둔 편견과 구별의 선을 지울 때 비로소 보이는 넓고 자유로운 세상',
    tone: '연꽃이 핀 강물 위로 흩어지는 부드러운 안개와 물결',
    ritual: '이건 내 일이 아니라며 그어 두었던 경계선 하나를 잠시 지우고 부드러운 호기심으로 바라보세요.',
    question: '내가 스스로 만든 선입견과 경계선 너머에 사실은 나를 자유롭게 해 줄 어떤 가능성이 놓여 있을까요?',
  },
  {
    stringName: '아친 파키(Achin Pakhi · 마음의 새장을 드나드는 낯선 새)',
    insight: '예고 없이 찾아오는 영감과 감정을 억지로 가두려 하지 않고 반갑게 맞이했다 보내주는 유연함',
    tone: '반얀나무 그늘 사이로 날아드는 작은 파랑새의 가벼운 날갯짓',
    ritual: '예고 없이 찾아온 감정이나 낯선 생각을 통제하려 들지 말고 잠시 머물다 날아가도록 숨을 쉬어 주세요.',
    question: '마음의 새장에 억지로 가두어 붙잡으려 하기보다 반갑게 맞았다가 가볍게 보내 줄 감정은 무엇인가요?',
  },
  {
    stringName: '소호즈(Sohoj · 꾸밈없이 자연스럽고 쉬운 길)',
    insight: '복잡하고 어렵게 꼬아 놓은 고민일수록 가장 단순하고 솔직한 첫 마음으로 돌아갈 때 풀림',
    tone: '비 온 뒤 맑게 갠 벵골 평원의 시원한 흙냄새',
    ritual: '오늘 복잡한 이유를 열 가지 늘어놓기 전에, 내가 정말 원하는 핵심 한 가지만 아주 쉬운 말로 말해 보세요.',
    question: '억지로 꾸미거나 복잡하게 만들지 않고 가장 소박하고 자연스러운 나(Sohoj)로 돌아간다면, 지금 무엇이 가장 먼저 보이나요?',
  },
];

function formatKstStandard(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
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
  const baseSeed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(baseSeed) % STRINGS.length;
  const companionOffset = 1 + (stableHash(`${baseSeed}|companion`) % (STRINGS.length - 1));
  const companionIdx = (idx + companionOffset) % STRINGS.length;
  const picked = STRINGS[idx];
  const companion = STRINGS[companionIdx];

  return {
    engineVersion: 'LUCKEY-BENGALI-BAUL-v2.2.0',
    calculatedAtKst: formatKstStandard(now),
    baulString: picked.stringName,
    companionString: companion.stringName,
    monerInsight: picked.insight,
    bengalTone: picked.tone,
    reflectionFocus: `벵골 바울 유랑 시인의 '${picked.stringName}'을 첫 울림으로 삼고 '${companion.stringName}'의 여운을 곁들여, 이미 내 마음 안에 있는 가장 단순하고 솔직한 소리를 들어 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '벵골(Bengal) 바울 유랑 시인과 랄론 파키르의 모네르 마누쉬 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBengaliBaulPrompt(res: BengaliBaulResult): string {
  return [
    `[벵골 바울·모네르 마누쉬 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 바울 선율: ${res.baulString} (${res.bengalTone})`,
    `- 보조 여운: ${res.companionString}`,
    `- 중심 통찰: ${res.monerInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
