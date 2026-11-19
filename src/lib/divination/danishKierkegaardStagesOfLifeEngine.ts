/**
 * 덴마크 쇠렌 키르케고르(Søren Kierkegaard) 《이것이냐 저것이냐》 & 《죽음에 이르는 병》 단독자(Den Enkelte) 3단계 실존 도약 엔진
 *
 * 19세기 덴마크 실존철학의 선구자 쇠렌 키르케고르(1813~1855)의 주저 《이것이냐 저것이냐(Enten-Eller)》, 《불안의 개념(Begrebet Angest)》, 《죽음에 이르는 병(Sygdommen til Døden)》, 《두려움과 떨림(Frygt og Bæven)》 원전 기반:
 * 1. 실존의 3단계(Tre Stadier på Livets Vei): 미적 실존(Aestetisk) → 윤리적 실존(Etisk) → 종교적 실존(Religiøst)
 * 2. 단독자(Den Enkelte)와 군중(Mængden) 탈피
 * 3. 불안(Angst)의 가능성과 신앙의 도약(Springet)
 * 4. 질문 맥락 실존 단계 진단(situationalStageAudit) + KST 시공간 리듬(temporalSolitudeRhythm) + 교차 검증 매트릭스(kierkegaardSynthesisMatrix)
 *
 * @version LUCKEY-KIERKEGAARD-STAGES-OF-LIFE-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const KIERKEGAARD_STAGES_OF_LIFE_VERSION = 'LUCKEY-KIERKEGAARD-STAGES-OF-LIFE-v2.3.0';

function describeKierkegaardStage(score: number): string {
  if (score >= 88) return '단독자의 용기 있는 도약 단계';
  if (score >= 76) return '자기 선택이 단단해지는 윤리 단계';
  if (score >= 64) return '불안을 마주하며 깨어나는 성찰 단계';
  return '군중의 시선을 거두고 내면을 살피는 초기 단계';
}

export interface KierkegaardTheme {
  themeKey: string;
  themeTitleDanish: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  existentialCounsel: string;
}

export interface KierkegaardAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismDanish: string;
  stageDimension: string;
  practicalAction: string;
}

export interface KierkegaardSituationalStageAudit {
  stageNameKo: '미적 실존(Aestetisk)' | '윤리적 실존(Etisk)' | '종교적 실존(Religiøst)';
  focusAxisKo: string;
  classicalCitation: string;
  leapDirective: string;
  reflectiveQuestion: string;
}

export interface KierkegaardTemporalSolitudeRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  leapReadinessIndex: number;
  dailySolitudePractice: string;
}

export interface KierkegaardSynthesisMatrix {
  denEnkelteAutonomy: number;
  angstSublimation: number;
  faithLeapCourage: number;
  overallExistentialGrade: string;
}

export interface KierkegaardStagesOfLifeResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 실존 지표 (0~100)
  existentialLeapCourageScore: number;       // 실존적 도약(Springet) 및 가치 선택 결단력
  denEnkelteAuthenticityScore: number;       // 군중 탈피 단독자(Den Enkelte) 주체성 지수
  angstPossibilityMasteryScore: number;      // 불안(Angst)을 창조적 가능성으로 승화하는 통찰도
  ethicalSelfChoiceCommitmentScore: number;  // 자기 선택(Vælg dig selv) 및 삶에 대한 성실도
  spiritSynthesisWholenessScore: number;     // 유한과 무한의 조화로운 자아 일치 평정심
  // 세부 체계
  activeKierkegaardTheme: KierkegaardTheme;
  focalKierkegaardAphorism: KierkegaardAphorism;
  situationalStageAudit: KierkegaardSituationalStageAudit;
  temporalSolitudeRhythm: KierkegaardTemporalSolitudeRhythm;
  kierkegaardSynthesisMatrix: KierkegaardSynthesisMatrix;
  kierkegaardPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  dailyPracticeRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
}

export type KierkegaardStagesOfLifeReport = KierkegaardStagesOfLifeResult;

const KIERKEGAARD_THEMES: KierkegaardTheme[] = [
  {
    themeKey: 'DenEnkelte',
    themeTitleDanish: 'Den Enkelte for Guds Aasyn',
    themeTitleKo: '단독자 (군중의 소음을 벗어나 홀로 서기)',
    philosophicalInsight: '군중은 비진리입니다. 다수의 의견이나 유행 뒤에 숨을 때 영혼은 고유성을 잃고 흐려집니다. 오직 자신의 양심과 영원 앞에 단독자로 마주 설 때 참된 자아가 깨어납니다.',
    existentialCounsel: '주변의 눈치나 타인의 평가에 휘둘리지 마십시오. 당신의 삶을 책임질 수 있는 유일한 주체는 바로 당신 자신입니다. 고요히 혼자 서서 진실을 선택하십시오.',
  },
  {
    themeKey: 'EntenEller',
    themeTitleDanish: 'Enten - Eller (Valget)',
    themeTitleKo: '이것이냐 저것이냐 (미온적 타협을 넘는 결단)',
    philosophicalInsight: '선택하지 않고 머뭇거리는 것 자체가 하나의 비겁한 선택입니다. 실존은 "이것도 좋고 저것도 좋다"는 안일함이 아니라, 전 인격을 걸고 하나를 선택하는 결단을 통해 형성됩니다.',
    existentialCounsel: '양쪽 모두를 쥐려다 에너지를 소진하지 마십시오. 지금은 명확한 우선순위를 정하고 결단해야 할 때입니다. 그 결단이 당신을 성장시킵니다.',
  },
  {
    themeKey: 'AngstAsPossibility',
    themeTitleDanish: 'Angest som Frihedens Mulighed',
    themeTitleKo: '불안과 자유 (심연을 건너는 창조적 용기)',
    philosophicalInsight: '불안은 병이 아니라, 우리가 무한한 가능성을 지닌 자유로운 존재임을 알리는 신호입니다. 불안을 두려워해 피하지 않고 품어 안을 때, 삶의 지평이 넓어집니다.',
    existentialCounsel: '마음속에 일어나는 막연한 불안을 자책하지 마십시오. 그것은 당신이 더 큰 도약을 준비하고 있다는 내면의 증거입니다. 한 걸음 내딛으십시오.',
  },
  {
    themeKey: 'LeapOfFaith',
    themeTitleDanish: 'Troens Spring over 70,000 Favne Vand',
    themeTitleKo: '신앙의 도약 (7만 길 심연을 건너는 신뢰)',
    philosophicalInsight: '이성적 계산과 논리만으로는 인생의 근원적 의미에 닿을 수 없습니다. 7만 길 깊은 바다 위를 건너듯, 확실한 증거가 없어도 궁극적 선과 진실을 믿고 뛰어내리는 도약이 필요합니다.',
    existentialCounsel: '모든 상황이 완전히 계산될 때까지 기다리지 마십시오. 가슴이 가리키는 숭고한 가치를 향해 용기 있게 도약하십시오. 그 도약 속에서 길이 열립니다.',
  },
  {
    themeKey: 'OvercomingDespair',
    themeTitleDanish: 'At ville være sig selv',
    themeTitleKo: '절망의 치유 (진정한 자기 자신이 되려는 의지)',
    philosophicalInsight: '가장 깊은 절망은 타인이 되려 하거나, 스스로를 혐오하며 자기 자신으로 있기를 거부하는 것입니다. 자신의 한계와 장점을 있는 그대로 받아들일 때 영혼의 평화가 찾아옵니다.',
    existentialCounsel: '남과 비교하여 자신을 깎아내리지 마십시오. 당신은 우주에서 대체될 수 없는 고유한 존재입니다. 있는 그대로의 자신을 긍정하고 사랑하십시오.',
  },
];

const KIERKEGAARD_APHORISMS: KierkegaardAphorism[] = [
  {
    aphorismKey: 'LifeUnderstoodBackwards',
    aphorismKo: '인생은 뒤를 돌아볼 때만 이해되지만, 우리는 앞을 향해 살아야만 한다',
    aphorismDanish: 'Livet maa forstaaes baglænds, men maae leves forlænds',
    stageDimension: '시간성과 실존적 전진',
    practicalAction: '과거의 후회에 얽매여 멈추지 말고, 불확실성을 껴안고 당당히 앞을 향해 걸어가십시오.',
  },
  {
    aphorismKey: 'DareToLoseFooting',
    aphorismKo: '도약하는 것은 순간적으로 발판을 잃는 것이지만, 도약하지 않는 것은 자기 자신을 잃는 것이다',
    aphorismDanish: 'At vove er at tabe Fodfæste et Øjeblik; ikke at vove er at tabe sig selv',
    stageDimension: '실존적 용기와 도약',
    practicalAction: '안전지대에만 머물지 말고, 성장과 성취를 위해 기꺼이 낯선 도전을 감행하십시오.',
  },
  {
    aphorismKey: 'PurityOfHeartOneThing',
    aphorismKo: '마음의 순결이란 오직 한 가지만을 진실하게 바라는 것이다',
    aphorismDanish: 'Hjertets Reenhed er at ville Eet',
    stageDimension: '단일한 지향과 정직성',
    practicalAction: '잡다한 욕심과 복잡한 계산을 비우고, 가장 본질적인 단 하나의 가치에 마음을 모으십시오.',
  },
  {
    aphorismKey: 'SilentBeforeGod',
    aphorismKo: '침묵 속에서 기도할 때, 비로소 인간은 듣는 법을 배운다',
    aphorismDanish: 'I Tavsheden lærer Mennesket at lytte',
    stageDimension: '내면의 고요와 경청',
    practicalAction: '끊임없이 말하려는 충동을 멈추고 고요한 침묵 속에서 양심의 작은 소리에 귀 기울이십시오.',
  },
];

function buildSituationalStageAudit(question: string, absHash: number): KierkegaardSituationalStageAudit {
  const q = question.trim();
  if (/선택|결정|이직|갈등|망설|둘 중|포기/.test(q)) {
    return {
      stageNameKo: '윤리적 실존(Etisk)',
      focusAxisKo: '미온적 유보를 끊는 \'이것이냐 저것이냐\'의 결단',
      classicalCitation: '《이것이냐 저것이냐》 제2부: "결단의 순간이야말로 인간이 비로소 자기 자신을 선택하는 윤리적 탄생이다."',
      leapDirective: '완벽한 보장을 기다리며 양다리를 걸치지 말고, 내가 책임질 단 하나의 길을 오늘 선명하게 선택하십시오.',
      reflectiveQuestion: '지금 결정하지 않고 미루는 동안 내가 잃고 있는 시간의 무게는 얼마입니까?',
    };
  }
  if (/불안|두려|걱정|초조|막연|어지럼/.test(q)) {
    return {
      stageNameKo: '종교적 실존(Religiøst)',
      focusAxisKo: '자유의 어지럼증(Angst)을 도약의 발판으로 삼기',
      classicalCitation: '《불안의 개념》 제1장: "불안은 자유가 가능성의 심연을 내려다볼 때 느끼는 어지럼증이다."',
      leapDirective: '불안을 없애려 도망치지 마십시오. 그 어지럼증은 당신 앞에 새로운 가능성의 문이 열렸다는 신호입니다.',
      reflectiveQuestion: '지금 나를 흔드는 불안 뒤에 숨어 있는, 내가 진짜 시도하고 싶은 가능성은 무엇입니까?',
    };
  }
  if (/외로|고독|혼자|관계|눈치|비교|남들/.test(q)) {
    return {
      stageNameKo: '종교적 실존(Religiøst)',
      focusAxisKo: '군중의 기준을 벗고 홀로 서는 단독자(Den Enkelte)',
      classicalCitation: '《관점》: "군중은 비진리다. 오직 단독자만이 진리 앞에 설 수 있다."',
      leapDirective: '타인의 박수나 유행의 잣대를 내려놓고, 아무도 보지 않을 때도 떳떳한 내 양심의 목소리에만 응답하십시오.',
      reflectiveQuestion: '세상의 시선을 전부 지우고 나 혼자 남았을 때 여전히 지키고 싶은 가치는 무엇입니까?',
    };
  }
  if (/권태|지루|무의미|공허|재미|쾌락/.test(q)) {
    return {
      stageNameKo: '미적 실존(Aestetisk)',
      focusAxisKo: '순간적 자극의 권태를 넘어 성실한 헌신으로 건너가기',
      classicalCitation: '《이것이냐 저것이냐》 제1부 〈윤작법〉: "미적 삶은 끝내 권태와 절망에 부딪힌다."',
      leapDirective: '기분이나 자극에 의존하는 수동적 태도를 접고, 작더라도 꾸준히 가꿀 수 있는 책임의 밭을 하나 정하십시오.',
      reflectiveQuestion: '잠깐의 재미가 식은 뒤에도 내 삶에 남길 수 있는 깊은 열매는 무엇입니까?',
    };
  }

  const stages: Array<'미적 실존(Aestetisk)' | '윤리적 실존(Etisk)' | '종교적 실존(Religiøst)'> = [
    '윤리적 실존(Etisk)',
    '종교적 실존(Religiøst)',
    '미적 실존(Aestetisk)',
  ];
  return {
    stageNameKo: stages[absHash % stages.length],
    focusAxisKo: '실존의 3단계를 관통하는 자기 선택과 신앙의 도약',
    classicalCitation: '《죽음에 이르는 병》: "진정한 자아는 자기 자신과 투명하게 관계 맺으려 할 때 완성된다."',
    leapDirective: '남의 시나리오를 사는 일을 멈추고, 지금 내 마음의 순결이 가리키는 한 가지 일에 온 마음을 기울이십시오.',
    reflectiveQuestion: '오늘 내 영혼이 가장 정직하게 "이것이다"라고 고백할 수 있는 선택은 무엇입니까?',
  };
}

function buildTemporalSolitudeRhythm(now: Date, baseScore: number): KierkegaardTemporalSolitudeRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 각성기(새 출발의 도약)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 결단기(뜨거운 선택)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 성찰기(단독자의 고요)'
        : '동계 침잠기(7만 길 심연)';

  let timeWindowKo = '오후의 선택 기로(Enten-Eller)';
  let hourBonus = 0;
  let dailySolitudePractice = '복잡한 선택지 중 미온적 타협 하나를 덜어내고 핵심 결단에 집중하십시오.';

  if (kstHour >= 5 && kstHour < 10) {
    timeWindowKo = '새벽의 침묵(Tavshed) · 순수한 지향';
    hourBonus = 6;
    dailySolitudePractice = '하루의 소음이 시작되기 전 5분간 침묵하며 오늘 지켜낼 단 하나의 가치를 정하십시오.';
  } else if (kstHour >= 10 && kstHour < 15) {
    timeWindowKo = '오전의 윤리적 소명(Etisk Kald)';
    hourBonus = 4;
    dailySolitudePractice = '약속과 책임을 회피하지 않고 묵묵히 완수함으로써 자기 선택의 무게를 입증하십시오.';
  } else if (kstHour >= 15 && kstHour < 20) {
    timeWindowKo = '오후의 결단 기로(Enten-Eller)';
    hourBonus = 3;
    dailySolitudePractice = '미루고 있던 결단 하나를 오늘 안에 매듭짓고 군중의 눈치를 걷어내십시오.';
  } else {
    timeWindowKo = '밤의 단독자(Den Enkelte) 성찰';
    hourBonus = 5;
    dailySolitudePractice = '하루의 모든 가면과 역할을 내려놓고, 오롯이 나 자신과 마주 앉아 내면의 소리를 들으십시오.';
  }

  return {
    kstHour,
    timeWindowKo,
    seasonKo,
    leapReadinessIndex: Math.min(100, Math.round(baseScore + hourBonus)),
    dailySolitudePractice,
  };
}

export function calculateKierkegaardStagesOfLife(
  profile: UserProfile,
  question = '',
  now: Date = new Date()
): KierkegaardStagesOfLifeResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    question.trim() +
    'KierkegaardStagesOfLife';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const existentialLeapCourageScore = 68 + (absHash % 31);
  const denEnkelteAuthenticityScore = 70 + ((absHash >> 3) % 29);
  const angstPossibilityMasteryScore = 67 + ((absHash >> 6) % 32);
  const ethicalSelfChoiceCommitmentScore = 69 + ((absHash >> 9) % 30);
  const spiritSynthesisWholenessScore = 66 + ((absHash >> 12) % 33);

  const themeIndex = (absHash >> 4) % KIERKEGAARD_THEMES.length;
  const aphorismIndex = (absHash >> 7) % KIERKEGAARD_APHORISMS.length;

  const activeKierkegaardTheme = KIERKEGAARD_THEMES[themeIndex];
  const focalKierkegaardAphorism = KIERKEGAARD_APHORISMS[aphorismIndex];
  const situationalStageAudit = buildSituationalStageAudit(question, absHash);
  const temporalSolitudeRhythm = buildTemporalSolitudeRhythm(now, existentialLeapCourageScore);

  const avgScore = Math.round(
    (existentialLeapCourageScore + denEnkelteAuthenticityScore + angstPossibilityMasteryScore) / 3
  );
  const kierkegaardSynthesisMatrix: KierkegaardSynthesisMatrix = {
    denEnkelteAutonomy: denEnkelteAuthenticityScore,
    angstSublimation: angstPossibilityMasteryScore,
    faithLeapCourage: existentialLeapCourageScore,
    overallExistentialGrade: avgScore >= 88
      ? '단독자의 신앙 도약(Springet)'
      : avgScore >= 78
        ? '자기 선택의 윤리적 각성(Vælg dig selv)'
        : '불안을 딛고 일어서는 성찰(Awakening)',
  };

  const counselTitle = `키르케고르 단독자 실존 철학: ${activeKierkegaardTheme.themeTitleKo}`;
  const philosophicalGuidance = `쇠렌 키르케고르의 철학은 군중의 안일함에서 벗어나 오롯한 단독자로서 자신의 삶을 선택하고 신뢰의 도약을 감행하도록 이끕니다. ` +
    `현재 질문은 [${situationalStageAudit.stageNameKo}] 단계의 '${situationalStageAudit.focusAxisKo}'와 맞닿아 있습니다. ` +
    `${situationalStageAudit.leapDirective} 아울러 '${focalKierkegaardAphorism.aphorismKo}'(${focalKierkegaardAphorism.stageDimension})을 기억하며 ` +
    `${temporalSolitudeRhythm.dailySolitudePractice}`;

  return {
    engineVersion: KIERKEGAARD_STAGES_OF_LIFE_VERSION,
    calculatedAtKst: `${new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00 (KST)`,
    existentialLeapCourageScore,
    denEnkelteAuthenticityScore,
    angstPossibilityMasteryScore,
    ethicalSelfChoiceCommitmentScore,
    spiritSynthesisWholenessScore,
    activeKierkegaardTheme,
    focalKierkegaardAphorism,
    situationalStageAudit,
    temporalSolitudeRhythm,
    kierkegaardSynthesisMatrix,
    kierkegaardPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    dailyPracticeRitual: `${temporalSolitudeRhythm.dailySolitudePractice} · ${focalKierkegaardAphorism.practicalAction}`,
    ritualAction: `${temporalSolitudeRhythm.dailySolitudePractice} · ${focalKierkegaardAphorism.practicalAction}`,
    reflectionFocus: situationalStageAudit.reflectiveQuestion,
    interpretiveBoundary: '키르케고르 실존 단계 엔진은 미래의 길흉을 고정된 점수로 예단하지 않고, 선택과 불안 앞에서 단독자로서 책임을 짊어지는 성찰의 렌즈를 제공합니다.',
  };
}

export function formatKierkegaardStagesOfLifePrompt(res: KierkegaardStagesOfLifeResult): string {
  return [
    `【쇠렌 키르케고르 단독자(Den Enkelte) & 실존 3단계 지표 (${res.engineVersion})】`,
    `- 실존적 도약(Springet): ${describeKierkegaardStage(res.existentialLeapCourageScore)} | 단독자 주체성: ${describeKierkegaardStage(res.denEnkelteAuthenticityScore)}`,
    `- 불안의 승화(Angst): ${describeKierkegaardStage(res.angstPossibilityMasteryScore)} | 자기 선택 성실도: ${describeKierkegaardStage(res.ethicalSelfChoiceCommitmentScore)} | 영적 평정: ${describeKierkegaardStage(res.spiritSynthesisWholenessScore)}`,
    `- 질문 맥락 실존 단계: [${res.situationalStageAudit.stageNameKo}] ${res.situationalStageAudit.focusAxisKo}`,
    `- 원전 처방: ${res.situationalStageAudit.classicalCitation} → ${res.situationalStageAudit.leapDirective}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.situationalStageAudit.reflectiveQuestion}`,
    `- 일상 실천 의례: ${res.dailyPracticeRitual}`,
    `- KST 시공간 리듬 (${res.calculatedAtKst}): ${res.temporalSolitudeRhythm.timeWindowKo} (${res.temporalSolitudeRhythm.seasonKo}, ${describeKierkegaardStage(res.temporalSolitudeRhythm.leapReadinessIndex)}) — ${res.temporalSolitudeRhythm.dailySolitudePractice}`,
    `- 종합 등급: ${res.kierkegaardSynthesisMatrix.overallExistentialGrade}`,
    `- 핵심 실존 테마: ${res.activeKierkegaardTheme.themeTitleKo} [${res.activeKierkegaardTheme.themeTitleDanish}]`,
    `- 핵심 아포리즘: "${res.focalKierkegaardAphorism.aphorismKo}" ("${res.focalKierkegaardAphorism.aphorismDanish}")`,
    `- 통합 실존 처방: ${res.kierkegaardPersonalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
