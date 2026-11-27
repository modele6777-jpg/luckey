import type { UserProfile } from '../sharedState';

export interface AndalusianPatioResult {
  engineVersion: string;
  calculatedAtKst: string;
  patioMotif: string;
  companionMotif: string;
  courtyardPhase: string;
  questionTopic: 'calm' | 'focus' | 'boundary' | 'general';
  patioCrossAxis: string;
  shadowWarning: string;
  andalusianInsight: string;
  courtyardTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '안뜰의 작은 분수 물소리(Patio Fountain · 바깥의 뜨거운 소음을 작은 물줄기 소리가 가려 줌)',
    insight: '외부의 시끄러운 자극을 물리적으로 다 없애려 들기보다, 내 안의 잔잔한 물소리 하나를 키우면 고요해짐',
    tone: '코르도바의 하얀 회벽 안뜰, 초록 화분들 사이로 작은 팔각 분수에서 맑은 물이 솟아오르는 아침',
    ritual: '오늘 하루 중 불필요한 알림이나 소음을 잠시 끄고, 내 마음을 식혀 주는 조용한 10분을 만들어 보세요.',
    question: '지금 내 안뜰로 거르지 않고 들이고 있어서 나를 지치게 만드는 한낮의 열기는 무엇인가요?',
  },
  {
    motif: '아세키아 수로의 순환(Acequia Canal · 적은 물로도 정원 구석구석을 식혀 주는 얇은 수로)',
    insight: '자원과 에너지가 제한적일수록 얇고 정교한 수로를 내어 꼭 필요한 곳에 흘려보내면 충분함',
    tone: '그라나다 언덕 아래 그늘진 정원을 따라 대리석 수로가 조용히 반짝이는 오전',
    ritual: '오늘 해야 할 일 중 에너지가 새는 곳 하나를 막고, 가장 필요한 한 곳으로만 시간의 수로를 내어 보세요.',
    question: '자원과 집중력을 여기저기 흩뿌리기보다, 얇고 정교한 수로처럼 꼭 필요한 곳에 흘려보낼 일은 무엇인가요?',
  },
  {
    motif: '오렌지 나무의 그늘과 향기(Courtyard Orange Tree · 열매와 꽃이 같은 가지에서 은은한 쉼을 줌)',
    insight: '수확(열매)만 바라보며 내달리지 않고, 지금 피어 있는 향기(꽃)를 잠시 누릴 줄 알아야 함',
    tone: '짙은 초록 잎 사이로 하얀 오렌지 꽃이 피어 달콤한 바람이 부는 낮',
    ritual: '결과가 아직 나지 않은 일이라도 오늘 잘 자라고 있는 과정 하나를 찾아 잠깐 칭찬해 주세요.',
    question: '먼 수확만 바라보느라, 지금 내 곁에 피어 있는 꽃과 그늘의 향기를 놓치고 있는 순간은 언제인가요?',
  },
  {
    motif: '격자 창살 너머의 시선(Celosía Lattice · 바깥의 눈부심은 걸러 내고 바람과 빛의 무늬만 들임)',
    insight: '모든 정보와 감정을 그대로 다 받아들이지 말고, 내 마음의 격자 창살로 필요한 빛만 걸러 들여야 함',
    tone: '조각된 나무 창살을 통과한 햇빛이 서늘한 타일 바닥에 기하학 무늬를 그리는 오후',
    ritual: '오늘 나를 불안하게 만드는 뉴스나 비교 시선 하나를 격자 창살 밖으로 잠시 걸러 내 보세요.',
    question: '바깥의 눈부신 소음 중에서 내 안뜰의 평온을 위해 격자 창살로 걸러 내야 할 것은 무엇인가요?',
  },
  {
    motif: '저녁 마당의 물 뿌리기(Evening Cooling · 하루의 열기가 식을 때 바닥에 맑은 물을 뿌려 공기를 바꿈)',
    insight: '오늘 하루 쌓인 열기와 감정의 찌꺼기를 밤까지 끌고 가지 말고 가볍게 식히고 하루를 닫아야 함',
    tone: '분홍빛 노을이 내린 안뜰 타일 위로 서늘한 물기가 번지며 꽃내음이 살아나는 저녁',
    ritual: '하루를 마무리할 때 오늘 남은 아쉬움이나 긴장을 짧게 적어 두고 시원하게 손을 씻으며 닫아 보세요.',
    question: '오늘 하루 쌓인 열기 중 밤까지 끌고 가지 말고 저녁 마당의 물 뿌리기처럼 식혀 둘 감정은 무엇인가요?',
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

const COURTYARD_PHASES = [
  '아침 회벽 이슬의 국면 (바깥 소음이 들리기 전 내 안의 물소리 조율)',
  '한낮 아세키아 그늘의 국면 (에너지를 꼭 필요한 한 수로로만 집중)',
  '오후 격자 창살의 국면 (불필요한 자극을 거르고 필요한 빛만 수용)',
  '저녁 마당 물 뿌리기의 국면 (하루의 열기를 식히고 가볍게 마감)',
];

const PATIO_SHADOW_WARNINGS = [
  '고요함을 지키려다 꼭 들어야 할 현실의 신호까지 귀를 닫지 않도록 살피세요.',
  '수로를 아끼는 데만 치중해 정작 물이 필요한 새로운 시도까지 막지 마세요.',
  '과정과 향기를 누리는 여유가 마감 시한을 놓치는 느슨함으로 흐르지 않게 균형을 잡으세요.',
  '빛을 거르는 격자 창살이 스스로를 가두는 벽이 되지 않도록 환기 창을 열어 두세요.',
  '하루의 열기를 식힌 뒤 내일 아침 다시 켤 작은 불씨까지 꺼뜨리지 마세요.',
];

export function calculateAndalusianPatioFountainCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AndalusianPatioResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const phaseIdx = stableHash(`${seed}|phase`) % COURTYARD_PHASES.length;
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const courtyardPhase = COURTYARD_PHASES[phaseIdx];
  const shadowWarning = PATIO_SHADOW_WARNINGS[idx];
  const q = (params.question ?? '').trim();
  const questionTopic: AndalusianPatioResult['questionTopic'] = !q
    ? 'general'
    : /물소리|안뜰|열기|피곤|쉼|식히|고요/.test(q)
      ? 'calm'
      : /집중|에너지|일|업무|수로|계획/.test(q)
        ? 'focus'
        : /경계|비교|뉴스|소음|사람|거르/.test(q)
          ? 'boundary'
          : 'general';
  const patioCrossAxis = `${questionTopic} · ${picked.motif.split('(')[0].trim()} × ${courtyardPhase.split('(')[0].trim()}`;

  return {
    engineVersion: 'LUCKEY-ANDALUSIAN-PATIO-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    patioMotif: picked.motif,
    companionMotif: companion.motif,
    courtyardPhase,
    questionTopic,
    patioCrossAxis,
    shadowWarning,
    andalusianInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    courtyardTone: picked.tone,
    reflectionFocus: `안달루시아 파티오의 '${picked.motif}'와 동반 결 '${companion.motif}'을 '${courtyardPhase}'에 비추어, 바깥의 눈부심과 열기는 걸러 내고 내 안뜰의 잔잔한 물소리를 지켜 보세요.`,
    ritualAction: `${picked.ritual} (${companion.motif.split('(')[0].trim()} 흐름도 함께 살펴보세요.)`,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '안달루시아 코르도바·그라나다 파티오 안뜰과 아세키아 수로 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAndalusianPatioPrompt(res: AndalusianPatioResult): string {
  return [
    `[안달루시아·파티오 분수 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 파티오 모티프: ${res.patioMotif} (${res.courtyardTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 안뜰 온도 국면: ${res.courtyardPhase}`,
    `- 질문 맥락(${res.questionTopic}) · 파티오 교차 축: ${res.patioCrossAxis}`,
    `- 과잉·차단 경계: ${res.shadowWarning}`,
    `- 중심 통찰: ${res.andalusianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
