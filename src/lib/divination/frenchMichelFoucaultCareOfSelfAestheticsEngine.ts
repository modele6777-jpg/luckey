/**
 * 프랑스 미셸 푸코(Michel Foucault) 《감시와 처벌》 & 《주체의 해석학·자기 배려》 규율권력 탈피 & 자기 배려(Souci de soi)·존재의 미학 지혜 엔진
 *
 * 20세기 후기 현대 사상의 거장 미셸 푸코(1926~1984)의 원전 철학 기반:
 * 1. 자기 배려(Souci de soi / Epimeleia heautou) 및 내면 수양 지표 (Care of the Self & Inner Cultivation Score): 타인의 시선과 사회적 평가에 휘둘리지 않고 스스로의 영혼과 삶을 정성껏 가꾸는 주체적 수양력.
 * 2. 규율 권력 및 규범적 길들이기 탈피 지수 (Discipline Liberation & De-normalization Index): 판옵티콘처럼 내면화된 보이지 않는 통제와 정상/비정상의 이분법적 낙인을 해체하는 비판적 자유력.
 * 3. 존재의 미학 및 삶의 예술화 지표 (Aesthetics of Existence & Life as Art Score): 주어진 관습을 수동적으로 따르지 않고 자신의 삶 전체를 하나의 고결하고 독창적인 예술 작품으로 조각하는 창조성.
 * 4. 파레시아(Parrhesia, 진실을 말할 용기) 지수 (Parrhesia & Courage of Truth Index): 위험과 손실을 감수하더라도 침묵이나 위선적 타협을 거부하고 자기 진실을 당당히 선언하는 실천적 용기.
 * 5. 자기 통치성 및 내면의 자유 주권 지표 (Self-Mastery & Autonomous Governance Score): 타인이나 충동의 노예가 되지 않고 자신의 욕망과 정념을 스스로 다스려 참된 주권을 행사하는 내적 자율성.
 *
 * @version LUCKEY-MICHEL-FOUCAULT-CARE-OF-SELF-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_MICHEL_FOUCAULT_CARE_OF_SELF_VERSION = 'LUCKEY-MICHEL-FOUCAULT-CARE-OF-SELF-v2.2.0';

export interface FoucaultTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface FoucaultAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchMichelFoucaultCareOfSelfAestheticsResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 미셸 푸코 핵심 지표 (0~100)
  careOfSelfEpimeleiaScore: number;            // 자기 배려 및 내면 수양 지표 (Care of the Self)
  discourseDisciplineLiberationIndex: number;  // 규율 권력 및 규범적 길들이기 탈피 지수 (Discipline Liberation)
  aestheticsOfExistenceScore: number;          // 존재의 미학 및 삶의 예술화 지표 (Aesthetics of Existence)
  parrhesiaTruthCourageIndex: number;          // 파레시아 진실 발언 용기 지수 (Parrhesia & Courage of Truth)
  selfMasteryGovernanceScore: number;          // 자기 통치성 및 내면 주권 지표 (Self-Mastery Governance)
  // 세부 분석
  activeFoucaultTheme: FoucaultTheme;
  focalFoucaultAphorism: FoucaultAphorism;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  foucaultSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  foucaultComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const FOUCAULT_THEMES: FoucaultTheme[] = [
  {
    themeKey: 'careOfTheSelf',
    themeTitleEn: 'Care of the Self: Tending to One\'s Soul Above External Demands',
    themeTitleKo: '자기 배려의 실천 — 세상의 소음에서 물러나 오롯이 자신을 돌보고 가꾸기',
    pragmaticInsight: '세상은 끊임없이 당신에게 쓸모 있는 부품이 되라고 요구합니다. 푸코의 자기 배려(Souci de soi)는 외적인 의무에 자신을 소진시키지 않고, 고대 그리스인들처럼 자신의 영혼과 정신을 스스로 가장 아끼고 가꾸는 주체적 결단입니다.',
    practicalCounsel: '타인의 인정이나 외부의 압박에 질질 끌려다니지 마십시오. 오늘 하루 단 한 시간이라도 당신 자신의 마음과 건강, 지적 영혼을 온전히 돌보는 시간을 확보하십시오. 나를 먼저 배려할 줄 아는 사람만이 세상에 흔들리지 않습니다.',
  },
  {
    themeKey: 'liberationFromNorms',
    themeTitleEn: 'Breaking Free from Normative Chains: Deconstructing Invisible Panopticons',
    themeTitleKo: '규율 권력의 해체 — 남들이 씌운 정상의 프레임을 깨고 주체적 자유를 회복하기',
    pragmaticInsight: '우리를 가장 옭아매는 것은 감옥의 벽이 아니라 \'남들처럼 평범하고 정상적이어야 한다\'는 보이지 않는 내면의 검열관입니다. 제도가 주입한 정상성의 잣대를 해체할 때 비로소 진정한 자유가 시작됩니다.',
    practicalCounsel: '남들과 비교하며 스스로를 자책하지 마십시오. 당신을 주눅 들게 만드는 기준이 과연 당신 자신의 것인지, 아니면 사회가 주입한 길들이기인지 의심해 보십시오. 남들이 정한 규범을 벗어던지고 고유한 나만의 호흡을 되찾으십시오.',
  },
  {
    themeKey: 'aestheticsOfExistence',
    themeTitleEn: 'Aesthetics of Existence: Sculpting One\'s Whole Life into a Unique Work of Art',
    themeTitleKo: '존재의 미학 — 내 삶 전체를 하나의 독창적인 예술 작품으로 빚어나가기',
    pragmaticInsight: '푸코는 왜 램프나 집만 예술품이 되고 한 인간의 삶은 예술 작품이 될 수 없느냐고 반문했습니다. 하루하루의 선택과 행동, 인간관계와 태도 하나하나를 예술적인 기품으로 다듬어 나가는 것이 삶의 궁극적 목표입니다.',
    practicalCounsel: '수동적인 방관자로 삶을 낭비하지 마십시오. 당신의 삶 전체를 하나의 걸작 예술 작품으로 대하십시오. 매 순간 품격 있는 선택과 아름다운 행동을 통해 당신만의 독창적인 아우라를 조각해 나가십시오.',
  },
  {
    themeKey: 'courageousParrhesia',
    themeTitleEn: 'Courage of Truth: Speaking Truth Unto Power Without False Compromises',
    themeTitleKo: '파레시아의 용기 — 두려움을 뚫고 정직한 진실을 당당하게 말하기',
    pragmaticInsight: '고대 그리스의 파레시아(Parrhesia)는 불이익이나 위험을 무릅쓰고 권력 앞에서 정직한 진실을 말하는 용기였습니다. 침묵이나 비겁한 위선으로 안락함을 사지 않고 진실을 똑바로 말할 때 인간의 존엄이 바로 섭니다.',
    practicalCounsel: '관계가 틀어질까 두려워 부당한 일에 침묵하거나 영혼 없는 거짓말에 가담하지 마십시오. 정중하되 명확하게 당신의 진실을 발언하십시오. 용기 있게 진실을 말하는 사람만이 깊은 신뢰와 존경을 얻습니다.',
  },
  {
    themeKey: 'selfGovernanceMastery',
    themeTitleEn: 'Sovereign Self-Mastery: Governing Desires and Establishing Inner Autonomy',
    themeTitleKo: '자기 통치의 주권 — 외부의 압력에 휘둘리지 않고 스스로 삶의 주인이 되기',
    pragmaticInsight: '자신을 다스리지 못하는 자는 필연적으로 타인의 지배를 받게 됩니다. 참된 권력은 남을 통제하는 것이 아니라, 자신의 욕망과 충동, 게으름을 스스로 다스려 자율적인 주권을 세우는 데 있습니다.',
    practicalCounsel: '순간적인 충동이나 게으른 유혹에 당신의 주권을 넘겨주지 마십시오. 감정을 다스리고 원칙을 세워 삶의 주도권을 장악하십시오. 스스로를 엄격하면서도 자애롭게 통치할 때 완전한 내면의 평정이 찾아옵니다.',
  },
];

export const FOUCAULT_APHORISMS: FoucaultAphorism[] = [
  {
    aphorismKey: 'lifeAsWorkOfArt',
    aphorismKo: '왜 모든 사람의 삶은 하나의 예술 작품이 될 수 없는가? 램프나 집은 예술품이 되면서 왜 우리의 삶은 그러지 못하는가?',
    aphorismFrench: 'Mais la vie de tout individu ne pourrait-elle pas être une œuvre d\'art?',
    sourceContext: '미셸 푸코 《콜레주 드 프랑스 강의: 주체의 해석학(L\'Herméneutique du sujet)》',
    actionGuidance: '삶을 기계적인 반복에 맡기지 마십시오. 당신의 일상과 선택을 하나의 독창적인 예술 작품으로 조각하십시오.',
  },
  {
    aphorismKey: 'careOfSelfFundamental',
    aphorismKo: '자기를 배려하는 것(Souci de soi)이야말로 영혼의 자유를 향한 첫 번째이자 가장 고귀한 의무이다.',
    aphorismFrench: 'Le souci de soi est le principe même de la liberté de l\'âme.',
    sourceContext: '미셸 푸코 《성의 역사 3권: 자기 배려(Le Souci de soi)》',
    actionGuidance: '외부의 요구에 영혼을 갉아먹히지 마십시오. 스스로의 안녕과 존엄을 가장 먼저 따뜻하게 챙기십시오.',
  },
  {
    aphorismKey: 'parrhesiaCourage',
    aphorismKo: '파레시아란 화자가 위험을 무릅쓰고 권력 앞에서 진실을 솔직하게 말하는 불굴의 용기이다.',
    aphorismFrench: 'La parrêsia est le courage de dire la vérité au risque de tout.',
    sourceContext: '미셸 푸코 《진리의 용기(Le Courage de la vérité)》',
    actionGuidance: '눈치를 보느라 진실을 감추지 마십시오. 당당하고 담백한 진실의 힘으로 불필요한 위선을 무너뜨리십시오.',
  },
  {
    aphorismKey: 'whereThereIsPower',
    aphorismKo: '권력이 있는 곳에는 언제나 저항이 존재하며, 그 저항은 자유를 향한 새로운 주체의 탄생점이다.',
    aphorismFrench: 'Là où il y a pouvoir, il y a résistance.',
    sourceContext: '미셸 푸코 《성의 역사 1권: 지식의 의지(La Volonté de savoir)》',
    actionGuidance: '억압적인 통제나 관습적 틀에 무기력하게 굴복하지 마십시오. 창조적인 저항과 주체적 재창조로 새로운 길을 여십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function describeFoucaultStage(score: number): string {
  if (score >= 95) return '깊고 단단한 주체적 자각으로 발현되는 국면';
  if (score >= 91) return '차분히 내면 주권을 회복하며 흐르는 단계';
  return '외부의 시선을 걷어 내고 조용히 정돈되는 흐름';
}

export function calculateFrenchMichelFoucaultCareOfSelfAesthetics(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchMichelFoucaultCareOfSelfAestheticsResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seedString = `MICHEL-FOUCAULT-CARE-OF-SELF:${name}:${birthDate}:${birthTime}:${gender}:${kstDate}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const careOfSelfEpimeleiaScore = 88 + ((absHash >> 1) % 11);
  const discourseDisciplineLiberationIndex = 89 + ((absHash >> 4) % 10);
  const aestheticsOfExistenceScore = 87 + ((absHash >> 7) % 12);
  const parrhesiaTruthCourageIndex = 86 + ((absHash >> 10) % 13);
  const selfMasteryGovernanceScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % FOUCAULT_THEMES.length;
  const aphorismIndex = (absHash >> 8) % FOUCAULT_APHORISMS.length;

  const activeFoucaultTheme = FOUCAULT_THEMES[themeIndex];
  const focalFoucaultAphorism = FOUCAULT_APHORISMS[aphorismIndex];

  const guidanceTitle = `미셸 푸코 자기 배려와 존재의 미학 지혜: ${activeFoucaultTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 후기 현대 비판철학의 거장 미셸 푸코 선생은 《주체의 해석학》과 《자기 배려》를 통해 ` +
    `내면화된 규율 권력의 길들이기를 해체하고, 자신의 영혼과 일상을 스스로 돌보는 '자기 배려(Souci de soi)', ` +
    `위험 앞에서도 진실을 당당히 말하는 '파레시아(Parrhesia)', 그리고 삶 전체를 하나의 고결한 예술 작품으로 조각하는 '존재의 미학'을 설파했습니다. ` +
    `현재 당신이 진정한 자유와 내면의 주권을 되찾는 핵심 통찰은 '${activeFoucaultTheme.themeTitleKo}'입니다. ` +
    `${activeFoucaultTheme.practicalCounsel} 푸코의 불후의 철학 명제 "${focalFoucaultAphorism.aphorismKo}" (${focalFoucaultAphorism.aphorismFrench})를 깊이 새기며, ` +
    `${focalFoucaultAphorism.actionGuidance}`;

  const dailyPracticeRitual =
    '오늘 남의 시선이나 평가 때문이 아니라 오직 나 자신을 돌보기 위한 작은 의식(산책, 침묵, 기록) 한 가지를 스스로 선물해 보세요.';
  const reflectiveQuestion = query?.trim()
    ? `‘${query.trim().slice(0, 48)}’에서 내가 눈치를 보느라 아직 꺼내지 못한 나만의 파레시아(진실한 목소리)는 무엇인가요?`
    : '지금 내 삶을 관습의 복제품이 아니라 하나의 작품으로 빚기 위해 가장 먼저 내려놓을 외부 기준은 무엇인가요?';
  const interpretiveBoundary =
    '미셸 푸코의 자기 배려·존재의 미학 관점은 미래를 예측하거나 점수를 매기는 계산이 아니라, 타율적 시선에서 벗어나 자기 주권을 성찰하는 상징적 렌즈입니다.';

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${kst.toISOString().slice(0, 10)} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} KST`;
  const foucaultSynthesisMatrix = {
    coreInsight: activeFoucaultTheme.themeTitleKo,
    recommendedAction: dailyPracticeRitual,
    cautionNotice: '외부의 시선이나 정상성의 규범을 내면의 검열관으로 삼아 스스로의 주권을 위축시키지 마십시오.',
  };

  return {
    engineVersion: FRENCH_MICHEL_FOUCAULT_CARE_OF_SELF_VERSION,
    calculatedAtKst: kstTimeLabel,
    careOfSelfEpimeleiaScore,
    discourseDisciplineLiberationIndex,
    aestheticsOfExistenceScore,
    parrhesiaTruthCourageIndex,
    selfMasteryGovernanceScore,
    activeFoucaultTheme,
    focalFoucaultAphorism,
    dailyPracticeRitual,
    reflectiveQuestion,
    ritualAction: dailyPracticeRitual,
    reflectionFocus: reflectiveQuestion,
    interpretiveBoundary,
    foucaultSynthesisMatrix,
    foucaultComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchMichelFoucaultCareOfSelfAestheticsPrompt(
  res: FrenchMichelFoucaultCareOfSelfAestheticsResult,
): string {
  return [
    `【미셸 푸코 《주체의 해석학·자기 배려》 규율권력 탈피 및 존재의 미학 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 자기 배려 및 내면 수양(Care of the Self): ${describeFoucaultStage(res.careOfSelfEpimeleiaScore)}`,
    `- 규율 권력 및 정상성 탈피(Discipline Liberation): ${describeFoucaultStage(res.discourseDisciplineLiberationIndex)}`,
    `- 존재의 미학 및 삶의 예술화(Aesthetics of Existence): ${describeFoucaultStage(res.aestheticsOfExistenceScore)}`,
    `- 파레시아 진실 발언 용기(Parrhesia & Courage of Truth): ${describeFoucaultStage(res.parrhesiaTruthCourageIndex)}`,
    `- 자기 통치성 및 내면 주권(Self-Mastery Governance): ${describeFoucaultStage(res.selfMasteryGovernanceScore)}`,
    `- 핵심 푸코 테마: ${res.activeFoucaultTheme.themeTitleKo} [${res.activeFoucaultTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeFoucaultTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeFoucaultTheme.practicalCounsel}`,
    `- 푸코 원전 명언: "${res.focalFoucaultAphorism.aphorismKo}" (${res.focalFoucaultAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalFoucaultAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalFoucaultAphorism.actionGuidance}`,
    `- 일상 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.foucaultSynthesisMatrix.coreInsight}) | 실행(${res.foucaultSynthesisMatrix.recommendedAction}) | 주의(${res.foucaultSynthesisMatrix.cautionNotice})`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 푸코 권면: ${res.foucaultComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
