/**
 * =========================================================================
 * LUCKEY 12개월 월운(月運) & 사계절 분기 타이밍 엔진 (Monthly Flow Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 오호둔월법(五虎遁月法) 기반 당해 연도 12절기월 간지 완전 산출:
 *    - 2026 병오(丙午)년 기준 경인(庚寅)월부터 신축(辛丑)월까지 12개월 간지 확정
 * 2. 사용자 일간 대비 각 월별 십신·지지합충·12운성 정밀 수리 연산:
 *    - 일간-월간 십신(비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인)
 *    - 일간-월지 12운성(장생·목욕·관대·건록·제왕·쇠·병·사·묘·절·태·양) 에너지 레벨
 *    - 일지(배우자·몸)와의 육합, 삼합, 충(沖), 원진(怨嗔) 상호작용
 * 3. 사주 용신(用神)·희신(喜神) 대조를 통한 12개월 길흉 스코어링(0~100점):
 *    - 용신 기운이 들어오는 황금 도약월 vs 기신/충이 발생하는 내실 정비월
 * 4. 사계절 4대 분기(Q1~Q4) 거시 전략 프레임워크:
 *    - 봄(Q1: 맹아/착수), 여름(Q2: 확장/개화), 가을(Q3: 수확/계약), 겨울(Q4: 축적/정돈)
 * 5. 라이프 액션별 최적 골든 먼스(Golden Month) & 리스크 관리:
 *    - 이직/커리어 베스트 월, 계약/투자 베스트 월, 힐링/충전 베스트 월, 구설/마찰 주의 월
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  BRANCH_KOREAN,
  STEM_KOREAN,
  calculateTenGod,
  TWELVE_STAGES_MATRIX,
  type SajuAnalysisResult,
  type FiveElement,
} from '../sajuAnalysis';

export const MONTHLY_FLOW_ENGINE_VERSION = 'LUCKEY-MFE-v2.1.0';

function formatMonthlyFlowKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export interface MonthFlowItem {
  monthOrder: number; // 1~12 (음력 절기월 기준)
  solarMonthName: string; // "양력 2월경 (입춘~경칩)"
  solarApproxRange: string; // "02.04 ~ 03.04"
  ganZhi: string; // "경인(庚寅)"
  gan: string;
  zhi: string;
  ganKr: string;
  zhiKr: string;
  elementGan: FiveElement;
  elementZhi: FiveElement;

  // 일간 대비 역학 지표
  tenGodGan: string;
  tenGodZhi: string;
  twelveStage: string; // 12운성
  branchRelation: {
    type: '육합' | '삼합' | '충' | '원진' | '평이';
    name: string;
    description: string;
  };
  yongsinAffinity: '용신강화' | '희신조력' | '평이' | '기신주의';

  score: number; // 0 ~ 100
  grade: '대길(황금기)' | '소길(도약기)' | '평온(순항기)' | '조율(정비기)' | '신중(주의기)';
  themeTag: string; // 예: "🚀 과감한 커리어 확장", "💰 실속 있는 자산 계약"
  monthlyActionTip: string;
}

export interface QuarterStrategy {
  quarterName: string; // "Q1. 봄의 시작 (2~4월 · 인묘진월)"
  seasonTheme: string;
  primaryFocus: string;
  riskManagement: string;
  quarterScore: number;
}

export interface MonthlyFlowResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  targetYear: number;
  yearGanZhiKr: string;
  dayMasterText: string;

  // 12개월 타임라인
  monthlyTimeline: MonthFlowItem[];

  // 4대 분기 거시 전략
  quarterlyStrategies: QuarterStrategy[];

  // 주요 결단별 골든 먼스 추천
  decisionMilestones: {
    careerBestMonths: string[]; // 이직·승진 최적월
    wealthBestMonths: string[]; // 계약·투자 최적월
    healingBestMonths: string[]; // 휴식·재충전 최적월
    cautionMonths: string[]; // 감정 충돌·구설 주의월
  };

  yearOverallFlowSummary: string;
  monthlyFlowSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

// 오호둔월법 (연간에 따라 1월 인월의 천간 결정)
const FIRST_MONTH_STEM_MAP: Record<string, number> = {
  '甲': 2, '己': 2, // 丙寅 (인덱스 2)
  '乙': 4, '庚': 4, // 戊寅 (인덱스 4)
  '丙': 6, '辛': 6, // 庚寅 (인덱스 6)
  '丁': 8, '壬': 8, // 壬寅 (인덱스 8)
  '戊': 0, '癸': 0, // 甲寅 (인덱스 0)
};

const STEMS_LIST = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES_MONTH_ORDER = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

const MONTH_METAS = [
  { order: 1, solarName: '양력 2월경 (입춘~경칩)', range: '02.04 ~ 03.04' },
  { order: 2, solarName: '양력 3월경 (경칩~청명)', range: '03.05 ~ 04.04' },
  { order: 3, solarName: '양력 4월경 (청명~입하)', range: '04.05 ~ 05.04' },
  { order: 4, solarName: '양력 5월경 (입하~망종)', range: '05.05 ~ 06.04' },
  { order: 5, solarName: '양력 6월경 (망종~소서)', range: '06.05 ~ 07.06' },
  { order: 6, solarName: '양력 7월경 (소서~입추)', range: '07.07 ~ 08.06' },
  { order: 7, solarName: '양력 8월경 (입추~백로)', range: '08.07 ~ 09.06' },
  { order: 8, solarName: '양력 9월경 (백로~한로)', range: '09.07 ~ 10.07' },
  { order: 9, solarName: '양력 10월경 (한로~입동)', range: '10.08 ~ 11.06' },
  { order: 10, solarName: '양력 11월경 (입동~대설)', range: '11.07 ~ 12.06' },
  { order: 11, solarName: '양력 12월경 (대설~소한)', range: '12.07 ~ 01.04' },
  { order: 12, solarName: '양력 1월경 (소한~입춘)', range: '01.05 ~ 02.03' },
];

const STEM_ELEMENTS: Record<string, FiveElement> = {
  '甲': '목', '乙': '목', '丙': '화', '丁': '화', '戊': '토',
  '己': '토', '庚': '금', '辛': '금', '壬': '수', '癸': '수'
};

const BRANCH_ELEMENTS: Record<string, FiveElement> = {
  '寅': '목', '卯': '목', '辰': '토', '巳': '화', '午': '화', '未': '토',
  '申': '금', '酉': '금', '戌': '토', '亥': '수', '子': '수', '丑': '토'
};

// 지지 육합
const SIX_HARMONY: Record<string, string> = {
  '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午'
};
// 지지충
const BRANCH_CLASH: Record<string, string> = {
  '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
};
// 지지 원진
const WONJIN: Record<string, string> = {
  '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '酉', '酉': '寅',
  '卯': '申', '申': '卯', '辰': '亥', '亥': '辰', '巳': '戌', '戌': '巳'
};

/**
 * 12개월 월운 및 분기 타이밍을 계산합니다.
 */
