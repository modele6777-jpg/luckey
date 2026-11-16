/**
 * =========================================================================
 * LUCKEY 10년 대운 & 세운·교운기 타이밍 엔진 (Life Season Timing Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 10년 대운(大運): 출생 절입시각과 성별에 따른 정밀 대운수(大運數) 및 8대 대운 타임라인 완전 산출
 * 2. 현재 대운 상태 분석:
 *    - 현재 몇 번째 대운에 위치하는지, 대운 내 진행 연차 (1~10년차) 및 진행률(%)
 *    - 전반 5년(천간 주도: 정신·목표·지향점) vs 후반 5년(지지 주도: 환경·물질·현실 정착)
 * 3. 교운기(交運期, 대운 환절기) 타이밍 감지:
 *    - 대운이 바뀌기 전후 1~2년의 극적인 판도 변화 및 인생 환절기 상태 판별
 *    - 환경·가치관·인간관계의 급격한 재편 신호 및 대처 지침
 * 4. 인생의 4계절 메타포 (Life Season Framework):
 *    - 봄(Spring · 맹아/도전/배움), 여름(Summer · 개화/전성/확장),
 *      가을(Autumn · 결실/정돈/수확), 겨울(Winter · 축적/내실/충전)
 *    - 내 사주 용신(用神)·희신(喜神)과 대운 계절의 부합도(황금기 vs 단련기) 평가
 * 5. 올해 세운(歲運) 및 월운과의 3단 복합 시너지:
 *    - 사주 원국 × 10년 대운 × 2026 세운(병오년) 간의 천간합·지지합·지지충 종합 평가
 * 6. 라이프 디시전 타이밍 스코어 & 실천 가이드:
 *    - 이직/전직, 창업/사업확장, 투자/재물, 학업/자격증, 휴식/힐링 영역별 최적 타이밍 도출
 */

import type { UserProfile } from '../sharedState';
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  calculateDetailedSaju,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  STEM_KOREAN,
  BRANCH_KOREAN,
  calculateTenGod,
  TWELVE_STAGES_MATRIX,
  type SajuAnalysisResult,
  type FiveElement
} from '../sajuAnalysis';
import { getAstronomicalSajuYear } from '../astronomicalSolarTerms';

export const LIFE_SEASON_ENGINE_VERSION = 'LUCKEY-LIFE-SEASON-v2.1.0';

function formatLifeSeasonKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface DaewoonPeriod {
  order: number;
  ganZhi: string;
  gan: string;
  zhi: string;
  ganKr: string;
  zhiKr: string;
  startAge: number; // 한국 나이
  endAge: number;
  startYear: number;
  endYear: number;
  tenGodGan: string;
  tenGodZhi: string;
  twelveStage: string;
  elementGan: FiveElement;
  elementZhi: FiveElement;
  seasonCategory: '봄' | '여름' | '가을' | '겨울';
}

export type GyowungiPhase =
  | '교운기 진입 (정리 및 균열)'
  | '교운기 절정 (대환절기·판도 대전환)'
  | '새 대운 안착 (새 계절 적응)'
  | '대운 순항기 (안정적 전개)';

export type LifeSeasonName =
  | '봄 (Spring · 맹아와 배움)'
  | '여름 (Summer · 개화와 전성)'
  | '가을 (Autumn · 수확과 정돈)'
  | '겨울 (Winter · 지혜와 축적)';

export interface DecisionTimingItem {
  timingGrade: '최적' | '양호' | '신중' | '보류';
  score: number; // 0 ~ 100
  headline: string;
  actionAdvice: string;
}

