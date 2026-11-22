import type { UserProfile } from '../sharedState';

export interface BulgarianRoseResult {
  engineVersion: string;
  calculatedAtKst: string;
  roseMotif: string;
  companionMotif: string;
  harvestPhase: string;
  bulgarianInsight: string;
  valleyTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const HARVEST_PHASES = [
  '새벽 수확(가장 맑고 방해 없는 첫 시간대에 핵심 일감을 따는 시기)',
  '구리 증류(흩어진 시도와 메모를 모아 순도 높은 한 문장으로 거르는 시기)',
  '산맥 울타리(불필요한 자극과 찬바람을 막아 여린 흐름을 보호하는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '가장 완벽한 새벽 타이밍만 기다리다가 지금 바로 손댈 수 있는 오후의 실행까지 놓치지 않도록 살피세요.',
  '불필요한 자극을 막으려 세운 울타리가 필요한 소통과 피드백까지 막는 고립으로 굳지 않도록 점검하세요.',
  '핵심 한 방울을 증류하는 데만 마음을 쓰다가 오늘 바로 건네야 할 따뜻한 행동과 기록을 미루지 않도록 유의하세요.',
] as const;

const MOTIFS = [
  {
    motif: '동트기 전의 이슬 수확(Pre-Dawn Harvest · 해가 뜨면 향기가 날아가므로 새벽에 꽃잎을 땀)',
    insight: '중요한 일에는 힘의 크기보다 가장 맑고 집중된 시간대를 고르는 섬세한 타이밍이 결정적임',
    tone: '발칸 산맥 아래 카잔러크 계곡, 연분홍 다마스크 장미 위로 새벽 이슬이 맺힌 이른 아침',
    ritual: '오늘 가장 정신이 맑은 시간 20분을 따로 떼어 내어 가장 소중한 일 한 가지에만 써 보세요.',
    question: '지금 내 하루에서 가장 맑고 고요한 시간대를 먼저 떼어 내어 가꾸고 싶은 핵심 일은 무엇인가요?',
  },
  {
    motif: '구리 증류기의 느린 한 방울(Copper Alembic · 수천 송이 꽃잎에서 단 한 방울의 에센스를 얻음)',
    insight: '많은 시도가 당장 눈에 띄는 결과를 내지 못해도, 정성껏 모아 증류하면 순도 높은 핵심이 남음',
    tone: '오래된 구리 가마솥 위로 은은한 장미 수증기가 피어오르는 오전',
    ritual: '흩어진 생각이나 메모 중 오늘 단 한 줄의 핵심 문장만 남겨서 증류해 보세요.',
    question: '수천 송이의 경험 속에서 내가 지금 조용히 증류해 내고 싶은 단 한 방울의 핵심은 무엇인가요?',
  },
  {
    motif: '발칸 산맥이 막아 주는 바람(Mountain Shelter · 북쪽의 차가운 바람을 산맥이 막아 꽃을 키움)',
    insight: '내 일상이 부드럽게 꽃피우려면 불필요한 자극을 막아 주는 환경적 울타리를 먼저 세워야 함',
    tone: '높은 산봉우리가 계곡을 품어 주어 온화하고 맑은 공기가 감도는 낮',
    ritual: '오늘 집중을 흐트러뜨리는 알림이나 불필요한 약속 하나를 줄여 나만의 고요한 울타리를 세워 보세요.',
    question: '내 일상이 부드럽게 꽃피우기 위해, 불필요한 찬바람을 막아 줄 나만의 울타리는 어디에 세워야 할까요?',
  },
  {
    motif: '바구니를 채우는 손끝의 리듬(Gentle Picking · 가시를 피하며 꽃받침만 살짝 꺾는 숙련)',
    insight: '상처 입지 않으려고 아예 다가가지 않기보다, 조심스럽고 정확한 손길로 다루는 법을 익혀야 함',
    tone: '햇살이 퍼지기 직전, 바구니마다 분홍빛 꽃잎이 소복이 쌓여 가는 오전',
    ritual: '까다롭다고 미뤄 둔 일이나 대화 하나를 조심스럽지만 정확한 말 한 마디로 차분히 다뤄 보세요.',
    question: '가시가 두려워 아예 피하고 있었지만, 손끝의 조심스러운 리듬으로 다가가면 충분히 다룰 수 있는 일은 무엇인가요?',
  },
  {
    motif: '유리병에 담긴 계절의 기억(Attar Vial · 짧은 개화기의 향기를 작은 병에 오래 간직함)',
    insight: '좋은 기운이나 영감이 스쳐 갈 때 흘려보내지 말고 작은 기록으로 담아 두면 긴 겨울을 버팀',
    tone: '작업실 창가에 놓인 작은 호박색 유리병을 통해 부드러운 오후 햇살이 비치는 저녁',
    ritual: '오늘 스쳐 간 좋은 아이디어, 고마운 말, 작은 성취 한 줄을 노트에 짧게 담아 두세요.',
    question: '짧게 스쳐 가는 좋은 기운과 영감 중에서, 작은 병에 담아 오래 간직해 두고 싶은 오늘의 순간은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateBulgarianRoseValleyDawn(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BulgarianRoseResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const harvestPhase = HARVEST_PHASES[stableHash(`${seed}|phase`) % HARVEST_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];

  return {
    engineVersion: 'LUCKEY-BULGARIAN-ROSE-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    roseMotif: picked.motif,
    companionMotif: companion.motif,
    harvestPhase,
    bulgarianInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    valleyTone: picked.tone,
    shadowWarning,
    reflectionFocus: `카잔러크 장미 계곡의 '${harvestPhase}' 흐름에서 '${picked.motif}'와 동반 결 '${companion.motif}'을 함께 짚어, 가장 맑은 시간대에 핵심 한 방울을 모아 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.motif})`,
    reflectiveQuestion: `${picked.question} '${harvestPhase}' 국면에서 내가 먼저 가꿀 한 가지는 무엇인가요?`,
    interpretiveBoundary: '불가리아 카잔러크 장미 계곡의 새벽 수확·구리 증류 장인 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBulgarianRosePrompt(res: BulgarianRoseResult): string {
  return [
    `[불가리아·장미 계곡 새벽 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 장미 계곡 모티프: ${res.roseMotif} (${res.valleyTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 수확 국면: ${res.harvestPhase}`,
    `- 중심 통찰: ${res.bulgarianInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
