/**
 * 고대 중국 도교 도홍경(陶弘景) 진고(眞誥) 상청파(上淸派) 24성도 & 존사(存思) 통령 엔진 (taoistShangqingTwentyFourSpiritsEngine.ts)
 *
 * 남북조시대 모산파(茅山派) 조사 도홍경의 《진고(眞誥)》 및 상청황정경(上淸黃庭經) 원전 기반:
 * 인체의 오장육부와 삼단전에 깃든 24진신(二十四眞神)을 내면으로 관조(존사·存思)하여
 * 탁한 사기(邪氣)를 몰아내고 신인합일(神人合一)의 통령(通靈) 상태에 이르는 도가 최고위 신비 체계.
 * 1. 상단전 니환궁 (泥丸宮) - 영적 직관과 의식의 각성 (자미원 성관 감응)
 * 2. 중단전 강궁 (絳宮) - 심장 신명과 감정의 조화 (적제 화덕 감응)
 * 3. 하단전 기해 (氣海) - 근본 정기(精氣)와 현실 실행 활력 (현무 수덕 감응)
 *
 * 내담자의 신체·정신·영혼 삼위일체 정화도와 사기 차폐율을 100% 결정론적으로 도출합니다.
 */

import type { UserProfile } from '../sharedState';

export const TAOIST_SHANGQING_TWENTY_FOUR_SPIRITS_ENGINE_VERSION = '2.4.0';

function formatShangqingKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface DantianEnergy {
  dantian: '상단전 니환궁(泥丸宮)' | '중단전 강궁(絳宮)' | '하단전 기해(氣海)';
  governingOrgan: string;
  energyLevel: number; // 0 ~ 100
  state: '충만(充滿)' | '원활(圓滑)' | '조율필요(需調)';
  spiritualRole: string;
}

export interface ShangqingTrueSpirit {
  id: string;
  nameKo: string;
  hanja: string;
  dantianAffinity: string;
  bodyDomain: string;
  functionDesc: string;
  contemplationMantra: string; // 존사(存思) 관조 비결
}

export interface TaoistShangqingTwentyFourSpiritsReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  shangqingAttunementScore: number; // 0 ~ 100 상청 통령 감응 지수
  spiritualShieldRate: number; // 0 ~ 100 사기 차폐 및 호신율 (%)
  threeDantians: {
    upperNiwan: DantianEnergy;
    middleJiangGong: DantianEnergy;
    lowerQihai: DantianEnergy;
  };
  activeTrueSpirit: ShangqingTrueSpirit;
  secondaryTrueSpirit: ShangqingTrueSpirit;
  zunsiPrescription: string; // 도홍경 진고 존사 개운 처방
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  shangqingSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    shangqingCrossAxis: string;
  };
}

const SHANGQING_SPIRITS_DEF: ShangqingTrueSpirit[] = [
  {
    id: 'spirit_niwan_emperor',
    nameKo: '니환태제군(泥丸太帝君)',
    hanja: '泥丸太帝君',
    dantianAffinity: '상단전 니환궁',
    bodyDomain: '뇌 및 백회혈(百會)',
    functionDesc: '만신(萬神)의 총지휘소로서 혼란한 잡념을 잠재우고 순수한 직관을 밝힘',
    contemplationMantra: '머리 정수리에 백색 광채가 어린 달을 관조하며 생각을 텅 비워라.',
  },
  {
    id: 'spirit_jiangong_red_child',
    nameKo: '강궁적영자(絳宮赤英子)',
    hanja: '絳宮赤英子',
    dantianAffinity: '중단전 강궁',
    bodyDomain: '심장 및 가슴 중심',
    functionDesc: '열정과 사랑, 도의적 양심을 관장하며 가슴 속 불안과 원망을 녹임',
    contemplationMantra: '가슴 한가운데 붉은 연꽃이 피어올라 온몸을 온기로 감싸는 것을 느껴라.',
  },
  {
    id: 'spirit_qihai_mystic_mother',
    nameKo: '기해현원모(氣海玄元母)',
    hanja: '氣海玄元母',
    dantianAffinity: '하단전 기해',
    bodyDomain: '배꼽 아래 하단전 및 신장',
    functionDesc: '선천의 원기를 저장하여 피로를 물리치고 굳건한 생명력을 지탱함',
    contemplationMantra: '하복부 깊은 곳에 황금빛 여의주가 회전하며 생명의 샘물이 솟음을 관조하라.',
  },
  {
    id: 'spirit_liver_green_dragon',
    nameKo: '간장청룡군(肝臟靑龍君)',
    hanja: '肝臟靑龍君',
    dantianAffinity: '중단전 조력',
    bodyDomain: '간 및 양 눈',
    functionDesc: '봄날의 새싹처럼 막힌 기운을 뚫고 새로운 기획과 도약의 활로를 개척함',
    contemplationMantra: '오른쪽 갈비뼈 안쪽에 푸른 청룡의 서기가 서려 시야가 맑아짐을 상상하라.',
  },
  {
    id: 'spirit_lung_white_tiger',
    nameKo: '폐장백호군(肺臟白虎君)',
    hanja: '肺臟白虎君',
    dantianAffinity: '상단전 조력',
    bodyDomain: '폐 및 호흡기',
    functionDesc: '가을의 서릿발처럼 단호하게 불필요한 인연과 나쁜 기운을 차단하고 수렴함',
    contemplationMantra: '가슴 양쪽에 서늘한 백옥의 기운이 내려앉아 숨결이 깊어짐을 관조하라.',
  },
];

