/**
 * 독일 발터 벤야민(Walter Benjamin) 《역사의 개념에 대하여》 & 《기술복제시대의 예술작품》 아우라(Aura)·역사의 천사(Angelus Novus)·메시아적 지금-시간(Jetztzeit)·파편과 구원의 지혜 엔진
 *
 * 20세기 비판 이론과 미학의 독보적 사상가 발터 벤야민(1892~1940)의 원전 기반:
 * 1. 아우라 고유성 및 진정성 공명 지표 (Aura & Unique Authenticity Score): 복제와 피상적 반복에 휘둘리지 않고 대상과 자신의 '지금-여기' 고유한 일회적 현존성을 회복하는 능력.
 * 2. 역사의 천사(Angelus Novus) 및 폐허 직시력 (Angel of History Ruin Perception Index): 안일한 낙관론이나 직선적 진보의 허상에 속지 않고, 축적된 상처와 현실의 파편을 정직하게 응시하며 성찰하는 혜안.
 * 3. 메시아적 지금-시간(Jetztzeit) 및 결정적 도약력 (Messianic Now-Time Leap Score): 무의미하게 흘러가는 균질하고 공허한 시간의 연속성을 단절하고, 현재의 찰나에서 질적 도약과 변화의 문을 여는 실천적 결단력.
 * 4. 산책자(Flâneur)의 변증법적 직관 및 수집가 안목 (Flâneur Intuition & Collector Gaze Index): 일상의 사소하고 잊힌 파편, 거리의 풍경 속에서 시대의 본질과 숨겨진 보물을 번뜩이는 직관으로 길어 올리는 관찰력.
 * 5. 파편의 알레고리 및 구원의 희망 점화력 (Allegorical Fragment Redemption Score): 부서지고 미완성된 한계 상황 속에서도 절망에 함몰되지 않고, 작은 틈새에서 구원의 불꽃을 재구성하는 회복탄력성.
 *
 * @version LUCKEY-WALTER-BENJAMIN-AURA-NOWTIME-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_WALTER_BENJAMIN_AURA_NOWTIME_VERSION = 'LUCKEY-WALTER-BENJAMIN-AURA-NOWTIME-v2.1.0';

export interface BenjaminTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface BenjaminAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanWalterBenjaminAuraNowTimeResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 발터 벤야민 핵심 지표 (0~100)
  auraAuthenticityResonanceScore: number;     // 아우라 고유성 및 진정성 공명 지표 (Aura Authenticity Resonance)
  angelusNovusHistoricalInsightIndex: number; // 역사의 천사 및 폐허 직시력 (Angelus Novus Ruin Insight Index)
  jetztzeitMessianicMomentumScore: number;    // 메시아적 지금-시간 및 결정적 도약력 (Messianic Jetztzeit Leap Score)
  flaneurDialecticalIlluminationIndex: number;// 산책자의 변증법적 직관 및 수집가 안목 (Flâneur Intuition & Collector Gaze)
  allegoricalRedemptionScore: number;         // 파편의 알레고리 및 구원 희망 점화력 (Allegorical Fragment Redemption)
  // 세부 분석
  activeBenjaminTheme: BenjaminTheme;
  focalBenjaminAphorism: BenjaminAphorism;
  secondaryBenjaminAphorism: BenjaminAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  benjaminComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  benjaminSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const BENJAMIN_THEMES: BenjaminTheme[] = [
  {
    themeKey: 'auraAuthenticity',
    themeTitleEn: 'Aura Restoration: Reviving the Unrepeatable Here-and-Now Presence',
    themeTitleKo: '아우라의 회복 — 기계적 복제와 유행을 넘어 일회적이고 고유한 진정성 되살리기',
    pragmaticInsight: '세상은 끊임없이 찍어내는 복제품과 시늉으로 넘쳐납니다. 벤야민의 아우라(Aura)는 그 누구도 흉내 낼 수 없는 ‘지금, 여기(Hier und Jetzt)’만의 독특한 거리감과 일회적 숨결을 의미합니다.',
    practicalCounsel: '남들이 하는 유행이나 뻔한 공식을 맹목적으로 답습하지 마십시오. 오직 당신만이 가진 고유한 시간의 결, 그 진정성 있는 현존성에 집중할 때 대체 불가능한 아우라가 피어납니다.',
  },
  {
    themeKey: 'angelusNovusPerception',
    themeTitleEn: 'Angelus Novus: Gazing Steadfastly at Ruin Beyond Illusions of Progress',
    themeTitleKo: '역사의 천사의 응시 — 안일한 진보의 환상을 걷어내고 상처와 폐허를 정직하게 마주하기',
    pragmaticInsight: '파울 클레의 그림 《앙겔루스 노부스》처럼, 역사의 천사는 미래로 날아가면서도 시선을 과거의 잔해에 고정합니다. 상처와 실패의 폐허를 덮어두지 않고 정직하게 응시할 때 참된 치유와 성숙이 가능합니다.',
    practicalCounsel: '잘 풀릴 것이라는 막연한 낙관주의에 기대어 과거의 실책이나 상처를 외면하지 마십시오. 폐허를 직시하고 그 속에 쌓인 실패의 원인을 냉철하게 분석할 때 재앙의 폭풍을 뚫고 나갈 지혜가 생깁니다.',
  },
  {
    themeKey: 'jetztzeitDecisiveLeap',
    themeTitleEn: 'Jetztzeit: Blasting the Continuum of Empty Time with Decisive Action',
    themeTitleKo: '지금-시간(Jetztzeit)의 폭파 — 무기력한 타성의 연속성을 끊고 바로 지금 결단하기',
    pragmaticInsight: '시간은 그저 무기력하게 흘러가는 빈 그릇이 아닙니다. 벤야민의 지금-시간(Jetztzeit)은 과거의 열망과 미래의 가능성이 번개처럼 마주치는 순간으로, 역사의 연속체를 폭파하고 새로운 국면을 여는 찰나입니다.',
    practicalCounsel: '내일로 미루는 관성적인 태도를 지금 이 순간 단호히 끊어내십시오. 역사를 바꾸는 모든 결정적인 전환은 바로 ‘지금 이 순간’ 당신이 내리는 용기 있는 행동 하나에서 폭발합니다.',
  },
  {
    themeKey: 'flaneurCollectorInsight',
    themeTitleEn: 'Flâneur & Collector: Extracting Truth from Discarded Everyday Fragments',
    themeTitleKo: '산책자와 수집가의 통찰 — 버려진 사소한 일상의 파편 속에서 시대의 진실과 보물 발견하기',
    pragmaticInsight: '도심을 유유히 걷는 산책자(Flâneur)와 쓸모없어 보이는 파편을 모으는 수집가는 남들이 지나치는 누추한 파편에서 우주의 역사를 읽어냅니다. 하찮아 보이는 사소함 속에 거대한 진실이 숨어 있습니다.',
    practicalCounsel: '거대하고 화려한 결과물에만 눈독 들이지 마십시오. 당신의 일상 속 스쳐 지나가는 작은 디테일, 버려진 아이디어의 파편을 소중히 수집하고 관찰하십시오. 그 작은 틈새에 혁신의 단초가 있습니다.',
  },
  {
    themeKey: 'allegoricalRedemption',
    themeTitleEn: 'Allegorical Redemption: Rekindling the Spark of Hope in Broken Realities',
    themeTitleKo: '파편의 알레고리와 구원 — 부서진 불완전성 속에서도 희망의 불꽃을 다시 점화하기',
    pragmaticInsight: '벤야민의 알레고리는 폐허와 부서진 파편 속에서 오히려 영원한 의미를 갈망하는 사유입니다. 상황이 산산조각 났다고 느껴질 때조차, 부서진 조각들은 새로운 구원과 재구성을 기다리는 희망의 불씨가 됩니다.',
    practicalCounsel: '불완전한 현실이나 실패의 조각들을 보고 자책하지 마십시오. 깨어진 파편 하나하나를 다시 맞추어 새로운 의미의 모자이크를 빚어내십시오. 절망의 한복판에 구원의 문이 열려 있습니다.',
  },
];

export const BENJAMIN_APHORISMS: BenjaminAphorism[] = [
  {
    aphorismKey: 'angelusNovusWind',
    aphorismKo: '역사의 천사는 얼굴을 과거로 돌리고 있다... 폭풍은 그를 자신이 등을 돌리고 있는 미래로 거세게 밀어붙인다. 우리가 진보라고 부르는 것이 바로 이 폭풍이다.',
    aphorismGerman: 'Der Engel der Geschichte hat das Antlitz der Vergangenheit zugewendet... Ein Sturm weht vom Paradiese her... Dieser Sturm treibt ihn unaufhaltsam in die Zukunft... Das, was wir den Fortschritt nennen, ist dieser Sturm.',
    sourceContext: '발터 벤야민 《역사의 개념에 대하여(Über den Begriff der Geschichte)》 테제 9',
    actionGuidance: '맹목적인 속도와 허황된 진보의 구호에 휩쓸리지 마십시오. 지나온 발자취의 잔해를 정직하게 돌아보며 방향을 잡으십시오.',
  },
  {
    aphorismKey: 'auraHereAndNow',
    aphorismKo: '아무리 완벽한 복제라 하더라도 단 한 가지 빠진 것이 있다. 그것은 예술작품이 위치한 그곳에서의 시간과 공간, 곧 지금-여기의 일회적 현존성이다.',
    aphorismGerman: 'Es fehlt ihr eines: das Hier und Jetzt des Kunstwerks – sein einmaliges Dasein an dem Orte, an dem es sich befindet.',
    sourceContext: '발터 벤야민 《기술복제시대의 예술작품(Das Kunstwerk im Zeitalter seiner technischen Reproduzierbarkeit)》',
    actionGuidance: '남의 흉내나 쉬운 복사 붙여넣기를 멈추십시오. 오직 당신만이 만들어낼 수 있는 ‘지금 여기’의 진정성을 쏟아부으십시오.',
  },
  {
    aphorismKey: 'jetztzeitDoor',
    aphorismKo: '과거는 구원을 갈망하는 비밀스러운 지표를 품고 있다. 시간의 매 순간 속에는 메시아가 들어설 수 있는 작은 문이 마련되어 있다.',
    aphorismGerman: 'In ihr war jede Sekunde die kleine Pforte, durch die der Messias treten konnte.',
    sourceContext: '발터 벤야민 《역사의 개념에 대하여》 테제 B',
    actionGuidance: '무의미하게 시간을 흘려보내지 마십시오. 오늘 당신이 마주한 바로 이 평범한 순간이 운명을 바꾸는 기적의 문입니다.',
  },
  {
    aphorismKey: 'collectorLiberation',
    aphorismKo: '진정한 수집가는 사물들을 실용적 유용성의 족쇄에서 해방시켜, 사물 고유의 순수한 운명 속으로 이끈다.',
    aphorismGerman: 'Der echte Sammler erlöst die Dinge aus der Sklaverei des Nutzens.',
    sourceContext: '발터 벤야민 《아케이드 프로젝트(Das Passagen-Werk)》',
    actionGuidance: '모든 것을 눈앞의 쓸모와 손익 계산으로만 저울질하지 마십시오. 사물과 사람의 본래 지닌 소중한 가치를 발견하고 북돋아주십시오.',
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

function formatBenjaminKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function buildBenjaminReflectiveQuestion(theme: BenjaminTheme, query?: string): string {
  const trimmed = query?.trim();
  if (trimmed) {
    return `'${trimmed}'에서 남들이 하는 복제와 관성을 끊고, 바로 지금-시간(Jetztzeit)의 작은 문으로 들어설 나만의 일회적 결단은 무엇인가요? (${theme.themeTitleKo})`;
  }
  return `지금 지나쳐 버리기 쉬운 일상의 사소한 파편 가운데, 다시 주워 모아 구원의 의미를 빚어낼 작은 불씨는 어디에 있나요? (${theme.themeTitleKo})`;
}

function describeBenjaminStage(score: number): string {
  if (score >= 94) return '지금-시간(Jetztzeit) 폭발기 (지금-여기의 아우라와 구원의 문이 동시에 열리는 흐름)';
  if (score >= 90) return '산책자 각성기 (일상의 사소한 파편에서 시대의 진실이 번뜩이는 국면)';
  return '폐허 응시기 (허황된 속도를 멈추고 상처의 결을 정직하게 살피는 흐름)';
}

export function calculateGermanWalterBenjaminAuraNowTime(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): GermanWalterBenjaminAuraNowTimeResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `WALTER-BENJAMIN-AURA-NOWTIME:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const auraAuthenticityResonanceScore = 89 + ((absHash >> 1) % 10);
  const angelusNovusHistoricalInsightIndex = 88 + ((absHash >> 4) % 11);
  const jetztzeitMessianicMomentumScore = 87 + ((absHash >> 7) % 12);
  const flaneurDialecticalIlluminationIndex = 89 + ((absHash >> 10) % 10);
  const allegoricalRedemptionScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % BENJAMIN_THEMES.length;
  const aphorismIndex = (absHash >> 8) % BENJAMIN_APHORISMS.length;
  const secondaryOffset = 1 + ((absHash >> 11) % (BENJAMIN_APHORISMS.length - 1));
  const secondaryAphorismIndex = (aphorismIndex + secondaryOffset) % BENJAMIN_APHORISMS.length;

  const activeBenjaminTheme = BENJAMIN_THEMES[themeIndex];
  const focalBenjaminAphorism = BENJAMIN_APHORISMS[aphorismIndex];
  const secondaryBenjaminAphorism = BENJAMIN_APHORISMS[secondaryAphorismIndex];
  const reflectiveQuestion = buildBenjaminReflectiveQuestion(activeBenjaminTheme, query);
  const interpretiveBoundary = '발터 벤야민 비판미학 관점은 사건의 성패나 미래 예언이 아니라, 지금-여기의 고유성과 일상의 파편을 읽는 문화·철학적 성찰 렌즈입니다.';

  const guidanceTitle = `발터 벤야민 아우라와 지금-시간의 지혜: ${activeBenjaminTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 최고의 비판 사상가이자 문화비평가 발터 벤야민 선생은 《역사의 개념에 대하여》와 《기술복제시대의 예술작품》을 통해 ` +
    `복제품의 홍수 속에서 회복해야 할 '지금-여기'의 고유한 현존성인 아우라(Aura), 안일한 낙관론을 깨뜨리는 역사의 천사(Angelus Novus)의 깊은 성찰, ` +
    `그리고 찰나의 순간에서 새로운 운명의 문을 여는 메시아적 지금-시간(Jetztzeit)의 결단을 역설했습니다. ` +
    `현재 당신이 마주한 상황에서 가장 강력한 전환의 열쇠는 '${activeBenjaminTheme.themeTitleKo}'입니다. ` +
    `${activeBenjaminTheme.practicalCounsel} 벤야민의 불후의 테제 "${focalBenjaminAphorism.aphorismKo}" (${focalBenjaminAphorism.aphorismGerman})를 가슴에 품고, ` +
    `${focalBenjaminAphorism.actionGuidance}`;

  const benjaminSynthesisMatrix = {
    dominantTension: `${activeBenjaminTheme.themeTitleKo} ↔ ${focalBenjaminAphorism.sourceContext}`,
    alignmentState:
      auraAuthenticityResonanceScore >= 92 && jetztzeitMessianicMomentumScore >= 91
        ? '아우라 현존성과 지금-시간 도약의 고차원 공명'
        : '파편과 폐허 속에서 고유한 구원의 문턱을 여는 국면',
    integratedAction: `${activeBenjaminTheme.practicalCounsel} (${focalBenjaminAphorism.actionGuidance})`,
  };

  return {
    engineVersion: GERMAN_WALTER_BENJAMIN_AURA_NOWTIME_VERSION,
    calculatedAtKst: formatBenjaminKstTimestamp(now),
    auraAuthenticityResonanceScore,
    angelusNovusHistoricalInsightIndex,
    jetztzeitMessianicMomentumScore,
    flaneurDialecticalIlluminationIndex,
    allegoricalRedemptionScore,
    activeBenjaminTheme,
    focalBenjaminAphorism,
    secondaryBenjaminAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    benjaminComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    benjaminSynthesisMatrix,
  };
}

export function formatGermanWalterBenjaminAuraNowTimePrompt(
  res: GermanWalterBenjaminAuraNowTimeResult,
): string {
  const lines = [
    `【발터 벤야민 《역사의 개념에 대하여》 아우라·지금-시간(Jetztzeit) 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 아우라 고유성 및 진정성 공명(Aura Authenticity Resonance): ${describeBenjaminStage(res.auraAuthenticityResonanceScore)}`,
    `- 역사의 천사 및 폐허 직시력(Angelus Novus Ruin Insight): ${describeBenjaminStage(res.angelusNovusHistoricalInsightIndex)}`,
    `- 메시아적 지금-시간 및 결정적 도약력(Messianic Jetztzeit Leap): ${describeBenjaminStage(res.jetztzeitMessianicMomentumScore)}`,
    `- 산책자의 변증법적 직관 및 수집가 안목(Flâneur Intuition & Collector Gaze): ${describeBenjaminStage(res.flaneurDialecticalIlluminationIndex)}`,
    `- 파편의 알레고리 및 구원 희망 점화력(Allegorical Fragment Redemption): ${describeBenjaminStage(res.allegoricalRedemptionScore)}`,
    `- 핵심 벤야민 테마: ${res.activeBenjaminTheme.themeTitleKo} [${res.activeBenjaminTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeBenjaminTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeBenjaminTheme.practicalCounsel}`,
    `- 벤야민 원전 테제: "${res.focalBenjaminAphorism.aphorismKo}" (${res.focalBenjaminAphorism.aphorismGerman})`,
    `- 원전 출처: [${res.focalBenjaminAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalBenjaminAphorism.actionGuidance}`,
    `- 보조 원전 테제: "${res.secondaryBenjaminAphorism.aphorismKo}" (${res.secondaryBenjaminAphorism.aphorismGerman})`,
    `- 보조 원전 출처: [${res.secondaryBenjaminAphorism.sourceContext}]`,
    `- 보조 실천 지침: ${res.secondaryBenjaminAphorism.actionGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 종합 벤야민 권면: ${res.benjaminComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.benjaminSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.benjaminSynthesisMatrix.dominantTension} | 조율 상태: ${res.benjaminSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.benjaminSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
