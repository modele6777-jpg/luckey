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

export const DEEP_WORK_FLOW_VERSION = 'LUCKEY-FLOW-v2.1.0';

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
  soundscape: string;            // 집중을 돕는 일반 사운드 선택
  lightingEnvironment: string;   // 집중력을 높이는 조명 환경
  ignitionRitual: string;        // 30초 영감 점화 리추얼
  distractionShield: string;     // 몰입을 방해하는 1순위 노이즈 차단법
}

export interface DeepWorkFlowResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;

  // 1순위 딥워크 아키타입
  archetype: FlowArchetypeDetail;

  // 몰입 포커스 지수 (내부 호환용 0~100, 프롬프트 비노출)
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

  situationalFlowAudit: {
    focusTheme: string;
    flowNote: string;
    sprintStep: string;
  };
  temporalFlowRhythm: {
    kstTimeLabel: string;
    focusWatchWindow: string;
    seasonalFlowTone: string;
    temporalGuidance: string;
  };
  flowSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  boundaryNotice: string;
  interpretiveBoundary: string;
  reflectiveQuestion?: string;
  summary: string;
}

function getTemporalFlowRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const focusWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 단일 목표창 — 산만한 알림을 끄고 가장 무거운 핵심 과업 하나를 여는 시간'
      : hour >= 11 && hour < 17
        ? '정오 구조화·실행창 — 짧은 스프린트와 이완 리셋을 교차해 밀도를 유지하는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 정리·다듬기창 — 오늘 만든 산출물을 마감하고 내일 첫 단추를 남기는 시간'
          : '심야 정적 몰입창 — 외부 간섭이 줄어든 고요 속에서 창의적 영감을 기록하는 시간';

  const seasonalFlowTone =
    month >= 3 && month <= 5
      ? '봄 · 발상 확장기 (새로운 프로토타입과 실험을 시도하기 좋은 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 추진 가속기 (짧고 굵은 스프린트로 실행 속도를 높이는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 정밀 완성기 (디테일을 다듬어 완성도를 끌어올리는 시기)'
          : '겨울 · 심층 사유기 (근원 아키텍처와 깊은 학습에 몰두하기 좋은 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    focusWatchWindow,
    seasonalFlowTone,
    temporalGuidance: `${focusWatchWindow} · ${seasonalFlowTone}의 결에 맞추어 몰입 블록을 설계하십시오.`,
  };
}

/**
 * 딥워크 몰입 엔진 연산 메인 함수
 */
