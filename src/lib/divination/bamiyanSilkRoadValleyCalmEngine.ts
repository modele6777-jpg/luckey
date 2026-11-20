import type { UserProfile } from '../sharedState';

export interface BamiyanValleyResult {
  engineVersion: string;
  calculatedAtKst: string;
  bamiyanMotif: string;
  companionMotif: string;
  bamiyanInsight: string;
  valleyTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '힌두쿠시 절벽의 감실(Cliff Alcove · 거센 고개 바람을 등지고 고요히 깃드는 붉은 바위 품)',
    insight: '바깥의 소음이 클수록 먼저 등을 기댈 수 있는 단단한 내면의 자리를 확보하는 것이 우선임',
    tone: '파란 하늘 아래 붉은 사암 절벽이 긴 그림자를 드리우며 계곡을 감싸 안은 아침',
    ritual: '오늘 일정 사이에서 5분만이라도 외부 연락을 끄고 나만의 조용한 자리에서 호흡을 가다듬어 보세요.',
    question: '거센 바깥 바람 속에서 지금 내 등을 가장 든든히 받쳐 주는 내면의 바위 자리는 어디인가요?',
  },
  {
    motif: '반데아미르의 푸른 호수(Band-e Amir · 석회암 둑이 스스로 자라나 맑은 물빛을 가둠)',
    insight: '서두르지 않고 매일의 작은 성실을 쌓다 보면, 어느새 나를 지탱하는 맑은 그릇이 완성됨',
    tone: '메마른 고원 한가운데 믿기지 않을 만큼 깊고 푸른 옥빛 물결이 고요히 일렁이는 풍경',
    ritual: '큰 결과를 한 번에 재촉하기보다 오늘 내가 꾸준히 쌓을 수 있는 작은 성실 한 가지를 적어 보세요.',
    question: '서두르지 않고 매일 조금씩 쌓아 올렸을 때, 나를 지탱하는 맑은 호수의 둑이 되어 줄 습관은 무엇인가요?',
  },
  {
    motif: '실크로드 교차로의 찻잔(Caravan Tea · 동과 서에서 온 길손들이 같은 불빛 아래 숨을 고름)',
    insight: '서로 다른 배경을 가진 의견이 부딪힐 때, 정답을 다투기보다 먼저 한 모금의 여유를 나누면 길이 보임',
    tone: '긴 여정을 마친 상인들이 모닥불 곁에서 먼지를 털고 따뜻한 차를 나누는 저녁',
    ritual: '오늘 하루 중 딱 3분만 알림을 내려놓고 따뜻한 물이나 차를 마시며 숨을 고르는 쉼표를 찍어 보세요.',
    question: '지금 내 마음의 그릇을 가장 흐리게 만드는 소음은 무엇이며, 한 모금의 여유를 두면 어떤 길이 보일까요?',
  },
  {
    motif: '눈 녹은 계곡의 여울(Snowmelt Stream · 높은 산의 겨울을 견딘 물이 봄 들판을 적심)',
    insight: '잠잠히 버텨 온 인내의 시간은 사라지지 않고, 때가 되었을 때 가장 맑은 활력으로 흘러나옴',
    tone: '자갈돌 사이로 차갑고 맑은 물이 햇빛을 부수며 가볍게 흘러가는 계곡',
    ritual: '아직 눈에 띄지 않더라도 그동안 묵묵히 버텨 온 나 자신의 시간 하나를 오늘 분명히 짚어 주세요.',
    question: '겉으로 당장 드러나지 않아도 내 안에서 봄 들판을 적실 맑은 물처럼 차곡차곡 모이고 있는 힘은 무엇인가요?',
  },
  {
    motif: '고원 별빛의 침묵(Highland Starlight · 해발 높은 밤하늘이 불필요한 걱정을 조용히 식혀 줌)',
    insight: '머릿속이 복잡할 때는 시야를 한 뼘만 높여도 지금 붙들고 있는 고민의 크기가 달라 보임',
    tone: '찬 공기 속에서 유난히 또렷하게 반짝이는 별빛 아래 잠든 고대 계곡',
    ritual: '복잡한 고민을 종이에 한 줄로 줄여 적고, 일주일 뒤의 시선에서 그 크기를 다시 가늠해 보세요.',
    question: '시야를 한 뼘만 높여 고원 밤하늘에서 내려다본다면, 지금의 고민 중 과열된 걱정은 어느 부분일까요?',
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

export function calculateBamiyanSilkRoadValleyCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BamiyanValleyResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-BAMIYAN-VALLEY-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    bamiyanMotif: picked.motif,
    companionMotif: companion.motif,
    bamiyanInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    valleyTone: picked.tone,
    reflectionFocus: `바미얀 계곡 조화의 '${picked.motif}'와 동반 결 '${companion.motif}'처럼, 거센 일정 속에서도 등을 기댈 조용한 틈을 먼저 마련하고 맑은 물빛을 지켜 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '실크로드 바미얀 계곡의 쉼터·고원 호수 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBamiyanValleyPrompt(res: BamiyanValleyResult): string {
  return [
    `[바미얀·실크로드 계곡 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 계곡 모티프: ${res.bamiyanMotif} (${res.valleyTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 중심 통찰: ${res.bamiyanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
