import type { UserProfile } from '../sharedState';

export interface TorajaAlukPillar {
  name: string;
  symbol: string;
  axis: string;
  shadow: string;
  guidance: string;
  action: string;
  question: string;
}

export interface TorajaAlukResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '방향·뿌리' | '감사·순환' | '애도·정리' | '연대·신뢰' | '토라자 전반';
  activePillar: TorajaAlukPillar;
  companionPillar: TorajaAlukPillar;
  tongkonanAxis: string;
  tongkonanOrientation: string;
  interpretation: string;
  ritualAction: string;
  reflectionFocus: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const TORAJA_ALUK_PILLARS: TorajaAlukPillar[] = [
  {
    name: '통코난(Tongkonan)의 뿌리와 방향성',
    symbol: '하늘을 향해 솟은 배 모양 지붕',
    axis: '초심과 삶의 기준점을 다시 확인해 방향을 세우는 북쪽 정향의 축',
    shadow: '원칙과 방향을 점검하는 데만 머무르지 말고 오늘 당장 한 걸음 내디딜 작은 실행도 함께 정하세요.',
    guidance: '어디로 나아갈지 헷갈릴수록 내가 어디에서 왔는지, 어떤 가치 위에 집을 짓고 싶은지 먼저 방향을 확인하는 때입니다.',
    action: '오늘 내 책상이나 방 한쪽을 정돈하고, 지금 내가 세우고 싶은 삶의 중심 기준 한 가지를 적어 보세요.',
    question: '어디로 갈지 망설여질 때, 내가 가장 먼저 돌아보아야 할 삶의 뿌리와 중심 기준은 무엇인가요?',
  },
  {
    name: '알룩 토돌로(Aluk Todolo) — 감사와 순환의 예법',
    symbol: '대나무 마디와 벼 이삭',
    axis: '일상의 작은 도움과 기본 약속에 감사를 되돌려 흐름을 잇는 순환의 축',
    shadow: '타인에게 감사를 전하고 예법을 챙기느라 정작 내 자신의 수고와 휴식을 건너뛰지 않도록 살피세요.',
    guidance: '크게 도약하기 전에 지금 내 곁을 지켜 준 사람과 일상의 작은 도움에 감사를 표현하면 흐름이 단단해집니다.',
    action: '오늘 하루 고마웠던 사람 한 명에게 짧은 감사 인사를 건네고 일상의 작은 순환을 챙겨 보세요.',
    question: '지금 내가 놓치고 있던 고마움이나, 다시 제자리에 돌려놓고 싶은 일상의 기본 약속은 무엇인가요?',
  },
  {
    name: '람부 솔로·람부 투카 — 슬픔과 기쁨의 제자리',
    symbol: '동쪽과 서쪽의 균형',
    axis: '묵은 아쉬움을 제자리에 정리해 새 기쁨이 들어설 자리를 여는 분별의 축',
    shadow: '지나간 감정과 아쉬움을 정리하는 데 오래 머물러 지금 눈앞에 온 새로운 기쁨까지 미루지 않도록 주의하세요.',
    guidance: '지나간 일을 충분히 애도하고 정리해야 새로운 기쁨과 시작이 온전히 들어설 자리가 생깁니다.',
    action: '마음 한쪽에 미뤄 둔 서운함이나 아쉬움 하나를 솔직히 인정하고 오늘의 할 일과 분리해 보세요.',
    question: '지나간 감정을 대충 덮어 두느라 정작 새로운 기쁨이 들어설 자리를 좁히고 있던 일은 무엇인가요?',
  },
  {
    name: '공동체의 엮임과 신뢰의 매듭',
    symbol: '파송(Pa’ssura) 조각 문양',
    axis: '혼자 짊어진 무게를 믿을 만한 이들과 나누어 지탱하는 연대 결속의 축',
    shadow: '도움을 청하고 나누는 과정에서 내 스스로 결정하고 책임져야 할 핵심 몫까지 모호하게 넘기지 않게 하세요.',
    guidance: '혼자 짊어지던 짐을 믿을 수 있는 한 사람과 나누어 들 때 생각보다 훨씬 가볍게 문턱을 넘을 수 있습니다.',
    action: '혼자 끙끙대던 일 하나를 믿을 수 있는 동료나 가족에게 가볍게 공유하고 도움을 청해 보세요.',
    question: '혼자 다 감당해야 한다고 굳게 믿느라 곁의 따뜻한 손길을 밀어내고 있던 짐은 무엇인가요?',
  },
];

