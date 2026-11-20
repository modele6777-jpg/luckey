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
 * @version LUCKEY-MARCUS-AURELIUS-CITADEL-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const ROMAN_MARCUS_AURELIUS_VERSION = 'LUCKEY-MARCUS-AURELIUS-CITADEL-v2.4.0';

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
  situationalCitadelFocus: {
    detectedTheme: string;
    classicReference: string;
    judgmentDistortionDiagnostic: string;
    citadelDirective: string;
    reflectiveQuestion: string;
  };
  temporalAureliusRhythm: {
    kstPhaseLabel: string;
    seasonContext: string;
    citadelStageKo: string;
    recommendedPractice: string;
  };
  dailyPracticeRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  marcusSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
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

function getAureliusKstComponents(now: Date): { hour: number; month: number; isoKst: string } {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  const y = kstDate.getUTCFullYear();
  const m = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kstDate.getUTCDate()).padStart(2, '0');
  const hh = String(kstDate.getUTCHours()).padStart(2, '0');
  const mm = String(kstDate.getUTCMinutes()).padStart(2, '0');
  return {
    hour: kstDate.getUTCHours(),
    month: kstDate.getUTCMonth() + 1,
    isoKst: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
  };
}

function describeAureliusStage(score: number): string {
  if (score >= 90) return '굳건히 수호된 내면 성채의 흐름';
  if (score >= 80) return '흔들림 없이 맑은 아파테이아의 흐름';
  if (score >= 70) return '로고스 질서에 순응하며 가다듬는 흐름';
  return '판단의 덧칠을 걷어내고 중심을 세우는 흐름';
}

function analyzeAureliusSituationalFocus(question: string | undefined, absHash: number) {
  const q = (question ?? '').trim();
  if (/관계|사람|비난|서운|배신|미움|갈등|상처/.test(q)) {
    return {
      detectedTheme: '내면의 성채(Hegemonikon)와 코이노니아 자비',
      classicReference: '마르쿠스 아우렐리우스 《명상록》 2권 1절 · 8권 48절',
      judgmentDistortionDiagnostic: '타인의 무례함이나 변덕에 나의 내적 평화까지 함께 내어주며 헛된 분노의 해석을 덧붙이고 있을 수 있습니다.',
      citadelDirective: '타인의 행동을 내 영혼의 성채 안으로 들이지 말고, "저 사람도 나름의 착오 속에 있다"며 사실과 감정을 분리하십시오.',
      reflectiveQuestion: '지금 나를 흔드는 것은 상대의 말 자체입니까, 아니면 내가 거기에 덧붙인 상처의 해석입니까?',
    };
  }
  if (/선택|결정|이직|포기|장애|막막|실패|고민/.test(q)) {
    return {
      detectedTheme: '장애물이 곧 길이 되는 전환(Obstacle Is the Way)',
      classicReference: '마르쿠스 아우렐리우스 《명상록》 5권 20절',
      judgmentDistortionDiagnostic: '예상치 못한 제약이나 우회로를 실패로 단정해 버리면, 그 조건 안에서 발휘할 수 있는 이성적 창의성이 닫힙니다.',
      citadelDirective: '바꿀 수 없는 조건에 불평하는 대신, 지금 눈앞의 장애물을 인내와 재구성의 재료로 삼아 한 걸음 전진하십시오.',
      reflectiveQuestion: '지금 앞을 가로막는 이 조건을 재료로 삼는다면, 어떤 새로운 길이 열릴 수 있습니까?',
    };
  }
  if (/불안|두려|걱정|죽음|시간|허무|외로|우울/.test(q)) {
    return {
      detectedTheme: '메멘토 모리(Memento Mori)와 현재 순간의 명찰함',
      classicReference: '마르쿠스 아우렐리우스 《명상록》 2권 14절 · 4권 3절',
      judgmentDistortionDiagnostic: '지나간 후회와 오지 않은 미래를 한꺼번에 짊어지려 해 현재의 성채가 과부하에 걸린 상태입니다.',
      citadelDirective: '어제도 내일도 아닌 오직 지금 이 한 순간의 호흡과 의무에만 집중하며 사소한 근심을 덜어내십시오.',
      reflectiveQuestion: '오늘이 삶을 가다듬을 마지막 날처럼 선명해진다면, 지금 가장 먼저 내려놓을 걱정은 무엇입니까?',
    };
  }

  return absHash % 2 === 0
    ? {
        detectedTheme: '내면 성채(Inner Citadel)로의 고요한 귀환',
        classicReference: '마르쿠스 아우렐리우스 《명상록》 4권 3절 · 7권 59절',
        judgmentDistortionDiagnostic: '바깥의 소음과 평판을 살피느라 내면의 선의 샘(헤게모니콘)을 돌보는 시간이 줄어들기 쉬운 때입니다.',
        citadelDirective: '잠시 외부의 시선을 닫고 내면의 성채로 물러나, 내가 통제할 수 있는 판단과 태도만 단정히 정돈하십시오.',
        reflectiveQuestion: '지금 외부의 소음이 모두 잦아든다면 내면의 성채에서 가장 먼저 들리는 목소리는 무엇입니까?',
      }
    : {
        detectedTheme: '보편적 로고스(Logos)와의 조화 및 의무 완수',
        classicReference: '마르쿠스 아우렐리우스 《명상록》 6권 54절 · 8권 9절',
        judgmentDistortionDiagnostic: '상황이 내 뜻대로만 흘러가지 않을 때 불평이 앞서는 순간 내면의 기품과 추진력이 흩어집니다.',
        citadelDirective: '벌어진 현실을 있는 그대로 받아들이고, 공동체와 나 자신에게 부끄럽지 않은 오늘의 몫을 조용히 실행하십시오.',
        reflectiveQuestion: '지금 내가 불평 없이 묵묵히 완수할 수 있는 오늘의 작은 의무는 무엇입니까?',
      };
}

