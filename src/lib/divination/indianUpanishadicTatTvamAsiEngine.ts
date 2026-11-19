/**
 * 고대 인도 우파니샤드 타트 트밤 아시(Tat Tvam Asi) & 범아일여(Brahman-Atman) 순수의식 엔진
 *
 * 고대 인도 베단타 철학의 정수인 주요 우파니샤드 원전 기반:
 * 1. 《찬도가 우파니샤드(Chandogya Upanishad)》:
 *    - "타트 트밤 아시(Tat Tvam Asi - 네가 바로 그것이다)": 우주의 궁극적 실재인 브라만(Brahman)과 내면의 진아(Atman)가 본래 하나임.
 * 2. 《브리하다란야카 우파니샤드(Brihadaranyaka Upanishad)》:
 *    - "아함 브라흐마스미(Aham Brahmasmi - 내가 곧 브라만이다)": 유한한 에고의 착각을 벗어난 무한 의식의 각성.
 *    - "넷티 넷티(Neti, Neti - 이것도 아니고 저것도 아니다)": 덧없는 명칭과 형상(Nama-Rupa)에 얽매이지 않는 부정의 길.
 * 3. 사트-치트-아난다(Sat-Chit-Ananda): 참된 존재(Sat), 순수 의식(Chit), 무상의 지복(Ananda).
 * 4. 마야(Maya)의 장막 투시: 겉으로 드러난 현상계의 환영을 꿰뚫어 불변의 실재를 직관함.
 * 5. 프라즈냐(Prajna) 지혜: 일체의 분별과 대립을 초월한 비이원적(Advaita) 절대 평정심.
 *
 * @version LUCKEY-UPANISHADIC-TAT-TVAM-ASI-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const UPANISHADIC_TAT_TVAM_ASI_VERSION = 'LUCKEY-UPANISHADIC-TAT-TVAM-ASI-v2.3.0';

export interface UpanishadicMahavakya {
  vakyaKey: string;
  vakyaSanskrit: string;
  vakyaNameKo: string;
  sourceUpanishad: string;
  coreRealization: string;
  meditativeFocus: string;
}

export interface UpanishadicTeaching {
  teachingKey: string;
  teachingNameKo: string;
  philosophicalDepth: string;
  contemplativeInsight: string;
}

export interface UpanishadicTatTvamAsiResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  brahmanAtmanUnityScore: number;               // 범아일여(Brahman-Atman) 합일 자각도
  mayaIllusionPiercingScore: number;            // 마야(Maya) 환상 분별 통찰력
  netiNetiDetachmentScore: number;              // 넷티 넷티(Neti Neti) 무집착 초연도
  satChitAnandaPureConsciousnessScore: number;  // 사트-치트-아난다 순수의식 지복도
  prajnaSpiritualWisdomScore: number;           // 프라즈냐(Prajna) 영적 직관 지혜력
  // 세부 명세
  activeMahavakya: UpanishadicMahavakya;
  secondaryMahavakya: UpanishadicMahavakya;
  focalUpanishadicTeaching: UpanishadicTeaching;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  upanishadicCounsel: {
    counselTitle: string;
    spiritualGuidance: string;
  };
  upanishadicSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export type UpanishadicTatTvamAsiReport = UpanishadicTatTvamAsiResult;

const UPANISHADIC_MAHAVAKYAS: UpanishadicMahavakya[] = [
  {
    vakyaKey: 'TatTvamAsi',
    vakyaSanskrit: 'तत्त्वमसि (Tat Tvam Asi)',
    vakyaNameKo: '네가 바로 그것이다',
    sourceUpanishad: '찬도가 우파니샤드 (Chandogya Upanishad)',
    coreRealization: '우주 만유의 근원적 생명과 그대 영혼의 가장 깊은 본질은 결코 둘이 아닌 하나이다.',
    meditativeFocus: '외적 조건이나 한계에 짓눌릴 때, 자신의 본래 자리가 온 우주를 품은 무한한 실재임을 상기하십시오.',
  },
  {
    vakyaKey: 'AhamBrahmasmi',
    vakyaSanskrit: 'अहं ब्रह्मास्मि (Aham Brahmasmi)',
    vakyaNameKo: '내가 곧 브라만이다',
    sourceUpanishad: '브리하다란야카 우파니샤드 (Brihadaranyaka Upanishad)',
    coreRealization: '협소한 자아(Ahamkara)의 두려움을 벗어나 영원불멸의 보편 의식과 합일함.',
    meditativeFocus: '작은 손익이나 일시적 평가에 위축되지 말고, 내면에 깃든 위대한 순수 의식의 권능을 자각하십시오.',
  },
  {
    vakyaKey: 'AyamAtmaBrahma',
    vakyaSanskrit: 'अयमात्मा ब्रह्म (Ayam Atma Brahma)',
    vakyaNameKo: '이 아트만(개별 진아)이 곧 브라만이다',
    sourceUpanishad: '만두캬 우파니샤드 (Mandukya Upanishad)',
    coreRealization: '깨어있음, 꿈, 깊은 잠을 관조하는 제4의 순수 의식 투리야(Turiya)의 각성.',
    meditativeFocus: '일상의 소란과 내면의 생각 흐름을 침묵 속에서 바라보는 고요한 관찰자의 자리에 서십시오.',
  },
];

const UPANISHADIC_TEACHINGS: UpanishadicTeaching[] = [
  {
    teachingKey: 'NetiNeti',
    teachingNameKo: '넷티 넷티 (Neti Neti: 이것도 아니고 저것도 아니다)',
    philosophicalDepth: '변화하고 소멸하는 몸, 감정, 생각은 참자아가 아니므로 일체의 집착을 거두어냄.',
    contemplativeInsight: '불안이나 분노가 올라올 때 그것은 지나가는 구름일 뿐 참된 내가 아님을 알아차리고 흘려보내십시오.',
  },
  {
    teachingKey: 'SatChitAnanda',
    teachingNameKo: '사트-치트-아난다 (존재·의식·지복의 삼위일체)',
    philosophicalDepth: '외부 대상의 충족 없이도 본래 충만한 내재적 기쁨과 완전성의 회복.',
    contemplativeInsight: '결핍을 채우려는 조급함을 내려놓을 때 본연의 고요한 지복감이 내면에서 솟아납니다.',
  },
  {
    teachingKey: 'MayaPiercing',
    teachingNameKo: '마야(Maya)의 환영 투시와 실재 자각',
    philosophicalDepth: '이름과 모양(Nama-Rupa)의 차별상에 현혹되지 않고 모든 존재의 본질적 통일성을 꿰뚫음.',
    contemplativeInsight: '겉으로 드러난 갈등과 대립의 표상을 넘어 상대방과 상황의 뿌리에 있는 근원적 생명력을 헤아리십시오.',
  },
];

function formatUpanishadicKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeUpanishadicStage(score: number): string {
  if (score >= 88) return '투리야(Turiya) 순수의식기 (이원적 분별을 넘어 범아일여의 고요가 밝아지는 흐름)';
  if (score >= 76) return '넷티 넷티(Neti Neti) 관조기 (현상의 환영을 가볍게 내려놓고 본질을 응시하는 국면)';
  return '마야(Maya) 투시 입문기 (흔들리는 생각과 감정을 한 걸음 물러나 바라보는 흐름)';
}

export function calculateUpanishadicTatTvamAsi(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): UpanishadicTatTvamAsiResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    (query ?? '') +
    'IndianUpanishadicTatTvamAsi';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const brahmanAtmanUnityScore = 67 + (absHash % 32);
  const mayaIllusionPiercingScore = 65 + ((absHash >> 3) % 34);
  const netiNetiDetachmentScore = 64 + ((absHash >> 6) % 35);
  const satChitAnandaPureConsciousnessScore = 66 + ((absHash >> 9) % 33);
  const prajnaSpiritualWisdomScore = 68 + ((absHash >> 12) % 31);

  const vakyaIndex = (absHash >> 4) % UPANISHADIC_MAHAVAKYAS.length;
  const secondaryVakyaIndex = (vakyaIndex + 1 + ((absHash >> 8) % (UPANISHADIC_MAHAVAKYAS.length - 1))) % UPANISHADIC_MAHAVAKYAS.length;
  const teachingIndex = (absHash >> 7) % UPANISHADIC_TEACHINGS.length;

  const activeMahavakya = UPANISHADIC_MAHAVAKYAS[vakyaIndex];
  const secondaryMahavakya = UPANISHADIC_MAHAVAKYAS[secondaryVakyaIndex];
  const focalUpanishadicTeaching = UPANISHADIC_TEACHINGS[teachingIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'을(를) 둘러싼 생각과 감정을 '넷티 넷티'로 잠시 내려놓고 바라보면, 그 뒤에 고요히 남는 변하지 않는 중심은 무엇인가요?`
    : `지금 내 마음을 흔드는 생각과 이름표들을 하나씩 벗겨 내면, 그 너머에서 고요히 숨 쉬는 본래의 나는 어떤 모습인가요?`;
  const interpretiveBoundary = '우파니샤드 범아일여 관점은 외적 길흉을 점치는 도구가 아니라, 현상의 분별을 넘어 순수 의식의 고요를 비추는 베단타 명상 렌즈입니다.';

  const counselTitle = `우파니샤드 범아일여 명상: ${activeMahavakya.vakyaNameKo} (${activeMahavakya.vakyaSanskrit})`;
  const spiritualGuidance = `고대 인도 우파니샤드의 지혜는 당신의 본질이 우주 전체와 분리될 수 없는 지고의 실재임을 일깨웁니다. ` +
    `지금 조응하는 대선언(Mahavakya)은 '${activeMahavakya.vakyaNameKo}'[${activeMahavakya.sourceUpanishad}]입니다. ` +
    `${activeMahavakya.meditativeFocus} 아울러 '${focalUpanishadicTeaching.teachingNameKo}'의 통찰을 통해, ` +
    `${focalUpanishadicTeaching.contemplativeInsight}`;

  const upanishadicSynthesisMatrix = {
    dominantTension: `${activeMahavakya.vakyaNameKo} ↔ ${focalUpanishadicTeaching.teachingNameKo}`,
    alignmentState:
      brahmanAtmanUnityScore >= 82 && satChitAnandaPureConsciousnessScore >= 82
        ? '사트-치트-아난다의 비이원적 순수의식 합일'
        : '넷티 넷티 관조를 통해 환영과 집착을 걷어내는 정화 국면',
    integratedAction: `${activeMahavakya.meditativeFocus} (${focalUpanishadicTeaching.contemplativeInsight})`,
  };

  const ritualAction = `[${activeMahavakya.vakyaNameKo}] ${activeMahavakya.meditativeFocus}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: UPANISHADIC_TAT_TVAM_ASI_VERSION,
    calculatedAtKst: formatUpanishadicKstTimestamp(now),
    brahmanAtmanUnityScore,
    mayaIllusionPiercingScore,
    netiNetiDetachmentScore,
    satChitAnandaPureConsciousnessScore,
    prajnaSpiritualWisdomScore,
    activeMahavakya,
    secondaryMahavakya,
    focalUpanishadicTeaching,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    upanishadicCounsel: {
      counselTitle,
      spiritualGuidance,
    },
    upanishadicSynthesisMatrix,
  };
}

export function formatUpanishadicTatTvamAsiPrompt(res: UpanishadicTatTvamAsiResult): string {
  const lines = [
    `【우파니샤드 타트 트밤 아시 & 범아일여 순수의식 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 범아일여(Brahman-Atman) 합일도: ${describeUpanishadicStage(res.brahmanAtmanUnityScore)}`,
    `- 마야(Maya) 환상 통찰 투시력: ${describeUpanishadicStage(res.mayaIllusionPiercingScore)}`,
    `- 넷티 넷티(Neti Neti) 무집착 초연도: ${describeUpanishadicStage(res.netiNetiDetachmentScore)}`,
    `- 사트-치트-아난다 순수의식 지복도: ${describeUpanishadicStage(res.satChitAnandaPureConsciousnessScore)}`,
    `- 프라즈냐(Prajna) 영적 직관 지혜력: ${describeUpanishadicStage(res.prajnaSpiritualWisdomScore)}`,
    `- 감응 대명제(Mahavakya): ${res.activeMahavakya.vakyaNameKo} [${res.activeMahavakya.vakyaSanskrit}]`,
    `- 보조 교차 대명제: ${res.secondaryMahavakya.vakyaNameKo} [${res.secondaryMahavakya.sourceUpanishad}]`,
    `- 출전: ${res.activeMahavakya.sourceUpanishad}`,
    `- 핵심 각성: ${res.activeMahavakya.coreRealization}`,
    `- 명상적 집중: ${res.activeMahavakya.meditativeFocus}`,
    `- 심화 수양 가르침: ${res.focalUpanishadicTeaching.teachingNameKo}`,
    `- 철학적 깊이: ${res.focalUpanishadicTeaching.philosophicalDepth}`,
    `- 관조적 통찰: ${res.focalUpanishadicTeaching.contemplativeInsight}`,
    `- 영적 수양 지침: ${res.upanishadicCounsel.spiritualGuidance}`,
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.upanishadicSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.upanishadicSynthesisMatrix.dominantTension} | 조율 상태: ${res.upanishadicSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.upanishadicSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
