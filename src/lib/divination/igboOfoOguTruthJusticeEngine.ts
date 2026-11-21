import type { UserProfile } from '../sharedState';

export interface IgboOfoOguResult {
  engineVersion: string;
  calculatedAtKst: string;
  pillarSymbol: string;
  companionSymbol: string;
  ofoInsight: string;
  villageTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SYMBOLS = [
  {
    symbol: '오포(Ofo · 흔들리지 않는 진실의 나무)',
    insight: '유리한 쪽을 고르기보다 내 마음이 부끄럽지 않은 정직한 기준을 먼저 세우는 힘',
    tone: '이른 아침 마을 광장 오포 나무 아래의 맑은 공기',
    action: '오늘 결정해야 할 일 하나를 고를 때 "이 선택이 내 마음에도 솔직한가?"를 한 번만 먼저 물어보세요.',
    question: '지금 내가 눈치를 보느라 망설이고 있지만, 내 양심은 이미 옳다고 알고 있는 방향은 무엇인가요?',
  },
  {
    symbol: '오구(Ogu · 맑은 양심의 방패)',
    insight: '내가 먼저 진심을 다해 대했으니 결과의 소음에 주눅 들지 않아도 되는 평정',
    tone: '비 갠 뒤 붉은 흙길 위로 내려앉는 따뜻한 햇빛',
    action: '이미 내가 정성껏 해낸 몫을 지나친 자책으로 깎아내리지 말고, 오늘의 평정을 스스로 인정해 주세요.',
    question: '진심을 다하고도 결과의 소음 때문에 괜히 주눅 들어 있던 내 안의 맑은 양심(Ogu)은 무엇인가요?',
  },
  {
    symbol: '오지(Oji · 마음을 여는 콜라 열매 나눔)',
    insight: '거창한 설득보다 작은 성의와 환대를 먼저 건네며 대화의 문을 여는 지혜',
    tone: '손님맞이 나무 쟁반 위의 정갈한 콜라 열매',
    action: '거창한 설득을 준비하기 전에 따뜻한 인사나 작은 성의 한 마디로 대화의 문부터 먼저 열어 보세요.',
    question: '설득하려 힘만 주다가 정작 건네지 못했던 작은 환대와 먼저 여는 마음은 누구에게 향해야 하나요?',
  },
  {
    symbol: '이켄가(Ikenga · 오늘 내 손의 실행력)',
    insight: '남 탓이나 운을 기다리기보다 지금 내 두 손이 움직일 수 있는 몫을 개척하는 용기',
    tone: '단단히 깎아 세운 목각 뿔의 곧은 기상',
    action: '바깥 조건이 바뀌기를 기다리지 말고, 지금 내 두 손으로 당장 옮길 수 있는 실행 한 가지를 시작해 보세요.',
    question: '상황이나 타인의 결정을 기다리느라 내 손의 실행력(Ikenga)을 멈춰 두고 있던 일은 무엇인가요?',
  },
  {
    symbol: '우문나(Umunna · 함께 기둥을 세우는 공동체)',
    insight: '혼자 모든 짐을 지지 않고 믿을 만한 동료와 책임을 나누며 멀리 가는 지혜',
    tone: '저녁 모닥불 둘레에 둘러앉은 가족들의 웃음소리',
    action: '혼자 떠안고 있던 일 하나를 신뢰할 수 있는 동료나 가족과 나누어 함께 기둥을 세워 보세요.',
    question: '혼자 버텨야 한다는 생각에 기대지 못하고 있던 믿을 만한 공동체(Umunna)의 손길은 누구인가요?',
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

export function calculateIgboOfoOguTruthJustice(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): IgboOfoOguResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SYMBOLS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SYMBOLS.length - 1));
  const picked = SYMBOLS[idx];
  const companion = SYMBOLS[(idx + companionOffset) % SYMBOLS.length];

  return {
    engineVersion: 'LUCKEY-IGBO-OFO-OGU-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    pillarSymbol: picked.symbol,
    companionSymbol: companion.symbol,
    ofoInsight: picked.insight,
    villageTone: picked.tone,
    reflectionFocus: `이그보 지혜의 '${picked.symbol}'처럼, 눈앞의 계산보다 내가 떳떳하게 고개 들 수 있는 기준 하나를 먼저 붙잡아 보세요. (동반 결: ${companion.symbol.split('(')[0].trim()})`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '서아프리카 나이지리아 이그보 전통의 오포·오구(Ofo na Ogu) 진실과 실행 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatIgboOfoOguPrompt(res: IgboOfoOguResult): string {
  return [
    `[이그보 오포·오구 진실 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 상징 기둥: ${res.pillarSymbol} (${res.villageTone})`,
    `- 동반 기둥: ${res.companionSymbol}`,
    `- 중심 통찰: ${res.ofoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
