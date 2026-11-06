/**
 * 고대 잉카 안데스 코스몰로지 3대 세계 & 신성 영수 & 파차마마 아이니(Ayni) 호혜 조화 엔진
 *
 * LUCKEY-INCA-ANDEAN-THREE-PACHA-AYNI-v1.0.0
 *
 * 남아메리카 안데스 산맥 및 잉카 제국 케추아(Quechua) 샤머니즘 원전 기반
 * 3대 우주 세계(하난 파차·카이 파차·우쿠 파차), 3대 신성 영수(콘도르·퓨마·뱀),
 * 대지모신 파차마마(Pachamama)의 사미(Sami, 청정 에너지)와 아이니(Ayni, 신성 상호호혜) 결정론 엔진.
 *
 * [핵심 우주론 체계]
 * 1. 3대 파차 (Three Worlds / Pachas):
 *    - 하난 파차 (Hanan Pacha): 천상계, 영적 시야와 신성한 지혜, 태양신 인티(Inti)의 빛, 수호 영수: 신성 콘도르 (Kuntur)
 *    - 카이 파차 (Kay Pacha): 지상계/현세, 깨어있는 현존, 용기와 구체적 실행, 인간의 삶, 수호 영수: 신성 퓨마 (Puma)
 *    - 우쿠 파차 (Uku Pacha): 지하계/무의식, 심연의 그림자 정화 및 재생, 영적 뿌리, 수호 영수: 신성 뱀 (Amaru)
 * 2. 에너지 순환 및 정화 (Energy Dynamics):
 *    - 사미 (Sami): 우주와 대자연에서 흐르는 맑고 가벼운 고차원 정기
 *    - 후차 (Hucha): 정체되고 무거운 저밀도 에너지 (파차마마에게 내려놓아 퇴비처럼 승화)
 * 3. 아이니 (Ayni - Sacred Reciprocity):
 *    - "오늘 너에게 주고, 내일 나에게 돌아온다." 우주와 인간, 이웃 간의 신성한 상호 호혜와 순환 법칙
 * 4. 잉카 3대 황금 덕목 (Three Incan Pillars):
 *    - 무나이 (Munay): 가슴의 조건 없는 사랑과 온기
 *    - 양카이 (Yankay): 손과 몸의 성실한 실천과 노동
 *    - 야차이 (Yachay): 머리의 밝은 지혜와 올바른 앎
 */

import type { UserProfile } from '../../types/user';

export const INCA_ANDEAN_PACHA_VERSION = '1.0.0';

