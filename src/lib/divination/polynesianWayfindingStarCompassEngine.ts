/**
 * 고대 폴리네시아·마우이 《웨이파인딩 32방위 스타 컴퍼스》 & 호쿠레아 신성 인도 & 오션 스웰 인생 항로 엔진
 *
 * LUCKEY-POLYNESIAN-WAYFINDING-v1.0.0
 *
 * 광활한 태평양을 기구와 나침반 없이 별, 파도의 맥박(스웰), 철새의 날갯짓, 구름의 색채만으로 건넜던
 * 고대 폴리네시아·하와이 마우이 항해가들의 전통 천문 항법 《웨이파인딩(Wayfinding)》에 기반한 인생 목적지 결정론 엔진.
 *
 * [핵심 천문 항법 및 대양 철학]
 * 1. 32방위 스타 컴퍼스 (Hawaiian Star Compass):
 *    - 4대 쿼드런트 (Four Quadrants of the Horizon):
 *      - 코올라우 (Koʻolau, 북동): 신성한 시작, 북동무역풍, 새벽의 비전
 *      - 말라나이 (Malanai, 남동): 온화한 결실, 풍요로운 수확, 순항의 기운
 *      - 코나 (Kona, 남서): 미지의 대양 돌파, 대담한 모험과 한계 극복
 *      - 호올루아 (Hoʻolua, 북서): 지혜로운 귀환, 안착, 영혼의 평온
 *    - 주요 하우스(Houses): 라(La, 태양), 아이나(ʻĀina, 육지), 노이오(Noio, 철새), 마누(Manu, 균형축), 날라니(Nālani, 하늘), 히나(Hina, 달)
 * 2. 신성한 천정 인도별 (Guiding Zenith Stars):
 *    - 호쿠레아 (Hōkūleʻa, 기쁨의 별 / 아크투루스): 하와이 제도를 비추는 희망의 등대
 *    - 마나이아칼라니 (Manaiakalani, 마우이의 낚싯바늘 / 전갈자리): 바다 속에서 새 섬을 낚아 올리는 창조 영력
 *    - 하나이아카말라마 (Hanaiakamalama, 남십자성): 남반구 대양의 확고한 나침반
 *    - 호쿠파아 (Hōkūpaʻa, 북극성): 북쪽 하늘에서 결코 흔들리지 않는 닻
 * 3. 오션 스웰 (Ocean Swell, 파도의 맥박):
 *    - 표면의 바람을 넘어 대양 깊은 곳에서 밀려오는 보이지 않는 해류와 파도의 결을 온몸으로 느끼는 직관적 감수성.
 * 4. 마우이 카누(Waʻa Kaulua) 정신:
 *    - 흔들리는 대양 위에서 목적지를 마음속에 품지 않으면 섬은 결코 솟아오르지 않는다 (The island emerges from the mind).
 */

import type { UserProfile } from '../sharedState';

export const POLYNESIAN_WAYFINDING_VERSION = '2.2.0';

