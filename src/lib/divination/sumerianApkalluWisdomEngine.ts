/**
 * 고대 수메르 에리두 엔키(Enki) 7대 압갈루(Apkallu) 현자 & 신성 지혜 엔진 (sumerianApkalluWisdomEngine.ts)
 *
 * 기원전 메소포타미아 수메르 에리두(Eridu) 원전 전승 기반:
 * 대홍수 이전 지하 담수의 심연 압수(Apsu)에서 올라와 인류에게 문명과 지혜의 메(Me)를 전수한 7대 압갈루(Apkallu) 반인반어 현자.
 * 1. 우안나 (Uanna) - 문명 질서와 통섭의 설계자
 * 2. 우안네두가 (Uannedugga) - 깊은 사유와 천문 통찰의 현자
 * 3. 엔메두가 (Enmedugga) - 공평한 규범과 진실 수호의 판관
 * 4. 엔메갈라마 (Enmegalamma) - 창의적 기술과 정밀 공예의 대가
 * 5. 엔메불루가 (Enmebulugga) - 생명 치유와 대지 순환의 약사
 * 6. 안-엔릴다 (An-Enlilda) - 부정함 척결과 성별(聖別)의 정화자
 * 7. 우투압주 (Utuabzu) - 태양광명과 미래 예지의 영적 선구자
 *
 * 지혜의 주재신 엔키(Enki)의 가호 아래, 내담자의 난관 극복 지혜와 영적 심연의 통찰력을 100% 결정론적으로 도출합니다.
 */

import type { UserProfile } from '../sharedState';

export const SUMERIAN_APKALLU_WISDOM_ENGINE_VERSION = '2.2.0';

export interface ApkalluSage {
  id: string;
  nameKo: string;
  sumerianName: string;
  title: string;
  archetype: string;
  element: '심연의 담수(Apsu)' | '천상의 불(An)' | '대지의 맥(Ki)' | '바람의 호흡(Enlil)';
  resonancePower: number; // 0 ~ 100
  divineWisdom: string;
}

export interface SumerianApkalluWisdomReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  apkalluResonanceScore: number; // 0 ~ 100 7현자 지혜 감응도
  apsuClarityIndex: number; // 0 ~ 100 압수(담수) 정화 지수
  activeSage: ApkalluSage;
  secondarySage: ApkalluSage;
  enkiDecree: string; // 엔키 신의 신성 칙령
  meRestorationGuidance: string; // 메(Me) 질서 회복을 위한 현실 실천 지침
  reflectiveQuestion: string; // 내담자 성찰 질문
  interpretiveBoundary: string; // 상징 해석 경계 고지
  ritualAction: string;
  reflectionFocus: string;
  apkalluSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatApkalluKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

const APKALLU_SAGES: Omit<ApkalluSage, 'resonancePower'>[] = [
  {
    id: 'uanna',
    nameKo: '우안나',
    sumerianName: 'U-An-Na',
    title: '문명 질서와 통섭의 설계자',
    archetype: '어둠의 혼돈에서 문명의 법과 질서를 세우는 개척자',
    element: '심연의 담수(Apsu)',
    divineWisdom: '기초가 단단하지 않은 성은 무너지니, 본질적인 원칙을 세우고 체계를 세밀히 구축하라.',
  },
  {
    id: 'uannedugga',
    nameKo: '우안네두가',
    sumerianName: 'U-An-Ne-Dug-Ga',
    title: '깊은 사유와 천문 통찰의 현자',
    archetype: '별들의 운행과 시간의 비밀을 꿰뚫어 보는 지식인',
    element: '천상의 불(An)',
    divineWisdom: '당장의 조급함에 시야를 좁히지 말고, 더 넓은 시공간의 흐름과 타이밍을 관찰하라.',
  },
  {
    id: 'enmedugga',
    nameKo: '엔메두가',
    sumerianName: 'En-Me-Dug-Ga',
    title: '공평한 규범과 진실 수호의 판관',
    archetype: '치우침 없는 저울로 정의와 약속을 지키는 수호령',
    element: '바람의 호흡(Enlil)',
    divineWisdom: '신뢰와 정직이야말로 파도를 잠재우는 가장 견고한 닻이니, 진실에 발을 디뎌라.',
  },
  {
    id: 'enmegalamma',
    nameKo: '엔메갈라마',
    sumerianName: 'En-Me-Gal-Am-Ma',
    title: '창의적 기술과 정밀 공예의 대가',
    archetype: '무형의 영감을 실체적 현실로 직조해내는 장인',
    element: '대지의 맥(Ki)',
    divineWisdom: '상상에 머무르지 말고 손끝으로 실질적인 결과물을 빚어내어 세상에 증명하라.',
  },
  {
    id: 'enmebulugga',
    nameKo: '엔메불루가',
    sumerianName: 'En-Me-Bu-Lug-Ga',
    title: '생명 치유와 대지 순환의 약사',
    archetype: '상처 입은 활력을 소생시키고 생태적 균형을 회복하는 치유자',
    element: '심연의 담수(Apsu)',
    divineWisdom: '소진된 몸과 마음에 충분한 쉼과 정갈한 양분을 공급하여 뿌리부터 회복시켜라.',
  },
  {
    id: 'an_enlilda',
    nameKo: '안-엔릴다',
    sumerianName: 'An-En-Lil-Da',
    title: '부정함 척결과 성별의 정화자',
    archetype: '탁기를 털어내고 거룩한 의식으로 삶을 순수하게 정돈하는 사제',
    element: '바람의 호흡(Enlil)',
    divineWisdom: '해로운 관계와 부정적인 습관을 씻어내어 신성한 기운이 머물 자리를 마련하라.',
  },
  {
    id: 'utuabzu',
    nameKo: '우투압주',
    sumerianName: 'Utu-Abzu',
    title: '태양광명과 미래 예지의 영적 선구자',
    archetype: '압수의 어둠을 뚫고 솟아오른 빛으로 미래를 밝히는 예언자',
    element: '천상의 불(An)',
    divineWisdom: '두려움의 장막 뒤에 숨겨진 진정한 가능성을 믿고 주저 없이 앞으로 걸어가라.',
  },
];

