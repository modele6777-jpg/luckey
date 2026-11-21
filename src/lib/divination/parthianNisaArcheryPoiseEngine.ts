import type { UserProfile } from '../sharedState';

export interface ParthianNisaResult {
  engineVersion: string;
  calculatedAtKst: string;
  nisaMotif: string;
  companionMotif: string;
  parthianInsight: string;
  steppeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '니사 상아 리톤(Nisa Ivory Rhyton · 비단길 교차로에서 여러 문화를 넉넉히 받아들이는 뿔잔)',
    insight: '자기 중심을 잃지 않으면서도 낯선 관점과 예의를 유연하게 섞을 줄 아는 태도가 길을 넓힘',
    tone: '코페트다그 산자락 아래 니사의 고대 성채에서 별빛을 받으며 빛나는 조각된 상아 잔',
    action: '오늘 내 방식과 다른 의견을 만났을 때, 곧장 방어하기보다 상대의 장점 한 가지를 먼저 건져 담아 보세요.',
    question: '내 중심을 지키면서도 낯선 관점과 예의를 넉넉히 받아들일 때 더 넓어질 나의 길은 어디인가요?',
  },
  {
    motif: '파르티안 샷의 선회(Parthian Shot · 물러나는 몸짓 속에서도 과녁을 정확히 바라보는 시선)',
    insight: '한 걸음 물러서는 일은 패배가 아니라, 불필요한 정면충돌을 피하고 시야를 되찾는 전략적 여유임',
    tone: '넓은 이란 고원의 초원 위로 바람을 가르며 가볍게 몸을 돌려 균형을 잡는 기병의 자세',
    action: '오늘 버겁게 느껴지는 일 하나에서 억지로 버티기를 멈추고, 한 걸음 비켜서서 다른 각도로 바라보는 3분을 가져 보세요.',
    question: '지금 내가 물러서면 진다고 여기며 붙잡고 있는 일 가운데, 방향을 살짝 틀어 선회하면 훨씬 가뿐해질 부분은 무엇인가요?',
  },
  {
    motif: '메르브 역참의 등불(Merv Caravanserai · 먼 길을 달리는 이들이 잠시 안장을 풀고 숨을 고르는 쉼터)',
    insight: '속도를 내는 힘만큼 제때 멈춰 안장을 살피고 물과 여물을 채우는 절제가 먼 길을 가능하게 함',
    tone: '사막 오아시스 성벽 너머로 밤새 길손들의 온기를 지켜 주는 은은한 등불',
    action: '다음 일로 넘어가기 전, 오늘 내 체력과 일정의 안장이 느슨하거나 무리한 곳이 없는지 2분만 점검해 보세요.',
    question: '더 멀리 가기 위해 속도를 줄이고 물과 여물을 채워야 할 나만의 역참 쉼터는 지금 어디인가요?',
  },
  {
    motif: '아르사케스 연맹의 공존(Arsacid Autonomy · 각 지역의 고유한 결을 인정하며 하나의 질서를 이룸)',
    insight: '모든 것을 한 손에 쥐려 하지 않고 각자의 자율성과 리듬을 존중할 때 전체가 더 단단해짐',
    tone: '여러 골짜기와 도시의 깃발이 서로의 색을 해치지 않고 나란히 바람에 나부끼는 풍경',
    action: '오늘 내가 다 챙기려던 일 중 믿고 맡길 수 있는 한 가지는 상대의 방식과 리듬을 존중하며 넘겨 보세요.',
    question: '내가 모든 것을 한 손에 쥐려 하기보다 상대나 환경의 고유한 리듬을 인정할 때 더 단단해질 협력은 무엇인가요?',
  },
  {
    motif: '사막 바람의 활시위(Bowstring Poise · 팽팽함과 이완 사이에서 가장 고른 탄성을 유지함)',
    insight: '늘 당겨져 있는 활시위는 금세 약해지니, 놓아야 할 때 힘을 빼는 감각이 오히려 정확도를 높임',
    tone: '해 질 녘 능선 위로 붉은 노을이 번지며 팽팽했던 공기가 부드럽게 가라앉는 순간',
    action: '오늘 꼭 힘을 써야 할 핵심 한 가지를 뺀 나머지 자잘한 걱정에서는 어깨의 힘을 의식적으로 빼 보세요.',
    question: '지금 내가 놓아야 할 때를 지나쳐 계속 당기고 있느라 오히려 탄성을 잃어 가고 있는 활시위는 무엇인가요?',
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

export function calculateParthianNisaArcheryPoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ParthianNisaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-PARTHIAN-NISA-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    nisaMotif: picked.motif,
    companionMotif: companion.motif,
    parthianInsight: picked.insight,
    steppeTone: picked.tone,
    reflectionFocus: `파르티아 니사·기병 화살 조화의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 정면으로만 밀어붙이지 말고 물러남과 선회의 여유 속에서 진짜 목표를 조준해 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 파르티아 니사의 교차로 지혜·파르티안 샷의 유연한 균형 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatParthianNisaPrompt(res: ParthianNisaResult): string {
  return [
    `[파르티아 니사·기병 화살 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 니사 모티프: ${res.nisaMotif} (${res.steppeTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.parthianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
