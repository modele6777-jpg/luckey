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
}

export interface AmazighDesertResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  primaryWaypoint: AmazighWaypoint;
  supportWaypoint: AmazighWaypoint;
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
  },
  {
    id: 'aman_oasis_reserve',
    amazighTerm: 'Aman (오아시스의 물 비축)',
    koreanLabel: '지치지 않게 아끼는 지혜',
    coreInsight: '사막을 건너는 힘은 속도가 아니라 물을 아끼고 제때 숨을 고르는 배분에서 나옵니다.',
    desertPractice: '오늘 일정 중 무리해서 넣은 약속이나 과한 몰입 하나를 덜어 내어 체력을 비축하세요.',
  },
  {
    id: 'taghelmust_boundary',
    amazighTerm: 'Taghelmust (모래바람을 막는 두건)',
    koreanLabel: '마음을 지키는 건강한 경계',
    coreInsight: '불필요한 외부 소음과 감정 소모를 막아 주어야 내 안의 집중력과 품위가 지켜집니다.',
    desertPractice: '오늘 나를 피곤하게 만드는 알림이나 불필요한 비교에서 1시간만 거리를 두어 보세요.',
  },
  {
    id: 'tada_caravan_trust',
    amazighTerm: 'Tada (카라반의 신의와 환대)',
    koreanLabel: '신뢰로 건네는 동행',
    coreInsight: '넓은 사막에서는 혼자 버티는 것보다 믿을 수 있는 동료와 짐을 나누어 지는 편이 훨씬 멀리 갑니다.',
    desertPractice: '혼자 끙끙 앓던 일 중 믿을 만한 사람에게 조언이나 도움을 청할 수 있는 한 가지를 꺼내 보세요.',
  },
] as const;

function formatAmazighKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateAmazighDesertStarOasis(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AmazighDesertResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();

  const seed = stableHash(
    [
      params.profile.basic?.name ?? '',
      JSON.stringify(params.profile.fate ?? {}),
      query,
    ].join('|')
  );

  const primaryIdx = seed % AMAZIGH_WAYPOINTS.length;
  const supportIdx = (primaryIdx + 1) % AMAZIGH_WAYPOINTS.length;

  const primaryWaypoint = AMAZIGH_WAYPOINTS[primaryIdx];
  const supportWaypoint = AMAZIGH_WAYPOINTS[supportIdx];

  const qualitativeSynthesis =
    `북아프리카 아마지그(베르베르) 사막 유목의 지혜로 바라보면, 지금 여정에는 ` +
    `‘${primaryWaypoint.amazighTerm} — ${primaryWaypoint.koreanLabel}’의 표지가 선명합니다. ` +
    `${primaryWaypoint.coreInsight} 여기에 ‘${supportWaypoint.koreanLabel}’이 뒤를 받쳐 주어, ` +
    `조급한 질주 대신 호흡을 지키며 끝까지 건너갈 수 있는 흐름입니다.`;

  const reflectionFocus =
    `${primaryWaypoint.koreanLabel}을 기준으로 에너지와 경계를 지키는 ${supportWaypoint.koreanLabel} 정렬 시점`;

  const ritualAction = primaryWaypoint.desertPractice;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’이라는 사막 구간을 건너는 지금, 속도보다 먼저 챙겨야 할 나만의 ‘오아시스 비축’은 무엇인가요?`
    : `오늘 나를 지치게 하는 모래바람을 잠시 가리고, 내 안의 중심을 지킬 수 있는 작은 경계 하나는 무엇일까요?`;

  return {
    engineName: '아마지그 사막 별·오아시스 길잡이 (Amazigh Desert Compass)',
    engineVersion: 'LUCKEY-AMAZIGH-DESERT-v2.1.0',
    calculatedAtKst: formatAmazighKstTimestamp(now),
    primaryWaypoint,
    supportWaypoint,
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
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 주된 길잡이: ${res.primaryWaypoint.amazighTerm} · ${res.primaryWaypoint.koreanLabel}`,
    `- 보조 길잡이: ${res.supportWaypoint.amazighTerm} · ${res.supportWaypoint.koreanLabel}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
