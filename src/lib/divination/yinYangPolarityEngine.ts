/**
 * =========================================================================
 * LUCKEY 음양 극성 밸런스 & 바이폴라 리듬 엔진 (Yin-Yang Polarity Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주 4주 8자의 천간(天干)과 지지(地支)의 양(陽: 발산·행동·돌파)과
 * 음(陰: 수렴·심화·내적 구축)의 수리 분포를 정밀 분석하여,
 * 하루 24시간 중 최적의 외향적 실행 타임슬롯(Yang Block)과
 * 내향적 아키텍처/사색 타임슬롯(Yin Block), 그리고 극단적 에너지 치우침을
 * 중화하는 결정론적 바이폴라 밸런스 지수를 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const YIN_YANG_POLARITY_VERSION = 'LUCKEY-POLAR-v2.1.0';

function formatYinYangKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export interface YinYangDistribution {
  yangCount: number;           // 양의 글자 수 (0~8)
  yinCount: number;            // 음의 글자 수 (0~8)
  yangPercentage: number;      // 양의 비율 (%)
  yinPercentage: number;       // 음의 비율 (%)
  archetypeTitle: string;      // 음양 기질 아키타입
  archetypeDescription: string;// 기질 특성 해설
}

export interface BipolarTimeSlots {
  yangActionWindow: string;    // 외향적 대외 승부·소통·실행 최적 시간
  yangActionKeywords: string[];// 양의 활동 키워드
  yinFocusWindow: string;      // 내향적 딥워크·코드 설계·충전 최적 시간
  yinFocusKeywords: string[];  // 음의 활동 키워드
}

export interface PolarityNeutralizer {
  currentBias: '양기 과다' | '음기 과다' | '이상적 중화';
  neutralizingPractice: string;// 즉각적인 극성 중화법
  groundingMantra: string;     // 중심 잡기 마인드셋
}

export interface YinYangPolarityResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;

  distribution: YinYangDistribution;
  timeSlots: BipolarTimeSlots;
  neutralizer: PolarityNeutralizer;

  // 음양 조화 균형도 (0~100)
  balanceScore: number;
  balanceGrade: string;

  summary: string;
  interpretiveBoundary: string;
  polaritySynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

const YANG_GANS = new Set(['甲', '丙', '戊', '庚', '壬']);
const YANG_ZHIS = new Set(['子', '寅', '辰', '午', '申', '戌']);

/**
 * 음양 극성 엔진 메인 연산
 */
