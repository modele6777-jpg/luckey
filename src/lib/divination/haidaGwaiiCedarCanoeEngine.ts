import type { UserProfile } from '../sharedState';

export interface HaidaGwaiiResult {
  engineVersion: string;
  calculatedAtKst: string;
  haidaMotif: string;
  haidaInsight: string;
  cedarTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '붉은 삼나무 카누(Red Cedar Canoe · 거대한 나무의 속을 비워 거친 태평양 파도를 가볍게 넘음)', insight: '무겁게 채우기보다 불필요한 욕심과 걱정을 조용히 비워 낼 때 비로소 큰 파도를 넘을 부력이 생김', tone: '안개 낀 하이다 과이 해안 위로 삼나무 카누의 뱃머리가 잔잔한 물결을 가르며 나아가는 새벽' },
  { motif: '포틀래치의 나눔 순환(Potlatch Gift · 많이 모은 것을 기꺼이 나누며 공동체의 균형을 맞춤)', insight: '내가 가진 여유나 좋은 정보를 쥐고만 있지 않고 나눌 때 관계와 기운이 더 넓게 순환함', tone: '이끼 낀 전나무 숲 앞 넓은 나무 회관에서 사람들이 따뜻한 온기를 나누는 저녁' },
  { motif: '형태선 문양의 조화(Formline Flow · 끊기지 않고 둥글게 이어지는 검은 선과 붉은 선의 호흡)', insight: '하루의 일과들도 딱딱하게 단절되기보다 둥근 선처럼 자연스럽게 다음 호흡으로 이어질 때 편안함', tone: '삼나무 판자 위에 유려하고 힘 있는 곡선 문양이 살아 숨 쉬듯 그려진 작업실' },
  { motif: '안개 숲의 이끼 융단(Mossy Old-Growth · 수백 년 된 나무들이 쓰러진 나무를 품어 새 싹을 키움)', insight: '지나간 실패나 멈춤도 그냥 버려지는 것이 아니라 다음 성장을 받쳐 주는 촉촉한 거름이 됨', tone: '비 온 뒤 연두빛 이끼가 거대한 삼나무 뿌리를 포근히 감싸 안고 있는 정적의 숲' },
  { motif: '조수 간만의 모래톱(Intertidal Rhythm · 밀물과 썰물이 바뀔 때마다 바다가 새로운 선물을 남김)', insight: '무언가 빠져나가는 썰물의 시간에도 그 자리에만 남는 조개와 해초처럼 나만의 몫이 드러남', tone: '썰물이 물러간 짙은 자갈 해변 위로 은빛 물웅덩이들이 하늘을 비추는 오후' },
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

export function calculateHaidaGwaiiCedarCanoe(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HaidaGwaiiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-HAIDA-GWAII-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    haidaMotif: picked.motif,
    haidaInsight: picked.insight,
    cedarTone: picked.tone,
    reflectionFocus: `하이다 과이 삼나무 카누의 '${picked.motif}'처럼, 억지로 더 채우기보다 마음을 가볍게 비워 내어 파도를 넘는 부력을 키워 보세요.`,
    ritualAction: '오늘 머릿속을 무겁게 채우던 걱정이나 할 일 목록에서 당장 안 해도 되는 것 하나를 과감히 비워 보세요.',
    reflectiveQuestion: '지금 내 카누를 너무 무겁게 눌러서 오히려 물살을 타기 어렵게 만드는 짐은 무엇인가요?',
    interpretiveBoundary: '태평양 북서부 하이다 과이의 삼나무 카누·포틀래치·형태선 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHaidaGwaiiPrompt(res: HaidaGwaiiResult): string {
  return [
    `[하이다 과이·삼나무 카누 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 하이다 모티프: ${res.haidaMotif} (${res.cedarTone})`,
    `- 중심 통찰: ${res.haidaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
