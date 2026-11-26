import type { UserProfile } from '../sharedState';

export interface KarelianRunoResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계·호흡' | '일·꾸준함' | '마음·소박함' | '공명 전반';
  runoMotif: string;
  companionMotif: string;
  kanteleChordAxis: string;
  topicBalanceHint: string;
  kanteleInsight: string;
  forestLakeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '칸텔레 다섯 현(Kantele · 소박한 다섯 줄이 만드는 맑은 울림)',
    insight: '수많은 도구를 갖추지 않아도 내 손에 있는 몇 가지 진실한 요소만으로 충분한 울림을 냄',
    tone: '카렐리야 자작나무 호숫가에 잔잔히 번지는 맑은 현악기 여운',
    ritual: '오늘 5분만 소음을 끄고, 지금 내 손에 있는 가장 소박하고 진실한 요소 몇 가지를 적어 보세요.',
    question: '지금 내가 수많은 조건을 더 채우려 애쓰기보다, 이미 내 손에 있는 소박한 요소로 맑은 울림을 낸다면 무엇일까요?',
  },
  {
    motif: '루노 두 손 맞잡기(Runolaulu · 주거니 받거니 이어지는 호흡)',
    insight: '혼자 독백하듯 몰아붙이기보다 상대의 말을 받아 한 박자 쉬어 갈 때 노래가 완성됨',
    tone: '긴 겨울밤 난로가에서 마주 앉아 손을 맞잡고 나지막이 읊조리는 시가',
    ritual: '오늘 대화나 협업에서 내가 말을 이어가기 전에 상대의 마지막 문장을 한 박자 곱씹어 보세요.',
    question: '혼자 독백하듯 몰아붙이기보다, 누군가와 주거니 받거니 호흡을 맞추면 더 고와질 일은 무엇인가요?',
  },
  {
    motif: '라우루마아(Laulumaa · 말과 노래로 다독이는 마음의 땅)',
    insight: '거친 감정을 억누르기보다 솔직한 말로 꺼내어 다독일 때 마음의 엉킴이 풀림',
    tone: '고운 모래사장과 맑은 소나무 숲이 이어진 라도가 호수 북안의 정적',
    ritual: '속으로만 삼키던 답답함 한 줄을 비난 없이 담백한 나만의 문장으로 꺼내어 적어 보세요.',
    question: '억누르느라 더 엉켜 버린 감정 중에서, 솔직하고 다정한 말로 꺼내어 다독이면 풀릴 매듭은 무엇인가요?',
  },
  {
    motif: '이키푸(Ikipuu · 세월을 견딘 오래된 소나무의 결)',
    insight: '빠르게 뻗어 나간 가지보다 느리더라도 치밀하게 나이테를 쌓은 마음이 오래 감',
    tone: '북방의 추위를 이기고 곧게 자란 붉은 소나무의 단단한 결',
    ritual: '당장 눈에 띄는 성과가 없더라도 매일 꾸준히 나이테를 쌓고 있는 루틴 한 가지를 오늘도 이어가 보세요.',
    question: '빠르게 뻗어 나간 결과보다 느리더라도 치밀하게 내 안에 나이테를 쌓아 가고 싶은 영역은 어디인가요?',
  },
  {
    motif: '아아무카스테(Aamukaste · 새벽 이슬에 씻긴 맑은 시선)',
    insight: '어제의 묵은 피로를 오늘까지 끌고 오지 않고 새벽 공기처럼 산뜻하게 다시 시작함',
    tone: '동틀 무렵 호수 위 물안개가 걷히며 드러나는 투명한 하늘빛',
    ritual: '창문을 열고 맑은 공기를 한 번 마시며, 어제의 묵은 아쉬움 하나를 오늘의 시작선 밖에 내려놓아 보세요.',
    question: '어제의 묵은 피로를 오늘까지 끌고 오지 않고 새벽 이슬처럼 맑게 씻어 내고 싶은 생각은 무엇인가요?',
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

const KARELIAN_SHADOWS = [
  '소박함을 지키려다 정작 필요한 도움과 새로운 도구까지 모두 밀어내지 않도록 경계하세요.',
  '상대의 호흡을 맞추려다 내 진심과 속도를 뒤로 미루는 일이 잦아지지 않게 살피세요.',
  '감정을 말로 꺼내는 데에만 머물고 실제 일상의 정리로 옮기지 못할 수 있음을 유의하세요.',
  '꾸준함만 붙들다 이미 방향을 바꿔야 할 신호까지 놓치지 않도록 가끔 고개를 들어 보세요.',
  '새벽의 맑은 시선을 핑계로 어제 매듭지어야 했던 책임을 가볍게 넘기지 않도록 살피세요.',
];

const KARELIAN_TOPIC_HINTS: Record<KarelianRunoResult['questionTopic'], string> = {
  '관계·호흡': '내가 말을 먼저 채우기보다 상대의 마지막 문장을 한 박자 곱씹을 때 공명이 깊어집니다.',
  '일·꾸준함': '당장 눈에 띄는 성과보다 매일 조용히 나이테를 쌓는 루틴 하나를 지키는 편이 오래 갑니다.',
  '마음·소박함': '수많은 조건을 더 붙이기 전에 지금 손에 쥔 소박한 요소 몇 가지로 충분히 맑은 소리를 낼 수 있습니다.',
  '공명 전반': '복잡한 꾸밈을 덜어내고 내 안에 남은 진실한 울림에 귀를 기울이면 방향이 선명해집니다.',
};

function classifyKarelianTopic(q: string): KarelianRunoResult['questionTopic'] {
  if (/관계|호흡|사람|사랑|연애|대화/.test(q)) return '관계·호흡';
  if (/일|직장|진로|꾸준|루틴|성과/.test(q)) return '일·꾸준함';
  if (/마음|소박|울림|감정|피로|휴식/.test(q)) return '마음·소박함';
  return '공명 전반';
}

export function calculateKarelianRunoKanteleResonance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KarelianRunoResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyKarelianTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const kanteleChordAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = KARELIAN_TOPIC_HINTS[questionTopic];
  const shadowWarning = KARELIAN_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-KARELIAN-KANTELE-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    runoMotif: picked.motif,
    companionMotif: companion.motif,
    kanteleChordAxis,
    topicBalanceHint,
    kanteleInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    forestLakeTone: picked.tone,
    reflectionFocus: `카렐리야 루노·칸텔레 전통의 '${picked.motif}'와 동반 결 '${companion.motif}'처럼, 복잡한 꾸밈을 덜어내고 내 마음에 남은 진실한 울림에 귀를 기울여 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '카렐리야(Karelia)의 루노(Runo) 구전 시가·칸텔레(Kantele) 공명 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKarelianRunoPrompt(res: KarelianRunoResult): string {
  return [
    `[카렐리야 루노·칸텔레 공명 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 공명 축: ${res.kanteleChordAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 루노 상징: ${res.runoMotif} (${res.forestLakeTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 중심 통찰: ${res.kanteleInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
