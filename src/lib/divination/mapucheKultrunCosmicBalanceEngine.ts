import type { UserProfile } from '../sharedState';

export interface KultrunDirection {
  name: string;
  koreanLabel: string;
  seasonAspect: string;
  coreInsight: string;
  practicalBalance: string;
}

export interface MapucheKultrunResult {
  engineVersion: 'LUCKEY-MAPUCHE-KULTRUN-v2.1.0';
  calculatedAtKst: string;
  questionFocus: string;
  dominantDirection: KultrunDirection;
  counterDirection: KultrunDirection;
  kumeMongenTheme: string;
  ritualAction: string;
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
  },
  {
    name: 'Pikunmapu (북방)',
    koreanLabel: '온기와 활력의 순환',
    seasonAspect: '여름 · 열린 확장',
    coreInsight: '사람과 자원이 자연스럽게 오가는 흐름 속에서 과열되지 않는 중심을 지킵니다.',
    practicalBalance: '바쁜 일정 사이에도 물 한 잔과 짧은 환기 시간을 먼저 확보하세요.',
  },
  {
    name: 'Lafkenmapu (서방)',
    koreanLabel: '바다와 성숙한 갈무리',
    seasonAspect: '가을 · 차분한 수렴',
    coreInsight: '이미 지나온 선택들을 탓하기보다 경험의 결실만 추려 다음 걸음으로 옮깁니다.',
    practicalBalance: '미뤄 둔 작은 마무리를 하나 정리해 마음의 자리를 비워 주세요.',
  },
  {
    name: 'WilliMapu (남방)',
    koreanLabel: '깊은 뿌리와 고요한 휴식',
    seasonAspect: '겨울 · 단단한 내면',
    coreInsight: '바깥의 속도를 잠시 멈추고 땅 아래 뿌리처럼 내면의 체력을 회복하는 구간입니다.',
    practicalBalance: '불필요한 연락이나 소음을 줄이고 조용히 내 컨디션을 먼저 살피세요.',
  },
];

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const iso = kst.toISOString().slice(0, 19);
  return `${iso}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateMapucheKultrunCosmicBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MapucheKultrunResult {
  const now = params.now ?? new Date();
  const questionFocus = (params.question ?? '').trim() || '삶의 네 방위 균형과 호흡';
  const seed = stableHash(
    `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|mapuche-kultrun`
  );

  const primaryIdx = seed % KULTRUN_DIRECTIONS.length;
  const counterIdx = (primaryIdx + 2) % KULTRUN_DIRECTIONS.length;
  const dominantDirection = KULTRUN_DIRECTIONS[primaryIdx];
  const counterDirection = KULTRUN_DIRECTIONS[counterIdx];

  return {
    engineVersion: 'LUCKEY-MAPUCHE-KULTRUN-v2.1.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionFocus,
    dominantDirection,
    counterDirection,
    kumeMongenTheme: `${dominantDirection.koreanLabel}을 중심에 두고 ${counterDirection.koreanLabel}으로 여백을 맞추는 퀴메 몽겐(Küme Mongen·조화로운 삶) 흐름`,
    ritualAction: dominantDirection.practicalBalance,
    reflectionFocus: `${dominantDirection.name}(${dominantDirection.seasonAspect})의 시선에서 오늘의 과부하와 여백을 함께 살핍니다.`,
    reflectiveQuestion: `지금 내 하루에서 '${dominantDirection.koreanLabel}'과 가장 균형이 필요한 영역은 어디인가요?`,
    interpretiveBoundary:
      '마푸체 쿨트룬 관점은 계절과 방위의 균형을 비유적으로 성찰하는 상징 도구이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMapucheKultrunPrompt(result: MapucheKultrunResult): string {
  return [
    `[마푸체 쿨트룬 우주 원환·땅의 균형 엔진 ${result.engineVersion}]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 초점: ${result.questionFocus}`,
    `- 중심 방위: ${result.dominantDirection.name} (${result.dominantDirection.koreanLabel}) — ${result.dominantDirection.coreInsight}`,
    `- 보완 방위: ${result.counterDirection.name} (${result.counterDirection.koreanLabel})`,
    `- 조화 주제: ${result.kumeMongenTheme}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
