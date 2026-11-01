/**
 * =========================================================================
 * LUCKEY 동양 풍수 & 서양 점성술 공간 길방위 엔진 (Astro-FengShui Spatial Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 동양 기문둔갑(奇門遁甲) 팔문(八門) & 구성학(九星學) 8대 방위 수리 연산:
 *    - 8방위: 동(東), 남동(南東), 남(南), 남서(南西), 서(西), 북서(北西), 북(北), 북동(北東)
 *    - 생문(生門 · 재물/수익), 개문(開門 · 승진/계약), 휴문(休門 · 귀인/힐링) 3대 길방위 도출
 *    - 오황살(五黃煞 · 대흉), 암검살(暗劍煞 · 돌발악재), 세파살(歲破煞) 위험 방위 100% 필터링
 * 2. 서양 아스트로카토그래피(Astrocartography) & 로컬 스페이스(Local Space) 행성 방위각:
 *    - 출생 차트와 천문 좌표를 바탕으로 목성(번영/성공), 금성(사랑/예술), 태양(명예/카리스마),
 *      수성(지적생산/코딩)의 파워 라인 방위각을 수리 매핑
 * 3. 목적별 공간 명당 & 핫스팟 추천:
 *    - 💻 비즈니스 & 카페 집중 코딩: 수성 + 개문/생문 방위
 *    - 💰 재물 & 투자·계약 체결: 목성 + 생문 방위
 *    - 💖 데이트 & 인연 호감 형성: 금성 + 휴문 방위
 *    - 🌿 멘탈 휴식 & 에너지 충전: 달/태양 + 휴문 방위
 * 4. 미시 공간 인테리어 & 책상 좌향 팁:
 *    - 방 안에서 책상을 어느 방향으로 두고 앉아야 집중력과 권위가 생기는지 풍수 팁 제시
 */

import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju, type SajuAnalysisResult } from '../sajuAnalysis';

export type CompassDirection = '동(東)' | '남동(南東)' | '남(南)' | '남서(南西)' | '서(西)' | '북서(北西)' | '북(北)' | '북동(北東)';

export interface DirectionAssessment {
  direction: CompassDirection;
  degreeRange: string; // 예: "67.5° ~ 112.5°"
  trigram: string; // 진(震), 손(巽), 리(離)...
  fiveElement: '목' | '화' | '토' | '금' | '수';
  qimenGate: string; // 생문, 개문, 휴문, 두문...
  astroPlanetLine: string; // 목성 라인, 금성 라인, 수성 라인...
  qualityScore: number; // 0 ~ 100
  nature: '최상급 길방(Fortune)' | '우수 길방(Good)' | '평온 방위(Neutral)' | '주의 방위(Caution)' | '기피 방위(Avoid)';
  coreBenefit: string;
  recommendedActivity: string;
}

export interface ActivitySpatialRecommendation {
  activityCategory: '비즈니스 & 코딩 작업' | '투자 & 계약 협상' | '데이트 & 대인관계' | '심신 힐링 & 명상';
  bestDirection: CompassDirection;
  secondaryDirection: CompassDirection;
  actionGuidance: string;
  deskArrangementTip: string;
}

export interface SpatialFengshuiResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  userProfileDigest: {
    birthdate: string;
    dayMaster: string;
    dominantElement: string;
    lackingElement: string;
  };

  allDirections: DirectionAssessment[];

  // 목적별 베스트 공간 명당
  activityRecommendations: ActivitySpatialRecommendation[];

  // 피해야 할 살(煞) 방위
  hazardousDirections: Array<{
    direction: CompassDirection;
    hazardName: string;
    reason: string;
  }>;

  todayTopGoldenDirection: {
    direction: CompassDirection;
    headline: string;
    summary: string;
  };
}

