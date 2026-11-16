/**
 * 독일 요한 볼프강 폰 괴테(Johann Wolfgang von Goethe) 《파우스트(Faust)》
 * 영혼 구원 갈망 노력 & 현재 순간 몰입 질풍노도 지혜 엔진
 *
 * 세계문학사 최대의 지성이자 문호 괴테(1749~1832)의 필생의 대작 《파우스트(Faust, 1808·1832)》
 * 및 《빌헬름 마이스터의 수업시대(Wilhelm Meisters Lehrjahre)》 원전 기반:
 * 1. 끊임없는 노력과 영혼의 구원(Wer immer strebend sich bemüht): "인간은 노력하는 한 방황하지만, 끝없이 갈망하며 앞으로 나아가는 자는 신과 천사들의 구원을 받는다" - 정체와 안주를 거부하는 영혼의 불꽃.
 * 2. 현재 순간의 숭고한 몰입(Verweile doch! Du bist so schön!): "순간이여 멈추어라, 너는 정말 아름답구나!" - 과거의 후회와 미래의 불안을 떨치고 지금 이 순간의 찰나를 영원으로 빚어내는 현존.
 * 3. 질풍노도(Sturm und Drang)의 창조적 결단: "태초에 행동이 있었느니라(Im Anfang war die Tat)" - 머뭇거리는 사색을 넘어 현실을 직접 부딪혀 바꾸어내는 담대한 행동력.
 * 4. 메피스토펠레스의 냉소와 회의 극복: 모든 것을 부정하고 갉아먹는 악마적 회의주의를 오히려 생명력을 북돋우는 반작용으로 삼아 더 높은 차원으로 도약.
 * 5. 영원한 여성성(Das Ewig-Weibliche)과 유기적 변형(Metamorphose): 시련과 상처를 유기적 성장의 거름으로 삼아 영혼을 끝없이 고양하는 초월적 지혜.
 *
 * @version LUCKEY-GOETHE-FAUST-STRIVING-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_GOETHE_FAUST_VERSION = 'LUCKEY-GOETHE-FAUST-STRIVING-v2.1.0';

export interface GoetheTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  practicalCounsel: string;
}

export interface GoetheAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface JohannWolfgangGoetheFaustStrivingResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 파우스트·갈망 지표 (0~100)
  eternalStrivingEndeavorScore: number;     // 끊임없는 노력과 갈망의 영혼 구원력
  verweileDochMomentPresenceScore: number;  // 현재 순간 숭고한 몰입도 ("멈추어라, 너 정말 아름답구나")
  sturmUndDrangPassionDriveScore: number;   // 질풍노도 창조적 행동력 및 생명력 지수
  mephistoNegationOvercomeScore: number;    // 냉소·회의적 부정성 극복 및 승화력
  eternalFeminineUpliftScore: number;       // 영원한 여성성(Das Ewig-Weibliche) 영혼 고양도
  // 세부 분석
  activeGoetheTheme: GoetheTheme;
  focalGoetheAphorism: GoetheAphorism;
  secondaryGoetheAphorism: GoetheAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  goetheComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  goetheSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const GOETHE_THEMES: GoetheTheme[] = [
  {
    themeKey: 'striving_salvation',
    themeTitleEn: 'Salvation through Constant Striving',
    themeTitleKo: '노력과 갈망을 통한 구원 - 방황을 딛고 비상하는 영혼의 불꽃',
    philosophicalInsight: '실패와 방황은 무능의 증거가 아니라 진정한 삶을 살아가고 있다는 가장 뜨거운 증거이며, 멈추지 않는 한 영혼은 반드시 구원에 이릅니다.',
    practicalCounsel: '지나간 실수나 굴곡에 기죽지 마십시오. 오늘 다시 일어나 품었던 이상을 향해 한 걸음 더 내딛는 것만으로도 당신은 이미 승리하고 있습니다.',
  },
  {
    themeKey: 'sacred_present_moment',
    themeTitleEn: 'Sacred Depth of the Present Moment',
    themeTitleKo: '영원한 순간의 몰입 - "순간이여 멈추어라, 너는 참으로 아름답구나"',
    philosophicalInsight: '진정한 행복은 저 먼 곳의 미래가 아니라, 지금 온 마음을 쏟아붓고 있는 눈앞의 순간 속에서 영원한 보석처럼 피어납니다.',
    practicalCounsel: '미래에 대한 막연한 불안을 내려놓고, 지금 당신이 마주하고 있는 일, 사람, 장면에 온 감각을 다해 몰입해 보십시오.',
  },
  {
    themeKey: 'creative_action_tat',
    themeTitleEn: 'In the Beginning was the Deed',
    themeTitleKo: '행동의 창조력 - "태초에 행동이 있었느니라"',
    philosophicalInsight: '백 번의 사색과 망설임보다 한 번의 결단 있는 행동이 세상과 운명을 뒤흔들며 새로운 활로를 열어젖힙니다.',
    practicalCounsel: '완벽한 조건을 기다리며 계산만 거듭하지 마십시오. 작고 불완전할지라도 오늘 당장 행동으로 옮길 때 모든 길이 열립니다.',
  },
  {
    themeKey: 'organic_metamorphosis',
    themeTitleEn: 'Organic Metamorphosis and Eternal Uplift',
    themeTitleKo: '유기적 성장과 승화 - 시련을 자양분 삼아 더 높이 오르는 영혼',
    philosophicalInsight: '씨앗이 어둠을 뚫고 싹을 틔워 꽃을 피우듯, 당신이 겪은 모든 고통과 모순은 더 큰 내적 지혜로 피어나기 위한 필연적 탈바꿈입니다.',
    practicalCounsel: '현재의 난관을 저주하지 마십시오. 이 시련 속에서 당신 영혼이 한 차원 더 높은 통찰과 성숙으로 돋아나고 있음을 굳게 믿으십시오.',
  },
];

export const GOETHE_APHORISMS: GoetheAphorism[] = [
  {
    aphorismKey: 'mensch_strebt_irrt',
    aphorismKo: '인간은 노력하는 한 방황하는 법이다.',
    aphorismEn: 'Es irrt der Mensch, so lang er strebt. (Man errs as long as he strives.)',
    sourceContext: '《파우스트》 프롤로그',
    actionGuidance: '방황을 부끄러워하지 마십시오. 그 방황이야말로 당신이 더 나은 삶을 향해 진실하게 부딪히고 있다는 고귀한 증거입니다.',
  },
  {
    aphorismKey: 'strebend_erloesen',
    aphorismKo: '끝없이 갈망하며 노력하는 자, 그를 우리는 구원할 수 있노라.',
    aphorismEn: 'Wer immer strebend sich bemüht, den können wir erlösen.',
    sourceContext: '《파우스트》 제2부 5막',
    actionGuidance: '포기하지 않고 오늘 당신이 할 수 있는 정성을 쏟으십시오. 우주와 하늘의 섭리가 당신의 진심 어린 수고를 기필코 보상합니다.',
  },
  {
    aphorismKey: 'verweile_doch',
    aphorismKo: '순간이여 멈추어라, 너는 정말로 아름답구나!',
    aphorismEn: 'Verweile doch! Du bist so schön! (Linger a while! Thou art so fair!)',
    sourceContext: '《파우스트》 제1부·제2부 핵심 서약',
    actionGuidance: '지금 당신 곁에 있는 소중한 사람과 일상, 살아 숨 쉬는 기적에 깊은 애정을 보내며 이 순간을 온전히 누리십시오.',
  },
  {
    aphorismKey: 'im_anfang_war_tat',
    aphorismKo: '태초에 행동이 있었느니라.',
    aphorismEn: 'Im Anfang war die Tat. (In the beginning was the deed.)',
    sourceContext: '《파우스트》 제1부 서재 장면',
    actionGuidance: '복잡한 생각을 내려놓고 즉시 실행으로 옮기십시오. 행동만이 두려움을 지우고 새로운 현실을 창조합니다.',
  },
];

function formatGoetheKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function buildGoetheReflectiveQuestion(theme: GoetheTheme, query?: string): string {
  const trimmed = query?.trim();
  if (trimmed) {
    return `'${trimmed}' 앞에서 냉소와 망설임을 멈추고 오늘 당장 행동(Tat)으로 옮길 수 있는 가장 작은 한 걸음은 무엇인가요? (${theme.themeTitleKo})`;
  }
  return `지금 이 순간 온 마음을 다해 "멈추어라, 너는 참으로 아름답구나"라고 부를 수 있는 삶의 장면은 무엇인가요? (${theme.themeTitleKo})`;
}

function describeGoetheStage(score: number): string {
  if (score >= 92) return '뜨거운 비상(飛翔)기 (끝없는 갈망과 현재 순간의 몰입이 하나로 빛나는 흐름)';
  if (score >= 83) return '결단의 행동기 (질풍노도의 추진력으로 회의와 한계를 돌파하는 흐름)';
  return '유기적 변형기 (방황을 자양분 삼아 다음 도약을 준비하는 흐름)';
}

export function calculateGermanJohannWolfgangGoetheFaustStriving(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): JohannWolfgangGoetheFaustStrivingResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `GOETHE-FAUST-STRIVING:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const eternalStrivingEndeavorScore = 75 + (absHash % 24);
  const verweileDochMomentPresenceScore = 72 + ((absHash >> 3) % 27);
  const sturmUndDrangPassionDriveScore = 74 + ((absHash >> 6) % 25);
  const mephistoNegationOvercomeScore = 71 + ((absHash >> 9) % 28);
  const eternalFeminineUpliftScore = 73 + ((absHash >> 12) % 26);

  const themeIndex = (absHash >> 4) % GOETHE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % GOETHE_APHORISMS.length;
  const secondaryOffset = 1 + ((absHash >> 10) % (GOETHE_APHORISMS.length - 1));
  const secondaryAphorismIndex = (aphorismIndex + secondaryOffset) % GOETHE_APHORISMS.length;

  const activeGoetheTheme = GOETHE_THEMES[themeIndex];
  const focalGoetheAphorism = GOETHE_APHORISMS[aphorismIndex];
  const secondaryGoetheAphorism = GOETHE_APHORISMS[secondaryAphorismIndex];
  const reflectiveQuestion = buildGoetheReflectiveQuestion(activeGoetheTheme, query);
  const interpretiveBoundary = '괴테 《파우스트》 관점은 성패 예언이나 도덕적 심판이 아니라, 끊임없는 갈망과 현재 몰입을 비추는 문학·철학적 성찰 렌즈입니다.';

  const guidanceTitle = `괴테 파우스트 갈망 노력 지혜: ${activeGoetheTheme.themeTitleKo}`;
  const philosophicalCounsel = `괴테의 파우스트 철학은 방황과 한계를 딛고 멈추지 않는 갈망으로 현재 순간에 온전히 몰입하는 영혼의 구원을 안내합니다. ` +
    `현재 당신의 삶에서 가장 핵심적인 도약의 열쇠는 '${activeGoetheTheme.themeTitleKo}'입니다. ` +
    `${activeGoetheTheme.practicalCounsel} 괴테의 불멸의 명언 "${focalGoetheAphorism.aphorismKo}"(${focalGoetheAphorism.aphorismEn})을 가슴에 새기고, ` +
    `${focalGoetheAphorism.actionGuidance}`;

  const goetheSynthesisMatrix = {
    dominantTension: `${activeGoetheTheme.themeTitleKo} ↔ ${focalGoetheAphorism.sourceContext}`,
    alignmentState:
      eternalStrivingEndeavorScore >= 88 && verweileDochMomentPresenceScore >= 86
        ? '영원한 갈망과 현재 몰입의 숭고한 공명'
        : '방황과 냉소를 딛고 창조적 행동으로 나아가는 국면',
    integratedAction: `${activeGoetheTheme.practicalCounsel} (${focalGoetheAphorism.actionGuidance})`,
  };

  return {
    engineVersion: GERMAN_GOETHE_FAUST_VERSION,
    calculatedAtKst: formatGoetheKstTimestamp(now),
    eternalStrivingEndeavorScore,
    verweileDochMomentPresenceScore,
    sturmUndDrangPassionDriveScore,
    mephistoNegationOvercomeScore,
    eternalFeminineUpliftScore,
    activeGoetheTheme,
    focalGoetheAphorism,
    secondaryGoetheAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    goetheComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    goetheSynthesisMatrix,
  };
}

export function formatJohannWolfgangGoetheFaustStrivingPrompt(res: JohannWolfgangGoetheFaustStrivingResult): string {
  const lines = [
    `【괴테 《파우스트》 영혼 구원 갈망 노력 & 현재 순간 몰입 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 끊임없는 노력 갈망 영혼 구원력(Striving Salvation): ${describeGoetheStage(res.eternalStrivingEndeavorScore)}`,
    `- 현재 순간 숭고한 몰입도(Verweile doch!): ${describeGoetheStage(res.verweileDochMomentPresenceScore)}`,
    `- 질풍노도 창조적 행동력(Sturm und Drang): ${describeGoetheStage(res.sturmUndDrangPassionDriveScore)}`,
    `- 냉소·회의적 부정성 극복력(Mephisto Overcome): ${describeGoetheStage(res.mephistoNegationOvercomeScore)}`,
    `- 영원한 여성성 영혼 고양도(Das Ewig-Weibliche): ${describeGoetheStage(res.eternalFeminineUpliftScore)}`,
    `- 핵심 파우스트 테마: ${res.activeGoetheTheme.themeTitleKo} [${res.activeGoetheTheme.themeTitleEn}]`,
    `- 철학적 통찰: ${res.activeGoetheTheme.philosophicalInsight}`,
    `- 실천적 조언: ${res.activeGoetheTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalGoetheAphorism.aphorismKo}"`,
    `- 원문: "${res.focalGoetheAphorism.aphorismEn}" [${res.focalGoetheAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalGoetheAphorism.actionGuidance}`,
    `- 보조 원전 테제: "${res.secondaryGoetheAphorism.aphorismKo}"`,
    `- 보조 원전 출처: "${res.secondaryGoetheAphorism.aphorismEn}" [${res.secondaryGoetheAphorism.sourceContext}]`,
    `- 보조 실천 지침: ${res.secondaryGoetheAphorism.actionGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 종합 통찰 권면: ${res.goetheComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.goetheSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.goetheSynthesisMatrix.dominantTension} | 조율 상태: ${res.goetheSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.goetheSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
