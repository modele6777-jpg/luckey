import type { UserProfile } from '../sharedState';

export interface TainoZemiAreitoResult {
  engineVersion: string;
  calculatedAtKst: string;
  zemiEmblem: string;
  areitoInsight: string;
  islandTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const EMBLEMS = [
  { emblem: '아레이토(Areito · 원형으로 추는 기억의 춤)', insight: '각자의 걸음이 어긋나지 않도록 서로의 호흡과 발박자에 귀를 기울이며 리듬을 맞추는 지혜', tone: '카리브 해안 모닥불 주위에 울려 퍼지는 마라카스 박자' },
  { emblem: '아타베이(Atabey · 고요히 품는 바다의 어머니)', insight: '거친 파도를 억지로 잠재우기보다 내 마음이 먼저 깊고 넓은 바닥을 되찾는 평정', tone: '달빛 아래 잔잔히 숨 쉬는 푸른 만의 물결' },
  { emblem: '코호바(Cohoba · 번잡함을 비우는 정화의 호흡)', insight: '여러 감정이 뒤엉킬수록 결정을 미루고 먼저 맑은 숨으로 시야를 가라앉히는 태도', tone: '열대 숲 새벽 안개 사이로 스며드는 첫 햇살' },
  { emblem: '카누(Canoa · 섬과 섬을 잇는 단단한 배)', insight: '멀리 떨어진 사람이나 낯선 일도 작은 왕래를 통해 친숙한 다리로 이어 가는 실행력', tone: '투명한 산호초 위를 미끄러지듯 나아가는 목조 노' },
  { emblem: '바테이(Batey · 경계를 넘어 만나는 광장)', insight: '내 몫만 지키려 닫기보다 열린 공간에서 서로의 이야기를 들을 때 길이 넓어지는 이치', tone: '시원한 무역풍이 불어오는 마을 중앙의 넓은 공터' },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateTainoZemiAreitoHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TainoZemiAreitoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % EMBLEMS.length;
  const picked = EMBLEMS[idx];

  return {
    engineVersion: 'LUCKEY-TAINO-ZEMI-AREITO-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    zemiEmblem: picked.emblem,
    areitoInsight: picked.insight,
    islandTone: picked.tone,
    reflectionFocus: `카리브 타이노의 '${picked.emblem}'처럼, 속도를 높이기 전에 내 안의 호흡과 주변과의 리듬이 맞는지 먼저 살펴보세요.`,
    ritualAction: '잠시 멈춰 어깨의 힘을 빼고 3번 깊게 숨을 내쉰 뒤, 지금 가장 먼저 이어야 할 작은 행동 하나만 골라 보세요.',
    reflectiveQuestion: '지금 내가 혼자서 버겁게 끌고 가느라 놓치고 있는 자연스러운 호흡이나 리듬은 무엇인가요?',
    interpretiveBoundary: '카리브 타이노 전통의 세미(Zemi)·아레이토(Areito) 공동체 리듬과 자연 공존 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTainoZemiAreitoPrompt(res: TainoZemiAreitoResult): string {
  return [
    `[타이노 세미·아레이토 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 세미 상징: ${res.zemiEmblem} (${res.islandTone})`,
    `- 중심 통찰: ${res.areitoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
