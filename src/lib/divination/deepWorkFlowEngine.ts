/**
 * =========================================================================
 * LUCKEY 창작 아우라 & 딥워크 몰입 엔진 (Deep Work Flow Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주명리의 문창귀인(文昌: 학문과 창작의 번뜩임), 학당귀인(學堂: 지적 성취),
 * 화개살(華蓋: 독창적 예술성과 심층 몰입), 식상(출력과 개발 구현력), 그리고
 * 서양 점성술의 5하우스(창작)·해왕성(영감)·천왕성(혁신적 돌파구)을 융합하여
 * 사용자의 딥워크 몰입 아키타입, 최적 환경 매트릭스, 그리고 몰입 포커스
 * 지수(0~100)를 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const DEEP_WORK_FLOW_VERSION = 'LUCKEY-FLOW-v1.0.0';

export type FlowArchetype = 'deep_architect' | 'furious_sprinter' | 'craftsman_polisher' | 'intuitive_explorer';

export interface FlowArchetypeDetail {
  type: FlowArchetype;
  title: string;
  hanja: string;
  creativeAura: string;          // 몰입 상태에서 뿜어져 나오는 지적 아우라
  flowTrigger: string;          // 뇌가 무아지경 몰입으로 순간 진입하는 방아쇠
  optimalSprintMinutes: number; // 1회 최적 집중 블록 시간 (분)
  restProtocolMinutes: number;  // 블록 간 리셋 휴식 시간 (분)
}

export const FLOW_ARCHETYPES: Record<FlowArchetype, FlowArchetypeDetail> = {
  deep_architect: {
    type: 'deep_architect',
    title: '심층 시스템 아키텍트 (괴강·상관형)',
    hanja: '深層設計型',
    creativeAura: '거대한 문제의 근원 구조를 한눈에 조망하고, 가장 우아하고 단순한 코어 알고리즘을 깎아내는 냉철한 지성',
    flowTrigger: '복잡하게 꼬여 있던 문제를 단 1장의 아키텍처 다이어그램으로 시각화할 때 전율과 함께 몰입 시작',
    optimalSprintMinutes: 90,
    restProtocolMinutes: 15
  },
  furious_sprinter: {
    type: 'furious_sprinter',
    title: '폭풍 질주형 스프린터 (백호·목화형)',
    hanja: '疾風怒濤型',
    creativeAura: '아이디어가 떠오르는 순간 폭발적인 아드레날린으로 단숨에 프로토타입을 찍어내는 야수적 추진력',
    flowTrigger: '명확한 데드라인과 도전적인 과제가 눈앞에 주어졌을 때 승부욕과 함께 최고조 활성화',
    optimalSprintMinutes: 50,
    restProtocolMinutes: 10
  },
  craftsman_polisher: {
    type: 'craftsman_polisher',
    title: '장인 디테일 세공가 (식신·토금형)',
    hanja: '匠人細工型',
    creativeAura: '0.1초의 UX 인터랙션과 폰트 자간, 코드의 가독성을 완벽에 가깝게 다듬는 섬세한 장인 정신',
    flowTrigger: '조용한 음악과 함께 불필요한 노이즈가 완벽히 차단된 정돈된 개발 환경에서 서서히 깊어짐',
    optimalSprintMinutes: 75,
    restProtocolMinutes: 12
  },
  intuitive_explorer: {
    type: 'intuitive_explorer',
    title: '직관 융합 탐험가 (화개·수목형)',
    hanja: '直觀融合型',
    creativeAura: '서로 다른 이질적인 도메인의 지식을 직관적으로 연결하여 세상에 없던 새로운 카테고리를 창출하는 독창성',
    flowTrigger: '기존의 틀을 깨부수고 완전히 새로운 발상의 전환이 머릿속을 스치는 순간 깊은 몰입 돌입',
    optimalSprintMinutes: 60,
    restProtocolMinutes: 15
  }
};

export interface FlowEnvironmentMatrix {
  soundFrequency: string;        // 최적 사운드 주파수 (Hz / 노이즈)
  lightingEnvironment: string;   // 집중력을 높이는 조명 환경
  ignitionRitual: string;        // 30초 영감 점화 리추얼
  distractionShield: string;     // 몰입을 방해하는 1순위 노이즈 차단법
}

export interface DeepWorkFlowResult {
  engineVersion: string;
  calculatedAtIso: string;

  // 1순위 딥워크 아키타입
  archetype: FlowArchetypeDetail;

  // 몰입 포커스 지수 (0~100)
  flowFocusScore: number;
  flowStateTitle: string;

  // 최적 몰입 환경 매트릭스
  environment: FlowEnvironmentMatrix;

  // 창작 슈퍼파워 신살 (문창·학당·화개 분석)
  creativeStars: {
    munchang: string;
    hakdang: string;
    hwagae: string;
  };

  summary: string;
}

/**
 * 딥워크 몰입 엔진 연산 메인 함수
 */
