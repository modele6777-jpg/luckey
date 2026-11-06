/**
 * 독일 계몽주의 이마누엘 칸트(Immanuel Kant) 정언명령 & 목적의 왕국 자율성 도덕법칙 엔진
 *
 * 칸트의 3대 비판서 및 윤리학 저작 원전 기반:
 * 1. 《순수이성비판(Kritik der reinen Vernunft)》: 감성의 직관과 오성의 개념이 결합하는 선험적 종합판단(Synthetic a priori) 및 통각의 종합적 통일.
 * 2. 《실천이성비판(Kritik der praktischen Vernunft)》: 정언명령(Categorical Imperative)과 도덕법칙에 대한 경외심(Achtung), 의지의 자율성(Autonomy).
 * 3. 《윤리형이상학 정초(Grundlegung zur Metaphysik der Sitten)》:
 *    - 제1정식: 보편법칙의 공식("네 의지의 준칙이 언제나 보편적 입법의 원리가 될 수 있도록 행위하라").
 *    - 제2정식: 인간성의 공식("너 자신이나 타인의 인격을 언제나 목적으로 대하고 결코 수단으로 대하지 말라").
 *    - 제3정식: 자율의 공식 및 목적의 왕국(Reich der Zwecke).
 * 4. 최고선(Summum Bonum): 도덕적 덕(Tugend)과 행복(Glückseligkeit)의 온전한 비례와 조화.
 *
 * @version LUCKEY-KANT-CATEGORICAL-IMPERATIVE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KANT_CATEGORICAL_IMPERATIVE_VERSION = 'LUCKEY-KANT-CATEGORICAL-IMPERATIVE-v1.0.0';

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

export function calculateKantCategoricalImperative(profile: UserProfile): KantCategoricalImperativeResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
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

  const counselTitle = `칸트 정언명령과 자율성: ${activeImperativeFormula.formulaNameKo}`;
  const philosophicalGuidance = `이마누엘 칸트의 도덕철학은 외부의 결과나 감정에 흔들리지 않는 순수한 실천이성의 자율성을 강조합니다. ` +
    `현재 당신의 행동 기준은 '${activeImperativeFormula.formulaNameKo}(${activeImperativeFormula.formulaNameGerman})'에 조응합니다. ` +
    `${activeImperativeFormula.practicalCounsel} 또한 '${focalMoralMaxim.maximNameKo}'(${focalMoralMaxim.dutyDimension})을 가슴에 새겨, ` +
    `${focalMoralMaxim.ethicalReflection}`;

  return {
    engineVersion: KANT_CATEGORICAL_IMPERATIVE_VERSION,
    calculatedAtKst: new Date().toISOString(),
    universalLawMaximsScore,
    humanDignityEndsScore,
    autonomousWillSovereigntyScore,
    transcendentalSynthesisScore,
    summumBonumHarmonyScore,
    activeImperativeFormula,
    focalMoralMaxim,
    kantPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatKantCategoricalImperativePrompt(res: KantCategoricalImperativeResult): string {
  return [
    `【칸트 정언명령 & 목적의 왕국 자율성 지표】`,
    `- 준칙 보편화 가능성 지수: ${res.universalLawMaximsScore}/100`,
    `- 인간존엄성 목적 자체 대우도: ${res.humanDignityEndsScore}/100`,
    `- 도덕적 자율성(Autonomy) 주권도: ${res.autonomousWillSovereigntyScore}/100`,
    `- 선험적 종합판단 통각력: ${res.transcendentalSynthesisScore}/100`,
    `- 최고선(덕·행복 조화) 지향도: ${res.summumBonumHarmonyScore}/100`,
    `- 핵심 정언명령 정식: ${res.activeImperativeFormula.formulaNameKo} [${res.activeImperativeFormula.formulaNameGerman}]`,
    `- 도덕 원칙: ${res.activeImperativeFormula.moralPrinciple}`,
    `- 실천적 조언: ${res.activeImperativeFormula.practicalCounsel}`,
    `- 초점 도덕적 준칙: ${res.focalMoralMaxim.maximNameKo} (${res.focalMoralMaxim.dutyDimension})`,
    `- 윤리적 성찰: ${res.focalMoralMaxim.ethicalReflection}`,
    `- 철학적 수양 지침: ${res.kantPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
