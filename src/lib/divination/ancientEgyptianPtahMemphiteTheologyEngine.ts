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
 * 3. 질문 맥락 감사·KST 나일·멤피스 시공간 리듬·교차 매트릭스 산출
 *
 * @version LUCKEY-PTAH-MEMPHITE-v2.2.0
 */

import type { UserProfile } from '../sharedState';

export const PTAH_MEMPHITE_VERSION = 'LUCKEY-PTAH-MEMPHITE-v2.3.0';

export interface PtahCreationStage {
  stageLevel: number;
  stageNameAncient: string;
  stageNameKo: string;
  creativeDomain: string;
  manifestationBlessing: string;
}

export interface PtahSituationalAudit {
  contextTheme: string;
  shabakaInscription: string;
  ibToHuDiagnosis: string;
  craftsmanPrescription: string;
}

export interface PtahTemporalRhythm {
  kstHour: number;
  workshopWindow: string;
  nileSeasonalCycle: string;
  kaRadianceIndex: number;
  timingAdvice: string;
}

export interface PtahSynthesisMatrix {
  ibHeartAxis: string;
  huTongueAxis: string;
  maatCraftAxis: string;
  synthesizedVerdict: string;
}

export interface PtahMemphiteResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 내부 계산 호환 필드 (프롬프트 비노출)
  heartThoughtConceptualizationIndex: number;
  tongueUtteranceManifestationForce: number;
  divineKaVitalityInfusionScore: number;
  maatCosmicTruthAlignment: number;
  artisanMasteryPrecisionPower: number;
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
  situationalPtahAudit: PtahSituationalAudit;
  temporalPtahRhythm: PtahTemporalRhythm;
  ptahSynthesisMatrix: PtahSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
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

function buildSituationalAudit(question: string, virtue: typeof MEMPHITE_VIRTUES[number]): PtahSituationalAudit {
  const q = question.toLowerCase();
  if (/연애|관계|사람|가족|동료|대화|약속|신뢰/.test(q)) {
    return {
      contextTheme: '언약(Hu)과 신뢰의 정렬 감사',
      shabakaInscription: '《샤바카 석비》 제53행 — 심장(Ib)이 품은 진심이 혀(Hu)를 통해 나와 비로소 관계를 세운다.',
      ibToHuDiagnosis: `속마음과 겉으로 나가는 말 사이의 간극을 좁혀야 할 때입니다. '${virtue.virtueNameKo}'이 기준이 됩니다.`,
      craftsmanPrescription: '애매한 여운을 남기기보다 내가 지킬 수 있는 진심만 정직하고 또렷하게 건네십시오.',
    };
  }
  if (/결정|선택|창업|기획|일|직장|진로|작품|프로젝트/.test(q)) {
    return {
      contextTheme: '심장 설계(Ib)와 장인 구현(Hu) 감사',
      shabakaInscription: '《샤바카 석비》 제55행 — 모든 작업의 원형은 프타의 심장에서 먼저 구상되고 손끝에서 완성된다.',
      ibToHuDiagnosis: `실행 속도를 높이기 전에 설계의 중심이 분명한지 점검할 시점입니다. '${virtue.virtueNameKo}'을 세우십시오.`,
      craftsmanPrescription: '결과물의 핵심 목적 한 줄을 먼저 확정하고, 불필요한 장식을 덜어낸 뒤 착수하십시오.',
    };
  }
  if (/지침|불안|고갈|무력|치유|회복|휴식/.test(q)) {
    return {
      contextTheme: '카(Ka) 생명력 재충전 감사',
      shabakaInscription: '《샤바카 석비》 제56행 — 프타는 창조된 것마다 생명력(Ka)을 불어넣어 스스로 서게 한다.',
      ibToHuDiagnosis: `형식적인 의무감만 남고 내면의 생기(Ka)가 소진된 상태입니다. '${virtue.virtueNameKo}'으로 숨을 고르십시오.`,
      craftsmanPrescription: '새 일을 억지로 깎아내기보다 이미 해낸 일에서 작은 성취와 휴식의 숨을 되찾으십시오.',
    };
  }
  return {
    contextTheme: '멤피스 사유·언어 일치 감사',
    shabakaInscription: '《샤바카 석비》 제54행 — 심장이 생각하고 혀가 명하는 바에 따라 마아트(Ma’at)가 이루어진다.',
    ibToHuDiagnosis: `마음의 뜻과 실제 행동이 나란히 서 있는지 점검할 때입니다. '${virtue.virtueNameKo}'을 비춰 보십시오.`,
    craftsmanPrescription: virtue.actionableDirective,
  };
}

