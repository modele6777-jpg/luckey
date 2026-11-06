/**
 * 명나라 양명학 왕양명(王陽明) 전습록(傳習錄) 치양지(致良知) & 지행합일(知行合一) 심학 엔진
 *
 * 명나라 유학자 왕양명(王陽明, 왕수인)의 《전습록(傳習錄)》 원전 기반.
 * 1. 심즉리(心卽理): 마음이 곧 이치이다. 마음 밖에서 사물의 이치를 구하려 하지 말라 (心外無理 心外無物).
 * 2. 치양지(致良知): 인간은 누구나 본래 옳고 그름을 직관하는 맑은 거울과 같은 '양지(良知)'를 지니고 있으니 이를 온전히 실현하라.
 * 3. 지행합일(知行合一): 앎은 행함의 시작이요 행함은 앎의 완성이다. 참으로 알면 반드시 행하게 된다.
 * 4. 사전마련(事上磨鍊): 정적인 명상에 머물지 않고 복잡한 현실의 일(事) 속에서 마음을 벼리고 단련해야 흔들리지 않는다.
 * 5. 파산중적이지(破山中賊易) 파심중적난(破心中賊難): 산속의 도적을 깨뜨리기는 쉬우나 마음속의 사사로운 도적을 깨뜨리기는 어렵다.
 *
 * @version LUCKEY-WANG-YANGMING-LIANGZHI-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const WANG_YANGMING_LIANGZHI_VERSION = 'LUCKEY-WANG-YANGMING-LIANGZHI-v1.0.0';

export interface XinxueStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  xinxuePrinciple: string;
  actionBlessing: string;
}

export interface WangYangmingXinxueResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  liangzhiIntuitionScore: number;     // 치양지(致良知) 본래직관 발현도
  zhiXingUnityPower: number;          // 지행합일(知行合一) 실천 행동력
  xinZhiLiMindCoreIntegrity: number;  // 심즉리(心卽理) 내면자성 확신도
  shiShangMoLianResilience: number;   // 사전마련(事上磨鍊) 현실단련 회복력
  baBenSaiYuanSelflessPurity: number; // 발본색원(拔本塞源) 사욕차단 청정도
  // 세부 명세
  activeXinxueStage: XinxueStage;
  primaryXinxueAphorism: {
    themeKo: string;
    hanjaClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  xinxuePhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type WangYangmingXinxueReport = WangYangmingXinxueResult;

const XINXUE_STAGES: XinxueStage[] = [
  {
    stageLevel: 1,
    stageNameHanja: '龍場頓悟 (용장돈오: 절망 속 내면 자각)',
    stageNameKo: '외적 조건이 무너진 극한의 상황에서 내면의 성인을 발견하는 각성 단계',
    xinxuePrinciple: '나의 본성만으로 족하거늘 어찌 밖에서 이치를 구하겠는가 (吾性自足 不假外求).',
    actionBlessing: '외부의 환경이나 타인의 인정에 구애받지 않고 내면의 양심과 지혜에 확고히 뿌리내림',
  },
  {
    stageLevel: 2,
    stageNameHanja: '破心中賊 (파심중적: 내면의 사욕 타파)',
    stageNameKo: '망설임과 두려움, 허영심이라는 마음의 도적을 단호하게 베어내는 결단 단계',
    xinxuePrinciple: '산속의 도적을 치는 것보다 내 마음속의 사사로운 욕심과 두려움을 깨뜨리는 것이 참된 승리다.',
    actionBlessing: '눈앞의 이익이나 체면에 연연하는 좀도둑 같은 마음을 걷어내고 순수한 초심을 회복함',
  },
  {
    stageLevel: 3,
    stageNameHanja: '知行合一 (지행합일: 앎과 행함의 일치)',
    stageNameKo: '생각만 굴리지 않고 즉각적인 실천으로 진정한 앎을 완성하는 행동 단계',
    xinxuePrinciple: '앎은 행함의 뜻이요 행함은 앎의 공부이다 (知是行之始 行是知之成).',
    actionableDirective: '머뭇거리며 계획만 세우지 말고 당장 할 수 있는 가장 작은 행동을 통해 현실을 변화시킴',
    actionBlessing: '지체 없이 행동에 착수하여 현실의 벽을 돌파하고 이론을 실전 역량으로 승화함',
  },
  {
    stageLevel: 4,
    stageNameHanja: '事上磨鍊 (사전마련: 실무 속 마음 연마)',
    stageNameKo: '소란스럽고 까다로운 일상 업무와 대인관계 속에서 마음의 칼날을 벼리는 단련 단계',
    xinxuePrinciple: '고요할 때만 맑고 일에 부딪히면 흔들리는 마음은 참된 공부가 아니다. 반드시 일 위에서 단련해야 한다.',
    actionBlessing: '어려운 사건이나 복잡한 갈등을 성가시게 여기지 않고 내면의 지혜를 단련하는 최고의 도장으로 삼음',
  },
  {
    stageLevel: 5,
    stageNameHanja: '致良知 (치양지: 천지만물과 하나 됨)',
    stageNameKo: '사사로운 나를 잊고 만물과 한 몸이 되어 거침없이 바른 뜻을 펼치는 완성 단계',
    xinxuePrinciple: '양지는 마음의 영명함(靈明)이니 천지만물과 감응하여 티끌만 한 어긋남도 없다.',
    actionBlessing: '나와 타인의 경계를 넘어 전체를 살리는 대자비와 탁월한 지혜로 세상을 이롭게 함',
  },
];

const XINXUE_APHORISMS = [
  {
    themeKo: '지행합일(知行合一) - 앎은 행함의 시작이요 행함은 앎의 완성이다',
    hanjaClassic: '知是行之始 行是知之成 未有知而不行者 知而不行 只是未知',
    coreEssence: '알면서도 행하지 않는 것은 아직 참으로 아는 것이 아닙니다. 진정한 지혜는 반드시 용기 있는 행동으로 증명됩니다.',
    actionableDirective: '이론이나 구상에만 머물며 망설이지 마십시오. 지금 가슴으로 옳다고 느끼는 바를 즉시 실천에 옮기십시오.',
  },
  {
    themeKo: '치양지(致良知) - 내면의 맑은 거울에 비추어 결단하라',
    hanjaClassic: '良知者 孟子所謂是非之心 人皆有之者也 此心何等明白 何等簡易',
    coreEssence: '양지란 복잡한 이론이 아니라 누구나 타고난 옳고 그름의 순수한 직관입니다. 마음의 거울을 닦으면 답은 이미 명백합니다.',
    actionableDirective: '복잡한 계산이나 남들의 눈치를 보지 말고, 양심이 가리키는 가장 바르고 정직한 길을 우직하게 선택하십시오.',
  },
  {
    themeKo: '사전마련(事上磨鍊) - 현실의 일 속에서 비로소 마음이 단련된다',
    hanjaClassic: '人須在事上磨 練做功夫 始得 若只靜坐 遇事便亂 終無長進',
    coreEssence: '조용한 방안에서 마음을 다잡는 것은 반쪽 공부입니다. 복잡하고 힘겨운 현실의 과제를 해결하면서 중심을 잃지 않아야 진짜 실력입니다.',
    actionableDirective: '골치 아픈 문제나 까다로운 인간관계를 피하지 마십시오. 그 현장이야말로 그대의 내면을 단련시키는 가장 훌륭한 시험대입니다.',
  },
  {
    themeKo: '심즉리(心卽理) - 진리는 바깥이 아니라 그대의 마음 안에 있다',
    hanjaClassic: '夫物理不外於吾心 外吾心而求物理 無物理矣',
    coreEssence: '답을 바깥의 조건이나 남에게서 찾으려 하지 마십시오. 문제의 본질과 해결의 열쇠는 이미 그대의 마음 중심에 온전히 갖추어져 있습니다.',
    actionableDirective: '타인의 평가나 결재에 휘둘려 스스로를 의심하지 말고, 내면의 깊은 확신과 주체성을 회복하십시오.',
  },
];

export function calculateWangYangmingXinxue(profile: UserProfile): WangYangmingXinxueResult {
  const seedString = (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'WangYangmingLiangzhiXinxue';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const liangzhiIntuitionScore = 62 + (absHash % 37);
  const zhiXingUnityPower = 60 + ((absHash >> 3) % 39);
  const xinZhiLiMindCoreIntegrity = 64 + ((absHash >> 6) % 35);
  const shiShangMoLianResilience = 58 + ((absHash >> 9) % 41);
  const baBenSaiYuanSelflessPurity = 56 + ((absHash >> 12) % 43);

  const stageIndex = (absHash >> 4) % XINXUE_STAGES.length;
  const aphorismIndex = (absHash >> 7) % XINXUE_APHORISMS.length;

  const activeXinxueStage = XINXUE_STAGES[stageIndex];
  const primaryXinxueAphorism = XINXUE_APHORISMS[aphorismIndex];

  const counselTitle = `왕양명 심학의 결단: ${activeXinxueStage.stageNameHanja}`;
  const philosophicalGuidance = `현재 상황에서 가장 긴요한 가르침은 '치양지(致良知)'와 '지행합일(知行合一)'입니다. ` +
    `복잡한 계산이나 남의 눈치를 보기보다 내면의 맑은 직관이 가리키는 바른길을 즉각 실천하십시오. ` +
    `${activeXinxueStage.actionBlessing}을 바탕으로 사전마련(事上磨鍊)하십시오. 일 속에서 마음을 단련할 때 어떤 장벽도 돌파할 수 있습니다.`;

  return {
    engineVersion: WANG_YANGMING_LIANGZHI_VERSION,
    calculatedAtKst: new Date().toISOString(),
    liangzhiIntuitionScore,
    zhiXingUnityPower,
    xinZhiLiMindCoreIntegrity,
    shiShangMoLianResilience,
    baBenSaiYuanSelflessPurity,
    activeXinxueStage,
    primaryXinxueAphorism,
    xinxuePhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatWangYangmingXinxuePrompt(res: WangYangmingXinxueResult): string {
  return [
    `【명나라 양명학 왕양명(王陽明) 치양지(致良知) & 지행합일(知行合一) 심학 지표】`,
    `- 치양지(致良知) 본래직관 발현도: ${res.liangzhiIntuitionScore}/100`,
    `- 지행합일(知行合一) 실천 행동력: ${res.zhiXingUnityPower}/100`,
    `- 심즉리(心卽理) 내면자성 확신도: ${res.xinZhiLiMindCoreIntegrity}/100`,
    `- 사전마련(事上磨鍊) 현실단련 회복력: ${res.shiShangMoLianResilience}/100`,
    `- 발본색원(拔本塞源) 사욕차단 청정도: ${res.baBenSaiYuanSelflessPurity}/100`,
    `- 현재 심학 수양 단계: ${res.activeXinxueStage.stageNameHanja} (${res.activeXinxueStage.stageNameKo})`,
    `- 핵심 심학 원리: ${res.activeXinxueStage.xinxuePrinciple}`,
    `- 전습록 핵심 경구: "${res.primaryXinxueAphorism.themeKo}" [${res.primaryXinxueAphorism.hanjaClassic}]`,
    `- 실천적 조언: ${res.primaryXinxueAphorism.actionableDirective}`,
    `- 철학적 처방: ${res.xinxuePhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
