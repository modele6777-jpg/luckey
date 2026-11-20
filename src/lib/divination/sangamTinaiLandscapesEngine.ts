import type { UserProfile } from '../sharedState';

export interface SangamTinaiInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface SangamTinaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  tinaiLandscape: string;
  akamPuramTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LANDSCAPES = [
  '쿠린지(Kurinji) — 안개 낀 산마루의 첫 만남',
  '물라이(Mullai) — 비를 기다리는 푸른 숲의 인내',
  '마루탐(Marutam) — 물길 흐르는 들판의 일상 조율',
  '네이탈(Neital) — 파도 밀려드는 바닷가의 그리움',
] as const;

const TONES = [
  '마음의 안쪽(아캄)과 세상의 바깥(푸람)을 한 풍경에 비추어 보면 감정의 자리가 보입니다.',
  '기다림의 계절에도 숲의 풀빛은 자라듯, 멈춘 듯한 시간 속에 조용한 성숙이 있습니다.',
  '가까운 관계의 작은 어긋남은 비난보다 일상 물길을 다듬을 때 부드럽게 풀립니다.',
  '산·숲·들·바다마다 어울리는 꽃이 다르듯 지금 나에게 맞는 태도도 계절마다 다릅니다.',
] as const;

const ACTIONS = [
  '지금 내 기분과 가장 닮은 자연 풍경(산·숲·들·바다) 하나를 골라 1분간 떠올리기',
  '내면의 감정(아캄)과 오늘 해야 할 바깥 일(푸람)을 한 줄씩 나누어 적어 보기',
  '가까운 사람과의 관계에서 서운함 대신 지금 건넬 수 있는 작은 안부 한마디 전하기',
  '억지로 풍경을 바꾸려 하기보다 지금 머무른 자리의 좋은 점 한 가지 찾아보기',
] as const;

const QUESTIONS = [
  '지금 내 마음의 풍경은 산·숲·들·바다 가운데 어디와 가장 닮아 있나요?',
  '안쪽의 감정과 바깥의 책임 사이에서 지금 가장 다독여 주어야 할 쪽은 어디인가요?',
  '기다림이 필요한 숲의 계절에 내가 서둘러 거두려 하는 것은 무엇인가요?',
  '오늘의 일상 들판에서 부드럽게 물길을 터 주면 좋을 관계나 일은 무엇일까요?',
] as const;

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateSangamTinaiPoetics(input: SangamTinaiInput): SangamTinaiResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-SANGAM-TINAI-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    tinaiLandscape: LANDSCAPES[seed % LANDSCAPES.length],
    akamPuramTone: TONES[(seed >>> 3) % TONES.length],
    reflectionFocus: '고전 타밀 상감 시학의 다섯 티나이(Tinai) 경관처럼 자연의 풍경과 계절에 비추어 내면(아캄)과 외면(푸람)의 결을 읽는 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatSangamTinaiPrompt(res: SangamTinaiResult): string {
  return [
    `[타밀 상감·티나이 다섯 경관 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `티나이 경관: ${res.tinaiLandscape}`,
    `아캄·푸람 결: ${res.akamPuramTone}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
