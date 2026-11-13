/**
 * 독일 헤르만 헤세(Hermann Hesse) 《데미안》·《싯다르타》·《황야의 이리》·《유리알 유희》 알을 깨는 투쟁·내면의 빛·아프락사스 합일 및 싯다르타 강물의 평정 지혜 엔진
 *
 * 노벨문학상 수상자이자 영혼의 순례자 헤르만 헤세(1877~1962)의 원전 기반:
 * 1. 알을 깨고 비상하는 자아실현 투쟁 지표 (Egg-Breaking Self-Realization & Abraxas Flight Score): "새는 알에서 나오려고 투쟁한다. 알은 세계이다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다. 새는 신에게 날아간다. 그 신의 이름은 아프락사스다."처럼 기존의 껍질을 부수고 참된 자아로 도약하는 용기.
 * 2. 내면의 목소리와 운명 직관 지수 (Inner Light & Destiny Attunement Index): 외부의 도그마나 타인의 시선이 아니라 자기 내면 깊은 곳에서 울려 퍼지는 영혼의 나침반을 따르는 진실성.
 * 3. 싯다르타 강물의 초연한 지혜와 합일 평정심 (Siddhartha River Equanimity & Oneness Score): 흘러가는 강물처럼 과거와 미래, 고통과 환희, 선과 악이 거대한 우주의 한 노래임을 깨닫고 모든 존재를 사랑으로 긍정하는 대평정.
 * 4. 황야의 이리 내면 양극성 치유와 해학적 해방 지수 (Steppenwolf Polarity Healing & Humor Index): 고결한 이성과 거친 야성 사이의 번민을 자기 비하 대신 유머와 다층적 자아의 춤으로 품어 안는 내면의 유연성.
 * 5. 상아탑을 넘어 대지로 향하는 참된 구도 회복탄력성 (Castalia Earthly Service & Soul Pilgrimage Resilience Score): 《유리알 유희》의 요제프 크네히트처럼 폐쇄된 완벽의 유희를 넘어 구체적인 현실의 삶과 인간을 향해 온몸으로 헌신하는 성숙한 실존력.
 *
 * @version LUCKEY-HESSE-DEMIAN-STEPPENWOLF-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_HERMANN_HESSE_DEMIAN_STEPPENWOLF_VERSION = 'LUCKEY-HESSE-DEMIAN-STEPPENWOLF-v1.0.0';

export interface HesseTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  spiritualInsight: string;
  practicalCounsel: string;
}

export interface HesseAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginal: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanHermannHesseDemianSteppenwolfResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 헤세 핵심 지표 (0~100)
  eggBreakingSelfRealizationScore: number;                 // 알을 깨는 자아실현 투쟁 지표
  innerLightDestinyAttunementIndex: number;                // 내면의 목소리와 운명 직관 지수
  siddharthaRiverEquanimityScore: number;                  // 싯다르타 강물의 평정 지혜 지표
  steppenwolfPolarityHealingIndex: number;                 // 황야의 이리 양극성 치유 지수
  castaliaEarthlyServiceResilienceScore: number;          // 현실 봉사와 순례 회복탄력성
  // 세부 분석
  activeHesseTheme: HesseTheme;
  focalHesseAphorism: HesseAphorism;
  hesseComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const HESSE_THEMES: HesseTheme[] = [
  {
    themeKey: 'breakTheEggAbraxas',
    themeTitleEn: 'Breaking the World-Egg: Courage to Shatter Illusions and Fly toward Abraxas',
    themeTitleKo: '알을 깨뜨리는 용기 — 익숙한 세계의 껍질을 부수고 온전한 자기 자신에게 이르기',
    spiritualInsight: '《데미안》의 핵심 명제: "새는 알에서 나오려고 투쟁한다. 알은 세계이다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다. 새는 신에게 날아간다. 그 신의 이름은 아프락사스다." 참된 성장은 안락한 과거의 가치관과 타인의 보호막을 스스로 부수고 나아가는 영적 산고(産苦)를 거쳐 완성됩니다.',
    practicalCounsel: '변화에 대한 두려움으로 이미 생명력을 잃은 낡은 틀에 안주하지 마십시오. 새로운 당신으로 거듭나기 위해 현재의 껍질을 과감히 깨뜨릴 때, 빛과 어둠을 온전히 포용하는 참된 자아의 날개가 돋아납니다.',
  },
  {
    themeKey: 'siddharthaRiverOneness',
    themeTitleEn: 'The Wisdom of the River: Listening to the Cosmic Music of Interconnected Oneness',
    themeTitleKo: '강물의 지혜와 대합일 — 서두름 없이 흐름을 신뢰하며 모든 존재를 사랑으로 감싸기',
    spiritualInsight: '《싯다르타》에서 구도자 싯다르타는 숲과 교설을 떠나 바수데바의 강가에서 비로소 깨달음을 얻습니다. 강물은 서두르지 않고 바다로 흐르며, 모든 물방울의 기쁨과 비명을 한데 모아 "옴(Om)"이라는 하나의 장엄한 화음을 빚어냅니다. 지혜는 판단하는 것이 아니라 모든 존재를 있는 그대로 사랑하는 것입니다.',
    practicalCounsel: '결과를 억지로 통제하려 애쓰며 조급해하지 마십시오. 삶의 강물이 흐르는 자연스러운 순리와 인연을 신뢰하고, 지금 겪는 아픔과 흔들림마저 성숙을 위한 거룩한 한 과정으로 너그럽게 품으십시오.',
  },
  {
    themeKey: 'steppenwolfHumorHealing',
    themeTitleEn: 'The Magic Theater of Steppenwolf: Healing Inner Conflicts through Laughter and Humor',
    themeTitleKo: '황야의 이리와 마법 극장 — 내면의 모순과 상처를 유머와 해학으로 춤추게 하기',
    spiritualInsight: '《황야의 이리》의 하리 할러는 고상한 시민적 자아와 거친 늑대의 본능 사이에서 절망합니다. 그러나 마법 극장의 파블로는 그에게 웃음을 가르칩니다. 인간은 단 두 개의 자아로 나뉘는 것이 아니라 천 개의 영혼을 품은 체스 말과 같으니, 삶을 엄숙한 비극 대신 유쾌한 놀이이자 춤으로 바라보아야 합니다.',
    practicalCounsel: '당신 내면의 결점이나 상반된 감정들을 자책하거나 억누르지 마십시오. 완벽해야 한다는 엄숙주의를 내려놓고 유머와 너그러움으로 자신의 다양한 면모를 바라볼 때 마음의 무거운 짐이 가벼워집니다.',
  },
  {
    themeKey: 'pathOntoOneself',
    themeTitleEn: 'The Singular Destiny: The Duty of Becoming Fully and Deeply Oneself',
    themeTitleKo: '오직 자기 자신에게 이르는 길 — 타인의 모방을 멈추고 고유한 소명을 완수하기',
    spiritualInsight: '《데미안》의 서문: "모든 사람의 삶은 제각기 자기 자신에게로 이르는 길이다. 그 어떤 사람도 온전히 자기 자신이 되어본 적이 없건만, 누구나 그렇게 되려고 애쓴다... 우리 각자는 대자연이 인간을 향해 던진 하나의 시도이다." 진정한 인간의 유일한 사명은 자신만의 운명을 찾아내는 것입니다.',
    practicalCounsel: '남들이 정해놓은 성공의 궤도나 유행에 당신을 꿰맞추려 하지 마십시오. 세상에서 오직 당신만이 피워낼 수 있는 독특한 삶의 무늬와 소명을 긍정하고 묵묵히 당신의 길을 걸어가십시오.',
  },
];

export const HESSE_APHORISMS: HesseAphorism[] = [
  {
    aphorismKey: 'birdBreaksEggQuote',
    aphorismKo: '새는 알에서 나오려고 투쟁한다. 알은 세계이다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다. 새는 신에게 날아간다. 그 신의 이름은 아프락사스다.',
    aphorismOriginal: 'Der Vogel kämpft sich aus dem Ei. Das Ei ist die Welt. Wer geboren werden will, muß eine Welt zerstören. Der Vogel fliegt zu Gott. Der Gott heißt Abraxas.',
    sourceContext: '《데미안(Demian)》 제5장 (데미안의 쪽지)',
    actionGuidance: '낡은 관습과 타협의 껍질을 부수고, 당신의 진정한 영적 본성과 잠재력을 향해 당당히 날개를 펴십시오.',
  },
  {
    aphorismKey: 'pathToOneSelfQuote',
    aphorismKo: '한 사람 한 사람의 삶은 자기 자신에게로 이르는 길이다. 길의 시도이며 좁은 오솔길의 암시다. 그 어떤 사람도 완전히 자기 자신이 되어본 적은 없지만, 누구나 그렇게 되려고 애쓴다.',
    aphorismOriginal: 'Das Leben jedes Menschen ist ein Weg zu sich selber hin, der Versuch eines Weges, die Andeutung eines Pfades. Kein Mensch ist jemals ganz er selber gewesen; jeder strebt aber, es zu werden.',
    sourceContext: '《데미안(Demian)》 서문',
    actionGuidance: '남과의 비교를 영원히 멈추고, 당신 영혼이 가리키는 고유한 운명의 오솔길을 확신을 가지고 걸어가십시오.',
  },
  {
    aphorismKey: 'riverLearnsQuote',
    aphorismKo: '강물은 어디에나 동시에 존재한다. 발원지에서도, 하구에서도, 폭포에서도, 나루터에서도, 여울에서도, 바다에서도, 산에서도 동시에 존재한다. 강물에는 과거만 있는 것도 미래만 있는 것도 아니며, 오직 현재만 있을 뿐이다.',
    aphorismOriginal: 'Das Wasser lief und lief, immerzu lief es, und war doch immer da, war immer und allezeit dasselbe und doch jeden Augenblick neu!',
    sourceContext: '《싯다르타(Siddhartha)》 제2부 〈뱃사공〉',
    actionGuidance: '과거의 후회와 미래의 불안을 강물에 흘려보내고, 살아 숨 쉬는 지금 이 순간의 충만함 속에 머무르십시오.',
  },
  {
    aphorismKey: 'loveIsEverythingQuote',
    aphorismKo: '세상을 관조하고 설명하고 경멸하는 것은 위대한 사상가들이 할 일일지도 모른다. 그러나 내게 중요한 것은 오직 세상을 사랑할 수 있는 것, 세상을 경멸하지 않는 것, 세상과 나 자신을 사랑과 경탄과 경외심으로 바라볼 수 있는 것뿐이다.',
    aphorismOriginal: 'Die Welt zu lieben, sie nicht zu verachten, sie und mich nicht zu hassen, sie und mich und alle Wesen mit Liebe und Bewunderung und Ehrfurcht betrachten zu können.',
    sourceContext: '《싯다르타(Siddhartha)》 제2부 〈고빈다와의 대화〉',
    actionGuidance: '비판과 냉소의 시선을 거두고, 당신 자신과 세상의 모든 서툰 발걸음을 깊은 사랑과 자비로 감싸 안으십시오.',
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

export function calculateGermanHermannHesseDemianSteppenwolf(
  profile?: UserProfile,
  query?: string,
): GermanHermannHesseDemianSteppenwolfResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `HESSE-DEMIAN-STEPPENWOLF:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const eggBreakingSelfRealizationScore = 92 + ((absHash >> 1) % 7);
  const innerLightDestinyAttunementIndex = 90 + ((absHash >> 4) % 9);
  const siddharthaRiverEquanimityScore = 91 + ((absHash >> 7) % 8);
  const steppenwolfPolarityHealingIndex = 89 + ((absHash >> 10) % 10);
  const castaliaEarthlyServiceResilienceScore = 90 + ((absHash >> 13) % 9);

  const themeIndex = (absHash >> 5) % HESSE_THEMES.length;
  const aphorismIndex = (absHash >> 8) % HESSE_APHORISMS.length;

  const activeHesseTheme = HESSE_THEMES[themeIndex];
  const focalHesseAphorism = HESSE_APHORISMS[aphorismIndex];

  const guidanceTitle = `헤르만 헤세 자아실현과 내면의 평정: ${activeHesseTheme.themeTitleKo}`;
  const philosophicalCounsel = `노벨문학상 수상자이자 영혼의 순례자 헤르만 헤세 선생은 《데미안》, 《싯다르타》, 《황야의 이리》를 통해 ` +
    `익숙한 세계의 알을 깨고 참된 자아로 비상하는 아프락사스의 투쟁, 외부의 교설 대신 내면의 신성한 나침반을 따르는 진실성, ` +
    `내면의 양극성과 모순을 유머로 품어 안는 유연함, 그리고 모든 존재를 하나의 거대한 사랑으로 감싸는 싯다르타 강물의 평정을 일깨웠습니다. ` +
    `지금 당신의 마음에 가장 절실한 지혜는 '${activeHesseTheme.themeTitleKo}'입니다. ` +
    `${activeHesseTheme.practicalCounsel} 헤세의 불멸의 원전 격언 "${focalHesseAphorism.aphorismKo}"을 마음에 새기고, ` +
    `${focalHesseAphorism.actionGuidance}`;

  return {
    engineVersion: GERMAN_HERMANN_HESSE_DEMIAN_STEPPENWOLF_VERSION,
    calculatedAtKst: new Date().toISOString(),
    eggBreakingSelfRealizationScore,
    innerLightDestinyAttunementIndex,
    siddharthaRiverEquanimityScore,
    steppenwolfPolarityHealingIndex,
    castaliaEarthlyServiceResilienceScore,
    activeHesseTheme,
    focalHesseAphorism,
    hesseComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatGermanHermannHesseDemianSteppenwolfPrompt(
  res: GermanHermannHesseDemianSteppenwolfResult,
): string {
  return [
    `【헤르만 헤세 《데미안·싯다르타·황야의 이리》 자아실현·내면 평정 지표】`,
    `- 알을 깨는 자아실현 투쟁 지표(Egg-Breaking Abraxas Flight): ${res.eggBreakingSelfRealizationScore}/100`,
    `- 내면의 목소리와 운명 직관 지수(Inner Light Destiny Attunement): ${res.innerLightDestinyAttunementIndex}/100`,
    `- 싯다르타 강물의 평정 지혜 지표(Siddhartha River Equanimity & Oneness): ${res.siddharthaRiverEquanimityScore}/100`,
    `- 황야의 이리 양극성 치유 지수(Steppenwolf Polarity Healing & Humor): ${res.steppenwolfPolarityHealingIndex}/100`,
    `- 현실 봉사와 순례 회복탄력성(Castalia Earthly Service Resilience): ${res.castaliaEarthlyServiceResilienceScore}/100`,
    `- 핵심 헤세 테마: ${res.activeHesseTheme.themeTitleKo} [${res.activeHesseTheme.themeTitleEn}]`,
    `- 영적 사색: ${res.activeHesseTheme.spiritualInsight}`,
    `- 행동 조언: ${res.activeHesseTheme.practicalCounsel}`,
    `- 헤세 원전 명대사: "${res.focalHesseAphorism.aphorismKo}"`,
    `- 원문: (${res.focalHesseAphorism.aphorismOriginal})`,
    `- 원전 출처: [${res.focalHesseAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHesseAphorism.actionGuidance}`,
    `- 종합 헤세 권면: ${res.hesseComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
