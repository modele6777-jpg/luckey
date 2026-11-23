import type { UserProfile } from '../sharedState';

export interface HebrideanTartanResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '박자·직조' | '방풍·유연' | '고유·양분' | '트위드 전반';
  hebrideanMotif: string;
  companionMotif: string;
  loomWeaveAxis: string;
  hebrideanInsight: string;
  tweedTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '이끼와 히스 빛깔의 실(Heather & Lichen Dye · 바위 이끼와 들꽃에서 섬 고유의 색을 우려냄)',
    insight: '멀리서 화려한 재료를 찾지 않아도 내가 지금 딛고 선 땅의 이끼와 풀잎에서 고유한 색이 나옴',
    tone: '스코틀랜드 아우터 헤브리디스 해변, 안개 낀 언덕의 보랏빛 히스 꽃 위로 바람이 부는 아침',
    ritual: '멀리서 새 도구를 찾기보다 지금 내가 이미 밟고 선 자리의 익숙한 재료 하나로 작은 결과물을 만들어 보세요.',
    question: '바깥에서 화려한 답을 찾느라 지나쳤지만, 사실은 내 발밑 땅에서 우러나는 고유한 빛깔은 무엇인가요?',
  },
  {
    motif: '페달 베틀의 발박자(Pedal Loom Rhythm · 전기 없이 두 발과 손이 맞물려 천을 짬)',
    insight: '속도를 내기 위해 기계에 맡기기보다 내 발과 손의 박자로 짠 결과물이 훨씬 오래 버팀',
    tone: '작은 돌집 오두막 안에서 나무 베틀의 규칙적인 소리가 파도 소리와 어우러지는 오전',
    ritual: '남의 빠른 속도를 쫓아가기보다 오늘 내 손과 발이 가장 편안하게 유지할 수 있는 박자 하나를 지켜 보세요.',
    question: '무리해서 속도를 올리기보다 내 본래의 발박자로 짰을 때 훨씬 오래 남을 일은 무엇인가요?',
  },
  {
    motif: '검은 집의 낮은 지붕(Blackhouse Roof · 둥글고 낮은 초가지붕으로 대서양 강풍을 넘김)',
    insight: '바람이 거셀수록 키를 높여 맞서기보다 몸을 낮추고 둥글게 흘려보내는 지혜가 필요함',
    tone: '거친 대서양 바람을 막아 주는 두꺼운 돌벽 안쪽에서 피트 난로가 따뜻하게 타오르는 낮',
    ritual: '거센 변수에 정면으로 맞서기보다 오늘 하루는 자세를 낮추고 둥글게 바람을 흘려보내 보세요.',
    question: '억지로 버티며 바람을 맞기보다, 몸을 낮추어 둥글게 넘겨 보내도 괜찮을 오늘의 강풍은 무엇인가요?',
  },
  {
    motif: '타르탄의 교차 격자(Clan Sett · 서로 다른 색의 씨실과 날실이 교차하며 하나의 무늬를 이룸)',
    insight: '내 안의 모순되어 보이는 성향들도 서로 엮어 보면 오히려 단단하고 고유한 격자가 됨',
    tone: '짙은 청록과 갈색, 붉은 선이 교차한 두툼한 모직 천이 의자 위에 따뜻하게 놓인 오후',
    ritual: '오늘 거창한 해결책을 찾아 헤매기보다, 지금 손에 쥔 익숙한 재료 하나로 작은 매듭을 지어 보세요.',
    question: '내 안의 서로 달라 보이는 성향들을 억지로 하나만 고르려 하기보다 함께 엮어 볼 수는 없을까요?',
  },
  {
    motif: '썰물 뒤의 켈프 해초(Kelp Shore · 거친 파도가 지나간 모래밭에 바다의 양분이 남음)',
    insight: '지나간 시련의 파도가 휩쓸고 간 자리에도 다음 삶을 키워 낼 짭짤한 양분이 남겨져 있음',
    tone: '은빛 해가 기우는 바닷가, 잔잔해진 물가 바위 위로 파도가 조용히 물러나는 저녁',
    ritual: '지나간 바쁜 파도 뒤에 남아 있는 고요한 자리에서 다음 날을 위한 양분 한 가지를 챙겨 두세요.',
    question: '거친 파도가 지나간 모래밭 위에서 내가 아직 거두어들이지 않은 짭짤한 양분은 무엇인가요?',
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

const HEBRIDEAN_SHADOWS = [
  '지금 쥔 익숙한 재료만 고집하다 꼭 필요한 새로운 도구와 배움의 창까지 닫아 두지 마세요.',
  '나만의 발박자를 지킨다는 명분으로 함께 호흡을 맞추어야 할 공동 일정의 속도까지 놓치지 마세요.',
  '몸을 낮춰 바람을 흘려보내되 꼭 지켜야 할 삶의 울타리와 원칙적 경계까지 무너뜨리지 마세요.',
  '서로 다른 실을 다 엮으려다 무늬의 중심이 흐려지지 않도록 오늘의 주색 하나를 분명히 두세요.',
  '지나간 파도 뒤의 양분을 챙기는 데만 머무르지 말고, 다음 항해를 위한 새 돛도 제때 점검하세요.',
];

function classifyHebrideanTopic(q: string): HebrideanTartanResult['questionTopic'] {
  if (/박자|속도|베틀|격자|직조/.test(q)) return '박자·직조';
  if (/바람|강풍|지붕|낮추|흘려/.test(q)) return '방풍·유연';
  if (/재료|고유|양분|이끼|파도/.test(q)) return '고유·양분';
  return '트위드 전반';
}

export function calculateHebrideanTartanLoomCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HebrideanTartanResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyHebrideanTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const loomWeaveAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const shadowWarning = HEBRIDEAN_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-HEBRIDEAN-TARTAN-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    hebrideanMotif: picked.motif,
    companionMotif: companion.motif,
    loomWeaveAxis,
    hebrideanInsight: picked.insight,
    tweedTone: picked.tone,
    reflectionFocus: `헤브리디스 트위드의 '${picked.motif}'과 동반 결 '${companion.motif}'을 함께 엮어, 내 발박자에 맞는 고유한 격자를 짜 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '스코틀랜드 아우터 헤브리디스의 해리스 트위드 직조와 블랙하우스 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHebrideanTartanPrompt(res: HebrideanTartanResult): string {
  return [
    `[헤브리디스·타르탄 베틀 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 베틀·직조 축: ${res.loomWeaveAxis}`,
    `- 헤브리디스 모티프: ${res.hebrideanMotif} (${res.tweedTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.hebrideanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
