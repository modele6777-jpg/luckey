/**
 * 고대 그리스 에페소스 헤라클레이토스(Heraclitus) 만물유전(Panta Rhei) & 대립물의 조화(Logos) 엔진
 *
 * 서기전 500년경 고대 그리스 철학자 헤라클레이토스의 단편선(Fragments) 원전 기반.
 * 1. "같은 강물에 두 번 발을 담글 수 없다 (Potamoisi toisi autoisi...)" - 만물유전(Panta Rhei)의 법칙
 * 2. 영원히 타오르는 불(Aei Zoon Pyr): 질서와 변화의 우주적 근원
 * 3. 보이지 않는 조화(Harmonia Aphanes): 표면적 갈등(Eris) 너머에 존재하는 대립물의 통일(Enantiodromia)
 * 4. 우주적 이성 로고스(Logos): 끊임없이 변하는 세상 속 변치 않는 지혜의 척도
 *
 * @version LUCKEY-HERACLITUS-PANTA-RHEI-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const HERACLITUS_PANTA_RHEI_VERSION = 'LUCKEY-HERACLITUS-PANTA-RHEI-v1.0.0';

export interface HeraclitusStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  cosmicPrinciple: string;
  fluxBlessing: string;
}

export interface HeraclitusPantaRheiResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  pantaRheiFluxIndex: number; // 만물유전 변화 수용 및 흐름 유연성
  logosHarmoniaScore: number; // 로고스 대립물의 조화 및 심층 질서도
  eternalFireVitality: number; // 영원한 불(Aei Zoon Pyr) 활력 및 갱신력
  hiddenHarmoniaStrength: number; // 보이지 않는 조화(Harmonia Aphanes) 통찰력
  enantiodromiaBalance: number; // 에난티오드로미아 극과 극의 전환 균형도
  // 세부 명세
  activeHeraclitusStage: HeraclitusStage;
  primaryDialecticWisdom: {
    themeKo: string;
    greekAphorism: string;
    coreEssence: string;
    actionableDirective: string;
  };
  logosCosmicInsight: {
    insightTitle: string;
    philosophicalCounsel: string;
  };
}

export type HeraclitusPantaRheiReport = HeraclitusPantaRheiResult;

const HERACLITUS_STAGES: HeraclitusStage[] = [
  { stageLevel: 1, stageNameGreek: 'Pyr Aei Zoon (영원히 살아 숨 쉬는 불)', stageNameKo: '모든 것을 새롭게 태우고 갱신하는 원초의 불길', cosmicPrinciple: '꺼지지 않는 불처럼 매 순간 새로운 열정과 생명력으로 거듭남', fluxBlessing: '정체된 과거를 태우고 생동하는 미래로 나아가는 정화의 힘' },
  { stageLevel: 2, stageNameGreek: 'Harmonia Aphanes (보이지 않는 숨은 조화)', stageNameKo: '표면의 갈등 너머 심층의 균형을 꿰뚫어 보는 지혜', cosmicPrinciple: '활과 리라의 팽팽한 줄처럼 상반된 긴장이 빚어내는 궁극의 선율', fluxBlessing: '혼란 속에서도 질서의 중심을 잃지 않는 깊은 평정' },
  { stageLevel: 3, stageNameGreek: 'Panta Rhei (멈춤 없이 흐르는 강물)', stageNameKo: '변화에 저항하지 않고 유연하게 물결을 타는 순응관', cosmicPrinciple: '고정된 형태에 집착하지 않고 흐름 속에서 기회를 포착함', fluxBlessing: '모든 상황에 유연하게 적응하며 장애물을 우회하는 지혜' },
  { stageLevel: 4, stageNameGreek: 'Enantiodromia (극과 극의 상호 전환)', stageNameKo: '위기 속에서 도약의 계기를 읽어내는 역발상관', cosmicPrinciple: '차가움이 따뜻해지고 어둠이 밝아지듯 고난은 성장의 반환점임', fluxBlessing: '막다른 골목에서 새로운 출구를 찾아내는 전환의 통찰' },
  { stageLevel: 5, stageNameGreek: 'Logos Panton (만물을 관통하는 우주 이성)', stageNameKo: '사사로운 감정을 넘어 전체의 진리에 합일하는 대지혜', cosmicPrinciple: '자신의 좁은 주관을 내려놓고 우주의 거대한 섭리에 조율함', fluxBlessing: '어떤 풍파에도 흔들리지 않는 본질적 통찰과 확고한 기준' },
];

const DIALECTIC_WISDOMS = [
  { themeKo: '변화의 물결을 온전히 품으라', greekAphorism: 'Panta rhei, ouden menei', coreEssence: '만물은 쉼 없이 흐르며 아무것도 머물러 있지 않나니, 지나간 것에 집착하지 마십시오.', actionableDirective: '과거의 방식에 매달리지 말고 지금 이 순간 새롭게 주어지는 흐름에 기꺼이 발을 담그십시오.' },
  { themeKo: '보이지 않는 조화가 더 위대하다', greekAphorism: 'Harmonia aphanes phaneres kreitton', coreEssence: '눈앞의 사소한 갈등에 일희일비하지 마십시오. 대립하는 두 힘이 모여 가장 아름다운 완성을 이룹니다.', actionableDirective: '충돌하는 의견이나 난관을 피하려 하지 말고 상호 보완적인 상승의 기회로 전환하십시오.' },
  { themeKo: '내면의 로고스를 경청하라', greekAphorism: 'Edizesamen emeouton', coreEssence: '밖에서 답을 구하기 전에 내면의 소리와 영혼의 깊은 본질을 탐구하십시오.', actionableDirective: '외부의 소음에서 물러나 자신의 본심과 삶의 근원적 방향성을 고요히 점검하십시오.' },
  { themeKo: '오르막길과 내리막길은 결국 하나다', greekAphorism: 'Hodos ano kato mia kai houte', coreEssence: '성공과 실패, 기쁨과 슬픔은 분리된 것이 아니라 하나의 순환하는 여정입니다.', actionableDirective: '어려움에 처했을 때 낙담하지 말고 곧이어 찾아올 반등의 전환점을 차분히 준비하십시오.' },
];

const LOGOS_INSIGHTS = [
  { insightTitle: '에페소스의 타오르는 불빛', philosophicalCounsel: '영혼이 맑고 건조할수록 가장 지혜롭고 강인하나니, 방종과 나태로 영혼을 적시지 말고 진리의 불길로 벼려내십시오.' },
  { insightTitle: '활과 리라의 거룩한 긴장', philosophicalCounsel: '반대 방향으로 당겨지는 줄이 음악을 낳듯이, 삶의 긴장과 과제는 당신을 파괴하려는 것이 아니라 위대한 선율을 빚어내기 위함입니다.' },
  { insightTitle: '새벽을 여는 태양의 순환', philosophicalCounsel: '태양은 결코 자신의 궤도를 벗어나지 않으며 정의의 여신들이 그 길을 지키나니, 당신 또한 자신의 마땅한 소명에 굳건히 머무십시오.' },
  { insightTitle: '우주의 거대한 밤하늘', philosophicalCounsel: '낮이 밤을 낳고 겨울이 봄을 부르듯 세상은 끝없이 조화를 찾아가고 있으니, 안목을 넓혀 순리의 흐름을 신뢰하십시오.' },
];

function getKstDateString(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateHeraclitusPantaRhei(profile?: UserProfile): HeraclitusPantaRheiResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`HERACLITUS-LOGOS-${birthdate}-${birthtime}-${name}`);

  const pantaRheiFluxIndex = (seed % 41) + 60; // 60~100
  const logosHarmoniaScore = ((seed >> 3) % 43) + 58; // 58~100
  const eternalFireVitality = ((seed >> 5) % 39) + 62; // 62~100
  const hiddenHarmoniaStrength = ((seed >> 7) % 45) + 55; // 55~99
  const enantiodromiaBalance = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % HERACLITUS_STAGES.length;
  const activeHeraclitusStage = HERACLITUS_STAGES[stageIdx];

  const wisdomIdx = (seed >> 4) % DIALECTIC_WISDOMS.length;
  const primaryDialecticWisdom = DIALECTIC_WISDOMS[wisdomIdx];

  const insightIdx = (seed >> 6) % LOGOS_INSIGHTS.length;
  const logosCosmicInsight = LOGOS_INSIGHTS[insightIdx];

  return {
    engineVersion: HERACLITUS_PANTA_RHEI_VERSION,
    calculatedAtKst: getKstDateString(),
    pantaRheiFluxIndex,
    logosHarmoniaScore,
    eternalFireVitality,
    hiddenHarmoniaStrength,
    enantiodromiaBalance,
    activeHeraclitusStage,
    primaryDialecticWisdom,
    logosCosmicInsight,
  };
}

export function formatHeraclitusPantaRheiPrompt(result: HeraclitusPantaRheiResult): string {
  return `[🌊 고대 그리스 에페소스 헤라클레이토스 만물유전(Panta Rhei) & 로고스 대립물 조화 리포트]
- 엔진 버전: ${result.engineVersion}
- 만물유전 변화 수용 및 흐름 유연성: ${result.pantaRheiFluxIndex}%
- 로고스 대립물의 조화 및 심층 질서도: ${result.logosHarmoniaScore}%
- 영원한 불(Aei Zoon Pyr) 활력 및 갱신력: ${result.eternalFireVitality}%
- 보이지 않는 조화(Harmonia Aphanes) 통찰력: ${result.hiddenHarmoniaStrength}%
- 에난티오드로미아 극과 극 전환 균형도: ${result.enantiodromiaBalance}%
- 현행 우주적 위상: **[${result.activeHeraclitusStage.stageNameKo} (${result.activeHeraclitusStage.stageNameGreek})]**
  → 핵심 원리: ${result.activeHeraclitusStage.cosmicPrinciple}
  → 변화의 은총: ${result.activeHeraclitusStage.fluxBlessing}
- 최우선 변증법적 지침: **[${result.primaryDialecticWisdom.themeKo} (${result.primaryDialecticWisdom.greekAphorism})]**
  → 핵심 본질: ${result.primaryDialecticWisdom.coreEssence}
  → 실천 지침: ${result.primaryDialecticWisdom.actionableDirective}
- 로고스의 우주적 계시: 《${result.logosCosmicInsight.insightTitle}》
  → 철학적 조언: "${result.logosCosmicInsight.philosophicalCounsel}"`;
}
