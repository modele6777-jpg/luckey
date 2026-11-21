import type { UserProfile } from '../sharedState';

export type OjibweGrandfatherTeachingId =
  | 'nbwaakaawin_wisdom'
  | 'zaagidiwin_love'
  | 'manaaji_idiwin_respect'
  | 'aakode_ewin_bravery'
  | 'gwayakwaadiziwin_honesty'
  | 'dabaadendiziwin_humility'
  | 'debwewin_truth';

export interface OjibweGrandfatherTeaching {
  id: OjibweGrandfatherTeachingId;
  ojibweName: string;
  koreanName: string;
  totemAnimal: string;
  coreMeaning: string;
  reflectivePractice: string;
}

export interface OjibweSevenGrandfatherResult {
  engineName: string;
  engineVersion: string;
  calculatedAtKst: string;
  dominantTeaching: OjibweGrandfatherTeaching;
  balancingTeaching: OjibweGrandfatherTeaching;
  medicineWheelPhase: string;
  qualitativeSynthesis: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  isSymbolicFramework: true;
}

const GRANDFATHER_TEACHINGS: readonly OjibweGrandfatherTeaching[] = [
  {
    id: 'nbwaakaawin_wisdom',
    ojibweName: 'Nbwaakaawin',
    koreanName: '지혜(Wisdom)',
    totemAnimal: '비버(Amik)',
    coreMeaning: '타고난 재능을 공동체와 다음 세대를 세우는 데 쓰고, 지나친 소모 대신 묵묵히 기반을 다지는 태도입니다.',
    reflectivePractice: '당장 눈앞의 박수보다 오래 남을 튼튼한 토대 하나를 먼저 손봐 주세요.',
  },
  {
    id: 'zaagidiwin_love',
    ojibweName: 'Zaagidiwin',
    koreanName: '사랑(Love)',
    totemAnimal: '독수리(Migizi)',
    coreMeaning: '높은 시야에서 자기 자신과 타인을 조건 없이 존중하고, 두려움 대신 온기를 선택하는 마음입니다.',
    reflectivePractice: '오늘 가장 먼저 나 자신에게 건네지 못했던 다정한 말 한마디를 허용해 주세요.',
  },
  {
    id: 'manaaji_idiwin_respect',
    ojibweName: 'Manaaji’idiwin',
    koreanName: '존중(Respect)',
    totemAnimal: '들소(Mashkode-bizhiki)',
    coreMeaning: '모든 존재가 제 몫의 자리를 지니고 있음을 인정하고, 상대를 바꾸려 하기보다 경계를 지키는 품격입니다.',
    reflectivePractice: '상대의 속도와 방식을 재단하지 않고 있는 그대로 한 걸음 물러서서 바라보세요.',
  },
  {
    id: 'aakode_ewin_bravery',
    ojibweName: 'Aakode’ewin',
    koreanName: '용기(Bravery)',
    totemAnimal: '곰(Makwa)',
    coreMeaning: '두려움이 없음이 아니라 두려움을 안고도 옳다고 믿는 방향을 향해 발을 내딛는 내면의 힘입니다.',
    reflectivePractice: '미뤄 두었던 대화나 결정 하나를 오늘 가장 솔직한 태도로 마주해 보세요.',
  },
  {
    id: 'gwayakwaadiziwin_honesty',
    ojibweName: 'Gwayakwaadiziwin',
    koreanName: '정직(Honesty)',
    totemAnimal: '큰사슴·사베(Sabe)',
    coreMeaning: '남의 시선에 맞추려 자신을 과장하거나 축소하지 않고, 있는 그대로의 나로 똑바로 서는 태도입니다.',
    reflectivePractice: '지금 느끼는 부담이나 한계를 꾸밈없이 스스로에게 먼저 인정해 주세요.',
  },
  {
    id: 'dabaadendiziwin_humility',
    ojibweName: 'Dabaadendiziwin',
    koreanName: '겸손(Humility)',
    totemAnimal: '늑대(Ma’iingan)',
    coreMeaning: '내가 세상의 중심이 아니라 큰 순환의 일부임을 알기에, 혼자 다 짊어지지 않고 곁과 함께 걷는 지혜입니다.',
    reflectivePractice: '혼자 해결하려던 짐 하나를 신뢰할 수 있는 사람에게 정중히 나누어 보세요.',
  },
  {
    id: 'debwewin_truth',
    ojibweName: 'Debwewin',
    koreanName: '진실(Truth)',
    totemAnimal: '거북(Mikinaak)',
    coreMeaning: '서두르지 않는 거북의 걸음처럼 말과 행동, 마음속 동기가 한결같이 맞물릴 때 비로소 깃드는 투명함입니다.',
    reflectivePractice: '지금 하려는 선택이 남의 기대가 아닌 내 안의 진심에서 나온 것인지 확인해 보세요.',
  },
] as const;

