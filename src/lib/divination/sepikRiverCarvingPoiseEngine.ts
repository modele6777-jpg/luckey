import type { UserProfile } from '../sharedState';

export interface SepikCarvingResult {
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

const SEPIK_MOTIFS = [
  '파푸아뉴기니 세픽 강(Sepik River)의 영혼의 집(Haus Tambaran) 목조 기둥처럼 나무의 옹이와 결을 억지로 지우지 않고 그대로 조각의 일부로 삼는 태도',
  '굽이치는 세픽 강물 위를 미끄러지는 통나무 카누처럼 물살의 굽이를 직선으로 펴려 하지 않고 곡선 그대로 노를 젓는 감각',
  '붉은 황토와 하얀 석회, 검은 숯 세 가지 색만으로 얼굴의 표정을 세우는 전통 가면처럼 복잡한 재료를 덜어낸 선명함',
  '강가의 고상 가옥이 계절에 따라 불어나는 강물 위에서 흔들림 없이 마루를 지키듯 환경의 변화에 높이를 맞추는 유연성',
  '조각칼을 들기 전 나무를 오래 바라보며 그 안에 이미 들어 있는 형상을 천천히 꺼내는 기다림'
];

const SEPIK_ACTIONS = [
  '내 안의 거친 면이나 옹이를 억지로 깎아 내기보다 지금의 결을 살려 쓸 자리를 찾아보세요.',
  '선택지가 많아 머리가 복잡할 때는 숯·황토·석회 세 가지처럼 가장 핵심적인 기준 세 개만 남겨 보세요.',
  '흐름을 직선으로 억지로 펴려 하지 말고 오늘의 곡선을 따라 부드럽게 노를 저어 보세요.'
];

export function calculateSepikRiverCarving(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SepikCarvingResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const motif = SEPIK_MOTIFS[hash % SEPIK_MOTIFS.length];
  const ritualAction = SEPIK_ACTIONS[Math.floor(hash / 7) % SEPIK_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-SEPIK-CARVING-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 나무의 옹이와 강물의 곡선을 있는 그대로 살리는 세픽 강 조각 관점`
      : '거친 결을 깎아 버리지 않고 형태를 꺼내는 파푸아뉴기니 세픽 강 조각 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '지금 내가 없애려고만 했던 옹이 가운데 사실은 내 이야기의 핵심이 될 부분은 무엇인가요?',
    interpretiveBoundary:
      '파푸아뉴기니 세픽 강 목조 예술 전통의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatSepikCarvingPrompt(result: SepikCarvingResult): string {
  return [
    `[세픽 강·영혼 조각 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
