import type { UserProfile } from '../sharedState';

export interface ElamiteSusaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '루틴·질서' | '분산·여유' | '꾸준·기록' | '기반 전반';
  susaMotif: string;
  companionMotif: string;
  chogaCanalAxis: string;
  elamiteCrossAxis: string;
  topicBalanceHint: string;
  elamiteInsight: string;
  chogaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '초가 잔빌의 겹층 흙벽돌(Chogha Zanbil · 겉을 감싼 구운 벽돌이 속의 흙을 비바람에서 지킴)',
    insight: '유연하고 부드러운 속마음을 지키기 위해서는 바깥에 단단한 일상 루틴이라는 외벽이 필요함',
    tone: '황토빛 평원 위에 계단식 흙벽돌 층이 오후의 긴 그림자를 드리우며 묵묵히 서 있는 모습',
    ritual: '오늘 내 마음의 여유를 지켜 줄 가장 기본적인 생활 루틴 한 가지를 벽돌처럼 세워 두세요.',
    question: '부드러운 속마음을 비바람으로부터 지켜 주기 위해 오늘 세워 둘 단단한 외벽은 무엇인가요?',
  },
  {
    motif: '카룬 강의 관개 수로(Karun Canal · 메마른 들판으로 물을 나누어 보내며 숲을 이룸)',
    insight: '한곳에 고여 있으면 썩거나 넘치기 쉽지만, 필요한 곳으로 조금씩 나누어 보내면 모두가 살아남',
    tone: '갈대밭 사이로 맑은 물길이 잔잔하게 갈라지며 흙내음을 깨우는 아침',
    ritual: '한 번에 몰아서 처리하려던 일을 작은 수로처럼 여러 날에 걸쳐 나누어 흘려보내 보세요.',
    question: '지금 한곳에 고여 넘치기 전에 필요한 곳으로 조금씩 흘려보내야 할 에너지나 할 일은 무엇인가요?',
  },
  {
    motif: '수사의 원통 인장(Cylinder Seal · 젖은 점토 위로 한 바퀴 굴리면 온전한 이야기가 새겨짐)',
    insight: '단 한 번의 큰 결심보다 매일 같은 결로 한 바퀴씩 굴리는 꾸준한 태도가 선명한 흔적을 남김',
    tone: '부드러운 점토판 위로 돌 인장이 지나가며 정교한 숲과 사슴 무늬를 남기는 작업대',
    ritual: '오늘 대단한 성과보다 어제와 같은 결로 이어가는 작은 기록 한 줄을 남겨 보세요.',
    question: '지금 내 마음의 점토판에 매일 한 바퀴씩 조용히 새기고 싶은 나만의 결은 무엇인가요?',
  },
  {
    motif: '엘람의 아치형 통로(Vaulted Passage · 무거운 지붕의 무게를 곡선으로 흘려보냄)',
    insight: '어깨에 얹힌 부담을 정면으로만 버티지 말고, 곡선처럼 분산해 흘려보내는 지혜가 필요함',
    tone: '두꺼운 벽돌 아치 아래 서늘한 그늘과 햇살이 교차하는 고요한 회랑',
    ritual: '오늘 나를 지치게 하는 일의 무게를 혼자 다 받지 말고, 순서를 나누거나 아치처럼 부담을 분산해 보세요.',
    question: '정면으로 버티며 누르고 있던 무게를 아치형 곡선처럼 옆으로 흘려보낼 수 있는 방법은 무엇인가요?',
  },
  {
    motif: '자그로스 산기슭의 샘(Zagros Spring · 바위 틈에서 솟아올라 평원의 더위를 식힘)',
    insight: '바깥의 열기가 거칠수록 내 안의 작은 샘물 하나를 마르지 않게 돌보는 일이 가장 중요함',
    tone: '붉은 바위 언덕 아래 맑은 샘물이 돌확에 고여 하늘을 비추는 정오',
    ritual: '바쁜 일정 속에서도 내 기운을 다시 채워 주는 작은 휴식 시간 10분을 꼭 확보하세요.',
    question: '바깥의 열기가 거칠어질수록 내가 마르지 않게 가장 먼저 돌봐야 할 내 안의 샘물은 어디인가요?',
  },
];

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

const ELAMITE_SHADOWS = [
  '루틴이라는 외벽을 세우느라 정작 예기치 못한 즐거운 변화와 유연성까지 막아 서지 마세요.',
  '할 일을 여러 날로 나누어 흘려보내다 긴급한 마감의 물줄기까지 늦어지지 않도록 살피세요.',
  '어제와 같은 결을 이어 가는 데만 집중해 이미 낡은 방식까지 그대로 반복하지 않도록 점검하세요.',
  '부담을 곡선으로 분산하려다 내가 직접 책임지고 매듭지어야 할 핵심 과제까지 넘기지 마세요.',
  '나만의 샘물에서 기운을 채우는 시간이 현실의 바쁜 과제에서 물러나는 도피가 되지 않게 하세요.',
];

const TOPIC_BALANCE_HINTS: Record<ElamiteSusaResult['questionTopic'], string> = {
  '루틴·질서': '초가 잔빌의 구운 벽돌처럼 기본 루틴을 세우되, 예기치 못한 즐거운 변주도 드나들게 두세요.',
  '분산·여유': '카룬 강 수로처럼 할 일을 나누어 흘리되, 급한 마감의 물길은 놓치지 않게 표시해 두세요.',
  '꾸준·기록': '원통 인장처럼 매일 같은 결로 기록을 이어 가되, 낡은 습관은 주기적으로 새로 깎아 내세요.',
  '기반 전반': '아치형 통로처럼 무게를 분산하고, 자그로스 샘에서 잠시 기운을 채운 뒤 다시 걸음을 잇세요.',
};

function classifyElamiteTopic(q: string): ElamiteSusaResult['questionTopic'] {
  if (/루틴|질서|벽돌|생활|규칙/.test(q)) return '루틴·질서';
  if (/분산|여유|휴식|무게|부담|샘/.test(q)) return '분산·여유';
  if (/꾸준|기록|매일|인장|일|직장/.test(q)) return '꾸준·기록';
  return '기반 전반';
}

export function calculateElamiteSusaWaterChoga(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ElamiteSusaResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyElamiteTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const chogaCanalAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = ELAMITE_SHADOWS[idx];

  const calculatedAtKst = formatKstIso(now);
  const elamiteCrossAxis = `[${picked.motif.split('(')[0].trim()}] × [${companion.motif.split('(')[0].trim()}] × [${questionTopic}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-ELAMITE-SUSA-v2.5.0',
    calculatedAtKst,
    questionTopic,
    susaMotif: picked.motif,
    companionMotif: companion.motif,
    chogaCanalAxis,
    elamiteCrossAxis,
    topicBalanceHint,
    elamiteInsight: picked.insight,
    chogaTone: picked.tone,
    reflectionFocus: `엘람 수사·초가 잔빌의 '${picked.motif}'과 동반 결 '${companion.motif}'을 함께 헤아리며, 부드러운 속마음을 지켜 주는 단단한 일상 루틴을 차분히 다져 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 엘람·수사의 초가 잔빌 지구라트와 수로 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatElamiteSusaPrompt(res: ElamiteSusaResult): string {
  return [
    `[엘람 수사·수로 정원 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 수로·벽돌 축: ${res.chogaCanalAxis}`,
    `- 4중 교차 축: ${res.elamiteCrossAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 수사 모티프: ${res.susaMotif} (${res.chogaTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.elamiteInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
