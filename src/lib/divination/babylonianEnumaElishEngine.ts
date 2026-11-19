/**
 * =========================================================================
 * LUCKEY 고대 바빌로니아 에누마 엘리쉬 & 운명의 서판 천체 엔진
 * (Babylonian Enuma Elish & Tablets of Destiny Celestial Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 기원전 메소포타미아 바빌로니아 창조 대서사시 《에누마 엘리쉬(Enûma Eliš)》와
 * 천문 점성 기록인 《물.아핀(MUL.APIN)》 정통 원전.
 * 
 * 1. 운명의 서판 (Tablets of Destiny / Tup Shimati):
 *    - 우주의 모든 신들과 인간의 운명을 확정하고 지배하는 절대적 권능의 서판.
 *    - 혼돈의 심연 티아마트(Tiamat)를 극복하고 우주의 황도 질서를 세운 마르두크(Marduk)의
 *      영적 주권(Spiritual Sovereignty)과 영혼의 개척자적 카리스마 산출.
 * 2. 바빌로니아 천상 주재신 매핑 (Celestial Deities):
 *    - 마르두크(목성), 에아(지혜), 이슈타르(금성), 샤마쉬(태양), 신(달), 나부(수성).
 * 3. 질문 맥락 서판 감사·KST 바빌론 천체 시공간 리듬·교차 매트릭스 산출
 */

import type { UserProfile } from '../sharedState';

export const BABYLONIAN_ENUMA_ELISH_VERSION = 'LUCKEY-BABYLONIAN-ENUMA-ELISH-v2.4.0';

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

export type BabylonianQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface BabylonianPatronDeity {
  cuneiformName: string;
  koreanName: string;
  celestialDomain: string;
  divineAttribute: string;
  sacredCommandment: string;
}

export interface TabletsOfDestinyEdict {
  destinyEdictTitle: string;
  soulSovereigntyScore: number;     // 내부 참조용
  sovereigntyPosture: string;
  chaosOvercomingPower: string;
  cosmicOrderVirtue: string;
}

export interface BabylonianSituationalAudit {
  contextTheme: string;
  enumaElishTablet: string;
  chaosVsCosmosDiagnosis: string;
  sovereignPrescription: string;
}

export interface BabylonianTemporalRhythm {
  kstHour: number;
  zigguratWatchWindow: string;
  mulApinSeasonalCycle: string;
  cosmicOrderIndex: number;
  timingAdvice: string;
}

export interface BabylonianSynthesisMatrix {
  deityAxis: string;
  edictAxis: string;
  temporalAxis: string;
  synthesizedVerdict: string;
}

export interface BabylonianEnumaElishReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTheme: BabylonianQuestionTheme;
  patronDeity: BabylonianPatronDeity;
  destinyEdict: TabletsOfDestinyEdict;
  orderingIndex: number;            // 내부 참조용
  orderingPosture: string;
  cuneiformWisdomOmen: string;
  synthesisMessage: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  situationalBabylonAudit: BabylonianSituationalAudit;
  temporalBabylonRhythm: BabylonianTemporalRhythm;
  babylonSynthesisMatrix: BabylonianSynthesisMatrix;
}

