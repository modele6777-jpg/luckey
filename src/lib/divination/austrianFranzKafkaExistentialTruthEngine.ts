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
 * @version LUCKEY-FRANZ-KAFKA-EXISTENTIAL-TRUTH-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_FRANZ_KAFKA_EXISTENTIAL_TRUTH_VERSION = 'LUCKEY-FRANZ-KAFKA-EXISTENTIAL-TRUTH-v1.0.0';

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

export function calculateAustrianFranzKafkaExistentialTruth(
  profile?: UserProfile,
  query?: string,
): AustrianFranzKafkaExistentialTruthResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `FRANZ-KAFKA-EXISTENTIAL-TRUTH:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
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

  const guidanceTitle = `프란츠 카프카 실존 진실 및 부조리 극복 고독 지혜: ${activeKafkaTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 실존 문학의 거장 프란츠 카프카 선생은 부조리하고 소외된 세계 앞에서도 ` +
    `자기기만을 거부하고 벌거벗은 내면의 진실을 끝까지 응시하는 실존적 정직성과 영혼의 신성한 존엄을 가르쳤습니다. ` +
    `현재 당신의 도전을 깊이 있게 관통하는 핵심 통찰은 '${activeKafkaTheme.themeTitleKo}'입니다. ` +
    `${activeKafkaTheme.practicalCounsel} 카프카 선생의 불후의 아포리즘 "${focalKafkaAphorism.aphorismKo}" (${focalKafkaAphorism.aphorismGerman})을 깊이 새기며, ` +
    `${focalKafkaAphorism.actionGuidance}`;

  return {
    engineVersion: AUSTRIAN_FRANZ_KAFKA_EXISTENTIAL_TRUTH_VERSION,
    calculatedAtKst: new Date().toISOString(),
    existentialHonestyScore,
    innerSanctityInAlienationIndex,
    persistentTruthSearchScore,
    frozenSeaPiercingInsightIndex,
    transformativeSolitudeResilienceScore,
    activeKafkaTheme,
    focalKafkaAphorism,
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
    `【프란츠 카프카 《변신·성》 부조리 직시와 실존적 정직성 및 내적 존엄성 지표】`,
    `- 실존적 정직성 및 진실 직시도(Existential Honesty & Authenticity): ${res.existentialHonestyScore}/100`,
    `- 소외 속 영혼의 고독한 존엄성(Inner Sanctity in Alienation): ${res.innerSanctityInAlienationIndex}/100`,
    `- 부조리 앞 끈질긴 진실 추구 인내심(Persistent Truth Search): ${res.persistentTruthSearchScore}/100`,
    `- 얼어붙은 바다를 깨는 도끼 명민함(Axe for Frozen Sea Insight): ${res.frozenSeaPiercingInsightIndex}/100`,
    `- 고독의 내면 승화 회복탄력성(Transformative Solitude Resilience): ${res.transformativeSolitudeResilienceScore}/100`,
    `- 핵심 카프카 테마: ${res.activeKafkaTheme.themeTitleKo} [${res.activeKafkaTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeKafkaTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeKafkaTheme.practicalCounsel}`,
    `- 카프카 원전 명언: "${res.focalKafkaAphorism.aphorismKo}" (${res.focalKafkaAphorism.aphorismGerman})`,
    `- 원전 출처: [${res.focalKafkaAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalKafkaAphorism.actionGuidance}`,
    `- 종합 카프카 권면: ${res.kafkaComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
