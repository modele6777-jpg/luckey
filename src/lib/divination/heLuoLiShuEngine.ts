/**
 * =========================================================================
 * LUCKEY 하락이수(河洛理數) 사주·주역 융합 선천괘·후천괘·원당효 마스터 엔진
 * (He Luo Li Shu Bazi-I Ching Synthesis Innate & Acquired Hexagram Master Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. 북송 소강절(邵康節) 선생의 동양 상수역학 최고봉 비전인 하락이수(河洛理數)를
 *    LLM 환각 없이 100% 순수 수리 산법으로 사주 8자로부터 결정론적으로 도출한다.
 *
 * 2. 천수(天數)와 지수(地數)의 하도낙서 수리 변환:
 *    - 사주 천간·지지 정통 상수(천간 갑기9 을경8 병신7 정임6 무계5 / 지지 자오9 축미8 인신7 묘유6 진술5 사해4)
 *    - 천수 합계(기수: 1,3,5,7,9의 총합 25 기준 감산)
 *    - 지수 합계(우수: 2,4,6,8,10의 총합 30 기준 감산)
 *
 * 3. 인생의 2대 대주기 괘상:
 *    - 선천괘(先天卦): 출생부터 30세까지 청년기 소명과 본질적 운명 궤적
 *    - 원당효(元堂爻): 선천괘 6개 효 중 자신의 핵심 명운이 자리잡은 중심 효 (1~6효)
 *    - 후천괘(後天卦): 30세 이후 인생 후반기 사회적 완성 및 대도약의 괘상
 *
 * 4. 사주와 주역의 완벽한 융합:
 *    사주의 4주 8자가 어떤 주역 괘상으로 치환되는지 0ms로 정밀 해석.
 *
 * 5. [v1.7.398 고도화]:
 *    - 천수·지수 기수/우수 밸런스 및 하도낙서 음양 조화 지표(yinYangBalance)
 *    - 원당효(元堂爻) 당위(當位)·응비(應比) 적합도 및 심층 역량 지수(yuanTangDetail)
 *    - 10년 단위 생애 대운별 주역 궤적(decadeTrajectory: 20대~60대+)
 *    - 인생 전·후반전 질적 비약을 완성하는 핵심 개운 전략(lifeTransitionKey)
 */

import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju, SajuAnalysisResult } from '../sajuAnalysis';
import { hexagram } from './iching';

export const HELUOLISHU_ENGINE_VERSION = 'LUCKEY-HL-v2.4.0';

export const HELUOLISHU_METHOD =
  '하락이수(河洛理數) 정통 상수역학 산법: 사주 8자 하도낙서 천수(25)·지수(30) 치환, 선천본괘(先天本卦)·원당효(元堂爻)·후천변괘(後天變卦) 결정론적 산출, 음양 밸런스·원당효 당위성·10년 대운 주역 궤적 및 청년/장년 2대 인생 주기 지수 산출';

export interface HeLuoHexagram {
  number: number;
  name: string;
  upper: string;
  lower: string;
  period: string; // '청년기 (출생~30세)' or '장년/완성기 (30세 이후)'
  coreMeaning: string;
}

export interface HeLuoYinYangBalance {
  yinYangRatio: string;
  yinYangBalanceIndex: number; // 0 ~ 100
  constitutionTrait: '양성 주도 추진형 (Dynamic Leader)' | '음성 내실 수성형 (Grounded Builder)' | '음양 중화 완벽조화형 (Harmonious Synthesizer)';
  balanceGuidance: string;
}

export interface HeLuoYuanTangDetail {
  positionType: '양위(陽位: 1·3·5효)' | '음위(陰位: 2·4·6효)';
  bitValue: '양효(陽爻)' | '음효(陰爻)';
  alignment: '정위당위(正位當位)' | '득중응비(得中應比)' | '유연변통(柔軟變通)';
  potencyScore: number; // 50 ~ 98
  vocationAdvice: string;
}

export interface HeLuoDecadeStage {
  stage: string;
  theme: string;
  advice: string;
}

