/**
 * 영국 존 스튜어트 밀(John Stuart Mill) 《자유론(On Liberty)》
 * 개별성(Individuality) 자율성 & 해악 원칙(Harm Principle) 질적 공리 지혜 엔진
 *
 * 19세기 근대 자유주의와 윤리학의 거장 존 스튜어트 밀(1806~1873)의 고전적 명저 《자유론(On Liberty, 1859)》
 * 및 《공리주의(Utilitarianism, 1861)》 원전 기반:
 * 1. 개별성(Individuality)과 고유한 자아 실현: "타인에게 피해를 주지 않는 한, 자신의 성격과 삶의 방식을 스스로 선택하고 발전시키는 개별성이야말로 인류 행복의 본질적 요소이다" - 획일적 집단 동조 압력 탈피.
 * 2. 해악 원칙(Harm Principle): 권력이 개인의 자유를 침해할 수 있는 유일한 정당한 이유는 오직 '타인에 대한 해악 방지'뿐이며, 개인의 몸과 마음에 대해 자신이야말로 최고의 주권자라는 원칙.
 * 3. 사상과 토론의 절대적 자유: 반대 의견을 침묵시키는 것은 현세대와 미래 세대 모두의 가능성을 강탈하는 것이며, 오류조차도 진리를 생생히 살려두기 위해 반드시 필요하다는 열린 회의론.
 * 4. 다수의 횡포(Tyranny of the Majority) 경계: 법적 억압보다 더 위험한 사회적 관습과 여론의 독재에 맞서 자신의 고유한 가치관을 지키는 지적 용기.
 * 5. 질적 공리주의(Qualitative Utilitarianism): "만족한 돼지보다 불만족한 인간이 되는 것이 낫고, 만족한 바보보다 불만족한 소크라테스가 되는 것이 낫다" - 감각적 쾌락을 넘어선 정신적 고결함과 내적 성숙 추구.
 *
 * @version LUCKEY-JS-MILL-ON-LIBERTY-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const BRITISH_JS_MILL_VERSION = 'LUCKEY-JS-MILL-ON-LIBERTY-v2.2.0';

export type MillQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface MillTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  libertyTone: string;
  rhythmDirective: string;
}

export interface MillLibertyTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  practicalCounsel: string;
}

export interface MillLibertyAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface JohnStuartMillOnLibertyIndividualityResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 자유론·개별성 지표 (0~100)
  individualityAutonomyScore: number;     // 개별성(Individuality) 자주적 자아실현도
  harmPrincipleClarityScore: number;      // 해악 원칙(Harm Principle) 경계 명료성
  thoughtConscienceLibertyScore: number;  // 사상·양심·토론의 절대적 자유도
  tyrannyResistanceCourageScore: number;  // 다수의 횡포 및 집단 동조 압력 극복 용기
  qualitativeGrowthPursuitScore: number;  // 소크라테스적 정신 고결함 및 질적 성숙 지수
  // 세부 분석
  questionTopic: MillQuestionTopic;
  temporalMillRhythm: MillTemporalRhythm;
  activeMillTheme: MillLibertyTheme;
  focalMillAphorism: MillLibertyAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  millSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  millComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const MILL_LIBERTY_THEMES: MillLibertyTheme[] = [
  {
    themeKey: 'individuality_wellbeing',
    themeTitleEn: 'Individuality as an Element of Well-Being',
    themeTitleKo: '개별성 - 인간 행복과 번영의 본질적 요소',
    philosophicalInsight: '자신의 욕망과 충동을 스스로의 것으로 삼지 못하고 관습만을 따르는 사람은 인격의 고유성을 잃고 기계로 전락합니다.',
    practicalCounsel: '남들이 정해둔 기준이나 유행을 무비판적으로 따라가지 마십시오. 당신의 독특한 개성과 취향, 삶의 실험을 두려움 없이 꽃피우십시오.',
  },
  {
    themeKey: 'harm_principle_sovereignty',
    themeTitleEn: 'Harm Principle & Self-Sovereignty',
    themeTitleKo: '해악 원칙과 자기 자신에 대한 절대적 주권',
    philosophicalInsight: '개인의 신체와 정신에 대해 각자는 완전한 주권자입니다. 타인에게 직접적 해를 끼치지 않는 한, 삶의 방식은 온전히 본인의 자유입니다.',
    practicalCounsel: '타인의 시선이나 간섭에 휘둘리지 말고 당신 삶의 영역에서 자율적 주권을 행사하십시오. 동시에 타인의 사적 영역 또한 깊이 존중하십시오.',
  },
  {
    themeKey: 'freedom_of_thought_discussion',
    themeTitleEn: 'Liberty of Thought and Discussion',
    themeTitleKo: '사상과 토론의 자유 - 진리를 생생하게 유지하는 힘',
    philosophicalInsight: '반대 의견을 억압하면 진리는 생명력을 잃고 화석화된 독단으로 굳어집니다. 비판과 토론을 거쳐야만 참된 확신이 됩니다.',
    practicalCounsel: '당신의 생각에 이의를 제기하는 목소리를 반기십시오. 반대자의 논거를 가장 설득력 있게 이해할 때 당신의 사고와 판단력은 비로소 완전해집니다.',
  },
  {
    themeKey: 'tyranny_of_majority',
    themeTitleEn: 'Resistance to the Tyranny of the Majority',
    themeTitleKo: '다수의 횡포와 사회적 순응 압력에 대한 저항',
    philosophicalInsight: '사회가 자신의 생각과 관습을 유일한 정답으로 강요할 때 개별성은 질식합니다. 독자적인 사색가가 되는 용기가 진보를 낳습니다.',
    practicalCounsel: '‘모두가 그렇게 한다’는 말에 굴복하지 마십시오. 소수의 위치에 서더라도 옳다고 믿는 가치와 방식을 지킬 수 있는 단단한 내면의 독립성을 유지하십시오.',
  },
  {
    themeKey: 'higher_qualitative_pleasures',
    themeTitleEn: 'Qualitative Growth & Socratic Nobility',
    themeTitleKo: '질적 성숙과 소크라테스적 지적 고결함',
    philosophicalInsight: '단순한 편안함과 말초적 만족에 안주하기보다, 진리와 아름다움, 인격적 성장을 위해 고뇌하고 도전하는 삶이 훨씬 고귀합니다.',
    practicalCounsel: '눈앞의 나태한 안락함에 만족하지 마십시오. 깊은 독서, 진지한 사유, 예술적 영감, 도덕적 실천을 통해 당신의 영혼을 더 높은 차원으로 고양하십시오.',
  },
];

export const MILL_LIBERTY_APHORISMS: MillLibertyAphorism[] = [
  {
    aphorismKey: 'over_himself_sovereign',
    aphorismKo: '자기 자신, 곧 자신의 몸과 마음에 대해 개인은 온전한 주권자이다.',
    aphorismEn: 'Over himself, over his own body and mind, the individual is sovereign.',
    sourceContext: '《자유론(On Liberty)》 제1장 서론',
    actionGuidance: '당신의 건강, 시간, 진로에 대한 최종 결정권은 오직 당신에게 있습니다. 주체적인 자기 결정권을 당당히 행사하십시오.',
  },
  {
    aphorismKey: 'dissatisfied_socrates',
    aphorismKo: '만족한 돼지보다 불만족한 인간이 낫고, 만족한 바보보다 불만족한 소크라테스가 낫다.',
    aphorismEn: 'It is better to be a human being dissatisfied than a pig satisfied; better to be Socrates dissatisfied than a fool satisfied.',
    sourceContext: '《공리주의(Utilitarianism)》 제2장',
    actionGuidance: '단순한 안일에 안주하지 말고, 지적·도덕적 성숙을 향한 아름다운 열망과 성찰을 멈추지 마십시오.',
  },
  {
    aphorismKey: 'genius_breathes_liberty',
    aphorismKo: '독창성과 천재성은 오직 자유의 대기 속에서만 숨 쉴 수 있다.',
    aphorismEn: 'Genius can only breathe freely in an atmosphere of freedom.',
    sourceContext: '《자유론(On Liberty)》 제3장 개별성에 관하여',
    actionGuidance: '창의적인 영감을 억누르는 경직된 규칙과 틀을 깨고, 과감한 사고의 자유를 당신의 일상에 부여하십시오.',
  },
  {
    aphorismKey: 'silencing_opinion_robbery',
    aphorismKo: '어떤 의견의 표현을 침묵시키는 것은 인류 전체의 가능성을 강탈하는 범죄이다.',
    aphorismEn: 'If all mankind minus one were of one opinion, mankind would be no more justified in silencing that one person.',
    sourceContext: '《자유론(On Liberty)》 제2장 사상과 토론의 자유',
    actionGuidance: '다른 이의 자유로운 발언과 표현을 존중하고, 다양한 관점 속에서 숨은 지혜를 발견하십시오.',
  },
  {
    aphorismKey: 'human_nature_tree',
    aphorismKo: '인간 본성은 틀에 맞추어 찍어내는 기계가 아니라, 사방으로 뻗어 자라나는 나무와 같다.',
    aphorismEn: 'Human nature is not a machine to be built after a model, but a tree, which requires to grow and develop itself on all sides.',
    sourceContext: '《자유론(On Liberty)》 제3장',
    actionGuidance: '당신 자신을 타인의 잣대에 억지로 맞추려 하지 말고, 당신 안의 고유한 생명력이 자연스럽게 피어나도록 가꾸십시오.',
  },
];

function classifyMillQuestionTopic(query?: string): MillQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/사랑|연애|관계|결혼|이별|가족|친구|갈등|사람|동료|부모/.test(q)) return 'relationship';
  if (/선택|결정|이직|사업|진로|시험|돈|투자|계약|시작|포기|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|상처|치유|위로|외로|슬픔|걱정|두려|피곤/.test(q)) return 'healing';
  return 'reflection';
}

function buildMillTemporalRhythm(now?: Date): MillTemporalRhythm {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const kstDateLabel = kst.toISOString().slice(0, 10);
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 11) {
    return {
      kstDateLabel,
      timeWindowKo: '아침 자기 주권의 시간 (05:00~11:00 KST)',
      libertyTone: '개별성 자각과 자율적 시작',
      rhythmDirective: '타인의 시선이나 관습보다 내 몸과 마음의 주권자로서 오늘의 방향을 세우는 시간입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstDateLabel,
      timeWindowKo: '낮 열린 토론의 시간 (11:00~17:00 KST)',
      libertyTone: '해악 원칙과 다원적 대화',
      rhythmDirective: '서로 해를 끼치지 않는 선에서 다른 의견과 자유롭게 부딪치며 판단을 벼리는 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstDateLabel,
      timeWindowKo: '저녁 질적 성숙의 시간 (17:00~22:00 KST)',
      libertyTone: '소크라테스적 고결함과 여가',
      rhythmDirective: '단순한 안일 대신 영혼을 살찌우는 사유, 독서, 대화로 질적 충만을 누리는 시간입니다.',
    };
  }
  return {
    kstDateLabel,
    timeWindowKo: '심야 내면 독립의 시간 (22:00~05:00 KST)',
    libertyTone: '다수 동조 압력 탈피',
    rhythmDirective: '세상의 소음을 끄고 오직 나만의 고유한 양심과 신념을 조용히 되묻는 시간입니다.',
  };
}

function buildMillTopicGuidance(topic: MillQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '가까운 사이일수록 상대를 내 뜻대로 바꾸려 하지 말고, 각자의 개별성과 자유의 공간을 존중하십시오.',
      ritualAction: '오늘 상대의 다른 의견 하나를 고치려 하지 않고 끝까지 경청해 주기',
      reflectionFocus: '지금 이 관계에서 나는 상대의 개별성을 존중하고 있는가, 나 역시 내 자율성을 지키고 있는가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '남들이 다 가는 길이라는 이유만으로 따르지 말고, 타인에게 해를 주지 않는 한 당신만의 실험을 선택하십시오.',
      ritualAction: '남의 기준이 아닌 나만의 선택 이유 한 문장을 소리 내어 말하거나 적어 보기',
      reflectionFocus: '이 선택은 편리한 순응인가, 아니면 나를 더 성숙하게 만드는 주체적 결단인가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '다수의 잣대에 맞추느라 소진된 마음을 멈추고, 당신의 고유한 속도와 취향으로 숨 쉴 공간을 여십시오.',
      ritualAction: '남의 눈치를 보지 않고 오롯이 나만 좋아하는 일 한 가지를 20분 누리기',
      reflectionFocus: '내가 지금 느끼는 피로는 진짜 내 욕구에서 온 것인가, 타인의 기대를 흉내 내다 온 것인가?',
    };
  }
  return {
    practiceGuidance: '반대 의견을 두려워하지 말고, 다양한 관점과 질적 사유 속에서 나만의 단단한 개성을 가꾸십시오.',
    ritualAction: '평소 내 생각과 다른 관점의 글이나 의견 하나를 편견 없이 읽어 보기',
    reflectionFocus: '나는 찍어낸 기계처럼 살고 있는가, 사방으로 뻗어 자라는 나무처럼 살고 있는가?',
  };
}

export function calculateJohnStuartMillOnLibertyIndividuality(
  profile: UserProfile,
  query?: string,
  now?: Date,
): JohnStuartMillOnLibertyIndividualityResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalMillRhythm = buildMillTemporalRhythm(now);
  const questionTopic = classifyMillQuestionTopic(query);
  const topicGuidance = buildMillTopicGuidance(questionTopic);

  const seedString = `JS-MILL-ON-LIBERTY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalMillRhythm.kstDateLabel}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const individualityAutonomyScore = 74 + (absHash % 25);
  const harmPrincipleClarityScore = 71 + ((absHash >> 3) % 28);
  const thoughtConscienceLibertyScore = 73 + ((absHash >> 6) % 26);
  const tyrannyResistanceCourageScore = 70 + ((absHash >> 9) % 29);
  const qualitativeGrowthPursuitScore = 72 + ((absHash >> 12) % 27);

  const themeIndex = (absHash >> 4) % MILL_LIBERTY_THEMES.length;
  const aphorismIndex = (absHash >> 7) % MILL_LIBERTY_APHORISMS.length;

  const activeMillTheme = MILL_LIBERTY_THEMES[themeIndex];
  const focalMillAphorism = MILL_LIBERTY_APHORISMS[aphorismIndex];

  const guidanceTitle = `존 스튜어트 밀 자유론 개별성 지혜: ${activeMillTheme.themeTitleKo}`;
  const philosophicalCounsel = `존 스튜어트 밀의 자유론과 개별성 철학은 집단적 순응을 탈피하여 당신 고유의 자율성과 질적 성숙을 확립하도록 이끕니다. ` +
    `현재 당신의 삶에서 가장 핵심적인 자율적 과제는 '${activeMillTheme.themeTitleKo}'입니다. ` +
    `${activeMillTheme.practicalCounsel} ${topicGuidance.practiceGuidance} 아울러 밀의 명언 "${focalMillAphorism.aphorismKo}"(${focalMillAphorism.aphorismEn})을 깊이 새기고, ` +
    `${focalMillAphorism.actionGuidance}`;

  const boundaryNotice = '존 스튜어트 밀 자유론 해석은 자율성과 개별성 성찰을 돕는 상징·철학 관점이며, 법률 자문이나 확정적 예측이 아닙니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${temporalMillRhythm.kstDateLabel} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} +09:00 (KST)`;
  const trimmedQuery = (query ?? '').trim();
  const reflectiveQuestion = trimmedQuery
    ? `"${trimmedQuery}"라는 물음 앞에서, 다수의 관습이 아니라 나만의 개별성과 해악 원칙에 비추어 스스로 지키고 싶은 선택은 무엇인가요?`
    : topicGuidance.reflectionFocus;
  const millSynthesisMatrix = {
    coreInsight: activeMillTheme.themeTitleKo,
    recommendedAction: topicGuidance.practiceGuidance,
    cautionNotice: '다수의 관습적 압력에 내 고유한 개별성을 지우거나 타인의 영역을 침범하지 마십시오.',
  };

  return {
    engineVersion: BRITISH_JS_MILL_VERSION,
    calculatedAtKst: kstTimeLabel,
    individualityAutonomyScore,
    harmPrincipleClarityScore,
    thoughtConscienceLibertyScore,
    tyrannyResistanceCourageScore,
    qualitativeGrowthPursuitScore,
    questionTopic,
    temporalMillRhythm,
    activeMillTheme,
    focalMillAphorism,
    practiceGuidance: topicGuidance.practiceGuidance,
    ritualAction: topicGuidance.ritualAction,
    reflectionFocus: topicGuidance.reflectionFocus,
    reflectiveQuestion,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    millSynthesisMatrix,
    millComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatJohnStuartMillOnLibertyIndividualityPrompt(res: JohnStuartMillOnLibertyIndividualityResult): string {
  return [
    `【존 스튜어트 밀 《자유론》 개별성 자율성 & 해악 원칙 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- KST 시공간 리듬: ${res.temporalMillRhythm.kstDateLabel} · ${res.temporalMillRhythm.timeWindowKo} (${res.temporalMillRhythm.libertyTone}) — ${res.temporalMillRhythm.rhythmDirective}`,
    `- 핵심 자유 테마: ${res.activeMillTheme.themeTitleKo} [${res.activeMillTheme.themeTitleEn}]`,
    `- 철학적 통찰: ${res.activeMillTheme.philosophicalInsight}`,
    `- 실천적 조언: ${res.activeMillTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 핵심 성찰 질문: ${res.reflectionFocus}`,
    `- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.millSynthesisMatrix.coreInsight}) | 실행(${res.millSynthesisMatrix.recommendedAction}) | 주의(${res.millSynthesisMatrix.cautionNotice})`,
    `- 핵심 경구: "${res.focalMillAphorism.aphorismKo}"`,
    `- 영문 원문: "${res.focalMillAphorism.aphorismEn}" [${res.focalMillAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalMillAphorism.actionGuidance}`,
    `- 종합 통찰 권면: ${res.millComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
