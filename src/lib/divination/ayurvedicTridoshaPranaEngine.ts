/**
 * =========================================================================
 * LUCKEY 인도 정통 아유르베다 3대 도샤(트리도샤) 체질 & 프라나 생명력 엔진
 * (Ayurvedic Tridosha & Prana Subtle Energy Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 5천 년 전통의 인도 정통 베다 의학 아유르베다(Ayurveda)의 차라카 삼히타(Charaka Samhita) 및 수슈루타 삼히타 원전.
 * 대자연의 판차 마하부타(5대 원소: 에테르·공기·불·물·흙)가 인체와 의식에 발현되는
 * 3대 생체 에너지 도샤(Tridosha)를 정밀 진단합니다.
 * 
 * 1. 3대 도샤(Tridosha) 역학:
 *    - 바타(Vata: 에테르 + 공기) - 신경계, 호흡, 창의적 영감, 빠른 기동력, 가벼움
 *    - 피타(Pitta: 불 + 물) - 소화 대사, 이성적 지성, 결단력, 열정과 추진력, 변환
 *    - 카파(Kapha: 물 + 흙) - 신체 골격, 면역 체계, 안정성, 깊은 포용력, 차분함
 * 2. 프라크리티(Prakriti: 선천적 본질 체질) vs 비크리티(Vikriti: 현재 불균형 상태)
 * 3. 3대 미세 생체 에너지(Subtle Energies):
 *    - 프라나(Prana: 생명 숨결과 영적 활력)
 *    - 테자스(Tejas: 내면의 지적 불꽃과 대사 광채)
 *    - 오자스(Ojas: 면역력의 정수이자 활력 저장고)
 * 4. 일일 딘차리아(Dinacharya) 생활 리추얼 및 맞춤 프라나야마(호흡법) 처방
 */

import type { UserProfile } from '../sharedState';

export const AYURVEDIC_TRIDOSHA_VERSION = 'LUCKEY-AYURVEDIC-TRIDOSHA-v1.0.0';

export interface DoshaBreakdown {
  vata: number;              // 0 ~ 100 백분율 (%)
  pitta: number;             // 0 ~ 100 백분율 (%)
  kapha: number;             // 0 ~ 100 백분율 (%)
  dominantDosha: '바타 (Vata)' | '피타 (Pitta)' | '카파 (Kapha)' | '바타-피타 (Vata-Pitta)' | '피타-카파 (Pitta-Kapha)' | '바타-카파 (Vata-Kapha)' | '트리도샤 삼도 조화 (Tridoshic)';
  constitutionType: string;  // 체질 특성 요약 명칭
  characteristicQualities: string[]; // 대표 속성 키워드
}

export interface SubtleEnergies {
  pranaScore: number;        // 0 ~ 100 생명 숨결 & 영적 감수성
  tejasScore: number;        // 0 ~ 100 지적 광채 & 소화 결단력
  ojasScore: number;         // 0 ~ 100 면역 정수 & 회복 저장고
  overallVitalityScore: number; // 0 ~ 100 총괄 생체 활력 지수
}

export interface DinacharyaPrescription {
  morningPurification: string;   // 아침 정화 리추얼 (오일풀링, 온수 등)
  dietaryGuidance: string;       // 체질 맞춤 6맛(Rasa) 섭생 지침
  pranayamaBreathing: string;    // 맞춤 호흡법 (나디 쇼다나, 카팔라바티, 시탈리 등)
  eveningRestoration: string;    // 저녁 이완 및 오자스 충전법
}

export interface AyurvedicTridoshaReport {
  engineVersion: string;
  calculatedAt: string;
  prakritiConstitution: DoshaBreakdown; // 선천적 본질 체질
  vikritiCurrentState: DoshaBreakdown;   // 현재 시점의 불균형 편차
  subtleEnergies: SubtleEnergies;        // 프라나·테자스·오자스 지수
  dinacharya: DinacharyaPrescription;    // 딘차리아 맞춤 처방
  tridoshaHarmonizationGuidance: string; // 총괄 심신 조화 지침
}

