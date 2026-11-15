/**
 * =========================================================================
 * LUCKEY 고대 슬라브 베다 신화 16 스바로그 체계 & 로드(Rod) 영혼 가계 카르마 엔진
 * (Slavic Svarog Circle & Rod Ancestral Karma Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 슬라브-아리아 베다 전통의 16 스바로그 원환 (Сварожий Круг / Svarog Circle)과
 * 모든 생명과 가계의 근원신인 로드(Род / Rod), 대장장이 창조신 스바로그(Сварог),
 * 어머니 신 라다(Лада), 천둥신 페룬(Перун), 지혜와 지하의 신 벨레스(Велес) 원전.
 * 
 * 1. 16 천상 궁 (Sixteen Chertegi / Чертоги):
 *    - 처녀궁(Девы), 멧돼지궁(Вепря), 파이크궁(Щуки), 백조궁(Лебедя),
 *      뱀/살모사궁(Змея), 큰까마귀궁(Ворона), 곰궁(Медведя), 왜가리궁(Бусла),
 *      늑대궁(Волка), 여우궁(Лисы), 황소/투르궁(Тура), 엘크궁(Лося),
 *      피닉스/매궁(Финиста), 말궁(Коня), 독수리궁(Орла), 스바로그궁 등
 *    - 각 궁마다 고유한 슬라브 수호신과 성스러운 신목(Sacred Tree)이 배속됨.
 * 2. 조상신 로드(Rod)의 가계 카르마와 혈통의 축복 (Ancestral Lineage Blessing):
 *    - 세대를 거쳐 전승된 가계 무의식의 강점과 영혼의 매듭(Knot of Fate) 해원
 * 3. 4대 슬라브 원소 정렬:
 *    - 세마르글 (Semargl, 신성한 성화 / 불의 영)
 *    - 다나 (Dana, 맑은 생명수 / 물의 영)
 *    - 모코시 (Mokosh, 풍요로운 대지모신 / 흙의 영)
 *    - 스트리보그 (Stribog, 천공의 선풍 / 바람의 영)
 * 4. 슬라브 신성 룬 보호 심볼 (Slavic Sacred Runes / 알라티르 등)
 */

import type { UserProfile } from '../sharedState';

export const SLAVIC_SVAROG_VERSION = 'LUCKEY-SLAVIC-SVAROG-v2.0.0';

export interface SvarogHallCherteg {
  code: string;
  russianName: string;
  koreanName: string;
  patronDeity: string;
  sacredTree: string;
  soulVirtue: string;
  karmicChallenge: string;
}

export interface RodAncestralKarma {
  ancestralLineageGift: string;     // 조상 가계로부터 물려받은 영적 재능
  ancestralHealingTheme: string;    // 가계에서 대물림된 치유/해원 과제
  rodProtectionScore: number;       // 0 ~ 100 로드신의 가호 지수
  generationalKnotResolution: string; // 가계 매듭 해소를 위한 영적 조언
}

export interface FourSlavicElements {
  fireSemargl: number;  // 성화 (불) 0 ~ 100
  waterDana: number;    // 생명수 (물) 0 ~ 100
  earthMokosh: number;  // 대지모신 (흙) 0 ~ 100
  airStribog: number;   // 선풍 (바람) 0 ~ 100
  dominantElement: string;
}

export interface SlavicSvarogCircleReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  svarogHall: SvarogHallCherteg;
  ancestralKarma: RodAncestralKarma;
  elements: FourSlavicElements;
  sacredRuneSymbol: {
    symbolName: string;
    koreanTitle: string;
    protectiveMeaning: string;
  };
  totalSvarogHarmonics: number; // 0 ~ 100
  synthesisMessage: string;
  svarogSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatSvarogKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

