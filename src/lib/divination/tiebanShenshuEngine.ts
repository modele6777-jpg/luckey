/**
 * =========================================================================
 * LUCKEY 고대 중국 철판신수(鐵板神數) 천기운명 조식 & 태현수비학 엔진
 * (Tieban Shenshu & Tai Xuan Numerology Secret Clause Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 송나라 소강절(소옹)의 황극경세수(皇極經世數)와 한나라 양웅의 《태현경(太玄經)》,
 * 그리고 명·청대 철판도인(鐵板道人)의 비전으로 전승된 12,000개 운명 조문(條文).
 * 
 * 1. 태현수(太玄數)와 천간지지 납음 수리:
 *    - 甲己子午九, 乙庚丑未八, 丙辛寅申七, 丁壬卯酉六, 戊癸辰戌五, 巳亥四
 *    - 생년월일시 사주의 선천 기본수(Prime Stem-Branch Inherent Number) 도출.
 * 2. 괘기(卦氣) 변환과 철판 12,000 비전 조식(條式):
 *    - 건(乾1)·태(兌2)·이(離3)·진(震4)·손(巽5)·감(坎6)·간(艮7)·곤(坤8) 배합.
 *    - 4대 인생 비전 조식 도출:
 *      (1) 선천 본원 성정 조식 (Inherent Essence Clause)
 *      (2) 육친 인연 및 귀인 조식 (Affinity & Benefactor Clause)
 *      (3) 대운 행운 결단 조식 (Turning Point Clause)
 *      (4) 천기 심층 경책 조식 (Divine Wisdom & Caution Clause)
 * 3. 천기 조화 지수 (Tieban Heavenly Accord Index - 0 ~ 100)
 */

import type { UserProfile } from '../sharedState';

export const TIEBAN_SHENSHU_VERSION = 'LUCKEY-TIEBAN-SHENSHU-v1.0.0';

export interface TiebanClause {
  clauseNumber: number;          // 1 ~ 12,000 비전 조문 번호
  title: string;                 // 조문 제목
  classicalPoem: string;         // 한문 고전 시경구
  vernacularMeaning: string;     // 현대적 풀이 및 영적 함의
  actionableGuidance: string;    // 현실적 실천 조언
}

export interface TiebanReport {
  engineVersion: string;
  calculatedAt: string;
  inherentPrimeNumber: number;   // 선천 태현 기본수
  kuaName: string;               // 주재 괘명
  inherentClause: TiebanClause;  // 선천 본원 성정 조식
  affinityClause: TiebanClause;  // 육친 인연 및 귀인 조식
  timingClause: TiebanClause;    // 대운 행운 결단 조식
  wisdomClause: TiebanClause;    // 천기 심층 경책 조식
  heavenlyAccordIndex: number;   // 0 ~ 100 천기 조화 지수
}

const TAI_XUAN_STEM_MAP: Record<number, number> = {
  0: 9, // 甲
  1: 8, // 乙
  2: 7, // 丙
  3: 6, // 丁
  4: 5, // 戊
  5: 9, // 己
  6: 8, // 庚
  7: 7, // 辛
  8: 6, // 壬
  9: 5, // 癸
};

const TAI_XUAN_BRANCH_MAP: Record<number, number> = {
  0: 9, // 子
  1: 8, // 丑
  2: 7, // 寅
  3: 6, // 卯
  4: 5, // 辰
  5: 4, // 巳
  6: 9, // 午
  7: 8, // 未
  8: 7, // 申
  9: 6, // 酉
  10: 5, // 戌
  11: 4, // 亥
};

const EIGHT_TRIGRAMS = [
  '건위천(乾爲天)', '태위택(兌爲澤)', '이위화(離爲火)', '진위뢰(震爲雷)',
  '손위풍(巽爲風)', '감위수(坎爲水)', '간위산(艮爲山)', '곤위지(坤爲地)'
];

