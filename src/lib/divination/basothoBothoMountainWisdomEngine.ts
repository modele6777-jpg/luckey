import type { UserProfile } from '../sharedState';

export interface BasothoBothoResult {
  engineVersion: string;
  calculatedAtKst: string;
  mountainSign: string;
  bothoInsight: string;
  highlandTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  { sign: '보토(Botho · 사람됨의 따뜻한 품위)', insight: '내가 바쁜 순간일수록 말 한마디와 태도의 온도를 잃지 않을 때 신뢰가 지켜지는 이치', tone: '드라켄즈버그 고원 아침에 두른 두꺼운 바소토 담요의 온기' },
  { sign: '코촐로(Khotso · 다툼을 가라앉히는 평화)', insight: '이기는 논리보다 관계가 다치지 않고 함께 건널 수 있는 출구를 먼저 찾는 성숙함', tone: '맑은 산골짜기 시냇물 위로 내리는 고요한 오후의 비' },
  { sign: '모코로틀로(Mokorotlo · 흔들리지 않는 고원의 갓)', insight: '바깥의 변덕스러운 평가에도 내 중심과 단정한 품격을 지키는 고요한 자존감', tone: '구름 위 능선에 우뚝 솟은 말루티(Maluti) 산봉우리' },
  { sign: '레츠마(Letsema · 함께 밭을 가는 품앗이)', insight: '어려운 일일수록 혼자의 완벽주의를 내려놓고 곁의 사람과 손을 보탤 때 가벼워지는 힘', tone: '황금빛 옥수수 밭 사이로 이어진 마을 사람들의 발걸음' },
  { sign: '푸라(Pula · 마른 땅을 적시는 단비)', insight: '당장 눈에 띄지 않는 작은 배려와 인내가 결국 가장 필요한 때에 싹을 틔우는 흐름', tone: '긴 건기 끝에 붉은 고원을 적시는 시원한 첫 빗줄기' },
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

export function calculateBasothoBothoMountainWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BasothoBothoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const picked = SIGNS[idx];

  return {
    engineVersion: 'LUCKEY-BASOTHO-BOTHO-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    mountainSign: picked.sign,
    bothoInsight: picked.insight,
    highlandTone: picked.tone,
    reflectionFocus: `남아프리카 바소토의 '${picked.sign}'처럼, 오늘의 선택에서 결과의 크기만큼이나 내 태도의 따뜻함과 품위를 함께 챙겨 보세요.`,
    ritualAction: '오늘 대화나 메시지를 보낼 때 상대방의 입장을 한 문장만 더 헤아린 뒤 부드럽게 건네 보세요.',
    reflectiveQuestion: '지금 내가 조급함 때문에 놓치고 있는 부드러운 한마디나 상대방의 마음은 무엇인가요?',
    interpretiveBoundary: '남아프리카 바소토(Basotho) 전통의 보토(Botho)·평화(Khotso) 공동체 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBasothoBothoPrompt(res: BasothoBothoResult): string {
  return [
    `[바소토 보토·고원 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 고원 상징: ${res.mountainSign} (${res.highlandTone})`,
    `- 중심 통찰: ${res.bothoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
