import type { UserProfile } from '../sharedState';

export interface OromoGadaaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '경계·존중' | '순환·역할' | '평화·대화' | '이양·신뢰' | '감사·전환' | '가다 전반';
  gadaaCycle: string;
  companionCycle: string;
  gadaaSaffuuAxis: string;
  saffuuInsight: string;
  highlandTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CYCLES = [
  {
    cycle: '사푸(Saffuu · 서로의 선을 지키는 도덕적 균형)',
    insight: '자신과 타인, 자연 사이의 적정한 거리를 존중할 때 불필요한 마찰이 줄어듦',
    tone: '에티오피아 고원의 맑은 아침 공기와 붉은 흙길 위의 오다(Odaa) 무화과나무',
    action: '관계와 일정에서 침범받지 않아야 할 내 경계 한 가지와 존중해야 할 상대의 선 한 가지를 오늘 분명히 해 두세요.',
    question: '자신과 타인 사이의 적정한 거리(Saffuu)를 지켜 불필요한 마찰을 줄일 수 있는 자리는 어디인가요?',
  },
  {
    cycle: '가다 8년 주기(Gadaa · 때에 맞춰 역할을 넘기고 받는 순환)',
    insight: '모든 것을 끝까지 쥐고 있으려 하지 않고 지금 내 계절에 맞는 몫만 성실히 감당함',
    tone: '일정한 주기로 물길을 바꾸어 밭을 적시는 고원의 계곡물',
    action: '오늘 내가 지나치게 껴안고 있던 걱정 하나를 내려놓고, 지금 내 계절에 맞는 한 가지 역할에만 집중해 보세요.',
    question: '지금 내가 모든 걸 다 짊어지려 애쓰는 대신, 때의 순환에 맡기고 한 걸음 물러나면 무엇이 편안해질까요?',
  },
  {
    cycle: '나가야(Nagaya · 내면과 공동체의 평화)',
    insight: '조급한 다툼을 멈추고 먼저 평화의 인사를 건네는 쪽이 관계의 주도권을 회복함',
    tone: '오다 나무 그늘 아래 모여앉아 차분히 의견을 모으는 원형 회의',
    action: '조급하게 결론을 밀어붙이려던 대화에서 잠시 멈춰 평온한 어조로 상대의 입장을 먼저 들어 보세요.',
    question: '다툼을 멈추고 먼저 평화의 인사(Nagaya)를 건네며 주도권을 회복할 수 있는 관계는 누구인가요?',
  },
  {
    cycle: '발리(Baallii · 책임 있는 이양과 신뢰)',
    insight: '내가 다 해내야 한다는 부담을 덜고 믿을 수 있는 흐름에 다음 단계를 맡기는 여유',
    tone: '아침 해가 떠오르며 황금빛으로 물드는 광활한 고원 초지',
    action: '내 손에서 떠나도 괜찮은 일 한 가지를 오늘 신뢰할 수 있는 사람이나 시스템에 맡겨 보세요.',
    question: '내가 끝까지 붙들고 있던 부담 중에서, 다음 단계의 흐름에 믿고 넘겨도(Baallii) 괜찮을 일은 무엇인가요?',
  },
  {
    cycle: '이레차(Irreechaa · 계절의 전환에 대한 감사)',
    insight: '긴 우기가 지나고 맑은 건기가 열리는 마디에서 지나온 수고에 감사하며 마음을 비움',
    tone: '푸른 풀잎을 손에 쥐고 흐르는 강가에서 새 계절을 맞이하는 평온함',
    action: '지나온 한 주 동안 내가 버텨 낸 수고 한 가지를 스스로 인정하고 감사한 마음으로 마음을 가볍게 비워 보세요.',
    question: '긴 우기를 지나 새 계절을 맞는 마디에서, 지나온 내 수고에 감사하며 가볍게 비워 둘 마음은 무엇인가요?',
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

const OROMO_SHADOWS = [
  '서로의 선을 지키는 사푸(Saffuu)의 균형이 필요한 협력이나 솔직한 도움 요청까지 딱딱하게 막아 두는 벽이 되지 않게 하세요.',
  '때에 맞춰 몫을 나누는 가다 순환이 지금 내가 마땅히 책임져야 할 자리까지 "때가 아니다"라며 회피하는 구실이 되어서는 안 됩니다.',
  '먼저 평화의 인사를 건네는 나가야(Nagaya)의 태도가 내 권리나 사실관계를 무조건 양보하고 묻어 두는 침묵으로 흐르지 않게 균형을 잡으세요.',
  '믿고 맡기는 이양(Baallii)이 진행 상황을 전혀 살피지 않고 손을 떼는 무책임한 방임이 되지 않도록 최소한의 확인선은 남기세요.',
  '지나온 수고에 감사하며 비우는 이레차(Irreechaa)의 여유가 다음 계절을 준비하는 구체적인 정리와 계획까지 생략하는 방심이 되지 않게 살피세요.',
];

function classifyOromoTopic(q: string): OromoGadaaResult['questionTopic'] {
  if (/경계|선|거리|존중/.test(q)) return '경계·존중';
  if (/계절|역할|순환|몫/.test(q)) return '순환·역할';
  if (/평화|다툼|대화|입장/.test(q)) return '평화·대화';
  if (/이양|맡기|신뢰|부담/.test(q)) return '이양·신뢰';
  if (/감사|비우|전환|수고/.test(q)) return '감사·전환';
  return '가다 전반';
}

export function calculateOromoGadaaSaffuuHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OromoGadaaResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyOromoTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CYCLES.length;
  const picked = CYCLES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (CYCLES.length - 1));
  const companion = CYCLES[(idx + companionOffset) % CYCLES.length];
  const gadaaSaffuuAxis = `${picked.cycle.split('(')[0].trim()} ↔ ${companion.cycle.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-OROMO-GADAA-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    gadaaCycle: picked.cycle,
    companionCycle: companion.cycle,
    gadaaSaffuuAxis,
    saffuuInsight: picked.insight,
    highlandTone: picked.tone,
    reflectionFocus: `오로모 가다 전통의 '${picked.cycle}'을 중심에 두고 '${companion.cycle}'의 결을 곁들여, 지금 내 계절에 맞는 몫만 성실히 감당하며 관계의 평화(Nagaya)와 존중의 거리를 지켜 보세요.`,
    ritualAction: picked.action,
    shadowWarning: OROMO_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '동아프리카 오로모(Oromo)의 가다(Gadaa) 순환 질서·사푸(Saffuu) 균형 윤리를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatOromoGadaaPrompt(res: OromoGadaaResult): string {
  return [
    `[오로모 가다·사푸 윤리 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 가다·사푸 축: ${res.gadaaSaffuuAxis}`,
    `- 순환 원칙: ${res.gadaaCycle} (${res.highlandTone})`,
    `- 동반 원칙: ${res.companionCycle}`,
    `- 중심 통찰: ${res.saffuuInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
