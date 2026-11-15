/**
 * =========================================================================
 * LUCKEY 고대 조로아스터교 아샤(Asha) 신성 우주 질서 & 3대 선행 진실 엔진
 * (Zoroastrian Asha Cosmic Order & Threefold Truth Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 인류 최고(最古)의 계시 윤리 종교인 고대 페르시아 조로아스터교 아베스타(Avesta) 및 가타(Gathas) 원전.
 * 우주를 관통하는 불멸의 신성한 질서이자 진리인 '아샤(Asha / Arta)'와
 * 인간의 영혼이 걸어야 할 3대 선행의 길을 계량화합니다.
 * 
 * 1. 우주 양대 축:
 *    - 아샤(Asha): 궁극의 우주적 신성 질서, 의로움, 진실, 불멸의 정의
 *    - 드루지(Druj): 혼돈, 왜곡, 기만, 순간의 이익을 위한 거짓된 타협
 * 2. 3대 선행의 길(Threefold Path):
 *    - 후마타 (Humata, Good Thoughts / 선한 생각) - 편견과 시기를 배제한 투명한 지성
 *    - 후크타 (Hukhta, Good Words / 선한 말) - 진실을 수호하고 인연을 살리는 고결한 언어
 *    - 흐바르슈타 (Hvarshta, Good Deeds / 선한 행동) - 타인을 구제하고 창조적 조화를 짓는 실천
 * 3. 아타르(Atar, 성스러운 불):
 *    - 영혼의 양심과 순수성을 가늠하는 신성한 불꽃의 정화 지수
 * 4. 스펜타 마이뉴(Spenta Mainyu, 거룩한 창조적 영):
 *    - 갈등과 결단의 기로에서 거짓된 환상을 끊고 진정한 승리로 이끄는 윤리적 결단 나침반
 */

import type { UserProfile } from '../sharedState';

export const ZOROASTRIAN_ASHA_VERSION = 'LUCKEY-ZOROASTRIAN-ASHA-v2.0.0';

export interface ThreefoldPillars {
  humataScore: number;     // 선한 생각 (0 ~ 100)
  hukhtaScore: number;     // 선한 말 (0 ~ 100)
  hvarshtaScore: number;   // 선한 행동 (0 ~ 100)
  integratedRighteousnessScore: number; // 3대 선행 통합 지수 (0 ~ 100)
  dominantPillarStrengths: string;      // 가장 빛나는 덕목 설명
}

export interface SacredAtarFireStatus {
  firePurityScore: number;  // 아타르(Atar) 내적 양심의 불꽃 순도 (0 ~ 100)
  flameRadianceState: '타오르는 태양빛 (Solar Blaze)' | '순결한 성화 (Pure Flame)' | '은은한 영적 촛불 (Gentle Lamp)' | '재 속의 불씨 (Awakening Ember)';
  drujDissolutionPower: number; // 거짓/타협을 소멸시키는 영적 분별력 (0 ~ 100)
}

export interface EthicalDiscernmentGuidance {
  currentTrialTheme: string;        // 영혼이 직면한 진실의 시험 테마
  truthAshaPath: string;            // 타협 없이 나아가야 할 올바른 진리의 길
  illusionToDiscard: string;        // 배제해야 할 달콤한 거짓/합리화
  creativeSpentaAdvice: string;     // 거룩한 창조적 실천 지침
}

export interface ZoroastrianAshaReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  ashaAlignmentScore: number; // 아샤(Asha) 우주적 진리 일치도 (내부 호환용, 프롬프트 비노출)
  ashaQualitativeStage: string;
  threefoldPillars: ThreefoldPillars;
  sacredAtar: SacredAtarFireStatus;
  discernment: EthicalDiscernmentGuidance;
  situationalEthicalFocus: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  synthesisTruthMaxim: string;
}

function describeAshaStage(score: number): string {
  if (score >= 90) return '명징한 진리 정렬기 (생각·말·행동이 한 결로 모이는 국면)';
  if (score >= 82) return '성화 수호기 (원칙을 지킬수록 신뢰가 쌓이는 국면)';
  return '정화 성찰기 (모호한 타협을 덜어내고 중심을 세울 국면)';
}

function describeDrujDissolutionStage(score: number): string {
  if (score >= 88) return '단호한 분별 (자기합리화를 곧장 꿰뚫어 보는 명료함)';
  if (score >= 78) return '차분한 검증 (감정과 사실을 구분해 균형을 잡는 힘)';
  return '신중한 경계 (서두르지 않고 사실 확인을 한 번 더 거치는 태도)';
}

