import type { UserProfile } from '../sharedState';

export interface NubianMeroePrinciple {
  name: string;
  symbol: string;
  guidance: string;
}

export interface NubianMeroeResult {
  engineVersion: string;
  calculatedAtKst: string;
  activePrinciple: NubianMeroePrinciple;
  royalCourageNote: string;
  interpretation: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const NUBIAN_MEROE_PRINCIPLES: NubianMeroePrinciple[] = [
  {
    name: '아페데막(Apedemak)의 당당한 수호와 용기',
    symbol: '메로에 사자 신전',
    guidance: '불필요한 눈치를 보며 내 경계를 양보하기보다 지켜야 할 원칙 앞에서 당당히 서야 할 때입니다.',
  },
  {
    name: '칸다케(Kandake) — 지혜롭고 주체적인 통솔',
    symbol: '누비아 여왕의 왕관',
    guidance: '힘을 과시하기보다 전체 판을 넓게 읽고 차분하게 내 삶의 주도권을 쥐는 리더십이 빛납니다.',
  },
  {
    name: '나일강 하류와 상류를 잇는 교역의 지혜',
    symbol: '황금과 도자기 교차로',
    guidance: '서로 다른 생각과 자원이 만나는 자리에서 열린 태도로 교환하고 연결할 때 새로운 길이 열립니다.',
  },
  {
    name: '쿠시(Kush)의 단단한 인내와 정직한 균형',
    symbol: '메로에 피라미드 첨탑',
    guidance: '요란한 박수보다 묵묵히 쌓아 올린 실력과 성실함이 결국 가장 오래가는 신뢰로 남습니다.',
  },
];

const ROYAL_COURAGE_NOTES = [
  '사막의 밤에도 빛나는 별처럼 흔들리지 않는 내면의 자존감',
  '강물과 모래가 만나는 경계에서 길을 내는 유연한 결단력',
  '스스로의 가치를 먼저 알아보고 정당하게 대우하는 태도',
];

function formatKstTimestamp(date: Date): string {
  const kstMs = date.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateNubianMeroeApedemakBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NubianMeroeResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 10)}`;
  const hash = stableHash(seed);

  const activePrinciple = NUBIAN_MEROE_PRINCIPLES[hash % NUBIAN_MEROE_PRINCIPLES.length];
  const royalCourageNote = ROYAL_COURAGE_NOTES[(hash >>> 3) % ROYAL_COURAGE_NOTES.length];

  return {
    engineVersion: 'LUCKEY-NUBIAN-MEROE-v2.1.0',
    calculatedAtKst: formatKstTimestamp(now),
    activePrinciple,
    royalCourageNote,
    interpretation: `고대 누비아 메로에와 아페데막 전통의 균형 관점에서는 '${activePrinciple.name}'(${activePrinciple.symbol})이 두드러집니다. ${activePrinciple.guidance}`,
    ritualAction: '허리를 곧게 펴고 심호흡을 한 뒤, 오늘 내가 미루고 있던 작은 결정 한 가지를 내 기준대로 담백하게 확정해 보세요.',
    reflectionFocus: `'${royalCourageNote}'을(를) 떠올리며 지금 내가 지나치게 작아져 있던 영역이 없는지 살펴보세요.`,
    reflectiveQuestion: '지금 상황에서 타인의 기준에 맞추느라 미뤄 두었던, 나만의 당당한 선택 한 가지는 무엇인가요?',
    interpretiveBoundary: '본 풀이는 고대 누비아 메로에와 아페데막 전통 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNubianMeroePrompt(result: NubianMeroeResult): string {
  return [
    `[고대 누비아 메로에·아페데막 균형 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 핵심 원칙: ${result.activePrinciple.name} (${result.activePrinciple.symbol})`,
    `- 수호 노트: ${result.royalCourageNote}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
