/**
 * 독일 프리드리히 실러(Friedrich Schiller) 《인간의 미적 교육에 관한 편지(Über die ästhetische Erziehung des Menschen)》 놀이 충동 & 미적 자유 지혜 엔진
 *
 * 독일 고전주의의 위대한 시인이자 미학자 프리드리히 실러(Johann Christoph Friedrich von Schiller, 1759~1805)의
 * 《인간의 미적 교육에 관한 편지(Über die ästhetische Erziehung des Menschen in einer Reihe von Briefen, 1795)》,
 * 《우아함과 존엄에 관하여(Über Anmut und Würde, 1793)》 원전 기반:
 * 1. 놀이 충동 및 감각·이성 통합 조화도(Spieltrieb / Play Drive Harmony Score): 감각(물질 충동)과 이성(형식 충동)의 극단을 넘어서는 제3의 자유로운 놀이 충동.
 * 2. 미적 상태 및 자율적 내면 자유 지표(Aesthetic State of Inner Freedom Index): 물질적 구속과 외적 강제를 벗어나 순수한 주체적 평온을 누리는 힘.
 * 3. 살아있는 형상 창조성 및 심미적 안목(Living Form / Lebende Gestalt Creativity Score): 차가운 법칙에 생명력을 불어넣고 생명에 형식을 부여하는 예술적 안목.
 * 4. 우아함과 존엄의 인격적 품격 지수(Grace and Dignity / Anmut und Würde Integrity Score): 시련 앞의 침착한 존엄과 삶 속의 자연스러운 우아함의 조화.
 * 5. 미적 승화를 통한 갈등 치유 및 회복탄력성(Aesthetic Healing & Wholeness Resilience Score): 분열과 파편화된 자아를 온전한 전인성(Wholeness)으로 치유하는 회복탄력성.
 *
 * @version LUCKEY-SCHILLER-AESTHETIC-EDUCATION-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_FRIEDRICH_SCHILLER_AESTHETIC_EDUCATION_VERSION = 'LUCKEY-SCHILLER-AESTHETIC-EDUCATION-v2.6.0';

export interface SchillerTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface SchillerAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanFriedrichSchillerAestheticEducationResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 실러 미적 교육·놀이 충동 핵심 지표 (0~100)
  spieltriebPlayDriveHarmonyScore: number;           // 놀이 충동 및 감각·이성 통합 조화도 (Spieltrieb Harmony)
  aestheticStateFreedomIndex: number;                // 미적 상태 및 내면 자유 지표 (Aesthetic State of Freedom)
  livingFormBeautyCreativityScore: number;           // 살아있는 형상 창조성 (Living Form / Lebende Gestalt)
  graceAndDignityIntegrityScore: number;             // 우아함과 존엄의 품격 지수 (Grace and Dignity)
  aestheticHealingWholenessResilienceScore: number;  // 미적 치유 및 전인성 회복탄력성 (Aesthetic Wholeness Resilience)
  // 세부 분석
  activeSchillerTheme: SchillerTheme;
  focalSchillerAphorism: SchillerAphorism;
  schillerComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  schillerSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  schillerCrossAxis: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export const SCHILLER_THEMES: SchillerTheme[] = [
  {
    themeKey: 'playDriveSpieltrieb',
    themeTitleEn: 'The Play Drive as Reconciliation (Spieltrieb)',
    themeTitleKo: '놀이 충동(Spieltrieb) — 감각의 물질성과 이성의 형식성을 한마음으로 아우르는 자유',
    pragmaticInsight: '인간은 물질적 욕망에만 휘둘려서도 안 되고, 차가운 규칙의 노예가 되어서도 안 됩니다. 감각과 법칙이 즐겁게 어우러지는 놀이 충동 속에서 비로소 진정한 자율과 창조가 피어납니다.',
    practicalCounsel: '지나친 의무감이나 경직된 완벽주의를 내려놓으십시오. 지금 하는 일을 하나의 깊이 있는 놀이처럼 대하며, 유연함과 자발적인 즐거움을 되찾으십시오.',
  },
  {
    themeKey: 'aestheticFreedom',
    themeTitleEn: 'The Aesthetic State of Inner Freedom',
    themeTitleKo: '미적 상태의 자유 — 물질적 억압과 도덕적 강박을 초월한 순수한 내적 평온',
    pragmaticInsight: '물질의 강요나 타인의 압박에 떠밀려 살 때 영혼은 질식합니다. 아름다움을 관조하고 삶을 심미적으로 바라볼 때, 우리는 그 어떤 외압에도 흔들리지 않는 내적 자유를 누립니다.',
    practicalCounsel: '삶을 오직 유용성과 득실의 계산기로만 재단하지 마십시오. 일상 속에서 순수한 아름다움을 느끼는 순간을 마련하고, 그 고요한 평온 속에서 중심을 회복하십시오.',
  },
  {
    themeKey: 'lebendeGestalt',
    themeTitleEn: 'Living Form: Beauty Uniting Life and Structure (Lebende Gestalt)',
    themeTitleKo: '살아있는 형상(Lebende Gestalt) — 무미건조한 원칙에 따뜻한 생명력을 불어넣기',
    pragmaticInsight: '형식 없는 생명은 혼란스럽고, 생명 없는 형식은 메마르고 공허합니다. 아름다움이란 생명에 질서를 부여하고, 차가운 질서에 따뜻한 숨결을 불어넣는 "살아있는 형상"입니다.',
    practicalCounsel: '계획과 구조를 세우되 유연한 호흡을 담으십시오. 일과 창작에서 규칙의 단단함과 생생한 열정을 결합하여 완성도 높은 결실을 맺으십시오.',
  },
  {
    themeKey: 'graceAndDignity',
    themeTitleEn: 'Harmony of Grace and Dignity (Anmut und Würde)',
    themeTitleKo: '우아함과 존엄 — 시련 앞의 침착한 기품과 일상 속의 자연스러운 온유함',
    pragmaticInsight: '시련과 고통 앞에서는 영혼의 자유를 지키는 침착한 존엄(Würde)이 필요하고, 평온한 일상에서는 본성과 도덕이 일치하는 자연스러운 우아함(Anmut)이 빛나야 합니다.',
    practicalCounsel: '어려운 국면을 맞을 때는 의연하게 중심을 지키고, 사람을 대할 때는 억지스러움 없이 부드럽고 품격 있는 태도로 조화를 이루십시오.',
  },
  {
    themeKey: 'wholenessRestoration',
    themeTitleEn: 'Restoring Wholeness to the Divided Self',
    themeTitleKo: '전인적 치유와 조화 — 파편화된 분열을 딛고 온전한 인격으로 거듭나기',
    pragmaticInsight: '기능주의와 전문화의 압박 속에서 인간의 내면은 쉽게 조각납니다. 머리와 가슴, 이성과 감성이 상호 보완하는 전인성을 회복할 때 진정한 내적 치유가 일어납니다.',
    practicalCounsel: '이성적 분석에만 치우치거나 감정의 기복에만 매몰되지 마십시오. 명철한 지성과 따뜻한 감수성을 조화롭게 융합하여 온전한 존재로서 행동하십시오.',
  },
];

export const SCHILLER_APHORISMS: SchillerAphorism[] = [
  {
    aphorismKey: 'manPlaysOnlyWhenWhole',
    aphorismKo: '인간은 오직 그가 온전히 인간일 때만 놀고, 오직 그가 놀 때만 온전히 인간이다.',
    aphorismEn: 'Man only plays when in the full meaning of the word he is a man, and he is only completely a man when he plays.',
    sourceContext: '프리드리히 실러 《인간의 미적 교육에 관한 편지》 제15신',
    actionGuidance: '경직된 부담감을 내려놓고, 창의적인 탐구와 유희의 즐거움으로 당면 과제를 풀어가십시오.',
  },
  {
    aphorismKey: 'beautyWayToFreedom',
    aphorismKo: '자유로 나아가는 길은 오직 아름다움을 거쳐서만 도달할 수 있다.',
    aphorismEn: 'It is only through beauty that man makes his way to freedom.',
    sourceContext: '프리드리히 실러 《인간의 미적 교육에 관한 편지》 제2신',
    actionGuidance: '강제와 압박으로 자신이나 상대를 몰아붙이지 마십시오. 조화롭고 아름다운 방식으로 마음을 움직이십시오.',
  },
  {
    aphorismKey: 'livingFormTruth',
    aphorismKo: '미의 대상인 살아있는 형상은 감각의 충만함과 형식의 필연성을 결합한 최고의 상태다.',
    aphorismEn: 'The object of the play drive, represented in a general schema, may be called living form.',
    sourceContext: '프리드리히 실러 《인간의 미적 교육에 관한 편지》 제15신',
    actionGuidance: '외적 규범에 억눌리지 말고, 내면의 생동감 넘치는 에너지를 정돈된 형태 속에 아름답게 표현하십시오.',
  },
  {
    aphorismKey: 'anmutUndWuerdeAphorism',
    aphorismKo: '존엄은 자유로운 정신이 고통을 다스릴 때 빛나고, 우아함은 순수한 마음이 자연스럽게 배어날 때 피어난다.',
    aphorismEn: 'Dignity shows the rule of spirit over suffering; grace shows the free agreement of nature with the moral law.',
    sourceContext: '프리드리히 실러 《우아함과 존엄에 관하여(Über Anmut und Würde)》',
    actionGuidance: '위기 앞에서는 단호한 품격을 잃지 말고, 일상의 소통 속에서는 따스한 배려의 우아함을 유지하십시오.',
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

function formatSchillerKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function describeSchillerStage(score: number): string {
  if (score >= 93) return '자유로운 놀이기 (감각과 이성이 조화롭게 어우러져 살아있는 형상이 피어나는 흐름)';
  if (score >= 86) return '우아한 균형기 (물질적 압박을 넘어 품격과 평온이 고르게 흐르는 국면)';
  return '차분한 조율기 (내면의 분열을 다독이며 전인적 조화를 세우는 흐름)';
}

export function calculateGermanFriedrichSchillerAestheticEducation(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): GermanFriedrichSchillerAestheticEducationResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `SCHILLER-AESTHETIC-EDUCATION:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const spieltriebPlayDriveHarmonyScore = 83 + ((absHash >> 1) % 16);
  const aestheticStateFreedomIndex = 81 + ((absHash >> 4) % 18);
  const livingFormBeautyCreativityScore = 82 + ((absHash >> 7) % 17);
  const graceAndDignityIntegrityScore = 80 + ((absHash >> 10) % 19);
  const aestheticHealingWholenessResilienceScore = 82 + ((absHash >> 13) % 17);

  const themeIndex = (absHash >> 6) % SCHILLER_THEMES.length;
  const aphorismIndex = (absHash >> 9) % SCHILLER_APHORISMS.length;

  const activeSchillerTheme = SCHILLER_THEMES[themeIndex];
  const focalSchillerAphorism = SCHILLER_APHORISMS[aphorismIndex];

  const guidanceTitle = `실러 미적 교육·놀이 충동 지혜: ${activeSchillerTheme.themeTitleKo}`;
  const philosophicalCounsel = `독일 고전주의의 대문호 프리드리히 실러는 물질과 규칙의 분열을 넘어서는 '놀이 충동(Spieltrieb)'과 '살아있는 형상(Lebende Gestalt)'을 통해 참된 인간적 자유를 가르칩니다. ` +
    `현재 당신의 흐름에서 가장 심미적 힘을 불어넣는 핵심 지혜는 '${activeSchillerTheme.themeTitleKo}'입니다. ` +
    `${activeSchillerTheme.practicalCounsel} 실러의 명언 "${focalSchillerAphorism.aphorismKo}"를 되새기며, ` +
    `${focalSchillerAphorism.actionGuidance}`;

  const schillerSynthesisMatrix = {
    dominantTension: `${activeSchillerTheme.themeTitleKo} ↔ ${focalSchillerAphorism.sourceContext}`,
    alignmentState:
      spieltriebPlayDriveHarmonyScore >= 90 && aestheticStateFreedomIndex >= 89
        ? '놀이 충동과 미적 자유의 고차원 조화'
        : '강박을 비우고 우아함과 존엄의 균형을 세우는 국면',
    integratedAction: `${activeSchillerTheme.practicalCounsel} (${focalSchillerAphorism.actionGuidance})`,
  };

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `"${trimmedQuery}"라는 과제 앞에서 '${activeSchillerTheme.themeTitleKo}'의 균형을 살린다면, 지나친 경직을 풀고 즐거움과 품격을 함께 담아낼 방법은 무엇인가요?`
    : `'${activeSchillerTheme.themeTitleKo}'의 미적 감각으로 오늘 하루를 바라본다면, 의무의 무게를 잠시 내려놓고 숨을 고를 수 있는 여유는 어디에 있나요?`;

  const calculatedAtKst = formatSchillerKstTimestamp(now);
  const schillerCrossAxis = `[${activeSchillerTheme.themeTitleKo.split('—')[0].trim()}] × [${focalSchillerAphorism.sourceContext}] × [${schillerSynthesisMatrix.alignmentState}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: GERMAN_FRIEDRICH_SCHILLER_AESTHETIC_EDUCATION_VERSION,
    calculatedAtKst,
    spieltriebPlayDriveHarmonyScore,
    aestheticStateFreedomIndex,
    livingFormBeautyCreativityScore,
    graceAndDignityIntegrityScore,
    aestheticHealingWholenessResilienceScore,
    activeSchillerTheme,
    focalSchillerAphorism,
    schillerComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    schillerSynthesisMatrix,
    schillerCrossAxis,
    ritualAction: focalSchillerAphorism.actionGuidance,
    reflectionFocus: activeSchillerTheme.practicalCounsel,
    reflectiveQuestion,
    interpretiveBoundary: '실러의 놀이 충동(Spieltrieb)·우아함과 존엄 상징을 빌린 정성적 조화 성찰 관점이며, 수치 평가나 확정 예언이 아닙니다.',
  };
}

export function formatGermanFriedrichSchillerAestheticEducationPrompt(
  res: GermanFriedrichSchillerAestheticEducationResult,
): string {
  const lines = [
    `【프리드리히 실러 《인간의 미적 교육에 관한 편지》 놀이 충동 및 미적 자유 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 놀이 충동 및 감각·이성 조화도(Spieltrieb Play Drive Harmony): ${describeSchillerStage(res.spieltriebPlayDriveHarmonyScore)}`,
    `- 미적 상태 및 내면 자유 지표(Aesthetic State of Inner Freedom): ${describeSchillerStage(res.aestheticStateFreedomIndex)}`,
    `- 살아있는 형상 창조성(Living Form / Lebende Gestalt Creativity): ${describeSchillerStage(res.livingFormBeautyCreativityScore)}`,
    `- 우아함과 존엄의 품격 지수(Grace and Dignity Integrity): ${describeSchillerStage(res.graceAndDignityIntegrityScore)}`,
    `- 미적 치유 및 전인성 회복탄력성(Aesthetic Wholeness Resilience): ${describeSchillerStage(res.aestheticHealingWholenessResilienceScore)}`,
    `- 핵심 실러 미적 테마: ${res.activeSchillerTheme.themeTitleKo} [${res.activeSchillerTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeSchillerTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeSchillerTheme.practicalCounsel}`,
    `- 실러 원전 명언: "${res.focalSchillerAphorism.aphorismKo}"`,
    `- 원문 인용: "${res.focalSchillerAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalSchillerAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalSchillerAphorism.actionGuidance}`,
    `- 종합 실러 미학 권면: ${res.schillerComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.schillerSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.schillerSynthesisMatrix.dominantTension} | 조율 상태: ${res.schillerSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.schillerSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 4중 교차 축: ${res.schillerCrossAxis}`);
  lines.push(`- 성찰 초점: ${res.reflectionFocus}`);
  lines.push(`- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`);
  lines.push(`- 해석 경계: 실러의 놀이 충동(Spieltrieb)·우아함과 존엄 상징을 빌린 정성적 조화 성찰 관점이며, 수치 평가나 확정 예언이 아닙니다.`);
  return lines.join('\n');
}
