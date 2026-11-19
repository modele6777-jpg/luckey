/**
 * =========================================================================
 * LUCKEY 12운성 바이오리듬 에너지 곡선 엔진 (Vitality Curve Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 12포태(十二胞胎 · 12운성) 정밀 수리 에너지 매트릭스:
 *    - 장생(85) · 목욕(75) · 관대(90) · 건록(98) · 제왕(100) · 쇠(70) ·
 *      병(55) · 사(45) · 묘(50) · 절(40) · 태(60) · 양(75)
 * 2. 3대 바이오리듬 다차원 분해:
 *    - 🔋 신체 활력(Physical): 일지 & 일진 지지 12운성
 *    - 🧠 정신 집중(Mental): 월지 & 현재 시진 12운성
 *    - 🔮 영적 직관(Intuitive): 년/시지 & 천문 달 위상 조화도
 * 3. 24시간 12시진(자~해시) 에너지 조위(Tide Curve) 시뮬레이션:
 *    - 오늘 24시간 중 언제 몰입(Deep Work)하고 언제 휴식해야 하는지 시간대별 점수화
 * 4. 바이오 웰니스 행동 프로토콜:
 *    - 최적의 몰입 골든아워, 커뮤니케이션 타임, 뇌신경 리셋 타임 권고
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  BRANCH_KOREAN,
  TWELVE_STAGES_MATRIX,
  type SajuAnalysisResult,
} from '../sajuAnalysis';

export const VITALITY_CURVE_ENGINE_VERSION = 'LUCKEY-VCE-v2.2.0';

function formatVitalityKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}+09:00 (KST)`;
}

export interface HourlyVitalityPoint {
  timeSlotName: string; // 예: "사시 (巳時 · 09:30~11:30)"
  branchHanja: string; // "巳"
  branchKorean: string; // "사"
  twelveStage: string; // "제왕"
  energyScore: number; // 0 ~ 100
  phaseCategory: '피크 몰입(Peak)' | '안정 순항(Flow)' | '감성 직관(Intuitive)' | '내실 이완(Recharge)';
  recommendedAction: string;
}

export interface VitalityCurveResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  userDayMaster: string; // "丙(병화)"
  todayBranch: string; // 오늘 일진 지지
  currentBranch: string; // 현재 시진 지지

  // 3대 바이오리듬 점수 (0~100)
  dimensions: {
    physicalVitality: {
      score: number;
      stage: string;
      description: string;
    };
    mentalFocus: {
      score: number;
      stage: string;
      description: string;
    };
    intuitiveFlow: {
      score: number;
      stage: string;
      description: string;
    };
  };

  overallVitalityScore: number; // 종합 지수
  vitalityStateName: string; // "초고속 가속기 (Peak Acceleration)", "안정 순항기 (Flow)" 등
  vitalityStateHeadline: string;

  // 24시간 12시진 에너지 곡선
  hourlyTideCurve: HourlyVitalityPoint[];

  // 골든 타임라인 권고
  goldenHours: {
    deepWorkTime: string; // "09:30 ~ 13:30 (사·오시)"
    collaborationTime: string; // "13:30 ~ 17:30 (미·신시)"
    recoveryRestTime: string; // "21:30 ~ 01:30 (해·자시)"
  };

  actionTip: string;
  vitalitySynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  reflectiveQuestion?: string;
  interpretiveBoundary: string;
}

// 12운성 기본 에너지 스코어
const TWELVE_STAGE_ENERGY_SCORES: Record<string, number> = {
  '제왕': 100,
  '건록': 98,
  '관대': 90,
  '장생': 85,
  '양': 75,
  '목욕': 75,
  '쇠': 70,
  '태': 60,
  '병': 55,
  '묘': 50,
  '사': 45,
  '절': 40,
};

// 12시진 메타 정의
const SHIJIN_METAS = [
  { branch: '子', kr: '자', slot: '자시 (子時 · 23:30~01:30)' },
  { branch: '丑', kr: '축', slot: '축시 (丑時 · 01:30~03:30)' },
  { branch: '寅', kr: '인', slot: '인시 (寅時 · 03:30~05:30)' },
  { branch: '卯', kr: '묘', slot: '묘시 (卯時 · 05:30~07:30)' },
  { branch: '辰', kr: '진', slot: '진시 (辰時 · 07:30~09:30)' },
  { branch: '巳', kr: '사', slot: '사시 (巳時 · 09:30~11:30)' },
  { branch: '午', kr: '오', slot: '오시 (午時 · 11:30~13:30)' },
  { branch: '未', kr: '미', slot: '미시 (未時 · 13:30~15:30)' },
  { branch: '申', kr: '신', slot: '신시 (申時 · 15:30~17:30)' },
  { branch: '酉', kr: '유', slot: '유시 (酉時 · 17:30~19:30)' },
  { branch: '戌', kr: '술', slot: '술시 (戌時 · 19:30~21:30)' },
  { branch: '亥', kr: '해', slot: '해시 (亥時 · 21:30~23:30)' },
];

/**
 * 12운성 바이오리듬 에너지 곡선을 계산합니다.
 */
