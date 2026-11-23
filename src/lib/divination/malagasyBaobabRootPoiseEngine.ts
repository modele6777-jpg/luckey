import type { UserProfile } from '../sharedState';

export interface MalagasyBaobabResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '내면·충전' | '관계·신호' | '일상·직조' | '바오밥 전반';
  malagasyMotif: string;
  companionMotif: string;
  baobabRootAxis: string;
  malagasyInsight: string;
  savannaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '거꾸로 선 바오밥의 물통(Baobab Reservoir · 마른 계절을 견디기 위해 굵은 줄기 속에 물을 채움)',
    insight: '겉으로 화려하게 잎을 피우지 못하는 계절에는 오히려 내 몸통 안에 고요한 물을 채워 두는 시간이 됨',
    tone: '마다가스카르 모론다바의 붉은 흙길 위로 거대한 바오밥나무 그림자가 길게 드리워지는 아침',
    action: '오늘 겉으로 당장 드러나는 성과보다, 내 마음을 마르지 않게 해 주는 휴식이나 수분 한 잔을 먼저 챙겨 보세요.',
    question: '지금 내가 조급히 잎을 피우려다 오히려 중심 줄기의 물기를 빼앗고 있지는 않나요?',
  },
  {
    motif: '피하바나나의 인연 매듭(Fihavanana · 혼자 잘 되는 것보다 서로의 체면과 유대를 지킴)',
    insight: '빠른 결론을 내리려 상대의 마음을 다치게 하기보다 오래 함께 갈 수 있는 온도를 지키는 것이 먼저임',
    tone: '바닷바람이 불어오는 마을 마당에서 이웃들이 눈을 맞추며 인사를 건네는 오전',
    action: '오늘 대화에서 정답을 맞히기보다 상대의 체면과 온도를 지키는 따뜻한 한 마디를 먼저 건네 보세요.',
    question: '빨리 결론을 내리려다 정작 오래 함께 가야 할 관계의 온도를 식히고 있는 대목은 없나요?',
  },
  {
    motif: '바라 라피아 직조(Lamba Weaving · 얇은 야자 잎 섬유를 엮어 삶을 감싸는 천을 만듦)',
    insight: '오늘 스쳐 가는 작은 성의와 사소한 시간들도 엮어 보면 내 어깨를 덮는 든든한 천이 됨',
    tone: '햇살이 비치는 붉은 벽돌 집 처마 아래, 햇볕에 말린 라피아 실이 반짝이는 낮',
    action: '오늘 하루 중 사소해서 흘려보내기 쉬운 성의나 습관 하나를 정성껏 이어 붙이는 10분을 써 보세요.',
    question: '작아서 대수롭지 않게 넘겼지만 차곡차곡 엮어 두면 나를 따뜻하게 감싸 줄 일상의 실마리는 무엇인가요?',
  },
  {
    motif: '여우원숭이의 숲 건너뛰기(Indri Call · 높은 나무 꼭대기에서 울음으로 서로의 위치를 확인함)',
    insight: '숲이 깊어 앞이 안 보일 때는 조급히 땅으로 내려가기보다 내 위치를 알리는 신호를 먼저 보내면 됨',
    tone: '안개 낀 동부 열대우림의 높은 가지 사이로 맑고 긴 울림이 퍼져 나가는 오후',
    action: '혼자 답을 찾다 막힌 일이 있다면 현재 상황과 내 위치를 솔직히 알리는 짧은 메시지를 오늘 먼저 보내 보세요.',
    question: '숲이 깊어 방향이 흐릴 때 혼자 내려가기보다 먼저 내 신호를 보내 확인해야 할 연결은 무엇인가요?',
  },
  {
    motif: '붉은 토양 위의 별빛(Red Earth Dusk · 해가 진 뒤에도 붉은 땅이 낮의 온기를 머금음)',
    insight: '하루가 끝났다고 모든 노력이 사라지는 것이 아니라 내 안의 붉은 토양에 온기로 남음',
    tone: '노을이 짙게 물든 바오밥 가로수길 너머로 첫 별이 조용히 떠오르는 저녁',
    action: '오늘 잠들기 전, 결과와 상관없이 내가 정성껏 보낸 시간 한 가지를 떠올리며 스스로에게 수고했다고 말해 주세요.',
    question: '당장 눈에 띄는 결실이 없더라도 이미 내 안의 붉은 토양에 온기로 쌓여 있는 노력은 무엇인가요?',
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

const BAOBAB_SHADOWS = [
  '줄기 속에 물을 채우며 내실을 다지는 시간도 소중하지만, 밖으로 잎을 내고 표현해야 할 기회까지 계속 미루지는 마세요.',
  '상대의 체면과 온도를 지키려다 정작 꼭 짚고 넘어가야 할 핵심 문제나 내 경계선까지 흐리게 두지는 않도록 하세요.',
  '작은 성의를 엮어 가는 정성이 지나쳐, 정작 큰 그림의 우선순위를 놓치고 사소한 일에만 매달리지 않도록 살피세요.',
  '먼저 신호를 보내 연결을 확인하는 것은 좋으나, 상대의 응답이 오기 전부터 혼자 결론을 앞질러 불안해하지는 마세요.',
  '오늘의 노력을 스스로 다독이는 따뜻한 시선이 내일 개선해야 할 구체적인 과제를 돌아보는 냉철함까지 가리지 않게 하세요.',
];

function classifyBaobabTopic(q: string): MalagasyBaobabResult['questionTopic'] {
  if (/물|줄기|내면|충전|휴식/.test(q)) return '내면·충전';
  if (/관계|유대|신호|연결|온도/.test(q)) return '관계·신호';
  if (/직조|습관|일상|온기|노력/.test(q)) return '일상·직조';
  return '바오밥 전반';
}

export function calculateMalagasyBaobabRootPoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MalagasyBaobabResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyBaobabTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const baobabRootAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-MALAGASY-BAOBAB-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    malagasyMotif: picked.motif,
    companionMotif: companion.motif,
    baobabRootAxis,
    malagasyInsight: picked.insight,
    savannaTone: picked.tone,
    reflectionFocus: `말라가시 바오밥의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 호흡을 함께 엮어, 겉의 잎이 뜸해 보이는 날에도 내 안의 중심 줄기에 고요한 물을 채워 두세요.`,
    ritualAction: picked.action,
    shadowWarning: BAOBAB_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '마다가스카르 말라가시 전통의 피하바나나 유대와 바오밥나무 생장 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMalagasyBaobabPrompt(res: MalagasyBaobabResult): string {
  return [
    `[말라가시·바오밥 뿌리 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 바오밥 뿌리 축: ${res.baobabRootAxis}`,
    `- 말라가시 모티프: ${res.malagasyMotif} (${res.savannaTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.malagasyInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
