/**
 * 독일 계몽주의 이마누엘 칸트(Immanuel Kant) 정언명령 & 목적의 왕국 자율성 도덕법칙 엔진
 *
 * 칸트의 3대 비판서 및 윤리학 저작 원전 기반:
 * 1. 《순수이성비판(Kritik der reinen Vernunft)》
 * 2. 《실천이성비판(Kritik der praktischen Vernunft)》
 * 3. 《윤리형이상학 정초(Grundlegung zur Metaphysik der Sitten)》
 * 4. 질문 맥락 정언명령 감사(situationalImperativeAudit) + KST 시공간 리듬(temporalReasonRhythm) + 교차 검증 매트릭스(kantSynthesisMatrix) + 순수 정성 성찰(v2.1.0)
 *
 * @version LUCKEY-KANT-CATEGORICAL-IMPERATIVE-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const KANT_CATEGORICAL_IMPERATIVE_VERSION = 'LUCKEY-KANT-CATEGORICAL-IMPERATIVE-v2.1.0';

export interface KantImperativeFormula {
  formulaKey: string;
  formulaNameGerman: string;
  formulaNameKo: string;
  moralPrinciple: string;
  practicalCounsel: string;
}

export interface KantMoralMaxim {
  maximKey: string;
  maximNameKo: string;
  dutyDimension: string;
  ethicalReflection: string;
}

export interface KantSituationalImperativeAudit {
  formulaAxis: '보편법칙의 공식' | '인간성 목적의 공식' | '자율성과 목적의 왕국';
  focusAxisKo: string;
  classicalCitation: string;
  imperativeDirective: string;
  reflectiveQuestion: string;
}

export interface KantTemporalReasonRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  practicalReasonIndex: number;
  dailyDutyPractice: string;
}

export interface KantSynthesisMatrix {
  universalizabilityScore: number;
  dignityRespectScore: number;
  autonomousResolveScore: number;
  overallKantGrade: string;
}

export interface KantCategoricalImperativeResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  universalLawMaximsScore: number;       // 보편법칙의 준칙 보편화 가능성 지수
  humanDignityEndsScore: number;         // 인간존엄성 목적 자체 대우 지수
  autonomousWillSovereigntyScore: number; // 도덕적 자율성(Autonomy) 주권도
  transcendentalSynthesisScore: number;  // 선험적 통각 종합판단력
  summumBonumHarmonyScore: number;       // 최고선(Summum Bonum) 덕·행복 조화 지향도
  // 세부 체계
  activeImperativeFormula: KantImperativeFormula;
  focalMoralMaxim: KantMoralMaxim;
  situationalImperativeAudit: KantSituationalImperativeAudit;
  temporalReasonRhythm: KantTemporalReasonRhythm;
  kantSynthesisMatrix: KantSynthesisMatrix;
  dailyPracticeRitual: string;
  interpretiveBoundary: string;
  kantPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type KantCategoricalImperativeReport = KantCategoricalImperativeResult;

const IMPERATIVE_FORMULAS: KantImperativeFormula[] = [
  {
    formulaKey: 'UniversalLaw',
    formulaNameGerman: 'Formel des allgemeinen Gesetzes',
    formulaNameKo: '보편법칙의 공식',
    moralPrinciple: '오직 네 의지의 준칙이 동시에 보편적 법률이 될 것을 바랄 수 있는 준칙에 따라서만 행위하라.',
    practicalCounsel: '지금 내리려는 결정과 원칙이 세상 모든 사람이 똑같이 실행해도 모순 없이 조화로운지 검증하십시오.',
  },
  {
    formulaKey: 'HumanityAsEnd',
    formulaNameGerman: 'Formel der Menschheit als Zweck an sich selbst',
    formulaNameKo: '인간성을 목적으로 대하는 공식',
    moralPrinciple: '너 자신과 다른 모든 사람의 인격을 결코 단순한 수단으로 다루지 말고, 언제나 동시에 목적으로 대하라.',
    practicalCounsel: '이해관계나 유용성을 앞세워 타인을 도구화하지 말고, 상대와 자신의 존엄성을 가장 고귀한 목적으로 존중하십시오.',
  },
  {
    formulaKey: 'AutonomyAndKingdomOfEnds',
    formulaNameGerman: 'Formel der Autonomie und des Reichs der Zwecke',
    formulaNameKo: '자율성과 목적의 왕국 공식',
    moralPrinciple: '모든 이성적 존재의 의지는 보편적으로 입법하는 자율적 의지이며 목적의 왕국 구성원이다.',
    practicalCounsel: '외부의 압력이나 일시적 욕망에 굴복하지 말고, 스스로 세운 도덕적 이성의 법에 따라 주체적으로 행동하십시오.',
  },
];

const MORAL_MAXIMS: KantMoralMaxim[] = [
  {
    maximKey: 'Truthfulness',
    maximNameKo: '진실성과 신의의 의무',
    dutyDimension: '자신과 타인에 대한 완전한 의무',
    ethicalReflection: '상황의 유불리에 흔들리지 않고 정직과 약속의 신성함을 지켜낼 때 인간의 존엄성이 빛납니다.',
  },
  {
    maximKey: 'SelfDevelopment',
    maximNameKo: '자기 재능과 역량 계발의 의무',
    dutyDimension: '자신에 대한 불완전한 의무',
    ethicalReflection: '안일함에 머물지 않고 자신에게 주어진 이성과 소질을 부지런히 갈고닦아 인격을 완성해 가야 합니다.',
  },
  {
    maximKey: 'BenevolenceAndAssistance',
    maximNameKo: '타인의 행복을 돕는 선행의 의무',
    dutyDimension: '타인에 대한 불완전한 의무',
    ethicalReflection: '타인의 곤경을 외면하지 않고 따뜻한 연대와 자애로움으로 서로의 행복을 증진하는 의지를 실천하십시오.',
  },
  {
    maximKey: 'EquanimityInDuty',
    maximNameKo: '의무에 대한 순수한 경외심(Achtung)',
    dutyDimension: '도덕적 동기의 순수성',
    ethicalReflection: '보상이나 칭찬을 바라서가 아니라, 옳은 일이기 때문에 묵묵히 행하는 도덕적 숭고함을 품으십시오.',
  },
];

function buildSituationalImperativeAudit(question: string, absHash: number): KantSituationalImperativeAudit {
  const q = question.trim();
  if (/관계|사람|상대|이용|존중|사랑|직장|동료/.test(q)) {
    return {
      formulaAxis: '인간성 목적의 공식',
      focusAxisKo: '나와 타인의 인격을 수단이 아닌 목적으로 대우하기',
      classicalCitation: '《윤리형이상학 정초》 제2장: "너 자신이나 다른 모든 사람의 인격을 결코 단순한 수단으로만 대우하지 말고 언제나 동시에 목적으로 대우하라."',
      imperativeDirective: '상대를 내 불안이나 이익을 채우는 도구로 삼지 말고, 내 자존감 역시 타인의 평가에 팔아넘기지 마십시오.',
      reflectiveQuestion: '지금 내가 맺고 있는 관계에서 상대를 혹은 나 자신을 결과의 수단으로만 다루고 있지는 않습니까?',
    };
  }
  if (/거짓|약속|원칙|양심|정직|옳|타협|선택/.test(q)) {
    return {
      formulaAxis: '보편법칙의 공식',
      focusAxisKo: '예외를 두지 않는 보편 입법의 준칙 세우기',
      classicalCitation: '《윤리형이상학 정초》 제1정식: "네 의지의 준칙이 언제나 동시에 보편적 입법의 원리가 될 수 있도록 행위하라."',
      imperativeDirective: '\'이번 한 번만\'이라는 자기 예외를 허용하지 말고, 세상 모두가 따라도 부끄럽지 않은 원칙을 선택하십시오.',
      reflectiveQuestion: '지금 내가 선택하려는 기준을 다른 사람이 나에게 똑같이 적용해도 기꺼이 받아들일 수 있습니까?',
    };
  }
  if (/성장|공부|계발|진로|자율|주도|독립|결정/.test(q)) {
    return {
      formulaAxis: '자율성과 목적의 왕국',
      focusAxisKo: '외부의 유혹을 넘어 스스로 입법하는 이성의 자율성',
      classicalCitation: '《실천이성비판》 결론: "내 위의 별이 빛나는 하늘과 내 안의 도덕 법칙."',
      imperativeDirective: '감정적 충동이나 남의 지시에 끌려가지 말고, 스스로 납득한 이성의 원칙을 세워 일관되게 밀고 나가십시오.',
      reflectiveQuestion: '외부의 보상과 시선이 모두 사라져도 내가 스스로 지키고 싶은 삶의 법칙은 무엇입니까?',
    };
  }

  const axes: Array<'보편법칙의 공식' | '인간성 목적의 공식' | '자율성과 목적의 왕국'> = [
    '보편법칙의 공식',
    '인간성 목적의 공식',
    '자율성과 목적의 왕국',
  ];
  return {
    formulaAxis: axes[absHash % axes.length],
    focusAxisKo: '순수한 실천이성과 경외심(Achtung)으로 균형 잡기',
    classicalCitation: '《실천이성비판》: "의무는 단순한 계산이 아니라 이성적 존재의 자유가 스스로에게 부여하는 품격이다."',
    imperativeDirective: '당장의 손익 계산보다 장기적으로 스스로 떳떳할 수 있는 도덕적·이성적 기준을 우선하십시오.',
    reflectiveQuestion: '1년 뒤의 내가 오늘의 결정을 돌아볼 때 가장 떳떳하게 고개를 끄덕일 수 있는 선택은 무엇입니까?',
  };
}

function buildTemporalReasonRhythm(now: Date, baseScore: number): KantTemporalReasonRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 입법기(원칙의 정초)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 실천기(의무의 실행)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 성찰기(최고선의 조화)'
        : '동계 사유기(순수이성의 명료)';

  let timeWindowKo = '오후의 실천이성 점검';
  let hourBonus = 0;
  let dailyDutyPractice = '규칙적인 산책과 정돈된 일과 속에서 이성의 명료한 질서를 유지하십시오.';

  if (kstHour >= 5 && kstHour < 10) {
    timeWindowKo = '아침의 정언명령 정초(쾨니히스베르크 산책 리듬)';
    hourBonus = 6;
    dailyDutyPractice = '하루의 시작에 감정적 변덕을 걷어내고 오늘 지킬 보편적 원칙 하나를 세우십시오.';
  } else if (kstHour >= 10 && kstHour < 15) {
    timeWindowKo = '오전의 의무와 신의 실행';
    hourBonus = 5;
    dailyDutyPractice = '약속과 소임을 묵묵히 완수하며 말과 행동의 일치를 입증하십시오.';
  } else if (kstHour >= 15 && kstHour < 20) {
    timeWindowKo = '오후의 인간성 존중 실천';
    hourBonus = 4;
    dailyDutyPractice = '피로가 쌓이는 시간일수록 만나는 사람을 수단이 아닌 존엄한 목적으로 대하십시오.';
  } else {
    timeWindowKo = '밤의 별빛과 내면 도덕법칙 성찰';
    hourBonus = 3;
    dailyDutyPractice = '오늘의 선택이 내 양심의 법칙에 부합했는지 고요히 비추어 보십시오.';
  }

  return {
    kstHour,
    timeWindowKo,
    seasonKo,
    practicalReasonIndex: Math.min(100, Math.round(baseScore + hourBonus)),
    dailyDutyPractice,
  };
}

export function calculateKantCategoricalImperative(
  profile: UserProfile,
  question = '',
  now: Date = new Date()
): KantCategoricalImperativeResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    question.trim() +
    'KantCategoricalImperative';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const universalLawMaximsScore = 68 + (absHash % 31);
  const humanDignityEndsScore = 65 + ((absHash >> 3) % 34);
  const autonomousWillSovereigntyScore = 67 + ((absHash >> 6) % 32);
  const transcendentalSynthesisScore = 64 + ((absHash >> 9) % 35);
  const summumBonumHarmonyScore = 63 + ((absHash >> 12) % 36);

  const formulaIndex = (absHash >> 4) % IMPERATIVE_FORMULAS.length;
  const maximIndex = (absHash >> 7) % MORAL_MAXIMS.length;

  const activeImperativeFormula = IMPERATIVE_FORMULAS[formulaIndex];
  const focalMoralMaxim = MORAL_MAXIMS[maximIndex];
  const situationalImperativeAudit = buildSituationalImperativeAudit(question, absHash);
  const temporalReasonRhythm = buildTemporalReasonRhythm(now, autonomousWillSovereigntyScore);

  const avgScore = Math.round(
    (universalLawMaximsScore + humanDignityEndsScore + autonomousWillSovereigntyScore) / 3
  );
  const kantSynthesisMatrix: KantSynthesisMatrix = {
    universalizabilityScore: universalLawMaximsScore,
    dignityRespectScore: humanDignityEndsScore,
    autonomousResolveScore: autonomousWillSovereigntyScore,
    overallKantGrade: avgScore >= 88
      ? '목적의 왕국 입법자(Reich der Zwecke)'
      : avgScore >= 78
        ? '자율적 실천이성 확립(Autonomy)'
        : '의무에 대한 경외 각성(Achtung)',
  };

  const counselTitle = `칸트 정언명령과 자율성: ${activeImperativeFormula.formulaNameKo}`;
  const philosophicalGuidance = `이마누엘 칸트의 도덕철학은 외부의 결과나 감정에 흔들리지 않는 순수한 실천이성의 자율성을 강조합니다. ` +
    `현재 질문은 [${situationalImperativeAudit.formulaAxis}]의 '${situationalImperativeAudit.focusAxisKo}'와 조응합니다. ` +
    `${situationalImperativeAudit.imperativeDirective} 또한 '${focalMoralMaxim.maximNameKo}'(${focalMoralMaxim.dutyDimension})을 품고 ` +
    `${temporalReasonRhythm.dailyDutyPractice}`;

  const dailyPracticeRitual = `오늘의 정언명령 실천 의례: ${temporalReasonRhythm.dailyDutyPractice} 결정 전 '이 원칙이 보편 법칙이 되어도 떳떳한가'를 한 번 자문하십시오.`;
  const interpretiveBoundary = '이 관점은 칸트의 실천이성과 도덕 법칙의 상징적 비유일 뿐, 현실의 법적·실무적 판단을 대신하지 않습니다.';

  return {
    engineVersion: KANT_CATEGORICAL_IMPERATIVE_VERSION,
    calculatedAtKst: new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('Z', '+09:00'),
    universalLawMaximsScore,
    humanDignityEndsScore,
    autonomousWillSovereigntyScore,
    transcendentalSynthesisScore,
    summumBonumHarmonyScore,
    activeImperativeFormula,
    focalMoralMaxim,
    situationalImperativeAudit,
    temporalReasonRhythm,
    kantSynthesisMatrix,
    dailyPracticeRitual,
    interpretiveBoundary,
    kantPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

function describeKantStage(score: number, high: string, mid: string, low: string): string {
  if (score >= 86) return high;
  if (score >= 76) return mid;
  return low;
}

export function formatKantCategoricalImperativePrompt(res: KantCategoricalImperativeResult): string {
  const universalLawStage = describeKantStage(
    res.universalLawMaximsScore,
    '예외 없는 보편 입법의 명료한 기준이 선 상태',
    '원칙과 현실 맥락 사이에서 보편성을 조율하는 흐름',
    '자기 예외의 유혹을 경계하며 준칙을 다시 다지는 시기',
  );
  const dignityStage = describeKantStage(
    res.humanDignityEndsScore,
    '나와 타인을 온전한 목적으로 대우하는 깊은 존엄의 태도',
    '유용성과 인격 존중의 균형을 의식적으로 지키는 국면',
    '이해관계에 흔들리지 않도록 상대와 자신의 품격을 챙겨야 할 때',
  );
  const autonomyStage = describeKantStage(
    res.autonomousWillSovereigntyScore,
    '외부 시선과 충동에 흔들리지 않는 자율적 이성의 주권 확립',
    '주체적 판단을 세우되 감정의 여진을 다스리는 과도기',
    '타인의 기대보다 스스로 납득할 도덕적 기준을 먼저 세울 시점',
  );
  const synthesisStage = describeKantStage(
    res.transcendentalSynthesisScore,
    '경험과 선험적 이성이 또렷이 결합하는 통각의 명료함',
    '단편적 사실을 전체 맥락으로 엮어내는 사유의 흐름',
    '성급한 단정을 멈추고 판단의 전제를 차분히 점검할 시기',
  );
  const summumBonumStage = describeKantStage(
    res.summumBonumHarmonyScore,
    '덕의 일관성과 삶의 충만함이 조화롭게 어우러지는 지향',
    '옳음과 현실적 만족 사이에서 성숙한 균형을 찾는 중',
    '당장의 결과보다 떳떳한 동기를 먼저 붙드는 내면의 다짐',
  );
  const temporalRhythmStage = describeKantStage(
    res.temporalReasonRhythm.practicalReasonIndex,
    '실천이성의 각성이 가장 또렷하게 빛나는 시간대',
    '일상의 리듬 속에서 원칙을 무리 없이 이어가는 흐름',
    '고요히 내면의 도덕 법칙을 비추어 숨을 고르는 시간',
  );

  return [
    `【칸트 정언명령 & 목적의 왕국 자율성 지표 v2.1 (순수 정성 성찰)】`,
    `- 준칙 보편화 흐름: ${universalLawStage}`,
    `- 인간존엄성 목적 대우: ${dignityStage}`,
    `- 도덕적 자율성(Autonomy): ${autonomyStage}`,
    `- 선험적 종합판단 통각: ${synthesisStage}`,
    `- 최고선(덕·행복 조화): ${summumBonumStage}`,
    `- 질문 맥락 정식: [${res.situationalImperativeAudit.formulaAxis}] ${res.situationalImperativeAudit.focusAxisKo}`,
    `- 원전 처방: ${res.situationalImperativeAudit.classicalCitation} → ${res.situationalImperativeAudit.imperativeDirective}`,
    `- 성찰 질문: ${res.situationalImperativeAudit.reflectiveQuestion}`,
    `- KST 시공간 리듬: ${res.temporalReasonRhythm.timeWindowKo} (${res.temporalReasonRhythm.seasonKo}, ${temporalRhythmStage}) — ${res.temporalReasonRhythm.dailyDutyPractice}`,
    `- 종합 위상: ${res.kantSynthesisMatrix.overallKantGrade}`,
    `- 핵심 정언명령 정식: ${res.activeImperativeFormula.formulaNameKo} [${res.activeImperativeFormula.formulaNameGerman}]`,
    `- 초점 도덕적 준칙: ${res.focalMoralMaxim.maximNameKo} (${res.focalMoralMaxim.dutyDimension})`,
    `- 일상 실천 의례: ${res.dailyPracticeRitual}`,
    `- 철학적 수양 지침: ${res.kantPhilosophicalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
