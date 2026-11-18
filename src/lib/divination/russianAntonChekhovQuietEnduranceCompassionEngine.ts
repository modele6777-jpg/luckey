/**
 * 러시아 안톤 체호프(Anton Chekhov) 《바냐 아저씨》 & 《갈매기》 일상의 진실 직시 & 묵묵한 인내·담담한 자비와 위로 지혜 엔진
 *
 * 19세기 러시아 문학 및 근대 희곡의 거장 안톤 체호프(1860~1904)의 원전 기반:
 * 1. 허위의식 타파 및 일상의 진실 직시도 (Unpretentious Truthfulness & Reality Confrontation Score): 과장된 감상이나 헛된 환상을 걷어내고 삶의 있는 그대로의 진실을 응시하는 정직성.
 * 2. 묵묵한 일상 노동과 성실한 인내 지수 (Quiet Endurance & Faithful Diligence Index): "우리는 살아가야 합니다, 바냐 아저씨"처럼 거창한 이상 대신 오늘 내게 주어진 일을 묵묵히 해내는 인내.
 * 3. 상처받은 인간을 향한 담담한 자비와 연민 지표 (Subtle Compassion & Gentle Empathy Index): 소란스럽지 않고 낮고 따스하게 타인의 고통을 묵묵히 곁에서 품어주는 깊은 연민.
 * 4. 통속적 세속성에 물들지 않는 내면의 소박한 품격 지수 (Inner Decency & Quiet Integrity Score): 천박한 허영과 세속적 평가에 휘둘리지 않고 인간으로서의 소박한 도의를 지키는 품격.
 * 5. 고난 속에서도 영혼의 평정을 잃지 않는 은근한 회복탄력성 (Gentle Fortitude & Unfading Hope Resilience): 삶의 피로와 환멸 속에서도 끝내 절망하지 않고 다음 날의 새벽을 맞이하는 회복탄력성.
 *
 * @version LUCKEY-ANTON-CHEKHOV-QUIET-ENDURANCE-COMPASSION-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const RUSSIAN_ANTON_CHEKHOV_QUIET_ENDURANCE_COMPASSION_VERSION = 'LUCKEY-ANTON-CHEKHOV-QUIET-ENDURANCE-COMPASSION-v2.3.0';

export interface ChekhovTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface ChekhovAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismRussian: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface RussianAntonChekhovQuietEnduranceCompassionResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 안톤 체호프 핵심 지표 (0~100)
  unpretentiousTruthfulnessScore: number;                 // 일상의 진실 직시도 (Unpretentious Truthfulness & Reality)
  quietEnduranceDiligenceIndex: number;                   // 묵묵한 일상 노동과 성실한 인내 지수 (Quiet Endurance & Diligence)
  subtleCompassionEmpathyIndex: number;                   // 상처받은 인간을 향한 담담한 자비와 연민 지표 (Subtle Compassion & Gentle Empathy)
  innerDecencyIntegrityScore: number;                     // 내면의 소박한 품격 지수 (Inner Decency & Integrity)
  gentleFortitudeHopeResilience: number;                  // 은근한 희망과 심신 회복탄력성 (Gentle Fortitude & Unfading Hope)
  // 세부 분석
  activeChekhovTheme: ChekhovTheme;
  focalChekhovAphorism: ChekhovAphorism;
  chekhovComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  chekhovSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  // v2.1.0 심층 보강: 이중 원전 교차·성찰 질문·해석 경계
  secondaryChekhovAphorism?: ChekhovAphorism;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveChekhovQuestion: string;
  reflectiveQuestion?: string;
  interpretiveBoundary: string;
}

function formatChekhovKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeChekhovStage(score: number): string {
  if (score >= 93) return '바냐의 새벽(Quiet Dawn) — 허위의식을 벗고 묵묵한 일상 노동과 담담한 자비가 한데 어우러지는 성숙기';
  if (score >= 88) return '자작나무 숲(Planting One Tree) — 내면의 소박한 품격을 지키며 오늘 할 일을 차분히 쌓아가는 안정기';
  return '갈매기의 관조(Stillness) — 소란한 평가를 내려놓고 있는 그대로의 진실을 조용히 직시하는 성찰기';
}

export const CHEKHOV_THEMES: ChekhovTheme[] = [
  {
    themeKey: 'quietEndurance',
    themeTitleEn: 'Quiet Endurance: Bearing the Burden of Daily Life with Patient Dignity',
    themeTitleKo: '묵묵한 인내의 힘 — "우리는 살아가야 합니다, 바냐 아저씨", 일상의 짐을 묵묵히 품기',
    existentialInsight: '안톤 체호프의 《바냐 아저씨》 마지막 장에서 소냐가 바냐에게 건네는 말처럼, 삶의 진정한 위대함은 화려한 영웅적 승리가 아니라 고단하고 막막한 날들을 묵묵히 견디며 살아내는 성실함에 있습니다.',
    practicalCounsel: '당장 모든 문제가 풀리지 않아도 낙담하지 마십시오. 오늘 당신의 손에 쥐어진 작은 일과 일상의 책임을 차분히 완수하십시오. 그 묵묵한 인내가 마침내 영혼의 깊은 안식을 가져다줍니다.',
  },
  {
    themeKey: 'unvarnishedTruth',
    themeTitleEn: 'Unvarnished Truth: Seeing Life As It Truly Is Without Illusions or False Pomp',
    themeTitleKo: '가식 없는 일상의 진실 — 헛된 환상과 과장된 수사를 걷어내고 정직하게 현실 마주하기',
    existentialInsight: '체호프는 의사이자 작가로서 인간 삶의 고통과 모순을 꾸밈없이 관찰했습니다. 환상에 취해 현실을 도피하지 않고, 있는 그대로의 진실을 겸허히 인정할 때 비로소 진정한 치유가 시작됩니다.',
    practicalCounsel: '체면이나 허세로 문제를 가리지 마십시오. 당신의 한계와 감정을 있는 그대로 솔직하게 인정하십시오. 정직하게 마주한 현실만이 단단한 삶을 지탱하는 진정한 반석이 됩니다.',
  },
  {
    themeKey: 'gentleCompassion',
    themeTitleEn: 'Gentle Compassion: Silently Standing by Hurting Souls with Warm Tenderness',
    themeTitleKo: '담담하고 깊은 자비 — 소란스럽지 않게 상처 입은 이들의 곁을 조용히 지켜주는 온기',
    existentialInsight: '체호프의 인물들은 결함투성이이지만 깊은 연민의 시선으로 감싸 안깁니다. 거창한 훈계 대신 서로의 나약함을 조용히 이해하고 따스한 차 한 잔을 건네는 배려가 가장 강력한 위로입니다.',
    practicalCounsel: '주변 사람의 실수를 성급하게 재단하지 마십시오. 묵묵히 경청하고 가만히 곁을 지켜주는 것만으로도 충분합니다. 조용한 배려와 작은 친절이 얼어붙은 마음을 녹여냅니다.',
  },
  {
    themeKey: 'cultivatingTheGarden',
    themeTitleEn: 'Planting One Tree Today: Quiet Diligence Over Vain and Empty Melodrama',
    themeTitleKo: '오늘 심는 한 그루의 나무 — 공허한 비관을 털어내고 내 몫의 일상을 성실히 가꾸기',
    existentialInsight: '《바냐 아저씨》의 아스트로프 의사처럼, 미래가 불투명할수록 내 손으로 숲을 가꾸고 나무를 심는 실천이 필요합니다. 공허한 한탄을 멈추고 흙을 만질 때 삶의 생명력이 되살아납니다.',
    practicalCounsel: '세상의 불합리와 미래에 대한 불안으로 하루를 낭비하지 마십시오. 오늘 당신이 돌볼 수 있는 일, 정리할 수 있는 서랍, 보살필 수 있는 한 사람에게 정성을 다하십시오.',
  },
];

export const CHEKHOV_APHORISMS: ChekhovAphorism[] = [
  {
    aphorismKey: 'weShallLiveVanya',
    aphorismKo: '우리는 살아가야 합니다, 바냐 아저씨. 길고 긴 낮과 고단한 밤들을 묵묵히 견디어 내며 끝까지 살아갑시다.',
    aphorismRussian: 'Мы будем жить, дядя Ваня. Мы проживем длинный, длинный ряд дней, долгих вечеров...',
    sourceContext: '안톤 체호프 《바냐 아저씨(Дядя Ваня)》',
    actionGuidance: '지치고 힘겨운 날에도 걸음을 멈추지 마십시오. 오늘 하루를 묵묵히 버텨낸 당신은 이미 가장 숭고한 승리자입니다.',
  },
  {
    aphorismKey: 'ordinaryLifeSignificance',
    aphorismKo: '사람들은 식사를 하고, 그저 식사를 하고 있을 뿐이지만, 바로 그 순간에 그들의 행복이 싹트기도 하고 부서지기도 한다.',
    aphorismRussian: 'Люди обедают, только обедают, а в это время слагается их счастье и разбиваются их жизни.',
    sourceContext: '안톤 체호프 《갈매기(Чайка)》 수첩',
    actionGuidance: '사소해 보이는 일상의 매 순간을 소중히 대하십시오. 진정한 행복과 파국은 거창한 사건이 아니라 소박한 일상의 태도에서 결정됩니다.',
  },
  {
    aphorismKey: 'brevityAndTruth',
    aphorismKo: '간결함은 재능의 자매이며, 진실은 화려한 치레를 필요로 하지 않는다.',
    aphorismRussian: 'Краткость — сестра таланта.',
    sourceContext: '안톤 체호프 《서한집(Письма)》',
    actionGuidance: '말과 계획을 장황하게 늘어놓지 마십시오. 핵심에 집중하고, 담백하고 진실한 태도로 오늘 할 일에 집중하십시오.',
  },
  {
    aphorismKey: 'plantATreeForFuture',
    aphorismKo: '인간이 자신이 심은 나무가 자라 그늘을 드리우는 것을 볼 때, 그는 대지의 거룩함을 느끼며 삶의 의미를 깨닫는다.',
    aphorismRussian: 'Когда я сажаю березку и потом вижу, как она зеленеет... я чувствую себя счастливым.',
    sourceContext: '안톤 체호프 《바냐 아저씨(Дядя Ваня)》 아스트로프의 대사',
    actionGuidance: '당장 대가가 돌아오지 않더라도 내일을 위한 선한 씨앗을 뿌리십시오. 묵묵히 쏟은 정성은 결코 사라지지 않고 숲이 됩니다.',
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

export function calculateRussianAntonChekhovQuietEnduranceCompassion(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): RussianAntonChekhovQuietEnduranceCompassionResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `ANTON-CHEKHOV-QUIET-ENDURANCE:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const unpretentiousTruthfulnessScore = 89 + ((absHash >> 1) % 10);
  const quietEnduranceDiligenceIndex = 88 + ((absHash >> 4) % 11);
  const subtleCompassionEmpathyIndex = 87 + ((absHash >> 7) % 12);
  const innerDecencyIntegrityScore = 89 + ((absHash >> 10) % 10);
  const gentleFortitudeHopeResilience = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % CHEKHOV_THEMES.length;
  const aphorismIndex = (absHash >> 8) % CHEKHOV_APHORISMS.length;

  const activeChekhovTheme = CHEKHOV_THEMES[themeIndex];
  const focalChekhovAphorism = CHEKHOV_APHORISMS[aphorismIndex];
  // 같은 저작의 명언만 반복하지 않도록 다른 원전에서 보조 테제를 하나 더 세운다(초점 테제와 항상 다름).
  const secondaryChekhovOffset = 1 + ((absHash >> 11) % (CHEKHOV_APHORISMS.length - 1));
  const secondaryChekhovAphorism =
    CHEKHOV_APHORISMS[(aphorismIndex + secondaryChekhovOffset) % CHEKHOV_APHORISMS.length];

  // 질문에 반응하는 정성 성찰 질문: 지금 붙잡은 테마의 언어로 되묻는다.
  const trimmedChekhovQuery = (query ?? '').trim();
  const reflectiveChekhovQuestion =
    `지금 내가 '${activeChekhovTheme.themeTitleKo}'의 자리에 선다면, ` +
    `소란스러운 평가와 자기 연민을 내려놓고 오늘 꾸준히 해낼 수 있는 조그마한 일 하나와 곁의 지친 이에게 건넬 말 한마디는 무엇일까요?` +
    (trimmedChekhovQuery ? ` (이 물음은 당신이 건넨 '${trimmedChekhovQuery}'에 대한 성찰입니다.)` : '');

  const interpretiveBoundary =
    '체호프 문학의 일상 진실 직시·묵묵한 인내 상징을 빌린 정성적 성찰 관점이며, 심리 진단이나 성격 평가, 사건의 성패·미래 단정이 아닙니다.';

  const guidanceTitle = `안톤 체호프 일상의 진실과 묵묵한 인내의 지혜: ${activeChekhovTheme.themeTitleKo}`;
  const philosophicalCounsel = `러시아 문학의 위대한 휴머니스트 안톤 체호프 선생은 《바냐 아저씨》와 《갈매기》를 통해 ` +
    `과장된 허세를 걷어내고 삶의 진실을 마주하는 정직성, "우리는 살아가야 합니다"로 집약되는 묵묵한 일상의 인내, ` +
    `그리고 상처받은 인간을 향한 담담하고 깊은 연민의 가치를 우리에게 가르쳐 주었습니다. ` +
    `오늘 당신의 지친 영혼에 가장 따스한 등불은 '${activeChekhovTheme.themeTitleKo}'입니다. ` +
    `${activeChekhovTheme.practicalCounsel} 체호프의 권면 "${focalChekhovAphorism.aphorismKo}" (${focalChekhovAphorism.aphorismRussian})를 기억하며, ` +
    `${focalChekhovAphorism.actionGuidance}`;

  const calculatedAtKst = formatChekhovKstTimestamp(now);
  const composite = Math.round(
    (unpretentiousTruthfulnessScore + quietEnduranceDiligenceIndex + subtleCompassionEmpathyIndex + innerDecencyIntegrityScore + gentleFortitudeHopeResilience) / 5
  );
  const chekhovSynthesisMatrix = {
    dominantTension: `${activeChekhovTheme.themeTitleKo} ↔ ${focalChekhovAphorism.sourceContext}`,
    alignmentState: describeChekhovStage(composite),
    integratedAction: `${focalChekhovAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: RUSSIAN_ANTON_CHEKHOV_QUIET_ENDURANCE_COMPASSION_VERSION,
    calculatedAtKst,
    unpretentiousTruthfulnessScore,
    quietEnduranceDiligenceIndex,
    subtleCompassionEmpathyIndex,
    innerDecencyIntegrityScore,
    gentleFortitudeHopeResilience,
    activeChekhovTheme,
    focalChekhovAphorism,
    chekhovComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    chekhovSynthesisMatrix,
    secondaryChekhovAphorism,
    ritualAction: `[${activeChekhovTheme.themeKey}] ${focalChekhovAphorism.actionGuidance}`,
    reflectionFocus: `안톤 체호프(${activeChekhovTheme.themeTitleKo}) — ${focalChekhovAphorism.sourceContext}`,
    reflectiveChekhovQuestion,
    reflectiveQuestion: reflectiveChekhovQuestion,
    interpretiveBoundary,
  };
}

export function formatRussianAntonChekhovQuietEnduranceCompassionPrompt(
  res: RussianAntonChekhovQuietEnduranceCompassionResult,
): string {
  const composite = Math.round(
    (res.unpretentiousTruthfulnessScore + res.quietEnduranceDiligenceIndex + res.subtleCompassionEmpathyIndex + res.innerDecencyIntegrityScore + res.gentleFortitudeHopeResilience) / 5
  );
  const lines = [
    `【안톤 체호프 《바냐 아저씨·갈매기》 일상의 진실·묵묵한 인내 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진 버전: ${res.engineVersion}`,
    `- 실존 성찰 국면: ${describeChekhovStage(composite)}`,
    `- 핵심 체호프 테마: ${res.activeChekhovTheme.themeTitleKo} [${res.activeChekhovTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeChekhovTheme.existentialInsight}`,
    `- 행동 조언: ${res.activeChekhovTheme.practicalCounsel}`,
    `- 체호프 원전 테제: "${res.focalChekhovAphorism.aphorismKo}" (${res.focalChekhovAphorism.aphorismRussian})`,
    `- 원전 출처: [${res.focalChekhovAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalChekhovAphorism.actionGuidance}`,
    `- 종합 체호프 권면: ${res.chekhovComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.chekhovSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.chekhovSynthesisMatrix.dominantTension} | 조율 상태: ${res.chekhovSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.chekhovSynthesisMatrix.integratedAction}`,
    );
  }
  if (res.secondaryChekhovAphorism) {
    lines.push(
      `- 보조 원전 테제: "${res.secondaryChekhovAphorism.aphorismKo}" (${res.secondaryChekhovAphorism.aphorismRussian})`,
      `- 보조 원전 출처: [${res.secondaryChekhovAphorism.sourceContext}]`,
      `- 보조 실천 지침: ${res.secondaryChekhovAphorism.actionGuidance}`,
    );
  }
  lines.push(
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveChekhovQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  );
  return lines.join('\n');
}
