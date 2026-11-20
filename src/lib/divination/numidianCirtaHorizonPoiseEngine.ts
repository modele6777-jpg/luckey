import type { UserProfile } from '../sharedState';

export interface NumidianCirtaResult {
  engineVersion: string;
  calculatedAtKst: string;
  cirtaMotif: string;
  numidianInsight: string;
  plateauTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '루멜 협곡의 자연 다리(Rhumel Gorge · 깊은 벼랑 사이를 잇는 단단한 바위 아치)', insight: '서로 멀어 보이는 두 영역이나 사람 사이에도 잘 살펴보면 자연스럽게 건널 수 있는 다리가 있음', tone: '깎아지른 듯한 석회암 협곡 위로 아침 안개가 걷히며 웅장한 바위 다리가 드러나는 풍경' },
  { motif: '키르타 천문대의 지평선(Cirta Horizon · 사막의 열기와 바다의 바람이 만나는 경계선)', insight: '극단적인 두 기운이 만나는 경계에 설수록 한쪽으로 치우치지 않는 균형 감각이 빛을 발함', tone: '북아프리카 고원 끝에서 지중해 쪽 푸른 구름과 내륙의 황금빛 햇살이 나란히 비치는 낮' },
  { motif: '누미디아 기병의 가벼운 고삐(Light Rein · 무거운 갑옷 대신 민첩한 방향 전환을 택함)', insight: '모든 조건을 완벽히 갖추려다 무거워지기보다, 가볍게 출발해 상황에 맞춰 틀 수 있는 유연함이 강점임', tone: '고원 초원을 따라 먼지를 적게 일으키며 가볍고 빠르게 방향을 바꾸는 말발굽 소리' },
  { motif: '메드라센의 계단식 둥근 탑(Medracen Dome · 둥근 지평선 위에 차분히 쌓아 올린 돌의 질서)', insight: '큰 계획도 결국은 오늘 내 발밑에 놓인 돌 하나를 반듯하게 올려놓는 일에서 완성됨', tone: '넓은 고원 한가운데 기하학적인 선을 그리며 조용히 서 있는 고대 석조 원형 기념물' },
  { motif: '올리브와 삼나무의 공생(Olive & Cedar · 메마른 땅에서도 뿌리를 깊이 내려 그늘을 만듦)', insight: '척박해 보이는 시기일수록 겉가지보다 땅속 깊은 뿌리를 내리는 데 시간을 쓰면 오래 버팀', tone: '은빛 올리브 잎이 바람에 흔들리며 고대 성벽 아래 서늘한 그늘을 드리우는 오후' },
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

export function calculateNumidianCirtaHorizonPoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NumidianCirtaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-NUMIDIAN-CIRTA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    cirtaMotif: picked.motif,
    numidianInsight: picked.insight,
    plateauTone: picked.tone,
    reflectionFocus: `누미디아 키르타 지평선의 '${picked.motif}'처럼, 무거운 조건을 다 갖추려 애쓰기보다 가벼운 고삐와 균형 잡힌 시야로 한 걸음을 옮겨 보세요.`,
    ritualAction: '오늘 미루고 있던 일 하나를 가장 가벼운 첫 단계로 쪼개서 부담 없이 시작해 보세요.',
    reflectiveQuestion: '완벽한 준비를 기다리느라 고삐를 너무 꽉 쥐고 있어서, 정작 가볍게 건널 수 있는 다리를 놓치고 있지는 않나요?',
    interpretiveBoundary: '고대 북아프리카 누미디아 키르타의 협곡·지평선 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNumidianCirtaPrompt(res: NumidianCirtaResult): string {
  return [
    `[누미디아 키르타·천문 지평선 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 키르타 모티프: ${res.cirtaMotif} (${res.plateauTone})`,
    `- 중심 통찰: ${res.numidianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
