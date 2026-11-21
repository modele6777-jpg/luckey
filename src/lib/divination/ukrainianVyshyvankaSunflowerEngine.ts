import type { UserProfile } from '../sharedState';

export interface UkrainianVyshyvankaResult {
  engineVersion: string;
  calculatedAtKst: string;
  embroideryMotif: string;
  companionMotif: string;
  vyshyvankaInsight: string;
  steppeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '비시반카 한 땀(Vyshyvanka · 붉고 검은 실로 정성껏 잇는 보호의 무늬)',
    insight: '거창한 변화보다 오늘 내 일상에 정성껏 얹는 작은 땀 하나가 나를 지켜 주는 무늬가 됨',
    tone: '하얀 아마포 소매 위에 대칭으로 정갈하게 수놓인 붉고 검은 기하학 자수',
    action: '오늘 내가 소중히 여기는 사람이나 나 자신에게, 작은 정성이 담긴 따뜻한 말 한 마디를 먼저 건네 보세요.',
    question: '거창한 성취가 아니더라도 오늘 내 일상에 정성껏 한 땀 수놓고 싶은 작은 돌봄은 무엇인가요?',
  },
  {
    motif: '해바라기(Soniashnyk · 흐린 날에도 묵묵히 빛이 있는 쪽으로 고개를 돌림)',
    insight: '모든 조건이 완벽히 맑지 않아도 내 마음이 향할 밝은 방향 하나를 잃지 않는 태도',
    tone: '드넓은 흑토 평원 위로 황금빛 얼굴을 나란히 세운 여름의 해바라기 밭',
    action: '오늘 걱정거리가 떠오를 때마다 내가 이미 감사하거나 기대할 수 있는 밝은 사실 하나를 나란히 적어 보세요.',
    question: '지금 조건이 아주 맑지 않더라도, 해바라기처럼 내 마음이 묵묵히 고개를 돌려 바라보고 싶은 밝은 방향은 어디인가요?',
  },
  {
    motif: '칼리나 열매(Kalyna · 서리를 맞은 뒤에야 더 맑고 달아지는 붉은 열매)',
    insight: '서늘한 시간을 건너온 경험이 사람을 메마르게만 하지 않고 더 깊은 온기를 빚어냄',
    tone: '첫서리가 내린 가을 아침, 맑은 하늘 아래 선명하게 빛나는 붉은 열매 가지',
    action: '지난 아쉬움이나 서늘했던 기억 하나를 자책 대신 "덕분에 단단해진 점" 한 줄로 다시 읽어 보세요.',
    question: '서늘한 시간을 건너온 경험이 내게 남긴 것 중, 이제는 더 깊은 온기로 익어 가고 있는 부분은 무엇인가요?',
  },
  {
    motif: '피산카 달걀(Pysanka · 껍질 위에 밀랍으로 조심히 그려 넣는 새봄의 기원)',
    insight: '작고 깨지기 쉬운 순간일수록 서두르지 않고 조심스러운 손길로 대할 때 온전해짐',
    tone: '따뜻한 밀랍과 천연 염료로 정교한 별 문양을 입힌 작은 봄의 선물',
    action: '섬세한 주의가 필요한 일이나 관계 하나를 오늘 서두르지 않고 천천히 다정한 손길로 다루어 보세요.',
    question: '작고 깨지기 쉬워서 오늘 더 조심스럽고 정성 어린 손길로 다루어 주어야 할 순간은 무엇인가요?',
  },
  {
    motif: '드니프로 강의 너비(Dnipro · 굽이쳐도 끝내 넓은 바다로 흘러가는 힘)',
    insight: '중간에 바위나 굽이가 있어도 방향을 잃지 않고 흐르는 물은 결국 제 길을 찾음',
    tone: '황금빛 밀밭 사이로 유유히 흘러가는 넓고 잔잔한 강물',
    action: '당장 굽이쳐 막힌 듯한 일에서도 큰 물줄기의 방향만 확인하고 오늘 할 수 있는 한 구비만 흘려보내세요.',
    question: '중간에 바위나 굽이가 놓여 있더라도, 끝내 넓은 바다를 향해 방향을 잃지 않고 흐르고 싶은 내 길은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateUkrainianVyshyvankaSunflower(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): UkrainianVyshyvankaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-UKRAINIAN-VYSHYVANKA-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    embroideryMotif: picked.motif,
    companionMotif: companion.motif,
    vyshyvankaInsight: picked.insight,
    steppeTone: picked.tone,
    reflectionFocus: `우크라이나 비시반카·해바라기 지혜의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 겉으로 크게 드러나지 않아도 오늘 내 손끝의 정성스러운 한 땀과 밝은 방향을 지켜 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '우크라이나의 비시반카(Vyshyvanka) 자수 정성·칼리나 인내·해바라기 희망 상징을 바탕으로 한 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatUkrainianVyshyvankaPrompt(res: UkrainianVyshyvankaResult): string {
  return [
    `[우크라이나 비시반카·해바라기 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 평원 상징: ${res.embroideryMotif} (${res.steppeTone})`,
    `- 동반 상징: ${res.companionMotif}`,
    `- 중심 통찰: ${res.vyshyvankaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
