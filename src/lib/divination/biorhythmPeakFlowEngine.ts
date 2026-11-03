/**
 * =========================================================================
 * LUCKEY 3대 생체 바이오리듬 & 크로노타입 황금 피크 엔진 (Biorhythm & Chronotype Peak Flow Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 신체(23일)·감성(28일)·지성(33일)의 고전 3대 생체 바이오리듬 수학적 사인파(Sine Wave) 연산과
 * 현대 수면 의학의 4대 크로노타입(사자·곰·늑대·돌고래), 사주 12시진 생체 리듬을 결합한 엔진입니다.
 * 오늘의 에너지 최고점(Peak), 최저점(Trough), 영점 교차 위험일(Critical Day)을 정밀 계산하여
 * 24시간 중 최대 효율의 딥워크 및 비즈니스 결단 골든 타임을 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const BIORHYTHM_PEAK_FLOW_VERSION = 'LUCKEY-BIOFLOW-v1.0.0';

export type ChronotypeType = 
  | '사자형 (Lion · 새벽형 몰입 개척자)'
  | '곰형 (Bear · 주간 황금 리듬 안정자)'
  | '늑대형 (Wolf · 심야 창작 크리에이터)'
  | '돌고래형 (Dolphin · 초감각 기민 전략가)';

export interface BiorhythmCurve {
  physical: number;      // 신체 리듬 (-100 ~ +100)
  emotional: number;     // 감성 리듬 (-100 ~ +100)
  intellectual: number;  // 지성 리듬 (-100 ~ +100)
  compositeVitality: number; // 3대 합성 활력 지수 (0 ~ 100)
  isCriticalDay: boolean; // 0점 교차 위험일 여부
  criticalCategory?: '신체 위험일 (체력/부상 주의)' | '감성 위험일 (감정 롤러코스터 주의)' | '지성 위험일 (판단 착오 주의)';
}

export interface GoldenTimeWindow {
  deepWorkPeak: string;      // 딥워크 최고 몰입 구간
  strategicDecisionPeak: string; // 계약·협상·결단 최적 구간
  rechargeWindow: string;    // 에너지 충전 및 산책·휴식 구간
}

export interface BiorhythmPeakFlowReport {
  engineVersion: string;
  calculatedAt: string;
  chronotype: ChronotypeType;
  biorhythm: BiorhythmCurve;
  goldenWindows: GoldenTimeWindow;
  biohackingPrescription: {
    circadianLightAction: string; // 생체 시계 동기화 조명/햇볕 가이드
    nutritionTiming: string;      // 최적 두뇌 포도당 & 식사 타이밍
    focusBoosterProtocol: string; // 집중력 급상승 부스터 행동
  };
  synthesisPromptGuidance: string;
}

export function runBiorhythmPeakFlowEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): BiorhythmPeakFlowReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 출생일 기준 경과 일수 계산 (기본값: 1994-01-24)
  let birthDate = new Date(1994, 0, 24);
  if (profile?.basic?.birthdate) {
    const parsed = new Date(profile.basic.birthdate);
    if (!isNaN(parsed.getTime())) {
      birthDate = parsed;
    }
  }

  const diffTime = targetDate.getTime() - birthDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 3대 바이오리듬 정밀 사인파 연산
  const physicalRaw = Math.sin((2 * Math.PI * diffDays) / 23) * 100;
  const emotionalRaw = Math.sin((2 * Math.PI * diffDays) / 28) * 100;
  const intellectualRaw = Math.sin((2 * Math.PI * diffDays) / 33) * 100;

  const physical = Math.round(physicalRaw);
  const emotional = Math.round(emotionalRaw);
  const intellectual = Math.round(intellectualRaw);

  // 0점 근방(±6) 교차 여부 판별 (위험일: Critical Transition Day)
  let isCriticalDay = false;
  let criticalCategory: BiorhythmCurve['criticalCategory'];

  if (Math.abs(physical) <= 6) {
    isCriticalDay = true;
    criticalCategory = '신체 위험일 (체력/부상 주의)';
  } else if (Math.abs(emotional) <= 6) {
    isCriticalDay = true;
    criticalCategory = '감성 위험일 (감정 롤러코스터 주의)';
  } else if (Math.abs(intellectual) <= 6) {
    isCriticalDay = true;
    criticalCategory = '지성 위험일 (판단 착오 주의)';
  }

  // 3대 합성 활력 점수 (0 ~ 100 스케일)
  const compositeVitality = Math.max(
    10,
    Math.min(99, Math.round(50 + (physical * 0.35 + emotional * 0.35 + intellectual * 0.3) * 0.5))
  );

  // 크로노타입 판별 (사주 일간 및 지지 기반)
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const chronoIndex = (ganCode + birthDate.getDate()) % 4;

  let chronotype: ChronotypeType;
  let goldenWindows: GoldenTimeWindow;

  if (chronoIndex === 0) {
    chronotype = '사자형 (Lion · 새벽형 몰입 개척자)';
    goldenWindows = {
      deepWorkPeak: '오전 06:00 ~ 09:30 (두뇌 회전율 100% 최고조)',
      strategicDecisionPeak: '오전 10:00 ~ 12:30 (결단력 및 협상 주도권 최적)',
      rechargeWindow: '오후 14:00 ~ 15:30 (가벼운 산책 및 20분 파워냅 권장)'
    };
  } else if (chronoIndex === 1) {
    chronotype = '곰형 (Bear · 주간 황금 리듬 안정자)';
    goldenWindows = {
      deepWorkPeak: '오전 09:30 ~ 12:30 (태양 에너지 최대 흡수 몰입)',
      strategicDecisionPeak: '오후 13:30 ~ 16:00 (안정적 조율 및 핵심 미팅 최적)',
      rechargeWindow: '오후 16:30 ~ 17:30 (차 한잔과 함께하는 에너지 리셋)'
    };
  } else if (chronoIndex === 2) {
    chronotype = '늑대형 (Wolf · 심야 창작 크리에이터)';
    goldenWindows = {
      deepWorkPeak: '오후 19:30 ~ 23:30 (외부 소음 차단 심야 초집중 모멘텀)',
      strategicDecisionPeak: '오후 16:00 ~ 18:30 (두뇌 각성 및 창의적 돌파)',
      rechargeWindow: '오전 08:30 ~ 10:30 (천천히 워밍업하며 명상과 스트레칭)'
    };
  } else {
    chronotype = '돌고래형 (Dolphin · 초감각 기민 전략가)';
    goldenWindows = {
      deepWorkPeak: '오후 15:00 ~ 18:00 (신경망 최적화 고효율 스퍼트)',
      strategicDecisionPeak: '오전 10:30 ~ 12:00 (치밀한 데이터 분석 및 리스크 검증)',
      rechargeWindow: '오후 13:00 ~ 14:30 (수분 섭취와 조용한 공간에서의 뇌 휴식)'
    };
  }

  const biohackingPrescription = {
    circadianLightAction: `${chronotype.split(' ')[0]} 생체 시계: 기상 직후 15분간 자연 햇빛을 직접 쬐어 코르티솔 분비를 정상화하고 멜라토닌 분해 촉진`,
    nutritionTiming: '집중 딥워크 90분 전 단백질 및 건강한 복합 탄수화물 섭취로 뇌 혈당 스파이크 방지',
    focusBoosterProtocol: '작업 시작 전 4-7-8 호흡법 3세트로 부교감신경을 안정시키고 알파파 유도'
  };

  const criticalWarningText = isCriticalDay
    ? `⚠️ [주의] 오늘 ${criticalCategory}: 리듬 곡선이 영점을 통과하는 전환기이므로 충동적 결정이나 무리한 체력 소모를 피하십시오.`
    : `✅ 안정 상태: 3대 리듬이 조화롭게 순항 중입니다.`;

  const synthesisPromptGuidance = `[LUCKEY 3대 생체 바이오리듬 & 크로노타입 황금 피크 v1.0.0]
- 크로노타입: ${chronotype}
- 오늘 3대 바이오리듬 지수:
  * 신체(Physical): ${physical > 0 ? '+' : ''}${physical}% | 감성(Emotional): ${emotional > 0 ? '+' : ''}${emotional}% | 지성(Intellectual): ${intellectual > 0 ? '+' : ''}${intellectual}%
  * 합성 활력 점수: ${compositeVitality}점
- 위험일 진단: ${criticalWarningText}
- 일일 황금 시간대(Golden Windows):
  * [딥워크 최고 몰입] ${goldenWindows.deepWorkPeak}
  * [전략적 결단/협상] ${goldenWindows.strategicDecisionPeak}
  * [재충전 리셋] ${goldenWindows.rechargeWindow}
- 바이오해킹 행동 처방: ${biohackingPrescription.circadianLightAction}`;

  return {
    engineVersion: BIORHYTHM_PEAK_FLOW_VERSION,
    calculatedAt: targetDate.toISOString(),
    chronotype,
    biorhythm: {
      physical,
      emotional,
      intellectual,
      compositeVitality,
      isCriticalDay,
      criticalCategory
    },
    goldenWindows,
    biohackingPrescription,
    synthesisPromptGuidance
  };
}

export type BiorhythmPeakFlowResult = BiorhythmPeakFlowReport;

export function calculateBiorhythmPeakFlow(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): BiorhythmPeakFlowResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runBiorhythmPeakFlowEngine(profile, targetDate);
}

export function formatBiorhythmPeakFlowPrompt(res: BiorhythmPeakFlowResult): string {
  return res.synthesisPromptGuidance;
}
