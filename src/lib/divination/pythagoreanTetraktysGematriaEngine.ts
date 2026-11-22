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

export const PYTHAGOREAN_TETRAKTYS_VERSION = 'LUCKEY-PYTHAGOREAN-TETRAKTYS-v2.3.0';

export type TetraktysQuestionTopic = 'career' | 'relationship' | 'decision' | 'inner' | 'general';

export interface TetraktysLevelDistribution {
  monadIdeaWeight: number;         // 0 ~ 100% 모나드(영감/의도)
  dyadPolarityWeight: number;      // 0 ~ 100% 디아드(관계/동기)
  triadHarmonyWeight: number;       // 0 ~ 100% 트리아드(구조/조화)
  tetradManifestWeight: number;    // 0 ~ 100% 테트라드(실행/물질화)
  dominantTier: string;
  secondaryTier: string;
}

export interface GematriaHarmonicSignature {
  soulRootNumber: number;          // 1 ~ 9, 11, 22
  sacredRatioName: string;         // 옥타브(2:1), 완전5도(3:2), 완전4도(4:3) 등
  cosmicHarmonicMeaning: string;
}

export interface PythagoreanTetraktysReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: TetraktysQuestionTopic;
  harmonicSignature: GematriaHarmonicSignature;
  tetraktysDistribution: TetraktysLevelDistribution;
  realityManifestationIndex: number; // 0 ~ 100 현실 물질화 지수
  tetraktysPhase: string;
  shadowWarning: string;
  manifestationObstacleBreakthrough: string;
  sacredGeometryAffirmation: string;
  synthesisMessage: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  tetraktysSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatTetraktysKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function buildTetraktysReflectiveQuestion(dominantTier: string, queryStr: string): string {
  const focus = queryStr.trim();
  if (focus) {
    return `'${focus}'를 현실에 세우는 과정에서 현재 주도 층위(${dominantTier})를 다음 단계로 넘기기 위해 오늘 10분 안에 실행할 구체적 매듭은 무엇인가요?`;
  }
  return `테트락티스 4단계 가운데 지금 [${dominantTier}]에 머물러 있는 생각 하나를 손에 잡히는 결과물로 옮긴다면 첫 단추는 무엇일까요?`;
}

function describeTetraktysStage(score: number): string {
  if (score >= 86) return '데카드 완성기(Decad Manifestation) — 1·2·3·4의 신성 기하가 현실의 구체적 결실로 단단히 구현되는 시기';
  if (score >= 74) return '트리아드 조율기(Triad Harmonics) — 영감과 동기가 조화로운 구조로 엮여 실행으로 넘어가는 시기';
  return '모나드 점화기(Monad Ignition) — 순수 의도의 불꽃을 먼저 명료하게 다듬어 방향을 세우는 시기';
}

function classifyTetraktysQuestionTopic(query?: string): TetraktysQuestionTopic {
  const q = (query || '').toLowerCase();
  if (/일|직장|커리어|사업|프로젝트|서비스|성과|취업|이직/.test(q)) return 'career';
  if (/연애|관계|사랑|부부|가족|사람|갈등|인연/.test(q)) return 'relationship';
  if (/선택|결정|타이밍|방향|전환|고민|계약/.test(q)) return 'decision';
  if (/마음|감정|불안|휴식|회복|내면|성찰/.test(q)) return 'inner';
  return 'general';
}

function buildTetraktysShadowWarning(dominantTier: string, topic: TetraktysQuestionTopic): string {
  const topicNote: Record<TetraktysQuestionTopic, string> = {
    career: '완벽한 설계도만 다듬다가 첫 프로토타입이나 출시 타이밍을 미루는 함정을 경계하세요.',
    relationship: '상대의 마음을 도식이나 논리로만 재단하려 하면 정작 필요한 온기를 놓칠 수 있습니다.',
    decision: '모든 변수를 숫자와 구조로 통제하려는 강박이 결단을 지연시킬 수 있습니다.',
    inner: '머리속 개념 정리에만 매몰되어 몸의 피로 신호를 지나치지 않도록 주의하세요.',
    general: '구상과 구조화에 치우쳐 작은 현실 실행 하나를 뒤로 미루지 않도록 살피세요.',
  };
  return `[${dominantTier}] 과잉 경계: ${topicNote[topic]}`;
}

