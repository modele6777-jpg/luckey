/**
 * 덴마크 쇠렌 키르케고르(Søren Kierkegaard) 《이것이냐 저것이냐》 & 《죽음에 이르는 병》 단독자(Den Enkelte) 3단계 실존 도약 엔진
 *
 * 19세기 덴마크 실존철학의 선구자 쇠렌 키르케고르(1813~1855)의 주저 《이것이냐 저것이냐(Enten-Eller)》, 《불안의 개념(Begrebet Angest)》, 《죽음에 이르는 병(Sygdommen til Døden)》 원전 기반:
 * 1. 실존의 3단계(Tre Stadier på Livets Vei):
 *    - 미적 실존(Aestetisk stadium): 순간적 감각과 유희, 그러나 필연적으로 권태(Kedsomhed)와 절망에 직면함.
 *    - 윤리적 실존(Etisk stadium): 보편적 도덕률과 자기 선택(Vælg dig selv), 가족과 사회에 대한 성실한 책임.
 *    - 종교적 실존(Religiøst stadium): 윤리적 척도를 초월하여 신 앞에 홀로 선 '단독자(Den Enkelte)'의 신앙의 도약(Springet).
 * 2. 단독자(Den Enkelte): 익명성의 군중(Mængden) 뒤에 숨지 않고, 오직 자기 자신의 영혼과 실존적 결단을 직시하는 진정한 주체성.
 * 3. 불안의 극복(Angst): "불안은 자유의 어지럼증이다(Angest er Frihedens Svimmelhed)." 가능성의 심연 앞에서 도망치지 않고 결단을 통해 자신을 구원하는 도약.
 * 4. 이것이냐 저것이냐(Enten - Eller): 양다리를 걸치는 미온적 타협을 버리고, 온 존재를 걸고 가치 있는 것을 선택하는 실존적 결단.
 * 5. 절망(Fortvivlelse) 치유: 유한성과 무한성, 시간성과 영원성이 투명하게 통합되는 온전한 자아 일치(Self-Synthesis).
 *
 * @version LUCKEY-KIERKEGAARD-STAGES-OF-LIFE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KIERKEGAARD_STAGES_OF_LIFE_VERSION = 'LUCKEY-KIERKEGAARD-STAGES-OF-LIFE-v1.0.0';

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
  kierkegaardPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
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

export function calculateKierkegaardStagesOfLife(profile: UserProfile): KierkegaardStagesOfLifeResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
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

  const counselTitle = `키르케고르 단독자 실존 철학: ${activeKierkegaardTheme.themeTitleKo}`;
  const philosophicalGuidance = `쇠렌 키르케고르의 철학은 군중의 안일함에서 벗어나 오롯한 단독자로서 자신의 삶을 선택하고 신뢰의 도약을 감행하도록 이끕니다. ` +
    `현재 당신에게 필요한 지혜는 '${activeKierkegaardTheme.themeTitleKo}'의 통찰과 깊이 맞닿아 있습니다. ` +
    `${activeKierkegaardTheme.existentialCounsel} 또한 키르케고르의 명제인 '${focalKierkegaardAphorism.aphorismKo}'(${focalKierkegaardAphorism.stageDimension})을 기억하여, ` +
    `${focalKierkegaardAphorism.practicalAction}`;

  return {
    engineVersion: KIERKEGAARD_STAGES_OF_LIFE_VERSION,
    calculatedAtKst: new Date().toISOString(),
    existentialLeapCourageScore,
    denEnkelteAuthenticityScore,
    angstPossibilityMasteryScore,
    ethicalSelfChoiceCommitmentScore,
    spiritSynthesisWholenessScore,
    activeKierkegaardTheme,
    focalKierkegaardAphorism,
    kierkegaardPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatKierkegaardStagesOfLifePrompt(res: KierkegaardStagesOfLifeResult): string {
  return [
    `【쇠렌 키르케고르 단독자(Den Enkelte) & 실존 3단계 지표】`,
    `- 실존적 도약(Springet) 결단력: ${res.existentialLeapCourageScore}/100`,
    `- 단독자(Den Enkelte) 주체성 지수: ${res.denEnkelteAuthenticityScore}/100`,
    `- 불안의 가능성 승화도(Angst): ${res.angstPossibilityMasteryScore}/100`,
    `- 자기 선택 성실도(Vælg dig selv): ${res.ethicalSelfChoiceCommitmentScore}/100`,
    `- 영적 자아 일치 평정심(Fortvivlelse 치유): ${res.spiritSynthesisWholenessScore}/100`,
    `- 핵심 실존 테마: ${res.activeKierkegaardTheme.themeTitleKo} [${res.activeKierkegaardTheme.themeTitleDanish}]`,
    `- 철학적 통찰: ${res.activeKierkegaardTheme.philosophicalInsight}`,
    `- 실존적 조언: ${res.activeKierkegaardTheme.existentialCounsel}`,
    `- 핵심 아포리즘: "${res.focalKierkegaardAphorism.aphorismKo}"`,
    `- 덴마크어 원문: "${res.focalKierkegaardAphorism.aphorismDanish}" [${res.focalKierkegaardAphorism.stageDimension}]`,
    `- 실천적 행동 지침: ${res.focalKierkegaardAphorism.practicalAction}`,
    `- 통합 실존 처방: ${res.kierkegaardPersonalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
