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
 * @version LUCKEY-RILKE-LETTERS-TO-YOUNG-POET-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_RAINER_MARIA_RILKE_LETTERS_VERSION = 'LUCKEY-RILKE-LETTERS-TO-YOUNG-POET-v1.0.0';

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

export function calculateAustrianRainerMariaRilkeLetters(
  profile?: UserProfile,
  query?: string,
): AustrianRainerMariaRilkeLettersResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `RILKE-LETTERS-TO-YOUNG-POET:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
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

  const guidanceTitle = `라이너 마리아 릴케 고독의 사랑과 질문의 변용: ${activeRilkeTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 실존 서정시의 거장 라이너 마리아 릴케 선생은 《젊은 시인에게 주는 편지》와 《두이노의 비가》를 통해 ` +
    `세속의 소음에서 물러나 자기만의 고독을 사랑하는 깊은 침잠, 조급하게 해답을 구걸하지 않고 질문 자체를 살아내는 숭고한 인내, ` +
    `그리고 상처와 유한성을 눈부신 영혼의 노래로 승화하는 존재의 변용(Verwandlung)의 길을 일깨웠습니다. ` +
    `지금 당신에게 가장 절실한 내면의 등불은 '${activeRilkeTheme.themeTitleKo}'입니다. ` +
    `${activeRilkeTheme.practicalCounsel} 릴케의 원전 테제 "${focalRilkeAphorism.aphorismKo}"을 마음에 품고, ` +
    `${focalRilkeAphorism.actionGuidance}`;

  return {
    engineVersion: AUSTRIAN_RAINER_MARIA_RILKE_LETTERS_VERSION,
    calculatedAtKst: new Date().toISOString(),
    lovingSolitudeInwardScore,
    livingTheQuestionsIndex,
    contemplativeGazingIndex,
    elegiacSublimationScore,
    openHorizonResilienceScore,
    activeRilkeTheme,
    focalRilkeAphorism,
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
    `【라이너 마리아 릴케 《젊은 시인에게 주는 편지·두이노의 비가》 고독 사랑·질문 품기 지표】`,
    `- 고독 사랑과 깊은 침잠도(Loving Solitude & Inward Deepening): ${res.lovingSolitudeInwardScore}/100`,
    `- 가슴속 질문 자체를 살아내는 지혜(Living Unresolved Questions): ${res.livingTheQuestionsIndex}/100`,
    `- 사물에 대한 지극한 시적 응시(Contemplative Gazing): ${res.contemplativeGazingIndex}/100`,
    `- 시련과 상실의 비가적 승화력(Elegiac Sublimation & Praise): ${res.elegiacSublimationScore}/100`,
    `- 거대한 열림 속 초연한 회복탄력성(Open Horizon Resilience): ${res.openHorizonResilienceScore}/100`,
    `- 핵심 릴케 테마: ${res.activeRilkeTheme.themeTitleKo} [${res.activeRilkeTheme.themeTitleEn}]`,
    `- 문학적 사색: ${res.activeRilkeTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeRilkeTheme.practicalCounsel}`,
    `- 릴케 원전 테제: "${res.focalRilkeAphorism.aphorismKo}"`,
    `- 원문: (${res.focalRilkeAphorism.aphorismGerman})`,
    `- 원전 출처: [${res.focalRilkeAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalRilkeAphorism.actionGuidance}`,
    `- 종합 릴케 권면: ${res.rilkeComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