export function calculatePythagoreanTetraktys(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): PythagoreanTetraktysReport {
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Pythagoras';
  const queryStr = query || '';

  // 생년월일 숫자 합산
  const digits = birthStr.replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < digits.length; i++) sum += parseInt(digits[i], 10);
  for (let i = 0; i < nameStr.length; i++) sum += (nameStr.charCodeAt(i) % 9) + 1;
  for (let i = 0; i < queryStr.length; i++) sum += (queryStr.charCodeAt(i) % 9) + 1;

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

  const tierEntries = [
    { label: '모나드 (새로운 영감 및 순수 의도 점화 단계)', w: monadIdeaWeight },
    { label: '디아드 (선택과 방향성 조율, 인연 협업 단계)', w: dyadPolarityWeight },
    { label: '트리아드 (체계적 구조화 및 조화로운 종합 단계)', w: triadHarmonyWeight },
    { label: '테트라드 (현실 물질화 및 결실 단계)', w: tetradManifestWeight },
  ].sort((a, b) => b.w - a.w);
  const dominantTier = tierEntries[0].label;
  const secondaryTier = tierEntries[1].label;

  const realityManifestationIndex = Math.min(98, Math.max(62, Math.round(tetradManifestWeight * 1.8 + triadHarmonyWeight * 0.9)));

  let manifestationObstacleBreakthrough = '생각의 단계에 머물지 않고 즉시 첫 번째 물리적 행동(프로토타입, 글쓰기, 실행)으로 옮길 때 에너지가 폭발합니다.';
  if (tetradManifestWeight < 20) {
    manifestationObstacleBreakthrough = '아이디어는 찬란하나 마무리가 흩어질 수 있으니, 체크리스트를 3개 이내로 압축해 오늘 완결하세요.';
  } else if (monadIdeaWeight < 20) {
    manifestationObstacleBreakthrough = '기계적인 일상에 매몰되지 않도록, 본래 이 일을 시작했던 최초의 순수한 설렘과 목적을 상기하세요.';
  }

  const sacredGeometryAffirmation = `테트락티스의 10대 성스러운 빛이여, 내 머릿속의 영감을 굳건한 현실의 대지 위에 아름다운 실체로 세우소서.`;

  const synthesisMessage = `피타고라스 테트락티스 기하학에 따르면, 당신의 영혼 루트수는 [${soulRootNumber}]이며 현재 [${dominantTier}]에 있습니다. ${describeTetraktysStage(realityManifestationIndex)} 흐름에 맞춰 "${manifestationObstacleBreakthrough}"`;
  const calculatedAtKst = formatTetraktysKstTimestamp(now);
  const questionTopic = classifyTetraktysQuestionTopic(queryStr);
  const tetraktysPhase = describeTetraktysStage(realityManifestationIndex);
  const shadowWarning = buildTetraktysShadowWarning(dominantTier, questionTopic);
  const reflectiveQuestion = buildTetraktysReflectiveQuestion(dominantTier, queryStr);
  const interpretiveBoundary = '피타고라스 테트락티스와 게마트리아 환원은 실행과 구조화를 돌아보는 수비학적 상징 비유일 뿐, 확정적 미래 예측이나 재무·투자 판단의 근거가 아닙니다.';
  const tetraktysSynthesisMatrix = {
    dominantTension: `${dominantTier} ↔ ${secondaryTier}`,
    alignmentState: `${tetraktysPhase} | 맥락(${questionTopic})`,
    integratedAction: `${manifestationObstacleBreakthrough}${queryStr.trim() ? ` [질문 맥락: ${queryStr.trim()}]` : ''}`,
  };

  return {
    engineVersion: PYTHAGOREAN_TETRAKTYS_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTopic,
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
      secondaryTier,
    },
    realityManifestationIndex,
    tetraktysPhase,
    shadowWarning,
    manifestationObstacleBreakthrough,
    sacredGeometryAffirmation,
    synthesisMessage,
    ritualAction: `영혼 루트수 ${soulRootNumber}(${sacredRatio.name})와 [${dominantTier}]의 기운을 현실에 고정하기 위해, '${manifestationObstacleBreakthrough}'의 첫 단계를 오늘 10분 안에 실행하세요.`,
    reflectionFocus: `테트락티스(${dominantTier} ↔ ${secondaryTier}) — 루트수 ${soulRootNumber}`,
    reflectiveQuestion,
    interpretiveBoundary,
    tetraktysSynthesisMatrix,
  };
}

export function formatPythagoreanTetraktysPrompt(report: PythagoreanTetraktysReport): string {
  const lines = [
    `### 📐 피타고라스 테트락티스 10대 신성기하 & 게마트리아 엔진 (${PYTHAGOREAN_TETRAKTYS_VERSION})`,
    `- **연산 시각**: ${report.calculatedAtKst}`,
    `- **영혼 루트수 (Soul Root)**: **${report.harmonicSignature.soulRootNumber}** [신성 화음비: ${report.harmonicSignature.sacredRatioName}]`,
    `  - 우주적 화음 상징: ${report.harmonicSignature.cosmicHarmonicMeaning}`,
    `- **테트락티스 창조 국면**: ${report.tetraktysPhase}`,
    `- **질문 맥락 분류**: ${report.questionTopic}`,
    `- **현재 주도 층위**: **${report.tetraktysDistribution.dominantTier}**`,
    `- **보조 교차 층위**: ${report.tetraktysDistribution.secondaryTier}`,
    `- **과잉·경계 점검**: ${report.shadowWarning}`,
    `- **물질화 돌파 지침**: ${report.manifestationObstacleBreakthrough}`,
    `- **신성 기하 확언문**: "${report.sacredGeometryAffirmation}"`,
    `- **테트락티스 통합 결론**: ${report.synthesisMessage}`,
  ];
  if (report.tetraktysSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.tetraktysSynthesisMatrix.dominantTension} | 조율 상태: ${report.tetraktysSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.tetraktysSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- **실천 의례**: ${report.ritualAction}`,
    `- **성찰 초점**: ${report.reflectionFocus}`,
    `- **성찰 질문**: ${report.reflectiveQuestion}`,
    `- **해석 경계**: ${report.interpretiveBoundary}`,
  );
  return lines.join('\n');
}
