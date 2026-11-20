import type { UserProfile } from '../sharedState';

export interface DogonAmmaNommoResult {
  engineVersion: string;
  calculatedAtKst: string;
  starPhase: string;
  nommoInsight: string;
  cliffTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PHASES = [
  { phase: '시리우스(Sigi Tolo)의 기다림과 주기', insight: '서두르지 않고 큰 흐름이 제자리에 돌아올 때까지 내 궤도를 지키는 인내의 지혜', tone: '반디아agara 절벽 위 밤하늘의 차분한 별빛' },
  { phase: '노모(Nommo)의 맑은 말과 물의 조화', insight: '거친 말 대신 마음을 적시는 솔직하고 부드러운 언어로 관계를 푸는 힘', tone: '건기 끝에 밭을 적시는 첫 비의 선율' },
  { phase: '카나가(Kanaga) 가면의 하늘·땅 연결', insight: '이상과 현실의 간극을 좁혀 오늘 내 손끝의 행동으로 이어 내는 균형', tone: '붉은 사암 흙벽과 나무 기둥의 단단한 울림' },
  { phase: '포 토로(Po Tolo) 작은 씨앗의 밀도', insight: '겉으로 작아 보여도 내 안에 응축된 진심과 실력이 때를 만나 피어나는 이치', tone: '새벽 이슬 머금은 좁쌀 알갱이의 고요한 빛' },
  { phase: '토구나(Toguna) 낮은 지붕의 지혜', insight: '화를 내며 일어서면 머리가 닿는 낮은 지붕 아래 앉아 차분히 대화를 마치는 절제', tone: '바오밥 나무 그늘 아래 돌기둥 쉼터의 미풍' },
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

export function calculateDogonAmmaNommoHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): DogonAmmaNommoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PHASES.length;
  const picked = PHASES[idx];

  return {
    engineVersion: 'LUCKEY-DOGON-AMMA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    starPhase: picked.phase,
    nommoInsight: picked.insight,
    cliffTone: picked.tone,
    reflectionFocus: `도곤 우주관의 '${picked.phase}'처럼, 당장 겉모습을 재촉하기보다 내 말과 태도의 결을 먼저 고르게 다듬어 보세요.`,
    ritualAction: '오늘 대화 중 감정이 올라오는 순간이 오면 한 박자 쉬고 물 한 모금을 마신 뒤 차분히 말해 보세요.',
    reflectiveQuestion: '지금 내 마음속에서 조용히 영글고 있지만 아직 조급함 때문에 기다려 주지 못한 씨앗은 무엇인가요?',
    interpretiveBoundary: '서아프리카 말리 도곤 전통의 우주 질서와 공동체 대화 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatDogonAmmaNommoPrompt(res: DogonAmmaNommoResult): string {
  return [
    `[도곤 암마·노모 우주 질서 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 별자리 위상: ${res.starPhase} (${res.cliffTone})`,
    `- 중심 통찰: ${res.nommoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
