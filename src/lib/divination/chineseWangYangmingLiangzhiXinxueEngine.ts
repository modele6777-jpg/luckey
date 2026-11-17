/**
 * 명나라 양명학 왕양명(王陽明) 전습록(傳習錄) 치양지(致良知) & 지행합일(知行合一) 심학 엔진
 *
 * 명나라 유학자 왕양명(王陽明, 왕수인)의 《전습록(傳習錄)》 원전 기반.
 *
 * @version LUCKEY-WANG-YANGMING-LIANGZHI-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const WANG_YANGMING_LIANGZHI_VERSION = 'LUCKEY-WANG-YANGMING-LIANGZHI-v2.1.0';

export interface XinxueStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  xinxuePrinciple: string;
  actionBlessing: string;
}

export interface YangmingSituationalXinxueAudit {
  themeKo: string;
  chuanxiluCitation: string;
  hanjaQuote: string;
  translationKo: string;
  innerThiefTrap: string;
  shiShangMoLianAction: string;
}

export interface YangmingTemporalLiangzhiRhythm {
  kstWindow: string;
  seasonalTone: string;
  xinxueFocus: '치양지(致良知)' | '지행합일(知行合一)' | '사전마련(事上磨鍊)' | '파심중적(破心中賊)';
  liangzhiClarityIndex: number;
  rhythmDirective: string;
}

export interface YangmingSynthesisMatrix {
  liangzhiClarity: number;
  zhiXingUnity: number;
  shiShangMoLianDepth: number;
  overallSynthesis: number;
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
  situationalXinxueAudit: YangmingSituationalXinxueAudit;
  temporalLiangzhiRhythm: YangmingTemporalLiangzhiRhythm;
  yangmingSynthesisMatrix: YangmingSynthesisMatrix;
  xinxuePhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
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

function buildSituationalXinxueAudit(question?: string): YangmingSituationalXinxueAudit {
  const q = (question ?? '').trim();
  if (/망설|미루|실행|행동|시작|결정/.test(q)) {
    return {
      themeKo: '지행합일(知行合一) 즉시 착수',
      chuanxiluCitation: '《전습록》 상권 · 서애록',
      hanjaQuote: '知是行之始 行是知之成 知而不行 只是未知',
      translationKo: '앎은 행함의 시작이요 행함은 앎의 완성이다. 알면서도 행하지 않는 것은 아직 참으로 알지 못한 것이다.',
      innerThiefTrap: '완벽한 준비가 끝날 때까지 미루는 것을 신중함으로 포장하는 마음의 도적.',
      shiShangMoLianAction: '오늘 머릿속으로 옳다고 알고 있는 일 중 가장 작은 첫 단추 1개를 지금 10분 안에 바로 실행하십시오.',
    };
  }
  if (/불안|두렵|눈치|체면|비교|질투/.test(q)) {
    return {
      themeKo: '파심중적(破心中賊) 내면 사욕 타파',
      chuanxiluCitation: '《전습록》 · 〈여양사색서〉',
      hanjaQuote: '破山中賊易 破心中賊難',
      translationKo: '산속의 도적을 깨뜨리기는 쉬우나, 마음속의 도적(두려움·사욕)을 깨뜨리기는 어렵다.',
      innerThiefTrap: '타인의 시선과 체면을 의식하느라 내 안의 맑은 양지(良知)의 목소리를 덮어 두는 일.',
      shiShangMoLianAction: '남이 어떻게 볼까 하는 계산을 한 줄 지우고, 내 양심이 떳떳하다고 여기는 선택 1가지만 남기십시오.',
    };
  }
  if (/일|업무|바쁘|갈등|스트레스|사람/.test(q)) {
    return {
      themeKo: '사전마련(事上磨鍊) 현장의 도장',
      chuanxiluCitation: '《전습록》 상권 · 육징록',
      hanjaQuote: '人須在事上磨 練做功夫 始得',
      translationKo: '사람은 모름지기 현실의 일(事) 위에서 마음을 갈고 닦아야 비로소 진짜 공부가 된다.',
      innerThiefTrap: '조용하고 편한 상황만 기다리며, 당면한 실무와 갈등을 회피하고 싶어 하는 안일함.',
      shiShangMoLianAction: '지금 가장 성가시게 느껴지는 일이나 대화 1건을 회피하지 말고 침착한 태도로 정면 처리하십시오.',
    };
  }
  return {
    themeKo: '치양지(致良知)와 심즉리(心卽理) 자족',
    chuanxiluCitation: '《전습록》 · 용장돈오(龍場頓悟)',
    hanjaQuote: '吾性自足 不假外求',
    translationKo: '나의 본성은 이미 스스로 족하니, 굳이 바깥에서 빌려 구할 필요가 없다.',
    innerThiefTrap: '해답이 외부의 거창한 조건에만 있다고 믿어 내 안의 판단력을 의심하는 의존심.',
    shiShangMoLianAction: '바깥의 소음을 잠시 끄고, 지금 내가 진심으로 옳다고 느끼는 방향 한 가지를 믿고 밀고 나가십시오.',
  };
}

function buildTemporalLiangzhiRhythm(now?: Date): YangmingTemporalLiangzhiRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 치양지(致良知)의 생동하는 직관으로 새 일을 여는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 분주한 실무 속에서 사전마련(事上磨鍊)의 중심을 다지는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 파심중적(破心中賊)의 결단으로 허영과 군더더기를 베어내는 계절'
          : '겨울 — 용장돈오(龍場頓悟)처럼 고요히 내면의 자족함을 확인하는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '오전 치양지(致良知) 맑은 거울 창',
      seasonalTone,
      xinxueFocus: '치양지(致良知)',
      liangzhiClarityIndex: 92,
      rhythmDirective: '마음의 거울이 가장 맑은 오전입니다. 양지가 가리키는 바른 방향을 먼저 정하고 미루지 마십시오.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '한낮 사전마련(事上磨鍊)·지행합일 창',
      seasonalTone,
      xinxueFocus: '사전마련(事上磨鍊)',
      liangzhiClarityIndex: 85,
      rhythmDirective: '크고 작은 실무와 사람이 부딪히는 낮 시간입니다. 바로 그 현장 위에서 마음을 단련하십시오.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 지행합일(知行合一) 매듭 창',
      seasonalTone,
      xinxueFocus: '지행합일(知行合一)',
      liangzhiClarityIndex: 83,
      rhythmDirective: '오늘 알고도 미룬 작은 실천 1가지를 행동으로 마무리 지어 앎과 행함을 일치시킬 시간입니다.',
    };
  }
  return {
    kstWindow: '심야 파심중적(破心中賊) 내면 정돈 창',
    seasonalTone,
    xinxueFocus: '파심중적(破心中賊)',
    liangzhiClarityIndex: 79,
    rhythmDirective: '밤에 올라오는 불필요한 후회와 허영이라는 마음의 도적을 비추어 보고 고요히 내려놓으십시오.',
  };
}

export function calculateWangYangmingXinxue(
  profile: UserProfile,
  question?: string,
  now?: Date,
): WangYangmingXinxueResult {
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
  const situationalXinxueAudit = buildSituationalXinxueAudit(question);
  const temporalLiangzhiRhythm = buildTemporalLiangzhiRhythm(now);

  const liangzhiClarity = Math.min(99, Math.round((liangzhiIntuitionScore + xinZhiLiMindCoreIntegrity) / 2));
  const zhiXingUnity = Math.min(99, Math.round((zhiXingUnityPower + temporalLiangzhiRhythm.liangzhiClarityIndex) / 2));
  const shiShangMoLianDepth = Math.min(99, Math.round((shiShangMoLianResilience + baBenSaiYuanSelflessPurity) / 2));
  const overallSynthesis = Math.round((liangzhiClarity + zhiXingUnity + shiShangMoLianDepth) / 3);

  const yangmingSynthesisMatrix: YangmingSynthesisMatrix = {
    liangzhiClarity,
    zhiXingUnity,
    shiShangMoLianDepth,
    overallSynthesis,
  };

  const counselTitle = `왕양명 심학의 결단: ${activeXinxueStage.stageNameHanja}`;
  const philosophicalGuidance = `현재 상황에서 가장 긴요한 가르침은 '치양지(致良知)'와 '지행합일(知行合一)'입니다. ` +
    `복잡한 계산이나 남의 눈치를 보기보다 내면의 맑은 직관이 가리키는 바른길을 즉각 실천하십시오. ` +
    `${activeXinxueStage.actionBlessing}을 바탕으로 사전마련(事上磨鍊)하십시오. 일 속에서 마음을 단련할 때 어떤 장벽도 돌파할 수 있습니다.`;

  const dailyPracticeRitual =
    `${situationalXinxueAudit.shiShangMoLianAction} (${temporalLiangzhiRhythm.rhythmDirective})`;
  const reflectiveQuestion =
    `지금 내 마음의 거울을 흐리는 심중적(心中賊)은 무엇이며, 앎과 행함을 하나로 묶는 오늘의 첫 걸음은 어디입니까?`;
  const interpretiveBoundary =
    '이 관점은 점수가 아니라 왕양명 《전습록》의 치양지·지행합일·사전마련 틀로 현재 질문의 실천 결을 비추는 상징적 성찰입니다.';

  return {
    engineVersion: WANG_YANGMING_LIANGZHI_VERSION,
    calculatedAtKst: (now ?? new Date()).toISOString(),
    liangzhiIntuitionScore,
    zhiXingUnityPower,
    xinZhiLiMindCoreIntegrity,
    shiShangMoLianResilience,
    baBenSaiYuanSelflessPurity,
    activeXinxueStage,
    primaryXinxueAphorism,
    situationalXinxueAudit,
    temporalLiangzhiRhythm,
    yangmingSynthesisMatrix,
    xinxuePhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

function describeYangmingStage(score: number): string {
  if (score >= 88) return '영명 발현(티끌 없이 맑게 비추는 결)';
  if (score >= 76) return '사전마련(일 속에서 단련되는 흐름)';
  return '심중적 성찰(마음의 도적을 가려내는 단계)';
}

export function formatWangYangmingXinxuePrompt(res: WangYangmingXinxueResult): string {
  return [
    `【명나라 양명학 왕양명(王陽明) 치양지(致良知) & 지행합일(知行合一) 심학 성찰 (${res.engineVersion})】`,
    `- 치양지(致良知) 본래직관: ${describeYangmingStage(res.liangzhiIntuitionScore)}`,
    `- 지행합일(知行合一) 실천 결: ${describeYangmingStage(res.zhiXingUnityPower)}`,
    `- 심즉리(心卽理) 내면자성: ${describeYangmingStage(res.xinZhiLiMindCoreIntegrity)}`,
    `- 사전마련(事上磨鍊) 단련: ${describeYangmingStage(res.shiShangMoLianResilience)}`,
    `- 발본색원(拔本塞源) 청정: ${describeYangmingStage(res.baBenSaiYuanSelflessPurity)}`,
    `- 현재 심학 수양 단계: ${res.activeXinxueStage.stageNameHanja} (${res.activeXinxueStage.stageNameKo})`,
    `- 질문 맥락 심학 처방 (${res.situationalXinxueAudit.themeKo} · ${res.situationalXinxueAudit.chuanxiluCitation}): "${res.situationalXinxueAudit.translationKo}" [${res.situationalXinxueAudit.hanjaQuote}]`,
    `- 마음의 도적(心中賊): ${res.situationalXinxueAudit.innerThiefTrap}`,
    `- 일일 사전마련 의례: ${res.dailyPracticeRitual}`,
    `- KST 양지 리듬: ${res.temporalLiangzhiRhythm.kstWindow} (${res.temporalLiangzhiRhythm.xinxueFocus}, ${res.temporalLiangzhiRhythm.seasonalTone}, 명료 결: ${describeYangmingStage(res.temporalLiangzhiRhythm.liangzhiClarityIndex)})`,
    `- 양명학 매트릭스(조화 흐름): 양지 명료 [${describeYangmingStage(res.yangmingSynthesisMatrix.liangzhiClarity)}] / 지행 합일 [${describeYangmingStage(res.yangmingSynthesisMatrix.zhiXingUnity)}] / 사전마련 [${describeYangmingStage(res.yangmingSynthesisMatrix.shiShangMoLianDepth)}]`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 철학적 처방: ${res.xinxuePhilosophicalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
