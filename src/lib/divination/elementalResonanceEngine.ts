/**
 * =========================================================================
 * LUCKEY 오행 생극제화 & 에너지 공명 증폭 엔진 (Elemental Resonance Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주명리의 목(木)·화(火)·토(土)·금(金)·수(水) 5대 오행의 생극제화(生剋制化)
 * 역학을 정밀 수치화하여, 오행의 상생 순환 고리(Generation Loop)와
 * 에너지가 막혀 있는 병목(Bottleneck) 오행을 진단하고, 당일 생기(生氣)를
 * 최대치로 증폭하는 공명 주파수·컬러·행동 처방을 결정론적으로 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const ELEMENTAL_RESONANCE_VERSION = 'LUCKEY-RESON-v1.0.0';

export type ElementName = '목' | '화' | '토' | '금' | '수';

export interface ElementStateDetail {
  element: ElementName;
  hanja: string;
  count: number;
  percentage: number;          // 전체 원국 내 비중 (%)
  vitalityLevel: '결핍' | '부족' | '균형' | '왕성' | '태과';
  roleInCycle: string;        // 순환 고리 내 역할
  chargeScore: number;         // 에너지 충전률 (0~100)
}

export interface GenerationLoopAnalysis {
  isLoopComplete: boolean;     // 5행이 모두 존재하여 원활히 순환하는지 여부
  flowingPairs: string[];      // 활성화된 상생 쌍 (예: '목생화', '토생금')
  stagnantPair: string;        // 가장 막히기 쉬운 병목 지점
  circulationScore: number;    // 오행 순환 원활도 점수 (0~100)
}

export interface ResonanceAmplifier {
  primeElement: ElementName;   // 1순위 증폭 필요 오행
  amplifierColor: string;      // 공명 컬러
  amplifierFood: string;       // 생기 식재료
  amplifierActivity: string;   // 1분 활성화 행동
  resonanceAura: string;       // 활성화 시 발현되는 아우라
}

export interface ElementalResonanceResult {
  engineVersion: string;
  calculatedAtIso: string;

  // 오행별 상태 상세
  elements: Record<ElementName, ElementStateDetail>;

  // 상생 순환 고리 분석
  loopAnalysis: GenerationLoopAnalysis;

  // 당일 1순위 에너지 공명 증폭기
  amplifier: ResonanceAmplifier;

  // 종합 생기 공명 지수 (0~100)
  overallResonanceScore: number;
  resonanceGrade: string;

  summary: string;
}

const ELEMENT_HANJA: Record<ElementName, string> = {
  '목': '木',
  '화': '火',
  '토': '土',
  '금': '金',
  '수': '水'
};

const NEXT_ELEMENT: Record<ElementName, ElementName> = {
  '목': '화',
  '화': '토',
  '토': '금',
  '금': '수',
  '수': '목'
};

/**
 * 오행 생극 공명 엔진 메인 연산
 */
