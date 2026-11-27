/**
 * 미국 존 듀이(John Dewey) 《경험과 자연》 & 《민주주의와 교육》 도구주의 반성적 사고 & 지성적 탐구·성장으로서의 삶 지혜 엔진
 *
 * 20세기 미국 실용주의(Pragmatism) 및 도구주의(Instrumentalism) 철학자 존 듀이(1859~1952)의 원전 기반:
 * 1. 반성적 사고(Reflective Thinking): 맹목적 관습이나 성급한 충동을 멈추고 문제 상황의 본질을 탐구함
 * 2. 도구적 지성(Instrumental Intelligence): 생각을 현실의 난제를 푸는 유효한 도구로 삼는 유연성
 * 3. 성장 그 자체로서의 삶(Growth as an End in Itself): 완결된 결과보다 배우며 확장하는 과정의 생명력
 * 4. 유기체-환경 상호작용(Transaction): 주어진 조건과 호흡하며 새로운 질서를 빚어내는 개척력
 *
 * @version LUCKEY-JOHN-DEWEY-PRAGMATIC-INQUIRY-GROWTH-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_JOHN_DEWEY_PRAGMATIC_INQUIRY_GROWTH_VERSION = 'LUCKEY-JOHN-DEWEY-PRAGMATIC-INQUIRY-GROWTH-v2.4.0';

export type DeweyQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface DeweyTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface DeweyAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEnglish: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AmericanJohnDeweyPragmaticInquiryGrowthResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: DeweyQuestionTopic;
  inquiryPosture: string;
  deweyCrossAxis: string;
  deweyShadowWarning: string;
  // 내부 계산 호환 필드 (프롬프트 비노출)
  reflectiveThinkingInquiryScore: number;
  instrumentalIntelligenceAdaptabilityIndex: number;
  growthAsLifeProcessVitalityScore: number;
  organismEnvironmentInteractionHarmonyIndex: number;
  democraticCooperationEmpathyScore: number;
  // 세부 분석
  activeDeweyTheme: DeweyTheme;
  focalDeweyAphorism: DeweyAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  situationalDeweyAudit: {
    focusTheme: string;
    inquiryCue: string;
    tacticalStep: string;
  };
  temporalDeweyRhythm: {
    kstTimeLabel: string;
    inquiryWindow: string;
    seasonalGrowthTone: string;
    temporalGuidance: string;
  };
  deweySynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  deweyComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

function getTemporalDeweyRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const inquiryWindow =
    hour >= 5 && hour < 11
      ? '아침 가설 설정창 — 관성적 반응 대신 오늘 시험해 볼 작은 가설을 세우기 좋은 시간'
      : hour >= 11 && hour < 17
        ? '정오 실험 실행창 — 아이디어를 현실의 작은 행동으로 옮겨 결과를 관찰하기 좋은 시간'
        : hour >= 17 && hour < 22
          ? '황혼 반성 성찰창 — 오늘의 경험에서 효과와 오차를 차분히 건져 올리기 좋은 시간'
          : '심야 경험 재구성창 — 내일의 더 나은 실험을 위해 오늘의 배움을 정돈하는 시간';

  const seasonalGrowthTone =
    month >= 3 && month <= 5
      ? '봄 · 탐구 발아절 (호기심을 열고 새 실험을 시작하는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 상호작용절 (환경과 활발히 부딪히며 도구를 벼리는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 반성 결실절 (경험을 성찰해 지혜로 정제하는 시기)'
          : '겨울 · 재구성절 (묵은 습관을 점검하고 다음 성장을 준비하는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d}T${hh}:${mm}:${ss}+09:00 (KST)`,
    inquiryWindow,
    seasonalGrowthTone,
    temporalGuidance: `${inquiryWindow} · ${seasonalGrowthTone}의 리듬으로 탐구를 이어가십시오.`,
  };
}

export const DEWEY_THEMES: DeweyTheme[] = [
  {
    themeKey: 'reflectiveInquiry',
    themeTitleEn: 'Reflective Inquiry: Pausing Habitual Reaction to Reason Through Problem Situations',
    themeTitleKo: '반성적 탐구의 힘 — 맹목적 충동을 멈추고 문제의 본질을 지성적으로 규명하기',
    pragmaticInsight: '존 듀이의 반성적 사고(Reflective Thinking)는 의심과 난관에 부딪혔을 때 일어납니다. 성급하게 결론으로 내달리지 않고, 무엇이 진짜 문제인지 차분히 관찰하고 가설을 세워 검증할 때 참된 돌파구가 열립니다.',
    practicalCounsel: '혼란스러울수록 즉각적인 리액션을 멈추십시오. 당면한 상황을 관찰 가능한 사실들로 분해하고, 여러 대안을 지성적으로 실험해 보십시오. 잘 규명된 문제는 이미 절반쯤 해결된 것입니다.',
  },
  {
    themeKey: 'growthInItself',
    themeTitleEn: 'Growth as an End: Cultivating the Expanding Process of Life Beyond Static Goals',
    themeTitleKo: '성장 그 자체로서의 삶 — 고정된 종착지에 얽매이지 않고 끊임없이 배우고 확장하기',
    pragmaticInsight: '듀이에게 성장의 목적은 어떤 고정된 이상에 도달하는 것이 아니라 ‘더 많은 성장을 가능하게 하는 것’입니다. 삶은 완성된 조각상이 아니라, 끝없이 흘러가며 역량을 넓혀가는 열린 과정입니다.',
    practicalCounsel: '하나의 성패에 전부를 걸며 자신을 소진하지 마십시오. 현재의 경험이 내일의 더 풍요로운 경험으로 이어지는 통로가 되도록 하십시오. 배움과 호기심이 살아있는 한 성장은 멈추지 않습니다.',
  },
  {
    themeKey: 'instrumentalAction',
    themeTitleEn: 'Instrumental Intelligence: Transforming Abstract Ideas into Practical Problem-Solving Tools',
    themeTitleKo: '도구주의적 지성 — 공허한 관념의 유희를 넘어 삶의 난제를 해결하는 유효한 도구 쓰기',
    pragmaticInsight: '지식과 이론은 영원불변의 도그마가 아니라 인간의 삶을 더 낫게 만들기 위해 벼려진 도구(Instrument)입니다. 이론의 참됨은 사변의 그럴듯함이 아니라 현실의 고통을 덜고 문제를 해결하는 실천적 결과에서 증명됩니다.',
    practicalCounsel: '머릿속 사색과 걱정에만 갇혀 있지 마십시오. 당신의 아이디어를 현실의 작은 행동으로 직접 시험해 보십시오. 유용한 것은 발전시키고, 효용을 다한 옛 방식은 미련 없이 새 도구로 바꾸십시오.',
  },
  {
    themeKey: 'dynamicTransaction',
    themeTitleEn: 'Dynamic Transaction: Actively Shaping Circumstances Through Organic Harmony',
    themeTitleKo: '유기체와 환경의 상호작용 — 주어진 조건에 갇히지 않고 능동적으로 상황 개척하기',
    pragmaticInsight: '인간은 환경에 일방적으로 굴종하는 존재도, 환경을 멋대로 파괴하는 군주도 아닙니다. 유기체는 환경과 끊임없이 에너지를 주고받으며(Transaction) 서로를 새롭게 빚어냅니다.',
    practicalCounsel: '주어진 여건을 탓하며 무기력에 빠지지 마십시오. 환경이 주는 자극에 유연하게 반응하되, 당신의 창의적 지성으로 환경의 조건을 새롭게 조율하십시오. 협력적 개척이 새로운 길을 만듭니다.',
  },
];

export const DEWEY_APHORISMS: DeweyAphorism[] = [
  {
    aphorismKey: 'educationIsLife',
    aphorismKo: '교육은 삶을 위한 준비가 아니다. 교육은 삶 그 자체이며, 끊임없는 삶의 재구성이자 성장이다.',
    aphorismEnglish: 'Education is not preparation for life; education is life itself.',
    sourceContext: '존 듀이 《민주주의와 교육(Democracy and Education)》',
    actionGuidance: '‘언젠가 도래할 행복’을 위해 오늘을 희생하지 마십시오. 지금 겪고 있는 일상과 일 속에서 성장과 가치를 발견하십시오.',
  },
  {
    aphorismKey: 'learningFromReflection',
    aphorismKo: '우리는 단순히 경험을 겪는 것만으로 배우지 않는다. 우리는 경험을 반성적으로 성찰함으로써 비로소 배운다.',
    aphorismEnglish: 'We do not learn from experience... we learn from reflecting on experience.',
    sourceContext: '존 듀이 《우리는 어떻게 생각하는가(How We Think)》',
    actionGuidance: '일이 끝난 뒤 그냥 넘기지 마십시오. 무엇이 효과적이었고 무엇이 빗나갔는지 차분히 성찰하는 시간이 내일의 지혜를 만듭니다.',
  },
  {
    aphorismKey: 'arrivingAtGoal',
    aphorismKo: '하나의 목표에 도달하는 것은 영원한 끝이 아니다. 그것은 또 다른 새로운 탐구를 향한 위대한 출발점이다.',
    aphorismEnglish: 'Arriving at one goal is the starting point to another.',
    sourceContext: '존 듀이 《경험과 자연(Experience and Nature)》',
    actionGuidance: '작은 성공에 안주하거나 작은 좌절에 주저앉지 마십시오. 모든 지점은 다음 발걸음을 디딜 수 있는 새로운 디딤돌입니다.',
  },
  {
    aphorismKey: 'conflictGadflyOfThought',
    aphorismKo: '갈등과 혼란은 생각의 쇠파리이다. 그것은 우리를 잠에서 깨워 관찰과 창조적 탐구로 이끈다.',
    aphorismEnglish: 'Conflict is the gadfly of thought. It stirs us to observation and memory.',
    sourceContext: '존 듀이 《인간 본성과 행위(Human Nature and Conduct)》',
    actionGuidance: '장애물이나 예상 밖의 문제를 두려워하지 마십시오. 관습적 타성을 부수고 한 단계 높은 지성을 발휘할 절호의 기회로 삼으십시오.',
  },
];

const TOPIC_GUIDANCE: Record<DeweyQuestionTopic, {
  posture: string;
  practice: string;
  ritual: string;
  reflection: string;
}> = {
  relationship: {
    posture: '독단을 내려놓고 대화와 공동 탐구로 서로의 지평을 넓히는 민주적 소통의 태도',
    practice: '누가 옳은지 겨루기보다, 두 사람이 함께 부딪힌 상황을 공동의 문제로 놓고 실험적인 해법을 대화로 맞춰 보십시오.',
    ritual: '상대의 말 중 내가 아직 맥락을 다 확인하지 못한 부분 한 가지를 추측 대신 질문으로 확인하기.',
    reflection: '이 관계의 갈등은 우리에게 어떤 새로운 소통 방식을 배우라고 깨우고 있습니까?',
  },
  decision: {
    posture: '완벽한 정답을 기다리지 않고 작은 가설을 실행해 결과를 검증하는 실험적 탐구의 태도',
    practice: '전부를 걸고 한 번에 결론 내려 하지 말고, 되돌릴 수 있는 작은 실험(Pilot)으로 가설의 현실성을 먼저 시험하십시오.',
    ritual: '고민 중인 선택에 대해 "내일 바로 시험해 볼 수 있는 최소 행동 1가지" 정하기.',
    reflection: '머릿속 시뮬레이션을 멈추고 현실에서 직접 확인해 보면 바로 드러날 사실은 무엇입니까?',
  },
  healing: {
    posture: '실패를 끝이 아닌 경험의 재구성 재료로 삼아 다음 발걸음을 여는 회복의 태도',
    practice: '겪은 아픔을 단순한 상처로만 두지 마십시오. 무엇이 나를 지치게 했는지 차분히 반성적 성찰로 건져 올리면 내일의 보호막이 됩니다.',
    ritual: '최근 힘들었던 일에서 "다음에 다르게 써먹을 수 있는 단서 한 줄"만 가볍게 메모하기.',
    reflection: '이 경험을 지나온 뒤의 나에게 남아 있는 가장 단단한 배움은 무엇입니까?',
  },
  reflection: {
    posture: '고정된 목표보다 배우고 재구성해 나가는 과정 자체를 살아내는 성장의 태도',
    practice: '지금의 나를 완성품이나 미완성품으로 재단하지 말고, 어제의 습관 중 오늘 새롭게 고쳐 쓸 도구 하나를 찾아보십시오.',
    ritual: '오늘 하루 동안 가장 호기심이 생겼던 순간 하나를 기록해 두기.',
    reflection: '더 많은 배움과 연결을 열어 주기 위해 지금 내가 업데이트할 오래된 방식은 무엇입니까?',
  },
};

function classifyQuestionTopic(question?: string): DeweyQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/연애|사랑|결혼|이별|사람|관계|친구|가족|동료|상사|갈등|소통|대화|협력/.test(q)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|사업|계약|진로|실험|방향|해야|말아야|해결/.test(q)) {
    return 'decision';
  }
  if (/지치|힘들|불안|걱정|우울|슬픔|실패|좌절|회복|휴식|상처/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

const DEWEY_TOPIC_WARNINGS: Record<DeweyQuestionTopic, string> = {
  relationship: '공동 탐구와 대화에 집중하다 상대가 지금 당장 원하는 정서적 공감과 숨 고르기를 분석으로 덮지 않도록 살피십시오.',
  decision: '작은 가설과 실험을 검증하는 데 몰두해 이미 확보된 신뢰와 핵심 원칙까지 유보하지 않도록 균형을 잡으십시오.',
  healing: '경험에서 배움을 건져 올리려다 아직 충분히 쉬지 못한 마음에게 성급한 성장 과제부터 쥐여 주지 마십시오.',
  reflection: '끊임없는 재구성과 개선을 좇다 오늘 이미 잘 작동하고 있는 일상의 안정감을 과소평가하지 않도록 살피십시오.',
};

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function formatKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function calculateAmericanJohnDeweyPragmaticInquiryGrowth(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): AmericanJohnDeweyPragmaticInquiryGrowthResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const kstDate = getKstDateString(now);
  const questionTopic = classifyQuestionTopic(query);

  const seedString = `JOHN-DEWEY-PRAGMATIC-INQUIRY-GROWTH:${name}:${birthDate}:${birthTime}:${gender}:${kstDate}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const reflectiveThinkingInquiryScore = 89 + ((absHash >> 1) % 10);
  const instrumentalIntelligenceAdaptabilityIndex = 88 + ((absHash >> 4) % 11);
  const growthAsLifeProcessVitalityScore = 87 + ((absHash >> 7) % 12);
  const organismEnvironmentInteractionHarmonyIndex = 89 + ((absHash >> 10) % 10);
  const democraticCooperationEmpathyScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % DEWEY_THEMES.length;
  const aphorismIndex = (absHash >> 8) % DEWEY_APHORISMS.length;

  const activeDeweyTheme = DEWEY_THEMES[themeIndex];
  const focalDeweyAphorism = DEWEY_APHORISMS[aphorismIndex];
  const topicGuide = TOPIC_GUIDANCE[questionTopic];

  const guidanceTitle = `존 듀이 실용주의 탐구와 성장의 지혜: ${activeDeweyTheme.themeTitleKo}`;
  const philosophicalCounsel = `존 듀이는 《경험과 자연》과 《민주주의와 교육》을 통해 ` +
    `맹목적 습관을 멈추고 문제의 맥락을 짚는 반성적 사고(Reflective Thinking), 관념을 현실의 난제를 푸는 연장으로 삼는 도구적 지성, ` +
    `그리고 끝없이 지평을 넓혀가는 성장 그 자체로서의 삶을 역설했습니다. ` +
    `현재 마주한 상황에서 가장 유효한 실천적 열쇠는 '${activeDeweyTheme.themeTitleKo}'입니다. ` +
    `${activeDeweyTheme.practicalCounsel} 듀이의 테제 "${focalDeweyAphorism.aphorismKo}" (${focalDeweyAphorism.aphorismEnglish})을 지표로 삼고, ` +
    `${focalDeweyAphorism.actionGuidance}`;

  const counselNote = `'${activeDeweyTheme.themeTitleKo}' 테마와 '${focalDeweyAphorism.aphorismKo}' 테제가 만나 '${topicGuide.posture}'를 제안합니다.`;
  const boundaryNotice = '이 관점은 존 듀이의 실용주의·도구주의 철학을 빌린 상징적 성찰 안내이며, 확정적 예측이나 전문 자문이 아닙니다.';
  const temporalDeweyRhythm = getTemporalDeweyRhythm(now);
  const deweyCrossAxis = `${questionTopic} · ${activeDeweyTheme.themeKey} × ${temporalDeweyRhythm.inquiryWindow.split('—')[0].trim()}`;
  const deweyShadowWarning = DEWEY_TOPIC_WARNINGS[questionTopic];
  const situationalDeweyAudit = {
    focusTheme: `${questionTopic} · 반성적 탐구`,
    inquiryCue: topicGuide.posture,
    tacticalStep: topicGuide.ritual,
  };
  const deweySynthesisMatrix = {
    coreInsight: activeDeweyTheme.themeTitleKo,
    recommendedAction: topicGuide.practice,
    cautionNotice: '관념의 시뮬레이션에만 머물지 말고 작고 되돌릴 수 있는 현실의 실험으로 확인하십시오.',
  };

  const trimmedQ = (query ?? '').trim();
  const reflectiveQuestion = trimmedQ
    ? `‘${trimmedQ}’라는 물음을 머릿속 고민에만 두지 않고, 오늘 바로 시험해 볼 수 있는 작고 되돌릴 수 있는 실험 한 가지는 무엇인가요?`
    : topicGuide.reflection;

  return {
    engineVersion: AMERICAN_JOHN_DEWEY_PRAGMATIC_INQUIRY_GROWTH_VERSION,
    calculatedAtKst: temporalDeweyRhythm.kstTimeLabel,
    questionTopic,
    inquiryPosture: topicGuide.posture,
    deweyCrossAxis,
    deweyShadowWarning,
    reflectiveThinkingInquiryScore,
    instrumentalIntelligenceAdaptabilityIndex,
    growthAsLifeProcessVitalityScore,
    organismEnvironmentInteractionHarmonyIndex,
    democraticCooperationEmpathyScore,
    activeDeweyTheme,
    focalDeweyAphorism,
    practiceGuidance: topicGuide.practice,
    ritualAction: topicGuide.ritual,
    reflectionFocus: topicGuide.reflection,
    reflectiveQuestion,
    counselNote,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    situationalDeweyAudit,
    temporalDeweyRhythm,
    deweySynthesisMatrix,
    deweyComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAmericanJohnDeweyPragmaticInquiryGrowthPrompt(
  res: AmericanJohnDeweyPragmaticInquiryGrowthResult,
): string {
  return [
    `【존 듀이 《경험과 자연·민주주의와 교육》 반성적 사고(Reflective Inquiry)·성장 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락 초점: ${res.questionTopic} | 탐구 태도: ${res.inquiryPosture}`,
    `- 듀이 교차 축: ${res.deweyCrossAxis}`,
    `- 과잉·편향 경계: ${res.deweyShadowWarning}`,
    `- KST 시공간 리듬: ${res.temporalDeweyRhythm.inquiryWindow} / ${res.temporalDeweyRhythm.seasonalGrowthTone}`,
    `- 핵심 듀이 테마: ${res.activeDeweyTheme.themeTitleKo} [${res.activeDeweyTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeDeweyTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeDeweyTheme.practicalCounsel}`,
    `- 듀이 원전 테제: "${res.focalDeweyAphorism.aphorismKo}" (${res.focalDeweyAphorism.aphorismEnglish})`,
    `- 원전 출처: [${res.focalDeweyAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDeweyAphorism.actionGuidance}`,
    `- 맥락별 실행 조언: ${res.practiceGuidance}`,
    `- 오늘의 작은 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.deweySynthesisMatrix.coreInsight}) | 실행(${res.deweySynthesisMatrix.recommendedAction}) | 주의(${res.deweySynthesisMatrix.cautionNotice})`,
    `- 핵심 조언 요약: ${res.counselNote}`,
    `- 해석 경계: ${res.boundaryNotice}`,
    `- 종합 듀이 권면: ${res.deweyComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
