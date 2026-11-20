import type { UserProfile } from '../sharedState';

export interface MalagasyBaobabResult {
  engineVersion: string;
  calculatedAtKst: string;
  malagasyMotif: string;
  malagasyInsight: string;
  savannaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '거꾸로 선 바오밥의 물통(Baobab Reservoir · 마른 계절을 견디기 위해 굵은 줄기 속에 물을 채움)', insight: '겉으로 화려하게 잎을 피우지 못하는 계절에는 오히려 내 몸통 안에 고요한 물을 채워 두는 시간이 됨', tone: '마다가스카르 모론다바의 붉은 흙길 위로 거대한 바오밥나무 그림자가 길게 드리워지는 아침' },
  { motif: '피하바나나의 인연 매듭(Fihavanana · 혼자 잘 되는 것보다 서로의 체면과 유대를 지킴)', insight: '빠른 결론을 내리려 상대의 마음을 다치게 하기보다 오래 함께 갈 수 있는 온도를 지키는 것이 먼저임', tone: '바닷바람이 불어오는 마을 마당에서 이웃들이 눈을 맞추며 인사를 건네는 오전' },
  { motif: '바라 라피아 직조(Lamba Weaving · 얇은 야자 잎 섬유를 엮어 삶을 감싸는 천을 만듦)', insight: '오늘 스쳐 가는 작은 성의와 사소한 시간들도 엮어 보면 내 어깨를 덮는 든든한 천이 됨', tone: '햇살이 비치는 붉은 벽돌 집 처마 아래, 햇볕에 말린 라피아 실이 반짝이는 낮' },
  { motif: '여우원숭이의 숲 건너뛰기(Indri Call · 높은 나무 꼭대기에서 울음으로 서로의 위치를 확인함)', insight: '숲이 깊어 앞이 안 보일 때는 조급히 땅으로 내려가기보다 내 위치를 알리는 신호를 먼저 보내면 됨', tone: '안개 낀 동부 열대우림의 높은 가지 사이로 맑고 긴 울림이 퍼져 나가는 오후' },
  { motif: '붉은 토양 위의 별빛(Red Earth Dusk · 해가 진 뒤에도 붉은 땅이 낮의 온기를 머금음)', insight: '하루가 끝났다고 모든 노력이 사라지는 것이 아니라 내 안의 붉은 토양에 온기로 남음', tone: '노을이 짙게 물든 바오밥 가로수길 너머로 첫 별이 조용히 떠오르는 저녁' },
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

export function calculateMalagasyBaobabRootPoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MalagasyBaobabResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-MALAGASY-BAOBAB-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    malagasyMotif: picked.motif,
    malagasyInsight: picked.insight,
    savannaTone: picked.tone,
    reflectionFocus: `말라가시 바오밥의 '${picked.motif}'처럼, 겉의 잎이 뜸해 보이는 날에도 내 안의 중심 줄기에 고요한 물을 채워 두세요.`,
    ritualAction: '오늘 겉으로 당장 드러나는 성과보다, 내 마음을 마르지 않게 해 주는 휴식이나 수분 한 잔을 먼저 챙겨 보세요.',
    reflectiveQuestion: '지금 내가 조급히 잎을 피우려다 오히려 중심 줄기의 물기를 빼앗고 있지는 않나요?',
    interpretiveBoundary: '마다가스카르 말라가시 전통의 피하바나나 유대와 바오밥나무 생장 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatMalagasyBaobabPrompt(res: MalagasyBaobabResult): string {
  return [
    `[말라가시·바오밥 뿌리 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 말라가시 모티프: ${res.malagasyMotif} (${res.savannaTone})`,
    `- 중심 통찰: ${res.malagasyInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
