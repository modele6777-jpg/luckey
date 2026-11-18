/**
 * 한국 동학 수운 최제우(水雲 崔濟愚) 선생 《동경대전(東經대전)》 시천주(侍天主) & 사인여천(事人如天) 내면 영성 존엄 및 후천개벽(後天開闢) 엔진
 *
 * 동학(東學)의 창도자이자 민족 영성 개벽의 스승 수운 최제우(1824~1864) 선생의 불멸의 원전 《동경대전(東經대전)》 및 〈용담유사(龍潭遺詞)〉 기반:
 * 1. 시천주(侍天主): 내 안에 이미 하늘님(우주적 근원 생명)을 모시고 있다는 지극한 자존감과 만물 영성의 평등성.
 * 2. 사인여천(事人如天) / 인내천(人乃天): "사람 섬기기를 하늘 섬기듯 하라"는 인류 최고의 인간 존엄성 및 상생 연대의 도덕.
 * 3. 오심즉여심(吾心卽汝心): "내 마음이 곧 네 마음이다"라는 하늘과 인간, 너와 나 사이의 분별없는 동체대비 일체감응력.
 * 4. 수심정기(守心正氣): 맑은 마음을 오롯이 지키고 바른 기운을 길러 세속의 혼탁함과 두려움을 물리치는 내적 평정심.
 * 5. 후천개벽(後天開闢): 낡은 불평등과 절망의 시대를 넘어서서 새로운 빛과 상생의 새 세상을 여는 과감한 실천적 대전환력.
 *
 * @version LUCKEY-SUUN-CHOE-JEU-DONGHAK-v2.2.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_SUUN_CHOE_JEU_VERSION = 'LUCKEY-SUUN-CHOE-JEU-DONGHAK-v2.2.0';

export interface DonghakTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  spiritualInsight: string;
  practicalCounsel: string;
}

export interface DonghakAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface SuunChoeJeuDonghakSicheonjuResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 동학 영성·개벽 지표 (0~100)
  sicheonjuDignityScore: number;           // 시천주(侍天主) 내면 영성 자존감
  sainyeocheonReverenceQuotient: number;   // 사인여천(事人如天) 타인 공경·연대도
  osimJeukYeosimEmpathyScore: number;      // 오심즉여심(吾心卽汝心) 일체감응 공감력
  susimJeonggiEquanimityScore: number;     // 수심정기(守心正氣) 심신 정화 평정성
  hucheonGaebyeokPioneerScore: number;     // 후천개벽(後天開闢) 시대전환 개척력
  // 세부 분석
  activeDonghakTheme: DonghakTheme;
  secondaryDonghakTheme: DonghakTheme;
  focalDonghakAphorism: DonghakAphorism;
  secondaryDonghakAphorism: DonghakAphorism;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  suunComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  donghakSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatDonghakKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeDonghakStage(score: number): string {
  if (score >= 90) return '후천개벽(後天開闢) — 내면의 시천주 존엄과 상생 연대가 낡은 틀을 여는 도약기';
  if (score >= 80) return '수심정기(守心正氣) — 흔들리는 세속 속에서도 맑은 마음과 바른 기운을 지키는 성숙기';
  return '오심즉여심(吾心卽汝心) — 내 마음과 이웃의 마음을 하나로 비추며 초심을 세우는 준비기';
}

export const DONGHAK_THEMES: DonghakTheme[] = [
  {
    themeKey: 'si_cheon_ju',
    themeTitleHanja: '侍天主 (시천주 - 한울님을 모심)',
    themeTitleKo: '내 안에 우주적 신성이 깃들어 있음을 자각하는 절대적 존엄',
    spiritualInsight: '인간은 외부의 권위나 계급에 예속된 존재가 아니라, 누구나 가슴속에 우주의 영원한 생명을 온전히 모시고 있는 존귀한 하늘입니다.',
    practicalCounsel: '스스로를 과소평가하거나 비하하지 마십시오. 당신 내면에 이미 우주를 움직이는 거룩한 본성이 깃들어 있음을 믿고 당당하게 걸어가십시오.',
  },
  {
    themeKey: 'sa_in_yeo_cheon',
    themeTitleHanja: '事人如天 (사인여천 - 사람을 하늘처럼 섬김)',
    themeTitleKo: '마주하는 모든 사람을 하늘처럼 공경하고 차별 없이 대함',
    spiritualInsight: '남을 무시하고 억압하는 것은 곧 스스로 모신 하늘을 짓밟는 것입니다. 모든 사람을 하늘처럼 섬길 때 비로소 진정한 평화와 화합이 열립니다.',
    practicalCounsel: '지위나 조건에 관계없이 만나는 모든 이를 지극한 예와 진심으로 대하십시오. 상대방을 귀하게 여기는 태도가 당신에게 가장 큰 복을 부릅니다.',
  },
  {
    themeKey: 'o_sim_jeuk_yeo_sim',
    themeTitleHanja: '吾心卽汝心 (오심즉여심 - 내 마음이 곧 네 마음)',
    themeTitleKo: '너와 나의 분별을 허물고 깊은 고통과 기쁨을 온전히 공감함',
    spiritualInsight: '하늘의 마음은 멀리 있지 않고 바로 타인의 가슴속에 있습니다. 상대의 슬픔을 내 슬픔으로 느끼는 지극한 연민이 막힌 담을 허뭅니다.',
    practicalCounsel: '나의 입장만을 고집하는 아집을 내려놓으십시오. 상대방의 시선에서 세상을 바라보고 그의 아픔에 진심으로 귀를 기울일 때 막힌 매듭이 풀립니다.',
  },
  {
    themeKey: 'su_sim_jeong_gi',
    themeTitleHanja: '守心正氣 (수심정기 - 마음을 지키고 기운을 바르게 함)',
    themeTitleKo: '욕망의 흔들림을 잠재우고 맑고 강직한 생명 기운을 기름',
    spiritualInsight: '세상이 어지러울수록 외부의 소음에 마음을 빼앗기지 말고, 고요히 중심을 지키며 우주와 합일하는 바른 기운을 길러야 합니다.',
    practicalCounsel: '조급함과 분노가 치밀 때 심호흡을 하며 내면을 정돈하십시오. 잡념을 털어내고 기운을 단련하여 어떤 역경에도 흔들리지 않는 평정심을 유지하십시오.',
  },
  {
    themeKey: 'hu_cheon_gae_byeok',
    themeTitleHanja: '後天開闢 (후천개벽 - 새 세상을 활짝 엶)',
    themeTitleKo: '낡은 틀과 고정관념을 부수고 상생과 희망의 새 길을 창조함',
    spiritualInsight: '어둠이 깊을수록 새벽은 가깝습니다. 과거의 실패와 모순에 얽매이지 않고, 새로운 의식과 실천으로 삶과 공동체의 대전환을 이루어야 합니다.',
    practicalCounsel: '익숙했던 낡은 습관과 무기력을 과감히 털어내십시오. 당신의 삶에서 새로운 챕터를 열어젖히는 용기 있는 결단과 개척적 행동을 개시하십시오.',
  },
];

export const DONGHAK_APHORISMS: DonghakAphorism[] = [
  {
    aphorismKey: 'si_cheon_ju_joman',
    aphorismKo: '내 안에 신령함이 있고 밖으로 기운이 감응하니, 온 세상 사람이 각각 알지 못할 뿐이로다.',
    aphorismHanja: '侍者 內有神靈 外有氣化 一世之人 各知不移 (시자 내유신령 외유기화 일세지인 각지불이)',
    sourceContext: '《동경대전》 〈논학문〉',
    actionGuidance: '당신의 내면 깊은 곳에 깃든 영적 지혜와 잠재력을 신뢰하고, 외부 세계와의 조화로운 소통을 실천하십시오.',
  },
  {
    aphorismKey: 'dong_kyeong_hwa_soon',
    aphorismKo: '바른 마음을 지키고 바른 기운을 닦으면, 만사가 절로 순리대로 풀려나갈 것이니라.',
    aphorismHanja: '守其純 養其正 自然化成 (수기순 양기정 자연화성)',
    sourceContext: '《동경대전》 〈수덕문〉',
    actionGuidance: '꼼수나 요행을 바라지 말고 오직 성실과 순수한 초심으로 문제를 마주하십시오. 본질이 바로 서면 결과는 저절로 따라옵니다.',
  },
  {
    aphorismKey: 'yong_dam_gae_woon',
    aphorismKo: '만세에 하나뿐인 좋은 시절을 만났으니, 마음을 크게 먹고 큰 길을 당당히 걸어라.',
    aphorismHanja: '萬世一之 此時運 浩然大志 行正道 (만세일지 차시운 호연대지 행정도)',
    sourceContext: '〈용담유사〉 〈용담가〉',
    actionGuidance: '위축되지 말고 가슴을 활짝 펴십시오. 지금이 바로 당신의 삶을 바꿀 결정적 때임을 자각하고 대범하게 나아가십시오.',
  },
  {
    aphorismKey: 'dong_kwi_il_che',
    aphorismKo: '하늘과 땅과 사람이 한마음으로 어우러져, 모든 생명이 저마다의 존엄을 누리게 하라.',
    aphorismHanja: '同歸一體 接化群生 (동귀일체 접화군생)',
    sourceContext: '《동경대전》 〈포덕문〉',
    actionGuidance: '경쟁과 배제를 멈추고 모두가 함께 살고 성장하는 상생의 길을 모색하십시오.',
  },
  {
    aphorismKey: 'an_sim_jeong_myeong',
    aphorismKo: '두려워하지 말고 의심하지 말라. 도는 지극히 가깝고도 밝은 내 마음에 있느니라.',
    aphorismHanja: '勿懼勿疑 道不遠人 (물구물의 도불원인)',
    sourceContext: '《동경대전》 〈교훈가〉',
    actionGuidance: '미래에 대한 불안과 회의를 떨쳐버리십시오. 당신의 정직한 양심과 내적 확신이 가장 정확한 나침반입니다.',
  },
];

export function calculateSuunChoeJeuDonghakSicheonju(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): SuunChoeJeuDonghakSicheonjuResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `SUUN-CHOE-JEU-DONGHAK:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const sicheonjuDignityScore = 74 + (absHash % 25);
  const sainyeocheonReverenceQuotient = 71 + ((absHash >> 3) % 28);
  const osimJeukYeosimEmpathyScore = 70 + ((absHash >> 6) % 29);
  const susimJeonggiEquanimityScore = 72 + ((absHash >> 9) % 27);
  const hucheonGaebyeokPioneerScore = 69 + ((absHash >> 12) % 30);

  const themeIndex = (absHash >> 4) % DONGHAK_THEMES.length;
  const secondaryThemeIndex = (themeIndex + 1 + ((absHash >> 6) % (DONGHAK_THEMES.length - 1))) % DONGHAK_THEMES.length;
  const aphorismIndex = (absHash >> 7) % DONGHAK_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (DONGHAK_APHORISMS.length - 1))) % DONGHAK_APHORISMS.length;

  const activeDonghakTheme = DONGHAK_THEMES[themeIndex];
  const secondaryDonghakTheme = DONGHAK_THEMES[secondaryThemeIndex];
  const focalDonghakAphorism = DONGHAK_APHORISMS[aphorismIndex];
  const secondaryDonghakAphorism = DONGHAK_APHORISMS[secondaryAphorismIndex];

  const trimmedQuery = query?.trim();
  const ritualAction = `[${activeDonghakTheme.themeTitleHanja.split(' ')[0]}] ${focalDonghakAphorism.actionGuidance}`;
  const reflectiveQuestion = trimmedQuery
    ? `동학의 '${activeDonghakTheme.themeTitleKo}'와 '${secondaryDonghakTheme.themeTitleKo}'를 비추어 볼 때, "${trimmedQuery}"에서 스스로와 타인의 존엄을 함께 세우는 수심정기(守心正氣)의 선택은 무엇인가요?`
    : `지금 삶의 전환점 앞에서, '${activeDonghakTheme.themeTitleKo}'의 자각과 '${secondaryDonghakTheme.themeTitleKo}'의 상생을 함께 열기 위해 오늘 내가 먼저 바꿀 태도는 무엇일까요?`;
  const reflectionFocus = reflectiveQuestion;

  const interpretiveBoundary = '이 지표는 수운 최제우 선생의 《동경대전》·〈용담유사〉에 담긴 시천주·사인여천·수심정기·후천개벽 사상을 내면 존엄과 관계 태도를 성찰하는 정성적 영성 틀로 해석한 것이며, 현실의 구체적 성패를 단정하는 확정 예언이 아닙니다.';

  const guidanceTitle = `수운 최제우 동학 시천주·개벽 지혜: ${activeDonghakTheme.themeTitleKo}`;
  const philosophicalCounsel = `수운 최제우 선생의 동학 영성은 내 안에 모신 하늘님의 존엄을 깨닫고, 사람을 하늘처럼 섬기며 새 세상을 열도록 촉구합니다. ` +
    `현재 당신의 삶에서 가장 핵심적인 개벽의 과제는 '${activeDonghakTheme.themeTitleKo}'입니다. ` +
    `${activeDonghakTheme.practicalCounsel} 아울러 동학의 경구 "${focalDonghakAphorism.aphorismKo}"(${focalDonghakAphorism.aphorismHanja})을 가슴 깊이 간직하며, ` +
    `${focalDonghakAphorism.actionGuidance}`;

  const calculatedAtKst = formatDonghakKstTimestamp(now);
  const avgScore = Math.round(
    (sicheonjuDignityScore +
      sainyeocheonReverenceQuotient +
      osimJeukYeosimEmpathyScore +
      susimJeonggiEquanimityScore +
      hucheonGaebyeokPioneerScore) /
      5,
  );
  const donghakSynthesisMatrix = {
    dominantTension: `${activeDonghakTheme.themeTitleKo} ↔ ${focalDonghakAphorism.sourceContext}`,
    alignmentState: describeDonghakStage(avgScore),
    integratedAction: `${focalDonghakAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_SUUN_CHOE_JEU_VERSION,
    calculatedAtKst,
    sicheonjuDignityScore,
    sainyeocheonReverenceQuotient,
    osimJeukYeosimEmpathyScore,
    susimJeonggiEquanimityScore,
    hucheonGaebyeokPioneerScore,
    activeDonghakTheme,
    secondaryDonghakTheme,
    focalDonghakAphorism,
    secondaryDonghakAphorism,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    suunComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    donghakSynthesisMatrix,
  };
}

export function formatSuunChoeJeuDonghakSicheonjuPrompt(res: SuunChoeJeuDonghakSicheonjuResult): string {
  const avgScore = Math.round(
    (res.sicheonjuDignityScore +
      res.sainyeocheonReverenceQuotient +
      res.osimJeukYeosimEmpathyScore +
      res.susimJeonggiEquanimityScore +
      res.hucheonGaebyeokPioneerScore) /
      5,
  );
  const lines = [
    `【수운 최제우 《동경대전》 시천주 & 사인여천 영성 존엄 및 후천개벽 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 동학 개벽 국면: ${describeDonghakStage(avgScore)}`,
    `- 핵심 동학 테마: ${res.activeDonghakTheme.themeTitleKo} [${res.activeDonghakTheme.themeTitleHanja}]`,
    `- 보조 교차 테마: ${res.secondaryDonghakTheme.themeTitleKo} [${res.secondaryDonghakTheme.themeTitleHanja}]`,
    `- 영성적 통찰: ${res.activeDonghakTheme.spiritualInsight}`,
    `- 실천적 조언: ${res.activeDonghakTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalDonghakAphorism.aphorismKo}"`,
    `- 보조 교차 경구: "${res.secondaryDonghakAphorism.aphorismKo}"`,
    `- 한자 원문: "${res.focalDonghakAphorism.aphorismHanja}" [${res.focalDonghakAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDonghakAphorism.actionGuidance}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 영성 권면: ${res.suunComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.donghakSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.donghakSynthesisMatrix.dominantTension} | 조율 상태: ${res.donghakSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.donghakSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
