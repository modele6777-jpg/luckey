/**
 * =========================================================================
 * LUCKEY 즉시 결단 매화역수 & 기문둔갑 시가팔문 엔진 (Instant Decision Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 실시간 타임스탬프 기반 정통 매화역수(梅花易數) 시간작괘:
 *    - 질의 시점의 년지수 + 음력/양력 월수 + 일수 -> 상괘(上卦)
 *    - 상괘수 + 시지수 -> 하괘(下卦)
 *    - (상괘수 + 하괘수 + 시지수) % 6 -> 동효(動爻)
 *    - 본괘(本卦 · 현재), 호괘(互卦 · 숨은 내막/과정), 변괘(變卦 · 최종 결말) 완전 도출
 *    - 체용(體用) 생극제화: 동효 없는 괘=체(體, 나/주체), 동효 있는 괘=용(用, 상대/환경/일)
 *      * 용생체(用生體 · 대길, 외부 도움)
 *      * 체극용(體克用 · 소길, 내가 통제하고 주도)
 *      * 비화(比和 · 길, 동등한 조화)
 *      * 체생용(體生用 · 소흉, 기운 빠짐, 실속 부족)
 *      * 용극체(用克體 · 대흉, 외부 압박 및 장애)
 * 2. 기문둔갑 시가팔문(時家八門) 실시간 국수 연계:
 *    - 현재 시진(時辰)의 8문 배치:
 *      * 3대 길문(吉門): 개문(開門 · 개척/출발), 휴문(休門 · 귀인/치유), 생문(生門 · 재물/수익)
 *      * 3대 흉문(凶門): 사문(死門 · 종결/침체), 상문(傷門 · 손상/다툼), 경문(驚門 · 구설/놀람)
 *      * 2대 평문(平門): 두문(杜門 · 보안/침묵), 경문(景門 · 문서/계약/감정)
 * 3. 즉시 결단 승부수 스코어링 (Instant Decision Timing Index):
 *    - 0 ~ 100점 종합 길흉 지수 및 5대 결단 등급:
 *      * 적극 추진 (Strong Go · 85~100점)
 *      * 전략적 진행 (Moderate Go · 70~84점)
 *      * 관망 및 조율 (Wait & See · 50~69점)
 *      * 신중 보류 (Caution · 35~49점)
 *      * 철회 및 방어 (Strong Stop · 0~34점)
 * 4. 질의 유형별 맞춤 실행 프로토콜:
 *    - 양자택일(A vs B), 지금 즉시 실행 여부, 먼저 연락할 타이밍, 계약/서명 길흉
 */

import { hexagram, type Yao } from './iching';
import { calculateQimen } from './eventCharts';

export const INSTANT_DECISION_ENGINE_VERSION = 'LUCKEY-IDE-v2.2.0';

function formatInstantDecisionKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type DecisionVerdictGrade =
  | '적극 추진 (Strong Go)'
  | '전략적 진행 (Moderate Go)'
  | '관망 및 조율 (Wait & See)'
  | '신중 보류 (Caution)'
  | '철회 및 방어 (Strong Stop)';

export type MeihuaFiveElement = '목' | '화' | '토' | '금' | '수';

export interface TrigramMeta {
  number: number;
  name: string;
  symbol: string;
  element: MeihuaFiveElement;
  nature: string;
  bits: [number, number, number]; // bottom to top
}

export interface CheYongAnalysis {
  cheTrigram: TrigramMeta;
  yongTrigram: TrigramMeta;
  relationType: '용생체(用生體)' | '체극용(體克用)' | '비화(比和)' | '체생용(體生用)' | '용극체(用克體)';
  relationQuality: '대길' | '소길' | '길' | '소흉' | '대흉';
  scoreDelta: number;
  description: string;
}

