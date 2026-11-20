import type { UserProfile } from '../sharedState';

export interface AssyrianNinevehResult {
  engineVersion: string;
  calculatedAtKst: string;
  tabletSeal: string;
  companionSeal: string;
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
  const picked = SEALS[idx];
  const companion = SEALS[companionIdx];

  return {
    engineVersion: 'LUCKEY-ASSYRIAN-NINEVEH-v2.2.0',
    calculatedAtKst: formatKstStandard(now),
    tabletSeal: picked.seal,
    companionSeal: companion.seal,
    ninevehInsight: picked.insight,
    tigrisTone: picked.tone,
    reflectionFocus: `아시리아 니네베 서고의 '${picked.seal}'을 중심축으로 삼고 '${companion.seal}'의 절제를 더해, 머릿속 생각을 짧은 기록과 선명한 기준으로 세워 보세요.`,
    ritualAction: picked.ritual,
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
    `- 중심 통찰: ${res.ninevehInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
