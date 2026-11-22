import type { UserProfile } from '../sharedState';

export interface BasothoBothoResult {
  engineVersion: string;
  calculatedAtKst: string;
  mountainSign: string;
  companionSign: string;
  highlandPhase: string;
  bothoInsight: string;
  highlandTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const HIGHLAND_PHASES = [
  '온기 건네기(바쁠수록 말과 태도의 온도를 지키는 국면)',
  '품위 지키기(외부 평가와 무관하게 단정한 기준을 세우는 국면)',
  '품앗이 나누기(혼자의 짐을 덜고 곁과 손을 맞잡는 국면)',
  '단비 기다리기(보이지 않는 성실이 싹을 틔우길 견디는 국면)',
] as const;

const SHADOW_WARNINGS = [
  '배려를 앞세우다 정작 내 경계와 진심을 삼켜 버리는 과잉 희생 경계',
  '평화를 지키려다 꼭 해야 할 분명한 거절을 미루는 경계',
  '자존감을 세우려다 주변의 선한 조언까지 닫아 버리는 고집 경계',
  '품앗이를 기다리며 오늘 내가 움직여야 할 첫 삽을 미루는 경계',
] as const;

const SIGNS = [
  {
    sign: '보토(Botho · 사람됨의 따뜻한 품위)',
    insight: '내가 바쁜 순간일수록 말 한마디와 태도의 온도를 잃지 않을 때 신뢰가 지켜지는 이치',
    tone: '드라켄즈버그 고원 아침에 두른 두꺼운 바소토 담요의 온기',
    ritual: '오늘 대화나 메시지를 보낼 때 상대방의 입장을 한 문장만 더 헤아린 뒤 부드럽게 건네 보세요.',
    question: '지금 내가 조급함 때문에 놓치고 있는 부드러운 한마디나 상대방의 마음은 무엇인가요?',
  },
  {
    sign: '코촐로(Khotso · 다툼을 가라앉히는 평화)',
    insight: '이기는 논리보다 관계가 다치지 않고 함께 건널 수 있는 출구를 먼저 찾는 성숙함',
    tone: '맑은 산골짜기 시냇물 위로 내리는 고요한 오후의 비',
    ritual: '의견이 어긋난 자리에서 내 논리를 덧붙이기 전, 양쪽이 함께 숨 쉴 출구 하나를 먼저 제안해 보세요.',
    question: '지금 말로 이기는 것보다 서로가 다치지 않고 함께 건너갈 수 있는 출구는 어디에 있을까요?',
  },
  {
    sign: '모코로틀로(Mokorotlo · 흔들리지 않는 고원의 갓)',
    insight: '바깥의 변덕스러운 평가에도 내 중심과 단정한 품격을 지키는 고요한 자존감',
    tone: '구름 위 능선에 우뚝 솟은 말루티(Maluti) 산봉우리',
    ritual: '외부 반응에 흔들리던 기준 하나를 내려놓고, 오늘 내가 스스로 부끄럽지 않을 단정한 원칙을 세워 보세요.',
    question: '바깥의 변덕스러운 평가가 사라진 뒤에도 내 안에 꼿꼿이 서 있을 나만의 기준은 무엇인가요?',
  },
  {
    sign: '레츠마(Letsema · 함께 밭을 가는 품앗이)',
    insight: '어려운 일일수록 혼자의 완벽주의를 내려놓고 곁의 사람과 손을 보탤 때 가벼워지는 힘',
    tone: '황금빛 옥수수 밭 사이로 이어진 마을 사람들의 발걸음',
    ritual: '혼자 끌어안고 끙끙대던 일 한 조각을 곁의 사람에게 나누어 부탁하거나 의견을 물어보세요.',
    question: '혼자 다 짊어져야 한다고 믿고 있었지만, 사실은 손을 보태 달라고 말해도 되는 몫은 무엇인가요?',
  },
  {
    sign: '푸라(Pula · 마른 땅을 적시는 단비)',
    insight: '당장 눈에 띄지 않는 작은 배려와 인내가 결국 가장 필요한 때에 싹을 틔우는 흐름',
    tone: '긴 건기 끝에 붉은 고원을 적시는 시원한 첫 빗줄기',
    ritual: '당장 보상이 보이지 않더라도 내가 믿는 작은 친절이나 성실함 한 가지를 묵묵히 이어 가세요.',
    question: '지금 당장 열매가 보이지 않더라도 내일을 적시는 단비처럼 조용히 지켜 내고 싶은 습관은 무엇인가요?',
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

export function calculateBasothoBothoMountainWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BasothoBothoResult {
  const now = params.now ?? new Date();
  const baseSeed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(baseSeed) % SIGNS.length;
  const companionOffset = 1 + (stableHash(`${baseSeed}|companion`) % (SIGNS.length - 1));
  const companionIdx = (idx + companionOffset) % SIGNS.length;
  const phaseIdx = stableHash(`${baseSeed}|phase`) % HIGHLAND_PHASES.length;
  const picked = SIGNS[idx];
  const companion = SIGNS[companionIdx];
  const highlandPhase = HIGHLAND_PHASES[phaseIdx];
  const shadowWarning = SHADOW_WARNINGS[(idx + phaseIdx) % SHADOW_WARNINGS.length];
  const shortCompanion = companion.sign.split('(')[0].trim();
  const shortPhase = highlandPhase.split('(')[0].trim();

  return {
    engineVersion: 'LUCKEY-BASOTHO-BOTHO-v2.3.0',
    calculatedAtKst: formatKstStandard(now),
    mountainSign: picked.sign,
    companionSign: companion.sign,
    highlandPhase,
    bothoInsight: `${picked.insight} (국면: ${shortPhase})`,
    highlandTone: picked.tone,
    reflectionFocus: `남아프리카 바소토의 '${picked.sign}'을 중심에 두고 '${companion.sign}'의 온기를 곁들여 '${highlandPhase}' 흐름 속에서 결과의 크기만큼이나 태도의 품위를 챙겨야 할 때입니다.`,
    ritualAction: `${picked.ritual} (${shortPhase} 흐름에서 '${shortCompanion}'의 태도도 함께 살려 보세요.)`,
    reflectiveQuestion: `${picked.question} (보조 맥락 '${shortCompanion}'을 곁들이면 무엇이 달라질까요?)`,
    shadowWarning,
    interpretiveBoundary: '남아프리카 바소토(Basotho) 전통의 보토(Botho)·평화(Khotso) 공동체 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBasothoBothoPrompt(res: BasothoBothoResult): string {
  return [
    `[바소토 보토·고원 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 고원 상징: ${res.mountainSign} (${res.highlandTone})`,
    `- 보조 맥락: ${res.companionSign}`,
    `- 고원 국면: ${res.highlandPhase}`,
    `- 중심 통찰: ${res.bothoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉·체면 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
