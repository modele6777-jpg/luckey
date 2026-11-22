/**
 * 프랑스 가스통 바슐라르(Gaston Bachelard) 《공간의 시학(La poétique de l'espace)》 & 《촛불의 미학(La flamme d'une chandelle)》 몽상의 시학 & 내면의 집·촛불의 고독 지혜 엔진
 *
 * 프랑스의 독보적인 과학철학자이자 문학상상력의 거장 가스통 바슐라르(Gaston Bachelard, 1884~1962)의 대표작
 * 《공간의 시학(La poétique de l'espace, 1957)》, 《촛불의 미학(La flamme d'une chandelle, 1961)》,
 * 《물과 꿈(L'Eau et les Rêves, 1942)》, 《공기와 꿈(L'Air et les Songes, 1943)》, 《몽상의 시학(1960)》 원전 기반:
 * 1. 물질적 상상력 및 몽상의 역동성 지표(Material Imagination & Creative Reverie): 표면적 이미지를 넘어 사물의 깊은 물질성에 공명하는 창조력.
 * 2. 내면의 집 구축 및 원초적 영혼 안식도(Poetics of House & Soul Sanctuary): 세상의 비바람으로부터 영혼의 꿈을 지키는 내면 은신처의 평온도.
 * 3. 촛불 앞 순수 고독 및 내면 명상 통찰력(Solitary Candle Meditation & Intimate Light): 잡음을 지우고 오롯이 홀로 깨어 사유를 밝히는 깊은 집중력.
 * 4. 지성적 엄밀성과 시적 상상력의 이중 나선 조화도(Dual Spiral of Reason & Poetics): 낮의 냉철한 분석과 밤의 따스한 감성을 조화롭게 넘나드는 유연성.
 * 5. 우주적 친밀감 및 사물 교감 회복탄력성(Cosmic Intimacy & Poetic Resilience): 작은 사물 하나에서도 거대한 우주를 발견하고 마음을 치유하는 감수성.
 *
 * @version LUCKEY-GASTON-BACHELARD-POETICS-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_GASTON_BACHELARD_POETICS_VERSION = 'LUCKEY-GASTON-BACHELARD-POETICS-v2.3.0';

export type BachelardQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface BachelardTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  poeticsTone: string;
  rhythmDirective: string;
}

export interface BachelardTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface BachelardAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchGastonBachelardPoeticsOfSpaceResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 가스통 바슐라르 공간의 시학 지표 (0~100)
  materialImaginationVitalityIndex: number;     // 물질적 상상력 및 몽상의 역동성 지표 (Material Imagination & Reverie)
  poeticsOfHouseSanctuaryScore: number;         // 내면의 집 구축 및 원초적 영혼 안식도 (Poetics of House & Soul Sanctuary)
  solitaryCandleMeditationIndex: number;        // 촛불 앞 순수 고독 및 내면 명상 통찰력 (Solitary Candle Meditation & Intimacy)
  dualSpiralReasonPoeticsScore: number;         // 이성과 시적 상상력의 이중 나선 조화도 (Dual Spiral of Reason & Poetics)
  cosmicIntimacyReverieResilience: number;      // 우주적 친밀감 및 사물 교감 회복탄력성 (Cosmic Intimacy & Poetic Resilience)
  // 세부 분석
  questionTopic: BachelardQuestionTopic;
  reveriePhase: string;
  shadowWarning: string;
  temporalBachelardRhythm: BachelardTemporalRhythm;
  activeBachelardTheme: BachelardTheme;
  companionBachelardTheme: BachelardTheme;
  focalBachelardAphorism: BachelardAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  bachelardSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  bachelardComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

const BACHELARD_REVERIE_PHASES = [
  '은신처 정돈(바깥의 소음을 잠시 닫고 영혼이 숨 쉴 작은 공간을 가꾸는 시기)',
  '촛불 몽상(홀로 깨어 있는 고요 속에서 물질의 숨결과 새로운 영감을 길어 올리는 시기)',
  '이중 나선(밤의 시적 직관과 낮의 명철한 이성을 조화롭게 엮어 현실로 옮기는 시기)',
] as const;

const BACHELARD_SHADOW_WARNINGS = [
  '고독한 몽상과 내면의 은신처에 머물다 지금 세상 밖으로 내디뎌야 할 작은 실행을 미루지 않도록 살피세요.',
  '시적 이미지와 감수성에 몰두하느라 현실의 구체적인 일정과 사실 확인을 건너뛰지 않도록 점검하세요.',
  '낮의 엄밀한 분석과 효율만 앞세우다 영혼이 쉬어갈 다락방의 여백까지 닫아 두지 않도록 유의하세요.',
] as const;

export const BACHELARD_THEMES: BachelardTheme[] = [
  {
    themeKey: 'houseAsSoulCradle',
    themeTitleEn: 'The House as a Cradle of the Soul',
    themeTitleKo: '영혼의 요람으로서의 집 — 다락방의 사색과 지하실의 평온',
    pragmaticInsight: '집은 단순한 물리적 건물이 아닙니다. 세상의 폭풍우 속에서도 우리의 몽상과 가장 순수한 기억을 포근하게 품어 안아주는 영혼의 첫 번째 우주이자 성소입니다.',
    practicalCounsel: '복잡한 세상의 소음에 지쳤다면 당신만의 고요한 내적 은신처로 돌아오십시오. 방 한구석, 좋아하는 의자 위에서 마음의 짐을 풀고 온전한 안식을 누리십시오.',
  },
  {
    themeKey: 'reverieOfFlame',
    themeTitleEn: 'The Reverie of the Solitary Flame',
    themeTitleKo: '촛불의 고독한 몽상 — 어둠을 밀어내는 순수한 빛의 응시',
    pragmaticInsight: '촛불은 조용히 타오르며 홀로 꿈꾸는 자의 고독을 고결한 창조로 승화시킵니다. 타오르는 불꽃의 수직적 상승은 산만한 잡념을 태우고 의식을 맑고 순수하게 벼려냅니다.',
    practicalCounsel: '외로움을 두려워하지 마십시오. 고독은 상처가 아니라 영혼이 홀로 빛을 밝히는 성스러운 시간입니다. 은은한 빛 앞에서 조용히 호흡하며 당신의 깊은 내면과 마주하십시오.',
  },
  {
    themeKey: 'fourElementsImagination',
    themeTitleEn: 'Material Imagination of the Four Elements',
    themeTitleKo: '원소적 상상력의 힘 — 대지·물·불·바람의 깊은 약동',
    pragmaticInsight: '진정한 창조성은 눈에 보이는 형상을 흉내 내는 데서 나오지 않습니다. 물의 유연함, 불의 열정, 대지의 단단함, 바람의 비상처럼 사물의 깊은 물질성에 몸을 맡길 때 솟아납니다.',
    practicalCounsel: '겉모습이나 기교에 머물지 말고 문제의 가장 본질적인 뿌리를 만지십시오. 자연의 원초적 원소처럼 생생하고 순수한 에너지로 당신의 프로젝트를 다시 약동하게 하십시오.',
  },
  {
    themeKey: 'miniatureAndImmensity',
    themeTitleEn: 'Miniature and Intimate Immensity',
    themeTitleKo: '서랍 속의 광대무변 — 작은 공간에 깃든 거대한 우주',
    pragmaticInsight: '장대한 우주는 거대한 외부 풍경에만 있는 것이 아닙니다. 작은 서랍 속, 책 한 권의 갈피, 작은 찻잔 하나에도 무한한 시적 공간과 무한한 깊이가 깃들어 있습니다.',
    practicalCounsel: '거창한 목표에 압도당하지 마십시오. 지금 손닿는 작은 사물, 작은 일상의 조각을 깊은 애정으로 바라보십시오. 그 작은 정성 속에 이미 온 우주가 깃들어 있습니다.',
  },
  {
    themeKey: 'dualSpiralOfMind',
    themeTitleEn: 'The Dual Spiral of Reason and Poetry',
    themeTitleKo: '이성과 시의 이중 나선 — 엄밀한 분석과 따스한 감수성의 조화',
    pragmaticInsight: '바슐라르는 낮에는 과학철학자로 엄밀한 개념을 짓고, 밤에는 시적 몽상가로 불꽃을 응시했습니다. 명철한 이성과 따뜻한 상상력이 양 날개로 함께 날아오를 때 인간은 온전해집니다.',
    practicalCounsel: '논리와 분석에만 매달려 마음을 메마르게 하지 마십시오. 낮의 치열한 일과를 마친 뒤에는 예술과 시, 음악의 따스한 품에 영혼을 맡겨 균형과 회복을 선물하십시오.',
  },
];

export const BACHELARD_APHORISMS: BachelardAphorism[] = [
  {
    aphorismKey: 'houseSheltersDaydreaming',
    aphorismKo: '집은 몽상을 보호하고, 몽상가를 보호하며, 우리로 하여금 평화롭게 꿈꾸게 해준다.',
    aphorismEn: 'The house shelters daydreaming, the house protects the dreamer, the house allows one to dream in peace.',
    sourceContext: "《공간의 시학(La poétique de l'espace)》 제1장",
    actionGuidance: '당신의 공간을 영혼이 안전하게 쉴 수 있는 평화로운 안식처로 정돈하고 가꾸십시오.',
  },
  {
    aphorismKey: 'candleIsSolitary',
    aphorismKo: '촛불은 고독하다. 촛불은 오직 홀로 꿈꾸는 자의 등불이다.',
    aphorismEn: 'The flame is a valiant and fragile light... A candle does not illuminate a cell, it illuminates a solitude.',
    sourceContext: "《촛불의 미학(La flamme d'une chandelle)》",
    actionGuidance: '홀로 있는 고독의 시간을 소중히 여기며, 그 속에서 맑고 투명한 영감의 불씨를 지피십시오.',
  },
  {
    aphorismKey: 'imaginationNotImage',
    aphorismKo: '상상력은 이미지를 형성하는 능력이 아니라, 현실의 이미지를 변형하고 초월하는 역동적인 힘이다.',
    aphorismEn: 'Imagination is not, as its etymology suggests, the faculty of forming images of reality; it is the faculty of forming images which go beyond reality.',
    sourceContext: "《공기와 꿈(L'Air et les Songes)》",
    actionGuidance: '눈앞에 주어진 한계에 갇히지 말고, 사물을 전혀 새로운 시선으로 바라보는 상상력의 날개를 펼치십시오.',
  },
  {
    aphorismKey: 'closetHoldsUniverse',
    aphorismKo: '서랍, 궤짝, 옷장 속에는 영혼의 은밀한 우주와 시간의 비밀이 고요히 숨 쉬고 있다.',
    aphorismEn: 'A drawer, a chest, a wardrobe: in these intimate spaces there lies a center of order and a center of dreams.',
    sourceContext: "《공간의 시학(La poétique de l'espace)》 제3장",
    actionGuidance: '소박한 일상과 손때 묻은 물건들 속에서 잊고 있던 소중한 추억과 의미를 재발견하십시오.',
  },
  {
    aphorismKey: 'poeticsOfRest',
    aphorismKo: '진정한 안식이란 아무것도 하지 않는 나태가 아니라, 영혼이 사물의 시적 숨결과 하나 되는 평온이다.',
    aphorismEn: 'To be at peace with the world, one must find the quiet center where the heart listens to the gentle murmurs of being.',
    sourceContext: '《몽상의 시학(La poétique de la rêverie)》',
    actionGuidance: '조급함을 내려놓고 깊은 침묵 속에서 세상의 아름다운 조화에 가만히 귀를 기울이십시오.',
  },
];

function classifyBachelardQuestionTopic(query?: string): BachelardQuestionTopic {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return 'reflection';
  if (/(사랑|연애|관계|배우자|친구|가족|동료|갈등|화해|인연|사람|대화|소통)/.test(q)) return 'relationship';
  if (/(선택|결정|이직|창업|투자|계약|진로|시험|합격|도전|시작|포기|방향)/.test(q)) return 'decision';
  if (/(불안|우울|지침|피곤|회복|치유|휴식|스트레스|상처|위로|두려움|혼란)/.test(q)) return 'healing';
  return 'reflection';
}

function buildBachelardTemporalRhythm(now?: Date): BachelardTemporalRhythm {
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstDateLabel = kst.toISOString().slice(0, 10);
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 12) {
    return {
      kstDateLabel,
      timeWindowKo: '오전 낮의 이성과 맑은 구조의 시간 (05:00~12:00 KST)',
      poeticsTone: '낮의 명철한 사유',
      rhythmDirective: '이성의 이중 나선 중 명철한 분석과 공간 정돈으로 하루의 뼈대를 세우는 시간입니다.',
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      kstDateLabel,
      timeWindowKo: '오후 물질적 상상력과 생동의 시간 (12:00~17:00 KST)',
      poeticsTone: '원소적 창조 활력',
      rhythmDirective: '사물의 표면이 아닌 본질적 결을 만지며 막힌 과제를 유연하게 돌파하는 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstDateLabel,
      timeWindowKo: '저녁 내면의 집과 회귀의 시간 (17:00~22:00 KST)',
      poeticsTone: '영혼의 요람 안식',
      rhythmDirective: '외부의 분주함을 접고 나만의 친밀한 공간에서 마음의 온기를 되찾는 시간입니다.',
    };
  }
  return {
    kstDateLabel,
    timeWindowKo: '심야 촛불의 고독과 몽상의 시간 (22:00~05:00 KST)',
    poeticsTone: '촛불 앞 순수 몽상',
    rhythmDirective: '고독을 외로움이 아닌 창조적 빛의 시간으로 바꾸어 깊은 영감을 마주하는 시간입니다.',
  };
}

function buildBachelardTopicGuidance(topic: BachelardQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '상대를 고정된 이미지로 단정 짓기보다, 함께 호흡하는 공간과 여백을 부드럽게 열어 두십시오.',
      ritualAction: '가까운 사람과의 대화 전 조급한 결론을 내리지 않고 차 한 잔의 여유를 두고 경청하기',
      reflectionFocus: '우리 관계에서 서로가 숨 쉴 수 있는 다락방 같은 여백은 어디에 있는가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '숫자와 효율의 계산만으로 답이 안 보일 때는, 낮의 이성과 밤의 시적 직관을 나란히 놓고 저울질하십시오.',
      ritualAction: '선택지의 장단점을 논리로 정리한 뒤, 내 마음이 가장 편안히 머무는 장면 하나를 떠올려 보기',
      reflectionFocus: '이 선택을 한 뒤 내가 머물게 될 내면의 집은 어떤 온도와 빛을 띠고 있는가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '거창한 치유를 찾기보다 지금 머무는 작은 방, 작은 사물 하나를 정성스레 정돈하며 영혼의 안식처를 회복하십시오.',
      ritualAction: '오늘 10분간 조명을 낮추고 책상 한 켠이나 소중한 물건 하나를 조용히 정리하기',
      reflectionFocus: '세상의 소음이 잦아든 자리에서 내 영혼이 가장 안전하다고 느끼는 작은 구석은 어디인가?',
    };
  }
  return {
    practiceGuidance: '익숙한 일상과 서랍 속 사물들에서 새로운 시적 이미지를 길어 올려 사유의 지평을 넓히십시오.',
    ritualAction: '오늘 마주친 작은 풍경이나 사물 하나를 30초간 가만히 바라보며 떠오른 감각 적기',
    reflectionFocus: '나는 지금 사물의 겉모습만 보고 있는가, 그 안에 깃든 깊은 숨결을 느끼고 있는가?',
  };
}

export function calculateFrenchGastonBachelardPoeticsOfSpace(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): FrenchGastonBachelardPoeticsOfSpaceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalBachelardRhythm = buildBachelardTemporalRhythm(now);
  const questionTopic = classifyBachelardQuestionTopic(query);
  const topicGuidance = buildBachelardTopicGuidance(questionTopic);

  const seedString = `GASTON-BACHELARD-POETICS:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalBachelardRhythm.kstDateLabel}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const materialImaginationVitalityIndex = 82 + (absHash % 17);
  const poeticsOfHouseSanctuaryScore = 80 + ((absHash >> 3) % 19);
  const solitaryCandleMeditationIndex = 81 + ((absHash >> 6) % 18);
  const dualSpiralReasonPoeticsScore = 79 + ((absHash >> 9) % 20);
  const cosmicIntimacyReverieResilience = 83 + ((absHash >> 12) % 16);

  const themeIndex = (absHash >> 5) % BACHELARD_THEMES.length;
  const companionOffset = 1 + ((absHash >> 6) % (BACHELARD_THEMES.length - 1));
  const aphorismIndex = (absHash >> 8) % BACHELARD_APHORISMS.length;

  const activeBachelardTheme = BACHELARD_THEMES[themeIndex];
  const companionBachelardTheme = BACHELARD_THEMES[(themeIndex + companionOffset) % BACHELARD_THEMES.length];
  const focalBachelardAphorism = BACHELARD_APHORISMS[aphorismIndex];
  const reveriePhase = BACHELARD_REVERIE_PHASES[(absHash >> 11) % BACHELARD_REVERIE_PHASES.length];
  const shadowWarning = BACHELARD_SHADOW_WARNINGS[(absHash >> 14) % BACHELARD_SHADOW_WARNINGS.length];

  const guidanceTitle = `가스통 바슐라르 공간의 시학 지혜: ${activeBachelardTheme.themeTitleKo}`;
  const philosophicalCounsel = `프랑스의 위대한 과학철학자이자 상상력의 현상학자 가스통 바슐라르는 영혼을 품어주는 내면의 집, 촛불 앞 순수한 고독의 사색, 그리고 이성과 시의 아름다운 이중 나선을 일깨웁니다. ` +
    `현재 당신의 지친 마음과 창조적 영감에 생기를 불어넣는 핵심 통찰은 '${activeBachelardTheme.themeTitleKo}'(동반 테마: ${companionBachelardTheme.themeTitleKo})입니다. ` +
    `${activeBachelardTheme.practicalCounsel} ${topicGuidance.practiceGuidance} 아울러 바슐라르의 명언 "${focalBachelardAphorism.aphorismKo}"를 마음에 품고, ` +
    `${focalBachelardAphorism.actionGuidance}`;

  const boundaryNotice = '가스통 바슐라르 공간의 시학 해석은 내면의 안식과 시적 상상력 회복을 돕는 상징·성찰 관점이며, 임상적 진단이나 확정 예언이 아닙니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${temporalBachelardRhythm.kstDateLabel}T${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')}:00+09:00 (KST)`;
  const qText = (query ?? '').trim();
  const reflectiveQuestion = qText
    ? `‘${qText}’의 소음에서 '${reveriePhase}' 국면으로 한 걸음 물러나 내 영혼이 촛불처럼 고요히 쉴 수 있는 작은 공간은 어디입니까?`
    : `'${reveriePhase}' 국면에서 ${topicGuidance.reflectionFocus}`;
  const bachelardSynthesisMatrix = {
    coreInsight: `${activeBachelardTheme.themeTitleKo} (동반: ${companionBachelardTheme.themeTitleKo})`,
    recommendedAction: `${topicGuidance.practiceGuidance} (${reveriePhase})`,
    cautionNotice: shadowWarning,
  };

  return {
    engineVersion: FRENCH_GASTON_BACHELARD_POETICS_VERSION,
    calculatedAtKst: kstTimeLabel,
    materialImaginationVitalityIndex,
    poeticsOfHouseSanctuaryScore,
    solitaryCandleMeditationIndex,
    dualSpiralReasonPoeticsScore,
    cosmicIntimacyReverieResilience,
    questionTopic,
    reveriePhase,
    shadowWarning,
    temporalBachelardRhythm,
    activeBachelardTheme,
    companionBachelardTheme,
    focalBachelardAphorism,
    practiceGuidance: `${topicGuidance.practiceGuidance} (동반 테마: ${companionBachelardTheme.themeTitleKo})`,
    ritualAction: `${topicGuidance.ritualAction} (${reveriePhase})`,
    reflectionFocus: reflectiveQuestion,
    reflectiveQuestion,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    bachelardSynthesisMatrix,
    bachelardComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchGastonBachelardPoeticsOfSpacePrompt(
  res: FrenchGastonBachelardPoeticsOfSpaceResult,
): string {
  return [
    `【가스통 바슐라르 《공간의 시학》 & 《촛불의 미학》 몽상의 시학 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- 몽상 국면: ${res.reveriePhase}`,
    `- KST 시공간 리듬: ${res.temporalBachelardRhythm.kstDateLabel} · ${res.temporalBachelardRhythm.timeWindowKo} (${res.temporalBachelardRhythm.poeticsTone}) — ${res.temporalBachelardRhythm.rhythmDirective}`,
    `- 핵심 공간 시학 테마: ${res.activeBachelardTheme.themeTitleKo} [${res.activeBachelardTheme.themeTitleEn}]`,
    `- 동반 공간 시학 테마: ${res.companionBachelardTheme.themeTitleKo}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 현상학적 몽상 통찰: ${res.activeBachelardTheme.pragmaticInsight}`,
    `- 실천적 치유 조언: ${res.activeBachelardTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.bachelardSynthesisMatrix.coreInsight}) | 실행(${res.bachelardSynthesisMatrix.recommendedAction}) | 주의(${res.bachelardSynthesisMatrix.cautionNotice})`,
    `- 바슐라르 원전 명언: "${res.focalBachelardAphorism.aphorismKo}"`,
    `- 불문 원전: "${res.focalBachelardAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalBachelardAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalBachelardAphorism.actionGuidance}`,
    `- 종합 바슐라르 시학 권면: ${res.bachelardComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
