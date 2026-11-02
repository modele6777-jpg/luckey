/**
 * =========================================================================
 * LUCKEY 계약·분쟁 방어 & 관재구설 쉴드 엔진 (Contract Shield Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주명리의 칠살(편관: 급작스러운 외부 압박), 상관견관(기존 규범·계약과의 충돌),
 * 삼형살(축술미·인사신의 은밀한 계약상 덫), 당일 일진의 형충파해, 그리고
 * 주역 천수송(訟: 법적 송사와 분쟁) 괘의 경고를 융합하여 계약·외주·동업 시의
 * 분쟁 리스크 지수(0~100)와 5대 안전 계약 쉴드 체크리스트를 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const CONTRACT_SHIELD_VERSION = 'LUCKEY-SHIELD-v1.0.0';

export interface ContractChecklistItem {
  category: string;
  hanja: string;
  dangerSign: string;           // 방심하면 터지는 독소조항 함정
  shieldRule: string;           // 계약서에 반드시 명시해야 할 방어 문구/규칙
}

export interface ContractShieldResult {
  engineVersion: string;
  calculatedAtIso: string;

  // 계약 & 분쟁 리스크 지수 (0~100, 낮을수록 안전함)
  disputeRiskScore: number;
  riskLevel: 'safe' | 'caution' | 'alert' | 'high_risk';
  riskLevelTitle: string;

  // 감지된 리스크 트리거 요소
  activeRiskTriggers: string[];

  // 주역 천수송(訟) 분쟁 방어 지혜
  ichingSongWisdom: {
    hexagram: string;
    teaching: string;
  };

  // 5대 계약 쉴드 체크리스트
  shieldChecklist: ContractChecklistItem[];

  // 즉각 실천 액션 가이드
  actionProtocol: string;

  summary: string;
}

const DEFAULT_SHIELD_CHECKLIST: ContractChecklistItem[] = [
  {
    category: '지식재산권(IP) 귀속',
    hanja: '權利歸屬',
    dangerSign: '"본 계약과 관련하여 발생한 모든 산출물의 저작권은 발주처에 독점 귀속된다"는 포괄적 양도 조항',
    shieldRule: '기존에 보유한 사전 저작물(Pre-existing IP)과 범용 라이브러리는 제외하고, "최종 대금 완납 시 목적물에 한하여 사용권 이전"으로 명시'
  },
  {
    category: '손해배상 및 책임 상한',
    hanja: '責任上限',
    dangerSign: '간접 손해, 기대 이익 상실까지 물어내라는 무제한 손해배상 독소 조항',
    shieldRule: '"총 손해배상액은 본 계약에 따라 실제로 지급받은 계약금 총액을 초과할 수 없다(Liability Cap)"는 상한선 반드시 삽입'
  },
  {
    category: '과업 범위(SOW) 경계',
    hanja: '業務境界',
    dangerSign: '"기타 발주처가 요구하는 합리적인 업무를 포함한다"는 모호한 늪',
    shieldRule: '인도물 목록과 검수 기준(합격 조건)을 별첨 목록으로 확정하고, "범위 외 추가 작업은 별도 견적 및 일정 조정 후 착수" 원칙 명문화'
  },
  {
    category: '대금 지급 및 마일스톤',
    hanja: '代金支給',
    dangerSign: '최종 납품 후 60일 뒤 지급, 혹은 검수를 무한정 미루며 잔금 지급을 지연시키는 행태',
    shieldRule: '계약금-중도금-잔금 3단계 분할 및 "납품 후 7영업일 이내 서면 이의 제기가 없을 시 자동 검수 완료 간주" 조항 삽입'
  },
  {
    category: '구두 합의 문서화 원칙',
    hanja: '書面原則',
    dangerSign: '카톡이나 전화 통화로 가볍게 "이것도 좀 해줘" 하고 나중에 딴소리하는 분쟁',
    shieldRule: '모든 구두 합의는 즉시 회의록 이메일로 회신하여 "말이 아닌 활자"로 기록을 증거화할 것'
  }
];

/**
 * 계약·분쟁 방어 쉴드 연산 메인 함수
 */
