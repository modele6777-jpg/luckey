/**
 * 독일 에드문트 후설(Edmund Husserl) 《순수현상학의 이념들》 & 《유럽학문의 위기》 사태 자체로(Zu den Sachen selbst) & 현상학적 환원·에포케(Epoché)·생활세계 본질직관 지혜 엔진
 *
 * 20세기 현대 철학의 거대한 분수령 현상학의 창시자 에드문트 후설(1859~1938)의 원전 기반:
 * 1. 판단중지(에포케, Epoché) 및 편견 괄호치기 지표 (Phenomenological Epoché & Bias Suspension Score): 당연시하던 선입견과 맹목적 상식을 유보하고 순수하게 멈추어 서는 비판적 성찰력.
 * 2. 사태 자체로의 환원 및 직접 직관력 (Zu den Sachen selbst & Direct Intuition Index): 2차적 왜곡과 남들의 평가를 걷어내고 경험이 직접 말하는 현상 그 자체를 정직하게 대면하는 통찰.
 * 3. 본질직관(Wesensschau) 및 핵심 구조 파악 지표 (Wesensschau & Essential Structure Insight Score): 복잡다단한 표면적 잡음 속에서 사태의 변하지 않는 본질적 형상과 불변의 의미를 꿰뚫는 혜안.
 * 4. 의식의 지향성 및 몰입 통합력 (Intentionality & Coherent Focus Index): 의식이 흩어지지 않고 뚜렷한 목표 대상을 향해 의미를 구성하고 에너지를 한곳에 모으는 지향적 일관성.
 * 5. 생활세계(Lebenswelt) 접지 및 구체적 현실성 (Lebenswelt Grounding & Reality Alignment Score): 메마른 추상적 도식이나 공리적 관념에 갇히지 않고 살아 숨 쉬는 구체적 삶의 대지에 확고히 발딛는 현실 감각.
 *
 * @version LUCKEY-EDMUND-HUSSERL-PHENOMENOLOGY-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_EDMUND_HUSSERL_PHENOMENOLOGY_VERSION = 'LUCKEY-EDMUND-HUSSERL-PHENOMENOLOGY-v2.0.0';

export interface HusserlTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface HusserlAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanEdmundHusserlPhenomenologicalReductionResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 후설 현상학 핵심 지표 (0~100)
  phenomenologicalEpochéScore: number;         // 판단중지(에포케) 및 편견 괄호치기 지표 (Phenomenological Epoché)
  returnToThingsThemselvesIndex: number;      // 사태 자체로의 환원 및 직접 직관력 (Zu den Sachen selbst Index)
  essentialWesensschauScore: number;          // 본질직관 및 핵심 구조 파악 지표 (Wesensschau Insight)
  intentionalityFocusIndex: number;           // 의식의 지향성 및 몰입 통합력 (Intentionality & Focus)
  lebensweltGroundingScore: number;           // 생활세계 접지 및 구체적 현실성 (Lebenswelt Grounding)
  // 세부 분석
  activeHusserlTheme: HusserlTheme;
  focalHusserlAphorism: HusserlAphorism;
  husserlComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  husserlSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const HUSSERL_THEMES: HusserlTheme[] = [
  {
    themeKey: 'epocheSuspension',
    themeTitleEn: 'Epoché: Bracketing Prejudices and Suspending Hasty Judgments',
    themeTitleKo: '판단중지(에포케)의 결단 — 성급한 단정을 괄호치고 사태를 있는 그대로 바라보기',
    pragmaticInsight: '사람들은 흔히 자신의 낡은 고정관념이나 소문, 기성의 틀로 세상을 재단합니다. 후설의 에포케는 습관적인 판단을 잠시 멈추고 괄호에 묶음으로써, 왜곡되지 않은 순수한 사실의 얼굴을 마주하게 합니다.',
    practicalCounsel: '불안이나 분노에 휩쓸려 성급하게 결론을 내리지 마십시오. 당신의 짐작과 타인의 평판을 잠시 괄호 안에 넣으십시오. 마음의 판단을 멈출 때 그동안 보이지 않던 진짜 본질이 선명하게 드러납니다.',
  },
  {
    themeKey: 'returnToThings',
    themeTitleEn: 'Zu den Sachen selbst: Returning to Original Givenness and Direct Experience',
    themeTitleKo: '사태 자체로의 복귀 — 선입견과 남의 말을 걷어내고 직접 경험의 원천으로 돌아가기',
    pragmaticInsight: '책에서 본 이론이나 타인의 해설에 기대지 않고, 사태가 나에게 직접 주어지는 최초의 경험으로 돌아가야 합니다. 현상의 원천을 직접 관찰하는 자만이 허상을 뚫고 진실을 포착할 수 있습니다.',
    practicalCounsel: '남들이 만들어 놓은 프레임이나 그럴듯한 뜬소문에 속지 마십시오. 당신이 직접 눈으로 보고, 손으로 만지고, 검증할 수 있는 구체적인 사태 자체를 정직하게 대면하십시오.',
  },
  {
    themeKey: 'wesensschauInsight',
    themeTitleEn: 'Wesensschau: Grasping Invariant Essences Beyond Superficial Noise',
    themeTitleKo: '본질직관의 통찰 — 현상의 어지러운 잡음을 뚫고 변치 않는 핵심 구조를 꿰뚫기',
    pragmaticInsight: '모양이나 조건이 끊임없이 바뀌어도 그 사물을 바로 그것이게 만드는 본질(Eidos)은 변하지 않습니다. 본질직관(Wesensschau)을 통하면 수많은 변덕스러운 변화 속에서도 흔들리지 않는 뼈대를 짚어낼 수 있습니다.',
    practicalCounsel: '지엽적인 조건의 변화나 일시적인 기복에 일희일비하지 마십시오. 이 문제의 가장 근본적인 핵심이 무엇인지, 무엇이 변하지 않는 진짜 가치인지를 꿰뚫어 보고 그 본질에 집중하십시오.',
  },
  {
    themeKey: 'intentionalOrientation',
    themeTitleEn: 'Intentionality: Focusing Consciousness Directly on Meaningful Objectives',
    themeTitleKo: '의식의 지향성 — 분산된 마음을 정돈하고 뚜렷한 목표를 향해 정조준하기',
    pragmaticInsight: '의식은 텅 빈 상자가 아니라 언제나 대상을 향해 의미를 능동적으로 부여하는 지향적(Intentional) 활동입니다. 마음의 방향을 어디로 돌리느냐에 따라 당신이 살아가는 세계의 의미가 완전히 달라집니다.',
    practicalCounsel: '주의력을 산만하게 흩뜨려 놓는 잡념과 미디어의 소음을 차단하십시오. 당신의 의식과 노력이 진정으로 도달하고자 하는 목표를 향해 곧바로 지향하도록 마음의 각도를 정밀하게 조율하십시오.',
  },
  {
    themeKey: 'lebensweltRecovery',
    themeTitleEn: 'Lebenswelt Grounding: Anchoring Reason in Lived Concrete Experience',
    themeTitleKo: '생활세계의 회복 — 메마른 관념의 감옥을 벗어나 살아있는 구체적 현실에 단단히 발딛기',
    pragmaticInsight: '후설은 유럽 문명의 위기가 수학적 추상과 기계적 환원에 빠져 인간의 구체적인 삶의 터전인 생활세계(Lebenswelt)를 망각한 데서 왔다고 진단했습니다. 살아 숨 쉬는 현실에 발을 붙일 때 지혜는 비로소 힘을 얻습니다.',
    practicalCounsel: '머릿속 공상이나 비현실적인 계산에만 매달리지 마십시오. 당신이 발딛고 서 있는 구체적인 일상, 살아 숨 쉬는 대인관계, 몸으로 체감하는 현장의 감각을 회복하고 단단하게 현실에 뿌리내리십시오.',
  },
];

export const HUSSERL_APHORISMS: HusserlAphorism[] = [
  {
    aphorismKey: 'zuDenSachenSelbst',
    aphorismKo: '우리는 말이나 상투적인 의견이 아니라, 사태 자체로 돌아가야 한다.',
    aphorismGerman: 'Wir wollen auf die Sachen selbst zurückgehen.',
    sourceContext: '에드문트 후설 《논리연구(Logische Untersuchungen)》',
    actionGuidance: '중간 전달자의 왜곡된 언어를 거두고, 사건과 데이터와 현실의 원래 모습 그 자체를 직접 직시하십시오.',
  },
  {
    aphorismKey: 'epocheFreedom',
    aphorismKo: '자연적 태도의 모든 선입견을 괄호에 넣고 판단을 유보할 때, 비로소 참된 세계의 본질이 열린다.',
    aphorismGerman: 'Durch das Einklammern der natürlichen Einstellung gewinnen wir das reine Phänomen.',
    sourceContext: '에드문트 후설 《순수현상학과 현상학적 철학의 이념들(Ideen I)》',
    actionGuidance: '습관적인 선입견을 멈추고 괄호를 치십시오. 마음을 백지처럼 비울 때 참된 진실이 스스로 모습을 드러냅니다.',
  },
  {
    aphorismKey: 'consciousnessIntentionality',
    aphorismKo: '모든 의식은 언제나 어떤 대상을 향한 의식이다.',
    aphorismGerman: 'Jedes Bewußtsein ist Bewußtsein von etwas.',
    sourceContext: '에드문트 후설 《데카르트적 성찰(Cartesianische Meditationen)》',
    actionGuidance: '마음의 초점을 분산시키지 마십시오. 당신이 향하는 대상에 온전한 의식의 지향성을 투여하십시오.',
  },
  {
    aphorismKey: 'lebensweltCrisis',
    aphorismKo: '이성의 위기는 구체적인 인간의 살아있는 삶의 터전, 곧 생활세계를 망각한 데서 비롯된다.',
    aphorismGerman: 'Die Krise entspringt dem Vergessen der konkreten Lebenswelt.',
    sourceContext: '에드문트 후설 《유럽학문의 위기와 선험적 현상학(Die Krisis)》',
    actionGuidance: '추상적인 탁상공론을 걷어치우십시오. 인간의 살과 숨결이 오가는 생활세계의 구체적 현실로 복귀하십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function formatHusserlKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeHusserlStage(score: number): string {
  if (score >= 94) return '명징한 본질직관기 (선입견을 비우고 사태의 핵심 구조가 선명히 드러나는 흐름)';
  if (score >= 90) return '정갈한 에포케기 (판단을 유보하고 직접 경험의 원천으로 돌아가는 흐름)';
  return '차분한 생활세계 접지기 (구체적 삶의 현장에 의식의 지향성을 모으는 흐름)';
}

export function calculateGermanEdmundHusserlPhenomenologicalReduction(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): GermanEdmundHusserlPhenomenologicalReductionResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `EDMUND-HUSSERL-PHENOMENOLOGY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const phenomenologicalEpochéScore = 89 + ((absHash >> 1) % 10);
  const returnToThingsThemselvesIndex = 88 + ((absHash >> 4) % 11);
  const essentialWesensschauScore = 87 + ((absHash >> 7) % 12);
  const intentionalityFocusIndex = 86 + ((absHash >> 10) % 13);
  const lebensweltGroundingScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % HUSSERL_THEMES.length;
  const aphorismIndex = (absHash >> 8) % HUSSERL_APHORISMS.length;

  const activeHusserlTheme = HUSSERL_THEMES[themeIndex];
  const focalHusserlAphorism = HUSSERL_APHORISMS[aphorismIndex];

  const guidanceTitle = `에드문트 후설 현상학적 환원과 본질직관 지혜: ${activeHusserlTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 현대 현상학의 창시자 에드문트 후설 선생은 《순수현상학의 이념들》과 《유럽학문의 위기》를 통해 ` +
    `상투적인 선입견을 괄호에 넣는 판단중지(에포케, Epoché)의 결단, 왜곡 없는 직접 경험으로 회귀하는 '사태 자체로(Zu den Sachen selbst)', ` +
    `그리고 변치 않는 핵심 의미를 관조하는 본질직관(Wesensschau)과 생활세계(Lebenswelt)의 생생한 현실성을 제시했습니다. ` +
    `현재 당신이 마주한 혼란을 투명하게 정돈하는 결정적 해법은 '${activeHusserlTheme.themeTitleKo}'입니다. ` +
    `${activeHusserlTheme.practicalCounsel} 후설의 불후의 철학 명제 "${focalHusserlAphorism.aphorismKo}" (${focalHusserlAphorism.aphorismGerman})를 깊이 성찰하며, ` +
    `${focalHusserlAphorism.actionGuidance}`;

  const husserlSynthesisMatrix = {
    dominantTension: `${activeHusserlTheme.themeTitleKo} ↔ ${focalHusserlAphorism.sourceContext}`,
    alignmentState:
      phenomenologicalEpochéScore >= 93 && essentialWesensschauScore >= 92
        ? '에포케 판단중지와 본질직관의 투명한 조화'
        : '선입견을 괄호치고 생활세계의 구체적 본질을 응시하는 국면',
    integratedAction: `${activeHusserlTheme.practicalCounsel} (${focalHusserlAphorism.actionGuidance})`,
  };

  return {
    engineVersion: GERMAN_EDMUND_HUSSERL_PHENOMENOLOGY_VERSION,
    calculatedAtKst: formatHusserlKstTimestamp(now),
    phenomenologicalEpochéScore,
    returnToThingsThemselvesIndex,
    essentialWesensschauScore,
    intentionalityFocusIndex,
    lebensweltGroundingScore,
    activeHusserlTheme,
    focalHusserlAphorism,
    husserlComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    husserlSynthesisMatrix,
  };
}

export function formatGermanEdmundHusserlPhenomenologicalReductionPrompt(
  res: GermanEdmundHusserlPhenomenologicalReductionResult,
): string {
  const lines = [
    `【에드문트 후설 《순수현상학의 이념들》 현상학적 환원 및 본질직관 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 판단중지(에포케) 및 편견 괄호치기(Phenomenological Epoché): ${describeHusserlStage(res.phenomenologicalEpochéScore)}`,
    `- 사태 자체로의 환원 및 직접 직관(Zu den Sachen selbst Index): ${describeHusserlStage(res.returnToThingsThemselvesIndex)}`,
    `- 본질직관 및 핵심 구조 파악(Wesensschau Insight): ${describeHusserlStage(res.essentialWesensschauScore)}`,
    `- 의식의 지향성 및 몰입 통합력(Intentionality & Focus): ${describeHusserlStage(res.intentionalityFocusIndex)}`,
    `- 생활세계 접지 및 구체적 현실성(Lebenswelt Grounding): ${describeHusserlStage(res.lebensweltGroundingScore)}`,
    `- 핵심 후설 테마: ${res.activeHusserlTheme.themeTitleKo} [${res.activeHusserlTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeHusserlTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeHusserlTheme.practicalCounsel}`,
    `- 후설 원전 명언: "${res.focalHusserlAphorism.aphorismKo}" (${res.focalHusserlAphorism.aphorismGerman})`,
    `- 원전 출처: [${res.focalHusserlAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHusserlAphorism.actionGuidance}`,
    `- 종합 후설 권면: ${res.husserlComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.husserlSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.husserlSynthesisMatrix.dominantTension} | 조율 상태: ${res.husserlSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.husserlSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
