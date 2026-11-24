import type { UserProfile } from '../sharedState';

export interface OtavaloLoomResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '제약·무늬' | '장력·조절' | '추진·수용' | '조화·광장' | '정돈·새출발' | '오타발로 전반';
  otavaloMotif: string;
  companionMotif: string;
  otavaloWeaveAxis: string;
  otavaloInsight: string;
  andesTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '이카트 매듭 염색(Ikat Tie-Dye · 실을 묶어 물들인 뒤 풀면 그 자리에 정교한 무늬가 드러남)',
    insight: '잠시 묶여 있고 답답해 보이던 제한들이 나중에 돌아보면 오히려 내 고유한 무늬를 만들어 낸 자리임',
    tone: '에콰도르 임바부라 화산 아래 맑은 안데스 아침 햇살 속, 남색과 흰색 실타래가 바람에 흔들리는 마당',
    action: '지금 나를 답답하게 묶는 제약 하나를 적어 보고, 그 안에서만 나올 수 있는 장점 한 가지를 찾아보세요.',
    question: '지금 나를 답답하게 묶고 있다고 여겼던 제약 중에, 나중에 나만의 고유한 무늬가 되어 줄 부분은 무엇인가요?',
  },
  {
    motif: '허리 베틀의 균형(Backstrap Loom · 내 몸의 무게를 실어 실의 장력을 조절함)',
    insight: '일과 삶의 팽팽함은 바깥에서 정해 주는 게 아니라, 내 몸이 조금 뒤로 물러나거나 다가서며 조절함',
    tone: '산바람이 부는 처마 밑에서 베틀 줄을 허리에 메고 차분히 북을 넘기는 오전',
    action: '오늘 너무 팽팽하게 당겨져 있던 일정이나 마음의 줄을 반 걸음만 다가서서 살짝 느슨하게 풀어 주세요.',
    question: '바깥에서 정해 준 속도에 끌려가지 않고 내 몸의 거리로 장력을 조절하고 싶은 일은 무엇인가요?',
  },
  {
    motif: '임바부라 화산과 호수의 짝(Taita Imbabura & Lago San Pablo · 높은 산과 잔잔한 호수가 마주 봄)',
    insight: '높이 오르려는 추진력과 깊고 고요히 머무는 수용력이 서로 마주 보며 균형을 이루어야 함',
    tone: '산 파블로 호수 수면 위로 구름을 두른 화산 봉우리가 또렷하게 비치는 정오',
    action: '오늘 추진할 목표 한 가지와 고요히 쉬며 수용할 시간 한 토막을 나란히 짝지어 배치해 보세요.',
    question: '높이 오르려는 추진력 옆에 잔잔한 호수처럼 마주 세워 두어야 할 나만의 고요한 수용력은 무엇인가요?',
  },
  {
    motif: '토요일 광장의 색채 조화(Poncho Market · 저마다 다른 빛깔의 직물들이 한 광장에 모여 어우러짐)',
    insight: '내 색깔을 잃지 않으면서도 다른 사람의 다양한 빛깔과 나란히 놓일 때 전체 풍경이 가장 빛남',
    tone: '붉고 푸른 직물들이 돌바닥 광장에 펼쳐져 활기찬 대화가 오가는 오후',
    action: '내 취향이나 방식을 지키면서도 상대의 다른 방식 하나를 오늘 기꺼이 나란히 인정해 주세요.',
    question: '내 고유의 색깔을 잃지 않으면서도 타인의 다른 빛깔과 나란히 어우러질 수 있는 자리는 어디인가요?',
  },
  {
    motif: '페구체 폭포의 물안개(Peguche Cascade · 직물을 짜기 전 맑은 물에 마음과 실을 함께 씻음)',
    insight: '새로운 장면을 시작하기 전에는 지난날의 먼지와 조급함을 맑은 물로 가볍게 헹구어 내는 편이 좋음',
    tone: '유칼립투스 숲 사이 폭포에서 피어오른 서늘한 물안개가 지는 해에 반짝이는 저녁',
    action: '새 일을 시작하기 전 3분만 책상을 정돈하고 미지근한 물 한 잔으로 이전 장면의 피로를 씻어 내세요.',
    question: '새로운 실을 엮기 전에 맑은 물로 가볍게 헹구어 내고 싶은 지난날의 조급함은 무엇인가요?',
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

const OTAVALO_SHADOWS = [
  '제약 속에서 고유한 무늬를 찾는 긍정이 불필요하게 나를 옭아매는 낡은 조건까지 "좋은 뜻이 있겠지"라며 참고 견디는 태도가 되지 않게 하세요.',
  '내 몸의 거리로 실의 장력을 조절하는 유연함이 해야 할 일의 기준선까지 너무 느슨하게 풀어 버리는 나태함으로 흘러서는 안 됩니다.',
  '추진력과 수용력을 나란히 세우는 균형이 정작 집중해서 밀어붙여야 할 순간에도 에너지를 반씩 쪼개어 미적거리는 망설임이 되지 않게 하세요.',
  '다른 빛깔과 나란히 어우러지는 포용이 내 고유한 무늬와 핵심 원칙까지 희석시키는 무색무취의 타협이 되지 않도록 중심을 지키세요.',
  '새 장면을 열기 전 지난 먼지를 헹구는 정돈이 정작 본 작업은 시작도 못 하고 준비와 청소만 반복하는 미루기가 되지 않게 시간을 정하세요.',
];

function classifyOtavaloTopic(q: string): OtavaloLoomResult['questionTopic'] {
  if (/제약|묶|무늬|장점/.test(q)) return '제약·무늬';
  if (/장력|속도|조절|팽팽/.test(q)) return '장력·조절';
  if (/추진|목표|수용|고요/.test(q)) return '추진·수용';
  if (/색깔|조화|취향|방식/.test(q)) return '조화·광장';
  if (/씻|정돈|새|시작/.test(q)) return '정돈·새출발';
  return '오타발로 전반';
}

export function calculateOtavaloAndesLoomBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OtavaloLoomResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyOtavaloTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const otavaloWeaveAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-OTAVALO-LOOM-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    otavaloMotif: picked.motif,
    companionMotif: companion.motif,
    otavaloWeaveAxis,
    otavaloInsight: picked.insight,
    andesTone: picked.tone,
    reflectionFocus: `오타발로 허리 베틀의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 내 몸의 거리로 일의 장력을 조절하고 고유한 무늬를 엮어 보세요.`,
    ritualAction: picked.action,
    shadowWarning: OTAVALO_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '에콰도르 안데스 오타발로의 허리 베틀 직조와 이카트 염색 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOtavaloLoomPrompt(res: OtavaloLoomResult): string {
  return [
    `[오타발로·안데스 베틀 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 베틀 직조 축: ${res.otavaloWeaveAxis}`,
    `- 오타발로 모티프: ${res.otavaloMotif} (${res.andesTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.otavaloInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