export function calculateMonthlyFlow(options?: {
  profile?: UserProfile;
  targetYear?: number;
  question?: string;
}): MonthlyFlowResult {
  const now = new Date();
  const nowUtcIso = now.toISOString();
  const nowKstIso = formatMonthlyFlowKstTimestamp(now);

  const targetYear = options?.targetYear || now.getFullYear();
  const saju: SajuAnalysisResult = calculateDetailedSaju(options?.profile);

  const dGan = saju.pillars.day.gan;
  const dZhi = saju.pillars.day.zhi;
  const yongsinEl = saju.yongsin?.element || '목';
  const heeshinEl = saju.yongsinDetails?.heeshin || '화';
  const gisinEl = saju.yongsinDetails?.gisin || '금';

  // 세운 천간 (2026=丙, 2027=丁)
  const yearStemIndex = (targetYear - 4) % 10;
  const yearStemHanja = STEMS_LIST[yearStemIndex] || '丙';
  const yearBranchIndex = (targetYear - 4) % 12;
  const yearBranchesHanja = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const yearBranchHanja = yearBranchesHanja[yearBranchIndex] || '午';
  const yearGanZhiKr = `${STEM_KOREAN[yearStemHanja]}${BRANCH_KOREAN[yearBranchHanja]}년(${yearStemHanja}${yearBranchHanja})`;

  // 오호둔월법 시작 인덱스
  const startStemIdx = FIRST_MONTH_STEM_MAP[yearStemHanja] ?? 6;

  const monthlyTimeline: MonthFlowItem[] = [];

  for (let i = 0; i < 12; i++) {
    const curStemHanja = STEMS_LIST[(startStemIdx + i) % 10];
    const curBranchHanja = BRANCHES_MONTH_ORDER[i];
    const ganKr = STEM_KOREAN[curStemHanja] || '갑';
    const zhiKr = BRANCH_KOREAN[curBranchHanja] || '인';
    const ganZhi = `${ganKr}${zhiKr}(${curStemHanja}${curBranchHanja})`;

    const elGan = STEM_ELEMENTS[curStemHanja];
    const elZhi = BRANCH_ELEMENTS[curBranchHanja];

    const tgGan = calculateTenGod(dGan, curStemHanja).name;
    const tgZhi = calculateTenGod(dGan, curBranchHanja).name;
    const twelveStage = TWELVE_STAGES_MATRIX[dGan]?.[curBranchHanja] || '건록';

    // 지지 관계 판별
    let branchRelation: MonthFlowItem['branchRelation'] = {
      type: '평이',
      name: '평이한 조화',
      description: '일상적이고 차분한 환경 유지'
    };
    if (SIX_HARMONY[dZhi] === curBranchHanja) {
      branchRelation = {
        type: '육합',
        name: `일지 육합(${BRANCH_KOREAN[dZhi]}${zhiKr}합)`,
        description: '내면과 환경이 다정하게 화합하며 심리적 안정감과 조력자가 생김'
      };
    } else if (BRANCH_CLASH[dZhi] === curBranchHanja) {
      branchRelation = {
        type: '충',
        name: `일지 충(${BRANCH_KOREAN[dZhi]}${zhiKr}충)`,
        description: '환경의 역동적 변화, 이동수, 기존 틀을 깨고 새로운 판으로 도약'
      };
    } else if (WONJIN[dZhi] === curBranchHanja) {
      branchRelation = {
        type: '원진',
        name: `일지 원진(${BRANCH_KOREAN[dZhi]}${zhiKr}원진)`,
        description: '감정적 예민함이나 사소한 오해 주의, 투명한 커뮤니케이션 필요'
      };
    }

    // 용신 적합도
    let yongsinAffinity: MonthFlowItem['yongsinAffinity'] = '평이';
    let baseScore = 68;

    if (elGan === yongsinEl || elZhi === yongsinEl) {
      yongsinAffinity = '용신강화';
      baseScore += 18;
    } else if (elGan === heeshinEl || elZhi === heeshinEl) {
      yongsinAffinity = '희신조력';
      baseScore += 12;
    } else if (elGan === gisinEl && elZhi === gisinEl) {
      yongsinAffinity = '기신주의';
      baseScore -= 12;
    }

    if (branchRelation.type === '육합') baseScore += 8;
    else if (branchRelation.type === '충') baseScore -= 4; // 충은 역동적이나 변수 발생
    else if (branchRelation.type === '원진') baseScore -= 8;

    const finalScore = Math.max(45, Math.min(97, baseScore));

    let grade: MonthFlowItem['grade'] = '평온(순항기)';
    if (finalScore >= 85) grade = '대길(황금기)';
    else if (finalScore >= 75) grade = '소길(도약기)';
    else if (finalScore >= 65) grade = '평온(순항기)';
    else if (finalScore >= 55) grade = '조율(정비기)';
    else grade = '신중(주의기)';

    // 테마 태그 및 팁 생성
    let themeTag = '🌿 안정적 기반 다지기';
    let monthlyActionTip = '무리한 욕심을 내기보다 일상의 리듬을 정돈하고 내실을 다지십시오.';

    if (/정재|편재/.test(tgGan) || /정재|편재/.test(tgZhi)) {
      themeTag = '💰 실속 재물 & 비즈니스 결실';
      monthlyActionTip = '실질적인 수익화와 계약, 자산 관리에 집중하여 가시적인 결실을 챙기십시오.';
    } else if (/정관|편관/.test(tgGan) || /정관|편관/.test(tgZhi)) {
      themeTag = '🚀 커리어 승진 & 책임 확장';
      monthlyActionTip = '대외적 신뢰와 평판을 높이며 공식적인 직무 권한을 당당히 장악하십시오.';
    } else if (/식신|상관/.test(tgGan) || /식신|상관/.test(tgZhi)) {
      themeTag = '💡 창의적 기획 & 자기표현 분출';
      monthlyActionTip = '준비해 온 아이디어를 세상에 널리 알리고 적극적으로 대외 활동을 펼치십시오.';
    } else if (/정인|편인/.test(tgGan) || /정인|편인/.test(tgZhi)) {
      themeTag = '📚 자격증·지식 습득 & 귀인 원조';
      monthlyActionTip = '학습과 문서 계약에 유리하며, 멘토나 상사의 조력을 적극 활용하십시오.';
    } else {
      themeTag = '🤝 팀워크 구축 & 협력 네트워크';
      monthlyActionTip = '동료들과의 끈끈한 유대감을 형성하고 공동 프로젝트의 기틀을 마련하십시오.';
    }

    const meta = MONTH_METAS[i];
    monthlyTimeline.push({
      monthOrder: i + 1,
      solarMonthName: meta.solarName,
      solarApproxRange: meta.range,
      ganZhi,
      gan: curStemHanja,
      zhi: curBranchHanja,
      ganKr,
      zhiKr,
      elementGan: elGan,
      elementZhi: elZhi,
      tenGodGan: tgGan,
      tenGodZhi: tgZhi,
      twelveStage,
      branchRelation,
      yongsinAffinity,
      score: finalScore,
      grade,
      themeTag,
      monthlyActionTip,
    });
  }

  // 4대 분기 거시 전략 도출
  const q1Months = monthlyTimeline.slice(0, 3);
  const q2Months = monthlyTimeline.slice(3, 6);
  const q3Months = monthlyTimeline.slice(6, 9);
  const q4Months = monthlyTimeline.slice(9, 12);

  const avg = (arr: MonthFlowItem[]) => Math.round(arr.reduce((a, b) => a + b.score, 0) / arr.length);

  const quarterlyStrategies: QuarterStrategy[] = [
    {
      quarterName: 'Q1. 봄의 태동 (2~4월 · 인묘진월)',
      seasonTheme: '맹아와 시동: 새로운 아이템 발굴 및 프레임워크 기틀 구축',
      primaryFocus: '주저하던 프로젝트를 공식 런칭하고 초기 파트너십을 결성하는 시기',
      riskManagement: '초반 오버페이스를 경계하고 기본 설계의 정밀도를 확보할 것',
      quarterScore: avg(q1Months),
    },
    {
      quarterName: 'Q2. 여름의 비상 (5~7월 · 사오미월)',
      seasonTheme: '개화와 확장: 대외 인지도 폭발 및 공격적인 시장 침투',
      primaryFocus: '가장 강력한 화(火) 기운으로 대외적인 마케팅과 성과를 가시화',
      riskManagement: '감정 과열로 인한 번아웃이나 사소한 말실수 주의',
      quarterScore: avg(q2Months),
    },
    {
      quarterName: 'Q3. 가을의 결실 (8~10월 · 신유술월)',
      seasonTheme: '수확과 계약: 실질적인 현금 흐름 확보 및 알짜 자산 고정',
      primaryFocus: '뿌려둔 씨앗을 회수하여 법적 계약과 수익으로 전환하는 최고 수확기',
      riskManagement: '세부 조항의 누락이나 계약서상의 숨은 위험을 꼼꼼히 체크할 것',
      quarterScore: avg(q3Months),
    },
    {
      quarterName: 'Q4. 겨울의 축적 (11~1월 · 해자축월)',
      seasonTheme: '지혜와 내실: 시스템 최적화 및 차기 도약을 위한 전략 비축',
      primaryFocus: '올해의 성과를 냉정히 회고하고 불필요한 비용을 털어내는 리팩토링',
      riskManagement: '추운 기운에 몸과 마음이 위축되지 않도록 건강과 온기 유지',
      quarterScore: avg(q4Months),
    },
  ];

  // 결정별 골든 먼스 추출
  const sortedByScore = [...monthlyTimeline].sort((a, b) => b.score - a.score);
  const careerBestMonths = monthlyTimeline
    .filter(m => /정관|편관|정인|편인/.test(m.tenGodGan) || /정관|편관/.test(m.tenGodZhi) || m.score >= 82)
    .slice(0, 3)
    .map(m => `${m.monthOrder}월(${m.ganZhi.split('(')[0]} · ${m.solarMonthName.split(' ')[1]})`);

  const wealthBestMonths = monthlyTimeline
    .filter(m => /정재|편재|식신|상관/.test(m.tenGodGan) || /정재|편재/.test(m.tenGodZhi) || m.score >= 80)
    .slice(0, 3)
    .map(m => `${m.monthOrder}월(${m.ganZhi.split('(')[0]} · ${m.solarMonthName.split(' ')[1]})`);

  const healingBestMonths = monthlyTimeline
    .filter(m => m.branchRelation.type === '육합' || /정인|식신/.test(m.tenGodGan))
    .slice(0, 2)
    .map(m => `${m.monthOrder}월(${m.ganZhi.split('(')[0]} · ${m.solarMonthName.split(' ')[1]})`);

  const cautionMonths = monthlyTimeline
    .filter(m => m.branchRelation.type === '충' || m.branchRelation.type === '원진' || m.score < 60)
    .slice(0, 2)
    .map(m => `${m.monthOrder}월(${m.ganZhi.split('(')[0]} · ${m.branchRelation.name})`);

  const topMonth = sortedByScore[0];
  const yearOverallFlowSummary = `${yearGanZhiKr}에는 전반적으로 ${topMonth.monthOrder}월(${topMonth.ganZhi})에 운의 파동이 정점에 달하며, 분기별로는 ${quarterlyStrategies.reduce((prev, cur) => cur.quarterScore > prev.quarterScore ? cur : prev).quarterName}에 가장 강력한 성취 시너지가 일어납니다.`;

  const topQuarter = quarterlyStrategies.reduce((prev, cur) => cur.quarterScore > prev.quarterScore ? cur : prev);
  const q = (options?.question || '').trim();
  const monthlyFlowSynthesisMatrix = {
    dominantTension: `${topMonth.monthOrder}월(${topMonth.ganZhi}) ↔ ${cautionMonths[0] || '안정 분기'}`,
    alignmentState: `${yearGanZhiKr} · ${topQuarter.quarterName}`,
    integratedAction: `${topMonth.monthlyActionTip}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: MONTHLY_FLOW_ENGINE_VERSION,
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),

    targetYear,
    yearGanZhiKr,
    dayMasterText: `${saju.dayMaster.hanja}(${saju.dayMaster.korean})`,

    monthlyTimeline,
    quarterlyStrategies,
    decisionMilestones: {
      careerBestMonths,
      wealthBestMonths,
      healingBestMonths,
      cautionMonths,
    },
    yearOverallFlowSummary,
    monthlyFlowSynthesisMatrix,
    interpretiveBoundary: '본 12개월 월운 및 분기 타이밍 리포트는 오호둔월법과 사주 십신·12운성에 기반한 정성적 시기 참고 안내이며, 투자·이직·계약의 확정적 보장이 아닙니다.',
  };
}

/**
 * 12개월 월운 리포트를 LLM 마스터 프롬프트에 주입하기 위해 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatMonthlyFlowPrompt(res: MonthlyFlowResult): string {
  const monthLines = res.monthlyTimeline.map(m =>
    `   • [${m.monthOrder}월 · ${m.ganZhi}] (${m.solarMonthName} | ${m.solarApproxRange}):
     - 십신: 간 [${m.tenGodGan}] / 지 [${m.tenGodZhi}] | 12운성: [${m.twelveStage}]
     - 지지 결합: ${m.branchRelation.name} (${m.branchRelation.description})
     - 흐름 등급: ★ [${m.grade}] | 테마: ${m.themeTag}
     - 실천 조언: ${m.monthlyActionTip}`
  ).join('\n\n');

  const qLines = res.quarterlyStrategies.map(q =>
    `   - [${q.quarterName}]: ${q.seasonTheme} -> 주력: ${q.primaryFocus} (주의: ${q.riskManagement})`
  ).join('\n');

  return `[📅 12개월 월운(月運) & 분기 타이밍 실측 데이터 (Monthly Flow Matrix Core)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 시각: ${res.calculatedAtKst} | 기준 세운: ★ ${res.yearGanZhiKr} | 일간: ${res.dayMasterText}
연간 총평: "${res.yearOverallFlowSummary}"
======================================================================
1. [라이프 의사결정 골든 먼스(Golden Month) 타임라인]:
   - 🚀 이직·커리어 도약 최적월: ${res.decisionMilestones.careerBestMonths.join(', ') || '전반기 안정 추천'}
   - 💰 계약·투자·수익화 최적월: ${res.decisionMilestones.wealthBestMonths.join(', ') || '중반기 안정 추천'}
   - 🌿 휴식·재충전·힐링 최적월: ${res.decisionMilestones.healingBestMonths.join(', ') || '하반기 추천'}
   - ⚠️ 변수 대비·구설 조심월: ${res.decisionMilestones.cautionMonths.join(', ') || '특이 흉월 없음(안정)'}

2. [사계절 4대 분기(Quarter) 전략 로드맵]:
${qLines}

3. [12개월 절기월별 정밀 운세 도감]:
${monthLines}
${res.monthlyFlowSynthesisMatrix ? `\n4. [교차 매트릭스]:\n   - 핵심 긴장: ${res.monthlyFlowSynthesisMatrix.dominantTension}\n   - 조율 상태: ${res.monthlyFlowSynthesisMatrix.alignmentState}\n   - 통합 실천: ${res.monthlyFlowSynthesisMatrix.integratedAction}` : ''}
5. [해석 경계]: ${res.interpretiveBoundary}
======================================================================
[★ 루시 월운 상담 지침]:
- 사용자가 '몇 월이 좋아?', '이직 언제 할까?', '올해 하반기 운세는?' 등을 물었을 때 위 12개월 실측 타임라인 데이터를 근거로 구체적인 달(Month)과 시기를 명쾌하게 짚어줘.
- 막연한 기대나 공포를 심어주지 말고, 각 월의 십신과 12운성 에너지를 활용하는 최적의 승부수 타이밍을 다정하고 실천적으로 안내해줘.`;
}
