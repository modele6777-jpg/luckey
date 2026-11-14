/**
 * 프랑스 앙리 베르그송(Henri Bergson) 《시간과 자유의지》 & 《창조적 진화》 순수 지속(Durée pure) & 생명의 도약(Élan vital) 창조적 직관 지혜 엔진
 *
 * 프랑스 생명철학의 거장이자 1927년 노벨 문학상 수상 철학자 앙리 베르그송(Henri Bergson, 1859~1941)의 핵심 원전 기반:
 * 1. 순수 지속(Durée pure): 공간화된 시계 바늘의 분절적 시간을 넘어, 과거가 현재 속으로 끊임없이 흘러들어 눈덩이처럼 축적되는 유기적 의식의 연속성.
 * 2. 생명의 도약(Élan vital): 닫힌 물질적 관성과 결정론의 굴레를 뚫고, 미지의 새로운 형태를 향해 솟구치는 거대한 우주적 생명력.
 * 3. 직관 통찰(Intuition philosophique): 고정된 개념이나 분석의 외피를 뚫고, 대상의 내면 속으로 스스로를 투사하여 그 고유한 약동과 합일하는 지적 공감.
 * 4. 창조적 자유(Liberté créatrice): 우리의 행동이 인격 전체로부터 흘러나와 스스로의 독창적 삶을 조각해 나가는 완전한 실존적 자유.
 * 5. 열린 도덕과 생명성(Société ouverte): 폐쇄된 집단의 배타적 경계를 허물고, 모든 살아있는 존재를 향해 무한히 확장되는 열린 영성과 생명적 연대.
 *
 * @version LUCKEY-HENRI-BERGSON-ELAN-VITAL-v1.1.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_HENRI_BERGSON_VERSION = 'LUCKEY-HENRI-BERGSON-ELAN-VITAL-v1.1.0';

export type BergsonQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface BergsonTemporalRhythm {
  kstDateLabel: string;
  timeBand: '새벽 직관' | '오전 약동' | '오후 지속' | '저녁 성찰' | '심야 침잠';
  vitalTempo: string;
  temporalGuidance: string;
}

export interface BergsonTheme {
  themeKey: string;
  themeTitleFrench: string;
  themeTitleKo: string;
  vitalInsight: string;
  practicalCounsel: string;
}

export interface BergsonAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface HenriBergsonElanVitalResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: BergsonQuestionTopic;
  temporalBergsonRhythm: BergsonTemporalRhythm;
  // 5대 핵심 베르그송 생명·시간 지표 (내부 호환용 보존, 프롬프트 비노출)
  pureDurationContinuityScore: number;     // 순수 지속 자아 연속도 (Durée pure)
  elanVitalCreativeImpulseScore: number;   // 생명의 도약 창조적 약동력 (Élan vital)
  intuitiveSympathyInsightScore: number;   // 직관적 교감 통찰력 (Intuition philosophique)
  creativeFreedomUnfoldingScore: number;   // 전인격적 창조적 자유도 (Liberté créatrice)
  openSocietyVitalityIndex: number;        // 열린 도덕·생명 포용 지수 (Société ouverte)
  // 세부 분석
  activeBergsonTheme: BergsonTheme;
  focalBergsonAphorism: BergsonAphorism;
  practiceGuidance: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  bergsonComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const BERGSON_THEMES: BergsonTheme[] = [
  {
    themeKey: 'pure_duration',
    themeTitleFrench: 'La Durée pure (순수 지속)',
    themeTitleKo: '과거와 현재가 하나로 녹아 흘러가는 내면의 살아있는 시간',
    vitalInsight: '시간은 달력의 숫자가 아니라, 지나간 모든 순간이 지금의 당신 안에 유기적으로 스며들어 새로운 깊이를 빚어내는 질적 흐름입니다.',
    practicalCounsel: '조급하게 시계를 보며 매 순간을 성과로 쪼개지 마십시오. 당신이 축적해 온 소중한 경험과 감정들이 자연스럽게 무르익어 터져 나올 시간을 허락하십시오.',
  },
  {
    themeKey: 'elan_vital',
    themeTitleFrench: "L'Élan vital (생명의 도약)",
    themeTitleKo: '물질의 저항과 매너리즘을 뚫고 솟구치는 창조적 생명력',
    vitalInsight: '생명이란 기계적인 반복이 아니라, 예측할 수 없는 미지의 가능성을 향해 끊임없이 새로운 형태를 조각해 내는 거대한 분출입니다.',
    practicalCounsel: '과거의 전례나 정형화된 틀에 안주하지 마십시오. 당신의 내면 깊은 곳에서 솟구치는 원초적 생명 에너지를 믿고 과감히 새로운 도전을 감행하십시오.',
  },
  {
    themeKey: 'philosophical_intuition',
    themeTitleFrench: "L'Intuition philosophique (철학적 직관)",
    themeTitleKo: '개념의 껍질을 벗고 사물의 본질 속으로 뛰어드는 직접적 교감',
    vitalInsight: '지성은 사물을 쪼개고 분석할 뿐 생명의 심장을 보지 못합니다. 대상의 고유한 리듬에 스스로를 일치시키는 직관이야말로 참된 진리를 꿰뚫습니다.',
    practicalCounsel: '머리로만 재고 따지는 끝없는 분석을 잠시 멈추십시오. 가슴이 느끼는 미세한 영감과 공감의 울림에 온전히 몸을 맡길 때 올바른 해답이 열립니다.',
  },
  {
    themeKey: 'creative_freedom',
    themeTitleFrench: 'La Liberté créatrice (창조적 자유)',
    themeTitleKo: '인격 전체가 행위로 흘러들어 자기 자신을 창조하는 완전한 자유',
    vitalInsight: '자유란 둘 중 하나를 저울질하는 것이 아닙니다. 자신의 모든 영혼과 신념이 온전히 응축되어 하나의 행위로 표출될 때 우리는 진정으로 자유롭습니다.',
    practicalCounsel: '타인의 시선이나 세속적 손익에 휘둘리지 마십시오. 당신의 전 인격이 기꺼이 지지하고 울림을 주는 단 하나의 길에 당신 자신을 온전히 던지십시오.',
  },
  {
    themeKey: 'open_soul',
    themeTitleFrench: "L'Âme ouverte (열린 영혼과 생명애)",
    themeTitleKo: '폐쇄된 장벽을 넘어 우주 만물의 생명과 공명하는 무한한 포용',
    vitalInsight: '닫힌 사회의 율법과 두려움을 넘어설 때, 인류와 모든 살아있는 생명을 차별 없이 품어 안는 열린 사랑의 거대한 샘물이 솟아납니다.',
    practicalCounsel: '나와 너, 내 편과 네 편이라는 좁은 구획을 거두십시오. 마주하는 모든 생명과 상황을 따뜻한 자비와 호기심 어린 시선으로 품어 안으십시오.',
  },
];

export const BERGSON_APHORISMS: BergsonAphorism[] = [
  {
    aphorismKey: 'exister_changer',
    aphorismKo: '존재한다는 것은 변화하는 것이며, 변화한다는 것은 성숙하는 것이고, 성숙한다는 것은 끊임없이 자기 자신을 창조해 나가는 것이다.',
    aphorismFrench: "Exister, c'est changer; changer, c'est mûrir; mûrir, c'est se créer indéfiniment soi-même. (L'Évolution créatrice)",
    sourceContext: '《창조적 진화(L’Évolution créatrice)》',
    actionGuidance: '과거의 나에 머무르지 말고, 매일 아침 새롭게 태어나는 예술작품처럼 자신의 삶을 주체적으로 창조해 나가십시오.',
  },
  {
    aphorismKey: 'memory_presence',
    aphorismKo: '의식이란 곧 기억이며, 과거를 보존하고 축적하여 끊임없이 현재 속으로 밀어 넣는 힘이다.',
    aphorismFrench: "La conscience est un trait d'union entre ce qui a été et ce qui sera, un pont jeté entre le passé et l'avenir. (L'Énergie spirituelle)",
    sourceContext: '《정신적 에너지(L’Énergie spirituelle)》',
    actionGuidance: '지나간 모든 실패와 기쁨은 헛되지 않습니다. 그것들이 내면의 거름이 되어 현재의 결단을 묵직하게 지탱하고 있음을 믿으십시오.',
  },
  {
    aphorismKey: 'intuition_sympathy',
    aphorismKo: '직관이란 대상의 내면으로 스스로를 투사하여, 대상이 지닌 독특하고 표현 불가능한 본질과 일치하는 지적 공감이다.',
    aphorismFrench: "L'intuition est la sympathie par laquelle on se transporte à l'intérieur d'un objet. (Introduction à la métaphysique)",
    sourceContext: '《형이상학 입문(Introduction à la métaphysique)》',
    actionGuidance: '판단과 비판을 내려놓고 상대방의 입장과 상황 그 자체에 온전히 젖어 들어 보십시오. 진정한 이해는 거기서 시작됩니다.',
  },
  {
    aphorismKey: 'action_personality',
    aphorismKo: '우리는 우리의 행위가 우리의 인격 전체로부터 흘러나올 때, 그 행위가 우리 자신을 온전히 표현할 때 진정으로 자유롭다.',
    aphorismFrench: "Nous sommes libres quand nos actes émanent de notre personnalité entière, quand ils l'expriment. (Essai sur les données immédiates de la conscience)",
    sourceContext: '《시간과 자유의지(Essai sur les données immédiates de la conscience)》',
    actionGuidance: '남들이 정해준 기준이 아니라, 내 영혼의 가장 깊은 본질과 진실성이 온전히 담긴 행위를 선택하십시오.',
  },
  {
    aphorismKey: 'life_overcoming',
    aphorismKo: '생명은 물질의 저항을 헤치고 위를 향해 용솟음치는 거대한 폭발이자 끊임없는 도약이다.',
    aphorismFrench: "La vie est un élan qui traverse la matière, cherchant à lui arracher ce qu'elle peut de liberté. (L'Évolution créatrice)",
    sourceContext: '《창조적 진화(L’Évolution créatrice)》',
    actionGuidance: '눈앞의 환경적 제약이나 신체적 피로에 굴복하지 마십시오. 당신 안에는 물질적 한계를 돌파하는 무한한 생명력이 약동하고 있습니다.',
  },
];

export function classifyBergsonQuestionTopic(question?: string): BergsonQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/연애|사랑|관계|가족|친구|갈등|화해|이별|소통|사람|상대|동료|배우자/.test(q)) {
    return 'relationship';
  }
  if (/결정|선택|이직|창업|진로|도전|방향|사업|투자|계약|결단|시작|그만/.test(q)) {
    return 'decision';
  }
  if (/지치|불안|우울|회복|위로|상처|아픔|피로|휴식|번아웃|힘들|치유|걱정/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

export function buildBergsonTemporalRhythm(now: Date = new Date()): BergsonTemporalRhythm {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hour = kst.getUTCHours();

  if (hour >= 4 && hour < 8) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 새벽`,
      timeBand: '새벽 직관',
      vitalTempo: '순수 지속의 여명이 열리는 고요한 도약대',
      temporalGuidance: '분절된 일과가 시작되기 전, 밤사이 숙성된 내면의 직관이 가장 맑게 떠오르는 시간입니다.',
    };
  }
  if (hour >= 8 && hour < 12) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 오전`,
      timeBand: '오전 약동',
      vitalTempo: '엘랑 비탈(생명의 도약)이 현실로 분출하는 시간',
      temporalGuidance: '전인격적 자유 의지를 행동으로 옮겨 작은 돌파구를 열기에 알맞은 오전 흐름입니다.',
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 오후`,
      timeBand: '오후 지속',
      vitalTempo: '물질적 저항과 생명의 리듬을 조율하는 성숙의 흐름',
      temporalGuidance: '기계적 일정에 쫓기기보다 한 걸음 숨을 고르며 흐름의 결을 다시 직관적으로 읽어야 하는 시간입니다.',
    };
  }
  if (hour >= 18 && hour < 22) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 저녁`,
      timeBand: '저녁 성찰',
      vitalTempo: '하루의 경험이 기억으로 녹아내리는 열린 교감의 시간',
      temporalGuidance: '오늘 마주한 사람과 사건을 성과로 재단하지 말고, 내면의 지속 속에 따뜻하게 품어 안는 저녁입니다.',
    };
  }
  return {
    kstDateLabel: `${yyyy}-${mm}-${dd} 심야`,
    timeBand: '심야 침잠',
    vitalTempo: '시계 시간이 멎고 순수 기억과 무의식이 숨 쉬는 깊이',
    temporalGuidance: '조급한 분석을 멈추고 내면의 가장 깊은 울림이 스스로 형태를 드러내도록 기다려 주는 밤입니다.',
  };
}

function describeQualitativeLevel(score: number): string {
  if (score >= 90) return '충만한 도약 결';
  if (score >= 80) return '뚜렷한 생동 흐름';
  return '잔잔한 숙성 여운';
}

function buildBergsonTopicContext(
  topic: BergsonQuestionTopic,
  theme: BergsonTheme,
  temporal: BergsonTemporalRhythm
): {
  practiceGuidance: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
} {
  switch (topic) {
    case 'relationship':
      return {
        practiceGuidance: `관계 맥락에서는 상대를 고정된 성격이나 과거의 실수로 규정짓지 않는 직관적 공감이 핵심입니다. '${theme.themeTitleKo}'의 관점에서 상대의 내면 리듬에 귀 기울여 보세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 대화 전 30초간 시계를 보지 않고 상대의 최근 표정과 말투가 품은 진짜 감정을 한 문장으로 떠올려 보기`,
        reflectiveQuestion: '지금 내가 상대방의 어떤 변화를 미처 보지 못한 채 과거의 인상으로만 대하고 있지는 않은가요?',
      };
    case 'decision':
      return {
        practiceGuidance: `선택의 갈림길에서는 장단점 목록을 쪼개는 계산보다 인격 전체가 자연스럽게 기우는 방향을 읽는 창조적 자유가 중요합니다. '${theme.themeTitleKo}'가 그 기준을 밝혀 줍니다.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 두 선택지 중 하나를 실제로 고른 내일의 내 표정과 호흡을 1분간 생생히 상상해 보기`,
        reflectiveQuestion: '남의 기준과 손익 계산을 모두 내려놓았을 때, 내 삶 전체가 가장 자연스럽게 이어지는 선택은 무엇인가요?',
      };
    case 'healing':
      return {
        practiceGuidance: `지치고 흔들리는 시기에는 매 시간을 효율로 채우려는 강박을 놓아야 합니다. '${theme.themeTitleKo}'처럼 지금의 쉼조차 내일이 자라는 순수 지속의 일부임을 받아들이세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 스마트폰 타이머를 끄고 물 한 잔을 마시며 지나온 시간의 수고를 스스로 인정해 주는 5분 휴식 갖기`,
        reflectiveQuestion: '지금 나에게 필요한 것은 더 빠른 해결책인가요, 아니면 스스로 무르익을 수 있는 다정한 기다림인가요?',
      };
    case 'reflection':
    default:
      return {
        practiceGuidance: `자기 성찰의 질문 앞에서는 관성적인 습관을 깨고 내면의 생명이 어디로 향하는지 직관으로 들여다볼 때입니다. '${theme.themeTitleKo}'의 빛으로 오늘의 결을 살펴보세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 오늘 가장 살아 있다고 느꼈던 한 순간을 골라 그 이유를 짧게 기록하기`,
        reflectiveQuestion: '요즘 내 하루에서 관성으로 반복되는 부분과, 내면에서 새로 솟아오르려는 생명력은 각각 어디에 있나요?',
      };
  }
}

export function calculateHenriBergsonElanVital(
  profile: UserProfile,
  question?: string,
  now: Date = new Date()
): HenriBergsonElanVitalResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const questionTopic = classifyBergsonQuestionTopic(question);
  const temporalBergsonRhythm = buildBergsonTemporalRhythm(now);

  const seedString = `HENRI-BERGSON-ELAN-VITAL:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const pureDurationContinuityScore = 74 + (absHash % 25);
  const elanVitalCreativeImpulseScore = 72 + ((absHash >> 3) % 27);
  const intuitiveSympathyInsightScore = 73 + ((absHash >> 6) % 26);
  const creativeFreedomUnfoldingScore = 71 + ((absHash >> 9) % 28);
  const openSocietyVitalityIndex = 70 + ((absHash >> 12) % 29);

  const themeIndex = (absHash >> 4) % BERGSON_THEMES.length;
  const aphorismIndex = (absHash >> 7) % BERGSON_APHORISMS.length;

  const activeBergsonTheme = BERGSON_THEMES[themeIndex];
  const focalBergsonAphorism = BERGSON_APHORISMS[aphorismIndex];

  const { practiceGuidance, dailyPracticeRitual, reflectiveQuestion } = buildBergsonTopicContext(
    questionTopic,
    activeBergsonTheme,
    temporalBergsonRhythm
  );

  const interpretiveBoundary =
    '이 해석은 미래를 고정된 수치로 예단하는 점술이 아니라, 앙리 베르그송의 순수 지속과 엘랑 비탈 철학을 빌려 현재 삶의 리듬과 창조적 가능성을 비추어 보는 상징적 성찰 가이드입니다.';

  const guidanceTitle = `앙리 베르그송 생명의 도약 지혜: ${activeBergsonTheme.themeTitleKo}`;
  const philosophicalCounsel = `베르그송의 생명철학은 굳어버린 일상의 타성을 깨고 내면의 약동하는 지속과 창조적 자유를 회복하도록 일깨웁니다. ` +
    `현재 당신의 삶을 인도하는 핵심 원리는 '${activeBergsonTheme.themeTitleKo}'입니다. ` +
    `${activeBergsonTheme.practicalCounsel} ${practiceGuidance} 아울러 원전의 불멸의 통찰 "${focalBergsonAphorism.aphorismKo}"(${focalBergsonAphorism.aphorismFrench})을 마음에 품고, ` +
    `${focalBergsonAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_HENRI_BERGSON_VERSION,
    calculatedAtKst: temporalBergsonRhythm.kstDateLabel,
    questionTopic,
    temporalBergsonRhythm,
    pureDurationContinuityScore,
    elanVitalCreativeImpulseScore,
    intuitiveSympathyInsightScore,
    creativeFreedomUnfoldingScore,
    openSocietyVitalityIndex,
    activeBergsonTheme,
    focalBergsonAphorism,
    practiceGuidance,
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    bergsonComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatHenriBergsonElanVitalPrompt(res: HenriBergsonElanVitalResult): string {
  return [
    `【앙리 베르그송 《시간과 자유의지·창조적 진화》 순수 지속 & 생명의 도약 성찰 가이드】`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- KST 시공간 리듬: ${res.temporalBergsonRhythm.kstDateLabel} · ${res.temporalBergsonRhythm.timeBand} (${res.temporalBergsonRhythm.vitalTempo})`,
    `- 시공간 권면: ${res.temporalBergsonRhythm.temporalGuidance}`,
    `- 순수 지속 자아 연속성(Durée pure): ${describeQualitativeLevel(res.pureDurationContinuityScore)}`,
    `- 생명의 도약 창조적 약동(Élan vital): ${describeQualitativeLevel(res.elanVitalCreativeImpulseScore)}`,
    `- 직관적 교감 통찰(Intuition): ${describeQualitativeLevel(res.intuitiveSympathyInsightScore)}`,
    `- 전인격적 창조 자유(Liberté): ${describeQualitativeLevel(res.creativeFreedomUnfoldingScore)}`,
    `- 열린 도덕·생명 포용(Société ouverte): ${describeQualitativeLevel(res.openSocietyVitalityIndex)}`,
    `- 핵심 생명 테마: ${res.activeBergsonTheme.themeTitleKo} [${res.activeBergsonTheme.themeTitleFrench}]`,
    `- 철학적 통찰: ${res.activeBergsonTheme.vitalInsight}`,
    `- 실천적 조언: ${res.activeBergsonTheme.practicalCounsel}`,
    `- 맥락 맞춤 가이드: ${res.practiceGuidance}`,
    `- 오늘의 실천 의례(${res.questionTopic}): ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 핵심 경구: "${res.focalBergsonAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalBergsonAphorism.aphorismFrench}" [${res.focalBergsonAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalBergsonAphorism.actionGuidance}`,
    `- 종합 생명철학 권면: ${res.bergsonComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
