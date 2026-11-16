/**
 * =========================================================================
 * LUCKEY 빌헬름 라이히 7대 신체 갑옷 해제 & 체성 감각 엔진 (Somatic Body Armoring Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 신체 심리학의 시조 빌헬름 라이히(Wilhelm Reich)의 '7대 신체 갑옷(Segmental Body Armoring)' 이론과
 * 한의학 및 사주 오행의 기체(氣滯: 기운의 뭉침과 울화), 현대 소매틱 트라우마 치료(Somatic Experiencing)를 결합한 엔진입니다.
 * 
 * 1. 7대 신체 분절 갑옷(7 Armoring Segments):
 *    - 눈(Ocular): 불신, 과각성, 두려움의 시선
 *    - 입/턱(Oral): 억압된 분노, 삼켜버린 말, 애정 결핍
 *    - 목/경추(Cervical): 통제 욕구, 취약성을 숨기려는 방어
 *    - 가슴/흉부(Thoracic): 억압된 슬픔, 비통함, 마음의 벽
 *    - 횡격막(Diaphragmatic): 얕은 호흡, 만성 불안과 경계태세
 *    - 복부(Abdominal): 내장 신경 긴장, 복수심, 소화되지 못한 스트레스
 *    - 골반(Pelvic): 성적 수치심, 죄책감, 뿌리 없는 무기력
 * 2. 사주 오행 불균형과 결합한 1순위 만성 갑옷 진단
 * 3. 체성 감각 자각 및 소매틱 진동 방출 테크닉(Somatic De-armoring Exercise)
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SOMATIC_ARMORING_VERSION = 'LUCKEY-SOMATIC-v2.1.0';

function formatSomaticKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export interface BodyArmorSegment {
  segmentName: string;
  bodyLocation: string;
  tensionLevelScore: number;     // 긴장 경직도 (0 ~ 100)
  repressedEmotion: string;      // 억압된 감정 원형
  psychologicalPattern: string;  // 심리적 방어 기제
  somaticReleaseExercise: string;// 신체 갑옷 해소 운동법
}

export interface SomaticBodyArmoringReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  primaryArmorSegment: BodyArmorSegment;
  secondaryArmorSegment: BodyArmorSegment;
  lifeForceEnergyFlowScore: number; // 오르곤(생명력) 순환 지수 (0 ~ 100)
  groundingSomaticChecklist: string[];
  vagusNerveResetPrescription: {
    technique: string;
    durationSeconds: number;
    guide: string;
  };
  synthesisPromptGuidance: string;
  somaticSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

export function runSomaticBodyArmoringEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): SomaticBodyArmoringReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const seed = (ganCode * 29 + targetDate.getDate() * 7 + (targetDate.getMonth() + 1) * 13) % 100;

  // 7대 분절 중 일간 오행과 체성 감각 결합 매핑
  let primarySegment: BodyArmorSegment;
  let secondarySegment: BodyArmorSegment;

  if (element === '목') {
    // 목(Liver/Gallbladder) -> 목/경추 및 턱 분절
    primarySegment = {
      segmentName: '3. 목/경추 분절 갑옷 (Cervical Segment)',
      bodyLocation: '목덜미, 승모근, 흉쇄유돌근, 인후부',
      tensionLevelScore: 84 + (seed % 14),
      repressedEmotion: '말하고 싶었으나 억지로 삼켜버린 비명과 억울함',
      psychologicalPattern: '모든 상황을 이성으로 통제하려 하며 눈물을 보이지 않으려는 방어',
      somaticReleaseExercise: '턱을 풀고 "아-" 소리를 길게 내며 고개를 좌우로 천천히 롤링하여 목의 울림 회복하기'
    };
    secondarySegment = {
      segmentName: '2. 구강/턱 분절 갑옷 (Oral Segment)',
      bodyLocation: '턱관절, 저작근, 입술',
      tensionLevelScore: 78 + (seed % 12),
      repressedEmotion: '이를 악물고 참아온 분노와 버팀',
      psychologicalPattern: '남에게 의존하지 않고 혼자 다 씹어 삼키려는 완고함',
      somaticReleaseExercise: '양손으로 턱관절을 지그시 누르며 하품하듯 입을 크게 벌리고 "하-" 호흡 내쉬기'
    };
  } else if (element === '화') {
    // 화(Heart/Pericardium) -> 가슴/흉부 및 눈 분절
    primarySegment = {
      segmentName: '4. 가슴/흉부 분절 갑옷 (Thoracic Segment)',
      bodyLocation: '가슴 흉골(전중혈), 늑간근, 어깨 앞쪽',
      tensionLevelScore: 86 + (seed % 13),
      repressedEmotion: '마음이 찢어지는 듯했던 깊은 상처와 억압된 비통함',
      psychologicalPattern: '다시는 상처받지 않기 위해 가슴 주위에 두꺼운 철갑 성벽을 두름',
      somaticReleaseExercise: '가슴 중앙에 따뜻한 손을 얹고 가슴이 부풀어 오르는 늑간 호흡과 함께 어깨 뒤로 활짝 열기'
    };
    secondarySegment = {
      segmentName: '1. 눈/이마 분절 갑옷 (Ocular Segment)',
      bodyLocation: '미간, 관자놀이, 안구 주변 근육',
      tensionLevelScore: 76 + (seed % 15),
      repressedEmotion: '언제 닥칠지 모르는 위험에 대한 과각성과 피로',
      psychologicalPattern: '눈앞의 모든 디테일을 감시하고 완벽하게 파악하려는 시각적 긴장',
      somaticReleaseExercise: '손바닥을 비벼 따뜻하게 만든 뒤 눈 위에 얹는 파밍(Palming) 이완 2분간 수행하기'
    };
  } else if (element === '토') {
    // 토(Spleen/Stomach) -> 횡격막 및 복부 분절
    primarySegment = {
      segmentName: '5. 횡격막 분절 갑옷 (Diaphragmatic Segment)',
      bodyLocation: '명치끝, 늑골 아랫선, 등 중간 부위',
      tensionLevelScore: 88 + (seed % 11),
      repressedEmotion: '숨을 멎게 만들었던 만성 불안과 미래에 대한 공포',
      psychologicalPattern: '숨을 얕게 쉬며 몸통 상하의 에너지 순환을 단절시켜 감정을 차단함',
      somaticReleaseExercise: '폼롤러를 등 중간에 대고 누워 명치 부위를 열어주며 배가 풍선처럼 부풀도록 4-7-8 호흡하기'
    };
    secondarySegment = {
      segmentName: '6. 복부 분절 갑옷 (Abdominal Segment)',
      bodyLocation: '배꼽 주변 복직근, 복부 심부 근막',
      tensionLevelScore: 79 + (seed % 14),
      repressedEmotion: '소화되지 못한 세상에 대한 거부감과 묵은 스트레스',
      psychologicalPattern: '배에 늘 힘을 주고 있어 복강 내 장기가 편안하게 이완되지 못함',
      somaticReleaseExercise: '시계 방향으로 배꼽 주변을 부드럽게 원을 그리며 마사지하고 복식 이완하기'
    };
  } else if (element === '금') {
    // 금(Lung/Large Intestine) -> 흉부 및 목/어깨 결절 갑옷
    primarySegment = {
      segmentName: '3. 목/경추 분절 갑옷 (Cervical Segment)',
      bodyLocation: '목덜미 뒤쪽 풍지혈, 상부 승모근, 경추 1-7번',
      tensionLevelScore: 89 + (seed % 10),
      repressedEmotion: '칼날 같은 규율을 지키느라 스스로를 짓누른 엄격함',
      psychologicalPattern: '고개를 꼿꼿이 세우고 단 하나의 실수도 허용하지 않으려는 완벽주의 경직',
      somaticReleaseExercise: '양손 깍지를 끼고 뒤통수를 부드럽게 감싸 턱을 쇄골 쪽으로 지그시 당기며 척추 이완하기'
    };
    secondarySegment = {
      segmentName: '4. 가슴/흉부 분절 갑옷 (Thoracic Segment)',
      bodyLocation: '폐 상엽, 쇄골 하부, 대흉근',
      tensionLevelScore: 80 + (seed % 13),
      repressedEmotion: '내면의 나약함이나 따뜻한 정을 겉으로 표현하지 못한 외로움',
      psychologicalPattern: '타인과의 깊은 감정적 교류보다 차가운 기능적 정확성을 방패로 삼음',
      somaticReleaseExercise: '문틀을 잡고 가슴 앞쪽을 앞으로 밀어내며 시원하게 스트레칭하고 길게 날숨 뱉기'
    };
  } else {
    // 수 (Kidney/Bladder) -> 골반 및 요추 분절
    primarySegment = {
      segmentName: '7. 골반/요추 분절 갑옷 (Pelvic Segment)',
      bodyLocation: '천골, 장요근, 엉덩이 둔근, 회음부',
      tensionLevelScore: 87 + (seed % 12),
      repressedEmotion: '근원적인 생존의 불안과 버려짐에 대한 깊은 공포',
      psychologicalPattern: '골반을 꽉 조이고 있어 활력과 성 에너지, 자연스러운 쾌락이 차단됨',
      somaticReleaseExercise: '누워서 무릎을 세우고 골반을 부드럽게 바닥에 툭툭 털어내는 소매틱 트레머링(Tremoring) 3분'
    };
    secondarySegment = {
      segmentName: '5. 횡격막 분절 갑옷 (Diaphragmatic Segment)',
      bodyLocation: '명치, 요방형근, 신장 부위',
      tensionLevelScore: 81 + (seed % 12),
      repressedEmotion: '지속적인 긴장감으로 인한 부신 피로와 차가운 냉기',
      psychologicalPattern: '항상 최악의 시나리오를 대비하느라 몸이 긴장의 끈을 놓지 못함',
      somaticReleaseExercise: '허리 뒤 신장 부위에 따뜻한 찜질팩을 대고 깊은 복식호흡으로 온기 퍼뜨리기'
    };
  }

  const lifeForceEnergyFlowScore = 75 + (seed % 21);

  const groundingSomaticChecklist = [
    '지금 발바닥 전체가 바닥과 닿아 있는 감각을 100% 느끼기',
    '어깨가 귀 쪽으로 올라가 있지 않은지 확인하고 2cm 툭 떨어뜨리기',
    '아랫배에 손을 얹고 내쉬는 숨에 몸의 모든 무게를 대지에 맡기기'
  ];

  const vagusNerveResetPrescription = {
    technique: '미주신경 리셋 소매틱 호흡 (Vagus Nerve Reset · 4-7-8 Sigh)',
    durationSeconds: 180,
    guide: '코로 4초간 들이마시고 7초간 숨을 멈춘 뒤, 입으로 "후-" 소리를 내며 8초간 가장 길게 내쉽니다. 3분간 반복하면 부교감신경이 즉각 활성화되며 굳어있던 신체 갑옷이 부드럽게 녹아내립니다.'
  };

  const calculatedAtKst = formatSomaticKstTimestamp(targetDate);
  const q = (question || '').trim();
  const somaticSynthesisMatrix = {
    dominantTension: `${primarySegment.segmentName} ↔ ${secondarySegment.segmentName}`,
    alignmentState: `미주신경 리셋: ${vagusNerveResetPrescription.technique} · 오행: ${element}`,
    integratedAction: `${primarySegment.somaticReleaseExercise}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const interpretiveBoundary = '본 빌헬름 라이히 7대 신체 갑옷 & 체성 감각 리포트는 사주 오행과 신체심리학 상징에 기반한 정성적 이완 안내이며, 의학적·물리치료적 진단을 대신하지 않습니다.';

  const synthesisPromptGuidance = `[LUCKEY 빌헬름 라이히 7대 신체 갑옷 해제 & 체성 감각 ${SOMATIC_ARMORING_VERSION} | ${calculatedAtKst}]
- 1순위 집중 신체 갑옷: [${primarySegment.segmentName}]
  * 신체 부위: ${primarySegment.bodyLocation}
  * 억압된 감정: "${primarySegment.repressedEmotion}"
  * 심리적 방어 기제: ${primarySegment.psychologicalPattern}
  * 소매틱 해소 운동법: ${primarySegment.somaticReleaseExercise}
- 2순위 신체 갑옷: [${secondarySegment.segmentName}] (${secondarySegment.bodyLocation})
- 미주신경 리셋 처방: [${vagusNerveResetPrescription.technique} ${vagusNerveResetPrescription.durationSeconds}초] ${vagusNerveResetPrescription.guide}
- 교차 매트릭스: [핵심 긴장: ${somaticSynthesisMatrix.dominantTension} | 조율 상태: ${somaticSynthesisMatrix.alignmentState}]
  * 통합 실천: ${somaticSynthesisMatrix.integratedAction}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: SOMATIC_ARMORING_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    primaryArmorSegment: primarySegment,
    secondaryArmorSegment: secondarySegment,
    lifeForceEnergyFlowScore,
    groundingSomaticChecklist,
    vagusNerveResetPrescription,
    synthesisPromptGuidance,
    somaticSynthesisMatrix,
    interpretiveBoundary,
  };
}

export type SomaticBodyArmoringResult = SomaticBodyArmoringReport;

export function calculateSomaticBodyArmoring(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): SomaticBodyArmoringResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runSomaticBodyArmoringEngine(profile, targetDate, params?.question);
}

export function formatSomaticBodyArmoringPrompt(res: SomaticBodyArmoringResult): string {
  return res.synthesisPromptGuidance;
}
