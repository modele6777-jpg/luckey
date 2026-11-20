/**
 * 대한민국 포은 정몽주(圃隱 鄭夢周) 선생 《단심가(丹心歌)》 & 《포은집(圃隱集)》 일편단심(一片丹心) 불변의 지조 & 난세극복 경세외교·대의명분 지혜 엔진
 *
 * 고려 말 충신이자 동방이학지조(東方理學之祖) 포은 정몽주(1337~1392) 선생의 불후의 절명시 《단심가(丹心歌)》, 문집 《포은집(圃隱集)》 및 역사적 경세 행적 원전 기반:
 * 1. 일편단심 불변의 도의적 신의 및 지조 지수 (Dansimga Unyielding Moral Fidelity Score): 백 번을 고쳐 죽어도 변치 않는 굳은 의리와 도의적 지조.
 * 2. 난세 앞 살신성인 대의명분 결단력 (Noble Purpose & Righteous Resolution Index): 사리사욕을 버리고 사직과 백성을 위해 목숨을 바쳐 대의를 지키는 결기.
 * 3. 감복시키는 외교적 담판 지략 및 평화 경세력 (Diplomatic Statesmanship & Negotiation Wit Score): 적진 앞에서도 기품과 당당한 논리로 적을 감복시키고 포로를 구출한 탁월한 외교력.
 * 4. 동방이학지조 도학 정통성 및 솔선수범 지표 (Foundational Scholarship & Moral Governance Index): 주자가례와 도학의 기틀을 확립하고 학문과 실천을 일치시킨 선비 정신.
 * 5. 시련 앞 불굴의 선비 기개 및 의연한 회복탄력성 (Undaunted Scholar Integrity & Resilience Score): 망국의 풍파와 생사의 갈림길에서도 한 점 흐트러짐 없는 의연한 품격과 평정심.
 *
 * @version LUCKEY-POEUN-JEONG-MONG-JU-DANSIMGA-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_POEUN_JEONG_MONG_JU_DANSIMGA_VERSION = 'LUCKEY-POEUN-JEONG-MONG-JU-DANSIMGA-v2.3.0';

export interface PoeunTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface PoeunAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanPoeunJeongMongJuDansimgaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 포은 정몽주 단심가 핵심 지표 (0~100)
  dansimgaMoralFidelityScore: number;             // 일편단심 불변의 도의적 신의 및 지조 (Dansimga Moral Fidelity)
  righteousNobleResolutionIndex: number;          // 난세 앞 살신성인 대의명분 결단력 (Righteous Noble Resolution)
  diplomaticStatesmanshipScore: number;          // 감복시키는 외교적 담판 지략 (Diplomatic Statesmanship)
  foundationalScholarshipGovernanceIndex: number; // 동방이학지조 도학 정통성 (Foundational Scholarship & Governance)
  undauntedIntegrityResilienceScore: number;      // 불굴의 선비 기개 및 회복탄력성 (Undaunted Integrity Resilience)
  // 세부 분석
  activePoeunTheme: PoeunTheme;
  secondaryPoeunTheme: PoeunTheme;
  focalPoeunAphorism: PoeunAphorism;
  secondaryPoeunAphorism: PoeunAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  poeunComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  poeunSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatPoeunKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describePoeunStage(score: number): string {
  if (score >= 94) return '일편단심(一片丹心) — 어떠한 풍파에도 변치 않는 신의와 외교적 기품이 만개한 경지';
  if (score >= 90) return '백설매화(白雪梅花) — 난세의 바람 속에서도 대의명분과 도학적 중심을 지키는 정돈기';
  return '지성격물(至誠格物) — 정성과 올곧은 도리로 신뢰의 기틀을 차분히 다지는 시기';
}

export const POEUN_THEMES: PoeunTheme[] = [
  {
    themeKey: 'dansimgaFidelity',
    themeTitleEn: 'Dansimga Unyielding Fidelity: The Red Heart That Never Fades',
    themeTitleKo: '일편단심(一片丹心) — 풍파와 유혹 앞에서도 변치 않는 굳은 신의 지키기',
    pragmaticInsight: '백골이 진토가 되어도 님을 향한 붉은 마음은 가실 줄 모른다는 단심가의 절창처럼, 인간의 가장 위대한 존엄은 눈앞의 유불리에 흔들리지 않고 처음 품은 순수한 신의를 지키는 데 있습니다.',
    practicalCounsel: '상황이 불리해졌다고 해서 쉽게 약속을 뒤집거나 변명하지 마십시오. 당신이 소중히 여긴 가치와 사람들에 대한 신의를 끝까지 지키십시오. 그 변함없는 성실함이 당신의 가장 위대한 유산이 될 것입니다.',
  },
  {
    themeKey: 'diplomaticCourage',
    themeTitleEn: 'Lion-Hearted Diplomacy: Moving Enemies with Unshakable Dignity and Reason',
    themeTitleKo: '경세외교의 지략 — 적진 앞에서도 기품과 당당한 논리로 평화를 이끌어내기',
    pragmaticInsight: '포은 선생은 왜구의 칼날 앞에서도 당당한 의기와 명분으로 일본 규슈 총관을 감복시켜 수백 명의 피랍 백성을 구해냈습니다. 폭력과 겁박을 이기는 가장 강한 힘은 의연한 품격과 논리적 진정성에 있습니다.',
    practicalCounsel: '강압적인 상대나 험난한 협상 앞에서도 위축되지 마십시오. 정당한 명분과 차분하고 명료한 논리로 상대의 양심을 일깨우고, 당당한 태도로 국면의 주도권을 잡으십시오.',
  },
  {
    themeKey: 'foundationalScholarship',
    themeTitleEn: 'Foundational Virtue: Aligning Inner Principle with Sincere Action',
    themeTitleKo: '동방이학지조(東方理學之祖) — 배운 바를 삶에서 솔선수범으로 실천하기',
    pragmaticInsight: '포은 선생은 주자학을 관념적 유희로 남겨두지 않고, 향약을 세우고 효행을 실천하며 무너진 풍속을 바로 세웠습니다. 참된 지식은 머리에 머물지 않고 일상의 바른 태도로 드러나야 합니다.',
    practicalCounsel: '말과 지식을 과시하려 하지 마십시오. 당신이 옳다고 믿는 원칙을 일상의 작은 행동 하나에서부터 직접 실천하십시오. 스스로 모범을 보일 때 주위 사람들이 진심으로 따르게 됩니다.',
  },
  {
    themeKey: 'courageInCrisis',
    themeTitleEn: 'Magnanimous Statesmanship: Bearing the Weight of the Nation in Dark Times',
    themeTitleKo: '난세극복의 사명감 — 위기 앞에서도 물러서지 않고 공동체의 책임을 짊어지기',
    pragmaticInsight: '혼란한 격변기 속에서도 포은 선생은 오직 나라와 백성의 안위를 위해 군량을 조달하고 전선을 지키며 사직을 지탱했습니다. 진정한 리더는 위기 앞에서도 책임을 회피하지 않고 온몸으로 감당합니다.',
    practicalCounsel: '문제가 터졌을 때 남 탓을 하거나 도망치지 마십시오. 당신의 자리에서 할 수 있는 최선의 방책을 찾아 묵묵히 행동하십시오. 당신의 책임감 있는 결단이 혼란을 잠재우는 든든한 버팀목이 됩니다.',
  },
  {
    themeKey: 'undauntedIntegrity',
    themeTitleEn: 'Noble Martyrdom of Integrity: Shining Like Frost and Snow Across Centuries',
    themeTitleKo: '의연한 기개와 기품 — 생사의 갈림길에서도 흐트러지지 않는 선비의 품격',
    pragmaticInsight: '선죽교의 비극 앞에서도 선생은 결코 비굴함을 보이지 않았으며, 그 고결한 지조는 수백 년의 세월을 넘어 불멸의 귀감이 되었습니다. 육체는 스러져도 고결한 영혼의 향기는 영원히 남습니다.',
    practicalCounsel: '세상의 평가나 일시적인 승패에 일희일비하지 마십시오. 스스로의 양심에 비추어 부끄러움이 없다면 가슴을 펴고 당당하십시오. 시련이 깊을수록 당신의 고결한 인품은 서릿발 속 매화처럼 향기를 뿜어낼 것입니다.',
  },
];

export const POEUN_APHORISMS: PoeunAphorism[] = [
  {
    aphorismKey: 'dansimgaMain',
    aphorismKo: '이 몸이 죽고 죽어 일백 번 고쳐 죽어, 백골이 진토 되어 넋이라도 있고 없고, 임 향한 일편단심이야 가실 줄이 있으랴.',
    aphorismHanja: '此身死了死了一百番更死, 白骨爲塵土魂魄有無也, 鄕主一片丹心寧有改理歟.',
    sourceContext: '정몽주 《단심가(丹心歌)》',
    actionGuidance: '마음의 첫 결심과 신의를 굳게 지키십시오. 어떤 난관이 닥쳐도 당신의 정직한 본령을 지켜내십시오.',
  },
  {
    aphorismKey: 'dutyAndSincerity',
    aphorismKo: '의로움은 사사로운 이익으로 바꿀 수 없고, 지조는 어떠한 위세로도 빼앗을 수 없다.',
    aphorismHanja: '義不可以利移, 志不可以威奪.',
    sourceContext: '정몽주 《포은집(圃隱集)》',
    actionGuidance: '눈앞의 이익 때문에 정도를 벗어나지 마십시오. 바르고 떳떳한 길을 걸을 때 진정한 힘이 나옵니다.',
  },
  {
    aphorismKey: 'peaceThroughIntegrity',
    aphorismKo: '지극한 정성과 올곧은 도로써 대하면, 거친 오랑캐라도 마음으로 탄복하게 된다.',
    aphorismHanja: '至誠格物, 雖蠻貊之邦, 莫不肅服.',
    sourceContext: '정몽주 《포은집·일본 사행 행록》',
    actionGuidance: '상대를 대할 때 속임수 대신 지극한 정성과 품격을 보이십시오. 진정성이 가장 큰 감동을 빚어냅니다.',
  },
  {
    aphorismKey: 'scholarResponsibility',
    aphorismKo: '선비의 도는 오직 나라와 백성을 편안하게 하고, 도의를 세상에 밝히는 데 있다.',
    aphorismHanja: '士之所務, 在於安邦利民, 明明德於天下.',
    sourceContext: '정몽주 《포은집(圃隱集)》',
    actionGuidance: '나 혼자만의 안락에 갇히지 마십시오. 주변 사람들과 공동체에 유익을 더하는 따뜻한 기여를 고민하십시오.',
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

export function calculateKoreanPoeunJeongMongJuDansimga(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanPoeunJeongMongJuDansimgaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `POEUN-JEONG-MONG-JU-DANSIMGA:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const dansimgaMoralFidelityScore = 87 + ((absHash >> 1) % 12);
  const righteousNobleResolutionIndex = 86 + ((absHash >> 4) % 13);
  const diplomaticStatesmanshipScore = 85 + ((absHash >> 7) % 14);
  const foundationalScholarshipGovernanceIndex = 84 + ((absHash >> 10) % 15);
  const undauntedIntegrityResilienceScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % POEUN_THEMES.length;
  const secondaryThemeIndex = (themeIndex + 1 + ((absHash >> 9) % (POEUN_THEMES.length - 1))) % POEUN_THEMES.length;
  const aphorismIndex = (absHash >> 8) % POEUN_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (POEUN_APHORISMS.length - 1))) % POEUN_APHORISMS.length;

  const activePoeunTheme = POEUN_THEMES[themeIndex];
  const secondaryPoeunTheme = POEUN_THEMES[secondaryThemeIndex];
  const focalPoeunAphorism = POEUN_APHORISMS[aphorismIndex];
  const secondaryPoeunAphorism = POEUN_APHORISMS[secondaryAphorismIndex];

  const cleanQuery = query?.trim();
  const reflectiveQuestion = cleanQuery
    ? `"${cleanQuery}" 앞에서, 눈앞의 유불리를 넘어 끝까지 지켜야 할 나만의 일편단심은 무엇인가?`
    : `지금 내가 마주한 선택 앞에서, 유혹이나 압박에도 흔들리지 않고 끝까지 지켜야 할 신의는 무엇인가?`;
  const interpretiveBoundary =
    '이 포은 정몽주 《단심가》 해석은 신의·대의·외교적 기품·선비 기개의 상징적 성찰 프레임이며, 현실의 법적·실무적 판단이나 단정적 미래 예언을 대신하지 않습니다.';

  const guidanceTitle = `포은 정몽주 단심가 일편단심 지조 및 경세외교 지혜: ${activePoeunTheme.themeTitleKo}`;
  const philosophicalCounsel = `동방이학지조이자 불굴의 충절을 상징하는 포은 정몽주 선생은 《단심가》를 통해 ` +
    `어떠한 풍파 앞에서도 흔들리지 않는 일편단심의 도의적 신의와, 적진마저 감복시키는 당당한 기품의 경세외교를 증명했습니다. ` +
    `현재 당신의 도전을 바르게 이끄는 핵심 지침은 '${activePoeunTheme.themeTitleKo}'입니다. ` +
    `${activePoeunTheme.practicalCounsel} 포은 선생의 불후의 명구 "${focalPoeunAphorism.aphorismKo}" (${focalPoeunAphorism.aphorismHanja})을 가슴 깊이 새기며, ` +
    `${focalPoeunAphorism.actionGuidance}`;

  const calculatedAtKst = formatPoeunKstTimestamp(now);
  const avgScore = Math.round(
    (dansimgaMoralFidelityScore +
      righteousNobleResolutionIndex +
      diplomaticStatesmanshipScore +
      foundationalScholarshipGovernanceIndex +
      undauntedIntegrityResilienceScore) /
      5,
  );
  const poeunSynthesisMatrix = {
    dominantTension: `${activePoeunTheme.themeTitleKo} ↔ ${focalPoeunAphorism.sourceContext}`,
    alignmentState: describePoeunStage(avgScore),
    integratedAction: `${focalPoeunAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${activePoeunTheme.themeTitleKo.split(' — ')[0]}] ${focalPoeunAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: KOREAN_POEUN_JEONG_MONG_JU_DANSIMGA_VERSION,
    calculatedAtKst,
    dansimgaMoralFidelityScore,
    righteousNobleResolutionIndex,
    diplomaticStatesmanshipScore,
    foundationalScholarshipGovernanceIndex,
    undauntedIntegrityResilienceScore,
    activePoeunTheme,
    secondaryPoeunTheme,
    focalPoeunAphorism,
    secondaryPoeunAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    poeunComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    poeunSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatKoreanPoeunJeongMongJuDansimgaPrompt(
  res: KoreanPoeunJeongMongJuDansimgaResult,
): string {
  const avgScore = Math.round(
    (res.dansimgaMoralFidelityScore +
      res.righteousNobleResolutionIndex +
      res.diplomaticStatesmanshipScore +
      res.foundationalScholarshipGovernanceIndex +
      res.undauntedIntegrityResilienceScore) /
      5,
  );
  const lines = [
    `【포은 정몽주 《단심가·포은집》 일편단심 지조 및 경세외교 지략 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 충절·경세 국면: ${describePoeunStage(avgScore)}`,
    `- 핵심 포은 테마: ${res.activePoeunTheme.themeTitleKo} [${res.activePoeunTheme.themeTitleEn}]`,
    `- 보조 교차 테마: ${res.secondaryPoeunTheme.themeTitleKo} [${res.secondaryPoeunTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activePoeunTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activePoeunTheme.practicalCounsel}`,
    `- 포은 원전 명구: "${res.focalPoeunAphorism.aphorismKo}" (${res.focalPoeunAphorism.aphorismHanja})`,
    `- 보조 교차 명구: "${res.secondaryPoeunAphorism.aphorismKo}" (${res.secondaryPoeunAphorism.aphorismHanja})`,
    `- 원전 출처: [${res.focalPoeunAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalPoeunAphorism.actionGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 포은 권면: ${res.poeunComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.poeunSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.poeunSynthesisMatrix.dominantTension} | 조율 상태: ${res.poeunSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.poeunSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
