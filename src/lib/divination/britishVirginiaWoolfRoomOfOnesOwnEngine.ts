/**
 * 영국 버지니아 울프(Virginia Woolf) 《자기만의 방》 & 《댈러웨이 부인》 & 《등대로》 자기만의 방 & 존재의 순간들·양성구유적 창조성 지혜 엔진
 *
 * 20세기 모더니즘 문학과 페미니즘 비평의 거장 버지니아 울프(1882~1941)의 원전 기반:
 * 1. 자기만의 방 자율성과 독립적 사유 역량 (Room of One's Own Intellectual Autonomy Score): 세속적 압박과 타인의 시선에서 벗어나 내면의 고유한 목소리를 지키는 사유의 독립성.
 * 2. 일상의 찰나 속 존재의 순간들 직관도 (Moments of Being Primordial Insight Index): 분주한 일상의 껍질 아래 번뜩이는 삶의 본질과 찬란한 진실을 포착하는 감각.
 * 3. 편견을 넘어선 양성구유적 창조적 지성 (Androgynous Mind Creative Balance Score): 남성성과 여성성의 이분법을 넘어 조화로운 영혼의 협력으로 도달하는 완성된 창조성.
 * 4. 내면 의식의 흐름 수용 및 진실성 지표 (Stream of Consciousness Authenticity Index): 관습적 형식에 얽매이지 않고 인간 내면의 솔직한 감정과 사유의 물결을 온전히 긍정하는 힘.
 * 5. 세월의 파도 속에서도 중심을 잡는 등대적 회복탄력성 (Lighthouse Steadfast Resilience Score): 시간의 무상함과 상실 속에서도 삶의 의미를 잃지 않고 내면의 빛을 비추는 회복탄력성.
 *
 * @version LUCKEY-VIRGINIA-WOOLF-ROOM-OF-ONES-OWN-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const BRITISH_VIRGINIA_WOOLF_ROOM_OF_ONES_OWN_VERSION = 'LUCKEY-VIRGINIA-WOOLF-ROOM-OF-ONES-OWN-v1.0.0';

export interface WoolfTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface WoolfAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEnglish: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface BritishVirginiaWoolfRoomOfOnesOwnResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 버지니아 울프 핵심 지표 (0~100)
  roomOfOnesOwnAutonomyScore: number;                   // 자기만의 방 자율성과 독립적 사유 역량 (Room of One's Own Autonomy)
  momentsOfBeingInsightIndex: number;                   // 존재의 순간들 직관도 (Moments of Being Insight)
  androgynousMindCreativityScore: number;               // 양성구유적 창조적 지성 (Androgynous Mind Creativity)
  streamOfConsciousnessFlowIndex: number;               // 의식의 흐름 수용 및 진실성 지표 (Stream of Consciousness Authenticity)
  lighthouseResilienceScore: number;                    // 등대적 회복탄력성 (Lighthouse Steadfast Resilience)
  // 세부 분석
  activeWoolfTheme: WoolfTheme;
  focalWoolfAphorism: WoolfAphorism;
  woolfComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const WOOLF_THEMES: WoolfTheme[] = [
  {
    themeKey: 'aRoomOfOnesOwn',
    themeTitleEn: 'A Room of One\'s Own: Uncompromising Intellectual Freedom and Sovereignty',
    themeTitleKo: '자기만의 방 — 세속의 소음과 억압을 닫아걸고 온전한 사유의 주권을 확보하기',
    literaryInsight: '울프의 《자기만의 방》은 단순한 물리적 공간이 아닙니다. 타인의 인정이나 사회적 기대에 흔들리지 않고 스스로 진실을 사유할 수 있는 내면의 거룩한 독립 지대를 의미합니다.',
    practicalCounsel: '당신만의 고유한 시간과 사유의 성채를 사수하십시오. 남들의 기준과 요구에 일정을 다 내어주지 말고, 하루 단 30분이라도 문을 닫고 오롯이 당신의 영혼과 마주하는 자기만의 방을 만드십시오.',
  },
  {
    themeKey: 'momentsOfBeing',
    themeTitleEn: 'Moments of Being: Flashes of Shock and Transcendental Illumination in Everyday Life',
    themeTitleKo: '존재의 순간들(Moments of Being) — 일상의 솜이불 같은 무감각을 뚫고 솟아나는 생의 진실',
    literaryInsight: '우리의 대부분 일상은 비존재(Non-being)의 무감각한 솜이불 속에 묻혀 지나갑니다. 그러나 때로 사소한 사물이나 찰나의 마주침 속에서 세계 전체의 연관성과 충만한 아름다움이 폭발하는 존재의 순간이 찾아옵니다.',
    practicalCounsel: '바쁜 일상에 쫓겨 감각을 마비시키지 마십시오. 오늘 마주치는 사소한 바람, 한 잔의 차, 상대방의 눈빛 속에 깃든 기적 같은 생명력을 온몸으로 섬세하게 음미하십시오. 그 찰나가 당신을 살립니다.',
  },
  {
    themeKey: 'androgynousMind',
    themeTitleEn: 'The Androgynous Mind: Harmonious Fusion of Reason and Intuition in Resonant Equilibrium',
    themeTitleKo: '양성구유적(Androgynous) 지성 — 메마른 이분법을 넘어 이성과 감성이 상호 공명하는 온전한 창조력',
    literaryInsight: '콜리지와 울프가 역설한 양성구유의 마음은 남성성과 여성성이 대립하지 않고 서로 협력하는 다산(多産)의 상태입니다. 편협한 편견을 버리고 세계를 넓고 유연하게 포용할 때 비로소 위대한 통찰이 탄생합니다.',
    practicalCounsel: '논리와 분석만으로 상대를 압도하려 들거나, 반대로 감정에만 휘둘려 판단을 흐리지 마십시오. 단호한 이성과 따뜻한 직관을 함께 작동시킬 때 어떤 난제 앞에서도 가장 지혜로운 해법이 도출됩니다.',
  },
  {
    themeKey: 'toTheLighthouse',
    themeTitleEn: 'To the Lighthouse: Anchoring the Soul\'s Gaze Beyond the Turbulent Waves of Time and Loss',
    themeTitleKo: '등대로 향하는 시선 — 세월의 풍화와 이별의 아픔 속에서도 꺼지지 않는 예술적 진실의 빛',
    literaryInsight: '《등대로》에서 세월은 램지 부인의 죽음과 1차 대전의 참화를 겪으며 모든 것을 앗아가지만, 화가 릴리 브리스코는 오랜 세월 후 캔버스 한가운데에 획을 그으며 자신의 비전을 완성합니다.',
    practicalCounsel: '삶의 상실과 실패에 무너지지 마십시오. 파도가 거세게 칠수록 저 멀리 흔들리지 않는 등대를 바라보듯 당신의 중심을 단단히 잡으십시오. 당신이 품은 비전은 결코 헛되지 않으며 마침내 완성될 것입니다.',
  },
];

export const WOOLF_APHORISMS: WoolfAphorism[] = [
  {
    aphorismKey: 'roomAndMoney',
    aphorismKo: '자신만의 사유를 펼치고자 한다면 돈과 자기만의 방을 가져야 한다.',
    aphorismEnglish: 'A woman must have money and a room of her own if she is to write fiction.',
    sourceContext: '《자기만의 방(A Room of One\'s Own)》, 1929',
    actionGuidance: '물질적 현실의 안정과 독립된 영혼의 공간을 동시에 확보하십시오. 자립과 자율성이 당신의 모든 창조적 존엄의 바탕입니다.',
  },
  {
    aphorismKey: 'luminousHalo',
    aphorismKo: '삶은 대칭적으로 배열된 마차등이 아니라, 우리를 둘러싼 반투명한 봉투이자 찬란한 달무리다.',
    aphorismEnglish: 'Life is not a series of gig lamps symmetrically arranged; life is a luminous halo, a semi-transparent envelope surrounding us.',
    sourceContext: '《현대 소설(Modern Fiction)》, 1919',
    actionGuidance: '기성 관습이나 정형화된 공식에 얽매이지 마십시오. 지금 당신의 마음에 살아 움직이는 직관과 감수성의 빛을 솔직하게 신뢰하십시오.',
  },
  {
    aphorismKey: 'androgynousState',
    aphorismKo: '진정으로 비옥하고 다산적인 영혼은 마음의 양면이 조화롭게 결합하여 영적으로 협력하는 상태다.',
    aphorismEnglish: 'The normal and comfortable state of being is that when the two live in harmony together, spiritually cooperating.',
    sourceContext: '《자기만의 방(A Room of One\'s Own)》, 1929',
    actionGuidance: '이분법적 갈등을 멈추고 강인함과 섬세함, 분석력과 공감력을 통합하십시오. 균형 잡힌 영혼만이 탁월한 성취를 낳습니다.',
  },
  {
    aphorismKey: 'dailyMiracles',
    aphorismKo: '위대한 계시는 어쩌면 결코 오지 않을지 모른다. 대신 어둠 속에서 성냥이 켜지듯 매일 사소한 기적과 직관이 번뜩인다.',
    aphorismEnglish: 'The great revelation perhaps never came. Instead there were little daily miracles, illuminations, matches struck unexpectedly in the dark.',
    sourceContext: '《등대로(To the Lighthouse)》, 1927',
    actionGuidance: '거창한 한 방의 계시를 기다리며 오늘을 낭비하지 마십시오. 오늘 하루 당신이 켜는 작은 성냥 한 개비 같은 정성과 온기가 세상을 밝힙니다.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function calculateBritishVirginiaWoolfRoomOfOnesOwn(
  profile?: UserProfile,
  query?: string,
): BritishVirginiaWoolfRoomOfOnesOwnResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `VIRGINIA-WOOLF-ROOM-OF-ONES-OWN:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const roomOfOnesOwnAutonomyScore = 89 + ((absHash >> 1) % 10);
  const momentsOfBeingInsightIndex = 88 + ((absHash >> 4) % 11);
  const androgynousMindCreativityScore = 90 + ((absHash >> 7) % 9);
  const streamOfConsciousnessFlowIndex = 87 + ((absHash >> 10) % 12);
  const lighthouseResilienceScore = 89 + ((absHash >> 13) % 10);

  const themeIndex = (absHash >> 5) % WOOLF_THEMES.length;
  const aphorismIndex = (absHash >> 8) % WOOLF_APHORISMS.length;

  const activeWoolfTheme = WOOLF_THEMES[themeIndex];
  const focalWoolfAphorism = WOOLF_APHORISMS[aphorismIndex];

  const guidanceTitle = `버지니아 울프 자기만의 방과 존재의 순간들: ${activeWoolfTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 모더니즘 문학의 거장 버지니아 울프 선생은 《자기만의 방》과 《등대로》를 통해 ` +
    `외부의 억압과 편견을 넘어선 온전한 사유의 독립성, 무감각한 일상의 껍질을 뚫고 솟구치는 존재의 순간들(Moments of Being), ` +
    `그리고 이성과 감성이 상호 공명하는 양성구유적(Androgynous) 전인적 창조성의 길을 제시했습니다. ` +
    `지금 당신에게 가장 필요한 실천적 나침반은 '${activeWoolfTheme.themeTitleKo}'입니다. ` +
    `${activeWoolfTheme.practicalCounsel} 울프의 명언 "${focalWoolfAphorism.aphorismKo}" (${focalWoolfAphorism.aphorismEnglish})을 마음에 새기고, ` +
    `${focalWoolfAphorism.actionGuidance}`;

  return {
    engineVersion: BRITISH_VIRGINIA_WOOLF_ROOM_OF_ONES_OWN_VERSION,
    calculatedAtKst: new Date().toISOString(),
    roomOfOnesOwnAutonomyScore,
    momentsOfBeingInsightIndex,
    androgynousMindCreativityScore,
    streamOfConsciousnessFlowIndex,
    lighthouseResilienceScore,
    activeWoolfTheme,
    focalWoolfAphorism,
    woolfComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatBritishVirginiaWoolfRoomOfOnesOwnPrompt(
  res: BritishVirginiaWoolfRoomOfOnesOwnResult,
): string {
  return [
    `【버지니아 울프 《자기만의 방·등대로》 사유의 독립·존재의 순간들 지표】`,
    `- 자기만의 방 자율성과 독립적 사유 역량(Room of One's Own Autonomy): ${res.roomOfOnesOwnAutonomyScore}/100`,
    `- 존재의 순간들 직관도(Moments of Being Insight): ${res.momentsOfBeingInsightIndex}/100`,
    `- 양성구유적 창조적 지성(Androgynous Mind Creativity): ${res.androgynousMindCreativityScore}/100`,
    `- 의식의 흐름 수용 및 진실성 지표(Stream of Consciousness Authenticity): ${res.streamOfConsciousnessFlowIndex}/100`,
    `- 등대적 회복탄력성(Lighthouse Steadfast Resilience): ${res.lighthouseResilienceScore}/100`,
    `- 핵심 울프 테마: ${res.activeWoolfTheme.themeTitleKo} [${res.activeWoolfTheme.themeTitleEn}]`,
    `- 문학적 통찰: ${res.activeWoolfTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeWoolfTheme.practicalCounsel}`,
    `- 울프 원전 테제: "${res.focalWoolfAphorism.aphorismKo}" (${res.focalWoolfAphorism.aphorismEnglish})`,
    `- 원전 출처: [${res.focalWoolfAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalWoolfAphorism.actionGuidance}`,
    `- 종합 울프 권면: ${res.woolfComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
