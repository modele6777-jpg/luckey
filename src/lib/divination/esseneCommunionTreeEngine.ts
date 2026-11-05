/**
 * =========================================================================
 * LUCKEY 고대 에세네파 14대 천사 교감 & 영혼 생명나무 조화 엔진
 * (Essene Angelic Communion & Tree of Life Harmony Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 사해 쿰란 공동체 에세네파(Essenes)의 평화의 복음(Essene Gospel of Peace) 원전.
 * 에세네파는 우주를 대지 어머니(Earthly Mother)와 천상 아버지(Heavenly Father)의
 * 성스러운 결합으로 보았으며, 인간의 영혼과 육신을 조화롭게 하기 위해
 * 아침(지상 천사)과 저녁(천상 천사)의 14대 천사 교감(Communion)을 실천했습니다.
 * 
 * 1. 7대 지상 어머니 천사 (Seven Earthly Mother Angels - 육신과 현실 감각 정화):
 *    - 태양의 천사 (Angel of Sun): 햇빛 생명력과 세포 활성화
 *    - 물의 천사 (Angel of Water): 감정 정화 및 체액 해독
 *    - 공기의 천사 (Angel of Air): 청정한 호흡과 맑은 정신
 *    - 대지의 천사 (Angel of Earth): 그라운딩과 육체적 안정성
 *    - 생명의 천사 (Angel of Life): 자연 치유력과 면역 재생
 *    - 기쁨의 천사 (Angel of Joy): 가슴의 환희와 감사
 *    - 어머니 대지 본체 (Earthly Mother): 모든 물질적 풍요와 생명의 자궁
 * 
 * 2. 7대 천상 아버지 천사 (Seven Heavenly Father Angels - 영혼과 고차원 의식 정화):
 *    - 지혜의 천사 (Angel of Wisdom): 직관적 통찰과 우주적 분별력
 *    - 사랑의 천사 (Angel of Love): 무조건적 자비와 관계의 치유
 *    - 힘의 천사 (Angel of Power): 영적 결단과 용기, 악습 타파
 *    - 영원한 생명의 천사 (Angel of Eternal Life): 불멸의 의식과 카르마 초월
 *    - 창조의 천사 (Angel of Work/Creation): 영감과 신성한 과업 완성
 *    - 평화의 천사 (Angel of Peace): 초월적 고요와 내적 안식
 *    - 천상 아버지 본체 (Heavenly Father): 순수 의식과 지고한 우주 근원
 * 
 * 3. 에세네 생명나무 삼위일체 순화 (Thought, Feeling, Action):
 *    - 생각의 순결 (Purity of Thought)
 *    - 감정의 온화 (Tenderness of Feeling)
 *    - 행동의 신성 (Righteousness of Action)
 */

import type { UserProfile } from '../sharedState';

export const ESSENE_COMMUNION_VERSION = 'LUCKEY-ESSENE-COMMUNION-v1.0.0';

export interface EsseneAngel {
  realm: 'earthly' | 'heavenly';
  koreanName: string;
  originalEsseneName: string;
  communionTime: string;          // 아침 교감 / 저녁 교감
  spiritualGift: string;           // 영적 은총 및 정화 효능
  contemplativeMantra: string;     // 일상 묵상 명상 구절
}

export interface EsseneTreeTrinity {
  thoughtPurityScore: number;     // 0 ~ 100 생각의 명료성
  feelingTendernessScore: number; // 0 ~ 100 감정의 자비/온화
  actionRighteousnessScore: number; // 0 ~ 100 행동의 올바름
  harmonicEquilibrium: string;    // 삼위일체 조화 상태
}

export interface EsseneCommunionReport {
  engineVersion: string;
  calculatedAt: string;
  morningEarthlyAngel: EsseneAngel;
  eveningHeavenlyAngel: EsseneAngel;
  treeTrinity: EsseneTreeTrinity;
  communionVibrationalScore: number; // 0 ~ 100 종합 교감 주파수
  dailyEsseneGuidance: string;
  synthesisMessage: string;
}

