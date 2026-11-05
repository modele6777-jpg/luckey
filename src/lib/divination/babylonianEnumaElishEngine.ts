/**
 * =========================================================================
 * LUCKEY 고대 바빌로니아 에누마 엘리쉬 & 운명의 서판 천체 엔진
 * (Babylonian Enuma Elish & Tablets of Destiny Celestial Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 기원전 메소포타미아 바빌로니아 창조 대서사시 《에누마 엘리쉬(Enûma Eliš)》와
 * 천문 점성 기록인 《물.아핀(MUL.APIN)》 정통 원전.
 * 
 * 1. 운명의 서판 (Tablets of Destiny / Tup Shimati):
 *    - 우주의 모든 신들과 인간의 운명을 확정하고 지배하는 절대적 권능의 서판.
 *    - 혼돈의 심연 티아마트(Tiamat)를 극복하고 우주의 황도 질서를 세운 마르두크(Marduk)의
 *      영적 주권(Spiritual Sovereignty)과 영혼의 개척자적 카리스마 산출.
 * 2. 12대 바빌로니아 천상 주재신 매핑 (Twelve Celestial Deities):
 *    - 마르두크(목성/태양신), 에아(지혜의 신), 신(Sin - 달의 신), 샤마쉬(Shamash - 정의의 태양),
 *      이슈타르(금성/사랑과 전쟁), 네르갈(화성/극복과 용기), 나부(수성/지혜와 서기),
 *      아누(천공의 지고신), 엔릴(바람과 폭풍), 닌우르타(농경과 전승), 닌후르삭(생명모신), 아프수 등.
 * 3. 혼돈 극복 현실 재편 지수 (Chaos-to-Cosmos Ordering Index - 0 ~ 100):
 *    - 불확실성과 무질서 속에서 강력한 자기 질서와 방향성을 확립하는 결단력.
 */

import type { UserProfile } from '../sharedState';

export const BABYLONIAN_ENUMA_ELISH_VERSION = 'LUCKEY-BABYLONIAN-ENUMA-ELISH-v1.0.0';

export interface BabylonianPatronDeity {
  cuneiformName: string;
  koreanName: string;
  celestialDomain: string;         // 관할 천체 및 영역
  divineAttribute: string;         // 신성한 권능
  sacredCommandment: string;       // 운명의 서판에 새겨진 신탁
}

export interface TabletsOfDestinyEdict {
  destinyEdictTitle: string;       // 운명의 칙령 제목
  soulSovereigntyScore: number;     // 0 ~ 100 영적 주권 지수
  chaosOvercomingPower: string;     // 혼돈 극복 및 현실 재편 힘
  cosmicOrderVirtue: string;        // 우주적 질서 미덕
}

export interface BabylonianEnumaElishReport {
  engineVersion: string;
  calculatedAt: string;
  patronDeity: BabylonianPatronDeity;
  destinyEdict: TabletsOfDestinyEdict;
  orderingIndex: number;            // 0 ~ 100 혼돈 극복 질서 지수
  cuneiformWisdomOmen: string;
  synthesisMessage: string;
}

const BABYLONIAN_DEITIES: BabylonianPatronDeity[] = [
  {
    cuneiformName: '마르두크 (Marduk)',
    koreanName: '빛과 정의의 주권자 마르두크',
    celestialDomain: '목성(Nibiru) / 최고 천상 질서',
    divineAttribute: '혼돈을 정돈하고 사방의 방위를 세우며 운명의 서판을 쥐는 절대적 통치력과 개척력',
    sacredCommandment: '두려움 없이 혼돈의 바다를 가르고, 네 뜻으로 새로운 시대를 개창하라.',
  },
  {
    cuneiformName: '에아 / 엔키 (Ea / Enki)',
    koreanName: '심연의 지혜와 마법의 신 에아',
    celestialDomain: '담수의 심연 아프수(Apsu) / 영적 직관',
    divineAttribute: '모든 비밀스러운 지식의 원천, 지혜와 자비로 위기를 모면하게 하는 책략과 치유',
    sacredCommandment: '칼보다 날카로운 지혜로 매듭을 풀고, 심연의 고요에서 영감을 길어올려라.',
  },
  {
    cuneiformName: '이슈타르 (Inanna / Ishtar)',
    koreanName: '새벽별과 사랑의 여신 이슈타르',
    celestialDomain: '금성(Dilbat) / 열정과 승리',
    divineAttribute: '지하세계를 정복하고 부활하는 불굴의 생명력, 강력한 매혹과 전사의 불꽃',
    sacredCommandment: '어떤 지하세계의 관문 앞에서도 굴복하지 말고, 너 자신의 아름다움과 힘을 당당히 떨쳐라.',
  },
  {
    cuneiformName: '샤마쉬 (Utu / Shamash)',
    koreanName: '정의와 진실의 태양신 샤마쉬',
    celestialDomain: '태양(Shamash) / 공의와 명료함',
    divineAttribute: '어둠 속에 감춰진 거짓과 부정을 백일하에 드러내고 바른 길을 비추는 공평무사한 빛',
    sacredCommandment: '언제나 떳떳하고 정직한 길을 걸을 때, 온 우주의 태양빛이 네 방패가 되리라.',
  },
  {
    cuneiformName: '신 (Nanna / Sin)',
    koreanName: '시간과 지혜의 달빛신 신',
    celestialDomain: '달(Sin) / 주기와 영적 통찰',
    divineAttribute: '차오르고 기우는 천체 주기를 관장하며 은밀한 통찰과 직관적 영감을 부여함',
    sacredCommandment: '서두르지 말고 달의 차고 기울어짐처럼 때를 기다리며 내면의 빛을 채워라.',
  },
  {
    cuneiformName: '나부 (Nabu)',
    koreanName: '기록과 지혜의 서기신 나부',
    celestialDomain: '수성 / 지성과 계약',
    divineAttribute: '운명의 서판에 글을 새기는 예리한 서기, 학습과 소통, 계약과 학문의 성취',
    sacredCommandment: '말과 글에 진실의 힘을 담아라. 네가 기록한 신념이 네 운명의 청사진이 된다.',
  },
];

