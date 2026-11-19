/**
 * 독일 프리드리히 니체(Friedrich Nietzsche) 《차라투스트라는 이렇게 말했다》 초인(Übermensch) & 아모르 파티(Amor Fati) 디오니소스적 운명 긍정 엔진
 *
 * 19세기 독일의 실존철학자 프리드리히 니체(1844~1900)의 대표 주저 《차라투스트라는 이렇게 말했다(Also sprach Zarathustra)》, 《즐거운 학문(Die fröhliche Wissenschaft)》, 《우상의 황혼(Götzen-Dämmerung)》, 《이 사람을 보라(Ecce Homo)》 원전 기반:
 * 1. 아모르 파티(Amor Fati, 운명애): "내 모든 필연성을 사랑하라."
 * 2. 세 가지 변화(Drei Verwandlungen des Geistes): 낙타(Kamel) → 사자(Löwe) → 아이(Kind)
 * 3. 초인(Übermensch)과 자기 극복(Selbstüberwindung)
 * 4. 영원회귀(Ewige Wiederkunft)와 위대한 정오(Großer Mittag)
 * 5. 질문 맥락 정신 변신 진단(situationalMetamorphosis) + KST 시공간 리듬(temporalZarathustraRhythm) + 교차 검증 매트릭스(uebermenschSynthesisMatrix) + 순수 정성 성찰(v2.1.0)
 *
 * @version LUCKEY-NIETZSCHE-ZARATHUSTRA-AMOR-FATI-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const NIETZSCHE_ZARATHUSTRA_AMOR_FATI_VERSION = 'LUCKEY-NIETZSCHE-ZARATHUSTRA-AMOR-FATI-v2.3.0';

export interface NietzscheTheme {
  themeKey: string;
  themeTitleGerman: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  affirmationCounsel: string;
}

export interface NietzscheAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  creativeDimension: string;
  actionDirective: string;
}

export interface NietzscheSituationalMetamorphosis {
  focusAxisKo: string;
  metamorphosisStage: '낙타(Kamel)' | '사자(Löwe)' | '아이(Kind)';
  classicalCitation: string;
  overcomingPrescription: string;
  reflectiveQuestion: string;
}

export interface NietzscheTemporalZarathustraRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  dionysianPulseIndex: number;
  dailyAffirmationPractice: string;
}

export interface NietzscheUebermenschMatrix {
  amorFatiResilience: number;
  selfOvercomingMomentum: number;
  eternalRecurrenceClarity: number;
  overallZarathustraGrade: string;
}

export interface NietzscheZarathustraAmorFatiResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 초인 지표 (0~100)
  amorFatiRadicalAffirmationScore: number;  // 아모르 파티(Amor Fati) 운명에 대한 절대적 긍정도
  threeMetamorphosesCreativeScore: number;  // 3단계 변신(낙타·사자·아이) 창조적 자유 지수
  uebermenschSelfOvercomingScore: number;   // 초인(Übermensch) 자기 극복 및 창조력
  eternalRecurrenceResolveScore: number;    // 영원회귀(Ewige Wiederkunft) 순간 결단력
  dionysianVitalityDriveScore: number;      // 디오니소스적 생명력과 내적 활력도
  // 세부 체계
  activeNietzscheTheme: NietzscheTheme;
  focalNietzscheAphorism: NietzscheAphorism;
  situationalMetamorphosis: NietzscheSituationalMetamorphosis;
  temporalZarathustraRhythm: NietzscheTemporalZarathustraRhythm;
  uebermenschSynthesisMatrix: NietzscheUebermenschMatrix;
  dailyPracticeRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  nietzschePersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type NietzscheZarathustraAmorFatiReport = NietzscheZarathustraAmorFatiResult;

const NIETZSCHE_THEMES: NietzscheTheme[] = [
  {
    themeKey: 'AmorFati',
    themeTitleGerman: 'Amor Fati - Liebe zum Schicksal',
    themeTitleKo: '아모르 파티 (운명을 사랑하라: 필연에 대한 찬미)',
    philosophicalInsight: '자신의 운명을 원망하거나 바꾸려 애태우지 않고, 겪어온 모든 슬픔과 시련까지도 온전히 긍정할 때 인간은 위대해집니다. 지나간 상처는 당신을 단련한 위대한 자양분입니다.',
    affirmationCounsel: '과거의 아쉬움이나 억울함을 이제 축복으로 바꾸십시오. "그것이 삶이었던가? 좋다! 그렇다면 다시 한번!"이라는 기백으로 현재를 환호하십시오.',
  },
  {
    themeKey: 'ThreeMetamorphoses',
    themeTitleGerman: 'Von den drei Verwandlungen: Kamel, Löwe, Kind',
    themeTitleKo: '세 가지 변화 (낙타의 인내, 사자의 자유, 아이의 창조)',
    philosophicalInsight: '정신은 먼저 의무를 견디는 낙타가 되고, 억압에 저항하는 사자가 되며, 마침내 순진무구하게 새로운 놀이를 시작하는 어린아이가 됩니다. 창조는 어린아이 같은 자발성에서 옵니다.',
    affirmationCounsel: '의무감과 분노의 단계를 지나 이제 순수한 창조의 어린아이가 되십시오. 가벼운 마음으로 새로운 시작의 팽이를 힘차게 돌리십시오.',
  },
  {
    themeKey: 'SelfOvercoming',
    themeTitleGerman: 'Der Mensch ist etwas, das überwunden werden soll',
    themeTitleKo: '자기 극복과 초인 (어제의 나를 딛고 일어서기)',
    philosophicalInsight: '인간은 짐승과 초인 사이에 놓인 밧줄입니다. 현실에 안주하지 않고 부단히 자신의 한계와 타성을 부수고 나아가는 자만이 진정한 자기 삶의 창조자가 됩니다.',
    affirmationCounsel: '어제까지의 편안한 습관이나 타인의 박수에 만족하지 마십시오. 당신 안에 잠든 더 높은 가능성을 깨우고 스스로를 극복해 나가십시오.',
  },
  {
    themeKey: 'EternalRecurrence',
    themeTitleGerman: 'Die Ewige Wiederkunft des Gleichen',
    themeTitleKo: '영원회귀 (영원의 무게로 순간을 살아가기)',
    philosophicalInsight: '지금 당신이 내리는 결정과 삶의 태도가 무한히 반복된다 해도 기쁘게 감당할 수 있는가? 이 거대한 물음이야말로 미온적이고 후회스러운 삶을 단칼에 잘라내는 칼날입니다.',
    affirmationCounsel: '대충 시간만 보내는 선택을 멈추십시오. 영원히 되풀이되어도 후회 없을 만큼 진솔하고 강렬하게 지금 이 순간의 일에 몰입하십시오.',
  },
  {
    themeKey: 'DionysianAffirmation',
    themeTitleGerman: 'Dionysisches Ja-Sagen zur Welt',
    themeTitleKo: '디오니소스적 생명력 (혼돈 속에서 춤추는 별을 낳기)',
    philosophicalInsight: '혼돈을 품고 있어야만 춤추는 별을 낳을 수 있습니다. 삶의 고통과 비극은 회피할 대상이 아니라, 영혼을 더욱 깊고 풍요롭게 만드는 역동적 에너지의 원천입니다.',
    affirmationCounsel: '역경 앞에서 기죽지 마십시오. 당신을 쓰러뜨리지 못하는 고난은 당신을 더욱 강하게 만듭니다. 온 힘을 다해 생명의 불꽃을 태우십시오.',
  },
];

const NIETZSCHE_APHORISMS: NietzscheAphorism[] = [
  {
    aphorismKey: 'WhatDoesNotKillMe',
    aphorismKo: '나를 죽이지 못하는 고통은 나를 더욱 강하게 만든다',
    aphorismGerman: 'Was mich nicht umbringt, macht mich stärker',
    creativeDimension: '역경의 승화와 불굴의 회복탄력성',
    actionDirective: '현재 마주한 시련을 영혼의 근육을 키우는 훈련으로 받아들이고 당당히 맞서십시오.',
  },
  {
    aphorismKey: 'DancingStarChaos',
    aphorismKo: '춤추는 별 하나를 낳으려면 내면에 혼돈을 품고 있어야 한다',
    aphorismGerman: 'Man muss noch Chaos in sich haben, um einen tanzenden Stern gebären zu können',
    creativeDimension: '창조적 혼돈과 내적 잠재력',
    actionDirective: '불안정함이나 정리되지 않은 생각들을 두려워 말고, 그 속에서 독창적인 아이디어를 빚어내십시오.',
  },
  {
    aphorismKey: 'KnowWhyEndureHow',
    aphorismKo: '살아야 할 이유가 있는 사람은 어떠한 삶의 방식도 견뎌낼 수 있다',
    aphorismGerman: 'Hat man sein Warum des Lebens, so verträgt man sich fast mit jedem Wie',
    creativeDimension: '삶의 궁극적 목적의식과 끈기',
    actionDirective: '방법론에 얽매이기 전에, 당신이 진정으로 이루고자 하는 근본적인 사명에 집중하십시오.',
  },
  {
    aphorismKey: 'BecomeWhoYouAre',
    aphorismKo: '너 자신이 되어라! 너 자신의 최고의 창조자가 되어라',
    aphorismGerman: 'Werde, der du bist!',
    creativeDimension: '고유한 개성의 완성',
    actionDirective: '남을 흉내 내려 하지 말고, 당신만의 고유한 색채와 열정을 세상에 아낌없이 발현하십시오.',
  },
];

function buildSituationalMetamorphosis(question: string, absHash: number): NietzscheSituationalMetamorphosis {
  const q = question.trim();
  if (/의무|책임|부담|버겁|해야|직장|눈치|강요/.test(q)) {
    return {
      focusAxisKo: '타인의 \'너는 해야 한다\'를 부수는 사자의 자유',
      metamorphosisStage: '사자(Löwe)',
      classicalCitation: '《차라투스트라는 이렇게 말했다》 〈세 가지 변화〉: "거룩한 아니오(Nein)를 외치는 사자만이 자유를 쟁취한다."',
      overcomingPrescription: '남이 지워준 무거운 짐을 당연한 의무로 삼지 말고, 내 삶의 주권을 뺏는 관성에 단호히 "아니오"를 선언하십시오.',
      reflectiveQuestion: '지금 내가 짊어진 짐 가운데 정말 내가 원해서 선택한 것은 몇 퍼센트입니까?',
    };
  }
  if (/후회|과거|실패|원망|억울|운명|상처/.test(q)) {
    return {
      focusAxisKo: '지나간 필연을 창조적 긍정으로 바꾸는 아모르 파티',
      metamorphosisStage: '아이(Kind)',
      classicalCitation: '《이 사람을 보라》 〈왜 나는 이렇게 영리한가〉 §10: "인간의 위대함을 재는 공식은 아모르 파티다."',
      overcomingPrescription: '되돌릴 수 없는 과거에 대한 원한(Ressentiment)을 끊고, 그 상처마저 지금의 나를 단련한 필연으로 끌어안으십시오.',
      reflectiveQuestion: '가장 아팠던 그 사건을 \'다시 써야 할 원고\'가 아닌 \'나를 벼려낸 망치\'로 부른다면 무엇이 달라집니까?',
    };
  }
  if (/시작|창조|새로운|도전|기획|아이디어|변화/.test(q)) {
    return {
      focusAxisKo: '스스로 굴러가는 수레바퀴, 어린아이의 신성한 긍정',
      metamorphosisStage: '아이(Kind)',
      classicalCitation: '《차라투스트라는 이렇게 말했다》 〈세 가지 변화〉: "아이는 순진무구함이며 망각이고, 새로운 시작이자 놀이이다."',
      overcomingPrescription: '완벽한 명분이나 타인의 허락을 기다리지 말고, 어린아이가 모래성을 쌓듯 순수한 놀이와 호기심으로 첫 삽을 뜨십시오.',
      reflectiveQuestion: '실패의 두려움과 체면을 내려놓는다면 지금 당장 시작하고 싶은 놀이는 무엇입니까?',
    };
  }
  if (/선택|결정|망설|이직|갈등|결단/.test(q)) {
    return {
      focusAxisKo: '영원회귀의 시금석 위에서 내리는 일생일대의 결단',
      metamorphosisStage: '사자(Löwe)',
      classicalCitation: '《즐거운 학문》 §341: "이 순간이 무수히 반복된다 해도 기꺼이 다시 살겠는가?"',
      overcomingPrescription: '안전하지만 영혼을 갉아먹는 타협 대신, 열 번을 다시 살아도 후회 없을 쪽을 향해 과감히 방향타를 꺾으십시오.',
      reflectiveQuestion: '이 선택이 앞으로 영원히 반복된다고 상상할 때 가슴이 뛰는 쪽은 어느 쪽입니까?',
    };
  }

  const fallbackStages: Array<'낙타(Kamel)' | '사자(Löwe)' | '아이(Kind)'> = ['낙타(Kamel)', '사자(Löwe)', '아이(Kind)'];
  const stage = fallbackStages[absHash % fallbackStages.length];
  return {
    focusAxisKo: '어제의 나를 넘어서는 자기 극복과 창조적 도약',
    metamorphosisStage: stage,
    classicalCitation: '《차라투스트라는 이렇게 말했다》 서설 §4: "인간은 극복되어야 할 그 무엇이다."',
    overcomingPrescription: '편안한 현상 유지의 유혹을 딛고, 스스로에게 조금 더 높은 기준과 창조적 과제를 부여하십시오.',
    reflectiveQuestion: '어제의 나와 다른 오늘을 만들기 위해 지금 당장 넘어서야 할 작은 습관은 무엇입니까?',
  };
}

function buildTemporalZarathustraRhythm(now: Date, baseScore: number): NietzscheTemporalZarathustraRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 발아기(여명의 긍정)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 정오기(태양의 충만)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 수확기(필연의 성숙)'
        : '동계 단련기(심연의 내공)';

  let timeWindowKo = '위대한 정오(Großer Mittag)';
  let hourBonus = 0;
  let dailyAffirmationPractice = '태양이 가장 높은 정오의 기백으로 망설임을 태워버리고 핵심 결단 하나를 실행하십시오.';

  if (kstHour >= 5 && kstHour < 10) {
    timeWindowKo = '여명(Morgenröte) · 산정의 출발';
    hourBonus = 5;
    dailyAffirmationPractice = '아침 햇살 아래 어제의 후회를 씻어내고, 오늘 내가 창조할 한 가지 가치를 선포하십시오.';
  } else if (kstHour >= 10 && kstHour < 15) {
    timeWindowKo = '위대한 정오(Großer Mittag) · 영원회귀의 정점';
    hourBonus = 7;
    dailyAffirmationPractice = '그림자가 가장 짧은 정오에 타인의 시선을 걷어내고 가장 담대한 일에 몰입하십시오.';
  } else if (kstHour >= 15 && kstHour < 20) {
    timeWindowKo = '황혼과 하산(Untergang) · 선물하는 덕';
    hourBonus = 3;
    dailyAffirmationPractice = '낮 동안 쌓은 통찰과 활력을 주변과 일의 현장에 아낌없이 흘려보내십시오.';
  } else {
    timeWindowKo = '깊은 한밤(Mitternacht) · 춤추는 별의 잉태';
    hourBonus = 2;
    dailyAffirmationPractice = '고요한 심연의 시간에 혼돈을 두려워하지 말고, 내일 쏘아 올릴 창조적 화살을 다듬으십시오.';
  }

  return {
    kstHour,
    timeWindowKo,
    seasonKo,
    dionysianPulseIndex: Math.min(100, Math.round(baseScore + hourBonus)),
    dailyAffirmationPractice,
  };
}

export function calculateNietzscheZarathustraAmorFati(
  profile: UserProfile,
  question = '',
  now: Date = new Date()
): NietzscheZarathustraAmorFatiResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    question.trim() +
    'NietzscheZarathustraAmorFati';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const amorFatiRadicalAffirmationScore = 70 + (absHash % 29);
  const threeMetamorphosesCreativeScore = 69 + ((absHash >> 3) % 30);
  const uebermenschSelfOvercomingScore = 68 + ((absHash >> 6) % 31);
  const eternalRecurrenceResolveScore = 67 + ((absHash >> 9) % 32);
  const dionysianVitalityDriveScore = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % NIETZSCHE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % NIETZSCHE_APHORISMS.length;

  const activeNietzscheTheme = NIETZSCHE_THEMES[themeIndex];
  const focalNietzscheAphorism = NIETZSCHE_APHORISMS[aphorismIndex];
  const situationalMetamorphosis = buildSituationalMetamorphosis(question, absHash);
  const temporalZarathustraRhythm = buildTemporalZarathustraRhythm(now, dionysianVitalityDriveScore);

  const avgScore = Math.round(
    (amorFatiRadicalAffirmationScore + uebermenschSelfOvercomingScore + eternalRecurrenceResolveScore) / 3
  );
  const uebermenschSynthesisMatrix: NietzscheUebermenschMatrix = {
    amorFatiResilience: amorFatiRadicalAffirmationScore,
    selfOvercomingMomentum: Math.round((threeMetamorphosesCreativeScore + uebermenschSelfOvercomingScore) / 2),
    eternalRecurrenceClarity: eternalRecurrenceResolveScore,
    overallZarathustraGrade: avgScore >= 88
      ? '디오니소스적 초인 공명(Übermensch Resonance)'
      : avgScore >= 78
        ? '사자에서 아이로의 도약(Löwe → Kind)'
        : '낙타의 인내를 넘어서는 각성(Awakening)',
  };

  const counselTitle = `니체 초인(Übermensch) 철학: ${activeNietzscheTheme.themeTitleKo}`;
  const philosophicalGuidance = `프리드리히 니체의 철학은 나약한 체념을 부수고 자신의 운명을 환호하며 사랑하는 아모르 파티(Amor Fati)의 불꽃을 피우도록 격려합니다. ` +
    `현재 질문은 [${situationalMetamorphosis.metamorphosisStage}] 단계의 '${situationalMetamorphosis.focusAxisKo}'와 공명합니다. ` +
    `${situationalMetamorphosis.overcomingPrescription} 또한 '${activeNietzscheTheme.themeTitleKo}'의 가르침과 아포리즘 '${focalNietzscheAphorism.aphorismKo}'(${focalNietzscheAphorism.creativeDimension})을 품고 ` +
    `${temporalZarathustraRhythm.dailyAffirmationPractice}`;

  const dailyPracticeRitual = `오늘의 아모르 파티 실천 의례: ${temporalZarathustraRhythm.dailyAffirmationPractice} 피하고 싶은 조건 하나를 '그럼에도 내가 창조로 바꿀 재료'로 다시 명명해 보십시오.`;
  const ritualAction = dailyPracticeRitual;
  const reflectionFocus = situationalMetamorphosis.reflectiveQuestion;
  const interpretiveBoundary = '이 관점은 니체의 실존 철학과 운명애(Amor Fati)의 상징적 통찰일 뿐, 현실의 심리·의료적 진단이나 결정을 대신하지 않습니다.';

  return {
    engineVersion: NIETZSCHE_ZARATHUSTRA_AMOR_FATI_VERSION,
    calculatedAtKst: `${new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00 (KST)`,
    amorFatiRadicalAffirmationScore,
    threeMetamorphosesCreativeScore,
    uebermenschSelfOvercomingScore,
    eternalRecurrenceResolveScore,
    dionysianVitalityDriveScore,
    activeNietzscheTheme,
    focalNietzscheAphorism,
    situationalMetamorphosis,
    temporalZarathustraRhythm,
    uebermenschSynthesisMatrix,
    dailyPracticeRitual,
    ritualAction,
    reflectionFocus,
    interpretiveBoundary,
    nietzschePersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

function describeNietzscheStage(score: number, high: string, mid: string, low: string): string {
  if (score >= 86) return high;
  if (score >= 76) return mid;
  return low;
}

export function formatNietzscheZarathustraAmorFatiPrompt(res: NietzscheZarathustraAmorFatiResult): string {
  const amorFatiStage = describeNietzscheStage(
    res.amorFatiRadicalAffirmationScore,
    '필연성까지 기꺼이 껴안고 창조의 불꽃으로 바꾸는 아모르 파티 절정',
    '일어난 일의 무게를 수용하며 내 편으로 돌려세우는 긍정의 흐름',
    '원망과 후회의 시선을 거두고 현재의 필연을 직면할 시기',
  );
  const metamorphosesStage = describeNietzscheStage(
    res.threeMetamorphosesCreativeScore,
    '묵은 규범을 넘어 아이처럼 새 가치를 빚어내는 창조적 자유',
    '낙타의 인내에서 사자의 단호함으로 발걸음을 옮기는 변신의 국면',
    '남이 지워준 짐을 내려놓고 내 진짜 욕망을 구분해야 할 때',
  );
  const uebermenschStage = describeNietzscheStage(
    res.uebermenschSelfOvercomingScore,
    '어제의 나를 경쾌하게 뛰어넘어 스스로를 갱신하는 자기 극복의 기세',
    '익숙한 안주와 새로운 도약 사이에서 의지를 다지는 과정',
    '비교의 시선을 끊고 내 안의 가장 솔직한 힘에 불을 붙일 시점',
  );
  const recurrenceStage = describeNietzscheStage(
    res.eternalRecurrenceResolveScore,
    '이 순간이 영원히 되풀이되어도 기꺼이 예(Ja)라고 답할 수 있는 결단',
    '순간의 선택에 책임과 진정성을 실어 밀도 있게 살아가는 흐름',
    '미루던 결정을 더는 뒤로 미루지 말고 오늘의 태도를 정할 때',
  );
  const dionysianStage = describeNietzscheStage(
    res.dionysianVitalityDriveScore,
    '내면의 생명력과 창조적 환희가 춤추듯 솟구치는 디오니소스적 활력',
    '혼돈을 두려워하지 않고 에너지의 리듬을 조절하며 나아가는 중',
    '지친 감각을 회복하고 몸과 마음의 생기를 먼저 되살려야 할 시기',
  );
  const temporalRhythmStage = describeNietzscheStage(
    res.temporalZarathustraRhythm.dionysianPulseIndex,
    '차라투스트라의 창조적 맥동이 가장 선명하게 깨어나는 시간대',
    '운명을 긍정하는 호흡이 일상 속에 고르게 흐르는 리듬',
    '깊은 밤처럼 고요히 다음 도약의 화살을 다듬는 시간',
  );

  return [
    `【프리드리히 니체 차라투스트라 초인 & 아모르 파티(Amor Fati) 지표 v2.1 (순수 정성 성찰)】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 아모르 파티(Amor Fati) 운명 긍정: ${amorFatiStage}`,
    `- 3단계 변신(낙타·사자·아이) 자유: ${metamorphosesStage}`,
    `- 초인(Übermensch) 자기 극복: ${uebermenschStage}`,
    `- 영원회귀(Ewige Wiederkunft) 결단: ${recurrenceStage}`,
    `- 디오니소스적 생명력: ${dionysianStage}`,
    `- 질문 맥락 변신 단계: [${res.situationalMetamorphosis.metamorphosisStage}] ${res.situationalMetamorphosis.focusAxisKo}`,
    `- 원전 처방: ${res.situationalMetamorphosis.classicalCitation} → ${res.situationalMetamorphosis.overcomingPrescription}`,
    `- 성찰 질문: ${res.situationalMetamorphosis.reflectiveQuestion}`,
    `- KST 시공간 리듬: ${res.temporalZarathustraRhythm.timeWindowKo} (${res.temporalZarathustraRhythm.seasonKo}, ${temporalRhythmStage}) — ${res.temporalZarathustraRhythm.dailyAffirmationPractice}`,
    `- 종합 위상: ${res.uebermenschSynthesisMatrix.overallZarathustraGrade}`,
    `- 핵심 초인 테마: ${res.activeNietzscheTheme.themeTitleKo} [${res.activeNietzscheTheme.themeTitleGerman}]`,
    `- 핵심 아포리즘: "${res.focalNietzscheAphorism.aphorismKo}" ("${res.focalNietzscheAphorism.aphorismGerman}")`,
    `- 일상 실천 의례: ${res.dailyPracticeRitual}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 통합 실존 처방: ${res.nietzschePersonalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
