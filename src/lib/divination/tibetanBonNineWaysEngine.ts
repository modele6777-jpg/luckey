/**
 * =========================================================================
 * LUCKEY 티베트 정통 본교(Bon) 카르마 9승(Nine Ways of Bon) & 5대 영혼 수호 엔진
 * (Tibetan Yungdrung Bon Nine Ways of Enlightenment & Soul Vitality Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 히말라야 장샹(Zhangzhung) 고대 문명과 티베트 최고(最古) 토착 영적 전통인
 * 《융드룽 본(Yungdrung Bon / 불멸의 만(卐)자 지혜)》 원전.
 * 
 * 1. 본교 9대 영적 승(Nine Ways of Bon - 톤파 셴랍 미워체의 가르침):
 *    - 원인 4승 (Causal Vehicles):
 *      (1) 차셴(Chashen): 신성한 점술과 정화 의식, 자연계 공명
 *      (2) 낭셴(Nangshen): 환경과 정령의 신성한 조화 및 치유
 *      (3) 트룰셴(Trulshen): 환영과 미혹의 번뇌 극복, 힘의 반전
 *      (4) 시드시(Sidshen): 삶과 죽음, 바르도 환생의 영혼 인도
 *    - 결과 4승 (Resultant Vehicles):
 *      (5) 겐옌(Ghenyen): 재가자의 청정한 도덕과 일상 선행
 *      (6) 드랑송(Drangsong): 엄격한 계율과 욕망 초월의 수행
 *      (7) 아카르(Akar): 백색 아(A) 소리의 만트라와 진동 정화
 *      (8) 예셴(Yeshen): 원초적 신성 지혜와 영적 합일
 *    - 지고의 대원만 1승 (Supreme Vehicle):
 *      (9) 라니에드(Lhanyed): 본래 청정한 릭파(Rigpa)와 궁극의 대자유(Dzogchen)
 * 2. 5대 영혼 생명력 (Five Soul Vitality Energies):
 *    - 라 (La): 영혼의 광채와 수호 보호막
 *    - 속 (Sok): 육체 심장 생명력과 생체 리듬
 *    - 체 (Tshe): 수명과 인내력, 생명 지속성
 *    - 왕당 (Wang-thang): 카리스마, 당당함, 번영의 자기장
 *    - 룽타 (Lung-ta): 바람의 말, 행운의 가속도와 기회 포착력
 * 3. 융드룽 본원 청정도 지수 (Yungdrung Primordial Purity Index - 0 ~ 100)
 */

import type { UserProfile } from '../sharedState';

export const TIBETAN_BON_NINE_WAYS_VERSION = 'LUCKEY-TIBETAN-BON-NINE-WAYS-v1.0.0';

export interface BonWayPath {
  wayIndex: number;              // 1 ~ 9
  tibetanName: string;           // 티베트어 명칭
  koreanName: string;            // 한국어 명칭
  category: '원인승(Causal)' | '결과승(Resultant)' | '지고대원만(Supreme Dzogchen)';
  sacredPractice: string;        // 주재 수행 및 실천
  soulGuidance: string;          // 영혼 나침반 지침
}

export interface BonVitalityEnergy {
  name: string;                  // 라(La), 속(Sok), 체(Tshe), 왕당(Wang-thang), 룽타(Lung-ta)
  koreanMeaning: string;         // 의미
  strengthScore: number;         // 0 ~ 100 에너지 세기
  harmonizationNote: string;     // 조화 처방
}

export interface TibetanBonReport {
  engineVersion: string;
  calculatedAt: string;
  activeWay: BonWayPath;         // 현재 공명하는 본교 영적 길
  primaryVitality: BonVitalityEnergy; // 가장 강화가 필요한 주재 영혼 에너지
  vitalities: BonVitalityEnergy[];    // 5대 영혼 에너지 전수 상태
  primordialPurityIndex: number; // 0 ~ 100 융드룽 본원 청정도
  yungdrungMantraDecree: string; // 불멸의 진언 칙령
}