export interface InstantDecisionResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  questionSnippet: string;
  targetInstantTime: string;

  // 1. 매화역수 시간작괘 상세
  meihua: {
    timeNumbers: {
      yearBranchNum: number;
      yearBranchKr: string;
      monthNum: number;
      dayNum: number;
      hourBranchNum: number;
      hourBranchKr: string;
    };
    upperTrigramNum: number;
    lowerTrigramNum: number;
    movingLine: number; // 1~6효

    primaryHexagram: {
      number: number;
      name: string;
      upper: string;
      lower: string;
    };
    huguaHexagram: {
      number: number;
      name: string;
      upper: string;
      lower: string;
    };
    changedHexagram: {
      number: number;
      name: string;
      upper: string;
      lower: string;
    };

    cheYongPrimary: CheYongAnalysis;
    cheYongChanged: CheYongAnalysis;
    meihuaScore: number; // 0 ~ 100
  };

  // 2. 기문둔갑 시가팔문 상세
  qimenGates: {
    currentHourBranch: string;
    dominantGate: string;
    gateNature: '길문(吉門)' | '흉문(凶門)' | '평문(平門)';
    luckyDirections: string[];
    gateActionGuide: string;
  };

  // 3. 종합 결단 스코어 및 승부수 권고
  verdict: {
    finalScore: number; // 0 ~ 100
    grade: DecisionVerdictGrade;
    oneLineConclusion: string;
    strategicTiming: string;
    actionProtocol: {
      doNow: string;
      avoidNow: string;
      optimalWindow: string;
    };
  };

  instantDecisionSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion?: string;
  interpretiveBoundary: string;
}

// 팔괘 선천수 및 음양효 비트 (소강절 선천팔괘수: 1건, 2태, 3리, 4진, 5손, 6감, 7간, 8곤)
const TRIGRAM_CATALOG: Record<number, TrigramMeta> = {
  1: { number: 1, name: '건(乾)', symbol: '☰', element: '금', nature: '하늘·강건함', bits: [1, 1, 1] },
  2: { number: 2, name: '태(兌)', symbol: '☱', element: '금', nature: '연못·기쁨·말', bits: [1, 1, 0] },
  3: { number: 3, name: '리(離)', symbol: '☲', element: '화', nature: '불·밝음·명예', bits: [1, 0, 1] },
  4: { number: 4, name: '진(震)', symbol: '☳', element: '목', nature: '우레·움직임·결단', bits: [1, 0, 0] },
  5: { number: 5, name: '손(巽)', symbol: '☴', element: '목', nature: '바람·유연함·진퇴', bits: [0, 1, 1] },
  6: { number: 6, name: '감(坎)', symbol: '☵', element: '수', nature: '물·험난함·지혜', bits: [0, 1, 0] },
  7: { number: 7, name: '간(艮)', symbol: '☶', element: '토', nature: '산·멈춤·신중함', bits: [0, 0, 1] },
  8: { number: 8, name: '곤(坤)', symbol: '☷', element: '토', nature: '땅·수용·순응', bits: [0, 0, 0] },
};

// 12지지 시진 및 지지수 (자1, 축2, ... 해12)
const BRANCH_NUMS = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

function getHourBranchInfo(kstHours: number): { branchNum: number; branchKr: string } {
  // 23:00~01:00 자(1), 01:00~03:00 축(2), ...
  let idx = Math.floor((kstHours + 1) / 2) % 12;
  return {
    branchNum: idx + 1,
    branchKr: BRANCH_NUMS[idx] || '자',
  };
}