const MEDICINE_WHEEL_PHASES: readonly string[] = [
  '동쪽(Waabanong) — 새벽의 영감과 시작을 여는 자리',
  '남쪽(Zhaawanong) — 성장과 관계의 온기를 키우는 자리',
  '서쪽(Ningaabi’anong) — 성찰과 내면의 깊이를 다지는 자리',
  '북쪽(Giiwedinong) — 지혜의 통합과 쉼을 품는 자리',
];

function formatOjibweKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
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
  return h >>> 0;
}

export function calculateOjibweSevenGrandfatherTeachings(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): OjibweSevenGrandfatherResult {
  const now = params.now ?? new Date();
  const query = (params.question ?? '').trim();

  const seedInput = [
    params.profile.basic?.name ?? '',
    JSON.stringify(params.profile.fate ?? {}),
    query,
    now.toISOString().slice(0, 13),
  ].join('|');
  const seed = stableHash(seedInput);

  const dominantIdx = seed % GRANDFATHER_TEACHINGS.length;
  const balancingOffset = 1 + (stableHash(`${seedInput}|companion`) % (GRANDFATHER_TEACHINGS.length - 1));
  const balancingIdx = (dominantIdx + balancingOffset) % GRANDFATHER_TEACHINGS.length;
  const wheelIdx = stableHash(`${seedInput}|wheel`) % MEDICINE_WHEEL_PHASES.length;

  const dominantTeaching = GRANDFATHER_TEACHINGS[dominantIdx];
  const balancingTeaching = GRANDFATHER_TEACHINGS[balancingIdx];
  const medicineWheelPhase = MEDICINE_WHEEL_PHASES[wheelIdx];

  const qualitativeSynthesis =
    `아니시나베(오지브웨) 일곱 할아버지 가르침의 상징으로 비추어 보면, 지금은 ${dominantTeaching.totemAnimal}이 이끄는 ` +
    `‘${dominantTeaching.ojibweName}(${dominantTeaching.koreanName})’의 결이 앞에 놓여 있습니다. ` +
    `${dominantTeaching.coreMeaning} 여기에 ${balancingTeaching.totemAnimal}의 ‘${balancingTeaching.ojibweName}(${balancingTeaching.koreanName})’이 ` +
    `균형축으로 맞물려, 일방적으로 밀어붙이기보다 ${medicineWheelPhase}의 호흡에 맞춰 태도를 정돈하기 좋은 흐름입니다.`;

  const reflectionFocus =
    `${dominantTeaching.koreanName}의 자리에서 ${balancingTeaching.koreanName}을 함께 기억하며 말과 행동의 결을 맞추는 시점`;

  const ritualAction = `${dominantTeaching.reflectivePractice} (${balancingTeaching.ojibweName}의 균형 함께 살피기)`;

  const reflectiveQuestion = query
    ? `‘${query.slice(0, 36)}’을(를) 마주한 지금, ${dominantTeaching.koreanName}을 지키면서 ${balancingTeaching.koreanName}으로 균형을 맞추기 위해 먼저 돌아볼 태도는 무엇인가요?`
    : `지금 내 일상에서 ${dominantTeaching.koreanName}과 ${balancingTeaching.koreanName}이 함께 살아나도록 가장 정직하게 다듬고 싶은 선택은 무엇인가요?`;

  return {
    engineName: '오지브웨(아니시나베) 7대 할아버지 가르침 (Seven Grandfather Teachings)',
    engineVersion: 'LUCKEY-OJIBWE-SEVEN-GRANDFATHERS-v2.2.0',
    calculatedAtKst: formatOjibweKstTimestamp(now),
    dominantTeaching,
    balancingTeaching,
    medicineWheelPhase,
    qualitativeSynthesis,
    reflectionFocus,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary:
      '본 결과는 오지브웨(아니시나베) 전통의 일곱 가지 덕목과 약바퀴(Medicine Wheel) 상징을 활용한 자기 성찰 프레임워크이며, 의학적 진단·미래 예측이나 수치적 운세 점수가 아닙니다.',
    isSymbolicFramework: true,
  };
}

export function formatOjibweSevenGrandfatherPrompt(res: OjibweSevenGrandfatherResult): string {
  return [
    `[보조 상징 관점 — ${res.engineName}]`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 주된 가르침: ${res.dominantTeaching.ojibweName} (${res.dominantTeaching.koreanName}) · 토템 ${res.dominantTeaching.totemAnimal}`,
    `- 균형 가르침: ${res.balancingTeaching.ojibweName} (${res.balancingTeaching.koreanName}) · 토템 ${res.balancingTeaching.totemAnimal}`,
    `- 약바퀴 방향: ${res.medicineWheelPhase}`,
    `- 성찰 해석: ${res.qualitativeSynthesis}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
