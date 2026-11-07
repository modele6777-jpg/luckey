/**
 * 독일 아서 쇼펜하우어(Arthur Schopenhauer) 《의지와 표상으로서의 세계》 맹목적 의지 초월 & 심미적 관조·동포애 자비 엔진
 *
 * 19세기 독일 철학자 아서 쇼펜하우어(1788~1860)의 주저 《의지와 표상으로서의 세계(Die Welt als Wille und Vorstellung)》 및 《인생론》 원전 기반:
 * 1. 표상으로서의 세계(Die Welt als Vorstellung)와 맹목적 의지(Wille): 눈앞의 세계는 주관의 인식 표상이며, 그 배후에서 끝없이 결핍과 갈증을 일으키는 맹목적 생의 의지(Wille zum Leben)를 명철하게 직시함.
 * 2. 예술과 심미적 관조(Ästhetische Betrachtung): 순수 예술과 음악에 온전히 몰입함으로써 욕망의 사슬에서 일시적으로 벗어나 '순수한 인식의 주체(Reines Subjekt des Erkennens)'로 자유를 누리는 지적 해탈.
 * 3. 동포애와 보편적 자비(Mitleid): 모든 생명체가 실은 동일한 고통의 바다를 건너고 있다는 근원적 통찰에서 우러나오는 깊은 연민과 무조건적인 자비심.
 * 4. 명랑한 평정(Heiterkeit & Besonnenheit): 외적인 부귀나 타인의 칭찬에 행복을 구걸하지 않고, 지적인 자율성과 내면의 풍요로움으로 평정을 지키는 삶의 기술.
 * 5. 고슴도치의 딜레마(Stachelschweine-Dilemma): 타인과의 관계에서 너무 가까워 상처를 주지도, 너무 멀어져 얼어붙지도 않는 지혜로운 온기의 적정 거리 유지.
 *
 * @version LUCKEY-SCHOPENHAUER-WILL-REPRESENTATION-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const SCHOPENHAUER_WILL_REPRESENTATION_VERSION = 'LUCKEY-SCHOPENHAUER-WILL-REPRESENTATION-v1.0.0';

export interface SchopenhauerTheme {
  themeKey: string;
  themeTitleGerman: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  contemplativeCounsel: string;
}

export interface SchopenhauerAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  wisdomDimension: string;
  practicalAction: string;
}

export interface SchopenhauerWillRepresentationResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  willTranscendenceClarityScore: number;    // 맹목적 욕망 의지 초월 및 환상 직시도
  aestheticContemplationDepthScore: number;// 예술·음악 심미적 관조 몰입 지수
  mitleidUniversalCompassionScore: number; // 타자의 고통에 공감하는 동포애 자비심
  innerHeiterkeitSerenityScore: number;    // 외물에 흔들리지 않는 내적 명랑 평정심
  wiseRelationalDistanceScore: number;     // 고슴도치 딜레마 인간관계 적정 거리 지혜
  // 세부 체계
  activeSchopenhauerTheme: SchopenhauerTheme;
  focalPhilosophicalAphorism: SchopenhauerAphorism;
  schopenhauerPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type SchopenhauerWillRepresentationReport = SchopenhauerWillRepresentationResult;

const SCHOPENHAUER_THEMES: SchopenhauerTheme[] = [
  {
    themeKey: 'WillAsRepresentation',
    themeTitleGerman: 'Die Welt als Wille und Vorstellung',
    themeTitleKo: '의지와 표상 (끝없는 결핍의 사슬 끊기)',
    philosophicalInsight: '우리가 겪는 대부분의 고통은 외부 사물 그 자체가 아니라, 채워지지 않는 내면의 맹목적인 욕망과 그릇된 표상에서 비롯됩니다. 욕망의 속성을 직시할 때 비로소 노예 상태에서 벗어납니다.',
    contemplativeCounsel: '더 많은 것을 소유해야만 행복해질 것이라는 착각을 멈추십시오. 바깥을 향한 채근을 멈추고 내면의 시선을 고요히 거둘 때 참된 자유가 시작됩니다.',
  },
  {
    themeKey: 'AestheticContemplation',
    themeTitleGerman: 'Ästhetische Betrachtung und Musik',
    themeTitleKo: '심미적 관조와 음악 (욕망 없는 순수 인식의 순간)',
    philosophicalInsight: '아름다운 예술과 음악에 깊이 몰입할 때, 우리는 나 자신의 사적인 이익과 걱정을 잊고 우주를 관조하는 순수한 눈이 됩니다. 이 순간 생의 무게는 깃털처럼 가벼워집니다.',
    contemplativeCounsel: '복잡한 계산과 근심이 머리를 채울 때는 아름다운 음악을 듣거나 자연의 풍경을 바라보십시오. 순수한 몰입이 영혼을 맑게 씻어냅니다.',
  },
  {
    themeKey: 'MitleidEthics',
    themeTitleGerman: 'Das Mitleid als Basis der Moral',
    themeTitleKo: '동포애와 자비 (타인의 아픔에 건네는 깊은 연민)',
    philosophicalInsight: '이기주의의 좁은 벽을 허물면 타인의 고통이 곧 나의 고통임을 깨닫게 됩니다. 비난 대신 "나와 함께 삶의 무게를 견디는 벗"이라는 다정한 자비심이 진정한 윤리의 뿌리입니다.',
    contemplativeCounsel: '주변 사람들의 날카로운 반응이나 결점을 볼 때 적개심 대신 인간적 연민을 가지십시오. 이해와 너그러움이 갈등의 불씨를 꺼뜨립니다.',
  },
  {
    themeKey: 'InnerHeiterkeit',
    themeTitleGerman: 'Die Heiterkeit des Gemüts',
    themeTitleKo: '내면의 명랑함 (자족과 고독을 즐기는 품격)',
    philosophicalInsight: '한 인간이 가질 수 있는 최고의 재산은 스스로 충만한 내면과 건강한 영혼의 명랑함입니다. 혼자 있는 고독을 평화로 누릴 줄 아는 사람만이 세상의 비바람에 휘둘리지 않습니다.',
    contemplativeCounsel: '타인의 인정과 박수에 목마르지 마십시오. 스스로의 양심과 지적 즐거움 속에서 조용한 자부심을 누릴 때 삶의 주인이 됩니다.',
  },
  {
    themeKey: 'PorcupineDilemma',
    themeTitleGerman: 'Das Gleichnis von den Stachelschweinen',
    themeTitleKo: '고슴도치의 지혜 (상처 주지 않고 온기를 나누는 거리)',
    philosophicalInsight: '추위를 피해 너무 바짝 다가서면 가시에 찔리고, 너무 멀어지면 얼어붙습니다. 서로의 경계를 존중하며 적절한 거리를 유지할 때 가장 건강하고 오래가는 온기가 유지됩니다.',
    contemplativeCounsel: '가까운 관계일수록 예의와 일정한 심리적 거리를 지키십시오. 지나친 집착과 간섭을 내려놓을 때 관계는 더욱 쾌적하고 돈독해집니다.',
  },
];

const SCHOPENHAUER_APHORISMS: SchopenhauerAphorism[] = [
  {
    aphorismKey: 'WhatYouHaveInYourself',
    aphorismKo: '인간의 행복은 무엇을 가졌는가가 아니라, 스스로 어떤 존재인가에 달려 있다',
    aphorismGerman: 'Was einer an sich selber hat, ist zu seinem Lebensglücke das Wesentlichste',
    wisdomDimension: '인격의 자족성과 내적 풍요',
    practicalAction: '외적인 치장보다 자신의 지성과 품성을 가꾸는 데 정성을 기울이십시오.',
  },
  {
    aphorismKey: 'SolitudeOrFreedom',
    aphorismKo: '고독을 사랑하지 않는 자는 자유를 사랑하지 않는 자다',
    aphorismGerman: 'Wer nicht die Einsamkeit liebt, der liebt auch nicht die Freiheit',
    wisdomDimension: '자기 성찰과 독립적인 사유',
    practicalAction: '혼자만의 시간을 외로움이 아닌 깊은 재충전과 창조적 자유의 시간으로 삼으십시오.',
  },
  {
    aphorismKey: 'MitleidOverJudgment',
    aphorismKo: '인간에 대한 진정한 처방은 심판이 아니라 연민(Mitleid)이다',
    aphorismGerman: 'Die Schranke zwischen Ich und Nicht-Ich wird im Mitleid aufgehoben',
    wisdomDimension: '보편적 공감과 자비심',
    practicalAction: '상대방의 입장에서 그의 결핍과 아픔을 먼저 헤아리는 따뜻한 태도를 취하십시오.',
  },
  {
    aphorismKey: 'CalmSoulMirror',
    aphorismKo: '마음의 호수가 고요할 때 비로소 우주의 참모습이 왜곡 없이 비친다',
    aphorismGerman: 'Nur im ruhigen Wasser spiegelt sich die Welt unverzerrt',
    wisdomDimension: '감정 조절과 내적 평정',
    practicalAction: '충동적인 분노나 조급함을 가라앉히고, 마음이 잔잔해진 뒤에 결정을 내리십시오.',
  },
];

export function calculateSchopenhauerWillRepresentation(profile: UserProfile): SchopenhauerWillRepresentationResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'SchopenhauerWillRepresentation';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const willTranscendenceClarityScore = 68 + (absHash % 31);
  const aestheticContemplationDepthScore = 67 + ((absHash >> 3) % 32);
  const mitleidUniversalCompassionScore = 69 + ((absHash >> 6) % 30);
  const innerHeiterkeitSerenityScore = 66 + ((absHash >> 9) % 33);
  const wiseRelationalDistanceScore = 70 + ((absHash >> 12) % 29);

  const themeIndex = (absHash >> 4) % SCHOPENHAUER_THEMES.length;
  const aphorismIndex = (absHash >> 7) % SCHOPENHAUER_APHORISMS.length;

  const activeSchopenhauerTheme = SCHOPENHAUER_THEMES[themeIndex];
  const focalPhilosophicalAphorism = SCHOPENHAUER_APHORISMS[aphorismIndex];

  const counselTitle = `쇼펜하우어 의지와 표상 철학: ${activeSchopenhauerTheme.themeTitleKo}`;
  const philosophicalGuidance = `아서 쇼펜하우어의 철학은 맹목적인 욕망의 쳇바퀴에서 벗어나 심미적 관조와 동포애적 자비심을 통해 삶의 참된 평정을 찾도록 돕습니다. ` +
    `현재 당신에게 필요한 지혜는 '${activeSchopenhauerTheme.themeTitleKo}'의 통찰과 직결되어 있습니다. ` +
    `${activeSchopenhauerTheme.contemplativeCounsel} 또한 쇼펜하우어의 아포리즘인 '${focalPhilosophicalAphorism.aphorismKo}'(${focalPhilosophicalAphorism.wisdomDimension})을 기억하여, ` +
    `${focalPhilosophicalAphorism.practicalAction}`;

  return {
    engineVersion: SCHOPENHAUER_WILL_REPRESENTATION_VERSION,
    calculatedAtKst: new Date().toISOString(),
    willTranscendenceClarityScore,
    aestheticContemplationDepthScore,
    mitleidUniversalCompassionScore,
    innerHeiterkeitSerenityScore,
    wiseRelationalDistanceScore,
    activeSchopenhauerTheme,
    focalPhilosophicalAphorism,
    schopenhauerPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatSchopenhauerWillRepresentationPrompt(res: SchopenhauerWillRepresentationResult): string {
  return [
    `【쇼펜하우어 의지와 표상(Wille und Vorstellung) & 자비(Mitleid) 지표】`,
    `- 맹목적 의지 초월 및 환상 직시도: ${res.willTranscendenceClarityScore}/100`,
    `- 심미적 관조(예술·음악) 몰입 지수: ${res.aestheticContemplationDepthScore}/100`,
    `- 동포애적 자비심(Mitleid) 공감도: ${res.mitleidUniversalCompassionScore}/100`,
    `- 내적 명랑 평정심(Heiterkeit): ${res.innerHeiterkeitSerenityScore}/100`,
    `- 고슴도치 딜레마 적정 거리 지혜도: ${res.wiseRelationalDistanceScore}/100`,
    `- 핵심 관조 테마: ${res.activeSchopenhauerTheme.themeTitleKo} [${res.activeSchopenhauerTheme.themeTitleGerman}]`,
    `- 철학적 통찰: ${res.activeSchopenhauerTheme.philosophicalInsight}`,
    `- 관조적 조언: ${res.activeSchopenhauerTheme.contemplativeCounsel}`,
    `- 핵심 아포리즘: "${res.focalPhilosophicalAphorism.aphorismKo}"`,
    `- 독일어 원문: "${res.focalPhilosophicalAphorism.aphorismGerman}" [${res.focalPhilosophicalAphorism.wisdomDimension}]`,
    `- 실천적 행동 지침: ${res.focalPhilosophicalAphorism.practicalAction}`,
    `- 통합 실존 처방: ${res.schopenhauerPersonalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
