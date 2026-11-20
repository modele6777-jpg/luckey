import type { UserProfile } from '../sharedState';

export interface SikkimLepchaResult {
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

const SIKKIM_MOTIFS = [
  '히말라야 시킴 숲의 레프차(Lepcha) 대나무 다리처럼 계곡 양쪽의 바위와 나무에 유연하게 기대어 무게를 나누는 탄성',
  '칸첸중가(Kangchenjunga) 산자락을 감싸는 구름처럼 정상까지 한 번에 오르려 하지 않고 숲의 층위마다 머무는 숨 고르기',
  '계곡의 야생 난초와 양치식물이 햇빛을 독차지하지 않고 겹겹의 그늘 속에서 함께 피어나는 공존의 질서',
  '대나무 통에 물을 담아 나르듯 필요한 만큼만 가볍게 덜어 내어 발걸음을 무겁게 만들지 않는 지혜',
  '안개가 낀 숲길에서도 새소리와 물소리로 길을 분간하듯 눈에 보이는 성과 너머의 리듬을 듣는 감각'
];

const SIKKIM_ACTIONS = [
  '모든 것을 완벽히 통제하려 하기보다 대나무 다리처럼 조금 휘어지며 충격을 흘려보내 보세요.',
  '오늘 들고 갈 마음의 짐을 대나무 통 하나 분량으로만 줄이고 나머지는 잠시 내려두세요.',
  '당장 앞이 흐려 보일 때는 조급히 속도를 내지 말고 주변의 작은 신호 하나만 차분히 들어 보세요.'
];

export function calculateSikkimLepchaForest(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SikkimLepchaResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const motif = SIKKIM_MOTIFS[hash % SIKKIM_MOTIFS.length];
  const ritualAction = SIKKIM_ACTIONS[Math.floor(hash / 7) % SIKKIM_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-SIKKIM-LEPCHA-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 유연한 대나무 탄성과 숲의 호흡을 살피는 시킴 레프차 관점`
      : '안개 낀 히말라야 숲에서 대나무 다리처럼 유연하게 흔들리며 건너는 시킴 레프차 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '지금 부러지지 않기 위해 조금 휘어지는 편이 나은 마음의 기준은 무엇인가요?',
    interpretiveBoundary:
      '히말라야 시킴 레프차 숲 문화의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatSikkimLepchaPrompt(result: SikkimLepchaResult): string {
  return [
    `[시킴·레프차 숲 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
