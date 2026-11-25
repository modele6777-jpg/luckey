import type { UserProfile } from '../sharedState';

export interface AssyrianNinevehResult {
  engineVersion: string;
  calculatedAtKst: string;
  tabletSeal: string;
  companionSeal: string;
  archiveCycle: string;
  questionTopic: 'clarity' | 'boundary' | 'work' | 'general';
  ninevehCrossAxis: string;
  shadowWarning: string;
  ninevehInsight: string;
  tigrisTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const SEALS = [
  {
    seal: '니네베 서고의 점토판(Clay Tablet · 흩어지는 말을 젖은 흙 위에 또렷이 새김)',
    insight: '머릿속에서만 맴도는 고민을 짧은 문장으로 적어 두면 막연한 불안이 선명한 과제로 바뀜',
    tone: '티그리스 강변 아슈르바니팔 서고의 서늘한 석조 회랑과 정갈히 쌓인 쐐기문자 서판',
    ritual: '오늘 나를 가장 헷갈리게 하던 문제 하나를 세 줄 이내의 짧은 문장으로 적어 선명하게 정리해 보세요.',
    question: '지금 내 머릿속에서 실체보다 크게 부풀어 있던 걱정을 글로 적어 본다면, 실제로 남은 핵심은 무엇일까요?',
  },
  {
    seal: '라맛수(Lamassu · 문턱을 지키는 묵직한 수호자의 시선)',
    insight: '누구에게나 내 마음의 중심을 열어 주기 전에 지금 들일 것과 걸러낼 것을 차분히 살핌',
    tone: '황혼녘 성문 양쪽에서 고요히 빛나는 날개 달린 석조 수호상',
    ritual: '오늘 나의 시간과 에너지를 지키는 문턱 하나를 정해 불필요한 요청을 정중히 미뤄 보세요.',
    question: '지금 내 마음의 성문 안으로 무작정 들이지 말고 문턱에서 먼저 살펴야 할 말이나 일정은 무엇인가요?',
  },
  {
    seal: '물라핀 천문표(MUL.APIN · 밤하늘의 규칙을 기록하며 내일을 읽는 끈기)',
    insight: '한 번의 기분 변화에 흔들리지 않고 내 일상의 패턴을 꾸준히 관찰할 때 해답이 보임',
    tone: '니네베 지구라트 꼭대기에서 맑은 메소포타미아 밤하늘을 바라보는 천문학자의 시선',
    ritual: '오늘 하루 중 내 집중력과 기분이 가장 맑았던 시간대를 한 줄로 기록해 두세요.',
    question: '단발적인 기분의 오르내림 너머로, 최근 내 일상에서 반복되며 신호를 보내고 있는 패턴은 무엇인가요?',
  },
  {
    seal: '서기관의 갈대 첨필(Stylus · 서두름 없이 한 획씩 눌러 찍는 정밀함)',
    insight: '한꺼번에 큰 그림을 바꾸려 하기보다 지금 내 손끝의 한 획을 정확히 찍는 편이 빠름',
    tone: '부드러운 점토판 위에 쐐기 자국을 또렷하게 남기는 맑고 규칙적인 손놀림',
    ritual: '큰 계획을 세우기보다 지금 바로 손댈 수 있는 가장 작은 작업 한 획을 15분 안에 끝내 보세요.',
    question: '완벽한 전체 그림을 기다리느라 미루고 있지만, 지금 당장 또렷하게 찍을 수 있는 한 획은 무엇인가요?',
  },
  {
    seal: '이슈타르 성문의 청금석(Lapis Lazuli · 어둠 속에서도 빛나는 깊은 푸른 결단)',
    insight: '주변의 웅성거림이 잦아든 뒤에야 비로소 내가 진짜 지키고 싶은 가치가 선명해짐',
    tone: '유약을 구워 낸 깊은 코발트빛 벽돌 위로 비치는 사막의 별빛',
    ritual: '잠시 화면과 알림을 끄고 5분간 고요히 앉아 오늘 내가 끝까지 지킬 기준 하나만 골라 보세요.',
    question: '주변의 소음이 모두 멈춘 밤에 떠올려 볼 때, 지금 내가 결코 흐트러뜨리고 싶지 않은 원칙은 무엇인가요?',
  },
];

function formatKstStandard(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const ARCHIVE_CYCLES = [
  '점토 반죽의 국면 (복잡한 생각을 짧은 문장 재료로 다듬기)',
  '갈대 첨필의 국면 (서두르지 않고 한 획씩 정확하게 실행)',
  '물라핀 대조의 국면 (감정의 파동 대신 반복 패턴을 기록으로 확인)',
  '서고 봉인의 국면 (불필요한 잡음을 닫고 핵심 원칙만 보관)',
];

const NINEVEH_SHADOW_WARNINGS = [
  '기록과 정리에만 머물러 정작 첫 행동을 시작하는 시점을 놓치지 마세요.',
  '문턱을 너무 높게 세워 도움이 될 협업 기회까지 돌려보내지 않도록 살피세요.',
  '패턴을 분석하다가 지금 눈앞의 예외적 신호를 무시하지 않도록 주의하세요.',
  '한 획의 완벽함을 추구하느라 전체 흐름이 멈추지 않도록 마침표도 함께 정하세요.',
  '원칙을 지키는 단단함이 고집으로 변하지 않도록 유연한 질문 하나를 곁들이세요.',
];

export function calculateAssyrianNinevehClayTablet(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AssyrianNinevehResult {
  const now = params.now ?? new Date();
  const baseSeed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(baseSeed) % SEALS.length;
  const companionOffset = 1 + (stableHash(`${baseSeed}|companion`) % (SEALS.length - 1));
  const companionIdx = (idx + companionOffset) % SEALS.length;
  const cycleIdx = stableHash(`${baseSeed}|cycle`) % ARCHIVE_CYCLES.length;
  const picked = SEALS[idx];
  const companion = SEALS[companionIdx];
  const archiveCycle = ARCHIVE_CYCLES[cycleIdx];
  const shadowWarning = NINEVEH_SHADOW_WARNINGS[idx];
  const q = (params.question ?? '').trim();
  const questionTopic: AssyrianNinevehResult['questionTopic'] = !q
    ? 'general'
    : /기록|정리|생각|고민|패턴|헷갈/.test(q)
      ? 'clarity'
      : /경계|거절|요청|사람|관계|문턱/.test(q)
        ? 'boundary'
        : /일|업무|계획|실행|진로|작업/.test(q)
          ? 'work'
          : 'general';
  const ninevehCrossAxis = `${questionTopic} · ${picked.seal.split('(')[0].trim()} × ${archiveCycle.split('(')[0].trim()}`;

  return {
    engineVersion: 'LUCKEY-ASSYRIAN-NINEVEH-v2.4.0',
    calculatedAtKst: formatKstStandard(now),
    tabletSeal: picked.seal,
    companionSeal: companion.seal,
    archiveCycle,
    questionTopic,
    ninevehCrossAxis,
    shadowWarning,
    ninevehInsight: picked.insight,
    tigrisTone: picked.tone,
    reflectionFocus: `아시리아 니네베 서고의 '${picked.seal}'을 중심축으로 삼고 '${companion.seal}'의 절제를 더해 '${archiveCycle}'에서 머릿속 생각을 짧은 기록과 선명한 기준으로 세워 보세요.`,
    ritualAction: `${picked.ritual} (${companion.seal.split('(')[0].trim()} 관점도 함께 적용해 보세요.)`,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 아시리아 니네베 서고의 점토 서판·물라핀(MUL.APIN) 기록 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAssyrianNinevehPrompt(res: AssyrianNinevehResult): string {
  return [
    `[아시리아 니네베·점토 서판 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 서고 상징: ${res.tabletSeal} (${res.tigrisTone})`,
    `- 보조 인장: ${res.companionSeal}`,
    `- 서고 기록 국면: ${res.archiveCycle}`,
    `- 질문 맥락(${res.questionTopic}) · 니네베 교차 축: ${res.ninevehCrossAxis}`,
    `- 과잉·지연 경계: ${res.shadowWarning}`,
    `- 중심 통찰: ${res.ninevehInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
