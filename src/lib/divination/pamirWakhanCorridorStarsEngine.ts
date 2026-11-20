import type { UserProfile } from '../sharedState';

export interface PamirWakhanResult {
  engineVersion: string;
  calculatedAtKst: string;
  pamirMotif: string;
  pamirInsight: string;
  wakhanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '차르호나 천창의 사각 빛(Chorkhona Skylight · 돌집 지붕 한가운데 네모난 구멍이 네 번 겹쳐 하늘을 엶)', insight: '작은 창 하나라도 방향을 달리해 층층이 열어 두면 어두운 방 안으로 하루 종일 빛이 들어옴', tone: '파미르 고원 와칸 회랑의 맑은 아침, 전통 돌집 천창을 통해 푸른 하늘빛이 내려앉는 거실' },
  { motif: '다섯 기둥의 지지(Five Pillars · 집 안을 받치는 다섯 나무 기둥마다 정갈한 의미를 새김)', insight: '삶을 지탱하는 기둥이 여럿일수록 한 기둥이 흔들릴 때도 지붕 전체가 무너지지 않음', tone: '따스한 난로 옆에서 정교하게 조각된 나무 기둥들이 고요히 집을 받치고 있는 오전' },
  { motif: '고산 야크의 느린 발걸음(High-Pass Yak · 산소가 희박한 높은 고개일수록 숨을 고르며 한 걸음씩 오름)', insight: '높고 힘든 목표를 오를 때는 평지처럼 달리려 하지 말고, 고산의 호흡에 맞추어 천천히 걸어야 함', tone: '흰 눈이 덮인 힌두쿠시 봉우리 아래 맑은 산바람을 맞으며 고갯길을 오르는 낮' },
  { motif: '판지 강 너머의 바람(Panj River Crossing · 좁고 빠른 강물 건너편과 늘 인사를 나눔)', insight: '내가 건널 수 없는 경계 너머라도 미움 대신 안부를 건네면 골짜기의 공기가 부드러워짐', tone: '옥빛 빙하물이 흐르는 협곡 사이로 맑은 햇빛이 부서지는 오후' },
  { motif: '고원 별하늘의 나침반(Pamir Night Sky · 구름 한 점 없는 높은 밤하늘에 별자리가 손에 닿을 듯 뜸)', insight: '복잡한 지형에 가로막혀 앞이 안 보일 때는 고개를 들어 변하지 않는 밤하늘의 기준점을 보아야 함', tone: '서늘하고 투명한 고원의 밤, 은하수가 지붕 천창 위로 맑게 흐르는 자정' },
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

export function calculatePamirWakhanCorridorStars(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PamirWakhanResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-PAMIR-WAKHAN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    pamirMotif: picked.motif,
    pamirInsight: picked.insight,
    wakhanTone: picked.tone,
    reflectionFocus: `파미르 와칸의 '${picked.motif}'처럼, 높은 고개일수록 숨을 고르며 한 걸음씩 오르고 하늘을 향한 작은 창을 열어 두세요.`,
    ritualAction: '오늘 서두르고 있던 큰 목표의 속도를 한 단계 낮추고, 고른 호흡으로 오늘 몫의 한 걸음만 걸어 보세요.',
    reflectiveQuestion: '높은 고갯길에 올라와 있으면서도 내가 여전히 평지의 속도로 달리느라 숨이 찬 건 아닌가요?',
    interpretiveBoundary: '중앙아시아 파미르 고원 와칸 회랑의 차르호나 천창과 고산 호흡 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPamirWakhanPrompt(res: PamirWakhanResult): string {
  return [
    `[파미르·와칸 회랑 별빛 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 파미르 모티프: ${res.pamirMotif} (${res.wakhanTone})`,
    `- 중심 통찰: ${res.pamirInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
