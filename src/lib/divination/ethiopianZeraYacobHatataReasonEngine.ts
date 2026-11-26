/**
 * =========================================================================
 * LUCKEY 에티오피아 자라 야곱(Zera Yacob) 하타타 이성·성찰 엔진
 * (Ethiopian Zera Yacob Hatata Reason & Conscience Engine)
 * =========================================================================
 *
 * [전통적 배경]
 * 17세기 에티오피아 철학자 자라 야곱(Zera Yacob)은 동굴에 은거하며 저술한
 * 《하타타(Hatata, 탐구)》에서 관습과 맹신을 넘어 인간에게 주어진 이성(Reason)과
 * 맑은 양심으로 진실과 정의를 스스로 가려야 한다고 설파했다. 인간 존엄과 평등,
 * 창조 질서의 조화를 강조한 그의 사유는 감정에 휩쓸리지 않는 단단한 판단 기준을
 * 세우는 데 도움을 준다.
 *
 * 원칙:
 * 1. 개인 점수·심리 진단·미래 예측이 아닙니다. 모든 산출은 정성적 성찰 문장입니다.
 * 2. 원전 문구를 임의로 지어 인용하지 않고 사상적 핵심 원리만 반영합니다.
 *
 * @version LUCKEY-ZERA-YACOB-HATATA-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const ETHIOPIAN_ZERA_YACOB_VERSION = 'LUCKEY-ZERA-YACOB-HATATA-v2.4.0';

export type HatataQuestionTopic = 'decision' | 'relationship' | 'healing' | 'reflection';

export interface HatataReasonPulse {
  kstTimeWindow: string;
  clarityCriterion: string;
  inquiryMethod: string;
}

export interface SituationalHatataAudit {
  questionTopic: HatataQuestionTopic;
  reasonMirror: string;
  biasCheckAdvice: string;
  conscienceAlignment: string;
  inquiryPractice: string;
}

export interface HatataSynthesisMatrix {
  inquiryLens: string;
  conscienceAnchor: string;
  integratedAction: string;
}

export interface EthiopianZeraYacobHatataResult {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: HatataQuestionTopic;
  hatataCrossAxis: string;
  inquiryLens: string;
  companionLens: string;
  inquiryPhase: string;
  shadowWarning: string;
  situationalHatataAudit: SituationalHatataAudit;
  temporalReasonPulse: HatataReasonPulse;
  hatataSynthesisMatrix: HatataSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const HATATA_INQUIRY_PHASES = [
  '사실 분리(관습과 추측을 걷어내고 확인된 사실만 남기는 시기)',
  '동굴 관조(외부의 조급함에서 물러나 내면의 양심과 대조하는 시기)',
  '공정 실행(나와 상대를 같은 저울에 올려 떳떳한 한 걸음을 옮기는 시기)',
] as const;

const HATATA_SHADOW_WARNINGS = [
  '이성적 검증과 사실 분리에 몰두하다 상대의 아픈 감정과 맥락을 차갑게 재단하지 않도록 살피세요.',
  '동굴의 고요 속에 머물며 숙고하다 지금 건네야 할 대화와 실행의 시기를 늦추지 않도록 점검하세요.',
  '공정함과 양심의 기준을 세우려다 나 자신의 작은 실수까지 가혹하게 몰아붙이지 않도록 유의하세요.',
] as const;

function classifyHatataTopic(query?: string): HatataQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/결정|선택|이직|창업|시작|지원|계약|돈|재물|일|커리어|진로|승진/.test(q)) return 'decision';
  if (/관계|사람|연인|연애|가족|친구|동료|갈등|다툼|화해|서운|이별|사랑/.test(q)) return 'relationship';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|번아웃|슬픔/.test(q)) return 'healing';
  return 'reflection';
}

function getHatataKstHour(now: Date): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    hour12: false,
  });
  return Number(formatter.formatToParts(now).find((p) => p.type === 'hour')?.value || '12') % 24;
}

function buildTemporalReasonPulse(now: Date): HatataReasonPulse {
  const hour = getHatataKstHour(now);
  if (hour >= 5 && hour < 11) {
    return {
      kstTimeWindow: '아침 — 맑은 분별을 여는 탐구의 창',
      clarityCriterion: '관습이나 타인의 조급함에 앞서 내가 납득할 수 있는 근거 세우기',
      inquiryMethod: '오늘 다룰 가장 중요한 문제 하나를 사실과 추측 두 칸으로 나누어 보세요.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstTimeWindow: '낮 — 공정함과 균형을 시험하는 창',
      clarityCriterion: '나에게만 유리한 해석을 걷어내고 양쪽을 같은 저울에 올려 보기',
      inquiryMethod: '중요한 대화나 결정 직전, 내 주장만큼 상대의 이유도 한 줄로 정리해 보세요.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstTimeWindow: '저녁 — 동굴의 고요 속에서 하루를 비추는 창',
      clarityCriterion: '소음에서 한 걸음 물러나 오늘의 선택이 양심과 맞닿았는지 점검하기',
      inquiryMethod: '오늘 한 말이나 행동 중 떳떳했던 한 가지와 다듬고 싶은 한 가지를 가볍게 짚어 보세요.',
    };
  }
  return {
    kstTimeWindow: '밤 — 깊은 침묵과 내면 이성의 창',
    clarityCriterion: '불안이 부풀린 가정을 멈추고 본질적인 질문만 남겨 두기',
    inquiryMethod: '잠들기 전 머릿속의 복잡한 논쟁을 접고 내일 맑은 정신으로 볼 질문 하나만 메모해 두세요.',
  };
}

function buildSituationalHatataAudit(
  topic: HatataQuestionTopic,
  inquiryLens: string,
): SituationalHatataAudit {
  if (topic === 'decision') {
    return {
      questionTopic: topic,
      reasonMirror: `${inquiryLens} 시선에서 본 선택 — 남의 기준이 아닌 스스로 납득하는 이성의 저울`,
      biasCheckAdvice: '남들이 다 그렇게 하니까라는 이유를 빼고도 이 선택이 맞는지 다시 물어보세요.',
      conscienceAlignment: '단기 이익보다 장기적으로 스스로 떳떳할 수 있는 쪽이 결국 흔들리지 않습니다.',
      inquiryPractice: '선택의 이유를 "내가 진짜 원하는 근거"와 "남의 시선" 두 줄로 갈라 적어 보기.',
    };
  }
  if (topic === 'relationship') {
    return {
      questionTopic: topic,
      reasonMirror: `${inquiryLens} 시선에서 본 관계 — 편견을 걷어내고 동등한 존엄을 마주하는 자리`,
      biasCheckAdvice: '상대의 의도를 단정 짓는 대신, 내가 확인한 사실만 따로 떼어 놓고 살펴보세요.',
      conscienceAlignment: '서로의 다름을 틀림으로 재단하지 않을 때 대화가 다시 열립니다.',
      inquiryPractice: '상대에게 서운했던 일에서 내 해석을 빼고 관찰된 사실 1문장만 남기기.',
    };
  }
  if (topic === 'healing') {
    return {
      questionTopic: topic,
      reasonMirror: `${inquiryLens} 시선에서 본 회복 — 과도한 자책을 멈추고 자연의 질서로 돌아가는 자리`,
      biasCheckAdvice: '지금 나를 몰아붙이는 내면의 비판이 합당한 기준인지, 지친 마음의 과장인지 구분하세요.',
      conscienceAlignment: '몸과 마음을 돌보는 일 역시 이성이 지켜야 할 가장 기본적인 질서입니다.',
      inquiryPractice: '오늘 나를 가장 지치게 만든 생각 하나에 "정말 그럴까?"라고 조용히 반문해 보기.',
    };
  }
  return {
    questionTopic: topic,
    reasonMirror: `${inquiryLens} 시선에서 본 성찰 — 익숙한 관성을 멈추고 본래의 질문을 묻는 자리`,
    biasCheckAdvice: '당연하게 믿어 왔던 전제 하나를 잠시 내려놓고 처음 보는 것처럼 바라보세요.',
    conscienceAlignment: '고요한 성찰은 외부의 소음을 줄이고 내면의 명료한 기준을 되찾아 줍니다.',
    inquiryPractice: '오늘 하루 아무 판단 없이 5분간 창밖이나 조용한 공간을 바라보며 질문 정리하기.',
  };
}

export function calculateEthiopianZeraYacobHatataReason(
  profile?: UserProfile,
  question?: string,
  now: Date = new Date(),
): EthiopianZeraYacobHatataResult {
  const name = profile?.basic?.name ?? '방문자';
  const birthdate = profile?.basic?.birthdate ?? '';
  const birthtime = profile?.basic?.birthtime ?? '';
  const topic = classifyHatataTopic(question);

  const seed = `ETHIOPIAN-HATATA:${name}:${birthdate}:${birthtime}:${topic}:${(question ?? '').trim()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const lenses = [
    '이성의 빛 — 맹목과 추측을 걷어내고 사실로 검증하는 시선',
    '동굴의 고요 — 바깥 소음을 끄고 자기 내면의 답을 듣는 시선',
    '공정한 저울 — 나와 타인을 같은 존엄과 기준으로 대하는 시선',
    '자연 질서의 조화 — 억지 없이 순리대로 흐름을 읽는 시선',
  ];
  const lensIdx = Math.abs(hash) % lenses.length;
  const inquiryLens = lenses[lensIdx];
  const compSeed = `${seed}|companion`;
  let compHash = 0;
  for (let i = 0; i < compSeed.length; i++) {
    compHash = (compHash << 5) - compHash + compSeed.charCodeAt(i);
    compHash |= 0;
  }
  const companionOffset = 1 + (Math.abs(compHash) % (lenses.length - 1));
  const companionLens = lenses[(lensIdx + companionOffset) % lenses.length];
  const inquiryPhase = HATATA_INQUIRY_PHASES[(Math.abs(hash) >> 3) % HATATA_INQUIRY_PHASES.length];
  const shadowWarning = HATATA_SHADOW_WARNINGS[(Math.abs(compHash) >> 4) % HATATA_SHADOW_WARNINGS.length];

  const situationalHatataAudit = buildSituationalHatataAudit(topic, inquiryLens);
  const temporalReasonPulse = buildTemporalReasonPulse(now);

  const trimmedQ = (question ?? '').trim();
  const ritualAction = `${situationalHatataAudit.inquiryPractice} 이어서 ${situationalHatataAudit.biasCheckAdvice} (${inquiryPhase})`;
  const reflectionFocus = `${inquiryLens} · ${companionLens} · ${inquiryPhase} · ${temporalReasonPulse.kstTimeWindow} — 사실과 편견을 가르는 이성적 점검`;
  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}'라는 고민에서 '${inquiryPhase}' 국면으로 볼 때, 남의 시선이나 불안을 걷어낸 뒤 내 이성과 양심이 가장 맑게 동의하는 기준은 무엇인가요?`
    : `'${inquiryPhase}' 국면에서 지금 내가 당연하게 믿고 있는 생각 중, 한 번쯤 차분히 다시 검증해 볼 전제는 무엇인가요?`;

  const interpretiveBoundary =
    '본 리포트는 에티오피아 철학자 자라 야곱의 《하타타》 사유를 빌려 이성적 성찰을 돕는 정성적 안내이며, 개인 점수·심리 진단·미래 예측이 아닙니다.';

  const hatataSynthesisMatrix: HatataSynthesisMatrix = {
    inquiryLens,
    conscienceAnchor: situationalHatataAudit.conscienceAlignment,
    integratedAction: `${temporalReasonPulse.inquiryMethod} (${inquiryPhase})${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };
  const hatataCrossAxis = `${inquiryLens.split('—')[0].trim()} × ${inquiryPhase.split('(')[0].trim()} (${topic})`;

  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const calculatedAtKst = `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;

  return {
    engineVersion: ETHIOPIAN_ZERA_YACOB_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTopic: topic,
    hatataCrossAxis,
    inquiryLens,
    companionLens,
    inquiryPhase,
    shadowWarning,
    situationalHatataAudit,
    temporalReasonPulse,
    hatataSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatEthiopianZeraYacobHatataReasonPrompt(res: EthiopianZeraYacobHatataResult): string {
  return [
    `【에티오피아 자라 야곱 《하타타》 이성·성찰 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 질문 주제 분류: ${res.questionTopic} | 하타타 교차 축: ${res.hatataCrossAxis}`,
    `- 탐구 렌즈: ${res.inquiryLens}`,
    `- 동반 탐구 렌즈: ${res.companionLens}`,
    `- 탐구 국면: ${res.inquiryPhase}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 질문 비춤: ${res.situationalHatataAudit.reasonMirror}`,
    `- 편견 점검: ${res.situationalHatataAudit.biasCheckAdvice}`,
    `- 양심 정렬: ${res.situationalHatataAudit.conscienceAlignment}`,
    `- KST 시간대 창: ${res.temporalReasonPulse.kstTimeWindow}`,
    `- 탐구 방법: ${res.temporalReasonPulse.inquiryMethod}`,
    `- 하타타 교차 매트릭스: 렌즈(${res.hatataSynthesisMatrix.inquiryLens}) · 기준(${res.hatataSynthesisMatrix.conscienceAnchor}) · 실천(${res.hatataSynthesisMatrix.integratedAction})`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
