import type { UserProfile } from '../sharedState';

export interface BohemianCrystalResult {
  engineVersion: string;
  calculatedAtKst: string;
  crystalFacet: string;
  companionFacet: string;
  bohemianInsight: string;
  forestGlassTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const FACETS = [
  {
    facet: '크리스탈 프리즘(Prism · 한 줄기 빛을 일곱 색으로 맑게 나누어 봄)',
    insight: '막연하게 뭉쳐 있던 감정도 찬찬히 결을 나누어 보면 무엇 때문에 답답한지 선명해짐',
    tone: '보헤미아 숲속 공방 창가로 들어온 아침 햇살이 투명한 유리 면을 지나 무지갯빛을 맺는 순간',
    ritual: '오늘 복잡한 생각 하나를 골라, 사실·감정·내가 할 수 있는 일 세 갈래로 가볍게 나누어 적어 보세요.',
    question: '지금 내가 한꺼번에 뭉뚱그려 걱정하고 있는 일 중에서, 프리즘처럼 결을 나누어 보면 의외로 단순해질 부분은 무엇인가요?',
  },
  {
    facet: '블타바 강의 곡선(Vltava · 굽이치며 도시의 모든 다리를 품고 흐르는 물)',
    insight: '서로 다른 시선과 사람들을 한꺼번에 재단하지 않고 다리 아래로 부드럽게 이어 줌',
    tone: '아침 안개가 옅게 피어오른 프라하의 돌다리 아래로 고요히 흐르는 은빛 강물',
    ritual: '어긋난 의견이나 일정 하나를 억지로 맞추려 들지 말고, 강물이 다리 아래를 지나듯 한 박자 여유를 두고 이어 보세요.',
    question: '지금 내 앞에서 팽팽히 맞서 있는 생각이나 관계 중, 부드러운 강물의 곡선처럼 품고 흘려보낼 수 있는 것은 무엇인가요?',
  },
  {
    facet: '유리공의 숨(Glassblower · 뜨거운 유리에 조용히 숨을 불어넣는 한 박자)',
    insight: '너무 급하게 숨을 불면 깨지고 너무 약하면 모양이 안 나듯, 오늘 내 리듬을 조절하는 게 핵심',
    tone: '붉은 화로 앞에서 천천히 둥근 형태를 얻어 가는 맑고 따뜻한 유리 방울',
    ritual: '오늘 가장 급하게 처리하려던 일 하나를 멈추고, 숨을 고른 뒤 적정한 세기와 속도를 다시 정해 보세요.',
    question: '유리공의 숨처럼 너무 세게 밀어붙이거나 너무 망설이느라 형태를 잃고 있는 일은 무엇인가요?',
  },
  {
    facet: '슈마바 숲의 이끼(Šumava · 오래된 나무 아래 습기를 머금은 푸른 고요)',
    insight: '시끄러운 성취를 쫓다 지쳤을 때는 숲의 고요한 바닥으로 돌아와 수분을 채워야 함',
    tone: '보헤미아 남부 전나무 숲길 사이로 부드럽게 깔린 짙은 초록빛 이끼 카펫',
    ritual: '오늘 알림과 소음을 10분간 꺼 두고, 내 마음에 다시 촉촉한 쉼을 채워 주는 조용한 시간을 확보해 보세요.',
    question: '바깥의 성취 소음을 잠시 끄고 슈마바 숲의 이끼처럼 내 마음을 먼저 적셔 주어야 할 지친 자리는 어디인가요?',
  },
  {
    facet: '세공사의 손끝(Engraver · 단단한 면 위에 가느다란 선 하나를 정확히 긋는 집중)',
    insight: '오늘 하루 온갖 일을 다 해결하려 하기보다 딱 한 군데에 맑은 집중을 모으는 편이 남음',
    tone: '조용한 작업대 등불 아래 반짝이는 정교한 유리 각면과 맑은 물소리',
    ritual: '오늘 해야 할 목록을 세 개 이상 줄이고, 가장 정밀함이 필요한 단 한 가지에만 맑은 집중을 모아 보세요.',
    question: '이것저것 다 손대느라 힘을 흩뿌리기보다, 세공사의 손끝처럼 선명한 선 하나를 그어야 할 핵심 과제는 무엇인가요?',
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

export function calculateBohemianCrystalGlassLight(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BohemianCrystalResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % FACETS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (FACETS.length - 1));
  const picked = FACETS[idx];
  const companion = FACETS[(idx + companionOffset) % FACETS.length];

  return {
    engineVersion: 'LUCKEY-BOHEMIAN-CRYSTAL-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    crystalFacet: picked.facet,
    companionFacet: companion.facet,
    bohemianInsight: `${picked.insight} (동반 각면: ${companion.facet})`,
    forestGlassTone: picked.tone,
    reflectionFocus: `보헤미아 크리스탈 공예 지혜의 '${picked.facet}'와 동반 각면 '${companion.facet}'처럼, 한데 뭉쳐 답답해 보이는 마음도 프리즘을 통과시키듯 결을 나누어 맑게 비춰 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '보헤미아(Bohemia)의 유리 공예 빛 세공·슈마바 숲 정적 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBohemianCrystalPrompt(res: BohemianCrystalResult): string {
  return [
    `[보헤미아 크리스탈·유리 빛 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 유리 각면: ${res.crystalFacet} (${res.forestGlassTone})`,
    `- 동반 각면: ${res.companionFacet}`,
    `- 중심 통찰: ${res.bohemianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
