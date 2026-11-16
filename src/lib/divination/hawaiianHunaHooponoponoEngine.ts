/**
 * =========================================================================
 * LUCKEY 고대 하와이 호오포노포노 & 후나 7대 원리 치유 나침반 엔진
 * (Hawaiian Huna & Ho'oponopono Healing Compass Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 폴리네시아 하와이 카후나(Kahuna) 전통의 영적 지혜 체계인 후나(Huna)와
 * 정통 내면 정화 의식 호오포노포노(Ho'oponopono - 균형과 올바름을 바로잡음) 원전.
 * 
 * 1. 7대 후나 우주 원리(Seven Huna Principles):
 *    - 이케 (IKE): 세상은 믿는 대로 존재한다 (The world is what you think it is).
 *    - 칼라 (KALA): 한계는 없다, 모든 것은 연결되어 있다 (There are no limits).
 *    - 마키아 (MAKIA): 에너지는 주의를 기울이는 곳으로 흐른다 (Energy flows where attention goes).
 *    - 마나와 (MANAWA): 지금 이 순간이 유일한 힘의 순간이다 (Now is the moment of power).
 *    - 알로하 (ALOHA): 사랑은 함께 호흡하며 행복을 공유하는 것이다 (To love is to be happy with).
 *    - 마나 (MANA): 모든 영적 생명력은 내면에서 나온다 (All power comes from within).
 *    - 포노 (PONO): 효과가 있는 것이 곧 진리다 (Effectiveness is the measure of truth).
 * 2. 3대 자아 역학 (Three Selves / Kahuna Psychology):
 *    - 우니히필리 (Unihipili, 잠재의식 / 내면의 아이) - 감정과 오래된 기억(메모리) 보관소
 *    - 우하네 (Uhane, 의식 / 성숙한 자아) - 분별과 의지적 결단의 주체
 *    - 아우마쿠아 (Aumakua, 초의식 / 신성한 고위 자아) - 우주 신성과 직결된 순수한 영성
 * 3. 호오포노포노 4대 정화 진언:
 *    - 미안합니다 (I'm sorry) · 용서해주세요 (Please forgive me)
 *    - 감사합니다 (Thank you) · 사랑합니다 (I love you)
 * 4. 마나(Mana, 생명 영적 에너지) 정화 및 전적인 100% 자기 책임 가이드
 */

import type { UserProfile } from '../sharedState';

export const HAWAIIAN_HUNA_VERSION = 'LUCKEY-HAWAIIAN-HUNA-v2.1.0';

export interface HunaPrincipleGuidance {
  code: 'IKE' | 'KALA' | 'MAKIA' | 'MANAWA' | 'ALOHA' | 'MANA' | 'PONO';
  hawaiianName: string;
  koreanMeaning: string;
  coreAxiom: string;
  actionGuideline: string;
  resonanceScore: number; // 0 ~ 100 현재 공명 지수
}

export interface ThreeSelvesBalance {
  unihipiliScore: number;   // 잠재의식(내면의 아이) 감정 정화도 (0 ~ 100)
  uhaneScore: number;       // 의식(성숙한 이성) 결단 명료도 (0 ~ 100)
  aumakuaScore: number;     // 초의식(고위 자아) 영적 연결도 (0 ~ 100)
  triadicHarmonyScore: number; // 삼위일체 조화도 (0 ~ 100)
  innerChildStatus: string; // 내면의 아이 상태 진단 요약
}

export interface HooponoponoPrescription {
  cleansingFocusTheme: string;  // 우선 정화해야 할 무의식 기억/집착
  primaryMantraSequence: string; // '미안합니다 → 용서해주세요 → 감사합니다 → 사랑합니다'
  cleansingRitualPractice: string; // 일상 정화 실천법
  manaReplenishmentAdvice: string; // 마나(Mana) 생명력 충전 지침
}

