/**
 * 독일 테오도어 아도르노(Theodor W. Adorno) 《부정변증법》 & 《미니마 모랄리아》 비동일자(Das Nichtidentische) 수호·손상된 삶의 성찰·미학적 비판 지혜 엔진
 *
 * 20세기 프랑크푸르트 학파 비판 이론의 거장 테오도어 아도르노(1903~1969)의 원전 기반:
 * 1. 비동일자 수호 및 개별성 옹호 지표 (Non-Identical Safeguard & Individuality Protection Score): 전체의 획일적 범주나 억압적인 집단 논리에 포섭되지 않고, 고유한 차이와 특이성을 꿋꿋이 지켜내는 주체적 저항력.
 * 2. 손상된 삶의 비판적 성찰력 (Minima Moralia & Damaged Life Reflection Index): 모순되고 왜곡된 환경 속에서도 값싼 순응에 빠지지 않고, 삶의 참된 진실성을 날카롭게 묻고 점검하는 성찰력.
 * 3. 도구적 이성 극복 및 물상화 탈피 지표 (Instrumental Reason Transcendence & De-Reification Score): 인간과 세계를 단순한 효율성과 이윤 추구의 수단이나 교환 가치로만 환원하는 상업적 물상화를 거부하는 혜안.
 * 4. 불협화음 직시 및 긴장 감내력 (Dissonance Tolerance & Aesthetic Resistance Index): 가짜 조화나 거짓된 낙관론의 마취에 기대지 않고, 현실의 갈등과 불협화음(Dissonanz)을 정직하게 버텨내며 예술적 긴장으로 승화하는 힘.
 * 5. 성좌(Konstellation)적 사고 및 입체적 구원 지표 (Constellation Thinking & Multidimensional Redemption Score): 닫힌 하나의 교조에 갇히지 않고 여러 개념과 현상들을 별자리처럼 입체적으로 엮어 진리의 다채로운 단면을 직관하는 사유력.
 *
 * @version LUCKEY-THEODOR-ADORNO-NEGATIVE-DIALECTICS-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_THEODOR_ADORNO_NEGATIVE_DIALECTICS_VERSION = 'LUCKEY-THEODOR-ADORNO-NEGATIVE-DIALECTICS-v2.1.0';

export interface AdornoTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface AdornoAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanTheodorAdornoNegativeDialecticsMinimaMoraliaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 테오도어 아도르노 핵심 지표 (0~100)
  nonIdenticalSafeguardScore: number;          // 비동일자 수호 및 개별성 옹호 지표 (Non-Identical Safeguard)
  damagedLifeCriticalReflectionIndex: number;  // 손상된 삶의 비판적 성찰력 (Damaged Life Reflection Index)
  instrumentalReasonTranscendenceScore: number;// 도구적 이성 극복 및 물상화 탈피 (Instrumental Reason Transcendence)
  dissonanceResilienceIndex: number;           // 불협화음 직시 및 긴장 감내력 (Dissonance Tolerance & Resistance)
  constellationDialecticsScore: number;        // 성좌적 사고 및 입체적 구원 지표 (Constellation Thinking Score)
  // 세부 분석
  activeAdornoTheme: AdornoTheme;
  focalAdornoAphorism: AdornoAphorism;
  secondaryAdornoAphorism: AdornoAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  adornoComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  adornoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const ADORNO_THEMES: AdornoTheme[] = [
  {
    themeKey: 'safeguardNonIdentical',
    themeTitleEn: 'Rescuing the Non-Identical: Defending Nuance and Singularity Against Coercive Uniformity',
    themeTitleKo: '비동일자의 수호 — 집단의 획일화와 동일성의 강요에 맞서 고유한 개별성 지키기',
    pragmaticInsight: '아도르노의 핵심 명제는 세상의 모든 것을 하나의 잣대로 규격화하려는 ‘동일화 사유’의 폭력에 저항하는 것입니다. 개념이나 유행에 온전히 포섭되지 않는 찌꺼기와 같은 비동일자(Das Nichtidentische)야말로 진정한 진실의 거처입니다.',
    practicalCounsel: '남들과 똑같아지려고 자신을 억지로 깎아내리지 마십시오. 당신만의 독특한 개성과 남다른 시선이야말로 획일화된 세상에서 당신을 가장 빛나게 만드는 대체 불가능한 자산입니다.',
  },
  {
    themeKey: 'minimaMoraliaReflection',
    themeTitleEn: 'Minima Moralia: Critical Integrity and Truthfulness Amidst a Damaged Life',
    themeTitleKo: '손상된 삶에서의 진실성 — 거짓된 환경 속에서도 타협하지 않고 영혼의 정직함 지키기',
    pragmaticInsight: '아도르노는 왜곡된 사회 속에서 손상된 삶(beschädigtes Leben)을 직시했습니다. "잘못된 삶 속에 올바른 삶은 없다"는 말은 포기가 아니라, 모순된 현실에 무비판적으로 타협하지 말라는 가장 치열한 도덕적 경고입니다.',
    practicalCounsel: '주변의 불합리한 관행이나 타성에 젖어 "다들 그렇게 사니까"라며 타협하지 마십시오. 비록 작은 디테일 하나일지라도 원칙과 진실성을 타협 없이 지켜낼 때 영혼의 오염을 막을 수 있습니다.',
  },
  {
    themeKey: 'transcendInstrumentalReason',
    themeTitleEn: 'Transcendence of Instrumental Reason: Refusing the Reduction to Mere Utility',
    themeTitleKo: '도구적 이성의 극복 — 사람과 관계를 쓸모와 계산의 수단으로 전락시키지 않기',
    pragmaticInsight: '모든 것을 효율성과 이윤, 쓸모로만 평가하는 도구적 이성은 인간을 부품으로 전락시킵니다. 교환 가치로 환산할 수 없는 고유한 존엄성과 사랑, 순수한 열정의 자리를 사수해야 합니다.',
    practicalCounsel: '모든 만남과 결정을 손익 계산기 두드리듯 대하지 마십시오. 당장의 실용적 득실을 넘어서는 가치, 영혼의 기쁨과 순수한 배움에 시간과 정성을 쏟을 때 진정한 풍요가 찾아옵니다.',
  },
  {
    themeKey: 'dissonanceResistance',
    themeTitleEn: 'Aesthetic Dissonance: Embracing Tension and Rejecting Cheap Consolation',
    themeTitleKo: '불협화음의 저항 — 값싼 위로와 가짜 조화를 거부하고 현실의 모순을 정직하게 버텨내기',
    pragmaticInsight: '현대 예술의 불협화음(Dissonanz)은 거짓된 낙관주의의 마취제를 걷어차고 세상의 균열을 폭로합니다. 갈등과 고통을 무마하려는 값싼 힐링에 속지 않고 긴장을 정면으로 견딜 때 깊은 창조성이 폭발합니다.',
    practicalCounsel: '불안이나 갈등이 찾아올 때 손쉬운 핑계나 기만적인 위로 뒤로 숨지 마십시오. 불협화음의 긴장을 용기 있게 응시하고 감내하십시오. 그 날카로운 긴장 속에서 진정한 해결책이 잉태됩니다.',
  },
  {
    themeKey: 'constellationThinking',
    themeTitleEn: 'Constellation Dialectics: Illumination Through Multidimensional Juxtaposition',
    themeTitleKo: '성좌적 사유 — 닫힌 하나의 교조 대신 다채로운 관점을 별자리처럼 엮어 입체적으로 조망하기',
    pragmaticInsight: '성좌(Konstellation)적 사고는 사물을 단 하나의 지배적 정의에 가두지 않고, 여러 이질적인 관점들을 별자리처럼 배치하여 그 사이에서 뿜어져 나오는 입체적인 빛으로 진리를 조명하는 방식입니다.',
    practicalCounsel: '문제를 오직 한 가지 시각이나 편협한 도그마로만 풀려 하지 마십시오. 예술, 역사, 심리, 데이터 등 다양한 각도의 관점들을 입체적으로 배치하여 종합적인 혜안을 도출하십시오.',
  },
];

export const ADORNO_APHORISMS: AdornoAphorism[] = [
  {
    aphorismKey: 'noRightLifeInFalse',
    aphorismKo: '잘못된 삶 속에 올바른 삶은 없다. 그러나 비판적 사유의 정직함만이 거짓된 세계 속에서 스스로를 지키는 유일한 방패다.',
    aphorismGerman: 'Es gibt kein richtiges Leben im falschen.',
    sourceContext: '테오도어 아도르노 《미니마 모랄리아(Minima Moralia)》 39절',
    actionGuidance: '부패하거나 안일한 분위기에 무감각하게 동화되지 마십시오. 비판적 성찰로 당신의 양심과 주체성을 단단히 지켜내십시오.',
  },
  {
    aphorismKey: 'rescueNonIdentical',
    aphorismKo: '사유의 참된 소명은 대상을 개념에 억지로 끼워 맞추는 것이 아니라, 결코 포섭되지 않는 비동일자를 구원하는 데 있다.',
    aphorismGerman: 'Das Nichtidentische ist die Sache der Dialektik.',
    sourceContext: '테오도어 아도르노 《부정변증법(Negative Dialektik)》',
    actionGuidance: '정형화된 틀에 맞지 않는다고 해서 독창적인 아이디어나 개성을 억누르지 마십시오. 비동일자의 틈새에서 진짜 혁신이 일어납니다.',
  },
  {
    aphorismKey: 'instrumentalReasonReification',
    aphorismKo: '사물이 상품의 교환 가치로 전락할 때, 인간의 살아있는 영혼 또한 물건처럼 박제된다.',
    aphorismGerman: 'Die Verdinglichung ist ein Vergessen.',
    sourceContext: '테오도어 아도르노 & 막스 호르크하이머 《계몽의 변증법(Dialektik der Aufklärung)》',
    actionGuidance: '사람을 수단이나 숫자로 대하지 마십시오. 사물과 관계 본래의 생명력과 진정성을 회복하십시오.',
  },
  {
    aphorismKey: 'dissonanceTruth',
    aphorismKo: '예술의 불협화음은 거짓된 화해와 기만을 거부하는 가장 정직한 진실의 외침이다.',
    aphorismGerman: 'Die Dissonanz ist die Wahrheit der Harmonie.',
    sourceContext: '테오도어 아도르노 《미학 이론(Ästhetische Theorie)》',
    actionGuidance: '갈등이나 문제를 서둘러 덮어버리지 마십시오. 정직하게 드러난 불협화음을 직시할 때 참된 치유와 혁신이 가능합니다.',
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

function formatAdornoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function buildAdornoReflectiveQuestion(theme: AdornoTheme, query?: string): string {
  const trimmed = query?.trim();
  if (trimmed) {
    return `'${trimmed}'에서 값싼 조화나 효율의 잣대에 삼켜지지 않도록 끝까지 지켜내야 할 나만의 비동일자(Das Nichtidentische)는 무엇인가요? (${theme.themeTitleKo})`;
  }
  return `지금 내가 당연하게 받아들이고 있는 관행이나 비교의 기준 가운데, 정직한 불협화음으로 다시 물어야 할 것은 무엇인가요? (${theme.themeTitleKo})`;
}

function describeAdornoStage(score: number): string {
  if (score >= 94) return '성좌(Konstellation) 직관기 (비동일자의 특이성과 입체적 진실이 또렷이 빛나는 흐름)';
  if (score >= 90) return '비판적 각성기 (도구적 이성과 값싼 조화를 걷어내고 본질을 응시하는 국면)';
  return '긴장 감내기 (불협화음 속에서도 영혼의 정직함을 단단히 지키는 흐름)';
}

export function calculateGermanTheodorAdornoNegativeDialecticsMinimaMoralia(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): GermanTheodorAdornoNegativeDialecticsMinimaMoraliaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `THEODOR-ADORNO-NEGATIVE-DIALECTICS:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const nonIdenticalSafeguardScore = 89 + ((absHash >> 1) % 10);
  const damagedLifeCriticalReflectionIndex = 88 + ((absHash >> 4) % 11);
  const instrumentalReasonTranscendenceScore = 87 + ((absHash >> 7) % 12);
  const dissonanceResilienceIndex = 89 + ((absHash >> 10) % 10);
  const constellationDialecticsScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % ADORNO_THEMES.length;
  const aphorismIndex = (absHash >> 8) % ADORNO_APHORISMS.length;
  const secondaryOffset = 1 + ((absHash >> 11) % (ADORNO_APHORISMS.length - 1));
  const secondaryAphorismIndex = (aphorismIndex + secondaryOffset) % ADORNO_APHORISMS.length;

  const activeAdornoTheme = ADORNO_THEMES[themeIndex];
  const focalAdornoAphorism = ADORNO_APHORISMS[aphorismIndex];
  const secondaryAdornoAphorism = ADORNO_APHORISMS[secondaryAphorismIndex];
  const reflectiveQuestion = buildAdornoReflectiveQuestion(activeAdornoTheme, query);
  const interpretiveBoundary = '테오도어 아도르노 부정변증법 관점은 타인이나 사회를 일방적으로 재단하는 도구가 아니라, 획일화와 도구적 이성 속에서 고유한 차이를 성찰하는 비판철학 렌즈입니다.';

  const guidanceTitle = `테오도어 아도르노 부정변증법과 미니마 모랄리아 지혜: ${activeAdornoTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 프랑크푸르트 학파의 대표 사상가 테오도어 아도르노 선생은 《부정변증법》과 《미니마 모랄리아》를 통해 ` +
    `획일화된 동일성의 폭력에 맞서 고유한 차이를 지켜내는 '비동일자(Das Nichtidentische)의 구원', 왜곡된 환경에 타협하지 않는 치열한 '비판적 성찰', ` +
    `도구적 이성의 상업적 물상화 극복, 그리고 가짜 조화를 거부하는 '불협화음(Dissonanz)의 진실성'을 가르쳤습니다. ` +
    `현재 당신이 처한 상황을 꿰뚫는 결정적 통찰은 '${activeAdornoTheme.themeTitleKo}'입니다. ` +
    `${activeAdornoTheme.practicalCounsel} 아도르노의 예리한 원전 명제 "${focalAdornoAphorism.aphorismKo}" (${focalAdornoAphorism.aphorismGerman})를 깊이 성찰하며, ` +
    `${focalAdornoAphorism.actionGuidance}`;

  const adornoSynthesisMatrix = {
    dominantTension: `${activeAdornoTheme.themeTitleKo} ↔ ${focalAdornoAphorism.sourceContext}`,
    alignmentState:
      nonIdenticalSafeguardScore >= 92 && constellationDialecticsScore >= 92
        ? '비동일자 수호와 성좌적 사유의 고차원 공명'
        : '물상화를 거부하고 불협화음의 진실을 직시하는 국면',
    integratedAction: `${activeAdornoTheme.practicalCounsel} (${focalAdornoAphorism.actionGuidance})`,
  };

  return {
    engineVersion: GERMAN_THEODOR_ADORNO_NEGATIVE_DIALECTICS_VERSION,
    calculatedAtKst: formatAdornoKstTimestamp(now),
    nonIdenticalSafeguardScore,
    damagedLifeCriticalReflectionIndex,
    instrumentalReasonTranscendenceScore,
    dissonanceResilienceIndex,
    constellationDialecticsScore,
    activeAdornoTheme,
    focalAdornoAphorism,
    secondaryAdornoAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    adornoComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    adornoSynthesisMatrix,
  };
}

export function formatGermanTheodorAdornoNegativeDialecticsMinimaMoraliaPrompt(
  res: GermanTheodorAdornoNegativeDialecticsMinimaMoraliaResult,
): string {
  const lines = [
    `【테오도어 아도르노 《부정변증법》 비동일자 수호·미니마 모랄리아 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 비동일자 수호 및 개별성 옹호(Non-Identical Safeguard): ${describeAdornoStage(res.nonIdenticalSafeguardScore)}`,
    `- 손상된 삶의 비판적 성찰(Damaged Life Reflection): ${describeAdornoStage(res.damagedLifeCriticalReflectionIndex)}`,
    `- 도구적 이성 극복 및 물상화 탈피(Instrumental Reason Transcendence): ${describeAdornoStage(res.instrumentalReasonTranscendenceScore)}`,
    `- 불협화음 직시 및 긴장 감내력(Dissonance Tolerance): ${describeAdornoStage(res.dissonanceResilienceIndex)}`,
    `- 성좌적 사고 및 입체적 구원(Constellation Thinking): ${describeAdornoStage(res.constellationDialecticsScore)}`,
    `- 핵심 아도르노 테마: ${res.activeAdornoTheme.themeTitleKo} [${res.activeAdornoTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeAdornoTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeAdornoTheme.practicalCounsel}`,
    `- 아도르노 원전 격언: "${res.focalAdornoAphorism.aphorismKo}" (${res.focalAdornoAphorism.aphorismGerman})`,
    `- 원전 출처: [${res.focalAdornoAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalAdornoAphorism.actionGuidance}`,
    `- 보조 원전 테제: "${res.secondaryAdornoAphorism.aphorismKo}" (${res.secondaryAdornoAphorism.aphorismGerman})`,
    `- 보조 원전 출처: [${res.secondaryAdornoAphorism.sourceContext}]`,
    `- 보조 실천 지침: ${res.secondaryAdornoAphorism.actionGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 종합 아도르노 권면: ${res.adornoComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.adornoSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.adornoSynthesisMatrix.dominantTension} | 조율 상태: ${res.adornoSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.adornoSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
