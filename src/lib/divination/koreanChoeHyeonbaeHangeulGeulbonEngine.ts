/**
 * 외솔 최현배 선생 《우리말본》 & 한글 말글 자주권 문화 얼 계승 엔진
 *
 * 일제강점기 1942년 조선어학회 사건의 옥고를 치르며 겨레의 얼을 지켜낸 국어학자 외솔 최현배 선생의 《우리말본》, 《한글갈》, 《글본의 힘》 원전 기반.
 * 1. "한글이 목숨이다": 말이 살아야 겨레가 살고, 글이 서야 문화가 번영한다는 주체적 문화 독립 선언.
 * 2. 4대 한글 문화 자강 철학:
 *    - 배달겨레의 얼 수호(Preserving Cultural Soul): 외부의 억압 속에서도 자기 정체성과 내면의 뿌리를 지킴.
 *    - 쉬운 말글 민중 계몽(Linguistic Enlightenment): 어려운 한자나 외래어에 기대지 않고 누구나 소통하는 쉬운 글.
 *    - 글본의 힘과 창조적 실천(Power of Written Language): 체계적인 문법과 기록으로 문화적 자존을 확립함.
 *    - 옥중 투쟁의 불굴의 지조(Prison Resilience): 혹독한 시련 앞에서도 진리의 신념을 굽히지 않는 올곧음.
 * 3. 7대 말글 자강 품계 및 외솔 친필 민족혼 성찰 조언 산출
 *
 * @version LUCKEY-CHOE-HYEONBAE-GEULBON-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const CHOE_HYEONBAE_GEULBON_VERSION = 'LUCKEY-CHOE-HYEONBAE-GEULBON-v2.0.0';

export interface HangeulGeulbonStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  linguisticDomain: string;
  culturalEnlightenmentBlessing: string;
}

export interface ChoeHyeonbaeGeulbonResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  koreanSoulPreservationIndex: number; // 배달겨레 문화 얼 계승 및 주체성 지수
  geulbonLinguisticEmpowermentForce: number; // 글본(문법·어문)의 체계적 문화 창달력
  plainWordsCommunicationClarity: number; // 쉬운 우리말 소통 및 대중 계몽력
  prisonResilienceUnbendingFaith: number; // 옥중 시련 극복 및 불굴의 지조도
  hangulRevivalCivilizationPower: number; // 한글 부흥 및 미래 지식 문명화 실현력
  // 세부 명세
  activeGeulbonStage: HangeulGeulbonStage;
  primaryOesolVirtue: {
    virtueNameKo: string;
    koreanMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  oesolLegacyReflection: {
    manuscriptTitle: string;
    nationalSoulWisdom: string;
  };
  geulbonSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatGeulbonKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeGeulbonStage(score: number): string {
  if (score >= 88) return '한글자강(한글自强) — 우리말의 맑은 주체성과 옥중절개의 신념이 하나로 선 확립기';
  if (score >= 76) return '말모이정진(말모이精進) — 쉬운 말로 진실을 엮어 내면을 정돈하는 성숙기';
  return '새싹다짐(새싹다짐) — 말과 글의 기본기를 세워 스스로의 중심을 다지는 준비기';
}

export type ChoeHyeonbaeGeulbonReport = ChoeHyeonbaeGeulbonResult;

const GEULBON_STAGES: HangeulGeulbonStage[] = [
  { stageLevel: 1, stageNameHanja: 'Uri Malbon (우리말본)', stageNameKo: '겨레의 생각을 온전히 담아내는 말글의 기둥', linguisticDomain: '혼란 속에서도 흔들리지 않는 주체적 언어와 철학 체계 정립', culturalEnlightenmentBlessing: '나만의 고유한 정체성과 신념을 반석 위에 세우는 힘' },
  { stageLevel: 2, stageNameHanja: 'Hangeul Gal (한글갈)', stageNameKo: '원리와 역사를 깊이 파고드는 학문적 통찰관', linguisticDomain: '역사의 흐름 속에서 본질적인 가치를 찾아내고 정립함', culturalEnlightenmentBlessing: '남의 흉내를 내지 않고 근본 원리를 꿰뚫어 보는 지혜' },
  { stageLevel: 3, stageNameHanja: 'Geulbon Him (글본의 힘)', stageNameKo: '생각을 글로 엮어 문명을 일으키는 실천관', linguisticDomain: '체계적인 기록과 표현으로 세상을 올바르게 이끎', culturalEnlightenmentBlessing: '말과 글에 진실한 힘을 실어 사람들을 감동하게 함' },
  { stageLevel: 4, stageNameHanja: 'Malmoe Geodeum (말모이 거둠)', stageNameKo: '흩어진 지혜의 조각을 정성껏 모으는 집대성관', linguisticDomain: '소외되고 잊혀가는 소중한 가치들을 소중히 갈무리함', culturalEnlightenmentBlessing: '작은 정성을 모아 거대한 문화적 유산을 빚어내는 인내' },
  { stageLevel: 5, stageNameHanja: 'Swiun Geul (쉬운 글길)', stageNameKo: '누구나 이해할 수 있도록 문턱을 낮추는 배려관', linguisticDomain: '권위적인 언어를 버리고 대중과 진솔하게 소통함', culturalEnlightenmentBlessing: '자신을 낮추어 타인에게 다가가 마음을 여는 소통력' },
  { stageLevel: 6, stageNameHanja: 'Okjung Jeolgae (옥중절개)', stageNameKo: '차가운 쇠창살 속에서도 꺾이지 않는 꼿꼿한 선비', linguisticDomain: '가장 가혹한 탄압 속에서도 결코 소신을 굽히지 않음', culturalEnlightenmentBlessing: '세속의 압력에 굴하지 않고 양심을 지키는 숭고한 용기' },
  { stageLevel: 7, stageNameHanja: 'Baeum Saessak (배움의 새싹)', stageNameKo: '새로운 낱말을 배우며 눈을 뜨는 배움의 첫걸음', linguisticDomain: '겸허한 자세로 기초를 닦으며 성장하는 순수한 열정', culturalEnlightenmentBlessing: '정직하게 배우고 익히며 내일을 준비하는 성실함' },
];

const OESOL_VIRTUES = [
  { virtueNameKo: '나의 뿌리와 문화적 정체성을 당당히 지켜라', koreanMotto: '말이 살아야 나라가 산다', coreEssence: '남의 기준에 휩쓸리지 않고 내 고유한 존재 이유와 얼을 지킴', actionableDirective: '유행이나 남의 시선에 흔들리지 말고 내 주체성과 자존감을 굳건히 지키십시오.' },
  { virtueNameKo: '허세를 부리지 말고 가장 쉽고 진솔하게 표현하라', koreanMotto: '쉬운 말로 진실을 전하라', coreEssence: '어려운 껍데기를 벗고 알맹이 있는 정직한 소통을 실천함', actionableDirective: '불필요한 과시나 복잡한 말을 삼가고 명확하고 따뜻한 언어로 다가가십시오.' },
  { virtueNameKo: '원칙과 체계를 세워 흔들림 없는 기틀을 다지라', koreanMotto: '바른 글본이 바른 생각을 낳는다', coreEssence: '기초적인 원리원칙을 바로잡아 혼란과 오해를 미연에 방지함', actionableDirective: '주먹구구식 일 처리를 멈추고 체계적인 계획과 정돈된 기록으로 일하십시오.' },
  { virtueNameKo: '어떤 압박 속에서도 진리의 신념을 굽히지 말라', koreanMotto: '옥중에서도 뜻은 꺾이지 않는다', coreEssence: '외로운 처지에서도 양심과 옳은 길을 끝까지 포기하지 않음', actionableDirective: '일시적인 불이익이나 오해를 두려워하지 말고 올바른 대의를 묵묵히 밀고 나가십시오.' },
];

const OESOL_LEGACIES = [
  { manuscriptTitle: '함흥형무소 차가운 바닥 위의 기도', nationalSoulWisdom: '몸은 비록 쇠사슬에 묶였을지라도, 내 겨레의 말과 글을 향한 사랑은 불꽃이 되어 영원히 타오른다.' },
  { manuscriptTitle: '해방된 조국의 우리말 첫걸음 교과서', nationalSoulWisdom: '어둠이 걷히고 새 아침이 밝아올 때, 준비된 자만이 겨레의 아이들에게 찬란한 희망의 글을 가르칠 수 있다.' },
  { manuscriptTitle: '외솔의 서재에 쌓인 원고 뭉치', nationalSoulWisdom: '거대한 혁명은 칼끝에서 시작되는 것이 아니라, 밤새워 써 내려간 한 줄의 정직한 글 속에서 움튼다.' },
  { manuscriptTitle: '한글 전용과 문화 자강의 외침', nationalSoulWisdom: '남의 문자를 빌려 쓰는 자는 남의 종이 되나니, 내 글을 사랑하고 지키는 자만이 참된 자유를 누린다.' },
];

function getKstDateString(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateChoeHyeonbaeGeulbon(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): ChoeHyeonbaeGeulbonResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`CHOE-HYEONBAE-GEULBON-${birthdate}-${birthtime}-${name}-${query ?? ''}`);

  const koreanSoulPreservationIndex = (seed % 41) + 60; // 60~100
  const geulbonLinguisticEmpowermentForce = ((seed >> 3) % 43) + 58; // 58~100
  const plainWordsCommunicationClarity = ((seed >> 5) % 39) + 62; // 62~100
  const prisonResilienceUnbendingFaith = ((seed >> 7) % 45) + 55; // 55~99
  const hangulRevivalCivilizationPower = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % GEULBON_STAGES.length;
  const activeGeulbonStage = GEULBON_STAGES[stageIdx];

  const virtueIdx = (seed >> 4) % OESOL_VIRTUES.length;
  const primaryOesolVirtue = OESOL_VIRTUES[virtueIdx];

  const legacyIdx = (seed >> 6) % OESOL_LEGACIES.length;
  const oesolLegacyReflection = OESOL_LEGACIES[legacyIdx];

  const calculatedAtKst = formatGeulbonKstTimestamp(now);
  const avgScore = Math.round(
    (koreanSoulPreservationIndex +
      geulbonLinguisticEmpowermentForce +
      plainWordsCommunicationClarity +
      prisonResilienceUnbendingFaith +
      hangulRevivalCivilizationPower) /
      5,
  );
  const geulbonSynthesisMatrix = {
    dominantTension: `${activeGeulbonStage.stageNameKo} ↔ ${primaryOesolVirtue.koreanMotto}`,
    alignmentState: describeGeulbonStage(avgScore),
    integratedAction: `${primaryOesolVirtue.actionableDirective}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: CHOE_HYEONBAE_GEULBON_VERSION,
    calculatedAtKst,
    koreanSoulPreservationIndex,
    geulbonLinguisticEmpowermentForce,
    plainWordsCommunicationClarity,
    prisonResilienceUnbendingFaith,
    hangulRevivalCivilizationPower,
    activeGeulbonStage,
    primaryOesolVirtue,
    oesolLegacyReflection,
    geulbonSynthesisMatrix,
  };
}

export function formatChoeHyeonbaeGeulbonPrompt(result: ChoeHyeonbaeGeulbonResult): string {
  const avgScore = Math.round(
    (result.koreanSoulPreservationIndex +
      result.geulbonLinguisticEmpowermentForce +
      result.plainWordsCommunicationClarity +
      result.prisonResilienceUnbendingFaith +
      result.hangulRevivalCivilizationPower) /
      5,
  );
  const lines = [
    `[📖 외솔 최현배 선생 《우리말본》 & 한글 문화 얼 계승 리포트]`,
    `- 연산 시각: ${result.calculatedAtKst} | 엔진 버전: ${result.engineVersion}`,
    `- 말글 자강 국면: ${describeGeulbonStage(avgScore)}`,
    `- 현행 말글 자강 품계: **[${result.activeGeulbonStage.stageNameKo} (${result.activeGeulbonStage.stageNameHanja})]**`,
    `  → 관장 영역: ${result.activeGeulbonStage.linguisticDomain}`,
    `  → 문화 계몽 축복: ${result.activeGeulbonStage.culturalEnlightenmentBlessing}`,
    `- 최우선 외솔 덕목: **[${result.primaryOesolVirtue.virtueNameKo} (${result.primaryOesolVirtue.koreanMotto})]**`,
    `  → 핵심 본질: ${result.primaryOesolVirtue.coreEssence}`,
    `  → 실천 지침: ${result.primaryOesolVirtue.actionableDirective}`,
    `- 외솔의 민족혼 유산: 《${result.oesolLegacyReflection.manuscriptTitle}》`,
    `  → 겨레의 불멸 지혜: "${result.oesolLegacyReflection.nationalSoulWisdom}"`,
  ];
  if (result.geulbonSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${result.geulbonSynthesisMatrix.dominantTension} | 조율 상태: ${result.geulbonSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${result.geulbonSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
