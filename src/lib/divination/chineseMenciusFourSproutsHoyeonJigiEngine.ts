/**
 * 고대 중국 맹자(Mencius) 사단사덕(四端四德) & 호연지기(浩然之氣) 양기 엔진
 *
 * 전국시대 유학자 맹자(孟子)의 《맹자(孟子)》 공손추상·고자상·등문공하 원전 기반.
 *
 * @version LUCKEY-MENCIUS-FOUR-SPROUTS-HOYEON-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const MENCIUS_FOUR_SPROUTS_HOYEON_VERSION = 'LUCKEY-MENCIUS-FOUR-SPROUTS-HOYEON-v2.1.0';

export interface MenciusSproutStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  moralSproutPrinciple: string;
  practicalActionBlessing: string;
}

export interface MenciusSituationalMoralAudit {
  themeKo: string;
  menciusCitation: string;
  hanjaQuote: string;
  translationKo: string;
  jojangTrap: string;
  jiYiActionStep: string;
}

export interface MenciusTemporalHoyeonRhythm {
  kstWindow: string;
  seasonalTone: string;
  sproutFocus: '측은지심(仁)' | '수오지심(義)' | '사양지심(禮)' | '시비지심(智)';
  hoyeonClarityIndex: number;
  rhythmDirective: string;
}

export interface MenciusSynthesisMatrix {
  fourSproutsBalance: number;
  jiYiAccumulation: number;
  buDongXinSteadiness: number;
  overallSynthesis: number;
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
  situationalMoralAudit: MenciusSituationalMoralAudit;
  temporalHoyeonRhythm: MenciusTemporalHoyeonRhythm;
  menciusSynthesisMatrix: MenciusSynthesisMatrix;
  menciusPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
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

function buildSituationalMoralAudit(question?: string): MenciusSituationalMoralAudit {
  const q = (question ?? '').trim();
  if (/조급|빨리|당장|성과|불안|초조/.test(q)) {
    return {
      themeKo: '물망물조장(勿忘勿助長) 집의의 속도',
      menciusCitation: '《맹자》 공손추상 2장 (알묘조장)',
      hanjaQuote: '必有事焉而勿正 心勿忘 勿助長也',
      translationKo: '할 일을 꾸준히 하되 결과를 조급히 재촉하지 말고, 마음에서 잊지 말며 억지로 잡아당겨 키우지(助長) 말라.',
      jojangTrap: '아직 뿌리가 내리기도 전에 결과를 억지로 당겨 뽑아 올리려다(揠苗助長) 기운까지 말려 버리는 조급함.',
      jiYiActionStep: '집의(集義): 오늘 내 몫의 정직한 1시간 공정만 마치고, 결과의 싹이 자랄 밤의 시간을 믿고 기다리십시오.',
    };
  }
  if (/관계|사람|상처|불의|억울|타협/.test(q)) {
    return {
      themeKo: '대장부(大丈夫)의 자존과 수오지심',
      menciusCitation: '《맹자》 등문공하 2장',
      hanjaQuote: '富貴不能淫 貧賤不能移 威武不能屈',
      translationKo: '부귀가 마음을 흔들지 못하고, 가난이 뜻을 옮기지 못하며, 위세가 굽히지 못하는 이가 대장부다.',
      jojangTrap: '눈앞의 눈치나 작은 이익 때문에 스스로 부끄러운 타협을 하며 내면의 떳떳함을 잃는 일.',
      jiYiActionStep: '수오지심(羞惡之心): 불편하더라도 내가 지키고 싶은 원칙 한 줄을 분명히 긋고 정중하게 의사를 밝히십시오.',
    };
  }
  if (/실패|어렵|시련|지치|힘들|포기/.test(q)) {
    return {
      themeKo: '생어우환(生於憂患) 단련의 사명',
      menciusCitation: '《맹자》 고자하 15장',
      hanjaQuote: '故天將降大任於是人也 必先苦其心志 勞其筋骨',
      translationKo: '하늘이 큰 소임을 맡기려 할 때는 반드시 먼저 그 마음과 뜻을 괴롭게 하고 뼈마디를 수고롭게 한다.',
      jojangTrap: '당장의 고단함을 내가 부족하거나 버림받은 신호로 오해하여 스스로 물러서는 위축.',
      jiYiActionStep: '부동심(不動心): 오늘의 어려움을 근력을 키우는 훈련으로 받아들이고, 가장 기본이 되는 루틴 1가지만 지키십시오.',
    };
  }
  return {
    themeKo: '반구저기(反求諸己)와 야기(夜氣) 회복',
    menciusCitation: '《맹자》 이루상 · 고자상',
    hanjaQuote: '行有不得者 皆反求諸己 其身正而天下歸之',
    translationKo: '행하여 얻지 못하는 바가 있으면 모두 자기 자신에게서 돌이켜 찾으라. 내 몸이 바르면 세상이 따른다.',
    jojangTrap: '바깥의 조건과 남의 탓만 돌리다가 정작 내가 가꾸어야 할 맑은 밤기운(夜氣)을 소진하는 일.',
    jiYiActionStep: '사단 확충: 오늘 나 자신에게 떳떳한 작은 선행이나 정직한 마무리 1가지를 조용히 실행하십시오.',
  };
}

function buildTemporalHoyeonRhythm(now?: Date): MenciusTemporalHoyeonRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 측은지심(仁)의 따뜻한 싹을 틔워 인연을 품는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 사양지심(禮)의 절도와 균형으로 열기를 다스리는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 수오지심(義)의 곧은 결단으로 불필요한 가지를 치는 계절'
          : '겨울 — 시비지심(智)과 야기(夜氣)를 고요히 축적하는 계절';

  if (hour >= 4 && hour < 10) {
    return {
      kstWindow: '새벽·아침 평단지기(平旦之氣) 맑은 기운 창',
      seasonalTone,
      sproutFocus: '측은지심(仁)',
      hoyeonClarityIndex: 92,
      rhythmDirective: '밤사이 맑아진 평단지기가 살아 있는 아침입니다. 사사로운 이해타산을 걷고 본래의 어진 뜻을 세우십시오.',
    };
  }
  if (hour >= 10 && hour < 17) {
    return {
      kstWindow: '한낮 집의(集義) 당당한 실천 창',
      seasonalTone,
      sproutFocus: '수오지심(義)',
      hoyeonClarityIndex: 84,
      rhythmDirective: '일과 선택이 겹치는 낮 시간입니다. 작은 편법 대신 정직하고 떳떳한 원칙으로 중심을 지키십시오.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 사양지심(禮) 화합과 경청 창',
      seasonalTone,
      sproutFocus: '사양지심(禮)',
      hoyeonClarityIndex: 82,
      rhythmDirective: '타인의 자리를 존중하고 하루의 과열된 마음을 겸손과 온기로 가라앉히기 좋은 시간입니다.',
    };
  }
  return {
    kstWindow: '심야 야기(夜氣) 함양과 시비(智) 성찰 창',
    seasonalTone,
    sproutFocus: '시비지심(智)',
    hoyeonClarityIndex: 80,
    rhythmDirective: '조장(助長)의 조급함을 내려놓고 맑은 밤기운(夜氣)이 스스로 회복되도록 고요히 쉬십시오.',
  };
}

export function calculateMenciusFourSproutsHoyeon(
  profile: UserProfile,
  question?: string,
  now?: Date,
): MenciusFourSproutsHoyeonResult {
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
  const situationalMoralAudit = buildSituationalMoralAudit(question);
  const temporalHoyeonRhythm = buildTemporalHoyeonRhythm(now);

  const fourSproutsBalance = Math.min(99, Math.round((fourSproutsCultivationLevel + daejangbuNobility) / 2));
  const jiYiAccumulation = Math.min(99, Math.round((jiYiMoralAccumulation + hoyeonJigiGreatVitalityScore) / 2));
  const buDongXinSteadiness = Math.min(99, Math.round((buDongXinSteadfastness + temporalHoyeonRhythm.hoyeonClarityIndex) / 2));
  const overallSynthesis = Math.round((fourSproutsBalance + jiYiAccumulation + buDongXinSteadiness) / 3);

  const menciusSynthesisMatrix: MenciusSynthesisMatrix = {
    fourSproutsBalance,
    jiYiAccumulation,
    buDongXinSteadiness,
    overallSynthesis,
  };

  const counselTitle = `맹자 사단 확충과 호연지기: ${activeMenciusStage.stageNameHanja}`;
  const philosophicalGuidance = `현재 마주한 과업은 잔꾀나 타협이 아닌 당당한 호연지기(浩然之氣)와 사단(四端)의 확충으로 돌파해야 합니다. ` +
    `${activeMenciusStage.moralSproutPrinciple}의 원칙을 마음에 새기십시오. ` +
    `${activeMenciusStage.practicalActionBlessing} 억지로 조장(助長)하지 말고 의로움을 차곡차곡 쌓아갈 때(集義) 흔들리지 않는 부동심과 대장부의 당당함이 완성됩니다.`;

  const dailyPracticeRitual =
    `${situationalMoralAudit.jiYiActionStep} (${temporalHoyeonRhythm.rhythmDirective})`;
  const reflectiveQuestion =
    `지금 내 마음은 조급한 조장(助長)에 치우쳐 있습니까, 아니면 떳떳한 집의(集義)의 걸음을 걷고 있습니까?`;
  const interpretiveBoundary =
    '이 관점은 점수가 아니라 맹자의 사단(四端)과 호연지기·집의(集義)의 틀로 오늘의 마음 결을 비추는 상징적 성찰입니다.';

  return {
    engineVersion: MENCIUS_FOUR_SPROUTS_HOYEON_VERSION,
    calculatedAtKst: (now ?? new Date()).toISOString(),
    hoyeonJigiGreatVitalityScore,
    fourSproutsCultivationLevel,
    buDongXinSteadfastness,
    jiYiMoralAccumulation,
    daejangbuNobility,
    activeMenciusStage,
    primaryMenciusClassic,
    situationalMoralAudit,
    temporalHoyeonRhythm,
    menciusSynthesisMatrix,
    menciusPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

function describeMenciusStage(score: number): string {
  if (score >= 88) return '지대지강(천지간에 충만한 맑은 기상)';
  if (score >= 76) return '집의 축적(꾸준히 뿌리내리는 기운)';
  return '발아 성찰(사단의 싹을 돌보는 단계)';
}

export function formatMenciusFourSproutsHoyeonPrompt(res: MenciusFourSproutsHoyeonResult): string {
  return [
    `【고대 중국 맹자 사단사덕(四端四德) & 호연지기(浩然之氣) 성찰 (${res.engineVersion})】`,
    `- 호연지기 대기운 결: ${describeMenciusStage(res.hoyeonJigiGreatVitalityScore)}`,
    `- 사단사덕 확충 흐름: ${describeMenciusStage(res.fourSproutsCultivationLevel)}`,
    `- 부동심 내면 평정: ${describeMenciusStage(res.buDongXinSteadfastness)}`,
    `- 집의(集義) 정직 축적: ${describeMenciusStage(res.jiYiMoralAccumulation)}`,
    `- 대장부 당당한 기개: ${describeMenciusStage(res.daejangbuNobility)}`,
    `- 집중 확충 사단: ${res.activeMenciusStage.stageNameHanja} (${res.activeMenciusStage.stageNameKo})`,
    `- 질문 맥락 도덕 감사 (${res.situationalMoralAudit.themeKo} · ${res.situationalMoralAudit.menciusCitation}): "${res.situationalMoralAudit.translationKo}" [${res.situationalMoralAudit.hanjaQuote}]`,
    `- 조장(助長) 함정: ${res.situationalMoralAudit.jojangTrap}`,
    `- 일일 집의(集義) 의례: ${res.dailyPracticeRitual}`,
    `- KST 호연지기 리듬: ${res.temporalHoyeonRhythm.kstWindow} (${res.temporalHoyeonRhythm.sproutFocus}, ${res.temporalHoyeonRhythm.seasonalTone}, 명료 결: ${describeMenciusStage(res.temporalHoyeonRhythm.hoyeonClarityIndex)})`,
    `- 맹자 조화 흐름: 사단 균형 [${describeMenciusStage(res.menciusSynthesisMatrix.fourSproutsBalance)}] / 집의 축적 [${describeMenciusStage(res.menciusSynthesisMatrix.jiYiAccumulation)}] / 부동심 안정 [${describeMenciusStage(res.menciusSynthesisMatrix.buDongXinSteadiness)}]`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 철학적 처방: ${res.menciusPhilosophicalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
