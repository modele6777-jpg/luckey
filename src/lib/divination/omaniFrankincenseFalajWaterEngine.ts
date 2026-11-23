import type { UserProfile } from '../sharedState';

export interface OmaniFrankincenseResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '물길·배분' | '회복·숙성' | '우회·항해' | '환대·온기' | '여백·기다림' | '오만 전반';
  dhofarSymbol: string;
  companionSymbol: string;
  falajFlowAxis: string;
  omaniInsight: string;
  falajTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  {
    symbol: '팔라즈의 공유 수로(Aflaj Irrigation · 산속 샘물을 공정한 시간표로 나누어 모두가 살아남)',
    insight: '내 에너지와 시간도 나만의 규칙과 순서로 배분해야 메마르지 않고 오래 흐름',
    tone: '하자르 산맥 바위 틈에서 오아시스 대추야자 숲으로 맑게 이어지는 돌 수로',
    action: '오늘 하루 내 집중력이 가장 필요한 일 하나와, 잠시 쉬어 갈 시간 하나를 팔라즈 수로처럼 분명히 나누어 배정해 보세요.',
    question: '내 에너지와 시간이 메마르지 않도록 오늘 어떤 규칙과 순서로 일과 휴식의 물길을 나누고 싶나요?',
  },
  {
    symbol: '도파르의 유향 수지(Frankincense Resin · 껍질에 난 상처에서 비로소 맑은 향이 배어 나옴)',
    insight: '지나온 아픔이나 흠집도 시간이 지나 단단히 굳고 나면 나를 지키는 깊은 향기가 됨',
    tone: '몬순 안개가 머무는 도파르 언덕 보스웰리아 나무에서 굳어 가는 투명한 호박빛 방울',
    action: '지나간 시행착오 하나를 자책 대신 "지금 나를 단단하게 만든 배움 한 줄"로 바꾸어 적어 보세요.',
    question: '한때는 상처나 흠집처럼 보였지만 시간이 지나며 내 태도를 지켜 주는 깊은 향기로 변한 경험은 무엇인가요?',
  },
  {
    symbol: '오만 다우 범선의 삼각돛(Lateen Sail · 역풍마저 비스듬히 받아 앞으로 나아가는 지혜)',
    insight: '환경이 내 편이 아니라고 멈춰 서기보다 바람의 각도를 읽고 돛을 비틀어 길을 내야 함',
    tone: '아라비아해의 짙푸른 물결을 가르며 무스카트 항구로 들어오는 흰 삼각돛',
    action: '막혀 보이는 조건을 정면으로 밀어붙이기보다, 우회하거나 순서를 바꾸는 대안 각도 한 가지를 찾아보세요.',
    question: '지금 내가 역풍이라고만 여겨 피하고 있던 상황 중에서, 돛의 각도만 바꾸면 앞으로 나아가는 힘으로 쓸 수 있는 것은 무엇인가요?',
  },
  {
    symbol: '카흐와와 대추야자(Omani Hospitality · 처음 만난 이에게도 향기로운 커피 한 잔을 먼저 건넴)',
    insight: '마음이 닫혀 긴장될수록 작은 친절과 온기 하나를 먼저 내어 주면 분위기가 풀림',
    tone: '카르다몸 향이 은은하게 퍼지는 황동 주전자 달라와 달콤한 대추야자 접시',
    action: '어색하거나 긴장된 관계에서 오늘 먼저 가벼운 안부나 고마움의 한마디를 건네 보세요.',
    question: '긴장되어 닫혀 있던 분위기 속에서, 내가 먼저 건네는 작은 온기 하나로 부드럽게 풀릴 자리는 어디인가요?',
  },
  {
    symbol: '와디의 마른 물길(Wadi Bed · 비가 오지 않을 때도 다음 물길을 위해 길을 비워 둠)',
    insight: '지금 당장 성과가 보이지 않는 공백의 시간도 다음 계절의 물이 흐를 자리를 지키는 중임',
    tone: '붉은 협곡 사이로 맑은 물이 스며들며 에메랄드빛 웅덩이를 남긴 사막의 계곡',
    action: '당장 결과가 나지 않는 준비나 휴식 시간을 조급해하지 말고 다음 물길이 흐를 자리로 인정해 주세요.',
    question: '당장 눈에 띄는 성과가 없어 비어 보이지만, 사실은 다음 계절의 물이 흐를 길을 지켜 주고 있는 시간은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const OMANI_SHADOWS = [
  '시간과 에너지를 엄격한 시간표로 나누는 규칙이 예상치 못한 변수가 생겼을 때 스스로를 옭아매는 경직된 틀이 되지 않게 여유를 두세요.',
  '지나간 상처에서 의미를 찾는 성찰이 지금 당장 멈추거나 바로잡아야 할 현재의 불합리까지 무조건 미화하는 체념이 되어서는 안 됩니다.',
  '역풍을 피해 돛의 각도를 트는 유연함이 정작 가야 할 원래 항로와 목적지까지 잊어버리는 잦은 우회로 흐르지 않도록 방향을 확인하세요.',
  '먼저 건네는 따뜻한 환대가 내 마음을 돌보기도 전에 타인의 불편함을 다 떠안아 주는 감정 과소비로 이어지지 않게 경계를 살피세요.',
  '다음 물길을 기다리며 비워 두는 와디의 여백이 실제로 움직여야 할 순간에도 준비만 반복하는 무기력한 대기가 되지 않게 기한을 정하세요.',
];

function classifyOmaniTopic(q: string): OmaniFrankincenseResult['questionTopic'] {
  if (/물길|시간|배분|나누/.test(q)) return '물길·배분';
  if (/상처|배움|아픔|향/.test(q)) return '회복·숙성';
  if (/역풍|우회|대안|방향/.test(q)) return '우회·항해';
  if (/안부|온기|친절|관계/.test(q)) return '환대·온기';
  if (/공백|여백|휴식|기다/.test(q)) return '여백·기다림';
  return '오만 전반';
}

export function calculateOmaniFrankincenseFalajWater(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OmaniFrankincenseResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyOmaniTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const picked = SYMBOLS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SYMBOLS.length - 1));
  const companion = SYMBOLS[(idx + companionOffset) % SYMBOLS.length];
  const falajFlowAxis = `${picked.symbol.split('(')[0].trim()} ↔ ${companion.symbol.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-OMANI-FALAJ-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    dhofarSymbol: picked.symbol,
    companionSymbol: companion.symbol,
    falajFlowAxis,
    omaniInsight: picked.insight,
    falajTone: picked.tone,
    reflectionFocus: `오만 프랑킨센스·팔라즈 지혜의 '${picked.symbol}'을 중심에 두고 '${companion.symbol}'의 결을 곁들여, 시간과 마음의 물길을 공정하게 나누며 내 안의 향기가 굳기를 기다려 보세요.`,
    ritualAction: picked.action,
    shadowWarning: OMANI_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '아라비아 반도 오만의 도파르 유향·팔라즈 수로 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOmaniFrankincensePrompt(res: OmaniFrankincenseResult): string {
  return [
    `[오만 프랑킨센스·팔라즈 수로 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 팔라즈 물길 축: ${res.falajFlowAxis}`,
    `- 도파르 상징: ${res.dhofarSymbol} (${res.falajTone})`,
    `- 동반 상징: ${res.companionSymbol}`,
    `- 중심 통찰: ${res.omaniInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
