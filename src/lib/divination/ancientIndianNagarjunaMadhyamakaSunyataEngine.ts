/**
 * 고대 인도 대승불교 용수(Nāgārjuna, 龍樹) 보살 《중론(Mūlamadhyamakakārikā)》 팔불중도 & 공성(Śūnyatā) 통찰 엔진
 *
 * 서력 기원 2~3세기 대승불교의 중흥조 용수 보살의 불후의 저작 《중론(中論)》 원전 기반:
 * 1. 팔불중도(八不中道):
 *    - 불생불멸(不生不滅): 어떤 것도 실체로서 새롭게 생겨나거나 영원히 사라지지 않는다.
 *    - 부단부상(不斷不常): 완전히 끊어져 사라지는 허무도 없고, 불변으로 고착된 영원도 없다.
 *    - 불일불이(不一不異): 원인과 결과는 완전히 하나도 아니며 완전히 별개도 아니다.
 *    - 불래불출(不來不出): 어디선가 홀연히 오는 것도 아니며 어디론가 빠져나가는 것도 아니다.
 * 2. 연기즉공(緣起卽空, Pratītyasamutpāda = Śūnyatā):
 *    - "중인연생법(衆因緣生法) 아설즉시공(我說卽是空) 역위시가명(亦爲是假名) 역시중도의(亦是中道義)"
 *    - 온갖 인연에 기대어 생겨난 모든 것은 독립된 고유 실체(Svabhāva)가 없으므로 텅 비어 있으며, 그 때문에 무한히 유연하게 변화할 수 있다.
 * 3. 진속이제(眞俗二諦):
 *    - 진제(勝義諦, Paramārtha-satya): 언어와 분별을 초월한 궁극의 적멸과 공성.
 *    - 속제(世俗諦, Saṃvṛti-satya): 일상생활과 인간 소통의 맥락과 법칙.
 *    - "속제에 의지하지 않으면 진제를 말할 수 없고, 진제를 얻지 못하면 열반에 이르지 못한다."
 * 4. 사구게 분별 해체:
 *    - 유(有), 무(無), 역유역무(亦有亦無), 비유비무(非有非無)의 4단 논법적 고착을 모두 타파하여 진정한 자유를 얻음.
 *
 * @version LUCKEY-NAGARJUNA-MADHYAMAKA-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const NAGARJUNA_MADHYAMAKA_VERSION = 'LUCKEY-NAGARJUNA-MADHYAMAKA-v1.0.0';

export interface EightfoldNegationAspect {
  aspectKey: string;
  aspectHanja: string;
  aspectNameKo: string;
  philosophicalMeaning: string;
  practicalCounsel: string;
}

export interface MadhyamakaKarikaWisdom {
  karikaKey: string;
  chapterThemeKo: string;
  sanskritVerseSummary: string;
  philosophicalInsight: string;
  lifeApplication: string;
}

export interface NagarjunaMadhyamakaSunyataResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  sunyataWisdomScore: number;                 // 공성(Śūnyatā) 직관 및 무자성 통찰력
  eightfoldNegationMiddleWayScore: number;    // 팔불중도(八不中道) 양변 초월 평정도
  pratityasamutpadaGraspScore: number;        // 인연생기(緣起) 상호의존 자각도
  twoTruthsHarmonyScore: number;              // 진속이제(眞俗二諦) 현실·이상 조화도
  clingingDeconstructionScore: number;        // 관념 고착 및 에고 해체 지수
  // 세부 분석
  activeNegationAspect: EightfoldNegationAspect;
  focalKarikaWisdom: MadhyamakaKarikaWisdom;
  nagarjunaMiddleCounsel: {
    counselTitle: string;
    middleWayGuidance: string;
  };
}

export type NagarjunaMadhyamakaSunyataReport = NagarjunaMadhyamakaSunyataResult;

const EIGHTFOLD_NEGATION_ASPECTS: EightfoldNegationAspect[] = [
  {
    aspectKey: 'AnutpadaAnirodha',
    aspectHanja: '不生不滅 (불생불멸)',
    aspectNameKo: '생겨남과 사라짐의 양변 초월',
    philosophicalMeaning: '만물은 독립된 실체로 새로 태어나는 것도, 완전히 흔적 없이 소멸하는 것도 아닌 인연의 끝없는 흐름일 뿐입니다.',
    practicalCounsel: '새로운 시작에 들떠 교만해지거나 끝남과 상실에 깊이 좌절하지 마십시오. 모든 변화는 인연의 자연스러운 모임과 흩어짐입니다.',
  },
  {
    aspectKey: 'AnucchedaAsasvata',
    aspectHanja: '不斷不常 (부단부상)',
    aspectNameKo: '단절의 허무와 영원의 고착 초월',
    philosophicalMeaning: '모든 것이 영원히 불변한다는 고착(상견)도, 완전히 끊어져 무의미하다는 허무주의(단견)도 모두 실체를 착각한 망상입니다.',
    practicalCounsel: '상황이 영원히 지속될 것이라 안주하지 말되, 아무 소용없다는 무기력에 빠지지도 마십시오. 지금 이 순간 짓는 인연이 미래를 빚어냅니다.',
  },
  {
    aspectKey: 'AnanarthaAnekartha',
    aspectHanja: '不一不異 (불일불이)',
    aspectNameKo: '절대적 동일과 배타적 분리 초월',
    philosophicalMeaning: '나와 타자, 원인과 결과는 하나로 엉겨붙어 있는 것도 아니며, 완전히 무관하게 떨어져 있는 것도 아닙니다.',
    practicalCounsel: '타인과 지나치게 융합되어 경계를 잃지도 말고, 완전히 고립된 섬처럼 남을 배척하지도 마십시오. 건강한 연결감이 중도입니다.',
  },
  {
    aspectKey: 'AnagamaAnirgama',
    aspectHanja: '不來不出 (불래불출)',
    aspectNameKo: '외부 유입과 내부 이탈의 환상 초월',
    philosophicalMeaning: '지혜나 행복은 외부 어딘가에서 홀연히 날아오는 것이 아니며, 내 안에서 바깥으로 새어나가 잃어버리는 것도 아닙니다.',
    practicalCounsel: '외적인 인정이나 특별한 계기만을 찾아 헤매지 마십시오. 이미 갖추어진 인연의 관계망 속에서 마음의 촛점을 바로 세우십시오.',
  },
];

const KARIKA_WISDOMS: MadhyamakaKarikaWisdom[] = [
  {
    karikaKey: 'PratityasamutpadaSunyata',
    chapterThemeKo: '인연생기(緣起)가 곧 공(空)이며 중도(中道)',
    sanskritVerseSummary: 'Yah pratityasamutpadah sunyatam tam pracaksmahe (제24품 관사제품)',
    philosophicalInsight: '모든 사물과 사건은 홀로 서는 고유 실체가 없기에(空), 인연에 따라 얼마든지 새롭게 피어나고 전환될 수 있습니다.',
    lifeApplication: '현재 마주한 한계나 난관을 불변의 운명으로 굳히지 마십시오. 인연과 조건을 새롭게 재배치하면 현실은 즉각 새롭게 직조됩니다.',
  },
  {
    karikaKey: 'TwoTruthsDvauSatye',
    chapterThemeKo: '진속이제(眞俗二諦)의 지혜로운 조화',
    sanskritVerseSummary: 'Dve satye samupasritya buddhanam dharmadesana (제24품 제8게)',
    philosophicalInsight: '언어와 관습의 세속적 질서(속제)를 존중하면서도, 그 어떤 언어에도 얽매이지 않는 궁극의 공성(진제)을 관조하는 균형입니다.',
    lifeApplication: '세상의 규범과 일상의 실무를 빈틈없이 성실하게 이행하되, 마음 한구석은 그 어떤 결과에도 집착하지 않는 가벼움을 유지하십시오.',
  },
  {
    karikaKey: 'SamsaraNirvanaAbheda',
    chapterThemeKo: '생사와 열반의 불이(不二)',
    sanskritVerseSummary: 'Na samsarasya nirvanat kimcid asti visesanam (제25품 제19게)',
    philosophicalInsight: '번뇌가 소용돌이치는 현실(생사)과 평화로운 깨달음(열반)은 장소가 다른 두 세계가 아니라, 마음의 고착을 푸느냐의 차이일 뿐입니다.',
    lifeApplication: '문제를 피해 특별한 이상향으로 도망치려 하지 마십시오. 지금 겪고 있는 번뇌의 한복판에서 관념의 집착을 내려놓는 바로 그 자리가 평화입니다.',
  },
  {
    karikaKey: 'SarvadrstiPrahana',
    chapterThemeKo: '모든 견해와 도그마의 완전한 휴식',
    sanskritVerseSummary: 'Sarvadrstiprahanaya yah saddharmam adesayat (제27품 제30게)',
    philosophicalInsight: '공(空)이란 또 하나의 철학적 이론이나 주장이 아니라, 마음을 옭아매는 모든 고정관념을 치유하는 해독제입니다.',
    lifeApplication: '"반드시 이래야만 한다"는 자기만의 고집과 주장을 내려놓으십시오. 견해가 비워진 맑은 거울의 마음에 세상의 참모습이 왜곡 없이 비칩니다.',
  },
];

export function calculateNagarjunaMadhyamakaSunyata(profile: UserProfile): NagarjunaMadhyamakaSunyataResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'NagarjunaMadhyamakaSunyata';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const sunyataWisdomScore = 68 + (absHash % 31);
  const eightfoldNegationMiddleWayScore = 66 + ((absHash >> 3) % 33);
  const pratityasamutpadaGraspScore = 67 + ((absHash >> 6) % 32);
  const twoTruthsHarmonyScore = 65 + ((absHash >> 9) % 34);
  const clingingDeconstructionScore = 69 + ((absHash >> 12) % 30);

  const aspectIndex = (absHash >> 4) % EIGHTFOLD_NEGATION_ASPECTS.length;
  const wisdomIndex = (absHash >> 7) % KARIKA_WISDOMS.length;

  const activeNegationAspect = EIGHTFOLD_NEGATION_ASPECTS[aspectIndex];
  const focalKarikaWisdom = KARIKA_WISDOMS[wisdomIndex];

  const counselTitle = `용수 중론 팔불중도: ${activeNegationAspect.aspectHanja}`;
  const middleWayGuidance = `용수 보살의 대승 중관 철학은 일체의 양극단과 고정관념을 해체하여 걸림 없는 자유를 선사합니다. ` +
    `현재 당신의 사유와 운명 흐름은 '${activeNegationAspect.aspectNameKo}(${activeNegationAspect.aspectHanja})'의 관통점에 닿아 있습니다. ` +
    `${activeNegationAspect.practicalCounsel} 또한 《중론》의 정수인 '${focalKarikaWisdom.chapterThemeKo}'을 유념하여, ` +
    `${focalKarikaWisdom.lifeApplication}`;

  return {
    engineVersion: NAGARJUNA_MADHYAMAKA_VERSION,
    calculatedAtKst: new Date().toISOString(),
    sunyataWisdomScore,
    eightfoldNegationMiddleWayScore,
    pratityasamutpadaGraspScore,
    twoTruthsHarmonyScore,
    clingingDeconstructionScore,
    activeNegationAspect,
    focalKarikaWisdom,
    nagarjunaMiddleCounsel: {
      counselTitle,
      middleWayGuidance,
    },
  };
}

export function formatNagarjunaMadhyamakaSunyataPrompt(res: NagarjunaMadhyamakaSunyataResult): string {
  return [
    `【용수 중론 & 팔불중도 공성(Śūnyatā) 지표】`,
    `- 공성(Śūnyatā) 직관 및 무자성 통찰력: ${res.sunyataWisdomScore}/100`,
    `- 팔불중도(八不中道) 양변 초월 평정도: ${res.eightfoldNegationMiddleWayScore}/100`,
    `- 인연생기(緣起) 상호의존 자각도: ${res.pratityasamutpadaGraspScore}/100`,
    `- 진속이제(眞俗二諦) 현실·이상 조화도: ${res.twoTruthsHarmonyScore}/100`,
    `- 관념 고착 및 에고 해체 지수: ${res.clingingDeconstructionScore}/100`,
    `- 핵심 팔불중도 관점: ${res.activeNegationAspect.aspectNameKo} [${res.activeNegationAspect.aspectHanja}]`,
    `- 철학적 의미: ${res.activeNegationAspect.philosophicalMeaning}`,
    `- 실천적 중도 조언: ${res.activeNegationAspect.practicalCounsel}`,
    `- 《중론》 핵심 게송: ${res.focalKarikaWisdom.chapterThemeKo} ("${res.focalKarikaWisdom.sanskritVerseSummary}")`,
    `- 게송 통찰: ${res.focalKarikaWisdom.philosophicalInsight}`,
    `- 일상 실천 지침: ${res.nagarjunaMiddleCounsel.middleWayGuidance}`,
  ].join('\n');
}
