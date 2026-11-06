/**
 * 동학(東學) 수운 최제우 시천주(侍天主) 주문 & 지기금지(至氣今至) 인내천 천지조화 엔진
 *
 * LUCKEY-DONGHAK-CHEONDOISM-CHEONJU-v1.0.0
 *
 * 1860년(경신년) 경주 용담정에서 수운(水雲) 최제우(崔濟愚) 선생이 창도한 동학(東學, 천도교)의
 * 핵심 경전 《동경대전(東經大全)》 및 《용담유사(龍潭遺詞)》에 기반한 우주론 및 심성 개벽 결정론 엔진.
 *
 * [핵심 교리 및 수리 체계]
 * 1. 21자 시천주(侍天主) 본주문 & 강령주문:
 *    - 강령주문 (降靈呪文): "至氣今至 願爲大降" (지기금지 원위대강 - 지극한 기운이 지금 이르렀으니 크게 내리기를 원하옵니다)
 *    - 본주문 (本呪文): "侍天主 造化定 永世不忘 萬事知" (시천주 조화정 영세불망 만사지 - 내 안에 한울님을 모셔 조화가 정해지니 영세토록 잊지 아니하면 만사를 알게 되리라)
 * 2. 모실 시(侍) 자의 3대 심성 층위 (三字義):
 *    - 내유신령 (內有神靈): 사람의 마음속에 이미 신령한 한울님의 성령이 깃들어 있음 (내재적 신성 자아)
 *    - 외유기화 (外有氣化): 온 우주 대자연의 기운이 밖에서 서로 감응하고 화생함 (외재적 우주 감응)
 *    - 각지불이 (各知不移): 세상 만물이 각기 스스로 이 이치를 깨달아 흔들리지 아니함 (부동심 및 영구적 자각)
 * 3. 인내천(人乃天) 및 사인여천(事人如天):
 *    - 사람이 곧 한울이니, 사람을 대할 때 한울님처럼 공경하여 섬김
 * 4. 다시 개벽(開闢):
 *    - 낡은 운기가 소멸하고 새로운 생명과 지혜의 문명이 열리는 대전환의 기운
 */

import type { UserProfile } from '../sharedState';

export const DONGHAK_CHEONDOISM_VERSION = '1.0.0';

