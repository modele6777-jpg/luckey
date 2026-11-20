import type { UserProfile } from '../sharedState';

export interface KyrgyzManasResult {
  engineVersion: string;
  calculatedAtKst: string;
  epicChapter: string;
  nomadInsight: string;
  steppeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CHAPTERS = [
  { chapter: '알라토(Ala-Too) 설산의 첫 걸음', insight: '거대한 목표 앞에서 주저앉지 않고 오늘 넘을 작은 고개 하나에만 집중하는 용기', tone: '천산산맥 눈봉우리의 맑은 바람' },
  { chapter: '보즈 위(Boz Üy) 유르트의 둥근 천창(Tündük)', insight: '사방이 트인 초원에서도 중심 기둥을 잃지 않고 내 마음의 안식처를 세우는 힘', tone: '유르트 천창으로 들어오는 아침 빛' },
  { chapter: '마나스치(Manaschi)의 길고 꾸준한 호흡', insight: '단거리 전력 질주보다 내 호흡과 이야기를 끝까지 이어 가는 리듬의 지혜', tone: '밤 모닥불 앞 구연가의 낮고 깊은 목소리' },
  { chapter: '초르(Choor) 피리의 맑은 결속', insight: '혼자 버티려 애쓰기보다 내 곁의 동료와 진심을 맞추어 부르는 화음', tone: '이식쿨 호수 위로 번지는 잔잔한 선율' },
  { chapter: '초원의 넓은 길(Jol) 선택', insight: '좁은 골목에서 부딪히기보다 시야를 열어 더 넓은 우회로를 찾는 유연함', tone: '끝없이 펼쳐진 초원의 지평선' },
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

export function calculateKyrgyzManasOralEpicCourage(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KyrgyzManasResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CHAPTERS.length;
  const picked = CHAPTERS[idx];

  return {
    engineVersion: 'LUCKEY-KYRGYZ-MANAS-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    epicChapter: picked.chapter,
    nomadInsight: picked.insight,
    steppeTone: picked.tone,
    reflectionFocus: `마나스 서사시의 '${picked.chapter}'처럼, 한 번에 다 끝내려 하지 말고 오늘 몫의 걸음만 당당히 내디뎌 보세요.`,
    ritualAction: '오늘 해야 할 일 중 가장 미뤄 두었던 한 가지를 딱 10분만 손대어 시작해 보세요.',
    reflectiveQuestion: '지금 나를 망설이게 하는 큰 산 앞에서, 오늘 내가 실제로 디딜 수 있는 첫 발걸음은 무엇인가요?',
    interpretiveBoundary: '중앙아시아 키르기스 《마나스》 구전 서사시와 유목 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKyrgyzManasPrompt(res: KyrgyzManasResult): string {
  return [
    `[키르기스 마나스 서사시 용기 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 서사 장면: ${res.epicChapter} (${res.steppeTone})`,
    `- 중심 통찰: ${res.nomadInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
