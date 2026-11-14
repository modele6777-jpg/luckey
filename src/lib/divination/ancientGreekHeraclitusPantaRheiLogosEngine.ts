/**
 * 고대 그리스 에페소스 헤라클레이토스(Heraclitus) 만물유전(Panta Rhei) & 대립물의 조화(Logos) 엔진
 *
 * 서기전 500년경 고대 그리스 철학자 헤라클레이토스의 단편선(Fragments, DK B1~B125) 원전 기반.
 * 1. "같은 강물에 두 번 발을 담글 수 없다 (DK B12, B91)" - 만물유전(Panta Rhei)의 법칙
 * 2. 영원히 타오르는 불(Aei Zoon Pyr, DK B30): 질서와 변화의 우주적 근원
 * 3. 보이지 않는 조화(Harmonia Aphanes, DK B54): 활과 리라의 팽팽한 긴장(DK B51)이 빚는 대립물의 통일(Enantiodromia)
 * 4. 우주적 이성 로고스(Logos, DK B1, B2, B101): 끊임없이 변하는 세상 속 변치 않는 지혜의 척도
 * 5. 질문 맥락 기반 변증법적 성찰 + KST 시공간 리듬 연동 다차원 교차 검증
 *
 * @version LUCKEY-HERACLITUS-PANTA-RHEI-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const HERACLITUS_PANTA_RHEI_VERSION = 'LUCKEY-HERACLITUS-PANTA-RHEI-v2.0.0';

export interface HeraclitusStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  cosmicPrinciple: string;
  fluxBlessing: string;
}

export type HeraclitusSituationalTheme =
  | 'transition_flux'
  | 'conflict_tension'
  | 'stagnation_fire'
  | 'anxiety_control'
  | 'relationship_polarity'
  | 'identity_logos';

export interface HeraclitusSituationalReflection {
  theme: HeraclitusSituationalTheme;
  fragmentRef: string;
  fragmentGreek: string;
  fragmentKo: string;
  reflectionPrompt: string;
  dialecticShift: string;
}

export interface HeraclitusTemporalFluxContext {
  kstHour: number;
  dayPhaseKo: string;
  seasonalPulseKo: string;
  fluxAttitude: '수용' | '점화' | '관조' | '전환';
  timingCounsel: string;
}

export interface HeraclitusDialecticPolarityMatrix {
  dominantTensionPair: string;
  tensionHarmonyRatio: number; // 0~100: 긴장을 창조적 선율로 전환하는 비율
  renewalFireMomentum: number; // 0~100: 정체를 태우고 쇄신하는 불꽃 모멘텀
  bowAndLyreStrategy: string;
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
  // v2.0.0 다차원 질적 성찰 & 시공간 교차 검증
  situationalReflection: HeraclitusSituationalReflection;
  temporalFluxContext: HeraclitusTemporalFluxContext;
  dialecticPolarityMatrix: HeraclitusDialecticPolarityMatrix;
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

const SITUATIONAL_REFLECTIONS: Record<HeraclitusSituationalTheme, HeraclitusSituationalReflection> = {
  transition_flux: {
    theme: 'transition_flux',
    fragmentRef: 'DK B12 · B91',
    fragmentGreek: 'Potamoisi toisi autoisi embainousin hetera kai hetera hudata epirrei',
    fragmentKo: '같은 강물에 발을 담그더라도 언제나 다른 물결이 흘러온다.',
    reflectionPrompt: '이미 흘러간 옛 물결을 붙잡느라 지금 발끝을 스치는 새로운 흐름을 외면하고 있지는 않으신가요?',
    dialecticShift: '이별과 변화는 상실이 아니라 새로운 강물이 시작되는 자리입니다. 익숙한 틀을 내려놓고 오늘의 물결에 맞춘 새 기준을 세우십시오.',
  },
  conflict_tension: {
    theme: 'conflict_tension',
    fragmentRef: 'DK B51 · B8',
    fragmentGreek: 'Palintropos harmonie hokosper toxou kai lyres',
    fragmentKo: '서로 맞당기는 긴장이 활과 리라의 조화를 빚어낸다.',
    reflectionPrompt: '지금 부딪히고 있는 갈등 속에서, 서로 다른 두 힘이 사실은 더 큰 균형을 위해 당겨지고 있는 줄은 아닐까요?',
    dialecticShift: '표면의 마찰을 없애려 애쓰기보다 양쪽 주장의 핵심 필요를 나란히 놓고 제3의 조율점을 찾으십시오.',
  },
  stagnation_fire: {
    theme: 'stagnation_fire',
    fragmentRef: 'DK B30 · B90',
    fragmentGreek: 'Pyr aei zoon, haptomenon metra kai aposbennymenon metra',
    fragmentKo: '우주는 척도에 따라 타오르고 척도에 따라 사그라드는 영원히 살아있는 불이다.',
    reflectionPrompt: '오래된 관성이나 식어버린 열정을 그대로 둔 채, 작은 불씨 하나를 새로 당길 용기를 미루고 있지는 않으신가요?',
    dialecticShift: '모든 것을 한 번에 바꾸려 하지 말고, 오늘 당장 작지만 분명한 불꽃 하나를 실행으로 옮겨 정체를 깨뜨리십시오.',
  },
  anxiety_control: {
    theme: 'anxiety_control',
    fragmentRef: 'DK B18 · B27',
    fragmentGreek: 'Ean me elpetai anelpiston ouk exeurēsei',
    fragmentKo: '예기치 못한 것을 기대하지 않는 자는 그것을 끝내 찾아내지 못한다.',
    reflectionPrompt: '모든 변수를 미리 통제하려는 마음이 오히려 예상치 못한 선물을 만날 여백을 닫고 있지는 않으신가요?',
    dialecticShift: '불확실성을 적으로 규정하지 마십시오. 통제 가능한 오늘의 한 걸음만 확정하고 나머지는 흐름의 개방성으로 남겨 두십시오.',
  },
  relationship_polarity: {
    theme: 'relationship_polarity',
    fragmentRef: 'DK B54 · B89',
    fragmentGreek: 'Harmonia aphanes phaneres kreitton',
    fragmentKo: '드러나지 않는 조화가 겉으로 드러난 조화보다 더 깊고 강하다.',
    reflectionPrompt: '상대와 나의 다름을 틀림으로 단정짓기 전에, 그 다름이 내게 비추어 주는 보이지 않는 균형은 무엇일까요?',
    dialecticShift: '상대를 내 틀에 맞추려 하지 말고, 각자의 궤도가 교차하는 지점에서만 빚어지는 고유한 울림에 집중하십시오.',
  },
  identity_logos: {
    theme: 'identity_logos',
    fragmentRef: 'DK B101 · B116',
    fragmentGreek: 'Edizesamen emeouton',
    fragmentKo: '나는 나 자신을 탐구하였다.',
    reflectionPrompt: '타인의 시선과 시대의 소음 사이에서, 오직 나만이 들을 수 있는 내면 로고스의 목소리는 무엇을 가리키고 있나요?',
    dialecticShift: '외부 기준을 잠시 끄고, 지금 내가 진정으로 지켜야 할 원칙 한 가지를 문장으로 적어 중심을 세우십시오.',
  },
};

function getKstDate(now?: Date): Date {
  const base = now ?? new Date();
  return new Date(base.getTime() + (9 * 60 + base.getTimezoneOffset()) * 60000);
}

function getKstDateString(now?: Date): string {
  return getKstDate(now).toISOString().replace('T', ' ').substring(0, 19) + ' KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function classifyHeraclitusTheme(question: string | undefined, seed: number): HeraclitusSituationalTheme {
  const q = (question || '').toLowerCase();
  if (/이별|변화|이직|이사|새로운|전환|바꾸|시작|끝/.test(q)) return 'transition_flux';
  if (/갈등|싸움|다툼|충돌|대립|반대|억울|화해/.test(q)) return 'conflict_tension';
  if (/지루|정체|무기력|막히|답답|슬럼프|포기|열정/.test(q)) return 'stagnation_fire';
  if (/불안|걱정|미래|두려|통제|실패|망설/.test(q)) return 'anxiety_control';
  if (/관계|사랑|연애|배우자|친구|동료|가족|사람/.test(q)) return 'relationship_polarity';
  if (/나|정체성|길|방향|사명|진로|의미|본질/.test(q)) return 'identity_logos';

  const fallbackOrder: HeraclitusSituationalTheme[] = [
    'transition_flux',
    'conflict_tension',
    'stagnation_fire',
    'anxiety_control',
    'relationship_polarity',
    'identity_logos',
  ];
  return fallbackOrder[seed % fallbackOrder.length];
}

function buildTemporalFluxContext(kstDate: Date): HeraclitusTemporalFluxContext {
  const hour = kstDate.getUTCHours();
  const month = kstDate.getUTCMonth() + 1;

  let dayPhaseKo = '심야의 내면 화로(불씨 보존기)';
  let fluxAttitude: HeraclitusTemporalFluxContext['fluxAttitude'] = '관조';
  let timingCounsel = '외부 행동을 줄이고 내면의 로고스를 고요히 정돈하는 시간입니다.';

  if (hour >= 5 && hour < 10) {
    dayPhaseKo = '새벽의 각성(태양의 첫 궤도)';
    fluxAttitude = '점화';
    timingCounsel = '새로운 물결에 첫 발을 내딛기 좋은 시간입니다. 작은 결단을 행동으로 점화하십시오.';
  } else if (hour >= 10 && hour < 17) {
    dayPhaseKo = '한낮의 역동(흐르는 강물의 절정)';
    fluxAttitude = '수용';
    timingCounsel = '상황의 변화 속도가 빠른 시간대입니다. 고정관념을 버리고 유연하게 흐름을 타십시오.';
  } else if (hour >= 17 && hour < 22) {
    dayPhaseKo = '황혼의 조율(활과 리라의 균형)';
    fluxAttitude = '전환';
    timingCounsel = '낮 동안 부딪힌 긴장과 과제를 되짚어 조화로운 선율로 전환할 때입니다.';
  }

  let seasonalPulseKo = '겨울의 수렴과 봄을 품은 잠열';
  if (month >= 3 && month <= 5) seasonalPulseKo = '봄의 발아(겨울에서 생동으로 건너가는 에난티오드로미아)';
  else if (month >= 6 && month <= 8) seasonalPulseKo = '여름의 타오르는 불(만물의 활력이 정점에 이르는 계절)';
  else if (month >= 9 && month <= 11) seasonalPulseKo = '가을의 여과(거품이 가라앉고 본질의 질서가 드러나는 계절)';

  return {
    kstHour: hour,
    dayPhaseKo,
    seasonalPulseKo,
    fluxAttitude,
    timingCounsel,
  };
}

export function calculateHeraclitusPantaRhei(
  profile?: UserProfile,
  question?: string,
  now?: Date,
): HeraclitusPantaRheiResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const kstDate = getKstDate(now);
  const seed = hashSeed(`HERACLITUS-LOGOS-${birthdate}-${birthtime}-${name}`);
  const questionSeed = hashSeed(`HERACLITUS-Q-${question || ''}-${kstDate.getUTCFullYear()}-${kstDate.getUTCMonth() + 1}-${kstDate.getUTCDate()}`);

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

  const theme = classifyHeraclitusTheme(question, questionSeed);
  const situationalReflection = SITUATIONAL_REFLECTIONS[theme];
  const temporalFluxContext = buildTemporalFluxContext(kstDate);

  const tensionPairs: Record<HeraclitusSituationalTheme, string> = {
    transition_flux: '안정 유지 vs 변화 수용',
    conflict_tension: '자기 주장 vs 상호 조화',
    stagnation_fire: '익숙한 관성 vs 쇄신의 불꽃',
    anxiety_control: '완전 통제 욕구 vs 열린 신뢰',
    relationship_polarity: '거리의 독립성 vs 깊은 연결',
    identity_logos: '외부 기대 vs 내면 로고스',
  };

  const tensionHarmonyRatio = Math.min(99, Math.round((logosHarmoniaScore + hiddenHarmoniaStrength) / 2));
  const renewalFireMomentum = Math.min(99, Math.round((eternalFireVitality + pantaRheiFluxIndex) / 2));

  const dialecticPolarityMatrix: HeraclitusDialecticPolarityMatrix = {
    dominantTensionPair: tensionPairs[theme],
    tensionHarmonyRatio,
    renewalFireMomentum,
    bowAndLyreStrategy:
      tensionHarmonyRatio >= 75
        ? '양극의 긴장을 회피하지 않고 창조적 추동력으로 묶어내는 조율 능력이 높습니다. 핵심 기준 하나만 고정한 채 실행 방식을 유연하게 열어 두십시오.'
        : '긴장이 과도해져 한쪽으로 쏠리기 쉬운 국면입니다. 당장 결론을 밀어붙이기보다 반대편 시각에서 빠진 퍼즐 조각 하나를 먼저 확인하십시오.',
  };

  return {
    engineVersion: HERACLITUS_PANTA_RHEI_VERSION,
    calculatedAtKst: getKstDateString(now),
    pantaRheiFluxIndex,
    logosHarmoniaScore,
    eternalFireVitality,
    hiddenHarmoniaStrength,
    enantiodromiaBalance,
    activeHeraclitusStage,
    primaryDialecticWisdom,
    logosCosmicInsight,
    situationalReflection,
    temporalFluxContext,
    dialecticPolarityMatrix,
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
- 질문 맥락 변증법적 성찰 (${result.situationalReflection.fragmentRef}): "${result.situationalReflection.fragmentKo}" (${result.situationalReflection.fragmentGreek})
  → 성찰 질문: ${result.situationalReflection.reflectionPrompt}
  → 전환 관점: ${result.situationalReflection.dialecticShift}
- 시공간 리듬 위상: ${result.temporalFluxContext.dayPhaseKo} / ${result.temporalFluxContext.seasonalPulseKo} (권장 태도: ${result.temporalFluxContext.fluxAttitude})
  → 타이밍 조언: ${result.temporalFluxContext.timingCounsel}
- 대립물 역학 매트릭스 (${result.dialecticPolarityMatrix.dominantTensionPair}): 긴장-조화 전환율 ${result.dialecticPolarityMatrix.tensionHarmonyRatio}% · 쇄신 불꽃 모멘텀 ${result.dialecticPolarityMatrix.renewalFireMomentum}%
  → 활과 리라 전략: ${result.dialecticPolarityMatrix.bowAndLyreStrategy}
- 최우선 변증법적 지침: **[${result.primaryDialecticWisdom.themeKo} (${result.primaryDialecticWisdom.greekAphorism})]**
  → 핵심 본질: ${result.primaryDialecticWisdom.coreEssence}
  → 실천 지침: ${result.primaryDialecticWisdom.actionableDirective}
- 로고스의 우주적 계시: 《${result.logosCosmicInsight.insightTitle}》
  → 철학적 조언: "${result.logosCosmicInsight.philosophicalCounsel}"`;
}
