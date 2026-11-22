/**
 * 영국 버트런드 러셀(Bertrand Russell) 《행복의 정복(The Conquest of Happiness)》 열정적 관심(Zest) & 합리적 낙관·자기몰두 극복 지혜 엔진
 *
 * 20세기 서양 철학의 거장이자 노벨문학상 수상자인 버트런드 러셀(Bertrand Russell, 1872~1970)의 불후의 고전
 * 《행복의 정복(The Conquest of Happiness, 1930)》 및 윤리·철학 저술 원전 기반:
 * 1. 삶에 대한 열정적 관심도(Zest for Life Index): 외부 세계, 사람, 사물에 대해 편견 없는 호기심과 애정을 쏟는 생명력 지표.
 * 2. 자기몰두 및 피해망상 극복 지수(Overcoming Self-Absorption & Persecution Mania Index): 과도한 자의식, 죄의식, 피해의식, 남과의 비교·질투를 지성으로 해소하는 정신 건강도.
 * 3. 건설적 일과 몰입의 성취도(Constructive Work & Flow Fulfillment Score): 목적의식을 가지고 장기적인 결과물을 빚어내는 생산적 노력과 몰입의 기쁨.
 * 4. 비인칭적 흥미와 여가의 활력도(Impersonal Interests & Leisure Vitality Index): 생업의 중압감에서 벗어나 마음을 회복시키는 순수한 취미와 폭넓은 시야.
 * 5. 합리적 이성과 회복탄력성 지수(Rational Equanimity & Resilience Score): 피할 수 없는 불행 앞에서도 불필요한 감정 소모를 멈추고 냉철하고 따뜻한 이성으로 극복하는 지혜.
 *
 * @version LUCKEY-BERTRAND-RUSSELL-HAPPINESS-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const BRITISH_BERTRAND_RUSSELL_VERSION = 'LUCKEY-BERTRAND-RUSSELL-HAPPINESS-v2.3.0';

export type RussellQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface RussellTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  zestTone: string;
  rhythmDirective: string;
}

export interface RussellTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface RussellAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface BritishBertrandRussellConquestOfHappinessResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 버트런드 러셀 행복 지표 (0~100)
  zestForLifeIndex: number;                       // 삶에 대한 열정적 관심도 (Zest for Life)
  overcomingSelfAbsorptionIndex: number;          // 자기몰두 및 피해망상 극복 지수 (Overcoming Self-Absorption)
  constructiveWorkFulfillmentScore: number;       // 건설적 일과 몰입의 성취도 (Constructive Work Fulfillment)
  impersonalInterestsVitalityIndex: number;       // 비인칭적 흥미와 여가의 활력도 (Impersonal Interests Vitality)
  rationalEquanimityResilienceScore: number;      // 합리적 이성과 회복탄력성 지수 (Rational Equanimity & Resilience)
  // 세부 분석
  questionTopic: RussellQuestionTopic;
  zestPhase: string;
  shadowWarning: string;
  temporalRussellRhythm: RussellTemporalRhythm;
  activeRussellTheme: RussellTheme;
  companionRussellTheme: RussellTheme;
  focalRussellAphorism: RussellAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  russellSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  russellComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

const RUSSELL_ZEST_PHASES = [
  '열의 점화(내면의 좁은 걱정을 걷어내고 바깥 세상의 호기심으로 시선을 돌리는 시기)',
  '자기몰두 해체(남과의 비교·피해의식을 내려놓고 자기 고유의 속도를 되찾는 시기)',
  '비인칭적 관조(성과 압박에서 벗어나 순수한 취미·배움으로 마음을 환기하는 시기)',
] as const;

const RUSSELL_SHADOW_WARNINGS = [
  '바깥의 자극과 활동만 쫓다가 정작 내면의 피로 신호를 외면하지 않도록 살피세요.',
  '비교를 멈춘다는 이유로 필요한 현실 점검과 건설적 노력까지 느슨해지지 않도록 유의하세요.',
  '관조와 여가에 머물다 막상 오늘 착수해야 할 작은 한 걸음을 미루지 않도록 점검하세요.',
] as const;

export const RUSSELL_THEMES: RussellTheme[] = [
  {
    themeKey: 'zestForLife',
    themeTitleEn: 'Zest for Life & Outward Affection',
    themeTitleKo: '삶에 대한 열정(Zest) — 세상을 향한 호기심과 활력',
    existentialInsight: '행복한 사람은 식탁에 차려진 음식을 맛있게 즐기듯 세상만사에 열정적인 관심을 둡니다. 외부의 사물과 사람들에게 마음을 활짝 열 때 내면의 결핍과 지루함은 저절로 사라집니다.',
    practicalCounsel: '지나치게 자신의 내면적 고민에만 갇혀있지 마십시오. 오늘 만나는 사람, 당신을 둘러싼 주변 사물과 사건들에 어린아이 같은 순수한 호기심과 애정을 기울이십시오.',
  },
  {
    themeKey: 'overcomingEnvyAndComparison',
    themeTitleEn: 'Conquering Envy and Comparison',
    themeTitleKo: '비교와 질투의 종식 — 자신만의 온전한 기쁨 누리기',
    existentialInsight: '질투는 자신이 가진 것의 가치를 보지 못하고 남이 가진 것만 쳐다보는 데서 생겨납니다. 비교를 멈추고 자신의 삶 자체에서 피어나는 보람에 온전히 감사할 때 참된 평화가 깃듭니다.',
    practicalCounsel: '타인의 성취나 인정을 자신과 견주어 깎아내리거나 위축되지 마십시오. 당신의 고유한 속도와 걸음걸이 속에서 피어나는 열매 자체를 소중히 가꾸십시오.',
  },
  {
    themeKey: 'impersonalInterests',
    themeTitleEn: 'Impersonal Interests & Cosmic Perspective',
    themeTitleKo: '비인칭적 흥미 — 거대한 우주를 관조하는 여유',
    existentialInsight: '직업적 의무나 개인적 야망과 무관한 순수한 비인칭적 흥미(취미, 학문, 예술, 자연 관찰)를 지닐 때, 삶의 일시적인 좌절 앞에서도 마음의 균형과 평정을 잃지 않게 됩니다.',
    practicalCounsel: '오직 성과와 평가에만 직결된 일에 모든 에너지를 쏟지 마십시오. 당신의 영혼을 조건 없이 숨 쉬게 만드는 순수한 배움과 관조의 취미를 생활 속에 품으십시오.',
  },
  {
    themeKey: 'constructiveEffort',
    themeTitleEn: 'Constructive Work and Purposeful Building',
    themeTitleKo: '건설적 노력 — 목적을 세우고 하나씩 쌓아 올리는 기쁨',
    existentialInsight: '파괴는 일시적인 쾌감을 주지만, 무언가를 새롭게 기획하고 건설하는 작업은 영혼에 지속적이고 깊은 자존감과 영속적인 기쁨을 선사합니다.',
    practicalCounsel: '작은 벽돌을 한 장 한 장 쌓아 성채를 올리듯, 장기적인 비전을 품고 꾸준히 결과물을 만들어 가십시오. 건설적인 몰입이 당신을 가장 견고하게 치유합니다.',
  },
  {
    themeKey: 'rationalFacingOfFear',
    themeTitleEn: 'Rational Facing of Fear & Courage',
    themeTitleKo: '이성적 공포 직시 — 최악을 마주할 때 사라지는 불안',
    existentialInsight: '막연한 불안을 회피하려 할수록 공포는 커집니다. 일어날 수 있는 최악의 상황을 냉정하고 명석하게 직시하고 대비책을 세우면, 불안은 신기루처럼 사라지고 이성적 평온이 찾아옵니다.',
    practicalCounsel: '마음 한구석의 두려움을 억누르지 마십시오. 최악의 시나리오가 닥쳤을 때 무엇을 할 수 있을지 담담하게 종이에 적어보십시오. 실체가 드러나면 더 이상 두렵지 않습니다.',
  },
];

export const RUSSELL_APHORISMS: RussellAphorism[] = [
  {
    aphorismKey: 'zestStrawberry',
    aphorismKo: '행복은 산딸기와 같다. 외부 세계에 관심을 기울이고 손을 뻗어 맛보는 자의 것이다.',
    aphorismEn: 'Zest is the secret of all happiness, and to love many things is to walk upon a path of joy.',
    sourceContext: '《행복의 정복(The Conquest of Happiness)》 제11장 열의(Zest)',
    actionGuidance: '마음의 문을 활짝 열고 외부 세계에 풍성한 애정을 쏟으십시오. 세상의 다채로운 경험 속으로 주저 없이 뛰어들 때 생명력이 샘솟습니다.',
  },
  {
    aphorismKey: 'escapeSelfAbsorption',
    aphorismKo: '지나치게 자의식에 갇히지 마라. 외부의 사물과 타인에게 마음을 둘 때 영혼은 가장 자유로워진다.',
    aphorismEn: 'To be self-absorbed is to starve the soul; turn your eyes outward to the universe.',
    sourceContext: '《행복의 정복》 서문',
    actionGuidance: '자신에 대한 끊임없는 자책과 불안을 내려놓으십시오. 지금 당신 앞에 놓인 구체적인 일과 동료들의 필요에 온 마음을 집중해 보십시오.',
  },
  {
    aphorismKey: 'conquerEnvy',
    aphorismKo: '질투는 스스로를 불행하게 만드는 가장 큰 적이다. 남과 비교하지 말고 당신이 가진 것 자체를 누려라.',
    aphorismEn: 'Envy is the basis of democracy of misery; enjoy your own life without comparing it to that of others.',
    sourceContext: '《행복의 정복》 제6장 질투(Envy)',
    actionGuidance: 'SNS나 주변 사람의 화려한 겉모습과 자신을 비교하지 마십시오. 당신이 일구어낸 고유한 가치와 오늘 누릴 수 있는 작은 행복에 감사하십시오.',
  },
  {
    aphorismKey: 'constructiveWork',
    aphorismKo: '건설적인 일이야말로 인간에게 가장 깊은 만족을 준다. 작은 성취가 모여 단단한 자존감을 세운다.',
    aphorismEn: 'Constructive work gives the greatest satisfaction; to build is to participate in eternity.',
    sourceContext: '《행복의 정복》 제14장 일(Work)',
    actionGuidance: '오늘 할 수 있는 구체적인 한 가지 일을 정성껏 완성하십시오. 작은 결과물이 쌓여가는 성취감이 당신의 마음에 흔들리지 않는 긍지를 불어넣어 줍니다.',
  },
  {
    aphorismKey: 'rationalCourage',
    aphorismKo: '두려움을 극복하는 비결은, 두려워하는 대상의 최악을 또렷한 이성으로 직시하고 대책을 세우는 것이다.',
    aphorismEn: 'Fear is the main source of superstition, and one of the main sources of cruelty. To conquer fear is the beginning of wisdom.',
    sourceContext: '《철학적 에세이》 & 《행복의 정복》',
    actionGuidance: '미지의 불안에 떨지 말고 사실과 데이터를 침착하게 살피십시오. 명료한 이성적 판단과 정직한 대면이 마음의 평화를 가져옵니다.',
  },
  {
    aphorismKey: 'cosmicPerspective',
    aphorismKo: '우주가 얼마나 광대한가를 생각할 때, 오늘의 사소한 번뇌는 가벼운 먼지처럼 흩어진다.',
    aphorismEn: 'A broad horizon and impersonal contemplation set our petty troubles in their true perspective.',
    sourceContext: '《행복의 정복》 제15장 비인칭적 흥미',
    actionGuidance: '눈앞의 사소한 마찰이나 실망에 매몰되지 마십시오. 별과 우주, 역사의 긴 흐름을 떠올리며 호흡을 가다듬으면 마음의 여유가 되살아납니다.',
  },
];

function classifyRussellQuestionTopic(query?: string): RussellQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/사랑|연애|관계|결혼|이별|가족|친구|갈등|사람|동료|부모/.test(q)) return 'relationship';
  if (/선택|결정|이직|사업|진로|시험|돈|투자|계약|시작|포기|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|상처|치유|위로|외로|슬픔|걱정|두려|피곤/.test(q)) return 'healing';
  return 'reflection';
}

function buildRussellTemporalRhythm(now?: Date): RussellTemporalRhythm {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const kstDateLabel = kst.toISOString().slice(0, 10);
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 11) {
    return {
      kstDateLabel,
      timeWindowKo: '아침 열의의 시간 (05:00~11:00 KST)',
      zestTone: '신선한 호기심과 외향적 활력',
      rhythmDirective: '내면의 근심을 접어 두고 오늘 마주할 세상과 일에 산뜻한 호기심을 기울이는 시간입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstDateLabel,
      timeWindowKo: '낮 건설적 몰입의 시간 (11:00~17:00 KST)',
      zestTone: '목적 있는 실행과 비교 탈피',
      rhythmDirective: '타인과의 비교를 멈추고 손에 잡힌 구체적 과업을 한 걸음씩 쌓아 올리는 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstDateLabel,
      timeWindowKo: '저녁 비인칭적 여가의 시간 (17:00~22:00 KST)',
      zestTone: '넓은 시야와 순수한 관심',
      rhythmDirective: '이해관계를 떠난 독서·산책·대화 같은 비인칭적 흥미로 마음의 균형을 회복하는 시간입니다.',
    };
  }
  return {
    kstDateLabel,
    timeWindowKo: '심야 이성적 평온의 시간 (22:00~05:00 KST)',
    zestTone: '불안 직시와 우주의 관조',
    rhythmDirective: '막연한 두려움을 이성으로 정리하고 우주의 넓은 시야 속에서 마음을 내려놓는 시간입니다.',
  };
}

function buildRussellTopicGuidance(topic: RussellQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '상대의 인정이나 반응에 지나치게 매달리기보다, 상대를 있는 그대로 호기심과 애정으로 바라보십시오.',
      ritualAction: '오늘 가까운 사람에게 계산이나 비교 없이 순수한 안부나 고마움 한 마디 건네기',
      reflectionFocus: '지금 이 관계에서 나를 괴롭히는 것은 상대의 행동인가, 아니면 비교와 자의식인가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '막연한 불안으로 결정을 미루기보다 최악의 경우까지 차분히 직시하고 건설적인 한 걸음을 내디디십시오.',
      ritualAction: '망설이는 선택지의 최악 시나리오와 대응책 두 줄을 종이에 적어 불안을 실체화하기',
      reflectionFocus: '이 선택을 할 때 남의 시선보다 내가 실제로 흥미와 보람을 느끼는 일은 무엇인가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '고통의 원인을 내 안에서만 파고들수록 자기몰두가 깊어집니다. 시선을 밖으로 돌려 작은 활력을 회복하십시오.',
      ritualAction: '오늘 15분만이라도 업무나 고민과 무관한 순수한 취미·산책·음악에 온전히 몰입하기',
      reflectionFocus: '내가 통제할 수 없는 걱정 대신 지금 바로 손 뻗어 맛볼 수 있는 작은 기쁨은 무엇인가?',
    };
  }
  return {
    practiceGuidance: '우주의 광대함 속에서 오늘의 사소한 번뇌를 가볍게 내려놓고 건설적인 하루의 질서를 세우십시오.',
    ritualAction: '오늘 하루 나를 설레게 하거나 호기심을 자극했던 장면 하나를 짧게 기록하기',
    reflectionFocus: '나는 지금 나 자신을 분석하는 데 시간을 쓰고 있는가, 세상을 사랑하는 데 쓰고 있는가?',
  };
}

export function calculateBritishBertrandRussellConquestOfHappiness(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): BritishBertrandRussellConquestOfHappinessResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalRussellRhythm = buildRussellTemporalRhythm(now);
  const questionTopic = classifyRussellQuestionTopic(query);
  const topicGuidance = buildRussellTopicGuidance(questionTopic);

  const seedString = `BERTRAND-RUSSELL-HAPPINESS:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalRussellRhythm.kstDateLabel}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const zestForLifeIndex = 79 + (absHash % 20);
  const overcomingSelfAbsorptionIndex = 77 + ((absHash >> 3) % 22);
  const constructiveWorkFulfillmentScore = 80 + ((absHash >> 6) % 19);
  const impersonalInterestsVitalityIndex = 76 + ((absHash >> 9) % 23);
  const rationalEquanimityResilienceScore = 78 + ((absHash >> 12) % 21);

  const themeIndex = (absHash >> 4) % RUSSELL_THEMES.length;
  const companionOffset = 1 + ((absHash >> 5) % (RUSSELL_THEMES.length - 1));
  const aphorismIndex = (absHash >> 7) % RUSSELL_APHORISMS.length;

  const activeRussellTheme = RUSSELL_THEMES[themeIndex];
  const companionRussellTheme = RUSSELL_THEMES[(themeIndex + companionOffset) % RUSSELL_THEMES.length];
  const focalRussellAphorism = RUSSELL_APHORISMS[aphorismIndex];
  const zestPhase = RUSSELL_ZEST_PHASES[(absHash >> 10) % RUSSELL_ZEST_PHASES.length];
  const shadowWarning = RUSSELL_SHADOW_WARNINGS[(absHash >> 13) % RUSSELL_SHADOW_WARNINGS.length];

  const guidanceTitle = `버트런드 러셀 행복의 정복 지혜: ${activeRussellTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 최고의 지성 버트런드 러셀의 《행복의 정복》은 불필요한 자기몰두와 남과의 비교를 털어내고, 외부 세계를 향한 열정적 관심(Zest)과 건설적인 일의 기쁨으로 나아가도록 이끕니다. ` +
    `현재 당신의 삶을 환하게 밝히는 핵심 행복 원리는 '${activeRussellTheme.themeTitleKo}'(동반 테마: ${companionRussellTheme.themeTitleKo})입니다. ` +
    `${activeRussellTheme.practicalCounsel} ${topicGuidance.practiceGuidance} 아울러 러셀의 명언 "${focalRussellAphorism.aphorismKo}"를 되새기며, ` +
    `${focalRussellAphorism.actionGuidance}`;

  const boundaryNotice = '버트런드 러셀 철학 해석은 삶의 태도와 시선 전환을 돕는 상징·성찰 관점이며, 임상적·의학적 진단이나 확정 예언이 아닙니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${temporalRussellRhythm.kstDateLabel}T${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')}:00+09:00 (KST)`;
  const trimmedQuery = (query ?? '').trim();
  const reflectiveQuestion = trimmedQuery
    ? `"${trimmedQuery}"의 고민을 버트런드 러셀의 '${activeRussellTheme.themeTitleKo}' 시선과 '${zestPhase}' 국면으로 옮길 때, 오늘 자기몰두나 비교 대신 밖을 향해 바로 뻗어 볼 수 있는 작은 열의(Zest) 하나는 무엇인가요?`
    : `'${zestPhase}' 국면에서 오늘 '${activeRussellTheme.themeTitleKo}'의 관점으로 내면의 불안이나 비교를 멈추고 세상과 사람에게 호기심으로 건네 볼 작은 행동 하나는 무엇인가요?`;
  const russellSynthesisMatrix = {
    coreInsight: activeRussellTheme.themeTitleKo,
    recommendedAction: `${topicGuidance.practiceGuidance} (${zestPhase})`,
    cautionNotice: shadowWarning,
  };

  return {
    engineVersion: BRITISH_BERTRAND_RUSSELL_VERSION,
    calculatedAtKst: kstTimeLabel,
    zestForLifeIndex,
    overcomingSelfAbsorptionIndex,
    constructiveWorkFulfillmentScore,
    impersonalInterestsVitalityIndex,
    rationalEquanimityResilienceScore,
    questionTopic,
    zestPhase,
    shadowWarning,
    temporalRussellRhythm,
    activeRussellTheme,
    companionRussellTheme,
    focalRussellAphorism,
    practiceGuidance: `${topicGuidance.practiceGuidance} (동반 테마: ${companionRussellTheme.themeTitleKo})`,
    ritualAction: `${topicGuidance.ritualAction} (${zestPhase})`,
    reflectionFocus: topicGuidance.reflectionFocus,
    reflectiveQuestion,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    russellSynthesisMatrix,
    russellComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatBritishBertrandRussellConquestOfHappinessPrompt(
  res: BritishBertrandRussellConquestOfHappinessResult,
): string {
  return [
    `【버트런드 러셀 《행복의 정복》 열정적 관심 & 합리적 낙관 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- 행복 국면: ${res.zestPhase}`,
    `- KST 시공간 리듬: ${res.temporalRussellRhythm.kstDateLabel} · ${res.temporalRussellRhythm.timeWindowKo} (${res.temporalRussellRhythm.zestTone}) — ${res.temporalRussellRhythm.rhythmDirective}`,
    `- 핵심 행복 테마: ${res.activeRussellTheme.themeTitleKo} [${res.activeRussellTheme.themeTitleEn}]`,
    `- 동반 행복 테마: ${res.companionRussellTheme.themeTitleKo}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 실존적 통찰: ${res.activeRussellTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeRussellTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 핵심 성찰 질문: ${res.reflectionFocus}`,
    `- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.russellSynthesisMatrix.coreInsight}) | 실행(${res.russellSynthesisMatrix.recommendedAction}) | 주의(${res.russellSynthesisMatrix.cautionNotice})`,
    `- 러셀 원전 명언: "${res.focalRussellAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalRussellAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalRussellAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalRussellAphorism.actionGuidance}`,
    `- 종합 러셀 행복 권면: ${res.russellComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
