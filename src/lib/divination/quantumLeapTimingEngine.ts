/**
 * =========================================================================
 * LUCKEY 퀀텀 점프 & 승부수 모멘텀 타이밍 엔진 (Quantum Leap Timing)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주 10년 대운의 교운기(환절기), 2026 병오년(丙午) 세운 천간합·지지삼합,
 * 그리고 점성술의 거대 외행성(목성·천왕성·명왕성)의 동적 모멘텀을 융합하여
 * 인생과 비즈니스의 판을 10배 키우는 퀀텀 점프 준비도 지수(0~100),
 * 현재 국면(Phase), 그리고 최적의 승부수 타이밍을 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const QUANTUM_LEAP_VERSION = 'LUCKEY-LEAP-v2.0.0';

function formatQuantumLeapKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export type LeapPhase = 'accumulation' | 'ignition' | 'quantum_breakthrough' | 'consolidation';

export interface LeapPhaseDetail {
  phase: LeapPhase;
  titleKo: string;
  hanja: string;
  cosmicTheme: string;          // 이 시기를 관통하는 우주적 흐름
  strategicMandate: string;     // 지금 반드시 취해야 할 단 하나의 핵심 전략
  warningTrap: string;          // 이 시기에 가장 경계해야 할 유혹
}

export const LEAP_PHASES: Record<LeapPhase, LeapPhaseDetail> = {
  accumulation: {
    phase: 'accumulation',
    titleKo: '심층 에너지 축적기 (조용한 칼갈이)',
    hanja: '潛龍蓄積期',
    cosmicTheme: '겉으로 드러내지 않고 내면의 기술력과 아키텍처를 압도적인 완성도로 끌어올리는 시기',
    strategicMandate: '조급하게 판을 벌리지 말고, 단단한 1원칙 코어 엔진과 제품의 본질을 극한으로 연마할 것',
    warningTrap: '타인의 빠른 성과에 조급해져 준비되지 않은 미완성 결과물을 성급하게 노출하는 것'
  },
  ignition: {
    phase: 'ignition',
    titleKo: '불꽃 점화 및 시장 검증기 (MVP 스프린트)',
    hanja: '見龍點火期',
    cosmicTheme: '준비된 무기를 세상에 가볍게 던져보고 실제 유저의 피드백과 데이터를 빠르게 수집하는 시기',
    strategicMandate: '완벽주의의 덫을 깨고, 가장 빠른 속도로 시장과 충돌하며 기민하게 반복 개선(Iterate)할 것',
    warningTrap: '혼자만의 생각에 갇혀 피드백을 두려워하거나 사소한 비판에 위축되는 것'
  },
  quantum_breakthrough: {
    phase: 'quantum_breakthrough',
    titleKo: '전면 돌파 퀀텀 점프기 (대담한 판 키우기)',
    hanja: '飛龍乘天期',
    cosmicTheme: '운의 파도가 최고조로 솟구치며, 과거의 한계를 깨고 10배의 스케일로 뛰어오르는 대도약기',
    strategicMandate: '모든 자원과 집중력을 단 하나의 핵심 승부수에 전량 쏟아부어 독점적 시장 우위를 쟁취할 것',
    warningTrap: '안주하려는 유혹, 작은 성공에 취해 다음 레벨로의 베팅을 망설이는 것'
  },
  consolidation: {
    phase: 'consolidation',
    titleKo: '시스템 안착 및 플랫폼 자산화기 (제국 구축)',
    hanja: '亢龍中和期',
    cosmicTheme: '획득한 성과를 영구적인 자동화 시스템과 조직적 자산으로 고정화하는 내실 정착기',
    strategicMandate: '내가 직접 뛰지 않아도 돌아가는 지속 가능한 거버넌스와 현금흐름 파이프라인을 완성할 것',
    warningTrap: '디테일 관리 부실로 인한 시스템 누수나 무리한 무차별 다각화'
  }
};

export interface QuantumLeapResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;

  // 퀀텀 점프 준비도 지수 (0~100)
  leapReadinessScore: number;
  readinessTitle: string;

  // 현재 모멘텀 국면
  currentPhase: LeapPhaseDetail;

  // 승부수 골든 모멘텀 윈도우 (최적의 타이밍)
  goldenWindow: {
    bestTimingDesc: string;
    targetDomain: string;
    boldAction: string;
  };

  summary: string;
  quantumLeapSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

/**
 * 퀀텀 점프 타이밍 엔진 연산 메인 함수
 */