const CHERTEG_HALLS: SvarogHallCherteg[] = [
  { code: 'BEAR', russianName: 'Чертог Медведя', koreanName: '곰의 궁 (체르토크 메드베댜)', patronDeity: '스바로그 (Svarog, 천상 창조신)', sacredTree: '너도밤나무 (Beech)', soulVirtue: '불굴의 인내심, 묵직한 통솔력과 대기만성의 힘', karmicChallenge: '완고함과 고집을 내려놓고 부드러움을 포용할 것' },
  { code: 'WOLF', russianName: 'Чертог Волка', koreanName: '늑대의 궁 (체르토크 볼카)', patronDeity: '벨레스 (Veles, 지혜와 마법의 신)', sacredTree: '포플러 (Poplar)', soulVirtue: '예리한 직관, 충직함, 보이지 않는 길을 찾아내는 탐색력', karmicChallenge: '고립감과 불신을 극복하고 영혼의 무리와 유대할 것' },
  { code: 'FOX', russianName: 'Чертог Лисы', koreanName: '여우의 궁 (체르토크 리시)', patronDeity: '마레나 (Marena, 겨울과 재탄생의 여신)', sacredTree: '서나무 (Hornbeam)', soulVirtue: '기민한 지혜, 전략적 처세술, 다채로운 적응력', karmicChallenge: '잔꾀에 의존하지 않고 진실성을 밑바탕에 둘 것' },
  { code: 'EAGLE', russianName: 'Чертог Орла', koreanName: '독수리의 궁 (체르토크 오를라)', patronDeity: '페룬 (Perun, 천둥과 정의의 수호신)', sacredTree: '참나무 (Oak)', soulVirtue: '높은 이상, 타협 없는 정의감, 거시적 통찰력', karmicChallenge: '독선과 오만을 경계하고 약자를 따뜻하게 품을 것' },
  { code: 'FALCON', russianName: 'Чертог Финиста', koreanName: '매/피닉스의 궁 (체르토크 피니스타)', patronDeity: '코르고르 (Vyshen, 초월적 천공신)', sacredTree: '체리나무 (Cherry)', soulVirtue: '신속한 판단, 부활의 회복탄력성, 목표를 향한 비행', karmicChallenge: '조급함을 가라앉히고 시작한 일의 끝을 맺을 것' },
  { code: 'HORSE', russianName: 'Чертог Коня', koreanName: '말의 궁 (체르토크 코냐)', patronDeity: '쿠팔라 (Kupala, 청춘과 생명력의 신)', sacredTree: '느릅나무 (Elm)', soulVirtue: '끝없는 열정, 자유를 향한 도약, 활기찬 낙천성', karmicChallenge: '산만함을 경계하고 하나의 깊은 우물을 팔 것' },
  { code: 'RAVEN', russianName: 'Чертог Ворона', koreanName: '큰까마귀의 궁 (체르토크 보로나)', patronDeity: '콜랴다 (Kolyada, 우주 주기와 변화의 신)', sacredTree: '낙엽송 (Larch)', soulVirtue: '예언적 지혜, 삶과 죽음의 신비 이해, 치유의 언어', karmicChallenge: '비관주의를 넘어서 희망의 빛을 먼저 볼 것' },
  { code: 'SWAN', russianName: 'Чертог Лебедя', koreanName: '백조의 궁 (체르토크 레베댜)', patronDeity: '라다 (Lada, 사랑과 아름다움의 대모신)', sacredTree: '소나무 (Pine)', soulVirtue: '우아한 품격, 가정을 가꾸는 헌신, 조화로운 평화', karmicChallenge: '감정적 의존성을 버리고 홀로 서는 자립심을 기를 것' },
];

