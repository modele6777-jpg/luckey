import type { UserProfile } from '../sharedState';

export interface NabataeanPetraResult {
  engineVersion: string;
  calculatedAtKst: string;
  desertConduit: string;
  companionConduit: string;
  petraInsight: string;
  sandstoneTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CONDUITS = [
  {
    conduit: '시크 협곡 수로(Siq Channel · 바위를 깎아 빗물을 한 방울도 흘리지 않음)',
    insight: '흘러가는 평범한 하루 속에서도 내게 유익한 작은 깨달음을 모아 두면 사막을 건너는 힘이 됨',
    tone: '요르단 페트라 붉은 사암 절벽 사이로 맑은 물이 조용히 흐르는 좁은 협곡',
    action: '오늘 무심히 흘려보내던 자투리 시간이나 떠오른 착상 한 줄을 노트에 따로 모아 두세요.',
    question: '지금 내가 흘려보내고 있는 일상 속에서, 시크 수로처럼 잘 모아 두면 사막을 건너게 해 줄 작은 깨달음은 무엇인가요?',
  },
  {
    conduit: '알카즈네(Al-Khazneh · 바위 속에 조용히 품은 보물창고)',
    insight: '밖으로 화려하게 드러내지 않아도 내 안의 깊은 단단함이 쌓이면 자연히 빛이 남',
    tone: '아침 햇살이 장미빛으로 물들이는 거대한 사암 신전의 정갈한 기둥',
    action: '겉으로 드러내 보이기보다 내실과 기초를 다지는 조용한 작업 한 가지를 오늘 20분만 깊이 이어가 보세요.',
    question: '남에게 당장 보이지 않더라도 내 안의 단단한 보물창고처럼 조용히 채워 가고 싶은 역량은 무엇인가요?',
  },
  {
    conduit: '지하 저수조(Cistern · 가뭄이 오기 전에 미리 채워 두는 고요한 깊이)',
    insight: '일이 잘 풀릴 때 다음 계절을 위한 체력과 여유를 비축해 두는 지혜가 긴 여정을 지킴',
    tone: '사막 한가운데 서늘한 바위 그늘 아래 맑게 고여 있는 빗물 우물',
    action: '체력과 마음이 아직 남아 있을 때 오늘 하루 일정을 하나 덜어 내일의 여유를 미리 비축해 두세요.',
    question: '일이 순조로운 지금, 다가올 가뭄을 대비해 미리 채워 두어야 할 체력과 마음의 저수조는 어디인가요?',
  },
  {
    conduit: '향료 대상로(Incense Route · 사막 너머의 낯선 세계를 잇는 신뢰)',
    insight: '서로 다른 배경을 가진 사람과도 약속과 정직함을 지키면 먼 길의 든든한 동반자가 됨',
    tone: '유향과 몰약 향기가 은은히 감도는 별빛 아래 사막의 쉼터',
    action: '배경이 다른 상대와의 약속이나 작은 기한 하나를 오늘 먼저 정확히 챙겨 신뢰의 다리를 놓아 보세요.',
    question: '서로 다른 길에서 만난 사람과 긴 여정을 함께하기 위해 오늘 내가 먼저 지켜야 할 신뢰의 약속은 무엇인가요?',
  },
  {
    conduit: '테라코타 배관(Terracotta Pipe · 막힘없이 이어지는 유연한 연결)',
    insight: '혼자 모든 물줄기를 감당하려 하기보다 역할을 나누어 흐르게 할 때 막히지 않음',
    tone: '붉은 흙으로 구워 정교하게 맞물려 이어진 고대 나바테아의 도관',
    action: '혼자 다 짊어지려던 일의 일부를 오늘 적절한 사람이나 도구로 연결해 물줄기가 막히지 않게 해 보세요.',
    question: '혼자 막고 서서 버티기보다 정교한 도관처럼 역할을 나누어 흐르게 하면 훨씬 수월해질 일은 무엇인가요?',
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

export function calculateNabataeanPetraCisternWater(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): NabataeanPetraResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CONDUITS.length;
  const picked = CONDUITS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (CONDUITS.length - 1));
  const companion = CONDUITS[(idx + companionOffset) % CONDUITS.length];

  return {
    engineVersion: 'LUCKEY-NABATAEAN-PETRA-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    desertConduit: picked.conduit,
    companionConduit: companion.conduit,
    petraInsight: picked.insight,
    sandstoneTone: picked.tone,
    reflectionFocus: `나바테아 페트라 수로 지혜의 '${picked.conduit}'을 중심에 두고 '${companion.conduit}'의 흐름을 곁들여, 작은 배움과 여유를 차곡차곡 저수조에 모아 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 나바테아 페트라의 사막 빗물 수로·지하 저수조 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNabataeanPetraPrompt(res: NabataeanPetraResult): string {
  return [
    `[나바테아 페트라·사막 수로 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 사막 수로: ${res.desertConduit} (${res.sandstoneTone})`,
    `- 동반 수로: ${res.companionConduit}`,
    `- 중심 통찰: ${res.petraInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
