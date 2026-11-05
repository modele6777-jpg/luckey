/**
 * =========================================================================
 * LUCKEY 고대 켈트 바드 탈리에신(Taliesin) 가마솥 & 아웬(Awen) 영감 엔진
 * (Celtic Welsh Bard Taliesin & Cauldron of Awen Inspiration Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 고대 켈트 웨일스의 전설적 대음유시인이자 예언자 탈리에신(Taliesin)의 서사시집
 * 《탈리에신의 책(Llyfr Taliesin)》 및 여신 케리드웬(Cerridwen)의 가마솥 신화 원전.
 * 
 * 1. 신성한 영감 아웬(Awen /|\)의 3대 광선(Three Rays of Divine Light):
 *    - 좌측 광선: 대자연과 대지, 여성적 직관과 감수성의 빛 (Nature & Intuition)
 *    - 중앙 광선: 인간과 사회, 현실의 진실과 정의의 균형 빛 (Truth & Balance)
 *    - 우측 광선: 천상과 태양, 창조적 비전과 불굴의 열정 빛 (Solar Vision & Passion)
 * 2. 탈리에신 4단계 영혼 변용(Fourfold Metamorphosis of Gwion Bach):
 *    - 산토끼 (Hare) - 기민한 위기 감지와 민첩한 방향 전환
 *    - 연어 (Salmon) - 지혜의 깊은 소(Pool)로 파고드는 심층적 통찰
 *    - 굴뚝새 (Wren) - 높은 상공에서 전체 판세를 읽는 거시적 조망
 *    - 곡식 이삭 (Grain) - 대지에 겸허히 뿌리내려 위대한 창조자로 거듭남
 * 3. 아웬(Awen) 창조적 몰입 및 혁신 지수 (0~100).
 * 4. 케리드웬의 가마솥(Cauldron of Cerridwen) 변용 처방 및 바드 신탁.
 */

import type { UserProfile } from '../sharedState';

export const CELTIC_AWEN_TALIESIN_ENGINE_VERSION = '1.0.0';

export interface AwenRaysBalance {
  natureRayScore: number; // 자연/직관의 빛 0~100
  truthRayScore: number; // 진실/균형의 빛 0~100
  solarRayScore: number; // 태양/창조의 빛 0~100
  dominantRay: '자연과 직관의 빛 (Nature & Intuition)' | '진실과 균형의 빛 (Truth & Balance)' | '태양과 창조의 빛 (Solar Vision & Passion)';
  dominantRayRole: string;
}

export interface MetamorphosisPhase {
  animalTotem: string;
  phaseTitle: string;
  strategicGift: string;
  bardicProclamation: string;
}

export interface CelticAwenTaliesinReport {
  engineVersion: string;
  calculatedAt: string;
  awenFlowIndex: number; // 아웬(Awen) 창조적 영감 몰입 지수 0~100
  awenRays: AwenRaysBalance;
  activeMetamorphosis: MetamorphosisPhase;
  cauldronPractice: string; // 가마솥 연단 실천
  taliesinProphecy: string;
}

const METAMORPHOSIS_PHASES: MetamorphosisPhase[] = [
  {
    animalTotem: '산토끼 (The Swift Hare)',
    phaseTitle: '민첩한 감지와 전광석화의 전환',
    strategicGift: '위험이나 정체의 조짐을 본능적으로 감지하고 망설임 없이 기민하게 방향을 트는 민첩성',
    bardicProclamation: '나는 들판을 달리는 산토끼였으니, 과거의 덫에 머물지 않고 번개처럼 새 길을 찾으리라.'
  },
  {
    animalTotem: '신성한 연어 (The Salmon of Wisdom)',
    phaseTitle: '심연의 잠수와 지혜의 원천 탐색',
    strategicGift: '소용돌이치는 표면의 혼란을 벗어나 가장 깊고 맑은 지혜의 바닥으로 침잠하는 통찰력',
    bardicProclamation: '나는 지혜의 헤이즐넛이 떨어진 깊은 강의 연어였으니, 침묵 속에서 만물의 비의를 삼켰노라.'
  },
  {
    animalTotem: '작은 굴뚝새 (The Sky-High Wren)',
    phaseTitle: '독수리의 날개에 올라탄 거시적 비상',
    strategicGift: '낮은 지상에 얽매이지 않고 높은 하늘로 솟구쳐 전체 판세와 맥락을 단숨에 조망하는 지략',
    bardicProclamation: '나는 하늘 가장 높은 곳을 비행하는 작은 새였으니, 가장 거대한 풍경을 한눈에 담았노라.'
  },
  {
    animalTotem: '황금 곡식 낟알 (The Golden Grain)',
    phaseTitle: '완전한 숙성과 부활의 재탄생',
    strategicGift: '일시적인 해체와 성장의 고통을 겸허히 수용하여 불멸의 빛을 발하는 위대한 창조자로의 도약',
    bardicProclamation: '나는 케리드웬의 가마솥을 거쳐 붉은 이삭이 되었으니, 다시 태어나 영원한 노래를 부르리라.'
  }
];