export function calculateSumerianApkalluWisdom(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): SumerianApkalluWisdomReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  let seed = 314159;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 37 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 23 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 19 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 11) % 1000003;

  const sagePowers = APKALLU_SAGES.map((sage, idx) => {
    const power = 45 + ((seed * (idx + 7) + idx * 13) % 52);
    return { ...sage, resonancePower: power };
  });

  sagePowers.sort((a, b) => b.resonancePower - a.resonancePower);
  const activeSage = sagePowers[0];
  const secondarySage = sagePowers[1];

  const apkalluResonanceScore = Math.min(100, Math.max(35, Math.floor((activeSage.resonancePower + secondarySage.resonancePower) / 2)));
  const apsuClarityIndex = Math.min(100, Math.max(40, 50 + ((seed * 17) % 48)));

  const enkiDecree = `압수(Apsu)의 맑은 물이 너의 통찰을 씻어내리니, ${activeSage.nameKo}의 지혜("${activeSage.divineWisdom}")를 품고 나아가라.`;

  const meRestorationGuidance = `${activeSage.nameKo}의 가호에 따라 ${activeSage.title}의 역량을 현실에 발현하십시오. ${secondarySage.nameKo}의 조언("${secondarySage.divineWisdom}")을 겸비하면 일의 매듭이 자연스럽게 풀릴 것입니다.`;

  const calculatedAtKst = formatApkalluKstTimestamp(now);
  const reflectiveQuestion = question
    ? `"${question}"의 갈림길에서 ${activeSage.nameKo}(${activeSage.title})의 원칙을 먼저 세운다면, ${secondarySage.nameKo}의 시선으로 당장 덜어내야 할 조급함은 무엇입니까?`
    : `지금 일상에서 ${activeSage.nameKo}(${activeSage.element})의 지혜를 현실의 한 가지 행동으로 옮긴다면 무엇부터 정돈하시겠습니까?`;
  const interpretiveBoundary =
    '고대 수메르 압갈루(Apkallu) 7현자 상징은 내면의 판단 기준과 행동 태도를 성찰하기 위한 은유적 관점이며, 미래 사건의 단정적 예언이나 의학·법률·재무 판단을 대체하지 않습니다.';
  const ritualAction = `[${activeSage.nameKo} · ${activeSage.element}] ${activeSage.divineWisdom}`;
  const reflectionFocus = `수메르 7대 압갈루(${activeSage.nameKo}) — ${activeSage.title}`;
  const apkalluSynthesisMatrix = {
    dominantTension: `${activeSage.nameKo}(${activeSage.element}) ↔ ${secondarySage.nameKo}(${secondarySage.element})`,
    alignmentState: `${activeSage.title} · ${secondarySage.title}`,
    integratedAction: `${activeSage.divineWisdom}${question ? ` [질문 맥락: ${question}]` : ''}`,
  };

  return {
    engineVersion: SUMERIAN_APKALLU_WISDOM_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    apkalluResonanceScore,
    apsuClarityIndex,
    activeSage,
    secondarySage,
    enkiDecree,
    meRestorationGuidance,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    apkalluSynthesisMatrix,
  };
}

export function formatSumerianApkalluWisdomPrompt(rep: SumerianApkalluWisdomReport): string {
  const lines = [
    `[고대 수메르 에리두 엔키(Enki) 7대 압갈루(Apkallu) 현자 신성 지혜 실측 데이터]`,
    `· 엔진 버전: v${rep.engineVersion} | 연산 시각: ${rep.calculatedAtKst}`,
    `· 주재 압갈루 현자: ${rep.activeSage.nameKo} (${rep.activeSage.sumerianName})`,
    `  - 원형 칭호: ${rep.activeSage.title} [원소: ${rep.activeSage.element}]`,
    `  - 신성 지혜 훈언: "${rep.activeSage.divineWisdom}"`,
    `· 보조 압갈루 현자: ${rep.secondarySage.nameKo} (${rep.secondarySage.sumerianName})`,
    `  - 조력 조언: "${rep.secondarySage.divineWisdom}"`,
    `· 지혜신 엔키의 칙령: ${rep.enkiDecree}`,
    `· 메(Me) 질서 회복 처방: ${rep.meRestorationGuidance}`,
    `· 실천 의례: ${rep.ritualAction}`,
    `· 성찰 초점: ${rep.reflectionFocus}`,
    `· 성찰 질문: ${rep.reflectiveQuestion}`,
    `· 해석 경계: ${rep.interpretiveBoundary}`,
  ];
  if (rep.apkalluSynthesisMatrix) {
    lines.push(
      `· 교차 매트릭스: [핵심 긴장: ${rep.apkalluSynthesisMatrix.dominantTension} | 조율 상태: ${rep.apkalluSynthesisMatrix.alignmentState}]`,
      `  - 통합 실천: ${rep.apkalluSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
