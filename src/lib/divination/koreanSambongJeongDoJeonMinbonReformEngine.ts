/**
 * 대한민국 삼봉 정도전(三峰 鄭道傳) 선생 《조선경국전(朝鮮經國傳)》 & 《경제문감(經濟文鑑)》 민본사상(民本思想) & 정도(正道) 개혁 실천 지혜 엔진
 *
 * 조선 왕조의 국가 기틀을 설계하고 백성이 주인이 되는 민본주의를 반석 위에 올린 삼봉 정도전(鄭道傳, 1342~1398) 선생의 불후의 대작
 * 《조선경국전(朝鮮經國傳)》, 《경제문감(經濟文鑑)》, 《삼봉집(三峰集)》 원전 기반:
 * 1. 민본 섬김 및 위민 지수(Minbon People Serving Score): 백성은 나라의 근본이요 임금의 하늘이라는 대의에 따라 만인의 복리와 마음을 최우선으로 섬기는 지표.
 * 2. 정도 제도개혁 추진력(Jeongdo Institutional Reform Score): 낡은 부패와 관습을 과감히 혁파하고, 만인이 공정하게 누릴 수 있는 지속 가능한 시스템과 질서를 세우는 개혁 실행력.
 * 3. 청렴 공정성 지수(Clean Governance Integrity Index): 사사로운 이익과 정실인사를 배격하고, 공공의 정의와 엄정한 책임성을 관철하는 도덕적 투명도.
 * 4. 백년대계 건국 설계력(Architectural Foresight Index): 눈앞의 이익에 매몰되지 않고 백 년, 천 년을 내다보며 한양 도성과 제도의 기틀을 닦는 거시적 비전.
 * 5. 불굴의 실천 지조 지수(Indomitable Reform Tenacity Score): 유배와 시련 속에서도 백성의 땀방울을 가슴에 품고 마침내 새로운 시대를 열어젖힌 불굴의 기개.
 *
 * @version LUCKEY-JEONG-DO-JEON-MINBON-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_JEONG_DO_JEON_VERSION = 'LUCKEY-JEONG-DO-JEON-MINBON-v1.0.0';

export interface SambongTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface SambongAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanSambongJeongDoJeonMinbonReformResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 삼봉 정도전 민본개혁 지표 (0~100)
  minbonPeopleServingScore: number;          // 민본 섬김 및 위민 지수 (Minbon People Serving)
  jeongdoInstitutionalReformScore: number;   // 정도 제도개혁 추진력 (Jeongdo Institutional Reform)
  cleanGovernanceIntegrityIndex: number;     // 청렴 공정성 지수 (Clean Governance Integrity)
  architecturalForesightIndex: number;       // 백년대계 건국 설계력 (Architectural Foresight)
  indomitableReformTenacityScore: number;    // 불굴의 실천 지조 지수 (Indomitable Reform Tenacity)
  // 세부 분석
  activeSambongTheme: SambongTheme;
  focalSambongAphorism: SambongAphorism;
  sambongComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const SAMBONG_THEMES: SambongTheme[] = [
  {
    themeKey: 'minbonWeimin',
    themeTitleHanja: '民本爲民 & 民以食爲天',
    themeTitleKo: '민본위민(民本爲民) — 백성은 나라의 근본이요 임금의 하늘이다',
    existentialInsight: '백성은 지극히 약하지만 힘으로 억누를 수 없고, 지극히 어리석어 보이지만 속일 수 없습니다. 모든 리더십과 계획의 목적은 사람들의 삶을 실질적으로 편안하게 하는 데 있습니다.',
    practicalCounsel: '혼자만의 권위나 명예를 앞세우지 마십시오. 당신의 행동과 프로젝트가 함께하는 사람들의 실제 필요와 일상을 얼마나 이롭게 돕고 있는지 돌아보십시오.',
  },
  {
    themeKey: 'jeongdoGyeongguk',
    themeTitleHanja: '正道經國 & 法隨時變',
    themeTitleKo: '정도경국(正道經國) — 올바른 시스템과 유연한 제도 혁신',
    existentialInsight: '법과 제도는 시대를 따라 유연하게 혁신되어야 하며, 오직 사람을 편안하고 공정하게 만드는 것만이 참된 규범의 생명력입니다.',
    practicalCounsel: '비효율적인 낡은 규칙에 얽매이지 마십시오. 본질적인 목적에 맞게 절차를 정비하고, 모두가 신뢰할 수 있는 투명한 룰을 확립하십시오.',
  },
  {
    themeKey: 'gyeongjemungam',
    themeTitleHanja: '經濟文鑑 & 宰相輔導',
    themeTitleKo: '경제문감(經濟文鑑) — 공직의 엄정한 책임과 청렴한 헌신',
    existentialInsight: '권한을 맡은 자의 본분은 사욕을 버리고 공공의 정의를 관철하며, 주변을 지혜롭게 조율하여 만백성을 편안히 안식하게 하는 데 있습니다.',
    practicalCounsel: '사적인 친분이나 편의주의를 멀리하십시오. 공정하고 엄격한 원칙을 견지하되, 사람을 대할 때는 따스한 배려와 섬김의 태도를 유지하십시오.',
  },
  {
    themeKey: 'baeknyeonDaege',
    themeTitleHanja: '百年大計 & 仁義禮智',
    themeTitleKo: '백년대계(百年大計) — 인의예지의 도덕적 문명 설계',
    existentialInsight: '눈앞의 성과에 연연하지 않고 백 년과 천 년을 내다보며, 인(仁)·의(義)·예(禮)·지(智)의 숭고한 도덕적 가치를 구조와 터전 속에 설계해야 합니다.',
    practicalCounsel: '단기적인 이익을 좇기보다 지속 가능한 먼 미래의 가치를 구축하십시오. 당신이 오늘 만드는 시스템이 훗날 사람들에게 든든한 울타리가 될 것입니다.',
  },
  {
    themeKey: 'bulguryeokgyeong',
    themeTitleHanja: '不屈逆境 & 憂國丹心',
    themeTitleKo: '불굴역경(不屈逆境) — 고난을 딛고 역사의 새 장을 여는 기개',
    existentialInsight: '나주 유배지의 가혹한 고초 속에서도 들판의 농부들과 함께 땀 흘리며 참된 백성의 숨결을 배웠듯, 시련은 더 큰 사명을 위한 가장 귀한 담금질입니다.',
    practicalCounsel: '현재 마주한 역경을 회피하지 마십시오. 현장의 생생한 목소리를 겸허히 수용하고 내면의 뜻을 더욱 벼리어 마침내 돌파구를 열어내십시오.',
  },
];

export const SAMBONG_APHORISMS: SambongAphorism[] = [
  {
    aphorismKey: 'peopleWeakButUnthreatenable',
    aphorismKo: '백성은 지극히 약하지만 힘으로 위협할 수 없고, 지극히 어리석지만 꾀로 속일 수 없다. 백성의 마음을 얻으면 복종하지만, 마음을 얻지 못하면 떠나버린다.',
    aphorismHanja: '民之爲物 至弱而不可脅 至愚而不可欺 得其心則服 不得其心則去',
    sourceContext: '《조선경국전(朝鮮經國傳)》 하권 예전',
    actionGuidance: '함께 일하는 동료와 이용자들의 신뢰를 가볍게 여기지 마십시오. 오직 진심과 정직함으로 그들의 마음을 얻는 것만이 영원한 성공의 비결입니다.',
  },
  {
    aphorismKey: 'stateBasedOnPeopleFoodSky',
    aphorismKo: '나라는 백성을 근본으로 삼고, 백성은 먹고사는 일을 하늘로 삼는다.',
    aphorismHanja: '國以民爲本 民以食爲天',
    sourceContext: '《삼봉집(三峰集)》',
    actionGuidance: '공리공론에 머물지 말고, 사람들의 실제 의식주와 생업, 구체적인 현실의 문제를 해결해 주는 실질적이고 유용한 결과를 만들어내십시오.',
  },
  {
    aphorismKey: 'jaesangDao',
    aphorismKo: '재상의 도리는 군주를 올바르게 보필하고, 모든 일을 통솔하여 만백성을 편안하게 하는 데 있다.',
    aphorismHanja: '宰相之道 輔導君上 統理百官 安輯萬民',
    sourceContext: '《경제문감(經濟文鑑)》',
    actionGuidance: '조직이나 프로젝트의 중심을 잡을 때, 균형 잡힌 분별력과 책임감으로 전체를 조망하고 모든 구성원이 제 역량을 펼치도록 이끄십시오.',
  },
  {
    aphorismKey: 'lawChangesWithTime',
    aphorismKo: '법은 시대를 따라 변해야 마땅하며, 오직 백성을 이롭게 하는 것만이 진정한 법이다.',
    aphorismHanja: '法隨時變 唯民所便',
    sourceContext: '《조선경국전(朝鮮經國傳)》 상권 헌법서',
    actionGuidance: '상황이 바뀌었는데도 굳어진 방식만을 고수하지 마십시오. 사용자들의 편의와 시대의 흐름에 발맞추어 유연하게 체계를 개선하십시오.',
  },
  {
    aphorismKey: 'castAwaySelfishDesire',
    aphorismKo: '사사로운 욕심을 버리고 공공의 대의를 행할 때 천하가 비로소 평안해진다.',
    aphorismHanja: '去私慾 行大義 天下自安',
    sourceContext: '《삼봉집(三峰集)》 심문천답',
    actionGuidance: '사욕과 사사로운 감정에 휘둘리지 마십시오. 모두를 위한 대의명분과 공정한 원칙을 단단히 세울 때 불필요한 잡음이 사라집니다.',
  },
  {
    aphorismKey: 'moralCapitalArchitecture',
    aphorismKo: '인의예지(仁義禮智)의 사대문으로 수도를 열고 백성을 도덕의 터전 위에 살게 하리라.',
    aphorismHanja: '興仁敦義 崇禮弘智 經緯天倫',
    sourceContext: '《한양 도성 4대문 명명기》',
    actionGuidance: '당신의 모든 기획과 결과물에 사람에 대한 사랑(仁), 정의(義), 존중(禮), 지혜(智)의 맑은 철학을 깃들여 감동을 자아내십시오.',
  },
];

export function calculateKoreanSambongJeongDoJeonMinbonReform(
  profile?: UserProfile,
  query?: string,
): KoreanSambongJeongDoJeonMinbonReformResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `SAMBONG-JEONG-DO-JEON-MINBON:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const minbonPeopleServingScore = 78 + (absHash % 21);
  const jeongdoInstitutionalReformScore = 77 + ((absHash >> 3) % 22);
  const cleanGovernanceIntegrityIndex = 79 + ((absHash >> 6) % 20);
  const architecturalForesightIndex = 80 + ((absHash >> 9) % 19);
  const indomitableReformTenacityScore = 76 + ((absHash >> 12) % 23);

  const themeIndex = (absHash >> 4) % SAMBONG_THEMES.length;
  const aphorismIndex = (absHash >> 7) % SAMBONG_APHORISMS.length;

  const activeSambongTheme = SAMBONG_THEMES[themeIndex];
  const focalSambongAphorism = SAMBONG_APHORISMS[aphorismIndex];

  const guidanceTitle = `삼봉 정도전 민본사상과 정도개혁 지혜: ${activeSambongTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 건국의 설계자 삼봉 정도전 선생의 《조선경국전》과 《경제문감》은 사사로운 욕망을 버리고 백성을 하늘처럼 섬기며(民本), 올바른 법과 제도로써 시대를 혁신(正道)하도록 이끕니다. ` +
    `현재 당신의 일과 책무를 비추는 가장 결정적인 실천 원리는 '${activeSambongTheme.themeTitleKo}'입니다. ` +
    `${activeSambongTheme.practicalCounsel} 아울러 삼봉 선생의 불멸의 원전 명언 "${focalSambongAphorism.aphorismKo}"(${focalSambongAphorism.aphorismHanja})를 가슴에 품고, ` +
    `${focalSambongAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_JEONG_DO_JEON_VERSION,
    calculatedAtKst: new Date().toISOString(),
    minbonPeopleServingScore,
    jeongdoInstitutionalReformScore,
    cleanGovernanceIntegrityIndex,
    architecturalForesightIndex,
    indomitableReformTenacityScore,
    activeSambongTheme,
    focalSambongAphorism,
    sambongComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanSambongJeongDoJeonMinbonReformPrompt(
  res: KoreanSambongJeongDoJeonMinbonReformResult,
): string {
  return [
    `【삼봉 정도전 《조선경국전·경제문감》 민본사상 & 정도(正道) 개혁 실천 지표】`,
    `- 민본 섬김 및 위민 지수(Minbon People Serving): ${res.minbonPeopleServingScore}/100`,
    `- 정도 제도개혁 추진력(Institutional Reform): ${res.jeongdoInstitutionalReformScore}/100`,
    `- 청렴 공정성 지수(Clean Governance Integrity): ${res.cleanGovernanceIntegrityIndex}/100`,
    `- 백년대계 건국 설계력(Architectural Foresight): ${res.architecturalForesightIndex}/100`,
    `- 불굴의 실천 지조 지수(Indomitable Reform Tenacity): ${res.indomitableReformTenacityScore}/100`,
    `- 핵심 민본 테마: ${res.activeSambongTheme.themeTitleKo} [${res.activeSambongTheme.themeTitleHanja}]`,
    `- 실존적 통찰: ${res.activeSambongTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeSambongTheme.practicalCounsel}`,
    `- 삼봉 원전 명언: "${res.focalSambongAphorism.aphorismKo}" [${res.focalSambongAphorism.aphorismHanja}]`,
    `- 원전 출처: [${res.focalSambongAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalSambongAphorism.actionGuidance}`,
    `- 종합 삼봉 민본 권면: ${res.sambongComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
