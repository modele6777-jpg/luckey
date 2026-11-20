/**
 * 고대 로마 철학 황제 마르쿠스 아우렐리우스 《명상록(Meditations)》 내면의 요새(Inner Citadel) & 우주적 이성 엔진
 *
 * 서기 2세기 로마 제국의 16대 황제이자 스토아 철학자 마르쿠스 아우렐리우스 안토니누스의 《명상록(Τὰ εἰς ἑαυτόν)》 원전 기반.
 * 1. 내면의 성채(Inner Citadel, Book IV.3): 외부의 비난, 불운, 혼란이 결코 침투할 수 없는 영혼의 불가침 요새
 * 2. 지휘부 이성(Hegemonikon, Book II.1, VIII.48): 외부 인상(Phantasia)에 휘둘리지 않고 스스로 판단하는 영혼의 사령부
 * 3. 찰나의 현재(Hic et nunc, Book II.14, III.10): 지나간 과거나 알 수 없는 미래의 번민을 내려놓고 지금 여기에 온전히 현존함
 * 4. 코스모폴리스(Cosmopolis, Book IV.4, VI.44)와 공동선: 우주 전체의 유기적 일원으로서 공공의 이익에 헌신함
 * 5. 아모르 파티(Amor Fati, Book IV.23, V.20): 장애물이 곧 길이 되며 모든 운명을 덕(Arete)으로 전환함
 * 6. 질문 기반 통제 이분법(Dichotomy of Control) + 로마 황제 일과(아침 예행연습·저녁 성찰) 연동
 *
 * @version LUCKEY-AURELIUS-INNER-CITADEL-v2.6.0
 */

import type { UserProfile } from '../sharedState';

export const AURELIUS_INNER_CITADEL_VERSION = 'LUCKEY-AURELIUS-INNER-CITADEL-v2.6.0';

export interface AureliusStage {
  stageLevel: number;
  stageNameLatin: string;
  stageNameKo: string;
  stoicDomain: string;
  citadelBlessing: string;
}

export type AureliusControlTheme =
  | 'external_judgment'
  | 'obstacle_as_way'
  | 'present_moment'
  | 'duty_and_justice'
  | 'mortality_perspective'
  | 'self_mastery';

export interface AureliusControlDichotomy {
  theme: AureliusControlTheme;
  bookReference: string;
  internalSovereigntyRatio: number; // 0~100: 내면 주권 영역 비중
  uncontrollableNoiseKo: string; // 내려놓아야 할 외부 변수
  sovereignActionKo: string; // 내가 지금 통제할 수 있는 선택
  reflectionQuestion: string;
}

export interface AureliusDailyStoicPractice {
  kstHour: number;
  practiceMode: '아침 예행연습 (Praemeditatio)' | '한낮의 현존 (Hic et nunc)' | '저녁 자기 성찰 (Examen)';
  protocolTitleKo: string;
  protocolDirective: string;
}

