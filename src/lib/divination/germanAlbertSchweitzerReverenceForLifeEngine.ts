/**
 * 독일/프랑스 알베르트 슈바이처(Albert Schweitzer) 《생명에 대한 경외(Ehrfurcht vor dem Leben)》 & 《문화와 윤리》 지혜 엔진
 *
 * 노벨 평화상 수상자이자 철학자·신학자·의사인 알베르트 슈바이처(Albert Schweitzer, 1875~1965)의 핵심 사상인
 * 《생명에 대한 경외(Ehrfurcht vor dem Leben)》, 《문화와 윤리(Kultur und Ethik)》, 《나의 생애와 사상》 원전 기반:
 * 1. 생명에 대한 경외 및 윤리적 감응도(Reverence for Life & Ethical Sensitivity Index): "나는 살려고 하는 생명들 가운데 살아있는 생명이다"라는 자각.
 * 2. 이타적 봉사 및 자기희생 실천력(Altruistic Service & Compassion Devotion Score): 고통받는 이들을 향해 직접 손을 내밀고 헌신하는 실천의 힘.
 * 3. 문화와 문명의 내면적 도덕 쇄신도(Civilizational & Moral Renewal Index): 물질적 진보에 매몰되지 않고 정신적·도덕적 기틀을 새롭게 세우는 추진력.
 * 4. 무한한 도덕적 책임 및 양심 각성도(Infinite Ethical Responsibility Score): 무심코 지나치는 작은 생명까지 소중히 아끼는 세심한 양심.
 * 5. 영혼의 평정 및 사색적 조화력(Spiritual Equanimity & Bach Harmony Index): 바흐 오르간 음악과 깊은 사색을 통해 얻는 내면의 맑은 평온.
 *
 * @version LUCKEY-ALBERT-SCHWEITZER-REVERENCE-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_ALBERT_SCHWEITZER_VERSION = 'LUCKEY-ALBERT-SCHWEITZER-REVERENCE-v2.3.0';

export interface SchweitzerTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface SchweitzerAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanAlbertSchweitzerReverenceForLifeResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 슈바이처 생명경외 지표 (0~100)
  reverenceForLifeEthicalIndex: number;         // 생명에 대한 경외 및 윤리적 감응도 (Reverence for Life)
  altruisticServiceDevotionScore: number;       // 이타적 봉사 및 자기희생 실천력 (Altruistic Service Devotion)
  culturalMoralRenewalScore: number;            // 문화와 윤리의 내면적 쇄신 추진력 (Civilizational Moral Renewal)
  infiniteResponsibilityConscienceIndex: number;// 무한한 도덕적 책임 및 양심 각성도 (Infinite Ethical Responsibility)
  spiritualEquanimityHarmonyIndex: number;      // 영혼의 평정 및 사색적 조화력 (Spiritual Equanimity & Bach Harmony)
  // 세부 분석
  activeSchweitzerTheme: SchweitzerTheme;
  focalSchweitzerAphorism: SchweitzerAphorism;
  schweitzerComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  schweitzerSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
}

export const SCHWEITZER_THEMES: SchweitzerTheme[] = [
  {
    themeKey: 'reverenceForLife',
    themeTitleEn: 'Reverence for Life & Ethical Sensitivity',
    themeTitleKo: '생명에 대한 경외 — 모든 살아있는 존재를 향한 깊은 공명',
    pragmaticInsight: '진정한 윤리는 인간 사이의 약속을 넘어 모든 살아있는 생명에 대한 존중에서 시작됩니다. 나와 같은 고통과 기쁨을 느끼는 존재들을 경외할 때 내면의 고귀한 힘이 깨어납니다.',
    practicalCounsel: '주변의 동료, 이웃, 그리고 함께 살아가는 모든 생명을 도구나 수단으로 대하지 마십시오. 그들의 존재 가치를 온전히 인정하고 존중할 때 당신의 삶도 가장 숭고한 빛을 얻습니다.',
  },
  {
    themeKey: 'selflessServiceLambaréné',
    themeTitleEn: 'Altruistic Service & Hands-on Compassion',
    themeTitleKo: '헌신적 봉사와 연민 — 고통받는 자를 향한 거침없는 실천',
    pragmaticInsight: '말로만 외치는 도덕은 공허합니다. 슈바이처가 랑바레네 밀림으로 향했듯, 고통의 현장으로 직접 걸어 들어가 땀 흘리는 사랑만이 진정한 변화와 치유를 만듭니다.',
    practicalCounsel: '생각과 이론에만 머무르지 말고 지금 당신의 도움이 필요한 곳으로 직접 발걸음을 옮기십시오. 작은 친절과 구체적인 행동 하나가 거대한 절망을 녹이는 가장 강력한 치료제가 됩니다.',
  },
  {
    themeKey: 'ethicalRenewalOfCulture',
    themeTitleEn: 'Moral & Ethical Renewal of Civilization',
    themeTitleKo: '문명의 도덕적 쇄신 — 외적 물질을 넘어서는 내면의 성숙',
    pragmaticInsight: '기술과 물질적 번영이 아무리 고도화되어도, 그것을 지탱하는 윤리적·정신적 토대가 무너지면 문명은 자멸합니다. 개인의 도덕적 각성이 전체 사회를 구원하는 유일한 길입니다.',
    practicalCounsel: '외형적인 성과나 물질적 이익에만 매몰되지 마십시오. 당신의 일과 삶이 어떤 선한 가치를 빚어내고 있는지 내면의 윤리적 나침반을 재점검하고 바른 원칙을 바로 세우십시오.',
  },
  {
    themeKey: 'infiniteResponsibility',
    themeTitleEn: 'Infinite Ethical Responsibility & Awakened Conscience',
    themeTitleKo: '무한한 도덕적 책임 — 무심코 지나치는 생명까지 돌보는 양심',
    pragmaticInsight: '양심이 깨어난 사람은 책임을 한정하지 않습니다. 길가의 작은 풀꽃, 작은 벌레 하나까지도 함부로 해치지 않으려는 섬세한 양심이야말로 영적 성숙의 가장 분명한 증거입니다.',
    practicalCounsel: '사소하다고 여겨지는 작은 일이나 소외된 이들의 목소리에 귀를 기울이십시오. 아무도 보지 않는 순간에도 생명을 아끼고 배려하는 성실함이 당신의 영혼을 비범하게 만듭니다.',
  },
  {
    themeKey: 'musicalEquanimityBach',
    themeTitleEn: 'Spiritual Equanimity & Bach Musical Harmony',
    themeTitleKo: '사색과 예술을 통한 영혼의 평정 — 바흐 음악 속의 거룩한 평온',
    pragmaticInsight: '세상의 혼란과 격무 속에서도 내면의 중심을 잃지 않는 비결은 고요한 사색과 예술적 조화에 있습니다. 바흐의 장엄한 화음처럼 삶의 모든 불협화음을 하나의 거룩한 평화로 승화시킵니다.',
    practicalCounsel: '지친 일상 속에서 침묵과 예술, 사색의 오아시스를 반드시 마련하십시오. 마음의 소음을 가라앉히고 영혼의 샘물을 길어 올릴 때 다시금 세상으로 나아갈 맑은 힘을 회복합니다.',
  },
];

export const SCHWEITZER_APHORISMS: SchweitzerAphorism[] = [
  {
    aphorismKey: 'willToLiveInmitten',
    aphorismKo: '나는 살려고 하는 생명들 가운데 살아있는 생명이다.',
    aphorismEn: 'I am life that wills to live, in the midst of life that wills to live.',
    sourceContext: '《문화와 윤리(Kultur und Ethik)》 핵심 명제',
    actionGuidance: '모든 생명이 당신과 마찬가지로 삶을 갈망하고 있음을 깊이 자각하고, 서로를 살리는 상생의 길을 선택하십시오.',
  },
  {
    aphorismKey: 'reverenceEthicsDefinition',
    aphorismKo: '윤리란 모든 생명에 대해 나의 생명에 느끼는 것과 동일한 경외심을 느끼는 것이다.',
    aphorismEn: 'Ethics is nothing other than Reverence for Life. Reverence for Life affords me my fundamental principle of morality.',
    sourceContext: '《나의 생애와 사상(Aus meinem Leben und Denken)》',
    actionGuidance: '자신을 아끼는 마음 그대로 타인을 존중하고, 작은 생명 앞에서도 겸허한 태도를 유지하십시오.',
  },
  {
    aphorismKey: 'exampleOnlyWayToInfluence',
    aphorismKo: '모범을 보이는 것은 타인에게 영향을 미치는 주요한 방법이 아니라 유일한 방법이다.',
    aphorismEn: 'Example is not the main thing in influencing others. It is the only thing.',
    sourceContext: '슈바이처의 교육 및 실천 철학 어록',
    actionGuidance: '장황한 설득이나 훈계 대신, 바른 원칙과 따뜻한 헌신을 스스로의 행동으로 직접 증명하십시오.',
  },
  {
    aphorismKey: 'happinessInServiceSearch',
    aphorismKo: '진정으로 행복해질 수 있는 사람은 봉사하는 법을 찾고 발견한 사람뿐이다.',
    aphorismEn: 'The only ones among you who will be really happy are those who will have sought and found how to serve.',
    sourceContext: '랑바레네 의료 봉사 담화집',
    actionGuidance: '자신만의 이익을 구하는 좁은 틀에서 벗어나, 이웃과 공동체에 기여할 수 있는 봉사의 길을 실천하십시오.',
  },
  {
    aphorismKey: 'constantKindnessSunMeltIce',
    aphorismKo: '끊임없는 친절은 많은 것을 성취한다. 태양이 얼음을 녹이듯, 친절은 오해와 불신과 적개심을 증발시킨다.',
    aphorismEn: 'Constant kindness can accomplish much. As the sun makes ice melt, kindness causes misunderstanding, mistrust, and hostility to evaporate.',
    sourceContext: '《생명에 대한 경외》 윤리 수상집',
    actionGuidance: '상대의 차가운 반응에 흔들리지 말고 한결같은 온화함과 친절로 마음의 얼음을 녹여내십시오.',
  },
];

function formatSchweitzerKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeSchweitzerStage(score: number): string {
  if (score >= 93) return '깊은 경외기 (생명 외경과 헌신적 연민이 투명하게 빛나는 흐름)';
  if (score >= 86) return '성실한 봉사기 (도덕적 책임과 실천적 친절이 고르게 이어지는 흐름)';
  return '고요한 사색기 (내면의 평정을 다지며 양심의 중심을 세우는 흐름)';
}

export function calculateGermanAlbertSchweitzerReverenceForLife(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): GermanAlbertSchweitzerReverenceForLifeResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `SCHWEITZER-REVERENCE-FOR-LIFE:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const reverenceForLifeEthicalIndex = 82 + (absHash % 17);
  const altruisticServiceDevotionScore = 80 + ((absHash >> 3) % 19);
  const culturalMoralRenewalScore = 79 + ((absHash >> 6) % 20);
  const infiniteResponsibilityConscienceIndex = 81 + ((absHash >> 9) % 18);
  const spiritualEquanimityHarmonyIndex = 83 + ((absHash >> 12) % 16);

  const themeIndex = (absHash >> 5) % SCHWEITZER_THEMES.length;
  const aphorismIndex = (absHash >> 8) % SCHWEITZER_APHORISMS.length;

  const activeSchweitzerTheme = SCHWEITZER_THEMES[themeIndex];
  const focalSchweitzerAphorism = SCHWEITZER_APHORISMS[aphorismIndex];

  const guidanceTitle = `알베르트 슈바이처 생명경외 지혜: ${activeSchweitzerTheme.themeTitleKo}`;
  const philosophicalCounsel = `노벨 평화상 수상자이자 밀림의 성자 알베르트 슈바이처 박사는 "나는 살려고 하는 생명들 가운데 살아있는 생명이다"라는 생명에 대한 경외(Reverence for Life)와 헌신적 사랑을 가르칩니다. ` +
    `현재 당신의 흐름에서 가장 요청되는 핵심 덕목은 '${activeSchweitzerTheme.themeTitleKo}'입니다. ` +
    `${activeSchweitzerTheme.practicalCounsel} 슈바이처의 가르침 "${focalSchweitzerAphorism.aphorismKo}"를 가슴에 품고, ` +
    `${focalSchweitzerAphorism.actionGuidance}`;

  const schweitzerSynthesisMatrix = {
    dominantTension: `${activeSchweitzerTheme.themeTitleKo} ↔ ${focalSchweitzerAphorism.sourceContext}`,
    alignmentState:
      reverenceForLifeEthicalIndex >= 90 && altruisticServiceDevotionScore >= 89
        ? '생명 경외와 헌신적 봉사의 깊은 공명'
        : '내면의 윤리적 중심과 실천적 친절을 조율하는 국면',
    integratedAction: `${activeSchweitzerTheme.practicalCounsel} (${focalSchweitzerAphorism.actionGuidance})`,
  };

  return {
    engineVersion: GERMAN_ALBERT_SCHWEITZER_VERSION,
    calculatedAtKst: formatSchweitzerKstTimestamp(now),
    reverenceForLifeEthicalIndex,
    altruisticServiceDevotionScore,
    culturalMoralRenewalScore,
    infiniteResponsibilityConscienceIndex,
    spiritualEquanimityHarmonyIndex,
    activeSchweitzerTheme,
    focalSchweitzerAphorism,
    schweitzerComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    schweitzerSynthesisMatrix,
    ritualAction: focalSchweitzerAphorism.actionGuidance,
    reflectionFocus: activeSchweitzerTheme.practicalCounsel,
    interpretiveBoundary: '슈바이처의 생명 경외·이타적 봉사 상징을 빌린 정성적 윤리 성찰 관점이며, 수치 평가나 미래 단정이 아닙니다.',
  };
}

export function formatGermanAlbertSchweitzerReverenceForLifePrompt(
  res: GermanAlbertSchweitzerReverenceForLifeResult,
): string {
  const lines = [
    `【알베르트 슈바이처 《생명에 대한 경외》 & 《문화와 윤리》 생명외경 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 생명에 대한 경외 및 윤리적 감응도(Reverence for Life): ${describeSchweitzerStage(res.reverenceForLifeEthicalIndex)}`,
    `- 이타적 봉사 및 자기희생 실천력(Altruistic Service Devotion): ${describeSchweitzerStage(res.altruisticServiceDevotionScore)}`,
    `- 문화와 문명의 내면적 도덕 쇄신도(Civilizational Moral Renewal): ${describeSchweitzerStage(res.culturalMoralRenewalScore)}`,
    `- 무한한 도덕적 책임 및 양심 각성도(Infinite Ethical Responsibility): ${describeSchweitzerStage(res.infiniteResponsibilityConscienceIndex)}`,
    `- 영혼의 평정 및 사색적 조화력(Spiritual Equanimity & Bach Harmony): ${describeSchweitzerStage(res.spiritualEquanimityHarmonyIndex)}`,
    `- 핵심 생명경외 테마: ${res.activeSchweitzerTheme.themeTitleKo} [${res.activeSchweitzerTheme.themeTitleEn}]`,
    `- 실용주의적 통찰: ${res.activeSchweitzerTheme.pragmaticInsight}`,
    `- 실천적 조언: ${res.activeSchweitzerTheme.practicalCounsel}`,
    `- 슈바이처 원전 명언: "${res.focalSchweitzerAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalSchweitzerAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalSchweitzerAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalSchweitzerAphorism.actionGuidance}`,
    `- 종합 슈바이처 생명철학 권면: ${res.schweitzerComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.schweitzerSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.schweitzerSynthesisMatrix.dominantTension} | 조율 상태: ${res.schweitzerSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.schweitzerSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 해석 경계: 슈바이처의 생명 경외·이타적 봉사 상징을 빌린 정성적 윤리 성찰 관점이며, 수치 평가나 미래 단정이 아닙니다.`);
  return lines.join('\n');
}
