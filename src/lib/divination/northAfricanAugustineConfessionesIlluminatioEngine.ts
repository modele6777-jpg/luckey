/**
 * 북아프리카 아우렐리우스 아우구스티누스(Aurelius Augustinus) 《고백록(Confessiones)》 & 《신국론(De Civitate Dei)》
 * 시간의 3가지 현존(기억·직관·기대) & 진리의 내적 조명(Illuminatio)과 은총·안식 평정심 엔진
 *
 * 서양 교부철학 및 기독교 사상의 최고봉 성 아우구스티누스(354~430)의 대표작 《고백록(Confessiones)》,
 * 《신국론(De Civitate Dei)》, 《삼위일체론(De Trinitate)》 원전 기반:
 * 1. 시간의 수수께끼와 영혼의 3중 현존(Distentio Animi): 과거의 현존인 기억(Memoria), 현재의 현존인 직관 및 주의집중(Contuitus / Attentio), 미래의 현존인 기대(Expectatio)의 내적 조화.
 * 2. 진리의 내적 조명(Illuminatio Divina): 진리는 외적인 감각 세계가 아닌 영혼의 가장 깊은 내면(Interior intimo meo)에서 비추는 영원한 빛을 통해 발견된다는 내적 성찰.
 * 3. 은총(Gratia)과 자유의지(Liberum Arbitrium): 헛된 교만(Superbia)을 내려놓고 참된 겸손(Humilitas)으로 선을 지향할 때 회복되는 진정한 내적 자유.
 * 4. 마음의 안식(Inquietum est cor nostrum, donec requiescat in te): 세상의 유한한 유혹과 불안을 넘어 궁극적 평화에 안식하는 심령의 평정심.
 * 5. 두 가지 사랑의 분별(Amor Sui vs Amor Dei): 자기 파멸적 자기애(Amor sui)를 넘어 타인과 초월을 향한 참된 사랑(Caritas)의 실천.
 *
 * @version LUCKEY-AUGUSTINE-CONFESSIONES-ILLUMINATIO-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const NORTH_AFRICAN_AUGUSTINE_VERSION = 'LUCKEY-AUGUSTINE-CONFESSIONES-ILLUMINATIO-v1.0.0';

export interface AugustineTheme {
  themeKey: string;
  themeTitleLatin: string;
  themeTitleKo: string;
  theologicalInsight: string;
  spiritualCounsel: string;
}

export interface AugustineAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismLatin: string;
  scripturalContext: string;
  practicalAction: string;
}

export interface AugustineConfessionesIlluminatioResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 교부철학 지표 (0~100)
  interiorIlluminationInsightScore: number;    // 내적 조명(Illuminatio) 영적 직관도
  temporalPresenceHarmonizationScore: number;  // 시간의 3중 현존(기억·직관·기대) 균형도
  graceOvercomingPrideScore: number;           // 은총(Gratia) 수용 및 교만 극복 겸손도
  restfulPeaceOfHeartScore: number;            // 불안 극복 및 심령의 안식(Requies) 평정심 지수
  transcendentLoveOrientationScore: number;    // 자기 집착 초월 참된 사랑(Caritas) 지향도
  // 세부 체계
  activeAugustineTheme: AugustineTheme;
  focalAugustineAphorism: AugustineAphorism;
  augustinePersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export const AUGUSTINE_THEMES: AugustineTheme[] = [
  {
    themeKey: 'interior_illuminatio',
    themeTitleLatin: 'Interior Intimo Meo & Lux Aeterna',
    themeTitleKo: '내면의 가장 깊은 곳 & 영원한 진리의 내적 조명',
    theologicalInsight: '진리는 밖으로 뛰쳐나가 찾아 헤매는 것이 아니라, 내면 깊은 곳으로 돌아갈 때 비추어지는 영원한 빛에서 발견됩니다.',
    spiritualCounsel: '외부의 소음과 자극에서 물러나 마음의 방으로 들어가십시오. 당신 안에서 이미 길을 비추고 있는 지혜의 조명에 귀를 기울일 때 혼란이 걷힙니다.',
  },
  {
    themeKey: 'distentio_animi',
    themeTitleLatin: 'Distentio Animi & Praesens de Praesentibus',
    themeTitleKo: '영혼의 시간 조망: 기억의 치유와 현재의 집중',
    theologicalInsight: '과거는 기억으로, 미래는 기대로 모두 현재의 영혼 안에 머뭅니다. 시간에 휘둘리지 않고 현재의 주의집중(Attentio)에 닻을 내리는 것이 핵심입니다.',
    spiritualCounsel: '지나간 일에 대한 회한(기억)과 아직 오지 않은 일에 대한 염려(기대)로 마음을 분산시키지 마십시오. 오직 지금 마주한 순수한 현재에 온마음을 모으십시오.',
  },
  {
    themeKey: 'gratia_humilitas',
    themeTitleLatin: 'Gratia Divina & Humilitas Cordis',
    themeTitleKo: '은총의 수용 & 교만을 이기는 겸손의 힘',
    theologicalInsight: '인간의 고통은 모든 것을 자기 힘으로 통제하려는 교만(Superbia)에서 싹틉니다. 한계를 인정하는 겸손이야말로 더 큰 지혜를 담는 그릇입니다.',
    spiritualCounsel: '모든 짐을 홀로 짊어지려 하지 마십시오. 나의 나약함을 솔직하게 인정하고 주어지는 도움과 은총을 받아들일 때 참된 자유와 해방이 찾아옵니다.',
  },
  {
    themeKey: 'inquietum_cor_requies',
    themeTitleLatin: 'Inquietum Cor & Requies Aeterna',
    themeTitleKo: '불안한 마음의 안식 & 궁극적 평정심',
    theologicalInsight: '영원하지 않은 덧없는 물질과 평판에 마음을 둘 때 영혼은 끊임없이 불안하지만, 불변의 가치에 닻을 내릴 때 참된 쉼을 얻습니다.',
    spiritualCounsel: '순간의 이익이나 타인의 인정에 목매지 마십시오. 당신 영혼이 본래 닿고자 하는 깊은 고요와 본질적 가치에 머물 때 불안은 눈 녹듯 사라집니다.',
  },
  {
    themeKey: 'ordo_amoris',
    themeTitleLatin: 'Ordo Amoris & Civitas Dei',
    themeTitleKo: '사랑의 질서(Ordo Amoris) & 올바른 가치 지향',
    theologicalInsight: '덕이란 사랑해야 할 대상을 그 본래 가치에 맞게 올바른 순서로 사랑하는 사랑의 질서(Ordo Amoris)를 바로 세우는 것입니다.',
    spiritualCounsel: '가장 소중한 본질을 첫자리에 두고 수단에 불과한 것들을 도구의 자리에 두십시오. 사랑과 관심의 우선순위가 정돈될 때 삶 전체가 평화를 찾습니다.',
  },
];

export const AUGUSTINE_APHORISMS: AugustineAphorism[] = [
  {
    aphorismKey: 'inquietum_est_cor',
    aphorismKo: '당신 품에 안식하기까지 우리의 마음은 결코 평안을 누릴 수 없나이다.',
    aphorismLatin: 'Inquietum est cor nostrum, donec requiescat in te.',
    scripturalContext: '《고백록》 제1권 제1장: 인간 실존의 본질적 갈망과 궁극적 평화의 원천 선언',
    practicalAction: '세속의 번잡한 욕망과 조급증을 내려놓고, 영혼 깊은 곳의 고요한 침묵 속에 머무르며 안식을 취하십시오.',
  },
  {
    aphorismKey: 'interior_intimo_meo',
    aphorismKo: '당신은 내 내면의 가장 깊은 곳보다 더 깊이 계셨고, 나의 가장 높은 곳보다 더 높이 계셨나이다.',
    aphorismLatin: 'Tu autem eras interior intimo meo et superior summo meo.',
    scripturalContext: '《고백록》 제3권 제6장: 내면의 초월성과 참된 자아 탐구의 지평',
    practicalAction: '바깥세상에서 정답을 찾으려 헤매지 말고, 내면의 가장 솔직하고 투명한 양심의 소리에 귀 기울이십시오.',
  },
  {
    aphorismKey: 'noli_foras_ire',
    aphorismKo: '밖으로 나가지 말라, 그대 자신 안으로 돌아가라. 인간의 내면에 진리가 거한다.',
    aphorismLatin: 'Noli foras ire, in te ipsum redi; in interiore homine habitat veritas.',
    scripturalContext: '《참된 종교론(De Vera Religione)》: 내적 성찰을 통한 진리 발견의 핵심 공리',
    practicalAction: '수많은 시선과 외부 평가로부터 한 발 물러서서 내적 중심을 회복하고 당신만의 영적 주체성을 굳건히 하십시오.',
  },
  {
    aphorismKey: 'dilige_et_quod_vis_fac',
    aphorismKo: '사랑하라, 그리고 그대가 원하는 바를 행하라.',
    aphorismLatin: 'Dilige et quod vis fac.',
    scripturalContext: '《요한서간 강해》: 순수한 사랑이 모든 올바른 행동의 순수한 뿌리임을 천명',
    practicalAction: '사리사욕이나 계산을 버리고 진정한 공감과 선의의 사랑으로 동기를 채운 뒤, 확신을 품고 담대하게 실천하십시오.',
  },
  {
    aphorismKey: 'credo_ut_intelligam',
    aphorismKo: '알기 위하여 믿고, 믿기 위하여 알라.',
    aphorismLatin: 'Crede ut intelligas, intellige ut credas.',
    scripturalContext: '《설교집》 제43편: 지성과 신뢰, 믿음과 이성의 유기적 결합과 순환적 성숙',
    practicalAction: '편협한 의심에 갇히지 말고 선한 신뢰의 첫걸음을 먼저 내디딘 뒤, 지혜로운 통찰로 한 걸음씩 검증해 나가십시오.',
  },
  {
    aphorismKey: 'pondus_meum_amor_meus',
    aphorismKo: '나의 사랑이 곧 나의 무게이니, 어디로 가든 사랑이 나를 이끄나이다.',
    aphorismLatin: 'Amor meus pondus meum; illo feror, quocumque feror.',
    scripturalContext: '《고백록》 제13권 제9장: 영혼을 움직이고 방향을 결정짓는 사랑의 중력 법칙',
    practicalAction: '당신이 진정으로 마음을 쏟고 있는 대상이 무엇인지 정직하게 살피고, 마음의 지향점을 숭고한 가치로 옮기십시오.',
  },
];

export function calculateAugustineConfessionesIlluminatio(
  profile: UserProfile
): AugustineConfessionesIlluminatioResult {
  const name = profile.name || '방문자';
  const birthDate = profile.birthDate || '1990-01-01';
  const birthTime = profile.birthTime || '12:00';
  const gender = profile.gender || 'neutral';

  const seedString = `AUGUSTINE-CONFESSIONES:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const interiorIlluminationInsightScore = 68 + (absHash % 31);
  const temporalPresenceHarmonizationScore = 69 + ((absHash >> 3) % 30);
  const graceOvercomingPrideScore = 67 + ((absHash >> 6) % 32);
  const restfulPeaceOfHeartScore = 70 + ((absHash >> 9) % 29);
  const transcendentLoveOrientationScore = 66 + ((absHash >> 12) % 33);

  const themeIndex = (absHash >> 4) % AUGUSTINE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % AUGUSTINE_APHORISMS.length;

  const activeAugustineTheme = AUGUSTINE_THEMES[themeIndex];
  const focalAugustineAphorism = AUGUSTINE_APHORISMS[aphorismIndex];

  const counselTitle = `아우구스티누스 고백록 영성 지혜: ${activeAugustineTheme.themeTitleKo}`;
  const philosophicalGuidance = `성 아우구스티누스의 고백록 철학은 외부의 헛된 방황을 끝내고 영혼 깊은 내면의 빛과 마주하도록 이끕니다. ` +
    `현재 당신의 삶에서 가장 절실한 성찰은 '${activeAugustineTheme.themeTitleKo}'에 맞닿아 있습니다. ` +
    `${activeAugustineTheme.spiritualCounsel} 아울러 아우구스티누스의 경구인 "${focalAugustineAphorism.aphorismKo}"(${focalAugustineAphorism.aphorismLatin})을 기억하며, ` +
    `${focalAugustineAphorism.practicalAction}`;

  return {
    engineVersion: NORTH_AFRICAN_AUGUSTINE_VERSION,
    calculatedAtKst: new Date().toISOString(),
    interiorIlluminationInsightScore,
    temporalPresenceHarmonizationScore,
    graceOvercomingPrideScore,
    restfulPeaceOfHeartScore,
    transcendentLoveOrientationScore,
    activeAugustineTheme,
    focalAugustineAphorism,
    augustinePersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatAugustineConfessionesIlluminatioPrompt(res: AugustineConfessionesIlluminatioResult): string {
  return [
    `【아우구스티누스 《고백록》 내적 조명 & 안식 평정심 지표】`,
    `- 내적 조명 영적 직관도(Illuminatio): ${res.interiorIlluminationInsightScore}/100`,
    `- 시간의 3중 현존 조화도(Distentio Animi): ${res.temporalPresenceHarmonizationScore}/100`,
    `- 은총 수용 및 겸손도(Gratia & Humilitas): ${res.graceOvercomingPrideScore}/100`,
    `- 심령의 안식 평정심 지수(Requies Cordis): ${res.restfulPeaceOfHeartScore}/100`,
    `- 참된 사랑 지향도(Ordo Amoris / Caritas): ${res.transcendentLoveOrientationScore}/100`,
    `- 핵심 영성 테마: ${res.activeAugustineTheme.themeTitleKo} [${res.activeAugustineTheme.themeTitleLatin}]`,
    `- 신학·철학적 통찰: ${res.activeAugustineTheme.theologicalInsight}`,
    `- 영적 권면: ${res.activeAugustineTheme.spiritualCounsel}`,
    `- 핵심 경구: "${res.focalAugustineAphorism.aphorismKo}"`,
    `- 라틴어 원문: "${res.focalAugustineAphorism.aphorismLatin}" [${res.focalAugustineAphorism.scripturalContext}]`,
    `- 실천적 행동 지침: ${res.focalAugustineAphorism.practicalAction}`,
    `- 통합 영성 권면: ${res.augustinePersonalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
