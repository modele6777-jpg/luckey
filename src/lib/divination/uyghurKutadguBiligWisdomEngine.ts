import type { UserProfile } from '../sharedState';

export interface UyghurKutadguResult {
  engineVersion: string;
  calculatedAtKst: string;
  biligPillar: string;
  companionPillar: string;
  kutadguInsight: string;
  tarimTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PILLARS = [
  {
    pillar: '퀸 토그드(Kün Togdı · 맑은 법도와 원칙의 정의)',
    insight: '기분이나 편법에 흔들리지 않고 스스로 세운 공정한 기준을 지킬 때 얻어지는 떳떳함',
    tone: '타림 분지 오아시스 위로 떠오르는 한 점 구름 없는 아침 해',
    action: '오늘 결정해야 할 일 앞에서 "이게 당장 편한 선택인가, 떳떳한 선택인가"를 딱 한 번만 먼저 물어보세요.',
    question: '기분이나 편법을 내려놓고 오늘 내 기준대로 공정하고 떳떳하게 세우고 싶은 원칙은 무엇인가요?',
  },
  {
    pillar: '아이 톨드(Ay Toldı · 차고 기우는 행운의 이치)',
    insight: '좋은 흐름도 영원하지 않고 막힌 흐름도 고정되지 않음을 알기에 들뜨거나 꺾이지 않는 평정',
    tone: '사막 밤하늘에 고요히 걸린 초승달과 보름달의 순환',
    action: '들뜨거나 가라앉는 감정에 휩쓸리기 전에 오늘의 상태가 지나가는 한 위상임을 1분간 떠올려 보세요.',
    question: '차고 기우는 순환의 이치 속에서, 지금 지나치게 들뜨거나 미리 꺾이지 않고 평정심을 지키고 싶은 일은 무엇인가요?',
  },
  {
    pillar: '외그뒬미쉬(Ögdülmiş · 분별과 배움의 지성)',
    insight: '말을 앞세우기 전에 사안의 앞뒤를 차분히 살피고 배우는 태도에서 나오는 실수 줄이기',
    tone: '카슈가르 고문서 서고에 가지런히 놓인 붓과 잉크의 향기',
    action: '결론을 말하기 전에 사안의 앞뒤 맥락을 딱 3줄만 메모로 정리한 뒤 입을 열어 보세요.',
    question: '말을 앞세우기 전에 사안의 앞뒤를 차분히 살피고 배워 두면 불필요한 실수를 줄일 수 있는 영역은 어디인가요?',
  },
  {
    pillar: '오드구르미쉬(Odgurmış · 절제와 내면의 맑음)',
    insight: '더 많이 쥐려는 욕심을 조금 덜어낼 때 오히려 선명해지는 삶의 본질과 여백',
    tone: '천산산맥 만년설이 녹아 흐르는 맑고 차가운 계곡물',
    action: '오늘 해야 할 일 목록에서 욕심으로 얹어 둔 덜 중요한 항목 1개를 과감히 비워 여백을 만드세요.',
    question: '더 많이 쥐려던 욕심을 조금 덜어낼 때 오히려 더 선명하게 보일 내 삶의 본질은 무엇인가요?',
  },
  {
    pillar: '아기(Agı · 나눌수록 깊어지는 선의와 관대함)',
    insight: '내 손에 쥔 것을 꽉 움켜쥐기보다 필요한 곳에 흘려보낼 때 더 크게 돌아오는 신뢰',
    tone: '실크로드 오아시스 정원에서 나그네에게 건네는 따뜻한 차 한 잔',
    action: '오늘 내 시간이나 정보, 따뜻한 응원 한 가지를 필요한 사람에게 조건 없이 먼저 흘려보내세요.',
    question: '손에 쥔 것을 움켜쥐는 대신 필요한 곳에 기꺼이 흘려보낼 때 더 깊어질 신뢰는 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateUyghurKutadguBiligWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): UyghurKutadguResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PILLARS.length;
  const picked = PILLARS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PILLARS.length - 1));
  const companion = PILLARS[(idx + companionOffset) % PILLARS.length];

  return {
    engineVersion: 'LUCKEY-UYGHUR-KUTADGU-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    biligPillar: picked.pillar,
    companionPillar: companion.pillar,
    kutadguInsight: picked.insight,
    tarimTone: picked.tone,
    reflectionFocus: `유수프 발라사구니의 《쿠타드구 빌리그》 '${picked.pillar}'을 중심에 두고 '${companion.pillar}'의 결을 곁들여, 지혜는 거창한 말이 아니라 오늘의 선택에서 드러나는 절제와 분별입니다.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '중앙아시아 위구르 고전 《쿠타드구 빌리그(지혜의 복락)》의 네 가지 덕목 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatUyghurKutadguPrompt(res: UyghurKutadguResult): string {
  return [
    `[위구르 쿠타드구 빌리그 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 지혜 기둥: ${res.biligPillar} (${res.tarimTone})`,
    `- 동반 기둥: ${res.companionPillar}`,
    `- 중심 통찰: ${res.kutadguInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
