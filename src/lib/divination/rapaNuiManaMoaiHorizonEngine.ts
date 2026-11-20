import type { UserProfile } from '../sharedState';

export interface RapaNuiMoaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  moaiFocus: string;
  manaInsight: string;
  pacificHorizonTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const FOCUSES = [
  { focus: '아후의 시선(Ahu · 바다가 아닌 내 터전과 사람을 바라봄)', insight: '먼 곳의 동경보다 지금 내가 발 딛고 선 자리와 소중한 이들을 살피는 데 진정한 힘이 있음', tone: '남태평양의 푸른 수평선을 등지고 마을 초원을 묵묵히 지키는 모아이의 시선' },
  { focus: '마나(Mana · 억지 과시가 아닌 내면에서 배어 나오는 묵직한 힘)', insight: '요란하게 드러내지 않아도 스스로를 다스릴 줄 아는 사람에게서 자연스레 신뢰가 우러남', tone: '라노 라라쿠(Rano Raraku) 화산 응회암에 새겨진 깊고 흔들리지 않는 윤곽' },
  { focus: '타푸(Tapu · 소중한 것을 함부로 대하지 않는 절제와 경계)', insight: '무엇이든 다 취하려 들지 않고 지켜야 할 선을 분명히 할 때 오히려 삶이 풍요로워짐', tone: '오롱고 절벽 아래로 부서지는 맑고 장엄한 남태평양의 파도' },
  { focus: '롱고롱고(Rongorongo · 세대를 넘어 뜻을 새기는 기억의 결)', insight: '지나가는 감정에 휩쓸리지 않고 내가 진짜 남기고 싶은 이야기의 결을 차분히 정리함', tone: '해 질 녘 아나케나 해변 야자수 사이로 스며드는 황금빛 노을' },
  { focus: '하나우 마마우(Hana Mau · 한정된 자리에서 지혜롭게 나누는 공존)', insight: '가진 자원이 무한하지 않음을 알기에 지금 내게 주어진 여건을 아끼고 알뜰히 돌봄', tone: '섬의 맑은 바람과 푸른 풀밭이 맞닿은 고요한 대지의 호흡' },
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

export function calculateRapaNuiManaMoaiHorizon(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): RapaNuiMoaiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % FOCUSES.length;
  const picked = FOCUSES[idx];

  return {
    engineVersion: 'LUCKEY-RAPANUI-MOAI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    moaiFocus: picked.focus,
    manaInsight: picked.insight,
    pacificHorizonTone: picked.tone,
    reflectionFocus: `라파 누이 지혜의 '${picked.focus}'처럼, 바깥의 시선을 쫓기보다 지금 내 자리와 소중한 이들을 지키는 묵직한 중심을 세워 보세요.`,
    ritualAction: '오늘 하루 동안 바깥의 비교를 잠시 끄고, 지금 내가 돌보고 있는 가장 가까운 일 하나에 온전히 마음을 기울여 보세요.',
    reflectiveQuestion: '지금 내가 수평선 너머의 막연한 비교에 시선을 빼앗기고 있다면, 다시 돌아보아야 할 내 안의 터전은 어디인가요?',
    interpretiveBoundary: '남태평양 라파 누이(이스터 섬)의 모아이 보호 시선·마나(Mana)·타푸(Tapu) 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatRapaNuiMoaiPrompt(res: RapaNuiMoaiResult): string {
  return [
    `[라파 누이 마나·모아이 수평선 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 수호 시선: ${res.moaiFocus} (${res.pacificHorizonTone})`,
    `- 중심 통찰: ${res.manaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