export interface HawaiianHunaReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  activePrinciple: HunaPrincipleGuidance;
  secondaryPrinciple: HunaPrincipleGuidance;
  threeSelves: ThreeSelvesBalance;
  hooponopono: HooponoponoPrescription;
  totalHealingHarmonics: number; // 0 ~ 100
  synthesisMessage: string;
  interpretiveBoundary: string;
  situationalHunaAudit: {
    questionFocus: string;
    akaCordTension: string;
    cleansingPriority: string;
  };
  temporalHunaRhythm: {
    calculatedAtKst: string;
    alohaManaWindow: string;
    pacificTidePhase: string;
    ritualTimingNote: string;
  };
  hunaSynthesisMatrix: {
    coreMandate: string;
    sacredBoundary: string;
    reflectiveQuestion: string;
  };
}

const HUNA_PRINCIPLES: Array<{
  code: 'IKE' | 'KALA' | 'MAKIA' | 'MANAWA' | 'ALOHA' | 'MANA' | 'PONO';
  hawaiianName: string;
  koreanMeaning: string;
  coreAxiom: string;
  actionGuideline: string;
}> = [
  {
    code: 'IKE',
    hawaiianName: '이케 (Ike)',
    koreanMeaning: '자각과 신념의 힘',
    coreAxiom: '세상은 당신이 믿는 그대로 존재한다 (The world is what you think it is).',
    actionGuideline: '외부 상황을 탓하기 전에 스스로 품고 있는 한계적 신념을 먼저 점검하고 새롭게 규정하십시오.',
  },
  {
    code: 'KALA',
    hawaiianName: '칼라 (Kala)',
    koreanMeaning: '무한한 자유와 연결',
    coreAxiom: '우주에 절대적 한계란 없으며, 모든 존재는 보이지 않는 끈(Aka)으로 이어져 있다.',
    actionGuideline: '과거의 죄책감과 타인에 대한 집착의 끈을 자르고 본연의 자유로운 의식을 회복하십시오.',
  },
  {
    code: 'MAKIA',
    hawaiianName: '마키아 (Makia)',
    koreanMeaning: '집중과 에너지의 흐름',
    coreAxiom: '에너지는 당신이 주의를 집중하는 곳으로 흘러간다 (Energy flows where attention goes).',
    actionGuideline: '결핍이나 두려움 대신, 진정으로 실현하고 싶은 평화와 성취에 순수한 주의를 쏟으십시오.',
  },
  {
    code: 'MANAWA',
    hawaiianName: '마나와 (Manawa)',
    koreanMeaning: '지금 현존의 힘',
    coreAxiom: '힘의 순간은 바로 지금이다 (Now is the moment of power).',
    actionGuideline: '과거의 후회나 미래의 불안을 내려놓고, 지금 숨 쉬는 이 순간에 온전한 행동을 취하십시오.',
  },
  {
    code: 'ALOHA',
    hawaiianName: '알로하 (Aloha)',
    koreanMeaning: '사랑과 영적 공존',
    coreAxiom: '진정한 사랑은 생명의 숨결을 나누며 함께 기뻐하는 것이다.',
    actionGuideline: '조건 없는 수용과 온화한 자비심으로 자신과 주변 인연을 축복하십시오.',
  },
  {
    code: 'MANA',
    hawaiianName: '마나 (Mana)',
    koreanMeaning: '내재된 신성한 힘',
    coreAxiom: '모든 영적 권능과 변화의 힘은 당신 내면에서 비롯된다 (All power comes from within).',
    actionGuideline: '외부의 권위나 인정에 의존하지 말고, 내면에 깃든 고위 자아의 지혜와 능력을 신뢰하십시오.',
  },
  {
    code: 'PONO',
    hawaiianName: '포노 (Pono)',
    koreanMeaning: '조화와 실질적 진리',
    coreAxiom: '효과가 있는 것이 곧 진리의 척도다 (Effectiveness is the measure of truth).',
    actionGuideline: '이론이나 체면에 얽매이지 말고, 당신의 삶에 실질적 평화와 유익을 가져다주는 길을 택하십시오.',
  },
];

