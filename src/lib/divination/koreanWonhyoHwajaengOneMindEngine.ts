/**
 * 신라 원효대사(元曉大師) 《십문화쟁론(十門和諍論)》 일심이문(一心二門) 화쟁(和諍) & 원융회통 무애 엔진
 *
 * LUCKEY-WONHYO-HWAJAENG-v1.0.0
 *
 * 7세기 통일신라 최고의 대승 성사이자 동아시아 불교 철학의 태두 원효대사(元曉大師, 617~686)의
 * 저술 《십문화쟁론(十門和諍論)》, 《대승기신론소(大乘起信論疏)》, 《금강삼매경론(金剛三昧經論)》에 기반한
 * 극단적 대립 초월, 원융회통(圓融會通), 무애(無碍) 절대 평화 결정론 엔진.
 *
 * [핵심 철학 및 수리 모델]
 * 1. 일심이문(一心二門):
 *    - 일심(一心): 모든 분별과 상대성이 녹아내리는 원초적 신성 근원.
 *    - 심진여문(心眞如門): 오염되지 않는 불변의 청정한 본래 마음 (절대적 평온, 0~100).
 *    - 심생멸문(心生滅門): 현실 세계의 끊임없는 변화와 인과, 창조적 현상계 (역동적 적응력, 0~100).
 * 2. 화쟁사상(和諍思想):
 *    - "開合이 自在하고 立破가 無碍하다" (열고 닫음이 자유롭고, 세우고 깨뜨림에 걸림이 없다).
 *    - 유(有)와 무(空), 긍정과 부정 등 대립하는 양극단을 종합하여 더 높은 차원의 진리로 회통시킴.
 * 3. 원융회통(圓融會通):
 *    - 좁은 견해의 집착을 깨뜨려(破執) 참된 이치를 드러내며(顯正), 모든 만법을 바다처럼 포용함.
 * 4. 무애행(無碍行):
 *    - "一切無碍人 一道出生死" (일체의 일에 걸림이 없는 사람은 단 하나의 길로 생사를 벗어난다).
 */

import type { UserProfile } from '../sharedState';

export const WONHYO_HWAJAENG_VERSION = '1.0.0';

