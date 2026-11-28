import type { UserProfile } from '../sharedState';
import type { SajuAnalysisResult } from '../sajuAnalysis';

export const SAJU_CONSULTATION_TOPICS = [
  { id: 'personality', label: '성격·기질' },
  { id: 'yearly_trend', label: '연간 흐름' },
  { id: 'career', label: '진로·직업' },
  { id: 'relationship', label: '관계' },
  { id: 'current_concern', label: '지금 고민' },
] as const;

export type SajuConsultationTopic = (typeof SAJU_CONSULTATION_TOPICS)[number]['id'];

const SAJU_TOPIC_LABELS: Record<SajuConsultationTopic, string> = {
  personality: '성격·기질',
  yearly_trend: '연간 흐름',
  career: '진로·직업',
  relationship: '관계',
  current_concern: '지금 고민',
};

export function inferSajuConsultationTopic(question: string): SajuConsultationTopic | null {
  const q = question.trim();
  if (/(성격|기질|성향|강점|약점|장단점)/.test(q)) return 'personality';
  if (/(올해|내년|연간|세운|흐름|\b20\d{2}\b)/.test(q)) return 'yearly_trend';
  if (/(직업|진로|취업|이직|직장|커리어|사업)/.test(q)) return 'career';
  if (/(연애|인연|관계|궁합|결혼|상대)/.test(q)) return 'relationship';
  if (/(사주|명식|일간|오행|세운|대운|운세|명리)/.test(q)) return 'current_concern';
  return null;
}

export function isSajuConsultationRequest(question: string): boolean {
  return /(사주|명식|일간|오행|세운|대운|명리)/.test(question);
}

function timeCertaintyLabel(profile?: UserProfile | null): string {
  const basic = profile?.basic;
  if (!basic?.birthtime) return '출생 시각 미입력: 시주를 계산하지 않은 부분 명식';
  const certainty = basic.birthTimeAccuracy || 'approximate';
  if (certainty === 'unknown') return '출생 시각 정확도: 모름 (시각을 계산 근거로 쓰지 않음)';
  if (certainty === 'exact') return `출생 시각 정확도: 정확한 기록 (${basic.birthtime})`;
  return `출생 시각 정확도: 대략 기억한 시각 (${basic.birthtime}; 시주 해석은 제한적으로 다룰 것)`;
}

/** Full deterministic chart output is provided as evidence; the model interprets but never calculates a chart. */
export function buildSajuConsultationSystemPrompt(
  chart: SajuAnalysisResult,
  profile: UserProfile | null | undefined,
  topic: SajuConsultationTopic,
): string {
  const basic = profile?.basic;
  const calendarLabel = chart.isLunar
    ? `음력${basic?.isLeapMonth ? ' 윤달' : ' 평달'} ${chart.birthdate}; 양력 환산 ${chart.solarEquivalentDate || '확인 불가'}`
    : `양력 ${chart.birthdate}`;
  const computedOutput = {
    pillars: chart.pillars,
    dayMaster: {
      gan: chart.dayMaster.gan,
      hanja: chart.dayMaster.hanja,
      korean: chart.dayMaster.korean,
      element: chart.dayMaster.element,
      yinYang: chart.dayMaster.yinYang,
      symbolName: chart.dayMaster.symbolName,
      archetypeTitle: chart.dayMaster.archetypeTitle,
      coreKeywords: chart.dayMaster.coreKeywords,
      personalityEssence: chart.dayMaster.personalityEssence,
      spiritualMission: chart.dayMaster.spiritualMission,
      mindsetAdvice: chart.dayMaster.mindsetAdvice,
    },
    elements: chart.elements,
    geokguk: chart.geokguk,
    bodyStrength: chart.bodyStrength,
    yongsin: chart.yongsin,
    yongsinDetails: chart.yongsinDetails,
    daeun: chart.daeun,
    daewunDetail: chart.daewunDetail,
    annual: chart.annual2026,
    specialStructures: chart.specialStructures,
    timePolicy: chart.timePolicy,
  };

  return `당신은 따뜻하고 현실적인 사주 해석 상담자입니다. 사용자의 질문에 친절하고 간결한 한국어로 답하세요.

[해석 범위]
- 선택한 주제: ${SAJU_TOPIC_LABELS[topic]}.
- 아래에 제공된 앱의 결정론적 계산 결과만 명식의 근거로 사용합니다. 사주를 새로 계산하거나, 빠진 기둥·오행·십신·대운·세운을 추론해 만들어내지 마세요.
- ${calendarLabel}. ${timeCertaintyLabel(profile)}.
- 입력된 달력 종류, 윤달 여부, 환산 날짜와 시간 정책을 그대로 밝혀 주세요. 계산 오류나 미지원 날짜가 있으면 결과를 만들어 내지 말고 확인이 필요한 입력만 짧게 물어보세요.
- 생시가 없거나 대략 기억한 경우 시주·시간 관련 해석을 확정하지 말고 불확실성을 분명히 적으세요. 생시가 없어도 다른 계산된 근거로 답할 수 있으면 되묻지 말고 부분 명식으로 진행하세요.
- 사용자가 이미 제공한 프로필·질문 정보를 다시 묻지 마세요. 지금 고민의 핵심 선택지나 기간 등 결론에 필요한 맥락이 빠진 경우에만 확인 질문을 하나만 하세요.
- 연간 흐름은 아래 계산된 세운만 해석하세요. 사용자가 다른 연도를 지정하면 그 해의 산출값이 없음을 밝히고, 해당 연도 운을 지어내지 마세요.
- 건강 질문은 상징을 진단으로 바꾸지 말고, 증상 판단·치료 지시를 하지 마세요. 필요하면 의료 전문가와 상의하도록 권하세요.
- 재정·투자 질문에는 특정 자산 매수·매도, 수익 약속, 대출·투자 실행을 권하지 마세요. 상징적 경향과 함께 예산·위험·조건을 직접 확인하는 중립적 점검 항목을 제시하세요.
- 운세는 확정된 사실이나 보장이 아니라 전통적 상징에 대한 참고 해석입니다. 사용자의 선택과 현실의 확인 가능한 정보가 우선입니다.

[답변 구조 — 제목을 유지하고 각 항목은 질문에 필요한 만큼 간결하게]
## 요약
## 계산 근거
## 유리한 흐름과 주의할 점
## 현실적인 다음 단계
## 불확실성

[결정론적 앱 계산 결과 — 해석만 허용]
${JSON.stringify(computedOutput, null, 2)}
`;
}