const EARTHLY_ANGELS: EsseneAngel[] = [
  {
    realm: 'earthly',
    koreanName: '태양의 천사',
    originalEsseneName: 'Angel of Sun',
    communionTime: '일출 및 아침 기상 시',
    spiritualGift: '피로와 우울을 녹이는 황금빛 생체 활력 및 미토콘드리아 세포 재생',
    contemplativeMantra: '태양의 천사여, 내 온몸의 혈관과 신경에 찬란한 생명의 빛을 채우소서.',
  },
  {
    realm: 'earthly',
    koreanName: '물의 천사',
    originalEsseneName: 'Angel of Water',
    communionTime: '아침 세안 및 첫 수분 섭취 시',
    spiritualGift: '마음의 앙금과 탁한 감정 해독, 유연하고 막힘없는 감정의 순환',
    contemplativeMantra: '물의 천사여, 내 내면의 모든 응어리와 탁기를 씻어내고 맑은 샘물을 흐르게 하소서.',
  },
  {
    realm: 'earthly',
    koreanName: '공기의 천사',
    originalEsseneName: 'Angel of Air',
    communionTime: '아침 첫 심호흡 및 환기 시',
    spiritualGift: '복잡한 번뇌의 정화, 폐와 뇌에 산소와 영적 영감을 공급하는 청명함',
    contemplativeMantra: '공기의 천사여, 신성한 숨결로 내 정신의 안개를 걷어내고 드넓은 자유를 주소서.',
  },
  {
    realm: 'earthly',
    koreanName: '대지의 천사',
    originalEsseneName: 'Angel of Earth',
    communionTime: '아침 첫 발을 내딛고 대지를 접할 때',
    spiritualGift: '불안을 잠재우는 강력한 그라운딩, 뼈와 근육의 안정감과 물질적 기반',
    contemplativeMantra: '대지의 천사여, 나를 굳건한 반석 위에 세우시고 흔들리지 않는 뿌리를 내리게 하소서.',
  },
  {
    realm: 'earthly',
    koreanName: '생명의 천사',
    originalEsseneName: 'Angel of Life',
    communionTime: '아침 첫 식사 및 자연과의 접촉 시',
    spiritualGift: '자연의 유기적 생명력 흡수, 면역력 극대화 및 자연 치유 본능 각성',
    contemplativeMantra: '생명의 천사여, 만물을 자라나게 하는 푸른 엽록소의 힘으로 내 오장을 소생시키소서.',
  },
  {
    realm: 'earthly',
    koreanName: '기쁨의 천사',
    originalEsseneName: 'Angel of Joy',
    communionTime: '아침 햇살 아래 미소 지을 때',
    spiritualGift: '가슴 차크라의 봉인을 풀고 일상의 사소한 순간에서 깊은 감사를 피워냄',
    contemplativeMantra: '기쁨의 천사여, 내 심장에 샘솟는 환희의 노래를 울리시고 삶을 축복으로 채우소서.',
  },
  {
    realm: 'earthly',
    koreanName: '어머니 대지의 천사',
    originalEsseneName: 'Angel of Earthly Mother',
    communionTime: '아침 고요한 자연 묵상 시',
    spiritualGift: '모든 결핍감을 채우는 모성적 영적 안도감과 풍요로운 자양분 공급',
    contemplativeMantra: '자애로운 대지 어머니여, 당신의 품 안에서 제 육신이 완벽한 조화를 누리나이다.',
  },
];

