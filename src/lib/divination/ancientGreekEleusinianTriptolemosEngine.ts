/**
 * 고대 그리스 엘레우시스 밀의 트리프톨레모스(Triptolemos) 황금 날개 용 전차 & 농경 문명 전파 3대 율법 엔진
 *
 * 서기전 6세기 아테네 엘레우시스 비전 밀의 데메테르 대지모신 하사 원전 기반.
 * 1. 데메테르 여신의 황금 날개 달린 뱀/용 전차를 타고 전 세계에 인류 최초의 밀알과 농경 문화를 전파한 문화 영웅 트리프톨레모스.
 * 2. 제노크라테스가 전하는 트리프톨레모스의 3대 근본 율법:
 *    - 부모를 공경하라 (Honour thy parents)
 *    - 신들에게 첫 수확의 과실을 바쳐라 (Honour the gods with the fruits of the earth)
 *    - 살아있는 짐승을 해치지 말라 (Hurt not animals)
 * 3. 4대 문명 개간 및 황금 밀알 번영의 파동 산출
 *
 * @version LUCKEY-ELEUSINIAN-TRIPTOLEMOS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const ELEUSINIAN_TRIPTOLEMOS_VERSION = 'LUCKEY-ELEUSINIAN-TRIPTOLEMOS-v1.0.0';

export interface TriptolemosChariotStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  chariotDomain: string;
  civilizationBlessing: string;
}

export interface EleusinianTriptolemosResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  goldenChariotFlightIndex: number; // 황금 날개 용 전차 도약 및 비상 지수
  sacredWheatCivilizationForce: number; // 신성한 밀알 문명화 및 결실력
  demeterBlessingPurityScore: number; // 대지모신 데메테르 축복 순도
  threeLawsHarmonyEquilibrium: number; // 3대 근본 율법 실천 조화도
  seedSowingAbundancePower: number; // 파종과 개간의 풍요 실현력
  // 세부 명세
  activeChariotStage: TriptolemosChariotStage;
  primaryTriadicLaw: {
    lawTitleKo: string;
    greekVirtue: string;
    coreEssence: string;
    actionableDirective: string;
  };
  eleusinianEpiphany: {
    visionTitle: string;
    spiritualWisdom: string;
  };
}

export type EleusinianTriptolemosReport = EleusinianTriptolemosResult;

const TRIPTOLEMOS_STAGES: TriptolemosChariotStage[] = [
  { stageLevel: 1, stageNameGreek: 'Ouranios Karpos (천상의 황금 열매)', stageNameKo: '만방에 풍요를 전파하는 황금 사절', chariotDomain: '세계적 지평 확장 및 보편적 지혜 공유', civilizationBlessing: '어둠의 황무지에 풍요의 밀밭을 일구는 개척력' },
  { stageLevel: 2, stageNameGreek: 'Drakon Pterotos (날개 달린 용의 전차)', stageNameKo: '지평선을 넘나드는 신성한 비행관', chariotDomain: '경계를 허물고 기회를 연결하는 이동성', civilizationBlessing: '막힌 관성을 뚫고 새로운 영역으로 나아가는 추진력' },
  { stageLevel: 3, stageNameGreek: 'Gê Phytoforos (생명을 잉태하는 대지)', stageNameKo: '풍요로운 씨앗을 품은 대지의 관리관', chariotDomain: '장기적 자산 구축 및 기초 체력 안정화', civilizationBlessing: '단단한 뿌리와 지속 가능한 생명력' },
  { stageLevel: 4, stageNameGreek: 'Hieros Arotos (신성한 쟁기질)', stageNameKo: '마음의 밭을 일구는 정직한 경작자', chariotDomain: '성실한 노동과 기술적 숙달', civilizationBlessing: '거짓 없는 땀방울이 가져오는 정당한 대가' },
  { stageLevel: 5, stageNameGreek: 'Puros Thêke (황금 밀알의 곳간)', stageNameKo: '지혜의 양식을 갈무리하는 수호관', chariotDomain: '가치 있는 경험과 자원의 안전한 보존', civilizationBlessing: '위기 속에서도 흔들리지 않는 내면의 풍요' },
  { stageLevel: 6, stageNameGreek: 'Kistophoros (신비의 바구니 봉헌자)', stageNameKo: '자연의 섭리를 경외하는 순례자', chariotDomain: '영적 감사와 신성한 겸손', civilizationBlessing: '탐욕을 내려놓을 때 열리는 우주적 은총' },
  { stageLevel: 7, stageNameGreek: 'Neos Sporos (갓 틔운 새싹)', stageNameKo: '새로운 가능성을 품은 희망의 싹', chariotDomain: '새로운 프로젝트와 인연의 순수한 시작', civilizationBlessing: '작은 시작 속에 깃든 무한한 결실의 약속' },
];

const TRIADIC_LAWS = [
  { lawTitleKo: '부모와 선조를 공경하라', greekVirtue: 'Honour thy parents', coreEssence: '나를 있게 한 근원적 뿌리에 감사하고 공경함', actionableDirective: '나를 길러준 근본적인 바탕을 소중히 여기고 가족 간의 화목을 도모하십시오.' },
  { lawTitleKo: '대지의 첫 수확으로 하늘을 기려라', greekVirtue: 'Honour the gods with earth fruits', coreEssence: '내가 얻은 성과의 첫 몫을 세상과 더 높은 가치에 나눔', actionableDirective: '성공의 결실을 독점하지 말고 주변과 먼저 나누어 감사함을 표현하십시오.' },
  { lawTitleKo: '살아있는 생명을 함부로 해치지 말라', greekVirtue: 'Hurt not animals', coreEssence: '모든 생명체에 대한 깊은 자비와 비폭력의 실천', actionableDirective: '말과 행동으로 타인에게 상처를 주지 않고 모든 생명을 따스하게 보살피십시오.' },
  { lawTitleKo: '진리의 밀알을 차별 없이 뿌려라', greekVirtue: 'Sow wisdom without bias', coreEssence: '배운 지혜와 이로움을 모든 이에게 아낌없이 베풂', actionableDirective: '사사로운 편견을 버리고 만나는 모든 사람에게 정직하고 선한 영향력을 건네십시오.' },
];

const ELEUSINIAN_EPIPHANIES = [
  { visionTitle: '데메테르의 황금 이삭 수여', spiritualWisdom: '겨울의 메마른 땅 속에서도 밀알은 죽지 않고 부활을 준비하듯, 고난 뒤에는 찬란한 번영이 기다린다.' },
  { visionTitle: '용 전차의 밤하늘 비행', spiritualWisdom: '세상의 좁은 울타리에 갇히지 말고 더 높은 하늘의 시선으로 삶의 행로를 넓게 바라보라.' },
  { visionTitle: '신비의 바구니 개봉', spiritualWisdom: '진정한 비밀은 감추어진 지식이 아니라 일상 속에서 타인과 나눌 때 저절로 꽃피는 사랑이다.' },
  { visionTitle: '첫 수확의 잔치', spiritualWisdom: '성실히 뿌린 땀은 결코 땅에 떨어지지 않으니, 때가 이르면 마땅히 풍성한 결실을 거두게 된다.' },
];

function getKstDateString(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateEleusinianTriptolemos(profile?: UserProfile): EleusinianTriptolemosResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`ELEUSINIAN-TRIPTOLEMOS-${birthdate}-${birthtime}-${name}`);

  const goldenChariotFlightIndex = (seed % 41) + 60; // 60~100
  const sacredWheatCivilizationForce = ((seed >> 3) % 43) + 58; // 58~100
  const demeterBlessingPurityScore = ((seed >> 5) % 39) + 62; // 62~100
  const threeLawsHarmonyEquilibrium = ((seed >> 7) % 45) + 55; // 55~99
  const seedSowingAbundancePower = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % TRIPTOLEMOS_STAGES.length;
  const activeChariotStage = TRIPTOLEMOS_STAGES[stageIdx];

  const lawIdx = (seed >> 4) % TRIADIC_LAWS.length;
  const primaryTriadicLaw = TRIADIC_LAWS[lawIdx];

  const epiphanyIdx = (seed >> 6) % ELEUSINIAN_EPIPHANIES.length;
  const eleusinianEpiphany = ELEUSINIAN_EPIPHANIES[epiphanyIdx];

  return {
    engineVersion: ELEUSINIAN_TRIPTOLEMOS_VERSION,
    calculatedAtKst: getKstDateString(),
    goldenChariotFlightIndex,
    sacredWheatCivilizationForce,
    demeterBlessingPurityScore,
    threeLawsHarmonyEquilibrium,
    seedSowingAbundancePower,
    activeChariotStage,
    primaryTriadicLaw,
    eleusinianEpiphany,
  };
}

export function formatEleusinianTriptolemosPrompt(result: EleusinianTriptolemosResult): string {
  return `[🌾 고대 그리스 엘레우시스 밀의 《트리프톨레모스(Triptolemos)》 황금 전차 & 농경 3대 율법 리포트]
- 엔진 버전: ${result.engineVersion}
- 황금 날개 용 전차 도약 및 비상 지수: ${result.goldenChariotFlightIndex}%
- 신성한 밀알 문명화 및 결실력: ${result.sacredWheatCivilizationForce}%
- 대지모신 데메테르 축복 순도: ${result.demeterBlessingPurityScore}%
- 3대 근본 율법 실천 조화도: ${result.threeLawsHarmonyEquilibrium}%
- 파종과 개간의 풍요 실현력: ${result.seedSowingAbundancePower}%
- 현행 전차 비행 품계: **[${result.activeChariotStage.stageNameKo} (${result.activeChariotStage.stageNameGreek})]**
  → 관장 영역: ${result.activeChariotStage.chariotDomain}
  → 문명 축복: ${result.activeChariotStage.civilizationBlessing}
- 최우선 실천 율법: **[${result.primaryTriadicLaw.lawTitleKo} (${result.primaryTriadicLaw.greekVirtue})]**
  → 핵심 본질: ${result.primaryTriadicLaw.coreEssence}
  → 실천 지침: ${result.primaryTriadicLaw.actionableDirective}
- 엘레우시스 신비 비전: 《${result.eleusinianEpiphany.visionTitle}》
  → 영적 지혜: "${result.eleusinianEpiphany.spiritualWisdom}"`;
}