function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateSlavicSvarogCircle(params: {
  profile?: UserProfile;
  contextText?: string;
  referenceDate?: Date;
}): SlavicSvarogCircleReport {
  const now = params.referenceDate || new Date();
  const birthdate = params.profile?.basic?.birthdate?.trim() || '1990-01-01';
  const name = params.profile?.basic?.name?.trim() || '슬라브영혼';
  const context = (params.contextText || '').trim();

  const seed = stringHash(`${birthdate}|${name}|${now.toISOString().slice(0, 10)}|${context}`);

  // 1. 16 스바로그 체르토크 궁 매핑
  const birthMonth = parseInt(birthdate.slice(5, 7), 10) || 1;
  const birthDay = parseInt(birthdate.slice(8, 10), 10) || 1;
  const hallIdx = (birthMonth * 2 + Math.floor(birthDay / 16) + (seed % 3)) % CHERTEG_HALLS.length;
  const svarogHall = CHERTEG_HALLS[hallIdx];

  // 2. 조상신 로드(Rod)의 가계 카르마
  const lineageGifts = [
    '고난 속에서도 반드시 일어서는 가계의 불굴의 회복탄력성',
    '세대와 세대를 이어온 예리한 직관과 선견지명의 지혜',
    '말과 손으로 사람을 치유하고 살려내는 생명력의 은총',
    '어려운 이웃을 모으고 베풀어 번영을 일구는 가문의 인덕',
  ];
  const healingThemes = [
    '과거 세대의 인정 투쟁과 침묵된 분노를 연민으로 녹여내는 과제',
    '가계에 누적된 결핍 불안을 털어내고 진정한 풍요로움을 허락하는 과제',
    '희생자 의식을 벗어나 주체적인 가문의 개척자로 당당히 서는 과제',
    '가족 간의 감정적 결박을 풀고 건강한 영혼의 자율성을 확립하는 과제',
  ];
  const knotResolutions = [
    '조상들의 노고에 감사하되 그들의 짐을 대신 짊어지지 말고, 오직 당신 자신의 길을 빛내는 것이 최고의 효도입니다.',
    '마음속으로 가계의 뿌리를 향해 "당신들의 사랑을 받되, 저는 새로운 평화의 역사를 씁니다"라고 선언하세요.',
    '과거의 상처를 되풀이하지 않고 새로운 선택을 내릴 때, 7대에 걸친 가계의 카르마 매듭이 일시에 풀립니다.',
  ];

  const rodProtectionScore = 65 + (seed % 31); // 65 ~ 95
  const ancestralKarma: RodAncestralKarma = {
    ancestralLineageGift: lineageGifts[(seed >> 1) % lineageGifts.length],
    ancestralHealingTheme: healingThemes[(seed >> 2) % healingThemes.length],
    rodProtectionScore,
    generationalKnotResolution: knotResolutions[(seed >> 3) % knotResolutions.length],
  };

  // 3. 4대 슬라브 원소 정렬
  const fireSemargl = 40 + (seed % 56);
  const waterDana = 40 + ((seed >> 2) % 56);
  const earthMokosh = 40 + ((seed >> 4) % 56);
  const airStribog = 40 + ((seed >> 6) % 56);

  let dominantElement = '세마르글 (Semargl / 성스러운 불의 원소 - 정화와 열정)';
  const maxElem = Math.max(fireSemargl, waterDana, earthMokosh, airStribog);
  if (maxElem === waterDana) {
    dominantElement = '다나 (Dana / 생명수 원소 - 치유와 유연한 감정의 순환)';
  } else if (maxElem === earthMokosh) {
    dominantElement = '모코시 (Mokosh / 대지 원소 - 풍요와 든든한 현실 구축)';
  } else if (maxElem === airStribog) {
    dominantElement = '스트리보그 (Stribog / 바람 원소 - 영감과 자유로운 사유의 확산)';
  }

  const elements: FourSlavicElements = {
    fireSemargl,
    waterDana,
    earthMokosh,
    airStribog,
    dominantElement,
  };

  // 4. 슬라브 신성 룬 심볼
  const runes = [
    { symbolName: '알라티르 (Алатырь / Alatyr)', koreanTitle: '우주의 중심 성석이자 생명의 샘', protectiveMeaning: '혼돈 속에서 흔들리지 않는 중심을 잡고 우주 신성의 빛을 온몸으로 흡수하는 절대 방어' },
    { symbolName: '콜로브라트 (Коловрат / Kolovrat)', koreanTitle: '태양의 영원한 회전과 승리', protectiveMeaning: '어둠과 침체를 물리치고 끊임없이 순환하는 태양의 생명력으로 운명을 쇄신하는 부적' },
    { symbolName: '스바로그 광휘 (Звезда Сварога)', koreanTitle: '천상 장인의 조화와 균형의 별', protectiveMeaning: '흐트러진 일상과 관계의 질서를 바로잡고 성실한 노력에 완벽한 결실을 가져다주는 가호' },
    { symbolName: '라다의 별 (Звезда Лады)', koreanTitle: '사랑과 영혼 평화의 신성한 불꽃', protectiveMeaning: '내면의 갈등을 가라앉히고 가정과 영혼에 온화한 화목과 온기를 채우는 보호막' },
  ];
  const sacredRuneSymbol = runes[(seed + (now.getUTCDate() % 4)) % runes.length];

  const totalSvarogHarmonics = Math.round((rodProtectionScore * 0.5) + (maxElem * 0.5));

  const synthesisMessage = `당신은 슬라브 16궁 중 [${svarogHall.koreanName}]의 가호를 받으며, 수호신 [${svarogHall.patronDeity}]과 성목 [${svarogHall.sacredTree}]의 정기가 깃들어 있습니다. 조상신 로드의 가호 아래 "${ancestralKarma.generationalKnotResolution}"`;
  const calculatedAtKst = formatSvarogKstTimestamp(now);
  const svarogSynthesisMatrix = {
    dominantTension: `${svarogHall.koreanName} (${svarogHall.karmicChallenge}) ↔ ${elements.dominantElement}`,
    alignmentState: `${sacredRuneSymbol.symbolName} · ${ancestralKarma.ancestralLineageGift}`,
    integratedAction: `${ancestralKarma.generationalKnotResolution}${context ? ` [질문 맥락: ${context}]` : ''}`,
  };

  return {
    engineVersion: SLAVIC_SVAROG_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    svarogHall,
    ancestralKarma,
    elements,
    sacredRuneSymbol,
    totalSvarogHarmonics,
    synthesisMessage,
    svarogSynthesisMatrix,
  };
}