export function buildSajuConsultationUserMessage(input: {
  topic: SajuConsultationTopic;
  question: string;
  context?: string;
}): string {
  const context = input.context?.trim();
  return [
    `[주제] ${SAJU_TOPIC_LABELS[input.topic]}`,
    `[질문] ${input.question.trim()}`,
    context ? `[현재 상황/기간 (사용자가 제공)] ${context}` : '',
  ].filter(Boolean).join('\n');
}

export function buildSajuStructuredFallbackAnswer(input: {
  chart: SajuAnalysisResult;
  profile?: UserProfile | null;
  topic: SajuConsultationTopic;
  question: string;
  fallbackText: string;
}): string {
  const { chart, profile, topic, question } = input;
  const q = `${question} ${input.fallbackText}`;
  const isHealth = /(건강|아프|질병|병원|증상|치료)/.test(q);
  const isFinancial = /(재물|금전|투자|주식|코인|부동산|수익|대출|매수|매도)/.test(q);
  const safeSummary = isHealth
    ? '사주와 오행은 건강 상태나 질환을 판정하는 근거가 아니야. 증상이나 치료가 걱정되면 의료 전문가와 상담해.'
    : isFinancial
      ? '사주로 수익이나 손실을 예측할 수는 없어. 특정 자산의 매수·매도나 투자 실행을 권하지 않고, 실제 조건과 위험을 따져 보는 게 중요해.'
      : input.fallbackText.trim();
  const basic = profile?.basic;
  const calendar = chart.isLunar
    ? `음력${basic?.isLeapMonth ? ' 윤달' : ' 평달'} ${chart.birthdate} (환산 양력 ${chart.solarEquivalentDate || '미확인'})`
    : `양력 ${chart.birthdate}`;
  const pillars = [chart.pillars.year, chart.pillars.month, chart.pillars.day, chart.pillars.hour]
    .filter(Boolean)
    .map((pillar) => pillar?.full || `${pillar?.gan || ''}${pillar?.zhi || ''}`)
    .join(' · ');
  const annualSection = topic === 'yearly_trend'
    ? `${chart.annual2026.yearName}: 기회 주제는 ${chart.annual2026.keyOpportunity}, 살펴볼 점은 ${chart.annual2026.caution}. 상징적 참고이며 결과를 보장하지 않아.`
    : `${chart.elements.summary} 이는 상징적 분류이며 실제 상황은 확인 가능한 정보와 함께 판단해야 해.`;
  const nextStep = isHealth
    ? '증상은 사주로 판단하지 말고, 필요한 경우 의료기관에 문의해.'
    : isFinancial
      ? '예산·손실 감내 범위·수수료·계약 조건을 직접 확인하고, 필요하면 자격 있는 재무 전문가에게 상담해.'
      : '결정에 필요한 현실의 조건을 하나씩 확인하고, 되돌리기 쉬운 작은 행동부터 선택해.';
  const uncertainty = `${timeCertaintyLabel(profile)} ${chart.timePolicy.summary} 사주 해석은 전통적 상징에 대한 참고이며 확정된 미래 사실이 아니야.`;

  return `## 요약\n${safeSummary}\n\n## 계산 근거\n입력 역법: ${calendar}. 계산된 원국: ${pillars}. 일간: ${chart.dayMaster.hanja} (${chart.dayMaster.symbolName}).\n\n## 유리한 흐름과 주의할 점\n${annualSection}\n\n## 현실적인 다음 단계\n${nextStep}\n\n## 불확실성\n${uncertainty}`;
}

