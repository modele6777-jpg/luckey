/**
 * Ancient Chinese Baopuzi Ge Hong Nine Turn Elixir Engine
 * 고대 동양 도교 포박자(抱朴子) 갈홍 내편 구전환단(九轉還丹) 무병장수 선도 엔진
 * 
 * Version: LUCKEY-BAOPUZI-ELIXIRS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const BAOPUZI_ELIXIRS_ENGINE_VERSION = 'LUCKEY-BAOPUZI-ELIXIRS-v1.0.0';

export interface BaopuziElixirsParams {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}

export interface BaopuziElixirsReport {
  engineVersion: string;
  vitalityPreservationScore: number; // 0-100 원기 보존 및 정기신(精氣神) 충만도
  alchemicalRefinementLevel: number; // 1-9 구전환단 화후(火候) 연마 단계
  longevityImmunityIndex: number; // 0-100 면역력 및 신체 회복 탄력성
  activeElixirPhase: {
    elixirRank: number;
    elixirNameKo: string;
    elixirNameZh: string;
    transformativePower: string;
    nourishingPractice: string;
  };
  geHongTaoistAdvice: string; // 포박자 갈홍의 불로장생 생활 훈계
}

const NINE_ELIXIRS = [
  {
    elixirRank: 1,
    elixirNameKo: '단화환단 (丹華還丹)',
    elixirNameZh: 'Danhua Huandan',
    transformativePower: '탁한 체액을 정화하고 오장육부의 기초 열기를 점화함',
    nourishingPractice: '아침 기상 직후 따뜻한 미온수를 천천히 세 모금 마셔 장기를 깨우세요.',
  },
  {
    elixirRank: 2,
    elixirNameKo: '금액환단 (金液還丹)',
    elixirNameZh: 'Jinye Huandan',
    transformativePower: '골수를 윤택하게 하고 관절과 혈관의 유연성을 극대화함',
    nourishingPractice: '식사 시 최소 30회 이상 꼭꼭 씹어 침(옥액)을 자연스럽게 삼키세요.',
  },
  {
    elixirRank: 3,
    elixirNameKo: '신단환단 (神丹還丹)',
    elixirNameZh: 'Shendan Huandan',
    transformativePower: '잡념과 불면을 가라앉히고 신명(神明)의 총기를 맑게 함',
    nourishingPractice: '잠들기 전 5분간 양손을 비벼 따뜻하게 한 뒤 눈가를 가볍게 마사지하세요.',
  },
  {
    elixirRank: 4,
    elixirNameKo: '환단백호 (還丹白虎)',
    elixirNameZh: 'Huandan Baihu',
    transformativePower: '폐와 호흡기를 강화하여 외부 사기와 감기 바이러스를 방어함',
    nourishingPractice: '가슴을 활짝 펴고 맑은 공기를 깊이 들이마시는 4박자 복식 호흡을 하세요.',
  },
  {
    elixirRank: 5,
    elixirNameKo: '환단청룡 (還丹靑龍)',
    elixirNameZh: 'Huandan Qinglong',
    transformativePower: '간의 피로를 해소하고 분노의 열기를 시원하게 식힘',
    nourishingPractice: '초록빛 채소나 상큼한 감귤류를 섭취하고 10분간 눈을 감고 휴식하세요.',
  },
  {
    elixirRank: 6,
    elixirNameKo: '환단주작 (還丹朱雀)',
    elixirNameZh: 'Huandan Zhuque',
    transformativePower: '심장의 박동을 고르게 하고 전신의 혈액 순환을 촉진함',
    nourishingPractice: '계단을 가볍게 오르내리거나 빠른 걸음으로 전신 온도를 1도 올리세요.',
  },
  {
    elixirRank: 7,
    elixirNameKo: '환단현무 (還丹玄武)',
    elixirNameZh: 'Huandan Xuanwu',
    transformativePower: '신장의 정기를 굳건히 하여 만성 피로와 허리 냉증을 완치함',
    nourishingPractice: '발바닥 용천혈을 지그시 지압하고 허리를 따뜻하게 유지하세요.',
  },
  {
    elixirRank: 8,
    elixirNameKo: '환단황제 (還丹黃帝)',
    elixirNameZh: 'Huandan Huangdi',
    transformativePower: '비위의 소화 흡수력을 중앙 토(土) 기운으로 탄탄히 확립함',
    nourishingPractice: '과식을 삼가고 정해진 시간에 소박하고 정갈한 곡물 위주의 식사를 하세요.',
  },
  {
    elixirRank: 9,
    elixirNameKo: '태청환단 (太淸還丹)',
    elixirNameZh: 'Taiqing Huandan',
    transformativePower: '몸과 마음이 신선처럼 가벼워져 일체의 질병과 피로를 초월함',
    nourishingPractice: '타인과의 비교와 과도한 물질적 집착을 털어내고 소박한 만족을 선언하세요.',
  },
];

export function calculateBaopuziElixirs(params?: BaopuziElixirsParams): BaopuziElixirsReport {
  const profile = params?.profile;
  const bdate = profile?.basic?.birthdate || '1995-03-21';
  const btime = profile?.basic?.birthtime || '12:00';
  const seed = (bdate + btime).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const vitality = ((seed * 17 + 39) % 52) + 48;
  const rank = (seed % 9) + 1;
  const activeElixir = NINE_ELIXIRS[rank - 1];
  const immunity = ((seed * 29 + 63) % 55) + 45;

  const advices = [
    '포박자 갈홍의 잠언: "내 몸을 귀하게 여기지 않고 천하의 재물을 구하는 것은 깨진 항아리에 물을 붓는 것과 같다."',
    '포박자 갈홍의 잠언: "마음을 고요히 하고 호흡을 길게 가져가는 것, 그것이 만병을 물리치는 진짜 금단이다."',
    '포박자 갈홍의 잠언: "하루의 피로는 그날 밤 수면 속에서 완전히 녹여내야 내일의 금단이 맺힌다."',
  ];

  return {
    engineVersion: BAOPUZI_ELIXIRS_ENGINE_VERSION,
    vitalityPreservationScore: vitality,
    alchemicalRefinementLevel: rank,
    longevityImmunityIndex: immunity,
    activeElixirPhase: activeElixir,
    geHongTaoistAdvice: advices[seed % advices.length],
  };
}

export function formatBaopuziElixirsPrompt(report: BaopuziElixirsReport): string {
  return `[고대 도교 포박자(抱朴子) 갈홍 구전환단(九轉還丹) 무병장수 실측 데이터]
- 엔진 버전: ${report.engineVersion}
- 원기 보존 충만도(精氣神): ${report.vitalityPreservationScore}/100 | 면역 복원력: ${report.longevityImmunityIndex}/100
- 금단 연마 단계: ${report.alchemicalRefinementLevel}전 [${report.activeElixirPhase.elixirNameKo}] (${report.activeElixirPhase.elixirNameZh})
  * 효능: ${report.activeElixirPhase.transformativePower}
  * 생활 양생 실천: ${report.activeElixirPhase.nourishingPractice}
- 포박자 갈홍의 훈계: ${report.geHongTaoistAdvice}
- 루시 가이드: 피로나 스트레스로 지친 질문자에게 무리한 일정을 잠시 멈추고 내면의 정기(원기)를 충전하는 소박하고 실질적인 양생 처방을 따뜻하게 일러줘.`;
}