export interface HeLuoLiShuResult {
  engineVersion: string;
  method: string;
  status: 'calculated';
  calculatedAtKst: string;
  heavenNumber: number; // 천수 (天數)
  earthNumber: number; // 지수 (地數)
  innateHexagram: HeLuoHexagram; // 선천괘 (先天卦)
  yuanTangYao: number; // 원당효 (元堂爻 1~6)
  yuanTangMeaning: string; // 원당효 해설
  acquiredHexagram: HeLuoHexagram; // 후천괘 (後天卦)
  lifeCycleBalance: {
    earlyLifeScore: number; // 0 ~ 100 (내부 호환용, 프롬프트 비노출)
    matureLifeScore: number; // 0 ~ 100 (내부 호환용, 프롬프트 비노출)
    goldenEra: '청년기 선천 주도형' | '장년기 후천 대도약형' | '평생 지속 성장형';
  };
  masterStrategicGuidance: string;
  yinYangBalance: HeLuoYinYangBalance;
  yuanTangDetail: HeLuoYuanTangDetail;
  decadeTrajectory: HeLuoDecadeStage[];
  situationalHeLuoAudit: {
    focusTheme: string;
    yuanTangApplication: string;
    transitionGuidance: string;
  };
  temporalHeLuoRhythm: {
    kstTimeLabel: string;
    hetuWatchWindow: string;
    seasonalLuoshuTone: string;
    temporalGuidance: string;
  };
  heLuoSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  heLuoCrossAxis: {
    hexagramTransition: string;
    yinYangHarmony: string;
    yuanTangAlignment: string;
  };
  lifeTransitionKey: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

// 천간 상수 (갑기9 을경8 병신7 정임6 무계5)
const STEM_NUMBERS: Record<string, number> = {
  '甲': 9, '己': 9, '乙': 8, '庚': 8, '丙': 7, '辛': 7, '丁': 6, '壬': 6, '戊': 5, '癸': 5,
};

// 지지 상수 (자오9 축미8 인신7 묘유6 진술5 사해4)
const BRANCH_NUMBERS: Record<string, number> = {
  '子': 9, '午': 9, '丑': 8, '未': 8, '寅': 7, '申': 7, '卯': 6, '酉': 6, '辰': 5, '戌': 5, '巳': 4, '亥': 4,
};

// 선천 8괘 비트 매핑 (건1, 태2, 이3, 진4, 손5, 감6, 간7, 곤8)
const TRIGRAM_BITS: Record<number, [number, number, number]> = {
  1: [1, 1, 1], // 건
  2: [1, 1, 0], // 태
  3: [1, 0, 1], // 이
  4: [1, 0, 0], // 진
  5: [0, 1, 1], // 손
  6: [0, 1, 0], // 감
  7: [0, 0, 1], // 간
  8: [0, 0, 0], // 곤
};

function getTemporalHeLuoRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const hetuWatchWindow =
    hour >= 5 && hour < 11
      ? '하도(河圖) 아침 생수창 — 천수의 밝은 기운으로 오늘의 원당 소명을 여는 시간'
      : hour >= 11 && hour < 17
        ? '낙서(洛書) 정오 운용창 — 변화하는 현실의 수리를 읽어 실무로 풀어내는 시간'
        : hour >= 17 && hour < 22
          ? '후천(後天) 황혼 조율창 — 오늘의 결과를 점검하고 음양의 균형을 맞추는 시간'
          : '선천(先天) 심야 귀장창 — 바깥의 수를 거두고 본래의 중심 효로 돌아가는 시간';

  const seasonalLuoshuTone =
    month >= 3 && month <= 5
      ? '봄 · 동방 3·8 목기(木氣) 발흥기 (새로운 시작과 확장의 상수)'
      : month >= 6 && month <= 8
        ? '여름 · 남방 2·7 화기(火氣) 발현기 (재능과 열정이 밖으로 빛나는 상수)'
        : month >= 9 && month <= 11
          ? '가을 · 서방 4·9 금기(金氣) 수렴기 (결실을 거두고 옥석을 가리는 상수)'
          : '겨울 · 북방 1·6 수기(水氣) 응축기 (지혜를 비축하고 내실을 다지는 상수)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
    hetuWatchWindow,
    seasonalLuoshuTone,
    temporalGuidance: `${hetuWatchWindow} · ${seasonalLuoshuTone}의 흐름에 맞추어 원당효의 중심을 지키십시오.`,
  };
}

/**
 * 사주 8자로부터 하락이수 선천괘·후천괘·원당효 정밀 산출
 */