const INHERENT_CLAUSE_TEMPLATES = [
  {
    title: '청송영설(靑松迎雪) 선천 고절격',
    classicalPoem: '歲寒松柏立高嶺, 雪後春風自吐香',
    meaning: '모진 추위와 눈보라 속에서도 푸르름을 잃지 않는 고결한 품격으로, 시련 끝에 반드시 독보적 향기를 드러냅니다.',
    guidance: '주변의 번잡한 유혹에 흔들리지 말고 본래 지닌 고결한 원칙과 주관을 굳게 지키십시오.'
  },
  {
    title: '명주출해(明珠出海) 잠재광명격',
    classicalPoem: '海底明珠光萬丈, 一朝躍出耀乾坤',
    meaning: '깊은 바다 밑에서 오랜 세월 빛을 벼려온 영롱한 진주가 마침내 수면 위로 솟아올라 온 세상을 비춥니다.',
    guidance: '그동안 축적해온 보이지 않는 노력이 곧 세상의 인정을 받게 되니 자부심을 가지십시오.'
  },
  {
    title: '용등운해(龍騰雲海) 대기대성격',
    classicalPoem: '潛龍蓄勢待天時, 雲起雷鳴上九霄',
    meaning: '연못에 웅크려 힘을 기르던 용이 알맞은 비구름을 만나 우레와 함께 아홉 하늘 위로 날아오릅니다.',
    guidance: '초조하게 서두르기보다 때를 기다리는 인내심이 최대의 무기이며, 도래할 기회에 과감히 비상하십시오.'
  },
  {
    title: '춘풍화우(春風化雨) 덕성윤택격',
    classicalPoem: '潤物無聲隨春動, 萬里江山盡着花',
    meaning: '소리 없이 대지를 적시는 봄비처럼 부드러운 덕성으로 주변의 모든 사람과 환경을 풍요롭게 꽃피웁니다.',
    guidance: '강한 힘으로 밀어붙이기보다 따뜻한 포용력과 경청의 힘으로 사람들의 마음을 얻으십시오.'
  }
];

const AFFINITY_CLAUSE_TEMPLATES = [
  {
    title: '백마귀인(白馬貴人) 서방 조력격',
    classicalPoem: '西來白馬踏祥雲, 提攜引路遇知音',
    meaning: '서방 또는 금(金)의 기운을 품은 결단력 있는 귀인이 나타나 얽힌 실타래를 단숨에 풀어줍니다.',
    guidance: '논리적이고 명료한 조언을 건네는 동료나 멘토의 말에 귀를 기울이면 뜻밖의 돌파구가 열립니다.'
  },
  {
    title: '녹죽생화(綠竹生花) 지기상봉격',
    classicalPoem: '高山流水遇知己, 琴瑟和鳴永世安',
    meaning: '마음이 통하는 진정한 도반과 조력자를 만나 깊은 유대 속에서 안정을 찾게 됩니다.',
    guidance: '계산적인 거래 관계보다 영혼의 뜻을 공유할 수 있는 깊은 인연에 정성을 쏟으십시오.'
  },
  {
    title: '단봉내의(丹鳳來儀) 명덕화합격',
    classicalPoem: '丹鳳朝陽鳴盛世, 齊心協力建奇功',
    meaning: '빛나는 재능과 열정을 가진 파트너가 합류하여 서로의 약점을 완벽하게 보완하고 큰 성취를 이룹니다.',
    guidance: '혼자 모든 책임을 짊어지려 하지 말고 협업 파트너에게 과감하게 권한을 나누어주십시오.'
  }
];

const TIMING_CLAUSE_TEMPLATES = [
  {
    title: '추풍취산(秋風吹散) 환골탈태기',
    classicalPoem: '秋風一掃千林落, 獨留孤實映霜天',
    meaning: '가을바람이 쓸모없는 잎을 떨구듯 낡은 미련과 불필요한 군더더기가 자연스럽게 정리되고 알짜 결실만 남습니다.',
    guidance: '미련이 남는 과거의 방식을 미련 없이 정리하고 핵심 프로젝트에 모든 에너지를 집중하십시오.'
  },
  {
    title: '동도춘회(冬去春回) 운기소생기',
    classicalPoem: '寒冰漸化春水綠, 枯木逢時又發生',
    meaning: '얼어붙었던 강물이 녹아 흐르듯 막혔던 일들이 순차적으로 풀려나가며 새로운 생명력이 솟구칩니다.',
    guidance: '지금의 정체에 낙담하지 마십시오. 머지않아 추진력을 얻을 것이니 준비 운동을 게을리하지 마십시오.'
  },
  {
    title: '일취월장(日就月將) 급류도하운',
    classicalPoem: '乘風破浪三萬里, 直挂雲帆濟滄海',
    meaning: '바람을 타고 파도를 헤치며 질주하듯 모든 여건이 당신의 추진력에 날개를 달아주는 상승 국면입니다.',
    guidance: '의구심을 거두고 직관이 가리키는 방향으로 신속하고 대담하게 승부수를 띄우십시오.'
  }
];

