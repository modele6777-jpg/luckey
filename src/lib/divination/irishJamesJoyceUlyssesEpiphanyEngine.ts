/**
 * 아일랜드 제임스 조이스(James Joyce) 《율리시스》·《젊은 예술가의 초상》·《더블린 사람들》 에피파니(Epiphany)·의식의 흐름·내면 오디세이 및 삶을 향한 절대 긍정 지혜 엔진
 *
 * 20세기 모더니즘 문학의 거장이자 언어의 혁신가 제임스 조이스(1882~1941)의 원전 기반:
 * 1. 일상 속 영혼의 순간적 현현 에피파니 직관도 (Epiphany Everyday Revelation Score): 평범하고 진부한 일상의 한 장면 속에서 사물의 참된 본질과 영혼의 진실이 섬광처럼 드러나는 영적 개안의 힘.
 * 2. 의식의 흐름과 내면 자유 개척 지수 (Stream of Consciousness Inner Liberty Index): 고정된 형식과 관습적 규범을 넘어 생각과 감정의 자유로운 파도를 온전히 항해하는 내면의 주체성.
 * 3. 미로를 뚫고 비상하는 다이달로스 예술적 자율성 지표 (Daedalian Autonomy & Soul Forging Score): 스티븐 디덜러스처럼 그물과 덫을 벗어나 자기 영혼의 대장간에서 주체적 자아를 벼려내는 독립적 기개.
 * 4. 일상의 미망 속에서 귀향하는 오디세이 대자비 화해 지수 (Odyssey Leopold Bloom Compassion & Homecoming Index): 레오폴드 블룸처럼 조롱과 편견 속에서도 타인을 향한 따스한 연민과 온화한 인내로 일상의 안식처를 지키는 품격.
 * 5. 삶의 모든 부침을 긍정하는 우주적 "Yes" 실존 긍정 회복탄력성 (Molly Bloom Vital "Yes" Cosmic Affirmation & Resilience Score): 몰리 블룸의 마지막 독백 "그래요 나는 말했어요 그래요 나는 할 거예요 그래요(Yes I said yes I will Yes)"처럼 삶의 모든 슬픔과 기쁨을 온몸으로 껴안는 불굴의 긍정 생명력.
 *
 * @version LUCKEY-JOYCE-ULYSSES-EPIPHANY-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const IRISH_JAMES_JOYCE_ULYSSES_EPIPHANY_VERSION = 'LUCKEY-JOYCE-ULYSSES-EPIPHANY-v1.0.0';

export interface JoyceTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface JoyceAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginal: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface IrishJamesJoyceUlyssesEpiphanyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 조이스 핵심 지표 (0~100)
  epiphanyEverydayRevelationScore: number;                // 일상 속 에피파니 직관도
  streamOfConsciousnessLibertyIndex: number;              // 의식의 흐름과 내면 자유 개척 지수
  daedalianArtisticAutonomyScore: number;                 // 미로 탈출 다이달로스 예술적 자율성 지표
  odysseyCompassionateReconciliationIndex: number;        // 오디세이 대자비 화해 지수
  vitalYesCosmicAffirmationScore: number;                 // 우주적 "Yes" 실존 긍정 회복탄력성
  // 세부 분석
  activeJoyceTheme: JoyceTheme;
  focalJoyceAphorism: JoyceAphorism;
  joyceComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const JOYCE_THEMES: JoyceTheme[] = [
  {
    themeKey: 'everydayEpiphany',
    themeTitleEn: 'Everyday Epiphany: Sudden Spiritual Manifestation in Ordinary Moments',
    themeTitleKo: '일상의 에피파니 — 평범하고 사소한 순간 속에서 영혼의 진실과 본질 발견하기',
    literaryInsight: '조이스는 《더블린 사람들》과 초기 미학론에서 "에피파니(Epiphany)"를 일상적인 사물이나 짧은 대화, 스쳐 지나가는 인상이 갑작스럽게 영적 진실로 환하게 밝혀지는 순간으로 정의했습니다. 진리는 저 먼 관념 속에 있지 않고, 오늘 마주하는 일상의 세부 속에 숨어 있습니다.',
    practicalCounsel: '지루하거나 사소해 보이는 일상이라고 해서 무심코 지나치지 마십시오. 당신의 일상 속 작은 사건과 스쳐 가는 마음에 깊이 주의를 기울일 때, 삶의 방향을 전환할 결정적 깨달음의 불꽃이 타오릅니다.',
  },
  {
    themeKey: 'forgeInSoulSmithy',
    themeTitleEn: 'Forge in the Smithy of My Soul: Uncompromising Creative Independence',
    themeTitleKo: '영혼의 대장간 — 편견과 그물을 벗어나 나만의 온전한 주체성을 담금질하기',
    literaryInsight: '《젊은 예술가의 초상》에서 스티븐 디덜러스는 자신을 얽매는 관습과 가족, 교조적 통념의 그물을 뚫고 선언합니다. "환영한다, 오 생명이여! 나는 수백만 번의 경험의 현실과 조우하기 위해 나아가며, 내 영혼의 대장간에서 아직 창조되지 않은 내 민족의 양심을 벼려내리라."',
    practicalCounsel: '주변의 기대나 관성에 타협하여 당신의 개성을 축소하지 마십시오. 고독과 낯선 방황을 두려워하지 않고 당신 영혼의 대장간에서 진솔한 가치를 벼려낼 때 당신만의 위대한 독창성이 완성됩니다.',
  },
  {
    themeKey: 'bloomCompassion',
    themeTitleEn: 'Leopold Bloom’s Odyssey: Quiet Kindness and Forbearance Navigating the Urban Labyrinth',
    themeTitleKo: '블룸의 오디세이 — 도시의 소음과 오해 속에서도 조용한 친절과 관용 지키기',
    literaryInsight: '《율리시스》의 영웅 레오폴드 블룸은 고대 전사 오디세우스와 달리 평범한 광고 외판원입니다. 거친 도시의 적대감과 편견 앞에서도 그는 주먹을 쥐지 않고, 길 잃은 고양이를 돌보며 상처 입은 청년 스티븐을 따스하게 보살피는 "작지만 거룩한 인간성"으로 하루의 거대한 오디세이를 승리로 이끕니다.',
    practicalCounsel: '세상의 각박함과 타인의 냉대에 거칠게 맞대응하지 마십시오. 묵묵한 인내와 은근한 친절, 상대를 향한 배려를 잃지 않는 것만으로도 당신은 삶이라는 거대한 미로를 가장 품격 있게 통과할 수 있습니다.',
  },
  {
    themeKey: 'mollyYesAffirmation',
    themeTitleEn: 'Molly Bloom’s Unconditional Yes: Cosmic Acceptance and Joyful Embrace of Existence',
    themeTitleKo: '절대적 긍정의 Yes — 삶의 모든 환희와 비탄을 온몸으로 껴안는 우주적 수용',
    literaryInsight: '《율리시스》의 대미를 장식하는 몰리 블룸의 40페이지 무구두점 독백은 생명의 원초적 긍정으로 가득 차 있습니다. 삶의 모순과 상처에도 불구하고 그녀는 밤하늘과 대지, 과거의 첫 키스를 회상하며 모든 호흡을 담아 긍정합니다. "...그리고 나는 그에게 말했어요 그래요 나는 할 거예요 그래요."',
    practicalCounsel: '과거의 후회나 미래의 결핍에 매여 현재를 부정하지 마십시오. 지금까지 당신이 걸어온 모든 길, 아픔과 기쁨을 한 호흡으로 긍정하고 "그래, 나는 살아갈 것이다"라고 선언할 때 삶은 다시 찬란한 생명력으로 화답합니다.',
  },
];

export const JOYCE_APHORISMS: JoyceAphorism[] = [
  {
    aphorismKey: 'yesIWillYesQuote',
    aphorismKo: '그리고 나는 생각했어요. 그가 아니면 다른 누구라도 어떠하리. 그러고는 눈으로 다시 청해 달라고 그에게 말했어요. 그래요. 그러자 그는 내게 청했어요. 내가 그래요라고 말할 것인지. 나의 산꽃이여. 그리고 나는 먼저 그를 끌어안았어요. 그래요. 그리고 그를 내게로 끌어당겼어요. 그가 내 가슴의 향기를 느낄 수 있도록. 그의 심장은 미친 듯이 뛰었고, 그래요 나는 말했어요 그래요 나는 할 거예요 그래요.',
    aphorismOriginal: 'and I thought well as well him as another and then I asked him with my eyes to ask again yes and then he asked me would I yes to say yes my mountain flower and first I put my arms around him yes and drew him down to me so he could feel my breasts all perfume yes and his heart was going like mad and yes I said yes I will Yes.',
    sourceContext: '《율리시스(Ulysses)》 제18장 페넬로페 (몰리 블룸의 마지막 독백)',
    actionGuidance: '냉소와 두려움을 거두고, 삶이 건네는 모든 경험과 인연을 향해 뜨거운 가슴으로 "Yes"를 선언하십시오.',
  },
  {
    aphorismKey: 'forgeSoulSmithyQuote',
    aphorismKo: '환영한다, 오 생명이여! 나는 수백만 번의 경험의 현실과 조우하기 위해 나아가며, 내 영혼의 대장간에서 아직 창조되지 않은 내 민족의 양심을 벼려내리라.',
    aphorismOriginal: 'Welcome, O life! I go to encounter for the millionth time the reality of experience and to forge in the smithy of my soul the uncreated conscience of my race.',
    sourceContext: '《젊은 예술가의 초상(A Portrait of the Artist as a Young Man)》 제5장 (스티븐 디덜러스의 일기)',
    actionGuidance: '외부의 타성에서 벗어나, 당신의 깊은 내면에서 당신만의 고유한 철학과 기준을 주체적으로 벼려내십시오.',
  },
  {
    aphorismKey: 'mistakesPortalsQuote',
    aphorismKo: '한 인간의 실수는 그의 탐구의 문이다.',
    aphorismOriginal: 'A man of genius makes no mistakes. His errors are volitional and are the portals of discovery.',
    sourceContext: '《율리시스(Ulysses)》 제9장 스킬라와 카리브디스 (스티븐 디덜러스의 논변)',
    actionGuidance: '시행착오를 실패로 단정하지 마십시오. 실수 속에 숨겨진 새로운 통찰을 발견의 통로로 삼아 도약하십시오.',
  },
  {
    aphorismKey: 'snowGeneralQuote',
    aphorismKo: '눈은 온 아일랜드에 희미하게 내리고 있었다. 그리고 가브리엘의 영혼은 희미하게 기절해 가고 있었다. 그가 우주 전체에 눈이 비스듬히 내리는 소리를 들었을 때, 모든 산 자와 죽은 자 위에 최후의 날처럼 내리는 눈 소리를.',
    aphorismOriginal: 'His soul swooned slowly as he heard the snow falling faintly through the universe and faintly falling, like the descent of their last end, upon all the living and the dead.',
    sourceContext: '《더블린 사람들(Dubliners)》 〈죽은 자들(The Dead)〉의 대미',
    actionGuidance: '자기중심적인 오만을 내려놓고, 모든 살아 숨 쉬는 이들과 지나간 인연들을 감싸 안는 깊은 연민의 눈길을 회복하십시오.',
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

export function calculateIrishJamesJoyceUlyssesEpiphany(
  profile?: UserProfile,
  query?: string,
): IrishJamesJoyceUlyssesEpiphanyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `JOYCE-ULYSSES-EPIPHANY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const epiphanyEverydayRevelationScore = 91 + ((absHash >> 1) % 8);
  const streamOfConsciousnessLibertyIndex = 90 + ((absHash >> 4) % 9);
  const daedalianArtisticAutonomyScore = 89 + ((absHash >> 7) % 10);
  const odysseyCompassionateReconciliationIndex = 88 + ((absHash >> 10) % 11);
  const vitalYesCosmicAffirmationScore = 92 + ((absHash >> 13) % 7);

  const themeIndex = (absHash >> 5) % JOYCE_THEMES.length;
  const aphorismIndex = (absHash >> 8) % JOYCE_APHORISMS.length;

  const activeJoyceTheme = JOYCE_THEMES[themeIndex];
  const focalJoyceAphorism = JOYCE_APHORISMS[aphorismIndex];

  const guidanceTitle = `제임스 조이스 에피파니와 실존적 긍정: ${activeJoyceTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 모더니즘 문학의 거장 제임스 조이스 선생은 《율리시스》와 《젊은 예술가의 초상》을 통해 ` +
    `평범한 일상 속에서 영혼의 본질이 번쩍이는 에피파니의 직관, 통념의 그물을 뚫고 영혼의 대장간에서 자아를 벼려내는 독립성, ` +
    `도시의 미로 속에서도 조용한 친절을 잃지 않는 오디세이적 연민, 그리고 마침내 삶의 모든 환희와 시련을 향해 "Yes"를 외치는 불굴의 실존 긍정을 일깨웠습니다. ` +
    `지금 당신의 마음에 가장 필요한 지혜는 '${activeJoyceTheme.themeTitleKo}'입니다. ` +
    `${activeJoyceTheme.practicalCounsel} 조이스의 불멸의 원전 격언 "${focalJoyceAphorism.aphorismKo}"을 마음에 품고, ` +
    `${focalJoyceAphorism.actionGuidance}`;

  return {
    engineVersion: IRISH_JAMES_JOYCE_ULYSSES_EPIPHANY_VERSION,
    calculatedAtKst: new Date().toISOString(),
    epiphanyEverydayRevelationScore,
    streamOfConsciousnessLibertyIndex,
    daedalianArtisticAutonomyScore,
    odysseyCompassionateReconciliationIndex,
    vitalYesCosmicAffirmationScore,
    activeJoyceTheme,
    focalJoyceAphorism,
    joyceComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatIrishJamesJoyceUlyssesEpiphanyPrompt(
  res: IrishJamesJoyceUlyssesEpiphanyResult,
): string {
  return [
    `【제임스 조이스 《율리시스·젊은 예술가의 초상》 에피파니·실존적 긍정 지표】`,
    `- 일상 속 영혼의 에피파니 직관도(Everyday Epiphany Revelation): ${res.epiphanyEverydayRevelationScore}/100`,
    `- 의식의 흐름과 내면 자유 개척 지수(Stream of Consciousness Liberty): ${res.streamOfConsciousnessLibertyIndex}/100`,
    `- 미로 탈출 다이달로스 예술적 자율성(Daedalian Soul Smithy Autonomy): ${res.daedalianArtisticAutonomyScore}/100`,
    `- 오디세이 대자비 화해 지수(Odyssey Compassionate Reconciliation): ${res.odysseyCompassionateReconciliationIndex}/100`,
    `- 우주적 "Yes" 실존 긍정 회복탄력성(Vital "Yes" Cosmic Affirmation): ${res.vitalYesCosmicAffirmationScore}/100`,
    `- 핵심 조이스 테마: ${res.activeJoyceTheme.themeTitleKo} [${res.activeJoyceTheme.themeTitleEn}]`,
    `- 문학적 사색: ${res.activeJoyceTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeJoyceTheme.practicalCounsel}`,
    `- 조이스 원전 명대사: "${res.focalJoyceAphorism.aphorismKo}"`,
    `- 원문: (${res.focalJoyceAphorism.aphorismOriginal})`,
    `- 원전 출처: [${res.focalJoyceAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalJoyceAphorism.actionGuidance}`,
    `- 종합 조이스 권면: ${res.joyceComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
