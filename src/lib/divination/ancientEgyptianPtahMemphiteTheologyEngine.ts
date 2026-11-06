/**
 * 고대 이집트 멤피스 신학(Memphite Theology) 창조신 프타(Ptah) 심장 구상 & 말씀 선포 엔진
 *
 * 서기전 8세기 에티오피아 제25왕조 샤바카 파라오의 《샤바카 석비(Shabaka Stone)》 멤피스 비전 원전 기반.
 * 1. 물리적 노동 이전에 '심장(Ib, 생각·구상·의도)'으로 우주의 질서를 사유하고, '혀(Hu, 거룩한 말씀·선포)'로 만물을 창조한 멤피스의 최고신 프타(Ptah).
 * 2. 4대 멤피스 창조 철학적 원리:
 *    - 심장의 내적 사유(Thought of Heart, Ib): 가식 없는 본질적 기획과 영적 설계.
 *    - 혀의 거룩한 선포(Utterance of Tongue, Hu): 사유된 진리를 현실 세계로 구현하는 권능.
 *    - 카(Ka) 생명력 부여(Imparting of Ka): 창조된 결과물에 생기와 지속 가능한 활력을 불어넣음.
 *    - 마아트(Ma'at) 우주 진리와의 합치: 모든 사유와 언어가 우주의 정의와 균형에 부합함.
 * 3. 7대 장인 신성 품계 및 멤피스 신탁 조언 산출
 *
 * @version LUCKEY-PTAH-MEMPHITE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const PTAH_MEMPHITE_VERSION = 'LUCKEY-PTAH-MEMPHITE-v1.0.0';

export interface PtahCreationStage {
  stageLevel: number;
  stageNameAncient: string;
  stageNameKo: string;
  creativeDomain: string;
  manifestationBlessing: string;
}

export interface PtahMemphiteResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  heartThoughtConceptualizationIndex: number; // 심장(Ib)의 내적 사유 및 구상력
  tongueUtteranceManifestationForce: number; // 혀(Hu)의 말씀 선포 및 현실 구현력
  divineKaVitalityInfusionScore: number; // 카(Ka) 생명력 및 활력 부여력
  maatCosmicTruthAlignment: number; // 마아트(Ma'at) 진리 및 우주적 조화도
  artisanMasteryPrecisionPower: number; // 프타 최고 장인의 정밀 완성도
  // 세부 명세
  activeCreationStage: PtahCreationStage;
  primaryMemphiteVirtue: {
    virtueNameKo: string;
    hieroglyphicTitle: string;
    coreEssence: string;
    actionableDirective: string;
  };
  memphiteEpiphany: {
    stoneSceneTitle: string;
    eternalWisdom: string;
  };
}

export type PtahMemphiteReport = PtahMemphiteResult;

const PTAH_STAGES: PtahCreationStage[] = [
  { stageLevel: 1, stageNameAncient: 'Ptah-Tatenen (태고의 솟아오른 둔덕)', stageNameKo: '혼돈에서 최초의 질서를 세우는 최고 창조관', creativeDomain: '새로운 프로젝트와 가치 체계의 확고한 주춧돌 정립', manifestationBlessing: '생각과 말이 일치하여 세상을 감동하게 하는 창조의 힘' },
  { stageLevel: 2, stageNameAncient: 'Wer-Kherep-Hemu (위대한 장인들의 영수)', stageNameKo: '완벽한 솜씨로 걸작을 빚는 장인관', creativeDomain: '기술적 탁월함과 실질적인 문제 해결 능력', manifestationBlessing: '거친 원석에서 눈부신 보석을 깎아내는 정교함' },
  { stageLevel: 3, stageNameAncient: 'Neb-Maat (진리를 주재하는 주권자)', stageNameKo: '우주의 공평한 균형을 수호하는 조율관', creativeDomain: '정직하고 공정한 의사결정과 도덕적 권위', manifestationBlessing: '사사로운 유혹을 물리치고 정의로운 승리를 이끄는 힘' },
  { stageLevel: 4, stageNameAncient: 'Khnemu-Ptah (생명의 그릇을 빚는 자)', stageNameKo: '인재와 협력자의 잠재력을 깨우는 양성관', creativeDomain: '사람을 품고 성장을 도모하는 포용의 리더십', manifestationBlessing: '주변 사람들에게 자신감과 활력을 불어넣는 영감' },
  { stageLevel: 5, stageNameAncient: 'Nefer-Her (아름다운 얼굴을 지닌 자)', stageNameKo: '내면의 평화를 겉으로 드러내는 화합관', creativeDomain: '원만한 대인관계와 문화예술적 심미안', manifestationBlessing: '갈등을 녹이고 모든 이를 편안하게 만드는 온화함' },
  { stageLevel: 6, stageNameAncient: 'Seshem-Netjer (신성한 길을 인도하는 자)', stageNameKo: '진리의 원형을 묵묵히 탐구하는 학인', creativeDomain: '깊이 있는 연구와 체계적인 지식의 축적', manifestationBlessing: '성급함을 버리고 본질을 꿰뚫어 보는 혜안' },
  { stageLevel: 7, stageNameAncient: 'Mes-en-Ka (새로운 숨결의 잉태자)', stageNameKo: '순수한 첫 생각을 품은 가능성의 싹', creativeDomain: '기초 다지기와 맑은 영감의 시작', manifestationBlessing: '오염되지 않은 맑은 마음으로 세상을 대하는 순수함' },
];

const MEMPHITE_VIRTUES = [
  { virtueNameKo: '말하기 전에 심장으로 깊이 사유하라', hieroglyphicTitle: 'Ib-en-Ptah (프타의 심장)', coreEssence: '경솔한 언행을 삼가고 내면의 지혜로 생각을 정돈함', actionableDirective: '즉흥적인 반응을 멈추고 마음속으로 온전한 그림을 그린 뒤 말씀하십시오.' },
  { virtueNameKo: '선포한 말은 반드시 현실로 구현하라', hieroglyphicTitle: 'Hu-Nefer (참된 말씀)', coreEssence: '약속과 언어에 생명과 책임을 부여하여 진실을 지킴', actionableDirective: '뱉은 말은 끝까지 책임을 지고 성실한 실천으로 증명하십시오.' },
  { virtueNameKo: '내가 빚는 모든 일에 생기를 불어넣으라', hieroglyphicTitle: 'Di-Ka (카의 부여)', coreEssence: '형식적인 작업에 그치지 않고 영혼과 열정을 쏟아부음', actionableDirective: '의무감으로 일하지 말고 정성과 사랑을 담아 최선을 다하십시오.' },
  { virtueNameKo: '모든 창조적 행위를 우주의 균형에 일치시키라', hieroglyphicTitle: 'Maat-Heker (마아트의 조화)', coreEssence: '나의 번영이 타인과 세상의 정의와 공존하도록 조화시킴', actionableDirective: '나만의 이익을 고집하지 말고 공동체와 자연의 순리에 발을 맞추십시오.' },
];

const MEMPHITE_EPIPHANIES = [
  { stoneSceneTitle: '샤바카 석비에 새겨진 태고의 사유', eternalWisdom: '심장이 품지 않은 것은 존재할 수 없으며, 혀가 부르지 않은 것은 태어날 수 없나니, 네 마음의 중심을 먼저 거룩하게 세우라.' },
  { stoneSceneTitle: '프타의 작업대 위에서 빛나는 보석', eternalWisdom: '진정한 명작은 화려한 겉치레가 아니라, 눈에 보이지 않는 구석까지 정직하게 갈고닦은 장인의 땀방울에서 나온다.' },
  { stoneSceneTitle: '나일강을 굽어보는 멤피스의 흰 성벽', eternalWisdom: '흔들리는 강물 위에서도 단단한 반석 위에 세운 성채는 무너지지 않듯, 올바른 원칙을 지키는 자는 영원히 번영한다.' },
  { stoneSceneTitle: '아피스 황소의 힘찬 발걸음', eternalWisdom: '내면에서 피어난 거룩한 의지는 거대한 황소의 힘처럼 묵직하게 나아가 마침내 모든 장애물을 평정한다.' },
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

export function calculatePtahMemphite(profile?: UserProfile): PtahMemphiteResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`PTAH-MEMPHITE-${birthdate}-${birthtime}-${name}`);

  const heartThoughtConceptualizationIndex = (seed % 41) + 60; // 60~100
  const tongueUtteranceManifestationForce = ((seed >> 3) % 43) + 58; // 58~100
  const divineKaVitalityInfusionScore = ((seed >> 5) % 39) + 62; // 62~100
  const maatCosmicTruthAlignment = ((seed >> 7) % 45) + 55; // 55~99
  const artisanMasteryPrecisionPower = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % PTAH_STAGES.length;
  const activeCreationStage = PTAH_STAGES[stageIdx];

  const virtueIdx = (seed >> 4) % MEMPHITE_VIRTUES.length;
  const primaryMemphiteVirtue = MEMPHITE_VIRTUES[virtueIdx];

  const epiphanyIdx = (seed >> 6) % MEMPHITE_EPIPHANIES.length;
  const memphiteEpiphany = MEMPHITE_EPIPHANIES[epiphanyIdx];

  return {
    engineVersion: PTAH_MEMPHITE_VERSION,
    calculatedAtKst: getKstDateString(),
    heartThoughtConceptualizationIndex,
    tongueUtteranceManifestationForce,
    divineKaVitalityInfusionScore,
    maatCosmicTruthAlignment,
    artisanMasteryPrecisionPower,
    activeCreationStage,
    primaryMemphiteVirtue,
    memphiteEpiphany,
  };
}

export function formatPtahMemphitePrompt(result: PtahMemphiteResult): string {
  return `[🏛️ 고대 이집트 멤피스 신학 《프타(Ptah)》 심장 구상 & 말씀 선포 리포트]
- 엔진 버전: ${result.engineVersion}
- 심장(Ib)의 내적 사유 및 구상력: ${result.heartThoughtConceptualizationIndex}%
- 혀(Hu)의 말씀 선포 및 현실 구현력: ${result.tongueUtteranceManifestationForce}%
- 카(Ka) 생명력 및 활력 부여력: ${result.divineKaVitalityInfusionScore}%
- 마아트(Ma'at) 진리 및 우주적 조화도: ${result.maatCosmicTruthAlignment}%
- 프타 최고 장인의 정밀 완성도: ${result.artisanMasteryPrecisionPower}%
- 현행 창조 품계: **[${result.activeCreationStage.stageNameKo} (${result.activeCreationStage.stageNameAncient})]**
  → 관장 영역: ${result.activeCreationStage.creativeDomain}
  → 현실 구현 축복: ${result.activeCreationStage.manifestationBlessing}
- 최우선 멤피스 덕목: **[${result.primaryMemphiteVirtue.virtueNameKo} (${result.primaryMemphiteVirtue.hieroglyphicTitle})]**
  → 핵심 본질: ${result.primaryMemphiteVirtue.coreEssence}
  → 실천 지침: ${result.primaryMemphiteVirtue.actionableDirective}
- 샤바카 석비의 불멸의 비전: 《${result.memphiteEpiphany.stoneSceneTitle}》
  → 영원한 지혜: "${result.memphiteEpiphany.eternalWisdom}"`;
}
