/**
 * 한국 고대 단군 단학(丹鶴) 《천부경(天符經)》 81자 우주 매트릭스 & 삼일신고 3진3망 성통광명·재세이화 엔진
 *
 * LUCKEY-CHEONBUGYEONG-EIGHTY-ONE-v1.0.0
 *
 * 단군조선 배달국 환웅천왕 이래 구전되어 신라 고운 최치원 선생이 81자 한문으로 각석한
 * 한민족 최고(最古) 우주 철학 원전 《천부경(天符經)》 81자와 《삼일신고(三一神誥)》 3진(三眞)·3망(三妄)
 * 심신 수련 체계에 기반한 결정론 계산 엔진.
 *
 * [핵심 수리 구조 및 원전 체계]
 * 1. 천부경 81자 9x9 우주 방진:
 *    - 一始無始一 析三極無盡本 天一一地一二人一三 一積十鉅無匱化三
 *    - 天二三地二三人二三 大三合六生七八九 運三四成환五七 一妙衍萬往萬來用變不動本
 *    - 本心本太陽昻明 人中天地一 一終無終一
 * 2. 3극(三極: 天·地·人) 조화율:
 *    - 무극(無極)에서 태극(太極)과 삼태극(三太極)으로 전개되는 본원적 창조 순환
 *    - 人中天地一: 사람의 중심 안에 하늘과 땅의 성스러운 기운이 온전히 하나로 관통함
 * 3. 삼일신고(三一神誥) 3진(三眞)과 3망(三妄):
 *    - 3진 (성·명·정, 性命精): 인간이 천부적으로 부여받은 순수한 본성, 천명, 신성 정기
 *    - 3망 (심·기·신, 心氣身): 세속의 감각과 집착으로 분열된 감정, 호흡, 육체
 *    - 지감(止感)·조식(調息)·금촉(禁觸) 3대 삼도 수련을 통한 성통광명(性通光明) 및 재세이화(在世理化)
 */

import type { UserProfile } from '../sharedState';

export const CHEONBUGYEONG_ENGINE_VERSION = '1.0.0';

