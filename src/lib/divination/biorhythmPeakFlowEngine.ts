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

export const BIORHYTHM_PEAK_FLOW_VERSION = 'LUCKEY-BIOFLOW-v2.0.0';

export type ChronotypeType = 
  | '사자형 (Lion · 새벽형 몰입 개척자)'
  | '곰형 (Bear · 주간 황금 리듬 안정자)'
  | '늑대형 (Wolf · 심야 창작 크리에이터)'
  | '돌고래형 (Dolphin · 초감각 기민 전략가)';

export interface BiorhythmCurve {
  physical: number;      // 신체 리듬 (-100 ~ +100)
  emotional: number;     // 감성 리듬 (-100 ~ +100)
  intellectual: number;  // 지성 리듬 (-100 ~ +100)
  compositeVitality: number; // 3대 합성 활력 지수 (내부 호환용 0 ~ 100)
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
  calculatedAtKst: string;
  chronotype: ChronotypeType;
  biorhythm: BiorhythmCurve;
  goldenWindows: GoldenTimeWindow;
  biohackingPrescription: {
    circadianLightAction: string; // 생체 시계 동기화 조명/햇볕 가이드
    nutritionTiming: string;      // 최적 두뇌 포도당 & 식사 타이밍
    focusBoosterProtocol: string; // 집중력 급상승 부스터 행동
  };
  situationalBioAudit: {
    focusTheme: string;
    rhythmNote: string;
    pacingTip: string;
  };
  temporalBioRhythm: {
    kstTimeLabel: string;
    currentPhaseWindow: string;
    seasonalCircadianTone: string;
    temporalGuidance: string;
  };
  bioSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  boundaryNotice: string;
  synthesisPromptGuidance: string;
}

function getTemporalBioRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const currentPhaseWindow =
    hour >= 5 && hour < 11
      ? '아침 코르티솔 각성창 — 자연광을 쬐며 서서히 대사·인지 리듬을 깨우는 시간'
      : hour >= 11 && hour < 17
        ? '정오 활성·리셋창 — 핵심 과업을 처리하고 오후 나른함에 짧은 휴식을 배치하는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 이완창 — 자극적인 빛을 줄이고 몸의 긴장을 서서히 내리는 시간'
          : '심야 멜라토닌 회복창 — 깊은 수면과 세포 회복에 전념하는 시간';

  const seasonalCircadianTone =
    month >= 3 && month <= 5
      ? '봄 · 생체 시계 전진기 (일출이 빨라져 아침 활동량을 늘리기 좋은 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 열발산·수분 조절기 (무더위 피로를 낮잠과 수분 보충으로 다스리는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 일주기 안정 수렴기 (일정한 기상·취침 리듬이 가장 잘 잡히는 시기)'
          : '겨울 · 동절기 에너지 보존기 (수면 시간을 충분히 확보하고 오전 빛 노출을 늘리는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    currentPhaseWindow,
    seasonalCircadianTone,
    temporalGuidance: `${currentPhaseWindow} · ${seasonalCircadianTone}의 흐름에 맞추어 하루의 에너지 배분을 조율하십시오.`,
  };
}

export function runBiorhythmPeakFlowEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
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

  const describeWave = (val: number) =>
    val >= 40 ? '상승 고점' : val <= -40 ? '이완·회복기' : '전환 완만기';

  const q = (question || '').trim();
  const temporalBioRhythm = getTemporalBioRhythm(targetDate);
  const situationalBioAudit = /일|결정|회의|집중|공부/.test(q)
    ? {
        focusTheme: `${chronotype.split(' ')[0]} 기반 딥워크·결단 황금 시간대 활용`,
        rhythmNote: `지성 리듬은 ${describeWave(intellectual)}, 신체 리듬은 ${describeWave(physical)} 국면입니다.`,
        pacingTip: goldenWindows.deepWorkPeak,
      }
    : /피곤|휴식|수면|건강|감정/.test(q)
      ? {
          focusTheme: '일주기 리듬 회복과 재충전 창 확보',
          rhythmNote: `감성 리듬(${describeWave(emotional)})과 신체 리듬(${describeWave(physical)})을 살펴 무리한 일정을 줄이십시오.`,
          pacingTip: goldenWindows.rechargeWindow,
        }
      : {
          focusTheme: `${chronotype} 일일 페이싱`,
          rhythmNote: `신체(${describeWave(physical)}) · 감성(${describeWave(emotional)}) · 지성(${describeWave(intellectual)}) 흐름이 맞물려 있습니다.`,
          pacingTip: biohackingPrescription.circadianLightAction,
        };

  const bioSynthesisMatrix = {
    coreInsight: `[${chronotype.split(' ')[0]}] 리듬과 오늘의 ${isCriticalDay ? criticalCategory : '안정 순항 국면'}이 교차합니다.`,
    recommendedAction: `몰입창(${goldenWindows.deepWorkPeak}) 활용 + ${biohackingPrescription.focusBoosterProtocol}`,
    cautionNotice: isCriticalDay
      ? `${criticalCategory}이므로 큰 결정이나 무리한 일정은 한 템포 늦추는 것이 안전합니다.`
      : '고점이든 저점이든 자신의 크로노타입 리듬을 거스르지 않는 것이 핵심입니다.',
  };

  const boundaryNotice = '본 결과는 고전 생체리듬 주기와 크로노타입 모델을 활용한 정성적 컨디션 페이싱 참고용이며, 의학적 진단이 아닙니다.';

  const synthesisPromptGuidance = `[LUCKEY 3대 생체 바이오리듬 & 크로노타입 황금 피크 ${BIORHYTHM_PEAK_FLOW_VERSION}]
- 연산 시각: ${temporalBioRhythm.kstTimeLabel}
- 크로노타입: ${chronotype}
- 오늘 3대 바이오리듬 결:
  * 신체(Physical): ${describeWave(physical)} | 감성(Emotional): ${describeWave(emotional)} | 지성(Intellectual): ${describeWave(intellectual)}
- 전환기 진단: ${criticalWarningText}
- 질문 맥락 감사 (${situationalBioAudit.focusTheme}): ${situationalBioAudit.rhythmNote}
- KST 시공간 일주기 리듬: ${temporalBioRhythm.currentPhaseWindow} / ${temporalBioRhythm.seasonalCircadianTone}
  * 시공간 지침: ${temporalBioRhythm.temporalGuidance}
- 바이오 교차 매트릭스: 핵심(${bioSynthesisMatrix.coreInsight}) | 실행(${bioSynthesisMatrix.recommendedAction}) | 주의(${bioSynthesisMatrix.cautionNotice})
- 일일 황금 시간대(Golden Windows):
  * [딥워크 최고 몰입] ${goldenWindows.deepWorkPeak}
  * [전략적 결단/협상] ${goldenWindows.strategicDecisionPeak}
  * [재충전 리셋] ${goldenWindows.rechargeWindow}
- 바이오해킹 행동 처방: ${biohackingPrescription.circadianLightAction}
- 해석 경계: ${boundaryNotice}`;

  return {
    engineVersion: BIORHYTHM_PEAK_FLOW_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst: temporalBioRhythm.kstTimeLabel,
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
    situationalBioAudit,
    temporalBioRhythm,
    bioSynthesisMatrix,
    boundaryNotice,
    synthesisPromptGuidance
  };
}

export type BiorhythmPeakFlowResult = BiorhythmPeakFlowReport;

export function calculateBiorhythmPeakFlow(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): BiorhythmPeakFlowResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runBiorhythmPeakFlowEngine(profile, targetDate, params?.question);
}

export function formatBiorhythmPeakFlowPrompt(res: BiorhythmPeakFlowResult): string {
  return res.synthesisPromptGuidance;
}
