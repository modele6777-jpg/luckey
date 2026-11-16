/**
 * 고대 로마 세네카(Seneca) 인생의 짧음에 대하여(De Brevitate Vitae) & 시간 주권 평정 엔진
 *
 * 서기 1세기 로마 스토아 철학자 세네카의 《인생의 짧음에 대하여(De Brevitate Vitae)》 및 《마음의 평정에 대하여(De Tranquillitate Animi)》 원전 기반.
 * 1. 시간 주권의 탈환(Vindica te tibi): "시간을 그대 자신에게 되돌려주라. 인생이 짧은 것이 아니라 우리가 많은 시간을 낭비하는 것이다."
 * 2. 유예 없는 삶(Non differtur vita): 삶을 미래로 미루지 말고 오늘 이 순간을 온전히 살아내라.
 * 3. 마음의 평정(Tranquillitas Animi): 불안과 동요(Fluctuatio)에서 벗어나 흔들리지 않는 내면의 고요를 유지하라.
 * 4. 영혼의 자족(Autarkeia): 외적인 소유와 인정에 휘둘리지 않고 스스로 온전한 내적 만족에 이름.
 * 5. 죽음의 직시와 현재의 존엄(Memento Mori & Dignitas): 유한성을 직시함으로써 모든 순간을 가장 숭고하게 벼려내는 힘.
 *
 * @version LUCKEY-SENECA-TIME-SOVEREIGNTY-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const SENECA_TIME_SOVEREIGNTY_VERSION = 'LUCKEY-SENECA-TIME-SOVEREIGNTY-v2.2.0';

export interface SenecaStage {
  stageLevel: number;
  stageNameLatin: string;
  stageNameKo: string;
  stoicTimePrinciple: string;
  actionBlessing: string;
}

export interface SenecaTimeSovereigntyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  timeSovereigntyReclaimScore: number;  // 시간 주권 탈환도
  tranquillitasInnerPeaceIndex: number; // 마음의 평정 트란퀼리타스 지수
  presentMomentLivingPower: number;     // 현재 현존 유예 없는 삶의 힘
  stoicAutarkeiaResilience: number;     // 스토아적 자족 탄력성
  animiFluctuatioRelief: number;        // 불안 동요 치유 해소력
  // 세부 명세
  activeSenecaStage: SenecaStage;
  primarySenecaAphorism: {
    themeKo: string;
    latinClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  senecaPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  situationalTimeFocus: {
    detectedTheme: string;
    classicReference: string;
    timeLeakDiagnostic: string;
    reclaimDirective: string;
    reflectiveQuestion: string;
  };
  temporalSenecaRhythm: {
    kstPhaseLabel: string;
    seasonContext: string;
    tranquilityStageKo: string;
    recommendedPractice: string;
  };
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  senecaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export type SenecaTimeSovereigntyReport = SenecaTimeSovereigntyResult;

const SENECA_STAGES: SenecaStage[] = [
  {
    stageLevel: 1,
    stageNameLatin: 'Vindica Te Tibi (시간의 회수)',
    stageNameKo: '남들에게 빼앗겼던 소중한 시간을 온전히 자신에게 돌려놓는 결단',
    stoicTimePrinciple: '우리는 재산은 아끼면서도 가장 돌이킬 수 없는 자산인 시간은 너무도 쉽게 남에게 내어줍니다.',
    actionBlessing: '타인의 무의미한 요구와 헛된 의무에 끌려다니지 말고 오늘 나의 온전한 시간을 선언하십시오.',
  },
  {
    stageLevel: 2,
    stageNameLatin: 'Non Differtur Vita (삶의 유예 중단)',
    stageNameKo: '언젠가 살겠다는 거짓된 약속을 멈추고 지금 이 순간을 사는 태도',
    stoicTimePrinciple: '미래를 기다리느라 현재를 흘려보내는 것이 삶의 가장 큰 낭비입니다.',
    actionBlessing: '중요한 일을 미래로 미루지 말고 오늘 당장 내 영혼이 기뻐하는 한 걸음을 실행하십시오.',
  },
  {
    stageLevel: 3,
    stageNameLatin: 'Tranquillitas Animi (마음의 평정)',
    stageNameKo: '세상의 요동과 내면의 권태를 넘어선 깊고 맑은 고요함',
    stoicTimePrinciple: '외부 조건에 흔들리지 않고 자신의 내적 질서를 확고히 세울 때 참된 평화가 깃듭니다.',
    actionBlessing: '불안과 성급한 조바심을 가라앉히고 오직 내가 통제할 수 있는 영역에 집중하십시오.',
  },
  {
    stageLevel: 4,
    stageNameLatin: 'Autarkeia & Otium (숭고한 여가와 자족)',
    stageNameKo: '불멸의 지혜와 대화하며 온전한 자기 충만에 이르는 삶',
    stoicTimePrinciple: '과거의 위대한 사상들과 교명하며 자신만의 고요한 내면 궁전을 구축하는 고귀함입니다.',
    actionBlessing: '소음 가득한 바깥을 떠나 깊은 독서와 사색으로 영혼의 자족감을 단단히 채우십시오.',
  },
];

const SENECA_APHORISMS = [
  {
    themeKo: '시간 주권 - 인생은 짧지 않다',
    latinClassic: 'Non exiguum temporis habemus, sed multum perdidimus',
    coreEssence: '우리가 가진 시간이 적은 것이 아니라, 우리가 너무 많은 시간을 낭비하고 있을 뿐입니다.',
    actionableDirective: '시간이 부족하다고 탓하지 말고 무가치한 곳으로 새어나가는 시간의 틈을 철저히 막으십시오.',
  },
  {
    themeKo: '현재의 온전한 수용 - 오늘을 붙잡으라',
    latinClassic: 'Omnia quae ventura sunt in incerto iacent: protinus vive',
    coreEssence: '앞으로 올 모든 것은 불확실성 속에 놓여 있으니, 지금 당장 온 힘을 다해 사십시오.',
    actionableDirective: '아직 오지 않은 내일의 두려움에 오늘을 저당잡히지 말고 지금 손에 쥔 시간에 충실하십시오.',
  },
  {
    themeKo: '마음의 평정 - 영혼의 닻을 내림',
    latinClassic: 'Tranquillitas est non concuti animi stabilitas',
    coreEssence: '참된 평정이란 어떤 폭풍우가 몰아쳐도 결코 흔들리지 않는 영혼의 확고한 안정성입니다.',
    actionableDirective: '주변의 잡음과 변덕에 반응하지 말고 고요한 호수처럼 내면의 중심을 지키십시오.',
  },
  {
    themeKo: '영혼의 친구 - 참된 자기 자신과의 만남',
    latinClassic: 'Nemo sibi tantummodo errat, sed alieni erroris et causa et auctor est',
    coreEssence: '군중의 어리석은 흐름에 휩쓸리지 않고 홀로 있어도 외롭지 않은 단단한 자아를 확립하십시오.',
    actionableDirective: '남들의 인정이나 시선에 구걸하지 말고 스스로에게 부끄러움 없는 떳떳한 친구가 되십시오.',
  },
];

function getSenecaKstComponents(now: Date): { hour: number; month: number; isoKst: string } {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  return {
    hour: kstDate.getUTCHours(),
    month: kstDate.getUTCMonth() + 1,
    isoKst: kstDate.toISOString().replace('Z', '+09:00'),
  };
}

function describeSenecaStage(score: number): string {
  if (score >= 90) return '투명하게 정립된 주권의 흐름';
  if (score >= 80) return '단단히 자리 잡은 평정의 흐름';
  if (score >= 70) return '차분히 가라앉는 집중의 흐름';
  return '시간의 틈을 회수하며 다듬는 흐름';
}

function analyzeSenecaSituationalFocus(question: string | undefined, absHash: number) {
  const q = (question ?? '').trim();
  if (/선택|결정|갈등|고민|해야|말아야|이직|포기|계속/.test(q)) {
    return {
      detectedTheme: '결정의 유예 중단과 시간 주권 선언',
      classicReference: '세네카 《인생의 짧음에 대하여》 9장',
      timeLeakDiagnostic: '결정을 미루며 재는 동안 오늘이라는 살아 있는 시간이 타인의 조건과 망설임 속으로 흘러 나가고 있습니다.',
      reclaimDirective: '완벽한 확신을 기다리며 삶을 유예하지 말고, 오늘 내가 직접 통제할 수 있는 첫 번째 행동부터 착수하십시오.',
      reflectiveQuestion: '지금 결정을 미루는 이유는 신중함입니까, 아니면 내 시간의 주인이 되기를 두려워하는 망설임입니까?',
    };
  }
  if (/관계|사람|사랑|친구|가족|동료|연애|서운|배신|미움/.test(q)) {
    return {
      detectedTheme: '타인의 소음에서 영혼의 고요 회수',
      classicReference: '세네카 《마음의 평정에 대하여》 12장',
      timeLeakDiagnostic: '남의 시선과 기분을 맞추느라 정작 나 자신과 대화할 고요한 시간을 내어주고 있을 가능성이 큽니다.',
      reclaimDirective: '모든 사람을 만족시키려는 헛된 분주함을 멈추고, 나 자신에게 떳떳한 시간의 경계를 세우십시오.',
      reflectiveQuestion: '이 관계에서 내가 내어주고 있는 것은 마음입니까, 아니면 되돌릴 수 없는 나의 시간 주권입니까?',
    };
  }
  if (/돈|재물|성공|사업|취업|합격|승진|일|바쁘|야근|피곤/.test(q)) {
    return {
      detectedTheme: '분주함의 착시와 본질적 여가(Otium) 회복',
      classicReference: '세네카 《인생의 짧음에 대하여》 7장 · 14장',
      timeLeakDiagnostic: '성취와 바쁨을 삶의 깊이와 혼동하여, 정작 영혼을 채우는 고요한 사색의 시간을 사치로 미루고 있습니다.',
      reclaimDirective: '돈은 잃어도 다시 벌 수 있으나 흘려보낸 시간은 돌아오지 않음을 기억하며, 하루 중 오롯이 나를 위한 여백을 확보하십시오.',
      reflectiveQuestion: '오늘의 분주함이 끝난 뒤, 진정 내 삶으로 남는 시간은 얼마나 됩니까?',
    };
  }
  if (/불안|두려|막막|걱정|초조|후회|지침|외로|우울/.test(q)) {
    return {
      detectedTheme: '미래의 불안에 저당잡힌 현재의 해방',
      classicReference: '세네카 《루킬리우스에게 보내는 서한》 13서 · 24서',
      timeLeakDiagnostic: '아직 오지 않은 내일의 재난을 미리 앞당겨 앓느라, 지금 손에 쥔 현재의 평온까지 함께 잃고 있습니다.',
      reclaimDirective: '상상 속의 공포와 실제 현실을 분리하고, 오직 오늘 하루의 몫만 차분히 감당하십시오.',
      reflectiveQuestion: '지금 나를 흔드는 것은 눈앞의 현실입니까, 아니면 아직 일어나지 않은 내일의 그림자입니까?',
    };
  }

  return absHash % 2 === 0
    ? {
        detectedTheme: '유예 없는 현재 현존(Non Differtur Vita)',
        classicReference: '세네카 《인생의 짧음에 대하여》 1장 · 9장',
        timeLeakDiagnostic: '바쁜 일정 사이에 틈새 시간이 습관적인 소모로 새어 나가면서 내면의 닻이 느슨해지기 쉽습니다.',
        reclaimDirective: '다음으로 미루던 사소한 정리 하나를 지금 끝내고, 15분의 고요한 호흡으로 시간의 주권을 되찾으십시오.',
        reflectiveQuestion: '지금 당장 남의 요구가 아닌 내 의지로 쓰고 싶은 시간 15분은 무엇입니까?',
      }
    : {
        detectedTheme: '내면의 자족(Autarkeia)과 트란퀼리타스',
        classicReference: '세네카 《마음의 평정에 대하여》 2장',
        timeLeakDiagnostic: '외부 자극이 잦아들지 않을 때 마음의 동요(Fluctuatio)가 얕은 피로로 누적되기 쉽습니다.',
        reclaimDirective: '통제할 수 없는 결과에 대한 조바심을 내려놓고, 스스로 통제할 수 있는 태도와 루틴에 집중하십시오.',
        reflectiveQuestion: '외부의 인정이 없더라도 오늘 내가 스스로 만족할 수 있는 단 하나의 성실함은 무엇입니까?',
      };
}

function buildSenecaTemporalRhythm(hour: number, month: number, peaceScore: number) {
  let kstPhaseLabel = '';
  let recommendedPractice = '';
  if (hour >= 4 && hour < 9) {
    kstPhaseLabel = '새벽 시간 주권 선언기 (04~09시)';
    recommendedPractice = '타인의 연락과 일정이 밀려들기 전, 오늘 하루 내 시간의 우선순위를 먼저 점유하기 좋은 맑은 시간입니다.';
  } else if (hour >= 9 && hour < 14) {
    kstPhaseLabel = '오전 본질 집중기 (09~14시)';
    recommendedPractice = '미루고 있던 핵심 과제 하나를 유예 없이 처리해 삶의 밀도를 높이기 알맞은 시간대입니다.';
  } else if (hour >= 14 && hour < 20) {
    kstPhaseLabel = '오후 동요 조율기 (14~20시)';
    recommendedPractice = '외부 변수와 타인의 속도에 휩쓸리지 않도록 잠깐 멈춰 호흡을 고르고 내면의 평정을 점검하십시오.';
  } else {
    kstPhaseLabel = '밤 영혼 회고와 여가(Otium)기 (20~04시)';
    recommendedPractice = '하루 동안 흘려보낸 시간과 지켜낸 시간을 조용히 결산하며 불안의 닻을 거두기 좋은 시간입니다.';
  }

  let seasonContext = '겨울(Winter · 고요한 내면의 성찰기)';
  if (month >= 3 && month <= 5) seasonContext = '봄(Spring · 시간 질서 재정비기)';
  else if (month >= 6 && month <= 8) seasonContext = '여름(Summer · 열기 속 평정 유지기)';
  else if (month >= 9 && month <= 11) seasonContext = '가을(Autumn · 수확과 비움의 절제기)';

  return {
    kstPhaseLabel,
    seasonContext,
    tranquilityStageKo: describeSenecaStage(peaceScore),
    recommendedPractice,
  };
}

export function calculateSenecaTimeSovereignty(
  profile: UserProfile,
  question?: string,
  now: Date = new Date()
): SenecaTimeSovereigntyResult {
  const seedString = (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'SenecaTimeSovereignty';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const timeSovereigntyReclaimScore = 65 + (absHash % 34);
  const tranquillitasInnerPeaceIndex = 62 + ((absHash >> 3) % 37);
  const presentMomentLivingPower = 64 + ((absHash >> 6) % 35);
  const stoicAutarkeiaResilience = 61 + ((absHash >> 9) % 38);
  const animiFluctuatioRelief = 59 + ((absHash >> 12) % 40);

  const stageIndex = (absHash >> 4) % SENECA_STAGES.length;
  const aphorismIndex = (absHash >> 7) % SENECA_APHORISMS.length;

  const activeSenecaStage = SENECA_STAGES[stageIndex];
  const primarySenecaAphorism = SENECA_APHORISMS[aphorismIndex];
  const { hour, month, isoKst } = getSenecaKstComponents(now);
  const situationalTimeFocus = analyzeSenecaSituationalFocus(question, absHash);
  const temporalSenecaRhythm = buildSenecaTemporalRhythm(hour, month, tranquillitasInnerPeaceIndex);

  const counselTitle = `세네카 시간 주권과 평정: ${activeSenecaStage.stageNameLatin}`;
  const philosophicalGuidance = `현재 질문('${situationalTimeFocus.detectedTheme}') 앞에서 가장 먼저 회복할 것은 외부의 요구에 휘둘리지 않는 시간 주권(Vindica te tibi)입니다. ` +
    `${activeSenecaStage.stoicTimePrinciple} ${situationalTimeFocus.reclaimDirective} ` +
    `삶을 뒤로 미루지 않고(Non differtur vita) 지금 이 순간에 현존할 때 어떤 불안에도 흔들리지 않는 마음의 평정(Tranquillitas)이 자리 잡습니다.`;

  const trimmedQ = (question ?? '').trim();
  const senecaSynthesisMatrix = {
    dominantTension: `${situationalTimeFocus.detectedTheme} ↔ ${activeSenecaStage.stageNameLatin}`,
    alignmentState: `${temporalSenecaRhythm.kstPhaseLabel} · ${temporalSenecaRhythm.tranquilityStageKo}`,
    integratedAction: `${situationalTimeFocus.reclaimDirective}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: SENECA_TIME_SOVEREIGNTY_VERSION,
    calculatedAtKst: isoKst,
    timeSovereigntyReclaimScore,
    tranquillitasInnerPeaceIndex,
    presentMomentLivingPower,
    stoicAutarkeiaResilience,
    animiFluctuatioRelief,
    activeSenecaStage,
    primarySenecaAphorism,
    senecaPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    situationalTimeFocus,
    temporalSenecaRhythm,
    dailyPracticeRitual: `${temporalSenecaRhythm.recommendedPractice} · ${situationalTimeFocus.reclaimDirective}`,
    reflectiveQuestion: situationalTimeFocus.reflectiveQuestion,
    interpretiveBoundary: '세네카의 시간 주권과 평정 지혜는 길흉을 예단하는 점술이 아니라, 유예와 불안에 빼앗긴 오늘의 시간을 자신에게 되돌려놓도록 돕는 스토아 철학 성찰 프레임입니다.',
    senecaSynthesisMatrix,
  };
}

export function formatSenecaTimeSovereigntyPrompt(res: SenecaTimeSovereigntyResult): string {
  const matrixLine = res.senecaSynthesisMatrix
    ? `- 세네카 교차 매트릭스: 핵심 긴장(${res.senecaSynthesisMatrix.dominantTension}) · 조율 상태(${res.senecaSynthesisMatrix.alignmentState}) · 통합 실천(${res.senecaSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【고대 로마 세네카 인생의 짧음에 대하여 & 시간 주권 평정 지표 (${res.engineVersion})】`,
    `- 시간 주권 흐름: ${describeSenecaStage(res.timeSovereigntyReclaimScore)} | 마음의 평정: ${describeSenecaStage(res.tranquillitasInnerPeaceIndex)} | 현재 현존: ${describeSenecaStage(res.presentMomentLivingPower)}`,
    `- 스토아 자족감: ${describeSenecaStage(res.stoicAutarkeiaResilience)} | 불안 동요 해소: ${describeSenecaStage(res.animiFluctuatioRelief)}`,
    `- 현재 평정 단계: ${res.activeSenecaStage.stageNameLatin} (${res.activeSenecaStage.stageNameKo})`,
    `- 질문 맥락 진단(${res.situationalTimeFocus.classicReference}): ${res.situationalTimeFocus.detectedTheme} — ${res.situationalTimeFocus.timeLeakDiagnostic}`,
    `- KST 시공간 리듬 (${res.calculatedAtKst}): ${res.temporalSenecaRhythm.kstPhaseLabel} · ${res.temporalSenecaRhythm.seasonContext} (${res.temporalSenecaRhythm.tranquilityStageKo})`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 질문: "${res.reflectiveQuestion}"`,
    `- 세네카 명언: "${res.primarySenecaAphorism.themeKo}" [${res.primarySenecaAphorism.latinClassic}]`,
    `- 철학적 처방: ${res.senecaPhilosophicalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
