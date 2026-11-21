import type { UserProfile } from '../sharedState';

export interface ScythianGoldenStagResult {
  engineVersion: string;
  calculatedAtKst: string;
  steppeEmblem: string;
  companionEmblem: string;
  stagInsight: string;
  kurganTone: string;
  reflectionFocus: string;
  ritualAction: string;
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

export function calculateScythianGoldenStagSteppe(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ScythianGoldenStagResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % EMBLEMS.length;
  const picked = EMBLEMS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (EMBLEMS.length - 1));
  const companion = EMBLEMS[(idx + companionOffset) % EMBLEMS.length];

  return {
    engineVersion: 'LUCKEY-SCYTHIAN-STAG-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    steppeEmblem: picked.emblem,
    companionEmblem: companion.emblem,
    stagInsight: picked.insight,
    kurganTone: picked.tone,
    reflectionFocus: `고대 스키타이 유목 지혜의 '${picked.emblem}'을 중심에 두고 '${companion.emblem}'의 결을 곁들여 가볍게 도약할 여백을 만들어 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '유라시아 고대 스키타이(Scythian) 황금 사슴·유목 기동성 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatScythianGoldenStagPrompt(res: ScythianGoldenStagResult): string {
  return [
    `[스키타이 황금 사슴·초원 도약 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 초원 상징: ${res.steppeEmblem} (${res.kurganTone})`,
    `- 동반 상징: ${res.companionEmblem}`,
    `- 중심 통찰: ${res.stagInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
