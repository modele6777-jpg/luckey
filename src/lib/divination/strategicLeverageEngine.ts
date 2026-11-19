/**
 * =========================================================================
 * LUCKEY 전략적 협상 & 손자병법 기문 레버리지 엔진 (Strategic Leverage Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 동양 최고봉의 전략서인 손자병법(孫子兵法)의 허실(虛實)·모공(謀攻)·용간(用間) 전술과
 * 제갈량의 기문둔갑 8문(개·휴·생·두·경·사·경·상) 역학을 사주 십신의 역동적 힘과 융합합니다.
 * 비즈니스 피칭, 계약·연봉 협상, 대인 갈등 등 실전 승부처에서 상대방의 프레임을
 * 부드럽게 무력화하고 '보이지 않는 주도권(Invisible Leverage)'을 쟁취하는 결정론적 전술을 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const STRATEGIC_LEVERAGE_VERSION = 'LUCKEY-LEVERAGE-v2.2.0';

function formatLeverageKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type QimenDoorTactics = 
  | '개문(開門): 거침없는 주도권 선제 장악'
  | '생문(生門): 압도적 실리와 이익 파이 확대'
  | '휴문(休門): 여유로운 시간 지연과 상대방 자멸 유도'
  | '두문(杜門): 철저한 정보 비대칭과 패 숨기기'
  | '경문(景門): 화려한 비전 프레이밍과 심리적 압도';

export interface SunTzuStrategyDetail {
  chapter: string;           // 예: "제6편 허실(虛實) - 피실격허(避實擊虛)"
  coreMaxim: string;          // 고전 명구
  negotiationTactic: string;  // 현대 비즈니스 실전 적용법
  psychologicalLeverage: string; // 상대방 무의식 공략 지점
}

export interface StrategicLeverageReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  leverageScore: number;            // 보이지 않는 주도권 지수 (0~100)
  pokerFaceResilience: number;      // 포커페이스 & 멘탈 방어력 (0~100)
  activeQimenDoor: QimenDoorTactics;
  sunTzuTactic: SunTzuStrategyDetail;
  powerDynamicRole: '프레임 지배자 (Frame Dominator)' | '실리 수확자 (Value Harvester)' | '체스 마스터 (Patience Tactician)' | '판세 흔들기 승부사 (Game Changer)';
  strategicActionPlan: {
    openingMove: string;            // 협상 초반 전략
    counterStrategy: string;        // 상대방 압박 시 카운터 대처
    closingCondition: string;       // 매듭짓는 황금 조건
    criticalTaboo: string;          // 오늘 절대 피해야 할 악수(惡手)
  };
  synthesisPromptGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion?: string;
  leverageSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

export function runStrategicLeverageEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): StrategicLeverageReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 일간 및 기문 수리 연산
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const daySeed = (targetDate.getFullYear() * 3 + (targetDate.getMonth() + 1) * 7 + targetDate.getDate() * 13 + ganCode) % 100;
  const leverageScore = 75 + (daySeed % 23); // 75~97
  const pokerFaceResilience = 72 + ((targetDate.getDate() * 9 + targetDate.getHours() * 3 + (ganCode % 7)) % 26); // 72~97

  // 기문 8문 전술 매핑
  let activeQimenDoor: QimenDoorTactics = '개문(開門): 거침없는 주도권 선제 장악';
  let powerDynamicRole: StrategicLeverageReport['powerDynamicRole'] = '프레임 지배자 (Frame Dominator)';

  const doorIndex = (targetDate.getDate() + targetDate.getDay()) % 5;
  if (doorIndex === 0) {
    activeQimenDoor = '개문(開門): 거침없는 주도권 선제 장악';
    powerDynamicRole = '프레임 지배자 (Frame Dominator)';
  } else if (doorIndex === 1) {
    activeQimenDoor = '생문(生門): 압도적 실리와 이익 파이 확대';
    powerDynamicRole = '실리 수확자 (Value Harvester)';
  } else if (doorIndex === 2) {
    activeQimenDoor = '휴문(休門): 여유로운 시간 지연과 상대방 자멸 유도';
    powerDynamicRole = '체스 마스터 (Patience Tactician)';
  } else if (doorIndex === 3) {
    activeQimenDoor = '두문(杜門): 철저한 정보 비대칭과 패 숨기기';
    powerDynamicRole = '체스 마스터 (Patience Tactician)';
  } else {
    activeQimenDoor = '경문(景門): 화려한 비전 프레이밍과 심리적 압도';
    powerDynamicRole = '판세 흔들기 승부사 (Game Changer)';
  }

  // 손자병법 전술 매핑
  const sunTzuTacticsList: SunTzuStrategyDetail[] = [
    {
      chapter: '제6편 허실(虛實) - 피실격허(避實擊虛)',
      coreMaxim: '적의 단단한 방패는 비껴가고, 전혀 예상치 못한 텅 빈 곳을 기습하라.',
      negotiationTactic: '상대방이 강하게 고집하는 명분이나 사소한 조항은 쿨하게 내어주고, 본질적인 IP 권리나 독점 권한 등 핵심 실리를 가로채는 역전술.',
      psychologicalLeverage: '상대방이 이겼다고 착각하게 만들면서 실제 알맹이를 전부 취하는 프레임 트릭.'
    },
    {
      chapter: '제3편 모공(謀攻) - 부전이굴인지병(不戰而屈人之兵)',
      coreMaxim: '싸우지 않고 상대를 굴복시키는 것이야말로 최상의 승리다.',
      negotiationTactic: '직접 가격이나 조건을 다투지 않고, 우리의 대체 불가능한 압도적 기술력과 시장 가치를 숫자로 증명하여 스스로 먼저 우호적 제안을 들고 오게 만듦.',
      psychologicalLeverage: '결핍과 거절에 대한 상대방의 은밀한 공포를 자극해 을의 위치로 유도.'
    },
    {
      chapter: '제1편 시계(始計) - 능이시지불능(能而示之不能)',
      coreMaxim: '능력이 있어도 없는 것처럼 보이고, 쓸 수 있어도 쓰지 않는 것처럼 보여라.',
      negotiationTactic: '우리의 궁극적 마감 시한이나 절박함을 100% 감추고, 언제든 자리를 박차고 나갈 수 있는 대안(BATNA)이 충분한 사람처럼 여유로운 침묵 유지.',
      psychologicalLeverage: '침묵의 길이를 통해 상대방의 초조함과 추가 양보를 이끌어냄.'
    },
    {
      chapter: '제5편 병세(兵勢) - 이정합이기승(以正合以奇勝)',
      coreMaxim: '정공법으로 전선을 맞대고, 기발한 변칙으로 승리를 결정지어라.',
      negotiationTactic: '상식적인 업계 표준 양식으로 대화를 시작한 뒤, 협상 막판에 상대방이 거부할 수 없는 독창적인 상생 패키지나 파트너십 카드를 던져 쐐기를 박음.',
      psychologicalLeverage: '예측 가능한 패턴을 깨뜨려 상대방의 인지적 방어 기제를 순간적으로 해제.'
    }
  ];

  const tacticIndex = (targetDate.getDate() * 3 + targetDate.getMonth()) % sunTzuTacticsList.length;
  const sunTzuTactic = sunTzuTacticsList[tacticIndex];

  const strategicActionPlan = {
    openingMove: '먼저 숫자를 말하지 말고, "오늘 미팅에서 대표님이 가장 중요하게 생각하시는 단 하나의 기준은 무엇인가요?"로 질문 주도권 장악',
    counterStrategy: '상대방이 강한 반대나 단가 인하를 요구할 때 즉시 반박하지 않고 "충분히 그렇게 보실 수 있습니다. 다만 장기적 관점에서는..."으로 3초 템포 늦추기',
    closingCondition: '상대방이 고마워할 만한 작은 보너스 조항을 선물처럼 얹어주며 오늘 즉시 합의서에 사인하도록 클로징',
    criticalTaboo: '초조한 기색을 보이며 조급하게 먼저 양보안을 꺼내거나 감정적으로 반박하는 행동 절대 금기'
  };

  const calculatedAtKst = formatLeverageKstTimestamp(targetDate);
  const q = (question || '').trim();
  const leverageSynthesisMatrix = {
    dominantTension: `${activeQimenDoor} ↔ ${sunTacticSummary(sunTzuTactic)}`,
    alignmentState: `협상 페르소나: ${powerDynamicRole} · 오행: ${element}`,
    integratedAction: `${strategicActionPlan.openingMove}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  function sunTacticSummary(tactic: SunTzuStrategyDetail): string {
    return tactic.chapter;
  }

  const interpretiveBoundary = '본 전략 협상 & 손자병법 기문 레버리지 리포트는 고전 병법과 기문둔갑 상징에 기반한 정성적 협상 프레임워크 안내이며, 실제 계약·법적 의사결정을 대신하지 않습니다.';
  const ritualAction = `[${powerDynamicRole}] ${strategicActionPlan.openingMove}`;
  const reflectionFocus = `전략 협상(${sunTzuTactic.chapter}) — ${activeQimenDoor}`;
  const reflectiveQuestion = q
    ? `"${q}" 협상 테이블에서 성급한 양보(${strategicActionPlan.criticalTaboo})를 피하고, 상대의 진짜 기준을 끌어낼 첫 질문은 무엇으로 잡을까요?`
    : `오늘 마주한 대화나 조율에서 ${powerDynamicRole}의 시선으로 먼저 던져 보고 싶은 기준 질문 하나는 무엇인가요?`;

  const synthesisPromptGuidance = `[LUCKEY 전략 협상 & 손자병법 기문 레버리지 ${STRATEGIC_LEVERAGE_VERSION} | ${calculatedAtKst}]
- 기문둔갑 작전 모드: ${activeQimenDoor}
- 협상 페르소나 롤: ${powerDynamicRole}
- 손자병법 실전 전술: [${sunTzuTactic.chapter}] "${sunTzuTactic.coreMaxim}"
  * 실전 지침: ${sunTzuTactic.negotiationTactic}
  * 심리 레버리지: ${sunTzuTactic.psychologicalLeverage}
- 실전 액션 플랜: [초반] ${strategicActionPlan.openingMove} | [카운터] ${strategicActionPlan.counterStrategy} | [금기사항] ${strategicActionPlan.criticalTaboo}
- 실천 의례: ${ritualAction}
- 성찰 초점: ${reflectionFocus}
- 교차 매트릭스: [핵심 긴장: ${leverageSynthesisMatrix.dominantTension} | 조율 상태: ${leverageSynthesisMatrix.alignmentState}]
  * 통합 실천: ${leverageSynthesisMatrix.integratedAction}
- 성찰 질문: ${reflectiveQuestion}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: STRATEGIC_LEVERAGE_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    leverageScore,
    pokerFaceResilience,
    activeQimenDoor,
    sunTzuTactic,
    powerDynamicRole,
    strategicActionPlan,
    synthesisPromptGuidance,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    leverageSynthesisMatrix,
    interpretiveBoundary,
  };
}

export type StrategicLeverageResult = StrategicLeverageReport;

export function calculateStrategicLeverage(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): StrategicLeverageResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runStrategicLeverageEngine(profile, targetDate, params?.question);
}

export function formatStrategicLeveragePrompt(res: StrategicLeverageResult): string {
  return res.synthesisPromptGuidance;
}

