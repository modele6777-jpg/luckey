import type { UserProfile } from '../sharedState';

export type SavoyQuestionTopic = 'route' | 'rest' | 'pace' | 'season' | 'general';

function classifySavoyTopic(q: string): SavoyQuestionTopic {
  if (/고개|우회|길|방향|돌파|방법/.test(q)) return 'route';
  if (/멈춤|휴식|산장|폭풍|쉼|지침/.test(q)) return 'rest';
  if (/속도|보폭|함께|동행|리듬/.test(q)) return 'pace';
  if (/계절|양|조절|변화|내려/.test(q)) return 'season';
  return 'general';
}

const SAVOY_TOPIC_WARNINGS: Record<SavoyQuestionTopic, string> = {
  route: '더 부드러운 우회로를 찾더라도 핵심 목적지 자체를 흐리지 않도록 도착 기준 1가지는 고정하세요.',
  rest: '산장에서 숨을 고르는 시간이 무기력한 회피로 굳어지지 않도록 재출발 시각을 미리 적어 두세요.',
  pace: '보폭을 맞추려다 내 본래 호흡까지 잃지 않도록 하루 15분은 온전한 자기 속도로 두세요.',
  season: '계절의 높이를 조절하되 지금 당장 지켜야 할 기본 약속까지 가볍게 여기지 마세요.',
  general: '능선을 오를 때는 정상만 보느라 발밑의 돌과 기상 변화를 놓치지 않는 편이 안전합니다.',
};

export interface AlpineSavoyResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: SavoyQuestionTopic;
  savoyAltitudeAxis: string;
  ridgePrinciple: string;
  companionPrinciple: string;
  alpineWeather: string;
  shadowWarning: string;
  savoyInsight: string;
  alpineTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  {
    principle: '콜(Col · 두 봉우리 사이를 잇는 가장 낮은 고갯마루)',
    insight: '굳이 가장 험한 봉우리 정상을 정면으로 넘지 않아도 지형이 허락하는 현명한 통로가 있음',
    tone: '사보이 알프스의 만년설 아래 초록빛 목초지가 펼쳐진 시원한 산악 고개',
    ritual: '오늘 가장 막막한 일 하나를 정면 돌파 대신 우회하거나 나눌 수 있는 작은 고개부터 찾아보세요.',
    question: '지금 내가 굳이 가장 험한 봉우리를 넘으려 애쓰고 있을 뿐, 사실은 더 부드럽게 건널 수 있는 고갯마루(Col)는 어디에 있을까요?',
  },
  {
    principle: '르퓨주(Refuge · 폭풍이 지나가기를 기다리는 산장)',
    insight: '날씨가 거칠어질 때 무리해서 전진하는 것보다 잠시 멈춰 따뜻한 차를 마시는 판단이 용기임',
    tone: '해 질 녘 돌벽 산장 창문 너머로 비치는 은은한 등불과 포근한 난로 온기',
    ritual: '무리해서 밀어붙이던 일정 하나를 잠시 산장(Refuge)에 들른 듯 멈추고 10분간 숨을 고르세요.',
    question: '지금 폭풍이 지나가기를 기다리며 잠시 멈춰 서야 할 순간인데도 조급함에 발을 떼고 있지는 않나요?',
  },
  {
    principle: '코르데(Cordée · 서로의 보폭을 맞춰 한 줄로 묶인 등반)',
    insight: '혼자 빠르게 앞서가기보다 함께 가는 이의 호흡을 살필 때 팀 전체가 안전하게 도착함',
    tone: '새벽 눈밭 위를 일정한 간격으로 나란히 오르는 등반가들의 차분한 발자국',
    ritual: '함께 일하거나 대화하는 상대에게 내 속도만 재촉하지 말고 한 번 먼저 호흡을 물어보세요.',
    question: '혼자 빨리 가는 것보다 옆 사람과 보폭을 맞추는 편이 결국 더 안전하게 닿는 길은 무엇인가요?',
  },
  {
    principle: '알파주(Alpage · 계절에 맞춰 양 떼를 올리고 내리는 순환)',
    insight: '모든 계절에 같은 자리에만 머물 수 없듯, 지금 시기에 맞는 높이와 일의 양을 조절해야 함',
    tone: '맑은 빙하 계곡물 소리와 함께 울리는 알프스 목동의 잔잔한 종소리',
    ritual: '계절이 바뀐 지금 내 일상에 과하게 남아 있는 옛 규칙 하나를 가볍게 내려놓아 보세요.',
    question: '지금 내 계절의 높이에 맞춰 자연스럽게 줄이거나 옮겨야 할 몫은 무엇인가요?',
  },
  {
    principle: '에델바이스(Edelweiss · 바위 틈에서 조용히 피어나는 단단한 소박함)',
    insight: '비옥한 평지가 아니더라도 내게 주어진 자리의 햇빛과 바람만으로도 충분히 꽃을 피울 수 있음',
    tone: '차가운 고산 바람 속에서도 하얀 솜털을 지켜 내는 고요한 야생화',
    ritual: '남과 비교하며 아쉬워하던 조건 대신 지금 내 손에 이미 쥐어진 단단한 강점 하나를 적어 보세요.',
    question: '완벽한 환경이 갖춰지기를 기다리기보다 지금 선 자리의 햇빛만으로 피워 낼 수 있는 꽃은 무엇인가요?',
  },
];

