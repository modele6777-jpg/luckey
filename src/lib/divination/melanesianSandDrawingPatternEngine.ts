import type { UserProfile } from '../sharedState';

export interface SandDrawingMotif {
  name: string;
  koreanLabel: string;
  strokePrinciple: string;
  coreInsight: string;
  practicalStep: string;
}

export interface MelanesianSandResult {
  engineVersion: 'LUCKEY-MELANESIAN-SAND-v2.2.0';
  calculatedAtKst: string;
  questionFocus: string;
  primaryMotif: SandDrawingMotif;
  bridgingMotif: SandDrawingMotif;
  continuousThread: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SAND_MOTIFS: SandDrawingMotif[] = [
  {
    name: 'Sandroing 격자 매듭',
    koreanLabel: '끊기지 않는 한 줄 연결',
    strokePrinciple: '손을 떼지 않고 교차점을 통과해 처음과 끝을 잇는 원리',
    coreInsight: '서로 무관해 보이던 고민들이 사실은 하나의 우선순위 매듭으로 연결되어 있습니다.',
    practicalStep: '오늘 머릿속에 뜬 일 세 가지를 종이 한 줄로 이어 가장 먼저 풀 매듭 하나만 동그라미 쳐 보세요.',
  },
  {
    name: '나우이(Naui) 파도 궤적',
    koreanLabel: '왕복하며 다져지는 리듬',
    strokePrinciple: '밀려오고 물러나는 선이 교차하며 균형 잡힌 무늬를 남기는 원리',
    coreInsight: '한 번에 완벽히 끝내려 하기보다 오가며 다듬는 과정 자체가 탄탄한 문양을 만듭니다.',
    practicalStep: '완성도를 100으로 잡기보다 1차 초안이나 10분 시도를 먼저 그려 흐름을 확인하세요.',
  },
  {
    name: '카노(Kano) 별빛 대칭',
    koreanLabel: '중심축을 지키는 대칭 시야',
    strokePrinciple: '모래 위의 기준점을 중심으로 좌우 균형을 맞춰 선을 펼치는 원리',
    coreInsight: '한쪽에 시선이 쏠릴수록 반대편의 여백과 휴식 축을 함께 그려야 무늬가 무너지지 않습니다.',
    practicalStep: '집중해야 할 일 옆에 그만큼의 회복 시간이나 보류 기준을 나란히 적어 두세요.',
  },
  {
    name: '타부아(Tabua) 열린 고리',
    koreanLabel: '다음 대화를 여는 여백',
    strokePrinciple: '선분 끝에 작은 통로를 남겨 다음 이야기가 이어지게 하는 원리',
    coreInsight: '혼자 결론을 닫아 버리기보다 상대와 상황에 여백을 남길 때 더 좋은 해법이 들어옵니다.',
    practicalStep: '결정하기 전 5분만 한 걸음 물러서서 다른 관점이나 질문 하나를 더 받아들여 보세요.',
  },
];

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateMelanesianSandDrawingPattern(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MelanesianSandResult {
  const now = params.now ?? new Date();
  const questionFocus = (params.question ?? '').trim() || '흩어진 생각의 한 줄 연결';
  const seedInput = `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|melanesian-sand`;
  const seed = stableHash(seedInput);

  const primaryIdx = seed % SAND_MOTIFS.length;
  const bridgeOffset = 1 + (stableHash(`${seedInput}|bridge`) % (SAND_MOTIFS.length - 1));
  const bridgeIdx = (primaryIdx + bridgeOffset) % SAND_MOTIFS.length;
  const primaryMotif = SAND_MOTIFS[primaryIdx];
  const bridgingMotif = SAND_MOTIFS[bridgeIdx];

  return {
    engineVersion: 'LUCKEY-MELANESIAN-SAND-v2.2.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionFocus,
    primaryMotif,
    bridgingMotif,
    continuousThread: `${primaryMotif.koreanLabel}에서 출발해 ${bridgingMotif.koreanLabel}으로 자연스럽게 이어지는 연속 맥락`,
    ritualAction: primaryMotif.practicalStep,
    reflectionFocus: `${primaryMotif.name}의 원리(${primaryMotif.strokePrinciple})를 바탕으로 지금의 과제를 한 맥락으로 엮습니다.`,
    reflectiveQuestion: `‘${primaryMotif.koreanLabel}’에서 ‘${bridgingMotif.koreanLabel}’으로 선을 이어 갈 때, 지금 가장 먼저 통과해야 할 핵심 매듭은 무엇인가요?`,
    interpretiveBoundary:
      '멜라네시아 바누아투 모래 그림 관점은 맥락 연결과 우선순위 정리를 돕는 상징 도구이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMelanesianSandPrompt(result: MelanesianSandResult): string {
  return [
    `[바누아투·멜라네시아 모래 그림 연결·궤적 엔진 ${result.engineVersion}]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 초점: ${result.questionFocus}`,
    `- 중심 문양: ${result.primaryMotif.name} (${result.primaryMotif.koreanLabel}) — ${result.primaryMotif.coreInsight}`,
    `- 연결 문양: ${result.bridgingMotif.name} (${result.bridgingMotif.koreanLabel})`,
    `- 연속 맥락: ${result.continuousThread}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