export interface WonhyoHwajaengReport {
  engineVersion: string;
  calculatedAt: string;
  // 원효 화쟁 5대 심성 지표 (0~100)
  oneMindTwoGatesBalance: number; // 심진여문-심생멸문 일심 조화율
  hwajaengContradictionResolution: number; // 모순·갈등 초월 화쟁 해결력
  wonhyoMuAeFreedomScore: number; // 일체무애 무애행 영혼 자유도
  wonYungWheTongHarmonization: number; // 원융회통 만법 포용도
  innerJinYeoPurityIndex: number; // 심진여문(心眞如門) 본래 청정 심지
  // 핵심 화쟁 관문
  activeHwajaengGate: {
    gateNameKo: string;
    hanja: string;
    coreDharma: string;
    meditativeResolution: string;
  };
  wonhyoMasterDharmaWord: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const HWAJAENG_GATES = [
  {
    gateNameKo: '유공화쟁문 (有空和諍門)',
    hanja: '有空和諍門',
    coreDharma: '실체에 대한 집착(有)과 허무한 집착(空)을 동시에 털어내는 중도 실상',
    meditativeResolution: '현실의 성과에 들뜨지 않고, 실패에도 낙담하지 않는 진여의 평온을 회복합니다.'
  },
  {
    gateNameKo: '진망화쟁문 (眞妄和諍門)',
    hanja: '眞妄和諍門',
    coreDharma: '참된 본성과 헛된 번뇌가 본래 둘이 아니라는 동체대비의 지혜',
    meditativeResolution: '마음의 불안과 잡념을 억누르려 하지 말고, 파도 아래 고요한 바다를 바라보듯 관조하십시오.'
  },
  {
    gateNameKo: '입파무애문 (立破無碍門)',
    hanja: '立破無碍門',
    coreDharma: '자신의 주장을 고집스럽게 세우지도 않고, 타인의 의견을 섣불리 부수지도 않는 원융',
    meditativeResolution: '상대방과의 대립 속에서 양자 모두를 살리는 제3의 지혜로운 절충점을 발견합니다.'
  },
  {
    gateNameKo: '심원귀일문 (心源歸一門)',
    hanja: '心源歸一門',
    coreDharma: '천 갈래 만 갈래로 흩어진 생각의 물줄기를 하나의 본원 심천으로 회통시킴',
    meditativeResolution: '복잡한 문제의 겉가지만 붙잡지 말고, 문제의 가장 밑바닥에 놓인 단순한 본질로 회귀합니다.'
  },
  {
    gateNameKo: '무애생사문 (無碍生死門)',
    hanja: '無碍生死門',
    coreDharma: '두려움과 집착의 장벽을 부수고 걸림 없이 세상 한가운데로 뛰어드는 자비행',
    meditativeResolution: '실패에 대한 공포를 내려놓고 가벼운 발걸음으로 눈앞의 과업을 기쁘게 수행하십시오.'
  }
];

export function calculateWonhyoHwajaeng(profile: UserProfile | null | undefined): WonhyoHwajaengReport {
  const birthStr = profile?.basic?.birthdate || '1995-01-01';
  const nameStr = profile?.basic?.name || '내담자';
  const timeStr = profile?.basic?.birthtime || '12:00';

  const seed = djb2Hash(`${birthStr}_${nameStr}_${timeStr}_wonhyo_hwajaeng`);

  const oneMindTwoGatesBalance = 63 + (seed % 36);
  const hwajaengContradictionResolution = 65 + ((seed >> 2) % 34);
  const wonhyoMuAeFreedomScore = 60 + ((seed >> 4) % 39);
  const wonYungWheTongHarmonization = 62 + ((seed >> 6) % 37);
  const innerJinYeoPurityIndex = 58 + ((seed >> 8) % 41);

  const activeHwajaengGate = HWAJAENG_GATES[seed % HWAJAENG_GATES.length];

  let wonhyoMasterDharmaWord = '';
  if (wonhyoMuAeFreedomScore >= 85) {
    wonhyoMasterDharmaWord = '일체무애인(一切無碍人)의 기상이 가슴속에 차오르고 있습니다. 세상의 낡은 격식과 주변의 엇갈리는 시선에 매이지 않고 당신의 참된 길을 당당히 걸어갈 때, 마주치는 모든 난관이 저절로 풀립니다.';
  } else if (hwajaengContradictionResolution >= 80) {
    wonhyoMasterDharmaWord = '화쟁(和諍)의 지혜가 빛을 발하고 있습니다. 양립할 수 없어 보이던 두 가지 난제나 갈등 속에서, 양쪽을 하나로 품어 안는 창조적 회통의 해답이 곧 모습을 드러낼 것입니다.';
  } else {
    wonhyoMasterDharmaWord = '심진여문(心眞如門)의 맑은 거울을 닦으십시오. 현실의 번잡한 생멸 작용에 휘둘리지 말고, 고요히 한 호흡을 머금어 일심(一心)의 근원으로 돌아가면 모든 선택이 선명해집니다.';
  }

  return {
    engineVersion: WONHYO_HWAJAENG_VERSION,
    calculatedAt: new Date().toISOString(),
    oneMindTwoGatesBalance,
    hwajaengContradictionResolution,
    wonhyoMuAeFreedomScore,
    wonYungWheTongHarmonization,
    innerJinYeoPurityIndex,
    activeHwajaengGate,
    wonhyoMasterDharmaWord
  };
}

export function formatWonhyoHwajaengPrompt(report: WonhyoHwajaengReport): string {
  return `### 신라 원효대사 《십문화쟁론》 일심이문 & 화쟁 원융회통 엔진 (v${report.engineVersion})
- **주요 화쟁 관문**: ${report.activeHwajaengGate.gateNameKo} (${report.activeHwajaengGate.coreDharma})
  - *회통 명상 처방*: ${report.activeHwajaengGate.meditativeResolution}
- **원효 화쟁 5대 심성 지표**:
  - 심진여문-심생멸문 일심 조화율: ${report.oneMindTwoGatesBalance}점 / 100
  - 모순·갈등 초월 화쟁 해결력: ${report.hwajaengContradictionResolution}점 / 100
  - 일체무애(一切無碍) 영혼 자유도: ${report.wonhyoMuAeFreedomScore}점 / 100
  - 원융회통(圓融會通) 만법 포용도: ${report.wonYungWheTongHarmonization}점 / 100
  - 심진여문(心眞如門) 본래 청정 지수: ${report.innerJinYeoPurityIndex}점 / 100
- **원효 성사 법문 처방**:
  - "${report.wonhyoMasterDharmaWord}"`;
}
