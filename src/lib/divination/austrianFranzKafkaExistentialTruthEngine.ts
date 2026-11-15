/**
 * 오스트리아/체코 프란츠 카프카(Franz Kafka) 《변신(Die Verwandlung)》 & 《성(Das Schloss)》 부조리 직시와 실존적 정직성 & 고독 속 영혼의 존엄과 진실 추구 지혜 엔진
 *
 * 20세기 실존 문학의 거장 프란츠 카프카(1883~1924) 선생의 불후의 명작 《변신》, 《소송》, 《성》, 《밀레나에게 보내는 편지》 및 일기 원전 기반:
 * 1. 실존적 정직성 및 진실 직시도 (Existential Honesty & Radical Authenticity Score): 허위의식과 자기기만을 용납하지 않고 벌거벗은 내면의 진실을 응시하는 정직함.
 * 2. 소외 속 영혼의 고독한 존엄성 지표 (Inner Sanctity of the Soul in Alienation Index): 현대 사회의 관료적 소외와 단절 속에서도 훼손되지 않는 영혼의 신성한 고유성.
 * 3. 부조리 앞 끈질긴 진실 추구 인내심 (Persistent Search for Truth Against Absurdity Score): 불투명하고 거대한 성벽 앞에서도 결코 포기하지 않고 발걸음을 옮기는 인내.
 * 4. 얼어붙은 바다를 깨는 도끼와 같은 명민함 (Axe for the Frozen Sea Insight Index): 일상의 무감각과 안일함을 깨부수고 삶의 전율과 본질을 일깨우는 날카로운 통찰력.
 * 5. 깊은 고독의 내면 승화 회복탄력성 (Transformative Solitude & Creative Resilience Score): 고립과 고통의 심연을 정직하게 관통하여 예술적 사색과 내적 순수성으로 승화하는 힘.
 *
 * @version LUCKEY-FRANZ-KAFKA-EXISTENTIAL-TRUTH-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_FRANZ_KAFKA_EXISTENTIAL_TRUTH_VERSION = 'LUCKEY-FRANZ-KAFKA-EXISTENTIAL-TRUTH-v2.0.0';

export type KafkaQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface KafkaSituationalAudit {
  questionTopic: KafkaQuestionTopic;
  focusAxisKo: string;
  existentialPosture: string;
  classicalCitation: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
}

export interface KafkaTemporalRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  dailyWatchword: string;
}

export interface KafkaTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface KafkaAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AustrianFranzKafkaExistentialTruthResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 카프카 실존 진실 핵심 지표 (0~100)
  existentialHonestyScore: number;                 // 실존적 정직성 및 진실 직시도 (Existential Honesty)
  innerSanctityInAlienationIndex: number;          // 소외 속 영혼의 고독한 존엄성 지표 (Inner Sanctity in Alienation)
  persistentTruthSearchScore: number;             // 부조리 앞 끈질긴 진실 추구 인내심 (Persistent Truth Search)
  frozenSeaPiercingInsightIndex: number;          // 얼어붙은 바다를 깨는 도끼 명민함 (Axe for Frozen Sea)
  transformativeSolitudeResilienceScore: number;  // 고독의 내면 승화 회복탄력성 (Transformative Solitude Resilience)
  // 세부 분석
  activeKafkaTheme: KafkaTheme;
  focalKafkaAphorism: KafkaAphorism;
  questionTopic: KafkaQuestionTopic;
  situationalKafkaAudit: KafkaSituationalAudit;
  temporalKafkaRhythm: KafkaTemporalRhythm;
  kafkaSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  kafkaComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const KAFKA_THEMES: KafkaTheme[] = [
  {
    themeKey: 'axeForFrozenSea',
    themeTitleEn: 'Axe for the Frozen Sea: Shattering Numbness into Luminous Awareness',
    themeTitleKo: '얼어붙은 바다를 깨는 도끼 — 안일한 타성을 부수고 영혼의 진실을 깨우기',
    pragmaticInsight: '책이란 우리 안의 얼어붙은 바다를 깨부수는 도끼여야 한다는 카프카의 고백처럼, 진정한 성장은 불편한 진실을 직시하고 내면의 무감각을 깨뜨릴 때 비로소 시작됩니다.',
    practicalCounsel: '겉치레와 쉬운 위안에 숨지 마십시오. 당신이 마주하기 두려워했던 질문을 정면으로 마주하고, 의식의 얼음을 깨고 나와 삶의 생생한 감각과 결기를 되찾으십시오.',
  },
  {
    themeKey: 'dignityInAlienation',
    themeTitleEn: 'Sacred Solitude: Preserving the Uncompromised Soul Amidst the Labyrinth',
    themeTitleKo: '소외 속 고독한 존엄 — 미로 같은 세상 속에서도 내 영혼의 순결함을 지키기',
    pragmaticInsight: '그레고르 잠자가 거대한 벌레로 변했을 때조차 그의 내면은 누구보다 인간적이고 순수했습니다. 세상이 당신을 오해하거나 소외시킬지라도 당신 영혼의 거룩한 중심은 결코 더럽혀지지 않습니다.',
    practicalCounsel: '타인의 차가운 시선이나 제도의 몰이해에 마음을 다치지 마십시오. 외부의 소음에서 한 걸음 물러나 침묵 속에서 당신 자신의 고유한 가치와 순수한 양심을 굳게 끌어안으십시오.',
  },
  {
    themeKey: 'journeyToTheCastle',
    themeTitleEn: 'The Castle Pilgrimage: Persistent Steps Toward the Elusive Gate',
    themeTitleKo: '성을 향한 끊임없는 발걸음 — 불확실성 속에서도 묵묵히 나의 길을 걷기',
    pragmaticInsight: '카프카의 소설 《성》의 주인공 K처럼, 세상의 문은 쉽게 열리지 않고 모든 것은 안개에 싸여 있을 수 있습니다. 그러나 포기하지 않고 발을 내딛는 그 과정 자체가 실존의 위대한 증명입니다.',
    practicalCounsel: '결과가 단번에 주어지지 않는다고 해서 낙담하지 마십시오. 안개 속에서도 오늘 내 몫의 한 걸음을 묵묵히 옮기십시오. 지치지 않는 성실함이 결국 굳게 닫힌 문을 두드릴 것입니다.',
  },
  {
    themeKey: 'writingAsPrayer',
    themeTitleEn: 'Art as Pure Prayer: Transmuting Suffering into Spiritual Clarity',
    themeTitleKo: '기도로서의 창작 — 고통과 불안을 맑은 사색과 창조의 빛으로 승화하기',
    pragmaticInsight: '카프카에게 글쓰기는 가장 순수한 형태의 기도였습니다. 삶의 불안과 상처를 회피하지 않고 종이 위에 정직하게 토로할 때, 어둠은 깊은 영적 통찰과 아름다움으로 변용됩니다.',
    practicalCounsel: '불안과 혼란을 억누르려 하지 마십시오. 글을 쓰거나 조용히 마음을 정리하며 내면의 언어로 기록하십시오. 생각을 정돈하는 행위 자체가 상처를 치유하고 마음에 고요를 선사할 것입니다.',
  },
  {
    themeKey: 'quietCourageOfIntegrity',
    themeTitleEn: 'Quiet Courage of Integrity: Standing Patiently for the Inward Truth',
    themeTitleKo: '정직한 실존의 용기 — 거짓 타협을 거부하고 온전한 진실의 편에 서기',
    pragmaticInsight: '진실은 시끄러운 확신 속에 있지 않고, 자신을 속이지 않는 정직하고 조용한 고백 속에 있습니다. 세상과 타협하기보다 나 자신에게 부끄러움이 없는 삶을 선택하는 것이 가장 고귀한 용기입니다.',
    practicalCounsel: '일시적인 이익을 위해 당신의 신념이나 도덕적 직관을 굽히지 마십시오. 아무도 보지 않는 순간에도 스스로에게 떳떳한 길을 선택하십시오. 그 단단한 정직성이 당신의 영원한 방패가 될 것입니다.',
  },
];

export const KAFKA_APHORISMS: KafkaAphorism[] = [
  {
    aphorismKey: 'frozenSeaAxe',
    aphorismKo: '한 권의 책은 우리 안의 얼어붙은 바다를 깨부수는 도끼여야 한다.',
    aphorismGerman: 'Ein Buch muss die Axt sein für das gefrorene Meer in uns.',
    sourceContext: '카프카 《오스카 폴락에게 보낸 편지(Brief an Oskar Pollak)》',
    actionGuidance: '마음의 안일한 타성을 깨부수십시오. 당신을 진정으로 각성시키는 깊은 진실과 마주하십시오.',
  },
  {
    aphorismKey: 'truthIsSimple',
    aphorismKo: '진리는 결코 분열되지 않으며, 따라서 스스로를 거짓된 가면으로 꾸미지 않는다.',
    aphorismGerman: 'Die Wahrheit ist unteilbar, kann sich also selbst nicht erkennen.',
    sourceContext: '카프카 《죄, 고통, 희망, 그리고 참된 길에 관한 아포리즘(Aphorismen)》',
    actionGuidance: '변명과 가식을 걷어내십시오. 가장 단순하고 명료한 진실 위에서 행동하십시오.',
  },
  {
    aphorismKey: 'patientWaiting',
    aphorismKo: '방황하지 말고 가만히 기다려라. 세상은 거짓 없이 네 발아래 펼쳐질 것이다.',
    aphorismGerman: 'Du brauchst nicht aus dem Haus zu gehen. Bleibe an deinem Tisch und horche.',
    sourceContext: '카프카 《어느 시골의사의 일기(Betrachtung)》',
    actionGuidance: '조급한 마음에 이리저리 흔들리지 마십시오. 고요히 침묵 속에서 중심을 지키며 기회를 관찰하십시오.',
  },
  {
    aphorismKey: 'indestructibleCore',
    aphorismKo: '인간의 내면에는 그 무엇으로도 파괴할 수 없는 영원한 불멸의 핵이 깃들어 있다.',
    aphorismGerman: 'Der Mensch kann nicht leben ohne ein dauerndes Vertrauen zu etwas Unzerstörbarem in sich.',
    sourceContext: '카프카 《자겔라우 아포리즘(Zürauer Aphorismen)》',
    actionGuidance: '어떤 시련 앞에서도 스스로를 잃지 마십시오. 당신 안의 파괴될 수 없는 고귀한 존엄을 믿으십시오.',
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

function classifyKafkaQuestionTopic(query: string): KafkaQuestionTopic {
  const q = query.trim();
  if (/(연애|사랑|관계|사람|가족|친구|이별|갈등|소통|오해|타인)/.test(q)) return 'relationship';
  if (/(결정|선택|이직|진로|시험|사업|투자|계약|방향|결단|포기|시작)/.test(q)) return 'decision';
  if (/(불안|우울|지침|피로|상처|아픔|두려움|고독|외로움|치유|회복|무기력)/.test(q)) return 'healing';
  return 'reflection';
}

function buildKafkaSituationalAudit(topic: KafkaQuestionTopic): KafkaSituationalAudit {
  const boundaryNotice = '카프카 실존 진실 관점은 내면의 정직성과 고독한 존엄을 비추는 상징적·성찰적 기준이며, 외부 현실의 법적·실무적 판단을 대신하지 않습니다.';
  if (topic === 'relationship') {
    return {
      questionTopic: topic,
      focusAxisKo: '관료적 소외와 오해 속에서도 지켜내는 영혼의 순결한 경계',
      existentialPosture: '그레고르 잠자가 가족의 낯선 시선 속에서도 인간적 온기를 잃지 않았듯, 타인의 오해에 자신을 깎아 맞추지 않는 내면의 단단한 중심.',
      classicalCitation: '《변신》·《밀레나에게 보내는 편지》: 타인의 편견이나 차가운 규정 앞에서도 자기 영혼의 진실함까지 내주지 말라.',
      practiceGuidance: '상대에게 인정받기 위해 본심을 왜곡하거나 과도한 가면을 쓰기보다, 담백하고 정직한 태도로 내 마음의 경계를 세우십시오.',
      ritualAction: '오늘 대화에서 상대의 눈치를 보며 억지로 덧붙이려던 변명 한 마디를 덜어내고, 가장 솔직한 한 문장만 남기십시오.',
      reflectionFocus: '지금 내가 지키고 싶은 관계의 진심은 무엇이며, 타인의 시선 때문에 억지로 연기하고 있는 부분은 어디입니까?',
      counselNote: '관계의 벽이 느껴질수록 겉으로 소리치기보다 자신의 진실한 중심을 단단히 붙드는 편이 낫습니다.',
      boundaryNotice,
    };
  }
  if (topic === 'decision') {
    return {
      questionTopic: topic,
      focusAxisKo: '안개 낀 성벽 앞에서도 발걸음을 멈추지 않는 정직한 결단',
      existentialPosture: '《성》의 K처럼 모든 조건이 투명하게 보장되지 않더라도, 자기기만 없이 오늘 감당할 한 걸음을 내딛는 결기.',
      classicalCitation: '《성(Das Schloss)》·《자겔라우 아포리즘》: 완벽한 보장이 주어질 때까지 기다리기보다 진실에 어긋나지 않는 방향을 택하라.',
      practiceGuidance: '당장의 안락함이나 남들이 정해 놓은 안전지대에 숨지 말고, 스스로에게 부끄럽지 않은 선택지를 먼저 가려내십시오.',
      ritualAction: '결정 앞의 두려움과 현실적 핑계를 종이에 한 줄씩 적고, 그중 자기기만에 해당하는 항목 하나를 선을 그어 지우십시오.',
      reflectionFocus: '결과가 불확실하다는 이유만으로 내 안의 가장 정직한 직관을 외면하고 있지는 않습니까?',
      counselNote: '모든 문이 한 번에 열리지 않더라도, 진실한 방향으로 옮긴 한 걸음은 결코 헛되지 않습니다.',
      boundaryNotice,
    };
  }
  if (topic === 'healing') {
    return {
      questionTopic: topic,
      focusAxisKo: '얼어붙은 바다를 깨고 내면의 숨결을 되살리는 고독의 승화',
      existentialPosture: '고립과 무력감을 억지로 덮지 않고 정직하게 응시하며, 글쓰기와 사색으로 상처를 맑게 건져 올리는 태도.',
      classicalCitation: '《오스카 폴락에게 보낸 편지》·《일기》: 얼어붙은 감각을 깨우는 정직한 직면이 오히려 영혼을 숨 쉬게 한다.',
      practiceGuidance: '괜찮은 척 스스로를 다그치지 말고, 지금 느끼는 피로와 고독의 무게를 있는 그대로 인정한 뒤 조용한 휴식의 시간을 확보하십시오.',
      ritualAction: '잠들기 전 10분간 휴대전화를 내려놓고, 오늘 나를 가장 지치게 한 감정 한 가지를 꾸밈없이 노트에 적어 내려놓으십시오.',
      reflectionFocus: '내가 애써 괜찮다고 덮어두었지만 사실은 다독임이 필요한 내면의 감정은 무엇입니까?',
      counselNote: '자기 안의 어둠을 정직하게 바라보는 순간, 무감각의 얼음은 서서히 풀리기 시작합니다.',
      boundaryNotice,
    };
  }
  return {
    questionTopic: topic,
    focusAxisKo: '자기기만을 걷어내고 파괴될 수 없는 내면의 핵을 응시하는 성찰',
    existentialPosture: '세속의 소음에서 한 걸음 물러나 내면의 순수한 양심과 고독한 존엄을 확인하는 관조의 자세.',
    classicalCitation: '《자겔라우 아포리즘》: 인간은 내면의 파괴될 수 없는 무언가에 대한 신뢰 없이는 살아갈 수 없다.',
    practiceGuidance: '바깥의 기준이나 조급한 비교를 잠시 멈추고, 나 자신만이 알고 있는 삶의 본질적 질문을 차분히 되짚어 보십시오.',
    ritualAction: '오늘 하루 중 가장 조용한 5분을 골라, 지금 내가 진정으로 붙들고 있는 가치가 무엇인지 한 문장으로 정리하십시오.',
    reflectionFocus: '세상의 평가가 모두 사라진 자리에서도 내가 끝까지 포기할 수 없는 내면의 진실은 무엇입니까?',
    counselNote: '침묵 속에서 자기 자신과 정직하게 마주하는 시간이 흔들리지 않는 방패가 됩니다.',
    boundaryNotice,
  };
}

function buildKafkaTemporalRhythm(now: Date): KafkaTemporalRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 해빙기(얼어붙은 바다를 깨는 각성)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 성벽기(안개 속을 돌파하는 끈기)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 성찰기(본질만 남기는 정직한 수확)'
        : '동계 침잠기(고독 속 내면의 핵을 지키는 겨울)';

  if (kstHour >= 5 && kstHour < 11) {
    return {
      kstHour,
      timeWindowKo: '새벽과 아침 · 변신의 문턱(Threshold of Awakening)',
      seasonKo,
      dailyWatchword: '하루의 소음이 몰려오기 전, 타인의 기대가 아닌 나 자신의 진실한 기준을 먼저 세우십시오.',
    };
  }
  if (kstHour >= 11 && kstHour < 17) {
    return {
      kstHour,
      timeWindowKo: '한낮 · 성벽 앞의 보행(Walk Before the Castle)',
      seasonKo,
      dailyWatchword: '복잡한 절차와 타인의 시선 한복판에서도 중심을 잃지 말고 오늘 해야 할 한 걸음을 묵묵히 옮기십시오.',
    };
  }
  if (kstHour >= 17 && kstHour < 22) {
    return {
      kstHour,
      timeWindowKo: '해질녘 · 가면을 벗는 시간(Unmasking Dusk)',
      seasonKo,
      dailyWatchword: '낮 동안 짊어졌던 역할과 방어막을 내려놓고, 지친 내면의 솔직한 목소리에 귀를 기울이십시오.',
    };
  }
  return {
    kstHour,
    timeWindowKo: '심야 · 기도로서의 글쓰기(Writing as Prayer)',
    seasonKo,
    dailyWatchword: '고요한 밤의 심연 속에서 불안과 고민을 정직한 문장으로 정리하며 내면의 평정을 되찾으십시오.',
  };
}

export function calculateAustrianFranzKafkaExistentialTruth(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): AustrianFranzKafkaExistentialTruthResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const kstDayKey = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seedString = `FRANZ-KAFKA-EXISTENTIAL-TRUTH:${name}:${birthDate}:${birthTime}:${gender}:${kstDayKey}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const existentialHonestyScore = 86 + ((absHash >> 1) % 13);
  const innerSanctityInAlienationIndex = 84 + ((absHash >> 4) % 15);
  const persistentTruthSearchScore = 85 + ((absHash >> 7) % 14);
  const frozenSeaPiercingInsightIndex = 87 + ((absHash >> 10) % 12);
  const transformativeSolitudeResilienceScore = 83 + ((absHash >> 13) % 16);

  const themeIndex = (absHash >> 5) % KAFKA_THEMES.length;
  const aphorismIndex = (absHash >> 8) % KAFKA_APHORISMS.length;

  const activeKafkaTheme = KAFKA_THEMES[themeIndex];
  const focalKafkaAphorism = KAFKA_APHORISMS[aphorismIndex];
  const questionTopic = classifyKafkaQuestionTopic(query ?? '');
  const situationalKafkaAudit = buildKafkaSituationalAudit(questionTopic);
  const temporalKafkaRhythm = buildKafkaTemporalRhythm(now);

  const guidanceTitle = `프란츠 카프카 실존 진실 및 부조리 극복 고독 지혜: ${activeKafkaTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 실존 문학의 거장 프란츠 카프카 선생은 부조리하고 소외된 세계 앞에서도 ` +
    `자기기만을 거부하고 벌거벗은 내면의 진실을 끝까지 응시하는 실존적 정직성과 영혼의 신성한 존엄을 가르쳤습니다. ` +
    `현재 질문의 결('${situationalKafkaAudit.focusAxisKo}')과 '${activeKafkaTheme.themeTitleKo}'의 통찰이 맞닿아 있습니다. ` +
    `${situationalKafkaAudit.practiceGuidance} 카프카의 아포리즘 "${focalKafkaAphorism.aphorismKo}" (${focalKafkaAphorism.aphorismGerman})을 새기며, ` +
    `${temporalKafkaRhythm.dailyWatchword}`;

  const kstDateObj = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstLabel = `${kstDateObj.toISOString().slice(0, 10)} ${String(kstDateObj.getUTCHours()).padStart(2, '0')}:${String(kstDateObj.getUTCMinutes()).padStart(2, '0')} KST`;
  const kafkaSynthesisMatrix = {
    coreInsight: activeKafkaTheme.themeTitleKo,
    recommendedAction: situationalKafkaAudit.practiceGuidance,
    cautionNotice: '외부의 모호함과 타인의 시선에 맞춰 내면의 진실한 중심을 꺾지 마십시오.',
  };

  return {
    engineVersion: AUSTRIAN_FRANZ_KAFKA_EXISTENTIAL_TRUTH_VERSION,
    calculatedAtKst: kstLabel,
    existentialHonestyScore,
    innerSanctityInAlienationIndex,
    persistentTruthSearchScore,
    frozenSeaPiercingInsightIndex,
    transformativeSolitudeResilienceScore,
    activeKafkaTheme,
    focalKafkaAphorism,
    questionTopic,
    situationalKafkaAudit,
    temporalKafkaRhythm,
    kafkaSynthesisMatrix,
    kafkaComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAustrianFranzKafkaExistentialTruthPrompt(
  res: AustrianFranzKafkaExistentialTruthResult,
): string {
  return [
    `【프란츠 카프카 《변신·성》 부조리 직시와 실존적 정직성 및 내적 존엄성 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락 초점(${res.questionTopic}): ${res.situationalKafkaAudit.focusAxisKo}`,
    `- 실존적 태도: ${res.situationalKafkaAudit.existentialPosture}`,
    `- KST 시공간 리듬: ${res.temporalKafkaRhythm.timeWindowKo} · ${res.temporalKafkaRhythm.seasonKo}`,
    `- 핵심 카프카 테마: ${res.activeKafkaTheme.themeTitleKo} [${res.activeKafkaTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeKafkaTheme.pragmaticInsight}`,
    `- 질문 맞춤 조언: ${res.situationalKafkaAudit.practiceGuidance}`,
    `- 일상 의례 제안: ${res.situationalKafkaAudit.ritualAction}`,
    `- 성찰 질문: ${res.situationalKafkaAudit.reflectionFocus}`,
    `- 조언 요약: ${res.situationalKafkaAudit.counselNote}`,
    `- 교차 매트릭스: 핵심(${res.kafkaSynthesisMatrix.coreInsight}) | 실행(${res.kafkaSynthesisMatrix.recommendedAction}) | 주의(${res.kafkaSynthesisMatrix.cautionNotice})`,
    `- 카프카 원전 명언: "${res.focalKafkaAphorism.aphorismKo}" (${res.focalKafkaAphorism.aphorismGerman})`,
    `- 원전 출처: [${res.focalKafkaAphorism.sourceContext}]`,
    `- 시간대 권고: ${res.temporalKafkaRhythm.dailyWatchword}`,
    `- 종합 카프카 권면: ${res.kafkaComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.situationalKafkaAudit.boundaryNotice}`,
  ].join('\n');
}
