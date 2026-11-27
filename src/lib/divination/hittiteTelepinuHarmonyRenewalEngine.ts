import type { UserProfile } from '../sharedState';

export type TelepinuRenewalPhaseId =
  | 'bee_gentle_search'
  | 'cedar_calming_smoke'
  | 'hearth_order_return'
  | 'eyra_shared_blessing';

export interface TelepinuRenewalPhase {
  id: TelepinuRenewalPhaseId;
  hittiteMotif: string;
  koreanLabel: string;
  coreInsight: string;
  renewalPractice: string;
}

export interface HittiteTelepinuResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계' | '진로·일' | '마음·회복' | '균형 전반';
  activePhase: TelepinuRenewalPhase;
  companionPhase: TelepinuRenewalPhase;
  telepinuReturnAxis: string;
  topicBalanceHint: string;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const TELEPINU_PHASES: readonly TelepinuRenewalPhase[] = [
  {
    id: 'bee_gentle_search',
    hittiteMotif: '작은 벌의 탐색 (끈기 있는 찾음)',
    koreanLabel: '작은 단서로 잃어버린 활력 찾기',
    coreInsight: '거창한 힘보다 작지만 부지런한 관찰이 꽉 막힌 마음의 물꼬를 다시 틔워 줍니다.',
    renewalPractice: '예전에 즐거웠거나 마음이 편해졌던 작은 취미·루틴 하나를 오늘 15분만 다시 꺼내 보세요.',
  },
  {
    id: 'cedar_calming_smoke',
    hittiteMotif: '삼나무 향의 진정 (분노와 긴장 가라앉히기)',
    koreanLabel: '엉킨 감정의 매듭 풀기',
    coreInsight: '억울함이나 조급함이 남아 있을 때는 억지로 밀어붙이기보다 먼저 열기를 식혀야 길이 보입니다.',
    renewalPractice: '오늘 거슬렸던 일 하나를 바로 판단하지 말고 하루만 묵혀 두며 숨을 고르세요.',
  },
  {
    id: 'hearth_order_return',
    hittiteMotif: '화로와 질서의 귀환',
    koreanLabel: '제자리로 돌아오는 생활 리듬',
    coreInsight: '마음이 지칠수록 식사·수면·정리 같은 가장 기본적인 일상의 화로를 다시 지필 때 힘이 돌아옵니다.',
    renewalPractice: '오늘 밤은 평소보다 30분 일찍 잠자리에 들 수 있도록 저녁 일정을 가볍게 정리하세요.',
  },
  {
    id: 'eyra_shared_blessing',
    hittiteMotif: '에이야(Eya) 상록수의 풍요',
    koreanLabel: '다시 싹트는 기운 나누기',
    coreInsight: '회복된 온기는 나 혼자 간직할 때보다 가까운 사람과 나눌 때 더욱 오래 뿌리내립니다.',
    renewalPractice: '주변 사람과 따뜻한 차나 간식을 나누며 가벼운 웃음을 한 번 만들어 보세요.',
  },
] as const;

function formatHittiteKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function classifyTelepinuTopic(q: string): HittiteTelepinuResult['questionTopic'] {
  if (/관계|사랑|연애|사람|갈등|가족/.test(q)) return '관계';
  if (/일|직장|진로|사업|돈|재물|선택/.test(q)) return '진로·일';
  if (/마음|불안|지침|휴식|회복|감정|활력/.test(q)) return '마음·회복';
  return '균형 전반';
}

const TELEPINU_TOPIC_HINTS: Record<HittiteTelepinuResult['questionTopic'], string> = {
  관계: '서로의 체온이 엇갈릴 때는 잘잘못보다 먼저 온기를 되돌리는 작은 안부가 회복의 실마리가 됩니다.',
  '진로·일': '막힌 과제를 한 번에 뚫으려 하기보다 작게 쪼개어 오늘 15분만 손대는 흐름이 좋습니다.',
  '마음·회복': '고갈된 화로에 억지 불을 지피지 말고 수면과 식사 같은 가장 단순한 돌봄부터 챙기세요.',
  '균형 전반': '작은 단서를 살피는 끈기와 감정을 식히는 여유가 함께 맞물릴 때 일상의 리듬이 돌아옵니다.',
};

