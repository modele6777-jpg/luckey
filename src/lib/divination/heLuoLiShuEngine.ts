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
 */

import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju, SajuAnalysisResult } from '../sajuAnalysis';
import { hexagram } from './iching';
import type { HexagramView } from './ichingMasterEngine';

export const HELUOLISHU_ENGINE_VERSION = 'LUCKEY-HL-v1.0.0';

export const HELUOLISHU_METHOD =
  '하락이수(河洛理數) 정통 상수역학 산법: 사주 8자 하도낙서 천수(25)·지수(30) 치환, 선천본괘(先天本卦)·원당효(元堂爻)·후천변괘(後天變卦) 결정론적 산출 및 청년/장년 2대 인생 주기 지수 산출';

export interface HeLuoHexagram {
  number: number;
  name: string;
  upper: string;
  lower: string;
  period: string; // '청년기 (출생~30세)' or '장년/완성기 (30세 이후)'
  coreMeaning: string;
}

export interface HeLuoLiShuResult {
  engineVersion: string;
  method: string;
  status: 'calculated';
  heavenNumber: number; // 천수 (天數)
  earthNumber: number; // 지수 (地數)
  innateHexagram: HeLuoHexagram; // 선천괘 (先天卦)
  yuanTangYao: number; // 원당효 (元堂爻 1~6)
  yuanTangMeaning: string; // 원당효 해설
  acquiredHexagram: HeLuoHexagram; // 후천괘 (後天卦)
  lifeCycleBalance: {
    earlyLifeScore: number; // 0 ~ 100
    matureLifeScore: number; // 0 ~ 100
    goldenEra: '청년기 선천 주도형' | '장년기 후천 대도약형' | '평생 지속 성장형';
  };
  masterStrategicGuidance: string;
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

/**
 * 사주 8자로부터 하락이수 선천괘·후천괘·원당효 정밀 산출
 */
export function calculateHeLuoLiShu(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
}): HeLuoLiShuResult {
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const p = saju.pillars;
  const pillars = [p.year, p.month, p.day, p.hour].filter(Boolean);
  let heavenSum = 0; // 홀수(기수) 합
  let earthSum = 0; // 짝수(우수) 합

  pillars.forEach((pillar) => {
    if (!pillar) return;
    const sChar = pillar.stem.char;
    const bChar = pillar.branch.char;
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

  return {
    engineVersion: HELUOLISHU_ENGINE_VERSION,
    method: HELUOLISHU_METHOD,
    status: 'calculated',
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
  };
}

/**
 * 프롬프트 주입용 마스터 포맷터
 */
export function formatHeLuoLiShuPrompt(res: HeLuoLiShuResult): string {
  return `[하락이수(河洛理數) 사주·주역 융합 선천괘·후천괘·원당효 리포트 (엔진: ${res.engineVersion})]
- 상수 계산: 사주 하도낙서 천수(天數) ${res.heavenNumber} / 지수(地數) ${res.earthNumber}
- 선천본괘(先天本卦 / 출생~30세 청년기): ${res.innateHexagram.name} (${res.innateHexagram.upper} 상 / ${res.innateHexagram.lower} 하)
  • 의미: ${res.innateHexagram.coreMeaning} (청년기 활력 스코어: ${res.lifeCycleBalance.earlyLifeScore}점)
- 원당효(元堂爻 / 영혼의 핵심 소명 효): 제${res.yuanTangYao}효
  • 원당효 해설: ${res.yuanTangMeaning}
- 후천변괘(後天變卦 / 30세 이후 장년·완성기): ${res.acquiredHexagram.name} (${res.acquiredHexagram.upper} 상 / ${res.acquiredHexagram.lower} 하)
  • 의미: ${res.acquiredHexagram.coreMeaning} (장년기 도약 스코어: ${res.lifeCycleBalance.matureLifeScore}점)
- 인생 주기 황금기: ${res.lifeCycleBalance.goldenEra}
- 마스터 거시 전략: "${res.masterStrategicGuidance}"
※ 루시 지침: 하락이수는 사주 8자가 주역 64괘의 대하드라마로 치환되는 동양 최고봉 수리 명학입니다. 청년기(선천)의 기본 바탕과 30세 이후(후천)의 대성공 괘상, 그리고 평생의 소명이 담긴 원당효를 입체적으로 해설해 주세요.`;
}
