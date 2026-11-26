import type { UserProfile } from '../sharedState';

export interface WelshMabinogionAwenResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관찰·본질' | '상상·시도' | '표현·진심' | '인내·숙성' | '평온·위로' | '아웬 전반';
  awenRay: string;
  companionRay: string;
  awenInspirationAxis: string;
  topicBalanceHint: string;
  bardicInsight: string;
  valleyTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const RAYS = [
  {
    ray: '아웬(Awen)의 첫 번째 빛줄기 · 진실한 관찰',
    insight: '남의 시선이나 관성에 휩쓸리지 않고 지금 상황의 본질을 맑게 바라보는 눈',
    tone: '스노도니아 안개 사이로 비치는 첫 아침 햇살',
    action: '오늘 진행 중인 일 하나를 판단 없이 사실 그대로 세 줄로만 적어 보며 본질을 가려 보세요.',
    question: '남의 시선이나 익숙한 관성을 걷어 내고 보면 지금 이 상황의 가장 맑은 본질은 무엇인가요?',
  },
  {
    ray: '아웬(Awen)의 두 번째 빛줄기 · 용기 있는 상상',
    insight: '지금까지 해 오던 방식 외에 전혀 새로운 길을 그려 볼 수 있는 유연한 창조성',
    tone: '푸른 이끼 낀 계곡을 흐르는 맑은 시냇물 소리',
    action: '오늘 떠오른 아이디어 또는 해 보고 싶은 일 한 가지를 짧은 문장 하나로 메모해 두세요.',
    question: '지금 내가 ‘해야만 한다’는 의무감 말고 순수하게 반짝이는 호기심으로 해 보고 싶은 작은 시도는 무엇인가요?',
  },
  {
    ray: '아웬(Awen)의 세 번째 빛줄기 · 따뜻한 표현',
    insight: '머릿속에만 담아 두던 진심을 말과 글, 행동으로 세상에 건네는 용기',
    tone: '돌벽 난로 앞 하프 연주의 포근한 여운',
    action: '마음속에만 담아 두었던 감사나 응원의 말을 오늘 짧은 메시지 한 통으로 건네 보세요.',
    question: '완벽한 표현을 기다리느라 아직 마음속에만 머물러 있는 따뜻한 진심은 누구에게 향하고 있나요?',
  },
  {
    ray: '케리드웬(Ceridwen)의 가마솥과 인내의 한 방울',
    insight: '긴 준비와 시행착오 끝에 비로소 내 것이 되어 떨어지는 결정적 영감의 순간',
    tone: '밤새 지핀 모닥불이 남긴 붉고 고요한 잉걸불',
    action: '아직 완성되지 않아 답답한 작업에서 오늘 15분만 더 묵묵히 불을 지피며 작은 디테일 하나를 다듬어 보세요.',
    question: '긴 시행착오가 헛된 소모가 아니라 결정적 한 방울이 익어 가는 시간이라고 본다면 지금 무엇이 숙성되고 있나요?',
  },
  {
    ray: '리안논(Rhiannon)의 새소리와 마음의 평온',
    insight: '복잡한 소음이 많아도 내 안의 고요한 중심을 잃지 않게 해 주는 다정한 위로',
    tone: '이른 새벽 푸른 언덕 너머로 들려오는 지저귐',
    action: '하루 중 마음이 소란해지는 순간이 오면 좋아하는 음악 한 곡이나 창밖 풍경에 2분간 온전히 귀를 기울여 보세요.',
    question: '바깥의 소음이 클수록 나를 다정하게 붙들어 주는 내 안의 고요한 노래는 무엇인가요?',
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

const WELSH_SHADOWS = [
  '사실 그대로 본질을 바라보는 냉철함이 아직 자라나는 설익은 아이디어의 싹까지 성급히 잘라 내는 냉소가 되지 않게 하세요.',
  '새로운 길을 그려 보는 자유로운 상상이 발 디딜 현실의 제약과 마감 기한을 잊은 공상으로만 흩어지지 않도록 작은 실행을 붙이세요.',
  '진심을 말과 글로 건네는 용기가 상대가 받아들일 준비가 되었는지 살피지 않는 일방적 토로로 흐르지 않게 호흡을 고르세요.',
  '가마솥 앞에서 인내로 불을 지피는 끈기가 이미 방향이 틀린 작업에 미련을 붙드는 고집으로 이어지지 않는지 중간 점검을 하세요.',
  '리안논의 노래처럼 마음의 평온을 지키는 여유가 해결해야 할 현실의 작은 불편을 외면하는 현실 도피가 되어서는 안 됩니다.',
];

const WELSH_TOPIC_HINTS: Record<WelshMabinogionAwenResult['questionTopic'], string> = {
  '관찰·본질': '관찰과 본질의 질문에서는 해석을 보태기 전에 눈에 보이는 사실 세 가지만 먼저 가려 두세요.',
  '상상·시도': '상상과 시도의 질문에서는 거창한 청사진보다 오늘 바로 옮겨 볼 수 있는 작은 실험 하나가 영감을 깨웁니다.',
  '표현·진심': '표현과 진심의 질문에서는 완벽한 문장을 기다리기보다 솔직한 마음 한 줄을 먼저 건네는 편이 맑습니다.',
  '인내·숙성': '인내와 숙성의 질문에서는 결과를 재촉하기보다 오늘 다듬을 수 있는 작은 디테일 하나에 불을 지피세요.',
  '평온·위로': '평온과 위로의 질문에서는 바깥 소음을 줄이고 내 마음을 붙들어 주는 짧은 쉼표 하나를 먼저 확보하세요.',
  '아웬 전반': '전반적 영감의 질문에서는 맑은 관찰과 유연한 시도를 함께 두어 마음이 움직이는 지점을 가볍게 붙잡으세요.',
};

function classifyWelshTopic(q: string): WelshMabinogionAwenResult['questionTopic'] {
  if (/본질|관찰|사실|진실/.test(q)) return '관찰·본질';
  if (/영감|시도|새로운|상상/.test(q)) return '상상·시도';
  if (/표현|진심|말|글/.test(q)) return '표현·진심';
  if (/인내|숙성|시행착오|다듬/.test(q)) return '인내·숙성';
  if (/평온|고요|위로|소음/.test(q)) return '평온·위로';
  return '아웬 전반';
}

export function calculateWelshMabinogionAwenInspiration(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): WelshMabinogionAwenResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyWelshTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % RAYS.length;
  const picked = RAYS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (RAYS.length - 1));
  const companion = RAYS[(idx + companionOffset) % RAYS.length];
  const awenInspirationAxis = `${picked.ray.split('·')[0].trim()} ↔ ${companion.ray.split('·')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = WELSH_TOPIC_HINTS[questionTopic];

  return {
    engineVersion: 'LUCKEY-WELSH-AWEN-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    awenRay: picked.ray,
    companionRay: companion.ray,
    awenInspirationAxis,
    topicBalanceHint,
    bardicInsight: picked.insight,
    valleyTone: picked.tone,
    reflectionFocus: `웨일스 음유시인 전통의 '${picked.ray}'을 중심에 두고 '${companion.ray}'의 결을 함께 엮어, 정답을 억지로 짜내기보다 마음이 반응하는 작은 호기심 하나를 따라가 보세요.`,
    ritualAction: picked.action,
    shadowWarning: WELSH_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '웨일스 《마비노기온》 설화와 아웬(Awen) 시적 영감 상징을 바탕으로 한 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatWelshMabinogionAwenPrompt(res: WelshMabinogionAwenResult): string {
  return [
    `[웨일스 마비노기온·아웬 영감 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 아웬 영감 축: ${res.awenInspirationAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 아웬 빛줄기: ${res.awenRay} (${res.valleyTone})`,
    `- 동반 빛줄기: ${res.companionRay}`,
    `- 중심 통찰: ${res.bardicInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