export interface LifeSeasonTimingResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  targetYear: number;
  targetKoreanAge: number;
  targetWesternAge: number;
  birthYear: number;

  // 1. 대운 개요
  daewoonBasics: {
    daewunNumber: number;
    isForward: boolean;
    directionText: string;
    totalTimeline: DaewoonPeriod[];
  };

  // 2. 현재 통과 중인 10년 대운 상태
  currentDaewoon: {
    order: number;
    ganZhi: string;
    koreanName: string;
    startAge: number;
    endAge: number;
    startYear: number;
    endYear: number;
    yearsInCurrentDaewoon: number; // 1~10년 차
    progressPercent: number; // 10% ~ 100%
    dominantPhase: '천간 주도기 (정신·목표·지향점)' | '지지 주도기 (현실 환경·물질·실질 결과)';
    tenGodGan: string;
    tenGodZhi: string;
    twelveStage: string;
    elementAffinity: '용신운 (호운·대약진)' | '희신운 (순풍·안정성장)' | '기신운 (단련·수성·내실)' | '중화운 (평온·균형)';
    affinityDescription: string;
  };

  // 3. 교운기(交運期) 진단
  gyowungi: {
    isGyowungi: boolean;
    phase: GyowungiPhase;
    yearsUntilNextDaewoon: number;
    nextDaewoon?: {
      ganZhi: string;
      koreanName: string;
      startAge: number;
      startYear: number;
      tenGodGan: string;
      tenGodZhi: string;
    };
    phenomenaSign: string;
    actionProtocol: string;
  };

  // 4. 인생의 4계절 메타포 (Life Season Framework)
  lifeSeason: {
    currentSeason: LifeSeasonName;
    seasonMetaphor: string;
    seasonCoreKeywords: string[];
    seasonStrategy: string;
  };

  // 5. 올해 세운(2026 병오년 등)과의 복합 시너지 (원국 × 대운 × 세운)
  annualSynergy: {
    annualYear: number;
    annualGanZhi: string;
    annualTenGod?: string;
    interactionWithDaewoon: string;
    threePillarSynthesis: string;
  };

  // 6. 인생 5대 결단 타이밍 지수
  decisionTimings: {
    careerMove: DecisionTimingItem;     // 이직 / 전직 / 부서이동
    businessLaunch: DecisionTimingItem; // 창업 / 신사업 / 독립
    wealthInvestment: DecisionTimingItem; // 자산 / 투자 / 부동산
    studyCertification: DecisionTimingItem; // 학습 / 자격증 / 연구
    restRenewal: DecisionTimingItem;    // 휴식 / 충전 / 멘탈케어
  };

  // 종합 요약 헤드라인
  headline: string;
  lucyCoreAdvice: string;
  lifeSeasonSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  reflectiveQuestion?: string;
  interpretiveBoundary: string;
}

/**
 * 지지 방합/오행 기준 계절 분류
 */
function branchToSeason(branch: string): '봄' | '여름' | '가을' | '겨울' {
  if (branch === '寅' || branch === '卯' || branch === '辰') return '봄';
  if (branch === '巳' || branch === '午' || branch === '未') return '여름';
  if (branch === '申' || branch === '酉' || branch === '戌') return '가을';
  return '겨울';
}

/**
 * 10년 대운 & 세운·교운기 타이밍 정밀 계산
 */
