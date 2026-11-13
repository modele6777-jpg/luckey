/**
 * 대한민국 박경리(Park Kyung-ni) 대하소설 《토지(土地)》 대지 생명사상·한(恨)의 승화 및 주체적 자립 지혜 엔진
 *
 * 한국 현대문학의 거대한 봉우리이자 생명사상의 대철학자 박경리(1926~2008) 선생의 원전 기반:
 * 1. 대하소설 토지 대지 생명사상 및 존엄도 (Toji Great Earth Life Reverence & Dignity Score): 흙과 대지에서 피어나는 삼라만상의 원초적 생명력을 긍정하고, 어떤 비극 속에서도 훼손되지 않는 인간 존재의 숭고한 존엄성.
 * 2. 비탄과 슬픔을 삭여 삶을 일구는 한(恨)의 생명력 승화 지수 (Han Transmutation & Vital Creative Energy Index): 뼈아픈 상처와 원통함을 타인을 향한 파괴적 원한으로 터뜨리지 않고, 자신을 단련하고 생명을 보듬는 거룩한 창조적 에너지로 승화시키는 내공.
 * 3. 명운을 짊어지고 운명을 개척하는 최서희적 주체 자립도 (Choi Seo-hee Sovereign Autonomy & Destiny Forging Score): 가문의 몰락과 시대의 폭풍우 속에서도 비굴하게 구걸하지 않고, 스스로 자신의 운명을 지휘하며 기어이 명운을 바로 세우는 당당한 주권자의 기백.
 * 4. 자연과 뭇 생명에 대한 경외와 유기적 공존 윤리 지표 (Organic Cosmic Coexistence & Reverence for Life Index): 인간 중심의 오만을 버리고 벌레와 풀 한 포기, 이웃의 고통까지 한 몸처럼 아끼는 우주적 자비와 공존의 지혜.
 * 5. 척박한 땅에서도 끝끝내 싹을 틔우는 불굴의 대지적 회복탄력성 (Great Earth Indomitable Regeneration & Resilience Score): 가뭄과 혹한 속에서도 땅속 깊이 뿌리를 내리고 봄날의 새싹을 틔워내는 대지의 어머니와 같은 무한한 생명 회복탄력성.
 *
 * @version LUCKEY-PARK-KYUNG-NI-TOJI-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_PARK_KYUNG_NI_TOJI_VERSION = 'LUCKEY-PARK-KYUNG-NI-TOJI-v1.0.0';

export interface ParkKyungNiTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface ParkKyungNiAphorism {
  aphorismKey: string;
  aphorismKo: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanParkKyungNiTojiLifeSovereigntyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 박경리 핵심 지표 (0~100)
  tojiGreatEarthLifeDignityScore: number;                 // 대지 생명사상 존엄도
  hanTransmutationVitalityIndex: number;                  // 한(恨)의 생명력 승화 지수
  seoiSovereignAutonomyScore: number;                     // 최서희적 주체 자립도
  organicCosmicCoexistenceIndex: number;                  // 유기적 공존 윤리 지표
  unyieldingRootedResilienceScore: number;                // 불굴의 대지적 회복탄력성
  // 세부 분석
  activeParkKyungNiTheme: ParkKyungNiTheme;
  focalParkKyungNiAphorism: ParkKyungNiAphorism;
  parkKyungNiComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const PARK_KYUNG_NI_THEMES: ParkKyungNiTheme[] = [
  {
    themeKey: 'earthLifeReverence',
    themeTitleEn: 'Great Earth and Sacred Life: Inviolable Dignity Beyond Suffering',
    themeTitleKo: '대지와 신성한 생명 — 고난을 딛고 피어나는 생명의 거룩한 존엄과 경외',
    literaryInsight: '박경리 선생은 26년에 걸쳐 집필한 5부 16권의 대하소설 《토지》와 만년의 생명사상에서, 삶이란 관념적 유희가 아니라 흙에 발을 딛고 피와 땀으로 일구는 대지적 실존임을 천명했습니다. 어떤 시대적 억압도 생명의 존엄을 꺾을 수 없습니다.',
    practicalCounsel: '화려한 세속의 겉치레나 타인의 피상적인 평가에 일희일비하지 마십시오. 당신의 삶을 대지처럼 우직하고 성실하게 한 걸음씩 다져갈 때, 그 어떤 모진 풍파 속에서도 흔들리지 않는 단단한 뿌리가 내립니다.',
  },
  {
    themeKey: 'hanTransmutation',
    themeTitleEn: 'Transmutation of Han: Turning Sorrow into Indomitable Creative Vitality',
    themeTitleKo: '한(恨)의 거룩한 삭임 — 슬픔과 비탄을 삶을 다시 일으키는 생명력으로 승화하기',
    literaryInsight: '선생이 통찰한 한민족의 한(恨)은 패배주의적 원망이 아닙니다. 가슴을 에는 시련과 억울함을 깊은 침묵 속에서 삭이고 삭여, 기어이 자신을 단련하고 이웃을 품어 안는 눈부신 생명 창조의 동력으로 돌려세우는 위대한 영혼의 연금술입니다.',
    practicalCounsel: '지나간 상처나 억울한 일에 사로잡혀 에너지를 복수나 비탄으로 낭비하지 마십시오. 그 아픔을 당신의 그릇을 넓히고 성숙한 인격을 완성하는 밑거름으로 삼아 더 담대하고 의연하게 미래를 개척하십시오.',
  },
  {
    themeKey: 'seoheeSovereignty',
    themeTitleEn: 'Seo-hee’s Sovereignty: Uncompromising Autonomy and Steadfast Determination',
    themeTitleKo: '최서희의 당당한 주권 — 파멸의 폐허 속에서도 비굴하지 않게 운명을 주도하기',
    literaryInsight: '《토지》의 주인공 최서희는 어린 나이에 부모를 잃고 가문이 풍비박산 나는 참극 속에서도 단 한 번도 눈물을 보이며 구걸하지 않았습니다. 칼날 같은 결기와 냉철한 혜안으로 간도의 모진 세월을 견뎌내며 빼앗긴 토지와 가문의 존엄을 제 손으로 되찾았습니다.',
    practicalCounsel: '어려운 국면에 처했다고 해서 스스로를 피해자로 규정하거나 동정을 바라지 마십시오. 당신 삶의 주권자는 오직 당신 자신입니다. 꼿꼿한 자존심과 냉철한 현실 감각으로 사태를 직시하고 당당하게 주도권을 쥐십시오.',
  },
  {
    themeKey: 'motherEarthResilience',
    themeTitleEn: 'Mother Earth’s Boundless Regeneration: Spring Buds Bursting Through Winter Frost',
    themeTitleKo: '대지 어머니의 무한 재생력 — 혹한의 땅속에서 봄날의 찬란한 새싹을 틔우기',
    literaryInsight: '선생은 말했습니다. "생명이 있는 한 절망이란 없다. 대지는 겨울 내내 얼어붙어 죽은 듯 보이지만, 봄이 오면 반드시 새 생명을 뿜어 올린다." 자연의 질서와 끈질긴 민초들의 생명력이야말로 인류가 가진 최고의 자산입니다.',
    practicalCounsel: '지금 당장 일이 뜻대로 풀리지 않고 캄캄한 겨울밤처럼 느껴지더라도 조급해하거나 체념하지 마십시오. 대지 속에서 조용히 내실을 다지며 힘을 기르면, 때가 이르렀을 때 상상 이상으로 거대한 도약의 싹이 움틀 것입니다.',
  },
];

export const PARK_KYUNG_NI_APHORISMS: ParkKyungNiAphorism[] = [
  {
    aphorismKey: 'liberationTearsQuote',
    aphorismKo: '서희는 흰 수건에 얼굴을 묻었다. ... 어두운 방 안에서 서희는 흐느껴 울었다. 사십 년의 긴 세월 동안 단 한 번도 남 앞에서 보이지 않았던 눈물이 비로소 쏟아져 내렸다. 일본이 무조건 항복한 것이다.',
    sourceContext: '대하소설 《토지(土地)》 제5부 대단원 광복의 순간',
    actionGuidance: '긴 시련의 터널 속에서도 결코 주권을 포기하지 마십시오. 끝까지 존엄을 지켜낸 자만이 마침내 진정한 승리와 해방의 감격을 맛보게 됩니다.',
  },
  {
    aphorismKey: 'lifeSoulRespectQuote',
    aphorismKo: '생명은 그 자체가 스스로를 증명하는 우주적 기적이다. 풀 한 포기, 벌레 한 마리도 함부로 대할 수 없는 것은 그 안에 우주의 영혼이 깃들어 있기 때문이다.',
    sourceContext: '산문집 《생명의 넋》 및 《원주통신》 철학 사색',
    actionGuidance: '오만과 조급함을 버리고, 모든 만물과 맺는 관계에서 깊은 경외와 정성을 다하십시오.',
  },
  {
    aphorismKey: 'povertyDignityQuote',
    aphorismKo: '가난한 것은 부끄러운 일이 아니다. 부끄러운 것은 비굴한 것이다. 당당하게 노동하고 정직하게 자기 몫의 삶을 견뎌내는 자는 언제나 존엄하다.',
    sourceContext: '문학 강연 및 자전적 대담록',
    actionGuidance: '외적인 소유나 사회적 지위로 스스로를 위축시키지 말고, 정직한 땀과 당당한 품격으로 삶의 위엄을 증명하십시오.',
  },
  {
    aphorismKey: 'workEarthSincerityQuote',
    aphorismKo: '글을 쓰는 것은 밭을 가는 일과 같다. 흙을 속일 수 없듯 문장도 영혼도 결코 속일 수 없다. 오직 지극한 정성만이 사람의 마음을 울린다.',
    sourceContext: '작가의 말 및 창작 소고',
    actionGuidance: '요행이나 잔꾀를 바라지 말고, 매일의 일상에서 묵묵히 밭을 갈듯 정성을 다해 당신의 기반을 닦으십시오.',
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

export function calculateKoreanParkKyungNiTojiLifeSovereignty(
  profile?: UserProfile,
  query?: string,
): KoreanParkKyungNiTojiLifeSovereigntyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `PARK-KYUNG-NI-TOJI:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const tojiGreatEarthLifeDignityScore = 93 + ((absHash >> 1) % 6);
  const hanTransmutationVitalityIndex = 91 + ((absHash >> 4) % 8);
  const seoiSovereignAutonomyScore = 94 + ((absHash >> 7) % 6);
  const organicCosmicCoexistenceIndex = 90 + ((absHash >> 10) % 9);
  const unyieldingRootedResilienceScore = 95 + ((absHash >> 13) % 5);

  const themeIndex = (absHash >> 5) % PARK_KYUNG_NI_THEMES.length;
  const aphorismIndex = (absHash >> 8) % PARK_KYUNG_NI_APHORISMS.length;

  const activeParkKyungNiTheme = PARK_KYUNG_NI_THEMES[themeIndex];
  const focalParkKyungNiAphorism = PARK_KYUNG_NI_APHORISMS[aphorismIndex];

  const guidanceTitle = `박경리 대하소설 토지 대지 생명사상과 주체적 자립: ${activeParkKyungNiTheme.themeTitleKo}`;
  const philosophicalCounsel = `한국 현대문학의 위대한 거목 박경리 선생은 26년의 대작 《토지》를 통해 ` +
    `어떤 비극 속에서도 훼손될 수 없는 인간의 숭고한 대지적 생명 존엄, 뼈아픈 한(恨)을 삭여 삶을 다시 일구는 창조적 승화의 힘, ` +
    `폭풍우 앞에서도 비굴하지 않게 자신의 운명을 개척하는 최서희적 당당한 주권, 그리고 척박한 땅속에서도 기어이 봄날의 새싹을 틔우는 불굴의 대지적 회복탄력성을 가르쳤습니다. ` +
    `지금 당신의 마음에 가장 굳건히 세워야 할 지혜는 '${activeParkKyungNiTheme.themeTitleKo}'입니다. ` +
    `${activeParkKyungNiTheme.practicalCounsel} 박경리 선생의 원전 격언 "${focalParkKyungNiAphorism.aphorismKo}"을 마음에 단단히 품고, ` +
    `${focalParkKyungNiAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_PARK_KYUNG_NI_TOJI_VERSION,
    calculatedAtKst: new Date().toISOString(),
    tojiGreatEarthLifeDignityScore,
    hanTransmutationVitalityIndex,
    seoiSovereignAutonomyScore,
    organicCosmicCoexistenceIndex,
    unyieldingRootedResilienceScore,
    activeParkKyungNiTheme,
    focalParkKyungNiAphorism,
    parkKyungNiComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanParkKyungNiTojiLifeSovereigntyPrompt(
  res: KoreanParkKyungNiTojiLifeSovereigntyResult,
): string {
  return [
    `【박경리 대하소설 《토지(土地)》 대지 생명사상 및 주체적 자립 지표】`,
    `- 대하소설 토지 대지 생명사상 존엄도(Toji Great Earth Life Dignity): ${res.tojiGreatEarthLifeDignityScore}/100`,
    `- 비탄 삭임 한(恨)의 생명력 승화 지수(Han Transmutation Vitality): ${res.hanTransmutationVitalityIndex}/100`,
    `- 최서희적 주체 자립도(Choi Seo-hee Sovereign Autonomy): ${res.seoiSovereignAutonomyScore}/100`,
    `- 유기적 공존 윤리 지표(Organic Cosmic Coexistence): ${res.organicCosmicCoexistenceIndex}/100`,
    `- 불굴의 대지적 회복탄력성(Unyielding Rooted Resilience): ${res.unyieldingRootedResilienceScore}/100`,
    `- 핵심 박경리 테마: ${res.activeParkKyungNiTheme.themeTitleKo} [${res.activeParkKyungNiTheme.themeTitleEn}]`,
    `- 문학적 사색: ${res.activeParkKyungNiTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeParkKyungNiTheme.practicalCounsel}`,
    `- 박경리 원전 명문: "${res.focalParkKyungNiAphorism.aphorismKo}"`,
    `- 원전 출처: [${res.focalParkKyungNiAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalParkKyungNiAphorism.actionGuidance}`,
    `- 종합 박경리 권면: ${res.parkKyungNiComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
