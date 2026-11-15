/**
 * 스위스 카를 융(Carl Gustav Jung) 《인간과 무의식의 상징》 & 《성격 유형》 개성화(Individuation) & 그림자·아니마/아니무스 원형 통합 엔진
 *
 * 20세기 분석심리학의 거장 카를 구스타프 융(1875~1961)의 주저 《원형과 집단무의식(Die Archetypen und das kollektive Unbewusste)》,
 * 《인간과 무의식의 상징(Man and His Symbols)》, 《성격 유형(Psychologische Typen)》 원전 기반:
 * 1. 개성화 과정(Individuation Process): 자아(Ego) 중심의 좁은 의식을 넘어, 무의식의 보물창고를 통합하여 내면의 온전한 전체성인 '자기(Self)' 원형에 도달하는 심리적 성숙.
 * 2. 그림자(Shadow, Schatten) 통합: 자신이 외면하거나 부인했던 어두운 충동과 약점을 회피하지 않고 의식으로 수용하여 거대한 창조적 활력으로 전환.
 * 3. 아니마/아니무스(Anima / Animus) 대극 조화: 남성 속 여성성(Anima), 여성 속 남성성(Animus)이라는 내적 대극(Enantiodromia)을 포용하여 심리적 양성구유의 온전함을 실현.
 * 4. 페르소나(Persona) 유연성: 사회적 적응을 위한 가면(Persona)과 진정한 내적 자기를 혼동하지 않고 유연하게 상황을 조율하는 경계 지혜.
 * 5. 동시성(Synchronicity): 물리적 인과율을 넘어 내면의 심리 상태와 외부 세계의 사건이 깊은 상징적 의미로 연결되는 초인과적 유의미한 일치 직관.
 *
 * @version LUCKEY-SWISS-JUNG-INDIVIDUATION-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const SWISS_JUNG_INDIVIDUATION_VERSION = 'LUCKEY-SWISS-JUNG-INDIVIDUATION-v2.0.0';

export interface JungArchetypeTheme {
  themeKey: string;
  themeTitleGerman: string;
  themeTitleKo: string;
  psychologicalInsight: string;
  individuationCounsel: string;
}

export interface JungAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  archetypeDimension: string;
  practicalAction: string;
}

export interface JungIndividuationArchetypeResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 분석심리학 지표 (0~100)
  individuationSelfRealizationScore: number;     // 개성화(Individuation) 및 자기(Self) 원형 실현도
  shadowIntegrationCourageScore: number;        // 그림자(Shadow) 직시 및 무의식 수용력
  animaAnimusHarmoniousBalanceScore: number;    // 내면의 아니마/아니무스 대극(Enantiodromia) 조화도
  personaFlexibilityWisdomScore: number;        // 사회적 가면(Persona) 유연성 및 자아 정체성 명석도
  synchronicityMeaningfulInsightScore: number;  // 동시성(Synchronicity) 의미 직관 및 전체성 감각
  // 세부 체계
  activeJungTheme: JungArchetypeTheme;
  focalJungAphorism: JungAphorism;
  jungPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  jungSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatJungKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export type JungIndividuationArchetypeReport = JungIndividuationArchetypeResult;

const JUNG_THEMES: JungArchetypeTheme[] = [
  {
    themeKey: 'ShadowIntegration',
    themeTitleGerman: 'Integration des Schattens',
    themeTitleKo: '그림자의 수용과 무의식의 금광',
    psychologicalInsight: '빛을 상상하는 것만으로는 밝아지지 않는다. 어둠을 의식화할 때 비로소 진정한 빛과 치유가 드러난다.',
    individuationCounsel: '외면하거나 부끄러워했던 감정과 약점을 정직하게 마주하고 끌어안을 때, 억압되었던 거대한 내적 창조력이 해방됩니다.',
  },
  {
    themeKey: 'IndividuationSelf',
    themeTitleGerman: 'Weg der Individuation und das Selbst',
    themeTitleKo: '개성화 여정과 본래적 자기의 실현',
    psychologicalInsight: '타인의 기대와 세상의 규범에 갇힌 가짜 자아를 벗어나, 오직 나만이 걸을 수 있는 고유한 전체성을 향해 나아간다.',
    individuationCounsel: '남과 비교하는 조급함을 내려놓고, 내면의 참된 자기(Self)가 가리키는 나침반에 온전히 집중하십시오.',
  },
  {
    themeKey: 'AnimaAnimusSyzygy',
    themeTitleGerman: 'Syzygie von Anima und Animus',
    themeTitleKo: '아니마와 아니무스의 내적 조화와 결합',
    psychologicalInsight: '이성과 감성, 논리와 직관, 능동과 수용이라는 내면의 대극이 서로를 배척하지 않고 조화로운 춤을 춘다.',
    individuationCounsel: '굳은 고정관념을 풀고, 부드러운 감수성과 명료한 분별력을 동시에 발휘하여 삶의 관계와 결정을 풍요롭게 가꾸십시오.',
  },
  {
    themeKey: 'PersonaTranscendence',
    themeTitleGerman: 'Reife Persona und Innere Wahrheit',
    themeTitleKo: '성숙한 페르소나와 내적 진실의 분별',
    psychologicalInsight: '가면은 세상과 소통하는 유용한 도구일 뿐, 가면 자체가 나의 참된 본질일 수는 없다.',
    individuationCounsel: '사회적 역할과 외부 평가에 영혼을 저당 잡히지 말고, 가면 뒤에 존재하는 고요하고 투명한 진짜 자신을 지키십시오.',
  },
  {
    themeKey: 'SynchronicityWisdom',
    themeTitleGerman: 'Synchronizität und Sinnvolle Koinzidenz',
    themeTitleKo: '동시성과 의미 있는 우연의 통찰',
    psychologicalInsight: '인과적 계산을 넘어서는 삶의 은밀한 질서와 계시가 적절한 순간 우리를 올바른 방향으로 이끈다.',
    individuationCounsel: '모든 것을 통제하려는 긴장을 풀고, 삶이 건네는 상징적 신호와 직관적 영감에 부드럽게 마음을 열어두십시오.',
  },
];

const JUNG_APHORISMS: JungAphorism[] = [
  {
    aphorismKey: 'UnconsciousToConscious',
    aphorismKo: '당신이 무의식을 의식화하지 않으면, 무의식이 당신의 삶을 지배하고 당신은 그것을 운명이라 부를 것이다',
    aphorismGerman: 'Bis du das Unbewusste bewusst machst, wird es dein Leben lenken und du wirst es Schicksal nennen',
    archetypeDimension: '의식화와 주체적 통찰',
    practicalAction: '반복되는 습관과 감정의 뿌리를 깊이 성찰하여, 무의식의 자동반응에서 벗어나 주체적 선택을 내리십시오.',
  },
  {
    aphorismKey: 'LookInsideAwaken',
    aphorismKo: '밖을 보는 자는 꿈을 꾸지만, 안을 들여다보는 자는 깨어난다',
    aphorismGerman: 'Wer nach außen schaut, träumt; wer nach innen schaut, erwacht',
    archetypeDimension: '내면 성찰과 각성',
    practicalAction: '외부의 소음과 자극에 휘둘리기보다, 하루에 잠시라도 조용히 마음속 깊은 바다를 관조하십시오.',
  },
  {
    aphorismKey: 'WholeRatherThanGood',
    aphorismKo: '완벽한 사람이 되기보다 온전한 사람이 되는 것이 훨씬 위대하다',
    aphorismGerman: 'Ich wäre lieber ganz als gut',
    archetypeDimension: '전체성과 상처의 포용',
    practicalAction: '무리한 완벽주의의 가면을 벗고, 불완전함과 인간미를 포용하는 온전한 전체성(Wholeness)을 추구하십시오.',
  },
  {
    aphorismKey: 'ShoeFitsForgetFoot',
    aphorismKo: '신발이 발에 맞으면 신발을 잊는다. 올바른 삶은 억지가 아니라 자연스러운 조화 속에 있다',
    aphorismGerman: 'Wenn der Schuh passt, vergisst man den Fuß',
    archetypeDimension: '자연스러운 자기 일치',
    practicalAction: '자신에게 맞지 않는 남의 옷을 억지로 입으려 하지 말고, 본성에 부합하는 자연스러운 흐름을 따르십시오.',
  },
  {
    aphorismKey: 'DeepestNightMorningStar',
    aphorismKo: '가장 어두운 밤이 깊을 때, 새벽의 별이 가장 밝게 떠오른다',
    aphorismGerman: 'In der tiefsten Nacht leuchtet der Morgenstern am hellsten',
    archetypeDimension: '시련 속의 변용과 희망',
    practicalAction: '현재의 막막함이나 혼란을 절망으로 보지 말고, 새로운 자아가 탄생하기 위한 탈피의 과정으로 믿으십시오.',
  },
];

export function calculateJungIndividuationArchetype(
  profile: UserProfile,
  question?: string,
  now: Date = new Date(),
): JungIndividuationArchetypeResult {
  const q = (question || '').trim();
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    q +
    'SwissJungIndividuationArchetype';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const individuationSelfRealizationScore = 69 + (absHash % 30);
  const shadowIntegrationCourageScore = 67 + ((absHash >> 3) % 32);
  const animaAnimusHarmoniousBalanceScore = 68 + ((absHash >> 6) % 31);
  const personaFlexibilityWisdomScore = 70 + ((absHash >> 9) % 29);
  const synchronicityMeaningfulInsightScore = 66 + ((absHash >> 12) % 33);

  const themeIndex = (absHash >> 4) % JUNG_THEMES.length;
  const aphorismIndex = (absHash >> 7) % JUNG_APHORISMS.length;

  const activeJungTheme = JUNG_THEMES[themeIndex];
  const focalJungAphorism = JUNG_APHORISMS[aphorismIndex];

  const counselTitle = `카를 융 개성화 원형 심리학: ${activeJungTheme.themeTitleKo}`;
  const philosophicalGuidance = `카를 구스타프 융의 분석심리학은 페르소나의 허상을 벗고 그림자를 통합하여 온전한 자기(Self)를 실현하도록 이끕니다. ` +
    `현재 당신의 무의식적 성숙에서 핵심적인 화두는 '${activeJungTheme.themeTitleKo}'에 있습니다. ` +
    `${activeJungTheme.individuationCounsel} 아울러 융의 명제인 '${focalJungAphorism.aphorismKo}'(${focalJungAphorism.archetypeDimension})을 마음에 새겨, ` +
    `${focalJungAphorism.practicalAction}`;

  const calculatedAtKst = formatJungKstTimestamp(now);
  const jungSynthesisMatrix = {
    dominantTension: `${activeJungTheme.themeTitleKo} ↔ ${focalJungAphorism.archetypeDimension}`,
    alignmentState: `${activeJungTheme.themeTitleGerman} · 개성화 통합`,
    integratedAction: `${focalJungAphorism.practicalAction}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: SWISS_JUNG_INDIVIDUATION_VERSION,
    calculatedAtKst,
    individuationSelfRealizationScore,
    shadowIntegrationCourageScore,
    animaAnimusHarmoniousBalanceScore,
    personaFlexibilityWisdomScore,
    synchronicityMeaningfulInsightScore,
    activeJungTheme,
    focalJungAphorism,
    jungPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    jungSynthesisMatrix,
  };
}

export function formatJungIndividuationArchetypePrompt(res: JungIndividuationArchetypeResult): string {
  const lines = [
    `【카를 융 개성화(Individuation) & 원형 통합 지표 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 핵심 분석 테마: ${res.activeJungTheme.themeTitleKo} [${res.activeJungTheme.themeTitleGerman}]`,
    `- 심리학적 통찰: ${res.activeJungTheme.psychologicalInsight}`,
    `- 개성화 조언: ${res.activeJungTheme.individuationCounsel}`,
    `- 핵심 아포리즘: "${res.focalJungAphorism.aphorismKo}"`,
    `- 독일어 원문: "${res.focalJungAphorism.aphorismGerman}" [${res.focalJungAphorism.archetypeDimension}]`,
    `- 실천적 행동 지침: ${res.focalJungAphorism.practicalAction}`,
    `- 통합 심리 처방: ${res.jungPersonalCounsel.philosophicalGuidance}`,
  ];
  if (res.jungSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스: [핵심 긴장: ${res.jungSynthesisMatrix.dominantTension} | 조율 상태: ${res.jungSynthesisMatrix.alignmentState}]`,
      `  · 통합 실천: ${res.jungSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
