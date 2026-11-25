import type { UserProfile } from '../sharedState';

export interface BaekjeIncenseResult {
  engineVersion: string;
  calculatedAtKst: string;
  buyeoMotif: string;
  companionMotif: string;
  baekjeInsight: string;
  incenseTone: string;
  incensePhase: string;
  questionTopic: 'relationship' | 'work' | 'inner' | 'general';
  baekjeCrossAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '백제금동대향로의 봉황(Gilt-Bronze Phoenix · 치우침 없이 오악과 물결을 품고 깃을 폄)',
    insight: '높은 뜻과 섬세한 일상이 따로 놀지 않고 한 몸에서 자연스레 어우러질 때 품격이 생김',
    tone: '부여 능산리 흙 속에서 맑은 금빛으로 깨어나 연꽃과 산봉우리를 품은 대향로',
    ritual: '오늘 크게 세운 목표 하나와 손끝의 작은 생활 습관 하나가 서로 엇갈리지 않도록 한 줄로 연결해 보세요.',
    question: '지금 내가 품은 높은 뜻과 오늘의 작은 일상이 금동대향로의 봉황과 물결처럼 어우러지려면 무엇을 이어 주어야 할까요?',
  },
  {
    motif: '서산 마애삼존불의 미소(Baekje Smile · 빛의 각도에 따라 달라지는 온화한 여유)',
    insight: '같은 상황도 내가 어떤 마음의 각도로 바라보느냐에 따라 전혀 다른 온기로 다가옴',
    tone: '아침 햇살과 저녁 노을 아래서 부드러운 미소를 바꾸어 짓는 바위 위 부처의 얼굴',
    ritual: '오늘 나 자신이나 가까운 사람에게 날카로운 평가 대신 백제의 미소처럼 부드러운 한 마디를 먼저 건네 보세요.',
    question: '지금 나를 답답하게 만드는 상황도 마음의 각도를 조금만 바꾸면 어떤 온화한 여유가 보일까요?',
  },
  {
    motif: '산수문전의 부드러운 능선(Landscape Tile · 날카로운 모서리 대신 흐르는 듯한 여백)',
    insight: '모든 선을 뾰족하게 세우면 나부터 먼저 베이기 쉬우니, 둥글게 넘기는 여유가 필요함',
    tone: '굽이치는 산과 구름, 맑은 물결이 한 장의 벽돌 위에 평화롭게 새겨진 무늬',
    ritual: '오늘 사소한 일에서 각을 세우고 싶을 때마다 산수문전의 둥근 능선을 떠올리며 한 박자 부드럽게 넘겨 보세요.',
    question: '굳이 뾰족하게 모서리를 세우지 않고 둥근 능선처럼 부드럽게 흘려보내도 괜찮은 일은 무엇인가요?',
  },
  {
    motif: '정림사지 오층석탑의 비례(Five-Story Pagoda · 무겁지 않고 하늘로 가볍게 뻗은 단정함)',
    insight: '화려한 장식을 더 붙이지 않아도 각 층의 비례만 바르면 그 자체로 충분히 아름다움',
    tone: '부여 옛 들판 위에서 군더더기 없는 옥개석 선으로 서 있는 단정한 석탑',
    ritual: '오늘 해야 할 일 목록에서 겉치레나 불필요한 장식을 한 가지 덜어 내고 핵심 비례만 남겨 보세요.',
    question: '지금 내 마음에서 군더더기를 덜어 내고 정림사지 석탑처럼 단정한 비례만 남긴다면, 가장 먼저 내려놓을 것은 무엇인가요?',
  },
  {
    motif: '오악사의 합주(Five Musicians · 비파와 피리, 북이 제 소리를 내며 하나의 선율을 이름)',
    insight: '내 안의 서로 다른 욕구와 감정들도 하나를 억누르기보다 각자 제 자리를 주면 조화로워짐',
    tone: '향로 봉우리 사이에서 맑은 소리를 연주하는 다섯 악사의 평온한 모습',
    ritual: '오늘 서로 부딪히는 내 안의 마음 두 가지를 억지로 지우지 말고 각각의 역할을 한 문장씩 인정해 주세요.',
    question: '내 안에서 서로 다투던 생각과 감정이 오악사의 합주처럼 각자 제 자리를 찾으려면 어떤 쉼표가 필요할까요?',
  },
];

