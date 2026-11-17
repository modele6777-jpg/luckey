/**
 * 영국 토머스 모어(Thomas More) 《유토피아(Utopia)》 공동체 양심 & 삶의 균형(노동·여가)·내면 순결과 공공 정의 지혜 엔진
 *
 * 16세기 영국의 위대한 대법관이자 르네상스 사상가 토머스 모어(1478~1535) 선생의 명저 《유토피아(Utopia)》 원전 기반:
 * 1. 공동체적 양심과 공공선 정의 지수 (Communal Conscience & Public Justice Score): 탐욕과 사리사욕의 폐단을 통찰하고 정의롭고 평등한 공공선을 지향하는 양심.
 * 2. 노동과 여가(Otium)·학문과 예술의 균형 조화도 (Labor & Contemplative Leisure Balance Index): 하루 6시간 노동과 배움, 사색, 예술이 어우러지는 이상적 삶의 균형.
 * 3. 물질적 탐욕을 초월한 영혼의 순결함 및 청빈 지수 (Spiritual Integrity & Incorruptibility Score): 금은보화의 헛된 허세를 비우고 참된 정신적 평온과 덕성을 추구하는 청백함.
 * 4. 현실의 부조리를 꿰뚫고 대안을 설계하는 이상주의적 통찰력 (Visionary Ideal & Social Wisdom Index): "양들이 사람을 잡아먹는다"는 비판처럼 현실 문제를 정밀 진단하고 대안을 제시하는 힘.
 * 5. 외적 압박 앞에서도 신념을 굽히지 않는 단호한 도덕적 용기 회복탄력성 (Steadfast Moral Courage Resilience Score): 권력의 위협 앞에서도 타협하지 않고 양심의 법정을 지켜낸 불굴의 기개.
 *
 * @version LUCKEY-THOMAS-MORE-UTOPIA-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const BRITISH_THOMAS_MORE_UTOPIA_VERSION = 'LUCKEY-THOMAS-MORE-UTOPIA-v2.1.0';

export type MoreQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface MoreTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  utopiaTone: string;
  rhythmDirective: string;
}

export interface ThomasMoreTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface ThomasMoreAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismLatin: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface BritishThomasMoreUtopiaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 토머스 모어 유토피아 핵심 지표 (0~100)
  communalConscienceJusticeScore: number;           // 공동체 양심과 공공선 정의 (Communal Justice)
  laborOtiumBalancedHarmonyIndex: number;           // 노동과 여가(Otium)의 조화 (Labor & Leisure Balance)
  spiritualIntegrityPurityScore: number;            // 영혼의 순결함과 청빈 (Spiritual Integrity)
  visionarySocialReformIndex: number;               // 이상주의적 대안 통찰력 (Visionary Insight)
  steadfastMoralCourageResilienceScore: number;     // 도덕적 용기 회복탄력성 (Steadfast Moral Courage)
  // 세부 분석
  questionTopic: MoreQuestionTopic;
  temporalMoreRhythm: MoreTemporalRhythm;
  activeMoreTheme: ThomasMoreTheme;
  focalMoreAphorism: ThomasMoreAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  moreSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  moreComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const THOMAS_MORE_THEMES: ThomasMoreTheme[] = [
  {
    themeKey: 'laborAndOtiumBalance',
    themeTitleEn: 'Balance of Labor and Noble Leisure: Cultivating the Mind',
    themeTitleKo: '노동과 여가의 황금 균형 — 쉼과 사색을 통해 영혼의 고귀함을 가꾸기',
    pragmaticInsight: '유토피아 시민들은 과도한 노동에 얽매여 노예처럼 살지 않습니다. 하루 일과를 균형 있게 안배하고, 남은 시간을 학문과 음악, 사색과 친교에 쏟으며 인간다운 삶을 누립니다.',
    practicalCounsel: '워커홀릭의 덫이나 무기력한 나태에 빠지지 마십시오. 생산적인 집중 시간과 영혼을 재충전하는 질 높은 여가(Otium)의 균형을 명확한 루틴으로 설계하십시오.',
  },
  {
    themeKey: 'commonWealthJustice',
    themeTitleEn: 'The Commonwealth of Equity: Transcending Private Greed for the Common Good',
    themeTitleKo: '공공선의 정의 — 나 혼자만의 사욕을 넘어 모두가 함께 번영하는 토대 세우기',
    pragmaticInsight: '사리사욕과 독점은 필연적으로 불안과 불평등을 낳습니다. 자원을 투명하게 나누고 타인의 성장을 북돋울 때, 내 자리 또한 가장 안전하고 견고해집니다.',
    practicalCounsel: '눈앞의 단기적 독점욕을 내려놓으십시오. 파트너와 동료들에게 공정하게 기회를 나누고, 팀과 공동체 전체가 신뢰 속에서 상생할 수 있는 시스템을 구축하십시오.',
  },
  {
    themeKey: 'scornOfVanity',
    themeTitleEn: 'Scorn of Golden Shackles: Freedom from Material Ostentation',
    themeTitleKo: '헛된 치레의 초월 — 황금의 족쇄를 부수고 본질적인 내면의 평온을 추구하기',
    pragmaticInsight: '유토피아인들은 금은보화를 허황된 겉치레로 여겨 죄수들의 쇠사슬로 썼습니다. 외적인 장식과 세속의 잣대에 휘둘리지 않을 때 비로소 진정한 내적 자유가 열립니다.',
    practicalCounsel: '남들에게 과시하기 위한 소비와 체면치레를 과감히 정리하십시오. 단순하고 본질적인 것에 집중하며, 진정한 지적·정서적 만족을 주는 가치에 에너지를 쏟으십시오.',
  },
  {
    themeKey: 'integrityOfConscience',
    themeTitleEn: 'Sanctuary of Conscience: Unwavering Moral Fidelity to Truth',
    themeTitleKo: '양심의 거룩한 성채 — 세상의 어떤 압력 앞에서도 내면의 정직함 지키기',
    pragmaticInsight: '토머스 모어는 런던탑에 갇히고 단두대에 오르는 순간까지 영혼의 양심을 팔지 않았습니다. 세상의 모든 것을 잃더라도 양심의 순결함을 지키는 자는 결코 패배하지 않습니다.',
    practicalCounsel: '편의를 위해 부당한 타협을 하거나 스스로의 양심을 속이지 마십시오. 당장은 손해처럼 보일지라도 원칙과 진실을 지킬 때 영원히 무너지지 않는 자존감이 형성됩니다.',
  },
  {
    themeKey: 'indirectPrudence',
    themeTitleEn: 'The Art of Pragmatic Philosophy: Navigating the Storm with Indirect Prudence',
    themeTitleKo: '유연한 우회적 지혜 — 세파를 헤치며 최선을 다해 악을 줄이고 선을 유도하기',
    pragmaticInsight: '폭풍우 치는 바다에서 배를 버릴 수 없듯, 세상이 완벽하지 않다고 하여 도망치거나 방관해서는 안 됩니다. 상황에 맞추어 유연하고 지혜롭게 악을 줄여가는 실천적 분별력이 필요합니다.',
    practicalCounsel: '극단적인 이상주의에 빠져 현실을 부정하지 마십시오. 주어진 조건 속에서 유연하게 대처하며, 차근차근 상황을 개선할 수 있는 현실적이고 실천적인 해법을 찾으십시오.',
  },
];

export const THOMAS_MORE_APHORISMS: ThomasMoreAphorism[] = [
  {
    aphorismKey: 'otiumAnimorum',
    aphorismKo: '삶의 주된 목적은 육체의 멍에를 벗어나 영혼의 자유와 학문을 가꾸는 데 있다.',
    aphorismLatin: 'Vitae institutio ad animi libertatem cultumque refertur.',
    sourceContext: '토머스 모어 《유토피아(Utopia)》 제2권',
    actionGuidance: '일과 삶의 경계를 단단히 세우십시오. 당신의 정신과 영혼을 살찌우는 고요한 독서와 사색의 시간을 매일 반드시 확보하십시오.',
  },
  {
    aphorismKey: 'conscienceKing',
    aphorismKo: '나는 국왕의 충직한 신하이지만, 무엇보다 먼저 양심의 명령을 따르는 자이다.',
    aphorismLatin: 'Fidelis sum regi, sed primum Deo et conscientiae.',
    sourceContext: '토머스 모어 최후의 유언',
    actionGuidance: '외부의 눈치나 타인의 압박에 휘둘리지 말고, 당신 마음속 가장 깊은 곳의 정직한 양심의 목소리에 귀를 기울이십시오.',
  },
  {
    aphorismKey: 'pragmaticNavigation',
    aphorismKo: '바람을 바꿀 수 없더라도 돛을 지혜롭게 다스려 배를 바른 방향으로 이끌어야 한다.',
    aphorismLatin: 'Non ideo reliquenda est navis in tempestate, quod ventos inhibere non possis.',
    sourceContext: '토머스 모어 《유토피아(Utopia)》 제1권',
    actionGuidance: '통제할 수 없는 외적 환경을 원망하지 말고, 지금 당장 당신이 쥐고 있는 돛과 키를 능숙하게 조율하십시오.',
  },
  {
    aphorismKey: 'innerVirtueWealth',
    aphorismKo: '진정한 부(富)는 소유의 많음이 아니라, 탐욕이 적고 마음이 평온한 데 있다.',
    aphorismLatin: 'Vera divitia non in opibus, sed in animi tranquillitate posita est.',
    sourceContext: '토머스 모어 《유토피아(Utopia)》 제2권',
    actionGuidance: '과도한 소유욕과 물질적 비교를 내려놓으십시오. 단순한 삶 속에서 맑은 평온을 누릴 때 최고의 풍요가 찾아옵니다.',
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

function classifyMoreQuestionTopic(query?: string): MoreQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/사랑|연애|관계|결혼|이별|가족|친구|갈등|사람|동료|부모/.test(q)) return 'relationship';
  if (/선택|결정|이직|사업|진로|시험|돈|투자|계약|시작|포기|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|상처|치유|위로|외로|슬픔|걱정|두려|피곤/.test(q)) return 'healing';
  return 'reflection';
}

function buildMoreTemporalRhythm(now?: Date): MoreTemporalRhythm {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const kstDateLabel = kst.toISOString().slice(0, 10);
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 11) {
    return {
      kstDateLabel,
      timeWindowKo: '아침 양심 정돈의 시간 (05:00~11:00 KST)',
      utopiaTone: '맑은 양심과 하루의 질서 세우기',
      rhythmDirective: '과욕을 비우고 오늘 지켜야 할 공정과 일의 경계를 차분히 정하기 좋은 시간입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstDateLabel,
      timeWindowKo: '낮 공동선 실천의 시간 (11:00~17:00 KST)',
      utopiaTone: '집중된 노동과 우회적 지혜',
      rhythmDirective: '폭풍 속 배의 돛을 조율하듯 현실 조건 속에서 최선을 다해 선을 넓히는 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstDateLabel,
      timeWindowKo: '저녁 오티움(Otium)의 시간 (17:00~22:00 KST)',
      utopiaTone: '노동의 마침표와 영혼의 여가',
      rhythmDirective: '일과를 내려놓고 독서·대화·예술로 영혼의 자유를 회복하기 좋은 시간입니다.',
    };
  }
  return {
    kstDateLabel,
    timeWindowKo: '심야 양심 성찰의 시간 (22:00~05:00 KST)',
    utopiaTone: '내면의 고요와 흔들리지 않는 중심',
    rhythmDirective: '세속의 소음을 끄고 양심의 법정 앞에서 스스로의 진실함을 돌아보는 시간입니다.',
  };
}

function buildMoreTopicGuidance(topic: MoreQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '독점과 비교를 내려놓고 서로의 몫과 품위를 존중할 때 관계의 공동선이 단단해집니다.',
      ritualAction: '가까운 사람에게 결과나 조건 없이 공정하고 따뜻한 인정 한마디 건네기',
      reflectionFocus: '이 관계에서 나는 몫을 나누는 쪽에 서 있는가, 아니면 내 불안으로 움켜쥐고 있는가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '당장의 허세나 단기 이익보다 내 양심이 부끄럽지 않고 오래 지속할 수 있는 균형을 고르십시오.',
      ritualAction: '선택지 옆에 "이 결정이 일과 쉼, 양심을 지키는가" 한 줄 기준 적어 보기',
      reflectionFocus: '바람을 바꿀 수 없는 현실 속에서 내가 정직하게 조율할 수 있는 돛은 무엇인가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '끝없는 노동의 멍에에서 잠시 내려와 아무 생산성도 증명하지 않는 순수한 여가(Otium)를 허락하십시오.',
      ritualAction: '오늘 20분간 일과 화면을 닫고 산책·음악·독서 중 한 가지로 영혼 쉬게 하기',
      reflectionFocus: '나는 지금 나 자신을 돌보는 일까지 성과나 의무로 밀어붙이고 있지는 않은가?',
    };
  }
  return {
    practiceGuidance: '겉치레와 비교의 족쇄를 풀고 단순하고 정직한 일상의 질서를 단단히 세우십시오.',
    ritualAction: '오늘 나를 불필요하게 지치게 한 허례나 과욕 한 가지를 목록에서 지우기',
    reflectionFocus: '내 삶에서 정말 지키고 싶은 양심의 중심과 적정한 쉼의 비율은 어디에 있는가?',
  };
}

export function calculateBritishThomasMoreUtopia(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): BritishThomasMoreUtopiaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalMoreRhythm = buildMoreTemporalRhythm(now);
  const questionTopic = classifyMoreQuestionTopic(query);
  const topicGuidance = buildMoreTopicGuidance(questionTopic);

  const seedString = `THOMAS-MORE-UTOPIA:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalMoreRhythm.kstDateLabel}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const communalConscienceJusticeScore = 85 + ((absHash >> 1) % 14);
  const laborOtiumBalancedHarmonyIndex = 83 + ((absHash >> 4) % 16);
  const spiritualIntegrityPurityScore = 87 + ((absHash >> 7) % 12);
  const visionarySocialReformIndex = 84 + ((absHash >> 10) % 15);
  const steadfastMoralCourageResilienceScore = 86 + ((absHash >> 13) % 13);

  const themeIndex = (absHash >> 5) % THOMAS_MORE_THEMES.length;
  const aphorismIndex = (absHash >> 8) % THOMAS_MORE_APHORISMS.length;

  const activeMoreTheme = THOMAS_MORE_THEMES[themeIndex];
  const focalMoreAphorism = THOMAS_MORE_APHORISMS[aphorismIndex];

  const guidanceTitle = `토머스 모어 유토피아 양심과 삶의 균형 지혜: ${activeMoreTheme.themeTitleKo}`;
  const philosophicalCounsel = `영국의 사상가 토머스 모어는 《유토피아》를 통해 탐욕과 불평등을 넘어 노동과 여가의 조화, ` +
    `내면의 순결한 양심, 그리고 공공선의 균형을 비춥니다. ` +
    `현재 당신의 흐름에서 핵심이 되는 관점은 '${activeMoreTheme.themeTitleKo}'입니다. ` +
    `${activeMoreTheme.practicalCounsel} ${topicGuidance.practiceGuidance} "${focalMoreAphorism.aphorismKo}"(${focalMoreAphorism.aphorismLatin})의 뜻처럼, ` +
    `${focalMoreAphorism.actionGuidance}`;

  const boundaryNotice = '토머스 모어 유토피아 해석은 노동·여가의 균형과 양심적 성찰을 돕는 상징 관점이며, 미래 예측이나 확정적 판단이 아닙니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${temporalMoreRhythm.kstDateLabel} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} KST`;
  const moreSynthesisMatrix = {
    coreInsight: activeMoreTheme.themeTitleKo,
    recommendedAction: topicGuidance.practiceGuidance,
    cautionNotice: '단기적 탐욕과 체면치레에 휘둘려 노동·쉼의 균형과 내면의 양심을 팔지 마십시오.',
  };

  return {
    engineVersion: BRITISH_THOMAS_MORE_UTOPIA_VERSION,
    calculatedAtKst: kstTimeLabel,
    communalConscienceJusticeScore,
    laborOtiumBalancedHarmonyIndex,
    spiritualIntegrityPurityScore,
    visionarySocialReformIndex,
    steadfastMoralCourageResilienceScore,
    questionTopic,
    temporalMoreRhythm,
    activeMoreTheme,
    focalMoreAphorism,
    practiceGuidance: topicGuidance.practiceGuidance,
    ritualAction: topicGuidance.ritualAction,
    reflectionFocus: topicGuidance.reflectionFocus,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    moreSynthesisMatrix,
    moreComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatBritishThomasMoreUtopiaPrompt(
  res: BritishThomasMoreUtopiaResult,
): string {
  return [
    `【토머스 모어 《유토피아》 공동체 양심·삶의 균형 및 도덕적 용기 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- KST 시공간 리듬: ${res.temporalMoreRhythm.kstDateLabel} · ${res.temporalMoreRhythm.timeWindowKo} (${res.temporalMoreRhythm.utopiaTone}) — ${res.temporalMoreRhythm.rhythmDirective}`,
    `- 핵심 토머스 모어 테마: ${res.activeMoreTheme.themeTitleKo} [${res.activeMoreTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeMoreTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeMoreTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 핵심 성찰 질문: ${res.reflectionFocus}`,
    `- 교차 매트릭스: 핵심(${res.moreSynthesisMatrix.coreInsight}) | 실행(${res.moreSynthesisMatrix.recommendedAction}) | 주의(${res.moreSynthesisMatrix.cautionNotice})`,
    `- 토머스 모어 원전 명언: "${res.focalMoreAphorism.aphorismKo}" (${res.focalMoreAphorism.aphorismLatin})`,
    `- 원전 출처: [${res.focalMoreAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalMoreAphorism.actionGuidance}`,
    `- 종합 토머스 모어 권면: ${res.moreComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