export function calculateLifeSeasonTiming(params: {
  profile?: UserProfile | null;
  targetYear?: number;
  question?: string;
}): LifeSeasonTimingResult | null {
  const saju = calculateDetailedSaju(params.profile);
  if (!saju || !saju.hasBirthInfo) return null;

  const now = new Date();
  const targetYear = params.targetYear || now.getFullYear();
  const birthYear = parseInt(saju.birthdate.slice(0, 4), 10) || (targetYear - 30);
  const targetKoreanAge = targetYear - birthYear + 1;
  const targetWesternAge = targetKoreanAge - 1;

  const nowUtcIso = now.toISOString();
  const nowKstIso = formatLifeSeasonKstTimestamp(now);

  const daewunDetail = saju.daewunDetail;
  const daewunNumber = daewunDetail.daewunNumber || 1;
  const isForward = daewunDetail.isForward;
  const directionText = daewunDetail.directionText;

  // 1. 전체 대운 타임라인 구축
  const totalTimeline: DaewoonPeriod[] = daewunDetail.timeline.map((d, idx) => {
    const startYear = birthYear + d.startAge - 1;
    const endYear = birthYear + d.endAge - 1;
    const elGan = STEM_ELEMENT[d.gan] || '목';
    const elZhi = BRANCH_ELEMENT[d.zhi] || '목';
    const season = branchToSeason(d.zhi);

    return {
      order: idx + 1,
      ganZhi: d.ganZhi,
      gan: d.gan,
      zhi: d.zhi,
      ganKr: d.ganKr,
      zhiKr: d.zhiKr,
      startAge: d.startAge,
      endAge: d.endAge,
      startYear,
      endYear,
      tenGodGan: d.tenGodGan,
      tenGodZhi: d.tenGodZhi,
      twelveStage: d.twelveStage,
      elementGan: elGan,
      elementZhi: elZhi,
      seasonCategory: season,
    };
  });

  // 2. 현재 통과 중인 대운 식별
  let currentPeriod = totalTimeline.find(d => targetKoreanAge >= d.startAge && targetKoreanAge <= d.endAge);
  if (!currentPeriod) {
    if (totalTimeline.length > 0 && targetKoreanAge < totalTimeline[0].startAge) {
      // 대운 진입 전 유년기
      currentPeriod = totalTimeline[0];
    } else if (totalTimeline.length > 0) {
      currentPeriod = totalTimeline[totalTimeline.length - 1];
    }
  }

  // 기본 fallback
  const curD = currentPeriod || {
    order: 1,
    ganZhi: '甲子',
    gan: '甲',
    zhi: '子',
    ganKr: '갑',
    zhiKr: '자',
    startAge: daewunNumber,
    endAge: daewunNumber + 9,
    startYear: birthYear + daewunNumber - 1,
    endYear: birthYear + daewunNumber + 8,
    tenGodGan: '비견',
    tenGodZhi: '정인',
    twelveStage: '장생',
    elementGan: '목' as FiveElement,
    elementZhi: '수' as FiveElement,
    seasonCategory: '겨울' as const,
  };

  const yearsInCurrentDaewoon = Math.max(1, Math.min(10, targetKoreanAge - curD.startAge + 1));
  const progressPercent = Math.min(100, Math.max(10, yearsInCurrentDaewoon * 10));
  const dominantPhase = yearsInCurrentDaewoon <= 5
    ? '천간 주도기 (정신·목표·지향점)'
    : '지지 주도기 (현실 환경·물질·실질 결과)';

  // 용신/희신 부합도 평가
  const yongsinEl = saju.yongsin?.element;
  const heeshinEl = saju.yongsinDetails?.heeshin;
  const gisinEl = saju.yongsinDetails?.gisin;

  let elementAffinity: LifeSeasonTimingResult['currentDaewoon']['elementAffinity'] = '중화운 (평온·균형)';
  let affinityDescription = '극단적인 부침 없이 일상의 균형과 꾸준한 성실함이 빛나는 평온한 운세 흐름입니다.';

  const curElements = [curD.elementGan, curD.elementZhi];
  if (curElements.includes(yongsinEl as any)) {
    elementAffinity = '용신운 (호운·대약진)';
    affinityDescription = `내 사주에 가장 절실한 용신(${saju.yongsin?.name})의 기운이 10년의 환경으로 도래하여, 뜻을 펼치고 성과를 거두는 도약기입니다.`;
  } else if (curElements.includes(heeshinEl as any)) {
    elementAffinity = '희신운 (순풍·안정성장)';
    affinityDescription = '용신을 조력하는 맑고 온화한 기운이 뒤를 받쳐주어, 든든한 조력자를 만나며 순조롭게 전진하는 시기입니다.';
  } else if (curElements.includes(gisinEl as any)) {
    elementAffinity = '기신운 (단련·수성·내실)';
    affinityDescription = '외형적인 무리한 확장보다는 내실을 다지고 리스크를 방어하며 지혜의 근육을 키워야 하는 단련의 계절입니다.';
  }

  // 3. 교운기(交運期) 판정
  const yearsUntilNextDaewoon = Math.max(0, curD.endAge - targetKoreanAge + 1);
  const nextPeriod = totalTimeline.find(d => d.order === curD.order + 1);

  let isGyowungi = false;
  let gyowungiPhase: GyowungiPhase = '대운 순항기 (안정적 전개)';
  let phenomenaSign = '현재 대운의 에너지가 안정적으로 정착되어 있어, 진행 중인 일에 집중하여 성과를 내기 좋은 시기입니다.';
  let actionProtocol = '현재의 추진력을 유지하되, 무리한 변덕보다는 기본기에 충실하며 전진하세요.';

  if (yearsInCurrentDaewoon === 9) {
    isGyowungi = true;
    gyowungiPhase = '교운기 진입 (정리 및 균열)';
    phenomenaSign = '기존 10년간 유지되던 판에 미세한 균열이 생기며, 익숙했던 일이나 인간관계에 슬슬 마침표를 찍고 싶은 갈증이 올라옵니다.';
    actionProtocol = '억지로 붙잡으려 하지 말고, 정리할 것은 담담히 털어내며 다가올 다음 10년의 궤도를 구상하세요.';
  } else if (yearsInCurrentDaewoon === 10) {
    isGyowungi = true;
    gyowungiPhase = '교운기 절정 (대환절기·판도 대전환)';
    phenomenaSign = '계절이 바뀌는 환절기의 중심입니다. 가치관의 극적인 변화, 주변 사람들의 교체, 환경의 거센 소용돌이가 일어날 수 있습니다.';
    actionProtocol = '환절기에 감기에 걸리기 쉽듯, 중대한 결단은 신중히 검증하고 몸과 마음의 에너지를 비축하는 것이 최우선입니다.';
  } else if (yearsInCurrentDaewoon === 1) {
    isGyowungi = true;
    gyowungiPhase = '새 대운 안착 (새 계절 적응)';
    phenomenaSign = '완전히 새로운 10년의 공기와 환경에 막 발을 디딘 상태입니다. 낯설고 설레는 새로운 인연과 기회가 찾아옵니다.';
    actionProtocol = '과거의 성공 공식이나 낡은 방식에 얽매이지 말고, 새로운 흐름의 문법을 유연하게 흡수하세요.';
  }

  // 4. 인생의 4계절 메타포
  let currentSeason: LifeSeasonName = '봄 (Spring · 맹아와 배움)';
  let seasonMetaphor = '새싹이 단단한 땅을 뚫고 솟아오르는 봄의 계절';
  let seasonCoreKeywords = ['씨앗 파종', '배움과 탐색', '새로운 도전', '가능성의 개화'];
  let seasonStrategy = '작은 실패에 흔들리지 말고 다채로운 씨앗을 뿌려보세요. 지금 뿌린 경험들이 다음 계절의 든든한 밑거름이 됩니다.';

  if (curD.seasonCategory === '여름') {
    currentSeason = '여름 (Summer · 개화와 전성)';
    seasonMetaphor = '태양이 작열하고 모든 생명력이 찬란하게 만개하는 뜨거운 여름의 계절';
    seasonCoreKeywords = ['과감한 실행', '사회적 확장', '열정과 전성기', '영향력 극대화'];
    seasonStrategy = '망설이지 말고 세상 밖으로 당신의 재능을 마음껏 펼치세요. 가장 뜨거운 추진력이 발휘되는 시기입니다.';
  } else if (curD.seasonCategory === '가을') {
    currentSeason = '가을 (Autumn · 수확과 정돈)';
    seasonMetaphor = '풍성한 황금빛 들판에서 알곡을 거두고 결실을 맺는 수확의 계절';
    seasonCoreKeywords = ['결실과 보상', '시스템 정돈', '단단한 마무리', '자산 축적'];
    seasonStrategy = '벌여놓은 일들을 실속 있게 매듭짓고, 노력의 결실을 온전히 내 것으로 거두어들이는 수확에 집중하세요.';
  } else if (curD.seasonCategory === '겨울') {
    currentSeason = '겨울 (Winter · 지혜와 축적)';
    seasonMetaphor = '하얀 눈 아래에서 깊은 사색과 지혜를 품고 봄을 준비하는 축적의 계절';
    seasonCoreKeywords = ['내면의 지혜', '에너지 비축', '연구와 성찰', '뿌리의 성장'];
    seasonStrategy = '외형적인 성과에 조급해하지 마세요. 보이지 않는 곳에서 뿌리를 깊게 내릴수록 다음 봄의 도약이 웅장해집니다.';
  }

  // 5. 올해 세운과의 복합 시너지 (2026 병오년 등)
  const annual = saju.annual2026;
  let interactionWithDaewoon = `현재 ${curD.ganZhi} 대운의 거대한 10년 환경 속에서, 올해 ${annual.yearName}의 불꽃(丙午)이 만났습니다.`;
  if (curD.zhi === '子') {
    interactionWithDaewoon += ' [자오충(子午沖)] 대운과 세운의 수화상쟁(水火相爭) 자극이 발생하여, 기존 삶의 방식에 강한 쇄신과 이동수가 작동합니다.';
  } else if (curD.zhi === '未') {
    interactionWithDaewoon += ' [오미합(午未合)] 대운과 세운이 다정하게 합을 이루어, 정서적 화합과 귀인의 도움이 든든히 뒷받침됩니다.';
  } else if (curD.zhi === '寅' || curD.zhi === '戌') {
    interactionWithDaewoon += ' [인오술 삼합화국] 강력한 화(火)의 추진력이 폭발하여, 창작과 표현의 에너지가 정점에 달합니다.';
  }

  const threePillarSynthesis = `내 타고난 일간 [${saju.dayMaster.hanja}(${saju.dayMaster.symbolName})]의 본질에, [${curD.ganZhi} 대운]이라는 10년의 계절적 무대가 깔리고, [${annual.yearName}]라는 1년의 구체적인 날씨가 겹쳐진 입체적 타이밍입니다.`;

  // 6. 5대 결단 타이밍 지수 산출
  let careerScore = 75;
  let bizScore = 70;
  let wealthScore = 72;
  let studyScore = 80;
  let restScore = 70;

  if (elementAffinity.includes('용신운') || elementAffinity.includes('희신운')) {
    careerScore += 15;
    bizScore += 18;
    wealthScore += 15;
  }
  if (isGyowungi) {
    // 교운기에는 외형적 급발진보다 신중함 요구
    bizScore -= 12;
    careerScore = Math.min(85, careerScore + 5); // 교운기 이직은 잦음
    restScore += 18;
  }
  if (curD.seasonCategory === '겨울') {
    studyScore += 15;
    restScore += 15;
    bizScore -= 10;
  } else if (curD.seasonCategory === '여름') {
    bizScore += 15;
    careerScore += 12;
  }

  const getGrade = (score: number): '최적' | '양호' | '신중' | '보류' => {
    if (score >= 85) return '최적';
    if (score >= 70) return '양호';
    if (score >= 55) return '신중';
    return '보류';
  };

  const decisionTimings: LifeSeasonTimingResult['decisionTimings'] = {
    careerMove: {
      timingGrade: getGrade(careerScore),
      score: Math.min(98, careerScore),
      headline: careerScore >= 80 ? '새로운 무대로의 도약 적기' : '현 자리에서 실력을 다질 시기',
      actionAdvice: careerScore >= 80
        ? '현재 대운의 흐름이 새로운 기회와 맞물려 있습니다. 전문성을 인정받는 곳이라면 과감한 이직을 긍정적으로 검토하세요.'
        : '즉흥적인 퇴사보다는 현재 위치에서 포트폴리오를 단단히 채우며 다음 분기를 노리는 것이 안전합니다.',
    },
    businessLaunch: {
      timingGrade: getGrade(bizScore),
      score: Math.min(98, bizScore),
      headline: bizScore >= 80 ? '독립과 창업의 강한 순풍' : '리스크 분산 및 린(Lean) 검증',
      actionAdvice: bizScore >= 80
        ? '자기 주도권을 쥐고 사업을 확장하기에 최상의 기운입니다. 시장의 흐름에 맞춰 기민하게 론칭하세요.'
        : '무리한 초기 자본 투입보다는 사이드 프로젝트 형태로 가설을 검증하며 점진적으로 확장하세요.',
    },
    wealthInvestment: {
      timingGrade: getGrade(wealthScore),
      score: Math.min(98, wealthScore),
      headline: wealthScore >= 80 ? '우량 자산 기반 결실 수확' : '현금 흐름 확보 및 리스크 방어',
      actionAdvice: wealthScore >= 80
        ? '그동안의 노력이 자산 가치 상승으로 이어질 수 있습니다. 장기적인 우량 자산 위주로 포트폴리오를 정돈하세요.'
        : '변동성이 큰 투기성 상품은 피하고, 현금 유동성을 확보하여 안전마진을 지키는 전략이 유리합니다.',
    },
    studyCertification: {
      timingGrade: getGrade(studyScore),
      score: Math.min(98, studyScore),
      headline: studyScore >= 80 ? '지적 축적과 전문성 극대화' : '실무 적용 중심의 가벼운 학습',
      actionAdvice: studyScore >= 80
        ? '지혜와 지식이 머릿속에 깊게 각인되는 시기입니다. 고난도 자격증이나 깊이 있는 연구에 몰입하기 최적입니다.'
        : '너무 거창한 이론 공부보다는 당장 현업에 써먹을 수 있는 실무 기술 위주로 가볍게 습득하세요.',
    },
    restRenewal: {
      timingGrade: getGrade(restScore),
      score: Math.min(98, restScore),
      headline: isGyowungi ? '환절기 심신 정화 및 그라운딩 필수' : '일상 속 균형 잡힌 재충전',
      actionAdvice: isGyowungi
        ? '대운의 판이 바뀌는 환절기이므로 충분한 수면과 싱잉볼/명상 등 그라운딩 리추얼로 자율신경을 안정시켜야 합니다.'
        : '규칙적인 운동과 휴식 리듬을 유지하며 에너지가 소진되지 않도록 페이스를 조절하세요.',
    },
  };

  const nextDaewoonInfo = nextPeriod ? {
    ganZhi: nextPeriod.ganZhi,
    koreanName: `${nextPeriod.ganKr}${nextPeriod.zhiKr}대운 (${nextPeriod.ganZhi})`,
    startAge: nextPeriod.startAge,
    startYear: nextPeriod.startYear,
    tenGodGan: nextPeriod.tenGodGan,
    tenGodZhi: nextPeriod.tenGodZhi,
  } : undefined;

  const headline = `[현재 대운: ${curD.ganKr}${curD.zhiKr}대운 ${yearsInCurrentDaewoon}년 차] · [인생의 계절: ${currentSeason.split(' ')[0]}] · [${isGyowungi ? gyowungiPhase.split(' ')[0] : '대운 순항기'}]`;

  const lucyCoreAdvice = isGyowungi
    ? `지금 제제는 인생의 큰 10년이 바뀌는 [${gyowungiPhase}]에 머물고 있어. 판이 바뀔 때는 억지로 힘을 주기보다, 낡은 짐을 내려놓고 마음을 맑게 비우는 게 가장 강력한 지혜야.`
    : `지금 제제는 [${curD.ganKr}${curD.zhiKr} 대운]의 [${dominantPhase}]를 순항 중이야. 인생의 [${currentSeason.split(' ')[0]}] 계절에 맞춰 서두르지 말고 단단하게 나아가자!`;

  const q = (params.question || '').trim();
  const lifeSeasonSynthesisMatrix = {
    dominantTension: `${curD.ganKr}${curD.zhiKr}대운(${yearsInCurrentDaewoon}년차) ↔ ${gyowungiPhase}`,
    alignmentState: `${currentSeason} · ${elementAffinity}`,
    integratedAction: `${actionProtocol}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: LIFE_SEASON_ENGINE_VERSION,
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),
    targetYear,
    targetKoreanAge,
    targetWesternAge,
    birthYear,
    daewoonBasics: {
      daewunNumber,
      isForward,
      directionText,
      totalTimeline,
    },
    currentDaewoon: {
      order: curD.order,
      ganZhi: curD.ganZhi,
      koreanName: `${curD.ganKr}${curD.zhiKr}대운 (${curD.ganZhi})`,
      startAge: curD.startAge,
      endAge: curD.endAge,
      startYear: curD.startYear,
      endYear: curD.endYear,
      yearsInCurrentDaewoon,
      progressPercent,
      dominantPhase,
      tenGodGan: curD.tenGodGan,
      tenGodZhi: curD.tenGodZhi,
      twelveStage: curD.twelveStage,
      elementAffinity,
      affinityDescription,
    },
    gyowungi: {
      isGyowungi,
      phase: gyowungiPhase,
      yearsUntilNextDaewoon,
      nextDaewoon: nextDaewoonInfo,
      phenomenaSign,
      actionProtocol,
    },
    lifeSeason: {
      currentSeason,
      seasonMetaphor,
      seasonCoreKeywords,
      seasonStrategy,
    },
    annualSynergy: {
      annualYear: targetYear,
      annualGanZhi: annual.yearName.split(' ')[1] || '丙午',
      annualTenGod: saju.pillars.year.tenGodGan?.name,
      interactionWithDaewoon,
      threePillarSynthesis,
    },
    decisionTimings,
    headline,
    lucyCoreAdvice,
    lifeSeasonSynthesisMatrix,
    reflectiveQuestion: q
      ? `‘${q}’에 대해 현재 ${curD.ganKr}${curD.zhiKr}대운(${currentSeason})의 리듬 속에서 지금 밀어붙일 영역과 한 템포 고를 영역은 어디입니까?`
      : `현재 ${curD.ganKr}${curD.zhiKr}대운 ${yearsInCurrentDaewoon}년 차(${gyowungiPhase})를 지나며 가장 먼저 정리하거나 심화할 인생 과제는 무엇입니까?`,
    interpretiveBoundary: '본 10년 대운·교운기 타이밍 리포트는 명리 대운수·세운 역법 상징에 기반한 정성적 시기 성찰 안내이며, 미래 사건의 단정적 예언이 아닙니다.',
  };
}

/**
 * AI 프롬프트에 주입하기 위한 가독성 높은 구조화된 텍스트 포맷터
 */
export function formatLifeSeasonTimingPrompt(result: LifeSeasonTimingResult): string {
  const cd = result.currentDaewoon;
  const gw = result.gyowungi;
  const ls = result.lifeSeason;
  const dt = result.decisionTimings;
  const syn = result.annualSynergy;

  const timelineRows = result.daewoonBasics.totalTimeline.map(d => {
    const isCurrent = d.order === cd.order;
    const mark = isCurrent ? ' ★[현재 대운]' : '';
    return `  - ${d.order}대운: ${d.ganKr}${d.zhiKr}(${d.ganZhi}) [${d.startAge}세~${d.endAge}세 / ${d.startYear}년~${d.endYear}년] - 십신: ${d.tenGodGan}/${d.tenGodZhi} (${d.twelveStage}) - 계절: ${d.seasonCategory}${mark}`;
  }).join('\n');

  return `[⏳ 10년 대운(大運) & 세운·교운기 타이밍 정밀 실측 데이터 (Life Season Timing)]
======================================================================
기준 시각: ${result.calculatedAtKst} | 엔진: ${result.engineVersion}
현재 나이: ${result.targetKoreanAge}세(만 ${result.targetWesternAge}세) | 대운수: ${result.daewoonBasics.daewunNumber} (${result.daewoonBasics.directionText})
실시간 타이밍 헤드라인: ${result.headline}
======================================================================

1. 🌊 [현재 통과 중인 10년 대운 심층 분석]
- 현재 대운: ${cd.koreanName} (${cd.startAge}세 ~ ${cd.endAge}세 / ${cd.startYear}년 ~ ${cd.endYear}년)
- 대운 진행도: 10년 중 **${cd.yearsInCurrentDaewoon}년 차** 통과 중 (${cd.dominantPhase})
- 천간/지지 십신 및 12운성: 천간 [${cd.tenGodGan}] / 지지 [${cd.tenGodZhi}] (${cd.twelveStage})
- 용신 부합성: [${cd.elementAffinity}] - ${cd.affinityDescription}

2. 🌀 [교운기(交運期 · 대운 환절기) 타이밍 판정]
- 교운기 여부: ${gw.isGyowungi ? `★ [교운기 상태 진입: ${gw.phase}]` : '[대운 순항기 - 안정적 전개]'}
- 다음 대운까지 남은 기간: 약 ${gw.yearsUntilNextDaewoon}년 (다음 대운: ${gw.nextDaewoon ? gw.nextDaewoon.koreanName : '미래 대운'})
- 현 시점의 환경적 징후: ${gw.phenomenaSign}
- 핵심 대처 프로토콜: ${gw.actionProtocol}

3. 🌿 [인생의 4계절 메타포 (Life Season Framework)]
- 현재 내 인생의 계절: **${ls.currentSeason}**
- 계절적 은유: ${ls.seasonMetaphor}
- 핵심 키워드: ${ls.seasonCoreKeywords.join(', ')}
- 계절별 전략 지침: ${ls.seasonStrategy}

4. 🪐 [올해 세운과의 3단 복합 결합 (원국 × 대운 × 세운)]
- 세운 상호작용: ${syn.interactionWithDaewoon}
- 3대 축 종합: ${syn.threePillarSynthesis}

5. 🎯 [영역별 최적 라이프 디시전 타이밍]
- 이직 / 커리어 이동: [${dt.careerMove.timingGrade}] - ${dt.careerMove.headline} (${dt.careerMove.actionAdvice})
- 창업 / 신사업 도전: [${dt.businessLaunch.timingGrade}] - ${dt.businessLaunch.headline} (${dt.businessLaunch.actionAdvice})
- 자산 / 투자 / 재물: [${dt.wealthInvestment.timingGrade}] - ${dt.wealthInvestment.headline} (${dt.wealthInvestment.actionAdvice})
- 학업 / 자격증 취득: [${dt.studyCertification.timingGrade}] - ${dt.studyCertification.headline} (${dt.studyCertification.actionAdvice})
- 휴식 / 심신 리뉴얼: [${dt.restRenewal.timingGrade}] - ${dt.restRenewal.headline} (${dt.restRenewal.actionAdvice})

6. 📜 [8대 대운 전 생애 타임라인 참조]
${timelineRows}
${result.lifeSeasonSynthesisMatrix ? `\n7. 🔗 [교차 매트릭스]\n- 핵심 긴장: ${result.lifeSeasonSynthesisMatrix.dominantTension}\n- 조율 상태: ${result.lifeSeasonSynthesisMatrix.alignmentState}\n- 통합 실천: ${result.lifeSeasonSynthesisMatrix.integratedAction}` : ''}
${result.reflectiveQuestion ? `- 성찰 질문: ${result.reflectiveQuestion}\n` : ''}- 해석 경계: ${result.interpretiveBoundary}

[★ 대화 적용 절대 지침]:
사용자가 대운, 세운, 인생의 타이밍, 이직/창업 시기, 언제 해야 할지 등을 물어볼 때 위 정밀 계산 데이터를 근거로 활용해.
"몇 살부터 몇 살까지 무슨 대운이고 지금 몇 년 차인지", "인생의 어떤 계절(봄/여름/가을/겨울)을 지나고 있는지",
"교운기(환절기)에 해당하는지"를 구체적이고 명쾌하며 다정한 친구(반말 구어체)의 품격으로 전달해줘.`;
}