export function calculateHawaiianHunaHooponopono(
  profileOrParams: UserProfile | null | undefined | { profile?: UserProfile | null; contextText?: string },
  contextText?: string
): HawaiianHunaReport {
  const profile = (profileOrParams && 'profile' in profileOrParams) ? profileOrParams.profile : (profileOrParams as UserProfile | null | undefined);
  const effectiveContextText = contextText || (profileOrParams && 'contextText' in profileOrParams ? profileOrParams.contextText : '');
  const now = new Date();
  const birthYear = profile?.basic?.birthdate ? parseInt(profile.basic.birthdate.slice(0, 4), 10) || 1995 : 1995;
  const birthMonth = profile?.basic?.birthdate ? parseInt(profile.basic.birthdate.slice(5, 7), 10) || 6 : 6;
  const birthDay = profile?.basic?.birthdate ? parseInt(profile.basic.birthdate.slice(8, 10), 10) || 15 : 15;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const textHash = (effectiveContextText || '')
    .split('')
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);

  const seed = (birthYear * 13 + birthMonth * 37 + birthDay * 19 + currentYear * 7 + currentMonth * 29 + currentDay * 11 + textHash) % 10000;

  // 1. 활성 후나 원리 결정 (이중 교차)
  const principleIndex = seed % HUNA_PRINCIPLES.length;
  const secondaryPrincipleIndex = (principleIndex + 1 + ((seed >> 3) % (HUNA_PRINCIPLES.length - 1))) % HUNA_PRINCIPLES.length;
  const selectedMeta = HUNA_PRINCIPLES[principleIndex];
  const secondaryMeta = HUNA_PRINCIPLES[secondaryPrincipleIndex];
  const resonanceScore = 70 + ((seed * 7) % 29); // 70 ~ 98점
  const secondaryResonanceScore = 68 + ((seed * 11) % 30);

  const activePrinciple: HunaPrincipleGuidance = {
    ...selectedMeta,
    resonanceScore,
  };
  const secondaryPrinciple: HunaPrincipleGuidance = {
    ...secondaryMeta,
    resonanceScore: secondaryResonanceScore,
  };

  // 2. 3대 자아 조화도 산출
  const unihipiliScore = 65 + ((seed * 11 + birthDay * 3) % 33); // 65 ~ 97점 (내면의 아이)
  const uhaneScore = 68 + ((seed * 13 + birthMonth * 5) % 31);     // 68 ~ 98점 (의식 자아)
  const aumakuaScore = 72 + ((seed * 17 + birthYear * 2) % 27);    // 72 ~ 98점 (초의식 자아)
  const triadicHarmonyScore = Math.round((unihipiliScore + uhaneScore + aumakuaScore) / 3);

  let innerChildStatus = '평온하고 안정적인 상태';
  if (unihipiliScore < 75) {
    innerChildStatus = '과거의 미해결 감정과 기억 정화가 필요한 상태';
  } else if (unihipiliScore < 88) {
    innerChildStatus = '자기 사랑과 따뜻한 인정이 샘솟는 조화로운 상태';
  } else {
    innerChildStatus = '초의식과 깊이 교감하며 직관적 영감이 충만한 상태';
  }

  // 3. 호오포노포노 정화 처방
  const cleansingThemes = [
    '인간관계에서의 묵은 서운함과 통제 욕구의 기억 정화',
    '재정적 결핍에 대한 무의식적 불안과 결핍 프로그램 삭제',
    '스스로를 향한 엄격한 자기 비판과 완벽주의 기억 정화',
    '미래에 대한 불확실성과 과거 선택에 대한 후회 지우기',
    '타인의 평가에 대한 집착과 과도한 인정 욕구 비우기',
  ];
  const cleansingFocusTheme = cleansingThemes[seed % cleansingThemes.length];

  const primaryMantraSequence = '미안합니다 (I am sorry) → 용서해주세요 (Please forgive me) → 감사합니다 (Thank you) → 사랑합니다 (I love you)';
  const cleansingRitualPractice = '마음속에 떠오르는 불편한 감정이나 인연을 마주할 때, "이것은 내 안의 어떤 기억이 재생된 것인가?" 자각하고 4대 진언을 속으로 나지막이 4회 이상 반복하십시오.';
  const manaReplenishmentAdvice = '하와이 전통 하(Ha) 호흡법(4박자 들이쉬기, 4박자 멈추기, 4박자 내쉬기, 4박자 멈추기 7세트)을 통해 신성한 마나(Mana) 생명 에너지를 재충전하십시오.';

  const hooponopono: HooponoponoPrescription = {
    cleansingFocusTheme,
    primaryMantraSequence,
    cleansingRitualPractice,
    manaReplenishmentAdvice,
  };

  const totalHealingHarmonics = Math.round((resonanceScore * 0.4) + (triadicHarmonyScore * 0.6));

  const synthesisMessage = `당신의 영혼에 지금 가장 절실한 우주 원리는 [${activePrinciple.hawaiianName}]입니다. 내면의 아이(우니히필리)를 안아주며 "${cleansingFocusTheme}"을 4대 정화 진언으로 깨끗이 지워낼 때, 신성한 포노(Pono, 온전한 평화)가 깃듭니다.`;

  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;
  const calculatedAtKst = `${kstDate.getUTCFullYear()}-${String(kstMonth).padStart(2, '0')}-${String(kstDate.getUTCDate()).padStart(2, '0')} ${String(kstHour).padStart(2, '0')}:${String(kstDate.getUTCMinutes()).padStart(2, '0')} +09:00 KST`;

  const qLower = (effectiveContextText || '').toLowerCase();
  const questionFocus = /연애|사랑|관계|결혼|재회|이별|가족/.test(qLower)
    ? '아카(Aka) 인연의 끈 정화와 알로하 공명 감사'
    : /돈|재물|사업|직장|투자|이직|계약/.test(qLower)
    ? '결핍 기억 삭제와 마키아(Makia) 주의 집중 감사'
    : /건강|불안|피로|마음|수면|치유/.test(qLower)
    ? '우니히필리 내면 아이 감정 정화와 하(Ha) 호흡 감사'
    : '후나 7대 원리 포노(Pono) 균형과 100% 자기 책임 감사';

  const akaCordTension = unihipiliScore < 75
    ? '과거 기억과 얽힌 아카(Aka) 끈을 부드럽게 풀어야 하는 정화 국면'
    : '내면 아이와 의식 자아가 아우마쿠아의 빛 아래 순조롭게 정렬된 국면';

  const cleansingPriority = `우선 정화 초점: ${cleansingFocusTheme}`;

  const alohaManaWindow = kstHour >= 5 && kstHour < 11
    ? '여명 카후나 하(Ha) 호흡 창(새로운 마나를 채우고 이케(Ike) 신념을 세우기 좋음)'
    : kstHour >= 11 && kstHour < 17
    ? '정오 마나와(Manawa) 현존 창(주의를 한 곳에 모아 포노 실천을 하기에 좋음)'
    : kstHour >= 17 && kstHour < 22
    ? '황혼 호오포노포노 정화 창(하루의 서운함과 기억 찌꺼기를 4대 진언으로 씻어내기에 좋음)'
    : '심야 아우마쿠아 침묵 교감 창(내면 아이를 다독이고 고위 자아에 신뢰를 맡기기에 좋음)';

  const pacificTidePhase = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 알로하 생명의 숨결기(새로운 관계와 희망의 씨앗을 품는 주기)'
    : kstMonth >= 6 && kstMonth <= 8
    ? '하계 마나 충만기(뜨거운 열정을 마키아 집중력으로 조율하는 주기)'
    : kstMonth >= 9 && kstMonth <= 11
    ? '추계 칼라(Kala) 해방기(묵은 집착을 끊고 가벼운 자유를 회복하는 주기)'
    : '동계 포노(Pono) 내면 정돈기(외부 소음을 줄이고 진실한 평화를 다지는 주기)';

  const ritualTimingNote = `${alohaManaWindow}과 ${pacificTidePhase}가 겹치므로, ${selectedMeta.actionGuideline}`;

  const trimmedQuery = (effectiveContextText || '').trim();
  const interpretiveBoundary = '하와이 후나·호오포노포노 관점은 의료적 치료나 외부 사건의 인과를 단정하는 도구가 아니라, 내면의 기억과 감정을 돌보는 영적 성찰 렌즈입니다.';
  const hunaSynthesisMatrix = {
    coreMandate: `[${activePrinciple.hawaiianName}] 원리를 기준으로 ${questionFocus}을 수행하십시오.`,
    sacredBoundary: '외부 탓이나 자기 비난의 기억을 재생하지 말고, 모든 경험을 4대 정화 진언의 대상으로 돌리십시오.',
    reflectiveQuestion: trimmedQuery
      ? `'${trimmedQuery}'에서 내 마음속에 올라오는 불편함은 어떤 오래된 기억이 정화를 기다리고 있다는 신호일까요? (${activePrinciple.hawaiianName})`
      : `지금 내 마음속 불편함은 어떤 오래된 기억이 다시 재생되고 있다는 신호일까요? (${activePrinciple.hawaiianName})`,
  };

  return {
    engineVersion: HAWAIIAN_HUNA_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    activePrinciple,
    secondaryPrinciple,
    threeSelves: {
      unihipiliScore,
      uhaneScore,
      aumakuaScore,
      triadicHarmonyScore,
      innerChildStatus,
    },
    hooponopono,
    totalHealingHarmonics,
    synthesisMessage,
    interpretiveBoundary,
    situationalHunaAudit: {
      questionFocus,
      akaCordTension,
      cleansingPriority,
    },
    temporalHunaRhythm: {
      calculatedAtKst,
      alohaManaWindow,
      pacificTidePhase,
      ritualTimingNote,
    },
    hunaSynthesisMatrix,
  };
}