export function calculateHeLuoLiShu(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  now?: Date;
  question?: string;
}): HeLuoLiShuResult {
  const now = params?.now || new Date();
  const question = (params?.question || '').trim();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const p = saju.pillars;
  const pillars = [p.year, p.month, p.day, p.hour].filter(Boolean);
  let heavenSum = 0; // 홀수(기수) 합
  let earthSum = 0; // 짝수(우수) 합

  pillars.forEach((pillar) => {
    if (!pillar) return;
    const sChar = pillar.gan;
    const bChar = pillar.zhi;
    const sNum = STEM_NUMBERS[sChar] || 7;
    const bNum = BRANCH_NUMBERS[bChar] || 6;

    if (sNum % 2 !== 0) heavenSum += sNum;
    else earthSum += sNum;

    if (bNum % 2 !== 0) heavenSum += bNum;
    else earthSum += bNum;
  });

  // 하락이수 천수 25, 지수 30 감산 규칙
  const hRem = (heavenSum % 25) || 25;
  const eRem = (earthSum % 30) || 30;

  // 선천 상괘/하괘
  const innateUpperNum = (hRem % 8) || 8;
  const innateLowerNum = (eRem % 8) || 8;

  const innateBits = [...TRIGRAM_BITS[innateLowerNum], ...TRIGRAM_BITS[innateUpperNum]];
  const innateGua = hexagram(innateBits);

  // 원당효 (元堂爻 1~6): 천수와 지수의 합을 6으로 나눈 나머지
  const yuanTangYao = ((heavenSum + earthSum) % 6) || 6;

  // 후천괘(後天卦): 원당효의 음양을 반전시키고, 상괘와 하괘의 체를 교환
  const acquiredLowerNum = (innateUpperNum % 8) || 8;
  const acquiredUpperNum = (innateLowerNum % 8) || 8;
  const rawAcquiredBits = [...TRIGRAM_BITS[acquiredLowerNum], ...TRIGRAM_BITS[acquiredUpperNum]];
  // 원당효 반전
  rawAcquiredBits[yuanTangYao - 1] = rawAcquiredBits[yuanTangYao - 1] === 1 ? 0 : 1;
  const acquiredGua = hexagram(rawAcquiredBits);

  const earlyScore = Math.min(100, Math.max(50, 60 + (innateUpperNum % 4) * 8 + (yuanTangYao % 3) * 5));
  const matureScore = Math.min(100, Math.max(55, 65 + (acquiredUpperNum % 4) * 7 + ((7 - yuanTangYao) % 3) * 6));

  let goldenEra: HeLuoLiShuResult['lifeCycleBalance']['goldenEra'] = '장년기 후천 대도약형';
  if (matureScore > earlyScore + 5) goldenEra = '장년기 후천 대도약형';
  else if (earlyScore > matureScore + 5) goldenEra = '청년기 선천 주도형';
  else goldenEra = '평생 지속 성장형';

  const yuanTangMeanings: Record<number, string> = {
    1: '초효(初爻) 원당: 시작 단계의 기초와 초심에 당신의 평생 소명이 있습니다. 탄탄한 밑바닥 다지기가 성공의 관건입니다.',
    2: '이효(二爻) 원당: 내면의 인격과 파트너십에 소명이 있습니다. 좋은 동료와 귀인을 만나 함께 성장할 때 크게 일어납니다.',
    3: '삼효(三爻) 원당: 고난을 돌파하는 강인한 추진력에 소명이 있습니다. 위기를 기회로 바꾸는 전환의 주인공입니다.',
    4: '사효(四爻) 원당: 기획과 참모, 중간 의사결정의 핵심 자리에 소명이 있습니다. 조직과 시스템을 재설계하는 능력이 탁월합니다.',
    5: '오효(五爻) 원당: 최고 리더십과 군왕의 자리에 소명이 있습니다. 당당히 주도권을 잡고 세상의 중심에서 비전을 펼치세요.',
    6: '상효(上爻) 원당: 원숙한 지혜와 다음 세대를 위한 멘토링에 소명이 있습니다. 성취 이후의 나눔과 명예가 당신을 빛냅니다.',
  };

  // 1. 천수·지수 음양 밸런스 지수 계산
  const totalNum = heavenSum + earthSum;
  const heavenRatio = Math.round((heavenSum / Math.max(1, totalNum)) * 100);
  const diff = Math.abs(heavenSum - earthSum);
  const yinYangBalanceIndex = Math.min(100, Math.max(40, 100 - diff * 2));

  let constitutionTrait: HeLuoYinYangBalance['constitutionTrait'] = '음양 중화 완벽조화형 (Harmonious Synthesizer)';
  let balanceGuidance = '천수와 지수의 음양이 완벽하게 균형을 이루어 이상과 현실 감각이 조화롭습니다.';

  if (heavenSum > earthSum + 8) {
    constitutionTrait = '양성 주도 추진형 (Dynamic Leader)';
    balanceGuidance = '천수(기수)의 양기가 강렬하여 비전을 제시하고 개척하는 능력이 탁월합니다. 현실 디테일과 체계 관리를 보완하면 무적입니다.';
  } else if (earthSum > heavenSum + 8) {
    constitutionTrait = '음성 내실 수성형 (Grounded Builder)';
    balanceGuidance = '지수(우수)의 음기가 두터워 신중하고 탄탄하게 내실을 축적하는 힘이 강력합니다. 때로는 과감한 결단과 속도전을 발동하세요.';
  }

  const yinYangBalance: HeLuoYinYangBalance = {
    yinYangRatio: `천수(양) ${heavenSum} : 지수(음) ${earthSum} (양기 비중 ${heavenRatio}%)`,
    yinYangBalanceIndex,
    constitutionTrait,
    balanceGuidance,
  };

  // 2. 원당효 당위(當位) 및 응비(應比) 심층 분석
  const isYangPosition = yuanTangYao === 1 || yuanTangYao === 3 || yuanTangYao === 5;
  const rawYuanTangBit = innateBits[yuanTangYao - 1]; // 1=양효, 0=음효
  const isYangBit = rawYuanTangBit === 1;

  let alignment: HeLuoYuanTangDetail['alignment'] = '유연변통(柔軟變通)';
  let potencyScore = 75;

  if ((isYangPosition && isYangBit) || (!isYangPosition && !isYangBit)) {
    alignment = '정위당위(正位當位)';
    potencyScore = 94;
  } else if (yuanTangYao === 2 || yuanTangYao === 5) {
    alignment = '득중응비(得中應比)';
    potencyScore = 90;
  } else {
    potencyScore = 80;
  }

  const yuanTangDetail: HeLuoYuanTangDetail = {
    positionType: isYangPosition ? '양위(陽位: 1·3·5효)' : '음위(陰位: 2·4·6효)',
    bitValue: isYangBit ? '양효(陽爻)' : '음효(陰爻)',
    alignment,
    potencyScore,
    vocationAdvice: `${yuanTangMeanings[yuanTangYao] || ''} (${alignment} - 잠재 역량 발휘도 ${potencyScore}점)`,
  };

  // 3. 생애 10년 단위 대운 주역 궤적
  const decadeTrajectory: HeLuoDecadeStage[] = [
    {
      stage: '20대 (청년 입신기)',
      theme: `선천본괘(${innateGua.name})의 기틀 구축`,
      advice: '기초 소양을 닦고 다양한 경험을 통해 타고난 본질적 역량을 체화하세요.',
    },
    {
      stage: '30대 (사회적 도약기)',
      theme: `원당 제${yuanTangYao}효의 잠재력 각성`,
      advice: '독립적인 전문성과 신뢰를 확립하고 인생의 주도적 영역을 개척하세요.',
    },
    {
      stage: '40대 (후천 전성기)',
      theme: `후천변괘(${acquiredGua.name})의 비약적 대약진`,
      advice: '30세 이후 열리는 후천의 기운을 타고 조직과 사회의 핵심 리더로 비상하세요.',
    },
    {
      stage: '50대 (원숙과 확장기)',
      theme: '영향력의 시스템화 및 가치 영속화',
      advice: '개인 성취를 넘어 동료와 후배를 위한 성장 발판을 마련하고 영향력을 공고히 하세요.',
    },
    {
      stage: '60대 이후 (명예와 완성기)',
      theme: '인생 주역 대원만 및 초연한 평정',
      advice: '축적된 지혜를 세상에 나눔으로써 삶의 최고봉 명예와 존엄한 결실을 누리세요.',
    },
  ];

  const lifeTransitionKey = `선천의 ${innateGua.name}으로 내실을 다진 후, 원당 제${yuanTangYao}효(${alignment})의 스위치를 켜서 후천의 ${acquiredGua.name}으로 도약하는 전인적 대도약 전략`;

  const temporalHeLuoRhythm = getTemporalHeLuoRhythm(now);
  const situationalHeLuoAudit = /직장|사업|이직|결정|진로|돈/.test(question)
    ? {
        focusTheme: `원당 제${yuanTangYao}효(${alignment}) 기반의 실무·커리어 도약`,
        yuanTangApplication: yuanTangMeanings[yuanTangYao] || yuanTangMeanings[5],
        transitionGuidance: `선천 ${innateGua.name}의 바탕 위에서 후천 ${acquiredGua.name}의 방향으로 판을 넓히십시오.`,
      }
    : /관계|연애|가족|사람|결혼/.test(question)
      ? {
          focusTheme: '천수·지수 음양 조화와 인연의 상호 보완',
          yuanTangApplication: yinYangBalance.balanceGuidance,
          transitionGuidance: '상대의 기질과 나의 음양 균형을 맞추어 무리 없는 호흡을 이어가십시오.',
        }
      : {
          focusTheme: `${goldenEra} 생애 주기와 원당효 소명의 조화`,
          yuanTangApplication: yuanTangMeanings[yuanTangYao] || yuanTangMeanings[5],
          transitionGuidance: lifeTransitionKey,
        };

  const heLuoSynthesisMatrix = {
    coreInsight: `선천 [${innateGua.name}] → 원당 제${yuanTangYao}효 → 후천 [${acquiredGua.name}]의 궤적이 ${situationalHeLuoAudit.focusTheme}을 비춥니다.`,
    recommendedAction: `선천의 ${innateGua.name}으로 내실을 다지고 원당 제${yuanTangYao}효의 소명을 실천해 후천의 ${acquiredGua.name}으로 나아가십시오.`,
    cautionNotice: '기수(천수)와 우수(지수) 중 한쪽으로만 치우쳐 조급하거나 지나치게 수동적이 되지 않도록 균형을 살피십시오.',
  };

  const reflectiveQuestion = question
    ? `‘${question}’ 앞에서 선천본괘 ${innateGua.name}의 바탕과 후천변괘 ${acquiredGua.name}의 방향을 연결할 원당 제${yuanTangYao}효의 첫 실천은 무엇입니까?`
    : `선천 ${innateGua.name}과 후천 ${acquiredGua.name}을 잇는 원당 제${yuanTangYao}효의 소명 중 지금 가장 먼저 깨워야 할 태도는 무엇입니까?`;

  const ritualAction = `[선천 ${innateGua.name} → 원당 제${yuanTangYao}효 → 후천 ${acquiredGua.name}] 오늘 15분 동안 원당효(${yuanTangDetail.alignment})의 소명을 기준으로 ${situationalHeLuoAudit.focusTheme}에 맞춘 첫 행동을 한 가지 실행하세요.`;
  const reflectionFocus = reflectiveQuestion;
  const heLuoCrossAxis = {
    hexagramTransition: `${innateGua.name} → 제${yuanTangYao}효 → ${acquiredGua.name}`,
    yinYangHarmony: `${yinYangBalance.constitutionTrait} (천수 ${heavenSum} / 지수 ${earthSum})`,
    yuanTangAlignment: `${yuanTangDetail.positionType} · ${yuanTangDetail.bitValue} · ${yuanTangDetail.alignment}`,
  };

  return {
    engineVersion: HELUOLISHU_ENGINE_VERSION,
    method: HELUOLISHU_METHOD,
    status: 'calculated',
    calculatedAtKst: temporalHeLuoRhythm.kstTimeLabel,
    heavenNumber: heavenSum,
    earthNumber: earthSum,
    innateHexagram: {
      number: innateGua.number,
      name: innateGua.name,
      upper: innateGua.upper,
      lower: innateGua.lower,
      period: '청년기 (출생~30세)',
      coreMeaning: `${innateGua.name} - 천성적 기질과 인생 전반전의 기본 바탕`,
    },
    yuanTangYao,
    yuanTangMeaning: yuanTangMeanings[yuanTangYao] || yuanTangMeanings[5],
    acquiredHexagram: {
      number: acquiredGua.number,
      name: acquiredGua.name,
      upper: acquiredGua.upper,
      lower: acquiredGua.lower,
      period: '장년/완성기 (30세 이후)',
      coreMeaning: `${acquiredGua.name} - 30세 이후 인생 후반전 대도약의 괘상`,
    },
    lifeCycleBalance: {
      earlyLifeScore: earlyScore,
      matureLifeScore: matureScore,
      goldenEra,
    },
    masterStrategicGuidance: `선천의 ${innateGua.name}으로 내실을 다지고, 원당 제${yuanTangYao}효의 소명을 완수하여, 30세 이후 후천의 ${acquiredGua.name}으로 인생의 비약적 대성공을 완성하세요. (${goldenEra})`,
    yinYangBalance,
    yuanTangDetail,
    decadeTrajectory,
    situationalHeLuoAudit,
    temporalHeLuoRhythm,
    heLuoSynthesisMatrix,
    heLuoCrossAxis,
    lifeTransitionKey,
    reflectiveQuestion,
    ritualAction,
    reflectionFocus,
    boundaryNotice: '본 결과는 하락이수 상수역학의 사주·주역 상징 치환 모델에 기반한 정성적 성찰 안내이며, 확정적 길흉 판정이 아닙니다.',
    interpretiveBoundary: '본 결과는 하락이수 상수역학의 사주·주역 상징 치환 모델에 기반한 정성적 성찰 안내이며, 확정적 길흉 판정이 아닙니다.',
  };
}