function buildAureliusTemporalRhythm(hour: number, month: number, citadelScore: number) {
  let kstPhaseLabel = '';
  let recommendedPractice = '';
  if (hour >= 4 && hour < 9) {
    kstPhaseLabel = '새벽 성채 수련기 (04~09시)';
    recommendedPractice = '마르쿠스가 아침마다 되뇌었듯, 오늘 마주칠 무례함이나 변수에도 중심을 잃지 않겠다고 내면 성채를 먼저 다지는 시간입니다.';
  } else if (hour >= 9 && hour < 14) {
    kstPhaseLabel = '오전 코이노니아 실행기 (09~14시)';
    recommendedPractice = '꿀벌이 군집을 위해 일하듯, 생색이나 조바심 없이 나에게 맡겨진 본분을 성실히 수행하기 좋은 시간대입니다.';
  } else if (hour >= 14 && hour < 20) {
    kstPhaseLabel = '오후 아파테이아 조율기 (14~20시)';
    recommendedPractice = '사건 위에 감정적 해석을 덧씌우지 말고 "단지 그런 일이 일어났을 뿐"이라며 객관적 시선으로 평정을 지키십시오.';
  } else {
    kstPhaseLabel = '밤 메멘토 모리 자성기 (20~04시)';
    recommendedPractice = '하루의 판단과 감정을 내면 법정에 올려놓고, 통제할 수 없는 것들에 대한 집착을 비우는 고요한 시간입니다.';
  }

  let seasonContext = '겨울(Winter · 성채 내실과 인내의 시기)';
  if (month >= 3 && month <= 5) seasonContext = '봄(Spring · 로고스 질서 순응과 갱신기)';
  else if (month >= 6 && month <= 8) seasonContext = '여름(Summer · 흔들림 없는 실행과 절제기)';
  else if (month >= 9 && month <= 11) seasonContext = '가을(Autumn · 판단 정제와 평정의 수확기)';

  return {
    kstPhaseLabel,
    seasonContext,
    citadelStageKo: describeAureliusStage(citadelScore),
    recommendedPractice,
  };
}

