/**
 * 고대 인도 초기불교 석가모니 붓다 사성제(Catvāri Āryasatyāni) & 팔정도(Āryāṣṭāṅgamārga) 고집멸도(苦集滅道) 중도해탈 엔진
 *
 * 《초전법륜경(Dhammacakkappavattana Sutta)》 및 《대념처경(Mahāsatipaṭṭhāna Sutta)》 원전 기반.
 * 1. 사성제(四聖諦): 깨달음에 이르는 네 가지 거룩한 진리
 *    - 고제(Dukkha): 삶의 무상(Anicca)과 불완전성, 괴로움의 실상을 회피 없이 직면함.
 *    - 집제(Samudaya): 갈애(Taṇhā)와 집착(Upādāna), 무명(Avijjā)이 고통의 근원임을 꿰뚫음.
 *    - 멸제(Nirodha): 탐·진·치 삼독의 불길이 꺼지고 번뇌의 얽매임에서 벗어난 열반(Nibbāna)의 고요.
 *    - 도제(Magga): 고통의 소멸로 이끄는 여덟 가지 바른 길 팔정도(八正道).
 * 2. 팔정도(八正道) 삼학(三學) 구조:
 *    - 혜학(Paññā): 정견(正見, 연기와 사성제 직관), 정사유(正思惟, 출리·무진·무해의 사유)
 *    - 계학(Sīla): 정어(正語, 진실하고 자비로운 말), 정업(正業, 바른 행위), 정명(正命, 청정한 생계)
 *    - 정학(Samādhi): 정정진(正精進, 바른 노력), 정념(正念, 사띠/온전한 알아차림), 정정(正定, 고요한 삼매)
 * 3. 중도(Majjhima Paṭipadā): 맹목적 쾌락주의와 가혹한 자기학대의 양극단을 여의고 중심을 잡는 실천적 지혜.
 *
 * @version LUCKEY-FOUR-NOBLE-TRUTHS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const FOUR_NOBLE_TRUTHS_VERSION = 'LUCKEY-FOUR-NOBLE-TRUTHS-v1.0.0';

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
  buddhistMiddleWayCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
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

export function calculateAncientIndianFourNobleTruths(profile: UserProfile): AncientIndianFourNobleTruthsResult {
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

  const counselTitle = `초기불교 사성제 & 팔정도: ${focalEightfoldFactor.pathFactorHanja} (${focalEightfoldFactor.trainingDomainKo})`;
  const philosophicalGuidance = `거문고 줄은 너무 팽팽해도 끊어지고 너무 느슨해도 소리가 나지 않듯, 삶의 본질은 중도(中道)에 있습니다. ` +
    `현재 상황은 사성제 중 '${activeNobleTruth.truthHanja}'의 진리를 비추어볼 때입니다. ${activeNobleTruth.truthLiberationAction} ` +
    `실천적으로는 팔정도 '${focalEightfoldFactor.pathFactorHanja}'의 가르침을 따르십시오. ${focalEightfoldFactor.practicalMindfulnessCounsel}`;

  return {
    engineVersion: FOUR_NOBLE_TRUTHS_VERSION,
    calculatedAtKst: new Date().toISOString(),
    fourNobleTruthsClarityScore,
    eightfoldPathBalanceScore,
    cravingExtinctionNirodhaScore,
    satiMindfulnessPresenceScore,
    middleWayMajjhimaScore,
    activeNobleTruth,
    focalEightfoldFactor,
    buddhistMiddleWayCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatAncientIndianFourNobleTruthsPrompt(res: AncientIndianFourNobleTruthsResult): string {
  return [
    `【초기불교 사성제 & 팔정도 고집멸도 지표】`,
    `- 사성제 인과 명석도: ${res.fourNobleTruthsClarityScore}/100`,
    `- 팔정도 삼학 실천 밸런스: ${res.eightfoldPathBalanceScore}/100`,
    `- 갈애 소멸 열반 평정심: ${res.cravingExtinctionNirodhaScore}/100`,
    `- 사띠(정념) 현존 알아차림: ${res.satiMindfulnessPresenceScore}/100`,
    `- 중도 균형 지혜도: ${res.middleWayMajjhimaScore}/100`,
    `- 비추어보는 거룩한 진리: ${res.activeNobleTruth.truthHanja} (${res.activeNobleTruth.truthPaliKo})`,
    `- 진리의 통찰: ${res.activeNobleTruth.truthInsight}`,
    `- 당면 해탈 실천: ${res.activeNobleTruth.truthLiberationAction}`,
    `- 중점 팔정도 덕목: ${res.focalEightfoldFactor.pathFactorHanja} [${res.focalEightfoldFactor.pathFactorPaliKo}] - ${res.focalEightfoldFactor.trainingDomainKo}`,
    `- 마음챙김 조언: ${res.focalEightfoldFactor.practicalMindfulnessCounsel}`,
    `- 붓다의 중도 지침: ${res.buddhistMiddleWayCounsel.philosophicalGuidance}`,
  ].join('\n');
}
