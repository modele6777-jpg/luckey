import type { UserProfile } from '../sharedState';

export interface OmoKaroInput {
  profile: UserProfile;
  now?: Date;
  question?: string;
}

export interface OmoKaroResult {
  engineVersion: string;
  calculatedAtKst: string;
  pigmentMotif: string;
  mineralTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  '하얀 분필 점(White Chalk): 강가의 석회를 손끝으로 찍어 올려 복잡한 감정을 선명한 리듬으로 정리하는 표식',
  '붉은 황토(Red Ochre): 대지의 따뜻한 기운을 얼굴과 어깨에 얹어 오늘의 생기를 일깨우는 물감',
  '검은 숯 선(Charcoal Line): 군더더기 없는 굵은 획으로 내면의 경계와 중심을 또렷이 긋는 결단',
  '물결 빗살(Finger-Combed Wave): 마르기 전 손가락으로 훑어 내며 흐르는 시간과 자연스럽게 어우러지는 흔적',
] as const;

const MINERAL_TONES = [
  '생기 있게 빛나는 황토빛',
  '또렷하게 선을 긋는 먹빛',
  '가볍게 리듬을 타는 백색 점',
  '자연스레 씻겨 나가는 물결',
] as const;

const RITUALS = [
  '오늘의 기분이나 목표를 세 단어로만 줄여 메모장 맨 위에 크게 적어 보세요.',
  '어제의 무거운 감정은 강물에 씻어 내듯 세수나 샤워를 하며 털어내 보세요.',
  '평소보다 조금 더 선명한 색의 옷이나 소품 하나를 골라 하루의 표정을 바꿔 보세요.',
  '남의 시선 대신 지금 내 몸과 표정이 가장 편해지는 자세를 먼저 찾아보세요.',
] as const;

const QUESTIONS = [
  '오늘 내 마음의 도화지 위에 가장 먼저 찍고 싶은 색깔은 무엇인가요?',
  '영원히 남기려 애쓰기보다 오늘 하루만 아름답게 피우고 흘려보내도 좋은 일은 무엇일까요?',
  '복잡한 설명을 덜어 내고 선명한 선 하나만 남긴다면 어떤 마음이 남을까요?',
  '나를 꾸미는 표현이 지금의 진짜 기분과 잘 맞닿아 있는지 돌아볼까요?',
] as const;

function toKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function stableHash(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateOmoKaroBodyArt(input: OmoKaroInput): OmoKaroResult {
  const now = input.now ?? new Date();
  const fate = input.profile?.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.question ?? ''}|${now.toISOString().slice(0, 10)}|omo-karo`;
  const h = stableHash(seedText);

  const pigmentMotif = MOTIFS[h % MOTIFS.length];
  const mineralTone = MINERAL_TONES[(h >>> 3) % MINERAL_TONES.length];
  const ritualAction = RITUALS[(h >>> 6) % RITUALS.length];
  const reflectiveQuestion = QUESTIONS[(h >>> 9) % QUESTIONS.length];

  return {
    engineVersion: 'LUCKEY-OMO-KARO-v2.1.0',
    calculatedAtKst: toKstIso(now),
    pigmentMotif,
    mineralTone,
    reflectionFocus: `강가의 흙과 재로 하루의 기운을 표현하고 저녁이면 씻어 내는 오모 계곡 카로 족의 회화처럼, 지금은 '${mineralTone}'의 솔직한 표현이 어울립니다.`,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary: '에티오피아 오모 계곡 카로 족의 자연 안료 회화 문화를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOmoKaroPrompt(result: OmoKaroResult): string {
  return [
    `[오모 카로 진흙 회화 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 상징 모티프: ${result.pigmentMotif}`,
    `- 현재 결: ${result.mineralTone}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