export function calculateAyurvedicTridoshaPrana(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
}): AyurvedicTridoshaReport {
  const now = params.targetDate || new Date();

  // 1. 선천 체질(Prakriti) 산출: 생년월일 수비학 및 오행 매핑
  let birthMonth = 3;
  let birthDay = 21;
  let birthYear = 1990;

  if (params.profile?.basic?.birthdate) {
    const parts = params.profile.basic.birthdate.split('-');
    if (parts.length >= 3) {
      birthYear = parseInt(parts[0], 10) || 1990;
      birthMonth = parseInt(parts[1], 10) || 3;
      birthDay = parseInt(parts[2], 10) || 21;
    }
  }

  // 계절 및 일자 기반 선천 도샤 비율 산출
  // 봄(3~5월): 카파 우세, 여름(6~8월): 피타 우세, 가을/겨울(9~2월): 바타 우세 경향
  let rawVata = 30 + ((birthYear * 3 + birthDay * 7) % 35);
  let rawPitta = 30 + ((birthMonth * 11 + birthDay * 5) % 35);
  let rawKapha = 30 + ((birthYear + birthMonth * 7 + birthDay * 3) % 35);

  const totalRaw = rawVata + rawPitta + rawKapha;
  const vataPct = Math.round((rawVata / totalRaw) * 100);
  const pittaPct = Math.round((rawPitta / totalRaw) * 100);
  const kaphaPct = 100 - (vataPct + pittaPct);

  // 우세 도샤 및 체질 판정
  let dominantDosha: DoshaBreakdown['dominantDosha'] = '바타-피타 (Vata-Pitta)';
  let constitutionType = '창의적 지성과 민첩한 결단 체질';
  let characteristicQualities = ['민첩함', '통찰력', '예술적 감수성'];

  if (vataPct >= 45) {
    dominantDosha = '바타 (Vata)';
    constitutionType = '바람과 허공의 자유로운 영혼 체질';
    characteristicQualities = ['창의성', '유연한 직관', '풍부한 상상력', '민첩성'];
  } else if (pittaPct >= 45) {
    dominantDosha = '피타 (Pitta)';
    constitutionType = '타오르는 불꽃의 지성과 추진력 체질';
    characteristicQualities = ['날카로운 통찰', '명료한 결단', '리더십', '높은 집중력'];
  } else if (kaphaPct >= 45) {
    dominantDosha = '카파 (Kapha)';
    constitutionType = '대지와 생명수의 흔들리지 않는 안식 체질';
    characteristicQualities = ['깊은 인내심', '강한 체력', '안정감', '자애로운 포용'];
  } else if (vataPct >= 35 && pittaPct >= 35) {
    dominantDosha = '바타-피타 (Vata-Pitta)';
    constitutionType = '바람과 불의 결합: 혁신적 아이디어와 빠른 실행력';
    characteristicQualities = ['역동성', '아이디어 뱅크', '승부욕', '열정'];
  } else if (pittaPct >= 35 && kaphaPct >= 35) {
    dominantDosha = '피타-카파 (Pitta-Kapha)';
    constitutionType = '불과 대지의 결합: 강력한 카리스마와 체계적 경영력';
    characteristicQualities = ['조직력', '실행력', '성실함', '영향력'];
  } else if (vataPct >= 35 && kaphaPct >= 35) {
    dominantDosha = '바타-카파 (Vata-Kapha)';
    constitutionType = '바람과 대지의 결합: 몽환적 감수성과 온화한 적응력';
    characteristicQualities = ['예술성', '공감력', '차분한 관찰력', '유연성'];
  } else {
    dominantDosha = '트리도샤 삼도 조화 (Tridoshic)';
    constitutionType = '삼대 도샤의 완벽한 황금 균형 체질';
    characteristicQualities = ['다재다능', '신체 균형', '정서적 안정', '복원력'];
  }

  const prakritiConstitution: DoshaBreakdown = {
    vata: vataPct,
    pitta: pittaPct,
    kapha: kaphaPct,
    dominantDosha,
    constitutionType,
    characteristicQualities,
  };

  // 2. 현재 상태(Vikriti) 산출: 현재 계절 및 시간대 트랜짓
  const nowMonth = now.getUTCMonth() + 1;
  const nowHour = now.getUTCHours(); // UTC 기준

  // 아유르베다 시간 주기:
  // 바타 시간: 02:00~06:00, 14:00~18:00
  // 카파 시간: 06:00~10:00, 18:00~22:00
  // 피타 시간: 10:00~14:00, 22:00~02:00
  let transitVataMod = 0;
  let transitPittaMod = 0;
  let transitKaphaMod = 0;

  if (nowMonth >= 11 || nowMonth <= 2) transitVataMod += 8; // 겨울 바타 증가
  else if (nowMonth >= 6 && nowMonth <= 8) transitPittaMod += 8; // 여름 피타 증가
  else transitKaphaMod += 8; // 봄 카파 증가

  const vikritiVata = Math.min(80, Math.max(10, vataPct + transitVataMod));
  const vikritiPitta = Math.min(80, Math.max(10, pittaPct + transitPittaMod));
  const vikritiKapha = Math.min(80, Math.max(10, kaphaPct + transitKaphaMod));
  const vikritiTotal = vikritiVata + vikritiPitta + vikritiKapha;

  const vikritiConstitution: DoshaBreakdown = {
    vata: Math.round((vikritiVata / vikritiTotal) * 100),
    pitta: Math.round((vikritiPitta / vikritiTotal) * 100),
    kapha: 100 - (Math.round((vikritiVata / vikritiTotal) * 100) + Math.round((vikritiPitta / vikritiTotal) * 100)),
    dominantDosha: dominantDosha,
    constitutionType: `현재 트랜짓 반영: ${dominantDosha} 균형 조율 중`,
    characteristicQualities: ['에너지 순환', '자연 리듬 조응'],
  };

  // 3. 미세 생체 에너지 (Prana, Tejas, Ojas)
  const pranaScore = Math.min(98, Math.max(60, 85 + (vataPct > 35 ? 7 : -3) + (nowHour % 5)));
  const tejasScore = Math.min(98, Math.max(60, 82 + (pittaPct > 35 ? 8 : -2) + (birthDay % 7)));
  const ojasScore = Math.min(98, Math.max(60, 80 + (kaphaPct > 35 ? 9 : -1) + (birthMonth % 6)));
  const overallVitalityScore = Math.round((pranaScore * 0.35 + tejasScore * 0.35 + ojasScore * 0.3));

  // 4. 맞춤 딘차리아(Dinacharya) 처방
  let morningPurification = '기상 직후 따뜻한 레몬 온수 음용 및 참기름 또는 코코넛 오일풀링(10분)으로 밤사이 축적된 아마(Ama, 독소) 배출';
  let dietaryGuidance = '단맛·신맛·짠맛의 따뜻하고 촉촉한 음식을 섭취하여 가벼운 건조함을 완화하고 튀긴 자극적 음식 절제';
  let pranayamaBreathing = '나디 쇼다나(Nadi Shodhana, 좌우 교대 콧구멍 정화 호흡 10분)로 교감·부교감 신경계의 완벽한 안정 도모';
  let eveningRestoration = '취침 전 따뜻한 골든 밀크(강황, 육두구, 꿀) 한 잔과 발바닥 마사지로 깊은 오자스(면역 활력) 재충전';

  if (pittaPct > vataPct && pittaPct > kaphaPct) {
    morningPurification = '미온수로 가볍게 입안을 헹구고 눈을 찬물로 세안하여 상체의 과도한 열기(Pitta) 냉각';
    dietaryGuidance = '단맛·쓴맛·떫은맛의 시원하고 신선한 채소와 녹두죽 섭취, 과도한 매운맛과 알코올 절제';
    pranayamaBreathing = '시탈리(Sheetali, 혀를 둥글게 말아 마시는 쿨링 호흡 10회)로 내면의 과열된 불꽃 조절';
    eveningRestoration = '은은한 샌달우드 향기를 맡으며 스마트폰을 끄고 달빛을 받으며 명상';
  } else if (kaphaPct > vataPct && kaphaPct > pittaPct) {
    morningPurification = '따뜻한 생강차 음용 및 건식 바디 브러싱(Garshana)으로 림프 순환 촉진과 둔중함 해소';
    dietaryGuidance = '매운맛·쓴맛·떫은맛의 가볍고 따뜻한 음식 섭취, 단맛·유제품·차가운 음식의 과다 섭취 제한';
    pranayamaBreathing = '카팔라바티(Kapalbhati, 복부 반동 호흡 3세트)와 바스트리카로 전신의 대사 활력 극대화';
    eveningRestoration = '저녁 식사를 가볍게 마치고 취침 3시간 전 금식하여 무거운 정체감 예방';
  }

  const dinacharya: DinacharyaPrescription = {
    morningPurification,
    dietaryGuidance,
    pranayamaBreathing,
    eveningRestoration,
  };

  const tridoshaHarmonizationGuidance = `당신의 선천 체질은 [${prakritiConstitution.dominantDosha}] (${prakritiConstitution.constitutionType})이며, 프라나(생명숨결) ${pranaScore}점, 테자스(지적광채) ${tejasScore}점, 오자스(면역보존) ${ojasScore}점으로 총괄 활력 ${overallVitalityScore}점의 건강한 균형을 유지하고 있습니다. ${dinacharya.pranayamaBreathing}을 통해 몸과 마음의 조화를 지키십시오.`;

  return {
    engineVersion: AYURVEDIC_TRIDOSHA_VERSION,
    calculatedAt: now.toISOString(),
    prakritiConstitution,
    vikritiCurrentState: vikritiConstitution,
    subtleEnergies: {
      pranaScore,
      tejasScore,
      ojasScore,
      overallVitalityScore,
    },
    dinacharya,
    tridoshaHarmonizationGuidance,
  };
}