export function calculateDeepWorkFlow(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): DeepWorkFlowResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const structures = saju.specialStructures.map(s => s.name);
  const elements = saju.elements.counts;
  const dayGan = saju.pillars.day.gan;

  // 1. 아키타입 결정
  let archetypeType: FlowArchetype = 'deep_architect';

  const hasSangGwanGwoegang = structures.some(s => s.includes('괴강') || s.includes('상관')) || (dayGan === '庚');
  const hasBaekho = structures.some(s => s.includes('백호'));
  const hasSikShin = structures.some(s => s.includes('식신'));

  if (hasSangGwanGwoegang) {
    archetypeType = 'deep_architect';
  } else if (hasBaekho) {
    archetypeType = 'furious_sprinter';
  } else if (hasSikShin) {
    archetypeType = 'craftsman_polisher';
  } else {
    archetypeType = 'intuitive_explorer';
  }

  const archetype = FLOW_ARCHETYPES[archetypeType];

  // 2. 몰입 포커스 지수 산출 (0~100)
  let flowFocusScore = 82;
  if (hasSangGwanGwoegang) flowFocusScore += 10;
  if ((elements['금'] || 0) >= 2) flowFocusScore += 4;
  if ((elements['수'] || 0) >= 1) flowFocusScore += 3;
  flowFocusScore = Math.min(99, flowFocusScore);

  let flowStateTitle = '무아지경 하이퍼 포커스 (Hyper Flow)';
  if (flowFocusScore >= 90) flowStateTitle = '절대 몰입 하이퍼 포커스 (Hyper Flow)';
  else if (flowFocusScore >= 80) flowStateTitle = '안정적 딥워크 플로우 (Steady Flow)';
  else flowStateTitle = '점진적 리듬 조율기 (Flow Tuning)';

  // 3. 환경 매트릭스
  const environment: FlowEnvironmentMatrix = {
    soundFrequency: '528Hz DNA 수복 & 창의성 활성화 주파수 / 딥 브라운 노이즈 (Brown Noise)',
    lightingEnvironment: '데스크 스탠드 4000K 뉴트럴 화이트 (주변은 은은한 간접 조명)',
    ignitionRitual: '책상 위 불필요한 물건 10초 정리 ➔ 물 한 모금 ➔ 단 1개의 이번 스프린트 목표 메모 ➔ 즉시 타이머 가동',
    distractionShield: '모바일 기기 비행기 모드 또는 시야 밖 격리, 메신저 알림 100% 무음 처리'
  };

  // 4. 창작 신살 분석
  const creativeStars = {
    munchang: (dayGan === '庚' || dayGan === '辛') ? '활성 (논리적 통찰과 집필/코딩 재능)' : '잠재',
    hakdang: '내재 (학습 흡수력 및 빠른 신기술 체득)',
    hwagae: structures.some(s => s.includes('화개')) ? '보유 (독보적 예술성과 홀로 있는 시간의 축복)' : '공명'
  };

  const summary = `[딥워크 몰입] 아키타입: ${archetype.title}. ` +
    `몰입 지수: ${flowFocusScore}점 [${flowStateTitle}]. ` +
    `추천 세션: ${archetype.optimalSprintMinutes}분 몰입 / ${archetype.restProtocolMinutes}분 이완. ` +
    `사운드: 528Hz / 브라운 노이즈.`;

  return {
    engineVersion: DEEP_WORK_FLOW_VERSION,
    calculatedAtIso: now.toISOString(),
    archetype,
    flowFocusScore,
    flowStateTitle,
    environment,
    creativeStars,
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatDeepWorkFlowPrompt(res: DeepWorkFlowResult): string {
  return `[창작 아우라 & 딥워크 몰입 엔진 리포트 (엔진: ${res.engineVersion})]
- 1순위 몰입 아키타입: **${res.archetype.title}** [${res.archetype.hanja}]
  • 창작 아우라: ${res.archetype.creativeAura}
  • 몰입 방아쇠: ${res.archetype.flowTrigger}
  • 권장 스프린트 리듬: **${res.archetype.optimalSprintMinutes}분 집중 ➔ ${res.archetype.restProtocolMinutes}분 리셋**
- 몰입 포커스 지수: **${res.flowFocusScore}점** [${res.flowStateTitle}]
- 최적 환경 매트릭스:
  • 사운드 주파수: ${res.environment.soundFrequency}
  • 조명: ${res.environment.lightingEnvironment}
  • 30초 점화 리추얼: ${res.environment.ignitionRitual}
  • 노이즈 차단막: ${res.environment.distractionShield}
- 창작 길신: 문창(${res.creativeStars.munchang}), 화개(${res.creativeStars.hwagae})
※ 루시 지침: 진정한 창작과 생산성은 억지로 버티는 노동이 아니라, 방해 없는 환경에서 자신의 뇌파를 무아지경 몰입(Flow)으로 데려가는 예술입니다. 사용자가 산만함 없이 가장 나다운 딥워크 리듬을 타고 고도의 집중력을 발휘할 수 있도록 맞춤 세션 시간과 점화 리추얼을 감각적으로 가이드해 주세요.`;
}
