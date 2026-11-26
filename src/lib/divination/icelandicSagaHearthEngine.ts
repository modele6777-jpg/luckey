import type { UserProfile } from '../sharedState';

export interface IcelandicSagaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '절제·온기' | '경청·차례' | '회복·이끼' | '화덕 전반';
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  sagaHearthAxis: string;
  topicBalanceHint: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function getKstTimeString(date: Date): string {
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

const ICELANDIC_MOTIFS = [
  '아이슬란드 사가(Íslendingasögur)의 화덕가 이야기처럼 과장된 감정보다 일어난 사실과 담담한 말 한마디로 사건의 결을 남기는 절제',
  '현무암 절벽과 지열 온천이 나란히 놓인 땅처럼 차가운 현실 속에서도 땅속 깊은 온기를 잃지 않는 내면의 저력',
  '긴 겨울밤을 버티는 롱하우스(Longhouse)의 촛불처럼 밖의 눈보라를 다 없애려 하지 않고 방안의 온기만 묵묵히 지키는 태도',
  '알싱(Alþingi) 바위 언덕에서 모두가 돌아가며 말하고 듣던 룰처럼 내 차례가 오기 전까지 상대의 이야기를 끝까지 듣는 여유',
  '화산재가 덮인 뒤에도 가장 먼저 자라나는 이끼처럼 모든 것이 멈춘 듯한 자리에서 조용히 초록을 틔우는 회복력'
];

const ICELANDIC_ACTIONS = [
  '감정을 길게 설명하려 하기보다 오늘 겪은 일을 가장 담백한 한 문장으로만 적어 보세요.',
  '차가운 현실 속에서도 내 안의 지열을 지켜 주는 따뜻한 휴식 한 가지를 오늘 일정에 넣어 두세요.',
  '바깥의 눈보라를 멈추려 애쓰지 말고 오늘 내 방 안의 불빛을 따뜻하게 유지하는 작은 일 하나만 챙기세요.',
  '내 차례를 서두르기보다 오늘 대화에서는 상대의 문장이 끝날 때까지 한 박자 더 들어 보세요.',
  '당장 답이 나오지 않는 문제는 화산암 위 이끼가 자라듯 시간을 두고 조금만 더 묵혀 두세요.'
];

const ICELANDIC_QUESTIONS = [
  '오늘 내 하루를 아이슬란드 사가의 한 구절로 남긴다면 어떤 담담한 문장이 될까요?',
  '차가운 바깥 풍경과 달리, 지금 내 땅속 깊이에서 조용히 데워지고 있는 온기는 무엇인가요?',
  '밖의 눈보라를 다 끄려 애쓰는 대신, 내가 지금 가장 먼저 지켜야 할 방안의 촛불은 무엇인가요?',
  '서둘러 내 답을 내놓기 전에 한 박자 더 귀 기울여 들어 주어야 할 곁의 이야기는 무엇인가요?',
  '멈춘 듯 보이는 화산암 위에서 어느새 조용히 초록을 틔우고 있는 내 회복의 싹은 무엇인가요?'
];

const ICELANDIC_SHADOWS = [
  '감정을 절제하고 담담하게 남기려다 정작 꼭 표현해야 할 고마움이나 아픔까지 돌처럼 굳혀 버리지 마세요.',
  '땅속 깊은 지열을 믿고 버티는 동안에도 지금 겉으로 드러난 피로와 휴식의 신호를 외면하지 마세요.',
  '방 안의 촛불만 지키는 데 집중하다 문밖에서 도움을 청하는 이웃의 노크 소리까지 닫아 두지 마세요.',
  '상대의 말을 끝까지 듣는 여유를 지키되 내가 꼭 짚어야 할 사실과 경계선까지 뒤로 미루지는 마세요.',
  '이끼가 자라듯 시간을 두어 기다리되 이미 썩은 나무를 붙잡고 있는 게 아닌지도 가끔 살피세요.',
];

const ICELANDIC_TOPIC_HINTS: Record<IcelandicSagaResult['questionTopic'], string> = {
  '절제·온기': '감정을 담백하게 절제하되 스스로를 돌보는 따뜻한 지열과 휴식은 아끼지 마세요.',
  '경청·차례': '상대의 이야기를 한 박자 더 경청하되 내가 지켜야 할 사실과 경계선도 또렷이 남기세요.',
  '회복·이끼': '화산암 위 이끼처럼 차분히 시간을 두어 회복하되 멈춰 서 있는 이유도 가끔 살피세요.',
  '화덕 전반': '과장을 덜어낸 담백한 말과 방 안의 작은 온기가 함께할 때 긴 겨울도 흔들리지 않습니다.',
};

function classifyIcelandicTopic(q: string): IcelandicSagaResult['questionTopic'] {
  if (/절제|온기|과장|촛불|지열/.test(q)) return '절제·온기';
  if (/경청|차례|대화|듣|이야기/.test(q)) return '경청·차례';
  if (/회복|이끼|멈춤|기다|시간/.test(q)) return '회복·이끼';
  return '화덕 전반';
}

export function calculateIcelandicSagaHearth(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): IcelandicSagaResult {
  const { profile, now = new Date(), question = '' } = params;
  const q = question.trim();
  const questionTopic = classifyIcelandicTopic(q);
  const seed = `${JSON.stringify(profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % ICELANDIC_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (ICELANDIC_MOTIFS.length - 1));

  const motif = ICELANDIC_MOTIFS[idx];
  const companionMotif = ICELANDIC_MOTIFS[(idx + companionOffset) % ICELANDIC_MOTIFS.length];
  const sagaHearthAxis = `${motif.slice(0, 18)}… ↔ ${companionMotif.slice(0, 18)}… (${questionTopic})`;
  const topicBalanceHint = ICELANDIC_TOPIC_HINTS[questionTopic];
  const ritualAction = ICELANDIC_ACTIONS[idx];
  const shadowWarning = ICELANDIC_SHADOWS[idx];
  const reflectiveQuestion = ICELANDIC_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-ICELANDIC-SAGA-v2.4.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    reflectionFocus: q
      ? `질문 "${q}" 속에서 과장을 덜어내고 담담한 온기를 지키는 아이슬란드 사가 화덕 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '차가운 바람 속에서도 화덕의 온기와 담백한 말 한마디를 지키는 아이슬란드 사가 화덕 관점',
    symbolicMotif: motif,
    companionMotif,
    sagaHearthAxis,
    topicBalanceHint,
    ritualAction,
    shadowWarning,
    reflectiveQuestion,
    interpretiveBoundary:
      '아이슬란드 사가 문학과 북방 화덕 문화의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatIcelandicSagaPrompt(result: IcelandicSagaResult): string {
  return [
    `[아이슬란드·사가 화덕 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 사가·화덕 축: ${result.sagaHearthAxis}`,
    `- 맥락 균형 조언: ${result.topicBalanceHint}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
