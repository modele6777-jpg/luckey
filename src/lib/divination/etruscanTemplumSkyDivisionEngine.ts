import type { UserProfile } from '../sharedState';

export type EtruscanQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface TemplumSector {
  name: string;
  koreanLabel: string;
  vantageAspect: string;
  coreInsight: string;
  practicalChoice: string;
  question: string;
  overuseTrap: string;
}

export interface EtruscanTemplumResult {
  engineVersion: 'LUCKEY-ETRUSCAN-TEMPLUM-v2.3.0';
  calculatedAtKst: string;
  questionFocus: string;
  questionTopic: EtruscanQuestionTopic;
  primarySector: TemplumSector;
  mirrorSector: TemplumSector;
  companionSector: TemplumSector;
  horizonAxis: string;
  templumCycle: string;
  shadowWarning: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const TEMPLUM_SECTORS: TemplumSector[] = [
  {
    name: 'Pars Familiaris (친숙한 구획)',
    koreanLabel: '이미 손에 쥔 자원과 기준',
    vantageAspect: '내적 기반 · 안정된 시야',
    coreInsight: '바깥에서 새 답을 찾기 전에 이미 내가 가진 강점과 루틴을 먼저 신뢰할 때입니다.',
    practicalChoice: '지금 당장 활용 가능한 도구·경험 한 가지를 먼저 꺼내 오늘 과제에 적용해 보세요.',
    question: '새로운 해결책을 찾기 전에 이미 내 손안에 쥐고 있던 가장 든든한 자원은 무엇인가요?',
    overuseTrap: '익숙한 방식에만 머물러 새로운 변화를 무조건 배척하려는 관성',
  },
  {
    name: 'Pars Hostilis (도전과 경계의 구획)',
    koreanLabel: '낯선 변수와 경계 설정',
    vantageAspect: '외부 변수 · 선명한 경계',
    coreInsight: '불확실한 요소를 막연히 두려워하기보다 무엇을 허용하고 무엇을 거절할지 선을 그어야 합니다.',
    practicalChoice: '오늘 감당하지 않을 일 한 가지를 분명히 정해 일정에서 덜어 내세요.',
    question: '지금 상황의 하늘을 구획으로 나눈다면, 가장 먼저 선을 긋고 지켜야 할 경계는 어디인가요?',
    overuseTrap: '모든 외부 변수를 위협으로 과잉 경계해 필요한 협력까지 막아 버리는 태도',
  },
  {
    name: 'Cardo Axis (남북 중심축)',
    koreanLabel: '길게 이어가는 일관된 원칙',
    vantageAspect: '장기 방향 · 중심축',
    coreInsight: '눈앞의 작은 흔들림보다 내가 6개월 뒤에도 지키고 싶은 기준이 무엇인지가 우선입니다.',
    practicalChoice: '선택 앞에서 내 핵심 기준 한 문장을 소리 내어 확인한 뒤 결정하세요.',
    question: '눈앞의 작은 흔들림을 넘어 6개월 뒤에도 일관되게 지키고 싶은 나만의 중심축은 무엇인가요?',
    overuseTrap: '원칙 고수에 갇혀 현실의 유연한 조율을 놓치는 경직성',
  },
  {
    name: 'Decumanus Axis (동서 지평축)',
    koreanLabel: '오늘 만나는 흐름과 실행 타이밍',
    vantageAspect: '일일 리듬 · 현장 실행',
    coreInsight: '거창한 계획보다 지금 눈앞의 빛과 타이밍에 맞춰 가볍게 한 걸음 옮기는 편이 유리합니다.',
    practicalChoice: '가장 손이 잘 가는 작은 작업부터 10분 타이머를 켜고 바로 시작해 보세요.',
    question: '거창한 계획 대신 지금 눈앞의 타이밍에 맞춰 가볍게 첫걸음을 뗄 수 있는 일은 무엇인가요?',
    overuseTrap: '당장의 실행 속도에만 매몰되어 장기 방향성을 점검하지 않는 조급함',
  },
];

function classifyEtruscanTopic(question: string): EtruscanQuestionTopic {
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(question)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(question)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(question)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복/.test(question)) return 'health';
  if (/결정|선택|고민|방향|시작|경계|영역|집중/.test(question)) return 'decision';
  return 'general';
}

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateEtruscanTemplumSkyDivision(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): EtruscanTemplumResult {
  const now = params.now ?? new Date();
  const questionFocus = (params.question ?? '').trim() || '시야 구획과 기준점 정립';
  const baseStr = `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|etruscan-templum`;
  const seed = stableHash(baseStr);

  const primaryIdx = seed % TEMPLUM_SECTORS.length;
  const mirrorIdx = (primaryIdx + 2) % TEMPLUM_SECTORS.length;
  const companionOffset = 1 + (stableHash(`${baseStr}|companion`) % (TEMPLUM_SECTORS.length - 1));
  const companionIdx = (primaryIdx + companionOffset) % TEMPLUM_SECTORS.length;

  const primarySector = TEMPLUM_SECTORS[primaryIdx];
  const mirrorSector = TEMPLUM_SECTORS[mirrorIdx];
  const companionSector = TEMPLUM_SECTORS[companionIdx];
  const questionTopic = classifyEtruscanTopic(questionFocus);
  const templumCycle = `${primarySector.vantageAspect} 주축 ↔ ${companionSector.vantageAspect} 보조 조율`;
  const shadowWarning = `[${primarySector.name} 과잉 경계] ${primarySector.overuseTrap}을 경계하고, 대칭 구획(${mirrorSector.koreanLabel})의 균형을 함께 살피십시오.`;

  return {
    engineVersion: 'LUCKEY-ETRUSCAN-TEMPLUM-v2.3.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionFocus,
    questionTopic,
    primarySector,
    mirrorSector,
    companionSector,
    horizonAxis: `${primarySector.koreanLabel} · ${mirrorSector.koreanLabel} · ${companionSector.koreanLabel}이 교차하는 관찰 지평`,
    templumCycle,
    shadowWarning,
    ritualAction: primarySector.practicalChoice,
    reflectionFocus: `${primarySector.name}(${primarySector.vantageAspect})을 기준으로 보조 구획 ${companionSector.name}과 함께 지금 시야의 우선순위를 가늠합니다.`,
    reflectiveQuestion: primarySector.question,
    interpretiveBoundary:
      '고대 에트루리아 템플룸 관점은 시야 구획과 우선순위 판단을 비유적으로 돕는 상징 도구이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatEtruscanTemplumPrompt(result: EtruscanTemplumResult): string {
  return [
    `[고대 에트루리아 템플룸 하늘 구획·징조 성찰 엔진 ${result.engineVersion}]`,
    `- 연산 시각: ${result.calculatedAtKst} | 질문 맥락: ${result.questionTopic}`,
    `- 질문 초점: ${result.questionFocus}`,
    `- 구획 순환 축: ${result.templumCycle}`,
    `- 중심 구획: ${result.primarySector.name} (${result.primarySector.koreanLabel}) — ${result.primarySector.coreInsight}`,
    `- 대칭 구획: ${result.mirrorSector.name} (${result.mirrorSector.koreanLabel})`,
    `- 보조 구획: ${result.companionSector.name} (${result.companionSector.koreanLabel})`,
    `- 관찰 지평: ${result.horizonAxis}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
