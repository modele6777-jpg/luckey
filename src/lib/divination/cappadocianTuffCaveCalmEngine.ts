import type { UserProfile } from '../sharedState';

export interface CappadocianCaveResult {
  engineVersion: string;
  calculatedAtKst: string;
  cappadocianMotif: string;
  cappadocianInsight: string;
  tuffTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '부드러운 응회암의 굴착(Soft Tuff Carving · 바깥 풍화에는 단단히 굳지만 안쪽을 파고들면 부드럽게 열림)', insight: '겉으로 단단하고 막막해 보이는 과제도 한 겹만 파고들면 의외로 부드럽게 다듬어지는 여지가 있음', tone: '아나톨리아 카파도키아의 아침, 살구빛 화산 응회암 바위 봉우리 사이로 서늘한 공기가 흐르는 계곡' },
  { motif: '지하 도시의 환기구(Underground Air Shaft · 깊은 바위 아래서도 위쪽 하늘과 공기가 막힘없이 통함)', insight: '아무리 바쁜 일이나 깊은 고민 속에 들어가 있어도 바깥 숨통과 연결되는 구멍 하나는 꼭 열어 두어야 함', tone: '서늘한 지하 방 한가운데 수직 통로를 통해 맑은 햇살과 바람이 내려오는 오전' },
  { motif: '비둘기 계곡의 둥지(Pigeon Valley · 바위 높은 곳에 작은 쉼터를 내어 비둘기와 함께 공존함)', insight: '내 공간을 독점하기보다 작은 숨결들이 쉬어 갈 수 있는 넉넉한 자리를 두면 삶이 더 풍요로워짐', tone: '수백 개의 작은 바위 틈새로 비둘기들이 햇볕을 쬐며 날아오르는 정오' },
  { motif: '요정 굴뚝의 균형 모자(Fairy Chimney Cap · 아래 기둥이 깎여도 꼭대기의 단단한 현무암 모자가 지켜 줌)', insight: '주변 환경이 조금씩 변하고 깎여 나가더라도 가장 중요한 핵심 원칙 하나가 위에서 중심을 잡아 줌', tone: '황금빛 오후 햇살 아래 둥근 돌 모자를 쓴 응회암 기둥들이 고요히 서 있는 계곡' },
  { motif: '여명의 열기구 풍경(Dawn Horizon · 어둠이 걷히는 순간 하늘로 올라가 계곡 전체를 내려다봄)', insight: '바위 틈에 갇혀 답답할 때는 잠깐 시선을 높이 올려 내가 걸어온 계곡 전체의 모양을 바라보아야 함', tone: '분홍빛 여명이 번지는 하늘 아래 색색의 풍선들이 소리 없이 떠오르는 새벽' },
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

export function calculateCappadocianTuffCaveCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): CappadocianCaveResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-CAPPADOCIAN-CAVE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    cappadocianMotif: picked.motif,
    cappadocianInsight: picked.insight,
    tuffTone: picked.tone,
    reflectionFocus: `카파도키아 응회암의 '${picked.motif}'처럼, 겉보기에 단단한 문제도 한 겹 파고들며 숨통과 시야를 열어 보세요.`,
    ritualAction: '오늘 막막해 보였던 일 하나를 가장 작은 첫 단추 한 단계로만 쪼개어 손대어 보세요.',
    reflectiveQuestion: '지금 내가 너무 바위 틈 안에서만 보느라 놓치고 있는, 계곡 전체의 넓은 모양은 무엇인가요?',
    interpretiveBoundary: '아나톨리아 카파도키아의 응회암 굴착 쉼터와 지하 환기 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatCappadocianCavePrompt(res: CappadocianCaveResult): string {
  return [
    `[카파도키아·응회암 동굴 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 카파도키아 모티프: ${res.cappadocianMotif} (${res.tuffTone})`,
    `- 중심 통찰: ${res.cappadocianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
