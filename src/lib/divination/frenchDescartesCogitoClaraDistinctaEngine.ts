/**
 * 근대 프랑스 르네 데카르트(René Descartes) 《방법서설》 코기토(Cogito) & 명석판명(Clara et Distincta) 지성 직관 엔진
 *
 * 데카르트의 《방법서설(Discours de la méthode)》 및 《제일철학에 관한 성찰(Meditationes de Prima Philosophia)》 원전 기반.
 * 1. 방법적 회의(Methodic Doubt): 조금이라도 의심의 여지가 있는 모든 감각적 편견과 독단을 철저히 걷어내는 사유의 정화.
 * 2. 코기토 에르고 숨(Cogito, ergo sum): 모든 것을 의심하고 있는 '나'의 사유하는 현존(Res cogitans)은 의심할 수 없는 제1원리.
 * 3. 명석판명한 관념(Idea Clara et Distincta):
 *    - 명석(Clara): 주의 깊은 정신에 직접 드러나는 명료함.
 *    - 판명(Distincta): 다른 모든 것과 혼동되지 않도록 경계가 엄밀하게 구별됨.
 * 4. 방법의 4대 규칙:
 *    - 명증(Évidence): 명석판명한 진리만을 받아들임.
 *    - 분해(Analyse): 복잡한 문제를 가장 단순한 요소들로 잘게 쪼갬.
 *    - 종합(Synthèse): 단순한 것부터 시작하여 점진적으로 복잡한 것을 재구성함.
 *    - 열거(Dénombrement): 빠뜨린 것이 없는지 전면적으로 점검하고 검토함.
 * 5. 잠정적 도덕 규칙(Morale par provision): 삶의 현장에서 행동을 미루지 않고 결단력 있게 정도를 걸어가는 실천 지혜.
 *
 * @version LUCKEY-DESCARTES-COGITO-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const DESCARTES_COGITO_VERSION = 'LUCKEY-DESCARTES-COGITO-v1.0.0';

export interface DescartesMethodRule {
  ruleNumber: number;
  ruleNameFrench: string;
  ruleNameKo: string;
  epistemicFocus: string;
  actionDirective: string;
}

export interface DescartesProvisionalMoralRule {
  moralMaximeNumber: number;
  maximeNameKo: string;
  practicalAttitude: string;
  counselForAction: string;
}

export interface FrenchDescartesCogitoResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  cogitoPresenceCertaintyScore: number;  // 코기토(Cogito) 사유 주체 현존 확신도
  claraDistinctaClarityScore: number;    // 명석판명(Clara et Distincta) 지성 명징도
  methodicDoubtPurificationScore: number;// 방법적 회의 편견 정화도
  fourRulesReasoningScore: number;       // 방법서설 4대 규칙(명증·분해·종합·열거) 실천력
  provisionalMoralResolveScore: number;  // 잠정 도덕 결단력 (주저함 탈피율)
  // 세부 명세
  activeMethodRule: DescartesMethodRule;
  focalProvisionalMoralRule: DescartesProvisionalMoralRule;
  descartesPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type FrenchDescartesCogitoReport = FrenchDescartesCogitoResult;

const METHOD_RULES: DescartesMethodRule[] = [
  {
    ruleNumber: 1,
    ruleNameFrench: 'Règle de l’évidence (명증의 규칙)',
    ruleNameKo: '의심할 수 없이 명석판명한 것만을 진리로 받아들임',
    epistemicFocus: '속단과 선입견을 배제하고 오직 정신의 눈앞에 확실하게 드러난 사실만을 신뢰함.',
    actionDirective: '모호한 추측이나 불확실한 소문에 기대지 말고, 확실히 검증된 사실만을 바탕으로 판단을 시작하십시오.',
  },
  {
    ruleNumber: 2,
    ruleNameFrench: 'Règle de l’analyse (분해의 규칙)',
    ruleNameKo: '복잡한 난제를 해결 가능한 가장 단순한 부분들로 잘게 쪼갬',
    epistemicFocus: '문제를 한 덩어리로 보고 압도되지 않고, 핵심 요소들을 개별 단위로 분해하여 접근함.',
    actionDirective: '난제의 무게에 짓눌리지 말고 문제를 가장 작은 세부 실행 단위로 나누어 하나씩 해결하십시오.',
  },
  {
    ruleNumber: 3,
    ruleNameFrench: 'Règle de la synthèse (종합의 규칙)',
    ruleNameKo: '가장 단순하고 알기 쉬운 것부터 차례로 질서 있게 사유를 구축함',
    epistemicFocus: '기초적인 단계부터 단단한 논리적 계단을 밟아 복잡한 단계로 나아감.',
    actionDirective: '가장 확실하고 쉬운 첫걸음부터 시작하여 차근차근 계통을 세워 나가십시오.',
  },
  {
    ruleNumber: 4,
    ruleNameFrench: 'Règle du dénombrement (열거와 검토의 규칙)',
    ruleNameKo: '아무것도 빠뜨리지 않았다는 확신이 들 때까지 전 과정을 전면 재검토함',
    epistemicFocus: '누락이나 사각지대가 없도록 전체 체계를 철저히 검증하고 점검함.',
    actionDirective: '실행 전 전 과정을 꼼꼼히 점검하여 뜻밖의 변수나 빈틈이 없는지 완결성을 기하십시오.',
  },
];

const PROVISIONAL_MORAL_RULES: DescartesProvisionalMoralRule[] = [
  {
    moralMaximeNumber: 1,
    maximeNameKo: '중용과 온건한 원칙의 준수',
    practicalAttitude: '자신이 속한 사회의 법률과 관습을 존중하며 가장 온건하고 지혜로운 사람들의 본을 따름.',
    counselForAction: '극단적인 모험이나 독단에 빠지지 말고 검증된 상식과 온화한 균형 감각을 지키십시오.',
  },
  {
    moralMaximeNumber: 2,
    maximeNameKo: '행동에서의 확고부동한 결단력',
    practicalAttitude: '일단 어떤 방향을 정했으면 숲속에서 길을 잃은 여행자처럼 한 방향으로 흔들림 없이 전진함.',
    counselForAction: '우유부단함과 의심을 끊어내십시오. 가장 유망한 길을 택했다면 후회 없이 일관되게 밀고 나가는 것이 지혜입니다.',
  },
  {
    moralMaximeNumber: 3,
    maximeNameKo: '운명보다 자신을 이기려는 마음가짐',
    practicalAttitude: '세상의 질서를 바꾸려 하기보다 자신의 욕망을 다스리고 내면의 사유를 정복함.',
    counselForAction: '통제할 수 없는 외적 운명을 탓하지 말고 내 마음의 태도와 선택을 다잡는 데 온 힘을 쏟으십시오.',
  },
];

export function calculateFrenchDescartesCogito(profile: UserProfile): FrenchDescartesCogitoResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'FrenchDescartesCogito';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const cogitoPresenceCertaintyScore = 67 + (absHash % 32);
  const claraDistinctaClarityScore = 65 + ((absHash >> 3) % 34);
  const methodicDoubtPurificationScore = 63 + ((absHash >> 6) % 36);
  const fourRulesReasoningScore = 64 + ((absHash >> 9) % 35);
  const provisionalMoralResolveScore = 66 + ((absHash >> 12) % 33);

  const ruleIndex = (absHash >> 4) % METHOD_RULES.length;
  const moralIndex = (absHash >> 7) % PROVISIONAL_MORAL_RULES.length;

  const activeMethodRule = METHOD_RULES[ruleIndex];
  const focalProvisionalMoralRule = PROVISIONAL_MORAL_RULES[moralIndex];

  const counselTitle = `데카르트 방법서설: ${activeMethodRule.ruleNameFrench}`;
  const philosophicalGuidance = `나는 생각한다, 고로 존재한다(Cogito, ergo sum). 모든 불안과 혼돈 속에서도 사유하는 당신의 주체성은 확고합니다. ` +
    `현재 당면한 문제를 풀기 위해서는 '${activeMethodRule.ruleNameKo}'이 요청됩니다. ${activeMethodRule.actionDirective} ` +
    `실천적으로는 '${focalProvisionalMoralRule.maximeNameKo}'의 규범을 지키십시오. ${focalProvisionalMoralRule.counselForAction}`;

  return {
    engineVersion: DESCARTES_COGITO_VERSION,
    calculatedAtKst: new Date().toISOString(),
    cogitoPresenceCertaintyScore,
    claraDistinctaClarityScore,
    methodicDoubtPurificationScore,
    fourRulesReasoningScore,
    provisionalMoralResolveScore,
    activeMethodRule,
    focalProvisionalMoralRule,
    descartesPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatFrenchDescartesCogitoPrompt(res: FrenchDescartesCogitoResult): string {
  return [
    `【데카르트 코기토 & 명석판명 방법서설 지표】`,
    `- 코기토 사유주체 확신도: ${res.cogitoPresenceCertaintyScore}/100`,
    `- 명석판명 지성 명징도: ${res.claraDistinctaClarityScore}/100`,
    `- 방법적 회의 편견 정화도: ${res.methodicDoubtPurificationScore}/100`,
    `- 방법서설 4대 규칙 실천력: ${res.fourRulesReasoningScore}/100`,
    `- 잠정 도덕 결단력: ${res.provisionalMoralResolveScore}/100`,
    `- 적용 방법 규칙: ${res.activeMethodRule.ruleNameFrench} (${res.activeMethodRule.ruleNameKo})`,
    `- 지성적 초점: ${res.activeMethodRule.epistemicFocus}`,
    `- 규칙별 실천 지침: ${res.activeMethodRule.actionDirective}`,
    `- 당면 잠정 도덕 규칙: ${res.focalProvisionalMoralRule.maximeNameKo}`,
    `- 행동 태도 지침: ${res.focalProvisionalMoralRule.counselForAction}`,
    `- 철학적 직관 지침: ${res.descartesPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