function evaluateCheYong(che: TrigramMeta, yong: TrigramMeta): CheYongAnalysis {
  const c = che.element;
  const y = yong.element;

  // 오행 상생: 목생화, 화생토, 토생금, 금생수, 수생목
  const generates: Record<MeihuaFiveElement, MeihuaFiveElement> = {
    목: '화', 화: '토', 토: '금', 금: '수', 수: '목'
  };
  // 오행 상극: 목극토, 토극수, 수극화, 화극금, 금극목
  const controls: Record<MeihuaFiveElement, MeihuaFiveElement> = {
    목: '토', 토: '수', 수: '화', 화: '금', 금: '목'
  };

  if (generates[y] === c) {
    return {
      cheTrigram: che,
      yongTrigram: yong,
      relationType: '용생체(用生體)',
      relationQuality: '대길',
      scoreDelta: +25,
      description: `용(${yong.name}·${y})이 체(${che.name}·${c})를 생하여, 외부의 강력한 원조와 유리한 기회가 절로 찾아오는 대길한 흐름입니다.`,
    };
  }
  if (controls[c] === y) {
    return {
      cheTrigram: che,
      yongTrigram: yong,
      relationType: '체극용(體克用)',
      relationQuality: '소길',
      scoreDelta: +15,
      description: `체(${che.name}·${c})가 용(${yong.name}·${y})을 능히 극하여, 나의 주도권과 노력으로 상황을 완전히 장악할 수 있는 흐름입니다.`,
    };
  }
  if (c === y) {
    return {
      cheTrigram: che,
      yongTrigram: yong,
      relationType: '비화(比和)',
      relationQuality: '길',
      scoreDelta: +20,
      description: `체(${che.name})와 용(${yong.name})이 동일한 [${c}] 기운으로 어우러져 동료·협력자와 순조롭게 화합하는 조화로운 흐름입니다.`,
    };
  }
  if (generates[c] === y) {
    return {
      cheTrigram: che,
      yongTrigram: yong,
      relationType: '체생용(體生用)',
      relationQuality: '소흉',
      scoreDelta: -12,
      description: `체(${che.name}·${c})가 용(${yong.name}·${y})을 생하여 내 기운과 자원이 과도하게 소모될 수 있으니 실속을 챙겨야 합니다.`,
    };
  }
  return {
    cheTrigram: che,
    yongTrigram: yong,
    relationType: '용극체(用克體)',
    relationQuality: '대흉',
    scoreDelta: -25,
    description: `용(${yong.name}·${y})이 체(${che.name}·${c})를 극하여 외부의 압박, 반대, 예상치 못한 저항에 부딪힐 수 있으니 방어가 필수입니다.`,
  };
}

/**
 * 실시간 타임스탬프를 기반으로 매화역수 시간작괘 및 기문둔갑 시가 8문을 수리 연산합니다.
 */
