/**
 * 프랑스 르네상스 미셸 드 몽테뉴(Michel de Montaigne) 수상록(Essais) 회의주의·자기성찰 엔진
 *
 * 16세기 프랑스 인문주의 철학자 미셸 드 몽테뉴(1533~1592)의 불후의 저작 《수상록(Essais)》 원전 기반:
 * 1. "내가 무엇을 아는가?(Que sais-je?)": 고대 피론주의 회의론을 계승하여 인간 지식의 한계를 솔직하게 인정하고 모든 독단과 편협한 도그마에서 벗어나는 지적 겸양.
 * 2. 자기성찰(Introspection)과 정직성: "내 책의 소재는 바로 나 자신이다(Je suis moy-mesmes la matiere de mon livre)." 꾸밈없이 자신의 약점과 일상을 관찰하며 얻는 진솔한 인간 이해.
 * 3. 자연스러움과 중용(Naturel & Modération): 거창하고 비현실적인 이상주의 대신 인간 본성과 자연의 이치에 순응하며 순간의 즐거움과 책무를 온화하게 조화시키는 삶의 기술.
 * 4. 관용(Tolérance)과 다름의 수용: 《식인종에 대하여(Des Cannibales)》 등에서 나타난 문화적 상대주의와 편견 타파, 타인에 대한 열린 공감.
 * 5. 죽음과 유한성에 대한 유연한 초연함: "철학을 한다는 것은 죽는 법을 배우는 것이다." 그러나 나아가 "죽음은 삶의 끝이지 목표가 아니다. 삶에 온전히 몰입하라."
 *
 * @version LUCKEY-MONTAIGNE-ESSAIS-WISDOM-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const MONTAIGNE_ESSAIS_WISDOM_VERSION = 'LUCKEY-MONTAIGNE-ESSAIS-WISDOM-v1.0.0';

export interface MontaigneThematicEssay {
  essayKey: string;
  essayTitleFrench: string;
  essayTitleKo: string;
  corePhilosophicalIdea: string;
  practicalReflection: string;
}

export interface MontaigneHumanistMaxim {
  maximKey: string;
  maximKo: string;
  humanistDimension: string;
  guidance: string;
}

export interface MontaigneEssaisWisdomResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  queSaisJeInquiryScore: number;          // "내가 무엇을 아는가?" 도그마 탈피 개방적 회의 지수
  selfIntrospectionHonestyScore: number;  // 자기관찰과 솔직한 내면 성찰 정직도
  naturalModerationScore: number;         // 자연스러움(Naturel)과 일상 중용(Modération) 조화도
  humanToleranceEmpathyScore: number;     // 타자의 다름을 긍정하는 관용(Tolérance) 지수
  equanimityMortalityScore: number;       // 삶의 유한성을 자연의 섭리로 수용하는 평정심
  // 세부 체계
  activeThematicEssay: MontaigneThematicEssay;
  focalHumanistMaxim: MontaigneHumanistMaxim;
  montaignePersonalCounsel: {
    counselTitle: string;
    humanisticGuidance: string;
  };
}

export type MontaigneEssaisWisdomReport = MontaigneEssaisWisdomResult;

const THEMATIC_ESSAYS: MontaigneThematicEssay[] = [
  {
    essayKey: 'QueSaisJeInquiry',
    essayTitleFrench: 'Apologie de Raimond Sebond (Que sais-je?)',
    essayTitleKo: '레몽 스봉에 대한 변호 ("내가 무엇을 아는가?")',
    corePhilosophicalIdea: '인간의 오만한 독단과 섣부른 확신을 경계하고, 끊임없이 질문하며 유연하게 생각을 갱신하는 지적 겸손입니다.',
    practicalReflection: '자신의 의견만이 유일한 진리라는 고집을 내려놓으십시오. "내가 무엇을 아는가?"라는 겸허한 물음이 더 넓은 세상의 가능성을 열어줍니다.',
  },
  {
    essayKey: 'DesCannibalesTolerance',
    essayTitleFrench: 'Des Cannibales (De la tolérance)',
    essayTitleKo: '식인종에 대하여 (편견 없는 관용과 다름의 존중)',
    corePhilosophicalIdea: '자신에게 익숙하지 않다는 이유만으로 야만이라 낙인찍지 않고, 각자의 고유한 삶의 방식을 따뜻하게 인정하는 열린 시선입니다.',
    practicalReflection: '타인의 생소한 가치관이나 행동 방식을 섣불리 재단하지 마십시오. 다름 속에서 인간 본성의 풍요로움을 발견할 수 있습니다.',
  },
  {
    essayKey: 'DeLexperienceLiving',
    essayTitleFrench: 'De l’expérience (L’art de vivre)',
    essayTitleKo: '경험에 대하여 (일상의 온전한 음미와 삶의 기술)',
    corePhilosophicalIdea: '거창한 영웅적 과업보다 하루하루의 평범한 일상을 지혜롭고 충만하게 살아내는 것이야말로 가장 숭고한 인간의 걸작입니다.',
    practicalReflection: '내일의 불안이나 비현실적인 환상에 삶을 저당 잡히지 마십시오. 오늘 걷는 걸음, 마시는 차 한 잔의 평범한 행복을 온전히 누리십시오.',
  },
  {
    essayKey: 'DeLexercitationCourage',
    essayTitleFrench: 'De l’exercitation (Apprivoiser la mort)',
    essayTitleKo: '수련에 대하여 (유한성의 수용과 두려움 극복)',
    corePhilosophicalIdea: '죽음이나 실패를 괴물처럼 두려워할 것이 아니라, 밤이 오면 잠이 들듯 삶의 자연스러운 한 조각으로 부드럽게 받아들이는 초연함입니다.',
    practicalReflection: '통제할 수 없는 미지의 미래에 대해 지나치게 긴장하지 마십시오. 자연의 섭리를 믿고 유연하게 흐름에 몸을 맡길 때 진정한 자유가 찾아옵니다.',
  },
];

const HUMANIST_MAXIMS: MontaigneHumanistMaxim[] = [
  {
    maximKey: 'BeYourselfMasterpiece',
    maximKo: '인간의 가장 아름다운 걸작은 정당하게 사는 것이다',
    humanistDimension: '인격의 진실성과 소박함',
    guidance: '세상의 박수나 지위에 휘둘리지 않고, 스스로에게 부끄러움 없이 성실하게 하루를 채워가는 품격을 지키십시오.',
  },
  {
    maximKey: 'SoulFlexibleArmor',
    maximKo: '영혼은 부드러울 때 가장 단단한 갑옷이 된다',
    humanistDimension: '유연한 회복탄력성과 중용',
    guidance: '완벽주의의 딱딱한 강박을 누그러뜨리십시오. 바람에 부드럽게 휘어지는 갈대처럼 유연한 마음이 거센 비바람을 이겨냅니다.',
  },
  {
    maximKey: 'KnowYourOwnMeasure',
    maximKo: '자신의 분수를 아는 것이 지혜의 시작이다',
    humanistDimension: '자기 인식과 현실 감각',
    guidance: '자신의 역량과 한계를 솔직하게 인정할 때 비로소 낭비 없는 알찬 결실을 거둘 수 있습니다.',
  },
  {
    maximKey: 'FriendshipSoleSoul',
    maximKo: '우정이란 두 몸에 깃든 하나의 영혼이다',
    humanistDimension: '진정한 우정과 인간적 신뢰',
    guidance: '이해관계를 초월하여 속마음을 숨김없이 나눌 수 있는 참된 인연을 소중히 가꾸고 돌보십시오.',
  },
];

export function calculateMontaigneEssaisWisdom(profile: UserProfile): MontaigneEssaisWisdomResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'MontaigneEssaisWisdom';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const queSaisJeInquiryScore = 68 + (absHash % 31);
  const selfIntrospectionHonestyScore = 67 + ((absHash >> 3) % 32);
  const naturalModerationScore = 66 + ((absHash >> 6) % 33);
  const humanToleranceEmpathyScore = 65 + ((absHash >> 9) % 34);
  const equanimityMortalityScore = 64 + ((absHash >> 12) % 35);

  const essayIndex = (absHash >> 4) % THEMATIC_ESSAYS.length;
  const maximIndex = (absHash >> 7) % HUMANIST_MAXIMS.length;

  const activeThematicEssay = THEMATIC_ESSAYS[essayIndex];
  const focalHumanistMaxim = HUMANIST_MAXIMS[maximIndex];

  const counselTitle = `몽테뉴 수상록(Essais) 지혜: ${activeThematicEssay.essayTitleKo}`;
  const humanisticGuidance = `미셸 드 몽테뉴의 수상록은 독단적 편견을 내려놓고 솔직한 자기성찰과 자연스러운 삶의 조화를 누리도록 안내합니다. ` +
    `현재 당신의 삶에 필요한 사유는 '${activeThematicEssay.essayTitleKo}'의 통찰과 맞닿아 있습니다. ` +
    `${activeThematicEssay.practicalReflection} 또한 몽테뉴의 격언인 '${focalHumanistMaxim.maximKo}'(${focalHumanistMaxim.humanistDimension})을 기억하여, ` +
    `${focalHumanistMaxim.guidance}`;

  return {
    engineVersion: MONTAIGNE_ESSAIS_WISDOM_VERSION,
    calculatedAtKst: new Date().toISOString(),
    queSaisJeInquiryScore,
    selfIntrospectionHonestyScore,
    naturalModerationScore,
    humanToleranceEmpathyScore,
    equanimityMortalityScore,
    activeThematicEssay,
    focalHumanistMaxim,
    montaignePersonalCounsel: {
      counselTitle,
      humanisticGuidance,
    },
  };
}

export function formatMontaigneEssaisWisdomPrompt(res: MontaigneEssaisWisdomResult): string {
  return [
    `【몽테뉴 수상록(Essais) 회의주의·자기성찰 지표】`,
    `- "내가 무엇을 아는가?"(도그마 탈피 회의 지수): ${res.queSaisJeInquiryScore}/100`,
    `- 자기관찰 내면 성찰 정직도: ${res.selfIntrospectionHonestyScore}/100`,
    `- 자연스러움과 일상 중용 조화도: ${res.naturalModerationScore}/100`,
    `- 타자 존중 관용(Tolérance) 지수: ${res.humanToleranceEmpathyScore}/100`,
    `- 유한성 수용과 평정심: ${res.equanimityMortalityScore}/100`,
    `- 핵심 수상록 에세이: ${res.activeThematicEssay.essayTitleKo} [${res.activeThematicEssay.essayTitleFrench}]`,
    `- 인문주의 철학적 사유: ${res.activeThematicEssay.corePhilosophicalIdea}`,
    `- 실천적 성찰 조언: ${res.activeThematicEssay.practicalReflection}`,
    `- 몽테뉴 핵심 격언: "${res.focalHumanistMaxim.maximKo}" (${res.focalHumanistMaxim.humanistDimension})`,
    `- 성찰 지침: ${res.focalHumanistMaxim.guidance}`,
    `- 인문학적 삶의 예술 지침: ${res.montaignePersonalCounsel.humanisticGuidance}`,
  ].join('\n');
}