export interface IncaAndeanPachaReport {
  engineVersion: string;
  calculatedAt: string;
  // 3대 파차 공명도
  hananPachaCelestialScore: number; // 하난 파차 (천상/콘도르 영적 시야, 0~100)
  kayPachaEarthlyPresenceScore: number; // 카이 파차 (지상/퓨마 용기 실행, 0~100)
  ukuPachaSubconsciousDepthScore: number; // 우쿠 파차 (지하/뱀 재생 치유, 0~100)
  // 안데스 영성 지표
  ayniReciprocityBalanceScore: number; // 아이니(Ayni) 신성 호혜성 조화 지수 (0~100)
  samiLightEnergyPurity: number; // 사미(Sami) 청정 생명 에너지 순도 (0~100)
  huchaHeavyEnergyClearance: number; // 후차(Hucha) 탁기 정화율 (0~100)
  // 3대 기둥 활성도
  munayHeartLoveScore: number; // 무나이 (사랑/가슴, 0~100)
  yankayActionLaborScore: number; // 양카이 (실천/노동, 0~100)
  yachayWisdomIntellectScore: number; // 야차이 (지혜/머리, 0~100)
  // 신성 영수 수호령
  sacredAnimalTotem: {
    animalKo: string;
    quechuaName: string;
    realm: string;
    totemicMedicine: string;
  };
  ayniSpiritualPrescription: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const ANDEAN_TOTEMS = [
  {
    animalKo: '신성한 콘도르',
    quechuaName: 'Kuntur',
    realm: '하난 파차 (Hanan Pacha - 천상계)',
    totemicMedicine: '높은 하늘에서 삶의 전모를 조망하는 영적 시야를 선사합니다. 사소한 갈등을 초월하여 거대한 목적지를 향해 날개를 펼치십시오.',
  },
  {
    animalKo: '신성한 퓨마',
    quechuaName: 'Puma',
    realm: '카이 파차 (Kay Pacha - 지상계)',
    totemicMedicine: '두려움 없는 용기와 즉각적인 결단력을 부여합니다. 지체하지 않고 현존하며 목표를 향해 우아하고 단호하게 발걸음을 내딛으십시오.',
  },
  {
    animalKo: '신성한 뱀',
    quechuaName: 'Amaru',
    realm: '우쿠 파차 (Uku Pacha - 지하계)',
    totemicMedicine: '낡은 허물을 벗어던지는 심원한 탈바꿈과 치유를 돕습니다. 과거의 상처와 후회를 파차마마 대지모신에 온전히 맡겨 새로운 지혜로 재탄생하십시오.',
  },
];

export function calculateIncaAndeanThreePachaAyni(profile?: UserProfile | null): IncaAndeanPachaReport {
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_inca_andean_pacha_v1`;
  const seed = djb2Hash(seedStr);

  const hananPachaCelestialScore = 64 + (seed % 35);
  const kayPachaEarthlyPresenceScore = 62 + ((seed >> 2) % 37);
  const ukuPachaSubconsciousDepthScore = 60 + ((seed >> 4) % 39);

  const ayniReciprocityBalanceScore = Math.round((hananPachaCelestialScore + kayPachaEarthlyPresenceScore + ukuPachaSubconsciousDepthScore) / 3);
  const samiLightEnergyPurity = 65 + ((seed >> 5) % 34);
  const huchaHeavyEnergyClearance = 68 + ((seed >> 7) % 31);

  const munayHeartLoveScore = 63 + ((seed >> 3) % 36);
  const yankayActionLaborScore = 61 + ((seed >> 6) % 38);
  const yachayWisdomIntellectScore = 66 + ((seed >> 8) % 33);

  const sacredAnimalTotem = ANDEAN_TOTEMS[seed % ANDEAN_TOTEMS.length];

  let ayniSpiritualPrescription = '';
  if (hananPachaCelestialScore >= kayPachaEarthlyPresenceScore && hananPachaCelestialScore >= ukuPachaSubconsciousDepthScore) {
    ayniSpiritualPrescription = '콘도르의 높은 비전이 열려 있습니다. 눈앞의 일시적 장애물에 매몰되지 말고 장기적 본질을 바라보며 아이니(나눔)를 실천하십시오.';
  } else if (kayPachaEarthlyPresenceScore >= ukuPachaSubconsciousDepthScore) {
    ayniSpiritualPrescription = '퓨마의 단호한 행동력이 필요한 시기입니다. 생각을 행동으로 옮길 때 파차마마의 강렬한 사미(청정에너지)가 길을 열어줍니다.';
  } else {
    ayniSpiritualPrescription = '뱀의 심원한 허물벗기가 일어나는 정화기입니다. 불필요한 집착과 후차(무거운 기운)를 내려놓으면 놀라운 재생력이 솟아납니다.';
  }

  return {
    engineVersion: INCA_ANDEAN_PACHA_VERSION,
    calculatedAt: new Date().toISOString(),
    hananPachaCelestialScore,
    kayPachaEarthlyPresenceScore,
    ukuPachaSubconsciousDepthScore,
    ayniReciprocityBalanceScore,
    samiLightEnergyPurity,
    huchaHeavyEnergyClearance,
    munayHeartLoveScore,
    yankayActionLaborScore,
    yachayWisdomIntellectScore,
    sacredAnimalTotem,
    ayniSpiritualPrescription,
  };
}

export function formatIncaAndeanThreePachaAyniPrompt(report: IncaAndeanPachaReport): string {
  return [
    `[고대 잉카 안데스 코스몰로지 3대 파차 & 파차마마 아이니(Ayni) 호혜 조화]`,
    `- 하난 파차(Hanan Pacha / 콘도르 영적 비전): ${report.hananPachaCelestialScore}점 / 카이 파차(Kay Pacha / 퓨마 현존 실행): ${report.kayPachaEarthlyPresenceScore}점`,
    `- 우쿠 파차(Uku Pacha / 뱀 재생 치유): ${report.ukuPachaSubconsciousDepthScore}점 / 아이니(Ayni) 상호호혜 조화율: ${report.ayniReciprocityBalanceScore}%`,
    `- 사미(Sami) 청정 생명 에너지 순도: ${report.samiLightEnergyPurity}점 / 후차(Hucha) 탁기 정화율: ${report.huchaHeavyEnergyClearance}%`,
    `- 3대 기둥: 무나이(가슴의 사랑) ${report.munayHeartLoveScore}점 / 양카이(손의 실천) ${report.yankayActionLaborScore}점 / 야차이(머리의 지혜) ${report.yachayWisdomIntellectScore}점`,
    `- 수호 토템: ${report.sacredAnimalTotem.animalKo} (${report.sacredAnimalTotem.quechuaName}) [${report.sacredAnimalTotem.realm}]`,
    `  * 치유 지혜: ${report.sacredAnimalTotem.totemicMedicine}`,
    `- 파차마마 아이니 처방: ${report.ayniSpiritualPrescription}`,
  ].join('\n');
}