const NINE_BON_WAYS: BonWayPath[] = [
  {
    wayIndex: 1,
    tibetanName: '차셴 텍파 (Chashen Thegpa)',
    koreanName: '신성 점술과 자연 정화의 길',
    category: '원인승(Causal)',
    sacredPractice: '사물의 미세한 조짐을 관찰하고 자연의 신성한 리듬에 맞춰 몸과 마음의 불순물을 정화',
    soulGuidance: '보이는 현상 너머의 미묘한 징후와 내면의 직관을 신뢰하며 주변 환경을 청결히 하십시오.'
  },
  {
    wayIndex: 2,
    tibetanName: '낭셴 텍파 (Nangshen Thegpa)',
    koreanName: '환경 조화와 정령 상생의 길',
    category: '원인승(Causal)',
    sacredPractice: '공간의 보이지 않는 에너지와 화해하고 살아있는 모든 존재에게 감사와 경외를 표함',
    soulGuidance: '당신이 머무는 주거와 작업 공간의 기운을 다정하게 감싸 안고 타인과의 충돌을 너그럽게 품으십시오.'
  },
  {
    wayIndex: 3,
    tibetanName: '트룰셴 텍파 (Trulshen Thegpa)',
    koreanName: '환영 타파와 힘의 반전의 길',
    category: '원인승(Causal)',
    sacredPractice: '두려움과 불안이라는 환상의 껍질을 직시하여 오히려 영적 도약의 원동력으로 전환',
    soulGuidance: '위기와 불안에 짓눌리지 말고 그것을 내면의 낡은 습을 단숨에 깨뜨릴 절호의 기회로 삼으십시오.'
  },
  {
    wayIndex: 4,
    tibetanName: '시드시 텍파 (Sidshen Thegpa)',
    koreanName: '생사 초월과 바르도 인도의 길',
    category: '원인승(Causal)',
    sacredPractice: '끝없는 변화와 전환기의 어둠 속에서 영혼의 방향타를 잃지 않고 빛으로 나아감',
    soulGuidance: '하나의 장(chapter)이 끝나는 것을 슬퍼하지 마십시오. 새로운 지평선이 이미 열리고 있습니다.'
  },
  {
    wayIndex: 5,
    tibetanName: '겐옌 텍파 (Ghenyen Thegpa)',
    koreanName: '재가자의 청정한 윤리와 실천의 길',
    category: '결과승(Resultant)',
    sacredPractice: '일상의 사소한 약속과 정직함을 신성한 종교적 의식처럼 지키며 덕을 쌓음',
    soulGuidance: '거창한 깨달음을 좇기보다 오늘 만나는 사람들에게 건네는 따뜻한 미소와 성실함에 집중하십시오.'
  },
  {
    wayIndex: 6,
    tibetanName: '드랑송 텍파 (Drangsong Thegpa)',
    koreanName: '엄격한 절제와 욕망 초월의 길',
    category: '결과승(Resultant)',
    sacredPractice: '주의를 흐트러뜨리는 말초적 감각 자극을 차단하고 영혼의 순수한 중심을 수호',
    soulGuidance: '과잉된 정보와 불필요한 인간관계의 소음을 의도적으로 끊고 고요한 혼자만의 침묵을 즐기십시오.'
  },
  {
    wayIndex: 7,
    tibetanName: '아카르 텍파 (Akar Thegpa)',
    koreanName: '백색 아(A) 진언과 소리 진동의 길',
    category: '결과승(Resultant)',
    sacredPractice: '태초의 무생(無生)을 상징하는 백색 아(A) 음조로 마음의 탁기를 태우고 진동수를 승화',
    soulGuidance: '맑은 목소리로 깊은 호흡을 내쉬며 부정적인 생각의 파동을 빛의 주파수로 조율하십시오.'
  },
  {
    wayIndex: 8,
    tibetanName: '예셴 텍파 (Yeshen Thegpa)',
    koreanName: '원초 지혜와 신성 합일의 길',
    category: '결과승(Resultant)',
    sacredPractice: '분별하는 에고의 착각을 내려놓고 우주 전체의 지혜와 분리될 수 없는 하나임을 체득',
    soulGuidance: '모든 상황은 이미 완벽한 우주의 섭리 속에 있습니다. 안심하고 거대한 생명의 손길에 맡기십시오.'
  },
  {
    wayIndex: 9,
    tibetanName: '라니에드 텍파 (Lhanyed Thegpa)',
    koreanName: '지고 대원만(Dzogchen) 영적 자유의 길',
    category: '지고대원만(Supreme Dzogchen)',
    sacredPractice: '지어냄도 없고 꾸밈도 없는 본래 청정한 맑은 의식(Rigpa) 그 자체로 머무름',
    soulGuidance: '그 어떤 것도 더하거나 뺄 필요가 없습니다. 지금 이 순간 깨어있는 당신 자신이 곧 불멸의 지혜입니다.'
  }
];

