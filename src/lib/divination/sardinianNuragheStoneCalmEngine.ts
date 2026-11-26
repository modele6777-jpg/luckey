import type { UserProfile } from '../sharedState';

export interface SardinianNuragheResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '균형·중심' | '화음·경청' | '우물·직관' | '여유·보폭' | '고요·여백' | '누라게 전반';
  nuragheStone: string;
  companionStone: string;
  nuragheDryStoneAxis: string;
  topicBalanceHint: string;
  sardinianInsight: string;
  mediterraneanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STONES = [
  {
    stone: '누라게(Nuraghe · 모르타르 없이 무게로 맞물린 돌탑)',
    insight: '억지스러운 접착이나 꾸밈이 없어도 서로의 무게와 자리를 정확히 지킬 때 세워지는 견고함',
    tone: '사르데냐 올리브 언덕 위에 수천 년째 서 있는 현무암 석탑',
    action: '오늘 나를 억지로 꾸미거나 설명하려 애쓰는 대신, 내가 맡은 자리와 무게를 묵묵히 지키는 데 집중해 보세요.',
    question: '억지스러운 노력이나 꾸밈을 내려놓고도 자연스럽게 제자리에 서 있을 수 있는 나의 중심은 무엇인가요?',
  },
  {
    stone: '칸투 아 테노레(Cantu a Tenore · 네 목소리가 만드는 깊은 화음)',
    insight: '나 혼자 도드라지려 애쓰기보다 각자의 음역이 어우러질 때 완성되는 깊고 풍성한 울림',
    tone: '지중해 저녁 바람을 타고 들려오는 낮고 묵직한 다성 화음',
    action: '오늘 함께 일하거나 대화하는 사람의 말에 내 의견을 덧붙이기 전, 상대의 음역과 리듬을 10초 더 끝까지 들어 보세요.',
    question: '내가 혼자 도드라지려 힘을 주기보다 주변 사람들의 목소리와 어우러질 때 더 깊어질 일은 무엇인가요?',
  },
  {
    stone: '수 포지(Su Pozzo · 땅속 깊은 성스러운 우물)',
    insight: '외부의 시선이 닿지 않는 고요한 내면의 우물 속에 가장 맑은 해답이 이미 고여 있음',
    tone: '돌계단 아래로 은은한 햇빛이 스며드는 고대 석조 우물',
    action: '오늘 바깥의 조언이나 검색을 더 찾기 전에, 조용히 앉아 내 마음속 첫 번째 직관 한 줄을 먼저 적어 보세요.',
    question: '외부의 시선과 소음이 닿지 않는 내 안의 깊은 우물에는 이미 어떤 맑은 답이 고여 있나요?',
  },
  {
    stone: '젠타(Genta · 대지의 시간을 재촉하지 않는 목동의 걸음)',
    insight: '초조함에 쫓겨 서두르기보다 계절과 양 떼의 자연스러운 흐름을 기다릴 줄 아는 여유',
    tone: '타임과 로즈마리 향기가 퍼지는 사르데냐의 나른한 오후 언덕',
    action: '오늘 걷거나 이동하는 시간 중 단 3분만이라도 걸음 속도를 한 박자 늦추고 주변 공기를 느껴 보세요.',
    question: '지금 내 걸음을 재촉하는 조급함 대신 자연스러운 계절의 보폭으로 믿고 기다려 줄 흐름은 무엇인가요?',
  },
  {
    stone: '도무스 데 야나스(Domus de Janas · 바위 속에 새긴 고요한 방)',
    insight: '세상의 소음을 잠시 닫고 나 혼자만의 고요한 방으로 물러날 때 되찾는 마음의 평화',
    tone: '바위 그늘 아래 시원하고 아늑한 지중해의 작은 석실',
    action: '오늘 5분 동안은 화면과 알림을 내려놓고 아무 소리도 없는 고요한 여백을 온전히 누려 보세요.',
    question: '세상의 소음을 잠시 닫고 나 혼자만의 고요한 석실로 들어간다면 가장 먼저 놓아주고 싶은 피로는 무엇인가요?',
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

const SARDINIAN_SHADOWS = [
  '모르타르 없이 자기 무게로 버티는 견고함이 도움을 청하거나 조율해야 할 때마저 혼자 딱딱하게 버티는 고립이 되지 않게 하세요.',
  '상대의 음역을 끝까지 듣는 배려가 정작 내가 내야 할 목소리와 분명한 의견까지 삼키는 수동성으로 흘러서는 안 됩니다.',
  '내면의 우물에서 직관을 길어 올리는 성찰이 바깥의 객관적 정보나 현실적인 검증을 아예 생략하는 독단이 되지 않게 살피세요.',
  '목동의 느린 걸음을 지키는 여유가 이미 마감이 다가온 일의 속도까지 늦추는 방심이 되지 않도록 우선순위를 확인하세요.',
  '고요한 석실로 물러나는 쉼이 해결해야 할 대화를 피하기 위한 회피용 동굴이 되지 않게 돌아 나올 시각을 정해 두세요.',
];

const SARDINIAN_TOPIC_HINTS: Record<SardinianNuragheResult['questionTopic'], string> = {
  '균형·중심': '모르타르 없이 서로의 무게로 버티는 돌처럼 억지 꾸밈을 덜어내고 내 자리의 중심만 단단히 지키세요.',
  '화음·경청': '칸투 아 테노레의 네 목소리처럼 상대의 음역을 끝까지 들은 뒤 내 음색을 부드럽게 얹으세요.',
  '우물·직관': '수 포지 우물의 고요한 물결처럼 바깥 소음을 잠시 끄고 내 안의 첫 번째 맑은 직관을 길어 올리세요.',
  '여유·보폭': '사르데냐 목동의 걸음처럼 계절의 순리를 믿되, 오늘 꼭 짚어야 할 한 걸음의 방향은 놓치지 마세요.',
  '고요·여백': '바위 속 작은 방의 서늘한 평화 속에서 피로를 내려놓고 다시 세상으로 나올 시각도 함께 정해 두세요.',
  '누라게 전반': '스스로의 무게로 서는 단단함과 공동체의 깊은 화음이 어우러질 때 어떤 바람에도 흔들리지 않습니다.',
};

function classifySardinianTopic(q: string): SardinianNuragheResult['questionTopic'] {
  if (/균형|중심|꾸밈|자리/.test(q)) return '균형·중심';
  if (/대화|화음|듣|목소리/.test(q)) return '화음·경청';
  if (/직관|우물|내면|답/.test(q)) return '우물·직관';
  if (/여유|속도|보폭|기다/.test(q)) return '여유·보폭';
  if (/고요|소음|쉼|여백/.test(q)) return '고요·여백';
  return '누라게 전반';
}

export function calculateSardinianNuragheStoneCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SardinianNuragheResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifySardinianTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % STONES.length;
  const picked = STONES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (STONES.length - 1));
  const companion = STONES[(idx + companionOffset) % STONES.length];
  const nuragheDryStoneAxis = `${picked.stone.split('(')[0].trim()} ↔ ${companion.stone.split('(')[0].trim()} (${questionTopic})`;

  const companionStone = companion.stone;
  const nuragheDryStoneAxis = `${picked.stone.split('(')[0].trim()} ↔ ${companion.stone.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = SARDINIAN_TOPIC_HINTS[questionTopic];

  return {
    engineVersion: 'LUCKEY-SARDINIAN-NURAGHE-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    nuragheStone: picked.stone,
    companionStone: companion.stone,
    nuragheDryStoneAxis,
    topicBalanceHint,
    sardinianInsight: picked.insight,
    mediterraneanTone: picked.tone,
    reflectionFocus: `사르데냐 누라게 거석 문화의 '${picked.stone}'을 중심에 두고 '${companion.stone}'의 균형을 함께 엮어, 억지로 붙잡아 두려 하지 않아도 제자리에 맞물리는 고요한 균형을 믿어 보세요.`,
    ritualAction: picked.action,
    shadowWarning: SARDINIAN_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '지중해 사르데냐(Sardinia) 누라게 거석 탑과 고요한 공동체 화음 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSardinianNuraghePrompt(res: SardinianNuragheResult): string {
  return [
    `[사르데냐 누라게·고요한 돌탑 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 거석 균형 축: ${res.nuragheDryStoneAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 누라게 상징: ${res.nuragheStone} (${res.mediterraneanTone})`,
    `- 동반 상징: ${res.companionStone}`,
    `- 중심 통찰: ${res.sardinianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
