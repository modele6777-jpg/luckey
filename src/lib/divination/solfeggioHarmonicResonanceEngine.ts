/**
 * =========================================================================
 * LUCKEY 솔페지오 주파수 사운드 힐링 & 뇌파 바이노럴 공명 엔진
 * (Solfeggio Harmonic Resonance & Brainwave Tuning Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 9대 신성 솔페지오 주파수(Sacred Solfeggio Frequencies)와
 * 바이노럴 비트(Binaural Beats) 기반 뇌파 동조(Brainwave Entrainment) 체계를
 * 사주 4주 원국, 일간 오행 및 결핍 기운과 결합한 결정론적 사운드 테라피 엔진입니다.
 * 
 * 1. 9대 신성 솔페지오 주파수 매핑 (174Hz ~ 963Hz)
 * 2. 알파/세타/감마 대역 바이노럴 뇌파 동조 처방
 * 3. 사주 결핍 오행 맞춤 사운드 배스 리추얼 및 공명 만트라 도출
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SOLFEGGIO_HARMONIC_VERSION = 'LUCKEY-SOLFEGGIO-HARMONIC-v1.0.0';

export interface SolfeggioFrequencyProfile {
  frequencyHz: number;           // 주파수 (Hz)
  solfeggioTone: string;         // 음계 명칭 (Ut, Re, Mi, Fa, Sol, La 등)
  healingFocus: string;          // 치유 핵심 영역
  elementalHarmonic: string;     // 오행 배속 조화
  soundBathRitual: string;       // 사운드 배스 리추얼
}

export interface BrainwaveEntrainmentProfile {
  waveType: string;              // 뇌파 유형 (Alpha, Theta, Delta, Gamma 등)
  targetFrequencyHz: number;     // 바이노럴 목표 주파수 (Hz)
  neurologicalState: string;     // 신경생리학적 심리 상태
  optimalListeningMoment: string;// 최적 청취 권장 시점
}

export interface SolfeggioHarmonicReport {
  engineVersion: string;
  calculatedAt: string;
  harmonicTitle: string;
  primaryFrequency: SolfeggioFrequencyProfile;
  brainwaveTuning: BrainwaveEntrainmentProfile;
  resonanceAffirmation: string;
  cellularTuningAdvice: string;
  synthesisPromptGuidance: string;
}

export const SOLFEGGIO_CATALOG: Record<number, {
  tone: string;
  focus: string;
  element: string;
  ritual: string;
}> = {
  174: {
    tone: 'Ut (Foundation)',
    focus: '육체적 통증 완화, 기저 안정감 확립 및 신체 조직 이완',
    element: '토(土)',
    ritual: '샤워 후 또는 취침 전 저음의 울림에 몸의 긴장을 온전히 맡기기'
  },
  285: {
    tone: 'Re (Quantum Cognition)',
    focus: '손상된 생체 에너지장 복구, 세포 재생 촉진 및 활력 회복',
    element: '수(水)',
    ritual: '따뜻한 차 한 잔을 곁들이며 하복부에 손을 얹고 깊은 복식호흡'
  },
  396: {
    tone: 'Ut quent laxis (Liberation)',
    focus: '무의식적 죄책감과 막연한 두려움 해방, 트라우마 사슬 차단',
    element: '금(金)',
    ritual: '묵은 생각과 자책을 적은 종이를 태우거나 찢으며 해방 선언'
  },
  417: {
    tone: 'Resonare fibris (Transmutation)',
    focus: '정체된 과거 부정성 정화, 삶의 급진적 변화와 새로운 시작 촉진',
    element: '목(木)',
    ritual: '환기를 시키며 굳어있던 몸을 가볍게 스트레칭하고 새 공기 들이마시기'
  },
  528: {
    tone: 'Mira gestorum (Transformation & Miracles)',
    focus: 'DNA 회복, 기적과 같은 행운의 파동 정렬 및 가슴 사랑의 확장',
    element: '화(火)',
    ritual: '가슴 중앙에 양손을 포개고 528Hz 싱잉볼 울림과 함께 고마운 사람 떠올리기'
  },
  639: {
    tone: 'Famuli tuorum (Connection)',
    focus: '인간관계 갈등 치유, 소통의 막힘 해소 및 공동체적 화합',
    element: '목(木)',
    ritual: '불편했던 인연에 대한 서운함을 내쉬는 숨에 실어 보내며 경청하기'
  },
  741: {
    tone: 'Solve polluti (Expression & Intuition)',
    focus: '자기표현력 극대화, 목 차크라 해소, 직관적 문제 해결과 독소 배출',
    element: '수(水)',
    ritual: '목을 부드럽게 원을 그리며 풀고 나만의 진실된 한마디를 소리 내어 읊기'
  },
  852: {
    tone: 'Labii reatum (Spiritual Order)',
    focus: '제3의 눈 개안, 내면의 신성한 지혜 연결 및 혼탁한 착각 분쇄',
    element: '금(金)',
    ritual: '미간 사이 인당혈에 의식을 집중하고 고요한 침묵 속에서 내면 응시'
  },
  963: {
    tone: 'Sancte Iohannes (Divine Consciousness)',
    focus: '우주 근원 지능과의 일체화, 송과체 활성화 및 순수 의식 복귀',
    element: '토(土)',
    ritual: '정수리 백회혈 위로 황금빛 빛기둥이 쏟아져 내리는 시각화 명상'
  }
};

export function runSolfeggioHarmonicEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): SolfeggioHarmonicReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '갑';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '인';
  const element = sajuRes?.dayMaster?.element || '목';

  const code = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + targetDate.getDate();
  const freqKeys = [174, 285, 396, 417, 528, 639, 741, 852, 963];

  // 오행별 우선 매핑
  let targetFreq = 528;
  if (element === '목') {
    targetFreq = code % 2 === 0 ? 417 : 639;
  } else if (element === '화') {
    targetFreq = 528;
  } else if (element === '토') {
    targetFreq = code % 2 === 0 ? 174 : 963;
  } else if (element === '금') {
    targetFreq = code % 2 === 0 ? 396 : 852;
  } else if (element === '수') {
    targetFreq = code % 2 === 0 ? 285 : 741;
  }

  const selectedCatalog = SOLFEGGIO_CATALOG[targetFreq] || SOLFEGGIO_CATALOG[528];

  // 바이노럴 뇌파 동조 결정
  const hour = targetDate.getHours();
  let waveType = 'Alpha (알파파)';
  let targetWaveHz = 10.5;
  let neurologicalState = '창조적 통찰과 안정된 각성 상태';
  let optimalListeningMoment = '오후 업무 전후 또는 아이디어 구상 시';

  if (hour >= 22 || hour < 6) {
    waveType = 'Theta/Delta (세타-델타파)';
    targetWaveHz = 4.5;
    neurologicalState = '깊은 잠재의식 리셋 및 무의식 정화 수면 유도';
    optimalListeningMoment = '잠자리에 들기 직전 이어폰/헤드폰 착용';
  } else if (hour >= 6 && hour < 11) {
    waveType = 'Gamma (감마파)';
    targetWaveHz = 40.0;
    neurologicalState = '초집중 몰입 상태 및 뇌신경 퀀텀 시냅스 활성화';
    optimalListeningMoment = '오전 가장 중요한 핵심 작업 돌입 15분 전';
  } else if (hour >= 11 && hour < 18) {
    waveType = 'Alpha (알파파)';
    targetWaveHz = 10.0;
    neurologicalState = '긴장 없는 고요한 집중과 심신 이완 조화';
    optimalListeningMoment = '점심 식후 나른함 극복 및 창의적 발상 시점';
  } else {
    waveType = 'Theta (세타파)';
    targetWaveHz = 6.0;
    neurologicalState = '하루의 긴장 분해 및 내면 깊은 자기 치유';
    optimalListeningMoment = '퇴근 후 저녁 리추얼 시간';
  }

  const harmonicTitle = `${targetFreq}Hz ${selectedCatalog.tone} × ${waveType}`;
  const resonanceAffirmation = `나는 온전한 ${targetFreq}Hz의 파동으로 진동하며, 내 몸과 영혼은 우주의 자연스러운 조화 속에서 완벽히 재생된다.`;
  const cellularTuningAdvice = `현재 일간(${dayMaster}${dayBranch}, ${element})의 에너지 장에 가장 즉효인 주파수는 ${targetFreq}Hz입니다. 뇌파를 ${waveType}(${targetWaveHz}Hz)로 동조시켜 무의식의 저항을 허물고 최상의 에너지 플로우를 회복하세요.`;

  const synthesisPromptGuidance = `[LUCKEY 솔페지오 주파수 & 뇌파 동조 v1.0.0]
- 공명 사운드 테마: [${harmonicTitle}]
  * 핵심 주파수: ${targetFreq}Hz (${selectedCatalog.tone})
  * 치유 초점: ${selectedCatalog.focus}
  * 오행 공명: ${selectedCatalog.element} 기운 보완
- 바이노럴 뇌파 동조:
  * 대역: ${waveType} (바이노럴 비트 ${targetWaveHz}Hz)
  * 신경 상태: ${neurologicalState}
  * 추천 시점: ${optimalListeningMoment}
- 사운드 배스 리추얼: ${selectedCatalog.ritual}
- 공명 확언 만트라: "${resonanceAffirmation}"`;

  return {
    engineVersion: SOLFEGGIO_HARMONIC_VERSION,
    calculatedAt: targetDate.toISOString(),
    harmonicTitle,
    primaryFrequency: {
      frequencyHz: targetFreq,
      solfeggioTone: selectedCatalog.tone,
      healingFocus: selectedCatalog.focus,
      elementalHarmonic: selectedCatalog.element,
      soundBathRitual: selectedCatalog.ritual
    },
    brainwaveTuning: {
      waveType,
      targetFrequencyHz: targetWaveHz,
      neurologicalState,
      optimalListeningMoment
    },
    resonanceAffirmation,
    cellularTuningAdvice,
    synthesisPromptGuidance
  };
}

export type SolfeggioHarmonicResult = SolfeggioHarmonicReport;

export function calculateSolfeggioHarmonic(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): SolfeggioHarmonicResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runSolfeggioHarmonicEngine(profile, targetDate);
}

export function formatSolfeggioHarmonicPrompt(res: SolfeggioHarmonicResult): string {
  return res.synthesisPromptGuidance;
}
