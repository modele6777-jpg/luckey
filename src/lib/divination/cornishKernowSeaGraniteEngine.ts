import type { UserProfile } from '../sharedState';

export interface CornishKernowResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계·포구' | '일·내공' | '때·신념' | '인내 전반';
  kernowLandmark: string;
  companionLandmark: string;
  graniteCoastAxis: string;
  topicBalanceHint: string;
  cornishInsight: string;
  atlanticTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LANDMARKS = [
  {
    landmark: '틴타젤(Tintagel · 두 바다가 만나는 좁은 곶)',
    insight: '거친 파도와 고요한 만이 한 자리에서 만나듯, 바깥의 소란 속에서도 내 안의 중심을 지키는 힘',
    tone: '콘월 절벽 아래로 밀려드는 청록빛 대서양 파도',
    ritual: '오늘 주변이 소란스러울수록 호흡을 세 번 고르고 나만의 중심 문장 하나를 속으로 되뇌어 보세요.',
    question: '바깥의 파도가 거세질수록 내가 끝까지 지켜야 할 내 안의 고요한 곶은 어디인가요?',
  },
  {
    landmark: '스태너리(Stannary · 화강암 아래 단단한 주석 광맥)',
    insight: '겉으로 당장 드러나지 않아도 보이지 않는 땅속에서 묵묵히 여물어 가는 내공의 시간',
    tone: '바닷바람을 견디며 서 있는 이끼 낀 화강암 돌담',
    ritual: '오늘 내가 남몰래 꾸준히 지켜온 습관이나 성실함 한 가지를 스스로 칭찬해 주세요.',
    question: '겉으로 당장 보이지 않을 뿐, 내 안에서 이미 단단하게 여물어가고 있는 내공은 무엇인가요?',
  },
  {
    landmark: '트레고바(Tregova · 어부가 돌아오는 포구의 불빛)',
    insight: '멀리 항해한 날일수록 안전하게 닻을 내리고 쉴 수 있는 일상의 작은 쉼터가 중요함',
    tone: '저녁 안개 속에 하나둘 켜지는 작은 항구의 따뜻한 등불',
    ritual: '오늘 일과를 마친 뒤 화면과 알림에서 벗어나 마음을 내려놓을 수 있는 따뜻한 휴식 의식을 챙겨 보세요.',
    question: '긴 하루를 마치고 돌아왔을 때 나를 가장 편안하게 쉬게 하는 나만의 포구는 무엇인가요?',
  },
  {
    landmark: '메넨(Menen · 들판에 홀로 서 있는 고인돌 선돌)',
    insight: '사방에서 바람이 불어도 흔들리지 않고 오래 자리를 지키는 담백한 신념',
    tone: '보랏빛 헤더 꽃이 핀 콘월 황야 위의 고요한 선돌',
    ritual: '남들의 속도에 흔들리기 쉬운 오늘, 내가 오래 지켜 온 기준 하나를 메모에 짧게 적어 두세요.',
    question: '주변의 바람이 바뀌어도 내가 묵묵히 제자리를 지키며 지키고 싶은 신념은 무엇인가요?',
  },
  {
    landmark: '케르노우(Kernow)의 밀물과 썰물 사이 모래톱',
    insight: '모든 문이 동시에 열리지 않아도 물이 빠질 때 비로소 걸어 건널 수 있는 길이 나타남',
    tone: '썰물 뒤 반짝이는 젖은 모래톱 위 갈매기 발자국',
    ritual: '지금 당장 풀리지 않는 일 하나는 억지로 밀어붙이지 말고 다음 물때를 기다리며 한 칸 뒤로 물러나 보세요.',
    question: '지금 무리해서 건너려 하기보다 때가 무르익어 길이 드러나길 기다려야 할 일은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const CORNISH_SHADOWS = [
  '내 안의 중심을 지킨다는 이유로 외부에서 들어오는 정당한 피드백까지 차단하지 않도록 살피세요.',
  '묵묵히 내공을 쌓는 데만 익숙해져 이제는 결과물을 세상에 내보일 시점을 미루지 마세요.',
  '편안한 포구에 머무르고 싶은 마음에 꼭 출항해야 할 다음 일정까지 늦추지 않도록 균형을 두세요.',
  '오래 지킨 기준을 고수하려다 변화한 환경에 맞게 다듬어야 할 방식까지 놓치지 않도록 주의하세요.',
  '물때를 기다리는 여유가 정작 지금 당장 건너야 할 작은 실행마저 미루는 핑계가 되지 않게 하세요.',
];

const TOPIC_BALANCE_HINTS: Record<CornishKernowResult['questionTopic'], string> = {
  '관계·포구': '어부가 돌아오는 포구의 등불처럼 거친 바깥 바람 뒤에는 마음을 쉬게 하는 따뜻한 자리를 먼저 챙기세요.',
  '일·내공': '땅속 화강암 광맥이 시간을 견디며 단단해지듯 보이지 않는 축적을 믿고 오늘 몫을 다듬으세요.',
  '때·신념': '모래톱은 물이 빠질 때 드러나니, 조급하게 건너기보다 바람을 견디며 때와 기준을 함께 살피세요.',
  '인내 전반': '파도를 정면으로 막기보다 해안의 절벽처럼 중심을 세우고 물때의 리듬을 기다리는 여유를 두세요.',
};

function classifyCornishTopic(q: string): CornishKernowResult['questionTopic'] {
  if (/관계|포구|쉼터|사람|사랑|대화/.test(q)) return '관계·포구';
  if (/일|직장|내공|습관|성실|축적/.test(q)) return '일·내공';
  if (/때|신념|기준|물때|기다림/.test(q)) return '때·신념';
  return '인내 전반';
}

export function calculateCornishKernowSeaGranite(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CornishKernowResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyCornishTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % LANDMARKS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (LANDMARKS.length - 1));
  const picked = LANDMARKS[idx];
  const companion = LANDMARKS[(idx + companionOffset) % LANDMARKS.length];
  const graniteCoastAxis = `${picked.landmark.split('(')[0].trim()} ↔ ${companion.landmark.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = CORNISH_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-CORNISH-KERNOW-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    kernowLandmark: picked.landmark,
    companionLandmark: companion.landmark,
    graniteCoastAxis,
    topicBalanceHint,
    cornishInsight: picked.insight,
    atlanticTone: picked.tone,
    reflectionFocus: `콘월 케르노우의 '${picked.landmark}'과 동반 지형 '${companion.landmark}'을 겹쳐 보며, 지금 당장 결과를 재촉하기보다 바람을 견디며 단단해지는 시간을 믿어 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '영국 콘월(Cornwall · Kernow) 켈트 해안과 화강암 광맥의 인내 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCornishKernowPrompt(res: CornishKernowResult): string {
  return [
    `[콘월 케르노우·화강암 인내 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 해안 축: ${res.graniteCoastAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 케르노우 상징: ${res.kernowLandmark} (${res.atlanticTone})`,
    `- 동반 지형: ${res.companionLandmark}`,
    `- 중심 통찰: ${res.cornishInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