export interface PolynesianWayfindingReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 웨이파인딩 5대 대양 지표 (0~100)
  oceanSwellSensitivityIndex: number; // 오션 스웰(파도 맥박) 감지력 및 잠재적 흐름 투시력
  wayfinderNavigationClarityScore: number; // 항해 비전 선명도 및 목적지 일치율
  voyagingCanoeBalanceResilience: number; // 쌍동선(Waʻa) 균형력 및 폭풍 내구성
  ancestralManaExplorationForce: number; // 조상 마나(Mana) 탐험 추진력 및 영적 자산
  islandFindingArrivalCertainty: number; // 신대륙(섬) 발견 및 목표 도달 확신도
  // 항법 요소
  primaryStarHouse: {
    hawaiianName: string;
    quadrant: string;
    meaningKo: string;
    navigationSign: string;
  };
  secondaryStarHouse: {
    hawaiianName: string;
    quadrant: string;
    meaningKo: string;
    navigationSign: string;
  };
  guidingZenithStar: {
    hawaiianName: string;
    westernConstellation: string;
    destinySignificance: string;
  };
  wayfinderSeaChantWisdom: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  wayfindingSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatWayfindingKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeWayfindingStage(score: number): string {
  if (score >= 84) return '호쿠레아 순항(Hōkūleʻa Clear) — 목적지 섬의 형상이 선명히 잡히고 오션 스웰이 순풍으로 맞물리는 항해기';
  if (score >= 70) return '와아 카울루아 균형(Waʻa Balance) — 파도의 맥박을 읽으며 쌍동선의 균형을 세밀히 조율하는 항해기';
  return '호쿠파아 정박(Hōkūpaʻa Anchor) — 안개 속에서 흔들리지 않는 북극성을 기준으로 호흡을 가다듬는 대기기';
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const STAR_HOUSES = [
  {
    hawaiianName: 'La (태양의 집)',
    quadrant: 'Koʻolau (북동 - 비전의 쿼드런트)',
    meaningKo: '생명력의 분출과 새로운 아침의 개막',
    navigationSign: '수평선 위로 솟구치는 붉은 여명과 함께 확고한 하루의 방향타를 잡음'
  },
  {
    hawaiianName: 'ʻĀina (육지의 집)',
    quadrant: 'Malanai (남동 - 풍요의 쿼드런트)',
    meaningKo: '안전한 정착과 풍요로운 영양의 대지',
    navigationSign: '구름 아래 비치는 에메랄드빛 환초의 반영을 보고 섬의 위치를 직감함'
  },
  {
    hawaiianName: 'Noio (바다제비의 집)',
    quadrant: 'Koʻolau (북동 - 인도의 쿼드런트)',
    meaningKo: '희망을 알리는 메신저와 정확한 징조',
    navigationSign: '해 질 녘 둥지로 돌아가는 새들의 비행 각도를 따라 목적지 섬으로 직진함'
  },
  {
    hawaiianName: 'Manu (새의 중심 날개)',
    quadrant: 'Kona (남서 - 모험의 쿼드런트)',
    meaningKo: '완벽한 무게중심과 대양의 균형',
    navigationSign: '거센 맞바람 속에서도 카누의 돛을 정밀히 조절하여 에너지를 추진력으로 전환함'
  },
  {
    hawaiianName: 'Nālani (하늘의 집)',
    quadrant: 'Hoʻolua (북서 - 지혜의 쿼드런트)',
    meaningKo: '지고한 영적 차원과 조상 영령의 가호',
    navigationSign: '은하수가 밤바다에 드리운 빛의 길을 따라 영혼의 안식처를 향해 항해함'
  },
  {
    hawaiianName: 'Hina (달의 여신의 집)',
    quadrant: 'Malanai (남동 - 감응의 쿼드런트)',
    meaningKo: '밀물과 썰물의 조화로운 리듬과 직관',
    navigationSign: '달빛이 바다 표면에 그리는 은빛 통로를 통해 밤의 암초를 안전하게 우회함'
  }
];

const GUIDING_STARS = [
  {
    hawaiianName: 'Hōkūleʻa (호쿠레아, 기쁨의 별)',
    westernConstellation: '목동자리 아크투루스 (Arcturus)',
    destinySignificance: '어두운 대양에서 목적지를 잃지 않게 비추는 지고의 기쁨과 영광'
  },
  {
    hawaiianName: 'Manaiakalani (마나이아칼라니, 마우이의 낚싯바늘)',
    westernConstellation: '전갈자리 (Scorpius)',
    destinySignificance: '깊은 절망의 심연에서 새로운 가능성의 대륙을 건져 올리는 불굴의 창조력'
  },
  {
    hawaiianName: 'Hōkūpaʻa (호쿠파아, 고정된 닻별)',
    westernConstellation: '작은곰자리 북극성 (Polaris)',
    destinySignificance: '어떤 파도와 폭풍에도 결코 흔들리지 않는 내면의 절대 기준과 신념'
  },
  {
    hawaiianName: 'Hānaiakamalama (하나이아카말라마, 남십자성)',
    westernConstellation: '남십자자리 (Crux)',
    destinySignificance: '미지의 남쪽 바다를 개척하는 대담한 탐험가들을 인도하는 성스러운 십자가'
  }
];

export function calculatePolynesianWayfinding(
  profile: UserProfile | null | undefined,
  query?: string,
  now: Date = new Date(),
): PolynesianWayfindingReport {
  const birthStr = profile?.basic?.birthdate || '1995-01-01';
  const nameStr = profile?.basic?.name || '내담자';
  const timeStr = profile?.basic?.birthtime || '12:00';

  const seed = djb2Hash(`${birthStr}_${nameStr}_${timeStr}_${query ?? ''}_polynesian_wayfinding`);

  const oceanSwellSensitivityIndex = 62 + (seed % 37);
  const wayfinderNavigationClarityScore = 65 + ((seed >> 2) % 34);
  const voyagingCanoeBalanceResilience = 58 + ((seed >> 4) % 41);
  const ancestralManaExplorationForce = 60 + ((seed >> 6) % 39);
  const islandFindingArrivalCertainty = 64 + ((seed >> 8) % 35);

  const primaryStarHouse = STAR_HOUSES[seed % STAR_HOUSES.length];
  const secondaryStarHouse = STAR_HOUSES[(seed + 1 + ((seed >> 5) % (STAR_HOUSES.length - 1))) % STAR_HOUSES.length];
  const guidingZenithStar = GUIDING_STARS[(seed >> 3) % GUIDING_STARS.length];

  let wayfinderSeaChantWisdom = '';
  if (islandFindingArrivalCertainty >= 85) {
    wayfinderSeaChantWisdom = '당신의 마음속에 이미 목적지 섬(Island)이 선명하게 떠올라 있습니다. 망망대해의 어떤 역풍과 파도도 당신의 항로를 흐트러뜨릴 수 없으니, 직관을 믿고 돛을 활짝 펼치십시오.';
  } else if (oceanSwellSensitivityIndex >= 80) {
    wayfinderSeaChantWisdom = '표면의 바람에 일희일비하지 마십시오. 대양 깊은 곳에서 밀려오는 오션 스웰(Ocean Swell)의 거대한 파도 결이 올바른 방향을 이미 당신의 온몸에 전달하고 있습니다.';
  } else {
    wayfinderSeaChantWisdom = '호쿠파아(북극성)와 마우이의 낚싯바늘을 주시하십시오. 삶의 무게중심을 낮추고 쌍동선의 균형을 잡으면, 보이지 않던 안개가 걷히고 곧 육지를 알리는 새들의 날갯짓을 보게 될 것입니다.';
  }

  const calculatedAtKst = formatWayfindingKstTimestamp(now);
  const q = query?.trim() || '';
  const reflectiveQuestion = q
    ? `'${q}'의 항로 위에서 지금 ${primaryStarHouse.hawaiianName}의 방향타와 ${secondaryStarHouse.hawaiianName}의 보조 징조 중 먼저 살필 바닷길은 무엇입니까?`
    : `지금 마음속에 품은 목적지 섬(${guidingZenithStar.hawaiianName})을 향해 ${primaryStarHouse.hawaiianName}의 돛을 어떻게 조율하시겠습니까?`;
  const interpretiveBoundary =
    '이 리딩은 고대 폴리네시아 웨이파인딩 스타 컴퍼스와 천정 인도별 상징에 빗댄 정성 성찰 비유이며, 실제 항해·이동·진로 결정을 대신하는 예측이 아닙니다.';
  const composite = Math.round(
    (oceanSwellSensitivityIndex + wayfinderNavigationClarityScore + voyagingCanoeBalanceResilience + ancestralManaExplorationForce + islandFindingArrivalCertainty) / 5
  );
  const wayfindingSynthesisMatrix = {
    dominantTension: `${primaryStarHouse.hawaiianName} ↔ ${secondaryStarHouse.hawaiianName} ↔ ${guidingZenithStar.hawaiianName}`,
    alignmentState: describeWayfindingStage(composite),
    integratedAction: `${primaryStarHouse.navigationSign}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: POLYNESIAN_WAYFINDING_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    oceanSwellSensitivityIndex,
    wayfinderNavigationClarityScore,
    voyagingCanoeBalanceResilience,
    ancestralManaExplorationForce,
    islandFindingArrivalCertainty,
    primaryStarHouse,
    secondaryStarHouse,
    guidingZenithStar,
    wayfinderSeaChantWisdom,
    ritualAction: `${primaryStarHouse.hawaiianName}의 방향을 기준점으로 삼아, 오늘 항로(${guidingZenithStar.hawaiianName})에서 흔들리지 않을 한 가지 행동을 지금 바로 정박하세요.`,
    reflectionFocus: `웨이파인딩(${primaryStarHouse.hawaiianName} ↔ ${secondaryStarHouse.hawaiianName}) — ${guidingZenithStar.hawaiianName}`,
    reflectiveQuestion,
    interpretiveBoundary,
    wayfindingSynthesisMatrix,
  };
}

export function formatPolynesianWayfindingPrompt(report: PolynesianWayfindingReport): string {
  const composite = Math.round(
    (report.oceanSwellSensitivityIndex + report.wayfinderNavigationClarityScore + report.voyagingCanoeBalanceResilience + report.ancestralManaExplorationForce + report.islandFindingArrivalCertainty) / 5
  );
  const lines = [
    `### 고대 폴리네시아 마우이 《웨이파인딩 32방위 스타 컴퍼스》 항해 엔진 (v${report.engineVersion})`,
    `- **연산 시각**: ${report.calculatedAtKst} | **항해 공명 국면**: ${describeWayfindingStage(composite)}`,
    `- **주요 항해 하우스 (Star House)**: ${report.primaryStarHouse.hawaiianName} [${report.primaryStarHouse.quadrant}]`,
    `  - *하우스 상징*: ${report.primaryStarHouse.meaningKo}`,
    `  - *항법 징표*: ${report.primaryStarHouse.navigationSign}`,
    `- **보조 교차 하우스**: ${report.secondaryStarHouse.hawaiianName} [${report.secondaryStarHouse.quadrant}] — ${report.secondaryStarHouse.meaningKo}`,
    `- **인도별 (Zenith Star)**: ${report.guidingZenithStar.hawaiianName} (${report.guidingZenithStar.westernConstellation})`,
    `  - *운명적 계시*: ${report.guidingZenithStar.destinySignificance}`,
    `- **웨이파인더 대양 지혜 잠언**: "${report.wayfinderSeaChantWisdom}"`,
    `- **실천 의례**: ${report.ritualAction}`,
    `- **성찰 초점**: ${report.reflectionFocus}`,
    `- **성찰 질문**: ${report.reflectiveQuestion}`,
  ];
  if (report.wayfindingSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.wayfindingSynthesisMatrix.dominantTension} | 조율 상태: ${report.wayfindingSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.wayfindingSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- **해석 경계**: ${report.interpretiveBoundary}`);
  return lines.join('\n');
}
