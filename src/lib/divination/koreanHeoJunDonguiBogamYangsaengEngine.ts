/**
 * 대한민국 구암 허준(龜巖 許浚) 선생 《동의보감(東醫寶鑑)》 신형장부도·천인상응 & 통즉불통·치미병(治未病) 양생 지혜 엔진
 *
 * 조선 중기 의성(醫聖)이자 유네스코 세계기록유산 등재 명저 《동의보감(東醫寶鑑)》의 저자
 * 구암 허준(龜巖 許浚, 1539~1615) 선생의 불후의 저술 원전 기반:
 * 1. 통즉불통(通則不痛) 기혈 소통 및 조화 순환도 (Unblocked Flow & Harmonious Circulation Index): 기혈과 정서, 인간관계가 막힘없이 원활히 통하면 병과 고통이 사라진다는 소통의 제1법칙.
 * 2. 신형장부도(身形臟腑圖) 천인상응 전인적 균형도 (Body-Cosmos Holistic Balance Score): 인간의 몸과 마음이 자연의 대우주와 유기적으로 상응한다는 생태적·전인적 합일 지혜.
 * 3. 치미병(治未病) 선제적 양생 및 근원 치유력 (Preventive Wellness & Self-Care Index): 병이 겉으로 드러나기 전에 마음과 생활 습관의 균형을 잡아 근원을 다스리는 선제적 지혜.
 * 4. 정기신(精氣神) 삼보 보존 및 내면 활력 지수 (Essence-Qi-Spirit Vitality Preservation Score): 정(精), 기(氣), 신(神)을 아끼고 욕망을 절제하여 본래 생명 에너지를 튼튼히 보존하는 힘.
 * 5. 혜민(惠民) 이타적 온기와 심신 평정 회복탄력성 (Beneficent Healing & Equanimity Resilience Score): 우리 땅의 향약으로 만백성을 구제하고자 한 따뜻한 애민과 치유의 회복탄력성.
 *
 * @version LUCKEY-HEO-JUN-DONGUI-BOGAM-YANGSAENG-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_HEO_JUN_DONGUI_BOGAM_YANGSAENG_VERSION = 'LUCKEY-HEO-JUN-DONGUI-BOGAM-YANGSAENG-v2.3.0';

export interface HeoJunTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface HeoJunAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanHeoJunDonguiBogamYangsaengResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 허준 동의보감 양생 핵심 지표 (0~100)
  tongJeukBulTongCirculationIndex: number;            // 통즉불통 소통 순환도 (Unblocked Flow)
  bodyCosmosCorrespondenceHarmonyScore: number;     // 신형장부도 천인상응 균형도 (Holistic Balance)
  preventiveChiMiByeongYangsaengIndex: number;        // 치미병 선제적 양생력 (Preventive Care)
  essenceQiSpiritPreservationScore: number;           // 정기신 삼보 보존 활력 (Essence-Qi-Spirit)
  beneficentCompassionHealingResilienceScore: number; // 혜민 치유 회복탄력성 (Beneficent Resilience)
  // 세부 분석
  activeHeoJunTheme: HeoJunTheme;
  focalHeoJunAphorism: HeoJunAphorism;
  secondaryHeoJunAphorism: HeoJunAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  heoJunComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  heoJunSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatHeoJunKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeHeoJunStage(score: number): string {
  if (score >= 90) return '통즉불통(通則不痛) — 기혈과 마음의 순환이 막힘없이 조화를 이루는 양생의 경지';
  if (score >= 85) return '천인상응(天人相應) — 자연의 리듬과 내면의 균형이 안정적으로 어우러지는 국면';
  return '치미병(治未病) — 작은 피로와 불균형을 미리 살펴 근원을 다스리는 선제적 정돈기';
}

export const HEO_JUN_THEMES: HeoJunTheme[] = [
  {
    themeKey: 'tongJeukBulTong',
    themeTitleEn: 'Tong-Jeuk-Bul-Tong: Smooth Flow Eliminates All Suffering',
    themeTitleKo: '통즉불통(通則不痛) — 막힘없이 소통하고 순환할 때 온갖 고통과 문제가 사라진다',
    pragmaticInsight: '기혈이 잘 돌면 아프지 않고 막히면 통증이 생기듯(通則不痛 不通則痛), 모든 번민과 업무적 정체는 소통의 단절과 울체(鬱滯)에서 시작됩니다. 기운을 뚫어주는 것이 치유의 핵심입니다.',
    practicalCounsel: '혼자서 끙끙 앓거나 문제를 가슴속에 묻어두지 마십시오. 투명하고 진솔하게 대화하고, 정체된 프로세스를 과감히 열어 막힌 흐름을 시원하게 소통시키십시오.',
  },
  {
    themeKey: 'cheonInSangEung',
    themeTitleEn: 'Cheon-In-Sang-Eung: Cosmic Resonance & Holistic Integrity',
    themeTitleKo: '신형장부도와 천인상응 — 몸과 마음과 자연이 하나로 울리는 전인적 조화',
    pragmaticInsight: '하늘에 사계절이 있듯 사람에게 사지가 있고, 우주에 해와 달이 있듯 사람에게 두 눈이 있습니다. 자연의 순리와 내면의 리듬을 거스르지 않고 조화를 이룰 때 최고의 건강과 번영이 깃듭니다.',
    practicalCounsel: '무리하게 환경과 싸우려 하지 마십시오. 밤낮의 리듬, 계절의 변화, 주변의 거대한 흐름에 순응하며 몸과 마음의 조화로운 밸런스를 먼저 회복하십시오.',
  },
  {
    themeKey: 'chiMiByeong',
    themeTitleEn: 'Chi-Mi-Byeong: Healing Before Manifestation (Preventive Care)',
    themeTitleKo: '치미병(治未病) — 병이 나기 전에 미리 근원을 다스리는 선제적 지혜',
    pragmaticInsight: '가장 뛰어난 명의는 병이 깊어진 뒤에 칼을 대는 자가 아니라, 아직 징조가 미미할 때 마음과 생활의 균형을 바로잡아 병 자체가 생기지 않도록 예방하는 의사입니다.',
    practicalCounsel: '작은 피로와 사소한 엇박자를 가볍게 넘기지 마십시오. 위기가 표면화되기 전에 미리 생활 습관을 정돈하고 시스템의 결함을 선제적으로 점검하십시오.',
  },
  {
    themeKey: 'jeongGiShinThreeTreasures',
    themeTitleEn: 'Preserving the Three Treasures: Essence (精), Qi (氣), and Spirit (神)',
    themeTitleKo: '정·기·신 삼보(三寶)의 보존 — 욕망의 낭비를 줄이고 내면의 본래 에너지를 축적하기',
    pragmaticInsight: '사람의 생명은 정(精)을 그릇으로 삼고, 기(氣)로써 움직이며, 신(神)으로써 주재합니다. 헛된 욕망과 분노로 정기를 고갈시키지 않고 내실을 다질 때 흔들리지 않는 중심이 섭니다.',
    practicalCounsel: '에너지를 사방으로 무분별하게 낭비하지 마십시오. 불필요한 감정 소모를 줄이고, 깊은 호흡과 절제된 생활로 영혼의 본래 활력을 차분히 충전하십시오.',
  },
  {
    themeKey: 'hyeMinCompassion',
    themeTitleEn: 'Hye-Min Compassion: Local Herbs & Practical Altruism',
    themeTitleKo: '혜민(惠民)의 따뜻한 의술 — 주변의 소박한 자원으로 사람을 살리는 실천적 사랑',
    pragmaticInsight: '구암 선생은 값비싼 수입 약재 대신 산과 들에 널린 향약(鄕藥)으로 백성을 살렸습니다. 참된 치유와 혁신은 멀리 있는 이상이 아니라 발밑의 소박한 정성과 나눔에 있습니다.',
    practicalCounsel: '먼 곳에서 거창한 답을 찾으려 헤매지 마십시오. 지금 손닿는 곳에 있는 소중한 사람들과 자원을 따뜻하게 보살피며 헌신할 때 놀라운 치유와 결실이 일어납니다.',
  },
];

export const HEO_JUN_APHORISMS: HeoJunAphorism[] = [
  {
    aphorismKey: 'tongJeukBulTongAphorism',
    aphorismKo: '통하면 아프지 않고, 통하지 못하면 아프다.',
    aphorismHanja: '通則不痛 不通則痛',
    sourceContext: '허준 《동의보감(東醫寶鑑)》 잡병편',
    actionGuidance: '막힌 기운과 관계를 속 시원히 소통시키십시오. 흐름이 원활해지면 모든 막힘과 고통이 저절로 풀립니다.',
  },
  {
    aphorismKey: 'mindHealsFirstAphorism',
    aphorismKo: '옛 명의는 사람의 마음을 먼저 치료하여 병이 생기지 않게 하였다.',
    aphorismHanja: '古之善醫者 先治其心 故病未生而先治',
    sourceContext: '허준 《동의보감(東醫寶鑑)》 내경편 신형(身形)',
    actionGuidance: '외적인 기교나 약물에만 기대지 말고, 마음의 평정과 탐욕 없는 맑은 양심을 먼저 회복하십시오.',
  },
  {
    aphorismKey: 'essenceQiSpiritAphorism',
    aphorismKo: '정이 차오르면 기가 온전하고, 기가 온전하면 신이 왕성해진다.',
    aphorismHanja: '精充則氣全 氣全則神旺',
    sourceContext: '허준 《동의보감(東醫寶鑑)》 내경편 정(精)',
    actionGuidance: '기본적인 수면과 식사, 심신의 휴식을 철저히 챙기십시오. 바탕 에너지가 충만할 때 번뜩이는 지혜가 솟아납니다.',
  },
  {
    aphorismKey: 'natureManUnityAphorism',
    aphorismKo: '하늘과 땅과 사람은 그 이치가 하나이니, 자연의 큰 순리에 순응하는 자가 무병장수한다.',
    aphorismHanja: '天地人一理 順乎自然者 終身不殆',
    sourceContext: '허준 《동의보감(東醫寶鑑)》 내경편 신형장부도설',
    actionGuidance: '무리한 과욕을 부리지 말고, 자연의 순리와 때(時)의 흐름에 겸허히 순응하며 유연하게 행동하십시오.',
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

export function calculateKoreanHeoJunDonguiBogamYangsaeng(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanHeoJunDonguiBogamYangsaengResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `HEO-JUN-DONGUI-BOGAM:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const tongJeukBulTongCirculationIndex = 85 + ((absHash >> 1) % 14);
  const bodyCosmosCorrespondenceHarmonyScore = 83 + ((absHash >> 4) % 16);
  const preventiveChiMiByeongYangsaengIndex = 84 + ((absHash >> 7) % 15);
  const essenceQiSpiritPreservationScore = 82 + ((absHash >> 10) % 17);
  const beneficentCompassionHealingResilienceScore = 86 + ((absHash >> 13) % 13);

  const themeIndex = (absHash >> 5) % HEO_JUN_THEMES.length;
  const aphorismIndex = (absHash >> 8) % HEO_JUN_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (HEO_JUN_APHORISMS.length - 1))) % HEO_JUN_APHORISMS.length;

  const activeHeoJunTheme = HEO_JUN_THEMES[themeIndex];
  const focalHeoJunAphorism = HEO_JUN_APHORISMS[aphorismIndex];
  const secondaryHeoJunAphorism = HEO_JUN_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'를 밀어붙이기 전에 지금 내 몸과 마음의 정기신(精氣神) 흐름 중 막혀 있거나 먼저 숨을 고를 곳은 어디인가요?`
    : `병이나 소진이 겉으로 드러나기 전에 오늘 미리 돌보고 비워 둘 생활 리듬 한 가지는 무엇인가요?`;
  const interpretiveBoundary = '구암 허준 동의보감 양생 관점은 의학적 진단이나 길흉 예단이 아니라, 순환·절제·치미병의 자기 돌봄을 비추는 성찰 렌즈입니다.';

  const guidanceTitle = `구암 허준 동의보감 양생 지혜: ${activeHeoJunTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선의 의성 구암 허준 선생은 '통즉불통(通則不痛)'의 소통과 순환, '천인상응(天人相應)'의 전인적 조화, 그리고 병이 생기기 전에 근원을 다스리는 '치미병(治未病)'의 불후의 양생 지혜를 《동의보감》에 집대성했습니다. ` +
    `현재 당신의 흐름에서 가장 깊은 생명력을 북돋우는 핵심 원리는 '${activeHeoJunTheme.themeTitleKo}'입니다. ` +
    `${activeHeoJunTheme.practicalCounsel} 허준 선생의 명문 "${focalHeoJunAphorism.aphorismKo} (${focalHeoJunAphorism.aphorismHanja})"을 가슴에 품고, ` +
    `${focalHeoJunAphorism.actionGuidance}`;

  const calculatedAtKst = formatHeoJunKstTimestamp(now);
  const avgScore = Math.round(
    (tongJeukBulTongCirculationIndex +
      bodyCosmosCorrespondenceHarmonyScore +
      preventiveChiMiByeongYangsaengIndex +
      essenceQiSpiritPreservationScore +
      beneficentCompassionHealingResilienceScore) /
      5,
  );
  const heoJunSynthesisMatrix = {
    dominantTension: `${activeHeoJunTheme.themeTitleKo} ↔ ${focalHeoJunAphorism.sourceContext}`,
    alignmentState: describeHeoJunStage(avgScore),
    integratedAction: `${focalHeoJunAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${activeHeoJunTheme.themeTitleKo}] ${focalHeoJunAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: KOREAN_HEO_JUN_DONGUI_BOGAM_YANGSAENG_VERSION,
    calculatedAtKst,
    tongJeukBulTongCirculationIndex,
    bodyCosmosCorrespondenceHarmonyScore,
    preventiveChiMiByeongYangsaengIndex,
    essenceQiSpiritPreservationScore,
    beneficentCompassionHealingResilienceScore,
    activeHeoJunTheme,
    focalHeoJunAphorism,
    secondaryHeoJunAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    heoJunComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    heoJunSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatKoreanHeoJunDonguiBogamYangsaengPrompt(
  res: KoreanHeoJunDonguiBogamYangsaengResult,
): string {
  const avgScore = Math.round(
    (res.tongJeukBulTongCirculationIndex +
      res.bodyCosmosCorrespondenceHarmonyScore +
      res.preventiveChiMiByeongYangsaengIndex +
      res.essenceQiSpiritPreservationScore +
      res.beneficentCompassionHealingResilienceScore) /
      5,
  );
  const lines = [
    `【구암 허준 《동의보감》 신형장부도·통즉불통 및 치미병 양생 지혜 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 양생 순환 국면: ${describeHeoJunStage(avgScore)}`,
    `- 핵심 허준 동의보감 테마: ${res.activeHeoJunTheme.themeTitleKo} [${res.activeHeoJunTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeHeoJunTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeHeoJunTheme.practicalCounsel}`,
    `- 허준 동의보감 원전 명언: "${res.focalHeoJunAphorism.aphorismKo}" (${res.focalHeoJunAphorism.aphorismHanja})`,
    `- 보조 교차 명언: "${res.secondaryHeoJunAphorism.aphorismKo}" [${res.secondaryHeoJunAphorism.sourceContext}]`,
    `- 원전 출처: [${res.focalHeoJunAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHeoJunAphorism.actionGuidance}`,
    `- 종합 허준 양생 권면: ${res.heoJunComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.heoJunSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.heoJunSynthesisMatrix.dominantTension} | 조율 상태: ${res.heoJunSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.heoJunSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