export function calculateMarcusAureliusMeditationsCitadel(
  profile: UserProfile,
  question?: string,
  now: Date = new Date()
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
  const { hour, month, isoKst } = getAureliusKstComponents(now);
  const situationalCitadelFocus = analyzeAureliusSituationalFocus(question, absHash);
  const temporalAureliusRhythm = buildAureliusTemporalRhythm(hour, month, innerCitadelResilienceScore);

  const guidanceTitle = `마르쿠스 아우렐리우스 명상록 스토아 지혜: ${activeMeditationsTheme.themeTitleKo}`;
  const philosophicalCounsel = `아우렐리우스의 《명상록》은 질문('${situationalCitadelFocus.detectedTheme}') 앞에서 외부의 격랑 속에서도 무너지지 않는 내면의 성채를 세우도록 이끕니다. ` +
    `${situationalCitadelFocus.citadelDirective} 또한 '${activeMeditationsTheme.themeTitleKo}'의 관점에서 ${activeMeditationsTheme.practicalCounsel} ` +
    `《명상록》의 경구 "${focalMeditationsAphorism.aphorismKo}"(${focalMeditationsAphorism.aphorismGreekOrLatin})을 마음에 새기며 ${focalMeditationsAphorism.actionGuidance}`;

  const trimmedQ = (question ?? '').trim();
  const marcusSynthesisMatrix = {
    dominantTension: `${situationalCitadelFocus.detectedTheme} ↔ ${activeMeditationsTheme.themeTitleKo}`,
    alignmentState: `${temporalAureliusRhythm.kstPhaseLabel} · ${temporalAureliusRhythm.citadelStageKo}`,
    integratedAction: `${situationalCitadelFocus.citadelDirective}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: ROMAN_MARCUS_AURELIUS_VERSION,
    calculatedAtKst: isoKst,
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
    situationalCitadelFocus,
    temporalAureliusRhythm,
    dailyPracticeRitual: `${temporalAureliusRhythm.recommendedPractice} · ${situationalCitadelFocus.citadelDirective}`,
    ritualAction: `[${activeMeditationsTheme.themeKey}] ${situationalCitadelFocus.citadelDirective}`,
    reflectionFocus: `마르쿠스 아우렐리우스 명상록(${situationalCitadelFocus.detectedTheme}) — ${focalMeditationsAphorism.sourceContext}`,
    reflectiveQuestion: situationalCitadelFocus.reflectiveQuestion,
    interpretiveBoundary: '마르쿠스 아우렐리우스 명상록 성찰은 미래의 길흉을 점치는 도구가 아니라, 통제할 수 있는 내면의 판단과 평정(아파테이아)을 지키기 위한 스토아 철학 관점입니다.',
    marcusSynthesisMatrix,
  };
}

export function formatMarcusAureliusMeditationsCitadelPrompt(res: MarcusAureliusMeditationsCitadelResult): string {
  const matrixLine = res.marcusSynthesisMatrix
    ? `- 마르쿠스 교차 매트릭스: 핵심 긴장(${res.marcusSynthesisMatrix.dominantTension}) · 조율 상태(${res.marcusSynthesisMatrix.alignmentState}) · 통합 실천(${res.marcusSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【마르쿠스 아우렐리우스 《명상록》 내면의 성채 & 스토아 실존 평정 지표 (${res.engineVersion})】`,
    `- 내면의 성채(Hegemonikon): ${describeAureliusStage(res.innerCitadelResilienceScore)} | 로고스 섭리 순응: ${describeAureliusStage(res.logosProvidenceAlignmentScore)} | 메멘토 모리: ${describeAureliusStage(res.mementoMoriClarityQuotient)}`,
    `- 코이노니아 공동체 의무: ${describeAureliusStage(res.koinoniaCosmopolitanDutyScore)} | 아파테이아 평정심: ${describeAureliusStage(res.apatheiaSerenityIndex)}`,
    `- 핵심 스토아 테마: ${res.activeMeditationsTheme.themeTitleKo} [${res.activeMeditationsTheme.themeTitleGreek}]`,
    `- 질문 맥락 진단(${res.situationalCitadelFocus.classicReference}): ${res.situationalCitadelFocus.detectedTheme} — ${res.situationalCitadelFocus.judgmentDistortionDiagnostic}`,
    `- KST 시공간 리듬 (${res.calculatedAtKst}): ${res.temporalAureliusRhythm.kstPhaseLabel} · ${res.temporalAureliusRhythm.seasonContext} (${res.temporalAureliusRhythm.citadelStageKo})`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: "${res.reflectiveQuestion}"`,
    `- 핵심 경구: "${res.focalMeditationsAphorism.aphorismKo}" [${res.focalMeditationsAphorism.sourceContext}]`,
    `- 종합 철학 권면: ${res.aureliusComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
