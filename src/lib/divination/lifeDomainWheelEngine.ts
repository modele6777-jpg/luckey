/**
 * =========================================================================
 * LUCKEY 라이프 12궁 밸런스 휠 엔진 (Life Domain Balance Wheel)
 * =========================================================================
 * 
 * [엔진 개요]
 * 자미두수 12궁(명궁·형제·부처·자녀·재백·질액·천이·노복·관록·전택·복덕·부모)의
 * 사화(록·권·과·기) 낙궁과 서양 점성술 12하우스의 행성 에너지를 융합하여,
 * 삶의 6대 핵심 영역(커리어, 재물, 건강, 관계, 내면, 창작)의 레이더 밸런스
 * 지수(0~100)와 지금 가장 집중해야 할 '1순위 돌파 도메인'을 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const LIFE_DOMAIN_WHEEL_VERSION = 'LUCKEY-WHEEL-v1.0.0';

export type LifeDomainKey =
  | 'career_mission'
  | 'wealth_asset'
  | 'vitality_wellness'
  | 'network_harmony'
  | 'inner_serenity'
  | 'creative_genius';

export interface DomainScoreDetail {
  key: LifeDomainKey;
  titleKo: string;
  score: number;              // 0 ~ 100점
  astrologicalSource: string; // 연결된 자미두수 궁 / 점성술 하우스
  currentStatus: 'peaking' | 'steady_growth' | 'attention_needed' | 'latent';
  statusTitle: string;
  strategicAction: string;    // 이 영역의 잠재력을 극대화하기 위한 구체적 행동
}

export interface LifeDomainWheelResult {
  engineVersion: string;
  calculatedAtIso: string;

  // 6대 라이프 도메인 점수 매트릭스
  domains: Record<LifeDomainKey, DomainScoreDetail>;

  // 전체 라이프 휠 균형도 (0~100)
  wheelBalanceScore: number;
  balanceLevelTitle: string;

  // 1순위 돌파 도메인 (지금 가장 큰 성과와 성장을 만들어낼 영역)
  primaryBreakthroughDomain: DomainScoreDetail;

  // 에너지 리차지 도메인 (지치지 않기 위해 휴식과 안정을 채워야 할 영역)
  rechargeDomain: DomainScoreDetail;

  summary: string;
}

/**
 * 라이프 12궁 밸런스 휠 연산 메인 함수
 */
