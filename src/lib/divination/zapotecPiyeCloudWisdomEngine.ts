import type { UserProfile } from '../sharedState';

export interface ZapotecPiyeResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '조망·시야' | '착수·결단' | '호흡·순환' | '나눔·연대' | '기록·기준' | '사포텍 전반';
  piyeGlyph: string;
  companionGlyph: string;
  cloudInsight: string;
  monteAlbanTone: string;
  cloudHorizonAxis: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const GLYPHS = [
  {
    glyph: '베네(Bene · 구름 위의 밝은 시야)',
    insight: '발밑의 자잘한 얽힘에서 한 걸음 물러나 전체 산맥의 윤곽을 조망할 때 열리는 해결책',
    tone: '오악사카 몬테 알반 계단 위로 흐르는 하얀 아침 구름',
    axis: '구름 위에서 전체 산맥의 윤곽을 내려다보는 고지 조망의 축',
    shadow: '높은 곳에서 전체를 조망하는 데만 머물다 정작 오늘 손대야 할 발밑의 구체적 한 걸음을 미루지 마세요.',
    action: '지금 고민 중인 사안을 "일주일 뒤의 나" 시선에서 한 문장으로 다시 적어 보세요.',
    question: '한 걸음 물러나 구름 위에서 내려다본다면, 지금 가장 먼저 내려놓아도 괜찮은 걱정은 무엇인가요?',
  },
  {
    glyph: '코시오(Cocijo · 대지를 깨우는 번개와 비)',
    insight: '오래 망설이며 미뤄 둔 일에 작지만 단호한 첫 불꽃을 일으킬 때 흐름이 트이는 기운',
    tone: '마른 계곡을 적시며 내려오는 여름 소나기의 맑은 냄새',
    axis: '마른 계곡에 첫 빗줄기와 번개를 내려 막힘을 트는 단호 착수의 축',
    shadow: '즉각적인 돌파와 속도감에 취해 주변 사람들의 준비 속도나 안전 확인을 건너뛰지 않도록 살피세요.',
    action: '오래 망설이던 일 한 가지에 오늘 단 10분짜리 첫 착수 알림을 걸고 바로 손대어 보세요.',
    question: '비 온 뒤 마른 계곡이 단숨에 살아나듯, 작은 단호함 하나로 막힌 흐름이 트일 일은 무엇인가요?',
  },
  {
    glyph: '피타오(Pitao · 보이지 않는 숨결의 순환)',
    insight: '내가 쏟은 정성과 쉼의 숨결이 돌고 돌아 다시 나를 지탱해 주는 자연스러운 균형',
    tone: '고대 석조 안뜰 돌기둥 사이를 스치는 선선한 바람',
    axis: '몰입의 들숨과 회복의 날숨이 고르게 돌고 도는 생명 순환의 축',
    shadow: '숨을 고르고 균형을 맞추는 시간에 오래 머물며, 다시 몰입해야 할 핵심 작업의 리듬이 끊어지지 않게 하세요.',
    action: '오늘 집중해서 일한 한 블록 뒤에는 반드시 5분 이상 자리를 일어나 숨을 돌리는 쉼표를 넣어 보세요.',
    question: '들이마시는 몰입만큼 내쉬는 쉼의 숨결도 균형 있게 순환하고 있나요?',
  },
  {
    glyph: '겔라게차(Guelaguetza · 조건 없이 건네는 나눔)',
    insight: '상대의 호의를 계산하기보다 먼저 내 안의 여유를 한 줌 나눌 때 넓어지는 인연의 폭',
    tone: '계단식 옥수수 밭 언덕에 모인 사람들의 다정한 장터',
    axis: '셈을 내려놓고 내 몫의 여유를 먼저 건네는 겔라게차 연대의 축',
    shadow: '조건 없이 나누는 태도가 나의 에너지나 자원이 바닥날 때까지 거절하지 못하는 습관으로 굳지 않게 주의하세요.',
    action: '오늘 동료나 가까운 사람에게 계산 없이 건넬 수 있는 작은 도움이나 응원 한 마디를 먼저 전해 보세요.',
    question: '주고받는 셈을 잠시 내려놓고 내가 먼저 여유를 한 줌 나눌 때 더 따뜻해질 자리는 어디인가요?',
  },
  {
    glyph: '라니(Lani · 오늘을 기록하는 돌의 기억)',
    insight: '지나가는 기분에만 맡기지 않고 오늘 깨달은 기준을 또렷이 새겨 두는 성실함',
    tone: '해 질 녘 붉은 석양을 머금은 사포텍 석판의 단단한 결',
    axis: '기분의 바람에 흩어지지 않게 기준을 석판에 새기는 기록 정착의 축',
    shadow: '과거에 세운 기준과 기록을 지키는 데 매달리다 달라진 현재 상황에 맞춘 유연한 수정을 놓치지 마세요.',
    action: '오늘 하루를 마치기 전, 기분에 흔들리지 않도록 지켜 낸 나만의 기준 한 줄을 노트에 새겨 두세요.',
    question: '잠깐의 기분에 흩어지지 않도록 오늘 단단한 석판에 새겨 두고 싶은 나의 깨달음은 무엇인가요?',
  },
];

function classifyZapotecTopic(q: string): ZapotecPiyeResult['questionTopic'] {
  if (/높은|전체|흐름|조망|시야|구름/.test(q)) return '조망·시야';
  if (/망설|시작|착수|결단|번개/.test(q)) return '착수·결단';
  if (/숨|쉼|균형|순환|피로/.test(q)) return '호흡·순환';
  if (/나눔|인연|도움|응원|사람/.test(q)) return '나눔·연대';
  if (/기록|기준|노트|기억|정리/.test(q)) return '기록·기준';
  return '사포텍 전반';
}

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

export function calculateZapotecPiyeCloudWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ZapotecPiyeResult {
  const now = params.now ?? new Date();
  const questionText = (params.question ?? '').trim();
  const questionTopic = classifyZapotecTopic(questionText);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${questionText}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % GLYPHS.length;
  const picked = GLYPHS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (GLYPHS.length - 1));
  const companion = GLYPHS[(idx + companionOffset) % GLYPHS.length];

  return {
    engineVersion: 'LUCKEY-ZAPOTEC-PIYE-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    piyeGlyph: picked.glyph,
    companionGlyph: companion.glyph,
    cloudInsight: picked.insight,
    monteAlbanTone: picked.tone,
    cloudHorizonAxis: picked.axis,
    reflectionFocus: `메소아메리카 사포텍의 '${picked.glyph}'을 중심에 두고 '${companion.glyph}'의 시야를 함께 엮어, 눈앞의 작은 소음보다 높은 언덕 위에서 전체 흐름을 먼저 바라보세요.`,
    ritualAction: picked.action,
    shadowWarning: picked.shadow,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '멕시코 오악사카 사포텍(Zapotec) 전통의 피예(Piye) 주기·구름 사람(Be’ena’ Za’a) 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatZapotecPiyePrompt(res: ZapotecPiyeResult): string {
  return [
    `[사포텍 피예·구름 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 피예 상징: ${res.piyeGlyph} (${res.monteAlbanTone})`,
    `- 구름 지평 축: ${res.cloudHorizonAxis}`,
    `- 동반 상징: ${res.companionGlyph}`,
    `- 중심 통찰: ${res.cloudInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
