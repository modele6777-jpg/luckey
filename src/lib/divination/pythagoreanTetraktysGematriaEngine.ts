/**
 * =========================================================================
 * LUCKEY 피타고라스 테트락티스(Tetraktys) 10대 신성기하 & 게마트리아 조화 엔진
 * (Pythagorean Tetraktys Sacred Geometry & Gematria Harmonics Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 그리스 피타고라스 학파(Pythagoreans)의 최고 신성 상징인 테트락티스(Τετρακτύς / Tetraktys)와
 * 신성 기하학적 수비학(Isopsephy / Gematria) 원전.
 * 
 * 테트락티스는 1 + 2 + 3 + 4 = 10(데카드 / Decad)의 삼각수(Triangular Number) 구조로,
 * 비물질적 순수 신성 의도가 물질적 시공간 현실로 구현되는 우주 창조의 4단계 매트릭스:
 * 
 * 1. 4대 테트락티스 층위 (Four Levels of Creation):
 *    - 제1층 모나드 (Monad / 1 점): 시원적 영감, 단일성, 순수 영적 불꽃 (Idea / Fire)
 *    - 제2층 디아드 (Dyad / 2 점): 이원성, 분극과 인력, 선택과 관계의 동역학 (Polarity / Air)
 *    - 제3층 트리아드 (Triad / 3 점): 삼위일체, 대립의 지양과 조화로운 형태 창출 (Harmony / Water)
 *    - 제4층 테트라드 (Tetrad / 4 점): 4원소의 완성, 현실 세계의 단단한 물리적 구현 (Manifestation / Earth)
 * 
 * 2. 게마트리아 수비학적 환원 (Pythagorean Reduction & Harmonic Key):
 *    - 이름의 이솝세피(Isopsephy) 자음/모음 진동수 및 생년월일 영혼수의 테트락티스 좌표 매핑.
 * 
 * 3. 현실 구현율 (Reality Manifestation Index - 0 ~ 100):
 *    - 관념(Idea)이 현실(Matter)로 전환되는 에너지 전달 효율과 구체화 가속 지침.
 */

import type { UserProfile } from '../sharedState';

export const PYTHAGOREAN_TETRAKTYS_VERSION = 'LUCKEY-PYTHAGOREAN-TETRAKTYS-v1.0.0';

export interface TetraktysLevelDistribution {
  monadIdeaWeight: number;         // 0 ~ 100% 모나드(영감/의도)
  dyadPolarityWeight: number;      // 0 ~ 100% 디아드(관계/동기)
  triadHarmonyWeight: number;       // 0 ~ 100% 트리아드(구조/조화)
  tetradManifestWeight: number;    // 0 ~ 100% 테트라드(실행/물질화)
  dominantTier: string;
}

export interface GematriaHarmonicSignature {
  soulRootNumber: number;          // 1 ~ 9, 11, 22
  sacredRatioName: string;         // 옥타브(2:1), 완전5도(3:2), 완전4도(4:3) 등
  cosmicHarmonicMeaning: string;
}

export interface PythagoreanTetraktysReport {
  engineVersion: string;
  calculatedAt: string;
  harmonicSignature: GematriaHarmonicSignature;
  tetraktysDistribution: TetraktysLevelDistribution;
  realityManifestationIndex: number; // 0 ~ 100 현실 물질화 지수
  manifestationObstacleBreakthrough: string;
  sacredGeometryAffirmation: string;
  synthesisMessage: string;
}

