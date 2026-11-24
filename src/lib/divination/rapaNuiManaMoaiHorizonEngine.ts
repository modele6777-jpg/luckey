import type { UserProfile } from '../sharedState';

export interface RapaNuiMoaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '수호·터전' | '내면·마나' | '절제·타푸' | '기억·롱고롱고' | '공존·절약' | '모아이 전반';
  moaiFocus: string;
  companionFocus: string;
  moaiHorizonAxis: string;
  manaInsight: string;
  pacificHorizonTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const FOCUSES = [
  {
    focus: '아후의 시선(Ahu · 바다가 아닌 내 터전과 사람을 바라봄)',
    insight: '먼 곳의 동경보다 지금 내가 발 딛고 선 자리와 소중한 이들을 살피는 데 진정한 힘이 있음',
    tone: '남태평양의 푸른 수평선을 등지고 마을 초원을 묵묵히 지키는 모아이의 시선',
    action: '오늘 하루 동안 바깥의 비교를 잠시 끄고, 지금 내가 돌보고 있는 가장 가까운 일 하나에 온전히 마음을 기울여 보세요.',
    question: '지금 내가 수평선 너머의 막연한 비교에 시선을 빼앗기고 있다면, 다시 돌아보아야 할 내 안의 터전은 어디인가요?',
  },
  {
    focus: '마나(Mana · 억지 과시가 아닌 내면에서 배어 나오는 묵직한 힘)',
    insight: '요란하게 드러내지 않아도 스스로를 다스릴 줄 아는 사람에게서 자연스레 신뢰가 우러남',
    tone: '라노 라라쿠(Rano Raraku) 화산 응회암에 새겨진 깊고 흔들리지 않는 윤곽',
    action: '오늘 과장하거나 증명하려는 말 한 마디를 줄이고, 묵묵히 할 일을 다하는 단정한 태도를 지켜 보세요.',
    question: '요란하게 드러내지 않아도 스스로를 다스릴 때 내 안에서 자연스레 우러나오는 묵직한 힘은 무엇인가요?',
  },
  {
    focus: '타푸(Tapu · 소중한 것을 함부로 대하지 않는 절제와 경계)',
    insight: '무엇이든 다 취하려 들지 않고 지켜야 할 선을 분명히 할 때 오히려 삶이 풍요로워짐',
    tone: '오롱고 절벽 아래로 부서지는 맑고 장엄한 남태평양의 파도',
    action: '오늘 내 시간과 에너지를 지켜 주기 위해 과감히 거절하거나 뒤로 미룰 일 하나를 분명히 정해 보세요.',
    question: '무엇이든 다 취하려 들기보다 지켜야 할 선(Tapu)을 분명히 할 때 오히려 풍요로워질 영역은 어디인가요?',
  },
  {
    focus: '롱고롱고(Rongorongo · 세대를 넘어 뜻을 새기는 기억의 결)',
    insight: '지나가는 감정에 휩쓸리지 않고 내가 진짜 남기고 싶은 이야기의 결을 차분히 정리함',
    tone: '해 질 녘 아나케나 해변 야자수 사이로 스며드는 황금빛 노을',
    action: '지나가는 감정에 휩쓸리지 않도록 오늘 내가 소중히 기억하고 싶은 가치 한 문장을 노트에 새겨 두세요.',
    question: '순간의 기분이 지나간 뒤에도 내 삶의 나무판에 오래 새겨 두고 싶은 이야기의 결은 무엇인가요?',
  },
  {
    focus: '하나우 마마우(Hana Mau · 한정된 자리에서 지혜롭게 나누는 공존)',
    insight: '가진 자원이 무한하지 않음을 알기에 지금 내게 주어진 여건을 아끼고 알뜰히 돌봄',
    tone: '섬의 맑은 바람과 푸른 풀밭이 맞닿은 고요한 대지의 호흡',
    action: '오늘 내 하루의 시간·체력·물건 중 하나를 아껴 쓰며 지금 주어진 여건에 감사한 마음을 챙겨 보세요.',
    question: '무한하지 않은 시간과 에너지를 아껴 지금 내게 주어진 터전을 알뜰히 돌보려면 무엇을 줄여야 할까요?',
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

const RAPA_NUI_SHADOWS = [
  '아후의 시선으로 내 터전과 가까운 사람을 돌보는 마음이 바깥세상의 새로운 기회나 배움까지 닫아 버리는 폐쇄성이 되지 않게 하세요.',
  '요란한 과시 없이 묵묵히 중심을 지키는 마나(Mana)의 무게감이 꼭 필요한 소통이나 자기표현마저 생략하는 과묵함으로 굳어져서는 안 됩니다.',
  '소중한 것을 지키기 위해 선을 긋는 타푸(Tapu)의 절제가 유연한 협력을 막는 지나친 경계심이나 배타성으로 흐르지 않게 살피세요.',
  '오래 남길 가치의 결을 정리하는 롱고롱고의 성찰이 이미 지나간 과거의 기록에 매여 오늘의 새 시도를 미루는 집착이 되지 않게 주의하세요.',
  '한정된 자원을 아껴 쓰는 공존의 지혜가 꼭 투자해야 할 순간에조차 몸을 사리는 인색함이 되지 않도록 균형을 잡으세요.',
];

function classifyRapaNuiTopic(q: string): RapaNuiMoaiResult['questionTopic'] {
  if (/터전|자리|가까운|지키/.test(q)) return '수호·터전';
  if (/마나|내면|무게|신뢰/.test(q)) return '내면·마나';
  if (/타푸|경계|거절|선/.test(q)) return '절제·타푸';
  if (/기억|기록|문장|가치/.test(q)) return '기억·롱고롱고';
  if (/아껴|자원|공존|여건/.test(q)) return '공존·절약';
  return '모아이 전반';
}

export function calculateRapaNuiManaMoaiHorizon(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): RapaNuiMoaiResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyRapaNuiTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % FOCUSES.length;
  const picked = FOCUSES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (FOCUSES.length - 1));
  const companion = FOCUSES[(idx + companionOffset) % FOCUSES.length];
  const moaiHorizonAxis = `${picked.focus.split('(')[0].trim()} ↔ ${companion.focus.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-RAPANUI-MOAI-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    moaiFocus: picked.focus,
    companionFocus: companion.focus,
    moaiHorizonAxis,
    manaInsight: picked.insight,
    pacificHorizonTone: picked.tone,
    reflectionFocus: `라파 누이 지혜의 '${picked.focus}'을 중심에 두고 '${companion.focus}'의 결을 곁들여, 바깥의 시선을 쫓기보다 지금 내 자리와 소중한 이들을 지키는 묵직한 중심을 세워 보세요.`,
    ritualAction: picked.action,
    shadowWarning: RAPA_NUI_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '남태평양 라파 누이(이스터 섬)의 모아이 보호 시선·마나(Mana)·타푸(Tapu) 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatRapaNuiMoaiPrompt(res: RapaNuiMoaiResult): string {
  return [
    `[라파 누이 마나·모아이 수평선 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 수호 수평선 축: ${res.moaiHorizonAxis}`,
    `- 수호 시선: ${res.moaiFocus} (${res.pacificHorizonTone})`,
    `- 동반 시선: ${res.companionFocus}`,
    `- 중심 통찰: ${res.manaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
