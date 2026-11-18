/**
 * =========================================================================
 * LUCKEY 21일 카르마 리셋 & 오행 마이크로 해빗 엔진 (Micro-Habit Karma Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 제임스 클리어의 '아주 작은 습관의 힘(Atomic Habits)', 뇌 신경가소성(Neuroplasticity)의
 * 21일 카르마 재배선 주기, 그리고 사주 명리학의 용신·희신 오행 개운법(開運法)을 결합한 엔진입니다.
 * 거창한 결심 대신 뇌의 저항선을 우회하는 '2분 마이크로 액션(Micro Action)'과
 * 오행 감각 자극을 도파민 보상 루프에 바인딩하여, 과거의 정체된 카르마를 새로운 성공 패턴으로 전환합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const MICRO_HABIT_KARMA_VERSION = 'LUCKEY-HABIT-v2.3.0';

function formatMicroHabitKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type HabitKarmaArchetype = 
  | '점화형 스타터 (The Catalyst Starter · 시작은 빠르나 유지 보강형)'
  | '지속형 빌더 (The Steady Builder · 루틴에 강한 복리 성장형)'
  | '완벽주의 오버씽커 (The Perfectionist Overthinker · 시동 저항형)'
  | '유연한 시프터 (The Fluid Shifter · 다채로운 모멘텀 탐색형)';

export interface MicroHabitDetail {
  elementTheme: '목(木 · 발아와 확장)' | '화(火 · 열정과 표출)' | '토(土 · 중심과 안정)' | '금(金 · 결단과 정돈)' | '수(水 · 유연과 휴식)';
  twoMinuteAction: string;       // 뇌의 저항을 0으로 만드는 2분 실행 행동
  cueTrigger: string;            // 습관을 점화하는 일상 속 고정 트리거
  dopamineReward: string;        // 실행 즉시 뇌에 보상하는 감각적 리워드
  habitIdentityAffirmation: string; // 자아 정체성 각인 선언문
}

export interface MicroHabitKarmaReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  archetype: HabitKarmaArchetype;
  neuroplasticityScore: number;  // 신경가소성 재배선 지수 (0 ~ 100)
  karmaStreakIndex: number;      // 21일 루틴 안착 모멘텀 (0 ~ 100)
  microHabit: MicroHabitDetail;
  twentyOneDayMilestone: {
    days1to7: string;            // 1~7일차: 저항선 돌파 (원자적 점화)
    days8to14: string;           // 8~14일차: 신경망 재배선 (루틴 고착화)
    days15to21: string;          // 15~21일차: 카르마 잠금 (무의식적 본능화)
  };
  synthesisPromptGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  microHabitSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

export function runMicroHabitKarmaEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): MicroHabitKarmaReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const habitSeed = (targetDate.getFullYear() * 3 + (targetDate.getMonth() + 1) * 11 + targetDate.getDate() * 23 + ganCode) % 100;

  // 4대 습관 카르마 아키타입 분류
  const archetypeIndex = (ganCode + targetDate.getDate()) % 4;

  let archetype: HabitKarmaArchetype;
  if (archetypeIndex === 0) {
    archetype = '점화형 스타터 (The Catalyst Starter · 시작은 빠르나 유지 보강형)';
  } else if (archetypeIndex === 1) {
    archetype = '지속형 빌더 (The Steady Builder · 루틴에 강한 복리 성장형)';
  } else if (archetypeIndex === 2) {
    archetype = '완벽주의 오버씽커 (The Perfectionist Overthinker · 시동 저항형)';
  } else {
    archetype = '유연한 시프터 (The Fluid Shifter · 다채로운 모멘텀 탐색형)';
  }

  // 일간 오행 맞춤형 2분 마이크로 해빗 처방
  let microHabit: MicroHabitDetail;

  if (element === '목') {
    microHabit = {
      elementTheme: '목(木 · 발아와 확장)',
      twoMinuteAction: '아침 기상 즉시 창가에서 기지개를 켜며 푸른 식물이나 하늘을 10초간 응시하기',
      cueTrigger: '침대에서 발이 바닥에 닿는 순간',
      dopamineReward: '온몸의 신경망이 깨어나는 시원한 감각에 미소 짓기',
      habitIdentityAffirmation: '"나는 매일 새롭게 싹을 틔우고 확장하는 생명력 넘치는 창조자다."'
    };
  } else if (element === '화') {
    microHabit = {
      elementTheme: '화(火 · 열정과 표출)',
      twoMinuteAction: '노트나 메모장에 오늘 세상을 놀라게 할 단 하나의 핵심 목표를 한 문장으로 적고 소리 내어 읽기',
      cueTrigger: '아침 첫 물 한 잔을 마신 직후',
      dopamineReward: '심장이 두근거리며 엔진이 켜지는 내적 도파민 점화 느끼기',
      habitIdentityAffirmation: '"나는 명확한 비전으로 세상에 밝은 빛을 비추는 열정의 리더다."'
    };
  } else if (element === '토') {
    microHabit = {
      elementTheme: '토(土 · 중심과 안정)',
      twoMinuteAction: '의자에 앉아 양발을 바닥에 단단히 붙이고 복식 호흡 3회를 하며 중심 잡기',
      cueTrigger: '컴퓨터 전원 버튼을 켜거나 작업실에 착석한 순간',
      dopamineReward: '어떤 혼란 속에서도 흔들리지 않는 내면의 고요한 닻 확인하기',
      habitIdentityAffirmation: '"나는 대지처럼 단단한 기반 위에 거대한 성취를 쌓아 올리는 실력자다."'
    };
  } else if (element === '금') {
    microHabit = {
      elementTheme: '금(金 · 결단과 정돈)',
      twoMinuteAction: '작업을 시작하기 전 책상 위 불필요한 물건 2개를 치우고 화면 창을 단 하나만 띄우기',
      cueTrigger: '업무 모드로 돌입하는 첫 마우스 클릭 전',
      dopamineReward: '시야가 단숨에 명료해지며 면도날 같은 집중력이 장착되는 쾌감',
      habitIdentityAffirmation: '"나는 본질을 꿰뚫고 군더더기를 가차 없이 베어내는 결단의 승부사다."'
    };
  } else {
    // 수 (Water)
    microHabit = {
      elementTheme: '수(水 · 유연과 휴식)',
      twoMinuteAction: '따뜻한 물 한 컵을 천천히 음미하며 오늘 하루 물처럼 유연하게 흐를 것을 마음으로 허용하기',
      cueTrigger: '세안을 마치고 거울을 바라본 순간',
      dopamineReward: '내면의 긴장이 부드럽게 풀리며 영감이 차오르는 유연한 평온',
      habitIdentityAffirmation: '"나는 어떤 장애물도 부드럽게 감싸고 돌아 결국 거대한 바다에 도달하는 지혜로운 흐름이다."'
    };
  }

  const neuroplasticityScore = 78 + (habitSeed % 20); // 78 ~ 97점
  const karmaStreakIndex = 75 + ((targetDate.getDate() * 7 + targetDate.getHours() * 2 + (ganCode % 13)) % 23); // 75 ~ 97점

  const twentyOneDayMilestone = {
    days1to7: '뇌의 저항선 우회 단계: 완벽하게 하려 하지 말고 "딱 2분만 실행" 규칙을 무조건 엄수하기',
    days8to14: '신경망 연결 단계: 행동 전후 감각적 보상을 결합하여 뇌가 이 시간을 기다리도록 조건화',
    days15to21: '카르마 잠금 단계: 의식적 노력 없이 자동 발동하는 정체성 차원의 본능적 습관으로 안착'
  };

  const calculatedAtKst = formatMicroHabitKstTimestamp(targetDate);
  const q = (question || '').trim();
  const reflectiveQuestion = q
    ? `'${q}'라는 흐름 속에서, 완벽하게 해내려는 부담을 내려놓고 '${microHabit.cueTrigger}' 직후 딱 2분만 실행할 수 있는 가장 가벼운 첫 행동은 무엇인가요?`
    : `'${archetype}' 성향을 지닌 내가 '${microHabit.cueTrigger}' 순간에 저항 없이 2분만 실행할 수 있는 나만의 작은 보상은 무엇인가요?`;
  const microHabitSynthesisMatrix = {
    dominantTension: `${archetype} ↔ ${microHabit.elementTheme}`,
    alignmentState: `점화 트리거: ${microHabit.cueTrigger}`,
    integratedAction: `${microHabit.twoMinuteAction}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const interpretiveBoundary = '본 21일 카르마 리셋 & 오행 마이크로 해빗 리포트는 오행 체질과 행동 습관 이론에 기반한 정성적 자기관리 안내이며, 의학·임상 처방이 아닙니다.';
  const ritualAction = `${microHabit.cueTrigger} 순간에 딱 2분만 '${microHabit.twoMinuteAction}'를 실행한 뒤, '${microHabit.dopamineReward}'로 즉시 보상하세요.`;
  const reflectionFocus = `마이크로 해빗(${archetype} ↔ ${microHabit.elementTheme}) — ${microHabit.cueTrigger}`;

  const synthesisPromptGuidance = `[LUCKEY 21일 카르마 리셋 & 오행 마이크로 해빗 ${MICRO_HABIT_KARMA_VERSION} | ${calculatedAtKst}]
- 습관 카르마 아키타입: [${archetype}]
- 오행 맞춤 2분 마이크로 액션: [${microHabit.elementTheme}] ${microHabit.twoMinuteAction}
- 점화 트리거: ${microHabit.cueTrigger}
- 도파민 감각 보상: ${microHabit.dopamineReward}
- 정체성 각인 선언: ${microHabit.habitIdentityAffirmation}
- 21일 안착 로드맵: [1~7일] ${twentyOneDayMilestone.days1to7} | [8~14일] ${twentyOneDayMilestone.days8to14} | [15~21일] ${twentyOneDayMilestone.days15to21}
- 교차 매트릭스: [핵심 긴장: ${microHabitSynthesisMatrix.dominantTension} | 조율 상태: ${microHabitSynthesisMatrix.alignmentState}]
  • 통합 실천: ${microHabitSynthesisMatrix.integratedAction}
- 질문 맞춤 성찰 질문: ${reflectiveQuestion}
- 실천 의례: ${ritualAction}
- 성찰 초점: ${reflectionFocus}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: MICRO_HABIT_KARMA_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    archetype,
    neuroplasticityScore,
    karmaStreakIndex,
    microHabit,
    twentyOneDayMilestone,
    synthesisPromptGuidance,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    microHabitSynthesisMatrix,
    interpretiveBoundary,
  };
}

export type MicroHabitKarmaResult = MicroHabitKarmaReport;

export function calculateMicroHabitKarma(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): MicroHabitKarmaResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runMicroHabitKarmaEngine(profile, targetDate, params?.question);
}

export function formatMicroHabitKarmaPrompt(res: MicroHabitKarmaResult): string {
  return res.synthesisPromptGuidance;
}
