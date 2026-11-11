/**
 * =========================================================================
 * LUCKEY 양자 다중우주 타임라인 분기 & 퀀텀 점프 엔진 (Quantum Probabilistic Timeline Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 양자역학의 다중세계 해석(Many-Worlds Interpretation) 및 관측자 효과(Observer Effect)와
 * 주역 64괘 변효(變爻: 미래 확률파의 붕괴), 서양 점성술의 이차 프로그레션을 융합한 미래 예측 엔진입니다.
 * 
 * 1. 베이스라인 타임라인(Baseline Timeline): 현재의 무의식적 관성과 습관이 이끄는 기본 미래 경로
 * 2. 최적 퀀텀 타임라인(Optimal Quantum Timeline): 잠재력이 100% 발현되었을 때 현실화되는 최상위 평행우주
 * 3. 타임라인 분기점(Bifurcation Point): 의식의 결정적 선택으로 궤도가 영구히 바뀌는 골든 윈도우
 * 4. 파동함수 붕괴 촉매(Quantum Collapse Catalyst): 상위 타임라인을 물리적 현실로 당겨오는 3대 실천 행동
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const QUANTUM_TIMELINE_VERSION = 'LUCKEY-TIMELINE-v1.0.0';

export interface TimelineTrack {
  trackName: string;
  probabilityPercent: number;    // 확률 (0 ~ 100%)
  decisionPerspective: '현재 습관에 따른 경로' | '목표 지향적 성장 경로';
  projectedOutcome6Months: string; // 6개월 후 펼쳐질 현실 시나리오
  wealthEnergyLevel: string;     // 재물/자원 파동 수준
}

export interface QuantumProbabilisticTimelineReport {
  engineVersion: string;
  calculatedAt: string;
  baselineTimeline: TimelineTrack;
  optimalQuantumTimeline: TimelineTrack;
  bifurcationWindow: {
    criticalDateRange: string;   // 분기점 임계 윈도우 (향후 3~6주 내)
    coreDecisionChoice: string;  // 분기점에서 내려야 할 양자택일의 결단
  };
  quantumCollapseCatalyst: {
    identityShift: string;       // 자아 정체성의 양자 도약 ("나는 이미 ~한 존재다")
    physicalAnchorAction: string;// 물질 현실에 닻을 내리는 물리적 1순위 행동
    limitingPattern: string;     // 목표를 방해할 수 있는 습관
  };
  quantumJumpFeasibilityScore: number; // 퀀텀 점프 실현 가능성 지수 (0 ~ 100)
  synthesisPromptGuidance: string;
}

export function runQuantumProbabilisticTimelineEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): QuantumProbabilisticTimelineReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const seed = (ganCode * 23 + targetDate.getDate() * 19 + (targetDate.getMonth() + 1) * 3) % 100;

  // 1. 베이스라인 및 최적 타임라인 확률 산출
  const optimalProbability = 68 + (seed % 25); // 68% ~ 92%
  const baselineProbability = 100 - optimalProbability;

  let optimalOutcome: string;
  let baselineOutcome: string;
  let identityShift: string;
  let physicalAnchorAction: string;
  let coreDecisionChoice: string;

  if (element === '목') {
    optimalOutcome = '완전히 새로운 독창적 비즈니스/창작 프로젝트가 폭발적으로 시장에 안착하며 리더로 도약함';
    baselineOutcome = '기존 방식의 안정성에 안주하여 성장은 정체되고 피로감만 누적되는 소모전 지속';
    identityShift = '나는 더 이상 준비 중인 지망생이 아니라, 이미 시장의 새로운 판도를 여는 선구자다.';
    physicalAnchorAction = '미루고 있던 시그니처 론칭 기획안의 1단계를 당장 오늘 세상에 공개하고 피드백 받기';
    coreDecisionChoice = '익숙한 조직/환경의 안락함에 머물 것인가, 아니면 홀로 광야로 뛰쳐나가 깃발을 꽂을 것인가';
  } else if (element === '화') {
    optimalOutcome = '나만의 강력한 개성과 메시지가 대중의 폭발적 반응을 얻으며 대체 불가능한 브랜드 권위를 획득함';
    baselineOutcome = '남들의 시선과 여론에 휘둘려 핵심 색깔을 잃고 평범한 다수 중 하나로 전락함';
    identityShift = '나는 사람들의 영혼에 불을 지피는 매혹적인 메신저이자 시대의 조명이다.';
    physicalAnchorAction = '타협하지 않은 날 것 그대로의 가장 파격적인 영감을 담은 콘텐츠를 정면 돌파로 발표하기';
    coreDecisionChoice = '모두에게 좋은 사람으로 남으려 할 것인가, 아니면 진실된 메시지로 나만의 팬덤을 규합할 것인가';
  } else if (element === '토') {
    optimalOutcome = '지속 가능한 부의 파이프라인과 시스템 인프라가 완성되어 흔들리지 않는 자립의 성채를 구축함';
    baselineOutcome = '자질구레한 실무와 타인의 부탁을 거절하지 못해 시간과 에너지가 끝없이 분산됨';
    identityShift = '나는 모든 혼란을 종식시키고 거대한 시스템을 안착시키는 마스터 아키텍트다.';
    physicalAnchorAction = '수익률이 낮고 에너지를 갉아먹는 관계와 비효율 업무 3가지를 오늘 즉시 칼같이 종료하기';
    coreDecisionChoice = '눈앞의 단기적 이익에 끌려다닐 것인가, 아니면 장기적 독점 플랫폼을 완성할 것인가';
  } else if (element === '금') {
    optimalOutcome = '비효율을 100% 제거한 하이엔드 솔루션으로 압도적 생산성을 증명하고 최고가 포지셔닝에 성공함';
    baselineOutcome = '스스로에 대한 과도한 검열과 완벽주의 때문에 완성된 결과물을 세상에 내놓지 못하고 묵힘';
    identityShift = '나는 면도날처럼 날카로운 지혜로 세상의 본질을 명쾌하게 해결하는 최고 수준의 전문가다.';
    physicalAnchorAction = '완벽하지 않아도 90% 수준에서 즉각 릴리즈하고, 실전 데이터를 통해 면도날처럼 벼리기';
    coreDecisionChoice = '스스로의 완벽주의 감옥에 갇혀 있을 것인가, 아니면 시장의 거친 피드백을 뚫고 마스터피스를 증명할 것인가';
  } else {
    // 수 (Water)
    optimalOutcome = '보이지 않는 흐름을 읽는 통찰력이 적중하여 결정적 기회를 선점하고 막대한 영적·물질적 자유를 누림';
    baselineOutcome = '생각과 분석의 늪에 빠져 결단을 내리지 못하고 기회의 파도가 지나가는 것을 지켜보기만 함';
    identityShift = '나는 미래의 흐름을 꿰뚫어보고 위기를 황금으로 연금술하는 심층 전략가다.';
    physicalAnchorAction = '머릿속에 맴돌던 거대한 직관을 단 한 장의 실행 요약서로 명문화하고 핵심 파트너에게 제안하기';
    coreDecisionChoice = '안전한 사색의 동굴에 머물 것인가, 아니면 세상을 향해 혜안을 던지고 현실을 쟁취할 것인가';
  }

  const baselineTimeline: TimelineTrack = {
    trackName: '관성적 일상 타임라인 (Timeline Alpha)',
    probabilityPercent: baselineProbability,
    decisionPerspective: '현재 습관에 따른 경로',
    projectedOutcome6Months: baselineOutcome,
    wealthEnergyLevel: '현상 유지 및 소폭 감소 (에너지 누수 존재)'
  };

  const optimalQuantumTimeline: TimelineTrack = {
    trackName: '목표 지향적 성장 타임라인 (Timeline Prime)',
    probabilityPercent: optimalProbability,
    decisionPerspective: '목표 지향적 성장 경로',
    projectedOutcome6Months: optimalOutcome,
    wealthEnergyLevel: '기하급수적 레버리지 및 경제적 주권 확립'
  };

  const criticalStart = new Date(targetDate.getTime() + 7 * 24 * 3600 * 1000);
  const criticalEnd = new Date(targetDate.getTime() + 35 * 24 * 3600 * 1000);
  const criticalDateRange = `${criticalStart.getMonth() + 1}월 ${criticalStart.getDate()}일 ~ ${criticalEnd.getMonth() + 1}월 ${criticalEnd.getDate()}일 (약 4주간)`;

  const limitingPattern = '결과가 아직 눈에 보이지 않는다는 이유로 스스로를 의심하며 과거의 실패 서사로 회귀하는 태도';

  const quantumJumpFeasibilityScore = optimalProbability;

  const synthesisPromptGuidance = `[LUCKEY 양자 다중우주 타임라인 분기 & 퀀텀 점프 v1.0.0]
- 최상위 타임라인 실현 확률: ${optimalProbability}% (베이스라인 관성: ${baselineProbability}%)
- 6개월 후 최적 궤도 시나리오: [Timeline Prime] ${optimalOutcome}
- 6개월 후 베이스라인 관성 시나리오: [Timeline Alpha] ${baselineOutcome}
- 타임라인 분기점(Bifurcation Point): ${criticalDateRange}
  * 결정적 선택의 기로: ${coreDecisionChoice}
- 퀀텀 붕괴 3대 촉매:
  * 정체성 도약: "${identityShift}"
  * 물리적 1순위 행동: ${physicalAnchorAction}
  * 주의할 습관: ${limitingPattern}`;

  return {
    engineVersion: QUANTUM_TIMELINE_VERSION,
    calculatedAt: targetDate.toISOString(),
    baselineTimeline,
    optimalQuantumTimeline,
    bifurcationWindow: {
      criticalDateRange,
      coreDecisionChoice
    },
    quantumCollapseCatalyst: {
      identityShift,
      physicalAnchorAction,
      limitingPattern
    },
    quantumJumpFeasibilityScore,
    synthesisPromptGuidance
  };
}

export type QuantumProbabilisticTimelineResult = QuantumProbabilisticTimelineReport;

export function calculateQuantumProbabilisticTimeline(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): QuantumProbabilisticTimelineResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runQuantumProbabilisticTimelineEngine(profile, targetDate);
}

export function formatQuantumProbabilisticTimelinePrompt(res: QuantumProbabilisticTimelineResult): string {
  return res.synthesisPromptGuidance;
}