function buildTemporalRhythm(now: Date, seed: number): PtahTemporalRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  let workshopWindow = '백주 프타 작업실·정교 구현 창 (오전~오후)';
  let timingAdvice = '설계한 바를 미루지 말고 손끝의 실천(Hu)으로 한 조각씩 현실화하십시오.';
  if (kstHour >= 5 && kstHour < 10) {
    workshopWindow = '새벽 타테넨 둔덕·심장 구상 창 (이른 아침)';
    timingAdvice = '작업에 들어가기 전 심장(Ib)으로 오늘 빚어낼 핵심 그림을 조용히 확정하십시오.';
  } else if (kstHour >= 18 && kstHour < 22) {
    workshopWindow = '황혼 마아트 균형·마감 검수 창 (저녁)';
    timingAdvice = '오늘 남긴 말과 결과물이 균형(Ma’at)에 맞았는지 정갈하게 검수하십시오.';
  } else if (kstHour >= 22 || kstHour < 5) {
    workshopWindow = '심야 멤피스 성소·카(Ka) 안식 창 (밤~새벽)';
    timingAdvice = '작업대의 도구를 내려놓고 내일의 창조를 위한 생기(Ka)를 보전하십시오.';
  }

  let nileSeasonalCycle = '나일 삼계절 순환';
  if (month >= 3 && month <= 6) nileSeasonalCycle = '셰무(Shemu · 수확기) — 빚어낸 작품의 결실을 거두는 계절';
  else if (month >= 7 && month <= 10) nileSeasonalCycle = '아케트(Akhet · 범람기) — 비옥한 영감과 재료를 채우는 계절';
  else nileSeasonalCycle = '페레트(Peret · 파종·생장기) — 설계를 구체적 형상으로 세우는 계절';

  const kaRadianceIndex = 64 + ((seed + kstHour * 5 + month * 3) % 35);

  return {
    kstHour,
    workshopWindow,
    nileSeasonalCycle,
    kaRadianceIndex,
    timingAdvice,
  };
}

