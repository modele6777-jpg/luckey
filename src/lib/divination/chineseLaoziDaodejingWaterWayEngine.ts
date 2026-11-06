/**
 * 고대 중국 노자(老子) 《도덕경(道德經)》 81장 상선약수(上善若水) & 무위자연(無爲自然) 엔진
 *
 * 춘추전국시대 도가(道家) 종사 노자의 《도덕경》 81장 원전 기반.
 * 1. 상선약수(上善若水): 만물을 이롭게 하면서도 다투지 않고 가장 낮은 곳에 머무는 물의 덕성.
 * 2. 무위이무불위(無爲而無不爲): 억지 부림 없이 자연의 순리에 맡김으로써 이루지 못함이 없음.
 * 3. 화광동진(和光同塵): 제 빛을 부드럽게 감추어 세상의 먼지와 티끌에 함께 어우러지는 겸양.
 * 4. 지족부욕(知足不辱) 지지불태(知止不殆): 만족할 줄 알면 욕되지 않고, 머물 줄 알면 위태롭지 않음.
 * 5. 대기만성(大器晩成): 큰 그릇은 늦게 완성되며, 서두르지 않는 깊은 내면의 도량.
 *
 * @version LUCKEY-LAOZI-DAODEJING-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const LAOZI_DAODEJING_VERSION = 'LUCKEY-LAOZI-DAODEJING-v1.0.0';

export interface DaodejingStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  daoDomain: string;
  cosmicWaterBlessing: string;
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

export function calculateLaoziDaodejing(profile?: UserProfile): LaoziDaodejingResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`LAOZI-DAODEJING-${birthdate}-${birthtime}-${name}`);

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

  return {
    engineVersion: LAOZI_DAODEJING_VERSION,
    calculatedAtKst: getKstDateString(),
    waterYieldingAdaptabilityScore,
    wuweiEffortlessActionForce,
    harmoniousLightSofteningIndex,
    contentmentNonGraspingPower,
    greatVesselPatienceMaturity,
    activeDaodejingStage,
    primaryDaoPrinciple,
    daodejingCosmicEpiphany,
  };
}

export function formatLaoziDaodejingPrompt(result: LaoziDaodejingResult): string {
  return `[☯️ 고대 중국 노자(老子) 《도덕경(道德經)》 상선약수 & 무위자연 리포트]
- 엔진 버전: ${result.engineVersion}
- 상선약수 유연 적응도: ${result.waterYieldingAdaptabilityScore}%
- 무위이무불위 자연 순응력: ${result.wuweiEffortlessActionForce}%
- 화광동진 포용 및 조화력: ${result.harmoniousLightSofteningIndex}%
- 지족부욕 지지불태 만족력: ${result.contentmentNonGraspingPower}%
- 대기만성 지구력 및 심도: ${result.greatVesselPatienceMaturity}%
- 현행 도가적 품계: **[${result.activeDaodejingStage.stageNameKo} (${result.activeDaodejingStage.stageNameHanja})]**
  → 관장 영역: ${result.activeDaodejingStage.daoDomain}
  → 섭리의 축복: ${result.activeDaodejingStage.cosmicWaterBlessing}
- 최우선 도가 지침: **[${result.primaryDaoPrinciple.principleTitleKo} (${result.primaryDaoPrinciple.hanjaMotto})]**
  → 핵심 본질: ${result.primaryDaoPrinciple.coreEssence}
  → 실천 지침: ${result.primaryDaoPrinciple.actionableDirective}
- 도덕경 불멸의 계시: 《${result.daodejingCosmicEpiphany.chapterSceneTitle}》
  → 무위의 지혜: "${result.daodejingCosmicEpiphany.timelessWisdom}"`;
}
