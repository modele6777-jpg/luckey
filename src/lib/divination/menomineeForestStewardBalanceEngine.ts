import type { UserProfile } from '../sharedState';

export interface MenomineeForestInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface MenomineeForestResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '지속·여력' | '절제·정리' | '공존·습관' | '숲지속 전반';
  canopyCycle: string;
  companionCycle: string;
  forestStewardAxis: string;
  stewardPrinciple: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CYCLES = [
  '오래된 나무가 햇빛을 양보하며 어린 묘목을 키우는 숲',
  '한 번에 다 베지 않고 다음 세대의 그늘을 남기는 순환',
  '계절마다 필요한 만큼만 거두는 절제된 손길',
  '다양한 수종이 서로의 땅을 지키는 건강한 공존',
] as const;

const PRINCIPLES = [
  '당장 눈앞의 성과를 다 꺼내 쓰지 않고 내일의 여력을 남기는 선택이 결국 가장 오래 갑니다.',
  '하나의 방식에만 몰두하기보다 서로 다른 역량이 균형을 이룰 때 숲이 흔들리지 않습니다.',
  '지나치게 빽빽한 일정은 가지치기를 해 주어야 햇빛과 바람이 다시 들어옵니다.',
  '내가 돌보는 작은 습관이 훗날 나 자신에게 든든한 숲이 되어 돌아옵니다.',
] as const;

const ACTIONS = [
  '오늘 할 일 목록에서 에너지를 과도하게 소모하는 일 한 가지를 내일로 미루거나 덜어내기',
  '일과 휴식의 비율을 점검해 내일의 내가 지치지 않을 선에서 마무리 시각 정하기',
  '한 가지 방법만 고집하던 문제에 다른 접근법 한 가지를 곁들여 보기',
  '오래 이어가고 싶은 습관 하나를 오늘 딱 10분만 가볍게 실천하기',
] as const;

const QUESTIONS = [
  '지금 당장의 효율을 위해 미래의 내 체력과 여유를 미리 당겨 쓰고 있지는 않나요?',
  '내 일상에서 햇빛이 들도록 살짝 솎아 내야 할 과한 욕심이나 일정은 무엇인가요?',
  '몇 달 뒤의 나에게 어떤 숲을 물려주고 싶나요?',
  '서로 다른 역할이나 관심이 부딪히지 않고 공존할 수 있는 균형점은 어디인가요?',
] as const;

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const MENOMINEE_SHADOWS = [
  '어린 묘목을 위해 햇빛을 양보하는 배려가 지나쳐, 정작 지금 내가 맡아야 할 중심 역할까지 뒤로 물러서지 않도록 살피세요.',
  '다음 세대의 그늘을 남기는 절제가 오늘 당장 필요한 과감한 실행과 결단까지 계속 미루는 망설임이 되지 않게 하세요.',
  '계절마다 필요한 만큼만 거두는 신중함이 새로운 기회 앞에서 손을 내미는 용기까지 묶어 두어서는 안 됩니다.',
  '다양한 수종의 공존을 챙기느라 모든 일에 같은 힘을 쓰려다 보면 정작 가장 중요한 한 그루가 시들 수 있습니다.',
] as const;

function classifyMenomineeTopic(q: string): MenomineeForestResult['questionTopic'] {
  if (/지속|미래|여력|오래|체력/.test(q)) return '지속·여력';
  if (/절제|정리|가지치기|덜어|비워/.test(q)) return '절제·정리';
  if (/공존|습관|균형|다양/.test(q)) return '공존·습관';
  return '숲지속 전반';
}

export function calculateMenomineeForestBalance(input: MenomineeForestInput): MenomineeForestResult {
  const fate = input.profile.fate ?? {};
  const q = (input.question ?? '').trim();
  const questionTopic = classifyMenomineeTopic(q);
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${q}`;
  const seed = hashSeed(seedText);
  const cycleIdx = seed % CYCLES.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (CYCLES.length - 1));
  const canopyCycle = CYCLES[cycleIdx];
  const companionCycle = CYCLES[(cycleIdx + companionOffset) % CYCLES.length];
  const forestStewardAxis = `${canopyCycle.slice(0, 14)}… ↔ ${companionCycle.slice(0, 14)}… (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-MENOMINEE-FOREST-v2.3.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    canopyCycle,
    companionCycle,
    forestStewardAxis,
    stewardPrinciple: PRINCIPLES[(seed >>> 3) % PRINCIPLES.length],
    reflectionFocus: `위스콘신 메노미니 족이 백여 년 넘게 숲을 보전하며 필요한 만큼만 거두고 다음 세대의 나무를 남기는 지속 가능성처럼 주 순환('${canopyCycle}')과 동반 순환('${companionCycle}')을 함께 짚어 올린 상징적 관점입니다.`,
    ritualAction: ACTIONS[cycleIdx],
    shadowWarning: MENOMINEE_SHADOWS[cycleIdx],
    reflectiveQuestion: QUESTIONS[cycleIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatMenomineeForestPrompt(res: MenomineeForestResult): string {
  return [
    `[메노미니·숲지속 목재 균형 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `질문 맥락: ${res.questionTopic} | 숲지속 균형 축: ${res.forestStewardAxis}`,
    `숲의 순환: ${res.canopyCycle}`,
    `동반 순환: ${res.companionCycle}`,
    `돌봄 원칙: ${res.stewardPrinciple}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `과잉 경계: ${res.shadowWarning}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
