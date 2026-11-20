import type { UserProfile } from '../sharedState';

export interface ParacasWeaveResult {
  engineVersion: string;
  calculatedAtKst: string;
  paracasMotif: string;
  paracasInsight: string;
  loomTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '사막을 감싸는 낙타털 망토(Mantle of Paracas · 건조한 모래바람 속에서도 천 년을 바래지 않는 선명한 실)', insight: '유행이나 바깥의 잦은 변화에 휘둘리지 않고, 나만의 고유한 색과 결을 꾸준히 지켜 낼 때 오래 남음', tone: '페루 남부 사막의 마른 햇살 아래 진홍빛과 쪽빛 실이 촘촘히 얽혀 빛나는 직물' },
  { motif: '날실과 씨실의 교차(Warp & Weft · 서로 다른 방향의 실이 팽팽함과 느슨함을 나누며 천을 이룸)', insight: '긴장과 이완이 번갈아 교차해야 삶의 결이 튼튼해지며, 한쪽만 팽팽하면 쉽게 끊어짐', tone: '베틀 위에서 일정한 박자로 오가는 북소리와 함께 한 줄씩 무늬가 자라나는 오후' },
  { motif: '이중 얼굴의 직조(Double-Cloth · 앞면과 뒷면의 무늬가 서로 반전되며 하나의 천을 이룸)', insight: '지금 마주한 불편함이나 이면에도 나름의 질서가 있어, 뒤집어 보면 새로운 쓰임이 보임', tone: '빛의 각도에 따라 숨어 있던 기하학 새 무늬가 선명히 떠오르는 직조 천' },
  { motif: '바닷바람과 사막 별자리(Coastal Desert Stars · 태평양의 안개가 걷힌 뒤 드러나는 맑은 밤하늘)', insight: '안개가 낀 날에도 별자리는 그 자리에 있듯, 당장 보이지 않는다고 방향이 사라진 것은 아님', tone: '해안 절벽 위로 차가운 바닷바람이 지나간 뒤 유리처럼 맑아진 사막의 밤' },
  { motif: '매듭진 끝단 마무리(Fringe Binding · 풀리지 않도록 마지막 올을 정성껏 묶어 매듭지음)', insight: '거창한 시작만큼이나 오늘 손에 쥔 작은 일을 깔끔히 매듭짓는 습관이 내일의 여유를 만듦', tone: '직물의 가장자리를 따라 다채로운 술이 가지런히 묶여 바람에 흔들리는 모습' },
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

export function calculateParacasWeaveTextileHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ParacasWeaveResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-PARACAS-WEAVE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    paracasMotif: picked.motif,
    paracasInsight: picked.insight,
    loomTone: picked.tone,
    reflectionFocus: `파라카스 직조 매듭의 '${picked.motif}'처럼, 팽팽한 긴장과 느슨한 쉼의 균형을 맞추며 나만의 결을 한 줄씩 이어 가 보세요.`,
    ritualAction: '오늘 하루 중 어수선하게 흩어져 있던 작은 일 하나를 정해서 끝단 매듭을 짓듯 깔끔히 마무리해 보세요.',
    reflectiveQuestion: '지금 내 하루의 베틀에서 너무 팽팽하게 당겨져 끊어질 듯한 실은 무엇이며, 어떻게 조금 늦출 수 있을까요?',
    interpretiveBoundary: '고대 페루 파라카스의 직조·매듭 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatParacasWeavePrompt(res: ParacasWeaveResult): string {
  return [
    `[파라카스·직조 매듭 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 직조 모티프: ${res.paracasMotif} (${res.loomTone})`,
    `- 중심 통찰: ${res.paracasInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
