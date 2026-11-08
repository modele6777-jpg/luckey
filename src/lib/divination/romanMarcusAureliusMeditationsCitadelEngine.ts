/**
 * 로마 마르쿠스 아우렐리우스(Marcus Aurelius) 황제 《명상록(Ta Eis Heauton / Meditations)》 내면의 성채 & 스토아 실존 평정 지혜 엔진
 *
 * 로마 제국 제16대 황제이자 후기 스토아 철학의 불멸의 현자 마르쿠스 아우렐리우스(121~180)의 자성록 《명상록(Meditations)》 원전 기반:
 * 1. 내면의 성채(Inner Citadel / Hegemonikon): 외부의 혼란, 전염병, 전쟁, 비난 속에서도 파괴되지 않는 영혼의 사유 중추이자 흔들리지 않는 내적 지도력.
 * 2. 로고스 섭리 순응(Providentia / Logos): 대우주의 필연적 자연법칙을 신뢰하고, 자신에게 주어진 환경과 사건을 겸허히 품어 안는 우주적 조화.
 * 3. 메멘토 모리(Memento Mori): 삶의 유한함과 덧없음을 직시함으로써 오늘 지금 이 순간 가장 본질적이고 고귀한 일에 전념하는 지적 명찰함.
 * 4. 코이노니아 공공선 의무(Koinonia): 인류 공동체의 일원이자 꿀벌의 한 마리로서 공동의 유익을 위해 이기심을 내려놓고 의무를 다하는 도덕적 성실성.
 * 5. 아파테이아 평정심(Apatheia): 통제할 수 없는 외부 결과(타인의 평판, 부귀영화, 질병)에 대한 헛된 불안과 욕망을 걷어낸 절대적 내면의 고요.
 *
 * @version LUCKEY-MARCUS-AURELIUS-CITADEL-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const ROMAN_MARCUS_AURELIUS_VERSION = 'LUCKEY-MARCUS-AURELIUS-CITADEL-v1.0.0';

export interface MeditationsTheme {
  themeKey: string;
  themeTitleGreek: string;
  themeTitleKo: string;
  stoicInsight: string;
  practicalCounsel: string;
}

export interface MeditationsAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGreekOrLatin: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface MarcusAureliusMeditationsCitadelResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 스토아 실존 평정 지표 (0~100)
  innerCitadelResilienceScore: number;     // 내면의 성채 회복탄력성 (Hegemonikon)
  logosProvidenceAlignmentScore: number;   // 로고스 섭리 순응도 (Providentia)
  mementoMoriClarityQuotient: number;      // 메멘토 모리 명찰도 (Memento Mori)
  koinoniaCosmopolitanDutyScore: number;   // 코이노니아 공동체 의무도 (Koinonia)
  apatheiaSerenityIndex: number;           // 아파테이아 평정심 지수 (Apatheia)
  // 세부 분석
  activeMeditationsTheme: MeditationsTheme;
  focalMeditationsAphorism: MeditationsAphorism;
  aureliusComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const MEDITATIONS_THEMES: MeditationsTheme[] = [
  {
    themeKey: 'inner_citadel',
    themeTitleGreek: 'Ἔσωθεν Ἀκρόπολις (Esothen Akropolis - 내면의 성채)',
    themeTitleKo: '외부 자극과 평판에 굴복하지 않는 불굴의 영혼 성채',
    stoicInsight: '세상은 시끄럽고 사람들은 배은망덕할지라도, 당신의 내면 지도 중추(Hegemonikon)를 허락 없이 침범할 수 있는 것은 아무것도 없습니다.',
    practicalCounsel: '주변의 비난이나 예측 불가능한 돌발 상황에 흔들리지 마십시오. 호흡을 가다듬고 당신만의 내면 성채로 물러나 이성적 중심을 확고히 지키십시오.',
  },
  {
    themeKey: 'universal_logos',
    themeTitleGreek: 'Κοινὸς Λόγος (Koinos Logos - 보편적 로고스와의 조화)',
    themeTitleKo: '우주의 필연적 흐름을 기꺼이 받아들이는 깊은 수용성',
    stoicInsight: '우주 전체의 섭리 안에서 모든 사건은 필연의 고리로 얽혀 있습니다. 일어난 일에 분노하는 것은 우주 질서에 대항하는 어리석은 반항일 뿐입니다.',
    practicalCounsel: '이미 벌어진 일이나 바꿀 수 없는 현실에 저항하며 에너지를 낭비하지 마십시오. 그것을 담담히 인정하고 그 조건 위에서 최선의 응답을 설계하십시오.',
  },
  {
    themeKey: 'memento_mori',
    themeTitleGreek: 'Μέμνησο ὅτι θνητὸς εἶ (Memneso hoti thnetos ei - 죽음을 기억함)',
    themeTitleKo: '유한함을 자각하여 군더더기를 털어내고 본질에 집중함',
    stoicInsight: '언제든 삶을 떠날 수 있다는 자각이야말로 사소한 시비, 허영심, 인정 욕구를 단칼에 소멸시키고 영혼을 가장 고귀하게 만드는 불꽃입니다.',
    practicalCounsel: '오늘이 마지막 날인 것처럼 행동하십시오. 가치 없는 말다툼과 끝없는 미루기를 멈추고, 지금 이 순간 오직 참되고 선한 본질에 전념하십시오.',
  },
  {
    themeKey: 'cosmopolitan_duty',
    themeTitleGreek: 'Κοινωνία καὶ Καθῆκον (Koinonia kai Kathekon - 세계시민의 의무)',
    themeTitleKo: '꿀벌이 군집을 위해 꿀을 모으듯 공동선을 묵묵히 행함',
    stoicInsight: '인간은 서로를 돕기 위해 태어났습니다. 보답이나 칭찬을 바라지 않고, 눈에 보이지 않는 자리에서도 공동체의 번영을 위해 내 몫을 묵묵히 다해야 합니다.',
    practicalCounsel: '생색내지 않고 조용히 타인에게 유익을 베푸십시오. 당신의 정직한 일과 헌신 자체가 스스로에게 가장 완전한 보상이자 영혼의 영광입니다.',
  },
  {
    themeKey: 'apatheia_peace',
    themeTitleGreek: 'Ἀπάθεια καὶ Γαλήνη (Apatheia kai Galene - 절대적 평정심)',
    themeTitleKo: '통제 불가능한 것에 대한 집착을 비워낸 맑고 고요한 평온',
    stoicInsight: '우리를 괴롭히는 것은 사물이나 사건 그 자체가 아니라, 그것에 대해 우리가 덧붙인 주관적 판단과 편견입니다. 판단을 거두면 고통도 사라집니다.',
    practicalCounsel: '어떤 불행이나 결핍의 소식을 들어도 즉각적인 파국적 해석을 덧붙이지 마십시오. "단지 그런 일이 일어났을 뿐이다"라며 객관적 사실만을 응시하십시오.',
  },
];

export const MEDITATIONS_APHORISMS: MeditationsAphorism[] = [
  {
    aphorismKey: 'soul_color',
    aphorismKo: '당신의 영혼은 당신이 품고 있는 생각의 색깔로 물든다.',
    aphorismGreekOrLatin: 'Οἵοις ἂν πολλάκις φαντασθῇς, τοιαύτη σοι ἔσται ἡ διάνοια (명상록 5권 16절)',
    sourceContext: '《명상록》 제5권',
    actionGuidance: '부정적 상상과 원망의 독소를 내면에 머물게 하지 말고, 고결하고 명료한 진리의 생각으로 마음의 정원을 채우십시오.',
  },
  {
    aphorismKey: 'present_moment',
    aphorismKo: '오직 현재만이 우리가 소유할 수 있는 유일한 시간이며, 잃어버릴 수 있는 유일한 것이다.',
    aphorismGreekOrLatin: 'Τὸ παρὸν μόνον ἀποβάλλειν δύναται (명상록 2권 14절)',
    sourceContext: '《명상록》 제2권',
    actionGuidance: '과거의 후회나 미래의 막연한 공포에 사로잡히지 마십시오. 당신의 통제 하에 있는 오직 유일한 순간인 오늘 지금에 집중하십시오.',
  },
  {
    aphorismKey: 'impediment_action',
    aphorismKo: '행동의 장애물은 행동을 진전시키고, 길을 가로막는 것이 곧 길이 된다.',
    aphorismGreekOrLatin: 'Τὸ τῆς ἐνεργείας κώλυμα προχωρεῖ εἰς ἐνέργειαν (명상록 5권 20절)',
    sourceContext: '《명상록》 제5권',
    actionGuidance: '부딪힌 난관을 비관하지 마십시오. 그 장애물이야말로 인내, 창의성, 용기를 훈련시켜 당신을 한 단계 도약시키는 최고의 기회입니다.',
  },
  {
    aphorismKey: 'no_complaint',
    aphorismKo: '불평하지 말라. 궁정 안에서도, 자기 자신에게도 그 어떤 신음도 토해내지 말라.',
    aphorismGreekOrLatin: 'Μηκέτι περὶ τοῦ βασιλικοῦ βίου μεμψιμοιρεῖν (명상록 8권 9절)',
    sourceContext: '《명상록》 제8권',
    actionGuidance: '환경이나 타인을 탓하는 무익한 신세를 한탄하지 마십시오. 감정을 낭비할 시간에 조용히 상황을 타개할 실천적 조치를 취하십시오.',
  },
  {
    aphorismKey: 'dig_within',
    aphorismKo: '너의 내면을 깊이 파라. 그곳에 선의 샘이 있고, 네가 파기만 하면 언제든 솟아날 것이다.',
    aphorismGreekOrLatin: 'Ἔνδον σκάπτε· ἔνδον ἡ πηγὴ τοῦ ἀγαθοῦ (명상록 7권 59절)',
    sourceContext: '《명상록》 제7권',
    actionGuidance: '외부의 인정이나 보상에 목마르지 마십시오. 당신 내면에 이미 완전하게 갖춰진 지혜와 정직의 샘물을 끌어올려 목을 축이십시오.',
  },
];

export function calculateMarcusAureliusMeditationsCitadel(
  profile: UserProfile
): MarcusAureliusMeditationsCitadelResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `MARCUS-AURELIUS-CITADEL:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const innerCitadelResilienceScore = 73 + (absHash % 26);
  const logosProvidenceAlignmentScore = 71 + ((absHash >> 3) % 28);
  const mementoMoriClarityQuotient = 70 + ((absHash >> 6) % 29);
  const koinoniaCosmopolitanDutyScore = 72 + ((absHash >> 9) % 27);
  const apatheiaSerenityIndex = 69 + ((absHash >> 12) % 30);

  const themeIndex = (absHash >> 4) % MEDITATIONS_THEMES.length;
  const aphorismIndex = (absHash >> 7) % MEDITATIONS_APHORISMS.length;

  const activeMeditationsTheme = MEDITATIONS_THEMES[themeIndex];
  const focalMeditationsAphorism = MEDITATIONS_APHORISMS[aphorismIndex];

  const guidanceTitle = `마르쿠스 아우렐리우스 명상록 스토아 지혜: ${activeMeditationsTheme.themeTitleKo}`;
  const philosophicalCounsel = `아우렐리우스 황제의 스토아 철학은 외부의 격랑 속에서도 결코 흔들리지 않는 내면의 성채를 굳건히 세우도록 이끕니다. ` +
    `현재 당신이 마주한 실존적 과제는 '${activeMeditationsTheme.themeTitleKo}'입니다. ` +
    `${activeMeditationsTheme.practicalCounsel} 아울러 《명상록》의 경구 "${focalMeditationsAphorism.aphorismKo}"(${focalMeditationsAphorism.aphorismGreekOrLatin})을 깊이 새기며, ` +
    `${focalMeditationsAphorism.actionGuidance}`;

  return {
    engineVersion: ROMAN_MARCUS_AURELIUS_VERSION,
    calculatedAtKst: new Date().toISOString(),
    innerCitadelResilienceScore,
    logosProvidenceAlignmentScore,
    mementoMoriClarityQuotient,
    koinoniaCosmopolitanDutyScore,
    apatheiaSerenityIndex,
    activeMeditationsTheme,
    focalMeditationsAphorism,
    aureliusComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatMarcusAureliusMeditationsCitadelPrompt(res: MarcusAureliusMeditationsCitadelResult): string {
  return [
    `【마르쿠스 아우렐리우스 《명상록》 내면의 성채 & 스토아 실존 평정 지표】`,
    `- 내면의 성채 회복탄력성(Hegemonikon): ${res.innerCitadelResilienceScore}/100`,
    `- 로고스 섭리 순응도(Providentia): ${res.logosProvidenceAlignmentScore}/100`,
    `- 메멘토 모리 명찰도(Memento Mori): ${res.mementoMoriClarityQuotient}/100`,
    `- 코이노니아 공동체 의무도(Koinonia): ${res.koinoniaCosmopolitanDutyScore}/100`,
    `- 아파테이아 평정심 지수(Apatheia): ${res.apatheiaSerenityIndex}/100`,
    `- 핵심 스토아 테마: ${res.activeMeditationsTheme.themeTitleKo} [${res.activeMeditationsTheme.themeTitleGreek}]`,
    `- 철학적 통찰: ${res.activeMeditationsTheme.stoicInsight}`,
    `- 실천적 조언: ${res.activeMeditationsTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalMeditationsAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalMeditationsAphorism.aphorismGreekOrLatin}" [${res.focalMeditationsAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalMeditationsAphorism.actionGuidance}`,
    `- 종합 철학 권면: ${res.aureliusComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