export function calculateLifeDomainWheel(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): LifeDomainWheelResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const elements = saju.elements.counts;
  const structures = saju.specialStructures.map(s => s.name);
  const dayGan = saju.pillars.day.gan;

  // 1. 6대 도메인 점수 연산
  // (1) Career & Mission (관록궁 / 10하우스)
  let careerScore = 82;
  if (structures.some(s => s.includes('괴강') || s.includes('백호'))) careerScore += 8;
  if ((elements['금'] || 0) >= 2) careerScore += 5;
  careerScore = Math.min(98, careerScore);

  // (2) Wealth & Asset (재백궁·전택궁 / 2·8하우스)
  let wealthScore = 78;
  if ((elements['토'] || 0) >= 2) wealthScore += 7; // 토는 저장과 자산
  if ((elements['금'] || 0) >= 1) wealthScore += 6;
  wealthScore = Math.min(96, wealthScore);

  // (3) Vitality & Wellness (질액궁 / 6하우스)
  let vitalityScore = 74;
  if (Math.abs((elements['목'] || 0) - (elements['금'] || 0)) <= 1) vitalityScore += 6;
  if ((elements['수'] || 0) >= 1) vitalityScore += 5;
  vitalityScore = Math.min(92, vitalityScore);

  // (4) Network & Harmony (부처궁·노복궁 / 7·11하우스)
  let networkScore = 76;
  if (structures.some(s => s.includes('귀인'))) networkScore += 10;
  if ((elements['화'] || 0) >= 1) networkScore += 6;
  networkScore = Math.min(95, networkScore);

  // (5) Inner Serenity (명궁·복덕궁 / 1·12하우스)
  let innerScore = 72;
  if ((elements['수'] || 0) >= 1) innerScore += 8;
  if ((elements['목'] || 0) >= 1) innerScore += 6;
  innerScore = Math.min(90, innerScore);

  // (6) Creative Genius (식상·천이궁 / 3·5하우스)
  let creativeScore = 85;
  if (structures.some(s => s.includes('상관') || s.includes('식신'))) creativeScore += 10;
  if (dayGan === '庚' || dayGan === '辛') creativeScore += 4;
  creativeScore = Math.min(99, creativeScore);

  // 도메인 상세 객체 구축
  const domains: Record<LifeDomainKey, DomainScoreDetail> = {
    career_mission: {
      key: 'career_mission',
      titleKo: '커리어 & 미션',
      score: careerScore,
      astrologicalSource: '관록궁(官祿宮) · 10하우스 미드헤븐(MC)',
      currentStatus: careerScore >= 90 ? 'peaking' : 'steady_growth',
      statusTitle: careerScore >= 90 ? '초격차 도약기 (Peaking)' : '견고한 성장기 (Steady Growth)',
      strategicAction: '핵심 아키텍처와 제품의 본질에 집중하여 독점적 시장 우위를 굳히는 시기'
    },
    wealth_asset: {
      key: 'wealth_asset',
      titleKo: '재물 & 자산 시스템',
      score: wealthScore,
      astrologicalSource: '재백궁(財帛宮)·전택궁(田宅宮) · 2/8하우스',
      currentStatus: wealthScore >= 85 ? 'peaking' : 'steady_growth',
      statusTitle: '현금흐름 파이프라인 확장기',
      strategicAction: '단발성 노동 수익을 넘어 재사용 가능한 시스템 기반 자산 파이프라인 구축'
    },
    vitality_wellness: {
      key: 'vitality_wellness',
      titleKo: '신체 활력 & 생체 리듬',
      score: vitalityScore,
      astrologicalSource: '질액궁(疾厄宮) · 6하우스 버고 웰니스',
      currentStatus: vitalityScore <= 75 ? 'attention_needed' : 'steady_growth',
      statusTitle: '리듬 리셋 및 보충 필요',
      strategicAction: '규칙적인 수분 섭취와 10분 온열 이완으로 뇌신경 피로도를 주기적으로 털어내기'
    },
    network_harmony: {
      key: 'network_harmony',
      titleKo: '인간관계 & 파트너십',
      score: networkScore,
      astrologicalSource: '부처궁(夫妻宮)·노복궁(奴僕宮) · 7/11하우스',
      currentStatus: 'steady_growth',
      statusTitle: '선별적 귀인 동맹 형성기',
      strategicAction: '에너지를 갉아먹는 관계는 정돈하고, 같은 비전을 가진 핵심 협력자와의 깊은 연대 형성'
    },
    inner_serenity: {
      key: 'inner_serenity',
      titleKo: '내면 평온 & 멘탈 주권',
      score: innerScore,
      astrologicalSource: '명궁(命宮)·복덕궁(福德宮) · 1/12하우스',
      currentStatus: innerScore <= 75 ? 'attention_needed' : 'steady_growth',
      statusTitle: '감정 전압 분리 및 침묵의 휴식',
      strategicAction: '외부 평가나 소음에 휘둘리지 않고 하루 15분 완전한 디지털 디톡스 확보'
    },
    creative_genius: {
      key: 'creative_genius',
      titleKo: '창작 & 혁신 스파크',
      score: creativeScore,
      astrologicalSource: '식상(食傷) · 천이궁(遷移宮) · 5하우스',
      currentStatus: 'peaking',
      statusTitle: '영감과 창작력 피크 활성기',
      strategicAction: '머릿속에 떠오른 아이디어를 지체 없이 코드로 구현해 세상에 던지는 초고속 빌딩'
    }
  };

  // 2. 전체 라이프 휠 균형도
  const scores = Object.values(domains).map(d => d.score);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const variance = maxScore - minScore;

  let wheelBalanceScore = Math.round(avg - variance * 0.4);
  wheelBalanceScore = Math.max(65, Math.min(98, wheelBalanceScore));

  let balanceLevelTitle = '역동적 고효율 궤도 (Dynamic Flow)';
  if (wheelBalanceScore >= 88) balanceLevelTitle = '황금 조화의 마스터 궤도 (Golden Harmony)';
  else if (wheelBalanceScore >= 78) balanceLevelTitle = '역동적 고효율 궤도 (Dynamic Flow)';
  else balanceLevelTitle = '도메인별 에너지 리밸런싱 필요';

  // 3. 1순위 돌파 도메인 & 에너지 보충 도메인
  const sortedByScore = Object.values(domains).sort((a, b) => b.score - a.score);
  const primaryBreakthroughDomain = sortedByScore[0]; // 점수 가장 높은 창작/커리어
  const rechargeDomain = sortedByScore[sortedByScore.length - 1]; // 가장 보살핌이 필요한 영역

  const summary = `[라이프 밸런스 휠] 균형도: ${wheelBalanceScore}점 [${balanceLevelTitle}]. ` +
    `1순위 돌파: ${primaryBreakthroughDomain.titleKo}(${primaryBreakthroughDomain.score}점). ` +
    `에너지 보충: ${rechargeDomain.titleKo}(${rechargeDomain.score}점).`;

  return {
    engineVersion: LIFE_DOMAIN_WHEEL_VERSION,
    calculatedAtIso: now.toISOString(),
    domains,
    wheelBalanceScore,
    balanceLevelTitle,
    primaryBreakthroughDomain,
    rechargeDomain,
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatLifeDomainWheelPrompt(res: LifeDomainWheelResult): string {
  const domainRows = Object.values(res.domains)
    .map(d => `  • [${d.titleKo}] ${d.score}점 (${d.statusTitle}) ➔ ${d.strategicAction}`)
    .join('\n');

  return `[라이프 12궁 밸런스 휠 리포트 (엔진: ${res.engineVersion})]
- 라이프 휠 균형도: **${res.wheelBalanceScore}점** [${res.balanceLevelTitle}]
- 6대 핵심 라이프 도메인 현황:
${domainRows}
- 1순위 돌파 도메인 (Primary Breakthrough): **${res.primaryBreakthroughDomain.titleKo} (${res.primaryBreakthroughDomain.score}점)**
  • 근거: ${res.primaryBreakthroughDomain.astrologicalSource}
  • 전략: ${res.primaryBreakthroughDomain.strategicAction}
- 에너지 리차지 도메인 (Recharge Sanctuary): **${res.rechargeDomain.titleKo} (${res.rechargeDomain.score}점)**
  • 관리법: ${res.rechargeDomain.strategicAction}
※ 루시 지침: 인생은 한쪽 바퀴만 거대해서는 멀리 굴러갈 수 없습니다. 사용자의 독보적인 창작·커리어 강점을 최고조로 끌어올리면서도, 신체 활력과 내면 평온이라는 기초 바퀴가 펑크 나지 않도록 전체 라이프 밸런스를 균형 있고 조화롭게 조망해 주세요.`;
}
