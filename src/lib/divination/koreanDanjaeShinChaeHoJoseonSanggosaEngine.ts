/**
 * 대한민국 단재 신채호(丹齋 申采浩) 선생 《조선상고사(朝鮮上古史)》 & 〈조선혁명선언〉 아(我)와 비아(非我)의 주체자각 & 비타협 자주독립·역사의식 실천 지혜 엔진
 *
 * 근대 한국의 위대한 민족사학자이자 독립운동의 사상적 지주인 단재 신채호(丹齋 申采浩, 1880~1936) 선생의 불후의 저작
 * 《조선상고사(朝鮮上古史, 1931)》, 《독사신론(讀史新論, 1908)》, 〈조선혁명선언(朝鮮革命宣言, 1923)〉, 《조선사연구초(朝鮮史硏究草)》 원전 기반:
 * 1. 아(我)의 주체 자각 및 자립 의식도(Ah Subjective Self-Consciousness Index): "역사는 아(我)와 비아(非我)의 투쟁이다"라는 명제에 따른 흔들리지 않는 자기 정체성과 주체적 자립성.
 * 2. 비타협적 자주독립 및 결백 지조 지수(Uncompromising Sovereign Integrity Score): 어떤 외압이나 유혹 앞에서도 굴복하지 않고 꼿꼿이 선 채로 세수를 했다는 단재의 상징적 일화처럼 타협 없는 지조와 청백함.
 * 3. 왜곡 극복 및 역사혼 주체 통찰력(Historical Soul Reclamation Insight Score): 사대주의적 굴종과 왜곡된 통념을 털어내고 참된 뿌리와 주체적 기상을 되살리는 명징한 역사적 분별력.
 * 4. 민중 직접 혁명 역동성 및 변혁 의지(People's Direct Transformation Dynamics Score): 타협이나 잔꾀가 아닌 깨어난 민중의 주체적 힘과 본질적 행동으로 부조리를 쇄신하는 강력한 실천력.
 * 5. 낭가(郞家) 사상 기개 및 불굴 회복탄력성(Nangga Spirit & Indomitable Courage Score): 고대 상무(尙武) 정신과 풍류를 계승하여 어떠한 극한 시련 속에서도 당당히 일어서는 불굴의 기개.
 *
 * @version LUCKEY-DANJAE-SHIN-CHAE-HO-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_DANJAE_SHIN_CHAE_HO_VERSION = 'LUCKEY-DANJAE-SHIN-CHAE-HO-v2.2.0';

export interface DanjaeTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  historicalInsight: string;
  practicalCounsel: string;
}

export interface DanjaeAphorism {
  aphorismKey: string;
  aphorismKo: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanDanjaeShinChaeHoJoseonSanggosaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 단재 신채호 주체 역사의식 지표 (0~100)
  ahSubjectiveConsciousnessIndex: number;          // 아(我)의 주체 자각 및 자립 의식도 (Ah Subjective Self-Consciousness)
  uncompromisingIndependenceScore: number;         // 비타협적 자주독립 및 결백 지조 지수 (Uncompromising Sovereign Integrity)
  historicalIdentityReclamationScore: number;      // 왜곡 극복 및 역사혼 주체 통찰력 (Historical Soul Reclamation Insight)
  peoplesDirectRevolutionDynamic: number;          // 민중 직접 혁명 역동성 및 변혁 의지 (People's Direct Transformation Dynamics)
  indomitableDanjaeResilienceIndex: number;        // 낭가(郞家) 사상 기개 및 불굴 회복탄력성 (Nangga Spirit & Indomitable Courage)
  // 세부 분석
  activeDanjaeTheme: DanjaeTheme;
  focalDanjaeAphorism: DanjaeAphorism;
  secondaryDanjaeAphorism: DanjaeAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  danjaeComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  danjaeSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatDanjaeKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeDanjaeStage(score: number): string {
  if (score >= 90) return '아·비아 주체(我與非我) — 흔들리지 않는 자기 정체성과 낭가의 기개가 하나로 맞물린 돌파기';
  if (score >= 85) return '비타협 지조(不屈志操) — 외부의 기준에 휩쓸리지 않고 본질을 똑바로 세우는 정돈기';
  return '역사혼 자각(歷史魂自覺) — 지나온 경험의 맥락을 되짚으며 주체적 중심을 가다듬는 시기';
}

export const DANJAE_THEMES: DanjaeTheme[] = [
  {
    themeKey: 'ahVsNonAh',
    themeTitleEn: 'Struggle of Ah and Non-Ah: Sovereign Self-Consciousness',
    themeTitleKo: '아(我)와 비아(非我) — 흔들리지 않는 주체적 자기 정체성',
    historicalInsight: '인류 역사는 아(我)와 비아(非我)의 투쟁이며, 시간적으로 끝없이 전개되고 공간적으로 널리 퍼져나가는 심적 활동의 기록입니다. 내 안의 참된 "나(我)"가 바로 서지 않으면 비아(환경과 타자)에 종속되고 맙니다.',
    practicalCounsel: '주변의 기대나 타인의 기준에 휘둘려 당신의 본질을 잃어버리지 마십시오. 당신이라는 존재의 고유한 주체성을 명확히 세우고, 환경에 당당히 맞서는 삶의 주인공이 되십시오.',
  },
  {
    themeKey: 'uncompromisingIntegrity',
    themeTitleEn: 'Uncompromising Integrity: Upright Soul of Danjae',
    themeTitleKo: '비타협적 지조 — 허리를 굽히지 않는 청백한 기개',
    historicalInsight: '단재는 일제 강점기 세수를 할 때조차 왜놈들에게 고개를 숙일 수 없다며 허리를 꼿꼿이 펴고 얼굴을 씻었습니다. 눈앞의 이익이나 편의를 위해 양심과 원칙을 팔지 않는 청백함이야말로 역사를 바꿉니다.',
    practicalCounsel: '작은 이익이나 일시적인 평안을 위해 당신의 도덕적 양심과 자존감을 타협하지 마십시오. 비바람 속에서도 곧게 뻗은 소나무처럼 당신의 원칙을 의연하게 지켜내십시오.',
  },
  {
    themeKey: 'reclaimingHistoricalSoul',
    themeTitleEn: 'Reclaiming the Sovereign Historical Soul',
    themeTitleKo: '역사혼의 회복 — 왜곡된 사대를 깨뜨리고 본래 기상 찾기',
    historicalInsight: '남의 나라 사상과 잣대를 무비판적으로 추종하는 사대주의는 민족의 얼을 병들게 합니다. 신채호는 묘청의 서경 천도 운동을 "조선 역사상 일천년래 제일대사건"으로 보며 자주적 낭가 사상의 맥을 되살렸습니다.',
    practicalCounsel: '외부에서 유행하는 번지르르한 이론이나 남들의 평가에 기죽지 마십시오. 당신 내면에 이미 갖추어진 풍성한 잠재력과 본래의 당당한 기상을 스스로 신뢰하십시오.',
  },
  {
    themeKey: 'peoplesDirectRevolution',
    themeTitleEn: 'Direct Revolution of Awakened People',
    themeTitleKo: '민중의 직접 혁명 — 깨어난 주체의 본질적 쇄신력',
    historicalInsight: '〈조선혁명선언〉에서 단재는 온건한 개량주의나 외세에 구걸하는 외교론을 단호히 배격하고, 민중이 직접 떨쳐 일어나는 근원적 파괴와 새로운 건설을 선언했습니다. 본질을 건드리지 않는 미봉책은 결코 세상을 바꾸지 못합니다.',
    practicalCounsel: '문제를 대충 덮어두거나 임시방편으로 모면하려 하지 마십시오. 문제의 가장 깊은 뿌리를 정면으로 파고들어 과감하고 근본적인 쇄신을 결행하십시오.',
  },
  {
    themeKey: 'spiritOfNangga',
    themeTitleEn: 'Spirit of Nangga: Courage, Vitality and Honor',
    themeTitleKo: '낭가(郞家)의 기개 — 대륙을 호령하던 호방한 용기',
    historicalInsight: '고대 부여와 고구려, 신라 화랑으로 이어진 낭가 정신은 상무적 용맹과 높은 도덕적 기백, 자연과 조화되는 풍류가 하나로 어우러진 한국인의 살아있는 생명력이었습니다.',
    practicalCounsel: '소심한 계산과 위축된 마음을 털어내십시오. 만주 벌판을 달리던 선조들의 호방한 기개처럼 가슴을 활짝 펴고 대범한 용기로 도전에 맞서십시오.',
  },
];

export const DANJAE_APHORISMS: DanjaeAphorism[] = [
  {
    aphorismKey: 'historyAhNonAh',
    aphorismKo: '역사란 무엇인가? 인류 사회의 아(我)와 비아(非我)의 투쟁이 시간부터 공간까지 확대되어 가는 심적 활동의 상태의 기록이다.',
    sourceContext: '《조선상고사(朝鮮上古史)》 총론',
    actionGuidance: '당신의 삶의 무대에서 주체로서의 "나"를 똑똑히 자각하십시오. 외부의 어떤 압력과 혼란 속에서도 당신의 중심을 단단히 쥐고 나아가십시오.',
  },
  {
    aphorismKey: 'nationForgetHistory',
    aphorismKo: '영토를 잃은 민족은 재생할 수 있어도, 역사를 잊은 민족은 재생할 수 없다.',
    sourceContext: '단재 신채호 어록',
    actionGuidance: '당신이 지나온 경험과 그 속에서 얻은 뼈아픈 교훈을 결코 잊지 마십시오. 과거의 실패와 성공의 기억이 오늘 당신을 지키는 가장 견고한 방패입니다.',
  },
  {
    aphorismKey: 'revolutionDeclaration',
    aphorismKo: '민중은 우리 혁명의 대본영(大本營)이다. 폭력은 우리 혁명의 유일한 무기다. 우리는 민중 속에 가서 민중과 손을 잡고 부조리한 낡은 제도를 파괴하고 새 사회를 건설할지니라.',
    sourceContext: '〈조선혁명선언(朝鮮革命宣言)〉 (1923)',
    actionGuidance: '말뿐인 탁상공론을 멈추고 현장의 동료들과 손을 맞잡으십시오. 진실한 실천과 강력한 행동만이 답답한 국면을 단숨에 돌파합니다.',
  },
  {
    aphorismKey: 'danjaeUpright',
    aphorismKo: '자신의 도덕적 양심에 부끄러움이 없다면, 어떠한 권력과 시련 앞에서도 고개를 숙이지 않는다.',
    sourceContext: '단재 신채호 뤼순 감옥 옥중 절의',
    actionGuidance: '당당하게 허리를 펴십시오. 당신이 정의롭고 바른 길을 걷고 있다면 그 누구 앞에서도 결코 위축되거나 비굴해질 필요가 없습니다.',
  },
  {
    aphorismKey: 'myoCheongReform',
    aphorismKo: '자주적인 낭가의 얼을 되살리는 자만이 새 시대를 열어갈 수 있다.',
    sourceContext: '《조선사연구초(朝鮮史硏究草)》 〈조선역사상 일천년래 제일대사건〉',
    actionGuidance: '오래된 인습과 나태를 단호히 부수십시오. 당신 내면의 씩씩한 기개와 혁신의 열정으로 새로운 활로를 개척하십시오.',
  },
];

export function calculateKoreanDanjaeShinChaeHoJoseonSanggosa(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanDanjaeShinChaeHoJoseonSanggosaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `DANJAE-SHIN-CHAE-HO:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const ahSubjectiveConsciousnessIndex = 82 + (absHash % 17);
  const uncompromisingIndependenceScore = 80 + ((absHash >> 3) % 19);
  const historicalIdentityReclamationScore = 78 + ((absHash >> 6) % 21);
  const peoplesDirectRevolutionDynamic = 79 + ((absHash >> 9) % 20);
  const indomitableDanjaeResilienceIndex = 81 + ((absHash >> 12) % 18);

  const themeIndex = (absHash >> 4) % DANJAE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % DANJAE_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (DANJAE_APHORISMS.length - 1))) % DANJAE_APHORISMS.length;

  const activeDanjaeTheme = DANJAE_THEMES[themeIndex];
  const focalDanjaeAphorism = DANJAE_APHORISMS[aphorismIndex];
  const secondaryDanjaeAphorism = DANJAE_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 남의 기준(非我)에 휩쓸리지 않고 내 안의 주체적 중심(我)으로 똑바로 세울 원칙은 무엇인가요?`
    : `지금 내 선택 앞에서 미봉책이나 눈치 보기를 멈추고 본질적인 쇄신으로 밀고 나갈 낭가의 기개는 무엇인가요?`;
  const interpretiveBoundary = '단재 신채호 조선상고사·아와 비아 관점은 길흉 예단이 아니라, 주체성 자각과 비타협적 지조를 비추는 역사 성찰 렌즈입니다.';

  const guidanceTitle = `단재 신채호 주체 역사의식 지혜: ${activeDanjaeTheme.themeTitleKo}`;
  const philosophicalCounsel = `근대 한국의 위대한 민족사학자이자 불굴의 독립투사 단재 신채호 선생은 "아(我)와 비아(非我)의 투쟁" 속에서 꼿꼿한 주체성을 세우고, 비타협적 자주독립과 호방한 낭가의 기개로 시련을 극복하도록 일깨웁니다. ` +
    `현재 당신의 도전을 승리로 이끄는 핵심 지혜는 '${activeDanjaeTheme.themeTitleKo}'입니다. ` +
    `${activeDanjaeTheme.practicalCounsel} 아울러 단재의 명언 "${focalDanjaeAphorism.aphorismKo}"를 가슴에 깊이 새기며, ` +
    `${focalDanjaeAphorism.actionGuidance}`;

  const calculatedAtKst = formatDanjaeKstTimestamp(now);
  const avgScore = Math.round(
    (ahSubjectiveConsciousnessIndex +
      uncompromisingIndependenceScore +
      historicalIdentityReclamationScore +
      peoplesDirectRevolutionDynamic +
      indomitableDanjaeResilienceIndex) /
      5,
  );
  const danjaeSynthesisMatrix = {
    dominantTension: `${activeDanjaeTheme.themeTitleKo} ↔ ${focalDanjaeAphorism.sourceContext}`,
    alignmentState: describeDanjaeStage(avgScore),
    integratedAction: `${focalDanjaeAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${focalDanjaeAphorism.sourceContext}] ${focalDanjaeAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: KOREAN_DANJAE_SHIN_CHAE_HO_VERSION,
    calculatedAtKst,
    ahSubjectiveConsciousnessIndex,
    uncompromisingIndependenceScore,
    historicalIdentityReclamationScore,
    peoplesDirectRevolutionDynamic,
    indomitableDanjaeResilienceIndex,
    activeDanjaeTheme,
    focalDanjaeAphorism,
    secondaryDanjaeAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    danjaeComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    danjaeSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatKoreanDanjaeShinChaeHoJoseonSanggosaPrompt(
  res: KoreanDanjaeShinChaeHoJoseonSanggosaResult,
): string {
  const avgScore = Math.round(
    (res.ahSubjectiveConsciousnessIndex +
      res.uncompromisingIndependenceScore +
      res.historicalIdentityReclamationScore +
      res.peoplesDirectRevolutionDynamic +
      res.indomitableDanjaeResilienceIndex) /
      5,
  );
  const lines = [
    `【단재 신채호 《조선상고사》 & 〈조선혁명선언〉 아(我)의 주체자각 & 자주독립 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 주체 역사의식 국면: ${describeDanjaeStage(avgScore)}`,
    `- 핵심 역사철학 테마: ${res.activeDanjaeTheme.themeTitleKo} [${res.activeDanjaeTheme.themeTitleEn}]`,
    `- 역사철학적 통찰: ${res.activeDanjaeTheme.historicalInsight}`,
    `- 실천적 조언: ${res.activeDanjaeTheme.practicalCounsel}`,
    `- 단재 원전 명언: "${res.focalDanjaeAphorism.aphorismKo}"`,
    `- 보조 교차 명언: "${res.secondaryDanjaeAphorism.aphorismKo}" [${res.secondaryDanjaeAphorism.sourceContext}]`,
    `- 원전 출처: [${res.focalDanjaeAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDanjaeAphorism.actionGuidance}`,
    `- 종합 단재 주체 권면: ${res.danjaeComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.danjaeSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.danjaeSynthesisMatrix.dominantTension} | 조율 상태: ${res.danjaeSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.danjaeSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
