import type { UserProfile } from '../sharedState';

export interface ShonaMbiraResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '첫선율·실행' | '화답·대화' | '정적·휴식' | '리듬·순환' | '엇박·전환' | '음비라 전반';
  mbiraCycle: string;
  companionCycle: string;
  mbiraResonanceAxis: string;
  resonanceInsight: string;
  stoneTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  topicBalanceHint: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CYCLES = [
  {
    cycle: '쿠샤우라(Kushaura) 첫 선율 열기',
    insight: '복잡한 머릿속에서 가장 먼저 들리는 순수한 마음의 한 음을 가만히 짚어 내기',
    tone: '호박 울림통(Deze)의 따뜻한 공명',
    action: '오늘 해야 할 여러 일 가운데 가장 순수하게 마음이 끌리는 첫 음 하나를 먼저 실행해 보세요.',
    question: '복잡한 소음 속에서 가장 먼저 짚어 내고 싶은 내 마음의 순수한 첫 선율은 무엇인가요?',
  },
  {
    cycle: '쿠치니라(Kutsinhira) 화답의 겹침',
    insight: '내 생각만 고집하지 않고 다른 사람의 반응과 어우러지며 새로운 리듬을 만들기',
    tone: '저녁 마당에 번지는 맑은 쇠울림',
    action: '대화를 나눌 때 내 주장 뒤에 상대의 말을 한 박자 더 받아 화답해 보세요.',
    question: '내 생각만 고집하기보다 타인의 반응과 겹쳐져 더 풍성해질 수 있는 리듬은 무엇인가요?',
  },
  {
    cycle: '냐마무사사(Nyamamusasa) 깊은 숲의 정적',
    insight: '말을 보태기 전에 잠깐의 침묵이 들려주는 진짜 속마음을 기다려 주기',
    tone: '그레이트 짐바브웨 석조 담장의 고요',
    action: '좋아하는 잔잔한 음악을 한 곡 끝까지 들으며, 어깨와 턱에 들어간 힘을 천천히 풀어 보세요.',
    question: '말을 급히 보태기 전에 잠깐의 침묵 속에서 기다려 주어야 할 내 진짜 속마음은 무엇인가요?',
  },
  {
    cycle: '부라(Bira) 밤샘 성찰의 순환',
    insight: '반복되는 고민이 오히려 마음을 맑게 닦아 주는 리듬이 될 수 있음을 알아차리기',
    tone: '별빛 아래 이어지는 부드러운 박자',
    action: '자꾸 되돌아오는 고민 하나를 밀어내지 말고, 오늘 밤 어떤 교훈을 남기려는지 한 줄로 적어 보세요.',
    question: '요즘 내 하루의 박자는 너무 빠르게 몰아치고 있나요, 아니면 나만의 고유한 리듬으로 울리고 있나요?',
  },
  {
    cycle: '차마바라(Chamavara) 엇박자의 전환',
    insight: '계획이 어긋난 틈에서 뜻밖의 조화와 새로운 해결책이 피어나는 순간',
    tone: '바람에 흔들리는 아카시아 잎새',
    action: '계획이 어긋난 일 하나를 실패로 묶지 말고, 다른 방향으로 틀어 볼 작은 대안 1가지를 시도해 보세요.',
    question: '예상과 다른 엇박자가 났던 자리에서 오히려 새롭게 열릴 수 있는 조화의 틈은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const SHONA_SHADOWS = [
  '마음이 끌리는 첫 선율(Kushaura)부터 여는 솔직함이 순서를 지켜 처리해야 할 기본 의무까지 건너뛰는 즉흥성으로 흘러서는 안 됩니다.',
  '상대의 말에 화답(Kutsinhira)하며 겹쳐 가는 여유가 내 본래 핵심 메시지까지 흐리게 만드는 눈치 보기가 되지 않게 균형을 잡으세요.',
  '잠깐의 침묵과 정적(Nyamamusasa)을 지키는 태도가 꼭 꺼내야 할 솔직한 피드백이나 거절의 말까지 삼켜 버리는 회피가 되지 않게 살피세요.',
  '반복되는 고민을 닦아 내는 밤샘 순환(Bira)이 똑같은 생각을 제자리에서 맴돌며 실행을 미루는 반추로 고이지 않도록 한 줄 결론을 남기세요.',
  '어긋난 틈에서 새 길을 여는 엇박자(Chamavara)의 재치가 애써 세운 기존 계획과 약속을 가볍게 뒤집는 산만함이 되지 않게 주의하세요.',
];

function classifyShonaTopic(q: string): ShonaMbiraResult['questionTopic'] {
  if (/첫|선율|실행|마음/.test(q)) return '첫선율·실행';
  if (/화답|대화|상대|사람/.test(q)) return '화답·대화';
  if (/정적|침묵|힘|휴식/.test(q)) return '정적·휴식';
  if (/리듬|박자|순환|고민/.test(q)) return '리듬·순환';
  if (/어긋|엇박|대안|전환/.test(q)) return '엇박·전환';
  return '음비라 전반';
}

const SHONA_TOPIC_HINTS: Record<ShonaMbiraResult['questionTopic'], string> = {
  '첫선율·실행': '마음이 끌리는 첫 선율을 열되 순서대로 챙겨야 할 기본 의무도 함께 짚어 두세요.',
  '화답·대화': '상대에게 부드럽게 화답하면서도 내가 전하려는 핵심 메시지 한 줄은 또렷이 남기세요.',
  '정적·휴식': '고요한 정적으로 숨을 고른 뒤에는 필요한 솔직한 말과 경계도 제때 건네세요.',
  '리듬·순환': '반복되는 고민을 곱씹는 데 머물지 말고 오늘 실행할 한 줄 결론으로 리듬을 매듭지으세요.',
  '엇박·전환': '엇박자에서 새 대안을 찾되 이미 약속한 기본 일정과 신뢰의 뼈대는 지켜 가세요.',
  '음비라 전반': '음비라의 맑은 첫 음과 화답의 리듬을 오늘 하루의 호흡에 자연스레 얹어 보세요.',
};

export function calculateShonaMbiraAncestralResonance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ShonaMbiraResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyShonaTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CYCLES.length;
  const picked = CYCLES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (CYCLES.length - 1));
  const companion = CYCLES[(idx + companionOffset) % CYCLES.length];
  const mbiraResonanceAxis = `${picked.cycle.split('(')[0].trim()} ↔ ${companion.cycle.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = SHONA_TOPIC_HINTS[questionTopic];

  return {
    engineVersion: 'LUCKEY-SHONA-MBIRA-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    mbiraCycle: picked.cycle,
    companionCycle: companion.cycle,
    mbiraResonanceAxis,
    resonanceInsight: picked.insight,
    stoneTone: picked.tone,
    reflectionFocus: `음비라의 '${picked.cycle}' 선율을 중심에 두고 '${companion.cycle}'의 울림을 곁들여, 어긋난 마음을 억지로 고치려 하기보다 내 호흡의 리듬부터 다시 맞추어 보세요.`,
    ritualAction: picked.action,
    shadowWarning: SHONA_SHADOWS[idx],
    topicBalanceHint,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '짐바브웨 쇼나 음비라(Mbira) 공명과 순환 미학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatShonaMbiraPrompt(res: ShonaMbiraResult): string {
  return [
    `[쇼나 음비라 공명 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 공명 순환 축: ${res.mbiraResonanceAxis}`,
    `- 선율 순환: ${res.mbiraCycle} (${res.stoneTone})`,
    `- 동반 순환: ${res.companionCycle}`,
    `- 중심 통찰: ${res.resonanceInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