const HEAVENLY_ANGELS: EsseneAngel[] = [
  {
    realm: 'heavenly',
    koreanName: '지혜의 천사',
    originalEsseneName: 'Angel of Wisdom',
    communionTime: '일몰 및 저녁 사색 시',
    spiritualGift: '현상 너머의 본질을 꿰뚫어 보는 투명한 지적 통찰과 올바른 판단력',
    contemplativeMantra: '천상 지혜의 천사여, 우주의 숨은 이치를 밝히시어 미혹과 편견을 벗겨내소서.',
  },
  {
    realm: 'heavenly',
    koreanName: '사랑의 천사',
    originalEsseneName: 'Angel of Love',
    communionTime: '저녁 인간관계를 반추하고 화해할 때',
    spiritualGift: '비난과 분별심을 녹이는 무조건적인 자비, 상처 입은 인연의 매듭 봉합',
    contemplativeMantra: '천상 사랑의 천사여, 내 가슴의 불꽃을 키워 만인을 따스하게 품는 자비의 빛이 되게 하소서.',
  },
  {
    realm: 'heavenly',
    koreanName: '힘의 천사',
    originalEsseneName: 'Angel of Power',
    communionTime: '저녁 결단을 다지고 악습을 단절할 때',
    spiritualGift: '게으름과 유혹을 끊어내는 강철 같은 영적 의지력, 소명을 향한 결기',
    contemplativeMantra: '천상 힘의 천사여, 내 나약한 에고를 깨뜨리고 거룩한 진리를 향해 흔들림 없이 나아가게 하소서.',
  },
  {
    realm: 'heavenly',
    koreanName: '창조의 천사',
    originalEsseneName: 'Angel of Creative Work',
    communionTime: '저녁 하루의 과업을 마감하고 성찰할 때',
    spiritualGift: '노동을 신성한 예술로 승화시키는 높은 소명 의식과 집중력',
    contemplativeMantra: '천상 창조의 천사여, 내 손끝과 생각이 세상에 이로운 축복의 열매를 맺게 하소서.',
  },
  {
    realm: 'heavenly',
    koreanName: '영원한 생명의 천사',
    originalEsseneName: 'Angel of Eternal Life',
    communionTime: '저녁 별을 바라보며 유한성을 초월할 때',
    spiritualGift: '물질 세계의 한계를 넘어선 불멸의 자아 인식, 죽음과 상실에 대한 두려움 소멸',
    contemplativeMantra: '영원한 생명의 천사여, 시간의 속박을 넘어 영원무궁한 영혼의 근원에 닻을 내리게 하소서.',
  },
  {
    realm: 'heavenly',
    koreanName: '평화의 천사',
    originalEsseneName: 'Angel of Peace',
    communionTime: '취침 직전 깊은 이완과 침묵 속에서',
    spiritualGift: '세상의 소음을 잠재우는 절대적 심연의 고요, 신의 품에 안기는 평온한 수면',
    contemplativeMantra: '천상 평화의 천사여, 내 혼에 깊은 샬롬(Peace)을 내리시어 모든 시름을 거두어가소서.',
  },
  {
    realm: 'heavenly',
    koreanName: '천상 아버지의 천사',
    originalEsseneName: 'Angel of Heavenly Father',
    communionTime: '밤 깊은 침묵 속 지고의 명상 시',
    spiritualGift: '모든 피조물의 근원인 순수 영적 광명과의 합일, 절대적 신성한 가호',
    contemplativeMantra: '천상 아버지여, 제 영혼이 당신의 영원한 빛 안에 온전히 녹아드나이다.',
  },
];

