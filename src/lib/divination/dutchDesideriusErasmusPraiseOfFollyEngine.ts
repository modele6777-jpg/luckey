/**
 * 네덜란드 데시데리우스 에라스무스(Desiderius Erasmus) 《우신예찬(Moriae Encomium)》 & 《격언집(Adagia)》 우신의 지혜·르네상스 휴머니즘 & 해학적 통찰·도그마 타파 관용 지혜 엔진
 *
 * 16세기 르네상스 인문주의의 거장 에라스무스(1466~1536) 선생의 명저 《우신예찬(Moriae Encomium / Stultitiae Laus)》 원전 기반:
 * 1. 우신(Moria)의 해학적 지혜와 위트 지수 (Humorous Wisdom & Wit Score): 숨 막히는 경직성과 엄숙주의를 깨뜨리는 유쾌한 풍자와 자기 성찰의 위트.
 * 2. 도그마·편견 타파 및 유연한 분별력 (Dogma & Prejudice Dissolution Index): 맹목적 독단과 지식인의 허영을 걷어내고 실재를 있는 그대로 직시하는 유연한 지성.
 * 3. 르네상스 휴머니즘 관용 및 인간성 포용도 (Humanistic Tolerance & Acceptance Score): 인간의 불완전성과 연약함을 비난하지 않고 따뜻하게 품어주는 깊은 관용.
 * 4. 사변적 형식주의 탈피와 소박한 실천 덕성 지수 (Sincere Practical Virtue Index): 헛된 말장난과 허례허식을 배격하고 삶의 현장에서 행동으로 드러나는 참된 선의.
 * 5. 유쾌한 삶의 긍정과 회복탄력성 (Cheerful Life Affirmation & Resilience Score): 시련과 오해 앞에서도 냉소에 빠지지 않고 웃음과 지혜로 일어서는 회복탄력성.
 *
 * @version LUCKEY-ERASMUS-PRAISE-OF-FOLLY-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const DUTCH_DESIDERIUS_ERASMUS_PRAISE_OF_FOLLY_VERSION = 'LUCKEY-ERASMUS-PRAISE-OF-FOLLY-v2.1.0';

export type ErasmusQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface ErasmusTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  humanismTone: string;
  rhythmDirective: string;
}

export interface ErasmusTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface ErasmusAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismLatin: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface DutchDesideriusErasmusPraiseOfFollyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 에라스무스 우신예찬 핵심 지표 (0~100)
  follyHumorousWisdomScore: number;               // 해학적 지혜와 위트 (Humorous Wisdom & Wit)
  dogmaticPrejudiceDissolutionIndex: number;      // 도그마·편견 타파 분별력 (Dogma Dissolution)
  renaissanceHumanisticToleranceScore: number;    // 르네상스 휴머니즘 관용 (Humanistic Tolerance)
  practicalSincereVirtueIndex: number;            // 소박한 실천 덕성 (Sincere Practical Virtue)
  cheerfulResilienceScore: number;                // 유쾌한 삶의 긍정 회복탄력성 (Cheerful Resilience)
  // 세부 분석
  questionTopic: ErasmusQuestionTopic;
  temporalErasmusRhythm: ErasmusTemporalRhythm;
  activeErasmusTheme: ErasmusTheme;
  focalErasmusAphorism: ErasmusAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  erasmusSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  erasmusComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const ERASMUS_THEMES: ErasmusTheme[] = [
  {
    themeKey: 'praiseOfFolly',
    themeTitleEn: 'Praise of Holy Folly: Piercing Rigidity with Graceful Humor',
    themeTitleKo: '우신(愚神)의 지혜 — 지나친 엄숙주의를 허물고 웃음과 위트로 생기를 되찾기',
    pragmaticInsight: '스스로 완벽하다고 믿는 지식인의 오만보다, 인간의 결점을 웃으며 인정하는 우신의 겸허함이 삶을 훨씬 풍요롭고 부드럽게 만듭니다. 유머는 굳어버린 마음을 유연하게 녹이는 최고의 해독제입니다.',
    practicalCounsel: '지나치게 자신을 몰아세우거나 모든 상황을 심각하게만 받아들이지 마십시오. 작은 실수는 유쾌한 웃음으로 넘기고, 위트와 여유를 가지고 상황의 핵심을 부드럽게 통찰하십시오.',
  },
  {
    themeKey: 'humanisticTolerance',
    themeTitleEn: 'Humanistic Tolerance: Embracing the Fragile Multitudes of Humanity',
    themeTitleKo: '르네상스 휴머니즘 관용 — 불완전한 인간 조건을 자비와 포용으로 안아주기',
    pragmaticInsight: '모든 갈등과 증오는 내가 옳고 상대는 틀렸다는 흑백논리의 도그마에서 출발합니다. 타인의 연약함 속에서 나 자신의 모습을 발견할 때 참된 화해와 평온이 깃듭니다.',
    practicalCounsel: '잣대를 들이대며 타인을 심판하려 들지 마십시오. 상대방의 한계와 두려움을 너그럽게 헤아리고, 열린 마음으로 다양성을 포용하여 관계의 숨통을 틔워 주십시오.',
  },
  {
    themeKey: 'philosophyOfChrist',
    themeTitleEn: 'Philosophia Christi: Simple Living Heart Over Theological Vanity',
    themeTitleKo: '소박한 실천 덕성 — 헛된 말장난과 의전을 걷어내고 마음의 순수함으로 살기',
    pragmaticInsight: '탁상공론과 복잡한 교리 논쟁은 영혼을 메마르게 할 뿐입니다. 참된 지혜는 화려한 수사나 껍데기가 아니라, 일상에서 베푸는 친절과 정직한 한 걸음에 있습니다.',
    practicalCounsel: '복잡한 명분이나 겉치레에 얽매이지 마십시오. 본질로 돌아가 가장 기본적이고 소박한 선의를 실천하고, 일상의 작은 일들을 진실하게 대하십시오.',
  },
  {
    themeKey: 'freedomOfWill',
    themeTitleEn: 'De Libero Arbitrio: Dignified Agency and Moral Cooperation',
    themeTitleKo: '자유의지의 존엄 — 운명의 굴레를 핑계 삼지 않고 주체적으로 선을 선택하기',
    pragmaticInsight: '인간은 무력한 꼭두각시가 아니라, 스스로 삶의 방향을 조율하고 더 나은 세상을 향해 협력할 수 있는 존엄한 자유의지(Liberum Arbitrium)를 부여받은 존재입니다.',
    practicalCounsel: '환경을 탓하거나 체념에 빠지지 마십시오. 당신에게 주어진 선택의 자유를 주체적으로 행사하여, 오늘 한 뼘 더 선하고 아름다운 결단을 내리십시오.',
  },
  {
    themeKey: 'peaceIrenicism',
    themeTitleEn: 'Querela Pacis: The Complaint of Peace & Harmonious Moderation',
    themeTitleKo: '평화의 호소(Querela Pacis) — 반목을 멈추고 온건한 중용과 상생으로 나아가기',
    pragmaticInsight: '가장 불리한 평화라도 가장 정의로운 전쟁보다 낫다는 에라스무스의 통찰처럼, 파괴적인 다툼을 이겨내는 가장 위대한 힘은 상호 양보와 사려 깊은 대화에 있습니다.',
    practicalCounsel: '감정적인 대립과 승패의 집착을 내려놓으십시오. 먼저 손을 내밀어 타협점을 모색하고, 상호 이익과 마음의 평화를 지키는 온건한 중용을 택하십시오.',
  },
];

export const ERASMUS_APHORISMS: ErasmusAphorism[] = [
  {
    aphorismKey: 'humorLightensLife',
    aphorismKo: '스스로의 어리석음을 웃어넘길 줄 아는 자만이 삶의 참된 평온을 누린다.',
    aphorismLatin: 'Stultitia est gaudium animi et vita ipsa.',
    sourceContext: '에라스무스 《우신예찬(Moriae Encomium)》',
    actionGuidance: '완벽주의의 강박을 내려놓고 자신에게 너그러워지십시오. 유쾌한 유머 감각으로 마음에 산소와 활력을 불어넣으십시오.',
  },
  {
    aphorismKey: 'knowledgeAndHumility',
    aphorismKo: '아는 것이 많을수록 오만해지지 않고, 인간의 한계 앞에 더욱 겸허해진다.',
    aphorismLatin: 'Veritas odium parit, obsequium amicos.',
    sourceContext: '에라스무스 《격언집(Adagia)》',
    actionGuidance: '지식의 자랑을 멈추고 경청하십시오. 겸허한 자세로 타인의 지혜를 배우며 마음을 넓히십시오.',
  },
  {
    aphorismKey: 'simpleVirtue',
    aphorismKo: '진정한 학문과 덕성은 현란한 말이 아니라 따뜻하고 올곧은 행동으로 증명된다.',
    aphorismLatin: 'Non clamore sed virtute probatur animus.',
    sourceContext: '에라스무스 《기독교 군주 교육(Institutio Principis Christiani)》',
    actionGuidance: '말만 앞세우지 말고 묵묵히 실천하십시오. 소박하지만 확실한 행동으로 당신의 진심을 보여주십시오.',
  },
  {
    aphorismKey: 'peaceOverConflict',
    aphorismKo: '승리 없는 평화는 있어도, 상처 없는 싸움은 없다.',
    aphorismLatin: 'Iniquissima pax est anteponenda iustissimo bello.',
    sourceContext: '에라스무스 《평화의 호소(Querela Pacis)》',
    actionGuidance: '소모적인 자존심 싸움을 멈추십시오. 평화를 지키는 것이 궁극적으로 당신의 힘과 에너지를 온존하는 길입니다.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function classifyErasmusQuestionTopic(query?: string): ErasmusQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/사랑|연애|관계|결혼|이별|가족|친구|갈등|사람|동료|부모/.test(q)) return 'relationship';
  if (/선택|결정|이직|사업|진로|시험|돈|투자|계약|시작|포기|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|상처|치유|위로|외로|슬픔|걱정|두려|피곤/.test(q)) return 'healing';
  return 'reflection';
}

function buildErasmusTemporalRhythm(now?: Date): ErasmusTemporalRhythm {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const kstDateLabel = kst.toISOString().slice(0, 10);
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 11) {
    return {
      kstDateLabel,
      timeWindowKo: '아침 경직 해제의 시간 (05:00~11:00 KST)',
      humanismTone: '가벼운 위트와 유연한 시작',
      rhythmDirective: '지나친 완벽주의를 내려놓고 유쾌한 여유로 하루를 여는 시간입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstDateLabel,
      timeWindowKo: '낮 소박한 선의 실천 시간 (11:00~17:00 KST)',
      humanismTone: '형식보다 진실한 행동',
      rhythmDirective: '겉치레와 명분 논쟁을 걷어내고 작지만 실질적인 친절과 평화를 택하는 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstDateLabel,
      timeWindowKo: '저녁 휴머니즘 관용의 시간 (17:00~22:00 KST)',
      humanismTone: '인간적 연약함에 대한 너그러움',
      rhythmDirective: '나와 타인의 서툰 점들을 탓하기보다 웃음과 관용으로 감싸 안기 좋은 시간입니다.',
    };
  }
  return {
    kstDateLabel,
    timeWindowKo: '심야 도그마 비움의 시간 (22:00~05:00 KST)',
    humanismTone: '겸허한 성찰과 평온',
    rhythmDirective: '흑백논리와 자기 비난을 거두고 마음의 온건한 중용을 회복하는 시간입니다.',
  };
}

function buildErasmusTopicGuidance(topic: ErasmusQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '내가 옳고 상대가 틀렸다는 엄숙한 재판을 멈추고, 인간의 불완전함을 유머와 관용으로 먼저 품어 주십시오.',
      ritualAction: '갈등이 맴도는 상대의 서툰 점 한 가지를 비난 대신 웃어넘길 여지로 바꿔 보기',
      reflectionFocus: '지금 이 관계에서 내가 놓지 못하고 있는 것은 진실인가, 아니면 옳고 싶다는 자존심인가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '완벽한 정답을 쥔 체면보다, 소모적인 다툼을 피하고 평화와 실질을 지키는 온건한 선택을 고르십시오.',
      ritualAction: '결정 전 "이 선택이 내 마음의 평화와 일상의 선의를 지키는가" 한 줄 점검하기',
      reflectionFocus: '거창한 명분이나 타인의 시선을 걷어내면 가장 소박하고 지혜로운 선택은 무엇인가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '완벽해야 한다는 무거운 갑옷을 벗고 스스로의 실수마저 가볍게 웃어넘길 때 마음에 숨통이 트입니다.',
      ritualAction: '오늘 나를 괴롭힌 자책 한 가지를 "사람이니 그럴 수 있지"라고 소리 내어 풀어 주기',
      reflectionFocus: '나는 지금 나 자신에게 너무 엄격한 도그마를 들이대고 있지는 않은가?',
    };
  }
  return {
    practiceGuidance: '딱딱한 형식주의와 흑백논리를 내려놓고 유쾌한 위트와 겸허한 호기심으로 오늘을 바라보십시오.',
    ritualAction: '오늘 너무 심각하게 붙잡고 있던 고민 하나를 한 걸음 물러나 가볍게 바라보기',
    reflectionFocus: '내 생각 중 사실이 아니라 습관적 편견이나 엄숙주의에서 나온 것은 무엇인가?',
  };
}

export function calculateDutchDesideriusErasmusPraiseOfFolly(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): DutchDesideriusErasmusPraiseOfFollyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalErasmusRhythm = buildErasmusTemporalRhythm(now);
  const questionTopic = classifyErasmusQuestionTopic(query);
  const topicGuidance = buildErasmusTopicGuidance(questionTopic);

  const seedString = `ERASMUS-PRAISE-OF-FOLLY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalErasmusRhythm.kstDateLabel}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const follyHumorousWisdomScore = 84 + ((absHash >> 1) % 15);
  const dogmaticPrejudiceDissolutionIndex = 83 + ((absHash >> 4) % 16);
  const renaissanceHumanisticToleranceScore = 86 + ((absHash >> 7) % 13);
  const practicalSincereVirtueIndex = 82 + ((absHash >> 10) % 17);
  const cheerfulResilienceScore = 85 + ((absHash >> 13) % 14);

  const themeIndex = (absHash >> 5) % ERASMUS_THEMES.length;
  const aphorismIndex = (absHash >> 8) % ERASMUS_APHORISMS.length;

  const activeErasmusTheme = ERASMUS_THEMES[themeIndex];
  const focalErasmusAphorism = ERASMUS_APHORISMS[aphorismIndex];

  const guidanceTitle = `에라스무스 우신예찬 르네상스 휴머니즘 지혜: ${activeErasmusTheme.themeTitleKo}`;
  const philosophicalCounsel = `르네상스 휴머니즘의 사상가 에라스무스는 《우신예찬》을 통해 숨 막히는 독단과 엄숙주의를 유쾌하게 비틀며, ` +
    `인간의 연약함을 품어주는 따스한 관용과 소박한 선의의 가치를 비춥니다. ` +
    `현재 당신의 상황을 명쾌하게 풀어내는 핵심 원리는 '${activeErasmusTheme.themeTitleKo}'입니다. ` +
    `${activeErasmusTheme.practicalCounsel} ${topicGuidance.practiceGuidance} "${focalErasmusAphorism.aphorismKo}"(${focalErasmusAphorism.aphorismLatin})을 떠올리며, ` +
    `${focalErasmusAphorism.actionGuidance}`;

  const boundaryNotice = '에라스무스 우신예찬 해석은 경직된 편견을 풀고 관용과 유머를 회복하도록 돕는 상징·성찰 관점이며, 미래 예측이나 확정적 판단이 아닙니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${temporalErasmusRhythm.kstDateLabel} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} KST`;
  const erasmusSynthesisMatrix = {
    coreInsight: activeErasmusTheme.themeTitleKo,
    recommendedAction: topicGuidance.practiceGuidance,
    cautionNotice: '지나친 엄숙주의나 흑백논리에 갇혀 자신과 타인의 연약함을 가혹하게 재단하지 마십시오.',
  };

  return {
    engineVersion: DUTCH_DESIDERIUS_ERASMUS_PRAISE_OF_FOLLY_VERSION,
    calculatedAtKst: kstTimeLabel,
    follyHumorousWisdomScore,
    dogmaticPrejudiceDissolutionIndex,
    renaissanceHumanisticToleranceScore,
    practicalSincereVirtueIndex,
    cheerfulResilienceScore,
    questionTopic,
    temporalErasmusRhythm,
    activeErasmusTheme,
    focalErasmusAphorism,
    practiceGuidance: topicGuidance.practiceGuidance,
    ritualAction: topicGuidance.ritualAction,
    reflectionFocus: topicGuidance.reflectionFocus,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    erasmusSynthesisMatrix,
    erasmusComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatDutchDesideriusErasmusPraiseOfFollyPrompt(
  res: DutchDesideriusErasmusPraiseOfFollyResult,
): string {
  return [
    `【데시데리우스 에라스무스 《우신예찬》 르네상스 휴머니즘 및 해학·관용 지혜 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- KST 시공간 리듬: ${res.temporalErasmusRhythm.kstDateLabel} · ${res.temporalErasmusRhythm.timeWindowKo} (${res.temporalErasmusRhythm.humanismTone}) — ${res.temporalErasmusRhythm.rhythmDirective}`,
    `- 핵심 에라스무스 테마: ${res.activeErasmusTheme.themeTitleKo} [${res.activeErasmusTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeErasmusTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeErasmusTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 핵심 성찰 질문: ${res.reflectionFocus}`,
    `- 교차 매트릭스: 핵심(${res.erasmusSynthesisMatrix.coreInsight}) | 실행(${res.erasmusSynthesisMatrix.recommendedAction}) | 주의(${res.erasmusSynthesisMatrix.cautionNotice})`,
    `- 에라스무스 원전 명언: "${res.focalErasmusAphorism.aphorismKo}" (${res.focalErasmusAphorism.aphorismLatin})`,
    `- 원전 출처: [${res.focalErasmusAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalErasmusAphorism.actionGuidance}`,
    `- 종합 에라스무스 권면: ${res.erasmusComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