export function calculateZoroastrianAshaTruth(
  profileOrParams: UserProfile | null | undefined | { profile?: UserProfile | null; contextText?: string; now?: Date },
  contextText?: string
): ZoroastrianAshaReport {
  const profile = (profileOrParams && 'profile' in profileOrParams) ? profileOrParams.profile : (profileOrParams as UserProfile | null | undefined);
  const effectiveContextText = contextText || (profileOrParams && 'contextText' in profileOrParams ? profileOrParams.contextText : '');
  const now = (profileOrParams && 'now' in profileOrParams && profileOrParams.now) ? profileOrParams.now : new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const birthYear = profile?.basic?.birthdate ? parseInt(profile.basic.birthdate.slice(0, 4), 10) || 1993 : 1993;
  const birthMonth = profile?.basic?.birthdate ? parseInt(profile.basic.birthdate.slice(5, 7), 10) || 8 : 8;
  const birthDay = profile?.basic?.birthdate ? parseInt(profile.basic.birthdate.slice(8, 10), 10) || 20 : 20;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const textHash = (effectiveContextText || '')
    .split('')
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 3), 0);

  const seed = (birthYear * 29 + birthMonth * 43 + birthDay * 17 + currentYear * 11 + currentMonth * 31 + currentDay * 13 + textHash) % 10000;

  // 1. 3대 선행 점수 산출
  const humataScore = 72 + ((seed * 7 + birthYear * 3) % 27);   // 72 ~ 98점 (생각)
  const hukhtaScore = 70 + ((seed * 11 + birthMonth * 5) % 29);  // 70 ~ 98점 (말)
  const hvarshtaScore = 74 + ((seed * 13 + birthDay * 7) % 25); // 74 ~ 98점 (행동)
  const integratedRighteousnessScore = Math.round((humataScore + hukhtaScore + hvarshtaScore) / 3);

  let dominantPillarStrengths = '의로운 행동과 솔선수범의 실천력(Hvarshta)';
  if (humataScore >= hukhtaScore && humataScore >= hvarshtaScore) {
    dominantPillarStrengths = '맑고 꿰뚫어 보는 본질적 지성과 통찰(Humata)';
  } else if (hukhtaScore >= humataScore && hukhtaScore >= hvarshtaScore) {
    dominantPillarStrengths = '인연을 세우고 진실을 선언하는 고결한 언어력(Hukhta)';
  }

  // 2. 아타르 성스러운 불 상태
  const firePurityScore = 75 + ((seed * 17) % 24); // 75 ~ 98점
  const drujDissolutionPower = 70 + ((seed * 19) % 29); // 70 ~ 98점

  let flameRadianceState: SacredAtarFireStatus['flameRadianceState'] = '순결한 성화 (Pure Flame)';
  if (firePurityScore >= 92) flameRadianceState = '타오르는 태양빛 (Solar Blaze)';
  else if (firePurityScore >= 84) flameRadianceState = '순결한 성화 (Pure Flame)';
  else if (firePurityScore >= 78) flameRadianceState = '은은한 영적 촛불 (Gentle Lamp)';
  else flameRadianceState = '재 속의 불씨 (Awakening Ember)';

  const sacredAtar: SacredAtarFireStatus = {
    firePurityScore,
    flameRadianceState,
    drujDissolutionPower,
  };

  // 3. 윤리적 분별 지침
  const trialThemes = [
    '단기적 이익과 장기적 신뢰 사이의 진실성 시험',
    '타인의 편견에 휩쓸리지 않고 객관적 정의를 지키는 결단',
    '내면의 두려움으로 인한 회피를 멈추고 당당한 투명성을 드러낼 과제',
    '자신의 가치관과 타협을 요구하는 외부 압력에 맞서는 용기',
    '말과 행동의 일치를 통해 흔들리지 않는 신의를 증명하는 순간',
  ];
  const currentTrialTheme = trialThemes[seed % trialThemes.length];

  const truthAshaPath = '눈앞의 손익 계산보다 "10년 뒤에도 떳떳한가?"라는 절대적 진실의 잣대를 택하십시오. 정직한 직진이 가장 안전한 지름길입니다.';
  const illusionToDiscard = '"이번 한 번쯤은 괜찮겠지"라는 자기합리화와 모호한 침묵을 단호히 거두어들이십시오.';
  const creativeSpentaAdvice = '선한 생각(Humata)을 마음에 품었으면, 주저 없이 명료한 언어(Hukhta)로 선언하고 즉각 당당한 행동(Hvarshta)으로 매듭지으십시오.';

  const discernment: EthicalDiscernmentGuidance = {
    currentTrialTheme,
    truthAshaPath,
    illusionToDiscard,
    creativeSpentaAdvice,
  };

  const ashaAlignmentScore = Math.round((integratedRighteousnessScore * 0.5) + (firePurityScore * 0.5));
  const ashaQualitativeStage = describeAshaStage(ashaAlignmentScore);
  const situationalEthicalFocus = /관계|사람|가족|연애|갈등/.test(effectiveContextText || '')
    ? '관계 속 진실성 — 듣기 좋은 모호함보다 상대와 나를 모두 지키는 투명한 말(Hukhta)을 고르십시오.'
    : /일|사업|직장|결정|돈|계약/.test(effectiveContextText || '')
      ? '일과 결정의 원칙 — 단기 편의보다 장기 신뢰가 남는 행동(Hvarshta)으로 매듭지으십시오.'
      : '생각·말·행동의 일치 — 마음속 기준을 작은 실천 하나로 옮길 때 성화가 밝아집니다.';
  const dailyPracticeRitual = '오늘 한 번은 모호하게 미루던 답을 사실에 근거해 분명하고 다정하게 전해 보십시오.';
  const reflectiveQuestion = '지금 내가 편의를 위해 스스로에게 둘러대고 있는 합리화 한 가지는 무엇인가요?';
  const interpretiveBoundary = '본 아샤(Asha) 리포트는 고대 아베스타의 윤리·성찰 상징에 기반한 정성적 안내이며, 절대적 도덕 심판이 아닙니다.';

  const synthesisTruthMaxim = '아베스타 원전의 가르침: "오직 하나의 길만이 존재하니, 그것은 진리(Asha)의 길이며, 다른 모든 길은 신기루에 불과하다." 당당한 진실의 선택이 내면의 평안과 신뢰를 부릅니다.';

  return {
    engineVersion: ZOROASTRIAN_ASHA_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    ashaAlignmentScore,
    ashaQualitativeStage,
    threefoldPillars: {
      humataScore,
      hukhtaScore,
      hvarshtaScore,
      integratedRighteousnessScore,
      dominantPillarStrengths,
    },
    sacredAtar,
    discernment,
    situationalEthicalFocus,
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    synthesisTruthMaxim,
  };
}

