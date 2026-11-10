/**
 * 대한민국 백사 이항복(白沙 李恒福) & 한음 이덕형(漢陰 李德馨) 《오성과 한음(鰲城과 漢陰)》 지기지우 & 경세제민 지혜 엔진
 *
 * 조선 중기 임진왜란의 미증유 국난 속에서 영의정과 좌의정으로 사직과 백성을 지탱한 두 명재상,
 * 백사 이항복(1556~1618)과 한음 이덕형(1561~1613)의 《백사집(白沙集)》, 《한음집(漢陰集)》, 오성과 한음 야사 및 선비정신 원전 기반:
 * 1. 지기지우(知己之友) 평생의 상호 신뢰 및 도의적 우정 지수(Lifelong Moral Friendship & Mutual Trust Index): 평생을 서로 북돋우며 대의를 함께한 동반자적 신의.
 * 2. 국난 극복 경세제민 및 위기 대응 경륜(Crisis Governance & Practical Statesmanship Score): 전란의 참화 속에서 외교와 군량, 민심을 수습한 실전적 경륜.
 * 3. 해학·위트 및 활달한 배포 회복탄력성(Humor, Wit & Magnanimous Resilience Index): 절체절명의 위기 앞에서도 잃지 않은 유쾌한 여유와 기지.
 * 4. 당쟁 초월 공명정대 및 청백리 공심 지표(Anti-Factional Impartiality & Integrity Score): 붕당의 사리사욕을 떠나 오직 나라와 백성을 우선한 공정성.
 * 5. 불굴의 의리 및 의연한 선비 품격도(Unyielding Fidelity & Dignified Grace Index): 폐모론에 맞선 직언과 북청 유배길에서도 품격을 지킨 불굴의 기개.
 *
 * @version LUCKEY-OHSEONG-HANEUM-FRIENDSHIP-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_OHSEONG_HANEUM_VERSION = 'LUCKEY-OHSEONG-HANEUM-FRIENDSHIP-v1.0.0';

export interface OhseongHaneumTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface OhseongHaneumAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanOhseongHaneumFriendshipGovernanceResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 오성과 한음 지혜 지표 (0~100)
  lifelongMoralFriendshipTrustIndex: number;    // 지기지우 평생 상호 신뢰 및 도의적 우정 지수 (Friendship & Mutual Trust)
  crisisGovernanceStatesmanshipScore: number;   // 국난 극복 경세제민 및 위기 대응 경륜 (Crisis Governance & Statesmanship)
  humorWitMagnanimityResilienceIndex: number;   // 해학·위트 및 활달한 배포 회복탄력성 (Humor, Wit & Magnanimous Resilience)
  antiFactionalImpartialityScore: number;       // 당쟁 초월 공명정대 및 청백리 공심 지표 (Anti-Factional Impartiality)
  unyieldingFidelityGraceIndex: number;         // 불굴의 의리 및 의연한 선비 품격도 (Unyielding Fidelity & Grace)
  // 세부 분석
  activeOhseongHaneumTheme: OhseongHaneumTheme;
  focalOhseongHaneumAphorism: OhseongHaneumAphorism;
  ohseongHaneumComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const OHSEONG_HANEUM_THEMES: OhseongHaneumTheme[] = [
  {
    themeKey: 'jigijiuMoralFriendship',
    themeTitleEn: 'Lifelong Moral Friendship & Unwavering Trust',
    themeTitleKo: '지기지우(知己之友)의 도의적 신의 — 평생을 함께하는 영혼의 동반자',
    pragmaticInsight: '진정한 벗은 이익으로 맺어지지 않고 도의와 신의로 맺어집니다. 오성과 한음처럼 서로의 장점을 알아보고 단점을 감싸며 대의를 함께할 때, 어떤 풍파도 뚫고 나아갈 수 있습니다.',
    practicalCounsel: '혼자서 모든 짐을 짊어지려 하지 마십시오. 서로를 온전히 믿고 기댈 수 있는 진실한 동반자와 마음을 터놓고 협력할 때, 두 사람의 합은 천하를 움직이는 힘이 됩니다.',
  },
  {
    themeKey: 'crisisStatesmanshipGovernance',
    themeTitleEn: 'Crisis Governance & Practical Statesmanship',
    themeTitleKo: '국난 앞의 경세제민 — 전란의 화염 속에서 사직과 백성을 살린 경륜',
    pragmaticInsight: '탁상공론은 위기 앞에서 무력합니다. 한음의 명나라 외교와 백사의 군무 총괄처럼, 위기 상황에서는 명분보다 실질적인 해결책과 백성의 삶을 구하는 구체적 실천이 최우선입니다.',
    practicalCounsel: '명분이나 형식에 얽매이지 말고 사태를 냉철하게 직시하십시오. 자원을 신속히 확보하고 막힌 혈을 뚫어내는 실전적 실행력으로 위기를 반전의 발판으로 바꾸십시오.',
  },
  {
    themeKey: 'humorousWitMagnanimity',
    themeTitleEn: 'Humor, Wit & Magnanimous Resilience',
    themeTitleKo: '해학과 활달한 배포 — 궁지에서도 잃지 않는 여유와 기지',
    pragmaticInsight: '어린 시절 감나무 일화부터 전시의 담소까지, 오성과 한음의 위트는 단순한 장난이 아닌 절체절명의 긴장을 녹이고 사람들의 마음을 하나로 묶는 고도의 지혜였습니다.',
    practicalCounsel: '상황이 엄중할수록 얼굴을 찌푸리지 말고 호방한 여유와 유쾌한 위트를 발휘하십시오. 마음의 긴장을 푸는 유머 한마디가 막혔던 대화를 열고 뜻밖의 돌파구를 열어줍니다.',
  },
  {
    themeKey: 'antiFactionalImpartiality',
    themeTitleEn: 'Anti-Factional Impartiality & Statesman Integrity',
    themeTitleKo: '당쟁을 초월한 공명정대 — 사리사욕을 버리고 오직 공심을 세우는 기개',
    pragmaticInsight: '편 가르기와 파벌 싸움은 조직과 공동체를 안으로부터 무너뜨립니다. 백사와 한음은 소론·남인의 분열 속에서도 오직 국익과 인재의 됨됨이만을 보아 공평무사하게 천거했습니다.',
    practicalCounsel: '사적인 친소 관계나 파벌 논리에 휘둘리지 마십시오. 오직 객관적인 사실과 전체의 이익을 중심에 두고 공정하게 사람과 일을 대할 때 누구도 흔들 수 없는 권위와 신망을 얻습니다.',
  },
  {
    themeKey: 'unyieldingFidelityGrace',
    themeTitleEn: 'Unyielding Fidelity & Dignified Grace in Adversity',
    themeTitleKo: '불굴의 의리와 의연한 품격 — 유배와 시련 속에서도 꺾이지 않는 절조',
    pragmaticInsight: '백사 이항복은 광해군 때 인목대비 폐모론에 홀로 목숨을 걸고 반대 상소를 올린 뒤 북청 유배길에서 생을 마감했습니다. 불의 앞에 타협하지 않는 품격이 역사의 영원한 사표가 됩니다.',
    practicalCounsel: '부당한 압박이나 일시적인 고난 앞에 비겁하게 굴복하지 마십시오. 당신의 양심과 도의가 가리키는 바른 길을 당당히 걸어갈 때, 시련은 오히려 당신의 기품을 더욱 빛나게 합니다.',
  },
];

export const OHSEONG_HANEUM_APHORISMS: OhseongHaneumAphorism[] = [
  {
    aphorismKey: 'heartKnowsFriendAphorism',
    aphorismKo: '서로를 알아주는 참된 벗은 말하지 않아도 마음이 통하고, 국가의 위태로움 앞에서는 한마음으로 뭉친다.',
    aphorismEn: 'True companions who know each other share one mind without words, standing united as one in times of peril.',
    sourceContext: '《백사집(白沙集)》 & 《한음집(漢陰集)》 지우교록',
    actionGuidance: '동료를 온전히 신뢰하고 속마음을 나누며, 공동의 목표를 향해 손을 맞잡고 거침없이 전진하십시오.',
  },
  {
    aphorismKey: 'crisisPreserveNationAphorism',
    aphorismKo: '전란의 화염 속에서도 사직과 백성을 지탱하는 것은 끝없는 정성과 사리사욕 없는 공심(公心)뿐이다.',
    aphorismEn: 'Amidst the flames of crisis, what sustains the state and people is ceaseless devotion and selfless public-mindedness.',
    sourceContext: '임진란 전시 호종록 및 경세 장계',
    actionGuidance: '사사로운 계산을 내려놓고 공동체의 안위를 최우선에 두며, 묵묵하고 헌신적인 정성을 다하십시오.',
  },
  {
    aphorismKey: 'smileThroughTroubleAphorism',
    aphorismKo: '칼날 같은 역경 앞에서도 웃음을 잃지 않는 호방한 기개가 얽힌 실타래를 푸는 최고의 지혜이다.',
    aphorismEn: 'A magnanimous spirit that retains warmth and wit before sharp adversity is the supreme wisdom that unravels tangled knots.',
    sourceContext: '오성과 한음 일화록 〈감나무와 백사·한음의 기지〉',
    actionGuidance: '어두운 그늘을 털어내고 대범한 호연지기와 유쾌한 재치로 분위기를 쇄신하며 해법을 찾으십시오.',
  },
  {
    aphorismKey: 'dutyOverFactionAphorism',
    aphorismKo: '조정의 의론은 오직 사직과 백성을 위해 바르게 서야지, 붕당의 사리사욕에 좌우되어서는 안 된다.',
    aphorismEn: 'Deliberations of state must stand upright solely for the realm and its people, never swayed by partisan self-interest.',
    sourceContext: '이덕형의 국시 구언 상소문',
    actionGuidance: '편파적인 이익이나 소모적인 파벌 갈등에 가담하지 말고, 원칙과 상식에 입각한 공정함을 견지하십시오.',
  },
  {
    aphorismKey: 'ironWillInExileAphorism',
    aphorismKo: '북청의 찬 바람이 뼛속을 파고들어도 바른 도리를 향한 충절의 불꽃은 결코 꺼지지 않는다.',
    aphorismEn: 'Though the bitter winds of exile pierce to the marrow, the flame of righteous fidelity never wavers.',
    sourceContext: '이항복 북청 유배 시조 〈철령 높은 봉에 쉬어 넘는 저 구름아〉',
    actionGuidance: '상황이 불리하거나 고립되더라도 대의에 대한 신념을 잃지 말고, 의연하고 당당한 품격을 지키십시오.',
  },
];

export function calculateKoreanOhseongHaneumFriendshipGovernance(
  profile?: UserProfile,
  query?: string,
): KoreanOhseongHaneumFriendshipGovernanceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `OHSEONG-HANEUM-FRIENDSHIP:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const lifelongMoralFriendshipTrustIndex = 83 + (absHash % 16);
  const crisisGovernanceStatesmanshipScore = 82 + ((absHash >> 3) % 17);
  const humorWitMagnanimityResilienceIndex = 81 + ((absHash >> 6) % 18);
  const antiFactionalImpartialityScore = 80 + ((absHash >> 9) % 19);
  const unyieldingFidelityGraceIndex = 84 + ((absHash >> 12) % 15);

  const themeIndex = (absHash >> 5) % OHSEONG_HANEUM_THEMES.length;
  const aphorismIndex = (absHash >> 8) % OHSEONG_HANEUM_APHORISMS.length;

  const activeOhseongHaneumTheme = OHSEONG_HANEUM_THEMES[themeIndex];
  const focalOhseongHaneumAphorism = OHSEONG_HANEUM_APHORISMS[aphorismIndex];

  const guidanceTitle = `오성과 한음 지혜: ${activeOhseongHaneumTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 중기 국난 극복의 두 명재상 백사 이항복과 한음 이덕형은 평생의 도의적 신의(知己之友), 위기 앞의 실전적 경세제민, 그리고 해학과 활달한 배포를 가르칩니다. ` +
    `현재 당신의 상황에서 가장 필요한 핵심 덕목은 '${activeOhseongHaneumTheme.themeTitleKo}'입니다. ` +
    `${activeOhseongHaneumTheme.practicalCounsel} 오성과 한음의 교훈 "${focalOhseongHaneumAphorism.aphorismKo}"를 되새기며, ` +
    `${focalOhseongHaneumAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_OHSEONG_HANEUM_VERSION,
    calculatedAtKst: new Date().toISOString(),
    lifelongMoralFriendshipTrustIndex,
    crisisGovernanceStatesmanshipScore,
    humorWitMagnanimityResilienceIndex,
    antiFactionalImpartialityScore,
    unyieldingFidelityGraceIndex,
    activeOhseongHaneumTheme,
    focalOhseongHaneumAphorism,
    ohseongHaneumComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanOhseongHaneumFriendshipGovernancePrompt(
  res: KoreanOhseongHaneumFriendshipGovernanceResult,
): string {
  return [
    `【오성과 한음(이항복·이덕형) 지기지우 & 경세제민 지혜 지표】`,
    `- 지기지우 상호 신뢰 및 도의적 우정 지수(Lifelong Moral Friendship): ${res.lifelongMoralFriendshipTrustIndex}/100`,
    `- 국난 극복 경세제민 및 위기 대응 경륜(Crisis Governance & Statesmanship): ${res.crisisGovernanceStatesmanshipScore}/100`,
    `- 해학·위트 및 활달한 배포 회복탄력성(Humor & Magnanimous Resilience): ${res.humorWitMagnanimityResilienceIndex}/100`,
    `- 당쟁 초월 공명정대 및 청백리 공심 지표(Anti-Factional Impartiality): ${res.antiFactionalImpartialityScore}/100`,
    `- 불굴의 의리 및 의연한 선비 품격도(Unyielding Fidelity & Grace): ${res.unyieldingFidelityGraceIndex}/100`,
    `- 핵심 오성과 한음 테마: ${res.activeOhseongHaneumTheme.themeTitleKo} [${res.activeOhseongHaneumTheme.themeTitleEn}]`,
    `- 실용주의적 통찰: ${res.activeOhseongHaneumTheme.pragmaticInsight}`,
    `- 실천적 조언: ${res.activeOhseongHaneumTheme.practicalCounsel}`,
    `- 오성과 한음 원전 명언: "${res.focalOhseongHaneumAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalOhseongHaneumAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalOhseongHaneumAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalOhseongHaneumAphorism.actionGuidance}`,
    `- 종합 오성과 한음 경세 권면: ${res.ohseongHaneumComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
