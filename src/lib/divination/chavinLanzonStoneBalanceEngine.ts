import type { UserProfile } from '../sharedState';

export interface ChavinLanzonResult {
  engineVersion: string;
  calculatedAtKst: string;
  chavinMotif: string;
  chavinInsight: string;
  stoneTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '라손 석주의 중심축(Lanzon Axis · 교차하는 지하 회랑 한가운데 우뚝 서서 사방의 균형을 잡음)', insight: '여러 갈래 선택지가 사방에서 부딪힐수록 흔들리지 않는 내 안의 중심축 하나를 먼저 세워야 함', tone: '안데스 산맥 깊은 계곡의 차빈 석조 신전 중앙, 서늘한 돌기둥에 은은한 빛이 내려앉는 아침' },
  { motif: '지하 수로의 공명(Acoustic Canal · 물이 돌 수로를 지나며 맑고 깊은 울림을 만들어 냄)', insight: '겉으로 소리 내어 다투지 않아도, 제 길을 따라 성실히 흐르는 일은 결국 깊은 울림을 남김', tone: '정교하게 짜인 화강암 수로 아래로 맑은 계곡물이 낮고 웅장한 소리를 내며 흐르는 낮' },
  { motif: '모스나와 우아체사 강물의 합류(River Confluence · 두 갈래 강물이 하나의 계곡에서 만나 힘을 합침)', insight: '서로 다른 재능이나 경험이 만날 때 한쪽을 버리지 않고 합쳐 보면 더 큰 흐름이 생김', tone: '두 물줄기가 자갈밭 사이에서 만나 넓고 맑은 물길을 이루는 오후' },
  { motif: '테논 머리의 다양한 표정(Tenon Heads · 바깥 벽면을 따라 저마다 다른 변용과 시선이 이어짐)', insight: '상황이 바뀔 때마다 유연하게 태도를 달리하는 것은 변덕이 아니라 살아 있는 적응의 지혜임', tone: '회색 돌벽 위에 솟아오른 조각상들이 고원 구름의 흐름을 따라 빛과 그림자를 바꾸는 저녁' },
  { motif: '황금빛 콘도르의 날개(Andean Condor · 높은 산봉우리 사이의 상승 기류를 타고 힘들이지 않고 솟음)', insight: '내 힘만으로 억지로 날갯짓하기보다, 지금 불어오는 흐름과 바람을 읽고 올라타면 훨씬 가벼움', tone: '맑은 안데스 하늘 위로 커다란 새가 날개를 쭉 편 채 고요히 선회하는 정오' },
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

export function calculateChavinLanzonStoneBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChavinLanzonResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-CHAVIN-LANZON-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    chavinMotif: picked.motif,
    chavinInsight: picked.insight,
    stoneTone: picked.tone,
    reflectionFocus: `안데스 차빈 라손의 '${picked.motif}'처럼, 사방의 갈래가 복잡할수록 내 안의 중심축을 먼저 세우고 흐름을 타 보세요.`,
    ritualAction: '오늘 결정해야 할 일 중 가장 핵심 기준 한 문장만 메모지에 먼저 적어 중심을 잡아 보세요.',
    reflectiveQuestion: '지금 내가 억지로 날갯짓하느라 지쳐 있을 뿐, 사실은 타고 갈 수 있는 상승 기류는 무엇인가요?',
    interpretiveBoundary: '고대 페루 안데스 차빈 데 우안타르의 라손 석주·수로 공명 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChavinLanzonPrompt(res: ChavinLanzonResult): string {
  return [
    `[차빈·라손 돌기둥 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 차빈 모티프: ${res.chavinMotif} (${res.stoneTone})`,
    `- 중심 통찰: ${res.chavinInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
