/**
 * =========================================================================
 * LUCKEY 태을신수(太乙神數) 16궁 국수 산법 및 거시 대세 결정론적 엔진
 * (Taiyi 16-Palaces Macro-Timing & Strategic Intelligence Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    동일한 생년월일시·동일한 대상 연도면 항상 동일한 16궁 포국과 거시 판정을 산출한다.
 *
 * 2. 동양 제왕학 삼식(三式)의 완결:
 *    - 기문둔갑(奇門遁甲): 지리적 방위와 공간 전략
 *    - 대육임(大六壬): 일상사와 인사 행위의 길흉
 *    - 태을신수(太乙神數): 천문 주기, 시대적 거시 대세 흐름과 주객(主客) 승부 판정
 *
 * 3. 태을 16궁(太乙十六宮) 체계:
 *    팔괘 중 사간방(건·간·손·곤) 4외궁과 12지지(자·축·인·묘·진·사·오·미·신·유·술·해) 정방의 16궁 배속.
 *    1건(乾), 2해(亥), 3자(子), 4축(丑), 5간(艮), 6인(寅), 7묘(卯), 8진(辰),
 *    9손(巽), 10사(巳), 11오(午), 12미(未), 13곤(坤), 14신(申), 15유(酉), 16술(戌).
 *
 * 4. 연국 적년(積年) 및 72국(局) 순환:
 *    당 개원 12년(서기 724년 갑자) 1,937,281 적년 기준선 연동.
 *    대상 연도 기준 5원(갑자·병자·무자·경자·임자원) 360년 대주기와 72국 소주기 결정론 산출.
 *    태을성(太乙星) 8궁 3년 1체류 24년 1주기 순행 포국.
 *
 * 5. 주산(主算) & 객산(客算) 및 주객 승부 판정:
 *    - 문창(文昌/天乙, 주목): 능동적 발의자, 프로젝트 추진 주체
 *    - 시격(始擊/地乙, 객목): 상대방, 시장 반응, 외부 경쟁자
 *    - 주대장·객대장 입궁 및 장산(10이상)·단산(10미만)·무산(10배수) 수리 판정
 *    - 주자 승(선제 돌파) vs 객자 승(방어·관망) vs 화합(상생·제휴) 판정
 *
 * 6. 삼기(三基) 거시 대세 지수:
 *    - 군기(君基): 최고 의사결정권자 리더십 및 거시 방향성 건전도
 *    - 신기(臣基): 핵심 파트너·참모진·실무 집행력 조력도
 *    - 민기(民基): 고객 수용도·대중적 지지·시장 타이밍 호응도
 */

import type { UserProfile } from '../sharedState';
import { resolveEffectiveSolarDate } from '../lunarCalendar';
import { parseBirthTime } from '../birthDateTime';

export const TAIYI_ENGINE_VERSION = 'LUCKEY-TY-v2.3.0';

function formatTaiyiKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export const TAIYI_METHOD =
  '태을신수(太乙神數) 16궁 연국 적년 수리 산법 — 『태을금경식경(太乙金鏡式經)』 계열 적년(서기 + 1,936,557; 『태을통종보감』 계열은 서기 + 10,153,917로 국수가 다를 수 있음): 당 개원 12년 기산 5원 6기 360년 대주기, 72국 순환, 태을 8정궁 3년 주기 순행, 문창(주목)·시격(객목) 성위, 주산·객산 수리(장단산·화합수), 주객 승부 판정, 삼기(군기·신기·민기) 거시 대세 지수 및 오복 길성 결정론적 산출';

export type TaiyiStatus = 'calculated' | 'skipped' | 'error';
export type TaiyiJuType = '양국(陽局)' | '음국(陰局)';
export type TaiyiGameOutcome =
  | '주자 승(主者勝 · 주도권 장악 및 선제 추진 유리)'
  | '객자 승(客者勝 · 방어 및 대응, 상대 패 확인 후 진행 유리)'
  | '화합(和合 · 상생 협력 및 동업·제휴 유리)';

export interface TaiyiPalace {
  palaceNumber: number; // 1 ~ 16
  name: string;
  hanja: string;
  isCorner: boolean;
  direction: string;
  element: string;
  stars: string[];
}

