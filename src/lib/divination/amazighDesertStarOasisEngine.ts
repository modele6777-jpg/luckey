import type { UserProfile } from '../sharedState';

export type AmazighWaypointId =
  | 'itri_star_bearing'
  | 'aman_oasis_reserve'
  | 'taghelmust_boundary'
  | 'tada_caravan_trust';

export interface AmazighWaypoint {
  id: AmazighWaypointId;
  amazighTerm: string;
  koreanLabel: string;
  coreInsight: string;
  desertPractice: string;
  reflectiveQuestion: string;
}

export type AmazighQuestionTopic = 'direction' | 'endurance' | 'boundary' | 'trust' | 'general';

function classifyAmazighTopic(q: string): AmazighQuestionTopic {
  if (/방향|목표|길|별|흔들|결정/.test(q)) return 'direction';
  if (/지치|체력|멀리|물|아끼|속도|페이스/.test(q)) return 'endurance';
  if (/경계|소음|비교|피곤|거리|차단/.test(q)) return 'boundary';
  if (/동행|신뢰|혼자|도움|함께|사람/.test(q)) return 'trust';
  return 'general';
}

const AMAZIGH_TOPIC_WARNINGS: Record<AmazighQuestionTopic, string> = {
  direction: '멀리 있는 북극성만 바라보다가 지금 당장 건너야 할 발밑의 현실 조건을 놓치지 않도록 살피세요.',
  endurance: '힘을 아끼는 데만 치중하다 정작 오아시스를 떠나 걸어야 할 출발 시점까지 미루지 않도록 균형을 잡으세요.',
  boundary: '소음을 막는 두건을 너무 단단히 두르다 꼭 필요한 협력 신호까지 차단하지 않도록 창 하나는 열어 두세요.',
  trust: '동행에게 기대기 전에 내가 감당할 몫의 짐과 기준을 먼저 분명히 정돈해 두세요.',
  general: '사막을 건널 때는 속도와 휴식 어느 한쪽에 치우치지 않도록 오늘의 물과 보폭을 함께 점검하세요.',
};

export interface AmazighDesertResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: AmazighQuestionTopic;
  caravanCompassAxis: string;
  primaryWaypoint: AmazighWaypoint;
  supportWaypoint: AmazighWaypoint;
  desertPhase: string;
  shadowWarning: string;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const AMAZIGH_WAYPOINTS: readonly AmazighWaypoint[] = [
  {
    id: 'itri_star_bearing',
    amazighTerm: 'Itri (사막 밤하늘의 별)',
    koreanLabel: '모래폭풍 속 방향 감각',
    coreInsight: '낮의 열기와 모래바람에 길이 흐려져도 밤이 되면 떠오르는 별처럼 큰 방향은 변하지 않습니다.',
    desertPractice: '당장 눈앞의 작은 변수에 흔들리기보다 다음 달에도 변치 않을 목표 한 줄을 다시 확인하세요.',
    reflectiveQuestion: '당장의 모래바람이 잦아든 뒤에도 변치 않을 나만의 북극성(Itri) 한 줄은 무엇인가요?',
  },
  {
    id: 'aman_oasis_reserve',
    amazighTerm: 'Aman (오아시스의 물 비축)',
    koreanLabel: '지치지 않게 아끼는 지혜',
    coreInsight: '사막을 건너는 힘은 속도가 아니라 물을 아끼고 제때 숨을 고르는 배분에서 나옵니다.',
    desertPractice: '오늘 일정 중 무리해서 넣은 약속이나 과한 몰입 하나를 덜어 내어 체력을 비축하세요.',
    reflectiveQuestion: '사막을 끝까지 건너기 위해 지금 속도보다 먼저 아껴 두어야 할 오아시스 비축분은 무엇인가요?',
  },
  {
    id: 'taghelmust_boundary',
    amazighTerm: 'Taghelmust (모래바람을 막는 두건)',
    koreanLabel: '마음을 지키는 건강한 경계',
    coreInsight: '불필요한 외부 소음과 감정 소모를 막아 주어야 내 안의 집중력과 품위가 지켜집니다.',
    desertPractice: '오늘 나를 피곤하게 만드는 알림이나 불필요한 비교에서 1시간만 거리를 두어 보세요.',
    reflectiveQuestion: '오늘 나를 지치게 하는 모래바람을 가리고 내 집중력을 지킬 건강한 경계(Taghelmust)는 어디인가요?',
  },
  {
    id: 'tada_caravan_trust',
    amazighTerm: 'Tada (카라반의 신의와 환대)',
    koreanLabel: '신뢰로 건네는 동행',
    coreInsight: '넓은 사막에서는 혼자 버티는 것보다 믿을 수 있는 동료와 짐을 나누어 지는 편이 훨씬 멀리 갑니다.',
    desertPractice: '혼자 끙끙 앓던 일 중 믿을 만한 사람에게 조언이나 도움을 청할 수 있는 한 가지를 꺼내 보세요.',
    reflectiveQuestion: '혼자 버티려 애쓰기보다 믿을 수 있는 동행(Tada)에게 짐 한 조각을 나누어 건넬 일은 무엇인가요?',
  },
] as const;

function formatAmazighKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
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
  return h >>> 0;
}

const DESERT_PHASES = [
  '별빛 항해의 시간 (큰 방향과 장기 기준 재정렬)',
  '새벽 이슬의 시간 (지치지 않을 기초 체력·자원 확보)',
  '모래바람 경계의 시간 (외부 소음 차단과 중심 유지)',
  '오아시스 모닥불의 시간 (신뢰할 동행과의 조율)',
] as const;

const AMAZIGH_SHADOW_WARNINGS: Record<AmazighWaypointId, string> = {
  itri_star_bearing: '멀리 있는 별만 바라보다가 지금 발밑의 모래 웅덩이(현실 조건)를 놓치지 않도록 살피세요.',
  aman_oasis_reserve: '아끼는 데만 치중해 정작 건너야 할 순간의 결단까지 멈추지 않도록 균형을 잡으세요.',
  taghelmust_boundary: '경계를 세우다 필요한 협력 신호까지 차단하지 않도록 마음의 창은 조금 열어 두세요.',
  tada_caravan_trust: '동행에게 기대기 전에 내가 감당할 몫의 짐을 먼저 분명히 정돈해 두세요.',
};

export function calculateAmazighDesertStarOasis(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AmazighDesertResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();
  const questionTopic = classifyAmazighTopic(query);

  const seedRaw = [
    params.profile.basic?.name ?? '',
    JSON.stringify(params.profile.fate ?? {}),
    now.toISOString().slice(0, 13),
    query,
  ].join('|');
  const seed = stableHash(seedRaw);
  const supportSeed = stableHash(`${seedRaw}|support`);
  const phaseSeed = stableHash(`${seedRaw}|phase`);

  const primaryIdx = seed % AMAZIGH_WAYPOINTS.length;
  const supportOffset = 1 + (supportSeed % (AMAZIGH_WAYPOINTS.length - 1));
  const supportIdx = (primaryIdx + supportOffset) % AMAZIGH_WAYPOINTS.length;

  const primaryWaypoint = AMAZIGH_WAYPOINTS[primaryIdx];
  const supportWaypoint = AMAZIGH_WAYPOINTS[supportIdx];
  const desertPhase = DESERT_PHASES[phaseSeed % DESERT_PHASES.length];
  const shadowWarning = questionTopic === 'general'
    ? AMAZIGH_SHADOW_WARNINGS[primaryWaypoint.id]
    : AMAZIGH_TOPIC_WARNINGS[questionTopic];
  const caravanCompassAxis = `${primaryWaypoint.koreanLabel} ↔ ${supportWaypoint.koreanLabel} (${desertPhase.split('(')[0].trim()})`;

  const qualitativeSynthesis =
    `북아프리카 아마지그(베르베르) 사막 유목의 지혜로 바라보면, '${desertPhase}' 국면에서 ` +
    `‘${primaryWaypoint.amazighTerm} — ${primaryWaypoint.koreanLabel}’의 표지가 선명합니다. ` +
    `${primaryWaypoint.coreInsight} 여기에 ‘${supportWaypoint.koreanLabel}’이 뒤를 받쳐 주어, ` +
    `조급한 질주 대신 호흡을 지키며 끝까지 건너갈 수 있는 흐름입니다.`;

  const reflectionFocus =
    `${primaryWaypoint.koreanLabel}을 기준으로 에너지와 경계를 지키는 ${supportWaypoint.koreanLabel} 정렬 시점`;

  const ritualAction = `${primaryWaypoint.desertPractice} (${supportWaypoint.koreanLabel}도 함께 의식해 보세요.)`;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’이라는 사막 구간을 건너는 지금, ${primaryWaypoint.reflectiveQuestion}`
    : primaryWaypoint.reflectiveQuestion;

  return {
    engineName: '아마지그 사막 별·오아시스 길잡이 (Amazigh Desert Compass)',
    engineVersion: 'LUCKEY-AMAZIGH-DESERT-v2.4.0',
    calculatedAtKst: formatAmazighKstTimestamp(now),
    questionTopic,
    caravanCompassAxis,
    primaryWaypoint,
    supportWaypoint,
    desertPhase,
    shadowWarning,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 북아프리카 아마지그 유목 전통의 별자리·오아시스 상징을 빌려 온 자기 성찰 프레임워크이며, 수치적 운세 점수나 미래 예측이 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatAmazighDesertPrompt(res: AmazighDesertResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 사막 나침반 축: ${res.caravanCompassAxis}`,
    `- 주된 길잡이: ${res.primaryWaypoint.amazighTerm} · ${res.primaryWaypoint.koreanLabel}`,
    `- 보조 길잡이: ${res.supportWaypoint.amazighTerm} · ${res.supportWaypoint.koreanLabel}`,
    `- 사막 여정 국면: ${res.desertPhase}`,
    `- 과잉·결핍 경계: ${res.shadowWarning}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
