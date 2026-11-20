import type { UserProfile } from '../sharedState';

export interface UyghurKutadguResult {
  engineVersion: string;
  calculatedAtKst: string;
  biligPillar: string;
  kutadguInsight: string;
  tarimTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PILLARS = [
  { pillar: '퀸 토그드(Kün Togdı · 맑은 법도와 원칙의 정의)', insight: '기분이나 편법에 흔들리지 않고 스스로 세운 공정한 기준을 지킬 때 얻어지는 떳떳함', tone: '타림 분지 오아시스 위로 떠오르는 한 점 구름 없는 아침 해' },
  { pillar: '아이 톨드(Ay Toldı · 차고 기우는 행운의 이치)', insight: '좋은 흐름도 영원하지 않고 막힌 흐름도 고정되지 않음을 알기에 들뜨거나 꺾이지 않는 평정', tone: '사막 밤하늘에 고요히 걸린 초승달과 보름달의 순환' },
  { pillar: '외그뒬미쉬(Ögdülmiş · 분별과 배움의 지성)', insight: '말을 앞세우기 전에 사안의 앞뒤를 차분히 살피고 배우는 태도에서 나오는 실수 줄이기', tone: '카슈가르 고문서 서고에 가지런히 놓인 붓과 잉크의 향기' },
  { pillar: '오드구르미쉬(Odgurmış · 절제와 내면의 맑음)', insight: '더 많이 쥐려는 욕심을 조금 덜어낼 때 오히려 선명해지는 삶의 본질과 여백', tone: '천산산맥 만년설이 녹아 흐르는 맑고 차가운 계곡물' },
  { pillar: '아기(Agı · 나눌수록 깊어지는 선의와 관대함)', insight: '내 손에 쥔 것을 꽉 움켜쥐기보다 필요한 곳에 흘려보낼 때 더 크게 돌아오는 신뢰', tone: '실크로드 오아시스 정원에서 나그네에게 건네는 따뜻한 차 한 잔' },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
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

  return {
    engineVersion: 'LUCKEY-UYGHUR-KUTADGU-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    biligPillar: picked.pillar,
    kutadguInsight: picked.insight,
    tarimTone: picked.tone,
    reflectionFocus: `유수프 발라사구니의 《쿠타드구 빌리그》 '${picked.pillar}'처럼, 지혜는 거창한 말이 아니라 오늘의 선택에서 드러나는 절제와 분별입니다.`,
    ritualAction: '오늘 결정해야 할 일 앞에서 "이게 당장 편한 선택인가, 떳떳한 선택인가"를 딱 한 번만 먼저 물어보세요.',
    reflectiveQuestion: '지금 내가 놓치고 있는 지혜의 네 기둥(원칙·순환·분별·절제) 중 오늘 가장 보태고 싶은 한 가지는 무엇인가요?',
    interpretiveBoundary: '중앙아시아 위구르 고전 《쿠타드구 빌리그(지혜의 복락)》의 네 가지 덕목 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatUyghurKutadguPrompt(res: UyghurKutadguResult): string {
  return [
    `[위구르 쿠타드구 빌리그 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 지혜 기둥: ${res.biligPillar} (${res.tarimTone})`,
    `- 중심 통찰: ${res.kutadguInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
