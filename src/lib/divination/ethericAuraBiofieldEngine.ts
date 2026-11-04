/**
 * =========================================================================
 * LUCKEY 에테르 오라 생체장 & 전자기장 쉴딩 엔진
 * (Etheric Aura Biofield & Electromagnetic Shielding Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 인간의 7대 미묘체(Subtle Energy Bodies)와 생체광자(Biophoton) 방출장,
 * 킬리안 사진술(Kirlian Photography) 전자기 오라 색채 스펙트럼 원리를
 * 사주 오행의 기운 성쇠 및 십신 에너지 동역학과 융합한 결정론적 오라 진단 엔진입니다.
 * 
 * 1. 7대 미묘체 층위(Layer) 및 주/보조 오라 색채(Aura Hues) 스펙트럼 도출
 * 2. 오라 무결성 지수(Aura Integrity Score: 0~100) 및 전자기장 누수(Biofield Leak) 취약점 진단
 * 3. 180초 에테르 쉴딩 결계 시각화 및 생체 에너지 보호 리추얼 처방
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const ETHERIC_AURA_VERSION = 'LUCKEY-ETHERIC-AURA-v1.0.0';

export interface AuraLayerSpectrum {
  primaryLayerName: string;      // 주 활성 오라 층위 (에테르체, 아스트랄체, 멘탈체 등)
  primaryColor: string;          // 주 오라 색채 (인디고, 골든 옐로우, 에메랄드 등)
  harmonicSecondaryColor: string;// 보조 조화 색채
  wavelengthQuality: string;     // 파동 및 발광 상태 (생동감, 안정, 확장 등)
}

export interface BiofieldShieldingDiagnosis {
  integrityScore: number;        // 생체장 무결성 지수 (0 ~ 100)
  vulnerableZone: string;        // 전자기장 취약/누수 우려 부위 (경추, 태양신경총 등)
  shieldingAffirmation: string;  // 쉴딩 보호 확언
  visualizationShieldRitual: string; // 180초 빛의 결계 시각화 기법
}

export interface EthericAuraBiofieldReport {
  engineVersion: string;
  calculatedAt: string;
  auraBiofieldTitle: string;
  spectrum: AuraLayerSpectrum;
  shielding: BiofieldShieldingDiagnosis;
  dailyAuraCareGuidance: string;
  synthesisPromptGuidance: string;
}

export function runEthericAuraBiofieldEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): EthericAuraBiofieldReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '병';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '오';
  const element = sajuRes?.dayMaster?.element || '화';

  const code = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + targetDate.getDate();

  // 오행별 오라 색채 및 층위 매핑
  let primaryLayerName = '에테르체 (Etheric Body)';
  let primaryColor = '에메랄드 그린 (Emerald Green)';
  let harmonicSecondaryColor = '골든 옐로우 (Golden Yellow)';
  let wavelengthQuality = '자연의 생명력과 치유의 맥동';
  let vulnerableZone = '심장 및 흉추 부위 (Heart/Thoracic)';

  if (element === '목') {
    primaryLayerName = '아스트랄 감정체 (Astral/Emotional Body)';
    primaryColor = '민트 에메랄드 (Mint Emerald)';
    harmonicSecondaryColor = '소프트 터콰이즈 (Soft Turquoise)';
    wavelengthQuality = '새싹처럼 뻗어나가는 청량한 팽창 파동';
    vulnerableZone = '목과 어깨, 간/담 경락 부위';
  } else if (element === '화') {
    primaryLayerName = '멘탈 의식체 (Mental/Radiant Body)';
    primaryColor = '루비 로즈 & 골든 오렌지 (Ruby Rose & Golden Orange)';
    harmonicSecondaryColor = '크림슨 레드 (Crimson Red)';
    wavelengthQuality = '열정과 창조적 영감이 타오르는 고광도 발광';
    vulnerableZone = '태양신경총 및 가슴 상부';
  } else if (element === '토') {
    primaryLayerName = '육체-에테르 매트릭스 (Physical-Etheric Matrix)';
    primaryColor = '웜 앰버 골드 (Warm Amber Gold)';
    harmonicSecondaryColor = '허니 옐로우 (Honey Yellow)';
    wavelengthQuality = '대지처럼 묵직하고 따스하게 감싸는 포용의 장';
    vulnerableZone = '비위 소화기계 및 단전 부위';
  } else if (element === '금') {
    primaryLayerName = '에테르 템플릿체 (Etheric Template)';
    primaryColor = '플래티넘 화이트 (Platinum White)';
    harmonicSecondaryColor = '실버 바이올렛 (Silver Violet)';
    wavelengthQuality = '다이아몬드처럼 정교하고 날카로운 명료성의 결정체';
    vulnerableZone = '후두골 및 경추, 호흡기 폐 경락';
  } else if (element === '수') {
    primaryLayerName = '천상 영체 & 인과체 (Celestial & Causal Body)';
    primaryColor = '딥 인디고 블루 (Deep Indigo Blue)';
    harmonicSecondaryColor = '코스믹 퍼플 (Cosmic Purple)';
    wavelengthQuality = '깊은 심해처럼 신비롭고 고요한 초감각 직관의 바다';
    vulnerableZone = '신장/방광 하초 및 미간 제3의 눈';
  }

  // 무결성 지수 계산 (78 ~ 98점 범위의 건강한 생체장)
  const integrityScore = 78 + (code % 21);

  const auraBiofieldTitle = `${primaryColor} × ${primaryLayerName}`;
  const shieldingAffirmation = `내 몸을 둘러싼 생체 오라장은 황금빛과 ${primaryColor}의 찬란한 빛으로 완전하게 보호되며, 오직 사랑과 조화의 파동만이 통과한다.`;
  const visualizationShieldRitual = `눈을 감고 척추를 세운 뒤, 숨을 들이마실 때마다 백회혈에서 ${primaryColor}의 고밀도 빛 캡슐이 온몸 360도로 1m 두께의 돔형 결계를 형성하는 모습을 3회 깊게 시각화하세요.`;
  const dailyAuraCareGuidance = `현재 오라 필드의 취약 지점은 [${vulnerableZone}]입니다. 부정적인 타인의 감정이나 전자기기 블루라이트 흡수를 차단하기 위해 쉴딩 결계를 활성화하고 신선한 자연광을 10분 이상 쬐어주세요.`;

  const synthesisPromptGuidance = `[LUCKEY 에테르 오라 생체장 & 쉴딩 v1.0.0]
- 오라 생체장 스펙트럼: [${auraBiofieldTitle}]
  * 주 활성 층위: ${primaryLayerName}
  * 주 발광 색채: ${primaryColor}
  * 보조 조화 색상: ${harmonicSecondaryColor}
  * 에너지 파동 특성: ${wavelengthQuality}
- 생체장 무결성 & 쉴딩 진단:
  * 오라 결계 점수: ${integrityScore}/100점
  * 누수 취약 구역: ${vulnerableZone}
  * 결계 시각화 리추얼: ${visualizationShieldRitual}
- 오라 보호 확언: "${shieldingAffirmation}"`;

  return {
    engineVersion: ETHERIC_AURA_VERSION,
    calculatedAt: targetDate.toISOString(),
    auraBiofieldTitle,
    spectrum: {
      primaryLayerName,
      primaryColor,
      harmonicSecondaryColor,
      wavelengthQuality
    },
    shielding: {
      integrityScore,
      vulnerableZone,
      shieldingAffirmation,
      visualizationShieldRitual
    },
    dailyAuraCareGuidance,
    synthesisPromptGuidance
  };
}

export type EthericAuraBiofieldResult = EthericAuraBiofieldReport;

export function calculateEthericAuraBiofield(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): EthericAuraBiofieldResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runEthericAuraBiofieldEngine(profile, targetDate);
}

export function formatEthericAuraBiofieldPrompt(res: EthericAuraBiofieldResult): string {
  return res.synthesisPromptGuidance;
}
