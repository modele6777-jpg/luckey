/**
 * 독일 게오르크 빌헬름 프리드리히 헤겔(G.W.F. Hegel) 《정신현상학》 변증법적 지양(Aufheben) & 인륜성(Sittlichkeit) 자유실현 엔진
 *
 * 19세기 독일 관념론의 거장 G.W.F. 헤겔(1770~1831)의 주저 《정신현상학(Phänomenologie des Geistes)》,
 * 《법철학 강요(Grundlinien der Philosophie des Rechts)》, 《대논리학(Wissenschaft der Logik)》 원전 기반:
 * 1. 변증법적 지양(Aufheben): 정(These)-반(Antithese)-합(Synthese)
 * 2. 상호 인정투쟁(Kampf um Anerkennung)과 인륜성(Sittlichkeit)
 * 3. 미네르바의 올빼미(Die Eule der Minerva) 성찰
 * 4. 질문 맥락 변증법 감사(situationalDialecticalAudit) + KST 시공간 리듬(temporalMinervaRhythm) + 교차 검증 매트릭스(hegelSynthesisMatrix) + 순수 정성 성찰(v2.1.0)
 *
 * @version LUCKEY-GERMAN-HEGEL-DIALECTICAL-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_HEGEL_DIALECTICAL_VERSION = 'LUCKEY-GERMAN-HEGEL-DIALECTICAL-v2.3.0';

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

export interface HegelSituationalDialecticalAudit {
  dialecticalMoment: '정·반 지양(Aufheben)' | '상호 인정(Anerkennung)' | '구체적 인륜성(Sittlichkeit)' | '미네르바 성찰(Minerva)';
  focusAxisKo: string;
  classicalCitation: string;
  synthesisDirective: string;
  reflectiveQuestion: string;
}

export interface HegelTemporalMinervaRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  dialecticalMaturityIndex: number;
  dailySynthesisPractice: string;
}

export interface HegelSynthesisMatrix {
  aufhebenIntegration: number;
  mutualRecognitionDepth: number;
  minervaReflectionClarity: number;
  overallHegelGrade: string;
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
  situationalDialecticalAudit: HegelSituationalDialecticalAudit;
  temporalMinervaRhythm: HegelTemporalMinervaRhythm;
  hegelSynthesisMatrix: HegelSynthesisMatrix;
  dailyPracticeRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
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

function buildSituationalDialecticalAudit(question: string, absHash: number): HegelSituationalDialecticalAudit {
  const q = question.trim();
  if (/갈등|대립|모순|둘 다|싸움|반대|선택/.test(q)) {
    return {
      dialecticalMoment: '정·반 지양(Aufheben)',
      focusAxisKo: '대립하는 두 극단을 버리지 않고 더 높은 제3의 해법으로 지양',
      classicalCitation: '《대논리학》: "지양(Aufheben)은 부정함과 동시에 보존하여 더 높은 차원으로 끌어올리는 것이다."',
      synthesisDirective: '어느 한쪽을 완전히 꺾으려 들지 말고, 양쪽이 진정으로 보호하려는 핵심 가치를 동시에 살리는 상위 구조를 설계하십시오.',
      reflectiveQuestion: '서로 부딪치는 두 입장 각각이 지키고 싶어 하는 타당한 핵심은 무엇입니까?',
    };
  }
  if (/인정|관계|동료|상사|존중|연인|무시|평가/.test(q)) {
    return {
      dialecticalMoment: '상호 인정(Anerkennung)',
      focusAxisKo: '지배와 눈치의 비대칭을 넘어선 대등한 상호 인정',
      classicalCitation: '《정신현상학》 자기의식 장: "자기의식은 오직 다른 자기의식으로부터 인정받을 때 비로소 참된 자기의식이 된다."',
      synthesisDirective: '상대를 굴복시키거나 반대로 과도하게 맞추는 관계를 끊고, 대등한 인격으로 서로의 경계를 인정하는 대화를 여십시오.',
      reflectiveQuestion: '지금 이 관계에서 내가 상대에게 바라는 인정만큼 나도 상대의 자율성을 인정하고 있습니까?',
    };
  }
  if (/책임|가족|회사|공동체|역할|현실|일상/.test(q)) {
    return {
      dialecticalMoment: '구체적 인륜성(Sittlichkeit)',
      focusAxisKo: '추상적 이상이 아닌 삶의 현장에서 구현되는 자유',
      classicalCitation: '《법철학 강요》 §142: "인륜성은 살아 있는 선으로서 구체적 제도와 신뢰 속에서 자유를 실현한다."',
      synthesisDirective: '머릿속 완벽한 이상론에 머물지 말고, 내가 몸담은 공동체와 일상의 약속을 성실히 지켜내며 신뢰를 쌓으십시오.',
      reflectiveQuestion: '거창한 구호 대신 오늘 내가 맡은 작은 자리에서 실천할 수 있는 구체적 신의는 무엇입니까?',
    };
  }
  if (/후회|실패|지나간|의미|정리|성찰/.test(q)) {
    return {
      dialecticalMoment: '미네르바 성찰(Minerva)',
      focusAxisKo: '황혼의 고요 속에서 전체 의미를 건져 올리는 사후 통찰',
      classicalCitation: '《법철학 강요》 서문: "미네르바의 올빼미는 황혼이 깃들어야 비로소 날개를 편다."',
      synthesisDirective: '사건의 소용돌이 한가운데서 성급히 결론 내리지 말고, 한 걸음 물러나 전체 흐름 속에서의 의미를 차분히 복기하십시오.',
      reflectiveQuestion: '이 경험이 내 삶 전체의 큰 이야기 속에서 어떤 도약을 위한 디딤돌이었다고 볼 수 있습니까?',
    };
  }

  const moments: Array<'정·반 지양(Aufheben)' | '상호 인정(Anerkennung)' | '구체적 인륜성(Sittlichkeit)' | '미네르바 성찰(Minerva)'> = [
    '정·반 지양(Aufheben)',
    '상호 인정(Anerkennung)',
    '구체적 인륜성(Sittlichkeit)',
    '미네르바 성찰(Minerva)',
  ];
  return {
    dialecticalMoment: moments[absHash % moments.length],
    focusAxisKo: '부분의 혼란을 넘어 전체 진리(Das Ganze)를 조망하기',
    classicalCitation: '《정신현상학》 서문: "진리는 전체다. 전체는 자신의 발전을 통해 스스로를 완성하는 본질이다."',
    synthesisDirective: '단편적인 승패나 오늘의 기분에 흔들리지 말고, 더 긴 시간의 지평 위에서 모순을 통합해 나가십시오.',
    reflectiveQuestion: '눈앞의 문제를 1년 단위 전체 맥락으로 넓혀 보면 지금 가장 우선해야 할 통합은 무엇입니까?',
  };
}

function buildTemporalMinervaRhythm(now: Date, baseScore: number): HegelTemporalMinervaRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 정립기(새로운 정(These))'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 대립기(창조적 반(Antithese))'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 지양기(고양된 합(Synthese))'
        : '동계 황혼기(미네르바의 성찰)';

  let timeWindowKo = '황혼의 미네르바 성찰';
  let hourBonus = 0;
  let dailySynthesisPractice = '하루의 소용돌이가 가라앉는 시간대에 대립되던 생각들을 하나의 큰 그림으로 통합하십시오.';

  if (kstHour >= 5 && kstHour < 10) {
    timeWindowKo = '아침의 정립(These) · 방향 설정';
    hourBonus = 4;
    dailySynthesisPractice = '오늘 해결해야 할 핵심 모순을 명료하게 정리하고 구체적인 현실 과업부터 착수하십시오.';
  } else if (kstHour >= 10 && kstHour < 15) {
    timeWindowKo = '오전의 인륜성 실천(Sittlichkeit)';
    hourBonus = 5;
    dailySynthesisPractice = '공동체와 일의 현장에서 상호 인정과 성실한 책임을 통해 자유를 구현하십시오.';
  } else if (kstHour >= 15 && kstHour < 20) {
    timeWindowKo = '황혼의 미네르바 올빼미(Eule der Minerva)';
    hourBonus = 7;
    dailySynthesisPractice = '낮의 분주함이 잦아드는 황혼 무렵, 지나온 선택의 맥락을 전체적으로 통찰하십시오.';
  } else {
    timeWindowKo = '밤의 변증법적 통합(Aufheben)';
    hourBonus = 4;
    dailySynthesisPractice = '오늘 겪은 아쉬움과 성취를 모두 보존하고 한 단계 높은 내일의 관점으로 승화시키십시오.';
  }

  return {
    kstHour,
    timeWindowKo,
    seasonKo,
    dialecticalMaturityIndex: Math.min(100, Math.round(baseScore + hourBonus)),
    dailySynthesisPractice,
  };
}

export function calculateHegelDialecticalAufheben(
  profile: UserProfile,
  question = '',
  now: Date = new Date()
): HegelDialecticalAufhebenResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    question.trim() +
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
  const situationalDialecticalAudit = buildSituationalDialecticalAudit(question, absHash);
  const temporalMinervaRhythm = buildTemporalMinervaRhythm(now, minervaReflectiveWisdomScore);

  const avgScore = Math.round(
    (dialecticalAufhebenSynthesisScore + mutualAnerkennungMaturityScore + minervaReflectiveWisdomScore) / 3
  );
  const hegelSynthesisMatrix: HegelSynthesisMatrix = {
    aufhebenIntegration: dialecticalAufhebenSynthesisScore,
    mutualRecognitionDepth: mutualAnerkennungMaturityScore,
    minervaReflectionClarity: minervaReflectiveWisdomScore,
    overallHegelGrade: avgScore >= 88
      ? '미네르바의 전체성 통찰(Das Wahre ist das Ganze)'
      : avgScore >= 78
        ? '변증법적 지양과 상호 인정(Aufheben)'
        : '현실과 이성의 조율(Vernünftig & Wirklich)',
  };

  const counselTitle = `헤겔 변증법적 지양 철학: ${activeHegelTheme.themeTitleKo}`;
  const philosophicalGuidance = `G.W.F. 헤겔의 철학은 모순과 대립을 회피하지 않고 상위 차원의 지양(Aufheben)으로 승화시켜 참된 자유를 실현하도록 이끕니다. ` +
    `현재 질문은 [${situationalDialecticalAudit.dialecticalMoment}]의 '${situationalDialecticalAudit.focusAxisKo}'에 부합합니다. ` +
    `${situationalDialecticalAudit.synthesisDirective} 아울러 '${focalHegelAphorism.aphorismKo}'(${focalHegelAphorism.philosophicalDimension})을 기억하며 ` +
    `${temporalMinervaRhythm.dailySynthesisPractice}`;

  const dailyPracticeRitual = `오늘의 변증법적 지양 의례: ${temporalMinervaRhythm.dailySynthesisPractice} 대립하는 두 선택지 중 하나를 억누르기보다 두 입장을 함께 품는 제3의 해법을 한 줄로 적어 보십시오.`;
  const interpretiveBoundary = '이 관점은 헤겔의 변증법적 성찰을 비유로 삼은 사유 안내일 뿐, 구체적 분쟁 조정이나 법적 판단을 대신하지 않습니다.';

  return {
    engineVersion: GERMAN_HEGEL_DIALECTICAL_VERSION,
    calculatedAtKst: `${new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00 (KST)`,
    dialecticalAufhebenSynthesisScore,
    mutualAnerkennungMaturityScore,
    sittlichkeitEthicalLifeHarmonyScore,
    rationalRealityGraspScore,
    minervaReflectiveWisdomScore,
    activeHegelTheme,
    focalHegelAphorism,
    situationalDialecticalAudit,
    temporalMinervaRhythm,
    hegelSynthesisMatrix,
    dailyPracticeRitual,
    ritualAction: dailyPracticeRitual,
    reflectionFocus: situationalDialecticalAudit.reflectiveQuestion,
    interpretiveBoundary,
    hegelPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

function describeHegelStage(score: number, high: string, mid: string, low: string): string {
  if (score >= 86) return high;
  if (score >= 76) return mid;
  return low;
}

export function formatHegelDialecticalAufhebenPrompt(res: HegelDialecticalAufhebenResult): string {
  const aufhebenStage = describeHegelStage(
    res.dialecticalAufhebenSynthesisScore,
    '대립과 모순을 상위 차원의 통합으로 승화시키는 원숙한 지양(Aufheben)',
    '정과 반의 긴장 속에서 새로운 종합의 실마리를 엮어 가는 흐름',
    '양극단 중 한쪽에 쏠리지 않도록 대립의 뿌리를 차분히 응시할 시기',
  );
  const recognitionStage = describeHegelStage(
    res.mutualAnerkennungMaturityScore,
    '서로의 주체성을 온전히 인정하고 존중하는 성숙한 상호성',
    '관계 속 주도권과 배려의 균형을 조율하며 신뢰를 쌓는 과정',
    '일방적 증명 욕구를 내려놓고 상대의 시선을 먼저 읽어볼 시점',
  );
  const sittlichkeitStage = describeHegelStage(
    res.sittlichkeitEthicalLifeHarmonyScore,
    '개인의 자율과 공동체의 신뢰가 자연스럽게 맞물리는 인륜성 조화',
    '현실의 규칙과 내적 양심 사이에서 책임 있는 자리를 잡아가는 중',
    '관계와 공동체 안에서 지켜야 할 약속의 선을 다시 세울 때',
  );
  const realityStage = describeHegelStage(
    res.rationalRealityGraspScore,
    '현실의 필연성과 이성의 통찰이 한눈에 겹쳐 보이는 명료함',
    '이상과 현실의 간극을 좁히며 실행 가능한 맥락을 찾는 흐름',
    '막연한 당위보다 지금 눈앞의 구체적 현실 조건을 먼저 살필 시기',
  );
  const minervaStage = describeHegelStage(
    res.minervaReflectiveWisdomScore,
    '황혼녘 미네르바의 올빼미처럼 하루의 전모를 꿰뚫는 깊은 사후 성찰',
    '경험의 조각들을 모아 한 걸음 물러서서 의미를 길어 올리는 중',
    '즉각적인 반응 대신 한 박자 늦춰 전체 맥락을 되짚어 볼 때',
  );
  const temporalRhythmStage = describeHegelStage(
    res.temporalMinervaRhythm.dialecticalMaturityIndex,
    '변증법적 통찰과 성숙한 종합이 가장 깊게 무르익는 시간대',
    '일상의 대립을 차분히 소화하며 균형을 이어가는 리듬',
    '고요히 내면의 모순을 가라앉히고 다음 전환을 준비하는 시간',
  );

  return [
    `【G.W.F. 헤겔 변증법적 지양(Aufheben) & 인륜성 지표 v2.1 (순수 정성 성찰)】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 대립 갈등 지양(Aufheben): ${aufhebenStage}`,
    `- 상호 인정(Anerkennung): ${recognitionStage}`,
    `- 인륜성 공동체 신뢰(Sittlichkeit): ${sittlichkeitStage}`,
    `- 현실·이성 일치 통찰(Vernünftig & Wirklich): ${realityStage}`,
    `- 미네르바 올빼미 성찰(Minerva): ${minervaStage}`,
    `- 질문 맥락 변증법 계기: [${res.situationalDialecticalAudit.dialecticalMoment}] ${res.situationalDialecticalAudit.focusAxisKo}`,
    `- 원전 처방: ${res.situationalDialecticalAudit.classicalCitation} → ${res.situationalDialecticalAudit.synthesisDirective}`,
    `- 성찰 질문: ${res.situationalDialecticalAudit.reflectiveQuestion}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- KST 시공간 리듬: ${res.temporalMinervaRhythm.timeWindowKo} (${res.temporalMinervaRhythm.seasonKo}, ${temporalRhythmStage}) — ${res.temporalMinervaRhythm.dailySynthesisPractice}`,
    `- 종합 위상: ${res.hegelSynthesisMatrix.overallHegelGrade}`,
    `- 핵심 변증법 테마: ${res.activeHegelTheme.themeTitleKo} [${res.activeHegelTheme.themeTitleGerman}]`,
    `- 핵심 아포리즘: "${res.focalHegelAphorism.aphorismKo}" ("${res.focalHegelAphorism.aphorismGerman}")`,
    `- 일상 실천 의례: ${res.dailyPracticeRitual}`,
    `- 통합 변증 처방: ${res.hegelPersonalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
