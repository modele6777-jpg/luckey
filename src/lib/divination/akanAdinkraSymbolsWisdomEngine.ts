/**
 * =========================================================================
 * LUCKEY 아칸(Akan) 아딩크라(Adinkra) 지혜 상징 엔진
 * (Akan Adinkra Symbols Wisdom Engine)
 * =========================================================================
 *
 * [전통적 배경]
 * 서아프리카 가나 아칸(Akan) 전통의 아딩크라(Adinkra)는 천에 도장을 찍어 전하던
 * 시각적 지혜 상징 체계다. 과거를 돌아보며 교훈을 되찾는 '산코파(Sankofa)',
 * 겸손과 힘을 함께 지니는 '드웬니멘(Dwennimmen, 숫양의 뿔)', 스스로를 다스리는
 * '기에 냐메(Gye Nyame)'와 균형을 뜻하는 상징들이 삶의 태도와 공동체 감각을
 * 가다듬는 나침반으로 쓰여 왔다.
 *
 * 본 엔진은 아딩크라 상징 체계를 질문 주제와 KST 시간 리듬, 사주 입력 텍스트에
 * 매핑해 정성적 성찰 관점을 구성한다.
 *
 * 원칙:
 * 1. 개인 점수·심리 진단·미래 예측이 아닙니다. 모든 산출은 상징 성찰 문장입니다.
 * 2. 특정 구전 인용을 만들어 귀속하지 않고 상징의 보편적 의미만 정성적으로 씁니다.
 *
 * @version LUCKEY-AKAN-ADINKRA-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const AKAN_ADINKRA_WISDOM_VERSION = 'LUCKEY-AKAN-ADINKRA-v2.4.0';

export type AdinkraQuestionTopic = 'decision' | 'relationship' | 'healing' | 'reflection';

export interface AdinkraSymbolPulse {
  kstTimeWindow: string;
  symbolName: string;
  symbolMeaning: string;
  temporalGuidance: string;
}

export interface SituationalAdinkraAudit {
  questionTopic: AdinkraQuestionTopic;
  symbolMirror: string;
  retrospectiveLesson: string;
  humbleStrengthAdvice: string;
  adinkraPractice: string;
}

export interface AdinkraSynthesisMatrix {
  anchorSymbol: string;
  companionSymbol: string;
  balanceAxis: string;
  integratedAction: string;
}

export interface AkanAdinkraSymbolsWisdomResult {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: AdinkraQuestionTopic;
  symbolArchetype: string;
  companionSymbol: string;
  adinkraPhase: string;
  adinkraCrossAxis: string;
  shadowWarning: string;
  situationalAdinkraAudit: SituationalAdinkraAudit;
  temporalSymbolPulse: AdinkraSymbolPulse;
  adinkraSynthesisMatrix: AdinkraSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const ADINKRA_PHASES = [
  '산코파 회고(지나온 배움을 오늘의 나침반으로 다시 챙기는 시기)',
  '드웬니멘 조율(단단한 추진력 위에 겸손한 경청을 얹는 시기)',
  '기에 냐메 여백(내 손을 떠난 몫을 내려놓고 중심을 비우는 시기)',
] as const;

const ADINKRA_SHADOW_WARNINGS = [
  '과거의 교훈을 되새기다 정작 오늘 앞으로 내디뎌야 할 발걸음까지 미루지 않도록 살피세요.',
  '겸손과 조화를 지키려다 분명히 세워야 할 자기 기준과 요구선까지 흐려지지 않도록 점검하세요.',
  '큰 흐름에 맡긴다는 이유로 내가 직접 매듭지어야 할 현실의 책임까지 놓치지 않도록 유의하세요.',
] as const;

function classifyAdinkraTopic(query?: string): AdinkraQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/결정|선택|이직|창업|시작|지원|계약|돈|재물|일|커리어|진로|승진/.test(q)) return 'decision';
  if (/관계|사람|연인|연애|가족|친구|동료|갈등|다툼|화해|서운|이별|사랑/.test(q)) return 'relationship';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|번아웃|슬픔/.test(q)) return 'healing';
  return 'reflection';
}

function getAdinkraKstHour(now: Date): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    hour12: false,
  });
  return Number(formatter.formatToParts(now).find((p) => p.type === 'hour')?.value || '12') % 24;
}

function buildTemporalSymbolPulse(now: Date, symbolArchetype: string): AdinkraSymbolPulse {
  const hour = getAdinkraKstHour(now);

  if (hour >= 5 && hour < 11) {
    return {
      kstTimeWindow: '아침 — 산코파(Sankofa) 되돌아봄의 창',
      symbolName: symbolArchetype,
      symbolMeaning: '앞으로 나아가기 전 어제 남긴 교훈 하나를 챙겨 들고 출발하는 결',
      temporalGuidance: '아침의 첫 결정은 새 판을 짜기보다 이미 배운 기준 하나를 다시 확인하는 데서 단단해집니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstTimeWindow: '낮 — 드웬니멘(Dwennimmen) 겸손과 힘의 창',
      symbolName: symbolArchetype,
      symbolMeaning: '단단한 추진력과 몸을 낮추는 겸손이 한 몸에서 균형을 이루는 결',
      temporalGuidance: '밀어붙여야 할 일일수록 목소리를 낮추고 상대와 조건의 맥락을 함께 살피는 편이 오래 갑니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstTimeWindow: '저녁 — 은콘손콘손(Nkyinkyim·Nconsonson) 연결과 수렴의 창',
      symbolName: symbolArchetype,
      symbolMeaning: '하루 동안 흩어진 인연과 과제를 한 가닥으로 이어 정리하는 결',
      temporalGuidance: '저녁에는 미완의 일들을 억지로 늘리지 말고, 오늘 이어진 연결 하나에 감사하며 매듭을 지으세요.',
    };
  }
  return {
    kstTimeWindow: '밤 — 기에 냐메(Gye Nyame) 내려놓음과 경외의 창',
    symbolName: symbolArchetype,
    symbolMeaning: '내 손으로 쥘 수 없는 영역을 인정하고 마음을 쉬게 하는 결',
    temporalGuidance: '밤이 깊을수록 통제하려는 마음을 잠시 내려두고, 내일 다시 볼 여백을 남겨 두세요.',
  };
}

function buildSituationalAdinkraAudit(
  topic: AdinkraQuestionTopic,
  symbolArchetype: string,
): SituationalAdinkraAudit {
  if (topic === 'decision') {
    return {
      questionTopic: topic,
      symbolMirror: `${symbolArchetype} 상징 아래 선택을 재는 결 — 과거의 경험과 오늘의 겸손을 함께 세우는 자리`,
      retrospectiveLesson: '예전에 비슷한 갈림길에서 후회했거나 잘 풀렸던 이유 한 가지를 먼저 떠올려 보세요.',
      humbleStrengthAdvice: '확신이 클수록 한 발 물러서서 반론 하나를 스스로에게 물어본 뒤 결정하세요.',
      adinkraPractice: '종이에 이번 선택의 핵심 조건 2줄과 과거에서 가져올 교훈 1줄을 나란히 적어 보기.',
    };
  }
  if (topic === 'relationship') {
    return {
      questionTopic: topic,
      symbolMirror: `${symbolArchetype} 상징 속 관계의 매듭 — 힘이 아니라 상호 존중으로 풀리는 자리`,
      retrospectiveLesson: '이 사람과의 관계에서 처음 좋았던 기억이나 고마웠던 장면을 하나 건져 올려 보세요.',
      humbleStrengthAdvice: '이기는 말보다 관계가 숨 쉴 수 있는 정직하고 부드러운 문장을 먼저 건네세요.',
      adinkraPractice: '상대의 입장에서 가장 신경 쓰였을 지점 한 가지를 짧게 헤아려 적어 보기.',
    };
  }
  if (topic === 'healing') {
    return {
      questionTopic: topic,
      symbolMirror: `${symbolArchetype} 상징의 쉼터 — 무너짐이 아니라 리듬을 고치는 자리`,
      retrospectiveLesson: '지쳤던 시기마다 나를 실제로 회복시켰던 작고 확실한 습관 하나를 되찾아 보세요.',
      humbleStrengthAdvice: '모든 걸 당장 해결하려 하지 말고, 오늘 감당할 몫만 남겨 두는 용기를 내세요.',
      adinkraPractice: '어깨와 턱의 힘을 풀고, 오늘 나에게 가장 관대해질 수 있는 한 가지를 선택하기.',
    };
  }
  return {
    questionTopic: topic,
    symbolMirror: `${symbolArchetype} 상징을 마주한 성찰 — 지나온 발자국과 앞길을 잇는 자리`,
    retrospectiveLesson: '최근 몇 주 사이 내가 반복해서 붙들고 있던 질문의 뿌리를 가만히 살펴보세요.',
    humbleStrengthAdvice: '보여주기 위한 성취보다 스스로 부끄럽지 않은 단단한 기준을 세우세요.',
    adinkraPractice: '오늘 하루 중 가장 마음이 고요했던 순간 하나를 짧게 기록해 두기.',
  };
}

export function calculateAkanAdinkraSymbolsWisdom(
  profile?: UserProfile,
  question?: string,
  now: Date = new Date(),
): AkanAdinkraSymbolsWisdomResult {
  const name = profile?.basic?.name ?? '방문자';
  const birthdate = profile?.basic?.birthdate ?? '';
  const birthtime = profile?.basic?.birthtime ?? '';
  const topic = classifyAdinkraTopic(question);

  const seed = `AKAN-ADINKRA:${name}:${birthdate}:${birthtime}:${topic}:${(question ?? '').trim()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const symbols = [
    '산코파(Sankofa) — 뒤를 돌아보며 소중한 배움을 되찾는 새',
    '드웬니멘(Dwennimmen) — 숫양의 뿔처럼 힘과 겸손을 함께 지닌 결',
    '기에 냐메(Gye Nyame) — 인간의 계산을 넘어서는 큰 질서에 대한 경외',
    '은콘손콘손(Nconsonson) — 이어진 고리처럼 혼자보다 함께 단단해지는 연대',
    '파워호디에(Fawodhodie) — 책임과 함께 오는 자유와 자립의 결',
  ];
  const primaryIdx = Math.abs(hash) % symbols.length;
  let compHash = 0;
  const compSeed = `${seed}|companion`;
  for (let i = 0; i < compSeed.length; i++) {
    compHash = (compHash << 5) - compHash + compSeed.charCodeAt(i);
    compHash |= 0;
  }
  const companionOffset = 1 + (Math.abs(compHash) % (symbols.length - 1));
  const symbolArchetype = symbols[primaryIdx];
  const companionSymbol = symbols[(primaryIdx + companionOffset) % symbols.length];

  let phaseHash = 0;
  const phaseSeed = `${seed}|phase`;
  for (let i = 0; i < phaseSeed.length; i++) {
    phaseHash = (phaseHash << 5) - phaseHash + phaseSeed.charCodeAt(i);
    phaseHash |= 0;
  }
  const adinkraPhase = ADINKRA_PHASES[Math.abs(phaseHash) % ADINKRA_PHASES.length];
  const topicWarningByType: Record<AdinkraQuestionTopic, string> = {
    decision: '과거의 교훈을 되새기다 정작 오늘 앞으로 내디뎌야 할 선택의 기한을 놓치지 않도록 살피세요.',
    relationship: '겸손과 조화를 지키려다 분명히 세워야 할 자기 기준과 요구선까지 흐려지지 않도록 점검하세요.',
    healing: '큰 흐름에 맡긴다는 이유로 오늘 당장 챙겨야 할 수면·식사·휴식 루틴까지 미루지 마세요.',
    reflection: ADINKRA_SHADOW_WARNINGS[Math.abs(phaseHash >> 3) % ADINKRA_SHADOW_WARNINGS.length],
  };
  const shadowWarning = topicWarningByType[topic];

  const situationalAdinkraAudit = buildSituationalAdinkraAudit(topic, symbolArchetype);
  const temporalSymbolPulse = buildTemporalSymbolPulse(now, symbolArchetype);
  const adinkraCrossAxis = `${topic} · ${temporalSymbolPulse.kstTimeWindow.split('—')[0].trim()} · ${adinkraPhase.split('(')[0].trim()}`;

  const trimmedQ = (question ?? '').trim();
  const ritualAction = `${situationalAdinkraAudit.adinkraPractice} 이어서 ${situationalAdinkraAudit.humbleStrengthAdvice} (${adinkraPhase})`;
  const reflectionFocus = `${symbolArchetype} · ${companionSymbol} · ${adinkraPhase} · ${temporalSymbolPulse.kstTimeWindow} — 과거의 배움과 현재의 균형 점검`;
  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}'라는 물음 앞에서 '${adinkraPhase}' 국면을 지나는 지금, 지나온 경험에서 되찾아야 할 교훈 한 가지는 무엇이고 지금 내려놓아야 할 고집은 무엇인가요?`
    : `'${adinkraPhase}' 흐름에서 오늘 나에게 필요한 아딩크라의 태도는 과거를 돌아보는 지혜인가요, 아니면 힘을 낮추는 겸손인가요?`;

  const interpretiveBoundary =
    '본 리포트는 가나 아칸족의 아딩크라(Adinkra) 상징을 빌려 삶의 태도와 균형을 돌아보는 정성적 성찰 안내이며, 개인 점수·심리 진단·미래 예측이 아닙니다.';

  const adinkraSynthesisMatrix: AdinkraSynthesisMatrix = {
    anchorSymbol: symbolArchetype,
    companionSymbol,
    balanceAxis: `${situationalAdinkraAudit.retrospectiveLesson} ↔ ${temporalSymbolPulse.temporalGuidance}`,
    integratedAction: `${situationalAdinkraAudit.humbleStrengthAdvice}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  const calculatedAtKst = `${yyyy}-${mm}-${dd} ${hh}:${mi} +09:00 (KST)`;

  return {
    engineVersion: AKAN_ADINKRA_WISDOM_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTopic: topic,
    symbolArchetype,
    companionSymbol,
    adinkraPhase,
    adinkraCrossAxis,
    shadowWarning,
    situationalAdinkraAudit,
    temporalSymbolPulse,
    adinkraSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatAkanAdinkraSymbolsWisdomPrompt(res: AkanAdinkraSymbolsWisdomResult): string {
  return [
    `【아칸 아딩크라(Adinkra) 지혜 상징 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 질문 주제 분류: ${res.questionTopic}`,
    `- 중심 상징: ${res.symbolArchetype}`,
    `- 보조 상징: ${res.companionSymbol}`,
    `- 상징 국면: ${res.adinkraPhase}`,
    `- 교차 조율 축: ${res.adinkraCrossAxis}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 질문 비춤: ${res.situationalAdinkraAudit.symbolMirror}`,
    `- 되돌아봄 교훈: ${res.situationalAdinkraAudit.retrospectiveLesson}`,
    `- 겸손과 힘의 조언: ${res.situationalAdinkraAudit.humbleStrengthAdvice}`,
    `- KST 시간대 창: ${res.temporalSymbolPulse.kstTimeWindow}`,
    `- 시간대 지침: ${res.temporalSymbolPulse.temporalGuidance}`,
    `- 아딩크라 교차 매트릭스: 중심(${res.adinkraSynthesisMatrix.anchorSymbol}) · 균형축(${res.adinkraSynthesisMatrix.balanceAxis}) · 통합 실천(${res.adinkraSynthesisMatrix.integratedAction})`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
