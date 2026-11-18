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
 * @version LUCKEY-CICERO-DE-OFFICIIS-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const CICERO_DE_OFFICIIS_VERSION = 'LUCKEY-CICERO-DE-OFFICIIS-v2.3.0';

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
  situationalDutyFocus: {
    detectedTheme: string;
    classicReference: string;
    ethicalTensionDiagnostic: string;
    honestumDirective: string;
    reflectiveQuestion: string;
  };
  temporalCiceroRhythm: {
    kstPhaseLabel: string;
    seasonContext: string;
    decorumStageKo: string;
    recommendedPractice: string;
  };
  dailyPracticeRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ciceroSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
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

function getCiceroKstComponents(now: Date): { hour: number; month: number; isoKst: string } {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  return {
    hour: kstDate.getUTCHours(),
    month: kstDate.getUTCMonth() + 1,
    isoKst: kstDate.toISOString().replace('Z', '+09:00'),
  };
}

function describeCiceroStage(score: number): string {
  if (score >= 90) return '명징하게 정립된 신의와 품격의 흐름';
  if (score >= 80) return '단정하고 균형 잡힌 공정의 흐름';
  if (score >= 70) return '신뢰와 절제를 가다듬는 성찰의 흐름';
  return '원칙과 실익의 경계를 점검하는 흐름';
}

function analyzeCiceroSituationalFocus(question: string | undefined, absHash: number) {
  const q = (question ?? '').trim();
  if (/돈|재물|이익|계약|거래|사업|창업|협상|수익|손해/.test(q)) {
    return {
      detectedTheme: '도덕적 선(Honestum)과 실익(Utile)의 일치 검증',
      classicReference: '키케로 《의무론》 제3권 11~20절',
      ethicalTensionDiagnostic: '단기적 이익을 위해 신의(Fides)나 투명한 기준을 양보하려는 유혹이 생기기 쉬운 지점입니다.',
      honestumDirective: '도덕적으로 떳떳하지 않은 거래는 결국 신뢰 비용으로 되돌아오므로, 조건과 책임을 투명하게 밝히는 쪽을 택하십시오.',
      reflectiveQuestion: '지금 계산하는 이익에서 상대의 신뢰를 깎아내지 않고도 끝까지 지킬 수 있는 약속은 무엇입니까?',
    };
  }
  if (/관계|사람|동료|가족|친구|갈등|약속|서운|배신|신뢰/.test(q)) {
    return {
      detectedTheme: '정의의 기초인 신의(Fides)와 데코룸(Decorum)',
      classicReference: '키케로 《의무론》 제1권 23절 · 93절',
      ethicalTensionDiagnostic: '감정적 서운함이나 체면이 앞서면 사실의 공정성과 말의 품위를 함께 잃기 쉽습니다.',
      honestumDirective: '감정적 과잉 대신 사실과 약속의 기준을 세우고, 상대의 존엄을 해치지 않는 단정한 어조로 경계를 전하십시오.',
      reflectiveQuestion: '이 갈등에서 내가 지키고 싶은 것은 순간의 감정적 승리입니까, 아니면 오래 가는 신의와 품격입니까?',
    };
  }
  if (/선택|결정|이직|포기|진로|방향|고민|해야|말아야/.test(q)) {
    return {
      detectedTheme: '4대 덕목 기반의 의무 분별과 결단',
      classicReference: '키케로 《의무론》 제1권 15절 · 제2권',
      ethicalTensionDiagnostic: '주변의 평판과 눈앞의 유불리에 시선이 흩어져 내 역량과 본분에 맞는 자리(Decorum)를 놓칠 수 있습니다.',
      honestumDirective: '지혜·정의·용기·절제 중 지금 가장 필요한 한 가지 덕목을 기준으로 선택지를 걸러내고, 결정한 뒤에는 흔들림 없이 이행하십시오.',
      reflectiveQuestion: '두 선택지 가운데 나의 본분과 공동체의 유익이 가장 자연스럽게 만나는 자리는 어디입니까?',
    };
  }

  return absHash % 2 === 0
    ? {
        detectedTheme: '시민적 품격(Decorum)과 공공선(Bonum Commune)',
        classicReference: '키케로 《의무론》 제1권 93~100절',
        ethicalTensionDiagnostic: '개인의 사소한 편의와 전체의 조화 사이에서 균형 감각이 흐려지기 쉬운 순간입니다.',
        honestumDirective: '말과 행동의 절도를 먼저 가다듬고, 내 선택이 주변 사람들에게 어떤 신뢰의 신호로 남을지 살피십시오.',
        reflectiveQuestion: '오늘 나의 말과 태도 중 가장 단정한 품위(Decorum)를 회복하고 싶은 대목은 무엇입니까?',
      }
    : {
        detectedTheme: '약속의 성실한 이행과 떳떳한 명예',
        classicReference: '키케로 《의무론》 제1권 23절',
        ethicalTensionDiagnostic: '작은 약속을 가볍게 미루거나 모호하게 남겨두면 전체 신뢰의 기둥이 약해질 수 있습니다.',
        honestumDirective: '스스로에게 한 약속이든 타인과의 합의든 오늘 안에 매듭지을 수 있는 한 건을 정직하게 완수하십시오.',
        reflectiveQuestion: '지금 내가 정직하게 매듭지어야 할 미완의 약속은 무엇입니까?',
      };
}