export function calculateElementalResonance(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): ElementalResonanceResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const rawCounts = saju.elements.counts;
  const totalCount = Object.values(rawCounts).reduce((acc, c) => acc + c, 0) || 8;

  const elementOrder: ElementName[] = ['목', '화', '토', '금', '수'];
  const elementsState = {} as Record<ElementName, ElementStateDetail>;

  elementOrder.forEach(el => {
    const cnt = rawCounts[el] || 0;
    const pct = Math.round((cnt / totalCount) * 100);

    let vitality: '결핍' | '부족' | '균형' | '왕성' | '태과' = '균형';
    let charge = 70;

    if (cnt === 0) {
      vitality = '결핍';
      charge = 30;
    } else if (cnt === 1) {
      vitality = '부족';
      charge = 55;
    } else if (cnt === 2) {
      vitality = '균형';
      charge = 85;
    } else if (cnt === 3) {
      vitality = '왕성';
      charge = 92;
    } else {
      vitality = '태과';
      charge = 98;
    }

    elementsState[el] = {
      element: el,
      hanja: ELEMENT_HANJA[el],
      count: cnt,
      percentage: pct,
      vitalityLevel: vitality,
      roleInCycle: `${el}기운 (${cnt}개)`,
      chargeScore: charge
    };
  });

  // 상생 순환 분석
  const flowingPairs: string[] = [];
  let completeCount = 0;

  elementOrder.forEach(el => {
    const next = NEXT_ELEMENT[el];
    if ((rawCounts[el] || 0) > 0 && (rawCounts[next] || 0) > 0) {
      flowingPairs.push(`${el}생${next}(${ELEMENT_HANJA[el]}生${ELEMENT_HANJA[next]})`);
      completeCount++;
    }
  });

  const isLoopComplete = completeCount === 5;
  let circulationScore = Math.min(98, 50 + (completeCount * 10));

  // 병목 지점 찾기 (가장 적은 개수 또는 0개)
  let minCount = 99;
  let stagnantTarget: ElementName = '수';

  elementOrder.forEach(el => {
    const c = rawCounts[el] || 0;
    if (c < minCount) {
      minCount = c;
      stagnantTarget = el;
    }
  });

  const stagnantPair = `${stagnantTarget} 기운 정체구간 (${stagnantTarget === '목' ? '기획·도전' : stagnantTarget === '화' ? '표현·발열' : stagnantTarget === '토' ? '안정·수렴' : stagnantTarget === '금' ? '결단·완성' : '지혜·유연'} 에너지 보충 요망)`;

  // 증폭기 처방
  const primeElement = stagnantTarget;
  let amplifierColor = '그린 & 에메랄드';
  let amplifierFood = '신선한 샐러드, 녹차, 사과';
  let amplifierActivity = '아침 가벼운 스트레칭과 새로운 프로젝트 한 줄 기획';
  let resonanceAura = '생동하는 성장력과 무한한 시작의 활력';

  if (primeElement === '화') {
    amplifierColor = '레드, 버건디 & 코랄 오렌지';
    amplifierFood = '토마토, 비트, 따뜻한 루이보스티';
    amplifierActivity = '햇살 쬐며 5분 산책, 목소리에 열정을 싣는 발성 리추얼';
    resonanceAura = '세상을 밝히는 열정과 카리스마 있는 대외 표현력';
  } else if (primeElement === '토') {
    amplifierColor = '옐로우, 카멜 & 베이지';
    amplifierFood = '단호박, 고구마, 따뜻한 현미차';
    amplifierActivity = '책상 정리 및 마음을 차분히 가라앉히는 복식호흡';
    resonanceAura = '흔들림 없는 신뢰감과 만물을 품어내는 포용력';
  } else if (primeElement === '금') {
    amplifierColor = '화이트, 실버 & 메탈릭 골드';
    amplifierFood = '도라지차, 배, 백미, 견과류';
    amplifierActivity = '불필요한 코드/태스크 단호히 가지치기, 자세 곧게 펴기';
    resonanceAura = '단칼에 본질을 꿰뚫는 명석한 결단력과 완성미';
  } else if (primeElement === '수') {
    amplifierColor = '블랙, 딥 네이비 & 차콜';
    amplifierFood = '미역, 흑임자, 충분한 미온수';
    amplifierActivity = '잔잔한 엠비언트 사운드와 함께 깊은 생각에 잠기는 명상';
    resonanceAura = '어디든 스며드는 유연한 지혜와 통찰적 영감';
  }

  const amplifier: ResonanceAmplifier = {
    primeElement,
    amplifierColor,
    amplifierFood,
    amplifierActivity,
    resonanceAura
  };

  const overallResonanceScore = Math.min(99, Math.round((circulationScore + (elementsState[saju.pillars.day.gan === '庚' ? '금' : '목']?.chargeScore || 80)) / 2));

  let resonanceGrade = '고주파 안정 공명 (High Resonance)';
  if (overallResonanceScore >= 90) resonanceGrade = '완전 조화 황금 순환 (Golden Harmony)';
  else if (overallResonanceScore >= 80) resonanceGrade = '고주파 안정 공명 (High Resonance)';
  else resonanceGrade = '생기 재충전 조율기 (Resonance Tuning)';

  const summary = `[오행 생극 공명] 순환 원활도: ${circulationScore}점. ` +
    `핵심 상생 고리: ${flowingPairs.slice(0, 3).join(', ')}. ` +
    `1순위 증폭 오행: ${primeElement}(${ELEMENT_HANJA[primeElement]}). ` +
    `공명 컬러: ${amplifierColor}. 종합 점수: ${overallResonanceScore}점 [${resonanceGrade}].`;

  return {
    engineVersion: ELEMENTAL_RESONANCE_VERSION,
    calculatedAtIso: now.toISOString(),
    elements: elementsState,
    loopAnalysis: {
      isLoopComplete,
      flowingPairs,
      stagnantPair,
      circulationScore
    },
    amplifier,
    overallResonanceScore,
    resonanceGrade,
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatElementalResonancePrompt(res: ElementalResonanceResult): string {
  return `[오행 생극제화 & 에너지 공명 증폭 엔진 리포트 (엔진: ${res.engineVersion})]
- 오행 활력 스펙트럼:
  • 木(${res.elements['목'].count}개·${res.elements['목'].vitalityLevel}) / 火(${res.elements['화'].count}개·${res.elements['화'].vitalityLevel}) / 土(${res.elements['토'].count}개·${res.elements['토'].vitalityLevel}) / 金(${res.elements['금'].count}개·${res.elements['금'].vitalityLevel}) / 水(${res.elements['수'].count}개·${res.elements['수'].vitalityLevel})
- 상생 순환 원활도: **${res.loopAnalysis.circulationScore}점** (${res.loopAnalysis.isLoopComplete ? '5행 완전 순환형' : '특정 오행 집중형'})
  • 활성 상생 고리: ${res.loopAnalysis.flowingPairs.join(' ➔ ')}
  • 순환 조율 지점: ${res.loopAnalysis.stagnantPair}
- 1순위 에너지 공명 증폭기: **${res.amplifier.primeElement}기운 증폭**
  • 공명 컬러: ${res.amplifier.amplifierColor}
  • 생기 푸드: ${res.amplifier.amplifierFood}
  • 1분 점화 행동: ${res.amplifier.amplifierActivity}
  • 발현 아우라: ${res.amplifier.resonanceAura}
- 종합 생기 공명 점수: **${res.overallResonanceScore}점** [${res.resonanceGrade}]
※ 루시 지침: 오행은 단순한 운세 풀이가 아니라 내 몸과 지성을 움직이는 5대 생체 원소입니다. 에너지가 한곳에 고이지 않고 부드럽게 상생하며 흐를 때 최상의 컨디션과 문제 해결력이 터져 나옵니다. 사용자가 오늘 부족한 기운을 가벼운 컬러나 생활 습관으로 가볍게 채워 넣을 수 있도록 감각적인 팁으로 제안해 주세요.`;
}
