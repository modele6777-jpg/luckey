/**
 * 독일 아서 쇼펜하우어(Arthur Schopenhauer) 《의지와 표상으로서의 세계》 맹목적 의지 초월 & 심미적 관조·동포애 자비 엔진
 *
 * 19세기 독일 철학자 아서 쇼펜하우어(1788~1860)의 주저 《의지와 표상으로서의 세계(Die Welt als Wille und Vorstellung)》 및 《인생론(Aphorismen zur Lebensweisheit)》 원전 기반:
 * 1. 표상으로서의 세계와 맹목적 생의 의지(Wille zum Leben) 직시
 * 2. 예술·음악 심미적 관조(Ästhetische Betrachtung)
 * 3. 동포애와 보편적 자비(Mitleid) · 고슴도치 딜레마(Stachelschweine)
 * 4. 질문 맥락 의지-관조 감사(situationalWillAudit) + KST 시공간 리듬(temporalContemplationRhythm) + 교차 검증 매트릭스(schopenhauerSynthesisMatrix)
 *
 * @version LUCKEY-SCHOPENHAUER-WILL-REPRESENTATION-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const SCHOPENHAUER_WILL_REPRESENTATION_VERSION = 'LUCKEY-SCHOPENHAUER-WILL-REPRESENTATION-v2.5.0';

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

export interface SchopenhauerSituationalWillAudit {
  contemplativeLens: '의지 직시(Wille)' | '심미적 관조(Ästhetik)' | '동포애 자비(Mitleid)' | '적정 거리(Stachelschweine)';
  focusAxisKo: string;
  classicalCitation: string;
  detachmentDirective: string;
  reflectiveQuestion: string;
}

export interface SchopenhauerTemporalContemplationRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  heiterkeitSerenityIndex: number;
  dailyContemplationPractice: string;
}

export interface SchopenhauerSynthesisMatrix {
  willLucidity: number;
  aestheticStillness: number;
  mitleidCompassion: number;
  overallSchopenhauerGrade: string;
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
  situationalWillAudit: SchopenhauerSituationalWillAudit;
  temporalContemplationRhythm: SchopenhauerTemporalContemplationRhythm;
  schopenhauerSynthesisMatrix: SchopenhauerSynthesisMatrix;
  schopenhauerCrossAxis: string;
  schopenhauerPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
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

function buildSituationalWillAudit(question: string, absHash: number): SchopenhauerSituationalWillAudit {
  const q = question.trim();
  if (/관계|거리|상처|갈등|가까|연인|가족|친구/.test(q)) {
    return {
      contemplativeLens: '적정 거리(Stachelschweine)',
      focusAxisKo: '고슴도치 딜레마: 찌르지 않고 온기를 지키는 예의의 거리',
      classicalCitation: '《소품과 부록》 §396: "고슴도치들은 서로의 가시에 찔리지 않으면서 추위를 견딜 수 있는 알맞은 거리를 배웠다."',
      detachmentDirective: '너무 바짝 파고들어 상처 주지도, 차갑게 등 돌리지도 말고 서로 숨 쉴 수 있는 건강한 간격을 회복하십시오.',
      reflectiveQuestion: '지금 이 관계에서 조금 한 걸음 물러서면 오히려 편안해질 경계는 어디입니까?',
    };
  }
  if (/욕심|집착|결핍|비교|돈|성공|권태|초조/.test(q)) {
    return {
      contemplativeLens: '의지 직시(Wille)',
      focusAxisKo: '채워지지 않는 욕망의 시계추 멈추기',
      classicalCitation: '《의지와 표상으로서의 세계》 §57: "인생은 고통과 권태 사이를 왕복하는 시계추다."',
      detachmentDirective: '무엇을 더 가져야만 안심할 수 있다는 갈증을 멈추고, 이미 내 안에 있는 정신적 자족을 먼저 확인하십시오.',
      reflectiveQuestion: '지금 나를 몰아세우는 갈증이 정말 생존의 필요인지, 아니면 남과 비교하는 맹목적 의지인지 구분해 보셨습니까?',
    };
  }
  if (/지치|불안|음악|예술|휴식|감정|머리아/.test(q)) {
    return {
      contemplativeLens: '심미적 관조(Ästhetik)',
      focusAxisKo: '이해관계를 벗어난 순수 관조와 플루트 같은 명랑함',
      classicalCitation: '《의지와 표상으로서의 세계》 §34: "순수 인식의 주체가 될 때 의지의 폭풍은 잠시 멎는다."',
      detachmentDirective: '계산과 걱정의 스위치를 잠시 끄고, 음악·자연·독서 같은 순수 관조의 시간에 영혼을 쉬게 하십시오.',
      reflectiveQuestion: '아무런 목적이나 성과 없이 그 자체로 내 마음을 고요하게 해 주는 시간은 언제입니까?',
    };
  }
  if (/미움|용서|원망|화|실망|타인/.test(q)) {
    return {
      contemplativeLens: '동포애 자비(Mitleid)',
      focusAxisKo: '심판 대신 \'함께 고뇌하는 벗\'으로 바라보는 연민',
      classicalCitation: '《도덕의 기초에 대하여》 §16: "진정한 도덕적 가치는 오직 타인의 고통에 대한 연민(Mitleid)에서만 솟아난다."',
      detachmentDirective: '상대의 거친 태도 뒤에 숨은 두려움과 결핍을 한 번만 헤아려 보며 마음의 적개심을 누그러뜨리십시오.',
      reflectiveQuestion: '상대를 심판하기 전에 \'저 사람도 자기만의 무게를 견디고 있구나\'라고 본다면 감정이 어떻게 변합니까?',
    };
  }

  const lenses: Array<'의지 직시(Wille)' | '심미적 관조(Ästhetik)' | '동포애 자비(Mitleid)' | '적정 거리(Stachelschweine)'> = [
    '의지 직시(Wille)',
    '심미적 관조(Ästhetik)',
    '동포애 자비(Mitleid)',
    '적정 거리(Stachelschweine)',
  ];
  return {
    contemplativeLens: lenses[absHash % lenses.length],
    focusAxisKo: '외물의 동요를 잠재우는 내면의 명랑함(Heiterkeit)',
    classicalCitation: '《인생론》: "자신 안에 풍요로운 내면을 지닌 사람은 바깥에서 구걸하지 않는다."',
    detachmentDirective: '바깥의 소란에 마음을 내주지 말고, 나만의 고독하고 맑은 중심을 먼저 세우십시오.',
    reflectiveQuestion: '외부의 인정이나 결과가 없더라도 내 안의 평정을 지킬 수 있는 나만의 안식처는 무엇입니까?',
  };
}

function buildTemporalContemplationRhythm(now: Date, baseScore: number): SchopenhauerTemporalContemplationRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  const seasonKo = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 발아기(관조의 눈뜸)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '하계 팽창기(의지의 절제)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '추계 숙성기(고독의 명랑)'
        : '동계 침잠기(적정 온기의 거리)';

  let timeWindowKo = '오후의 적정 거리 조율';
  let hourBonus = 0;
  let dailyContemplationPractice = '관계와 일에서 과한 개입을 한 걸음 줄이고 마음의 호수를 잔잔히 유지하십시오.';

  if (kstHour >= 5 && kstHour < 10) {
    timeWindowKo = '새벽의 순수 인식(맑은 아침 사유)';
    hourBonus = 6;
    dailyContemplationPractice = '아침의 가장 맑은 정신으로 헛된 걱정을 가라앉히고 본질적인 사유에 집중하십시오.';
  } else if (kstHour >= 10 && kstHour < 15) {
    timeWindowKo = '오전의 의지 절제와 연민 실천';
    hourBonus = 4;
    dailyContemplationPractice = '바쁜 일과 속에서도 조급함을 내려놓고 주변 사람에게 부드러운 연민을 건네십시오.';
  } else if (kstHour >= 15 && kstHour < 20) {
    timeWindowKo = '오후의 심미적 관조(음악과 휴식)';
    hourBonus = 5;
    dailyContemplationPractice = '하루의 피로가 몰려올 때 음악이나 산책으로 욕망의 긴장을 부드럽게 풀어주십시오.';
  } else {
    timeWindowKo = '밤의 고독과 내면 명랑(Heiterkeit)';
    hourBonus = 4;
    dailyContemplationPractice = '혼자만의 고요한 시간을 외로움이 아닌 자유의 공간으로 누리며 하루를 갈무리하십시오.';
  }

  return {
    kstHour,
    timeWindowKo,
    seasonKo,
    heiterkeitSerenityIndex: Math.min(100, Math.round(baseScore + hourBonus)),
    dailyContemplationPractice,
  };
}

export function calculateSchopenhauerWillRepresentation(
  profile: UserProfile,
  question = '',
  now: Date = new Date()
): SchopenhauerWillRepresentationResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    question.trim() +
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
  const situationalWillAudit = buildSituationalWillAudit(question, absHash);
  const temporalContemplationRhythm = buildTemporalContemplationRhythm(now, innerHeiterkeitSerenityScore);

  const avgScore = Math.round(
    (willTranscendenceClarityScore + aestheticContemplationDepthScore + mitleidUniversalCompassionScore) / 3
  );
  const schopenhauerSynthesisMatrix: SchopenhauerSynthesisMatrix = {
    willLucidity: willTranscendenceClarityScore,
    aestheticStillness: aestheticContemplationDepthScore,
    mitleidCompassion: mitleidUniversalCompassionScore,
    overallSchopenhauerGrade: avgScore >= 88
      ? '순수 관조와 명랑의 경지(Heiterkeit)'
      : avgScore >= 78
        ? '욕망 초월과 연민 조화(Mitleid Harmony)'
        : '의지의 성찰적 절제(Will Lucidity)',
  };

  const counselTitle = `쇼펜하우어 의지와 표상 철학: ${activeSchopenhauerTheme.themeTitleKo}`;
  const philosophicalGuidance = `아서 쇼펜하우어의 철학은 맹목적인 욕망의 쳇바퀴에서 벗어나 심미적 관조와 동포애적 자비심을 통해 삶의 참된 평정을 찾도록 돕습니다. ` +
    `현재 질문은 [${situationalWillAudit.contemplativeLens}]의 '${situationalWillAudit.focusAxisKo}'와 맞닿아 있습니다. ` +
    `${situationalWillAudit.detachmentDirective} 또한 '${focalPhilosophicalAphorism.aphorismKo}'(${focalPhilosophicalAphorism.wisdomDimension})을 기억하며 ` +
    `${temporalContemplationRhythm.dailyContemplationPractice}`;

  const calculatedAtKst = `${new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00 (KST)`;
  const schopenhauerCrossAxis = `[${situationalWillAudit.contemplativeLens}] × [${activeSchopenhauerTheme.themeTitleKo.split('(')[0].trim()}] × [${schopenhauerSynthesisMatrix.overallSchopenhauerGrade}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: SCHOPENHAUER_WILL_REPRESENTATION_VERSION,
    calculatedAtKst,
    willTranscendenceClarityScore,
    aestheticContemplationDepthScore,
    mitleidUniversalCompassionScore,
    innerHeiterkeitSerenityScore,
    wiseRelationalDistanceScore,
    activeSchopenhauerTheme,
    focalPhilosophicalAphorism,
    situationalWillAudit,
    temporalContemplationRhythm,
    schopenhauerSynthesisMatrix,
    schopenhauerCrossAxis,
    schopenhauerPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    ritualAction: temporalContemplationRhythm.dailyContemplationPractice,
    reflectionFocus: situationalWillAudit.reflectiveQuestion,
    interpretiveBoundary: '이 관조는 확정 예언이 아니라 욕망의 소란을 한 걸음 비켜서서 바라보기 위한 철학적 상징 프레임입니다.',
  };
}

function describeSchopenhauerStage(score: number): string {
  if (score >= 88) return '깊이 열려 고요히 빛남';
  if (score >= 78) return '안정적으로 자리를 잡음';
  return '성찰과 거리 두기의 여백이 필요함';
}

export function formatSchopenhauerWillRepresentationPrompt(res: SchopenhauerWillRepresentationResult): string {
  return [
    `【쇼펜하우어 의지와 표상(Wille und Vorstellung) & 자비(Mitleid) 정성 관조 v2.1】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 맹목적 의지 초월 및 환상 직시: ${describeSchopenhauerStage(res.willTranscendenceClarityScore)}`,
    `- 심미적 관조(예술·음악) 몰입: ${describeSchopenhauerStage(res.aestheticContemplationDepthScore)}`,
    `- 동포애적 자비심(Mitleid) 공감: ${describeSchopenhauerStage(res.mitleidUniversalCompassionScore)}`,
    `- 내적 명랑 평정심(Heiterkeit): ${describeSchopenhauerStage(res.innerHeiterkeitSerenityScore)}`,
    `- 고슴도치 딜레마 적정 거리 지혜: ${describeSchopenhauerStage(res.wiseRelationalDistanceScore)}`,
    `- 질문 맥락 관조 렌즈: [${res.situationalWillAudit.contemplativeLens}] ${res.situationalWillAudit.focusAxisKo}`,
    `- 원전 처방: ${res.situationalWillAudit.classicalCitation} → ${res.situationalWillAudit.detachmentDirective}`,
    `- 성찰 질문: ${res.situationalWillAudit.reflectiveQuestion}`,
    `- KST 시공간 리듬: ${res.temporalContemplationRhythm.timeWindowKo} (${res.temporalContemplationRhythm.seasonKo}, ${describeSchopenhauerStage(res.temporalContemplationRhythm.heiterkeitSerenityIndex)}) — ${res.temporalContemplationRhythm.dailyContemplationPractice}`,
    `- 종합 경지: ${res.schopenhauerSynthesisMatrix.overallSchopenhauerGrade}`,
    `- 4중 교차 축: ${res.schopenhauerCrossAxis}`,
    `- 핵심 관조 테마: ${res.activeSchopenhauerTheme.themeTitleKo} [${res.activeSchopenhauerTheme.themeTitleGerman}]`,
    `- 핵심 아포리즘: "${res.focalPhilosophicalAphorism.aphorismKo}" ("${res.focalPhilosophicalAphorism.aphorismGerman}")`,
    `- 통합 실존 처방: ${res.schopenhauerPersonalCounsel.philosophicalGuidance}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 해석 경계: 이 관조는 확정 예언이 아니라 욕망의 소란을 한 걸음 비켜서서 바라보기 위한 철학적 상징 프레임입니다.`,
  ].join('\n');
}
