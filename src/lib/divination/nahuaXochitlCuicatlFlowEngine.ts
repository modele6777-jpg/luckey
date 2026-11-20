import type { UserProfile } from '../sharedState';

export interface NahuaXochitlResult {
  engineVersion: string;
  calculatedAtKst: string;
  xochitlMotif: string;
  nahuaInsight: string;
  valleyTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '꽃과 노래(In Xochitl In Cuicatl · 시와 진실이 흙 위의 삶에 잠깐 피어나 마음을 잇는 숨결)', insight: '모든 것이 흘러가는 자리에서도 정성껏 건넨 말 한마디와 작은 아름다움이 오늘을 살아 있게 함', tone: '텍스코코 호수의 아침 물안개 사이로 이슬을 머금은 금잔화 꽃잎이 피어오르는 풍경' },
  { motif: '네트사우알코요틀의 비취(Jade & Quetzal · 맑은 깨달음은 부서지지 않는 보석처럼 마음에 남음)', insight: '외부의 칭찬이나 소유는 바람처럼 지나가도, 스스로 닦아 둔 진실한 마음결은 흩어지지 않음', tone: '멕시코 고원의 맑은 공기 속에서 푸른 케찰 깃털과 비취 구슬이 햇살을 머금은 모습' },
  { motif: '네 개의 움직임 올린(Ollin · 균형이 흔들릴 때마다 중심을 다시 세우는 살아 있는 리듬)', insight: '완벽하게 멈춰 있는 안정은 없으며, 흔들림을 알아차리고 다시 중심을 잡는 과정 자체가 삶임', tone: '화산 능선 너머로 구름이 흩어졌다 모이며 땅과 하늘이 숨을 맞추는 고원의 낮' },
  { motif: '틀라매티니의 지혜 횃불(Tlamatini Torch · 눈앞을 비추어 다른 이가 제 길을 보게 돕는 거울)', insight: '지혜란 남을 재단하는 잣대가 아니라, 각자의 얼굴에 담긴 고유한 선의를 비추어 주는 맑은 거울임', tone: '어스름한 저녁 뜰에서 바람에 꺼지지 않도록 손으로 감싸 쥔 따뜻한 송진 등불' },
  { motif: '치남파의 떠 있는 정원(Chinampa · 얕은 물 위에서도 뿌리를 내려 푸른 결실을 길러 냄)', insight: '기반이 다소 흔들리는 듯한 시기에도 작은 정성을 매일 이어 가면 단단한 터전이 자라남', tone: '잔잔한 수로 사이로 버드나무 뿌리가 물과 흙을 함께 껴안고 서 있는 수상 정원' },
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

export function calculateNahuaXochitlCuicatlFlow(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NahuaXochitlResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-NAHUA-XOCHITL-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    xochitlMotif: picked.motif,
    nahuaInsight: picked.insight,
    valleyTone: picked.tone,
    reflectionFocus: `나우아틀 꽃과 노래 지혜의 '${picked.motif}'처럼, 쫓기는 일정 속에서도 마음을 살리는 진실한 언어와 작은 아름다움의 틈을 내어 보세요.`,
    ritualAction: '오늘 하루 동안 스스로에게나 가까운 사람에게 진심이 담긴 따뜻한 말 한 줄을 꾸밈없이 건네 보세요.',
    reflectiveQuestion: '사라지지 않을 완벽한 결과만 기다리느라, 오늘 내 곁에 피어난 작은 ‘꽃과 노래’를 지나치고 있지는 않나요?',
    interpretiveBoundary: '멕시코 고원 나우아틀 철학의 꽃과 노래(In Xochitl In Cuicatl)·틀라매티니 성찰 전통을 바탕으로 한 상징적 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNahuaXochitlPrompt(res: NahuaXochitlResult): string {
  return [
    `[나우아틀 꽃과 노래·테오틀 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 쇼치틀 모티프: ${res.xochitlMotif} (${res.valleyTone})`,
    `- 중심 통찰: ${res.nahuaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
