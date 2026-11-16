/**
 * 오스트리아 라이너 마리아 릴케(Rainer Maria Rilke) 《젊은 시인에게 주는 편지》 & 《두이노의 비가》 내면의 고독 사랑·질문 품기·사물 응시와 존재 변용 지혜 엔진
 *
 * 20세기 유럽 최고의 서정시인이자 실존적 사색가 라이너 마리아 릴케(1875~1926)의 원전 기반:
 * 1. 내면의 고독 사랑과 깊은 침잠도 (Loving One's Solitude & Inward Deepening Score): 타인의 인정이나 소음에서 벗어나 자신의 깊은 내면 고독을 사랑하고 성숙의 공간으로 삼는 힘.
 * 2. 가슴속 풀리지 않는 질문을 살아내는 용기 (Living the Unresolved Questions Index): 조급하게 해답을 구걸하지 않고 질문 자체를 품은 채 하루하루를 살아내며 답에 도달하는 지혜.
 * 3. 사물의 내면을 꿰뚫어 보는 지극한 시적 응시 (Deep Contemplative Gazing at Things / Dinggedicht Index): 사물의 겉모습을 넘어 그 존재의 무게와 슬픔, 신비를 온전히 알아채는 통찰력.
 * 4. 시련과 상실을 성스러운 찬가로 빚어내는 비가의 승화력 (Elegiac Sublimation & Sacred Praise Score): 고통과 상실, 죽음의 유한성을 피하지 않고 존재의 아름다운 찬가로 변용(Verwandlung)시키는 힘.
 * 5. 거대한 열림 속에서 스스로를 바치는 초연한 회복탄력성 (Open Horizon & Surrender Resilience Index): 우주적 열림(Das Offene) 앞에서 두려움 없이 자신을 내어맡기는 의연한 평정심.
 *
 * @version LUCKEY-RILKE-LETTERS-TO-YOUNG-POET-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_RAINER_MARIA_RILKE_LETTERS_VERSION = 'LUCKEY-RILKE-LETTERS-TO-YOUNG-POET-v2.1.0';

export type RilkeQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface RilkeSituationalAudit {
  questionTopic: RilkeQuestionTopic;
  focusAxisKo: string;
  poeticPosture: string;
  classicalCitation: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
}

export interface RilkeTemporalRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  dailyWatchword: string;
}

export interface RilkeTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface RilkeAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AustrianRainerMariaRilkeLettersResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 릴케 핵심 지표 (0~100)
  lovingSolitudeInwardScore: number;                    // 고독 사랑과 깊은 침잠도 (Loving Solitude & Inward Deepening)
  livingTheQuestionsIndex: number;                      // 질문 자체를 살아내는 지혜 (Living the Unresolved Questions)
  contemplativeGazingIndex: number;                     // 사물에 대한 지극한 시적 응시 (Contemplative Gazing / Dinggedicht)
  elegiacSublimationScore: number;                      // 시련과 상실의 비가적 승화력 (Elegiac Sublimation & Sacred Praise)
  openHorizonResilienceScore: number;                   // 거대한 열림 속 초연한 회복탄력성 (Open Horizon & Surrender Resilience)
  // 세부 분석
  activeRilkeTheme: RilkeTheme;
  focalRilkeAphorism: RilkeAphorism;
  questionTopic: RilkeQuestionTopic;
  situationalRilkeAudit: RilkeSituationalAudit;
  temporalRilkeRhythm: RilkeTemporalRhythm;
  interpretiveBoundary: string;
  rilkeSynthesisMatrix?: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  rilkeComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const RILKE_THEMES: RilkeTheme[] = [
  {
    themeKey: 'liveTheQuestions',
    themeTitleEn: 'Live the Questions Now: Patient Maturation without Rushing for Answers',
    themeTitleKo: '가슴속 질문을 살아가기 — 조급하게 답을 구하지 않고 의문 자체를 온몸으로 품어내기',
    literaryInsight: '릴케는 카푸스에게 보낸 편지에서 말합니다. 마음속 풀리지 않는 질문들을 방처럼, 봉인된 책처럼 사랑하라고. 지금 당장 살 수 없는 답을 얻으려 애태우지 말고, 질문 자체를 살아갈 때 언젠가 알아채지도 못하는 사이에 답 속에 살고 있을 것입니다.',
    practicalCounsel: '불확실성과 불안에 쫓겨 설익은 결론이나 타협을 서두르지 마십시오. "내가 왜 이 길을 가는가", "무엇이 진정한 가치인가"라는 질문을 소중한 보물처럼 가슴에 품고, 오늘 내게 주어진 삶의 과업을 묵묵히 살아내십시오.',
  },
  {
    themeKey: 'loveYourSolitude',
    themeTitleEn: 'Love Your Solitude: Deep Inner Anchor in the Vast Silence',
    themeTitleKo: '너의 고독을 사랑하라 — 소음과 번잡함을 털어내고 광활한 침묵 속 영혼의 중심 찾기',
    literaryInsight: '고독은 결핍이나 소외가 아닙니다. 릴케에게 고독은 한 인간이 자기 존재의 뿌리와 마주하고 위대한 성장을 잉태하는 가장 거룩하고 너른 침묵의 대지입니다.',
    practicalCounsel: '주변의 평가와 인정에 영혼의 에너지를 낭비하지 마십시오. 당신의 고독을 다정하게 끌어안고, 그 고요한 내면의 깊은 방에서 당신의 진정한 목소리를 조용히 길어 올리십시오.',
  },
  {
    themeKey: 'thingsAndBeauty',
    themeTitleEn: 'Contemplation of Things: Finding the Sacred in Humble and Vulnerable Existence',
    themeTitleKo: '사물에 대한 지극한 응시 — 하찮고 연약한 존재 속에서 찬란한 성스러움을 발견하기',
    literaryInsight: '로댕의 조각과 파리의 거리에서 릴케는 사물(Dinge)의 침묵을 배웠습니다. 판단과 선입견을 내려놓고 대상을 오래도록 순수하게 바라볼 때, 사물은 스스로 존재의 거룩한 신비를 열어 보입니다.',
    practicalCounsel: '일상의 사소한 풍경과 마주하는 사람을 건성으로 대하지 마십시오. 눈앞의 일과 대상을 편견 없는 맑은 눈으로 깊이 응시할 때, 뜻밖의 영감과 깊은 내면의 치유가 솟아납니다.',
  },
  {
    themeKey: 'transformationAndPraise',
    themeTitleEn: 'Transformation and Elegiac Praise: Turning Grief into Radiant Song',
    themeTitleKo: '비가와 변용 — 슬픔과 시련을 회피하지 않고 눈부신 존재의 찬가로 승화시키기',
    literaryInsight: '《두이노의 비가》에서 릴케는 상실과 고통이야말로 인간 존재를 가장 숭고한 차원으로 이끄는 변용(Verwandlung)의 불꽃임을 노래합니다. 슬픔은 버려야 할 오점이 아니라 가슴에 묻고 노래해야 할 대지의 열매입니다.',
    practicalCounsel: '겪고 있는 아픔과 결핍을 억지로 부정하거나 자책하지 마십시오. 고통을 거름 삼아 내면의 품격을 더욱 깊고 너그럽게 빚어낼 때, 상처는 가장 단단한 영혼의 보석이 됩니다.',
  },
];

export const RILKE_APHORISMS: RilkeAphorism[] = [
  {
    aphorismKey: 'liveQuestionsQuote',
    aphorismKo: '당신의 가슴속 풀리지 않는 모든 의문에 대해 인내를 가지십시오. 질문 그 자체를 닫힌 방처럼, 봉인된 책처럼 사랑하십시오. 지금은 질문을 살아가십시오. 그러면 먼 어느 날, 스스로 깨닫지 못하는 사이에 해답 속에 살아가고 있을 것입니다.',
    aphorismGerman: 'Man muss Geduld haben mit dem Ungelösten im Herzen und versuchen, die Fragen selbst lieb zu haben wie verschlossene Stuben und wie Bücher, die in einer sehr fremden Sprache geschrieben sind. Leben Sie jetzt die Fragen. Vielleicht leben Sie dann allmählich, ohne es zu merken, eines fernen Tages in die Antwort hinein.',
    sourceContext: '《젊은 시인에게 주는 편지(Briefe an einen jungen Dichter)》 제4신 (1903년 7월 16일 보르프스베데)',
    actionGuidance: '조급함을 버리고 현재의 불확실한 질문을 정직하게 호흡하십시오. 성급한 해답보다 깊은 질문을 견디는 인내가 진정한 성숙을 선물합니다.',
  },
  {
    aphorismKey: 'solitudeVastQuote',
    aphorismKo: '당신의 고독을 사랑하십시오. 그리고 고독이 당신에게 안겨주는 비탄을 아름다운 울림의 노래로 빚어내십시오. 당신에게 가까이 있는 사람들이 멀게 느껴진다면, 그것은 당신 주위의 공간이 이미 넓어지기 시작했다는 증거입니다.',
    aphorismGerman: 'Lieben Sie Ihre Einsamkeit und tragen Sie mit holdem Schmerz den Schmerz, den sie Ihnen verursacht. Denn die Ihnen nah sind, sind fern, und das zeigt, dass es anfängt, weit um Sie zu werden.',
    sourceContext: '《젊은 시인에게 주는 편지》 제4신',
    actionGuidance: '외로움을 두려워하거나 메우려 하지 말고, 홀로 선 시간 속에서 자기 자신과 가장 깊은 우정을 맺으십시오.',
  },
  {
    aphorismKey: 'beautyAndTerrorQuote',
    aphorismKo: '그 어떤 아름다움도, 그 어떤 두려움도 당신에게 일어나도록 두십시오. 그저 나아가십시오. 그 어떤 감정도 마지막 종착지가 아닙니다.',
    aphorismGerman: 'Lass dir Alles geschehn: Schönheit und Schrecken. Man muss nur gehn: Kein Gefühl ist das fernste.',
    sourceContext: '《시도시집(Das Stunden-Buch)》',
    actionGuidance: '기쁨도 두려움도 거부하지 말고 오롯이 통과하십시오. 모든 감정과 사건은 영혼을 완성해 가는 여정의 한 정거장일 뿐입니다.',
  },
  {
    aphorismKey: 'earthPraiseQuote',
    aphorismKo: '대지여, 이것이 진정 그대가 원한 것이 아니던가? 보이지 않게 우리 안에서 다시 태어나는 것? 그대의 꿈이 언젠가 보이지 않게 되는 것이 아니던가? 대지여, 보이지 않는 자여! 변용이란 그대의 다급한 부름이 아니고 무엇이겠는가!',
    aphorismGerman: 'Erde, ist es nicht dies, was du willst: unsichtbar in uns erstehn? Ist es dein Traum nicht, einmal unsichtbar zu sein? Erde! unsichtbar! Was, wenn Verwandlung nicht, ist dein drängender Auftrag?',
    sourceContext: '《두이노의 비가(Duineser Elegien)》 제9비가',
    actionGuidance: '눈앞의 유한하고 깨지기 쉬운 삶의 순간들을 가슴속에 고이 품어 보이지 않는 영원의 지혜로 변용시키십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function classifyRilkeQuestionTopic(query: string): RilkeQuestionTopic {
  const q = query.trim();
  if (/(연애|사랑|관계|사람|가족|친구|이별|거리|외로움|함께|그리움)/.test(q)) return 'relationship';
  if (/(결정|선택|진로|이직|시험|창작|도전|방향|기다림|답|확신)/.test(q)) return 'decision';
  if (/(슬픔|상실|아픔|우울|불안|지침|눈물|고통|치유|회복|위로)/.test(q)) return 'healing';
  return 'reflection';
}

function buildRilkeSituationalAudit(topic: RilkeQuestionTopic): RilkeSituationalAudit {
  const boundaryNotice = '릴케의 고독 사랑과 질문 품기 관점은 내면의 성숙과 존재 변용을 돕는 문학적·상징적 기준이며, 현실적 결정을 대신 내리지 않습니다.';
  if (topic === 'relationship') {
    return {
      questionTopic: topic,
      focusAxisKo: '서로의 고독을 지켜 주며 깊어지는 성숙한 사랑의 거리',
      poeticPosture: '상대를 소유하거나 내 불안을 메우는 수단으로 삼지 않고, 두 고독이 서로를 보호하고 인사하는 아름다운 거리를 존중하는 자세.',
      classicalCitation: '《젊은 시인에게 주는 편지》 제7신: "한 인간이 다른 인간을 사랑하는 것은 아마도 우리에게 주어진 가장 어려운 과제다."',
      practiceGuidance: '상대의 침묵이나 빈틈을 조급하게 다그쳐 채우려 하지 말고, 먼저 내 안의 고독한 방을 정돈한 뒤 따뜻한 신뢰를 건네십시오.',
      ritualAction: '오늘 소중한 사람에게 걱정이나 요구 대신, 상대의 하루와 평안을 진심으로 축복하는 짧은 한 줄을 전하십시오.',
      reflectionFocus: '나는 상대를 있는 그대로 바라보며 사랑하고 있습니까, 아니면 내 외로움을 달래 달라고 기대고 있습니까?',
      counselNote: '서로의 고독을 존중할 줄 아는 사람만이 오래가는 깊은 인연을 가꿉니다.',
      boundaryNotice,
    };
  }
  if (topic === 'decision') {
    return {
      questionTopic: topic,
      focusAxisKo: '조급한 해답을 재촉하지 않고 질문 자체를 살아내는 인내',
      poeticPosture: '당장 손에 쥐어지지 않는 확실함을 억지로 꺾어 따기보다, 낯선 언어로 쓰인 책처럼 질문을 품고 성숙해지는 태도.',
      classicalCitation: '《젊은 시인에게 주는 편지》 제4신: "지금은 질문을 살아가십시오. 그러면 머지않아 해답 속에 살아가고 있을 것입니다."',
      practiceGuidance: '불안 때문에 설익은 결론을 내리지 마십시오. 오늘 내게 분명한 작은 과업 하나를 성실히 해내는 사이 길의 윤곽이 드러납니다.',
      ritualAction: '지금 가장 답답한 질문 하나를 노트에 적고, "당장 풀지 않아도 괜찮다, 오늘 내가 할 작은 한 걸음은 ___다"라고 덧붙이십시오.',
      reflectionFocus: '지금 내가 조급히 얻으려는 답은 정말 준비된 것입니까, 아니면 불안을 잠재우기 위한 임시방편입니까?',
      counselNote: '익지 않은 답을 서두르기보다 질문을 품고 걷는 시간이 당신을 더 단단하게 만듭니다.',
      boundaryNotice,
    };
  }
  if (topic === 'healing') {
    return {
      questionTopic: topic,
      focusAxisKo: '슬픔과 상실을 억누르지 않고 존재의 변용으로 건너가는 비가의 힘',
      poeticPosture: '기쁨뿐 아니라 두려움과 슬픔까지 삶의 정당한 손님으로 통과시키며, 아픔을 내면의 깊이로 빚어내는 태도.',
      classicalCitation: '《시도시집》·《두이노의 비가》: "아름다움도 두려움도 모두 그대에게 일어나도록 두라. 어떤 감정도 마지막이 아니다."',
      practiceGuidance: '상처를 억지로 잊으려 애쓰거나 스스로를 탓하지 마십시오. 슬픔이 머물다 지나갈 수 있도록 고요한 호흡의 여백을 허락하십시오.',
      ritualAction: '오늘 하루 15분간 산책하며 하늘, 나무, 빛 같은 일상의 사물 하나를 판단 없이 조용히 바라보며 마음을 가라앉히십시오.',
      reflectionFocus: '지금의 아픔이 내 안의 어떤 다정함과 깊이를 새롭게 눈뜨게 하고 있습니까?',
      counselNote: '어떤 감정도 영원한 종착지가 아니니, 오늘의 파도도 결국 당신을 더 깊은 평온으로 데려갈 것입니다.',
      boundaryNotice,
    };
  }
  return {
    questionTopic: topic,
    focusAxisKo: '세속의 소음을 걷어내고 자기만의 고독한 중심을 사랑하는 침잠',
    poeticPosture: '주변의 인정과 빠른 속도에 휩쓸리지 않고, 넓어지는 내면의 공간을 다정하게 끌어안는 시적 관조.',
    classicalCitation: '《젊은 시인에게 주는 편지》 제4신: "당신의 고독을 사랑하십시오. 주위가 멀게 느껴진다면 당신의 공간이 넓어지기 시작한 증거입니다."',
    practiceGuidance: '바깥에서 해답이나 위안을 찾느라 분주해질수록, 오히려 내면의 고요한 방으로 돌아와 나 자신의 목소리를 먼저 들으십시오.',
    ritualAction: '오늘 밤 잠들기 전, 아무 음악이나 영상도 켜지 않은 채 5분 동안 온전한 침묵 속에서 호흡만 느껴 보십시오.',
    reflectionFocus: '타인의 시선과 평가가 닿지 않는 나만의 고독한 시간 속에서 나는 무엇을 가장 소중히 여기고 있습니까?',
    counselNote: '고독을 두려워하지 않고 가꾸는 사람에게는 어떤 흔들림에도 무너지지 않는 중심이 생깁니다.',
    boundaryNotice,
  };
}

function buildRilkeTemporalRhythm(now: Date): RilkeTemporalRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 발아기(질문이 싹트는 봄)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 열림기(광활한 빛을 마주하는 여름)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 비가기(성숙과 변용의 가을)'
        : '동계 고독기(내면의 방을 지키는 겨울)';

  if (kstHour >= 5 && kstHour < 11) {
    return {
      kstHour,
      timeWindowKo: '아침 · 사물의 첫 빛(First Light on Things)',
      seasonKo,
      dailyWatchword: '서두르기 전에 눈앞의 차 한 잔과 창밖의 빛을 천천히 응시하며 고요한 마음을 먼저 여십시오.',
    };
  }
  if (kstHour >= 11 && kstHour < 17) {
    return {
      kstHour,
      timeWindowKo: '한낮 · 열림의 지평(Das Offene)',
      seasonKo,
      dailyWatchword: '분주한 일과 속에서도 조급한 결론을 내리지 말고, 지금 할 수 있는 일에 차분히 마음을 실으십시오.',
    };
  }
  if (kstHour >= 17 && kstHour < 22) {
    return {
      kstHour,
      timeWindowKo: '황혼 · 두이노의 비가(Elegiac Dusk)',
      seasonKo,
      dailyWatchword: '하루 동안 겪은 크고 작은 감정을 판단 없이 품어 안고, 무거운 마음은 저녁의 고요 속에 내려놓으십시오.',
    };
  }
  return {
    kstHour,
    timeWindowKo: '심야 · 고독의 편지(Nocturne of Solitude)',
    seasonKo,
    dailyWatchword: '깊은 밤의 고독을 외로움이 아닌 영혼이 쉬는 너른 방으로 여기며 스스로에게 다정한 편지를 쓰듯 하루를 마무리하십시오.',
  };
}

export function calculateAustrianRainerMariaRilkeLetters(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): AustrianRainerMariaRilkeLettersResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const kstDayKey = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seedString = `RILKE-LETTERS-TO-YOUNG-POET:${name}:${birthDate}:${birthTime}:${gender}:${kstDayKey}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const lovingSolitudeInwardScore = 90 + ((absHash >> 1) % 9);
  const livingTheQuestionsIndex = 89 + ((absHash >> 4) % 10);
  const contemplativeGazingIndex = 88 + ((absHash >> 7) % 11);
  const elegiacSublimationScore = 87 + ((absHash >> 10) % 12);
  const openHorizonResilienceScore = 90 + ((absHash >> 13) % 9);

  const themeIndex = (absHash >> 5) % RILKE_THEMES.length;
  const aphorismIndex = (absHash >> 8) % RILKE_APHORISMS.length;

  const activeRilkeTheme = RILKE_THEMES[themeIndex];
  const focalRilkeAphorism = RILKE_APHORISMS[aphorismIndex];
  const questionTopic = classifyRilkeQuestionTopic(query ?? '');
  const situationalRilkeAudit = buildRilkeSituationalAudit(questionTopic);
  const temporalRilkeRhythm = buildRilkeTemporalRhythm(now);

  const guidanceTitle = `라이너 마리아 릴케 고독의 사랑과 질문의 변용: ${activeRilkeTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 실존 서정시의 거장 라이너 마리아 릴케 선생은 《젊은 시인에게 주는 편지》와 《두이노의 비가》를 통해 ` +
    `자기만의 고독을 사랑하는 침잠과 질문 자체를 살아내는 숭고한 인내를 일깨웠습니다. ` +
    `지금 질문의 결('${situationalRilkeAudit.focusAxisKo}')과 '${activeRilkeTheme.themeTitleKo}'의 통찰이 맞닿아 있습니다. ` +
    `${situationalRilkeAudit.practiceGuidance} 릴케의 원전 테제 "${focalRilkeAphorism.aphorismKo}"을 마음에 품고, ` +
    `${temporalRilkeRhythm.dailyWatchword}`;

  return {
    engineVersion: AUSTRIAN_RAINER_MARIA_RILKE_LETTERS_VERSION,
    calculatedAtKst: `${kstDayKey} ${String(new Date(now.getTime() + 9 * 60 * 60 * 1000).getUTCHours()).padStart(2, '0')}:${String(new Date(now.getTime() + 9 * 60 * 60 * 1000).getUTCMinutes()).padStart(2, '0')} KST`,
    lovingSolitudeInwardScore,
    livingTheQuestionsIndex,
    contemplativeGazingIndex,
    elegiacSublimationScore,
    openHorizonResilienceScore,
    activeRilkeTheme,
    focalRilkeAphorism,
    questionTopic,
    situationalRilkeAudit,
    temporalRilkeRhythm,
    interpretiveBoundary: situationalRilkeAudit.boundaryNotice,
    rilkeSynthesisMatrix: {
      coreInsight: activeRilkeTheme.themeTitleKo,
      recommendedAction: situationalRilkeAudit.practiceGuidance,
      cautionNotice: '아직 익지 않은 해답을 조급하게 재촉하거나 내면의 고독을 외면하지 마십시오.',
    },
    rilkeComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAustrianRainerMariaRilkeLettersPrompt(
  res: AustrianRainerMariaRilkeLettersResult,
): string {
  return [
    `【라이너 마리아 릴케 《젊은 시인에게 주는 편지·두이노의 비가》 고독 사랑·질문 품기 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락 초점(${res.questionTopic}): ${res.situationalRilkeAudit.focusAxisKo}`,
    `- 시적·실존적 태도: ${res.situationalRilkeAudit.poeticPosture}`,
    `- KST 시공간 리듬: ${res.temporalRilkeRhythm.timeWindowKo} · ${res.temporalRilkeRhythm.seasonKo}`,
    `- 핵심 릴케 테마: ${res.activeRilkeTheme.themeTitleKo} [${res.activeRilkeTheme.themeTitleEn}]`,
    `- 문학적 사색: ${res.activeRilkeTheme.literaryInsight}`,
    `- 질문 맞춤 조언: ${res.situationalRilkeAudit.practiceGuidance}`,
    `- 일상 의례 제안: ${res.situationalRilkeAudit.ritualAction}`,
    `- 성찰 질문: ${res.situationalRilkeAudit.reflectionFocus}`,
    `- 교차 매트릭스: 핵심(${res.rilkeSynthesisMatrix?.coreInsight ?? res.activeRilkeTheme.themeTitleKo}) | 실행(${res.rilkeSynthesisMatrix?.recommendedAction ?? res.situationalRilkeAudit.practiceGuidance}) | 주의(${res.rilkeSynthesisMatrix?.cautionNotice ?? '조급한 해답 경계'})`,
    `- 조언 요약: ${res.situationalRilkeAudit.counselNote}`,
    `- 릴케 원전 테제: "${res.focalRilkeAphorism.aphorismKo}"`,
    `- 원문: (${res.focalRilkeAphorism.aphorismGerman})`,
    `- 원전 출처: [${res.focalRilkeAphorism.sourceContext}]`,
    `- 시간대 권고: ${res.temporalRilkeRhythm.dailyWatchword}`,
    `- 종합 릴케 권면: ${res.rilkeComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.situationalRilkeAudit.boundaryNotice}`,
  ].join('\n');
}
