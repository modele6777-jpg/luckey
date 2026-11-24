import type { UserProfile } from '../sharedState';

export interface UzbekMahallaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '연대·안부' | '숙성·인내' | '환대·여유' | '과정·정성' | '협동·기쁨' | '우즈베크 전반';
  mahallaVirtue: string;
  companionVirtue: string;
  rishtanInsight: string;
  ferganaTone: string;
  rishtanGlazeAxis: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const VIRTUES = [
  {
    virtue: '마할라의 이웃 온기(Mahalla · 담장을 낮추고 안부를 묻는 연대)',
    insight: '큰 해결책보다 곁의 사람과 주고받는 소박한 안부 한 마디가 마음을 든든하게 지탱함',
    tone: '플라타너스(Chinar) 나무 그늘 아래 차이하나(Choyxona)에서 피어오르는 녹차 향',
    axis: '담장을 낮추고 안부를 나누어 마음을 지탱하는 이웃 온기의 축',
    shadow: '곁의 안부와 정을 챙기느라 정작 지금 내가 집중해야 할 개인 과제의 선을 흐리지 않게 주의하세요.',
    action: '오늘 가까운 사람에게 거창한 이유 없이 가벼운 안부 한 마디를 먼저 건네 보세요.',
    question: '혼자 큰 해결책을 찾느라 정작 곁에 있는 사람과 나누지 못했던 따뜻한 안부는 무엇인가요?',
  },
  {
    virtue: '리시탄 청자(Rishtan · 불을 견디며 깊어지는 코발트빛 유약)',
    insight: '까다로운 시간과 기다림을 통과할수록 내면의 빛깔이 더 맑고 단단해짐',
    tone: '페르가나 분지의 맑은 석영 유약이 가마 속에서 빚어낸 깊은 청록빛',
    axis: '가마의 열기를 통과해 맑은 유약 빛깔로 굳어지는 숙성 인내의 축',
    shadow: '기다리고 숙성시키는 태도가 당장 점검하고 수정해야 할 기술적·현실적 결함을 덮어 두지 않게 살피세요.',
    action: '지금 지나고 있는 까다로운 과정 하나를 "유약이 굳는 가마의 시간"으로 바라보며 조급함을 한 숨 늦춰 보세요.',
    question: '당장은 뜨겁고 까다롭지만 잘 견뎌 내고 나면 내 안의 가장 맑은 빛깔로 남을 경험은 무엇인가요?',
  },
  {
    virtue: '메흐몬도스트릭(Mehmondoʻstlik · 기꺼이 자리를 내어주는 환대)',
    insight: '내 마음의 공간에 여유가 있을 때 낯선 기회와 좋은 인연도 편하게 머무를 수 있음',
    tone: '따뜻하게 구워 낸 논(Non) 빵을 여럿이 나누어 떼어 먹는 소박한 식탁',
    axis: '마음의 빈 자리를 열어 낯선 기회와 인연을 들이는 환대 여백의 축',
    shadow: '누구나 들어올 수 있게 자리를 비워 두다 보면 정작 내 휴식과 핵심 우선순위가 밀려날 수 있어요.',
    action: '오늘 하루 일정 중 15분만 아무것도 채우지 않은 빈 자리로 남겨 두고 예상 밖의 숨통을 틔워 보세요.',
    question: '빈틈없이 채워 둔 일정과 생각 속에서, 새로운 기회나 인연이 머물 수 있도록 비워 둘 자리는 어디인가요?',
  },
  {
    virtue: '우스타즈·쇼기르드(Ustoz-Shogird · 손끝으로 이어지는 정성)',
    insight: '서두름 없이 한 단계씩 배움과 정성을 쌓아 올릴 때 실력이 몸에 배어듦',
    tone: '물레 위에서 천천히 형태를 잡는 도공의 고요하고 일정한 손놀림',
    axis: '결과를 재촉하지 않고 한 단계씩 손끝에 익히는 정성 수련의 축',
    shadow: '한 단계씩 다듬고 완성도를 높이는 데 몰두하다 전체 일정의 마감이나 방향 전환 타이밍을 놓치지 마세요.',
    action: '지금 손에 쥔 일을 결과부터 재촉하지 말고, 첫 단계 하나만 한 호흡 천천히 정성껏 마무리해 보세요.',
    question: '지금 내가 조급하게 결과를 재촉하느라 놓치고 있는, 과정 속의 정성과 곁의 온기는 무엇인가요?',
  },
  {
    virtue: '하샤르(Hashar · 여럿이 힘을 모아 한 번에 빚는 기쁨)',
    insight: '혼자 끌고가려 하면 막막하던 일도 마음을 맞추면 가볍고 즐겁게 풀림',
    tone: '오후 햇살 아래 마당을 함께 정리하며 나누는 담백한 웃음소리',
    axis: '여럿이 손을 보태 무거운 짐을 가볍게 넘기는 공동 작업의 축',
    shadow: '함께 힘을 모으는 과정에서 누가 어떤 부분을 책임지고 마무리할지 경계가 모호해지지 않게 정리하세요.',
    action: '혼자 짊어지고 있던 일 중 하나를 오늘 주변과 역할을 나누거나 도움을 청해 가볍게 풀어 보세요.',
    question: '혼자 끌고 가느라 막막해 보였지만 여럿이 마음을 맞추면 의외로 즐겁게 풀릴 일은 무엇인가요?',
  },
];

function classifyUzbekTopic(q: string): UzbekMahallaResult['questionTopic'] {
  if (/안부|이웃|연대|온기|곁/.test(q)) return '연대·안부';
  if (/기다|인내|가마|시간|단단/.test(q)) return '숙성·인내';
  if (/여유|환대|빈|자리|기회/.test(q)) return '환대·여유';
  if (/정성|과정|단계|배움|손끝/.test(q)) return '과정·정성';
  if (/함께|협동|나누|도움|기쁨/.test(q)) return '협동·기쁨';
  return '우즈베크 전반';
}

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

export function calculateUzbekMahallaRishtanCraft(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): UzbekMahallaResult {
  const now = params.now ?? new Date();
  const questionText = (params.question ?? '').trim();
  const questionTopic = classifyUzbekTopic(questionText);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${questionText}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % VIRTUES.length;
  const picked = VIRTUES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (VIRTUES.length - 1));
  const companion = VIRTUES[(idx + companionOffset) % VIRTUES.length];

  return {
    engineVersion: 'LUCKEY-UZBEK-MAHALLA-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    mahallaVirtue: picked.virtue,
    companionVirtue: companion.virtue,
    rishtanInsight: picked.insight,
    ferganaTone: picked.tone,
    rishtanGlazeAxis: picked.axis,
    reflectionFocus: `우즈베크 마할라·리시탄 전통의 '${picked.virtue}'을 중심에 두고 '${companion.virtue}'의 결을 곁들여 정성껏 마음의 넉넉함을 회복해 보세요.`,
    ritualAction: picked.action,
    shadowWarning: picked.shadow,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '우즈베키스탄의 마할라(Mahalla) 공동체 윤리와 리시탄(Rishtan) 도예 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatUzbekMahallaPrompt(res: UzbekMahallaResult): string {
  return [
    `[우즈베크 마할라·리시탄 도기 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 생활 지혜: ${res.mahallaVirtue} (${res.ferganaTone})`,
    `- 유약 균형 축: ${res.rishtanGlazeAxis}`,
    `- 동반 지혜: ${res.companionVirtue}`,
    `- 중심 통찰: ${res.rishtanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