function buildCiceroTemporalRhythm(hour: number, month: number, honestumScore: number) {
  let kstPhaseLabel = '';
  let recommendedPractice = '';
  if (hour >= 4 && hour < 9) {
    kstPhaseLabel = '새벽 분별(Prudentia) 정립기 (04~09시)';
    recommendedPractice = '하루의 판단과 약속을 시작하기 전, 사실과 원칙의 기준선을 차분히 세우기 좋은 시간입니다.';
  } else if (hour >= 9 && hour < 14) {
    kstPhaseLabel = '오전 신의(Fides) 실행기 (09~14시)';
    recommendedPractice = '공적인 약속과 책임이 걸린 결정을 공정하고 명료하게 매듭짓기에 적합한 시간대입니다.';
  } else if (hour >= 14 && hour < 20) {
    kstPhaseLabel = '오후 데코룸(Decorum) 조율기 (14~20시)';
    recommendedPractice = '타인과의 이해관계가 맞부딪힐 때 품위 있는 어조와 상호 존중의 선을 지키며 조율하십시오.';
  } else {
    kstPhaseLabel = '밤 의무(Officium) 성찰기 (20~04시)';
    recommendedPractice = '오늘의 언행이 도덕적 선과 진정한 유용성 사이에서 떳떳했는지 고요히 돌아보는 시간입니다.';
  }

  let seasonContext = '겨울(Winter · 원칙 수호와 내면 결속기)';
  if (month >= 3 && month <= 5) seasonContext = '봄(Spring · 신뢰의 토대 개척기)';
  else if (month >= 6 && month <= 8) seasonContext = '여름(Summer · 공공선 실천과 담대한 기개기)';
  else if (month >= 9 && month <= 11) seasonContext = '가을(Autumn · 신의의 결실과 절제기)';

  return {
    kstPhaseLabel,
    seasonContext,
    decorumStageKo: describeCiceroStage(honestumScore),
    recommendedPractice,
  };
}

