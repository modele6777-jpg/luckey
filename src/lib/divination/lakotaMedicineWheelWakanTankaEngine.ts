/**
 * 북미 원주민 라코타 수(Lakota Sioux)족 와칸 탕카(Wakan Tanka) & 4대 방향 성스러운 의약 휠(Sacred Medicine Wheel) & 미타쿠예 오야신(Mitakuye Oyasin) 조화 엔진
 *
 * LUCKEY-LAKOTA-MEDICINE-WHEEL-v1.0.0
 *
 * 북미 대평원의 라코타(Lakota), 다코타(Dakota), 나코타(Nakota) 수(Sioux) 연합의
 * 최고 영적 원전 《와칸 탕카(Wakan Tanka, 위대한 신비/위대한 영령)》와 성스러운 후프(Cangleska Wakan, Medicine Wheel),
 * 그리고 모든 존재의 상호 연결성을 천명하는 《미타쿠예 오야신(Mitakuye Oyasin, All My Relations)》에 기반한 결정론 계산 엔진.
 *
 * [핵심 수리 구조 및 비전 체계]
 * 1. 4대 성스러운 방위와 계절·원소·토템 영수:
 *    - 동쪽 (East, Wiyohiyanpata): 노랑(Yellow), 빛/공기, 봄, 일출, 새로운 비전, 지혜의 황금 독수리(Wanbli)
 *    - 남쪽 (South, Itokagata): 빨강(Red), 불/열정, 여름, 정오, 생명력, 신뢰와 온기의 사슴/늑대(Sungmanitu)
 *    - 서쪽 (West, Wiyopeyata): 검정(Black), 물/비, 가을, 일몰, 성찰, 내면의 치유와 흑곰(Mato)
 *    - 북쪽 (North, Waziyata): 흰색(White), 흙/대지, 겨울, 자정, 지혜와 인내, 순결과 풍요의 백색 들소/버팔로(Tatanka)
 * 2. 7대 성스러운 방향 (The Seven Sacred Directions):
 *    - 동, 남, 서, 북 (수평적 대지 순환)
 *    - 위 (Above, Mahpiya / 하늘 영령)
 *    - 아래 (Below, Ina Maka / 대지모신)
 *    - 안 (Within, Cante / 내면의 심장 중심)
 * 3. 미타쿠예 오야신 (Mitakuye Oyasin):
 *    - 하늘의 별, 땅의 흙, 날짐승, 네발짐승, 기어다니는 것, 헤엄치는 것, 풀과 나무, 바위와 인간이 모두 한 형제이자 친족임
 * 4. 4대 영적 미덕 (Lakota Four Cardinal Virtues):
 *    - 워치토그나케 (Wacantognaka, 관대함/나눔)
 *    - 워오히티카 (Wootitika, 용기/두려움 없음)
 *    - 칸테오그나케 (Cantognaka, 인내/꿋꿋함)
 *    - 윈시치야 (Wonsicya, 겸손/지혜)
 */

import type { UserProfile } from '../sharedState';

export const LAKOTA_MEDICINE_WHEEL_ENGINE_VERSION = '2.0.0';

