import type { UserProfile } from '../sharedState';

export type SamiDrumZoneId =
  | 'sun_center_beaivi'
  | 'north_winter_rest'
  | 'south_warmth_movement'
  | 'east_dawn_clarity'
  | 'west_ancestral_echo';

export interface SamiDrumZone {
  id: SamiDrumZoneId;
  samiTerm: string;
  koreanLabel: string;
  symbolicImage: string;
  coreInsight: string;
  groundingPractice: string;
}

export interface SamiNoaidiDrumJoikResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  activeDrumZone: SamiDrumZone;
  companionDrumZone: SamiDrumZone;
  joikResonanceMode: string;
  seasonalRhythm: string;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const SAMI_DRUM_ZONES: readonly SamiDrumZone[] = [
  {
    id: 'sun_center_beaivi',
    samiTerm: 'Beaivi (태양 중심)',
    koreanLabel: '중심의 빛과 통합',
    symbolicImage: '드럼 한가운데 마름모꼴 태양(Beaivi) 문양',
    coreInsight: '사방으로 흩어진 생각과 걱정을 다시 자신의 중심 온기로 불러 모아 균형을 세우는 자리입니다.',
    groundingPractice: '외부 소음을 잠깐 끄고 지금 내 마음이 가장 따뜻하게 반응하는 한 가지에 시선을 모으세요.',
  },
  {
    id: 'north_winter_rest',
    samiTerm: 'Dálvi (북쪽 겨울 고요)',
    koreanLabel: '고요한 멈춤과 비축',
    symbolicImage: '설원 아래 숨을 고르는 순록 무리 문양',
    coreInsight: '눈보라 속에서 무리하게 달리지 않고 몸과 마음의 열기를 아끼며 다음 이동을 기다리는 지혜의 자리입니다.',
    groundingPractice: '오늘 해야 할 목록 중 긴급하지 않은 하나를 과감히 내일로 미뤄 숨 쉴 틈을 만들어 주세요.',
  },
  {
    id: 'south_warmth_movement',
    samiTerm: 'Geassi (남쪽 여름 순환)',
    koreanLabel: '유연한 이동과 확장',
    symbolicImage: '물길과 바람을 따라 이동하는 계절 경로',
    coreInsight: '고여 있던 자리를 벗어나 자연스러운 흐름을 따라 가볍게 움직일 때 막힘이 풀리는 자리입니다.',
    groundingPractice: '익숙한 동선이나 작업 순서를 살짝 바꿔 몸의 감각을 새롭게 깨워 보세요.',
  },
  {
    id: 'east_dawn_clarity',
    samiTerm: 'Guovssahasat (동쪽 여명·오로라)',
    koreanLabel: '직관의 결단과 명료함',
    symbolicImage: '북쪽 하늘을 가로지르는 여명의 빛줄기',
    coreInsight: '복잡하게 얽힌 이해관계 너머로 내 안의 직관이 가리키는 명료한 방향을 알아보는 자리입니다.',
    groundingPractice: '망설이던 질문 하나에 대해 머리가 아닌 첫 직감의 답을 메모로 남겨 보세요.',
  },
  {
    id: 'west_ancestral_echo',
    samiTerm: 'Sáiva (서쪽 성스러운 호수)',
    koreanLabel: '내면의 울림과 회복',
    symbolicImage: '바닥이 두 겹으로 비치는 신성한 호수(Sáiva)',
    coreInsight: '겉으로 드러난 역할 이면의 본래 목소리를 기억하고, 타인의 평가가 아닌 자기 존재의 리듬을 존중하는 자리입니다.',
    groundingPractice: '누군가의 기대를 빼고 오직 나를 위해 보내는 15분의 조용한 시간을 확보하세요.',
  },
] as const;

const JOIK_MODES: readonly string[] = [
  '존재를 있는 그대로 호명하는 요이쿠(Joik) — 판단 없이 지금 상태를 인정하기',
  '바람과 물결을 닮은 순환 요이쿠 — 억지 통제 대신 리듬 타기',
  '산맥과 숲을 잇는 공명 요이쿠 — 혼자가 아닌 연결감 회복하기',
];

