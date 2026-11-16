/**
 * =========================================================================
 * LUCKEY 고대 메소포타미아 7대 행성 관문 & 이슈타르 지하세계 하강·부활 엔진
 * (Mesopotamian Seven Planetary Gates & Inanna Resurrection Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 인류 최고(最古)의 신화적 영웅 여정인 수메르·바빌로니아의
 * 『인안나(이슈타르)의 명계 하강과 귀환 (The Descent of Inanna)』에 전승된
 * 7대 고대 행성 관문(Seven Planetary Gates of the Netherworld) 체계를
 * 현대인의 극심한 시련, 박탈감, 소진 상태에 매핑하여, 내담자가 겪고 있는 상실이
 * 파멸이 아니라 불필요한 외적 갑옷을 벗고 진정한 내적 주권(Sovereignty)을 되찾는
 * 영적 부활의 통과의례임을 0ms 순수 수리로 해석합니다.
 * 
 * [7대 관문에서 벗어던지는 7가지 에고의 갑옷]
 * 1. 제1관문 (니누르타/토성의 문): 슈구라 왕관 반납 - 사회적 지위, 교만과 체면
 * 2. 제2관문 (나부/수성의 문): 청금석 목걸이 반납 - 언어적 통제욕과 지적 우월감
 * 3. 제3관문 (이슈타르/금성의 문): 이중 가슴 구슬 반납 - 관계에 대한 집착과 타인의 인정
 * 4. 제4관문 (샤마시/태양의 문): 황금 가슴가리개 반납 - 상처받지 않으려는 방어기제와 완고함
 * 5. 제5관문 (네르갈/화성의 문): 황금 팔찌 반납 - 힘과 권력에 대한 강박, 조급한 공격성
 * 6. 제6관문 (마르둑/목성의 문): 청금석 측정 막대 반납 - 옳고 그름을 따지는 가혹한 잣대
 * 7. 제7관문 (난나/달의 문): 여왕의 로브 반납 - 모든 외적 페르소나의 완전한 알몸화
 */

import type { UserProfile } from '../sharedState';

export const MESOPOTAMIAN_GATES_VERSION = 'LUCKEY-MESO-GATES-v2.1.0';

export interface PlanetaryGateInfo {
  gateNumber: number;
  gateNameAkkadian: string;
  planetaryDeity: string;
  surrenderedRegalia: string;   // 반납하는 외적 치장/갑옷
  spiritualEgoArmor: string;    // 내려놓아야 할 내면의 에고 집착
  resurrectionGift: string;     // 관문을 통과하며 얻는 참된 권능
}

export interface MesopotamianSevenGatesReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  activeGate: PlanetaryGateInfo;
  journeyPhase: '심연으로의 하강 (외적 껍질의 정화)' | '심연 최심부 (생명의 물을 기다리는 침묵)' | '지상으로의 찬란한 귀환 (왕권 회복과 부활)';
  sovereigntyResurrectionPower: number; // 0 ~ 100 진정한 자기 주권 부활력
  liberationTask: string;
  sevenGatesOracleGuidance: string;
  ancientSumerianBlessing: string;
  sevenGatesSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatSevenGatesKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeSevenGatesStage(score: number): string {
  if (score >= 86) return '인안나의 귀환(Inanna Ascent) — 불필요한 갑옷을 벗고 본래의 주권을 되찾는 부활기';
  if (score >= 70) return '심연의 정화(Abyss Purification) — 묵은 집착을 내려놓으며 내면의 중심을 세우는 전환기';
  return '생명의 물 대기(Living Water Pause) — 침묵 속에서 회복의 신호를 기다리는 성찰기';
}

