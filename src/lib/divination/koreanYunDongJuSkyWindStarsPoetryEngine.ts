/**
 * 대한민국 윤동주(尹東柱) 시인 《하늘과 바람과 별과 시》 순결한 양심 & 별 헤는 밤·자화상 실존성찰 지혜 엔진
 *
 * 일제강점기 암흑 속에서 순결한 영혼의 등불을 밝힌 대한민국 대표 민족시인이자 실존적 양심의 상징 윤동주(尹東柱, 1917~1945) 선생의 유고 시집 《하늘과 바람과 별과 시(Sky, Wind, Stars and Poetry, 1948)》 원전 기반:
 * 1. 한 점 부끄럼 없는 순결한 양심도(Pure Conscience Integrity Score): "죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를" 바라는 지극히 투명하고 결백한 도덕적 순결성과 진실성.
 * 2. 우물 속 자화상 참회 및 실존적 성찰력(Wellspring Self-Reflective Sincerity Index): 외딴 우물 속 자신을 들여다보며 미워하다 가엾어하고 끝내 그리워하며 화해하는 깊고 솔직한 자아 성찰력.
 * 3. 잎새에 이는 바람의 섬세한 생명 연민 감수성(Leaf Breeze Compassionate Sensibility Score): 가장 작은 것, 여린 것, 상처받은 생명의 신음에도 가슴 아파하며 공감하는 고결한 감수성.
 * 4. 별을 노래하는 불멸의 사랑과 소명 지수(Star-Counting Immortal Love & Vow Index): "별을 노래하는 마음으로 모든 죽어가는 것을 사랑해야지"라는 불멸의 사랑과 자신에게 주어진 길을 묵묵히 걸어가는 소명의식.
 * 5. 어둠을 뚫고 아침을 기다리는 등불 희망 회복탄력성(Lantern of Hope Resilience Score): 시대의 혹독한 암흑 속에서도 "등불을 밝혀 어둠을 조금 내몰고 시대처럼 올 아침을 기다리는" 불굴의 실존적 희망.
 *
 * @version LUCKEY-YUN-DONG-JU-SKY-STARS-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_YUN_DONG_JU_VERSION = 'LUCKEY-YUN-DONG-JU-SKY-STARS-v2.0.0';

export interface YunDongJuTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface YunDongJuAphorism {
  aphorismKey: string;
  poemTitleKo: string;
  verseKo: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanYunDongJuSkyWindStarsPoetryResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 윤동주 하늘과 바람과 별과 시 실존성찰 지표 (0~100)
  pureConscienceIntegrityScore: number;            // 순결한 양심도 (Pure Conscience Integrity)
  wellspringSelfReflectiveSincerityIndex: number;  // 우물 속 자화상 성찰력 (Self-Reflective Sincerity)
  leafBreezeCompassionSensibilityScore: number;    // 잎새에 이는 바람 연민 감수성 (Compassionate Sensibility)
  starCountingImmortalLoveIndex: number;           // 별을 노래하는 사랑과 소명 (Star-Counting Immortal Love)
  lanternHopeResilienceScore: number;              // 어둠 속 등불 희망 회복탄력성 (Lantern of Hope Resilience)
  // 세부 분석
  activeYunDongJuTheme: YunDongJuTheme;
  focalYunDongJuAphorism: YunDongJuAphorism;
  yunDongJuComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  yunDongJuSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatYunDongJuKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeYunDongJuStage(score: number): string {
  if (score >= 90) return '서시의 별빛(序詩星光) — 부끄럼 없는 양심과 만물을 향한 연민이 맑게 어우러진 성찰기';
  if (score >= 84) return '우물 속 화해(井中自畵) — 고독한 자기 응시를 지나 내면의 평온과 소명을 확인하는 정돈기';
  return '등불의 기다림(燈火待朝) — 어둠 속에서도 작은 등불을 밝히며 새벽을 예비하는 조용한 다짐기';
}

export const YUN_DONG_JU_THEMES: YunDongJuTheme[] = [
  {
    themeKey: 'sky_and_pure_conscience',
    themeTitleEn: 'Sky and Pure Conscience (하늘과 부끄럼 없는 양심)',
    themeTitleKo: '하늘을 우러러 한 점 부끄럼 없기를 바라는 절대적 도덕적 순결함',
    existentialInsight: '윤동주의 양심은 타인의 비난이 두려워서가 아니라, 영원한 하늘 아래 서 있는 단독자로서 스스로에게 떳떳하고자 하는 지극한 결백함에서 피어납니다. 부끄러움을 아는 마음이야말로 가장 맑은 영혼의 증거입니다.',
    practicalCounsel: '세상의 타협과 요령에 마음을 내주지 마십시오. 작은 거짓이나 편법에 기대지 않고, 자신의 양심에 비추어 한 치의 부끄러움도 없는 정직한 태도를 지켜낼 때 삶의 뿌리가 깊어집니다.',
  },
  {
    themeKey: 'self_portrait_in_solitary_well',
    themeTitleEn: 'Self-Portrait in the Solitary Well (외딴 우물 속 자화상 성찰)',
    themeTitleKo: '고독한 우물을 들여다보며 부끄러운 자신과 아프게 화해하고 포용함',
    existentialInsight: '우물 속 사나이를 미워하다가도 돌아가는 길에 가엾어지고 끝내 그리워하는 시인의 마음은, 결점투성이의 자신을 정직하게 마주하고 깊은 눈물로 용서하는 숭고한 자아 통합의 과정입니다.',
    practicalCounsel: '자신의 부족함이나 과거의 실수를 자책하며 스스로를 미워하지 마십시오. 우물 속을 가만히 응시하듯 고요히 자신을 보듬고, 못난 나까지도 애정 어린 눈빛으로 품어 안으십시오.',
  },
  {
    themeKey: 'loving_all_dying_things',
    themeTitleEn: 'Loving All Dying Things (모든 죽어가는 것을 향한 사랑)',
    themeTitleKo: '잎새에 이는 미세한 바람에도 고뇌하며 상처받은 만물을 따뜻이 보듬음',
    existentialInsight: '거칠고 메마른 세상 속에서 연약한 것들을 위해 아파할 줄 아는 감수성은 약점이 아니라 최고의 도덕적 용기입니다. 스러져가는 모든 생명을 따스하게 품는 자만이 진정한 시인이자 구도자입니다.',
    practicalCounsel: '주변의 연약한 이웃, 소외된 존재, 말 못 하는 생명의 고통에 무감각해지지 마십시오. 당신의 섬세하고 따뜻한 시선과 다정한 말 한마디가 누군가에게는 살아갈 이유가 됩니다.',
  },
  {
    themeKey: 'counting_stars_of_destiny',
    themeTitleEn: 'Counting Stars of Memory and Love (추억과 사랑의 별을 헤아림)',
    themeTitleKo: '어두운 밤하늘 아래 영원히 빛나는 이상과 그리움의 별을 노래함',
    existentialInsight: '현실이 아무리 캄캄할지라도 가슴속에 추억, 사랑, 쓸쓸함, 동경, 시, 그리고 어머니라는 영원한 별빛을 품고 있는 한, 인간은 결코 길을 잃지 않습니다.',
    practicalCounsel: '눈앞의 고난 때문에 가슴속 소중한 이상과 꿈을 포기하지 마십시오. 밤하늘의 별을 헤아리듯 당신이 진정으로 사랑하고 그리워하는 가치들을 마음에 새기며 꿋꿋이 걸어가십시오.',
  },
  {
    themeKey: 'lighting_lantern_waiting_for_dawn',
    themeTitleEn: 'Lighting the Lantern and Awaiting Dawn (등불을 밝혀 아침을 기다림)',
    themeTitleKo: '시대의 암흑 속에서도 꺼지지 않는 희망의 등불을 밝히며 소명을 완수함',
    existentialInsight: '윤동주는 어둠을 원망하는 대신 스스로 작은 등불을 밝혀 어둠을 내몰고, 시대처럼 반드시 올 아침을 믿었습니다. 가장 어두운 밤은 곧 새벽이 멀지 않았음을 알리는 신호입니다.',
    practicalCounsel: '상황이 절망적으로 보일지라도 한탄에 머물지 마십시오. 오늘 내가 켤 수 있는 작은 등불 하나를 밝히고, 당신 자신에게 격려의 따뜻한 손을 내밀며 다가올 새 아침을 맞이하십시오.',
  },
];

export const YUN_DONG_JU_APHORISMS: YunDongJuAphorism[] = [
  {
    aphorismKey: 'prologue_sky_and_wind',
    poemTitleKo: '《서시(序詩)》',
    verseKo: '죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를, 잎새에 이는 바람에도 나는 괴로워했다. 별을 노래하는 마음으로 모든 죽어가는 것을 사랑해야지. 그리고 나한테 주어진 길을 걸어가야겠다.',
    sourceContext: '《하늘과 바람과 별과 시(Sky, Wind, Stars and Poetry)》 서시 (1941)',
    actionGuidance: '하늘 아래 결백한 양심과 만물을 향한 자애로운 사랑을 품고, 묵묵히 당신에게 주어진 소명의 길을 걸어가십시오.',
  },
  {
    aphorismKey: 'self_portrait_man_in_well',
    poemTitleKo: '〈자화상(自畵像)〉',
    verseKo: '우물 속에는 달이 밝고 구름이 흐르고 하늘이 펼치고 파아란 바람이 불고 가을이 있고 추억처럼 사나이가 있습니다.',
    sourceContext: '《하늘과 바람과 별과 시》 자화상 (1939)',
    actionGuidance: '고독한 내면의 우물 속 자신을 응시하며, 부끄러움과 회한을 맑은 화해와 자애로움으로 승화하십시오.',
  },
  {
    aphorismKey: 'counting_stars_at_night',
    poemTitleKo: '〈별 헤는 밤〉',
    verseKo: '별 하나에 추억과, 별 하나에 사랑과, 별 하나에 쓸쓸함과, 별 하나에 동경과, 별 하나에 시와, 별 하나에 어머니, 어머니.',
    sourceContext: '《하늘과 바람과 별과 시》 별 헤는 밤 (1941)',
    actionGuidance: '어둠 속에서도 영혼의 빛나는 별들을 하나씩 헤아리며, 순수한 첫마음과 소중한 인연들을 기억하십시오.',
  },
  {
    aphorismKey: 'easily_written_poem_lantern',
    poemTitleKo: '〈쉽게 씌어진 시〉',
    verseKo: '등불을 밝혀 어둠을 조금 내몰고, 시대처럼 올 아침을 기다리는 최후의 나. 나는 나에게 작은 손을 내밀어 눈물과 위안으로 잡는 최초의 악수.',
    sourceContext: '《하늘과 바람과 별과 시》 쉽게 씌어진 시 (1942)',
    actionGuidance: '어둠에 굴복하지 말고 오늘 당신의 자리에서 등불을 밝히십시오. 스스로에게 따뜻한 위안의 손을 내밀어 새 시대를 맞이하십시오.',
  },
];

export function calculateKoreanYunDongJuSkyWindStarsPoetry(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanYunDongJuSkyWindStarsPoetryResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `YUN-DONG-JU-SKY-STARS:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const pureConscienceIntegrityScore = 77 + (absHash % 22);
  const wellspringSelfReflectiveSincerityIndex = 75 + ((absHash >> 3) % 24);
  const leafBreezeCompassionSensibilityScore = 76 + ((absHash >> 6) % 23);
  const starCountingImmortalLoveIndex = 78 + ((absHash >> 9) % 21);
  const lanternHopeResilienceScore = 74 + ((absHash >> 12) % 25);

  const themeIndex = (absHash >> 4) % YUN_DONG_JU_THEMES.length;
  const aphorismIndex = (absHash >> 7) % YUN_DONG_JU_APHORISMS.length;

  const activeYunDongJuTheme = YUN_DONG_JU_THEMES[themeIndex];
  const focalYunDongJuAphorism = YUN_DONG_JU_APHORISMS[aphorismIndex];

  const guidanceTitle = `윤동주 하늘과 바람과 별과 시 순결한 양심과 실존 성찰: ${activeYunDongJuTheme.themeTitleKo}`;
  const philosophicalCounsel = `대한민국 민족시인 윤동주 선생의 《하늘과 바람과 별과 시》 정신은 하늘을 우러러 한 점 부끄럼 없기를 바라는 순결한 양심, 우물 속 자신을 응시하며 화해하는 자화상의 참회, 모든 죽어가는 것을 사랑하는 섬세한 연민, 그리고 어둠 속에서 등불을 밝혀 아침을 기다리는 불굴의 희망을 일깨웁니다. ` +
    `현재 당신의 삶을 비추는 영혼의 나침반 원리는 '${activeYunDongJuTheme.themeTitleKo}'입니다. ` +
    `${activeYunDongJuTheme.practicalCounsel} 아울러 ${focalYunDongJuAphorism.poemTitleKo}의 시구 "${focalYunDongJuAphorism.verseKo}"를 가슴 깊이 간직하고, ` +
    `${focalYunDongJuAphorism.actionGuidance}`;

  const calculatedAtKst = formatYunDongJuKstTimestamp(now);
  const avgScore = Math.round(
    (pureConscienceIntegrityScore +
      wellspringSelfReflectiveSincerityIndex +
      leafBreezeCompassionSensibilityScore +
      starCountingImmortalLoveIndex +
      lanternHopeResilienceScore) /
      5,
  );
  const yunDongJuSynthesisMatrix = {
    dominantTension: `${activeYunDongJuTheme.themeTitleKo} ↔ ${focalYunDongJuAphorism.poemTitleKo}`,
    alignmentState: describeYunDongJuStage(avgScore),
    integratedAction: `${focalYunDongJuAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_YUN_DONG_JU_VERSION,
    calculatedAtKst,
    pureConscienceIntegrityScore,
    wellspringSelfReflectiveSincerityIndex,
    leafBreezeCompassionSensibilityScore,
    starCountingImmortalLoveIndex,
    lanternHopeResilienceScore,
    activeYunDongJuTheme,
    focalYunDongJuAphorism,
    yunDongJuComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    yunDongJuSynthesisMatrix,
  };
}

export function formatKoreanYunDongJuSkyWindStarsPoetryPrompt(res: KoreanYunDongJuSkyWindStarsPoetryResult): string {
  const avgScore = Math.round(
    (res.pureConscienceIntegrityScore +
      res.wellspringSelfReflectiveSincerityIndex +
      res.leafBreezeCompassionSensibilityScore +
      res.starCountingImmortalLoveIndex +
      res.lanternHopeResilienceScore) /
      5,
  );
  const lines = [
    `【윤동주 《하늘과 바람과 별과 시》 순결한 양심 & 실존성찰 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 실존 성찰 국면: ${describeYunDongJuStage(avgScore)}`,
    `- 핵심 실존성찰 테마: ${res.activeYunDongJuTheme.themeTitleKo} [${res.activeYunDongJuTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeYunDongJuTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeYunDongJuTheme.practicalCounsel}`,
    `- 핵심 원전 시구: "${res.focalYunDongJuAphorism.verseKo}" [${res.focalYunDongJuAphorism.poemTitleKo}]`,
    `- 원전 출처: [${res.focalYunDongJuAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalYunDongJuAphorism.actionGuidance}`,
    `- 종합 윤동주 문학·실존성찰 권면: ${res.yunDongJuComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.yunDongJuSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.yunDongJuSynthesisMatrix.dominantTension} | 조율 상태: ${res.yunDongJuSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.yunDongJuSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
