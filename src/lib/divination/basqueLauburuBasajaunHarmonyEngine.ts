/**
 * =========================================================================
 * LUCKEY 바스크 라부루(Lauburu)·바사하운 숲과 원환의 균형 엔진
 * (Basque Lauburu & Basajaun Forest Harmony Engine)
 * =========================================================================
 *
 * [전통적 배경]
 * 피레네 산맥 바스크(Basque) 전통의 네 갈래 순환 문양 '라부루(Lauburu)'는
 * 네 방향·사계절·삶의 순환(시작·성장·수렴·휴식)이 끊이지 않고 이어지는 조화를
 * 상징한다. 또한 숲의 오랜 수호자 '바사하운(Basajaun)' 전승은 자연의 질서를
 * 함부로 어지럽히지 않고 묵직하게 돌보며 공존하는 태도를 일깨운다.
 *
 * 원칙:
 * 1. 개인 점수·심리 진단·미래 예측이 아닙니다. 모든 산출은 정성적 성찰 문장입니다.
 * 2. 바스크 전통의 보편적 상징만 빌려 쓰며 출처 없는 인용문을 만들지 않습니다.
 *
 * @version LUCKEY-BASQUE-LAUBURU-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const BASQUE_LAUBURU_HARMONY_VERSION = 'LUCKEY-BASQUE-LAUBURU-v2.3.0';

export type LauburuQuestionTopic = 'decision' | 'relationship' | 'healing' | 'reflection';

export interface LauburuCyclePulse {
  kstTimeWindow: string;
  cyclePhase: string;
  stewardshipGuidance: string;
}

export interface SituationalLauburuAudit {
  questionTopic: LauburuQuestionTopic;
  cycleMirror: string;
  groundedAdvice: string;
  renewalAdvice: string;
  forestPractice: string;
}

export interface LauburuSynthesisMatrix {
  activeArm: string;
  companionArm: string;
  stewardshipTone: string;
  integratedAction: string;
}

export interface BasqueLauburuBasajaunResult {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: LauburuQuestionTopic;
  lauburuArmKey: string;
  companionArmKey: string;
  cycleHarmonyPhase: string;
  shadowWarning: string;
  situationalLauburuAudit: SituationalLauburuAudit;
  temporalCyclePulse: LauburuCyclePulse;
  lauburuSynthesisMatrix: LauburuSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LAUBURU_HARMONY_PHASES = [
  '뿌리 다짐(눈앞의 속도보다 오래 버틸 일상 토대를 먼저 고르는 시기)',
  '흐름 순환(막힌 매듭을 힘으로 밀지 않고 물길처럼 돌아서 푸는 시기)',
  '숲 경계 휴식(바사하운의 숲처럼 과업을 거두고 다음 계절의 불씨를 지키는 시기)',
] as const;

const LAUBURU_SHADOW_WARNINGS = [
  '토대와 구조를 다지느라 너무 신중해져서 지금 열려 있는 기회의 문까지 지나치지 않도록 살피세요.',
  '유연하게 흐름을 타려다 내가 반드시 지켜야 할 원칙과 생활 리듬의 경계까지 흐려지지 않도록 점검하세요.',
  '다음 계절을 위한 쉼과 수렴을 미룬 채 쉼 없이 바퀴만 돌리다가 숲의 기력이 소진되지 않도록 유의하세요.',
] as const;

function classifyLauburuTopic(query?: string): LauburuQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/결정|선택|이직|창업|시작|지원|계약|돈|재물|일|커리어|진로|승진/.test(q)) return 'decision';
  if (/관계|사람|연인|연애|가족|친구|동료|갈등|다툼|화해|서운|이별|사랑/.test(q)) return 'relationship';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|번아웃|슬픔/.test(q)) return 'healing';
  return 'reflection';
}

function getLauburuKstHour(now: Date): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    hour12: false,
  });
  return Number(formatter.formatToParts(now).find((p) => p.type === 'hour')?.value || '12') % 24;
}

function buildTemporalCyclePulse(now: Date): LauburuCyclePulse {
  const hour = getLauburuKstHour(now);
  if (hour >= 5 && hour < 11) {
    return {
      kstTimeWindow: '아침 — 라부루 첫째 날개(흙·씨앗)의 창',
      cyclePhase: '발을 땅에 단단히 딛고 오늘 돌볼 터전을 살피는 시간',
      stewardshipGuidance: '큰 계획보다 오늘 내 손이 닿는 일 하나를 정성껏 돌보는 데서 리듬이 시작됩니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstTimeWindow: '낮 — 라부루 둘째·셋째 날개(물·바람)의 창',
      cyclePhase: '흐름을 타고 사람과 일 사이를 유연하게 오가는 시간',
      stewardshipGuidance: '막힌 곳이 보이면 힘으로 밀기보다 물길이 돌아갈 틈을 먼저 찾아보세요.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstTimeWindow: '저녁 — 바사하운의 귀환과 수렴의 창',
      cyclePhase: '숲의 경계를 돌아보듯 하루의 과업을 거두고 안정을 찾는 시간',
      stewardshipGuidance: '오늘 기울인 노력을 스스로 인정해 주고, 내일 이어갈 몫만 깔끔히 남겨 두세요.',
    };
  }
  return {
    kstTimeWindow: '밤 — 라부루 넷째 날개(불·쉼)의 창',
    cyclePhase: '바깥 활동을 접고 다음 순환을 위해 불씨를 지키며 쉬는 시간',
    stewardshipGuidance: '순환은 멈춤이 있어야 다시 돌 수 있습니다. 밤에는 회복을 우선순위에 두세요.',
  };
}

function buildSituationalLauburuAudit(
  topic: LauburuQuestionTopic,
  lauburuArmKey: string,
): SituationalLauburuAudit {
  if (topic === 'decision') {
    return {
      questionTopic: topic,
      cycleMirror: `${lauburuArmKey} 흐름 속의 갈림길 — 일회성 승부가 아니라 오래 돌 수 있는 순환을 고르는 자리`,
      groundedAdvice: '당장 화려한 결과보다 6개월 뒤에도 내 일상이 감당할 수 있는 구조를 먼저 보세요.',
      renewalAdvice: '너무 오래 쥔 계획은 가볍게 가지치기하고 지금 숨이 통하는 선택지에 힘을 실으세요.',
      forestPractice: '이번 결정이 내 일상 리듬(수면·집중·관계)을 어떻게 바꿀지 한 줄씩 점검해 보기.',
    };
  }
  if (topic === 'relationship') {
    return {
      questionTopic: topic,
      cycleMirror: `${lauburuArmKey} 흐름 속의 만남 — 서로의 숲을 해치지 않고 경계를 지키는 자리`,
      groundedAdvice: '상대의 영역을 통제하려 하기보다 내가 지킬 수 있는 태도와 거리를 분명히 하세요.',
      renewalAdvice: '묵직하고 짧은 배려 한 마디가 길고 날 선 설명보다 관계를 오래 지킵니다.',
      forestPractice: '오늘 관계에서 내가 먼저 내어줄 수 있는 여유 한 가지를 떠올려 보기.',
    };
  }
  if (topic === 'healing') {
    return {
      questionTopic: topic,
      cycleMirror: `${lauburuArmKey} 흐름 속의 숲 그늘 — 지친 나무가 겨울을 지나듯 속도를 늦추는 자리`,
      groundedAdvice: '회복에도 계절이 필요합니다. 빨리 나아지려 다그치지 말고 오늘의 피로를 그대로 인정하세요.',
      renewalAdvice: '몸을 조이는 일정을 하나 덜어내고, 자연이나 조용한 공기에 10분만 머물러 보세요.',
      forestPractice: '잠시 화면에서 눈을 떼고 창밖이나 식물, 손의 온기에 집중하며 천천히 호흡하기.',
    };
  }
  return {
    questionTopic: topic,
    cycleMirror: `${lauburuArmKey} 흐름을 바라보는 자리 — 삶의 네 계절 중 지금 어디쯤 서 있는지 살피는 순간`,
    groundedAdvice: '지금은 씨를 뿌릴 때인지, 가지를 칠 때인지, 거두고 쉴 때인지 구분해 보세요.',
    renewalAdvice: '순환의 어느 구간에 있든 지금 단계에 맞는 작은 돌봄 하나면 충분합니다.',
    forestPractice: '오늘 나의 현재 계절(시작·성장·수렴·휴식 중 하나)을 한 단어로 적어 보기.',
  };
}

export function calculateBasqueLauburuBasajaunHarmony(
  profile?: UserProfile,
  question?: string,
  now: Date = new Date(),
): BasqueLauburuBasajaunResult {
  const name = profile?.basic?.name ?? '방문자';
  const birthdate = profile?.basic?.birthdate ?? '';
  const birthtime = profile?.basic?.birthtime ?? '';
  const topic = classifyLauburuTopic(question);

  const seed = `BASQUE-LAUBURU:${name}:${birthdate}:${birthtime}:${topic}:${(question ?? '').trim()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const arms = [
    '흙의 날개 — 뿌리를 내리고 현실의 토대를 다지는 순환',
    '물의 날개 — 막힌 감정을 적시고 유연하게 흘려보내는 순환',
    '바람의 날개 — 시야를 트고 새로운 소식을 받아들이는 순환',
    '불과 쉼의 날개 — 내면의 온기를 지키며 다음 계절을 준비하는 순환',
  ];
  const primaryIdx = Math.abs(hash) % arms.length;
  let companionHash = 0;
  const companionSeed = `${seed}:companion`;
  for (let i = 0; i < companionSeed.length; i++) {
    companionHash = (companionHash << 5) - companionHash + companionSeed.charCodeAt(i);
    companionHash |= 0;
  }
  const companionOffset = 1 + (Math.abs(companionHash) % (arms.length - 1));
  const lauburuArmKey = arms[primaryIdx];
  const companionArmKey = arms[(primaryIdx + companionOffset) % arms.length];

  let phaseHash = 0;
  const phaseSeed = `${seed}:phase`;
  for (let i = 0; i < phaseSeed.length; i++) {
    phaseHash = (phaseHash << 5) - phaseHash + phaseSeed.charCodeAt(i);
    phaseHash |= 0;
  }
  const cycleHarmonyPhase = LAUBURU_HARMONY_PHASES[Math.abs(phaseHash) % LAUBURU_HARMONY_PHASES.length];
  const shadowWarning = LAUBURU_SHADOW_WARNINGS[Math.abs(phaseHash >> 3) % LAUBURU_SHADOW_WARNINGS.length];

  const situationalLauburuAudit = buildSituationalLauburuAudit(topic, lauburuArmKey);
  const temporalCyclePulse = buildTemporalCyclePulse(now);

  const trimmedQ = (question ?? '').trim();
  const ritualAction = `${situationalLauburuAudit.forestPractice} 이어서 ${situationalLauburuAudit.renewalAdvice} (${cycleHarmonyPhase})`;
  const reflectionFocus = `${lauburuArmKey} ↔ ${companionArmKey} · ${cycleHarmonyPhase} · ${temporalCyclePulse.kstTimeWindow} — 일과 쉼의 순환 균형 점검`;
  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}'라는 문제 앞에서 '${cycleHarmonyPhase}' 국면을 지나는 지금, 내가 더 키워야 할 것은 추진력인가요, 아니면 숲을 지키듯 속도를 늦추는 돌봄인가요?`
    : `'${cycleHarmonyPhase}' 흐름에서 지금 내 하루의 순환(시작·성장·수렴·휴식) 가운데 가장 돌봄이 필요한 구간은 어디인가요?`;

  const interpretiveBoundary =
    '본 리포트는 바스크 전통의 라부루(Lauburu)·바사하운 상징을 빌려 삶의 순환과 균형을 돌아보는 정성적 성찰 안내이며, 개인 점수·심리 진단·미래 예측이 아닙니다.';

  const lauburuSynthesisMatrix: LauburuSynthesisMatrix = {
    activeArm: lauburuArmKey,
    companionArm: companionArmKey,
    stewardshipTone: temporalCyclePulse.stewardshipGuidance,
    integratedAction: `${situationalLauburuAudit.groundedAdvice}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const calculatedAtKst = `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;

  return {
    engineVersion: BASQUE_LAUBURU_HARMONY_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTopic: topic,
    lauburuArmKey,
    companionArmKey,
    cycleHarmonyPhase,
    shadowWarning,
    situationalLauburuAudit,
    temporalCyclePulse,
    lauburuSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatBasqueLauburuBasajaunHarmonyPrompt(res: BasqueLauburuBasajaunResult): string {
  return [
    `【바스크 라부루(Lauburu)·바사하운 숲과 원환의 균형 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 질문 주제 분류: ${res.questionTopic}`,
    `- 활성 순환 날개: ${res.lauburuArmKey}`,
    `- 동반 순환 날개: ${res.companionArmKey}`,
    `- 순환 국면: ${res.cycleHarmonyPhase}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 질문 비춤: ${res.situationalLauburuAudit.cycleMirror}`,
    `- 토대 조언: ${res.situationalLauburuAudit.groundedAdvice}`,
    `- 순환 갱신 조언: ${res.situationalLauburuAudit.renewalAdvice}`,
    `- KST 시간대 창: ${res.temporalCyclePulse.kstTimeWindow}`,
    `- 돌봄 지침: ${res.temporalCyclePulse.stewardshipGuidance}`,
    `- 라부루 교차 매트릭스: 날개(${res.lauburuSynthesisMatrix.activeArm} ↔ ${res.lauburuSynthesisMatrix.companionArm}) · 돌봄(${res.lauburuSynthesisMatrix.stewardshipTone}) · 실천(${res.lauburuSynthesisMatrix.integratedAction})`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
