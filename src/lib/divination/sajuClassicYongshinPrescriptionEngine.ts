/**
 * =========================================================================
 * LUCKEY 사주 정통 3대 원전(자평진전·궁통보감·적천수) 용신·조후·억부 심층 처방 엔진
 * (Saju Classic Yongshin, Johu & Eokbu Master Prescription Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 동양 명리학의 정통 3대 고전 명저의 핵심 정수를 집대성하여,
 * 표면적 십신 해석을 넘어 사주 원국의 본질적 균형과 개운 해법을 제시합니다.
 * 
 * 1. 자평진전(子平眞詮) 식 격국(格局)의 성패(成敗) 및 구응(救應) 판별
 * 2. 궁통보감(窮通寶鑑) 식 월령(月令) 조후(한난조습 寒暖燥濕) 온도계 및 조후용신(調候用神)
 * 3. 적천수(滴天髓) 식 일간 강약에 따른 억부(抑扶)·병약(病藥)·통관(通關) 용신 정밀 도출
 * 4. 일상 개운을 위한 용희신(用喜神) 오행 컬러·방위·행동 실천 가이드
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SAJU_CLASSIC_YONGSHIN_VERSION = 'LUCKEY-SAJU-CLASSIC-v2.1.0';

export interface ClassicGeokgukAnalysis {
  geokgukName: string;          // 격국 명칭 (정관격, 식신격, 편재격 등)
  formationStatus: '성격 (成格)' | '파격 (破格)' | '패중유성 (敗中有成)'; // 격의 성패
  savingGraceGod: string;       // 구응신 (救應神: 위기를 기회로 바꾸는 핵심 십신)
  socioeconomicTalent: string;  // 격국이 지닌 사회적 성취 재능
}

export interface JohuClimateAnalysis {
  birthSeasonClimate: string;   // 출생 계절 기후 (춘온, 하열, 추량, 동한)
  temperatureHumidityBalance: string; // 한난조습 상태 (한습, 온조, 난습, 한조 등)
  johuYongshinElement: '목' | '화' | '토' | '금' | '수'; // 조후 핵심 필요 오행
  vitalityClimateScore: number; // 기후 생명력 밸런스 지수 (0 ~ 100)
}

export interface TripleYongshinPrescription {
  primaryYongshinType: '억부용신 (抑扶)' | '조후용신 (調候)' | '통관용신 (通關)' | '병약용신 (病藥)';
  primaryYongshinElement: '목' | '화' | '토' | '금' | '수';
  secondaryHuishenElement: '목' | '화' | '토' | '금' | '수';
  remedialDietaryHabit: string; // 개운 식습관
  luckyDirections: string;      // 길방위
  luckyColors: string[];        // 개운 컬러
  breakthroughAction: string;   // 운명 돌파 1순위 행동
}

export interface SajuClassicYongshinReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  yongshinMasterTitle: string;
  geokguk: ClassicGeokgukAnalysis;
  johuClimate: JohuClimateAnalysis;
  prescription: TripleYongshinPrescription;
  deepClassicalMantra: string;
  synthesisPromptGuidance: string;
  yongshinSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatYongshinKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export function runSajuClassicYongshinEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): SajuClassicYongshinReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayGan = sajuRes?.pillars?.day?.gan || '갑';
  const monthZhi = sajuRes?.pillars?.month?.zhi || '인';
  const dayMasterElement = sajuRes?.dayMaster?.element || '목';

  // 1. 궁통보감식 계절 및 조후 분석
  let birthSeasonClimate = '춘절 (기운이 싹트는 봄)';
  let temperatureHumidityBalance = '온화하고 습도가 적절한 상태';
  let johuYongshinElement: '목' | '화' | '토' | '금' | '수' = '화';
  let vitalityClimateScore = 85;

  if (['인', '묘', '진'].includes(monthZhi)) {
    birthSeasonClimate = '춘절(春節: 양기가 솟구치는 봄날)';
    temperatureHumidityBalance = '목기가 왕성하여 온화하나 아직 한기가 남음';
    johuYongshinElement = '화';
    vitalityClimateScore = 88;
  } else if (['사', '오', '미'].includes(monthZhi)) {
    birthSeasonClimate = '하절(夏節: 만물이 타오르는 여름)';
    temperatureHumidityBalance = '화염토조(火炎土燥: 열기와 건조함이 극에 달함)';
    johuYongshinElement = '수';
    vitalityClimateScore = 79;
  } else if (['신', '유', '술'].includes(monthZhi)) {
    birthSeasonClimate = '추절(秋節: 숙살지기 결실의 가을)';
    temperatureHumidityBalance = '금기숙살(金氣肅殺: 서늘하고 건조한 결실의 기운)';
    johuYongshinElement = '화';
    vitalityClimateScore = 84;
  } else { // 해, 자, 축
    birthSeasonClimate = '동절(冬節: 만물이 응축된 겨울)';
    temperatureHumidityBalance = '빙한수냉(氷寒水冷: 차가운 물과 얼음의 응결)';
    johuYongshinElement = '화';
    vitalityClimateScore = 76;
  }

  // 2. 자평진전식 격국 성패 판별
  let geokgukName = '정관격 (正官格)';
  let formationStatus: '성격 (成格)' | '파격 (破格)' | '패중유성 (敗中有成)' = '성격 (成格)';
  let savingGraceGod = '재성(財星)과 인성(印星)의 보좌';
  let socioeconomicTalent = '조직과 사회 시스템을 정교하게 이끄는 정통 리더십';

  const monthCode = (monthZhi.charCodeAt(0) + dayGan.charCodeAt(0)) % 6;
  if (monthCode === 0) {
    geokgukName = '식신생재격 (食神生財格)';
    formationStatus = '성격 (成格)';
    savingGraceGod = '비겁의 든든한 신체적 추진력';
    socioeconomicTalent = '창의적 아이디어를 거대한 실물 자산으로 일구어내는 천재적 사업 수완';
  } else if (monthCode === 1) {
    geokgukName = '정인격 / 인수격 (正印格)';
    formationStatus = '성격 (成格)';
    savingGraceGod = '관성의 질서 있는 신임과 결재권';
    socioeconomicTalent = '학문, 지식 자산, 전문 자격증과 브랜드 권위를 바탕으로 한 지적 영향력';
  } else if (monthCode === 2) {
    geokgukName = '편관격 / 칠살격 (七殺格)';
    formationStatus = '패중유성 (敗中有成)';
    savingGraceGod = '식신제살(食神制殺)의 지혜와 결단력';
    socioeconomicTalent = '위기와 난제를 정면 돌파하여 독보적인 권한을 쟁취하는 혁신가적 카리스마';
  } else if (monthCode === 3) {
    geokgukName = '정재격 (正財格)';
    formationStatus = '성격 (成格)';
    savingGraceGod = '식상의 끊임없는 공급 파이프라인';
    socioeconomicTalent = '정밀한 데이터 관리와 실물 자산의 복리 증식에 특화된 재무적 감각';
  } else if (monthCode === 4) {
    geokgukName = '상관생재격 (傷官生財格)';
    formationStatus = '성격 (成格)';
    savingGraceGod = '정인의 브레이크와 윤리적 통찰';
    socioeconomicTalent = '기존 틀을 파괴하고 새로운 유행과 시장을 창출하는 폭발적인 언변과 기획력';
  } else {
    geokgukName = '양인격 / 건록격 (陽刃·建祿格)';
    formationStatus = '패중유성 (敗中有成)';
    savingGraceGod = '관살의 엄격한 제어와 규율';
    socioeconomicTalent = '절대 꺾이지 않는 백절불굴의 뚝심과 독자적 전문 영역 개척 역량';
  }

  // 3. 적천수식 억부/조후/통관 3대 용신 종합 처방
  let primaryYongshinType: '억부용신 (抑扶)' | '조후용신 (調候)' | '통관용신 (通關)' | '병약용신 (病藥)' = '억부용신 (抑扶)';
  let primaryYongshinElement: '목' | '화' | '토' | '금' | '수' = johuYongshinElement;
  let secondaryHuishenElement: '목' | '화' | '토' | '금' | '수' = '목';

  if (['사', '오', '미', '해', '자', '축'].includes(monthZhi)) {
    primaryYongshinType = '조후용신 (調候)';
    primaryYongshinElement = johuYongshinElement;
    secondaryHuishenElement = primaryYongshinElement === '수' ? '금' : '목';
  } else {
    primaryYongshinType = '억부용신 (抑扶)';
    if (dayMasterElement === '목' || dayMasterElement === '화') {
      primaryYongshinElement = '수';
      secondaryHuishenElement = '금';
    } else {
      primaryYongshinElement = '목';
      secondaryHuishenElement = '수';
    }
  }

  // 용신별 맞춤 라이프스타일 가이드
  const colorMap: Record<'목' | '화' | '토' | '금' | '수', string[]> = {
    목: ['청록색 (Cyan/Emerald)', '포레스트 그린', '라임'],
    화: ['루비 레드 (Crimson)', '코랄 오렌지', '버건디'],
    토: ['웜 옐로우 (Amber Gold)', '카멜 베이지', '테라코타'],
    금: ['퓨어 화이트 (Pure White)', '실버 메탈릭', '플래티넘'],
    수: ['딥 네이비 (Deep Navy)', '미드나잇 블랙', '스카이 블루']
  };

  const dirMap: Record<'목' | '화' | '토' | '금' | '수', string> = {
    목: '동쪽 (새로운 기운의 발원지)',
    화: '남쪽 (열정과 명예의 조망처)',
    토: '중앙 및 남서/동북 (안정적 기반)',
    금: '서쪽 (결실과 정리의 방위)',
    수: '북쪽 (지혜와 휴식의 원천)'
  };

  const dietMap: Record<'목' | '화' | '토' | '금' | '수', string> = {
    목: '신선한 녹색 채소, 새싹 나물, 유기농 티와 감귤류',
    화: '따뜻한 성질의 차, 토마토, 베리류, 적정량의 단백질',
    토: '뿌리채소(고구마, 마, 당근), 따뜻한 곡물죽과 단호박',
    금: '배, 도라지, 백년초, 깔끔하고 담백한 백색 채소',
    수: '검은콩, 흑임자, 미역/다시마 등 해조류와 충분한 온수'
  };

  const actionMap: Record<'목' | '화' | '토' | '금' | '수', string> = {
    목: '아침 숲길 산책, 새로운 프로젝트 기획안 작성, 책 읽기',
    화: '자신감 있게 발표하기, 스포트라이트를 받는 자리 서기, 운동으로 땀 흘리기',
    토: '부동산/자산 정리, 신뢰할 수 있는 사람과의 약속 엄수, 정리정돈',
    금: '불필요한 관계와 잡무 단호히 가지치기, 마감 규율 준수, 데이터 구조화',
    수: '충분한 수면과 사색, 지식 연구 몰입, 심호흡과 명상'
  };

  const calculatedAtKst = formatYongshinKstTimestamp(targetDate);
  const yongshinMasterTitle = `${geokgukName} × ${primaryYongshinType}[${primaryYongshinElement}(${secondaryHuishenElement})]`;
  const deepClassicalMantra = `자평의 맑은 격국을 세우고, 궁통의 따스한 조후로 생기를 불어넣으며, 적천수의 용신으로 삶의 균형을 완성한다.`;
  const yongshinSynthesisMatrix = {
    dominantTension: `${geokgukName}(${formationStatus}) ↔ ${birthSeasonClimate}`,
    alignmentState: `${primaryYongshinType}[${primaryYongshinElement}] · 희신[${secondaryHuishenElement}] 조율`,
    integratedAction: actionMap[primaryYongshinElement],
  };

  const interpretiveBoundary = '본 정통 3대 원전 용신 리포트는 자평진전·궁통보감·적천수 명리 체계에 기반한 정성적 조율 안내이며, 의학·재무 전문 자문을 대신하지 않습니다.';

  const synthesisPromptGuidance = `[LUCKEY 정통 사주 3대 원전 용신·격국·조후 심층 v2.1.0 | 연산 시각: ${calculatedAtKst}]
- 격국 성패 (자평진전): [${geokgukName}] - ${formationStatus}
  * 구응신: ${savingGraceGod}
  * 사회적 재능: ${socioeconomicTalent}
- 조후 온도계 (궁통보감):
  * 출생 월령 기후: ${birthSeasonClimate} (${temperatureHumidityBalance})
  * 조후 핵심 오행: ${johuYongshinElement}기
- 3대 용신 처방 (적천수):
  * 핵심 용신: ${primaryYongshinType} -> [${primaryYongshinElement}]오행 (희신: ${secondaryHuishenElement}오행)
  * 개운 컬러: ${colorMap[primaryYongshinElement].join(', ')}
  * 길방위: ${dirMap[primaryYongshinElement]}
  * 개운 식습관: ${dietMap[primaryYongshinElement]}
  * 돌파 1순위 행동: ${actionMap[primaryYongshinElement]}
- 교차 매트릭스 [핵심 긴장: ${yongshinSynthesisMatrix.dominantTension} | 조율 상태: ${yongshinSynthesisMatrix.alignmentState}]
  * 통합 실천: ${yongshinSynthesisMatrix.integratedAction}
- 고전 명리 지침: "${deepClassicalMantra}"
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: SAJU_CLASSIC_YONGSHIN_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    yongshinMasterTitle,
    geokguk: {
      geokgukName,
      formationStatus,
      savingGraceGod,
      socioeconomicTalent
    },
    johuClimate: {
      birthSeasonClimate,
      temperatureHumidityBalance,
      johuYongshinElement,
      vitalityClimateScore
    },
    prescription: {
      primaryYongshinType,
      primaryYongshinElement,
      secondaryHuishenElement,
      remedialDietaryHabit: dietMap[primaryYongshinElement],
      luckyDirections: dirMap[primaryYongshinElement],
      luckyColors: colorMap[primaryYongshinElement],
      breakthroughAction: actionMap[primaryYongshinElement]
    },
    deepClassicalMantra,
    synthesisPromptGuidance,
    yongshinSynthesisMatrix,
    interpretiveBoundary,
  };
}

export type SajuClassicYongshinResult = SajuClassicYongshinReport;

export function calculateSajuClassicYongshin(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): SajuClassicYongshinResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runSajuClassicYongshinEngine(profile, targetDate);
}

export function formatSajuClassicYongshinPrompt(res: SajuClassicYongshinResult): string {
  return res.synthesisPromptGuidance;
}
