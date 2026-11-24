import type { UserProfile } from '../sharedState';

export interface OmoKaroInput {
  profile: UserProfile;
  now?: Date;
  question?: string;
}

export interface OmoKaroResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '정리·리듬' | '생기·표현' | '결단·경계' | '흐름·비움' | '카로 전반';
  pigmentMotif: string;
  companionMotif: string;
  karoPigmentAxis: string;
  mineralTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
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
  '평소보다 조금 더 선명한 색의 옷이나 소품 하나를 골라 하루의 표정을 바꿔 보세요.',
  '남의 시선 대신 지금 내 몸과 표정이 가장 편해지는 자세를 먼저 찾아보세요.',
  '어제의 무거운 감정은 강물에 씻어 내듯 세수나 샤워를 하며 털어내 보세요.',
] as const;

const QUESTIONS = [
  '오늘 내 마음의 도화지 위에 가장 먼저 찍고 싶은 색깔은 무엇인가요?',
  '나를 꾸미는 표현이 지금의 진짜 기분과 잘 맞닿아 있는지 돌아볼까요?',
  '복잡한 설명을 덜어 내고 선명한 선 하나만 남긴다면 어떤 마음이 남을까요?',
  '영원히 남기려 애쓰기보다 오늘 하루만 아름답게 피우고 흘려보내도 좋은 일은 무엇일까요?',
] as const;

function toKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const OMO_KARO_SHADOWS = [
  '감정을 세 단어로 선명하게 줄여 정리하는 명료함이 미묘한 속마음의 결까지 거칠게 단순화하는 성급함이 되지 않게 하세요.',
  '오늘의 생기와 솔직한 표현을 드러내는 활력이 주변 분위기나 상대의 여력을 살피지 않는 과잉 과시로 흐르지 않도록 조절하세요.',
  '굵은 숯 선으로 내면의 경계를 또렷이 긋는 결단이 대화와 타협의 여지까지 단칼에 차단하는 배타성이 되어서는 안 됩니다.',
  '하루의 흔적을 물에 씻어 내는 가벼운 비움이 꼭 기억하고 고쳐야 할 약속이나 교훈까지 흘려보내는 방심으로 이어지지 않게 하세요.',
] as const;

function classifyOmoKaroTopic(q: string): OmoKaroResult['questionTopic'] {
  if (/정리|리듬|단어|메모/.test(q)) return '정리·리듬';
  if (/생기|표현|색|기분/.test(q)) return '생기·표현';
  if (/경계|선|결단|중심/.test(q)) return '결단·경계';
  if (/흐름|씻|비우|털/.test(q)) return '흐름·비움';
  return '카로 전반';
}

export function calculateOmoKaroBodyArt(input: OmoKaroInput): OmoKaroResult {
  const now = input.now ?? new Date();
  const fate = input.profile?.fate ?? {};
  const q = (input.question ?? '').trim();
  const questionTopic = classifyOmoKaroTopic(q);
  const seedText = `${JSON.stringify(fate)}|${q}|${now.toISOString().slice(0, 10)}|omo-karo`;
  const h = stableHash(seedText);

  const motifIdx = h % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seedText}|companion`) % (MOTIFS.length - 1));
  const pigmentMotif = MOTIFS[motifIdx];
  const companionMotif = MOTIFS[(motifIdx + companionOffset) % MOTIFS.length];
  const mineralTone = MINERAL_TONES[(h >>> 3) % MINERAL_TONES.length];
  const ritualAction = RITUALS[motifIdx];
  const shadowWarning = OMO_KARO_SHADOWS[motifIdx];
  const reflectiveQuestion = QUESTIONS[motifIdx];
  const karoPigmentAxis = `${pigmentMotif.split('(')[0].trim()} ↔ ${companionMotif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-OMO-KARO-v2.3.0',
    calculatedAtKst: toKstIso(now),
    questionTopic,
    pigmentMotif,
    companionMotif,
    karoPigmentAxis,
    mineralTone,
    reflectionFocus: `강가의 흙과 재로 하루의 기운을 표현하고 저녁이면 씻어 내는 오모 계곡 카로 족의 회화처럼, 주 모티프와 동반 모티프('${companionMotif}')가 어우러져 지금은 '${mineralTone}'의 솔직한 표현이 어울립니다.`,
    ritualAction,
    shadowWarning,
    reflectiveQuestion,
    interpretiveBoundary: '에티오피아 오모 계곡 카로 족의 자연 안료 회화 문화를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOmoKaroPrompt(result: OmoKaroResult): string {
  return [
    `[오모 카로 진흙 회화 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 질문 맥락: ${result.questionTopic} | 안료 회화 축: ${result.karoPigmentAxis}`,
    `- 상징 모티프: ${result.pigmentMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 현재 결: ${result.mineralTone}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 과잉 경계: ${result.shadowWarning}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
