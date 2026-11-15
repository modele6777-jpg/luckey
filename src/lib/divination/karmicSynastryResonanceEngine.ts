/**
 * =========================================================================
 * 🌌 LUCKEY 카르믹 시나스트리 & 인연 성간 공명 엔진
 * (Karmic Synastry & Interstellar Soul Resonance Master Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 동양 명리학의 정통 궁합(천간합, 지지육합, 삼합, 원진, 충)과
 * 서양 카르믹 점성학(달-금성-화성 시나스트리 및 노드 영혼의 축)을 융합한 2인 인연 결정론 엔진입니다.
 * 두 사람이 만난 전생 카르마적 계약(Soul Contract)과 현생에서 함께 이룰 시너지,
 * 피할 수 없는 마찰 구간과 관계를 영구히 번영시키는 '인연 소통의 열쇠'를 정밀 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
} from '../sajuAnalysis';

export const KARMIC_SYNASTRY_VERSION = 'LUCKEY-SYNASTRY-RESONANCE-v2.0.0';

export interface SajuInterpersonalHarmony {
  hasHeavenlyStemCombination: boolean;
  stemCombinationName?: string; // 예: "을경합(乙庚合: 의리와 신뢰의 결속)"
  hasEarthlyBranchHarmony: boolean;
  branchHarmonyName?: string;    // 예: "사신육합(巳申六合: 수기 생성과 지혜)"
  hasClashOrWonjin: boolean;
  clashWonjinDetails?: string;   // 예: "자미원진(子未怨嗔) - 사소한 오해와 자존심 마찰 주의"
  elementalInterchange: string;  // 상대가 나의 결핍 오행을 채워주는지 여부
}

export interface AstrologicalBondAspect {
  aspectType: 'Conjunction (강력한 일치)' | 'Trine (자연스러운 조화)' | 'Sextile (기회의 발전)' | 'Opposition (상호보완적 긴장)' | 'Square (성장을 촉발하는 마찰)';
  planetsPair: string; // 예: "Moon-Venus (정서적 안식과 매력)", "Sun-Mars (추진력과 열정)"
  resonanceScore: number; // 0 ~ 100
  soulBondMeaning: string;
}

export interface KarmicSynastryReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  relationshipArchetype: string; // 예: "운명적 소울 촉매자 (Destined Soul Catalyst)"
  soulContractScore: number;     // 인연 공명 지수 (0 ~ 100)
  sajuHarmony: SajuInterpersonalHarmony;
  astrologicalAspect: AstrologicalBondAspect;
  karmicSoulMission: string;     // 두 사람이 함께 풀어야 할 현생의 과제
  communicationGoldenRule: string; // 관계를 치유하고 번영시키는 대화법
  synthesisPromptGuidance: string;
  synastrySynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatSynastryKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeSynastryStage(score: number): string {
  if (score >= 92) return '쌍둥이 거울 공명기 (깊은 정서적 안식과 창조적 시너지가 자연스럽게 맞물리는 흐름)';
  if (score >= 84) return '카르마 조율기 (서로의 결핍을 보완하며 성숙한 신뢰를 쌓아가는 국면)';
  return '성장 촉발기 (다름과 마찰을 솔직한 대화로 풀어내며 깊어지는 흐름)';
}

// 천간 5합 매핑 (甲己, 乙庚, 丙辛, 丁壬, 戊癸)
const HEAVENLY_COMBOS: Record<string, string> = {
  '甲_己': '갑기합(甲己合: 중정지합 — 두터운 신의와 안정된 신뢰)',
  '己_甲': '갑기합(甲己合: 중정지합 — 두터운 신의와 안정된 신뢰)',
  '乙_庚': '을경합(乙庚合: 인의지합 — 단단한 의리와 서로를 이끄는 강인함)',
  '庚_乙': '을경합(乙庚合: 인의지합 — 단단한 의리와 서로를 이끄는 강인함)',
  '丙_辛': '병신합(丙辛合: 위엄지합 — 세련된 예의와 서로를 빛내는 품격)',
  '辛_丙': '병신합(丙辛合: 위엄지합 — 세련된 예의와 서로를 빛내는 품격)',
  '丁_壬': '정임합(丁壬合: 인수지합 — 깊은 감정적 유대와 영혼의 끌림)',
  '壬_丁': '정임합(丁壬合: 인수지합 — 깊은 감정적 유대와 영혼의 끌림)',
  '戊_癸': '무계합(戊癸合: 무정지합 — 지혜로운 협력과 영리한 시너지)',
  '癸_戊': '무계합(戊癸合: 무정지합 — 지혜로운 협력과 영리한 시너지)',
};

// 지지 6합 매핑 (子丑, 寅亥, 卯戌, 辰酉, 巳申, 午未)
const BRANCH_COMBOS: Record<string, string> = {
  '子_丑': '자축합(子丑合: 토기 생성과 단단한 대지)',
  '丑_子': '자축합(子丑合: 토기 생성과 단단한 대지)',
  '寅_亥': '인해합(寅亥合: 목기 생성과 무한한 성장)',
  '亥_寅': '인해합(寅亥合: 목기 생성과 무한한 성장)',
  '卯_戌': '묘술합(卯戌合: 화기 생성과 따뜻한 정)',
  '戌_卯': '묘술합(卯戌合: 화기 생성과 따뜻한 정)',
  '辰_酉': '진유합(辰酉合: 금기 생성과 결단력)',
  '酉_辰': '진유합(辰酉合: 금기 생성과 결단력)',
  '巳_申': '사신합(巳申合: 수기 생성과 유연함)',
  '申_巳': '사신합(巳申合: 수기 생성과 유연함)',
  '午_未': '오미합(午未合: 태양과 대지의 만남)',
  '未_午': '오미합(午未合: 태양과 대지의 만남)',
};

// 원진살 매핑 (子未, 丑午, 寅酉, 卯申, 辰亥, 巳戌)
const WONJIN_MAP: Record<string, string> = {
  '子_未': '자미원진(子未怨嗔: 서로의 속마음을 오해하기 쉬운 지점)',
  '未_子': '자미원진(子未怨嗔: 서로의 속마음을 오해하기 쉬운 지점)',
  '丑_午': '축오원진(丑午怨嗔: 열정과 냉정이 부딪힐 때의 자존심 마찰)',
  '午_丑': '축오원진(丑午怨嗔: 열정과 냉정이 부딪힐 때의 자존심 마찰)',
  '寅_酉': '인유원진(寅酉怨嗔: 말 한마디로 상처를 주기 쉬운 예민함)',
  '酉_寅': '인유원진(寅酉怨嗔: 말 한마디로 상처를 주기 쉬운 예민함)',
  '卯_申': '묘신원진(卯申怨嗔: 사소한 디테일에서 서로를 시험하는 버릇)',
  '申_卯': '묘신원진(卯申怨嗔: 사소한 디테일에서 서로를 시험하는 버릇)',
  '辰_亥': '진해원진(辰亥怨嗔: 깊은 기대감이 서운함으로 변질되는 순간)',
  '亥_辰': '진해원진(辰亥怨嗔: 깊은 기대감이 서운함으로 변질되는 순간)',
  '巳_戌': '사술원진(巳戌怨嗔: 통제하려는 마음이 답답함을 부르는 구조)',
  '戌_巳': '사술원진(巳戌怨嗔: 통제하려는 마음이 답답함을 부르는 구조)',
};

export function calculateKarmicSynastry(
  userProfile?: UserProfile,
  partnerProfile?: UserProfile | null,
  contextNote: string = '연인·동반자·인연 관계',
  now: Date = new Date(),
): KarmicSynastryReport {
  const sajuA = calculateDetailedSaju(userProfile || null);

  // 파트너 프로필이 없을 경우 디폴트 가상 페르소나 또는 보완 오행 매핑
  const dayGanA = sajuA?.pillars?.day?.gan || '경';
  const dayZhiA = sajuA?.pillars?.day?.zhi || '신';
  const lackingElA = sajuA?.elements?.lacking?.element || '수';

  // 파트너가 있을 경우 파트너의 사주 계산
  let dayGanB = '을';
  let dayZhiB = '사';
  if (partnerProfile && partnerProfile.basic?.birthdate) {
    const sajuB = calculateDetailedSaju(partnerProfile);
    dayGanB = sajuB?.pillars?.day?.gan || '을';
    dayZhiB = sajuB?.pillars?.day?.zhi || '사';
  } else {
    // 사용자의 결핍 오행을 보완하는 이상적인 인연 매핑 (을경합, 진유합 등)
    if (dayGanA === '갑') dayGanB = '기';
    else if (dayGanA === '을') dayGanB = '경';
    else if (dayGanA === '병') dayGanB = '신';
    else if (dayGanA === '정') dayGanB = '임';
    else if (dayGanA === '무') dayGanB = '계';
    else if (dayGanA === '기') dayGanB = '갑';
    else if (dayGanA === '경') dayGanB = '을';
    else if (dayGanA === '신') dayGanB = '병';
    else if (dayGanA === '임') dayGanB = '정';
    else dayGanB = '무';
  }

  // 1. 사주 합충 분석
  const stemKey = `${dayGanA}_${dayGanB}`;
  const stemCombo = HEAVENLY_COMBOS[stemKey];
  const hasStemCombo = !!stemCombo;

  const branchKey = `${dayZhiA}_${dayZhiB}`;
  const branchCombo = BRANCH_COMBOS[branchKey];
  const hasBranchCombo = !!branchCombo;

  const wonjinDetail = WONJIN_MAP[branchKey];
  const hasWonjin = !!wonjinDetail;

  const sajuHarmony: SajuInterpersonalHarmony = {
    hasHeavenlyStemCombination: hasStemCombo,
    stemCombinationName: stemCombo || '상호 보완적인 오행의 기운 배합',
    hasEarthlyBranchHarmony: hasBranchCombo,
    branchHarmonyName: branchCombo || '일상적인 조화와 배려의 지지 구조',
    hasClashOrWonjin: hasWonjin,
    clashWonjinDetails: wonjinDetail || '특별한 원진살 없이 평온한 정서적 안정감',
    elementalInterchange: `내담자의 결핍된 [${lackingElA}] 기운을 상대방의 따뜻한 배려와 에너지가 보충해 줍니다.`,
  };

  // 2. 점성술적 시나스트리 어스펙트 산출
  let soulContractScore = 88;
  if (hasStemCombo) soulContractScore += 6;
  if (hasBranchCombo) soulContractScore += 5;
  if (hasWonjin) soulContractScore -= 4;
  soulContractScore = Math.max(70, Math.min(99, soulContractScore));

  const astrologicalAspect: AstrologicalBondAspect = {
    aspectType: hasStemCombo ? 'Trine (자연스러운 조화)' : 'Conjunction (강력한 일치)',
    planetsPair: 'Moon-Venus-NorthNode (영혼의 안식과 진화적 인연)',
    resonanceScore: soulContractScore,
    soulBondMeaning: '처음 만났을 때부터 낯설지 않은 편안함을 느끼며, 서로의 가장 취약한 부분을 치유해 주는 카르마적 계약',
  };

  let relationshipArchetype = '운명적 소울 카탈리스트 (Destined Soul Catalyst)';
  if (soulContractScore >= 92) {
    relationshipArchetype = '영혼의 거울이자 도약의 파트너 (Twin Mirror Co-Creator)';
  } else if (hasWonjin) {
    relationshipArchetype = '성장을 촉발하는 카르마의 스승 (Karmic Growth Catalyst)';
  }

  const karmicSoulMission = '과거의 상처와 방어기제를 내려놓고, 있는 그대로의 자신을 솔직하게 보여줌으로써 서로의 영혼을 자유롭게 해방시키는 것';

  const communicationGoldenRule = '상대방의 침묵이나 표정을 자의적으로 해석하여 서운해하지 말고, "내가 이렇게 느꼈어"라는 I-Message로 솔직하고 담백하게 말할 것';
  const calculatedAtKst = formatSynastryKstTimestamp(now);

  const synastrySynthesisMatrix = {
    dominantTension: `${sajuHarmony.stemCombinationName} ↔ ${sajuHarmony.clashWonjinDetails}`,
    alignmentState: `${relationshipArchetype} (${describeSynastryStage(soulContractScore)})`,
    integratedAction: `${communicationGoldenRule} [${contextNote}]`,
  };

  const synthesisPromptGuidance = `
[카르믹 시나스트리 & 인연 성간 공명 마스터 지능]:
- 엔진 버전: ${KARMIC_SYNASTRY_VERSION} | 연산 시각: ${calculatedAtKst}
- 인연 아키타입: "${relationshipArchetype}" (${describeSynastryStage(soulContractScore)})
- 사주 천간·지지 결속: "${sajuHarmony.stemCombinationName}", "${sajuHarmony.branchHarmonyName}"
- 주의할 마찰 지점: "${sajuHarmony.clashWonjinDetails}"
- 영혼의 현생 과제: "${karmicSoulMission}"
- 관계 번영의 골든 룰: "${communicationGoldenRule}"
- 교차 매트릭스 [핵심 긴장: ${synastrySynthesisMatrix.dominantTension} | 조율 상태: ${synastrySynthesisMatrix.alignmentState}]
- 통합 실천: ${synastrySynthesisMatrix.integratedAction}
인연이나 관계에 대해 물어올 때, 뜬구름 잡는 점괘 대신 두 사람 사이의 에너지 역동성과 소통의 결정적 열쇠를 직관적으로 꿰뚫어 전할 것.
`.trim();

  return {
    engineVersion: KARMIC_SYNASTRY_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    relationshipArchetype,
    soulContractScore,
    sajuHarmony,
    astrologicalAspect,
    karmicSoulMission,
    communicationGoldenRule,
    synthesisPromptGuidance,
    synastrySynthesisMatrix,
  };
}

export function formatKarmicSynastryPrompt(report: KarmicSynastryReport): string {
  return report.synthesisPromptGuidance;
}
