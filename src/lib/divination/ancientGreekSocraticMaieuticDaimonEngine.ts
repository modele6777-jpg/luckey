/**
 * 고대 그리스 소크라테스(Socrates) 산파술(Maieutic) & 영혼의 배려(Epimeleia Heautou) 다이몬(Daimonion) 문답 엔진
 *
 * 플라톤 초기 대화편 《변론(Apology)》, 《테아이테토스(Theaetetus)》, 《향연(Symposium)》 원전 기반.
 * 1. 산파술(Maieutic): 스스로 진리를 낳도록 돕는 영혼의 산파술.
 * 2. 무지의 지(Apatheia / Docta Ignorantia): "내가 아무것도 모른다는 것을 안다." 성찰 없는 삶은 살 가치가 없다.
 * 3. 다이몬(Daimonion): 잘못된 길로 들어서려 할 때 내면에서 울리는 영적 경고의 신탁.
 * 4. 엘렌코스(Elenchus): 집요한 문답을 통해 헛된 편견을 허물고 참된 앎에 이르는 과정.
 * 5. 에피멜레이아 헤아우투(Epimeleia Heautou): 외적 명예와 부보다 영혼을 가장 훌륭하게 가꾸는 배려.
 *
 * @version LUCKEY-SOCRATIC-MAIEUTIC-DAIMON-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const SOCRATIC_MAIEUTIC_DAIMON_VERSION = 'LUCKEY-SOCRATIC-MAIEUTIC-DAIMON-v1.0.0';

export interface SocraticStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  dialecticalPrinciple: string;
  actionDirective: string;
}

export interface SocraticMaieuticDaimonResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  maieuticDialogueScore: number;       // 산파술 산파 문답력
  daimonionWarningSensitivity: number; // 다이몬 내면 직관 감응도
  doctaIgnorantiaHumility: number;     // 무지의 지 지적 겸허성
  elenchusRefutationClarity: number;   // 엘렌코스 편견 타파 명료도
  epimeleiaSoulCareIntegrity: number;  // 영혼의 배려 돌봄 품격도
  // 세부 명세
  activeSocraticStage: SocraticStage;
  primarySocraticAphorism: {
    themeKo: string;
    greekClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  socraticPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type SocraticMaieuticDaimonReport = SocraticMaieuticDaimonResult;

const SOCRATIC_STAGES: SocraticStage[] = [
  {
    stageLevel: 1,
    stageNameGreek: 'Aporia (아포리아)',
    stageNameKo: '기존의 거짓된 확신이 무너지는 지적 정화의 단계',
    dialecticalPrinciple: '자신이 안다고 착각했던 고정관념을 직시하고 근본적인 물음 앞에 서는 겸허함',
    actionDirective: '성급한 결론을 유보하고 모르는 것을 모른다고 인정하는 것에서부터 진짜 배움을 시작하십시오.',
  },
  {
    stageLevel: 2,
    stageNameGreek: 'Elenchus (엘렌코스)',
    stageNameKo: '내면의 모순을 날카롭게 해체하는 성찰적 반박',
    dialecticalPrinciple: '스스로의 동기와 욕망을 집요하게 검증하여 타인의 시선에서 비롯된 껍데기를 벗겨냄',
    actionDirective: '남들의 통념이나 관성에 기대지 말고 자신의 선택이 지닌 본래 이유를 스스로에게 되물으십시오.',
  },
  {
    stageLevel: 3,
    stageNameGreek: 'Maieusis (산파술)',
    stageNameKo: '영혼 깊은 곳에서 참된 통찰을 잉태하고 출산하는 과정',
    dialecticalPrinciple: '외부의 정답을 주입받는 것이 아니라 이미 영혼에 깃든 진실을 스스로 발견하여 낳음',
    actionDirective: '정답을 외부에서 구하지 말고, 이미 내면에 준비된 양심과 지혜의 목소리에 귀 기울여 실천으로 낳으십시오.',
  },
  {
    stageLevel: 4,
    stageNameGreek: 'Epimeleia Heautou (영혼의 돌봄)',
    stageNameKo: '외적 성공을 넘어 영혼의 탁월함을 가꾸는 삶의 완성',
    dialecticalPrinciple: '재물과 명예보다 정의와 지혜, 영혼의 온전함을 삶의 최우선 가치로 확립함',
    actionDirective: '세속의 분주함 속에서도 날마다 자신의 영혼이 바르고 고결하게 성장하고 있는지 살피십시오.',
  },
];

const SOCRATIC_APHORISMS = [
  {
    themeKo: '성찰하는 삶의 존엄',
    greekClassic: 'Ho de anexetastos bios ou biotos anthropo',
    coreEssence: '검토되지 않고 성찰 없는 삶은 인간으로서 살아갈 가치가 없다는 소크라테스의 단호한 선언입니다.',
    actionableDirective: '무의식적인 일상의 관성을 멈추고 오늘 나의 선택이 진정으로 영혼을 풍요롭게 하는지 물으십시오.',
  },
  {
    themeKo: '다이몬(Daimonion) - 내면의 신성한 경고',
    greekClassic: 'Theion ti kai daimonion gignetai',
    coreEssence: '부당하거나 그릇된 길로 나아가려 할 때 영혼 안에서 울리는 조용하지만 명확한 멈춤의 신호입니다.',
    actionableDirective: '불안이나 찝찝함이 마음을 스친다면 욕심으로 밀어붙이지 말고 즉시 멈추어 내면을 정돈하십시오.',
  },
  {
    themeKo: '무지의 지 - 진정한 지혜의 출발점',
    greekClassic: 'Hosa me oida oude oiomai eidenai',
    coreEssence: '자신이 알지 못하는 것을 안다고 착각하지 않는 진실한 태도가 모든 위대한 도약의 토대입니다.',
    actionableDirective: '모든 것을 통제하려는 오만을 내려놓고 열린 마음으로 사태의 본질을 겸허히 마주하십시오.',
  },
  {
    themeKo: '영혼의 탁월함(Aretē) 추구',
    greekClassic: 'Ou gar ek chrematon arete gignetai, all ek tes aretes chremata',
    coreEssence: '재물이 덕을 낳는 것이 아니라, 덕이 재물과 다른 모든 인간적인 좋은 것들을 가져다줍니다.',
    actionableDirective: '눈앞의 이익보다 과정의 고결함과 신뢰를 우선시할 때 오래 지속되는 성취가 찾아옵니다.',
  },
];

export function calculateSocraticMaieuticDaimon(profile: UserProfile): SocraticMaieuticDaimonResult {
  const seedString = (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'SocraticMaieuticDaimon';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const maieuticDialogueScore = 63 + (absHash % 36);
  const daimonionWarningSensitivity = 65 + ((absHash >> 3) % 34);
  const doctaIgnorantiaHumility = 60 + ((absHash >> 6) % 39);
  const elenchusRefutationClarity = 58 + ((absHash >> 9) % 41);
  const epimeleiaSoulCareIntegrity = 62 + ((absHash >> 12) % 37);

  const stageIndex = (absHash >> 4) % SOCRATIC_STAGES.length;
  const aphorismIndex = (absHash >> 7) % SOCRATIC_APHORISMS.length;

  const activeSocraticStage = SOCRATIC_STAGES[stageIndex];
  const primarySocraticAphorism = SOCRATIC_APHORISMS[aphorismIndex];

  const counselTitle = `소크라테스 문답과 다이몬: ${activeSocraticStage.stageNameGreek}`;
  const philosophicalGuidance = `현재 마주한 질문의 해법은 밖에서 주입되는 지식이 아니라 내면의 산파술(Maieutics)에 있습니다. ` +
    `${activeSocraticStage.dialecticalPrinciple}의 태도로 성찰하십시오. ` +
    `${activeSocraticStage.actionDirective} 내면의 다이몬이 보내는 멈춤과 정직의 신호에 귀 기울일 때 비로소 진정한 앎과 행동이 하나가 됩니다.`;

  return {
    engineVersion: SOCRATIC_MAIEUTIC_DAIMON_VERSION,
    calculatedAtKst: new Date().toISOString(),
    maieuticDialogueScore,
    daimonionWarningSensitivity,
    doctaIgnorantiaHumility,
    elenchusRefutationClarity,
    epimeleiaSoulCareIntegrity,
    activeSocraticStage,
    primarySocraticAphorism,
    socraticPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatSocraticMaieuticDaimonPrompt(res: SocraticMaieuticDaimonResult): string {
  return [
    `【고대 그리스 소크라테스 산파술 & 다이몬 영혼성찰 지표】`,
    `- 산파술 문답 통찰력: ${res.maieuticDialogueScore}/100`,
    `- 다이몬 내면직관 감응도: ${res.daimonionWarningSensitivity}/100`,
    `- 무지의 지 지적 겸허성: ${res.doctaIgnorantiaHumility}/100`,
    `- 엘렌코스 편견 타파력: ${res.elenchusRefutationClarity}/100`,
    `- 영혼의 배려 품격도: ${res.epimeleiaSoulCareIntegrity}/100`,
    `- 현재 문답 단계: ${res.activeSocraticStage.stageNameGreek} (${res.activeSocraticStage.stageNameKo})`,
    `- 변증 원리: ${res.activeSocraticStage.dialecticalPrinciple}`,
    `- 성찰 핵심 격언: "${res.primarySocraticAphorism.themeKo}" [${res.primarySocraticAphorism.greekClassic}]`,
    `- 본질 해설: ${res.primarySocraticAphorism.coreEssence}`,
    `- 실천적 조언: ${res.primarySocraticAphorism.actionableDirective}`,
    `- 철학적 처방: ${res.socraticPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
