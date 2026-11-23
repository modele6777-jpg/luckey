import type { UserProfile } from '../sharedState';

export interface OccitanParatgeResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '품위·존엄' | '공존·대화' | '절제·균형' | '기쁨·여유' | '정성·진정성' | '파라트제 전반';
  paratgeVirtue: string;
  companionVirtue: string;
  paratgeBalanceAxis: string;
  troubadourInsight: string;
  languedocTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const VIRTUES = [
  {
    virtue: '파라트제(Paratge · 지위와 상관없는 대등한 존엄)',
    insight: '상대를 이기려 누르기보다 서로의 품위와 동등한 자리를 지켜 줄 때 비로소 깊어지는 관계',
    tone: '랑그독 언덕 위 하얀 석회암 성벽을 비추는 따뜻한 오후 햇살',
    action: '오늘 대화에서 내 주장을 조금만 부드럽게 다듬어, 상대의 품위와 이야기가 들어올 빈자리 하나를 열어 두세요.',
    question: '지금 내가 지키고 있는 선 가운데 서로의 품위(Paratge)를 세우며 조금 더 대등하게 열 수 있는 부분은 어디인가요?',
  },
  {
    virtue: '콘비벤시아(Convivència · 다름이 함께 숨 쉬는 공존)',
    insight: '나와 다른 생각이나 성향을 적으로 돌리지 않고 한 테이블 위에서 조화롭게 다루는 여유',
    tone: '툴루즈 안뜰 장미 덩굴 아래 나란히 놓인 두 개의 찻잔',
    action: '나와 결이 다른 의견 하나를 바로 반박하기보다, 그 생각이 나온 맥락을 오늘 한 번만 먼저 물어보세요.',
    question: '다름을 적으로 돌리지 않고 한 테이블 위에서 공존(Convivència)하게 만들 수 있는 대화의 자리는 어디인가요?',
  },
  {
    virtue: '메주라(Mesura · 넘치지 않는 균형과 절제)',
    insight: '감정이 뜨거울수록 한 박자 늦춰 적절한 선을 지킬 때 내 말에 힘이 실리는 지혜',
    tone: '올리브 밭 사이로 잔잔히 부는 남프랑스 미스트랄의 끝자락',
    action: '감정이 앞서려는 답장이나 결정 앞에서 5분만 호흡을 고르고 핵심 문장 한두 개만 남겨 보세요.',
    question: '감정이 뜨거워질수록 한 박자 늦춰 적절한 균형(Mesura)을 지킬 때 오히려 힘이 실릴 말은 무엇인가요?',
  },
  {
    virtue: '조이(Joi · 삶을 긍정하는 맑은 기쁨)',
    insight: '무거운 책임감 속에서도 작은 아름다움과 유머를 잃지 않을 때 되살아나는 창의력',
    tone: '라벤더 들판 너머로 울려 퍼지는 트루바두르의 류트 선율',
    action: '무거운 과업 사이에 좋아하는 음악 한 곡이나 산책 10분 같은 맑은 숨구멍을 오늘 일정에 꼭 끼워 넣으세요.',
    question: '책임감의 무게 속에서도 작은 유머와 맑은 기쁨(Joi)을 되살려 줄 오늘의 숨구멍은 무엇인가요?',
  },
  {
    virtue: '프레츠(Pretz · 진정성에서 우러나는 참된 가치)',
    insight: '남에게 보이기 위한 과장이 아니라 보이지 않는 자리에서도 정성을 다하는 태도',
    tone: '오래된 양피지 노래책에 정성스레 그려진 금빛 첫 글자',
    action: '누가 보지 않아도 마음이 놓이도록 오늘 내가 맡은 작은 일 하나의 마무리를 정성스레 다듬어 보세요.',
    question: '겉으로 드러나는 과장이 아니라 보이지 않는 자리의 정성(Pretz)으로 오래 지켜 가고 싶은 내 기준은 무엇인가요?',
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

const OCCITAN_SHADOWS = [
  '서로의 품위와 대등한 자리를 지키는 배려가 꼭 짚고 넘어가야 할 사실이나 책임을 흐리는 과도한 예의로 변질되지 않게 하세요.',
  '다름을 한 테이블 위에 올려두는 공존이 내 핵심 기준과 안전한 경계선까지 무조건 양보해야 한다는 압박이 되어서는 안 됩니다.',
  '감정을 한 박자 늦추는 절제(Mesura)가 정작 말해야 할 진심과 불편함마저 속으로 삼키는 억압이 되지 않게 살피세요.',
  '작은 기쁨(Joi)과 숨구멍을 챙기는 여유가 마무리지어야 할 약속과 우선순위를 뒤로 미루는 현실 도피로 흐르지 않게 균형을 잡으세요.',
  '보이지 않는 자리의 정성(Pretz)을 다하는 태도가 남의 시선을 의식해 작은 디테일에 끝없이 매달리는 완벽주의 소진으로 이어지지 않게 하세요.',
];

function classifyOccitanTopic(q: string): OccitanParatgeResult['questionTopic'] {
  if (/품위|존엄|대등|자리/.test(q)) return '품위·존엄';
  if (/공존|다름|대화|의견/.test(q)) return '공존·대화';
  if (/균형|절제|감정|선/.test(q)) return '절제·균형';
  if (/기쁨|유머|산책|음악/.test(q)) return '기쁨·여유';
  if (/정성|진정|마무리|기준/.test(q)) return '정성·진정성';
  return '파라트제 전반';
}

export function calculateOccitanTroubadourParatge(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OccitanParatgeResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyOccitanTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % VIRTUES.length;
  const picked = VIRTUES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (VIRTUES.length - 1));
  const companion = VIRTUES[(idx + companionOffset) % VIRTUES.length];
  const paratgeBalanceAxis = `${picked.virtue.split('(')[0].trim()} ↔ ${companion.virtue.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-OCCITAN-PARATGE-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    paratgeVirtue: picked.virtue,
    companionVirtue: companion.virtue,
    paratgeBalanceAxis,
    troubadourInsight: picked.insight,
    languedocTone: picked.tone,
    reflectionFocus: `남프랑스 옥시타니아의 '${picked.virtue}'을 중심에 두고 '${companion.virtue}'의 결을 곁들여, 나와 상대방 모두의 품위를 지키는 균형(Mesura)과 다정한 공존의 선을 찾아보세요.`,
    ritualAction: picked.action,
    shadowWarning: OCCITAN_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '남프랑스 옥시타니아 트루바두르의 파라트제(Paratge)·공존(Convivència) 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOccitanParatgePrompt(res: OccitanParatgeResult): string {
  return [
    `[옥시타니아 트루바두르 파라트제 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 파라트제 균형 축: ${res.paratgeBalanceAxis}`,
    `- 핵심 미덕: ${res.paratgeVirtue} (${res.languedocTone})`,
    `- 동반 미덕: ${res.companionVirtue}`,
    `- 중심 통찰: ${res.troubadourInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
