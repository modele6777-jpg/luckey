/**
 * 대한민국 백석(白石) 시인 《사슴》 & 《흰 바람벽이 있어》 가난하고 외롭고 높고 쓸쓸한 순수 고결성 & 토속적 생명력·영혼의 맑은 존엄 지혜 엔진
 *
 * 20세기 한국 현대 서정시의 독보적 봉우리 백석(白石, 1912~1996) 시인의 원전 기반:
 * 1. 가난하고 외롭고 높고 쓸쓸함을 귀하게 껴안는 영혼의 맑은 고결성 지수 (Noble Solitude & Soul Purity Score): 결핍과 고독의 비바람 속에서도 세속의 탁류에 타협하지 않고 맑고 높은 영혼의 품격을 지켜내는 순수성.
 * 2. 토속적 정감과 소박한 사람들을 향한 따스한 연대감 지표 (Folk Warmth & Community Affinity Index): 고향의 투박한 음식과 정겨운 사투리, 가난하지만 따스한 이웃들의 온기를 향한 지극한 애정.
 * 3. 세상의 탁류에 물들지 않고 내면의 결을 지켜내는 시적 지조도 (Unyielding Poetic Integrity & Dignity Score): 산골로 들어가는 것은 세상에 지는 것이 아니라 더러운 타협을 거부하는 것이라는 단호한 자존감.
 * 4. 좁은 방 흰 바람벽에 글자를 띄우듯 삶을 응시하는 심층 자아성찰도 (White Wall Contemplation & Deep Self-Reflection Index): 차가운 방안에서 자신과 운명을 조용히 반추하며 사랑과 슬픔의 무게를 오롯이 감당하는 성찰의 깊이.
 * 5. 눈 내리는 밤 나타샤와 흰 당나귀를 타고 가듯 초연한 심신 회복탄력성 (Serene Steadfast Acceptance & Poetic Resilience Score): 막막한 현실 앞에서도 고조곤히 내면의 순수한 이상을 품고 눈길을 묵묵히 걸어가는 초연한 서정적 평정심.
 *
 * @version LUCKEY-BAEK-SEOK-DEER-WHITE-WALL-POETIC-PURITY-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_BAEK_SEOK_DEER_WHITE_WALL_POETIC_PURITY_VERSION = 'LUCKEY-BAEK-SEOK-DEER-WHITE-WALL-POETIC-PURITY-v2.3.0';

export interface BaekSeokTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface BaekSeokAphorism {
  aphorismKey: string;
  aphorismKo: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanBaekSeokDeerWhiteWallPoeticPurityResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 백석 핵심 지표 (0~100)
  nobleSolitudePurityScore: number;                // 영혼의 맑은 고결성 지수 (Noble Solitude & Soul Purity)
  folkWarmthCommunityAffinityIndex: number;        // 토속적 정감 및 공동체 친화성 (Folk Warmth & Community Affinity)
  unyieldingPoeticIntegrityScore: number;          // 시적 지조 및 자존감 유지도 (Unyielding Poetic Integrity & Dignity)
  transcendentWhiteWallReflectionIndex: number;    // 흰 바람벽 심층 자아성찰도 (White Wall Contemplation & Self-Reflection)
  sereneSteadfastResilienceScore: number;          // 눈길 위의 초연한 회복탄력성 (Serene Steadfast Poetic Resilience)
  // 세부 분석
  activeBaekSeokTheme: BaekSeokTheme;
  focalBaekSeokAphorism: BaekSeokAphorism;
  secondaryBaekSeokAphorism: BaekSeokAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  baekSeokComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  baekSeokSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatBaekSeokKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeBaekSeokStage(score: number): string {
  if (score >= 95) return '흰 바람벽의 고요(白壁觀照) — 외로움과 쓸쓸함마저 맑은 영혼의 빛으로 승화되는 순수의 정점';
  if (score >= 91) return '눈길 위의 당나귀(雪路超然) — 세속의 소란과 거리를 두고 내면의 지조를 지키는 담담한 국면';
  return '토속의 온기(土俗溫情) — 소박한 일상의 정과 맑은 양심의 피를 가만히 보듬는 시기';
}

export const BAEK_SEOK_THEMES: BaekSeokTheme[] = [
  {
    themeKey: 'nobleSolitude',
    themeTitleEn: 'Noble Solitude: Embracing Loneliness with Pure Grace and Lofty Dignity',
    themeTitleKo: '높고 쓸쓸한 영혼의 존엄 — 외로움과 결핍 속에서도 비굴해지지 않고 맑은 품격 지키기',
    pragmaticInsight: '백석 시인은 가난하고 외롭고 높고 쓸쓸한 삶을 불행의 저주가 아니라, 하늘이 가장 귀하게 여기고 사랑하는 존재들에게 내린 거룩한 숙명으로 받아들였습니다. 고독은 영혼의 군더더기를 털어내고 가장 맑은 결을 드러내는 순례의 길입니다.',
    practicalCounsel: '혼자라는 고립감이나 세상의 무관심에 위축되지 마십시오. 당신의 외로움은 당신이 남들보다 더 깊은 감수성과 높은 영혼의 잣대를 품고 있다는 증거입니다. 당당한 기품으로 홀로 선 자리를 밝히십시오.',
  },
  {
    themeKey: 'whiteWallContemplation',
    themeTitleEn: 'Contemplation on the White Wall: Reflecting on Destiny with Honest Stillness',
    themeTitleKo: '흰 바람벽의 자아성찰 — 텅 빈 벽을 마주하듯 번잡한 욕망을 내려놓고 고요히 나를 비추기',
    pragmaticInsight: '달디단 따스한 방이 아닌 쓸쓸한 여관방 흰 바람벽에 글자들이 스쳐 지나가듯, 백석은 고요 속에서 가난한 부모와 사랑하는 이를 떠올리며 자신의 운명과 화해합니다. 고요한 관조는 마음의 소란을 잠재우고 내면의 진실을 대면하게 합니다.',
    practicalCounsel: '자극적인 소음과 끝없는 비교에서 벗어나 조용한 침묵의 시간을 마련하십시오. 텅 빈 마음에 떠오르는 진솔한 감정들을 가만히 응시하십시오. 담담한 인정 속에서 참된 평화가 피어납니다.',
  },
  {
    themeKey: 'folkHeartWarmth',
    themeTitleEn: 'Warmth of the Earth: Cherishing Humble Neighbors and Everyday Warmth',
    themeTitleKo: '토속의 온기와 연대 — 투박하고 소박한 일상의 음식과 이웃의 정을 따뜻하게 품기',
    pragmaticInsight: '백석의 시에는 메밀국수, 여우난골족, 가재미 등 고향의 흙냄새와 소박한 사람들의 살가운 온정이 가득합니다. 거창한 권력이나 부유함보다, 평범한 일상을 나누는 따뜻한 연대야말로 험한 세상을 버티게 하는 가장 큰 힘입니다.',
    practicalCounsel: '성공과 효율에 쫓기느라 곁에 있는 소중한 사람들의 온기를 놓치지 마십시오. 오늘 소박한 밥 한 끼를 따뜻하게 나누고, 다정한 안부 한마디를 건네십시오. 그 소박한 정감이 영혼의 든든한 닻이 됩니다.',
  },
  {
    themeKey: 'pureLoveNatasha',
    themeTitleEn: 'The White Donkey in the Snow: Transcending Worldly Dirt Toward Pure Ideals',
    themeTitleKo: '눈 내리는 밤의 초연한 사랑 — 세속의 계산과 소음을 뒤로하고 순수한 신념 향해 걷기',
    pragmaticInsight: '“산골로 가는 것은 세상한테 지는 것이 아니다. 세상 같은 건 더러워 버리는 것이다.” 백석은 눈 푹푹 나리는 밤 흰 당나귀를 타고 나타샤와 함께 산골로 가듯, 세속의 비루한 타협을 초월하여 영혼의 맑은 고결성을 선택했습니다.',
    practicalCounsel: '눈앞의 이익이나 세상의 평판에 흔들려 당신의 소중한 신념을 헐값에 넘기지 마십시오. 때로는 세속의 소음을 초연히 등지고 당신만의 순수한 길을 묵묵히 걸어가는 용기가 가장 위대한 승리를 가져옵니다.',
  },
];

export const BAEK_SEOK_APHORISMS: BaekSeokAphorism[] = [
  {
    aphorismKey: 'nobleAndLonely',
    aphorismKo: '하늘이 이 세상을 내일 적에 그가 가장 귀해하고 사랑하는 것들은 모두 가난하고 외롭고 높고 쓸쓸하니 그리고 언제나 넘치는 사랑과 슬픔 속에 살도록 만드신 것이다.',
    sourceContext: '백석 시 《흰 바람벽이 있어》',
    actionGuidance: '지금 겪고 있는 쓸쓸함과 슬픔을 원망하지 마십시오. 그것은 당신이 하늘의 귀한 사랑을 받으며 깊은 영혼으로 빚어지고 있다는 증표입니다.',
  },
  {
    aphorismKey: 'snowAndNatasha',
    aphorismKo: '눈은 푹푹 나리고 나는 나타샤를 생각하고 나타샤가 아니 올 리 없다 언제벌써 내 속에 고조곤히 와 있는 것이다.',
    sourceContext: '백석 시 《나와 나타샤와 흰 당나귀》',
    actionGuidance: '상황이 아무리 춥고 막막할지라도 마음속 순수한 희망과 사랑의 온도를 잃지 마십시오. 진정으로 귀한 것은 이미 당신 내면에 깃들어 있습니다.',
  },
  {
    aphorismKey: 'cleanBloodAncestors',
    aphorismKo: '외롭기로 말하면 내 맘같이 외로운 것이 또 어디 있을까 그러나 나에게는 가난한 조상이 물려준 맑은 피가 흐르고 있다.',
    sourceContext: '백석 시 《남신의주 유동 박시봉방》',
    actionGuidance: '물질적 부족함이나 억울함에 자존감을 잃지 마십시오. 당신의 영혼에 흐르는 정직하고 맑은 양심의 자부심을 단단히 붙드십시오.',
  },
  {
    aphorismKey: 'mountainVillageTranscending',
    aphorismKo: '산골로 가는 것은 세상한테 지는 것이 아니다. 세상 같은 건 더러워 버리는 것이다.',
    sourceContext: '백석 시 《나와 나타샤와 흰 당나귀》',
    actionGuidance: '세속의 비열한 계산과 타협에 휩쓸리지 마십시오. 당신의 순수한 가치를 지키기 위해 결단력 있게 거리를 두는 것은 패배가 아니라 고결한 자유입니다.',
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

export function calculateKoreanBaekSeokDeerWhiteWallPoeticPurity(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanBaekSeokDeerWhiteWallPoeticPurityResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `BAEK-SEOK-DEER-WHITE-WALL-POETIC-PURITY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const nobleSolitudePurityScore = 89 + ((absHash >> 1) % 10);
  const folkWarmthCommunityAffinityIndex = 88 + ((absHash >> 4) % 11);
  const unyieldingPoeticIntegrityScore = 87 + ((absHash >> 7) % 12);
  const transcendentWhiteWallReflectionIndex = 89 + ((absHash >> 10) % 10);
  const sereneSteadfastResilienceScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % BAEK_SEOK_THEMES.length;
  const aphorismIndex = (absHash >> 8) % BAEK_SEOK_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (BAEK_SEOK_APHORISMS.length - 1))) % BAEK_SEOK_APHORISMS.length;

  const activeBaekSeokTheme = BAEK_SEOK_THEMES[themeIndex];
  const focalBaekSeokAphorism = BAEK_SEOK_APHORISMS[aphorismIndex];
  const secondaryBaekSeokAphorism = BAEK_SEOK_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 세속의 소란과 비교를 잠시 내려놓고 흰 바람벽 앞에 마주 선 듯 솔직히 보듬고 싶은 내 마음은 무엇인가요?`
    : `지금 내 하루에서 외로움이나 쓸쓸함마저 맑은 품격으로 지켜 내며 따뜻하게 안아 주고 싶은 소박한 온기는 무엇인가요?`;
  const interpretiveBoundary = '백석 사슴·흰 바람벽 관점은 길흉 예단이 아니라, 고독 속의 맑은 존엄과 서정적 회복탄력성을 비추는 문학 성찰 렌즈입니다.';

  const guidanceTitle = `백석 시인 순수 고결성과 맑은 존엄의 지혜: ${activeBaekSeokTheme.themeTitleKo}`;
  const philosophicalCounsel = `한국 현대 서정시의 위대한 거장 백석 시인은 《사슴》과 《흰 바람벽이 있어》, 《나와 나타샤와 흰 당나귀》를 통해 ` +
    `가난하고 외롭고 높고 쓸쓸한 시련 속에서도 훼손되지 않는 영혼의 맑은 고결성, 소박한 이웃과 토속적 온기를 보듬는 연대감, ` +
    `그리고 세속의 더러운 타협을 초연히 거부하며 흰 눈길을 묵묵히 걸어가는 단호한 시적 지조를 노래했습니다. ` +
    `현재 당신이 마주한 상황에서 가장 아름다운 영혼의 길잡이는 '${activeBaekSeokTheme.themeTitleKo}'입니다. ` +
    `${activeBaekSeokTheme.practicalCounsel} 백석 시인의 명구 "${focalBaekSeokAphorism.aphorismKo}"을 가슴에 품고, ` +
    `${focalBaekSeokAphorism.actionGuidance}`;

  const calculatedAtKst = formatBaekSeokKstTimestamp(now);
  const avgScore = Math.round(
    (nobleSolitudePurityScore +
      folkWarmthCommunityAffinityIndex +
      unyieldingPoeticIntegrityScore +
      transcendentWhiteWallReflectionIndex +
      sereneSteadfastResilienceScore) /
      5,
  );
  const baekSeokSynthesisMatrix = {
    dominantTension: `${activeBaekSeokTheme.themeTitleKo} ↔ ${focalBaekSeokAphorism.sourceContext}`,
    alignmentState: describeBaekSeokStage(avgScore),
    integratedAction: `${focalBaekSeokAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${focalBaekSeokAphorism.sourceContext}] ${focalBaekSeokAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: KOREAN_BAEK_SEOK_DEER_WHITE_WALL_POETIC_PURITY_VERSION,
    calculatedAtKst,
    nobleSolitudePurityScore,
    folkWarmthCommunityAffinityIndex,
    unyieldingPoeticIntegrityScore,
    transcendentWhiteWallReflectionIndex,
    sereneSteadfastResilienceScore,
    activeBaekSeokTheme,
    focalBaekSeokAphorism,
    secondaryBaekSeokAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    baekSeokComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    baekSeokSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatKoreanBaekSeokDeerWhiteWallPoeticPurityPrompt(
  res: KoreanBaekSeokDeerWhiteWallPoeticPurityResult,
): string {
  const avgScore = Math.round(
    (res.nobleSolitudePurityScore +
      res.folkWarmthCommunityAffinityIndex +
      res.unyieldingPoeticIntegrityScore +
      res.transcendentWhiteWallReflectionIndex +
      res.sereneSteadfastResilienceScore) /
      5,
  );
  const lines = [
    `【백석 《사슴·흰 바람벽이 있어》 순수 고결성·맑은 존엄(Poetic Purity) 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 시적 순수 국면: ${describeBaekSeokStage(avgScore)}`,
    `- 핵심 백석 테마: ${res.activeBaekSeokTheme.themeTitleKo} [${res.activeBaekSeokTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeBaekSeokTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeBaekSeokTheme.practicalCounsel}`,
    `- 백석 원전 시구: "${res.focalBaekSeokAphorism.aphorismKo}"`,
    `- 보조 교차 시구: "${res.secondaryBaekSeokAphorism.aphorismKo}" [${res.secondaryBaekSeokAphorism.sourceContext}]`,
    `- 원전 출처: [${res.focalBaekSeokAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalBaekSeokAphorism.actionGuidance}`,
    `- 종합 백석 권면: ${res.baekSeokComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.baekSeokSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.baekSeokSynthesisMatrix.dominantTension} | 조율 상태: ${res.baekSeokSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.baekSeokSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
