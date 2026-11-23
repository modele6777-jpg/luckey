import type { UserProfile } from '../sharedState';

export interface HozhoPillar {
  name: string;
  koreanLabel: string;
  sacredOrder: string;
  coreInsight: string;
  practicalWalk: string;
  reflectiveQuestion: string;
}

export interface NavajoHozhoResult {
  engineVersion: 'LUCKEY-NAVAJO-HOZHO-v2.3.0';
  calculatedAtKst: string;
  questionTopic: '생각·명료' | '계획·순서' | '실천·활력' | '성찰·평정' | '호조 전반';
  questionFocus: string;
  primaryPillar: HozhoPillar;
  balancePillar: HozhoPillar;
  hozhoWalkAxis: string;
  beautyWalkTheme: string;
  ritualAction: string;
  shadowWarning: string;
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
    reflectiveQuestion: '지금 내 머릿속을 복잡하게 만드는 생각 중 확인된 사실과 내가 앞당겨 한 추측을 가른다면 무엇이 남나요?',
  },
  {
    name: 'Nahat’á (단정한 계획과 준비)',
    koreanLabel: '무리 없는 실행의 뼈대',
    sacredOrder: '남방 · 생각을 현실의 걸음으로 옮기는 질서',
    coreInsight: '완벽한 거대 계획보다 오늘 실제로 해낼 수 있는 작고 단정한 순서가 나를 지킵니다.',
    practicalWalk: '오늘 꼭 끝낼 핵심 행동 딱 두 가지만 순서대로 정해 두세요.',
    reflectiveQuestion: '크고 완벽한 청사진 대신 오늘 내 숨결에 맞게 단정히 세울 수 있는 두 걸음의 순서는 무엇인가요?',
  },
  {
    name: 'Iiná (생명력 있는 실천)',
    koreanLabel: '지금 여기에서의 살아 있는 걸음',
    sacredOrder: '서방 · 몸으로 부딪혀 살아 내는 현재',
    coreInsight: '생각만으로는 균형이 완성되지 않으며, 작은 행동 하나가 정체된 공기를 바꿉니다.',
    practicalWalk: '미뤄 둔 짧은 작업 하나를 지금 바로 5분만 손대어 흐름을 열어 보세요.',
    reflectiveQuestion: '머릿속에서 맴돌기만 하던 생각 가운데 지금 5분만 손대어도 공기가 달라질 행동은 무엇인가요?',
  },
  {
    name: 'Sihasin (성찰과 고요한 확신)',
    koreanLabel: '지나온 걸음을 다독이는 평정',
    sacredOrder: '북방 · 경험을 지혜로 묶는 마무리',
    coreInsight: '잘한 점과 아쉬운 점을 모두 품고 내일의 나에게 고요한 신뢰를 건네는 시간입니다.',
    practicalWalk: '오늘 해낸 작은 성취 하나를 인정하고 어깨의 힘을 천천히 빼 보세요.',
    reflectiveQuestion: '내 앞과 뒤에 아름다움과 질서를 세운다면 지나온 걸음에서 이미 충분히 잘 지켜 낸 나의 몫은 무엇인가요?',
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

const HOZHO_SHADOWS = [
  '사실과 추측을 가르는 명료함이 지나쳐, 아직 논리로 정리되지 않은 직관이나 감정의 신호까지 성급히 잘라 내지 않도록 살피세요.',
  '단정한 순서와 계획에 매달리다 보면, 예상치 못한 좋은 변수가 들어왔을 때 순서를 유연하게 바꿀 여지를 놓칠 수 있습니다.',
  '지금 당장 움직여 공기를 바꾸는 실천력이 조급함으로 번져 충분히 익지 않은 말이나 결정을 앞세우지 않게 호흡을 고르세요.',
  '지나온 걸음을 다독이는 고요한 성찰이 이미 끝난 과거의 아쉬움을 계속 되새김질하며 오늘의 발걸음을 묶어 두어서는 안 됩니다.',
];

function classifyNavajoTopic(q: string): NavajoHozhoResult['questionTopic'] {
  if (/생각|명료|복잡|사실/.test(q)) return '생각·명료';
  if (/계획|순서|준비|정리/.test(q)) return '계획·순서';
  if (/실천|행동|시작|움직/.test(q)) return '실천·활력';
  if (/성찰|평정|균형|걷고/.test(q)) return '성찰·평정';
  return '호조 전반';
}

export function calculateNavajoHozhoBeautyBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NavajoHozhoResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyNavajoTopic(q);
  const questionFocus = q || '아름다움과 균형 속의 걸음';
  const seedBase = `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|navajo-hozho`;
  const seed = stableHash(seedBase);

  const primaryIdx = seed % HOZHO_PILLARS.length;
  const balanceOffset = 1 + (stableHash(`${seedBase}|balance`) % (HOZHO_PILLARS.length - 1));
  const balanceIdx = (primaryIdx + balanceOffset) % HOZHO_PILLARS.length;
  const primaryPillar = HOZHO_PILLARS[primaryIdx];
  const balancePillar = HOZHO_PILLARS[balanceIdx];
  const hozhoWalkAxis = `${primaryPillar.name.split('(')[0].trim()} ↔ ${balancePillar.name.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-NAVAJO-HOZHO-v2.3.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionTopic,
    questionFocus,
    primaryPillar,
    balancePillar,
    hozhoWalkAxis,
    beautyWalkTheme: `${primaryPillar.koreanLabel}으로 길을 열고 ${balancePillar.koreanLabel}으로 균형을 맞추는 호조(Hózhó) 걸음`,
    ritualAction: primaryPillar.practicalWalk,
    shadowWarning: HOZHO_SHADOWS[primaryIdx],
    reflectionFocus: `${primaryPillar.name}(${primaryPillar.sacredOrder})의 자리에서 '${balancePillar.name}'의 균형을 함께 엮어 오늘 흐트러진 리듬을 다시 정돈합니다.`,
    reflectiveQuestion: primaryPillar.reflectiveQuestion,
    interpretiveBoundary:
      '나바호 디네 호조 관점은 생각·계획·실천·성찰의 균형을 비유적으로 돕는 상징 도구이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNavajoHozhoPrompt(result: NavajoHozhoResult): string {
  return [
    `[나바호 호조(Hózhó) 아름다움·균형 걷기 엔진 ${result.engineVersion}]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 호조 균형 축: ${result.hozhoWalkAxis}`,
    `- 질문 초점: ${result.questionFocus}`,
    `- 중심 기둥: ${result.primaryPillar.name} (${result.primaryPillar.koreanLabel}) — ${result.primaryPillar.coreInsight}`,
    `- 균형 기둥: ${result.balancePillar.name} (${result.balancePillar.koreanLabel})`,
    `- 조화의 길: ${result.beautyWalkTheme}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
