import type { UserProfile } from '../sharedState';

export interface DogonAmmaNommoResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '기다림·주기' | '관계·대화' | '일·실행' | '질서 전반';
  starPhase: string;
  companionPhase: string;
  cosmicOrderAxis: string;
  dogonCrossAxis: string;
  topicBalanceHint: string;
  nommoInsight: string;
  cliffTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PHASES = [
  {
    phase: '시리우스(Sigi Tolo)의 기다림과 주기',
    insight: '서두르지 않고 큰 흐름이 제자리에 돌아올 때까지 내 궤도를 지키는 인내의 지혜',
    tone: '반디아agara 절벽 위 밤하늘의 차분한 별빛',
    ritual: '오늘 조급히 답을 내리고 싶은 일 하나는 내일 같은 시간까지 묵혀 두며 흐름을 살펴보세요.',
    question: '지금 내 마음속에서 조용히 영글고 있지만 아직 조급함 때문에 기다려 주지 못한 씨앗은 무엇인가요?',
  },
  {
    phase: '노모(Nommo)의 맑은 말과 물의 조화',
    insight: '거친 말 대신 마음을 적시는 솔직하고 부드러운 언어로 관계를 푸는 힘',
    tone: '건기 끝에 밭을 적시는 첫 비의 선율',
    ritual: '오늘 대화 중 감정이 올라오는 순간이 오면 한 박자 쉬고 물 한 모금을 마신 뒤 차분히 말해 보세요.',
    question: '오늘 내가 거친 말 대신 맑은 물처럼 부드럽게 건네고 싶은 한마디는 무엇인가요?',
  },
  {
    phase: '카나가(Kanaga) 가면의 하늘·땅 연결',
    insight: '이상과 현실의 간극을 좁혀 오늘 내 손끝의 행동으로 이어 내는 균형',
    tone: '붉은 사암 흙벽과 나무 기둥의 단단한 울림',
    ritual: '머릿속에만 맴돌던 계획 하나를 오늘 당장 손으로 할 수 있는 10분짜리 행동으로 옮겨 보세요.',
    question: '하늘의 이상과 땅의 현실 사이에서 오늘 내 손끝으로 이어 볼 다리는 어디인가요?',
  },
  {
    phase: '포 토로(Po Tolo) 작은 씨앗의 밀도',
    insight: '겉으로 작아 보여도 내 안에 응축된 진심과 실력이 때를 만나 피어나는 이치',
    tone: '새벽 이슬 머금은 좁쌀 알갱이의 고요한 빛',
    ritual: '오늘 남에게 크게 보이지 않더라도 내 실속과 밀도를 채우는 기본기 한 가지를 챙겨 보세요.',
    question: '겉으로 작아 보이지만 내 안에서 묵직한 밀도로 자라고 있는 진심은 무엇인가요?',
  },
  {
    phase: '토구나(Toguna) 낮은 지붕의 지혜',
    insight: '화를 내며 일어서면 머리가 닿는 낮은 지붕 아래 앉아 차분히 대화를 마치는 절제',
    tone: '바오밥 나무 그늘 아래 돌기둥 쉼터의 미풍',
    ritual: '오늘 의견이 부딪히는 자리에서는 자리에서 박차고 일어나기 전에 먼저 깊게 앉아 숨을 고르세요.',
    question: '감정이 뜨거워질 때 나를 차분히 자리에 앉혀 주는 낮은 지붕 같은 기준은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
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

const DOGON_SHADOWS = [
  '때를 기다린다는 명분으로 지금 바로 답을 줘야 할 상대와의 약속까지 미루지 않도록 살피세요.',
  '부드럽고 맑은 말투를 지키려다 정작 분명히 전달해야 할 핵심 의사를 에두르지 마세요.',
  '당장 손으로 옮기는 실행에 집중하다 전체 그림과 장기 방향성을 놓치지 않도록 점검하세요.',
  '작은 밀도를 다지는 데만 몰두해 세상에 내어 보일 시기를 계속 뒤로 미루지 않도록 주의하세요.',
  '감정을 절제하고 자리에 앉아 있느라 필요한 문제 제기와 건강한 경계 설정까지 참지 마세요.',
];

const TOPIC_BALANCE_HINTS: Record<DogonAmmaNommoResult['questionTopic'], string> = {
  '기다림·주기': '시리우스의 궤도처럼 큰 흐름을 기다리되, 지금 약속된 작은 마감은 제때 매듭지으세요.',
  '관계·대화': '토구나의 낮은 지붕 아래 앉듯 감정을 낮추고, 전할 핵심 의사는 맑은 물처럼 분명히 건네세요.',
  '일·실행': '카나가 가면이 하늘과 땅을 잇듯, 오늘 10분 손에 잡히는 실행과 전체 방향을 함께 챙기세요.',
  '질서 전반': '작은 포 토로 씨앗의 밀도를 다지되, 싹을 틔워 내어 보일 때가 오면 망설이지 마세요.',
};

function classifyDogonTopic(q: string): DogonAmmaNommoResult['questionTopic'] {
  if (/기다림|주기|때|시리우스|인내/.test(q)) return '기다림·주기';
  if (/관계|대화|말|사람|화|사랑/.test(q)) return '관계·대화';
  if (/일|직장|실행|기본기|계획|행동/.test(q)) return '일·실행';
  return '질서 전반';
}

export function calculateDogonAmmaNommoHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): DogonAmmaNommoResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyDogonTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PHASES.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PHASES.length - 1));
  const picked = PHASES[idx];
  const companion = PHASES[(idx + companionOffset) % PHASES.length];
  const cosmicOrderAxis = `${picked.phase.split('(')[0].trim()} ↔ ${companion.phase.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = TOPIC_BALANCE_HINTS[questionTopic];
  const shadowWarning = DOGON_SHADOWS[idx];

  const calculatedAtKst = formatKstIso(now);
  const dogonCrossAxis = `[${picked.phase.split('(')[0].trim()}] × [${companion.phase.split('(')[0].trim()}] × [${questionTopic}] × [${calculatedAtKst.slice(11, 16)}]`;

  return {
    engineVersion: 'LUCKEY-DOGON-AMMA-v2.5.0',
    calculatedAtKst,
    questionTopic,
    starPhase: picked.phase,
    companionPhase: companion.phase,
    cosmicOrderAxis,
    dogonCrossAxis,
    topicBalanceHint,
    nommoInsight: picked.insight,
    cliffTone: picked.tone,
    reflectionFocus: `도곤 우주관의 '${picked.phase}'와 동반 위상 '${companion.phase}'을 함께 살피며, 당장 겉모습을 재촉하기보다 내 말과 태도의 결을 먼저 고르게 다듬어 보세요.`,
    ritualAction: picked.ritual,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '서아프리카 말리 도곤 전통의 우주 질서와 공동체 대화 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatDogonAmmaNommoPrompt(res: DogonAmmaNommoResult): string {
  return [
    `[도곤 암마·노모 우주 질서 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 우주 질서 축: ${res.cosmicOrderAxis}`,
    `- 4중 교차 축: ${res.dogonCrossAxis}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 별자리 위상: ${res.starPhase} (${res.cliffTone})`,
    `- 동반 위상: ${res.companionPhase}`,
    `- 중심 통찰: ${res.nommoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
