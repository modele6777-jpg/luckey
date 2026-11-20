import type { UserProfile } from '../sharedState';

export interface BhutanGnhPillar {
  name: string;
  symbol: string;
  guidance: string;
}

export interface BhutanGnhResult {
  engineVersion: string;
  calculatedAtKst: string;
  activePillar: BhutanGnhPillar;
  auspiciousSymbol: string;
  interpretation: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const BHUTAN_GNH_PILLARS: BhutanGnhPillar[] = [
  {
    name: '마음의 평온과 지속 가능한 돌봄',
    symbol: '백연꽃(Pema)',
    guidance: '바깥의 속도에 휩쓸리기보다 오늘 하루 내 몸과 마음을 지탱할 수 있는 적정한 호흡을 지키는 시기입니다.',
  },
  {
    name: '살아 있는 문화와 일상의 의례',
    symbol: '법라(Dungkar)',
    guidance: '사소해 보이는 인사, 차 한 잔, 정리 정돈 같은 작은 의례가 흐트러진 일상의 결을 다시 세워 줍니다.',
  },
  {
    name: '자연과 공동체의 상호 존중',
    symbol: '무한 매듭(Palbeu)',
    guidance: '나 혼자 빠르게 앞서는 선택보다 함께 얽힌 이들의 리듬을 배려할 때 오히려 막혔던 흐름이 부드럽게 풀립니다.',
  },
  {
    name: '맑고 공정한 판단의 균형',
    symbol: '황금 물고기(Sernya)',
    guidance: '두려움이나 조급함 없이 맑은 물속을 헤엄치듯 지금 내게 가장 정직한 기준 하나를 세울 때입니다.',
  },
];

const AUSPICIOUS_SYMBOLS = [
  '보배 우산(Chattra) — 불필요한 소음으로부터 마음을 지키는 고요한 그늘',
  '승리의 깃발(Dhvaja) — 미뤄 두었던 작은 약속 하나를 스스로 지켜 내는 기쁨',
  '보배 항아리(Bumpa) — 이미 내 안에 쌓여 있는 경험과 다정함의 저장고',
  '법륜(Dharmachakra) — 멈춰 있던 습관을 부드럽게 다시 굴리는 첫 바퀴',
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

export function calculateBhutanGnhTashiTagye(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BhutanGnhResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 10)}`;
  const hash = stableHash(seed);

  const activePillar = BHUTAN_GNH_PILLARS[hash % BHUTAN_GNH_PILLARS.length];
  const auspiciousSymbol = AUSPICIOUS_SYMBOLS[(hash >>> 3) % AUSPICIOUS_SYMBOLS.length];

  return {
    engineVersion: 'LUCKEY-BHUTAN-GNH-v2.1.0',
    calculatedAtKst: formatKstTimestamp(now),
    activePillar,
    auspiciousSymbol,
    interpretation: `부탄 국민총행복(GNH)과 타시 타게이(팔길상) 상징으로 보면 지금은 '${activePillar.name}'(${activePillar.symbol})의 결이 강조됩니다. ${activePillar.guidance}`,
    ritualAction: '오늘 하루 성취 목록을 하나 줄이고, 대신 나를 편안하게 숨 쉬게 하는 작은 일상 의례 한 가지를 정성껏 실행해 보세요.',
    reflectionFocus: `질문과 맞닿은 '${auspiciousSymbol}'의 의미를 떠올리며, 지금 내가 지키고 싶은 평온의 기준을 문장으로 적어 보세요.`,
    reflectiveQuestion: '오늘 더 많이 해내는 것 대신, 내 마음의 평온을 지키기 위해 기꺼이 내려놓을 수 있는 한 가지는 무엇인가요?',
    interpretiveBoundary: '본 풀이는 부탄 국민총행복(GNH)과 타시 타게이 전통 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBhutanGnhPrompt(result: BhutanGnhResult): string {
  return [
    `[부탄 GNH·타시 타게이 조화 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 중심 기둥: ${result.activePillar.name} (${result.activePillar.symbol})`,
    `- 길상 상징: ${result.auspiciousSymbol}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
