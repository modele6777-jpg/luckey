import type { UserProfile } from '../sharedState';

export interface EstonianRegilaulResult {
  engineVersion: string;
  calculatedAtKst: string;
  forestMotif: string;
  companionMotif: string;
  regilaulInsight: string;
  nordicForestTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '히이스(Hiis · 말없이 숨을 고르게 해 주는 성스러운 숲)',
    insight: '억지로 답을 쥐어짜기보다 자연의 정적 속에 잠시 머물면 마음이 스스로 정돈됨',
    tone: '에스토니아 라헤마 숲의 이끼 낀 바위와 소나무 사이로 스며드는 서늘한 안개',
    ritual: '오늘 답이 안 나오는 고민 앞에서 5분만 창밖이나 나무를 보며 말없이 숨을 고르세요.',
    question: '지금 내가 급하게 답을 내리려 애쓰기보다, 숲의 정적 속에서 잠시 익어가도록 두어야 할 생각은 무엇인가요?',
  },
  {
    motif: '레기라울(Regilaul · 같은 선율을 천천히 되풀이하며 깊어지는 노래)',
    insight: '화려한 변주보다 매일 반복하는 작은 루틴이 결국 나를 가장 멀리 데려다줌',
    tone: '여럿이 나지막한 화음으로 이어 부르며 마음을 맞추는 밤의 합창',
    ritual: '새로운 목표를 더하기보다 오늘 이미 하고 있는 소박한 루틴 한 가지를 차분히 되풀이해 보세요.',
    question: '화려한 변화 대신 내가 매일 조용히 되풀이하며 깊이를 더하고 싶은 나만의 선율은 무엇인가요?',
  },
  {
    motif: '라바(Raba · 발밑을 조심히 살피며 건너는 습지 숲길)',
    insight: '빠르게 내달리기보다 지금 내 디딤돌이 단단한지 한 걸음씩 확인하는 신중함이 안전함',
    tone: '새벽 이슬이 맺힌 붉은 이탄 습지 위로 놓인 소박한 나무 데크 길',
    ritual: '오늘 중요한 결정을 내리기 전, 지금 딛고 선 조건이 안전한지 한 걸음씩 체크리스트로 확인하세요.',
    question: '속도를 내기 전에 지금 내 발밑의 디딤돌이 단단한지 먼저 확인해 볼 부분은 어디인가요?',
  },
  {
    motif: '백야의 황혼(Valged Ööd · 어둠과 빛이 부드럽게 맞닿는 긴 저녁)',
    insight: '모든 것을 흑백으로 급히 가르기보다 애매한 시간도 그대로 품고 지나가는 여유',
    tone: '자정이 가까워도 서쪽 하늘에 은은하게 남아 있는 북유럽 여름의 푸른 빛',
    ritual: '오늘 당장 결론이 나지 않은 일 하나를 흑백으로 재촉하지 말고 여백인 채로 하루를 넘겨 보세요.',
    question: '완전한 결론이 나지 않은 애매한 시간조차 부드럽게 품고 지나갈 수 있는 마음의 여백은 어디에 있나요?',
  },
  {
    motif: '사우나와 자작나무(Leil · 묵은 피로를 씻어 내고 가벼워지는 쉼)',
    insight: '새로운 일을 시작하기 전에 오늘 쌓인 긴장과 피로를 먼저 비워 내야 다음 날이 맑음',
    tone: '호숫가 통나무 사우나에서 피어오르는 상쾌한 자작나무 잎 향기',
    ritual: '오늘 잠들기 전, 하루 동안 쌓인 긴장을 가볍게 씻어 내는 나만의 작은 마무리 루틴을 10분간 지켜 보세요.',
    question: '새로운 일을 채우기 전에 오늘 먼저 따뜻한 물이나 휴식으로 씻어 내고 싶은 피로는 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
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
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-ESTONIAN-REGILAUL-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    forestMotif: picked.motif,
    companionMotif: companion.motif,
    regilaulInsight: picked.insight,
    nordicForestTone: picked.tone,
    reflectionFocus: `에스토니아 레기라울·숲 지혜의 '${picked.motif}'과 동반 결 '${companion.motif}'을 함께 음미하며, 복잡한 변주보다 오늘 내가 지킬 소박한 리듬과 쉼의 여백을 먼저 챙겨 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '에스토니아의 레기라울(Regilaul) 구전 가요·히이스(Hiis) 숲 성찰 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatEstonianRegilaulPrompt(res: EstonianRegilaulResult): string {
  return [
    `[에스토니아 레기라울·숲의 정적 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 북방 상징: ${res.forestMotif} (${res.nordicForestTone})`,
    `- 동반 상징: ${res.companionMotif}`,
    `- 중심 통찰: ${res.regilaulInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
