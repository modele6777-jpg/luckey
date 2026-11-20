import type { UserProfile } from '../sharedState';

export interface SogdianSilkRoadResult {
  engineVersion: string;
  calculatedAtKst: string;
  caravanStage: string;
  merchantInsight: string;
  oasisTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STAGES = [
  { stage: '사마르칸트 출발 · 낙타 안장의 균형', insight: '한쪽에 짐이 쏠리면 먼 사막을 건널 수 없듯, 일과 휴식의 무게를 먼저 고르게 맞추는 준비', tone: '새벽 오아시스 성문을 나서는 대상의 방울 소리' },
  { stage: '소그드어 계약서 · 약속의 명확한 기록', insight: '모호한 기대에 기대지 않고 서로가 바라는 조건과 기한을 부드럽지만 분명히 맞추는 지혜', tone: '양피지 위에 정갈하게 써 내려간 갈대 펜의 잉크 냄새' },
  { stage: '파미르 고개 · 안개 속 별자리 확인', insight: '길이가 보이지 않는 구간일수록 속도보다 방향이 맞는지 잠깐 멈춰 점검하는 신중함', tone: '만년설 봉우리 위로 떠오른 차갑고 선명한 북극성' },
  { stage: '카라반사라이(대상 숙소) · 정보와 지혜 교환', insight: '혼자 끙끙대며 막힌 길을 뚫으려 하기보다 먼저 다녀온 사람의 조언 한마디를 듣는 유연함', tone: '벽돌 아치 안뜰 모닥불 주위의 다정한 차 한 잔' },
  { stage: '비단과 향료의 교차점 · 다름을 잇는 다리', insight: '서로 다른 언어와 성향을 부딪히게 두지 않고 각자의 장점이 쓰이도록 연결하는 중재력', tone: '장안과 서역을 잇는 저녁 시장의 따뜻한 등불' },
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

export function calculateSogdianSilkRoadCaravanTrust(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SogdianSilkRoadResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % STAGES.length;
  const picked = STAGES[idx];

  return {
    engineVersion: 'LUCKEY-SOGDIAN-CARAVAN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    caravanStage: picked.stage,
    merchantInsight: picked.insight,
    oasisTone: picked.tone,
    reflectionFocus: `실크로드 소그드 대상의 '${picked.stage}'처럼, 무리한 질주보다 긴 여정을 완주할 수 있는 균형과 신뢰를 먼저 챙겨 보세요.`,
    ritualAction: '진행 중인 일이나 약속 중 애매하게 남겨 둔 한 가지를 상대방과 짧게 확인해 명확히 해 두세요.',
    reflectiveQuestion: '지금 내가 건너려는 긴 여정에서 짐을 한쪽으로 너무 쏠리게 만들고 있는 습관이나 걱정은 무엇인가요?',
    interpretiveBoundary: '중앙아시아 고대 소그드 실크로드 대상들의 신뢰와 교류 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSogdianSilkRoadPrompt(res: SogdianSilkRoadResult): string {
  return [
    `[소그드 실크로드 대상 신뢰 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 여정 단계: ${res.caravanStage} (${res.oasisTone})`,
    `- 중심 통찰: ${res.merchantInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
