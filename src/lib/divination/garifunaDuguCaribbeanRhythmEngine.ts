import type { UserProfile } from '../sharedState';

export interface GarifunaDuguResult {
  engineVersion: string;
  calculatedAtKst: string;
  caribbeanRhythm: string;
  duguInsight: string;
  coastTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const RHYTHMS = [
  { rhythm: '둥구(Dügü · 흩어진 마음과 세대를 한 마당에 모으는 화해)', insight: '마음속에 묵혀 둔 서운함과 어긋남을 외면하지 않고 정직하게 풀어낼 때 비로소 앞으로 감', tone: '카리브해의 에메랄드빛 파도가 백사장을 부드럽게 적시는 이른 아침의 해변' },
  { rhythm: '푼타(Punta · 무거운 마음을 발걸음과 박자로 털어내는 생동)', insight: '생각만 길어질 때는 몸을 가볍게 움직여 경직된 긴장을 먼저 풀어 주는 편이 빠름', tone: '야자수 그늘 아래 가로우나(Garowuna) 북소리가 경쾌하게 울려 퍼지는 저녁 마당' },
  { rhythm: '바미(Bami · 카사바를 갈아 구우며 기다리는 소박한 정성)', insight: '복잡한 조리법보다 기본 재료를 정성껏 손질해 나누는 일상이 삶을 단단히 지탱함', tone: '따뜻한 화덕 위에서 고소하게 익어 가는 카사바 빵과 바닷바람의 내음' },
  { rhythm: '와유니(Wayunagu · 앞선 이들의 지혜를 오늘의 길잡이로 부르는 기억)', insight: '내가 지금 혼자 모든 것을 처음부터 발명할 필요 없이 이미 배운 좋은 지혜를 꺼내 쓰면 됨', tone: '해 질 녘 붉은 수평선 위로 잔잔히 이어지는 항해자들의 노랫소리' },
  { rhythm: '아우아시(Auasi · 파도의 간격을 읽으며 그물을 던지는 여유)', insight: '무작정 힘을 쏟기보다 바다가 내어 주는 적절한 타이밍을 잠시 기다릴 줄 아는 감각', tone: '산호초 너머 잔잔해진 만으로 조용히 미끄러져 들어오는 작은 카누' },
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

export function calculateGarifunaDuguCaribbeanRhythm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GarifunaDuguResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % RHYTHMS.length;
  const picked = RHYTHMS[idx];

  return {
    engineVersion: 'LUCKEY-GARIFUNA-DUGU-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    caribbeanRhythm: picked.rhythm,
    duguInsight: picked.insight,
    coastTone: picked.tone,
    reflectionFocus: `가리푸나 카리브 해안 지혜의 '${picked.rhythm}'처럼, 머릿속에서만 맴도는 무거운 생각을 가벼운 움직임과 솔직한 박자로 풀어내 보세요.`,
    ritualAction: '오늘 잠시 자리에서 일어나 기지개를 켜고 가볍게 걸으며, 어깨에 얹혀 있던 불필요한 긴장을 몸 밖으로 털어내 보세요.',
    reflectiveQuestion: '지금 내가 혼자 처음부터 다 짊어지려 애쓰기보다, 이미 알고 있던 좋은 지혜나 주변의 리듬을 빌려 오면 한결 쉬워질 일은 무엇인가요?',
    interpretiveBoundary: '카리브 연안 가리푸나(Garifuna)의 둥구(Dügü) 화해·푼타(Punta) 생동 리듬을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGarifunaDuguPrompt(res: GarifunaDuguResult): string {
  return [
    `[가리푸나 둥구·카리브 해안 리듬 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 해안 리듬: ${res.caribbeanRhythm} (${res.coastTone})`,
    `- 중심 통찰: ${res.duguInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
