import type { UserProfile } from '../sharedState';

export interface MalteseLuzzuResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '방향·중심' | '정박·휴식' | '인내·고요' | '루조 항구 전반';
  harborSymbol: string;
  companionSymbol: string;
  harborCompassAxis: string;
  luzzuInsight: string;
  mediterraneanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  {
    symbol: '루조의 눈(Luzzu Eye · 파도를 살피며 뱃머리를 지키는 시선)',
    insight: '익숙한 일상 속에서도 내 마음의 방향타를 가만히 살피면 큰 흔들림을 미리 피해 감',
    tone: '마르사슐록 항구의 에메랄드빛 물결 위에 나란히 떠 있는 오색 루조 어선',
    action: '오늘 분주한 일과를 시작하기 전, 내가 놓치고 있던 마음의 방향타가 무엇인지 한 줄로 적어 보세요.',
    question: '지금 내가 거친 물결 위에서 서둘러 노를 젓는 대신, 고요한 항구로 돌아와 살피고 싶은 방향은 어디인가요?',
  },
  {
    symbol: '하가르 킴 거석(Ħaġar Qim · 바위처럼 묵직하게 서 있는 중심)',
    insight: '유행처럼 스쳐가는 말보다 오랜 시간 변치 않는 내 핵심 가치가 나를 지탱함',
    tone: '지중해의 햇살을 머금은 따뜻한 벌꿀빛 석회암 거석 신전',
    action: '남들의 속도나 시선과 무관하게 오늘 내가 끝까지 지킬 핵심 기준 한 가지를 정해 두세요.',
    question: '주변의 바람이 바뀔 때도 벌꿀빛 거석처럼 내 중심을 묵직하게 붙들어 주는 가치는 무엇인가요?',
  },
  {
    symbol: '발레타 항구의 닻(Grand Harbour · 거친 바람을 피하는 고요한 만)',
    insight: '바다에 나가 있는 시간만큼 항구로 돌아와 닻을 내리고 정비하는 쉼이 필수임',
    tone: '성 엘모 요새 아래로 잔잔히 들어오는 오후의 해풍',
    action: '오늘 일정 사이에 의도적으로 15분 이상의 닻 내리기 휴식 시간을 비워 두고 숨을 고르세요.',
    question: '계속 바다 위에만 떠 있느라 닻을 내리고 정비하는 일을 미루고 있던 영역은 어디인가요?',
  },
  {
    symbol: '고조(Gozo) 소금밭(Salt Pans · 바람과 햇볕이 빚어낸 결정)',
    insight: '억지로 서둘러 얻어내는 결과보다 시간이 스며들어 자연스레 남는 결실이 단단함',
    tone: '해안가 바위 위 바둑판처럼 깎인 소금밭에 반짝이는 하얀 결정',
    action: '당장 결과를 재촉하던 일 하나를 두고 오늘은 재료와 기본 조건을 다듬는 데만 집중해 보세요.',
    question: '억지로 서둘러 거두려다 오히려 흐트러지는 대신, 시간이 스며들도록 기다려 주고 싶은 결실은 무엇인가요?',
  },
  {
    symbol: '메디나의 고요한 골목(Mdina · 소음을 잠재우는 좁고 맑은 길)',
    insight: '바깥의 소란에서 한 걸음 비켜서서 고요한 틈을 만들 때 생각이 맑아짐',
    tone: '석양빛을 받아 금빛으로 물든 침묵의 도시 메디나의 돌담',
    action: '오늘 잠시 휴대폰과 알림을 멀리 두고 조용한 틈에서 내 생각의 소음을 가라앉혀 보세요.',
    question: '바깥의 소란에서 한 걸음 비켜선 고요한 골목에 선다면 지금 가장 또렷하게 들릴 내 목소리는 무엇인가요?',
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

const MALTESE_SHADOWS = [
  '방향타를 살피는 신중함이 지나쳐, 정작 바람을 타고 돛을 펼쳐야 할 출발 타이밍까지 계속 늦추지 않도록 하세요.',
  '거석처럼 묵직한 중심을 지키는 태도가 새로운 변화나 다른 관점을 받아들이는 유연함까지 굳게 닫아 버리지 않게 하세요.',
  '항구에 닻을 내리고 정비하는 쉼이 길어져, 다시 바다로 나가야 할 다음 일정과 약속까지 미루는 핑계가 되지 않게 하세요.',
  '시간이 스며들기를 기다리는 인내가 지금 당장 내가 직접 보완하고 손을 보아야 할 기본 작업까지 놓치게 해서는 안 됩니다.',
  '소음을 잠재우는 고요한 골목이 좋지만, 필요한 소통과 현실의 확인 요청까지 너무 오래 차단해 두지는 마세요.',
];

function classifyMalteseTopic(q: string): MalteseLuzzuResult['questionTopic'] {
  if (/방향|시야|중심|기준|거석/.test(q)) return '방향·중심';
  if (/닻|항구|휴식|정비|쉼/.test(q)) return '정박·휴식';
  if (/소금|기다|고요|소음|골목/.test(q)) return '인내·고요';
  return '루조 항구 전반';
}

export function calculateMalteseMegalithLuzzuHarbor(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MalteseLuzzuResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyMalteseTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const picked = SYMBOLS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SYMBOLS.length - 1));
  const companion = SYMBOLS[(idx + companionOffset) % SYMBOLS.length];
  const harborCompassAxis = `${picked.symbol.split('(')[0].trim()} ↔ ${companion.symbol.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-MALTESE-LUZZU-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    harborSymbol: picked.symbol,
    companionSymbol: companion.symbol,
    harborCompassAxis,
    luzzuInsight: picked.insight,
    mediterraneanTone: picked.tone,
    reflectionFocus: `몰타 지중해 지혜의 '${picked.symbol}'을 중심에 두고 '${companion.symbol}'의 시야를 함께 엮어, 바깥의 파도에 휩쓸리기 전에 내 마음의 닻을 내리고 맑은 시야를 회복해 보세요.`,
    ritualAction: picked.action,
    shadowWarning: MALTESE_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '지중해 몰타의 메갈리스 거석 유산과 루조(Luzzu) 항해 상징을 바탕으로 한 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMalteseLuzzuPrompt(res: MalteseLuzzuResult): string {
  return [
    `[몰타 메갈리스·루조 항구 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 항구 나침반 축: ${res.harborCompassAxis}`,
    `- 지중해 상징: ${res.harborSymbol} (${res.mediterraneanTone})`,
    `- 동반 상징: ${res.companionSymbol}`,
    `- 중심 통찰: ${res.luzzuInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
