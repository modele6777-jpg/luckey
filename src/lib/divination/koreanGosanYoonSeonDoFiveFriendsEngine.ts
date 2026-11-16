/**
 * 대한민국 고산 윤선도(孤山 尹善道) 선생 《오우가(五友歌)》 수·석·송·죽·월 5우 청백지조 & 《어부사시사(漁父四時詞)》 사계절 순환 심미적 안빈낙도 지혜 엔진
 *
 * 조선 후기 국문학의 거장이자 선비 정신의 표상 고산 윤선도(孤山 尹善道, 1587~1671) 선생의 불후의 명작 원전 기반:
 * 1. 오우(수·석·송·죽·월) 청백지조 및 불변 신의 지수 (Five Friends Moral Integrity Index):
 *    - 물(水: 맑고 그치지 않음), 돌(石: 변치 않음), 소나무(松: 눈서리에도 푸름), 대나무(竹: 곧고 속을 비움), 달(月: 말없이 온 세상을 비춤)의 5대 벗을 통한 선비의 절개와 신의.
 * 2. 어부사시사 춘하추동 사계절 순환 심미적 평온도 (Four Seasons Aesthetic Equanimity Score):
 *    - 봄의 생기, 여름의 녹음, 가을의 맑은 달, 겨울의 백설 속에서 세속의 번뇌를 씻어내고 대자연의 리듬에 몸을 맡기는 안빈낙도의 평온.
 * 3. 속을 비우고 곧게 자라는 대나무의 허심(虛心) 겸양 지수 (Hollow Heart Humility & Flexibility Score):
 *    - 사시사철 푸르면서도 속을 비워(虛心) 어떤 강풍에도 꺾이지 않고 유연하게 일어서는 겸양과 강직함의 조화.
 * 4. 그치지 않고 밤낮으로 맑게 흐르는 지혜의 부단한 정진력 (Unceasing Flowing Wisdom & Diligence Index):
 *    - 구름처럼 흐려지거나 바람처럼 그치지 않고 밤낮으로 쉬지 않고 흘러 바다에 이르는 맑은 물과 같은 끊임없는 실천력.
 * 5. 보길도 세연정 유배와 시련 속에서도 자연과 합일한 초연한 회복탄력성 (Seyeonjeong Solitary Nature Resilience Score):
 *    - 당쟁과 유배의 험난한 풍파 앞에서도 자연의 품에서 시가를 읊으며 영혼을 치유한 고결한 풍류와 불굴의 회복탄력성.
 *
 * @version LUCKEY-GO-SAN-YOON-SEON-DO-FIVE-FRIENDS-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_GOSAN_YOON_SEON_DO_FIVE_FRIENDS_VERSION = 'LUCKEY-GO-SAN-YOON-SEON-DO-FIVE-FRIENDS-v2.1.0';

export interface YoonSeonDoTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface YoonSeonDoAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanGosanYoonSeonDoFiveFriendsResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 고산 윤선도 오우가·어부사시사 핵심 지표 (0~100)
  fiveFriendsIntegrityIndex: number;              // 오우(수석송죽월) 청백지조 신의 (Five Friends Integrity)
  fourSeasonsAestheticEquanimityScore: number;    // 어부사시사 사계절 심미적 평온 (Four Seasons Equanimity)
  bambooHollowHumilityScore: number;              // 대나무 허심(虛心) 겸양 유연성 (Hollow Heart Humility)
  waterUnceasingPurityIndex: number;              // 그치지 않고 맑게 흐르는 정진력 (Unceasing Pure Flow)
  seyeonjeongSolitaryResilienceScore: number;     // 세연정 자연합일 초연 회복탄력성 (Seyeonjeong Resilience)
  // 세부 분석
  activeYoonTheme: YoonSeonDoTheme;
  focalYoonAphorism: YoonSeonDoAphorism;
  secondaryYoonAphorism: YoonSeonDoAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  yoonComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  yoonSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatYoonKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeYoonStage(score: number): string {
  if (score >= 93) return '세연정(洗然亭) — 오우의 지조와 사계절의 흥취가 한 몸처럼 어우러진 초연한 풍류기';
  if (score >= 88) return '허심정진(虛心精進) — 대나무처럼 속을 비우고 물처럼 그치지 않고 흐르는 성숙기';
  return '오우상봉(五友相逢) — 수·석·송·죽·월 다섯 벗의 변치 않는 품격을 마음속에 세우는 정돈기';
}

export const YOON_SEON_DO_THEMES: YoonSeonDoTheme[] = [
  {
    themeKey: 'waterUnceasingFlow',
    themeTitleEn: 'Water (水): Pure, Clear, and Flowing Day and Night Without Ceasing',
    themeTitleKo: '물(水)의 벗 — 구름처럼 변덕 부리지 않고 밤낮으로 맑게 흐르는 끈기',
    pragmaticInsight: '구름은 빛이 좋으나 검기를 자주 하고, 바람은 소리 맑으나 그칠 때가 많습니다. 오직 맑으면서도 그치지 않고 밤낮으로 흐르는 것은 물뿐입니다. 변덕을 넘어선 꾸준함이 승리의 열쇠입니다.',
    practicalCounsel: '감정의 기복이나 일시적인 열정에 휘둘리지 마십시오. 맑은 물처럼 잡념을 비우고, 매일 한 걸음씩 묵묵히 본질을 향해 정진하십시오.',
  },
  {
    themeKey: 'rockUnyieldingConstancy',
    themeTitleEn: 'Rock (石): Unshakable Permanence Unmoved by Seasons',
    themeTitleKo: '바위(石)의 벗 — 꽃처럼 쉽게 피고 지지 않고 시련 속에서도 변치 않는 굳건함',
    pragmaticInsight: '꽃은 피면 이내 지고 풀은 푸르다 이내 누레집니다. 오직 비바람과 눈보라 속에서도 묵묵히 제자리를 지키는 것은 바위입니다. 진정한 신뢰는 상황이 어려울 때 변하지 않는 무게감에서 나옵니다.',
    practicalCounsel: '눈앞의 유행이나 남들의 평가에 일희일비하지 마십시오. 단단한 바위처럼 당신의 중심과 신념을 우뚝 세우고 흔들림 없이 자리를 지키십시오.',
  },
  {
    themeKey: 'pineEvergreenFidelity',
    themeTitleEn: 'Pine (松): Evergreen Integrity That Defies Frost and Snow',
    themeTitleKo: '소나무(松)의 벗 — 눈서리 속에서도 뿌리를 깊이 내리고 홀로 푸른 기개',
    pragmaticInsight: '더울 때 꽃 피고 잎 돋는 것은 누구나 할 수 있습니다. 찬 바람과 서리가 몰아칠 때 비로소 소나무가 푸른 줄을 알게 됩니다. 위기는 당신의 진짜 역량과 품격을 증명하는 무대입니다.',
    practicalCounsel: '역경이 닥쳤다고 하여 움츠러들지 마십시오. 찬 서리 속에서도 푸르름을 잃지 않는 소나무처럼, 당당하고 의연한 태도로 난관을 정면 돌파하십시오.',
  },
  {
    themeKey: 'bambooHollowStraightness',
    themeTitleEn: 'Bamboo (竹): Straight in Form, Hollow in Heart, Green in All Seasons',
    themeTitleKo: '대나무(竹)의 벗 — 곧으면서도 속을 비워(虛心) 부러지지 않는 유연한 겸손',
    pragmaticInsight: '나무도 아닌 것이 풀도 아닌 것이, 곧기는 뉘 시키며 속은 어찌 비었는가. 대나무는 속이 비었기에 유연하고, 마디가 있기에 높이 자라며, 푸르기에 사계절을 이겨냅니다.',
    practicalCounsel: '아집과 자만을 내려놓고 마음을 텅 비우십시오(虛心). 속을 비울 때 타인의 의견을 포용할 수 있고, 어떤 거센 폭풍에도 부러지지 않는 유연한 탄력성이 생깁니다.',
  },
  {
    themeKey: 'moonSilentIllumination',
    themeTitleEn: 'Moon (月): Silent Radiance Illuminating the Entire World with Quiet Grace',
    themeTitleKo: '달(月)의 벗 — 작은 것이 높이 떠서 말없이 온 세상을 비추는 침묵의 덕성',
    pragmaticInsight: '하늘 높이 뜬 달은 세상의 온갖 더러움과 번잡함을 탓하지 않고, 그저 고요히 빛을 비출 뿐 말이 없습니다. 진정한 리더십과 덕성은 요란한 주장보다 조용하고 따뜻한 선한 영향력입니다.',
    practicalCounsel: '말을 앞세워 상대를 설득하려 하지 마십시오. 묵묵히 자신의 역할을 다하고 빛을 비추는 달처럼, 차분한 태도와 진실한 행동으로 주위를 비추십시오.',
  },
];

export const YOON_SEON_DO_APHORISMS: YoonSeonDoAphorism[] = [
  {
    aphorismKey: 'fiveFriendsPraise',
    aphorismKo: '내 벗이 몇인가 하니 수석(水石)과 송죽(松竹)이라, 동산에 달 오르니 긔 더욱 반갑고야.',
    aphorismHanja: '吾友幾何 水石與松竹 月上東山 益自欣然',
    sourceContext: '윤선도 《오우가(五友歌)》 제1수',
    actionGuidance: '세속의 헛된 인맥과 겉치레에 연연하지 말고, 변치 않는 도의적 가치와 맑은 자연을 당신의 영혼의 벗으로 삼으십시오.',
  },
  {
    aphorismKey: 'waterNeverCeases',
    aphorismKo: '구름 빛이 좋다 하나 검기를 자주 한다. 바람 소리 맑다 하나 그칠 적이 하노매라. 좋고도 그칠 뉘 없기는 물뿐인가 하노라.',
    aphorismHanja: '雲彩雖佳 頻於變黑 風聲雖淸 止之時多 好而無止者 唯水而已',
    sourceContext: '윤선도 《오우가(五友歌)》 제2수',
    actionGuidance: '잠깐의 화려함보다 끊임없이 흘러가는 성실함을 택하십시오. 물처럼 쉬지 않고 맑게 흐를 때 필연적으로 큰 바다에 도달합니다.',
  },
  {
    aphorismKey: 'bambooHollowHeart',
    aphorismKo: '나무도 아닌 것이 풀도 아닌 것이, 곧기는 뉘 시키며 속은 어이 비었는다. 저러고 사시에 푸르니 그를 좋아하노라.',
    aphorismHanja: '非木非草 誰令其直 虛心自守 四時長靑',
    sourceContext: '윤선도 《오우가(五友歌)》 제5수',
    actionGuidance: '속을 비우고 곧은 절개를 지키십시오. 겸손한 마음과 뚜렷한 원칙이 함께할 때 어떤 시련에도 꺾이지 않습니다.',
  },
  {
    aphorismKey: 'fishermanFourSeasons',
    aphorismKo: '지국총 지국총 어사와, 굽어보면 천심녹수(千尋綠水) 돌아보면 만첩청산(萬疊靑山), 세속의 붉은 먼지 얼마나 가렸는가.',
    aphorismHanja: '至菊叢 俯看千尋綠水 顧見萬疊靑山 紅塵蔽幾何',
    sourceContext: '윤선도 《어부사시사(漁父四時詞)》 추사(秋詞)',
    actionGuidance: '세속의 번뇌와 소음을 잠시 내려놓고 자연 속으로 물러나십시오. 맑은 마음으로 세상을 돌아볼 때 본질이 뚜렷해집니다.',
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

export function calculateKoreanGosanYoonSeonDoFiveFriends(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanGosanYoonSeonDoFiveFriendsResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `YOON-SEON-DO-FIVE-FRIENDS:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const fiveFriendsIntegrityIndex = 86 + ((absHash >> 1) % 13);
  const fourSeasonsAestheticEquanimityScore = 84 + ((absHash >> 4) % 15);
  const bambooHollowHumilityScore = 85 + ((absHash >> 7) % 14);
  const waterUnceasingPurityIndex = 87 + ((absHash >> 10) % 12);
  const seyeonjeongSolitaryResilienceScore = 83 + ((absHash >> 13) % 16);

  const themeIndex = (absHash >> 5) % YOON_SEON_DO_THEMES.length;
  const aphorismIndex = (absHash >> 8) % YOON_SEON_DO_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (YOON_SEON_DO_APHORISMS.length - 1))) % YOON_SEON_DO_APHORISMS.length;

  const activeYoonTheme = YOON_SEON_DO_THEMES[themeIndex];
  const focalYoonAphorism = YOON_SEON_DO_APHORISMS[aphorismIndex];
  const secondaryYoonAphorism = YOON_SEON_DO_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}' 앞에서 속을 비운 대나무의 허심(虛心)과 그치지 않는 물의 끈기 가운데 지금 더 필요한 태도는 무엇인가요?`
    : `세속의 소음 속에서 수·석·송·죽·월 다섯 벗처럼 흔들리지 않고 지켜 낼 나만의 청백한 중심은 무엇인가요?`;
  const interpretiveBoundary = '고산 윤선도 오우가·어부사시사 관점은 길흉 예단이 아니라, 변치 않는 신의와 허심의 평온을 비추는 선비 성찰 렌즈입니다.';

  const guidanceTitle = `고산 윤선도 오우가·어부사시사 지혜: ${activeYoonTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 국문학의 최고봉 고산 윤선도 선생은 《오우가(五友歌)》를 통해 수·석·송·죽·월의 불변하는 지조와 청백함을 노래하고, ` +
    `《어부사시사》를 통해 사계절의 자연 순환 속에서 안빈낙도하는 선비의 고결한 평온을 보여주었습니다. ` +
    `현재 당신의 흐름에 가장 큰 힘과 안식을 주는 벗의 덕성은 '${activeYoonTheme.themeTitleKo}'입니다. ` +
    `${activeYoonTheme.practicalCounsel} 고산 선생의 불후의 시조 "${focalYoonAphorism.aphorismKo}"의 깊은 울림을 되새기며, ` +
    `${focalYoonAphorism.actionGuidance}`;

  const calculatedAtKst = formatYoonKstTimestamp(now);
  const avgScore = Math.round(
    (fiveFriendsIntegrityIndex +
      fourSeasonsAestheticEquanimityScore +
      bambooHollowHumilityScore +
      waterUnceasingPurityIndex +
      seyeonjeongSolitaryResilienceScore) /
      5,
  );
  const yoonSynthesisMatrix = {
    dominantTension: `${activeYoonTheme.themeTitleKo} ↔ ${focalYoonAphorism.sourceContext}`,
    alignmentState: describeYoonStage(avgScore),
    integratedAction: `${focalYoonAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_GOSAN_YOON_SEON_DO_FIVE_FRIENDS_VERSION,
    calculatedAtKst,
    fiveFriendsIntegrityIndex,
    fourSeasonsAestheticEquanimityScore,
    bambooHollowHumilityScore,
    waterUnceasingPurityIndex,
    seyeonjeongSolitaryResilienceScore,
    activeYoonTheme,
    focalYoonAphorism,
    secondaryYoonAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    yoonComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    yoonSynthesisMatrix,
  };
}

export function formatKoreanGosanYoonSeonDoFiveFriendsPrompt(
  res: KoreanGosanYoonSeonDoFiveFriendsResult,
): string {
  const avgScore = Math.round(
    (res.fiveFriendsIntegrityIndex +
      res.fourSeasonsAestheticEquanimityScore +
      res.bambooHollowHumilityScore +
      res.waterUnceasingPurityIndex +
      res.seyeonjeongSolitaryResilienceScore) /
      5,
  );
  const lines = [
    `【고산 윤선도 《오우가》 수석송죽월 5우 지조 및 《어부사시사》 심미적 안빈낙도 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 오우·어부사시사 국면: ${describeYoonStage(avgScore)}`,
    `- 핵심 윤선도 테마: ${res.activeYoonTheme.themeTitleKo} [${res.activeYoonTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeYoonTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeYoonTheme.practicalCounsel}`,
    `- 윤선도 원전 시가: "${res.focalYoonAphorism.aphorismKo}"`,
    `- 보조 교차 시가: "${res.secondaryYoonAphorism.aphorismKo}" [${res.secondaryYoonAphorism.sourceContext}]`,
    `- 원전 출처: [${res.focalYoonAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalYoonAphorism.actionGuidance}`,
    `- 종합 윤선도 권면: ${res.yoonComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.yoonSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.yoonSynthesisMatrix.dominantTension} | 조율 상태: ${res.yoonSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.yoonSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
