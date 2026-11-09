/**
 * 독일/스위스 헤르만 헤세(Hermann Hesse) 《데미안(Demian)》 & 《싯다르타(Siddhartha)》 아브락사스(Abraxas) 자아실현 & 내면의 길 지혜 엔진
 *
 * 노벨문학상 수상 작가이자 영혼의 구도자 헤르만 헤세(Hermann Hesse, 1877~1962)의 필생의 걸작
 * 《데미안(Demian)》, 《싯다르타(Siddhartha)》, 《황야의 이리(Der Steppenwolf)》, 《유리알 유희(Das Glasperlenspiel)》 원전 기반:
 * 1. 아브락사스 자아실현도(Abraxas Self-Actualization Score): 알(기존의 세계)을 깨고 나와 자기만의 진정한 운명과 신성한 신을 향해 날아오르는 실존적 결단력.
 * 2. 양극성 내면 통합 조화 지수(Polarity Harmonization Index): 빛과 어둠, 이성과 본능, 성스러움과 세속성의 대립을 억압하지 않고 전체로 포용하는 내적 통합도.
 * 3. 싯다르타 주체적 구도력(Siddhartha Autonomous Quest Score): 타인의 교리나 맹목적 추종을 거부하고, 스스로의 삶과 직접적인 체험을 통해 지혜를 길어 올리는 독립적 영성.
 * 4. 강물의 지혜 원융 합일도(River Wisdom Unity Index): 강물의 소리처럼 만물의 슬픔과 기쁨, 생성과 소멸이 거대한 하나의 조화로 흐르고 있음을 직관하는 영혼의 평정심.
 * 5. 내면의 부름 자기 성실성(Inner Calling Fidelity Score): 세속의 인정이나 군중의 소음에 흔들리지 않고, 가슴 깊은 곳에서 솟아 나오는 자기만의 목소리를 살아내는 진실성.
 *
 * @version LUCKEY-HERMANN-HESSE-WISDOM-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_HERMANN_HESSE_VERSION = 'LUCKEY-HERMANN-HESSE-WISDOM-v1.0.0';

export interface HesseTheme {
  themeKey: string;
  themeTitleDe: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface HesseAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismDe: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanSwissHermannHesseDemianSiddharthaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 헤르만 헤세 자아실현 영적 지표 (0~100)
  abraxasSelfActualizationScore: number;     // 아브락사스 자아실현도 (Abraxas Self-Actualization)
  innerPolarityHarmonizationIndex: number;   // 양극성 내면 통합 조화 지수 (Polarity Harmonization)
  siddharthaAutonomousQuestScore: number;    // 싯다르타 주체적 구도력 (Autonomous Quest)
  riverWisdomUnityIndex: number;             // 강물의 지혜 원융 합일도 (River Wisdom of Unity)
  innerCallingFidelityScore: number;         // 내면의 부름 자기 성실성 (Fidelity to Inner Calling)
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
    themeKey: 'abraxasBreakEgg',
    themeTitleDe: 'Das Ei zerbrechen & Zu Abraxas fliegen',
    themeTitleKo: '알을 깨고 나오는 투쟁과 아브락사스의 비상',
    existentialInsight: '새는 알을 깨고 나오려 투쟁합니다. 알은 하나의 익숙한 세계이자 한계입니다. 진정으로 태어나려는 자는 기존의 고정관념과 타인의 기대를 파괴해야 합니다.',
    practicalCounsel: '지금 당신을 안주하게 만드는 낡은 껍질이 무엇인지 직시하십시오. 두려움을 딛고 자신의 본질적 욕망과 신념을 향해 날개를 펼치십시오.',
  },
  {
    themeKey: 'siddharthaRiver',
    themeTitleDe: 'Die Weisheit des Flusses & Das Ganze hören',
    themeTitleKo: '강물에서 배우는 지혜와 만유의 원융 합일',
    existentialInsight: '강물은 어디서나 동시에 존재하며, 과거도 미래도 없이 오직 현재로 흐릅니다. 모든 갈등과 고통은 거대한 우주의 흐름 속에서 완전한 하모니를 이룹니다.',
    practicalCounsel: '문제를 성급히 통제하려 하지 말고 강물처럼 흐름에 맡겨보십시오. 슬픔과 기쁨의 모든 물줄기를 있는 그대로 받아들일 때 참된 지혜가 열립니다.',
  },
  {
    themeKey: 'steppenwolfIntegration',
    themeTitleDe: 'Steppenwolf & Das Lachen der Unsterblichen',
    themeTitleKo: '황야의 이리와 불멸자들의 유쾌한 초월',
    existentialInsight: '인간의 내면에는 고상한 시민과 거친 황야의 이리가 공존합니다. 자신의 어두운 그림자를 부정하지 않고 유머와 예술적 유희로 품어낼 때 해방을 얻습니다.',
    practicalCounsel: '자신의 불완전함과 모순을 자책하지 마십시오. 모차르트와 불멸자들처럼 엄숙주의를 내려놓고 삶의 모순을 유쾌한 미소로 품어 안으십시오.',
  },
  {
    themeKey: 'knulpWanderingSpirit',
    themeTitleDe: 'Knulp & Die Freiheit der wandernden Seele',
    themeTitleKo: '크눌프의 자유로운 영혼과 순수한 휴식',
    existentialInsight: '세속적인 성공과 규범에 매이지 않고, 봄바람처럼 사람들에게 따뜻한 위안과 아름다운 추억을 남기는 자유로운 영혼의 가치가 존재합니다.',
    practicalCounsel: '모든 사람이 규격화된 성공의 길을 걸을 필요는 없습니다. 당신만의 고유한 리듬으로 걷고, 지친 이들에게 따뜻한 온기를 건네는 여유를 가지십시오.',
  },
  {
    themeKey: 'glassBeadGameSynthesis',
    themeTitleDe: 'Das Glasperlenspiel & Geistige Harmonie',
    themeTitleKo: '유리알 유희의 지적·영적 종합과 현실 참여',
    existentialInsight: '모든 학문과 예술, 동서양의 영성은 하나의 유리알 유희처럼 조화를 이룹니다. 그러나 순수한 정신의 탑에만 머물지 않고 현실의 생명으로 회향해야 합니다.',
    practicalCounsel: '사색과 지식을 쌓는 데서 멈추지 말고, 그것을 오늘 당신이 마주하는 구체적인 사람과 일상 속에 따스하게 번역하여 실천하십시오.',
  },
];

export const HESSE_APHORISMS: HesseAphorism[] = [
  {
    aphorismKey: 'birdOutOfEgg',
    aphorismKo: '새는 알을 깨고 나오려 투쟁한다. 알은 세계이다. 태어나려는 자는 하나의 세계를 파괴해야 한다. 새는 신에게로 날아간다. 그 신의 이름은 아브락사스다.',
    aphorismDe: 'Der Vogel kämpft sich aus dem Ei. Das Ei ist die Welt. Wer geboren werden will, muß eine Welt zerstören. Der Vogel fliegt zu Gott. Der Gott heißt Abraxas.',
    sourceContext: '《데미안(Demian)》 제5장 새는 알을 깨고 나온다',
    actionGuidance: '과거의 타성이나 타인의 시선이라는 안락한 알을 단호히 깨뜨리고, 빛과 어둠을 모두 품은 당신 본연의 온전한 신성을 향해 용기 있게 도약하십시오.',
  },
  {
    aphorismKey: 'liveFromWithin',
    aphorismKo: '내 속에서 솟아 나오려는 것, 바로 그것을 나는 살아보려 했다. 왜 그것이 그토록 어려웠을까?',
    aphorismDe: 'Ich wollte ja nichts als das zu leben versuchen, was von selber aus mir heraus wollte. Warum war das so sehr schwer?',
    sourceContext: '《데미안(Demian)》 서문',
    actionGuidance: '외부의 기준에 억지로 자신을 맞추려 하지 말고, 당신의 가장 깊은 내면에서 저절로 솟구쳐 나오는 고유한 열망에 정직하게 응답하십시오.',
  },
  {
    aphorismKey: 'wisdomCannotBeTold',
    aphorismKo: '지식은 전달될 수 있지만 지혜는 전달될 수 없다. 지혜는 스스로 발견해야 하며, 삶으로 살아내야 한다.',
    aphorismDe: 'Wissen kann man mitteilen, Weisheit aber nicht. Man kann sie finden, man kann sie leben, man kann von ihr getragen werden.',
    sourceContext: '《싯다르타(Siddhartha)》 고빈다와의 마지막 대화',
    actionGuidance: '책이나 남의 말에만 의지하지 말고, 당신 자신이 직접 부딪히고 느끼며 겪은 경험의 열매를 가장 귀한 지혜의 나침반으로 삼으십시오.',
  },
  {
    aphorismKey: 'oppositeIsAlsoTrue',
    aphorismKo: '모든 진리의 반대편 역시 참되다. 오직 한쪽만을 고집할 때 인간은 미망에 빠진다.',
    aphorismDe: 'Von jeder Wahrheit ist das Gegenteil ebenso wahr! Ein Ding ist niemals ganz einseitig.',
    sourceContext: '《싯다르타(Siddhartha)》',
    actionGuidance: '양자택일의 이분법에 갇히지 마십시오. 대립하는 두 의견 속에서 각각의 진실을 발견하고 더 높은 차원의 조화를 모색하십시오.',
  },
  {
    aphorismKey: 'hateInOthersSelf',
    aphorismKo: '우리가 누군가를 미워한다면, 우리는 그 사람의 모습 속에 있는 우리 자신의 무언가를 미워하는 것이다. 우리 속에 없는 것은 우리를 흥분시키지 않는다.',
    aphorismDe: 'Wenn wir einen Menschen hassen, so hassen wir in seinem Bild etwas, was in uns selber sitzt. Was nicht in uns selber ist, das regt uns nicht auf.',
    sourceContext: '《데미안(Demian)》 피스토리우스의 가르침',
    actionGuidance: '타인을 향한 분노나 거부감이 들 때, 그것이 비추고 있는 내 안의 억압된 그림자가 무엇인지 성찰하며 내면의 평화를 회복하십시오.',
  },
  {
    aphorismKey: 'loveStrengthCertainty',
    aphorismKo: '사랑은 구걸해서도 안 되며 요구해서도 안 된다. 사랑은 확신에 이르는 힘을 가져야 한다.',
    aphorismDe: 'Die Liebe darf nicht bitten, sie darf auch nicht fordern. Liebe muß die Kraft haben, zur Gewißheit zu werden.',
    sourceContext: '《데미안(Demian)》 에바 부인의 가르침',
    actionGuidance: '애정과 인정을 타인에게 애걸하지 마십시오. 먼저 자기 자신을 온전히 신뢰하고 사랑함으로써 흔들리지 않는 내적 중심을 세우십시오.',
  },
];

export function calculateGermanSwissHermannHesseDemianSiddhartha(
  profile?: UserProfile,
  query?: string,
): GermanSwissHermannHesseDemianSiddharthaResult {
  const seedString = `${profile?.name ?? '남희'}_${profile?.birthday ?? '1967-08-25'}_${query ?? ''}_HESSE_ABRAXAS`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const abraxasSelfActualizationScore = 76 + (absHash % 23);
  const innerPolarityHarmonizationIndex = 75 + ((absHash >> 3) % 24);
  const siddharthaAutonomousQuestScore = 78 + ((absHash >> 6) % 21);
  const riverWisdomUnityIndex = 77 + ((absHash >> 9) % 22);
  const innerCallingFidelityScore = 79 + ((absHash >> 12) % 20);

  const themeIndex = (absHash >> 4) % HESSE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % HESSE_APHORISMS.length;

  const activeHesseTheme = HESSE_THEMES[themeIndex];
  const focalHesseAphorism = HESSE_APHORISMS[aphorismIndex];

  const guidanceTitle = `헤르만 헤세 자아실현과 구도 지혜: ${activeHesseTheme.themeTitleKo}`;
  const philosophicalCounsel = `영혼의 구도자 헤르만 헤세의 《데미안》과 《싯다르타》는 타인의 교조나 군중의 규범에 갇히지 않고, 오직 내면의 신성한 부름을 따라 자아의 껍질을 깨고 도약하도록 이끕니다. ` +
    `현재 당신의 삶을 인도하는 가장 깊은 영적 테마는 '${activeHesseTheme.themeTitleKo}'입니다. ` +
    `${activeHesseTheme.practicalCounsel} 아울러 헤세의 불멸의 원전 명언 "${focalHesseAphorism.aphorismKo}"(${focalHesseAphorism.aphorismDe})를 마음에 새기며, ` +
    `${focalHesseAphorism.actionGuidance}`;

  return {
    engineVersion: GERMAN_HERMANN_HESSE_VERSION,
    calculatedAtKst: new Date().toISOString(),
    abraxasSelfActualizationScore,
    innerPolarityHarmonizationIndex,
    siddharthaAutonomousQuestScore,
    riverWisdomUnityIndex,
    innerCallingFidelityScore,
    activeHesseTheme,
    focalHesseAphorism,
    hesseComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatGermanSwissHermannHesseDemianSiddharthaPrompt(
  res: GermanSwissHermannHesseDemianSiddharthaResult,
): string {
  return [
    `【헤르만 헤세 《데미안·싯다르타》 아브락사스 자아실현 & 내면의 길 지표】`,
    `- 아브락사스 자아실현도(Abraxas Self-Actualization): ${res.abraxasSelfActualizationScore}/100`,
    `- 양극성 내면 통합 조화 지수(Polarity Harmonization): ${res.innerPolarityHarmonizationIndex}/100`,
    `- 싯다르타 주체적 구도력(Autonomous Quest): ${res.siddharthaAutonomousQuestScore}/100`,
    `- 강물의 지혜 원융 합일도(River Wisdom Unity): ${res.riverWisdomUnityIndex}/100`,
    `- 내면의 부름 자기 성실성(Inner Calling Fidelity): ${res.innerCallingFidelityScore}/100`,
    `- 핵심 영적 테마: ${res.activeHesseTheme.themeTitleKo} [${res.activeHesseTheme.themeTitleDe}]`,
    `- 실존적 통찰: ${res.activeHesseTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeHesseTheme.practicalCounsel}`,
    `- 헤세 원전 명언: "${res.focalHesseAphorism.aphorismKo}" [${res.focalHesseAphorism.aphorismDe}]`,
    `- 원전 출처: [${res.focalHesseAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHesseAphorism.actionGuidance}`,
    `- 종합 헤세 지혜 권면: ${res.hesseComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
