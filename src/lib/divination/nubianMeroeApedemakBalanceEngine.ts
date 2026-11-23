import type { UserProfile } from '../sharedState';

export interface NubianMeroePrinciple {
  name: string;
  symbol: string;
  guidance: string;
  action: string;
  question: string;
}

export interface NubianMeroeResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '경계·용기' | '주도·통솔' | '교역·연결' | '인내·신뢰' | '메로에 전반';
  activePrinciple: NubianMeroePrinciple;
  companionPrinciple: NubianMeroePrinciple;
  meroeSovereigntyAxis: string;
  royalCourageNote: string;
  interpretation: string;
  ritualAction: string;
  shadowWarning: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const NUBIAN_MEROE_PRINCIPLES: NubianMeroePrinciple[] = [
  {
    name: '아페데막(Apedemak)의 당당한 수호와 용기',
    symbol: '메로에 사자 신전',
    guidance: '불필요한 눈치를 보며 내 경계를 양보하기보다 지켜야 할 원칙 앞에서 당당히 서야 할 때입니다.',
    action: '허리를 곧게 펴고 심호흡을 한 뒤, 오늘 내가 미루고 있던 작은 결정 한 가지를 내 기준대로 담백하게 확정해 보세요.',
    question: '지금 상황에서 타인의 기준에 맞추느라 미뤄 두었던, 나만의 당당한 선택 한 가지는 무엇인가요?',
  },
  {
    name: '칸다케(Kandake) — 지혜롭고 주체적인 통솔',
    symbol: '누비아 여왕의 왕관',
    guidance: '힘을 과시하기보다 전체 판을 넓게 읽고 차분하게 내 삶의 주도권을 쥐는 리더십이 빛납니다.',
    action: '눈앞의 세부 작업에 매몰되기 전에 오늘 일정 전체를 한눈에 펼쳐 놓고 우선순위 1가지를 주체적으로 정해 보세요.',
    question: '목소리를 높이지 않고도 전체 판을 넓게 읽으며 내 삶의 주도권을 차분히 되찾을 수 있는 자리는 어디인가요?',
  },
  {
    name: '나일강 하류와 상류를 잇는 교역의 지혜',
    symbol: '황금과 도자기 교차로',
    guidance: '서로 다른 생각과 자원이 만나는 자리에서 열린 태도로 교환하고 연결할 때 새로운 길이 열립니다.',
    action: '내 생각과 결이 다른 사람이나 자료 하나를 오늘 열린 태도로 살펴보며 연결할 접점을 찾아보세요.',
    question: '서로 다른 생각과 자원이 만나는 자리에서 내가 열린 태도로 교환하고 이어 붙일 수 있는 가치는 무엇인가요?',
  },
  {
    name: '쿠시(Kush)의 단단한 인내와 정직한 균형',
    symbol: '메로에 피라미드 첨탑',
    guidance: '요란한 박수보다 묵묵히 쌓아 올린 실력과 성실함이 결국 가장 오래가는 신뢰로 남습니다.',
    action: '당장 박수가 나오지 않더라도 기본기와 성실함을 지키는 작은 루틴 한 가지를 오늘 끝까지 마무리해 보세요.',
    question: '요란한 인정보다 묵묵히 쌓아 올린 실력과 성실함으로 오래가는 신뢰를 세우고 싶은 분야는 어디인가요?',
  },
];

const ROYAL_COURAGE_NOTES = [
  '사막의 밤에도 빛나는 별처럼 흔들리지 않는 내면의 자존감',
  '강물과 모래가 만나는 경계에서 길을 내는 유연한 결단력',
  '스스로의 가치를 먼저 알아보고 정당하게 대우하는 태도',
];

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const NUBIAN_SHADOWS = [
  '아페데막의 당당한 용기가 타인의 사정을 살피지 않는 단호함이나 불필요한 대립각으로 굳어지지 않게 부드러움을 곁들이세요.',
  '칸다케의 주도적 통솔이 주변 사람에게 위임하고 믿어 줄 몫까지 혼자 짊어지는 과도한 통제로 흐르지 않도록 살피세요.',
  '열린 교역과 연결을 넓히는 태도가 정작 내가 지켜야 할 핵심 기준과 자원까지 대가 없이 흘려보내는 분산이 되지 않게 하세요.',
  '묵묵히 버티는 쿠시의 인내심이 이미 방향을 수정하거나 도움을 요청해야 할 시점까지 침묵으로 넘기게 해서는 안 됩니다.',
];

function classifyNubianTopic(q: string): NubianMeroeResult['questionTopic'] {
  if (/기준|당당|경계|용기/.test(q)) return '경계·용기';
  if (/주도|통솔|우선순위|판/.test(q)) return '주도·통솔';
  if (/연결|교환|사람|다름/.test(q)) return '교역·연결';
  if (/인내|신뢰|성실|기본/.test(q)) return '인내·신뢰';
  return '메로에 전반';
}

export function calculateNubianMeroeApedemakBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NubianMeroeResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyNubianTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const activeIdx = hash % NUBIAN_MEROE_PRINCIPLES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (NUBIAN_MEROE_PRINCIPLES.length - 1));
  const activePrinciple = NUBIAN_MEROE_PRINCIPLES[activeIdx];
  const companionPrinciple = NUBIAN_MEROE_PRINCIPLES[(activeIdx + companionOffset) % NUBIAN_MEROE_PRINCIPLES.length];
  const meroeSovereigntyAxis = `${activePrinciple.symbol} ↔ ${companionPrinciple.symbol} (${questionTopic})`;
  const royalCourageNote = ROYAL_COURAGE_NOTES[stableHash(`${seed}|courage`) % ROYAL_COURAGE_NOTES.length];

  return {
    engineVersion: 'LUCKEY-NUBIAN-MEROE-v2.3.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionTopic,
    activePrinciple,
    companionPrinciple,
    meroeSovereigntyAxis,
    royalCourageNote,
    interpretation: `고대 누비아 메로에와 아페데막 전통의 균형 관점에서는 '${activePrinciple.name}'(${activePrinciple.symbol})이 중심에 서며 '${companionPrinciple.name}'의 시야가 함께 작동합니다. ${activePrinciple.guidance}`,
    ritualAction: activePrinciple.action,
    shadowWarning: NUBIAN_SHADOWS[activeIdx],
    reflectionFocus: `'${royalCourageNote}'을(를) 떠올리며 지금 내가 지나치게 작아져 있던 영역이 없는지 살펴보세요.`,
    reflectiveQuestion: activePrinciple.question,
    interpretiveBoundary: '본 풀이는 고대 누비아 메로에와 아페데막 전통 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNubianMeroePrompt(result: NubianMeroeResult): string {
  return [
    `[고대 누비아 메로에·아페데막 균형 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 메로에 주권 축: ${result.meroeSovereigntyAxis}`,
    `- 핵심 원칙: ${result.activePrinciple.name} (${result.activePrinciple.symbol})`,
    `- 동반 원칙: ${result.companionPrinciple.name} (${result.companionPrinciple.symbol})`,
    `- 수호 노트: ${result.royalCourageNote}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
