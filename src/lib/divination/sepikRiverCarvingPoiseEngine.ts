import type { UserProfile } from '../sharedState';

export interface SepikCarvingResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '결·옹이' | '흐름·곡선' | '선명·기준' | '유연·높이' | '관찰·기다림' | '세픽 전반';
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  sepikGrainAxis: string;
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

const SEPIK_MOTIFS = [
  '파푸아뉴기니 세픽 강(Sepik River)의 영혼의 집(Haus Tambaran) 목조 기둥처럼 나무의 옹이와 결을 억지로 지우지 않고 그대로 조각의 일부로 삼는 태도',
  '굽이치는 세픽 강물 위를 미끄러지는 통나무 카누처럼 물살의 굽이를 직선으로 펴려 하지 않고 곡선 그대로 노를 젓는 감각',
  '붉은 황토와 하얀 석회, 검은 숯 세 가지 색만으로 얼굴의 표정을 세우는 전통 가면처럼 복잡한 재료를 덜어낸 선명함',
  '강가의 고상 가옥이 계절에 따라 불어나는 강물 위에서 흔들림 없이 마루를 지키듯 환경의 변화에 높이를 맞추는 유연성',
  '조각칼을 들기 전 나무를 오래 바라보며 그 안에 이미 들어 있는 형상을 천천히 꺼내는 기다림'
];

const SEPIK_ACTIONS = [
  '내 안의 거친 면이나 옹이를 억지로 깎아 내기보다 지금의 결을 살려 쓸 자리를 찾아보세요.',
  '흐름을 직선으로 억지로 펴려 하지 말고 오늘의 곡선을 따라 부드럽게 노를 저어 보세요.',
  '선택지가 많아 머리가 복잡할 때는 숯·황토·석회 세 가지처럼 가장 핵심적인 기준 세 개만 남겨 보세요.',
  '환경의 수위가 바뀔 때마다 억지로 버티기보다 오늘 내 마음의 마루 높이를 한 칸 조절해 보세요.',
  '당장 칼을 대어 결론을 내기보다 지금 마주한 재료의 결을 5분만 더 가만히 들여다보세요.'
];

const SEPIK_QUESTIONS = [
  '지금 내가 없애려고만 했던 옹이 가운데 사실은 내 이야기의 핵심이 될 부분은 무엇인가요?',
  '직선으로 억지로 펴려 들지 않고 굽이치는 곡선 그대로 노를 저을 때 훨씬 편해질 일은 무엇인가요?',
  '지금 내 작업대 위에서 덜어 내고 숯·황토·석회처럼 선명하게 남길 세 가지 기준은 무엇인가요?',
  '불어나는 물결에 맞춰 내 일상이나 마음의 높이를 유연하게 조절해야 할 자리는 어디인가요?',
  '서둘러 깎아 내기 전에 그 안에 이미 들어 있는 형상이 드러날 때까지 기다려 줄 일은 무엇인가요?'
];

const SEPIK_SHADOWS = [
  '나무의 옹이와 거친 결을 그대로 살리는 수용이 분명히 다듬고 고쳐야 할 습관이나 실수까지 "원래 내 결"이라며 합리화하는 태도가 되지 않게 하세요.',
  '물살의 곡선을 따라 노를 젓는 유연함이 꼭 세워야 할 직선의 마감선과 약속 시간까지 흐리게 만드는 무계획함이 되어서는 안 됩니다.',
  '황토·석회·숯 세 가지 색처럼 기준을 압축하는 선명함이 맥락과 세밀한 사정을 살피지 않는 거친 단순화로 흐르지 않게 주의하세요.',
  '수위에 맞춰 마루 높이를 조절하는 적응력이 내 중심 가치까지 주변 환경에 따라 수시로 바꾸는 무원칙함이 되지 않도록 기준선을 지키세요.',
  '조각칼을 들기 전 나무를 오래 바라보는 신중함이 막상 첫 칼을 대어야 할 때조차 망설이며 실행을 미루는 핑계가 되지 않게 하세요.',
];

function classifySepikTopic(q: string): SepikCarvingResult['questionTopic'] {
  if (/결|옹이|거친|살려/.test(q)) return '결·옹이';
  if (/곡선|물살|흐름|카누/.test(q)) return '흐름·곡선';
  if (/기준|세 가지|선명|덜어/.test(q)) return '선명·기준';
  if (/높이|유연|변화|수위/.test(q)) return '유연·높이';
  if (/기다|바라|칼|드려/.test(q)) return '관찰·기다림';
  return '세픽 전반';
}

export function calculateSepikRiverCarving(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SepikCarvingResult {
  const { profile, now = new Date(), question = '' } = params;
  const q = question.trim();
  const questionTopic = classifySepikTopic(q);
  const seed = `${JSON.stringify(profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % SEPIK_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SEPIK_MOTIFS.length - 1));

  const motif = SEPIK_MOTIFS[idx];
  const companionMotif = SEPIK_MOTIFS[(idx + companionOffset) % SEPIK_MOTIFS.length];
  const ritualAction = SEPIK_ACTIONS[idx];
  const shadowWarning = SEPIK_SHADOWS[idx];
  const reflectiveQuestion = SEPIK_QUESTIONS[idx];
  const sepikGrainAxis = `${motif.slice(0, 14).trim()} ↔ ${companionMotif.slice(0, 14).trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-SEPIK-CARVING-v2.3.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    reflectionFocus: q
      ? `질문 "${q}" 속에서 나무의 옹이와 강물의 곡선을 있는 그대로 살리는 세픽 강 조각 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '거친 결을 깎아 버리지 않고 형태를 꺼내는 파푸아뉴기니 세픽 강 조각 관점',
    symbolicMotif: motif,
    companionMotif,
    sepikGrainAxis,
    ritualAction,
    shadowWarning,
    reflectiveQuestion,
    interpretiveBoundary:
      '파푸아뉴기니 세픽 강 목조 예술 전통의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatSepikCarvingPrompt(result: SepikCarvingResult): string {
  return [
    `[세픽 강·영혼 조각 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 목조 결 축: ${result.sepikGrainAxis}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
