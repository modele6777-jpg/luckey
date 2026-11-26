import type { UserProfile } from '../sharedState';

export interface NumidianCirtaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '연결·다리' | '경계·균형' | '민첩·유연' | '기초·질서' | '뿌리·휴식' | '누미디아 전반';
  cirtaMotif: string;
  companionMotif: string;
  cirtaHorizonAxis: string;
  topicBalanceHint: string;
  numidianInsight: string;
  plateauTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '루멜 협곡의 자연 다리(Rhumel Gorge · 깊은 벼랑 사이를 잇는 단단한 바위 아치)',
    insight: '서로 멀어 보이는 두 영역이나 사람 사이에도 잘 살펴보면 자연스럽게 건널 수 있는 다리가 있음',
    tone: '깎아지른 듯한 석회암 협곡 위로 아침 안개가 걷히며 웅장한 바위 다리가 드러나는 풍경',
    action: '오늘 멀게만 느껴지던 상대나 과제를 향해 짧은 안부나 첫 연결고리 한 줄을 먼저 건네 보세요.',
    question: '서로 벼랑처럼 떨어져 보이지만 사실은 자연스럽게 건널 수 있는 다리가 놓여 있는 관계나 일은 무엇인가요?',
  },
  {
    motif: '키르타 천문대의 지평선(Cirta Horizon · 사막의 열기와 바다의 바람이 만나는 경계선)',
    insight: '극단적인 두 기운이 만나는 경계에 설수록 한쪽으로 치우치지 않는 균형 감각이 빛을 발함',
    tone: '북아프리카 고원 끝에서 지중해 쪽 푸른 구름과 내륙의 황금빛 햇살이 나란히 비치는 낮',
    action: '오늘 상반된 두 선택지나 감정 사이에서 한쪽을 꺾기보다 둘 다 숨 쉴 수 있는 중간 지점을 한 줄 적어 보세요.',
    question: '지금 내 안에서 열기와 바람처럼 팽팽히 맞서는 두 요구가 균형을 이룰 수 있는 지평선은 어디인가요?',
  },
  {
    motif: '누미디아 기병의 가벼운 고삐(Light Rein · 무거운 갑옷 대신 민첩한 방향 전환을 택함)',
    insight: '모든 조건을 완벽히 갖추려다 무거워지기보다, 가볍게 출발해 상황에 맞춰 틀 수 있는 유연함이 강점임',
    tone: '고원 초원을 따라 먼지를 적게 일으키며 가볍고 빠르게 방향을 바꾸는 말발굽 소리',
    action: '오늘 미루고 있던 일 하나를 가장 가벼운 첫 단계로 쪼개서 부담 없이 시작해 보세요.',
    question: '완벽한 준비를 기다리느라 고삐를 너무 꽉 쥐고 있어서, 정작 가볍게 건널 수 있는 다리를 놓치고 있지는 않나요?',
  },
  {
    motif: '메드라센의 계단식 둥근 탑(Medracen Dome · 둥근 지평선 위에 차분히 쌓아 올린 돌의 질서)',
    insight: '큰 계획도 결국은 오늘 내 발밑에 놓인 돌 하나를 반듯하게 올려놓는 일에서 완성됨',
    tone: '넓은 고원 한가운데 기하학적인 선을 그리며 조용히 서 있는 고대 석조 원형 기념물',
    action: '거대한 목표 전체를 걱정하기보다 오늘 내 발밑에서 반듯하게 올려놓을 수 있는 한 단의 작업만 완수해 보세요.',
    question: '멀리 있는 둥근 탑의 꼭대기보다 오늘 내가 반듯하게 쌓아야 할 발밑의 돌 하나는 무엇인가요?',
  },
  {
    motif: '올리브와 삼나무의 공생(Olive & Cedar · 메마른 땅에서도 뿌리를 깊이 내려 그늘을 만듦)',
    insight: '척박해 보이는 시기일수록 겉가지보다 땅속 깊은 뿌리를 내리는 데 시간을 쓰면 오래 버팀',
    tone: '은빛 올리브 잎이 바람에 흔들리며 고대 성벽 아래 서늘한 그늘을 드리우는 오후',
    action: '겉으로 당장 드러나지 않아도 내 체력과 기본기를 단단히 다지는 습관(수면·정리·기록) 하나를 오늘 챙겨 보세요.',
    question: '지금 겉가지를 뻗기보다 땅속 깊은 뿌리를 내리고 서늘한 그늘을 기르는 데 써야 할 시간은 어디에 있나요?',
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

const NUMIDIAN_SHADOWS = [
  '서로 다른 두 영역을 잇는 다리를 찾다가 정작 내가 감당할 수 있는 경계선까지 지워 버리는 과잉 연결을 경계하세요.',
  '극단 사이의 중간 지점을 찾는 균형 감각이 분명한 결단이 필요한 순간마저 양쪽 눈치를 보며 미루는 우유부단으로 흐르지 않게 하세요.',
  '가볍게 출발해 방향을 틀 수 있는 민첩함이 핵심 원칙이나 약속까지 바람 따라 수시로 바꾸는 변덕이 되지 않도록 중심을 잡으세요.',
  '발밑의 돌 하나에 집중하는 성실함이 전체 지평선의 큰 방향이 바뀌고 있는데도 고개 들지 않는 매몰로 이어지지 않게 살피세요.',
  '내면의 뿌리를 내리는 고요한 시간이 밖으로 건네야 할 안부와 표현까지 막아 두는 과도한 위축이 되지 않게 주의하세요.',
];

const NUMIDIAN_TOPIC_HINTS: Record<NumidianCirtaResult['questionTopic'], string> = {
  '연결·다리': '연결과 다리의 질문에서는 건널 수 있는 작은 연결고리 하나를 먼저 짚되, 감당할 경계선은 함께 지켜 두세요.',
  '경계·균형': '경계와 균형의 질문에서는 두 극단 사이에서 둘 다 숨 쉴 수 있는 중간 지점을 한 줄로 먼저 정해 보세요.',
  '민첩·유연': '민첩과 유연의 질문에서는 완벽한 준비를 기다리기보다 가장 가벼운 첫 단계로 출발해 방향을 조율하세요.',
  '기초·질서': '기초와 질서의 질문에서는 거대한 전체보다 오늘 발밑에 반듯하게 올려놓을 수 있는 한 단의 작업만 완수하세요.',
  '뿌리·휴식': '뿌리와 휴식의 질문에서는 겉가지를 뻗기보다 수면과 정리처럼 기본 체력을 다지는 시간을 먼저 확보하세요.',
  '누미디아 전반': '전반적 항해의 질문에서는 무거운 조건을 다 갖추려 하기보다 가벼운 고삐와 균형 잡힌 시야로 한 걸음을 옮기세요.',
};

function classifyNumidianTopic(q: string): NumidianCirtaResult['questionTopic'] {
  if (/연결|다리|사이|관계/.test(q)) return '연결·다리';
  if (/경계|균형|선택|맞서/.test(q)) return '경계·균형';
  if (/가벼|걸음|민첩|시작/.test(q)) return '민첩·유연';
  if (/기초|돌|질서|완수/.test(q)) return '기초·질서';
  if (/뿌리|체력|휴식|그늘/.test(q)) return '뿌리·휴식';
  return '누미디아 전반';
}

export function calculateNumidianCirtaHorizonPoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NumidianCirtaResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyNumidianTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const cirtaHorizonAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = NUMIDIAN_TOPIC_HINTS[questionTopic];

  return {
    engineVersion: 'LUCKEY-NUMIDIAN-CIRTA-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    cirtaMotif: picked.motif,
    companionMotif: companion.motif,
    cirtaHorizonAxis,
    topicBalanceHint,
    numidianInsight: picked.insight,
    plateauTone: picked.tone,
    reflectionFocus: `누미디아 키르타 지평선의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 시야를 함께 엮어, 무거운 조건을 다 갖추려 애쓰기보다 가벼운 고삐와 균형 잡힌 시야로 한 걸음을 옮겨 보세요.`,
    ritualAction: picked.action,
    shadowWarning: NUMIDIAN_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 북아프리카 누미디아 키르타의 협곡·지평선 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNumidianCirtaPrompt(res: NumidianCirtaResult): string {
  return [
    `[누미디아 키르타·천문 지평선 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 키르타 지평 축: ${res.cirtaHorizonAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 키르타 모티프: ${res.cirtaMotif} (${res.plateauTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.numidianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