function buildSynthesisMatrix(
  stage: PtahCreationStage,
  virtue: typeof MEMPHITE_VIRTUES[number],
  audit: PtahSituationalAudit,
  temporal: PtahTemporalRhythm,
): PtahSynthesisMatrix {
  const ibHeartAxis = `심장 구상(Ib): ${stage.stageNameKo} (${audit.contextTheme})`;
  const huTongueAxis = `말씀 구현(Hu): ${virtue.virtueNameKo}`;
  const maatCraftAxis = `시의 장인정신: ${temporal.workshopWindow} · ${temporal.nileSeasonalCycle}`;
  const synthesizedVerdict = `'${temporal.workshopWindow}'에 '${stage.stageNameKo}'의 자리에서 '${virtue.virtueNameKo}'을 실천할 때, 생각과 말이 어긋나지 않는 온전한 결실이 빚어집니다.`;

  return {
    ibHeartAxis,
    huTongueAxis,
    maatCraftAxis,
    synthesizedVerdict,
  };
}

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' +09:00 KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculatePtahMemphite(
  profile?: UserProfile,
  question = '',
  now: Date = new Date(),
): PtahMemphiteResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const kstDay = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seed = hashSeed(`PTAH-MEMPHITE-${birthdate}-${birthtime}-${name}-${kstDay}-${question}`);

  const heartThoughtConceptualizationIndex = (seed % 41) + 60;
  const tongueUtteranceManifestationForce = ((seed >> 3) % 43) + 58;
  const divineKaVitalityInfusionScore = ((seed >> 5) % 39) + 62;
  const maatCosmicTruthAlignment = ((seed >> 7) % 45) + 55;
  const artisanMasteryPrecisionPower = ((seed >> 9) % 38) + 63;

  const stageIdx = (seed >> 2) % PTAH_STAGES.length;
  const activeCreationStage = PTAH_STAGES[stageIdx];

  const virtueIdx = (seed >> 4) % MEMPHITE_VIRTUES.length;
  const primaryMemphiteVirtue = MEMPHITE_VIRTUES[virtueIdx];

  const epiphanyIdx = (seed >> 6) % MEMPHITE_EPIPHANIES.length;
  const memphiteEpiphany = MEMPHITE_EPIPHANIES[epiphanyIdx];

  const situationalPtahAudit = buildSituationalAudit(question, primaryMemphiteVirtue);
  const temporalPtahRhythm = buildTemporalRhythm(now, seed);
  const ptahSynthesisMatrix = buildSynthesisMatrix(activeCreationStage, primaryMemphiteVirtue, situationalPtahAudit, temporalPtahRhythm);
  const interpretiveBoundary = '샤바카 석비의 심장 구상(Ib)과 말씀 선포(Hu) 상징을 빌린 정성적 창조 성찰 관점이며, 개인 능력 점수나 미래 단정이 아닙니다.';
  const ritualAction = situationalPtahAudit.craftsmanPrescription;
  const reflectionFocus = `지금 심장(Ib)에 품은 핵심 의도를 오늘 혀(Hu)의 한 문장 약속으로 선포하고 현실로 옮긴다면 무엇부터 시작할까요?`;
  const cleanQuestion = question.trim();
  const reflectiveQuestion = cleanQuestion
    ? `'${cleanQuestion}'에 대해 '${activeCreationStage.stageNameKo}'의 자리에서 '${primaryMemphiteVirtue.virtueNameKo}'을 실천한다면, 오늘 심장(Ib)에서 혀(Hu)로 옮겨 선포할 단 하나의 약속은 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: PTAH_MEMPHITE_VERSION,
    calculatedAtKst: getKstDateString(now),
    heartThoughtConceptualizationIndex,
    tongueUtteranceManifestationForce,
    divineKaVitalityInfusionScore,
    maatCosmicTruthAlignment,
    artisanMasteryPrecisionPower,
    activeCreationStage,
    primaryMemphiteVirtue,
    memphiteEpiphany,
    situationalPtahAudit,
    temporalPtahRhythm,
    ptahSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatPtahMemphitePrompt(result: PtahMemphiteResult): string {
  return `[🏛️ 고대 이집트 멤피스 신학 《프타(Ptah)》 심장 구상 & 말씀 선포 리포트]
- 엔진 버전: ${result.engineVersion} | 기준 시각: ${result.calculatedAtKst}
- 현행 창조 품계: **[${result.activeCreationStage.stageNameKo} (${result.activeCreationStage.stageNameAncient})]**
  → 관장 영역: ${result.activeCreationStage.creativeDomain}
  → 현실 구현 축복: ${result.activeCreationStage.manifestationBlessing}
- 최우선 멤피스 덕목: **[${result.primaryMemphiteVirtue.virtueNameKo} (${result.primaryMemphiteVirtue.hieroglyphicTitle})]**
  → 핵심 본질: ${result.primaryMemphiteVirtue.coreEssence}
  → 실천 지침: ${result.primaryMemphiteVirtue.actionableDirective}
- 상황 맥락 감사(${result.situationalPtahAudit.contextTheme}): ${result.situationalPtahAudit.shabakaInscription}
  → 사유·선포 진단: ${result.situationalPtahAudit.ibToHuDiagnosis}
  → 장인 처방: ${result.situationalPtahAudit.craftsmanPrescription}
- 시공간 나일 리듬: ${result.temporalPtahRhythm.workshopWindow} · ${result.temporalPtahRhythm.nileSeasonalCycle}
  → 시의 조언: ${result.temporalPtahRhythm.timingAdvice}
- 프타 교차 매트릭스: ${result.ptahSynthesisMatrix.synthesizedVerdict}
- 샤바카 석비의 불멸의 비전: 《${result.memphiteEpiphany.stoneSceneTitle}》
  → 영원한 지혜: "${result.memphiteEpiphany.eternalWisdom}"
- 오늘의 작은 의례: ${result.ritualAction}
- 성찰 질문: ${result.reflectiveQuestion}
- 해석 경계: ${result.interpretiveBoundary}`;
}