export interface LakotaMedicineWheelReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 4대 방향 에너지 균형 (0~100)
  eastVisionClarityScore: number; // 동쪽 황금 독수리: 비전과 영적 각성
  southPassionTrustScore: number; // 남쪽 사슴/늑대: 열정과 신뢰·성장
  westIntrospectionHealingScore: number; // 서쪽 흑곰: 성찰과 내면 치유
  northEnduranceWisdomScore: number; // 북쪽 백색 들소: 인내와 원로 지혜
  // 4방위 메디슨 휠 통합 조화도
  medicineWheelBalanceIndex: number; // 4방 균형 지수 (0~100)
  // 7대 방향 중 가장 강하게 감응하는 축
  primarySacredDirection: {
    directionKo: string;
    lakotaTerm: string;
    elementAndColor: string;
    totemGuide: string;
    soulTeaching: string;
  };
  // 미타쿠예 오야신 및 4대 미덕
  mitakuyeOyasinInterconnectedness: number; // 만물 친족성 및 관계망 연결도 (0~100)
  activeCardinalVirtue: {
    virtueKo: string;
    lakotaName: string;
    meaning: string;
    practicalAction: string;
  };
  wakanTankaSacredGuidance: string;
  lakotaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatLakotaKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeLakotaStage(score: number): string {
  if (score >= 88) return '성스러운 원(Cangleska Wakan) — 4방위 영령과 미타쿠예 오야신 연대가 온전히 맞물린 조화기';
  if (score >= 76) return '대평원의 균형(Wakan Harmony) — 각 방위의 토템 지혜가 현실의 실천으로 이어지는 안정기';
  return '성찰의 회귀(Inipi Cleansing) — 숨을 고르고 내면의 심장 중심(Cante)을 정돈하는 준비기';
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const LAKOTA_DIRECTIONS = [
  {
    directionKo: '동쪽 (East) - 새로운 시작과 빛',
    lakotaTerm: 'Wiyohiyanpata',
    elementAndColor: '빛과 공기 / 노란색 (Yellow)',
    totemGuide: '황금빛 깃털의 독수리 (Wanbli)',
    soulTeaching: '새벽의 찬란한 태양이 떠오르듯, 지나간 과거의 어둠을 털어내고 새 비전과 직관의 날개를 펼치십시오.',
  },
  {
    directionKo: '남쪽 (South) - 순수한 열정과 신뢰',
    lakotaTerm: 'Itokagata',
    elementAndColor: '불과 온기 / 붉은색 (Red)',
    totemGuide: '순수한 신뢰와 협동의 늑대 (Sungmanitu Tanka)',
    soulTeaching: '여름날의 활력처럼 마음에 품은 뜻을 뜨겁게 꽃피우고, 의심 대신 순수한 믿음으로 동료들과 연대하십시오.',
  },
  {
    directionKo: '서쪽 (West) - 깊은 성찰과 내면 치유',
    lakotaTerm: 'Wiyopeyata',
    elementAndColor: '물과 천둥 / 검은색 (Black)',
    totemGuide: '동굴 속 고요한 힘을 품은 흑곰 (Mato)',
    soulTeaching: '가을의 수확 후 겨울을 준비하는 곰처럼, 분주한 발걸음을 멈추고 내면의 심연을 정직하게 대면하여 치유하십시오.',
  },
  {
    directionKo: '북쪽 (North) - 꿋꿋한 인내와 성스러운 지혜',
    lakotaTerm: 'Waziyata',
    elementAndColor: '흙과 설원 / 흰색 (White)',
    totemGuide: '눈보라를 정면으로 뚫고 나아가는 백색 버팔로 (Tatanka)',
    soulTeaching: '겨울의 맹렬한 추위 앞에서도 묵묵히 자리를 지키는 대지처럼, 꿋꿋한 인내와 순결한 지혜로 중심을 지키십시오.',
  },
];

const LAKOTA_CARDINAL_VIRTUES = [
  {
    virtueKo: '워치토그나케 (관대함과 나눔)',
    lakotaName: 'Wacantognaka',
    meaning: '가장 많이 가진 자가 부자가 아니라, 가장 많이 나누어 준 자가 가장 존경받는 부족의 영적 법도',
    practicalAction: '자신의 지식, 시간, 격려의 온기를 아끼지 말고 주변에 베푸십시오. 베푼 복락은 원형으로 돌아옵니다.',
  },
  {
    virtueKo: '워오히티카 (두려움 없는 용기)',
    lakotaName: 'Woohitika',
    meaning: '상황이 불리할지라도 진실과 정의, 소중한 공동체를 위해 담대히 나서는 전사의 기백',
    practicalAction: '회피하고 미뤄두었던 곤란한 문제를 오늘 정면으로 마주하십시오. 두려움을 넘어서면 문이 열립니다.',
  },
  {
    virtueKo: '칸테오그나케 (불굴의 인내)',
    lakotaName: 'Cantognaka',
    meaning: '모진 눈보라와 긴 겨울밤 속에서도 신념을 잃지 않고 침묵 속에 씨앗을 품는 끈기',
    practicalAction: '당장 결과가 보이지 않더라도 묵묵히 루틴과 기초를 이어가십시오. 얼어붙은 땅 밑에서 싹이 자라고 있습니다.',
  },
  {
    virtueKo: '윈시치야 (겸손과 삼가함)',
    lakotaName: 'Wonsicya',
    meaning: '모든 생명이 동등한 한울타리 가족(미타쿠예 오야신)임을 알아 자만하지 않고 고개 숙이는 성인의 마음',
    practicalAction: '스스로의 공적을 내세우지 말고 타인의 수고를 먼저 인정하십시오. 겸손할수록 영적 감응력은 깊어집니다.',
  },
];

export function calculateLakotaMedicineWheel(
  profile?: UserProfile | null,
  query?: string,
  now: Date = new Date(),
): LakotaMedicineWheelReport {
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_${query ?? ''}_lakota_wheel_v1`;
  const seed = djb2Hash(seedStr);

  const eastVisionClarityScore = 65 + (seed % 34);
  const southPassionTrustScore = 62 + ((seed >> 2) % 37);
  const westIntrospectionHealingScore = 64 + ((seed >> 4) % 35);
  const northEnduranceWisdomScore = 66 + ((seed >> 6) % 33);

  const scores = [eastVisionClarityScore, southPassionTrustScore, westIntrospectionHealingScore, northEnduranceWisdomScore];
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const medicineWheelBalanceIndex = Math.max(50, Math.round(100 - (maxScore - minScore) * 1.5));

  const primarySacredDirection = LAKOTA_DIRECTIONS[seed % LAKOTA_DIRECTIONS.length];
  const activeCardinalVirtue = LAKOTA_CARDINAL_VIRTUES[(seed >> 3) % LAKOTA_CARDINAL_VIRTUES.length];

  const mitakuyeOyasinInterconnectedness = 65 + ((seed >> 8) % 34);

  let wakanTankaSacredGuidance = '';
  if (medicineWheelBalanceIndex >= 85) {
    wakanTankaSacredGuidance = '동·남·서·북 4방위의 영령들이 완전한 성스러운 원(Medicine Wheel)을 그리며 조화롭게 회전하고 있습니다. 미타쿠예 오야신(모든 친족)의 가호가 함께합니다.';
  } else if (eastVisionClarityScore >= 80) {
    wakanTankaSacredGuidance = '동쪽 독수리의 높은 시야가 열려 있어 장기적 전략과 새로운 기획에 최적기입니다. 지상에 발을 디디며 비전을 펼치십시오.';
  } else if (westIntrospectionHealingScore >= 80) {
    wakanTankaSacredGuidance = '서쪽 흑곰의 통찰과 치유력이 강하게 요구됩니다. 잠시 외부 활동을 줄이고 내면의 상처를 보듬는 성찰의 시간을 가지십시오.';
  } else {
    wakanTankaSacredGuidance = '북쪽 들소의 꿋꿋함과 남쪽의 따스한 신뢰를 결합하여, 조급해하지 말고 하루하루의 발걸음에 정성을 다하십시오.';
  }

  const calculatedAtKst = formatLakotaKstTimestamp(now);
  const lakotaSynthesisMatrix = {
    dominantTension: `${primarySacredDirection.directionKo} ↔ ${activeCardinalVirtue.virtueKo}`,
    alignmentState: describeLakotaStage(medicineWheelBalanceIndex),
    integratedAction: `${activeCardinalVirtue.practicalAction}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: LAKOTA_MEDICINE_WHEEL_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    eastVisionClarityScore,
    southPassionTrustScore,
    westIntrospectionHealingScore,
    northEnduranceWisdomScore,
    medicineWheelBalanceIndex,
    primarySacredDirection,
    mitakuyeOyasinInterconnectedness,
    activeCardinalVirtue,
    wakanTankaSacredGuidance,
    lakotaSynthesisMatrix,
  };
}

