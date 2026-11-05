/**
 * =========================================================================
 * LUCKEY 도교 종려권·여동빈 종여내단(鍾呂內丹) 3품 선도 & 환원 엔진
 * (Zhong-Lu Taoist Inner Alchemy & Three Tiers of Immortality Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 《도장(道藏)》 종여내단(鍾呂內丹) 최고 성전인 《종려전도집(鍾呂傳道集)》과
 * 《영보필법(靈寶畢法)》 정통 원전.
 * 
 * 1. 3품 선도 (Three Tiers of Immortality / 三品仙道):
 *    - 지선(地仙): 신체와 기혈을 온전히 보전하여 무병장수하고 현실의 평온을 누림
 *    - 신선(神仙): 삼화취정(三花聚頂)과 오기조원(五氣朝元), 감정과 집착을 초월한 자유자재
 *    - 천선(天仙): 연신환허(鍊神還虛), 우주 본원 대도(大道)와 하나가 되는 궁극의 각성
 * 
 * 2. 3단계 내단 연단 승화도 (Three Transmutation Stages):
 *    - 1단계 연정화기(鍊精化氣): 하단전 원정의 축적과 신체 생명력 회복
 *    - 2단계 연기화신(鍊氣化神): 중단전 심신 정화와 가슴의 신명(神明) 개방
 *    - 3단계 연신환허(鍊神還虛): 상단전 원신(元神)의 광명과 집착 없는 맑은 통찰
 * 
 * 3. 수화기제(水火旣濟) 조화 지수 (Kan-Li Harmonic Balance - 0 ~ 100)
 */

import type { UserProfile } from '../sharedState';

export const ZHONG_LU_INNER_ALCHEMY_VERSION = 'LUCKEY-ZHONG-LU-ALCHEMY-v1.0.0';

export interface AlchemyStageScores {
  refineJingToQiScore: number;     // 0 ~ 100 연정화기 (기초 활력)
  refineQiToShenScore: number;     // 0 ~ 100 연기화신 (감정 정화)
  refineShenToVoidScore: number;   // 0 ~ 100 연신환허 (통찰 초월)
  dominantStage: string;
}

export interface ImmortalityTierResonance {
  tierName: string;
  koreanTitle: string;
  attainmentFocus: string;         // 성취 요체
  livingPrescription: string;      // 일상 실천 양생 지침
}

export interface ZhongLuAlchemyReport {
  engineVersion: string;
  calculatedAt: string;
  stageScores: AlchemyStageScores;
  immortalityTier: ImmortalityTierResonance;
  kanLiHarmonyScore: number;       // 수화기제 조화 지수 (0 ~ 100)
  zhongLuAphorism: string;
  synthesisMessage: string;
}

const IMMORTALITY_TIERS: ImmortalityTierResonance[] = [
  {
    tierName: '지선품 (地仙品 - Earthly Grounding)',
    koreanTitle: '무병장수와 튼튼한 현실 기반의 지선',
    attainmentFocus: '기혈을 조화롭게 하고 일상의 리듬과 신체 균형을 확고히 다짐',
    livingPrescription: '수면과 식사를 정갈하게 하고, 과욕을 부리지 말며 몸의 피로를 그날그날 풀어내세요.',
  },
  {
    tierName: '신선품 (神仙品 - Spiritual Freedom)',
    koreanTitle: '오기조원과 맑은 감정 초월의 신선',
    attainmentFocus: '희노애락의 집착에서 벗어나 가슴의 영적인 평온과 자비를 회복함',
    livingPrescription: '외부 평가나 일시적 손익에 마음을 빼앗기지 말고, 고요히 내면의 샘물을 관조하세요.',
  },
  {
    tierName: '천선품 (天仙品 - Celestial Void)',
    koreanTitle: '대도와 합일하는 궁극의 초연함 천선',
    attainmentFocus: '우주 만물과 하나가 되어 무위자연(無爲自然)의 순리를 따르는 높은 각성',
    livingPrescription: '억지로 결과를 조작하려 하지 말고, 물이 흐르듯 자연스러운 타이밍에 맡기세요.',
  },
];

export function calculateZhongLuInnerAlchemy(profile?: UserProfile): ZhongLuAlchemyReport {
  const now = new Date();
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'ZhongLu';

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 23 + nameStr.charCodeAt(i)) & 0x7fffffff;

  const refineJingToQiScore = 72 + ((seed * 3 + now.getUTCHours() * 7) % 27);
  const refineQiToShenScore = 70 + ((seed * 5 + now.getUTCDate() * 9) % 29);
  const refineShenToVoidScore = 68 + ((seed * 7 + now.getUTCMonth() * 11) % 31);

  let dominantStage = '연정화기(鍊精化氣 - 견고한 체력과 추진력)';
  const maxScore = Math.max(refineJingToQiScore, refineQiToShenScore, refineShenToVoidScore);
  if (maxScore === refineQiToShenScore) dominantStage = '연기화신(鍊氣化神 - 가슴 벅찬 열정과 온화한 포용력)';
  else if (maxScore === refineShenToVoidScore) dominantStage = '연신환허(鍊神還虛 - 높은 직관과 흔들림 없는 평정심)';

  const tierIdx = (seed + now.getUTCDate()) % IMMORTALITY_TIERS.length;
  const immortalityTier = IMMORTALITY_TIERS[tierIdx];

  const kanLiHarmonyScore = Math.round((refineJingToQiScore + refineQiToShenScore + refineShenToVoidScore) / 3);

  const zhongLuAphorism = `종려전도집 원전에 따르면: "마음의 불(심화)을 가라앉혀 신장으로 보내고, 신장의 맑은 물(신수)을 증류하여 심장으로 올리니 이것이 진정한 수화기제(水火旣濟)이니라."`;

  const synthesisMessage = `종려내단 선도 원전에 따라, 당신의 기운은 [${immortalityTier.koreanTitle}]을 향하고 있으며 현재 중심 연단 단계는 [${dominantStage}]입니다 (수화기제 조화도: ${kanLiHarmonyScore}점).`;

  return {
    engineVersion: ZHONG_LU_INNER_ALCHEMY_VERSION,
    calculatedAt: now.toISOString(),
    stageScores: {
      refineJingToQiScore,
      refineQiToShenScore,
      refineShenToVoidScore,
      dominantStage,
    },
    immortalityTier,
    kanLiHarmonyScore,
    zhongLuAphorism,
    synthesisMessage,
  };
}

export function formatZhongLuInnerAlchemyPrompt(report: ZhongLuAlchemyReport): string {
  return `### ☯️ 도교 종려권·여동빈 종여내단(鍾呂內丹) 3품 선도 & 환원 엔진 (${ZHONG_LU_INNER_ALCHEMY_VERSION})
- **내단 3단계 연단 승화도 (수화기제 조화도: ${report.kanLiHarmonyScore}점)**:
  - 1단계 연정화기(활력): ${report.stageScores.refineJingToQiScore}점 | 2단계 연기화신(감정): ${report.stageScores.refineQiToShenScore}점 | 3단계 연신환허(통찰): ${report.stageScores.refineShenToVoidScore}점
  - 현재 주도 연단 국면: **${report.stageScores.dominantStage}**
- **3품 선도 공명**: **${report.immortalityTier.koreanTitle}**
  - 성취 요체: ${report.immortalityTier.attainmentFocus}
  - 일상 실천 처방: ${report.immortalityTier.livingPrescription}
- **종려전도집 경구**: ${report.zhongLuAphorism}
- **종여내단 통합 나침반**: ${report.synthesisMessage}`;
}
