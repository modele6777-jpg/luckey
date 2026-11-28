/**
 * 프랑스 마르셀 프루스트(Marcel Proust) 《잃어버린 시간을 찾아서》 비자발적 기억·되찾은 시간의 찬란한 진실·감각의 심층 복원과 내면 영원성 지혜 엔진
 *
 * 20세기 서구 문학사상 가장 심오한 의식의 탐구자 마르셀 프루스트(1871~1922)의 원전 기반:
 * 1. 비자발적 기억과 감각의 심층 복원도 (Involuntary Memory / Mémoire involontaire Depth Score): 마들렌 조각과 홍차의 향기처럼 억지스러운 기억이 아닌 살아있는 원초적 감각을 통해 온전한 과거의 진실을 되살려내는 힘.
 * 2. 되찾은 시간과 영원한 진실 통찰 지표 (Lost Time Regained / Le Temps retrouvé Wisdom Index): 덧없이 흘러가 버린 세월의 허무를 딛고 내면의 직관과 예술적 형상화를 통해 영원한 본질로 구원해 내는 지혜.
 * 3. 미세한 감각의 결을 포착하는 예술적 안목도 (Subtle Sensory Nuance & Aesthetic Sensitivity Score): 스완네 집 쪽의 꽃과 햇살처럼 일상의 평범한 순간들 속에 깃든 찬란하고 미묘한 아름다움을 알아채는 감수성.
 * 4. 허영과 관습을 벗겨낸 참된 자아 발견 지수 (Authentic Self-Discovery Beyond Social Vanity Index): 게르망트 공작 부인의 살롱 같은 세속의 헛된 사교와 인정 욕망을 벗어던지고 내면의 순수한 진실을 빚어내는 용기.
 * 5. 시간의 파도 속에서도 내면의 성전을 짓는 영원성 회복탄력성 (Time Transcendence & Inner Cathedral Resilience Score): 육체와 세월의 쇠락 앞에서도 흔들리지 않고 한 권의 책을 엮듯 내면의 불멸하는 성전을 완성해 가는 꿋꿋한 영혼의 힘.
 *
 * @version LUCKEY-PROUST-LOST-TIME-REGAINED-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_MARCEL_PROUST_LOST_TIME_VERSION = 'LUCKEY-PROUST-LOST-TIME-REGAINED-v2.5.0';

export interface ProustTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface ProustAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchMarcelProustLostTimeResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 프루스트 핵심 지표 (0~100)
  involuntaryMemoryDepthScore: number;                   // 비자발적 기억과 감각의 심층 복원도
  lostTimeRegainedWisdomIndex: number;                   // 되찾은 시간과 영원한 진실 통찰 지표
  subtleSensoryAestheticsScore: number;                  // 미세한 감각의 결을 포착하는 예술적 안목도
  authenticSelfDiscoveryIndex: number;                   // 허영을 벗겨낸 참된 자아 발견 지수
  timeTranscendenceResilienceScore: number;              // 시간 초월과 내면 성전 구축 회복탄력성
  // 세부 분석
  activeProustTheme: ProustTheme;
  focalProustAphorism: ProustAphorism;
  proustCrossAxis: string;
  proustSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  proustComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export type FrenchMarcelProustLostTimeRegainedResult = FrenchMarcelProustLostTimeResult;

export const PROUST_THEMES: ProustTheme[] = [
  {
    themeKey: 'madeleineInvoluntaryMemory',
    themeTitleEn: 'The Madeleine of Involuntary Memory: Awakening Sacred Truth through Living Senses',
    themeTitleKo: '마들렌과 비자발적 기억 — 메마른 관념 대신 살아 숨 쉬는 감각의 향기로 진실을 깨우기',
    literaryInsight: '어머니가 내민 홍차에 적신 마들렌 과자 한 조각을 입에 넣는 순간, 화자는 온몸을 관통하는 신비로운 전율을 느낍니다. 의지가 애써 떠올리려 했던 과거는 죽은 껍질이었으나, 무의식적 감각의 문이 열리자 콩브레의 정원과 마을 전체가 찻잔 속에서 꽃처럼 환하게 피어납니다.',
    practicalCounsel: '머리로만 쥐어짜는 조급한 계산과 논리에 갇히지 마십시오. 당신의 오감이 기억하는 순수한 기쁨, 자연의 향기, 진솔했던 순간들의 결을 되살릴 때, 막혔던 삶의 직관과 창의적 해법이 맑게 터져 나옵니다.',
  },
  {
    themeKey: 'timeRegainedArt',
    themeTitleEn: 'Time Regained through Art: Transmuting Fleeting Moments into Eternal Substance',
    themeTitleKo: '되찾은 시간 — 덧없이 흘러가는 세월을 예술과 사색을 통해 영원한 빛으로 승화하기',
    literaryInsight: '시간은 모든 것을 앗아가고 육체를 늙게 하지만, 참된 예술적 통찰은 잃어버렸던 시간을 영원한 현재로 구원해 냅니다. 진정한 삶, 마침내 발견되고 해명된 유일한 삶은 다름 아닌 문학과 예술, 곧 내면의 영적 직관 속에서 실현됩니다.',
    practicalCounsel: '지나간 세월이나 놓쳐버린 기회에 대한 헛된 후회에 잠기지 마십시오. 그 모든 아픔과 경험을 당신만의 깊이 있는 지혜와 창조적 작품, 삶의 이야기로 승화시킬 때 시간은 가장 찬란한 열매가 됩니다.',
  },
  {
    themeKey: 'trueVoyageOfDiscovery',
    themeTitleEn: 'The Only True Voyage of Discovery: Having New Eyes Rather Than Seeking New Landscapes',
    themeTitleKo: '진정한 발견의 여정 — 새로운 풍경을 찾는 것이 아니라 새로운 눈을 가지는 것',
    literaryInsight: '프루스트는 말합니다. "유일하게 참된 발견의 항해는 새로운 풍경을 찾아 헤매는 것이 아니라, 새로운 눈을 가지는 데 있다. 타인의 눈으로 우주를 바라보고, 백 개의 서로 다른 눈이 바라보는 백 개의 서로 다른 세계를 관조하는 것이다."',
    practicalCounsel: '외부 환경을 바꾸는 것에만 집착하지 말고, 세상을 바라보는 당신의 시선과 마음가짐을 혁신하십시오. 익숙한 일상과 주변 사람들을 맑고 새로운 눈으로 바라볼 때 이전에는 보지 못했던 거대한 보물이 드러납니다.',
  },
  {
    themeKey: 'innerCathedralBuilding',
    themeTitleEn: 'Building the Inner Cathedral: Steadfast Devotion to One\'s Lifework against Frailty',
    themeTitleKo: '내면의 성전 짓기 — 연약함과 고독 속에서도 흔들림 없이 생애의 과업을 완성하기',
    literaryInsight: '프루스트는 죽음을 앞둔 어두운 코르크 방 안에서, 기침과 천식의 고통 속에서도 거대한 고딕 성당을 짓듯 한 땀 한 땀 원고를 써 내려갔습니다. 세속의 헛된 사교계를 떠나 내면의 성전을 완성하는 헌신이야말로 영혼의 가장 고귀한 승리입니다.',
    practicalCounsel: '주변의 번잡한 유혹과 신체적 피로 앞에서도 당신만의 소중한 사명과 핵심 과업을 결코 놓지 마십시오. 매일 조금씩 쌓아 올리는 성실한 몰입이 영원히 무너지지 않는 당신만의 위대한 성전을 완성합니다.',
  },
];

export const PROUST_APHORISMS: ProustAphorism[] = [
  {
    aphorismKey: 'newEyesQuote',
    aphorismKo: '진정한 발견의 항해는 새로운 풍경을 찾아 헤매는 것이 아니라, 새로운 눈을 가지는 데 있다.',
    aphorismFrench: 'Le seul véritable voyage, le seul bain de Jouvence, ce ne serait pas d\'aller vers de nouveaux paysages, mais d\'avoir d\'autres yeux, de voir l\'univers avec les yeux d\'un autre, de cent autres, de voir les cent univers que chacun d\'eux voit, que chacun d\'eux est.',
    sourceContext: '《갇힌 여인(La Prisonnière)》 제5부',
    actionGuidance: '밖으로만 맴돌던 시선을 돌려, 익숙한 일상을 낯설고 새로운 경이로움의 눈으로 깊이 관찰하십시오.',
  },
  {
    aphorismKey: 'madeleineQuote',
    aphorismKo: '과거는 우리의 지성이 닿을 수 있는 영역 밖에, 숨겨진 어떤 물질적 대상 속에 깃들어 있다. 그 대상을 우연히 마주치게 될 때 비로소 과거는 살아 숨 쉬며 깨어난다.',
    aphorismFrench: 'Le passé est caché hors de son domaine et de sa portée, en quelque objet matériel que nous ne soupçonnons pas. Cet objet, il dépend du hasard que nous le rencontrions avant de mourir, ou que nous ne le rencontrions pas.',
    sourceContext: '《스완네 집 쪽으로(Du côté de chez Swann)》 제1부',
    actionGuidance: '머리의 강박을 내려놓고, 몸과 감각이 전해오는 원초적 신호와 직관의 문을 활짝 열어두십시오.',
  },
  {
    aphorismKey: 'trueLifeArtQuote',
    aphorismKo: '진정한 삶, 마침내 발견되고 해명된 유일한 삶, 그것은 바로 예술이다.',
    aphorismFrench: 'La vraie vie, la vie enfin découverte et éclaircie, la seule vie par conséquent réellement vécue, c\'est la littérature.',
    sourceContext: '《되찾은 시간(Le Temps retrouvé)》 제7부',
    actionGuidance: '일상의 스쳐 지나가는 사건들을 당신만의 고유한 의미와 통찰이 담긴 살아있는 이야기로 재창조하십시오.',
  },
  {
    aphorismKey: 'sufferingWisdomQuote',
    aphorismKo: '우리는 오직 고통을 통해서만 치유되며, 고통을 통해서만 지혜를 얻는다.',
    aphorismFrench: 'On ne guérit d\'une souffrance qu\'à condition de la vivre pleinement.',
    sourceContext: '《사라진 알베르틴(Albertine disparue)》 제6부',
    actionGuidance: '아픔과 상실을 억지로 억누르지 말고 충분히 마주하며 겪어내십시오. 깊은 슬픔을 통과할 때 영혼은 가장 단단한 지혜를 얻습니다.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function describeProustIntensity(score: number): string {
  if (score >= 95) return '매우 깊고 선명하게 깨어나는 감각의 공명';
  if (score >= 91) return '안정적으로 살아 숨 쉬며 기억을 밝히는 흐름';
  return '조용히 내면의 여백 속에서 숙성되는 국면';
}

export function calculateFrenchMarcelProustLostTimeRegained(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchMarcelProustLostTimeResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `PROUST-LOST-TIME-REGAINED:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const involuntaryMemoryDepthScore = 91 + ((absHash >> 1) % 8);
  const lostTimeRegainedWisdomIndex = 90 + ((absHash >> 4) % 9);
  const subtleSensoryAestheticsScore = 89 + ((absHash >> 7) % 10);
  const authenticSelfDiscoveryIndex = 88 + ((absHash >> 10) % 11);
  const timeTranscendenceResilienceScore = 90 + ((absHash >> 13) % 9);

  const themeIndex = (absHash >> 5) % PROUST_THEMES.length;
  const aphorismIndex = (absHash >> 8) % PROUST_APHORISMS.length;

  const activeProustTheme = PROUST_THEMES[themeIndex];
  const focalProustAphorism = PROUST_APHORISMS[aphorismIndex];

  const guidanceTitle = `마르셀 프루스트 잃어버린 시간의 회복과 감각의 진실: ${activeProustTheme.themeTitleKo}`;
  const philosophicalCounsel = `프랑스 문학의 정점이자 의식 탐구의 거장 마르셀 프루스트 선생은 대작 《잃어버린 시간을 찾아서》를 통해 ` +
    `마들렌 조각처럼 살아있는 원초적 감각으로 영혼의 진실을 깨우는 비자발적 기억, 세속의 덧없는 허영을 벗겨내고 발견하는 참된 자아, ` +
    `그리고 흘러가는 시간의 무상함을 딛고 예술과 사색을 통해 영원한 빛을 되찾는 '되찾은 시간(Le Temps retrouvé)'의 구원을 일깨웠습니다. ` +
    `지금 당신에게 가장 깊은 영감을 주는 사유의 등불은 '${activeProustTheme.themeTitleKo}'입니다. ` +
    `${activeProustTheme.practicalCounsel} 프루스트의 원전 명제 "${focalProustAphorism.aphorismKo}"을 마음에 새기고, ` +
    `${focalProustAphorism.actionGuidance}`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${kst.toISOString().slice(0, 10)}T${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')}:00+09:00 (KST)`;
  const qText = (query ?? '').trim();
  const reflectiveQuestion = qText
    ? `‘${qText}’ 속에서 스쳐 지나간 시간과 감각을 새로운 눈으로 다시 길어 올린다면 오늘 무엇이 보입니까?`
    : activeProustTheme.practicalCounsel;
  const kstHour = kst.getUTCHours();
  const kstWindow = kstHour < 6 ? '새벽 콩브레' : kstHour < 12 ? '오전 스완네' : kstHour < 18 ? '오후 발벡' : '저녁 코르크방';
  const proustCrossAxis = `[${activeProustTheme.themeKey}] × [${focalProustAphorism.aphorismKey}] × [${qText ? '질문공명' : '내면관조'}] × [${kstWindow}]`;
  const proustSynthesisMatrix = {
    coreInsight: activeProustTheme.themeTitleKo,
    recommendedAction: activeProustTheme.practicalCounsel,
    cautionNotice: '지나간 시간의 후회나 세속적 인정 욕망에 갇혀 지금 눈앞의 살아있는 감각과 시선을 놓치지 마십시오.',
  };

  return {
    engineVersion: FRENCH_MARCEL_PROUST_LOST_TIME_VERSION,
    calculatedAtKst: kstTimeLabel,
    involuntaryMemoryDepthScore,
    lostTimeRegainedWisdomIndex,
    subtleSensoryAestheticsScore,
    authenticSelfDiscoveryIndex,
    timeTranscendenceResilienceScore,
    activeProustTheme,
    focalProustAphorism,
    proustCrossAxis,
    proustSynthesisMatrix,
    proustComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    ritualAction: focalProustAphorism.actionGuidance,
    reflectionFocus: reflectiveQuestion,
    reflectiveQuestion,
    interpretiveBoundary: '프루스트의 비자발적 기억과 되찾은 시간 상징을 빌린 정성적 내면 성찰 관점이며, 개인 평가나 미래 단정이 아닙니다.',
  };
}

export function formatFrenchMarcelProustLostTimeRegainedPrompt(
  res: FrenchMarcelProustLostTimeResult,
): string {
  return [
    `【마르셀 프루스트 《잃어버린 시간을 찾아서》 비자발적 기억·되찾은 시간 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 비자발적 기억과 감각의 심층 복원도(Involuntary Memory Depth): ${describeProustIntensity(res.involuntaryMemoryDepthScore)}`,
    `- 되찾은 시간과 영원한 진실 통찰(Lost Time Regained Wisdom): ${describeProustIntensity(res.lostTimeRegainedWisdomIndex)}`,
    `- 미세 감각 포착과 예술적 안목도(Subtle Sensory Aesthetics): ${describeProustIntensity(res.subtleSensoryAestheticsScore)}`,
    `- 허영을 벗긴 참된 자아 발견 지수(Authentic Self-Discovery): ${describeProustIntensity(res.authenticSelfDiscoveryIndex)}`,
    `- 시간 초월과 내면 성전 구축 회복탄력성(Time Transcendence Resilience): ${describeProustIntensity(res.timeTranscendenceResilienceScore)}`,
    `- 핵심 프루스트 테마: ${res.activeProustTheme.themeTitleKo} [${res.activeProustTheme.themeTitleEn}]`,
    `- 문학적 사색: ${res.activeProustTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeProustTheme.practicalCounsel}`,
    `- 교차 매트릭스: 핵심(${res.proustSynthesisMatrix.coreInsight}) | 실행(${res.proustSynthesisMatrix.recommendedAction}) | 주의(${res.proustSynthesisMatrix.cautionNotice})`,
    `- 4중 교차 축: ${res.proustCrossAxis}`,
    `- 프루스트 원전 명제: "${res.focalProustAphorism.aphorismKo}"`,
    `- 원문: (${res.focalProustAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalProustAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalProustAphorism.actionGuidance}`,
    `- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`,
    `- 종합 프루스트 권면: ${res.proustComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: 프루스트의 비자발적 기억과 되찾은 시간 상징을 빌린 정성적 내면 성찰 관점이며, 개인 평가나 미래 단정이 아닙니다.`,
  ].join('\n');
}
