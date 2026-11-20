import type { UserProfile } from '../sharedState';

export interface EvenkiBugaResult {
  engineVersion: string;
  calculatedAtKst: string;
  taigaSign: string;
  bugaInsight: string;
  siberianTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  { sign: '부가(Buga · 모든 생명이 이어진 살아 있는 숲의 질서)', insight: '내가 혼자 길을 뚫고 가는 것 같아도 주변 환경과 조화를 이룰 때 길이 자연스럽게 열림', tone: '시베리아 타이가 침엽수림 사이로 부드럽게 스며드는 낮고 맑은 햇살' },
  { sign: '순록의 뿔과 발자국(눈밭에서도 방향을 잃지 않는 세심함)', insight: '큰 지도만 바라보지 않고 눈앞의 작은 흔적과 변화의 신호를 놓치지 않을 때 길을 찾음', tone: '하얀 자작나무 숲 눈밭 위로 선명하게 이어진 순록 떼의 발자국' },
  { sign: '춤(Chum · 언제든 접고 펼 수 있는 가벼운 쉼터)', insight: '무거운 집착을 쌓아 두지 않고 변화에 맞춰 유연하게 자리를 옮길 수 있는 가벼움이 힘임', tone: '자작나무 껍질 천막 안에서 모닥불을 쬐며 차를 끓이는 평온한 밤' },
  { sign: '니마트(Nimāt · 사냥한 것을 먼저 이웃과 나누는 규칙)', insight: '오늘 얻은 작은 성취나 행운을 나 혼자 독점하지 않고 나눌 때 공동체가 함께 살아남음', tone: '긴 겨울을 함께 버텨 내며 따뜻한 수프를 나누는 타이가의 유목민들' },
  { sign: '이케엔(Ikeen · 계절의 부름을 따라 움직이는 순응)', insight: '고집스럽게 한 계절에 머무르기보다 바람과 물이 바뀌는 때를 알아차리고 발걸음을 뗌', tone: '얼었던 시베리아 강물이 녹아내리며 다시 흐르기 시작하는 봄의 소리' },
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

export function calculateEvenkiBugaTaigaPath(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): EvenkiBugaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const picked = SIGNS[idx];

  return {
    engineVersion: 'LUCKEY-EVENKI-BUGA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    taigaSign: picked.sign,
    bugaInsight: picked.insight,
    siberianTone: picked.tone,
    reflectionFocus: `시베리아 에벤키 지혜의 '${picked.sign}'처럼, 무거운 집착을 덜어내고 눈앞의 작은 신호를 세심히 읽으며 유연하게 방향을 잡아 보세요.`,
    ritualAction: '오늘 내가 당연하게 지나쳤던 주변의 작은 변화나 신호 하나를 가만히 관찰하고 기록해 보세요.',
    reflectiveQuestion: '지금 내가 무겁게 끌어안고 있는 방식 대신, 가볍고 유연하게 자리를 옮길 수 있는 선택지는 무엇일까요?',
    interpretiveBoundary: '시베리아 에벤키(Evenki)의 부가(Buga) 자연 공존·니마트(Nimāt) 나눔 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatEvenkiBugaPrompt(res: EvenkiBugaResult): string {
  return [
    `[에벤키 부가·타이가 길잡이 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 타이가 상징: ${res.taigaSign} (${res.siberianTone})`,
    `- 중심 통찰: ${res.bugaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
