import type { UserProfile } from '../sharedState';

export interface ByzantineDomeResult {
  engineVersion: string;
  calculatedAtKst: string;
  byzantineMotif: string;
  companionMotif: string;
  byzantineInsight: string;
  domeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '펜덴티브의 곡선 전환(Pendentive Curve · 네모난 기둥의 무게를 둥근 돔의 하늘로 부드럽게 이어 줌)',
    insight: '각진 현실의 제약과 둥근 이상 사이에는 그 둘을 무리 없이 연결해 주는 전환의 곡선이 있음',
    tone: '하기아 소피아의 거대한 네 기둥 위에서 삼각형 곡면이 둥근 원형 천장으로 자연스럽게 솟아오르는 아침',
    ritual: '딱딱하게 부딪히는 두 일정이나 입장 사이에 완충 역할을 할 중간 단계 하나를 부드럽게 놓아 보세요.',
    question: '각진 현실의 제약과 내가 바라는 이상을 부드럽게 이어 줄 전환의 곡선은 어디에 있나요?',
  },
  {
    motif: '허공에 뜬 40개의 창(Crown of Light · 돔 밑둘레를 두른 창문들이 무거운 돌지붕을 가볍게 띄움)',
    insight: '아무리 무거운 책임이라도 마음속에 작은 빛이 들어올 창을 여러 개 내어 두면 숨이 트임',
    tone: '마흔 개의 아치형 창을 통해 쏟아진 햇살이 먼지 티끌을 금빛으로 비추며 내려앉는 정오',
    ritual: '오늘 꽉 막힌 듯한 일정 사이에 햇빛이나 바깥 공기를 쐴 수 있는 5분의 창문을 일부러 하나 끼워 넣으세요.',
    question: '무거운 책임 아래에서도 내 마음이 숨 쉴 수 있도록 열어 두어야 할 작은 빛의 창은 어디인가요?',
  },
  {
    motif: '금빛 모자이크의 미세한 각도(Tilted Tesserae · 작은 유리 조각을 일부러 비스듬히 붙여 빛을 머금음)',
    insight: '모두가 똑같은 각도로 반듯할 필요는 없으며, 나만의 작은 어긋남이 오히려 고유한 빛을 만들어 냄',
    tone: '반구형 벽면 위 금박 유리 조각들이 보는 자리마다 다른 결로 잔잔하게 반짝이는 오후',
    ritual: '남의 기준에 억지로 맞추려다 어색해진 일 하나를 오늘 내 방식의 각도로 다시 놓아 보세요.',
    question: '남들과 똑같은 각도로 맞추려다 오히려 빛을 잃어버린 나만의 고유한 결은 무엇인가요?',
  },
  {
    motif: '대리석 결의 대칭(Bookmatched Marble · 한 덩어리 돌을 반으로 갈라 펼쳐 고요한 숲을 닮게 함)',
    insight: '복잡해 보이는 문제도 한 번만 차분히 쪼개어 나란히 펼쳐 보면 숨어 있던 균형과 대칭이 드러남',
    tone: '물결 무늬가 마주 보듯 펼쳐진 넓은 대리석 벽면 아래 서늘한 정적이 흐르는 회랑',
    ritual: '복잡한 고민 하나를 "내가 바꿀 수 있는 쪽"과 "기다릴 쪽" 둘로 갈라 종이에 나란히 펼쳐 보세요.',
    question: '한 덩어리로 뭉쳐 있어 막막해 보이지만, 반으로 나누어 펼쳐 보면 균형이 드러날 문제는 무엇인가요?',
  },
  {
    motif: '보스포루스의 짙은 저녁 물빛(Bosphorus Dusk · 두 대륙을 가르는 해협 위로 종소리와 바람이 섞임)',
    insight: '서로 다른 두 역할이나 가치 사이에서 고민할 때, 해협처럼 양쪽을 다 품고 흐르는 길이 있음',
    tone: '저물녘 바다 바람이 성벽을 스치며 대리석 마루의 열기를 천천히 식혀 주는 저녁',
    ritual: '일과 쉼, 나 자신과 타인 사이에서 어느 한쪽을 버리지 않고 함께 품는 저녁 시간 20분을 보내 보세요.',
    question: '둘 중 하나를 택해야 한다고 여겼지만, 해협처럼 양쪽을 다 품고 흐를 수 있는 두 가치는 무엇인가요?',
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

export function calculateByzantineHagiaLightDome(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ByzantineDomeResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-BYZANTINE-DOME-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    byzantineMotif: picked.motif,
    companionMotif: companion.motif,
    byzantineInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    domeTone: picked.tone,
    reflectionFocus: `비잔틴 돔 빛의 '${picked.motif}'와 동반 결 '${companion.motif}'처럼, 무거운 일과 속에서도 마음이 숨 쉴 수 있는 작은 빛의 창을 먼저 열어 두세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '비잔틴 건축의 펜덴티브·빛의 돔·모자이크 조화 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatByzantineDomePrompt(res: ByzantineDomeResult): string {
  return [
    `[비잔틴·하기아 소피아 돔 빛 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 비잔틴 모티프: ${res.byzantineMotif} (${res.domeTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 중심 통찰: ${res.byzantineInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
