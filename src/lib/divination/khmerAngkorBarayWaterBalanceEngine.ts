import type { UserProfile } from '../sharedState';

export interface KhmerAngkorBarayResult {
  engineVersion: string;
  calculatedAtKst: string;
  barayState: string;
  waterCycleInsight: string;
  templeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STATES = [
  { state: '서바라이(West Baray) 고요한 저수', insight: '넘치는 감정과 할 일을 당장 쏟아내지 않고, 넓은 그릇에 잠시 고요히 모아 두는 여유', tone: '연꽃 연못에 비친 사원 그림자' },
  { state: '스라 스랑(Srah Srang) 왕실 수로의 순환', insight: '고여 있어 답답한 생각에 작은 틈을 내어 신선한 물줄기가 흐르게 하는 전환', tone: '새벽 안개 속 사암 계단' },
  { state: '프놈 쿨렌(Phnom Kulen) 천 개의 링가 정화', insight: '근원적인 마음이 탁해졌을 때 바쁜 일정을 잠시 멈추고 초심의 물결로 씻어 내기', tone: '폭포 아래 맑은 물소리' },
  { state: '바이욘(Bayon) 사면의 온화한 시선', insight: '한쪽 입장에만 갇히지 않고 동서남북 네 방향에서 상황을 부드럽게 바라보기', tone: '돌미소 위에 머문 오후 햇살' },
  { state: '나까(Naga) 다리 경계 건너기', insight: '혼란스러운 바깥 소음을 다리 밖에 두고 내 안의 단정한 중심 공간으로 들어가기', tone: '해자를 건너는 돌난간의 평온' },
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

export function calculateKhmerAngkorBarayWaterBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KhmerAngkorBarayResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % STATES.length;
  const picked = STATES[idx];

  return {
    engineVersion: 'LUCKEY-KHMER-ANGKOR-BARAY-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    barayState: picked.state,
    waterCycleInsight: picked.insight,
    templeTone: picked.tone,
    reflectionFocus: `거대한 저수지 바라이처럼 '${picked.state}'의 리듬으로 에너지를 모으고 흘려보내 보세요.`,
    ritualAction: '물 한 잔을 천천히 마시면서, 지금 내 안에서 가장 고여 있는 걱정 하나를 가볍게 내려놓아 보세요.',
    reflectiveQuestion: '지금 내 마음의 에너지는 비축해 둘 때인가요, 아니면 막힌 물길을 열어 흘려보낼 때인가요?',
    interpretiveBoundary: '캄보디아 크메르 앙코르 바라이 수리·순환 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKhmerAngkorBarayPrompt(res: KhmerAngkorBarayResult): string {
  return [
    `[크메르 앙코르 바라이 물 순환 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 순환 국면: ${res.barayState} (${res.templeTone})`,
    `- 중심 통찰: ${res.waterCycleInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
