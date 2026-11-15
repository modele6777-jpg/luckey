/**
 * =========================================================================
 * LUCKEY 초월 명상 & 마음 안정 엔진 (Transcendental Meditation Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주명리의 일간(日干) 오행 기운 및 음양 편중도를 결합하여, 사용자의
 * 긴장을 낮추고 초월적 평정심(Equanimity)을 회복하는 개인화 명상 리추얼을
 * 도출합니다.
 * 주역 곤위지(坤爲地, 수용적 침묵)와 건위천(乾爲天, 창조적 직관)의 기운을
 * 24시간 중 최적의 황금 시진(Golden Time)에 동조시킵니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const TRANSCENDENTAL_MEDITATION_VERSION = 'LUCKEY-ZEN-v2.0.0';

function formatZenKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export type MeditationStyle = 
  | '비파사나 통찰 관조 (Vipassana Insight)'
  | '젠 침묵 좌선 (Zen Emptiness)'
  | '그라운딩 단전 호흡 (Earth Grounding)'
  | '소리 만트라 & 하트 공명 (Mantra Sound)'
  | '불꽃 트라타카 시각화 (Trataka Focus)';

export type MeditationIntention = '평정·몰입' | '연결·영감' | '안정·그라운딩' | '명료·관조' | '고요·내면 관찰';

export interface MeditationPrescription {
  primaryStyle: MeditationStyle;
  intendedMindState: MeditationIntention;
  optimalTimeWindow: string; // 예: "묘시(卯時, 05:00~07:00) 여명 각성"
  postureAndBreathing: {
    posture: string;
    breathRatio: string; // 예: "4초 들숨 - 4초 멈춤 - 6초 날숨 (박스 호흡)"
    mentalAnchor: string; // 마음의 닻 (주의 집중 대상)
  };
}

export interface TranscendentalMeditationReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  equanimityScore: number;       // 마음의 평정심 지수 (0~100)
  stressReleasePotential: number;// 스트레스 즉각 방출 잠재력 (0~100)
  zenEnergyArchetype: string;    // 명상 페르소나 아키타입
  prescription: MeditationPrescription;
  ichingZenState: {
    hexagramName: string;
    stateQuality: '순수한 수용과 비움 (곤위지)' | '강력한 영감과 창조성 (건위천)' | '감정의 정화와 흐름 (감위수)' | '지혜의 고요한 머무름 (간위산)';
    mantraText: string;
  };
  synthesisPromptGuidance: string;
  zenSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export function runTranscendentalMeditationEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): TranscendentalMeditationReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const element = sajuRes?.dayMaster?.element || '금';

  // 일간 오행별 기본 명상 스타일 및 마음의 방향 매핑
  let primaryStyle: MeditationStyle = '비파사나 통찰 관조 (Vipassana Insight)';
  let intendedMindState: MeditationIntention = '평정·몰입';
  let zenEnergyArchetype = '맑은 거울 같은 통찰의 관조자';
  let posture = '가슴을 활짝 편 반가부좌, 턱을 살짝 당긴 수평 시선';
  let breathRatio = '4초 들숨 - 4초 멈춤 - 6초 날숨 (미주신경 활성 호흡)';
  let mentalAnchor = '코끝을 스치는 숨결의 서늘함과 따뜻함에 주의 집중';

  if (element === '목') {
    primaryStyle = '소리 만트라 & 하트 공명 (Mantra Sound)';
    intendedMindState = '연결·영감';
    zenEnergyArchetype = '생명수를 머금은 봄나무 같은 자비로운 명상가';
    posture = '척추를 위로 가볍게 신장시킨 좌선 자세, 양손은 단전 위 무드라';
    breathRatio = '5초 들숨 - 2초 머금음 - 5초 날숨 (자연스러운 순환 호흡)';
    mentalAnchor = '가슴 중앙 아나하타 차크라의 따뜻한 녹색 빛에 집중';
  } else if (element === '화') {
    primaryStyle = '불꽃 트라타카 시각화 (Trataka Focus)';
    intendedMindState = '평정·몰입';
    zenEnergyArchetype = '타오르는 불꽃 속을 응시하는 정열의 연금술사';
    posture = '허리를 곧게 세우고 어깨의 힘을 툭 떨어뜨린 편안한 의자 자세';
    breathRatio = '4초 들숨 - 7초 멈춤 - 8초 부드러운 날숨 (4-7-8 이완 호흡)';
    mentalAnchor = '눈앞 1미터 지점 가상의 촛불 중심부에 시선을 고정';
  } else if (element === '토') {
    primaryStyle = '그라운딩 단전 호흡 (Earth Grounding)';
    intendedMindState = '안정·그라운딩';
    zenEnergyArchetype = '어떤 풍파에도 흔들리지 않는 대지(大地)의 닻';
    posture = '두 발을 바닥에 완벽히 밀착시킨 채 체중을 대지에 온전히 맡김';
    breathRatio = '4초 들숨 - 4초 멈춤 - 4초 날숨 - 4초 비움 (정방형 박스 호흡)';
    mentalAnchor = '아랫배 배꼽 아래 5cm 하단전의 묵직한 중력감에 주의 집중';
  } else if (element === '금') {
    primaryStyle = '비파사나 통찰 관조 (Vipassana Insight)';
    intendedMindState = '명료·관조';
    zenEnergyArchetype = '서릿발 칼날처럼 잡념을 가르는 순수 이성의 선객';
    posture = '가슴을 활짝 편 반가부좌, 턱을 살짝 당긴 수평 시선';
    breathRatio = '4초 들숨 - 2초 멈춤 - 6초 날숨 (미주신경 이완 안정 호흡)';
    mentalAnchor = '떠오르는 잡념을 잡지도 밀어내지도 않고 흐르는 구름처럼 관찰';
  } else if (element === '수') {
    primaryStyle = '젠 침묵 좌선 (Zen Emptiness)';
    intendedMindState = '고요·내면 관찰';
    zenEnergyArchetype = '심연의 바다를 품은 무한한 침묵의 탐구자';
    posture = '벽을 마주보고 반쯤 눈을 뜬 채 45도 아래를 바라보는 조용한 좌선';
    breathRatio = '들숨과 날숨을 의식하지 않고 숨결이 스스로 쉬어지도록 방하착';
    mentalAnchor = '머릿속 모든 생각의 공간적 여백과 배경의 고요함 자체에 주의 집중';
  }

  // 24시간 최적 명상 시간대 산출
  const hour = targetDate.getHours();
  let optimalTimeWindow = '자시(子時, 23:00~01:00) 심야의 절대적 침묵 리셋';
  if (hour >= 4 && hour < 9) {
    optimalTimeWindow = '묘시(卯時, 05:00~07:00) 여명의 영적 각성과 하루 중심 잡기';
  } else if (hour >= 9 && hour < 14) {
    optimalTimeWindow = '사시/오시(巳午時, 11:00~13:00) 정오의 양기 과열 진정과 3분 뇌 리셋';
  } else if (hour >= 14 && hour < 19) {
    optimalTimeWindow = '신시/유시(申酉時, 16:00~18:00) 황혼의 피로 분해와 감정 디톡스';
  }

  // 평정심 지수 (0~100)
  const equanimityScore = 72 + ((targetDate.getDate() * 7 + (element.charCodeAt(0) % 10) * 3) % 25); // 72~96
  const stressReleasePotential = 80 + ((targetDate.getDay() * 11 + targetDate.getHours() * 3) % 19); // 80~98

  // 주역 젠 상태
  let ichingZenState: TranscendentalMeditationReport['ichingZenState'] = {
    hexagramName: '제2괘 곤위지 (坤爲地)',
    stateQuality: '순수한 수용과 비움 (곤위지)',
    mantraText: '대지처럼 모든 것을 묵묵히 받아들이고 품을 때, 세상의 모든 긴장은 저절로 녹아내린다.'
  };

  if (targetDate.getDate() % 2 === 0) {
    ichingZenState = {
      hexagramName: '제1괘 건위천 (乾爲天)',
      stateQuality: '강력한 영감과 창조성 (건위천)',
      mantraText: '텅 빈 고요 속에서 순수한 우주적 생명력이 솟아나 내 안의 위대한 잠재력을 깨운다.'
    };
  }

  const prescription: MeditationPrescription = {
    primaryStyle,
    intendedMindState,
    optimalTimeWindow,
    postureAndBreathing: {
      posture,
      breathRatio,
      mentalAnchor
    }
  };

  const calculatedAtKst = formatZenKstTimestamp(targetDate);
  const q = (question || '').trim();
  const zenSynthesisMatrix = {
    dominantTension: `${zenEnergyArchetype} ↔ ${intendedMindState}`,
    alignmentState: `${ichingZenState.hexagramName} · ${optimalTimeWindow}`,
    integratedAction: `${mentalAnchor}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const synthesisPromptGuidance = `[LUCKEY 초월 명상 & 마음 안정 지능 v2.0.0 | ${calculatedAtKst}]
- 명상 페르소나 아키타입: ${zenEnergyArchetype}
- 추천 명상 양식: ${primaryStyle}
- 명상 의도: ${intendedMindState}
- 오늘 최적 명상 윈도우: ${optimalTimeWindow}
- 호흡 및 자세: [자세] ${posture} | [호흡] ${breathRatio} | [닻] ${mentalAnchor}
- 주역 젠 만트라 (${ichingZenState.hexagramName}): "${ichingZenState.mantraText}"
- 초월 명상 교차 매트릭스: 핵심 긴장(${zenSynthesisMatrix.dominantTension}) · 조율 상태(${zenSynthesisMatrix.alignmentState}) · 통합 실천(${zenSynthesisMatrix.integratedAction})`;

  return {
    engineVersion: TRANSCENDENTAL_MEDITATION_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    equanimityScore,
    stressReleasePotential,
    zenEnergyArchetype,
    prescription,
    ichingZenState,
    synthesisPromptGuidance,
    zenSynthesisMatrix,
  };
}

export type TranscendentalMeditationResult = TranscendentalMeditationReport;

export function calculateTranscendentalMeditation(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): TranscendentalMeditationResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runTranscendentalMeditationEngine(profile, targetDate, params?.question);
}

export function formatTranscendentalMeditationPrompt(res: TranscendentalMeditationResult): string {
  return res.synthesisPromptGuidance;
}
