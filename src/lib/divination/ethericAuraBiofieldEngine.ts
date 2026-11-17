/**
 * =========================================================================
 * LUCKEY 에테르 오라 생체장 & 전자기장 쉴딩 엔진
 * (Etheric Aura Biofield & Electromagnetic Shielding Engine)
 * =========================================================================
 *
 * 인간의 7대 미묘체(Subtle Energy Bodies)와 생체광자(Biophoton) 방출장,
 * 사주 오행의 기운 성쇠를 결합해 오라 색채, 질문 맥락 정성 감사, KST 생체장 리듬을 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const ETHERIC_AURA_VERSION = 'LUCKEY-ETHERIC-AURA-v2.2.0';

export interface AuraLayerSpectrum {
  primaryLayerName: string;
  primaryColor: string;
  harmonicSecondaryColor: string;
  wavelengthQuality: string;
}

export interface BiofieldShieldingDiagnosis {
  integrityScore: number;        // 생체장 무결성 지수 (내부 연산용)
  vulnerableZone: string;
  shieldingAffirmation: string;
  visualizationShieldRitual: string;
}

export interface AuraSituationalAudit {
  drainTrigger: string;
  shieldPriority: string;
  groundingPrescription: string;
  boundaryWarning: string;
}

export interface AuraTemporalRhythm {
  kstHour: number;
  biofieldWindow: string;
  seasonalElementBalance: string;
  careDirective: string;
  shieldTempo: '방어활성' | '균형유지' | '심층복원';
}

export interface AuraSynthesisMatrix {
  integrityGrade: '견고' | '안정' | '보강필요';
  spectrumShieldLink: string;
  nextShieldingStep: string;
}

export interface EthericAuraBiofieldReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  auraBiofieldTitle: string;
  spectrum: AuraLayerSpectrum;
  shielding: BiofieldShieldingDiagnosis;
  situationalAuraAudit: AuraSituationalAudit;
  temporalAuraRhythm: AuraTemporalRhythm;
  auraSynthesisMatrix: AuraSynthesisMatrix;
  dailyAuraCareGuidance: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  synthesisPromptGuidance: string;
}

function getKstAuraParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  return {
    hour: Number(parts.find((p) => p.type === 'hour')?.value || '12') % 24,
    month: Number(parts.find((p) => p.type === 'month')?.value || '1'),
  };
}

function buildAuraSituationalAudit(question: string, primaryColor: string, vulnerableZone: string): AuraSituationalAudit {
  const q = question.toLowerCase();
  if (/사람|관계|감정|갈등|직장|동료|피곤/.test(q)) {
    return {
      drainTrigger: '타인의 감정 파동 과잉 수용 및 경계 이완',
      shieldPriority: `${primaryColor} 반투과 결계로 공감은 유지하되 소모는 차단`,
      groundingPrescription: `대화를 마친 직후 ${vulnerableZone} 주변의 긴장을 호흡으로 풀어내고 1분간 손목과 목덜미를 가볍게 식혀주십시오.`,
      boundaryWarning: '상대의 기분 변화를 내 책임으로 떠안으며 에너지를 누수시키지 마십시오.',
    };
  }
  if (/건강|잠|피로|불안|휴식|회복/.test(q)) {
    return {
      drainTrigger: '과도한 전자기기 자극과 수면 리듬 불균형',
      shieldPriority: '에테르체 재생 및 자율신경 이완',
      groundingPrescription: '잠들기 30분 전 화면 빛을 줄이고 복부 단전에 따뜻한 손바닥을 올려 생체장 밀도를 복원하십시오.',
      boundaryWarning: '지친 상태에서 억지로 각성 상태를 유지하면 오라 경계가 얇아집니다.',
    };
  }
  return {
    drainTrigger: '분산된 주의력과 미세한 외부 소음',
    shieldPriority: `${primaryColor} 중심축 정렬 및 ${vulnerableZone} 보호`,
    groundingPrescription: '바른 자세로 깊게 세 번 호흡하며 내 몸 안팎의 에너지 경계를 선명하게 자각하십시오.',
    boundaryWarning: '사소한 자극마다 즉시 반응하며 생체장 에너지를 흩뜨리지 마십시오.',
  };
}

function buildAuraTemporalRhythm(now: Date): AuraTemporalRhythm {
  const { hour, month } = getKstAuraParts(now);

  let biofieldWindow = '아침 프라나 충전 창';
  let shieldTempo: AuraTemporalRhythm['shieldTempo'] = '방어활성';
  let careDirective = '외부 일정을 시작하기 전 호흡으로 빛의 결계를 먼저 세우기 좋은 시간입니다.';

  if (hour >= 5 && hour < 10) {
    biofieldWindow = '여명 생체광자 충전 창 (05~10시)';
    shieldTempo = '방어활성';
    careDirective = '맑은 공기와 자연광을 10분 이상 접하며 오늘의 오라 보호막을 활성화하십시오.';
  } else if (hour >= 10 && hour < 17) {
    biofieldWindow = '주간 전자기장 방어 유지 창 (10~17시)';
    shieldTempo = '균형유지';
    careDirective = '업무와 대인 접촉이 잦은 시간대이므로 틈틈이 어깨와 호흡을 풀어 에너지 누수를 막으십시오.';
  } else if (hour >= 17 && hour < 21) {
    biofieldWindow = '황혼 감정 정화 창 (17~21시)';
    shieldTempo = '균형유지';
    careDirective = '낮 동안 묻은 타인의 감정 잔여물을 가벼운 산책이나 샤워로 씻어내기 좋습니다.';
  } else {
    biofieldWindow = '심야 에테르체 심층 복원 창 (21~05시)';
    shieldTempo = '심층복원';
    careDirective = '외부 자극을 닫고 깊은 수면 속에서 생체장 무결성을 자연 복원할 시간입니다.';
  }

  let seasonalElementBalance = '봄 청량 목기 조율절';
  if (month >= 3 && month <= 5) seasonalElementBalance = '봄 · 목(木) 기운 확장 및 호흡 개방절';
  else if (month >= 6 && month <= 8) seasonalElementBalance = '여름 · 화(火) 기운 과열 방지 및 수분 보호절';
  else if (month >= 9 && month <= 11) seasonalElementBalance = '가을 · 금(金) 기운 정돈 및 경계 강화절';
  else seasonalElementBalance = '겨울 · 수(水) 기운 보온 및 단전 응축절';

  return {
    kstHour: hour,
    biofieldWindow,
    seasonalElementBalance,
    careDirective,
    shieldTempo,
  };
}

export function runEthericAuraBiofieldEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question: string = ''
): EthericAuraBiofieldReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '병';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '오';
  const element = sajuRes?.dayMaster?.element || '화';

  const code = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + targetDate.getDate();

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

  const integrityScore = 78 + (code % 21);
  const auraBiofieldTitle = `${primaryColor} × ${primaryLayerName}`;
  const shieldingAffirmation = `내 몸을 둘러싼 생체 오라장은 황금빛과 ${primaryColor}의 찬란한 빛으로 완전하게 보호되며, 오직 사랑과 조화의 파동만이 통과한다.`;
  const visualizationShieldRitual = `눈을 감고 척추를 세운 뒤, 숨을 들이마실 때마다 백회혈에서 ${primaryColor}의 고밀도 빛 캡슐이 온몸 360도로 1m 두께의 돔형 결계를 형성하는 모습을 3회 깊게 시각화하세요.`;
  const dailyAuraCareGuidance = `현재 오라 필드의 취약 지점은 [${vulnerableZone}]입니다. 부정적인 타인의 감정이나 전자기기 블루라이트 흡수를 차단하기 위해 쉴딩 결계를 활성화하고 신선한 자연광을 10분 이상 쬐어주세요.`;

  const situationalAuraAudit = buildAuraSituationalAudit(question, primaryColor, vulnerableZone);
  const temporalAuraRhythm = buildAuraTemporalRhythm(targetDate);

  const integrityGrade: AuraSynthesisMatrix['integrityGrade'] =
    integrityScore >= 90 ? '견고' : integrityScore >= 82 ? '안정' : '보강필요';
  const spectrumShieldLink = `${primaryLayerName}(${primaryColor})의 파동이 ${temporalAuraRhythm.biofieldWindow} 리듬과 맞물려 작동합니다.`;
  const nextShieldingStep = `${situationalAuraAudit.groundingPrescription}`;

  const auraSynthesisMatrix: AuraSynthesisMatrix = {
    integrityGrade,
    spectrumShieldLink,
    nextShieldingStep,
  };

  const kst = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const interpretiveBoundary = '본 에테르 오라 생체장 리포트는 오행·명상 원형에 기반한 정성적 자기 돌봄 안내이며, 의학적 진단이나 전자기장 측정을 대신하지 않습니다.';

  const synthesisPromptGuidance = `[LUCKEY 에테르 오라 생체장 & 쉴딩 v2.1.0]
- 기준 시각(KST): ${calculatedAtKst}
- 오라 생체장 스펙트럼: [${auraBiofieldTitle}]
  * 주 활성 층위: ${primaryLayerName}
  * 주 발광 색채: ${primaryColor}
  * 보조 조화 색상: ${harmonicSecondaryColor}
  * 에너지 파동 특성: ${wavelengthQuality}
- 생체장 무결성 & 쉴딩 진단:
  * 결계 상태: ${integrityGrade}
  * 누수 취약 구역: ${vulnerableZone}
  * 결계 시각화 리추얼: ${visualizationShieldRitual}
- 질문 맥락 감사: 누수 요인(${situationalAuraAudit.drainTrigger}) · 우선 쉴드(${situationalAuraAudit.shieldPriority})
  * 그라운딩 처방: ${situationalAuraAudit.groundingPrescription}
  * 경계 주의: ${situationalAuraAudit.boundaryWarning}
- KST 시공간 리듬 (${temporalAuraRhythm.kstHour}시): ${temporalAuraRhythm.biofieldWindow} · ${temporalAuraRhythm.seasonalElementBalance} (${temporalAuraRhythm.shieldTempo})
  * 시간대 지침: ${temporalAuraRhythm.careDirective}
- 오라 교차 매트릭스: ${spectrumShieldLink}
- 오라 보호 확언: "${shieldingAffirmation}"
- 해석 경계: ${interpretiveBoundary}`;

  const ritualAction = `${visualizationShieldRitual} · ${situationalAuraAudit.groundingPrescription}`;
  const reflectionFocus = question.trim()
    ? `‘${question.trim()}’ 상황에서 ${vulnerableZone}의 에너지 누수를 막기 위해 오늘 내가 세울 가장 분명한 경계는 무엇입니까?`
    : `[${primaryColor}] 오라 결계의 ${integrityGrade} 상태에서 오늘 가장 먼저 보호해야 할 나의 감각과 공간은 어디입니까?`;

  return {
    engineVersion: ETHERIC_AURA_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
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
    situationalAuraAudit,
    temporalAuraRhythm,
    auraSynthesisMatrix,
    dailyAuraCareGuidance,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    synthesisPromptGuidance
  };
}

export type EthericAuraBiofieldResult = EthericAuraBiofieldReport;

export function calculateEthericAuraBiofield(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): EthericAuraBiofieldResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  const question = params?.question || '';
  return runEthericAuraBiofieldEngine(profile, targetDate, question);
}

export function formatEthericAuraBiofieldPrompt(res: EthericAuraBiofieldResult): string {
  return res.synthesisPromptGuidance;
}
