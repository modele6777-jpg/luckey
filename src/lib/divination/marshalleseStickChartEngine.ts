import type { UserProfile } from '../sharedState';

export interface MarshalleseChartResult {
  engineVersion: string;
  calculatedAtKst: string;
  reflectionFocus: string;
  symbolicMotif: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function getKstTimeString(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const MARSHALLESE_MOTIFS = [
  '야자수 잎맥을 엮어 만든 마토 스틱 차트(Mattang/Rebbelib)처럼 눈에 보이지 않는 너울의 꺾임을 손끝으로 기억하는 항법',
  '섬과 섬 사이에서 서로 다른 방향의 물결이 만나는 지점(Boon)을 읽어 뱃머리의 각도를 고요히 잡는 항해사의 감각',
  '거친 망망대해에서도 수평선 너머의 섬을 미리 그리지 않고 지금 배 밑을 스치는 물결의 리듬에만 귀 기울이는 여유',
  '카누의 균형대(Outrigger)가 파도의 힘을 흘려보내듯 외부의 흔들림을 억지로 막지 않고 선체의 중심을 지키는 탄력',
  '해가 진 뒤에도 발바닥에 전해지는 미세한 파동만으로 섬이 가까워졌음을 알아차리는 묵묵한 현존감'
];

const MARSHALLESE_ACTIONS = [
  '머릿속으로 먼 결론부터 계산하기보다 지금 내 앞에서 꺾이는 첫 번째 흐름 하나만 차분히 짚어 보세요.',
  '모든 변수를 한눈에 다 통제하려 들지 말고, 손끝에 닿는 가장 분명한 기준선 하나만 쥐고 방향을 정해 보세요.',
  '파도가 반대편에서 밀려올 때는 정면으로 맞서기보다 카누의 각도를 살짝 틀어 힘을 흘려보내 보세요.'
];

export function calculateMarshalleseStickChart(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MarshalleseChartResult {
  const { profile, now = new Date(), question = '' } = params;
  const seed = `${JSON.stringify(profile.fate ?? {})}|${question.trim()}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);

  const motif = MARSHALLESE_MOTIFS[hash % MARSHALLESE_MOTIFS.length];
  const ritualAction = MARSHALLESE_ACTIONS[Math.floor(hash / 7) % MARSHALLESE_ACTIONS.length];

  return {
    engineVersion: 'LUCKEY-MARSHALLESE-CHART-v2.1.0',
    calculatedAtKst: getKstTimeString(now),
    reflectionFocus: question.trim()
      ? `질문 "${question.trim()}" 속에서 보이지 않는 흐름의 결을 읽는 스틱 차트 항법 관점`
      : '복잡한 바다 위에서 물결의 꺾임만으로 중심을 찾는 스틱 차트 항법 관점',
    symbolicMotif: motif,
    ritualAction,
    reflectiveQuestion: '지금 내 발밑을 스치는 가장 조용한 신호는 어느 방향의 섬을 가리키고 있나요?',
    interpretiveBoundary:
      '마셜 제도 막대 해도 항법의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatMarshalleseChartPrompt(result: MarshalleseChartResult): string {
  return [
    `[마셜 제도·막대 해도 항법 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
