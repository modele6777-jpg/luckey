import type { UserProfile } from '../sharedState';

export interface PalmyreneOasisResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '질서·원칙' | '생기·호기심' | '관점·교차로' | '중심·담대함' | '여백·다정함' | '팔미라 전반';
  oasisPillar: string;
  companionPillar: string;
  colonnadeAxis: string;
  palmyreneInsight: string;
  syrianDesertTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  topicBalanceHint: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PILLARS = [
  {
    pillar: '대열주랑(Great Colonnade · 사막 한복판에 뻗은 정갈한 기둥들의 질서)',
    insight: '주변이 황량하고 불확실해 보여도 내 안의 원칙과 질서가 서 있으면 길은 선명해짐',
    tone: '시리아 사막의 황금빛 노을을 받아 따뜻하게 빛나는 고대 팔미라 석회암 열주',
    action: '어수선한 일정 가운데 오늘 반드시 지킬 나만의 기준 기둥 1가지를 맨 위에 세워 두세요.',
    question: '주변이 불확실할수록 내 길을 선명하게 세워 주는 대열주랑 같은 원칙은 무엇인가요?',
  },
  {
    pillar: '에프카 샘(Efqa Spring · 모래 아래서 솟아 오아시스를 키우는 힘)',
    insight: '마르지 않는 힘은 거창한 겉모습이 아니라 조용히 솟아나는 내면의 작은 호기심과 돌봄임',
    tone: '대추야자 숲 사이로 맑은 물안개를 피워 올리는 사막의 온천 샘',
    action: '거창한 동기 부여를 기다리기보다 오늘 나를 조용히 생기 있게 만드는 작은 호기심 하나를 따라가 보세요.',
    question: '지금 내 주변이 막막한 사막처럼 보일 때, 내 마음속에서 에프카 샘처럼 조용히 솟아올라 나를 지탱해 주는 힘은 무엇인가요?',
  },
  {
    pillar: '사막의 교차로(Caravan Crossroads · 동과 서의 지혜가 만나는 자리)',
    insight: '내가 이미 아는 방식만 고집하지 않고 낯선 관점을 하나 받아들이면 시야가 두 배로 트임',
    tone: '별빛 아래 낙타 대상들이 모여 서로의 소식을 나누던 고대 오아시스 광장',
    action: '오늘 내가 익숙하게 고집하던 방식 하나를 잠시 내려놓고, 전혀 다른 각도의 아이디어 하나를 가볍게 시험해 보세요.',
    question: '내 익숙한 방식 옆에 낯선 관점 하나를 교차로처럼 들이면 시야가 두 배로 트일 문제는 무엇인가요?',
  },
  {
    pillar: '제노비아의 담대함(Zenobia · 변방에서도 스스로의 중심을 세우는 기개)',
    insight: '남들이 정해 준 한계에 나를 가두지 않고 오늘 내가 할 수 있는 몫을 당당히 펼침',
    tone: '넓은 사막 지평선을 바라보며 서 있는 고대 성채의 맑고 단단한 실루엣',
    action: '남의 평가나 한계선에 맞춰 움츠러들었던 일 한 가지를 오늘 내 몫대로 담담히 실행해 보세요.',
    question: '타인이 정해 준 한계선 바깥에서 오늘 내가 스스로의 중심을 세워 펼쳐 보고 싶은 몫은 무엇인가요?',
  },
  {
    pillar: '코린트 주두의 잎새(Acanthus Capital · 단단한 돌 위에 피운 섬세한 숨결)',
    insight: '단호하고 바쁜 일상을 살아갈수록 작은 아름다움과 다정함을 잃지 않는 여백이 귀함',
    tone: '사암 기둥 꼭대기에 정교하게 새겨진 부드러운 잎사귀 조각',
    action: '바쁜 업무나 결정 사이에서도 오늘 나 자신이나 주변 사람에게 건넬 다정한 말 한마디의 여백을 남겨 두세요.',
    question: '단단하고 바쁜 일상 위에서도 잎새 조각처럼 잃지 않고 피워 내고 싶은 작은 아름다움과 다정함은 무엇인가요?',
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

const PALMYRENE_SHADOWS = [
  '사막 한가운데 세운 대열주랑의 질서가 상황 변화에 맞춰 유연하게 굽혀야 할 예외까지 밀어내는 경직된 고집이 되지 않게 하세요.',
  '조용히 솟아나는 에프카 샘의 작은 호기심이 지금 당장 매듭지어야 할 핵심 과제에서 시선을 흩뜨리는 산만함이 되어서는 안 됩니다.',
  '사막의 교차로처럼 낯선 관점을 받아들이는 개방성이 내 중심 기준마저 흔들어 결정을 끝없이 미루는 우유부단함으로 흐르지 않게 하세요.',
  '제노비아의 담대함이 주변의 조언과 현실적인 제약을 살피지 않고 혼자서만 밀어붙이는 독주로 바뀌지 않도록 균형을 잡으세요.',
  '돌 위에 피운 아칸서스 잎새의 다정함이 꼭 짚고 넘어가야 할 경계나 분명한 거절마저 흐리는 무른 태도가 되지 않게 하세요.',
];

function classifyPalmyreneTopic(q: string): PalmyreneOasisResult['questionTopic'] {
  if (/질서|원칙|기준|기둥/.test(q)) return '질서·원칙';
  if (/샘|호기심|생기|돌봄/.test(q)) return '생기·호기심';
  if (/관점|교차|낯선|시야/.test(q)) return '관점·교차로';
  if (/담대|한계|중심|기개/.test(q)) return '중심·담대함';
  if (/다정|여백|아름다|숨결/.test(q)) return '여백·다정함';
  return '팔미라 전반';
}

const PALMYRENE_TOPIC_HINTS: Record<PalmyreneOasisResult['questionTopic'], string> = {
  '질서·원칙': '단정한 기준을 세우되 상황 변화에 필요한 유연한 예외도 한 줄 남겨 두세요.',
  '생기·호기심': '작은 호기심의 생기를 오늘 매듭지을 핵심 과제 하나와 나란히 두세요.',
  '관점·교차로': '낯선 시선을 받아들이되 최종 결정의 중심 기준은 내 손에 쥐고 가세요.',
  '중심·담대함': '담대한 한 걸음을 내딛을 때 주변의 현실적 조언 한 줄도 함께 살피세요.',
  '여백·다정함': '다정한 여백 속에서도 꼭 지켜야 할 경계와 거절은 분명히 남기세요.',
  '팔미라 전반': '열주의 단정한 질서와 오아시스 샘의 생기를 오늘 균형 있게 엮어 보세요.',
};

export function calculatePalmyreneOasisColonnade(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PalmyreneOasisResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyPalmyreneTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PILLARS.length;
  const picked = PILLARS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (PILLARS.length - 1));
  const companion = PILLARS[(idx + companionOffset) % PILLARS.length];
  const colonnadeAxis = `${picked.pillar.split('(')[0].trim()} ↔ ${companion.pillar.split('(')[0].trim()} (${questionTopic})`;
  const topicBalanceHint = PALMYRENE_TOPIC_HINTS[questionTopic];

  return {
    engineVersion: 'LUCKEY-PALMYRENE-OASIS-v2.4.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    oasisPillar: picked.pillar,
    companionPillar: companion.pillar,
    colonnadeAxis,
    palmyreneInsight: picked.insight,
    syrianDesertTone: picked.tone,
    reflectionFocus: `고대 팔미라 오아시스 지혜의 '${picked.pillar}'을 중심에 두고 '${companion.pillar}'의 결을 곁들여, 불확실한 사막 한가운데서도 나만의 단정한 질서와 낯선 시선을 함께 품어 보세요.`,
    ritualAction: picked.action,
    shadowWarning: PALMYRENE_SHADOWS[idx],
    topicBalanceHint,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 팔미라(Palmyra) 오아시스의 대열주랑 질서·교차로 개방성 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPalmyreneOasisPrompt(res: PalmyreneOasisResult): string {
  return [
    `[팔미라 오아시스·대열주랑 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 대열주랑 축: ${res.colonnadeAxis}`,
    `- 오아시스 기둥: ${res.oasisPillar} (${res.syrianDesertTone})`,
    `- 동반 기둥: ${res.companionPillar}`,
    `- 중심 통찰: ${res.palmyreneInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 맥락 균형 조언: ${res.topicBalanceHint}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
