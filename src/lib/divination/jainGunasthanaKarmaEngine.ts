/**
 * =========================================================================
 * LUCKEY 고대 인도 자이나교(Jainism) 14 군아스타나 & 삼보(Ratnatraya) 카르마 엔진
 * (Jain 14 Gunasthanas Soul Evolution & Ratnatraya Karma Purification Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 고대 인도 정통 무소유·불살생 영적 전통인 자이나교(Jainism) 원전
 * 및 우마스와티(Umaswati)의 《타트바르타 수트라(Tattvartha Sutra)》.
 * 
 * 1. 14 군아스타나 (14 Gunasthanas - 영혼 진화의 14단계 영적 사다리):
 *    - 1단계: 미티야드리스티 (Mithyadrishti) - 망상과 물질적 집착의 국면
 *    - 4단계: 아비라타 사먀그드리스티 (Avirata Samyagdrishti) - 올바른 견해의 첫 각성
 *    - 5단계: 데샤비라타 (Deshavirata) - 부분적 절제와 자발적 규율
 *    - 6~7단계: 삼야타 (Samyata) - 흐트러짐 없는 완벽한 마음챙김과 정진
 *    - 8~10단계: 아푸르바 카라나 (Apurva Karana) - 미증유의 영적 에너지 유입과 번뇌 소진
 *    - 12~14단계: 크시나 카샤야 ~ 케발린 (Kevalin) - 궁극의 지혜와 열반(Moksha)
 * 2. 자이나 삼보 (Ratnatraya - 해탈에 이르는 세 가지 보물):
 *    - 정견 (Samyak Darshana) - 올바른 직관과 확고한 진리관
 *    - 정지 (Samyak Jnana) - 편견 없는 무구한 분별 지혜
 *    - 정행 (Samyak Charitra) - 조화롭고 해악 없는 일상의 실천
 * 3. 아힘사 (Ahimsa, 비폭력·생명 존중) 평화 지수 (0~100).
 * 4. 니르자라 (Nirjara, 묵은 카르마 소진) 정화 수련 가이드.
 */

import type { UserProfile } from '../sharedState';

export const JAIN_GUNASTHANA_KARMA_ENGINE_VERSION = '1.0.0';

export interface RatnatrayaBalance {
  darshanaScore: number; // 정견 (올바른 믿음/직관) 0~100
  jnanaScore: number; // 정지 (올바른 지식/분별) 0~100
  charitraScore: number; // 정행 (올바른 실천/조화) 0~100
  dominantTreasure: '정견 (Samyak Darshana)' | '정지 (Samyak Jnana)' | '정행 (Samyak Charitra)';
  dominantTreasureDescription: string;
}

export interface GunasthanaStage {
  stageNumber: number;
  stageNameSanskrit: string;
  stageNameKo: string;
  soulEvolutionState: string;
  spiritualGuidance: string;
}

export interface JainGunasthanaReport {
  engineVersion: string;
  calculatedAt: string;
  ahimsaPeaceIndex: number; // 아힘사(Ahimsa) 평화 지수 0~100
  activeStage: GunasthanaStage;
  ratnatraya: RatnatrayaBalance;
  nirjaraPurification: string; // 니르자라(Nirjara) 카르마 정화 실천
  jainWisdom: string;
}

