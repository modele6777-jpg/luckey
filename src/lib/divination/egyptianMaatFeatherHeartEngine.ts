/**
 * 고대 이집트 마아트(Ma'at) 진리의 깃털 & 심장 무게 측정 엔진 (Egyptian Ma'at Feather & Heart Weighing Engine)
 *
 * 고대 이집트 사자의 서(Book of the Dead)의 핵심 심판 의식인
 * 진리·정의·우주적 조화의 여신 마아트의 타조 깃털과 인간의 심장(Ib)을 달아보는 저울질(Psychostasia)을
 * 현대 심리적 양심의 가벼움, 정서적 무결성, 카르마 정화 체계에 연동합니다.
 */

export const EGYPTIAN_MAAT_FEATHER_ENGINE_VERSION = 'LUCKEY-EGYPTIAN-MAAT-v1.0.0';

export interface MaatWeighingReport {
  engineVersion: string;
  calculatedAt: string;
  heartLightnessScore: number; // 0 ~ 100 (깃털처럼 가벼운 심장의 순수성 지수)
  weighingVerdict: '아루(Aaru) 갈대밭 낙원 통과 (깃털보다 가벼운 심장)' | '토트(Thoth)의 지혜로운 기록 통과 (완벽한 영혼의 수평 저울)' | '정화 의식 권고 (가슴속 묵은 집착의 정화 필요)';
  activeNegativeConfessionVirtue: string; // 42대 무결성 덕목
  ammutShadowTrap: string; // 무거운 마음을 갉아먹는 그림자 포식자 함정
  featherAlignmentPrescription: string; // 마아트 깃털 정렬 실천 지침
}

export function calculateEgyptianMaatFeatherHeart(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): MaatWeighingReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 11);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 29;
  }
  seed += now.getDate() * 17 + now.getMonth() * 59;

  const heartLightnessScore = 65 + (Math.abs(seed * 7) % 34);

  const virtues = [
    '타인의 마음을 이유 없이 아프게 하지 않는 무해함의 덕',
    '자신의 양심을 속이지 않고 정직하게 노동하는 진실성의 덕',
    '가진 것을 가난한 자와 기꺼이 나누는 관대함의 덕',
    '자연의 순리와 우주적 질서를 거스르지 않는 조화의 덕',
  ];
  const activeNegativeConfessionVirtue = virtues[Math.abs(seed) % virtues.length];

  const ammutTraps = [
    '지나간 후회와 죄책감에 스스로를 가두는 자기 비하',
    '남과 비교하며 마음속으로 품는 은밀한 질투와 결핍감',
    '모든 상황을 혼자 통제하려다 생기는 가슴속 답답한 압박감',
    '솔직하지 못한 감정 억압으로 인한 심장의 에너지 정체',
  ];
  const ammutShadowTrap = ammutTraps[Math.abs(seed >> 2) % ammutTraps.length];

  let weighingVerdict: '아루(Aaru) 갈대밭 낙원 통과 (깃털보다 가벼운 심장)' | '토트(Thoth)의 지혜로운 기록 통과 (완벽한 영혼의 수평 저울)' | '정화 의식 권고 (가슴속 묵은 집착의 정화 필요)';
  if (heartLightnessScore >= 85) {
    weighingVerdict = '아루(Aaru) 갈대밭 낙원 통과 (깃털보다 가벼운 심장)';
  } else if (heartLightnessScore >= 70) {
    weighingVerdict = '토트(Thoth)의 지혜로운 기록 통과 (완벽한 영혼의 수평 저울)';
  } else {
    weighingVerdict = '정화 의식 권고 (가슴속 묵은 집착의 정화 필요)';
  }

  const featherAlignmentPrescription = `오늘 당신의 가슴을 무겁게 짓누르는 집착이나 의무감을 종이에 적어 태우거나 지우세요. '${activeNegativeConfessionVirtue}'을 마음에 새기고 심장 차크라를 가볍게 비울 때 마아트의 축복이 깃듭니다.`;

  return {
    engineVersion: EGYPTIAN_MAAT_FEATHER_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    heartLightnessScore,
    weighingVerdict,
    activeNegativeConfessionVirtue,
    ammutShadowTrap,
    featherAlignmentPrescription,
  };
}

export function formatEgyptianMaatFeatherHeartPrompt(report: MaatWeighingReport): string {
  return `### ⚖️ 고대 이집트 마아트(Ma'at) 진리의 깃털 & 심장 무게 측정 실측 데이터 (${report.engineVersion})
- **심장의 가벼움 지수**: ${report.heartLightnessScore}점 / 100점
- **오시리스 심판 저울 판정**: [${report.weighingVerdict}]
- **주도적 양심 무결성 덕목**: ${report.activeNegativeConfessionVirtue}
- **경계해야 할 아미트(Ammut) 그림자 함정**: ${report.ammutShadowTrap}
- **마아트 깃털 정렬 실천 지침**: ${report.featherAlignmentPrescription}`;
}