export function formatLakotaMedicineWheelPrompt(report: LakotaMedicineWheelReport): string {
  const lines = [
    `[라코타 수(Lakota Sioux)족 와칸 탕카 & 4대 방향 성스러운 의약 휠(Medicine Wheel) 엔진]`,
    `- 연산 시각: ${report.calculatedAtKst} | 엔진: ${report.engineVersion}`,
    `- 메디슨 휠 균형 국면: ${describeLakotaStage(report.medicineWheelBalanceIndex)}`,
    `- 감응 성스러운 방향: ${report.primarySacredDirection.directionKo} [라코타명: ${report.primarySacredDirection.lakotaTerm}]`,
    `  * 상징 원소/색상: ${report.primarySacredDirection.elementAndColor} | 토템 영수: ${report.primarySacredDirection.totemGuide}`,
    `  * 영적 가르침: ${report.primarySacredDirection.soulTeaching}`,
    `- 활성화 4대 부족 미덕: ${report.activeCardinalVirtue.virtueKo} (${report.activeCardinalVirtue.lakotaName}) - ${report.activeCardinalVirtue.meaning}`,
    `  * 실천 지침: ${report.activeCardinalVirtue.practicalAction}`,
    `- 와칸 탕카(Wakan Tanka) 신성 조언: ${report.wakanTankaSacredGuidance}`,
  ];
  if (report.lakotaSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${report.lakotaSynthesisMatrix.dominantTension} | 조율 상태: ${report.lakotaSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${report.lakotaSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
