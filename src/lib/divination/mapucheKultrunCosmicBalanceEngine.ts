import type { UserProfile } from '../sharedState';

export interface KultrunDirection {
  name: string;
  koreanLabel: string;
  seasonAspect: string;
  coreInsight: string;
  practicalBalance: string;
  reflectiveQuestion: string;
}

export interface MapucheKultrunResult {
  engineVersion: 'LUCKEY-MAPUCHE-KULTRUN-v2.3.0';
  calculatedAtKst: string;
  questionTopic: '시작·호흡' | '순환·활력' | '갈무리·비움' | '휴식·회복' | '쿨트룬 전반';
  questionFocus: string;
  dominantDirection: KultrunDirection;
  counterDirection: KultrunDirection;
  kultrunCompassAxis: string;
  kumeMongenTheme: string;
  ritualAction: string;
  shadowWarning: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const KULTRUN_DIRECTIONS: KultrunDirection[] = [
  {
    name: 'Puelmapu (동방)',
    koreanLabel: '새벽의 시작과 호흡',
    seasonAspect: '봄 · 맑은 싹틈',
    coreInsight: '새로운 의도를 세우기 전 몸과 마음의 호흡을 먼저 고르게 맞추는 자리입니다.',
    practicalBalance: '오늘 시작할 일 하나만 골라 첫 15분의 리듬을 부드럽게 열어 두세요.',
    reflectiveQuestion: '새벽 동방의 호흡처럼 무리한 속도를 내기 전에 먼저 고르게 맞추고 싶은 시작의 리듬은 무엇인가요?',
  },
  {
    name: 'Pikunmapu (북방)',
    koreanLabel: '온기와 활력의 순환',
    seasonAspect: '여름 · 열린 확장',
    coreInsight: '사람과 자원이 자연스럽게 오가는 흐름 속에서 과열되지 않는 중심을 지킵니다.',
    practicalBalance: '바쁜 일정 사이에도 물 한 잔과 짧은 환기 시간을 먼저 확보하세요.',
    reflectiveQuestion: '활력이 오가는 한낮의 북방처럼 열기를 유지하면서도 과열되지 않게 식혀 줄 여백은 어디에 있나요?',
  },
  {
    name: 'Lafkenmapu (서방)',
    koreanLabel: '바다와 성숙한 갈무리',
    seasonAspect: '가을 · 차분한 수렴',
    coreInsight: '이미 지나온 선택들을 탓하기보다 경험의 결실만 추려 다음 걸음으로 옮깁니다.',
    practicalBalance: '미뤄 둔 작은 마무리를 하나 정리해 마음의 자리를 비워 주세요.',
    reflectiveQuestion: '서방 바다를 바라보는 갈무리의 자리에서 지나온 일 중 감사히 내려놓고 비울 몫은 무엇인가요?',
  },
  {
    name: 'WilliMapu (남방)',
    koreanLabel: '깊은 뿌리와 고요한 휴식',
    seasonAspect: '겨울 · 단단한 내면',
    coreInsight: '바깥의 속도를 잠시 멈추고 땅 아래 뿌리처럼 내면의 체력을 회복하는 구간입니다.',
    practicalBalance: '불필요한 연락이나 소음을 줄이고 조용히 내 컨디션을 먼저 살피세요.',
    reflectiveQuestion: '남방의 깊은 뿌리처럼 바깥 속도를 늦추고 오늘 먼저 회복해 주어야 할 내 안의 체력은 어디인가요?',
  },
];

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const KULTRUN_SHADOWS: Record<string, string> = {
  'Puelmapu (동방)': '새벽의 시작을 차분히 여는 데 너무 오래 머물면, 정작 몸을 일으켜 첫 실행에 나서야 할 때를 놓칠 수 있습니다.',
  'Pikunmapu (북방)': '온기와 활력의 순환을 유지하려다가 쉬어야 할 신호마저 바쁜 일정 뒤로 미루지 않도록 살피세요.',
  'Lafkenmapu (서방)': '지나온 선택을 갈무리하고 비우는 태도가 지금 당장 챙겨야 할 현실적 마무리를 방치하는 체념이 되지 않게 하세요.',
  'WilliMapu (남방)': '깊은 뿌리를 다지며 멈추는 휴식이 길어지면, 다시 바깥과 호흡을 맞출 작은 시동마저 부담스러워질 수 있습니다.',
};

function classifyMapucheTopic(q: string): MapucheKultrunResult['questionTopic'] {
  if (/시작|새벽|호흡|첫/.test(q)) return '시작·호흡';
  if (/활력|순환|열기|바쁜/.test(q)) return '순환·활력';
  if (/갈무리|비움|마무리|내려/.test(q)) return '갈무리·비움';
  if (/휴식|회복|체력|균형|쉼/.test(q)) return '휴식·회복';
  return '쿨트룬 전반';
}

export function calculateMapucheKultrunCosmicBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MapucheKultrunResult {
  const now = params.now ?? new Date();
  const questionFocus = (params.question ?? '').trim() || '삶의 네 방위 균형과 호흡';
  const questionTopic = classifyMapucheTopic(questionFocus);
  const seedBase = `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|mapuche-kultrun`;
  const seed = stableHash(seedBase);

  const primaryIdx = seed % KULTRUN_DIRECTIONS.length;
  const counterOffset = 1 + (stableHash(`${seedBase}|counter`) % (KULTRUN_DIRECTIONS.length - 1));
  const counterIdx = (primaryIdx + counterOffset) % KULTRUN_DIRECTIONS.length;
  const dominantDirection = KULTRUN_DIRECTIONS[primaryIdx];
  const counterDirection = KULTRUN_DIRECTIONS[counterIdx];
  const kultrunCompassAxis = `${dominantDirection.name.split('(')[0].trim()} ↔ ${counterDirection.name.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-MAPUCHE-KULTRUN-v2.3.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionTopic,
    questionFocus,
    dominantDirection,
    counterDirection,
    kultrunCompassAxis,
    kumeMongenTheme: `${dominantDirection.koreanLabel}을 중심에 두고 ${counterDirection.koreanLabel}으로 여백을 맞추는 퀴메 몽겐(Küme Mongen·조화로운 삶) 흐름`,
    ritualAction: dominantDirection.practicalBalance,
    shadowWarning: KULTRUN_SHADOWS[dominantDirection.name] ?? '중심 방위와 보완 방위 사이의 균형이 한쪽으로 쏠리지 않도록 살피세요.',
    reflectionFocus: `${dominantDirection.name}(${dominantDirection.seasonAspect})의 시선과 '${counterDirection.name}'의 보완 호흡을 함께 엮어 오늘의 과부하와 여백을 살핍니다.`,
    reflectiveQuestion: dominantDirection.reflectiveQuestion,
    interpretiveBoundary:
      '마푸체 쿨트룬 관점은 계절과 방위의 균형을 비유적으로 성찰하는 상징 도구이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMapucheKultrunPrompt(result: MapucheKultrunResult): string {
  return [
    `[마푸체 쿨트룬 우주 원환·땅의 균형 엔진 ${result.engineVersion}]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 쿨트룬 방위 축: ${result.kultrunCompassAxis}`,
    `- 질문 초점: ${result.questionFocus}`,
    `- 중심 방위: ${result.dominantDirection.name} (${result.dominantDirection.koreanLabel}) — ${result.dominantDirection.coreInsight}`,
    `- 보완 방위: ${result.counterDirection.name} (${result.counterDirection.koreanLabel})`,
    `- 조화 주제: ${result.kumeMongenTheme}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
