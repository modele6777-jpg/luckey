import type { UserProfile } from '../sharedState';

export interface BalticRomuvaAxis {
  name: string;
  element: string;
  guidance: string;
  ritual: string;
  question: string;
}

export interface BalticRomuvaDarnaResult {
  engineVersion: string;
  calculatedAtKst: string;
  activeAxis: BalticRomuvaAxis;
  companionAxis: BalticRomuvaAxis;
  sacredOakNote: string;
  interpretation: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const ROMUVA_DARNA_AXES: BalticRomuvaAxis[] = [
  {
    name: '다르나(Darna) — 나와 세계의 조화로운 질서',
    element: '성스러운 참나무(Ąžuolas)',
    guidance: '억지로 상황을 꺾어 맞추기보다 뿌리가 땅을 감싸 안듯 지금 자리에서 자연스러운 질서를 회복할 때입니다.',
    ritual: '오늘 억지로 밀어붙이던 일정 한 가지를 멈추고, 지금 내 리듬에 맞는 순서대로 다시 놓아 보세요.',
    question: '지금 내가 억지로 맞추려 애쓰기보다 자연스러운 리듬(Darna)에 맡겨 두면 오히려 제자리를 찾을 일은 무엇인가요?',
  },
  {
    name: '가비야(Gabija) — 꺼지지 않는 내면의 불꽃',
    element: '화덕의 불빛(Ugnis)',
    guidance: '밖으로 화려하게 타오르기보다 나만의 고유한 열정과 생활 리듬을 소중히 덮어 지키는 지혜가 필요합니다.',
    ritual: '남에게 보이기 위한 일보다 오늘 내 마음의 화덕(Gabija)에서 꼭 지키고 싶은 온기 한 가지를 챙겨 보세요.',
    question: '바깥의 소란 속에서도 꺼뜨리지 않고 조용히 덮어 지켜 내야 할 나만의 불씨(Gabija)는 무엇인가요?',
  },
  {
    name: '사울레(Saulė) — 계절을 건너는 맑은 빛',
    element: '태양의 수레바퀴',
    guidance: '어제의 그늘에 머물지 않고 오늘 창가로 들어오는 빛처럼 지금 가능한 작은 시작에 시선을 두는 흐름입니다.',
    ritual: '잠시 창밖의 햇빛을 보며 깊은 숨을 세 번 내쉬고, 오늘 바로 시작할 수 있는 작은 첫 걸음 하나만 떼어 보세요.',
    question: '어제의 그늘에서 시선을 거두고 오늘 창가로 들어온 사울레(Saulė)의 빛처럼 바로 시작할 수 있는 작은 일은 무엇인가요?',
  },
  {
    name: '제미나(Žemyna) — 묵묵히 품어 안는 대지',
    element: '대지의 숨결',
    guidance: '조급한 결론을 내리기 전에 발밑의 현실과 몸의 감각을 먼저 단단히 다져야 다음 걸음이 흔들리지 않습니다.',
    ritual: '성급한 결론을 내리기 전에 따뜻한 물 한 잔을 마시며 몸의 피로와 발밑의 현실 감각부터 먼저 살피세요.',
    question: '조급한 결론을 서두르기 전에 제미나(Žemyna)의 대지처럼 먼저 단단히 다져 두어야 할 현실의 바탕은 무엇인가요?',
  },
];

const SACRED_OAK_NOTES = [
  '다이노스(Dainos) 민요의 후렴처럼 반복되는 하루의 리듬 속에서 작은 아름다움을 발견하는 시선',
  '숲의 경계에서 숨을 고르듯 말과 행동 사이에 한 박자의 여유를 두는 태도',
  '계절이 바뀌어도 잎과 뿌리가 서로를 기억하듯 내 안의 오래된 가치를 다시 꺼내는 시간',
];

function formatKstTimestamp(date: Date): string {
  const kstMs = date.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mi = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateBalticRomuvaDarnaHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BalticRomuvaDarnaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 10)}`;
  const hash = stableHash(seed);
  const companionHash = stableHash(`${seed}|companion`);

  const primaryIdx = hash % ROMUVA_DARNA_AXES.length;
  const companionOffset = 1 + (companionHash % (ROMUVA_DARNA_AXES.length - 1));
  const activeAxis = ROMUVA_DARNA_AXES[primaryIdx];
  const companionAxis = ROMUVA_DARNA_AXES[(primaryIdx + companionOffset) % ROMUVA_DARNA_AXES.length];
  const sacredOakNote = SACRED_OAK_NOTES[(hash >>> 3) % SACRED_OAK_NOTES.length];

  return {
    engineVersion: 'LUCKEY-BALTIC-ROMUVA-DARNA-v2.2.0',
    calculatedAtKst: formatKstTimestamp(now),
    activeAxis,
    companionAxis,
    sacredOakNote,
    interpretation: `발트 리투아니아 로무바(Romuva) 전통의 다르나(Darna) 관점에서는 '${activeAxis.name}'(${activeAxis.element}) 축을 중심으로 '${companionAxis.name}'의 여운이 함께 흐릅니다. ${activeAxis.guidance}`,
    ritualAction: activeAxis.ritual,
    reflectionFocus: `${sacredOakNote}을(를) 떠올리며 '${activeAxis.name}'과 '${companionAxis.name}' 사이에서 억지스러움을 덜어낼 자리를 찾아보세요.`,
    reflectiveQuestion: activeAxis.question,
    interpretiveBoundary: '본 풀이는 발트·리투아니아 로무바(Romuva) 전통의 다르나 상징을 바탕으로 한 성찰적 비유이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBalticRomuvaPrompt(result: BalticRomuvaDarnaResult): string {
  return [
    `[발트 로무바·다르나 조화 (${result.engineVersion})]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 조화 축: ${result.activeAxis.name} (${result.activeAxis.element})`,
    `- 보조 축: ${result.companionAxis.name} (${result.companionAxis.element})`,
    `- 참나무 노우트: ${result.sacredOakNote}`,
    `- 해석 요지: ${result.interpretation}`,
    `- 실천 의례: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
