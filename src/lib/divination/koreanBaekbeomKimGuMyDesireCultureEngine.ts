/**
 * 대한민국 백범 김구(白凡 金九) 선생 《백범일지(白凡逸志)》 & 〈나의 소원(My Desire)〉 높은 문화의 힘(High Power of Culture) & 홍익인간(弘益人間) 상생 평화와 자주독립 실천 엔진
 *
 * 대한민국 임시정부 주석이자 민족의 영원한 스승 백범 김구(白凡 金九, 1876~1949) 선생의 불멸의 원전 기반:
 * 1. 높은 문화의 힘 (High Power of Culture): 무력이나 경제력의 패권이 아니라, 나를 행복하게 하고 남에게도 행복을 주는 오직 한없이 가지고 싶은 가장 아름다운 영적·정신적 문화의 힘.
 * 2. 홍익인간 상생 평화 (弘益人間 普遍的 平和): 널리 인간 세상을 이롭게 한다는 단군의 건국이념을 계승하여, 갈등과 침략을 넘어 온 인류가 참된 평화와 화목을 누리는 세계 평화의 모범국 실현.
 * 3. 답설야중거 솔선수범 (踏雪野中去 不須胡亂行): "눈 덮인 들판을 걸어갈 때 어지러이 걷지 마라. 오늘 내가 남긴 발자국은 뒤따라오는 이의 길이 되리라." 후세를 위한 엄정한 자기 성찰과 도덕적 책임.
 * 4. 자주독립의 결단 (自主獨立): 남에게 의지하거나 외세에 휘둘리지 않고, 스스로 주인이 되어 민족과 개인의 자주적 존엄을 굳건히 세우는 주체적 자주성.
 * 5. 백범의 겸손과 서민적 사랑 (白凡 謙遜 & 愛民愛人): 가장 낮은 백정(白)과 범부(凡)의 애국심과 진정성을 품고, 모든 사람을 차별 없이 형제자매로 귀히 섬기는 대승적 사랑.
 *
 * @version LUCKEY-BAEKBEOM-KIM-GU-MY-DESIRE-CULTURE-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_BAEKBEOM_KIM_GU_VERSION = 'LUCKEY-BAEKBEOM-KIM-GU-MY-DESIRE-CULTURE-v2.0.0';

export interface KimGuTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  baekbeomInsight: string;
  practicalCounsel: string;
}

export interface KimGuAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanjaOrOriginal: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface BaekbeomKimGuMyDesireCultureResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 백범 문화·자주독립 지표 (0~100)
  highCulturalPowerSpiritualScore: number;     // 높은 문화의 힘 내면적 영성도 (High Power of Culture)
  hongikInganUniversalPeaceScore: number;     // 홍익인간 온 인류 상생 평화도 (弘益人間 普遍的 平和度)
  snowFieldExemplaryGuidanceScore: number;    // 답설야중거 솔선수범 지침력 (踏雪野中去 率先垂範 力量)
  selfReliantIndependenceWillScore: number;   // 억압을 뚫는 자주독립 주체적 결단도 (自主獨立 主體的 決斷度)
  baekbeomHumilityPublicLoveIndex: number;    // 만인을 귀히 여기는 백범의 겸손과 애민애인 지수 (白凡 謙遜 & 愛民愛人 指數)
  // 세부 분석
  activeKimGuTheme: KimGuTheme;
  focalKimGuAphorism: KimGuAphorism;
  kimGuComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  kimGuSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatKimGuKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeKimGuStage(score: number): string {
  if (score >= 90) return '문화강국(文化之力) — 나를 행복하게 하고 남에게도 온기를 전하는 높은 문화의 힘이 무르익은 국면';
  if (score >= 82) return '답설야중거(踏雪野中去) — 오늘 내딛는 정직한 한 걸음이 누군가의 이정표가 되는 성찰기';
  return '백범지지(白凡之志) — 겸손과 자주독립의 초심을 다지며 내면의 품격을 가꾸는 시기';
}

export const KIM_GU_THEMES: KimGuTheme[] = [
  {
    themeKey: 'high_power_of_culture',
    themeTitleHanja: '文化之力 (문화의 힘)',
    themeTitleKo: '나를 행복하게 하고 남에게도 행복을 주는 가장 아름다운 문화의 힘',
    baekbeomInsight: '남을 침략하는 군사력이나 부의 과시보다 위대한 것은 오직 내면을 풍요롭게 가꾸고 세상에 온기와 감동을 전하는 정신적 문화의 힘입니다.',
    practicalCounsel: '외형적인 힘이나 물질적 경쟁에 집착하지 마십시오. 당신의 고유한 지혜와 따뜻한 덕성, 문화적 감수성을 키워 주변을 감화시키십시오.',
  },
  {
    themeKey: 'hongik_universal_peace',
    themeTitleHanja: '弘益人間 (홍익인간 상생 평화)',
    themeTitleKo: '널리 사람을 이롭게 하고 온 인류의 평화와 화목을 밝히는 등불',
    baekbeomInsight: '진정한 애국과 사랑은 배타적 이기주의가 아니라, 온 인류가 더불어 참된 행복을 누릴 수 있도록 먼저 모범을 보이고 사랑을 베푸는 상생에 있습니다.',
    practicalCounsel: '너와 나의 편 가르기를 멈추고 공존의 길을 모색하십시오. 당신의 배려와 화합의 실천이 공동체를 하나로 묶는 평화의 초석이 됩니다.',
  },
  {
    themeKey: 'snow_field_exemplary_step',
    themeTitleHanja: '踏雪野中去 (답설야중거 솔선수범)',
    themeTitleKo: '오늘 내가 남긴 발자국이 뒤따라오는 이의 이정표가 되는 엄정한 자기 성찰',
    baekbeomInsight: '눈 덮인 들판을 걸어갈 때 갈팡질팡 걷지 마십시오. 오늘 당신이 묵묵히 내딛는 올곧은 한 걸음이 내일 후배들과 이웃들이 따라올 길이 됩니다.',
    practicalCounsel: '아무도 보지 않는 순간에도 스스로의 양심과 품위를 지키십시오. 당신의 정직한 처신과 솔선수범이 가장 강력한 리더십입니다.',
  },
  {
    themeKey: 'independent_sovereignty',
    themeTitleHanja: '自主獨立 (자주독립의 굳건한 기개)',
    themeTitleKo: '어떤 외압과 불의에도 굴하지 않고 내 삶의 완전한 주권자로 우뚝 섬',
    baekbeomInsight: '남의 도움이나 시혜에 기댄 독립은 참된 주권이 아닙니다. 오직 자신의 피와 땀으로 자유를 쟁취하고 지켜낼 때 당당한 역사의 주인이 됩니다.',
    practicalCounsel: '타인의 승인이나 동정에 기대지 마십시오. 당신의 운명과 신념은 오직 당신 스스로의 용기와 분투로 지켜내야 합니다.',
  },
  {
    themeKey: 'humble_servant_baekbeom',
    themeTitleHanja: '白凡之志 (백범의 겸손과 서민적 사랑)',
    themeTitleKo: '가장 평범한 백성의 순수한 충정을 품고 만인을 형제로 섬김',
    baekbeomInsight: '백정(白)과 범부(凡)의 진솔한 마음으로 공동체를 섬기는 겸손이야말로 사리사욕과 교만을 씻어내는 가장 거룩한 사랑입니다.',
    practicalCounsel: '높은 자리에 오를수록 더 낮은 곳으로 시선을 돌리십시오. 평범한 이웃들의 고통에 귀 기울이고 먼저 손을 내미는 겸손을 실천하십시오.',
  },
];

export const KIM_GU_APHORISMS: KimGuAphorism[] = [
  {
    aphorismKey: 'my_desire_culture',
    aphorismKo: '나는 우리나라가 세계에서 가장 아름다운 나라가 되기를 원한다. 가장 부강한 나라가 되기를 원하는 것은 아니다. 오직 한없이 가지고 싶은 것은 높은 문화의 힘이다.',
    aphorismHanjaOrOriginal: '오직 한없이 가지고 싶은 것은 높은 문화의 힘이다. 문화의 힘은 우리 자신을 행복되게 하고, 나아가서 남에게 행복을 주겠기 때문이다. (〈나의 소원〉)',
    sourceContext: '《백범일지(白凡逸志)》 〈나의 소원〉',
    actionGuidance: '물질의 다과를 떠나 인격과 영혼의 향기를 가꾸십시오. 당신의 아름다운 삶이 세상에 참된 행복을 선물합니다.',
  },
  {
    aphorismKey: 'step_in_snow',
    aphorismKo: '눈 덮인 들판을 걸어갈 때 어지러이 걷지 마라. 오늘 내가 남긴 발자국은 뒤따라오는 이의 이정표가 되리라.',
    aphorismHanjaOrOriginal: '踏雪野中去 不須胡亂行 今日我行跡 遂作後人程 (서산대사 야설 시, 백범 선생의 평생 좌우명)',
    sourceContext: '백범 선생 평생의 친필 좌우명',
    actionGuidance: '오늘 내딛는 말 한마디, 행동 하나를 삼가십시오. 당신의 발자취가 누군가에게는 희망의 길잡이가 됩니다.',
  },
  {
    aphorismKey: 'true_peace_love',
    aphorismKo: '진정한 평화는 오직 사랑과 상생에서 비롯된다. 인류가 불행한 것은 인의가 부족하고 자비가 부족하고 사랑이 부족하기 때문이다.',
    aphorismHanjaOrOriginal: '인류가 불행한 것은 인의가 부족하고 자비가 부족하고 사랑이 부족한 때문이다. (〈나의 소원〉)',
    sourceContext: '《백범일지》 〈나의 소원〉',
    actionGuidance: '분노와 반목의 악순환을 끊어내십시오. 당신의 너그러운 포용과 따뜻한 사랑이 얼어붙은 마음을 녹입니다.',
  },
  {
    aphorismKey: 'sovereign_identity',
    aphorismKo: '남의 나라의 좋은 것을 본받되, 우리의 본래 모습을 잃지 않고 자주적으로 발전시켜야 한다.',
    aphorismHanjaOrOriginal: '우리의 자주독립을 공고히 하며, 고유한 문화를 세계에 활짝 꽃피워야 한다.',
    sourceContext: '대한민국 임시정부 연설',
    actionGuidance: '남의 시선이나 유행에 휘둘리지 마십시오. 당신 고유의 개성과 정체성을 굳건히 지키며 당당하게 발전시키십시오.',
  },
];

export function calculateBaekbeomKimGuMyDesireCulture(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): BaekbeomKimGuMyDesireCultureResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `BAEKBEOM-KIM-GU-MY-DESIRE-CULTURE:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const highCulturalPowerSpiritualScore = 76 + (absHash % 23);
  const hongikInganUniversalPeaceScore = 74 + ((absHash >> 3) % 25);
  const snowFieldExemplaryGuidanceScore = 75 + ((absHash >> 6) % 24);
  const selfReliantIndependenceWillScore = 73 + ((absHash >> 9) % 26);
  const baekbeomHumilityPublicLoveIndex = 72 + ((absHash >> 12) % 27);

  const themeIndex = (absHash >> 4) % KIM_GU_THEMES.length;
  const aphorismIndex = (absHash >> 7) % KIM_GU_APHORISMS.length;

  const activeKimGuTheme = KIM_GU_THEMES[themeIndex];
  const focalKimGuAphorism = KIM_GU_APHORISMS[aphorismIndex];

  const guidanceTitle = `백범 김구 높은 문화의 힘과 자주독립: ${activeKimGuTheme.themeTitleKo}`;
  const philosophicalCounsel = `백범 김구 선생의 숭고한 민족혼과 문화사상은 외형적 힘을 넘어 영혼을 살리는 높은 문화의 힘과 솔선수범의 도덕적 기개를 일깨웁니다. ` +
    `현재 당신의 삶을 비추는 핵심 정신은 '${activeKimGuTheme.themeTitleKo}'입니다. ` +
    `${activeKimGuTheme.practicalCounsel} 아울러 선생의 결연한 경구 "${focalKimGuAphorism.aphorismKo}"을 마음에 새기고, ` +
    `${focalKimGuAphorism.actionGuidance}`;

  const calculatedAtKst = formatKimGuKstTimestamp(now);
  const avgScore = Math.round(
    (highCulturalPowerSpiritualScore +
      hongikInganUniversalPeaceScore +
      snowFieldExemplaryGuidanceScore +
      selfReliantIndependenceWillScore +
      baekbeomHumilityPublicLoveIndex) /
      5,
  );
  const kimGuSynthesisMatrix = {
    dominantTension: `${activeKimGuTheme.themeTitleKo} ↔ ${focalKimGuAphorism.sourceContext}`,
    alignmentState: describeKimGuStage(avgScore),
    integratedAction: `${focalKimGuAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_BAEKBEOM_KIM_GU_VERSION,
    calculatedAtKst,
    highCulturalPowerSpiritualScore,
    hongikInganUniversalPeaceScore,
    snowFieldExemplaryGuidanceScore,
    selfReliantIndependenceWillScore,
    baekbeomHumilityPublicLoveIndex,
    activeKimGuTheme,
    focalKimGuAphorism,
    kimGuComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    kimGuSynthesisMatrix,
  };
}

export function formatBaekbeomKimGuMyDesireCulturePrompt(res: BaekbeomKimGuMyDesireCultureResult): string {
  const avgScore = Math.round(
    (res.highCulturalPowerSpiritualScore +
      res.hongikInganUniversalPeaceScore +
      res.snowFieldExemplaryGuidanceScore +
      res.selfReliantIndependenceWillScore +
      res.baekbeomHumilityPublicLoveIndex) /
      5,
  );
  const lines = [
    `【백범 김구 《백범일지》 높은 문화의 힘 & 자주독립 실천 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 문화·자주 국면: ${describeKimGuStage(avgScore)}`,
    `- 핵심 민족혼 테마: ${res.activeKimGuTheme.themeTitleKo} [${res.activeKimGuTheme.themeTitleHanja}]`,
    `- 백범 정신 통찰: ${res.activeKimGuTheme.baekbeomInsight}`,
    `- 실천적 조언: ${res.activeKimGuTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalKimGuAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalKimGuAphorism.aphorismHanjaOrOriginal}" [${res.focalKimGuAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalKimGuAphorism.actionGuidance}`,
    `- 종합 백범사상 권면: ${res.kimGuComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.kimGuSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.kimGuSynthesisMatrix.dominantTension} | 조율 상태: ${res.kimGuSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.kimGuSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
