import type { UserProfile } from '../sharedState';

export interface SindhiBhitaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  surMelody: string;
  sindhiInsight: string;
  indusTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SURS = [
  { sur: '수르 사만디(Sur Samundi · 항해자의 기다림과 신뢰)', insight: '바람의 방향을 내가 다 조종할 수 없어도 배의 닻과 방향타는 온전히 내 손에 있다는 평온', tone: '인더스 강 하구 붉은 돛을 올린 목선의 잔잔한 물결' },
  { sur: '수르 카파로(Sur Kaparo · 비탄을 넘어서는 맑은 노래)', insight: '마음속 답답함을 억지로 누르기보다 노래나 글로 흘려보낼 때 찾아오는 맑은 해방감', tone: '비타이 언덕 저녁 바람을 타고 퍼지는 단부로 현악기 소리' },
  { sur: '수르 마루이(Sur Marui · 화려함보다 진실을 택한 마음)', insight: '남들의 부러움을 사는 겉치레보다 내 마음이 진짜 편하고 떳떳한 자리를 지키는 용기', tone: '타르 사막 오두막 마당을 적시는 소박한 저녁 이슬' },
  { sur: '수르 야만 칼리안(Sur Yaman Kalyan · 갈등을 품어 녹이는 밤의 선율)', insight: '나와 다른 의견이나 서운함도 적으로 돌리지 않고 한 호흡 쉬며 이해해 보려는 너그러움', tone: '인더스 강변 달빛 아래 고요히 흐르는 은빛 물줄기' },
  { sur: '아즈락(Ajrak · 겹겹이 물들인 인디고와 꼭두서니의 인내)', insight: '좋은 결과는 단번에 찍어내는 것이 아니라 여러 번 씻고 말리는 정성 끝에 색이 깊어짐', tone: '장인의 손끝에서 맑은 강물에 헹궈지는 짙은 쪽빛 천' },
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

export function calculateSindhiBhitaiIndusMelody(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SindhiBhitaiResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % SURS.length;
  const picked = SURS[idx];

  return {
    engineVersion: 'LUCKEY-SINDHI-BHITAI-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    surMelody: picked.sur,
    sindhiInsight: picked.insight,
    indusTone: picked.tone,
    reflectionFocus: `신드 시인 샤 압둘 라티프 비타이의 '${picked.sur}'처럼, 바깥의 바람이 불 때도 내 안의 맑은 선율과 진실을 잃지 마세요.`,
    ritualAction: '오늘 겉으로 보기에 그럴듯한 선택 대신, 내 마음이 진짜 편안해지는 소박하고 솔직한 선택 하나를 해 보세요.',
    reflectiveQuestion: '남들의 시선이나 비교를 잠시 꺼 둔다면, 내 마음이 가장 맑게 울리는 자리는 어디인가요?',
    interpretiveBoundary: '인더스·신드(Sindhi) 시인 샤 압둘 라티프 비타이의 《샤 조 리살로》 선율 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSindhiBhitaiPrompt(res: SindhiBhitaiResult): string {
  return [
    `[신드 비타이·인더스 선율 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 선율(Sur): ${res.surMelody} (${res.indusTone})`,
    `- 중심 통찰: ${res.sindhiInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
