import type { UserProfile } from '../sharedState';

export interface ChiloePalafitoResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '관계·연대' | '일·물때' | '습관·기둥' | '조화 전반';
  chiloeMotif: string;
  companionMotif: string;
  tidePoiseAxis: string;
  topicBalanceHint: string;
  chiloeInsight: string;
  fjordTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '팔라피토의 나무 기둥(Palafito Stilts · 밀물 때는 물 위에 뜨고 썰물 때는 갯벌 위에 서는 집)',
    insight: '환경이 밀물처럼 차오를 때도, 썰물처럼 빠질 때도 흔들리지 않고 두 상태를 다 품을 수 있음',
    tone: '칠레 치로에 섬 카스트로 만의 아침, 알록달록한 목조 집들이 잔잔한 밀물 위에 비치는 풍경',
    ritual: '상황이 잘 풀릴 때(밀물)와 잠시 빠질 때(썰물) 모두 변하지 않을 나만의 중심 기둥 하나를 점검해 보세요.',
    question: '지금 물이 빠져 갯벌이 드러난 시기를 실패로 착각하고, 다시 밀물이 들어올 기둥의 힘을 잊은 건 아닌가요?',
  },
  {
    motif: '라르세 나무 널빤지 비늘(Alerce Shingles · 물고기의 비늘처럼 겹쳐 비바람을 막는 나무 지붕)',
    insight: '작은 경험과 습관들이 서로 겹쳐져 있을 때 비로소 거센 비바람도 안으로 스며들지 않음',
    tone: '은빛 안개가 감도는 항구 위로 촘촘히 겹쳐진 나무 비늘 지붕이 은은히 빛나는 오전',
    ritual: '오늘 하루 나를 지켜 줄 작은 습관 한 겹을 비늘 지붕 잇듯 빠뜨리지 않고 챙겨 보세요.',
    question: '거센 비바람이 불어와도 안으로 스며들지 않도록 내 일상에 촘촘히 겹쳐 둘 작은 습관은 무엇인가요?',
  },
  {
    motif: '못 없이 맞춘 목조 성당(Wooden Church Joinery · 바닷바람에 녹슬지 않도록 나무 못만으로 짜 맞춤)',
    insight: '환경에 맞지 않는 딱딱한 기준을 쓰기보다, 바닷바람에도 녹슬지 않는 유연한 이음새를 골라야 함',
    tone: '노란빛과 푸른빛으로 칠해진 나무 성당 안으로 맑은 바닷빛이 스며드는 정오',
    ritual: '억지로 쇠못처럼 박아 두려던 규칙 하나를 내려놓고, 상황에 맞게 맞물리는 유연한 방식으로 풀어 보세요.',
    question: '내 일과 관계에서 바닷바람에 녹슬어 삐걱거리는 쇠못 대신, 유연하게 맞물릴 나무 이음새는 어디인가요?',
  },
  {
    motif: '밍가의 공동체 집 옮기기(Minga · 이웃들이 통나무와 소를 모아 집을 통째로 새 터로 옮김)',
    insight: '혼자서는 도저히 감당할 수 없는 큰 변화도 곁의 사람들과 힘을 모으면 통째로 옮길 수 있음',
    tone: '푸른 언덕과 바닷가를 따라 사람들이 웃으며 함께 밧줄을 당기는 활기찬 오후',
    ritual: '혼자 끙끙 앓던 큰 과제 하나를 주변 사람 한 명에게 털어놓거나 작은 도움을 청해 보세요.',
    question: '혼자 들려다가 멈춰 서 있었지만, 곁의 사람과 함께 밧줄을 잡으면 거뜬히 옮길 수 있을 일은 무엇인가요?',
  },
  {
    motif: '쿠란토 땅속 화덕(Curanto Pit · 달군 돌과 잎사귀 아래 바다와 땅의 재료를 함께 익힘)',
    insight: '서로 다른 곳에서 온 재료들도 따뜻한 중심 열기 아래 덮어 두면 맛있는 조화를 이룸',
    tone: '서늘한 해 질 녘, 따뜻한 김이 모락모락 피어오르는 저녁 식탁의 온기',
    ritual: '서로 다른 성격의 일이나 사람들을 섣불리 나누지 말고, 따뜻한 여유로 함께 익을 시간을 내어 보세요.',
    question: '서로 달라 보여서 따로 두었지만, 따뜻한 화덕의 열기 아래 함께 두면 깊은 맛을 낼 조합은 무엇인가요?',
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

const CHILOE_SHADOWS = [
  '밀물과 썰물을 버텨야 한다는 생각에 지친 기둥을 점검하고 보수할 타이밍을 미루지 마세요.',
  '작은 습관을 겹치는 데에만 몰두해 정작 큰 방향 전환이 필요한 시점을 놓치지 않도록 살피세요.',
  '유연한 이음새를 찾다가 꼭 지켜야 할 최소한의 선과 기준까지 흐려지지 않게 주의하세요.',
  '함께 밧줄을 당기는 연대를 기대하다가 내가 먼저 내디뎌야 할 책임을 미루지 않도록 살피세요.',
  '모든 것을 한꺼번에 익히려다 지금 당장 식탁에 올려야 할 핵심 과제에 집중을 잃지 마세요.',
];

const TOPIC_BALANCE_HINTS: Record<ChiloePalafitoResult['questionTopic'], string> = {
  '관계·연대': '혼자 버겁게 끌기보다 밍가 공동체처럼 곁의 사람과 밧줄을 나눠 잡을 접점을 찾아보세요.',
  '일·물때': '물이 빠진 갯벌의 시간도 다음 밀물을 준비하는 자리이니 중심 기둥부터 단단히 살피세요.',
  '습관·기둥': '나무 비늘 지붕처럼 작은 일상 습관 한 겹을 빠뜨리지 않고 포개는 것이 비바람을 막습니다.',
  '조화 전반': '밀물과 썰물의 변화에 맞춰 유연하게 맞물리되 흔들리지 않을 최소한의 기준은 지켜 두세요.',
};

function classifyChiloeTopic(q: string): ChiloePalafitoResult['questionTopic'] {
  if (/관계|연대|이웃|사람|함께|도움/.test(q)) return '관계·연대';
  if (/일|직장|물때|밀물|썰물|기둥/.test(q)) return '일·물때';
  if (/습관|루틴|유연|마음|조화/.test(q)) return '습관·기둥';
  return '조화 전반';
}

export function calculateChiloePalafitoTidePoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChiloePalafitoResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyChiloeTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const tidePoiseAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = CHILOE_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-CHILOE-PALAFITO-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    chiloeMotif: picked.motif,
    companionMotif: companion.motif,
    tidePoiseAxis,
    topicBalanceHint,
    chiloeInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    fjordTone: picked.tone,
    reflectionFocus: `치로에 팔라피토의 '${picked.motif}'와 동반 결 '${companion.motif}'처럼, 밀물과 썰물을 다 품는 기둥 위에서 녹슬지 않는 이음새로 하루를 지켜 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '칠레 치로에 섬의 팔라피토 수상가옥과 밍가 공동체 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChiloePalafitoPrompt(res: ChiloePalafitoResult): string {
  return [
    `[치로에·팔라피토 물때 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 물때 축: ${res.tidePoiseAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 치로에 모티프: ${res.chiloeMotif} (${res.fjordTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 중심 통찰: ${res.chiloeInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
