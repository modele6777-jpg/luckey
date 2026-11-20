import type { UserProfile } from '../sharedState';

export interface HebrideanTartanResult {
  engineVersion: string;
  calculatedAtKst: string;
  hebrideanMotif: string;
  hebrideanInsight: string;
  tweedTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '이끼와 히스 빛깔의 실(Heather & Lichen Dye · 바위 이끼와 들꽃에서 섬 고유의 색을 우려냄)', insight: '멀리서 화려한 재료를 찾지 않아도 내가 지금 딛고 선 땅의 이끼와 풀잎에서 고유한 색이 나옴', tone: '스코틀랜드 아우터 헤브리디스 해변, 안개 낀 언덕의 보랏빛 히스 꽃 위로 바람이 부는 아침' },
  { motif: '페달 베틀의 발박자(Pedal Loom Rhythm · 전기 없이 두 발과 손이 맞물려 천을 짬)', insight: '속도를 내기 위해 기계에 맡기기보다 내 발과 손의 박자로 짠 결과물이 훨씬 오래 버팀', tone: '작은 돌집 오두막 안에서 나무 베틀의 규칙적인 소리가 파도 소리와 어우러지는 오전' },
  { motif: '검은 집의 낮은 지붕(Blackhouse Roof · 둥글고 낮은 초가지붕으로 대서양 강풍을 넘김)', insight: '바람이 거셀수록 키를 높여 맞서기보다 몸을 낮추고 둥글게 흘려보내는 지혜가 필요함', tone: '거친 대서양 바람을 막아 주는 두꺼운 돌벽 안쪽에서 피트 난로가 따뜻하게 타오르는 낮' },
  { motif: '타르탄의 교차 격자(Clan Sett · 서로 다른 색의 씨실과 날실이 교차하며 하나의 무늬를 이룸)', insight: '내 안의 모순되어 보이는 성향들도 서로 엮어 보면 오히려 단단하고 고유한 격자가 됨', tone: '짙은 청록과 갈색, 붉은 선이 교차한 두툼한 모직 천이 의자 위에 따뜻하게 놓인 오후' },
  { motif: '썰물 뒤의 켈프 해초(Kelp Shore · 거친 파도가 지나간 모래밭에 바다의 양분이 남음)', insight: '지나간 시련의 파도가 휩쓸고 간 자리에도 다음 삶을 키워 낼 짭짤한 양분이 남겨져 있음', tone: '은빛 해가 기우는 바닷가, 잔잔해진 물가 바위 위로 파도가 조용히 물러나는 저녁' },
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

export function calculateHebrideanTartanLoomCalm(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HebrideanTartanResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-HEBRIDEAN-TARTAN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    hebrideanMotif: picked.motif,
    hebrideanInsight: picked.insight,
    tweedTone: picked.tone,
    reflectionFocus: `헤브리디스 트위드의 '${picked.motif}'처럼, 내가 지금 딛고 선 자리의 재료로 내 발박자에 맞춰 고유한 격자를 짜 보세요.`,
    ritualAction: '오늘 거창한 해결책을 찾아 헤매기보다, 지금 손에 쥔 익숙한 재료 하나로 작은 매듭을 지어 보세요.',
    reflectiveQuestion: '내 안의 서로 달라 보이는 성향들을 억지로 하나만 고르려 하기보다 함께 엮어 볼 수는 없을까요?',
    interpretiveBoundary: '스코틀랜드 아우터 헤브리디스의 해리스 트위드 직조와 블랙하우스 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHebrideanTartanPrompt(res: HebrideanTartanResult): string {
  return [
    `[헤브리디스·타르탄 베틀 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 헤브리디스 모티프: ${res.hebrideanMotif} (${res.tweedTone})`,
    `- 중심 통찰: ${res.hebrideanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