export interface AureliusCitadelResilienceMatrix {
  phantasiaDetachmentScore: number; // 0~100: 외부 자극에 대한 판단 보류·거리두기 지수
  amorFatiConversionIndex: number; // 0~100: 장애물을 성장 연료로 바꾸는 변환력
  cosmopolisContributionGuide: string;
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
  // v2.0.0 다차원 질적 성찰 & 시공간 교차 검증
  controlDichotomy: AureliusControlDichotomy;
  dailyStoicPractice: AureliusDailyStoicPractice;
  citadelResilienceMatrix: AureliusCitadelResilienceMatrix;
  aureliusSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion?: string;
  interpretiveBoundary: string;
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

const CONTROL_DICHOTOMIES: Record<AureliusControlTheme, Omit<AureliusControlDichotomy, 'internalSovereigntyRatio'>> = {
  external_judgment: {
    theme: 'external_judgment',
    bookReference: '《명상록》 제4권 3장 · 제9권 42장',
    uncontrollableNoiseKo: '타인의 시선, 평판, 상대방이 나를 어떻게 오해하는가',
    sovereignActionKo: '내 말과 행동의 진실성, 감정적 흔들림 없이 내면 성채로 물러나는 선택',
    reflectionQuestion: '남의 마음속에 세워진 평가를 통제하려 애쓰느라, 정작 내 성채의 평화를 잃고 있지는 않으신가요?',
  },
  obstacle_as_way: {
    theme: 'obstacle_as_way',
    bookReference: '《명상록》 제5권 20장 (Obstacle is the Way)',
    uncontrollableNoiseKo: '예기치 못한 장애물, 지연, 외부 환경의 변덕',
    sovereignActionKo: '그 막힘을 소재 삼아 인내·창의성·절제라는 덕목을 실행하는 태도',
    reflectionQuestion: '지금 앞길을 막고 있는 걸림돌이 오히려 내가 단련할 수 있는 유일한 재료라면, 오늘 무엇을 시도할 수 있을까요?',
  },
  present_moment: {
    theme: 'present_moment',
    bookReference: '《명상록》 제2권 14장 · 제8권 36장',
    uncontrollableNoiseKo: '이미 지나간 과거의 후회와 아직 오지 않은 미래 전체에 대한 막연한 공포',
    sovereignActionKo: '오직 오늘, 지금 눈앞의 한 가지 일에 온전한 정성을 들이는 집중',
    reflectionQuestion: '미래 전체의 무게를 오늘 하루에 한꺼번에 짊어지려 해서 마음이 무너지고 있지는 않으신가요?',
  },
  duty_and_justice: {
    theme: 'duty_and_justice',
    bookReference: '《명상록》 제6권 44장 · 제9권 23장',
    uncontrollableNoiseKo: '타인의 무례함이나 세상의 불공정함이 즉각 바뀌지 않는 현실',
    sovereignActionKo: '공동선(코스모폴리스)과 나의 양심에 부끄럽지 않은 정직한 한 걸음',
    reflectionQuestion: '누가 알아주지 않더라도 내가 마땅히 지켜야 할 품격과 정의로운 기준은 무엇인가요?',
  },
  mortality_perspective: {
    theme: 'mortality_perspective',
    bookReference: '《명상록》 제4권 48장 · 제7권 56장',
    uncontrollableNoiseKo: '유한한 시간의 흐름과 영원히 변치 않을 것 같은 세속적 집착',
    sovereignActionKo: '사소한 분노를 흘려보내고 지금 곁에 있는 사람과 진실한 순간을 아끼는 마음',
    reflectionQuestion: '10년 뒤의 우주적 시선으로 오늘의 고민을 내려다본다면, 지금 가장 소중히 붙잡아야 할 것은 무엇일까요?',
  },
  self_mastery: {
    theme: 'self_mastery',
    bookReference: '《명상록》 제8권 48장 · 제10권 1장',
    uncontrollableNoiseKo: '순간적으로 치솟는 충동, 감정의 파도, 외부의 유혹',
    sovereignActionKo: '인상(Phantasia)과 판단 사이에 3초의 여백을 두고 헤게모니콘(이성 사령부)을 가동하기',
    reflectionQuestion: '감정이 나를 지배하게 두기 전에, 내 영혼의 지휘부가 스스로 내린 맑은 명령은 무엇인가요?',
  },
};

function getKstDate(now?: Date): Date {
  const base = now ?? new Date();
  return new Date(base.getTime() + (9 * 60 + base.getTimezoneOffset()) * 60000);
}

function getKstDateString(now?: Date): string {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeCitadelStage(score: number): string {
  if (score >= 86) return '불침투 성채 확립기 (외부 소음과 인상에 흔들리지 않고 헤게모니콘의 중심을 지키는 국면)';
  if (score >= 74) return '스토아 주권 조율기 (통제할 수 있는 내면의 선택으로 시선을 돌리는 국면)';
  return '성채 정비 휴식기 (판단을 잠시 보류하고 존엄과 여백을 먼저 회복할 국면)';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function classifyAureliusTheme(question: string | undefined, seed: number): AureliusControlTheme {
  const q = (question || '').toLowerCase();
  if (/평판|눈치|비난|오해|평가|남|시선|인정/.test(q)) return 'external_judgment';
  if (/장애|실패|막히|어려|불운|고난|위기|문제/.test(q)) return 'obstacle_as_way';
  if (/불안|미래|과거|후회|걱정|오늘|시간|집중/.test(q)) return 'present_moment';
  if (/책임|의무|정의|공정|직장|일|동료|관계|배려/.test(q)) return 'duty_and_justice';
  if (/인생|삶|의미|죽음|후회|가치|본질|영원/.test(q)) return 'mortality_perspective';
  if (/감정|화|분노|충동|습관|절제|마음|평정/.test(q)) return 'self_mastery';

  const order: AureliusControlTheme[] = [
    'external_judgment',
    'obstacle_as_way',
    'present_moment',
    'duty_and_justice',
    'mortality_perspective',
    'self_mastery',
  ];
  return order[seed % order.length];
}

function buildDailyStoicPractice(kstDate: Date): AureliusDailyStoicPractice {
  const hour = kstDate.getUTCHours();
  if (hour >= 5 && hour < 11) {
    return {
      kstHour: hour,
      practiceMode: '아침 예행연습 (Praemeditatio)',
      protocolTitleKo: '하루의 변수와 타인의 미숙함을 미리 품고 출발하는 의식',
      protocolDirective: '오늘 만날 예기치 못한 지연이나 까다로운 사람을 미리 떠올리며 "나는 흔들리지 않고 덕성으로 답하겠다"고 먼저 결심하십시오.',
    };
  }
  if (hour >= 11 && hour < 19) {
    return {
      kstHour: hour,
      practiceMode: '한낮의 현존 (Hic et nunc)',
      protocolTitleKo: '인상(Phantasia)에 즉각 반응하지 않고 성채로 물러나는 호흡',
      protocolDirective: '자극이 올 때 1차 인상과 2차 가치 판단을 분리하십시오. "이것은 사실일 뿐, 나를 해치는 것은 내 해석이 아니다"라고 되뇌십시오.',
    };
  }
  return {
    kstHour: hour,
    practiceMode: '저녁 자기 성찰 (Examen)',
    protocolTitleKo: '하루를 마감하며 세 가지 질문을 건네는 황제의 침묵 노트',
    protocolDirective: '오늘 잘 견뎌낸 순간 하나, 감정에 휩쓸렸던 순간 하나, 내일 더 나아질 작은 태도 하나를 고요히 기록하고 잠드십시오.',
  };
}

export function calculateAureliusInnerCitadel(
  profile?: UserProfile,
  question?: string,
  now?: Date,
): AureliusInnerCitadelResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const kstDate = getKstDate(now);
  const seed = hashSeed(`AURELIUS-CITADEL-${birthdate}-${birthtime}-${name}`);
  const qSeed = hashSeed(`AURELIUS-Q-${question || ''}-${kstDate.getUTCFullYear()}-${kstDate.getUTCMonth() + 1}-${kstDate.getUTCDate()}`);

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

  const theme = classifyAureliusTheme(question, qSeed);
  const baseDichotomy = CONTROL_DICHOTOMIES[theme];
  const internalSovereigntyRatio = Math.min(98, Math.round((hegemonikonSovereignSoul + innerCitadelFortressScore) / 2));

  const controlDichotomy: AureliusControlDichotomy = {
    ...baseDichotomy,
    internalSovereigntyRatio,
  };

  const dailyStoicPractice = buildDailyStoicPractice(kstDate);

  const phantasiaDetachmentScore = Math.min(99, Math.round((innerCitadelFortressScore + hicEtNuncPresentPresence) / 2));
  const amorFatiConversionIndex = Math.min(99, Math.round((amorFatiCosmicAcceptance + hegemonikonSovereignSoul) / 2));

  const citadelResilienceMatrix: AureliusCitadelResilienceMatrix = {
    phantasiaDetachmentScore,
    amorFatiConversionIndex,
    cosmopolisContributionGuide:
      cosmopolisCommonGoodIndex >= 75
        ? '공동선(Cosmopolis)과의 연대 감각이 높습니다. 내 마음의 평정을 지킨 뒤 곁에 있는 한 사람에게 작은 친절과 공정을 베푸십시오.'
        : '외부 소음에 에너지가 소진되기 쉬운 상태입니다. 먼저 내면 성채의 문을 닫아 휴식과 존엄을 회복한 뒤 타인을 대하십시오.',
  };

  const trimmedQ = (question || '').trim();
  const aureliusSynthesisMatrix = {
    dominantTension: `${controlDichotomy.uncontrollableNoiseKo} ↔ ${controlDichotomy.sovereignActionKo}`,
    alignmentState: `${activeAureliusStage.stageNameLatin} · ${dailyStoicPractice.practiceMode}`,
    integratedAction: `${dailyStoicPractice.protocolDirective}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };
  const reflectiveQuestion = trimmedQ
    ? `지금 "${trimmedQ}" 앞에서 《명상록》(${controlDichotomy.bookReference})의 '${activeAureliusStage.stageNameLatin}'을 세울 때, 내가 통제할 수 없는 외부 소음을 떼어 내고 지켜야 할 주권 선택은 무엇인가요?`
    : controlDichotomy.reflectionQuestion;

  return {
    engineVersion: AURELIUS_INNER_CITADEL_VERSION,
    calculatedAtKst: getKstDateString(now),
    innerCitadelFortressScore,
    hicEtNuncPresentPresence,
    amorFatiCosmicAcceptance,
    cosmopolisCommonGoodIndex,
    hegemonikonSovereignSoul,
    activeAureliusStage,
    primaryMeditationsPrecept,
    citadelEmperorSoliloquy,
    controlDichotomy,
    dailyStoicPractice,
    citadelResilienceMatrix,
    aureliusSynthesisMatrix,
    ritualAction: `[${dailyStoicPractice.practiceMode}] '${controlDichotomy.sovereignActionKo}'에 집중하여 ${dailyStoicPractice.protocolDirective}`,
    reflectionFocus: `아우렐리우스 명상록(${activeAureliusStage.stageNameLatin}) — ${controlDichotomy.bookReference}`,
    reflectiveQuestion,
    interpretiveBoundary: '본 리포트는 마르쿠스 아우렐리우스 《명상록》의 스토아 자기 성찰 원리에 기반한 정성적 안내이며, 확정적 예단이 아닙니다.',
  };
}

export function formatAureliusInnerCitadelPrompt(result: AureliusInnerCitadelResult): string {
  const avgCore = Math.round((result.innerCitadelFortressScore + result.hegemonikonSovereignSoul + result.amorFatiCosmicAcceptance) / 3);
  const matrixLine = result.aureliusSynthesisMatrix
    ? `\n- 아우렐리우스 교차 매트릭스: 핵심 긴장(${result.aureliusSynthesisMatrix.dominantTension}) · 조율 상태(${result.aureliusSynthesisMatrix.alignmentState}) · 통합 실천(${result.aureliusSynthesisMatrix.integratedAction})`
    : '';
  const questionLine = result.reflectiveQuestion
    ? `\n- 질문 맞춤 성찰 질문: ${result.reflectiveQuestion}`
    : '';
  return `[🏛️ 고대 로마 마르쿠스 아우렐리우스 《명상록(Meditations)》 내면의 성채 & 스토아 평정 리포트]
- 엔진 버전: ${result.engineVersion} | 연산 시각: ${result.calculatedAtKst}
- 내면의 성채 위상: **${describeCitadelStage(avgCore)}**
- 현행 스토아적 영혼 품계: **[${result.activeAureliusStage.stageNameKo} (${result.activeAureliusStage.stageNameLatin})]**
  → 관장 영역: ${result.activeAureliusStage.stoicDomain}
  → 성채의 축복: ${result.activeAureliusStage.citadelBlessing}
- 통제 이분법(Dichotomy of Control) 분류 (${result.controlDichotomy.bookReference}):
  → 내려놓을 외부 변수: ${result.controlDichotomy.uncontrollableNoiseKo}
  → 내가 통제할 주권 선택: ${result.controlDichotomy.sovereignActionKo}
  → 성찰 질문: ${result.controlDichotomy.reflectionQuestion}
- 일일 스토아 실천 리듬 (${result.dailyStoicPractice.practiceMode}): ${result.dailyStoicPractice.protocolTitleKo}
  → 실천 프로토콜: ${result.dailyStoicPractice.protocolDirective}
- 공동선(Cosmopolis) 안내: ${result.citadelResilienceMatrix.cosmopolisContributionGuide}
- 최우선 명상록 실천 잠언: **[${result.primaryMeditationsPrecept.preceptTitleKo} (${result.primaryMeditationsPrecept.latinAphorism})]**
  → 핵심 본질: ${result.primaryMeditationsPrecept.coreEssence}
  → 실천 지침: ${result.primaryMeditationsPrecept.actionableDirective}
- 철학 황제의 내면 독백: 《${result.citadelEmperorSoliloquy.soliloquyTitle}》
  → 고결한 명상 조언: "${result.citadelEmperorSoliloquy.meditativeCounsel}"
- 실천 의례: ${result.ritualAction}
- 성찰 초점: ${result.reflectionFocus}
- 해석 경계: 본 리포트는 마르쿠스 아우렐리우스 《명상록》의 스토아 자기 성찰 원리에 기반한 정성적 안내이며, 확정적 예단이 아닙니다.${matrixLine}${questionLine}`;
}
