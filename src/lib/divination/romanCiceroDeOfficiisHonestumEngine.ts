/**
 * 고대 로마 키케로(Cicero) 《의무론(De Officiis)》 도덕적 선(Honestum) & 유용성(Utile) 조화 처세 엔진
 *
 * 서기전 44년 키케로의 역작 《의무론(De Officiis)》 원전 기반.
 * 1. 도덕적 선(Honestum): 인간 본성의 4대 원천(지혜·정의·용기·절제)에서 비롯되는 가장 숭고한 도덕적 의무.
 * 2. 유용성(Utile): 현실적 이익과 실용적 가치. 키케로는 도덕적 선과 진정한 유용성은 결코 상충할 수 없음을 천명함.
 * 3. 신의(Fides): 정의의 기초이자 약속과 계약을 진실하게 지키는 불변의 성실함.
 * 4. 데코룸(Decorum): 상황과 분수에 맞는 시민적 품격, 적절함, 그리고 온당한 행동 양식.
 * 5. 공공선(Bonum Commune): 개인의 사적 이해관계를 넘어 공동체의 번영과 정의에 기여하는 헌신.
 *
 * @version LUCKEY-CICERO-DE-OFFICIIS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const CICERO_DE_OFFICIIS_VERSION = 'LUCKEY-CICERO-DE-OFFICIIS-v1.0.0';

export interface CiceroVirtueFoundation {
  foundationLatin: string;
  foundationKo: string;
  moralPrinciple: string;
  dutyApplication: string;
}

export interface CiceroHarmonyCriterion {
  criterionTitleLatin: string;
  criterionTitleKo: string;
  ethicalGuideline: string;
  resolutionDirective: string;
}

export interface CiceroDeOfficiisResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  honestumMoralDutyScore: number;       // 도덕적 선과 의무결의도
  utileJustHarmonyScore: number;        // 유용성과 정의의 일치조화력
  fidesPromiseFaithScore: number;       // 신의와 약속준수 신뢰도
  decorumCivicEleganceScore: number;    // 시민적 품격과 적절성지수
  bonumCommuneActionScore: number;      // 공공선과 사회기여 실천력
  // 세부 명세
  activeVirtueFoundation: CiceroVirtueFoundation;
  activeHarmonyCriterion: CiceroHarmonyCriterion;
  ciceroPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type CiceroDeOfficiisReport = CiceroDeOfficiisResult;

const VIRTUE_FOUNDATIONS: CiceroVirtueFoundation[] = [
  {
    foundationLatin: 'Prudentia (지혜와 진리 탐구)',
    foundationKo: '진리를 탐구하고 참과 거짓을 분별하는 지적 미덕',
    moralPrinciple: '충동적인 편견이나 확인되지 않은 소문에 휩쓸리지 않고 객관적 사실을 엄정하게 밝힘',
    dutyApplication: '복잡한 결정을 내릴 때 사실 관계를 철저히 검증하고 성급한 판단을 유보하십시오.',
  },
  {
    foundationLatin: 'Justitia & Beneficentia (정의와 관용)',
    foundationKo: '각자에게 그의 몫을 주고 타인에게 해를 끼치지 않는 공동체적 의무',
    moralPrinciple: '공공의 재산을 지키고, 사적 이익을 위해 타인의 권리를 침해하지 않는 엄격한 공정성',
    dutyApplication: '모든 관계에서 사사로운 이득보다 신의(Fides)와 공평무사한 기준을 최우선으로 두십시오.',
  },
  {
    foundationLatin: 'Fortitudo (용기와 정신의 위대함)',
    foundationKo: '외부의 역경과 세속적 유혹 앞에서 굴복하지 않는 당당한 영혼',
    moralPrinciple: '죽음이나 고통, 세속의 비난을 두려워하지 않고 오직 정의를 위해 분투하는 불굴의 기개',
    dutyApplication: '단기적 손실이나 비난이 따르더라도 도덕적으로 정당한 원칙을 꿋꿋하게 밀고 나가십시오.',
  },
  {
    foundationLatin: 'Temperantia & Decorum (절제와 합당한 품위)',
    foundationKo: '모든 언행에서 절도를 지키고 상황에 맞는 적절한 품위를 유지함',
    moralPrinciple: '욕망의 과도함을 제어하고 때와 장소, 상대에 걸맞은 단정하고 우아한 태도를 지킴',
    dutyApplication: '감정적인 과잉 반응을 삼가고 상황의 격식과 상호 존중의 선을 단정하게 지키십시오.',
  },
];

const HARMONY_CRITERIA: CiceroHarmonyCriterion[] = [
  {
    criterionTitleLatin: 'Honestum et Utile Idem Est (선과 유용성의 일치)',
    criterionTitleKo: '도덕적으로 올바르지 않은 것은 결코 진정으로 유용할 수 없다는 원칙',
    ethicalGuideline: '부당한 수단으로 얻은 이익은 결국 파멸을 부르며, 오직 정당한 선만이 지속 가능한 번영을 낳음',
    resolutionDirective: '눈앞의 이득이 도덕적 원칙과 부딪힐 때는 망설임 없이 원칙을 택하십시오. 그것이 장기적으로 가장 유익합니다.',
  },
  {
    criterionTitleLatin: 'Fundamentum Justitiae Fides (정의의 기초인 신의)',
    criterionTitleKo: '말과 약속을 성실하게 이행하는 신뢰가 모든 인간 결속의 뿌리라는 원칙',
    ethicalGuideline: '약속을 가볍게 어기는 자는 사회의 기반을 무너뜨리는 자이며, 신의를 지키는 자만이 참된 명예를 얻음',
    resolutionDirective: '한번 내뱉은 말과 합의는 불리한 조건에 처하더라도 끝까지 정직하게 이행하여 절대적 신뢰를 쌓으십시오.',
  },
  {
    criterionTitleLatin: 'Salus Populi Suprema Lex (공공의 안녕이 최상의 법)',
    criterionTitleKo: '개인의 사익 추구는 공동체 전체의 조화와 안녕 속에서만 정당화된다는 원칙',
    ethicalGuideline: '사리사욕만을 탐하는 행위는 스스로를 고립시키며, 주변과 상생하는 선택만이 영속성을 가짐',
    resolutionDirective: '나의 결정이 주변 동료나 조직, 파트너에게 미칠 파급효과를 살피고 함께 상생하는 해법을 구축하십시오.',
  },
  {
    criterionTitleLatin: 'Decorum in Actu (행위 속의 품격과 적절성)',
    criterionTitleKo: '인간으로서의 존엄성과 지위에 어울리는 단정하고 합당한 태도를 견지하는 원칙',
    ethicalGuideline: '내면의 덕은 외면의 절도 있는 예의와 언행으로 완성되며, 품격 있는 태도가 갈등을 예방함',
    resolutionDirective: '상대방의 인격을 존중하고, 상황에 어울리는 절제된 어조와 세련된 태도로 소통하십시오.',
  },
];

export function calculateCiceroDeOfficiis(params: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): CiceroDeOfficiisResult {
  const { profile, question } = params;

  const seedString =
    (question ?? '') +
    (profile?.name ?? (profile as any)?.userName ?? 'seeker') +
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'CiceroDeOfficiis';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const honestumMoralDutyScore = 66 + (absHash % 33);
  const utileJustHarmonyScore = 64 + ((absHash >> 3) % 35);
  const fidesPromiseFaithScore = 67 + ((absHash >> 6) % 32);
  const decorumCivicEleganceScore = 61 + ((absHash >> 9) % 38);
  const bonumCommuneActionScore = 63 + ((absHash >> 12) % 36);

  const virtueIndex = (absHash >> 4) % VIRTUE_FOUNDATIONS.length;
  const harmonyIndex = (absHash >> 7) % HARMONY_CRITERIA.length;

  const activeVirtueFoundation = VIRTUE_FOUNDATIONS[virtueIndex];
  const activeHarmonyCriterion = HARMONY_CRITERIA[harmonyIndex];

  const counselTitle = `키케로 의무론: ${activeVirtueFoundation.foundationLatin}`;
  const philosophicalGuidance = `키케로의 《의무론》에 따르면 진정한 유용성(Utile)은 결코 도덕적 선(Honestum)과 어긋나지 않습니다. ` +
    `현재 당면한 문제에서는 《${activeHarmonyCriterion.criterionTitleLatin}》의 원칙에 입각하여 ${activeHarmonyCriterion.resolutionDirective} ` +
    `특히 ${activeVirtueFoundation.foundationKo}의 덕목을 실천하십시오. ${activeVirtueFoundation.dutyApplication}`;

  return {
    engineVersion: CICERO_DE_OFFICIIS_VERSION,
    calculatedAtKst: new Date().toISOString(),
    honestumMoralDutyScore,
    utileJustHarmonyScore,
    fidesPromiseFaithScore,
    decorumCivicEleganceScore,
    bonumCommuneActionScore,
    activeVirtueFoundation,
    activeHarmonyCriterion,
    ciceroPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatCiceroDeOfficiisPrompt(res: CiceroDeOfficiisResult): string {
  return [
    `【고대 로마 키케로 의무론 도덕적 선 & 유용성 조화 지표】`,
    `- 도덕적 선과 의무결의도: ${res.honestumMoralDutyScore}/100`,
    `- 유용성과 정의의 일치조화력: ${res.utileJustHarmonyScore}/100`,
    `- 신의와 약속준수 신뢰도: ${res.fidesPromiseFaithScore}/100`,
    `- 시민적 품격과 적절성지수: ${res.decorumCivicEleganceScore}/100`,
    `- 공공선과 사회기여 실천력: ${res.bonumCommuneActionScore}/100`,
    `- 도덕적 선의 4대 원천: ${res.activeVirtueFoundation.foundationLatin} (${res.activeVirtueFoundation.foundationKo})`,
    `- 덕목 실천 지침: ${res.activeVirtueFoundation.dutyApplication}`,
    `- 선과 유용성 조화 기준: ${res.activeHarmonyCriterion.criterionTitleLatin} (${res.activeHarmonyCriterion.criterionTitleKo})`,
    `- 윤리적 판단 지침: ${res.activeHarmonyCriterion.ethicalGuideline}`,
    `- 갈등 해결 명령: ${res.activeHarmonyCriterion.resolutionDirective}`,
    `- 철학적 처방: ${res.ciceroPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
