/**
 * =========================================================================
 * LUCKEY 도교 내단 양생 & 진기 순환 경락 시계 엔진 (Taoist Neidan Meridian Qi Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 고대 도교 전통 내단학(內丹學)의 핵심인 삼보(三寶: 정 精, 기 氣, 신 神)의 연단 체계와
 * 한의학 및 도가의 자오유주(子午流注: 12시진 12경락 기혈 순환 생체 시계),
 * 임독이맥(任督二脈)을 관통하는 소주천(小周天 Microcosmic Orbit) 기혈 순환론을
 * 사주 일간(Day Master)과 오행 및 현재 시진(Hour)에 결합한 결정론적 생체 양생 엔진입니다.
 * 
 * 1. 삼보(三寶: 정·기·신) 축적도 & 3단전(하·중·상단전) 에너지 밸런스
 * 2. 자오유주 12경락 활성 주기 및 소주천 3대 관문(미려, 협척, 옥침) 통기성 진단
 * 3. 180초 단전 기공 호흡 처방 및 도가 양생 지혜 도출
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const TAOIST_NEIDAN_VERSION = 'LUCKEY-TAOIST-NEIDAN-v2.2.0';

function formatNeidanKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface ThreeTreasuresLevel {
  jingLevelScore: number;         // 정(精): 신장 수기, 육체적 활력과 면역 원천 (0 ~ 100)
  qiLevelScore: number;           // 기(氣): 비위 소화기, 일상 호흡과 생명 순환력 (0 ~ 100)
  shenLevelScore: number;         // 신(神): 심장 화기, 정신의 명징함과 영적 직관 (0 ~ 100)
  predominantTreasureState: string; // 현재 삼보의 연단 단계 (연정화기, 연기화신, 연신환허)
}

export interface MeridianCirculationStatus {
  activeMeridianName: string;     // 자오유주 현재/주도 활성 경락
  meridianOrganSystem: string;    // 주관 장부 시스템
  optimalTimeWindow: string;      // 자오유주 최적 시간대
  microcosmicOrbitGate: string;   // 소주천 순환 집중 통기 관문 (미려관, 협척관, 옥침관, 단중, 인당)
  meridianVitalityIndex: number;  // 경락 기혈 순환 지수 (0 ~ 100)
}

export interface TaoistNeidanMeridianReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  dantianArchetype: string;       // 단전 에너지 아키타입
  threeTreasures: ThreeTreasuresLevel;
  meridianCirculation: MeridianCirculationStatus;
  secondaryMeridian: {
    activeMeridianName: string;
    meridianOrganSystem: string;
    optimalTimeWindow: string;
  };
  neidanBreathingPrescription: {
    methodName: string;
    targetDantian: string;        // 하단전 / 중단전 / 상단전
    practiceSteps: string;
    durationMinutes: number;
  };
  taoistAlchemyWisdom: string;
  synthesisPromptGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  neidanSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export function runTaoistNeidanMeridianEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): TaoistNeidanMeridianReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 시진 계산 (자오유주 12경락)
  const hour = targetDate.getHours();
  // 자(23~01), 축(01~03), 인(03~05), 묘(05~07), 진(07~09), 사(09~11),
  // 오(11~13), 미(13~15), 신(15~17), 유(17~19), 술(19~21), 해(21~23)
  const timeSlot = Math.floor(((hour + 1) % 24) / 2);

  const meridians = [
    { name: '족소양담경 (Gallbladder)', organ: '담낭 (결단과 해독)', window: '자시 (23:00 ~ 01:00)' },
    { name: '족궐음간경 (Liver)', organ: '간장 (혈액 저장과 해독)', window: '축시 (01:00 ~ 03:00)' },
    { name: '수태음폐경 (Lung)', organ: '폐장 (종기 순환과 호흡)', window: '인시 (03:00 ~ 05:00)' },
    { name: '수양명대장경 (Large Intestine)', organ: '대장 (비움과 배출)', window: '묘시 (05:00 ~ 07:00)' },
    { name: '족양명위경 (Stomach)', organ: '위장 (영양 흡수와 수곡지기)', window: '진시 (07:00 ~ 09:00)' },
    { name: '족태음비경 (Spleen)', organ: '비장 (후천지본 기혈 생성)', window: '사시 (09:00 ~ 11:00)' },
    { name: '수소음심경 (Heart)', organ: '심장 (군주지관과 신명)', window: '오시 (11:00 ~ 13:00)' },
    { name: '수태양소장경 (Small Intestine)', organ: '소장 (청탁 판별과 분별)', window: '미시 (13:00 ~ 15:00)' },
    { name: '족태양방광경 (Bladder)', organ: '방광 (진액 대사와 체온)', window: '신시 (15:00 ~ 17:00)' },
    { name: '족소음신경 (Kidney)', organ: '신장 (선천지원과 원기 보존)', window: '유시 (17:00 ~ 19:00)' },
    { name: '수궐음심포경 (Pericardium)', organ: '심포 (심장 보호와 혈맥 순환)', window: '술시 (19:00 ~ 21:00)' },
    { name: '수소양삼초경 (Triple Burner)', organ: '삼초 (수분 대사와 체온 총괄)', window: '해시 (21:00 ~ 23:00)' },
  ];

  const currentMeridian = meridians[timeSlot % 12];
  const nextMeridian = meridians[(timeSlot + 1) % 12];
  const secondaryMeridian = {
    activeMeridianName: nextMeridian.name,
    meridianOrganSystem: nextMeridian.organ,
    optimalTimeWindow: nextMeridian.window,
  };

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0);
  const seed = Math.abs((ganCode * 23 + (targetDate.getDate() + 1) * 19 + hour * 7) % 100);

  let dantianArchetype: string;
  let targetDantian: string;
  let methodName: string;
  let practiceSteps: string;
  let taoistAlchemyWisdom: string;
  let microcosmicOrbitGate: string;

  if (element === '수') {
    dantianArchetype = '하단전 기해(氣海) 원천형 (Lower Dantian Sea of Jing)';
    targetDantian = '하단전 (배꼽 아래 3치 기해혈)';
    methodName = '수화기제(水火旣濟) 복식 심호흡';
    practiceSteps = '코로 숨을 깊이 들이마시며 아랫배를 부풀리고, 신장의 맑은 서늘한 수기가 척추 독맥을 타고 머리로 올라가는 것을 심상화한 뒤 천천히 내쉬기';
    taoistAlchemyWisdom = '물은 만물을 이롭게 하되 다투지 않나니, 욕망을 비우고 정(精)을 굳게 지킬 때 생명수는 마르지 않습니다.';
    microcosmicOrbitGate = '미려관 (꼬리뼈 부위 - 선천 원기가 솟구치는 제1 관문)';
  } else if (element === '화') {
    dantianArchetype = '상단전 인당(印堂) 신명형 (Upper Dantian Chamber of Spirit)';
    targetDantian = '상단전 (양 눈썹 사이 인당 및 니환궁)';
    methodName = '심화하기(心火下氣) 청심 명상법';
    practiceSteps = '머리로 솟구친 열기를 혀를 입천장에 가볍게 대어 가슴 단중을 지나 아랫배 하단전으로 가라앉히며 불기운을 온화하게 수렴하기';
    taoistAlchemyWisdom = '마음의 불꽃이 고요해지면 거울처럼 맑은 본래의 신(神)이 드러나 미래의 징조를 스스로 비춥니다.';
    microcosmicOrbitGate = '옥침관 (뒷목 베갯머리 부위 - 정신의 맑은 기운이 통하는 제3 관문)';
  } else if (element === '목') {
    dantianArchetype = '중단전 단중(膻中) 기화형 (Middle Dantian Chamber of Vital Qi)';
    targetDantian = '중단전 (가슴 중앙 단중혈)';
    methodName = '간기소설(肝氣疏泄) 흉곽 이완 호흡';
    practiceSteps = '가슴에 맺힌 답답함을 양팔을 가볍게 벌리며 입으로 길게 "허~" 소리와 함께 토해내고, 봄바람 같은 맑은 바람을 들이마시기';
    taoistAlchemyWisdom = '굳은 나무는 부러지기 쉽고 유연한 갈대는 태풍에도 살아남듯, 마음에 맺힌 고집을 풀 때 기운이 사통팔달합니다.';
    microcosmicOrbitGate = '협척관 (등 뒤 날개뼈 사이 척추 부위 - 감정의 응어리가 풀리는 제2 관문)';
  } else if (element === '금') {
    dantianArchetype = '폐금 숙살 정기형 (Lung Metal Pure Qi Resonator)';
    targetDantian = '상단전 및 중단전 조율';
    methodName = '폐기숙청(肺氣肅淸) 4-7-8 단전 호흡';
    practiceSteps = '4초간 맑은 기운을 들이마시고, 7초간 단전에 진기를 머금은 뒤, 8초간 미세한 노폐물과 잡념을 완벽히 비워내기';
    taoistAlchemyWisdom = '군더더기 욕망을 칼로 베어내듯 정돈할 때, 순백의 금빛 기운이 온몸의 위기(衛氣, 면역 방어막)를 감쌉니다.';
    microcosmicOrbitGate = '대추혈 (목 뒤 7번 경추 - 전신의 양기가 결집하는 통로)';
  } else {
    // 토 (Earth)
    dantianArchetype = '중완(中脘) 비위 조화형 (Central Earth Harmonizer)';
    targetDantian = '중단전과 하단전 사이 중완혈';
    methodName = '비토건운(脾土健運) 조화 호흡법';
    practiceSteps = '두 손을 따뜻하게 비벼 명치와 배꼽 사이를 시계 방향으로 36회 쓸어주며, 대지의 풍요로운 온기가 오장육부로 퍼져나감을 관조하기';
    taoistAlchemyWisdom = '대지는 온갖 오물을 받아들여 꽃을 피워내듯, 주변의 혼란에 흔들리지 말고 중심을 지키는 후덕함을 기르세요.';
    microcosmicOrbitGate = '신궐 (배꼽 부위 - 모태와 연결되었던 태식의 중심)';
  }

  const jingLevelScore = 78 + (seed % 20);
  const qiLevelScore = 75 + ((seed * 7) % 23);
  const shenLevelScore = 80 + ((seed * 11) % 19);

  let predominantTreasureState: string;
  if (jingLevelScore >= 90) {
    predominantTreasureState = '연정화기 (練精化氣): 정이 충만하여 맑고 활기찬 기운으로 승화되는 단계';
  } else if (qiLevelScore >= 90) {
    predominantTreasureState = '연기화신 (練氣化神): 기운이 조화로워 정신의 영성과 직관이 밝아지는 단계';
  } else {
    predominantTreasureState = '삼보조화 (三寶調和): 정·기·신이 유기적으로 균형을 맞추며 안정세를 이루는 단계';
  }

  const meridianVitalityIndex = 80 + (seed % 18);
  const calculatedAtKst = formatNeidanKstTimestamp(targetDate);
  const q = (question || '').trim();
  const ritualAction = `[${methodName} · ${targetDantian}] ${practiceSteps}`;
  const reflectionFocus = `도교 내단 경락(${currentMeridian.name}) — ${predominantTreasureState}`;
  const reflectiveQuestion = q
    ? `"${q}" 앞에서 ${currentMeridian.name}의 흐름을 다스리며 다음 시진 ${nextMeridian.name}으로 넘어가기 위해, 지금 호흡으로 가라앉힐 긴장은 무엇입니까?`
    : `${dantianArchetype}의 중심을 세우면서 ${methodName}을 3분 실천할 때, 오늘 가장 먼저 쉬게 해 줄 몸과 마음의 부위는 어디입니까?`;
  const interpretiveBoundary =
    '도교 내단 삼보(정·기·신)와 자오유주 경락 시계 상징은 호흡과 일상 리듬을 돌보기 위한 양생적 관점이며, 단정적 미래 예측이나 의학적 진단·처방을 대체하지 않습니다.';
  const neidanSynthesisMatrix = {
    dominantTension: `${dantianArchetype} ↔ ${currentMeridian.name}`,
    alignmentState: `연단 단계: ${predominantTreasureState} · 보조 경락: ${nextMeridian.name} · 관문: ${microcosmicOrbitGate}`,
    integratedAction: `${methodName} (${targetDantian}) — ${practiceSteps}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const synthesisPromptGuidance = `[LUCKEY 도교 내단 양생 & 진기 순환 경락 시계 ${TAOIST_NEIDAN_VERSION} | ${calculatedAtKst}]
- 단전 에너지 아키타입: [${dantianArchetype}]
- 삼보(三寶) 연단 상태:
  * 연단 단계: ${predominantTreasureState}
- 자오유주(子午流注) 경락 시계:
  * 현재 주도 경락: ${currentMeridian.name} (${currentMeridian.organ})
  * 보조 교차 경락: ${nextMeridian.name} (${nextMeridian.organ} · ${nextMeridian.window})
  * 최적 활성 시간: ${currentMeridian.window}
  * 소주천 집중 관문: ${microcosmicOrbitGate}
- 내단 기공 호흡 처방: [${methodName}] (${targetDantian}, 약 3분)
  * 실천법: ${practiceSteps}
- 도가 양생 지혜: "${taoistAlchemyWisdom}"
- 내단 교차 매트릭스: 핵심 긴장(${neidanSynthesisMatrix.dominantTension}) · 조율 상태(${neidanSynthesisMatrix.alignmentState}) · 통합 실천(${neidanSynthesisMatrix.integratedAction})
- 실천 의례: ${ritualAction}
- 성찰 초점: ${reflectionFocus}
- 성찰 질문: ${reflectiveQuestion}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: TAOIST_NEIDAN_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    dantianArchetype,
    threeTreasures: {
      jingLevelScore,
      qiLevelScore,
      shenLevelScore,
      predominantTreasureState
    },
    meridianCirculation: {
      activeMeridianName: currentMeridian.name,
      meridianOrganSystem: currentMeridian.organ,
      optimalTimeWindow: currentMeridian.window,
      microcosmicOrbitGate,
      meridianVitalityIndex
    },
    secondaryMeridian,
    neidanBreathingPrescription: {
      methodName,
      targetDantian,
      practiceSteps,
      durationMinutes: 3
    },
    taoistAlchemyWisdom,
    synthesisPromptGuidance,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    neidanSynthesisMatrix,
  };
}

export type TaoistNeidanMeridianResult = TaoistNeidanMeridianReport;

export function calculateTaoistNeidanMeridian(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): TaoistNeidanMeridianResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runTaoistNeidanMeridianEngine(profile, targetDate, params?.question);
}

export function formatTaoistNeidanMeridianPrompt(res: TaoistNeidanMeridianResult): string {
  return res.synthesisPromptGuidance;
}
