import type { UserProfile } from '../sharedState';

export interface AlpineSavoyResult {
  engineVersion: string;
  calculatedAtKst: string;
  ridgePrinciple: string;
  savoyInsight: string;
  alpineTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  { principle: '콜(Col · 두 봉우리 사이를 잇는 가장 낮은 고갯마루)', insight: '굳이 가장 험한 봉우리 정상을 정면으로 넘지 않아도 지형이 허락하는 현명한 통로가 있음', tone: '사보이 알프스의 만년설 아래 초록빛 목초지가 펼쳐진 시원한 산악 고개' },
  { principle: '르퓨주(Refuge · 폭풍이 지나가기를 기다리는 산장)', insight: '날씨가 거칠어질 때 무리해서 전진하는 것보다 잠시 멈춰 따뜻한 차를 마시는 판단이 용기임', tone: '해 질 녘 돌벽 산장 창문 너머로 비치는 은은한 등불과 포근한 난로 온기' },
  { principle: '코르데(Cordée · 서로의 보폭을 맞춰 한 줄로 묶인 등반)', insight: '혼자 빠르게 앞서가기보다 함께 가는 이의 호흡을 살필 때 팀 전체가 안전하게 도착함', tone: '새벽 눈밭 위를 일정한 간격으로 나란히 오르는 등반가들의 차분한 발자국' },
  { principle: '알파주(Alpage · 계절에 맞춰 양 떼를 올리고 내리는 순환)', insight: '모든 계절에 같은 자리에만 머물 수 없듯, 지금 시기에 맞는 높이와 일의 양을 조절해야 함', tone: '맑은 빙하 계곡물 소리와 함께 울리는 알프스 목동의 잔잔한 종소리' },
  { principle: '에델바이스(Edelweiss · 바위 틈에서 조용히 피어나는 단단한 소박함)', insight: '비옥한 평지가 아니더라도 내게 주어진 자리의 햇빛과 바람만으로도 충분히 꽃을 피울 수 있음', tone: '차가운 고산 바람 속에서도 하얀 솜털을 지켜 내는 고요한 야생화' },
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

export function calculateAlpineSavoyColWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AlpineSavoyResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];

  return {
    engineVersion: 'LUCKEY-ALPINE-SAVOY-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    ridgePrinciple: picked.principle,
    savoyInsight: picked.insight,
    alpineTone: picked.tone,
    reflectionFocus: `알프스 사보이 산악 지혜의 '${picked.principle}'처럼, 가장 험한 길로 정면 돌파하기보다 지형과 날씨에 맞는 현명한 고개를 택해 보세요.`,
    ritualAction: '오늘 무리해서 밀어붙이던 일정 하나를 잠시 산장(Refuge)에 들른 듯 멈추고, 지금 내 에너지에 맞는 속도로 다시 조율해 보세요.',
    reflectiveQuestion: '지금 내가 굳이 가장 험한 봉우리를 넘으려 애쓰고 있을 뿐, 사실은 더 부드럽게 건널 수 있는 고갯마루(Col)는 어디에 있을까요?',
    interpretiveBoundary: '알프스 사보이(Savoy)의 산장 쉼·고갯마루 지혜·코르데 동행 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAlpineSavoyPrompt(res: AlpineSavoyResult): string {
  return [
    `[알프스 사보이·고갯마루 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 산악 지혜: ${res.ridgePrinciple} (${res.alpineTone})`,
    `- 중심 통찰: ${res.savoyInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
