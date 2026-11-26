import type { UserProfile } from '../sharedState';

export interface RyukyuIcharibaChodeResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '인연·환대' | '생명·돌봄' | '품앗이·연대' | '첫인사·밝음' | '숙성·기다림' | '류큐 전반';
  islandMotif: string;
  companionMotif: string;
  icharibaBridgeAxis: string;
  topicBalanceHint: string;
  chodeInsight: string;
  seaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '이차리바 초데(한 번 만나면 모두가 형제)',
    insight: '스쳐 가는 인연과 사소한 대화 속에서도 따뜻한 존중을 남기면 뜻밖의 도움이 돌아오는 이치',
    tone: '에메랄드빛 산호 바다 위로 부는 부드러운 남풍',
    action: '오늘 마주치는 가족·동료·점원 중 한 분에게 평소보다 반 톤 밝게 고마움이나 인사를 건네 보세요.',
    question: '오늘 내 하루를 가장 따뜻하게 바꿀 수 있는 아주 작은 친절 한 가지는 누구에게(또는 나에게) 건넬 수 있을까요?',
  },
  {
    motif: '누치 두 타카라(목숨과 오늘 하루가 보물)',
    insight: '멀리 있는 거창한 성취를 좇다 지치기보다 지금 살아 숨 쉬는 내 몸과 마음을 먼저 아끼는 지혜',
    tone: '산호 돌담 위에 피어난 붉은 히비스커스 꽃',
    action: '오늘 하루 중 내 몸이 가장 먼저 원하는 물 한 잔, 스트레칭, 혹은 짧은 숨 고르기 3분을 우선 챙겨 보세요.',
    question: '멀리 있는 목표를 좇느라 정작 지금 살아 숨 쉬는 내 몸과 마음에 소홀했던 부분은 무엇인가요?',
  },
  {
    motif: '유이마루(서로 손잡고 돕는 품앗이)',
    insight: '혼자 버겁게 끌고 가던 일을 가볍게 나누어 요청할 때 관계도 일도 함께 살아나는 흐름',
    tone: '저녁 무렵 마을 마당에 울려 퍼지는 산신(Sanshin)의 현 소리',
    action: '혼자 끙끙대고 있던 일 하나를 골라, 믿을 만한 사람에게 가볍게 의견이나 작은 도움을 청해 보세요.',
    question: '내가 혼자 다 짊어져야 한다고 여겼지만 실은 나누어 부탁하면 훨씬 따뜻하게 풀릴 일은 무엇인가요?',
  },
  {
    motif: '테다코(태양의 아이 · 밝은 첫인사)',
    insight: '어색하고 굳은 공기라도 내가 먼저 건네는 짧은 미소와 인사로 분위기가 풀리는 힘',
    tone: '류큐 해안 절벽에 쏟아지는 오전의 맑은 햇살',
    action: '오늘 첫 대화나 메신저를 시작할 때 본론에 앞서 밝은 안부 한 줄을 먼저 건네 보세요.',
    question: '내가 먼저 한 톤 밝은 인사를 건네면 의외로 부드럽게 풀릴 수 있는 관계나 자리에는 어디가 있나요?',
  },
  {
    motif: '아와모리 숙성의 느린 시간',
    insight: '서둘러 맛을 내기보다 시간이 지나며 자연스럽게 깊어지는 관계와 실력을 믿고 기다리는 여유',
    tone: '항아리 속에서 고요히 익어 가는 맑은 술의 향기',
    action: '당장 결과를 재촉하던 일 하나를 골라 오늘만큼은 숙성될 시간을 주기로 마음속에서 한 걸음 물러서 보세요.',
    question: '서둘러 결실을 보려다 오히려 깊은 맛이 배어날 시간을 앗아가고 있던 일은 무엇인가요?',
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

const RYUKYU_SHADOWS = [
  '누구에게나 따뜻하게 건네는 환대가 내 시간과 에너지를 무한정 내어주는 무리한 친절로 소진되지 않게 경계를 두세요.',
  '오늘의 숨 고르기와 돌봄을 아끼는 태도가 지금 꼭 마무리지어야 할 약속이나 일정을 무기한 미루는 핑계가 되지 않게 하세요.',
  '품앗이로 도움을 나누는 연대가 내 몫의 주도적 판단까지 상대에게 떠넘기는 의존으로 흐르지 않도록 균형을 잡으세요.',
  '먼저 건네는 밝은 인사가 내 속마음의 피로나 불편함을 무조건 가리고 웃어야 한다는 감정 노동이 되어서는 안 됩니다.',
  '숙성의 시간을 기다리는 여유가 실제로 물을 주고 손질해야 할 타이밍까지 방치하는 게으름으로 바뀌지 않게 살피세요.',
];

const RYUKYU_TOPIC_HINTS: Record<RyukyuIcharibaChodeResult['questionTopic'], string> = {
  '인연·환대': '작은 존중과 따뜻한 인사 한 마디가 뜻밖의 연결을 여는 열쇠가 됩니다.',
  '생명·돌봄': '거창한 성취보다 지금 살아 숨 쉬는 내 몸과 마음의 온도를 먼저 챙겨 주세요.',
  '품앗이·연대': '혼자 버겁게 짊어지던 일을 신뢰하는 곁과 나누면 기운이 함께 살아납니다.',
  '첫인사·밝음': '굳어 있던 공기라도 내가 먼저 건네는 가벼운 미소가 흐름을 부드럽게 바꿉니다.',
  '숙성·기다림': '서둘러 결실을 재촉하기보다 자연스럽게 깊어질 시간을 믿고 기다려 주세요.',
  '류큐 전반': '나를 돌보는 온기와 곁을 환대하는 마음이 균형을 이룰 때 하루가 편안해집니다.',
};

function classifyRyukyuTopic(q: string): RyukyuIcharibaChodeResult['questionTopic'] {
  if (/인연|주변|공기|환대/.test(q)) return '인연·환대';
  if (/몸|마음|보물|휴식/.test(q)) return '생명·돌봄';
  if (/도움|함께|품앗이|나누/.test(q)) return '품앗이·연대';
  if (/인사|대화|메신저|밝/.test(q)) return '첫인사·밝음';
  if (/기다|숙성|여유|시간/.test(q)) return '숙성·기다림';
  return '류큐 전반';
}

export function calculateRyukyuIcharibaChodeHospitality(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): RyukyuIcharibaChodeResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyRyukyuTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const icharibaBridgeAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = RYUKYU_TOPIC_HINTS[questionTopic];

  return {
    engineVersion: 'LUCKEY-RYUKYU-ICHARIBA-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    islandMotif: picked.motif,
    companionMotif: companion.motif,
    icharibaBridgeAxis,
    topicBalanceHint,
    chodeInsight: picked.insight,
    seaTone: picked.tone,
    reflectionFocus: `오키나와 류큐의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 온기를 함께 엮어, 오늘 만나는 사람과 나 자신에게 조금 더 부드러운 온기를 먼저 건네 보세요.`,
    ritualAction: picked.action,
    shadowWarning: RYUKYU_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '오키나와 류큐 전통의 환대·상부상조(유이마루) 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatRyukyuIcharibaChodePrompt(res: RyukyuIcharibaChodeResult): string {
  return [
    `[류큐 이차리바 초데·유이마루 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 환대 유대 축: ${res.icharibaBridgeAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 섬의 모티프: ${res.islandMotif} (${res.seaTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.chodeInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
