/**
 * 이탈리아 토마스 아퀴나스(Thomas Aquinas) 《신학대전(Summa Theologiae)》
 * 이성·신앙 조화 & 덕론 종합 및 지복직관(Visio Beatifica) 엔진
 *
 * 중세 스콜라 철학의 최고봉 토마스 아퀴나스(1225~1274)의 필생의 역작 《신학대전(Summa Theologiae)》
 * 및 《대이교도대전(Summa contra Gentiles)》 원전 기반:
 * 1. 이성과 신앙의 조화(Gratia non tollit naturam, sed perficit): 은총은 자연을 파괴하지 않고 오히려 완성하며, 이성은 신앙의 앞길을 밝히고 신앙은 이성의 한계를 비춘다는 원융 통합.
 * 2. 우주적 인과 질서 5대 길(Quinque Viae): 제1운동자(Primo Motore), 제1원인자(Causa Prima), 필연적 존재(Ens Necessarium), 완전성의 척도(Gradus Bonitatis), 목적론적 질서(Gubernatio Rerum)를 꿰뚫는 명석한 인과 지성.
 * 3. 7대 덕론 종합(Virtutes Cardinales & Theologales): 4주덕(지혜 Prudentia, 정의 Justitia, 용기 Fortitudo, 절제 Temperantia)과 3신덕(믿음 Fides, 소망 Spes, 사랑 Caritas)의 조화로운 덕성 완성.
 * 4. 자연법(Lex Naturalis)과 실천적 지혜(Prudentia): 인간 본성에 새겨진 선을 행하고 악을 피하라는 근본 도덕 원칙을 일상에서 실천하는 현실 분별력.
 * 5. 지복직관(Visio Beatifica)과 최고선(Summum Bonum): 세상의 덧없는 물질적 성공이나 쾌락을 넘어 존재의 궁극적 행복과 목적을 향해 나아가는 삶의 명료함.
 *
 * @version LUCKEY-THOMAS-AQUINAS-SUMMA-THEOLOGIAE-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const ITALIAN_THOMAS_AQUINAS_VERSION = 'LUCKEY-THOMAS-AQUINAS-SUMMA-THEOLOGIAE-v2.2.0';

export interface AquinasTheme {
  themeKey: string;
  themeTitleLatin: string;
  themeTitleKo: string;
  theologicalInsight: string;
  practicalCounsel: string;
}

export interface AquinasAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismLatin: string;
  summaReference: string;
  actionGuidance: string;
}

export interface ThomasAquinasSummaTheologiaeResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 스콜라 철학 지표 (0~100)
  reasonFaithHarmonyScore: number;                 // 이성(Ratio)과 신앙(Fides)의 원융 조화도
  fiveWaysCausalInsightScore: number;              // 5대 길(Quinque Viae) 우주적 인과 질서 통찰도
  cardinalTheologicalVirtuesBalanceScore: number;  // 4주덕(사원덕)과 3신덕(향주덕) 7대 덕목 균형 지수
  naturalMoralLawPrudenceScore: number;            // 자연법(Lex Naturalis) 실천적 이성 분별력(Prudentia)
  beatificVisionSupremeGoodScore: number;          // 지복직관(Visio Beatifica) 최고선 삶의 목적 명석도
  // 세부 분석
  activeAquinasTheme: AquinasTheme;
  focalAquinasAphorism: AquinasAphorism;
  secondaryAquinasAphorism: AquinasAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  aquinasComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  aquinasSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const AQUINAS_THEMES: AquinasTheme[] = [
  {
    themeKey: 'gratia_perficit_naturam',
    themeTitleLatin: 'Gratia Non Tollit Naturam, Sed Perficit',
    themeTitleKo: '은총은 자연을 없애지 않고 완성함 (이성과 신앙의 화해)',
    theologicalInsight: '초월적 은혜나 영감은 인간의 합리적 이성과 현실적 자연 질서를 부정하는 것이 아니라, 그것을 온전하고 완전하게 고양시킵니다.',
    practicalCounsel: '문제를 풀 때 맹목적인 믿음에만 기대거나 반대로 차가운 계산에만 갇히지 마십시오. 치밀한 이성적 분석 위에 더 큰 직관과 신의를 얹을 때 최상의 해법이 열립니다.',
  },
  {
    themeKey: 'ordo_rationis_quinque_viae',
    themeTitleLatin: 'Ordo Causarum & Quinque Viae',
    themeTitleKo: '인과 질서의 다섯 갈래 길 (우주의 질서정연한 목적성)',
    theologicalInsight: '세상의 모든 혼란과 변화 밑바닥에는 원인 없는 결과가 없으며, 정교한 질서와 목적을 향해 움직이는 섭리가 있습니다.',
    practicalCounsel: '현재 겪고 있는 사건의 표면에만 일희일비하지 마십시오. 근본 원인(Causa Prima)과 과정의 필연성을 꿰뚫어 볼 때 미래의 흔들림을 막을 수 있습니다.',
  },
  {
    themeKey: 'virtutes_septem',
    themeTitleLatin: 'Septem Virtutes: Cardinales et Theologales',
    themeTitleKo: '7대 덕론의 종합 (현실의 사주덕과 영혼의 삼향주덕)',
    theologicalInsight: '현실을 살아가는 지혜·용기·절제·정의라는 인간적 덕목 위에, 믿음·소망·사랑이라는 영적 덕목이 결합될 때 비로소 인격의 온전한 완성이 이루어집니다.',
    practicalCounsel: '정의와 용기를 실천하되 그 밑바탕에 사랑과 신뢰를 잃지 마십시오. 덕성들의 조화로운 균형이 유지될 때 타인을 감화시키는 참된 권위가 생깁니다.',
  },
  {
    themeKey: 'lex_naturalis_prudentia',
    themeTitleLatin: 'Lex Naturalis & Auriga Virtutum',
    themeTitleKo: '자연법과 실천적 분별력 (선을 행하고 악을 피함)',
    theologicalInsight: '모든 사람의 마음에는 옳고 그름을 식별하는 자연법의 빛이 새겨져 있으며, 프로덴시아(실천적 분별력)는 모든 덕을 이끄는 마부입니다.',
    practicalCounsel: '상황이 복잡할수록 기본 상식과 양심의 소리에 집중하십시오. 실천적 분별력을 발휘하여 당장 달콤한 유혹을 물리치고 지속 가능한 올바른 길을 선택하십시오.',
  },
  {
    themeKey: 'visio_beatifica',
    themeTitleLatin: 'Visio Beatifica & Summum Bonum',
    themeTitleKo: '지복직관과 최고선 (삶의 궁극적 행복과 목적)',
    theologicalInsight: '인간의 마음은 유한한 부, 명예, 쾌락으로 결코 온전히 채워질 수 없으며, 궁극적 진리와 선과 마주할 때 비로소 영원한 충만을 누립니다.',
    practicalCounsel: '수단에 불과한 일과 돈을 삶의 궁극적 목적으로 착각하지 마십시오. 당신의 삶이 진정으로 지향하는 최고의 가치가 무엇인지 재정렬하십시오.',
  },
];

export const AQUINAS_APHORISMS: AquinasAphorism[] = [
  {
    aphorismKey: 'gratia_natura',
    aphorismKo: '은총은 자연을 없애지 않고 오히려 그것을 완성한다.',
    aphorismLatin: 'Gratia non tollit naturam, sed perficit.',
    summaReference: '《신학대전》 제1부 제1문 제8조',
    actionGuidance: '당신의 타고난 현실적 재능과 합리성을 긍정하고, 그 위에 높은 이상과 신념을 결합하십시오.',
  },
  {
    aphorismKey: 'tres_ad_salutem',
    aphorismKo: '인간의 구원을 위해서는 믿어야 할 것, 희망해야 할 것, 행해야 할 것을 아는 것이 필요하다.',
    aphorismLatin: 'Tria sunt necessaria homini ad salutem: scire scilicet quid credere, quid sperare, quid agere.',
    summaReference: '《소신학론(Compendium Theologiae)》 서문',
    actionGuidance: '신념(믿음)을 바르게 세우고, 올바른 미래(희망)를 꿈꾸며, 오늘 당장 실천해야 할 행동(행함)을 명료히 하십시오.',
  },
  {
    aphorismKey: 'bonum_faciendum',
    aphorismKo: '선은 행해지고 추구되어야 하며, 악은 회피되어야 한다.',
    aphorismLatin: 'Bonum est faciendum et prosequendum, et malum vitandum.',
    summaReference: '《신학대전》 제1-2부 제94문 제2조 (자연법 제1원리)',
    actionGuidance: '양심의 거울에 비추어 한 점 부끄러움 없는 행동을 과감히 선택하고 어두운 타협을 단호히 거절하십시오.',
  },
  {
    aphorismKey: 'amare_est_velle_bonum',
    aphorismKo: '사랑한다는 것은 타인에게 선한 것이 이루어지기를 바라는 것이다.',
    aphorismLatin: 'Amare est velle alicui bonum.',
    summaReference: '《신학대전》 제1-2부 제26문 제4조',
    actionGuidance: '자기중심적 소유욕을 내려놓고 함께하는 사람들의 진정한 성장과 행복을 위해 마음을 쓰십시오.',
  },
  {
    aphorismKey: 'melior_illuminare',
    aphorismKo: '홀로 빛나는 것보다 타인을 비추어 주는 것이 더 고귀하다.',
    aphorismLatin: 'Maius est illuminare quam lucere solum.',
    summaReference: '《신학대전》 제2-2부 제188문 제6조',
    actionGuidance: '자신만의 성취에 안주하지 말고, 당신이 얻은 통찰과 경험으로 곁의 이웃과 동료들의 길을 환하게 밝혀주십시오.',
  },
];

function formatAquinasKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeAquinasStage(score: number): string {
  if (score >= 90) return '지복직관(Visio Beatifica)기 (이성과 신앙이 최고선 안에서 명석하게 합일되는 흐름)';
  if (score >= 80) return '7대 덕론 조화기 (사주덕과 삼향주덕이 일상 분별력 속에서 균형을 이루는 국면)';
  return '인과 질서 성찰기 (자연법과 양심의 빛으로 근본 원인을 가다듬는 흐름)';
}

export function calculateThomasAquinasSummaTheologiae(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): ThomasAquinasSummaTheologiaeResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `THOMAS-AQUINAS-SUMMA:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const reasonFaithHarmonyScore = 70 + (absHash % 29);
  const fiveWaysCausalInsightScore = 68 + ((absHash >> 3) % 31);
  const cardinalTheologicalVirtuesBalanceScore = 69 + ((absHash >> 6) % 30);
  const naturalMoralLawPrudenceScore = 67 + ((absHash >> 9) % 32);
  const beatificVisionSupremeGoodScore = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % AQUINAS_THEMES.length;
  const aphorismIndex = (absHash >> 7) % AQUINAS_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (AQUINAS_APHORISMS.length - 1))) % AQUINAS_APHORISMS.length;

  const activeAquinasTheme = AQUINAS_THEMES[themeIndex];
  const focalAquinasAphorism = AQUINAS_APHORISMS[aphorismIndex];
  const secondaryAquinasAphorism = AQUINAS_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 냉철한 이성의 분별력(Prudentia)과 흔들리지 않는 신의를 함께 세울 수 있는 선택은 무엇인가요?`
    : `지금 내 하루에서 당장의 작은 이익 대신 궁극적 선(Summum Bonum)과 양심의 질서에 맞게 바로잡아야 할 기준은 무엇인가요?`;
  const interpretiveBoundary = '토마스 아퀴나스 신학대전 관점은 미래의 길흉 예단이 아니라, 이성과 신앙의 조화 및 덕론적 분별을 비추는 스콜라 성찰 렌즈입니다.';

  const guidanceTitle = `토마스 아퀴나스 신학대전 덕론 지혜: ${activeAquinasTheme.themeTitleKo}`;
  const philosophicalCounsel = `토마스 아퀴나스의 스콜라 철학은 합리적 이성과 깊은 영성의 아름다운 화해를 제시합니다. ` +
    `현재 당신의 삶에서 가장 핵심적인 성찰 과제는 '${activeAquinasTheme.themeTitleKo}'에 놓여 있습니다. ` +
    `${activeAquinasTheme.practicalCounsel} 아울러 아퀴나스의 명경구 "${focalAquinasAphorism.aphorismKo}"(${focalAquinasAphorism.aphorismLatin})을 마음에 새기고, ` +
    `${focalAquinasAphorism.actionGuidance}`;

  const aquinasSynthesisMatrix = {
    dominantTension: `${activeAquinasTheme.themeTitleKo} ↔ ${focalAquinasAphorism.summaReference}`,
    alignmentState:
      reasonFaithHarmonyScore >= 85 && beatificVisionSupremeGoodScore >= 85
        ? '이성과 신앙의 조화 및 최고선 지향의 스콜라적 합일'
        : '자연법적 분별력(Prudentia)으로 7대 덕목의 균형을 잡는 국면',
    integratedAction: `${activeAquinasTheme.practicalCounsel} (${focalAquinasAphorism.actionGuidance})`,
  };

  const ritualAction = `[${activeAquinasTheme.themeTitleKo}] ${focalAquinasAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: ITALIAN_THOMAS_AQUINAS_VERSION,
    calculatedAtKst: formatAquinasKstTimestamp(now),
    reasonFaithHarmonyScore,
    fiveWaysCausalInsightScore,
    cardinalTheologicalVirtuesBalanceScore,
    naturalMoralLawPrudenceScore,
    beatificVisionSupremeGoodScore,
    activeAquinasTheme,
    focalAquinasAphorism,
    secondaryAquinasAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    aquinasComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    aquinasSynthesisMatrix,
  };
}

export function formatThomasAquinasSummaTheologiaePrompt(res: ThomasAquinasSummaTheologiaeResult): string {
  const lines = [
    `【토마스 아퀴나스 《신학대전》 이성·신앙 조화 & 덕론 종합 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 이성·신앙 조화도(Ratio & Fides): ${describeAquinasStage(res.reasonFaithHarmonyScore)}`,
    `- 우주적 인과 질서 통찰도(Quinque Viae): ${describeAquinasStage(res.fiveWaysCausalInsightScore)}`,
    `- 7대 덕목 종합 밸런스(Septem Virtutes): ${describeAquinasStage(res.cardinalTheologicalVirtuesBalanceScore)}`,
    `- 자연법 실천 분별력(Lex Naturalis & Prudentia): ${describeAquinasStage(res.naturalMoralLawPrudenceScore)}`,
    `- 지복직관 최고선 지향도(Visio Beatifica): ${describeAquinasStage(res.beatificVisionSupremeGoodScore)}`,
    `- 핵심 스콜라 테마: ${res.activeAquinasTheme.themeTitleKo} [${res.activeAquinasTheme.themeTitleLatin}]`,
    `- 신학·철학적 통찰: ${res.activeAquinasTheme.theologicalInsight}`,
    `- 실천적 조언: ${res.activeAquinasTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalAquinasAphorism.aphorismKo}"`,
    `- 보조 교차 경구: "${res.secondaryAquinasAphorism.aphorismKo}" [${res.secondaryAquinasAphorism.summaReference}]`,
    `- 라틴어 원문: "${res.focalAquinasAphorism.aphorismLatin}" [${res.focalAquinasAphorism.summaReference}]`,
    `- 구체적 실천 지침: ${res.focalAquinasAphorism.actionGuidance}`,
    `- 종합 통찰 권면: ${res.aquinasComprehensiveGuidance.philosophicalCounsel}`,
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.aquinasSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.aquinasSynthesisMatrix.dominantTension} | 조율 상태: ${res.aquinasSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.aquinasSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
