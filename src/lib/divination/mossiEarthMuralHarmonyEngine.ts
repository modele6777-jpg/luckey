import type { UserProfile } from '../sharedState';

export interface MossiMuralResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '질서·루틴' | '협업·손길' | '휴식·겸손' | '보폭·보호' | '모시벽화 전반';
  mossiMotif: string;
  companionMotif: string;
  earthMuralAxis: string;
  mossiInsight: string;
  earthTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '티에벨레 흙벽의 기하학 무늬(Tiebele Geometry · 붉은 황토와 검은 숯, 흰 고령토로 벽에 질서를 그림)',
    insight: '소박한 재료라도 리듬과 규칙을 담아 반복해 칠하면 평범한 벽이 예술과 보호막이 됨',
    tone: '부르키나파소 사바나의 따스한 햇살 아래, 붉고 검은 선이 단정히 그려진 흙집 앞마당의 아침',
    action: '오늘 하루 반복해서 다질 나만의 작은 정리 루틴 하나를 정해 같은 시간에 차분히 실행해 보세요.',
    question: '지금 내가 거창한 변화만 기다리느라 놓치고 있는, 매일 손으로 다질 수 있는 소박한 질서는 무엇인가요?',
  },
  {
    motif: '손바닥으로 다진 외벽(Hand-Troweled Clay · 기계가 아니라 여러 사람의 손길이 겹쳐 벽을 매끈히 다짐)',
    insight: '혼자 완벽하게 해내려는 조급함 대신 함께 어우러져 다듬는 손길이 훨씬 오래가는 단단함을 만듦',
    tone: '이웃들이 나란히 앉아 흙벽을 매만지며 조용한 웃음소리를 나누는 오전',
    action: '혼자 끌어안고 있던 일 한 가지를 오늘 가까운 동료나 가족과 가볍게 나누어 손을 보태 보세요.',
    question: '혼자 매끈히 마무리하려 애쓰느라 오히려 지치고 있지만, 여러 손길이 겹치면 더 단단해질 일은 무엇인가요?',
  },
  {
    motif: '낮은 출입구와 둥근 처마(Low Threshold · 고개를 숙여야 들어갈 수 있는 작은 문으로 집 안을 지킴)',
    insight: '잠시 몸을 낮추고 겸손해질 줄 아는 태도가 오히려 내 안의 소중한 공간을 안전하게 지켜 줌',
    tone: '햇빛이 뜨거운 한낮, 낮은 흙문 너머로 서늘하고 아늑한 그늘이 드리운 낮',
    action: '바쁜 일정 가운데 잠시 속도를 낮추고, 내 마음의 그늘을 지키는 조용한 휴식 10분을 먼저 확보해 보세요.',
    question: '잠시 고개를 숙이고 속도를 낮출 때 오히려 더 안전하게 지켜낼 수 있는 내 안의 소중한 공간은 어디인가요?',
  },
  {
    motif: '거북이 등껍질 상징(Tortoise Shell Pattern · 조급하지 않고 묵묵히 제 속도로 걸어가는 지혜)',
    insight: '남들보다 조금 늦어 보여도 내 등 위의 껍질과 속도를 믿고 한 걸음씩 가는 편이 결국 먼저 도착함',
    tone: '노을빛이 흙벽의 흰 선을 따라 따뜻하게 번지는 늦은 오후',
    action: '남의 속도와 비교해 조급해졌던 일 하나를 골라 오늘 내 보폭에 맞는 한 걸음만 묵묵히 내딛어 보세요.',
    question: '조금 느려 보여도 내 등 위의 보호막과 보폭을 믿고 묵묵히 걸어가야 할 길은 어디인가요?',
  },
  {
    motif: '비 오기 전 천연 수지 코팅(Nere Coating · 우기가 오기 전에 나무 열매 즙을 발라 벽화를 지킴)',
    insight: '큰 변화나 바쁜 계절이 닥치기 전에 미리 한 겹 보호막을 입혀 두면 마음이 흔들리지 않음',
    tone: '먼 지평선에서 비 구름이 몰려오기 전, 정갈히 마른 흙벽이 고요히 빛나는 저녁',
    action: '다가올 바쁜 일정 전에 나만의 작은 점검 목록이나 안전장치를 미리 한 겹 덧대어 두세요.',
    question: '큰 변화나 우기가 닥치기 전에 미리 한 겹 보호막을 입혀 두면 마음이 한결 편안해질 영역은 무엇인가요?',
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

const MOSSI_SHADOWS = [
  '기하학 무늬처럼 정해진 질서와 루틴을 지키는 데만 집중하다 보면, 예외적인 돌발 상황에 유연하게 선을 바꿀 여지가 좁아질 수 있습니다.',
  '여럿의 손길을 모아 벽을 다지는 협업이 각자가 책임져야 할 분명한 경계와 마감까지 흐리지 않도록 역할을 깔끔히 나누세요.',
  '몸을 낮추고 속도를 줄이는 겸손함이 정작 당당하게 목소리를 내야 할 자리에서도 스스로를 과하게 움츠리게 해서는 안 됩니다.',
  '내 보폭을 지키는 느긋함이 마감이 정해진 현실의 발걸음까지 한없이 늦추는 안이함으로 번지지 않게 살피세요.',
  '미리 보호막을 덧대는 준비성이 지나치면 비가 오기도 전에 온종일 벽만 매만지다 정작 집 안에서 누릴 오늘을 놓칠 수 있습니다.',
];

function classifyMossiTopic(q: string): MossiMuralResult['questionTopic'] {
  if (/질서|루틴|반복|기하학/.test(q)) return '질서·루틴';
  if (/협업|함께|손길|나누/.test(q)) return '협업·손길';
  if (/휴식|속도|낮추|그늘/.test(q)) return '휴식·겸손';
  if (/보폭|보호|미리|점검/.test(q)) return '보폭·보호';
  return '모시벽화 전반';
}

export function calculateMossiEarthMuralHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MossiMuralResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyMossiTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const earthMuralAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-MOSSI-MURAL-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    mossiMotif: picked.motif,
    companionMotif: companion.motif,
    earthMuralAxis,
    mossiInsight: picked.insight,
    earthTone: picked.tone,
    reflectionFocus: `티에벨레 모시 벽화의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 함께 얹어, 소박한 일상에 반복되는 리듬과 미리 챙기는 보호막을 더해 보세요.`,
    ritualAction: picked.action,
    shadowWarning: MOSSI_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '서아프리카 부르키나파소 티에벨레 모시족의 황토 벽화·공동체 수공예 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMossiMuralPrompt(res: MossiMuralResult): string {
  return [
    `[모시·황토 벽화 질서 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 황토 벽화 축: ${res.earthMuralAxis}`,
    `- 모시 모티프: ${res.mossiMotif} (${res.earthTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.mossiInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
