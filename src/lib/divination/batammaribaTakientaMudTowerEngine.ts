import type { UserProfile } from '../sharedState';

export interface BatammaribaTakientaInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export type BatammaribaQuestionTopic = 'career' | 'relationship' | 'wealth' | 'health' | 'general';

export interface BatammaribaTakientaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: BatammaribaQuestionTopic;
  earthenTower: string;
  companionTower: string;
  towerPhase: string;
  takientaCrossAxis: string;
  hearthThreshold: string;
  shadowWarning: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const TOWERS = [
  '서로 기댄 두 흙탑이 지붕 테라스를 받치는 자리',
  '1층의 서늘한 곳간과 2층의 따뜻한 잠자리가 나뉜 구조',
  '빗물을 밖으로 흘려보내는 매끄러운 붉은 흙벽',
  '해 질 녘 온 식구가 모여 하늘을 보는 평평한 옥상',
] as const;

const TOWER_PHASES = [
  '기초 다짐(흙 반죽과 벽체를 두껍게 세워 안팎의 기준을 잡는 시기)',
  '층위 분리(곳간과 쉼터의 경계를 분명히 하여 소모를 막는 시기)',
  '옥상 개방(지붕 위로 올라 서로 기대며 넓은 시야를 여는 시기)',
] as const;

const SHADOW_WARNINGS = [
  '안전만 지키려다 문턱을 너무 높여 필요한 도움과 숨통까지 막히지 않도록 점검하세요.',
  '당장 할 일(1층)과 쉼(2층)이 한 공간에 뒤엉켜 밤에도 머리가 식지 않는 과부하를 경계하세요.',
  '혼자 버티는 고집으로 두 번째 기둥과 나눌 수 있는 짐마저 떠안고 있지는 않은지 살피세요.',
] as const;

const THRESHOLDS = [
  '아래층에 곡식을 두고 위층에서 쉬듯, 당장 쓸 일과 비축할 여유를 층위로 나누면 집이 단단해집니다.',
  '손으로 다진 흙벽은 해마다 덧바를수록 더 튼튼해지듯, 작은 일상의 손질이 마음의 외벽을 지켜 줍니다.',
  '좁은 문을 지나 넓은 옥상에 오르듯, 작은 불편을 하나 넘기면 시야가 트이는 자리가 나옵니다.',
  '혼자 높게 쌓기보다 두 기둥이 서로를 기대어 서야 긴 계절을 버틸 수 있습니다.',
] as const;

const ACTIONS = [
  '오늘 해야 할 일 중 당장 처리할 것(1층)과 미뤄도 될 것(2층)을 나누어 정리하기',
  '하루 끝 5분 동안 머리를 식히고 하늘이나 바깥 공기를 보며 호흡 가다듬기',
  '반복해서 낡아 가는 생활 습관 하나를 오늘 새로 덧발라 보수하기',
  '혼자 짊어지던 일 하나를 믿는 사람과 나누어 기둥을 두 개로 만들기',
] as const;

const QUESTIONS = [
  '내 일상의 1층(생계·실무)과 2층(쉼·마음)이 서로 섞여 지치고 있지는 않나요?',
  '요즘 가장 손길이 필요한 내 마음의 흙벽은 어느 부분인가요?',
  '서로 기대어 서면 훨씬 단단해질 관계나 협업은 무엇인가요?',
  '오늘 하루를 마치고 올라가 숨을 고를 나만의 옥상 자리는 어디인가요?',
] as const;

const TOPIC_AXES: Record<BatammaribaQuestionTopic, string> = {
  career: '일·커리어에서는 당장 처리할 실무(1층)와 내일을 위한 여유·회복(2층)의 층위를 분리해 과부하를 막으세요.',
  relationship: '관계에서는 혼자 높게 쌓기보다 두 흙탑이 서로 기대어 서듯 믿는 사람과 짐을 나누는 협업이 단단합니다.',
  wealth: '재정·계약에서는 1층 곳간에 비축할 몫과 오늘 쓸 몫의 경계를 분명히 하여 소모를 줄이세요.',
  health: '건강·회복에서는 하루 끝 5분 옥상 개방 시간처럼 머리를 식히고 바깥 공기로 호흡을 가다듬는 쉼을 확보하세요.',
  general: '오늘의 흐름에서는 주 흙탑과 동반 자리를 함께 살피며 실무와 쉼의 층위를 조율하세요.',
};

function classifyBatammaribaTopic(question: string): BatammaribaQuestionTopic {
  if (/일|직장|사업|커리어|프로젝트|성과|실무/.test(question)) return 'career';
  if (/사랑|연애|관계|가족|친구|갈등|협업/.test(question)) return 'relationship';
  if (/돈|재물|재정|투자|소비|계약/.test(question)) return 'wealth';
  if (/건강|몸|피로|휴식|수면|쉼|회복/.test(question)) return 'health';
  return 'general';
}

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

export function calculateBatammaribaTakienta(input: BatammaribaTakientaInput): BatammaribaTakientaResult {
  const fate = input.profile.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${input.question ?? ''}`;
  const seed = hashSeed(seedText);
  const towerIdx = seed % TOWERS.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (TOWERS.length - 1));
  const earthenTower = TOWERS[towerIdx];
  const companionTower = TOWERS[(towerIdx + companionOffset) % TOWERS.length];
  const towerPhase = TOWER_PHASES[hashSeed(`${seedText}|phase`) % TOWER_PHASES.length];
  const shadowWarning = SHADOW_WARNINGS[hashSeed(`${seedText}|shadow`) % SHADOW_WARNINGS.length];
  const questionTopic = classifyBatammaribaTopic(input.question ?? '');
  const shortPhase = towerPhase.split('(')[0].trim();
  const takientaCrossAxis = `${shortPhase} × ${earthenTower.slice(0, 14)} — ${TOPIC_AXES[questionTopic]}`;

  return {
    engineVersion: 'LUCKEY-BATAMMARIBA-v2.4.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    earthenTower,
    companionTower,
    towerPhase,
    takientaCrossAxis,
    hearthThreshold: THRESHOLDS[(seed >>> 3) % THRESHOLDS.length],
    shadowWarning,
    reflectionFocus: `토고·베냉 바타마리바 족이 손으로 빚어 올린 타키엔타 2층 흙탑 가옥처럼 '${towerPhase}' 흐름 위에서 주 자리('${earthenTower}')와 동반 자리('${companionTower}')를 겹쳐 실무와 쉼의 층위를 나누는 상징적 관점입니다.`,
    ritualAction: `${ACTIONS[towerIdx]} (동반 자리: ${companionTower})`,
    reflectiveQuestion: `${QUESTIONS[towerIdx]} 특히 '${towerPhase}' 국면에서 내가 가장 먼저 지킬 층위는 무엇인가요?`,
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatBatammaribaTakientaPrompt(res: BatammaribaTakientaResult): string {
  return [
    `[바타마리바·타키엔타 흙탑 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `흙탑 자리: ${res.earthenTower}`,
    `동반 자리: ${res.companionTower}`,
    `흙탑 국면: ${res.towerPhase}`,
    `질문 맥락(${res.questionTopic}) 교차 축: ${res.takientaCrossAxis}`,
    `층위 지혜: ${res.hearthThreshold}`,
    `과잉·경계 점검: ${res.shadowWarning}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
