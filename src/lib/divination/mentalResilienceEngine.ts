/**
 * =========================================================================
 * LUCKEY 위기 돌파 & 멘탈 리질리언스 지수 엔진 (Mental Resilience Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주의 강력한 카리스마 흉살(괴강·백호·양인·현침)이 위기 상황에서 발휘하는
 * 초인적 돌파력, 주역(周易) 4대 난괘(수뢰둔·감위수·산수몽·택수곤)의 위기 탈출 지혜,
 * 점성술의 화성·명왕성 회복 에너지를 융합하여 멘탈 회복탄력성 지수(0~100)와
 * 3단계 멘탈 쉴드 프로토콜을 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const MENTAL_RESILIENCE_VERSION = 'LUCKEY-RESIL-v1.0.0';

export interface CrisisSuperpower {
  name: string;
  hanja: string;
  source: string;
  breakthroughGift: string;      // 위기 상황에서 발현되는 비범한 돌파 무기
  actionTrigger: string;        // 압박이 극에 달했을 때 취해야 할 최적 행동
}

export interface DifficultHexagramGuidance {
  hexagramName: string;
  hanja: string;
  crisisTheme: string;          // 현재 위기나 난관의 본질
  escapeRoute: string;          // 괘상이 제시하는 유일무이한 탈출 해법
}

export interface MentalShieldProtocol {
  step1Detachment: string;      // 1단계: 감정 전압 차단 (인지적 거리두기)
  step2Realignment: string;     // 2단계: 핵심 자원 재정렬 (1원칙 복귀)
  step3PinpointStrike: string;  // 3단계: 핀포인트 집중 돌파 (단 하나의 승부수)
}

export interface MentalResilienceResult {
  engineVersion: string;
  calculatedAtIso: string;

  // 멘탈 회복탄력성 지수 (0~100)
  resilienceScore: number;
  pressureResistanceLevel: 'ironclad' | 'resilient' | 'sensitive' | 'overloaded';
  pressureResistanceTitle: string;

  // 위기 돌파 슈퍼파워 (보유 신살 기반)
  crisisSuperpowers: CrisisSuperpower[];
  primaryBreakthroughPower: CrisisSuperpower;

  // 주역 난괘 탈출 알고리즘
  hexagramWisdom: DifficultHexagramGuidance;

  // 3단계 멘탈 쉴드 프로토콜
  mentalShield: MentalShieldProtocol;

  summary: string;
}

// 주역 4대 난괘 탈출 지혜
const DIFFICULT_HEXAGRAMS: DifficultHexagramGuidance[] = [
  {
    hexagramName: '수뢰둔 (水雷屯)',
    hanja: '屯',
    crisisTheme: '새로운 씨앗이 단단한 얼어붙은 땅을 뚫고 나오느라 겪는 초기 창업과 성장의 진통',
    escapeRoute: '섣불리 결과를 재촉하지 말고, 돕는 귀인과 동료(후원자)를 세우며 내실의 뿌리를 단단히 내릴 것'
  },
  {
    hexagramName: '감위수 (坎爲水)',
    hanja: '坎',
    crisisTheme: '깊은 험지 뒤에 또 다른 험지가 겹쳐 나타나며 가슴을 짓누르는 사면초가의 중첩된 난관',
    escapeRoute: '물처럼 낮은 곳으로 흐르며 마음의 진실함(有孚)을 잃지 말고, 침착하게 한 걸음씩 물길을 열어갈 것'
  },
  {
    hexagramName: '산수몽 (山水蒙)',
    hanja: '蒙',
    crisisTheme: '안개 속에서 방향을 잃고 무엇을 먼저 해야 할지 모르는 지적·전략적 혼란기',
    escapeRoute: '자신의 무지를 솔직히 인정하고, 경험 많은 스승이나 표준 매뉴얼에 질문을 던져 정밀한 해답을 구할 것'
  },
  {
    hexagramName: '택수곤 (澤水困)',
    hanja: '困',
    crisisTheme: '연못에 물이 말라붙듯 자금이나 심리적 에너지가 바닥나 한계 상황에 봉착한 시기',
    escapeRoute: '변명이나 말로써 상황을 모면하려 하지 말고(有言不信), 침묵 속에서 체력을 보존하며 판이 바뀔 때까지 버텨낼 것'
  }
];

/**
 * 멘탈 리질리언스 연산 메인 함수
 */