const BABYLONIAN_DEITIES: BabylonianPatronDeity[] = [
  {
    cuneiformName: '마르두크 (Marduk)',
    koreanName: '빛과 정의의 주권자 마르두크',
    celestialDomain: '목성(Nibiru) / 최고 천상 질서',
    divineAttribute: '혼돈을 정돈하고 사방의 방위를 세우며 운명의 서판을 쥐는 절대적 통치력과 개척력',
    sacredCommandment: '두려움 없이 혼돈의 바다를 가르고, 네 뜻으로 새로운 시대를 개창하라.',
  },
  {
    cuneiformName: '에아 / 엔키 (Ea / Enki)',
    koreanName: '심연의 지혜와 마법의 신 에아',
    celestialDomain: '담수의 심연 아프수(Apsu) / 영적 직관',
    divineAttribute: '모든 비밀스러운 지식의 원천, 지혜와 자비로 위기를 모면하게 하는 책략과 치유',
    sacredCommandment: '칼보다 날카로운 지혜로 매듭을 풀고, 심연의 고요에서 영감을 길어올려라.',
  },
  {
    cuneiformName: '이슈타르 (Inanna / Ishtar)',
    koreanName: '새벽별과 사랑의 여신 이슈타르',
    celestialDomain: '금성(Dilbat) / 열정과 승리',
    divineAttribute: '지하세계를 정복하고 부활하는 불굴의 생명력, 강력한 매혹과 전사의 불꽃',
    sacredCommandment: '어떤 지하세계의 관문 앞에서도 굴복하지 말고, 너 자신의 아름다움과 힘을 당당히 떨쳐라.',
  },
  {
    cuneiformName: '샤마쉬 (Utu / Shamash)',
    koreanName: '정의와 진실의 태양신 샤마쉬',
    celestialDomain: '태양(Shamash) / 공의와 명료함',
    divineAttribute: '어둠 속에 감춰진 거짓과 부정을 백일하에 드러내고 바른 길을 비추는 공평무사한 빛',
    sacredCommandment: '언제나 떳떳하고 정직한 길을 걸을 때, 온 우주의 태양빛이 네 방패가 되리라.',
  },
  {
    cuneiformName: '신 (Nanna / Sin)',
    koreanName: '시간과 지혜의 달빛신 신',
    celestialDomain: '달(Sin) / 주기와 영적 통찰',
    divineAttribute: '차오르고 기우는 천체 주기를 관장하며 은밀한 통찰과 직관적 영감을 부여함',
    sacredCommandment: '서두르지 말고 달의 차고 기울어짐처럼 때를 기다리며 내면의 빛을 채워라.',
  },
  {
    cuneiformName: '나부 (Nabu)',
    koreanName: '기록과 지혜의 서기신 나부',
    celestialDomain: '수성 / 지성과 계약',
    divineAttribute: '운명의 서판에 글을 새기는 예리한 서기, 학습과 소통, 계약과 학문의 성취',
    sacredCommandment: '말과 글에 진실의 힘을 담아라. 네가 기록한 신념이 네 운명의 청사진이 된다.',
  },
];

function classifyBabylonianTheme(question?: string): BabylonianQuestionTheme {
  const q = (question || '').toLowerCase();
  if (/관계|연애|사랑|사람|가족|친구|이별|갈등|소통/.test(q)) return 'relationship';
  if (/선택|결정|진로|이직|사업|일|직장|시험|투자|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|회복|치유|휴식|건강|마음|위로/.test(q)) return 'healing';
  return 'reflection';
}

function buildSituationalAudit(
  theme: BabylonianQuestionTheme,
  deity: BabylonianPatronDeity,
  edictTitle: string,
): BabylonianSituationalAudit {
  if (theme === 'relationship') {
    return {
      contextTheme: '관계 경계·언약 서판 감사',
      enumaElishTablet: '《에누마 엘리쉬》 제6서판 — 신들의 직무와 경계를 분명히 정해 화평을 세움',
      chaosVsCosmosDiagnosis: `모호한 기대와 말하지 않은 서운함이 혼돈(Tiamat)을 키우는 상태입니다. '${deity.koreanName}'의 질서로 경계를 세우십시오.`,
      sovereignPrescription: '상대에게 바라는 점과 내가 감당할 수 있는 선을 정중하지만 분명한 언어로 합의하십시오.',
    };
  }
  if (theme === 'decision') {
    return {
      contextTheme: '운명의 서판(Tup Shimati) 결단 감사',
      enumaElishTablet: '《에누마 엘리쉬》 제4서판 — 마르두크가 별자리와 방위를 확정하여 혼돈을 가름',
      chaosVsCosmosDiagnosis: `여러 선택지가 얽혀 중심이 흔들리는 국면입니다. '${edictTitle}'의 칙령으로 우선순위를 갈라내십시오.`,
      sovereignPrescription: '불확실한 가정을 덜어내고 내가 직접 책임지고 통제할 수 있는 선택지 하나를 확정하십시오.',
    };
  }
  if (theme === 'healing') {
    return {
      contextTheme: '아프수(Apsu) 심연 정화·회복 감사',
      enumaElishTablet: '《에누마 엘리쉬》 제1서판 — 에아가 고요한 담수의 심연 위에서 평온을 회복함',
      chaosVsCosmosDiagnosis: `외부 압박으로 내면의 방위가 흔들린 상태입니다. 지금은 싸움이 아니라 '${deity.koreanName}'의 품에서 숨을 고를 때입니다.`,
      sovereignPrescription: '새로운 전선을 열지 말고 수면과 공간 정리부터 시작해 내면의 질서를 먼저 회복하십시오.',
    };
  }
  return {
    contextTheme: '천체 질서·자기 주권 감사',
    enumaElishTablet: '《MUL.APIN》 천문서 — 하늘의 별자리 주기를 따라 지상의 질서를 바로잡음',
    chaosVsCosmosDiagnosis: `일상의 루틴과 원칙을 점검해 자기 주권을 다질 시점입니다. '${deity.koreanName}'의 기운이 중심을 잡아줍니다.`,
    sovereignPrescription: deity.sacredCommandment,
  };
}

