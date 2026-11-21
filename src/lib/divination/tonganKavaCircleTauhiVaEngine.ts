import type { UserProfile } from '../sharedState';

export interface TonganKavaResult {
  engineVersion: string;
  calculatedAtKst: string;
  vaPractice: string;
  companionPractice: string;
  circleInsight: string;
  oceanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRACTICES = [
  {
    practice: '타우히 바(Tauhi vā) 사이의 공간 돌보기',
    insight: '나와 상대 사이의 보이지 않는 거리와 온도를 정성껏 알맞게 지키는 지혜',
    tone: '남태평양 산호초의 맑은 청록빛',
    action: '오늘 마주치는 사람이나 스스로에게 급한 판단 대신 한 박자 여유 있는 따뜻한 눈빛을 건네 보세요.',
    question: '지금 나와 소중한 사람들 사이의 공간(vā)에는 어떤 온도와 배려가 가장 필요할까요?',
  },
  {
    practice: '파잉아(Faikava) 둥근 원의 경청',
    insight: '서열이나 잘잘못을 따지기 전에 둥글게 둘러앉아 서로의 이야기를 들어주는 품격',
    tone: '코코넛 껍질 잔을 나누는 저녁 평온',
    action: '오늘 누군가의 이야기를 들을 때 내 반박이나 해법을 보태기 전 끝까지 고개 끄덕이며 들어 주세요.',
    question: '잘잘못을 가리기 전에 둥글게 앉아 마음을 열고 먼저 들어 주고 싶은 사람은 누구인가요?',
  },
  {
    practice: '파카아파아파(Fakaʻapaʻapa) 깊은 존중',
    insight: '말투와 태도에 작은 예의를 담아 상대와 나 자신의 품위를 함께 지키는 힘',
    tone: '부드럽게 밀려오는 밀물의 숨결',
    action: '가까운 사이일수록 오늘 인사나 부탁 끝에 다정한 감사 한 마디를 의식적으로 붙여 보세요.',
    question: '말투와 태도에 작은 예의를 보탤 때 상대와 나의 품위가 함께 살아날 자리는 어디인가요?',
  },
  {
    practice: '로토 토(Loto tō) 겸허한 내려놓음',
    insight: '완벽해 보이려 애쓰는 긴장을 풀고 있는 그대로의 진심을 편안히 내보이기',
    tone: '야자수 아래 시원한 그늘',
    action: '완벽하게 해내려 어깨에 힘을 주던 일 하나에서 오늘 "이 정도면 충분하다"는 숨 고르기를 허락해 주세요.',
    question: '완벽해 보이려 애쓰는 긴장을 조금 내려놓으면 훨씬 편안하고 진실해질 내 모습은 무엇인가요?',
  },
  {
    practice: '마마히이(Mamahiʻi meʻa) 끝까지 지켜내는 성실',
    insight: '내가 소중히 여기는 인연과 약속을 말없이 꾸준히 돌보는 단단함',
    tone: '잔잔한 수평선 위 첫 별빛',
    action: '소중히 여겨 온 인연이나 꾸준한 루틴 하나에 오늘 5분이라도 변함없는 손길을 건네 보세요.',
    question: '거창한 말 없이도 오늘 내가 변함없이 꾸준히 돌보며 지켜 내고 싶은 인연과 약속은 무엇인가요?',
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

export function calculateTonganKavaCircleTauhiVa(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TonganKavaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRACTICES.length;
  const picked = PRACTICES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRACTICES.length - 1));
  const companion = PRACTICES[(idx + companionOffset) % PRACTICES.length];

  return {
    engineVersion: 'LUCKEY-TONGAN-KAVA-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    vaPractice: picked.practice,
    companionPractice: companion.practice,
    circleInsight: picked.insight,
    oceanTone: picked.tone,
    reflectionFocus: `통가의 '${picked.practice}'을 중심에 두고 '${companion.practice}'의 결을 곁들여, 사람과 사람 사이의 간격이 너무 멀지도 가깝지도 않게 따뜻한 여백을 돌보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '폴리네시아 통가 카바 서클과 타우히 바(Tauhi vā) 관계 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTonganKavaPrompt(res: TonganKavaResult): string {
  return [
    `[통가 카바 서클·타우히 바 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 관계 원리: ${res.vaPractice} (${res.oceanTone})`,
    `- 동반 원리: ${res.companionPractice}`,
    `- 중심 통찰: ${res.circleInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
