/**
 * 독일 게오르크 빌헬름 프리드리히 헤겔(G.W.F. Hegel) 《정신현상학》 변증법적 지양(Aufheben) & 인륜성(Sittlichkeit) 자유실현 엔진
 *
 * 19세기 독일 관념론의 거장 G.W.F. 헤겔(1770~1831)의 주저 《정신현상학(Phänomenologie des Geistes)》,
 * 《법철학 강요(Grundlinien der Philosophie des Rechts)》, 《대논리학(Wissenschaft der Logik)》 원전 기반:
 * 1. 변증법적 지양(Aufheben): 정(These)과 반(Antithese)의 대립과 모순을 단순한 파괴나 배제가 아니라,
 *    본질적 가치를 보존(Bewahren)하며 한계를 폐기(Aufhören)하고 더 높은 차원으로 고양(Erhöhen)시키는 종합(Synthese)의 창조력.
 * 2. 상호 인정투쟁(Kampf um Anerkennung): 일방적 지배-예속 관계를 극복하고, 타자를 대등한 자유로운 인격으로 상호 인정(Gegenseitige Anerkennung)함으로써 도달하는 자기의식의 성숙.
 * 3. 인륜성(Sittlichkeit): 추상적인 당위 도덕(Moralität)을 넘어, 가족·시민사회·국가 공동체의 구체적 관계와 신뢰 속에서 실천되는 실체적 자유.
 * 4. 이성적인 것은 현실적인 것이다(Das Vernünftige ist wirklich): 헛된 공상이나 비관에 빠지지 않고, 현실의 필연성과 고난 속에서 작동하는 거대한 이성적 법칙을 신뢰하는 의연함.
 * 5. 미네르바의 올빼미(Die Eule der Minerva): 황혼이 저물 무렵에야 날개를 펴듯, 격동과 혼란이 가라앉은 뒤 냉철한 사후 성찰을 통해 삶의 궁극적 진리를 완성하는 원숙한 통찰.
 *
 * @version LUCKEY-GERMAN-HEGEL-DIALECTICAL-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_HEGEL_DIALECTICAL_VERSION = 'LUCKEY-GERMAN-HEGEL-DIALECTICAL-v1.0.0';

export interface HegelTheme {
  themeKey: string;
  themeTitleGerman: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  dialecticalCounsel: string;
}

export interface HegelAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  philosophicalDimension: string;
  practicalAction: string;
}

export interface HegelDialecticalAufhebenResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 변증법 지표 (0~100)
  dialecticalAufhebenSynthesisScore: number;  // 모순 갈등 지양(Aufheben) 및 상위 차원 종합력
  mutualAnerkennungMaturityScore: number;     // 상호주관적 인정투쟁(Anerkennung) 성숙도
  sittlichkeitEthicalLifeHarmonyScore: number;// 인륜성(Sittlichkeit) 공동체 실천 및 신뢰 조화도
  rationalRealityGraspScore: number;          // 현실과 이성의 일치 통찰력(Vernünftig & Wirklich)
  minervaReflectiveWisdomScore: number;       // 미네르바의 올빼미(Eule der Minerva) 원숙한 사후 성찰도
  // 세부 체계
  activeHegelTheme: HegelTheme;
  focalHegelAphorism: HegelAphorism;
  hegelPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type HegelDialecticalAufhebenReport = HegelDialecticalAufhebenResult;

const HEGEL_THEMES: HegelTheme[] = [
  {
    themeKey: 'DialecticalAufheben',
    themeTitleGerman: 'Widerspruch und Aufhebung',
    themeTitleKo: '모순의 직시와 변증법적 고양',
    philosophicalInsight: '대립과 갈등은 정체가 아니라 더 높은 진리와 도약을 낳는 필연적 진통이다.',
    dialecticalCounsel: '양자택일의 극단적 이분법에 갇히지 말고, 반대편의 타당한 근거까지 포용하여 더 크고 완전한 해법을 창출하십시오.',
  },
  {
    themeKey: 'MutualAnerkennung',
    themeTitleGerman: 'Gegenseitige Anerkennung',
    themeTitleKo: '진정한 상호 인정과 자유의 실현',
    philosophicalInsight: '나의 자유는 타인의 자유를 억압할 때가 아니라, 상대를 존엄한 인격으로 인정할 때 비로소 완성된다.',
    dialecticalCounsel: '승패의 대립 구도를 내려놓고, 상대의 가치를 진심으로 존중함으로써 서로가 함께 성장하는 신뢰의 기반을 세우십시오.',
  },
  {
    themeKey: 'SittlichkeitConcreteFreedom',
    themeTitleGerman: 'Konkrete Sittlichkeit und Freiheit',
    themeTitleKo: '추상적 명분을 넘은 구체적 인륜성',
    philosophicalInsight: '공허한 말잔치보다 일상의 책임을 다하고 공동체와 함께 호흡할 때 참된 자유가 뿌리내린다.',
    dialecticalCounsel: '거창한 이상에 집착하기보다 지금 내가 몸담은 자리에서 작은 신의와 정직한 소임을 묵묵히 실천하십시오.',
  },
  {
    themeKey: 'RationalRealityAffirmation',
    themeTitleGerman: 'Das Wahre ist das Ganze',
    themeTitleKo: '진리는 전체이며 현실의 필연성 통찰',
    philosophicalInsight: '진리는 전체다(Das Wahre ist das Ganze). 단편적 고난에 휘둘리지 않고 삶의 거대한 흐름을 통찰한다.',
    dialecticalCounsel: '지금 겪는 시련을 고립된 불행으로 보지 말고, 나를 더 단단하게 빚어내는 삶의 전체적 여정 속에서 이해하십시오.',
  },
  {
    themeKey: 'MinervaTwilightWisdom',
    themeTitleGerman: 'Die Eule der Minerva im Abendrot',
    themeTitleKo: '미네르바의 올빼미 원숙한 통찰',
    philosophicalInsight: '소용돌이가 잦아든 황혼의 고요 속에서, 비로소 지나온 길의 진정한 의미가 환하게 드러난다.',
    dialecticalCounsel: '성급하게 결과를 재단하지 말고, 호흡을 가다듬은 뒤 냉철한 성찰을 통해 삶의 깊은 교훈을 갈무리하십시오.',
  },
];

const HEGEL_APHORISMS: HegelAphorism[] = [
  {
    aphorismKey: 'TrueIsTheWhole',
    aphorismKo: '진리는 전체다. 오직 전체를 조망할 때 부분의 참된 가치가 드러난다',
    aphorismGerman: 'Das Wahre ist das Ganze',
    philosophicalDimension: '전체성 조망과 편견 극복',
    practicalAction: '눈앞의 사소한 득실에 일희일비하지 말고, 긴 호흡으로 삶의 전체적 맥락과 방향성을 조망하십시오.',
  },
  {
    aphorismKey: 'OwlOfMinervaFlight',
    aphorismKo: '미네르바의 올빼미는 황혼이 저물어야 비로소 날아오른다',
    aphorismGerman: 'Die Eule der Minerva beginnt erst mit der einbrechenden Dämmerung ihren Flug',
    philosophicalDimension: '사후 성찰과 지혜의 성숙',
    practicalAction: '일이 진행 중일 때는 경솔한 판단을 삼가고, 모든 과정이 매듭지어진 뒤 차분하게 본질을 복기하십시오.',
  },
  {
    aphorismKey: 'RationalIsReal',
    aphorismKo: '이성적인 것은 현실적인 것이요, 현실적인 것은 이성적인 것이다',
    aphorismGerman: 'Was vernünftig ist, das ist wirklich; und was wirklich ist, das ist vernünftig',
    philosophicalDimension: '현실 직시와 내적 질서 신뢰',
    practicalAction: '현실을 부정하거나 도피하지 말고, 현 상황의 인과관계와 필연성을 냉철하게 파악하여 돌파구를 찾으십시오.',
  },
  {
    aphorismKey: 'SpiritHealsWounds',
    aphorismKo: '정신은 상처를 입으면서 스스로를 치유하고, 더 높은 자유로 고양된다',
    aphorismGerman: 'Der Geist heilt seine Wunden, ohne Narben zu hinterlassen',
    philosophicalDimension: '상처의 변용과 정신적 도약',
    practicalAction: '과거의 실패와 상처에 얽매이지 말고, 그것을 자양분 삼아 더 넓고 깊은 내적 품격을 세우십시오.',
  },
  {
    aphorismKey: 'HistoryProgressFreedom',
    aphorismKo: '세계사는 자유의 의식이 끊임없이 전진해 나가는 과정이다',
    aphorismGerman: 'Die Weltgeschichte ist der Fortschritt im Bewusstsein der Freiheit',
    philosophicalDimension: '주체적 자유와 역사의식',
    practicalAction: '타인의 조종이나 외적 구속에 굴복하지 말고, 스스로 사유하고 행동하는 자율적 주체로 당당히 서십시오.',
  },
];

export function calculateHegelDialecticalAufheben(profile: UserProfile): HegelDialecticalAufhebenResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'GermanHegelDialecticalAufheben';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const dialecticalAufhebenSynthesisScore = 70 + (absHash % 29);
  const mutualAnerkennungMaturityScore = 68 + ((absHash >> 3) % 31);
  const sittlichkeitEthicalLifeHarmonyScore = 69 + ((absHash >> 6) % 30);
  const rationalRealityGraspScore = 67 + ((absHash >> 9) % 32);
  const minervaReflectiveWisdomScore = 66 + ((absHash >> 12) % 33);

  const themeIndex = (absHash >> 4) % HEGEL_THEMES.length;
  const aphorismIndex = (absHash >> 7) % HEGEL_APHORISMS.length;

  const activeHegelTheme = HEGEL_THEMES[themeIndex];
  const focalHegelAphorism = HEGEL_APHORISMS[aphorismIndex];

  const counselTitle = `헤겔 변증법적 지양 철학: ${activeHegelTheme.themeTitleKo}`;
  const philosophicalGuidance = `G.W.F. 헤겔의 철학은 모순과 대립을 회피하지 않고 상위 차원의 지양(Aufheben)으로 승화시켜 참된 자유를 실현하도록 이끕니다. ` +
    `현재 당신이 마주한 상황의 핵심 통찰은 '${activeHegelTheme.themeTitleKo}'에 부합합니다. ` +
    `${activeHegelTheme.dialecticalCounsel} 헤겔의 통찰인 '${focalHegelAphorism.aphorismKo}'(${focalHegelAphorism.philosophicalDimension})을 기억하여, ` +
    `${focalHegelAphorism.practicalAction}`;

  return {
    engineVersion: GERMAN_HEGEL_DIALECTICAL_VERSION,
    calculatedAtKst: new Date().toISOString(),
    dialecticalAufhebenSynthesisScore,
    mutualAnerkennungMaturityScore,
    sittlichkeitEthicalLifeHarmonyScore,
    rationalRealityGraspScore,
    minervaReflectiveWisdomScore,
    activeHegelTheme,
    focalHegelAphorism,
    hegelPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatHegelDialecticalAufhebenPrompt(res: HegelDialecticalAufhebenResult): string {
  return [
    `【G.W.F. 헤겔 변증법적 지양(Aufheben) & 인륜성 지표】`,
    `- 대립 갈등 지양 종합력(Aufheben): ${res.dialecticalAufhebenSynthesisScore}/100`,
    `- 상호 인정투쟁 성숙도(Anerkennung): ${res.mutualAnerkennungMaturityScore}/100`,
    `- 인륜성 공동체 신뢰도(Sittlichkeit): ${res.sittlichkeitEthicalLifeHarmonyScore}/100`,
    `- 현실·이성 일치 통찰력(Vernünftig & Wirklich): ${res.rationalRealityGraspScore}/100`,
    `- 미네르바 올빼미 성찰도(Minerva): ${res.minervaReflectiveWisdomScore}/100`,
    `- 핵심 변증법 테마: ${res.activeHegelTheme.themeTitleKo} [${res.activeHegelTheme.themeTitleGerman}]`,
    `- 철학적 통찰: ${res.activeHegelTheme.philosophicalInsight}`,
    `- 변증법적 조언: ${res.activeHegelTheme.dialecticalCounsel}`,
    `- 핵심 아포리즘: "${res.focalHegelAphorism.aphorismKo}"`,
    `- 독일어 원문: "${res.focalHegelAphorism.aphorismGerman}" [${res.focalHegelAphorism.philosophicalDimension}]`,
    `- 실천적 행동 지침: ${res.focalHegelAphorism.practicalAction}`,
    `- 통합 변증 처방: ${res.hegelPersonalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
