/**
 * =========================================================================
 * LUCKEY 오행 한난조습 & 메디컬 점성술 바이오 매트릭스 엔진
 * (Medical Bio-Matrix Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주 8자의 오행 과다·결핍과 한난조습(寒暖燥濕: 온도와 습도 밸런스),
 * 그리고 서양 메디컬 점성술(Medical Astrology)의 신체 부위 및 12경락 배속을
 * 정밀 융합하여 취약 장부, 오늘의 바이오 피로도, 맞춤 영양 및 개운 수면 리듬을
 * 100% 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  BRANCH_KOREAN,
  type SajuAnalysisResult,
  type FiveElement
} from '../sajuAnalysis';
import {
  calculateNatalChart,
  type NatalChartResult
} from '../astrologyAnalysis';

export const MEDICAL_BIO_MATRIX_VERSION = 'LUCKEY-BIO-v2.2.0';

function formatBioMatrixKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export interface OrganVulnerability {
  element: FiveElement;
  organs: string;
  hanja: string;
  meridians: string;
  status: '결핍(부족)' | '과다(울혈)' | '균형';
  riskAreas: string;
  symptoms: string;
  nutritionalTherapy: string;
}

export interface AstroMedicalFocus {
  zodiacSign: string;
  governedBodyPart: string;
  vulnerabilityReason: string;
  healingGuidance: string;
}

export interface MedicalBioMatrixResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;
  
  // 한난조습 기후 체질 (0~100)
  temperament: {
    coldScore: number;  // 寒 (냉기)
    heatScore: number;  // 暖 (열기)
    dryScore: number;   // 燥 (건조)
    dampScore: number;  // 濕 (습기)
    primaryConstitution: '한습체질(寒濕)' | '조열체질(燥熱)' | '풍한체질(風寒)' | '습열체질(濕熱)' | '중화체질(中和)';
    constitutionDesc: string;
  };

  // 오행 장부 취약도 랭킹 (주의 1, 2순위)
  vulnerableOrgans: OrganVulnerability[];
  primaryWeakness: OrganVulnerability;

  // 서양 메디컬 점성술 포인트
  astroMedical: {
    sunFocus: AstroMedicalFocus;
    moonFocus: AstroMedicalFocus;
    stressIndicator: string;
  };

  // 오늘의 바이오 컨디션 스코어 (0~100, 높을수록 생체 에너지 왕성)
  vitalityScore: number;
  fatigueRiskLevel: 'low' | 'moderate' | 'high' | 'exhaustion_warning';

  // 맞춤 건강 처방
  prescriptions: {
    recommendedFoods: string[];
    herbalTeas: string[];
    foodsToAvoid: string[];
    sleepAndRecoveryRitual: string;
    microStretchingZone: string;
  };

  summary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion?: string;
  bioMatrixSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

// 12별자리 메디컬 신체 부위 매핑
const ASTRO_BODY_PARTS: Record<string, { part: string; care: string }> = {
  aries: { part: '머리, 두뇌, 안면, 눈', care: '뇌 피로 해소, 관자놀이 마사지, 충분한 두피 쿨링' },
  taurus: { part: '목, 인후, 갑상선, 성대', care: '성대 보호, 따뜻한 차, 목도리 착용 및 온열 찜질' },
  gemini: { part: '어깨, 팔, 폐, 신경계', care: '어깨 회전 스트레칭, 심호흡, 카페인 절제' },
  cancer: { part: '위장, 흉부, 소화액', care: '과식 금지, 따뜻한 소화식, 스트레스성 위경련 완화' },
  leo: { part: '심장, 척추, 등 근육', care: '가벼운 유산소, 척추 바르게 펴기, 혈압 안정' },
  virgo: { part: '장(腸), 복부, 자율신경', care: '유산균 섭취, 복부 찜질, 소화기 디톡스' },
  libra: { part: '신장, 허리, 피부 점막', care: '미지근한 수분 보충, 허리 코어 운동, 피부 보습' },
  scorpio: { part: '생식기, 비뇨기, 배설계', care: '면역력 증강, 하복부 보온, 독소 배출' },
  sagittarius: { part: '둔부, 허벅지, 간(肝), 좌골신경', care: '음주 절제, 허벅지 대근육 스트레칭, 야외 걷기' },
  capricorn: { part: '무릎, 뼈, 관절, 치아, 피부', care: '칼슘·비타민D 섭취, 관절 무리 방지, 자세 교정' },
  aquarius: { part: '정강이, 발목, 말초 혈액순환', care: '발목 스트레칭, 혈액순환 족욕, 다리 부종 완화' },
  pisces: { part: '발, 림프계, 면역체계', care: '발 마사지, 림프 순환 케어, 숙면을 통한 면역 회복' }
};

// 오행별 정통 장부 데이터
const ELEMENT_ORGAN_DATA: Record<FiveElement, { organs: string; hanja: string; meridians: string; risk: string; symptom: string; diet: string }> = {
  목: {
    organs: '간(肝)·담(膽)',
    hanja: '肝膽',
    meridians: '족궐음간경·족소양담경',
    risk: '신경 과민, 만성 눈 피로, 근육 경직, 편두통',
    symptom: '분노 조절 장애, 뒷목 뻣뻣함, 시력 저하',
    diet: '신맛 과일, 케일/시금치 등 녹황색 채소, 결명자차, 밀싹'
  },
  화: {
    organs: '심장(心)·소장(小腸)',
    hanja: '心小腸',
    meridians: '수소음심경·수태양소장경',
    risk: '수면장애, 가슴 두근거림, 혈압 변동, 뇌신경 피로',
    symptom: '불면증, 구내염, 열감, 집중력 저하',
    diet: '토마토, 비트, 오미자차, 붉은 파프리카, 다크초콜릿'
  },
  토: {
    organs: '비장(脾)·위장(胃)',
    hanja: '脾胃',
    meridians: '족태음비경·족양명위경',
    risk: '소화불량, 복부 팽만, 사지 무력감, 생각 과다',
    symptom: '식후 식곤증, 입술 건조, 트림, 단것 충동',
    diet: '단호박, 양배추, 마, 대추차, 생강차, 따뜻한 죽'
  },
  금: {
    organs: '폐(肺)·대장(大腸)',
    hanja: '肺大腸',
    meridians: '수태음폐경·수양명대장경',
    risk: '비염, 마른 기침, 피부 알레르기, 변비/과민성 대장',
    symptom: '호흡 얕음, 피부 건조, 비염, 우울감',
    diet: '도라지차, 배, 연근, 무, 마늘, 흰 쌀눈'
  },
  수: {
    organs: '신장(腎)·방광(膀胱)',
    hanja: '腎膀胱',
    meridians: '족소음신경·족태양방광경',
    risk: '부신 피로, 요통, 하체 부종, 만성 기력 저하, 이명',
    symptom: '만성 피로, 허리 통증, 야간 빈뇨, 손발 저림',
    diet: '검은콩, 흑임자, 다시마, 미역, 복분자차, 구기자'
  }
};

/**
 * 오행 한난조습 & 메디컬 점성술 바이오 매트릭스 계산 메인 함수
 */