export function calculateCiceroDeOfficiis(
  profile: UserProfile,
  question?: string,
  now: Date = new Date()
): CiceroDeOfficiisResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
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
  const { hour, month, isoKst } = getCiceroKstComponents(now);
  const situationalDutyFocus = analyzeCiceroSituationalFocus(question, absHash);
  const temporalCiceroRhythm = buildCiceroTemporalRhythm(hour, month, honestumMoralDutyScore);

  const counselTitle = `키케로 의무론: ${activeVirtueFoundation.foundationLatin}`;
  const philosophicalGuidance = `키케로의 《의무론》은 질문('${situationalDutyFocus.detectedTheme}') 앞에서 진정한 유용성(Utile)이 결코 도덕적 선(Honestum)과 어긋나지 않음을 일깨웁니다. ` +
    `《${activeHarmonyCriterion.criterionTitleLatin}》의 원칙에 따라 ${situationalDutyFocus.honestumDirective} ` +
    `특히 ${activeVirtueFoundation.foundationKo}의 덕목을 일상에서 단정하게 실천하십시오. ${activeVirtueFoundation.dutyApplication}`;

  const trimmedQ = (question ?? '').trim();
  const ciceroSynthesisMatrix = {
    dominantTension: `${situationalDutyFocus.detectedTheme} ↔ ${activeVirtueFoundation.foundationLatin}`,
    alignmentState: `${temporalCiceroRhythm.kstPhaseLabel} · ${temporalCiceroRhythm.decorumStageKo}`,
    integratedAction: `${situationalDutyFocus.honestumDirective}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: CICERO_DE_OFFICIIS_VERSION,
    calculatedAtKst: isoKst,
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
    situationalDutyFocus,
    temporalCiceroRhythm,
    dailyPracticeRitual: `${temporalCiceroRhythm.recommendedPractice} · ${situationalDutyFocus.honestumDirective}`,
    ritualAction: `[${activeVirtueFoundation.foundationLatin}] ${situationalDutyFocus.honestumDirective}`,
    reflectionFocus: `키케로 의무론(${situationalDutyFocus.detectedTheme}) — ${activeHarmonyCriterion.criterionTitleLatin}`,
    reflectiveQuestion: situationalDutyFocus.reflectiveQuestion,
    interpretiveBoundary: '키케로 의무론 성찰은 이해득실을 대신 계산해 주는 점술이 아니라, 도덕적 선(Honestum)과 신의(Fides), 시민적 품격(Decorum)의 관점에서 선택을 비추어 보는 윤리적 관점입니다.',
    ciceroSynthesisMatrix,
  };
}

export function formatCiceroDeOfficiisPrompt(res: CiceroDeOfficiisResult): string {
  const matrixLine = res.ciceroSynthesisMatrix
    ? `- 키케로 교차 매트릭스: 핵심 긴장(${res.ciceroSynthesisMatrix.dominantTension}) · 조율 상태(${res.ciceroSynthesisMatrix.alignmentState}) · 통합 실천(${res.ciceroSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【고대 로마 키케로 의무론 도덕적 선 & 유용성 조화 지표 (${res.engineVersion})】`,
    `- 도덕적 선(Honestum): ${describeCiceroStage(res.honestumMoralDutyScore)} | 선과 유용성 조화: ${describeCiceroStage(res.utileJustHarmonyScore)} | 신의(Fides): ${describeCiceroStage(res.fidesPromiseFaithScore)}`,
    `- 시민적 품격(Decorum): ${describeCiceroStage(res.decorumCivicEleganceScore)} | 공공선 실천: ${describeCiceroStage(res.bonumCommuneActionScore)}`,
    `- 도덕적 선의 4대 원천: ${res.activeVirtueFoundation.foundationLatin} (${res.activeVirtueFoundation.foundationKo})`,
    `- 선과 유용성 조화 기준: ${res.activeHarmonyCriterion.criterionTitleLatin} (${res.activeHarmonyCriterion.criterionTitleKo})`,
    `- 질문 맥락 진단(${res.situationalDutyFocus.classicReference}): ${res.situationalDutyFocus.detectedTheme} — ${res.situationalDutyFocus.ethicalTensionDiagnostic}`,
    `- KST 시공간 리듬 (${res.calculatedAtKst}): ${res.temporalCiceroRhythm.kstPhaseLabel} · ${res.temporalCiceroRhythm.seasonContext} (${res.temporalCiceroRhythm.decorumStageKo})`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: "${res.reflectiveQuestion}"`,
    `- 철학적 처방: ${res.ciceroPhilosophicalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
