/**
 * =========================================================================
 * LUCKEY 양자 동시성 & 세렌디피티 행운 가속 엔진 (Serendipity & Synchronicity Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 칼 융과 볼프강 파울리의 '동시성(Synchronicity)' 원리, 양자 얽힘(Quantum Entanglement),
 * 그리고 사주 명리학의 일진(日辰) 천간합(天干合)·지합(地合)·천을귀인 수리를 결합한 엔진입니다.
 * 우연처럼 보이는 필연적 행운(Serendipity)과 우주적 신호(Angel Numbers),
 * 뜻밖의 기회와 귀인을 끌어당기는 '세렌디피티 촉매 행동(Catalyst Action)'을 결정론적으로 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SERENDIPITY_SYNCHRONICITY_VERSION = 'LUCKEY-SERENDIPITY-v1.0.0';

export type LuckyPortalType = 
  | '비즈니스 돌파구 포털 (Business Quantum Leap)'
  | '뜻밖의 귀인 인연 포털 (Unexpected Noble Catalyst)'
  | '숨겨진 자본·수익 포털 (Hidden Wealth Conduit)'
  | '창의적 영감의 번개 포털 (Lightning Creative Epiphany)';

export interface SerendipitySynchronicityReport {
  engineVersion: string;
  calculatedAt: string;
  synchronicityScore: number;     // 우주적 동시성 지수 (0 ~ 100)
  serendipityVelocity: number;    // 행운 가속도 (0 ~ 100)
  activeLuckyPortal: LuckyPortalType;
  angelNumberSign: {
    numberCode: string;           // 예: "111", "333", "777", "888"
    spiritualMeaning: string;     // 우주가 보내는 핵심 동시성 메시지
  };
  catalystAction: {
    microShiftAction: string;     // 일상에서 미세한 궤도를 틀어 행운을 만나는 행동
    optimalHourWindow: string;    // 오늘 우연의 일치가 가장 활성화되는 시간대
    luckyVibeTrigger: string;     // 행운을 증폭시키는 감각적 트리거 (색상/음식/향)
  };
  synthesisPromptGuidance: string;
}

export function runSerendipitySynchronicityEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): SerendipitySynchronicityReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const syncSeed = (targetDate.getFullYear() * 11 + (targetDate.getMonth() + 1) * 19 + targetDate.getDate() * 7 + ganCode) % 100;

  const portalIndex = (ganCode + targetDate.getDate() + targetDate.getHours()) % 4;

  let activeLuckyPortal: LuckyPortalType;
  let microShiftAction: string;
  let optimalHourWindow: string;
  let luckyVibeTrigger: string;

  if (portalIndex === 0) {
    activeLuckyPortal = '비즈니스 돌파구 포털 (Business Quantum Leap)';
    microShiftAction = '평소 확인하지 않던 이메일 폴더나 과거 협력 제안서를 다시 열어보고 가볍게 팔로업 던지기';
    optimalHourWindow = '오전 10:30 ~ 12:00 (의사결정권자들과의 우주적 타이밍 일치)';
    luckyVibeTrigger = '선명한 네이비 블루 컬러 & 민트 계열의 상쾌한 향';
  } else if (portalIndex === 1) {
    activeLuckyPortal = '뜻밖의 귀인 인연 포털 (Unexpected Noble Catalyst)';
    microShiftAction = '항상 가던 카페 대신 한 블록 떨어진 새로운 장소에서 커피를 마시거나 평소 안 보던 채널 둘러보기';
    optimalHourWindow = '오후 14:00 ~ 16:30 (새로운 인연의 동선과 얽히는 시간)';
    luckyVibeTrigger = '따뜻한 로즈골드/오렌지 포인트 & 시트러스 향';
  } else if (portalIndex === 2) {
    activeLuckyPortal = '숨겨진 자본·수익 포털 (Hidden Wealth Conduit)';
    microShiftAction = '방치되어 있던 정산 계좌나 마일리지, 소액 투자 포트폴리오를 점검하고 자산 재배치 단행';
    optimalHourWindow = '오후 16:30 ~ 18:30 (시장 에너지의 수렴과 결실 타이밍)';
    luckyVibeTrigger = '딥 그린 / 에메랄드 컬러 & 편안한 우디 향';
  } else {
    activeLuckyPortal = '창의적 영감의 번개 포털 (Lightning Creative Epiphany)';
    microShiftAction = '스마트폰을 주머니에 넣고 15분간 목적지 없이 걸으며 뇌의 기본 모드 네트워크(DMN) 활성화';
    optimalHourWindow = '오후 20:00 ~ 22:30 (알파파와 세타파가 공명하는 직관의 심야)';
    luckyVibeTrigger = '신비로운 퍼플 / 실버 화이트 & 라벤더 향';
  }

  // 4대 엔젤 넘버 매핑
  const numberIndex = (syncSeed + targetDate.getDate()) % 4;
  let numberCode: string;
  let spiritualMeaning: string;

  if (numberIndex === 0) {
    numberCode = '111';
    spiritualMeaning = '당신의 생각과 의도가 빛의 속도로 물질화되고 있습니다. 오직 원하는 결과에만 집중하십시오.';
  } else if (numberIndex === 1) {
    numberCode = '333';
    spiritualMeaning = '당신을 돕는 마스터 귀인들과 우주적 에너지가 곁을 지키고 있습니다. 주저 말고 한 걸음 더 내딛으십시오.';
  } else if (numberIndex === 2) {
    numberCode = '777';
    spiritualMeaning = '완벽한 운명적 정렬입니다. 기적처럼 보이는 일련의 우연들이 당신의 길을 축복하고 있습니다.';
  } else {
    numberCode = '888';
    spiritualMeaning = '무한한 풍요와 인연의 결실이 쏟아져 들어옵니다. 그동안 베풀었던 선한 영향력이 거대한 보상으로 회귀합니다.';
  }

  const synchronicityScore = 77 + (syncSeed % 22); // 77 ~ 98점
  const serendipityVelocity = 75 + ((targetDate.getDate() * 9 + targetDate.getHours() * 3 + (ganCode % 7)) % 24); // 75 ~ 98점

  const synthesisPromptGuidance = `[LUCKEY 양자 동시성 & 세렌디피티 행운 가속 v1.0.0]
- 활성 행운 포털: [${activeLuckyPortal}]
- 우주적 동시성 지수: ${synchronicityScore}점 / 세렌디피티 가속도: ${serendipityVelocity}점
- 엔젤 넘버 사인: [${numberCode}] "${spiritualMeaning}"
- 세렌디피티 촉매 행동: ${microShiftAction}
- 최적 동시성 윈도우: ${optimalHourWindow}
- 행운 증폭 바이브: ${luckyVibeTrigger}`;

  return {
    engineVersion: SERENDIPITY_SYNCHRONICITY_VERSION,
    calculatedAt: targetDate.toISOString(),
    synchronicityScore,
    serendipityVelocity,
    activeLuckyPortal,
    angelNumberSign: {
      numberCode,
      spiritualMeaning
    },
    catalystAction: {
      microShiftAction,
      optimalHourWindow,
      luckyVibeTrigger
    },
    synthesisPromptGuidance
  };
}

export type SerendipitySynchronicityResult = SerendipitySynchronicityReport;

export function calculateSerendipitySynchronicity(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): SerendipitySynchronicityResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runSerendipitySynchronicityEngine(profile, targetDate);
}

export function formatSerendipitySynchronicityPrompt(res: SerendipitySynchronicityResult): string {
  return res.synthesisPromptGuidance;
}