const SAMI_EIGHT_SEASONS: readonly string[] = [
  '가을-겨울(Čakčadálvi) — 바깥 활동을 거두고 내면을 정돈하는 절기',
  '깊은 겨울(Dálvi) — 고요 속에서 본질을 지키는 절기',
  '봄-겨울(Giđđadálvi) — 얼어 있던 흐름이 서서히 풀리는 절기',
  '봄(Giđđa) — 새로운 길로 첫 발을 내딛는 절기',
];

function formatSamiKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateSamiNoaidiDrumJoik(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SamiNoaidiDrumJoikResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();

  const seedStr = [
    params.profile.basic?.name ?? '',
    JSON.stringify(params.profile.fate ?? {}),
    query,
  ].join('|');
  const seed = stableHash(seedStr);

  const activeIndex = seed % SAMI_DRUM_ZONES.length;
  const activeDrumZone = SAMI_DRUM_ZONES[activeIndex];
  const companionOffset = 1 + (stableHash(`${seedStr}|companion`) % (SAMI_DRUM_ZONES.length - 1));
  const companionDrumZone = SAMI_DRUM_ZONES[(activeIndex + companionOffset) % SAMI_DRUM_ZONES.length];
  const joikResonanceMode = JOIK_MODES[(seed >> 3) % JOIK_MODES.length];
  const seasonalRhythm = SAMI_EIGHT_SEASONS[(seed >> 5) % SAMI_EIGHT_SEASONS.length];

  const qualitativeSynthesis =
    `북유럽 사미(Sámi) 전통의 노아이디 드럼과 요이쿠 상징으로 살펴보면, 현재 마음의 진동은 ` +
    `‘${activeDrumZone.samiTerm} — ${activeDrumZone.koreanLabel}’ 영역을 중심으로 ‘${companionDrumZone.samiTerm} — ${companionDrumZone.koreanLabel}’의 결이 곁들여져 있습니다. ` +
    `${activeDrumZone.coreInsight} 사미의 8계절 감각으로는 ‘${seasonalRhythm}’에 해당하며, ` +
    `무언가를 설명하거나 증명하려 들기보다 ‘${joikResonanceMode}’의 태도로 자기 호흡을 되찾기 좋은 때입니다.`;

  const reflectionFocus =
    `${activeDrumZone.koreanLabel}의 리듬 위에서 ${companionDrumZone.koreanLabel}의 균형을 곁들여 불필요한 긴장을 내려놓고 고유한 호흡을 회복하는 시점`;

  const ritualAction = activeDrumZone.groundingPractice;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’의 한가운데에서, ${activeDrumZone.koreanLabel}과 ${companionDrumZone.koreanLabel}의 감각을 되찾기 위해 지금 당장 멈추거나 놓아주어도 되는 긴장은 무엇인가요?`
    : `지금 내 삶의 계절에서 ‘${activeDrumZone.koreanLabel}’의 시선으로 억지로 밀어붙이기보다 리듬을 맞춰 기다려 주어야 할 일은 무엇인가요?`;

  return {
    engineName: '사미(Sámi) 노아이디 드럼·요이쿠 리듬 (Noaidi Drum & Joik)',
    engineVersion: 'LUCKEY-SAMI-NOAIDI-JOIK-v2.2.0',
    calculatedAtKst: formatSamiKstTimestamp(now),
    activeDrumZone,
    companionDrumZone,
    joikResonanceMode,
    seasonalRhythm,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 북유럽 사미(Sámi) 문화의 드럼 상징과 요이쿠(Joik) 성찰 철학을 바탕으로 한 비유적 자기 점검 프레임워크이며, 의학적·심리적 진단이나 미래 예측 수치가 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatSamiNoaidiDrumJoikPrompt(res: SamiNoaidiDrumJoikResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 드럼 공명 영역: ${res.activeDrumZone.samiTerm} · ${res.activeDrumZone.koreanLabel} (${res.activeDrumZone.symbolicImage})`,
    `- 동반 공명 영역: ${res.companionDrumZone.samiTerm} · ${res.companionDrumZone.koreanLabel}`,
    `- 요이쿠 공명 방식: ${res.joikResonanceMode}`,
    `- 사미 절기 리듬: ${res.seasonalRhythm}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