export function calculateTibetanBonNineWays(
  profile: UserProfile,
  options?: { contextText?: string }
): TibetanBonReport {
  let birthYear = 1990;
  let birthMonth = 6;
  let birthDay = 15;
  let birthHour = 12;

  if (profile.birthDate) {
    const parts = profile.birthDate.split('-').map(Number);
    if (parts.length >= 3 && !isNaN(parts[0])) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  if (profile.birthTime) {
    const tParts = profile.birthTime.split(':').map(Number);
    if (tParts.length >= 1 && !isNaN(tParts[0])) {
      birthHour = tParts[0];
    }
  }

  // 1. 공명하는 본교 영적 길 (1 ~ 9)
  const wayIndex = (Math.abs(birthYear * 7 + birthMonth * 11 + birthDay * 13 + birthHour) % 9);
  const activeWay = NINE_BON_WAYS[wayIndex];

  // 2. 5대 영혼 에너지 계산
  const baseSeed = (birthYear % 100) * 17 + birthMonth * 23 + birthDay * 31;
  const laScore = 60 + ((baseSeed + 7) % 38);
  const sokScore = 60 + ((baseSeed + 13) % 38);
  const tsheScore = 60 + ((baseSeed + 19) % 38);
  const wangThangScore = 60 + ((baseSeed + 29) % 38);
  const lungTaScore = 60 + ((baseSeed + 37) % 38);

  const vitalities: BonVitalityEnergy[] = [
    {
      name: '라 (La)',
      koreanMeaning: '영혼 수호광채 & 오라 보호막',
      strengthScore: laScore,
      harmonizationNote: laScore >= 80 ? '수호 보호막이 매우 견고하여 외부 부정성이 침투하지 못합니다.' : '감정 소모를 줄이고 숲길 산책으로 오라를 보강하십시오.'
    },
    {
      name: '속 (Sok)',
      koreanMeaning: '육체 심장 박동 생명력',
      strengthScore: sokScore,
      harmonizationNote: sokScore >= 80 ? '심장과 순환계 생명력이 왕성하여 추진력이 탁월합니다.' : '따뜻한 차와 규칙적인 수면으로 중심 생명력을 보존하십시오.'
    },
    {
      name: '체 (Tshe)',
      koreanMeaning: '생명 지속력 & 장기 인내심',
      strengthScore: tsheScore,
      harmonizationNote: tsheScore >= 80 ? '장기전에 강한 끈기와 지구력을 갖추고 있습니다.' : '단기적 승패에 일희일비하지 말고 호흡을 길게 가져가십시오.'
    },
    {
      name: '왕당 (Wang-thang)',
      koreanMeaning: '카리스마 & 자력적 번영권능',
      strengthScore: wangThangScore,
      harmonizationNote: wangThangScore >= 80 ? '주변을 리드하는 카리스마와 재물 유치력이 매우 강력합니다.' : '자신의 전문성을 신뢰하고 당당하게 의사를 표명하십시오.'
    },
    {
      name: '룽타 (Lung-ta)',
      koreanMeaning: '바람의 말 & 행운 가속도',
      strengthScore: lungTaScore,
      harmonizationNote: lungTaScore >= 80 ? '행운의 기류를 타고 타이밍을 절묘하게 포착하는 기운이 높습니다.' : '깃발이 바람에 날리듯 빠른 직관적 결단이 행운을 당깁니다.'
    }
  ];

  // 가장 강화가 필요한 영혼 에너지
  let primaryVitality = vitalities[0];
  for (const v of vitalities) {
    if (v.strengthScore < primaryVitality.strengthScore) {
      primaryVitality = v;
    }
  }

  // 3. 본원 청정도 지수
  const primordialPurityIndex = Math.min(99, Math.max(65, Math.round(
    (laScore + sokScore + tsheScore + wangThangScore + lungTaScore) / 5
  )));

  const MANTRAS = [
    '옴 마트리 무예 살레 두 (Om Ma Tri Mu Ye Sa Le Du - 영혼 정화와 광명)',
    '아 카르 아 메 두 트레 수 (A Kar A Me Du Tre Su - 장애 소멸과 지혜)',
    '소 파 살레 훙 (So Pa Sa Le Hung - 대원만 심장 본원 진언)'
  ];
  const yungdrungMantraDecree = MANTRAS[(birthDay + birthMonth) % MANTRAS.length];

  return {
    engineVersion: TIBETAN_BON_NINE_WAYS_VERSION,
    calculatedAt: new Date().toISOString(),
    activeWay,
    primaryVitality,
    vitalities,
    primordialPurityIndex,
    yungdrungMantraDecree
  };
}

export function formatTibetanBonNineWaysPrompt(report: TibetanBonReport): string {
  const vitLines = report.vitalities
    .map(v => `   * ${v.name} (${v.koreanMeaning}): ${v.strengthScore}점 - ${v.harmonizationNote}`)
    .join('\n');

  return `[티베트 정통 본교(Bon) 카르마 9승 & 5대 영혼 수호 융드룽 엔진]
- 공명 영적 길: ${report.activeWay.tibetanName} [${report.activeWay.koreanName}] (${report.activeWay.category})
  * 신성 수행: ${report.activeWay.sacredPractice}
  * 영혼 나침반: ${report.activeWay.soulGuidance}
- 융드룽 본원 청정도 지수: ${report.primordialPurityIndex}점 (100점 만점)
- 핵심 보강 영혼 활력소: ${report.primaryVitality.name} (${report.primaryVitality.strengthScore}점)
- 5대 영혼 생명력(Vitality) 조화도:
${vitLines}
- 융드룽 불멸의 진언 칙령: "${report.yungdrungMantraDecree}"`;
}
