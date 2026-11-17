/**
 * 고대 중국 노자(老子) 《도덕경(道德經)》 81장 상선약수(上善若水) & 무위자연(無爲自然) 엔진
 *
 * 춘추전국시대 도가(道家) 종사 노자의 《도덕경》 81장 원전 기반.
 * 1. 상선약수(上善若水, 제8장): 만물을 이롭게 하면서도 다투지 않고 가장 낮은 곳에 머무는 물의 덕성.
 * 2. 무위이무불위(無爲而無不爲, 제37장·제48장): 억지 부림 없이 자연의 순리에 맡김으로써 이루지 못함이 없음.
 * 3. 화광동진(和光同塵, 제56장): 제 빛을 부드럽게 감추어 세상의 먼지와 티끌에 함께 어우러지는 겸양.
 * 4. 지족부욕(知足不辱) 지지불태(知止不殆, 제44장): 만족할 줄 알면 욕되지 않고, 머물 줄 알면 위태롭지 않음.
 * 5. 대기만성(大器晩成, 제41장) & 유약승강강(柔弱勝剛强, 제36장·제78장): 부드러움이 굳셈을 이기는 깊은 내공.
 * 6. 질문 맥락 공명 챕터 매핑 + 시공간 음양 수기(水氣) 리듬 + 여백-충만 균형 교차 검증
 *
 * @version LUCKEY-LAOZI-DAODEJING-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const LAOZI_DAODEJING_VERSION = 'LUCKEY-LAOZI-DAODEJING-v2.5.0';

export interface DaodejingStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  daoDomain: string;
  cosmicWaterBlessing: string;
}

export type DaodejingTheme =
  | 'non_contention_water'
  | 'emptiness_utility'
  | 'yielding_resilience'
  | 'contentment_stopping'
  | 'unhurried_maturity'
  | 'softening_light';

export interface DaodejingChapterResonance {
  theme: DaodejingTheme;
  chapterNumber: number;
  chapterTitle: string;
  originalHanja: string;
  translationKo: string;
  reflectionQuestion: string;
  wuweiUnburdeningTip: string;
}

export interface DaodejingSeasonalWaterFlow {
  kstHour: number;
  shichenName: string;
  seasonalQi: string;
  waterPacingScore: number; // 0~100: 무위 완급 조율 지수
  effortlessTimingCounsel: string;
}

export interface DaodejingSoftStrengthMatrix {
  emptinessFullnessRatio: number; // 0~100: 비움과 채움의 균형도
  nonContentionHarmonyScore: number; // 0~100: 다툼 회피 순리 지수
  yieldingOverRigidStrategy: string;
}

export interface LaoziDaodejingResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  waterYieldingAdaptabilityScore: number; // 상선약수 유연 적응도
  wuweiEffortlessActionForce: number; // 무위이무불위 자연 순응력
  harmoniousLightSofteningIndex: number; // 화광동진 포용 및 조화력
  contentmentNonGraspingPower: number; // 지족부욕 지지불태 만족력
  greatVesselPatienceMaturity: number; // 대기만성 지구력 및 심도
  // 세부 명세
  activeDaodejingStage: DaodejingStage;
  primaryDaoPrinciple: {
    principleTitleKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  daodejingCosmicEpiphany: {
    chapterSceneTitle: string;
    timelessWisdom: string;
  };
  // v2.0.0 다차원 질적 성찰 & 시공간 교차 검증
  chapterResonance: DaodejingChapterResonance;
  seasonalWaterFlow: DaodejingSeasonalWaterFlow;
  softStrengthMatrix: DaodejingSoftStrengthMatrix;
  laoziSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export type LaoziDaodejingReport = LaoziDaodejingResult;

const DAODEJING_STAGES: DaodejingStage[] = [
  { stageLevel: 1, stageNameHanja: '上善若水 (상선약수)', stageNameKo: '모든 만물을 살리며 가장 낮은 곳에 머무는 물의 경지', daoDomain: '다투지 않고 모난 모서리를 둥글게 감싸 안는 지고의 유연성', cosmicWaterBlessing: '세상의 어떤 억압 앞에서도 막힘없이 스스로 길을 내는 절대 평온' },
  { stageLevel: 2, stageNameHanja: '和光同塵 (화광동진)', stageNameKo: '빛을 누그러뜨려 세상의 먼지와 함께하는 화평관', daoDomain: '자신의 지혜와 능력을 뽐내지 않고 타인을 편안하게 해 줌', cosmicWaterBlessing: '적을 만들지 않고 은밀하게 모든 일을 성취하는 부드러운 힘' },
  { stageLevel: 3, stageNameHanja: '無爲而治 (무위이치)', stageNameKo: '억지를 부리지 않고 섭리의 흐름을 타는 조화관', daoDomain: '과도한 욕심과 개입을 내려놓고 스스로 질서를 찾게 함', cosmicWaterBlessing: '애쓰지 않아도 때가 되면 만물이 제자리로 돌아오는 순리의 은총' },
  { stageLevel: 4, stageNameHanja: '知足常足 (지족상족)', stageNameKo: '이미 가진 것에 감사하며 분수를 아는 청정관', daoDomain: '끝없는 갈증과 비교를 멈추고 내면의 충만함을 발견함', cosmicWaterBlessing: '세상 그 누구에게도 휘둘리지 않는 굳건한 자유와 안식' },
  { stageLevel: 5, stageNameHanja: '大巧若拙 (대교약졸)', stageNameKo: '참된 큰 솜씨는 오히려 서툴러 보이는 깊이관', daoDomain: '기교와 잔꾀를 부리지 않고 묵직한 진정성으로 신뢰를 얻음', cosmicWaterBlessing: '겉모습의 화려함을 넘어 세월이 흐를수록 빛나는 진정한 가치' },
  { stageLevel: 6, stageNameHanja: '見素抱樸 (견소포박)', stageNameKo: '꾸밈없는 흰 실처럼 질박한 순수를 품는 통찰관', daoDomain: '세속의 복잡한 잣대를 걷어내고 인간 본연의 소박함을 지킴', cosmicWaterBlessing: '순수한 마음으로 사물의 본질을 꿰뚫어 보는 맑은 눈빛' },
  { stageLevel: 7, stageNameHanja: '大器晩成 (대기만성)', stageNameKo: '큰 그릇은 늦게 이루어지니 조급함을 버리는 숙성관', daoDomain: '조급한 성과주의에 흔들리지 않고 묵묵히 내공을 기르는 인내', cosmicWaterBlessing: '시간이 빚어낸 가장 단단하고 울림이 깊은 거대한 결실' },
];

const DAO_PRINCIPLES = [
  { principleTitleKo: '상선약수(上善若水): 흐르는 물처럼 유연하게 부딪히지 말라', hanjaMotto: '水善利萬物而不爭', coreEssence: '바위를 만나면 비껴 흐르고 구덩이를 만나면 채우고 나아감', actionableDirective: '정면충돌이나 쓸데없는 논쟁을 피하고 상황의 흐름에 맞춰 부드럽게 우회하십시오.' },
  { principleTitleKo: '무위자연(無爲自然): 억지 부림을 내려놓고 본래의 순리에 맡기라', hanjaMotto: '道法自然', coreEssence: '무리한 욕심과 조작을 거두고 모든 것이 스스로 피어나게 도움', actionableDirective: '모든 것을 통제하려는 불안을 내려놓고 때가 무르익을 때까지 기다리십시오.' },
  { principleTitleKo: '지족부욕(知足不辱): 멈출 때를 알고 스스로 만족함을 배우라', hanjaMotto: '知足不辱 知止不殆', coreEssence: '과도한 탐욕이 부르는 패착을 경계하고 현재의 성취에 감사함', actionableDirective: '더 많은 것을 거머쥐려 과욕을 부리지 말고 알맞은 선에서 매듭지으십시오.' },
  { principleTitleKo: '화광동진(和光同塵): 날카로운 빛을 거두고 세간과 온화하게 어우러지라', hanjaMotto: '挫其銳 解其紛 和其光 同其塵', coreEssence: '자신의 우월함을 내세우지 않고 겸허하게 낮은 자세로 소통함', actionableDirective: '자랑하고 싶은 마음을 가라앉히고 상대방의 눈높이에 맞춰 진솔하게 귀 기울이십시오.' },
];

const DAODEJING_EPIPHANIES = [
  { chapterSceneTitle: '골짜기의 빈 공간이 울림을 빚어내는 현빈의 문', timelessWisdom: '속을 비울 때 비로소 온 세상을 담을 수 있나니, 마음에 가득 찬 집착을 비워내라.' },
  { chapterSceneTitle: '수레바퀴의 서른 개 살이 모이는 한가운데 빈 축', timelessWisdom: '존재하는 것의 쓰임새는 보이지 않는 비어 있음에 있나니, 여백의 지혜를 소중히 하라.' },
  { chapterSceneTitle: '살아있는 풀과 나무의 부드러움과 유연함', timelessWisdom: '굳고 강한 것은 죽음의 무리요 부드럽고 유연한 것은 생명의 무리이니, 결코 유연함을 잃지 마라.' },
  { chapterSceneTitle: '바다로 흘러드는 천하의 백천 가지 시냇물', timelessWisdom: '바다가 모든 강의 으뜸이 될 수 있는 까닭은 스스로 가장 낮은 곳에 있기 때문이다.' },
];

const CHAPTER_RESONANCES: Record<DaodejingTheme, DaodejingChapterResonance> = {
  non_contention_water: {
    theme: 'non_contention_water',
    chapterNumber: 8,
    chapterTitle: '제8장 상선약수(上善若水)',
    originalHanja: '夫唯不爭 故無尤',
    translationKo: '오직 다투지 않으므로 허물이 없다.',
    reflectionQuestion: '지금 꼭 이겨야 한다고 여기는 승부가 사실은 다투지 않고도 더 크게 얻을 수 있는 길은 아닐까요?',
    wuweiUnburdeningTip: '상대와 정면으로 맞서기보다 낮고 넓은 자리에서 상대의 필요가 자연히 흘러오게 두십시오.',
  },
  emptiness_utility: {
    theme: 'emptiness_utility',
    chapterNumber: 11,
    chapterTitle: '제11장 무지이용(無之以爲用)',
    originalHanja: '埏埴以爲器 當其無 有器之用',
    translationKo: '진흙을 빚어 그릇을 만들지만 그 안의 빈 공간 덕분에 그릇의 쓰임이 생긴다.',
    reflectionQuestion: '일정과 생각을 빈틈없이 채우려다 정작 새로운 숨결과 영감이 들어올 여백을 막고 있지는 않으신가요?',
    wuweiUnburdeningTip: '오늘 해야 할 일 목록에서 굳이 내가 직접 쥐고 있지 않아도 될 한 가지를 과감히 비워 보십시오.',
  },
  yielding_resilience: {
    theme: 'yielding_resilience',
    chapterNumber: 22,
    chapterTitle: '제22장 곡즉전(曲則全)',
    originalHanja: '曲則全 枉則直 窪則盈 弊則新',
    translationKo: '굽히면 온전해지고, 휘어지면 곧아지며, 움푹 파이면 차오르고, 낡으면 새로워진다.',
    reflectionQuestion: '완벽한 직선으로만 밀고 나가려다 오히려 작은 바람에도 부러질 뻔한 순간은 없었나요?',
    wuweiUnburdeningTip: '잠시 한 걸음 물러나거나 우회하는 선택을 패배가 아닌 온전한 보존의 지혜로 받아들이십시오.',
  },
  contentment_stopping: {
    theme: 'contentment_stopping',
    chapterNumber: 44,
    chapterTitle: '제44장 지족지(知足知止)',
    originalHanja: '知足不辱 知止不殆 可以長久',
    translationKo: '만족할 줄 알면 욕되지 않고, 멈출 줄 알면 위태롭지 않으니 오래도록 평안하다.',
    reflectionQuestion: '충분히 잘 해내고 있음에도 ‘조금만 더’라는 조바심이 지금의 평온을 갉아먹고 있지는 않으신가요?',
    wuweiUnburdeningTip: '오늘의 성취에 명확한 마침표(지지·知止)를 찍고, 더 이상의 과잉 개입을 멈추십시오.',
  },
  unhurried_maturity: {
    theme: 'unhurried_maturity',
    chapterNumber: 45,
    chapterTitle: '제45장 대교약졸(大巧若拙)',
    originalHanja: '躁勝寒 靜勝熱 清靜爲天下正',
    translationKo: '움직임이 추위를 이기듯 고요함은 들뜬 열기를 이기나니, 맑고 고요함이 천하의 바른 기준이다.',
    reflectionQuestion: '빠른 결과를 재촉하는 조급함이 오히려 큰 그릇이 무르익을 시간을 빼앗고 있지는 않으신가요?',
    wuweiUnburdeningTip: '속도를 내기 전에 들뜬 마음을 먼저 가라앉히고, 묵직한 기본기 하나를 조용히 다지십시오.',
  },
  softening_light: {
    theme: 'softening_light',
    chapterNumber: 56,
    chapterTitle: '제56장 화광동진(和光同塵)',
    originalHanja: '挫其銳 解其紛 和其光 同其塵',
    translationKo: '날카로운 모서리를 무디게 하고 얽힘을 풀며, 빛을 부드럽게 하여 티끌과 함께 어우른다.',
    reflectionQuestion: '내 논리의 날카로움을 앞세우느라 상대가 마음 편히 다가올 온기를 가리고 있지는 않으신가요?',
    wuweiUnburdeningTip: '정답을 증명하려 하기보다 상대의 입장을 먼저 공감하며 대화의 각을 부드럽게 낮추십시오.',
  },
};

function getKstDate(now?: Date): Date {
  const base = now ?? new Date();
  return new Date(base.getTime() + (9 * 60 + base.getTimezoneOffset()) * 60000);
}

function getKstDateString(now?: Date): string {
  return `${getKstDate(now).toISOString().slice(0, 19)}+09:00`;
}

function describeDaodejingWaterStage(harmonyScore: number): string {
  if (harmonyScore >= 85) return '상선약수 순류기 (다툼 없이 낮은 자리에서 자연스럽게 길이 열리는 국면)';
  if (harmonyScore >= 72) return '무위 완급 조율기 (억지 추진을 줄이고 여백을 확보하며 흐름을 타는 국면)';
  return '화광동진 숙성기 (날카로운 조바심을 누그러뜨리고 내실의 때를 기다릴 국면)';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function classifyDaodejingTheme(question: string | undefined, seed: number): DaodejingTheme {
  const q = (question || '').toLowerCase();
  if (/경쟁|다툼|이기|승부|갈등|비교|논쟁/.test(q)) return 'non_contention_water';
  if (/비우|여백|휴식|번아웃|지치|복잡|정리|덜어/.test(q)) return 'emptiness_utility';
  if (/꺾이|막히|굽히|실패|우회|유연|어려움|포기/.test(q)) return 'yielding_resilience';
  if (/욕심|불안|만족|멈추|돈|재물|성과|집착/.test(q)) return 'contentment_stopping';
  if (/조급|느리|기다리|시간|성장|준비|진로|결실/.test(q)) return 'unhurried_maturity';
  if (/관계|소통|대화|사람|오해|화해|겸손|배려/.test(q)) return 'softening_light';

  const order: DaodejingTheme[] = [
    'non_contention_water',
    'emptiness_utility',
    'yielding_resilience',
    'contentment_stopping',
    'unhurried_maturity',
    'softening_light',
  ];
  return order[seed % order.length];
}

function buildSeasonalWaterFlow(kstDate: Date, wuweiForce: number): DaodejingSeasonalWaterFlow {
  const hour = kstDate.getUTCHours();
  const month = kstDate.getUTCMonth() + 1;

  const shichenList = [
    '자시(子時·깊은 밤 수기 충만)', '축시(丑時·고요한 여명 대기)', '인시(寅時·만물 생동 시작)',
    '묘시(卯時·아침 이슬 조화)', '진시(辰時·물길이 트이는 때)', '사시(巳時·빛과 물의 균형)',
    '오시(午時·양기 절정·절제 요망)', '미시(未時·느슨한 숨고르기)', '신시(申時·실용적 흐름 조율)',
    '유시(酉時·수렴과 정돈의 때)', '술시(戌時·빛을 거두는 화광동진)', '해시(亥時·근원으로 돌아가는 귀근)',
  ];
  const shichenIdx = Math.floor(((hour + 1) % 24) / 2);
  const shichenName = shichenList[shichenIdx];

  let seasonalQi = '동장(冬藏): 뿌리에 기운을 모으고 고요히 내실을 다지는 수기(水氣)의 계절';
  let seasonBonus = 8;
  if (month >= 3 && month <= 5) {
    seasonalQi = '춘생(春生): 얼음이 녹아 자연스레 시냇물이 흐르기 시작하는 순리의 계절';
    seasonBonus = 6;
  } else if (month >= 6 && month <= 8) {
    seasonalQi = '하장(夏長): 왕성한 양기 속에서 지나친 조급함을 물의 차분함으로 식혀야 하는 계절';
    seasonBonus = 2;
  } else if (month >= 9 && month <= 11) {
    seasonalQi = '추수(秋收): 겉잎을 떨어뜨리고 꼭 필요한 알곡만 남기는 지족(知足)의 계절';
    seasonBonus = 7;
  }

  const waterPacingScore = Math.min(99, Math.round(wuweiForce * 0.88 + seasonBonus));
  const effortlessTimingCounsel =
    hour >= 11 && hour < 15
      ? '양기가 가장 높은 시간대이므로 억지 추진을 줄이고 물 한 잔 마시듯 여유를 두고 판단하십시오.'
      : '억지 개입 없이 자연스럽게 흘러가는 결을 읽기 좋은 시간입니다. 순리에 맡기고 필요한 한 수만 두십시오.';

  return {
    kstHour: hour,
    shichenName,
    seasonalQi,
    waterPacingScore,
    effortlessTimingCounsel,
  };
}

export function calculateLaoziDaodejing(
  profile?: UserProfile,
  question?: string,
  now?: Date,
): LaoziDaodejingResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const kstDate = getKstDate(now);
  const seed = hashSeed(`LAOZI-DAODEJING-${birthdate}-${birthtime}-${name}`);
  const qSeed = hashSeed(`LAOZI-Q-${question || ''}-${kstDate.getUTCFullYear()}-${kstDate.getUTCMonth() + 1}-${kstDate.getUTCDate()}`);

  const waterYieldingAdaptabilityScore = (seed % 41) + 60; // 60~100
  const wuweiEffortlessActionForce = ((seed >> 3) % 43) + 58; // 58~100
  const harmoniousLightSofteningIndex = ((seed >> 5) % 39) + 62; // 62~100
  const contentmentNonGraspingPower = ((seed >> 7) % 45) + 55; // 55~99
  const greatVesselPatienceMaturity = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % DAODEJING_STAGES.length;
  const activeDaodejingStage = DAODEJING_STAGES[stageIdx];

  const principleIdx = (seed >> 4) % DAO_PRINCIPLES.length;
  const primaryDaoPrinciple = DAO_PRINCIPLES[principleIdx];

  const epiphanyIdx = (seed >> 6) % DAODEJING_EPIPHANIES.length;
  const daodejingCosmicEpiphany = DAODEJING_EPIPHANIES[epiphanyIdx];

  const theme = classifyDaodejingTheme(question, qSeed);
  const chapterResonance = CHAPTER_RESONANCES[theme];
  const seasonalWaterFlow = buildSeasonalWaterFlow(kstDate, wuweiEffortlessActionForce);

  const emptinessFullnessRatio = Math.min(99, Math.round((contentmentNonGraspingPower + wuweiEffortlessActionForce) / 2));
  const nonContentionHarmonyScore = Math.min(99, Math.round((waterYieldingAdaptabilityScore + harmoniousLightSofteningIndex) / 2));

  const softStrengthMatrix: DaodejingSoftStrengthMatrix = {
    emptinessFullnessRatio,
    nonContentionHarmonyScore,
    yieldingOverRigidStrategy:
      nonContentionHarmonyScore >= 75
        ? '부드러움으로 강함을 이기는 유약승강강(柔弱勝剛强)의 흐름이 원활합니다. 직접 부딪히기보다 낮은 자리에서 전체 흐름을 품으십시오.'
        : '스스로 기준을 너무 굳게 세워 피로가 쌓이기 쉬운 상태입니다. 오늘 한 가지는 완성도보다 여백과 유연성을 우선해 보십시오.',
  };

  const trimmedQ = (question || '').trim();
  const laoziSynthesisMatrix = {
    dominantTension: `${chapterResonance.chapterTitle} ↔ ${describeDaodejingWaterStage(nonContentionHarmonyScore)}`,
    alignmentState: `${activeDaodejingStage.stageNameHanja} · ${seasonalWaterFlow.shichenName}`,
    integratedAction: `${chapterResonance.wuweiUnburdeningTip}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const reflectiveQuestion = trimmedQ
    ? `질문 "${trimmedQ}" 앞에서, 지금 내가 힘을 빼고 물처럼 흘려보낼 수 있는 집착은 무엇이며 [${chapterResonance.chapterTitle}]이 묻는 바는 무엇인가요? (${chapterResonance.reflectionQuestion})`
    : chapterResonance.reflectionQuestion;

  return {
    engineVersion: LAOZI_DAODEJING_VERSION,
    calculatedAtKst: getKstDateString(now),
    waterYieldingAdaptabilityScore,
    wuweiEffortlessActionForce,
    harmoniousLightSofteningIndex,
    contentmentNonGraspingPower,
    greatVesselPatienceMaturity,
    activeDaodejingStage,
    primaryDaoPrinciple,
    daodejingCosmicEpiphany,
    chapterResonance,
    seasonalWaterFlow,
    softStrengthMatrix,
    laoziSynthesisMatrix,
    ritualAction: chapterResonance.wuweiUnburdeningTip,
    reflectionFocus: reflectiveQuestion,
    reflectiveQuestion,
    interpretiveBoundary: '본 리포트는 노자 《도덕경》의 무위·상선약수 철학에 기반한 정성적 성찰 안내이며, 확정적 길흉 예단이 아닙니다.',
  };
}

export function formatLaoziDaodejingPrompt(result: LaoziDaodejingResult): string {
  const matrixLine = result.laoziSynthesisMatrix
    ? `\n- 노자 도덕경 교차 매트릭스: 핵심 긴장(${result.laoziSynthesisMatrix.dominantTension}) · 조율 상태(${result.laoziSynthesisMatrix.alignmentState}) · 통합 실천(${result.laoziSynthesisMatrix.integratedAction})`
    : '';
  return `[☯️ 고대 중국 노자(老子) 《도덕경(道德經)》 상선약수 & 무위자연 리포트]
- 엔진 버전: ${result.engineVersion} | 연산 시각: ${result.calculatedAtKst}
- 도가 수기(水氣) 위상: **${describeDaodejingWaterStage(result.softStrengthMatrix.nonContentionHarmonyScore)}**
- 현행 도가적 품계: **[${result.activeDaodejingStage.stageNameKo} (${result.activeDaodejingStage.stageNameHanja})]**
  → 관장 영역: ${result.activeDaodejingStage.daoDomain}
  → 섭리의 축복: ${result.activeDaodejingStage.cosmicWaterBlessing}
- 질문 공명 《도덕경》 장(章): **[${result.chapterResonance.chapterTitle}]** — "${result.chapterResonance.translationKo}" (${result.chapterResonance.originalHanja})
  → 성찰 질문: ${result.chapterResonance.reflectionQuestion}
  → 무위 덜어내기: ${result.chapterResonance.wuweiUnburdeningTip}
- 시공간 수기(水氣) 리듬: ${result.seasonalWaterFlow.shichenName} / ${result.seasonalWaterFlow.seasonalQi}
  → 타이밍 조언: ${result.seasonalWaterFlow.effortlessTimingCounsel}
- 유약승강강 균형 제언: ${result.softStrengthMatrix.yieldingOverRigidStrategy}
- 최우선 도가 지침: **[${result.primaryDaoPrinciple.principleTitleKo} (${result.primaryDaoPrinciple.hanjaMotto})]**
  → 핵심 본질: ${result.primaryDaoPrinciple.coreEssence}
  → 실천 지침: ${result.primaryDaoPrinciple.actionableDirective}
- 도덕경 불멸의 계시: 《${result.daodejingCosmicEpiphany.chapterSceneTitle}》
  → 무위의 지혜: "${result.daodejingCosmicEpiphany.timelessWisdom}"
- 질문 맞춤 성찰 질문: ${result.reflectiveQuestion}
- 해석 경계: 본 리포트는 노자 《도덕경》의 무위·상선약수 철학에 기반한 정성적 성찰 안내이며, 확정적 길흉 예단이 아닙니다.${matrixLine}`;
}