const GUNASTHANA_STAGES: GunasthanaStage[] = [
  {
    stageNumber: 1,
    stageNameSanskrit: 'Mithyadrishti',
    stageNameKo: '미티야드리스티 (미혹과 물질적 환영)',
    soulEvolutionState: '외부 세상의 평가와 일시적 소유에 마음이 휘둘리기 쉬우나, 영혼 깊은 곳에서 진정한 깨어남을 갈망하는 시작점',
    spiritualGuidance: '보이는 현상에 일희일비하지 말고 내면의 고요한 관찰자로 물러나십시오.'
  },
  {
    stageNumber: 4,
    stageNameSanskrit: 'Avirata Samyagdrishti',
    stageNameKo: '사먀그드리스티 (올바른 통찰의 번뜩임)',
    soulEvolutionState: '무엇이 참되고 무엇이 허망한지 영혼이 직관적으로 알아차린 각성의 단계',
    spiritualGuidance: '마음에 깃든 영적 확신을 의심하지 마십시오. 당신은 이미 올바른 방향을 알고 있습니다.'
  },
  {
    stageNumber: 5,
    stageNameSanskrit: 'Deshavirata',
    stageNameKo: '데샤비라타 (부분적 절제와 자발적 조율)',
    soulEvolutionState: '알아차린 진리를 일상의 작은 습관과 언행에서 실제로 적용하기 시작하는 성숙의 과정',
    spiritualGuidance: '완벽을 강박적으로 요구하지 말고, 오늘 하루 하나의 불필요한 욕심을 내려놓는 것으로 충분합니다.'
  },
  {
    stageNumber: 7,
    stageNameSanskrit: 'Apramatta Samyata',
    stageNameKo: '아프라맛타 삼야타 (흠 없는 집중과 정진)',
    soulEvolutionState: '방심과 게으름을 털어내고 매 순간 영혼의 중심을 온전히 지키는 고도의 평온',
    spiritualGuidance: '잡다한 소음이 당신의 평화를 흔들지 못합니다. 지금 추진하는 핵심 과업에 맑은 집중을 쏟으십시오.'
  },
  {
    stageNumber: 8,
    stageNameSanskrit: 'Apurva Karana',
    stageNameKo: '아푸르바 카라나 (미증유의 새로운 영적 에너지)',
    soulEvolutionState: '이전에 경험하지 못한 새로운 차원의 지혜와 정서적 자유가 솟아오르는 비약적 도약',
    spiritualGuidance: '과거의 한계와 낡은 습관의 껍질이 부서지고 있습니다. 전례 없는 자유로운 가능성을 환영하십시오.'
  },
  {
    stageNumber: 10,
    stageNameSanskrit: 'Sukshma Samparaya',
    stageNameKo: '수크슈마 삼파라야 (미세한 집착의 잔재 정화)',
    soulEvolutionState: '거친 탐욕과 분노는 완전히 사라지고, 오직 미세한 무의식적 고집만이 남은 맑은 정수',
    spiritualGuidance: '마지막 남은 사소한 옳고 그름의 분별마저 대자연의 자비로운 품으로 흘려보내십시오.'
  },
  {
    stageNumber: 13,
    stageNameSanskrit: 'Sayoga Kevalin',
    stageNameKo: '사요가 케발린 (전지적 지혜와 절대 평화)',
    soulEvolutionState: '세상 한가운데 살아가면서도 만물의 인과와 본질을 거울처럼 맑게 비추는 지고의 자유',
    spiritualGuidance: '당신은 이미 온전합니다. 세상을 향해 대자대비의 따뜻한 온기만을 건네십시오.'
  }
];

/**
 * 사용자 프로필 및 타임스탬프를 기반으로
 * 자이나교 14 군아스타나와 삼보(Ratnatraya) 균형을 결정론적으로 연산합니다.
 */
