import type { UserProfile } from '../sharedState';

export interface WelshMabinogionAwenResult {
  engineVersion: string;
  calculatedAtKst: string;
  awenRay: string;
  bardicInsight: string;
  valleyTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const RAYS = [
  { ray: '아웬(Awen)의 첫 번째 빛줄기 · 진실한 관찰', insight: '남의 시선이나 관성에 휩쓸리지 않고 지금 상황의 본질을 맑게 바라보는 눈', tone: '스노도니아 안개 사이로 비치는 첫 아침 햇살' },
  { ray: '아웬(Awen)의 두 번째 빛줄기 · 용기 있는 상상', insight: '지금까지 해 오던 방식 외에 전혀 새로운 길을 그려 볼 수 있는 유연한 창조성', tone: '푸른 이끼 낀 계곡을 흐르는 맑은 시냇물 소리' },
  { ray: '아웬(Awen)의 세 번째 빛줄기 · 따뜻한 표현', insight: '머릿속에만 담아 두던 진심을 말과 글, 행동으로 세상에 건네는 용기', tone: '돌벽 난로 앞 하프 연주의 포근한 여운' },
  { ray: '케리드웬(Ceridwen)의 가마솥과 인내의 한 방울', insight: '긴 준비와 시행착오 끝에 비로소 내 것이 되어 떨어지는 결정적 영감의 순간', tone: '밤새 지핀 모닥불이 남긴 붉고 고요한 잉걸불' },
  { ray: '리안논(Rhiannon)의 새소리와 마음의 평온', insight: '복잡한 소음이 많아도 내 안의 고요한 중심을 잃지 않게 해 주는 다정한 위로', tone: '이른 새벽 푸른 언덕 너머로 들려오는 지저귐' },
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

export function calculateWelshMabinogionAwenInspiration(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): WelshMabinogionAwenResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % RAYS.length;
  const picked = RAYS[idx];

  return {
    engineVersion: 'LUCKEY-WELSH-AWEN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    awenRay: picked.ray,
    bardicInsight: picked.insight,
    valleyTone: picked.tone,
    reflectionFocus: `웨일스 음유시인 전통의 '${picked.ray}'처럼, 정답을 억지로 짜내기보다 마음이 반응하는 작은 호기심 하나를 따라가 보세요.`,
    ritualAction: '오늘 떠오른 아이디어 또는 해 보고 싶은 일 한 가지를 짧은 문장 하나로 메모해 두세요.',
    reflectiveQuestion: '지금 내가 ‘해야만 한다’는 의무감 말고 순수하게 반짝이는 호기심으로 해 보고 싶은 작은 시도는 무엇인가요?',
    interpretiveBoundary: '웨일스 《마비노기온》 설화와 아웬(Awen) 시적 영감 상징을 바탕으로 한 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatWelshMabinogionAwenPrompt(res: WelshMabinogionAwenResult): string {
  return [
    `[웨일스 마비노기온·아웬 영감 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 아웬 빛줄기: ${res.awenRay} (${res.valleyTone})`,
    `- 중심 통찰: ${res.bardicInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
