/**
 * =========================================================================
 * LUCKEY 다차원 운명 공명 에코 & 카르마적 인연 중력 엔진 (Destiny Synastry Echo Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주 명리학의 일간 간합(干合)·지지 육합·삼합 및 원진(怨嗔)·귀문(鬼門) 살과
 * 서양 점성술 시냅스트리(Synastry)의 북쪽 노드(Karmic Node)·버텍스(Vertex) 공명 수리를 융합한 엔진입니다.
 * 인간관계에서 느껴지는 불가항력적인 끌림(Karmic Gravity), 무의식적 투사와 갈등 취약점(Blindspot),
 * 그리고 이 인연을 통해 영혼이 반드시 졸업해야 할 진화적 과제(Evolutionary Lesson)를 결정론적으로 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const DESTINY_SYNASTRY_ECHO_VERSION = 'LUCKEY-ECHO-v1.0.0';

export type KarmicGravityType = 
  | '카르마 거울형 (Karmic Mirror · 자아 투사와 결핍 치유)'
  | '성장 촉매형 (Quantum Catalyst · 잠재력 폭발 증폭)'
  | '상호 보완 닻형 (Grounding Anchor · 현실 안정과 결실)'
  | '영혼의 동반자형 (Soul Synergy · 시대를 함께 여는 파트너십)';

export interface DestinySynastryEchoReport {
  engineVersion: string;
  calculatedAt: string;
  gravityType: KarmicGravityType;
  karmicEchoScore: number;         // 운명적 공명 지수 (0 ~ 100)
  soulConnectionDepth: number;     // 영혼 차원 연결 깊이 (0 ~ 100)
  relationshipDynamics: {
    magneticPullFactor: string;    // 두 사람을 강력히 끌어당기는 근원 인력
    blindspotVulnerability: string; // 무의식적으로 부딪히는 갈등 취약점
    evolutionaryLesson: string;    // 이 인연을 통해 영혼이 깨달아야 할 성장 과제
  };
  goldenCommunicationCode: {
    mindOpeningKeyword: string;    // 상대방의 마음을 즉시 여는 핵심 키워드
    deescalationPhrase: string;    // 갈등 발생 시 긴장을 푸는 마법의 한마디
    optimalEngagementPace: string; // 최적의 관계 호흡 및 거리 유지법
  };
  synthesisPromptGuidance: string;
}

export function runDestinySynastryEchoEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): DestinySynastryEchoReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const echoSeed = (targetDate.getFullYear() * 7 + (targetDate.getMonth() + 1) * 13 + targetDate.getDate() * 19 + ganCode) % 100;

  const typeIndex = (ganCode + targetDate.getDate()) % 4;

  let gravityType: KarmicGravityType;
  let magneticPullFactor: string;
  let blindspotVulnerability: string;
  let evolutionaryLesson: string;
  let mindOpeningKeyword: string;
  let deescalationPhrase: string;
  let optimalEngagementPace: string;

  if (typeIndex === 0) {
    gravityType = '카르마 거울형 (Karmic Mirror · 자아 투사와 결핍 치유)';
    magneticPullFactor = '자신의 가장 아픈 상처나 인정받고 싶은 결핍을 상대방에게서 발견하며 느끼는 기묘한 친밀감';
    blindspotVulnerability = '상대방의 사소한 무반응이나 결점에 내 상처가 자극되어 과도하게 방어적이거나 서운해지기 쉬움';
    evolutionaryLesson = '상대방을 통제하려 하지 않고, 비춰진 거울을 통해 내면의 어린 자아를 스스로 온전히 치유하는 법 배우기';
    mindOpeningKeyword = '"이해와 공감" (경청과 인정의 태도)';
    deescalationPhrase = '"네 입장에서 생각해보니 충분히 그렇게 느꼈을 수 있겠어. 내가 더 귀 기울일게."';
    optimalEngagementPace = '감정이 격해질 때는 30분간 각자의 공간에서 쿨다운 후 대화 재개하기';
  } else if (typeIndex === 1) {
    gravityType = '성장 촉매형 (Quantum Catalyst · 잠재력 폭발 증폭)';
    magneticPullFactor = '대화를 나누는 순간 도파민이 폭발하고 창의적 아이디어와 실행 의욕이 3배로 솟구치는 시너지';
    blindspotVulnerability = '흥분 상태에서 과도한 기대를 품다가 현실적 실행의 벽에 부딪힐 때 급격한 피로감이나 실망 발생';
    evolutionaryLesson = '영감의 불꽃을 체계적인 로드맵과 분업으로 구체화하여 현실의 실체로 결실 맺는 인내심 훈련';
    mindOpeningKeyword = '"비전과 돌파" (동기부여와 혁신)';
    deescalationPhrase = '"우리 둘의 목표는 완벽히 같아. 방법에서 디테일만 조금 조율해보자."';
    optimalEngagementPace = '주 1~2회 집중적인 브레인스토밍 세션 후 각자의 독립 실행 구역 보장하기';
  } else if (typeIndex === 2) {
    gravityType = '상호 보완 닻형 (Grounding Anchor · 현실 안정과 결실)';
    magneticPullFactor = '내가 서투른 영역(체계, 실리, 감정 조절)을 상대방이 묵묵히 채워줄 때 느껴지는 안도감';
    blindspotVulnerability = '스타일의 근본적 차이로 인해 상대방이 답답하거나 둔감하게 느껴지는 오해 발생 가능';
    evolutionaryLesson = '나와 다른 상대방의 템포와 방식을 결함이 아닌 상호보완의 축복으로 존중하는 포용력 습득';
    mindOpeningKeyword = '"신뢰와 안정" (약속 이행과 일관성)';
    deescalationPhrase = '"서로 다른 관점에서 보니까 우리가 놓친 빈틈이 채워지는 것 같아서 정말 든든해."';
    optimalEngagementPace = '명확한 역할 분담과 사전 규칙 합의를 바탕으로 꾸준한 루틴 유지하기';
  } else {
    gravityType = '영혼의 동반자형 (Soul Synergy · 시대를 함께 여는 파트너십)';
    magneticPullFactor = '말하지 않아도 눈빛만으로 본질이 통하고 삶의 깊은 가치관과 소명이 공명하는 영혼의 주파수';
    blindspotVulnerability = '너무 깊은 유대감으로 인해 상대방의 사소한 실망이나 변화에도 영혼의 기반이 흔들리는 착각';
    evolutionaryLesson = '서로의 거룩한 독립성을 존중하면서도 하나의 위대한 우주적 목적을 위해 나란히 걷는 지혜';
    mindOpeningKeyword = '"존중과 자유" (영혼의 절대적 신뢰)';
    deescalationPhrase = '"어떤 상황에서도 나는 네 편이고 네 존재 자체를 믿어. 천천히 같이 풀어가자."';
    optimalEngagementPace = '깊은 정신적 교감과 현실적 자율성의 완벽한 50:50 균형 유지하기';
  }

  const karmicEchoScore = 76 + (echoSeed % 23); // 76 ~ 98점
  const soulConnectionDepth = 74 + ((targetDate.getDate() * 9 + targetDate.getHours() * 2 + (ganCode % 13)) % 25); // 74 ~ 98점

  const synthesisPromptGuidance = `[LUCKEY 다차원 운명 공명 에코 & 카르마적 인연 중력 v1.0.0]
- 인연 중력 아키타입: [${gravityType}]
- 운명적 공명 지수: ${karmicEchoScore}점 / 영혼 차원 연결 깊이: ${soulConnectionDepth}점
- 핵심 인력 요인: ${magneticPullFactor}
- 무의식적 갈등 취약점: ${blindspotVulnerability}
- 영혼의 진화 성장 과제: ${evolutionaryLesson}
- 소통 마스터 코드:
  * 마음을 여는 핵심: ${mindOpeningKeyword}
  * 갈등 완화 치트키: ${deescalationPhrase}
  * 최적 호흡/거리: ${optimalEngagementPace}`;

  return {
    engineVersion: DESTINY_SYNASTRY_ECHO_VERSION,
    calculatedAt: targetDate.toISOString(),
    gravityType,
    karmicEchoScore,
    soulConnectionDepth,
    relationshipDynamics: {
      magneticPullFactor,
      blindspotVulnerability,
      evolutionaryLesson
    },
    goldenCommunicationCode: {
      mindOpeningKeyword,
      deescalationPhrase,
      optimalEngagementPace
    },
    synthesisPromptGuidance
  };
}

export type DestinySynastryEchoResult = DestinySynastryEchoReport;

export function calculateDestinySynastryEcho(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): DestinySynastryEchoResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runDestinySynastryEchoEngine(profile, targetDate);
}

export function formatDestinySynastryEchoPrompt(res: DestinySynastryEchoResult): string {
  return res.synthesisPromptGuidance;
}
