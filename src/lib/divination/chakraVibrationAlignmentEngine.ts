/**
 * =========================================================================
 * LUCKEY 7대 차크라 파동 정렬 & 에너지 퀀텀 밸런싱 엔진 (Chakra Vibration Alignment Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 고대 인도의 7대 차크라(Chakras) 에너지 나디(Nadi) 체계와 동양의 사주 5행(목·화·토·금·수) 생극제화,
 * 양자 파동 솔페지오 주파수(Solfeggio Frequencies), 크리스탈 원석 및 아로마 테라피를 결합한 엔진입니다.
 * 
 * 1. 물라다라(Muladhara/뿌리 차크라 - 빨강 · 생존과 그라운딩): 수(Water) 신장 및 지구력
 * 2. 스와디스타나(Svadhisthana/천골 차크라 - 주황 · 감정과 성, 창조성): 수/목(생명수)
 * 3. 마니푸라(Manipura/태양신경총 차크라 - 노랑 · 의지력과 자존감): 토/화(중심 소화력)
 * 4. 아나하타(Anahata/심장 차크라 - 초록 · 무조건적 사랑과 자비): 목/화(순환과 공감)
 * 5. 비슈다(Vishuddha/목 차크라 - 파랑 · 진실된 표현과 소통): 금(Metal 폐/음성)
 * 6. 아즈나(Ajna/제3의 눈 차크라 - 남색 · 직관과 영적 통찰): 금/수(투시와 혜안)
 * 7. 사하스라라(Sahasrara/크라운 차크라 - 보라/화이트 · 우주 의식과의 합일): 순수 광명
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const CHAKRA_ALIGNMENT_VERSION = 'LUCKEY-CHAKRA-v1.0.0';

export interface SingleChakraInfo {
  id: string;
  sanskritName: string;
  koreanName: string;
  location: string;
  color: string;
  frequencyHz: number;
  opennessPercent: number; // 0 ~ 100%
  status: '최적 정렬 (Harmonized)' | '에너지 과활성 (Overactive)' | '막힘/결핍 (Underactive/Blocked)';
  theme: string;
  affirmation: string;
}

export interface ChakraVibrationAlignmentReport {
  engineVersion: string;
  calculatedAt: string;
  overallChakraBalanceScore: number; // 전체 에너지 조화 지수 (0 ~ 100)
  primaryFocusChakra: {
    name: string;
    reason: string;
    frequencyHz: number;
    gemstone: string;
    aromatherapyOil: string;
  };
  chakras: SingleChakraInfo[];
  kundaliniBreathingPrescription: {
    techniqueName: string;
    durationMinutes: number;
    instruction: string;
  };
  synthesisPromptGuidance: string;
}

export function runChakraVibrationAlignmentEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): ChakraVibrationAlignmentReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const seed = (ganCode * 11 + targetDate.getDate() * 13 + (targetDate.getMonth() + 1) * 7) % 100;

  // 7대 차크라 파동 개방도 산출 (사주 오행 및 일진 수리 기반)
  const rootScore = 70 + ((ganCode + targetDate.getDate() * 3) % 28);
  const sacralScore = 68 + ((ganCode * 2 + targetDate.getMonth() * 5) % 30);
  const solarScore = 72 + ((ganCode * 3 + targetDate.getDate() * 7) % 26);
  const heartScore = 75 + ((ganCode * 5 + targetDate.getMonth() * 3) % 24);
  const throatScore = 74 + ((ganCode * 7 + targetDate.getDate() * 5) % 25);
  const ajnaScore = 78 + ((ganCode * 11 + targetDate.getMonth() * 9) % 21);
  const crownScore = 80 + ((ganCode * 13 + targetDate.getDate() * 11) % 19);

  const allScores = [rootScore, sacralScore, solarScore, heartScore, throatScore, ajnaScore, crownScore];
  const overallChakraBalanceScore = Math.round(allScores.reduce((a, b) => a + b, 0) / 7);

  const chakras: SingleChakraInfo[] = [
    {
      id: 'root',
      sanskritName: 'Muladhara',
      koreanName: '1. 뿌리 차크라 (물라다라)',
      location: '골반저, 회음부',
      color: '루비 레드 (Red)',
      frequencyHz: 396,
      opennessPercent: rootScore,
      status: rootScore < 75 ? '막힘/결핍 (Underactive/Blocked)' : rootScore > 92 ? '에너지 과활성 (Overactive)' : '최적 정렬 (Harmonized)',
      theme: '생존 본능, 육체적 안정감, 재정적 그라운딩',
      affirmation: '나는 대지에 단단히 뿌리내리고 있으며, 내 삶의 모든 물질적 풍요는 안전합니다.'
    },
    {
      id: 'sacral',
      sanskritName: 'Svadhisthana',
      koreanName: '2. 천골 차크라 (스와디스타나)',
      location: '배꼽 아래 3cm (단전)',
      color: '선셋 오렌지 (Orange)',
      frequencyHz: 417,
      opennessPercent: sacralScore,
      status: sacralScore < 75 ? '막힘/결핍 (Underactive/Blocked)' : sacralScore > 92 ? '에너지 과활성 (Overactive)' : '최적 정렬 (Harmonized)',
      theme: '감정의 자유로운 흐름, 관능과 성 에너지, 창의적 열정',
      affirmation: '나는 삶의 즐거움과 감각적 기쁨을 죄책감 없이 자연스럽게 누립니다.'
    },
    {
      id: 'solar',
      sanskritName: 'Manipura',
      koreanName: '3. 태양신경총 차크라 (마니푸라)',
      location: '명치, 윗배',
      color: '골든 옐로우 (Yellow)',
      frequencyHz: 528,
      opennessPercent: solarScore,
      status: solarScore < 75 ? '막힘/결핍 (Underactive/Blocked)' : solarScore > 92 ? '에너지 과활성 (Overactive)' : '최적 정렬 (Harmonized)',
      theme: '강인한 자존감, 내면의 전사 에너지, 실행력과 결단',
      affirmation: '나는 내 삶의 주권자이며, 어떠한 도전도 뚫고 나아갈 불꽃의 의지력을 지녔습니다.'
    },
    {
      id: 'heart',
      sanskritName: 'Anahata',
      koreanName: '4. 심장 차크라 (아나하타)',
      location: '가슴 정중앙',
      color: '에메랄드 그린 / 로즈 (Green/Pink)',
      frequencyHz: 639,
      opennessPercent: heartScore,
      status: heartScore < 75 ? '막힘/결핍 (Underactive/Blocked)' : heartScore > 92 ? '에너지 과활성 (Overactive)' : '최적 정렬 (Harmonized)',
      theme: '무조건적인 사랑, 자비, 용서와 관계의 연결',
      affirmation: '나는 나 자신과 타인을 있는 그대로 품어 안으며, 사랑의 파동으로 가득합니다.'
    },
    {
      id: 'throat',
      sanskritName: 'Vishuddha',
      koreanName: '5. 목 차크라 (비슈다)',
      location: '목구멍, 후두',
      color: '스카이 블루 (Blue)',
      frequencyHz: 741,
      opennessPercent: throatScore,
      status: throatScore < 75 ? '막힘/결핍 (Underactive/Blocked)' : throatScore > 92 ? '에너지 과활성 (Overactive)' : '최적 정렬 (Harmonized)',
      theme: '자기 표현, 진실된 목소리, 솔직한 커뮤니케이션',
      affirmation: '나는 두려움 없이 나의 진실을 명료하고 아름다운 목소리로 세상에 선포합니다.'
    },
    {
      id: 'ajna',
      sanskritName: 'Ajna',
      koreanName: '6. 제3의 눈 차크라 (아즈나)',
      location: '미간 사이',
      color: '인디고 남색 (Indigo)',
      frequencyHz: 852,
      opennessPercent: ajnaScore,
      status: ajnaScore < 75 ? '막힘/결핍 (Underactive/Blocked)' : ajnaScore > 92 ? '에너지 과활성 (Overactive)' : '최적 정렬 (Harmonized)',
      theme: '직관, 영적 통찰, 미래 예지, 상상력',
      affirmation: '나는 눈에 보이는 현상 너머의 우주적 진실과 영적 나침반을 명확히 봅니다.'
    },
    {
      id: 'crown',
      sanskritName: 'Sahasrara',
      koreanName: '7. 크라운 차크라 (사하스라라)',
      location: '정수리 백회혈',
      color: '바이올렛 / 퓨어 화이트 (Violet/White)',
      frequencyHz: 963,
      opennessPercent: crownScore,
      status: crownScore < 75 ? '막힘/결핍 (Underactive/Blocked)' : crownScore > 92 ? '에너지 과활성 (Overactive)' : '최적 정렬 (Harmonized)',
      theme: '우주 의식과의 합일, 영적 각성, 초월적 평화',
      affirmation: '나는 온 우주의 신성한 지혜와 하나로 연결되어 있으며 무한한 평화 속에 머뭅니다.'
    }
  ];

  // 1순위 집중 치유 차크라 선정 (개방도가 가장 낮거나 일간 오행과 직결된 차크라)
  let focusIdx = 0;
  let minScore = 999;
  chakras.forEach((c, idx) => {
    if (c.opennessPercent < minScore) {
      minScore = c.opennessPercent;
      focusIdx = idx;
    }
  });

  const chosenChakra = chakras[focusIdx];
  const gemstoneMap = ['레드 재스퍼 / 헤마타이트', '카넬리안 / 타이거아이', '시트린 / 황수정', '로즈쿼츠 / 말라카이트', '라피스라줄리 / 아쿠아마린', '아메지스트 / 자수정', '클리어 쿼츠 / 셀레나이트'];
  const aromaMap = ['시더우드 & 패출리', '일랑일랑 & 오렌지', '레몬 & 베르가못', '로즈 & 유칼립투스', '페퍼민트 & 세이지', '프랑킨센스 & 라벤더', '샌달우드 & 네롤리'];

  const primaryFocusChakra = {
    name: chosenChakra.koreanName,
    reason: `현재 에너지 순환에서 상대적 막힘 지수가 감지되어, [${chosenChakra.theme}] 테마의 정렬이 시급합니다.`,
    frequencyHz: chosenChakra.frequencyHz,
    gemstone: gemstoneMap[focusIdx],
    aromatherapyOil: aromaMap[focusIdx]
  };

  const kundaliniBreathingPrescription = {
    techniqueName: '나디 쇼다나 (Nadi Shodhana · 교호호흡 및 골든 파동 호흡법)',
    durationMinutes: 5,
    instruction: `오른손 엄지로 오른쪽 콧구멍을 막고 왼쪽으로 4초간 숨을 들이마신 뒤, 약지로 왼쪽을 막고 4초간 멈추며 [${chosenChakra.frequencyHz}Hz ${primaryFocusChakra.name}] 부위에 황금빛 에너지가 차오르는 것을 시각화합니다. 반대쪽으로 8초간 천천히 내쉬기를 5분간 반복합니다.`
  };

  const synthesisPromptGuidance = `[LUCKEY 7대 차크라 파동 정렬 & 에너지 퀀텀 밸런싱 v1.0.0]
- 전체 차크라 조화도: ${overallChakraBalanceScore}점
- 1순위 집중 치유 차크라: [${primaryFocusChakra.name}] (${chosenChakra.opennessPercent}%)
  * 핵심 진동수: ${primaryFocusChakra.frequencyHz}Hz 솔페지오 주파수
  * 공명 원석(Gemstone): ${primaryFocusChakra.gemstone}
  * 아로마 에센스: ${primaryFocusChakra.aromatherapyOil}
  * 확언(Affirmation): "${chosenChakra.affirmation}"
- 7대 차크라 개방도 요약:
  * 뿌리(Root 396Hz): ${rootScore}% | 천골(Sacral 417Hz): ${sacralScore}% | 태양신경총(Solar 528Hz): ${solarScore}%
  * 심장(Heart 639Hz): ${heartScore}% | 목(Throat 741Hz): ${throatScore}% | 제3의눈(Ajna 852Hz): ${ajnaScore}% | 크라운(Crown 963Hz): ${crownScore}%
- 쿤달리니 정렬 호흡법: [${kundaliniBreathingPrescription.techniqueName} ${kundaliniBreathingPrescription.durationMinutes}분] ${kundaliniBreathingPrescription.instruction}`;

  return {
    engineVersion: CHAKRA_ALIGNMENT_VERSION,
    calculatedAt: targetDate.toISOString(),
    overallChakraBalanceScore,
    primaryFocusChakra,
    chakras,
    kundaliniBreathingPrescription,
    synthesisPromptGuidance
  };
}

export type ChakraVibrationAlignmentResult = ChakraVibrationAlignmentReport;

export function calculateChakraVibrationAlignment(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): ChakraVibrationAlignmentResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runChakraVibrationAlignmentEngine(profile, targetDate);
}

export function formatChakraVibrationAlignmentPrompt(res: ChakraVibrationAlignmentResult): string {
  return res.synthesisPromptGuidance;
}