export function calculateEsseneCommunion(profile?: UserProfile): EsseneCommunionReport {
  const now = new Date();
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Soul';

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 17 + nameStr.charCodeAt(i)) & 0x7fffffff;

  const dayOfYear = Math.floor((now.getTime() - new Date(now.getUTCFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const morningIdx = (seed + dayOfYear) % EARTHLY_ANGELS.length;
  const eveningIdx = (seed + dayOfYear + 3) % HEAVENLY_ANGELS.length;

  const morningEarthlyAngel = EARTHLY_ANGELS[morningIdx];
  const eveningHeavenlyAngel = HEAVENLY_ANGELS[eveningIdx];

  // 생명나무 삼위일체 지수 산출
  const thoughtPurityScore = 70 + ((seed + now.getUTCDate() * 7) % 28);
  const feelingTendernessScore = 68 + ((seed * 3 + now.getUTCHours() * 5) % 31);
  const actionRighteousnessScore = 72 + ((seed * 5 + now.getUTCDay() * 9) % 27);

  let harmonicEquilibrium = '생각·감정·행동의 세 기둥이 대지 어머니와 천상 아버지의 빛 아래 고르게 조화를 이루고 있습니다.';
  if (thoughtPurityScore > 90) {
    harmonicEquilibrium = '생각의 명료성이 극대화되어 지혜의 빛이 밝으니, 감정의 온기를 조금 더 채우면 완전무결합니다.';
  } else if (feelingTendernessScore > 90) {
    harmonicEquilibrium = '가슴의 사랑과 공감력이 충만하여 모든 인연을 치유하며, 행동의 단호함이 든든한 날개가 됩니다.';
  } else if (actionRighteousnessScore > 90) {
    harmonicEquilibrium = '행동의 실천력과 결단이 강력하게 현실을 구축하니, 저녁 평화의 천사와의 교감으로 영혼을 쉬어주세요.';
  }

  const communionVibrationalScore = Math.round(
    (thoughtPurityScore * 0.33) + (feelingTendernessScore * 0.33) + (actionRighteousnessScore * 0.34)
  );

  const dailyEsseneGuidance = `오늘 아침은 [${morningEarthlyAngel.koreanName}]과 교감하여 ${morningEarthlyAngel.spiritualGift}의 기운을 받고, 저녁에는 [${eveningHeavenlyAngel.koreanName}]의 은총으로 ${eveningHeavenlyAngel.spiritualGift}의 평온을 누리세요.`;

  const synthesisMessage = `에세네 평화의 복음 원전에 따라, 대지 어머니의 [${morningEarthlyAngel.koreanName}]과 천상 아버지의 [${eveningHeavenlyAngel.koreanName}]이 당신의 전인적 생명나무를 조화롭게 감싸고 있습니다 (영혼 교감도: ${communionVibrationalScore}점).`;

  return {
    engineVersion: ESSENE_COMMUNION_VERSION,
    calculatedAt: now.toISOString(),
    morningEarthlyAngel,
    eveningHeavenlyAngel,
    treeTrinity: {
      thoughtPurityScore,
      feelingTendernessScore,
      actionRighteousnessScore,
      harmonicEquilibrium,
    },
    communionVibrationalScore,
    dailyEsseneGuidance,
    synthesisMessage,
  };
}

export function formatEsseneCommunionPrompt(report: EsseneCommunionReport): string {
  return `### 🕊️ 에세네파 14대 천사 교감 & 영혼 생명나무 조화 엔진 (${ESSENE_COMMUNION_VERSION})
- **아침 지상 어머니 교감 천사**: **${report.morningEarthlyAngel.koreanName}** (${report.morningEarthlyAngel.originalEsseneName})
  - 교감 시점: ${report.morningEarthlyAngel.communionTime}
  - 영적 은총 및 정화: ${report.morningEarthlyAngel.spiritualGift}
  - 아침 묵상 명상문: "${report.morningEarthlyAngel.contemplativeMantra}"
- **저녁 천상 아버지 교감 천사**: **${report.eveningHeavenlyAngel.koreanName}** (${report.eveningHeavenlyAngel.originalEsseneName})
  - 교감 시점: ${report.eveningHeavenlyAngel.communionTime}
  - 영적 은총 및 정화: ${report.eveningHeavenlyAngel.spiritualGift}
  - 저녁 묵상 명상문: "${report.eveningHeavenlyAngel.contemplativeMantra}"
- **에세네 생명나무 삼위일체 순화 지수**:
  - 생각의 순결(Purity) ${report.treeTrinity.thoughtPurityScore}점 | 감정의 온화(Tenderness) ${report.treeTrinity.feelingTendernessScore}점 | 행동의 의로움(Righteousness) ${report.treeTrinity.actionRighteousnessScore}점
  - 삼위일체 균형 상태: ${report.treeTrinity.harmonicEquilibrium}
- **에세네 일일 나침반 (종합 교감도: ${report.communionVibrationalScore}점)**:
  - 실천 지침: ${report.dailyEsseneGuidance}
  - 통합 조언: ${report.synthesisMessage}`;
}
