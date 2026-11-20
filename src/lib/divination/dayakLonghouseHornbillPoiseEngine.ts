import type { UserProfile } from '../sharedState';

export interface DayakHornbillResult {
  engineVersion: string;
  calculatedAtKst: string;
  dayakMotif: string;
  companionMotif: string;
  dayakInsight: string;
  riverTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '코뿔새의 높은 둥지(Hornbill Canopy · 울창한 수관 위에서 숲 전체의 바람과 열매를 내다봄)',
    insight: '당장의 나무 한 그루에 매달리기보다, 숲 전체의 계절과 흐름을 한 번 올려다보면 마음이 가벼워짐',
    tone: '보르네오 열대우림의 높은 가지 위로 아침 안개를 가르며 날아오르는 코뿔새의 날갯짓',
    ritual: '오늘 눈앞의 세부 문제에서 3분만 물러나 이번 주 전체 흐름을 한 장의 메모로 내려다보세요.',
    question: '나무 한 그루가 아니라 숲 전체의 계절을 내려다본다면, 지금 가장 가벼워질 걱정은 무엇인가요?',
  },
  {
    motif: '롱하우스의 긴 마루(Longhouse Veranda · 여러 가족이 한 지붕 아래 열린 마루를 함께 씀)',
    insight: '혼자 다 짊어지려 애쓰지 않고, 곁의 사람과 짐이나 이야기를 조금 나누는 것만으로도 길이 열림',
    tone: '강변을 따라 길게 이어진 목조 마루 위에서 이웃들이 나란히 바구니를 엮는 저녁',
    ritual: '오늘 가까운 사람 한 명에게 안부나 작은 고마움을 짧게 건네며 열린 마루의 온기를 나누어 보세요.',
    question: '내가 혼자 다 짊어지려 애쓰는 바람에 오히려 곁의 온기를 놓치고 있던 일은 무엇인가요?',
  },
  {
    motif: '카푸아스 강물의 굽이(River Bend · 급한 여울을 지나면 반드시 넓고 잔잔한 굽이가 나타남)',
    insight: '지금 물살이 거세 보인다면, 곧이어 숨을 고를 수 있는 넓은 강굽이가 다가오고 있다는 신호임',
    tone: '짙은 초록빛 정글 사이로 햇살을 머금은 흙빛 강물이 유유히 굽이쳐 흐르는 낮',
    ritual: '오늘 일정이 급하게 몰릴수록 다음 전환점 뒤에 올 짧은 휴식 구간을 미리 비워 두세요.',
    question: '거센 여울을 지나고 난 뒤 숨을 고를 넓은 강굽이를 위해 지금 비워 둘 자리는 어디인가요?',
  },
  {
    motif: '생명수의 문양(Tree of Life · 땅과 강과 하늘을 하나의 뿌리로 잇는 정글의 숨결)',
    insight: '서로 다른 일과 관계가 떨어져 있는 듯 보여도, 결국은 나의 하루라는 하나의 뿌리에서 이어짐',
    tone: '나무 기둥에 정성껏 새겨진 곡선 문양 위로 촉촉한 비 냄새가 스며드는 새벽',
    ritual: '오늘 해야 할 서로 다른 일 두 가지가 내 어떤 하나의 가치와 이어지는지 한 줄로 연결해 보세요.',
    question: '따로 떨어져 보이는 오늘의 일과 관계들을 하나로 잇고 있는 내 삶의 뿌리는 무엇인가요?',
  },
  {
    motif: '등나무 바구니의 탄력(Rattan Weave · 단단하지만 부러지지 않고 물의 흐름을 따라 휘어짐)',
    insight: '강한 고집으로 버티기보다 유연하게 휘어졌다 제자리로 돌아오는 탄력이 오래가는 힘임',
    tone: '가볍고 질긴 등나무 줄기가 촘촘히 엮여 묵직한 수확물을 거뜬히 담아내는 모습',
    ritual: '오늘 계획이 뜻대로 풀리지 않을 때 곧바로 포기하거나 버티기보다 한 박자 유연하게 경로를 틀어 보세요.',
    question: '지금 내가 부러질 듯이 뻣뻣하게 버티고 있어서, 정작 등나무처럼 유연하게 넘길 수 있는 일은 무엇인가요?',
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

export function calculateDayakLonghouseHornbillPoise(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): DayakHornbillResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-DAYAK-HORNBILL-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    dayakMotif: picked.motif,
    companionMotif: companion.motif,
    dayakInsight: picked.insight,
    riverTone: picked.tone,
    reflectionFocus: `보르네오 다약 롱하우스의 '${picked.motif}'과 동반 결 '${companion.motif}'을 겹쳐 보며, 혼자 짊어지던 긴장을 내려놓고 등나무처럼 유연한 탄력으로 오늘을 지나가 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '보르네오 다약족의 롱하우스 공존·코뿔새 시야 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatDayakHornbillPrompt(res: DayakHornbillResult): string {
  return [
    `[보르네오 다약·롱하우스 코뿔새 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 다약 모티프: ${res.dayakMotif} (${res.riverTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.dayakInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
