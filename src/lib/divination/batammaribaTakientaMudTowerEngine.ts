import type { UserProfile } from '../sharedState';

export interface BatammaribaTakientaInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface BatammaribaTakientaResult {
  engineVersion: string;
  calculatedAtKst: string;
  earthenTower: string;
  hearthThreshold: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const TOWERS = [
  '서로 기댄 두 흙탑이 지붕 테라스를 받치는 자리',
  '1층의 서늘한 곳간과 2층의 따뜻한 잠자리가 나뉜 구조',
  '빗물을 밖으로 흘려보내는 매끄러운 붉은 흙벽',
  '해 질 녘 온 식구가 모여 하늘을 보는 평평한 옥상',
] as const;

const THRESHOLDS = [
  '아래층에 곡식을 두고 위층에서 쉬듯, 당장 쓸 일과 비축할 여유를 층위로 나누면 집이 단단해집니다.',
  '손으로 다진 흙벽은 해마다 덧바를수록 더 튼튼해지듯, 작은 일상의 손질이 마음의 외벽을 지켜 줍니다.',
  '좁은 문을 지나 넓은 옥상에 오르듯, 작은 불편을 하나 넘기면 시야가 트이는 자리가 나옵니다.',
  '혼자 높게 쌓기보다 두 기둥이 서로를 기대어 서야 긴 계절을 버틸 수 있습니다.',
] as const;

const ACTIONS = [
  '오늘 해야 할 일 중 당장 처리할 것(1층)과 미뤄도 될 것(2층)을 나누어 정리하기',
  '하루 끝 5분 동안 머리를 식히고 하늘이나 바깥 공기를 보며 호흡 가다듬기',
  '반복해서 낡아 가는 생활 습관 하나를 오늘 새로 덧발라 보수하기',
  '혼자 짊어지던 일 하나를 믿는 사람과 나누어 기둥을 두 개로 만들기',
] as const;

const QUESTIONS = [
  '내 일상의 1층(생계·실무)과 2층(쉼·마음)이 서로 섞여 지치고 있지는 않나요?',
  '요즘 가장 손길이 필요한 내 마음의 흙벽은 어느 부분인가요?',
  '서로 기대어 서면 훨씬 단단해질 관계나 협업은 무엇인가요?',
  '오늘 하루를 마치고 올라가 숨을 고를 나만의 옥상 자리는 어디인가요?',
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

export function calculateBatammaribaTakienta(input: BatammaribaTakientaInput): BatammaribaTakientaResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-BATAMMARIBA-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    earthenTower: TOWERS[seed % TOWERS.length],
    hearthThreshold: THRESHOLDS[(seed >>> 3) % THRESHOLDS.length],
    reflectionFocus: '토고·베냉 바타마리바 족이 손으로 빚어 올린 타키엔타 2층 흙탑 가옥처럼 실무와 쉼의 층위를 나누고 공동체로 버티는 지혜의 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatBatammaribaTakientaPrompt(res: BatammaribaTakientaResult): string {
  return [
    `[바타마리바·타키엔타 흙탑 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `흙탑 자리: ${res.earthenTower}`,
    `층위 지혜: ${res.hearthThreshold}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
