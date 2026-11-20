import type { UserProfile } from '../sharedState';

export interface LycianCliffResult {
  engineVersion: string;
  calculatedAtKst: string;
  lycianMotif: string;
  lycianInsight: string;
  cliffTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '미라의 암벽 회랑(Myra Cliff · 깎아지른 석회암 바위에 기둥을 깎아 올려 하늘과 마주함)', insight: '변화무쌍한 세상 속에서도 바위에 새긴 듯한 내면의 기준 하나가 있으면 쉽게 흔들리지 않음', tone: '남부 아나톨리아의 밝은 석회암 절벽 위로 지중해의 푸른 바람이 스쳐 가는 오전' },
  { motif: '리키아의 긴 능선 길(Lycian Way · 소나무 숲과 코발트빛 바다가 번갈아 나타나는 오솔길)', insight: '오르막이 길다고 느껴질 때 고개를 들면, 어느새 굽이 너머에 탁 트인 바다가 기다리고 있음', tone: '솔향기 짙은 바위 능선 너머로 눈부신 지중해 수평선이 열리는 한낮' },
  { motif: '아폴론 해안의 물빛(Sunken Coast · 잠긴 돌계단 위로 맑은 바닷물이 유리처럼 비침)', insight: '지나간 시간이나 아쉬운 선택도 맑은 시선으로 바라보면 오늘을 비추는 고요한 거울이 됨', tone: '잔잔한 만 안쪽 투명한 물 아래 옛 돌담이 고요히 비쳐 보이는 오후' },
  { motif: '연맹의 수평 합의(Lycian League · 크고 작은 성읍들이 크기에 맞게 뜻을 모아 균형을 잡음)', insight: '내 안의 큰 욕심과 작은 현실 사이의 목소리를 고르게 들을 때 가장 무리 없는 결정이 나옴', tone: '둥근 원형 회의장 돌계단 위로 따뜻한 석양이 고르게 내려앉는 저녁' },
  { motif: '절벽 위 올리브 나무(Cliffside Olive · 얇은 흙층에서도 바위 틈에 뿌리를 내려 열매를 맺음)', insight: '환경이 넉넉하지 않아 보여도 지금 발 디딘 자리에서 낼 수 있는 몫의 열매는 분명히 있음', tone: '하얀 바위 틈에서 은빛 잎을 반짝이며 바람을 견디는 오래된 올리브 나무' },
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

export function calculateLycianCliffHorizonCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): LycianCliffResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-LYCIAN-CLIFF-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    lycianMotif: picked.motif,
    lycianInsight: picked.insight,
    cliffTone: picked.tone,
    reflectionFocus: `리키아 암벽 지평선의 '${picked.motif}'처럼, 오르막의 숨이 가쁠수록 잠시 시선을 들어 능선 너머의 바다를 바라보세요.`,
    ritualAction: '오늘 하루 중 창밖이나 먼 곳을 바라보며 눈과 어깨의 긴장을 푸는 1분을 꼭 가져 보세요.',
    reflectiveQuestion: '지금 내가 오르고 있는 오르막에서 고개를 들면 보일 넓은 수평선은 무엇일까요?',
    interpretiveBoundary: '고대 아나톨리아 리키아의 암벽·해안 능선 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatLycianCliffPrompt(res: LycianCliffResult): string {
  return [
    `[리키아·암벽 지평선 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 리키아 모티프: ${res.lycianMotif} (${res.cliffTone})`,
    `- 중심 통찰: ${res.lycianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
