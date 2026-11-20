import type { UserProfile } from '../sharedState';

export interface SardinianNuragheResult {
  engineVersion: string;
  calculatedAtKst: string;
  nuragheStone: string;
  sardinianInsight: string;
  mediterraneanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STONES = [
  { stone: '누라게(Nuraghe · 모르타르 없이 무게로 맞물린 돌탑)', insight: '억지스러운 접착이나 꾸밈이 없어도 서로의 무게와 자리를 정확히 지킬 때 세워지는 견고함', tone: '사르데냐 올리브 언덕 위에 수천 년째 서 있는 현무암 석탑' },
  { stone: '칸투 아 테노레(Cantu a Tenore · 네 목소리가 만드는 깊은 화음)', insight: '나 혼자 도드라지려 애쓰기보다 각자의 음역이 어우러질 때 완성되는 깊고 풍성한 울림', tone: '지중해 저녁 바람을 타고 들려오는 낮고 묵직한 다성 화음' },
  { stone: '수 포지(Su Pozzo · 땅속 깊은 성스러운 우물)', insight: '외부의 시선이 닿지 않는 고요한 내면의 우물 속에 가장 맑은 해답이 이미 고여 있음', tone: '돌계단 아래로 은은한 햇빛이 스며드는 고대 석조 우물' },
  { stone: '젠타(Genta · 대지의 시간을 재촉하지 않는 목동의 걸음)', insight: '초조함에 쫓겨 서두르기보다 계절과 양 떼의 자연스러운 흐름을 기다릴 줄 아는 여유', tone: '타임과 로즈마리 향기가 퍼지는 사르데냐의 나른한 오후 언덕' },
  { stone: '도무스 데 야나스(Domus de Janas · 바위 속에 새긴 고요한 방)', insight: '세상의 소음을 잠시 닫고 나 혼자만의 고요한 방으로 물러날 때 되찾는 마음의 평화', tone: '바위 그늘 아래 시원하고 아늑한 지중해의 작은 석실' },
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

export function calculateSardinianNuragheStoneCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SardinianNuragheResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % STONES.length;
  const picked = STONES[idx];

  return {
    engineVersion: 'LUCKEY-SARDINIAN-NURAGHE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    nuragheStone: picked.stone,
    sardinianInsight: picked.insight,
    mediterraneanTone: picked.tone,
    reflectionFocus: `사르데냐 누라게 거석 문화의 '${picked.stone}'처럼, 억지로 붙잡아 두려 하지 않아도 제자리에 맞물리는 고요한 균형을 믿어 보세요.`,
    ritualAction: '오늘 5분 동안은 화면과 알림을 내려놓고 아무 소리도 없는 고요한 여백을 온전히 누려 보세요.',
    reflectiveQuestion: '억지스러운 노력이나 꾸밈을 내려놓고도 자연스럽게 제자리에 서 있을 수 있는 나의 중심은 무엇인가요?',
    interpretiveBoundary: '지중해 사르데냐(Sardinia) 누라게 거석 탑과 고요한 공동체 화음 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSardinianNuraghePrompt(res: SardinianNuragheResult): string {
  return [
    `[사르데냐 누라게·고요한 돌탑 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 누라게 상징: ${res.nuragheStone} (${res.mediterraneanTone})`,
    `- 중심 통찰: ${res.sardinianInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
