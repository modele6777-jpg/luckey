import type { UserProfile } from '../sharedState';

export interface TuvanKhoomeiResult {
  engineVersion: string;
  calculatedAtKst: string;
  overtoneLayer: string;
  steppeInsight: string;
  soundTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LAYERS = [
  { layer: '후메이(Khoomei · 깊은 숨에서 피어나는 배음)', insight: '겉으로 드러난 한 가지 말 뒤에 숨은 내 마음의 진짜 겹을 차분히 들어주는 집중', tone: '타이가 숲과 초원이 만나는 언덕의 깊은 바람 소리' },
  { layer: '시깃(Sygyt · 맑게 뻗어 나가는 휘파람 배음)', insight: '수많은 잡음 속에서도 지금 내가 가장 선명하게 전하고 싶은 핵심 한 가지를 가려내는 힘', tone: '예니세이 강 상류 계곡을 스치는 수정처럼 맑은 아침 공기' },
  { layer: '카르기라(Kargyraa · 땅을 울리는 깊은 저음)', insight: '마음이 들뜨고 흔들릴수록 발바닥과 호흡을 단단히 땅에 붙이며 중심을 잡는 안정감', tone: '해 질 녘 게르 바깥 초원을 울리는 먼 말발굽 소리' },
  { layer: '오바(Ovaa · 길목의 돌무덤에 바치는 감사)', insight: '다음 고개로 넘어가기 전에 지금까지 무사히 건너온 작은 발걸음들을 먼저 인정해 주는 여유', tone: '고개 마루 푸른 천(Chalama)을 흔드는 시원한 산바람' },
  { layer: '이기르(Igil · 두 줄 현이 맞추는 공명)', insight: '서로 다른 생각이나 역할이 충돌하지 않고 하나의 화음으로 울리도록 조율하는 감각', tone: '밤하늘 은하수 아래 맑게 울려 퍼지는 두 줄 마두금 소리' },
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

export function calculateTuvanKhoomeiOvertonesResonance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): TuvanKhoomeiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % LAYERS.length;
  const picked = LAYERS[idx];

  return {
    engineVersion: 'LUCKEY-TUVAN-KHOOMEI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    overtoneLayer: picked.layer,
    steppeInsight: picked.insight,
    soundTone: picked.tone,
    reflectionFocus: `시베리아 투바 후메이의 '${picked.layer}'처럼, 겉으로 흩어지는 소음을 줄이고 내 안의 진짜 울림에 귀를 기울여 보세요.`,
    ritualAction: '오늘 해야 할 일 중 가장 중요한 핵심 하나만 남기고 나머지 자잘한 걱정은 잠시 종이에 적어 내려놓아 보세요.',
    reflectiveQuestion: '여러 생각들이 겹쳐 들리는 지금, 그중에서 가장 맑고 분명하게 내 마음이 가리키는 한 소리는 무엇인가요?',
    interpretiveBoundary: '시베리아 투바 전통의 후메이(Khoomei) 배음과 자연 공명 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatTuvanKhoomeiPrompt(res: TuvanKhoomeiResult): string {
  return [
    `[투바 후메이 배음 공명 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 배음 층위: ${res.overtoneLayer} (${res.soundTone})`,
    `- 중심 통찰: ${res.steppeInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