export function calculateMedicalBioMatrix(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  natalChart?: NatalChartResult | null;
  targetDate?: Date;
  question?: string;
}): MedicalBioMatrixResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);
  const astro = params?.natalChart || calculateNatalChart(params?.profile);

  // 1. 사주 4주 지지 & 천간 추출
  const pillars = [saju.pillars.year, saju.pillars.month, saju.pillars.day];
  if (saju.pillars.hour) pillars.push(saju.pillars.hour);

  const zhis = pillars.map(p => p.zhi);
  const gans = pillars.map(p => p.gan);

  // 2. 한난조습(寒暖燥濕) 수리 연산
  let coldCount = 0;
  let heatCount = 0;
  let dryCount = 0;
  let dampCount = 0;

  zhis.forEach(z => {
    if (['亥', '子', '丑'].includes(z)) coldCount += 2.0;
    if (['巳', '午', '未'].includes(z)) heatCount += 2.0;
    if (['戌', '未', '申', '酉'].includes(z)) dryCount += 1.5;
    if (['辰', '丑', '亥', '子'].includes(z)) dampCount += 1.5;
  });

  gans.forEach(g => {
    if (['壬', '癸'].includes(g)) { coldCount += 1.5; dampCount += 1.0; }
    if (['丙', '丁'].includes(g)) { heatCount += 1.5; dryCount += 1.0; }
    if (['庚', '辛'].includes(g)) dryCount += 1.0;
    if (['甲', '乙'].includes(g)) dampCount += 1.0;
    if (['戊', '己'].includes(g)) {
      if (['戌', '未'].some(z => zhis.includes(z))) dryCount += 1.0;
      else dampCount += 1.0;
    }
  });

  const totalClimate = (coldCount + heatCount + dryCount + dampCount) || 1;
  const coldScore = Math.min(100, Math.round((coldCount / totalClimate) * 100));
  const heatScore = Math.min(100, Math.round((heatCount / totalClimate) * 100));
  const dryScore = Math.min(100, Math.round((dryCount / totalClimate) * 100));
  const dampScore = Math.min(100, Math.round((dampCount / totalClimate) * 100));

  let primaryConstitution: MedicalBioMatrixResult['temperament']['primaryConstitution'] = '중화체질(中和)';
  let constitutionDesc = '음양과 온습도가 비교적 조화롭게 균형을 이루어 기혈 순환이 안정적입니다.';

  if (coldScore > 35 && dampScore > 30) {
    primaryConstitution = '한습체질(寒濕)';
    constitutionDesc = '몸이 차고 습이 정체되기 쉬워 하체 부종, 혈액순환 저하, 소화기 냉증을 주의해야 합니다.';
  } else if (heatScore > 35 && dryScore > 30) {
    primaryConstitution = '조열체질(燥熱)';
    constitutionDesc = '몸에 열기가 많고 진액이 마르기 쉬워 피부 건조, 안구 충혈, 뇌신경 과민 및 불면에 취약합니다.';
  } else if (heatScore > 35 && dampScore > 30) {
    primaryConstitution = '습열체질(濕熱)';
    constitutionDesc = '습열이 쌓여 피부 트러블, 지방간, 잦은 피로감과 염증 반응에 유의해야 합니다.';
  } else if (coldScore > 35 && dryScore > 30) {
    primaryConstitution = '풍한체질(風寒)';
    constitutionDesc = '찬 바람과 건조함에 민감하여 호흡기 면역 저하, 근육 경직, 피부 각질이 쉽게 생깁니다.';
  }

  // 3. 오행 장부 취약도 판정
  const counts = saju.elements.counts;
  const vulnerableOrgans: OrganVulnerability[] = [];

  (['목', '화', '토', '금', '수'] as FiveElement[]).forEach(el => {
    const count = counts[el] || 0;
    const base = ELEMENT_ORGAN_DATA[el];
    let status: OrganVulnerability['status'] = '균형';

    if (count === 0) status = '결핍(부족)';
    else if (count >= 3) status = '과다(울혈)';

    if (status !== '균형') {
      vulnerableOrgans.push({
        element: el,
        organs: base.organs,
        hanja: base.hanja,
        meridians: base.meridians,
        status,
        riskAreas: base.risk,
        symptoms: base.symptom,
        nutritionalTherapy: base.diet
      });
    }
  });

  // 결핍/과다가 없을 경우 가장 적은 것 하나를 추출
  if (vulnerableOrgans.length === 0) {
    const minEl = (['목', '화', '토', '금', '수'] as FiveElement[]).sort((a, b) => counts[a] - counts[b])[0];
    const base = ELEMENT_ORGAN_DATA[minEl];
    vulnerableOrgans.push({
      element: minEl,
      organs: base.organs,
      hanja: base.hanja,
      meridians: base.meridians,
      status: '결핍(부족)',
      riskAreas: base.risk,
      symptoms: base.symptom,
      nutritionalTherapy: base.diet
    });
  }

  const primaryWeakness = vulnerableOrgans[0];

  // 4. 서양 메디컬 점성술 포커스
  const sunSignId = astro.sun.sign.id;
  const moonSignId = astro.moon.sign.id;
  const sunPart = ASTRO_BODY_PARTS[sunSignId] || ASTRO_BODY_PARTS['aries'];
  const moonPart = ASTRO_BODY_PARTS[moonSignId] || ASTRO_BODY_PARTS['cancer'];

  const sunFocus: AstroMedicalFocus = {
    zodiacSign: astro.sun.sign.name,
    governedBodyPart: sunPart.part,
    vulnerabilityReason: `태양궁(${astro.sun.sign.name})의 생명력이 주재하는 핵심 활력 센터`,
    healingGuidance: sunPart.care
  };

  const moonFocus: AstroMedicalFocus = {
    zodiacSign: astro.moon.sign.name,
    governedBodyPart: moonPart.part,
    vulnerabilityReason: `달궁(${astro.moon.sign.name})이 주재하는 스트레스 반응 장기`,
    healingGuidance: moonPart.care
  };

  // 5. 오늘의 바이오 활력 및 피로도 산출
  let vitalityScore = 80;
  if (primaryWeakness.status === '결핍(부족)') vitalityScore -= 10;
  if (primaryConstitution !== '중화체질(中和)') vitalityScore -= 10;
  if (coldScore > 40 || heatScore > 40) vitalityScore -= 5;
  vitalityScore = Math.max(40, Math.min(95, vitalityScore));

  let fatigueRiskLevel: MedicalBioMatrixResult['fatigueRiskLevel'] = 'moderate';
  if (vitalityScore >= 85) fatigueRiskLevel = 'low';
  else if (vitalityScore >= 70) fatigueRiskLevel = 'moderate';
  else if (vitalityScore >= 55) fatigueRiskLevel = 'high';
  else fatigueRiskLevel = 'exhaustion_warning';

  // 6. 맞춤 처방 도출
  const prescriptions = {
    recommendedFoods: [primaryWeakness.nutritionalTherapy.split(',')[0].trim(), '제철 유기농 채소', '양질의 단백질'],
    herbalTeas: [primaryWeakness.nutritionalTherapy.includes('차') ? primaryWeakness.nutritionalTherapy : '따뜻한 보리차/둥굴레차'],
    foodsToAvoid: primaryConstitution.includes('열') ? ['과도한 음주', '지나치게 매운 음식', '에너지 드링크'] : ['차가운 얼음물', '날음식 과다', '야식'],
    sleepAndRecoveryRitual: `${moonPart.care}에 집중하며 취침 1시간 전 스마트폰 블루라이트 차단`,
    microStretchingZone: `${sunPart.part} 및 ${primaryWeakness.organs} 관련 부위 3분 이완 스트레칭`
  };

  const summary = `[바이오 매트릭스] ${primaryConstitution.split('(')[0]} 체질 (한${coldScore}·난${heatScore}·조${dryScore}·습${dampScore}). ` +
    `취약 1순위 장부: ${primaryWeakness.organs}(${primaryWeakness.status}). ` +
    `메디컬 점성술: ${sunFocus.zodiacSign} 관할 [${sunFocus.governedBodyPart}]. 생체 활력 지수: ${vitalityScore}점 (${fatigueRiskLevel}).`;

  const calculatedAtKst = formatBioMatrixKstTimestamp(now);
  const q = (params?.question || '').trim();
  const bioMatrixSynthesisMatrix = {
    dominantTension: `${primaryConstitution} ↔ ${primaryWeakness.organs}(${primaryWeakness.status})`,
    alignmentState: `태양궁 ${sunFocus.zodiacSign}(${sunFocus.governedBodyPart}) · 달궁 ${moonFocus.zodiacSign}`,
    integratedAction: `${prescriptions.sleepAndRecoveryRitual}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const reflectiveQuestion = q
    ? `"${q}"에 몰입하는 동안 오늘 가장 먼저 신호를 보낼 수 있는 ${primaryWeakness.organs}·${moonFocus.governedBodyPart}을 위해 3분만 비워 줄 수 있는 시간은 언제인가요?`
    : `${primaryConstitution} 체질과 ${primaryWeakness.organs}(${primaryWeakness.status})의 균형을 위해 오늘 밤 취침 전 가장 가볍게 실천할 회복 리추얼 하나는 무엇일까요?`;

  return {
    engineVersion: MEDICAL_BIO_MATRIX_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    temperament: {
      coldScore,
      heatScore,
      dryScore,
      dampScore,
      primaryConstitution,
      constitutionDesc
    },
    vulnerableOrgans,
    primaryWeakness,
    astroMedical: {
      sunFocus,
      moonFocus,
      stressIndicator: `${moonFocus.zodiacSign} 달의 스트레스는 [${moonFocus.governedBodyPart}]에 가장 먼저 나타남`
    },
    vitalityScore,
    fatigueRiskLevel,
    prescriptions,
    summary,
    ritualAction: `${primaryWeakness.organs}(${primaryWeakness.status})과 ${moonFocus.governedBodyPart}의 균형을 위해 ${prescriptions.sleepAndRecoveryRitual}을(를) 오늘 밤 실천하세요.`,
    reflectionFocus: `바이오 매트릭스(${primaryConstitution} ↔ ${primaryWeakness.organs}) — ${sunFocus.zodiacSign}·${moonFocus.zodiacSign}`,
    reflectiveQuestion,
    bioMatrixSynthesisMatrix,
    interpretiveBoundary: '본 바이오 매트릭스 리포트는 오행 한난조습과 메디컬 점성술 상징에 기반한 정성적 웰니스 참고 안내이며, 의학적 진단이나 처방을 대체하지 않습니다.',
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatMedicalBioMatrixPrompt(res: MedicalBioMatrixResult): string {
  const lines = [
    `[오행 한난조습 & 메디컬 점성술 바이오 매트릭스 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]`,
    `- 체질 기후 진단: **${res.temperament.primaryConstitution}**`,
    `  • 체질 특성: ${res.temperament.constitutionDesc}`,
    `- 취약 장부(五臟六腑): **${res.primaryWeakness.organs} (${res.primaryWeakness.hanja})** - 상태: [${res.primaryWeakness.status}]`,
    `  • 경락: ${res.primaryWeakness.meridians} | 주의 증상: ${res.primaryWeakness.symptoms}`,
    `- 메디컬 점성술 장기:`,
    `  • 태양궁(${res.astroMedical.sunFocus.zodiacSign}): ${res.astroMedical.sunFocus.governedBodyPart} (치유: ${res.astroMedical.sunFocus.healingGuidance})`,
    `  • 달궁(${res.astroMedical.moonFocus.zodiacSign}): ${res.astroMedical.moonFocus.governedBodyPart} (${res.astroMedical.stressIndicator})`,
    `- 피로 리스크 흐름: ${res.fatigueRiskLevel}`,
    `- 맞춤 웰니스 처방:`,
    `  • 추천 음식/차: ${res.prescriptions.recommendedFoods.join(', ')} / ${res.prescriptions.herbalTeas.join(', ')}`,
    `  • 피할 음식: ${res.prescriptions.foodsToAvoid.join(', ')}`,
    `  • 수면 및 회복 리추얼: ${res.prescriptions.sleepAndRecoveryRitual}`,
  ];
  if (res.bioMatrixSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스: [핵심 긴장: ${res.bioMatrixSynthesisMatrix.dominantTension} | 조율 상태: ${res.bioMatrixSynthesisMatrix.alignmentState}]`,
      `  • 통합 실천: ${res.bioMatrixSynthesisMatrix.integratedAction}`,
    );
  }
  if (res.reflectiveQuestion) {
    lines.push(`- 성찰 질문: ${res.reflectiveQuestion}`);
  }
  lines.push(
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  );
  lines.push(`※ 루시 지침: 질병을 의학적으로 진단하지 마십시오. 사주 한난조습과 메디컬 점성술의 오랜 지혜를 바탕으로 사용자의 오늘의 컨디션과 생체 피로도를 따뜻하게 위로하고, 실천 가능한 영양·수면 웰니스 가이드를 다정하게 조언해 주세요.`);
  return lines.join('\n');
}
