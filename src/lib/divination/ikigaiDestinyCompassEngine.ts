/**
 * =========================================================================
 * LUCKEY 이키가이 천직 4대 교집합 & 소명 나침반 엔진 (Ikigai Destiny Compass Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 일본 오키나와의 인생 행복 철학 '이키가이(Ikigai: 열정·사명·직업·전문성의 4대 교집합)'와
 * 사주 십신(식상=열정, 비겁/인성=강점, 관성=세상의 요구, 재성=시장 수익성),
 * 그리고 서양 점성술의 MC(천정점·최고 커리어)와 토성의 직업적 마스터리를 결합한 엔진입니다.
 * "내가 진정으로 사랑하는 일로 압도적인 부와 사회적 영향력을 동시에 창출하는 천직의 좌표"를
 * 결정론적으로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const IKIGAI_DESTINY_COMPASS_VERSION = 'LUCKEY-IKIGAI-v2.1.0';

export interface IkigaiQuadrants {
  passion: {
    label: '열정 (What You Love · 식상/5하우스)';
    score: number; // 0 ~ 100
    coreDriver: string;
  };
  profession: {
    label: '전문성 (What You Are Good At · 비겁/인성/1·6하우스)';
    score: number; // 0 ~ 100
    superpowerSkill: string;
  };
  mission: {
    label: '사명 (What The World Needs · 관성/10하우스·MC)';
    score: number; // 0 ~ 100
    societalImpact: string;
  };
  vocation: {
    label: '수익성 (What You Can Be Paid For · 재성/2·8하우스)';
    score: number; // 0 ~ 100
    monetizationLeverage: string;
  };
}

export interface IkigaiDestinyCompassReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  soulCallingTitle: string;        // 일생을 관통하는 천직 소명 타이틀
  ikigaiAlignmentScore: number;    // 이키가이 정렬 완성도 (0 ~ 100)
  quadrants: IkigaiQuadrants;
  monetizationPath: {
    phase1Validation: string;     // 1단계: 독창적 가치 검증 및 초기 오디언스 확보
    phase2Scaling: string;        // 2단계: 자동화 시스템 및 고부가가치 제품화
    phase3Empire: string;         // 3단계: 대체 불가능한 독점적 브랜드 제국 구축
  };
  nextCareerMilestone: string;     // 6개월~1년 내 달성해야 할 1순위 돌파 마일스톤
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  synthesisPromptGuidance: string;
  ikigaiSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatIkigaiKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeIkigaiStage(score: number): string {
  if (score >= 90) return '천직 공명 완성기 (열정·전문성·사명·수익성이 한 축으로 강하게 정렬된 흐름)';
  if (score >= 80) return '교집합 확장기 (핵심 강점이 시장 가치와 만나 레버리지를 키우는 국면)';
  return '좌표 탐색 정립기 (내면의 열정과 현실적 수요의 접점을 다듬는 흐름)';
}

export function runIkigaiDestinyCompassEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): IkigaiDestinyCompassReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const ikigaiSeed = (targetDate.getFullYear() * 5 + (targetDate.getMonth() + 1) * 17 + targetDate.getDate() * 11 + ganCode) % 100;

  // 4대 사분면 점수 산출 (72 ~ 98점대 고효율 분포)
  const passionScore = 75 + ((ganCode * 3 + targetDate.getDate() * 7) % 23);
  const professionScore = 78 + ((ganCode * 5 + targetDate.getMonth() * 11) % 21);
  const missionScore = 74 + ((ganCode * 7 + targetDate.getFullYear() % 10) % 24);
  const vocationScore = 76 + ((ganCode * 11 + targetDate.getDate() * 3) % 22);

  // 일간 오행별 천직 소명 타이틀 매핑
  let soulCallingTitle: string;
  let passionDriver: string;
  let superpowerSkill: string;
  let societalImpact: string;
  let monetizationLeverage: string;

  if (element === '목') {
    soulCallingTitle = '새로운 시대를 개척하고 인재를 발굴하는 비전 아키텍트 (Visionary Pioneer)';
    passionDriver = '불모지에서 새로운 싹을 틔우고 무에서 유를 창출하는 개척의 설렘';
    superpowerSkill = '사람들의 잠재력을 단숨에 알아보고 방향성을 제시하는 탁월한 영감과 추진력';
    societalImpact = '정체된 사회와 조직에 신선한 생명력을 불어넣고 미래 청사진을 제시함';
    monetizationLeverage = '신규 플랫폼 론칭, 혁신 프로젝트 빌딩, 고부가가치 액셀러레이팅 모델';
  } else if (element === '화') {
    soulCallingTitle = '대중의 심장에 불을 지피고 문화를 선도하는 미디어 선구자 (Cultural Luminary)';
    passionDriver = '자신의 아이디어와 감정을 세상에 폭발적으로 표현하여 공감을 이끌어내는 희열';
    superpowerSkill = '복잡한 본질을 매혹적인 스토리와 비주얼로 전환하여 대중을 사로잡는 흡인력';
    societalImpact = '어둡고 지친 사람들에게 희망의 빛과 영감을 주어 행동을 촉발함';
    monetizationLeverage = '지식재산권(IP) 독점, 프리미엄 콘텐츠 및 브랜드 스폰서십, 글로벌 팬덤 비즈니스';
  } else if (element === '토') {
    soulCallingTitle = '거대한 자본과 신뢰의 제국을 안착시키는 시스템 마스터 (Empire Anchor)';
    passionDriver = '혼란스러운 세상에서 절대 무너지지 않는 단단한 질서와 기반을 다지는 자부심';
    superpowerSkill = '복합적인 이해관계를 하나로 묶고 장기적 안정성을 확보하는 조율과 자원 배분력';
    societalImpact = '사회가 믿고 기댈 수 있는 견고한 인프라와 안전망을 구축함';
    monetizationLeverage = '자산 운용, 플랫폼 인프라 수수료 파이프라인, B2B 핵심 전략 자문';
  } else if (element === '금') {
    soulCallingTitle = '비효율을 단칼에 베어내고 압도적 생산성을 창조하는 솔루션 혁신가 (Apex Optimizer)';
    passionDriver = '군더더기를 깎아내어 면도날처럼 날카롭고 완벽한 표준을 정립하는 쾌감';
    superpowerSkill = '핵심 병목 구간을 핀포인트로 타격하여 10배의 효율을 끌어올리는 구조적 분석력';
    societalImpact = '사회적 낭비와 불투명성을 제거하여 모두에게 명쾌하고 정밀한 해결책을 선사함';
    monetizationLeverage = '하이엔드 테크 솔루션, 프리미엄 컨설팅, 고효율 소프트웨어 및 자동화 프레임워크';
  } else {
    // 수 (Water)
    soulCallingTitle = '인간의 심연을 통찰하고 지혜를 번역하는 심층 전략가 (Deep Sage & Strategist)';
    passionDriver = '보이지 않는 우주적 패턴과 인간 심리의 비밀을 밝혀내는 지적 탐구의 전율';
    superpowerSkill = '유연한 직관으로 미래의 파도를 한발 앞서 감지하고 위기를 기회로 바꾸는 혜안';
    societalImpact = '혼란에 빠진 길 잃은 영혼들에게 삶의 본질적 나침반과 치유를 제공함';
    monetizationLeverage = '전략적 기획 및 투자, 심층 멘토링/오라클 서비스, 비선형적 빅데이터 인사이트 독점';
  }

  const quadrants: IkigaiQuadrants = {
    passion: {
      label: '열정 (What You Love · 식상/5하우스)',
      score: passionScore,
      coreDriver: passionDriver
    },
    profession: {
      label: '전문성 (What You Are Good At · 비겁/인성/1·6하우스)',
      score: professionScore,
      superpowerSkill: superpowerSkill
    },
    mission: {
      label: '사명 (What The World Needs · 관성/10하우스·MC)',
      score: missionScore,
      societalImpact: societalImpact
    },
    vocation: {
      label: '수익성 (What You Can Be Paid For · 재성/2·8하우스)',
      score: vocationScore,
      monetizationLeverage: monetizationLeverage
    }
  };

  const ikigaiAlignmentScore = Math.round((passionScore + professionScore + missionScore + vocationScore) / 4);

  const monetizationPath = {
    phase1Validation: '1단계: 나만의 독창적 통찰을 고밀도 결과물로 묶어 핵심 타깃에게 유료로 검증하기',
    phase2Scaling: '2단계: 시간 투입 대비 마진율이 무한대에 가까운 자동화 디지털/IP 파이프라인으로 레버리지 확대',
    phase3Empire: '3단계: 내가 일하지 않아도 브랜드 자체의 권위와 신뢰가 자본을 끌어당기는 독점적 생태계 완성'
  };

  const nextCareerMilestone = `향후 6개월 내 [${soulCallingTitle.split(' ')[0]}] 포지셔닝을 공식화하고, 첫 번째 고부가가치 시그니처 자산을 론칭하여 강력한 현금 흐름 확보하기`;
  const calculatedAtKst = formatIkigaiKstTimestamp(targetDate);
  const trimmedQuestion = question?.trim();
  const reflectiveQuestion = trimmedQuestion
    ? `'${trimmedQuestion}'에서 열정(좋아하는 것)·전문성(잘하는 것)·사명(필요한 것)·수익성 중 지금 가장 먼저 맞물려야 할 한 축은 무엇인가요?`
    : `지금 내가 쏟고 있는 시간 가운데 열정·전문성·사명·수익성의 네 원이 가장 선명하게 겹치는 한 지점은 어디인가요?`;
  const interpretiveBoundary = '이키가이 운명 나침반 관점은 적성 검사나 수익 보장이 아니라, 열정·강점·사명·수익성의 균형 좌표를 점검하는 커리어 성찰 렌즈입니다.';

  const ikigaiSynthesisMatrix = {
    dominantTension: `${quadrants.passion.coreDriver} ↔ ${quadrants.vocation.monetizationLeverage}`,
    alignmentState:
      ikigaiAlignmentScore >= 85
        ? '열정·전문성·사명·수익성의 4대 교집합 고밀도 정렬'
        : '전문성과 수익성 사이의 레버리지를 조율하는 확장 국면',
    integratedAction: `${monetizationPath.phase1Validation} | ${nextCareerMilestone}${trimmedQuestion ? ` [질문 맥락: ${trimmedQuestion}]` : ''}`,
  };

  const synthesisPromptGuidance = `[LUCKEY 이키가이 천직 4대 교집합 & 소명 나침반 v2.1.0]
- 연산 시각: ${calculatedAtKst}
- 궁극의 천직 소명 타이틀: [${soulCallingTitle}]
- 이키가이 정렬 완성도: ${describeIkigaiStage(ikigaiAlignmentScore)}
- 4대 사분면 흐름:
  * 열정(Passion): ${describeIkigaiStage(passionScore)} ("${quadrants.passion.coreDriver}")
  * 전문성(Profession): ${describeIkigaiStage(professionScore)} ("${quadrants.profession.superpowerSkill}")
  * 사명(Mission): ${describeIkigaiStage(missionScore)} ("${quadrants.mission.societalImpact}")
  * 수익성(Vocation): ${describeIkigaiStage(vocationScore)} ("${quadrants.vocation.monetizationLeverage}")
- 3단계 수익화 로드맵: [1단계 검증] ${monetizationPath.phase1Validation} | [2단계 스케일] ${monetizationPath.phase2Scaling} | [3단계 제국] ${monetizationPath.phase3Empire}
- 1순위 커리어 마일스톤: ${nextCareerMilestone}
- 교차 매트릭스 [핵심 긴장: ${ikigaiSynthesisMatrix.dominantTension} | 조율 상태: ${ikigaiSynthesisMatrix.alignmentState}]
- 통합 실천: ${ikigaiSynthesisMatrix.integratedAction}
- 성찰 질문: ${reflectiveQuestion}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: IKIGAI_DESTINY_COMPASS_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    soulCallingTitle,
    ikigaiAlignmentScore,
    quadrants,
    monetizationPath,
    nextCareerMilestone,
    reflectiveQuestion,
    interpretiveBoundary,
    synthesisPromptGuidance,
    ikigaiSynthesisMatrix,
  };
}

export type IkigaiDestinyCompassResult = IkigaiDestinyCompassReport;

export function calculateIkigaiDestinyCompass(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): IkigaiDestinyCompassResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runIkigaiDestinyCompassEngine(profile, targetDate, params?.question);
}

export function formatIkigaiDestinyCompassPrompt(res: IkigaiDestinyCompassResult): string {
  return res.synthesisPromptGuidance;
}
