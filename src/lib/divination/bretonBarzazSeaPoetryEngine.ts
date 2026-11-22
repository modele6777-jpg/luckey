import type { UserProfile } from '../sharedState';

export interface BretonBarzazResult {
  engineVersion: string;
  calculatedAtKst: string;
  coastalMotif: string;
  companionMotif: string;
  tidePhase: string;
  barzazInsight: string;
  seaTone: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const TIDE_PHASES = [
  '썰물 개방(물이 빠진 모래톱을 따라 한 걸음씩 길을 짚어 가는 시기)',
  '만조 정박(파도가 높은 때에 닻을 내리고 등대 불빛을 확인하는 시기)',
  '초입 샘물(복잡한 계산을 내려놓고 처음 품은 의도로 되돌아가는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '바다 안개가 걷히기를 기다리느라 지금 등대 아래에서 비출 수 있는 작은 한 걸음까지 미루지 마세요.',
  '멘히르 선돌처럼 중심을 지키는 태도가 주변과의 대화를 닫는 완고함으로 굳어지지 않도록 살피세요.',
  '밀물과 썰물의 흐름을 살피는 데 그치지 말고 물이 빠진 자리에 실제 발자국을 남길 실행을 챙기세요.',
] as const;

const MOTIFS = [
  {
    motif: '브로셀리앙드(Brocéliande) 숲의 샘물',
    insight: '복잡한 계획이 엉킬수록 가장 처음 품었던 맑은 의도 한 줄로 돌아가 다시 물을 긷는 지혜',
    tone: '이끼 낀 떡갈나무 아래 고요히 반짝이는 맑은 샘',
    ritual: '얽힌 일정이나 메모를 펼치기 전에 내가 이 일을 처음 시작했던 이유 한 줄만 먼저 적어 보세요.',
    question: '복잡한 계산을 잠시 걷어 내고 브로셀리앙드 숲의 샘물 같은 처음의 의도로 돌아간다면 무엇이 가장 선명한가요?',
  },
  {
    motif: '아르모리카(Armorica) 등대의 불빛',
    insight: '안개가 짙어 앞이 다 보이지 않더라도 지금 당장 비출 수 있는 한 걸음의 방향을 지키는 꾸준함',
    tone: '거친 대서양 파도 끝 바위 절벽을 지키는 따뜻한 불빛',
    ritual: '멀리 있는 불확실한 결과 대신 오늘 당장 내가 비출 수 있는 한 걸음의 과제 하나만 실행해 보세요.',
    question: '앞이 다 보이지 않는 안개 속에서도 지금 내가 등대 불빛처럼 묵묵히 비출 수 있는 한 걸음은 어디인가요?',
  },
  {
    motif: '멘히르(Menhir) 선돌의 고요한 버팀',
    insight: '주변의 서두름에 휩쓸리지 않고 내 리듬과 속도를 묵묵히 지키는 단단한 중심',
    tone: '해풍을 맞으며 수천 년을 서 있는 화강암 돌기둥',
    ritual: '남들의 속도에 맞추려 조급해질 때마다 잠시 어깨를 내리고 나만의 호흡 박자를 세 번 세어 보세요.',
    question: '주변의 서두름에 흔들리지 않고 멘히르 선돌처럼 끝까지 지키고 싶은 나만의 속도와 기준은 무엇인가요?',
  },
  {
    motif: '바르작 브레이즈(Barzaz Breiz)의 민요 가락',
    insight: '말로 다 설명되지 않는 마음의 결을 짧은 문장이나 노래로 건넬 때 공명이 일어나는 힘',
    tone: '저녁 어스름 항구 술집에 울려 퍼지는 켈트 하프 소리',
    ritual: '오늘 하고 싶은 일이나 떠오른 생각을 한 줄의 짧은 시나 메모로 적어 내 마음의 결을 확인해 보세요.',
    question: '논리적인 설명으로는 다 담기지 않지만 짧은 노래나 한 문장으로 건네면 마음이 통할 진심은 무엇인가요?',
  },
  {
    motif: '생말로(Saint-Malo) 밀물과 썰물의 시간',
    insight: '물이 빠졌을 때 걸어갈 길과 물이 찼을 때 쉬어갈 때를 가려 아는 자연스러운 감각',
    tone: '썰물 뒤 드러난 젖은 모래사장 위의 선명한 발자국',
    ritual: '오늘 억지로 밀어붙여 지치는 일 하나를 멈추고, 물이 들어올 때와 빠질 때를 구분해 배치해 보세요.',
    question: '지금 내가 조급하게 썰물을 거슬러 헤엄치려 하느라 놓치고 있는 고요한 때와 흐름은 무엇인가요?',
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

export function calculateBretonBarzazSeaPoetry(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BretonBarzazResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const tidePhase = TIDE_PHASES[stableHash(`${seed}|phase`) % TIDE_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[stableHash(`${seed}|shadow`) % SHADOW_WARNINGS.length];

  return {
    engineVersion: 'LUCKEY-BRETON-BARZAZ-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    coastalMotif: picked.motif,
    companionMotif: companion.motif,
    tidePhase,
    barzazInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    seaTone: picked.tone,
    shadowWarning,
    reflectionFocus: `브르타뉴 시학의 '${tidePhase}' 흐름 속에서 '${picked.motif}'와 동반 결 '${companion.motif}'을 함께 짚어, 지금이 밀어붙일 때인지 숨을 고를 때인지 가려 보세요.`,
    ritualAction: `${picked.ritual} (동반 결: ${companion.motif})`,
    reflectiveQuestion: `${picked.question} '${tidePhase}' 국면에서 내가 가장 먼저 지킬 방향은 어디인가요?`,
    interpretiveBoundary: '프랑스 브르타뉴 전통의 바르작 브레이즈(Barzaz Breiz) 해안 시학과 켈트 자연 감수성을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBretonBarzazPrompt(res: BretonBarzazResult): string {
  return [
    `[브르타뉴 바르작 해안 시학 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 해안 모티프: ${res.coastalMotif} (${res.seaTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 조수 국면: ${res.tidePhase}`,
    `- 중심 통찰: ${res.barzazInsight}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
