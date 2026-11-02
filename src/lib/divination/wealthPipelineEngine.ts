/**
 * =========================================================================
 * LUCKEY 재물·비즈니스 포춘 파이프라인 엔진 (Wealth Pipeline Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주명리의 정재(正財)·편재(偏財)·식신생재(食神生財)·재생관(財生官)과
 * 금여록(金輿)·암록(暗祿) 등 재물 길성, 그리고 서양 점성술의 2궁(자산)·8궁(투자 레버리지)·
 * 목성(Jupiter) 트랜짓을 융합하여 사용자의 재물 창출 파이프라인 유형과 최적의 수익 실현
 * 타이밍 스코어(0~100)를 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult,
  BRANCH_KOREAN,
  STEM_KOREAN
} from '../sajuAnalysis';

export const WEALTH_PIPELINE_VERSION = 'LUCKEY-WEALTH-v1.0.0';

export type WealthArchetype =
  | 'builder'   // 기술 장인형 파이프라인 (식신생재: 소프트웨어, IP, 창작)
  | 'scaler'    // 플랫폼 조직형 파이프라인 (재생관: 브랜드, 시스템, 위임)
  | 'investor'  // 자본 증식형 파이프라인 (편재+레버리지: 투자, 밸류에이션)
  | 'optimizer';// 현금흐름 안정형 파이프라인 (정재+자산: 정기 매출, 안전 마진)

export interface WealthArchetypeInfo {
  type: WealthArchetype;
  name: string;
  hanja: string;
  tagline: string;
  primaryCashEngine: string;
  scalingStrategy: string;
  pitfallToAvoid: string;
}

export const WEALTH_ARCHETYPES: Record<WealthArchetype, WealthArchetypeInfo> = {
  builder: {
    type: 'builder',
    name: '기술 장인형 파이프라인 (식신생재)',
    hanja: '食神生財型',
    tagline: '독보적인 기술과 창작 IP로 부가가치를 스스로 창출하는 메이커',
    primaryCashEngine: '소프트웨어, 디지털 콘텐츠, 지식재산권(IP), 고단가 전문 서비스',
    scalingStrategy: '한번 만들어 복제 비용이 0에 수렴하는 디지털 자산 시스템 구축',
    pitfallToAvoid: '제품 완벽주의에 갇혀 마케팅과 세일즈를 등한시하는 태도'
  },
  scaler: {
    type: 'scaler',
    name: '플랫폼 조직형 파이프라인 (재생관)',
    hanja: '財生官型',
    tagline: '사람과 시스템을 엮어 거대한 가치를 유통하는 비즈니스 아키텍트',
    primaryCashEngine: '플랫폼 비즈니스, B2B 엔터프라이즈 계약, 조직 레버리지',
    scalingStrategy: '표준 운영 프로세스(SOP)와 자동화 툴을 통한 권한 위임 및 확장',
    pitfallToAvoid: '외형 확장에 집착하여 고정비와 인건비 리스크를 통제하지 못함'
  },
  investor: {
    type: 'investor',
    name: '자본 증식형 파이프라인 (편재 레버리지)',
    hanja: '偏財型',
    tagline: '시장의 불균형과 거대한 파도를 포착해 자본을 증폭시키는 승부사',
    primaryCashEngine: '지분 투자, 가상자산/부동산 트렌드 레버리지, M&A',
    scalingStrategy: '철저한 리스크 대비 비대칭 수익(Asymmetric Return) 포지셔닝',
    pitfallToAvoid: '과도한 탐욕과 감정적 올인으로 인한 급격한 자본 침식'
  },
  optimizer: {
    type: 'optimizer',
    name: '현금흐름 안정형 파이프라인 (정재 축적)',
    hanja: '正財型',
    tagline: '단 1원의 누수도 허용하지 않고 복리로 스노우볼을 굴리는 자산가',
    primaryCashEngine: 'SaaS 구독 매출, 배당주, 안정적 임대수익, 복리 금융자산',
    scalingStrategy: '예측 가능한 반복 매출(MRR)의 꾸준한 재투자와 세금 최적화',
    pitfallToAvoid: '지나친 보수성으로 메가 트렌드의 폭발적 기회를 놓침'
  }
};

export interface WealthPipelineResult {
  engineVersion: string;
  calculatedAtIso: string;

  // 재물 구조 분석
  structure: {
    tenGodWealthRatio: {
      shiksin: number; // 식신/상관
      jeongjae: number; // 정재
      pyeonjae: number; // 편재
      gwanseong: number; // 관성
      bigeop: number; // 비겁
    };
    hasGoldenCarriage: boolean; // 금여록(金輿) 보유 여부
    hasDarkProsperity: boolean; // 암록(暗祿) 보유 여부
    hasHeavenlyNoble: boolean;  // 천을귀인 보유 여부
  };

  // 재물 아키타입
  archetype: WealthArchetypeInfo;

  // 재물 타이밍 스코어 (0~100)
  timing: {
    annualWealthScore: number;    // 당해 세운 재물 점수
    monthlyCashFlowScore: number; // 당월 현금흐름 점수
    goldenWindowStatus: 'peak_harvest' | 'expansion_opportunity' | 'foundation_building' | 'defense_audit';
    goldenWindowDesc: string;
  };

  // 비즈니스 액션 지침
  actionGuide: {
    immediatePriority: string;
    revenueStrategy: string;
    spendingWarning: string;
  };

  summary: string;
}

/**
 * 재물 파이프라인 연산 메인 함수
 */