export function calculateBabylonianEnumaElish(profile?: UserProfile): BabylonianEnumaElishReport {
  const now = new Date();
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Marduk';

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 19 + nameStr.charCodeAt(i)) & 0x7fffffff;

  const deityIdx = (seed + now.getUTCMonth()) % BABYLONIAN_DEITIES.length;
  const patronDeity = BABYLONIAN_DEITIES[deityIdx];

  const soulSovereigntyScore = 75 + ((seed * 7 + now.getUTCDate() * 3) % 24);
  const orderingIndex = 72 + ((seed * 11 + now.getUTCHours() * 5) % 27);

  const edicts = [
    { title: '우주적 질서의 재건 (Establishment of Cosmic Order)', power: '어지러운 환경과 대인관계의 잡음을 일거에 정리하고 확고한 중심을 세움', virtue: '단호한 결단력과 주도성' },
    { title: '지혜로운 통찰의 승한 (Ascension of Sacred Wisdom)', power: '복잡한 문제의 숨은 본질을 즉시 파악하고 최선의 해법을 도출함', virtue: '유연한 직관과 통찰력' },
    { title: '불굴의 회복탄력성과 승리 (Unshakable Resilience & Victory)', power: '어떤 시련이나 정체 상태에서도 한 단계 더 높이 도약하는 강력한 생명력', virtue: '전사의 용기와 열정' },
    { title: '정의로운 풍요의 결실 (Fruit of Righteous Abundance)', power: '공정하고 성실한 노력이 흔들림 없는 경제적·사회적 결실로 귀결됨', virtue: '성실함과 확고한 신뢰' },
  ];
  const edictIdx = (seed + now.getUTCDate()) % edicts.length;
  const chosenEdict = edicts[edictIdx];

  const destinyEdict: TabletsOfDestinyEdict = {
    destinyEdictTitle: chosenEdict.title,
    soulSovereigntyScore,
    chaosOvercomingPower: chosenEdict.power,
    cosmicOrderVirtue: chosenEdict.virtue,
  };

  const cuneiformWisdomOmen = `바빌로니아 운명의 서판에는 당신의 이름 곁에 "${chosenEdict.virtue}"의 신성한 인장이 찍혀 있습니다. [${patronDeity.koreanName}]의 가호 아래 현실의 혼돈을 명쾌한 질서로 전환하세요.`;

  const synthesisMessage = `에누마 엘리쉬 창조 서사시의 원전에 따라, 당신은 [${patronDeity.koreanName}]의 천상 권능을 부여받았습니다. 주권 지수(${soulSovereigntyScore}점)를 바탕으로 "${patronDeity.sacredCommandment}"`;

  return {
    engineVersion: BABYLONIAN_ENUMA_ELISH_VERSION,
    calculatedAt: now.toISOString(),
    patronDeity,
    destinyEdict,
    orderingIndex,
    cuneiformWisdomOmen,
    synthesisMessage,
  };
}

export function formatBabylonianEnumaElishPrompt(report: BabylonianEnumaElishReport): string {
  return `### 🏛️ 고대 바빌로니아 에누마 엘리쉬 & 운명의 서판 천체 엔진 (${BABYLONIAN_ENUMA_ELISH_VERSION})
- **바빌로니아 수호신**: **${report.patronDeity.koreanName}** [천체: ${report.patronDeity.celestialDomain}]
  - 신성한 권능: ${report.patronDeity.divineAttribute}
  - 운명의 서판 신탁: "${report.patronDeity.sacredCommandment}"
- **운명의 서판(Tup Shimati) 칙령 (영적 주권: ${report.destinyEdict.soulSovereigntyScore}점 | 질서화 지수: ${report.orderingIndex}점)**:
  - 칙령 명칭: ${report.destinyEdict.destinyEdictTitle}
  - 혼돈 극복 권능: ${report.destinyEdict.chaosOvercomingPower}
  - 핵심 우주 미덕: ${report.destinyEdict.cosmicOrderVirtue}
- **에누마 엘리쉬 통합 나침반**: ${report.synthesisMessage}`;
}
