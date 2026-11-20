import type { UserProfile } from '../sharedState';

export interface CatalanSenyRauxaResult {
  engineVersion: string;
  calculatedAtKst: string;
  catalanPrinciple: string;
  senyInsight: string;
  barcelonaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  { principle: '세니(Seny · 맑은 분별과 차분한 상식)', insight: '감정의 파도에 휩쓸리지 않고 눈앞의 사실과 순서를 차분히 짚어내는 맑은 이성', tone: '아침 햇살이 비치는 바르셀로나 고딕 지구 안뜰의 분수' },
  { principle: '라우샤(Rauxa · 마음을 움직이는 창조적 열정)', insight: '틀에 박힌 계산만으로는 넘을 수 없는 벽을 뚫어 주는 순수한 설렘과 직관의 힘', tone: '해 질 녘 지중해 해안가를 물들이는 선명한 주홍빛 하늘' },
  { principle: '라몬 류이(Ramon Llull) 사유의 나무', insight: '서로 상관없어 보이던 생각과 경험들이 한 줄기 위에서 자연스럽게 맞물려 열리는 통찰', tone: '마요르카 올리브 과수원 바람에 흔들리는 은빛 나뭇잎' },
  { principle: '카스텔(Castell · 서로의 어깨를 딛고 서는 인간 탑)', insight: '아래에서 묵묵히 받쳐 주는 기반이 튼튼할수록 위를 향한 도전도 흔들리지 않음', tone: '광장 한가운데 호흡을 맞추며 모여 선 사람들의 단단한 원' },
  { principle: '사르다나(Sardana · 셈과 리듬이 어우러진 둥근 춤)', insight: '자유로움 속에서도 정확한 박자와 약속을 지킬 때 비로소 완성되는 우아한 조화', tone: '플라타너스 그늘 아래 일정한 박자로 이어지는 담백한 선율' },
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

export function calculateCatalanSenyRauxaBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CatalanSenyRauxaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];

  return {
    engineVersion: 'LUCKEY-CATALAN-SENY-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    catalanPrinciple: picked.principle,
    senyInsight: picked.insight,
    barcelonaTone: picked.tone,
    reflectionFocus: `카탈루냐 철학의 '${picked.principle}'처럼, 차분한 분별(Seny)과 살아 있는 열정(Rauxa) 중 오늘 내게 조금 더 필요한 쪽의 균형을 맞추어 보세요.`,
    ritualAction: '지금 하고 싶은 일 한 가지에 대해 "왜 끌리는가(열정)"와 "첫 단계는 무엇인가(분별)"를 한 줄씩만 나란히 적어 보세요.',
    reflectiveQuestion: '오늘 내 안에서 너무 앞서가거나 혹은 너무 움츠러들어 균형을 깨뜨리고 있는 쪽은 분별과 열정 중 어느 쪽인가요?',
    interpretiveBoundary: '카탈루냐(Catalan)의 세니·라우샤 균형과 라몬 류이 사유 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCatalanSenyRauxaPrompt(res: CatalanSenyRauxaResult): string {
  return [
    `[카탈루냐 세니·라우샤 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 카탈루냐 원리: ${res.catalanPrinciple} (${res.barcelonaTone})`,
    `- 중심 통찰: ${res.senyInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