function classifyTorajaTopic(q: string): TorajaAlukResult['questionTopic'] {
  if (/방향|뿌리|기준|초심|어디/.test(q)) return '방향·뿌리';
  if (/감사|고마|순환|약속|일상/.test(q)) return '감사·순환';
  if (/슬픔|기쁨|정리|서운|아쉬/.test(q)) return '애도·정리';
  if (/함께|도움|신뢰|혼자|짐/.test(q)) return '연대·신뢰';
  return '토라자 전반';
}

const TONGKONAN_ORIENTATIONS = [
  '북쪽(Ulunna Langi)을 바라보듯 초심과 기준점을 다시 세우는 방향',
  '동쪽(Matallo)의 아침 빛처럼 새로운 관계와 기회에 마음을 여는 방향',
  '집안의 중앙 기둥(A’riri Posi)처럼 흔들리지 않는 일상의 중심을 지키는 방향',
];

function formatKstTimestamp(date: Date): string {
  const kstMs = date.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateTorajaAlukTodoloTongkonan(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TorajaAlukResult {
  const now = params.now ?? new Date();
  const questionText = (params.question ?? '').trim();
  const questionTopic = classifyTorajaTopic(questionText);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${questionText}|${now.toISOString().slice(0, 10)}`;
  const hash = stableHash(seed);

  const activeIndex = hash % TORAJA_ALUK_PILLARS.length;
  const activePillar = TORAJA_ALUK_PILLARS[activeIndex];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (TORAJA_ALUK_PILLARS.length - 1));
  const companionPillar = TORAJA_ALUK_PILLARS[(activeIndex + companionOffset) % TORAJA_ALUK_PILLARS.length];
  const tongkonanOrientation = TONGKONAN_ORIENTATIONS[(hash >>> 3) % TONGKONAN_ORIENTATIONS.length];

  return {
    engineVersion: 'LUCKEY-TORAJA-ALUK-v2.3.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionTopic,
    activePillar,
    companionPillar,
    tongkonanAxis: activePillar.axis,
    tongkonanOrientation,
    interpretation: `인도네시아 토라자 알룩 토돌로(Aluk Todolo)와 통코난 지혜에서는 '${activePillar.name}'(${activePillar.symbol})을 중심에 두고 '${companionPillar.name}'의 결이 함께 어우러집니다. ${activePillar.guidance}`,
    ritualAction: activePillar.action,
    reflectionFocus: `'${tongkonanOrientation}'을 떠올리며 '${activePillar.name}'과 '${companionPillar.name}' 사이에서 지금 바로잡고 싶은 방향을 한 줄로 정리해 보세요.`,
    shadowWarning: activePillar.shadow,
    reflectiveQuestion: activePillar.question,
    interpretiveBoundary: '본 풀이는 인도네시아 토라자 알룩 토돌로와 통코난 전통 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTorajaAlukPrompt(result: TorajaAlukResult): string {
  return [
    `[토라자 알룩 토돌로·통코난 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst} | 질문 맥락: ${result.questionTopic}`,
    `- 중심 기둥: ${result.activePillar.name} (${result.activePillar.symbol})`,
    `- 통코난 균형 축: ${result.tongkonanAxis}`,
    `- 동반 기둥: ${result.companionPillar.name} (${result.companionPillar.symbol})`,
    `- 통코난 방향: ${result.tongkonanOrientation}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