export interface DonghakCheonjuReport {
  engineVersion: string;
  calculatedAt: string;
  // 3대 시(侍) 심성 층위
  innerSpiritualityScore: number; // 내유신령 (內有神靈, 0~100)
  outerCosmicResonanceScore: number; // 외유기화 (外有氣化, 0~100)
  unshakableAwakeningScore: number; // 각지불이 (各知不移, 0~100)
  // 동학 종합 지표
  jigiUniversalEnergyAlignment: number; // 지기금지(至氣今至) 우주 기운 감응도 (0~100)
  gaebyeokTransformationIndex: number; // 다시 개벽(開闢) 운기 대전환 지수 (0~100)
  mansajiOmniscientWisdomScore: number; // 영세불망 만사지(萬事知) 통찰 지수 (0~100)
  // 수운 심법 처방
  primaryVirtue: {
    titleKo: string;
    hanja: string;
    meaning: string;
  };
  twentyOneWordsMantraFocus: {
    phraseHanja: string;
    phraseKo: string;
    spiritualApplication: string;
  };
  sainyeocheonGuidance: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const DONGHAK_VIRTUES = [
  {
    titleKo: '내유신령 (내면의 한울님 자각)',
    hanja: '內有神靈',
    meaning: '모든 답은 외부의 권위나 타인의 평가가 아닌, 그대 내면에 이미 온전히 모셔진 한울님의 영성에 있습니다.',
  },
  {
    titleKo: '외유기화 (우주 생명과의 호흡)',
    hanja: '外有氣化',
    meaning: '천지자연의 지극한 기운이 온몸을 감싸고 있으니, 억지 의지를 내려놓고 만물의 조화로운 흐름에 순응하십시오.',
  },
  {
    titleKo: '각지불이 (흔들리지 않는 자각)',
    hanja: '各知不移',
    meaning: '진리를 스스로 깨달아 어떠한 세속의 시련과 번뇌에도 중심을 잃지 않는 부동의 평정심을 회복하십시오.',
  },
  {
    titleKo: '사인여천 (사람을 하늘처럼 공경)',
    hanja: '事人如天',
    meaning: '마주하는 인연과 동료를 한울님 모시듯 정성껏 대할 때, 막혔던 운로가 스스로 활짝 열립니다.',
  },
  {
    titleKo: '동귀일체 (모두가 하나로 돌아감)',
    hanja: '同歸一體',
    meaning: '나와 타자, 인간과 우주가 근원적으로 둘이 아님을 통찰하여 대립을 해소하고 대화합의 조화를 이루십시오.',
  },
];

const MANTRA_FOCUS_LIST = [
  {
    phraseHanja: '至氣今至 願爲大降',
    phraseKo: '지기금지 원위대강',
    spiritualApplication: '우주 근원의 청정한 지기가 지금 이 순간 머리끝부터 발끝까지 크게 내리도록 심호흡하며 기운을 정화하십시오.',
  },
  {
    phraseHanja: '侍天主 造化定',
    phraseKo: '시천주 조화정',
    spiritualApplication: '내면의 존엄한 주체성을 바로 세울 때, 삶의 모든 혼란이 저절로 정연한 조화로 안정됩니다.',
  },
  {
    phraseHanja: '永世不忘 萬事知',
    phraseKo: '영세불망 만사지',
    spiritualApplication: '순수한 본성을 순간도 잊지 않고 늘 기억하면, 복잡한 현실의 가닥과 해법이 거울처럼 환히 드러납니다.',
  },
];

export function calculateDonghakCheondoismCheonju(profile?: UserProfile | null): DonghakCheonjuReport {
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_donghak_cheonju_v1`;
  const seed = djb2Hash(seedStr);

  const innerSpiritualityScore = 65 + (seed % 34);
  const outerCosmicResonanceScore = 60 + ((seed >> 2) % 39);
  const unshakableAwakeningScore = 62 + ((seed >> 4) % 37);

  const jigiUniversalEnergyAlignment = Math.round((innerSpiritualityScore * 0.4) + (outerCosmicResonanceScore * 0.6));
  const gaebyeokTransformationIndex = 63 + ((seed >> 6) % 36);
  const mansajiOmniscientWisdomScore = Math.round((unshakableAwakeningScore * 0.5) + (gaebyeokTransformationIndex * 0.5));

  const primaryVirtue = DONGHAK_VIRTUES[seed % DONGHAK_VIRTUES.length];
  const twentyOneWordsMantraFocus = MANTRA_FOCUS_LIST[(seed >> 3) % MANTRA_FOCUS_LIST.length];

  let sainyeocheonGuidance = '';
  if (innerSpiritualityScore >= 80) {
    sainyeocheonGuidance = '내면의 한울님 자성이 지극히 맑아 직관과 판단력이 최고조입니다. 스스로를 의심하지 말고 결단하십시오.';
  } else if (outerCosmicResonanceScore >= 80) {
    sainyeocheonGuidance = '천지자연과 주변 사람들과의 기운 조화가 탁월합니다. 협업과 대인관계에서 큰 은혜를 입게 됩니다.';
  } else {
    sainyeocheonGuidance = '지기금지(至氣今至)의 고요한 침묵을 취하며, 일상의 사소한 인연에도 공경의 예를 다할 때 개벽의 복운이 열립니다.';
  }

  return {
    engineVersion: DONGHAK_CHEONDOISM_VERSION,
    calculatedAt: new Date().toISOString(),
    innerSpiritualityScore,
    outerCosmicResonanceScore,
    unshakableAwakeningScore,
    jigiUniversalEnergyAlignment,
    gaebyeokTransformationIndex,
    mansajiOmniscientWisdomScore,
    primaryVirtue,
    twentyOneWordsMantraFocus,
    sainyeocheonGuidance,
  };
}

export function formatDonghakCheondoismCheonjuPrompt(report: DonghakCheonjuReport): string {
  return [
    `[동학 수운 최제우 시천주(侍天主) & 지기금지 인내천 천지조화]`,
    `- 내유신령(內有神靈) 내면 자성 점수: ${report.innerSpiritualityScore}점 / 외유기화(外有氣化) 우주 감응도: ${report.outerCosmicResonanceScore}점`,
    `- 각지불이(各知不移) 부동심 지수: ${report.unshakableAwakeningScore}점 / 지기금지(至氣今至) 우주 조화율: ${report.jigiUniversalEnergyAlignment}%`,
    `- 다시 개벽(開闢) 운기 대전환 지수: ${report.gaebyeokTransformationIndex}점 / 만사지(萬事知) 지혜 통찰력: ${report.mansajiOmniscientWisdomScore}점`,
    `- 핵심 심법 덕목: ${report.primaryVirtue.titleKo} (${report.primaryVirtue.hanja}) - ${report.primaryVirtue.meaning}`,
    `- 21자 주문 집중 명상: ${report.twentyOneWordsMantraFocus.phraseHanja} (${report.twentyOneWordsMantraFocus.phraseKo}) -> ${report.twentyOneWordsMantraFocus.spiritualApplication}`,
    `- 사인여천(事人如天) 실천 지침: ${report.sainyeocheonGuidance}`,
  ].join('\n');
}