const INCENSE_PHASES = [
  '연꽃 받침 다지기(바닥 고르기)',
  '오악 봉우리 피어오름(고요한 확산)',
  '오악사 선율 어우러짐(조화로운 표현)',
  '금동 봉황 내려앉음(단정한 마무리)',
] as const;

const SHADOW_WARNINGS = [
  '둥글고 온화하게 넘기려다 꼭 지켜야 할 내 안의 선마저 흐려지지 않도록 살피세요.',
  '군더더기를 덜어 내는 데 집중한 나머지 지금 필요한 따뜻한 표현까지 생략할 수 있습니다.',
  '조화를 맞추기 위해 불편한 감정을 무조건 누르면 오악사의 합주 대신 침묵만 남습니다.',
  '여백을 남기려다 당장 매듭지어야 할 현실의 손길까지 미루지 않도록 균형을 잡으세요.',
] as const;

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

export function calculateBaekjeGiltBronzeIncenseCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BaekjeIncenseResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const phaseIdx = stableHash(`${seed}|phase`) % INCENSE_PHASES.length;
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const incensePhase = INCENSE_PHASES[phaseIdx];
  const shadowWarning = SHADOW_WARNINGS[(phaseIdx + companionOffset) % SHADOW_WARNINGS.length];
  const q = (params.question ?? '').trim();
  const questionTopic: BaekjeIncenseResult['questionTopic'] = !q
    ? 'general'
    : /관계|사람|가족|연애|갈등|대화|화해/.test(q)
      ? 'relationship'
      : /일|업무|진로|결정|선택|계획|비례/.test(q)
        ? 'work'
        : /마음|긴장|여유|숨|감정|불안|비례/.test(q)
          ? 'inner'
          : 'general';
  const baekjeCrossAxis = `${questionTopic} · ${picked.motif.split('(')[0].trim()} × ${incensePhase.split('(')[0].trim()}`;

  return {
    engineVersion: 'LUCKEY-BAEKJE-INCENSE-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    buyeoMotif: picked.motif,
    companionMotif: companion.motif,
    baekjeInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    incenseTone: picked.tone,
    incensePhase,
    questionTopic,
    baekjeCrossAxis,
    shadowWarning,
    reflectionFocus: `백제 금동대향로·미소의 지혜 '${picked.motif}'와 동반 결 '${companion.motif}'가 '${incensePhase}' 국면에서 만나 뾰족한 긴장과 불필요한 장식을 덜어 내고 둥글고 온화한 비례로 마음을 고르게 펴 줍니다.`,
    ritualAction: `${picked.ritual} (${incensePhase} 흐름에 맞춰 동반 결 '${companion.motif.split('(')[0].trim()}'의 여유도 곁들여 보세요.)`,
    reflectiveQuestion: `${picked.question} (동반 결 '${companion.motif.split('(')[0].trim()}'과 함께 볼 때 오늘 가장 단정히 다듬을 비례는 무엇인가요?)`,
    interpretiveBoundary: '한국 백제의 금동대향로·서산 마애불·정림사지 비례 미학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBaekjeIncensePrompt(res: BaekjeIncenseResult): string {
  return [
    `[백제 금동대향로·미소의 여유 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 부여 모티프: ${res.buyeoMotif} (${res.incenseTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 향로 국면: ${res.incensePhase}`,
    `- 질문 맥락(${res.questionTopic}) · 백제 교차 축: ${res.baekjeCrossAxis}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 중심 통찰: ${res.baekjeInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
