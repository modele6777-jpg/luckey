/**
 * 대한민국 도산 안창호(島山 安昌浩) 선생 《무실역행(務實力行)》 & 《애기애타(愛己愛他)》 인격혁명·주인정신 실천 엔진
 *
 * 대한민국 임시정부의 기둥이자 겨레의 참된 스승 도산 안창호(島山 安昌浩, 1878~1938) 선생의 흥사단 4대 정신 및 도산 어록 핵심 원전 기반:
 * 1. 무실(務實): 헛된 껍데기와 거짓을 배격하고, 참됨을 일삼으며 정직과 성실로 삶의 반석을 놓음.
 * 2. 역행(力行): 공리공론과 탁상공론을 버리고, 힘써 행하며 말보다 실천을 앞세우는 확고한 실행력.
 * 3. 충의(忠義)와 용감(勇敢): 책임을 회피하지 않고 신의를 지키며, 불의와 나태함에 당당히 맞서는 도덕적 용기.
 * 4. 애기애타(愛己愛他): 나 자신을 참되고 건전한 인격으로 갈고닦음으로써 타인과 공동체를 온전하게 사랑하는 상생 인격 완성.
 * 5. 주인정신(主人精神): "우리 중에 인물이 없는 것은 인물이 되려고 마음먹고 힘쓰는 사람이 없는 까닭이다", 남 탓하지 않고 스스로 역사의 주인이 되어 책임을 지는 주체적 결단력.
 *
 * @version LUCKEY-DOSAN-AHN-CHANGHO-MUSIL-YEOKHAENG-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_DOSAN_AHN_CHANGHO_VERSION = 'LUCKEY-DOSAN-AHN-CHANGHO-MUSIL-YEOKHAENG-v2.1.0';

export interface DosanTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface DosanAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface DosanAhnChanghoMusilYeokhaengResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 도산 인격혁명 및 실천 지표 (0~100)
  musilTruthfulnessScore: number;               // 무실(務實) 참됨을 일삼고 거짓을 버리는 진실·성실도
  yeokhaengActionPowerScore: number;            // 역행(力行) 공리공론을 배격하고 힘써 행하는 실천력
  chunguiYonggamIntegrityScore: number;         // 충의용감(忠義勇敢) 책임을 다하고 신의를 지키는 도덕적 용기
  aegiAetaCharacterIndex: number;               // 애기애타(愛己愛他) 나를 참되게 사랑하고 만인을 품는 인격 완성도
  masterMindOwnerResponsibilityScore: number;   // 주인정신(主人精神) 남 탓하지 않고 스스로 주인이 되는 주체적 책임성
  // 세부 분석
  activeDosanTheme: DosanTheme;
  focalDosanAphorism: DosanAphorism;
  secondaryDosanAphorism: DosanAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  dosanComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  dosanSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatDosanKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeDosanStage(score: number): string {
  if (score >= 90) return '무실역행(務實力行) — 참됨과 묵묵한 실행력이 하나로 맞물려 신뢰를 세우는 성숙기';
  if (score >= 82) return '주인정신(主人精神) — 남 탓을 멈추고 스스로 삶의 중심에 서서 돌파하는 국면';
  return '애기애타(愛己愛他) — 자신을 먼저 정직히 닦으며 이웃과 화합의 기운을 기르는 시기';
}

export const DOSAN_THEMES: DosanTheme[] = [
  {
    themeKey: 'musil_truthfulness',
    themeTitleHanja: '務實 (무실)',
    themeTitleKo: '거짓을 미워하고 오직 참된 진실 위에 삶의 기초를 세움',
    existentialInsight: '죽더라도 거짓이 없어라. 농담으로라도 거짓말을 하지 말라. 꿈에라도 성실을 잃었거든 뼈저리게 뉘우쳐라. 모든 성취와 신뢰의 출발점은 오직 참됨(무실)에 있습니다.',
    practicalCounsel: '작은 허세나 과장, 임기응변의 거짓을 경계하십시오. 사실을 있는 그대로 정직하게 인정하고 마주할 때 비로소 진정한 실력과 신뢰가 쌓입니다.',
  },
  {
    themeKey: 'yeokhaeng_practice',
    themeTitleHanja: '力行 (역행)',
    themeTitleKo: '백 마디 말보다 한 가지 작은 실천을 먼저 옮기는 실행력',
    existentialInsight: '말을 많이 하고 실천이 적으면 결국 제 자신도 속이고 남도 속이게 됩니다. 큰 뜻을 품되 지금 당장 할 수 있는 작은 일부터 힘써 행하는 것이 세상을 바꾸는 유일한 길입니다.',
    practicalCounsel: '더 이상 계획만 세우며 머뭇거리지 마십시오. 오늘 당장 실행할 수 있는 가장 작고 구체적인 일 하나를 정해 끝까지 완수하십시오.',
  },
  {
    themeKey: 'chungui_yonggam',
    themeTitleHanja: '忠義勇敢 (충의용감)',
    themeTitleKo: '맡은 바 책임을 성실히 다하고 불의와 나태에 맞서는 용기',
    existentialInsight: '자신과의 약속과 타인에 대한 신의를 끝까지 지키는 충의, 그리고 옳다고 믿는 일에는 어떤 손해와 비난 앞에서도 흔들리지 않고 나아가는 도덕적 용기가 필요합니다.',
    practicalCounsel: '어려운 상황이 닥치더라도 약속과 원칙을 저버리지 마십시오. 양심이 명하는 바른길이라면 손해를 두려워하지 말고 담대하게 걸어가십시오.',
  },
  {
    themeKey: 'aegi_aeta',
    themeTitleHanja: '愛己愛他 (애기애타)',
    themeTitleKo: '나를 참되게 사랑하여 건전한 인격을 닦고 만인을 따뜻하게 품음',
    existentialInsight: '자신을 진정으로 사랑할 줄 모르는 사람은 타인도 참되게 사랑할 수 없습니다. 내 영혼과 몸을 건강하게 닦아 세우고, 그 맑은 사랑으로 곁에 있는 이들을 감싸 안아야 합니다.',
    practicalCounsel: '스스로를 비하하거나 혹사하지 마십시오. 나 자신을 귀하게 여기고 인격을 갈고닦아, 그 따뜻한 온기를 동료와 이웃에게 아낌없이 베푸십시오.',
  },
  {
    themeKey: 'juin_jeongsin',
    themeTitleHanja: '主人精神 (주인정신)',
    themeTitleKo: '남 탓하지 않고 내가 역사의 주인으로 일어서는 주체적 책임',
    existentialInsight: '"우리 중에 큰 인물이 없는 것은 내가 인물이 되려고 힘쓰지 않기 때문이다." 세상을 비판하기 전에 내가 먼저 주인이 되어 문제 해결의 중심에 서야 합니다.',
    practicalCounsel: '남 탓이나 환경 탓을 멈추십시오. "내가 이 일의 주인이다. 내가 하지 않으면 누가 하겠는가"라는 결연한 각오로 당면한 과제에 앞장서십시오.',
  },
];

export const DOSAN_APHORISMS: DosanAphorism[] = [
  {
    aphorismKey: 'truth_even_in_death',
    aphorismKo: '죽더라도 거짓이 없어라. 농담으로라도 거짓말을 하지 말라.',
    aphorismHanja: '死而無僞 戲亦無妄 (사이무위 희역무망)',
    sourceContext: '《도산안창호어록(島山安昌浩語錄)》 진실 편',
    actionGuidance: '어떤 상황에서도 진실과 정직을 최고의 무기로 삼아 당당하게 나아가십시오.',
  },
  {
    aphorismKey: 'owner_of_history',
    aphorismKo: '우리 가운데 인물이 없는 것은 인물이 되려고 마음먹고 힘쓰는 사람이 없는 까닭이다. 인물이 없다고 한탄하지 말고, 스스로 인물이 되어라.',
    aphorismHanja: '若歎國無人物 則自修爲人物 (약탄국무인물 즉자수위인물)',
    sourceContext: '흥사단 창립 대회 훈화(1913)',
    actionGuidance: '사회의 탓을 하기 전에, 나 자신이 먼저 실력과 인격을 갖춘 주역으로 거듭나십시오.',
  },
  {
    aphorismKey: 'small_task_faithfulness',
    aphorismKo: '낙심은 청년의 무덤이다. 큰 뜻을 품되 작은 일 하나도 소홀히 하지 말고 성실하게 이루어라.',
    aphorismHanja: '落心者 靑年之墓也 (낙심자 청년지묘야)',
    sourceContext: '대성학교 청년 훈화(1908)',
    actionGuidance: '일시적인 좌절에 낙심하지 말고, 작은 일부터 지극정성으로 해내어 큰 성취의 디딤돌을 놓으십시오.',
  },
  {
    aphorismKey: 'smile_and_love',
    aphorismKo: '너도 나도 낯을 붉히고 찡그리지 말고, 빙그레 웃는 얼굴로 서로를 마주하라.',
    aphorismHanja: '微笑相向 和氣充滿 (미소상향 화기충만)',
    sourceContext: '흥사단 미소 운동 및 인격 훈련',
    actionGuidance: '얼굴을 펴고 따뜻한 미소로 상대를 맞이하여, 불필요한 마찰을 지우고 화합의 기운을 채우십시오.',
  },
];

export function calculateDosanAhnChanghoMusilYeokhaeng(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): DosanAhnChanghoMusilYeokhaengResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `DOSAN-AHN-CHANGHO-MUSIL-YEOKHAENG:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const musilTruthfulnessScore = 76 + (absHash % 23);
  const yeokhaengActionPowerScore = 74 + ((absHash >> 3) % 25);
  const chunguiYonggamIntegrityScore = 75 + ((absHash >> 6) % 24);
  const aegiAetaCharacterIndex = 73 + ((absHash >> 9) % 26);
  const masterMindOwnerResponsibilityScore = 77 + ((absHash >> 12) % 22);

  const themeIndex = (absHash >> 4) % DOSAN_THEMES.length;
  const aphorismIndex = (absHash >> 7) % DOSAN_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (DOSAN_APHORISMS.length - 1))) % DOSAN_APHORISMS.length;

  const activeDosanTheme = DOSAN_THEMES[themeIndex];
  const focalDosanAphorism = DOSAN_APHORISMS[aphorismIndex];
  const secondaryDosanAphorism = DOSAN_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 남 탓이나 변명을 멈추고 내가 주인정신으로 오늘 당장 역행(力行)할 작은 실천 한 가지는 무엇인가요?`
    : `오늘 내 말과 행동에서 헛된 껍데기를 덜어 내고 무실(務實)의 참됨으로 채울 한 가지는 무엇인가요?`;
  const interpretiveBoundary = '도산 안창호 무실역행·주인정신 관점은 길흉 예단이 아니라, 성실한 실천과 자기 책임의 인격 수양을 비추는 성찰 렌즈입니다.';

  const guidanceTitle = `도산 안창호 무실역행과 주인정신 실천: ${activeDosanTheme.themeTitleKo}`;
  const philosophicalCounsel = `도산 안창호 선생의 무실역행 정신은 거짓을 버리고 참됨을 일삼으며, 남 탓하지 않고 스스로 주인이 되어 작은 실천을 꾸준히 쌓아갈 것을 가르칩니다. ` +
    `현재 당신의 삶을 인도하는 인격 혁명의 실천 원리는 '${activeDosanTheme.themeTitleKo}'입니다. ` +
    `${activeDosanTheme.practicalCounsel} 아울러 도산 선생의 불멸의 경구 "${focalDosanAphorism.aphorismKo}"(${focalDosanAphorism.aphorismHanja})을 가슴 깊이 새기고, ` +
    `${focalDosanAphorism.actionGuidance}`;

  const calculatedAtKst = formatDosanKstTimestamp(now);
  const avgScore = Math.round(
    (musilTruthfulnessScore +
      yeokhaengActionPowerScore +
      chunguiYonggamIntegrityScore +
      aegiAetaCharacterIndex +
      masterMindOwnerResponsibilityScore) /
      5,
  );
  const dosanSynthesisMatrix = {
    dominantTension: `${activeDosanTheme.themeTitleKo} ↔ ${focalDosanAphorism.sourceContext}`,
    alignmentState: describeDosanStage(avgScore),
    integratedAction: `${focalDosanAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_DOSAN_AHN_CHANGHO_VERSION,
    calculatedAtKst,
    musilTruthfulnessScore,
    yeokhaengActionPowerScore,
    chunguiYonggamIntegrityScore,
    aegiAetaCharacterIndex,
    masterMindOwnerResponsibilityScore,
    activeDosanTheme,
    focalDosanAphorism,
    secondaryDosanAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    dosanComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    dosanSynthesisMatrix,
  };
}

export function formatDosanAhnChanghoMusilYeokhaengPrompt(res: DosanAhnChanghoMusilYeokhaengResult): string {
  const avgScore = Math.round(
    (res.musilTruthfulnessScore +
      res.yeokhaengActionPowerScore +
      res.chunguiYonggamIntegrityScore +
      res.aegiAetaCharacterIndex +
      res.masterMindOwnerResponsibilityScore) /
      5,
  );
  const lines = [
    `【도산 안창호 《무실역행》 인격혁명 & 주인정신 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 인격·실천 국면: ${describeDosanStage(avgScore)}`,
    `- 핵심 실천 테마: ${res.activeDosanTheme.themeTitleKo} [${res.activeDosanTheme.themeTitleHanja}]`,
    `- 실존적 통찰: ${res.activeDosanTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeDosanTheme.practicalCounsel}`,
    `- 핵심 도산 경구: "${res.focalDosanAphorism.aphorismKo}"`,
    `- 보조 교차 경구: "${res.secondaryDosanAphorism.aphorismKo}" [${res.secondaryDosanAphorism.sourceContext}]`,
    `- 원문 출처: "${res.focalDosanAphorism.aphorismHanja}" [${res.focalDosanAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDosanAphorism.actionGuidance}`,
    `- 종합 인격혁명 권면: ${res.dosanComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.dosanSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.dosanSynthesisMatrix.dominantTension} | 조율 상태: ${res.dosanSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.dosanSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
