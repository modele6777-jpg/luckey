import type { UserProfile } from '../sharedState';

export interface HozhoPillar {
  name: string;
  koreanLabel: string;
  sacredOrder: string;
  coreInsight: string;
  practicalWalk: string;
}

export interface NavajoHozhoResult {
  engineVersion: 'LUCKEY-NAVAJO-HOZHO-v2.1.0';
  calculatedAtKst: string;
  questionFocus: string;
  primaryPillar: HozhoPillar;
  balancePillar: HozhoPillar;
  beautyWalkTheme: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const HOZHO_PILLARS: HozhoPillar[] = [
  {
    name: 'Nitsáhákees (맑은 생각의 씨앗)',
    koreanLabel: '새벽빛 같은 명료한 생각',
    sacredOrder: '동방 · 하루를 여는 첫 생각의 정렬',
    coreInsight: '혼란스러운 감정 속에서 사실과 추측을 분리하는 순간 생각의 하늘이 맑아집니다.',
    practicalWalk: '지금 걱정되는 일을 사실 한 줄과 내 염려 한 줄로 나누어 적어 보세요.',
  },
  {
    name: 'Nahat’á (단정한 계획과 준비)',
    koreanLabel: '무리 없는 실행의 뼈대',
    sacredOrder: '남방 · 생각을 현실의 걸음으로 옮기는 질서',
    coreInsight: '완벽한 거대 계획보다 오늘 실제로 해낼 수 있는 작고 단정한 순서가 나를 지킵니다.',
    practicalWalk: '오늘 꼭 끝낼 핵심 행동 딱 두 가지만 순서대로 정해 두세요.',
  },
  {
    name: 'Iiná (생명력 있는 실천)',
    koreanLabel: '지금 여기에서의 살아 있는 걸음',
    sacredOrder: '서방 · 몸으로 부딪혀 살아 내는 현재',
    coreInsight: '생각만으로는 균형이 완성되지 않으며, 작은 행동 하나가 정체된 공기를 바꿉니다.',
    practicalWalk: '미뤄 둔 짧은 작업 하나를 지금 바로 5분만 손대어 흐름을 열어 보세요.',
  },
  {
    name: 'Sihasin (성찰과 고요한 확신)',
    koreanLabel: '지나온 걸음을 다독이는 평정',
    sacredOrder: '북방 · 경험을 지혜로 묶는 마무리',
    coreInsight: '잘한 점과 아쉬운 점을 모두 품고 내일의 나에게 고요한 신뢰를 건네는 시간입니다.',
    practicalWalk: '오늘 해낸 작은 성취 하나를 인정하고 어깨의 힘을 천천히 빼 보세요.',
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

export function calculateNavajoHozhoBeautyBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NavajoHozhoResult {
  const now = params.now ?? new Date();
  const questionFocus = (params.question ?? '').trim() || '아름다움과 균형 속의 걸음';
  const seed = stableHash(
    `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|navajo-hozho`
  );

  const primaryIdx = seed % HOZHO_PILLARS.length;
  const balanceIdx = (primaryIdx + 2) % HOZHO_PILLARS.length;
  const primaryPillar = HOZHO_PILLARS[primaryIdx];
  const balancePillar = HOZHO_PILLARS[balanceIdx];

  return {
    engineVersion: 'LUCKEY-NAVAJO-HOZHO-v2.1.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionFocus,
    primaryPillar,
    balancePillar,
    beautyWalkTheme: `${primaryPillar.koreanLabel}으로 길을 열고 ${balancePillar.koreanLabel}으로 균형을 맞추는 호조(Hózhó) 걸음`,
    ritualAction: primaryPillar.practicalWalk,
    reflectionFocus: `${primaryPillar.name}(${primaryPillar.sacredOrder})의 자리에서 오늘 흐트러진 리듬을 다시 정돈합니다.`,
    reflectiveQuestion: `내 앞과 뒤에 아름다움과 질서를 세운다면 지금 내 걸음에서 가장 먼저 바로잡고 싶은 방향은 어디인가요?`,
    interpretiveBoundary:
      '나바호 디네 호조 관점은 생각·계획·실천·성찰의 균형을 비유적으로 돕는 상징 도구이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNavajoHozhoPrompt(result: NavajoHozhoResult): string {
  return [
    `[나바호 호조(Hózhó) 아름다움·균형 걷기 엔진 ${result.engineVersion}]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 초점: ${result.questionFocus}`,
    `- 중심 기둥: ${result.primaryPillar.name} (${result.primaryPillar.koreanLabel}) — ${result.primaryPillar.coreInsight}`,
    `- 균형 기둥: ${result.balancePillar.name} (${result.balancePillar.koreanLabel})`,
    `- 조화의 길: ${result.beautyWalkTheme}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
