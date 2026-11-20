import type { UserProfile } from '../sharedState';

export type AbaiVirtuePillarId =
  | 'akyl_discernment'
  | 'kairat_steadfast_will'
  | 'jurek_warm_compassion'
  | 'enbek_honest_craft';

export interface AbaiVirtuePillar {
  id: AbaiVirtuePillarId;
  kazakhTerm: string;
  koreanLabel: string;
  coreInsight: string;
  dailyPractice: string;
}

export interface KazakhAbaiResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  primaryPillar: AbaiVirtuePillar;
  balancingPillar: AbaiVirtuePillar;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const ABAI_PILLARS: readonly AbaiVirtuePillar[] = [
  {
    id: 'akyl_discernment',
    kazakhTerm: 'Aqyl (깨어 있는 이성과 분별)',
    koreanLabel: '휩쓸리지 않는 판단력',
    coreInsight: '남들의 소문이나 조급함에 따라 움직이지 않고, 일의 앞뒤를 스스로 따져 보는 맑은 지성입니다.',
    dailyPractice: '오늘 마주한 선택 중 남의 시선 때문에 하려던 일 하나를 멈추고 내 기준에 맞는지 점검하세요.',
  },
  {
    id: 'kairat_steadfast_will',
    kazakhTerm: 'Qairat (흔들리지 않는 의지)',
    koreanLabel: '끝까지 밀고 가는 힘',
    coreInsight: '작은 난관 앞에서 마음을 접기보다, 옳다고 세운 방향을 묵묵히 이어 가는 단단한 기백입니다.',
    dailyPractice: '미뤄 두었던 일 가운데 가장 중요한 한 가지를 딱 20분만 정해 끝까지 해치워 보세요.',
  },
  {
    id: 'jurek_warm_compassion',
    kazakhTerm: 'Jurek (따뜻한 마음과 연대)',
    koreanLabel: '차가운 계산을 녹이는 온기',
    coreInsight: '이성과 의지가 날카로워질수록 사람에 대한 배려와 온기가 중심을 잡아 주어야 비로소 지혜가 완성됩니다.',
    dailyPractice: '오늘 고마웠거나 애쓴 사람 한 명에게 짧은 안부나 진심 어린 감사 말을 건네 보세요.',
  },
  {
    id: 'enbek_honest_craft',
    kazakhTerm: 'Enbek (성실한 땀과 배움)',
    koreanLabel: '요행을 버린 꾸준함',
    coreInsight: '거창한 한 방을 기다리기보다 오늘 손에 쥔 일을 정직하게 갈고닦을 때 흔들리지 않는 기반이 쌓입니다.',
    dailyPractice: '오늘 하루 배운 점이나 작은 진전 한 줄을 메모로 남겨 스스로의 성장을 확인하세요.',
  },
] as const;

function formatKazakhKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateKazakhAbaiBookOfWords(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KazakhAbaiResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();

  const seed = stableHash(
    [
      params.profile.basic?.name ?? '',
      JSON.stringify(params.profile.fate ?? {}),
      query,
    ].join('|')
  );

  const primaryIdx = seed % ABAI_PILLARS.length;
  const balancingIdx = (primaryIdx + 2) % ABAI_PILLARS.length;

  const primaryPillar = ABAI_PILLARS[primaryIdx];
  const balancingPillar = ABAI_PILLARS[balancingIdx];

  const qualitativeSynthesis =
    `카자흐 대문호 아바이 쿠난바예프의 《교훈의 말씀》 관점으로 살피면, 지금은 ` +
    `‘${primaryPillar.kazakhTerm} — ${primaryPillar.koreanLabel}’을 중심에 세울 때입니다. ` +
    `${primaryPillar.coreInsight} 여기에 ‘${balancingPillar.koreanLabel}’이 균형을 받쳐 주어, ` +
    `속도보다 중심을 단단히 지키며 나아가기 좋은 흐름입니다.`;

  const reflectionFocus =
    `${primaryPillar.koreanLabel}을 분명히 세우고 ${balancingPillar.koreanLabel}으로 균형을 맞추는 성찰 시점`;

  const ritualAction = primaryPillar.dailyPractice;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’ 앞에서, 남의 기준이 아니라 내 안의 ‘이성(Aqyl)·의지(Qairat)·마음(Jurek)’ 중 지금 가장 먼저 깨워야 할 것은 무엇인가요?`
    : `오늘 내 시간과 에너지를 가장 정직하고 의미 있는 곳에 쓰기 위해 덜어낼 수 있는 소모는 무엇인가요?`;

  return {
    engineName: '카자흐 아바이 《교훈의 말씀》 지혜·의지 (Kazakh Abai Book of Words)',
    engineVersion: 'LUCKEY-KAZAKH-ABAI-v2.1.0',
    calculatedAtKst: formatKazakhKstTimestamp(now),
    primaryPillar,
    balancingPillar,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 카자흐스탄 사상가 아바이 쿠난바예프의 《교훈의 말씀》 성찰 덕목을 활용한 상징 프레임워크이며, 수치적 운세 점수나 미래 예측이 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatKazakhAbaiPrompt(res: KazakhAbaiResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 중심 덕목: ${res.primaryPillar.kazakhTerm} · ${res.primaryPillar.koreanLabel}`,
    `- 균형 덕목: ${res.balancingPillar.kazakhTerm} · ${res.balancingPillar.koreanLabel}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