export function formatHawaiianHunaHooponoponoPrompt(report: HawaiianHunaReport): string {
  return `### 🌺 고대 하와이 호오포노포노 & 후나 7대 원리 치유 나침반 엔진 (${HAWAIIAN_HUNA_VERSION})
- **기준 시각(KST)**: ${report.temporalHunaRhythm.calculatedAtKst}
- **질문 맥락 & 아카(Aka) 감사**: ${report.situationalHunaAudit.questionFocus} | ${report.situationalHunaAudit.akaCordTension}
- **활성 후나 원리(Huna Principle)**: ${report.activePrinciple.hawaiianName} [${report.activePrinciple.koreanMeaning}]
  - 핵심 원리: "${report.activePrinciple.coreAxiom}"
  - 실천 지침: ${report.activePrinciple.actionGuideline}
- **보조 교차 원리**: ${report.secondaryPrinciple.hawaiianName} [${report.secondaryPrinciple.koreanMeaning}] — "${report.secondaryPrinciple.coreAxiom}" (${report.secondaryPrinciple.actionGuideline})
- **3대 자아 상태(Three Selves)**: 우니히필리 [${report.threeSelves.innerChildStatus}] · 우하네(의식 분별) · 아우마쿠아(고위 초의식)
- **호오포노포노 정화 처방(Ho'oponopono Cleansing)**:
  - 집중 정화 테마: ${report.hooponopono.cleansingFocusTheme}
  - 정화 진언 시퀀스: ${report.hooponopono.primaryMantraSequence}
  - 일상 실천 의식: ${report.hooponopono.cleansingRitualPractice}
  - 마나(Mana) 생명력 충전: ${report.hooponopono.manaReplenishmentAdvice}
- **시공간 리듬**: ${report.temporalHunaRhythm.alohaManaWindow} · ${report.temporalHunaRhythm.pacificTidePhase}
- **치유 통합 나침반**: ${report.synthesisMessage}
- **교차 매트릭스**: ${report.hunaSynthesisMatrix.coreMandate} | 경계: ${report.hunaSynthesisMatrix.sacredBoundary} | 성찰 질문: "${report.hunaSynthesisMatrix.reflectiveQuestion}"
- **해석 경계**: ${report.interpretiveBoundary}`;
}
