/**
 * 고대 인도 대승불교 용수(Nāgārjuna, 龍樹) 보살 《중론(Mūlamadhyamakakārikā)》 팔불중도 & 공성(Śūnyatā) 통찰 엔진
 *
 * @version LUCKEY-NAGARJUNA-MADHYAMAKA-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const NAGARJUNA_MADHYAMAKA_VERSION = 'LUCKEY-NAGARJUNA-MADHYAMAKA-v2.2.0';

function getNagarjunaKstString(now?: Date): string {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 3600 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00`;
}

export interface EightfoldNegationAspect {
  aspectKey: string;
  aspectHanja: string;
  aspectNameKo: string;
  philosophicalMeaning: string;
  practicalCounsel: string;
}

export interface MadhyamakaKarikaWisdom {
  karikaKey: string;
  chapterThemeKo: string;
  sanskritVerseSummary: string;
  philosophicalInsight: string;
  lifeApplication: string;
}

export interface NagarjunaSituationalSunyataAudit {
  themeKo: string;
  karikaChapter: string;
  sanskritVerse: string;
  translationKo: string;
  substantialistTrap: string;
  middleWayDeconstructionStep: string;
}

export interface NagarjunaTemporalPratityaRhythm {
  kstWindow: string;
  seasonalTone: string;
  twoTruthsFocus: string;
  sunyataClarityIndex: number;
  rhythmDirective: string;
}

export interface NagarjunaMadhyamakaMatrix {
  svabhavaDeconstruction: number;
  dependentOriginationFlow: number;
  twoTruthsEquilibrium: number;
  overallSynthesis: number;
}

export interface NagarjunaMadhyamakaSunyataResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  sunyataWisdomScore: number;                 // 공성(Śūnyatā) 직관 및 무자성 통찰력
  eightfoldNegationMiddleWayScore: number;    // 팔불중도(八不中道) 양변 초월 평정도
  pratityasamutpadaGraspScore: number;        // 인연생기(緣起) 상호의존 자각도
  twoTruthsHarmonyScore: number;              // 진속이제(眞俗二諦) 현실·이상 조화도
  clingingDeconstructionScore: number;        // 관념 고착 및 에고 해체 지수
  // 세부 분석
  activeNegationAspect: EightfoldNegationAspect;
  focalKarikaWisdom: MadhyamakaKarikaWisdom;
  situationalSunyataAudit: NagarjunaSituationalSunyataAudit;
  temporalPratityaRhythm: NagarjunaTemporalPratityaRhythm;
  madhyamakaMatrix: NagarjunaMadhyamakaMatrix;
  nagarjunaMiddleCounsel: {
    counselTitle: string;
    middleWayGuidance: string;
  };
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  nagarjunaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export type NagarjunaMadhyamakaSunyataReport = NagarjunaMadhyamakaSunyataResult;

const EIGHTFOLD_NEGATION_ASPECTS: EightfoldNegationAspect[] = [
  {
    aspectKey: 'AnutpadaAnirodha',
    aspectHanja: '不生不滅 (불생불멸)',
    aspectNameKo: '생겨남과 사라짐의 양변 초월',
    philosophicalMeaning: '만물은 독립된 실체로 새로 태어나는 것도, 완전히 흔적 없이 소멸하는 것도 아닌 인연의 끝없는 흐름일 뿐입니다.',
    practicalCounsel: '새로운 시작에 들떠 교만해지거나 끝남과 상실에 깊이 좌절하지 마십시오. 모든 변화는 인연의 자연스러운 모임과 흩어짐입니다.',
  },
  {
    aspectKey: 'AnucchedaAsasvata',
    aspectHanja: '不斷不常 (부단부상)',
    aspectNameKo: '단절의 허무와 영원의 고착 초월',
    philosophicalMeaning: '모든 것이 영원히 불변한다는 고착(상견)도, 완전히 끊어져 무의미하다는 허무주의(단견)도 모두 실체를 착각한 망상입니다.',
    practicalCounsel: '상황이 영원히 지속될 것이라 안주하지 말되, 아무 소용없다는 무기력에 빠지지도 마십시오. 지금 이 순간 짓는 인연이 미래를 빚어냅니다.',
  },
  {
    aspectKey: 'AnanarthaAnekartha',
    aspectHanja: '不一不異 (불일불이)',
    aspectNameKo: '절대적 동일과 배타적 분리 초월',
    philosophicalMeaning: '나와 타자, 원인과 결과는 하나로 엉겨붙어 있는 것도 아니며, 완전히 무관하게 떨어져 있는 것도 아닙니다.',
    practicalCounsel: '타인과 지나치게 융합되어 경계를 잃지도 말고, 완전히 고립된 섬처럼 남을 배척하지도 마십시오. 건강한 연결감이 중도입니다.',
  },
  {
    aspectKey: 'AnagamaAnirgama',
    aspectHanja: '不來不出 (불래불출)',
    aspectNameKo: '외부 유입과 내부 이탈의 환상 초월',
    philosophicalMeaning: '지혜나 행복은 외부 어딘가에서 홀연히 날아오는 것이 아니며, 내 안에서 바깥으로 새어나가 잃어버리는 것도 아닙니다.',
    practicalCounsel: '외적인 인정이나 특별한 계기만을 찾아 헤매지 마십시오. 이미 갖추어진 인연의 관계망 속에서 마음의 촛점을 바로 세우십시오.',
  },
];

const KARIKA_WISDOMS: MadhyamakaKarikaWisdom[] = [
  {
    karikaKey: 'PratityasamutpadaSunyata',
    chapterThemeKo: '인연생기(緣起)가 곧 공(空)이며 중도(中道)',
    sanskritVerseSummary: 'Yah pratityasamutpadah sunyatam tam pracaksmahe (제24품 관사제품)',
    philosophicalInsight: '모든 사물과 사건은 홀로 서는 고유 실체가 없기에(空), 인연에 따라 얼마든지 새롭게 피어나고 전환될 수 있습니다.',
    lifeApplication: '현재 마주한 한계나 난관을 불변의 운명으로 굳히지 마십시오. 인연과 조건을 새롭게 재배치하면 현실은 즉각 새롭게 직조됩니다.',
  },
  {
    karikaKey: 'TwoTruthsDvauSatye',
    chapterThemeKo: '진속이제(眞俗二諦)의 지혜로운 조화',
    sanskritVerseSummary: 'Dve satye samupasritya buddhanam dharmadesana (제24품 제8게)',
    philosophicalInsight: '언어와 관습의 세속적 질서(속제)를 존중하면서도, 그 어떤 언어에도 얽매이지 않는 궁극의 공성(진제)을 관조하는 균형입니다.',
    lifeApplication: '세상의 규범과 일상의 실무를 빈틈없이 성실하게 이행하되, 마음 한구석은 그 어떤 결과에도 집착하지 않는 가벼움을 유지하십시오.',
  },
  {
    karikaKey: 'SamsaraNirvanaAbheda',
    chapterThemeKo: '생사와 열반의 불이(不二)',
    sanskritVerseSummary: 'Na samsarasya nirvanat kimcid asti visesanam (제25품 제19게)',
    philosophicalInsight: '번뇌가 소용돌이치는 현실(생사)과 평화로운 깨달음(열반)은 장소가 다른 두 세계가 아니라, 마음의 고착을 푸느냐의 차이일 뿐입니다.',
    lifeApplication: '문제를 피해 특별한 이상향으로 도망치려 하지 마십시오. 지금 겪고 있는 번뇌의 한복판에서 관념의 집착을 내려놓는 바로 그 자리가 평화입니다.',
  },
  {
    karikaKey: 'SarvadrstiPrahana',
    chapterThemeKo: '모든 견해와 도그마의 완전한 휴식',
    sanskritVerseSummary: 'Sarvadrstiprahanaya yah saddharmam adesayat (제27품 제30게)',
    philosophicalInsight: '공(空)이란 또 하나의 철학적 이론이나 주장이 아니라, 마음을 옭아매는 모든 고정관념을 치유하는 해독제입니다.',
    lifeApplication: '"반드시 이래야만 한다"는 자기만의 고집과 주장을 내려놓으십시오. 견해가 비워진 맑은 거울의 마음에 세상의 참모습이 왜곡 없이 비칩니다.',
  },
];

function buildSituationalSunyataAudit(question?: string): NagarjunaSituationalSunyataAudit {
  const q = (question ?? '').trim();
  if (/고집|반드시|절대|내 생각|맞다|갈등/.test(q)) {
    return {
      themeKo: '견해(Drsti)의 고착 해체',
      karikaChapter: '《중론》 제27품 관사견품 30게',
      sanskritVerse: 'Sarvadrstiprahanaya yah saddharmam adesayat',
      translationKo: '모든 고정된 견해(소견)를 놓아 버리게 하려고 부처님께서 정법을 설하셨다.',
      substantialistTrap: '내 판단만이 변치 않는 절대 진리라고 쥐고 있어 대화와 변화의 여지를 닫아 버리는 상견(常見).',
      middleWayDeconstructionStep: '"반드시 이래야 한다"는 전제 하나를 괄호 안에 넣고, 상대 조건이 바뀔 때 달라지는 다른 가능성 2가지를 적어 보십시오.',
    };
  }
  if (/끝|상실|포기|실패|망|허무|무기력/.test(q)) {
    return {
      themeKo: '단견(허무)과 상견(고착) 초월',
      karikaChapter: '《중론》 제24품 관사제품 18~19게',
      sanskritVerse: 'Yah pratityasamutpadah sunyatam tam pracaksmahe',
      translationKo: '인연 따라 일어남(緣起), 바로 그것을 우리는 공(空)이라 부르며 또한 중도라 한다.',
      substantialistTrap: '한 번의 실패를 영원한 끝(단견)으로 규정해, 조건이 바뀌면 다시 피어날 가능성마저 지워 버리는 착각.',
      middleWayDeconstructionStep: '고정된 실패는 없습니다. 지금 상황을 구성하는 조건 중 내 손으로 바꿀 수 있는 작은 인연 1가지만 재배치하십시오.',
    };
  }
  if (/관계|사람|경계|외로|거리|집착/.test(q)) {
    return {
      themeKo: '불일불이(不一不異) 관계의 중도',
      karikaChapter: '《중론》 제1품 관인연품 · 귀경게',
      sanskritVerse: 'Anirodham anutpadam anucchedam asasvatam anekartham ananartham',
      translationKo: '하나도 아니며 다르지도 않고(不一不異), 끊어지지도 영원하지도 않은 것이 연기의 참모습이다.',
      substantialistTrap: '상대와 나를 완전히 하나로 엮어 통제하려 하거나, 완전히 남으로 끊어 내며 고립되는 양극단.',
      middleWayDeconstructionStep: '상대와 나 사이의 적당한 숨 쉴 거리를 인정하면서, 오늘 할 수 있는 담백한 안부나 정중한 경계 1줄만 전하십시오.',
    };
  }
  if (/선택|진로|변화|이직|불안|미래/.test(q)) {
    return {
      themeKo: '공(空)이 열어 주는 변화의 자유',
      karikaChapter: '《중론》 제24품 관사제품 14게',
      sanskritVerse: 'Sarvam ca yujyate tasya sunyata yasya yujyate',
      translationKo: '공성이 성립하는 자에게는 모든 변화와 성취가 가능하고, 공성이 없으면 아무것도 이루어질 수 없다.',
      substantialistTrap: '현재의 처지가 바꿀 수 없는 고정 실체인 양 두려워하며 새로운 시도 자체를 막는 마음.',
      middleWayDeconstructionStep: '지금의 어려움이 텅 비어(변화 가능) 있기 때문에 새 길도 열립니다. 완벽한 보장 대신 작은 실험 1건을 오늘 시작하십시오.',
    };
  }
  return {
    themeKo: '진속이제(眞俗二諦) 삶의 균형',
    karikaChapter: '《중론》 제24품 제8~10게',
    sanskritVerse: 'Dve satye samupasritya buddhanam dharmadesana',
    translationKo: '모든 부처님의 가르침은 세속의 질서(속제)와 궁극의 이치(진제) 두 가지 진리에 의지한다.',
    substantialistTrap: '현실의 실무를 가볍게 여기거나, 반대로 세속의 수치에만 매달려 마음의 자유를 잃는 편향.',
    middleWayDeconstructionStep: '오늘 해야 할 세속의 일은 성실히 마치되, 그 결과에 대한 집착은 공성의 하늘에 흘려보내십시오.',
  };
}

function buildTemporalPratityaRhythm(now?: Date): NagarjunaTemporalPratityaRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 불생불멸의 싹이 인연을 만나 피어나는 개방의 계절'
      : month >= 6 && month <= 8
        ? '여름 — 치열한 인연의 그물망 속에서 진속이제를 균형 잡는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 잎이 지되 뿌리는 남는 부단부상(不斷不常)의 지혜를 익히는 계절'
          : '겨울 — 모든 견해와 분별을 쉬고 맑은 공성(Śūnyatā)을 관조하는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '새벽·오전 공성(Śūnyatā) 무분별 명징 창',
      seasonalTone,
      twoTruthsFocus: '진제(勝義諦) 직관 우선',
      sunyataClarityIndex: 91,
      rhythmDirective: '고정관념이 옅고 마음이 맑은 시간입니다. 사안을 둘러싼 선입견부터 걷어낸 뒤 본질을 보십시오.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '한낮 속제(世俗諦) 인연 조율 창',
      seasonalTone,
      twoTruthsFocus: '속제(世俗諦) 성실 실천',
      sunyataClarityIndex: 82,
      rhythmDirective: '일상의 약속과 관계를 세심하게 다루면서, 조건이 어긋나도 유연하게 방향을 틀기 좋은 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 팔불중도(八不中道) 균형 회복 창',
      seasonalTone,
      twoTruthsFocus: '진속이제(眞俗二諦) 통합',
      sunyataClarityIndex: 84,
      rhythmDirective: '낮 동안 쌓인 흑백 논리와 승패 집착을 내려놓고 양극단의 중간 지점을 점검하십시오.',
    };
  }
  return {
    kstWindow: '심야 사구게(四句偈) 분별 휴식 창',
    seasonalTone,
    twoTruthsFocus: '진제(勝義諦) 침잠과 휴식',
    sunyataClarityIndex: 79,
    rhythmDirective: '있다·없다의 분별을 쫓기 쉬운 밤입니다. 결론을 서두르지 말고 생각의 고리를 잠시 풀어 두십시오.',
  };
}

export function calculateNagarjunaMadhyamakaSunyata(
  profile: UserProfile,
  question?: string,
  now?: Date,
): NagarjunaMadhyamakaSunyataResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'NagarjunaMadhyamakaSunyata';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const sunyataWisdomScore = 68 + (absHash % 31);
  const eightfoldNegationMiddleWayScore = 66 + ((absHash >> 3) % 33);
  const pratityasamutpadaGraspScore = 67 + ((absHash >> 6) % 32);
  const twoTruthsHarmonyScore = 65 + ((absHash >> 9) % 34);
  const clingingDeconstructionScore = 69 + ((absHash >> 12) % 30);

  const aspectIndex = (absHash >> 4) % EIGHTFOLD_NEGATION_ASPECTS.length;
  const wisdomIndex = (absHash >> 7) % KARIKA_WISDOMS.length;

  const activeNegationAspect = EIGHTFOLD_NEGATION_ASPECTS[aspectIndex];
  const focalKarikaWisdom = KARIKA_WISDOMS[wisdomIndex];
  const situationalSunyataAudit = buildSituationalSunyataAudit(question);
  const temporalPratityaRhythm = buildTemporalPratityaRhythm(now);

  const svabhavaDeconstruction = Math.min(99, Math.round((sunyataWisdomScore + clingingDeconstructionScore) / 2));
  const dependentOriginationFlow = Math.min(99, Math.round((pratityasamutpadaGraspScore + temporalPratityaRhythm.sunyataClarityIndex) / 2));
  const twoTruthsEquilibrium = Math.min(99, Math.round((eightfoldNegationMiddleWayScore + twoTruthsHarmonyScore) / 2));
  const overallSynthesis = Math.round((svabhavaDeconstruction + dependentOriginationFlow + twoTruthsEquilibrium) / 3);

  const madhyamakaMatrix: NagarjunaMadhyamakaMatrix = {
    svabhavaDeconstruction,
    dependentOriginationFlow,
    twoTruthsEquilibrium,
    overallSynthesis,
  };

  const counselTitle = `용수 중론 팔불중도: ${activeNegationAspect.aspectHanja}`;
  const middleWayGuidance = `용수 보살의 대승 중관 철학은 일체의 양극단과 고정관념을 해체하여 걸림 없는 자유를 선사합니다. ` +
    `현재 당신의 사유와 운명 흐름은 '${activeNegationAspect.aspectNameKo}(${activeNegationAspect.aspectHanja})'의 관통점에 닿아 있습니다. ` +
    `${activeNegationAspect.practicalCounsel} 또한 《중론》의 정수인 '${focalKarikaWisdom.chapterThemeKo}'을 유념하여, ` +
    `${focalKarikaWisdom.lifeApplication}`;

  const dailyPracticeRitual =
    `[중도(中道) 고정관념 비우기 의례] ${situationalSunyataAudit.middleWayDeconstructionStep}`;
  const reflectiveQuestion =
    `내가 "절대 바뀔 수 없다"고 믿고 있는 이 상황은 실제로 고유한 실체인가, 아니면 인연 따라 얼마든지 다시 빚어질 흐름인가?`;
  const interpretiveBoundary =
    `용수 《중론》 팔불중도 엔진은 고정된 운명을 예단하는 도구가 아니라, 양극단과 고정관념을 풀어 유연한 변화를 열도록 돕는 상징·성찰 관점입니다.`;

  const trimmedQ = (question ?? '').trim();
  const nagarjunaSynthesisMatrix = {
    dominantTension: `${situationalSunyataAudit.substantialistTrap} ↔ ${activeNegationAspect.aspectHanja}`,
    alignmentState: `${temporalPratityaRhythm.twoTruthsFocus} · ${focalKarikaWisdom.chapterThemeKo}`,
    integratedAction: `${situationalSunyataAudit.middleWayDeconstructionStep}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: NAGARJUNA_MADHYAMAKA_VERSION,
    calculatedAtKst: getNagarjunaKstString(now),
    sunyataWisdomScore,
    eightfoldNegationMiddleWayScore,
    pratityasamutpadaGraspScore,
    twoTruthsHarmonyScore,
    clingingDeconstructionScore,
    activeNegationAspect,
    focalKarikaWisdom,
    situationalSunyataAudit,
    temporalPratityaRhythm,
    madhyamakaMatrix,
    nagarjunaMiddleCounsel: {
      counselTitle,
      middleWayGuidance,
    },
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    nagarjunaSynthesisMatrix,
  };
}

function describeNagarjunaStage(score: number): string {
  if (score >= 88) return '양극단을 여의고 걸림 없이 맑은 중도';
  if (score >= 76) return '인연의 흐름을 유연하게 타는 안정된 결';
  if (score >= 64) return '고정관념의 매듭을 차분히 푸는 단계';
  return '분별을 멈추고 한 걸음 물러서 바라보는 초입';
}

export function formatNagarjunaMadhyamakaSunyataPrompt(res: NagarjunaMadhyamakaSunyataResult): string {
  const matrixLine = res.nagarjunaSynthesisMatrix
    ? `- 용수 중관 교차 매트릭스: 핵심 긴장(${res.nagarjunaSynthesisMatrix.dominantTension}) · 조율 상태(${res.nagarjunaSynthesisMatrix.alignmentState}) · 통합 실천(${res.nagarjunaSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【용수 중론 & 팔불중도 공성(Śūnyatā) 지표 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 공성(Śūnyatā) 직관 및 무자성 통찰: ${describeNagarjunaStage(res.sunyataWisdomScore)}`,
    `- 팔불중도(八不中道) 양변 초월 평정: ${describeNagarjunaStage(res.eightfoldNegationMiddleWayScore)}`,
    `- 인연생기(緣起) 상호의존 자각: ${describeNagarjunaStage(res.pratityasamutpadaGraspScore)}`,
    `- 진속이제(眞俗二諦) 현실·이상 조화: ${describeNagarjunaStage(res.twoTruthsHarmonyScore)}`,
    `- 관념 고착 및 에고 해체: ${describeNagarjunaStage(res.clingingDeconstructionScore)}`,
    `- 핵심 팔불중도 관점: ${res.activeNegationAspect.aspectNameKo} [${res.activeNegationAspect.aspectHanja}]`,
    `- 질문 맥락 공성 처방 (${res.situationalSunyataAudit.themeKo} · ${res.situationalSunyataAudit.karikaChapter}): "${res.situationalSunyataAudit.translationKo}" [${res.situationalSunyataAudit.sanskritVerse}]`,
    `- 실체 착각 함정: ${res.situationalSunyataAudit.substantialistTrap}`,
    `- 중도 해체 실천: ${res.situationalSunyataAudit.middleWayDeconstructionStep}`,
    `- KST 연기 리듬: ${res.temporalPratityaRhythm.kstWindow} (${res.temporalPratityaRhythm.twoTruthsFocus}, 명료도 ${describeNagarjunaStage(res.temporalPratityaRhythm.sunyataClarityIndex)}) — ${res.temporalPratityaRhythm.rhythmDirective}`,
    `- 중관 매트릭스: 자성 해체(${describeNagarjunaStage(res.madhyamakaMatrix.svabhavaDeconstruction)}) · 연기 흐름(${describeNagarjunaStage(res.madhyamakaMatrix.dependentOriginationFlow)}) · 이제 균형(${describeNagarjunaStage(res.madhyamakaMatrix.twoTruthsEquilibrium)}) · 종합(${describeNagarjunaStage(res.madhyamakaMatrix.overallSynthesis)})`,
    `- 일상 실천 지침: ${res.nagarjunaMiddleCounsel.middleWayGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