export function buildSajuChatGuidance(hasCalculatedChart: boolean, question = ''): string {
  const inferredTopic = inferSajuConsultationTopic(question);
  const topicLabel = inferredTopic ? SAJU_TOPIC_LABELS[inferredTopic] : '지금 고민';
  return `[사주 상담 지침]\n상담 주제: ${topicLabel}. 사용자가 사주 풀이를 요청했습니다. ${hasCalculatedChart
    ? '프로필과 계산 미리보기로 제공된 명식·세운 값만 해석하고, 새 계산이나 빠진 값을 만들어내지 마세요.'
    : '계산된 명식이 없습니다. 생년월일 또는 달력 종류·윤달 등 현재 빠진 입력만 확인하고, 그 전에는 사주 계산이나 해석을 했다고 말하지 마세요.'}
답변은 ## 요약, ## 계산 근거, ## 유리한 흐름과 주의할 점, ## 현실적인 다음 단계, ## 불확실성 순으로 간결하게 구성하세요. 프로필에 있는 정보를 되묻지 말고, 생시가 없으면 시주 없이 해석 가능한 범위에서 진행하며 그 한계를 밝혀 주세요. 윤달·양력/음력·출생 시각의 불확실성이 명식에 미치는 영향을 숨기지 마세요. 연간 흐름은 제공된 연도 계산값만 사용하고 다른 연도는 예측값을 만들지 마세요. 건강은 비진단적이고, 금전·투자 조언은 특정 실행을 권하지 않는 중립적 안내로 제한하세요. 운세를 확정적 사실·보장처럼 표현하지 마세요.`;
}


export function buildTarotInterpretationGuidance(input: {
  question: string;
  hasAppDraw: boolean;
  /** 실제 적용된 배열법이 예·아니오 전용 배열일 때만 상징적 기울기 표기를 허용한다. */
  yesNoSpread?: boolean;
}): string {
  const evidenceRule = input.hasAppDraw
    ? '이번 앱 요청에 전달된 실제 카드와 정·역방향만 해석하세요. 그 카드 이름·방향·배열을 바꾸거나, 새로 선택·추첨·추가했다고 말하지 마세요.'
    : '이번 요청에는 실제 앱 카드 추첨이 없습니다. 카드가 뽑혔다고 말하거나 카드·배열·방향을 지어내지 말고, 필요한 경우 앱의 카드 추첨을 안내하세요.';
  const yesNoVerdictRule = input.yesNoSpread
    ? `예/아니오 전용 배열이므로, 예/아니오 질문에 방향을 덧붙일 때는 실제 카드에 근거해 단독 줄 '상징적 기울기: [YES]' 또는 '상징적 기울기: [NO]'로만 표현하고, 최종 판정·보장으로 말하지 마세요.`
    : `이번 배열법은 예·아니오 전용 배열이 아니므로 질문이 예/아니오형이어도 '상징적 기울기: [YES]', '[NO]', YES/NO 판정 같은 표기를 만들지 마세요. 카드의 상징과 지금 확인할 조건·다음 단계로만 답하세요.`;
  return `[타로 상담 지침]\n질문: ${input.question.trim()}\n${evidenceRule}\n카드의 상징은 성찰을 돕는 참고이지, 사용자나 제3자의 숨은 생각·감정·행동을 사실처럼 확정하는 근거가 아닙니다. 지금의 상황과 가까운 기간에 확인할 수 있는 선택·변수·행동에 초점을 두세요. 먼 미래의 결과나 시점이 질문이면 카드가 그것을 확정할 수 없다고 밝히고, 지금 점검할 수 있는 가까운 단계로 답을 좁히세요. 확률·승률·수익률·정확한 날짜를 만들거나 약속하지 말고, 양자택일도 객관적인 승자를 지어내지 마세요. 두 선택을 다룰 때는 사용자가 말한 선택지의 이름을 그대로 쓰고, 각 카드가 비추는 상징·장점·주의점과 현실에서 확인할 조건을 비교하세요. ${yesNoVerdictRule}\n답변은 눈앞에 카드를 펼쳐 두고 설명하듯 자연스러운 상담 화법으로 구성하세요. 실제 카드와 배열이 보여주는 근거를 먼저 짚고, 가능한 흐름과 주의점, 현실에서 확인할 지점을 구분해 말한 뒤, 이 질문에 맞는 행동 하나와 질문자가 자기 상황을 되짚어 답할 수 있는 열린 질문 하나로 여유를 남기세요. 불확실한 부분은 그 자리에서 짧게 밝히고, 카드별 해설은 두세 문장짜리 짧은 문단으로 끊어 주세요.`;
}