export function calculateJainGunasthanaKarma(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
}): JainGunasthanaReport {
  const profile = options?.profile;
  const now = options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date();

  let seed = 2400; // 24대 티르탕카라 상징수

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 19 + (parts[1] || 1) * 29 + (parts[2] || 1) * 23;
  } else {
    seed += now.getFullYear() * 13 + (now.getMonth() + 1) * 31 + now.getDate() * 17;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 37 + (m || 0) * 11;
  }

  // 1. 아힘사(Ahimsa) 평화 지수 (55 ~ 98점 범위)
  const ahimsaPeaceIndex = 55 + (seed % 44);

  // 2. 삼보(Ratnatraya) 점수 산출
  const darshanaScore = 45 + ((seed * 7 + 13) % 52); // 정견
  const jnanaScore = 45 + ((seed * 11 + 29) % 52); // 정지
  const charitraScore = 45 + ((seed * 17 + 43) % 52); // 정행

  const ratnaList = [
    { name: '정견 (Samyak Darshana)' as const, score: darshanaScore, desc: '거짓된 겉모습에 속지 않고 사물의 본원적 실상을 꿰뚫는 올바른 안목' },
    { name: '정지 (Samyak Jnana)' as const, score: jnanaScore, desc: '감정적 편견과 고집을 내려놓고 명징하게 상황을 분별하는 순수한 지혜' },
    { name: '정행 (Samyak Charitra)' as const, score: charitraScore, desc: '타인에게 상처를 주지 않고 자신을 평화롭게 지켜내는 올바른 실천' }
  ];
  ratnaList.sort((a, b) => b.score - a.score);
  const dominant = ratnaList[0];

  const ratnatraya: RatnatrayaBalance = {
    darshanaScore,
    jnanaScore,
    charitraScore,
    dominantTreasure: dominant.name,
    dominantTreasureDescription: dominant.desc
  };

  // 3. 군아스타나 국면 선정
  const stageIdx = seed % GUNASTHANA_STAGES.length;
  const activeStage = GUNASTHANA_STAGES[stageIdx];

  // 4. 니르자라(Nirjara) 카르마 정화 실천
  const nirjaraPractices = [
    '말수를 절반으로 줄이고 불필요한 비판이나 언쟁을 내려놓는 마우나(Mauna, 묵언) 정화',
    '식사 전 한 끼의 음식이 내게 오기까지 수고한 모든 생명과 노동에 진심 어린 감사 바치기',
    '마음에 얹힌 과거의 서운함이나 억울함을 판단 없이 바라보고 가만히 흘려보내는 사마이카(Samayika) 명상',
    '내가 가진 소유물 중 당장 쓰지 않는 물건 하나를 이웃에게 베풀거나 정돈하는 아파리그라하(Aparigraha, 무소유) 실천'
  ];
  const nirjaraPurification = nirjaraPractices[seed % nirjaraPractices.length];

  const jainWisdom = `삼보 중 [${dominant.name}]의 빛이 강하게 발현되고 있으며, 군아스타나 제${activeStage.stageNumber}단계 [${activeStage.stageNameKo}]에 머물고 있습니다. ${activeStage.spiritualGuidance}`;

  return {
    engineVersion: JAIN_GUNASTHANA_KARMA_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    ahimsaPeaceIndex,
    activeStage,
    ratnatraya,
    nirjaraPurification,
    jainWisdom
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatJainGunasthanaKarmaPrompt(report: JainGunasthanaReport): string {
  const r = report.ratnatraya;
  const s = report.activeStage;

  return `[🪷 고대 인도 자이나교 14 군아스타나 & 삼보(Ratnatraya) 카르마 실측 데이터]
======================================================================
엔진 버전: ${report.engineVersion} | 연산 시각: ${report.calculatedAt}
아힘사(Ahimsa) 평화 지수: ${report.ahimsaPeaceIndex} / 100점
======================================================================
1. [영혼 진화의 사다리 (14 Gunasthanas)]:
   - 현재 영혼 국면: 제${s.stageNumber}단계 [${s.stageNameKo}] (${s.stageNameSanskrit})
   - 영적 상태 진단: ${s.soulEvolutionState}
   - 영혼 상승 지침: "${s.spiritualGuidance}"

2. [자이나 삼보(Ratnatraya) 조화 밸런스]:
   - 주재 영적 보물: [${r.dominantTreasure}]
   - 주재 특성: ${r.dominantTreasureDescription}
   - 삼보 세부 수치:
     * 정견 (Samyak Darshana · 바른 안목): ${r.darshanaScore}점
     * 정지 (Samyak Jnana · 바른 지혜): ${r.jnanaScore}점
     * 정행 (Samyak Charitra · 바른 실천): ${r.charitraScore}점

3. [니르자라(Nirjara) 카르마 정화 & 자이나 지혜]:
   - 카르마 소진 실천: ${report.nirjaraPurification}
   - 종합 해탈 조언: ${report.jainWisdom}
======================================================================`;
}