/**
 * 사용자 프로필 및 타임스탬프를 기반으로
 * 켈트 아웬(Awen) 3대 광선과 탈리에신 변용 국면을 결정론적으로 연산합니다.
 */
export function calculateCelticAwenTaliesin(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
}): CelticAwenTaliesinReport {
  const profile = options?.profile;
  const now = options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date();

  let seed = 570; // 6세기 역사적 탈리에신 활동 연대 상징수

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 23 + (parts[1] || 1) * 37 + (parts[2] || 1) * 19;
  } else {
    seed += now.getFullYear() * 17 + (now.getMonth() + 1) * 29 + now.getDate() * 19;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 31 + (m || 0) * 7;
  }

  // 1. 아웬(Awen) 창조적 몰입 지수 (58 ~ 99점 범위)
  const awenFlowIndex = 58 + (seed % 42);

  // 2. 아웬 3대 광선 수치 산출
  const natureRayScore = 45 + ((seed * 7 + 19) % 53);
  const truthRayScore = 45 + ((seed * 11 + 31) % 53);
  const solarRayScore = 45 + ((seed * 13 + 47) % 53);

  const rays = [
    { name: '자연과 직관의 빛 (Nature & Intuition)' as const, score: natureRayScore, role: '외부의 소음 없이 내면의 직관과 자연의 리듬을 예민하게 포착하는 힘' },
    { name: '진실과 균형의 빛 (Truth & Balance)' as const, score: truthRayScore, role: '현실적인 조건과 인간관계의 균형을 공정하고 단단하게 조율하는 힘' },
    { name: '태양과 창조의 빛 (Solar Vision & Passion)' as const, score: solarRayScore, role: '새로운 프로젝트와 미래 비전을 과감하게 세상에 펼쳐내는 영감' }
  ];
  rays.sort((a, b) => b.score - a.score);
  const dominantRay = rays[0];

  const awenRays: AwenRaysBalance = {
    natureRayScore,
    truthRayScore,
    solarRayScore,
    dominantRay: dominantRay.name,
    dominantRayRole: dominantRay.role
  };

  // 3. 변용 국면 선정
  const phaseIdx = seed % METAMORPHOSIS_PHASES.length;
  const activeMetamorphosis = METAMORPHOSIS_PHASES[phaseIdx];

  // 4. 가마솥 연단 실천
  const cauldronPractices = [
    '아침 시간 10분간 어떤 검열이나 퇴고도 없이 머릿속 생각을 자유롭게 적어 내려가는 아웬(Awen) 모닝 프리라이팅',
    '좋아하는 서정시나 영감을 주는 문장을 소리 내어 읊으며 언어의 음악적 울림을 가슴에 채우기',
    '따뜻한 물에 몸을 담그거나 손을 씻으며 케리드웬의 가마솥처럼 내면의 지혜를 뭉근히 달이는 시간 갖기',
    '현재 고민하는 문제를 낯선 은유나 비유로 바꾸어 생각해보며 고정된 관점을 허무는 바드적 상상력 훈련'
  ];
  const cauldronPractice = cauldronPractices[seed % cauldronPractices.length];

  const taliesinProphecy = `아웬의 세 광선 중 [${dominantRay.name}]이 찬란히 비추고 있습니다. 탈리에신의 변용 [${activeMetamorphosis.animalTotem}]의 기운으로: "${activeMetamorphosis.bardicProclamation}"`;

  return {
    engineVersion: CELTIC_AWEN_TALIESIN_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    awenFlowIndex,
    awenRays,
    activeMetamorphosis,
    cauldronPractice,
    taliesinProphecy
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatCelticAwenTaliesinPrompt(report: CelticAwenTaliesinReport): string {
  const r = report.awenRays;
  const m = report.activeMetamorphosis;

  return `[🔮 고대 켈트 바드 탈리에신(Taliesin) 가마솥 & 아웬(Awen) 영감 실측 데이터]
======================================================================
엔진 버전: ${report.engineVersion} | 연산 시각: ${report.calculatedAt}
아웬(Awen) 창조적 몰입 지수: ${report.awenFlowIndex} / 100점
======================================================================
1. [신성한 영감 아웬(Awen /|\\) 3대 광선]:
   - 주재 영감 광선: [${r.dominantRay}]
   - 주재 광선 역량: ${r.dominantRayRole}
   - 3대 광선 수치:
     * 자연과 직관의 빛 (Nature): ${r.natureRayScore}점
     * 진실과 균형의 빛 (Truth): ${r.truthRayScore}점
     * 태양과 창조의 빛 (Solar Vision): ${r.solarRayScore}점

2. [탈리에신 4단계 영혼 변용(Metamorphosis)]:
   - 현재 변용 국면: [${m.animalTotem}] - ${m.phaseTitle}
   - 전략적 선물: ${m.strategicGift}
   - 바드적 선언: "${m.bardicProclamation}"

3. [케리드웬 가마솥 처방 & 탈리에신 신탁]:
   - 가마솥 연단 실천: ${report.cauldronPractice}
   - 종합 영감 예언: ${report.taliesinProphecy}
======================================================================`;
}
