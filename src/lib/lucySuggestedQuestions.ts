import { safeSessionStorage } from '@/utils/safeStorage';

export const CASUAL_PROMPT_POOL = [
  '루시야, 오늘 하루를 어떻게 보내면 기분이 한결 좋아질까?',
  '요즘 생각이 너무 많은데 머릿속을 정리할 수 있는 좋은 질문을 던져줘.',
  '오늘 나에게 어울리는 행운의 컬러와 마음가짐은 무엇인지 알려줘.',
  '지금 이 순간 내 마음에 가장 필요한 따뜻한 위로는 무엇일까?',
  '오늘 하루를 특별하게 만들어줄 작은 실천 팁 하나만 알려줘.',
  '지친 나를 위해 따뜻한 차 한 잔 마시듯 마음을 포근하게 녹여줘.',
  '답답했던 마음을 시원하게 환기할 수 있는 긍정적인 생각법을 알려줘.',
  '오늘 밤 편안하게 푹 쉴 수 있는 다정한 힐링 한마디 부탁해.',
  '내 안의 불안을 가라앉히고 평온함을 되찾는 짧은 대화를 나누자.',
  '루시, 오늘 나 자신을 더 사랑할 수 있는 칭찬 한마디 해줄래?',
  '새로운 시작을 앞두고 용기를 북돋워 주는 따뜻한 조언을 듣고 싶어.',
  '지금 내 마음의 날씨를 알아차리고 다독여주는 시간을 가져보자.',
  '오늘 하루 소소하지만 확실한 행복을 찾는 비결은 무엇일까?',
  '루시의 눈으로 본 나의 가장 빛나는 장점은 무엇인지 말해줘.',
  '스트레스를 비우고 좋은 에너지를 채우는 오늘의 확언 한 줄을 들려줘!',
  '마음이 복잡할 때 호흡을 차분히 가다듬는 1분 이완법을 알려줘.',
  '인간관계에서 마음의 경계를 건강하게 지키는 방법은 무엇일까?',
  '오늘 나에게 일어날 수 있는 기분 좋은 우연과 행운은 무엇일지 알려줘.',
  '스스로에게 너무 엄격해질 때 나를 다정하게 안아주는 법을 알려줘.',
  '오늘 하루를 감사함으로 마무리하는 저녁 루틴을 추천해 줘.',
  '무기력할 때 작은 활력을 불어넣는 3분 기분 전환 팁을 알려줘.',
  '내 마음속 숨은 열정과 호기심을 깨우는 영감 질문을 던져줘.'
];

const promptKey = (account: string) => `lucy_suggested_questions:${account}`;

export function rememberLucySuggestedQuestions(account: string, prompts: string[]) {
  if (prompts.length) safeSessionStorage.setItem(promptKey(account), JSON.stringify(prompts.slice(0, 6)));
}

export function readLucySuggestedQuestions(account: string): string[] {
  try {
    const stored: unknown = JSON.parse(safeSessionStorage.getItem(promptKey(account)) || '[]');
    if (Array.isArray(stored)) {
      const prompts = stored.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())).slice(0, 6);
      if (prompts.length) return prompts;
    }
  } catch { /* A fresh tab uses questions from Lucy's shared pool. */ }
  return CASUAL_PROMPT_POOL.slice(0, 6);
}
