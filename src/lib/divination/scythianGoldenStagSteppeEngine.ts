import type { UserProfile } from '../sharedState';

export interface ScythianGoldenStagResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '도약·기동' | '원칙·화덕' | '개방·교차' | '절단·명료' | '장기·시야' | '초원 전반';
  steppeEmblem: string;
  companionEmblem: string;
  goldenStagAxis: string;
  stagInsight: string;
  kurganTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const EMBLEMS = [
  {
    emblem: '황금 사슴(Golden Stag · 비상하는 초원의 기상)',
    insight: '무거운 자리에 갇히지 않고 가볍고 기민하게 다음 국면으로 뛰어오르는 유연한 결단',
    tone: '유라시아 초원의 새벽 안개를 뚫고 빛나는 황금빛 사슴 뿔',
    action: '오늘 나를 가장 무겁게 붙잡고 있던 미완료 목록 중 하나를 깔끔하게 완료하거나 과감히 뒤로 미루어 가벼워지세요.',
    question: '지금 내가 굳이 짊어지고 있느라 기민한 도약을 망설이게 만드는 불필요한 짐은 무엇인가요?',
  },
  {
    emblem: '타바티(Tabiti · 꺼지지 않는 화덕의 중심)',
    insight: '아무리 멀리 이동하더라도 내 마음의 화덕과 핵심 원칙만큼은 따뜻하게 지켜내는 힘',
    tone: '별이 쏟아지는 초원 밤하늘 아래 타오르는 화덕의 불꽃',
    action: '변화가 많은 일정 속에서도 오늘만큼은 절대 흔들리지 않고 지킬 나만의 핵심 원칙 한 가지를 적어 보세요.',
    question: '주변 환경이 빠르게 바뀌는 가운데서도 내가 결코 식히지 말아야 할 마음속 화덕의 중심은 무엇인가요?',
  },
  {
    emblem: '스킬레스(Skyles)의 두 시선 · 경계를 잇는 감각',
    insight: '서로 다른 방식과 문화 사이에서 편견 없이 좋은 점을 취해 내 것으로 녹여내는 개방성',
    tone: '흑해 연안과 초원이 만나는 항구의 활기찬 바람',
    action: '평소와 다른 방식이나 의견 하나를 바로 닫지 말고 "여기서 취할 좋은 점 한 가지는 무엇일까" 질문해 보세요.',
    question: '서로 달라 보이는 두 관점 사이에서 내가 편견을 내려놓을 때 새롭게 연결될 수 있는 지점은 어디인가요?',
  },
  {
    emblem: '아키나케스(Akinakes)의 명료한 절단',
    insight: '애매하게 끌어오던 미련이나 불필요한 군더더기를 깔끔하게 정리해 가벼워지는 용기',
    tone: '햇빛을 받아 반짝이는 정교한 청동과 황금의 선',
    action: '애매한 상태로 오래 끌고 있던 작은 선택 하나를 오늘 명확히 끝맺거나 내려놓아 보세요.',
    question: '미련 때문에 계속 붙잡고 있지만 사실은 깔끔히 끊어 내야 다음 걸음이 가벼워질 일은 무엇인가요?',
  },
  {
    emblem: '쿠르간(Kurgan) 언덕의 긴 시야',
    insight: '당장 눈앞의 작은 승패보다 긴 세월이 지난 뒤에도 부끄럽지 않을 궤적을 그리는 태도',
    tone: '끝없는 황금빛 풀밭 위로 길게 드리워진 오후의 구름 그림자',
    action: '오늘 내릴 선택 하나를 1년 뒤의 내가 돌아봤을 때 어떤 궤적으로 남길지 1분만 멀리서 바라보세요.',
    question: '당장 눈앞의 작은 득실을 넘어, 긴 시간의 언덕 위에서 바라볼 때 가장 떳떳한 방향은 어디인가요?',
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

const SCYTHIAN_SHADOWS = [
  '황금 사슴처럼 가볍고 기민하게 도약하려는 추진력이 정작 끝까지 책임지고 다듬어야 할 자리까지 성급히 떠나는 조급함이 되지 않게 하세요.',
  '타바티 화덕의 핵심 원칙을 지키는 심지가 상황에 맞게 조정해야 할 규칙이나 새로운 제안까지 막아서는 고집이 되어서는 안 됩니다.',
  '서로 다른 방식을 받아들이는 스킬레스의 개방성이 내 고유한 방향성이나 기준선까지 흐려 놓는 무분별한 절충이 되지 않게 살피세요.',
  '아키나케스의 명료한 절단력이 꼭 숙고와 대화가 더 필요한 관계나 문제마저 단칼에 끊어 버리는 성급함이 되지 않게 주의하세요.',
  '쿠르간 언덕 위에서 긴 세월을 내다보는 시야가 오늘 당장 발밑에서 해결해야 할 구체적 실행을 미루는 관망이 되지 않게 균형을 잡으세요.',
];

function classifyScythianTopic(q: string): ScythianGoldenStagResult['questionTopic'] {
  if (/도약|기민|사슴|가볍/.test(q)) return '도약·기동';
  if (/화덕|원칙|중심|타바티/.test(q)) return '원칙·화덕';
  if (/관점|개방|편견|연결/.test(q)) return '개방·교차';
  if (/끊|미련|절단|정리/.test(q)) return '절단·명료';
  if (/시야|세월|궤적|언덕/.test(q)) return '장기·시야';
  return '초원 전반';
}

export function calculateScythianGoldenStagSteppe(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ScythianGoldenStagResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyScythianTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % EMBLEMS.length;
  const picked = EMBLEMS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (EMBLEMS.length - 1));
  const companion = EMBLEMS[(idx + companionOffset) % EMBLEMS.length];
  const goldenStagAxis = `${picked.emblem.split('(')[0].trim()} ↔ ${companion.emblem.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-SCYTHIAN-STAG-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    steppeEmblem: picked.emblem,
    companionEmblem: companion.emblem,
    goldenStagAxis,
    stagInsight: picked.insight,
    kurganTone: picked.tone,
    reflectionFocus: `고대 스키타이 유목 지혜의 '${picked.emblem}'을 중심에 두고 '${companion.emblem}'의 결을 곁들여 가볍게 도약할 여백을 만들어 보세요.`,
    ritualAction: picked.action,
    shadowWarning: SCYTHIAN_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '유라시아 고대 스키타이(Scythian) 황금 사슴·유목 기동성 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatScythianGoldenStagPrompt(res: ScythianGoldenStagResult): string {
  return [
    `[스키타이 황금 사슴·초원 도약 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 초원 도약 축: ${res.goldenStagAxis}`,
    `- 초원 상징: ${res.steppeEmblem} (${res.kurganTone})`,
    `- 동반 상징: ${res.companionEmblem}`,
    `- 중심 통찰: ${res.stagInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
