/**
 * 대한민국 안중근(安重根) 의사 《동양평화론(東洋平和論)》 & 〈견리사의 견위수명〉 대의헌신 & 주권평화 지혜 엔진
 *
 * 대한제국의 의병 참모중장이자 불멸의 민족 영웅 안중근(安重根, 1879~1910) 의사의
 * 미완의 대작 《동양평화론(東洋平和論, 1910)》, 자서전 《안응칠 역사(安應七 歷史)》 및 뤼순 감옥 불후의 유묵 원전 기반:
 * 1. 견리사의(見利思義) 의리 우선 및 도덕적 결단력(Moral Righteousness Over Gain Score): 눈앞의 사사로운 이익을 넘어 대의명분과 신의를 지키는 선비의 기개.
 * 2. 동양평화론(東洋平和論) 주권 존중 상생 평화 비전(Sovereign Peace & Coexistence Index): 침략과 패권을 배격하고 상호 자주독립을 존중하는 선구적 평화관.
 * 3. 견위수명(見危授命) 대의 헌신 및 백절불굴 용기(Courageous Devotion & Fortitude Score): 국가와 공동체의 위기 앞에서 온몸을 던져 소명을 다하는 살신성인(殺身成仁).
 * 4. 일일부독서(一日不讀書) 지적 수양 및 지속적 성찰도(Intellectual Cultivation & Reading Index): "하루라도 책을 읽지 않으면 입안에 가시가 돋는다"는 학문과 수양의 성실성.
 * 5. 백인당중유태화(百忍堂中有泰和) 숭고한 인내와 대도 평정심(Sublime Patience & Magnanimous Peace Score): 시련 속에서도 큰 뜻을 품고 마음의 평화를 지키는 도량.
 *
 * @version LUCKEY-AHN-JUNG-GEUN-PEACE-RIGHTEOUSNESS-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_AHN_JUNG_GEUN_VERSION = 'LUCKEY-AHN-JUNG-GEUN-PEACE-RIGHTEOUSNESS-v2.2.0';

export interface AhnJungGeunTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface AhnJungGeunAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanAhnJungGeunPeaceRighteousnessResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 안중근 의사 대의·평화 지표 (0~100)
  moralRighteousnessOverGainScore: number;    // 견리사의(見利思義) 도덕적 결단력 (Moral Righteousness Over Gain)
  sovereignPeaceCoexistenceIndex: number;     // 동양평화론(東洋平和論) 상생 평화 비전 (Sovereign Peace & Coexistence)
  courageousDevotionFortitudeScore: number;   // 견위수명(見危授命) 대의 헌신 용기 (Courageous Devotion & Fortitude)
  intellectualCultivationReadingIndex: number;// 일일부독서(一日不讀書) 지적 수양도 (Intellectual Cultivation & Reading)
  sublimePatienceMagnanimousPeaceScore: number;// 백인당중유태화(百忍堂中有泰和) 숭고한 인내심 (Sublime Patience & Peace)
  // 세부 분석
  activeAhnJungGeunTheme: AhnJungGeunTheme;
  focalAhnJungGeunAphorism: AhnJungGeunAphorism;
  secondaryAhnJungGeunAphorism: AhnJungGeunAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ahnJungGeunComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  ahnJungGeunSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatAhnJungGeunKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeAhnJungGeunStage(score: number): string {
  if (score >= 92) return '견리사의(見利思義) — 이익보다 의리를 앞세우는 맑은 기개와 흔들림 없는 평화의 정점';
  if (score >= 88) return '일일부독서(一日不讀書) — 매일의 배움과 수양으로 내면의 중심을 단단히 세우는 국면';
  return '백인당중유태화(百忍堂中有泰和) — 깊은 인내와 절제로 큰 화평을 예비하는 시기';
}

export const AHN_JUNG_GEUN_THEMES: AhnJungGeunTheme[] = [
  {
    themeKey: 'gyeonLiSaUiPrinciple',
    themeTitleEn: 'Righteousness Over Self-Interest (見利思義)',
    themeTitleKo: '"이익을 보거든 의리를 생각하라" — 사익에 눈멀지 않고 바른길을 택하는 고결한 기개',
    pragmaticInsight: '단기적인 이득이나 편의를 위해 신의와 원칙을 저버리면 결국 신뢰와 기반을 모두 잃게 됩니다. 이익 앞에서도 언제나 의리와 도덕적 책임을 먼저 생각하는 태도가 최후의 승리를 이끕니다.',
    practicalCounsel: '달콤한 유혹이나 손쉬운 타협안 앞에서 마음을 가다듬으십시오. 이것이 나의 양심과 원칙에 부합하는지 자문하고, 도덕적으로 당당한 선택을 통해 영구한 신뢰를 구축하십시오.',
  },
  {
    themeKey: 'dongyangPeaceVision',
    themeTitleEn: 'Vision of Equitable Coexistence & Peace (東洋平和)',
    themeTitleKo: '"상호 존중과 자주독립의 동양평화" — 대등한 연대와 공동 번영을 여는 대승적 평화관',
    pragmaticInsight: '강압과 독선에 의한 지배는 끝없는 반발과 파멸을 부를 뿐입니다. 서로의 독립성과 고유한 권리를 동등하게 인정하고 대화와 협력의 틀을 짤 때 진정한 평화와 도약이 가능해집니다.',
    practicalCounsel: '동료나 파트너와의 관계에서 우열을 가리거나 상대를 굴복시키려 하지 마십시오. 서로의 주체성을 깊이 존중하고, 상생과 공영을 위한 공정한 협력의 룰을 함께 만들어가십시오.',
  },
  {
    themeKey: 'dailyIntellectualCultivation',
    themeTitleEn: 'Incessant Intellectual Cultivation (一日不讀書)',
    themeTitleKo: '"하루라도 책을 읽지 않으면 입안에 가시가 돋는다" — 배움을 멈추지 않는 지적 수양',
    pragmaticInsight: '아무리 위급하고 험난한 환경에 처할지라도 책을 읽고 사유를 벼리는 일을 게을리하지 않아야 통찰력을 유지할 수 있습니다. 지적 수양은 거친 풍파 속에서 내면을 지탱하는 나침반입니다.',
    practicalCounsel: '바쁜 일상이나 격변하는 환경을 핑계로 배움을 뒤로 미루지 마십시오. 매일 단 10분이라도 깊이 있는 양서를 읽고 스스로를 성찰하여 언행의 품격과 지혜의 깊이를 더하십시오.',
  },
  {
    themeKey: 'sublimePatienceHarmony',
    themeTitleEn: 'Magnanimous Patience & Ultimate Peace (百忍堂中有泰和)',
    themeTitleKo: '"백 번 참는 마음속에 큰 화평이 깃든다" — 격정을 다스리고 대도를 이루는 깊은 인내',
    pragmaticInsight: '큰 뜻을 품은 영웅은 눈앞의 사소한 모욕이나 감정적 도발에 경솔하게 흔들리지 않습니다. 가슴속에 백 번의 인내를 담아낼 수 있을 때 비로소 진정한 평화와 역사적 성취가 완성됩니다.',
    practicalCounsel: '순간의 분노나 서운함에 휩쓸려 일을 그르치지 마십시오. 호흡을 가다듬고 깊은 인내심으로 상황을 관조하며, 장기적인 대의를 향해 침착하게 걸어가는 대인의 풍모를 보이십시오.',
  },
];

export const AHN_JUNG_GEUN_APHORISMS: AhnJungGeunAphorism[] = [
  {
    aphorismKey: 'gyeonLiSaUiGyeonWiSuMyeong',
    aphorismKo: '이익을 보거든 의리를 생각하고, 위태로움을 보거든 목숨을 바친다.',
    aphorismHanja: '見利思義 見危授命',
    sourceContext: '1910년 3월 뤼순 감옥 유묵 (보물 제569-6호)',
    actionGuidance: '개인의 사리사욕을 앞세우지 말고, 정직한 도리와 공동체를 향한 막중한 책임감을 굳건히 실천하십시오.',
  },
  {
    aphorismKey: 'ilIlBuDokSeo',
    aphorismKo: '하루라도 책을 읽지 않으면 입안에 가시가 돋는다.',
    aphorismHanja: '一日不讀書 口中生荊棘',
    sourceContext: '1910년 3월 뤼순 감옥 유묵 (보물 제569-2호)',
    actionGuidance: '배움과 독서를 일상의 호흡처럼 실천하여, 생각이 거칠어지지 않도록 늘 지성과 인격을 맑게 벼리십시오.',
  },
  {
    aphorismKey: 'gukGaAnWi',
    aphorismKo: '국가의 안위를 노심초사 마음 졸인다.',
    aphorismHanja: '國家安危 勞心焦思',
    sourceContext: '1910년 3월 뤼순 감옥 유묵 (보물 제569-22호)',
    actionGuidance: '나 혼자만의 안일에 머물지 말고, 내가 속한 조직과 공동체의 미래를 깊은 애정으로 살피며 기여하십시오.',
  },
  {
    aphorismKey: 'baekInDangJung',
    aphorismKo: '백 번 참는 집안에 비로소 큰 화평이 깃든다.',
    aphorismHanja: '百忍堂中有泰和',
    sourceContext: '1910년 3월 뤼순 감옥 유묵',
    actionGuidance: '사소한 시비에 마음을 다치지 말고, 너그러운 인내와 묵직한 평정심으로 주변을 화평하게 이끄십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function calculateKoreanAhnJungGeunPeaceRighteousness(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanAhnJungGeunPeaceRighteousnessResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `AHN-JUNG-GEUN-PEACE:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const moralRighteousnessOverGainScore = 85 + ((absHash >> 1) % 14);
  const sovereignPeaceCoexistenceIndex = 84 + ((absHash >> 4) % 15);
  const courageousDevotionFortitudeScore = 86 + ((absHash >> 7) % 13);
  const intellectualCultivationReadingIndex = 82 + ((absHash >> 10) % 17);
  const sublimePatienceMagnanimousPeaceScore = 83 + ((absHash >> 13) % 16);

  const themeIndex = (absHash >> 6) % AHN_JUNG_GEUN_THEMES.length;
  const aphorismIndex = (absHash >> 9) % AHN_JUNG_GEUN_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 12) % (AHN_JUNG_GEUN_APHORISMS.length - 1))) % AHN_JUNG_GEUN_APHORISMS.length;

  const activeAhnJungGeunTheme = AHN_JUNG_GEUN_THEMES[themeIndex];
  const focalAhnJungGeunAphorism = AHN_JUNG_GEUN_APHORISMS[aphorismIndex];
  const secondaryAhnJungGeunAphorism = AHN_JUNG_GEUN_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 눈앞의 작은 이익 대신 끝까지 지켜 내야 할 의리(見利思義)와 상생의 원칙은 무엇인가요?`
    : `지금 내 선택 앞에서 사사로운 편의를 내려놓고 떳떳한 대의와 하루의 수양(一日不讀書)을 세울 지점은 어디인가요?`;
  const interpretiveBoundary = '안중근 의사 동양평화·견리사의 관점은 길흉 예단이 아니라, 도덕적 결단·상생 평화·지적 수양을 비추는 역사 성찰 렌즈입니다.';

  const guidanceTitle = `안중근 의사 대의·평화 지혜: ${activeAhnJungGeunTheme.themeTitleKo}`;
  const philosophicalCounsel = `대한의 영웅 안중근 의사는 "견리사의 견위수명(見利思義 見危授命)"의 서릿발 같은 도덕적 기개와 《동양평화론》의 원대한 상생 평화 비전을 몸소 남기셨습니다. ` +
    `현재 당신의 흐름에서 가장 귀감이 되는 핵심 지혜는 '${activeAhnJungGeunTheme.themeTitleKo}'입니다. ` +
    `${activeAhnJungGeunTheme.practicalCounsel} 안 의사의 유묵 "${focalAhnJungGeunAphorism.aphorismKo} (${focalAhnJungGeunAphorism.aphorismHanja})"를 가슴에 새기며, ` +
    `${focalAhnJungGeunAphorism.actionGuidance}`;

  const calculatedAtKst = formatAhnJungGeunKstTimestamp(now);
  const avgScore = Math.round(
    (moralRighteousnessOverGainScore +
      sovereignPeaceCoexistenceIndex +
      courageousDevotionFortitudeScore +
      intellectualCultivationReadingIndex +
      sublimePatienceMagnanimousPeaceScore) /
      5,
  );
  const ahnJungGeunSynthesisMatrix = {
    dominantTension: `${activeAhnJungGeunTheme.themeTitleKo} ↔ ${focalAhnJungGeunAphorism.aphorismHanja}`,
    alignmentState: describeAhnJungGeunStage(avgScore),
    integratedAction: `${focalAhnJungGeunAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${focalAhnJungGeunAphorism.aphorismHanja}] ${focalAhnJungGeunAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: KOREAN_AHN_JUNG_GEUN_VERSION,
    calculatedAtKst,
    moralRighteousnessOverGainScore,
    sovereignPeaceCoexistenceIndex,
    courageousDevotionFortitudeScore,
    intellectualCultivationReadingIndex,
    sublimePatienceMagnanimousPeaceScore,
    activeAhnJungGeunTheme,
    focalAhnJungGeunAphorism,
    secondaryAhnJungGeunAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    ahnJungGeunComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    ahnJungGeunSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatKoreanAhnJungGeunPeaceRighteousnessPrompt(
  res: KoreanAhnJungGeunPeaceRighteousnessResult,
): string {
  const avgScore = Math.round(
    (res.moralRighteousnessOverGainScore +
      res.sovereignPeaceCoexistenceIndex +
      res.courageousDevotionFortitudeScore +
      res.intellectualCultivationReadingIndex +
      res.sublimePatienceMagnanimousPeaceScore) /
      5,
  );
  const lines = [
    `【안중근 의사 《동양평화론》 및 〈견리사의 견위수명〉 대의·평화 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 대의·평화 국면: ${describeAhnJungGeunStage(avgScore)}`,
    `- 핵심 안중근 의사 대의 테마: ${res.activeAhnJungGeunTheme.themeTitleKo} [${res.activeAhnJungGeunTheme.themeTitleEn}]`,
    `- 실천적 대의 통찰: ${res.activeAhnJungGeunTheme.pragmaticInsight}`,
    `- 선비의 행동 조언: ${res.activeAhnJungGeunTheme.practicalCounsel}`,
    `- 안중근 의사 불후의 유묵: "${res.focalAhnJungGeunAphorism.aphorismKo}" (${res.focalAhnJungGeunAphorism.aphorismHanja})`,
    `- 보조 교차 유묵: "${res.secondaryAhnJungGeunAphorism.aphorismKo}" (${res.secondaryAhnJungGeunAphorism.aphorismHanja})`,
    `- 원전 출처: [${res.focalAhnJungGeunAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalAhnJungGeunAphorism.actionGuidance}`,
    `- 종합 안중근 의사 대의 권면: ${res.ahnJungGeunComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.ahnJungGeunSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.ahnJungGeunSynthesisMatrix.dominantTension} | 조율 상태: ${res.ahnJungGeunSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.ahnJungGeunSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
