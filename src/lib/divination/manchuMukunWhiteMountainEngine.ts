import type { UserProfile } from '../sharedState';

export interface ManchuMukunResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '연대·품위' | '실행·질서' | '호흡·인내' | '무쿤 전반';
  mukunPrinciple: string;
  companionPrinciple: string;
  whiteMountainAxis: string;
  whiteMountainInsight: string;
  heilongjiangTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  {
    principle: '무쿤(Mukūn · 뿌리를 함께 기억하는 느슨하지만 단단한 연대)',
    insight: '각자의 자리에서 바쁘게 움직여도 위급할 때 서로의 등 뒤를 지켜주는 신뢰가 있음',
    tone: '백두산 천지의 맑은 물이 흘러내려 장백의 자작나무 숲을 적시는 고요한 흐름',
    action: '오늘 내 등 뒤를 지켜주는 가까운 사람이나 동료에게 짧은 안부나 감사의 한 마디를 먼저 건네 보세요.',
    question: '서로 바쁘게 움직이면서도 위급할 때 등 뒤를 맡길 수 있는 내 곁의 연대는 어디에 있나요?',
  },
  {
    principle: '바투루(Baturu · 조용하지만 물러서지 않는 실행력)',
    insight: '큰 소리로 자랑하지 않아도 막상 맡은 일 앞에서는 흔들림 없이 해내는 담담한 기개',
    tone: '흑룡강(사할랸 울라)의 묵직하고 유유한 물결 위를 지나는 이른 아침의 배',
    action: '요란하게 알리기 전에 오늘 맡은 핵심 과제 한 가지를 묵묵히 끝까지 매듭지어 보세요.',
    question: '큰 소리 내지 않고 담담하게 밀고 나가면 오늘 안에 충분히 매듭지을 수 있는 일은 무엇인가요?',
  },
  {
    principle: '니루(Niru · 화살 하나씩 모아야 한 다발이 되는 질서)',
    insight: '거창한 계획보다 오늘 내 몫의 작은 화살 하나를 곧게 깎는 정성이 전체를 지탱함',
    tone: '눈 덮인 침엽수림 사이로 곧게 뻗어 있는 사냥꾼의 고요한 발자국',
    action: '오늘 미루어 두었던 일 중 가장 기본적인 한 가지를 골라 화살 하나 깎듯 정성껏 마무리해 보세요.',
    question: '지금 내가 요란하게 겉을 꾸미느라 놓치고 있는, 묵직하고 곧은 내 몫의 한 걸음은 무엇인가요?',
  },
  {
    principle: '우라(Ula · 긴 강물처럼 서두르지 않고 멀리 가는 인내)',
    insight: '당장 눈앞의 작은 승부에 일희일비하지 않고 계절을 건너는 긴 호흡으로 마음을 둠',
    tone: '초가을 단풍이 물든 송화강 기슭의 선선하고 맑은 바람',
    action: '오늘 당장 결론 나지 않는 일 앞에서 조급함을 내려놓고 이번 주 전체 흐름으로 호흡을 길게 잡아 보세요.',
    question: '눈앞의 작은 승부보다 계절을 건너는 긴 강물처럼 호흡을 길게 두고 지켜볼 일은 무엇인가요?',
  },
  {
    principle: '도로(Doro · 예의와 절도 속에서 지켜지는 품위)',
    insight: '가까운 사이일수록 선을 지키고 공경할 줄 알 때 관계가 오래도록 상하지 않음',
    tone: '겨울밤 따뜻한 온돌방에서 차를 나누며 나지막이 이야기를 잇는 자리',
    action: '오늘 가까운 사람과의 대화에서도 말의 온도와 선을 한 번 더 헤아려 정중히 건네 보세요.',
    question: '편하다는 이유로 무심코 넘기기 전에, 오늘 예의와 온기를 함께 지켜 주고 싶은 관계는 어디인가요?',
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

const MANCHU_SHADOWS = [
  '서로의 등 뒤를 지켜주는 연대가 고맙지만, 혼자 해결해야 할 작은 일까지 주변의 확인과 동의에 묶어 두지는 마세요.',
  '말없이 묵묵히 해내는 바투루의 기개가 정작 중간 공유나 도움 요청이 필요한 순간까지 입을 다물게 해서는 안 됩니다.',
  '작은 화살 하나를 곧게 깎는 정성에 치중하다 전체 숲의 방향과 우선순위가 바뀌었는지 살피는 시야를 놓치지 마세요.',
  '긴 강물처럼 호흡을 길게 두는 인내가 오늘 반드시 마감해야 할 작은 기한까지 느슨하게 미루는 핑계가 되지 않게 하세요.',
  '예의와 절도를 지키는 품위가 속마음을 솔직하게 조율해야 할 대화에서 겉도는 거리감으로 굳어지지 않도록 살피세요.',
];

function classifyManchuTopic(q: string): ManchuMukunResult['questionTopic'] {
  if (/연대|사람|예의|품위|온기/.test(q)) return '연대·품위';
  if (/실행|매듭|걸음|화살|질서/.test(q)) return '실행·질서';
  if (/호흡|강물|인내|계절|길게/.test(q)) return '호흡·인내';
  return '무쿤 전반';
}

export function calculateManchuMukunWhiteMountain(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ManchuMukunResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyManchuTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRINCIPLES.length - 1));
  const companion = PRINCIPLES[(idx + companionOffset) % PRINCIPLES.length];
  const whiteMountainAxis = `${picked.principle.split('(')[0].trim()} ↔ ${companion.principle.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-MANCHU-MUKUN-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    mukunPrinciple: picked.principle,
    companionPrinciple: companion.principle,
    whiteMountainAxis,
    whiteMountainInsight: picked.insight,
    heilongjiangTone: picked.tone,
    reflectionFocus: `만주 무쿤 지혜의 '${picked.principle}'을 중심에 두고 '${companion.principle}'의 균형을 함께 엮어, 요란한 말 대신 오늘 내 몫의 작은 한 걸음을 곧고 묵직하게 깎아 보세요.`,
    ritualAction: picked.action,
    shadowWarning: MANCHU_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '만주·여진의 무쿤(Mukūn) 연대와 우라(Ula) 긴 호흡의 질서를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatManchuMukunPrompt(res: ManchuMukunResult): string {
  return [
    `[만주 무쿤·흰산 검은강 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 백두·흑룡 축: ${res.whiteMountainAxis}`,
    `- 지혜 축: ${res.mukunPrinciple} (${res.heilongjiangTone})`,
    `- 동반 축: ${res.companionPrinciple}`,
    `- 중심 통찰: ${res.whiteMountainInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