function buildTemporalRhythm(now: Date, seed: number): BabylonianTemporalRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  let zigguratWatchWindow = '샤마쉬 백주 공의 관측 창 (오전~오후)';
  let timingAdvice = '태양 아래 모든 사실이 명료히 드러나는 때이므로 정직하고 단호하게 결단하십시오.';
  if (kstHour >= 4 && kstHour < 10) {
    zigguratWatchWindow = '이슈타르 새벽별 개창 창 (이른 아침)';
    timingAdvice = '동트는 별빛 아래 오늘 하루 세울 핵심 질서(칙령) 한 가지를 먼저 선언하십시오.';
  } else if (kstHour >= 18 && kstHour < 22) {
    zigguratWatchWindow = '지구라트 황혼 성좌 기록 창 (저녁)';
    timingAdvice = '나부의 서기처럼 오늘의 혼돈을 가라앉히고 남길 기록과 내려놓을 짐을 분류하십시오.';
  } else if (kstHour >= 22 || kstHour < 4) {
    zigguratWatchWindow = '신(Sin) 달빛 심야 관조 창 (밤~새벽)';
    timingAdvice = '밤의 성급한 판단을 피하고 달빛처럼 고요히 내면의 힘을 비축하십시오.';
  }

  let mulApinSeasonalCycle = '바빌론 12궁 황도 순환';
  if (month >= 3 && month <= 5) mulApinSeasonalCycle = '아키투(Akitu) 춘분 신년제 — 새 질서와 서판 갱신의 계절';
  else if (month >= 6 && month <= 8) mulApinSeasonalCycle = '샤마쉬 하지 정점기 — 열정과 추진력의 극대화 계절';
  else if (month >= 9 && month <= 11) mulApinSeasonalCycle = '타쉬리투(Tashritu) 추분 균형기 — 계약과 공정한 수확의 계절';
  else mulApinSeasonalCycle = '아프수(Apsu) 동지 심연기 — 내실 정돈과 지혜 축적의 계절';

  const cosmicOrderIndex = 65 + ((seed + kstHour * 5 + month * 3) % 34);

  return {
    kstHour,
    zigguratWatchWindow,
    mulApinSeasonalCycle,
    cosmicOrderIndex,
    timingAdvice,
  };
}

function buildSynthesisMatrix(
  deity: BabylonianPatronDeity,
  edict: TabletsOfDestinyEdict,
  audit: BabylonianSituationalAudit,
  temporal: BabylonianTemporalRhythm,
): BabylonianSynthesisMatrix {
  const deityAxis = `수호 천체: ${deity.koreanName} (${audit.contextTheme})`;
  const edictAxis = `서판 칙령: ${edict.destinyEdictTitle}`;
  const temporalAxis = `지구라트 시의: ${temporal.zigguratWatchWindow} · ${temporal.mulApinSeasonalCycle}`;
  const synthesizedVerdict = `'${temporal.zigguratWatchWindow}'의 천체 흐름 아래 '${deity.koreanName}'의 질서로 '${edict.destinyEdictTitle}'을 실행할 때, 혼돈은 명료한 구조로 정돈됩니다.`;

  return {
    deityAxis,
    edictAxis,
    temporalAxis,
    synthesizedVerdict,
  };
}

