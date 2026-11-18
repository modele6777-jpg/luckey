/**
 * 이탈리아 단테 알리기에리(Dante Alighieri) 《신곡(La Divina Commedia)》
 * 영혼의 상승 어두운 숲 탈출 지옥·연옥·천국 사랑과 광명 지혜 엔진
 *
 * 인류 문학사 최고의 대서사시를 남긴 이탈리아의 위대한 시성 단테(1265~1321)의 걸작
 * 《신곡(La Divina Commedia, 1320)》 - 지옥편(Inferno), 연옥편(Purgatorio), 천국편(Paradiso) 원전 기반:
 * 1. 어두운 숲(Selva Oscura) 속 올바른 길의 각성: "우리 인생길의 반 고비에서 올바른 길을 잃고 어두운 숲에 처했네" - 인생의 혼란과 방황은 더 깊은 영적 순례를 시작하라는 운명의 부름.
 * 2. 지옥(Inferno)의 그림자 직면: 고통과 비탄, 에고의 왜곡된 집착을 회피하지 않고 베르길리우스의 이성을 등불 삼아 정직하게 응시하는 내적 용기.
 * 3. 연옥(Purgatorio)의 영혼 정화와 덕목 갱신: 무거운 죄와 짐을 하나씩 씻어내고, 자만·분노·나태를 겸손과 사랑의 덕목으로 전환하며 정상으로 오르는 치유.
 * 4. 천국(Paradiso)의 지복직관(Visio Beatifica): 베아트리체의 순수한 인도를 받아 우주의 조화와 영원한 빛에 눈뜨는 지혜의 도약.
 * 5. 태양과 별들을 움직이는 그 사랑(L'amor che move il sole e l'altre stelle): 모든 모순과 갈등을 감싸 안는 신성한 우주적 사랑과의 영적 합일.
 *
 * @version LUCKEY-DANTE-DIVINE-COMEDY-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const ITALIAN_DANTE_COMEDY_VERSION = 'LUCKEY-DANTE-DIVINE-COMEDY-v2.2.0';

export interface DanteTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  practicalCounsel: string;
}

export interface DanteAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface DanteAlighieriDivineComedyAscentResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 신곡·영혼 상승 지표 (0~100)
  selvaOscuraWayfindingScore: number;     // 어두운 숲 속 바른길 발견 및 각성력
  infernoShadowConfrontScore: number;     // 지옥의 그림자 정직한 직면과 통과력
  purgatorioCleansingVirtueScore: number; // 연옥의 영혼 정화 및 덕목 갱신력
  paradisoLuminousClarityScore: number;   // 천국의 지복직관과 영적 명료성
  cosmicLoveHarmonizingScore: number;     // 태양과 별들을 움직이는 사랑 공명도
  // 세부 분석
  activeDanteTheme: DanteTheme;
  focalDanteAphorism: DanteAphorism;
  secondaryDanteAphorism: DanteAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  danteComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  danteSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const DANTE_THEMES: DanteTheme[] = [
  {
    themeKey: 'selva_oscura_awakening',
    themeTitleEn: 'Awakening in the Dark Wood',
    themeTitleKo: '어두운 숲속의 각성 - 위기와 혼란 속에서 찾는 참된 길',
    philosophicalInsight: '인생의 한가운데서 길을 잃었다는 자각이야말로 거짓된 습관을 깨고 참된 자아를 찾아 나서는 위대한 여정의 시작입니다.',
    practicalCounsel: '현재 겪고 있는 혼란을 두려워하지 마십시오. 그 막막함은 당신의 영혼이 더 높은 차원의 진실을 갈망하기 시작했다는 신호입니다.',
  },
  {
    themeKey: 'inferno_facing_shadow',
    themeTitleEn: 'Facing the Shadows of Inferno',
    themeTitleKo: '그림자의 응시 - 고통과 집착의 뿌리를 정직하게 직면하는 용기',
    philosophicalInsight: '마음속 어두운 상처와 왜곡된 욕망을 외면하지 않고 끝까지 응시할 때, 비로소 고통의 심연을 통과해 별빛으로 나아갈 수 있습니다.',
    practicalCounsel: '회피하고 싶었던 마음의 그림자나 불편한 진실을 똑바로 마주하십시오. 정직한 직시만이 상처를 치유하고 자유를 선물합니다.',
  },
  {
    themeKey: 'purgatorio_virtue_ascent',
    themeTitleEn: 'Purgatorial Cleansing and Virtue Renewal',
    themeTitleKo: '연옥의 정화 - 불필요한 무거운 짐을 내려놓고 가벼워지는 영혼',
    philosophicalInsight: '높은 산을 오르기 위해 불필요한 무게를 버리듯, 오랜 원망과 집착을 용서로 비워낼 때 영혼은 한 걸음씩 가볍게 날아오릅니다.',
    practicalCounsel: '과거의 서운함과 타인에 대한 비난을 오늘 의식적으로 내려놓으십시오. 비워진 그 자리에 새로운 생명과 덕목이 깃듭니다.',
  },
  {
    themeKey: 'paradiso_cosmic_love',
    themeTitleEn: 'The Love That Moves the Sun and Stars',
    themeTitleKo: '우주를 움직이는 사랑 - 모든 분열을 초월하는 궁극의 조화',
    philosophicalInsight: '세상의 모든 존재와 고통은 결국 태양과 별들을 움직이는 위대한 사랑의 섭리 안에서 온전히 화해하고 완성됩니다.',
    practicalCounsel: '오늘 만나는 모든 사람과 상황을 차별 없는 따스한 사랑과 축복의 시선으로 바라보십시오. 그 사랑이 기적을 부릅니다.',
  },
];

export const DANTE_APHORISMS: DanteAphorism[] = [
  {
    aphorismKey: 'selva_oscura',
    aphorismKo: '우리 인생길의 반 고비에서, 올바른 길을 잃고 어두운 숲에 처해 있었네.',
    aphorismEn: 'Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura, che la diritta via era smarrita.',
    sourceContext: '《신곡》 지옥편 제1곡',
    actionGuidance: '길을 잃었다고 절망하지 마십시오. 바로 그 자리에서 이성과 양심의 나침반을 세우고 새로운 방향으로 첫발을 내딛으십시오.',
  },
  {
    aphorismKey: 'riveder_le_stelle',
    aphorismKo: '그리고 우리는 나와서 다시 별들을 바라보았노라.',
    aphorismEn: 'E quindi uscimmo a riveder le stelle. (And thence we came forth to see again the stars.)',
    sourceContext: '《신곡》 지옥편 제34곡 마지막 구절',
    actionGuidance: '어둠의 심연은 끝이 있습니다. 포기하지 않고 정직하게 통과하면 찬란한 별빛이 당신을 기다리고 있음을 잊지 마십시오.',
  },
  {
    aphorismKey: 'purgatorio_lightness',
    aphorismKo: '산이 너무 가팔라 보이지만, 오를수록 점차 가벼워져 마침내 새처럼 날아오르게 되리라.',
    aphorismEn: 'This mountain is such, that ever at the beginning below it is toilsome, and the more a man ascends the less it vexes him.',
    sourceContext: '《신곡》 연옥편 제4곡',
    actionGuidance: '처음에는 버겁고 힘겨운 노력일지라도 성실히 지속하십시오. 어느덧 내면의 힘이 붙어 가볍고 자연스럽게 순항하게 됩니다.',
  },
  {
    aphorismKey: 'amor_move_sole',
    aphorismKo: '태양과 다른 별들을 움직이는 그 사랑.',
    aphorismEn: "L'amor che move il sole e l'altre stelle. (The Love that moves the sun and the other stars.)",
    sourceContext: '《신곡》 천국편 제33곡 최종 구절',
    actionGuidance: '계산과 두려움을 내려놓고 우주를 움직이는 거대한 사랑의 흐름에 당신의 마음을 맡기십시오. 모든 것이 바른길로 인도됩니다.',
  },
];

function formatDanteKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeDanteStage(score: number): string {
  if (score >= 90) return '천국 지복직관(Paradiso)기 (어둠을 뚫고 별빛과 우주적 사랑에 닿는 흐름)';
  if (score >= 80) return '연옥 정화(Purgatorio)기 (무거운 짐을 내려놓고 덕목으로 상승하는 국면)';
  return '어두운 숲 각성(Selva Oscura)기 (혼란 속에서 정직한 나침반을 세우는 흐름)';
}

export function calculateItalianDanteAlighieriDivineComedyAscent(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): DanteAlighieriDivineComedyAscentResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `DANTE-DIVINE-COMEDY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const selvaOscuraWayfindingScore = 74 + (absHash % 25);
  const infernoShadowConfrontScore = 72 + ((absHash >> 3) % 27);
  const purgatorioCleansingVirtueScore = 73 + ((absHash >> 6) % 26);
  const paradisoLuminousClarityScore = 75 + ((absHash >> 9) % 24);
  const cosmicLoveHarmonizingScore = 76 + ((absHash >> 12) % 23);

  const themeIndex = (absHash >> 4) % DANTE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % DANTE_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (DANTE_APHORISMS.length - 1))) % DANTE_APHORISMS.length;

  const activeDanteTheme = DANTE_THEMES[themeIndex];
  const focalDanteAphorism = DANTE_APHORISMS[aphorismIndex];
  const secondaryDanteAphorism = DANTE_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'이라는 어두운 숲 앞에서 지금 회피하지 않고 똑바로 직면한 뒤 별빛을 향해 걸어 나가야 할 한 걸음은 무엇인가요?`
    : `지금 내 삶의 길목에서 무거운 짐으로 남아 있지만, 정직하게 마주하고 내려놓을수록 가벼워질 마음의 매듭은 무엇인가요?`;
  const interpretiveBoundary = '단테 《신곡》 영혼 상승 관점은 내세의 심판이나 운명 예단이 아니라, 혼란의 직면과 정화를 거쳐 사랑의 방향을 찾는 문학·성찰 렌즈입니다.';

  const guidanceTitle = `단테 신곡 영혼 상승 지혜: ${activeDanteTheme.themeTitleKo}`;
  const philosophicalCounsel = `단테의 신곡 철학은 인생의 어두운 숲을 뚫고 그림자의 직면과 정화를 거쳐 궁극의 광명과 사랑으로 오르는 영혼의 순례를 밝혀줍니다. ` +
    `현재 당신의 여정에서 가장 핵심적인 승화의 관문은 '${activeDanteTheme.themeTitleKo}'입니다. ` +
    `${activeDanteTheme.practicalCounsel} 단테의 불멸의 명언 "${focalDanteAphorism.aphorismKo}"(${focalDanteAphorism.aphorismEn})을 마음에 품고, ` +
    `${focalDanteAphorism.actionGuidance}`;

  const danteSynthesisMatrix = {
    dominantTension: `${activeDanteTheme.themeTitleKo} ↔ ${focalDanteAphorism.sourceContext}`,
    alignmentState:
      paradisoLuminousClarityScore >= 86 && cosmicLoveHarmonizingScore >= 86
        ? '지복직관과 우주적 사랑의 고차원 순례 합일'
        : '그림자 직면과 연옥의 정화를 통해 별빛으로 오르는 국면',
    integratedAction: `${activeDanteTheme.practicalCounsel} (${focalDanteAphorism.actionGuidance})`,
  };

  const ritualAction = `[${activeDanteTheme.themeTitleKo}] ${focalDanteAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: ITALIAN_DANTE_COMEDY_VERSION,
    calculatedAtKst: formatDanteKstTimestamp(now),
    selvaOscuraWayfindingScore,
    infernoShadowConfrontScore,
    purgatorioCleansingVirtueScore,
    paradisoLuminousClarityScore,
    cosmicLoveHarmonizingScore,
    activeDanteTheme,
    focalDanteAphorism,
    secondaryDanteAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    danteComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    danteSynthesisMatrix,
  };
}

export function formatDanteAlighieriDivineComedyAscentPrompt(res: DanteAlighieriDivineComedyAscentResult): string {
  const lines = [
    `【단테 알리기에리 《신곡》 영혼의 상승 & 지옥·연옥·천국 지혜 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 어두운 숲 바른길 발견력(Selva Oscura Wayfinding): ${describeDanteStage(res.selvaOscuraWayfindingScore)}`,
    `- 지옥 그림자 정직한 직면력(Inferno Shadow Confront): ${describeDanteStage(res.infernoShadowConfrontScore)}`,
    `- 연옥 영혼 정화 및 덕목 갱신력(Purgatorio Virtue): ${describeDanteStage(res.purgatorioCleansingVirtueScore)}`,
    `- 천국 지복직관 영적 명료성(Paradiso Light): ${describeDanteStage(res.paradisoLuminousClarityScore)}`,
    `- 우주를 움직이는 사랑 공명도(Cosmic Love): ${describeDanteStage(res.cosmicLoveHarmonizingScore)}`,
    `- 핵심 신곡 테마: ${res.activeDanteTheme.themeTitleKo} [${res.activeDanteTheme.themeTitleEn}]`,
    `- 철학적 통찰: ${res.activeDanteTheme.philosophicalInsight}`,
    `- 실천적 조언: ${res.activeDanteTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalDanteAphorism.aphorismKo}"`,
    `- 보조 교차 경구: "${res.secondaryDanteAphorism.aphorismKo}" [${res.secondaryDanteAphorism.sourceContext}]`,
    `- 원문: "${res.focalDanteAphorism.aphorismEn}" [${res.focalDanteAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDanteAphorism.actionGuidance}`,
    `- 종합 통찰 권면: ${res.danteComprehensiveGuidance.philosophicalCounsel}`,
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.danteSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.danteSynthesisMatrix.dominantTension} | 조율 상태: ${res.danteSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.danteSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