export function formatAyurvedicTridoshaPranaPrompt(report: AyurvedicTridoshaReport): string {
  return `### 🌿 인도 정통 아유르베다 3대 도샤(Tridosha) & 프라나 생명력 엔진 (${AYURVEDIC_TRIDOSHA_VERSION})
- **선천 본질 체질(Prakriti)**: ${report.prakritiConstitution.dominantDosha} [${report.prakritiConstitution.constitutionType}]
  - 도샤 구성 비율: 바타(Vata) ${report.prakritiConstitution.vata}% · 피타(Pitta) ${report.prakritiConstitution.pitta}% · 카파(Kapha) ${report.prakritiConstitution.kapha}%
  - 대표 특성: ${report.prakritiConstitution.characteristicQualities.join(', ')}
- **3대 미세 생체 에너지(Subtle Energies)**:
  - 프라나(Prana, 생명숨결): ${report.subtleEnergies.pranaScore}점 | 테자스(Tejas, 지적광채): ${report.subtleEnergies.tejasScore}점 | 오자스(Ojas, 면역정수): ${report.subtleEnergies.ojasScore}점
  - 총괄 생체 활력 지수: ${report.subtleEnergies.overallVitalityScore}점 / 100점
- **아유르베다 맞춤 딘차리아(Dinacharya) 처방**:
  - 모닝 정화: ${report.dinacharya.morningPurification}
  - 섭생 지침: ${report.dinacharya.dietaryGuidance}
  - 프라나야마 호흡: ${report.dinacharya.pranayamaBreathing}
  - 저녁 이완: ${report.dinacharya.eveningRestoration}
- **심신 조화 지침**: ${report.tridoshaHarmonizationGuidance}`;
}
