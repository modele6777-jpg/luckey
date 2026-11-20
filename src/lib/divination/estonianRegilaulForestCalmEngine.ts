import type { UserProfile } from '../sharedState';

export interface EstonianRegilaulResult {
  engineVersion: string;
  calculatedAtKst: string;
  forestMotif: string;
  regilaulInsight: string;
  nordicForestTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '히이스(Hiis · 말없이 숨을 고르게 해 주는 성스러운 숲)', insight: '억지로 답을 쥐어짜기보다 자연의 정적 속에 잠시 머물면 마음이 스스로 정돈됨', tone: '에스토니아 라헤마 숲의 이끼 낀 바위와 소나무 사이로 스며드는 서늘한 안개' },
  { motif: '레기라울(Regilaul · 같은 선율을 천천히 되풀이하며 깊어지는 노래)', insight: '화려한 변주보다 매일 반복하는 작은 루틴이 결국 나를 가장 멀리 데려다줌', tone: '여럿이 나지막한 화음으로 이어 부르며 마음을 맞추는 밤의 합창' },
  { motif: '라바(Raba · 발밑을 조심히 살피며 건너는 습지 숲길)', insight: '빠르게 내달리기보다 지금 내 디딤돌이 단단한지 한 걸음씩 확인하는 신중함이 안전함', tone: '새벽 이슬이 맺힌 붉은 이탄 습지 위로 놓인 소박한 나무 데크 길' },
  { motif: '백야의 황혼(Valged Ööd · 어둠과 빛이 부드럽게 맞닿는 긴 저녁)', insight: '모든 것을 흑백으로 급히 가르기보다 애매한 시간도 그대로 품고 지나가는 여유', tone: '자정이 가까워도 서쪽 하늘에 은은하게 남아 있는 북유럽 여름의 푸른 빛' },
  { motif: '사우나와 자작나무(Leil · 묵은 피로를 씻어 내고 가벼워지는 쉼)', insight: '새로운 일을 시작하기 전에 오늘 쌓인 긴장과 피로를 먼저 비워 내야 다음 날이 맑음', tone: '호숫가 통나무 사우나에서 피어오르는 상쾌한 자작나무 잎 향기' },
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

export function calculateEstonianRegilaulForestCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): EstonianRegilaulResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-ESTONIAN-REGILAUL-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    forestMotif: picked.motif,
    regilaulInsight: picked.insight,
    nordicForestTone: picked.tone,
    reflectionFocus: `에스토니아 레기라울·숲 지혜의 '${picked.motif}'처럼, 복잡한 변주보다 오늘 내가 지킬 소박한 리듬과 쉼의 여백을 먼저 챙겨 보세요.`,
    ritualAction: '오늘 잠들기 전, 하루 동안 쌓인 긴장을 가볍게 씻어 내는 나만의 작은 마무리 루틴을 10분간 지켜 보세요.',
    reflectiveQuestion: '지금 내가 급하게 답을 내리려 애쓰기보다, 숲의 정적 속에서 잠시 익어가도록 두어야 할 생각은 무엇인가요?',
    interpretiveBoundary: '에스토니아의 레기라울(Regilaul) 구전 가요·히이스(Hiis) 숲 성찰 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatEstonianRegilaulPrompt(res: EstonianRegilaulResult): string {
  return [
    `[에스토니아 레기라울·숲의 정적 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 북방 상징: ${res.forestMotif} (${res.nordicForestTone})`,
    `- 중심 통찰: ${res.regilaulInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