const SEVEN_PLANETARY_GATES: PlanetaryGateInfo[] = [
  {
    gateNumber: 1,
    gateNameAkkadian: 'Bāb Ninurta (니누르타의 제1문)',
    planetaryDeity: '토성 (Ninurta / Chronos)',
    surrenderedRegalia: '슈구라(Shugurra)의 위대한 왕관',
    spiritualEgoArmor: '사회적 직함, 지위, 남들에게 그럴듯하게 보여야 한다는 체면과 자존심',
    resurrectionGift: '타인의 평가나 감투 없이도 스스로 당당하게 빛나는 본래적 위엄'
  },
  {
    gateNumber: 2,
    gateNameAkkadian: 'Bāb Nabû (나부의 제2문)',
    planetaryDeity: '수성 (Nabû / Hermes)',
    surrenderedRegalia: '청금석(Lapis Lazuli) 알의 목걸이',
    spiritualEgoArmor: '모든 상황을 말과 논리로 통제하려 드는 지적 우월감과 설득에 대한 강박',
    resurrectionGift: '말없이 침묵 속에서도 핵심을 전달하는 직관적이고 울림 있는 침묵의 힘'
  },
  {
    gateNumber: 3,
    gateNameAkkadian: 'Bāb Ištar (이슈타르의 제3문)',
    planetaryDeity: '금성 (Ištar / Aphrodite)',
    surrenderedRegalia: '가슴의 이중 구슬 끈',
    spiritualEgoArmor: '타인에게 사랑받지 못할까 봐 전전긍긍하는 의존성과 인정 욕망',
    resurrectionGift: '스스로를 온전히 사랑하고 아끼는 무조건적인 자기 자비와 자존감'
  },
  {
    gateNumber: 4,
    gateNameAkkadian: 'Bāb Šamaš (샤마시의 제4문)',
    planetaryDeity: '태양 (Šamaš / Apollo)',
    surrenderedRegalia: '황금 가슴가리개 갑옷',
    spiritualEgoArmor: '상처받지 않으려고 쌓아 올린 마음의 차가운 방어벽과 경직된 완벽주의',
    resurrectionGift: '상처받을 용기 속에서 피어나는 가장 따뜻하고 눈부신 솔직함'
  },
  {
    gateNumber: 5,
    gateNameAkkadian: 'Bāb Nergal (네르갈의 제5문)',
    planetaryDeity: '화성 (Nergal / Ares)',
    surrenderedRegalia: '황금 팔찌와 손목보호대',
    spiritualEgoArmor: '억지로 결과를 밀어붙이려는 무리한 힘의 과시와 분노, 조급증',
    resurrectionGift: '무리하게 애쓰지 않고도 세상의 흐름을 지휘하는 유연하고 부드러운 카리스마'
  },
  {
    gateNumber: 6,
    gateNameAkkadian: 'Bāb Marduk (마르둑의 제6문)',
    planetaryDeity: '목성 (Marduk / Zeus)',
    surrenderedRegalia: '청금석 측량 막대와 잣대',
    spiritualEgoArmor: '자신과 타인을 끊임없이 저울질하고 비판하는 가혹한 도덕적 검열',
    resurrectionGift: '있는 그대로의 불완전함을 너그럽게 품어주는 대인의 도량과 광활한 관용'
  },
  {
    gateNumber: 7,
    gateNameAkkadian: 'Bāb Nanna (난나의 제7문)',
    planetaryDeity: '달 (Nanna-Sin / Selene)',
    surrenderedRegalia: '여왕의 가장 화려한 로브 (Pala Garment)',
    spiritualEgoArmor: '최후의 방어선이었던 모든 외적 이미지와 가면(Persona)의 알몸화',
    resurrectionGift: '어떤 가면도 쓰지 않은 가장 순수하고 불멸하는 참된 영혼의 불꽃'
  }
];

