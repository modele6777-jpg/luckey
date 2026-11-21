import type { UserProfile } from '../sharedState';

export interface GalicianCaminoResult {
  engineVersion: string;
  calculatedAtKst: string;
  atlanticSign: string;
  companionSign: string;
  caminoInsight: string;
  galiciaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SIGNS = [
  {
    sign: '가리비 껍데기(Vieira · 서로 다른 길들이 한 바다로 모이는 표식)',
    insight: '누구와 비교해 앞서거니 뒤서거니 할 것 없이 각자의 걸음 속도로 결국 제 목적지에 닿는다는 안도',
    tone: '대서양 안개가 걷히는 피니스테레 절벽 끝의 맑은 수평선',
    ritual: '잠시 걸음을 멈추고 오늘 내가 이미 지나온 길 중 스스로에게 수고했다고 말해주고 싶은 구간 하나를 떠올려 보세요.',
    question: '남의 속도나 기준을 잠시 내려놓는다면, 지금 내가 진심으로 걷고 싶은 내 속도는 어느 정도인가요?',
  },
  {
    sign: '모라냐(Morriña · 돌아가고 싶은 뿌리에 대한 아련한 그리움)',
    insight: '바쁘게 앞만 보며 달리느라 잠시 잊고 있던 내 본래의 온기와 소중한 사람들을 떠올리는 시간',
    tone: '이끼 낀 돌담과 유칼립투스 숲 사이로 내리는 갈리시아의 보슬비',
    ritual: '오래 떠올리지 못했던 소중한 사람이나 내 본래의 온기를 일깨우는 기억 하나를 짧게 적어 보세요.',
    question: '바쁘게 달리느라 잠시 잊고 있었지만, 사실은 내 마음을 가장 따뜻하게 지탱해 주던 뿌리는 무엇인가요?',
  },
  {
    sign: '피니스테레(Fisterra · 땅의 끝이자 새 바다가 시작되는 곳)',
    insight: '하나의 챕터가 끝났다고 느끼는 자리가 사실은 전혀 다른 시야가 열리는 출발선이라는 전환',
    tone: '바위에 부서지는 하얀 대서양 파도와 노을빛 등대',
    ritual: '막다른 길처럼 느껴지는 일 하나를 두고, 거기서 새로 열리는 다음 시야가 무엇인지 한 줄로 적어 보세요.',
    question: '지금 끝났다고 여긴 자리 너머로, 오히려 새롭게 펼쳐지고 있는 다음 바다는 무엇인가요?',
  },
  {
    sign: '카스트로(Castro · 언덕 위 둥근 돌집 공동체)',
    insight: '혼자 모든 바람을 막아내려 하기보다 둥글게 모여 서로의 체온을 나누는 담백한 연대',
    tone: '산타 테그라 언덕 위 바람을 피하는 나지막한 석조 원형 터',
    ritual: '혼자 버티려던 부담 하나를 믿을 수 있는 사람과 가볍게 나누어 보세요.',
    question: '지금 내가 혼자 다 막아내려 애쓰기보다 곁의 온기를 빌려도 괜찮은 바람은 무엇인가요?',
  },
  {
    sign: '케이마다(Queimada · 어두운 걱정을 태워 보내는 푸른 불꽃)',
    insight: '마음속에 묵혀 둔 막연한 불안을 말과 행동으로 꺼내어 가볍게 털어내는 정화',
    tone: '밤바람 속에서 은은하게 타오르는 갈리시아 도자기 잔의 푸른 불빛',
    ritual: '마음속에 묵혀 둔 막연한 걱정 한 가지를 종이에 적어 꺼낸 뒤 가볍게 정리해 보세요.',
    question: '말로 꺼내어 비추어 보기만 해도 생각보다 작아질 내 마음속 막연한 불꽃은 무엇인가요?',
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

export function calculateGalicianCaminoAtlanticReflection(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GalicianCaminoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SIGNS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (SIGNS.length - 1));
  const picked = SIGNS[idx];
  const companion = SIGNS[(idx + companionOffset) % SIGNS.length];

  return {
    engineVersion: 'LUCKEY-GALICIAN-CAMINO-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    atlanticSign: picked.sign,
    companionSign: companion.sign,
    caminoInsight: picked.insight,
    galiciaTone: picked.tone,
    reflectionFocus: `갈리시아 대서양 순례길의 '${picked.sign}'과 동반 표식 '${companion.sign}'을 함께 바라보며 나만의 호흡을 되찾아 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '이베리아 반도 북서부 갈리시아(Galicia)의 카미노·피니스테레 대서양 성찰 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGalicianCaminoPrompt(res: GalicianCaminoResult): string {
  return [
    `[갈리시아 카미노·대서양 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 대서양 상징: ${res.atlanticSign} (${res.galiciaTone})`,
    `- 동반 상징: ${res.companionSign}`,
    `- 중심 통찰: ${res.caminoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
