/**
 * 대한민국 이육사(李陸史) 시인 《광야(曠野)》 & 《절정(絶頂)》 강철 무지개 실존의지 지혜 엔진
 *
 * 일제강점기 불굴의 독립투사이자 민족시인 이육사(李陸史, 이원록, 1904~1944) 선생의 불후의 명시
 * 《광야(曠野)》, 《절정(絶頂)》, 《청포도(靑葡萄)》, 《교목(喬木)》, 《꽃》 원전 기반:
 * 1. 매운 계절의 절정 극복 실존 의지(Peak Resilience in Bitter Season Score): "매운 계절의 채찍에 갈겨 마침내 북방으로 휩쓸려오다" 극한의 칼날 위에서도 굴복하지 않는 불굴의 기개.
 * 2. 강철 무지개 실존 초극도(Steel Rainbow Transcendence Index): "겨울은 강철로 된 무지갠가 보다" 비극적 운명과 극한의 절망을 가장 숭고한 예술적 결단과 초월로 승화하는 힘.
 * 3. 백마 탄 초인 영접 소명의식(Visionary Calling of the Hero Score): "다시 천고의 뒤에 백마 타고 오는 초인이 있어 이 광야에서 목놓아 부르게 하리라" 미래를 여는 웅혼한 역사적 소명감.
 * 4. 가난한 노래의 씨앗 파종 실천력(Sowing the Seed of Poor Song Index): "지금 눈 내리고 매화 향기 홀로 아득하니 내 여기 가난한 노래의 씨를 뿌려라" 황무지에 희망과 진실의 싹을 틔우는 선구자적 헌신도.
 * 5. 청포도 결백 순결 지조 지수(Pure Integrity of Cheongpodo Score): "내 고장 칠월은 청포도가 익어가는 시절" 은쟁반 위에 하이얀 모시 수건을 마련하듯 고결한 이상과 신의를 지키는 순결성.
 *
 * @version LUCKEY-LEE-YUK-SA-GWANGYA-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_LEE_YUK_SA_VERSION = 'LUCKEY-LEE-YUK-SA-GWANGYA-v1.0.0';

export interface LeeYukSaTheme {
  themeKey: string;
  themeTitleKo: string;
  themeTitleEn: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface LeeYukSaAphorism {
  aphorismKey: string;
  poemTitleKo: string;
  famousLineKo: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanLeeYukSaGwangyaPeakResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 이육사 강철 무지개 실존 지표 (0~100)
  peakResilienceInBitterSeasonScore: number; // 매운 계절의 절정 극복 실존 의지 (Peak Resilience in Bitter Season)
  steelRainbowTranscendenceIndex: number;    // 강철 무지개 실존 초극도 (Steel Rainbow Transcendence)
  visionaryCallingOfHeroScore: number;       // 백마 탄 초인 영접 소명의식 (Visionary Calling of the Hero)
  sowingPoorSongSeedVirtueIndex: number;     // 가난한 노래의 씨앗 파종 실천력 (Sowing the Seed of Poor Song)
  pureIntegrityCheongpodoScore: number;      // 청포도 결백 순결 지조 지수 (Pure Integrity of Cheongpodo)
  // 세부 분석
  activeLeeYukSaTheme: LeeYukSaTheme;
  focalLeeYukSaAphorism: LeeYukSaAphorism;
  leeYukSaComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const LEE_YUK_SA_THEMES: LeeYukSaTheme[] = [
  {
    themeKey: 'sowing_seed_in_gwangya',
    themeTitleKo: '광야의 선구자: 눈 덮인 황무지에 가난한 노래의 씨를 뿌림',
    themeTitleEn: 'Sowing the Seed of Song in the Wilderness of Gwangya',
    themeInsight: '아득한 옛날 까마득한 하늘이 처음 열린 이래 온갖 시련의 강물이 흘렀습니다. 지금 눈 내리고 매화 향기 홀로 아득할지라도, 선구자는 내일을 기약하며 묵묵히 희망의 씨앗을 대지에 심습니다.',
    practicalCounsel: '주변의 여건이 척박하고 성과가 당장 보이지 않더라도 흔들리지 마십시오. 미래를 여는 진실한 씨앗을 오늘 당신의 자리에서 정성껏 뿌리십시오.',
  } as any,
  {
    themeKey: 'steel_rainbow_at_the_peak',
    themeTitleKo: '절정의 강철 무지개: 칼날 선 얼음 위에서 피워내는 비장한 초월',
    themeTitleEn: 'Gazing at the Steel Rainbow of Transcendence at the Peak',
    themeInsight: '매운 계절의 채찍에 휩쓸려 북방의 서릿발 칼날진 그 위에 설지라도, 진정한 영혼은 무릎을 꿇지 않고 눈을 감아 운명을 강철 같은 무지개로 관조합니다. 극한의 시련은 가장 찬란한 초극의 순간이 됩니다.',
    practicalCounsel: '막다른 골목이나 거센 압박에 직면했을 때 위축되지 마십시오. 절체절명의 위기야말로 당신의 숨겨진 위대한 기개와 예술적 도약이 시작되는 절정입니다.',
  } as any,
  {
    themeKey: 'waiting_for_cheongpodo_guest',
    themeTitleKo: '청포도의 순결한 기다림: 은쟁반에 하이얀 모시 수건을 마련함',
    themeTitleEn: 'Welcoming the Noble Guest with the Pure Heart of Cheongpodo',
    themeInsight: '푸른 바다가 가슴을 열고 흰 돛단배가 밀려오듯, 고단한 몸으로 찾아올 귀한 손님을 위해 정성껏 식탁을 닦고 은반 위에 모시 수건을 올려둡니다. 지조와 순결한 신의는 기다림 속에서 더욱 깊어집니다.',
    practicalCounsel: '마음의 분주함을 가라앉히고 가장 소중한 가치와 사람을 맞이할 준비를 정갈히 하십시오. 맑고 결백한 태도가 뜻밖의 복된 인연과 결실을 이끕니다.',
  } as any,
  {
    themeKey: 'unbending_spirit_of_gyomok',
    themeTitleKo: '교목의 기개: 푸른 하늘을 향해 우뚝 서서 꺾이지 않는 그림자',
    themeTitleEn: 'The Unbending Pride of the Towering Tree under the Blue Sky',
    themeInsight: '세월에 불타고 차라리 봄날 꽃피기를 거부할지라도, 우뚝 솟은 교목은 낡은 타협을 거부하고 푸른 하늘에 닿을 듯 굳건히 서 있습니다. 어떤 폭풍우도 고결한 영혼의 뿌리를 뽑을 수 없습니다.',
    practicalCounsel: '사소한 이익이나 일시적인 유혹 앞에 신념을 굽히지 마십시오. 당신의 높은 긍지와 올곧은 원칙을 지키는 굳건한 태도를 유지하십시오.',
  } as any,
  {
    themeKey: 'fiery_blossom_of_dawn',
    themeTitleKo: '새벽의 꽃: 동방의 새벽빛을 부르는 붉은 열정의 개화',
    themeTitleEn: 'The Fiery Blossom Heralding the Dawn of the East',
    themeInsight: '동방의 하늘이 붉게 물들 때까지 차가운 밤공기를 뚫고 피어나는 한 송이 꽃처럼, 어둠 속에서도 스스로 열정을 불태워 새벽을 부르는 자가 새 시대를 맞이합니다.',
    practicalCounsel: '침체된 분위기에 휩쓸리지 말고 먼저 당신의 가슴속 열정을 밝히십시오. 적극적인 행동과 밝은 에너지가 주변의 어둠을 걷어낼 것입니다.',
  } as any,
];

export const LEE_YUK_SA_APHORISMS: LeeYukSaAphorism[] = [
  {
    aphorismKey: 'gwangya_hero_seed',
    poemTitleKo: '《광야(曠野)》',
    famousLineKo: '지금 눈 내리고 매화 향기 홀로 아득하니 내 여기 가난한 노래의 씨를 뿌려라. 다시 천고의 뒤에 백마 타고 오는 초인이 있어 이 광야에서 목놓아 부르게 하리라.',
    sourceContext: '1944년 육사 사후 발표된 대표 저항시',
    actionGuidance: '눈앞의 시련 속에서도 미래의 승리를 확신하며 오늘의 작은 실천과 씨앗을 심으십시오.',
  },
  {
    aphorismKey: 'peak_steel_rainbow',
    poemTitleKo: '《절정(絶頂)》',
    famousLineKo: '겨울은 강철로 된 무지갠가 보다. 이러매 눈 감아 생각해 볼밖에.',
    sourceContext: '1940년 《문장》 발표',
    actionGuidance: '도망칠 수 없는 시련을 숭고한 예술적 도약의 계기로 담담하게 승화하십시오.',
  },
  {
    aphorismKey: 'cheongpodo_welcome',
    poemTitleKo: '《청포도(靑葡萄)》',
    famousLineKo: '내 고장 칠월은 청포도가 익어가는 시절... 아이야 우리 식탁엔 은쟁반에 하이얀 모시 수건을 마련해 두렴.',
    sourceContext: '1939년 《문장》 발표',
    actionGuidance: '정성과 결백한 신의를 품고 가장 순수한 마음으로 사람과 기회를 맞이하십시오.',
  },
  {
    aphorismKey: 'gyomok_defiance',
    poemTitleKo: '《교목(喬木)》',
    famousLineKo: '푸른 하늘에 닿을 듯이 세월에 불타고 우뚝 남아 서서 차라리 봄도 꽃피진 말아라. 굳은 살 돋아난 내 그림자조차 꺾이지 않으리라.',
    sourceContext: '1940년 《인문평론》 발표',
    actionGuidance: '타협하지 않는 의연한 지조를 지키며 당신의 품격과 주체적 자존심을 당당히 세우십시오.',
  },
];

export function calculateKoreanLeeYukSaGwangyaPeak(
  profile: UserProfile
): KoreanLeeYukSaGwangyaPeakResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `LEE-YUK-SA-GWANGYA-PEAK:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const peakResilienceInBitterSeasonScore = 78 + (absHash % 21);
  const steelRainbowTranscendenceIndex = 77 + ((absHash >> 3) % 22);
  const visionaryCallingOfHeroScore = 79 + ((absHash >> 6) % 20);
  const sowingPoorSongSeedVirtueIndex = 76 + ((absHash >> 9) % 23);
  const pureIntegrityCheongpodoScore = 75 + ((absHash >> 12) % 24);

  const themeIndex = (absHash >> 4) % LEE_YUK_SA_THEMES.length;
  const aphorismIndex = (absHash >> 7) % LEE_YUK_SA_APHORISMS.length;

  const rawTheme = LEE_YUK_SA_THEMES[themeIndex] as any;
  const activeLeeYukSaTheme: LeeYukSaTheme = {
    themeKey: rawTheme.themeKey,
    themeTitleKo: rawTheme.themeTitleKo,
    themeTitleEn: rawTheme.themeTitleEn,
    existentialInsight: rawTheme.existentialInsight ?? rawTheme.themeInsight,
    practicalCounsel: rawTheme.practicalCounsel,
  };
  const focalLeeYukSaAphorism = LEE_YUK_SA_APHORISMS[aphorismIndex];

  const guidanceTitle = `이육사 광야와 절정 강철 무지개 실존의지 지혜: ${activeLeeYukSaTheme.themeTitleKo}`;
  const philosophicalCounsel = `민족의 거목 이육사 시인의 《광야》와 《절정》은 매운 계절의 서릿발 칼날 위에서도 꺾이지 않는 강철 무지개의 기개, 눈 내리는 황무지에 가난한 노래의 씨를 뿌리는 선구자적 소명의식, 그리고 은쟁반에 모시 수건을 받치는 순결한 지조를 전합니다. ` +
    `현재 당신의 삶을 관통하는 중심 실존 원리는 '${activeLeeYukSaTheme.themeTitleKo}'입니다. ` +
    `${activeLeeYukSaTheme.practicalCounsel} 아울러 이육사 시인의 명구 "${focalLeeYukSaAphorism.famousLineKo}"(${focalLeeYukSaAphorism.poemTitleKo})를 마음에 품고, ` +
    `${focalLeeYukSaAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_LEE_YUK_SA_VERSION,
    calculatedAtKst: new Date().toISOString(),
    peakResilienceInBitterSeasonScore,
    steelRainbowTranscendenceIndex,
    visionaryCallingOfHeroScore,
    sowingPoorSongSeedVirtueIndex,
    pureIntegrityCheongpodoScore,
    activeLeeYukSaTheme,
    focalLeeYukSaAphorism,
    leeYukSaComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanLeeYukSaGwangyaPeakPrompt(res: KoreanLeeYukSaGwangyaPeakResult): string {
  return [
    `【이육사 《광야·절정·청포도》 강철 무지개 실존의지 & 선구자 지표】`,
    `- 절정 극복 실존 의지(Peak Resilience): ${res.peakResilienceInBitterSeasonScore}/100`,
    `- 강철 무지개 실존 초극도(Steel Rainbow Transcendence): ${res.steelRainbowTranscendenceIndex}/100`,
    `- 백마 탄 초인 소명의식(Visionary Calling of Hero): ${res.visionaryCallingOfHeroScore}/100`,
    `- 가난한 노래 씨앗 파종력(Sowing Song Seed): ${res.sowingPoorSongSeedVirtueIndex}/100`,
    `- 청포도 결백 순결 지조(Pure Integrity Cheongpodo): ${res.pureIntegrityCheongpodoScore}/100`,
    `- 핵심 실존 테마: ${res.activeLeeYukSaTheme.themeTitleKo}`,
    `- 실존적 통찰: ${res.activeLeeYukSaTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeLeeYukSaTheme.practicalCounsel}`,
    `- 이육사 불멸의 시구: "${res.focalLeeYukSaAphorism.famousLineKo}" [${res.focalLeeYukSaAphorism.poemTitleKo}]`,
    `- 시적 출처: [${res.focalLeeYukSaAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalLeeYukSaAphorism.actionGuidance}`,
    `- 종합 이육사 실존의지 권면: ${res.leeYukSaComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
