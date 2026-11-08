/**
 * 독일 고트프리트 빌헬름 라이프니츠(Gottfried Wilhelm Leibniz) 《단자론(La Monadologie)》 & 《변신론(Essais de Théodicée)》 예정조화설 & 최선의 세계·충족이유율 지혜 엔진
 *
 * 서양 근대 합리주의와 보편학의 거인 고트프리트 빌헬름 라이프니츠(Gottfried Wilhelm Leibniz, 1646~1716)의 불멸의 고전 《단자론(Monadology, 1714)》 및 《변신론(Théodicée, 1710)》 핵심 원전 기반:
 * 1. 예정조화설 우주적 질서 조화도(Harmonia Praestabilita / Pre-established Harmony): 서로 직접 창이 없어도 온 우주가 신성한 법칙 아래 정교하게 조화를 이루며 공명한다는 믿음.
 * 2. 단자 고유 자족성 및 내적 생명 활력도(Monad Indivisibility & Vis Viva): 쪼갤 수 없는 개별 영혼이 저마다 우주 전체를 고유한 관점에서 비추는 살아있는 거울이라는 자존감.
 * 3. 미소지각에서 명석판명한 통각으로의 의식 명징도(Petites Perceptions to Apperception): 무의식적 잔물결을 꿰뚫고 또렷하고 명확한 자각과 분별로 깨어나는 지적 통찰력.
 * 4. 최선의 가능한 세계 실존적 긍정 낙관성(The Best of All Possible Worlds / Le meilleur des mondes possibles): 어둠과 모순 속에서도 우주의 섭리가 가장 위대한 선과 조화를 향해 있음을 신뢰하는 궁극의 긍정.
 * 5. 충족이유율 인과적 의미 통찰력(Principle of Sufficient Reason / Principium rationis sufficientis): 어떤 일도 까닭 없이 일어나지 않는다는 철칙 아래 모든 사건의 근원적 의미와 교훈을 찾아내는 혜안.
 *
 * @version LUCKEY-GOTTFRIED-LEIBNIZ-MONADOLOGY-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_GOTTFRIED_LEIBNIZ_VERSION = 'LUCKEY-GOTTFRIED-LEIBNIZ-MONADOLOGY-v1.0.0';

export interface LeibnizTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface LeibnizAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GottfriedLeibnizMonadologyHarmonyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 라이프니츠 단자론 & 예정조화 지표 (0~100)
  preEstablishedHarmonyScore: number;         // 예정조화설 우주적 질서 조화도 (Pre-established Harmony)
  monadIntrinsicVitalityIndex: number;        // 단자 고유 자족성 및 내적 생명 활력도 (Monad Indivisibility & Vis Viva)
  apperceptionClarityScore: number;           // 미소지각에서 통각으로의 의식 명징도 (Petites Perceptions to Apperception)
  bestPossibleWorldOptimismIndex: number;     // 최선의 가능한 세계 실존적 긍정 낙관성 (Best of All Possible Worlds)
  sufficientReasonInsightScore: number;       // 충족이유율 인과적 의미 통찰력 (Principle of Sufficient Reason)
  // 세부 분석
  activeLeibnizTheme: LeibnizTheme;
  focalLeibnizAphorism: LeibnizAphorism;
  leibnizComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const LEIBNIZ_THEMES: LeibnizTheme[] = [
  {
    themeKey: 'pre_established_harmony',
    themeTitleEn: 'Pre-established Harmony (우주의 예정조화)',
    themeTitleKo: '흩어진 듯한 세상 만물이 보이지 않는 깊은 질서 속에서 공명함',
    existentialInsight: '만물은 외부의 물리적 충돌에 의해서만 움직이는 것이 아니라, 우주가 태초부터 품고 있는 거대한 조화의 악보에 따라 각자의 음색으로 노래합니다. 겉보기의 혼란 뒤에는 더 큰 섭리가 흐릅니다.',
    practicalCounsel: '타인이나 환경을 억지로 바꾸려 애쓰며 소모되지 마십시오. 당신의 내면의 시계를 바르게 맞출 때, 놀랍게도 주변 환경도 당신의 리듬과 자연스럽게 화답하기 시작합니다.',
  },
  {
    themeKey: 'monad_living_mirror_of_universe',
    themeTitleEn: 'The Monad as a Living Mirror (우주를 비추는 살아있는 거울 단자)',
    themeTitleKo: '나라는 존재 안에 온 우주의 질서와 지혜가 고유한 각도로 깃들어 있음',
    existentialInsight: '단자에는 밖으로 통하는 창문이 없습니다. 그러나 각각의 단자는 자신만의 고유한 관점에서 온 우주를 온전히 비추는 영원한 거울입니다. 당신은 결코 결핍된 조각이 아니라 우주의 자족적 중심입니다.',
    practicalCounsel: '외부의 인정이나 비교에 목매지 마십시오. 당신 영혼의 가장 깊은 본성을 충실히 펼쳐낼 때 우주 전체가 당신을 통해 가장 아름답게 빛납니다.',
  },
  {
    themeKey: 'apperception_and_clarity',
    themeTitleEn: 'From Petites Perceptions to Apperception (미소지각에서 명석한 통각으로)',
    themeTitleKo: '무의식의 막연한 불안을 꿰뚫고 또렷한 의식적 각성으로 전환함',
    existentialInsight: '파도 소리는 무수한 작은 물방울들의 부딪힘(미소지각)이 모여 하나의 소리로 들리는 것입니다. 마음속에 흐르는 미세한 감정들을 주의 깊게 관찰하고 통합할 때 명료한 통각(Apperception)에 이릅니다.',
    practicalCounsel: '모호한 직관이나 어렴풋한 불안을 그대로 방치하지 말고 언어와 논리로 명확하게 정의하십시오. 의식의 빛을 비추는 순간 막연한 두려움은 사라지고 선명한 해결책이 떠오릅니다.',
  },
  {
    themeKey: 'best_of_all_possible_worlds',
    themeTitleEn: 'The Best of All Possible Worlds (최선의 가능한 세계를 향한 신뢰)',
    themeTitleKo: '현재의 고난과 모순조차 더 높은 선과 완성을 향한 밑거름임을 통찰함',
    existentialInsight: '그림에서 어두운 그림자가 밝은 빛을 더욱 돋보이게 하듯, 삶의 시련은 전체적 조화 속에서 가장 큰 지혜와 성장을 이끌어내는 불가결한 요소입니다. 우리는 가장 완전한 가능성의 세계를 살아가고 있습니다.',
    practicalCounsel: '눈앞의 불운이나 결핍에 걸려 넘어지지 마십시오. "이 시련이 나에게 어떤 더 큰 선을 선물하려는가"를 묻는 순간, 모든 상황은 성장의 무대로 변모합니다.',
  },
  {
    themeKey: 'principle_of_sufficient_reason',
    themeTitleEn: 'Principle of Sufficient Reason (충족이유율의 인과 통찰)',
    themeTitleKo: '우연이란 없으며 모든 마주침과 사건에는 합당한 이유와 의미가 있음',
    existentialInsight: '아무리 사소해 보이는 일일지라도 그것이 그렇게 되어야만 했던 충분한 이유가 존재합니다. 사건의 표면을 넘어 심층의 인과율을 탐구할 때 비로소 운명의 주인이 됩니다.',
    practicalCounsel: '감정적으로 반응하기 전에 원인과 결과를 침착하게 복기하십시오. 상황의 진짜 뿌리를 짚어낼 때 쓸데없는 감정 소모를 끝내고 근본적인 개선을 이룰 수 있습니다.',
  },
];

export const LEIBNIZ_APHORISMS: LeibnizAphorism[] = [
  {
    aphorismKey: 'monads_have_no_windows',
    aphorismKo: '단자에는 물질이 드나들 수 있는 어떤 창문도 없다. 그러나 모든 단자는 온 우주를 비추는 영원한 생명의 거울이다.',
    aphorismEn: 'The Monads have no windows through which anything could come in or go out. Every monad is a perpetual living mirror of the universe.',
    sourceContext: '《단자론(La Monadologie)》 제7절 & 제56절',
    actionGuidance: '외물의 소음과 유혹에 휘둘리지 말고, 당신의 영혼 안에 깃든 우주적 직관과 본래의 풍요로움을 신뢰하십시오.',
  },
  {
    aphorismKey: 'pre_established_harmony_accord',
    aphorismKo: '영혼과 육체는 서로에게 직접 영향을 주지 않으면서도, 태초부터 마련된 예정조화에 의해 완벽하게 일치하여 움직인다.',
    aphorismEn: 'The soul follows its own laws, and the body its own; and both agree by virtue of the pre-established harmony between all substances.',
    sourceContext: '《단자론》 제78절',
    actionGuidance: '상황을 억지로 통제하려 하지 말고, 당신의 마음과 태도를 먼저 바르게 정돈하여 외부 세계와의 조화로운 공명을 이끄십시오.',
  },
  {
    aphorismKey: 'best_of_all_possible_worlds_aphorism',
    aphorismKo: '신은 무한한 가능성의 세계 중에서 최선의 세계를 선택하여 창조하셨다. 따라서 존재하는 모든 것에는 지극한 이유가 있다.',
    aphorismEn: 'Out of infinite possibilities, God has chosen the best of all possible worlds. Everything that is has its sufficient reason.',
    sourceContext: '《변신론(Essais de Théodicée)》',
    actionGuidance: '현실의 결핍을 한탄하지 말고, 지금 주어진 조건 속에서 최선의 조화와 가치를 빚어내는 창조적 낙관을 발휘하십시오.',
  },
  {
    aphorismKey: 'nihil_est_sine_ratione',
    aphorismKo: '어떤 일도 이유 없이 일어나는 것은 없다(Nihil est sine ratione). 모든 존재와 사건에는 충분한 이유가 깃들어 있다.',
    aphorismEn: 'Nothing takes place without a sufficient reason; that is, why it is thus rather than otherwise.',
    sourceContext: '《단자론》 제32절',
    actionGuidance: '갑작스러운 난관 앞에서도 당황하지 말고 그 일의 배경과 본질적 의미를 통찰하여 현명한 해법을 찾으십시오.',
  },
];

export function calculateGottfriedLeibnizMonadologyHarmony(
  profile: UserProfile
): GottfriedLeibnizMonadologyHarmonyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `GOTTFRIED-LEIBNIZ-MONADOLOGY:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const preEstablishedHarmonyScore = 75 + (absHash % 24);
  const monadIntrinsicVitalityIndex = 74 + ((absHash >> 3) % 25);
  const apperceptionClarityScore = 73 + ((absHash >> 6) % 26);
  const bestPossibleWorldOptimismIndex = 76 + ((absHash >> 9) % 23);
  const sufficientReasonInsightScore = 72 + ((absHash >> 12) % 27);

  const themeIndex = (absHash >> 4) % LEIBNIZ_THEMES.length;
  const aphorismIndex = (absHash >> 7) % LEIBNIZ_APHORISMS.length;

  const activeLeibnizTheme = LEIBNIZ_THEMES[themeIndex];
  const focalLeibnizAphorism = LEIBNIZ_APHORISMS[aphorismIndex];

  const guidanceTitle = `라이프니츠 단자론 예정조화와 최선의 세계 지혜: ${activeLeibnizTheme.themeTitleKo}`;
  const philosophicalCounsel = `고트프리트 빌헬름 라이프니츠의 단자론 철학은 개별 영혼이 우주 전체를 비추는 살아있는 거울이며, 모든 만남과 사건이 보이지 않는 예정조화 속에서 최선의 선을 향해 나아감을 일깨웁니다. ` +
    `현재 당신의 삶을 조명하는 핵심 이성 원리는 '${activeLeibnizTheme.themeTitleKo}'입니다. ` +
    `${activeLeibnizTheme.practicalCounsel} 아울러 《단자론》의 원전 명제 "${focalLeibnizAphorism.aphorismKo}"(${focalLeibnizAphorism.aphorismEn})를 깊이 마음에 새기고, ` +
    `${focalLeibnizAphorism.actionGuidance}`;

  return {
    engineVersion: GERMAN_GOTTFRIED_LEIBNIZ_VERSION,
    calculatedAtKst: new Date().toISOString(),
    preEstablishedHarmonyScore,
    monadIntrinsicVitalityIndex,
    apperceptionClarityScore,
    bestPossibleWorldOptimismIndex,
    sufficientReasonInsightScore,
    activeLeibnizTheme,
    focalLeibnizAphorism,
    leibnizComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatGottfriedLeibnizMonadologyHarmonyPrompt(res: GottfriedLeibnizMonadologyHarmonyResult): string {
  return [
    `【라이프니츠 《단자론》 예정조화 & 최선의 세계 지표】`,
    `- 예정조화설 우주적 질서 조화도(Pre-established Harmony): ${res.preEstablishedHarmonyScore}/100`,
    `- 단자 고유 자족성 및 내적 생명 활력도(Monad Vis Viva): ${res.monadIntrinsicVitalityIndex}/100`,
    `- 미소지각에서 통각으로의 의식 명징도(Apperception): ${res.apperceptionClarityScore}/100`,
    `- 최선의 가능한 세계 긍정 낙관성(Best Possible World): ${res.bestPossibleWorldOptimismIndex}/100`,
    `- 충족이유율 인과적 의미 통찰력(Sufficient Reason): ${res.sufficientReasonInsightScore}/100`,
    `- 핵심 단자론 테마: ${res.activeLeibnizTheme.themeTitleKo} [${res.activeLeibnizTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeLeibnizTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeLeibnizTheme.practicalCounsel}`,
    `- 핵심 원전 경구: "${res.focalLeibnizAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalLeibnizAphorism.aphorismEn}" [${res.focalLeibnizAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalLeibnizAphorism.actionGuidance}`,
    `- 종합 합리주의 철학 권면: ${res.leibnizComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
