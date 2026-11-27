/**
 * 이탈리아 조반니 피코 델라 미란돌라(Giovanni Pico della Mirandola) 《인간의 존엄성에 관한 연설(De hominis dignitate)》 인간의 자유의지와 무한한 가능성 & 자기형성적 존엄성·보편적 지혜 융합 엔진
 *
 * 15세기 이탈리아 르네상스 철학의 기린아 조반니 피코 델라 미란돌라(1463~1494) 백작의 불후의 명저 《인간의 존엄성에 관한 연설(Oratio de hominis dignitate)》 원전 기반:
 * 1. 자유의지 및 자기형성적 주체성 지수 (Free Will & Self-Fashioning Agency Score): 고정된 본질에 갇히지 않고 스스로 자신의 모습을 조각해 나가는 주체적 조형 의지.
 * 2. 무한한 잠재력 및 가능성 확장도 (Infinite Potential & Aspiration Index): 우주의 중심에서 천상과 지상을 자유롭게 오르내릴 수 있는 무한한 상승 지향성.
 * 3. 보편적 지혜 융합 및 평화적 일치도 (Syncretic Wisdom & Concord Score): 플라톤·아리스토텔레스·카발라·동방 철학을 아우르는 지적 포용력과 진리의 화해.
 * 4. 내면 정화 및 관조적 평정 지표 (Inner Purification & Contemplative Peace Index): 도덕적 정화와 변증법적 사유를 통해 도달하는 영혼의 고요한 관조와 평화.
 * 5. 주체적 존엄성과 창조적 회복탄력성 (Sovereign Dignity & Creative Resilience Score): 외부 운명에 비굴하게 굴복하지 않고 내면의 거룩한 존엄으로 길을 개척하는 회복탄력성.
 *
 * @version LUCKEY-PICO-DELLA-MIRANDOLA-DIGNITY-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const ITALIAN_PICO_DELLA_MIRANDOLA_DIGNITY_VERSION = 'LUCKEY-PICO-DELLA-MIRANDOLA-DIGNITY-v2.4.0';

export interface PicoTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface PicoAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismLatin: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface ItalianPicoDellaMirandolaDignityResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 피코 델라 미란돌라 인간 존엄성 핵심 지표 (0~100)
  freeWillAgencyScore: number;                 // 자유의지 및 자기형성적 주체성 (Free Will & Self-Fashioning)
  infinitePotentialIndex: number;              // 무한한 잠재력 및 가능성 확장도 (Infinite Potential & Aspiration)
  syncreticUniversalWisdomScore: number;       // 보편적 지혜 융합 및 평화적 일치도 (Syncretic Wisdom & Concord)
  innerPurificationPeaceIndex: number;         // 내면 정화 및 관조적 평정 지표 (Inner Purification & Peace)
  sovereignDignityResilienceScore: number;     // 주체적 존엄성과 창조적 회복탄력성 (Sovereign Dignity Resilience)
  // 세부 분석
  activePicoTheme: PicoTheme;
  focalPicoAphorism: PicoAphorism;
  secondaryPicoAphorism: PicoAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  picoComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  picoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  picoCrossAxis: {
    themeAphorismPair: string;
    dignityStage: string;
    sourceAnchor: string;
  };
}

export const PICO_THEMES: PicoTheme[] = [
  {
    themeKey: 'selfSculptor',
    themeTitleEn: 'Chameleon of Cosmic Potential: Self-Sculptor of Your Own Destiny',
    themeTitleKo: '스스로를 조각하는 자유 — 정해진 한계에 갇히지 않고 나의 삶을 빚어가기',
    pragmaticInsight: '신은 다른 피조물에게 고정된 자리를 주었으나, 인간에게는 어떤 정해진 틀도 강요하지 않았습니다. 피코의 선언처럼 당신은 스스로의 뜻에 따라 자신의 형상을 빚어내는 최고의 조각가이자 창조자입니다.',
    practicalCounsel: '과거의 환경이나 타인의 평가를 운명으로 받아들이지 마십시오. 당신은 언제든 다시 새로운 가능성을 선택할 수 있습니다. 스스로 원하는 가장 고귀한 자신의 모습을 설계하고 당당하게 구현하십시오.',
  },
  {
    themeKey: 'infiniteAspiration',
    themeTitleEn: 'Infinite Aspiration: Ascending from Dust to the Seraphic Heights',
    themeTitleKo: '무한한 상승 지향 — 비천함에 안주하지 않고 영혼의 날개를 펴 높은 이상을 향하기',
    pragmaticInsight: '인간은 짐승처럼 감각적 본능에 침몰할 수도 있고, 천사처럼 지혜와 사랑으로 타오를 수도 있는 갈림길에 서 있습니다. 우리의 존엄은 보다 높은 가치를 향해 끊임없이 도약하는 거룩한 열망에 있습니다.',
    practicalCounsel: '눈앞의 사소한 편안함이나 일시적 타협에 머물지 마십시오. 당신 안의 고귀한 이상과 사명을 자각하고, 그 높은 부르심에 걸맞게 시야와 행동의 품격을 높이십시오.',
  },
  {
    themeKey: 'philosophicalConcord',
    themeTitleEn: 'Pax Philosophica: Transcending Factions into Universal Concord',
    themeTitleKo: '보편적 지혜의 조화 — 파벌과 분열을 넘어 다름 속에서 참된 진리를 통합하기',
    pragmaticInsight: '모든 참된 철학과 영성은 서로 다른 언어로 하나의 궁극적 진리를 증언합니다. 배타적인 편견을 버리고 서로 다른 지혜의 물줄기를 하나로 엮을 때 영혼의 거대한 평화(Pax)가 피어납니다.',
    practicalCounsel: '적과 아군, 옳고 그름의 좁은 이분법에 매몰되지 마십시오. 대립하는 관점의 이면에 놓인 공통의 핵심 가치를 통찰하고, 이질적인 요소들을 조화롭게 엮어내는 화해의 리더십을 발휘하십시오.',
  },
  {
    themeKey: 'innerPurification',
    themeTitleEn: 'Katharsis & Dialectic: Cleansing the Soul into Luminous Clarity',
    themeTitleKo: '내면의 정화와 명석함 — 탁한 잡념을 씻어내고 영혼의 투명한 빛을 회복하기',
    pragmaticInsight: '혼란과 방황은 내면의 정서적 분열과 헛된 욕망의 찌꺼기에서 비롯됩니다. 도덕적 정화(Katharsis)와 명석한 사유를 통해 마음을 맑게 가꾸면 우주의 지혜가 거울처럼 투명하게 비치기 시작합니다.',
    practicalCounsel: '마음을 어지럽히는 불필요한 집착과 감정적 동요를 차분히 가라앉히십시오. 명상과 성찰로 고요의 중심을 회복하고, 명확하고 단단한 이성으로 상황의 본질을 꿰뚫어 보십시오.',
  },
  {
    themeKey: 'sovereignWonder',
    themeTitleEn: 'Miracle of Human Existence: Standing Dignified at the Center of the World',
    themeTitleKo: '우주의 경이로운 중심 — 고유한 주권자로서 존엄하게 우뚝 서기',
    pragmaticInsight: '인간은 우주 만물의 아름다움을 감상하고 경탄하기 위해 세상의 중심에 놓인 기적과 같은 존재입니다. 당신의 존재 자체가 우주가 빚어낸 고귀한 경이임을 잊지 마십시오.',
    practicalCounsel: '위축되거나 스스로를 낮추어 보지 마십시오. 당신의 고유한 개성과 존엄을 온전히 인정하고, 세상 앞에서 당당하고 의연한 주권자의 태도로 발걸음을 내딛으십시오.',
  },
];

export const PICO_APHORISMS: PicoAphorism[] = [
  {
    aphorismKey: 'selfFashioningDignity',
    aphorismKo: '너는 너 자신의 명예로운 조각가로서, 스스로 선택한 형태로 자신을 빚어낼 수 있다.',
    aphorismLatin: 'Tui ipsius quasi arbitrarius honorariusque plastes et fictor, in quam volueris tute formam effingas.',
    sourceContext: '피코 델라 미란돌라 《인간의 존엄성에 관한 연설(De hominis dignitate)》',
    actionGuidance: '자신의 한계를 스스로 규정짓지 마십시오. 최고의 자아를 마음속에 그리고 오늘 그것을 행동으로 증명하십시오.',
  },
  {
    aphorismKey: 'miracleOfBeing',
    aphorismKo: '인간이야말로 모든 피조물 가운데 가장 경이롭고 찬탄할 만한 존재이다.',
    aphorismLatin: 'Magnum, o Asclepi, miraculum est homo.',
    sourceContext: '피코 델라 미란돌라 《인간의 존엄성에 관한 연설(De hominis dignitate)》',
    actionGuidance: '자기비하의 그림자를 털어내십시오. 당신에게 깃든 거룩한 생명력과 잠재력을 진심으로 경외하고 아끼십시오.',
  },
  {
    aphorismKey: 'peaceThroughTruth',
    aphorismKo: '철학의 궁극적 열매는 영혼에 흔들리지 않는 평화와 보편적 일치를 선사하는 것이다.',
    aphorismLatin: 'Philosophia animo pacem conciliat et veritatem revelat.',
    sourceContext: '피코 델라 미란돌라 《존재와 일자에 관하여(De ente et uno)》',
    actionGuidance: '불필요한 논쟁으로 에너지를 낭비하지 마십시오. 깊은 진리와 사색을 통해 내면의 평온을 단단히 지키십시오.',
  },
  {
    aphorismKey: 'nobilityOfAspiration',
    aphorismKo: '우리가 진정으로 거룩한 것을 갈망한다면, 우리는 이미 그것에 도달할 힘을 품고 있다.',
    aphorismLatin: 'Cum sancta appetimus, eorum assequendorum facultate iam praediti sumus.',
    sourceContext: '피코 델라 미란돌라 《7일간의 천지창조 고찰(Heptaplus)》',
    actionGuidance: '망설임을 멈추고 원대한 비전을 향해 손을 뻗으십시오. 열망이 깊을수록 길은 더욱 선명하게 열릴 것입니다.',
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

function formatPicoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describePicoStage(score: number): string {
  if (score >= 93) return '자기조형(Self-Fashioning) 비상기 (자유의지로 고귀한 형상을 빚어내는 흐름)';
  if (score >= 88) return '보편 일치(Pax Philosophica)기 (다름을 통합해 내면의 평화를 여는 국면)';
  return '내면 정화(Katharsis)기 (잡념을 씻고 주체적 존엄의 중심을 세우는 흐름)';
}

export function calculateItalianPicoDellaMirandolaDignity(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): ItalianPicoDellaMirandolaDignityResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `PICO-DELLA-MIRANDOLA-DIGNITY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const freeWillAgencyScore = 85 + ((absHash >> 1) % 14);
  const infinitePotentialIndex = 86 + ((absHash >> 4) % 13);
  const syncreticUniversalWisdomScore = 84 + ((absHash >> 7) % 15);
  const innerPurificationPeaceIndex = 83 + ((absHash >> 10) % 16);
  const sovereignDignityResilienceScore = 87 + ((absHash >> 13) % 12);

  const themeIndex = (absHash >> 5) % PICO_THEMES.length;
  const aphorismIndex = (absHash >> 8) % PICO_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (PICO_APHORISMS.length - 1))) % PICO_APHORISMS.length;

  const activePicoTheme = PICO_THEMES[themeIndex];
  const focalPicoAphorism = PICO_APHORISMS[aphorismIndex];
  const secondaryPicoAphorism = PICO_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 남이 정해 준 한계를 벗어나 내가 내 자유의지로 스스로 조각해 내고 싶은 모습은 무엇인가요?`
    : `지금 내 안에서 나 스스로를 좁은 틀에 가두고 있는 고정관념을 벗고 새롭게 펼쳐 보고 싶은 가능성은 무엇인가요?`;
  const interpretiveBoundary = '피코 델라 미란돌라 인간 존엄성 관점은 길흉 예단이 아니라, 자유의지와 자기형성 주체성을 비추는 르네상스 인문 성찰 렌즈입니다.';

  const guidanceTitle = `피코 델라 미란돌라 인간 존엄성 르네상스 철학 지혜: ${activePicoTheme.themeTitleKo}`;
  const philosophicalCounsel = `르네상스 인본주의 철학의 거장 조반니 피코 델라 미란돌라 백작은 《인간의 존엄성에 관한 연설》을 통해 ` +
    `인간은 고정된 한계에 얽매이지 않고 자유의지로 스스로의 형상을 빚어내는 존엄한 창조자임을 선언했습니다. ` +
    `현재 당신의 도전을 주체적으로 풀어내는 핵심 열쇠는 '${activePicoTheme.themeTitleKo}'입니다. ` +
    `${activePicoTheme.practicalCounsel} 피코 선생의 고전 명언 "${focalPicoAphorism.aphorismKo}" (${focalPicoAphorism.aphorismLatin})을 깊이 새기며, ` +
    `${focalPicoAphorism.actionGuidance}`;

  const picoSynthesisMatrix = {
    dominantTension: `${activePicoTheme.themeTitleKo} ↔ ${focalPicoAphorism.sourceContext}`,
    alignmentState:
      freeWillAgencyScore >= 90 && sovereignDignityResilienceScore >= 90
        ? '자유의지 자기조형과 주권적 존엄성의 르네상스적 합일'
        : '내면 정화와 보편적 지혜의 조화를 통해 가능성을 넓히는 국면',
    integratedAction: `${activePicoTheme.practicalCounsel} (${focalPicoAphorism.actionGuidance})`,
  };
  const picoCrossAxis = {
    themeAphorismPair: `${activePicoTheme.themeKey} ↔ ${focalPicoAphorism.aphorismKey}`,
    dignityStage: describePicoStage(Math.round((freeWillAgencyScore + syncreticUniversalWisdomScore + sovereignDignityResilienceScore) / 3)).split('(')[0].trim(),
    sourceAnchor: focalPicoAphorism.sourceContext,
  };

  const ritualAction = `[${activePicoTheme.themeTitleKo}] ${focalPicoAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: ITALIAN_PICO_DELLA_MIRANDOLA_DIGNITY_VERSION,
    calculatedAtKst: formatPicoKstTimestamp(now),
    freeWillAgencyScore,
    infinitePotentialIndex,
    syncreticUniversalWisdomScore,
    innerPurificationPeaceIndex,
    sovereignDignityResilienceScore,
    activePicoTheme,
    focalPicoAphorism,
    secondaryPicoAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    picoComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    picoSynthesisMatrix,
    picoCrossAxis,
  };
}

export function formatItalianPicoDellaMirandolaDignityPrompt(
  res: ItalianPicoDellaMirandolaDignityResult,
): string {
  const lines = [
    `【조반니 피코 델라 미란돌라 《인간의 존엄성에 관한 연설》 자유의지 및 주체적 존엄성 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 자유의지 및 자기형성 주체성(Free Will & Self-Fashioning Agency): ${describePicoStage(res.freeWillAgencyScore)}`,
    `- 무한한 잠재력 및 가능성 확장도(Infinite Potential & Aspiration): ${describePicoStage(res.infinitePotentialIndex)}`,
    `- 보편적 지혜 융합 및 평화적 일치도(Syncretic Wisdom & Concord): ${describePicoStage(res.syncreticUniversalWisdomScore)}`,
    `- 내면 정화 및 관조적 평정 지표(Inner Purification & Peace): ${describePicoStage(res.innerPurificationPeaceIndex)}`,
    `- 주체적 존엄성과 창조적 회복탄력성(Sovereign Dignity & Resilience): ${describePicoStage(res.sovereignDignityResilienceScore)}`,
    `- 핵심 피코 테마: ${res.activePicoTheme.themeTitleKo} [${res.activePicoTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activePicoTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activePicoTheme.practicalCounsel}`,
    `- 피코 원전 명언: "${res.focalPicoAphorism.aphorismKo}" (${res.focalPicoAphorism.aphorismLatin})`,
    `- 보조 교차 명언: "${res.secondaryPicoAphorism.aphorismKo}" [${res.secondaryPicoAphorism.sourceContext}]`,
    `- 원전 출처: [${res.focalPicoAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalPicoAphorism.actionGuidance}`,
    `- 종합 피코 권면: ${res.picoComprehensiveGuidance.philosophicalCounsel}`,
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.picoSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.picoSynthesisMatrix.dominantTension} | 조율 상태: ${res.picoSynthesisMatrix.alignmentState}]`,
      `- 존엄성 교차 축: ${res.picoCrossAxis.dignityStage} | ${res.picoCrossAxis.sourceAnchor}`,
      `- 통합 실천: ${res.picoSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
