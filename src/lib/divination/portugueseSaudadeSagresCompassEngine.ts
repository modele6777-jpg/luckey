import type { UserProfile } from '../sharedState';

export type PortugueseQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'decision' | 'general';

export interface PortugueseSagresResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: PortugueseQuestionTopic;
  atlanticCompass: string;
  companionCompass: string;
  sagresInsight: string;
  atlanticTone: string;
  caravelHeadingAxis: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const COMPASSES = [
  {
    compass: '사그레스 곶(Sagres · 미지의 대양 앞에서 지도를 그려 나가는 용기)',
    insight: '모든 답이 미리 정해져 있지 않아도 지금 가진 나침반과 기록을 믿고 한 마디씩 나아감',
    tone: '대서양의 거친 파도가 부딪치는 사그레스 절벽 위에서 바라보는 맑은 수평선',
    ritual: '완벽한 답이 없더라도 지금 내가 가진 단서와 기록을 바탕으로 첫 한 줄의 지도를 그려 보세요.',
    question: '모든 조건이 완벽히 갖춰지기를 기다리기보다, 지금 가진 나침반을 믿고 먼저 그려 볼 항로는 어디인가요?',
  },
  {
    compass: '사우다데(Saudade · 지나간 시간에 대한 애틋함과 그리움의 온기)',
    insight: '과거를 후회로만 가두지 않고 소중했던 기억을 오늘의 다정함으로 데워 쓰는 마음',
    tone: '리스본 알파마 골목 돌바닥 위로 낮게 울려 퍼지는 열두 줄 포르투갈 기타 선율',
    ritual: '지나간 기억 중 아쉬움만 남겼던 장면 하나를 오늘의 다정함으로 다시 해석해 보세요.',
    question: '과거를 후회로만 가두어 두는 대신, 오늘의 나를 따뜻하게 데워 줄 소중한 기억은 무엇인가요?',
  },
  {
    compass: '아줄레주(Azulejo · 작은 타일 조각들이 모여 빚어내는 큰 그림)',
    insight: '하루하루의 사소한 조각들이 엉뚱해 보여도 차곡차곡 맞추다 보면 나만의 무늬가 완성됨',
    tone: '코발트빛 푸른 타일 벽면 위로 부드럽게 부서지는 오후의 햇빛',
    ritual: '오늘 해낸 작고 사소한 일 세 가지를 타일 맞추듯 나란히 적어 한 장의 무늬로 바라보세요.',
    question: '지금은 흩어진 조각처럼 보이지만, 차곡차곡 맞추다 보면 어떤 큰 그림으로 이어질 수 있을까요?',
  },
  {
    compass: '카라벨(Caravel · 역풍을 거슬러 지그재그로 나아가는 삼각돛)',
    insight: '바람이 정면으로 불어온다고 멈추기보다 각도를 틀어 한 걸음씩 전진하는 유연함',
    tone: '타구스 강 하구를 지나 푸른 대서양으로 미끄러져 나가는 하얀 삼각돛',
    ritual: '오늘 막혀 있던 문제 앞에서 정면으로만 밀어붙이지 말고, 카라벨의 삼각돛처럼 다른 각도의 우회로를 하나 떠올려 보세요.',
    question: '지금 내 앞의 역풍 앞에서 멈춰 서 있기보다, 각도를 조금 틀어 나아갈 수 있는 새로운 방향은 어디일까요?',
  },
  {
    compass: '데스코베르타(Descoberta · 익숙한 항구를 떠나 만나는 새로운 시선)',
    insight: '오래 머문 자리가 안전해 보여도 때로는 시야를 넓혀 다른 가능성을 시험해 보는 설렘',
    tone: '안개 걷힌 포르투의 다리 위로 불어오는 상쾌한 바닷바람',
    ritual: '익숙한 동선이나 방식 하나를 오늘만 살짝 바꾸어 새로운 시선으로 하루를 관찰해 보세요.',
    question: '익숙하고 안전한 항구에 머무는 대신, 오늘 가볍게 시험해 볼 만한 새로운 시선은 무엇인가요?',
  },
];

function classifyPortugueseTopic(question?: string): PortugueseQuestionTopic {
  const q = (question ?? '').trim();
  if (/이직|직장|사업|승진|일|커리어|프로젝트|업무/.test(q)) return 'career';
  if (/연애|결혼|사람|관계|가족|갈등|친구|이별|소통/.test(q)) return 'relationship';
  if (/돈|재물|투자|재정|수입|지출|계약|매매/.test(q)) return 'wealth';
  if (/건강|몸|마음|휴식|수면|피로|회복/.test(q)) return 'health';
  if (/결정|선택|고민|방향|시작|역풍|나아가/.test(q)) return 'decision';
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

export function calculatePortugueseSaudadeSagresCompass(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PortugueseSagresResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % COMPASSES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (COMPASSES.length - 1));
  const picked = COMPASSES[idx];
  const companion = COMPASSES[(idx + companionOffset) % COMPASSES.length];
  const questionTopic = classifyPortugueseTopic(params.question);
  const caravelHeadingAxis = `${picked.compass.split('(')[0].trim()} ↔ ${companion.compass.split('(')[0].trim()} 대서양 항로 축`;
  const shadowWarning = `[${picked.compass.split('(')[0].trim()} 과잉 경계] 새로운 항로를 좇거나 지난 기억을 되새기는 데 기울어 지금 눈앞의 한 걸음을 놓치지 않도록 살피십시오.`;

  return {
    engineVersion: 'LUCKEY-PORTUGUESE-SAGRES-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    atlanticCompass: picked.compass,
    companionCompass: companion.compass,
    sagresInsight: `${picked.insight} (동반 항로: ${companion.compass})`,
    atlanticTone: picked.tone,
    caravelHeadingAxis,
    shadowWarning,
    reflectionFocus: `포르투갈 대서양 지혜의 '${picked.compass}'와 동반 항로 '${companion.compass}'처럼, 완벽한 지도가 없더라도 지금 내 손에 있는 작은 단서를 믿고 유연하게 각도를 틀어 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '포르투갈 사그레스 항해 지혜·아줄레주·사우다데 정서를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPortugueseSagresPrompt(res: PortugueseSagresResult): string {
  return [
    `[포르투갈 사우다데·사그레스 나침반 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 대서양 상징: ${res.atlanticCompass} (${res.atlanticTone})`,
    `- 동반 항로: ${res.companionCompass}`,
    `- 대서양 항로 축: ${res.caravelHeadingAxis}`,
    `- 중심 통찰: ${res.sagresInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
