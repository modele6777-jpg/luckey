import type { UserProfile } from '../sharedState';

export interface NaxiDongbaResult {
  engineVersion: string;
  calculatedAtKst: string;
  scriptMotif: string;
  companionMotif: string;
  chimeResonance: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export interface NaxiDongbaInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

const MOTIFS = [
  '설산 아래 맑은 물길을 품은 그림 문자',
  '자연과 사람의 화해를 노래하는 동파 경전',
  '옥룡설산 바람에 흔들리는 작은 풍경',
  '복잡한 뜻을 단순한 선으로 빚어낸 상형 기록',
] as const;

const RESONANCES = [
  '복잡한 생각도 그림 한 장처럼 단순하게 짚어 보면 핵심이 또렷해집니다.',
  '내 욕심과 자연의 흐름이 맞닿는 자리에서 다툼이 잦아듭니다.',
  '작은 바람종 소리처럼 한 번의 멈춤이 하루의 결을 부드럽게 바꿉니다.',
  '말로 다 풀리지 않는 마음은 이미지나 짧은 기록으로 옮길 때 숨통이 트입니다.',
] as const;

const ACTIONS = [
  '머릿속 고민을 세 단어 이내의 그림이나 키워드로 요약해 보기',
  '창문을 열어 바깥 공기와 소리를 1분간 조용히 느끼기',
  '미루던 대화에서 상대의 입장을 한 문장으로 먼저 적어 보기',
  '오늘 해야 할 일 중 가장 자연스러운 순서대로 첫 단계만 시작하기',
] as const;

const QUESTIONS = [
  '지금 내 고민을 한 장의 단순한 그림으로 그린다면 무엇이 가장 크게 보일까요?',
  '내 계획과 주변의 흐름이 부딪히는 지점은 어디인가요?',
  '말을 줄이고 조용히 귀 기울여야 할 신호가 있다면 무엇일까요?',
  '자연스럽게 흐르도록 맡겨 둘 일과 내가 손댈 일의 경계는 어디인가요?',
] as const;

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateNaxiDongbaChime(input: NaxiDongbaInput): NaxiDongbaResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const motifIdx = seed % MOTIFS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (MOTIFS.length - 1));
  const scriptMotif = MOTIFS[motifIdx];
  const companionMotif = MOTIFS[(motifIdx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-NAXI-DONGBA-v2.2.0',
    calculatedAtKst: toKstIso(input.now),
    scriptMotif,
    companionMotif,
    chimeResonance: RESONANCES[(seed >>> 3) % RESONANCES.length],
    reflectionFocus: `윈난 리장의 나시족 동파 문자처럼 주 모티프('${scriptMotif}')와 동반 모티프('${companionMotif}')가 어우러져 살아 있는 상형 기호로 자연과 사람의 조화를 짚고 마음의 풍경을 단순화하는 상징적 관점입니다.`,
    ritualAction: ACTIONS[motifIdx],
    reflectiveQuestion: QUESTIONS[motifIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatNaxiDongbaPrompt(res: NaxiDongbaResult): string {
  return [
    `[나시·동파 상형문자 바람종 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `문자 모티프: ${res.scriptMotif}`,
    `동반 모티프: ${res.companionMotif}`,
    `울림: ${res.chimeResonance}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
