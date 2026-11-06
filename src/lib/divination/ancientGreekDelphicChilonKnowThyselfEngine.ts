/**
 * 고대 그리스 델포이 아폴론 신전 스파르타의 킬론(Chilon of Sparta) 자기성찰 & 절제 엔진
 *
 * 서기전 6세기 델포이 7현인 중 스파르타의 에포로스(Ephor) 킬론의 금석문 원전 기반.
 * 1. 델포이 아폴론 신전 정면에 새겨진 3대 불멸의 신탁 격언:
 *    - Gnothi Seauton (Γνῶθι σεαυτόν): "너 자신을 알라" — 인간의 유한성을 자각하고 분수를 지킴.
 *    - Meden Agan (Μηδὲν ἄγαν): "지나침이 없게 하라 (과유불급)" — 극단을 피하고 중용의 지혜를 실천함.
 *    - Engua Para D' Ate (Ἐγγύα, πάρα δ' ἄτα): "보증은 재앙의 시작이다" — 섣부른 장담과 무모한 책임을 경계함.
 * 2. 4대 스파르타적 덕목:
 *    - 라코닉 어법의 간결함(Laconic Brevity): 수다를 삼가고 말의 무게를 지킴.
 *    - 자기 절제와 감정 다스림(Emotional Temperance): 기쁨이나 분노에 휩쓸려 경솔해지지 않음.
 *    - 미래에 대한 경계심(Prudent Foresight): 평화로울 때 위기를 대비하고 교만을 꺾음.
 *    - 노인을 공경하고 법도를 지킴(Reverence for Order): 공동체의 오랜 지혜와 질서를 존중함.
 * 3. 7대 지혜의 품계 및 델포이 아폴론 성소 조언 산출
 *
 * @version LUCKEY-DELPHIC-CHILON-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const DELPHIC_CHILON_VERSION = 'LUCKEY-DELPHIC-CHILON-v1.0.0';

export interface DelphicSageStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  wisdomDomain: string;
  selfMasteryBlessing: string;
}

export interface DelphicChilonResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  gnothiSeautonSelfKnowledgeIndex: number; // 너 자신을 알라 자기 객관화 및 분수 자각도
  medenAganModerationEquilibrium: number; // 과유불급 중용 및 극단 회피력
  enguaPrudenceDiscretionForce: number; // 신중함 및 섣부른 장담 경계력
  laconicBrevityClarityScore: number; // 언어의 무게 및 간결한 결단력
  spartanEnduranceTemperancePower: number; // 스파르타적 인내와 내면 절제력
  // 세부 명세
  activeSageStage: DelphicSageStage;
  primaryDelphicMaxim: {
    maximTitleKo: string;
    greekAphorism: string;
    coreEssence: string;
    actionableDirective: string;
  };
  delphiTempleEpiphany: {
    sanctuarySceneTitle: string;
    philosophicWisdom: string;
  };
}

export type DelphicChilonReport = DelphicChilonResult;

const DELPHIC_STAGES: DelphicSageStage[] = [
  { stageLevel: 1, stageNameGreek: 'Sôphrosunê (완전한 지혜와 절제)', stageNameKo: '자기 자신을 온전히 다스리는 최고 현자', wisdomDomain: '어떤 격랑 속에서도 중심을 잃지 않는 절대적 평정심', selfMasteryBlessing: '내면의 빛으로 모든 편견과 착각을 투명하게 꿰뚫어 봄' },
  { stageLevel: 2, stageNameGreek: 'Ephoreia (엄정한 규율의 감시관)', stageNameKo: '원칙과 법도를 수호하는 스파르타 관료', wisdomDomain: '사사로운 감정에 흔들리지 않는 공정한 판단력', selfMasteryBlessing: '스스로에게 가장 엄격하여 타인에게 모범이 되는 위엄' },
  { stageLevel: 3, stageNameGreek: 'Metriopatheia (감정의 중용 조율자)', stageNameKo: '기쁨과 슬픔을 다스리는 중용관', wisdomDomain: '일희일비하지 않고 삶의 굴곡을 담담하게 받아들임', selfMasteryBlessing: '성공에도 오만하지 않고 실패에도 좌절하지 않는 끈기' },
  { stageLevel: 4, stageNameGreek: 'Lakônismos (간결한 언어의 달인)', stageNameKo: '말을 아끼고 행동으로 증명하는 실천관', wisdomDomain: '군더더기 없는 명확하고 묵직한 결단과 소통', selfMasteryBlessing: '침묵의 무게를 알고 꼭 필요한 순간에만 입을 여는 신중함' },
  { stageLevel: 5, stageNameGreek: 'Eulabeia (지혜로운 경계심의 파수꾼)', stageNameKo: '위기를 미리 감지하고 방비하는 경계관', wisdomDomain: '섣부른 낙관이나 맹세를 배격하고 안전판을 구축함', selfMasteryBlessing: '돌다리도 두들겨 보고 건너는 철저한 사전 대비' },
  { stageLevel: 6, stageNameGreek: 'Sunetheia (어른을 공경하는 예절관)', stageNameKo: '전통의 지혜를 겸손히 계승하는 수호자', wisdomDomain: '오랜 세월 검증된 공동체의 규범과 경험 존중', selfMasteryBlessing: '경솔한 혁신보다 검증된 안정성을 지키는 신의' },
  { stageLevel: 7, stageNameGreek: 'Neophutos (델포이 성소의 참배객)', stageNameKo: '자신의 부족함을 인정하고 배우는 초심자', wisdomDomain: '무지를 자각하고 참된 앎을 향해 나아가는 순례', selfMasteryBlessing: '아는 체하지 않고 솔직하게 묻고 배우는 겸허함' },
];

const DELPHIC_MAXIMS = [
  { maximTitleKo: '너 자신을 알라 (그노티 세아우톤)', greekAphorism: 'Γνῶθι σεαυτόν (Gnothi Seauton)', coreEssence: '나의 강점과 약점, 한계를 냉정하게 직시하고 분수를 지킴', actionableDirective: '남들의 시선이나 과장된 자의식을 내려놓고 현재 나의 참모습을 객관적으로 돌아보십시오.' },
  { maximTitleKo: '지나침이 없게 하라 (메덴 아간)', greekAphorism: 'Μηδὲν ἄγαν (Meden Agan)', coreEssence: '어떤 감정이나 욕망도 극단으로 치닫지 않도록 중용을 실천함', actionableDirective: '과도한 욕심, 지나친 걱정, 과한 표현을 삼가고 매사 알맞은 선에서 멈추십시오.' },
  { maximTitleKo: '섣부른 장담이나 보증을 서지 말라', greekAphorism: 'Ἐγγύα, πάρα δ\' ἄτα (Engua Para D\' Ate)', coreEssence: '지킬 수 없는 약속을 남발하지 않고 확실한 책임만을 짐', actionableDirective: '분위기에 휩쓸려 무리한 확답을 주지 말고 신중하게 조건을 따져 결단하십시오.' },
  { maximTitleKo: '혀를 다스리고 귀를 열어 지혜를 채우라', greekAphorism: 'Glôssês kratein (혀의 통제)', coreEssence: '말실수를 줄이고 타인의 말에 경청하여 통찰을 얻음', actionableDirective: '내 주장을 앞세우기보다 상대의 말을 끝까지 듣고 말 한마디를 신중히 고르십시오.' },
];

const DELPHIC_EPIPHANIES = [
  { sanctuarySceneTitle: '아폴론 신전 돌기둥에 새겨진 황금 문자', philosophicWisdom: '신은 인간에게 끝없는 영광을 요구하지 않으며, 다만 스스로가 신이 아님을 아는 겸손한 인간이기를 바란다.' },
  { sanctuarySceneTitle: '카스탈리아 영천에서 씻는 손과 마음', philosophicWisdom: '외부의 티끌을 씻는 것은 쉬우나 마음의 오만을 씻는 것은 어려우니, 매일 아침 거울 속의 영혼을 맑게 닦으라.' },
  { sanctuarySceneTitle: '파르나소스 산 정상에서 굽어보는 올리브 숲', philosophicWisdom: '높은 곳에 올랐을 때 비로소 세상이 얼마나 넓고 내가 얼마나 작은지 알게 되나니, 지혜는 항상 낮은 곳에 머문다.' },
  { sanctuarySceneTitle: '에포로스의 의자에 앉은 킬론의 침묵', philosophicWisdom: '천 마디 화려한 변명보다 한 줄기 정직한 행동이 백만 군사를 움직이는 가장 위대한 법률이다.' },
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

export function calculateDelphicChilon(profile?: UserProfile): DelphicChilonResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`DELPHIC-CHILON-${birthdate}-${birthtime}-${name}`);

  const gnothiSeautonSelfKnowledgeIndex = (seed % 41) + 60; // 60~100
  const medenAganModerationEquilibrium = ((seed >> 3) % 43) + 58; // 58~100
  const enguaPrudenceDiscretionForce = ((seed >> 5) % 39) + 62; // 62~100
  const laconicBrevityClarityScore = ((seed >> 7) % 45) + 55; // 55~99
  const spartanEnduranceTemperancePower = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % DELPHIC_STAGES.length;
  const activeSageStage = DELPHIC_STAGES[stageIdx];

  const maximIdx = (seed >> 4) % DELPHIC_MAXIMS.length;
  const primaryDelphicMaxim = DELPHIC_MAXIMS[maximIdx];

  const epiphanyIdx = (seed >> 6) % DELPHIC_EPIPHANIES.length;
  const delphiTempleEpiphany = DELPHIC_EPIPHANIES[epiphanyIdx];

  return {
    engineVersion: DELPHIC_CHILON_VERSION,
    calculatedAtKst: getKstDateString(),
    gnothiSeautonSelfKnowledgeIndex,
    medenAganModerationEquilibrium,
    enguaPrudenceDiscretionForce,
    laconicBrevityClarityScore,
    spartanEnduranceTemperancePower,
    activeSageStage,
    primaryDelphicMaxim,
    delphiTempleEpiphany,
  };
}

export function formatDelphicChilonPrompt(result: DelphicChilonResult): string {
  return `[🏛️ 델포이 아폴론 신전 7현인 《스파르타의 킬론(Chilon)》 자기성찰 & 절제 리포트]
- 엔진 버전: ${result.engineVersion}
- 너 자신을 알라 자기 객관화 및 분수 자각도: ${result.gnothiSeautonSelfKnowledgeIndex}%
- 과유불급 중용 및 극단 회피력: ${result.medenAganModerationEquilibrium}%
- 신중함 및 섣부른 장담 경계력: ${result.enguaPrudenceDiscretionForce}%
- 언어의 무게 및 간결한 결단력: ${result.laconicBrevityClarityScore}%
- 스파르타적 인내와 내면 절제력: ${result.spartanEnduranceTemperancePower}%
- 현행 현자 품계: **[${result.activeSageStage.stageNameKo} (${result.activeSageStage.stageNameGreek})]**
  → 관장 영역: ${result.activeSageStage.wisdomDomain}
  → 자기 통제 축복: ${result.activeSageStage.selfMasteryBlessing}
- 최우선 델포이 격언: **[${result.primaryDelphicMaxim.maximTitleKo} (${result.primaryDelphicMaxim.greekAphorism})]**
  → 핵심 본질: ${result.primaryDelphicMaxim.coreEssence}
  → 실천 지침: ${result.primaryDelphicMaxim.actionableDirective}
- 델포이 신전의 불멸의 신탁: 《${result.delphiTempleEpiphany.sanctuarySceneTitle}》
  → 철학적 불멸 지혜: "${result.delphiTempleEpiphany.philosophicWisdom}"`;
}
