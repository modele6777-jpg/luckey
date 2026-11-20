import type { UserProfile } from '../sharedState';

export interface TorajaAlukPillar {
  name: string;
  symbol: string;
  guidance: string;
}

export interface TorajaAlukResult {
  engineVersion: string;
  calculatedAtKst: string;
  activePillar: TorajaAlukPillar;
  tongkonanOrientation: string;
  interpretation: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const TORAJA_ALUK_PILLARS: TorajaAlukPillar[] = [
  {
    name: '통코난(Tongkonan)의 뿌리와 방향성',
    symbol: '하늘을 향해 솟은 배 모양 지붕',
    guidance: '어디로 나아갈지 헷갈릴수록 내가 어디에서 왔는지, 어떤 가치 위에 집을 짓고 싶은지 먼저 방향을 확인하는 때입니다.',
  },
  {
    name: '알룩 토돌로(Aluk Todolo) — 감사와 순환의 예법',
    symbol: '대나무 마디와 벼 이삭',
    guidance: '크게 도약하기 전에 지금 내 곁을 지켜 준 사람과 일상의 작은 도움에 감사를 표현하면 흐름이 단단해집니다.',
  },
  {
    name: '람부 솔로·람부 투카 — 슬픔과 기쁨의 제자리',
    symbol: '동쪽과 서쪽의 균형',
    guidance: '지나간 일을 충분히 애도하고 정리해야 새로운 기쁨과 시작이 온전히 들어설 자리가 생깁니다.',
  },
  {
    name: '공동체의 엮임과 신뢰의 매듭',
    symbol: '파송(Pa’ssura) 조각 문양',
    guidance: '혼자 짊어지던 짐을 믿을 수 있는 한 사람과 나누어 들 때 생각보다 훨씬 가볍게 문턱을 넘을 수 있습니다.',
  },
];

const TONGKONAN_ORIENTATIONS = [
  '북쪽(Ulunna Langi)을 바라보듯 초심과 기준점을 다시 세우는 방향',
  '동쪽(Matallo)의 아침 빛처럼 새로운 관계와 기회에 마음을 여는 방향',
  '집안의 중앙 기둥(A’riri Posi)처럼 흔들리지 않는 일상의 중심을 지키는 방향',
];

function formatKstTimestamp(date: Date): string {
  const kstMs = date.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateTorajaAlukTodoloTongkonan(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TorajaAlukResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 10)}`;
  const hash = stableHash(seed);

  const activePillar = TORAJA_ALUK_PILLARS[hash % TORAJA_ALUK_PILLARS.length];
  const tongkonanOrientation = TONGKONAN_ORIENTATIONS[(hash >>> 3) % TONGKONAN_ORIENTATIONS.length];

  return {
    engineVersion: 'LUCKEY-TORAJA-ALUK-v2.1.0',
    calculatedAtKst: formatKstTimestamp(now),
    activePillar,
    tongkonanOrientation,
    interpretation: `인도네시아 토라자 알룩 토돌로(Aluk Todolo)와 통코난 지혜에서는 '${activePillar.name}'(${activePillar.symbol})의 결이 강조됩니다. ${activePillar.guidance}`,
    ritualAction: '오늘 하루 고마웠던 사람 한 명에게 짧은 감사 인사를 건네고, 내 책상이나 방 한쪽을 정돈해 통코난의 중심을 세워 보세요.',
    reflectionFocus: `'${tongkonanOrientation}'을 떠올리며 지금 내 삶에서 가장 먼저 바로잡고 싶은 방향을 한 줄로 정리해 보세요.`,
    reflectiveQuestion: '지금 내가 놓치고 있던 고마움이나, 다시 제자리에 돌려놓고 싶은 일상의 기본 약속은 무엇인가요?',
    interpretiveBoundary: '본 풀이는 인도네시아 토라자 알룩 토돌로와 통코난 전통 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTorajaAlukPrompt(result: TorajaAlukResult): string {
  return [
    `[토라자 알룩 토돌로·통코난 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 중심 기둥: ${result.activePillar.name} (${result.activePillar.symbol})`,
    `- 통코난 방향: ${result.tongkonanOrientation}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
