import type { UserProfile } from '../sharedState';

export interface SamarkandUlughResult {
  engineVersion: string;
  calculatedAtKst: string;
  arcStage: string;
  meridianFocus: string;
  starAlignmentTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const ARCS = [
  { stage: '자오선 호(Fakhri Sextant) 정밀 측정', focus: '막연한 불안 대신 관찰 가능한 사실 하나를 먼저 짚어 보는 시간', tone: '맑은 정오의 그림자' },
  { stage: '지즈 이 술타니(Zij-i-Sultani) 성표 교정', focus: '예전의 짐작을 내려놓고 오늘의 좌표로 기준을 새로 맞추는 시간', tone: '차분한 천문 궤도' },
  { stage: '레기스탄 마드라사 수리 성찰', focus: '복잡한 감정을 한 걸음 물러서서 구조와 순서로 정리하는 시간', tone: '청금석 아치의 고요' },
  { stage: '황도 경사(Obliquity) 균형점', focus: '기울어진 마음의 균형을 작은 습관 하나로 되찾는 시간', tone: '새벽 별빛의 일관성' },
  { stage: '실크로드 사막 관측의 인내', focus: '당장 결론을 서두르지 않고 밤하늘이 열릴 때까지 기다리는 시간', tone: '깊은 사막의 시선' },
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

export function calculateSamarkandUlughBegObservatory(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SamarkandUlughResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % ARCS.length;
  const picked = ARCS[idx];

  return {
    engineVersion: 'LUCKEY-SAMARKAND-ULUGH-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    arcStage: picked.stage,
    meridianFocus: picked.focus,
    starAlignmentTone: picked.tone,
    reflectionFocus: `추측이 부풀어 오를수록 '${picked.stage}'처럼 눈앞의 한 가지 기준만 차분히 재어 보세요.`,
    ritualAction: '오늘 걱정되는 일 하나를 종이에 한 문장으로 적고, 사실과 짐작을 두 줄로 나누어 보세요.',
    reflectiveQuestion: '지금 내가 막연히 크게 느끼는 고민 중, 실제로 확인해 본 사실은 무엇인가요?',
    interpretiveBoundary: '우즈베키스탄 사마르칸트 울루그 베그 천문대의 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSamarkandUlughPrompt(res: SamarkandUlughResult): string {
  return [
    `[사마르칸트 울루그 베그 천문대 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 관측 단계: ${res.arcStage} (${res.starAlignmentTone})`,
    `- 중심 통찰: ${res.meridianFocus}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