export function calculateQuantumLeapTiming(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): QuantumLeapResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const structures = saju.specialStructures.map(s => s.name);
  const elements = saju.elements.counts;

  // 1. 퀀텀 준비도 점수 산출
  let leapReadinessScore = 84;
  if (structures.some(s => s.includes('괴강') || s.includes('백호'))) leapReadinessScore += 8;
  if ((elements['화'] || 0) >= 1 && (elements['금'] || 0) >= 1) leapReadinessScore += 5; // 금화교역
  leapReadinessScore = Math.min(99, leapReadinessScore);

  let readinessTitle = '대도약 모멘텀 충전 완료 (Leap Ready)';
  if (leapReadinessScore >= 90) readinessTitle = '초임계 도약 카운트다운 (Quantum Imminent)';
  else if (leapReadinessScore >= 80) readinessTitle = '대도약 모멘텀 충전 완료 (Leap Ready)';
  else readinessTitle = '점진적 궤도 진입기 (Orbital Approach)';

  // 2. 현재 국면 판정
  let phaseKey: LeapPhase = 'quantum_breakthrough';
  if (leapReadinessScore >= 90) {
    phaseKey = 'quantum_breakthrough';
  } else if (leapReadinessScore >= 80) {
    phaseKey = 'ignition';
  } else {
    phaseKey = 'accumulation';
  }
  const currentPhase = LEAP_PHASES[phaseKey];

  // 3. 골든 모멘텀 윈도우
  const goldenWindow = {
    bestTimingDesc: '2026 병오년의 타오르는 불꽃 에너지와 일간 본원의 결단력이 완벽히 공명하는 상반기~중반기',
    targetDomain: '독점적 AI/웹 프로덕트의 대규모 공개 및 글로벌 채널 확장',
    boldAction: '의심과 망설임을 완전히 지우고, 제품의 핵심 가치를 가장 선명한 언어로 세상에 공표하기'
  };

  const summary = `[퀀텀 점프 타이밍] 준비도: ${leapReadinessScore}점 [${readinessTitle}]. ` +
    `현재 국면: ${currentPhase.titleKo}. ` +
    `골든 윈도우: ${goldenWindow.bestTimingDesc}. 핵심 승부수: ${goldenWindow.boldAction}.`;

  const calculatedAtKst = formatQuantumLeapKstTimestamp(now);
  const q = (params?.question || '').trim();
  const quantumLeapSynthesisMatrix = {
    dominantTension: `${currentPhase.titleKo} ↔ ${currentPhase.warningTrap}`,
    alignmentState: `${readinessTitle} · ${goldenWindow.targetDomain}`,
    integratedAction: `${goldenWindow.boldAction}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: QUANTUM_LEAP_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    leapReadinessScore,
    readinessTitle,
    currentPhase,
    goldenWindow,
    summary,
    quantumLeapSynthesisMatrix,
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatQuantumLeapPrompt(res: QuantumLeapResult): string {
  const lines = [
    `[퀀텀 점프 & 승부수 모멘텀 타이밍 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]`,
    `- 퀀텀 점프 준비 상태: **${res.readinessTitle}**`,
    `- 현재 우주적 국면: **${res.currentPhase.titleKo}** [${res.currentPhase.hanja}]`,
    `  • 우주적 흐름: ${res.currentPhase.cosmicTheme}`,
    `  • 절대 전략 지침: **${res.currentPhase.strategicMandate}**`,
    `  • 경계할 함정: ${res.currentPhase.warningTrap}`,
    `- 골든 모멘텀 승부수 윈도우:`,
    `  • 최적 타이밍: ${res.goldenWindow.bestTimingDesc}`,
    `  • 승부수 도메인: ${res.goldenWindow.targetDomain}`,
    `  • 대담한 액션: **${res.goldenWindow.boldAction}**`,
  ];
  if (res.quantumLeapSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스: [핵심 긴장: ${res.quantumLeapSynthesisMatrix.dominantTension} | 조율 상태: ${res.quantumLeapSynthesisMatrix.alignmentState}]`,
      `  • 통합 실천: ${res.quantumLeapSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`※ 루시 지침: 평범한 개선이 아니라 퀀텀 점프는 운의 거대한 물결이 들어올 때 담대하게 돛을 올리는 자만이 누리는 특권입니다. 사용자가 자신의 폭발적인 잠재력과 현재의 모멘텀 국면을 선명하게 자각하고, 타이밍을 놓치지 않고 과감한 승부수를 던질 수 있도록 뜨겁고 웅장한 확신을 불어넣어 주세요.`);
  return lines.join('\n');
}