export function calculateTaoistShangqingTwentyFourSpirits(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): TaoistShangqingTwentyFourSpiritsReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  let seed = 55555;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 43 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 31 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 13 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 19) % 1000003;

  const niwanLevel = 45 + ((seed * 7) % 52);
  const jiangongLevel = 45 + ((seed * 11) % 52);
  const qihaiLevel = 45 + ((seed * 13) % 52);

  const getDantianState = (lvl: number): DantianEnergy['state'] => {
    if (lvl >= 75) return '충만(充滿)';
    if (lvl >= 55) return '원활(圓滑)';
    return '조율필요(需調)';
  };

  const upperNiwan: DantianEnergy = {
    dantian: '상단전 니환궁(泥丸宮)',
    governingOrgan: '뇌수 및 백회혈',
    energyLevel: niwanLevel,
    state: getDantianState(niwanLevel),
    spiritualRole: '직관과 영적 통찰의 지휘소',
  };

  const middleJiangGong: DantianEnergy = {
    dantian: '중단전 강궁(絳宮)',
    governingOrgan: '심장 및 가슴 중심',
    energyLevel: jiangongLevel,
    state: getDantianState(jiangongLevel),
    spiritualRole: '감정 평정과 대인화합의 심덕',
  };

  const lowerQihai: DantianEnergy = {
    dantian: '하단전 기해(氣海)',
    governingOrgan: '하복부 및 신장 원기',
    energyLevel: qihaiLevel,
    state: getDantianState(qihaiLevel),
    spiritualRole: '선천 정기와 현실 실행의 근원',
  };

  const shangqingAttunementScore = Math.min(100, Math.max(35, Math.floor((niwanLevel + jiangongLevel + qihaiLevel) / 3)));
  const spiritualShieldRate = Math.min(100, Math.max(40, 50 + ((seed * 17) % 48)));

  const spiritIdx = seed % SHANGQING_SPIRITS_DEF.length;
  const activeTrueSpirit = SHANGQING_SPIRITS_DEF[spiritIdx];
  const secondaryTrueSpirit = SHANGQING_SPIRITS_DEF[(spiritIdx + 1) % SHANGQING_SPIRITS_DEF.length];

  const zunsiPrescription = `도홍경 《진고》의 가르침에 따라, 하루 일과 중 5분간 눈을 감고 ${activeTrueSpirit.nameKo}의 존사 비결("${activeTrueSpirit.contemplationMantra}")을 실행하십시오. ${activeTrueSpirit.dantianAffinity}에 빛이 모여 사기가 침범하지 못할 것입니다.`;
  const calculatedAtKst = formatShangqingKstTimestamp(now);
  const ritualAction = `[${activeTrueSpirit.nameKo} · ${activeTrueSpirit.dantianAffinity}] ${activeTrueSpirit.contemplationMantra}`;
  const reflectionFocus = `상청파 24진신(${activeTrueSpirit.nameKo}) — ${activeTrueSpirit.functionDesc}`;
  const reflectiveQuestion = question
    ? `"${question}"의 자리에서 ${activeTrueSpirit.nameKo}의 고요한 중심과 보조 ${secondaryTrueSpirit.nameKo}의 조력을 함께 세우려면, 지금 어떤 잡념부터 비워내겠습니까?`
    : `${activeTrueSpirit.dantianAffinity}의 기운을 밝히며 5분간 존사(存思)를 실천할 때, 오늘 마음속에서 가장 먼저 가라앉히고 싶은 소음은 무엇입니까?`;
  const interpretiveBoundary =
    '도홍경 《진고》 상청파 24진신과 삼단전 존사(存思) 상징은 내면의 집중과 정서적 평정을 돕기 위한 전통 관조 은유이며, 단정적 미래 예측이나 의학적·영적 처방을 대체하지 않습니다.';
  const shangqingCrossAxis = `[${activeTrueSpirit.nameKo}] × [${secondaryTrueSpirit.nameKo}] × [${upperNiwan.state}/${middleJiangGong.state}/${lowerQihai.state}] × [${activeTrueSpirit.dantianAffinity}]`;
  const shangqingSynthesisMatrix = {
    dominantTension: `상단전(${upperNiwan.state}) ↔ 중단전(${middleJiangGong.state}) ↔ 하단전(${lowerQihai.state})`,
    alignmentState: `주재 진신: ${activeTrueSpirit.nameKo} · 보조 교차: ${secondaryTrueSpirit.nameKo} (${activeTrueSpirit.dantianAffinity})`,
    integratedAction: `${activeTrueSpirit.contemplationMantra}${question ? ` [질문 맥락: ${question}]` : ''}`,
    shangqingCrossAxis,
  };

  return {
    engineVersion: TAOIST_SHANGQING_TWENTY_FOUR_SPIRITS_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    shangqingAttunementScore,
    spiritualShieldRate,
    threeDantians: {
      upperNiwan,
      middleJiangGong,
      lowerQihai,
    },
    activeTrueSpirit,
    secondaryTrueSpirit,
    zunsiPrescription,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    shangqingSynthesisMatrix,
  };
}

