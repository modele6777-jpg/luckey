import type { UserProfile } from '../sharedState';

export interface BaekjeIncenseResult {
  engineVersion: string;
  calculatedAtKst: string;
  buyeoMotif: string;
  baekjeInsight: string;
  incenseTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '백제금동대향로의 봉황(Gilt-Bronze Phoenix · 치우침 없이 오악과 물결을 품고 깃을 폄)', insight: '높은 뜻과 섬세한 일상이 따로 놀지 않고 한 몸에서 자연스레 어우러질 때 품격이 생김', tone: '부여 능산리 흙 속에서 맑은 금빛으로 깨어나 연꽃과 산봉우리를 품은 대향로' },
  { motif: '서산 마애삼존불의 미소(Baekje Smile · 빛의 각도에 따라 달라지는 온화한 여유)', insight: '같은 상황도 내가 어떤 마음의 각도로 바라보느냐에 따라 전혀 다른 온기로 다가옴', tone: '아침 햇살과 저녁 노을 아래서 부드러운 미소를 바꾸어 짓는 바위 위 부처의 얼굴' },
  { motif: '산수문전의 부드러운 능선(Landscape Tile · 날카로운 모서리 대신 흐르는 듯한 여백)', insight: '모든 선을 뾰족하게 세우면 나부터 먼저 베이기 쉬우니, 둥글게 넘기는 여유가 필요함', tone: '굽이치는 산과 구름, 맑은 물결이 한 장의 벽돌 위에 평화롭게 새겨진 무늬' },
  { motif: '정림사지 오층석탑의 비례(Five-Story Pagoda · 무겁지 않고 하늘로 가볍게 뻗은 단정함)', insight: '화려한 장식을 더 붙이지 않아도 각 층의 비례만 바르면 그 자체로 충분히 아름다움', tone: '부여 옛 들판 위에서 군더더기 없는 옥개석 선으로 서 있는 단정한 석탑' },
  { motif: '오악사의 합주(Five Musicians · 비파와 피리, 북이 제 소리를 내며 하나의 선율을 이름)', insight: '내 안의 서로 다른 욕구와 감정들도 하나를 억누르기보다 각자 제 자리를 주면 조화로워짐', tone: '향로 봉우리 사이에서 맑은 소리를 연주하는 다섯 악사의 평온한 모습' },
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

export function calculateBaekjeGiltBronzeIncenseCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BaekjeIncenseResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-BAEKJE-INCENSE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    buyeoMotif: picked.motif,
    baekjeInsight: picked.insight,
    incenseTone: picked.tone,
    reflectionFocus: `백제 금동대향로·미소의 지혜 '${picked.motif}'처럼, 뾰족한 긴장과 불필요한 장식을 덜어 내고 둥글고 온화한 비례로 마음을 고르게 펴 보세요.`,
    ritualAction: '오늘 나 자신이나 가까운 사람에게 날카로운 평가 대신 백제의 미소처럼 부드러운 한 마디를 먼저 건네 보세요.',
    reflectiveQuestion: '지금 내 마음에서 군더더기를 덜어 내고 정림사지 석탑처럼 단정한 비례만 남긴다면, 가장 먼저 내려놓을 것은 무엇인가요?',
    interpretiveBoundary: '한국 백제의 금동대향로·서산 마애불·정림사지 비례 미학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBaekjeIncensePrompt(res: BaekjeIncenseResult): string {
  return [
    `[백제 금동대향로·미소의 여유 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 부여 모티프: ${res.buyeoMotif} (${res.incenseTone})`,
    `- 중심 통찰: ${res.baekjeInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