export interface CheonbugyeongEightyOneReport {
  engineVersion: string;
  calculatedAt: string;
  // 3대 천지인 삼극 점수
  heavenCosmicAlignmentScore: number; // 천일일(天一一) 천기 순도 (0~100)
  earthGroundingStabilityScore: number; // 지일이(地一二) 지기 안정도 (0~100)
  humanHarmonizingSovereigntyScore: number; // 인일삼(人一三) 인중천지일 인성 중심력 (0~100)
  // 삼일신고 3진3망 지표
  sungMyungJungTrueTrinityScore: number; // 성·명·정(性命精) 3진 합일 지수 (0~100)
  threeTrainingsMasteryScore: number; // 지감·조식·금촉(止感調息禁觸) 수양 완성도 (0~100)
  // 천부경 순환 매트릭스
  yongbyeonBudongbonIntegrity: number; // 용변부동본(用變不動本) 불변성 (0~100)
  seongtongGwangmyeongIllumination: number; // 성통광명(性通光明) 영적 각성도 (0~100)
  hongikInkanManifestationCapacity: number; // 홍익인간(弘益人間) 재세이화 실천력 (0~100)
  // 수리 처방
  primaryHexagramGua: {
    verseKo: string;
    verseHanja: string;
    philosophicalCore: string;
    modernApplication: string;
  };
  spiritualCultivationGuidance: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const CHEONBUGYEONG_CORE_VERSES = [
  {
    verseKo: '일시무시일 일종무종일',
    verseHanja: '一始無始一 一終無終一',
    philosophicalCore: '하나에서 시작되나 비롯됨이 없는 하나요, 하나로 끝나되 끝남이 없는 영원한 순환',
    modernApplication: '시작과 끝에 대한 두려움을 내려놓고, 실패나 지연 또한 거대한 영적 순환의 자연스러운 한 단계임을 자각하십시오.',
  },
  {
    verseKo: '석삼극 무진본',
    verseHanja: '析三極 無盡本',
    philosophicalCore: '하늘과 땅과 사람으로 세 극을 나누어도 그 본체는 결코 다함이 없음',
    modernApplication: '자신의 에너지를 일, 관계, 자아 성찰 등 여러 갈래로 쏟더라도 내면의 무한한 영적 마르지 않는 샘이 언제나 채워집니다.',
  },
  {
    verseKo: '본심본태양 앙명',
    verseHanja: '本心本太陽 昻明',
    philosophicalCore: '사람의 본래 마음은 본래 찬란한 태양과 같아서 스스로 높고 밝음',
    modernApplication: '세상의 평가나 일시적인 우울감에 주눅 들지 마십시오. 그대의 본심은 구름 뒤에서도 항상 타오르는 태양입니다.',
  },
  {
    verseKo: '인중천지일',
    verseHanja: '人中天地一',
    philosophicalCore: '사람의 중심 안에 하늘과 땅이 온전히 깃들어 셋이 하나로 통일됨',
    modernApplication: '외부에서 구원을 찾지 마십시오. 당신의 고요한 심장 중심에 이미 천지의 지혜와 법칙이 일치해 있습니다.',
  },
  {
    verseKo: '일묘연 만왕만래 용변부동본',
    verseHanja: '一妙衍 萬往萬來 用變不動本',
    philosophicalCore: '하나의 묘한 작용이 무궁히 펼쳐져 만 번 오고 가며 쓰임은 바뀌되 근본은 요지부동함',
    modernApplication: '상황이 급변하고 주변 조건이 요동칠수록, 겉모습(용)에 흔들리지 말고 자신의 핵심 본질과 원칙(본)을 굳게 지키십시오.',
  },
];

export function calculateKoreanCheonbugyeongEightyOne(profile?: UserProfile | null): CheonbugyeongEightyOneReport {
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_cheonbugyeong_81_v1`;
  const seed = djb2Hash(seedStr);

  const heavenCosmicAlignmentScore = 65 + (seed % 34);
  const earthGroundingStabilityScore = 62 + ((seed >> 2) % 37);
  const humanHarmonizingSovereigntyScore = 66 + ((seed >> 4) % 33);

  const sungMyungJungTrueTrinityScore = Math.round(
    (heavenCosmicAlignmentScore * 0.35) +
    (earthGroundingStabilityScore * 0.35) +
    (humanHarmonizingSovereigntyScore * 0.3)
  );

  const threeTrainingsMasteryScore = 60 + ((seed >> 6) % 39);
  const yongbyeonBudongbonIntegrity = 64 + ((seed >> 8) % 35);
  const seongtongGwangmyeongIllumination = Math.round((sungMyungJungTrueTrinityScore * 0.5) + (threeTrainingsMasteryScore * 0.5));
  const hongikInkanManifestationCapacity = 63 + ((seed >> 10) % 36);

  const primaryHexagramGua = CHEONBUGYEONG_CORE_VERSES[seed % CHEONBUGYEONG_CORE_VERSES.length];

  let spiritualCultivationGuidance = '';
  if (sungMyungJungTrueTrinityScore >= 82) {
    spiritualCultivationGuidance = '천·지·인 삼극의 기운이 인중천지일(人中天地一)의 중심에서 조화롭게 타오르고 있습니다. 성통광명(性通光明)의 혜안으로 큰일을 주도하십시오.';
  } else if (earthGroundingStabilityScore >= 80) {
    spiritualCultivationGuidance = '지기(地氣)의 견고한 안정성이 돋보입니다. 현실적 실행력과 기반 다지기를 통해 재세이화(在世理化)의 복락을 현실화하십시오.';
  } else {
    spiritualCultivationGuidance = '지감(止感, 감정 다스림)과 조식(調息, 숨결 고르기)의 명상을 취하여 용변부동본(用變不動本)의 중심축을 확고히 세우십시오.';
  }

  return {
    engineVersion: CHEONBUGYEONG_ENGINE_VERSION,
    calculatedAt: new Date().toISOString(),
    heavenCosmicAlignmentScore,
    earthGroundingStabilityScore,
    humanHarmonizingSovereigntyScore,
    sungMyungJungTrueTrinityScore,
    threeTrainingsMasteryScore,
    yongbyeonBudongbonIntegrity,
    seongtongGwangmyeongIllumination,
    hongikInkanManifestationCapacity,
    primaryHexagramGua,
    spiritualCultivationGuidance,
  };
}

export function formatKoreanCheonbugyeongEightyOnePrompt(report: CheonbugyeongEightyOneReport): string {
  return [
    `[단군 단학 천부경(天符經) 81자 우주 매트릭스 & 삼일신고 3진3망 성통광명 엔진]`,
    `- 천·지·인 삼극(三極): 천일일(天一一) 천기 순도 ${report.heavenCosmicAlignmentScore}점 / 지일이(地一二) 지기 안정도 ${report.earthGroundingStabilityScore}점 / 인일삼(人一三) 중심력 ${report.humanHarmonizingSovereigntyScore}점`,
    `- 삼일신고 성·명·정(性命精) 3진 합일 지수: ${report.sungMyungJungTrueTrinityScore}점 / 지감·조식·금촉(止感調息禁觸) 수양도: ${report.threeTrainingsMasteryScore}점`,
    `- 용변부동본(用變不動本) 불변성: ${report.yongbyeonBudongbonIntegrity}점 / 성통광명(性通光明) 영적 각성도: ${report.seongtongGwangmyeongIllumination}점`,
    `- 홍익인간(弘益人間) 재세이화 실천력: ${report.hongikInkanManifestationCapacity}점`,
    `- 핵심 천부경 구절: ${report.primaryHexagramGua.verseHanja} (${report.primaryHexagramGua.verseKo}) - ${report.primaryHexagramGua.philosophicalCore}`,
    `- 현대적 적용: ${report.primaryHexagramGua.modernApplication}`,
    `- 심신 수련 처방: ${report.spiritualCultivationGuidance}`,
  ].join('\n');
}