export function formatSlavicSvarogCirclePrompt(report: SlavicSvarogCircleReport): string {
  const lines = [
    `### 🌌 고대 슬라브 16 스바로그 체계 & 로드(Rod) 가계 카르마 엔진 (${SLAVIC_SVAROG_VERSION})`,
    `- **연산 시각**: ${report.calculatedAtKst}`,
    `- **스바로그 궁(Cherteg)**: **${report.svarogHall.koreanName}** [수호신: ${report.svarogHall.patronDeity} | 성목: ${report.svarogHall.sacredTree}]`,
    `  - 영혼의 미덕: ${report.svarogHall.soulVirtue}`,
    `  - 카르마 극복 과제: ${report.svarogHall.karmicChallenge}`,
    `- **조상신 로드(Rod) 가계 카르마 분석**:`,
    `  - 물려받은 혈통의 재능: ${report.ancestralKarma.ancestralLineageGift}`,
    `  - 세대 대물림 치유 테마: ${report.ancestralKarma.ancestralHealingTheme}`,
    `  - 카르마 매듭 해원 조언: ${report.ancestralKarma.generationalKnotResolution}`,
    `- **4대 슬라브 원소 주도 기운**: ${report.elements.dominantElement}`,
    `- **슬라브 신성 수호 룬**: ${report.sacredRuneSymbol.symbolName} [${report.sacredRuneSymbol.koreanTitle}]`,
    `  - 영혼 방어 지침: ${report.sacredRuneSymbol.protectiveMeaning}`,
    `- **스바로그 통합 나침반**: ${report.synthesisMessage}`,
  ];
  if (report.svarogSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.svarogSynthesisMatrix.dominantTension} | 조율 상태: ${report.svarogSynthesisMatrix.alignmentState}]`,
      `  - 통합 실천: ${report.svarogSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
