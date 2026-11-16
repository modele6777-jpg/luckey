/**
 * 고대 그리스/로마 플로티노스(Plotinus) 《엔네아데스(Enneads)》 일자유출설 & 영적 귀환·내면합일(Henosis) 지혜 엔진
 *
 * 3세기 신플라톤주의 창시자 플로티노스의 《엔네아데스》 사상 기반:
 * 일자(The One), 누스(Nous), 프쉬케(Psyche), 헤노시스(Henosis)의 내면 정화·관조·합일 관점.
 *
 * @version LUCKEY-PLOTINUS-ENNEADS-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const ANCIENT_GREEK_PLOTINUS_VERSION = 'LUCKEY-PLOTINUS-ENNEADS-v2.1.0';

export type PlotinusQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';
export type PlotinusAscentStage = 'KATHARSIS_PURIFICATION' | 'NOUS_ILLUMINATION' | 'HENOSIS_STILLNESS';

export interface PlotinusTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface PlotinusAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGreek: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface PlotinusSituationalAudit {
  topic: PlotinusQuestionTopic;
  enneadsRef: string;
  shadowTrap: string;
  dialecticQuestion: string;
  katharsisPractice: string;
}

export interface PlotinusTemporalRhythm {
  kstWindowLabel: string;
  seasonTone: string;
  henosisClarityState: string;
  contemplativeCue: string;
}

export interface PlotinusSynthesisMatrix {
  katharsisReadiness: string;
  nousAlignment: string;
  henosisStillness: string;
  integrativeSummary: string;
}

export interface AncientGreekPlotinusEnneadsHenosisResult {
  engineVersion: string;
  calculatedAtKst: string;
  theOneSupremeSourceEmanationScore: number;
  nousIntellectualContemplationIndex: number;
  psycheSoulSelfCultivationScore: number;
  henosisMysticAscentUnionIndex: number;
  innerBeautySculptingVirtueScore: number;
  questionTopic: PlotinusQuestionTopic;
  ascentStage: PlotinusAscentStage;
  ascentStageLabel: string;
  activePlotinusTheme: PlotinusTheme;
  focalPlotinusAphorism: PlotinusAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  situationalEnneadsAudit: PlotinusSituationalAudit;
  temporalNousRhythm: PlotinusTemporalRhythm;
  plotinusSynthesisMatrix: PlotinusSynthesisMatrix;
  plotinusComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const PLOTINUS_THEMES: PlotinusTheme[] = [
  {
    themeKey: 'return_to_the_one',
    themeTitleEn: 'Return to the Supreme One (궁극의 일자로의 영적 귀환)',
    themeTitleKo: '물질의 분열과 혼란을 벗어나 만물의 근원인 고요한 일자로 향함',
    existentialInsight: '우리의 방황은 내면의 근원을 잊고 바깥의 소란에 마음을 흩뿌릴 때 시작되며, 시선을 안으로 돌릴 때 고요한 중심이 회복됩니다.',
    practicalCounsel: '바깥세상의 소란과 끝없는 비교에 마음을 빼앗기지 말고, 잠시 숨을 고르며 내면의 가장 깊은 고요 속으로 돌아가십시오.',
  },
  {
    themeKey: 'sculpting_inner_statue',
    themeTitleEn: 'Sculpting Your Own Inner Statue (내면의 조각상을 깎아냄)',
    themeTitleKo: '자신의 영혼에서 불필요한 번뇌와 집착을 깎아내어 본래의 고결함을 드러냄',
    existentialInsight: '조각가는 돌에 무언가를 덧붙이지 않고 불필요한 부분을 덜어냄으로써 숨겨진 형상을 드러냅니다. 내면의 성숙 역시 욕망을 덧대기보다 군더더기를 비우는 데 있습니다.',
    practicalCounsel: '없는 것을 억지로 끌어모으려 애태우지 말고, 마음을 흐리는 조급함과 허영을 덜어내어 본래의 맑은 결을 드러내십시오.',
  },
  {
    themeKey: 'nous_contemplative_illumination',
    themeTitleEn: 'Nous Contemplative Illumination (누스 지성의 영원한 진리 관조)',
    themeTitleKo: '변화무쌍한 감각의 허상을 뚫고 영원불멸한 본질과 지혜를 응시함',
    existentialInsight: '눈앞의 흔들림은 지나가는 그림자이지만, 맑은 지성은 시간을 견디는 본질과 질서를 응시합니다. 현상의 이면을 살피는 자가 흔들리지 않습니다.',
    practicalCounsel: '일시적인 성패나 작은 손익에 일희일비하지 말고, 한 걸음 물러나 사건 전체의 구조와 본질적 흐름을 맑게 관조하십시오.',
  },
  {
    themeKey: 'soul_harmonizing_cosmos',
    themeTitleEn: 'Soul Harmonizing the Cosmos (우주와 공명하는 프쉬케의 조화)',
    themeTitleKo: '육체의 한계에 갇히지 않고 만유를 살리는 너른 생명력으로 소통함',
    existentialInsight: '영혼이 감각적 조건에 끌려다니지 않고 삶을 조화롭게 이끌 때, 평범한 일상도 유기적인 아름다움과 질서를 되찾습니다.',
    practicalCounsel: '몸과 일상 공간을 무질서 속에 방치하지 말고, 정돈된 마음과 따뜻한 태도로 주변과의 조화로운 울림을 만들어 가십시오.',
  },
  {
    themeKey: 'flight_of_the_alone_to_the_alone',
    themeTitleEn: 'Flight of the Alone to the Alone (홀로 있는 자의 신성한 비상)',
    themeTitleKo: '세속의 온갖 의존과 결핍을 털어내고 절대적 온전함에 도달함',
    existentialInsight: '홀로 있는 자의 귀환은 외로운 고립이 아니라, 외부의 조건이나 타인의 승인에 기대지 않고도 스스로 온전한 자유의 경지를 뜻합니다.',
    practicalCounsel: '타인의 인정이나 평가에 목말라하지 말고, 이미 내 안에 자리한 온전한 중심과 품위를 고요히 회복하십시오.',
  },
];

export const PLOTINUS_APHORISMS: PlotinusAphorism[] = [
  {
    aphorismKey: 'sculpt_your_own_statue',
    aphorismKo: '내면을 어지럽히는 불필요한 군더더기를 조각가가 돌을 깎아내듯 덜어내어 본래의 맑은 품성을 드러내십시오.',
    aphorismGreek: 'Κόλουε τὰ περιττὰ καὶ ἀπεύθυνε τὰ σκολιά',
    sourceContext: '엔네아데스 I.6.9 내면 조각 비유',
    actionGuidance: '내면을 어지럽히는 불필요한 잡념과 감정의 군더더기를 과감히 덜어내고, 본래의 고결한 품성을 회복하십시오.',
  },
  {
    aphorismKey: 'awaken_inner_eyesight',
    aphorismKo: '참된 귀환은 바깥을 헤매는 것이 아니라 감각의 소란을 닫고 내면의 맑은 시력을 일깨우는 것입니다.',
    aphorismGreek: 'Οὐ ποσὶ δεῖ ποιεῖσθαι τὴν πορείαν',
    sourceContext: '엔네아데스 I.6.8 내면 시력 비유',
    actionGuidance: '감각적인 외적 자극에 끌려다니기를 멈추고, 직관과 내적 통찰의 밝은 눈을 뜨십시오.',
  },
  {
    aphorismKey: 'flight_of_the_alone',
    aphorismKo: '세속의 번뇌를 벗어던지고 홀로 온전한 중심에서 고요한 근원으로 비상하는 자유를 품으십시오.',
    aphorismGreek: 'Φυγὴ μόνου πρὸς μόνον',
    sourceContext: '엔네아데스 VI.9.11 일자 귀환 상징',
    actionGuidance: '주변의 기대나 세상의 평가에 구애받지 말고, 오직 영혼의 가장 깊은 진실과 고요 속으로 당당히 나아가십시오.',
  },
  {
    aphorismKey: 'light_recognizes_light',
    aphorismKo: '빛을 닮은 눈만이 빛을 알아보듯, 먼저 내 마음을 맑고 고결하게 가꿀 때 참된 아름다움과 만납니다.',
    aphorismGreek: 'Τὸ καλὸν ἴδοι ἂν ψυχὴ καλὴ γενομένη',
    sourceContext: '엔네아데스 I.6.9 내면 미학 비유',
    actionGuidance: '더 높은 삶과 좋은 인연을 바란다면 먼저 자신의 마음과 언행을 맑고 고결하게 가꾸십시오.',
  },
];

function classifyPlotinusTopic(question: string): PlotinusQuestionTopic {
  if (/연애|사랑|관계|이별|갈등|상대|사람|친구|가족|부부|직장동료/.test(question)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|투자|계약|시험|진로|방향|옮길|할까|말까/.test(question)) {
    return 'decision';
  }
  if (/치유|회복|불안|지침|슬픔|분노|상처|우울|번아웃|스트레스|두려움/.test(question)) {
    return 'healing';
  }
  return 'reflection';
}

const PLOTINUS_STAGE_LABELS: Record<PlotinusAscentStage, string> = {
  KATHARSIS_PURIFICATION: '정화의 단계 — 마음의 군더더기와 외적 집착을 덜어내어 본래의 맑은 결을 회복하는 시기',
  NOUS_ILLUMINATION: '관조의 단계 — 흔들리는 현상 너머의 본질적 질서와 구조를 맑은 지성으로 비추어 보는 시기',
  HENOSIS_STILLNESS: '귀환의 단계 — 외부의 승인이나 분주함을 내려놓고 내면의 깊은 고요와 합일하는 시기',
};

const PLOTINUS_TOPIC_PRACTICE: Record<PlotinusQuestionTopic, string> = {
  relationship: '상대에게서 결핍을 채우려 하기보다 내 안의 조화와 맑음을 먼저 회복할 때, 관계 역시 그 빛을 닮아 단단해집니다.',
  decision: '바깥의 소란이나 유행이 아니라, 내면의 군더더기를 깎아낸 뒤에 남는 가장 본질적인 기준을 따라 선택하십시오.',
  healing: '지친 마음을 달래는 가장 깊은 길은 무언가를 억지로 더하는 것이 아니라, 나를 짓누르던 불필요한 기대와 집착을 덜어내는 것입니다.',
  reflection: '눈에 보이는 성취 너머에서 지금 내 영혼의 조각상을 가장 흐리게 만드는 군더더기가 무엇인지 고요히 살펴보십시오.',
};

const PLOTINUS_TOPIC_RITUAL: Record<PlotinusQuestionTopic, string> = {
  relationship: '오늘 만남이나 연락에 앞서 마음을 가라앉히고, 상대의 반응과 무관하게 내가 지키고 싶은 품위와 온기를 먼저 정해 두십시오.',
  decision: '고민 중인 일에서 남의 시선이나 체면 때문에 붙든 조건을 하나 지워 보고, 남은 핵심만 바라보며 결정의 감각을 느껴 보십시오.',
  healing: '잠시 화면과 소음을 멀리하고 눈을 감은 채, 오늘 내 마음을 어지럽힌 생각 하나를 가만히 놓아 보내는 호흡을 이어 가십시오.',
  reflection: '오늘 하루 나를 소모시킨 불필요한 걱정 하나를 떠올려 마음의 조각도에서 덜어내는 상상을 해 보십시오.',
};

const PLOTINUS_TOPIC_REFLECTION: Record<PlotinusQuestionTopic, string> = {
  relationship: '이 관계에서 내가 상대에게 바라는 빛을 내 안에서는 얼마나 맑게 가꾸고 있나요?',
  decision: '세상의 평가와 소음을 잠시 끈다면, 내면의 맑은 시선이 가리키는 방향은 어디인가요?',
  healing: '더 채워야 낫는다고 믿었던 것 중에서, 사실은 비워 내야 비로소 숨이 트이는 짐은 무엇인가요?',
  reflection: '지금 내 마음의 조각상에서 가장 먼저 다듬고 덜어내고 싶은 거친 모서리는 무엇인가요?',
};

function buildPlotinusSituationalAudit(topic: PlotinusQuestionTopic): PlotinusSituationalAudit {
  switch (topic) {
    case 'relationship':
      return {
        topic,
        enneadsRef: '《엔네아데스》 V.1.1 (영혼이 근원을 잊고 타자성에 흩어짐)',
        shadowTrap: '상대의 인정과 반응에 내 존재의 중심을 맡긴 채 결핍을 바깥에서 채우려는 의존',
        dialecticQuestion: '상대의 말이 닿기 전, 내가 먼저 스스로에게 건네야 할 온전한 품위는 무엇인가요?',
        katharsisPractice: '상대를 바꾸려는 조급함을 덜어내고, 먼저 내 시선과 말의 결을 고요히 정돈합니다.',
      };
    case 'decision':
      return {
        topic,
        enneadsRef: '《엔네아데스》 I.6.8 (발이 아니라 내면의 눈으로 돌아가는 길)',
        shadowTrap: '세속의 평판·비교·조바심이라는 덧칠 때문에 본질적 기준을 흐리는 선택',
        dialecticQuestion: '남에게 보이기 위한 조건을 모두 깎아내면, 끝까지 남는 단 하나의 중심은 무엇인가요?',
        katharsisPractice: '선택지마다 붙은 허영과 두려움의 군더더기를 하나씩 지우고 남은 핵심만으로 결정합니다.',
      };
    case 'healing':
      return {
        topic,
        enneadsRef: '《엔네아데스》 I.6.9 (내면의 조각상에서 불필요한 것을 깎아냄)',
        shadowTrap: '지친 영혼 위에 더 많은 성취나 위로를 덧씌워 오히려 무거워지는 과잉',
        dialecticQuestion: '지금 내 영혼의 조각상을 무겁게 덮고 있는 낡은 껍질 한 겹은 무엇인가요?',
        katharsisPractice: '억지로 힘을 내기보다 마음을 어지럽히는 소음과 자책을 가만히 덜어내어 숨을 틔웁니다.',
      };
    default:
      return {
        topic,
        enneadsRef: '《엔네아데스》 VI.9.11 (홀로 있는 자의 홀로 계신 분께로의 비상)',
        shadowTrap: '외부의 분주함과 끝없는 비교에 마음을 흩뿌려 내면의 고요를 잃는 분산',
        dialecticQuestion: '지금 이 순간 어떤 역할도 맡지 않은 채 고요히 서 있는 나 자신은 어떤 모습인가요?',
        katharsisPractice: '하루 중 잠시 바깥의 소리를 끄고 내면의 맑은 중심이 제자리를 찾도록 고요히 머뭅니다.',
      };
  }
}

function buildPlotinusTemporalRhythm(now: Date): PlotinusTemporalRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  let kstWindowLabel = '새벽 카타르시스 시간대 (내면 정화)';
  let henosisClarityState = '잡념이 가라앉고 본래의 맑은 결이 드러나는 고요한 정화의 흐름';
  let contemplativeCue = '하루를 열기 전, 불필요한 걱정 한 가지를 먼저 내려놓는 짧은 침묵이 큰 중심을 세워 줍니다.';

  if (hour >= 7 && hour < 12) {
    kstWindowLabel = '오전 누스 관조 시간대 (본질 응시)';
    henosisClarityState = '현상의 세부를 넘어 전체 질서와 구조를 맑게 꿰뚫어 보는 지성의 흐름';
    contemplativeCue = '눈앞의 분주함에 휩쓸리기 전에 오늘 가장 본질적인 한 가지 축을 먼저 세워 두십시오.';
  } else if (hour >= 12 && hour < 18) {
    kstWindowLabel = '오후 프쉬케 조화 시간대 (질서 실현)';
    henosisClarityState = '생각과 행위가 일상과 관계 속에서 조화로운 형태를 빚어 가는 흐름';
    contemplativeCue = '주변의 소란과 부딪히더라도 내면의 맑은 시선을 잃지 않고 태도의 품위를 지켜 내십시오.';
  } else if (hour >= 18 && hour < 23) {
    kstWindowLabel = '밤 헤노시스 귀환 시간대 (고요한 합일)';
    henosisClarityState = '바깥으로 흩어졌던 시선을 다시 안으로 거두어 온전한 쉼으로 돌아가는 흐름';
    contemplativeCue = '오늘 하루 타인의 시선 때문에 짊어졌던 긴장을 내려놓고 내면의 고요 속으로 돌아가십시오.';
  }

  let seasonTone = '가을의 수렴 — 겉잎을 덜어내고 내면의 맑은 중심을 남기는 절제';
  if (month >= 3 && month <= 5) {
    seasonTone = '봄의 유출 — 맑은 빛이 일상의 결을 따라 부드럽게 번져 나가는 개화';
  } else if (month >= 6 && month <= 8) {
    seasonTone = '여름의 현현 — 넘치는 생명력 속에서도 중심의 고요를 잃지 않는 균형';
  } else if (month === 12 || month <= 2) {
    seasonTone = '겨울의 귀환 — 외적 분주함을 멈추고 내면의 조각상을 깊이 다듬는 침잠';
  }

  return {
    kstWindowLabel,
    seasonTone,
    henosisClarityState,
    contemplativeCue,
  };
}

function buildPlotinusSynthesisMatrix(
  stage: PlotinusAscentStage,
  topic: PlotinusQuestionTopic,
  temporal: PlotinusTemporalRhythm
): PlotinusSynthesisMatrix {
  const katharsisReadiness = stage === 'KATHARSIS_PURIFICATION'
    ? '우선순위 높음 — 덧씌워진 집착과 체면의 군더더기를 덜어내는 정화가 출발점입니다.'
    : '정돈됨 — 불필요한 소음을 가라앉히고 본질만 남길 준비가 되어 있습니다.';
  const nousAlignment = topic === 'decision' || topic === 'reflection'
    ? '명료함 — 단편적 이해관계를 넘어 전체 구조와 본질을 바라보는 시선이 열려 있습니다.'
    : '안정적 — 감정적 파동 뒤편의 조용한 이치와 흐름을 차분히 짚어 볼 수 있습니다.';
  const henosisStillness = stage === 'HENOSIS_STILLNESS'
    ? '깊음 — 외부의 승인 없이도 홀로 온전한 고요에 머무를 수 있는 내적 중심이 섰습니다.'
    : '성숙 중 — 바깥에서 안으로 시선을 되돌릴수록 마음의 고요가 빠르게 회복됩니다.';

  return {
    katharsisReadiness,
    nousAlignment,
    henosisStillness,
    integrativeSummary: `${temporal.kstWindowLabel}의 흐름 속에서 더하기보다 덜어냄(카타르시스)으로 내면의 맑은 중심을 세울 때 해답이 또렷해집니다.`,
  };
}

export function calculateAncientGreekPlotinusEnneadsHenosis(
  profile: UserProfile,
  now: Date = new Date(),
  question = ''
): AncientGreekPlotinusEnneadsHenosisResult {
  const p = profile as unknown as Record<string, string | undefined>;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const seedString = `PLOTINUS-ENNEADS-HENOSIS:${name}:${birthDate}:${birthTime}:${gender}:${kstDate}:${question}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const theOneSupremeSourceEmanationScore = 76 + (absHash % 23);
  const nousIntellectualContemplationIndex = 75 + ((absHash >> 3) % 24);
  const psycheSoulSelfCultivationScore = 74 + ((absHash >> 6) % 25);
  const henosisMysticAscentUnionIndex = 77 + ((absHash >> 9) % 22);
  const innerBeautySculptingVirtueScore = 73 + ((absHash >> 12) % 26);

  const themeIndex = (absHash >> 4) % PLOTINUS_THEMES.length;
  const aphorismIndex = (absHash >> 7) % PLOTINUS_APHORISMS.length;

  const activePlotinusTheme = PLOTINUS_THEMES[themeIndex];
  const focalPlotinusAphorism = PLOTINUS_APHORISMS[aphorismIndex];
  const questionTopic = classifyPlotinusTopic(question);

  const stages: PlotinusAscentStage[] = ['KATHARSIS_PURIFICATION', 'NOUS_ILLUMINATION', 'HENOSIS_STILLNESS'];
  const ascentStage = stages[(absHash >> 2) % stages.length];
  const ascentStageLabel = PLOTINUS_STAGE_LABELS[ascentStage];

  const situationalEnneadsAudit = buildPlotinusSituationalAudit(questionTopic);
  const temporalNousRhythm = buildPlotinusTemporalRhythm(now);
  const plotinusSynthesisMatrix = buildPlotinusSynthesisMatrix(ascentStage, questionTopic, temporalNousRhythm);

  const practiceGuidance = `${activePlotinusTheme.practicalCounsel} ${PLOTINUS_TOPIC_PRACTICE[questionTopic]}`;
  const ritualAction = PLOTINUS_TOPIC_RITUAL[questionTopic];
  const reflectionFocus = PLOTINUS_TOPIC_REFLECTION[questionTopic];
  const boundaryNotice = '이 관점은 플로티노스 신플라톤주의의 정화와 관조 상징을 빌린 정성적 성찰이며, 우열의 점수나 확정적 예언이 아닙니다.';

  const guidanceTitle = `플로티노스 엔네아데스 일자 유출과 영적 귀환 지혜: ${activePlotinusTheme.themeTitleKo}`;
  const philosophicalCounsel = `${activePlotinusTheme.practicalCounsel} ${PLOTINUS_TOPIC_PRACTICE[questionTopic]} ${focalPlotinusAphorism.actionGuidance}`;

  return {
    engineVersion: ANCIENT_GREEK_PLOTINUS_VERSION,
    calculatedAtKst: now.toISOString(),
    theOneSupremeSourceEmanationScore,
    nousIntellectualContemplationIndex,
    psycheSoulSelfCultivationScore,
    henosisMysticAscentUnionIndex,
    innerBeautySculptingVirtueScore,
    questionTopic,
    ascentStage,
    ascentStageLabel,
    activePlotinusTheme,
    focalPlotinusAphorism,
    practiceGuidance,
    ritualAction,
    reflectionFocus,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    situationalEnneadsAudit,
    temporalNousRhythm,
    plotinusSynthesisMatrix,
    plotinusComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAncientGreekPlotinusEnneadsHenosisPrompt(res: AncientGreekPlotinusEnneadsHenosisResult): string {
  return [
    `【플로티노스 《엔네아데스》 일자유출설 & 영적 귀환 지표】`,
    `- 귀환 단계: ${res.ascentStageLabel}`,
    `- 핵심 영적 테마: ${res.activePlotinusTheme.themeTitleKo} [${res.activePlotinusTheme.themeTitleEn}]`,
    `- 질문 맥락 감사(${res.situationalEnneadsAudit.enneadsRef}): 함정(${res.situationalEnneadsAudit.shadowTrap}) → 변증 질문("${res.situationalEnneadsAudit.dialecticQuestion}") / 정화 실천(${res.situationalEnneadsAudit.katharsisPractice})`,
    `- KST 시공간 리듬(${res.temporalNousRhythm.kstWindowLabel} · ${res.temporalNousRhythm.seasonTone}): ${res.temporalNousRhythm.henosisClarityState} (${res.temporalNousRhythm.contemplativeCue})`,
    `- 엔네아데스 교차 매트릭스: 정화(${res.plotinusSynthesisMatrix.katharsisReadiness}) | 누스(${res.plotinusSynthesisMatrix.nousAlignment}) | 헤노시스(${res.plotinusSynthesisMatrix.henosisStillness})`,
    `- 실존적 통찰: ${res.activePlotinusTheme.existentialInsight}`,
    `- 실천 조언: ${res.practiceGuidance}`,
    `- 일상 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectionFocus}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
