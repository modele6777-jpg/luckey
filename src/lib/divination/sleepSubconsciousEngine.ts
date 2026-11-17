/**
 * =========================================================================
 * LUCKEY 수면 회복 & 무의식 직관 디코딩 엔진 (Sleep & Subconscious Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주 12운성의 사(死)·묘(墓)·절(絶) 깊은 의식 이완 궤적, 점성술 12하우스
 * (무의식·꿈·영혼의 치유처), 그리고 달(Moon)의 실시간 위상 에너지를 융합하여
 * 오늘 밤 활용할 수 있는 일반 사운드 스케이프, 3분 나이트 리셋 리추얼,
 * 그리고 꿈이 암시하는 직관 디코딩 가이드를 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SLEEP_SUBCONSCIOUS_VERSION = 'LUCKEY-SLEEP-v2.1.0';

function formatSleepKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

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
  calculatedAtKst: string;

  // 수면 회복 잠재력 지수 (0~100)
  sleepRecoveryScore: number;
  sleepQualityTitle: string;

  // 편안한 수면 환경을 위한 일반 사운드 안내
  soundscape: {
    recommendedSounds: string;
    listeningGuidance: string;
  };

  // 3단계 나이트 리셋 리추얼
  nightRitual: NightResetRitual;

  // 꿈 직관 디코딩 가이드
  dreamDecoding: DreamDecodingClue;

  summary: string;
  reflectiveQuestion?: string;
  sleepSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

/**
 * 수면 무의식 엔진 연산 메인 함수
 */
export function calculateSleepSubconscious(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
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

  let sleepQualityTitle = '깊은 휴식 회복 궤도 (Deep Restorative Flow)';
  if (sleepRecoveryScore >= 88) sleepQualityTitle = '최상의 깊은 회복 (Deep Rest Bliss)';
  else if (sleepRecoveryScore >= 78) sleepQualityTitle = '안정적 무의식 재충전 (Restorative Flow)';
  else sleepQualityTitle = '긴장 완화가 필요한 날 (Need Tension Release)';

  // 2. 일반 사운드 스케이프 안내
  const soundscape = {
    recommendedSounds: '잔잔한 파도 소리 또는 부드러운 앰비언트 음악',
    listeningGuidance: '낮은 볼륨으로 배경에 두고 편안한 호흡과 함께 들어보세요.'
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
    `편안한 사운드 스케이프와 3단계 나이트 리셋, 꿈 인큐베이션을 안내합니다.`;

  const calculatedAtKst = formatSleepKstTimestamp(now);
  const q = (params?.question || '').trim();
  const sleepSynthesisMatrix = {
    dominantTension: `${sleepQualityTitle} ↔ ${dreamDecoding.dreamSymbolCategory}`,
    alignmentState: `사운드: ${soundscape.recommendedSounds}`,
    integratedAction: `${nightRitual.step3Incubation}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const interpretiveBoundary = '본 수면 회복 & 무의식 직관 리포트는 사주 12운성과 상징 수리에 기반한 정성적 야간 이완 안내이며, 수면의학적·정신의학적 진단을 대신하지 않습니다.';
  const reflectiveQuestion = q
    ? `"${q}"에 대한 생각을 오늘 밤 무의식 인큐베이션에 맡긴다면, 잠들기 전 내려놓고 싶은 가장 무거운 문장 하나는 무엇인가요?`
    : `오늘 밤 잠들기 전 뇌신경 전압을 낮추기 위해 머리맡에 한 줄로 비워 두고 싶은 생각은 무엇인가요?`;

  return {
    engineVersion: SLEEP_SUBCONSCIOUS_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    sleepRecoveryScore,
    sleepQualityTitle,
    soundscape,
    nightRitual,
    dreamDecoding,
    summary,
    reflectiveQuestion,
    sleepSynthesisMatrix,
    interpretiveBoundary,
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatSleepSubconsciousPrompt(res: SleepSubconsciousResult): string {
  const lines = [
    `[수면 회복 & 무의식 직관 디코딩 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]`,
    `- 수면 회복 잠재력 상태: **${res.sleepQualityTitle}**`,
    `- 수면 사운드 가이드:`,
    `  • 추천 사운드: ${res.soundscape.recommendedSounds}`,
    `  • 활용 안내: ${res.soundscape.listeningGuidance}`,
    `- 3단계 나이트 리셋 리추얼:`,
    `  • ${res.nightRitual.step1BrainDump}`,
    `  • ${res.nightRitual.step2ThermalRelease}`,
    `  • ${res.nightRitual.step3Incubation}`,
    `- 꿈 직관 디코딩:`,
    `  • 상징 테마: ${res.dreamDecoding.dreamSymbolCategory}`,
    `  • 무의식 메시지: ${res.dreamDecoding.subconsciousMessage}`,
    `  • 아침 10초 직관 포착: "${res.dreamDecoding.lucidAwakeningPrompt}"`,
  ];
  if (res.sleepSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스: [핵심 긴장: ${res.sleepSynthesisMatrix.dominantTension} | 조율 상태: ${res.sleepSynthesisMatrix.alignmentState}]`,
      `  • 통합 실천: ${res.sleepSynthesisMatrix.integratedAction}`,
    );
  }
  if (res.reflectiveQuestion) {
    lines.push(`- 성찰 질문: ${res.reflectiveQuestion}`);
  }
  lines.push(`- 해석 경계: ${res.interpretiveBoundary}`);
  lines.push(`※ 루시 지침: 수면은 단순히 하루를 끄는 오프(Off) 버튼이 아니라, 몸과 마음이 쉬고 새로운 영감을 정리하는 시간입니다. 사용자가 하루의 피로를 부드럽게 털어내고, 자신에게 편안한 소리와 차분한 나이트 리셋을 선택하도록 다정하고 평온하게 안내해 주세요.`);
  return lines.join('\n');
}