export function calculateMesopotamianSevenGates(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  query?: string,
): MesopotamianSevenGatesReport {
  let birthSum = 10;
  let birthYear = 1991;
  let birthMonth = 6;
  let birthDay = 24;

  if (profile?.basic?.birthdate) {
    const digits = profile.basic.birthdate.replace(/\D/g, '');
    if (digits.length >= 8) {
      birthYear = parseInt(digits.slice(0, 4), 10);
      birthMonth = parseInt(digits.slice(4, 6), 10);
      birthDay = parseInt(digits.slice(6, 8), 10);
      birthSum = digits.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    }
  }

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();

  // 7대 관문 인덱스 도출 (0 ~ 6)
  const timeSeed = (targetYear * 365 + targetMonth * 29 + targetDay + birthSum) % 700;
  const gateIndex = (birthYear + birthMonth + birthDay + timeSeed) % 7;
  const activeGate = SEVEN_PLANETARY_GATES[gateIndex];

  // 여정 국면 판정
  let journeyPhase: MesopotamianSevenGatesReport['journeyPhase'];
  if (gateIndex <= 3) {
    journeyPhase = '심연으로의 하강 (외적 껍질의 정화)';
  } else if (gateIndex <= 5) {
    journeyPhase = '심연 최심부 (생명의 물을 기다리는 침묵)';
  } else {
    journeyPhase = '지상으로의 찬란한 귀환 (왕권 회복과 부활)';
  }

  // 자기 주권 부활력 점수 (55 ~ 99)
  const sovereigntyResurrectionPower = 55 + ((gateIndex * 6 + birthSum * 3 + timeSeed) % 45);

  const liberationTask = `현재 내담자가 통과 중인 [${activeGate.gateNameAkkadian}]에서는 [${activeGate.surrenderedRegalia}]을/를 반납해야 합니다. 즉, 삶에서 [${activeGate.spiritualEgoArmor}]을/를 내려놓을 때 비로소 [${activeGate.resurrectionGift}]이/가 당신의 참된 권능으로 되살아납니다.`;

  const sevenGatesOracleGuidance = `이슈타르 여신이 지하세계의 7대 관문을 지나며 모든 화려한 갑옷을 벗고 마침내 영원불멸한 지혜로 거듭났듯이, 지금 당신이 겪는 상실과 덜어냄은 축복입니다. 거추장스러운 껍질을 벗어던지는 것을 두려워하지 마세요.`;

  const ancientSumerianBlessing = `수메르 인안나의 축복: "모든 껍데기를 벗어던진 그대여, 이제 대지에 생명의 물이 뿌려지고 당신의 진짜 왕권이 회복되리라."`;

  const calculatedAtKst = formatSevenGatesKstTimestamp(targetDate);
  const sevenGatesSynthesisMatrix = {
    dominantTension: `${activeGate.gateNameAkkadian} (${activeGate.spiritualEgoArmor}) ↔ ${activeGate.resurrectionGift}`,
    alignmentState: describeSevenGatesStage(sovereigntyResurrectionPower),
    integratedAction: `${activeGate.resurrectionGift} 회복을 위해 ${activeGate.surrenderedRegalia} 집착 내려놓기${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: MESOPOTAMIAN_GATES_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    activeGate,
    journeyPhase,
    sovereigntyResurrectionPower,
    liberationTask,
    sevenGatesOracleGuidance,
    ancientSumerianBlessing,
    sevenGatesSynthesisMatrix,
    interpretiveBoundary: '본 메소포타미아 7대 행성 관문 리포트는 인안나 신화 상징에 기반한 정성적 내면 성찰 안내이며, 현실 사건의 확정적 예언이 아닙니다.',
  };
}

export function formatMesopotamianSevenGatesPrompt(report: MesopotamianSevenGatesReport): string {
  const lines = [
    `### 🏛️ 고대 메소포타미아 7대 행성 관문 & 이슈타르 지하세계 하강·부활 엔진 (${MESOPOTAMIAN_GATES_VERSION})`,
    `- **연산 시각**: ${report.calculatedAtKst} | **주권 부활 국면**: ${describeSevenGatesStage(report.sovereigntyResurrectionPower)}`,
    `- **현재 통과 중인 행성 관문**: 제${report.activeGate.gateNumber}관문 [${report.activeGate.gateNameAkkadian}]`,
    `  - 관문 수호신: ${report.activeGate.planetaryDeity}`,
    `  - 반납하는 장신구/갑옷: ${report.activeGate.surrenderedRegalia}`,
    `  - 내려놓아야 할 에고의 껍질: ${report.activeGate.spiritualEgoArmor}`,
    `  - 부활을 통해 얻는 참된 선물: ${report.activeGate.resurrectionGift}`,
    `- **영혼의 여정 국면**: ${report.journeyPhase}`,
    `- **관문 통과 해방 과제**: ${report.liberationTask}`,
    `- **7대 관문 신탁 지침**: ${report.sevenGatesOracleGuidance}`,
    `- **고대 수메르의 영적 축복**: "${report.ancientSumerianBlessing}"`,
  ];
  if (report.sevenGatesSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.sevenGatesSynthesisMatrix.dominantTension} | 조율 상태: ${report.sevenGatesSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.sevenGatesSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- **해석 경계**: ${report.interpretiveBoundary}`);
  return lines.join('\n');
}