export function formatZoroastrianAshaTruthPrompt(report: ZoroastrianAshaReport): string {
  return `### 🔥 고대 조로아스터교 아샤(Asha) 신성 우주 질서 & 3대 선행 진실 엔진 (${ZOROASTRIAN_ASHA_VERSION})
- **연산 시각**: ${report.calculatedAtKst}
- **아샤(Asha) 진리 정렬 단계**: ${report.ashaQualitativeStage}
- **3대 선행의 길(Threefold Path of Righteousness)**:
  - 후마타(선한 생각) · 후크타(선한 말) · 흐바르슈타(선한 행동) 중 **가장 빛나는 강점 덕목**: ${report.threefoldPillars.dominantPillarStrengths}
- **신성한 성화 아타르(Atar) 불꽃 상태**:
  - 성화 광채 상태: **${report.sacredAtar.flameRadianceState}**
  - 거짓·타협 분별력: ${describeDrujDissolutionStage(report.sacredAtar.drujDissolutionPower)}
- **질문 맥락 분별 초점**: ${report.situationalEthicalFocus}
- **영혼의 진실 분별 지침(Ethical Discernment)**:
  - 현재 당면 시험: ${report.discernment.currentTrialTheme}
  - 올바른 진리의 길: ${report.discernment.truthAshaPath}
  - 배제할 환상: ${report.discernment.illusionToDiscard}
  - 창조적 실천 권고: ${report.discernment.creativeSpentaAdvice}
- **오늘의 실천 의례**: ${report.dailyPracticeRitual}
- **성찰 질문**: ${report.reflectiveQuestion}
- **우주적 진리 잠언**: ${report.synthesisTruthMaxim}
- **해석 경계**: ${report.interpretiveBoundary}`;
}