export function calculateContractShield(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): ContractShieldResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const activeRiskTriggers: string[] = [];

  const structures = saju.specialStructures.map(s => s.name);
  const dayZhi = saju.pillars.day.zhi;

  // 1. 편관(칠살) 유무
  if (structures.some(s => s.includes('편관') || s.includes('칠살'))) {
    activeRiskTriggers.push('편관(칠살) 압박: 외부의 급격한 요구조건 변경 및 강압적 조항 주의');
  }

  // 2. 상관견관(傷官見官)
  if (structures.some(s => s.includes('상관'))) {
    activeRiskTriggers.push('상관 기운 활성: 기존 규범이나 계약서의 작은 모순에 대한 날카로운 마찰 가능성');
  }

  // 3. 축술미(丑戌未) 또는 인사신(寅巳申) 삼형살 관련 지지
  const pillars = [saju.pillars.year, saju.pillars.month, saju.pillars.day];
  if (saju.pillars.hour) pillars.push(saju.pillars.hour);
  const zhis = pillars.map(p => p.zhi);

  if (zhis.includes('戌') || zhis.includes('丑') || zhis.includes('未')) {
    activeRiskTriggers.push('축술미 형살 잠재: 지분·금전 정산 시 구두 약속의 변질 및 세부 조항 왜곡 주의');
  }

  // 기본 안전망
  if (activeRiskTriggers.length === 0) {
    activeRiskTriggers.push('일반 계약 주의: 통상적인 업무 범위 및 지급 일정 명문화 필요');
  }

  // 4. 리스크 지수 산출 (0~100)
  let disputeRiskScore = 35; // 기본 안전선
  if (activeRiskTriggers.length >= 2) disputeRiskScore += 20;
  if (activeRiskTriggers.some(t => t.includes('형살'))) disputeRiskScore += 15;
  disputeRiskScore = Math.min(88, disputeRiskScore);

  let riskLevel: ContractShieldResult['riskLevel'] = 'caution';
  let riskLevelTitle = '주의 및 정밀 검토 (Caution & Review)';

  if (disputeRiskScore >= 70) {
    riskLevel = 'alert';
    riskLevelTitle = '계약 특약 집중 방어 (Contract Alert)';
  } else if (disputeRiskScore >= 45) {
    riskLevel = 'caution';
    riskLevelTitle = '주의 및 정밀 검토 (Caution & Review)';
  } else {
    riskLevel = 'safe';
    riskLevelTitle = '비교적 평온한 계약 환경 (Stable Ground)';
  }

  // 5. 주역 송(訟) 괘의 지혜
  const ichingSongWisdom = {
    hexagram: '천수송 (天水訟) - 제6괘',
    teaching: '송사(분쟁)는 이겨도 상처뿐이니, 처음 계약을 맺을 때(謀始) 명확한 경계를 정해 다툼의 싹을 원천 차단하라.'
  };

  const actionProtocol = '도장이나 서명을 찍기 전, 반드시 5대 쉴드 체크리스트(IP 귀속, 책임 상한, 범위 확정, 자동 검수, 문서화)를 재확인하고, 애매한 조항은 1줄의 단서 조항을 추가하여 위험을 원천 무력화하세요.';

  const summary = `[계약·분쟁 쉴드] 리스크 지수: ${disputeRiskScore}점 [${riskLevelTitle}]. ` +
    `트리거: ${activeRiskTriggers.length}건. ` +
    `주역 송괘: ${ichingSongWisdom.teaching.slice(0, 30)}... 5대 체크리스트 장착 완료.`;

  return {
    engineVersion: CONTRACT_SHIELD_VERSION,
    calculatedAtIso: now.toISOString(),
    disputeRiskScore,
    riskLevel,
    riskLevelTitle,
    activeRiskTriggers,
    ichingSongWisdom,
    shieldChecklist: DEFAULT_SHIELD_CHECKLIST,
    actionProtocol,
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatContractShieldPrompt(res: ContractShieldResult): string {
  const checklistStr = res.shieldChecklist
    .map(c => `  • [${c.category}] 함정: ${c.dangerSign} ➔ 방어책: ${c.shieldRule}`)
    .join('\n');

  return `[계약·분쟁 방어 & 관재구설 쉴드 리포트 (엔진: ${res.engineVersion})]
- 계약 & 분쟁 리스크 지수: **${res.disputeRiskScore}점** [${res.riskLevelTitle}]
- 감지된 리스크 트리거:
${res.activeRiskTriggers.map(t => `  • ${t}`).join('\n')}
- 주역 천수송(訟) 방어 지혜: **${res.ichingSongWisdom.hexagram}**
  • "${res.ichingSongWisdom.teaching}"
- 5대 계약 쉴드 체크리스트:
${checklistStr}
- 액션 프로토콜: ${res.actionProtocol}
※ 루시 지침: 분쟁을 피하는 최고의 방법은 싸워서 이기는 것이 아니라, 애초에 다툴 여지가 없도록 계약서와 문서에 명확한 방어벽을 쳐두는 것입니다. 사용자가 사업, 외주, 동업, 계약 과정에서 불필요한 관재구설에 휘말리지 않도록 5대 쉴드 체크리스트와 천수송의 지혜를 든든하게 일러주세요.`;
}
