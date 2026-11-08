/**
 * 영국 존 로크(John Locke) 《인간 오성론(An Essay Concerning Human Understanding)》 & 《통치론(Two Treatises of Government)》 타불라 라사 & 경험적 이성·천부인권 관용 엔진
 *
 * 영국 고전 경험론과 자유주의 정치철학의 창시자 존 로크(John Locke, 1632~1704)의 기념비적 저작 《인간 오성론(1689)》, 《통치론(1689)》, 《관용론(1689)》 핵심 원전 기반:
 * 1. 타불라 라사(백지 상태) 열린 수용도 & 경험적 쇄신력(Tabula Rasa & Receptivity): 선천적 편견과 독단적 교조를 걷어내고, 정직한 경험을 통해 새롭게 깨달음을 채워가는 열린 마음.
 * 2. 감각과 반성의 조화 균형 지수(Sensation & Reflection Empirical Balance): 외적 사물을 관찰하는 감각(Sensation)과 내면의 작용을 성찰하는 반성(Reflection)의 원숙한 결합.
 * 3. 천부인권(생명·자유·재산) 자아 존엄 및 권리 자각도(Natural Rights: Life, Liberty, and Property): 어떤 외압이나 권력도 침해할 수 없는 개인의 고유한 존엄성과 자유·소유에 대한 당당한 자각.
 * 4. 사회계약과 상호 신뢰 연대도(Social Contract & Fiduciary Trust): 지배와 복종이 아닌 자유로운 동의와 상호 신뢰를 바탕으로 공정한 연대와 협력을 구축하는 역량.
 * 5. 관용과 다원성 존중·온건한 실용 분별력(Toleration & Practical Prudence): 서로 다른 신념과 개성을 포용하며, 맹목적 광신을 배격하고 상식과 이성에 기반한 평화적 공존을 이끄는 지혜.
 *
 * @version LUCKEY-JOHN-LOCKE-UNDERSTANDING-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const BRITISH_JOHN_LOCKE_VERSION = 'LUCKEY-JOHN-LOCKE-UNDERSTANDING-v1.0.0';

export interface LockeTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface LockeAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface JohnLockeHumanUnderstandingResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 존 로크 경험론 & 천부인권 지표 (0~100)
  tabulaRasaOpenReceptivityScore: number;     // 타불라 라사 열린 수용도 (Tabula Rasa & Receptivity)
  sensationReflectionBalanceIndex: number;    // 감각과 반성의 조화 균형 지수 (Sensation & Reflection)
  naturalRightsInviolabilityScore: number;    // 천부인권 자아 존엄 및 권리 자각도 (Life, Liberty, Property)
  socialContractMutualTrustIndex: number;     // 사회계약과 상호 신뢰 연대도 (Social Contract & Trust)
  tolerantPrudenceWisdomScore: number;        // 관용과 다원성 존중 실용 분별력 (Toleration & Prudence)
  // 세부 분석
  activeLockeTheme: LockeTheme;
  focalLockeAphorism: LockeAphorism;
  lockeComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const LOCKE_THEMES: LockeTheme[] = [
  {
    themeKey: 'tabula_rasa_open_mind',
    themeTitleEn: 'Tabula Rasa and Open Receptivity (타불라 라사와 열린 지성)',
    themeTitleKo: '마음의 백지 위에 선입견 없이 정직한 경험의 배움을 새김',
    existentialInsight: '인간의 마음은 태어날 때 아무런 글자도 적혀있지 않은 흰 종이(Tabula Rasa)와 같습니다. 타고난 운명이나 낡은 편견에 갇히지 않고, 살아있는 경험을 통해 스스로 지혜를 쌓아가는 것이야말로 인간 존엄의 근원입니다.',
    practicalCounsel: '과거의 기억이나 타인의 선입견에 끌려다니지 마십시오. 오늘 마주하는 사람과 상황을 아무것도 적히지 않은 백지처럼 순수한 호기심으로 마주할 때 뜻밖의 돌파구가 열립니다.',
  },
  {
    themeKey: 'sensation_and_reflection',
    themeTitleEn: 'Sensation and Inner Reflection (감각의 관찰과 내적 반성의 조화)',
    themeTitleKo: '외부 세계의 사실을 정밀히 관찰하고 내면의 생각을 깊이 성찰함',
    existentialInsight: '지식의 모든 재료는 두 가지 샘에서 솟아납니다. 외적 사물을 향한 감각(Sensation)과 마음의 작용을 되돌아보는 반성(Reflection)입니다. 바깥의 현실과 안쪽의 통찰이 균형을 이룰 때 흔들리지 않는 판단력이 섭니다.',
    practicalCounsel: '현장의 사실을 먼저 냉정하게 확인하고, 그 사실이 내 마음속에서 어떤 감정과 생각을 일으키는지 차분히 성찰하십시오. 객관적 데이터와 주관적 직관이 만날 때 실수가 사라집니다.',
  },
  {
    themeKey: 'natural_rights_liberty_property',
    themeTitleEn: 'Inalienable Natural Rights (천부인권과 자유의 불가침성)',
    themeTitleKo: '나 자신의 생명과 자유, 정당한 노력의 결실을 당당하게 지켜냄',
    existentialInsight: '모든 인간은 태어나면서부터 생명(Life), 자유(Liberty), 그리고 정당한 노력으로 일군 자산(Property)에 대한 침해받을 수 없는 권리를 지닙니다. 나를 존중하고 타인의 권리를 존중하는 것이 정의의 출발점입니다.',
    practicalCounsel: '당신의 정당한 경계선과 권리를 부당하게 침해당하지 않도록 당당하게 의사를 표현하십시오. 자존감을 굳건히 지키는 사람만이 타인과의 관계에서도 건강한 신뢰를 맺을 수 있습니다.',
  },
  {
    themeKey: 'fiduciary_trust_social_contract',
    themeTitleEn: 'Mutual Consent and Fiduciary Trust (자유로운 동의와 신뢰의 연대)',
    themeTitleKo: '강요된 억압을 벗어나 상호 존중과 신의를 바탕으로 협력함',
    existentialInsight: '정당한 권위는 힘으로 억누르는 데서 나오는 것이 아니라 자유로운 동의와 신뢰(Trust)에서 비롯됩니다. 약속이 지켜지고 투명성이 보장될 때 개인과 공동체 모두 번영을 누립니다.',
    practicalCounsel: '관계와 협업에서 일방적인 희생이나 강요를 경계하십시오. 서로의 역할과 책임을 투명하게 합의하고, 작은 신의를 성실하게 지켜냄으로써 단단한 동맹을 일구십시오.',
  },
  {
    themeKey: 'toleration_and_reasoned_peace',
    themeTitleEn: 'Toleration and Reasoned Peace (관용과 다원성을 품는 이성적 평화)',
    themeTitleKo: '나와 다른 생각과 다름을 배척하지 않고 너른 도량으로 포용함',
    existentialInsight: '진리는 힘이나 박해로 강요될 수 없으며 오직 설득과 이성의 빛으로만 밝혀집니다. 나와 다른 관점을 온건하게 수용하는 관용(Toleration)이야말로 내면의 성숙과 사회적 평화의 보증수표입니다.',
    practicalCounsel: '의견이 맞지 않는 사람을 적으로 돌리지 마십시오. 상대방의 입장을 경청하고 공통의 이익을 모색하는 너그러운 관용을 베풀 때 당신의 영향력은 배가됩니다.',
  },
];

export const LOCKE_APHORISMS: LockeAphorism[] = [
  {
    aphorismKey: 'mind_white_paper_tabula_rasa',
    aphorismKo: '인간의 마음을 글자나 아무런 관념도 적혀있지 않은 백지(White Paper)라고 가정해 보라. 그것은 어떻게 채워지는가? 나는 한마디로 대답한다. 경험으로부터다.',
    aphorismEn: 'Let us then suppose the mind to be, as we say, white paper, void of all characters, without any ideas: How comes it to be furnished? To this I answer, in one word, from EXPERIENCE.',
    sourceContext: '《인간 오성론(An Essay Concerning Human Understanding)》 제2권 제1장',
    actionGuidance: '과거의 선입견을 백지화하고, 실제 발을 디디며 얻는 생생한 경험과 데이터 속에서 답을 구하십시오.',
  },
  {
    aphorismKey: 'natural_law_life_liberty_possessions',
    aphorismKo: '자연 상태에서 모든 인간은 평등하고 독립적이며, 누구도 타인의 생명, 건강, 자유, 소유물을 침해해서는 안 된다.',
    aphorismEn: 'Being all equal and independent, no one ought to harm another in his life, health, liberty, or possessions.',
    sourceContext: '《통치론(Two Treatises of Government)》 제2편 제2장',
    actionGuidance: '당신의 고유한 권리와 자유를 소중히 지키며, 타인의 영역 또한 한 치의 흐트러짐 없이 존중하십시오.',
  },
  {
    aphorismKey: 'toleration_peaceful_persuasion',
    aphorismKo: '참된 종교와 신념은 강제가 아니라 오직 내면의 진실한 확신에서만 비롯된다. 관용이야말로 평화의 열쇠다.',
    aphorismEn: 'All the life and power of true religion consist in the inward and full persuasion of the mind. Toleration is the chief characteristic of peace.',
    sourceContext: '《관용론(A Letter Concerning Toleration)》',
    actionGuidance: '타인을 강제로 바꾸려 하지 말고, 온유한 설득과 신뢰의 본보기를 통해 마음을 얻으십시오.',
  },
  {
    aphorismKey: 'where_there_is_no_law_no_freedom',
    aphorismKo: '법이 없는 곳에는 자유도 없다. 법의 목적은 자유를 폐지하거나 억제하는 것이 아니라, 자유를 보존하고 확대하는 데 있다.',
    aphorismEn: 'Where there is no law, there is no freedom. For liberty is to be free from restraint and violence from others.',
    sourceContext: '《통치론》 제2편 제6장',
    actionGuidance: '공정한 규칙과 원칙을 세우십시오. 명확한 원칙이 바로 설 때 비로소 혼란 없는 온전한 자유가 꽃핍니다.',
  },
];

export function calculateJohnLockeHumanUnderstanding(
  profile: UserProfile
): JohnLockeHumanUnderstandingResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `JOHN-LOCKE-UNDERSTANDING:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const tabulaRasaOpenReceptivityScore = 76 + (absHash % 23);
  const sensationReflectionBalanceIndex = 74 + ((absHash >> 3) % 25);
  const naturalRightsInviolabilityScore = 75 + ((absHash >> 6) % 24);
  const socialContractMutualTrustIndex = 73 + ((absHash >> 9) % 26);
  const tolerantPrudenceWisdomScore = 72 + ((absHash >> 12) % 27);

  const themeIndex = (absHash >> 4) % LOCKE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % LOCKE_APHORISMS.length;

  const activeLockeTheme = LOCKE_THEMES[themeIndex];
  const focalLockeAphorism = LOCKE_APHORISMS[aphorismIndex];

  const guidanceTitle = `존 로크 경험론과 천부인권 지혜: ${activeLockeTheme.themeTitleKo}`;
  const philosophicalCounsel = `존 로크의 경험론과 권리 철학은 마음의 백지 위에 편견 없는 경험의 배움을 채우고, 침해할 수 없는 자유와 천부인권, 상호 신뢰와 너른 관용으로 세상을 마주하도록 일깨웁니다. ` +
    `현재 당신의 지성과 행동을 인도하는 경험론적 원리는 '${activeLockeTheme.themeTitleKo}'입니다. ` +
    `${activeLockeTheme.practicalCounsel} 아울러 《인간 오성론》 및 《통치론》의 불멸의 원전 명제 "${focalLockeAphorism.aphorismKo}"(${focalLockeAphorism.aphorismEn})를 가슴에 품고, ` +
    `${focalLockeAphorism.actionGuidance}`;

  return {
    engineVersion: BRITISH_JOHN_LOCKE_VERSION,
    calculatedAtKst: new Date().toISOString(),
    tabulaRasaOpenReceptivityScore,
    sensationReflectionBalanceIndex,
    naturalRightsInviolabilityScore,
    socialContractMutualTrustIndex,
    tolerantPrudenceWisdomScore,
    activeLockeTheme,
    focalLockeAphorism,
    lockeComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatJohnLockeHumanUnderstandingPrompt(res: JohnLockeHumanUnderstandingResult): string {
  return [
    `【존 로크 《인간 오성론》 타불라 라사 & 천부인권 지표】`,
    `- 타불라 라사(백지) 열린 수용도(Tabula Rasa): ${res.tabulaRasaOpenReceptivityScore}/100`,
    `- 감각과 반성의 조화 균형 지수(Sensation & Reflection): ${res.sensationReflectionBalanceIndex}/100`,
    `- 천부인권 자아 존엄 및 권리 자각도(Natural Rights): ${res.naturalRightsInviolabilityScore}/100`,
    `- 사회계약과 상호 신뢰 연대도(Social Contract & Trust): ${res.socialContractMutualTrustIndex}/100`,
    `- 관용과 다원성 존중 실용 분별력(Toleration & Prudence): ${res.tolerantPrudenceWisdomScore}/100`,
    `- 핵심 경험론 테마: ${res.activeLockeTheme.themeTitleKo} [${res.activeLockeTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeLockeTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeLockeTheme.practicalCounsel}`,
    `- 핵심 원전 경구: "${res.focalLockeAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalLockeAphorism.aphorismEn}" [${res.focalLockeAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalLockeAphorism.actionGuidance}`,
    `- 종합 경험주의 철학 권면: ${res.lockeComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
