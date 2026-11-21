import type { UserProfile } from '../sharedState';

export interface SillaEmilleResult {
  engineVersion: string;
  calculatedAtKst: string;
  gyeongjuMotif: string;
  companionMotif: string;
  sillaInsight: string;
  dawnTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '첨성대의 창문(Cheomseongdae Window · 돌을 둥글게 쌓아 하늘의 절기를 가만히 헤아림)',
    insight: '서두른다고 별이 빨리 뜨지 않으니, 정해진 자리에서 차분히 흐름을 관찰하는 눈이 먼저임',
    tone: '경주 들판의 새벽 안개 위로 27단 화강암이 단아한 곡선으로 서 있는 첨성대',
    action: '오늘 성급히 판단할 사안 앞에서 바로 결론짓지 말고, 하루의 흐름을 한 박자만 더 관찰해 보세요.',
    question: '서둘러 결론을 내리기보다 정해진 자리에서 차분히 흐름을 지켜보아야 할 일은 무엇인가요?',
  },
  {
    motif: '에밀레종의 여운(Emille Bell · 한 번의 울림 뒤에 길고 맑게 퍼지는 맥놀이)',
    insight: '큰 소리보다 오래 남는 것은 깊이와 진정성이며, 여운이 잦아드는 시간도 울림의 일부임',
    tone: '산 능선을 따라 몇 번이고 되돌아오며 마음의 결을 고르게 씻어 내리는 은은한 종소리',
    action: '크게 말하거나 급히 반응하기보다 진심을 담은 짧은 문장 하나를 여운 있게 건네 보세요.',
    question: '당장의 큰 소리보다 길고 맑은 여운으로 남기고 싶은 나의 태도와 진정성은 무엇인가요?',
  },
  {
    motif: '안압지 물그림자(Wolji Reflection · 달빛과 처마를 그대로 비추어 주는 고요한 수면)',
    insight: '마음의 수면이 흔들리면 작은 일도 일그러져 보이니, 답을 찾기 전에 물결부터 가라앉혀야 함',
    tone: '잔바람마저 멎은 밤 연못 위로 황금빛 누각과 둥근 달이 나란히 비치는 풍경',
    action: '오늘 결정해야 할 일 앞에서 바로 답을 내리지 말고, 물그림자가 잦아들 때까지 딱 1분만 숨을 고르세요.',
    question: '지금 내 마음의 수면이 흔들려 크게만 보이는 일 중에서, 고요히 가라앉히고 다시 보면 훨씬 단아해질 것은 무엇인가요?',
  },
  {
    motif: '석굴암의 아치(Seokguram Vault · 서로 기대어 쐐기처럼 맞물려 천 년을 버티는 힘)',
    insight: '혼자 모든 무게를 지려 하면 금세 금이 가지만, 곁의 사람과 균형을 맞추면 오래 버팀',
    tone: '토함산 동쪽 해돋이를 기다리며 정교한 돌들이 빈틈없이 어우러진 고요한 석실',
    action: '혼자 떠안고 있던 일 하나를 곁의 동료나 가족과 나누어 균형을 맞춰 보세요.',
    question: '혼자 버티느라 금이 가기 전에, 곁의 사람과 아치처럼 서로 기대어 맞물릴 수 있는 일은 무엇인가요?',
  },
  {
    motif: '포석정의 물길(Poseokjeong Stream · 급히 꺾이지 않고 굽이굽이 돌아 흐르는 여유)',
    insight: '직선으로만 가려 하면 부딪히기 쉬우니, 돌아가는 곡선 속에서 생각과 숨을 고를 줄 알아야 함',
    tone: '소나무 그늘 아래 구불구불한 돌 홈을 따라 맑은 물이 천천히 흐르는 정원',
    action: '막힌 일정이나 대화를 억지로 직선 돌파하려 하지 말고, 한 굽이 돌아가는 여유를 허용해 보세요.',
    question: '직선으로만 밀어붙이다 부딪히던 자리에서, 한 굽이 돌아 흐르며 숨을 고를 수 있는 길은 어디인가요?',
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

export function calculateSillaEmilleCheomseongdae(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SillaEmilleResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-SILLA-EMILLE-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    gyeongjuMotif: picked.motif,
    companionMotif: companion.motif,
    sillaInsight: picked.insight,
    dawnTone: picked.tone,
    reflectionFocus: `신라 첨성대·에밀레 여명 지혜의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 겉의 조급함을 내려놓고 고요한 관찰과 길고 맑은 여운의 호흡을 회복해 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '한국 신라의 첨성대 천문 관찰·에밀레종 여운·안압지 수면 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSillaEmillePrompt(res: SillaEmilleResult): string {
  return [
    `[신라 첨성대·에밀레 여명 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 경주 모티프: ${res.gyeongjuMotif} (${res.dawnTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.sillaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
