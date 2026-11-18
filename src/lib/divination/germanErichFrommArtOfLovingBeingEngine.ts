/**
 * 독일/미국 에리히 프롬(Erich Fromm) 《사랑의 기술(The Art of Loving)》 & 《소유냐 존재냐(To Have or to Be)》 능동적 사랑 & 존재적 실존 지혜 엔진
 *
 * 20세기 최고의 인본주의 심리학자이자 사회철학자인 에리히 프롬(Erich Fromm, 1900~1980)의 불후의 명저
 * 《사랑의 기술(The Art of Loving, 1956)》, 《소유냐 존재냐(To Have or to Be, 1976)》, 《자유로부터의 도피(Escape from Freedom, 1941)》 원전 기반:
 * 1. 능동적 배려와 응답 책임 지수(Active Care & Responsibility Index): 사랑하는 대상의 생명과 성장을 적극적으로 돌보고 그 필요에 진심으로 응답하는 능력.
 * 2. 존재 존중 및 깊은 통찰 지혜도(Respect & Deep Knowledge Wisdom Score): 상대를 지배하거나 소유하려 하지 않고 고유성을 존중하며 본질을 꿰뚫는 사랑의 앎.
 * 3. 존재적 실존 충만도(Being Mode Fulfillment Index): 소유와 소비, 집착의 굴레를 벗어나 지금-여기에서 참되게 깨어있고 나누는 존재적 삶의 기쁨.
 * 4. 적극적 자유 및 주체적 자립도(Positive Freedom & Autonomous Individuation Score): 불안과 고독을 피해 맹목적으로 순응하지 않고 사랑과 생산적 일로 연대하는 참된 자유.
 * 5. 생산적 생명 지향 및 사랑의 기술 성숙도(Productive Orientation & Biophilia Vitality Score): 삶을 긍정하고 사랑하며(Biophilia) 자신의 창조적 잠재력을 온전히 꽃피우는 성숙도.
 *
 * @version LUCKEY-ERICH-FROMM-LOVE-BEING-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_ERICH_FROMM_VERSION = 'LUCKEY-ERICH-FROMM-LOVE-BEING-v2.4.0';

export interface FrommTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  humanisticInsight: string;
  practicalCounsel: string;
}

export interface FrommAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanErichFrommArtOfLovingBeingResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 에리히 프롬 인본주의 실존 지표 (0~100)
  activeCareAndResponsibilityIndex: number;      // 능동적 배려와 응답 책임 지수 (Active Care & Responsibility)
  respectAndKnowledgeWisdomScore: number;       // 존재 존중 및 깊은 통찰 지혜도 (Respect & Deep Knowledge)
  beingModeFulfillmentIndex: number;            // 존재적 실존 충만도 (Being Mode Fulfillment)
  positiveFreedomAutonomyScore: number;         // 적극적 자유 및 주체적 자립도 (Positive Freedom & Autonomy)
  productiveOrientationVitalityScore: number;   // 생산적 생명 지향 및 사랑의 기술 성숙도 (Productive Orientation & Biophilia)
  // 세부 분석
  activeFrommTheme: FrommTheme;
  focalFrommAphorism: FrommAphorism;
  frommComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  frommSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export const FROMM_THEMES: FrommTheme[] = [
  {
    themeKey: 'activeLoveElements',
    themeTitleEn: 'Active Love: Care, Responsibility, Respect, Knowledge',
    themeTitleKo: '사랑의 4대 요소 — 배려·책임·존중·이해의 능동적 실천',
    humanisticInsight: '사랑은 우연히 빠져드는 감상적 감정이 아니라, 지속적인 훈련과 정성을 요구하는 능동적 기술입니다. 상대의 성장을 돌보는 배려와 응답하는 책임, 고유성을 지켜주는 존중과 깊은 이해가 결합할 때 참된 사랑이 완성됩니다.',
    practicalCounsel: '상대가 나에게 무엇을 해줄까 바라기보다, 내가 상대의 성장과 행복을 위해 무엇을 건넬 수 있을지 먼저 생각하십시오. 따뜻한 관심과 존중 어린 경청이 관계를 꽃피웁니다.',
  },
  {
    themeKey: 'havingVsBeing',
    themeTitleEn: 'To Have or To Be: Embracing the Being Mode',
    themeTitleKo: '소유냐 존재냐 — 집착을 내려놓고 참된 존재로 깨어나기',
    humanisticInsight: '소유 양식은 사물과 지식, 사람까지 내 것으로 움켜쥐고 통제하려 하여 끊임없는 불안을 낳습니다. 반면 존재 양식은 지금-여기에 온전히 현존하며 나누고 교감함으로써 영혼의 깊은 평화와 기쁨을 누립니다.',
    practicalCounsel: '더 많이 소유하고 인정받으려는 경쟁적 욕망에서 한 걸음 물러서십시오. 지금 당신이 살아있음 자체, 사람들과 나누는 정직한 온기에 마음을 쏟을 때 진정한 풍요가 깃듭니다.',
  },
  {
    themeKey: 'positiveFreedom',
    themeTitleEn: 'Escape from Freedom to Positive Freedom',
    themeTitleKo: '적극적 자유 — 자발적 사랑과 창조적 일의 연대',
    humanisticInsight: '인간은 고독과 불안을 이기지 못해 권위주의나 군중의 획일적 유행으로 도피하곤 합니다. 참된 자유는 자아를 포기하는 것이 아니라, 사랑과 창조적인 노동을 통해 세상과 주체적으로 연대하는 적극적 자유입니다.',
    practicalCounsel: '남들의 시선이나 유행에 자신을 맞추려 애쓰지 마십시오. 당신의 양심과 개성을 당당히 지키며, 당신이 진정으로 사랑하는 일과 사람들에게 자발적으로 헌신하십시오.',
  },
  {
    themeKey: 'biophiliaOrientation',
    themeTitleEn: 'Biophilia: Love of Life and Growth',
    themeTitleKo: '생명 사랑(Biophilia) — 모든 살아있는 것의 번영을 지향하기',
    humanisticInsight: '기계적 통제나 파괴에 끌리는 죽음의 성향(Necrophilia)을 물리치고, 생명 그 자체의 신비와 성장을 아끼는 생명 사랑(Biophilia)을 지닐 때 인간의 마음은 무한한 창조력으로 빛납니다.',
    practicalCounsel: '완벽한 통제나 경직된 규칙으로 스스로를 옥죄지 마십시오. 작은 화초가 햇살을 향해 자라나듯, 자연스러운 생명의 리듬을 신뢰하고 당신 내면의 성장을 너그럽게 기다려 주십시오.',
  },
  {
    themeKey: 'humanisticConscience',
    themeTitleEn: 'Humanistic Conscience & Inner Wholeness',
    themeTitleKo: '인본주의적 양심 — 우리 자신의 참된 자아가 부르는 소리',
    humanisticInsight: '외부의 권위나 처벌이 두려워 복종하는 권위주의적 양심과 달리, 인본주의적 양심은 "인간으로서 온전하게 살아가라"고 우리 자신의 참된 자아가 가슴 깊은 곳에서 보내는 다정한 부름입니다.',
    practicalCounsel: '세상의 평가나 죄책감에 휘둘리지 마십시오. 당신이 스스로에게 진실한 사람인지, 참된 인간다움을 향해 걷고 있는지 내면의 고요한 양심의 목소리에 귀를 기울이십시오.',
  },
];

export const FROMM_APHORISMS: FrommAphorism[] = [
  {
    aphorismKey: 'loveIsActivity',
    aphorismKo: '사랑은 수동적 감정이 아니라 능동적 활동이다. 사랑은 빠져드는 것이 아니라 참여하는 것이다.',
    aphorismEn: 'Love is an activity, not a passive affect; it is a "standing in," not a "falling for."',
    sourceContext: '《사랑의 기술(The Art of Loving)》 제2장 사랑의 이론',
    actionGuidance: '수동적으로 사랑받기만을 갈망하지 마십시오. 먼저 따뜻한 관심과 정성을 표현하고 관계를 가꾸는 능동적인 주체가 되십시오.',
  },
  {
    aphorismKey: 'giveNotTake',
    aphorismKo: '주는 것은 빼앗기는 것이 아니라 내 생명력의 최고의 표현이다. 줄 때 비로소 풍요로움을 경험한다.',
    aphorismEn: 'Giving is the highest expression of potency. In the very act of giving, I experience my strength, my wealth, my power.',
    sourceContext: '《사랑의 기술》',
    actionGuidance: '당신의 지혜, 미소, 위로, 시간을 아끼지 말고 이웃에게 나누십시오. 베풀 때 당신 내면의 힘과 풍요가 놀랍도록 차오릅니다.',
  },
  {
    aphorismKey: 'toHaveOrToBe',
    aphorismKo: '내가 가진 것으로 나를 규정한다면, 그것을 잃었을 때 나는 누구인가? 오직 존재하는 자만이 흔들리지 않는다.',
    aphorismEn: 'If I am what I have and if I lose what I have, who then am I? If I am what I am, nobody can rob it.',
    sourceContext: '《소유냐 존재냐(To Have or to Be)》',
    actionGuidance: '재물이나 지위, 외적인 평판을 당신 자신의 본질과 혼동하지 마십시오. 아무도 빼앗을 수 없는 당신의 인격과 존재 자체의 가치를 신뢰하십시오.',
  },
  {
    aphorismKey: 'respectUnique',
    aphorismKo: '존중이란 한 인간이 그 사람답게 성장하고 피어나도록 지켜보는 능력이다.',
    aphorismEn: 'Respect is the ability to see a person as he is, to be aware of his unique individuality.',
    sourceContext: '《사랑의 기술》',
    actionGuidance: '상대를 당신의 틀에 맞추어 바꾸려 하지 마십시오. 그 사람의 고유한 개성과 길을 온전히 인정하고 지지해 주십시오.',
  },
  {
    aphorismKey: 'courageOfFaith',
    aphorismKo: '사랑한다는 것은 아무런 보장 없이 자신을 맡기는 것이며, 상대에게서 사랑을 일깨울 것을 온전히 믿는 것이다.',
    aphorismEn: 'To love means to commit oneself without guarantee, to give oneself completely in the hope that our love will produce love.',
    sourceContext: '《사랑의 기술》 제4장 사랑의 실천',
    actionGuidance: '상처받을까 두려워 마음을 닫지 마십시오. 진실한 믿음과 헌신으로 당신의 마음을 건넬 때 기적 같은 신뢰가 피어납니다.',
  },
];

function formatFrommKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeFrommStage(score: number): string {
  if (score >= 92) return '충만한 존재기 (소유적 집착을 비우고 능동적 사랑과 자유가 빛나는 흐름)';
  if (score >= 85) return '성숙한 배려기 (상대의 고유성을 존중하며 생산적 연대가 자라는 흐름)';
  return '고요한 자립기 (인본주의적 양심을 따라 내면의 중심을 다지는 흐름)';
}

export function calculateGermanErichFrommArtOfLovingBeing(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): GermanErichFrommArtOfLovingBeingResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `ERICH-FROMM-LOVE-BEING:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const activeCareAndResponsibilityIndex = 81 + (absHash % 18);
  const respectAndKnowledgeWisdomScore = 79 + ((absHash >> 3) % 20);
  const beingModeFulfillmentIndex = 77 + ((absHash >> 6) % 22);
  const positiveFreedomAutonomyScore = 80 + ((absHash >> 9) % 19);
  const productiveOrientationVitalityScore = 78 + ((absHash >> 12) % 21);

  const themeIndex = (absHash >> 4) % FROMM_THEMES.length;
  const aphorismIndex = (absHash >> 7) % FROMM_APHORISMS.length;

  const activeFrommTheme = FROMM_THEMES[themeIndex];
  const focalFrommAphorism = FROMM_APHORISMS[aphorismIndex];

  const guidanceTitle = `에리히 프롬 사랑과 존재의 지혜: ${activeFrommTheme.themeTitleKo}`;
  const philosophicalCounsel = `인본주의 정신분석학의 거장 에리히 프롬은 소유적 집착을 벗어나 능동적인 배려와 책임, 존중과 앎을 통해 존재(Being)의 기쁨과 적극적 자유를 실현하도록 안내합니다. ` +
    `현재 당신의 삶과 관계를 성숙하게 이끄는 핵심 지혜는 '${activeFrommTheme.themeTitleKo}'입니다. ` +
    `${activeFrommTheme.practicalCounsel} 아울러 프롬의 명언 "${focalFrommAphorism.aphorismKo}"를 되새기며, ` +
    `${focalFrommAphorism.actionGuidance}`;

  const frommSynthesisMatrix = {
    dominantTension: `${activeFrommTheme.themeTitleKo} ↔ ${focalFrommAphorism.sourceContext}`,
    alignmentState:
      activeCareAndResponsibilityIndex >= 89 && beingModeFulfillmentIndex >= 88
        ? '능동적 사랑과 존재 양식의 고차원 조화'
        : '소유적 불안을 내려놓고 주체적 자립과 배려를 세우는 국면',
    integratedAction: `${activeFrommTheme.practicalCounsel} (${focalFrommAphorism.actionGuidance})`,
  };

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `"${trimmedQuery}"라는 관계와 삶의 자리에서 '${activeFrommTheme.themeTitleKo}'을 실천한다면, 무언가를 소유하려는 불안을 내려놓고 오늘 먼저 건네고 싶은 배려와 존중은 무엇인가요?`
    : `'${activeFrommTheme.themeTitleKo}'의 관점에서 지금 내 삶을 비춰볼 때, 소유보다 존재의 충만함을 선택해 먼저 표현하고 싶은 따뜻함은 무엇인가요?`;

  return {
    engineVersion: GERMAN_ERICH_FROMM_VERSION,
    calculatedAtKst: formatFrommKstTimestamp(now),
    activeCareAndResponsibilityIndex,
    respectAndKnowledgeWisdomScore,
    beingModeFulfillmentIndex,
    positiveFreedomAutonomyScore,
    productiveOrientationVitalityScore,
    activeFrommTheme,
    focalFrommAphorism,
    frommComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    frommSynthesisMatrix,
    ritualAction: focalFrommAphorism.actionGuidance,
    reflectionFocus: activeFrommTheme.practicalCounsel,
    reflectiveQuestion,
    interpretiveBoundary: '에리히 프롬의 능동적 사랑·존재 양식(Being) 상징을 빌린 정성적 관계 성찰 관점이며, 심리 진단이나 미래 단정이 아닙니다.',
  };
}

export function formatGermanErichFrommArtOfLovingBeingPrompt(
  res: GermanErichFrommArtOfLovingBeingResult,
): string {
  const lines = [
    `【에리히 프롬 《사랑의 기술》 & 《소유냐 존재냐》 능동적 사랑과 존재 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 능동적 배려와 응답 책임 지수(Active Care & Responsibility): ${describeFrommStage(res.activeCareAndResponsibilityIndex)}`,
    `- 존재 존중 및 깊은 통찰 지혜도(Respect & Deep Knowledge): ${describeFrommStage(res.respectAndKnowledgeWisdomScore)}`,
    `- 존재적 실존 충만도(Being Mode Fulfillment): ${describeFrommStage(res.beingModeFulfillmentIndex)}`,
    `- 적극적 자유 및 주체적 자립도(Positive Freedom & Autonomy): ${describeFrommStage(res.positiveFreedomAutonomyScore)}`,
    `- 생산적 생명 지향 및 사랑의 기술 성숙도(Productive Orientation & Biophilia): ${describeFrommStage(res.productiveOrientationVitalityScore)}`,
    `- 핵심 인본주의 테마: ${res.activeFrommTheme.themeTitleKo} [${res.activeFrommTheme.themeTitleEn}]`,
    `- 인본주의적 통찰: ${res.activeFrommTheme.humanisticInsight}`,
    `- 실천적 조언: ${res.activeFrommTheme.practicalCounsel}`,
    `- 프롬 원전 명언: "${res.focalFrommAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalFrommAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalFrommAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalFrommAphorism.actionGuidance}`,
    `- 종합 프롬 사랑 권면: ${res.frommComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.frommSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.frommSynthesisMatrix.dominantTension} | 조율 상태: ${res.frommSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.frommSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`);
  lines.push(`- 해석 경계: 에리히 프롬의 능동적 사랑·존재 양식(Being) 상징을 빌린 정성적 관계 성찰 관점이며, 심리 진단이나 미래 단정이 아닙니다.`);
  return lines.join('\n');
}
