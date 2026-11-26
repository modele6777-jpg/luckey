/**
 * 독일 마틴 하이데거(Martin Heidegger) 《존재와 시간(Sein und Zeit)》 현존재(Dasein) & 세계-내-존재·죽음을 향한 존재 본래성(Eigentlichkeit) 실존 엔진
 *
 * 20세기 실존철학과 현상학의 거인 마틴 하이데거(Martin Heidegger, 1889~1976)의 주저 《존재와 시간(Sein und Zeit, 1927)》 핵심 원전 기반:
 * 1. 현존재(Dasein)와 세계-내-존재(In-der-Welt-sein)
 * 2. 세인(Das Man)의 일상성 탈피와 본래성(Eigentlichkeit)
 * 3. 피투성(Geworfenheit)과 기투(Entwurf)
 * 4. 죽음을 향한 존재(Sein-zum-Tode)와 순간(Augenblick)
 * 5. 질문 맥락 현존재 감사(situationalDaseinAudit) + KST 시공간 리듬(temporalAugenblickRhythm) + 교차 검증 매트릭스(daseinSynthesisMatrix)
 * 6. 질문 주제 분기(questionTopic) · 일상 실천 의례(dailyPracticeRitual) · 성찰 질문(reflectiveQuestion) · 해석 경계(interpretiveBoundary)
 *
 * v2.1.0 정성 체계: 결과 객체의 수치 필드는 내부 계산 호환용으로만 남기고,
 * 프롬프트 포맷터에서는 /100·%·원본 수치를 노출하지 않고 정성 단계 표현으로 전환합니다.
 *
 * @version LUCKEY-MARTIN-HEIDEGGER-BEING-AND-TIME-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_MARTIN_HEIDEGGER_VERSION = 'LUCKEY-MARTIN-HEIDEGGER-BEING-AND-TIME-v2.4.0';

export type HeideggerQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface HeideggerTheme {
  themeKey: string;
  themeTitleGerman: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface HeideggerAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface HeideggerSituationalDaseinAudit {
  existentialMode: '본래성(Eigentlichkeit)' | '선구적 결단(Vorlaufen)' | '세계-내-존재 실천(Zuhandenheit)';
  focusAxisKo: string;
  classicalCitation: string;
  authenticityDirective: string;
  reflectiveQuestion: string;
}

export interface HeideggerTemporalAugenblickRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  authenticityClarityIndex: number;
  // 정성 단계 표현 (프롬프트에는 이 값만 노출)
  clarityStageKo: string;
  dailyDaseinPractice: string;
}

export interface HeideggerDaseinSynthesisMatrix {
  dasManLiberation: number;
  entwurfProjection: number;
  seinsMutLucidity: number;
  overallDaseinGrade: string;
}

export interface MartinHeideggerBeingAndTimeResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: HeideggerQuestionTopic;
  // 5대 핵심 하이데거 실존 지표 (0~100)
  inDerWeltSeinRelationalScore: number;         // 세계-내-존재(In-der-Welt-sein) 및 근원적 존재 연관도
  dasManOvercomingAuthenticityScore: number;    // 세인(Das Man) 탈피 및 본래성(Eigentlichkeit) 지수
  geworfenheitEntwurfProjectScore: number;      // 피투성(Geworfenheit) 수용 및 미래 기투력(Entwurf)
  seinZumTodeLucidityScore: number;             // 죽음을 향한 존재(Sein-zum-Tode) 유한성 직시 및 실존 밀도도
  sorgeCareTemporalIndex: number;               // 염려(Sorge) 및 시간성(Zeitlichkeit) 원숙도
  // 세부 분석
  activeHeideggerTheme: HeideggerTheme;
  focalHeideggerAphorism: HeideggerAphorism;
  situationalDaseinAudit: HeideggerSituationalDaseinAudit;
  temporalAugenblickRhythm: HeideggerTemporalAugenblickRhythm;
  daseinSynthesisMatrix: HeideggerDaseinSynthesisMatrix;
  heideggerCrossAxis: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  heideggerComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const HEIDEGGER_THEMES: HeideggerTheme[] = [
  {
    themeKey: 'in_der_welt_sein',
    themeTitleGerman: 'In-der-Welt-sein (세계-내-존재)',
    themeTitleKo: '세상과 유리되지 않고 구체적 삶의 현장과 관계 맺는 실존',
    existentialInsight: '우리는 결코 머릿속 상상이나 방관자로 살 수 없습니다. 이미 구체적인 사물과 사람들의 그물망 속에 던져져 있으며, 사물을 직접 다루고(Zuhandenheit) 타인과 공존할 때 비로소 참된 자아를 만납니다.',
    practicalCounsel: '머뭇거리는 관념적 고민을 멈추고, 지금 눈앞에 닿아 있는 손쉬운 일과 곁에 있는 인연들에 온 마음으로 응답하십시오. 실천적 참여 속에 길이 열립니다.',
  },
  {
    themeKey: 'overcoming_das_man',
    themeTitleGerman: 'Dépassement de Das Man (세인의 지배 탈피와 본래성)',
    themeTitleKo: '남들의 시선과 세상의 잡담을 넘어 고유한 자기 자신으로 우뚝 섬',
    existentialInsight: '"남들이 다 그렇게 하니까"라는 무책임한 세인(Das Man)의 기준에 기대어 살면 평온해 보이지만, 정작 자기 삶의 주인이 되지 못합니다. 비본래적 안일함을 깨고 나만의 고유성을 마주해야 합니다.',
    practicalCounsel: '유행과 타인의 평가에 흔들리지 마십시오. 다수가 가는 편안한 길 대신, 내 양심과 직관이 가리키는 나만의 길을 택할 때 비로소 본래적인 삶이 시작됩니다.',
  },
  {
    themeKey: 'geworfenheit_und_entwurf',
    themeTitleGerman: 'Geworfenheit und Entwurf (피투성과 기투의 통일)',
    themeTitleKo: '주어진 한계를 받아들이고 미래의 가능성을 향해 도약함',
    existentialInsight: '우리는 태어난 시대와 가문, 조건을 선택하지 못하고 던져졌지만(피투성), 그 주어진 토대 위에서 어떤 미래를 창조할지 스스로를 던지는(기투) 자유를 지니고 있습니다.',
    practicalCounsel: '바꿀 수 없는 과거의 결핍이나 환경을 탓하지 마십시오. 그 주어진 한계 자체를 나만의 고유한 출발점으로 삼아 더 높은 가능성을 향해 담대히 도약하십시오.',
  },
  {
    themeKey: 'sein_zum_tode',
    themeTitleGerman: 'Sein-zum-Tode (죽음을 향한 존재와 선구적 결단)',
    themeTitleKo: '삶의 유한성을 직시하여 지금 이 순간을 가장 뜨겁게 불태움',
    existentialInsight: '죽음은 언젠가 닥칠 막연한 남의 일이 아니라, 누구도 대신할 수 없는 나의 절대적 유한성입니다. 끝이 있음을 깊이 깨달을 때 헛된 집착이 사라지고 오직 본질적인 것만 남습니다.',
    practicalCounsel: '오늘이 내 삶의 마지막 날일 수도 있다는 명석한 각성으로 하루를 맞이하십시오. 사소한 시비와 자존심 싸움을 내려놓고, 가장 소중한 일에 온 힘을 쏟으십시오.',
  },
  {
    themeKey: 'sorge_und_zeitlichkeit',
    themeTitleGerman: 'Sorge und Zeitlichkeit (염려와 순간의 결단)',
    themeTitleKo: '과거를 품고 미래를 열며 현재의 순간(Augenblick)에 몰입함',
    existentialInsight: '인간의 본질은 염려(Sorge)입니다. 과거의 기억을 디딤돌 삼아 아직 오지 않은 미래를 보살피며, 번개처럼 스쳐 지나가는 지금 이 찰나의 순간(Augenblick)에 단호히 결단하는 것입니다.',
    practicalCounsel: '미래에 대한 막연한 불안도, 과거의 후회도 모두 내려놓으십시오. 지금 당신의 손길이 닿는 현재의 한순간에 전력을 다해 결단하고 행동하십시오.',
  },
];

export const HEIDEGGER_APHORISMS: HeideggerAphorism[] = [
  {
    aphorismKey: 'dasein_essence_existence',
    aphorismKo: '현존재의 본질은 그의 실존에 놓여 있다.',
    aphorismGerman: 'Das »Wesen« des Daseins liegt in seiner Existenz.',
    sourceContext: '《존재와 시간(Sein und Zeit)》 제1부 제1장 §9',
    actionGuidance: '고정된 껍데기나 직함에 갇히지 말고, 매일 살아 움직이는 실천으로 자신을 새롭게 입증해 나가십시오.',
  },
  {
    aphorismKey: 'anticipation_of_death',
    aphorismKo: '죽음을 향한 선구는 현존재를 무수한 비본래적 가능성의 유혹으로부터 해방시킨다.',
    aphorismGerman: 'Das Vorlaufen in den Tod befreit von den unzähligen nichtigen Möglichkeiten.',
    sourceContext: '《존재와 시간》 제2부 제1장 §53',
    actionGuidance: '시간의 유한함을 자각함으로써 군더더기 집착과 무의미한 시비를 단칼에 정리하십시오.',
  },
  {
    aphorismKey: 'call_of_conscience',
    aphorismKo: '양심의 부름은 세인의 떠들썩한 잡담을 뚫고 오롯이 혼자 선 나 자신을 깨운다.',
    aphorismGerman: 'Der Ruf des Gewissens ruft das Dasein aus der Verlorenheit in das Man auf.',
    sourceContext: '《존재와 시간》 제2부 제2장 §57',
    actionGuidance: '세상의 시끄러운 소음 속에서 잠시 침묵을 지키고, 내면의 깊은 양심이 이끄는 소리에 귀 기울이십시오.',
  },
  {
    aphorismKey: 'moment_of_vision',
    aphorismKo: '순간이란 결단 속에서 상황을 명료하게 장악하고 미래를 향해 열리는 시간의 정점이다.',
    aphorismGerman: 'Der Augenblick ist das entschiedene Ergreifen der Situation in der Zeitlichkeit.',
    sourceContext: '《존재와 시간》 제2부 제3장 §68',
    actionGuidance: '지금 눈앞에 닥친 상황을 피하지 말고, 정면으로 마주하여 과감하게 결단을 내리십시오.',
  },
];

function buildSituationalDaseinAudit(question: string, absHash: number): HeideggerSituationalDaseinAudit {
  const q = question.trim();
  if (/남들|눈치|시선|유행|비교|체면|평판/.test(q)) {
    return {
      existentialMode: '본래성(Eigentlichkeit)',
      focusAxisKo: '세인(Das Man)의 익명성을 벗어나는 양심의 부름',
      classicalCitation: '《존재와 시간》 §27·§57: "세인의 지배로부터 자신을 되찾아오는 것이 본래적 실존이다."',
      authenticityDirective: '\'남들이 다 그렇게 한다\'는 핑계를 버리고, 아무도 대신 살아주지 않는 나만의 선택을 당당히 세우십시오.',
      reflectiveQuestion: '세상의 기준과 박수를 전부 끄고 나면 지금 내가 진짜 원하는 길은 무엇입니까?',
    };
  }
  if (/미래|이직|계획|도전|시작|목표|변화/.test(q)) {
    return {
      existentialMode: '선구적 결단(Vorlaufen)',
      focusAxisKo: '주어진 조건(피투성)을 딛고 미래로 던지는 기투(Entwurf)',
      classicalCitation: '《존재와 시간》 §31: "현존재는 자신의 가능성을 향해 스스로를 앞질러 던지는 기투적 존재다."',
      authenticityDirective: '조건이 완벽해지기를 기다리지 말고, 지금 손에 쥔 현실을 발판 삼아 미래를 향해 한 발 먼저 내던지십시오.',
      reflectiveQuestion: '주어진 환경의 핑계를 내려놓고 오늘 내가 직접 설계할 수 있는 한 걸음은 무엇입니까?',
    };
  }
  if (/시간|유한|나이|후회|늦|마감|끝|죽음/.test(q)) {
    return {
      existentialMode: '선구적 결단(Vorlaufen)',
      focusAxisKo: '유한성을 직시해 비본래적 군더더기를 덜어내는 각성',
      classicalCitation: '《존재와 시간》 §53: "유한성을 선구적으로 직시할 때 사소한 가능성들이 한꺼번에 걸러진다."',
      authenticityDirective: '시간이 무한한 것처럼 미루는 습관을 끊고, 가장 본질적인 단 한 가지 일에 오늘의 에너지를 모으십시오.',
      reflectiveQuestion: '삶의 유한함을 떠올릴 때 지금 당장 내려놓아야 할 사소한 집착은 무엇입니까?',
    };
  }
  if (/일|실천|현실|손|관계|생활|막막/.test(q)) {
    return {
      existentialMode: '세계-내-존재 실천(Zuhandenheit)',
      focusAxisKo: '추상적 관념을 넘어 손닿는 현장(Zuhandenheit)으로 들어가기',
      classicalCitation: '《존재와 시간》 §15: "세계는 구경거리가 아니라 손으로 다루며 돌보는 실천의 장이다."',
      authenticityDirective: '머릿속 시뮬레이션을 멈추고 지금 눈앞에 놓인 작은 일과 사람에게 직접 손길을 내미십시오.',
      reflectiveQuestion: '생각만 하던 일을 멈추고 지금 당장 손으로 만지고 처리할 수 있는 일은 무엇입니까?',
    };
  }

  const modes: Array<'본래성(Eigentlichkeit)' | '선구적 결단(Vorlaufen)' | '세계-내-존재 실천(Zuhandenheit)'> = [
    '본래성(Eigentlichkeit)',
    '선구적 결단(Vorlaufen)',
    '세계-내-존재 실천(Zuhandenheit)',
  ];
  return {
    existentialMode: modes[absHash % modes.length],
    focusAxisKo: '순간(Augenblick)의 결단으로 시간성을 장악하는 현존재',
    classicalCitation: '《존재와 시간》 §68: "순간이란 결단 속에서 상황을 명료하게 장악하는 시간의 정점이다."',
    authenticityDirective: '과거의 후회와 미래의 막연한 염려를 거두고, 지금 이 순간 내 양심이 가리키는 행동 하나를 실행하십시오.',
    reflectiveQuestion: '오늘 이 순간(Augenblick)에 내가 주인으로 깨어 있기 위해 취할 행동은 무엇입니까?',
  };
}

export function describeHeideggerStage(score: number): string {
  if (score >= 90) return '본래적 결단이 환히 열린 결(Eigentliche Entschlossenheit)';
  if (score >= 82) return '세인을 벗어나 기투가 깨어나는 결(Entwurf Awakening)';
  if (score >= 74) return '양심의 부름을 듣고 자리를 잡는 결(Ruf des Gewissens)';
  return '일상의 소음 속에서 방향을 더듬는 결(Alltäglichkeit)';
}

function buildTemporalAugenblickRhythm(now: Date, baseScore: number): HeideggerTemporalAugenblickRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 기투기(가능성의 개화)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 현존기(치열한 실천)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 각성기(본래성의 수확)'
        : '동계 침잠기(존재의 고요)';

  let timeWindowKo = '오후의 기투 결단(Entwurf)';
  let hourBonus = 0;
  let dailyDaseinPractice = '상황의 본질을 직시하고 미루던 결단 하나를 구체적 행동으로 옮기십시오.';

  if (kstHour >= 5 && kstHour < 10) {
    timeWindowKo = '새벽의 양심 부름(Ruf des Gewissens)';
    hourBonus = 6;
    dailyDaseinPractice = '세인의 잡담이 시작되기 전 고요한 아침에 오늘 내가 지킬 본래적 방향을 세우십시오.';
  } else if (kstHour >= 10 && kstHour < 15) {
    timeWindowKo = '오전의 세계-내-존재 실천(In-der-Welt-sein)';
    hourBonus = 5;
    dailyDaseinPractice = '관념적 망설임을 접고 눈앞의 일과 관계 속에 온전히 몸을 실어 참여하십시오.';
  } else if (kstHour >= 15 && kstHour < 20) {
    timeWindowKo = '오후의 순간 결단(Augenblick)';
    hourBonus = 4;
    dailyDaseinPractice = '하루의 흐름이 흩어지기 전에 가장 본질적인 과제 하나를 단호히 매듭지으십시오.';
  } else {
    timeWindowKo = '밤의 시간성 성찰(Zeitlichkeit)';
    hourBonus = 3;
    dailyDaseinPractice = '세상의 소음을 끄고 나의 유한성과 오늘의 진정성을 조용히 비추어 보십시오.';
  }

  const authenticityClarityIndex = Math.min(100, Math.round(baseScore + hourBonus));

  return {
    kstHour,
    timeWindowKo,
    seasonKo,
    authenticityClarityIndex,
    clarityStageKo: describeHeideggerStage(authenticityClarityIndex),
    dailyDaseinPractice,
  };
}

function classifyHeideggerQuestionTopic(question: string): HeideggerQuestionTopic {
  if (/관계|사람|가족|친구|동료|사랑|연인|갈등|다툼|다투|서운|만남|이별/.test(question)) return 'relationship';
  if (/결정|선택|이직|창업|시작|계획|진로|미래|도전|목표/.test(question)) return 'decision';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|지친|공허/.test(question)) return 'healing';
  return 'reflection';
}

function buildHeideggerTopicExtras(topic: HeideggerQuestionTopic): { dailyPracticeRitual: string; reflectiveQuestion: string } {
  switch (topic) {
    case 'relationship':
      return {
        dailyPracticeRitual: '오늘 마주치는 사람에게 세인의 잣대 대신 그 사람의 형편을 묻는 짧은 말 한마디 먼저 건네기.',
        reflectiveQuestion: '이 관계에서 나는 상대의 실제 모습을 보고 있습니까, 아니면 남들이 기대하는 모습을 보고 있습니까?',
      };
    case 'decision':
      return {
        dailyPracticeRitual: '미뤄 둔 결정 하나를 골라, 오늘 안에 되돌릴 수 있는 가장 작은 기투로 옮겨 보기.',
        reflectiveQuestion: '완벽한 조건을 기다리는 동안 미루고 있는 일은 무엇이며, 지금 손에 쥔 것으로 시작할 수 있는 부분은 어디입니까?',
      };
    case 'healing':
      return {
        dailyPracticeRitual: '하루 중 잠깐 모든 화면과 안내를 끄고, 내 유한함과 지금의 숨을 조용히 바라보는 시간 가지기.',
        reflectiveQuestion: '지금 나를 지치게 하는 염려 가운데 실제로 내가 손댈 수 있는 것과 그저 기다려야 하는 것은 무엇입니까?',
      };
    default:
      return {
        dailyPracticeRitual: '오늘 내 양심이 가리킨 행동 하나를 정해 두고, 잠들기 전에 그것을 했는지 짧게 적어 두기.',
        reflectiveQuestion: '세상의 소음과 남의 기대를 전부 끄고 나면, 오늘 내가 진짜로 하려 했던 일은 무엇입니까?',
      };
  }
}

export function calculateMartinHeideggerBeingAndTime(
  profile: UserProfile,
  question = '',
  now: Date = new Date()
): MartinHeideggerBeingAndTimeResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const questionTopic = classifyHeideggerQuestionTopic(question);

  const seedString = `MARTIN-HEIDEGGER-BEING-AND-TIME:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${question.trim()}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const inDerWeltSeinRelationalScore = 74 + (absHash % 25);
  const dasManOvercomingAuthenticityScore = 72 + ((absHash >> 3) % 27);
  const geworfenheitEntwurfProjectScore = 75 + ((absHash >> 6) % 24);
  const seinZumTodeLucidityScore = 71 + ((absHash >> 9) % 28);
  const sorgeCareTemporalIndex = 73 + ((absHash >> 12) % 26);

  const themeIndex = (absHash >> 4) % HEIDEGGER_THEMES.length;
  const aphorismIndex = (absHash >> 7) % HEIDEGGER_APHORISMS.length;

  const activeHeideggerTheme = HEIDEGGER_THEMES[themeIndex];
  const focalHeideggerAphorism = HEIDEGGER_APHORISMS[aphorismIndex];
  const situationalDaseinAudit = buildSituationalDaseinAudit(question, absHash);
  const temporalAugenblickRhythm = buildTemporalAugenblickRhythm(now, dasManOvercomingAuthenticityScore);

  const avgScore = Math.round(
    (dasManOvercomingAuthenticityScore + geworfenheitEntwurfProjectScore + seinZumTodeLucidityScore) / 3
  );
  const daseinSynthesisMatrix: HeideggerDaseinSynthesisMatrix = {
    dasManLiberation: dasManOvercomingAuthenticityScore,
    entwurfProjection: geworfenheitEntwurfProjectScore,
    seinsMutLucidity: seinZumTodeLucidityScore,
    overallDaseinGrade: avgScore >= 88
      ? '본래적 선구 결단(Eigentliche Entschlossenheit)'
      : avgScore >= 78
        ? '세인 탈피 및 기투 각성(Entwurf Awakening)'
        : '양심의 부름 경청(Ruf des Gewissens)',
  };

  const guidanceTitle = `마틴 하이데거 실존과 본래성 지혜: ${activeHeideggerTheme.themeTitleKo}`;
  const philosophicalCounsel = `하이데거의 실존 현상학은 세상의 안일한 세인(Das Man)의 기준에서 벗어나, 자신의 유한성을 직시하고 본래적인 자기 자신(Eigentlichkeit)으로 우뚝 서도록 일깨웁니다. ` +
    `현재 질문은 [${situationalDaseinAudit.existentialMode}]의 '${situationalDaseinAudit.focusAxisKo}'와 맞물려 있습니다. ` +
    `${situationalDaseinAudit.authenticityDirective} 아울러 《존재와 시간》의 경구 "${focalHeideggerAphorism.aphorismKo}"(${focalHeideggerAphorism.aphorismGerman})을 음미하고 ` +
    `${temporalAugenblickRhythm.dailyDaseinPractice}`;

  const topicExtras = buildHeideggerTopicExtras(questionTopic);
  const heideggerCrossAxis = `${situationalDaseinAudit.existentialMode} × ${activeHeideggerTheme.themeTitleKo} (${temporalAugenblickRhythm.timeWindowKo})`;
  const interpretiveBoundary =
    '하이데거의 실존 현상학 관점은 세인과 본래성의 갈림길을 상징적으로 비추는 성찰 렌즈입니다. 개인의 길흉과 미래를 단정하지 않고, 의학적·심리적 진단이나 전문 상담을 대신하지 않습니다.';

  return {
    engineVersion: GERMAN_MARTIN_HEIDEGGER_VERSION,
    calculatedAtKst: `${new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00 (KST)`,
    questionTopic,
    inDerWeltSeinRelationalScore,
    dasManOvercomingAuthenticityScore,
    geworfenheitEntwurfProjectScore,
    seinZumTodeLucidityScore,
    sorgeCareTemporalIndex,
    activeHeideggerTheme,
    focalHeideggerAphorism,
    situationalDaseinAudit,
    temporalAugenblickRhythm,
    daseinSynthesisMatrix,
    heideggerCrossAxis,
    dailyPracticeRitual: topicExtras.dailyPracticeRitual,
    reflectiveQuestion: topicExtras.reflectiveQuestion,
    ritualAction: topicExtras.dailyPracticeRitual,
    reflectionFocus: topicExtras.reflectiveQuestion,
    interpretiveBoundary,
    heideggerComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatMartinHeideggerBeingAndTimePrompt(res: MartinHeideggerBeingAndTimeResult): string {
  return [
    `【마틴 하이데거 《존재와 시간》 현존재 & 본래성 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락 초점: ${res.questionTopic}`,
    `- 세계-내-존재 존재연관 결(In-der-Welt-sein): ${describeHeideggerStage(res.inDerWeltSeinRelationalScore)}`,
    `- 세인 탈피 본래성 결(Eigentlichkeit): ${describeHeideggerStage(res.dasManOvercomingAuthenticityScore)}`,
    `- 피투성 수용 및 미래 기투 결(Entwurf): ${describeHeideggerStage(res.geworfenheitEntwurfProjectScore)}`,
    `- 유한성 직시 실존 밀도 결(Sein-zum-Tode): ${describeHeideggerStage(res.seinZumTodeLucidityScore)}`,
    `- 염려 및 시간성 원숙도(Sorge & Zeitlichkeit): ${describeHeideggerStage(res.sorgeCareTemporalIndex)}`,
    `- 질문 맥락 현존재 국면: [${res.situationalDaseinAudit.existentialMode}] ${res.situationalDaseinAudit.focusAxisKo}`,
    `- 원전 처방: ${res.situationalDaseinAudit.classicalCitation} → ${res.situationalDaseinAudit.authenticityDirective}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- KST 시공간 리듬: ${res.temporalAugenblickRhythm.timeWindowKo} (${res.temporalAugenblickRhythm.seasonKo}, 본래성 결 ${res.temporalAugenblickRhythm.clarityStageKo}) — ${res.temporalAugenblickRhythm.dailyDaseinPractice}`,
    `- 종합 등급: ${res.daseinSynthesisMatrix.overallDaseinGrade} (세인 탈피 ${describeHeideggerStage(res.daseinSynthesisMatrix.dasManLiberation)} · 기투 ${describeHeideggerStage(res.daseinSynthesisMatrix.entwurfProjection)} · 유한성 직시 ${describeHeideggerStage(res.daseinSynthesisMatrix.seinsMutLucidity)})`,
    `- 현존재 교차 축: ${res.heideggerCrossAxis}`,
    `- 핵심 실존 테마: ${res.activeHeideggerTheme.themeTitleKo} [${res.activeHeideggerTheme.themeTitleGerman}]`,
    `- 핵심 원전 경구: "${res.focalHeideggerAphorism.aphorismKo}"`,
    `- 일상 실천 의례: ${res.dailyPracticeRitual}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 종합 실존철학 권면: ${res.heideggerComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