export function calculatePythagoreanTetraktys(profile?: UserProfile): PythagoreanTetraktysReport {
  const now = new Date();
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Pythagoras';

  // 생년월일 숫자 합산
  const digits = birthStr.replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < digits.length; i++) sum += parseInt(digits[i], 10);
  for (let i = 0; i < nameStr.length; i++) sum += (nameStr.charCodeAt(i) % 9) + 1;

  // 마스터 넘버(11, 22) 보존 감안
  let root = sum;
  while (root > 9 && root !== 11 && root !== 22) {
    let temp = 0;
    while (root > 0) {
      temp += root % 10;
      root = Math.floor(root / 10);
    }
    root = temp;
  }
  const soulRootNumber = root;

  // 음악적 신성 비율 매핑
  const ratios = [
    { name: '옥타브 (Diapason - 2:1)', meaning: '영혼과 물질의 완벽한 상응, 고차원 자아와의 일체감' },
    { name: '완전 5도 (Diapente - 3:2)', meaning: '창조적 확장과 활기찬 에너지의 융합, 강력한 추진력' },
    { name: '완전 4도 (Diatessaron - 4:3)', meaning: '흔들리지 않는 구조적 안정성, 내실 있는 현실적 구축' },
    { name: '황금비율 (Golden Ratio - 1.618:1)', meaning: '무한한 성장과 미적 조화, 직관적 깨달음의 발현' },
    { name: '신성 테트락티스 (Tetraktys 10:1)', meaning: '우주 전체 질서의 총화, 불가능을 가능케 하는 신성 완성' },
  ];
  const ratioIdx = (sum + now.getUTCDate()) % ratios.length;
  const sacredRatio = ratios[ratioIdx];

  // 4대 층위 가중치 분배
  let rawMonad = 20 + ((sum * 3 + now.getUTCDay() * 7) % 35);
  let rawDyad = 18 + ((sum * 5 + now.getUTCHours() * 3) % 32);
  let rawTriad = 22 + ((sum * 7 + now.getUTCDate() * 5) % 30);
  let rawTetrad = 20 + ((sum * 11 + now.getUTCMonth() * 9) % 34);

  const totalRaw = rawMonad + rawDyad + rawTriad + rawTetrad;
  const monadIdeaWeight = Math.round((rawMonad / totalRaw) * 100);
  const dyadPolarityWeight = Math.round((rawDyad / totalRaw) * 100);
  const triadHarmonyWeight = Math.round((rawTriad / totalRaw) * 100);
  const tetradManifestWeight = 100 - (monadIdeaWeight + dyadPolarityWeight + triadHarmonyWeight);

  let dominantTier = '테트라드 (현실 물질화 및 결실 단계)';
  const maxW = Math.max(monadIdeaWeight, dyadPolarityWeight, triadHarmonyWeight, tetradManifestWeight);
  if (maxW === monadIdeaWeight) dominantTier = '모나드 (새로운 영감 및 순수 의도 점화 단계)';
  else if (maxW === dyadPolarityWeight) dominantTier = '디아드 (선택과 방향성 조율, 인연 협업 단계)';
  else if (maxW === triadHarmonyWeight) dominantTier = '트리아드 (체계적 구조화 및 조화로운 종합 단계)';

  const realityManifestationIndex = Math.min(98, Math.max(62, Math.round(tetradManifestWeight * 1.8 + triadHarmonyWeight * 0.9)));

  let manifestationObstacleBreakthrough = '생각의 단계에 머물지 않고 즉시 첫 번째 물리적 행동(프로토타입, 글쓰기, 실행)으로 옮길 때 에너지가 폭발합니다.';
  if (tetradManifestWeight < 20) {
    manifestationObstacleBreakthrough = '아이디어는 찬란하나 마무리가 흩어질 수 있으니, 체크리스트를 3개 이내로 압축해 오늘 완결하세요.';
  } else if (monadIdeaWeight < 20) {
    manifestationObstacleBreakthrough = '기계적인 일상에 매몰되지 않도록, 본래 이 일을 시작했던 최초의 순수한 설렘과 목적을 상기하세요.';
  }

  const sacredGeometryAffirmation = `테트락티스의 10대 성스러운 빛이여, 내 머릿속의 영감을 굳건한 현실의 대지 위에 아름다운 실체로 세우소서.`;

  const synthesisMessage = `피타고라스 테트락티스 기하학에 따르면, 당신의 영혼 루트수는 [${soulRootNumber}]이며 현재 [${dominantTier}]에 있습니다. 현실 물질화 지수(${realityManifestationIndex}점)에 맞춰 "${manifestationObstacleBreakthrough}"`;

  return {
    engineVersion: PYTHAGOREAN_TETRAKTYS_VERSION,
    calculatedAt: now.toISOString(),
    harmonicSignature: {
      soulRootNumber,
      sacredRatioName: sacredRatio.name,
      cosmicHarmonicMeaning: sacredRatio.meaning,
    },
    tetraktysDistribution: {
      monadIdeaWeight,
      dyadPolarityWeight,
      triadHarmonyWeight,
      tetradManifestWeight,
      dominantTier,
    },
    realityManifestationIndex,
    manifestationObstacleBreakthrough,
    sacredGeometryAffirmation,
    synthesisMessage,
  };
}

export function formatPythagoreanTetraktysPrompt(report: PythagoreanTetraktysReport): string {
  return `### 📐 피타고라스 테트락티스 10대 신성기하 & 게마트리아 엔진 (${PYTHAGOREAN_TETRAKTYS_VERSION})
- **영혼 루트수 (Soul Root)**: **${report.harmonicSignature.soulRootNumber}** [신성 화음비: ${report.harmonicSignature.sacredRatioName}]
  - 우주적 화음 상징: ${report.harmonicSignature.cosmicHarmonicMeaning}
- **테트락티스 4대 창조 층위 에너지 분배**:
  - 1층 모나드(영감) ${report.tetraktysDistribution.monadIdeaWeight}% | 2층 디아드(동기/관계) ${report.tetraktysDistribution.dyadPolarityWeight}%
  - 3층 트리아드(구조/조화) ${report.tetraktysDistribution.triadHarmonyWeight}% | 4층 테트라드(현실구현) ${report.tetraktysDistribution.tetradManifestWeight}%
  - 현재 주도 층위: **${report.tetraktysDistribution.dominantTier}**
- **현실 물질화 지수 (Reality Manifestation Index)**: **${report.realityManifestationIndex}점**
  - 물질화 돌파 지침: ${report.manifestationObstacleBreakthrough}
  - 신성 기하 확언문: "${report.sacredGeometryAffirmation}"
- **테트락티스 통합 결론**: ${report.synthesisMessage}`;
}
