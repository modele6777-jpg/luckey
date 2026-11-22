export const ORB_MASTERS = [
  { id: 'saju', name: '사주', voice: 'Kore', tone: '차분한 목소리', topic: '원국, 일, 돈, 시기', focus: '사주 원국과 대운만 상담해. 일, 돈, 시기를 아래 계산으로 풀어. 타로나 별자리로 새지 마.' },
  { id: 'tarot', name: '타로', voice: 'Aoede', tone: '부드러운 목소리', topic: '과거, 지금, 앞으로', focus: '타로 세 장만 상담해. 순서는 과거, 지금, 앞으로야. 사주 원국을 풀지 마.' },
  { id: 'astro', name: '점성', voice: 'Sulafat', tone: '따뜻한 목소리', topic: '별과 관계', focus: '별과 관계, 오늘의 흐름만 상담해. 사주 숫자나 카드 이름으로 단정하지 마.' },
  { id: 'heart', name: '마음', voice: 'Puck', tone: '밝은 목소리', topic: '감정과 숨', focus: '감정과 숨만 상담해. 점괘를 하지 말고, 지금 가벼운 한 가지를 함께 찾아.' },
] as const;

export type OrbMaster = (typeof ORB_MASTERS)[number];

const VOICES = new Set<string>(ORB_MASTERS.map(master => master.voice));

export function orbVoice(voice: string): string {
  return VOICES.has(voice) ? voice : 'Kore';
}