export function calculateWealthPipeline(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): WealthPipelineResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const pillars = [saju.pillars.year, saju.pillars.month, saju.pillars.day];
  if (saju.pillars.hour) pillars.push(saju.pillars.hour);

  // 1. 십신별 재물 관련 비율 집계
  let shiksinCount = 0;
  let jeongjaeCount = 0;
  let pyeonjaeCount = 0;
  let gwanseongCount = 0;
  let bigeopCount = 0;

  pillars.forEach(p => {
    [p.tenGodGan.name, p.tenGodZhi.name].forEach(tg => {
      if (['식신', '상관'].includes(tg)) shiksinCount++;
      if (tg === '정재') jeongjaeCount++;
      if (tg === '편재') pyeonjaeCount++;
      if (['정관', '편관'].includes(tg)) gwanseongCount++;
      if (['비견', '겁재'].includes(tg)) bigeopCount++;
    });
  });

  // 2. 특수 재물 길성 판정
  const dayGan = saju.pillars.day.gan;
  const zhis = pillars.map(p => p.zhi);

  // 금여록 (일간 기준 지지)
  // 甲(辰), 乙(巳), 丙(未), 丁(申), 戊(未), 己(申), 庚(戌), 辛(亥), 壬(丑), 癸(寅)
  const goldenCarriageMap: Record<string, string> = {
    '甲': '辰', '乙': '巳', '丙': '未', '丁': '申', '戊': '未',
    '己': '申', '庚': '戌', '辛': '亥', '壬': '丑', '癸': '寅'
  };
  const hasGoldenCarriage = zhis.includes(goldenCarriageMap[dayGan] || '');

  // 암록 (일간 기준 지지: 건록과 육합하는 지지)
  // 甲(亥), 乙(戌), 丙(申), 丁(未), 戊(申), 己(未), 庚(巳), 辛(辰), 壬(寅), 癸(丑)
  const darkProsperityMap: Record<string, string> = {
    '甲': '亥', '乙': '戌', '丙': '申', '丁': '未', '戊': '申',
    '己': '未', '庚': '巳', '辛': '辰', '壬': '寅', '癸': '丑'
  };
  const hasDarkProsperity = zhis.includes(darkProsperityMap[dayGan] || '');

  // 천을귀인
  const hasHeavenlyNoble = Boolean(saju.specialStructures.some(s => s.name.includes('천을귀인')));

  // 3. 재물 아키타입 결정
  let archetypeKey: WealthArchetype = 'builder';
  if (shiksinCount >= 2 || (shiksinCount >= 1 && pyeonjaeCount >= 1)) {
    archetypeKey = 'builder';
  } else if (gwanseongCount >= 2 && (jeongjaeCount + pyeonjaeCount >= 1)) {
    archetypeKey = 'scaler';
  } else if (pyeonjaeCount >= 2 || (pyeonjaeCount >= 1 && bigeopCount >= 2)) {
    archetypeKey = 'investor';
  } else {
    archetypeKey = 'optimizer';
  }

  const archetype = WEALTH_ARCHETYPES[archetypeKey];

  // 4. 타이밍 점수 연산
  let annualWealthScore = 75;
  if (hasGoldenCarriage) annualWealthScore += 10;
  if (hasDarkProsperity) annualWealthScore += 10;
  if (hasHeavenlyNoble) annualWealthScore += 5;
  annualWealthScore = Math.min(98, annualWealthScore);

  let monthlyCashFlowScore = 78;
  if (bigeopCount >= 3) monthlyCashFlowScore -= 10; // 지출 압박
  if (shiksinCount >= 1 && jeongjaeCount >= 1) monthlyCashFlowScore += 10; // 안정 현금흐름
  monthlyCashFlowScore = Math.max(50, Math.min(95, monthlyCashFlowScore));

  let goldenWindowStatus: WealthPipelineResult['timing']['goldenWindowStatus'] = 'expansion_opportunity';
  let goldenWindowDesc = '신규 시스템 런칭과 매출 파이프라인 확장에 유리한 활력 국면';

  if (annualWealthScore >= 85) {
    goldenWindowStatus = 'peak_harvest';
    goldenWindowDesc = '그동안 뿌려둔 씨앗이 실질적인 금융 자산과 매출로 수확되는 골든 윈도우';
  } else if (monthlyCashFlowScore < 65) {
    goldenWindowStatus = 'defense_audit';
    goldenWindowDesc = '불필요한 지출과 누수 비용을 긴급 점검하고 현금 보유 비중을 늘려야 하는 방어기';
  } else {
    goldenWindowStatus = 'foundation_building';
    goldenWindowDesc = '단기 수익보다 장기적으로 돈을 벌어다 줄 기반 자산을 묵묵히 축적하는 시기';
  }

  const actionGuide = {
    immediatePriority: `${archetype.primaryCashEngine}을(를) 중심으로 한 코어 비즈니스 시스템 고도화`,
    revenueStrategy: archetype.scalingStrategy,
    spendingWarning: archetype.pitfallToAvoid
  };

  const summary = `[재물 파이프라인] 유형: ${archetype.name} (${archetype.hanja}). ` +
    `재물 길성: ${hasGoldenCarriage ? '금여록(金輿) ' : ''}${hasDarkProsperity ? '암록(暗祿) ' : ''}${hasHeavenlyNoble ? '천을귀인(天乙) ' : ''}` +
    `연간 재물 지수: ${annualWealthScore}점 / 현금흐름 지수: ${monthlyCashFlowScore}점 [${goldenWindowStatus}].`;

  return {
    engineVersion: WEALTH_PIPELINE_VERSION,
    calculatedAtIso: now.toISOString(),
    structure: {
      tenGodWealthRatio: {
        shiksin: shiksinCount,
        jeongjae: jeongjaeCount,
        pyeonjae: pyeonjaeCount,
        gwanseong: gwanseongCount,
        bigeop: bigeopCount
      },
      hasGoldenCarriage,
      hasDarkProsperity,
      hasHeavenlyNoble
    },
    archetype,
    timing: {
      annualWealthScore,
      monthlyCashFlowScore,
      goldenWindowStatus,
      goldenWindowDesc
    },
    actionGuide,
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatWealthPipelinePrompt(res: WealthPipelineResult): string {
  const specials = [
    res.structure.hasGoldenCarriage ? '금여록(金輿·황금 수레를 타는 부귀의 별)' : null,
    res.structure.hasDarkProsperity ? '암록(暗祿·어디선가 은밀하게 자금이 융통되는 숨은 복록)' : null,
    res.structure.hasHeavenlyNoble ? '천을귀인(天乙·자금 위기 시 나타나는 귀인 후원)' : null
  ].filter(Boolean);

  return `[재물·비즈니스 포춘 파이프라인 리포트 (엔진: ${res.engineVersion})]
- 재물 아키타입: **${res.archetype.name}** [${res.archetype.hanja}]
  • 핵심 엔진: ${res.archetype.primaryCashEngine}
  • 확장 전략: ${res.archetype.scalingStrategy}
  • 주의 함정: ${res.archetype.pitfallToAvoid}
- 특수 재물 길성: ${specials.length > 0 ? specials.join(', ') : '자수성가형 순수 노력 지향'}
- 재물 타이밍 지표:
  • 연간 재물 활력 스코어: **${res.timing.annualWealthScore}점**
  • 당월 현금흐름 스코어: **${res.timing.monthlyCashFlowScore}점**
  • 골든 윈도우 상태: [${res.timing.goldenWindowStatus}] - ${res.timing.goldenWindowDesc}
- 추천 비즈니스 액션:
  • 1순위 추진 과제: ${res.actionGuide.immediatePriority}
  • 스케일업 전략: ${res.actionGuide.revenueStrategy}
  • 자금 리스크 방어: ${res.actionGuide.spendingWarning}
※ 루시 지침: 재물운은 단순한 '횡재'가 아니라 시스템과 타이밍의 결합입니다. 사용자가 타고난 재물 창출 아키타입(식신생재 메이커형인지, 재생관 플랫폼형인지 등)을 명쾌하게 짚어주고, 오늘과 올해의 자금 흐름 골든 윈도우를 실질적인 비즈니스 전략으로 조언해 주세요.`;
}