export function calculateDeepWorkFlow(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): DeepWorkFlowResult {
  const now = params?.targetDate || new Date();
  const question = (params?.question || '').trim();
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
    soundscape: '가사가 적은 잔잔한 집중 음악 또는 딥 브라운 노이즈 (Brown Noise)',
    lightingEnvironment: '데스크 스탠드 4000K 뉴트럴 화이트 (주변은 은은한 간접 조명)',
    ignitionRitual: '책상 위 불필요한 물건 10초 정리 ➔ 물 한 모금 ➔ 단 1개의 이번 스프린트 목표 메모 ➔ 즉시 타이머 가동',
    distractionShield: '모바일 기기를 시야 밖에 두거나 방해 금지 모드를 설정하고, 필요한 알림은 남겨 두세요.'
  };

  // 4. 창작 신살 분석
  const creativeStars = {
    munchang: (dayGan === '庚' || dayGan === '辛') ? '활성 (논리적 통찰과 집필/코딩 재능)' : '잠재',
    hakdang: '내재 (학습 흡수력 및 빠른 신기술 체득)',
    hwagae: structures.some(s => s.includes('화개')) ? '보유 (독보적 예술성과 홀로 있는 시간의 축복)' : '공명'
  };

  const temporalFlowRhythm = getTemporalFlowRhythm(now);
  const situationalFlowAudit = /개발|코딩|일|공부|집중|작업/.test(question)
    ? {
        focusTheme: `${archetype.title} 맞춤 스프린트 진입`,
        flowNote: archetype.flowTrigger,
        sprintStep: `${archetype.optimalSprintMinutes}분 집중 후 ${archetype.restProtocolMinutes}분 완전 이완`,
      }
    : /지침|번아웃|막힘|슬럼프/.test(question)
      ? {
          focusTheme: '과부하 차단 및 30초 점화 리추얼 재정비',
          flowNote: '억지로 시간을 채우기보다 시야와 알림을 비우고 작은 단위 하나만 끝내는 것이 회복의 지름길입니다.',
          sprintStep: environment.ignitionRitual,
        }
      : {
          focusTheme: `${archetype.title} · ${flowStateTitle}`,
          flowNote: archetype.creativeAura,
          sprintStep: `${archetype.optimalSprintMinutes}분 집중 / ${archetype.restProtocolMinutes}분 리셋`,
        };

  const flowSynthesisMatrix = {
    coreInsight: `[${archetype.title}]의 몰입 방아쇠(${archetype.flowTrigger})를 깨우는 것이 핵심입니다.`,
    recommendedAction: `${environment.ignitionRitual} -> ${archetype.optimalSprintMinutes}분 집중`,
    cautionNotice: '멀티태스킹과 메신저 알림을 차단해야 딥워크 아우라가 온전히 유지됩니다.',
  };

  const summary = `[딥워크 몰입] 아키타입: ${archetype.title} [${flowStateTitle}]. ` +
    `추천 세션: ${archetype.optimalSprintMinutes}분 몰입 / ${archetype.restProtocolMinutes}분 이완. ` +
    `사운드: 집중 음악 또는 브라운 노이즈.`;
  const reflectiveQuestion = question.trim()
    ? `"${question.trim()}"에 ${archetype.optimalSprintMinutes}분 단일 몰입을 걸기 전, 지금 당장 꺼 두면 가장 먼저 시야가 맑아질 방해 요소 하나는 무엇인가요?`
    : `오늘 ${archetype.title} 리듬으로 30초 점화 리추얼을 켠 뒤 가장 먼저 끝내 보고 싶은 단 하나의 결과물은 무엇일까요?`;

  return {
    engineVersion: DEEP_WORK_FLOW_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst: temporalFlowRhythm.kstTimeLabel,
    archetype,
    flowFocusScore,
    flowStateTitle,
    environment,
    creativeStars,
    situationalFlowAudit,
    temporalFlowRhythm,
    flowSynthesisMatrix,
    boundaryNotice: '본 결과는 사주 신살·오행 성향과 딥워크 집중 리듬을 결합한 정성적 생산성 가이드이며, 절대적 능력 평가가 아닙니다.',
    interpretiveBoundary: '본 결과는 사주 신살·오행 성향과 딥워크 집중 리듬을 결합한 정성적 생산성 가이드이며, 절대적 능력 평가가 아닙니다.',
    reflectiveQuestion,
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatDeepWorkFlowPrompt(res: DeepWorkFlowResult): string {
  return `[창작 아우라 & 딥워크 몰입 엔진 리포트 (엔진: ${res.engineVersion})]
- 연산 시각: ${res.calculatedAtKst}
- 1순위 몰입 아키타입: **${res.archetype.title}** [${res.archetype.hanja}] (${res.flowStateTitle})
  • 창작 아우라: ${res.archetype.creativeAura}
  • 몰입 방아쇠: ${res.archetype.flowTrigger}
  • 권장 스프린트 리듬: **${res.archetype.optimalSprintMinutes}분 집중 ➔ ${res.archetype.restProtocolMinutes}분 리셋**
- 질문 맥락 감사 (${res.situationalFlowAudit.focusTheme}): ${res.situationalFlowAudit.flowNote} / 리듬: ${res.situationalFlowAudit.sprintStep}
- KST 시공간 몰입 리듬: ${res.temporalFlowRhythm.focusWatchWindow} / ${res.temporalFlowRhythm.seasonalFlowTone}
  • 시공간 지침: ${res.temporalFlowRhythm.temporalGuidance}
- 딥워크 교차 매트릭스: 핵심(${res.flowSynthesisMatrix.coreInsight}) | 실행(${res.flowSynthesisMatrix.recommendedAction}) | 주의(${res.flowSynthesisMatrix.cautionNotice})
- 최적 환경 매트릭스:
  • 사운드 스케이프: ${res.environment.soundscape}
  • 조명: ${res.environment.lightingEnvironment}
  • 30초 점화 리추얼: ${res.environment.ignitionRitual}
  • 노이즈 차단막: ${res.environment.distractionShield}
- 창작 길신: 문창(${res.creativeStars.munchang}), 화개(${res.creativeStars.hwagae})
${res.reflectiveQuestion ? `- 성찰 질문: ${res.reflectiveQuestion}\n` : ''}- 해석 경계: ${res.boundaryNotice}
※ 루시 지침: 진정한 창작과 생산성은 억지로 버티는 노동이 아니라, 방해 없는 환경에서 자신만의 몰입 리듬을 찾는 과정입니다. 사용자가 산만함 없이 집중할 수 있도록 맞춤 세션 시간, 사운드 스케이프와 점화 리추얼을 감각적으로 가이드해 주세요.`;
}
