import type { UserProfile } from '../sharedState';

export interface ChachapoyaKuelapResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계/신뢰' | '일/진로' | '재정/균형' | '내면/회복' | '전환/결정';
  cloudCitadel: string;
  companionCitadel: string;
  cloudPhase: string;
  kuelapCrossAxis: string;
  kuelapInsight: string;
  andesCloudTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CLOUD_PHASES = [
  '원형 포용(날카로운 모서리 대신 바람을 감싸 돌리며 충격을 줄이는 시기)',
  '운해 조망(발밑 안개에서 한 걸음 올라서서 전체 지형을 다시 읽는 시기)',
  '물안개 호흡(중간에 한 번 꺾여 숨을 고르며 지금 손안의 자원을 키우는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '모서리 없이 둥글게 감싸려다 분명하게 바로잡아야 할 원칙선까지 흐려지지 않도록 살피세요.',
  '안개 위에서 큰 지형만 내려다보느라 오늘 당장 발밑에서 건너야 할 작은 돌다리를 놓치지 않도록 점검하세요.',
  '완벽한 토양이 올 때까지 기다리거나 꺾임 마디를 길게 두다가 실행의 흐름 자체가 식어 버리지 않도록 유의하세요.',
] as const;

const CITADELS = [
  {
    citadel: '쿠엘랍의 둥근 돌집(Kuelap · 모서리 없이 바람을 감싸 돌리는 원형 집)',
    insight: '날카롭게 각을 세워 부딪치기보다 둥글게 감싸 안는 태도가 거센 바람을 훨씬 잘 견딤',
    tone: '안데스 구름숲 능선 위 이끼 낀 석회암 성벽을 감싸 흐르는 하얀 운해',
    ritual: '오늘 부딪치는 의견이나 까다로운 상황 앞에서, 모서리를 세우기 전에 한 발 물러서서 전체 그림을 먼저 바라보세요.',
    question: '지금 발밑의 안개 때문에 답답해 보일 뿐, 구름숲 위에서 내려다본다면 전혀 다른 길로 보일 선택은 무엇인가요?',
  },
  {
    citadel: '구름의 전사(Cloud Warriors · 안개 너머를 먼저 내다보는 높은 시선)',
    insight: '당장 발밑의 안개에 시야가 가려도 한 걸음 높은 곳에서 전체 지형을 떠올리면 길이 보임',
    tone: '해발 삼천 미터 산마루 위로 서서히 걷히는 푸른 아침 안개',
    ritual: '세부 항목에 매몰되기 전에 종이 맨 위에 오늘 내가 가려는 큰 지형도 한 줄을 먼저 적어 보세요.',
    question: '당장 발밑의 자잘한 안개에서 한 걸음만 올라서면 훨씬 선명해질 오늘의 큰 방향은 어디인가요?',
  },
  {
    citadel: '고크타 폭포(Gocta · 두 단으로 떨어지며 숲 전체에 물안개를 채우는 흐름)',
    insight: '쉬지 않고 쏟아붓기보다 중간에 한 번 꺾여 숨을 고르는 마디가 있어야 멀리까지 적심',
    tone: '울창한 난초 숲 절벽을 타고 시원하게 떨어지는 하얀 물줄기',
    ritual: '오전과 오후 작업 사이에 5분간 의도적인 꺾임 마디를 넣어 호흡을 고른 뒤 다음 단계로 넘어가 보세요.',
    question: '쉬지 않고 쏟아붓기보다 고크타 폭포처럼 중간에 한 번 꺾여 숨을 고를 때 더 멀리 닿을 일은 무엇인가요?',
  },
  {
    citadel: '다이아몬드 프리즈(Diamond Frieze · 돌담에 새긴 눈과 파도의 기하학)',
    insight: '반복되는 일상 속에서도 나만의 질서와 리듬을 새겨 두면 마음이 쉽게 흐트러지지 않음',
    tone: '고대 석벽 둘레를 따라 정갈하게 이어진 지그재그 돌 문양',
    ritual: '오늘 반복하는 일 중 하나에 나만의 작은 정돈 규칙을 세워 마음의 질서를 지켜 보세요.',
    question: '어수선한 변수 속에서도 다이아몬드 프리즈 문양처럼 일정하게 새겨 두고 싶은 나만의 일상 리듬은 무엇인가요?',
  },
  {
    citadel: '운무림의 난초(Cloud Orchid · 척박한 바위 위에서도 안개를 머금고 피는 꽃)',
    insight: '완벽한 토양이 주어지지 않아도 지금 내 주위의 작은 온기와 수분만으로 충분히 자람',
    tone: '안개 머금은 고목 가지 위에서 조용히 피어난 연보라빛 야생 난초',
    ritual: '아직 갖추어지지 않은 조건을 탓하기보다 지금 내 손안에 이미 있는 작은 자원 하나를 먼저 활용해 보세요.',
    question: '완벽한 토양이 오기를 기다리는 대신, 지금 주변의 작은 온기와 안개만으로도 싹틔울 수 있는 일은 무엇인가요?',
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

function classifyKuelapTopic(question?: string): ChachapoyaKuelapResult['questionTopic'] {
  const q = (question ?? '').toLowerCase();
  if (/(사랑|연애|관계|결혼|사람|가족|친구|갈등|화해|신뢰|동료)/.test(q)) return '관계/신뢰';
  if (/(일|직장|진로|이직|사업|공부|시험|성과|일정|시야)/.test(q)) return '일/진로';
  if (/(돈|재정|투자|소비|수입|지출|저축|자산|균형)/.test(q)) return '재정/균형';
  if (/(마음|불안|지침|회복|휴식|수면|건강|감정|호흡|안개)/.test(q)) return '내면/회복';
  return '전환/결정';
}

export function calculateChachapoyaCloudForestKuelap(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChachapoyaKuelapResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CITADELS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (CITADELS.length - 1));
  const picked = CITADELS[idx];
  const companion = CITADELS[(idx + companionOffset) % CITADELS.length];
  const cloudPhase = CLOUD_PHASES[stableHash(`${seed}|phase`) % CLOUD_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyKuelapTopic(params.question);
  const shortPhase = cloudPhase.split('(')[0].trim();
  const shortCitadel = picked.citadel.split('(')[0].trim();
  const shortCompanion = companion.citadel.split('(')[0].trim();
  const kuelapCrossAxis = `${shortPhase} × ${shortCitadel} · ${shortCompanion} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-CHACHAPOYA-KUELAP-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    cloudCitadel: picked.citadel,
    companionCitadel: companion.citadel,
    cloudPhase,
    kuelapCrossAxis,
    kuelapInsight: `${picked.insight} (동반 결: ${companion.citadel})`,
    andesCloudTone: picked.tone,
    shadowWarning,
    reflectionFocus: `차차포야스 구름숲 지혜의 '${cloudPhase}' 흐름에서 '${picked.citadel}'와 동반 결 '${companion.citadel}'을 함께 짚어, 바람을 흘려보내며 높은 시야를 되찾아 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.citadel})`,
    reflectiveQuestion: `${picked.question} '${cloudPhase}' 국면에서 가장 먼저 고를 시야는 무엇인가요?`,
    interpretiveBoundary: '안데스 북부 차차포야스(Chachapoyas) 쿠엘랍 원형 성채와 구름숲 생태 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChachapoyaKuelapPrompt(res: ChachapoyaKuelapResult): string {
  return [
    `[차차포야스 구름숲·쿠엘랍 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 구름숲 상징: ${res.cloudCitadel} (${res.andesCloudTone})`,
    `- 동반 결: ${res.companionCitadel}`,
    `- 운무림 국면: ${res.cloudPhase}`,
    `- 질문 맥락(${res.questionTopic}) 교차 축: ${res.kuelapCrossAxis}`,
    `- 중심 통찰: ${res.kuelapInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