export function calculateBabylonianEnumaElish(
  profile?: UserProfile,
  nowArg?: Date,
  questionArg?: string
): BabylonianEnumaElishReport {
  const now = nowArg ?? new Date();
  const question = (questionArg || '').trim();
  const questionTheme = classifyBabylonianTheme(question);
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Marduk';

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 19 + nameStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) & 0x7fffffff;

  const deityIdx = (seed + now.getUTCMonth()) % BABYLONIAN_DEITIES.length;
  const patronDeity = BABYLONIAN_DEITIES[deityIdx];

  const soulSovereigntyScore = 75 + ((seed * 7 + now.getUTCDate() * 3) % 24);
  const orderingIndex = 72 + ((seed * 11 + now.getUTCHours() * 5) % 27);

  const sovereigntyPosture = soulSovereigntyScore >= 90
    ? '흔들리지 않는 자기 주권으로 새로운 질서를 선언하는 창조 국면'
    : soulSovereigntyScore >= 82
      ? '내면의 중심을 단단히 세우고 우선순위를 정리하는 정돈 국면'
      : '외부의 소음을 가라앉히며 자기 기준을 다시 점검하는 재정비 국면';

  const orderingPosture = orderingIndex >= 88
    ? '복잡하게 얽힌 실타래가 명쾌한 구조로 풀려 나가는 명료 국면'
    : '작은 질서 하나를 세우는 것으로 전체 흐름이 안정되는 전환 국면';

  const edicts = [
    { title: '우주적 질서의 재건 (Establishment of Cosmic Order)', power: '어지러운 환경과 대인관계의 잡음을 일거에 정리하고 확고한 중심을 세움', virtue: '단호한 결단력과 주도성' },
    { title: '지혜로운 통찰의 승한 (Ascension of Sacred Wisdom)', power: '복잡한 문제의 숨은 본질을 즉시 파악하고 최선의 해법을 도출함', virtue: '유연한 직관과 통찰력' },
    { title: '불굴의 회복탄력성과 승리 (Unshakable Resilience & Victory)', power: '어떤 시련이나 정체 상태에서도 한 단계 더 높이 도약하는 강력한 생명력', virtue: '전사의 용기와 열정' },
    { title: '정의로운 풍요의 결실 (Fruit of Righteous Abundance)', power: '공정하고 성실한 노력이 흔들림 없는 경제적·사회적 결실로 귀결됨', virtue: '성실함과 확고한 신뢰' },
  ];
  const edictIdx = (seed + now.getUTCDate()) % edicts.length;
  const chosenEdict = edicts[edictIdx];

  const destinyEdict: TabletsOfDestinyEdict = {
    destinyEdictTitle: chosenEdict.title,
    soulSovereigntyScore,
    sovereigntyPosture,
    chaosOvercomingPower: chosenEdict.power,
    cosmicOrderVirtue: chosenEdict.virtue,
  };

  const situationalBabylonAudit = buildSituationalAudit(questionTheme, patronDeity, chosenEdict.title);
  const temporalBabylonRhythm = buildTemporalRhythm(now, seed);
  const babylonSynthesisMatrix = buildSynthesisMatrix(patronDeity, destinyEdict, situationalBabylonAudit, temporalBabylonRhythm);

  const themeGuidanceMap: Record<BabylonianQuestionTheme, { practice: string; ritual: string; reflection: string }> = {
    relationship: {
      practice: `${patronDeity.koreanName}의 질서처럼, 관계의 모호한 경계를 솔직하고 정중한 언어로 분명히 정리해 보세요.`,
      ritual: '상대에게 바라는 핵심 한 가지만 간결하고 따뜻하게 정리해 전달하기',
      reflection: '이 관계에서 내가 주도적으로 바로잡아야 할 약속이나 경계는 무엇인가요?',
    },
    decision: {
      practice: `${chosenEdict.virtue}을 기준으로 삼아, 혼돈을 키우는 변수는 쳐내고 가장 단순한 원칙부터 실행하세요.`,
      ritual: '오늘 결정할 사안의 필수 조건 3가지를 종이에 적어 우선순위 번호를 매기기',
      reflection: '지금 내 선택을 흐리게 만드는 주변의 소음과 진짜 핵심은 각각 무엇인가요?',
    },
    healing: {
      practice: `혼돈을 억지로 통제하려 애쓰기보다, 에아(Ea)의 심연처럼 고요한 휴식 속에서 내면의 질서를 먼저 회복하세요.`,
      ritual: '책상이나 주변 공간 한 곳을 5분만 깔끔하게 정돈하며 마음의 쉼표 찍기',
      reflection: '내 에너지가 흩어지지 않도록 지금 당장 내려놓아도 좋은 일 하나는 무엇인가요?',
    },
    reflection: {
      practice: `${patronDeity.sacredCommandment} 작은 일상의 질서를 세우는 것이 곧 큰 흐름을 여는 시작입니다.`,
      ritual: '오늘 하루 내가 지키고 싶은 나만의 원칙 한 줄을 적어 눈에 잘 보이는 곳에 두기',
      reflection: '내가 나 자신의 운명의 서판에 가장 먼저 새기고 싶은 태도는 무엇인가요?',
    },
  };
  const themed = themeGuidanceMap[questionTheme];

  const cuneiformWisdomOmen = `바빌로니아 운명의 서판에는 당신의 이름 곁에 "${chosenEdict.virtue}"의 신성한 인장이 찍혀 있습니다. [${patronDeity.koreanName}]의 가호 아래 현실의 혼돈을 명쾌한 질서로 전환하세요.`;

  const synthesisMessage = `에누마 엘리쉬 창조 서사시의 원전에 따라, [${patronDeity.koreanName}]의 상징 아래 ${sovereigntyPosture}에 놓여 있습니다. "${patronDeity.sacredCommandment}"`;

  const boundaryNotice = '고대 바빌로니아 에누마 엘리쉬 서사시의 질서·창조 상징을 활용한 성찰적 관점이며, 확정적 예언이나 의학적·재정적 판단을 대신하지 않습니다.';
  const reflectiveQuestion = question
    ? `"${question}" 앞에서 ${patronDeity.koreanName}의 질서로 가장 먼저 가닥을 잡아야 할 한 가지는 무엇인가요?`
    : themed.reflection;

  return {
    engineVersion: BABYLONIAN_ENUMA_ELISH_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: toKstIso(now),
    questionTheme,
    patronDeity,
    destinyEdict,
    orderingIndex,
    orderingPosture,
    cuneiformWisdomOmen,
    synthesisMessage,
    practiceGuidance: themed.practice,
    ritualAction: themed.ritual,
    reflectionFocus: themed.reflection,
    reflectiveQuestion,
    counselNote: `[에누마 엘리쉬 성찰] ${patronDeity.koreanName} · ${chosenEdict.title} — ${themed.practice}`,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    situationalBabylonAudit,
    temporalBabylonRhythm,
    babylonSynthesisMatrix,
  };
}

