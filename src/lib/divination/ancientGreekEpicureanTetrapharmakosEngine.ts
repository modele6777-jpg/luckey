/**
 * 고대 그리스 에피쿠로스의 《테트라파르마코스(4대 치유약)》 영혼 평정 아타락시아 엔진
 *
 * 서기전 3세기 헬레니즘 철학자 에피쿠로스(Epicurus)의 정원(The Garden) 철학 원전 기반.
 * 1. 테트라파르마코스(Tetrapharmakos) 4대 영혼 치유약:
 *    - 신을 두려워하지 말라 (Don't fear God)
 *    - 죽음을 걱정하지 말라 (Don't worry about death)
 *    - 좋은 것은 얻기 쉽다 (What is good is easy to get)
 *    - 끔찍한 것은 견디기 쉽다 (What is terrible is easy to endure)
 * 2. 아타락시아(Ataraxia): 마음의 격동과 불안이 사라진 영혼의 절대적 평정.
 * 3. 아포니아(Aponia): 육체적 고통의 부재와 담백한 건강의 보존.
 * 4. 카타스테마틱 쾌락(Katastematic Pleasure): 헛된 욕망의 채움이 아닌 불안과 결핍의 완전한 해소.
 * 5. 정원의 우정(Philia): 소박한 빵과 물, 그리고 서로를 진심으로 아끼는 벗들과의 따뜻한 연대.
 *
 * @version LUCKEY-EPICUREAN-TETRAPHARMAKOS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const EPICUREAN_TETRAPHARMAKOS_VERSION = 'LUCKEY-EPICUREAN-TETRAPHARMAKOS-v1.0.0';

export interface EpicureanStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  gardenDomain: string;
  serenityBlessing: string;
}

export interface EpicureanTetrapharmakosResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  ataraxiaSoulTranquilityScore: number; // 아타락시아 영혼 평정도
  aponiaPhysicalEaseBalance: number; // 아포니아 고통 부재 및 안정도
  tetrapharmakosRemedyMastery: number; // 테트라파르마코스 4대 치유약 숙달도
  philiaGardenFriendshipForce: number; // 정원의 우정 및 따뜻한 연대력
  katastematicPleasureClarity: number; // 카타스테마틱 진정한 자족 쾌락도
  // 세부 명세
  activeEpicureanStage: EpicureanStage;
  primaryTetrapharmakosPrinciple: {
    principleTitleKo: string;
    greekMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  epicureanGardenEpiphany: {
    gardenSceneTitle: string;
    peacefulWisdom: string;
  };
}

export type EpicureanTetrapharmakosReport = EpicureanTetrapharmakosResult;

const EPICUREAN_STAGES: EpicureanStage[] = [
  { stageLevel: 1, stageNameGreek: 'Ataraxia (아타락시아)', stageNameKo: '모든 불안과 두려움의 파도가 멎은 영혼의 고요관', gardenDomain: '불필요한 욕망을 완전히 비우고 마음의 완벽한 평정을 누림', serenityBlessing: '세상의 혼란과 시련 앞에서도 잔물결조차 일지 않는 절대적 평화' },
  { stageLevel: 2, stageNameGreek: 'Aponia (아포니아)', stageNameKo: '육체의 고통을 덜고 담백한 조화를 유지하는 안녕관', gardenDomain: '과식과 과로를 피하고 자연스러운 몸의 균형을 돌봄', serenityBlessing: '가벼운 몸과 맑은 정신으로 매 순간의 편안함을 만끽하는 활력' },
  { stageLevel: 3, stageNameGreek: 'Philia (정원의 우정)', stageNameKo: '경쟁 없이 서로의 영혼을 품어주는 참된 벗의 연대관', gardenDomain: '조건 없는 신뢰와 따뜻한 대화로 삶의 두려움을 함께 녹임', serenityBlessing: '외로움 없이 든든한 지지 속에서 피어나는 깊은 심리적 안전감' },
  { stageLevel: 4, stageNameGreek: 'Autarkeia (자족)', stageNameKo: '적은 것으로도 충만함을 느끼는 소박한 지혜관', gardenDomain: '끝없는 소유욕과 세속적 허영을 멈추고 현재의 충분함에 감사함', serenityBlessing: '세상의 유행이나 결핍에 결코 쫓기지 않는 완전한 내적 자유' },
  { stageLevel: 5, stageNameGreek: 'Tetrapharmakos (4대 치유약)', stageNameKo: '미신과 죽음의 공포를 이성으로 치유한 해방관', gardenDomain: '불안을 유발하는 환상을 과학적이고 합리적인 시각으로 정화', serenityBlessing: '근거 없는 불안과 죄책감에서 벗어나 활짝 피어나는 영혼의 맑음' },
  { stageLevel: 6, stageNameGreek: 'Lathe Biosas (숨어서 살아라)', stageNameKo: '세속의 명예욕을 멀리하고 조용히 행복을 가꾸는 은둔관', gardenDomain: '권력 다툼과 남의 시선에 얽매이지 않고 소중한 일상에 몰입함', serenityBlessing: '시끄러운 소음 속에서 나만의 평화로운 정원을 지켜내는 힘' },
  { stageLevel: 7, stageNameGreek: 'Katastēma (안정의 기쁨)', stageNameKo: '갈증이 채워진 뒤 찾아오는 지속적이고 잔잔한 행복관', gardenDomain: '일시적인 자극에 중독되지 않고 잔잔한 존재 자체를 기뻐함', serenityBlessing: '기복 없이 날마다 지속되는 은은하고 따스한 행복의 정주' },
];

const TETRAPHARMAKOS_PRINCIPLES = [
  { principleTitleKo: '제1치유: 신이나 보이지 않는 운명을 두려워하지 말라', greekMotto: 'Aphobon ho theos', coreEssence: '신이나 초자연적 힘은 분노나 변덕으로 인간을 괴롭히지 않음', actionableDirective: '막연한 징벌이나 불운에 대한 미신적 공포를 떨쳐내고 이성적인 평정을 찾으십시오.' },
  { principleTitleKo: '제2치유: 죽음은 우리에게 아무것도 아니니 걱정하지 말라', greekMotto: 'Anypopton ton thanaton', coreEssence: '우리가 존재하는 한 죽음은 없고 죽음이 오면 우리는 존재하지 않음', actionableDirective: '오지 않은 미래의 종말을 미리 불안해하지 말고 오직 살아 숨 쉬는 지금에 몰입하십시오.' },
  { principleTitleKo: '제3치유: 좋은 것과 참된 행복은 쉽게 얻을 수 있다', greekMotto: 'Tagathon men euktēton', coreEssence: '생명 유지에 필수적인 것은 소박한 음식과 물, 몇 명의 진실한 벗뿐임', actionableDirective: '끝없는 물질적 욕망을 내려놓고 소박한 일상의 식사와 대화에서 충만을 맛보십시오.' },
  { principleTitleKo: '제4치유: 끔찍하고 아픈 고통은 견디기 쉬우며 지나간다', greekMotto: 'To de deinon eukarterēton', coreEssence: '격렬한 고통은 짧게 끝나고 지속되는 고통은 적응하여 견딜 수 있음', actionableDirective: '지금 겪는 고난이 영원히 지속될 것이라는 과장된 절망을 버리고 담담히 호흡하십시오.' },
];

const GARDEN_EPIPHANIES = [
  { gardenSceneTitle: '아테네 외곽 무화과나무 그늘 아래 소박한 정원의 식탁', peacefulWisdom: '치즈 한 조각과 맑은 물, 그리고 영혼을 나눌 수 있는 벗이 있다면 그곳이 곧 올림포스의 낙원이다.' },
  { gardenSceneTitle: '바람에 흩날리는 모래 알갱이처럼 쪼개어지는 고통의 물결', peacefulWisdom: '마음의 눈으로 바라보라. 네가 겪는 고통은 거대한 우주 속 한 점 티끌에 불과하니 곧 지나가리라.' },
  { gardenSceneTitle: '잔잔한 호수 위에 비친 저녁노을과 흔들림 없는 수면', peacefulWisdom: '욕망의 바람을 잠재울 때 영혼의 거울은 비로소 세상의 아름다움을 온전히 비추어 낸다.' },
  { gardenSceneTitle: '정원의 문을 닫고 등불 아래 벗들과 주고받는 따뜻한 미소', peacefulWisdom: '세상 사람들은 명예를 쫓아 서로를 헐뜯지만, 참된 지혜자는 정원에서 우정을 꽃피운다.' },
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

export function calculateEpicureanTetrapharmakos(profile?: UserProfile): EpicureanTetrapharmakosResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`EPICUREAN-TETRAPHARMAKOS-${birthdate}-${birthtime}-${name}`);

  const ataraxiaSoulTranquilityScore = (seed % 41) + 60; // 60~100
  const aponiaPhysicalEaseBalance = ((seed >> 3) % 43) + 58; // 58~100
  const tetrapharmakosRemedyMastery = ((seed >> 5) % 39) + 62; // 62~100
  const philiaGardenFriendshipForce = ((seed >> 7) % 45) + 55; // 55~99
  const katastematicPleasureClarity = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % EPICUREAN_STAGES.length;
  const activeEpicureanStage = EPICUREAN_STAGES[stageIdx];

  const principleIdx = (seed >> 4) % TETRAPHARMAKOS_PRINCIPLES.length;
  const primaryTetrapharmakosPrinciple = TETRAPHARMAKOS_PRINCIPLES[principleIdx];

  const epiphanyIdx = (seed >> 6) % GARDEN_EPIPHANIES.length;
  const epicureanGardenEpiphany = GARDEN_EPIPHANIES[epiphanyIdx];

  return {
    engineVersion: EPICUREAN_TETRAPHARMAKOS_VERSION,
    calculatedAtKst: getKstDateString(),
    ataraxiaSoulTranquilityScore,
    aponiaPhysicalEaseBalance,
    tetrapharmakosRemedyMastery,
    philiaGardenFriendshipForce,
    katastematicPleasureClarity,
    activeEpicureanStage,
    primaryTetrapharmakosPrinciple,
    epicureanGardenEpiphany,
  };
}

export function formatEpicureanTetrapharmakosPrompt(result: EpicureanTetrapharmakosResult): string {
  return `[🌿 고대 그리스 에피쿠로스 《테트라파르마코스》 영혼 평정 아타락시아 리포트]
- 엔진 버전: ${result.engineVersion}
- 아타락시아 영혼 평정도: ${result.ataraxiaSoulTranquilityScore}%
- 아포니아 고통 부재 및 안정도: ${result.aponiaPhysicalEaseBalance}%
- 테트라파르마코스 4대 치유약 숙달도: ${result.tetrapharmakosRemedyMastery}%
- 정원의 우정 및 따뜻한 연대력: ${result.philiaGardenFriendshipForce}%
- 카타스테마틱 진정한 자족 쾌락도: ${result.katastematicPleasureClarity}%
- 현행 에피쿠로스적 품계: **[${result.activeEpicureanStage.stageNameKo} (${result.activeEpicureanStage.stageNameGreek})]**
  → 관장 영역: ${result.activeEpicureanStage.gardenDomain}
  → 평정의 축복: ${result.activeEpicureanStage.serenityBlessing}
- 최우선 테트라파르마코스 지침: **[${result.primaryTetrapharmakosPrinciple.principleTitleKo} (${result.primaryTetrapharmakosPrinciple.greekMotto})]**
  → 핵심 본질: ${result.primaryTetrapharmakosPrinciple.coreEssence}
  → 실천 지침: ${result.primaryTetrapharmakosPrinciple.actionableDirective}
- 에피쿠로스 정원의 불멸 계시: 《${result.epicureanGardenEpiphany.gardenSceneTitle}》
  → 아타락시아 지혜: "${result.epicureanGardenEpiphany.peacefulWisdom}"`;
}
