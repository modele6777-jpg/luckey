/**
 * 프랑스 미셸 드 몽테뉴(Michel de Montaigne) 《수상록(Les Essais)》 "내가 무엇을 아는가(Que sais-je?)" 지혜 엔진
 *
 * 프랑스 르네상스 최고의 인문주의자이자 수필 문학의 창시자 미셸 드 몽테뉴(Michel de Montaigne, 1533~1592)의 불후의 고전
 * 《수상록(에세, Les Essais, 1580)》 원전 기반:
 * 1. "내가 무엇을 아는가(Que sais-je?)" 인식론적 겸양 및 독단 경계 지표(Epistemic Humility & Que Sais-Je Index): 오만을 경계하고 한계를 응시하는 지성.
 * 2. 솔직한 자기 관찰 및 내면 성찰력(Candid Self-Observation & Introspection Score): 가면을 벗고 인간 본연의 모습을 가감 없이 직시하는 진실성.
 * 3. 극단 배격 및 관용·중용의 지혜도(Tolerance & Middle-Way Prudence Index): 광기와 독단적 정쟁을 넘어 서로 다른 입장을 포용하는 온건한 이성.
 * 4. 인간 조건의 불완전성 수용 및 자연스런 삶 조화도(Acceptance of Human Condition & Natural Life Score): 억지 꾸밈없이 소박하게 살아가는 삶의 기술.
 * 5. 영혼의 뒷방(Arrière-Boutique) 내적 자유 및 자립도(Inner Freedom & Spiritual Sanctuary Index): 세상의 풍파 속에서도 독립된 영혼의 안식처를 간직하는 힘.
 *
 * @version LUCKEY-MONTAIGNE-ESSAYS-QUE-SAIS-JE-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_MICHEL_DE_MONTAIGNE_VERSION = 'LUCKEY-MONTAIGNE-ESSAYS-QUE-SAIS-JE-v2.4.0';

export interface MontaigneTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface MontaigneAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchMichelDeMontaigneEssaysResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 몽테뉴 수상록 지표 (0~100)
  epistemicHumilityQueSaisJeIndex: number;         // 인식론적 지적 겸양 및 독단 경계 지표 (Epistemic Humility & Que Sais-Je)
  candidSelfObservationIntrospectionScore: number;// 솔직한 자기 관찰 및 내면 성찰력 (Candid Self-Observation & Introspection)
  toleranceMiddleWayPrudenceIndex: number;        // 극단 배격 및 관용·중용의 지혜도 (Tolerance & Middle-Way Prudence)
  humanConditionAcceptanceScore: number;          // 인간 조건의 불완전성 수용 및 자연스런 삶 조화도 (Acceptance of Human Condition)
  innerFreedomSanctuaryIndex: number;             // 영혼의 뒷방(Arrière-Boutique) 내적 자유 및 자립도 (Inner Freedom & Sanctuary)
  // 세부 분석
  activeMontaigneTheme: MontaigneTheme;
  focalMontaigneAphorism: MontaigneAphorism;
  secondaryMontaigneAphorism: MontaigneAphorism;
  montaigneCrossAxis: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  montaigneComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  montaigneSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const MONTAIGNE_THEMES: MontaigneTheme[] = [
  {
    themeKey: 'queSaisJeHumility',
    themeTitleEn: 'Epistemic Humility & "What Do I Know?"',
    themeTitleKo: '"내가 무엇을 아는가 (Que sais-je?)" — 독단적 오만을 경계하는 지적 겸양',
    pragmaticInsight: '세상 모든 갈등의 뿌리에는 "내가 무조건 옳다"는 독단과 오만이 자리 잡고 있습니다. "내가 무엇을 아는가?"라고 겸허히 되묻는 태도가 오류를 방지하고 진정한 혜안을 엽니다.',
    practicalCounsel: '자신의 지식이나 경험만을 맹신하지 마십시오. 늘 한 걸음 물러서서 다른 가능성을 열어두고, 겸손한 질문을 통해 현실의 빈틈을 메워나가는 유연한 지성을 발휘하십시오.',
  },
  {
    themeKey: 'candidSelfObservation',
    themeTitleEn: 'Candid Self-Observation & Introspective Honesty',
    themeTitleKo: '솔직한 자기 관찰 — 꾸밈없는 인간 본연의 모습을 직시하는 용기',
    pragmaticInsight: '남을 속이기는 쉬워도 자기 자신을 속이는 자는 평안을 얻을 수 없습니다. 자신의 약점, 변덕, 두려움까지 가감 없이 응시할 때 비로소 진정한 자존감과 중심이 바로 섭니다.',
    practicalCounsel: '남들에게 완벽해 보이려 애쓰며 에너지를 낭비하지 마십시오. 있는 그대로의 자신의 상태를 정직하게 인정하고, 결점까지도 지혜롭게 다루는 내면의 성실함을 가꾸십시오.',
  },
  {
    themeKey: 'toleranceAndModeration',
    themeTitleEn: 'Tolerance, Moderation & Overcoming Fanaticism',
    themeTitleKo: '관용과 중용의 지혜 — 광기와 극단의 광풍을 잠재우는 온건함',
    pragmaticInsight: '종교와 이념, 파벌의 격정에 휩쓸리면 인간성을 잃게 됩니다. 어떤 맹신에도 휘둘리지 않고 인간에 대한 온화한 예의와 상호 존중을 지키는 것이 가장 높은 수준의 용기입니다.',
    practicalCounsel: '격앙된 분노나 극단적인 편 가르기에 휩쓸리지 마십시오. 차분한 상식과 균형 잡힌 관용을 유지할 때, 소모적인 대립을 넘어 모두를 살리는 중용의 해법을 발견할 수 있습니다.',
  },
  {
    themeKey: 'acceptanceOfHumanCondition',
    themeTitleEn: 'Acceptance of Human Condition & The Art of Living',
    themeTitleKo: '인간 조건의 수용과 소박한 삶 — 자연의 순리를 따르는 평상심',
    pragmaticInsight: '인간은 천사도 야수도 아니며, 나약함과 불완전성을 지닌 자연의 일부입니다. 삶의 유한성과 자연스러운 리듬을 긍정할 때 가장 편안하고 합당한 삶의 기술을 누리게 됩니다.',
    practicalCounsel: '스스로에게 과도한 이상주의를 강요하여 괴로워하지 마십시오. 매일의 소박한 일상을 소중히 가꾸며, 자연의 순리와 본성에 부합하는 자연스러운 흐름에 몸과 마음을 맡기십시오.',
  },
  {
    themeKey: 'arriereBoutiqueFreedom',
    themeTitleEn: 'The Inner Sanctuary (Arrière-Boutique) & Freedom of Mind',
    themeTitleKo: '영혼의 뒷방(Arrière-Boutique) — 세상의 소용돌이 속 독립된 안식처',
    pragmaticInsight: '사회적 역할과 공적 책무에 자신을 온전히 빼앗겨서는 안 됩니다. 몽테뉴가 자신의 성탑 서재에서 자유를 누렸듯, 누구의 간섭도 닿지 않는 영혼의 사적인 뒷방을 간직해야 합니다.',
    practicalCounsel: '세상 사람들에게 자신을 빌려줄 수는 있어도, 당신의 영혼 전체를 넘겨주지는 마십시오. 오직 당신 자신만을 위해 고요히 사유하고 쉴 수 있는 내면의 뒷방 서재를 항상 지키십시오.',
  },
];

export const MONTAIGNE_APHORISMS: MontaigneAphorism[] = [
  {
    aphorismKey: 'queSaisJeMotto',
    aphorismKo: '내가 무엇을 아는가? (Que sais-je?)',
    aphorismEn: 'What do I know? (Que sais-je?)',
    sourceContext: '《수상록(Les Essais)》 몽테뉴의 필생의 모토',
    actionGuidance: '성급한 단정과 오만을 내려놓고, 끊임없이 사물의 다른 면을 탐구하는 열린 겸양을 지니십시오.',
  },
  {
    aphorismKey: 'greatMasterpieceLivingRight',
    aphorismKo: '인간에게 가장 위대하고 영광스러운 걸작은 올바르고 합당하게 살아가는 것이다.',
    aphorismEn: 'The greatest and most glorious masterpiece of humans is to live right, to purpose.',
    sourceContext: '《수상록(Les Essais)》 제3권 제13장 〈경험에 대하여〉',
    actionGuidance: '거창한 명성이나 허영에 쫓기지 말고, 하루하루의 삶을 바르고 품격 있게 살아가는 데 정성을 다하십시오.',
  },
  {
    aphorismKey: 'throneSitsOnBottom',
    aphorismKo: '세상에서 가장 높은 왕좌에 앉아 있을지라도 우리는 결국 자기 엉덩이로 앉아 있는 것이다.',
    aphorismEn: 'Sit we upon the highest throne of the world, yet sit we upon our own tail.',
    sourceContext: '《수상록(Les Essais)》 제3권 제13장',
    actionGuidance: '지위나 권세에 주눅 들지도 자만하지도 말고, 모든 인간이 근본적으로 동등한 나약함을 지녔음을 기억하십시오.',
  },
  {
    aphorismKey: 'lendSelfToOthers',
    aphorismKo: '우리는 타인에게 자신을 빌려줄 수는 있어도 오직 자신에게만 자신을 온전히 주어야 한다.',
    aphorismEn: 'Men lend themselves to others; they give themselves only to themselves.',
    sourceContext: '《수상록(Les Essais)》 제3권 제10장 〈의지를 다스리는 법에 대하여〉',
    actionGuidance: '타인의 기대와 세상의 요구에 영혼을 완전히 소진당하지 말고, 내면의 독립성과 자율성을 온전히 수호하십시오.',
  },
  {
    aphorismKey: 'natureGentleGuideWisdom',
    aphorismKo: '자연은 온유한 안내자이다. 지혜롭고 공정한 자연을 온전히 따르는 것보다 아름다운 일은 없다.',
    aphorismEn: 'Nature is a gentle guide, yet no more gentle than wise and just. We cannot err in following Nature.',
    sourceContext: '《수상록(Les Essais)》 제3권 제12장',
    actionGuidance: '인위적인 긴장과 억지를 내려놓고, 사물의 자연스러운 순리와 본성에 순응하며 편안한 해결을 도모하십시오.',
  },
];

function formatMontaigneKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function buildMontaigneReflectiveQuestion(theme: MontaigneTheme, query?: string): string {
  const trimmed = query?.trim();
  if (trimmed) {
    return `'${trimmed}' 앞에서 내가 당연하다고 믿고 있는 전제 중 "내가 무엇을 아는가(Que sais-je?)"라고 한 걸음 물러나 다시 볼 여지는 무엇인가요? (${theme.themeTitleKo})`;
  }
  return `지금 내 마음의 뒷방(Arrière-boutique)을 지키며 꾸밈없이 마주해야 할 자기 자신의 모습은 무엇인가요? (${theme.themeTitleKo})`;
}

function describeMontaigneStage(score: number): string {
  if (score >= 92) return '맑은 겸양기 (독단을 비우고 영혼의 뒷방이 단단히 선 흐름)';
  if (score >= 85) return '온건한 성찰기 (솔직한 자기 관찰과 중용이 고르게 흐르는 국면)';
  return '담백한 관조기 (억지 꾸밈을 덜어내고 자연의 순리를 따르는 흐름)';
}

export function calculateFrenchMichelDeMontaigneEssays(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchMichelDeMontaigneEssaysResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `MONTAIGNE-ESSAYS-QUE-SAIS-JE:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const epistemicHumilityQueSaisJeIndex = 81 + (absHash % 18);
  const candidSelfObservationIntrospectionScore = 83 + ((absHash >> 3) % 16);
  const toleranceMiddleWayPrudenceIndex = 80 + ((absHash >> 6) % 19);
  const humanConditionAcceptanceScore = 82 + ((absHash >> 9) % 17);
  const innerFreedomSanctuaryIndex = 84 + ((absHash >> 12) % 15);

  const themeIndex = (absHash >> 5) % MONTAIGNE_THEMES.length;
  const aphorismIndex = (absHash >> 8) % MONTAIGNE_APHORISMS.length;
  const secondaryOffset = 1 + ((absHash >> 11) % (MONTAIGNE_APHORISMS.length - 1));
  const secondaryAphorismIndex = (aphorismIndex + secondaryOffset) % MONTAIGNE_APHORISMS.length;

  const activeMontaigneTheme = MONTAIGNE_THEMES[themeIndex];
  const focalMontaigneAphorism = MONTAIGNE_APHORISMS[aphorismIndex];
  const secondaryMontaigneAphorism = MONTAIGNE_APHORISMS[secondaryAphorismIndex];
  const reflectiveQuestion = buildMontaigneReflectiveQuestion(activeMontaigneTheme, query);
  const interpretiveBoundary = '몽테뉴 《수상록》 관점은 우열 판정이나 미래 단정이 아니라, 지적 겸양과 솔직한 자기 관찰을 돕는 인문학적 성찰 렌즈입니다.';

  const guidanceTitle = `미셸 드 몽테뉴 수상록 지혜: ${activeMontaigneTheme.themeTitleKo}`;
  const philosophicalCounsel = `프랑스 르네상스 인문주의와 에세이의 창시자 미셸 드 몽테뉴는 "내가 무엇을 아는가(Que sais-je?)"라는 인식론적 겸양과 성탑 서재(Arrière-boutique)의 내적 자유를 가르칩니다. ` +
    `현재 당신의 흐름에서 가장 귀감이 되는 핵심 지혜는 '${activeMontaigneTheme.themeTitleKo}'입니다. ` +
    `${activeMontaigneTheme.practicalCounsel} 몽테뉴의 통찰 "${focalMontaigneAphorism.aphorismKo}"를 되새기며, ` +
    `${focalMontaigneAphorism.actionGuidance}`;

  const montaigneCrossAxis = `${activeMontaigneTheme.themeTitleKo.split('—')[0].trim()} × ${focalMontaigneAphorism.sourceContext}`;
  const montaigneSynthesisMatrix = {
    dominantTension: `${activeMontaigneTheme.themeTitleKo} ↔ ${focalMontaigneAphorism.sourceContext}`,
    alignmentState:
      epistemicHumilityQueSaisJeIndex >= 88 && innerFreedomSanctuaryIndex >= 88
        ? '겸양과 내적 자유의 고차원 조화'
        : '독단을 비우고 자기 관찰로 중심을 세우는 국면',
    integratedAction: `${activeMontaigneTheme.practicalCounsel} (${focalMontaigneAphorism.actionGuidance})`,
  };

  return {
    engineVersion: FRENCH_MICHEL_DE_MONTAIGNE_VERSION,
    calculatedAtKst: formatMontaigneKstTimestamp(now),
    epistemicHumilityQueSaisJeIndex,
    candidSelfObservationIntrospectionScore,
    toleranceMiddleWayPrudenceIndex,
    humanConditionAcceptanceScore,
    innerFreedomSanctuaryIndex,
    activeMontaigneTheme,
    focalMontaigneAphorism,
    secondaryMontaigneAphorism,
    montaigneCrossAxis,
    reflectiveQuestion,
    ritualAction: focalMontaigneAphorism.actionGuidance,
    reflectionFocus: reflectiveQuestion,
    interpretiveBoundary,
    montaigneComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    montaigneSynthesisMatrix,
  };
}

export function formatFrenchMichelDeMontaigneEssaysPrompt(
  res: FrenchMichelDeMontaigneEssaysResult,
): string {
  const lines = [
    `【미셸 드 몽테뉴 《수상록(Les Essais)》 "내가 무엇을 아는가" 지혜 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- "내가 무엇을 아는가" 지적 겸양도(Epistemic Humility & Que Sais-Je): ${describeMontaigneStage(res.epistemicHumilityQueSaisJeIndex)}`,
    `- 솔직한 자기 관찰 및 내면 성찰력(Candid Self-Observation): ${describeMontaigneStage(res.candidSelfObservationIntrospectionScore)}`,
    `- 관용 및 중용의 분별력(Tolerance & Middle-Way Prudence): ${describeMontaigneStage(res.toleranceMiddleWayPrudenceIndex)}`,
    `- 인간 조건 수용 및 소박한 삶의 조화도(Acceptance of Human Condition): ${describeMontaigneStage(res.humanConditionAcceptanceScore)}`,
    `- 영혼의 뒷방(Arrière-Boutique) 내적 자유도(Inner Freedom Sanctuary): ${describeMontaigneStage(res.innerFreedomSanctuaryIndex)}`,
    `- 핵심 몽테뉴 성찰 테마: ${res.activeMontaigneTheme.themeTitleKo} [${res.activeMontaigneTheme.themeTitleEn}]`,
    `- 실용주의적 통찰: ${res.activeMontaigneTheme.pragmaticInsight}`,
    `- 실천적 조언: ${res.activeMontaigneTheme.practicalCounsel}`,
    `- 몽테뉴 원전 명언: "${res.focalMontaigneAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalMontaigneAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalMontaigneAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalMontaigneAphorism.actionGuidance}`,
    `- 보조 원전 테제: "${res.secondaryMontaigneAphorism.aphorismKo}"`,
    `- 보조 원전 출처: [${res.secondaryMontaigneAphorism.sourceContext}]`,
    `- 보조 실천 지침: ${res.secondaryMontaigneAphorism.actionGuidance}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 몽테뉴 교차 축: ${res.montaigneCrossAxis}`,
    `- 종합 몽테뉴 인문주의 권면: ${res.montaigneComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.montaigneSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.montaigneSynthesisMatrix.dominantTension} | 조율 상태: ${res.montaigneSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.montaigneSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
