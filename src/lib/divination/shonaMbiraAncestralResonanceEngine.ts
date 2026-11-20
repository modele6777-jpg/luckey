import type { UserProfile } from '../sharedState';

export interface ShonaMbiraResult {
  engineVersion: string;
  calculatedAtKst: string;
  mbiraCycle: string;
  resonanceInsight: string;
  stoneTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CYCLES = [
  { cycle: '쿠샤우라(Kushaura) 첫 선율 열기', insight: '복잡한 머릿속에서 가장 먼저 들리는 순수한 마음의 한 음을 가만히 짚어 내기', tone: '호박 울림통(Deze)의 따뜻한 공명' },
  { cycle: '쿠치니라(Kutsinhira) 화답의 겹침', insight: '내 생각만 고집하지 않고 다른 사람의 반응과 어우러지며 새로운 리듬을 만들기', tone: '저녁 마당에 번지는 맑은 쇠울림' },
  { cycle: '냐마무사사(Nyamamusasa) 깊은 숲의 정적', insight: '말을 보태기 전에 잠깐의 침묵이 들려주는 진짜 속마음을 기다려 주기', tone: '그레이트 짐바브웨 석조 담장의 고요' },
  { cycle: '부라(Bira) 밤샘 성찰의 순환', insight: '반복되는 고민이 오히려 마음을 맑게 닦아 주는 리듬이 될 수 있음을 알아차리기', tone: '별빛 아래 이어지는 부드러운 박자' },
  { cycle: '차마바라(Chamavara) 엇박자의 전환', insight: '계획이 어긋난 틈에서 뜻밖의 조화와 새로운 해결책이 피어나는 순간', tone: '바람에 흔들리는 아카시아 잎새' },
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

export function calculateShonaMbiraAncestralResonance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ShonaMbiraResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CYCLES.length;
  const picked = CYCLES[idx];

  return {
    engineVersion: 'LUCKEY-SHONA-MBIRA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    mbiraCycle: picked.cycle,
    resonanceInsight: picked.insight,
    stoneTone: picked.tone,
    reflectionFocus: `음비라의 '${picked.cycle}' 선율처럼, 어긋난 마음을 억지로 고치려 하기보다 내 호흡의 리듬부터 다시 맞추어 보세요.`,
    ritualAction: '좋아하는 잔잔한 음악을 한 곡 끝까지 들으며, 어깨와 턱에 들어간 힘을 천천히 풀어 보세요.',
    reflectiveQuestion: '요즘 내 하루의 박자는 너무 빠르게 몰아치고 있나요, 아니면 나만의 고유한 리듬으로 울리고 있나요?',
    interpretiveBoundary: '짐바브웨 쇼나 음비라(Mbira) 공명과 순환 미학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatShonaMbiraPrompt(res: ShonaMbiraResult): string {
  return [
    `[쇼나 음비라 공명 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 선율 순환: ${res.mbiraCycle} (${res.stoneTone})`,
    `- 중심 통찰: ${res.resonanceInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
