/**
 * 고대 인도 초기불교 석가모니 붓다 사성제(Catvāri Āryasatyāni) & 팔정도(Āryāṣṭāṅgamārga) 고집멸도(苦集滅道) 중도해탈 엔진
 *
 * 《초전법륜경(Dhammacakkappavattana Sutta)》, 《대념처경(Mahāsatipaṭṭhāna Sutta)》, 《법구경(Dhammapada)》 원전 기반.
 *
 * @version LUCKEY-FOUR-NOBLE-TRUTHS-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const FOUR_NOBLE_TRUTHS_VERSION = 'LUCKEY-FOUR-NOBLE-TRUTHS-v2.2.0';

function getBuddhaKstString(now?: Date): string {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 3600 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00`;
}

export interface BuddhistNobleTruth {
  truthHanja: string;
  truthPaliKo: string;
  truthInsight: string;
  truthLiberationAction: string;
}

export interface EightfoldPathFactor {
  pathFactorHanja: string;
  pathFactorPaliKo: string;
  trainingDomainKo: '혜학(지혜)' | '계학(윤리·언행)' | '정학(마음챙김·삼매)';
  practicalMindfulnessCounsel: string;
}

export interface BuddhistSituationalDharmaAudit {
  themeKo: string;
  suttaCitation: string;
  paliQuote: string;
  translationKo: string;
  cravingKnot: string;
  eightfoldActionStep: string;
}

export interface BuddhistTemporalSatiRhythm {
  kstWindow: string;
  seasonalTone: string;
  threeTrainingsFocus: '혜학(지혜)' | '계학(윤리·언행)' | '정학(마음챙김·삼매)';
  satiClarityIndex: number;
  rhythmDirective: string;
}

export interface BuddhistNobleEightfoldMatrix {
  dukkhaAcceptance: number;
  tanhaRelease: number;
  satiPresence: number;
  overallSynthesis: number;
}

export interface AncientIndianFourNobleTruthsResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  fourNobleTruthsClarityScore: number;   // 사성제(고집멸도) 인과 통찰 명석도
  eightfoldPathBalanceScore: number;     // 팔정도(계·정·혜) 삼학 실천 밸런스 지수
  cravingExtinctionNirodhaScore: number; // 갈애 소멸(멸제) 열반 평정심
  satiMindfulnessPresenceScore: number;  // 사띠(정념) 지금-여기 깨어있는 알아차림 현존도
  middleWayMajjhimaScore: number;        // 양극단을 벗어난 중도(Majjhima) 균형 지혜도
  // 세부 명세
  activeNobleTruth: BuddhistNobleTruth;
  focalEightfoldFactor: EightfoldPathFactor;
  situationalDharmaAudit: BuddhistSituationalDharmaAudit;
  temporalSatiRhythm: BuddhistTemporalSatiRhythm;
  nobleEightfoldMatrix: BuddhistNobleEightfoldMatrix;
  buddhistMiddleWayCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  buddhistSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export type AncientIndianFourNobleTruthsReport = AncientIndianFourNobleTruthsResult;

const NOBLE_TRUTHS: BuddhistNobleTruth[] = [
  {
    truthHanja: '苦諦 (고제 - 둑카)',
    truthPaliKo: 'Dukkha Sacca (괴로움의 거룩한 진리)',
    truthInsight: '모든 조건 지어진 것은 영원하지 않으며(무상), 원하는 대로만 되지 않는다는 실존적 한계의 정직한 인정.',
    truthLiberationAction: '문제를 왜곡하거나 부정하지 말고 있는 그대로 직시할 때 비로소 진정한 해법이 열립니다.',
  },
  {
    truthHanja: '集諦 (집제 - 사무다야)',
    truthPaliKo: 'Samudaya Sacca (괴로움의 원인에 대한 거룩한 진리)',
    truthInsight: '괴로움은 외부 상황 자체가 아니라, 그것을 영원히 붙잡으려는 갈애(Tanha)와 집착에서 생겨남.',
    truthLiberationAction: '상황을 탓하기에 앞서 내 마음속에서 무엇을 과도하게 움켜쥐려 하고 있는지 집착의 매듭을 살피십시오.',
  },
  {
    truthHanja: '滅諦 (멸제 - 니로다)',
    truthPaliKo: 'Nirodha Sacca (괴로움의 소멸에 대한 거룩한 진리)',
    truthInsight: '갈애와 무명이 남김없이 사라질 때 모든 번뇌의 불길이 꺼진 완전한 평화(열반)가 드러남.',
    truthLiberationAction: '불필요한 욕심과 저항을 내려놓는 순간, 이미 본래 갖추어진 내면의 깊은 고요와 자유를 체험하십시오.',
  },
  {
    truthHanja: '道諦 (도제 - 막가)',
    truthPaliKo: 'Magga Sacca (괴로움의 소멸로 인도하는 길의 거룩한 진리)',
    truthInsight: '맹목적인 신념이 아니라 구체적이고 체계적인 8가지 바른 수행(팔정도)을 통해 해탈에 이름.',
    truthLiberationAction: '견해를 바로잡고 언행을 맑히며 마음을 깨어있게 하는 팔정도의 실천을 일상 속에 구현하십시오.',
  },
];

const EIGHTFOLD_FACTORS: EightfoldPathFactor[] = [
  {
    pathFactorHanja: '正見 (정견)',
    pathFactorPaliKo: 'Sammā Diṭṭhi (바른 견해)',
    trainingDomainKo: '혜학(지혜)',
    practicalMindfulnessCounsel: '모든 것은 서로 원인과 조건으로 얽혀 있다는 연기(緣起)의 법칙을 통찰하고 편견 없이 사안을 바라보십시오.',
  },
  {
    pathFactorHanja: '正思惟 (정사유)',
    pathFactorPaliKo: 'Sammā Saṅkappa (바른 사유)',
    trainingDomainKo: '혜학(지혜)',
    practicalMindfulnessCounsel: '탐욕을 벗어나는 마음, 분노를 내려놓는 마음, 타인을 해치지 않는 자비로운 마음으로 생각을 정돈하십시오.',
  },
  {
    pathFactorHanja: '正語 (정어)',
    pathFactorPaliKo: 'Sammā Vācā (바른 언어)',
    trainingDomainKo: '계학(윤리·언행)',
    practicalMindfulnessCounsel: '거짓말, 이간질, 거친 욕설, 무익한 잡담을 삼가고 진실하며 온화하고 유익한 말을 건네십시오.',
  },
  {
    pathFactorHanja: '正業 (정업)',
    pathFactorPaliKo: 'Sammā Kammanta (바른 행위)',
    trainingDomainKo: '계학(윤리·언행)',
    practicalMindfulnessCounsel: '생명을 해치지 않고, 주지 않은 것을 취하지 않으며, 감각적 쾌락에 방종하지 않는 청정한 행동을 지키십시오.',
  },
  {
    pathFactorHanja: '正命 (정명)',
    pathFactorPaliKo: 'Sammā Ājīva (바른 생계)',
    trainingDomainKo: '계학(윤리·언행)',
    practicalMindfulnessCounsel: '남을 해치거나 속이지 않고, 정당하고 덕스러운 수단으로 자신의 삶과 생계를 정직하게 꾸려가십시오.',
  },
  {
    pathFactorHanja: '正精進 (정정진)',
    pathFactorPaliKo: 'Sammā Vāyāma (바른 노력)',
    trainingDomainKo: '정학(마음챙김·삼매)',
    practicalMindfulnessCounsel: '이미 일어난 악을 끊고 아직 일어나지 않은 선을 북돋우며, 조급함이나 나태함 없이 꾸준히 정진하십시오.',
  },
  {
    pathFactorHanja: '正念 (정념)',
    pathFactorPaliKo: 'Sammā Sati (바른 알아차림/사띠)',
    trainingDomainKo: '정학(마음챙김·삼매)',
    practicalMindfulnessCounsel: '과거에 얽매이거나 미래를 걱정하지 않고, 지금 이 순간 몸과 마음에서 일어나는 현상을 또렷이 깨어 알아차리십시오.',
  },
  {
    pathFactorHanja: '正定 (정정)',
    pathFactorPaliKo: 'Sammā Samādhi (바른 삼매)',
    trainingDomainKo: '정학(마음챙김·삼매)',
    practicalMindfulnessCounsel: '산란하게 흩어지는 생각을 하나로 모아 흔들리지 않는 깊은 내면의 고요와 집중을 유지하십시오.',
  },
];

function buildSituationalDharmaAudit(question?: string): BuddhistSituationalDharmaAudit {
  const q = (question ?? '').trim();
  if (/불안|고통|힘들|우울|막막|걱정/.test(q)) {
    return {
      themeKo: '두 번째 화살 멈추기 (고제·사띠)',
      suttaCitation: '《화살경(Sallatha Sutta, SN 36.6)》',
      paliQuote: 'Ekam sallam patisamvedeti, kayikam na cetasikam',
      translationKo: '깨어있는 이는 몸의 첫 번째 화살은 맞더라도, 마음의 자책과 불안이라는 두 번째 화살은 맞지 않는다.',
      cravingKnot: '일어난 현실에 "왜 나만 이럴까"라는 저항과 두려움을 덧씌워 괴로움을 두 배로 키우는 습관.',
      eightfoldActionStep: '정념(正念): 지금 숨이 들어오고 나가는 감각에 1분간 주의를 두며, 사실과 마음의 덧칠을 분리하십시오.',
    };
  }
  if (/집착|욕심|놓|포기|미련|돈|결과/.test(q)) {
    return {
      themeKo: '갈애(Taṇhā)의 매듭 풀기 (집제·멸제)',
      suttaCitation: '《초전법륜경(SN 56.11)》',
      paliQuote: 'Yo kho bhikkhave imaya tanhaya asesaviraganirodho',
      translationKo: '갈애를 남김없이 여의고 놓아 버리는 바로 그 자리에 괴로움의 소멸(열반)이 있다.',
      cravingKnot: '무상한 조건을 영원히 붙잡아 두려는 움켜쥠(Upādāna)에서 피어나는 초조함.',
      eightfoldActionStep: '정사유(正思惟): "이것을 꼭 쥐지 않아도 나는 안전하다"고 스스로에게 일러 주고 쥔 주먹의 힘을 30% 빼십시오.',
    };
  }
  if (/관계|사람|말|갈등|화|오해|서운/.test(q)) {
    return {
      themeKo: '바른 언어와 자비의 경계 (정어·정업)',
      suttaCitation: '《법구경(Dhammapada)》 제5게',
      paliQuote: 'Na hi verena verani sammantidha kudacanam, averena ca sammanti',
      translationKo: '원한은 원한으로 풀리지 않고 오직 원한을 내려놓은 자비로써만 고요히 가라앉는다.',
      cravingKnot: '상대의 가시 돋친 말에 똑같은 분노로 되갚으려는 즉각적 반작용.',
      eightfoldActionStep: '정어(正語): 감정이 가라앉기 전에는 답장을 멈추고, 진실하되 상대를 찌르지 않는 온화한 문장만 남기십시오.',
    };
  }
  if (/선택|진로|일|이직|방향|결정/.test(q)) {
    return {
      themeKo: '바른 견해와 중도적 결단 (정견·정명)',
      suttaCitation: '《소나경(Sona Sutta, AN 6.55)》',
      paliQuote: 'Accaraddho kho pana viriyo uddhaccaya samvattati',
      translationKo: '거문고 줄이 너무 팽팽하면 끊어지고 너무 느슨하면 소리가 나지 않듯, 정진도 고른 조율에 있다.',
      cravingKnot: '한 번의 선택으로 모든 것을 완벽히 끝내려는 조급함과 실패 회피.',
      eightfoldActionStep: '정견(正見) & 정명(正命): 무리한 도박이나 비겁한 타협을 피하고 오래 지속할 수 있는 바른 길 한 걸음을 택하십시오.',
    };
  }
  return {
    themeKo: '지금-여기 깨어있는 정진 (정정진·정념)',
    suttaCitation: '《대념처경(DN 22)》',
    paliQuote: 'Ekayano ayam bhikkhave maggo sattanam visuddhiya',
    translationKo: '몸과 느낌과 마음을 지금 이 자리에서 또렷이 알아차리는 길, 이것이 마음을 맑히는 외길이다.',
    cravingKnot: '지나간 어제와 오지 않은 내일 사이에서 현재의 힘을 흩어뜨리는 산만함.',
    eightfoldActionStep: '정정진(正精進): 오늘 할 일 중 가장 정갈한 한 가지를 골라 25분간 한결같은 마음으로 마치고 호흡을 고르십시오.',
  };
}

function buildTemporalSatiRhythm(now?: Date): BuddhistTemporalSatiRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 새로운 인연의 싹을 정견(正見)과 자비로 가꾸는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 탐·진·치의 열기를 사띠(정념)의 서늘한 알아차림으로 식히는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 무상(Anicca)의 이치를 담담히 수용하며 집착을 비우는 계절'
          : '겨울 — 내면의 정정(正定) 삼매를 깊게 들이며 고요히 힘을 기르는 계절';

  if (hour >= 4 && hour < 10) {
    return {
      kstWindow: '새벽·아침 정념(正念) 사띠 각성 창',
      seasonalTone,
      threeTrainingsFocus: '정학(마음챙김·삼매)',
      satiClarityIndex: 92,
      rhythmDirective: '마음이 가장 고요하고 맑은 아침입니다. 호흡을 고른 뒤 오늘의 올바른 의도(정사유)를 세우십시오.',
    };
  }
  if (hour >= 10 && hour < 17) {
    return {
      kstWindow: '한낮 계학(正語·正業·正命) 일상 실천 창',
      seasonalTone,
      threeTrainingsFocus: '계학(윤리·언행)',
      satiClarityIndex: 83,
      rhythmDirective: '말과 행동이 타인과 닿는 낮 시간입니다. 한 마디 말과 한 가지 일에도 청정한 주의를 기울이십시오.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 혜학(正見) 연기 성찰 창',
      seasonalTone,
      threeTrainingsFocus: '혜학(지혜)',
      satiClarityIndex: 80,
      rhythmDirective: '하루의 크고 작은 감정을 연기의 눈으로 관조하며 불필요한 갈애를 내려놓기 좋은 시간입니다.',
    };
  }
  return {
    kstWindow: '심야 니로다(Nirodha) 고요·이완 창',
    seasonalTone,
    threeTrainingsFocus: '정학(마음챙김·삼매)',
    satiClarityIndex: 77,
    rhythmDirective: '밤의 번뇌는 실체가 없는 그림자입니다. 생각을 끊으려 애쓰지 말고 호흡만 지켜보며 쉬십시오.',
  };
}

export function calculateAncientIndianFourNobleTruths(
  profile: UserProfile,
  question?: string,
  now?: Date,
): AncientIndianFourNobleTruthsResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'AncientIndianFourNobleTruths';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const fourNobleTruthsClarityScore = 67 + (absHash % 32);
  const eightfoldPathBalanceScore = 65 + ((absHash >> 3) % 34);
  const cravingExtinctionNirodhaScore = 63 + ((absHash >> 6) % 36);
  const satiMindfulnessPresenceScore = 68 + ((absHash >> 9) % 31);
  const middleWayMajjhimaScore = 64 + ((absHash >> 12) % 35);

  const truthIndex = (absHash >> 4) % NOBLE_TRUTHS.length;
  const pathIndex = (absHash >> 7) % EIGHTFOLD_FACTORS.length;

  const activeNobleTruth = NOBLE_TRUTHS[truthIndex];
  const focalEightfoldFactor = EIGHTFOLD_FACTORS[pathIndex];
  const situationalDharmaAudit = buildSituationalDharmaAudit(question);
  const temporalSatiRhythm = buildTemporalSatiRhythm(now);

  const dukkhaAcceptance = Math.min(99, Math.round((fourNobleTruthsClarityScore + middleWayMajjhimaScore) / 2));
  const tanhaRelease = Math.min(99, Math.round((cravingExtinctionNirodhaScore + eightfoldPathBalanceScore) / 2));
  const satiPresence = Math.min(99, Math.round((satiMindfulnessPresenceScore + temporalSatiRhythm.satiClarityIndex) / 2));
  const overallSynthesis = Math.round((dukkhaAcceptance + tanhaRelease + satiPresence) / 3);

  const nobleEightfoldMatrix: BuddhistNobleEightfoldMatrix = {
    dukkhaAcceptance,
    tanhaRelease,
    satiPresence,
    overallSynthesis,
  };

  const counselTitle = `초기불교 사성제 & 팔정도: ${focalEightfoldFactor.pathFactorHanja} (${focalEightfoldFactor.trainingDomainKo})`;
  const philosophicalGuidance = `거문고 줄은 너무 팽팽해도 끊어지고 너무 느슨해도 소리가 나지 않듯, 삶의 본질은 중도(中道)에 있습니다. ` +
    `현재 상황은 사성제 중 '${activeNobleTruth.truthHanja}'의 진리를 비추어볼 때입니다. ${activeNobleTruth.truthLiberationAction} ` +
    `실천적으로는 팔정도 '${focalEightfoldFactor.pathFactorHanja}'의 가르침을 따르십시오. ${focalEightfoldFactor.practicalMindfulnessCounsel}`;

  const dailyPracticeRitual =
    `[사띠(正念) 호흡 알아차림 1분 의례] ${situationalDharmaAudit.eightfoldActionStep}`;
  const reflectiveQuestion =
    `지금 내 마음을 무겁게 누르는 것은 사실 그 자체인가, 아니면 사실 위에 내가 덧씌운 집착과 저항인가?`;
  const interpretiveBoundary =
    `초기불교 사성제와 팔정도는 길흉을 단정하는 예언이 아니라, 괴로움의 원인을 살펴 중도(中道)의 실천으로 마음을 고요히 이끄는 상징·성찰 관점입니다.`;

  const trimmedQ = (question ?? '').trim();
  const buddhistSynthesisMatrix = {
    dominantTension: `${situationalDharmaAudit.cravingKnot} ↔ ${activeNobleTruth.truthHanja}`,
    alignmentState: `${focalEightfoldFactor.pathFactorHanja} · ${temporalSatiRhythm.threeTrainingsFocus}`,
    integratedAction: `${situationalDharmaAudit.eightfoldActionStep}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: FOUR_NOBLE_TRUTHS_VERSION,
    calculatedAtKst: getBuddhaKstString(now),
    fourNobleTruthsClarityScore,
    eightfoldPathBalanceScore,
    cravingExtinctionNirodhaScore,
    satiMindfulnessPresenceScore,
    middleWayMajjhimaScore,
    activeNobleTruth,
    focalEightfoldFactor,
    situationalDharmaAudit,
    temporalSatiRhythm,
    nobleEightfoldMatrix,
    buddhistMiddleWayCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    buddhistSynthesisMatrix,
  };
}

function describeBuddhistStage(score: number): string {
  if (score >= 88) return '고요히 깨어 열반의 평온에 가까운 결';
  if (score >= 76) return '삼학이 고르게 조율된 안정된 흐름';
  if (score >= 64) return '집착을 알아차리며 정진하는 단계';
  return '조급함을 내려놓고 호흡을 고르는 초입';
}

export function formatAncientIndianFourNobleTruthsPrompt(res: AncientIndianFourNobleTruthsResult): string {
  const matrixLine = res.buddhistSynthesisMatrix
    ? `- 사성제·팔정도 교차 매트릭스: 핵심 긴장(${res.buddhistSynthesisMatrix.dominantTension}) · 조율 상태(${res.buddhistSynthesisMatrix.alignmentState}) · 통합 실천(${res.buddhistSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【초기불교 사성제 & 팔정도 고집멸도 지표 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 사성제 인과 명석함: ${describeBuddhistStage(res.fourNobleTruthsClarityScore)}`,
    `- 팔정도 삼학 실천 균형: ${describeBuddhistStage(res.eightfoldPathBalanceScore)}`,
    `- 갈애 소멸 열반 평정: ${describeBuddhistStage(res.cravingExtinctionNirodhaScore)}`,
    `- 사띠(정념) 현존 알아차림: ${describeBuddhistStage(res.satiMindfulnessPresenceScore)}`,
    `- 중도 균형 지혜: ${describeBuddhistStage(res.middleWayMajjhimaScore)}`,
    `- 비추어보는 거룩한 진리: ${res.activeNobleTruth.truthHanja} (${res.activeNobleTruth.truthPaliKo})`,
    `- 중점 팔정도 덕목: ${res.focalEightfoldFactor.pathFactorHanja} [${res.focalEightfoldFactor.pathFactorPaliKo}] - ${res.focalEightfoldFactor.trainingDomainKo}`,
    `- 질문 맥락 법문 처방 (${res.situationalDharmaAudit.themeKo} · ${res.situationalDharmaAudit.suttaCitation}): "${res.situationalDharmaAudit.translationKo}" [${res.situationalDharmaAudit.paliQuote}]`,
    `- 갈애의 매듭: ${res.situationalDharmaAudit.cravingKnot}`,
    `- 팔정도 실천 단계: ${res.situationalDharmaAudit.eightfoldActionStep}`,
    `- KST 사띠 리듬: ${res.temporalSatiRhythm.kstWindow} (${res.temporalSatiRhythm.threeTrainingsFocus}, 명료도 ${describeBuddhistStage(res.temporalSatiRhythm.satiClarityIndex)}) — ${res.temporalSatiRhythm.rhythmDirective}`,
    `- 사성제·팔정도 매트릭스: 고제 수용(${describeBuddhistStage(res.nobleEightfoldMatrix.dukkhaAcceptance)}) · 갈애 해탈(${describeBuddhistStage(res.nobleEightfoldMatrix.tanhaRelease)}) · 사띠 현존(${describeBuddhistStage(res.nobleEightfoldMatrix.satiPresence)}) · 종합(${describeBuddhistStage(res.nobleEightfoldMatrix.overallSynthesis)})`,
    `- 붓다의 중도 지침: ${res.buddhistMiddleWayCounsel.philosophicalGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