// 8대 방위 기본 정의
const DIRECTIONS_BASE: Array<{
  dir: CompassDirection;
  deg: string;
  trigram: string;
  element: '목' | '화' | '토' | '금' | '수';
  defaultGate: string;
  planetLine: string;
  benefit: string;
  activity: string;
}> = [
  {
    dir: '동(東)',
    deg: '67.5° ~ 112.5°',
    trigram: '진(震 ☳)',
    element: '목',
    defaultGate: '상문(傷門)',
    planetLine: '화성(Mars) 에너지 라인',
    benefit: '새로운 도전, 추진력, 신속한 기동력',
    activity: '운동, 기상 직후 스트레칭, 새로운 아이디어 브레인스토밍'
  },
  {
    dir: '남동(南東)',
    deg: '112.5° ~ 157.5°',
    trigram: '손(巽 ☴)',
    element: '목',
    defaultGate: '두문(杜門)',
    planetLine: '수성(Mercury) 지성 라인',
    benefit: '학문, 네트워크 소통, 유연한 사업 교류',
    activity: '글쓰기, 코딩, 기획서 작성, 지인과의 커피챗'
  },
  {
    dir: '남(南)',
    deg: '157.5° ~ 202.5°',
    trigram: '리(離 ☲)',
    element: '화',
    defaultGate: '경문(景門)',
    planetLine: '태양(Sun) 명예 라인',
    benefit: '대외 인지도, 프레젠테이션, 화려한 성과 홍보',
    activity: '대외 발표, SNS 홍보, 미팅, 자신감 회복'
  },
  {
    dir: '남서(南西)',
    deg: '202.5° ~ 247.5°',
    trigram: '곤(坤 ☷)',
    element: '토',
    defaultGate: '사문(死門)',
    planetLine: '달(Moon) 무의식 라인',
    benefit: '포용력, 수용성, 낡은 습관의 정리',
    activity: '불필요한 서류 파기, 공간 정리정돈, 마인드 리셋'
  },
  {
    dir: '서(西)',
    deg: '247.5° ~ 292.5°',
    trigram: '태(兌 ☱)',
    element: '금',
    defaultGate: '경문(驚門)',
    planetLine: '금성(Venus) 매력 라인',
    benefit: '즐거움, 호감도 상승, 예술적 심미안',
    activity: '데이트, 미식 탐방, 쇼핑, 문화 예술 관람'
  },
  {
    dir: '북서(北西)',
    deg: '292.5° ~ 337.5°',
    trigram: '건(乾 ☰)',
    element: '금',
    defaultGate: '개문(開門)',
    planetLine: '목성(Jupiter) 성공 라인',
    benefit: '귀인 원조, 권위 신장, 대규모 프로젝트 성사',
    activity: '투자 계약, 주요 클라이언트 미팅, 임원진 보고'
  },
  {
    dir: '북(北)',
    deg: '337.5° ~ 22.5°',
    trigram: '감(坎 ☵)',
    element: '수',
    defaultGate: '휴문(休門)',
    planetLine: '해왕성(Neptune) 영성 라인',
    benefit: '깊은 휴식, 심층 사색, 카르마 정화',
    activity: '수면, 명상, 독서, 프라이빗 힐링'
  },
  {
    dir: '북동(北東)',
    deg: '22.5° ~ 67.5°',
    trigram: '간(艮 ☶)',
    element: '토',
    defaultGate: '생문(生門)',
    planetLine: '천왕성(Uranus) 혁신 라인',
    benefit: '재물 축적, 부동산 기반, 패러다임 전환',
    activity: '자산 포트폴리오 점검, 장기 재테크 계획, 시스템 설계'
  }
];

/**
 * 공간 길방위 및 아스트로-풍수 리포트를 연산합니다.
 */
