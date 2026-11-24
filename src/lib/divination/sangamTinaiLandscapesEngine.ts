import type { UserProfile } from '../sharedState';

export interface SangamTinaiInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface SangamTinaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '첫 만남·산' | '기다림·숲' | '일상·들판' | '그리움·바다' | '내면·외면' | '티나이 전반';
  tinaiLandscape: string;
  companionLandscape: string;
  tinaiAkamPuramAxis: string;
  akamPuramTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const LANDSCAPES = [
  '쿠린지(Kurinji) — 안개 낀 산마루의 첫 만남',
  '물라이(Mullai) — 비를 기다리는 푸른 숲의 인내',
  '마루탐(Marutam) — 물길 흐르는 들판의 일상 조율',
  '네이탈(Neital) — 파도 밀려드는 바닷가의 그리움',
] as const;

const TONES = [
  '마음의 안쪽(아캄)과 세상의 바깥(푸람)을 한 풍경에 비추어 보면 감정의 자리가 보입니다.',
  '기다림의 계절에도 숲의 풀빛은 자라듯, 멈춘 듯한 시간 속에 조용한 성숙이 있습니다.',
  '가까운 관계의 작은 어긋남은 비난보다 일상 물길을 다듬을 때 부드럽게 풀립니다.',
  '산·숲·들·바다마다 어울리는 꽃이 다르듯 지금 나에게 맞는 태도도 계절마다 다릅니다.',
] as const;

const ACTIONS = [
  '지금 내 기분과 가장 닮은 자연 풍경(산·숲·들·바다) 하나를 골라 1분간 떠올리기',
  '내면의 감정(아캄)과 오늘 해야 할 바깥 일(푸람)을 한 줄씩 나누어 적어 보기',
  '가까운 사람과의 관계에서 서운함 대신 지금 건넬 수 있는 작은 안부 한마디 전하기',
  '억지로 풍경을 바꾸려 하기보다 지금 머무른 자리의 좋은 점 한 가지 찾아보기',
] as const;

const QUESTIONS = [
  '지금 내 마음의 풍경은 산·숲·들·바다 가운데 어디와 가장 닮아 있나요?',
  '안쪽의 감정과 바깥의 책임 사이에서 지금 가장 다독여 주어야 할 쪽은 어디인가요?',
  '기다림이 필요한 숲의 계절에 내가 서둘러 거두려 하는 것은 무엇인가요?',
  '오늘의 일상 들판에서 부드럽게 물길을 터 주면 좋을 관계나 일은 무엇일까요?',
] as const;

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SANGAM_SHADOWS = [
  '쿠린지 산마루의 설렘과 몰입이 현실의 구체적 조건과 일상의 속도를 살피지 않는 들뜬 기대감으로만 번지지 않게 하세요.',
  '물라이 숲의 인내와 기다림이 지금 내가 직접 움직여 물꼬를 터야 할 과제 앞에서도 손 놓고 기다리는 수동성이 되어서는 안 됩니다.',
  '마루탐 들판의 일상 조율이 크고 본질적인 방향을 묻는 순간에도 사소한 실무와 세세한 정비에만 매달리는 습관이 되지 않게 살피세요.',
  '네이탈 바닷가의 깊은 그리움과 성찰이 현재 눈앞의 관계와 오늘 해야 할 선택을 흐리게 만드는 과거 회상으로 머물지 않게 균형을 잡으세요.',
] as const;

function classifySangamTopic(q: string): SangamTinaiResult['questionTopic'] {
  if (/산|만남|설렘|시작/.test(q)) return '첫 만남·산';
  if (/숲|기다|인내|계절/.test(q)) return '기다림·숲';
  if (/들판|일상|관계|물길/.test(q)) return '일상·들판';
  if (/바다|파도|그리움|여운/.test(q)) return '그리움·바다';
  if (/내면|바깥|아캄|푸람/.test(q)) return '내면·외면';
  return '티나이 전반';
}

export function calculateSangamTinaiPoetics(input: SangamTinaiInput): SangamTinaiResult {
  const fate = input.profile.fate ?? {};
  const q = (input.question ?? '').trim();
  const questionTopic = classifySangamTopic(q);
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${q}`;
  const seed = hashSeed(seedText);
  const landscapeIdx = seed % LANDSCAPES.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (LANDSCAPES.length - 1));
  const tinaiLandscape = LANDSCAPES[landscapeIdx];
  const companionLandscape = LANDSCAPES[(landscapeIdx + companionOffset) % LANDSCAPES.length];
  const tinaiAkamPuramAxis = `${tinaiLandscape.split('—')[0].trim()} ↔ ${companionLandscape.split('—')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-SANGAM-TINAI-v2.3.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    tinaiLandscape,
    companionLandscape,
    tinaiAkamPuramAxis,
    akamPuramTone: TONES[(seed >>> 3) % TONES.length],
    reflectionFocus: `고전 타밀 상감 시학의 다섯 티나이(Tinai) 경관처럼 주 경관('${tinaiLandscape}')과 동반 경관('${companionLandscape}')을 겹쳐 자연의 계절과 내면(아캄)·외면(푸람)의 결을 읽는 상징적 관점입니다.`,
    ritualAction: ACTIONS[landscapeIdx],
    shadowWarning: SANGAM_SHADOWS[landscapeIdx],
    reflectiveQuestion: QUESTIONS[landscapeIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatSangamTinaiPrompt(res: SangamTinaiResult): string {
  return [
    `[타밀 상감·티나이 다섯 경관 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `질문 맥락: ${res.questionTopic} | 아캄·푸람 경관 축: ${res.tinaiAkamPuramAxis}`,
    `티나이 경관: ${res.tinaiLandscape}`,
    `동반 경관: ${res.companionLandscape}`,
    `아캄·푸람 결: ${res.akamPuramTone}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `과잉 경계: ${res.shadowWarning}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
