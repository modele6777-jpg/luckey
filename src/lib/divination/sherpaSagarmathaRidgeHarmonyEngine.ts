import type { UserProfile } from '../sharedState';

export type SherpaQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface SherpaSagarmathaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: SherpaQuestionTopic;
  ridgePrinciple: string;
  companionPrinciple: string;
  sagarmathaInsight: string;
  himalayanTone: string;
  altitudePaceAxis: string;
  topicBalanceHint: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  {
    principle: '비스타레이(Bistari · 천천히, 그러나 멈추지 않고 고도에 적응함)',
    insight: '고산에서는 속도를 내는 것보다 내 몸과 마음의 호흡에 맞춰 꾸준히 오르는 편이 정상에 닿음',
    tone: '히말라야 쿰부 계곡의 맑은 새벽 공기와 눈 덮인 사거마타의 황금빛 능선',
    ritual: '오늘 숨이 가빠지는 일이 생길 때마다 속도를 절반으로 낮추고, 지금 내 페이스에 맞는 다음 한 걸음만 정해 보세요.',
    question: '지금 내가 너무 빨리 정상만 바라보느라, 정작 고도 적응과 쉼의 시간을 건너뛰고 있는 일은 무엇인가요?',
  },
  {
    principle: '미욤라(Miyomla · 산과 자연의 허락을 구하는 겸손함)',
    insight: '내 힘만으로 모든 걸 정복하려 들기보다 상황의 기상과 흐름을 존중하며 때를 기다림',
    tone: '능선 마루의 바람에 펄럭이는 다섯 빛깔 룽다(Lungta) 기도 깃발',
    ritual: '상황을 억지로 밀어붙이기 전에 지금의 흐름과 조건이 무엇을 말하고 있는지 한 박자 먼저 살펴보세요.',
    question: '내 힘만으로 억지로 정복하려 하기보다, 산과 기상의 흐름을 존중하며 때를 기다려야 할 일은 무엇인가요?',
  },
  {
    principle: '로프 파트너의 신뢰(Rope Team · 서로의 발걸음을 지탱하는 유대)',
    insight: '험한 구간일수록 혼자 앞서가는 영웅심보다 곁의 동료와 속도를 맞추는 배려가 모두를 살림',
    tone: '빙하 크레바스 앞에서 서로의 줄을 확인하며 건네는 따뜻한 미소',
    ritual: '오늘 함께 일하거나 마음을 나누는 사람 한 명에게 진행 상황과 안부를 짧고 다정하게 맞춰 보세요.',
    question: '험한 구간에서 혼자 앞서가려 애쓰기보다, 곁의 로프 파트너와 발걸음을 맞출 때 더 안전해질 일은 무엇인가요?',
  },
  {
    principle: '베이스캠프의 휴식(Acclimatization · 오르기 위해 내려와 머무는 지혜)',
    insight: '잠시 멈추거나 한 단계 물러서는 것은 후퇴가 아니라 더 높은 곳을 가기 위한 필수 적응임',
    tone: '남체 바자르의 따뜻한 야크 버터 차 한 잔이 주는 깊은 안도감',
    ritual: '오늘 일정 사이에 의식적인 휴식 10분을 넣어, 다음 구간을 오르기 전 숨을 고르는 베이스캠프를 만들어 보세요.',
    question: '후퇴처럼 보여서 망설이고 있지만, 사실은 더 멀리 가기 위해 꼭 필요한 베이스캠프의 휴식은 무엇인가요?',
  },
  {
    principle: '하산의 집중력(Safe Descent · 올라간 뒤 돌아오는 길까지가 완성)',
    insight: '목표에 닿았다고 긴장을 풀지 않고 안전한 일상으로 돌아올 때까지 차분함을 유지함',
    tone: '긴 산행을 마치고 돌담 마을 텡보체 사원으로 돌아오는 고요한 오후',
    ritual: '큰 일을 마친 뒤 바로 다음 일로 뛰어들지 말고, 마무리 정리와 가벼운 휴식으로 안전하게 하산해 보세요.',
    question: '목표에 닿은 뒤 긴장을 놓아 버리기보다, 일상으로 안전하게 돌아오는 하산의 마무리까지 챙겨야 할 일은 무엇인가요?',
  },
];

const TOPIC_BALANCE_HINTS: Record<SherpaQuestionTopic, string> = {
  career: '일과 프로젝트에서는 단기 속도전보다 지금 감당 가능한 고도에 맞춰 꾸준히 페이스 조절을 하는 편이 오래 갑니다.',
  relationship: '관계에서는 혼자 앞서가며 끌어당기기보다 상대의 호흡과 속도를 함께 맞추는 로프 팀의 감각이 중요합니다.',
  wealth: '재정 판단은 무리한 정상 공략보다 베이스캠프 여력을 남겨 두는 보수적 배분이 안전합니다.',
  health: '몸과 마음의 회복에는 억지 강행군보다 중간 고도에서 숨을 고르는 10분의 적응 휴식이 가장 효과적입니다.',
  decision: '결정이 벅찰 때는 전체 능선을 한 번에 넘으려 하지 말고 오늘 디딜 다음 한 걸음만 정하면 충분합니다.',
  general: '상황이 가팔라질수록 비스타레이(천천히, 꾸준히)의 호흡으로 오늘의 페이스를 지키는 편이 좋습니다.',
};

function classifySherpaTopic(question?: string): SherpaQuestionTopic {
  const q = (question ?? '').trim();
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(q)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(q)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(q)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복|호흡/.test(q)) return 'health';
  if (/결정|선택|고민|방향|시작|발걸음/.test(q)) return 'decision';
  return 'general';
}

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
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
  return Math.abs(h);
}

export function calculateSherpaSagarmathaRidgeHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SherpaSagarmathaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PRINCIPLES.length - 1));
  const picked = PRINCIPLES[idx];
  const companion = PRINCIPLES[(idx + companionOffset) % PRINCIPLES.length];
  const questionTopic = classifySherpaTopic(params.question);
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const altitudePaceAxis = `${picked.principle.split('(')[0].trim()} ↔ ${companion.principle.split('(')[0].trim()} 고산 적응 축`;
  const shadowWarning = `[${picked.principle.split('(')[0].trim()} 과잉 경계] 정상 속도나 휴식 중 한쪽에만 치우쳐 현재 호흡의 리듬을 잃지 않도록 살피십시오.`;

  return {
    engineVersion: 'LUCKEY-SHERPA-SAGARMATHA-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    ridgePrinciple: picked.principle,
    companionPrinciple: companion.principle,
    sagarmathaInsight: `${picked.insight} (동반 원리: ${companion.principle})`,
    himalayanTone: picked.tone,
    altitudePaceAxis,
    topicBalanceHint,
    shadowWarning,
    reflectionFocus: `셰르파 고산 지혜의 '${picked.principle}'와 동반 원리 '${companion.principle}'처럼, 무리한 속도전 대신 내 호흡과 상황의 흐름에 맞춘 꾸준한 발걸음을 선택해 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '네팔 히말라야 셰르파(Sherpa)의 사거마타 존중·고산 적응(Bistari) 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSherpaSagarmathaPrompt(res: SherpaSagarmathaResult): string {
  return [
    `[셰르파 사거마타·능선 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 등반 지혜: ${res.ridgePrinciple} (${res.himalayanTone})`,
    `- 동반 원리: ${res.companionPrinciple}`,
    `- 고산 적응 축: ${res.altitudePaceAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 중심 통찰: ${res.sagarmathaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
