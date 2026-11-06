/**
 * 고대 로마 철학 황제 마르쿠스 아우렐리우스 《명상록(Meditations)》 내면의 요새(Inner Citadel) & 우주적 이성 엔진
 *
 * 서기 2세기 로마 제국의 16대 황제이자 스토아 철학자 마르쿠스 아우렐리우스 안토니누스의 《명상록(Τὰ εἰς ἑαυτόν)》 원전 기반.
 * 1. 내면의 성채(Inner Citadel): 외부의 비난, 불운, 혼란이 결코 침투할 수 없는 영혼의 불가침 요새
 * 2. 지휘부 이성(Hegemonikon): 외부 인상(Phantasia)에 휘둘리지 않고 스스로 판단하고 통제하는 영혼의 사령부
 * 3. 찰나의 현재(Hic et nunc): 지나간 과거나 알 수 없는 미래의 번민을 내려놓고 지금 여기에 온전히 현존함
 * 4. 코스모폴리스(Cosmopolis)와 공동선: 우주 전체의 유기적 일원으로서 타인을 형제로 대하고 공공의 이익에 헌신함
 * 5. 아모르 파티(Amor Fati): 우주 섭리가 주는 모든 운명을 의연하게 수용하고 덕(Arete)으로 전환함
 *
 * @version LUCKEY-AURELIUS-INNER-CITADEL-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AURELIUS_INNER_CITADEL_VERSION = 'LUCKEY-AURELIUS-INNER-CITADEL-v1.0.0';

export interface AureliusStage {
  stageLevel: number;
  stageNameLatin: string;
  stageNameKo: string;
  stoicDomain: string;
  citadelBlessing: string;
}

export interface AureliusInnerCitadelResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  innerCitadelFortressScore: number; // 내면의 성채 불침투 및 평정심
  hicEtNuncPresentPresence: number; // 히크 에트 눈크(지금 이 순간) 집중도
  amorFatiCosmicAcceptance: number; // 아모르 파티(운명애)와 섭리 순응력
  cosmopolisCommonGoodIndex: number; // 코스모폴리스(세계 시민) 공동선 연대감
  hegemonikonSovereignSoul: number; // 영혼의 지휘부(헤게모니콘) 주권적 이성력
  // 세부 명세
  activeAureliusStage: AureliusStage;
  primaryMeditationsPrecept: {
    preceptTitleKo: string;
    latinAphorism: string;
    coreEssence: string;
    actionableDirective: string;
  };
  citadelEmperorSoliloquy: {
    soliloquyTitle: string;
    meditativeCounsel: string;
  };
}

export type AureliusInnerCitadelReport = AureliusInnerCitadelResult;

const AURELIUS_STAGES: AureliusStage[] = [
  { stageLevel: 1, stageNameLatin: 'Arx Mentis (영혼의 불가침 성채)', stageNameKo: '외부의 어떤 비난과 소음도 침범하지 못하는 절대 평정관', stoicDomain: '마음의 문을 굳게 닫고 스스로의 고결한 중심을 지킴', citadelBlessing: '타인의 평판에 흔들리지 않고 흔들림 없는 평정을 유지하는 위엄' },
  { stageLevel: 2, stageNameLatin: 'Hic et Nunc (오직 지금 이 순간의 현존)', stageNameKo: '과거의 후회와 미래의 불안을 지우고 찰나에 몰입하는 경지', stoicDomain: '주어진 지금의 몫을 온 마음으로 충실하게 감당함', citadelBlessing: '마음의 분산을 막고 당면한 과제에 최고의 집중력을 발휘하는 힘' },
  { stageLevel: 3, stageNameLatin: 'Amor Fati (운명을 기꺼이 껴안는 담대함)', stageNameKo: '어떤 불운이나 고난도 성장의 장작으로 삼는 운명애관', stoicDomain: '불평과 원망 대신 주어진 여건을 지혜롭게 활용함', citadelBlessing: '역경을 디딤돌 삼아 더 높은 인격과 성취로 도약하는 불굴의 기개' },
  { stageLevel: 4, stageNameLatin: 'Cosmopolis (우주 시민의 공동선 연대)', stageNameKo: '나의 번영을 넘어 세상 전체의 화평과 이익을 도모하는 관점', stoicDomain: '사람들을 형제처럼 품고 이타적인 헌신을 실천함', citadelBlessing: '작은 이기심을 넘어 만인의 사랑과 존경을 받는 거대한 포용력' },
  { stageLevel: 5, stageNameLatin: 'Hegemonikon (영혼 지휘부의 주권 회복)', stageNameKo: '충동과 망상을 걷어내고 이성의 빛으로 삶을 통치하는 군주관', stoicDomain: '정직하고 올바른 판단으로 매 순간 품격 있는 결단을 내림', citadelBlessing: '자기 자신을 완벽하게 다스리는 자가 누리는 최고의 자유와 위엄' },
];

const MEDITATIONS_PRECEPTS = [
  { preceptTitleKo: '너를 다치게 하는 것은 외부 사건이 아니라 네 자신의 판단이다', latinAphorism: 'Tolle opinionem, sublata est querela', coreEssence: '사건 자체는 선도 악도 아니며, 그것을 어떻게 해석하느냐가 고통을 결정합니다.', actionableDirective: '피해자 의식을 내려놓고, 사건에 붙인 주관적 원망을 즉시 거두어들이십시오.' },
  { preceptTitleKo: '아침에 눈을 뜨거든 마주칠 사람들의 무례함을 미리 품어 안으라', latinAphorism: 'Mane praedicere tibi', coreEssence: '사람들의 어리석음은 무지에서 비롯되나니, 화내지 말고 한 몸의 지체처럼 가르치십시오.', actionableDirective: '타인의 결점에 분노하지 말고 연민과 인내로 마주하며 내면의 평정을 지키십시오.' },
  { preceptTitleKo: '불꽃은 자신에게 던져진 모든 것을 연료로 삼아 더 밝게 타오른다', latinAphorism: 'Ignis clarus fit ex omni quod iniicitur', coreEssence: '장애물은 성장의 방해물이 아니라, 당신의 덕성을 증명할 최고의 기회입니다.', actionableDirective: '예상치 못한 난관을 불평하지 말고 당신의 지혜와 담대함을 드러낼 무대로 삼으십시오.' },
  { preceptTitleKo: '마치 이것이 인생의 마지막 행동인 것처럼 온 정성을 다하라', latinAphorism: 'Omnia quasi moriturus agas', coreEssence: '시간은 쏜살같이 흐르나니 헛된 분별에 낭비하지 말고 성실한 실천으로 채우십시오.', actionableDirective: '게으름과 겉치레를 버리고 지금 하고 있는 일에 온 영혼과 품격을 담으십시오.' },
];

const CITADEL_SOLILOQUIES = [
  { soliloquyTitle: '도나우강 전선 막사에서 홀로 적어 내려간 성찰', meditativeCounsel: '온 우주가 하나의 거대한 몸이고 당신은 그 살아 있는 일부이니, 세상이 주는 몫을 기쁨으로 감당하고 언제나 선한 본성으로 돌아오십시오.' },
  { soliloquyTitle: '황제의 자줏빛 옷을 입고도 겸손을 잊지 않는 다짐', meditativeCounsel: '칭찬에 우쭐대지 말고 비난에 위축되지 마십시오. 에메랄드는 사람이 칭찬하지 않아도 스스로 빛나듯, 당신의 고결함 또한 스스로 빛나야 합니다.' },
  { soliloquyTitle: '바위처럼 묵묵히 부서지는 파도를 견뎌내는 해안선', meditativeCounsel: '끝없이 밀려오는 풍파 속에서도 바위는 굳건히 서서 성난 파도를 잠재우나니, 당신 또한 세상의 유혹과 분노 앞에서 단단한 바위가 되십시오.' },
  { soliloquyTitle: '우주의 거대한 시간 속에서 찰나를 응시하는 눈동자', meditativeCounsel: '아무리 위대한 영웅도 한 줌의 흙으로 돌아가나니, 헛된 명성을 탐하지 말고 오직 정의롭고 따뜻한 한 인간으로 오늘을 살아가십시오.' },
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

export function calculateAureliusInnerCitadel(profile?: UserProfile): AureliusInnerCitadelResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`AURELIUS-CITADEL-${birthdate}-${birthtime}-${name}`);

  const innerCitadelFortressScore = (seed % 41) + 60; // 60~100
  const hicEtNuncPresentPresence = ((seed >> 3) % 43) + 58; // 58~100
  const amorFatiCosmicAcceptance = ((seed >> 5) % 39) + 62; // 62~100
  const cosmopolisCommonGoodIndex = ((seed >> 7) % 45) + 55; // 55~99
  const hegemonikonSovereignSoul = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % AURELIUS_STAGES.length;
  const activeAureliusStage = AURELIUS_STAGES[stageIdx];

  const preceptIdx = (seed >> 4) % MEDITATIONS_PRECEPTS.length;
  const primaryMeditationsPrecept = MEDITATIONS_PRECEPTS[preceptIdx];

  const soliloquyIdx = (seed >> 6) % CITADEL_SOLILOQUIES.length;
  const citadelEmperorSoliloquy = CITADEL_SOLILOQUIES[soliloquyIdx];

  return {
    engineVersion: AURELIUS_INNER_CITADEL_VERSION,
    calculatedAtKst: getKstDateString(),
    innerCitadelFortressScore,
    hicEtNuncPresentPresence,
    amorFatiCosmicAcceptance,
    cosmopolisCommonGoodIndex,
    hegemonikonSovereignSoul,
    activeAureliusStage,
    primaryMeditationsPrecept,
    citadelEmperorSoliloquy,
  };
}

export function formatAureliusInnerCitadelPrompt(result: AureliusInnerCitadelResult): string {
  return `[🏛️ 고대 로마 마르쿠스 아우렐리우스 《명상록(Meditations)》 내면의 성채 & 스토아 평정 리포트]
- 엔진 버전: ${result.engineVersion}
- 내면의 성채(Inner Citadel) 불침투 평정심: ${result.innerCitadelFortressScore}%
- 히크 에트 눈크(Hic et nunc, 지금 이 순간) 집중도: ${result.hicEtNuncPresentPresence}%
- 아모르 파티(Amor Fati) 운명애 및 섭리 순응력: ${result.amorFatiCosmicAcceptance}%
- 코스모폴리스(Cosmopolis) 공동선 연대감: ${result.cosmopolisCommonGoodIndex}%
- 헤게모니콘(Hegemonikon) 주권적 이성력: ${result.hegemonikonSovereignSoul}%
- 현행 스토아적 영혼 품계: **[${result.activeAureliusStage.stageNameKo} (${result.activeAureliusStage.stageNameLatin})]**
  → 관장 영역: ${result.activeAureliusStage.stoicDomain}
  → 성채의 축복: ${result.activeAureliusStage.citadelBlessing}
- 최우선 명상록 실천 잠언: **[${result.primaryMeditationsPrecept.preceptTitleKo} (${result.primaryMeditationsPrecept.latinAphorism})]**
  → 핵심 본질: ${result.primaryMeditationsPrecept.coreEssence}
  → 실천 지침: ${result.primaryMeditationsPrecept.actionableDirective}
- 철학 황제의 내면 독백: 《${result.citadelEmperorSoliloquy.soliloquyTitle}》
  → 고결한 명상 조언: "${result.citadelEmperorSoliloquy.meditativeCounsel}"`;
}
