/**
 * 프랑스/알제리 알베르 카뮈(Albert Camus) 《시지프 신화(Le Mythe de Sisyphe)》 & 《반항하는 인간》 부조리(Absurde)의 자각 & 지치지 않는 반항(Révolte)과 실존적 열정 엔진
 *
 * 프랑스 문학의 불멸의 거장이자 1957년 노벨 문학상 최연소 수상 철학자 알베르 카뮈(Albert Camus, 1913~1960)의 핵심 원전 기반.
 *
 * @version LUCKEY-ALBERT-CAMUS-ABSURD-REVOLT-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_ALBERT_CAMUS_VERSION = 'LUCKEY-ALBERT-CAMUS-ABSURD-REVOLT-v2.3.0';

export type CamusQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface CamusTheme {
  themeKey: string;
  themeTitleFrench: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface CamusAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface CamusSituationalAbsurdAudit {
  themeKo: string;
  sourceCitation: string;
  frenchQuote: string;
  translationKo: string;
  falseEscapeTrap: string;
  sisyphusFirstStep: string;
}

export interface CamusTemporalRevoltRhythm {
  kstWindow: string;
  seasonalTone: string;
  revoltFocus: '명석한 자각(Lucidité)' | '반항의 지속(Révolte)' | '현재의 열정(Passion)' | '연대의 온기(Solidarité)';
  lucidityClarityIndex: number;
  rhythmDirective: string;
}

export interface CamusSynthesisMatrix {
  absurdLucidity: number;
  revoltPersistence: number;
  presentPassion: number;
  overallSynthesis: number;
}

export interface AlbertCamusAbsurdRevoltResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 카뮈 실존·반항 지표 (0~100)
  absurdLucidityAwakeningScore: number;     // 부조리 명석한 자각도 (Lucidité de l'absurde)
  unceasingRevoltDignityScore: number;      // 굴하지 않는 반항과 실존 존엄도 (Révolte métaphysique)
  passionateVitalityIndex: number;          // 순간을 사랑하는 삶의 열정 지수 (Passion de vivre)
  lucidFreedomAutonomyScore: number;        // 환상을 걷어낸 실존적 자유도 (Liberté absurde)
  sisyphusHappinessResilienceScore: number; // 바위를 밀어 올리는 시지프의 행복 회복탄력성 (Bonheur de Sisyphe)
  // 세부 분석
  activeCamusTheme: CamusTheme;
  focalCamusAphorism: CamusAphorism;
  situationalAbsurdAudit: CamusSituationalAbsurdAudit;
  temporalRevoltRhythm: CamusTemporalRevoltRhythm;
  camusSynthesisMatrix: CamusSynthesisMatrix;
  questionTopic: CamusQuestionTopic;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  camusComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const CAMUS_THEMES: CamusTheme[] = [
  {
    themeKey: 'absurd_lucidity',
    themeTitleFrench: "La Lucidité de l'absurde (부조리의 자각)",
    themeTitleKo: '헛된 환상을 걷어내고 현실의 침묵과 부조리를 투명하게 직시함',
    existentialInsight: '세상은 우리에게 어떤 보장도 해 주지 않습니다. 하지만 이 차가운 사실을 똑바로 바라볼 때 비로소 거짓된 환각에서 벗어나 참된 주체로 설 수 있습니다.',
    practicalCounsel: '불합리한 일이나 뜻밖의 불운을 마주했을 때 억지로 섭리나 운명의 뜻을 갖다 붙이지 마십시오. 그 부조리를 냉철히 응시하며 당신의 존엄을 지키십시오.',
  },
  {
    themeKey: 'unceasing_revolt',
    themeTitleFrench: 'La Révolte permanente (영구한 반항)',
    themeTitleKo: '굴복하지도, 도피하지도 않고 매 순간 온몸으로 운명에 맞섬',
    existentialInsight: '반항이란 현실을 파괴하는 것이 아니라, 무의미한 세계 속에서 스스로 의미와 가치를 창조하며 인간의 고결함을 증명하는 가장 치열한 삶의 태도입니다.',
    practicalCounsel: '지치고 버거운 상황이라도 자포자기하지 마십시오. 매일 당신의 바위를 다시 밀어 올리는 끈질긴 반항이야말로 삶을 가장 빛나게 만드는 승리입니다.',
  },
  {
    themeKey: 'passion_of_living',
    themeTitleFrench: 'La Passion de vivre (삶의 열정)',
    themeTitleKo: '미래의 약속 대신 지금 눈앞의 살아있는 순간을 뜨겁게 긍정함',
    existentialInsight: '우리가 소유할 수 있는 유일한 영원은 지금 이 순간입니다. 햇살과 바람, 사람의 숨결 속에서 대지의 풍요로움을 온몸으로 만끽하는 것이 진정한 구원입니다.',
    practicalCounsel: '불확실한 내일의 성과를 위해 오늘의 생명력을 소모하지 마십시오. 지금 곁에 있는 사람, 오늘의 한 잔의 차, 대지의 온기를 뜨겁게 사랑하십시오.',
  },
  {
    themeKey: 'absurd_freedom',
    themeTitleFrench: 'La Liberté absurde (실존적 자유)',
    themeTitleKo: '모든 외부의 구속을 털어내고 자신의 행동을 오롯이 책임지는 자유',
    existentialInsight: '영원한 심판이나 교조적 규율이 사라진 자리에서, 우리는 매 순간 백지 위에 자신의 삶을 써 내려가는 온전하고도 무거운 자유를 얻게 됩니다.',
    practicalCounsel: '누군가 정해준 정답에 당신을 맞추지 마십시오. 당신의 선택이 낳을 결과를 기꺼이 감당하겠다는 결의를 품고 당신만의 길을 당당히 걸어가십시오.',
  },
  {
    themeKey: 'sisyphus_happiness',
    themeTitleFrench: 'Le Bonheur de Sisyphe (시지프의 행복과 연대)',
    themeTitleKo: '끝없는 고투 속에서도 자기 운명의 주인이 되는 참된 행복',
    existentialInsight: '시지프가 산꼭대기로 바위를 올리는 그 피땀 흘리는 과정이야말로 이미 운명을 정복한 것입니다. 우리는 고통 속에서도 서로를 안아주는 연대를 이룹니다.',
    practicalCounsel: '반복되는 일상의 수고로움을 무가치하다고 여기지 마십시오. 그 수고를 짊어진 당신의 어깨야말로 세상에서 가장 당당하고 아름다운 모습입니다.',
  },
];

export const CAMUS_APHORISMS: CamusAphorism[] = [
  {
    aphorismKey: 'sisyphe_heureux',
    aphorismKo: '산꼭대기를 향한 투쟁 그 자체만으로도 인간의 마음을 가득 채우기에 충분하다. 우리는 시지프가 행복하다고 상상해야 한다.',
    aphorismFrench: "La lutte elle-même vers les sommets suffit à remplir un cœur d'homme. Il faut imaginer Sisyphe heureux. (Le Mythe de Sisyphe)",
    sourceContext: '《시지프 신화(Le Mythe de Sisyphe)》',
    actionGuidance: '결과가 다시 원점으로 돌아갈지라도, 굴러떨어진 바위를 향해 걸어 내려가는 당신의 눈동자 속에 이미 운명을 넘어선 승리가 깃들어 있습니다.',
  },
  {
    aphorismKey: 'invincible_summer',
    aphorismKo: '겨울의 한복판에서, 나는 마침내 내 안에 결코 굴복하지 않는 불패의 여름이 자리 잡고 있음을 깨달았다.',
    aphorismFrench: "Au milieu de l'hiver, j'apprenais enfin qu'il y avait en moi un été invincible. (Retour à Tipasa)",
    sourceContext: '《티파사로의 귀환(Retour à Tipasa)》',
    actionGuidance: '혹독한 시련이나 외로움 속에서도 기죽지 마십시오. 당신 영혼의 심장부에는 그 어떤 한파도 얼릴 수 없는 눈부신 불꽃이 타오르고 있습니다.',
  },
  {
    aphorismKey: 'revolte_sommes',
    aphorismKo: '나는 반항한다, 그러므로 우리는 존재한다.',
    aphorismFrench: "Je me révolte, donc nous sommes. (L'Homme révolté)",
    sourceContext: '《반항하는 인간(L’Homme révolté)》',
    actionGuidance: '부당함과 무의미에 침묵하지 마십시오. 당신의 용기 있는 목소리와 저항은 고통받는 모든 이들과 이어지는 가장 거룩한 연대의 시작입니다.',
  },
  {
    aphorismKey: 'absurde_confrontation',
    aphorismKo: '부조리는 인간의 명료한 갈망과 세계의 비합리적인 침묵이 정면으로 부딪칠 때 태어난다.',
    aphorismFrench: "L'absurde naît de cette confrontation entre l'appel humain et le silence déraisonnable du monde. (Le Mythe de Sisyphe)",
    sourceContext: '《시지프 신화(Le Mythe de Sisyphe)》',
    actionGuidance: '세상이 왜 내 뜻대로 되지 않는지 원망하지 마십시오. 그 침묵 속에서 나만의 온전한 주체성을 세우는 위대한 기회를 발견하십시오.',
  },
  {
    aphorismKey: 'chance_better',
    aphorismKo: '자유란 더 나아질 기회에 다름 아니다.',
    aphorismFrench: "La liberté n'est rien d'autre qu'une chance d'être meilleur. (Actuelles)",
    sourceContext: '《시사평론(Actuelles)》',
    actionGuidance: '자유를 방종이나 불안으로 낭비하지 마십시오. 더 정직하고 더 따뜻하며 더 용기 있는 사람이 되기 위해 오늘 당신의 자유를 바치십시오.',
  },
];

function buildSituationalAbsurdAudit(question?: string): CamusSituationalAbsurdAudit {
  const q = (question ?? '').trim();
  if (/반복|지루|허무|무의미|제자리|바위|힘들/.test(q)) {
    return {
      themeKo: '시지프의 행복(Le Bonheur de Sisyphe)과 반복의 존엄',
      sourceCitation: '《시지프 신화(Le Mythe de Sisyphe)》 결어',
      frenchQuote: "La lutte elle-même vers les sommets suffit à remplir un cœur d'homme.",
      translationKo: '산꼭대기를 향한 투쟁 그 자체만으로도 인간의 마음을 가득 채우기에 충분하다.',
      falseEscapeTrap: '결과가 보이지 않는다는 이유로 오늘의 수고 자체를 무가치하다고 덮어 버리는 체념.',
      sisyphusFirstStep: '오늘 내가 밀어 올릴 바위 1개를 정직하게 고르고, 결과 평가 없이 그 1시간의 몰입 자체를 온전히 누리십시오.',
    };
  }
  if (/부당|억울|불의|갈등|관계|상처|연대/.test(q)) {
    return {
      themeKo: '반항하는 인간(L’Homme révolté)과 존엄의 연대',
      sourceCitation: '《반항하는 인간(L’Homme révolté)》 서문',
      frenchQuote: 'Je me révolte, donc nous sommes.',
      translationKo: '나는 반항한다, 그러므로 우리는 존재한다.',
      falseEscapeTrap: '분노를 삭이거나 냉소로 도망치며, 내가 지켜야 할 존엄의 선조차 흐려 버리는 침묵.',
      sisyphusFirstStep: '감정적 폭발 대신, "여기까지는 허용할 수 없다"는 존엄의 선 한 줄을 침착하고 분명하게 표현하십시오.',
    };
  }
  if (/불안|미래|외로|겨울|막막|실패/.test(q)) {
    return {
      themeKo: '티파사의 불패의 여름(Été invincible)과 현재 긍정',
      sourceCitation: '《티파사로의 귀환(Retour à Tipasa)》',
      frenchQuote: "Au milieu de l'hiver, j'apprenais enfin qu'il y avait en moi un été invincible.",
      translationKo: '겨울의 한복판에서 나는 마침내 내 안에 불패의 여름이 있음을 깨달았다.',
      falseEscapeTrap: '아직 오지 않은 미래의 보장만을 기다리며 지금 눈앞의 햇살과 숨결을 유예하는 습관.',
      sisyphusFirstStep: '오늘 하루 중 단 15분이라도 바깥 공기와 온기를 느끼며, 미래 걱정 없이 지금 살아 있음을 감각하십시오.',
    };
  }
  return {
    themeKo: '부조리의 명석한 자각(Lucidité)과 백지의 자유',
    sourceCitation: '《시지프 신화》 · 〈부조리의 추론〉',
    frenchQuote: "L'absurde naît de cette confrontation entre l'appel humain et le silence déraisonnable du monde.",
    translationKo: '부조리는 인간의 명료한 갈망과 세계의 비합리적인 침묵이 정면으로 부딪칠 때 태어난다.',
    falseEscapeTrap: '세상이 내 기대대로 답해 주지 않는다고 원망하며 스스로의 선택권마저 내려놓는 도피.',
    sisyphusFirstStep: '막연한 환상을 한 겹 걷어내고, 지금 내가 직접 통제해 바꿀 수 있는 오늘의 작은 한 수부터 실행하십시오.',
  };
}

function buildTemporalRevoltRhythm(now?: Date): CamusTemporalRevoltRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 티파사의 햇살처럼 생의 열정(Passion)이 대지에 깨어나는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 불패의 여름(Été invincible)으로 정면 돌파하는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 헛된 환상을 걷어내고 명석한 자각(Lucidité)을 세우는 계절'
          : '겨울 — 시련의 한복판에서도 내면의 불꽃과 연대를 지키는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '오전 명석한 자각(Lucidité) 출발 창',
      seasonalTone,
      revoltFocus: '명석한 자각(Lucidité)',
      lucidityClarityIndex: 91,
      rhythmDirective: '거짓 위안 없이 현실을 투명하게 직시하기 좋은 오전입니다. 오늘 밀어 올릴 핵심 바위 하나를 고르십시오.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '한낮 반항의 지속(Révolte) 돌파 창',
      seasonalTone,
      revoltFocus: '반항의 지속(Révolte)',
      lucidityClarityIndex: 86,
      rhythmDirective: '피로와 변수에 부딪히는 낮 시간입니다. 자포자기하지 않고 묵묵히 한 걸음 더 밀어 올리는 것이 승리입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 현재의 열정·연대(Solidarité) 창',
      seasonalTone,
      revoltFocus: '연대의 온기(Solidarité)',
      lucidityClarityIndex: 84,
      rhythmDirective: '결과 걱정을 잠시 접고, 곁에 있는 사람과의 따뜻한 대화와 오늘 저녁의 온기를 온전히 누리십시오.',
    };
  }
  return {
    kstWindow: '심야 불패의 여름(Été invincible) 내면 응시 창',
    seasonalTone,
    revoltFocus: '현재의 열정(Passion)',
    lucidityClarityIndex: 80,
    rhythmDirective: '세계의 침묵이 깊어지는 심야입니다. 내 안의 꺾이지 않는 생명력을 확인하며 고요히 쉬십시오.',
  };
}

function classifyCamusQuestionTopic(question?: string): CamusQuestionTopic {
  const q = (question ?? '').trim();
  if (/부당|억울|불의|갈등|관계|상처|연대|가족|동료|사랑/.test(q)) return 'relationship';
  if (/선택|결정|결단|진로|이직|도전|방향|포기/.test(q)) return 'decision';
  if (/불안|미래|외로|겨울|막막|실패|지치|힘들|위로|치유/.test(q)) return 'healing';
  return 'reflection';
}

function describeCamusLevel(score: number): string {
  if (score >= 88) return '명석하고 충만한 절정';
  if (score >= 80) return '단단히 깨어 있는 흐름';
  return '고요히 응시하며 다지는 국면';
}

function buildCamusQualitativePractice(topic: CamusQuestionTopic): {
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
} {
  const interpretiveBoundary =
    '이 관점은 알베르 카뮈의 실존철학을 바탕으로 오늘의 태도를 성찰하는 상징적 지표이며, 길흉 예언이나 사주 오행의 수리 계산을 대체하지 않습니다.';
  if (topic === 'relationship') {
    return {
      dailyPracticeRitual: '오늘 대화에서 내 존엄의 경계를 지키는 정직한 한 문장을 차분히 건네고, 상대의 체온을 함께 살피십시오.',
      reflectiveQuestion: '지금 이 관계에서 내가 침묵으로 삼키거나 냉소로 회피하고 있는 존엄의 선은 어디인가요?',
      interpretiveBoundary,
    };
  }
  if (topic === 'decision') {
    return {
      dailyPracticeRitual: '완벽한 보장을 기다리는 대신, 오늘 내가 직접 책임지고 밀어 올릴 바위 1가지를 골라 첫 30분을 실행하십시오.',
      reflectiveQuestion: '결과가 보장되지 않더라도, 지금 이 선택 자체가 나를 부끄럽지 않게 만드는 이유는 무엇인가요?',
      interpretiveBoundary,
    };
  }
  if (topic === 'healing') {
    return {
      dailyPracticeRitual: '오늘 15분만이라도 미래 걱정을 내려놓고 햇살·바람·따뜻한 차 한 잔으로 지금 살아 있음을 감각하십시오.',
      reflectiveQuestion: '지금 내 마음의 겨울 한복판에서도 아직 식지 않고 남아 있는 불패의 여름은 무엇인가요?',
      interpretiveBoundary,
    };
  }
  return {
    dailyPracticeRitual: '오늘 반복되는 일상 한 장면에서 결과 평가를 잠시 멈추고, 그 수고에 담긴 나만의 리듬을 온전히 느껴 보십시오.',
    reflectiveQuestion: '세상이 내가 바란 답을 주지 않을 때, 나는 어떤 태도로 오늘의 주인이 될 수 있을까요?',
    interpretiveBoundary,
  };
}

export function calculateAlbertCamusAbsurdRevolt(
  profile: UserProfile,
  question?: string,
  now?: Date,
): AlbertCamusAbsurdRevoltResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `ALBERT-CAMUS-ABSURD-REVOLT:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const absurdLucidityAwakeningScore = 75 + (absHash % 24);
  const unceasingRevoltDignityScore = 73 + ((absHash >> 3) % 26);
  const passionateVitalityIndex = 72 + ((absHash >> 6) % 27);
  const lucidFreedomAutonomyScore = 74 + ((absHash >> 9) % 25);
  const sisyphusHappinessResilienceScore = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % CAMUS_THEMES.length;
  const aphorismIndex = (absHash >> 7) % CAMUS_APHORISMS.length;

  const activeCamusTheme = CAMUS_THEMES[themeIndex];
  const focalCamusAphorism = CAMUS_APHORISMS[aphorismIndex];
  const situationalAbsurdAudit = buildSituationalAbsurdAudit(question);
  const temporalRevoltRhythm = buildTemporalRevoltRhythm(now);
  const questionTopic = classifyCamusQuestionTopic(question);
  const qualitativePractice = buildCamusQualitativePractice(questionTopic);

  const absurdLucidity = Math.min(99, Math.round((absurdLucidityAwakeningScore + lucidFreedomAutonomyScore) / 2));
  const revoltPersistence = Math.min(99, Math.round((unceasingRevoltDignityScore + temporalRevoltRhythm.lucidityClarityIndex) / 2));
  const presentPassion = Math.min(99, Math.round((passionateVitalityIndex + sisyphusHappinessResilienceScore) / 2));
  const overallSynthesis = Math.round((absurdLucidity + revoltPersistence + presentPassion) / 3);

  const camusSynthesisMatrix: CamusSynthesisMatrix = {
    absurdLucidity,
    revoltPersistence,
    presentPassion,
    overallSynthesis,
  };

  const guidanceTitle = `알베르 카뮈 부조리와 반항 지혜: ${activeCamusTheme.themeTitleKo}`;
  const philosophicalCounsel = `알베르 카뮈의 철학은 무의미한 세계 앞에서 절망하거나 비겁한 도피에 빠지지 않고, 당당한 반항과 뜨거운 열정으로 삶을 긍정하도록 촉구합니다. ` +
    `현재 당신이 마주한 실존적 과제는 '${activeCamusTheme.themeTitleKo}'입니다. ` +
    `${activeCamusTheme.practicalCounsel} 아울러 《시지프 신화》의 불멸의 선언 "${focalCamusAphorism.aphorismKo}"(${focalCamusAphorism.aphorismFrench})을 가슴에 품고, ` +
    `${focalCamusAphorism.actionGuidance}`;

  const kstBase = new Date((now ?? new Date()).getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kstBase.toISOString().slice(0, 10)} ${String(kstBase.getUTCHours()).padStart(2, '0')}:${String(kstBase.getUTCMinutes()).padStart(2, '0')} +09:00 (KST)`;

  return {
    engineVersion: FRENCH_ALBERT_CAMUS_VERSION,
    calculatedAtKst,
    absurdLucidityAwakeningScore,
    unceasingRevoltDignityScore,
    passionateVitalityIndex,
    lucidFreedomAutonomyScore,
    sisyphusHappinessResilienceScore,
    activeCamusTheme,
    focalCamusAphorism,
    situationalAbsurdAudit,
    temporalRevoltRhythm,
    camusSynthesisMatrix,
    questionTopic,
    dailyPracticeRitual: qualitativePractice.dailyPracticeRitual,
    reflectiveQuestion: qualitativePractice.reflectiveQuestion,
    ritualAction: qualitativePractice.dailyPracticeRitual,
    reflectionFocus: qualitativePractice.reflectiveQuestion,
    interpretiveBoundary: qualitativePractice.interpretiveBoundary,
    camusComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAlbertCamusAbsurdRevoltPrompt(res: AlbertCamusAbsurdRevoltResult): string {
  return [
    `【알베르 카뮈 《시지프 신화》 부조리의 자각 & 실존적 반항 관점 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 부조리 자각·반항·열정 결: 자각(${describeCamusLevel(res.absurdLucidityAwakeningScore)}) / 반항(${describeCamusLevel(res.unceasingRevoltDignityScore)}) / 열정(${describeCamusLevel(res.passionateVitalityIndex)})`,
    `- 실존적 자유·회복 결: 자유(${describeCamusLevel(res.lucidFreedomAutonomyScore)}) / 시지프의 행복(${describeCamusLevel(res.sisyphusHappinessResilienceScore)})`,
    `- 핵심 실존 테마: ${res.activeCamusTheme.themeTitleKo} [${res.activeCamusTheme.themeTitleFrench}]`,
    `- 질문 맥락 부조리 감사 (${res.situationalAbsurdAudit.themeKo} · ${res.situationalAbsurdAudit.sourceCitation}): "${res.situationalAbsurdAudit.translationKo}" [${res.situationalAbsurdAudit.frenchQuote}]`,
    `- 거짓 도피 경계: ${res.situationalAbsurdAudit.falseEscapeTrap}`,
    `- 시지프의 첫걸음: ${res.situationalAbsurdAudit.sisyphusFirstStep}`,
    `- KST 반항 리듬: ${res.temporalRevoltRhythm.kstWindow} (${res.temporalRevoltRhythm.revoltFocus} · ${res.temporalRevoltRhythm.seasonalTone}) — ${res.temporalRevoltRhythm.rhythmDirective}`,
    `- 카뮈 매트릭스: 자각(${describeCamusLevel(res.camusSynthesisMatrix.absurdLucidity)}) · 반항 지속(${describeCamusLevel(res.camusSynthesisMatrix.revoltPersistence)}) · 현재 열정(${describeCamusLevel(res.camusSynthesisMatrix.presentPassion)})`,
    `- 오늘의 실천 의례(${res.questionTopic}): ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 실존철학 권면: ${res.camusComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
