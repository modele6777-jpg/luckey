import type { UserProfile } from '../sharedState';

export interface GayaIronCrownResult {
  engineVersion: string;
  calculatedAtKst: string;
  gayaMotif: string;
  gayaInsight: string;
  riverTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '불꽃과 쇠망치의 절도(Forge Discipline · 달군 쇠를 두드리되 식힐 때를 알아 단단히 벼림)', insight: '열정이 높을수록 식히는 시간과 멈춤의 절도가 함께 있어야 흔들리지 않는 단단함이 나옴', tone: '김해 평야의 맑은 바람 사이로 대장간의 은은한 숯불이 일정한 숨을 쉬는 아침' },
  { motif: '굽다리 접시의 균형(Pedestal Pottery · 가느다란 굽 위에서도 넓은 상판을 흔들림 없이 받침)', insight: '기초가 되는 마음의 중심이 반듯하면 겉의 짐이 조금 넓어져도 쉽게 기울지 않음', tone: '회청색 토기 표면 위로 매끄러운 물레 자국이 고요히 돌아가는 작업실' },
  { motif: '낙동강 하구의 뱃길(Estuary Channel · 민물과 바닷물이 만나며 여러 갈래 길을 열어 줌)', insight: '서로 다른 성격의 일이나 사람이 만날 때 경계를 닫기보다 소통의 물길을 트면 흐름이 커짐', tone: '강물이 바다로 풀리며 은빛 물결이 완만하게 퍼져 나가는 이른 오후' },
  { motif: '가야금 열두 줄의 울림(Twelve Strings · 저마다 다른 줄이 어우러져 하나의 여운을 남김)', insight: '내 안의 다양한 감정과 역할을 하나로 억누르기보다 각각의 제 음색을 인정할 때 편안해짐', tone: '나무 공명통을 타고 맑고 둥근 현 소리가 바람 끝으로 번지는 저녁' },
  { motif: '풀잎 금관의 부드러운 선(Grass-Leaf Crown · 날카로운 위엄보다 유연한 곡선으로 품격을 세움)', insight: '굳이 목소리를 높이거나 날을 세우지 않아도 단정한 태도만으로 충분한 힘이 전해짐', tone: '황금빛 세공 장식이 미세한 빛을 받아 부드럽게 반짝이는 고요한 전당' },
];

function formatKstIso(date: Date): string {
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

export function calculateGayaIronCrownRiverHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GayaIronCrownResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-GAYA-IRON-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    gayaMotif: picked.motif,
    gayaInsight: picked.insight,
    riverTone: picked.tone,
    reflectionFocus: `가야 금관·철기 조화의 '${picked.motif}'처럼, 열정과 식힘의 절도를 맞추며 부드럽고 단정한 중심을 세워 보세요.`,
    ritualAction: '오늘 한 가지 일을 마친 뒤 바로 다음 일로 넘어가지 말고, 2분 정도 숨을 식히는 짧은 틈을 두세요.',
    reflectiveQuestion: '지금 내가 식힐 틈 없이 계속 달구기만 해서 오히려 쇠가 무뎌지고 있는 영역은 어디인가요?',
    interpretiveBoundary: '고대 가야의 철기 제련·토기 균형·가야금 조화 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGayaIronCrownPrompt(res: GayaIronCrownResult): string {
  return [
    `[가야·금관 철기 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 가야 모티프: ${res.gayaMotif} (${res.riverTone})`,
    `- 중심 통찰: ${res.gayaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