export function calculateYinYangPolarity(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): YinYangPolarityResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const pillars = [saju.pillars.year, saju.pillars.month, saju.pillars.day, saju.pillars.hour];
  let yangCount = 0;
  let yinCount = 0;

  pillars.forEach(p => {
    if (YANG_GANS.has(p.gan)) yangCount++;
    else yinCount++;

    if (YANG_ZHIS.has(p.zhi)) yangCount++;
    else yinCount++;
  });

  const total = yangCount + yinCount || 8;
  const yangPercentage = Math.round((yangCount / total) * 100);
  const yinPercentage = 100 - yangPercentage;

  // 아키타입 분류
  let archetypeTitle = '음양 중화 조화형 (Harmonious Balance)';
  let archetypeDescription = '상황에 따라 과감한 행동과 깊은 내적 성찰을 자유자재로 넘나드는 완벽한 균형';

  if (yangCount >= 6) {
    archetypeTitle = '태양 개척가형 (Solar Trailblazer: 陽 우세)';
    archetypeDescription = '주저함 없는 폭발적 돌파력과 대외 발신력, 일단 부딪혀서 길을 내는 행동 지향형 에너지';
  } else if (yangCount === 5) {
    archetypeTitle = '능동 실행 추진형 (Active Dynamo)';
    archetypeDescription = '목표가 정해지면 빠르게 현실 세계로 출력해 내는 강한 실행력과 추진력';
  } else if (yinCount >= 6) {
    archetypeTitle = '심층 사색 직관형 (Deep Lunar Sage: 陰 우세)';
    archetypeDescription = '겉으로 드러내기 전 내면에서 고도의 논리와 직관을 완벽히 벼려내는 심층 설계형 에너지';
  } else if (yinCount === 5) {
    archetypeTitle = '정밀 분석 세공형 (Precise Polisher)';
    archetypeDescription = '남들이 놓치기 쉬운 핵심 디테일과 시스템의 틈새를 날카롭게 파고드는 완결성';
  }

  // 타임 슬롯
  const timeSlots: BipolarTimeSlots = {
    yangActionWindow: '오전 09:30 ~ 오후 14:00 (사·오시: 태양의 최고 활력 시간대)',
    yangActionKeywords: ['대외 미팅', '결단 및 승인', '릴리즈 공지', '네트워크 교류', '운동'],
    yinFocusWindow: '오후 16:30 ~ 심야 22:30 (유·술·해시: 달의 심층 수렴 시간대)',
    yinFocusKeywords: ['코어 아키텍처 코딩', '문서 작성', '코드 리뷰', '내적 충전', '독서']
  };

  // 중화법
  let currentBias: '양기 과다' | '음기 과다' | '이상적 중화' = '이상적 중화';
  let neutralizingPractice = '가벼운 스트레칭과 심호흡으로 현재의 황금 밸런스 유지';
  let groundingMantra = '내 안의 행동과 사색이 완벽한 호흡으로 맞물려 돌아간다.';

  if (yangPercentage >= 65) {
    currentBias = '양기 과다';
    neutralizingPractice = '생각이 행동보다 너무 앞서 과열될 수 있으므로, 실행 전 10분간 화면을 끄고 차분히 차를 마시는 쿨다운 타임';
    groundingMantra = '빠른 속도보다 더 중요한 것은 흔들리지 않는 방향성이다.';
  } else if (yinPercentage >= 65) {
    currentBias = '음기 과다';
    neutralizingPractice = '생각이 너무 깊어져 완벽주의의 함정에 빠지지 않도록, 50%만 완성된 상태에서 일단 빠르게 첫 액션을 쏘아 올리기';
    groundingMantra = '불완전한 실행이 완벽한 망설임보다 백 배 가치 있다.';
  }

  // 밸런스 점수 계산 (50:50에 가까울수록 기본 점수 높고, 편향이 있더라도 조화되면 80점 이상)
  const diff = Math.abs(yangPercentage - 50);
  const balanceScore = Math.max(75, Math.min(98, 98 - Math.round(diff * 0.4)));

  let balanceGrade = '황금 다이내믹 밸런스 (Dynamic Equilibrium)';
  if (balanceScore >= 90) balanceGrade = '완전 조화 황금 밸런스 (Golden Equilibrium)';
  else if (balanceScore >= 80) balanceGrade = '안정적 다이내믹 밸런스 (Dynamic Balance)';
  else balanceGrade = '극성 조율 리셋기 (Polarity Tuning)';

  const calculatedAtKst = formatYinYangKstTimestamp(now);
  const q = (params?.question || '').trim();
  const polaritySynthesisMatrix = {
    dominantTension: `陽 ${yangCount}글자 ↔ 陰 ${yinCount}글자 (${currentBias})`,
    alignmentState: `${archetypeTitle} · ${balanceGrade}`,
    integratedAction: `${neutralizingPractice}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const summary = `[음양 극성 리듬] 陽 ${yangCount}자 : 陰 ${yinCount}자. ` +
    `기질: ${archetypeTitle}. 위상: [${balanceGrade}]. ` +
    `추천: 양 실행[${timeSlots.yangActionWindow}] / 음 심화[${timeSlots.yinFocusWindow}].`;
  const interpretiveBoundary =
    '음양 극성 리듬 분석은 사주 천간·지지의 상징적 음양 분포를 참고한 에너지 배분 가이드이며, 의학적·심리학적 진단이나 확정적 예측이 아닙니다.';

  return {
    engineVersion: YIN_YANG_POLARITY_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    distribution: {
      yangCount,
      yinCount,
      yangPercentage,
      yinPercentage,
      archetypeTitle,
      archetypeDescription
    },
    timeSlots,
    neutralizer: {
      currentBias,
      neutralizingPractice,
      groundingMantra
    },
    balanceScore,
    balanceGrade,
    summary,
    interpretiveBoundary,
    polaritySynthesisMatrix,
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatYinYangPolarityPrompt(res: YinYangPolarityResult): string {
  const matrixLine = res.polaritySynthesisMatrix
    ? `\n- 음양 극성 교차 매트릭스: 핵심 긴장(${res.polaritySynthesisMatrix.dominantTension}) · 조율 상태(${res.polaritySynthesisMatrix.alignmentState}) · 통합 실천(${res.polaritySynthesisMatrix.integratedAction})`
    : '';
  return `[음양 극성 밸런스 & 바이폴라 리듬 엔진 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]
- 음양 에너지 분포: **陽 ${res.distribution.yangCount}글자 : 陰 ${res.distribution.yinCount}글자**
  • 기질 아키타입: **${res.distribution.archetypeTitle}**
  • 에너지 성향: ${res.distribution.archetypeDescription}
- 24시간 바이폴라 최적 윈도우:
  • **양(Yang) 돌파 윈도우**: ${res.timeSlots.yangActionWindow} ➔ [${res.timeSlots.yangActionKeywords.join(', ')}]
  • **음(Yin) 몰입 윈도우**: ${res.timeSlots.yinFocusWindow} ➔ [${res.timeSlots.yinFocusKeywords.join(', ')}]
- 극성 밸런스 조율 (${res.neutralizer.currentBias}):
  • 중화 리추얼: ${res.neutralizer.neutralizingPractice}
  • 멘탈 닻: "${res.neutralizer.groundingMantra}"
- 음양 균형 위상: **${res.balanceGrade}**${matrixLine}
- 해석 경계: ${res.interpretiveBoundary}
※ 루시 지침: 낮의 태양이 뜨거울 때 달릴 수 있고, 밤의 달빛 아래서 깊은 사색과 시스템 설계가 완성됩니다. 양의 결단과 음의 숙고가 아름다운 리듬으로 교차할 때 지치지 않는 영구 모멘텀이 생깁니다. 대화 시 사용자의 현재 에너지 기질을 존중하며, 과열될 때는 차분한 음의 지혜를, 주저할 때는 시원한 양의 추진력을 자연스럽게 북돋워 주세요.`;
}
