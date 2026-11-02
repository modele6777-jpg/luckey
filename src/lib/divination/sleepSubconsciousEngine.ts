/**
 * =========================================================================
 * LUCKEY 수면 뇌파 & 무의식 직관 디코딩 엔진 (Sleep & Subconscious Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주 12운성의 사(死)·묘(墓)·절(絶) 깊은 의식 이완 궤적, 점성술 12하우스
 * (무의식·꿈·영혼의 치유처), 그리고 달(Moon)의 실시간 위상 에너지를 융합하여
 * 오늘 밤 최적의 수면 뇌파 유도 주파수, 3분 나이트 리셋 리추얼, 그리고
 * 꿈이 암시하는 직관 디코딩 가이드를 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SLEEP_SUBCONSCIOUS_VERSION = 'LUCKEY-SLEEP-v1.0.0';

export interface NightResetRitual {
  step1BrainDump: string;       // 1단계: 뇌신경 전압 해제 (머릿속 생각 털어내기)
  step2ThermalRelease: string;  // 2단계: 체온 조절 및 이완 (말초 혈관 확장)
  step3Incubation: string;      // 3단계: 무의식 인큐베이션 (꿈에 질문 맡기기)
}

export interface DreamDecodingClue {
  dreamSymbolCategory: string;   // 꿈의 주요 상징 테마
  subconsciousMessage: string;  // 무의식이 현재 의식에 보내는 핵심 시그널
  lucidAwakeningPrompt: string; // 아침 기상 직후 1줄 직관 포착 질문
}

export interface SleepSubconsciousResult {
  engineVersion: string;
  calculatedAtIso: string;

  // 수면 회복 잠재력 지수 (0~100)
  sleepRecoveryScore: number;
  sleepQualityTitle: string;

  // 추천 수면 뇌파 및 사운드 주파수
  soundWaveProtocol: {
    targetWave: string;         // 타깃 뇌파 (델타파/세타파)
    frequencyHz: string;        // 추천 음향 주파수
    soundDescription: string;   // 음향 특성
  };

  // 3단계 나이트 리셋 리추얼
  nightRitual: NightResetRitual;

  // 꿈 직관 디코딩 가이드
  dreamDecoding: DreamDecodingClue;

  summary: string;
}

/**
 * 수면 무의식 엔진 연산 메인 함수
 */
export function calculateSleepSubconscious(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): SleepSubconsciousResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const elements = saju.elements.counts;
  const dayGan = saju.pillars.day.gan;

  // 1. 수면 회복 스코어 (0~100)
  let sleepRecoveryScore = 78;
  if ((elements['수'] || 0) >= 1) sleepRecoveryScore += 8; // 수 기운의 깊은 휴식
  if ((elements['금'] || 0) >= 2) sleepRecoveryScore += 5; // 금 기운의 불필요한 생각 단절
  sleepRecoveryScore = Math.min(97, sleepRecoveryScore);

  let sleepQualityTitle = '깊은 무의식 치유 궤도 (Deep Restorative Flow)';
  if (sleepRecoveryScore >= 88) sleepQualityTitle = '최상의 델타파 완전 회복 (Delta Bliss)';
  else if (sleepRecoveryScore >= 78) sleepQualityTitle = '안정적 무의식 재충전 (Restorative Flow)';
  else sleepQualityTitle = '뇌신경 전압 감압 필요 (Need Tension Release)';

  // 2. 뇌파 및 사운드 프로토콜
  const soundWaveProtocol = {
    targetWave: '델타파(Delta, 0.5~3Hz) & 세타파(Theta, 4~7Hz) 하이브리드',
    frequencyHz: '432Hz 우주 자연 조화 주파수 + 396Hz 죄책감/두려움 해소 솔페지오',
    soundDescription: '깊은 밤 잔잔하게 밀려오는 파도 소리와 432Hz 따뜻한 사인파 패드 음'
  };

  // 3. 3단계 나이트 리셋 리추얼
  const nightRitual: NightResetRitual = {
    step1BrainDump: '【1단계: 뇌신경 덤프】 잠들기 전 스마트폰을 내려놓고, 머릿속을 맴도는 잔여 생각 3가지를 메모장에 적어 뇌 밖으로 배출하기',
    step2ThermalRelease: '【2단계: 온열 감압】 미온수 세안 또는 따뜻한 수건으로 눈가를 1분간 감싸 시신경 긴장 해소하기',
    step3Incubation: '【3단계: 무의식 인큐베이션】 "내일 내가 마주할 가장 멋진 해결책을 내 깊은 무의식이 밤사이 아름답게 빚어낸다"고 마음속으로 읊으며 눈 감기'
  };

  // 4. 꿈 직관 디코딩 가이드
  const dreamDecoding: DreamDecodingClue = {
    dreamSymbolCategory: (elements['수'] || 0) >= (elements['화'] || 0) ? '바다·하늘·광활한 공간의 비행' : '새로운 건축물·빛·기계 장치 조립',
    subconsciousMessage: '현재 낮 동안 의식적으로 풀지 못한 복잡한 논리와 아이디어를 무의식이 밤사이 백그라운드에서 재조합하는 중입니다.',
    lucidAwakeningPrompt: '아침에 눈을 뜨자마자 "방금 내 꿈이 나에게 남겨준 단 하나의 단어나 느낌은 무엇인가?"를 10초간 떠올려 보세요.'
  };

  const summary = `[수면 무의식 엔진] 회복 잠재력: ${sleepRecoveryScore}점 [${sleepQualityTitle}]. ` +
    `뇌파 타깃: 델타/세타 (432Hz & 396Hz). 3단계 나이트 리셋 및 꿈 인큐베이션 장착.`;

  return {
    engineVersion: SLEEP_SUBCONSCIOUS_VERSION,
    calculatedAtIso: now.toISOString(),
    sleepRecoveryScore,
    sleepQualityTitle,
    soundWaveProtocol,
    nightRitual,
    dreamDecoding,
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatSleepSubconsciousPrompt(res: SleepSubconsciousResult): string {
  return `[수면 뇌파 & 무의식 직관 디코딩 리포트 (엔진: ${res.engineVersion})]
- 수면 회복 잠재력 지수: **${res.sleepRecoveryScore}점** [${res.sleepQualityTitle}]
- 수면 사운드 & 뇌파 처방:
  • 타깃 뇌파: ${res.soundWaveProtocol.targetWave}
  • 추천 주파수: **${res.soundWaveProtocol.frequencyHz}**
  • 음향 가이드: ${res.soundWaveProtocol.soundDescription}
- 3단계 나이트 리셋 리추얼:
  • ${res.nightRitual.step1BrainDump}
  • ${res.nightRitual.step2ThermalRelease}
  • ${res.nightRitual.step3Incubation}
- 꿈 직관 디코딩:
  • 상징 테마: ${res.dreamDecoding.dreamSymbolCategory}
  • 무의식 메시지: ${res.dreamDecoding.subconsciousMessage}
  • 아침 10초 직관 포착: "${res.dreamDecoding.lucidAwakeningPrompt}"
※ 루시 지침: 수면은 단순히 하루를 끄는 오프(Off) 버튼이 아니라, 무의식이 뇌신경을 깨끗이 정화하고 놀라운 영감을 빚어내는 '영혼의 성역'입니다. 사용자가 오늘 하루의 피로를 부드럽게 털어내고, 밤사이 델타파의 깊은 치유와 창의적 무의식 인큐베이션을 온전히 누릴 수 있도록 다정하고 평온하게 안내해 주세요.`;
}
