import type { UserProfile } from '../sharedState';

export interface IcelandicSagaResult {
  engineVersion: string;
  calculatedAtKst: string;
  reflectionFocus: string;
  symbolicMotif: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function getKstTimeString(date: Date): string {
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

const ICELANDIC_MOTIFS = [
  '아이슬란드 사가(Íslendingasögur)의 화덕가 이야기처럼 과장된 감정보다 일어난 사실과 담담한 말 한마디로 사건의 결을 남기는 절제',
  '현무암 절벽과 지열 온천이 나란히 놓인 땅처럼 차가운 현실 속에서도 땅속 깊은 온기를 잃지 않는 내면의 저력',
  '긴 겨울밤을 버티는 롱하우스(Longhouse)의 촛불처럼 밖의 눈보라를 다 없애려 하지 않고 방안의 온기만 묵묵히 지키는 태도',
  '알싱(Alþingi) 바위 언덕에서 모두가 돌아가며 말하고 듣던 룰처럼 내 차례가 오기 전까지 상대의 이야기를 끝까지 듣는 여유',
  '화산재가 덮인 뒤에도 가장 먼저 자라나는 이끼처럼 모든 것이 멈춘 듯한 자리에서 조용히 초록을 틔우는 회복력'
];

const ICELANDIC_ACTIONS = [
  '감정을 길게 설명하려 하기보다 오늘 겪은 일을 가장 담백한 한 문장으로만 적어 보세요.',
  '바깥의 눈보라를 멈추려 애쓰지 말고 오늘 내 방 안의 불빛을 따뜻하게 유지하는 작은 일 하나만 챙기세요.',
  '당장 답이 나오지 않는 문제는 화산암 위 이끼가 자라듯 시간을 두고 조금만 더 묵혀 두세요.'
];

export function calculateIcelandicSagaHearth(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): IcelandicSagaResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const motif = ICELANDIC_MOTIFS[hash % ICELANDIC_MOTIFS.length];
  const ritualAction = ICELANDIC_ACTIONS[Math.floor(hash / 7) % ICELANDIC_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-ICELANDIC-SAGA-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 과장을 덜어내고 담담한 온기를 지키는 아이슬란드 사가 화덕 관점`
      : '차가운 바람 속에서도 화덕의 온기와 담백한 말 한마디를 지키는 아이슬란드 사가 화덕 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '오늘 내 하루를 아이슬란드 사가의 한 구절로 남긴다면 어떤 담담한 문장이 될까요?',
    interpretiveBoundary:
      '아이슬란드 사가 문학과 북방 화덕 문화의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatIcelandicSagaPrompt(result: IcelandicSagaResult): string {
  return [
    `[아이슬란드·사가 화덕 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