export function calculateInstantDecision(options?: {
  instant?: Date;
  questionText?: string;
}): InstantDecisionResult {
  const now = options?.instant || new Date();
  const nowUtcIso = now.toISOString();

  // KST (UTC+9) 기준 시간 요소 추출
  const kstTime = new Date(now.getTime() + 9 * 3600000);
  const nowKstIso = formatInstantDecisionKstTimestamp(now);

  const year = kstTime.getUTCFullYear();
  const month = kstTime.getUTCMonth() + 1;
  const day = kstTime.getUTCDate();
  const hours = kstTime.getUTCHours();
  const minutes = kstTime.getUTCMinutes();

  // 1. 년지수 산출 (2026 병오년 = 오(7))
  // 기준: 2024=진(5), 2025=사(6), 2026=오(7), 2027=미(8) 등
  const yearBranchIndex = (year - 4) % 12; // 0=자, 1=축 ... 6=오
  const yearBranchNum = yearBranchIndex + 1; // 1~12
  const yearBranchKr = BRANCH_NUMS[yearBranchIndex] || '오';

  // 시지수 산출
  const { branchNum: hourBranchNum, branchKr: hourBranchKr } = getHourBranchInfo(hours);

  // 매화역수 공식:
  // 상괘수 = (년지수 + 월 + 일) % 8 (0이면 8)
  const upperSum = yearBranchNum + month + day;
  const upperTrigramNum = (upperSum % 8 === 0) ? 8 : (upperSum % 8);

  // 하괘수 = (상괘합 + 시지수) % 8 (0이면 8)
  const lowerSum = upperSum + hourBranchNum;
  const lowerTrigramNum = (lowerSum % 8 === 0) ? 8 : (lowerSum % 8);

  // 동효수 = (상괘합 + 시지수 + 분) % 6 (0이면 6, 정밀 분 단위 반영)
  const movingSum = upperSum + hourBranchNum + Math.floor(minutes / 10);
  const movingLine = (movingSum % 6 === 0) ? 6 : (movingSum % 6);

  const upperMeta = TRIGRAM_CATALOG[upperTrigramNum];
  const lowerMeta = TRIGRAM_CATALOG[lowerTrigramNum];

  // 6효 비트 배열 구성 (초효~3효: 하괘, 4효~상효: 상괘)
  const primaryBits: number[] = [
    ...lowerMeta.bits,
    ...upperMeta.bits
  ];

  // 본괘(本卦)
  const primaryHex = hexagram(primaryBits);

  // 호괘(互卦): 2·3·4효가 하괘, 3·4·5효가 상괘
  const huguaBits: number[] = [
    primaryBits[1], primaryBits[2], primaryBits[3],
    primaryBits[2], primaryBits[3], primaryBits[4]
  ];
  const huguaHex = hexagram(huguaBits);

  // 변괘(變卦): 동효의 음양 반전
  const changedBits = [...primaryBits];
  changedBits[movingLine - 1] = 1 - changedBits[movingLine - 1];
  const changedHex = hexagram(changedBits);

  // 체용 판별:
  // 동효가 1~3효(하괘)에 있으면 하괘가 용(用), 상괘가 체(體)
  // 동효가 4~6효(상괘)에 있으면 상괘가 용(用), 하괘가 체(體)
  let cheMeta: TrigramMeta;
  let yongMeta: TrigramMeta;
  let changedYongMeta: TrigramMeta;

  if (movingLine <= 3) {
    cheMeta = upperMeta;
    yongMeta = lowerMeta;
    // 변괘의 하괘 메타 재추출
    const chLowerNum = Object.values(TRIGRAM_CATALOG).find(t =>
      t.bits[0] === changedBits[0] && t.bits[1] === changedBits[1] && t.bits[2] === changedBits[2]
    )?.number || 1;
    changedYongMeta = TRIGRAM_CATALOG[chLowerNum];
  } else {
    cheMeta = lowerMeta;
    yongMeta = upperMeta;
    const chUpperNum = Object.values(TRIGRAM_CATALOG).find(t =>
      t.bits[0] === changedBits[3] && t.bits[1] === changedBits[4] && t.bits[2] === changedBits[5]
    )?.number || 1;
    changedYongMeta = TRIGRAM_CATALOG[chUpperNum];
  }

  const cheYongPrimary = evaluateCheYong(cheMeta, yongMeta);
  const cheYongChanged = evaluateCheYong(cheMeta, changedYongMeta);

  // 매화역수 베이스 점수 (기본 60점 + 본괘/변괘 체용 보정)
  let meihuaScore = 60 + cheYongPrimary.scoreDelta + Math.round(cheYongChanged.scoreDelta * 0.8);
  meihuaScore = Math.max(15, Math.min(98, meihuaScore));

  // 2. 기문둔갑 시가 8문 판정
  let dominantGate = '생문(生門)';
  let gateNature: '길문(吉門)' | '흉문(凶門)' | '평문(平門)' = '길문(吉門)';
  let luckyDirections = ['남동쪽(생문)', '북서쪽(개문)', '북쪽(휴문)'];
  let gateActionGuide = '생문(生門)과 개문(開門)의 기운이 열려 있어, 새로운 제안이나 적극적인 추진에 대단히 길합니다.';

  try {
    const qimen = calculateQimen(now);
    const chartObj = qimen.chart as any;
    // 기문둔갑 직사문(直使門) 추출 또는 시진별 주요 길문 감지
    const zhishi = chartObj?.直使 || chartObj?.['直使門'] || '';
    if (zhishi) {
      if (/생문|生門/.test(zhishi)) {
        dominantGate = '생문(生門 · 재물/수익/생기)';
        gateNature = '길문(吉門)';
        gateActionGuide = '막힌 기운을 뚫고 실질적 결실과 수익을 창출하기에 최적인 생문의 시간입니다.';
      } else if (/개문|開門/.test(zhishi)) {
        dominantGate = '개문(開門 · 개척/출발/창업)';
        gateNature = '길문(吉門)';
        gateActionGuide = '새로운 일의 착수, 대외 발표, 이직·계약 개척에 활짝 열린 개문의 시간입니다.';
      } else if (/휴문|休門/.test(zhishi)) {
        dominantGate = '휴문(休門 · 귀인/화합/휴식)';
        gateNature = '길문(吉門)';
        gateActionGuide = '귀인의 도움을 구하거나 갈등을 부드럽게 봉합하고 심신을 충전하기에 길합니다.';
      } else if (/두문|杜門/.test(zhishi)) {
        dominantGate = '두문(杜門 · 비밀/보안/침묵)';
        gateNature = '평문(平門)';
        gateActionGuide = '대외 노출이나 성급한 발언을 삼가고, 내실을 다지며 보안을 유지할 시기입니다.';
      } else if (/경문|景門/.test(zhishi)) {
        dominantGate = '경문(景門 · 문서/계약/화려함)';
        gateNature = '평문(平門)';
        gateActionGuide = '서류 검토나 아이디어 피칭에는 유리하나, 지나친 감정적 흥분을 경계해야 합니다.';
      } else if (/사문|死門/.test(zhishi)) {
        dominantGate = '사문(死門 · 종결/위험/침체)';
        gateNature = '흉문(凶門)';
        gateActionGuide = '기존의 불필요한 고리를 끊어내는 정돈에는 맞으나, 신규 투자나 무리한 전진은 피해야 합니다.';
      } else if (/상문|傷門/.test(zhishi)) {
        dominantGate = '상문(傷門 · 다툼/손실/부딪힘)';
        gateNature = '흉문(凶門)';
        gateActionGuide = '마찰이나 재정적 손실 가능성이 있으니 논쟁을 피하고 방어적으로 임하십시오.';
      } else if (/경문|驚門/.test(zhishi)) {
        dominantGate = '경문(驚門 · 놀람/구설/의혹)';
        gateNature = '흉문(凶門)';
        gateActionGuide = '돌발 변수나 구설수가 생길 수 있으니 의혹을 확실히 검증하고 서두르지 마십시오.';
      }
    }
  } catch (_) {}

  // 기문 가중치 합산 (길문 +10, 평문 0, 흉문 -12)
  let qimenDelta = 0;
  if (gateNature === '길문(吉門)') qimenDelta = +10;
  else if (gateNature === '흉문(凶門)') qimenDelta = -12;

  const finalScore = Math.max(10, Math.min(98, meihuaScore + qimenDelta));

  // 결단 등급 및 가이드 도출
  let grade: DecisionVerdictGrade = '관망 및 조율 (Wait & See)';
  let oneLineConclusion = '';
  let strategicTiming = '';
  let doNow = '';
  let avoidNow = '';
  let optimalWindow = '';

  if (finalScore >= 85) {
    grade = '적극 추진 (Strong Go)';
    oneLineConclusion = `기운이 온전히 내 편으로 돌아서 있으니, 망설이지 말고 자신감 있게 바로 실행하십시오.`;
    strategicTiming = `지금 이 순간이 가장 강력한 모멘텀이며, 상대방이나 상황 역시 호의적으로 반응합니다.`;
    doNow = `준비해 둔 핵심 제안을 즉시 전달하고 과감하게 승부수를 띄우기`;
    avoidNow = `과도한 걱정으로 타이밍을 놓치거나 주변 눈치를 보며 주저하기`;
    optimalWindow = `오늘 중 ${hours}시~${(hours + 2) % 24}시 사이가 가장 강력한 승부처`;
  } else if (finalScore >= 70) {
    grade = '전략적 진행 (Moderate Go)';
    oneLineConclusion = `내가 주도권을 쥐고 있으나, 디테일한 조건을 한 번 더 정돈한 뒤 밀어붙이면 성과가 납니다.`;
    strategicTiming = `상황이 유리하게 전개되고 있으므로, 차분하게 명분을 세우고 진행하면 뜻을 이룹니다.`;
    doNow = `상대방의 니즈를 한 번 더 확인하고 명문화된 조건으로 정리해 추진하기`;
    avoidNow = `감정적으로 조급하게 결론을 재촉하거나 불필요한 타협을 서두르기`;
    optimalWindow = `오늘 오후 또는 다음 시진 진입 직후`;
  } else if (finalScore >= 50) {
    grade = '관망 및 조율 (Wait & See)';
    oneLineConclusion = `당장 결론을 내기보다는 반 발짝 물러서서 상대방의 패와 전체 판세를 관망할 때입니다.`;
    strategicTiming = `흐름이 아직 무르익지 않았으므로 선제공격보다 정보 수집과 내실 정비가 현명합니다.`;
    doNow = `상황의 숨은 변수와 의도를 파악하고 대안(Plan B)을 검토하기`;
    avoidNow = `불안감 때문에 무리하게 먼저 연락하거나 올인 배팅하기`;
    optimalWindow = `1~2일 후 흐름이 명료해질 때까지 잠시 호흡 고르기`;
  } else if (finalScore >= 35) {
    grade = '신중 보류 (Caution)';
    oneLineConclusion = `보이지 않는 마찰이나 에너지 소모가 예상되니, 약속이나 서명을 잠시 뒤로 미루십시오.`;
    strategicTiming = `상대방의 입장이 불투명하거나 환경적 저항이 있는 타이밍입니다.`;
    doNow = `조건을 원점에서 재검토하고 모호한 조항을 확실하게 짚고 넘어가기`;
    avoidNow = `분위기에 휩쓸려 충동적으로 계약하거나 감정 섞인 메시지 보내기`;
    optimalWindow = `최소 다음 날 오전 새로운 일진이 밝아온 후 재검토`;
  } else {
    grade = '철회 및 방어 (Strong Stop)';
    oneLineConclusion = `정면 돌파 시 손실이나 상처가 클 수 있으니, 지금은 방어선을 치고 물러서는 것이 상책입니다.`;
    strategicTiming = `외부의 반대나 거센 저항이 도사리고 있으므로 무리한 고집을 꺾고 자원을 지켜야 합니다.`;
    doNow = `정중하게 거절하거나 안전한 거리를 유지하며 리스크를 차단하기`;
    avoidNow = `자존심을 세우며 억지로 부딪히거나 위험한 제안을 덜컥 수락하기`;
    optimalWindow = `이 안건은 잠시 내려놓고 본래의 본업과 평온에 집중하기`;
  }

  const instantDecisionSynthesisMatrix = {
    dominantTension: `${primaryHex.name}(${cheYongPrimary.relationType}) ↔ ${changedHex.name}(${cheYongChanged.relationType})`,
    alignmentState: `${grade} · ${dominantGate}(${gateNature})`,
    integratedAction: `${doNow}${options?.questionText ? ` [질문 맥락: ${options.questionText.slice(0, 40)}]` : ''}`,
  };

  return {
    engineVersion: INSTANT_DECISION_ENGINE_VERSION,
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),

    questionSnippet: (options?.questionText || '즉시 결단 질의').slice(0, 50),
    targetInstantTime: `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 (${hourBranchKr}시)`,

    meihua: {
      timeNumbers: {
        yearBranchNum,
        yearBranchKr,
        monthNum: month,
        dayNum: day,
        hourBranchNum,
        hourBranchKr,
      },
      upperTrigramNum,
      lowerTrigramNum,
      movingLine,

      primaryHexagram: {
        number: primaryHex.number,
        name: primaryHex.name,
        upper: primaryHex.upper,
        lower: primaryHex.lower,
      },
      huguaHexagram: {
        number: huguaHex.number,
        name: huguaHex.name,
        upper: huguaHex.upper,
        lower: huguaHex.lower,
      },
      changedHexagram: {
        number: changedHex.number,
        name: changedHex.name,
        upper: changedHex.upper,
        lower: changedHex.lower,
      },

      cheYongPrimary,
      cheYongChanged,
      meihuaScore,
    },

    qimenGates: {
      currentHourBranch: `${hourBranchKr}시`,
      dominantGate,
      gateNature,
      luckyDirections,
      gateActionGuide,
    },

    verdict: {
      finalScore,
      grade,
      oneLineConclusion,
      strategicTiming,
      actionProtocol: {
        doNow,
        avoidNow,
        optimalWindow,
      },
    },
    instantDecisionSynthesisMatrix,
    ritualAction: `본괘 ${primaryHex.name}과 ${dominantGate}(${gateNature}) 흐름에 맞추어 지금 당장 '${doNow}'를 실행하고, '${avoidNow}'는 보류하세요.`,
    reflectionFocus: `즉시 결단(${primaryHex.name} → ${changedHex.name}) — ${cheYongPrimary.relationType} · ${dominantGate}(${grade})`,
    reflectiveQuestion: options?.questionText
      ? `‘${options.questionText.slice(0, 40)}’ 앞에서 본괘 ${primaryHex.name}과 ${dominantGate}(${gateNature})의 신호를 바탕으로 지금 당장 취할 현실적 한 걸음은 무엇입니까?`
      : `본괘 ${primaryHex.name}에서 변괘 ${changedHex.name}로 흐르는 지금, ${doNow}를 실행하기 위해 먼저 점검할 조건은 무엇입니까?`,
    interpretiveBoundary: '본 매화역수·기문둔갑 즉시 결단 리포트는 시간작괘와 시가팔문 원리에 기반한 정성적 타이밍 성찰 안내이며, 법률·투자·계약의 확정적 판단을 대신하지 않습니다.',
  };
}