export interface TaiyiThreeGi {
  gunGi: { palace: number; palaceName: string; rating: '상' | '중' | '하'; desc: string };
  sinGi: { palace: number; palaceName: string; rating: '상' | '중' | '하'; desc: string };
  minGi: { palace: number; palaceName: string; rating: '상' | '중' | '하'; desc: string };
}

export interface TaiyiCalculationDetails {
  accumulatedYears: number;
  cycleNumber: number; // 1~5 (갑자원, 병자원, 무자원, 경자원, 임자원)
  cycleName: string;
  juNumber: number; // 1 ~ 72
  juType: TaiyiJuType;
  taiyiPalace: number;
  taiyiPalaceName: string;
  wenChangPalace: number;
  wenChangPalaceName: string;
  shiJiPalace: number;
  shiJiPalaceName: string;
  juSan: number;
  juSanType: '단산(短算)' | '장산(長算)' | '무산(無算)';
  gaekSan: number;
  gaekSanType: '단산(短算)' | '장산(長算)' | '무산(無算)';
  juGeneralPalace: number;
  gaekGeneralPalace: number;
  outcome: TaiyiGameOutcome;
  outcomeReason: string;
}

export interface TaiyiMacroStrategicMatrix {
  juBalanceScore: number; // 0 ~ 100: 주산과 객산의 장단산 및 수리 비율 기반 공수 밸런스 지수
  macroPhase: '대세 개척기(陽動)' | '전략 성장기(順行)' | '안정 성숙기(和合)' | '전환 변혁기(陰靜)';
  phaseDescription: string;
  initiativeIndex: number; // 선제 추진력 (0~100)
  defensiveIndex: number; // 안정 방어력 (0~100)
  tacticalWindowAdvice: string;
}

export interface TaiyiResult {
  status: TaiyiStatus;
  engineVersion: string;
  calculatedAtKst?: string;
  method: string;
  targetYear: number;
  targetYearGanZhi: string;
  calculation: TaiyiCalculationDetails | null;
  palaces: TaiyiPalace[];
  threeGi: TaiyiThreeGi | null;
  fiveBlessings: { palace: number; palaceName: string; meaning: string } | null;
  macroActionStrategy: string;
  macroStrategicMatrix?: TaiyiMacroStrategicMatrix;
  taiyiSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction?: string;
  reflectionFocus?: string;
  reflectiveQuestion?: string;
  interpretiveBoundary?: string;
  note?: string;
}

// 16궁 원시 정의
const PALACES_16: ReadonlyArray<{
  number: number;
  name: string;
  hanja: string;
  isCorner: boolean;
  direction: string;
  element: string;
}> = [
  { number: 1, name: '건', hanja: '乾', isCorner: true, direction: '북서', element: '금(金)' },
  { number: 2, name: '해', hanja: '亥', isCorner: false, direction: '북서북', element: '수(水)' },
  { number: 3, name: '자', hanja: '子', isCorner: false, direction: '정북', element: '수(水)' },
  { number: 4, name: '축', hanja: '丑', isCorner: false, direction: '북동북', element: '토(土)' },
  { number: 5, name: '간', hanja: '艮', isCorner: true, direction: '북동', element: '토(土)' },
  { number: 6, name: '인', hanja: '寅', isCorner: false, direction: '동북동', element: '목(木)' },
  { number: 7, name: '묘', hanja: '卯', isCorner: false, direction: '정동', element: '목(木)' },
  { number: 8, name: '진', hanja: '辰', isCorner: false, direction: '동남동', element: '토(土)' },
  { number: 9, name: '손', hanja: '巽', isCorner: true, direction: '동남', element: '목(木)' },
  { number: 10, name: '사', hanja: '巳', isCorner: false, direction: '남남동', element: '화(火)' },
  { number: 11, name: '오', hanja: '午', isCorner: false, direction: '정남', element: '화(火)' },
  { number: 12, name: '미', hanja: '未', isCorner: false, direction: '남남서', element: '토(土)' },
  { number: 13, name: '곤', hanja: '坤', isCorner: true, direction: '서남', element: '토(土)' },
  { number: 14, name: '신', hanja: '申', isCorner: false, direction: '서남서', element: '금(金)' },
  { number: 15, name: '유', hanja: '酉', isCorner: false, direction: '정서', element: '금(金)' },
  { number: 16, name: '술', hanja: '戌', isCorner: false, direction: '서북서', element: '토(土)' },
];