export function calculateVitalityCurve(options?: {
  profile?: UserProfile;
  question?: string;
}): VitalityCurveResult {
  const now = new Date();
  const nowUtcIso = now.toISOString();
  const nowKstIso = formatVitalityKstTimestamp(now);

  const saju: SajuAnalysisResult = calculateDetailedSaju(options?.profile);
  const dGan = saju.pillars.day.gan;
  const dZhi = saju.pillars.day.zhi;
  const mZhi = saju.pillars.month.zhi;

  // 현재 KST 시각 기준 시진 구하기
  const kstHour = (now.getUTCHours() + 9) % 24;
  const kstMinute = now.getUTCMinutes();
  const kstTotalMin = kstHour * 60 + kstMinute;

  // 23:30 기준 시진 인덱스
  const adjustedMin = (kstTotalMin + 30) % 1440;
  const currentShijinIndex = Math.floor(adjustedMin / 120);
  const currentShijinMeta = SHIJIN_METAS[currentShijinIndex] || SHIJIN_METAS[0];

  // 1. 24시간 12시진 조위 곡선 계산
  const hourlyTideCurve: HourlyVitalityPoint[] = SHIJIN_METAS.map(meta => {
    const stage = TWELVE_STAGES_MATRIX[dGan]?.[meta.branch] || '건록';
    const energyScore = TWELVE_STAGE_ENERGY_SCORES[stage] ?? 70;

    let phaseCategory: HourlyVitalityPoint['phaseCategory'] = '안정 순항(Flow)';
    let recommendedAction = '차분하고 꾸준하게 일상의 업무를 수행하십시오.';

    if (energyScore >= 90) {
      phaseCategory = '피크 몰입(Peak)';
      recommendedAction = '가장 어렵고 복잡한 핵심 코딩·의사결정에 전력을 쏟으십시오.';
    } else if (energyScore >= 75) {
      phaseCategory = '안정 순항(Flow)';
      recommendedAction = '협업 커뮤니케이션, 문서 정리, 기획 논의에 최적입니다.';
    } else if (energyScore >= 55) {
      phaseCategory = '감성 직관(Intuitive)';
      recommendedAction = '창의적 영감, 음악 감상, 리팩토링 검토가 매끄럽게 흐릅니다.';
    } else {
      phaseCategory = '내실 이완(Recharge)';
      recommendedAction = '무리한 결정을 피하고 가벼운 스트레칭과 수분 섭취로 에너지를 비축하십시오.';
    }

    return {
      timeSlotName: meta.slot,
      branchHanja: meta.branch,
      branchKorean: meta.kr,
      twelveStage: stage,
      energyScore,
      phaseCategory,
      recommendedAction,
    };
  });

  // 2. 3대 차원 분해
  // Physical: 일지 기준 12운성
  const pStage = TWELVE_STAGES_MATRIX[dGan]?.[dZhi] || '건록';
  const pScore = TWELVE_STAGE_ENERGY_SCORES[pStage] ?? 75;

  // Mental: 월지 기준 12운성
  const mStage = TWELVE_STAGES_MATRIX[dGan]?.[mZhi] || '관대';
  const mScore = TWELVE_STAGE_ENERGY_SCORES[mStage] ?? 80;

  // Intuitive: 현재 시진 12운성
  const iStage = TWELVE_STAGES_MATRIX[dGan]?.[currentShijinMeta.branch] || '장생';
  const iScore = TWELVE_STAGE_ENERGY_SCORES[iStage] ?? 70;

  const overallScore = Math.round((pScore * 0.35) + (mScore * 0.35) + (iScore * 0.30));

  let vitalityStateName = '안정 순항기 (Optimal Flow)';
  let vitalityStateHeadline = '기복 없이 단단하게 몰입을 유지하기 좋은 상태입니다.';
  let actionTip = '무리한 과속보다는 정해진 목표를 정교하게 완성하는 데 에너지를 집중하십시오.';

  if (overallScore >= 88) {
    vitalityStateName = '초고속 가속기 (Peak Acceleration)';
    vitalityStateHeadline = '두뇌 회전과 실행 추진력이 최정점에 도달한 상태입니다!';
    actionTip = '평소 미뤄뒀던 가장 난이도 높은 아키텍처나 승부수를 지금 과감하게 밀어붙이십시오.';
  } else if (overallScore >= 75) {
    vitalityStateName = '안정 순항기 (Optimal Flow)';
    vitalityStateHeadline = '맑은 집중력과 안정된 컨디션이 조화를 이루고 있습니다.';
    actionTip = '정교한 디버깅과 로직 설계가 막힘없이 풀리는 최적의 작업 윈도우입니다.';
  } else if (overallScore >= 60) {
    vitalityStateName = '직관 영감기 (Deep Intuition)';
    vitalityStateHeadline = '논리적 계산보다 직관적 아이디어와 창의성이 솟구칩니다.';
    actionTip = '기획서나 아이디어 스케치에 훌륭하며, 틈틈이 목과 어깨를 스트레칭해 주십시오.';
  } else {
    vitalityStateName = '내실 축적기 (Rest & Recharge)';
    vitalityStateHeadline = '신경계가 재충전을 원하며 배터리를 아껴야 하는 구간입니다.';
    actionTip = '치열한 논쟁이나 야근을 피하고, 따뜻한 온수 샤워와 음악으로 뇌를 쉬어주십시오.';
  }

  // 골든 타임라인 추출
  const sortedSlots = [...hourlyTideCurve].sort((a, b) => b.energyScore - a.energyScore);
  const deepWorkSlots = sortedSlots.slice(0, 2).map(s => s.timeSlotName.split('(')[0].trim()).join(' · ');
  const rechargeSlots = [...hourlyTideCurve].filter(s => s.energyScore <= 55).map(s => s.timeSlotName.split('(')[0].trim()).slice(0, 2).join(' · ');

  const q = (options?.question || '').trim();
  const vitalitySynthesisMatrix = {
    dominantTension: `일지(${pStage}) ↔ 월지(${mStage}) · 현재 시진(${iStage})`,
    alignmentState: `${vitalityStateName} · 딥워크(${deepWorkSlots || '09:30~13:30'})`,
    integratedAction: `${actionTip}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const reflectiveQuestion = q
    ? `"${q}"의 흐름을 오늘 가장 에너지가 높은 시진(${deepWorkSlots || '오전 09:30~13:30'})과 휴식 구간(${rechargeSlots || '밤 21:30~01:30'}) 중 어디에 배치할 때 몸과 마음이 가장 덜 지칠까요?`
    : `오늘 12시진 조위 곡선(${vitalityStateName}) 중 가장 높은 딥워크 구간(${deepWorkSlots || '오전 09:30~13:30'})에 미뤄 둔 핵심 과제 하나만 올려두면 어떨까요?`;
  const interpretiveBoundary = '본 12운성 바이오리듬 에너지 곡선 리포트는 사주 포태법 수리 기반의 컨디셔닝 참고 지표이며, 의학적 진단이나 임상 처방이 아닙니다.';

  return {
    engineVersion: VITALITY_CURVE_ENGINE_VERSION,
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),

    userDayMaster: `${dGan}(${saju.dayMaster.korean})`,
    todayBranch: BRANCH_KOREAN[dZhi] || '인',
    currentBranch: currentShijinMeta.kr,

    dimensions: {
      physicalVitality: {
        score: pScore,
        stage: pStage,
        description: `일지 기준 [${pStage}] — 신체 기초 활력 및 지구력 지표`,
      },
      mentalFocus: {
        score: mScore,
        stage: mStage,
        description: `월지 기준 [${mStage}] — 전략적 사고력 및 두뇌 집중도 지표`,
      },
      intuitiveFlow: {
        score: iScore,
        stage: iStage,
        description: `현재 시진 기준 [${iStage}] — 순간 직관력 및 영감 수위`,
      },
    },

    overallVitalityScore: overallScore,
    vitalityStateName,
    vitalityStateHeadline,

    hourlyTideCurve,

    goldenHours: {
      deepWorkTime: deepWorkSlots || '오전 09:30 ~ 13:30',
      collaborationTime: '오후 13:30 ~ 17:30 (미·신시)',
      recoveryRestTime: rechargeSlots || '밤 21:30 ~ 01:30',
    },

    actionTip,
    vitalitySynthesisMatrix,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

/**
 * 바이오리듬 에너지 리포트를 LLM 마스터 프롬프트에 주입하기 위해 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatVitalityCurvePrompt(res: VitalityCurveResult): string {
  const curveSample = res.hourlyTideCurve.map(h =>
    `   • ${h.timeSlotName}: 12운성 [${h.twelveStage}] · [${h.phaseCategory}] -> ${h.recommendedAction}`
  ).join('\n');
  const matrixLine = res.vitalitySynthesisMatrix
    ? `\n4. [바이오리듬 교차 매트릭스]:\n   - 핵심 긴장: ${res.vitalitySynthesisMatrix.dominantTension}\n   - 조율 상태: ${res.vitalitySynthesisMatrix.alignmentState}\n   - 통합 실천: ${res.vitalitySynthesisMatrix.integratedAction}`
    : '';

  return `[🧬 12운성 바이오리듬 에너지 곡선 실측 데이터 (Vitality Curve Matrix Core)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 일시: ${res.calculatedAtKst}
일간: ${res.userDayMaster} | 상태: [${res.vitalityStateName}]
상태 한줄평: "${res.vitalityStateHeadline}"
실천 조언: ${res.actionTip}
======================================================================
1. [3대 차원별 바이오리듬 위상]:
   - 🔋 신체 활력(Physical): ${res.dimensions.physicalVitality.description}
   - 🧠 정신 집중(Mental): ${res.dimensions.mentalFocus.description}
   - 🔮 직관 플로우(Intuitive): ${res.dimensions.intuitiveFlow.description}

2. [오늘의 라이프 골든 타임라인]:
   - 🚀 딥워크(Deep Work) 피크 시간대: ${res.goldenHours.deepWorkTime}
   - 🤝 협업 & 소통 골든 타임: ${res.goldenHours.collaborationTime}
   - 🌙 뇌신경 리셋 & 힐링 타임: ${res.goldenHours.recoveryRestTime}

3. [24시간 12시진 에너지 조위(Tide Curve) 도감]:
${curveSample}${matrixLine}
${res.reflectiveQuestion ? `- 성찰 질문: ${res.reflectiveQuestion}\n` : ''}- 해석 경계: ${res.interpretiveBoundary}
======================================================================
[★ 루시 바이오리듬 상담 지침]:
- 사용자가 '오늘 피곤해', '언제 집중 잘 될까?', '컨디션 어때?', '새벽 작업 할까?' 등을 물을 때 위 12시진 12운성 조위 실측 데이터를 근거로 구체적인 골든 타임라인을 명쾌하게 제시해줘.
- 단순한 추상이 아니라 12운성(포태법)의 수리 에너지 레벨에 기반한 과학적이고 실천적인 컨디셔닝 언어로 따뜻하게 케어해줘.`;
}