export function formatTaoistShangqingTwentyFourSpiritsPrompt(rep: TaoistShangqingTwentyFourSpiritsReport): string {
  const matrixLine = rep.shangqingSynthesisMatrix
    ? `\n· 상청 교차 매트릭스: 핵심 긴장(${rep.shangqingSynthesisMatrix.dominantTension}) · 조율 상태(${rep.shangqingSynthesisMatrix.alignmentState}) · 4중 교차 축(${rep.shangqingSynthesisMatrix.shangqingCrossAxis}) · 통합 실천(${rep.shangqingSynthesisMatrix.integratedAction})`
    : '';
  return `[고대 중국 도홍경(陶弘景) 진고(眞誥) 상청파(上淸派) 24성도 존사(存思) 통령 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | 기준 시각: ${rep.calculatedAtKst}
· 삼단전(三丹田) 영적 기운 밸런스:
  1) 상단전 니환궁 (직관/뇌): [${rep.threeDantians.upperNiwan.state}]
  2) 중단전 강궁 (정서/심장): [${rep.threeDantians.middleJiangGong.state}]
  3) 하단전 기해 (원기/신장): [${rep.threeDantians.lowerQihai.state}]
· 감응 주재 진신(眞神): ${rep.activeTrueSpirit.nameKo} (${rep.activeTrueSpirit.hanja})
  - 귀속 영역: ${rep.activeTrueSpirit.dantianAffinity} [부위: ${rep.activeTrueSpirit.bodyDomain}]
  - 신명 직능: ${rep.activeTrueSpirit.functionDesc}
  - 존사(存思) 관조 비결: "${rep.activeTrueSpirit.contemplationMantra}"
· 보조 교차 진신: ${rep.secondaryTrueSpirit.nameKo} (${rep.secondaryTrueSpirit.dantianAffinity})
· 도홍경 진고 현실 통령 처방: ${rep.zunsiPrescription}${matrixLine}
· 실천 의례: ${rep.ritualAction}
· 성찰 초점: ${rep.reflectionFocus}
· 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: ${rep.interpretiveBoundary}`;
}
