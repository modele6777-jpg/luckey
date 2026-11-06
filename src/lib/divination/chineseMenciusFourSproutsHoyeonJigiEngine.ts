/**
 * 고대 중국 맹자(Mencius) 사단사덕(四端四德) & 호연지기(浩然之氣) 양기 엔진
 *
 * 전국시대 유학자 맹자(孟子)의 《맹자(孟子)》 공손추상·고자상 원전 기반.
 * 1. 사단(四端): 인의예지(仁義禮智)의 네 가지 싹.
 *    - 측은지심(惻隱之心): 남의 아픔을 불쌍히 여기는 어진 마음 (仁之端)
 *    - 수오지심(羞惡之心): 불의를 부끄러워하고 악을 미워하는 마음 (義之端)
 *    - 사양지심(辭讓之心): 겸손히 양보하고 공경하는 마음 (禮之端)
 *    - 시비지심(是非之心): 옳고 그름을 명확히 가려내는 지혜로운 마음 (智之端)
 * 2. 호연지기(浩然之氣): 지극히 크고 굳세며 곧아 천지간에 가득 차는 당당한 도덕적 기운 (至大至剛 以直養而無害).
 * 3. 집의(集義): 일상의 작은 올바름을 꾸준히 쌓아야 하며, 조급하게 당겨 키우려(助長) 하지 말 것.
 * 4. 부동심(不動心): 어떤 유혹과 위협 앞에서도 중심을 잃지 않는 굳건한 평정심.
 * 5. 대장부(大丈夫): 부귀불능음(富貴不能淫), 빈천불능이(貧賤不能移), 위무불능굴(威武不能屈).
 *
 * @version LUCKEY-MENCIUS-FOUR-SPROUTS-HOYEON-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const MENCIUS_FOUR_SPROUTS_HOYEON_VERSION = 'LUCKEY-MENCIUS-FOUR-SPROUTS-HOYEON-v1.0.0';

export interface MenciusSproutStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  moralSproutPrinciple: string;
  practicalActionBlessing: string;
}

export interface MenciusFourSproutsHoyeonResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  hoyeonJigiGreatVitalityScore: number; // 호연지기(浩然之氣) 대기운 함양도
  fourSproutsCultivationLevel: number;  // 사단사덕(四端四德) 인의예지 확충도
  buDongXinSteadfastness: number;        // 부동심(不動心) 흔들리지 않는 내면력
  jiYiMoralAccumulation: number;        // 집의(集義) 의로움 축적력
  daejangbuNobility: number;            // 대장부(大丈夫) 당당한 기개도
  // 세부 명세
  activeMenciusStage: MenciusSproutStage;
  primaryMenciusClassic: {
    themeKo: string;
    hanjaClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  menciusPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type MenciusFourSproutsHoyeonReport = MenciusFourSproutsHoyeonResult;

const MENCIUS_STAGES: MenciusSproutStage[] = [
  {
    stageLevel: 1,
    stageNameHanja: '惻隱之心 仁之端 (측은지심 인지단)',
    stageNameKo: '남의 고통을 아파하고 생명을 품는 어짊의 싹',
    moralSproutPrinciple: '타인의 곤경을 외면하지 못하는 순수한 동정이 모든 위대한 인간성의 시작입니다.',
    practicalActionBlessing: '주변 사람들의 작은 고단함과 감정에 온기를 건네며 배려의 보폭을 넓히십시오.',
  },
  {
    stageLevel: 2,
    stageNameHanja: '羞惡之心 義之端 (수오지심 의지단)',
    stageNameKo: '불의를 부끄러워하고 바른길을 지키는 의로움의 싹',
    moralSproutPrinciple: '자신의 부족함을 반성하고 옳지 못한 일에 단호히 타협하지 않는 곧은 결기입니다.',
    practicalActionBlessing: '타인의 눈치나 편의주의에 굴복하지 말고 원칙과 양심이 가리키는 결단을 내리십시오.',
  },
  {
    stageLevel: 3,
    stageNameHanja: '辭讓之心 禮之端 (사양지심 예지단)',
    stageNameKo: '자신을 낮추고 상대의 자리를 존중하는 예의의 싹',
    moralSproutPrinciple: '스스로의 공을 앞세우지 않고 서로에 대한 존경과 경청으로 화합을 이루어내는 겸손입니다.',
    practicalActionBlessing: '말과 태도에서 경박함을 거두고 상대를 존중하는 절도와 품위를 지키십시오.',
  },
  {
    stageLevel: 4,
    stageNameHanja: '是非之心 智之端 (시비지심 지지단)',
    stageNameKo: '옳고 그름을 밝게 분별하는 명철한 지혜의 싹',
    moralSproutPrinciple: '감정적 편향이나 헛된 소문에 휩쓸리지 않고 사물의 참과 거짓을 냉철하게 직시합니다.',
    practicalActionBlessing: '현상의 표면에 현혹되지 말고 근본 원인과 실체적 진실을 끝까지 따져 분별하십시오.',
  },
];

const MENCIUS_CLASSICS = [
  {
    themeKo: '호연지기 - 지대지강의 대도덕적 기운',
    hanjaClassic: '其爲氣也 至大至剛 以直養而無害 則塞于天地之間',
    coreEssence: '호연지기는 지극히 크고 지극히 굳센 기운이니, 곧음으로써 기르고 해침이 없으면 천지간에 가득 차게 됩니다.',
    actionableDirective: '떳떳하지 못한 작은 술수를 버리고 정직한 신념으로 하루하루를 채워 천지를 품는 기상을 기르십시오.',
  },
  {
    themeKo: '부동심 - 유혹과 공포를 넘어서는 평정심',
    hanjaClassic: '我四十不動心 志壹則動氣 氣壹則動志',
    coreEssence: '뜻이 온전하면 기운을 움직이고 기운이 온전하면 뜻을 움직이니, 내면의 중심이 굳건하면 세상 어떤 풍파에도 흔들리지 않습니다.',
    actionableDirective: '외부의 칭찬이나 비난에 일희일비하지 말고 내면의 굳건한 북극성을 바라보며 흔들림 없이 나아가십시오.',
  },
  {
    themeKo: '집의 - 억지로 조장하지 않는 차분한 축적',
    hanjaClassic: '是集義所生者 非義襲而取之也 必有事焉而勿正 心勿忘 勿助長也',
    coreEssence: '호연지기는 의로움을 일상에서 꾸준히 모아 생겨나는 것이지, 한순간에 억지로 당겨 키울 수 없습니다.',
    actionableDirective: '성급하게 조급한 성과를 보려다 일을 그르치지 말고, 매 순간 정당한 노력을 묵묵히 쌓아가십시오.',
  },
  {
    themeKo: '대장부의 기개 - 세상 앞에 당당한 품격',
    hanjaClassic: '富貴不能淫 貧賤不能移 威武不能屈 此之謂大丈夫',
    coreEssence: '부귀함도 마음을 어지럽히지 못하고, 가난함도 지조를 바꾸지 못하며, 어떤 위세도 굴복시키지 못하는 것이 대장부입니다.',
    actionableDirective: '상황이 불리하거나 세상이 몰라주더라도 자신의 높은 자존감과 고결한 기개를 잃지 마십시오.',
  },
];

export function calculateMenciusFourSproutsHoyeon(profile: UserProfile): MenciusFourSproutsHoyeonResult {
  const seedString = (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'MenciusFourSproutsHoyeon';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const hoyeonJigiGreatVitalityScore = 64 + (absHash % 35);
  const fourSproutsCultivationLevel = 62 + ((absHash >> 3) % 37);
  const buDongXinSteadfastness = 60 + ((absHash >> 6) % 39);
  const jiYiMoralAccumulation = 58 + ((absHash >> 9) % 41);
  const daejangbuNobility = 65 + ((absHash >> 12) % 34);

  const stageIndex = (absHash >> 5) % MENCIUS_STAGES.length;
  const classicIndex = (absHash >> 8) % MENCIUS_CLASSICS.length;

  const activeMenciusStage = MENCIUS_STAGES[stageIndex];
  const primaryMenciusClassic = MENCIUS_CLASSICS[classicIndex];

  const counselTitle = `맹자 사단 확충과 호연지기: ${activeMenciusStage.stageNameHanja}`;
  const philosophicalGuidance = `현재 마주한 과업은 잔꾀나 타협이 아닌 당당한 호연지기(浩然之氣)와 사단(四端)의 확충으로 돌파해야 합니다. ` +
    `${activeMenciusStage.moralSproutPrinciple}의 원칙을 마음에 새기십시오. ` +
    `${activeMenciusStage.practicalActionBlessing} 억지로 조장(助長)하지 말고 의로움을 차곡차곡 쌓아갈 때(集義) 흔들리지 않는 부동심과 대장부의 당당함이 완성됩니다.`;

  return {
    engineVersion: MENCIUS_FOUR_SPROUTS_HOYEON_VERSION,
    calculatedAtKst: new Date().toISOString(),
    hoyeonJigiGreatVitalityScore,
    fourSproutsCultivationLevel,
    buDongXinSteadfastness,
    jiYiMoralAccumulation,
    daejangbuNobility,
    activeMenciusStage,
    primaryMenciusClassic,
    menciusPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatMenciusFourSproutsHoyeonPrompt(res: MenciusFourSproutsHoyeonResult): string {
  return [
    `【고대 중국 맹자 사단사덕(四端四德) & 호연지기(浩然之氣) 지표】`,
    `- 호연지기 대기운 함양도: ${res.hoyeonJigiGreatVitalityScore}/100`,
    `- 사단사덕 확충 완성도: ${res.fourSproutsCultivationLevel}/100`,
    `- 부동심 내면 평정력: ${res.buDongXinSteadfastness}/100`,
    `- 집의(集義) 정직 축적력: ${res.jiYiMoralAccumulation}/100`,
    `- 대장부 당당한 기개: ${res.daejangbuNobility}/100`,
    `- 집중 확충 사단: ${res.activeMenciusStage.stageNameHanja} (${res.activeMenciusStage.stageNameKo})`,
    `- 도덕적 발현 원리: ${res.activeMenciusStage.moralSproutPrinciple}`,
    `- 맹자 원전 명구: "${res.primaryMenciusClassic.themeKo}" [${res.primaryMenciusClassic.hanjaClassic}]`,
    `- 본질 해설: ${res.primaryMenciusClassic.coreEssence}`,
    `- 실천적 조언: ${res.primaryMenciusClassic.actionableDirective}`,
    `- 철학적 처방: ${res.menciusPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
