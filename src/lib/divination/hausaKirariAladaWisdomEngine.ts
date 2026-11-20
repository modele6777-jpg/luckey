import type { UserProfile } from '../sharedState';

export interface HausaKirariAladaResult {
  engineVersion: string;
  calculatedAtKst: string;
  proverbSign: string;
  aladaInsight: string;
  sahelTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PROVERBS = [
  { sign: '하쿠리(Hakuri · 큰 강을 건너는 인내)', insight: '당장 눈앞의 작은 반응에 일희일비하지 않고 긴 호흡으로 상황을 품을 때 얻어지는 주도권', tone: '사헬의 붉은 대지 위로 느긋하게 흐르는 나이저 강물' },
  { sign: '키라리(Kirari · 자신의 장점을 부르는 당당한 호명)', insight: '남과 비교하며 스스로를 작게 만들기보다 내가 이미 해낸 몫과 강점을 또렷이 인정하는 태도', tone: '카노(Kano) 성문 앞 아침 시장에 울리는 활기찬 인사 소리' },
  { sign: '무툰치(Mutunci · 누구 앞에서도 지키는 존중과 품격)', insight: '상대의 지위나 상황과 무관하게 정중한 태도를 유지할 때 오히려 내 자리가 단단해지는 이치', tone: '바오밥 나무 그늘 아래 마시는 시원한 생강차 한 잔' },
  { sign: '아마나(Amana · 맡겨진 신뢰를 끝까지 지킴)', insight: '크고 화려한 약속보다 사소한 약속 하나를 제때 지켜내는 성실함이 쌓여 만드는 힘', tone: '햇볕에 잘 말린 인디고 염색 천의 깊고 변치 않는 푸른빛' },
  { sign: '샤와라(Shawara · 지혜로운 이에게 먼저 묻는 경청)', insight: '혼자 고집으로 밀어붙이다 길을 잃기 전에 경험 있는 시선 한 번을 빌려오는 유연함', tone: '저녁 별빛 아래 흙벽 마당에서 나누는 어른들의 담소' },
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

export function calculateHausaKirariAladaWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HausaKirariAladaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PROVERBS.length;
  const picked = PROVERBS[idx];

  return {
    engineVersion: 'LUCKEY-HAUSA-KIRARI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    proverbSign: picked.sign,
    aladaInsight: picked.insight,
    sahelTone: picked.tone,
    reflectionFocus: `서아프리카 하우사 지혜의 '${picked.sign}'처럼, 오늘의 결정에서는 순간의 감정보다 긴 신뢰(Amana)와 내면의 품격을 먼저 세워 보세요.`,
    ritualAction: '오늘 내가 잘해낸 일 한 가지와, 누군가에게 지킨 작은 약속 한 가지를 스스로 칭찬해 주세요.',
    reflectiveQuestion: '지금 내가 조급함에 휘둘리지 않고 인내(Hakuri)와 품격으로 지켜내고 싶은 핵심 가치는 무엇인가요?',
    interpretiveBoundary: '서아프리카 하우사(Hausa) 전통의 키라리(Kirari)·아마나(Amana) 인격 수양 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHausaKirariPrompt(res: HausaKirariAladaResult): string {
  return [
    `[하우사 키라리·알아다 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 격언 상징: ${res.proverbSign} (${res.sahelTone})`,
    `- 중심 통찰: ${res.aladaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
