import type { UserProfile } from '../sharedState';

export type PhoenicianStarBeaconId =
  | 'kokab_north_anchor'
  | 'melqart_open_sea'
  | 'ashtart_harbor_wind'
  | 'tanit_horizon_watch';

export interface PhoenicianStarBeacon {
  id: PhoenicianStarBeaconId;
  beaconTitle: string;
  navigationRole: string;
  coreMeaning: string;
  voyagePractice: string;
}

export interface PhoenicianNavigatorResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '기준·결정' | '개척·실행' | '보급·정비' | '관찰·장기' | '항해 전반';
  primaryBeacon: PhoenicianStarBeacon;
  backupBeacon: PhoenicianStarBeacon;
  starCompassAxis: string;
  seaStateMetaphor: string;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const PHOENICIAN_BEACONS: readonly PhoenicianStarBeacon[] = [
  {
    id: 'kokab_north_anchor',
    beaconTitle: '페니키아의 별(작은곰자리 북극성)',
    navigationRole: '변하지 않는 방향 기준점',
    coreMeaning: '파도와 안개가 시야를 가릴 때에도 항로를 잃지 않게 해 주는 단 하나의 변함없는 원칙입니다.',
    voyagePractice: '지금 고민 중인 선택들 가운데 ‘절대 타협하지 않을 기준 한 가지’를 먼저 종이에 적어 보세요.',
  },
  {
    id: 'melqart_open_sea',
    beaconTitle: '멜카르트(원양 개척의 닻)',
    navigationRole: '익숙한 해안을 떠나는 결단',
    coreMeaning: '안전한 연안에만 머무르지 않고 낯선 수평선 너머로 항로를 넓히는 담대한 실행력입니다.',
    voyagePractice: '오래 망설이던 새로운 시도 하나를 위해 오늘 가장 작은 첫 실행(예약·문의·초안)을 마쳐 보세요.',
  },
  {
    id: 'ashtart_harbor_wind',
    beaconTitle: '아슈타르트(순풍과 항구)',
    navigationRole: '보급과 항로 재정비',
    coreMeaning: '무리하게 역풍을 뚫기보다 항구에서 돛을 손보고 순풍의 때를 읽으며 동료를 챙기는 지혜입니다.',
    voyagePractice: '속도를 내기 전에 현재 자원(체력·시간·예산)이 충분한지 5분만 점검해 보세요.',
  },
  {
    id: 'tanit_horizon_watch',
    beaconTitle: '타니트(수평선 망대)',
    navigationRole: '먼 징조를 읽는 관찰력',
    coreMeaning: '당장의 파도 높이에 일희일비하지 않고 구름과 해류의 큰 변화를 먼저 읽는 통찰입니다.',
    voyagePractice: '단기 결과에 흔들리기보다 3개월 뒤에도 의미가 남을 선택인지 한 걸음 물러서서 바라보세요.',
  },
] as const;

const SEA_STATES: readonly string[] = [
  '잔잔한 새벽 바다 — 방향만 정확하면 조용히 멀리 나아가기 좋은 물결',
  '교차 해류 구간 — 속도를 줄이고 북극성 기준점을 다시 확인해야 하는 물결',
  '순풍이 불어오는 외해 — 망설임을 접고 돛을 올려 추진력을 얻기 좋은 물결',
];

