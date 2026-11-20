import type { UserProfile } from '../sharedState';

export interface HaudenosauneeResult {
  engineVersion: string;
  calculatedAtKst: string;
  councilPrinciple: string;
  generationalLens: string;
  peaceTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  { principle: '일곱 세대 앞선 시선(Seventh Generation)', lens: '당장의 편함보다 오래 남을 신뢰와 품위를 먼저 챙기는 선택', tone: '거대한 흰 소나무 그늘' },
  { principle: '좋은 마음(Good Mind)의 합의', lens: '이기고 지는 말다툼 대신 서로의 마음을 다치지 않게 여미는 대화', tone: '맑은 호수의 잔물결' },
  { principle: '왐펌(Wampum) 약속의 매듭', lens: '가볍게 던진 말보다 지킬 수 있는 작은 약속 하나를 끝까지 지키는 힘', tone: '단단히 엮인 조개띠' },
  { principle: '평화의 나무 뿌리', lens: '흔들리는 가지가 아니라 나를 지탱하는 깊은 뿌리를 먼저 돌보는 자세', tone: '숲속의 고요한 숨결' },
  { principle: '세 자매 농법의 공생', lens: '혼자 다 하려 하지 않고 주변의 도움과 내 리듬이 자연스럽게 맞물리게 두기', tone: '함께 자라는 옥수수와 콩' },
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

export function calculateHaudenosauneeSevenGenerations(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): HaudenosauneeResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];

  return {
    engineVersion: 'LUCKEY-HAUDENOSAUNEE-7GEN-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    councilPrinciple: picked.principle,
    generationalLens: picked.lens,
    peaceTone: picked.tone,
    reflectionFocus: `급한 결정 앞에서도 '${picked.principle}'의 마음으로 1년 뒤 내가 고마워할 쪽을 살펴보세요.`,
    ritualAction: '오늘 내릴 선택 하나를 떠올리며, 한 달 뒤의 나에게 편하냐고 속으로 물어보세요.',
    reflectiveQuestion: '지금 당장 해결하고 싶은 조급함 너머로, 내가 정말 오래 지키고 싶은 가치는 무엇인가요?',
    interpretiveBoundary: '호데노쇼니(이로쿼이) 7세대 대평화 법칙을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatHaudenosauneePrompt(res: HaudenosauneeResult): string {
  return [
    `[호데노쇼니 7세대 대평화 법칙 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 평의회 원칙: ${res.councilPrinciple} (${res.peaceTone})`,
    `- 장기 시선: ${res.generationalLens}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
