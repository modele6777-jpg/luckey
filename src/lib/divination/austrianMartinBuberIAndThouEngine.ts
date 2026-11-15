/**
 * 오스트리아/유대 마틴 부버(Martin Buber) 《나와 너(Ich und Du)》 인격적 만남 & 진정한 대화(Dialogue)·상호 실존 지혜 엔진
 *
 * 20세기 실존철학과 대화 철학의 거장 마틴 부버(Martin Buber, 1878~1965)의 위대한 고전
 * 《나와 너(Ich und Du)》, 《대화론(Zwiesprache)》, 《인간의 문제(Das Problem des Menschen)》 원전 기반:
 * 1. 나와 너 인격적 공명도(I-Thou Relational Resonance Score): 상대를 지배나 조작의 수단으로 대하지 않고, 온 인격을 바쳐 마주하는 상호 주체적 존엄 지수.
 * 2. 진정한 대화 및 현존성 지표(Authentic Dialogue Presence Index): 독백과 기만, 타산적 계산을 벗어나 상대의 고유한 존재 앞에 온전히 열려 있는 실존적 현존도.
 * 3. 나-그것 도구주의 극복도(Overcoming Instrumentalization Score): 사물화, 기능주의, 타인을 편리한 도구로만 소비하는 소외의 굴레를 털어내는 해방 척도.
 * 4. 사이의 영역 거룩한 성찰도(Between-Sphere Meaning Index): 의미와 진리는 고립된 개인 안에 갇혀 있는 것이 아니라, 사람과 사람 사이(Das Zwischen)에서 탄생한다는 관계성.
 * 5. 영원한 너 교감 신뢰도(Eternal Thou Communion Trust Score): 삶의 모든 참된 만남의 지평 너머에 깃든 영원한 존재와의 궁극적 일체감과 영적 평정심.
 *
 * @version LUCKEY-MARTIN-BUBER-DIALOGUE-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_MARTIN_BUBER_VERSION = 'LUCKEY-MARTIN-BUBER-DIALOGUE-v2.0.0';

export type BuberQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface BuberSituationalAudit {
  questionTopic: BuberQuestionTopic;
  focusAxisKo: string;
  encounterPosture: string;
  classicalCitation: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
}

export interface BuberTemporalRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  dailyWatchword: string;
}

export interface BuberTheme {
  themeKey: string;
  themeTitleDe: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface BuberAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismDe: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AustrianMartinBuberIAndThouResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 마틴 부버 대화철학 영적 지표 (0~100)
  iThouRelationalResonanceScore: number;     // 나와 너 인격적 공명도 (I-Thou Relational Resonance)
  authenticDialoguePresenceIndex: number;    // 진정한 대화 및 현존성 (Authentic Dialogue & Presence)
  overcomingInstrumentalizationScore: number;// 나-그것 도구주의 극복도 (Overcoming Instrumentalization)
  betweenSphereMeaningIndex: number;         // 사이의 영역 거룩한 성찰도 (Between-Sphere Meaning)
  eternalThouCommunionTrustScore: number;    // 영원한 너 교감 신뢰도 (Eternal Thou Communion Trust)
  // 세부 분석
  activeBuberTheme: BuberTheme;
  focalBuberAphorism: BuberAphorism;
  questionTopic: BuberQuestionTopic;
  situationalBuberAudit: BuberSituationalAudit;
  temporalBuberRhythm: BuberTemporalRhythm;
  buberSynthesisMatrix?: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  buberComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const BUBER_THEMES: BuberTheme[] = [
  {
    themeKey: 'iAndThouMeeting',
    themeTitleDe: 'Alles wirkliche Leben ist Begegnung',
    themeTitleKo: '모든 참된 삶은 온 인격적 만남이다',
    existentialInsight: '인간은 다른 사람을 대상이나 정보로 분석하는 고립된 관찰자가 아니라, 나와 너의 온전한 마주침 속에서만 참된 자기 자신이 됩니다.',
    practicalCounsel: '주변의 사람들을 능력이나 기능으로 평가하지 말고, 있는 그대로의 고유한 인격으로 마주하십시오. 온 마음으로 상대를 인정할 때 만남이 시작됩니다.',
  },
  {
    themeKey: 'authenticDialogue',
    themeTitleDe: 'Die echte Zwiesprache & Das Hinhören',
    themeTitleKo: '참된 대화와 가슴 깊은 경청의 예술',
    existentialInsight: '자기주장만을 앞세우는 가짜 대화나 독백을 멈추고, 상대의 침묵과 표정 속에 담긴 영혼의 목소리에 겸허하게 귀 기울일 때 벽이 허물어집니다.',
    practicalCounsel: '미리 대답을 준비하며 듣지 말고, 상대의 말이 끝날 때까지 온전한 주의를 집중하십시오. 당신의 열린 경청이 상대의 마음을 치유합니다.',
  },
  {
    themeKey: 'dasZwischenSphere',
    themeTitleDe: 'Das Reich des Zwischen & Schöpferische Beziehung',
    themeTitleKo: '나와 너 사이의 영역과 창조적 관계의 신비',
    existentialInsight: '사랑과 지혜는 나 혼자의 소유물이 아닙니다. 두 존재가 진솔하게 교감하는 바로 그 사이(Das Zwischen)에서 성스러운 의미가 창조됩니다.',
    practicalCounsel: '내 이익이나 상대의 반응에만 집착하지 말고, 우리 사이에 흐르는 신뢰와 온기의 공간을 정성스럽게 가꾸십시오.',
  },
  {
    themeKey: 'turningToTheThou',
    themeTitleDe: 'Die Umkehr zum Du & Befreiung vom Es',
    themeTitleKo: '도구주의(그것)를 넘어 인격주의(너)로의 회심',
    existentialInsight: '우리는 매일 효율과 유용성이라는 그것(Es)의 세계에 갇히기 쉽습니다. 그러나 가장 결정적인 순간에는 도구적 셈법을 내려놓고 인격의 품으로 회향해야 합니다.',
    practicalCounsel: '인간관계를 거래나 투자처럼 계산하고 있다면 즉시 멈추십시오. 조건 없이 신뢰를 건넬 때 진정한 유대감이 회복됩니다.',
  },
  {
    themeKey: 'theEternalThou',
    themeTitleDe: 'Das ewige Du & Die Linien der Beziehung',
    themeTitleKo: '모든 만남 속에 비치는 영원한 너의 빛',
    existentialInsight: '우리가 이 세상에서 경험하는 모든 정직하고 아름다운 만남의 연장선은 궁극적으로 만유의 근원인 영원한 너(신성)를 향해 뻗어 있습니다.',
    practicalCounsel: '작은 만남 하나, 일상의 대화 한 조각도 결코 사소하지 않습니다. 만남 속에 깃든 신성한 빛을 공경하는 마음으로 하루를 살아가십시오.',
  },
];

export const BUBER_APHORISMS: BuberAphorism[] = [
  {
    aphorismKey: 'realLifeMeeting',
    aphorismKo: '모든 참된 삶은 만남이다.',
    aphorismDe: 'Alles wirkliche Leben ist Begegnung.',
    sourceContext: '《나와 너(Ich und Du)》 제1부',
    actionGuidance: '혼자만의 생각과 고립된 방어막에서 걸어 나와, 오늘 당신 곁에 다가오는 사람과 온 마음으로 눈을 맞추고 진실하게 교류하십시오.',
  },
  {
    aphorismKey: 'manBecomesIThroughThou',
    aphorismKo: '인간은 너를 마주함으로써 비로소 참된 나(자아)가 된다.',
    aphorismDe: 'Der Mensch wird am Du zum Ich.',
    sourceContext: '《나와 너(Ich und Du)》 제1부',
    actionGuidance: '자기 자신만을 골몰히 응시하는 에고의 굴레에서 벗어나십시오. 타인을 깊이 이해하고 환대할 때 당신의 참된 정체성이 빛을 발합니다.',
  },
  {
    aphorismKey: 'wholeBeingWord',
    aphorismKo: '근본어 나-너는 오직 온 존재를 다 바쳐서만 말해질 수 있다.',
    aphorismDe: 'Das Grundwort Ich-Du kann nur mit dem ganzen Wesen gesprochen werden.',
    sourceContext: '《나와 너(Ich und Du)》 제1부',
    actionGuidance: '어설픈 요령이나 계산된 연기를 버리고, 매 순간 당신의 온 인격과 진정성을 다해 일과 사람 앞에 임하십시오.',
  },
  {
    aphorismKey: 'noObjectThou',
    aphorismKo: '너를 말하는 자는 그 어떤 사물도 대상으로 삼지 않는다. 너는 경계가 없으며, 나와 전인격으로 관계 맺는다.',
    aphorismDe: 'Wer Du spricht, hat kein Etwas zum Gegenstand. Denn wo Etwas ist, ist anderes Etwas; das Du grenzt an nichts.',
    sourceContext: '《나와 너(Ich und Du)》 제1부',
    actionGuidance: '타인을 규정하고 꼬리표 붙이려는 편견을 내려놓으십시오. 상대방의 무한한 가능성과 내면의 깊이를 경외하는 마음으로 대하십시오.',
  },
  {
    aphorismKey: 'turningToTheOther',
    aphorismKo: '대화적 삶의 본질은 서로가 서로에게 온전히 자신을 열어 보이고 상대의 고유성을 응답하는 데 있다.',
    aphorismDe: 'Das Wesen des dialogischen Lebens ist das Zuwenden zum andern.',
    sourceContext: '《대화론(Zwiesprache)》',
    actionGuidance: '마음의 문을 걸어 잠그지 마십시오. 당신의 취약함까지 솔직하게 드러낼 때 상대방도 진실한 화답으로 응답해 올 것입니다.',
  },
  {
    aphorismKey: 'eternalThouNeverIt',
    aphorismKo: '영원한 너는 본질적으로 그것이 될 수 없다. 언제나 마주해야 할 영원한 사랑과 신뢰의 근원이다.',
    aphorismDe: 'Das ewige Du kann wesensmäßig nicht zum Es werden.',
    sourceContext: '《나와 너(Ich und Du)》 제3부',
    actionGuidance: '삶의 시련이나 막막함 속에서도 세상이 무의미한 사물들의 집합이 아님을 기억하십시오. 당신을 부르고 계신 영원한 섭리를 신뢰하십시오.',
  },
];

function classifyBuberQuestionTopic(query: string): BuberQuestionTopic {
  const q = query.trim();
  if (/(연애|사랑|관계|사람|가족|친구|대화|소통|동료|갈등|화해|만남)/.test(q)) return 'relationship';
  if (/(결정|선택|협업|제안|계약|이직|진로|방향|결단|함께|역할)/.test(q)) return 'decision';
  if (/(외로움|단절|상처|소외|불안|지침|피로|회복|위로|마음)/.test(q)) return 'healing';
  return 'reflection';
}

function buildBuberSituationalAudit(topic: BuberQuestionTopic): BuberSituationalAudit {
  const boundaryNotice = '마틴 부버 《나와 너》 관점은 관계의 태도와 대화적 현존을 비추는 상징적·성찰적 기준이며, 구체적인 대인 갈등의 법적·심리치료적 진단을 대신하지 않습니다.';
  if (topic === 'relationship') {
    return {
      questionTopic: topic,
      focusAxisKo: '상대를 그것(Es)으로 규정하지 않고 온전한 너(Du)로 마주하는 만남',
      encounterPosture: '상대의 과거 이력이나 내 판단의 틀로 재단하지 않고, 지금 눈앞의 살아 있는 인격 앞에 온전히 현존하는 자세.',
      classicalCitation: '《나와 너(Ich und Du)》: "모든 참된 삶은 만남이다. 인간은 너를 마주함으로써 비로소 참된 나가 된다."',
      practiceGuidance: '대답을 미리 머릿속에 준비한 채 듣지 말고, 상대의 말 뒤에 담긴 두려움과 바람까지 끝까지 경청해 주십시오.',
      ritualAction: '오늘 가까운 사람 한 명에게 용건이나 평가가 아닌, 온전한 안부와 고마움을 담은 짧은 진심을 먼저 건네십시오.',
      reflectionFocus: '지금 이 관계에서 나는 상대를 내 뜻대로 움직여야 할 대상(그것)으로 보고 있습니까, 함께 숨 쉬는 인격(너)으로 대하고 있습니까?',
      counselNote: '진심은 설명보다 경청에서 먼저 통합니다.',
      boundaryNotice,
    };
  }
  if (topic === 'decision') {
    return {
      questionTopic: topic,
      focusAxisKo: '이해득실의 셈법을 넘어 신뢰의 사이(Das Zwischen)를 여는 선택',
      encounterPosture: '단기적 효율이나 도구적 계산에만 매몰되지 않고, 함께하는 사람들과의 신뢰 공간을 지키는 결단.',
      classicalCitation: '《대화론(Zwiesprache)》: "대화적 삶의 본질은 서로가 서로에게 온전히 자신을 열어 보이고 응답하는 데 있다."',
      practiceGuidance: '조건과 이익을 따지기에 앞서, 이 선택이 나와 타인 사이의 신뢰를 살리는 방향인지 아니면 도구화하는 방향인지 먼저 살피십시오.',
      ritualAction: '결정을 내리기 전, 관련된 상대의 입장에서 가장 중요할 한 가지 배려를 선택 조건에 명시적으로 포함하십시오.',
      reflectionFocus: '이번 선택이 당장의 편의는 주더라도 내가 아끼는 관계와 신의를 훼손하지는 않습니까?',
      counselNote: '신뢰가 살아 있는 선택은 시간이 지날수록 더 단단한 토대가 됩니다.',
      boundaryNotice,
    };
  }
  if (topic === 'healing') {
    return {
      questionTopic: topic,
      focusAxisKo: '고립된 에고의 방어막을 걷고 따뜻한 연결감을 회복하는 치유',
      encounterPosture: '스스로를 닫고 세상과 단절되기보다, 안전한 대화의 공간을 통해 마음의 숨통을 다시 여는 태도.',
      classicalCitation: '《나와 너》 제3부: "영원한 너는 결코 사물(그것)이 될 수 없다. 언제나 우리를 부르는 신뢰의 근원이다."',
      practiceGuidance: '혼자 모든 짐을 짊어지려 애쓰기보다, 판단 없이 내 이야기를 들어줄 한 사람이나 자연의 고요 앞에 마음을 열어 두십시오.',
      ritualAction: '오늘 마음이 무거울 때 억지로 밝은 척하지 말고, 신뢰하는 이에게 "요즘 조금 지쳐서 이야기가 필요하다"고 솔직히 알리십시오.',
      reflectionFocus: '상처받지 않으려고 세워 둔 방어벽이 오히려 나를 더 깊은 고립으로 밀어 넣고 있지는 않습니까?',
      counselNote: '진실한 만남 한 번이 혼자 견디는 열 밤보다 큰 회복을 가져옵니다.',
      boundaryNotice,
    };
  }
  return {
    questionTopic: topic,
    focusAxisKo: '일상의 사소한 스침 속에서도 영원한 너(Du)의 빛을 알아보는 성찰',
    encounterPosture: '기능과 효율에 쫓기는 일상을 잠시 멈추고, 나와 세계 사이의 살아 있는 관계망을 음미하는 관조.',
    classicalCitation: '《나와 너》 제1부: "근본어 나-너는 오직 온 존재를 다 바쳐서만 말해질 수 있다."',
    practiceGuidance: '오늘 마주하는 일과 사람 하나하나를 스쳐 지나가는 배경으로 여기지 말고, 온 마음을 기울여 응답하는 연습을 하십시오.',
    ritualAction: '오늘 하루 중 만나는 사람 한 명의 눈을 2초 이상 마주 보며 진심 어린 인사를 건네고 그 여운을 느껴 보십시오.',
    reflectionFocus: '바쁜 일상 속에서 내가 무심코 기능적으로만 대하며 지나친 소중한 인연은 누구입니까?',
    counselNote: '관계의 품격은 특별한 사건이 아니라 오늘 건네는 온전한 시선에서 자랍니다.',
    boundaryNotice,
  };
}

function buildBuberTemporalRhythm(now: Date): BuberTemporalRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 만남기(마음의 문을 여는 봄)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 공명기(사이의 공간이 깊어지는 여름)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 경청기(성숙한 대화가 무르익는 가을)'
        : '동계 온기기(고독을 녹이는 환대의 겨울)';

  if (kstHour >= 5 && kstHour < 11) {
    return {
      kstHour,
      timeWindowKo: '아침 · 첫 인사의 문(Morning Greeting)',
      seasonKo,
      dailyWatchword: '오늘 처음 만나는 사람에게 계산 없는 따뜻한 시선과 진심 어린 인사를 건네며 하루를 여십시오.',
    };
  }
  if (kstHour >= 11 && kstHour < 17) {
    return {
      kstHour,
      timeWindowKo: '한낮 · 사이의 광장(Sphere of Between)',
      seasonKo,
      dailyWatchword: '업무와 역할의 분주함 속에서도 상대를 도구가 아닌 온전한 인격으로 대하는 균형을 지키십시오.',
    };
  }
  if (kstHour >= 17 && kstHour < 22) {
    return {
      kstHour,
      timeWindowKo: '저녁 · 깊은 대화의 식탁(Evening Dialogue)',
      seasonKo,
      dailyWatchword: '판단과 조언을 서두르기보다 상대의 하루를 끝까지 들어주는 고요한 경청의 자리를 마련하십시오.',
    };
  }
  return {
    kstHour,
    timeWindowKo: '심야 · 영원한 너와의 침묵(Night Communion)',
    seasonKo,
    dailyWatchword: '세상의 소음이 잦아든 밤, 내 안의 독백을 멈추고 삶을 지탱해 준 인연들에게 감사의 마음을 모으십시오.',
  };
}

export function calculateAustrianMartinBuberIAndThou(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): AustrianMartinBuberIAndThouResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const kstDayKey = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seedString = `MARTIN-BUBER-ICH-UND-DU:${name}:${birthDate}:${birthTime}:${gender}:${kstDayKey}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const iThouRelationalResonanceScore = 77 + (absHash % 22);
  const authenticDialoguePresenceIndex = 75 + ((absHash >> 3) % 24);
  const overcomingInstrumentalizationScore = 76 + ((absHash >> 6) % 23);
  const betweenSphereMeaningIndex = 78 + ((absHash >> 9) % 21);
  const eternalThouCommunionTrustScore = 80 + ((absHash >> 12) % 19);

  const themeIndex = (absHash >> 4) % BUBER_THEMES.length;
  const aphorismIndex = (absHash >> 7) % BUBER_APHORISMS.length;

  const activeBuberTheme = BUBER_THEMES[themeIndex];
  const focalBuberAphorism = BUBER_APHORISMS[aphorismIndex];
  const questionTopic = classifyBuberQuestionTopic(query ?? '');
  const situationalBuberAudit = buildBuberSituationalAudit(questionTopic);
  const temporalBuberRhythm = buildBuberTemporalRhythm(now);

  const guidanceTitle = `마틴 부버 나와 너 대화철학 지혜: ${activeBuberTheme.themeTitleKo}`;
  const philosophicalCounsel = `대화 철학의 거장 마틴 부버의 《나와 너》는 인간을 고립된 기능적 도구(Es)로 격하시키지 않고, 온 인격을 바쳐 상대를 목적으로 대우하는 거룩한 만남(Du)으로 이끕니다. ` +
    `현재 질문의 핵심('${situationalBuberAudit.focusAxisKo}')과 '${activeBuberTheme.themeTitleKo}'의 원리가 공명합니다. ` +
    `${situationalBuberAudit.practiceGuidance} 부버의 원전 명언 "${focalBuberAphorism.aphorismKo}"(${focalBuberAphorism.aphorismDe})를 마음에 새기며, ` +
    `${temporalBuberRhythm.dailyWatchword}`;

  return {
    engineVersion: AUSTRIAN_MARTIN_BUBER_VERSION,
    calculatedAtKst: `${kstDayKey} ${String(new Date(now.getTime() + 9 * 60 * 60 * 1000).getUTCHours()).padStart(2, '0')}:${String(new Date(now.getTime() + 9 * 60 * 60 * 1000).getUTCMinutes()).padStart(2, '0')} KST`,
    iThouRelationalResonanceScore,
    authenticDialoguePresenceIndex,
    overcomingInstrumentalizationScore,
    betweenSphereMeaningIndex,
    eternalThouCommunionTrustScore,
    activeBuberTheme,
    focalBuberAphorism,
    questionTopic,
    situationalBuberAudit,
    temporalBuberRhythm,
    buberSynthesisMatrix: {
      coreInsight: activeBuberTheme.themeTitleKo,
      recommendedAction: situationalBuberAudit.practiceGuidance,
      cautionNotice: '상대를 내 목적을 위한 편리한 도구(Es)로 환원하지 않도록 경청의 여백을 지키십시오.',
    },
    buberComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAustrianMartinBuberIAndThouPrompt(
  res: AustrianMartinBuberIAndThouResult,
): string {
  return [
    `【마틴 부버 《나와 너》 인격적 만남 & 진정한 대화(Dialogue) 실존 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락 초점(${res.questionTopic}): ${res.situationalBuberAudit.focusAxisKo}`,
    `- 만남의 태도: ${res.situationalBuberAudit.encounterPosture}`,
    `- KST 시공간 리듬: ${res.temporalBuberRhythm.timeWindowKo} · ${res.temporalBuberRhythm.seasonKo}`,
    `- 핵심 대화 테마: ${res.activeBuberTheme.themeTitleKo} [${res.activeBuberTheme.themeTitleDe}]`,
    `- 실존적 통찰: ${res.activeBuberTheme.existentialInsight}`,
    `- 질문 맞춤 조언: ${res.situationalBuberAudit.practiceGuidance}`,
    `- 일상 의례 제안: ${res.situationalBuberAudit.ritualAction}`,
    `- 성찰 질문: ${res.situationalBuberAudit.reflectionFocus}`,
    `- 교차 매트릭스: 핵심(${res.buberSynthesisMatrix?.coreInsight ?? res.activeBuberTheme.themeTitleKo}) | 실행(${res.buberSynthesisMatrix?.recommendedAction ?? res.situationalBuberAudit.practiceGuidance}) | 주의(${res.buberSynthesisMatrix?.cautionNotice ?? '도구화 경계'})`,
    `- 조언 요약: ${res.situationalBuberAudit.counselNote}`,
    `- 부버 원전 명언: "${res.focalBuberAphorism.aphorismKo}" [${res.focalBuberAphorism.aphorismDe}]`,
    `- 원전 출처: [${res.focalBuberAphorism.sourceContext}]`,
    `- 시간대 권고: ${res.temporalBuberRhythm.dailyWatchword}`,
    `- 종합 부버 대화 권면: ${res.buberComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.situationalBuberAudit.boundaryNotice}`,
  ].join('\n');
}
