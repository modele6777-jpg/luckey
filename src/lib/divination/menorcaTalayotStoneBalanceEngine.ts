import type { UserProfile } from '../sharedState';

export interface MenorcaTalayotInput {
  profile: UserProfile;
  now: Date;
  question?: string;
}

export interface MenorcaTalayotResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '자생·균형' | '바람·버팀' | '시야·정돈' | '탈라요트 전반';
  stoneStance: string;
  companionStance: string;
  talayotStoneAxis: string;
  dryStoneBalance: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STONE_STANCES = [
  '모르타르 없이 돌의 무게와 각도만으로 서로를 지탱하는 건식 석축',
  '지중해의 거센 트라문타나 북풍을 가르고 서 있는 타울라 T자 거석',
  '섬의 높은 언덕에서 사방을 조용히 내다보는 망루의 시선',
  '세월이 흐를수록 돌과 돌이 더 깊이 맞물려 단단해지는 지반',
] as const;

const BALANCES = [
  '억지 접착제 없이도 제 모양과 무게 중심이 맞으면 돌은 오래도록 무너지지 않습니다.',
  '거센 바람이 부는 날에는 움직임을 키우기보다 중심 기둥을 낮고 넓게 잡는 편이 현명합니다.',
  '크고 무거운 돌 하나에 모든 짐을 지우기보다 작은 쐐기돌들이 틈을 고르게 받쳐 줍니다.',
  '높이 쌓아 올리기 전에 바닥 돌이 땅의 경사를 제대로 읽고 있는지부터 확인합니다.',
] as const;

const ACTIONS = [
  '오늘의 핵심 과제 하나를 받쳐 줄 작은 보조 습관(쐐기돌) 한 가지 곁에 두기',
  '타인의 기준이나 억지 약속에 나를 끼워 맞추기보다 내 무게 중심이 편한 속도 고르기',
  '복잡한 생각에서 한 걸음 물러나 오늘 상황을 높은 언덕 위에서 내려다보듯 정리하기',
  '바닥을 다지는 10분의 정돈으로 흔들리던 마음의 기울기 바로잡기',
] as const;

const QUESTIONS = [
  '요즘 나를 지탱해 주는 여러 관계와 일들 가운데, 억지 힘으로 붙잡고 있는 조각은 무엇인가요?',
  '내 일상이 흔들리지 않도록 틈새를 고르게 받쳐 주는 작은 쐐기돌 같은 습관은 무엇인가요?',
  '바람이 거세게 부는 지금, 더 높이 쌓기보다 먼저 단단히 내려놓아야 할 바닥 돌은 어디일까요?',
  '한 걸음 떨어져 높은 곳에서 오늘의 나를 바라본다면 가장 먼저 보이는 균형점은 무엇인가요?',
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

const MENORCA_SHADOWS = [
  '모르타르 없이 홀로 버티는 건식 석축의 자존심이 지나쳐, 꼭 필요한 주변의 도움이나 연결마저 거절하는 고립이 되지 않게 하세요.',
  '거센 바람을 가르고 서 있는 거석의 버팀이 유연한 방향 전환과 가벼운 양보가 필요한 순간까지 버티기로 굳어지지 않게 살피세요.',
  '높은 언덕에서 사방을 내려다보는 관조에만 머물면, 정작 돌 하나를 직접 옮겨 쌓아야 할 현실의 첫 손길이 늦어질 수 있습니다.',
  '지반을 다지고 바닥을 점검하는 신중함이 지나쳐 이미 충분히 단단한 기초 위에서도 출발을 미루지 않도록 하세요.',
] as const;

function classifyMenorcaTopic(q: string): MenorcaTalayotResult['questionTopic'] {
  if (/자생|균형|억지|무게|중심/.test(q)) return '자생·균형';
  if (/바람|버팀|거석|기둥/.test(q)) return '바람·버팀';
  if (/시야|정돈|언덕|바닥/.test(q)) return '시야·정돈';
  return '탈라요트 전반';
}

export function calculateMenorcaTalayotStoneBalance(input: MenorcaTalayotInput): MenorcaTalayotResult {
  const fate = input.profile.fate ?? {};
  const q = (input.question ?? '').trim();
  const questionTopic = classifyMenorcaTopic(q);
  const seedText = `${JSON.stringify(fate)}|${input.now.toISOString().slice(0, 13)}|${q}`;
  const seed = hashSeed(seedText);
  const stanceIdx = seed % STONE_STANCES.length;
  const companionOffset = 1 + (hashSeed(`${seedText}|companion`) % (STONE_STANCES.length - 1));
  const stoneStance = STONE_STANCES[stanceIdx];
  const companionStance = STONE_STANCES[(stanceIdx + companionOffset) % STONE_STANCES.length];
  const talayotStoneAxis = `${stoneStance.slice(0, 14)}… ↔ ${companionStance.slice(0, 14)}… (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-MENORCA-TALAYOT-v2.3.0',
    calculatedAtKst: toKstIso(input.now),
    questionTopic,
    stoneStance,
    companionStance,
    talayotStoneAxis,
    dryStoneBalance: BALANCES[(seed >>> 3) % BALANCES.length],
    reflectionFocus: `스페인 메노르카 섬의 탈라요트 문화가 접착제 없이 돌 자체의 무게와 각도만으로 수천 년을 버티는 거석 탑을 세웠듯, 주 석축('${stoneStance}')과 동반 석축('${companionStance}')을 함께 비추어 억지 없는 자생적 균형을 살피는 상징적 관점입니다.`,
    ritualAction: ACTIONS[stanceIdx],
    shadowWarning: MENORCA_SHADOWS[stanceIdx],
    reflectiveQuestion: QUESTIONS[stanceIdx],
    interpretiveBoundary: '개인 점수·심리 진단·미래 예측이 아닙니다. 자기 성찰을 돕기 위한 상징적 관점 안내입니다.',
  };
}

export function formatMenorcaTalayotPrompt(res: MenorcaTalayotResult): string {
  return [
    `[메노르카·탈라요트 돌탑 균형 관점 · ${res.engineVersion}]`,
    `기준 시각: ${res.calculatedAtKst}`,
    `질문 맥락: ${res.questionTopic} | 탈라요트 석축 축: ${res.talayotStoneAxis}`,
    `석축 자세: ${res.stoneStance}`,
    `동반 자세: ${res.companionStance}`,
    `건식 균형: ${res.dryStoneBalance}`,
    `성찰 초점: ${res.reflectionFocus}`,
    `권장 의식: ${res.ritualAction}`,
    `과잉 경계: ${res.shadowWarning}`,
    `성찰 질문: ${res.reflectiveQuestion}`,
    `경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