export function calculateMentalResilience(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): MentalResilienceResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const pillars = [saju.pillars.year, saju.pillars.month, saju.pillars.day];
  if (saju.pillars.hour) pillars.push(saju.pillars.hour);

  const zhis = pillars.map(p => p.zhi);
  const gans = pillars.map(p => p.gan);
  const structures = saju.specialStructures.map(s => s.name);

  // 1. 보유 위기 돌파 슈퍼파워 판정
  const crisisSuperpowers: CrisisSuperpower[] = [];

  // 괴강살
  const hasGwoegang = structures.some(s => s.includes('괴강'));
  if (hasGwoegang || (saju.pillars.day.gan === '庚' && saju.pillars.day.zhi === '戌')) {
    crisisSuperpowers.push({
      name: '괴강의 강철 지휘력',
      hanja: '魁罡破竹',
      source: '경술/경진/무술/무진 괴강살',
      breakthroughGift: '남들이 공포에 질려 도망칠 때, 서늘한 이성으로 시스템을 장악하고 판을 뒤집는 압도적 통솔력',
      actionTrigger: '주변의 소음에 흔들리지 않고 가장 논리적인 핵심 아키텍처 하나만 남겨 정면 돌파하기'
    });
  }

  // 백호살
  const hasBaekho = structures.some(s => s.includes('백호'));
  if (hasBaekho) {
    crisisSuperpowers.push({
      name: '백호의 폭발적 결단력',
      hanja: '白虎爆發',
      source: '백호대살(白虎大殺)',
      breakthroughGift: '한계에 몰렸을 때 10배의 아드레날린과 집중력을 뿜어내어 장애물을 가루로 부수는 야수적 추진력',
      actionTrigger: '누적된 분노나 억울함을 감정 싸움에 쓰지 말고, 결과물 런칭의 폭발적 에너지로 전량 승화하기'
    });
  }

  // 양인살
  const hasYangin = structures.some(s => s.includes('양인'));
  if (hasYangin) {
    crisisSuperpowers.push({
      name: '양인의 칼날 집행력',
      hanja: '羊刃斷行',
      source: '양인살(羊刃殺)',
      breakthroughGift: '군더더기와 미련을 외과의사의 메스처럼 가차 없이 도려내고 핵심 가치만을 쟁취하는 결단',
      actionTrigger: '불필요한 인간관계나 비효율적인 레거시 코드를 단칼에 정리하고 정예화하기'
    });
  }

  // 기본 금(金)·수(水) 기운 기반 리질리언스 폴백
  if (crisisSuperpowers.length === 0) {
    crisisSuperpowers.push({
      name: '금수의 정밀 복원력',
      hanja: '金水中和',
      source: '일간 본원 및 오행 탄력성',
      breakthroughGift: '어떤 압박 속에서도 물처럼 유연하게 형태를 바꾸며 본질을 지켜내는 회복력',
      actionTrigger: '호흡을 가다듬고 가장 작은 단위의 루틴부터 하나씩 정상화하기'
    });
  }

  const primaryBreakthroughPower = crisisSuperpowers[0];

  // 2. 주역 4대 난괘 매핑 (일진 및 일간 기준)
  const hexIndex = (now.getDate() + (gans.includes('庚') ? 1 : 0)) % 4;
  const hexagramWisdom = DIFFICULT_HEXAGRAMS[hexIndex] || DIFFICULT_HEXAGRAMS[0];

  // 3. 멘탈 회복탄력성 스코어 (0~100)
  let resilienceScore = 75;
  if (hasGwoegang) resilienceScore += 12;
  if (hasBaekho) resilienceScore += 8;
  if (hasYangin) resilienceScore += 5;
  resilienceScore = Math.min(99, resilienceScore);

  let pressureResistanceLevel: MentalResilienceResult['pressureResistanceLevel'] = 'resilient';
  let pressureResistanceTitle = '고탄성 회복력 (Resilient Armor)';

  if (resilienceScore >= 90) {
    pressureResistanceLevel = 'ironclad';
    pressureResistanceTitle = '철벽의 위기 돌파력 (Ironclad Breakthrough)';
  } else if (resilienceScore >= 75) {
    pressureResistanceLevel = 'resilient';
    pressureResistanceTitle = '고탄성 유연 회복력 (Resilient Armor)';
  } else {
    pressureResistanceLevel = 'sensitive';
    pressureResistanceTitle = '섬세한 감각 회복기 (Sensitive Balancing)';
  }

  // 4. 3단계 멘탈 쉴드 프로토콜
  const mentalShield: MentalShieldProtocol = {
    step1Detachment: '【1단계: 감정 전압 분리】 "지금 일어난 사건은 나라는 존재 전체가 아니라, 시스템의 일시적 버그일 뿐이다"라고 정의하며 호흡 3번으로 외부 자극 차단',
    step2Realignment: `【2단계: 1원칙 코어 복귀】 ${hexagramWisdom.escapeRoute}`,
    step3PinpointStrike: `【3단계: 핀포인트 돌파】 ${primaryBreakthroughPower.breakthroughGift}을(를) 가동하여 ${primaryBreakthroughPower.actionTrigger}`
  };

  const summary = `[멘탈 리질리언스] 지수: ${resilienceScore}점 [${pressureResistanceTitle}]. ` +
    `돌파 무기: ${primaryBreakthroughPower.name}(${primaryBreakthroughPower.hanja}). ` +
    `주역 난괘 탈출: ${hexagramWisdom.hexagramName} [${hexagramWisdom.escapeRoute.slice(0, 30)}...].`;

  return {
    engineVersion: MENTAL_RESILIENCE_VERSION,
    calculatedAtIso: now.toISOString(),
    resilienceScore,
    pressureResistanceLevel,
    pressureResistanceTitle,
    crisisSuperpowers,
    primaryBreakthroughPower,
    hexagramWisdom,
    mentalShield,
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatMentalResiliencePrompt(res: MentalResilienceResult): string {
  return `[위기 돌파 & 멘탈 리질리언스 지수 리포트 (엔진: ${res.engineVersion})]
- 멘탈 회복탄력성 지수: **${res.resilienceScore}점** [${res.pressureResistanceTitle}]
- 위기 돌파 슈퍼파워: **${res.primaryBreakthroughPower.name} (${res.primaryBreakthroughPower.hanja})**
  • 원천: ${res.primaryBreakthroughPower.source}
  • 돌파 잠재력: ${res.primaryBreakthroughPower.breakthroughGift}
  • 액션 트리거: ${res.primaryBreakthroughPower.actionTrigger}
- 주역 난괘(難卦) 탈출 지혜: **${res.hexagramWisdom.hexagramName}**
  • 난관의 본질: ${res.hexagramWisdom.crisisTheme}
  • 탈출 해법: ${res.hexagramWisdom.escapeRoute}
- 3단계 멘탈 쉴드 프로토콜:
  • ${res.mentalShield.step1Detachment}
  • ${res.mentalShield.step2Realignment}
  • ${res.mentalShield.step3PinpointStrike}
※ 루시 지침: 괴강·백호·양인 같은 고전의 흉살은 극한의 압박이 닥쳤을 때 비범한 성과를 내는 '초인적 돌파 무기'입니다. 사용자가 스트레스나 막힘을 느낄 때 위축되지 않도록, 내면에 잠든 강철 같은 돌파력과 주역의 지혜로운 탈출 해법을 든든하고 단단하게 전해 주세요.`;
}