const TELEPINU_SHADOW_WARNINGS: Record<TelepinuRenewalPhaseId, string> = {
  bee_gentle_search: '작은 단서를 찾다가 사소한 결점까지 과도하게 파고들어 지치지 않도록 경계하세요.',
  cedar_calming_smoke: '열기를 식히는 데만 머물러 정작 필요한 대화와 정리를 미루지 않도록 주의하세요.',
  hearth_order_return: '생활 리듬을 바로잡으려다 스스로에게 지나친 규칙과 엄격함을 씌우지 마세요.',
  eyra_shared_blessing: '온기를 나누려다 내 회복에 필요한 혼자만의 여백까지 다 내어주지 않도록 살피세요.',
};

export function calculateHittiteTelepinuHarmonyRenewal(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HittiteTelepinuResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();
  const questionTopic = classifyTelepinuTopic(query);

  const seedInput = [
    params.profile.basic?.name ?? '',
    JSON.stringify(params.profile.fate ?? {}),
    query,
    now.toISOString().slice(0, 13),
  ].join('|');
  const seed = stableHash(seedInput);

  const activeIdx = seed % TELEPINU_PHASES.length;
  const companionOffset = 1 + (stableHash(`${seedInput}|companion`) % (TELEPINU_PHASES.length - 1));
  const companionIdx = (activeIdx + companionOffset) % TELEPINU_PHASES.length;

  const activePhase = TELEPINU_PHASES[activeIdx];
  const companionPhase = TELEPINU_PHASES[companionIdx];
  const telepinuReturnAxis = `${activePhase.koreanLabel} → ${companionPhase.koreanLabel} (${questionTopic} 축)`;
  const topicBalanceHint = TELEPINU_TOPIC_HINTS[questionTopic];
  const shadowWarning = TELEPINU_SHADOW_WARNINGS[activePhase.id];

  const qualitativeSynthesis =
    `고대 아나톨리아 히타이트의 테레피누 조화·회복 신화로 살피면, 지금은 ` +
    `‘${activePhase.hittiteMotif} — ${activePhase.koreanLabel}’의 국면입니다. ` +
    `${activePhase.coreInsight} 여기에 ‘${companionPhase.koreanLabel}’이 이어져, ` +
    `${questionTopic} 맥락에서 무거워졌던 일상의 리듬을 부드럽게 되살리기 좋은 시점입니다.`;

  const reflectionFocus =
    `${activePhase.koreanLabel}으로 긴장을 풀고 ${companionPhase.koreanLabel}으로 리듬을 회복하는 시점`;

  const ritualAction = activePhase.renewalPractice;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’ 앞에서 ‘${activePhase.koreanLabel}’이 요청하는 오늘의 첫걸음과, ‘${companionPhase.koreanLabel}’으로 이어 갈 여유는 무엇인가요?`
    : `사라졌던 활력을 되찾기 위해 ‘${activePhase.koreanLabel}’에서 오늘 가장 작고 다정하게 불을 지필 수 있는 루틴은 무엇일까요?`;

  return {
    engineName: '고대 히타이트 테레피누 조화·회복 (Hittite Telepinu Renewal)',
    engineVersion: 'LUCKEY-HITTITE-TELEPINU-v2.4.0',
    calculatedAtKst: formatHittiteKstTimestamp(now),
    questionTopic,
    activePhase,
    companionPhase,
    telepinuReturnAxis,
    topicBalanceHint,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    shadowWarning,
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 고대 아나톨리아 히타이트 테레피누 신화의 회복 모티프를 활용한 상징 프레임워크이며, 의학적 진단이나 수치적 운세 점수가 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatHittiteTelepinuPrompt(res: HittiteTelepinuResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 회복 축: ${res.telepinuReturnAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 중심 국면: ${res.activePhase.hittiteMotif} · ${res.activePhase.koreanLabel}`,
    `- 연결 국면: ${res.companionPhase.hittiteMotif} · ${res.companionPhase.koreanLabel}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
