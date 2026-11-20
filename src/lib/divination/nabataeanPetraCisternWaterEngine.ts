import type { UserProfile } from '../sharedState';

export interface NabataeanPetraResult {
  engineVersion: string;
  calculatedAtKst: string;
  desertConduit: string;
  petraInsight: string;
  sandstoneTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CONDUITS = [
  { conduit: '시크 협곡 수로(Siq Channel · 바위를 깎아 빗물을 한 방울도 흘리지 않음)', insight: '흘러가는 평범한 하루 속에서도 내게 유익한 작은 깨달음을 모아 두면 사막을 건너는 힘이 됨', tone: '요르단 페트라 붉은 사암 절벽 사이로 맑은 물이 조용히 흐르는 좁은 협곡' },
  { conduit: '알카즈네(Al-Khazneh · 바위 속에 조용히 품은 보물창고)', insight: '밖으로 화려하게 드러내지 않아도 내 안의 깊은 단단함이 쌓이면 자연히 빛이 남', tone: '아침 햇살이 장미빛으로 물들이는 거대한 사암 신전의 정갈한 기둥' },
  { conduit: '지하 저수조(Cistern · 가뭄이 오기 전에 미리 채워 두는 고요한 깊이)', insight: '일이 잘 풀릴 때 다음 계절을 위한 체력과 여유를 비축해 두는 지혜가 긴 여정을 지킴', tone: '사막 한가운데 서늘한 바위 그늘 아래 맑게 고여 있는 빗물 우물' },
  { conduit: '향료 대상로(Incense Route · 사막 너머의 낯선 세계를 잇는 신뢰)', insight: '서로 다른 배경을 가진 사람과도 약속과 정직함을 지키면 먼 길의 든든한 동반자가 됨', tone: '유향과 몰약 향기가 은은히 감도는 별빛 아래 사막의 쉼터' },
  { conduit: '테라코타 배관(Terracotta Pipe · 막힘없이 이어지는 유연한 연결)', insight: '혼자 모든 물줄기를 감당하려 하기보다 역할을 나누어 흐르게 할 때 막히지 않음', tone: '붉은 흙으로 구워 정교하게 맞물려 이어진 고대 나바테아의 도관' },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
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

  return {
    engineVersion: 'LUCKEY-NABATAEAN-PETRA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    desertConduit: picked.conduit,
    petraInsight: picked.insight,
    sandstoneTone: picked.tone,
    reflectionFocus: `나바테아 페트라 수로 지혜의 '${picked.conduit}'처럼, 당장 눈에 띄는 성과가 아니더라도 작은 배움과 여유를 차곡차곡 저수조에 모아 보세요.`,
    ritualAction: '오늘 무심히 흘려보내던 작은 시간이나 자투리 에너지 한 조각을, 나를 위한 소중한 저축처럼 따로 떼어 챙겨 보세요.',
    reflectiveQuestion: '지금 내가 흘려보내고 있는 일상 속에서, 나바테아의 수로처럼 잘 모아 두면 가뭄을 건너게 해 줄 작은 자원은 무엇인가요?',
    interpretiveBoundary: '고대 나바테아 페트라의 사막 빗물 수로·지하 저수조 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatNabataeanPetraPrompt(res: NabataeanPetraResult): string {
  return [
    `[나바테아 페트라·사막 수로 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 사막 수로: ${res.desertConduit} (${res.sandstoneTone})`,
    `- 중심 통찰: ${res.petraInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
