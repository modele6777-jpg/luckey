import type { UserProfile } from '../sharedState';

export interface ChuvashTuraResult {
  engineVersion: string;
  calculatedAtKst: string;
  chuvashSign: string;
  turaInsight: string;
  volgaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  { sign: '키레메트(Kiremet · 맑은 숲과 샘의 조화)', insight: '자연의 순리를 억지로 거스르지 않고 조심스레 존중할 때 찾아오는 고요한 평화', tone: '볼가 강 중류 자작나무와 참나무 숲 사이의 맑은 샘터' },
  { sign: '투라(Tură)의 햇살 · 만물을 비추는 공정한 빛', insight: '편견 없이 상황을 있는 그대로 바라볼 때 비로소 보이는 명료한 해결의 실마리', tone: '안개 걷힌 볼가 강변 언덕 위로 비치는 고요한 아침 햇살' },
  { sign: '시클레브(Săkhlev · 정갈하게 수놓은 매듭의 질서)', insight: '한 땀 한 땀 정성을 들여 엮은 질서가 겉보기보다 훨씬 오래 가는 단단한 힘을 만듦', tone: '하얀 리넨 위에 붉은 실로 정교하게 놓인 기하학 자수' },
  { sign: '아카투이(Akatuy · 대지와 쟁기가 어우러진 봄의 약속)', insight: '씨앗을 뿌리는 수고와 결실을 기다리는 인내가 하나로 만나는 성실한 순환', tone: '봄비가 적신 검은 흙 위로 올라오는 연한 새싹의 기운' },
  { sign: '실트(Sălt · 조상의 지혜가 담긴 맑은 이야기)', insight: '내가 처음 겪는 듯한 막막함도 앞선 이들의 지혜를 빌리면 한결 가벼워짐', tone: '저녁 식탁에 둘러앉아 나누는 담백하고 따뜻한 옛이야기' },
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

export function calculateChuvashTuraWorldTreeBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChuvashTuraResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const picked = SIGNS[idx];

  return {
    engineVersion: 'LUCKEY-CHUVASH-TURA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    chuvashSign: picked.sign,
    turaInsight: picked.insight,
    volgaTone: picked.tone,
    reflectionFocus: `볼가 추바시 자연 철학의 '${picked.sign}'처럼, 한 땀씩 정갈하게 순서를 밟아 나가는 성실함 속에서 고요한 질서를 세워 보세요.`,
    ritualAction: '오늘 내 책상이나 주변 공간 한 곳을 깔끔하게 정돈하며 생각의 질서도 함께 가다듬어 보세요.',
    reflectiveQuestion: '서두르느라 건너뛴 순서를 차분히 한 땀씩 다시 짚어 본다면, 지금 가장 먼저 정돈할 일은 무엇인가요?',
    interpretiveBoundary: '볼가 강 중류 추바시(Chuvash)의 투라(Tură) · 키레메트 자연 조화와 전통 자수 질서 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChuvashTuraPrompt(res: ChuvashTuraResult): string {
  return [
    `[추바시 투라·세계수 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 추바시 상징: ${res.chuvashSign} (${res.volgaTone})`,
    `- 중심 통찰: ${res.turaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
