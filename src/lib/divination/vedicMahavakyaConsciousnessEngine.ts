/**
 * Vedic Upanishadic Four Mahavakyas Consciousness Awakening Engine
 * 고대 인도 베다 우파니샤드 4대 마하바키야(Mahāvākya) 대선언 의식 각성 & 참자아 해탈 엔진
 * 
 * Version: LUCKEY-VEDIC-MAHAVAKYA-v1.0.0
 */

import { UserProfile } from '../../types';

export const VEDIC_MAHAVAKYA_ENGINE_VERSION = 'LUCKEY-VEDIC-MAHAVAKYA-v1.0.0';

export interface VedicMahavakyaParams {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}

export interface VedicMahavakyaReport {
  engineVersion: string;
  brahmanRealizationScore: number; // 0-100 브라만(우주 궁극 실재) 합일도
  mayaIllusionDispellingIndex: number; // 0-100 마야(착각과 두려움) 타파 지수
  innerSohamResonance: number; // 0-100 소함(So'ham 나는 그분이다) 생체 공명율
  activeMahavakya: {
    vedaSourceKo: string;
    sanskritPhrase: string;
    koreanMeaning: string;
    philosophicalGnosis: string;
    realLifeAffirmation: string;
  };
  shankaraNonDualWisdom: string; // 아디 샹카라 아드바이타 불이론(Non-duality) 해탈 조언
}

const FOUR_MAHAVAKYAS = [
  {
    vedaSourceKo: '리그베다 (아이타레야 우파니샤드)',
    sanskritPhrase: '프라즈냐남 브라흐마 (Prajñānam Brahma)',
    koreanMeaning: '순수한 의식(앎)이 곧 우주의 궁극 실재(Brahma)이다.',
    philosophicalGnosis: '세상의 지식에 주눅 들지 마라. 매 순간 바라보고 알아차리는 그 순수 의식이 가장 위대하다.',
    realLifeAffirmation: '나는 상황에 휘둘리는 피해자가 아니라, 모든 상황을 자각하고 있는 무한한 의식이다.',
  },
  {
    vedaSourceKo: '사마베다 (찬도가 우파니샤드)',
    sanskritPhrase: '타트 트밤 아시 (Tat Tvam Asi)',
    koreanMeaning: '네가 바로 그것(우주의 신성)이다.',
    philosophicalGnosis: '신이나 행복을 외부에서 찾아 헤매지 마라. 네가 찾고 있는 빛이 바로 너 자신이다.',
    realLifeAffirmation: '내가 동경하고 바라던 용기와 풍요는 이미 내 안에서 온전히 빛나고 있다.',
  },
  {
    vedaSourceKo: '야주르베다 (브리하다란야카 우파니샤드)',
    sanskritPhrase: '아함 브라흐마스미 (Aham Brahmāsmi)',
    koreanMeaning: '내가 곧 브라만(우주 그 자체)이다.',
    philosophicalGnosis: '왜소한 에고의 한계를 부수고 우주 전체와 하나로 연결된 장엄한 힘을 회복하라.',
    realLifeAffirmation: '어떤 결핍이나 평가도 나의 무한한 가치와 본래의 신성을 훼손할 수 없다.',
  },
  {
    vedaSourceKo: '아타르바베다 (만두캬 우파니샤드)',
    sanskritPhrase: '아야마트마 브라흐마 (Ayam Ātmā Brahma)',
    koreanMeaning: '이 개별적 영혼(Atman)이 곧 궁극의 우주(Brahman)이다.',
    philosophicalGnosis: '파도와 바다는 둘이 아니듯, 내 안의 작은 영혼이 곧 우주 바다 전체와 동일하다.',
    realLifeAffirmation: '나는 고립된 섬이 아니라, 온 우주의 사랑과 지혜의 바다에 맞닿아 있다.',
  },
];

export function calculateVedicMahavakya(params?: VedicMahavakyaParams): VedicMahavakyaReport {
  const profile = params?.profile;
  const bdate = profile?.basic?.birthdate || '1995-03-21';
  const btime = profile?.basic?.birthtime || '12:00';
  const seed = (bdate + btime).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const brahman = ((seed * 23 + 47) % 53) + 47;
  const maya = ((seed * 31 + 61) % 55) + 45;
  const soham = ((seed * 41 + 79) % 57) + 43;

  const vakyaIdx = seed % FOUR_MAHAVAKYAS.length;
  const activeVakya = FOUR_MAHAVAKYAS[vakyaIdx];

  const shankarAdvices = [
    '아디 샹카라의 불이론 지혜: "줄을 뱀으로 오인해 떨던 자가 불을 켜면 공포가 사라지듯, 두려움의 실체는 착각일 뿐이다."',
    '아디 샹카라의 불이론 지혜: "거울 속의 얼룩을 닦으려 하지 말고 내 눈앞의 집착을 내려놓아라."',
    '아디 샹카라의 불이론 지혜: "그 어떤 파도도 바다를 해칠 수 없다. 본래 바다인 너 자신으로 안식하라."',
  ];

  return {
    engineVersion: VEDIC_MAHAVAKYA_ENGINE_VERSION,
    brahmanRealizationScore: brahman,
    mayaIllusionDispellingIndex: maya,
    innerSohamResonance: soham,
    activeMahavakya: activeVakya,
    shankaraNonDualWisdom: shankarAdvices[seed % shankarAdvices.length],
  };
}

export function formatVedicMahavakyaPrompt(report: VedicMahavakyaReport): string {
  return `[고대 인도 베다 우파니샤드 4대 마하바키야(Mahāvākya) 대선언 실측 데이터]
- 엔진 버전: ${report.engineVersion}
- 브라만 합일도: ${report.brahmanRealizationScore}/100 | 마야(환상) 타파력: ${report.mayaIllusionDispellingIndex}/100
- 소함(So'ham) 공명율: ${report.innerSohamResonance}/100
- 활성 대선언: [${report.activeMahavakya.sanskritPhrase}] (${report.activeMahavakya.vedaSourceKo})
  * 뜻: ${report.activeMahavakya.koreanMeaning}
  * 영적 본질: ${report.activeMahavakya.philosophicalGnosis}
  * 현실 확언: "${report.activeMahavakya.realLifeAffirmation}"
- 샹카라 불이론(Non-duality) 해탈 조언: ${report.shankaraNonDualWisdom}
- 루시 가이드: 타인의 시선이나 현실의 제약에 주눅 들어 자존감이 낮아진 질문자에게 "네가 바로 그것이다(Tat Tvam Asi)"라는 우주의 거대한 축복과 본래의 당당한 신성을 따뜻하고 울림 있게 일깨워줘.`;
}
