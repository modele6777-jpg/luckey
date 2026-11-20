import type { UserProfile } from '../sharedState';

export interface KarenBambooClockInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface KarenBambooClockResult {
  engineVersion: string;
  calculatedAtKst: string;
  bambooCadence: string;
  waterMeasure: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CADENCES = [
  '산골짜기 물이 대나무 마디를 채우는 고른 박자',
  '가득 차면 기울어 비워지는 물레의 순환',
  '새벽 안개 속 대나무 잎에 맺힌 물방울',
  '서두름 없이 흐르는 계곡물의 잔잔한 울림',
] as const;

const MEASURES = [
  '조급하게 시계를 재촉하기보다 내 호흡이 차오를 시간을 기다리면 결이 고와집니다.',
  '대나무 통이 가득 차야 비로소 기울듯, 충분히 숙성된 결정은 억지스럽지 않습니다.',
  '빈 마디가 있어야 물을 담을 수 있듯이, 일정 사이의 틈이 집중력을 지켜 줍니다.',
  '작은 물줄기가 모여 바위를 적시듯 오늘의 차분한 실행이 내일의 믿음이 됩니다.',
] as const;

const ACTIONS = [
  '타이머를 20분으로 맞추고 한 가지 일에만 온전히 몰입한 뒤 5분 비우기',
  '오늘 일정 사이사이에 아무것도 하지 않는 10분 여백 표시하기',
  '물 한 잔을 천천히 마시며 지금 가장 급한 일과 중요한 일 구분하기',
  '완료하지 못한 일을 자책하는 대신 다음 마디의 시작점만 정해 두기',
] as const;

const QUESTIONS = [
  '지금 억지로 기울이려 애쓰고 있는 대나무 통이 있다면 무엇인가요?',
  '내 하루의 흐름에서 가장 자연스럽게 물이 차오르는 시간대는 언제인가요?',
  '비워 두어야 오히려 더 잘 채워질 일정이나 마음의 자리는 어디인가요?',
  '조급함을 내려놓고 한 마디씩 건너갈 때 어떤 여유가 생길까요?',
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

export function calculateKarenBambooClock(input: KarenBambooClockInput): KarenBambooClockResult {
  const fate = input.profile.fate ?? {};
  const seed = hashSeed(`${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`);

  return {
    engineVersion: 'LUCKEY-KAREN-BAMBOO-v2.1.0',
    calculatedAtKst: toKstIso(input.now),
    bambooCadence: CADENCES[seed % CADENCES.length],
    waterMeasure: MEASURES[(seed >>> 3) % MEASURES.length],
    reflectionFocus: '산간 계곡의 대나무 물시계처럼 차고 기우는 자연스러운 박자로 조급함을 덜고 자기 페이스를 지키는 카렌 족의 상징적 관점입니다.',
    ritualAction: ACTIONS[(seed >>> 6) % ACTIONS.length],
    reflectiveQuestion: QUESTIONS[(seed >>> 9) % QUESTIONS.length],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatKarenBambooPrompt(res: KarenBambooClockResult): string {
  return [
    `[카렌·대나무 물시계 조화 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `물시계 박자: ${res.bambooCadence}`,
    `흐름: ${res.waterMeasure}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