const WISDOM_CLAUSE_TEMPLATES = [
  {
    title: '지족상족(知足常足) 내관수양훈',
    classicalPoem: '知足不辱知止安, 退步原來是向前',
    meaning: '만족할 줄 알면 굴욕이 없고 멈출 줄 알면 위태롭지 않으니, 한 걸음 물러서는 것이 진정한 전진입니다.',
    guidance: '욕심을 부려 무리하게 확장을 꾀하기보다 현재 가진 내실을 단단히 다지는 지혜가 필요합니다.'
  },
  {
    title: '적선여경(積善餘慶) 음덕무량훈',
    classicalPoem: '春種一粒粟, 秋收萬顆子, 陰德在天道',
    meaning: '남모르게 베푼 작은 배려와 성실함이 보이지 않는 하늘의 장부에 기록되어 결정적 순간 당신을 구원합니다.',
    guidance: '눈앞의 이익보다 장기적인 신뢰와 인덕을 쌓는 행동을 우선순위에 두십시오.'
  },
  {
    title: '허심화물(虛心化物) 원융무애훈',
    classicalPoem: '水善利萬物而不爭, 處衆人之所惡故幾於道',
    meaning: '물처럼 가장 낮은 곳으로 흐르며 다투지 않을 때, 어떠한 장애물도 당신의 길을 가로막지 못합니다.',
    guidance: '반발심이나 고집을 내려놓고 유연하게 상황의 흐름에 몸을 맡길 때 최상의 해결책이 드러납니다.'
  }
];

