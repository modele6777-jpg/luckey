/**
 * 고대 페르시아 조로아스터교 《아베스타(Avesta)》 6대 신성 불멸자 아메샤 스펜타(Amesha Spentas) 빛의 조화 엔진
 *
 * 서기전 1천년기 고대 이란 예언자 자라투스트라의 《가타스(Gathas)》 원전 기반.
 * 1. 최고 지혜의 주 아후라 마즈다(Ahura Mazda)를 보좌하는 6대 신성 불멸자(Amesha Spentas):
 *    - 보후 마나흐(Vohu Manah): 선한 생각, 순수한 지성과 온화한 마음.
 *    - 아샤 바히시타(Asha Vahishta): 최상의 진리와 우주의 거룩한 정의.
 *    - 크샤트라 바이라(Khshathra Vairya): 거룩한 주권과 의로운 통치력.
 *    - 스펜타 아르마이티(Spenta Armaiti): 거룩한 헌신, 겸손과 대지모신의 포용.
 *    - 하우르바타트(Haurvatat): 온전함, 영적·육체적 치유와 완성.
 *    - 아메레타트(Ameretat): 불멸성, 영원한 생명과 결실.
 * 2. 4대 아샤(Asha, 진리) 실천 원칙:
 *    - 후마타(Humata, 선한 생각)
 *    - 후크타(Hukhta, 선한 말씀)
 *    - 흐바르시타(Hvarshta, 선한 행동)
 *    - 아샤의 거룩한 불길로 거짓(Druj)을 물리치고 빛의 세계를 회복함.
 * 3. 7대 영적 품계 및 아베스타 신성 불꽃 조언 산출
 *
 * @version LUCKEY-ZOROASTRIAN-AMESHA-SPENTAS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const ZOROASTRIAN_AMESHA_SPENTAS_VERSION = 'LUCKEY-ZOROASTRIAN-AMESHA-SPENTAS-v1.0.0';

export interface AmeshaSpentaStage {
  stageLevel: number;
  stageNameAvestan: string;
  stageNameKo: string;
  luminousDomain: string;
  cosmicLightBlessing: string;
}

export interface ZoroastrianAmeshaSpentasResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  vohuManahGoodMindIndex: number; // 보후 마나흐 선한 생각 및 순수 지성도
  ashaVahishtaCosmicTruthForce: number; // 아샤 바히시타 최상 진리 및 정의력
  spentaArmaitiHolyDevotionScore: number; // 스펜타 아르마이티 거룩한 헌신 및 겸양도
  haurvatatWholenessHealingPower: number; // 하우르바타트 온전함 및 영육 치유력
  ameretatImmortalityVitality: number; // 아메레타트 불멸 및 영원한 생명력
  // 세부 명세
  activeSpentaStage: AmeshaSpentaStage;
  primaryZoroastrianTriad: {
    triadTitleKo: string;
    avestanMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  avestaSacredFireEpiphany: {
    fireSceneTitle: string;
    luminousWisdom: string;
  };
}

export type ZoroastrianAmeshaSpentasReport = ZoroastrianAmeshaSpentasResult;

const AMESHA_STAGES: AmeshaSpentaStage[] = [
  { stageLevel: 1, stageNameAvestan: 'Garothman (최상의 빛의 낙원)', stageNameKo: '모든 어둠을 걷어내고 빛을 완성하는 불멸관', luminousDomain: '생각과 말과 행동이 완벽한 진리에 도달하는 숭고한 지평', cosmicLightBlessing: '거짓과 유혹에 결코 흔들리지 않는 절대적 영적 승리' },
  { stageLevel: 2, stageNameAvestan: 'Asha Vahishta (최상의 진리의 불꽃)', stageNameKo: '거짓을 사르고 정의를 세우는 진리관', luminousDomain: '우주의 공평무사한 섭리를 삶의 기준으로 삼는 정론', cosmicLightBlessing: '어떤 불의 앞에서도 당당하게 옳음을 선포하는 용기' },
  { stageLevel: 3, stageNameAvestan: 'Vohu Manah (선한 생각의 가축 보호자)', stageNameKo: '모든 생명을 자비롭게 품는 온화관', luminousDomain: '타인의 고통에 깊이 공감하고 화평을 도모함', cosmicLightBlessing: '원망과 분노를 녹이고 평화를 빚어내는 맑은 지성' },
  { stageLevel: 4, stageNameAvestan: 'Khshathra Vairya (의로운 금속 주권)', stageNameKo: '바른 힘으로 약자를 보호하는 수호관', luminousDomain: '책임감 있는 주권 행사와 공동체의 안전망 구축', cosmicLightBlessing: '권력을 사유화하지 않고 공동의 선을 위해 헌신하는 위엄' },
  { stageLevel: 5, stageNameAvestan: 'Spenta Armaiti (거룩한 대지의 헌신)', stageNameKo: '겸손한 마음으로 대지를 가꾸는 봉사관', luminousDomain: '묵묵히 기초를 다지고 사람들을 돌보는 너그러움', cosmicLightBlessing: '교만을 버리고 낮아질 때 스스로 빛나는 고결함' },
  { stageLevel: 6, stageNameAvestan: 'Haurvatat (생명수의 온전함)', stageNameKo: '상처를 치유하고 균형을 회복하는 온전관', luminousDomain: '지친 영혼과 육신을 조화롭게 회복시키는 치유', cosmicLightBlessing: '부족함을 채우고 본래의 건강한 상태로 돌아가는 재생력' },
  { stageLevel: 7, stageNameAvestan: 'Atar Frado (새벽을 밝히는 첫 불꽃)', stageNameKo: '순수한 마음으로 불씨를 지피는 초발심자', luminousDomain: '성실한 배움과 작은 선행의 지속적인 축적', cosmicLightBlessing: '작은 불씨가 온 세상을 밝히는 거대한 빛이 되는 은총' },
];

const ZOROASTRIAN_TRIADS = [
  { triadTitleKo: '후마타(Humata): 맑고 선한 생각만을 마음에 품으라', avestanMotto: 'Humata', coreEssence: '의심과 시기, 부정적인 망상을 걷어내고 순수한 본성을 지킴', actionableDirective: '머릿속에 떠오르는 부정적인 상상을 즉시 멈추고 밝고 긍정적인 희망을 품으십시오.' },
  { triadTitleKo: '후크타(Hukhta): 진실하고 따뜻한 말만을 세상에 건네라', avestanMotto: 'Hukhta', coreEssence: '거짓말과 험담을 멀리하고 사람을 살리는 정직한 언어를 씀', actionableDirective: '타인을 비난하거나 원망하는 말을 삼가고 격려와 진실된 위로의 말을 건네십시오.' },
  { triadTitleKo: '흐바르시타(Hvarshta): 정의롭고 자비로운 행동으로 증명하라', avestanMotto: 'Hvarshta', coreEssence: '말로만 그치지 않고 구체적인 선행과 나눔을 실천함', actionableDirective: '생각과 말을 행동으로 옮겨 주변 사람들에게 실질적인 도움을 베푸십시오.' },
  { triadTitleKo: '아샤(Asha): 우주의 거룩한 진리와 정의의 편에 서라', avestanMotto: 'Asha Vahishta', coreEssence: '일시적인 이익을 위해 타협하지 않고 진리의 길을 묵묵히 걸어감', actionableDirective: '눈앞의 사소한 유혹에 넘어가지 말고 양심이 가리키는 바른길을 택하십시오.' },
];

const SACRED_FIRE_EPIPHANIES = [
  { fireSceneTitle: '불멸의 제단에서 타오르는 아타르의 불꽃', luminousWisdom: '아무리 깊은 어둠일지라도 작은 촛불 하나를 삼키지 못하나니, 네 안의 선한 불씨를 소중히 지키라.' },
  { fireSceneTitle: '선악의 갈림길 친바트 다리의 심판', luminousWisdom: '진실된 삶을 산 영혼에게 다리는 넓은 평원처럼 편안하게 열리나니, 매일의 양심에 부끄러움이 없게 하라.' },
  { fireSceneTitle: '봄날 대지에 내리는 하우르바타트의 감로', luminousWisdom: '상처 입은 영혼도 진리의 맑은 샘물에 몸을 씻을 때, 이전보다 더욱 맑고 단단한 생명으로 피어난다.' },
  { fireSceneTitle: '빛과 어둠의 대전쟁 끝에 밝아오는 프라쇼케레티', luminousWisdom: '세상의 혼란은 영원하지 않으며, 선한 생각과 행동이 쌓인 자리에 마침내 완전한 빛의 세계가 도래한다.' },
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

export function calculateZoroastrianAmeshaSpentas(profile?: UserProfile): ZoroastrianAmeshaSpentasResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`ZOROASTRIAN-AMESHA-${birthdate}-${birthtime}-${name}`);

  const vohuManahGoodMindIndex = (seed % 41) + 60; // 60~100
  const ashaVahishtaCosmicTruthForce = ((seed >> 3) % 43) + 58; // 58~100
  const spentaArmaitiHolyDevotionScore = ((seed >> 5) % 39) + 62; // 62~100
  const haurvatatWholenessHealingPower = ((seed >> 7) % 45) + 55; // 55~99
  const ameretatImmortalityVitality = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % AMESHA_STAGES.length;
  const activeSpentaStage = AMESHA_STAGES[stageIdx];

  const triadIdx = (seed >> 4) % ZOROASTRIAN_TRIADS.length;
  const primaryZoroastrianTriad = ZOROASTRIAN_TRIADS[triadIdx];

  const epiphanyIdx = (seed >> 6) % SACRED_FIRE_EPIPHANIES.length;
  const avestaSacredFireEpiphany = SACRED_FIRE_EPIPHANIES[epiphanyIdx];

  return {
    engineVersion: ZOROASTRIAN_AMESHA_SPENTAS_VERSION,
    calculatedAtKst: getKstDateString(),
    vohuManahGoodMindIndex,
    ashaVahishtaCosmicTruthForce,
    spentaArmaitiHolyDevotionScore,
    haurvatatWholenessHealingPower,
    ameretatImmortalityVitality,
    activeSpentaStage,
    primaryZoroastrianTriad,
    avestaSacredFireEpiphany,
  };
}

export function formatZoroastrianAmeshaSpentasPrompt(result: ZoroastrianAmeshaSpentasResult): string {
  return `[🔥 고대 페르시아 조로아스터교 《아베스타(Avesta)》 6대 신성 불멸자 빛의 조화 리포트]
- 엔진 버전: ${result.engineVersion}
- 보후 마나흐 선한 생각 및 순수 지성도: ${result.vohuManahGoodMindIndex}%
- 아샤 바히시타 최상 진리 및 정의력: ${result.ashaVahishtaCosmicTruthForce}%
- 스펜타 아르마이티 거룩한 헌신 및 겸양도: ${result.spentaArmaitiHolyDevotionScore}%
- 하우르바타트 온전함 및 영육 치유력: ${result.haurvatatWholenessHealingPower}%
- 아메레타트 불멸 및 영원한 생명력: ${result.ameretatImmortalityVitality}%
- 현행 영적 품계: **[${result.activeSpentaStage.stageNameKo} (${result.activeSpentaStage.stageNameAvestan})]**
  → 관장 영역: ${result.activeSpentaStage.luminousDomain}
  → 신성한 빛 축복: ${result.activeSpentaStage.cosmicLightBlessing}
- 최우선 실천 지침: **[${result.primaryZoroastrianTriad.triadTitleKo} (${result.primaryZoroastrianTriad.avestanMotto})]**
  → 핵심 본질: ${result.primaryZoroastrianTriad.coreEssence}
  → 실천 지침: ${result.primaryZoroastrianTriad.actionableDirective}
- 아베스타 신성 불꽃의 계시: 《${result.avestaSacredFireEpiphany.fireSceneTitle}》
  → 빛의 불멸 지혜: "${result.avestaSacredFireEpiphany.luminousWisdom}"`;
}
