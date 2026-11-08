/**
 * 미국 헨리 데이비드 소로(Henry David Thoreau) 《월든(Walden)》 & 《시민 불복종(Civil Disobedience)》 단순한 삶(Simplicity) & 자연 합일·깨어있는 양심 실천 엔진
 *
 * 미국 초월주의와 생태주의·비폭력 저항의 위대한 사상가 헨리 데이비드 소로(Henry David Thoreau, 1817~1862)의 대표작 《월든(Walden, 1854)》과 《시민 불복종(Civil Disobedience, 1849)》 핵심 원전 기반:
 * 1. 단순함과 자발적 본질적 삶(Simplicity & Deliberate Living): 번잡한 외적 소유와 세속적 허례허식을 털어내고 삶의 정수만을 마주하는 소박한 위대함.
 * 2. 자연과의 교감 및 생명 합일도(Walden Pond Nature Communion): 월든 호숫가 숲속에서 사계절의 리듬에 스며들어 고요한 치유와 영적 회복을 얻는 생태적 감수성.
 * 3. 깨어있는 의식과 내적 자립도(Awakened Morning Consciousness): 날마다 새롭게 솟아오르는 새벽의 영혼처럼, 군중의 유행에 휩쓸리지 않고 자신의 직관에 서는 주체적 자립.
 * 4. 도덕적 양심과 정의로운 실천력(Moral Conscience & Civil Disobedience): 부당한 관습이나 불의한 권력에 맹종하지 않고, 자신의 가장 깊은 양심의 명령에 당당하게 응답하는 용기.
 * 5. 삶의 골수를 빨아들이는 실존적 활력도(Sucking Out All the Marrow of Life): 미적지근한 타협을 거부하고 삶의 밑바닥까지 정직하고 진실하게 살아내는 강인한 생명력.
 *
 * @version LUCKEY-HENRY-DAVID-THOREAU-WALDEN-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_HENRY_DAVID_THOREAU_VERSION = 'LUCKEY-HENRY-DAVID-THOREAU-WALDEN-v1.0.0';

export interface ThoreauTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface ThoreauAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface HenryDavidThoreauWaldenResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 소로 월든 & 양심 지표 (0~100)
  simplicityEssentialLifeScore: number;         // 단순함과 본질적 삶 추구도 (Simplicity & Essential Life)
  natureCommunionHarmoniaScore: number;         // 자연과의 교감 및 생명 합일도 (Walden Pond Communion)
  awakenedConsciousnessIndex: number;           // 깨어있는 의식과 내적 자립도 (Awakened Consciousness)
  moralConscienceDisobedienceScore: number;     // 도덕적 양심과 정의로운 실천력 (Moral Conscience & Civil Disobedience)
  vitalMarrowLivingIndex: number;               // 삶의 골수를 빨아들이는 실존적 활력도 (Vital Marrow of Living)
  // 세부 분석
  activeThoreauTheme: ThoreauTheme;
  focalThoreauAphorism: ThoreauAphorism;
  thoreauComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const THOREAU_THEMES: ThoreauTheme[] = [
  {
    themeKey: 'simplicity_deliberate_living',
    themeTitleEn: 'Simplicity and Deliberate Living (단순함과 본질적 삶)',
    themeTitleKo: '번잡한 소유와 허례허식을 털어내고 삶의 알맹이에 집중함',
    existentialInsight: '우리는 물건을 소유하기보다 물건에 소유당하기 쉽습니다. 삶을 복잡하게 만드는 수많은 군더더기 욕망을 과감히 덜어낼 때 비로소 진정으로 자유롭고 풍요로운 내면이 열립니다.',
    practicalCounsel: '그대의 일을 두 가지나 세 가지로 줄이십시오. 당장 불필요한 약속과 소모적인 물질적 집착을 비워내고, 오늘 가장 중요한 본질적 가치 하나에 깊이 머무십시오.',
  },
  {
    themeKey: 'walden_nature_communion',
    themeTitleEn: 'Walden Nature Communion (월든 호수와 자연의 교감)',
    themeTitleKo: '자연의 고요한 리듬에 스며들어 영혼의 깊은 안식을 회복함',
    existentialInsight: '숲과 호수, 바람과 나무는 인간의 좁은 시야를 넓혀주고 지친 마음에 무한한 생명력을 불어넣습니다. 자연은 고독 속에서도 우리를 결코 혼자 버려두지 않는 영원한 안식처입니다.',
    practicalCounsel: '인공적인 화면과 소음에서 잠시 물러나 흙길을 걷거나 하늘을 올려다보십시오. 자연의 소박한 호흡과 만날 때 머릿속의 복잡한 엉킴이 거짓말처럼 풀려납니다.',
  },
  {
    themeKey: 'awakened_morning_consciousness',
    themeTitleEn: 'Awakened Morning Consciousness (깨어있는 새벽의 영혼)',
    themeTitleKo: '날마다 새롭게 동터 오는 아침처럼 의식을 투명하고 명징하게 세움',
    existentialInsight: '참된 하루는 태양이 뜰 때 시작되는 것이 아니라 우리의 도덕적 의식이 깨어날 때 시작됩니다. 기계적인 일상에 매몰되지 않고 매 순간을 명석한 각성으로 마주해야 합니다.',
    practicalCounsel: '습관적인 체념이나 나태에서 벗어나십시오. 매일 아침 눈을 뜰 때마다 세상을 처음 만나는 어린아이의 맑은 눈으로 오늘 당신에게 주어진 고유한 사명을 응시하십시오.',
  },
  {
    themeKey: 'conscience_and_moral_integrity',
    themeTitleEn: 'Conscience and Moral Integrity (양심과 불의에 맞서는 도덕적 용기)',
    themeTitleKo: '세상의 불의와 편한 타협을 거부하고 내면의 양심에 당당히 섬',
    existentialInsight: '다수가 따른다고 해서 그것이 진리가 될 수 없습니다. 단 한 사람일지라도 양심의 소리에 귀 기울이고 불의한 관습에 단호히 "아니오"라고 말할 때 인류의 역사는 한 걸음 나아갑니다.',
    practicalCounsel: '비난이나 불이익이 두려워 타협하지 마십시오. 가슴속 깊은 양심이 옳다고 가리키는 바를 조용하지만 단호하게 행동으로 옮기십시오.',
  },
  {
    themeKey: 'different_drummer_independent_path',
    themeTitleEn: 'Marching to a Different Drummer (다른 북소리를 따르는 고유한 보폭)',
    themeTitleKo: '세상의 획일적 성공 기준을 벗어나 나만의 고유한 리듬으로 전진함',
    existentialInsight: '모두가 같은 속도로 달릴 필요는 없습니다. 누군가 남들과 보폭을 맞추지 못한다면, 그는 먼 곳에서 들려오는 자신만의 고유한 북소리에 발을 맞추고 있기 때문입니다.',
    practicalCounsel: '남들과 비교하며 조급해하지 마십시오. 세상의 유행과 시선에 신경을 끄고, 오직 당신의 가슴을 뛰게 하는 나만의 음악에 맞춰 당당하게 걸어가십시오.',
  },
];

export const THOREAU_APHORISMS: ThoreauAphorism[] = [
  {
    aphorismKey: 'simplicity_three_affairs',
    aphorismKo: '단순하게, 단순하게, 단순하게 살아라! 그대의 일을 백 가지나 천 가지 대신 두 가지나 세 가지로 줄여라.',
    aphorismEn: 'Simplicity, simplicity, simplicity! I say, let your affairs be as two or three, and not a hundred or a thousand.',
    sourceContext: '《월든(Walden)》 제2장 <내가 살았던 곳과 내가 살았던 이유>',
    actionGuidance: '오늘 하루 번잡한 일정을 과감히 축소하고, 영혼을 살찌우는 핵심 과업 1~2개에 모든 에너지를 모으십시오.',
  },
  {
    aphorismKey: 'live_deliberately_marrow',
    aphorismKo: '나는 삶의 본질적인 사실들만을 마주하고 삶이 가르쳐 주는 바를 배우기 위해 숲으로 들어갔다.',
    aphorismEn: 'I went to the woods because I wished to live deliberately, to front only the essential facts of life...',
    sourceContext: '《월든》 제2장 <내가 살았던 곳과 내가 살았던 이유>',
    actionGuidance: '피상적인 겉치레를 걷어내고, 진정으로 살아있다는 느낌을 주는 가치 있는 일에 온몸으로 뛰어드십시오.',
  },
  {
    aphorismKey: 'hear_different_drummer',
    aphorismKo: '만약 어떤 사람이 동료들과 보폭을 맞추지 않는다면, 그것은 그가 다른 북소리를 듣고 있기 때문이다.',
    aphorismEn: 'If a man does not keep pace with his companions, perhaps it is because he hears a different drummer. Let him step to the music which he hears.',
    sourceContext: '《월든》 제18장 <맺는 말>',
    actionGuidance: '주변의 기대나 관성에 휘둘리지 말고, 당신의 내면 깊은 곳에서 울려 퍼지는 고유한 리듬을 확신하십시오.',
  },
  {
    aphorismKey: 'men_first_subjects_afterward',
    aphorismKo: '우리는 먼저 국민이기 이전에 한 인간이어야 한다. 법에 대한 존경심보다 정의에 대한 존경심을 키워야 한다.',
    aphorismEn: 'We should be men first, and subjects afterward. It is not desirable to cultivate a respect for the law, so much as for the right.',
    sourceContext: '《시민 불복종(Civil Disobedience)》',
    actionGuidance: '권위나 관례라는 핑계 뒤로 숨지 말고, 양심의 법정에 비추어 부끄러움 없는 바른 태도를 선택하십시오.',
  },
];

export function calculateHenryDavidThoreauWalden(
  profile: UserProfile
): HenryDavidThoreauWaldenResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `HENRY-DAVID-THOREAU-WALDEN:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const simplicityEssentialLifeScore = 75 + (absHash % 24);
  const natureCommunionHarmoniaScore = 73 + ((absHash >> 3) % 26);
  const awakenedConsciousnessIndex = 74 + ((absHash >> 6) % 25);
  const moralConscienceDisobedienceScore = 72 + ((absHash >> 9) % 27);
  const vitalMarrowLivingIndex = 76 + ((absHash >> 12) % 23);

  const themeIndex = (absHash >> 4) % THOREAU_THEMES.length;
  const aphorismIndex = (absHash >> 7) % THOREAU_APHORISMS.length;

  const activeThoreauTheme = THOREAU_THEMES[themeIndex];
  const focalThoreauAphorism = THOREAU_APHORISMS[aphorismIndex];

  const guidanceTitle = `헨리 데이비드 소로 월든 단순함과 양심 지혜: ${activeThoreauTheme.themeTitleKo}`;
  const philosophicalCounsel = `헨리 데이비드 소로의 월든 사상은 세속의 복잡한 욕망과 겉치레를 비워내고, 삶의 본질과 대자연의 호흡, 깨어있는 양심으로 우뚝 서도록 일깨웁니다. ` +
    `현재 당신의 삶을 비추는 초월주의적 성찰 원리는 '${activeThoreauTheme.themeTitleKo}'입니다. ` +
    `${activeThoreauTheme.practicalCounsel} 아울러 《월든》의 불멸의 경구 "${focalThoreauAphorism.aphorismKo}"(${focalThoreauAphorism.aphorismEn})를 깊이 마음에 새기고, ` +
    `${focalThoreauAphorism.actionGuidance}`;

  return {
    engineVersion: AMERICAN_HENRY_DAVID_THOREAU_VERSION,
    calculatedAtKst: new Date().toISOString(),
    simplicityEssentialLifeScore,
    natureCommunionHarmoniaScore,
    awakenedConsciousnessIndex,
    moralConscienceDisobedienceScore,
    vitalMarrowLivingIndex,
    activeThoreauTheme,
    focalThoreauAphorism,
    thoreauComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatHenryDavidThoreauWaldenPrompt(res: HenryDavidThoreauWaldenResult): string {
  return [
    `【헨리 데이비드 소로 《월든》 단순함 & 양심 지표】`,
    `- 단순함과 본질적 삶 추구도(Simplicity): ${res.simplicityEssentialLifeScore}/100`,
    `- 자연과의 교감 및 생명 합일도(Nature Communion): ${res.natureCommunionHarmoniaScore}/100`,
    `- 깨어있는 의식과 내적 자립도(Awakened Consciousness): ${res.awakenedConsciousnessIndex}/100`,
    `- 도덕적 양심과 실천력(Civil Disobedience): ${res.moralConscienceDisobedienceScore}/100`,
    `- 삶의 골수를 빨아들이는 실존 활력도(Vital Marrow): ${res.vitalMarrowLivingIndex}/100`,
    `- 핵심 초월주의 테마: ${res.activeThoreauTheme.themeTitleKo} [${res.activeThoreauTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeThoreauTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeThoreauTheme.practicalCounsel}`,
    `- 핵심 원전 경구: "${res.focalThoreauAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalThoreauAphorism.aphorismEn}" [${res.focalThoreauAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalThoreauAphorism.actionGuidance}`,
    `- 종합 초월주의 철학 권면: ${res.thoreauComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
