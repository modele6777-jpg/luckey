import type { UserProfile } from '../sharedState';

export interface ParacasWeaveResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '고유·색결' | '긴장·이완' | '이면·전환' | '인내·안개' | '매듭·마감' | '파라카스 전반';
  paracasMotif: string;
  companionMotif: string;
  paracasLoomAxis: string;
  paracasInsight: string;
  loomTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '사막을 감싸는 낙타털 망토(Mantle of Paracas · 건조한 모래바람 속에서도 천 년을 바래지 않는 선명한 실)',
    insight: '유행이나 바깥의 잦은 변화에 휘둘리지 않고, 나만의 고유한 색과 결을 꾸준히 지켜 낼 때 오래 남음',
    tone: '페루 남부 사막의 마른 햇살 아래 진홍빛과 쪽빛 실이 촘촘히 얽혀 빛나는 직물',
    action: '남들의 유행이나 반응에 흔들리던 선택 하나를 오늘 나만의 고유한 취향과 기준 쪽으로 되돌려 놓아 보세요.',
    question: '바깥의 잦은 변화 속에서도 내가 끝까지 바래지 않게 지켜 내고 싶은 나만의 색과 결은 무엇인가요?',
  },
  {
    motif: '날실과 씨실의 교차(Warp & Weft · 서로 다른 방향의 실이 팽팽함과 느슨함을 나누며 천을 이룸)',
    insight: '긴장과 이완이 번갈아 교차해야 삶의 결이 튼튼해지며, 한쪽만 팽팽하면 쉽게 끊어짐',
    tone: '베틀 위에서 일정한 박자로 오가는 북소리와 함께 한 줄씩 무늬가 자라나는 오후',
    action: '오늘 집중해서 일한 시간 직후에 의식적으로 10분간 손에서 일을 내려놓는 느슨한 씨실을 끼워 넣으세요.',
    question: '지금 내 하루의 베틀에서 너무 팽팽하게 당겨져 끊어질 듯한 실은 무엇이며, 어떻게 조금 늦출 수 있을까요?',
  },
  {
    motif: '이중 얼굴의 직조(Double-Cloth · 앞면과 뒷면의 무늬가 서로 반전되며 하나의 천을 이룸)',
    insight: '지금 마주한 불편함이나 이면에도 나름의 질서가 있어, 뒤집어 보면 새로운 쓰임이 보임',
    tone: '빛의 각도에 따라 숨어 있던 기하학 새 무늬가 선명히 떠오르는 직조 천',
    action: '오늘 아쉬웠거나 불편했던 상황 하나를 뒤집어 보며, 그 이면이 내게 남긴 배움이나 쓰임 한 가지를 찾아보세요.',
    question: '지금 내게 낯설거나 불편해 보이지만 뒤집어 보면 새로운 쓰임과 질서가 드러날 이면은 무엇인가요?',
  },
  {
    motif: '바닷바람과 사막 별자리(Coastal Desert Stars · 태평양의 안개가 걷힌 뒤 드러나는 맑은 밤하늘)',
    insight: '안개가 낀 날에도 별자리는 그 자리에 있듯, 당장 보이지 않는다고 방향이 사라진 것은 아님',
    tone: '해안 절벽 위로 차가운 바닷바람이 지나간 뒤 유리처럼 맑아진 사막의 밤',
    action: '결과가 흐릿해 조급해질 때, 안개가 걷히기를 기다리며 오늘 할 수 있는 작은 준비 한 가지만 차분히 챙기세요.',
    question: '당장 눈에 보이지 않아 조급해졌을 뿐, 안개가 걷히면 여전히 그 자리에 있을 내 방향은 무엇인가요?',
  },
  {
    motif: '매듭진 끝단 마무리(Fringe Binding · 풀리지 않도록 마지막 올을 정성껏 묶어 매듭지음)',
    insight: '거창한 시작만큼이나 오늘 손에 쥔 작은 일을 깔끔히 매듭짓는 습관이 내일의 여유를 만듦',
    tone: '직물의 가장자리를 따라 다채로운 술이 가지런히 묶여 바람에 흔들리는 모습',
    action: '오늘 하루 중 어수선하게 흩어져 있던 작은 일 하나를 정해서 끝단 매듭을 짓듯 깔끔히 마무리해 보세요.',
    question: '내일의 여유를 위해 오늘 손에 쥔 채 풀리지 않도록 단정히 매듭지어 두어야 할 작은 일은 무엇인가요?',
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

const PARACAS_SHADOWS = [
  '나만의 고유한 색과 결을 지키는 자부심이 시대가 바뀌며 보태야 할 새로운 실과 배움마저 거부하는 고집이 되지 않게 하세요.',
  '긴장과 쉼을 번갈아 엮는 리듬이 막상 속도를 올려 집중해야 할 마감 구간에서조차 느슨함을 핑계로 손을 놓는 태도가 되어서는 안 됩니다.',
  '불편한 상황의 이면에서 새 쓰임을 찾는 시선이 분명히 선을 그어야 할 부당한 요구나 실수까지 무조건 미화하는 합리화가 되지 않게 주의하세요.',
  '안개가 걷히길 기다리는 인내심이 안개 속에서라도 당장 확인해야 할 사실 점검이나 방향 수정까지 미루는 방치가 되지 않게 살피세요.',
  '작은 일의 끝단을 단정히 매듭짓는 꼼꼼함이 사소한 마감 완성도에 매달려 정작 다음 큰 직조로 넘어가지 못하는 집착이 되지 않게 하세요.',
];

function classifyParacasTopic(q: string): ParacasWeaveResult['questionTopic'] {
  if (/고유|색|취향|기준/.test(q)) return '고유·색결';
  if (/긴장|쉼|이완|균형/.test(q)) return '긴장·이완';
  if (/이면|뒤집|반전|쓰임/.test(q)) return '이면·전환';
  if (/안개|기다|흐릿|조급/.test(q)) return '인내·안개';
  if (/매듭|마감|마무리|끝/.test(q)) return '매듭·마감';
  return '파라카스 전반';
}

export function calculateParacasWeaveTextileHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ParacasWeaveResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyParacasTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const paracasLoomAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-PARACAS-WEAVE-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    paracasMotif: picked.motif,
    companionMotif: companion.motif,
    paracasLoomAxis,
    paracasInsight: picked.insight,
    loomTone: picked.tone,
    reflectionFocus: `파라카스 직조 매듭의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 팽팽한 긴장과 느슨한 쉼의 균형을 맞추며 나만의 결을 한 줄씩 이어 가 보세요.`,
    ritualAction: picked.action,
    shadowWarning: PARACAS_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 페루 파라카스의 직조·매듭 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatParacasWeavePrompt(res: ParacasWeaveResult): string {
  return [
    `[파라카스·직조 매듭 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 직조 베틀 축: ${res.paracasLoomAxis}`,
    `- 직조 모티프: ${res.paracasMotif} (${res.loomTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.paracasInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
