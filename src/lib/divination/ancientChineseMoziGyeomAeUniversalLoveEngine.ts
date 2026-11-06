/**
 * 춘추전국시대 묵가(墨家) 묵자(墨子) 겸애교리(兼愛交利) & 비공절용(非攻節用) 실천 엔진
 *
 * 서기전 5세기 춘추전국시대 사상가 묵자(墨子)의 원전 기반.
 * 1. 겸상애 교상리(兼相愛 交相利): 차별 없는 사랑(겸애)과 서로에게 이로움을 주는 공존공영(교리)
 * 2. 비공(非攻): 부당한 침략과 무력 갈등을 철저히 막아내고 평화를 수호하는 방어 철학
 * 3. 절용(節用) 및 절장(節葬): 허례허식과 낭비를 없애고 본질과 실용에 집중함
 * 4. 상현(尙賢) 및 천지(天志): 신분을 초월한 능력주의 인재 등용과 하늘의 공평무사한 정의 실천
 *
 * @version LUCKEY-MOZI-GYEOM-AE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const MOZI_GYEOM_AE_VERSION = 'LUCKEY-MOZI-GYEOM-AE-v1.0.0';

export interface MohistStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  ethicalDomain: string;
  mohistVirtueBlessing: string;
}

export interface MoziGyeomAeResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  gyeomAeUniversalLoveScore: number; // 겸상애(兼相愛) 차별 없는 보편적 자비도
  gyoRiMutualBenefitIndex: number; // 교상리(交相利) 상호 번영 및 윈윈 협력 지수
  biGongPeaceShieldForce: number; // 비공(非攻) 무력 억제 및 철통 방어 수호력
  jeolYongSimplicityPurity: number; // 절용(節用) 허례허식 척결 및 실용 본질도
  tianZhiCosmicJusticeScore: number; // 천지(天志) 하늘의 공평무사한 정의 실천도
  // 세부 명세
  activeMohistStage: MohistStage;
  primaryMohistPrecept: {
    preceptTitleKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  moziFortressWisdom: {
    fortressTitle: string;
    strategicCounsel: string;
  };
}

export type MoziGyeomAeReport = MoziGyeomAeResult;

const MOHIST_STAGES: MohistStage[] = [
  { stageLevel: 1, stageNameHanja: '天志順應 (천지순응)', stageNameKo: '하늘의 공평무사한 정의를 삶의 나침반으로 삼는 경지', ethicalDomain: '사사로운 편견을 버리고 만인에게 이로운 보편적 선을 추구함', mohistVirtueBlessing: '공정함과 정의로움으로 모든 사람의 깊은 신뢰를 얻는 덕망' },
  { stageLevel: 2, stageNameHanja: '兼相愛 (겸상애)', stageNameKo: '남을 내 몸처럼 아끼고 차별 없이 포용하는 자비관', ethicalDomain: '배타적 울타리를 허물고 곤경에 처한 이들을 따뜻하게 보살핌', mohistVirtueBlessing: '편 가르기를 극복하고 거대한 연대와 화합을 이끌어내는 힘' },
  { stageLevel: 3, stageNameHanja: '交相利 (교상리)', stageNameKo: '나와 상대방이 함께 번영하는 호혜적 상생관', ethicalDomain: '일방적인 희생이나 착취 없이 지속 가능한 윈윈 구조를 만듦', mohistVirtueBlessing: '서로를 살리는 협력으로 공동의 결실을 풍요롭게 거두는 지혜' },
  { stageLevel: 4, stageNameHanja: '非攻守禦 (비공수어)', stageNameKo: '소모적 공격을 거두고 소중한 본질을 철통같이 지켜내는 수호관', ethicalDomain: '외부의 부당한 침해와 갈등을 예방하고 철저한 대비책을 세움', mohistVirtueBlessing: '위기를 사전에 차단하고 평화와 안전을 확고히 지키는 실력' },
  { stageLevel: 5, stageNameHanja: '節用躬行 (절용궁행)', stageNameKo: '불필요한 군더더기를 걷어내고 실천과 본질에 전념하는 청정관', ethicalDomain: '형식적인 낭비를 줄이고 실질적인 가치를 창출하는 데 몰입함', mohistVirtueBlessing: '소박하고 단단한 삶으로 군더더기 없이 소명을 완수하는 담대함' },
];

const MOHIST_PRECEPTS = [
  { preceptTitleKo: '남의 나라를 내 나라처럼, 남의 가족을 내 가족처럼 대하라', hanjaMotto: '視人之國 若視其國 視人之家 若視其家', coreEssence: '차별과 편견을 내려놓을 때 세상의 모든 전쟁과 반목이 사라집니다.', actionableDirective: '경쟁 상대를 적으로 규정하지 말고, 함께 세상을 가꾸는 동반자로 존중하십시오.' },
  { preceptTitleKo: '말로만 사랑하지 말고 구체적인 이익을 서로 나누라', hanjaMotto: '兼相愛 交相利', coreEssence: '실천 없는 말은 공허하며, 진정한 자비는 상대방의 삶을 실질적으로 이롭게 합니다.', actionableDirective: '추상적인 약속 대신 상대방에게 구체적으로 도움이 되는 행동과 혜택을 제공하십시오.' },
  { preceptTitleKo: '부당한 침략에는 단 한 치도 굴복하지 말고 평화를 지켜내라', hanjaMotto: '非攻以守', coreEssence: '남을 먼저 해치지 않되, 정의와 평화를 지키기 위한 방어 역량은 빈틈없이 갖추어야 합니다.', actionableDirective: '공격적인 분쟁은 피하되 원칙과 자신의 소중한 사람들을 지키는 대비는 철저히 하십시오.' },
  { preceptTitleKo: '쓸데없는 낭비를 줄이고 오직 백성의 쓸모에 충실하라', hanjaMotto: '去無用之費 聖王之道', coreEssence: '화려한 겉치레와 과시를 버리고 진정으로 가치 있는 곳에 자원을 집중하십시오.', actionableDirective: '비효율적인 절차와 불필요한 지출을 과감히 정리하고 본질적인 과업에 집중하십시오.' },
];

const FORTRESS_WISDOMS = [
  { fortressTitle: '송나라 성벽을 지켜낸 묵자의 모형 방어전', strategicCounsel: '상대방의 모든 공격 수단을 미리 파악하고 지혜로 막아내어 싸우지 않고도 적의 침략 의지를 꺾으십시오.' },
  { fortressTitle: '뒤꿈치가 닳도록 평화를 위해 달린 묵자의 발걸음', strategicCounsel: '자신의 안일함을 뒤로하고 이웃의 평화를 위해 헌신할 때, 역사는 당신의 이름을 빛나는 수호자로 기록할 것입니다.' },
  { fortressTitle: '군더더기를 깎아낸 수레바퀴의 단단함', strategicCounsel: '치장보다 견고함이 중요하니, 삶의 모든 영역에서 거품을 걷어내고 내실을 굳건히 다지십시오.' },
  { fortressTitle: '차별 없이 만물을 비추는 하늘의 태양', strategicCounsel: '사람의 외모나 신분으로 차별하지 않고 오직 성실함과 진실됨으로 사람을 대하면 천하가 당신과 함께할 것입니다.' },
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

export function calculateMoziGyeomAe(profile?: UserProfile): MoziGyeomAeResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`MOZI-GYEOM-AE-${birthdate}-${birthtime}-${name}`);

  const gyeomAeUniversalLoveScore = (seed % 41) + 60; // 60~100
  const gyoRiMutualBenefitIndex = ((seed >> 3) % 43) + 58; // 58~100
  const biGongPeaceShieldForce = ((seed >> 5) % 39) + 62; // 62~100
  const jeolYongSimplicityPurity = ((seed >> 7) % 45) + 55; // 55~99
  const tianZhiCosmicJusticeScore = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % MOHIST_STAGES.length;
  const activeMohistStage = MOHIST_STAGES[stageIdx];

  const preceptIdx = (seed >> 4) % MOHIST_PRECEPTS.length;
  const primaryMohistPrecept = MOHIST_PRECEPTS[preceptIdx];

  const wisdomIdx = (seed >> 6) % FORTRESS_WISDOMS.length;
  const moziFortressWisdom = FORTRESS_WISDOMS[wisdomIdx];

  return {
    engineVersion: MOZI_GYEOM_AE_VERSION,
    calculatedAtKst: getKstDateString(),
    gyeomAeUniversalLoveScore,
    gyoRiMutualBenefitIndex,
    biGongPeaceShieldForce,
    jeolYongSimplicityPurity,
    tianZhiCosmicJusticeScore,
    activeMohistStage,
    primaryMohistPrecept,
    moziFortressWisdom,
  };
}

export function formatMoziGyeomAePrompt(result: MoziGyeomAeResult): string {
  return `[🛡️ 춘추전국시대 묵가(墨家) 묵자(墨子) 겸애교리(兼愛交利) & 비공절용 실천 리포트]
- 엔진 버전: ${result.engineVersion}
- 겸상애(兼相愛) 차별 없는 보편적 자비도: ${result.gyeomAeUniversalLoveScore}%
- 교상리(交相利) 상호 번영 및 윈윈 협력 지수: ${result.gyoRiMutualBenefitIndex}%
- 비공(非攻) 무력 억제 및 철통 방어 수호력: ${result.biGongPeaceShieldForce}%
- 절용(節用) 허례허식 척결 및 실용 본질도: ${result.jeolYongSimplicityPurity}%
- 천지(天志) 하늘의 공평무사한 정의 실천도: ${result.tianZhiCosmicJusticeScore}%
- 현행 묵가적 도덕 지평: **[${result.activeMohistStage.stageNameKo} (${result.activeMohistStage.stageNameHanja})]**
  → 관장 영역: ${result.activeMohistStage.ethicalDomain}
  → 실천의 축복: ${result.activeMohistStage.mohistVirtueBlessing}
- 최우선 묵가 실천 계율: **[${result.primaryMohistPrecept.preceptTitleKo} (${result.primaryMohistPrecept.hanjaMotto})]**
  → 핵심 본질: ${result.primaryMohistPrecept.coreEssence}
  → 실천 지침: ${result.primaryMohistPrecept.actionableDirective}
- 묵자의 철옹성 지혜: 《${result.moziFortressWisdom.fortressTitle}》
  → 전략적 조언: "${result.moziFortressWisdom.strategicCounsel}"`;
}
