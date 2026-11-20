import type { UserProfile } from '../sharedState';

export interface ChechenVainakhResult {
  engineVersion: string;
  calculatedAtKst: string;
  vainakhCode: string;
  companionCode: string;
  kovakhInsight: string;
  caucasusTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CODES = [
  {
    code: '야흐(Yah · 고난 앞에서도 꺾이지 않는 내면의 기개)',
    insight: '상황이 험준할수록 스스로를 낮추거나 핑계를 대지 않고 묵묵히 중심을 지키는 힘',
    tone: '코카서스 높은 바위 능선 위에 꿋꿋이 서 있는 중세 바이나흐 석탑(Bov)',
    ritual: '오늘 어려운 상황 앞에서도 핑계를 찾기보다 내가 맡은 핵심 한 가지를 끝까지 버텨 내 보세요.',
    question: '상황이 험준할수록 핑계를 대거나 물러서기보다 바이나흐 석탑처럼 묵직하게 지켜야 할 중심은 무엇인가요?',
  },
  {
    code: '시이(Siy · 말의 무게와 약속의 신의)',
    insight: '가벼운 맹세보다 한 번 내뱉은 작은 약속을 끝까지 지키는 태도가 사람의 품격을 만듦',
    tone: '산악 계곡을 가로지르는 맑은 바람과 단단하게 쌓아 올린 회색 화강암 담장',
    ritual: '오늘 내가 한 작은 약속 하나를 끝까지 지켜서 내 말의 무게를 스스로 증명해 보세요.',
    question: '가벼운 다짐을 늘리기보다, 이미 내뱉은 작은 약속 중 오늘 반드시 지켜야 할 한 가지는 무엇인가요?',
  },
  {
    code: '노흐찰라(Nokhchalla · 내면의 절제와 타인을 향한 관용)',
    insight: '강한 사람일수록 감정을 함부로 쏟아내지 않고 약한 이에게 너그러운 품을 내어 줌',
    tone: '긴 여정 끝에 산마을 집 문을 두드린 낯선 손님에게 따뜻하게 내어주는 차 한 잔',
    ritual: '욱하는 감정이 올라올 때 한 호흡 멈추고, 곁의 사람에게 따뜻한 차를 내어주듯 한 번 더 너그럽게 대하세요.',
    question: '오늘 내 감정을 바로 쏟아내는 대신, 한 호흡 절제하고 너그러운 품을 내어 줄 수 있는 자리는 어디인가요?',
  },
  {
    code: '람(Lam · 깎아지른 산맥처럼 변치 않는 중심)',
    insight: '주변의 소음이 거셀수록 험한 산을 오르듯 호흡을 고르며 한 걸음씩 정확히 딛음',
    tone: '운무가 걷히며 드러나는 체첸 고산 지대의 맑고 날카로운 능선',
    ritual: '주변 소음이 커질수록 속도를 높이지 말고, 산을 오르듯 호흡을 고르며 다음 한 발짝만 정확히 디뎌 보세요.',
    question: '주변의 소음이 거셀수록 휘둘리지 않고, 고산 능선 위에서 호흡을 고르듯 정확히 디뎌야 할 한 걸음은 무엇인가요?',
  },
  {
    code: '마르쇼(Marsho · 스스로를 다스리는 참된 자유)',
    insight: '바깥의 통제가 아니라 내 안의 조급함과 욕심을 다스릴 때 비로소 자유로워짐',
    tone: '아침 햇살이 쏟아지는 고원 초원 위로 자유롭게 날아오르는 산독수리',
    ritual: '나를 조급하게 만드는 충동이나 불필요한 욕심 하나를 내려놓고 스스로를 다스리는 고요한 10분을 가져 보세요.',
    question: '바깥의 기준이 아니라, 내 안의 조급함과 욕심을 다스릴 때 비로소 가벼워질 참된 자유는 어디에 있나요?',
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

export function calculateChechenVainakhKovakhHonor(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChechenVainakhResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CODES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (CODES.length - 1));
  const picked = CODES[idx];
  const companion = CODES[(idx + companionOffset) % CODES.length];

  return {
    engineVersion: 'LUCKEY-CHECHEN-VAINAKH-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    vainakhCode: picked.code,
    companionCode: companion.code,
    kovakhInsight: `${picked.insight} (동반 덕목: ${companion.code})`,
    caucasusTone: picked.tone,
    reflectionFocus: `바이나흐 코카서스 지혜의 '${picked.code}'와 동반 덕목 '${companion.code}'처럼, 바깥의 소란에 휩쓸리지 않고 내 말의 무게와 내면의 절제를 단단히 지켜 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '코카서스 바이나흐(체첸)의 노흐찰라(Nokhchalla)·야흐(Yah) 절제와 신의 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChechenVainakhPrompt(res: ChechenVainakhResult): string {
  return [
    `[체첸 바이나흐·카바흐 명예 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 바이나흐 덕목: ${res.vainakhCode} (${res.caucasusTone})`,
    `- 동반 덕목: ${res.companionCode}`,
    `- 중심 통찰: ${res.kovakhInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
