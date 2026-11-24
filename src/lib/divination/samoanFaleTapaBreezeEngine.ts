import type { UserProfile } from '../sharedState';

export interface SamoanFaleResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '개방·통풍' | '유연·결속' | '다듬기·타파' | '배려·나눔' | '평온·라군' | '사모아 전반';
  samoanMotif: string;
  companionMotif: string;
  faleBreezeAxis: string;
  samoanInsight: string;
  faleTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '사방이 트인 팔레 지붕(Open Fale · 벽 없이 둥근 지붕과 기둥만 두어 바닷바람이 막힘없이 통함)',
    insight: '숨길 것과 방어벽이 너무 많으면 답답해지지만, 바람이 통하도록 열어 두면 마음이 늘 시원함',
    tone: '남태평양 사모아 해변가, 벽이 없는 둥근 팔레 지붕 아래로 야자수 바람이 불어오는 아침',
    action: '오늘 혼자 끙끙 앓던 생각 하나를 믿을 수 있는 사람과 가볍게 나누어 바람을 쐬어 주세요.',
    question: '태풍을 막겠다고 내가 사방에 벽을 세웠다가, 정작 시원한 바람까지 막아 버린 곳은 어디인가요?',
  },
  {
    motif: '코코넛 섬유 밧줄 매듭(Afa Lashing · 못 하나 없이 시닛 밧줄로 대들보를 엮어 태풍을 견딤)',
    insight: '단단한 쇠못보다 팽팽하면서도 탄력 있게 엮인 유연한 결속이 큰 바람을 더 잘 버텨 냄',
    tone: '둥근 나무 기둥을 촘촘히 감싼 갈색 코코넛 밧줄 매듭이 햇빛을 받아 반짝이는 오전',
    action: '오늘 내 일정을 쇠못처럼 뻣뻣하게 고정하기보다, 작은 여유 시간 하나를 엮어 유연한 탄력을 만들어 보세요.',
    question: '부러지지 않고 바람을 견디는 코코넛 밧줄처럼, 지금 내 계획에서 조금 더 유연하게 엮어야 할 매듭은 무엇인가요?',
  },
  {
    motif: '시아포 타파 천의 두드림(Siapo Barkcloth · 뽕나무 껍질을 두드려 넓고 부드러운 천을 만듦)',
    insight: '좁고 뻣뻣해 보이던 재료도 정성껏 두드리고 펴 주면 훨씬 넓고 따뜻한 쓰임새로 거듭남',
    tone: '맑은 시냇가 근처에서 나무 망치 소리가 일정한 박자로 울려 퍼지는 낮',
    action: '서툴거나 뻣뻣해 보여 미뤄 둔 작업 하나를 오늘 15분만 차분히 두드려 펴듯 다듬어 보세요.',
    question: '처음엔 좁고 거칠어 보였지만, 정성껏 손길을 더하면 훨씬 넓은 쓰임새로 펴질 내 안의 재료는 무엇인가요?',
  },
  {
    motif: '파아 사모아의 존중(Fa’a Samoa · 가족과 이웃의 체면과 마음을 먼저 헤아리며 나눔)',
    insight: '나 혼자 앞질러 얻는 이득보다, 곁에 있는 사람과 기쁨을 나눌 때 자리 전체가 풍요로워짐',
    tone: '둥근 돗자리 위에 열대 과일과 꽃목걸이가 놓이고 정겨운 인사가 오가는 오후',
    action: '오늘 곁의 사람에게 먼저 따뜻한 안부를 건네거나 작은 호의를 나누며 자리의 공기를 밝혀 보세요.',
    question: '내 몫만 앞세우기보다 곁의 체면과 마음을 함께 헤아릴 때 오히려 더 깊어질 관계는 누구와의 사이인가요?',
  },
  {
    motif: '라군 너머의 산호초 파도(Reef Horizon · 먼 바다의 파도가 부서지며 하얀 거품 선을 그림)',
    insight: '멀리서 들리는 파도 소리에 미리 겁먹기보다, 지금 내가 선 고요한 모래톱을 믿고 바라보면 됨',
    tone: '해 질 녘 분홍빛 하늘 아래 산호초 너머로 하얀 파도가 잔잔히 부서지는 저녁',
    action: '아직 오지 않은 먼 걱정 하나를 내려놓고, 지금 내가 발 딛고 있는 오늘의 고요한 모래톱에 집중해 보세요.',
    question: '먼 산호초 너머의 파도 소리에 미리 지레 겁먹느라 놓치고 있는 지금 눈앞의 평온함은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const SAMOAN_SHADOWS = [
  '팔레 지붕처럼 사방을 열어 두는 개방성이 꼭 지켜야 할 사생활이나 내 에너지의 최소 경계까지 무방비로 드러내는 노출이 되지 않게 하세요.',
  '코코넛 밧줄처럼 유연하게 엮는 탄력이 정작 명확한 마감이나 핵심 원칙을 지키는 데 필요한 단단함까지 느슨하게 만들어서는 안 됩니다.',
  '시아포 천을 두드려 펴듯 서툴고 거친 것을 다듬는 정성이 이미 충분한 단계에서도 끝없이 손질만 반복하는 완벽주의가 되지 않게 살피세요.',
  '파아 사모아의 존중과 배려가 내 진짜 의사나 필요한 요구조차 말하지 못하고 상대 체면만 살피는 자기 억압이 되지 않게 균형을 잡으세요.',
  '라군 너머 파도를 바라보며 현재의 평온을 지키는 여유가 실제로 다가오는 변화나 대비해야 할 신호까지 외면하는 안이함이 되지 않게 주의하세요.',
];

function classifySamoanTopic(q: string): SamoanFaleResult['questionTopic'] {
  if (/바람|열어|벽|소통/.test(q)) return '개방·통풍';
  if (/매듭|밧줄|유연|일정/.test(q)) return '유연·결속';
  if (/다듬|타파|서툴|두드/.test(q)) return '다듬기·타파';
  if (/배려|나눔|이웃|안부/.test(q)) return '배려·나눔';
  if (/파도|걱정|라군|평온/.test(q)) return '평온·라군';
  return '사모아 전반';
}

export function calculateSamoanFaleTapaBreeze(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SamoanFaleResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifySamoanTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const faleBreezeAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-SAMOAN-FALE-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    samoanMotif: picked.motif,
    companionMotif: companion.motif,
    faleBreezeAxis,
    samoanInsight: picked.insight,
    faleTone: picked.tone,
    reflectionFocus: `사모아 팔레 지붕의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 불필요한 벽을 세우기보다 시원한 바람이 통하도록 마음을 열어 보세요.`,
    ritualAction: picked.action,
    shadowWarning: SAMOAN_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '남태평양 사모아의 팔레(Fale) 개방형 지붕과 파아 사모아 공동체 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSamoanFalePrompt(res: SamoanFaleResult): string {
  return [
    `[사모아·팔레 바람 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 팔레 통풍 축: ${res.faleBreezeAxis}`,
    `- 사모아 모티프: ${res.samoanMotif} (${res.faleTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.samoanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