function formatKstStandard(date: Date): string {
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

const ALPINE_WEATHERS = [
  '맑게 트인 능선 시야 (장거리 조망에 유리)',
  '구름이 낮게 깔린 고개 (발밑 한 걸음 집중 필요)',
  '서늘한 빙하 바람 (체온·페이스 유지가 핵심)',
  '황혼 빛 산장 들머리 (무리를 접고 쉼으로 전환)',
];

const SAVOY_SHADOW_WARNINGS = [
  '우회로를 찾다 핵심 결단마저 계속 미루지 않도록 작은 기준점을 세우세요.',
  '잠시 멈춤이 무기력한 회피로 굳어지지 않도록 재출발 시각을 함께 정해 두세요.',
  '보폭을 맞추려다 내 본래 호흡까지 잃지 않도록 자신의 리듬도 챙기세요.',
  '계절의 변화를 읽되 지금 당장 지켜야 할 기본 약속까지 가볍게 여기지 마세요.',
  '소박한 만족이 더 큰 시도를 막는 안주로 이어지지 않도록 작은 호기심을 남기세요.',
];

export function calculateAlpineSavoyColWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AlpineSavoyResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifySavoyTopic(q);
  const baseSeed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(baseSeed) % PRINCIPLES.length;
  const companionOffset = 1 + (stableHash(`${baseSeed}|companion`) % (PRINCIPLES.length - 1));
  const companionIdx = (idx + companionOffset) % PRINCIPLES.length;
  const weatherIdx = stableHash(`${baseSeed}|weather`) % ALPINE_WEATHERS.length;
  const picked = PRINCIPLES[idx];
  const companion = PRINCIPLES[companionIdx];
  const alpineWeather = ALPINE_WEATHERS[weatherIdx];
  const shadowWarning = questionTopic === 'general' ? SAVOY_SHADOW_WARNINGS[idx] : SAVOY_TOPIC_WARNINGS[questionTopic];
  const savoyAltitudeAxis = `${picked.principle.split('(')[0].trim()} ↔ ${companion.principle.split('(')[0].trim()} (${alpineWeather.split('(')[0].trim()})`;

  return {
    engineVersion: 'LUCKEY-ALPINE-SAVOY-v2.4.0',
    calculatedAtKst: formatKstStandard(now),
    questionTopic,
    savoyAltitudeAxis,
    ridgePrinciple: picked.principle,
    companionPrinciple: companion.principle,
    alpineWeather,
    shadowWarning,
    savoyInsight: picked.insight,
    alpineTone: picked.tone,
    reflectionFocus: `알프스 사보이 산악 지혜의 '${picked.principle}'을 중심으로 삼고 '${companion.principle}'으로 보폭을 맞추며, '${alpineWeather}' 조건에 맞는 현명한 고개를 택해 보세요.`,
    ritualAction: `${picked.ritual} (${companion.principle.split('(')[0].trim()} 관점도 함께 적용해 보세요.)`,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '알프스 사보이(Savoy)의 산장 쉼·고갯마루 지혜·코르데 동행 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAlpineSavoyPrompt(res: AlpineSavoyResult): string {
  return [
    `[알프스 사보이·고갯마루 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 고도·동행 축: ${res.savoyAltitudeAxis}`,
    `- 산악 지혜: ${res.ridgePrinciple} (${res.alpineTone})`,
    `- 보조 맥락: ${res.companionPrinciple}`,
    `- 고산 기상 국면: ${res.alpineWeather}`,
    `- 과잉·지연 경계: ${res.shadowWarning}`,
    `- 중심 통찰: ${res.savoyInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
