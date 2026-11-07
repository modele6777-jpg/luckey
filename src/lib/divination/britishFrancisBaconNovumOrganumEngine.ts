/**
 * 영국 프랜시스 베이컨(Francis Bacon) 《신기관(Novum Organum)》
 * 4대 우상 타파 & 참된 귀납(Inductio Vera) 사실 검증 지성 엔진
 *
 * 근대 경험론의 아버지이자 과학 혁명의 선구자 프랜시스 베이컨(1561~1626)의 주저 《신기관(Novum Organum Scientiarum)》
 * 및 《학문의 진보(The Advancement of Learning)》 원전 기반:
 * 1. 종족의 우상(Idola Tribus) 극복: 인간의 본성적 한계나 희망 섞인 관측에서 비롯되는 주관적 왜곡과 편향을 걷어내는 객관성.
 * 2. 동굴의 우상(Idola Specus) 극복: 개인의 협소한 경험, 편협한 교육, 고정관념이라는 우물 안 개구리식 시야를 탈피하는 열린 개방성.
 * 3. 시장의 우상(Idola Fori) 극복: 언어의 모호성, 과장된 수사, 근거 없는 뜬소문과 억측에 휘둘리지 않고 본질을 명료히 분별하는 언어적 명징성.
 * 4. 극장의 우상(Idola Theatri) 극복: 과거의 낡은 권위, 검증되지 않은 전통 체계나 독단적 교조주의를 맹종하지 않는 비판적 성찰력.
 * 5. 참된 귀납과 실천적 힘(Inductio Vera & Scientia Potentia Est): "아는 것이 힘이다(Scientia potentia est)"라는 명제처럼, 면밀한 관찰과 사실 검증을 통해 실질적인 변화를 창출하는 실증적 실행력.
 *
 * @version LUCKEY-FRANCIS-BACON-NOVUM-ORGANUM-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const BRITISH_FRANCIS_BACON_VERSION = 'LUCKEY-FRANCIS-BACON-NOVUM-ORGANUM-v1.0.0';

export interface BaconTheme {
  themeKey: string;
  themeTitleLatin: string;
  themeTitleKo: string;
  epistemologicalInsight: string;
  practicalCounsel: string;
}

export interface BaconAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismLatin: string;
  novumOrganumRef: string;
  actionGuidance: string;
}

export interface FrancisBaconNovumOrganumResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 경험론·우상타파 지표 (0~100)
  idolsTribusSpeciesBiasOvercomingScore: number;     // 종족의 우상 타파 - 인간 중심적 편향·독단 극복도
  idolsSpecusPersonalPrejudiceOvercomingScore: number; // 동굴의 우상 타파 - 개인적 선입견·협소한 시야 탈피도
  idolsForiLinguisticClarityScore: number;          // 시장의 우상 타파 - 언어 왜곡·뜬소문 분별 명징성
  idolsTheatriAuthorityDogmaOvercomingScore: number; // 극장의 우상 타파 - 낡은 권위·독단주의 비판적 극복도
  trueInductionEmpiricalGroundedScore: number;       // 참된 귀납(Inductio Vera) 사실 검증력 & 지식의 실천력
  // 세부 분석
  activeBaconTheme: BaconTheme;
  focalBaconAphorism: BaconAphorism;
  baconComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const BACON_THEMES: BaconTheme[] = [
  {
    themeKey: 'idola_tribus',
    themeTitleLatin: 'Idola Tribus (Idols of the Tribe)',
    themeTitleKo: '종족의 우상 극복 (희망적 편향과 주관적 착각의 정화)',
    epistemologicalInsight: '인간 지성은 자신이 바라는 것을 진실로 믿어버리는 경향이 있습니다. 희망 섞인 관측을 걷어내고 차가운 사실을 직시해야 합니다.',
    practicalCounsel: '보고 싶은 것만 보려는 인지적 편향을 경계하십시오. 당신의 가설이나 기대에 어긋나는 객관적 지표와 반증 사례를 일부러라도 더 세밀히 수집하십시오.',
  },
  {
    themeKey: 'idola_specus',
    themeTitleLatin: 'Idola Specus (Idols of the Cave)',
    themeTitleKo: '동굴의 우상 극복 (개인적 선입견과 우물 안 시야 탈피)',
    epistemologicalInsight: '누구나 자신만의 성향, 과거의 좁은 성공 경험, 익숙한 습관이라는 동굴에 갇혀 세상을 굴절시켜 바라봅니다.',
    practicalCounsel: '과거에 통했던 방식만을 고집하지 마십시오. 동굴 밖으로 걸어 나와 전혀 다른 관점을 가진 사람들의 의견과 새로운 데이터를 겸허히 받아들이십시오.',
  },
  {
    themeKey: 'idola_fori',
    themeTitleLatin: 'Idola Fori (Idols of the Market)',
    themeTitleKo: '시장의 우상 극복 (언어의 왜곡과 소문·수사의 식별)',
    epistemologicalInsight: '사회적 담론과 교류 속에서 정교하지 못한 언어, 과장된 수사, 근거 없는 뜬소문이 지성을 마비시키고 끝없는 분쟁을 낳습니다.',
    practicalCounsel: '남들이 쓰는 거창한 유행어나 모호한 단어에 현혹되지 마십시오. 개념의 정의를 명확히 하고 구체적인 실체와 수치로 사실관계를 재확인하십시오.',
  },
  {
    themeKey: 'idola_theatri',
    themeTitleLatin: 'Idola Theatri (Idols of the Theatre)',
    themeTitleKo: '극장의 우상 극복 (전통적 권위와 도그마의 비판적 검증)',
    epistemologicalInsight: '철학 체계나 권위 있는 인물의 주장은 무대 위에서 연출된 연극처럼 그럴듯하지만, 현실 검증 없는 도그마에 불과할 수 있습니다.',
    practicalCounsel: '단지 유명한 사람이나 권위자가 말했다는 이유만으로 맹신하지 마십시오. 현실 환경에서 직접 작동하고 입증되는지를 스스로 검증하십시오.',
  },
  {
    themeKey: 'inductio_vera',
    themeTitleLatin: 'Inductio Vera & Scientia Potentia Est',
    themeTitleKo: '참된 귀납과 실행력 (사실에 기반한 실증적 힘)',
    epistemologicalInsight: '자연과 현실은 복종함으로써만 지배할 수 있습니다. 사실에 바탕을 둔 진정한 앎만이 세상을 변화시키는 실질적 힘이 됩니다.',
    practicalCounsel: '탁상공론을 끝내고 현장의 작은 사실과 사례들을 꼼꼼히 축적하십시오. 실증적 검증을 거친 견고한 지식을 토대로 결단할 때 막강한 추진력이 생깁니다.',
  },
];

export const BACON_APHORISMS: BaconAphorism[] = [
  {
    aphorismKey: 'scientia_potentia',
    aphorismKo: '아는 것이 힘이다. 원인을 알지 못하고서는 결코 결과를 얻을 수 없다.',
    aphorismLatin: 'Scientia et potentia humana in idem coincidunt, quia ignoratio causae destituit effectum.',
    novumOrganumRef: '《신기관》 제1권 잠언 3',
    actionGuidance: '문제의 겉모습만 건드리지 말고, 근본 원인을 철저히 규명하여 본질적인 통제력을 확보하십시오.',
  },
  {
    aphorismKey: 'natura_parendo_vincitur',
    aphorismKo: '자연은 오직 그것에 복종함으로써만 지배될 수 있다.',
    aphorismLatin: 'Natura non nisi parendo vincitur.',
    novumOrganumRef: '《신기관》 제1권 잠언 3, 129',
    actionGuidance: '상황의 객관적 법칙과 순리를 거스르려 하지 말고, 현실의 메커니즘을 겸허히 파악하여 당신의 무기로 삼으십시오.',
  },
  {
    aphorismKey: 'apis_exemplum',
    aphorismKo: '개미처럼 모으기만 하거나 거미처럼 자기 속에서 잣지 말고, 꿀벌처럼 모아서 스스로 소화하고 변화시켜라.',
    aphorismLatin: 'Apes media sequuntur viam: quae materiam ex floribus colligunt, sed propria virtute digerunt et vertunt.',
    novumOrganumRef: '《신기관》 제1권 잠언 95',
    actionGuidance: '맹목적인 자료 수집(개미)이나 독선적인 뇌피셜(거미)을 피하고, 사실들을 정밀하게 종합해 실용적인 통찰(꿀벌)을 창조하십시오.',
  },
  {
    aphorismKey: 'intellectus_non_sibi_permittendus',
    aphorismKo: '인간의 지성을 제멋대로 내버려 두어서는 안 되며, 언제나 규칙과 검증이라는 날개와 추를 달아주어야 한다.',
    aphorismLatin: 'Intellectui non permittendum ut saltet, sed potius addenda plumba et pondera.',
    novumOrganumRef: '《신기관》 제1권 잠언 104',
    actionGuidance: '성급한 비약이나 감정적 비약을 삼가고, 단계별 검증과 체크리스트라는 무게추를 두어 실수를 철저히 예방하십시오.',
  },
  {
    aphorismKey: 'lucifera_ante_fructifera',
    aphorismKo: '열매를 맺는 실험(Fructifera)보다 먼저 빛을 비추는 실험(Lucifera)을 행하라.',
    aphorismLatin: 'Experimenta lucifera ante fructifera quaerenda sunt.',
    novumOrganumRef: '《신기관》 제1권 잠언 99',
    actionGuidance: '당장의 이익이나 작은 결실에 조급해하기보다, 상황의 본질적 인과관계와 구조를 명확히 밝히는 탐색을 선행하십시오.',
  },
];

export function calculateFrancisBaconNovumOrganum(
  profile: UserProfile
): FrancisBaconNovumOrganumResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `FRANCIS-BACON-ORGANUM:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const idolsTribusSpeciesBiasOvercomingScore = 69 + (absHash % 30);
  const idolsSpecusPersonalPrejudiceOvercomingScore = 68 + ((absHash >> 3) % 31);
  const idolsForiLinguisticClarityScore = 71 + ((absHash >> 6) % 28);
  const idolsTheatriAuthorityDogmaOvercomingScore = 70 + ((absHash >> 9) % 29);
  const trueInductionEmpiricalGroundedScore = 67 + ((absHash >> 12) % 32);

  const themeIndex = (absHash >> 4) % BACON_THEMES.length;
  const aphorismIndex = (absHash >> 7) % BACON_APHORISMS.length;

  const activeBaconTheme = BACON_THEMES[themeIndex];
  const focalBaconAphorism = BACON_APHORISMS[aphorismIndex];

  const guidanceTitle = `프랜시스 베이컨 신기관 지성 지혜: ${activeBaconTheme.themeTitleKo}`;
  const philosophicalCounsel = `프랜시스 베이컨의 경험론 철학은 마음을 흐리는 4대 우상을 깨부수고 차가운 사실에 입각한 실천적 힘을 세우도록 이끕니다. ` +
    `현재 당신이 가장 주의 깊게 점검해야 할 지점은 '${activeBaconTheme.themeTitleKo}'입니다. ` +
    `${activeBaconTheme.practicalCounsel} 아울러 베이컨의 명언 "${focalBaconAphorism.aphorismKo}"(${focalBaconAphorism.aphorismLatin})을 상기하며, ` +
    `${focalBaconAphorism.actionGuidance}`;

  return {
    engineVersion: BRITISH_FRANCIS_BACON_VERSION,
    calculatedAtKst: new Date().toISOString(),
    idolsTribusSpeciesBiasOvercomingScore,
    idolsSpecusPersonalPrejudiceOvercomingScore,
    idolsForiLinguisticClarityScore,
    idolsTheatriAuthorityDogmaOvercomingScore,
    trueInductionEmpiricalGroundedScore,
    activeBaconTheme,
    focalBaconAphorism,
    baconComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrancisBaconNovumOrganumPrompt(res: FrancisBaconNovumOrganumResult): string {
  return [
    `【프랜시스 베이컨 《신기관》 4대 우상 타파 & 실증 경험 지표】`,
    `- 종족의 우상 극복도(Idola Tribus - 인간 중심 편향 탈피): ${res.idolsTribusSpeciesBiasOvercomingScore}/100`,
    `- 동굴의 우상 극복도(Idola Specus - 개인적 선입견 탈피): ${res.idolsSpecusPersonalPrejudiceOvercomingScore}/100`,
    `- 시장의 우상 극복도(Idola Fori - 언어 왜곡·소문 식별): ${res.idolsForiLinguisticClarityScore}/100`,
    `- 극장의 우상 극복도(Idola Theatri - 권위·도그마 비판력): ${res.idolsTheatriAuthorityDogmaOvercomingScore}/100`,
    `- 참된 귀납 사실 검증력(Inductio Vera & Scientia Potentia): ${res.trueInductionEmpiricalGroundedScore}/100`,
    `- 핵심 우상 타파 테마: ${res.activeBaconTheme.themeTitleKo} [${res.activeBaconTheme.themeTitleLatin}]`,
    `- 인식론적 통찰: ${res.activeBaconTheme.epistemologicalInsight}`,
    `- 실천적 조언: ${res.activeBaconTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalBaconAphorism.aphorismKo}"`,
    `- 라틴어 원문: "${res.focalBaconAphorism.aphorismLatin}" [${res.focalBaconAphorism.novumOrganumRef}]`,
    `- 구체적 실천 지침: ${res.focalBaconAphorism.actionGuidance}`,
    `- 종합 통찰 권면: ${res.baconComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
