import type { UserProfile } from '../sharedState';

export type PashtunQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface PashtunRoshaniyaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: PashtunQuestionTopic;
  roshaniyaLamp: string;
  companionLamp: string;
  pashtunInsight: string;
  hinduKushTone: string;
  innerLightAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LAMPS = [
  {
    lamp: '로샤니(Roshani · 어둠을 가르는 내면의 맑은 등불)',
    insight: '바깥의 소문이나 평가가 어지러울수록 내 안의 양심과 명료한 기준을 등불 삼는 태도',
    tone: '힌두쿠시 고개 새벽하늘 아래 반짝이는 맑은 별빛',
    ritual: '바깥의 평가가 어지러울수록 내가 세운 가장 명료한 양심의 기준 한 가지를 종이에 적어 확인해 보세요.',
    question: '남들의 시선이나 소문을 걷어 내고 나면, 지금 내 안에서 가장 맑게 빛나고 있는 기준은 무엇인가요?',
  },
  {
    lamp: '호자라(Hujra · 길손을 반기는 열린 사랑방)',
    insight: '마음의 문을 굳게 걸어 잠그기보다 따뜻한 환대와 여유를 남겨 둘 때 찾아오는 좋은 인연',
    tone: '흙벽 마당에 깔린 붉은 양탄자와 따뜻한 카와 녹차 향',
    ritual: '오늘 누군가에게 건네는 말 한마디에 가시 대신 따뜻한 환대(호자라)의 온기를 담아 보세요.',
    question: '마음의 빗장을 걸어 잠그기보다, 오늘 따뜻한 환대와 여유를 내어 줄 수 있는 관계는 누구인가요?',
  },
  {
    lamp: '쿠샬 한 카탁(Khushal Khan Khattak)의 매 · 높이 나는 시선',
    insight: '자잘한 시비에 발목 잡히지 않고 더 높고 넓은 목표를 향해 날개를 펴는 당당함',
    tone: '가파른 협곡 위로 시원하게 솟아오르는 아침 바람',
    ritual: '지금 나를 붙잡고 있는 자잘한 시비 하나를 내려놓고, 한 단계 더 높은 시야에서 오늘의 목표를 다시 바라보세요.',
    question: '눈앞의 자잘한 시비에 발목 잡히기보다, 더 높고 넓은 시선으로 날아올라야 할 방향은 어디인가요?',
  },
  {
    lamp: '난와타이(Nanawatai · 갈등을 멈추고 화해로 여는 문)',
    insight: '지나간 서운함을 끝까지 붙들기보다 먼저 화해와 양보의 손을 내밀 줄 아는 큰 그릇',
    tone: '저녁 노을이 내려앉은 고요한 계곡 마을의 흙길',
    ritual: '묵혀 둔 서운함이 있다면 자존심을 세우기보다 먼저 안부를 묻거나 한 걸음 양보하는 손짓을 내밀어 보세요.',
    question: '지나간 서운함을 끝까지 붙들고 있기보다, 먼저 화해의 문을 열어 놓을 수 있는 자리는 어디인가요?',
  },
  {
    lamp: '라흐만 바바(Rahman Baba)의 겸손한 꽃밭',
    insight: '가시를 세워 남을 찌르기보다 묵묵히 제 자리에서 향기를 내는 사람이 결국 오래 기억됨',
    tone: '봄비가 내린 뒤 들판에 피어난 야생 튤립의 맑은 빛깔',
    ritual: '누군가를 날카롭게 지적하고 싶어질 때 한 호흡 멈추고, 내 자리에서 조용히 낼 수 있는 향기 하나를 택해 보세요.',
    question: '가시를 세워 이기려 하기보다, 묵묵히 제 자리에서 오래 남을 향기를 내는 일은 무엇인가요?',
  },
];

function classifyPashtunTopic(question?: string): PashtunQuestionTopic {
  const q = (question ?? '').trim();
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(q)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(q)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(q)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복/.test(q)) return 'health';
  if (/결정|선택|고민|방향|시작|등불|기준/.test(q)) return 'decision';
  return 'general';
}

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

export function calculatePashtunRoshaniyaInnerLight(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PashtunRoshaniyaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % LAMPS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (LAMPS.length - 1));
  const picked = LAMPS[idx];
  const companion = LAMPS[(idx + companionOffset) % LAMPS.length];
  const questionTopic = classifyPashtunTopic(params.question);
  const innerLightAxis = `${picked.lamp.split('(')[0].trim()} ↔ ${companion.lamp.split('(')[0].trim()} 내면 등불 축`;
  const shadowWarning = `[${picked.lamp.split('(')[0].trim()} 과잉 경계] 내 기준의 맑음을 지키는 데 몰두해 타인의 다른 속도와 사정을 성급히 재단하지 않도록 살피십시오.`;

  return {
    engineVersion: 'LUCKEY-PASHTUN-ROSHANIYA-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    roshaniyaLamp: picked.lamp,
    companionLamp: companion.lamp,
    pashtunInsight: `${picked.insight} (동반 등불: ${companion.lamp})`,
    hinduKushTone: picked.tone,
    innerLightAxis,
    shadowWarning,
    reflectionFocus: `파슈툰 시학과 로샤니야 철학의 '${picked.lamp}'와 동반 등불 '${companion.lamp}'처럼, 바깥의 평가에 흔들리기 전에 내 안의 맑은 등불이 무엇을 비추는지 먼저 들여다보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '파슈툰(Pashtun) 로샤니야 내면의 빛 사상과 라흐만 바바·쿠샬 한 시학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPashtunRoshaniyaPrompt(res: PashtunRoshaniyaResult): string {
  return [
    `[파슈툰 로샤니야·내면의 빛 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 빛의 상징: ${res.roshaniyaLamp} (${res.hinduKushTone})`,
    `- 동반 등불: ${res.companionLamp}`,
    `- 내면 등불 축: ${res.innerLightAxis}`,
    `- 중심 통찰: ${res.pashtunInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