function formatPhoenicianKstTimestamp(now: Date): string {
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

const PHOENICIAN_SHADOWS: readonly string[] = [
  '북극성 기준점을 붙드는 완고함이 바뀐 해류와 암초 앞에서도 항로를 미세 조정하지 않는 고집이 되지 않게 유연성을 열어 두세요.',
  '원양으로 나아가는 담대한 실행력이 보급선과 선원들의 체력 상태를 살피지 않고 무작정 닻부터 올리는 무모함이 되어서는 안 됩니다.',
  '항구에서 돛을 손보고 때를 살피는 신중함이 순풍이 이미 불어온 뒤에도 완벽한 준비를 핑계로 출항을 미루는 망설임이 되지 않게 하세요.',
  '먼 수평선의 징조를 읽는 장기적 관찰에 몰두하다가 정작 오늘 뱃머리에 들이치는 작은 파도와 당장의 실행을 놓치지 않도록 살피세요.',
];

function classifyPhoenicianTopic(q: string): PhoenicianNavigatorResult['questionTopic'] {
  if (/기준|결정|방향|원칙/.test(q)) return '기준·결정';
  if (/개척|실행|시작|도전/.test(q)) return '개척·실행';
  if (/보급|정비|체력|휴식/.test(q)) return '보급·정비';
  if (/장기|미래|관찰|큰/.test(q)) return '관찰·장기';
  return '항해 전반';
}

export function calculatePhoenicianNavigatorStarCompass(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PhoenicianNavigatorResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();
  const questionTopic = classifyPhoenicianTopic(query);

  const seedInput = [
    params.profile.basic?.name ?? '',
    JSON.stringify(params.profile.fate ?? {}),
    query,
    now.toISOString().slice(0, 13),
  ].join('|');
  const seed = stableHash(seedInput);

  const primaryIdx = seed % PHOENICIAN_BEACONS.length;
  const backupOffset = 1 + (stableHash(`${seedInput}|companion`) % (PHOENICIAN_BEACONS.length - 1));
  const backupIdx = (primaryIdx + backupOffset) % PHOENICIAN_BEACONS.length;
  const seaStateMetaphor = SEA_STATES[stableHash(`${seedInput}|sea`) % SEA_STATES.length];

  const primaryBeacon = PHOENICIAN_BEACONS[primaryIdx];
  const backupBeacon = PHOENICIAN_BEACONS[backupIdx];
  const starCompassAxis = `${primaryBeacon.beaconTitle.split('(')[0].trim()} ↔ ${backupBeacon.beaconTitle.split('(')[0].trim()} (${questionTopic})`;

  const qualitativeSynthesis =
    `고대 지중해 페니키아 항해사들의 별자리 나침반으로 비추어 보면, 지금 항해의 중심에는 ` +
    `‘${primaryBeacon.beaconTitle} — ${primaryBeacon.navigationRole}’이 떠 있습니다. ` +
    `${primaryBeacon.coreMeaning} 여기에 ‘${backupBeacon.beaconTitle}’이 보조 표지로 ` +
    `자리해 ‘${seaStateMetaphor}’ 속에서 방향을 잃지 않도록 도와줍니다.`;

  const reflectionFocus =
    `${primaryBeacon.navigationRole}을 기준 삼아 ${backupBeacon.navigationRole}까지 함께 점검하는 항로 정렬 시점`;

  const ritualAction = primaryBeacon.voyagePractice;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’이라는 항로에서 ‘${primaryBeacon.beaconTitle}’을 중심에 두고 ‘${backupBeacon.beaconTitle}’까지 살피며 끝까지 지켜 갈 기준은 무엇인가요?`
    : `지금 내 삶의 항해에서 ‘${primaryBeacon.navigationRole}’을 지키기 위해 먼저 닻을 내리거나 방향을 맞춰야 할 지점은 어디인가요?`;

  return {
    engineName: '고대 페니키아 항해 별자리 나침반 (Phoenician Star Compass)',
    engineVersion: 'LUCKEY-PHOENICIAN-NAVIGATOR-v2.3.0',
    calculatedAtKst: formatPhoenicianKstTimestamp(now),
    questionTopic,
    primaryBeacon,
    backupBeacon,
    starCompassAxis,
    seaStateMetaphor,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    shadowWarning: PHOENICIAN_SHADOWS[primaryIdx],
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 고대 페니키아 항해술의 북극성 항법 상징을 빌려 온 의사결정·성찰 프레임워크이며, 확률적 예측이나 수치적 운세 점수가 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatPhoenicianNavigatorPrompt(res: PhoenicianNavigatorResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 별 나침반 축: ${res.starCompassAxis}`,
    `- 주된 별자리 표지: ${res.primaryBeacon.beaconTitle} (${res.primaryBeacon.navigationRole})`,
    `- 보조 항로 표지: ${res.backupBeacon.beaconTitle} (${res.backupBeacon.navigationRole})`,
    `- 바다의 흐름: ${res.seaStateMetaphor}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