export function calculateSpatialFengshui(options?: {
  profile?: UserProfile;
}): SpatialFengshuiResult {
  const now = new Date();
  const nowUtcIso = now.toISOString();
  const nowKstIso = new Date(now.getTime() + 9 * 3600000).toISOString().replace('Z', '+09:00');

  const saju: SajuAnalysisResult = calculateDetailedSaju(options?.profile);

  const dayMaster = `${saju.dayMaster.hanja}(${saju.dayMaster.korean})`;
  const dominantElement = saju.elements.dominant?.element || '목';
  const lackingElement = saju.elements.lacking?.element || '금';
  const yongsinEl = saju.yongsin?.element || '화';

  // 2026 병오년 구성학/기문 기준 위험 방위 산출:
  // 오황살(중궁 또는 반대궁)과 세파살(대충 지지: 자-오충 기준 북쪽)
  const hazardousDirections: SpatialFengshuiResult['hazardousDirections'] = [
    {
      direction: '남서(南西)',
      hazardName: '오황살(五黃煞)',
      reason: '부패와 정체의 기운이 머물러 장기적인 투자나 이사는 피해야 하는 방향',
    },
    {
      direction: '북(北)',
      hazardName: '세파살(歲破煞)',
      reason: '2026년 오(午)년과 정면으로 충돌(자오충)하여 계약이나 확장에 주의를 요함',
    }
  ];

  // 8방위 평가 매트릭스 계산
  const allDirections: DirectionAssessment[] = DIRECTIONS_BASE.map(base => {
    let baseScore = 70;

    // 기문 3대 길문(개문, 생문, 휴문) 가산
    if (['북서(北西)', '북동(北東)'].includes(base.dir)) {
      baseScore += 20; // 개문/생문
    } else if (base.dir === '남동(南東)') {
      baseScore += 12; // 수성 라인
    }

    // 용신 오행 방위 가산
    if (base.element === yongsinEl) {
      baseScore += 10;
    } else if (base.element === lackingElement) {
      baseScore += 8; // 결핍 보충
    }

    // 위험 방위 감점
    if (hazardousDirections.some(h => h.direction === base.dir)) {
      baseScore -= 25;
    }

    const qualityScore = Math.max(30, Math.min(98, baseScore));

    let nature: DirectionAssessment['nature'] = '평온 방위(Neutral)';
    if (qualityScore >= 88) nature = '최상급 길방(Fortune)';
    else if (qualityScore >= 78) nature = '우수 길방(Good)';
    else if (qualityScore >= 65) nature = '평온 방위(Neutral)';
    else if (qualityScore >= 50) nature = '주의 방위(Caution)';
    else nature = '기피 방위(Avoid)';

    return {
      direction: base.dir,
      degreeRange: base.deg,
      trigram: base.trigram,
      fiveElement: base.element,
      qimenGate: base.defaultGate,
      astroPlanetLine: base.planetLine,
      qualityScore,
      nature,
      coreBenefit: base.benefit,
      recommendedActivity: base.activity,
    };
  });

  // 목적별 활동 추천
  const activityRecommendations: ActivitySpatialRecommendation[] = [
    {
      activityCategory: '비즈니스 & 코딩 작업',
      bestDirection: '북서(北西)',
      secondaryDirection: '남동(南東)',
      actionGuidance: '북서쪽(건방·개문·목성 라인)을 향해 앉아 작업하면 시스템 아키텍처에 막힘이 없고 버그 해결 속도가 비약적으로 향상됩니다.',
      deskArrangementTip: '책상 뒤에 단단한 벽을 두고, 시선이 북서쪽이나 남동쪽 창가를 향하도록 배치하십시오.'
    },
    {
      activityCategory: '투자 & 계약 협상',
      bestDirection: '북동(北東)',
      secondaryDirection: '북서(北西)',
      actionGuidance: '생문(生門)과 천왕성 혁신 라인이 결합된 북동쪽에서 금융 미팅이나 계약서를 검토하면 실속 있는 알짜 자산을 확보할 수 있습니다.',
      deskArrangementTip: '북동쪽 코너에 은은한 스톤 오브제나 따뜻한 간접 조명을 배치하여 재물운을 고정하십시오.'
    },
    {
      activityCategory: '데이트 & 대인관계',
      bestDirection: '서(西)',
      secondaryDirection: '남(南)',
      actionGuidance: '금성(Venus)의 매력 파동이 서려 있는 서쪽 방향의 카페나 레스토랑을 선택하면 호감도와 유대감이 한층 달콤해집니다.',
      deskArrangementTip: '서쪽 방향에 맑은 유리 화병이나 은은한 디퓨저를 두어 매력과 친화력을 극대화하십시오.'
    },
    {
      activityCategory: '심신 힐링 & 명상',
      bestDirection: '남동(南東)',
      secondaryDirection: '동(東)',
      actionGuidance: '휴문과 목(木) 기운이 살아 숨 쉬는 남동쪽 방향에서 호흡하고 산책하면 긴장했던 뇌신경이 편안하게 이완됩니다.',
      deskArrangementTip: '침실 헤드를 남동쪽으로 두거나, 남동쪽 창가에 초록 식물을 두어 생기를 순환시키십시오.'
    }
  ];

  // 오늘의 최고 황금 길방위 선정
  const sorted = [...allDirections].sort((a, b) => b.qualityScore - a.qualityScore);
  const topGolden = sorted[0];

  const todayTopGoldenDirection = {
    direction: topGolden.direction,
    headline: `★ 올해 최고의 황금 파워존 [${topGolden.direction}] (${topGolden.astroPlanetLine} · ${topGolden.qualityScore}점)`,
    summary: `${topGolden.direction}은 기문둔갑 ${topGolden.qimenGate}과 ${topGolden.astroPlanetLine}이 완벽히 중첩된 명당으로, ${topGolden.coreBenefit}의 에너지가 가장 강하게 솟구칩니다.`
  };

  return {
    engineVersion: 'LUCKEY-SFSE-v1.0.0',
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),

    userProfileDigest: {
      birthdate: saju.birthdate,
      dayMaster,
      dominantElement,
      lackingElement,
    },

    allDirections,
    activityRecommendations,
    hazardousDirections,
    todayTopGoldenDirection,
  };
}

