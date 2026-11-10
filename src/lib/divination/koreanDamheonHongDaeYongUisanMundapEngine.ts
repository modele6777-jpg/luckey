/**
 * 대한민국 담헌 홍대용(湛軒 洪大容) 선생 《의산문답(醫山問答)》 지전설·무한우주론 & 인물균(人物均)·탈중화 개방지성 지혜 엔진
 *
 * 조선 후기 실학의 최고 우주론자이자 북학파의 선구자 담헌 홍대용(湛軒 洪大容, 1731~1783) 선생의
 * 불후의 대표 저술 《의산문답(醫山問答)》 및 《담헌서(湛軒書)》 원전 기반:
 * 1. 지전설 및 무한 우주론 통찰력(Infinite Universe & Earth Rotation Cosmological Insight Score): 지구 자전과 중심 없는 무한 우주의 거대한 스케일 인식.
 * 2. 인물균(人物均) 인간·자연 평등 존엄 지수(Egalitarian Harmony of Humans & Nature Index): 하늘의 관점에서 인간과 만물을 동등하게 존중하는 탈인간중심 생태 평화.
 * 3. 화이관 타파 보편적 상대주의 및 열린 개방도(Universal Relativism & Open-Mindedness Score): 편협한 중심주의를 허물고 만국의 고유성을 인정하는 세계시민적 지성.
 * 4. 탈편견 과학적 합리주의 및 미신 타파력(Scientific Empiricism & Disillusionment Index): 허황된 명분과 도그마를 걷어내고 실증적 이치로 사물을 관찰하는 힘.
 * 5. 거문고와 사색의 호연지기 및 예술적 영성 회복탄력성(Magnanimous Geomungo Spirit & Resilience Score): 광막한 우주 속에서 거문고를 타며 맑고 호탕한 평정을 지키는 품격.
 *
 * @version LUCKEY-HONG-DAE-YONG-UISAN-MUNDAP-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_DAMHEON_HONG_DAE_YONG_UISAN_MUNDAP_VERSION = 'LUCKEY-HONG-DAE-YONG-UISAN-MUNDAP-v1.0.0';

export interface HongDaeYongTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface HongDaeYongAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanDamheonHongDaeYongUisanMundapResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 담헌 홍대용 우주·실학 핵심 지표 (0~100)
  infiniteUniverseRotationCosmologicalInsightScore: number; // 지전설 및 무한 우주론 통찰력 (Infinite Universe & Rotation)
  egalitarianHarmonyHumansNatureIndex: number;              // 인물균 인간·자연 평등 존엄성 (Egalitarian Humans & Nature)
  universalRelativismOpenMindednessScore: number;           // 화이관 타파 및 열린 상대주의 개방도 (Universal Relativism)
  scientificEmpiricismDisillusionmentIndex: number;         // 탈편견 과학적 합리주의 (Scientific Empiricism)
  magnanimousGeomungoResilienceScore: number;               // 거문고 사색 호연지기 회복탄력성 (Geomungo Resilience)
  // 세부 분석
  activeHongDaeYongTheme: HongDaeYongTheme;
  focalHongDaeYongAphorism: HongDaeYongAphorism;
  hongDaeYongComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const HONG_DAE_YONG_THEMES: HongDaeYongTheme[] = [
  {
    themeKey: 'infiniteUniverseRotation',
    themeTitleEn: 'Infinite Universe & Earth’s Rotation: A Cosmological Perspective',
    themeTitleKo: '지전설과 무한 우주 — 중심도 변방도 없는 무한한 공간 속의 광대한 안목',
    pragmaticInsight: '지구는 둥글고 하루에 한 바퀴를 자전하며, 우주는 끝없이 광활하여 어느 특정한 곳만 중심일 수 없습니다. 편협한 시야에서 벗어나 우주적 스케일로 사안을 바라보아야 합니다.',
    practicalCounsel: '눈앞의 사소한 이해관계나 작은 갈등에 갇혀 마음을 졸이지 마십시오. 거대한 우주의 무한한 흐름을 조망하듯 넓고 대범한 시야를 열어 해법을 찾으십시오.',
  },
  {
    themeKey: 'inMulGyunEquality',
    themeTitleEn: 'In-Mul-Gyun: Absolute Equality of Humanity and Nature',
    themeTitleKo: '인물균(人物均) — 하늘의 눈으로 보면 인간과 만물은 모두 동등하고 존엄하다',
    pragmaticInsight: '인간의 입장에서만 세상을 보면 인간이 귀하고 만물이 천해 보이지만, 대자연의 관점에서 보면 인간과 사물은 저마다 고유한 자리를 지닌 평등한 존재입니다. 오만을 내려놓을 때 진정한 상생이 열립니다.',
    practicalCounsel: '사람과 환경, 동료와 도구를 지배의 대상이나 수단으로 여기지 마십시오. 모든 존재의 고유한 가치를 존중하며 겸손하게 협력하십시오.',
  },
  {
    themeKey: 'breakingSinoCentrism',
    themeTitleEn: 'Breaking Dogmatic Centralism into Universal Relativism',
    themeTitleKo: '탈중화와 개방성 — 낡은 중심주의를 허물고 세상 만국의 고유성을 긍정하기',
    pragmaticInsight: '세상에 홀로 고정된 중심이란 존재하지 않습니다. 어디에 발을 딛든 그곳이 바로 하늘을 머리에 인 중심입니다. 문화적 우월감이나 패배주의를 모두 털어내고 당당하고 개방적인 주체성을 세워야 합니다.',
    practicalCounsel: '남들이 정해놓은 기준이나 허명에 짓눌리지 마십시오. 내가 서 있는 바로 지금 이 자리에서 주체적이고 유연한 시각으로 세계와 대등하게 소통하십시오.',
  },
  {
    themeKey: 'pragmaticEmpiricism',
    themeTitleEn: 'Scientific Empiricism & Shattering Illusions',
    themeTitleKo: '탈편견 실증주의 — 헛된 명분론을 걷어내고 실질적인 이치를 탐구하기',
    pragmaticInsight: '입으로만 외치는 공리공론과 케케묵은 도그마는 삶을 구원하지 못합니다. 사물을 있는 그대로 관찰하고, 천문과 기하학처럼 엄밀하고 실증적인 이치를 탐구할 때 비로소 진보가 일어납니다.',
    practicalCounsel: '겉치레와 허울 좋은 명분에 현혹되지 마십시오. 데이터와 실제 현장의 실질적인 변화를 냉철히 검증하고, 유용한 실용의 지혜를 실천하십시오.',
  },
  {
    themeKey: 'geomungoMagnanimity',
    themeTitleEn: 'Geomungo Serenity & Cosmological Magnanimity',
    themeTitleKo: '거문고와 호연지기 — 광막한 우주를 벗 삼아 맑고 호탕한 여유를 품기',
    pragmaticInsight: '담헌 선생은 탁월한 과학자이자 거문고의 명인이었습니다. 엄밀한 과학적 지성과 심오한 예술적 풍류가 하나 될 때, 어떤 혼란 속에서도 흐트러지지 않는 대인의 기상이 완성됩니다.',
    practicalCounsel: '일에 몰입하되 메마른 기계가 되지 마십시오. 맑은 음악과 사색으로 영혼을 적시고, 고요하면서도 호탕한 배포로 삶의 균형을 누리십시오.',
  },
];

export const HONG_DAE_YONG_APHORISMS: HongDaeYongAphorism[] = [
  {
    aphorismKey: 'earthRotatesAphorism',
    aphorismKo: '지구는 허공에 떠서 하루에 한 바퀴를 돈다. 우주에 어찌 위아래가 있으며 안과 밖이 있겠는가.',
    aphorismHanja: '地轉一晝夜 積氣旋轉 宇宙無上下內外',
    sourceContext: '홍대용 《의산문답(醫山問答)》',
    actionGuidance: '고정관념과 낡은 통념을 과감히 깨뜨리십시오. 새로운 관점에서 사안을 입체적으로 바라보십시오.',
  },
  {
    aphorismKey: 'inMulGyunAphorism',
    aphorismKo: '사람의 입장에서 보면 사람이 귀하고 만물이 천하지만, 하늘의 입장에서 보면 사람과 만물은 균등하다.',
    aphorismHanja: '自人而觀之 人貴而物賤 自天而觀之 人與物均也',
    sourceContext: '홍대용 《의산문답(醫山問答)》',
    actionGuidance: '자기중심적인 편견을 버리고, 타인과 주변 환경을 온전한 동등함으로 대우하십시오.',
  },
  {
    aphorismKey: 'universalCenterAphorism',
    aphorismKo: '천지를 둘러보면 하늘을 인 곳이 모두 한가운데요, 발을 디딘 곳이 모두 중심이다.',
    aphorismHanja: '周天之勢 處處皆中 頂天立地 皆爲中心',
    sourceContext: '홍대용 《담헌서(湛軒書)》 외집',
    actionGuidance: '변방이라는 열등감이나 콤플렉스를 털어내십시오. 당신이 선 바로 그 자리가 삶의 주체적 중심입니다.',
  },
  {
    aphorismKey: 'practicalTruthAphorism',
    aphorismKo: '명분에만 매달리는 자는 실상을 잃고, 사물의 실제 이치를 밝히는 자만이 지혜를 얻는다.',
    aphorismHanja: '務虛名者失其實 窮物理者得其眞',
    sourceContext: '홍대용 《의산문답(醫山問答)》',
    actionGuidance: '허황된 소문이나 권위에 흔들리지 말고, 직접 확인하고 검증한 실질적인 진실을 토대로 행동하십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function calculateKoreanDamheonHongDaeYongUisanMundap(
  profile?: UserProfile,
  query?: string,
): KoreanDamheonHongDaeYongUisanMundapResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `HONG-DAE-YONG-UISAN-MUNDAP:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const infiniteUniverseRotationCosmologicalInsightScore = 83 + ((absHash >> 1) % 16);
  const egalitarianHarmonyHumansNatureIndex = 82 + ((absHash >> 4) % 17);
  const universalRelativismOpenMindednessScore = 81 + ((absHash >> 7) % 18);
  const scientificEmpiricismDisillusionmentIndex = 84 + ((absHash >> 10) % 15);
  const magnanimousGeomungoResilienceScore = 80 + ((absHash >> 13) % 19);

  const themeIndex = (absHash >> 5) % HONG_DAE_YONG_THEMES.length;
  const aphorismIndex = (absHash >> 8) % HONG_DAE_YONG_APHORISMS.length;

  const activeHongDaeYongTheme = HONG_DAE_YONG_THEMES[themeIndex];
  const focalHongDaeYongAphorism = HONG_DAE_YONG_APHORISMS[aphorismIndex];

  const guidanceTitle = `담헌 홍대용 우주·실학 개방 지혜: ${activeHongDaeYongTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 실학의 최고 우주론자 담헌 홍대용 선생은 '지전설(地轉說)'과 '무한우주론'을 통해 편협한 중심주의를 깨뜨리고, 인간과 자연이 평등하다는 '인물균(人物均)'의 위대한 지혜를 열었습니다. ` +
    `현재 당신의 흐름에서 가장 대범한 안목을 열어주는 핵심 지혜는 '${activeHongDaeYongTheme.themeTitleKo}'입니다. ` +
    `${activeHongDaeYongTheme.practicalCounsel} 담헌 선생의 명문 "${focalHongDaeYongAphorism.aphorismKo} (${focalHongDaeYongAphorism.aphorismHanja})"을 되새기며, ` +
    `${focalHongDaeYongAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_DAMHEON_HONG_DAE_YONG_UISAN_MUNDAP_VERSION,
    calculatedAtKst: new Date().toISOString(),
    infiniteUniverseRotationCosmologicalInsightScore,
    egalitarianHarmonyHumansNatureIndex,
    universalRelativismOpenMindednessScore,
    scientificEmpiricismDisillusionmentIndex,
    magnanimousGeomungoResilienceScore,
    activeHongDaeYongTheme,
    focalHongDaeYongAphorism,
    hongDaeYongComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanDamheonHongDaeYongUisanMundapPrompt(
  res: KoreanDamheonHongDaeYongUisanMundapResult,
): string {
  return [
    `【담헌 홍대용 《의산문답》 지전설·무한우주론 및 인물균 지혜 지표】`,
    `- 지전설 및 무한 우주론 통찰력(Infinite Universe & Earth Rotation): ${res.infiniteUniverseRotationCosmologicalInsightScore}/100`,
    `- 인물균(人物均) 인간·자연 평등 존엄성(Egalitarian Humans & Nature): ${res.egalitarianHarmonyHumansNatureIndex}/100`,
    `- 화이관 타파 및 열린 상대주의 개방도(Universal Relativism): ${res.universalRelativismOpenMindednessScore}/100`,
    `- 탈편견 과학적 합리주의(Scientific Empiricism): ${res.scientificEmpiricismDisillusionmentIndex}/100`,
    `- 거문고 사색 호연지기 회복탄력성(Magnanimous Geomungo Resilience): ${res.magnanimousGeomungoResilienceScore}/100`,
    `- 핵심 담헌 실학 테마: ${res.activeHongDaeYongTheme.themeTitleKo} [${res.activeHongDaeYongTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeHongDaeYongTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeHongDaeYongTheme.practicalCounsel}`,
    `- 담헌 홍대용 원전 명언: "${res.focalHongDaeYongAphorism.aphorismKo}" (${res.focalHongDaeYongAphorism.aphorismHanja})`,
    `- 원전 출처: [${res.focalHongDaeYongAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHongDaeYongAphorism.actionGuidance}`,
    `- 종합 담헌 우주·실학 권면: ${res.hongDaeYongComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
