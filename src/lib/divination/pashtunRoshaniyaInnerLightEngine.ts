import type { UserProfile } from '../sharedState';

export interface PashtunRoshaniyaResult {
  engineVersion: string;
  calculatedAtKst: string;
  roshaniyaLamp: string;
  pashtunInsight: string;
  hinduKushTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LAMPS = [
  { lamp: '로샤니(Roshani · 어둠을 가르는 내면의 맑은 등불)', insight: '바깥의 소문이나 평가가 어지러울수록 내 안의 양심과 명료한 기준을 등불 삼는 태도', tone: '힌두쿠시 고개 새벽하늘 아래 반짝이는 맑은 별빛' },
  { lamp: '호자라(Hujra · 길손을 반기는 열린 사랑방)', insight: '마음의 문을 굳게 걸어 잠그기보다 따뜻한 환대와 여유를 남겨 둘 때 찾아오는 좋은 인연', tone: '흙벽 마당에 깔린 붉은 양탄자와 따뜻한 카와 녹차 향' },
  { lamp: '쿠샬 한 카탁(Khushal Khan Khattak)의 매 · 높이 나는 시선', insight: '자잘한 시비에 발목 잡히지 않고 더 높고 넓은 목표를 향해 날개를 펴는 당당함', tone: '가파른 협곡 위로 시원하게 솟아오르는 아침 바람' },
  { lamp: '난와타이(Nanawatai · 갈등을 멈추고 화해로 여는 문)', insight: '지나간 서운함을 끝까지 붙들기보다 먼저 화해와 양보의 손을 내밀 줄 아는 큰 그릇', tone: '저녁 노을이 내려앉은 고요한 계곡 마을의 흙길' },
  { lamp: '라흐만 바바(Rahman Baba)의 겸손한 꽃밭', insight: '가시를 세워 남을 찌르기보다 묵묵히 제 자리에서 향기를 내는 사람이 결국 오래 기억됨', tone: '봄비가 내린 뒤 들판에 피어난 야생 튤립의 맑은 빛깔' },
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

export function calculatePashtunRoshaniyaInnerLight(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PashtunRoshaniyaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % LAMPS.length;
  const picked = LAMPS[idx];

  return {
    engineVersion: 'LUCKEY-PASHTUN-ROSHANIYA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    roshaniyaLamp: picked.lamp,
    pashtunInsight: picked.insight,
    hinduKushTone: picked.tone,
    reflectionFocus: `파슈툰 시학과 로샤니야 철학의 '${picked.lamp}'처럼, 바깥의 평가에 흔들리기 전에 내 안의 맑은 등불이 무엇을 비추는지 먼저 들여다보세요.`,
    ritualAction: '오늘 누군가에게 건네는 말 한마디에 가시 대신 따뜻한 환대(호자라)의 온기를 담아 보세요.',
    reflectiveQuestion: '남들의 시선이나 자존심을 내려놓고 나면, 지금 내 안에서 가장 맑게 빛나고 있는 진심은 무엇인가요?',
    interpretiveBoundary: '파슈툰(Pashtun) 로샤니야 내면의 빛 사상과 라흐만 바바·쿠샬 한 시학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPashtunRoshaniyaPrompt(res: PashtunRoshaniyaResult): string {
  return [
    `[파슈툰 로샤니야·내면의 빛 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 빛의 상징: ${res.roshaniyaLamp} (${res.hinduKushTone})`,
    `- 중심 통찰: ${res.pashtunInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
