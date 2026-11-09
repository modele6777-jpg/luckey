/**
 * 고대 그리스/로마 플로티노스(Plotinus) 《엔네아데스(Enneads)》 일자유출설 & 영적 귀환·내면합일(Henosis) 지혜 엔진
 *
 * 3세기 신플라톤주의(Neoplatonism)의 위대한 창시자 플로티노스(Plotinus, 204~270)의 전집 《엔네아데스(Enneads, 제자 포르피리오스 편찬)》 원전 기반:
 * 1. 일자(The One / To Hen) 근원 교감도(The One Supreme Source Emanation Score): 만유의 불가언적 궁극 원천인 '일자'로부터 온 세계가 빛처럼 유출됨을 자각하고 영적 근원과 교감하는 통찰.
 * 2. 누스(Nous, 신성한 지성) 관조·예지력(Nous Intellectual Contemplation Index): 시공간의 한계를 초월하여 영원한 이데아와 본질적 진리를 명징하게 응시하는 최고의 지성적 관조력.
 * 3. 프쉬케(Psyche, 우주 영혼) 생명 조화도(Psyche Soul Self-Cultivation Score): 육체와 물질에 매몰되지 않고 우주적 생명력과 내면의 조화를 유지하며 세상을 품는 영혼의 성숙도.
 * 4. 헤노시스(Henosis, 신성 합일) 영적 귀환력(Henosis Mystic Ascent Union Index): 감각적 물질계의 분열과 집착을 벗어나 오직 영혼의 날개로 가장 순수한 궁극의 일자로 거슬러 올라가는 회복력.
 * 5. 내면 조각 및 영혼 정화 미학도(Inner Beauty Sculpting Virtue Score): "너 자신만의 조각가가 되어 불필요한 돌을 깎아내라"는 가르침에 따라 허위와 탐욕을 비우고 본래의 아름다움을 빚어내는 실천적 덕성.
 *
 * @version LUCKEY-PLOTINUS-ENNEADS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const ANCIENT_GREEK_PLOTINUS_VERSION = 'LUCKEY-PLOTINUS-ENNEADS-v1.0.0';

export interface PlotinusTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface PlotinusAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGreek: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AncientGreekPlotinusEnneadsHenosisResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 플로티노스 엔네아데스 영적 귀환 지표 (0~100)
  theOneSupremeSourceEmanationScore: number;    // 일자 근원 교감도 (The One Supreme Source)
  nousIntellectualContemplationIndex: number;   // 누스 신성 지성 관조력 (Nous Intellectual Contemplation)
  psycheSoulSelfCultivationScore: number;       // 프쉬케 영혼 생명 조화도 (Psyche Soul Self-Cultivation)
  henosisMysticAscentUnionIndex: number;        // 헤노시스 영적 합일 귀환력 (Henosis Mystic Ascent)
  innerBeautySculptingVirtueScore: number;      // 내면 조각 및 영혼 정화 미학도 (Inner Beauty Sculpting)
  // 세부 분석
  activePlotinusTheme: PlotinusTheme;
  focalPlotinusAphorism: PlotinusAphorism;
  plotinusComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const PLOTINUS_THEMES: PlotinusTheme[] = [
  {
    themeKey: 'return_to_the_one',
    themeTitleEn: 'Return to the Supreme One (궁극의 일자로의 영적 귀환)',
    themeTitleKo: '물질의 분열과 혼란을 벗어나 만물의 근원인 고요한 일자로 향함',
    existentialInsight: '태양이 빛을 뿜어내어 만물을 비추듯, 모든 존재는 가장 높은 선이자 순수한 원천인 일자(The One)로부터 유출되었습니다. 우리의 방황은 근원을 잊었을 때 시작되며, 마음의 눈을 안으로 돌릴 때 평화가 회복됩니다.',
    practicalCounsel: '바깥세상의 소란과 끝없는 물질적 비교에 마음을 빼앗기지 마십시오. 하루 중 단 몇 분이라도 호흡을 가다듬고 모든 생각의 근원이 되는 내면의 가장 깊은 고요 속으로 돌아가십시오.',
  },
  {
    themeKey: 'sculpting_inner_statue',
    themeTitleEn: 'Sculpting Your Own Inner Statue (내면의 조각상을 깎아냄)',
    themeTitleKo: '자신의 영혼에서 불필요한 번뇌와 집착을 깎아내어 본래의 고결함을 드러냄',
    existentialInsight: '조각가는 돌에 무언가를 덧붙이지 않고 오직 불필요한 부분을 쪼아냄으로써 대리석 속에 숨겨진 고귀한 형상을 탄생시킵니다. 영혼의 성숙 역시 욕망을 채우는 것이 아니라 쓸데없는 찌꺼기를 비워내는 데 있습니다.',
    practicalCounsel: '자신에게 없는 것을 억지로 끌어모으려 애태우지 마십시오. 질투, 원망, 허영 등 영혼의 맑은 빛을 가리는 거짓된 외피를 깎아낼 때 당신 안의 가장 빛나는 신성이 스스로 드러납니다.',
  },
  {
    themeKey: 'nous_contemplative_illumination',
    themeTitleEn: 'Nous Contemplative Illumination (누스 지성의 영원한 진리 관조)',
    themeTitleKo: '변화무쌍한 감각의 허상을 뚫고 영원불멸한 본질과 지혜를 응시함',
    existentialInsight: '눈앞의 사물들은 흘러가는 그림자에 불과하지만, 지성(Nous)은 시간을 뛰어넘는 보편적 질서와 이데아를 품고 있습니다. 피상적 현상에 휘둘리지 않고 이면의 본질을 꿰뚫어 보는 자만이 삶의 주인이 됩니다.',
    practicalCounsel: '일시적인 성패나 눈앞의 작은 손익에 일희일비하지 마십시오. 한 걸음 물러나 사건 전체의 근본적인 원인과 구조적 흐름을 맑고 객관적인 시선으로 관조하십시오.',
  },
  {
    themeKey: 'soul_harmonizing_cosmos',
    themeTitleEn: 'Soul Harmonizing the Cosmos (우주와 공명하는 프쉬케의 조화)',
    themeTitleKo: '육체의 한계에 갇히지 않고 만유를 살리는 너른 생명력으로 소통함',
    existentialInsight: '영혼(Psyche)은 물질을 생명으로 숨 쉬게 하는 신성한 다리입니다. 영혼이 물질의 노예가 되지 않고 거꾸로 물질을 조화롭게 이끌 때, 삶은 예술이 되고 세상은 유기적인 아름다움으로 빛납니다.',
    practicalCounsel: '자신의 몸과 일상 환경을 무질서 속에 방치하지 마십시오. 당신의 정돈된 마음과 따뜻한 태도가 주변 사람들과 환경 전체에 긍정적인 파동을 일으킨다는 사실을 기억하십시오.',
  },
  {
    themeKey: 'flight_of_the_alone_to_the_alone',
    themeTitleEn: 'Flight of the Alone to the Alone (홀로 있는 자의 신성한 비상)',
    themeTitleKo: '세속의 온갖 의존과 결핍을 털어내고 절대적 온전함에 도달함',
    existentialInsight: '플로티노스는 삶의 궁극적 도달점을 "홀로 있는 자가 홀로 있는 자에게로 날아오름(Phygē monou pros monon)"이라 불렀습니다. 이는 고립이 아니라, 그 어떤 외부 조건에도 기대지 않는 완전한 자족과 자유의 경지입니다.',
    practicalCounsel: '타인의 승인이나 인정에 목말라하지 마십시오. 당신은 이미 우주 전체의 신성한 근원을 품고 있는 온전한 존재입니다. 고독을 두려워하지 말고 절대적 자존과 품위를 회복하십시오.',
  },
];

export const PLOTINUS_APHORISMS: PlotinusAphorism[] = [
  {
    aphorismKey: 'sculpt_your_own_statue',
    aphorismKo: '당신의 영혼이 아직 아름답지 않거든, 조각가가 아름다운 상을 만들 때 불필요한 돌을 깎아내듯 당신의 결점을 깎아내어 아름다운 미덕의 빛을 드러내어라.',
    aphorismGreek: 'Κόλουε τὰ περιττὰ καὶ ἀπεύθυνε τὰ σκολιά, ἕως ἂν ἐκλάμψῃ σοι τὸ θεοειδὲς κάλλος τῆς ἀρετῆς',
    sourceContext: '《엔네아데스(Enneads)》 제1권 제6편 〈아름다움에 관하여(Peri tou Kalou)〉 9장',
    actionGuidance: '내면을 어지럽히는 불필요한 잡념과 감정의 군더더기를 과감히 덜어내고, 본래의 고결한 품성을 회복하십시오.',
  },
  {
    aphorismKey: 'awaken_inner_eyesight',
    aphorismKo: '참된 귀환은 두 발로 걷는 것이 아니라, 육체의 눈을 감고 누구나 가지고 있으나 극소수만이 사용하는 내면의 또 다른 시력을 일깨우는 것이다.',
    aphorismGreek: 'Οὐ ποσὶ δεῖ ποιεῖσθαι τὴν πορείαν, ἀλλὰ μύσαντα τὴν ὄψιν ἄλλην ἕλκειν καὶ ἀνεγείρειν',
    sourceContext: '《엔네아데스》 제1권 제6편 〈아름다움에 관하여〉 8장',
    actionGuidance: '감각적인 외적 자극에 끌려다니기를 멈추고, 직관과 내적 통찰의 밝은 눈을 뜨십시오.',
  },
  {
    aphorismKey: 'flight_of_the_alone',
    aphorismKo: '이것이 신들과 신성한 사람들의 해탈한 삶이니, 세속의 모든 번뇌를 벗어던진 홀로 있는 자가 홀로 있는 자에게로 날아오름이다.',
    aphorismGreek: 'Φυγὴ μόνου πρὸς μόνον',
    sourceContext: '《엔네아데스》 제6권 제9편 〈선 또는 일자에 관하여(Peri tou Agathou ē tou Henos)〉 11장',
    actionGuidance: '주변의 기대나 세상의 평가에 구애받지 말고, 오직 영혼의 가장 깊은 진실과 고요 속으로 당당히 날아오르십시오.',
  },
  {
    aphorismKey: 'light_recognizes_light',
    aphorismKo: '태양을 닮지 않은 눈은 결코 태양을 볼 수 없듯이, 영혼 스스로 아름다워지지 않고서는 지고의 아름다움을 마주할 수 없다.',
    aphorismGreek: 'Οὐ γὰρ ἂν πώποτε εἶδεν ὀφθαλμὸς ἥλιον ἡλιοειδὴς μὴ γεγενημένος, οὐδὲ τὸ καλὸν ἴδοι ἂν ψυχὴ μὴ καλὴ γενομένη',
    sourceContext: '《엔네아데스》 제1권 제6편 〈아름다움에 관하여〉 9장',
    actionGuidance: '더 높은 삶과 좋은 인연을 바란다면 먼저 자신의 마음과 언행을 맑고 고결하게 가꾸십시오.',
  },
];

export function calculateAncientGreekPlotinusEnneadsHenosis(
  profile: UserProfile
): AncientGreekPlotinusEnneadsHenosisResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `PLOTINUS-ENNEADS-HENOSIS:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const theOneSupremeSourceEmanationScore = 76 + (absHash % 23);
  const nousIntellectualContemplationIndex = 75 + ((absHash >> 3) % 24);
  const psycheSoulSelfCultivationScore = 74 + ((absHash >> 6) % 25);
  const henosisMysticAscentUnionIndex = 77 + ((absHash >> 9) % 22);
  const innerBeautySculptingVirtueScore = 73 + ((absHash >> 12) % 26);

  const themeIndex = (absHash >> 4) % PLOTINUS_THEMES.length;
  const aphorismIndex = (absHash >> 7) % PLOTINUS_APHORISMS.length;

  const activePlotinusTheme = PLOTINUS_THEMES[themeIndex];
  const focalPlotinusAphorism = PLOTINUS_APHORISMS[aphorismIndex];

  const guidanceTitle = `플로티노스 엔네아데스 일자 유출과 영적 귀환 지혜: ${activePlotinusTheme.themeTitleKo}`;
  const philosophicalCounsel = `신플라톤주의의 거장 플로티노스의 엔네아데스 사상은 만물의 근원인 일자(The One)와의 영적 교감, 내면의 조각상을 깎아내는 영혼의 정화, 그리고 세속의 번뇌를 털고 궁극의 자유로 날아오르는 헤노시스(Henosis)의 지혜를 전합니다. ` +
    `현재 당신의 삶을 관통하는 중심 영적 원리는 '${activePlotinusTheme.themeTitleKo}'입니다. ` +
    `${activePlotinusTheme.practicalCounsel} 아울러 《엔네아데스》 원전의 명언 "${focalPlotinusAphorism.aphorismKo}"(${focalPlotinusAphorism.aphorismGreek})를 깊이 마음에 새기고, ` +
    `${focalPlotinusAphorism.actionGuidance}`;

  return {
    engineVersion: ANCIENT_GREEK_PLOTINUS_VERSION,
    calculatedAtKst: new Date().toISOString(),
    theOneSupremeSourceEmanationScore,
    nousIntellectualContemplationIndex,
    psycheSoulSelfCultivationScore,
    henosisMysticAscentUnionIndex,
    innerBeautySculptingVirtueScore,
    activePlotinusTheme,
    focalPlotinusAphorism,
    plotinusComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAncientGreekPlotinusEnneadsHenosisPrompt(res: AncientGreekPlotinusEnneadsHenosisResult): string {
  return [
    `【플로티노스 《엔네아데스》 일자유출설 & 영적 귀환 지표】`,
    `- 일자 근원 교감도(The One Supreme Source): ${res.theOneSupremeSourceEmanationScore}/100`,
    `- 누스 지성 관조력(Nous Contemplation): ${res.nousIntellectualContemplationIndex}/100`,
    `- 프쉬케 영혼 조화도(Psyche Soul Harmony): ${res.psycheSoulSelfCultivationScore}/100`,
    `- 헤노시스 영적 귀환력(Henosis Mystic Ascent): ${res.henosisMysticAscentUnionIndex}/100`,
    `- 내면 조각 정화 미학도(Inner Beauty Sculpting): ${res.innerBeautySculptingVirtueScore}/100`,
    `- 핵심 영적 테마: ${res.activePlotinusTheme.themeTitleKo} [${res.activePlotinusTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activePlotinusTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activePlotinusTheme.practicalCounsel}`,
    `- 핵심 원전 명언: "${res.focalPlotinusAphorism.aphorismKo}" [${res.focalPlotinusAphorism.aphorismGreek}]`,
    `- 원전 출처: [${res.focalPlotinusAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalPlotinusAphorism.actionGuidance}`,
    `- 종합 신플라톤주의 철학 권면: ${res.plotinusComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