/**
 * 즉시 결단 매화역수 & 기문둔갑 리포트를
 * LLM 마스터 프롬프트에 주입하기 위해 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatInstantDecisionPrompt(res: InstantDecisionResult): string {
  const m = res.meihua;
  const q = res.qimenGates;
  const v = res.verdict;

  return `[⚡ 즉시 결단 매화역수 & 기문둔갑 시가팔문 실측 데이터 (Instant Chrono-Decision Core)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 시각: ${res.calculatedAtKst} | 질의 시각: ${res.targetInstantTime}
종합 결단 방향: ★ [${v.grade}]
결론: "${v.oneLineConclusion}"
======================================================================
1. [소강절 매화역수(梅花易數) 시간작괘 실측]:
   - 시각 수리: ${m.timeNumbers.yearBranchKr}(${m.timeNumbers.yearBranchNum})년 ${m.timeNumbers.monthNum}월 ${m.timeNumbers.dayNum}일 ${m.timeNumbers.hourBranchKr}(${m.timeNumbers.hourBranchNum})시 -> 동효: [제${m.movingLine}효]
   - 본괘(本卦 · 현재): 제${m.primaryHexagram.number}괘 [${m.primaryHexagram.name}] (상:${m.primaryHexagram.upper} / 하:${m.primaryHexagram.lower})
   - 호괘(互卦 · 내막): 제${m.huguaHexagram.number}괘 [${m.huguaHexagram.name}]
   - 변괘(變卦 · 결말): 제${m.changedHexagram.number}괘 [${m.changedHexagram.name}]
   - 체용(體用) 생극 분석:
     * 본괘 체용: [${m.cheYongPrimary.relationType}] (${m.cheYongPrimary.relationQuality}) -> ${m.cheYongPrimary.description}
     * 변괘 체용: [${m.cheYongChanged.relationType}] (${m.cheYongChanged.relationQuality}) -> ${m.cheYongChanged.description}

2. [기문둔갑 시가팔문(時家八門) 실시간 국수]:
   - 현재 시진: ${q.currentHourBranch} | 주도 팔문: ★ [${q.dominantGate}] (${q.gateNature})
   - 행동 지침: ${q.gateActionGuide}
   - 실시간 길방위: ${q.luckyDirections.join(', ')}

3. [실천 액션 프로토콜]:
   - 타이밍 전략: ${v.strategicTiming}
   - 지금 취할 행동(DO): ${v.actionProtocol.doNow}
   - 지금 피할 행동(AVOID): ${v.actionProtocol.avoidNow}
   - 최적의 실행 시간대: ${v.actionProtocol.optimalWindow}
${res.instantDecisionSynthesisMatrix ? `4. [교차 매트릭스]:
   - 핵심 긴장: ${res.instantDecisionSynthesisMatrix.dominantTension}
   - 조율 상태: ${res.instantDecisionSynthesisMatrix.alignmentState}
   - 통합 실천: ${res.instantDecisionSynthesisMatrix.integratedAction}` : ''}
${res.reflectiveQuestion ? `- 성찰 질문: ${res.reflectiveQuestion}\n` : ''}- 실천 의례: ${res.ritualAction}
- 성찰 초점: ${res.reflectionFocus}
- 해석 경계: ${res.interpretiveBoundary}
======================================================================
[★ 루시 즉시 결단 답변 지침]:
- 사용자가 '지금 할까 말까?', 'A vs B', '연락할까?', '계약할까?'를 물었을 때 위 실측 괘와 기문 8문을 명쾌한 승부수 언어로 풀어줘.
- 모호하게 말을 흐리지 말고, 본괘의 현재 상황과 변괘의 귀결, 그리고 기문 팔문의 문턱을 근거로 삼아 확신에 찬 방향성을 단호하고 다정하게 제시해줘.`;
}