/**
 * 프롬프트 주입용 마스터 포맷터
 */
export function formatHeLuoLiShuPrompt(res: HeLuoLiShuResult): string {
  const dtStr = res.decadeTrajectory
    .map((d) => `  * ${d.stage}: ${d.theme} -> ${d.advice}`)
    .join('\n');

  return `[하락이수(河洛理數) 사주·주역 융합 선천괘·후천괘·원당효 리포트 (엔진: ${res.engineVersion})]
- 연산 시각: ${res.calculatedAtKst}
- 상수 계산: 사주 하도낙서 천수(天數) ${res.heavenNumber} / 지수(地數) ${res.earthNumber}
  • 음양 체질: ${res.yinYangBalance.constitutionTrait}
  • 조화 가이드: ${res.yinYangBalance.balanceGuidance}
- 선천본괘(先天本卦 / 출생~30세 청년기): ${res.innateHexagram.name} (${res.innateHexagram.upper} 상 / ${res.innateHexagram.lower} 하)
  • 의미: ${res.innateHexagram.coreMeaning}
- 원당효(元堂爻 / 영혼의 핵심 소명 효): 제${res.yuanTangYao}효 [${res.yuanTangDetail.positionType} ${res.yuanTangDetail.bitValue} / ${res.yuanTangDetail.alignment}]
  • 원당효 해설: ${res.yuanTangMeaning}
- 후천변괘(後天變卦 / 30세 이후 장년·완성기): ${res.acquiredHexagram.name} (${res.acquiredHexagram.upper} 상 / ${res.acquiredHexagram.lower} 하)
  • 의미: ${res.acquiredHexagram.coreMeaning}
- 인생 주기 황금기: ${res.lifeCycleBalance.goldenEra}
- 질문 맥락 감사 (${res.situationalHeLuoAudit.focusTheme}): ${res.situationalHeLuoAudit.transitionGuidance}
- KST 시공간 하도낙서 리듬: ${res.temporalHeLuoRhythm.hetuWatchWindow} / ${res.temporalHeLuoRhythm.seasonalLuoshuTone}
  • 시공간 지침: ${res.temporalHeLuoRhythm.temporalGuidance}
- 하락 교차 매트릭스: 핵심(${res.heLuoSynthesisMatrix.coreInsight}) | 실행(${res.heLuoSynthesisMatrix.recommendedAction}) | 주의(${res.heLuoSynthesisMatrix.cautionNotice})
- 하락 교차 축: 괘상 전이(${res.heLuoCrossAxis.hexagramTransition}) | 음양 조화(${res.heLuoCrossAxis.yinYangHarmony}) | 원당 정위(${res.heLuoCrossAxis.yuanTangAlignment})
- 생애 대운별 주역 궤적 (20대~60대+):
${dtStr}
- 대전환 핵심 비결: ${res.lifeTransitionKey}
- 마스터 거시 전략: "${res.masterStrategicGuidance}"
- 실천 의례(Ritual Action): ${res.ritualAction}
- 성찰 질문: ${res.reflectionFocus}
- 해석 경계: ${res.boundaryNotice}
※ 루시 지침: 하락이수는 사주 8자가 주역 64괘의 대하드라마로 치환되는 동양 최고봉 수리 명학입니다. 청년기(선천)의 기본 바탕과 30세 이후(후천)의 대성공 괘상, 그리고 평생의 소명이 담긴 원당효를 입체적으로 해설해 주세요.`;
}