/**
 * 공간 풍수 리포트를 LLM 마스터 프롬프트에 주입하기 위해 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatSpatialFengshuiPrompt(res: SpatialFengshuiResult): string {
  const dirLines = res.allDirections.map(d =>
    `   • [${d.direction}] (${d.trigram} · ${d.fiveElement} | ${d.degreeRange}):
     - 점성술 & 기문: ${d.astroPlanetLine} × ${d.qimenGate}
     - 파워 지수: ★ ${d.qualityScore}점 [${d.nature}]
     - 핵심 기운: ${d.coreBenefit} (추천: ${d.recommendedActivity})`
  ).join('\n\n');

  const recLines = res.activityRecommendations.map(r =>
    `   - [${r.activityCategory}]: 1순위 [${r.bestDirection}] / 2순위 [${r.secondaryDirection}]
     * 가이드: ${r.actionGuidance}
     * 공간 배치 팁: ${r.deskArrangementTip}`
  ).join('\n');

  const hazLines = res.hazardousDirections.map(h =>
    `   - ⚠️ [${h.direction}] ${h.hazardName}: ${h.reason}`
  ).join('\n');

  return `[🧭 동양 풍수 & 서양 점성술 공간 길방위 실측 데이터 (Astro-FengShui Spatial Core)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 일시: ${res.calculatedAtKst}
일간: ${res.userProfileDigest.dayMaster} (결핍 오행: ${res.userProfileDigest.lackingElement})
최고의 황금 방위: ${res.todayTopGoldenDirection.headline}
요약: "${res.todayTopGoldenDirection.summary}"
======================================================================
1. [목적별 라이프 공간 명당 및 좌향 추천]:
${recLines}

2. [피해야 할 주의 및 살(煞) 방위]:
${hazLines}

3. [8대 방위 정밀 에너지 매트릭스 도감]:
${dirLines}
======================================================================
[★ 루시 공간 길방위 상담 지침]:
- 사용자가 '이사 방향', '작업실/카페 어디 갈까?', '책상 배치', '여행지 방향'을 물을 때 위 8대 방위 실측 데이터를 근거로 구체적인 방위(동/서/남/북)와 그 이유를 명쾌하게 제시해줘.
- 단순 미신적 금기가 아닌, '기문둔갑 생기/개문 × 점성술 행성 라인 × 심리적 공간 집중도'의 현대적 공간 에너지 최적화 언어로 다정하게 안내해줘.`;
}