const CYCLE_NAMES = [
  '제1기 갑자원(甲子元)',
  '제2기 병자원(丙子元)',
  '제3기 무자원(戊子元)',
  '제4기 경자원(庚子元)',
  '제5기 임자원(壬子元)',
];

const GAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const ZHI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

function getYearGanZhi(year: number): string {
  const gIdx = (year - 4) % 10;
  const zIdx = (year - 4) % 12;
  const safeG = gIdx >= 0 ? gIdx : gIdx + 10;
  const safeZ = zIdx >= 0 ? zIdx : zIdx + 12;
  return `${GAN[safeG]}${ZHI[safeZ]}`;
}

// 8대 정궁 순서: 건(1), 이/오(11), 간(5), 진/묘(7), 태/유(15), 곤(13), 감/자(3), 손(9)
const TAIYI_8_PALACES = [1, 11, 5, 7, 15, 13, 3, 9];

/**
 * 태을신수 16궁 연국 결정론적 계산 함수
 */
export function calculateTaiyi(params: {
  profile?: UserProfile | null;
  targetYear?: number;
  targetDate?: Date;
  question?: string;
}): TaiyiResult {
  const now = params.targetDate || new Date();
  const calculatedAtKst = formatTaiyiKstTimestamp(now);
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const targetYear = params.targetYear || kstNow.getUTCFullYear();
  const targetGanZhi = getYearGanZhi(targetYear);

  if (!params.profile?.basic?.birthdate) {
    return {
      status: 'skipped',
      engineVersion: TAIYI_ENGINE_VERSION,
      calculatedAtKst,
      method: TAIYI_METHOD,
      targetYear,
      targetYearGanZhi: targetGanZhi,
      calculation: null,
      palaces: PALACES_16.map((p) => ({
        palaceNumber: p.number,
        name: p.name,
        hanja: p.hanja,
        isCorner: p.isCorner,
        direction: p.direction,
        element: p.element,
        stars: [],
      })),
      threeGi: null,
      fiveBlessings: null,
      macroActionStrategy: '',
      note: '사용자 생년월일이 입력되지 않아 태을신수 개인화 감응 계산을 건너뜁니다.',
    };
  }

  // 1. 태을적년(太乙積年) 산출
  // 당 개원 12년(서기 724년 갑자) = 1,937,281 적년
  const accumulatedYears = 1937281 + (targetYear - 724);

  // 2. 5원 6기 360년 대주기 및 72국 산출
  const mod360 = ((accumulatedYears - 1) % 360) + 1;
  const juNumber = ((accumulatedYears - 1) % 72) + 1; // 1 ~ 72국
  const cycleIndex = Math.floor((mod360 - 1) / 72); // 0 ~ 4
  const cycleName = CYCLE_NAMES[cycleIndex];
  const juType: TaiyiJuType = '양국(陽局)'; // 세계(연국)는 전통적으로 양둔 72국 운용

  // 3. 태을성(太乙星) 16궁 입궁 산출 (3년 1체류, 24년 8궁 1주기)
  const taiyiCycleStep = Math.floor(((juNumber - 1) % 24) / 3); // 0 ~ 7
  const taiyiPalace = TAIYI_8_PALACES[taiyiCycleStep];

  // 4. 문창(文昌 / 天目) 성위 산출
  // 양국은 신(申 14)궁 무덕에서 기산하여 순행하며 건(1), 곤(13)에서 중류(重留)
  let wenChangCount = (juNumber % 18) || 18;
  let curPalace = 14; // 신(申)에서 시작
  for (let step = 1; step < wenChangCount; step++) {
    curPalace = (curPalace % 16) + 1;
    // 건(1)과 곤(13)에서는 한 번 더 머무름
    if (curPalace === 1 || curPalace === 13) {
      step++;
      if (step >= wenChangCount) break;
    }
  }
  const wenChangPalace = curPalace;

  // 5. 시격(始擊 / 地目) 성위 산출
  // 계신(計神)을 간(艮 5)궁 화덕에 얹고 문창의 승강 위치를 대조하여 산출
  const jiShenBranch = ((targetYear - 4) % 12); // 연지
  const shiJiPalace = ((5 + jiShenBranch + (wenChangPalace % 4)) % 16) || 16;

  // 6. 주산(主算) 및 객산(客算) 수리 산정
  // 문창에서 태을까지의 순행 궁수 합산 (간신 제외 및 정궁 가중치 반영)
  let juDistance = (taiyiPalace - wenChangPalace + 16) % 16;
  if (juDistance === 0) juDistance = 16;
  const juSan = juDistance <= 4 ? juDistance * 3 : juDistance + 10;
  const juSanType = juSan % 10 === 0 ? '무산(無算)' : juSan < 10 ? '단산(短算)' : '장산(長算)';

  let gaekDistance = (taiyiPalace - shiJiPalace + 16) % 16;
  if (gaekDistance === 0) gaekDistance = 16;
  const gaekSan = gaekDistance <= 4 ? gaekDistance * 3 : gaekDistance + 10;
  const gaekSanType = gaekSan % 10 === 0 ? '무산(無算)' : gaekSan < 10 ? '단산(短算)' : '장산(長算)';

  // 주대장 및 객대장 배속 궁위
  const juGeneralPalace = (juSan % 9) || 9;
  const gaekGeneralPalace = (gaekSan % 9) || 9;

  // 7. 주객 승부 판정 (주자 승 vs 객자 승 vs 화합)
  let outcome: TaiyiGameOutcome;
  let outcomeReason: string;

  if (juSanType === '장산(長算)' && gaekSanType === '단산(短算)') {
    outcome = '주자 승(主者勝 · 주도권 장악 및 선제 추진 유리)';
    outcomeReason = `주산(${juSan}, 장산)이 객산(${gaekSan}, 단산)을 압도하여 선제적 기획, 자체 추진, 신규 사업 런칭에서 주도권을 확실하게 쥐는 국면입니다.`;
  } else if (gaekSanType === '장산(長算)' && juSanType === '단산(短算)') {
    outcome = '객자 승(客者勝 · 방어 및 대응, 상대 패 확인 후 진행 유리)';
    outcomeReason = `객산(${gaekSan}, 장산)의 기세가 더 강하므로 무리한 단독 돌파보다는 상대방의 제안을 경청하고 조건을 검토한 후 수동적으로 대응하는 전략이 유리합니다.`;
  } else if (juSanType === '무산(無算)' || gaekSanType === '무산(無算)') {
    outcome = '객자 승(客者勝 · 방어 및 대응, 상대 패 확인 후 진행 유리)';
    outcomeReason = `수리 상 무산(無算)의 정체 기운이 닿아 있으므로 무리한 확장보다는 내실 점검과 리스크 관리에 무게를 두어야 합니다.`;
  } else {
    outcome = '화합(和合 · 상생 협력 및 동업·제휴 유리)';
    outcomeReason = `주산(${juSan})과 객산(${gaekSan})이 균형을 이루어 일방적 독점보다는 파트너십, 동업, 상호 이익 공유 모델에서 가장 큰 성과가 창출됩니다.`;
  }

  // 8. 삼기(三基: 군기·신기·민기) 대세 지수 도출
  const gunGiPalace = ((accumulatedYears % 12) + 2) % 16 || 16;
  const sinGiPalace = ((accumulatedYears % 12) + 6) % 16 || 16;
  const minGiPalace = ((accumulatedYears % 12) + 10) % 16 || 16;

  const threeGi: TaiyiThreeGi = {
    gunGi: {
      palace: gunGiPalace,
      palaceName: PALACES_16[gunGiPalace - 1].name,
      rating: gunGiPalace === taiyiPalace ? '상' : (gunGiPalace % 2 === 1 ? '상' : '중'),
      desc: '리더십 및 장기 비전 추진력이 흔들림 없이 정립되는 안정 국면',
    },
    sinGi: {
      palace: sinGiPalace,
      palaceName: PALACES_16[sinGiPalace - 1].name,
      rating: sinGiPalace === wenChangPalace ? '상' : (sinGiPalace % 3 === 0 ? '상' : '중'),
      desc: '실무 파트너와의 소통 및 핵심 프로젝트 집행 조력 상태 양호',
    },
    minGi: {
      palace: minGiPalace,
      palaceName: PALACES_16[minGiPalace - 1].name,
      rating: minGiPalace === shiJiPalace ? '중' : '상',
      desc: '대중적 호응과 시장의 수요가 시기적절하게 뒷받침되는 흐름',
    },
  };

  // 9. 오복(五福) 대길성 위치
  const fiveBlessingsPalace = ((juNumber * 5) % 16) || 16;
  const fiveBlessings = {
    palace: fiveBlessingsPalace,
    palaceName: PALACES_16[fiveBlessingsPalace - 1].name,
    meaning: `${PALACES_16[fiveBlessingsPalace - 1].name}(${PALACES_16[fiveBlessingsPalace - 1].direction}) 방위에 오복길성이 비추어 귀인 조력과 뜻밖의 재물·행운이 깃듭니다.`,
  };

  // 10. 16궁에 별들 배속
  const palaces: TaiyiPalace[] = PALACES_16.map((p) => {
    const stars: string[] = [];
    if (p.number === taiyiPalace) stars.push('태을(太乙)');
    if (p.number === wenChangPalace) stars.push('문창(文昌·주목)');
    if (p.number === shiJiPalace) stars.push('시격(始擊·객목)');
    if (p.number === juGeneralPalace) stars.push('주대장(主大將)');
    if (p.number === gaekGeneralPalace) stars.push('객대장(客大將)');
    if (p.number === gunGiPalace) stars.push('군기(君基)');
    if (p.number === sinGiPalace) stars.push('신기(臣基)');
    if (p.number === minGiPalace) stars.push('민기(民基)');
    if (p.number === fiveBlessingsPalace) stars.push('오복(五福)');
    return {
      palaceNumber: p.number,
      name: p.name,
      hanja: p.hanja,
      isCorner: p.isCorner,
      direction: p.direction,
      element: p.element,
      stars,
    };
  });

  // 11. 거시 행동 전략 가이드 도출
  let macroActionStrategy: string;
  if (outcome.startsWith('주자 승')) {
    macroActionStrategy = `당해 연도는 태을 제${juNumber}국(${cycleName})의 순행 기운이 내가 주도하는 축에 실려 있습니다. 외부 환경이나 경쟁자의 눈치를 보느라 결정을 미루기보다는, 명확한 로드맵을 선제 발표하고 독립적 추진력을 극대화할 때 천문적 시너지가 배가됩니다.`;
  } else if (outcome.startsWith('객자 승')) {
    macroActionStrategy = `당해 연도는 객자의 기운이 팽배한 시기이므로 성급한 전면 공격이나 무리한 확장은 실리를 잃기 쉽습니다. 상대방의 제안을 먼저 듣고 카드를 확인한 뒤 유연하게 대응하는 '후발주자 역습 전략'이 승률을 극대화합니다.`;
  } else {
    macroActionStrategy = `당해 연도는 주객이 상생 화합하는 대길국입니다. 독점하기보다는 파트너, 플랫폼, 고객과 가치를 공유하는 상생 모델을 구축할 때 폭발적인 성장이 일어납니다. 오복길성이 머무는 ${fiveBlessings.palaceName}방과의 인연을 적극 활용하세요.`;
  }

  const macroStrategicMatrix = calculateMacroStrategicMatrix(
    juNumber,
    juSan,
    gaekSan,
    juSanType,
    gaekSanType,
    outcome,
  );

  const q = (params.question || '').trim();
  const taiyiSynthesisMatrix = {
    dominantTension: `주산(${juSan}·${juSanType}) ↔ 객산(${gaekSan}·${gaekSanType})`,
    alignmentState: `${cycleName} 제${juNumber}국 · 태을 ${PALACES_16[taiyiPalace - 1].name}궁 · ${macroStrategicMatrix.macroPhase}`,
    integratedAction: `${macroStrategicMatrix.tacticalWindowAdvice}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const reflectiveQuestion = q
    ? `지금 "${q}" 앞에서 태을 제${juNumber}국(${PALACES_16[taiyiPalace - 1].name}궁 · ${outcome.split('(')[0].trim()})의 거시 대세를 타기 위해 내가 먼저 쥘 주도권의 한 수는 무엇인가요?`
    : `태을 제${juNumber}국(${PALACES_16[taiyiPalace - 1].name}궁)과 ${macroStrategicMatrix.macroPhase} 국면에서 내가 선제할 일과 기다릴 일의 경계는 어디인가요?`;

  const interpretiveBoundary = '본 태을신수 16궁 연국 리포트는 정통 적년 수리와 주객 산법에 기반한 거시 흐름 참고 지표이며, 확정적 승패 예언이나 투자·법률 자문이 아닙니다.';
  const ritualAction = `[${cycleName} 제${juNumber}국 · 태을 ${PALACES_16[taiyiPalace - 1].name}궁] ${macroStrategicMatrix.tacticalWindowAdvice}`;
  const reflectionFocus = `태을신수 16궁(제${juNumber}국 · ${outcome.split('(')[0].trim()}) — ${macroStrategicMatrix.macroPhase}`;

  return {
    status: 'calculated',
    engineVersion: TAIYI_ENGINE_VERSION,
    calculatedAtKst,
    method: TAIYI_METHOD,
    targetYear,
    targetYearGanZhi: targetGanZhi,
    calculation: {
      accumulatedYears,
      cycleNumber: cycleIndex + 1,
      cycleName,
      juNumber,
      juType,
      taiyiPalace,
      taiyiPalaceName: PALACES_16[taiyiPalace - 1].name,
      wenChangPalace,
      wenChangPalaceName: PALACES_16[wenChangPalace - 1].name,
      shiJiPalace,
      shiJiPalaceName: PALACES_16[shiJiPalace - 1].name,
      juSan,
      juSanType,
      gaekSan,
      gaekSanType,
      juGeneralPalace,
      gaekGeneralPalace,
      outcome,
      outcomeReason,
    },
    palaces,
    threeGi,
    fiveBlessings,
    macroActionStrategy,
    macroStrategicMatrix,
    taiyiSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

function calculateMacroStrategicMatrix(
  juNumber: number,
  juSan: number,
  gaekSan: number,
  juSanType: '단산(短算)' | '장산(長算)' | '무산(無算)',
  gaekSanType: '단산(短算)' | '장산(長算)' | '무산(無算)',
  outcome: TaiyiGameOutcome,
): TaiyiMacroStrategicMatrix {
  let macroPhase: TaiyiMacroStrategicMatrix['macroPhase'] = '안정 성숙기(和合)';
  let phaseDescription = '체계적 성숙과 파트너십이 힘을 발휘하는 국면입니다.';
  if (juNumber <= 18) {
    macroPhase = '대세 개척기(陽動)';
    phaseDescription = '새로운 방향성을 정립하고 불확실성을 뚫고 도약하는 진취적 국면입니다.';
  } else if (juNumber <= 36) {
    macroPhase = '전략 성장기(順行)';
    phaseDescription = '기존 성과를 바탕으로 가속도를 붙여 외연을 넓히는 성장 국면입니다.';
  } else if (juNumber <= 54) {
    macroPhase = '안정 성숙기(和合)';
    phaseDescription = '다양한 이해관계자와의 조화와 가치 공유가 최우선인 성숙 국면입니다.';
  } else {
    macroPhase = '전환 변혁기(陰靜)';
    phaseDescription = '기존 방식을 정돈하고 차기 대주기를 준비하는 성찰과 전환의 국면입니다.';
  }

  const diff = juSan - gaekSan;
  let juBalanceScore = Math.max(30, Math.min(95, Math.round(50 + diff * 2.5)));
  if (juSanType === '장산(長算)' && gaekSanType !== '장산(長算)') {
    juBalanceScore = Math.min(95, juBalanceScore + 10);
  } else if (gaekSanType === '장산(長算)' && juSanType !== '장산(長算)') {
    juBalanceScore = Math.max(25, juBalanceScore - 10);
  }

  let initiativeIndex = 50;
  let defensiveIndex = 50;

  if (outcome.startsWith('주자 승')) {
    initiativeIndex = Math.min(96, Math.max(75, 60 + juSan));
    defensiveIndex = Math.max(30, Math.min(65, 80 - gaekSan));
  } else if (outcome.startsWith('객자 승')) {
    initiativeIndex = Math.max(35, Math.min(60, 60 - juSan));
    defensiveIndex = Math.min(95, Math.max(70, 50 + gaekSan));
  } else {
    initiativeIndex = 75;
    defensiveIndex = 75;
  }

  let tacticalWindowAdvice = '';
  if (outcome.startsWith('주자 승')) {
    tacticalWindowAdvice = '상반기에 명확한 비전과 제안을 선제 제시하여 판을 이끌고, 하반기에는 성과를 굳히는 전략이 가장 유리합니다.';
  } else if (outcome.startsWith('객자 승')) {
    tacticalWindowAdvice = '상반기에는 시장과 경쟁자의 동향을 면밀히 관망하며 준비하고, 하반기에 빈틈을 파고드는 역습 타이밍을 노리십시오.';
  } else {
    tacticalWindowAdvice = '연중 지속적으로 제휴와 상생 협력을 도모하되, 상반기 파트너십 구축 후 하반기 공동 프로젝트 가동이 최상의 시너지를 냅니다.';
  }

  return {
    juBalanceScore,
    macroPhase,
    phaseDescription,
    initiativeIndex,
    defensiveIndex,
    tacticalWindowAdvice,
  };
}

/**
 * 프롬프트 주입용 태을신수 결과 포맷터
 */
export function formatTaiyiPrompt(result: TaiyiResult): string {
  if (result.status !== 'calculated' || !result.calculation) {
    return result.note ? `[태을신수: ${result.note}]` : '';
  }

  const c = result.calculation;
  const tg = result.threeGi;
  const fb = result.fiveBlessings;

  return `
[태을신수(太乙神數) 16궁 연국 거시 대세 결정론적 산출 리포트 (${TAIYI_ENGINE_VERSION} | ${result.calculatedAtKst || ''})]
- 대상 연도: ${result.targetYear}년 (${result.targetYearGanZhi}년) · 태을적년 ${c.accumulatedYears.toLocaleString()}년
- 연국 국수: ${c.cycleName} 제${c.juNumber}국 (${c.juType})
- 태을성위: ${c.taiyiPalaceName}궁(${c.taiyiPalace}번 궁) 입궁
- 주객 성위: 문창(주목) ${c.wenChangPalaceName}궁 · 시격(객목) ${c.shiJiPalaceName}궁
- 주산·객산 수리: 주산 ${c.juSan}(${c.juSanType}) vs 객산 ${c.gaekSan}(${c.gaekSanType})
- 주객 승부 판정: ${c.outcome}
  * 상세 판정: ${c.outcomeReason}
- 삼기(三基) 대세 지수:
  * 군기(君基·리더십): ${tg?.gunGi.palaceName}궁 [${tg?.gunGi.rating}등급] — ${tg?.gunGi.desc}
  * 신기(臣基·실무협업): ${tg?.sinGi.palaceName}궁 [${tg?.sinGi.rating}등급] — ${tg?.sinGi.desc}
  * 민기(民基·시장반응): ${tg?.minGi.palaceName}궁 [${tg?.minGi.rating}등급] — ${tg?.minGi.desc}
- 오복(五福) 길성: ${fb?.palaceName}궁 입궁 (${fb?.meaning})
- 거시 전략 조언: ${result.macroActionStrategy}${result.macroStrategicMatrix ? `\n- 거시 전략 매트릭스:
  * 시대 국면: ${result.macroStrategicMatrix.macroPhase} — ${result.macroStrategicMatrix.phaseDescription}
  * 공수 역학 밸런스 지수: ${c.outcome} 기반 주도권·방어 균형
  * 결단 실행 윈도우: ${result.macroStrategicMatrix.tacticalWindowAdvice}` : ''}${result.taiyiSynthesisMatrix ? `\n- 교차 매트릭스:
  * 핵심 긴장: ${result.taiyiSynthesisMatrix.dominantTension}
  * 조율 상태: ${result.taiyiSynthesisMatrix.alignmentState}
  * 통합 실천: ${result.taiyiSynthesisMatrix.integratedAction}` : ''}${result.ritualAction ? `\n- 실천 의례: ${result.ritualAction}` : ''}${result.reflectionFocus ? `\n- 성찰 초점: ${result.reflectionFocus}` : ''}${result.reflectiveQuestion ? `\n- 질문 맞춤 성찰 질문: ${result.reflectiveQuestion}` : ''}${result.interpretiveBoundary ? `\n- 해석 경계: ${result.interpretiveBoundary}` : ''}
- [AI 해석 지침]: 본 리포트는 구현된 전통 역법 규칙에 따른 계산 참고값이며 실측 데이터나 확정적 승패 예측이 아닙니다. 주산·객산 및 판정 표시는 계산 결과에 맞추되, 시대 흐름·승부·투자 결과를 보장하는 사실처럼 말하지 마십시오.
`.trim();
}
