import type { UserProfile } from '../sharedState';

export interface MarshalleseChartResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '항법·감각' | '분기점·균형' | '현재·리듬' | '스틱 차트 전반';
  reflectionFocus: string;
  symbolicMotif: string;
  companionMotif: string;
  swellChartAxis: string;
  ritualAction: string;
  shadowWarning: string;
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
  return `${yyyy}-${mm}-${dd} ${hh}:${mi} +09:00 (KST)`;
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
  '아직 오지 않은 수평선 너머를 걱정하기보다 지금 내 발밑을 지나가는 현재의 물결 리듬에만 집중해 보세요.',
  '파도가 반대편에서 밀려올 때는 정면으로 맞서기보다 카누의 각도를 살짝 틀어 힘을 흘려보내 보세요.',
  '어두워서 앞이 잘 안 보일수록 시야보다 손끝과 발끝에 닿는 실제 감각을 믿고 한 걸음만 내디뎌 보세요.'
];

const MARSHALLESE_QUESTIONS = [
  '지금 내 발밑을 스치는 가장 조용한 신호는 어느 방향의 섬을 가리키고 있나요?',
  '서로 다른 두 흐름이 만나는 분기점에서 내가 고요히 뱃머리를 맞출 기준선은 무엇인가요?',
  '수평선 너머의 결론을 미리 그리는 대신 지금 배 밑을 스치는 리듬에서 무엇을 읽을 수 있나요?',
  '정면으로 맞서며 힘을 빼기보다 카누의 균형대처럼 각도를 틀어 흘려보내야 할 흔들림은 무엇인가요?',
  '눈에 당장 보이지 않아도 내 감각이 이미 섬이 가까워졌음을 알아차리고 있는 신호는 무엇인가요?'
];

const MARSHALLESE_SHADOWS = [
  '손끝의 미세한 너울 감각에만 의존하다가, 정작 객관적인 기록이나 주변의 명확한 안내를 확인하는 절차를 건너뛰지 않도록 하세요.',
  '물결이 만나는 분기점에서 각도를 잡느라 오래 머뭇거리면, 결국 노를 저어 지나가야 할 물살의 탄력을 잃을 수 있습니다.',
  '먼 수평선을 미리 그리지 않는 여유가 좋지만, 최소한의 목적지와 항해 준비물 점검까지 비워 두지는 마세요.',
  '파도의 힘을 흘려보내는 탄력이 지나치면, 내가 반드시 책임을 지고 맞서야 할 선택까지 부드럽게 회피하게 될 수 있습니다.',
  '어둠 속 직감의 신호를 믿는 동시에, 밝은 곳에서 다시 확인해야 할 현실의 수치와 사실도 함께 챙기세요.',
];

function classifyMarshalleseTopic(q: string): MarshalleseChartResult['questionTopic'] {
  if (/감각|흐름|신호|너울|보이지/.test(q)) return '항법·감각';
  if (/분기점|균형|각도|중심|기준/.test(q)) return '분기점·균형';
  if (/현재|리듬|물결|오늘|지금/.test(q)) return '현재·리듬';
  return '스틱 차트 전반';
}

export function calculateMarshalleseStickChart(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): MarshalleseChartResult {
  const { profile, now = new Date(), question = '' } = params;
  const q = question.trim();
  const questionTopic = classifyMarshalleseTopic(q);
  const seed = `${JSON.stringify(profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const hash = stableHash(seed);
  const idx = hash % MARSHALLESE_MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MARSHALLESE_MOTIFS.length - 1));

  const motif = MARSHALLESE_MOTIFS[idx];
  const companionMotif = MARSHALLESE_MOTIFS[(idx + companionOffset) % MARSHALLESE_MOTIFS.length];
  const swellChartAxis = `${motif.split('(')[0].trim()} ↔ ${companionMotif.split('(')[0].trim()} (${questionTopic})`;
  const ritualAction = MARSHALLESE_ACTIONS[idx];
  const reflectiveQuestion = MARSHALLESE_QUESTIONS[idx];

  return {
    engineVersion: 'LUCKEY-MARSHALLESE-CHART-v2.3.0',
    calculatedAtKst: getKstTimeString(now),
    questionTopic,
    reflectionFocus: q
      ? `질문 "${q}" 속에서 보이지 않는 흐름의 결을 읽는 스틱 차트 항법 관점 (동반 결: ${companionMotif.slice(0, 24)}…)`
      : '복잡한 바다 위에서 물결의 꺾임만으로 중심을 찾는 스틱 차트 항법 관점',
    symbolicMotif: motif,
    companionMotif,
    swellChartAxis,
    ritualAction,
    shadowWarning: MARSHALLESE_SHADOWS[idx],
    reflectiveQuestion,
    interpretiveBoundary:
      '마셜 제도 막대 해도 항법의 상징적 비유로, 개인 점수·성격 진단·미래 예측이 아닙니다.'
  };
}

export function formatMarshalleseChartPrompt(result: MarshalleseChartResult): string {
  return [
    `[마셜 제도·막대 해도 항법 관점 (${result.engineVersion})]`,
    `- 기준 시각: ${result.calculatedAtKst}`,
    `- 질문 맥락: ${result.questionTopic} | 너울 항법 축: ${result.swellChartAxis}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 상징 모티프: ${result.symbolicMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 제안 의식: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 경계: ${result.interpretiveBoundary}`
  ].join('\n');
}
