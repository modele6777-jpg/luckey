import type { UserProfile } from '../sharedState';

export interface DiquisSpheresResult {
  engineVersion: string;
  calculatedAtKst: string;
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  ritualAction: string;
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

const DIQUIS_ITEMS = [
  {
    motif: '코스타리카 디퀴스(Diquís) 정글의 완벽한 석구(Stone Spheres)처럼 거친 화강암의 모난 귀퉁이를 오랜 손길로 둥글게 다듬어 낸 완만함',
    ritual: '오늘 유난히 날이 서 있던 생각이나 말투 하나를 모래로 다듬듯 부드럽게 둥글려 보세요.',
    question: '오랜 시간을 들여 모난 구석을 둥글려 간다면 지금 가장 먼저 부드러워질 부분은 어디일까요?',
  },
  {
    motif: '열대 우림의 짙은 초록 사이에서 별자리와 방위를 가리키던 돌공의 배치처럼 혼란한 숲속에서도 방향감을 잃지 않는 기준점',
    ritual: '주변이 숲처럼 복잡할수록 내 하루의 기준점이 될 작은 약속 하나만 또렷하게 세워 두세요.',
    question: '복잡한 상황 속에서도 내가 흔들리지 않고 가리키고 싶은 나만의 방위는 어디인가요?',
  },
  {
    motif: '몇 세대에 걸쳐 모래와 돌로 표면을 갈아 윤을 낸 장인정신처럼 하루아침에 결론을 내지 않고 묵묵히 둥글려 가는 시간의 힘',
    ritual: '당장 매끈한 완성품이 되지 않아도 괜찮으니 오늘은 표면의 거친 부분 한 곳만 가볍게 손봐 주세요.',
    question: '지금 하루아침에 끝내려 조급해하기보다 시간을 두고 묵묵히 다듬어야 할 일은 무엇인가요?',
  },
  {
    motif: '크고 작은 돌공들이 서로 다른 무게로 같은 땅 위에 놓여 있듯 타인의 속도와 내 무게를 비교하지 않고 자리 잡는 안정감',
    ritual: '오늘 남들의 속도를 의식하던 일 하나를 내려놓고 내 호흡에 맞는 보폭을 정해 보세요.',
    question: '다른 사람의 크기나 속도와 비교하지 않을 때 비로소 편안해지는 내 자리는 어디인가요?',
  },
  {
    motif: '열대 비가 지나간 뒤 더 매끄럽게 빛나는 화강암 표면처럼 어려운 시기를 지난 뒤에 오히려 단단하고 부드러워지는 결',
    ritual: '최근 겪었던 껄끄러운 일에서 내가 한 겹 더 단단해진 지점 하나를 짧게 적어 보세요.',
    question: '지나간 비바람 덕분에 오히려 더 매끄럽고 단단해진 내 안의 결은 무엇인가요?',
  },
];

export function calculateCostaRicaDiquisSpheres(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): DiquisSpheresResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % DIQUIS_ITEMS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (DIQUIS_ITEMS.length - 1));
  const picked = DIQUIS_ITEMS[idx];
  const companion = DIQUIS_ITEMS[(idx + companionOffset) % DIQUIS_ITEMS.length];

  return {
    engineVersion: 'LUCKEY-DIQUIS-SPHERES-v2.2.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 모난 마음을 천천히 둥글려 가는 코스타리카 디퀴스 돌공과 동반 배치(${companion.motif.slice(0, 26)}…) 관점`
      : `정글 속에서 오랜 시간 다듬어진 완벽한 원형처럼 중심을 지키는 코스타리카 디퀴스 돌공과 동반 배치(${companion.motif.slice(0, 26)}…) 관점`,
    symbolicMotif: picked.motif,
    companionMotif: companion.motif,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary:
      '코스타리카 디퀴스 석구 유적의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatDiquisSpheresPrompt(result: DiquisSpheresResult): string {
  return [
    `[디퀴스·정글 돌공 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
