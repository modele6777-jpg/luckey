import type { UserProfile } from '../sharedState';

export interface LatvianDainasResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '리듬·돌봄' | '빛·노래' | '뿌리·중심' | '다이나스 전반';
  dainasMotif: string;
  companionMotif: string;
  balticHarmonyAxis: string;
  maraInsight: string;
  balticTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '라이마(Laima · 삶의 실을 잣는 차분한 리듬)',
    insight: '서두르지 않고 하루의 마디마디를 정성껏 이어 갈 때 내 몫의 길이 자연스럽게 엮임',
    tone: '다우가바 강물 위로 잔잔히 퍼지는 라트비아 여름 아침의 안개',
    action: '오늘 해야 할 일 중 가장 중요한 한 가지를 골라 서두르지 않고 정해진 시간 동안만 차분히 이어 가 보세요.',
    question: '결과를 앞당기려는 조급함을 잠시 내려놓고 지금 내 손끝의 리듬에 맡겨 두어도 될 일은 무엇인가요?',
  },
  {
    motif: '마라(Māra · 대지의 품과 몸의 돌봄)',
    insight: '거창한 성취보다 오늘 내 몸과 일상을 따뜻하게 먹이고 쉬게 하는 기본이 모든 힘의 뿌리임',
    tone: '자작나무 숲길에서 불어오는 맑고 서늘한 발트 해안의 숨결',
    action: '오늘 따뜻한 물이나 식사를 천천히 챙기며 내 몸이 보내는 피로 신호를 가장 먼저 돌보아 보세요.',
    question: '지금 내가 너무 멀리만 내다보느라 놓치고 있는, 오늘 일상의 소박한 리듬과 돌봄은 무엇인가요?',
  },
  {
    motif: '사울레(Saule · 사계절을 돌며 비추는 햇빛)',
    insight: '어두운 겨울밤에도 빛이 다시 돌아오는 순환을 믿으며 내면의 온기를 잃지 않음',
    tone: '호박(Amber) 보석처럼 따뜻하게 빛나는 저녁 노을빛',
    action: '하루 중 햇빛이나 창밖 하늘이 보이는 자리에서 3분간 멈춰 서서 오늘의 작은 온기를 느껴 보세요.',
    question: '어둡게만 보이던 국면 속에서도 여전히 식지 않고 나를 비추고 있는 작은 빛은 무엇인가요?',
  },
  {
    motif: '다이나스 4행시(Dainas · 짧은 노래에 담긴 생활의 지혜)',
    insight: '긴 설교보다 일상의 작은 장면을 담은 짧은 한 마디가 마음을 오래 붙들어 줌',
    tone: '리예(Līgo) 하지 축제 밤, 모닥불 주위에서 나지막이 이어지는 합창',
    action: '오늘 하루를 마감하기 전, 내 마음을 가장 편안하게 해 준 작은 순간 하나를 짧은 한 줄로 적어 보세요.',
    question: '거창한 다짐 대신 오늘의 나를 가장 잘 지탱해 줄 수 있는 짧은 문장 하나는 무엇일까요?',
  },
  {
    motif: '오졸스(Ozols · 뿌리 깊은 참나무의 고요)',
    insight: '주변 바람이 거셀수록 가지를 흔들기보다 땅속 깊은 뿌리에 조용히 힘을 모으는 지혜',
    tone: '오랜 세월 마을 언덕을 지켜온 묵직한 참나무 그늘',
    action: '바깥의 소음이 큰 순간일수록 1분간 발바닥을 땅에 붙이고 깊게 숨을 내쉬며 중심을 잡아 보세요.',
    question: '바깥의 흔들림에 반응하기 전에 먼저 단단히 내려앉혀야 할 나의 중심과 원칙은 무엇인가요?',
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

const LATVIAN_SHADOWS = [
  '서두르지 않고 마디마디를 잇는 차분함이 지금 당장 결단하고 속도를 내야 할 순간까지 늦추지 않도록 살피세요.',
  '몸과 일상의 기본을 돌보는 따뜻함이 새로운 도전을 피하고 편안한 안온함에만 머무는 핑계가 되지 않게 하세요.',
  '어둠 뒤에 빛이 돌아온다는 순환을 믿되 오늘 내가 직접 해결해야 할 작은 과제까지 막연히 미루지는 마세요.',
  '짧은 문장으로 마음을 붙드는 여유 속에서도 구체적인 다음 행동과 일정을 정리하는 현실 감각을 함께 챙기세요.',
  '뿌리 깊은 참나무처럼 고요히 중심을 잡다가도, 필요한 소통과 반응의 타이밍까지 놓치지 않도록 귀를 열어 두세요.',
];

function classifyLatvianTopic(q: string): LatvianDainasResult['questionTopic'] {
  if (/리듬|돌봄|일상|몸|피로/.test(q)) return '리듬·돌봄';
  if (/빛|온기|노래|문장|다짐/.test(q)) return '빛·노래';
  if (/뿌리|중심|원칙|흔들/.test(q)) return '뿌리·중심';
  return '다이나스 전반';
}

export function calculateLatvianDainasMaraHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): LatvianDainasResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyLatvianTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const balticHarmonyAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-LATVIAN-DAINAS-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    dainasMotif: picked.motif,
    companionMotif: companion.motif,
    balticHarmonyAxis,
    maraInsight: picked.insight,
    balticTone: picked.tone,
    reflectionFocus: `라트비아 다이나스 전통의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 리듬을 함께 엮어, 거창한 해답보다 오늘 내 일상의 작은 리듬과 몸의 감각을 정성껏 돌보아 보세요.`,
    ritualAction: picked.action,
    shadowWarning: LATVIAN_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '발트 라트비아의 전통 구전 시가 다이나스(Dainas)와 자연 순환 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatLatvianDainasPrompt(res: LatvianDainasResult): string {
  return [
    `[라트비아 다이나스·마라 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 발트 조화 축: ${res.balticHarmonyAxis}`,
    `- 다이나스 상징: ${res.dainasMotif} (${res.balticTone})`,
    `- 동반 상징: ${res.companionMotif}`,
    `- 중심 통찰: ${res.maraInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
