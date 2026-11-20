import type { UserProfile } from '../sharedState';

export type RustaveliVirtueId =
  | 'megobroba_fellowship'
  | 'sibrdzne_inner_mastery'
  | 'simatske_steadfast_courage'
  | 'gulis_sinatle_heart_light';

export interface RustaveliVirtue {
  id: RustaveliVirtueId;
  georgianTerm: string;
  koreanTitle: string;
  literaryMotif: string;
  coreInsight: string;
  actionPractice: string;
}

export interface GeorgianRustaveliResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  primaryVirtue: RustaveliVirtue;
  counterbalanceVirtue: RustaveliVirtue;
  heartCompassPrinciple: string;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const RUSTAVELI_VIRTUES: readonly RustaveliVirtue[] = [
  {
    id: 'megobroba_fellowship',
    georgianTerm: 'Megobroba (우정과 신의)',
    koreanTitle: '조건 없는 연대와 신의',
    literaryMotif: '아브탄딜과 타리엘이 먼 길을 함께 건너는 기사도의 맹세',
    coreInsight: '혼자 고립되어 버티기보다 신뢰할 수 있는 벗과 뜻을 나눌 때 비로소 얽힌 실타래가 풀리는 힘입니다.',
    actionPractice: '고마움이나 안부를 전하려다 미뤄 둔 사람에게 짧은 진심을 먼저 건네 보세요.',
  },
  {
    id: 'sibrdzne_inner_mastery',
    georgianTerm: 'Sibrdzne (자기 극복의 지혜)',
    koreanTitle: '감정의 폭풍을 다스리는 이성',
    literaryMotif: '표범 가죽을 두른 기사가 슬픔을 딛고 다시 검을 드는 순간',
    coreInsight: '격한 감정이나 후회를 억누르려 들지 않고, 그 감정이 가르치는 본질을 직시하며 중심을 세우는 품격입니다.',
    actionPractice: '감정이 앞서는 결정은 하루만 유예하고, 핵심 사실 세 줄만 적어 차분히 바라보세요.',
  },
  {
    id: 'simatske_steadfast_courage',
    georgianTerm: 'Simatske (굳건한 용기)',
    koreanTitle: '불확실함 앞에서도 물러서지 않는 담대함',
    literaryMotif: '사자의 발톱 앞에서도 빛을 잃지 않는 태양의 서사',
    coreInsight: '“사자 새끼는 암컷이든 수컷이든 다 사자다”라는 서사의 정신처럼, 조건에 주눅 들지 않고 제 몫을 다하는 태도입니다.',
    actionPractice: '남과의 비교 때문에 작아졌던 영역에서 오늘 작은 성취 하나를 직접 실행해 보세요.',
  },
  {
    id: 'gulis_sinatle_heart_light',
    georgianTerm: 'Gulis Sinatle (마음의 빛과 관용)',
    koreanTitle: '아낌없이 나누는 너그러움',
    literaryMotif: '“네가 내어준 것은 너의 것이 되고, 쥐고만 있던 것은 잃어버린다”는 구절',
    coreInsight: '손해 보지 않으려 움켜쥐기보다 따뜻한 호의와 지식을 나눌 때 오히려 내 안의 여백과 기품이 살아납니다.',
    actionPractice: '내가 가진 정보나 배려 중 하나를 대가 없이 주변과 기꺼이 나누어 보세요.',
  },
] as const;

const HEART_COMPASS_PRINCIPLES: readonly string[] = [
  '네가 나눈 것은 너의 것이 되고, 움켜쥔 것은 사라진다',
  '진실한 벗은 맑은 날보다 험한 밤길에서 먼저 모습을 드러낸다',
  '자기 마음을 이긴 자만이 바깥의 성채도 지킬 수 있다',
];

function formatGeorgianKstTimestamp(now: Date): string {
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

export function calculateGeorgianRustaveliKnightPanther(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GeorgianRustaveliResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();

  const seed = stableHash(
    [
      params.profile.basic?.name ?? '',
      params.profile.fate?.birthDate ?? '',
      params.profile.fate?.birthTime ?? 'unknown',
      query,
    ].join('|')
  );

  const primaryIdx = seed % RUSTAVELI_VIRTUES.length;
  const counterbalanceIdx = (primaryIdx + 2) % RUSTAVELI_VIRTUES.length;
  const principleIdx = (seed >> 4) % HEART_COMPASS_PRINCIPLES.length;

  const primaryVirtue = RUSTAVELI_VIRTUES[primaryIdx];
  const counterbalanceVirtue = RUSTAVELI_VIRTUES[counterbalanceIdx];
  const heartCompassPrinciple = HEART_COMPASS_PRINCIPLES[principleIdx];

  const qualitativeSynthesis =
    `조지아 쇼타 루스타벨리의 서사시 《표범 가죽을 두른 기사》의 상징으로 비추어 보면, 지금 흐름의 중심에는 ` +
    `‘${primaryVirtue.georgianTerm} — ${primaryVirtue.koreanTitle}’의 기품이 자리하고 있습니다. ` +
    `${primaryVirtue.coreInsight} 여기에 ‘${counterbalanceVirtue.georgianTerm}’이 균형축으로 맞물려, ` +
    `“${heartCompassPrinciple}”이라는 고전적 지혜처럼 품격 있는 선택을 이어가기 좋은 국면입니다.`;

  const reflectionFocus =
    `${primaryVirtue.koreanTitle}을 중심으로 ${counterbalanceVirtue.koreanTitle}의 균형을 세우는 시점`;

  const ritualAction = primaryVirtue.actionPractice;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’을(를) 두고 고민할 때, 움켜쥐고 지키려는 것보다 나답게 내어주고 품격을 지킬 수 있는 선택은 무엇인가요?`
    : `지금 내 곁의 소중한 인연이나 맡은 일 앞에서, 가장 기사도답게 지키고 싶은 약속 한 가지는 무엇인가요?`;

  return {
    engineName: '조지아 루스타벨리 《표범 가죽을 두른 기사》 심성 관점 (Rustaveli Knight in the Panther’s Skin)',
    engineVersion: 'LUCKEY-GEORGIAN-RUSTAVELI-v2.1.0',
    calculatedAtKst: formatGeorgianKstTimestamp(now),
    primaryVirtue,
    counterbalanceVirtue,
    heartCompassPrinciple,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 12세기 조지아 서사시 《표범 가죽을 두른 기사》의 인문·철학적 덕목을 바탕으로 한 자기 성찰 프레임워크이며, 운세 수치나 확정적 미래 예측이 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatGeorgianRustaveliKnightPantherPrompt(res: GeorgianRustaveliResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 중심 덕목: ${res.primaryVirtue.georgianTerm} · ${res.primaryVirtue.koreanTitle} (${res.primaryVirtue.literaryMotif})`,
    `- 균형 덕목: ${res.counterbalanceVirtue.georgianTerm} · ${res.counterbalanceVirtue.koreanTitle}`,
    `- 마음의 나침반: “${res.heartCompassPrinciple}”`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