export function calculateTiebanShenshu(
  profile: UserProfile,
  options?: { contextText?: string }
): TiebanReport {
  let birthYear = 1990;
  let birthMonth = 6;
  let birthDay = 15;
  let birthHour = 12;

  if (profile.birthDate) {
    const parts = profile.birthDate.split('-').map(Number);
    if (parts.length >= 3 && !isNaN(parts[0])) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  if (profile.birthTime) {
    const tParts = profile.birthTime.split(':').map(Number);
    if (tParts.length >= 1 && !isNaN(tParts[0])) {
      birthHour = tParts[0];
    }
  }

  // 1. 태현수 기본수 계산
  const yearStemIdx = Math.abs(birthYear - 4) % 10;
  const yearBranchIdx = Math.abs(birthYear - 4) % 12;
  const monthStemIdx = (yearStemIdx * 2 + birthMonth) % 10;
  const monthBranchIdx = (birthMonth + 1) % 12;
  const dayBranchIdx = (birthDay + 3) % 12;
  const hourBranchIdx = Math.floor((birthHour + 1) / 2) % 12;

  const yStemVal = TAI_XUAN_STEM_MAP[yearStemIdx] || 7;
  const yBranchVal = TAI_XUAN_BRANCH_MAP[yearBranchIdx] || 7;
  const mStemVal = TAI_XUAN_STEM_MAP[monthStemIdx] || 6;
  const mBranchVal = TAI_XUAN_BRANCH_MAP[monthBranchIdx] || 6;
  const dBranchVal = TAI_XUAN_BRANCH_MAP[dayBranchIdx] || 8;
  const hBranchVal = TAI_XUAN_BRANCH_MAP[hourBranchIdx] || 5;

  const inherentPrimeNumber = (yStemVal * 9 + yBranchVal * 8 + mStemVal * 7 + mBranchVal * 6 + dBranchVal * 5 + hBranchVal * 4);
  const kuaIdx = (inherentPrimeNumber + birthMonth + birthDay) % EIGHT_TRIGRAMS.length;
  const kuaName = EIGHT_TRIGRAMS[kuaIdx];

  // 2. 조문 번호 산출 (1 ~ 12,000)
  const baseClauseNum = (inherentPrimeNumber * 23 + birthYear % 100 * 37 + birthDay * 19) % 11999 + 1;

  // 3. 4대 조식 매핑
  const inhTpl = INHERENT_CLAUSE_TEMPLATES[(baseClauseNum + 0) % INHERENT_CLAUSE_TEMPLATES.length];
  const affTpl = AFFINITY_CLAUSE_TEMPLATES[(baseClauseNum + 1) % AFFINITY_CLAUSE_TEMPLATES.length];
  const timTpl = TIMING_CLAUSE_TEMPLATES[(baseClauseNum + 2) % TIMING_CLAUSE_TEMPLATES.length];
  const wisTpl = WISDOM_CLAUSE_TEMPLATES[(baseClauseNum + 3) % WISDOM_CLAUSE_TEMPLATES.length];

  const inherentClause: TiebanClause = {
    clauseNumber: baseClauseNum,
    title: inhTpl.title,
    classicalPoem: inhTpl.classicalPoem,
    vernacularMeaning: inhTpl.meaning,
    actionableGuidance: inhTpl.guidance,
  };

  const affinityClause: TiebanClause = {
    clauseNumber: ((baseClauseNum + 3141) % 11999) + 1,
    title: affTpl.title,
    classicalPoem: affTpl.classicalPoem,
    vernacularMeaning: affTpl.meaning,
    actionableGuidance: affTpl.guidance,
  };

  const timingClause: TiebanClause = {
    clauseNumber: ((baseClauseNum + 6282) % 11999) + 1,
    title: timTpl.title,
    classicalPoem: timTpl.classicalPoem,
    vernacularMeaning: timTpl.meaning,
    actionableGuidance: timTpl.guidance,
  };

  const wisdomClause: TiebanClause = {
    clauseNumber: ((baseClauseNum + 9423) % 11999) + 1,
    title: wisTpl.title,
    classicalPoem: wisTpl.classicalPoem,
    vernacularMeaning: wisTpl.meaning,
    actionableGuidance: wisTpl.guidance,
  };

  // 4. 천기 조화 지수
  const heavenlyAccordIndex = Math.min(99, Math.max(62, Math.round(75 + (inherentPrimeNumber % 25) - 3)));

  return {
    engineVersion: TIEBAN_SHENSHU_VERSION,
    calculatedAt: new Date().toISOString(),
    inherentPrimeNumber,
    kuaName,
    inherentClause,
    affinityClause,
    timingClause,
    wisdomClause,
    heavenlyAccordIndex,
  };
}

export function formatTiebanShenshuPrompt(report: TiebanReport): string {
  return `[고대 중국 철판신수(鐵板神數) 천기운명 조식 & 태현수비학 엔진]
- 선천 태현 기본수: ${report.inherentPrimeNumber} / 주재 괘상: ${report.kuaName}
- 천기 조화 지수: ${report.heavenlyAccordIndex}점 (100점 만점)
1. 선천 본원 성정 조식 (제${report.inherentClause.clauseNumber}조):
   * 격국명: ${report.inherentClause.title}
   * 시경 원전: "${report.inherentClause.classicalPoem}"
   * 성정 함의: ${report.inherentClause.vernacularMeaning}
   * 행동 지침: ${report.inherentClause.actionableGuidance}
2. 육친 인연 및 귀인 조식 (제${report.affinityClause.clauseNumber}조):
   * 인연격: ${report.affinityClause.title}
   * 시경 원전: "${report.affinityClause.classicalPoem}"
   * 조력 양상: ${report.affinityClause.vernacularMeaning}
3. 대운 행운 결단 조식 (제${report.timingClause.clauseNumber}조):
   * 시기국면: ${report.timingClause.title}
   * 시경 원전: "${report.timingClause.classicalPoem}"
   * 타이밍 비결: ${report.timingClause.actionableGuidance}
4. 천기 심층 경책 조식 (제${report.wisdomClause.clauseNumber}조):
   * 경책명: ${report.wisdomClause.title}
   * 잠언 원전: "${report.wisdomClause.classicalPoem}"
   * 수양 지혜: ${report.wisdomClause.actionableGuidance}`;
}