export function formatBabylonianEnumaElishPrompt(report: BabylonianEnumaElishReport): string {
  return `### 🏛️ 고대 바빌로니아 에누마 엘리쉬 & 운명의 서판 성찰 관점 (${BABYLONIAN_ENUMA_ELISH_VERSION})
- **연산 시각**: ${report.calculatedAtKst}
- **질문 맥락**: ${report.questionTheme} | **질서화 국면**: ${report.orderingPosture}
- **바빌로니아 수호신**: **${report.patronDeity.koreanName}** [천체: ${report.patronDeity.celestialDomain}]
  - 신성한 권능: ${report.patronDeity.divineAttribute}
  - 운명의 서판 신탁: "${report.patronDeity.sacredCommandment}"
- **운명의 서판(Tup Shimati) 칙령 (${report.destinyEdict.sovereigntyPosture})**:
  - 칙령 명칭: ${report.destinyEdict.destinyEdictTitle}
  - 혼돈 극복 권능: ${report.destinyEdict.chaosOvercomingPower}
  - 핵심 우주 미덕: ${report.destinyEdict.cosmicOrderVirtue}
- **서판 상황 감사(${report.situationalBabylonAudit.contextTheme})**: ${report.situationalBabylonAudit.enumaElishTablet}
  - 혼돈·질서 진단: ${report.situationalBabylonAudit.chaosVsCosmosDiagnosis}
  - 주권 처방: ${report.situationalBabylonAudit.sovereignPrescription}
- **바빌론 시공간 천체 리듬**: ${report.temporalBabylonRhythm.zigguratWatchWindow} · ${report.temporalBabylonRhythm.mulApinSeasonalCycle}
  - 시의 조언: ${report.temporalBabylonRhythm.timingAdvice}
- **에누마 엘리쉬 교차 매트릭스**: ${report.babylonSynthesisMatrix.synthesizedVerdict}
- **맥락별 실천 조언**: ${report.practiceGuidance}
- **일상 의례**: ${report.ritualAction}
- **성찰 초점**: ${report.reflectionFocus}
- **성찰 질문**: ${report.reflectiveQuestion}
- **에누마 엘리쉬 통합 나침반**: ${report.synthesisMessage}
- **해석 경계**: ${report.boundaryNotice}`;
}
