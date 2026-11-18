/**
 * 한국 조선 실학 혜강 최한기(崔漢綺) 기학(氣學) & 신기통(神氣通) 운화(運化) 지혜 엔진
 *
 * 19세기 조선 실학의 거봉 혜강 최한기 선생의 《기학(氣學)》, 《신기통(神氣通)》, 《신기천험(神氣踐驗)》 원전 기반:
 * 1. 운화기(運化氣): 우주 만물은 고정된 실체가 아니라 끊임없이 생성·변화·순환하는 기(氣)의 거대한 흐름.
 * 2. 신기(神氣)와 신기통(神氣通):
 *    - 외적 감각 경험(목·이·비·설·신)과 내적 마음(사유와 의지)이 끊임없이 교류하고 소통하여 지식을 형성함.
 *    - 소통이 막히면 병폐와 편견이 생기고, 신기통이 원활하면 지혜와 덕성이 활달해짐.
 * 3. 추측지리(推測之理): 이미 경험한 바를 미루어 아직 겪지 않은 것을 합리적으로 예측하고 검증하는 실증적 지성.
 * 4. 통민(通民)과 공변된 삶: 한 사람의 앎과 덕은 홀로 닫혀 있지 않고 온 백성과 소통하여 공익을 실현해야 함.
 * 5. 대동(大同) 화협: 우주 자연과 인간 사회가 기(氣)의 막힘없는 조화 속에서 평형을 이루는 궁극의 경지.
 *
 * @version LUCKEY-CHOE-HANGI-GIHAK-UNWHA-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const CHOE_HANGI_GIHAK_UNWHA_VERSION = 'LUCKEY-CHOE-HANGI-GIHAK-UNWHA-v2.2.0';

export interface ChoeHangiGihakPrinciple {
  principleKey: string;
  principleNameKo: string;
  sourceText: string;
  coreCosmology: string;
  practicalCounsel: string;
}

export interface ChoeHangiUnwhaPractice {
  practiceKey: string;
  practiceNameKo: string;
  epistemicFocus: string;
  actionGuidance: string;
}

export interface ChoeHangiGihakUnwhaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  unwhagiCosmicFlowScore: number;        // 운화기(運化氣) 우주 변화 순응 조화도
  singitongPerceptualMindScore: number;  // 신기통(神氣通) 감각·마음 소통 지성도
  chucheukEmpiricalInsightScore: number; // 추측(推測) 경험 관찰 실증 통찰력
  tongminPublicConnectionScore: number;  // 통민(通民) 만인 소통과 공익 연대도
  daedongUniversalHarmonyScore: number;  // 대동(大同) 평형 화협 지수
  // 세부 체계
  activeGihakPrinciple: ChoeHangiGihakPrinciple;
  focalUnwhaPractice: ChoeHangiUnwhaPractice;
  secondaryGihakPrinciple: ChoeHangiGihakPrinciple;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  choeHangiPhilosophicalCounsel: {
    counselTitle: string;
    practicalGuidance: string;
  };
  gihakSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatChoeHangiKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeGihakStage(score: number): string {
  if (score >= 88) return '대동운화(大同運化) — 감각과 사유, 공익의 기운이 막힘없이 소통하는 흐름';
  if (score >= 78) return '신기통달(神氣通達) — 경험과 추측의 이치가 현실과 균형을 이루는 국면';
  return '천험수양(踐驗修養) — 작은 실천과 현장 검증으로 기운의 흐름을 틔우는 시기';
}

export type ChoeHangiGihakUnwhaReport = ChoeHangiGihakUnwhaResult;

const GIHAK_PRINCIPLES: ChoeHangiGihakPrinciple[] = [
  {
    principleKey: 'UnwhagiDynamicFlow',
    principleNameKo: '운화기(運化氣)의 동적 순환과 생성',
    sourceText: '《기학(氣學)》 권1',
    coreCosmology: '천지간의 모든 사물과 사건은 고정불변하지 않고 기의 운화에 따라 끊임없이 새로워진다.',
    practicalCounsel: '지나간 상황이나 낡은 틀에 집착하지 말고, 현재 흐르고 있는 기운의 변화에 유연하게 발맞추십시오.',
  },
  {
    principleKey: 'SingitongCommunication',
    principleNameKo: '신기통(神氣通)의 내외 감응과 소통',
    sourceText: '《신기통(神氣通)》 권지상',
    coreCosmology: '몸의 감각과 마음의 사유가 막힘없이 통할 때 편견을 벗어나 온전한 앎에 도달한다.',
    practicalCounsel: '혼자만의 생각에 갇히지 말고, 현장의 생생한 소리와 타인의 피드백을 열린 마음으로 받아들여 조율하십시오.',
  },
  {
    principleKey: 'ChucheukRealism',
    principleNameKo: '추측(推測)의 실증적 검증과 이성',
    sourceText: '《신기천험(神氣踐驗)》',
    coreCosmology: '공리공론에 빠지지 않고 직접 보고 겪은 실제적 근거를 바탕으로 사리의 마땅함을 헤아린다.',
    practicalCounsel: '막연한 억측이나 추상적 불안을 버리고, 눈앞의 구체적 사실과 데이터를 바탕으로 명확한 대책을 세우십시오.',
  },
];

const UNWHA_PRACTICES: ChoeHangiUnwhaPractice[] = [
  {
    practiceKey: 'TongminPublicGood',
    practiceNameKo: '통민(通民)과 공익 실천',
    epistemicFocus: '나 혼자만의 안녕을 넘어 주변 사람들과 공익을 도모하는 포용성.',
    actionGuidance: '개인의 이익보다 함께하는 동료와 이웃 모두에게 보탬이 되는 상생의 길을 모색하십시오.',
  },
  {
    practiceKey: 'GyeongheomCheonheom',
    practiceNameKo: '경험과 천험(踐驗)의 성실성',
    epistemicFocus: '생각에 그치지 않고 몸소 실천하고 부딪쳐 보며 이치를 증명하는 태도.',
    actionGuidance: '망설임을 멈추고 현장에서 직접 작은 실천을 행하며 그 결과를 바탕으로 다음 걸음을 정하십시오.',
  },
  {
    practiceKey: 'DaedongHarmony',
    practiceNameKo: '대동(大同)의 조화로운 균형',
    epistemicFocus: '과도함이나 치우침 없이 음양과 기운의 평형을 이루는 중정(中正).',
    actionGuidance: '무리한 욕심이나 과속을 경계하고, 몸과 마음의 기운이 온화하게 순환할 수 있도록 균형을 잡으십시오.',
  },
];

export function calculateChoeHangiGihakUnwha(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): ChoeHangiGihakUnwhaResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    (query ?? '') +
    'ChoeHangiGihakUnwha';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const unwhagiCosmicFlowScore = 67 + (absHash % 32);
  const singitongPerceptualMindScore = 66 + ((absHash >> 3) % 33);
  const chucheukEmpiricalInsightScore = 68 + ((absHash >> 6) % 31);
  const tongminPublicConnectionScore = 64 + ((absHash >> 9) % 35);
  const daedongUniversalHarmonyScore = 65 + ((absHash >> 12) % 34);

  const principleIndex = (absHash >> 4) % GIHAK_PRINCIPLES.length;
  const practiceIndex = (absHash >> 7) % UNWHA_PRACTICES.length;
  const secondaryPrincipleIndex = (principleIndex + 1 + ((absHash >> 10) % (GIHAK_PRINCIPLES.length - 1))) % GIHAK_PRINCIPLES.length;

  const activeGihakPrinciple = GIHAK_PRINCIPLES[principleIndex];
  const focalUnwhaPractice = UNWHA_PRACTICES[practiceIndex];
  const secondaryGihakPrinciple = GIHAK_PRINCIPLES[secondaryPrincipleIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 관념적 억측을 걷어 내고 실제 경험과 신기통(神氣通) 소통으로 바로 확인해 볼 사실은 무엇인가요?`
    : `지금 내 일에서 막혀 있는 신기(神氣)의 소통을 트이게 할 한 번의 현장 검증(踐驗)은 무엇인가요?`;
  const interpretiveBoundary = '혜강 최한기 기학·신기통 관점은 길흉 예단이 아니라, 경험적 추측과 막힘없는 소통을 비추는 실학 성찰 렌즈입니다.';

  const counselTitle = `혜강 최한기 기학 운화 지혜: ${activeGihakPrinciple.principleNameKo}`;
  const practicalGuidance = `조선 후기 실학자 혜강 최한기 선생의 기학(氣學)은 만물의 끊임없는 변화(運化)와 소통(神氣通)을 통한 실천적 지혜를 가르칩니다. ` +
    `현재 당신의 흐름은 '${activeGihakPrinciple.principleNameKo}'[${activeGihakPrinciple.sourceText}]에 조응합니다. ` +
    `${activeGihakPrinciple.practicalCounsel} 또한 '${focalUnwhaPractice.practiceNameKo}'의 수양을 실천하여, ` +
    `${focalUnwhaPractice.actionGuidance}`;

  const calculatedAtKst = formatChoeHangiKstTimestamp(now);
  const avgScore = Math.round(
    (unwhagiCosmicFlowScore +
      singitongPerceptualMindScore +
      chucheukEmpiricalInsightScore +
      tongminPublicConnectionScore +
      daedongUniversalHarmonyScore) /
      5,
  );
  const gihakSynthesisMatrix = {
    dominantTension: `${activeGihakPrinciple.principleNameKo} ↔ ${focalUnwhaPractice.practiceNameKo}`,
    alignmentState: describeGihakStage(avgScore),
    integratedAction: `${focalUnwhaPractice.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${activeGihakPrinciple.sourceText}] ${focalUnwhaPractice.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: CHOE_HANGI_GIHAK_UNWHA_VERSION,
    calculatedAtKst,
    unwhagiCosmicFlowScore,
    singitongPerceptualMindScore,
    chucheukEmpiricalInsightScore,
    tongminPublicConnectionScore,
    daedongUniversalHarmonyScore,
    activeGihakPrinciple,
    focalUnwhaPractice,
    secondaryGihakPrinciple,
    reflectiveQuestion,
    interpretiveBoundary,
    choeHangiPhilosophicalCounsel: {
      counselTitle,
      practicalGuidance,
    },
    gihakSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatChoeHangiGihakUnwhaPrompt(res: ChoeHangiGihakUnwhaResult): string {
  const avgScore = Math.round(
    (res.unwhagiCosmicFlowScore +
      res.singitongPerceptualMindScore +
      res.chucheukEmpiricalInsightScore +
      res.tongminPublicConnectionScore +
      res.daedongUniversalHarmonyScore) /
      5,
  );
  const lines = [
    `【혜강 최한기 기학(氣學) & 신기통(神氣通) 운화 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 기학 운화 국면: ${describeGihakStage(avgScore)}`,
    `- 기학 핵심 원리: ${res.activeGihakPrinciple.principleNameKo}`,
    `- 보조 교차 원리: ${res.secondaryGihakPrinciple.principleNameKo} [${res.secondaryGihakPrinciple.sourceText}]`,
    `- 출전: ${res.activeGihakPrinciple.sourceText}`,
    `- 우주론적 바탕: ${res.activeGihakPrinciple.coreCosmology}`,
    `- 실천적 조언: ${res.activeGihakPrinciple.practicalCounsel}`,
    `- 운화 실천 지침: ${res.focalUnwhaPractice.practiceNameKo}`,
    `- 인식적 초점: ${res.focalUnwhaPractice.epistemicFocus}`,
    `- 행동 지침: ${res.focalUnwhaPractice.actionGuidance}`,
    `- 철학적 수양 지침: ${res.choeHangiPhilosophicalCounsel.practicalGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.gihakSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.gihakSynthesisMatrix.dominantTension} | 조율 상태: ${res.gihakSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.gihakSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
